"""
Kingsford Metals — Backend API
FastAPI + MongoDB. Handles public quote/contact submissions and admin dashboard
gated behind Emergent Google OAuth.
"""
from __future__ import annotations

import asyncio
import base64
import logging
import os
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import List, Optional

import bcrypt
import httpx
from dotenv import load_dotenv
from fastapi import (
    APIRouter,
    Cookie,
    Depends,
    FastAPI,
    File,
    Form,
    Header,
    HTTPException,
    Request,
    Response,
    UploadFile,
    status,
)
from fastapi.responses import Response as FastAPIResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
ADMIN_EMAILS = {
    e.strip().lower()
    for e in os.environ.get("ADMIN_EMAILS", "alex@bernatsolutions.com").split(",")
    if e.strip()
}

MAX_FILE_MB = 15
MAX_FILES_PER_QUOTE = 8
MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024
ALLOWED_FILE_EXT = {
    ".pdf", ".dxf", ".dwg", ".step", ".stp", ".iges", ".igs",
    ".png", ".jpg", ".jpeg", ".webp", ".gif", ".zip", ".stl", ".x_t"
}

EMERGENT_SESSION_URL = (
    "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
)

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")

# In-memory brute-force tracker: {ip: [(ts, ...)]}
_LOGIN_ATTEMPTS: dict[str, list[float]] = {}
_LOGIN_MAX = 5
_LOGIN_WINDOW = 900  # 15 min

# --- Emergent-managed Resend email (transactional notifications) -----------
EMAIL_BASE_URL = "https://integrations.emergentagent.com"  # constant, survives deploy
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Kingsford Metals")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "alex@bernatsolutions.com")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="Kingsford Metals API")
api = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("bernat")


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class QuoteFile(BaseModel):
    file_id: str
    filename: str
    content_type: str
    size: int


class QuoteOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    quote_id: str
    name: str
    company: str
    email: str
    phone: str
    postcode: Optional[str] = None
    lead_time: Optional[str] = None
    material: Optional[str] = None
    thickness: Optional[str] = None
    quantity: Optional[str] = None
    processes: List[str] = Field(default_factory=list)
    notes: Optional[str] = None
    files: List[QuoteFile] = Field(default_factory=list)
    consent: bool = False
    status: str = "new"
    source_ip: Optional[str] = None
    honeypot: Optional[str] = None
    created_at: datetime


class QuoteStatusUpdate(BaseModel):
    status: str


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    message: str
    honeypot: Optional[str] = None


class UserOut(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    is_admin: bool = False


class SessionExchange(BaseModel):
    session_id: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
async def _get_current_user(
    request: Request,
    session_token: Optional[str] = Cookie(default=None),
    authorization: Optional[str] = Header(default=None),
) -> Optional[dict]:
    token: Optional[str] = None
    if session_token:
        token = session_token
    elif authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
    if not token:
        return None

    session_doc = await db.user_sessions.find_one(
        {"session_token": token}, {"_id": 0}
    )
    if not session_doc:
        return None
    expires_at = session_doc.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if isinstance(expires_at, datetime):
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            return None

    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]}, {"_id": 0}
    )
    return user_doc


async def require_user(user=Depends(_get_current_user)) -> dict:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )
    return user


async def require_admin(user=Depends(require_user)) -> dict:
    if user.get("email", "").lower() not in ADMIN_EMAILS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin only"
        )
    return user


# ---------------------------------------------------------------------------
# Auth routes
# ---------------------------------------------------------------------------
@api.post("/auth/session")
async def create_session(payload: SessionExchange, response: Response) -> dict:
    """Exchange a session_id from the Emergent OAuth flow for a session_token."""
    async with httpx.AsyncClient(timeout=15.0) as http:
        resp = await http.get(
            EMERGENT_SESSION_URL, headers={"X-Session-ID": payload.session_id}
        )
    if resp.status_code != 200:
        logger.warning("Session exchange failed: %s %s", resp.status_code, resp.text)
        raise HTTPException(status_code=401, detail="Invalid session")
    data = resp.json()

    email = (data.get("email") or "").lower()
    name = data.get("name") or email.split("@")[0]
    picture = data.get("picture")
    session_token = data.get("session_token")
    if not (email and session_token):
        raise HTTPException(status_code=502, detail="Bad session payload")

    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": name, "picture": picture,
                       "last_login": datetime.now(timezone.utc).isoformat()}},
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_login": datetime.now(timezone.utc).isoformat(),
        })

    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.update_one(
        {"session_token": session_token},
        {"$set": {
            "session_token": session_token,
            "user_id": user_id,
            "expires_at": expires_at.isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }},
        upsert=True,
    )

    response.set_cookie(
        key="session_token",
        value=session_token,
        max_age=7 * 24 * 60 * 60,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )
    is_admin = email in ADMIN_EMAILS
    return {
        "user_id": user_id,
        "email": email,
        "name": name,
        "picture": picture,
        "is_admin": is_admin,
    }


@api.get("/auth/me", response_model=UserOut)
async def me(user=Depends(require_user)) -> UserOut:
    return UserOut(
        user_id=user["user_id"],
        email=user["email"],
        name=user.get("name", ""),
        picture=user.get("picture"),
        is_admin=user.get("email", "").lower() in ADMIN_EMAILS,
    )


@api.post("/auth/logout")
async def logout(
    response: Response,
    session_token: Optional[str] = Cookie(default=None),
    authorization: Optional[str] = Header(default=None),
) -> dict:
    token = session_token
    if not token and authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/", samesite="none", secure=True)
    return {"ok": True}


# --- Password-based admin login -------------------------------------------
def _hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def _brute_force_check(ip: str) -> bool:
    now = datetime.now(timezone.utc).timestamp()
    attempts = [t for t in _LOGIN_ATTEMPTS.get(ip, []) if now - t < _LOGIN_WINDOW]
    _LOGIN_ATTEMPTS[ip] = attempts
    return len(attempts) < _LOGIN_MAX


def _record_failed_login(ip: str) -> None:
    _LOGIN_ATTEMPTS.setdefault(ip, []).append(
        datetime.now(timezone.utc).timestamp()
    )


@api.post("/auth/login")
async def login(payload: LoginRequest, request: Request, response: Response) -> dict:
    ip = _client_ip(request) or "unknown"
    if not _brute_force_check(ip):
        raise HTTPException(
            status_code=429,
            detail="Too many failed attempts. Try again in 15 minutes.",
        )

    email = payload.email.lower().strip()
    user_doc = await db.users.find_one({"email": email}, {"_id": 0})
    if not user_doc or not user_doc.get("password_hash"):
        _record_failed_login(ip)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not _verify_password(payload.password, user_doc["password_hash"]):
        _record_failed_login(ip)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Success — reset attempts, issue session
    _LOGIN_ATTEMPTS.pop(ip, None)
    session_token = secrets.token_urlsafe(48)
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.update_one(
        {"session_token": session_token},
        {
            "$set": {
                "session_token": session_token,
                "user_id": user_doc["user_id"],
                "expires_at": expires_at.isoformat(),
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        },
        upsert=True,
    )
    await db.users.update_one(
        {"user_id": user_doc["user_id"]},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}},
    )
    response.set_cookie(
        key="session_token",
        value=session_token,
        max_age=7 * 24 * 60 * 60,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )
    is_admin = email in ADMIN_EMAILS
    return {
        "user_id": user_doc["user_id"],
        "email": email,
        "name": user_doc.get("name", ""),
        "picture": user_doc.get("picture"),
        "is_admin": is_admin,
        "session_token": session_token,
    }


@api.post("/auth/change-password")
async def change_password(
    payload: ChangePasswordRequest, user=Depends(require_user)
) -> dict:
    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=400, detail="New password must be at least 8 characters."
        )
    if payload.new_password == payload.current_password:
        raise HTTPException(
            status_code=400,
            detail="New password must be different from the current password.",
        )

    current_hash = user.get("password_hash")
    if not current_hash or not _verify_password(payload.current_password, current_hash):
        raise HTTPException(status_code=401, detail="Current password is incorrect.")

    new_hash = _hash_password(payload.new_password)
    await db.users.update_one(
        {"user_id": user["user_id"]},
        {
            "$set": {
                "password_hash": new_hash,
                "password_updated_at": datetime.now(timezone.utc).isoformat(),
            }
        },
    )
    # Invalidate all other sessions for security; keep the current one alive.
    current_token = None
    # Best-effort: look up the current active session by matching user_id + most recent.
    sess = await db.user_sessions.find_one(
        {"user_id": user["user_id"]}, sort=[("created_at", -1)]
    )
    if sess:
        current_token = sess.get("session_token")
    if current_token:
        await db.user_sessions.delete_many(
            {"user_id": user["user_id"], "session_token": {"$ne": current_token}}
        )
    return {"ok": True}


# ---------------------------------------------------------------------------
# Public routes
# ---------------------------------------------------------------------------
@api.get("/")
async def root() -> dict:
    return {"service": "bernat-solutions", "status": "ok"}


@api.get("/health")
async def health() -> dict:
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}


# Root-level health for Kubernetes readiness/liveness probes (no /api prefix)
@app.get("/health")
async def root_health() -> dict:
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}


def _client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else ""


# ---------------------------------------------------------------------------
# Email notifications (Emergent-managed Resend)
# ---------------------------------------------------------------------------
async def _send_email(
    to: str, subject: str, html: str, reply_to: Optional[str] = None
) -> None:
    """POST to Emergent's managed email proxy. Failures are logged, not raised."""
    if not EMAIL_KEY:
        logger.warning("EMERGENT_EMAIL_KEY not set — skipping email send")
        return
    payload = {
        "to": [to],
        "subject": subject,
        "html": html,
        "from_name": EMAIL_FROM_NAME,
    }
    if reply_to:
        payload["contact_email"] = reply_to
    try:
        async with httpx.AsyncClient(timeout=20) as http:
            resp = await http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
            resp.raise_for_status()
            logger.info("Email sent to %s (subject=%s)", to, subject)
    except httpx.HTTPStatusError as e:
        logger.error(
            "Email send failed: %s %s", e.response.status_code, e.response.text
        )
    except Exception as e:  # noqa: BLE001
        logger.error("Email send error: %r", e)


def _row(label: str, value: str) -> str:
    if not value:
        value = "—"
    return (
        f'<tr>'
        f'<td style="padding:8px 12px;background:#f7f7f7;color:#555;'
        f'font-family:Arial,sans-serif;font-size:13px;width:170px;'
        f'border-bottom:1px solid #eee;">{label}</td>'
        f'<td style="padding:8px 12px;color:#111;font-family:Arial,sans-serif;'
        f'font-size:14px;border-bottom:1px solid #eee;">{value}</td>'
        f'</tr>'
    )


def _build_quote_email_html(doc: dict) -> str:
    processes = ", ".join(doc.get("processes") or []) or "—"
    files = doc.get("files") or []
    files_html = (
        "".join(
            f"<li style=\"font-family:Arial,sans-serif;font-size:13px;color:#111;\">"
            f"{f.get('filename','file')} <span style=\"color:#888;\">"
            f"({int(f.get('size', 0) / 1024)} KB)</span></li>"
            for f in files
        )
        if files
        else "<li style=\"font-family:Arial,sans-serif;font-size:13px;color:#888;\">No files attached</li>"
    )
    notes = (doc.get("notes") or "").replace("\n", "<br>") or "—"
    return f"""
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 0;">
  <tr><td align="center">
    <table role="presentation" width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e5e5;">
      <tr>
        <td style="background:#0a0a0a;padding:24px 28px;">
          <div style="font-family:Arial,sans-serif;color:#2f5d3a;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">New Enquiry</div>
          <div style="font-family:Arial,sans-serif;color:#ffffff;font-size:22px;font-weight:600;margin-top:6px;">Kingsford Metals — Quote Request</div>
          <div style="font-family:Arial,sans-serif;color:#a3a3a3;font-size:12px;margin-top:6px;">Ref: {doc.get('quote_id','')}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 4px 28px;">
          <div style="font-family:Arial,sans-serif;color:#555;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:10px;">Contact</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            {_row('Name', doc.get('name',''))}
            {_row('Company', doc.get('company',''))}
            {_row('Email', doc.get('email',''))}
            {_row('Phone', doc.get('phone',''))}
            {_row('Postcode', doc.get('postcode','') or '—')}
            {_row('Lead time', doc.get('lead_time','') or '—')}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 4px 28px;">
          <div style="font-family:Arial,sans-serif;color:#555;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:10px;">Job</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            {_row('Material', doc.get('material','') or '—')}
            {_row('Thickness / size', doc.get('thickness','') or '—')}
            {_row('Quantity', doc.get('quantity','') or '—')}
            {_row('Processes', processes)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px;">
          <div style="font-family:Arial,sans-serif;color:#555;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:10px;">Notes</div>
          <div style="font-family:Arial,sans-serif;color:#111;font-size:14px;line-height:1.5;background:#f7f7f7;padding:12px;border-left:3px solid #2f5d3a;">{notes}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 24px 28px;">
          <div style="font-family:Arial,sans-serif;color:#555;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:10px;">Drawings ({len(files)})</div>
          <ul style="margin:0;padding-left:20px;">{files_html}</ul>
        </td>
      </tr>
      <tr>
        <td style="background:#f7f7f7;padding:14px 28px;font-family:Arial,sans-serif;font-size:12px;color:#666;">
          Reply to this email to respond directly to {doc.get('name','the enquirer')}. Download drawings and manage status inside the admin dashboard.
        </td>
      </tr>
    </table>
  </td></tr>
</table>
"""


def _build_contact_email_html(doc: dict) -> str:
    msg = (doc.get("message") or "").replace("\n", "<br>") or "—"
    return f"""
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 0;">
  <tr><td align="center">
    <table role="presentation" width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e5e5;">
      <tr>
        <td style="background:#0a0a0a;padding:24px 28px;">
          <div style="font-family:Arial,sans-serif;color:#2f5d3a;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">New Message</div>
          <div style="font-family:Arial,sans-serif;color:#ffffff;font-size:22px;font-weight:600;margin-top:6px;">Kingsford Metals — Contact Form</div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 4px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            {_row('Name', doc.get('name',''))}
            {_row('Company', doc.get('company','') or '—')}
            {_row('Email', doc.get('email',''))}
            {_row('Phone', doc.get('phone','') or '—')}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px;">
          <div style="font-family:Arial,sans-serif;color:#555;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:10px;">Message</div>
          <div style="font-family:Arial,sans-serif;color:#111;font-size:14px;line-height:1.5;background:#f7f7f7;padding:12px;border-left:3px solid #2f5d3a;">{msg}</div>
        </td>
      </tr>
      <tr>
        <td style="background:#f7f7f7;padding:14px 28px;font-family:Arial,sans-serif;font-size:12px;color:#666;">
          Reply to this email to respond directly to {doc.get('name','the enquirer')}.
        </td>
      </tr>
    </table>
  </td></tr>
</table>
"""


def _fire_and_forget(coro) -> None:
    """Schedule a coroutine without awaiting — used so a submission can return
    immediately even if the email proxy is slow or errors."""
    try:
        asyncio.get_running_loop().create_task(coro)
    except RuntimeError:
        # No running loop (shouldn't happen inside FastAPI request), fall back
        asyncio.run(coro)


def _client_ip_orig(request: Request) -> str:
    """Legacy alias — kept for import safety, delegates to _client_ip."""
    return _client_ip(request)


@api.post("/quotes", status_code=201)
async def create_quote(
    request: Request,
    name: str = Form(...),
    company: str = Form(...),
    email: EmailStr = Form(...),
    phone: str = Form(...),
    postcode: str = Form(""),
    lead_time: str = Form(""),
    material: str = Form(""),
    thickness: str = Form(""),
    quantity: str = Form(""),
    processes: str = Form(""),  # comma-separated
    notes: str = Form(""),
    consent: bool = Form(False),
    honeypot: str = Form(""),
    files: List[UploadFile] = File(default_factory=list),
) -> dict:
    # Simple honeypot spam check
    if honeypot:
        logger.info("Honeypot triggered from %s", _client_ip(request))
        return {"ok": True, "quote_id": "spam"}

    if not consent:
        raise HTTPException(status_code=400, detail="Consent is required")

    process_list = [p.strip() for p in processes.split(",") if p.strip()]
    quote_id = f"q_{uuid.uuid4().hex[:12]}"

    stored_files: list[dict] = []
    total_size = 0
    for upload in files[:MAX_FILES_PER_QUOTE]:
        if not upload or not upload.filename:
            continue
        ext = Path(upload.filename).suffix.lower()
        if ext and ext not in ALLOWED_FILE_EXT:
            raise HTTPException(
                status_code=400, detail=f"File type not allowed: {ext}"
            )
        raw = await upload.read()
        if len(raw) > MAX_FILE_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"{upload.filename} exceeds {MAX_FILE_MB}MB",
            )
        total_size += len(raw)
        stored_files.append({
            "file_id": f"f_{uuid.uuid4().hex[:10]}",
            "filename": upload.filename,
            "content_type": upload.content_type or "application/octet-stream",
            "size": len(raw),
            "data_b64": base64.b64encode(raw).decode("ascii"),
        })

    doc = {
        "quote_id": quote_id,
        "name": name.strip(),
        "company": company.strip(),
        "email": str(email).lower(),
        "phone": phone.strip(),
        "postcode": postcode.strip(),
        "lead_time": lead_time.strip(),
        "material": material.strip(),
        "thickness": thickness.strip(),
        "quantity": quantity.strip(),
        "processes": process_list,
        "notes": notes.strip(),
        "consent": bool(consent),
        "status": "new",
        "source_ip": _client_ip(request),
        "user_agent": request.headers.get("user-agent", "")[:400],
        "files": stored_files,
        "files_total_size": total_size,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.quotes.insert_one(doc)
    logger.info("New quote %s from %s (%s)", quote_id, email, company)

    # Fire-and-forget email notification to the owner
    _fire_and_forget(
        _send_email(
            to=OWNER_EMAIL,
            subject=f"New quote enquiry — {doc['company']} ({quote_id})",
            html=_build_quote_email_html(doc),
            reply_to=doc["email"],
        )
    )

    return {
        "ok": True,
        "quote_id": quote_id,
        "message": (
            "Thanks — your enquiry has been received. We'll review your drawings "
            "and come back to you as soon as possible."
        ),
    }


@api.post("/contact", status_code=201)
async def submit_contact(payload: ContactMessage, request: Request) -> dict:
    if payload.honeypot:
        return {"ok": True}
    doc = {
        "message_id": f"m_{uuid.uuid4().hex[:12]}",
        "name": payload.name.strip(),
        "email": payload.email.lower(),
        "phone": (payload.phone or "").strip(),
        "company": (payload.company or "").strip(),
        "message": payload.message.strip(),
        "source_ip": _client_ip(request),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "read": False,
    }
    await db.contact_messages.insert_one(doc)

    # Fire-and-forget email notification to the owner
    _fire_and_forget(
        _send_email(
            to=OWNER_EMAIL,
            subject=f"New contact message — {doc['name']}",
            html=_build_contact_email_html(doc),
            reply_to=doc["email"],
        )
    )

    return {"ok": True, "message_id": doc["message_id"]}


# ---------------------------------------------------------------------------
# Admin routes
# ---------------------------------------------------------------------------
def _quote_summary(doc: dict) -> dict:
    return {
        "quote_id": doc["quote_id"],
        "name": doc["name"],
        "company": doc["company"],
        "email": doc["email"],
        "phone": doc["phone"],
        "postcode": doc.get("postcode", ""),
        "lead_time": doc.get("lead_time", ""),
        "material": doc.get("material", ""),
        "thickness": doc.get("thickness", ""),
        "quantity": doc.get("quantity", ""),
        "processes": doc.get("processes", []),
        "notes": doc.get("notes", ""),
        "status": doc.get("status", "new"),
        "created_at": doc.get("created_at"),
        "files": [
            {
                "file_id": f["file_id"],
                "filename": f["filename"],
                "content_type": f["content_type"],
                "size": f["size"],
            }
            for f in doc.get("files", [])
        ],
    }


@api.get("/admin/quotes")
async def list_quotes(user=Depends(require_admin)) -> dict:
    cursor = db.quotes.find({}, {"_id": 0, "files.data_b64": 0}).sort("created_at", -1).limit(500)
    items: list[dict] = []
    async for doc in cursor:
        items.append(_quote_summary(doc))
    stats = {
        "total": len(items),
        "new": sum(1 for i in items if i["status"] == "new"),
        "in_progress": sum(1 for i in items if i["status"] == "in_progress"),
        "quoted": sum(1 for i in items if i["status"] == "quoted"),
        "closed": sum(1 for i in items if i["status"] == "closed"),
    }
    return {"items": items, "stats": stats}


@api.get("/admin/quotes/{quote_id}")
async def get_quote(quote_id: str, user=Depends(require_admin)) -> dict:
    doc = await db.quotes.find_one(
        {"quote_id": quote_id}, {"_id": 0, "files.data_b64": 0}
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Quote not found")
    return _quote_summary(doc)


@api.patch("/admin/quotes/{quote_id}")
async def update_quote_status(
    quote_id: str, payload: QuoteStatusUpdate, user=Depends(require_admin)
) -> dict:
    if payload.status not in {"new", "in_progress", "quoted", "closed"}:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.quotes.update_one(
        {"quote_id": quote_id},
        {"$set": {"status": payload.status,
                    "updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Quote not found")
    return {"ok": True, "status": payload.status}


@api.delete("/admin/quotes/{quote_id}")
async def delete_quote(quote_id: str, user=Depends(require_admin)) -> dict:
    result = await db.quotes.delete_one({"quote_id": quote_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Quote not found")
    return {"ok": True}


@api.get("/admin/quotes/{quote_id}/files/{file_id}")
async def download_file(
    quote_id: str, file_id: str, user=Depends(require_admin)
) -> FastAPIResponse:
    doc = await db.quotes.find_one({"quote_id": quote_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Quote not found")
    for f in doc.get("files", []):
        if f["file_id"] == file_id:
            data = base64.b64decode(f["data_b64"])
            return FastAPIResponse(
                content=data,
                media_type=f.get("content_type", "application/octet-stream"),
                headers={
                    "Content-Disposition": f'attachment; filename="{f["filename"]}"'
                },
            )
    raise HTTPException(status_code=404, detail="File not found")


@api.get("/admin/messages")
async def list_messages(user=Depends(require_admin)) -> dict:
    cursor = db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).limit(500)
    items = []
    async for doc in cursor:
        items.append(doc)
    return {"items": items, "total": len(items)}


# ---------------------------------------------------------------------------
# Wire up
# ---------------------------------------------------------------------------
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def _shutdown() -> None:
    client.close()


@app.on_event("startup")
async def _seed_admin() -> None:
    """Ensure an admin user exists. Only seeds password on first create.
    After creation, the admin can rotate their password via /api/auth/change-password;
    subsequent restarts will NOT overwrite their custom password."""
    if not ADMIN_PASSWORD:
        logger.warning("ADMIN_PASSWORD not set — skipping admin seed")
        return
    email = next(iter(ADMIN_EMAILS))
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing is None:
        hashed = _hash_password(ADMIN_PASSWORD)
        await db.users.insert_one({
            "user_id": f"user_{uuid.uuid4().hex[:12]}",
            "email": email,
            "name": "Kingsford Metals Admin",
            "picture": None,
            "password_hash": hashed,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user %s", email)
    elif not existing.get("password_hash"):
        # Only set a password if the user has none (migration case).
        hashed = _hash_password(ADMIN_PASSWORD)
        await db.users.update_one(
            {"email": email},
            {"$set": {"password_hash": hashed, "name": existing.get("name") or "Kingsford Metals Admin"}},
        )
        logger.info("Set initial password for existing admin %s", email)

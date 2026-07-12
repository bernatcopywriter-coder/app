"""
Bernat Solutions — Backend integration tests
Covers: health, quote submission (multipart w/ files), contact form,
auth guards, admin allowlist enforcement, and admin quote lifecycle.
"""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_TOKEN = "test_session_admin_bernat"
NONADMIN_TOKEN = "test_session_nonadmin"


# --------- helpers / fixtures --------------------------------------------
@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    return s


def _fake_pdf_bytes() -> bytes:
    return b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF"


# --------- health --------------------------------------------------------
# The Kubernetes readiness probe hits the container internally at
# 127.0.0.1:8001/health (no /api prefix, HTTP/1.0). The external ingress only
# routes /api/* to the backend, so /health on the external URL goes to the
# frontend. We therefore test the root-level /health against the INTERNAL
# 127.0.0.1:8001 (the same target the probe uses) while /api/health is tested
# via the external URL through the ingress.
INTERNAL = "http://127.0.0.1:8001"


class TestHealth:
    def test_api_health_ok(self, session):
        """Regression: existing /api/health still returns 200 + expected shape."""
        r = session.get(f"{API}/health", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert "time" in data and isinstance(data["time"], str)

    def test_root_health_ok(self, session):
        """PRIMARY BUG FIX: root-level /health (no /api prefix) must return 200."""
        r = session.get(f"{INTERNAL}/health", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert "time" in data and isinstance(data["time"], str)

    def test_root_health_http10_probe(self, session):
        """The k8s probe uses HTTP/1.0; must still return 200."""
        import subprocess
        result = subprocess.run(
            ["curl", "--http1.0", "-s", "-o", "/dev/null", "-w", "%{http_code}",
             f"{INTERNAL}/health"],
            capture_output=True, text=True, timeout=10,
        )
        assert result.stdout.strip() == "200", (
            f"HTTP/1.0 probe to /health returned {result.stdout!r} — the k8s "
            f"readiness probe will fail. stderr={result.stderr!r}"
        )

    def test_api_root_still_works(self, session):
        """Regression: /api/ still returns the small service JSON, not shadowed."""
        r = session.get(f"{API}/", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data == {"service": "bernat-solutions", "status": "ok"}


# --------- quote submission ---------------------------------------------
class TestQuoteSubmission:
    def test_happy_path_with_file(self, session):
        data = {
            "name": "Test User",
            "company": "TEST_Company Ltd",
            "email": "test.user@example.com",
            "phone": "07700000000",
            "postcode": "NG1",
            "lead_time": "Standard",
            "material": "Mild steel",
            "thickness": "2mm",
            "quantity": "10",
            "processes": "Laser cutting,Folding",
            "notes": "TEST_quote automated",
            "consent": "true",
        }
        files = [
            ("files", ("drawing.pdf", io.BytesIO(_fake_pdf_bytes()), "application/pdf")),
        ]
        r = session.post(f"{API}/quotes", data=data, files=files, timeout=20)
        assert r.status_code == 201, r.text
        body = r.json()
        assert body["ok"] is True
        assert body["quote_id"].startswith("q_")
        assert body["message"].startswith("Thanks")
        # save for later tests
        pytest.happy_quote_id = body["quote_id"]

    def test_missing_consent(self, session):
        data = {
            "name": "NoConsent",
            "company": "TEST_NoConsent",
            "email": "nc@example.com",
            "phone": "07700000000",
            "consent": "false",
        }
        r = session.post(f"{API}/quotes", data=data, timeout=15)
        assert r.status_code == 400
        assert "Consent is required" in r.text

    def test_honeypot_returns_spam_and_no_record(self, session):
        # Snapshot count before via admin listing (using admin auth)
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        before = session.get(f"{API}/admin/quotes", headers=headers, timeout=10).json()
        before_total = before["stats"]["total"]

        data = {
            "name": "Spammer",
            "company": "TEST_Spam",
            "email": "spam@example.com",
            "phone": "07700000000",
            "consent": "true",
            "honeypot": "spam",
        }
        r = session.post(f"{API}/quotes", data=data, timeout=15)
        assert r.status_code == 201
        body = r.json()
        assert body["quote_id"] == "spam"

        after = session.get(f"{API}/admin/quotes", headers=headers, timeout=10).json()
        assert after["stats"]["total"] == before_total, "Honeypot must NOT persist"

    def test_bad_file_extension(self, session):
        data = {
            "name": "BadFile",
            "company": "TEST_BadFile",
            "email": "badfile@example.com",
            "phone": "07700000000",
            "consent": "true",
        }
        files = [("files", ("malware.exe", io.BytesIO(b"MZ\x90\x00"), "application/octet-stream"))]
        r = session.post(f"{API}/quotes", data=data, files=files, timeout=15)
        assert r.status_code == 400
        assert "File type not allowed" in r.text


# --------- contact form --------------------------------------------------
class TestContact:
    def test_contact_happy_path(self, session):
        payload = {
            "name": "TEST_Contact",
            "email": "contact@example.com",
            "message": "This is a test message from automated tests.",
            "phone": "07700000000",
            "company": "TEST_ContactCo",
            "honeypot": "",
        }
        r = session.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 201, r.text
        body = r.json()
        assert body["ok"] is True
        assert body["message_id"].startswith("m_")

    def test_contact_honeypot(self, session):
        payload = {
            "name": "Spammer",
            "email": "spam@example.com",
            "message": "spam",
            "honeypot": "x",
        }
        r = session.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 201
        body = r.json()
        assert body == {"ok": True} or ("message_id" not in body)


# --------- auth guards ---------------------------------------------------
class TestAuthGuards:
    def test_admin_quotes_unauth(self, session):
        r = session.get(f"{API}/admin/quotes", timeout=10)
        assert r.status_code == 401

    def test_admin_messages_unauth(self, session):
        r = session.get(f"{API}/admin/messages", timeout=10)
        assert r.status_code == 401

    def test_me_unauth(self, session):
        r = session.get(f"{API}/auth/me", timeout=10)
        assert r.status_code == 401

    def test_session_exchange_invalid(self, session):
        r = session.post(f"{API}/auth/session", json={"session_id": "obviously-bad"}, timeout=15)
        assert r.status_code == 401


# --------- admin allowlist ----------------------------------------------
class TestAdminAllowlist:
    def test_nonadmin_forbidden(self, session):
        headers = {"Authorization": f"Bearer {NONADMIN_TOKEN}"}
        r = session.get(f"{API}/admin/quotes", headers=headers, timeout=10)
        assert r.status_code == 403
        assert "Admin only" in r.text

    def test_admin_ok(self, session):
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        r = session.get(f"{API}/admin/quotes", headers=headers, timeout=10)
        assert r.status_code == 200
        body = r.json()
        assert "items" in body and isinstance(body["items"], list)
        stats = body["stats"]
        for k in ("total", "new", "in_progress", "quoted", "closed"):
            assert k in stats

    def test_auth_me_admin(self, session):
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        r = session.get(f"{API}/auth/me", headers=headers, timeout=10)
        assert r.status_code == 200
        body = r.json()
        assert body["email"] == "alex@bernatsolutions.com"
        assert body["is_admin"] is True


# --------- admin quote lifecycle ----------------------------------------
class TestAdminQuoteLifecycle:
    def test_full_lifecycle(self, session):
        headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
        # 1) create a quote (public) with one file
        data = {
            "name": "Lifecycle User",
            "company": "TEST_Lifecycle",
            "email": "lifecycle@example.com",
            "phone": "07700000001",
            "postcode": "NG1",
            "processes": "Laser cutting",
            "consent": "true",
        }
        files = [("files", ("drawing.pdf", io.BytesIO(_fake_pdf_bytes()), "application/pdf"))]
        r = session.post(f"{API}/quotes", data=data, files=files, timeout=20)
        assert r.status_code == 201
        quote_id = r.json()["quote_id"]

        # 2) admin list must include it
        r = session.get(f"{API}/admin/quotes", headers=headers, timeout=10)
        assert r.status_code == 200
        items = r.json()["items"]
        assert any(x["quote_id"] == quote_id for x in items)

        # 3) admin detail
        r = session.get(f"{API}/admin/quotes/{quote_id}", headers=headers, timeout=10)
        assert r.status_code == 200
        detail = r.json()
        assert detail["quote_id"] == quote_id
        assert len(detail["files"]) == 1
        file_id = detail["files"][0]["file_id"]
        assert file_id.startswith("f_")

        # 4) file download
        r = session.get(
            f"{API}/admin/quotes/{quote_id}/files/{file_id}",
            headers=headers, timeout=15,
        )
        assert r.status_code == 200
        assert "attachment" in r.headers.get("Content-Disposition", "")
        assert r.content == _fake_pdf_bytes()

        # 5) patch status valid
        r = session.patch(
            f"{API}/admin/quotes/{quote_id}",
            headers={**headers, "Content-Type": "application/json"},
            json={"status": "in_progress"}, timeout=10,
        )
        assert r.status_code == 200
        assert r.json() == {"ok": True, "status": "in_progress"}

        # 6) patch status invalid
        r = session.patch(
            f"{API}/admin/quotes/{quote_id}",
            headers=headers, json={"status": "foobar"}, timeout=10,
        )
        assert r.status_code == 400

        # 7) delete
        r = session.delete(f"{API}/admin/quotes/{quote_id}", headers=headers, timeout=10)
        assert r.status_code == 200
        assert r.json() == {"ok": True}

        # 8) get should 404
        r = session.get(f"{API}/admin/quotes/{quote_id}", headers=headers, timeout=10)
        assert r.status_code == 404


# NOTE: no session-wide autouse cleanup — with xdist LoadScope it races with
# the lifecycle test running in a parallel worker. Individual tests either
# clean themselves up (lifecycle deletes its own quote) or leave small TEST_-
# prefixed footprints that main agent's ops can prune. Nothing here touches
# real customer data.

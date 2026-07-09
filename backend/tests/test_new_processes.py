"""
Iteration 2 — Verify NEW process values from the content overhaul
are accepted by POST /api/quotes as comma-separated `processes`,
persisted as a list, and returned via /api/admin/quotes.
"""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_TOKEN = "test_session_admin_bernat"


NEW_PROCESSES = [
    "Tube / section laser cutting",
    "Waterjet cutting",
    "Flame cutting",
    "Bevel cutting / weld prep",
]


@pytest.fixture(scope="module")
def session():
    return requests.Session()


def test_new_process_values_accepted_and_persisted(session):
    data = {
        "name": "TEST_NewProc",
        "company": "TEST_NewProc Ltd",
        "email": "test.newproc@example.com",
        "phone": "07700000123",
        "postcode": "NG1",
        "material": "Carbon steel (S355)",
        "thickness": "20mm",
        "quantity": "5",
        "processes": ",".join(NEW_PROCESSES),
        "consent": "true",
    }
    files = [
        ("files", ("drawing.pdf", io.BytesIO(b"%PDF-1.4 test"), "application/pdf")),
    ]
    r = session.post(f"{API}/quotes", data=data, files=files, timeout=20)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["ok"] is True
    quote_id = body["quote_id"]
    assert quote_id.startswith("q_")

    headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
    r = session.get(f"{API}/admin/quotes/{quote_id}", headers=headers, timeout=10)
    assert r.status_code == 200, r.text
    detail = r.json()
    proc_field = detail.get("processes")
    assert isinstance(proc_field, list), f"processes should be a list, got {type(proc_field)}: {proc_field}"
    for p in NEW_PROCESSES:
        assert p in proc_field, f"Missing new process value '{p}' in stored quote: {proc_field}"

    # cleanup
    session.delete(f"{API}/admin/quotes/{quote_id}", headers=headers, timeout=10)

"""Iteration 7 — Password-based admin login tests."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "alex@bernatsolutions.com"
ADMIN_PASSWORD = "BernatAdmin2025!"


@pytest.fixture
def s():
    return requests.Session()


class TestLoginHappyPath:
    def test_login_success_sets_cookie_and_returns_token(self, s):
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["is_admin"] is True
        assert body["email"] == ADMIN_EMAIL
        assert isinstance(body.get("session_token"), str) and len(body["session_token"]) > 20
        # Cookie set
        set_cookie = r.headers.get("set-cookie", "")
        assert "session_token=" in set_cookie.lower()
        assert "httponly" in set_cookie.lower()
        # cleanup — logout this session
        s.post(f"{API}/auth/logout", headers={"Authorization": f"Bearer {body['session_token']}"}, timeout=10)

    def test_login_then_me_and_admin_quotes(self, s):
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        tok = r.json()["session_token"]
        h = {"Authorization": f"Bearer {tok}"}

        r_me = requests.get(f"{API}/auth/me", headers=h, timeout=10)
        assert r_me.status_code == 200
        assert r_me.json()["is_admin"] is True

        r_q = requests.get(f"{API}/admin/quotes", headers=h, timeout=10)
        assert r_q.status_code == 200
        body = r_q.json()
        assert "items" in body and "stats" in body

        r_lo = requests.post(f"{API}/auth/logout", headers=h, timeout=10)
        assert r_lo.status_code == 200

        r_me2 = requests.get(f"{API}/auth/me", headers=h, timeout=10)
        assert r_me2.status_code == 401


class TestLoginFailure:
    def test_unknown_email(self):
        r = requests.post(f"{API}/auth/login", json={"email": "nobody@example.com", "password": "x"}, timeout=10)
        assert r.status_code == 401
        assert r.json()["detail"] == "Invalid email or password"

    def test_wrong_password_same_message(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "definitely-wrong"}, timeout=10)
        assert r.status_code == 401
        assert r.json()["detail"] == "Invalid email or password"


class TestBruteForceLockout:
    def test_lockout_after_5_failures(self):
        # Use unique IP via X-Forwarded-For so we don't pollute other tests
        ip = "203.0.113.77"
        h = {"X-Forwarded-For": ip}
        # 5 wrong attempts
        for i in range(5):
            r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, headers=h, timeout=10)
            assert r.status_code == 401, f"attempt {i}: {r.status_code} {r.text}"
        # 6th attempt should be 429
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, headers=h, timeout=10)
        assert r.status_code == 429
        assert "Too many failed attempts" in r.json()["detail"]
        # Even correct password locked out
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, headers=h, timeout=10)
        assert r.status_code == 429

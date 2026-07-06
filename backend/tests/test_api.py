"""
API smoke tests — run without live DB/Redis via environment mocking.
"""
import os
import pytest
import base64
import hashlib
import hmac
import json
import time
from pathlib import Path

# Set minimal env vars BEFORE importing app (pydantic-settings reads at import time)
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/reguscan_test")
os.environ.setdefault("DATABASE_URL_SYNC", "postgresql://postgres:postgres@localhost:5432/reguscan_test")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")
os.environ.setdefault("CELERY_BROKER_URL", "redis://localhost:6379/1")
os.environ.setdefault("CELERY_RESULT_BACKEND", "redis://localhost:6379/2")
os.environ.setdefault("SECRET_KEY", "test-secret-key-32-chars-minimum!")
os.environ.setdefault("CLERK_SECRET_KEY", "sk_test_placeholder")
os.environ.setdefault("GROQ_API_KEY", "gsk_test_placeholder")
os.environ.setdefault("APP_ENV", "local")
os.environ.setdefault("DEBUG", "true")

from unittest.mock import AsyncMock, MagicMock, patch
from httpx import AsyncClient, ASGITransport
from jose import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa


@pytest.fixture
async def client():
    """
    Test client patching DB and Redis dependencies.
    Authenticated routes return 403 (no token) or 401 (bad token).
    """
    mock_redis = AsyncMock()
    mock_redis.aclose = AsyncMock()
    mock_redis.pubsub = MagicMock(return_value=AsyncMock())
    mock_limiter = MagicMock()
    mock_limiter.limit.side_effect = lambda *args, **kwargs: (lambda func: func)

    # Patch at the dependency level, not module level
    async def mock_get_db():
        yield AsyncMock()

    with (
        patch("app.core.redis_client.redis_client", mock_redis),
        patch("app.core.redis_client.limiter", mock_limiter),
        patch("sentry_sdk.init"),
    ):
        from app.main import app
        from app.db.session import get_db
        app.dependency_overrides[get_db] = mock_get_db
        try:
            async with AsyncClient(
                transport=ASGITransport(app=app), base_url="http://test"
            ) as c:
                yield c
        finally:
            app.dependency_overrides.clear()


# ─── Public endpoints ─────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_health(client):
    resp = await client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert "version" in data
    assert data["env"] == "local"


@pytest.mark.asyncio
async def test_root(client):
    resp = await client.get("/")
    assert resp.status_code == 200
    assert resp.json()["service"] == "ReguScan API"


# ─── Auth guard — no token → 403 ─────────────────────────────────────────────

@pytest.mark.asyncio
async def test_websites_requires_auth(client):
    resp = await client.get("/api/v1/websites")
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_scan_trigger_requires_auth(client):
    resp = await client.post("/api/v1/websites/fake-id/scan")
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_billing_usage_requires_auth(client):
    resp = await client.get("/api/v1/billing/usage")
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_ai_systems_requires_auth(client):
    resp = await client.get("/api/v1/ai-systems/fake-id")
    assert resp.status_code == 403


# ─── Invalid token → 401 ─────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_invalid_bearer_token(client):
    # Mock JWKS to avoid real network call to Clerk
    mock_jwks = {"keys": [{"kid": "test-key", "kty": "RSA", "use": "sig"}]}
    with patch("app.core.auth._get_jwks", AsyncMock(return_value=mock_jwks)):
        resp = await client.get(
            "/api/v1/websites",
            headers={"Authorization": "Bearer not-a-real-jwt"},
        )
    assert resp.status_code == 401


def _b64url_int(value: int) -> str:
    raw = value.to_bytes((value.bit_length() + 7) // 8, "big")
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def _rsa_token_and_jwks(claims: dict, kid: str = "test-key") -> tuple[str, dict]:
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )
    public_numbers = private_key.public_key().public_numbers()
    jwks = {
        "keys": [{
            "kid": kid,
            "kty": "RSA",
            "use": "sig",
            "alg": "RS256",
            "n": _b64url_int(public_numbers.n),
            "e": _b64url_int(public_numbers.e),
        }]
    }
    token = jwt.encode(claims, private_pem, algorithm="RS256", headers={"kid": kid})
    return token, jwks


@pytest.mark.asyncio
async def test_clerk_token_verifies_signature_issuer_audience_and_authorized_party(monkeypatch):
    from app.core import auth

    now = int(time.time())
    token, jwks = _rsa_token_and_jwks({
        "sub": "user_valid",
        "iss": "https://trusted.clerk.accounts.dev",
        "aud": "reguscan-api",
        "azp": "http://localhost:3000",
        "iat": now,
        "nbf": now - 10,
        "exp": now + 300,
    })

    monkeypatch.setattr(auth.settings, "APP_ENV", "production")
    monkeypatch.setattr(auth.settings, "CLERK_ISSUER", "https://trusted.clerk.accounts.dev")
    monkeypatch.setattr(auth.settings, "CLERK_JWT_AUDIENCE", "reguscan-api")
    monkeypatch.setattr(auth.settings, "CLERK_AUTHORIZED_PARTIES", "http://localhost:3000")
    monkeypatch.setattr(auth, "_get_jwks", AsyncMock(return_value=jwks))

    payload = await auth.verify_clerk_token(token)
    assert payload["sub"] == "user_valid"


@pytest.mark.asyncio
async def test_clerk_token_rejects_untrusted_issuer_even_with_valid_signature(monkeypatch):
    from fastapi import HTTPException
    from app.core import auth

    now = int(time.time())
    token, jwks = _rsa_token_and_jwks({
        "sub": "attacker",
        "iss": "https://attacker.example.com",
        "aud": "reguscan-api",
        "azp": "http://localhost:3000",
        "iat": now,
        "nbf": now - 10,
        "exp": now + 300,
    })

    monkeypatch.setattr(auth.settings, "APP_ENV", "production")
    monkeypatch.setattr(auth.settings, "CLERK_ISSUER", "https://trusted.clerk.accounts.dev")
    monkeypatch.setattr(auth.settings, "CLERK_JWT_AUDIENCE", "reguscan-api")
    monkeypatch.setattr(auth.settings, "CLERK_AUTHORIZED_PARTIES", "http://localhost:3000")
    monkeypatch.setattr(auth, "_get_jwks", AsyncMock(return_value=jwks))

    with pytest.raises(HTTPException) as exc:
        await auth.verify_clerk_token(token)
    assert exc.value.status_code == 401


@pytest.mark.asyncio
async def test_clerk_token_rejects_wrong_audience(monkeypatch):
    from fastapi import HTTPException
    from app.core import auth

    now = int(time.time())
    token, jwks = _rsa_token_and_jwks({
        "sub": "user_wrong_aud",
        "iss": "https://trusted.clerk.accounts.dev",
        "aud": "other-api",
        "azp": "http://localhost:3000",
        "iat": now,
        "nbf": now - 10,
        "exp": now + 300,
    })

    monkeypatch.setattr(auth.settings, "APP_ENV", "production")
    monkeypatch.setattr(auth.settings, "CLERK_ISSUER", "https://trusted.clerk.accounts.dev")
    monkeypatch.setattr(auth.settings, "CLERK_JWT_AUDIENCE", "reguscan-api")
    monkeypatch.setattr(auth.settings, "CLERK_AUTHORIZED_PARTIES", "http://localhost:3000")
    monkeypatch.setattr(auth, "_get_jwks", AsyncMock(return_value=jwks))

    with pytest.raises(HTTPException) as exc:
        await auth.verify_clerk_token(token)
    assert exc.value.status_code == 401


# ─── Detector unit tests (no external deps) ──────────────────────────────────

def test_detector_finds_intercom():
    from app.tasks.detector import detect_ai_systems
    crawl_data = {
        "scan_id": "test-123",
        "base_url": "https://example.com",
        "pages_crawled": 1,
        "pages_data": [
            {
                "url": "https://example.com",
                "html_snippet": '<script src="https://widget.intercom.io/widget/abc123"></script> intercomSettings = {}',
                "script_urls": ["https://widget.intercom.io/widget/abc123"],
                "inline_scripts": ["intercomSettings = {};"],
                "meta_tags": [],
                "chat_selectors": ["#intercom-container"],
            }
        ],
        "all_network_requests": [],
        "all_script_urls": ["https://widget.intercom.io/widget/abc123"],
    }
    result = detect_ai_systems("test-123", crawl_data)
    names = [s["name"] for s in result["detected_systems"]]
    assert "Intercom" in names, f"Expected Intercom in {names}"


def test_detector_finds_high_risk_recruitment():
    from app.tasks.detector import detect_ai_systems
    crawl_data = {
        "scan_id": "test-456",
        "base_url": "https://example.com",
        "pages_crawled": 1,
        "pages_data": [
            {
                "url": "https://example.com/careers",
                "html_snippet": "AI screening automated candidate ranking resume parser",
                "script_urls": [],
                "inline_scripts": [],
                "meta_tags": [],
                "chat_selectors": [],
            }
        ],
        "all_network_requests": [],
        "all_script_urls": [],
    }
    result = detect_ai_systems("test-456", crawl_data)
    names = [s["name"] for s in result["detected_systems"]]
    risk_hints = [s["risk_hint"] for s in result["detected_systems"]]
    assert "Recruitment / HR AI" in names
    assert "high" in risk_hints


def test_detector_empty_crawl():
    from app.tasks.detector import detect_ai_systems
    crawl_data = {
        "scan_id": "test-789",
        "base_url": "https://plain-static-site.com",
        "pages_crawled": 3,
        "pages_data": [
            {"url": "https://plain-static-site.com", "html_snippet": "Hello world",
             "script_urls": [], "inline_scripts": [], "meta_tags": [], "chat_selectors": []}
        ],
        "all_network_requests": [],
        "all_script_urls": [],
    }
    result = detect_ai_systems("test-789", crawl_data)
    assert result["detected_systems"] == []
    assert result["crawl_results"]["ai_systems_detected"] == 0


def test_detector_finds_generic_ai_chatbot_marketing_page():
    from app.tasks.detector import detect_ai_systems

    crawl_data = {
        "scan_id": "test-generic-chatbot",
        "base_url": "https://chat.example.com",
        "pages_crawled": 1,
        "pages_attempted": 1,
        "pages_succeeded": 1,
        "pages_failed": 0,
        "crawl_confidence": "high",
        "pages_data": [
            {
                "url": "https://chat.example.com",
                "html_snippet": "Chatbot App - AI Chatbot for customer support and AI assistant workflows",
                "script_urls": [],
                "inline_scripts": [],
                "meta_tags": [],
                "chat_selectors": [],
            }
        ],
        "all_network_requests": [],
        "all_script_urls": [],
    }

    result = detect_ai_systems("test-generic-chatbot", crawl_data)
    systems = result["detected_systems"]
    assert any(s["name"] == "Generic AI Chatbot" for s in systems)
    generic = next(s for s in systems if s["name"] == "Generic AI Chatbot")
    assert generic["evidence_strength"] == "weak"
    assert generic["risk_hint"] == "limited"


def test_detector_finds_openai_network_candidate():
    from app.tasks.detector import detect_ai_systems

    crawl_data = {
        "scan_id": "test-openai-network",
        "base_url": "https://resume.example.com",
        "pages_crawled": 1,
        "pages_attempted": 1,
        "pages_succeeded": 1,
        "pages_failed": 0,
        "crawl_confidence": "high",
        "pages_data": [
            {
                "url": "https://resume.example.com",
                "html_snippet": "Build resumes faster with recruiter match",
                "script_urls": [],
                "inline_scripts": [],
                "meta_tags": [],
                "chat_selectors": [],
            }
        ],
        "all_network_requests": ["https://bzrcdn.openai.com/sdk/oaiq.min.js"],
        "all_script_urls": [],
    }

    result = detect_ai_systems("test-openai-network", crawl_data)
    systems = result["detected_systems"]
    assert any(s["name"] == "AI Resume / Recruiting Assistant" for s in systems)
    candidate = next(s for s in systems if s["name"] == "AI Resume / Recruiting Assistant")
    assert candidate["evidence_strength"] == "medium"
    assert candidate["detector_confidence"] >= 0.6


# ─── Gap analyzer unit tests (no external deps) ──────────────────────────────

def test_demo_target_contains_detectable_ai_signals():
    from app.tasks.detector import detect_ai_systems

    demo_html = Path(__file__).resolve().parents[2].joinpath(
        "docs", "demo-ai-target.html"
    ).read_text(encoding="utf-8")
    crawl_data = {
        "scan_id": "test-demo-target",
        "base_url": "https://demo.example.com/demo-ai-target",
        "pages_crawled": 1,
        "pages_attempted": 1,
        "pages_succeeded": 1,
        "pages_failed": 0,
        "crawl_confidence": "high",
        "pages_data": [
            {
                "url": "https://demo.example.com/demo-ai-target",
                "html_snippet": demo_html,
                "script_urls": [
                    "https://widget.intercom.io/widget/demo-ai",
                    "https://bzrcdn.openai.com/sdk/oaiq.min.js",
                ],
                "inline_scripts": [],
                "meta_tags": [],
                "chat_selectors": [
                    "[data-ai-chat]",
                    "[data-resume-upload]",
                    "#intercom-container",
                ],
            }
        ],
        "all_network_requests": ["https://bzrcdn.openai.com/sdk/oaiq.min.js"],
        "all_script_urls": [
            "https://widget.intercom.io/widget/demo-ai",
            "https://bzrcdn.openai.com/sdk/oaiq.min.js",
        ],
    }

    result = detect_ai_systems("test-demo-target", crawl_data)
    names = {system["name"] for system in result["detected_systems"]}

    assert "Intercom" in names
    assert "Generic AI Chatbot" in names
    assert "AI Resume / Recruiting Assistant" in names


def test_url_safety_rejects_localhost_and_private_ips():
    from app.core.url_safety import UnsafeUrlError, assert_url_is_safe

    blocked = [
        "http://localhost:8000",
        "http://127.0.0.1",
        "http://10.0.0.5",
        "http://172.16.0.1",
        "http://192.168.1.10",
        "http://169.254.169.254/latest/meta-data",
        "file:///etc/passwd",
    ]

    for url in blocked:
        with pytest.raises(UnsafeUrlError):
            assert_url_is_safe(url)


def test_url_safety_allows_public_ip_without_scheme():
    from app.core.url_safety import assert_url_is_safe

    assert assert_url_is_safe("8.8.8.8") == "https://8.8.8.8"


def test_url_safety_does_not_cache_dns_safety_decisions(monkeypatch):
    import socket
    from app.core.url_safety import UnsafeUrlError, assert_url_is_safe

    answers = iter(["93.184.216.34", "169.254.169.254"])
    lookups = []

    def fake_getaddrinfo(host, port, type):
        lookups.append((host, port, type))
        ip = next(answers)
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", (ip, port))]

    monkeypatch.setattr(socket, "getaddrinfo", fake_getaddrinfo)

    assert assert_url_is_safe("https://rebind.example") == "https://rebind.example"
    with pytest.raises(UnsafeUrlError):
        assert_url_is_safe("https://rebind.example")

    assert len(lookups) == 2


def test_report_renderer_escapes_untrusted_html():
    from app.tasks.report_generator import _render_report

    payload = '<img src=x onerror=alert(1)>'
    html = _render_report(
        scan_id="scan-xss",
        base_url="https://example.com",
        classified_systems=[
            {
                "name": payload,
                "system_type": "chatbot",
                "provider": payload,
                "page_url": "https://example.com/chat",
                "evidence_strength": "high",
                "detection_sources": [payload],
                "classification": {
                    "risk_category": "limited",
                    "confidence": 0.9,
                    "applicable_articles": [payload],
                    "reasoning": payload,
                },
            }
        ],
        gaps=[
            {
                "severity": "medium",
                "system_name": payload,
                "system_page_url": "https://example.com/chat",
                "risk_category": "limited",
                "obligation_code": "Art.50",
                "obligation_description": payload,
                "classification_reasoning": payload,
                "remediation_suggestion": payload,
                "remediation_code_snippet": payload,
            }
        ],
        gap_summary={"critical": 0, "high": 0, "medium": 1, "low": 0},
        compliance_score=92,
        overall_risk_tier="limited",
        fine_exposure={"tier1": 0, "tier2": 0, "tier3": 0},
    )

    assert payload not in html
    assert "&lt;img src=x onerror=alert(1)&gt;" in html


def test_destructive_routes_require_admin_dependency():
    import inspect

    from app.api.v1.endpoints.ai_systems import update_gap_status
    from app.api.v1.endpoints.scans import delete_scan
    from app.core.auth import require_admin

    assert inspect.signature(update_gap_status).parameters["current_user"].default.dependency is require_admin
    assert inspect.signature(delete_scan).parameters["current_user"].default.dependency is require_admin


@pytest.mark.asyncio
async def test_admin_policy_allows_compliance_manager_but_blocks_member():
    from fastapi import HTTPException

    from app.core.auth import require_admin

    class FakeUser:
        def __init__(self, role: str):
            self.role = role

    for role in ("owner", "admin", "compliance_manager", "compliance-manager"):
        assert await require_admin(FakeUser(role)) is not None

    with pytest.raises(HTTPException) as exc:
        await require_admin(FakeUser("member"))
    assert exc.value.status_code == 403


def test_scan_plan_pages_limit_helper():
    from app.api.v1.endpoints.scans import _get_pages_per_scan

    assert _get_pages_per_scan({"pages_per_scan": 10}) == 10
    assert _get_pages_per_scan({"pages_per_scan": -1}) == 20
    assert _get_pages_per_scan({"pages_per_scan": 0}) == 1


def test_websocket_token_extraction_ignores_query_token():
    from app.main import _extract_websocket_token

    class FakeWebSocket:
        headers = {"sec-websocket-protocol": "reguscan, clerk.jwt.token"}
        query_params = {"token": "query-token"}

    token, subprotocol = _extract_websocket_token(FakeWebSocket())

    assert token == "jwt.token"
    assert subprotocol == "reguscan"


def test_webhook_secret_configuration_is_required():
    from fastapi import HTTPException

    from app.api.v1.endpoints.auth import _require_webhook_secret

    with pytest.raises(HTTPException) as exc:
        _require_webhook_secret("", "Razorpay webhook secret")

    assert exc.value.status_code == 500
    assert _require_webhook_secret("secret_test", "Razorpay webhook secret") == "secret_test"


def test_razorpay_payment_signature_rejects_invalid_signature():
    from fastapi import HTTPException

    from app.api.v1.endpoints.auth import _verify_razorpay_payment_signature

    with pytest.raises(HTTPException) as exc:
        _verify_razorpay_payment_signature(
            order_id="order_test",
            payment_id="pay_test",
            signature="bad_signature",
            secret="secret",
        )

    assert exc.value.status_code == 400


def test_razorpay_payment_signature_accepts_valid_signature():
    from app.api.v1.endpoints.auth import _verify_razorpay_payment_signature

    signature = hmac.new(
        b"secret",
        b"order_test|pay_test",
        hashlib.sha256,
    ).hexdigest()

    _verify_razorpay_payment_signature(
        order_id="order_test",
        payment_id="pay_test",
        signature=signature,
        secret="secret",
    )


@pytest.mark.asyncio
async def test_razorpay_webhook_invalid_signature_is_rejected(client, monkeypatch):
    from app.api.v1.endpoints import auth

    monkeypatch.setattr(auth.settings, "RAZORPAY_WEBHOOK_SECRET", "secret")

    resp = await client.post(
        "/api/v1/billing/webhook",
        json={"event": "payment.captured", "payload": {}},
        headers={"x-razorpay-signature": "bad_signature"},
    )

    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_razorpay_webhook_verified_payment_activates_plan(monkeypatch):
    from app.api.v1.endpoints import auth

    class FakeOrg:
        id = "org_test"
        plan = "free"
        subscription_status = "pending_payment"
        razorpay_payment_id = None
        razorpay_order_id = "order_test"
        razorpay_customer_id = None

    class FakeRequest:
        def __init__(self, body: bytes, signature: str):
            self._body = body
            self.headers = {"x-razorpay-signature": signature}

        async def body(self):
            return self._body

        async def json(self):
            return json.loads(self._body)

    class FakeDB:
        def __init__(self, org):
            self.org = org
            self.added = []

        async def get(self, model, key):
            return self.org if key == self.org.id else None

        def add(self, obj):
            self.added.append(obj)

    event = {
        "event": "payment.captured",
        "payload": {
            "payment": {
                "entity": {
                    "id": "pay_test",
                    "order_id": "order_test",
                    "customer_id": "cust_test",
                    "notes": {"org_id": "org_test", "plan": "pro"},
                }
            }
        },
    }
    body = json.dumps(event, separators=(",", ":")).encode("utf-8")
    signature = hmac.new(b"secret", body, hashlib.sha256).hexdigest()
    org = FakeOrg()

    monkeypatch.setattr(auth.settings, "RAZORPAY_WEBHOOK_SECRET", "secret")
    response = await auth.razorpay_webhook(FakeRequest(body, signature), FakeDB(org))

    assert response.status_code == 200
    assert org.plan == "pro"
    assert org.subscription_status == "active"
    assert org.razorpay_payment_id == "pay_test"


@pytest.mark.asyncio
async def test_old_checkout_route_is_disabled(client):
    resp = await client.post("/api/v1/billing/checkout")

    assert resp.status_code == 410


def test_gap_analyzer_prohibited_gets_critical():
    from app.tasks.gap_analyzer import analyze_gaps

    # Mock no DB save by patching _save_gaps
    with patch("app.tasks.gap_analyzer._save_gaps", AsyncMock()):
        classification_data = {
            "scan_id": "test-gap-1",
            "base_url": "https://example.com",
            "crawl_results": {},
            "overall_risk_tier": "prohibited",
            "classified_systems": [
                {
                    "name": "Social Scoring System",
                    "system_type": "social_scoring",
                    "provider": "Unknown",
                    "risk_hint": "prohibited",
                    "detection_evidence": {},
                    "page_url": "https://example.com",
                    "classification": {
                        "risk_category": "prohibited",
                        "confidence": 0.95,
                        "applicable_articles": ["Art.5"],
                        "reasoning": "Social scoring prohibited",
                        "obligations": [],
                    },
                }
            ],
        }
        result = analyze_gaps("test-gap-1", classification_data)

    assert result["gap_summary"]["critical"] >= 1
    critical_gaps = [g for g in result["gaps"] if g["severity"] == "critical"]
    assert any("Art.5" in g["obligation_code"] for g in critical_gaps)


def test_gap_analyzer_limited_risk_gets_disclosure_gap():
    from app.tasks.gap_analyzer import analyze_gaps

    with patch("app.tasks.gap_analyzer._save_gaps", AsyncMock()):
        classification_data = {
            "scan_id": "test-gap-2",
            "base_url": "https://example.com",
            "crawl_results": {},
            "overall_risk_tier": "limited",
            "classified_systems": [
                {
                    "name": "Intercom",
                    "system_type": "chatbot",
                    "provider": "Intercom",
                    "risk_hint": "limited",
                    "detection_evidence": {},
                    "page_url": "https://example.com",
                    "classification": {
                        "risk_category": "limited",
                        "confidence": 0.9,
                        "applicable_articles": ["Art.50"],
                        "reasoning": "Chatbot requires disclosure",
                        "obligations": ["Art.50.1 disclosure"],
                    },
                }
            ],
        }
        result = analyze_gaps("test-gap-2", classification_data)

    gap_codes = [g["obligation_code"] for g in result["gaps"]]
    assert "Art.50.1" in gap_codes


# ─── Report score calculation ─────────────────────────────────────────────────

def test_compliance_score_perfect():
    """No gaps → score 100."""
    from app.tasks.report_generator import compile_report, BASE_SCORE

    with patch("app.tasks.report_generator._upload_report", AsyncMock(return_value=None)):
        result = compile_report("test-report-1", {
            "scan_id": "test-report-1",
            "base_url": "https://example.com",
            "classified_systems": [],
            "gaps": [],
            "gap_summary": {"critical": 0, "high": 0, "medium": 0, "low": 0},
            "overall_risk_tier": "minimal",
            "estimated_fine_exposure": {"tier1": 0, "tier2": 0, "tier3": 0},
        })
    assert result["compliance_score"] == BASE_SCORE


def test_compliance_score_deducts_for_critical():
    """Each critical gap deducts 25 points."""
    from app.tasks.report_generator import compile_report, SEVERITY_WEIGHTS

    with patch("app.tasks.report_generator._upload_report", AsyncMock(return_value=None)):
        result = compile_report("test-report-2", {
            "scan_id": "test-report-2",
            "base_url": "https://example.com",
            "classified_systems": [],
            "gaps": [
                {"severity": "critical", "system_name": "X", "risk_category": "prohibited",
                 "ai_system_index": 0, "obligation_code": "Art.5.1",
                 "obligation_description": "Prohibited", "remediation_suggestion": None,
                 "remediation_code_snippet": None},
            ],
            "gap_summary": {"critical": 1, "high": 0, "medium": 0, "low": 0},
            "overall_risk_tier": "prohibited",
            "estimated_fine_exposure": {"tier1": 35000000, "tier2": 0, "tier3": 0},
        })
    expected = max(0, 100 - SEVERITY_WEIGHTS["critical"])
    assert result["compliance_score"] == expected
    assert result["compliance_score"] == 75


def test_low_confidence_crawl_cannot_score_100():
    from app.tasks.report_generator import compile_report

    with patch("app.tasks.report_generator._upload_report", AsyncMock(return_value=None)):
        result = compile_report("test-low-confidence", {
            "scan_id": "test-low-confidence",
            "base_url": "https://example.com",
            "classified_systems": [],
            "gaps": [],
            "gap_summary": {"critical": 0, "high": 0, "medium": 0, "low": 0},
            "overall_risk_tier": "minimal",
            "estimated_fine_exposure": {"tier1": 0, "tier2": 0, "tier3": 0},
            "crawl_results": {
                "pages_attempted": 1,
                "pages_succeeded": 0,
                "pages_failed": 1,
                "crawl_confidence": "low",
                "crawl_errors": [{"url": "https://example.com", "stage": "load", "error": "Timeout"}],
            },
        })

    assert result["requires_review"] is True
    assert result["classification_results"]["requires_review"] is True
    assert result["compliance_score"] == 70


def test_medium_confidence_crawl_caps_perfect_score():
    from app.tasks.report_generator import compile_report

    with patch("app.tasks.report_generator._upload_report", AsyncMock(return_value=None)):
        result = compile_report("test-medium-confidence", {
            "scan_id": "test-medium-confidence",
            "base_url": "https://example.com",
            "classified_systems": [],
            "gaps": [],
            "gap_summary": {"critical": 0, "high": 0, "medium": 0, "low": 0},
            "overall_risk_tier": "minimal",
            "estimated_fine_exposure": {"tier1": 0, "tier2": 0, "tier3": 0},
            "crawl_results": {
                "pages_attempted": 3,
                "pages_succeeded": 2,
                "pages_failed": 1,
                "crawl_confidence": "medium",
                "crawl_errors": [{"url": "https://example.com/slow", "stage": "load", "error": "Timeout"}],
            },
        })

    assert result["requires_review"] is True
    assert result["compliance_score"] == 85


def test_weak_ai_evidence_becomes_needs_review_not_fully_compliant():
    from app.tasks.report_generator import compile_report

    with patch("app.tasks.report_generator._upload_report", AsyncMock(return_value=None)):
        result = compile_report("test-weak-evidence", {
            "scan_id": "test-weak-evidence",
            "base_url": "https://example.com",
            "classified_systems": [
                {
                    "name": "Generic AI Chatbot",
                    "system_type": "chatbot",
                    "provider": "Unknown",
                    "page_url": "https://example.com",
                    "detection_evidence": {"html_match": "AI chatbot"},
                    "detection_sources": ["page text"],
                    "evidence_strength": "weak",
                    "detector_confidence": 0.45,
                    "classification": {
                        "risk_category": "minimal",
                        "confidence": 0.45,
                        "applicable_articles": ["Art.4"],
                        "reasoning": "Weak page text signal requires review",
                        "obligations": [],
                    },
                }
            ],
            "gaps": [],
            "gap_summary": {"critical": 0, "high": 0, "medium": 0, "low": 0},
            "overall_risk_tier": "minimal",
            "estimated_fine_exposure": {"tier1": 0, "tier2": 0, "tier3": 0},
            "crawl_results": {
                "pages_attempted": 1,
                "pages_succeeded": 1,
                "pages_failed": 0,
                "crawl_confidence": "high",
                "crawl_errors": [],
            },
        })

    assert result["requires_review"] is True
    assert result["compliance_score"] == 85

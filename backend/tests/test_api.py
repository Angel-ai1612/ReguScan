"""
API smoke tests — run without live DB/Redis via environment mocking.
"""
import os
import pytest

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


@pytest.fixture
async def client():
    """
    Test client patching DB and Redis dependencies.
    Authenticated routes return 403 (no token) or 401 (bad token).
    """
    mock_redis = AsyncMock()
    mock_redis.aclose = AsyncMock()
    mock_redis.pubsub = MagicMock(return_value=AsyncMock())

    # Patch at the dependency level, not module level
    async def mock_get_db():
        yield AsyncMock()

    with (
        patch("app.core.redis_client.redis_client", mock_redis),
        patch("app.core.redis_client.limiter", MagicMock()),
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


# ─── Gap analyzer unit tests (no external deps) ──────────────────────────────

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

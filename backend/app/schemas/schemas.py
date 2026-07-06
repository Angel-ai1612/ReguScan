"""Pydantic schemas for request/response validation."""
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, field_validator

from app.core.url_safety import UnsafeUrlError, normalize_website_url


# ─── Base ────────────────────────────────────────────────────────────────────

class TimestampMixin(BaseModel):
    created_at: datetime
    updated_at: datetime | None = None


# ─── Organization ─────────────────────────────────────────────────────────────

class OrgCreate(BaseModel):
    name: str
    slug: str | None = None


class OrgUpdate(BaseModel):
    name: str | None = None
    settings: dict | None = None


class OrgOut(TimestampMixin):
    id: str
    name: str
    slug: str
    plan: str
    subscription_status: str
    usage_limits: dict

    model_config = ConfigDict(from_attributes=True)


# ─── User ─────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: str
    clerk_id: str
    email: str
    first_name: str | None
    last_name: str | None
    avatar_url: str | None
    org_id: str | None
    role: str

    model_config = ConfigDict(from_attributes=True)


# ─── Website ──────────────────────────────────────────────────────────────────

class WebsiteCreate(BaseModel):
    url: str
    name: str | None = None
    description: str | None = None
    scan_settings: dict | None = None

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        try:
            return normalize_website_url(v)
        except UnsafeUrlError as exc:
            raise ValueError(str(exc)) from exc


class WebsiteUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    scan_settings: dict | None = None


class WebsiteOut(TimestampMixin):
    id: str
    org_id: str
    url: str
    name: str | None
    description: str | None
    screenshot_url: str | None
    favicon_url: str | None
    last_scan_at: datetime | None
    compliance_score: int | None
    overall_risk_tier: str | None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


# ─── Scan ─────────────────────────────────────────────────────────────────────

class ScanTrigger(BaseModel):
    triggered_by: str = "manual"


class ScanOut(BaseModel):
    id: str
    website_id: str
    status: str
    stage: str | None
    progress_percent: int
    started_at: datetime | None
    completed_at: datetime | None
    failed_at: datetime | None
    error_message: str | None
    crawl_results: dict | None
    classification_results: dict | None
    gap_summary: dict | None
    compliance_score: int | None
    estimated_fine_exposure: dict | None
    report_url: str | None
    triggered_by: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ─── AI System ────────────────────────────────────────────────────────────────

class AISystemOut(TimestampMixin):
    id: str
    website_id: str
    scan_id: str
    name: str
    system_type: str
    provider: str | None
    risk_category: str
    risk_category_confidence: float | None
    classification_reasoning: str | None
    applicable_articles: list[str] | None
    detection_evidence: dict | None
    page_url: str | None
    is_active: bool
    manually_overridden: bool

    model_config = ConfigDict(from_attributes=True)


class AISystemOverride(BaseModel):
    risk_category: str
    override_reason: str


# ─── Gap ──────────────────────────────────────────────────────────────────────

class GapOut(BaseModel):
    id: str
    ai_system_id: str
    scan_id: str
    obligation_code: str
    obligation_description: str
    severity: str
    status: str
    remediation_suggestion: str | None
    remediation_code_snippet: str | None
    resolved_at: datetime | None
    created_at: datetime
    ai_system_name: str | None = None
    ai_system_type: str | None = None
    ai_system_provider: str | None = None
    ai_system_risk_category: str | None = None
    ai_system_confidence: float | None = None
    ai_system_page_url: str | None = None
    ai_system_detection_evidence: dict | None = None
    ai_system_reasoning: str | None = None
    ai_system_articles: list[str] | None = None

    model_config = ConfigDict(from_attributes=True)


class GapListOut(BaseModel):
    items: list[GapOut]
    locked_count: int = 0
    plan: str
    max_visible_gaps: int


class GapStatusUpdate(BaseModel):
    status: str
    resolution_notes: str | None = None


# ─── Document ─────────────────────────────────────────────────────────────────

class DocumentCreate(BaseModel):
    document_type: str
    ai_system_id: str | None = None


class DocumentOut(TimestampMixin):
    id: str
    org_id: str
    ai_system_id: str | None
    document_type: str
    title: str
    content_markdown: str
    status: str
    version: int
    pdf_url: str | None

    model_config = ConfigDict(from_attributes=True)


# ─── Billing ──────────────────────────────────────────────────────────────────

class RazorpayOrderCreate(BaseModel):
    plan: str
    billing_period: str = "monthly"


class RazorpayOrderOut(BaseModel):
    key_id: str
    order_id: str
    amount: int
    currency: str
    plan: str
    subscription_status: str


class RazorpayPaymentVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class RazorpayPaymentVerifyOut(BaseModel):
    status: str


class UsageOut(BaseModel):
    plan: str
    subscription_status: str
    scans_used: int
    scans_used_this_month: int
    scans_used_total: int
    scans_limit: int
    scan_limit_scope: str
    remaining_scans: int
    websites_used: int
    websites_limit: int
    remaining_websites: int
    period_start: datetime | None
    period_end: datetime | None
    billing_available: bool
    payment_status: str | None
    plan_features: dict[str, Any]


# ─── WebSocket events ─────────────────────────────────────────────────────────

class WSEvent(BaseModel):
    event: str
    data: dict[str, Any]


# ─── Pagination ───────────────────────────────────────────────────────────────

class PaginatedResponse(BaseModel):
    items: list[Any]
    total: int
    page: int
    page_size: int
    pages: int

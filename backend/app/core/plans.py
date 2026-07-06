"""Backend source of truth for billing plans and feature limits."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Literal

UNLIMITED = -1


@dataclass(frozen=True)
class PlanConfig:
    id: str
    name: str
    price_label: str
    websites: int
    pages_per_scan: int
    scans_total: int | None = None
    scans_per_month: int | None = None
    full_gap_analysis: bool = False
    max_visible_gaps: int = 3
    email_alerts: bool = False
    pdf_reports: bool = False
    pdf_reports_status: Literal["available", "coming_soon", "not_included"] = "not_included"
    api_access: bool = False
    api_access_status: Literal["available", "coming_soon", "not_included"] = "not_included"
    custom_contact_required: bool = False
    razorpay_plan_id_attr: str | None = None
    amount_minor: int | None = None

    @property
    def scan_limit(self) -> int:
        if self.scans_total is not None:
            return self.scans_total
        if self.scans_per_month is not None:
            return self.scans_per_month
        return UNLIMITED

    @property
    def scan_limit_scope(self) -> str:
        if self.scans_total is not None:
            return "total"
        if self.scans_per_month is not None:
            return "monthly"
        return "unlimited"

    def public_features(self) -> dict:
        data = asdict(self)
        data["scan_limit"] = self.scan_limit
        data["scan_limit_scope"] = self.scan_limit_scope
        return data


PLAN_CONFIG: dict[str, PlanConfig] = {
    "free": PlanConfig(
        id="free",
        name="Free",
        price_label="$0",
        websites=1,
        scans_total=1,
        pages_per_scan=10,
        full_gap_analysis=False,
        max_visible_gaps=3,
        email_alerts=False,
        pdf_reports=False,
        pdf_reports_status="not_included",
        api_access=False,
        api_access_status="not_included",
    ),
    "starter": PlanConfig(
        id="starter",
        name="Starter",
        price_label="$49/mo",
        websites=3,
        scans_per_month=10,
        pages_per_scan=100,
        full_gap_analysis=True,
        max_visible_gaps=UNLIMITED,
        email_alerts=True,
        pdf_reports=False,
        pdf_reports_status="coming_soon",
        api_access=False,
        api_access_status="not_included",
        razorpay_plan_id_attr="RAZORPAY_PLAN_STARTER",
        amount_minor=4900,
    ),
    "pro": PlanConfig(
        id="pro",
        name="Pro",
        price_label="$199/mo",
        websites=10,
        scans_per_month=100,
        pages_per_scan=500,
        full_gap_analysis=True,
        max_visible_gaps=UNLIMITED,
        email_alerts=True,
        pdf_reports=False,
        pdf_reports_status="coming_soon",
        api_access=False,
        api_access_status="coming_soon",
        razorpay_plan_id_attr="RAZORPAY_PLAN_PRO",
        amount_minor=19900,
    ),
    "enterprise": PlanConfig(
        id="enterprise",
        name="Enterprise",
        price_label="Custom",
        websites=UNLIMITED,
        scans_per_month=UNLIMITED,
        pages_per_scan=UNLIMITED,
        full_gap_analysis=True,
        max_visible_gaps=UNLIMITED,
        email_alerts=True,
        pdf_reports=False,
        pdf_reports_status="coming_soon",
        api_access=False,
        api_access_status="coming_soon",
        custom_contact_required=True,
    ),
}

PAID_SELF_SERVE_PLANS = {"starter", "pro"}


def get_plan_config(plan: str | None) -> PlanConfig:
    return PLAN_CONFIG.get(plan or "free", PLAN_CONFIG["free"])


def get_paid_plan_config(plan: str | None) -> PlanConfig | None:
    if plan not in PAID_SELF_SERVE_PLANS:
        return None
    return PLAN_CONFIG[plan]


def is_unlimited(limit: int | None) -> bool:
    return limit == UNLIMITED


def remaining_limit(limit: int, used: int) -> int:
    if is_unlimited(limit):
        return UNLIMITED
    return max(0, limit - used)


def scan_limit_message(plan: PlanConfig) -> str:
    if plan.id == "free":
        return "Free plan includes 1 scan. Upgrade to Starter for 10 scans/month."
    if plan.id == "starter":
        return "Starter plan includes 10 scans/month. Upgrade to Pro for 100 scans/month."
    if plan.id == "pro":
        return "Pro plan includes 100 scans/month. Contact sales for enterprise access."
    return "Scan limit reached for this plan."


def website_limit_message(plan: PlanConfig) -> str:
    if plan.id == "free":
        return "Free plan includes 1 website. Upgrade to Starter for 3 websites."
    if plan.id == "starter":
        return "Starter plan includes 3 websites. Upgrade to Pro for 10 websites."
    if plan.id == "pro":
        return "Pro plan includes 10 websites. Contact sales for enterprise access."
    return "Website limit reached for this plan."

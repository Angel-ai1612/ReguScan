from app.utils.async_helpers import run_async
"""Notification task — email users when scan completes."""
import re

import structlog
import resend
from app.core.config import settings
from app.tasks.celery_app import celery_app

logger = structlog.get_logger(__name__)
EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")


def _safe_error(error: Exception) -> str:
    return EMAIL_RE.sub("[redacted-email]", str(error))


@celery_app.task(name="app.tasks.notifier.notify_scan_complete", max_retries=3)
def notify_scan_complete(scan_id: str):
    """Send scan completion email to org owner."""
    try:
        run_async(_send_completion_email(scan_id))
    except Exception as exc:
        safe_error = _safe_error(exc)
        logger.warning(
            "scan_completion_email_failed",
            scan_id=scan_id,
            error=safe_error,
        )
        return {"status": "failed", "error": safe_error}


async def _send_completion_email(scan_id: str):
    from sqlalchemy import select
    from app.db.session import AsyncSessionLocal
    from app.models.models import Scan, User, Website

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Scan, Website)
            .join(Website, Scan.website_id == Website.id)
            .where(Scan.id == scan_id)
        )
        row = result.first()
        if not row:
            return
        scan, website = row

        # Get org owner
        owner = await db.scalar(
            select(User).where(
                User.org_id == website.org_id,
                User.role == "owner",
            )
        )
        if not owner or not settings.RESEND_API_KEY:
            return

        score = scan.compliance_score or 0
        score_emoji = "✅" if score >= 85 else ("⚠️" if score >= 60 else "🚨")
        gap_summary = scan.gap_summary or {}

        resend.api_key = settings.RESEND_API_KEY
        recipient = owner.email
        if settings.APP_ENV != "production" and settings.RESEND_TEST_RECIPIENT:
            recipient = settings.RESEND_TEST_RECIPIENT

        resend.Emails.send({
            "from": settings.FROM_EMAIL,
            "to": [recipient],
            "subject": f"{score_emoji} Scan complete: {website.name or website.url} — Score {score}/100",
            "html": _build_email_html(
                name=owner.first_name or "there",
                website_url=website.url,
                website_name=website.name or website.url,
                score=score,
                gap_summary=gap_summary,
                report_url=scan.report_url or f"https://app.reguscan.com/scans/{scan_id}",
                scan_id=scan_id,
            ),
        })


def _build_email_html(
    name: str,
    website_url: str,
    website_name: str,
    score: int,
    gap_summary: dict,
    report_url: str,
    scan_id: str,
) -> str:
    score_color = "#22c55e" if score >= 85 else ("#f97316" if score >= 60 else "#ef4444")
    critical = gap_summary.get("critical", 0)
    high = gap_summary.get("high", 0)

    urgency = ""
    if critical > 0:
        urgency = f"<p style='color:#ef4444;font-weight:600;'>🚨 {critical} critical gap(s) require immediate attention.</p>"
    elif high > 0:
        urgency = f"<p style='color:#f97316;font-weight:600;'>⚠️ {high} high-severity gap(s) need to be addressed before August 2, 2026.</p>"

    return f"""
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;">
  <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:32px;border-radius:12px 12px 0 0;">
    <h1 style="color:white;font-size:22px;margin:0;">ReguScan Compliance Report</h1>
    <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;">EU AI Act Compliance Scanner</p>
  </div>
  <div style="background:#f8f9fa;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e8e8f0;border-top:none;">
    <p>Hi {name},</p>
    <p>Your compliance scan for <strong>{website_name}</strong> is complete.</p>
    
    <div style="text-align:center;margin:24px 0;padding:24px;background:white;border-radius:10px;border:1px solid #e8e8f0;">
      <div style="font-size:48px;font-weight:800;color:{score_color};">{score}</div>
      <div style="color:#6b7280;font-size:14px;">Compliance Score out of 100</div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;">
      <div style="text-align:center;padding:12px;background:white;border-radius:8px;">
        <div style="font-size:22px;font-weight:700;color:#ef4444;">{gap_summary.get('critical', 0)}</div>
        <div style="font-size:11px;color:#9ca3af;">Critical</div>
      </div>
      <div style="text-align:center;padding:12px;background:white;border-radius:8px;">
        <div style="font-size:22px;font-weight:700;color:#f97316;">{gap_summary.get('high', 0)}</div>
        <div style="font-size:11px;color:#9ca3af;">High</div>
      </div>
      <div style="text-align:center;padding:12px;background:white;border-radius:8px;">
        <div style="font-size:22px;font-weight:700;color:#eab308;">{gap_summary.get('medium', 0)}</div>
        <div style="font-size:11px;color:#9ca3af;">Medium</div>
      </div>
      <div style="text-align:center;padding:12px;background:white;border-radius:8px;">
        <div style="font-size:22px;font-weight:700;color:#22c55e;">{gap_summary.get('low', 0)}</div>
        <div style="font-size:11px;color:#9ca3af;">Low</div>
      </div>
    </div>

    {urgency}

    <a href="{report_url}" style="display:block;text-align:center;background:#1a1a2e;color:white;
       padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:20px;">
      View Full Compliance Report →
    </a>

    <p style="color:#9ca3af;font-size:12px;margin-top:24px;text-align:center;">
      EU AI Act high-risk obligations are enforceable from August 2, 2026.<br>
      This is not legal advice. ReguScan · Unsubscribe
    </p>
  </div>
</div>
"""

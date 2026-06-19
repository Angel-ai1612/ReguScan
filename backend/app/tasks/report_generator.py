from app.utils.async_helpers import run_async
"""Report generator — computes compliance score and generates PDF report."""
import asyncio
import math
from datetime import datetime, timezone
from jinja2 import Environment, BaseLoader

from app.tasks.celery_app import celery_app
from app.core.config import settings

# ─── Compliance score weights ─────────────────────────────────────────────────
SEVERITY_WEIGHTS = {"critical": 25, "high": 15, "medium": 8, "low": 3}
BASE_SCORE = 100


def compile_report(scan_id: str, gap_data: dict) -> dict:
    """Calculate compliance score, generate HTML report, upload to R2."""
    gaps = gap_data.get("gaps", [])
    gap_summary = gap_data.get("gap_summary", {})
    classified_systems = gap_data.get("classified_systems", [])
    overall_risk_tier = gap_data.get("overall_risk_tier", "minimal")
    fine_exposure = gap_data.get("estimated_fine_exposure", {})

    # ── Compliance score ──
    deductions = sum(
        SEVERITY_WEIGHTS.get(sev, 0) * count
        for sev, count in gap_summary.items()
    )
    compliance_score = max(0, BASE_SCORE - deductions)

    # ── Generate HTML report ──
    report_html = _render_report(
        scan_id=scan_id,
        base_url=gap_data.get("base_url", ""),
        classified_systems=classified_systems,
        gaps=gaps,
        gap_summary=gap_summary,
        compliance_score=compliance_score,
        overall_risk_tier=overall_risk_tier,
        fine_exposure=fine_exposure,
    )

    # ── Upload to Cloudflare R2 ──
    report_url = run_async(_upload_report(scan_id, report_html))

    return {
        "scan_id": scan_id,
        "compliance_score": compliance_score,
        "overall_risk_tier": overall_risk_tier,
        "gap_summary": gap_summary,
        "classification_results": {
            "systems_count": len(classified_systems),
            "overall_tier": overall_risk_tier,
            "systems": [
                {
                    "name": s["name"],
                    "type": s["system_type"],
                    "risk_category": s.get("classification", {}).get("risk_category", "minimal"),
                    "confidence": s.get("classification", {}).get("confidence", 0),
                }
                for s in classified_systems
            ],
        },
        "estimated_fine_exposure": fine_exposure,
        "report_url": report_url,
    }


REPORT_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>EU AI Act Compliance Report — {{ base_url }}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
         color: #1a1a2e; background: #fff; font-size: 14px; line-height: 1.6; }
  .header { background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; 
             padding: 40px; }
  .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
  .header .subtitle { opacity: 0.7; font-size: 14px; }
  .score-banner { background: {{ score_color }}; color: white; 
                  padding: 24px 40px; display: flex; align-items: center; gap: 24px; }
  .score-number { font-size: 56px; font-weight: 800; line-height: 1; }
  .score-label { font-size: 16px; opacity: 0.9; }
  .container { max-width: 900px; margin: 0 auto; padding: 40px; }
  .section { margin-bottom: 40px; }
  .section-title { font-size: 18px; font-weight: 700; color: #1a1a2e; 
                   border-bottom: 2px solid #e8e8f0; padding-bottom: 8px; margin-bottom: 20px; }
  .systems-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  .system-card { border: 1px solid #e8e8f0; border-radius: 10px; padding: 16px; }
  .risk-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; 
                font-size: 11px; font-weight: 600; text-transform: uppercase; }
  .risk-prohibited { background: #fee2e2; color: #991b1b; }
  .risk-high { background: #fef3c7; color: #92400e; }
  .risk-limited { background: #dbeafe; color: #1e40af; }
  .risk-minimal { background: #dcfce7; color: #166534; }
  .gap-item { border-left: 3px solid #e8e8f0; padding: 12px 16px; 
              margin-bottom: 12px; border-radius: 0 8px 8px 0; background: #fafafa; }
  .gap-critical { border-left-color: #ef4444; }
  .gap-high { border-left-color: #f97316; }
  .gap-medium { border-left-color: #eab308; }
  .gap-low { border-left-color: #22c55e; }
  .severity-tag { font-size: 11px; font-weight: 700; text-transform: uppercase; }
  .obligation-code { font-family: monospace; font-size: 12px; color: #6b7280; 
                     background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
  .code-block { background: #1a1a2e; color: #a8ff78; font-family: monospace; 
                font-size: 12px; padding: 16px; border-radius: 8px; 
                overflow-x: auto; margin-top: 8px; white-space: pre-wrap; }
  .fine-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .fine-card { text-align: center; padding: 20px; border: 1px solid #e8e8f0; border-radius: 10px; }
  .fine-amount { font-size: 24px; font-weight: 700; color: #ef4444; }
  .fine-label { font-size: 12px; color: #6b7280; margin-top: 4px; }
  .footer { background: #f8f9fa; padding: 24px 40px; text-align: center; 
             color: #9ca3af; font-size: 12px; margin-top: 40px; }
  .summary-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card { text-align: center; padding: 16px; background: #f8f9fa; border-radius: 10px; }
  .stat-number { font-size: 28px; font-weight: 700; }
  .stat-label { font-size: 12px; color: #6b7280; margin-top: 2px; }
  .critical-num { color: #ef4444; } .high-num { color: #f97316; }
  .medium-num { color: #eab308; } .low-num { color: #22c55e; }
</style>
</head>
<body>

<div class="header">
  <h1>EU AI Act Compliance Report</h1>
  <div class="subtitle">{{ base_url }} &nbsp;·&nbsp; Generated {{ generated_at }}</div>
</div>

<div class="score-banner" style="background: {{ score_color }};">
  <div>
    <div class="score-number">{{ compliance_score }}</div>
    <div class="score-label">Compliance Score (out of 100)</div>
  </div>
  <div style="opacity:0.85;">
    <div style="font-size:18px; font-weight:600;">{{ risk_label }}</div>
    <div>Highest risk tier detected: <strong>{{ overall_risk_tier | upper }}</strong></div>
  </div>
</div>

<div class="container">

  <!-- Summary Stats -->
  <div class="summary-stats">
    <div class="stat-card">
      <div class="stat-number critical-num">{{ gap_summary.critical }}</div>
      <div class="stat-label">Critical Gaps</div>
    </div>
    <div class="stat-card">
      <div class="stat-number high-num">{{ gap_summary.high }}</div>
      <div class="stat-label">High Gaps</div>
    </div>
    <div class="stat-card">
      <div class="stat-number medium-num">{{ gap_summary.medium }}</div>
      <div class="stat-label">Medium Gaps</div>
    </div>
    <div class="stat-card">
      <div class="stat-number low-num">{{ gap_summary.low }}</div>
      <div class="stat-label">Low Gaps</div>
    </div>
  </div>

  <!-- Fine Exposure -->
  {% if fine_exposure.tier1 > 0 or fine_exposure.tier2 > 0 %}
  <div class="section">
    <div class="section-title">⚠️ Estimated Fine Exposure</div>
    <div class="fine-grid">
      <div class="fine-card">
        <div class="fine-amount">€{{ "{:,}".format(fine_exposure.tier1) }}</div>
        <div class="fine-label">Tier 1 — Prohibited Practices (Art.5)<br>Up to 7% global turnover</div>
      </div>
      <div class="fine-card">
        <div class="fine-amount">€{{ "{:,}".format(fine_exposure.tier2) }}</div>
        <div class="fine-label">Tier 2 — High-risk / Transparency (Art.9–50)<br>Up to 3% global turnover</div>
      </div>
      <div class="fine-card">
        <div class="fine-amount">€{{ "{:,}".format(fine_exposure.tier3) }}</div>
        <div class="fine-label">Tier 3 — Incorrect Information (Art.99)<br>Up to 1.5% global turnover</div>
      </div>
    </div>
    <p style="color:#9ca3af; font-size:12px; margin-top:12px;">
      * Figures represent statutory maximums. Actual fines depend on company turnover, 
      intent, and regulator discretion. This is not legal advice.
    </p>
  </div>
  {% endif %}

  <!-- Detected AI Systems -->
  <div class="section">
    <div class="section-title">🤖 Detected AI Systems ({{ classified_systems | length }})</div>
    <div class="systems-grid">
      {% for system in classified_systems %}
      {% set clf = system.classification %}
      <div class="system-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <strong style="font-size:14px;">{{ system.name }}</strong>
          <span class="risk-badge risk-{{ clf.risk_category }}">{{ clf.risk_category }}</span>
        </div>
        <div style="color:#6b7280; font-size:12px; margin-bottom:8px;">
          {{ system.system_type | replace('_', ' ') | title }} &nbsp;·&nbsp; {{ system.provider or 'Unknown' }}
        </div>
        <div style="font-size:12px; color:#374151;">{{ clf.reasoning[:200] }}{% if clf.reasoning|length > 200 %}...{% endif %}</div>
        <div style="margin-top:8px; font-size:11px; color:#9ca3af;">
          Articles: {{ clf.applicable_articles | join(', ') }}
          &nbsp;·&nbsp; Confidence: {{ (clf.confidence * 100) | round | int }}%
        </div>
      </div>
      {% endfor %}
    </div>
  </div>

  <!-- Compliance Gaps -->
  <div class="section">
    <div class="section-title">📋 Compliance Gaps & Remediation</div>
    {% for gap in gaps %}
    <div class="gap-item gap-{{ gap.severity }}">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
        <span class="obligation-code">{{ gap.obligation_code }}</span>
        <span class="severity-tag" style="color:
          {% if gap.severity == 'critical' %}#ef4444
          {% elif gap.severity == 'high' %}#f97316
          {% elif gap.severity == 'medium' %}#eab308
          {% else %}#22c55e{% endif %}">
          {{ gap.severity }}
        </span>
        <span style="font-size:12px; color:#9ca3af;">{{ gap.system_name }}</span>
      </div>
      <div style="font-weight:600; margin-bottom:4px; font-size:13px;">{{ gap.obligation_description }}</div>
      {% if gap.remediation_suggestion %}
      <div style="color:#374151; font-size:13px; margin-top:6px;">
        <strong>Fix:</strong> {{ gap.remediation_suggestion }}
      </div>
      {% endif %}
      {% if gap.remediation_code_snippet %}
      <div class="code-block">{{ gap.remediation_code_snippet }}</div>
      {% endif %}
    </div>
    {% endfor %}
  </div>

</div>

<div class="footer">
  Generated by ReguScan &nbsp;·&nbsp; {{ generated_at }}<br>
  This report is for informational purposes only and does not constitute legal advice.<br>
  EU AI Act (Regulation 2024/1689) — High-risk obligations enforceable from August 2, 2026.
</div>
</body>
</html>"""


def _render_report(
    scan_id: str,
    base_url: str,
    classified_systems: list,
    gaps: list,
    gap_summary: dict,
    compliance_score: int,
    overall_risk_tier: str,
    fine_exposure: dict,
) -> str:
    score_colors = {
        range(0, 40): "#ef4444",
        range(40, 70): "#f97316",
        range(70, 85): "#eab308",
        range(85, 101): "#22c55e",
    }
    score_color = "#22c55e"
    for r, color in score_colors.items():
        if compliance_score in r:
            score_color = color
            break

    risk_labels = {
        "prohibited": "🚨 Prohibited AI Practice Detected",
        "high": "⚠️ High-Risk AI System",
        "limited": "ℹ️ Limited-Risk — Transparency Required",
        "minimal": "✅ Minimal Risk",
    }

    env = Environment(loader=BaseLoader())
    template = env.from_string(REPORT_TEMPLATE)
    return template.render(
        scan_id=scan_id,
        base_url=base_url,
        classified_systems=classified_systems,
        gaps=gaps,
        gap_summary=gap_summary,
        compliance_score=compliance_score,
        overall_risk_tier=overall_risk_tier,
        fine_exposure=fine_exposure,
        score_color=score_color,
        risk_label=risk_labels.get(overall_risk_tier, "✅ Compliant"),
        generated_at=datetime.now(timezone.utc).strftime("%B %d, %Y %H:%M UTC"),
    )


async def _upload_report(scan_id: str, html: str) -> str | None:
    """Upload HTML report to Cloudflare R2. Returns public URL."""
    try:
        import boto3
        from botocore.config import Config

        if not settings.R2_ACCOUNT_ID:
            return None

        s3 = boto3.client(
            "s3",
            endpoint_url=f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=settings.R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
            config=Config(signature_version="s3v4"),
            region_name="auto",
        )

        key = f"reports/{scan_id}/report.html"
        s3.put_object(
            Bucket=settings.R2_BUCKET,
            Key=key,
            Body=html.encode(),
            ContentType="text/html",
        )

        return f"{settings.R2_PUBLIC_URL}/{key}" if settings.R2_PUBLIC_URL else None
    except Exception:
        return None

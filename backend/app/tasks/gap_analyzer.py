"""Gap analysis rule engine — maps risk tiers to compliance obligations and identifies gaps."""
from app.utils.async_helpers import run_async

# ─── Obligation Rules ─────────────────────────────────────────────────────────

PROHIBITED_GAPS = [
    {
        "obligation_code": "Art.5.1",
        "obligation_description": "Prohibited AI practice detected. This system must be immediately removed from service.",
        "severity": "critical",
        "remediation_suggestion": "Cease all deployment of this AI system immediately. Article 5 of the EU AI Act prohibits this practice with fines up to €35M or 7% of global turnover.",
        "remediation_code_snippet": None,
    },
]

HIGH_RISK_GAPS = [
    {
        "obligation_code": "Art.9.1",
        "obligation_description": "No risk management system documented for this high-risk AI system.",
        "severity": "critical",
        "remediation_suggestion": "Establish a continuous risk management system per Art.9. Document risk identification, estimation, evaluation, and mitigation measures. Update throughout the system lifecycle.",
        "remediation_code_snippet": None,
    },
    {
        "obligation_code": "Art.10.1",
        "obligation_description": "Training, validation and testing data governance practices not documented.",
        "severity": "high",
        "remediation_suggestion": "Document data governance practices: data sources, collection methods, preprocessing steps, bias analysis, and data quality metrics.",
        "remediation_code_snippet": None,
    },
    {
        "obligation_code": "Art.12.1",
        "obligation_description": "No logging/record-keeping system in place for AI system inputs and outputs.",
        "severity": "high",
        "remediation_suggestion": "Implement logging for all AI system decisions. Store: timestamp, input summary (hashed), output, confidence score, and any human override actions.",
        "remediation_code_snippet": """# Example: FastAPI audit logging middleware
@app.middleware("http")
async def ai_audit_log(request: Request, call_next):
    response = await call_next(request)
    if "/ai/" in request.url.path:
        await log_ai_decision({
            "timestamp": datetime.utcnow().isoformat(),
            "endpoint": request.url.path,
            "status": response.status_code,
        })
    return response""",
    },
    {
        "obligation_code": "Art.13.1",
        "obligation_description": "No transparency documentation for deployers/users of this high-risk AI system.",
        "severity": "high",
        "remediation_suggestion": "Create and publish instructions for use covering: system capabilities and limitations, performance metrics, intended purpose, known biases, human oversight requirements.",
        "remediation_code_snippet": None,
    },
    {
        "obligation_code": "Art.14.1",
        "obligation_description": "No human oversight mechanism documented or implemented.",
        "severity": "critical",
        "remediation_suggestion": "Implement human-in-the-loop controls: ability for humans to override AI decisions, escalation workflows, and documented procedures for human review of high-stakes decisions.",
        "remediation_code_snippet": """<!-- Example: Human oversight UI component -->
<div class="ai-decision-review">
  <p>AI Recommendation: <strong>{recommendation}</strong></p>
  <p>Confidence: {confidence}%</p>
  <button onclick="approveDecision()">Approve</button>
  <button onclick="overrideDecision()">Override</button>
  <button onclick="requestHumanReview()">Escalate to Human</button>
</div>""",
    },
    {
        "obligation_code": "AnnexIV.1",
        "obligation_description": "Technical documentation (Annex IV) not prepared for this high-risk system.",
        "severity": "high",
        "remediation_suggestion": "Prepare Annex IV technical documentation covering: general description, development process, monitoring and functioning, data used, capabilities and limitations.",
        "remediation_code_snippet": None,
    },
]

LIMITED_RISK_GAPS = [
    {
        "obligation_code": "Art.50.1",
        "obligation_description": "No AI interaction disclosure for chatbot/virtual assistant. Users must be informed they are interacting with AI.",
        "severity": "high",
        "remediation_suggestion": "Add a clear, visible disclosure before or at the start of AI interactions. The notice must be clear and conspicuous.",
        "remediation_code_snippet": """<!-- Add this before your chat widget initializes -->
<div id="ai-disclosure-banner" style="
  background: #fff3cd; 
  border: 1px solid #ffc107; 
  padding: 12px 16px; 
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 8px;
">
  <strong>🤖 AI Assistant Notice:</strong> 
  You are about to interact with an AI-powered assistant. 
  This is not a human agent. 
  <a href="/privacy#ai-use">Learn more</a>
</div>

<script>
// Show disclosure before chat opens
document.getElementById('ai-disclosure-banner').style.display = 'block';
// Hide after user acknowledges (optional)
</script>""",
    },
    {
        "obligation_code": "Art.50.4",
        "obligation_description": "AI-generated content not labeled with machine-readable markers.",
        "severity": "medium",
        "remediation_suggestion": "Add machine-readable C2PA metadata and human-visible labels to all AI-generated content (images, audio, video, text).",
        "remediation_code_snippet": """// Add visible AI content label
function labelAIContent(element) {
  const label = document.createElement('div');
  label.className = 'ai-content-label';
  label.innerHTML = '🤖 AI-generated content';
  label.style.cssText = 'font-size:11px;color:#666;margin-top:4px;';
  element.parentNode.insertBefore(label, element.nextSibling);
}

// Label all AI images
document.querySelectorAll('img[data-ai-generated]').forEach(labelAIContent);""",
    },
]

ALL_RISK_GAPS = [
    {
        "obligation_code": "Art.4.1",
        "obligation_description": "No AI literacy program documented for staff who interact with or oversee AI systems.",
        "severity": "low",
        "remediation_suggestion": "Implement an AI literacy training program for relevant staff. Document training completion. Include: AI capabilities, limitations, risks, and oversight responsibilities.",
        "remediation_code_snippet": None,
    },
]

RISK_GAP_MAP = {
    "prohibited": PROHIBITED_GAPS + ALL_RISK_GAPS,
    "high": HIGH_RISK_GAPS + ALL_RISK_GAPS,
    "limited": LIMITED_RISK_GAPS + ALL_RISK_GAPS,
    "minimal": ALL_RISK_GAPS,
}

# Fine exposure estimates (conservative, per system)
FINE_EXPOSURE_MAP = {
    "prohibited": {"tier1": 35_000_000, "tier2": 0, "tier3": 0},
    "high": {"tier1": 0, "tier2": 15_000_000, "tier3": 0},
    "limited": {"tier1": 0, "tier2": 15_000_000, "tier3": 0},
    "minimal": {"tier1": 0, "tier2": 0, "tier3": 7_500_000},
}


def analyze_gaps(scan_id: str, classification_data: dict) -> dict:
    """Generate compliance gaps for each classified AI system."""
    classified_systems = classification_data.get("classified_systems", [])
    all_gaps: list[dict] = []
    gap_summary = {"critical": 0, "high": 0, "medium": 0, "low": 0}
    total_fine_exposure = {"tier1": 0, "tier2": 0, "tier3": 0}

    for system in classified_systems:
        clf = system.get("classification", {})
        risk_category = clf.get("risk_category", "minimal")
        system_gaps = RISK_GAP_MAP.get(risk_category, ALL_RISK_GAPS)

        for gap_template in system_gaps:
            gap = {
                **gap_template,
                "system_name": system["name"],
                "system_type": system.get("system_type"),
                "system_page_url": system.get("page_url"),
                "detection_evidence": system.get("detection_evidence", {}),
                "detection_sources": system.get("detection_sources", []),
                "evidence_strength": system.get("evidence_strength", "weak"),
                "risk_category": risk_category,
                "classification_reasoning": clf.get("reasoning"),
                "applicable_articles": clf.get("applicable_articles", []),
                "confidence": clf.get("confidence"),
                "ai_system_index": classified_systems.index(system),
            }
            all_gaps.append(gap)
            gap_summary[gap["severity"]] += 1

        # Accumulate fine exposure (only count highest tier per system)
        exposure = FINE_EXPOSURE_MAP.get(risk_category, FINE_EXPOSURE_MAP["minimal"])
        for tier, amount in exposure.items():
            total_fine_exposure[tier] = max(total_fine_exposure[tier], amount)

    # Persist gaps to DB
    run_async(_save_gaps(scan_id, classified_systems, all_gaps))

    return {
        "scan_id": scan_id,
        "base_url": classification_data.get("base_url"),
        "classified_systems": classified_systems,
        "crawl_results": classification_data.get("crawl_results"),
        "gaps": all_gaps,
        "gap_summary": gap_summary,
        "overall_risk_tier": classification_data.get("overall_risk_tier", "minimal"),
        "estimated_fine_exposure": total_fine_exposure,
    }


async def _save_gaps(scan_id: str, classified_systems: list, gaps: list):
    """Persist gaps to DB, linked to their AI systems."""
    from sqlalchemy import delete, select
    from app.db.session import AsyncSessionLocal
    from app.models.models import AISystem, Gap

    async with AsyncSessionLocal() as db:
        await db.execute(delete(Gap).where(Gap.scan_id == scan_id))

        # Get all AI systems for this scan
        result = await db.execute(
            select(AISystem).where(AISystem.scan_id == scan_id)
        )
        ai_systems = result.scalars().all()

        for gap in gaps:
            idx = gap.get("ai_system_index", 0)
            ai_system = ai_systems[idx] if idx < len(ai_systems) else (ai_systems[0] if ai_systems else None)
            if not ai_system:
                continue

            gap_record = Gap(
                ai_system_id=ai_system.id,
                scan_id=scan_id,
                obligation_code=gap["obligation_code"],
                obligation_description=gap["obligation_description"],
                severity=gap["severity"],
                remediation_suggestion=gap.get("remediation_suggestion"),
                remediation_code_snippet=gap.get("remediation_code_snippet"),
            )
            db.add(gap_record)

        await db.commit()

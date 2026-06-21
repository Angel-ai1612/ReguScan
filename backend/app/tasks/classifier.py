"""LLM classification task — uses Groq (free) to classify AI systems per EU AI Act."""
import json
from app.utils.async_helpers import run_async
from groq import Groq

from app.core.config import settings
from app.tasks.celery_app import celery_app

CLASSIFICATION_SYSTEM_PROMPT = """You are an EU AI Act compliance expert. 
Classify AI systems detected on websites according to EU Regulation 2024/1689.

Classification tiers:
1. PROHIBITED (Art. 5): Social scoring, emotion recognition in workplace/education, 
   real-time biometric ID in public spaces, manipulation causing harm, exploitation of vulnerabilities.
2. HIGH (Annex III): Biometrics, critical infrastructure, education/vocational training, 
   employment/HR, essential private services (credit, insurance), law enforcement, 
   justice/democracy, migration/border control.
3. Art.6(3) EXCEPTION: If the system performs a narrow procedural task, improves human activity, 
   detects patterns without replacing human assessment, or is preparatory — NOT high-risk.
4. LIMITED (Art. 50): Chatbots interacting with humans, deepfakes/synthetic content, 
   emotion recognition (non-workplace), biometric categorization (non-sensitive attributes).
5. MINIMAL: All other AI systems not in above categories.

Respond ONLY with valid JSON, no markdown, no explanation outside JSON."""

CLASSIFICATION_USER_TEMPLATE = """Classify this AI system detected on a website:

Name: {name}
Type: {system_type}
Provider: {provider}
Detection evidence: {evidence}
Page URL: {page_url}
Initial risk hint from pattern matching: {risk_hint}

Output JSON exactly:
{{
    "risk_category": "prohibited|high|limited|minimal",
    "confidence": 0.0,
    "applicable_articles": ["Art.X"],
    "reasoning": "Brief explanation",
    "exceptions_considered": ["any Art.6(3) exceptions evaluated"],
    "obligations": ["Key compliance obligations for this system"]
}}"""


def classify_ai_systems(scan_id: str, detection_data: dict) -> dict:
    """Classify each detected AI system using Groq LLM."""
    client = Groq(api_key=settings.GROQ_API_KEY)
    detected = detection_data.get("detected_systems", [])
    classified = []

    for system in detected:
        try:
            classification = _classify_single(client, system)
        except Exception as e:
            # Fallback: use pattern-matching hint
            classification = _fallback_classify(system, str(e))

        classified.append({**system, "classification": classification})

    # Persist AI systems to DB
    run_async(_save_ai_systems(scan_id, detection_data, classified))

    return {
        "scan_id": scan_id,
        "base_url": detection_data.get("base_url"),
        "classified_systems": classified,
        "crawl_results": detection_data.get("crawl_results"),
        "overall_risk_tier": _get_highest_risk(classified),
    }


def _classify_single(client: Groq, system: dict) -> dict:
    """Call Groq API to classify one AI system."""
    prompt = CLASSIFICATION_USER_TEMPLATE.format(
        name=system["name"],
        system_type=system["system_type"],
        provider=system.get("provider", "Unknown"),
        evidence=json.dumps(system.get("detection_evidence", {})),
        page_url=system.get("page_url", ""),
        risk_hint=system.get("risk_hint", "unknown"),
    )

    response = client.chat.completions.create(
        model=settings.GROQ_MODEL_SMART,
        messages=[
            {"role": "system", "content": CLASSIFICATION_SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,
        max_tokens=512,
        response_format={"type": "json_object"},
    )

    content = response.choices[0].message.content
    result = json.loads(content)

    # Validate required fields
    required = ["risk_category", "confidence", "applicable_articles", "reasoning", "obligations"]
    for field in required:
        if field not in result:
            result[field] = _get_default(field, system)

    return result


def _fallback_classify(system: dict, error: str) -> dict:
    """Rule-based fallback when LLM fails."""
    hint_map = {
        "prohibited": ("prohibited", 0.7, ["Art.5"]),
        "high": ("high", 0.6, ["Annex III"]),
        "limited": ("limited", 0.8, ["Art.50"]),
        "minimal": ("minimal", 0.9, ["Art.4"]),
    }
    hint = system.get("risk_hint", "minimal")
    category, confidence, articles = hint_map.get(hint, ("minimal", 0.5, ["Art.4"]))

    return {
        "risk_category": category,
        "confidence": confidence,
        "applicable_articles": articles,
        "reasoning": f"Rule-based classification (LLM unavailable: {error})",
        "exceptions_considered": [],
        "obligations": _get_obligations_for_tier(category),
    }


def _get_highest_risk(classified: list[dict]) -> str:
    tiers = {"prohibited": 4, "high": 3, "limited": 2, "minimal": 1}
    highest = "minimal"
    for system in classified:
        cat = system.get("classification", {}).get("risk_category", "minimal")
        if tiers.get(cat, 0) > tiers.get(highest, 0):
            highest = cat
    return highest


def _get_obligations_for_tier(tier: str) -> list[str]:
    obligations = {
        "prohibited": ["Cease deployment immediately", "Art.5 prohibition applies"],
        "high": [
            "Risk management system (Art.9)",
            "Technical documentation (Annex IV)",
            "Human oversight plan (Art.14)",
            "Record-keeping system (Art.12)",
            "Transparency notice (Art.13)",
        ],
        "limited": [
            "AI interaction disclosure (Art.50)",
            "Label AI-generated content",
        ],
        "minimal": ["AI literacy training (Art.4)"],
    }
    return obligations.get(tier, ["AI literacy training (Art.4)"])


def _get_default(field: str, system: dict) -> object:
    defaults = {
        "risk_category": system.get("risk_hint", "minimal"),
        "confidence": 0.5,
        "applicable_articles": [],
        "reasoning": "Classification pending review",
        "obligations": [],
    }
    return defaults.get(field, None)


async def _save_ai_systems(scan_id: str, detection_data: dict, classified: list[dict]):
    """Persist classified AI systems to the database."""
    from sqlalchemy import delete, update
    from app.db.session import AsyncSessionLocal
    from app.models.models import AISystem, Gap, Scan

    async with AsyncSessionLocal() as db:
        await db.execute(delete(Gap).where(Gap.scan_id == scan_id))
        await db.execute(delete(AISystem).where(AISystem.scan_id == scan_id))

        for system in classified:
            clf = system.get("classification", {})
            ai = AISystem(
                website_id=await _get_website_id(db, scan_id),
                scan_id=scan_id,
                name=system["name"],
                system_type=system["system_type"],
                provider=system.get("provider"),
                risk_category=clf.get("risk_category", "minimal"),
                risk_category_confidence=clf.get("confidence"),
                classification_reasoning=clf.get("reasoning"),
                applicable_articles=clf.get("applicable_articles"),
                detection_evidence=system.get("detection_evidence"),
                page_url=system.get("page_url"),
            )
            db.add(ai)

        # Update scan crawl_results
        await db.execute(
            update(Scan).where(Scan.id == scan_id).values(
                crawl_results=detection_data.get("crawl_results")
            )
        )
        await db.commit()


async def _get_website_id(db, scan_id: str) -> str:
    from sqlalchemy import select
    from app.models.models import Scan
    result = await db.execute(select(Scan.website_id).where(Scan.id == scan_id))
    return result.scalar_one()

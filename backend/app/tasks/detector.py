"""AI system detector — pattern matching against crawl data."""
import re
from app.tasks.celery_app import celery_app

# ─── Detection Signatures ─────────────────────────────────────────────────────

CHATBOT_SIGNATURES = {
    "Intercom": {
        "scripts": ["widget.intercom.io", "js.intercomcdn.com"],
        "selectors": ["#intercom-container", "#intercom-frame"],
        "html_patterns": ["Intercom", "intercomSettings"],
        "provider": "Intercom",
        "type": "chatbot",
        "risk_hint": "limited",
    },
    "Drift": {
        "scripts": ["js.driftt.com", "js.drift.com"],
        "selectors": [".drift-conversation", "#drift-widget"],
        "html_patterns": ["drift.load", "DriftSDK"],
        "provider": "Drift",
        "type": "chatbot",
        "risk_hint": "limited",
    },
    "Zendesk Chat": {
        "scripts": ["ekr.zdassets.com", "static.zdassets.com"],
        "selectors": ["#web_widget", ".zopim"],
        "html_patterns": ["zE(", "zESettings"],
        "provider": "Zendesk",
        "type": "chatbot",
        "risk_hint": "limited",
    },
    "Tawk.to": {
        "scripts": ["embed.tawk.to"],
        "selectors": ["#tawkchat-container"],
        "html_patterns": ["Tawk_API", "tawkto"],
        "provider": "Tawk",
        "type": "chatbot",
        "risk_hint": "limited",
    },
    "Crisp": {
        "scripts": ["client.crisp.chat"],
        "selectors": ["#crisp-chatbox"],
        "html_patterns": ["CRISP_WEBSITE_ID", "CrispChat"],
        "provider": "Crisp",
        "type": "chatbot",
        "risk_hint": "limited",
    },
    "HubSpot Chat": {
        "scripts": ["js.hs-scripts.com", "js.hubspot.com"],
        "selectors": ["#hubspot-messages-iframe-container"],
        "html_patterns": ["HubSpot", "hsConversationsSettings"],
        "provider": "HubSpot",
        "type": "chatbot",
        "risk_hint": "limited",
    },
    "Custom OpenAI Chatbot": {
        "scripts": [],
        "selectors": ["[data-ai-chat]"],
        "network_patterns": ["api.openai.com/v1/chat", "completions"],
        "html_patterns": ["openai", "gpt-4", "gpt-3.5"],
        "provider": "OpenAI",
        "type": "chatbot",
        "risk_hint": "limited",
    },
    "Custom Anthropic Chatbot": {
        "network_patterns": ["api.anthropic.com/v1/messages"],
        "html_patterns": ["anthropic", "claude"],
        "scripts": [],
        "selectors": [],
        "provider": "Anthropic",
        "type": "chatbot",
        "risk_hint": "limited",
    },
}

AI_CONTENT_SIGNATURES = {
    "DALL-E Image Generator": {
        "network_patterns": ["api.openai.com/v1/images"],
        "html_patterns": ["DALL-E", "dall-e", "OpenAI image"],
        "meta_patterns": ["dall-e", "ai-generated"],
        "scripts": [],
        "selectors": [],
        "provider": "OpenAI",
        "type": "content_generation",
        "risk_hint": "limited",
    },
    "Midjourney": {
        "html_patterns": ["midjourney", "MJ\\d{6}"],
        "scripts": [],
        "selectors": [],
        "network_patterns": [],
        "meta_patterns": ["midjourney"],
        "provider": "Midjourney",
        "type": "content_generation",
        "risk_hint": "limited",
    },
    "Stable Diffusion": {
        "html_patterns": ["stable-diffusion", "stability.ai", "StabilityAI"],
        "network_patterns": ["api.stability.ai"],
        "scripts": [],
        "selectors": [],
        "meta_patterns": ["stable-diffusion"],
        "provider": "Stability AI",
        "type": "content_generation",
        "risk_hint": "limited",
    },
}

HIGH_RISK_SIGNATURES = {
    "Facial Recognition / Biometric System": {
        "scripts": ["face-api.js", "face-api.min.js", "azure-ai-vision"],
        "network_patterns": [
            "face.recognition", "biometric", "face/detect",
            "vision.googleapis.com", "rekognition", "face-api",
        ],
        "html_patterns": ["face recognition", "facial analysis", "biometric verification"],
        "selectors": [],
        "provider": "Unknown",
        "type": "biometric",
        "risk_hint": "high",
    },
    "Emotion Recognition System": {
        "scripts": ["emotion-detection", "affectiva"],
        "network_patterns": ["emotion/detect", "affectiva", "kairos", "emotion-recognition"],
        "html_patterns": ["emotion recognition", "emotion detection", "mood detection"],
        "selectors": [],
        "provider": "Unknown",
        "type": "emotion_recognition",
        "risk_hint": "prohibited",  # if workplace/education context
    },
    "Credit Scoring / Risk Assessment": {
        "scripts": [],
        "network_patterns": ["credit/score", "risk-score", "creditrisk", "underwriting"],
        "html_patterns": ["credit score", "loan eligibility", "creditworthiness", "credit assessment"],
        "selectors": ["input[name*='ssn']", "input[name*='income']", "input[id*='credit']"],
        "provider": "Unknown",
        "type": "credit_scoring",
        "risk_hint": "high",
    },
    "Recruitment / HR AI": {
        "scripts": ["lever.co", "greenhouse.io", "workable.com"],
        "network_patterns": ["resume-screen", "candidate-rank", "hr/screen", "ats"],
        "html_patterns": ["AI screening", "automated candidate", "resume parser", "candidate ranking"],
        "selectors": ["input[type='file'][accept*='.pdf']", "[data-resume-upload]"],
        "provider": "Unknown",
        "type": "recruitment",
        "risk_hint": "high",
    },
    "Social Scoring System": {
        "scripts": [],
        "network_patterns": ["social-score", "trust-score", "behavior-score"],
        "html_patterns": ["social credit", "trustworthiness score", "behavior scoring"],
        "selectors": [],
        "provider": "Unknown",
        "type": "social_scoring",
        "risk_hint": "prohibited",
    },
}

RECOMMENDATION_SIGNATURES = {
    "Recommendation Engine": {
        "scripts": ["recommendations.js", "algolia-recommend"],
        "network_patterns": ["recommend", "personalize", "collaborative-filter"],
        "html_patterns": ["recommended for you", "based on your", "you might like", "personalized"],
        "selectors": ["[data-recommendation]", ".recommendations", "#recommended-products"],
        "provider": "Unknown",
        "type": "recommendation",
        "risk_hint": "minimal",
    },
}

ALL_SIGNATURES = {
    **CHATBOT_SIGNATURES,
    **AI_CONTENT_SIGNATURES,
    **HIGH_RISK_SIGNATURES,
    **RECOMMENDATION_SIGNATURES,
}


EVIDENCE_SOURCE_LABELS = {
    "script_match": "DOM/script pattern",
    "network_match": "network request",
    "html_match": "page text",
    "selector_match": "chatbot widget",
}


def _evidence_sources(evidence: dict) -> list[str]:
    return [
        label
        for key, label in EVIDENCE_SOURCE_LABELS.items()
        if evidence.get(key)
    ]


def _evidence_strength(evidence: dict) -> str:
    if evidence.get("selector_match") or evidence.get("script_match"):
        return "strong"
    if evidence.get("network_match"):
        return "medium"
    if evidence.get("html_match"):
        return "weak"
    return "weak"


def detect_ai_systems(scan_id: str, crawl_data: dict) -> dict:
    """Run pattern matching against crawl results to find AI systems."""
    detected = []

    all_html = " ".join(
        p.get("html_snippet", "") for p in crawl_data.get("pages_data", [])
    ).lower()
    all_scripts = " ".join(crawl_data.get("all_script_urls", [])).lower()
    all_network = " ".join(crawl_data.get("all_network_requests", [])).lower()
    all_selectors_found = []
    for page in crawl_data.get("pages_data", []):
        all_selectors_found.extend(page.get("chat_selectors", []))

    for name, sig in ALL_SIGNATURES.items():
        evidence = {}
        matched = False

        # Check script URLs
        for script_pattern in sig.get("scripts", []):
            if script_pattern.lower() in all_scripts:
                matched = True
                evidence["script_match"] = script_pattern

        # Check network requests
        for net_pattern in sig.get("network_patterns", []):
            if net_pattern.lower() in all_network:
                matched = True
                evidence["network_match"] = net_pattern

        # Check HTML patterns
        for html_pattern in sig.get("html_patterns", []):
            if html_pattern.lower() in all_html:
                matched = True
                evidence["html_match"] = html_pattern

        # Check DOM selectors
        for selector in sig.get("selectors", []):
            if selector in all_selectors_found:
                matched = True
                evidence["selector_match"] = selector

        if matched:
            # Find page where detected
            page_url = crawl_data.get("base_url")
            for page in crawl_data.get("pages_data", []):
                page_html = page.get("html_snippet", "").lower()
                for pattern in sig.get("html_patterns", []):
                    if pattern.lower() in page_html:
                        page_url = page.get("url", page_url)
                        break

            detected.append({
                "name": name,
                "system_type": sig["type"],
                "provider": sig.get("provider", "Unknown"),
                "risk_hint": sig.get("risk_hint", "minimal"),
                "detection_evidence": evidence,
                "detection_sources": _evidence_sources(evidence),
                "evidence_strength": _evidence_strength(evidence),
                "page_url": page_url,
            })

    return {
        "scan_id": scan_id,
        "base_url": crawl_data.get("base_url"),
        "pages_crawled": crawl_data.get("pages_crawled", 0),
        "detected_systems": detected,
        "crawl_results": {
            "pages_crawled": crawl_data.get("pages_crawled", 0),
            "scripts_found": len(crawl_data.get("all_script_urls", [])),
            "network_requests": len(crawl_data.get("all_network_requests", [])),
            "ai_systems_detected": len(detected),
        },
    }

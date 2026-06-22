# ReguScan Scoring Pipeline Debugging Report

Date: 2026-06-22

## Executive Summary

The 100/100 scores are mostly not caused by the score formula itself. They are caused by missing detections upstream.

Current scoring behavior:

```text
Score = 100 - (critical * 25 + high * 15 + medium * 8 + low * 3)
```

The score only deducts points for compliance gaps. If the detector finds zero AI systems, the classifier receives zero systems, the gap analyzer generates zero gaps, and the score becomes 100.

This creates false confidence:

```text
Crawler timeout or weak detector coverage
-> 0 AI systems
-> 0 classifications
-> 0 gaps
-> 100/100 score
```

## Pipeline Code Path

```text
Website URL
-> backend/app/tasks/crawler.py
-> backend/app/tasks/detector.py
-> backend/app/tasks/classifier.py
-> backend/app/tasks/gap_analyzer.py
-> backend/app/tasks/report_generator.py
-> Scan.compliance_score
```

## Score Formula

Source: `backend/app/tasks/report_generator.py`

```python
SEVERITY_WEIGHTS = {"critical": 25, "high": 15, "medium": 8, "low": 3}
BASE_SCORE = 100

deductions = sum(
    SEVERITY_WEIGHTS.get(sev, 0) * count
    for sev, count in gap_summary.items()
)
compliance_score = max(0, BASE_SCORE - deductions)
```

The formula executes correctly based on `gap_summary`.

The problem is that `gap_summary` is often all zero because the detector found no systems.

## Scan Trace Summary

### 1. resume.io

Website:

```text
https://resume.io
```

Scan:

```text
c3fbb5ba-70b2-455a-ad4d-74ef86e97f51
```

Detection:

```json
{
  "pages_crawled": 1,
  "scripts_found": 0,
  "network_requests": 4,
  "ai_systems_detected": 0
}
```

Direct crawler evidence:

```text
Page.goto timeout waiting for networkidle.
```

Network examples observed during debug crawl:

```text
https://bzr.openai.com/v1/sdk/events...
https://bzrcdn.openai.com/sdk/oaiq.min.js
```

Classification:

```json
{
  "systems_count": 0,
  "overall_tier": "minimal",
  "systems": []
}
```

Gap analysis:

```json
{
  "critical": 0,
  "high": 0,
  "medium": 0,
  "low": 0
}
```

Score inputs:

```text
critical: 0 * 25 = 0
high:     0 * 15 = 0
medium:   0 * 8  = 0
low:      0 * 3  = 0
deduction: 0
score: 100
```

Why final score became 100:

The crawler timed out before page extraction, stored no scripts, and the detector found no AI systems. With no detected systems, no gaps were generated, so the score formula deducted nothing.

Assessment:

This is likely a false 100. The debug crawl saw OpenAI-related network activity, but the current detector does not map `bzr.openai.com` or `bzrcdn.openai.com` to an AI system signature.

### 2. chat.chatbotapp.ai

Website:

```text
https://chat.chatbotapp.ai
```

Scan:

```text
0f7d3d88-fd14-4bce-8573-9c6ca5f67a73
```

Detection:

```json
{
  "pages_crawled": 3,
  "scripts_found": 20,
  "network_requests": 175,
  "ai_systems_detected": 0
}
```

Direct crawler evidence:

```text
Page title: Chatbot App - AI Chatbot
Script examples include Next.js app chunks and webcdn.chatbot.app assets.
Network examples include chat.chatbotapp.ai app routes and chatbot media assets.
```

Classification:

```json
{
  "systems_count": 0,
  "overall_tier": "minimal",
  "systems": []
}
```

Gap analysis:

```json
{
  "critical": 0,
  "high": 0,
  "medium": 0,
  "low": 0
}
```

Score inputs:

```text
critical: 0 * 25 = 0
high:     0 * 15 = 0
medium:   0 * 8  = 0
low:      0 * 3  = 0
deduction: 0
score: 100
```

Why final score became 100:

The crawler worked, but the detector signatures are too narrow. The page clearly presents itself as an AI chatbot product, yet no signature matched.

Assessment:

This is likely a false 100. The detector currently looks for specific vendors and technical signatures, not generic AI chatbot product language or first-party AI app routes.

### 3. www.intercom.com

Website:

```text
https://www.intercom.com
```

Scan:

```text
65e0949a-17f2-4c6a-abf7-2e5b4f52915e
```

Detection:

```json
{
  "pages_crawled": 1,
  "scripts_found": 0,
  "network_requests": 114,
  "ai_systems_detected": 0
}
```

Direct crawler evidence:

```text
Page.goto timeout waiting for networkidle.
```

Classification:

```json
{
  "systems_count": 0,
  "overall_tier": "minimal",
  "systems": []
}
```

Gap analysis:

```json
{
  "critical": 0,
  "high": 0,
  "medium": 0,
  "low": 0
}
```

Score inputs:

```text
critical: 0 * 25 = 0
high:     0 * 15 = 0
medium:   0 * 8  = 0
low:      0 * 3  = 0
deduction: 0
score: 100
```

Why final score became 100:

The crawler timed out waiting for `networkidle`, extracted no scripts, and the detector found no AI systems. With no systems, classification and gap analysis had no work to do.

Assessment:

This is likely a false 100 for an AI-heavy company website. The crawler timeout should not be treated as a successful clean scan.

### 4. Controlled E2E Test Page

Website:

```text
http://api:8123
```

Scan:

```text
33fb5db7-1233-492f-bd8f-73da6822ef5f
```

Detection:

```json
{
  "pages_crawled": 1,
  "scripts_found": 0,
  "network_requests": 0,
  "ai_systems_detected": 2
}
```

Detected AI systems:

```json
[
  {
    "name": "Intercom",
    "system_type": "chatbot",
    "risk_category": "limited",
    "confidence": 0.8,
    "page_url": "http://api:8123",
    "evidence": {
      "html_match": "intercomSettings",
      "selector_match": "#intercom-container"
    }
  },
  {
    "name": "Recruitment / HR AI",
    "system_type": "recruitment",
    "risk_category": "high",
    "confidence": 0.9,
    "page_url": "http://api:8123",
    "evidence": {
      "html_match": "candidate ranking"
    }
  }
]
```

Classification:

```json
{
  "systems_count": 2,
  "overall_tier": "high",
  "systems": [
    {
      "name": "Intercom",
      "type": "chatbot",
      "confidence": 0.8,
      "risk_category": "limited"
    },
    {
      "name": "Recruitment / HR AI",
      "type": "recruitment",
      "confidence": 0.9,
      "risk_category": "high"
    }
  ]
}
```

Gap analysis:

```json
{
  "critical": 2,
  "high": 5,
  "medium": 1,
  "low": 2
}
```

Generated gap examples:

```text
Art.14.1 critical - No human oversight mechanism documented or implemented.
Art.9.1 critical - No risk management system documented for this high-risk AI system.
Art.50.1 high - No AI interaction disclosure for chatbot/virtual assistant.
Art.50.4 medium - AI-generated content not labeled with machine-readable markers.
Art.4.1 low - No AI literacy program documented.
```

Score inputs:

```text
critical: 2 * 25 = 50
high:     5 * 15 = 75
medium:   1 * 8  = 8
low:      2 * 3  = 6
deduction: 139
score: max(0, 100 - 139) = 0
```

Why final score became 0:

The detector found AI systems, classification ran, the gap analyzer generated findings, and the score formula deducted correctly.

Assessment:

This proves the downstream classifier, gap analyzer, and score calculation can work when detection succeeds.

## Answers To Specific Questions

### Did the detector actually find AI systems?

Only for the controlled E2E test scan.

For the public scans reviewed:

- `resume.io`: no
- `chat.chatbotapp.ai`: no
- `www.intercom.com`: no

### Did the classifier run?

Yes, but it only processes detected systems.

When `detected_systems` is empty, the classifier returns:

```json
{
  "classified_systems": [],
  "overall_risk_tier": "minimal"
}
```

That is technically execution, but not meaningful classification.

### Did the gap analyzer generate findings?

Only when classified systems existed.

For zero-detection scans, it generated no gaps.

### Did the score calculation execute correctly?

Yes. The formula matched the stored `gap_summary`.

The failure is upstream: bad or incomplete scan evidence leads to zero gaps, and zero gaps leads to 100.

### Are missing detections causing false 100 scores?

Yes.

This is the main failure mode.

### Is the scoring model too lenient?

Yes, in two ways:

1. It treats `no detections` as `perfect compliance`.
2. It does not penalize or flag crawler uncertainty, page timeouts, low crawl coverage, or weak evidence.

### Are there websites that should obviously receive lower scores but currently score 100?

Likely yes.

Based on the debug run:

- `chat.chatbotapp.ai` appears to be an AI chatbot product but scored 100 because detector signatures missed it.
- `resume.io` showed OpenAI-related network requests during debug crawling but scored 100 because detection did not map those signals to an AI system.
- `www.intercom.com` is an AI/customer support company site but scored 100 after crawler timeout caused no extraction.

## Root Causes

### Root Cause 1: Crawler Timeout Is Treated As Clean Crawl

In `backend/app/tasks/crawler.py`, a page timeout appends an error record but the final summary still reports the attempted URL as crawled.

Impact:

```text
pages_crawled = 1
scripts_found = 0
ai_systems_detected = 0
score = 100
```

This makes failed crawls look like successful clean scans.

### Root Cause 2: `networkidle` Is Too Fragile For Modern Sites

The crawler waits for:

```python
page.goto(current_url, wait_until="networkidle", timeout=15000)
```

Modern SaaS sites often keep network activity open due analytics, personalization, chat widgets, streaming, or app hydration.

Impact:

Extraction is skipped even though useful DOM/network evidence may already be available.

### Root Cause 3: Detector Signatures Are Too Narrow

The detector mostly matches known vendors or exact patterns:

- Intercom
- Drift
- Zendesk
- Tawk
- Crisp
- HubSpot
- OpenAI API route patterns
- specific HR/recruitment text

It misses generic but obvious AI/product language such as:

- AI chatbot
- AI assistant
- chatbot app
- AI resume builder
- AI cover letter
- recruiter match
- first-party AI app routes
- OpenAI SDK telemetry domains

### Root Cause 4: No Uncertainty Penalty

The score does not distinguish:

```text
No AI detected after a healthy crawl
```

from:

```text
No AI detected because crawler timed out or detector coverage was weak
```

Both currently become 100.

### Root Cause 5: Minimal Risk Systems Still Depend On Detection

The gap analyzer can generate at least low-severity AI literacy gaps for minimal systems, but if no system is detected at all, even that does not happen.

## Recommended Fixes

### Critical

1. Do not return a perfect score when crawl confidence is low.

Add scan quality fields:

```json
{
  "pages_attempted": 3,
  "pages_succeeded": 1,
  "pages_failed": 2,
  "crawl_errors": [],
  "crawl_confidence": "low|medium|high"
}
```

If crawl confidence is low, show:

```text
Scan incomplete
```

or cap score:

```text
max score = 70 until crawl succeeds
```

2. Change Playwright wait strategy.

Use `domcontentloaded` or `load`, then wait briefly for late scripts:

```python
await page.goto(url, wait_until="domcontentloaded", timeout=20000)
await page.wait_for_timeout(3000)
```

Then extract whatever is available instead of skipping extraction on `networkidle` timeout.

3. Persist crawl errors and page extraction status.

The UI and report should show:

```text
1 page failed to fully load. Results may be incomplete.
```

### High Priority

4. Add generic AI language detectors.

Examples:

```text
AI chatbot
AI assistant
AI resume
AI cover letter
AI recruiter
AI screening
automated candidate
AI agent
AI-generated
generative AI
```

These should be treated as weaker evidence unless combined with script, DOM, or network signals.

5. Add suspicious AI network domains.

Examples from debug crawl:

```text
bzr.openai.com
bzrcdn.openai.com
webcdn.chatbot.app
chatbotapp.ai
```

6. Add scan quality to scoring.

Scoring should include:

- gap deductions
- crawl confidence
- evidence strength
- number of failed pages
- whether obvious AI signals were found but not classified

### Medium Priority

7. Add a `needs_review` result state.

For weak evidence or incomplete crawls, avoid showing 100/100. Show:

```text
Needs review
```

8. Store detector debug traces.

Persist:

- candidate signals
- matched signatures
- unmatched AI-like keywords
- page errors
- script examples
- network examples

9. Add regression tests.

Required test cases:

- Timeout page should not score 100.
- AI chatbot marketing page should not score 100.
- OpenAI SDK/network signal should create at least a weak AI candidate.
- Zero detections with crawl errors should produce incomplete scan status.

## Conclusion

The score calculation is mathematically correct, but the pipeline is overly optimistic because it equates missing evidence with no risk.

The immediate fix is to separate these states:

```text
No AI found after high-confidence crawl
```

versus:

```text
No AI found because crawl or detection was incomplete
```

Until that distinction exists, 100/100 should not be treated as a reliable compliance result for public websites with timeouts, low script extraction, or obvious AI product language.


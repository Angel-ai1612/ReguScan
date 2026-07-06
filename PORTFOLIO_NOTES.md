# ReguScan Portfolio Notes

## Problem

ReguScan is a working local MVP for evidence-based AI compliance guidance. It helps teams inspect public websites for AI features, classify likely EU AI Act risk, and generate a compliance report with remediation guidance.

ReguScan provides technical compliance guidance and is not a substitute for legal advice.

## Solution

The app combines a Next.js dashboard, FastAPI backend, PostgreSQL, Redis, Celery workers, a Playwright crawler, rule-based AI signal detection, Groq-based classification, a gap analyzer, WebSocket progress updates, and HTML report generation.

## What Is Demo Ready

- Authenticated dashboard with website and scan workflows.
- Website AI detection for chatbot, assistant, recruiting, generated-content, recommendation, and vendor-script signals.
- Crawl-quality metadata so weak crawls do not silently become perfect scores.
- Evidence cards that show what was found, where it was found, why it matters, confidence, and recommended fixes.
- Security hardening for URL safety, report escaping, scan quotas, role-based mutations, WebSocket scan access, and webhook secret handling.

## What Was Difficult

- Avoiding false `100/100` scores when no AI systems were detected because crawling or detection was weak.
- Keeping SSRF protections strict while still supporting useful public website scans.
- Making generated compliance reports safe to render with provider and website-derived text.
- Preserving tenant isolation across HTTP routes and WebSocket scan progress.

## Current Limitations

- Public deployment is pending final security and demo validation.
- Public websites can change or block crawling, so demos should use a controlled hosted target when reliability matters.
- Razorpay billing, Cloudflare R2 report hosting, and Sentry are optional and not required for the local MVP.
- Results are technical guidance, not legal guarantees.

## Future Work

- Add a hosted public demo target and screenshot set.
- Expand validated AI detection signatures with measured false-positive and false-negative rates.
- Add deeper sector-specific remediation templates.
- Add production observability after public deployment is approved.

## Demo Screenshot Checklist

- Landing page with AI compliance scanner positioning.
- Public demo target at `/demo-ai-target`.
- Dashboard overview.
- Website detail page before scan.
- Running scan progress.
- Completed or needs-review scan result.
- Evidence cards with page URL and signal.
- Compliance gaps with recommended fixes.
- Generated report or sample report.

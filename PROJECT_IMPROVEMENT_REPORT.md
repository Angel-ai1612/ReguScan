# ReguScan Project Improvement Report

Date: 2026-07-06

## Summary

This pass focused on moving ReguScan closer to a safe, credible, demo-ready local MVP without broad rewrites. The repo already had most of the earlier security and false-perfect-score fixes in place, so the changes here were targeted:

- tightened role policy to include compliance managers without allowing normal members to mutate scan evidence or gap state
- added regression coverage for the role policy and stable demo target signals
- replaced key-shaped tracked env placeholders with explicit placeholders
- added a stable demo target as both static HTML and a public frontend route
- updated the local run guide to use `docker compose start` / `docker compose stop`
- added portfolio notes with honest claims and limitations

ReguScan provides technical compliance guidance and is not a substitute for legal advice.

## Files Changed

- `backend/app/core/auth.py`
- `backend/tests/test_api.py`
- `backend/.env.example`
- `frontend/.env.local.example`
- `frontend/middleware.ts`
- `frontend/app/demo-ai-target/page.tsx`
- `frontend/tsconfig.json`
- `docs/demo-ai-target.html`
- `GUIDE.md`
- `PORTFOLIO_NOTES.md`
- `PROJECT_IMPROVEMENT_REPORT.md`

Note: `frontend/middleware.ts` already had a local auth-protection change before this pass. This pass only added `/demo-ai-target` to the public route matcher.

## Bugs And Security Issues Addressed

- Role-based authorization now allows `owner`, `admin`, `compliance_manager`, and `compliance-manager` for admin-grade mutation dependencies.
- Normal `member` users remain blocked by the admin-grade dependency.
- Demo target route is public so a deployed frontend can be scanned without requiring Clerk sign-in.
- Tracked env examples no longer contain values shaped like real Clerk, Groq, Gemini, Resend, Razorpay, or Sentry keys.
- Daily Docker stop guidance now uses `docker compose stop`; `docker compose down` is documented as reset-only.

Existing verified protections in the current codebase include:

- SSRF URL safety checks for localhost/private/metadata/reserved addresses and DNS rebinding regression coverage.
- Jinja autoescaping for generated HTML reports and malicious HTML regression coverage.
- Scan quota enforcement before Celery dispatch.
- WebSocket scan progress auth through token/subprotocol transport with scan ownership checks.
- Razorpay and Clerk webhook secret fail-closed helpers.
- Crawl-quality score caps to prevent weak crawls from silently scoring `100/100`.

## Product Improvements

- Added `/demo-ai-target`, a deterministic page with AI chatbot, AI assistant, AI resume builder, AI recruiter, AI screening, AI-generated, generative AI, AI agent, automated decision system, Intercom, and OpenAI CDN signals.
- Added `docs/demo-ai-target.html` for static hosting if the frontend is not deployed.
- Added `PORTFOLIO_NOTES.md` with problem, solution, architecture, difficult parts, limitations, future work, and screenshot checklist.

## Tests Added

- `test_admin_policy_allows_compliance_manager_but_blocks_member`
- `test_demo_target_contains_detectable_ai_signals`

## Commands Run

- `git status --short --branch`
- `git status --short --ignored`
- tracked env/example secret-name scan without printing values
- `backend\.venv\Scripts\python.exe -m pytest backend\tests\test_api.py -q`
- `npm.cmd run type-check`
- `npm.cmd run build`
- `docker compose ps`
- `Invoke-WebRequest -UseBasicParsing -Uri http://localhost:8000/health`
- `Invoke-WebRequest -UseBasicParsing -Uri http://localhost:5555`
- `docker compose restart frontend`
- `Invoke-WebRequest -UseBasicParsing -Uri http://localhost:3000/demo-ai-target`

## Verification Results

- Backend tests: passed, `32 passed`.
- Frontend type-check: passed.
- Frontend production build: passed.
- Docker stack: API, frontend, worker, beat, Flower, Postgres, and Redis were running.
- API health: passed, returned `{"status":"ok","version":"0.1.0","env":"local"}`.
- Flower: reachable, HTTP `200`.
- Demo target route: reachable after frontend restart, HTTP `200`.
- Tracked env examples: no live-looking secret values were found; remaining flagged names are placeholders/local service values.

## Remaining Known Issues

- I did not run a full authenticated browser flow in this pass: sign-in, add website, run scan, results page, report, and email behavior still need an end-to-end smoke test with valid local provider credentials.
- I did not run a real scan against the local `/demo-ai-target` because SSRF protections correctly block localhost/private targets. Scan the deployed public frontend route or a public static host for the HTML file.
- Public deployment should remain pending until secrets are manually reviewed, provider credentials are confirmed, and one full public demo scan is captured.
- Next.js build emits a middleware-to-proxy deprecation warning. It does not block the build, but it should be addressed in a future framework-maintenance pass.

## Public Demo Recommendation

Do not claim production readiness yet.

Recommended current positioning:

- working local MVP
- public demo pending final security and provider-backed validation
- evidence-based compliance guidance
- AI compliance scanner for EU AI Act readiness
- website AI detection and AI risk assessment
- compliance report generator
- AI governance tool
- not legal advice

Public demo deployment is reasonable only after:

- secrets are checked in the hosting dashboards
- `/demo-ai-target` is available on the deployed frontend
- a scan of that public route produces detected AI systems, gaps, evidence cards, and report output
- the authenticated flow is re-smoked
- email behavior is verified or clearly disabled for demo

## Screenshots To Take

- Landing page hero and positioning.
- `/demo-ai-target` public page.
- Dashboard overview.
- Website detail page before scan.
- Running scan progress.
- Scan result with `Needs review` or completed status.
- Evidence card showing page URL, detection source, confidence, and reasoning.
- Compliance gap with recommended fix.
- Report page or generated HTML report.
- Flower worker activity during scan.

## LinkedIn Notes

Safe wording:

- Built ReguScan, a working local MVP for EU AI Act website AI detection and compliance guidance.
- Implemented a Playwright/Celery scan pipeline with evidence cards, risk classification, gap analysis, and report generation.
- Hardened core security boundaries including SSRF checks, report escaping, tenant-aware WebSocket access, scan quotas, and role-based mutation controls.
- Added crawl-quality scoring so weak crawls do not silently become perfect compliance scores.

Do not claim:

- production-ready SaaS
- legal compliance guarantee
- fully automated EU AI Act certification
- paid Razorpay launch is complete
- public deployment is approved
- scanner catches every AI system on every public website

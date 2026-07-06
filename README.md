# ReguScan

Evidence-based EU AI Act readiness scanner for public websites.

ReguScan crawls a website, detects likely AI systems, classifies EU AI Act risk, maps compliance gaps, and generates practical remediation guidance. It is built as a full-stack MVP for founders, SaaS teams, agencies, and compliance operators who need a fast technical review before deeper legal assessment.

> ReguScan provides technical compliance guidance. It is not legal advice and does not certify EU AI Act compliance.

## What It Does

- Crawls public websites with Playwright and collects page, script, DOM, network, and screenshot evidence.
- Detects AI-related signals such as chatbots, AI assistants, generated content, recommendation systems, recruiting AI, and vendor scripts.
- Classifies detected systems into EU AI Act risk tiers with Groq LLM support and rule-based fallbacks.
- Maps risk tiers to likely obligations and gaps, including Article 50 transparency and high-risk governance duties.
- Shows scan progress in real time through WebSockets.
- Produces evidence cards, compliance gaps, score summaries, and HTML reports.
- Enforces backend plan limits and keeps paid checkout gated until Razorpay subscriptions are fully verified.

## Current Status

ReguScan is a working local MVP. The Free plan flow, scan pipeline, dashboard, demo target, and core security protections are implemented. Public production launch still needs final provider-secret review, hosted demo scan validation, authenticated browser smoke testing, and paid billing verification.

Safe public positioning:

- Working local MVP for website AI detection and EU AI Act readiness.
- Evidence-based compliance guidance, not legal certification.
- Free plan is usable with backend-enforced limits.
- Starter and Pro payment flows are gated until Razorpay subscription behavior is verified end to end.

## Architecture

```text
Next.js frontend
  -> FastAPI backend
    -> PostgreSQL
    -> Redis
    -> Celery workers
      -> Playwright crawler
      -> AI signal detector
      -> Groq classifier
      -> Gap analyzer
      -> HTML report generator
      -> Resend notifications
```

Core services:

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16, React, TypeScript, Tailwind CSS, Clerk |
| API | FastAPI, Pydantic, SQLAlchemy, Alembic |
| Workers | Celery, Redis, Playwright |
| Database | PostgreSQL |
| LLM | Groq |
| Optional services | Resend, Cloudflare R2, Pinecone, Razorpay, Sentry |
| Local runtime | Docker Compose |

## Product Flow

1. User signs in with Clerk.
2. User adds a public website.
3. ReguScan creates a scan and dispatches Celery work.
4. The crawler collects page evidence.
5. The detector identifies AI-like systems and signals.
6. The classifier assigns likely EU AI Act risk tiers.
7. The gap analyzer maps obligations and recommended fixes.
8. The frontend displays progress, evidence, risk, gaps, and report output.

## Risk Tiers

| Tier | EU AI Act area | Examples | Typical concern |
| --- | --- | --- | --- |
| Prohibited | Article 5 | Social scoring, banned biometric or emotion-recognition use cases | Highest exposure |
| High-risk | Annex III | HR AI, credit scoring, biometrics, fraud detection | Governance, oversight, records, risk management |
| Limited-risk | Article 50 | Chatbots, AI-generated content, disclosure-sensitive AI interactions | Transparency and labeling |
| Minimal-risk | Article 4 and general governance | Lower-risk assistants or internal tools | AI literacy and review hygiene |

## Plan Limits

The backend is the source of truth for plan enforcement.

| Plan | Websites | Scan limit | Gap visibility | Billing status |
| --- | ---: | ---: | --- | --- |
| Free | 1 | 1 total scan | Top 3 gaps | Available |
| Starter | 3 | 10 scans/month | Full gaps | Razorpay checkout gated |
| Pro | 10 | 100 scans/month | Full gaps | Razorpay checkout gated |
| Enterprise | Unlimited | Unlimited | Full gaps | Contact / coming soon |

PDF reports and public API access are marked coming soon until those features are implemented and validated.

## Repository Structure

```text
reguscan/
  backend/
    app/
      api/v1/endpoints/      FastAPI route handlers
      core/                  settings, auth, Redis, plan rules
      db/                    SQLAlchemy sessions
      models/                ORM models
      schemas/               Pydantic schemas
      tasks/                 Celery scan pipeline
    alembic/                 database migrations
    tests/                   backend tests
    pyproject.toml
  frontend/
    app/                     Next.js routes and dashboard pages
    components/              UI and dashboard components
    lib/                     API client and utilities
    middleware.ts            Clerk route protection
    package.json
  docs/
    demo-ai-target.html      stable public scan target source
  docker-compose.yml
  render.yaml
```

Important backend files:

- `backend/app/tasks/crawler.py`: Playwright crawling and evidence collection.
- `backend/app/tasks/detector.py`: AI signal detection.
- `backend/app/tasks/classifier.py`: Groq-backed risk classification.
- `backend/app/tasks/gap_analyzer.py`: EU AI Act gap mapping.
- `backend/app/tasks/report_generator.py`: report generation and scoring.
- `backend/app/core/auth.py`: Clerk JWT verification and role policy.
- `backend/app/core/plans.py`: plan limits and feature gates.

Important frontend files:

- `frontend/app/page.tsx`: public landing page.
- `frontend/app/demo-ai-target/page.tsx`: deterministic demo scan target.
- `frontend/app/(dashboard)/dashboard/scans/[scanId]/page.tsx`: scan result UI.
- `frontend/app/(dashboard)/dashboard/settings/page.tsx`: usage and billing UI.
- `frontend/lib/api.ts`: typed API client.
- `frontend/components/dashboard/TokenInjector.tsx`: Clerk token bridge.

## Prerequisites

- Docker Desktop
- Git
- Python 3.12+
- Node.js 20+
- Valid Clerk, database, Redis, and Groq credentials for realistic local testing

On Windows PowerShell, use `npm.cmd` if `npm.ps1` is blocked by execution policy.

## Environment Setup

Create local environment files:

```powershell
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

Required backend values:

```text
SECRET_KEY=
CLERK_SECRET_KEY=
CLERK_JWKS_URL=
CLERK_ISSUER=
CLERK_JWT_AUDIENCE=
CLERK_AUTHORIZED_PARTIES=
CLERK_WEBHOOK_SECRET=
GROQ_API_KEY=
DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/reguscan
DATABASE_URL_SYNC=postgresql://postgres:postgres@db:5432/reguscan
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/1
CELERY_RESULT_BACKEND=redis://redis:6379/2
APP_ENV=local
DEBUG=true
```

Required frontend values:

```text
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Optional values:

```text
RESEND_API_KEY=
RESEND_FROM_EMAIL=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=
PINECONE_API_KEY=
PINECONE_INDEX=regulations
SENTRY_DSN=
RAZORPAY_CHECKOUT_ENABLED=false
RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
RAZORPAY_WEBHOOK_SECRET=<razorpay-webhook-secret>
RAZORPAY_PLAN_STARTER=<razorpay-starter-plan-id>
RAZORPAY_PLAN_PRO=<razorpay-pro-plan-id>
RAZORPAY_CURRENCY=INR
```

Keep `RAZORPAY_CHECKOUT_ENABLED=false` until a real Razorpay test checkout, webhook delivery, idempotency, cancellation, and plan-upgrade flow has passed in staging.

## Local Development

Start the stack:

```powershell
cd "C:\Users\MD Abdul Rahman\Downloads\reguscan\reguscan"
docker compose up -d --build
docker compose ps
```

Run migrations:

```powershell
docker compose exec api alembic upgrade head
```

Install Playwright browsers in the worker container if needed:

```powershell
docker compose exec worker playwright install chromium --with-deps
```

Open local services:

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/health
- API docs: http://localhost:8000/docs
- Flower: http://localhost:5555

Daily start after containers already exist:

```powershell
docker compose start
docker compose ps
```

Daily stop:

```powershell
docker compose stop
```

Use `docker compose down` only when intentionally resetting containers.

## Development Commands

Backend:

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest tests -q
.\.venv\Scripts\alembic.exe heads
```

Frontend:

```powershell
cd frontend
npm.cmd run type-check
npm.cmd run build
```

Docker equivalents:

```powershell
docker compose exec -T api pytest tests -q
docker compose exec -T frontend npm run type-check
docker compose exec -T frontend npm run build
```

Logs:

```powershell
docker compose logs -f api
docker compose logs -f worker
docker compose logs -f frontend
docker compose logs -f db
docker compose logs -f redis
```

## Demo Target

ReguScan includes a deterministic AI-signal page for reliable demos:

```text
frontend/app/demo-ai-target/page.tsx
docs/demo-ai-target.html
```

For a public demo, deploy the frontend and scan:

```text
https://<your-frontend-domain>/demo-ai-target
```

Do not weaken SSRF protections to scan `localhost`, private IPs, Docker-internal hosts, or cloud metadata addresses.

## Security Posture

Implemented protections include:

- Clerk JWT verification with configured issuer, JWKS, audience, authorized party, expiry, and pending-session checks.
- Production auth fails closed when required Clerk verification settings are missing.
- Tenant-aware scan WebSocket access.
- SSRF protection for localhost, private, metadata, reserved, and DNS-rebinding targets.
- Jinja escaping for generated HTML reports.
- Backend scan quota checks before Celery dispatch.
- Role-based mutation policy for owner, admin, and compliance-manager roles.
- Razorpay and Clerk webhook secret verification.
- Tracked env examples use placeholders only.

Before public deployment:

- Rotate any real secrets that ever lived in ignored local `.env` files.
- Review hosting dashboard env vars manually.
- Run one authenticated browser smoke test.
- Run a public scan against the hosted demo target.
- Confirm email/report behavior is enabled or clearly disabled.

## Scoring Notes

The scoring model deducts points from 100 based on compliance gaps. The main risk is not the arithmetic; it is weak upstream evidence.

```text
Weak crawl or narrow detection
  -> 0 AI systems
  -> 0 classifications
  -> 0 gaps
  -> false 100/100 score
```

The product should distinguish:

- No AI found after a healthy crawl.
- No AI found because crawl or detection was incomplete.

Low-confidence crawls should be shown as incomplete or needs-review rather than clean.

## Deployment

Backend deploys through Render using `render.yaml`.

High-level backend steps:

1. Push to GitHub.
2. Create a Render Blueprint from the repository.
3. Set all backend environment variables in Render.
4. Deploy.
5. Run `alembic upgrade head` after first deploy.

Frontend deploys through Vercel.

Required frontend env vars:

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_API_URL=https://<api-domain>
NEXT_PUBLIC_WS_URL=wss://<api-domain>
```

CI/CD uses GitHub Actions. Configure these secrets before relying on automated deployment:

```text
RENDER_API_KEY
RENDER_SERVICE_ID
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

## Billing Model

Razorpay is currently wired as a controlled test flow. The app must not publicly claim paid subscriptions are production-ready.

Current rules:

- Free plan works without payment.
- Paid checkout is disabled unless the backend explicitly enables Razorpay checkout.
- Frontend checkout success never upgrades a plan by itself.
- Backend verifies Razorpay payment signatures.
- Organization plan changes happen only after verified webhook events.
- Legacy Stripe fields remain only for non-destructive migration safety.

Before paid launch:

- Implement true Razorpay Subscriptions creation.
- Add a dedicated billing event ledger with unique provider event IDs.
- Verify real Razorpay test checkout and webhook delivery.
- Test cancellation, duplicate events, failed payments, and plan-limit changes.

## Portfolio-Friendly Summary

ReguScan is a working local MVP for AI governance and EU AI Act readiness. It combines a Next.js dashboard, FastAPI backend, PostgreSQL, Redis, Celery workers, Playwright crawling, AI signal detection, LLM-assisted risk classification, gap analysis, and report generation.

Strong claims:

- Built a full-stack website AI detection pipeline.
- Added evidence cards and crawl-quality handling so results are auditable.
- Hardened auth, SSRF boundaries, scan ownership, report rendering, scan quotas, and webhook handling.
- Implemented backend-enforced Free/Starter/Pro/Enterprise plan rules.

Avoid claiming:

- Legal compliance guarantee.
- EU AI Act certification.
- Production-ready paid subscriptions.
- Perfect AI detection across all websites.
- Public SaaS launch approval.

## Roadmap

- Run final authenticated browser smoke test.
- Deploy or host the demo target and scan its public URL.
- Capture final product screenshots.
- Expand detector signatures with measured false-positive and false-negative rates.
- Add stronger sector-specific remediation templates.
- Add production observability for scan failures and worker health.
- Complete Razorpay Subscriptions before public paid launch.
- Add a billing event ledger.
- Improve public sample reports and shareable report views.

## License

MIT.

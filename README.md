<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/header.svg" width="900" alt="ReguScan">

</div>

<br>

<div align="center">

<a href="https://github.com/Angel-ai1612/ReguScan"><img src="https://img.shields.io/badge/status-local%20MVP-ff6b9d?style=flat-square&labelColor=0d0d1a&color=ff6b9d" alt="Status"></a>
<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-c44dff?style=flat-square&labelColor=0d0d1a&color=c44dff" alt="License"></a>
<a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js%2016-6b9dff?style=flat-square&labelColor=0d0d1a&color=6b9dff&logo=next.js&logoColor=white" alt="Next.js"></a>
<a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-ff6b9d?style=flat-square&labelColor=0d0d1a&color=ff6b9d&logo=fastapi&logoColor=white" alt="FastAPI"></a>
<a href="https://python.org/"><img src="https://img.shields.io/badge/Python%203.12-c44dff?style=flat-square&labelColor=0d0d1a&color=c44dff&logo=python&logoColor=white" alt="Python"></a>
<a href="https://react.dev/"><img src="https://img.shields.io/badge/React%2018-6b9dff?style=flat-square&labelColor=0d0d1a&color=6b9dff&logo=react&logoColor=white" alt="React"></a>
<a href="https://typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-c44dff?style=flat-square&labelColor=0d0d1a&color=c44dff&logo=typescript&logoColor=white" alt="TypeScript"></a>
<a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-ff6b9d?style=flat-square&labelColor=0d0d1a&color=ff6b9d&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
<a href="https://celery.science/"><img src="https://img.shields.io/badge/Celery-6b9dff?style=flat-square&labelColor=0d0d1a&color=6b9dff&logo=celery&logoColor=white" alt="Celery"></a>

</div>

<br>

<div align="center">

## What is ReguScan?

</div>

ReguScan is an **open-source EU AI Act compliance scanner** that crawls any website, detects embedded AI systems, classifies their risk under EU Regulation 2024/1689, maps compliance gaps, and generates actionable remediation guidance. It combines a **Next.js 16 dashboard** with a **FastAPI backend**, **Celery workers**, **Playwright crawling**, **LLM-powered risk classification**, and **real-time WebSocket streaming** — purpose-built for founders, SaaS teams, agencies, and compliance operators who need a fast technical first pass before deeper legal assessment.

> ⚠️ **Important:** ReguScan provides **technical compliance guidance** to accelerate your internal review. It is **not legal advice** and does **not certify EU AI Act compliance.

<div align="center">

<br>

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/divider.svg" width="900" alt="divider">

---

<br>

## Core Pipeline

</div>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/flow.svg" width="900" alt="Product Flow">

</div>

<br>

<div align="center">

### How It Works

</div>

<br>

<table>
<tr>
<td width="33%" align="center">

**🔍 Crawl**

Playwright crawls target pages — collecting DOM, scripts, network requests, and screenshots as structured evidence.

</td>
<td width="33%" align="center">

**🤖 Detect & Classify**

Pattern matching identifies AI signals (chatbots, recommendation engines, HR AI, etc.) and Groq LLM maps them to EU AI Act risk tiers.

</td>
<td width="33%" align="center">

**📋 Report & Remediate**

Compliance gaps are mapped against the regulation, scored, and paired with practical remediation steps — streamed live via WebSocket.

</td>
</tr>
</table>

<br>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/divider.svg" width="900" alt="divider">

---

<br>

## Architecture

</div>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/architecture.svg" width="800" alt="Architecture">

</div>

<br>

<table>
<tr>
<td width="50%" valign="top">

### Frontend

| Tech | Role |
| :--- | :--- |
| **Next.js 16** | App router, SSG, server actions |
| **React 18** | UI components, hooks |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling, dark theme |
| **Clerk** | Auth, JWT, sessions |
| **Zustand** | Client state |
| **TanStack Query** | Server state, caching |
| **Motion** | Animations |
| **Recharts** | Data visualization |
| **Sonner** | Toast notifications |
| **Radix UI** | Accessible primitives |

</td>
<td width="50%" valign="top">

### Backend

| Tech | Role |
| :--- | :--- |
| **FastAPI** | REST API, WebSocket |
| **Pydantic v2** | Validation, schemas |
| **SQLAlchemy 2.0** | ORM, async sessions |
| **Alembic** | Migrations |
| **Celery** | Distributed task queue |
| **Redis** | Cache, broker, pub/sub |
| **PostgreSQL** | Primary database |
| **Playwright** | Headless browser crawling |
| **Groq** | LLM risk classification |
| **Sentry** | Error tracking |
| **SlowAPI** | Rate limiting |

</td>
</tr>
</table>

<br>

<details>
<summary><b>Backend Services Deep Dive</b></summary>
<br>

| Service | Description |
| :--- | :--- |
| `backend/app/tasks/crawler.py` | Playwright headless crawling with SSRF-safe URL routing, evidence collection (screenshots, DOM, scripts, network logs) |
| `backend/app/tasks/detector.py` | Signature-based AI system detection — 50+ patterns for chatbots, HR AI, recommendation engines, generated content, and more |
| `backend/app/tasks/classifier.py` | Groq LLM classifies each detected system into Prohibited / High-risk / Limited / Minimal with structured JSON output and rule-based fallbacks |
| `backend/app/tasks/gap_analyzer.py` | Maps risk tiers to EU AI Act obligations (Art. 5, 9, 10, 12, 13, 14, 50, 51, etc.) with severity ratings and code-level remediation snippets |
| `backend/app/tasks/report_generator.py` | Compiles scan results into scored HTML reports with gap summaries, fine exposure estimates, and evidence attachments |
| `backend/app/tasks/scan_workflow.py` | Orchestrates the full pipeline: crawl → detect → classify → analyze → report → notify, streaming progress through Redis pub/sub |
| `backend/app/core/auth.py` | Clerk JWT verification with multi-tenancy, role-based mutation policy, and fail-closed production auth |
| `backend/app/core/plans.py` | Backend-enforced Free / Starter / Pro / Enterprise plan limits with Razorpay gating |
| `backend/app/core/url_safety.py` | SSRF protection blocking localhost, private IPs, metadata endpoints, and DNS rebinding attacks |

</details>

<br>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/divider.svg" width="900" alt="divider">

---

<br>

## EU AI Act Risk Classification

</div>

ReguScan maps detected AI systems against **EU Regulation 2024/1689 (EU AI Act)** using a combination of signature-based detection, network analysis, and LLM-powered classification with structured fallbacks.

<table>
<tr>
<th>Tier</th>
<th>EU AI Act</th>
<th>Examples</th>
<th>Consequence</th>
</tr>
<tr>
<td>🚫 **Prohibited**</td>
<td>Article 5</td>
<td>Social scoring, banned biometrics, emotion recognition in workplace/education, manipulative systems</td>
<td>Highest exposure — fines up to €35M or 7% of global turnover</td>
</tr>
<tr>
<td>🔴 **High-risk**</td>
<td>Annex III</td>
<td>HR & recruitment AI, credit scoring, biometrics, fraud detection, critical infrastructure, law enforcement</td>
<td>Governance, oversight, risk management, data governance, logging, transparency, human oversight required</td>
</tr>
<tr>
<td>🟡 **Limited-risk**</td>
<td>Article 50</td>
<td>Chatbots, AI-generated content, recommendation systems, any AI interaction requiring transparency</td>
<td>Transparency and labeling obligations — users must be informed they are interacting with AI</td>
</tr>
<tr>
<td>🟢 **Minimal-risk**</td>
<td>Articles 4 / general</td>
<td>Lower-risk internal tools, basic automation, non-user-facing AI</td>
<td>AI literacy measures, documentation, and periodic review hygiene</td>
</tr>
</table>

<details>
<summary><b>Art. 6(3) Exceptions</b></summary>
<br>

Systems that perform a narrow procedural task, improve human activity, detect patterns without replacing human judgment, or are merely preparatory **may be excluded** from high-risk classification under Art. 6(3). ReguScan evaluates this exception during LLM classification and documents the reasoning.

</details>

<br>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/divider.svg" width="900" alt="divider">

---

<br>

## Scan Results & Compliance Scoring

</div>

Each scan produces a comprehensive compliance report with:

- **Detected AI systems** — evidence-backed identification with screenshots and DOM traces
- **Risk classification** — per-system tier assignment with LLM reasoning and confidence scores
- **Compliance gap map** — specific EU AI Act obligations mapped to each system with severity
- **Remediation guidance** — actionable steps including code snippets where applicable
- **Compliance score** — 0–100 scoring with crawl-quality awareness
- **Fine exposure estimate** — potential regulatory penalty range based on identified violations
- **Evidence gallery** — screenshots, network logs, and script captures for auditability

> **Scoring note:** The scoring model deducts points from 100. A perfect score with zero detected AI systems is only valid if the crawl was **complete and healthy** — low-confidence crawls are flagged as *incomplete* or *needs-review* rather than *clean*.

<br>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/divider.svg" width="900" alt="divider">

---

<br>

## Quick Start

</div>

### Prerequisites

- Docker Desktop
- Python 3.12+
- Node.js 20+
- Valid Clerk, Groq, database, and Redis credentials

### Setup

<details>
<summary><b>Environment Variables</b></summary>
<br>

**Backend** (`backend/.env`):
```
SECRET_KEY=<your-secret>
CLERK_SECRET_KEY=<clerk-secret>
CLERK_JWKS_URL=<jwks-url>
CLERK_ISSUER=<issuer>
CLERK_JWT_AUDIENCE=<audience>
GROQ_API_KEY=<groq-api-key>
DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/reguscan
DATABASE_URL_SYNC=postgresql://postgres:postgres@db:5432/reguscan
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/1
CELERY_RESULT_BACKEND=redis://redis:6379/2
APP_ENV=local
DEBUG=true
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<clerk-publishable>
CLERK_SECRET_KEY=<clerk-secret>
```

</details>

<details>
<summary><b>Optional Integrations</b></summary>
<br>

```
RESEND_API_KEY=           # Transactional email
R2_ACCOUNT_ID=            # Cloudflare R2 storage
PINECONE_API_KEY=         # Vector search
SENTRY_DSN=               # Error tracking
RAZORPAY_CHECKOUT_ENABLED=false  # Payment gating
```

</details>

<br>

### Running Locally

```powershell
# Clone and start
git clone https://github.com/Angel-ai1612/ReguScan.git
cd reguscan

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Start all services
docker compose up -d --build
docker compose ps

# Run database migrations
docker compose exec api alembic upgrade head
```

### Local Service URLs

| Service | URL |
| :--- | :--- |
| Frontend | http://localhost:3000 |
| API Health | http://localhost:8000/health |
| API Docs (Swagger) | http://localhost:8000/docs |
| Celery Monitoring (Flower) | http://localhost:5555 |

### Development Commands

```powershell
# Backend tests
docker compose exec -T api pytest tests -q

# Frontend type-check
docker compose exec -T frontend npm run type-check

# Follow logs
docker compose logs -f api
docker compose logs -f worker
```

<br>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/divider.svg" width="900" alt="divider">

---

<br>

## Plans & Limits

</div>

<table>
<tr>
<th>Plan</th>
<th>Websites</th>
<th>Scans</th>
<th>Gap Visibility</th>
<th>Status</th>
</tr>
<tr>
<td>🆓 **Free**</td>
<td align="center">1</td>
<td align="center">1 total</td>
<td align="center">Top 3 gaps</td>
<td align="center">✅ Available</td>
</tr>
<tr>
<td>⭐ **Starter**</td>
<td align="center">3</td>
<td align="center">10/month</td>
<td align="center">Full gaps</td>
<td align="center">🔒 Razorpay</td>
</tr>
<tr>
<td>💎 **Pro**</td>
<td align="center">10</td>
<td align="center">100/month</td>
<td align="center">Full gaps</td>
<td align="center">🔒 Razorpay</td>
</tr>
<tr>
<td>🏢 **Enterprise**</td>
<td align="center">Unlimited</td>
<td align="center">Unlimited</td>
<td align="center">Full gaps</td>
<td align="center">📞 Contact</td>
</tr>
</table>

> PDF reports and public API access are on the roadmap.

<br>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/divider.svg" width="900" alt="divider">

---

<br>

## Roadmap

</div>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/roadmap.svg" width="800" alt="Roadmap">

</div>

<br>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/divider.svg" width="900" alt="divider">

---

<br>

## Security Posture

</div>

**Implemented safeguards:**
- ✅ Clerk JWT verification with configured issuer, JWKS, audience, authorized party, and expiry
- ✅ Fail-closed production auth when verification settings are missing
- ✅ Tenant-isolated scan WebSocket access
- ✅ SSRF protection — blocks localhost, private IPs, metadata endpoints, and DNS rebinding
- ✅ Jinja2-escaping for generated HTML reports
- ✅ Backend-enforced scan quota checks before Celery dispatch
- ✅ Role-based mutation policy (owner, admin, compliance-manager)
- ✅ Razorpay and Clerk webhook signature verification
- ✅ Tracked `.env.example` files use placeholders only (no real secrets)

**Before production deployment:**
- 🔄 Rotate any secrets that may have existed in local `.env` files
- 🔄 Review hosting dashboard environment variables
- 🔄 Run one authenticated browser smoke test
- 🔄 Run a public scan against the deployed demo target
- 🔄 Confirm email and report behavior is properly enabled or disabled

<br>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/divider.svg" width="900" alt="divider">

---

<br>

## Repository Structure

</div>

```
reguscan/
├── backend/                          # FastAPI application
│   ├── app/
│   │   ├── api/v1/endpoints/         # Route handlers
│   │   ├── core/                     # Settings, auth, Redis, plan rules, URL safety
│   │   ├── db/                       # SQLAlchemy sessions
│   │   ├── models/                   # ORM models
│   │   ├── schemas/                  # Pydantic schemas
│   │   ├── services/                 # Business logic
│   │   ├── tasks/                    # Celery pipeline (crawl → detect → classify → gap → report)
│   │   └── utils/                    # Async helpers
│   ├── alembic/                      # Database migrations
│   ├── tests/                        # pytest suite
│   └── pyproject.toml
├── frontend/                         # Next.js 16 application
│   ├── app/                          # App router pages & layouts
│   │   ├── (auth)/                   # Sign-in / sign-up
│   │   ├── (dashboard)/              # Dashboard, scans, settings, billing
│   │   ├── demo-ai-target/           # Deterministic AI demo page
│   │   └── pricing/                  # Pricing page
│   ├── components/                   # UI components
│   │   ├── dashboard/                # Dashboard components
│   │   ├── landing/                  # Landing page components
│   │   ├── scan/                     # Scan-related components
│   │   └── ui/                       # Reusable UI primitives
│   ├── lib/                          # Typed API client & utilities
│   ├── types/                        # TypeScript type definitions
│   └── middleware.ts                  # Clerk route protection
├── assets/                           # SVG animations and diagrams
├── docs/                             # Documentation
├── infra/docker/                     # Docker infrastructure configs
├── docker-compose.yml                # Local development stack
└── render.yaml                       # Render Blueprint for production deployment
```

<br>

<details>
<summary><b>Demo Target</b></summary>
<br>

ReguScan ships with a deterministic AI-signal demo page you can use to test the scanner reliably:

- `frontend/app/demo-ai-target/page.tsx` — Next.js route
- `docs/demo-ai-target.html` — standalone HTML version

After deploying the frontend, scan `https://<your-domain>/demo-ai-target` to validate the full pipeline.

> ⚠️ Do not weaken SSRF protections. Never scan localhost, private IPs, Docker-internal hosts, or cloud metadata addresses.

</details>

<details>
<summary><b>Deployment</b></summary>
<br>

**Backend → Render Blueprint**
1. Push to GitHub
2. Create a Render Blueprint from the repository
3. Configure backend environment variables in Render dashboard
4. Deploy
5. Run `alembic upgrade head` after first deploy

**Frontend → Vercel**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<key>
CLERK_SECRET_KEY=<key>
NEXT_PUBLIC_API_URL=https://<api-domain>
NEXT_PUBLIC_WS_URL=wss://<api-domain>
```

**CI/CD → GitHub Actions**
Configure secrets: `RENDER_API_KEY`, `RENDER_SERVICE_ID`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

</details>

<br>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/divider.svg" width="900" alt="divider">

---

<br>

## Why ReguScan?

</div>

<table>
<tr>
<td width="50%" valign="top">

**Built for technical teams** — ReguScan is designed by engineers for engineers. It doesn't just flag issues; it provides **evidence-backed, code-aware remediation** that your development team can act on immediately. Every detection includes screenshots, DOM traces, and network logs for full auditability.

**Crawl-quality aware** — Unlike naive scanners that report a perfect score when they find nothing (even if the crawl was incomplete), ReguScan distinguishes between *no AI found after a healthy crawl* and *no AI found because the crawl was shallow*. Low-confidence results are flagged as *incomplete* or *needs-review*.

**LLM-enhanced classification** — Pattern matching gets you 80% of the way. ReguScan then uses Groq LLM to classify each detected system against the full EU AI Act taxonomy, including Art. 6(3) exceptions, with structured fallback when the LLM is unavailable.

</td>
<td width="50%" valign="top">

**Practical remediation** — Gap analysis doesn't stop at "you need to comply with Article 50." ReguScan provides specific, actionable steps: code snippets for audit logging, UI component patterns for human oversight, transparency disclosure templates, and more.

**Real-time feedback** — Scans stream progress through Redis pub/sub to WebSocket-connected dashboards. You see the pipeline unfold in real time — crawling, detecting, classifying, analyzing — with no polling, no refresh.

**Built to last** — PostgreSQL for reliable storage, Redis for caching and pub/sub, Celery for distributed task execution, Playwright for resilient crawling, and a React frontend that's as beautiful as it is functional. Architecture that scales from local MVP to production deployment.

</td>
</tr>
</table>

<br>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/divider.svg" width="900" alt="divider">

---

<br>

## Portfolio Context

</div>

ReguScan is a working local MVP for AI governance and EU AI Act readiness — built as a full-stack application demonstrating practical compliance automation.

**What it does well:**
- Full-stack website AI detection pipeline with auditable evidence
- Crawl-quality handling to distinguish clean scans from incomplete ones
- Hardened auth, SSRF boundaries, scan ownership isolation, report rendering safety, and quota enforcement
- Backend-enforced Free/Starter/Pro/Enterprise plan model with Razorpay checkout
- Cinematic, animated UI with real-time WebSocket progress streaming

**What it does not claim:**
- Legal compliance guarantee or EU AI Act certification
- Production-ready paid subscriptions (Razorpay is wired but disabled by default)
- Perfect AI detection across all websites

<br>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/divider.svg" width="900" alt="divider">

---

<br>

## License

</div>

<div align="center">

<img src="https://raw.githubusercontent.com/Angel-ai1612/ReguScan/main/assets/footer.svg" width="500" alt="Footer">

</div>

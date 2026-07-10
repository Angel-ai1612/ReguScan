<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 180" width="800" height="180">
  <defs>
    <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="50%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="800" height="180" rx="16" fill="#0d0d1a" opacity="0.95"/>
  <rect x="0" y="0" width="800" height="180" rx="16" fill="none" stroke="url(#rg)" stroke-width="2" opacity="0.3"/>
  <text x="400" y="90" font-family="'Segoe UI', Arial, sans-serif" font-size="72" font-weight="800" fill="url(#rg)" text-anchor="middle" dominant-baseline="middle" letter-spacing="3">ReguScan</text>
  <text x="400" y="130" font-family="'Segoe UI', Arial, sans-serif" font-size="15" fill="#a078c0" text-anchor="middle" letter-spacing="4">✦ EVIDENCE-BASED EU AI ACT READINESS SCANNER ✦</text>
  <circle cx="130" cy="30" r="3" fill="#ff6b9d" opacity="0.5"/>
  <circle cx="670" cy="35" r="2" fill="#6b9dff" opacity="0.4"/>
  <circle cx="200" cy="155" r="4" fill="#c44dff" opacity="0.3"/>
  <circle cx="600" cy="150" r="2" fill="#ff6b9d" opacity="0.4"/>
  <circle cx="400" cy="20" r="2" fill="#6b9dff" opacity="0.25"/>
  <circle cx="320" cy="165" r="2" fill="#c44dff" opacity="0.3"/>
  <circle cx="500" cy="25" r="2" fill="#ff6b9d" opacity="0.25"/>
</svg>

</div>

<br>

<div align="center">

[![Status](https://img.shields.io/badge/status-local%20MVP-ff6b9d?style=for-the-badge&labelColor=0d0d1a)](https://github.com/Angel-ai1612/ReguScan)
[![License](https://img.shields.io/badge/license-MIT-c44dff?style=for-the-badge&labelColor=0d0d1a)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-6b9dff?style=for-the-badge&labelColor=0d0d1a&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-ff6b9d?style=for-the-badge&labelColor=0d0d1a&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12+-c44dff?style=for-the-badge&labelColor=0d0d1a&logo=python&logoColor=white)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6b9dff?style=for-the-badge&labelColor=0d0d1a&logo=typescript&logoColor=white)](https://typescriptlang.org/)

</div>

<br>

<div align="center">

ReguScan crawls a website, detects likely AI systems, classifies EU AI Act risk, maps compliance gaps, and generates practical remediation guidance. Built as a full-stack MVP for founders, SaaS teams, agencies, and compliance operators who need a fast technical review before deeper legal assessment.

> ⚠️ ReguScan provides **technical compliance guidance**. It is **not** legal advice and does **not** certify EU AI Act compliance.

</div>

<br>

<hr style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #ff6b9d, #c44dff, #6b9dff, transparent); opacity: 0.5;">

<br>

<div align="center">

# ✨ What It Does

</div>

<table>
<tr>
<td width="50%" valign="top">

🕸️ **Crawls websites** with Playwright — collects page, script, DOM, network, and screenshot evidence.

🤖 **Detects AI signals** — chatbots, AI assistants, generated content, recommendation systems, recruiting AI, and vendor scripts.

⚖️ **Classifies risk tiers** — uses Groq LLM with rule-based fallbacks to map systems to EU AI Act risk levels.

</td>
<td width="50%" valign="top">

📋 **Maps compliance gaps** — identifies obligations like Article 50 transparency and high-risk governance duties.

📡 **Real-time progress** — scan updates stream through WebSockets to the dashboard.

📊 **Rich output** — evidence cards, compliance gaps, score summaries, and HTML reports.

🔒 **Plan enforcement** — backend-enforced limits with Razorpay checkout gating.

</td>
</tr>
</table>

<br>

<hr style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #ff6b9d, #c44dff, #6b9dff, transparent); opacity: 0.5;">

<br>

<div align="center">

# 🏗️ Architecture

</div>

<div align="center">
<pre>
                    ┌─────────────────────┐
                    │  Next.js Frontend   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   FastAPI Backend    │
                    └──┬──────────────┬───┘
                       │              │
              ┌────────▼───┐   ┌──────▼──────────┐
              │ PostgreSQL  │   │  Celery Workers  │
              │   + Redis   │   └──────────────────┤
              └─────────────┘          │
                        ┌──────────────┼──────────────┐
                        │              │              │
                 ┌──────▼───┐   ┌──────▼───┐   ┌──────▼───┐
                 │ Playwright│   │   Groq   │   │  Report  │
                 │  Crawler  │   │Classifier│   │ Generator│
                 └───────────┘   └──────────┘   └──────────┘
</pre>
</div>

<br>

<details>
<summary><b>🛠️ Core Services</b></summary>
<br>

| Layer | Technology |
| :--- | :--- |
| 🎨 Frontend | Next.js 16, React, TypeScript, Tailwind CSS, Clerk |
| ⚡ API | FastAPI, Pydantic, SQLAlchemy, Alembic |
| ⚙️ Workers | Celery, Redis, Playwright |
| 🗄️ Database | PostgreSQL |
| 🧠 LLM | Groq |
| 🔌 Optional | Resend, Cloudflare R2, Pinecone, Razorpay, Sentry |
| 🐳 Runtime | Docker Compose |

</details>

<br>

<hr style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #ff6b9d, #c44dff, #6b9dff, transparent); opacity: 0.5;">

<br>

<div align="center">

# 📋 Product Flow

</div>

<div align="center">

```
        ┌────────┐     ┌──────────┐     ┌──────────┐     ┌────────┐     ┌────────┐     ┌──────────┐     ┌────────┐
        │ Sign In │ ──→ │ Add Site │ ──→ │  Create  │ ──→ │ Crawl  │ ──→ │ Detect │ ──→ │ Classify │ ──→ │ Report │
        └────────┘     └──────────┘     │  Scan    │     └────────┘     └────────┘     └──────────┘     └────────┘
                                        └──────────┘
```

</div>

<br>

<hr style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #ff6b9d, #c44dff, #6b9dff, transparent); opacity: 0.5;">

<br>

<div align="center">

# ⚠️ Risk Tiers

</div>

| Tier | EU AI Act Area | Examples | Typical Concern |
| :--- | :--- | :--- | :--- |
| 🚫 **Prohibited** | Article 5 | Social scoring, banned biometric or emotion-recognition use cases | Highest exposure |
| 🔴 **High-risk** | Annex III | HR AI, credit scoring, biometrics, fraud detection | Governance, oversight, records, risk management |
| 🟡 **Limited-risk** | Article 50 | Chatbots, AI-generated content, disclosure-sensitive AI interactions | Transparency and labeling |
| 🟢 **Minimal-risk** | Articles 4 / general | Lower-risk assistants or internal tools | AI literacy and review hygiene |

<br>

<details>
<summary><b>💎 Plan Limits</b></summary>
<br>

| Plan | Websites | Scan Limit | Gap Visibility | Billing Status |
| :--- | ---: | ---: | :--- | :--- |
| 🆓 Free | 1 | 1 total | Top 3 gaps | ✅ Available |
| ⭐ Starter | 3 | 10 / month | Full gaps | 🔒 Razorpay gated |
| 💎 Pro | 10 | 100 / month | Full gaps | 🔒 Razorpay gated |
| 🏢 Enterprise | Unlimited | Unlimited | Full gaps | 📞 Contact |

> PDF reports and public API access are **coming soon**.

</details>

<br>

<hr style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #ff6b9d, #c44dff, #6b9dff, transparent); opacity: 0.5;">

<br>

<div align="center">

# 📁 Repository Structure

</div>

<details>
<summary><b>Click to expand</b></summary>

```
reguscan/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/    FastAPI route handlers
│   │   ├── core/                Settings, auth, Redis, plan rules
│   │   ├── db/                  SQLAlchemy sessions
│   │   ├── models/              ORM models
│   │   ├── schemas/             Pydantic schemas
│   │   └── tasks/               Celery scan pipeline
│   ├── alembic/                 Database migrations
│   ├── tests/                   Backend tests
│   └── pyproject.toml
├── frontend/
│   ├── app/                     Next.js routes & dashboard
│   ├── components/              UI components
│   ├── lib/                     API client & utilities
│   ├── middleware.ts             Clerk route protection
│   └── package.json
├── docs/
│   └── demo-ai-target.html      Public scan target source
├── docker-compose.yml
└── render.yaml
```

</details>

<details>
<summary><b>📌 Key Files</b></summary>
<br>

**Backend:**
| File | Purpose |
| :--- | :--- |
| `backend/app/tasks/crawler.py` | 🕸️ Playwright crawling & evidence |
| `backend/app/tasks/detector.py` | 🔍 AI signal detection |
| `backend/app/tasks/classifier.py` | 🤖 Groq risk classification |
| `backend/app/tasks/gap_analyzer.py` | 📋 EU AI Act gap mapping |
| `backend/app/tasks/report_generator.py` | 📄 Reports & scoring |
| `backend/app/core/auth.py` | 🔐 Clerk JWT & role policy |
| `backend/app/core/plans.py` | 💎 Plan limits & gates |

**Frontend:**
| File | Purpose |
| :--- | :--- |
| `frontend/app/page.tsx` | 🏠 Public landing page |
| `frontend/app/demo-ai-target/page.tsx` | 🎯 Demo scan target |
| `frontend/app/(dashboard)/dashboard/scans/[scanId]/page.tsx` | 📊 Scan results |
| `frontend/app/(dashboard)/dashboard/settings/page.tsx` | ⚙️ Usage & billing |
| `frontend/lib/api.ts` | 🔗 Typed API client |
| `frontend/components/dashboard/TokenInjector.tsx` | 🪙 Clerk token bridge |

</details>

<br>

<hr style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #ff6b9d, #c44dff, #6b9dff, transparent); opacity: 0.5;">

<br>

<details>
<summary><b>🚀 Quick Start</b></summary>
<br>

### Prerequisites

- 🐳 Docker Desktop
- 📦 Git
- 🐍 Python 3.12+
- ⚡ Node.js 20+
- 🔑 Valid Clerk, database, Redis, and Groq credentials

> On Windows PowerShell, use `npm.cmd` if `npm.ps1` is blocked by execution policy.

### 📝 Environment Setup

```powershell
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

<details>
<summary><b>Required backend env vars</b></summary>

```
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

</details>

<details>
<summary><b>Required frontend env vars</b></summary>

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

</details>

<details>
<summary><b>Optional env vars</b></summary>

```
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

> Keep `RAZORPAY_CHECKOUT_ENABLED=false` until a real Razorpay test checkout, webhook delivery, idempotency, cancellation, and plan-upgrade flow has passed in staging.

</details>

<br>

### 🐳 Local Development

**Start the stack:**
```powershell
cd "C:\Users\MD Abdul Rahman\Downloads\reguscan\reguscan"
docker compose up -d --build
docker compose ps
```

**Run migrations:**
```powershell
docker compose exec api alembic upgrade head
```

**Install Playwright browsers (if needed):**
```powershell
docker compose exec worker playwright install chromium --with-deps
```

**Local services:**
| Service | URL |
| :--- | :--- |
| 🎨 Frontend | http://localhost:3000 |
| 💚 Backend health | http://localhost:8000/health |
| 📖 API docs | http://localhost:8000/docs |
| 🌸 Flower | http://localhost:5555 |

**Daily:**
```powershell
docker compose start   # start existing containers
docker compose stop    # stop containers
```

> Use `docker compose down` only when intentionally resetting containers.

### 🛠️ Dev Commands

**Backend:**
```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest tests -q
.\.venv\Scripts\alembic.exe heads
```

**Frontend:**
```powershell
cd frontend
npm.cmd run type-check
npm.cmd run build
```

**Docker equivalents:**
```powershell
docker compose exec -T api pytest tests -q
docker compose exec -T frontend npm run type-check
docker compose exec -T frontend npm run build
```

**Logs:**
```powershell
docker compose logs -f api
docker compose logs -f worker
docker compose logs -f frontend
docker compose logs -f db
docker compose logs -f redis
```

</details>

<br>

<hr style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #ff6b9d, #c44dff, #6b9dff, transparent); opacity: 0.5;">

<br>

<details>
<summary><b>🎯 Demo Target</b></summary>
<br>

ReguScan includes a deterministic AI-signal page for reliable demos:

```
frontend/app/demo-ai-target/page.tsx
docs/demo-ai-target.html
```

For a public demo, deploy the frontend and scan:

```
https://<your-frontend-domain>/demo-ai-target
```

> ⚠️ Do **not** weaken SSRF protections to scan `localhost`, private IPs, Docker-internal hosts, or cloud metadata addresses.

</details>

<details>
<summary><b>🔒 Security Posture</b></summary>
<br>

**Implemented:**
- ✅ Clerk JWT verification with configured issuer, JWKS, audience, authorized party, expiry, and pending-session checks
- ✅ Production auth fails closed when verification settings are missing
- ✅ Tenant-aware scan WebSocket access
- ✅ SSRF protection for localhost, private, metadata, reserved, and DNS-rebinding targets
- ✅ Jinja escaping for generated HTML reports
- ✅ Backend scan quota checks before Celery dispatch
- ✅ Role-based mutation policy (owner, admin, compliance-manager)
- ✅ Razorpay and Clerk webhook secret verification
- ✅ Tracked env examples use placeholders only

**Before public deployment:**
- 🔄 Rotate any real secrets that ever lived in ignored local `.env` files
- 🔄 Review hosting dashboard env vars manually
- 🔄 Run one authenticated browser smoke test
- 🔄 Run a public scan against the hosted demo target
- 🔄 Confirm email/report behavior is enabled or clearly disabled

</details>

<details>
<summary><b>📊 Scoring Notes</b></summary>
<br>

The scoring model deducts points from 100 based on compliance gaps. The main risk is not the arithmetic — it's weak upstream evidence.

```
Weak crawl or narrow detection
  → 0 AI systems
  → 0 classifications
  → 0 gaps
  → false 100/100 score
```

The product should distinguish:
- ✅ No AI found **after a healthy crawl**
- ⚠️ No AI found **because crawl or detection was incomplete**

Low-confidence crawls should be shown as *incomplete* or *needs-review* rather than *clean*.

</details>

<details>
<summary><b>☁️ Deployment</b></summary>
<br>

**Backend** → Render Blueprint (`render.yaml`)

1. Push to GitHub
2. Create a Render Blueprint from the repository
3. Set all backend env vars in Render
4. Deploy
5. Run `alembic upgrade head` after first deploy

**Frontend** → Vercel

Required env vars:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_API_URL=https://<api-domain>
NEXT_PUBLIC_WS_URL=wss://<api-domain>
```

**CI/CD** → GitHub Actions

Configure secrets:
```
RENDER_API_KEY
RENDER_SERVICE_ID
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

</details>

<details>
<summary><b>💳 Billing Model</b></summary>
<br>

Razorpay is wired as a controlled test flow. The app must **not** publicly claim paid subscriptions are production-ready.

**Current rules:**
- Free plan works without payment
- Paid checkout is disabled unless the backend explicitly enables Razorpay checkout
- Frontend checkout success never upgrades a plan by itself
- Backend verifies Razorpay payment signatures
- Organization plan changes happen only after verified webhook events
- Legacy Stripe fields remain only for non-destructive migration safety

**Before paid launch:**
- [ ] Implement true Razorpay Subscriptions creation
- [ ] Add a dedicated billing event ledger with unique provider event IDs
- [ ] Verify real Razorpay test checkout and webhook delivery
- [ ] Test cancellation, duplicate events, failed payments, and plan-limit changes

</details>

<br>

<hr style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #ff6b9d, #c44dff, #6b9dff, transparent); opacity: 0.5;">

<br>

<div align="center">

## 🌟 Portfolio Summary

</div>

ReguScan is a working local MVP for AI governance and EU AI Act readiness. It combines a Next.js dashboard, FastAPI backend, PostgreSQL, Redis, Celery workers, Playwright crawling, AI signal detection, LLM-assisted risk classification, gap analysis, and report generation.

**✅ Strong claims:**
- Built a full-stack website AI detection pipeline
- Added evidence cards and crawl-quality handling so results are auditable
- Hardened auth, SSRF boundaries, scan ownership, report rendering, scan quotas, and webhook handling
- Implemented backend-enforced Free/Starter/Pro/Enterprise plan rules

**❌ Avoid claiming:**
- Legal compliance guarantee
- EU AI Act certification
- Production-ready paid subscriptions
- Perfect AI detection across all websites
- Public SaaS launch approval

<br>

<hr style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #ff6b9d, #c44dff, #6b9dff, transparent); opacity: 0.5;">

<br>

<div align="center">

# 🗺️ Roadmap

</div>

- [ ] 🔬 Run final authenticated browser smoke test
- [ ] 🌐 Deploy or host the demo target and scan its public URL
- [ ] 📸 Capture final product screenshots
- [ ] 📈 Expand detector signatures with measured FP/FN rates
- [ ] 📝 Add stronger sector-specific remediation templates
- [ ] 📊 Add production observability for scan failures and worker health
- [ ] 💳 Complete Razorpay Subscriptions before public paid launch
- [ ] 📒 Add a billing event ledger
- [ ] 📎 Improve public sample reports and shareable report views

<br>

<hr style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #ff6b9d, #c44dff, #6b9dff, transparent); opacity: 0.5;">

<br>

<div align="center">

## 📄 License

**MIT** — feel free to use, modify, and distribute.

<br>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 50" width="380" height="50">
  <defs>
    <linearGradient id="foot" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="50%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
    </linearGradient>
  </defs>
  <text x="190" y="25" font-family="'Segoe UI', Arial, sans-serif" font-size="13" fill="#a078c0" text-anchor="middle">Made with ❤️ for AI Governance</text>
  <line x1="60" y1="38" x2="320" y2="38" stroke="url(#foot)" stroke-width="1" opacity="0.3"/>
</svg>

</div>

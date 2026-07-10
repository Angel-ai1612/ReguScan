<div align="center">

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="800" height="200">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b9d">
        <animate attributeName="stop-color" values="#ff6b9d;#c44dff;#6b9dff;#ff6b9d" dur="6s" repeatCount="indefinite"/>
      </stop>
      <stop offset="50%" stop-color="#c44dff">
        <animate attributeName="stop-color" values="#c44dff;#6b9dff;#ff6b9d;#c44dff" dur="6s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#6b9dff">
        <animate attributeName="stop-color" values="#6b9dff;#ff6b9d;#c44dff;#6b9dff" dur="6s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0.2"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0.2"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#c44dff" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background glow -->
  <ellipse cx="400" cy="100" rx="320" ry="80" fill="url(#grad2)">
    <animate attributeName="rx" values="320;340;320" dur="3s" repeatCount="indefinite"/>
  </ellipse>

  <!-- Decorative circles -->
  <circle cx="120" cy="50" r="4" fill="#ff6b9d" opacity="0.6">
    <animate attributeName="cy" values="50;45;50" dur="2.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="680" cy="60" r="3" fill="#6b9dff" opacity="0.5">
    <animate attributeName="cy" values="60;54;60" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="200" cy="150" r="5" fill="#c44dff" opacity="0.4">
    <animate attributeName="cy" values="150;142;150" dur="3.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="600" cy="155" r="3" fill="#ff6b9d" opacity="0.5">
    <animate attributeName="cy" values="155;148;155" dur="2.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="400" cy="30" r="3" fill="#6b9dff" opacity="0.3">
    <animate attributeName="cy" values="30;25;30" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="320" cy="170" r="2" fill="#c44dff" opacity="0.4">
    <animate attributeName="cy" values="170;165;170" dur="2.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="500" cy="40" r="2" fill="#ff6b9d" opacity="0.3">
    <animate attributeName="cy" values="40;35;40" dur="2.7s" repeatCount="indefinite"/>
  </circle>

  <!-- R Logo -->
  <text x="400" y="100" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="url(#grad1)" text-anchor="middle" dominant-baseline="middle" filter="url(#glow)">
    ReguScan
    <animate attributeName="letter-spacing" values="2;6;2" dur="3s" repeatCount="indefinite"/>
  </text>

  <!-- Tagline -->
  <text x="400" y="140" font-family="Arial, sans-serif" font-size="16" fill="#a078c0" text-anchor="middle" opacity="0.85">
    ✦ Evidence-based EU AI Act readiness scanner ✦
  </text>

  <!-- Underline -->
  <line x1="250" y1="155" x2="550" y2="155" stroke="url(#grad1)" stroke-width="1.5" opacity="0.6">
    <animate attributeName="x1" values="300;250;300" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="x2" values="500;550;500" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite"/>
  </line>
</svg>
```

</div>

<br>

<div align="center">

[![Status](https://img.shields.io/badge/status-local%20MVP-ff6b9d?style=for-the-badge&labelColor=1a1a2e)](https://github.com/Angel-ai1612/ReguScan)
[![License](https://img.shields.io/badge/license-MIT-c44dff?style=for-the-badge&labelColor=1a1a2e)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-6b9dff?style=for-the-badge&labelColor=1a1a2e&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-ff6b9d?style=for-the-badge&labelColor=1a1a2e&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12+-c44dff?style=for-the-badge&labelColor=1a1a2e&logo=python&logoColor=white)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6b9dff?style=for-the-badge&labelColor=1a1a2e&logo=typescript&logoColor=white)](https://typescriptlang.org/)

<br>

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 30" width="900" height="30">
  <defs>
    <linearGradient id="dash" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="15" x2="900" y2="15" stroke="url(#dash)" stroke-width="1.5" stroke-dasharray="6,8">
    <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="15" r="4" fill="#c44dff">
    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>
```

</div>

<table align="center">
<tr>
<td align="center" width="9999">
<br>
ReguScan crawls a website, detects likely AI systems, classifies EU AI Act risk, maps compliance gaps, and generates practical remediation guidance. Built as a full-stack MVP for founders, SaaS teams, agencies, and compliance operators who need a fast technical review before deeper legal assessment.
<br><br>
<em>ReguScan provides technical compliance guidance. It is not legal advice and does not certify EU AI Act compliance.</em>
<br><br>
</td>
</tr>
</table>

<br>

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 30" width="900" height="30">
  <defs>
    <linearGradient id="dash2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="15" x2="900" y2="15" stroke="url(#dash2)" stroke-width="1.5" stroke-dasharray="6,8">
    <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="15" r="4" fill="#c44dff">
    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>
```

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

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 30" width="900" height="30">
  <defs>
    <linearGradient id="dash3" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="15" x2="900" y2="15" stroke="url(#dash3)" stroke-width="1.5" stroke-dasharray="6,8">
    <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="15" r="4" fill="#c44dff">
    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>
```

<br>

<div align="center">

# 🏗️ Architecture

</div>

<div align="center">

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 280" width="600" height="280">
  <defs>
    <linearGradient id="box1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#ff6b9d" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="box2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c44dff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#c44dff" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="box3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6b9dff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="arrow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="100%" stop-color="#c44dff"/>
    </linearGradient>
  </defs>

  <!-- Node 1 -->
  <rect x="200" y="10" width="200" height="40" rx="8" fill="url(#box1)" stroke="#ff6b9d" stroke-width="1.5"/>
  <text x="300" y="35" font-family="Arial, sans-serif" font-size="13" fill="#ff6b9d" text-anchor="middle" font-weight="bold">Next.js Frontend</text>

  <!-- Arrow 1 -->
  <line x1="300" y1="50" x2="300" y2="70" stroke="url(#arrow)" stroke-width="1.5" stroke-dasharray="4,3">
    <animate attributeName="stroke-dashoffset" values="0;-14" dur="1s" repeatCount="indefinite"/>
  </line>
  <polygon points="295,68 300,78 305,68" fill="#c44dff"/>

  <!-- Node 2 -->
  <rect x="200" y="78" width="200" height="40" rx="8" fill="url(#box2)" stroke="#c44dff" stroke-width="1.5"/>
  <text x="300" y="103" font-family="Arial, sans-serif" font-size="13" fill="#c44dff" text-anchor="middle" font-weight="bold">FastAPI Backend</text>

  <!-- Arrow 2 -->
  <line x1="300" y1="118" x2="300" y2="138" stroke="url(#arrow)" stroke-width="1.5" stroke-dasharray="4,3">
    <animate attributeName="stroke-dashoffset" values="0;-14" dur="1s" repeatCount="indefinite"/>
  </line>
  <polygon points="295,136 300,146 305,136" fill="#6b9dff"/>

  <!-- Branches label -->
  <text x="300" y="158" font-family="Arial, sans-serif" font-size="11" fill="#a078c0" text-anchor="middle">⬋  ⬊</text>

  <!-- Branch lines -->
  <line x1="300" y1="162" x2="160" y2="182" stroke="#ff6b9d" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
  <line x1="300" y1="162" x2="440" y2="182" stroke="#6b9dff" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
  <polygon points="155,180 160,190 165,180" fill="#ff6b9d"/>
  <polygon points="435,180 440,190 445,180" fill="#6b9dff"/>

  <!-- Node 3a -->
  <rect x="60" y="190" width="200" height="40" rx="8" fill="url(#box1)" stroke="#ff6b9d" stroke-width="1.5"/>
  <text x="160" y="215" font-family="Arial, sans-serif" font-size="12" fill="#ff6b9d" text-anchor="middle">PostgreSQL + Redis</text>

  <!-- Node 3b -->
  <rect x="340" y="190" width="200" height="40" rx="8" fill="url(#box3)" stroke="#6b9dff" stroke-width="1.5"/>
  <text x="440" y="215" font-family="Arial, sans-serif" font-size="12" fill="#6b9dff" text-anchor="middle">Celery Workers</text>

  <!-- Arrow 3a -->
  <line x1="340" y1="230" x2="340" y2="240" stroke="#6b9dff" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>

  <!-- Worker tasks -->
  <text x="440" y="248" font-family="Arial, sans-serif" font-size="10" fill="#6b9dff" text-anchor="middle">🕸️ Crawler</text>
  <text x="440" y="262" font-family="Arial, sans-serif" font-size="10" fill="#6b9dff" text-anchor="middle">🔍 Detector → 🤖 Groq → 📋 Gaps → 📄 Reports</text>

  <!-- Pulsing dots -->
  <circle cx="160" cy="240" r="3" fill="#ff6b9d" opacity="0.6">
    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="440" cy="240" r="3" fill="#6b9dff" opacity="0.6">
    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>
```

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

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 30" width="900" height="30">
  <defs>
    <linearGradient id="dash4" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="15" x2="900" y2="15" stroke="url(#dash4)" stroke-width="1.5" stroke-dasharray="6,8">
    <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="15" r="4" fill="#c44dff">
    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>
```

<br>

<div align="center">

# 📋 Product Flow

</div>

<div align="center">

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 90" width="800" height="90">
  <defs>
    <linearGradient id="flow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="50%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
    </linearGradient>
  </defs>

  <g>
    <rect x="10" y="10" width="80" height="36" rx="18" fill="#ff6b9d" opacity="0.15" stroke="#ff6b9d" stroke-width="1"/>
    <text x="50" y="33" font-family="Arial, sans-serif" font-size="10" fill="#ff6b9d" text-anchor="middle" font-weight="bold">Sign In</text>
  </g>

  <g>
    <line x1="90" y1="28" x2="108" y2="28" stroke="#c44dff" stroke-width="1" stroke-dasharray="3,3">
      <animate attributeName="stroke-dashoffset" values="0;-24" dur="0.8s" repeatCount="indefinite"/>
    </line>
    <polygon points="106,24 116,28 106,32" fill="#c44dff"/>
  </g>

  <g>
    <rect x="116" y="10" width="80" height="36" rx="18" fill="#c44dff" opacity="0.15" stroke="#c44dff" stroke-width="1"/>
    <text x="156" y="33" font-family="Arial, sans-serif" font-size="10" fill="#c44dff" text-anchor="middle" font-weight="bold">Add Website</text>
  </g>

  <g>
    <line x1="196" y1="28" x2="214" y2="28" stroke="#c44dff" stroke-width="1" stroke-dasharray="3,3">
      <animate attributeName="stroke-dashoffset" values="0;-24" dur="0.8s" repeatCount="indefinite"/>
    </line>
    <polygon points="212,24 222,28 212,32" fill="#c44dff"/>
  </g>

  <g>
    <rect x="222" y="10" width="80" height="36" rx="18" fill="#c44dff" opacity="0.15" stroke="#c44dff" stroke-width="1"/>
    <text x="262" y="33" font-family="Arial, sans-serif" font-size="10" fill="#c44dff" text-anchor="middle" font-weight="bold">Create Scan</text>
  </g>

  <g>
    <line x1="302" y1="28" x2="320" y2="28" stroke="#c44dff" stroke-width="1" stroke-dasharray="3,3">
      <animate attributeName="stroke-dashoffset" values="0;-24" dur="0.8s" repeatCount="indefinite"/>
    </line>
    <polygon points="318,24 328,28 318,32" fill="#c44dff"/>
  </g>

  <g>
    <rect x="328" y="10" width="80" height="36" rx="18" fill="#c44dff" opacity="0.15" stroke="#c44dff" stroke-width="1"/>
    <text x="368" y="33" font-family="Arial, sans-serif" font-size="10" fill="#c44dff" text-anchor="middle" font-weight="bold">Crawl</text>
  </g>

  <g>
    <line x1="408" y1="28" x2="426" y2="28" stroke="#c44dff" stroke-width="1" stroke-dasharray="3,3">
      <animate attributeName="stroke-dashoffset" values="0;-24" dur="0.8s" repeatCount="indefinite"/>
    </line>
    <polygon points="424,24 434,28 424,32" fill="#c44dff"/>
  </g>

  <g>
    <rect x="434" y="10" width="80" height="36" rx="18" fill="#c44dff" opacity="0.15" stroke="#c44dff" stroke-width="1"/>
    <text x="474" y="33" font-family="Arial, sans-serif" font-size="10" fill="#c44dff" text-anchor="middle" font-weight="bold">Detect</text>
  </g>

  <g>
    <line x1="514" y1="28" x2="532" y2="28" stroke="#c44dff" stroke-width="1" stroke-dasharray="3,3">
      <animate attributeName="stroke-dashoffset" values="0;-24" dur="0.8s" repeatCount="indefinite"/>
    </line>
    <polygon points="530,24 540,28 530,32" fill="#6b9dff"/>
  </g>

  <g>
    <rect x="540" y="10" width="80" height="36" rx="18" fill="#6b9dff" opacity="0.15" stroke="#6b9dff" stroke-width="1"/>
    <text x="580" y="33" font-family="Arial, sans-serif" font-size="10" fill="#6b9dff" text-anchor="middle" font-weight="bold">Classify</text>
  </g>

  <g>
    <line x1="620" y1="28" x2="638" y2="28" stroke="#6b9dff" stroke-width="1" stroke-dasharray="3,3">
      <animate attributeName="stroke-dashoffset" values="0;-24" dur="0.8s" repeatCount="indefinite"/>
    </line>
    <polygon points="636,24 646,28 636,32" fill="#6b9dff"/>
  </g>

  <g>
    <rect x="646" y="10" width="80" height="36" rx="18" fill="#6b9dff" opacity="0.15" stroke="#6b9dff" stroke-width="1"/>
    <text x="686" y="33" font-family="Arial, sans-serif" font-size="10" fill="#6b9dff" text-anchor="middle" font-weight="bold">Report</text>
  </g>

  <!-- progress bar underneath -->
  <rect x="10" y="60" width="716" height="4" rx="2" fill="#1a1a2e" opacity="0.3"/>
  <rect x="10" y="60" width="716" height="4" rx="2" fill="url(#flow)" opacity="0.6">
    <animate attributeName="width" values="0;716" dur="4s" repeatCount="indefinite"/>
  </rect>
</svg>
```

</div>

<br>

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 30" width="900" height="30">
  <defs>
    <linearGradient id="dash5" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="15" x2="900" y2="15" stroke="url(#dash5)" stroke-width="1.5" stroke-dasharray="6,8">
    <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="15" r="4" fill="#c44dff">
    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>
```

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

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 30" width="900" height="30">
  <defs>
    <linearGradient id="dash6" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="15" x2="900" y2="15" stroke="url(#dash6)" stroke-width="1.5" stroke-dasharray="6,8">
    <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="15" r="4" fill="#c44dff">
    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>
```

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

*PDF reports and public API access are coming soon.*

</details>

<br>

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 30" width="900" height="30">
  <defs>
    <linearGradient id="dash7" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="15" x2="900" y2="15" stroke="url(#dash7)" stroke-width="1.5" stroke-dasharray="6,8">
    <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="15" r="4" fill="#c44dff">
    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>
```

<br>

<div align="center">

# 📁 Repository Structure

</div>

<details>
<summary><b>Click to expand</b></summary>

```text
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

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 30" width="900" height="30">
  <defs>
    <linearGradient id="dash8" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="15" x2="900" y2="15" stroke="url(#dash8)" stroke-width="1.5" stroke-dasharray="6,8">
    <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="15" r="4" fill="#c44dff">
    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>
```

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

**Required backend env vars:**
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

**Required frontend env vars:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

**Optional:**
```
RESEND_API_KEY=           R2_SECRET_ACCESS_KEY=     SENTRY_DSN=
RESEND_FROM_EMAIL=        R2_BUCKET=                RAZORPAY_...
R2_ACCOUNT_ID=            R2_PUBLIC_URL=
R2_ACCESS_KEY_ID=         PINECONE_API_KEY=
```

> Keep `RAZORPAY_CHECKOUT_ENABLED=false` until real Razorpay testing passes.

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

### 🌐 Local Services

| Service | URL |
| :--- | :--- |
| 🎨 Frontend | http://localhost:3000 |
| 💚 Backend health | http://localhost:8000/health |
| 📖 API docs | http://localhost:8000/docs |
| 🌸 Flower | http://localhost:5555 |

**Daily start / stop:**
```powershell
docker compose start    # → start existing containers
docker compose stop     # → stop containers
```

> Use `docker compose down` only when resetting containers.

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

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 30" width="900" height="30">
  <defs>
    <linearGradient id="dash9" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="15" x2="900" y2="15" stroke="url(#dash9)" stroke-width="1.5" stroke-dasharray="6,8">
    <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="15" r="4" fill="#c44dff">
    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>
```

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

> ⚠️ Do not weaken SSRF protections to scan `localhost`, private IPs, Docker-internal hosts, or cloud metadata addresses.

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

```text
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
RENDER_API_KEY           VERCEL_TOKEN             VERCEL_PROJECT_ID
RENDER_SERVICE_ID        VERCEL_ORG_ID
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

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 30" width="900" height="30">
  <defs>
    <linearGradient id="dash10" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="15" x2="900" y2="15" stroke="url(#dash10)" stroke-width="1.5" stroke-dasharray="6,8">
    <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="15" r="4" fill="#c44dff">
    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>
```

<br>

<div align="center">

## 🌟 Portfolio Summary

</div>

<table>
<tr>
<td>

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

</td>
</tr>
</table>

<br>

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 30" width="900" height="30">
  <defs>
    <linearGradient id="dash11" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="15" x2="900" y2="15" stroke="url(#dash11)" stroke-width="1.5" stroke-dasharray="6,8">
    <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="15" r="4" fill="#c44dff">
    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>
```

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

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 30" width="900" height="30">
  <defs>
    <linearGradient id="dash12" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="15" x2="900" y2="15" stroke="url(#dash12)" stroke-width="1.5" stroke-dasharray="6,8">
    <animate attributeName="stroke-dashoffset" values="0;-100" dur="3s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="15" r="4" fill="#c44dff">
    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>
```

<br>

<div align="center">

## 📄 License

**MIT** — feel free to use, modify, and distribute.

<br>

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60" width="400" height="60">
  <defs>
    <linearGradient id="foot" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="50%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
    </linearGradient>
  </defs>
  <text x="200" y="30" font-family="Arial, sans-serif" font-size="14" fill="#a078c0" text-anchor="middle">
    Made with
  </text>
  <text x="243" y="30" font-family="Arial, sans-serif" font-size="14" fill="#ff6b9d" text-anchor="middle">
    <animate attributeName="fill" values="#ff6b9d;#c44dff;#6b9dff;#ff6b9d" dur="2s" repeatCount="indefinite"/>
    ❤️
  </text>
  <text x="270" y="30" font-family="Arial, sans-serif" font-size="14" fill="#a078c0" text-anchor="middle">
    for AI Governance
  </text>
  <line x1="80" y1="45" x2="320" y2="45" stroke="url(#foot)" stroke-width="1" opacity="0.4"/>
</svg>
```

</div>

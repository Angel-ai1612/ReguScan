<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 240" width="900" height="240">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a1a" stop-opacity="0.98"/>
      <stop offset="50%" stop-color="#0d0d24" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#0a0a1a" stop-opacity="0.98"/>
    </linearGradient>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b9d">
        <animate attributeName="stop-color" values="#ff6b9d;#ff4d7a;#c44dff;#6b9dff;#ff6b9d" dur="8s" repeatCount="indefinite"/>
      </stop>
      <stop offset="25%" stop-color="#ff4d7a">
        <animate attributeName="stop-color" values="#ff4d7a;#c44dff;#6b9dff;#ff6b9d;#ff4d7a" dur="8s" repeatCount="indefinite"/>
      </stop>
      <stop offset="50%" stop-color="#c44dff">
        <animate attributeName="stop-color" values="#c44dff;#6b9dff;#ff6b9d;#ff4d7a;#c44dff" dur="8s" repeatCount="indefinite"/>
      </stop>
      <stop offset="75%" stop-color="#6b9dff">
        <animate attributeName="stop-color" values="#6b9dff;#ff6b9d;#ff4d7a;#c44dff;#6b9dff" dur="8s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#ff6b9d">
        <animate attributeName="stop-color" values="#ff6b9d;#ff4d7a;#c44dff;#6b9dff;#ff6b9d" dur="8s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0.15"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0.15"/>
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0.3"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="5s" repeatCount="indefinite"/>
    </linearGradient>
    <filter id="glowFilter">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="softGlow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect x="10" y="10" width="880" height="220" rx="20" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="2"/>

  <ellipse cx="450" cy="120" rx="350" ry="90" fill="url(#glowGrad)">
    <animate attributeName="rx" values="350;370;350" dur="4s" repeatCount="indefinite"/>
    <animate attributeName="ry" values="90;100;90" dur="4s" repeatCount="indefinite"/>
  </ellipse>

  <circle cx="150" cy="40" r="3" fill="#ff6b9d" opacity="0.6">
    <animate attributeName="cy" values="40;30;40" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="750" cy="50" r="2.5" fill="#6b9dff" opacity="0.5">
    <animate attributeName="cy" values="50;38;50" dur="3.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="250" cy="200" r="4" fill="#c44dff" opacity="0.4">
    <animate attributeName="cy" values="200;188;200" dur="4s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="680" cy="195" r="2.5" fill="#ff6b9d" opacity="0.5">
    <animate attributeName="cy" values="195;185;195" dur="3.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="450" cy="25" r="2" fill="#6b9dff" opacity="0.3">
    <animate attributeName="cy" values="25;20;25" dur="2.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="100" cy="130" r="2" fill="#c44dff" opacity="0.3">
    <animate attributeName="cy" values="130;122;130" dur="2.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="800" cy="140" r="2" fill="#ff6b9d" opacity="0.3">
    <animate attributeName="cy" values="140;132;140" dur="3.1s" repeatCount="indefinite"/>
  </circle>
  <circle cx="350" cy="30" r="1.5" fill="#6b9dff" opacity="0.4">
    <animate attributeName="cy" values="30;24;30" dur="2.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="600" cy="210" r="1.5" fill="#c44dff" opacity="0.3">
    <animate attributeName="cy" values="210;204;210" dur="2.6s" repeatCount="indefinite"/>
  </circle>

  <text x="450" y="115" font-family="'Segoe UI', Arial, sans-serif" font-size="76" font-weight="900" fill="url(#titleGrad)" text-anchor="middle" dominant-baseline="middle" letter-spacing="4" filter="url(#glowFilter)">
    ReguScan
  </text>

  <text x="450" y="158" font-family="'Segoe UI', Arial, sans-serif" font-size="14" fill="#a078c0" text-anchor="middle" letter-spacing="5" opacity="0.85">
    EVIDENCE-BASED EU AI ACT READINESS SCANNER
  </text>

  <line x1="250" y1="178" x2="650" y2="178" stroke="url(#titleGrad)" stroke-width="1.5" opacity="0.6">
    <animate attributeName="x1" values="300;250;300" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="x2" values="600;650;600" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite"/>
  </line>

  <text x="450" y="202" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="#6b5b7a" text-anchor="middle" letter-spacing="2">
    crawl · detect · classify · remediate
  </text>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 50" width="900" height="50">
  <rect x="0" y="0" width="900" height="50" fill="none"/>
  <g>
    <a href="https://github.com/Angel-ai1612/ReguScan">
      <rect x="20" y="10" width="160" height="30" rx="15" fill="#1a1a2e" stroke="#ff6b9d" stroke-width="1.5">
        <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
      </rect>
      <circle cx="40" cy="25" r="4" fill="#ff6b9d">
        <animate attributeName="r" values="4;5;4" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <text x="105" y="29" font-family="Arial, sans-serif" font-size="11" fill="#ff6b9d" text-anchor="middle" font-weight="bold">status: local MVP</text>
    </a>
  </g>
  <g>
    <a href="LICENSE">
      <rect x="200" y="10" width="130" height="30" rx="15" fill="#1a1a2e" stroke="#c44dff" stroke-width="1.5"/>
      <text x="265" y="29" font-family="Arial, sans-serif" font-size="11" fill="#c44dff" text-anchor="middle" font-weight="bold">license: MIT</text>
    </a>
  </g>
  <g>
    <a href="https://nextjs.org/">
      <rect x="350" y="10" width="150" height="30" rx="15" fill="#1a1a2e" stroke="#6b9dff" stroke-width="1.5"/>
      <text x="425" y="29" font-family="Arial, sans-serif" font-size="11" fill="#6b9dff" text-anchor="middle" font-weight="bold">Next.js 16</text>
    </a>
  </g>
  <g>
    <a href="https://fastapi.tiangolo.com/">
      <rect x="520" y="10" width="150" height="30" rx="15" fill="#1a1a2e" stroke="#ff6b9d" stroke-width="1.5">
        <animate attributeName="stroke-opacity" values="1;0.4;1" dur="2.5s" repeatCount="indefinite"/>
      </rect>
      <text x="595" y="29" font-family="Arial, sans-serif" font-size="11" fill="#ff6b9d" text-anchor="middle" font-weight="bold">FastAPI</text>
    </a>
  </g>
  <g>
    <a href="https://python.org/">
      <rect x="690" y="10" width="100" height="30" rx="15" fill="#1a1a2e" stroke="#c44dff" stroke-width="1.5"/>
      <text x="740" y="29" font-family="Arial, sans-serif" font-size="11" fill="#c44dff" text-anchor="middle" font-weight="bold">Python 3.12+</text>
    </a>
  </g>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 20" width="900" height="20">
  <defs>
    <linearGradient id="div1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="10" x2="900" y2="10" stroke="url(#div1)" stroke-width="1.5" stroke-dasharray="6,6">
    <animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="10" r="3" fill="#c44dff">
    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 80" width="800" height="80">
  <defs>
    <linearGradient id="descGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="5%" stop-color="#ff6b9d" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.3"/>
      <stop offset="95%" stop-color="#6b9dff" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="800" height="80" rx="12" fill="url(#descGrad)"/>
  <text x="400" y="28" font-family="'Segoe UI', Arial, sans-serif" font-size="13" fill="#d0b0e0" text-anchor="middle">ReguScan crawls a website, detects likely AI systems, classifies EU AI Act risk,</text>
  <text x="400" y="48" font-family="'Segoe UI', Arial, sans-serif" font-size="13" fill="#d0b0e0" text-anchor="middle">maps compliance gaps, and generates practical remediation guidance.</text>
  <text x="400" y="70" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="#6b5b7a" text-anchor="middle" font-style="italic">⚠️ Technical compliance guidance — not legal advice. Does not certify EU AI Act compliance.</text>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 20" width="900" height="20">
  <defs>
    <linearGradient id="div2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="10" x2="900" y2="10" stroke="url(#div2)" stroke-width="1.5" stroke-dasharray="6,6">
    <animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="10" r="3" fill="#c44dff">
    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 50" width="400" height="50">
  <defs>
    <linearGradient id="whatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="50%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
    </linearGradient>
  </defs>
  <text x="200" y="35" font-family="'Segoe UI', Arial, sans-serif" font-size="32" font-weight="800" fill="url(#whatGrad)" text-anchor="middle" letter-spacing="2">✨ What It Does</text>
  <line x1="100" y1="45" x2="300" y2="45" stroke="url(#whatGrad)" stroke-width="1" opacity="0.4"/>
</svg>

</div>

<br>

<table>
<tr>
<td width="50%" valign="top">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
  <circle cx="10" cy="10" r="6" fill="#ff6b9d" opacity="0.8">
    <animate attributeName="r" values="6;7;6" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg> **Crawls websites** with Playwright — collects page, script, DOM, network, and screenshot evidence.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
  <circle cx="10" cy="10" r="6" fill="#c44dff" opacity="0.8">
    <animate attributeName="r" values="6;7;6" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg> **Detects AI signals** — chatbots, AI assistants, generated content, recommendation systems, recruiting AI, and vendor scripts.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
  <circle cx="10" cy="10" r="6" fill="#6b9dff" opacity="0.8">
    <animate attributeName="r" values="6;7;6" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg> **Classifies risk tiers** — uses Groq LLM with rule-based fallbacks to map systems to EU AI Act risk levels.

</td>
<td width="50%" valign="top">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
  <circle cx="10" cy="10" r="6" fill="#6b9dff" opacity="0.8">
    <animate attributeName="r" values="6;7;6" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg> **Maps compliance gaps** — identifies obligations like Article 50 transparency and high-risk governance duties.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
  <circle cx="10" cy="10" r="6" fill="#ff6b9d" opacity="0.8">
    <animate attributeName="r" values="6;7;6" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg> **Real-time progress** — scan updates stream through WebSockets to the dashboard.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
  <circle cx="10" cy="10" r="6" fill="#c44dff" opacity="0.8">
    <animate attributeName="r" values="6;7;6" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg> **Rich output** — evidence cards, compliance gaps, score summaries, and HTML reports.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">
  <circle cx="10" cy="10" r="6" fill="#6b9dff" opacity="0.8">
    <animate attributeName="r" values="6;7;6" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg> **Plan enforcement** — backend-enforced limits with Razorpay checkout gating.

</td>
</tr>
</table>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 20" width="900" height="20">
  <defs>
    <linearGradient id="div3" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="10" x2="900" y2="10" stroke="url(#div3)" stroke-width="1.5" stroke-dasharray="6,6">
    <animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="10" r="3" fill="#c44dff">
    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 50" width="400" height="50">
  <defs>
    <linearGradient id="archGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="50%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
    </linearGradient>
  </defs>
  <text x="200" y="35" font-family="'Segoe UI', Arial, sans-serif" font-size="32" font-weight="800" fill="url(#archGrad)" text-anchor="middle" letter-spacing="2">🏗️ Architecture</text>
  <line x1="100" y1="45" x2="300" y2="45" stroke="url(#archGrad)" stroke-width="1" opacity="0.4"/>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340" width="800" height="340">
  <defs>
    <linearGradient id="boxFront" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#ff6b9d" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="boxApi" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c44dff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#c44dff" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="boxData" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6b9dff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="boxWorker" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#c44dff" stop-opacity="0.12"/>
    </linearGradient>
    <linearGradient id="arrowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="100%" stop-color="#c44dff"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="2s" repeatCount="indefinite"/>
    </linearGradient>
    <linearGradient id="arrowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="2s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>

  <rect x="300" y="10" width="200" height="44" rx="10" fill="url(#boxFront)" stroke="#ff6b9d" stroke-width="1.5">
    <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
  </rect>
  <text x="400" y="37" font-family="'Segoe UI', Arial, sans-serif" font-size="13" fill="#ff6b9d" text-anchor="middle" font-weight="bold">🎨 Next.js Frontend</text>

  <polyline points="400,54 400,68" stroke="#c44dff" stroke-width="1.5" stroke-dasharray="4,3">
    <animate attributeName="stroke-dashoffset" values="0;-14" dur="1s" repeatCount="indefinite"/>
  </polyline>
  <polygon points="395,65 400,75 405,65" fill="#c44dff"/>
  <circle cx="420" cy="61" r="1.5" fill="#c44dff" opacity="0.6">
    <animate attributeName="cy" values="61;68;61" dur="1s" repeatCount="indefinite"/>
  </circle>

  <rect x="300" y="76" width="200" height="44" rx="10" fill="url(#boxApi)" stroke="#c44dff" stroke-width="1.5">
    <animate attributeName="stroke-opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
  </rect>
  <text x="400" y="103" font-family="'Segoe UI', Arial, sans-serif" font-size="13" fill="#c44dff" text-anchor="middle" font-weight="bold">⚡ FastAPI Backend</text>

  <polyline points="400,120 400,132 200,148" stroke="#ff6b9d" stroke-width="1.5" stroke-dasharray="4,3">
    <animate attributeName="stroke-dashoffset" values="0;-14" dur="1.2s" repeatCount="indefinite"/>
  </polyline>
  <polygon points="195,145 200,155 205,145" fill="#ff6b9d"/>

  <polyline points="400,120 400,132 600,148" stroke="#6b9dff" stroke-width="1.5" stroke-dasharray="4,3">
    <animate attributeName="stroke-dashoffset" values="0;-14" dur="1.2s" repeatCount="indefinite"/>
  </polyline>
  <polygon points="595,145 600,155 605,145" fill="#6b9dff"/>

  <rect x="100" y="156" width="200" height="44" rx="10" fill="url(#boxData)" stroke="#6b9dff" stroke-width="1.5">
    <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite"/>
  </rect>
  <text x="200" y="183" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#6b9dff" text-anchor="middle" font-weight="bold">🗄️ PostgreSQL + Redis</text>

  <rect x="500" y="156" width="200" height="44" rx="10" fill="url(#boxWorker)" stroke="#c44dff" stroke-width="1.5">
    <animate attributeName="stroke-opacity" values="0.8;0.3;0.8" dur="2.5s" repeatCount="indefinite"/>
  </rect>
  <text x="600" y="183" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#c44dff" text-anchor="middle" font-weight="bold">⚙️ Celery Workers</text>

  <rect x="470" y="220" width="260" height="100" rx="10" fill="#1a1a2e" stroke="#6b9dff" stroke-width="1" opacity="0.5"/>

  <text x="600" y="242" font-family="Arial, sans-serif" font-size="11" fill="#a078c0" text-anchor="middle">Worker Pipeline:</text>

  <rect x="490" y="252" width="50" height="24" rx="6" fill="#ff6b9d" opacity="0.15" stroke="#ff6b9d" stroke-width="1">
    <animate attributeName="opacity" values="0.15;0.3;0.15" dur="1.5s" repeatCount="indefinite"/>
  </rect>
  <text x="515" y="268" font-family="Arial, sans-serif" font-size="9" fill="#ff6b9d" text-anchor="middle">🕸️ Crawl</text>

  <polyline points="540,264 550,264 555,264" stroke="#6b9dff" stroke-width="1" stroke-dasharray="2,2">
    <animate attributeName="stroke-dashoffset" values="0;-8" dur="0.5s" repeatCount="indefinite"/>
  </polyline>

  <rect x="555" y="252" width="50" height="24" rx="6" fill="#c44dff" opacity="0.15" stroke="#c44dff" stroke-width="1">
    <animate attributeName="opacity" values="0.3;0.15;0.3" dur="1.5s" repeatCount="indefinite"/>
  </rect>
  <text x="580" y="268" font-family="Arial, sans-serif" font-size="9" fill="#c44dff" text-anchor="middle">🔍 Detect</text>

  <polyline points="605,264 615,264 620,264" stroke="#6b9dff" stroke-width="1" stroke-dasharray="2,2">
    <animate attributeName="stroke-dashoffset" values="0;-8" dur="0.5s" repeatCount="indefinite"/>
  </polyline>

  <rect x="620" y="252" width="45" height="24" rx="6" fill="#6b9dff" opacity="0.15" stroke="#6b9dff" stroke-width="1">
    <animate attributeName="opacity" values="0.15;0.3;0.15" dur="1.5s" repeatCount="indefinite"/>
  </rect>
  <text x="642" y="268" font-family="Arial, sans-serif" font-size="9" fill="#6b9dff" text-anchor="middle">🤖 Groq</text>

  <polyline points="665,264 675,264 680,264" stroke="#6b9dff" stroke-width="1" stroke-dasharray="2,2">
    <animate attributeName="stroke-dashoffset" values="0;-8" dur="0.5s" repeatCount="indefinite"/>
  </polyline>

  <rect x="555" y="282" width="50" height="24" rx="6" fill="#6b9dff" opacity="0.15" stroke="#6b9dff" stroke-width="1">
    <animate attributeName="opacity" values="0.3;0.15;0.3" dur="1.5s" repeatCount="indefinite"/>
  </rect>
  <text x="580" y="298" font-family="Arial, sans-serif" font-size="9" fill="#6b9dff" text-anchor="middle">📋 Gaps</text>

  <polyline points="605,294 615,294 620,294" stroke="#6b9dff" stroke-width="1" stroke-dasharray="2,2">
    <animate attributeName="stroke-dashoffset" values="0;-8" dur="0.5s" repeatCount="indefinite"/>
  </polyline>

  <rect x="620" y="282" width="60" height="24" rx="6" fill="#ff6b9d" opacity="0.15" stroke="#ff6b9d" stroke-width="1">
    <animate attributeName="opacity" values="0.15;0.3;0.15" dur="1.5s" repeatCount="indefinite"/>
  </rect>
  <text x="650" y="298" font-family="Arial, sans-serif" font-size="9" fill="#ff6b9d" text-anchor="middle">📄 Report</text>

  <circle cx="200" cy="220" r="8" fill="#6b9dff" opacity="0.1" stroke="#6b9dff" stroke-width="1">
    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.1;0.05;0.1" dur="2s" repeatCount="indefinite"/>
  </circle>
  <text x="200" y="232" font-family="Arial, sans-serif" font-size="9" fill="#6b9dff" text-anchor="middle" opacity="0.6">data layer</text>

  <circle cx="600" cy="220" r="8" fill="#c44dff" opacity="0.1" stroke="#c44dff" stroke-width="1">
    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.1;0.05;0.1" dur="2s" repeatCount="indefinite"/>
  </circle>
  <text x="600" y="232" font-family="Arial, sans-serif" font-size="9" fill="#c44dff" text-anchor="middle" opacity="0.6">task layer</text>
</svg>

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

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 20" width="900" height="20">
  <defs>
    <linearGradient id="div4" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="10" x2="900" y2="10" stroke="url(#div4)" stroke-width="1.5" stroke-dasharray="6,6">
    <animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="10" r="3" fill="#c44dff">
    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 50" width="400" height="50">
  <defs>
    <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="50%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
    </linearGradient>
  </defs>
  <text x="200" y="35" font-family="'Segoe UI', Arial, sans-serif" font-size="32" font-weight="800" fill="url(#flowGrad)" text-anchor="middle" letter-spacing="2">📋 Product Flow</text>
  <line x1="100" y1="45" x2="300" y2="45" stroke="url(#flowGrad)" stroke-width="1" opacity="0.4"/>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 120" width="900" height="120">
  <defs>
    <linearGradient id="flowDot" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="33%" stop-color="#ff4d7a"/>
      <stop offset="66%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
    </linearGradient>
    <linearGradient id="progGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0.8"/>
    </linearGradient>
  </defs>

  <g>
    <rect x="20" y="20" width="90" height="36" rx="18" fill="#ff6b9d" opacity="0.12" stroke="#ff6b9d" stroke-width="1.5">
      <animate attributeName="opacity" values="0.12;0.25;0.12" dur="2s" repeatCount="indefinite"/>
    </rect>
    <text x="65" y="43" font-family="Arial, sans-serif" font-size="11" fill="#ff6b9d" text-anchor="middle" font-weight="bold">🔐 Sign In</text>
  </g>
  <g>
    <line x1="110" y1="38" x2="138" y2="38" stroke="#c44dff" stroke-width="1.5" stroke-dasharray="4,3">
      <animate attributeName="stroke-dashoffset" values="0;-14" dur="0.8s" repeatCount="indefinite"/>
    </line>
    <polygon points="135,34 145,38 135,42" fill="#c44dff"/>
  </g>

  <g>
    <rect x="145" y="20" width="90" height="36" rx="18" fill="#c44dff" opacity="0.12" stroke="#c44dff" stroke-width="1.5"/>
    <text x="190" y="43" font-family="Arial, sans-serif" font-size="11" fill="#c44dff" text-anchor="middle" font-weight="bold">🌐 Add Site</text>
  </g>
  <g>
    <line x1="235" y1="38" x2="263" y2="38" stroke="#c44dff" stroke-width="1.5" stroke-dasharray="4,3">
      <animate attributeName="stroke-dashoffset" values="0;-14" dur="0.8s" repeatCount="indefinite"/>
    </line>
    <polygon points="260,34 270,38 260,42" fill="#c44dff"/>
  </g>

  <g>
    <rect x="270" y="20" width="90" height="36" rx="18" fill="#c44dff" opacity="0.12" stroke="#c44dff" stroke-width="1.5">
      <animate attributeName="opacity" values="0.12;0.25;0.12" dur="2.5s" repeatCount="indefinite"/>
    </rect>
    <text x="315" y="43" font-family="Arial, sans-serif" font-size="11" fill="#c44dff" text-anchor="middle" font-weight="bold">📋 Create Scan</text>
  </g>
  <g>
    <line x1="360" y1="38" x2="388" y2="38" stroke="#c44dff" stroke-width="1.5" stroke-dasharray="4,3">
      <animate attributeName="stroke-dashoffset" values="0;-14" dur="0.8s" repeatCount="indefinite"/>
    </line>
    <polygon points="385,34 395,38 385,42" fill="#c44dff"/>
  </g>

  <g>
    <rect x="395" y="20" width="90" height="36" rx="18" fill="#c44dff" opacity="0.12" stroke="#c44dff" stroke-width="1.5"/>
    <text x="440" y="43" font-family="Arial, sans-serif" font-size="11" fill="#c44dff" text-anchor="middle" font-weight="bold">🕸️ Crawl</text>
  </g>
  <g>
    <line x1="485" y1="38" x2="513" y2="38" stroke="#c44dff" stroke-width="1.5" stroke-dasharray="4,3">
      <animate attributeName="stroke-dashoffset" values="0;-14" dur="0.8s" repeatCount="indefinite"/>
    </line>
    <polygon points="510,34 520,38 510,42" fill="#6b9dff"/>
  </g>

  <g>
    <rect x="520" y="20" width="90" height="36" rx="18" fill="#6b9dff" opacity="0.12" stroke="#6b9dff" stroke-width="1.5">
      <animate attributeName="opacity" values="0.12;0.25;0.12" dur="3s" repeatCount="indefinite"/>
    </rect>
    <text x="565" y="43" font-family="Arial, sans-serif" font-size="11" fill="#6b9dff" text-anchor="middle" font-weight="bold">🔍 Detect</text>
  </g>
  <g>
    <line x1="610" y1="38" x2="638" y2="38" stroke="#6b9dff" stroke-width="1.5" stroke-dasharray="4,3">
      <animate attributeName="stroke-dashoffset" values="0;-14" dur="0.8s" repeatCount="indefinite"/>
    </line>
    <polygon points="635,34 645,38 635,42" fill="#6b9dff"/>
  </g>

  <g>
    <rect x="645" y="20" width="90" height="36" rx="18" fill="#6b9dff" opacity="0.12" stroke="#6b9dff" stroke-width="1.5"/>
    <text x="690" y="43" font-family="Arial, sans-serif" font-size="11" fill="#6b9dff" text-anchor="middle" font-weight="bold">🤖 Classify</text>
  </g>
  <g>
    <line x1="735" y1="38" x2="763" y2="38" stroke="#6b9dff" stroke-width="1.5" stroke-dasharray="4,3">
      <animate attributeName="stroke-dashoffset" values="0;-14" dur="0.8s" repeatCount="indefinite"/>
    </line>
    <polygon points="760,34 770,38 760,42" fill="#ff6b9d"/>
  </g>

  <g>
    <rect x="770" y="20" width="110" height="36" rx="18" fill="#ff6b9d" opacity="0.12" stroke="#ff6b9d" stroke-width="1.5">
      <animate attributeName="opacity" values="0.12;0.3;0.12" dur="1.5s" repeatCount="indefinite"/>
    </rect>
    <text x="825" y="43" font-family="Arial, sans-serif" font-size="11" fill="#ff6b9d" text-anchor="middle" font-weight="bold">📄 Report</text>
  </g>

  <rect x="30" y="80" width="840" height="4" rx="2" fill="#1a1a2e" opacity="0.5"/>
  <rect x="30" y="80" width="840" height="4" rx="2" fill="url(#progGrad)" opacity="0.7">
    <animate attributeName="width" values="0;840" dur="5s" repeatCount="indefinite"/>
  </rect>
  <circle cx="30" cy="82" r="5" fill="#ff6b9d">
    <animate attributeName="cx" values="30;870;30" dur="5s" repeatCount="indefinite"/>
    <animate attributeName="r" values="5;3;5" dur="5s" repeatCount="indefinite"/>
  </circle>

  <text x="450" y="110" font-family="Arial, sans-serif" font-size="10" fill="#6b5b7a" text-anchor="middle">end-to-end scan pipeline</text>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 20" width="900" height="20">
  <defs>
    <linearGradient id="div5" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="10" x2="900" y2="10" stroke="url(#div5)" stroke-width="1.5" stroke-dasharray="6,6">
    <animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="10" r="3" fill="#c44dff">
    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 50" width="400" height="50">
  <defs>
    <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="50%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
    </linearGradient>
  </defs>
  <text x="200" y="35" font-family="'Segoe UI', Arial, sans-serif" font-size="32" font-weight="800" fill="url(#riskGrad)" text-anchor="middle" letter-spacing="2">⚠️ Risk Tiers</text>
  <line x1="100" y1="45" x2="300" y2="45" stroke="url(#riskGrad)" stroke-width="1" opacity="0.4"/>
</svg>

</div>

<br>

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

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 20" width="900" height="20">
  <defs>
    <linearGradient id="div6" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="10" x2="900" y2="10" stroke="url(#div6)" stroke-width="1.5" stroke-dasharray="6,6">
    <animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="10" r="3" fill="#c44dff">
    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 50" width="400" height="50">
  <defs>
    <linearGradient id="repoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="50%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
    </linearGradient>
  </defs>
  <text x="200" y="35" font-family="'Segoe UI', Arial, sans-serif" font-size="32" font-weight="800" fill="url(#repoGrad)" text-anchor="middle" letter-spacing="2">📁 Repository Structure</text>
  <line x1="100" y1="45" x2="300" y2="45" stroke="url(#repoGrad)" stroke-width="1" opacity="0.4"/>
</svg>

</div>

<br>

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

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 20" width="900" height="20">
  <defs>
    <linearGradient id="div7" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="10" x2="900" y2="10" stroke="url(#div7)" stroke-width="1.5" stroke-dasharray="6,6">
    <animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="10" r="3" fill="#c44dff">
    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>

</div>

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

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 20" width="900" height="20">
  <defs>
    <linearGradient id="div8" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="10" x2="900" y2="10" stroke="url(#div8)" stroke-width="1.5" stroke-dasharray="6,6">
    <animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="10" r="3" fill="#c44dff">
    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>

</div>

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

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 20" width="900" height="20">
  <defs>
    <linearGradient id="div9" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="10" x2="900" y2="10" stroke="url(#div9)" stroke-width="1.5" stroke-dasharray="6,6">
    <animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="10" r="3" fill="#c44dff">
    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 50" width="400" height="50">
  <defs>
    <linearGradient id="portGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="50%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
    </linearGradient>
  </defs>
  <text x="200" y="35" font-family="'Segoe UI', Arial, sans-serif" font-size="32" font-weight="800" fill="url(#portGrad)" text-anchor="middle" letter-spacing="2">🌟 Portfolio Summary</text>
  <line x1="100" y1="45" x2="300" y2="45" stroke="url(#portGrad)" stroke-width="1" opacity="0.4"/>
</svg>

</div>

<br>

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

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 20" width="900" height="20">
  <defs>
    <linearGradient id="div10" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="10" x2="900" y2="10" stroke="url(#div10)" stroke-width="1.5" stroke-dasharray="6,6">
    <animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="10" r="3" fill="#c44dff">
    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 50" width="400" height="50">
  <defs>
    <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="50%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
    </linearGradient>
  </defs>
  <text x="200" y="35" font-family="'Segoe UI', Arial, sans-serif" font-size="32" font-weight="800" fill="url(#roadGrad)" text-anchor="middle" letter-spacing="2">🗺️ Roadmap</text>
  <line x1="100" y1="45" x2="300" y2="45" stroke="url(#roadGrad)" stroke-width="1" opacity="0.4"/>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220" width="800" height="220">
  <defs>
    <linearGradient id="roadPath" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0.3"/>
    </linearGradient>
  </defs>

  <line x1="300" y1="15" x2="300" y2="205" stroke="url(#roadPath)" stroke-width="3" stroke-dasharray="8,6" opacity="0.6">
    <animate attributeName="stroke-dashoffset" values="0;-28" dur="2s" repeatCount="indefinite"/>
  </line>

  <circle cx="300" cy="25" r="8" fill="#ff6b9d" opacity="0.8">
    <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite"/>
  </circle>
  <text x="320" y="29" font-family="Arial, sans-serif" font-size="12" fill="#d0b0e0">🔬 Run final authenticated browser smoke test</text>

  <circle cx="300" cy="55" r="8" fill="#c44dff" opacity="0.8">
    <animate attributeName="r" values="8;10;8" dur="2.2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.2s" repeatCount="indefinite"/>
  </circle>
  <text x="320" y="59" font-family="Arial, sans-serif" font-size="12" fill="#d0b0e0">🌐 Deploy demo target + scan public URL</text>

  <circle cx="300" cy="85" r="8" fill="#6b9dff" opacity="0.8">
    <animate attributeName="r" values="8;10;8" dur="2.4s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.4s" repeatCount="indefinite"/>
  </circle>
  <text x="320" y="89" font-family="Arial, sans-serif" font-size="12" fill="#d0b0e0">📸 Capture final product screenshots</text>

  <circle cx="300" cy="115" r="8" fill="#ff6b9d" opacity="0.8">
    <animate attributeName="r" values="8;10;8" dur="2.6s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.6s" repeatCount="indefinite"/>
  </circle>
  <text x="320" y="119" font-family="Arial, sans-serif" font-size="12" fill="#d0b0e0">📈 Expand detector signatures with FP/FN rates</text>

  <circle cx="300" cy="145" r="8" fill="#c44dff" opacity="0.8">
    <animate attributeName="r" values="8;10;8" dur="2.8s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.8s" repeatCount="indefinite"/>
  </circle>
  <text x="320" y="149" font-family="Arial, sans-serif" font-size="12" fill="#d0b0e0">💳 Complete Razorpay Subscriptions</text>

  <circle cx="300" cy="175" r="8" fill="#6b9dff" opacity="0.8">
    <animate attributeName="r" values="8;10;8" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite"/>
  </circle>
  <text x="320" y="179" font-family="Arial, sans-serif" font-size="12" fill="#d0b0e0">📎 Improve public sample reports + sharing</text>

  <circle cx="300" cy="205" r="8" fill="#ff6b9d" opacity="0.8">
    <animate attributeName="r" values="8;10;8" dur="3.2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3.2s" repeatCount="indefinite"/>
  </circle>
  <text x="320" y="209" font-family="Arial, sans-serif" font-size="12" fill="#d0b0e0">📊 Add production observability</text>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 20" width="900" height="20">
  <defs>
    <linearGradient id="div11" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="10" x2="900" y2="10" stroke="url(#div11)" stroke-width="1.5" stroke-dasharray="6,6">
    <animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="10" r="3" fill="#c44dff">
    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 120" width="500" height="120">
  <defs>
    <linearGradient id="licGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d"/>
      <stop offset="50%" stop-color="#c44dff"/>
      <stop offset="100%" stop-color="#6b9dff"/>
    </linearGradient>
    <linearGradient id="footGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.5"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.5"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>

  <text x="250" y="35" font-family="'Segoe UI', Arial, sans-serif" font-size="28" font-weight="800" fill="url(#licGrad)" text-anchor="middle" letter-spacing="2">📄 License</text>
  <text x="250" y="65" font-family="'Segoe UI', Arial, sans-serif" font-size="15" fill="#a078c0" text-anchor="middle">MIT — feel free to use, modify, and distribute.</text>

  <line x1="80" y1="85" x2="420" y2="85" stroke="url(#footGrad)" stroke-width="1"/>
  <text x="250" y="110" font-family="'Segoe UI', Arial, sans-serif" font-size="13" fill="#6b5b7a" text-anchor="middle">
    Made with
  </text>
  <text x="307" y="110" font-family="'Segoe UI', Arial, sans-serif" font-size="13" fill="#ff6b9d" text-anchor="middle">
    <animate attributeName="fill" values="#ff6b9d;#c44dff;#6b9dff;#ff6b9d" dur="2s" repeatCount="indefinite"/>
    ❤️
  </text>
  <text x="330" y="110" font-family="'Segoe UI', Arial, sans-serif" font-size="13" fill="#6b5b7a" text-anchor="middle">
    for AI Governance
  </text>
</svg>

</div>

<br>

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 20" width="900" height="20">
  <defs>
    <linearGradient id="div12" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6b9d" stop-opacity="0"/>
      <stop offset="20%" stop-color="#ff6b9d" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#c44dff" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#6b9dff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#6b9dff" stop-opacity="0"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="10" x2="900" y2="10" stroke="url(#div12)" stroke-width="1.5" stroke-dasharray="6,6">
    <animate attributeName="stroke-dashoffset" values="0;-36" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="450" cy="10" r="3" fill="#c44dff">
    <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
</svg>

</div>

# ReguScan Design Direction

## Product Vision

ReguScan should feel like a premium AI governance command center: professional enough for compliance teams, simple enough for founders and business owners, and visually memorable enough to stand out in a portfolio or investor demo.

The experience should communicate one core idea immediately:

> ReguScan turns website AI detection into explainable EU AI Act compliance guidance.

The design should not feel like a generic SaaS template. It should feel precise, evidence-based, calm, and futuristic without making the workflow harder to understand.

## Design Goals

- Make the product feel modern, trustworthy, and polished.
- Use motion to create confidence and attention, not distraction.
- Make the homepage SEO-friendly and conversion-focused.
- Make dashboard workflows fast and easy to understand.
- Make scan results feel evidence-based, not random or AI-generated.
- Make every implemented feature visible and easy to reach.
- Leave clear UI space for future features like billing, hosted reports, storage, monitoring, and enterprise controls.

## Visual Direction

### Overall Feel

- Professional compliance-tech SaaS
- Mesmerizing but controlled
- Dark premium interface with clear contrast
- Soft glass surfaces, thin borders, and subtle depth
- Animated intelligence layer in the background
- Clear hierarchy: headline, action, evidence, result

### Mood Keywords

- Trustworthy
- Futuristic
- Calm
- Sharp
- Evidence-based
- Premium
- Explainable
- Operational

### Avoid

- Random decorative blobs
- Overly playful animations
- Legal overclaiming
- Too much neon
- Heavy 3D that slows the page
- Generic "AI magic" language
- Hiding actual product value behind marketing copy

## Homepage Concept

### First View

The homepage should open with a cinematic background video or generated loop showing:

- A website being scanned
- AI signals lighting up across page sections
- Risk layers forming over detected AI features
- Compliance gaps being mapped to EU AI Act articles
- A final report card forming from the evidence

The video should run silently in the background behind the hero text. It should be dark, subtle, and optimized for fast loading.

Hero headline:

```text
AI compliance scanner for EU AI Act readiness
```

Supporting copy:

```text
ReguScan scans public websites, detects AI features, classifies EU AI Act risk, and generates evidence-based compliance guidance for SaaS teams, startups, agencies, and businesses using AI.
```

Primary CTA:

```text
Scan your website
```

Secondary CTA:

```text
View sample report
```

Trust disclaimer:

```text
Guidance only. Not legal advice.
```

### Background Video Requirements

- Format: MP4/WebM
- Length: 8-15 seconds loop
- Muted, autoplay, plays inline
- Low contrast behind text
- Overlay gradient for readability
- Provide static fallback image for reduced motion and slow networks
- Never block page render
- Respect `prefers-reduced-motion`

Suggested implementation:

```tsx
<video
  autoPlay
  muted
  loop
  playsInline
  poster="/hero-reguscan-poster.jpg"
  className="absolute inset-0 h-full w-full object-cover"
>
  <source src="/hero-reguscan.webm" type="video/webm" />
  <source src="/hero-reguscan.mp4" type="video/mp4" />
</video>
```

## Animated Background System

The app should use a reusable animated background layer that can be used on:

- Landing page
- Authenticated dashboard shell
- Scan progress page
- Report preview page

### Animation Ideas

1. Signal Grid

   A subtle grid of points connected by animated lines. AI signals pulse when the scan concept appears.

2. Compliance Radar

   Slow circular scan rings move across the background, suggesting website analysis.

3. Evidence Stream

   Small floating labels such as `DOM`, `script`, `page text`, `LLM`, `Art. 50`, `gap`, and `confidence` drift in and out.

4. Risk Heat Layer

   Low-opacity amber/red/green highlights move behind the report mockup to suggest classification.

5. Scan Progress Particles

   On active scan pages, particles move through pipeline stages:

   ```text
   Crawl -> Detect -> Classify -> Analyze -> Report
   ```

### Performance Rules

- Use CSS animations first.
- Use Canvas only if needed.
- Avoid heavy Three.js unless a real 3D scene is required.
- Target 60 FPS on desktop, acceptable battery use on laptop.
- Disable or simplify animations on mobile.
- Respect reduced motion.

## SEO Strategy

The homepage should target clear commercial and informational keywords without sounding spammy.

### Primary Keywords

- AI compliance scanner
- EU AI Act compliance
- AI risk assessment
- website AI detection
- compliance report generator
- AI governance tool
- SaaS compliance

### SEO Page Sections

1. Hero

   Clearly state what ReguScan does.

2. What ReguScan Scans

   Explain detection surfaces:

   - Chatbots
   - AI assistants
   - AI forms
   - Recommendation engines
   - Recruitment workflows
   - Public website AI disclosures
   - Scripts and DOM evidence

3. Why EU AI Act Compliance Matters

   Explain obligations without overclaiming legal certainty.

4. How It Works

   ```text
   Crawl -> Detect -> Classify -> Analyze -> Report
   ```

5. What You Get

   - Compliance score
   - Detected AI systems
   - Page-level evidence
   - Related EU AI Act articles
   - Compliance gaps
   - Recommended fixes
   - Report output

6. Who It Is For

   - SaaS companies
   - Startups
   - Agencies
   - AI product teams
   - Compliance consultants
   - Businesses using AI features

7. Disclaimer

   ```text
   ReguScan provides technical compliance guidance and evidence collection. It is not legal advice.
   ```

## Application IA

The product should support both implemented and planned functionality without redesigning later.

### Public Pages

- `/`
  - SEO landing page
  - Intro video background
  - Product explanation
  - Sample report CTA

- `/sample-report`
  - Public demo report
  - Shows evidence-based output without login

- `/security`
  - Security posture and data handling

- `/pricing`
  - Future Razorpay integration

- `/docs`
  - Product documentation and setup guides

### Authenticated Pages

- `/dashboard`
  - Overview of websites, score, risk, open gaps

- `/dashboard/websites`
  - Add/manage websites

- `/dashboard/websites/[websiteId]`
  - Website profile, scan history, AI systems

- `/dashboard/scans/[scanId]`
  - Evidence-rich scan result

- `/dashboard/reports`
  - Completed reports and downloads

- `/dashboard/settings`
  - Account, billing, usage, integrations

### Future Pages

- `/dashboard/gaps`
  - Global gap tracker across websites

- `/dashboard/ai-systems`
  - AI system inventory

- `/dashboard/monitoring`
  - Scheduled rescans and alerts

- `/dashboard/integrations`
  - Clerk, Resend, Pinecone, R2, Razorpay, Sentry status

- `/dashboard/team`
  - Team members and roles

## Current Feature Integration

### Already Implemented

These should be visible and easy to use:

- Clerk sign-up and login
- User provisioning fallback
- Website creation
- Authenticated dashboard
- Website scan trigger
- Celery scan workflow
- Website crawler
- AI detector
- AI classifier
- Gap analyzer
- Compliance score
- Report generation
- Resend notification task
- Flower monitoring
- Evidence-rich scan result UI

### Partially Implemented or Optional

These need UI placeholders or graceful disabled states:

- Pinecone regulation index
- Cloudflare R2 hosted reports
- Razorpay billing
- Sentry monitoring
- Scheduled monitoring
- Team management
- Public sample reports

### UX Rule

If a feature is not fully available, the UI should say:

```text
Coming soon
```

or

```text
Not required for local MVP
```

Do not show broken buttons or dead routes.

## Dashboard Design

The dashboard should feel like a working product, not a marketing page.

### Top-Level Dashboard

Show:

- Compliance score average
- Websites monitored
- Critical gaps
- High-risk systems
- Latest scan status
- Quick action: Add website
- Quick action: Run scan

### Website Detail

Show:

- Website identity
- Last scan summary
- Detected AI systems
- Risk tier
- Scan history
- Open gaps
- Report link

### Scan Result Page

This is the most important MVP screen.

It must show:

- Scan status
- Pipeline progress
- Crawl metrics
- AI systems found
- Page URL for each AI system
- Detection evidence
- Detection source
- Risk level
- Confidence score
- Classification reasoning
- Related EU AI Act articles
- Compliance gaps
- Why each gap matters
- Recommended fix

The UI should make the evidence feel auditable:

```text
Found on: /pricing
Signal: intercomSettings
Source: DOM/script pattern
Risk: Limited
Article: Art. 50
Confidence: 80%
```

## Report Design

Reports should be useful for a founder, manager, or compliance consultant.

Sections:

1. Executive summary
2. Compliance score
3. Detected AI systems
4. Risk classification
5. Evidence table
6. Compliance gaps
7. Recommended fixes
8. Legal disclaimer
9. Scan metadata

Reports should avoid vague statements like:

```text
AI risk detected.
```

Prefer:

```text
ReguScan detected an Intercom chatbot on the homepage through a DOM/widget signal. Chatbots may require transparency disclosure under EU AI Act Article 50.
```

## Motion Design

### Landing Page

- Slow moving background video
- Fade-in hero text
- CTA hover glow
- Report mockup subtle parallax
- Feature cards reveal on scroll

### Dashboard

- No heavy animation
- Smooth hover states
- Scan progress animation
- Subtle card transitions
- Loading skeletons

### Scan Progress

Use the pipeline as the main animation:

```text
Crawling -> Detecting -> Classifying -> Analyzing -> Reporting
```

Each stage should light up as the backend updates progress.

## Accessibility

- Maintain readable contrast.
- All important text must be real HTML text, not only inside video/images.
- Add alt text for screenshots and illustrations.
- Support keyboard navigation.
- Respect reduced motion.
- Do not rely on color alone for risk severity.

## Technical Implementation Plan

### Phase 1: Landing Upgrade

- Add video background component.
- Add static poster fallback.
- Improve SEO metadata.
- Add sections for what it scans, how it works, and what you get.
- Add sample report CTA.

### Phase 2: Animated Background Component

- Build reusable `AnimatedComplianceBackground`.
- Use CSS and lightweight SVG/canvas effects.
- Add reduced-motion fallback.

### Phase 3: Dashboard Polish

- Improve page headers.
- Add loading skeletons.
- Improve empty states.
- Add clearer action buttons.
- Add global gap summary.

### Phase 4: Report Experience

- Create public sample report.
- Improve generated HTML report design.
- Add evidence table.
- Add share/download states.

### Phase 5: Future Feature Slots

- Add disabled integration cards:
  - Pinecone
  - Cloudflare R2
  - Razorpay
  - Sentry
- Add copy explaining which are optional for MVP.

## Content Principles

Use plain language.

Avoid:

```text
Our AI magically guarantees compliance.
```

Use:

```text
ReguScan helps collect technical evidence and identify likely EU AI Act compliance gaps for review.
```

Every risk claim should answer:

- Where was it found?
- What signal triggered it?
- Why was it classified this way?
- Which obligation may apply?
- What should the user do next?

## Portfolio Story

The final portfolio/demo story should be:

1. A founder opens ReguScan.
2. The animated hero shows the product scanning a website.
3. The founder signs up.
4. They add a website.
5. ReguScan crawls and detects AI features.
6. The scan result explains exactly where each risk came from.
7. The report shows practical fixes and EU AI Act article mapping.
8. The founder has a clear compliance action plan.

## Screenshot Targets

Take screenshots of:

- Animated homepage hero
- SEO section explaining what ReguScan scans
- Dashboard overview
- Add website flow
- Scan progress pipeline
- Evidence-rich scan result
- Compliance gap card with recommended fix
- Report page
- Generated compliance report
- Flower worker dashboard

## Final Design Standard

ReguScan should feel like a tool a serious startup could use before talking to a lawyer:

- beautiful enough to impress
- simple enough to understand
- evidence-based enough to trust
- structured enough to extend
- honest enough not to overclaim

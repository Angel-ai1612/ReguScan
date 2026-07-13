# ReguScan Cinematic UI Redesign Report

## Design concept

ReguScan now presents itself as an evidence-first AI compliance command center rather than a generic SaaS template. The visual system uses black, graphite, deep navy, muted silver, cold cyan, restrained amber/rose risk states, editorial type scale, technical grids, browser evidence frames, and report fragments. Motion explains the product journey: crawl a public website, detect AI signals, classify risk, expose compliance gaps, and assemble a review-ready report.

The signed-in product uses the same visual language at a calmer intensity, with real data and scan quality ahead of decoration.

## Pages redesigned

- Landing page, including all 17 requested story beats.
- Pricing page with an editorial plan matrix and implementation-status language.
- Sample report page as an evidence dossier rather than a marketing mockup.
- Dashboard shell and navigation/sidebar.
- Dashboard home.
- Websites list and add/remove/scan states.
- Website detail and scan history.
- Running and completed scan workspace.
- Reports library and filters.
- Settings, plan, usage, and billing states.

No backend, database, authentication, scanner, security, or payment logic was intentionally changed.

## Intro sequence

- A 2.55-second first-visit sequence shows a scanning line, DOM signal, EU AI Act reference, disclosure-gap marker, ReguScan wordmark, and linked evidence states.
- It exits through a blur/scale transition into the hero.
- A visible `Skip intro` control is provided.
- `prefers-reduced-motion` bypasses the sequence.
- `localStorage` key `reguscan:intro:v3` prevents unnecessary replay for returning visitors.
- Body scroll is restored on completion, skip, or unmount.

## Hero design

- SEO H1: **AI Compliance Scanner for EU AI Act Readiness**.
- Primary CTA: **Scan Your Website**.
- Secondary CTA: **See a Real Report**.
- The centerpiece is a realistic browser scan frame with URL, moving scan beam, detected AI interaction, source evidence, Article 50 mapping, confidence, readiness score, and report output.
- The visual flows directly into the governance statement and the six-stage scan story instead of ending as an isolated dashboard mockup.

## Video treatment

- The live-demo section is video-ready but does not reference a missing media file.
- Its current fallback is an animated scan sequence over the existing ReguScan command-center poster.
- Supplying a verified `videoSrc` switches the modal to a muted, looping, `playsInline` video with native controls and `preload="metadata"`.
- Video failure falls back safely to the animated sequence.
- The Radix dialog provides focus containment, an explicit close control, overlay close behavior, scroll containment, and Escape-to-close.

## Image asset used

- `frontend/public/hero-reguscan-command-center.png` is the only existing public image and is used as the browser/command-center visual and video poster fallback.
- No third-party stock imagery, fake customer logos, fabricated testimonials, or unlicensed media were added.

## Motion and transitions

- Intro scan-line reveal, signal fragments, wordmark resolve, and blur-to-hero exit.
- Sticky desktop scan story with six scroll-driven stages; mobile uses a linear, non-pinned version.
- Animated browser scan beam, evidence beacons, risk pulses, radar sweeps, regulation text, confidence/progress states, and report-fragment assembly.
- Blur-to-focus section reveals, directional stage changes, black-to-graphite cuts, modal crossfade, and responsive CTA/navigation micro-interactions.
- Internal product motion is limited to status, progress, loading, navigation, and hover feedback.
- Reduced-motion paths remove or bypass the major cinematic effects.

## Animation stack and dependencies

- Added one dependency only: `motion@^12.42.2`, imported from `motion/react`.
- Existing Radix Dialog, Next Image, Tailwind CSS, and Lucide icons were reused.
- GSAP, ScrollTrigger, Lenis, WebGL, and additional animation engines were not added.

## Files changed

### New landing components

- `frontend/components/landing/BrowserScanFrame.tsx`
- `frontend/components/landing/CinematicPrimitives.tsx`
- `frontend/components/landing/IntroSequence.tsx`
- `frontend/components/landing/LandingNav.tsx`
- `frontend/components/landing/ScanStory.tsx`

### Public experience

- `frontend/app/page.tsx`
- `frontend/app/pricing/page.tsx`
- `frontend/app/sample-report/page.tsx`
- `frontend/app/globals.css`
- `frontend/app/layout.tsx`
- `frontend/components/landing/DemoVideoModal.tsx`

### Signed-in product

- `frontend/app/(dashboard)/layout.tsx`
- `frontend/app/(dashboard)/dashboard/page.tsx`
- `frontend/app/(dashboard)/dashboard/websites/page.tsx`
- `frontend/app/(dashboard)/dashboard/websites/[websiteId]/page.tsx`
- `frontend/app/(dashboard)/dashboard/scans/[scanId]/page.tsx`
- `frontend/app/(dashboard)/dashboard/reports/page.tsx`
- `frontend/app/(dashboard)/dashboard/settings/page.tsx`
- `frontend/components/dashboard/Sidebar.tsx`
- `frontend/components/dashboard/TokenInjector.tsx`
- `frontend/components/ui/premium.tsx`

### Configuration

- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/tsconfig.json`

## Validation

| Check | Result |
|---|---|
| `npm.cmd run type-check -- --pretty false` from `frontend` | Passed |
| `npm.cmd run build` from `frontend` | Passed with Next.js 16.2.9 |
| `git diff --check` | Passed; Git reported informational LF-to-CRLF warnings only |
| Browser QA: landing, pricing, sample report | Passed on desktop and 390 px mobile layouts |
| Horizontal overflow | None detected on the tested public mobile routes |
| Intro/runtime console | No hydration or redesigned-route runtime errors observed |
| Intro controls | Skip action verified; focus, Escape, repeat-visit, and reduced-motion paths are implemented defensively |
| Demo dialog | Desktop and 390 px mobile open/layout behavior verified; focus, close control, overlay, and Escape behavior verified on desktop |
| Clerk boundary | Protected dashboard still redirects unauthenticated users to Clerk sign-in |
| Container configuration | `docker-compose config --quiet` passed |
| Tailwind opacity audit | Passed; unsupported custom opacity modifiers were converted to bracket syntax |

The requested `docker compose exec -T frontend ...` checks could not run because the Docker daemon/modern `docker compose` command was unavailable in this environment. The equivalent frontend type-check and production build passed locally. Authenticated dashboard API states were verified through source/build checks, but a complete live signed-in data pass still requires a valid Clerk session and running backend.

The build emits the existing Next.js warning that the `middleware` convention is deprecated in favor of `proxy`; it does not fail the build and was left unchanged because auth changes were out of scope.

## Performance notes

- The scroll story and demo modal are dynamically imported below the initial hero.
- The mobile scan story removes the 430vh pinned desktop sequence.
- Motion primarily uses transform, opacity, and filter; no WebGL effects or smooth-scroll hijacking were added.
- The 1.68 MB PNG is the largest current visual cost. It should be replaced or supplemented with compressed AVIF/WebP posters sized for desktop and mobile.
- `motion` adds client-side JavaScript, and the long sticky scene should be profiled on lower-end Android hardware before launch.
- Real videos should be encoded at an optimized bitrate, loaded below the fold, and paused when offscreen or when the document is hidden.

## Missing media assets

Recommended files from the brief:

- `/public/videos/reguscan-hero.mp4`
- `/public/videos/reguscan-demo.mp4`
- `/public/videos/reguscan-scan-loop.mp4`

Recommended companions:

- Matching `.webm` files.
- `reguscan-hero-poster.webp`, `reguscan-demo-poster.webp`, and `reguscan-scan-loop-poster.webp`.

Target specification: H.264 MP4 plus WebM where practical, 1080p or 1440p, 8-20 seconds, muted, seamless loop, dark composition, no baked-in UI text, no hard cuts, and an optimized poster. None of these missing files is referenced by default, so the current build cannot break because they are absent.

## Mobile behavior

- Navigation collapses to an animated menu with 44 px minimum controls and Escape support.
- The hero frame, evidence views, pricing matrix, report dossier, and modal reflow into single-column layouts.
- The desktop sticky scan story becomes a readable linear six-stage sequence without scroll hijacking.
- Dense report and dashboard content uses responsive stacks and horizontal-safe containers.
- Tested public routes showed no horizontal overflow at 390 px.

## Accessibility

- Reduced-motion support is built into the intro, cinematic primitives, scan story, browser frame, and video behavior.
- The intro can be skipped; repeated visits bypass it.
- The intro focuses the Skip control, traps Tab while visible, supports Escape, and restores the prior focus and body overflow on exit.
- Global visible focus styles and keyboard-reachable controls were added.
- The demo uses a semantic Radix dialog with title, description, focus containment, close control, and Escape behavior.
- Headings, navigation labels, progress labels, status live regions, image alt text, and textual risk/confidence labels are present.
- Important scan quality and risk information is expressed in text, not color or motion alone.
- Internal loading, error, unknown, incomplete, and review-required states are distinct; absent evidence is not presented as a clean result.
- Cancelled scans are terminal and show no-result guidance; missing gap summaries render as not returned rather than confirmed zero.
- Clerk token failures pause authenticated requests and expose an accessible retry state instead of leaving a permanent spinner.

## Screenshots and recordings to capture

1. Desktop landing hero at 1440 px, including the evidence-first browser frame.
2. Three intro frames: scan-line/signals, resolved wordmark, and hero transition.
3. A 15-25 second desktop recording of the six-stage sticky scan story.
4. Evidence, risk spectrum, gap analysis, and assembled report sections.
5. Demo modal open with the animated fallback, then again after the real demo video is supplied.
6. Pricing and sample report at desktop and 390 px mobile widths.
7. Authenticated dashboard home, website detail, running scan, completed scan, incomplete/needs-review scan, reports filters, and settings.
8. Keyboard focus states and a reduced-motion run for accessibility evidence.

## Remaining generic areas

- The live-demo section is still an animated product simulation because no real scan footage exists.
- Reusing one command-center PNG across multiple scenes limits visual variety.
- Pricing necessarily retains a familiar four-tier comparison structure, although its typography and presentation are now editorial.
- Some signed-in data areas still use reusable command cards for readability; real customer data and a live authenticated visual pass are needed to tune density further.
- The dashboard preview on the landing page is illustrative rather than a captured production session.

## Recommended next visual iteration

Produce the three product-specific video loops and a dedicated set of compressed browser, evidence, scan-quality, and report poster frames from the real application. Replace the repeated command-center PNG, connect the demo modal to `reguscan-demo.mp4`, then run an authenticated visual QA pass with realistic completed, incomplete, and failed scans on desktop and a physical mid-range Android device.

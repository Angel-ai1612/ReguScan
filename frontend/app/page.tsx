import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  FileText,
  Globe,
  Radar,
  Shield,
  Zap,
} from "lucide-react";
import AnimatedComplianceBackground from "@/components/AnimatedComplianceBackground";

const scanSurfaces = [
  "Chatbots and AI assistants",
  "AI forms and intake flows",
  "Recommendation engines",
  "Recruitment workflows",
  "Public AI disclosures",
  "Script, DOM, and page-text evidence",
];

const outcomes = [
  "Compliance score",
  "Detected AI systems",
  "Page-level evidence",
  "Related EU AI Act articles",
  "Compliance gaps",
  "Recommended fixes",
  "Report output",
];

const workflow = [
  { label: "Crawl", detail: "Map public pages, scripts, and visible claims." },
  { label: "Detect", detail: "Flag widgets, AI copy, forms, and workflow signals." },
  { label: "Classify", detail: "Assign risk category with reasoning and confidence." },
  { label: "Analyze", detail: "Map gaps to likely EU AI Act obligations." },
  { label: "Report", detail: "Generate a review-ready evidence trail." },
];

const featureCards = [
  {
    icon: Globe,
    title: "Website creation",
    text: "Add public sites, track scan history, and monitor compliance posture from the authenticated dashboard.",
  },
  {
    icon: Radar,
    title: "Crawler and detector",
    text: "The backend crawls pages and records technical signals that make findings auditable.",
  },
  {
    icon: Shield,
    title: "AI risk classifier",
    text: "Detected systems are classified as prohibited, high, limited, or minimal risk with confidence scoring.",
  },
  {
    icon: AlertTriangle,
    title: "Gap analyzer",
    text: "Compliance gaps are mapped to obligations, severity, reasoning, and practical remediation steps.",
  },
  {
    icon: FileText,
    title: "Report generation",
    text: "Completed scans can produce evidence-backed report output for founders, managers, and consultants.",
  },
  {
    icon: Zap,
    title: "Notifications and workers",
    text: "Celery workflow, Resend notification task, and Flower monitoring are represented in the product story.",
  },
];

const futureSlots = [
  "Pinecone regulation index",
  "Cloudflare R2 hosted reports",
  "Stripe billing",
  "Sentry monitoring",
  "Scheduled rescans",
  "Team management",
];

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen overflow-hidden bg-reguscan-deep text-white">
      <section className="relative min-h-[92vh]">
        <AnimatedComplianceBackground intensity="hero" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,18,0.94)_0%,rgba(5,8,18,0.82)_38%,rgba(5,8,18,0.28)_75%,rgba(5,8,18,0.84)_100%)]" />
        <Image
          src="/hero-reguscan-command-center.png"
          alt="Abstract ReguScan command center showing website scanning, risk layers, and a compliance report."
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55 mix-blend-screen"
        />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10">
              <Shield className="h-5 w-5 text-cyan-200" />
            </span>
            <span className="text-lg font-bold tracking-tight">ReguScan</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm text-white/58 md:flex">
            <Link href="/sample-report" className="hover:text-white">Sample report</Link>
            <Link href="/security" className="hover:text-white">Security</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <Link href="/docs" className="hover:text-white">Docs</Link>
          </div>
          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <button className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(103,232,249,0.22)] transition hover:bg-cyan-200">
                Scan your website
              </button>
            </SignUpButton>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:pb-24 lg:pt-24">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-100">
              <AlertTriangle className="h-3.5 w-3.5" />
              Guidance only. Not legal advice.
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
              AI compliance scanner for EU AI Act readiness
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200/72">
              ReguScan scans public websites, detects AI features, classifies EU AI Act risk, and generates evidence-based compliance guidance for SaaS teams, startups, agencies, and businesses using AI.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <SignUpButton mode="modal">
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_38px_rgba(103,232,249,0.26)] transition hover:-translate-y-0.5 hover:bg-cyan-200">
                  Scan your website <ArrowRight className="h-4 w-4" />
                </button>
              </SignUpButton>
              <Link
                href="/sample-report"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.045] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.075]"
              >
                View sample report <FileText className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-xs text-white/54">
              <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">Clerk auth</span>
              <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">Celery scans</span>
              <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">HTML reports</span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="command-card absolute right-0 top-4 w-[520px] p-5">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Live evidence trace</p>
                  <h2 className="mt-2 text-xl font-bold">example.com scan result</h2>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-black text-amber-300">72</p>
                  <p className="text-xs text-white/38">compliance score</p>
                </div>
              </div>
              <div className="mb-5 grid grid-cols-5 gap-2">
                {workflow.map((step, index) => (
                  <div key={step.label} className="rounded-lg border border-cyan-200/10 bg-cyan-200/[0.055] p-2">
                    <span className="text-xs text-cyan-100/60">0{index + 1}</span>
                    <p className="mt-1 text-xs font-semibold">{step.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  ["Found on", "/pricing"],
                  ["Signal", "intercomSettings"],
                  ["Source", "DOM/script pattern"],
                  ["Risk", "Limited"],
                  ["Article", "Art. 50"],
                  ["Confidence", "80%"],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[108px_1fr] rounded-lg border border-white/8 bg-white/[0.035] px-3 py-2 text-sm">
                    <span className="text-white/38">{label}</span>
                    <span className="font-medium text-white/82">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section id="scans" eyebrow="What ReguScan scans" title="Website AI detection that produces evidence, not guesses.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scanSurfaces.map((item) => (
            <div key={item} className="feature-tile">
              <Bot className="h-5 w-5 text-cyan-200" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="How it works" title="A full scan pipeline, from public page crawl to report output.">
        <div className="grid gap-4 lg:grid-cols-5">
          {workflow.map((step, index) => (
            <div key={step.label} className="command-card p-5">
              <span className="text-xs font-semibold text-cyan-200/70">0{index + 1}</span>
              <h3 className="mt-3 text-lg font-bold">{step.label}</h3>
              <p className="mt-2 text-sm leading-6 text-white/52">{step.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="What you get" title="A compliance action plan with the proof attached.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <Check className="mb-3 h-4 w-4 text-emerald-300" />
              <p className="text-sm font-medium text-white/82">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Implemented feature map" title="The demo exposes the actual product, not a static landing page.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map(({ icon: Icon, title, text }) => (
            <div key={title} className="command-card p-6">
              <Icon className="h-5 w-5 text-cyan-200" />
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/54">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Future slots" title="Optional services have visible, honest disabled states.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {futureSlots.map((slot) => (
            <div key={slot} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <span className="text-sm text-white/72">{slot}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-xs text-white/42">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </Section>

      <section className="relative border-t border-white/8 px-5 py-16 sm:px-8">
        <AnimatedComplianceBackground className="opacity-35" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 rounded-lg border border-cyan-200/14 bg-cyan-200/[0.055] p-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-cyan-100/70">Ready for a founder demo</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal">Turn your website into a compliance evidence trail.</h2>
          </div>
          <SignUpButton mode="modal">
            <button className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">
              Start a scan <ArrowRight className="h-4 w-4" />
            </button>
          </SignUpButton>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/8 px-5 py-8 text-sm text-white/42 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>ReguScan 2026</span>
        </div>
        <p>ReguScan provides technical compliance guidance and evidence collection. It is not legal advice.</p>
      </footer>
    </main>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative border-t border-white/8 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/62">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal sm:text-4xl">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

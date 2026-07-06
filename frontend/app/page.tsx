import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  ClipboardCheck,
  FileSearch,
  FileText,
  Globe,
  MessageSquare,
  PenTool,
  Radar,
  Shield,
  Users,
  Workflow,
} from "lucide-react";
import AnimatedComplianceBackground from "@/components/AnimatedComplianceBackground";
import DemoVideoModal from "@/components/landing/DemoVideoModal";
import EvidencePreviewCards from "@/components/landing/EvidencePreviewCards";
import HoverExpandCards, { type HoverExpandCard } from "@/components/landing/HoverExpandCards";
import HowItWorksStack, { type WorkflowStep } from "@/components/landing/HowItWorksStack";

const detectionCards: HoverExpandCard[] = [
  {
    icon: MessageSquare,
    title: "AI chatbots",
    description: "Detect support widgets, conversational UI, chatbot copy, and disclosure gaps that may trigger transparency review.",
    signal: "widget config + page text + launcher copy",
    risk: "Art. 50 review",
    accent: "cyan",
  },
  {
    icon: Radar,
    title: "Recommendation engines",
    description: "Find personalization language, ranking signals, recommendation widgets, and automated choice patterns on public pages.",
    signal: "ranking copy + script patterns + UX claims",
    risk: "Risk signal",
    accent: "indigo",
  },
  {
    icon: Users,
    title: "HR and recruitment AI",
    description: "Flag candidate screening, scoring, filtering, and assessment flows that deserve a higher-risk human review.",
    signal: "career forms + screening language",
    risk: "High-risk review",
    accent: "rose",
  },
  {
    icon: PenTool,
    title: "Content generators",
    description: "Identify public claims around AI-written content, generated media, authoring assistants, and labeling needs.",
    signal: "AI content copy + metadata hints",
    risk: "Labeling review",
    accent: "amber",
  },
  {
    icon: Bot,
    title: "AI assistants",
    description: "Surface embedded copilots, support assistants, intake helpers, and guided automation on product pages.",
    signal: "assistant scripts + interaction text",
    risk: "Disclosure check",
    accent: "emerald",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance gaps",
    description: "Convert detected systems into explainable findings with source evidence, article context, and recommended next steps.",
    signal: "risk class + confidence + evidence path",
    risk: "Report output",
    accent: "cyan",
  },
];

const workflowSteps: WorkflowStep[] = [
  {
    icon: Globe,
    title: "Enter website URL",
    detail: "A public site is normalized, checked for unsafe targets, and queued as a scoped scan instead of a vague audit request.",
    metric: "Safe URL",
  },
  {
    icon: Radar,
    title: "Crawl website",
    detail: "ReguScan maps public pages, scripts, metadata, forms, visible claims, and crawl confidence so missing evidence is visible.",
    metric: "Page evidence",
  },
  {
    icon: Bot,
    title: "Detect AI systems",
    detail: "The detector looks for chatbots, recommendation logic, HR flows, generators, assistants, and automated decision signals.",
    metric: "AI signals",
  },
  {
    icon: Shield,
    title: "Classify risk",
    detail: "Detected systems are mapped to prohibited, high, limited, or minimal risk categories with confidence and reasoning.",
    metric: "Risk tier",
  },
  {
    icon: FileSearch,
    title: "Generate evidence",
    detail: "Findings stay tied to page paths, technical signals, snippets, and confidence so reviewers can challenge the output.",
    metric: "Audit trail",
  },
  {
    icon: FileText,
    title: "Create compliance report",
    detail: "The final report summarizes likely gaps, suggested fixes, and review priorities without claiming a legal guarantee.",
    metric: "Report ready",
  },
];

const outcomes = [
  "AI compliance scanner for public websites",
  "EU AI Act compliance readiness support",
  "Website AI detection with source evidence",
  "AI risk assessment and confidence scoring",
  "Compliance report generator",
  "AI governance tool for SaaS teams",
  "SaaS compliance automation workflow",
  "Evidence-based compliance report output",
];

const audiences = [
  ["SaaS founders", "Find AI risk signals before sales, procurement, or investor diligence asks for evidence."],
  ["Agencies and consultants", "Create a consistent first-pass AI governance report for clients without starting from a blank doc."],
  ["Product teams", "Track where AI features appear on public pages and keep disclosures aligned with product changes."],
  ["Compliance owners", "Prioritize review work with confidence, severity, article mapping, and recommended remediation."],
];

const pricingPreview = [
  ["Free", "$0", "1 website", "1 scan total"],
  ["Starter", "$49/mo", "3 websites", "10 scans/month"],
  ["Pro", "$199/mo", "10 websites", "100 scans/month"],
];

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen overflow-hidden bg-reguscan-deep text-white">
      <Hero />

      <Section
        id="detects"
        eyebrow="What ReguScan detects"
        title="A premium AI compliance scanner should explain what it found."
        copy="The detection experience is product-focused: each animated card maps to real AI systems, public website signals, and likely EU AI Act readiness work."
      >
        <HoverExpandCards cards={detectionCards} />
      </Section>

      <section id="how-it-works" className="relative border-t border-white/8 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <HowItWorksStack steps={workflowSteps} />
        </div>
      </section>

      <Section
        id="evidence"
        eyebrow="Evidence-based results"
        title="Swipe through the kinds of findings a reviewer can act on."
        copy="These sample cards show the product promise without pretending to be legal advice: source, risk, article context, and a concrete next step."
      >
        <EvidencePreviewCards />
      </Section>

      <Section
        id="demo"
        eyebrow="Demo report preview"
        title="Watch the scan story without requiring the backend to be running."
        copy="The demo modal is asset-safe and ready for a real scan recording. Until then, it gives visitors a clear preview of the workflow."
      >
        <DemoVideoModal />
      </Section>

      <Section
        id="audience"
        eyebrow="Who it is for"
        title="Built for teams that need AI governance evidence before they need a legal memo."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {audiences.map(([title, copy]) => (
            <article key={title} className="command-card p-6">
              <h3 className="text-xl font-black tracking-normal">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{copy}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="pricing-preview"
        eyebrow="Pricing preview"
        title="Start with a scan, then scale into repeatable compliance automation."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {pricingPreview.map(([name, price, websites, scans], index) => (
            <article key={name} className="command-card flex flex-col p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-normal">{name}</h3>
                {index === 1 && (
                  <span className="rounded-full border border-cyan-200/18 bg-cyan-200/[0.08] px-3 py-1 text-xs font-semibold text-cyan-100">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-5 text-4xl font-black">{price}</p>
              <div className="mt-6 space-y-3 text-sm text-white/58">
                {[websites, scans, "Evidence report preview"].map((feature) => (
                  <p key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-300" /> {feature}
                  </p>
                ))}
              </div>
              <Link
                href="/pricing"
                className="mt-8 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-white/78 transition hover:bg-white/[0.075] hover:text-white"
              >
                View pricing
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <section className="relative border-t border-white/8 px-5 py-16 sm:px-8">
        <AnimatedComplianceBackground className="opacity-35" />
        <div className="relative mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-lg border border-amber-300/18 bg-amber-300/[0.07] p-6">
            <AlertTriangle className="h-5 w-5 text-amber-200" />
            <h2 className="mt-4 text-2xl font-black tracking-normal">Important disclaimer</h2>
            <p className="mt-3 text-sm leading-6 text-white/62">
              ReguScan helps identify potential AI compliance risks and supports EU AI Act readiness. It generates
              evidence-based guidance, but it is not a substitute for legal advice.
            </p>
          </div>

          <div className="rounded-lg border border-cyan-200/14 bg-cyan-200/[0.055] p-6 sm:p-8">
            <p className="text-sm font-semibold text-cyan-100/70">Final CTA</p>
            <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-normal">
              Turn a public website into an AI risk assessment and evidence-based compliance report.
            </h2>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <SignUpButton mode="modal">
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">
                  Scan your website <ArrowRight className="h-4 w-4" />
                </button>
              </SignUpButton>
              <Link
                href="/sample-report"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.075]"
              >
                View sample report <FileText className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/8 px-5 py-8 text-sm text-white/42 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>ReguScan 2026</span>
        </div>
        <p>Interface inspired by premium animated SaaS patterns; no third-party sample assets or Skiper UI code were copied.</p>
      </footer>
    </main>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[92vh]">
      <AnimatedComplianceBackground intensity="hero" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,18,0.95)_0%,rgba(5,8,18,0.84)_38%,rgba(5,8,18,0.34)_74%,rgba(5,8,18,0.86)_100%)]" />
      <Image
        src="/hero-reguscan-command-center.png"
        alt="ReguScan command center visual showing website scanning, AI risk layers, and a compliance report."
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

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:pb-24 lg:pt-24">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-100">
            <AlertTriangle className="h-3.5 w-3.5" />
            AI governance guidance, not legal advice.
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
            AI compliance scanner for EU AI Act readiness
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200/74">
            ReguScan scans public websites, detects AI systems, classifies risk, and generates evidence-based compliance
            guidance for SaaS teams, agencies, and businesses preparing for AI governance reviews.
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
          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 text-xs text-white/54 sm:grid-cols-4">
            {outcomes.slice(0, 4).map((item) => (
              <span key={item} className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="landing-command-preview command-card absolute right-0 top-3 w-[540px] p-5">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Live evidence trace</p>
                <h2 className="mt-2 text-xl font-bold">example.com scan result</h2>
              </div>
              <div className="text-right">
                <p className="text-5xl font-black text-amber-300">72</p>
                <p className="text-xs text-white/38">readiness score</p>
              </div>
            </div>
            <div className="mb-5 grid grid-cols-3 gap-2">
              {["Crawl", "Detect", "Classify", "Evidence", "Gaps", "Report"].map((step, index) => (
                <div key={step} className="rounded-lg border border-cyan-200/10 bg-cyan-200/[0.055] p-2">
                  <span className="text-xs text-cyan-100/60">0{index + 1}</span>
                  <p className="mt-1 text-xs font-semibold">{step}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[
                ["Found on", "/pricing"],
                ["Signal", "chat widget config"],
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
  );
}

function Section({
  id,
  eyebrow,
  title,
  copy,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  copy?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative border-t border-white/8 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/62">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal sm:text-4xl">{title}</h2>
          {copy && <p className="mt-4 text-base leading-7 text-white/58">{copy}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

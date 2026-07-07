import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  ClipboardCheck,
  Database,
  FileSearch,
  FileText,
  Gauge,
  Globe,
  LockKeyhole,
  MessageSquare,
  PenTool,
  Radar,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import AnimatedComplianceBackground from "@/components/AnimatedComplianceBackground";
import DemoVideoModal from "@/components/landing/DemoVideoModal";
import EvidencePreviewCards from "@/components/landing/EvidencePreviewCards";
import HoverExpandCards, { type HoverExpandCard } from "@/components/landing/HoverExpandCards";
import HowItWorksStack, { type WorkflowStep } from "@/components/landing/HowItWorksStack";
import { GlowCard, MetricCard, ProgressBar, RiskBadge, StatusPill } from "@/components/ui/premium";

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
    title: "Recommendation systems",
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
    title: "AI-generated content",
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
    title: "Missing disclosures",
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
    title: "Find compliance gaps",
    detail: "Findings stay tied to page paths, technical signals, snippets, and confidence so reviewers can challenge the output.",
    metric: "Gap map",
  },
  {
    icon: FileText,
    title: "Generate report",
    detail: "The final report summarizes likely gaps, suggested fixes, and review priorities without claiming a legal guarantee.",
    metric: "Report ready",
  },
];

const problemCards = [
  {
    icon: Sparkles,
    title: "AI is appearing in product surfaces faster than governance can track it.",
    copy: "Chatbots, assistants, ranking systems, generated content, HR screening, and automated decisions can slip into public pages without a clean review trail.",
  },
  {
    icon: LockKeyhole,
    title: "Legal, product, and sales teams need the same evidence layer.",
    copy: "ReguScan makes website AI detection visible enough for an AI risk assessment, procurement response, or internal remediation plan.",
  },
  {
    icon: Database,
    title: "A clean score is only useful when the scan quality is visible.",
    copy: "The interface keeps crawl confidence, detection signals, related EU AI Act articles, and review warnings close to the final score.",
  },
];

const audiences = [
  ["SaaS founders", "Find AI risk signals before sales, procurement, or investor diligence asks for evidence."],
  ["AI startups", "Check public claims, assistants, and generated-content surfaces before they become trust issues."],
  ["Agencies", "Create a consistent first-pass AI governance report for clients without starting from a blank document."],
  ["Compliance teams", "Prioritize review work with confidence, severity, article mapping, and recommended remediation."],
  ["Product teams", "Track where AI features appear on public pages and keep disclosures aligned with product changes."],
  ["Businesses using AI tools", "Understand whether AI widgets and automation create disclosure or review work."],
];

const pricingPreview = [
  {
    name: "Free",
    price: "$0",
    features: ["1 website", "1 scan total", "Top evidence findings", "Web report preview"],
    cta: "Start Free Scan",
    active: true,
  },
  {
    name: "Starter",
    price: "$49/mo",
    features: ["3 websites", "10 scans/month", "Full gap analysis", "Email alerts planned"],
    cta: "Coming Soon",
  },
  {
    name: "Pro",
    price: "$199/mo",
    features: ["10 websites", "100 scans/month", "Report templates", "API access planned"],
    cta: "Coming Soon",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited websites", "Team workflows", "White-label reports", "Custom review support"],
    cta: "Contact Sales",
  },
];

const heroOutcomes = [
  "AI compliance scanner",
  "EU AI Act compliance",
  "Website AI detection",
  "Evidence-based compliance report",
];

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen overflow-hidden bg-reguscan-deep text-white">
      <Hero />
      <ProblemSection />

      <section id="how-it-works" className="relative border-t border-white/8 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <HowItWorksStack steps={workflowSteps} />
        </div>
      </section>

      <Section
        id="evidence"
        eyebrow="Evidence-based results"
        title="ReguScan is built to show its work, not just output a score."
        copy="Sample findings show where the signal came from, how strong the evidence is, which EU AI Act article is relevant, and what to fix next."
      >
        <EvidencePreviewCards />
      </Section>

      <CommandCenterSection />

      <Section
        id="detects"
        eyebrow="What ReguScan detects"
        title="Website AI detection for the systems that usually hide in plain sight."
        copy="The product watches for public AI risk signals across marketing pages, product pages, career flows, blog content, and embedded scripts."
      >
        <HoverExpandCards cards={detectionCards} />
      </Section>

      <Section
        id="demo"
        eyebrow="Demo report preview"
        title="Preview the workflow before you run a real scan."
        copy="The demo modal is asset-safe and ready for a real scan recording. Until then, it shows the exact story: crawl, detect, classify, and report."
      >
        <DemoVideoModal />
      </Section>

      <Section
        id="audience"
        eyebrow="Who it is for"
        title="For teams that need AI governance evidence before they need a legal memo."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {audiences.map(([title, copy]) => (
            <GlowCard key={title} className="p-6" accent="slate">
              <h3 className="relative z-10 text-xl font-black tracking-normal">{title}</h3>
              <p className="relative z-10 mt-3 text-sm leading-6 text-white/58">{copy}</p>
            </GlowCard>
          ))}
        </div>
      </Section>

      <PricingPreviewSection />
      <FinalCta />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[94vh]">
      <AnimatedComplianceBackground intensity="hero" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,18,0.96)_0%,rgba(5,8,18,0.86)_40%,rgba(5,8,18,0.36)_74%,rgba(5,8,18,0.9)_100%)]" />
      <Image
        src="/hero-reguscan-command-center.png"
        alt="ReguScan command center visual showing website scanning, AI risk layers, and a compliance report."
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-52 mix-blend-screen"
      />

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 shadow-[0_0_30px_rgba(103,232,249,0.16)]">
            <Shield className="h-5 w-5 text-cyan-200" />
          </span>
          <span className="text-lg font-bold tracking-tight">ReguScan</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm text-white/58 md:flex">
          <Link href="#evidence" className="hover:text-white">Evidence</Link>
          <Link href="#command-center" className="hover:text-white">Command center</Link>
          <Link href="/sample-report" className="hover:text-white">Demo report</Link>
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
        </div>
        <div className="flex items-center gap-2">
          <SignInButton mode="modal">
            <button className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(103,232,249,0.22)] transition hover:bg-cyan-200">
              Start Free Scan
            </button>
          </SignUpButton>
        </div>
      </nav>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:pb-24 lg:pt-24">
        <div className="max-w-3xl">
          <StatusPill tone="amber">
            <AlertTriangle className="h-3.5 w-3.5" />
            Technical guidance, not legal advice
          </StatusPill>
          <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
            AI Compliance Scanner for EU AI Act Readiness
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200/74">
            ReguScan is an AI governance platform for website AI detection, AI risk assessment, and evidence-based
            compliance report generation across public SaaS surfaces.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <SignUpButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_38px_rgba(103,232,249,0.26)] transition hover:-translate-y-0.5 hover:bg-cyan-200">
                Start Free Scan <ArrowRight className="h-4 w-4" />
              </button>
            </SignUpButton>
            <Link
              href="/sample-report"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.045] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.075]"
            >
              View Demo Report <FileText className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 text-xs text-white/54 sm:grid-cols-4">
            {heroOutcomes.map((item) => (
              <span key={item} className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="landing-command-preview command-card absolute right-0 top-3 w-[560px] overflow-hidden p-5">
            <div className="scan-beam" />
            <div className="relative z-10 mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Live evidence trace</p>
                <h2 className="mt-2 text-xl font-bold">acme.ai scan result</h2>
              </div>
              <div className="text-right">
                <p className="text-5xl font-black text-amber-300">72</p>
                <p className="text-xs text-white/38">readiness score</p>
              </div>
            </div>
            <div className="relative z-10 mb-5 grid grid-cols-3 gap-2">
              {["Crawl", "Detect", "Classify", "Evidence", "Gaps", "Report"].map((step, index) => (
                <div key={step} className="command-center-panel rounded-lg border border-cyan-200/10 bg-cyan-200/[0.055] p-2">
                  <span className="text-xs text-cyan-100/60">0{index + 1}</span>
                  <p className="mt-1 text-xs font-semibold">{step}</p>
                </div>
              ))}
            </div>
            <div className="relative z-10 space-y-3">
              {[
                ["Found on", "/pricing"],
                ["Detection source", "chat widget config"],
                ["Evidence strength", "strong"],
                ["Article", "EU AI Act Art. 50"],
                ["Recommended fix", "Add AI interaction notice"],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[136px_1fr] rounded-lg border border-white/8 bg-white/[0.035] px-3 py-2 text-sm">
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

function ProblemSection() {
  return (
    <Section
      id="problem"
      eyebrow="The governance gap"
      title="AI features are shipped faster than teams can explain them."
      copy="A serious AI audit tool needs to connect product reality to review evidence. ReguScan turns public website signals into a structured compliance workflow for teams preparing for EU AI Act compliance."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {problemCards.map(({ icon: Icon, title, copy }) => (
          <GlowCard key={title} className="p-6" accent="slate">
            <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-200/16 bg-cyan-200/[0.08] text-cyan-100">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="relative z-10 mt-5 text-xl font-black tracking-normal">{title}</h3>
            <p className="relative z-10 mt-3 text-sm leading-6 text-white/58">{copy}</p>
          </GlowCard>
        ))}
      </div>
    </Section>
  );
}

function CommandCenterSection() {
  return (
    <section id="command-center" className="relative border-t border-white/8 px-5 py-20 sm:px-8">
      <AnimatedComplianceBackground className="opacity-20" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/62">Product preview</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal sm:text-4xl">
            A compliance command center for scans, evidence, and remediation.
          </h2>
          <p className="mt-4 text-base leading-7 text-white/58">
            The internal dashboard is designed around the questions a reviewer asks: what was found, where it was found,
            why it matters, what to fix, and how confident the scan is.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.18fr_0.82fr]">
          <GlowCard className="overflow-hidden p-5 sm:p-6" accent="cyan">
            <div className="scan-beam" />
            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <StatusPill tone="cyan">
                  <Activity className="h-3.5 w-3.5" />
                  Scan completed
                </StatusPill>
                <h3 className="mt-4 text-2xl font-black tracking-normal">acme.ai risk snapshot</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/52">
                  Evidence-backed AI risk assessment with crawl quality, detected systems, gap severity, and report export.
                </p>
              </div>
              <div className="text-left lg:text-right">
                <p className="text-xs uppercase tracking-[0.18em] text-white/34">Compliance score</p>
                <p className="mt-1 text-6xl font-black text-amber-300">72</p>
              </div>
            </div>

            <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-3">
              <MetricCard label="AI systems" value="4" sub="2 require action" icon={Bot} tone="cyan" />
              <MetricCard label="High gaps" value="3" sub="Before public launch" icon={AlertTriangle} tone="amber" />
              <MetricCard label="Crawl confidence" value="Medium" sub="2 blocked pages" icon={Gauge} tone="indigo" />
            </div>

            <div className="relative z-10 mt-6 grid gap-3 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.16em] text-white/34">Risk distribution</p>
                {[
                  ["Limited", 48, "cyan"],
                  ["High", 32, "amber"],
                  ["Minimal", 20, "emerald"],
                ].map(([label, value, tone]) => (
                  <div key={label as string} className="mb-3 last:mb-0">
                    <div className="mb-1 flex justify-between text-xs text-white/52">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <ProgressBar value={Number(value)} tone={tone as "cyan" | "amber" | "emerald"} />
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.16em] text-white/34">Priority findings</p>
                {[
                  ["Chatbot disclosure missing", "EU AI Act Art. 50", "high"],
                  ["Recruitment screening language", "High-risk workflow review", "high"],
                  ["Generated content label absent", "Transparency guidance", "limited"],
                ].map(([title, article, tier]) => (
                  <div key={title} className="mb-3 flex items-center justify-between gap-4 rounded-lg border border-white/8 bg-black/20 px-3 py-2 last:mb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white/82">{title}</p>
                      <p className="text-xs text-white/38">{article}</p>
                    </div>
                    <RiskBadge tier={tier} />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sample-report"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
              >
                View Demo Report <FileText className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.075]"
              >
                Explore plans <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </GlowCard>

          <div className="grid gap-4">
            {[
              ["What was found?", "4 AI systems across chat, content, and recommendation surfaces."],
              ["Where was it found?", "Page paths, script evidence, widget signals, and crawl warnings."],
              ["Why does it matter?", "Each risk maps back to review urgency and article context."],
              ["What should I fix?", "Recommended remediation stays next to the evidence that triggered it."],
            ].map(([title, copy]) => (
              <GlowCard key={title} className="p-5" accent="slate">
                <h3 className="relative z-10 text-lg font-black tracking-normal">{title}</h3>
                <p className="relative z-10 mt-2 text-sm leading-6 text-white/55">{copy}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingPreviewSection() {
  return (
    <Section
      id="pricing-preview"
      eyebrow="Pricing preview"
      title="Start with a free scan, then scale into SaaS compliance automation."
      copy="Razorpay upgrade buttons stay inactive until checkout is fully configured, so the UI does not imply payment works when it does not."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pricingPreview.map((plan) => (
          <GlowCard key={plan.name} className="flex flex-col p-6" accent={plan.highlight ? "cyan" : "slate"}>
            <div className="relative z-10 flex items-center justify-between gap-3">
              <h3 className="text-xl font-black tracking-normal">{plan.name}</h3>
              {plan.highlight && <StatusPill tone="cyan">Popular</StatusPill>}
            </div>
            <p className="relative z-10 mt-5 text-4xl font-black">{plan.price}</p>
            <div className="relative z-10 mt-6 flex-1 space-y-3 text-sm text-white/58">
              {plan.features.map((feature) => (
                <p key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" /> {feature}
                </p>
              ))}
            </div>
            {plan.active ? (
              <SignUpButton mode="modal">
                <button className="relative z-10 mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">
                  {plan.cta} <ArrowRight className="h-4 w-4" />
                </button>
              </SignUpButton>
            ) : plan.name === "Enterprise" ? (
              <Link
                href="mailto:sales@reguscan.com?subject=ReguScan%20Enterprise"
                className="relative z-10 mt-8 inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.075]"
              >
                {plan.cta}
              </Link>
            ) : (
              <span className="relative z-10 mt-8 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-white/42">
                {plan.cta}
              </span>
            )}
          </GlowCard>
        ))}
      </div>
    </Section>
  );
}

function FinalCta() {
  return (
    <section className="relative border-t border-white/8 px-5 py-16 sm:px-8">
      <AnimatedComplianceBackground className="opacity-28" />
      <div className="relative mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <GlowCard className="p-6" accent="amber">
          <AlertTriangle className="relative z-10 h-5 w-5 text-amber-200" />
          <h2 className="relative z-10 mt-4 text-2xl font-black tracking-normal">Important disclaimer</h2>
          <p className="relative z-10 mt-3 text-sm leading-6 text-white/62">
            ReguScan provides technical compliance guidance and is not a substitute for legal advice.
          </p>
        </GlowCard>

        <GlowCard className="p-6 sm:p-8" accent="cyan">
          <p className="relative z-10 text-sm font-semibold text-cyan-100/70">Final CTA</p>
          <h2 className="relative z-10 mt-2 max-w-3xl text-3xl font-black tracking-normal">
            Find AI compliance risks before they become business risks.
          </h2>
          <p className="relative z-10 mt-3 max-w-2xl text-sm leading-6 text-white/56">
            Run a fast first-pass AI audit tool for your public website and leave with a compliance report generator output your team can review.
          </p>
          <div className="relative z-10 mt-6 flex flex-col gap-3 sm:flex-row">
            <SignUpButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">
                Start Free Scan <ArrowRight className="h-4 w-4" />
              </button>
            </SignUpButton>
            <Link
              href="/sample-report"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.075]"
            >
              View Demo Report <FileText className="h-4 w-4" />
            </Link>
          </div>
        </GlowCard>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/8 px-5 py-8 text-sm text-white/42 sm:px-8 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4" />
        <span>ReguScan 2026</span>
      </div>
      <p>Premium AI compliance platform UI. No third-party sample assets or Skiper UI code were copied.</p>
    </footer>
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

import dynamic from "next/dynamic";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  FileCheck2,
  FileSearch,
  FileText,
  Globe2,
  Layers3,
  MessageSquare,
  Radar,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import BrowserScanFrame from "@/components/landing/BrowserScanFrame";
import {
  AnimatedRegulationText,
  ComplianceRadar,
  DynamicGrid,
  EvidenceBeacon,
  GlassCommandPanel,
  ReportFragments,
  RiskPulse,
  SectionTransition,
} from "@/components/landing/CinematicPrimitives";
import IntroSequence from "@/components/landing/IntroSequence";
import LandingNav from "@/components/landing/LandingNav";

const ScanStory = dynamic(() => import("@/components/landing/ScanStory"), {
  loading: () => <div className="min-h-screen border-y border-white/[0.07] bg-[#04070d]" aria-label="Loading scan story" />,
});
const DemoVideoModal = dynamic(() => import("@/components/landing/DemoVideoModal"));

const detections = [
  ["01", "AI chatbots", "widget config + launcher copy", "Art. 50 review", MessageSquare],
  ["02", "Recommendation systems", "ranking claims + script patterns", "classification review", Radar],
  ["03", "HR and recruitment AI", "career forms + screening language", "high-risk review", Users],
  ["04", "AI-generated content", "authoring metadata + public claims", "labeling review", Code2],
  ["05", "Embedded assistants", "assistant scripts + interaction text", "disclosure check", Bot],
] as const;

const riskTiers = [
  ["Prohibited", "Stop and escalate", "Manipulation, social scoring, or other banned-use signals", "rose", "12%"],
  ["High", "Human review required", "Employment, access, safety, or consequential decision workflows", "orange", "27%"],
  ["Limited", "Transparency duties", "Chatbots, generated content, and user-facing AI interactions", "cyan", "38%"],
  ["Minimal", "Document and monitor", "Lower-impact automation with evidence still attached", "emerald", "23%"],
] as const;

const gaps = [
  {
    severity: "01 / HIGH",
    article: "EU AI Act · Article 50",
    title: "Chatbot transparency disclosure missing",
    explanation: "The pricing page launches an AI-enabled assistant without telling the user they are interacting with AI.",
    fix: "Place a plain-language AI interaction notice beside the launcher before the conversation begins.",
  },
  {
    severity: "02 / MEDIUM",
    article: "EU AI Act · Article 13",
    title: "Recommendation logic is not explained",
    explanation: "Public product copy promises personalized choices, but the basis for those recommendations is not visible.",
    fix: "Publish a concise explanation of inputs, limitations, and how a user can request human support.",
  },
  {
    severity: "03 / REVIEW",
    article: "Scan quality guardrail",
    title: "Two pages could not be verified",
    explanation: "Blocked routes reduce crawl confidence. A clean visible page cannot be treated as proof that hidden routes are compliant.",
    fix: "Review blocked pages manually or re-run the scan with authorized access before closing the assessment.",
  },
];

const roles = [
  ["Founders", "Find evidence before diligence does."],
  ["Product", "Trace AI surfaces before release."],
  ["Compliance", "Prioritize review with sources attached."],
  ["Agencies", "Start every client audit from the same evidence layer."],
  ["Legal", "Review a structured technical dossier, not a black-box score."],
] as const;

const planPreview = [
  ["Free", "$0", "1 website", "1 scan total", "available"],
  ["Starter", "$49/mo", "3 websites", "10 scans / month", "coming soon"],
  ["Pro", "$199/mo", "10 websites", "100 scans / month", "coming soon"],
  ["Enterprise", "Custom", "Unlimited websites", "Team review workflows", "contact"],
] as const;

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen overflow-x-clip bg-[#05080f] text-white selection:bg-cyan-200 selection:text-[#061019]">
      <IntroSequence />
      <Hero />
      <GovernanceStatement />
      <ScanStory />
      <EvidenceSection />
      <DetectionSection />
      <RiskClassificationSection />
      <GapAnalysisSection />
      <ReportAssemblySection />
      <VideoSection />
      <CommandCenterSection />
      <AudienceSection />
      <PricingPreviewSection />
      <FinalSection />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#05080f]">
      <DynamicGrid className="opacity-70" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-0 h-[560px] w-[560px] rounded-full bg-cyan-300/[0.08] blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 bottom-0 h-[420px] w-[420px] rounded-full bg-violet-400/[0.06] blur-[130px]" />
      <LandingNav />

      <div className="relative mx-auto grid max-w-[1500px] gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:pb-24 lg:pt-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <RiskPulse tone="cyan" label="public-site intelligence" />
            <span className="h-px w-12 bg-white/10" />
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/[0.34]">EU AI Act readiness</span>
          </div>
          <h1 className="mt-8 text-[clamp(3.5rem,7.2vw,7.7rem)] font-light leading-[0.86] tracking-[-0.075em] text-white">
            AI Compliance Scanner <span className="block text-white/[0.46]">for EU AI Act Readiness</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-white/[0.64] sm:text-xl">
            Find the AI signal. Trace the source. Classify the risk. Turn website evidence into a reviewable compliance dossier.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <SignUpButton mode="modal">
              <button className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-cyan-200 px-6 text-sm font-semibold text-[#061019] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200">
                Scan Your Website <ArrowRight className="h-4 w-4" />
              </button>
            </SignUpButton>
            <Link href="/sample-report" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.035] px-6 text-sm font-medium text-white/[0.76] transition hover:border-white/[0.24] hover:bg-white/[0.07] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
              See a Real Report <FileText className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 flex items-start gap-3 border-t border-white/[0.08] pt-5 text-xs leading-5 text-white/[0.38]">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-200/[0.72]" />
            <span>Technical compliance guidance for review teams. Not a substitute for legal advice.</span>
          </div>
        </div>

        <BrowserScanFrame className="lg:translate-x-4" />
      </div>

      <div className="relative mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-5 border-t border-white/[0.07] px-5 py-5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30 sm:px-8">
        <span>Website scan / DOM / scripts / page claims</span>
        <span>Evidence before score</span>
        <span>Unknown never means compliant</span>
      </div>
    </section>
  );
}

function GovernanceStatement() {
  return (
    <section className="relative overflow-hidden bg-[#080b12] px-5 py-24 sm:px-8 sm:py-32">
      <div aria-hidden="true" className="absolute inset-y-0 left-[62%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="mx-auto grid max-w-[1380px] gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <SectionTransition>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-amber-100/[0.54]">The governance gap</p>
          <h2 className="mt-6 max-w-5xl text-4xl font-light leading-[1.04] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            The problem is not that AI is invisible. <span className="text-white/35">Its evidence is scattered.</span>
          </h2>
        </SectionTransition>
        <SectionTransition className="lg:pb-2">
          <p className="max-w-xl text-base leading-7 text-white/[0.58]">
            A chatbot lives in a script. A recommendation claim lives in product copy. A hiring flow sits on a blocked route. ReguScan connects those fragments to a risk decision your team can inspect.
          </p>
          <div className="mt-7">
            <AnimatedRegulationText />
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}

function EvidenceSection() {
  return (
    <section id="evidence" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[1380px] gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <SectionTransition>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100/[0.54]">Evidence, not guesswork</p>
          <h2 className="mt-5 text-4xl font-light leading-[1.02] tracking-[-0.055em] sm:text-6xl">Every claim returns to a source.</h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/[0.56]">
            ReguScan keeps the page URL, detected signal, confidence, risk tier, regulation, and recommended fix together. Reviewers can challenge the output without reverse-engineering the scan.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-y border-white/[0.08] py-6">
            {[["42", "pages mapped"], ["06", "script signals"], ["80%", "finding confidence"], ["02", "blocked routes"]].map(([value, label]) => (
              <div key={label}>
                <p className="text-3xl font-light tracking-[-0.05em]">{value}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/[0.32]">{label}</p>
              </div>
            ))}
          </div>
        </SectionTransition>

        <SectionTransition>
          <GlassCommandPanel className="p-4 sm:p-6">
            <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
              <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#050a12]">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/[0.36]">Source fragment · /pricing</span>
                  <RiskPulse tone="cyan" label="matched" />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-7 text-white/[0.48]" aria-label="Detected script evidence">
                  <code>{`178  window.intercomSettings = {\n179    api_base: \"https://api...\",\n180    app_id: \"acme-support\",\n181    assistant_mode: \"ai\"\n182  };`}</code>
                </pre>
                <div className="border-t border-amber-200/[0.16] bg-amber-200/[0.045] px-4 py-3 font-mono text-[10px] text-amber-100/[0.72]">
                  ↳ matched: AI-enabled user interaction
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-4">
                <EvidenceBeacon label="Page URL" value="https://acme.ai/pricing" state="verified" />
                <EvidenceBeacon label="Signal" value="intercomSettings.assistant_mode" />
                <EvidenceBeacon label="Risk" value="Limited · transparency" state="warning" />
                <EvidenceBeacon label="Article" value="EU AI Act · Article 50" state="verified" />
              </div>
            </div>
          </GlassCommandPanel>
        </SectionTransition>
      </div>
    </section>
  );
}

function DetectionSection() {
  return (
    <section className="border-y border-white/[0.07] bg-[#080b12] px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1380px]">
        <div className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr]">
          <SectionTransition>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100/[0.54]">What ReguScan sees</p>
            <h2 className="mt-5 text-4xl font-light leading-[1.04] tracking-[-0.055em] sm:text-5xl">AI systems hide in different layers.</h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/[0.48]">The scanner does not treat one keyword as proof. It connects visible claims, page structure, scripts, and workflow context.</p>
          </SectionTransition>

          <div className="border-t border-white/10">
            {detections.map(([number, title, signal, risk, Icon]) => (
              <SectionTransition key={title} className="group grid gap-4 border-b border-white/[0.08] py-5 transition hover:bg-white/[0.018] sm:grid-cols-[48px_1fr_1fr_0.8fr] sm:items-center sm:px-3">
                <span className="font-mono text-[10px] text-white/[0.28]">{number}</span>
                <span className="flex items-center gap-3 text-lg font-medium tracking-[-0.02em] text-white">
                  <Icon className="h-4 w-4 text-cyan-200/[0.64]" /> {title}
                </span>
                <span className="font-mono text-[10px] leading-5 text-white/[0.38]">{signal}</span>
                <span className="justify-self-start rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-white/[0.56] sm:justify-self-end">{risk}</span>
              </SectionTransition>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RiskClassificationSection() {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[1380px] gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <SectionTransition>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100/[0.54]">Risk classification</p>
          <h2 className="mt-5 text-4xl font-light leading-[1.02] tracking-[-0.055em] sm:text-6xl">A spectrum, with the evidence still attached.</h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/[0.54]">Risk is not a color applied after the scan. Each tier carries the signals, confidence, and review path that produced it.</p>
          <div className="mt-9 max-w-sm">
            <ComplianceRadar score={72} />
          </div>
        </SectionTransition>

        <SectionTransition className="space-y-3">
          {riskTiers.map(([tier, action, detail, tone, width]) => {
            const barTone = tone === "rose" ? "bg-rose-400" : tone === "orange" ? "bg-orange-300" : tone === "cyan" ? "bg-cyan-200" : "bg-emerald-300";
            return (
              <div key={tier} className="relative overflow-hidden border-b border-white/[0.08] py-5">
                <div className="grid gap-3 sm:grid-cols-[120px_0.8fr_1.4fr] sm:items-center">
                  <p className="text-lg font-medium">{tier}</p>
                  <p className="text-sm text-white/[0.62]">{action}</p>
                  <p className="text-xs leading-5 text-white/[0.36]">{detail}</p>
                </div>
                <div className="mt-4 h-px bg-white/[0.06]">
                  <div className={`h-px ${barTone}`} style={{ width }} />
                </div>
              </div>
            );
          })}
        </SectionTransition>
      </div>
    </section>
  );
}

function GapAnalysisSection() {
  return (
    <section className="bg-[#080b12] px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1380px]">
        <SectionTransition className="grid gap-7 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-amber-100/[0.54]">Compliance gap analysis</p>
            <h2 className="mt-5 text-4xl font-light leading-[1.02] tracking-[-0.055em] sm:text-6xl">A finding is only useful when the next action is obvious.</h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-white/[0.52] lg:justify-self-end">Each gap pairs the reason it matters with a concrete remediation. Regulation context stays visible, but ReguScan does not claim legal certainty.</p>
        </SectionTransition>

        <div className="mt-14 border-t border-white/10">
          {gaps.map((gap) => (
            <SectionTransition key={gap.title} className="grid gap-5 border-b border-white/[0.08] py-8 lg:grid-cols-[140px_0.9fr_1.1fr]">
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-amber-100/[0.62]">{gap.severity}</p>
                <p className="mt-3 text-[11px] leading-5 text-white/[0.32]">{gap.article}</p>
              </div>
              <div>
                <h3 className="text-2xl font-medium leading-tight tracking-[-0.035em]">{gap.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/[0.46]">{gap.explanation}</p>
              </div>
              <div className="border-l border-white/[0.08] pl-5 lg:pl-8">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-100/[0.54]">Recommended fix</p>
                <p className="mt-3 text-sm leading-6 text-white/[0.68]">{gap.fix}</p>
              </div>
            </SectionTransition>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReportAssemblySection() {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <DynamicGrid className="opacity-45" />
      <div className="relative mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <SectionTransition>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100/[0.54]">Report generation</p>
          <h2 className="mt-5 text-4xl font-light leading-[1.02] tracking-[-0.055em] sm:text-6xl">Fragments become a review dossier.</h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/[0.52]">The score is the summary, not the evidence. Scan quality, detected systems, gaps, article context, and remediation remain available underneath it.</p>
          <div className="mt-8 max-w-md"><ReportFragments /></div>
        </SectionTransition>

        <SectionTransition>
          <GlassCommandPanel className="p-5 sm:p-7">
            <div className="flex flex-col gap-6 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/[0.18] bg-emerald-200/[0.055] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-100/[0.72]"><FileCheck2 className="h-3 w-3" /> dossier ready</span>
                <h3 className="mt-5 text-3xl font-light tracking-[-0.05em]">acme.ai / compliance review</h3>
                <p className="mt-2 text-sm text-white/[0.38]">Generated from public evidence · manual review advised</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-7xl font-light tracking-[-0.08em] text-white">72</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber-100/[0.62]">readiness · needs work</p>
              </div>
            </div>
            <div className="grid gap-px overflow-hidden rounded-xl bg-white/[0.08] sm:grid-cols-3 mt-6">
              {[["4", "AI systems"], ["3", "priority gaps"], ["Medium", "crawl confidence"]].map(([value, label]) => (
                <div key={label} className="bg-[#080e18] p-5">
                  <p className="text-2xl font-light tracking-[-0.04em]">{value}</p>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/sample-report" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-cyan-200 px-5 text-xs font-semibold text-[#061019] transition hover:bg-white">Open sample dossier <ArrowRight className="h-3.5 w-3.5" /></Link>
              <span className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-5 text-xs text-white/40">HTML export after scan</span>
            </div>
          </GlassCommandPanel>
        </SectionTransition>
      </div>
    </section>
  );
}

function VideoSection() {
  return (
    <section id="demo" className="border-y border-white/[0.07] bg-[#03060b] px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1380px]">
        <SectionTransition className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100/[0.54]">Live product scene</p>
            <h2 className="mt-5 max-w-4xl text-4xl font-light leading-[1.02] tracking-[-0.055em] sm:text-6xl">Watch a website become an evidence trail.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/[0.46]">The player is ready for the final product recording. Today, the built-in scan scene demonstrates the real crawl-to-report sequence without a broken media reference.</p>
        </SectionTransition>
        <DemoVideoModal />
      </div>
    </section>
  );
}

function CommandCenterSection() {
  return (
    <section id="command-center" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1380px]">
        <SectionTransition className="grid gap-7 lg:grid-cols-[0.9fr_0.6fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100/[0.54]">Dashboard command center</p>
            <h2 className="mt-5 text-4xl font-light leading-[1.02] tracking-[-0.055em] sm:text-6xl">Calm enough to review. Dense enough to act.</h2>
          </div>
          <p className="text-base leading-7 text-white/50">The signed-in workspace puts current scans, evidence quality, priority gaps, and report actions ahead of decoration.</p>
        </SectionTransition>

        <SectionTransition className="mt-12">
          <GlassCommandPanel className="p-3 sm:p-4">
            <div className="grid min-h-[620px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#060b13] lg:grid-cols-[210px_1fr]">
              <aside className="hidden border-r border-white/[0.08] p-4 lg:flex lg:flex-col">
                <p className="text-base font-semibold tracking-[-0.03em]">Regu<span className="text-cyan-200">Scan</span></p>
                <nav className="mt-8 space-y-1 text-xs text-white/[0.42]">
                  {["Overview", "Websites", "Reports", "Settings"].map((item, index) => <span key={item} className={`block rounded-lg px-3 py-2.5 ${index === 0 ? "bg-cyan-200/[0.08] text-cyan-100" : ""}`}>{item}</span>)}
                </nav>
                <div className="mt-auto border-t border-white/[0.08] pt-4"><RiskPulse tone="emerald" label="system operational" /></div>
              </aside>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/[0.32]">Review workspace</p><h3 className="mt-2 text-2xl font-light tracking-[-0.04em]">AI risk operations</h3></div>
                  <span className="rounded-full border border-emerald-200/[0.16] bg-emerald-200/[0.045] px-3 py-1.5 text-[10px] text-emerald-100/[0.68]">Latest scan complete</span>
                </div>
                <div className="mt-6 grid gap-px overflow-hidden rounded-xl bg-white/[0.08] sm:grid-cols-4">
                  {[["72", "readiness"], ["4", "systems"], ["3", "priority gaps"], ["Medium", "crawl confidence"]].map(([value, label]) => <div key={label} className="bg-[#080e18] p-4"><p className="text-2xl font-light tracking-[-0.04em]">{value}</p><p className="mt-1 font-mono text-[8px] uppercase tracking-[0.13em] text-white/[0.28]">{label}</p></div>)}
                </div>
                <div className="mt-5 grid gap-4 xl:grid-cols-[0.68fr_1.32fr]">
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"><ComplianceRadar score={72} /></div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4">
                    <EvidenceBeacon label="High priority" value="Chatbot disclosure · Art. 50" state="warning" />
                    <EvidenceBeacon label="Review required" value="Recruitment screening language" state="warning" />
                    <EvidenceBeacon label="Confirmed signal" value="Generated content metadata" state="verified" />
                    <EvidenceBeacon label="Coverage caveat" value="2 blocked pages" state="warning" />
                  </div>
                </div>
              </div>
            </div>
          </GlassCommandPanel>
        </SectionTransition>
      </div>
    </section>
  );
}

function AudienceSection() {
  return (
    <section className="border-y border-white/[0.07] bg-[#080b12] px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[0.64fr_1.36fr]">
        <SectionTransition>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100/[0.54]">Who it is for</p>
          <h2 className="mt-5 text-4xl font-light leading-[1.02] tracking-[-0.055em] sm:text-5xl">One evidence layer. Different review questions.</h2>
        </SectionTransition>
        <div className="border-t border-white/10">
          {roles.map(([role, outcome], index) => (
            <SectionTransition key={role} className="grid gap-3 border-b border-white/[0.08] py-5 sm:grid-cols-[60px_0.55fr_1fr_30px] sm:items-center">
              <span className="font-mono text-[9px] text-white/[0.24]">0{index + 1}</span>
              <span className="flex items-center gap-3 text-lg font-medium"><BriefcaseBusiness className="h-4 w-4 text-cyan-200/[0.58]" />{role}</span>
              <span className="text-sm text-white/[0.46]">{outcome}</span>
              <ChevronRight className="hidden h-4 w-4 text-white/[0.24] sm:block" />
            </SectionTransition>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPreviewSection() {
  return (
    <section className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1380px]">
        <SectionTransition className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100/[0.54]">Pricing</p><h2 className="mt-5 max-w-4xl text-4xl font-light leading-[1.02] tracking-[-0.055em] sm:text-6xl">Start with evidence. Scale when the workflow is ready.</h2></div>
          <Link href="/pricing" className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-white/[0.12] px-5 text-xs font-medium text-white/[0.68] transition hover:border-white/[0.24] hover:text-white">Compare every plan <ArrowRight className="h-3.5 w-3.5" /></Link>
        </SectionTransition>
        <div className="mt-12 border-t border-white/10">
          {planPreview.map(([name, price, websites, scans, state], index) => (
            <SectionTransition key={name} className="grid gap-4 border-b border-white/[0.08] py-6 sm:grid-cols-[50px_0.7fr_0.8fr_1fr_1fr_0.7fr] sm:items-center">
              <span className="font-mono text-[9px] text-white/[0.24]">0{index + 1}</span><h3 className="text-xl font-medium">{name}</h3><p className="text-2xl font-light tracking-[-0.04em]">{price}</p><p className="text-xs text-white/[0.42]">{websites}</p><p className="text-xs text-white/[0.42]">{scans}</p><span className={`justify-self-start rounded-full border px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] ${state === "available" ? "border-emerald-200/[0.18] text-emerald-100/[0.64]" : state === "contact" ? "border-cyan-200/[0.18] text-cyan-100/[0.64]" : "border-white/10 text-white/[0.32]"}`}>{state}</span>
            </SectionTransition>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.07] bg-[#03060b] px-5 py-24 sm:px-8 sm:py-32">
      <DynamicGrid className="opacity-60" />
      <div className="relative mx-auto max-w-[1180px] text-center">
        <SectionTransition>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-200/[0.16] bg-amber-200/[0.04] px-4 py-2 text-[10px] text-amber-100/[0.62]"><AlertTriangle className="h-3.5 w-3.5" /> Technical guidance, not legal advice</div>
          <h2 className="mx-auto mt-8 max-w-5xl text-5xl font-light leading-[0.98] tracking-[-0.065em] sm:text-7xl">Know what your website says about AI before someone else asks.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/[0.52]">Run a first-pass scan, inspect the evidence, and give product, compliance, and legal teams the same starting point.</p>
          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 sm:flex-row sm:items-center">
            <div className="flex min-h-12 flex-1 items-center gap-3 rounded-xl px-4 text-left font-mono text-xs text-white/[0.34]"><Globe2 className="h-4 w-4 text-cyan-200/[0.54]" />https://yourcompany.com</div>
            <SignUpButton mode="modal"><button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-200 px-6 text-sm font-semibold text-[#061019] transition hover:bg-white">Scan Your Website <ArrowRight className="h-4 w-4" /></button></SignUpButton>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#03060b] px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-[1380px] gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div><p className="text-xl font-semibold tracking-[-0.04em]">Regu<span className="text-cyan-200">Scan</span></p><p className="mt-3 max-w-md text-xs leading-5 text-white/[0.32]">Evidence-led website scanning for EU AI Act readiness. Technical compliance guidance only.</p></div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/[0.42]">
          <Link href="/sample-report" className="hover:text-white">Sample report</Link><Link href="/pricing" className="hover:text-white">Pricing</Link><Link href="/docs" className="hover:text-white">Docs</Link><Link href="/security" className="hover:text-white">Security</Link><Link href="mailto:sales@reguscan.com" className="hover:text-white">Contact</Link>
        </nav>
      </div>
      <div className="mx-auto mt-8 flex max-w-[1380px] flex-col gap-3 border-t border-white/[0.06] pt-5 font-mono text-[9px] uppercase tracking-[0.13em] text-white/[0.22] sm:flex-row sm:items-center sm:justify-between"><span>© 2026 ReguScan</span><span>Evidence before score · Review before certainty</span></div>
    </footer>
  );
}

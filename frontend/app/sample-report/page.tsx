import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle, FileText, MapPin, Search, Shield } from "lucide-react";
import { DynamicGrid } from "@/components/landing/CinematicPrimitives";

const evidenceRows = [
  ["Found on", "/pricing"],
  ["Signal", "intercomSettings"],
  ["Source", "DOM/script pattern"],
  ["Risk", "Limited"],
  ["Article", "Art. 50"],
  ["Confidence", "80%"],
];

const gaps = [
  {
    code: "Art. 50",
    title: "Chatbot transparency disclosure missing",
    severity: "high",
    fix: "Add a visible notice before or beside the chat launcher explaining that users are interacting with an AI-enabled assistant.",
  },
  {
    code: "Art. 13",
    title: "Insufficient explanation of AI-assisted recommendation logic",
    severity: "medium",
    fix: "Publish a short product note explaining what inputs influence recommendations and how users can request support.",
  },
  {
    code: "Art. 9",
    title: "Risk-management documentation not visible",
    severity: "medium",
    fix: "Keep an internal owner, review cadence, and incident path for AI features before expanding into high-impact workflows.",
  },
];

const evidenceFlow = [
  { label: "Signal captured", value: "intercomSettings", icon: Search },
  { label: "Risk classified", value: "Limited / 80%", icon: Shield },
  { label: "Obligation mapped", value: "EU AI Act Art. 50", icon: FileText },
];

export default function SampleReportPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-reguscan-deep px-5 py-8 text-white sm:px-8">
      <DynamicGrid className="opacity-45" />
      <div className="relative mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-white/[0.52] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to homepage
        </Link>

        <header className="border-y border-white/10 py-8 sm:py-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 font-mono text-xs uppercase tracking-[0.16em] text-white/[0.34]">
            <span>Public sample dossier</span>
            <span>Evidence preview / RS-001</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200/[0.64]">Finding overview</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-light leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                One chatbot signal, traced from page evidence to a reviewable obligation.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-white/[0.58] sm:text-lg">
                ReguScan detected an Intercom-style chatbot on the pricing page through a DOM/widget signal. Chatbots may
                require transparency disclosure under EU AI Act Article 50.
              </p>
            </div>

            <div className="border-l border-amber-300/[0.24] pl-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/[0.34]">Compliance score</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-7xl font-light leading-none tracking-[-0.07em] text-amber-300">72</span>
                <span className="pb-1 text-sm text-white/[0.34]">/ 100</span>
              </div>
              <div className="mt-5 h-px bg-gradient-to-r from-amber-300/70 via-amber-300/20 to-transparent" />
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-amber-100">
                <AlertTriangle className="h-4 w-4" /> Review transparency gaps
              </p>
            </div>
          </div>
        </header>

        <section className="border-b border-white/10 py-8" aria-label="Evidence flow">
          <ol className="grid gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
            {evidenceFlow.map(({ label, value, icon: Icon }, index) => (
              <li key={label} className="contents">
                <div className="flex items-start gap-4 py-2">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-cyan-100">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.32]">{label}</p>
                    <p className="mt-2 font-mono text-sm text-white/[0.76]">{value}</p>
                  </div>
                </div>
                {index < evidenceFlow.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 text-white/20 md:block" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1.28fr)_minmax(300px,0.72fr)]">
          <section aria-labelledby="evidence-ledger-title">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/[0.34]">Source ledger</p>
                <h2 id="evidence-ledger-title" className="mt-3 text-3xl font-light tracking-[-0.045em]">
                  Evidence before interpretation.
                </h2>
              </div>
              <Search className="hidden h-6 w-6 text-cyan-200 sm:block" />
            </div>

            <dl className="border-y border-white/10">
              {evidenceRows.map(([label, value], index) => (
                <div
                  key={label}
                  className="grid grid-cols-[42px_110px_1fr] items-center gap-3 border-b border-white/[0.08] py-4 last:border-b-0 sm:grid-cols-[54px_150px_1fr]"
                >
                  <dt className="font-mono text-xs text-white/[0.22]">0{index + 1}</dt>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/[0.34]">{label}</dt>
                  <dd className="break-words font-mono text-sm font-medium text-white/[0.78]">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 border-l-2 border-cyan-200/[0.48] pl-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/[0.58]">Interpretation note</p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/[0.54]">
                The page includes a chat widget configuration object and support copy that suggests automated user
                interaction. ReguScan classifies this as limited risk and maps it to transparency obligations for review.
              </p>
            </div>
          </section>

          <aside className="border-l border-white/10 pl-6 lg:sticky lg:top-8 lg:h-fit lg:pl-8" aria-labelledby="system-title">
            <div className="flex items-center justify-between gap-4">
              <Shield className="h-6 w-6 text-cyan-200" />
              <span className="risk-badge-limited rounded-full px-2.5 py-1 text-xs font-bold uppercase">Limited</span>
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-white/[0.32]">Detected AI system</p>
            <h2 id="system-title" className="mt-3 text-3xl font-light leading-tight tracking-[-0.045em]">
              Customer support chatbot
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/50">
              A public-facing assistant with a strong widget signal and enough evidence to trigger an Article 50
              transparency review.
            </p>

            <div className="mt-8 space-y-5 border-y border-white/10 py-6">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-white/[0.34]">Confidence</span>
                <span className="font-mono font-semibold text-cyan-100">80%</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-white/[0.34]">Risk tier</span>
                <span className="font-semibold text-cyan-100">Limited</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-white/[0.34]">Mapped article</span>
                <span className="font-mono font-semibold text-white/[0.74]">Art. 50</span>
              </div>
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm text-white/[0.46]">
              <MapPin className="h-4 w-4 text-cyan-200" /> /pricing
            </p>
          </aside>
        </div>

        <section className="border-t border-white/10 py-16" aria-labelledby="gaps-title">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="font-mono text-sm text-cyan-200/[0.56]">REMEDIATION / 03 ITEMS</p>
              <h2 id="gaps-title" className="mt-4 text-3xl font-light leading-tight tracking-[-0.045em] sm:text-4xl">
                Compliance gaps ordered for human review.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-white/[0.48] lg:justify-self-end">
              Each item keeps the regulatory reference beside a concrete action, so reviewers can challenge the finding
              without losing its source context.
            </p>
          </div>

          <div className="mt-10 border-y border-white/10">
            {gaps.map((gap, index) => (
              <article
                key={gap.code}
                className="grid gap-5 border-b border-white/[0.08] py-8 last:border-b-0 lg:grid-cols-[70px_120px_minmax(220px,0.85fr)_minmax(300px,1.15fr)] lg:items-start"
              >
                <span className="font-mono text-sm text-white/[0.24]">0{index + 1}</span>
                <div>
                  <span className="font-mono text-sm text-white/70">{gap.code}</span>
                  <p className={`mt-2 text-xs font-bold uppercase tracking-[0.14em] severity-${gap.severity}`}>
                    {gap.severity}
                  </p>
                </div>
                <h3 className="text-xl font-medium leading-7 tracking-[-0.025em]">{gap.title}</h3>
                <div className="border-l border-emerald-200/[0.24] pl-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200/60">Recommended fix</p>
                  <p className="mt-3 text-sm leading-6 text-white/[0.54]">{gap.fix}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="mb-4 grid gap-5 border-y border-emerald-300/[0.16] bg-emerald-300/[0.035] px-5 py-6 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <CheckCircle className="h-6 w-6 text-emerald-300" />
          <p className="max-w-3xl text-sm leading-6 text-white/[0.62]">
            This sample demonstrates the report structure. ReguScan provides technical compliance guidance and evidence
            collection. It is not legal advice.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-100 transition hover:text-white">
            View operating plans <ArrowRight className="h-4 w-4" />
          </Link>
        </footer>
      </div>
    </main>
  );
}

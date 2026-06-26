import Link from "next/link";
import { ArrowLeft, CheckCircle, FileText, MapPin, Search, Shield } from "lucide-react";
import AnimatedComplianceBackground from "@/components/AnimatedComplianceBackground";

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

export default function SampleReportPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-reguscan-deep px-5 py-8 text-white sm:px-8">
      <AnimatedComplianceBackground className="opacity-35" />
      <div className="relative mx-auto max-w-6xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/52 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to homepage
        </Link>

        <header className="command-card mb-6 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/62">Public sample report</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_220px]">
            <div>
              <h1 className="text-4xl font-black tracking-normal">Evidence-based AI compliance report</h1>
              <p className="mt-4 max-w-3xl leading-7 text-white/58">
                ReguScan detected an Intercom-style chatbot on the pricing page through a DOM/widget signal. Chatbots may require transparency disclosure under EU AI Act Article 50.
              </p>
            </div>
            <div className="rounded-lg border border-amber-300/18 bg-amber-300/10 p-5 text-center">
              <p className="text-6xl font-black text-amber-300">72</p>
              <p className="mt-1 text-sm text-white/48">Compliance score</p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <section className="command-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Search className="h-5 w-5 text-cyan-200" /> Evidence table
            </h2>
            <div className="space-y-3">
              {evidenceRows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[110px_1fr] rounded-lg border border-white/8 bg-white/[0.035] px-3 py-2 text-sm">
                  <span className="text-white/36">{label}</span>
                  <span className="font-medium text-white/78">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="command-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Shield className="h-5 w-5 text-cyan-200" /> Detected AI systems
            </h2>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold">Customer support chatbot</h3>
                <span className="risk-badge-limited rounded-full px-2.5 py-1 text-xs font-bold uppercase">Limited</span>
                <span className="rounded-full bg-white/[0.055] px-2.5 py-1 text-xs text-white/45">80% confidence</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/58">
                The page includes a chat widget configuration object and support copy that suggests automated user interaction. ReguScan classifies this as limited risk and maps it to transparency obligations for review.
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm text-white/48">
                <MapPin className="h-4 w-4" /> /pricing
              </p>
            </div>
          </section>
        </div>

        <section className="mt-6 command-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <FileText className="h-5 w-5 text-cyan-200" /> Compliance gaps and recommended fixes
          </h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {gaps.map((gap) => (
              <div key={gap.code} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded bg-white/10 px-2 py-1 font-mono text-xs text-white/62">{gap.code}</span>
                  <span className={`text-xs font-bold uppercase severity-${gap.severity}`}>{gap.severity}</span>
                </div>
                <h3 className="font-bold">{gap.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/55">{gap.fix}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-emerald-300/16 bg-emerald-300/[0.06] p-5">
          <p className="flex items-start gap-3 text-sm leading-6 text-white/62">
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-300" />
            This sample demonstrates the report structure. ReguScan provides technical compliance guidance and evidence collection. It is not legal advice.
          </p>
        </section>
      </div>
    </main>
  );
}

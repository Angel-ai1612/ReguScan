import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Shield, Zap, FileText, AlertTriangle, Check, ArrowRight } from "lucide-react";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-[#0a0818] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-indigo-400" />
          <span className="font-bold text-xl tracking-tight">ReguScan</span>
        </div>
        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors">
              Start free →
            </button>
          </SignUpButton>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-24 pb-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-8">
          <AlertTriangle className="w-3.5 h-3.5" />
          EU AI Act high-risk obligations enforceable August 2, 2026
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
          AI compliance scanner for{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            EU AI Act readiness
          </span>
        </h1>

        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          ReguScan helps SaaS teams, startups, agencies, and AI-enabled businesses scan public websites, detect AI features, classify
          EU AI Act risk, and generate evidence-based remediation guidance in minutes.
          Fines reach <span className="text-white font-semibold">€35M or 7% of global turnover</span>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <SignUpButton mode="modal">
            <button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02]">
              Scan your site free <ArrowRight className="w-5 h-5" />
            </button>
          </SignUpButton>
          <p className="text-white/40 text-sm">No credit card · 1 free scan</p>
        </div>

        {/* Score mockup */}
        <div className="mt-20 relative mx-auto max-w-3xl">
          <div className="glass-card p-8 text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/40 text-sm mb-1">Compliance Score</p>
                <p className="text-white/40 text-xs">example.com</p>
              </div>
              <div className="text-right">
                <div className="text-6xl font-black text-orange-400">42</div>
                <div className="text-orange-400/60 text-sm">/ 100</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: "Critical", count: 2, color: "text-red-400" },
                { label: "High", count: 5, color: "text-orange-400" },
                { label: "Medium", count: 3, color: "text-yellow-400" },
                { label: "Low", count: 1, color: "text-green-400" },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 rounded-lg p-3 text-center">
                  <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
                  <div className="text-white/40 text-xs mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { code: "Art.50.1", text: "No AI chatbot disclosure on /pricing", sev: "high" },
                { code: "Art.9.1", text: "No risk management system documented", sev: "critical" },
                { code: "Art.14.1", text: "No human oversight mechanism for recruitment AI", sev: "critical" },
              ].map((gap) => (
                <div
                  key={gap.code}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5"
                >
                  <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/60">
                    {gap.code}
                  </span>
                  <span className="text-white/70 text-sm flex-1">{gap.text}</span>
                  <span
                    className={`text-xs font-semibold uppercase ${
                      gap.sev === "critical" ? "text-red-400" : "text-orange-400"
                    }`}
                  >
                    {gap.sev}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-24 max-w-7xl mx-auto border-t border-white/5">
        <h2 className="text-3xl font-bold text-center mb-16">
          Evidence-based AI compliance scanning for websites
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-5 h-5" />,
              title: "Website AI Detection",
              desc: "Find chatbot widgets, AI forms, scripts, page text, and workflow signals across public website pages.",
            },
            {
              icon: <Shield className="w-5 h-5" />,
              title: "EU AI Act Risk Assessment",
              desc: "Classify detected AI features as prohibited, high, limited, or minimal risk with reasoning and confidence.",
            },
            {
              icon: <FileText className="w-5 h-5" />,
              title: "Compliance Gap Analysis",
              desc: "Map each risk item to related obligations, why it matters, and a practical recommended fix.",
            },
            {
              icon: <AlertTriangle className="w-5 h-5" />,
              title: "Fine Exposure Estimate",
              desc: "See your maximum statutory exposure: up to €35M for prohibited AI, €15M for high-risk gaps.",
            },
            {
              icon: <Check className="w-5 h-5" />,
              title: "Compliance Report Generator",
              desc: "Produce an explainable report with page URLs, detection signals, risk reasoning, and remediation plans.",
            },
            {
              icon: <ArrowRight className="w-5 h-5" />,
              title: "AI Governance Workflow",
              desc: "Track websites, scan history, compliance scores, open gaps, and remediation progress in one dashboard.",
            },
          ].map((f) => (
            <div key={f.title} className="glass-card p-6">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO detail */}
      <section className="px-8 py-20 max-w-6xl mx-auto border-t border-white/5">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
          <div>
            <p className="text-indigo-300 text-sm font-medium mb-3">AI governance tool for real websites</p>
            <h2 className="text-3xl font-bold leading-tight mb-4">
              Turn website AI detection into an explainable EU AI Act compliance report.
            </h2>
            <p className="text-white/55 leading-relaxed">
              ReguScan is built for startups, SaaS companies, agencies, and businesses that use AI features but need a clearer way to review public-facing risk before legal review.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "AI chatbot and assistant disclosures",
              "AI form and workflow signals",
              "Script, DOM, and page-text evidence",
              "EU AI Act risk category reasoning",
              "Article-level compliance gaps",
              "Readable remediation guidance",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4 text-white/70 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-8 py-24 max-w-5xl mx-auto border-t border-white/5">
        <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-white/50 text-center mb-16">Start free. Upgrade when you need more.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { plan: "Free", price: "$0", websites: "1 website", scans: "1 scan total", cta: "Start free" },
            { plan: "Starter", price: "$49/mo", websites: "3 websites", scans: "10 scans/mo", cta: "Get started" },
            { plan: "Pro", price: "$199/mo", websites: "10 websites", scans: "100 scans/mo", cta: "Go pro", highlight: true },
            { plan: "Enterprise", price: "$999/mo", websites: "Unlimited", scans: "Unlimited", cta: "Contact us" },
          ].map((tier) => (
            <div
              key={tier.plan}
              className={`glass-card p-6 ${tier.highlight ? "border-indigo-500/40 ring-1 ring-indigo-500/30" : ""}`}
            >
              {tier.highlight && (
                <span className="inline-block px-2 py-0.5 bg-indigo-500 rounded-full text-xs font-medium mb-3">
                  Popular
                </span>
              )}
              <div className="font-semibold text-lg mb-1">{tier.plan}</div>
              <div className="text-2xl font-bold mb-4">{tier.price}</div>
              <div className="space-y-2 mb-6">
                <p className="text-white/50 text-sm">{tier.websites}</p>
                <p className="text-white/50 text-sm">{tier.scans}</p>
              </div>
              <SignUpButton mode="modal">
                <button
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    tier.highlight
                      ? "bg-indigo-600 hover:bg-indigo-500"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {tier.cta}
                </button>
              </SignUpButton>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-8 py-8 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/40">
          <Shield className="w-4 h-4" />
          <span className="text-sm">ReguScan © 2026</span>
        </div>
        <p className="text-white/30 text-xs">
          Not legal advice. EU AI Act (Regulation 2024/1689).
        </p>
      </footer>
    </main>
  );
}

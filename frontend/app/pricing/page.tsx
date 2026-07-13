import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowLeft, ArrowRight, Check, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { DynamicGrid } from "@/components/landing/CinematicPrimitives";
import { StatusPill } from "@/components/ui/premium";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For a first-pass public website AI risk assessment.",
    features: ["1 website", "1 scan total", "Top evidence findings", "Web report preview"],
    cta: "Start Free Scan",
    active: true,
  },
  {
    name: "Starter",
    price: "$49/mo",
    description: "For small teams that need repeatable AI compliance scanner coverage.",
    features: ["3 websites", "10 scans/month", "Full gap analysis", "Email alerts planned"],
    cta: "Coming Soon",
  },
  {
    name: "Pro",
    price: "$199/mo",
    description: "For SaaS teams running ongoing EU AI Act compliance checks.",
    features: ["10 websites", "100 scans/month", "Report templates", "API access planned"],
    cta: "Coming Soon",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams that need AI governance platform workflows and custom review support.",
    features: ["Unlimited websites", "Team controls", "White-label reports", "Custom review support"],
    cta: "Contact Sales",
  },
];

const purchaseSteps = [
  {
    number: "01",
    title: "Start with evidence",
    copy: "Run the free scan against one public website and review the evidence before choosing a larger operating model.",
  },
  {
    number: "02",
    title: "Match the review cadence",
    copy: "Starter and Pro describe the intended website and scan allowances for teams that need recurring coverage.",
  },
  {
    number: "03",
    title: "Checkout stays gated",
    copy: "Paid activation remains unavailable until the full upgrade and plan-activation path is verified end to end.",
  },
];

export default function PricingPage() {
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

        <header className="border-y border-white/10 py-10 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/[0.64]">
                Pricing / operating model
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-light leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                Start with one scan. Scale when the evidence becomes an operating rhythm.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/[0.58] sm:text-lg">
                Four clear levels of coverage, from a first public-site review to a custom governance workflow. The free
                path is available now; paid checkout remains deliberately gated.
              </p>
            </div>

            <aside className="border-l border-cyan-200/20 pl-6 sm:pl-8">
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-200/[0.08] text-cyan-100">
                  <CreditCard className="h-5 w-5" />
                </span>
                <StatusPill tone="cyan">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Checkout truth
                </StatusPill>
              </div>
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/[0.36]">Current billing state</p>
              <p className="mt-3 text-2xl font-medium tracking-[-0.03em]">Free scan live. Paid activation paused.</p>
              <p className="mt-3 text-sm leading-6 text-white/[0.52]">
                ReguScan will not present an active paid checkout until payment and plan activation are verified end to end.
              </p>
            </aside>
          </div>
        </header>

        <section className="py-16 sm:py-20" aria-labelledby="plan-matrix-title">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/[0.36]">Plan matrix</p>
              <h2 id="plan-matrix-title" className="mt-3 text-3xl font-light tracking-[-0.045em] sm:text-4xl">
                Choose by coverage, not by feature theatre.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/[0.46]">
              Each level describes a concrete website allowance, scan cadence, and report depth.
            </p>
          </div>

          <div className="border-y border-white/10">
            {plans.map((plan, index) => (
              <article
                key={plan.name}
                className={`relative grid gap-6 border-b border-white/[0.08] py-8 last:border-b-0 lg:grid-cols-[72px_minmax(180px,0.72fr)_minmax(200px,0.78fr)_minmax(280px,1.25fr)_190px] lg:items-center ${
                  plan.highlight ? "bg-cyan-200/[0.035]" : ""
                }`}
              >
                {plan.highlight && <div className="absolute inset-y-0 left-0 w-px bg-cyan-200/70" />}

                <div className="flex items-center justify-between lg:block">
                  <span className="font-mono text-sm text-white/[0.28]">0{index + 1}</span>
                  {plan.highlight && (
                    <StatusPill tone="cyan" className="lg:hidden">
                      <Sparkles className="h-3.5 w-3.5" /> Popular
                    </StatusPill>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-medium tracking-[-0.03em]">{plan.name}</h3>
                    {plan.highlight && (
                      <StatusPill tone="cyan" className="hidden lg:inline-flex">
                        <Sparkles className="h-3.5 w-3.5" /> Popular
                      </StatusPill>
                    )}
                  </div>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-white/[0.48]">{plan.description}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">Rate</p>
                  <p className="mt-2 text-3xl font-light tracking-[-0.045em] text-white">{plan.price}</p>
                  <p className="mt-2 text-xs text-white/[0.34]">
                    {plan.active ? "Available now" : plan.name === "Enterprise" ? "Scoped with sales" : "Checkout coming soon"}
                  </p>
                </div>

                <ul className="grid gap-x-5 gap-y-3 text-sm text-white/60 sm:grid-cols-2" aria-label={`${plan.name} features`}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="lg:justify-self-end">
                  {plan.active ? (
                    <SignUpButton mode="modal">
                      <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 lg:w-[180px]">
                        {plan.cta} <ArrowRight className="h-4 w-4" />
                      </button>
                    </SignUpButton>
                  ) : plan.name === "Enterprise" ? (
                    <Link
                      href="mailto:sales@reguscan.com?subject=ReguScan%20Enterprise"
                      className="inline-flex w-full items-center justify-center rounded-lg border border-white/[0.14] bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.075] lg:w-[180px]"
                    >
                      {plan.cta}
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex w-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.025] px-5 py-3 text-sm font-semibold text-white/[0.38] lg:w-[180px]"
                    >
                      {plan.cta}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-t border-white/10 py-16 lg:grid-cols-[0.68fr_1.32fr]" aria-labelledby="purchase-title">
          <div className="lg:sticky lg:top-10 lg:h-fit">
            <p className="font-mono text-sm text-cyan-200/[0.56]">OPERATING NOTE / 01</p>
            <h2 id="purchase-title" className="mt-4 text-3xl font-light leading-tight tracking-[-0.045em] sm:text-4xl">
              How access expands without pretending checkout is ready.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/[0.48]">
              The public plan architecture can be evaluated now. Money only enters the flow after the payment path is
              proven safe and complete.
            </p>
          </div>

          <ol className="border-l border-white/10">
            {purchaseSteps.map((step) => (
              <li key={step.number} className="grid gap-4 border-b border-white/[0.08] py-7 pl-6 last:border-b-0 sm:grid-cols-[64px_1fr] sm:pl-8">
                <span className="font-mono text-sm text-cyan-200/[0.58]">{step.number}</span>
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.025em]">{step.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="mb-4 flex flex-col gap-4 border-y border-amber-200/[0.16] bg-amber-200/[0.035] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-sm leading-6 text-white/60">
            ReguScan provides technical compliance guidance and is not a substitute for legal advice.
          </p>
          <Link href="/sample-report" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-100 transition hover:text-white">
            Inspect a sample report <ArrowRight className="h-4 w-4" />
          </Link>
        </footer>
      </div>
    </main>
  );
}

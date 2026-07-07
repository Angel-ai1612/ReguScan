import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowLeft, ArrowRight, Check, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import AnimatedComplianceBackground from "@/components/AnimatedComplianceBackground";
import { GlowCard, PageHeader, StatusPill } from "@/components/ui/premium";

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

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-reguscan-deep px-5 py-8 text-white sm:px-8">
      <AnimatedComplianceBackground className="opacity-30" />
      <div className="relative mx-auto max-w-7xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/52 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to homepage
        </Link>

        <PageHeader
          eyebrow="Pricing"
          title="Start free. Upgrade only when billing is fully configured."
          description="ReguScan has plan and usage UI, but paid Razorpay checkout is intentionally shown as coming soon on the public page until keys, webhooks, and activation flows are verified."
          actions={
            <StatusPill tone="cyan">
              <ShieldCheck className="h-3.5 w-3.5" />
              No false checkout promises
            </StatusPill>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <GlowCard key={plan.name} className="flex min-h-[420px] flex-col p-6" accent={plan.highlight ? "cyan" : "slate"}>
              <div className="relative z-10 flex items-start justify-between gap-4">
                <CreditCard className="h-5 w-5 text-cyan-200" />
                {plan.highlight && (
                  <StatusPill tone="cyan">
                    <Sparkles className="h-3.5 w-3.5" />
                    Popular
                  </StatusPill>
                )}
              </div>
              <h2 className="relative z-10 mt-5 text-xl font-black tracking-normal">{plan.name}</h2>
              <p className="relative z-10 mt-2 text-4xl font-black">{plan.price}</p>
              <p className="relative z-10 mt-3 text-sm leading-6 text-white/50">{plan.description}</p>
              <div className="relative z-10 mt-6 flex-1 space-y-3 text-sm text-white/60">
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
                  className="relative z-10 mt-8 inline-flex items-center justify-center rounded-lg border border-white/12 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.075]"
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

        <GlowCard className="mt-6 p-5" accent="amber">
          <p className="relative z-10 text-sm leading-6 text-white/62">
            ReguScan provides technical compliance guidance and is not a substitute for legal advice.
          </p>
        </GlowCard>
      </div>
    </main>
  );
}

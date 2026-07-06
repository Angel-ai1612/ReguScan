import Link from "next/link";
import { ArrowLeft, Check, CreditCard } from "lucide-react";
import AnimatedComplianceBackground from "@/components/AnimatedComplianceBackground";

const plans = [
  ["Free", "$0", "1 website", "1 scan total", "Local MVP ready"],
  ["Starter", "$49/mo", "3 websites", "10 scans/month", "Coming soon"],
  ["Pro", "$199/mo", "10 websites", "100 scans/month", "Coming soon"],
  ["Enterprise", "Custom", "Unlimited", "Team controls", "Coming soon"],
];

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-reguscan-deep px-5 py-8 text-white sm:px-8">
      <AnimatedComplianceBackground className="opacity-30" />
      <div className="relative mx-auto max-w-6xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/52 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to homepage
        </Link>
        <header className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/62">Pricing</p>
          <h1 className="mt-3 text-4xl font-black tracking-normal">Billing is designed in, but optional for the local MVP.</h1>
          <p className="mt-4 leading-7 text-white/58">
            The product has plan and usage UI, with Razorpay checkout test wiring available only when backend keys and webhooks are configured.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map(([name, price, websites, scans, status]) => (
            <div key={name} className="command-card p-6">
              <CreditCard className="h-5 w-5 text-cyan-200" />
              <h2 className="mt-4 text-xl font-bold">{name}</h2>
              <p className="mt-2 text-3xl font-black">{price}</p>
              <div className="mt-5 space-y-2 text-sm text-white/58">
                {[websites, scans].map((feature) => (
                  <p key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-300" /> {feature}
                  </p>
                ))}
              </div>
              <div className="mt-6 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-center text-xs text-white/48">
                {status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

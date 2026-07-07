"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { billingApi, type RazorpayOrder } from "@/lib/api";
import { Check, CreditCard, Loader, ShieldCheck, User, Zap } from "lucide-react";
import { toast } from "sonner";
import { GlowCard, MetricCard, PageHeader, ProgressBar, StatusPill } from "@/components/ui/premium";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: ["1 website", "1 scan total", "Top 3 gaps only", "Web report"],
    cta: "Current plan",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$49/mo",
    features: ["3 websites", "10 scans/month", "Full gap analysis", "PDF reports coming soon", "Email alerts"],
    cta: "Upgrade with Razorpay",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$199/mo",
    features: ["10 websites", "100 scans/month", "Full templates", "API access coming soon", "Priority support"],
    cta: "Upgrade with Razorpay",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited websites", "Unlimited scans", "White-label reports", "Dedicated support"],
    cta: "Contact us",
  },
];

export default function SettingsPage() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { data: usage, isLoading } = useQuery({
    queryKey: ["usage"],
    queryFn: billingApi.usage,
  });

  const orderMutation = useMutation({
    mutationFn: (plan: string) => billingApi.createOrder(plan),
    onSuccess: (order) => openRazorpayCheckout(order),
    onError: () => toast.error("Razorpay checkout is not configured yet"),
  });

  const verifyMutation = useMutation({
    mutationFn: billingApi.verifyPayment,
    onSuccess: async () => {
      toast.success("Payment verified. Plan activates after Razorpay webhook confirmation.");
      await queryClient.invalidateQueries({ queryKey: ["usage"] });
    },
    onError: () => toast.error("Payment signature verification failed"),
  });

  async function openRazorpayCheckout(order: RazorpayOrder) {
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      toast.error("Could not load Razorpay checkout");
      return;
    }

    const checkout = new window.Razorpay({
      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      name: "ReguScan",
      description: `${order.plan} monthly plan`,
      order_id: order.order_id,
      prefill: {
        name: user?.fullName ?? "",
        email: user?.primaryEmailAddress?.emailAddress ?? "",
      },
      handler: (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => verifyMutation.mutate(response),
      theme: { color: "#67e8f9" },
    });
    checkout.open();
  }

  const scanUsed = usage?.scan_limit_scope === "total" ? usage.scans_used_total : usage?.scans_used_this_month ?? usage?.scans_used ?? 0;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Settings"
        title="Account and billing control center"
        description="Manage your profile, current plan, scan usage, and gated Razorpay upgrade flow from one place."
        actions={
          <StatusPill tone={usage?.billing_available ? "emerald" : "amber"}>
            <ShieldCheck className="h-3.5 w-3.5" />
            {usage?.billing_available ? "Billing available" : "Checkout gated"}
          </StatusPill>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <GlowCard className="p-6" accent="slate">
          <div className="relative z-10 flex items-center gap-4">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="" className="h-14 w-14 rounded-lg border border-white/10" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055]">
                <User className="h-5 w-5 text-white/40" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-xl font-black tracking-normal">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="mt-1 truncate text-sm text-white/42">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>
        </GlowCard>

        <GlowCard className="overflow-hidden p-6" accent="cyan">
          <div className="scan-beam" />
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/34">Current usage</p>
              <h2 className="mt-2 text-2xl font-black capitalize tracking-normal">{usage?.plan ?? "free"} plan</h2>
              <p className="mt-2 text-sm leading-6 text-white/50">
                {isLoading ? "Loading billing state..." : usage?.subscription_status.replace(/_/g, " ") ?? "free access"}
              </p>
            </div>
            {usage?.payment_status?.includes("pending") && <StatusPill tone="amber">Payment pending webhook</StatusPill>}
          </div>

          {!isLoading && usage && (
            <div className="relative z-10 mt-6 grid gap-4 sm:grid-cols-2">
              <UsageMeter label="Websites" used={usage.websites_used} limit={usage.websites_limit} />
              <UsageMeter label={usage.scan_limit_scope === "total" ? "Scans total" : "Scans this month"} used={scanUsed} limit={usage.scans_limit} />
            </div>
          )}
        </GlowCard>
      </div>

      {!isLoading && usage && (
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Websites used" value={usage.websites_used} sub={`limit ${usage.websites_limit === -1 ? "unlimited" : usage.websites_limit}`} icon={CreditCard} tone="cyan" />
          <MetricCard label="Scans used" value={scanUsed} sub={`limit ${usage.scans_limit === -1 ? "unlimited" : usage.scans_limit}`} icon={Zap} tone="amber" />
          <MetricCard label="Remaining scans" value={usage.remaining_scans === -1 ? "Unlimited" : usage.remaining_scans} sub={usage.scan_limit_scope.replace(/_/g, " ")} icon={ShieldCheck} tone="emerald" />
          <MetricCard label="Billing state" value={usage.billing_available ? "Live" : "Gated"} sub="Razorpay checkout" icon={CreditCard} tone={usage.billing_available ? "emerald" : "amber"} />
        </div>
      )}

      {usage?.remaining_scans === 0 && usage.scans_limit !== -1 && (
        <GlowCard className="mt-6 p-4" accent="amber">
          <p className="relative z-10 text-sm text-orange-100">You have reached this plan's scan limit.</p>
        </GlowCard>
      )}

      <GlowCard className="mt-6 p-6" accent="slate">
        <div className="relative z-10 mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-normal">Plans</h2>
            <p className="mt-1 text-sm text-white/45">
              Paid upgrades show as coming soon unless Razorpay checkout is configured and exposed by the backend.
            </p>
          </div>
          <CreditCard className="h-5 w-5 text-cyan-200" />
        </div>

        <div className="relative z-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan) => {
            const isCurrent = usage?.plan === plan.id;
            const paidPlan = plan.id === "starter" || plan.id === "pro";
            const canUpgrade = paidPlan && Boolean(usage?.billing_available);
            return (
              <div
                key={plan.id}
                className={`rounded-lg border p-5 transition-colors ${
                  plan.highlight
                    ? "border-cyan-300/34 bg-cyan-300/[0.06]"
                    : "border-white/[0.08] bg-white/[0.025]"
                }`}
              >
                {plan.highlight && (
                  <StatusPill tone="cyan" className="mb-3">
                    <Zap className="h-3 w-3" /> Popular
                  </StatusPill>
                )}
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-lg font-black tracking-normal">{plan.name}</span>
                  <span className="font-bold text-white">{plan.price}</span>
                </div>
                <ul className="mb-5 mt-3 space-y-1.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-white/60">
                      <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-300" /> {feature}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={isCurrent || orderMutation.isPending || verifyMutation.isPending || !canUpgrade}
                  onClick={() => {
                    if (!isCurrent && canUpgrade) {
                      orderMutation.mutate(plan.id);
                    }
                  }}
                  className={`w-full rounded-lg py-2 text-sm font-semibold transition-colors ${
                    isCurrent
                      ? "cursor-default bg-emerald-300/14 text-emerald-200"
                      : plan.highlight
                        ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200 disabled:bg-cyan-300/30 disabled:text-white/42"
                        : "bg-white/[0.06] text-white/72 hover:bg-white/10 disabled:bg-white/[0.03] disabled:text-white/32"
                  }`}
                >
                  {orderMutation.isPending && canUpgrade ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" /> Opening Razorpay
                    </span>
                  ) : isCurrent ? (
                    "Current plan"
                  ) : canUpgrade ? (
                    plan.cta
                  ) : paidPlan ? (
                    "Coming soon"
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </GlowCard>
    </div>
  );
}

function UsageMeter({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = limit === -1 ? 0 : Math.min(100, (used / limit) * 100);
  const unlimited = limit === -1;
  return (
    <div>
      <div className="mb-2 flex justify-between gap-3 text-sm">
        <span className="text-white/60">{label}</span>
        <span className="font-medium text-white">
          {used} / {unlimited ? "unlimited" : limit}
        </span>
      </div>
      {!unlimited && <ProgressBar value={pct} tone={pct > 85 ? "rose" : pct > 60 ? "amber" : "cyan"} />}
    </div>
  );
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

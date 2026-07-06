"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billingApi, type RazorpayOrder } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { Check, CreditCard, Loader, Zap } from "lucide-react";
import { toast } from "sonner";

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
    features: ["Unlimited websites", "Unlimited scans", "White-label reports", "Dedicated Slack"],
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
      theme: { color: "#4f46e5" },
    });
    checkout.open();
  }

  return (
    <div className="max-w-4xl">
      <h1 className="mb-1 text-2xl font-bold">Settings</h1>
      <p className="mb-8 text-sm text-white/40">Account and billing</p>

      <div className="glass-card mb-6 p-6">
        <h2 className="mb-4 font-semibold">Profile</h2>
        <div className="flex items-center gap-4">
          {user?.imageUrl && (
            <img src={user.imageUrl} alt="" className="h-12 w-12 rounded-full" />
          )}
          <div>
            <p className="font-medium text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-white/40">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
      </div>

      {!isLoading && usage && (
        <div className="glass-card mb-6 p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-semibold">Current Usage</h2>
              <p className="mt-1 text-sm text-white/45">
                {usage.plan.toUpperCase()} plan - {usage.subscription_status.replace(/_/g, " ")}
              </p>
            </div>
            {usage.payment_status && usage.payment_status.includes("pending") && (
              <span className="rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-200">
                Payment pending webhook
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <UsageMeter
              label="Websites"
              used={usage.websites_used}
              limit={usage.websites_limit}
            />
            <UsageMeter
              label={usage.scan_limit_scope === "total" ? "Scans total" : "Scans this month"}
              used={usage.scans_used}
              limit={usage.scans_limit}
            />
          </div>
          {usage.remaining_scans === 0 && usage.scans_limit !== -1 && (
            <p className="mt-4 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-sm text-orange-100">
              You have reached this plan's scan limit.
            </p>
          )}
          {usage.plan !== "free" && (
            <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-white/54">
              Razorpay billing changes are handled through verified backend events.
            </p>
          )}
        </div>
      )}

      <div className="glass-card p-6">
        <h2 className="mb-6 flex items-center gap-2 font-semibold">
          <CreditCard className="h-5 w-5 text-indigo-400" /> Plans
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PLANS.map((plan) => {
            const isCurrent = usage?.plan === plan.id;
            const paidPlan = plan.id === "starter" || plan.id === "pro";
            const canUpgrade = paidPlan && Boolean(usage?.billing_available);
            return (
              <div
                key={plan.id}
                className={`rounded-xl border p-5 transition-colors ${
                  plan.highlight
                    ? "border-indigo-500/40 bg-indigo-500/5"
                    : "border-white/[0.08] bg-white/[0.02]"
                }`}
              >
                {plan.highlight && (
                  <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-indigo-500 px-2 py-0.5 text-xs font-medium">
                    <Zap className="h-3 w-3" /> Popular
                  </span>
                )}
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-lg font-semibold">{plan.name}</span>
                  <span className="font-bold text-white">{plan.price}</span>
                </div>
                <ul className="mb-5 mt-3 space-y-1.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-white/60">
                      <Check className="h-3.5 w-3.5 flex-shrink-0 text-green-400" /> {feature}
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
                  className={`w-full rounded-lg py-2 text-sm font-medium transition-colors ${
                    isCurrent
                      ? "cursor-default bg-green-500/20 text-green-400"
                      : plan.highlight
                        ? "bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40"
                        : "bg-white/[0.06] hover:bg-white/10 disabled:bg-white/[0.03]"
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
      </div>
    </div>
  );
}

function UsageMeter({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = limit === -1 ? 0 : Math.min(100, (used / limit) * 100);
  const unlimited = limit === -1;
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="text-white/60">{label}</span>
        <span className="font-medium text-white">
          {used} / {unlimited ? "unlimited" : limit}
        </span>
      </div>
      {!unlimited && (
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-all ${pct > 85 ? "bg-red-500" : pct > 60 ? "bg-orange-500" : "bg-indigo-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
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

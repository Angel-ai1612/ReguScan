"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { billingApi } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { CreditCard, Zap, Check, Loader, ExternalLink } from "lucide-react";
import { toast } from "sonner";

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
    features: ["3 websites", "10 scans/month", "Full gap analysis", "PDF reports", "Email alerts"],
    cta: "Upgrade to Starter",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$199/mo",
    features: ["10 websites", "100 scans/month", "Full templates", "API access", "Priority support"],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$999/mo",
    features: ["Unlimited websites", "Unlimited scans", "White-label reports", "Dedicated Slack"],
    cta: "Contact us",
  },
];

export default function SettingsPage() {
  const { user } = useUser();
  const { data: usage, isLoading } = useQuery({
    queryKey: ["usage"],
    queryFn: billingApi.usage,
  });

  const checkoutMutation = useMutation({
    mutationFn: (plan: string) => billingApi.checkout(plan),
    onSuccess: (data) => { window.location.href = data.url; },
    onError: () => toast.error("Failed to open checkout"),
  });

  const portalMutation = useMutation({
    mutationFn: billingApi.portal,
    onSuccess: (data) => { window.location.href = data.url; },
    onError: () => toast.error("No billing account found"),
  });

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-white/40 text-sm mb-8">Account and billing</p>

      {/* Profile */}
      <div className="glass-card p-6 mb-6">
        <h2 className="font-semibold mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          {user?.imageUrl && (
            <img src={user.imageUrl} alt="" className="w-12 h-12 rounded-full" />
          )}
          <div>
            <p className="text-white font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-white/40 text-sm">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
      </div>

      {/* Current usage */}
      {!isLoading && usage && (
        <div className="glass-card p-6 mb-6">
          <h2 className="font-semibold mb-4">Current Usage</h2>
          <div className="grid grid-cols-2 gap-4">
            <UsageMeter
              label="Websites"
              used={usage.websites_used}
              limit={usage.websites_limit}
            />
            <UsageMeter
              label="Scans this period"
              used={usage.scans_used}
              limit={usage.scans_limit}
            />
          </div>
          {usage.plan !== "free" && (
            <button
              onClick={() => portalMutation.mutate()}
              disabled={portalMutation.isPending}
              className="flex items-center gap-2 mt-4 px-4 py-2 bg-white/[0.06] hover:bg-white/10 rounded-lg text-sm transition-colors"
            >
              {portalMutation.isPending
                ? <Loader className="w-4 h-4 animate-spin" />
                : <ExternalLink className="w-4 h-4" />}
              Manage billing
            </button>
          )}
        </div>
      )}

      {/* Plans */}
      <div className="glass-card p-6">
        <h2 className="font-semibold mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-400" /> Plans
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = usage?.plan === plan.id;
            return (
              <div
                key={plan.id}
                className={`rounded-xl p-5 border transition-colors ${
                  plan.highlight
                    ? "border-indigo-500/40 bg-indigo-500/5"
                    : "border-white/[0.08] bg-white/[0.02]"
                }`}
              >
                {plan.highlight && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-500 rounded-full text-xs font-medium mb-3">
                    <Zap className="w-3 h-3" /> Popular
                  </span>
                )}
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-semibold text-lg">{plan.name}</span>
                  <span className="text-white font-bold">{plan.price}</span>
                </div>
                <ul className="space-y-1.5 mb-5 mt-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                      <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={isCurrent || checkoutMutation.isPending}
                  onClick={() => {
                    if (!isCurrent && plan.id !== "free" && plan.id !== "enterprise") {
                      checkoutMutation.mutate(plan.id);
                    }
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCurrent
                      ? "bg-green-500/20 text-green-400 cursor-default"
                      : plan.highlight
                      ? "bg-indigo-600 hover:bg-indigo-500"
                      : "bg-white/[0.06] hover:bg-white/10"
                  }`}
                >
                  {isCurrent ? "✓ Current plan" : plan.cta}
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
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-white/60">{label}</span>
        <span className="text-white font-medium">
          {used} / {unlimited ? "∞" : limit}
        </span>
      </div>
      {!unlimited && (
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${pct > 85 ? "bg-red-500" : pct > 60 ? "bg-orange-500" : "bg-indigo-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

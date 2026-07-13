"use client";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Clock,
  Globe,
  Loader,
  Plus,
  Radar,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { billingApi, scanApi, websiteApi, type Website } from "@/lib/api";
import { EmptyState, ErrorState, GlowCard, MetricCard, PageHeader, ProgressBar, RiskBadge, StatusPill, scoreTone } from "@/components/ui/premium";

const TIER_LABELS = ["prohibited", "high", "limited", "minimal"] as const;

export default function DashboardPage() {
  const [quickUrl, setQuickUrl] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: websites = [],
    isLoading: websitesLoading,
    isError: websitesError,
    refetch: refetchWebsites,
  } = useQuery({
    queryKey: ["websites"],
    queryFn: websiteApi.list,
  });

  const {
    data: usage,
    isLoading: usageLoading,
    isError: usageError,
  } = useQuery({
    queryKey: ["usage"],
    queryFn: billingApi.usage,
  });

  const quickScanMutation = useMutation({
    mutationFn: async () => {
      const website = await websiteApi.create({ url: quickUrl });
      const scan = await scanApi.trigger(website.id);
      return { website, scan };
    },
    onSuccess: async ({ scan }) => {
      setQuickUrl("");
      await queryClient.invalidateQueries({ queryKey: ["websites"] });
      toast.success("Scan started");
      router.push(`/dashboard/scans/${scan.id}`);
    },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? "Failed to start scan"),
  });

  const scoredWebsites = websites.filter((website) => website.compliance_score !== null);
  const avgScore =
    scoredWebsites.length > 0
      ? Math.round(scoredWebsites.reduce((sum, website) => sum + (website.compliance_score ?? 0), 0) / scoredWebsites.length)
      : null;

  const tierCounts = useMemo(
    () =>
      TIER_LABELS.map((tier) => ({
        tier,
        count: websites.filter((website) => website.overall_risk_tier === tier).length,
      })),
    [websites],
  );
  const totalTiered = tierCounts.reduce((sum, item) => sum + item.count, 0);
  const highAttention = tierCounts.find((item) => item.tier === "prohibited")!.count + tierCounts.find((item) => item.tier === "high")!.count;
  const recentWebsites = [...websites]
    .sort((a, b) => new Date(b.last_scan_at ?? b.created_at).getTime() - new Date(a.last_scan_at ?? a.created_at).getTime())
    .slice(0, 6);

  const deadline = new Date("2026-08-02T00:00:00Z");
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / 86_400_000);
  const scansUsed = usage?.scan_limit_scope === "total" ? usage.scans_used_total : usage?.scans_used_this_month ?? usage?.scans_used;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Command center"
        title="AI compliance operations dashboard"
        description="Monitor website AI detection, compliance score movement, scan usage, and open risk signals from one evidence-first workspace."
        actions={
          <Link
            href="/dashboard/websites?add=1"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
          >
            <Plus className="h-4 w-4" /> Add website
          </Link>
        }
      />

      {websitesError && (
        <ErrorState
          className="mb-6"
          title="Website data is unavailable"
          description="ReguScan could not load monitored websites. Scores and risk counts are hidden until the connection recovers."
          onRetry={() => void refetchWebsites()}
        />
      )}

      {daysLeft > 0 && daysLeft <= 90 && (
        <GlowCard className="mb-6 p-4" accent={highAttention > 0 ? "rose" : "amber"}>
          <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Clock className="h-5 w-5 flex-shrink-0 text-amber-200" />
            <p className="text-sm leading-6 text-white/70">
              <span className="font-semibold text-amber-200">{daysLeft} days</span> until EU AI Act high-risk obligations are enforceable on Aug 2, 2026.
              {highAttention > 0 && <span className="font-semibold text-rose-200"> {highAttention} site(s) need priority review.</span>}
            </p>
          </div>
        </GlowCard>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <GlowCard className="overflow-hidden p-5 sm:p-6" accent="cyan">
          {quickScanMutation.isPending && <div className="scan-beam" aria-hidden="true" />}
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <StatusPill tone="cyan">
                <Radar className="h-3.5 w-3.5" />
                Quick scan
              </StatusPill>
              <h2 className="mt-4 text-2xl font-black tracking-normal">Scan a public website</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/[0.52]">
                Add a website and start the crawl, detector, classifier, and report workflow in one step.
              </p>
            </div>
            <form
              className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl"
              onSubmit={(event) => {
                event.preventDefault();
                if (quickUrl && !quickScanMutation.isPending) quickScanMutation.mutate();
              }}
            >
              <label htmlFor="quick-scan-url" className="sr-only">Public website URL</label>
              <input
                id="quick-scan-url"
                type="url"
                inputMode="url"
                autoComplete="url"
                value={quickUrl}
                onChange={(event) => setQuickUrl(event.target.value)}
                placeholder="https://example.com"
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-300/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!quickUrl || quickScanMutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {quickScanMutation.isPending ? <Loader className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Start scan
              </button>
            </form>
          </div>
        </GlowCard>

        <GlowCard className="p-5 sm:p-6" accent="slate">
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/[0.34]">Current plan</p>
              <h2 className="mt-2 text-2xl font-black capitalize tracking-normal">
                {usageLoading ? "Loading plan" : usageError ? "Plan unavailable" : usage?.plan ?? "Free"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/[0.48]">
                {usageLoading
                  ? "Checking current usage and billing availability."
                  : usageError
                    ? "Usage limits are hidden until billing data reconnects."
                    : usage?.billing_available
                      ? "Paid checkout is available from settings."
                      : "Paid upgrades stay marked as coming soon until Razorpay is configured."}
              </p>
            </div>
            <StatusPill tone={usageError ? "amber" : usage?.billing_available ? "emerald" : "slate"}>
              {usageLoading ? "Checking" : usageError ? "Unavailable" : usage?.billing_available ? "Billing live" : "Billing gated"}
            </StatusPill>
          </div>
        </GlowCard>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricCard
          label="Websites monitored"
          value={websitesLoading || websitesError ? "-" : websites.length}
          sub={websitesError ? "Website data unavailable" : `of ${usage?.websites_limit === -1 ? "unlimited" : usage?.websites_limit ?? "?"} allowed`}
          icon={Globe}
          tone="cyan"
        />
        <MetricCard
          label="Avg compliance score"
          value={avgScore ?? "-"}
          sub={websitesError ? "Score data unavailable" : avgScore !== null ? (avgScore >= 85 ? "Good standing" : "Needs attention") : "No completed scans yet"}
          icon={TrendingUp}
          tone="indigo"
          valueClassName={scoreTone(avgScore)}
        />
        <MetricCard
          label="Priority risk"
          value={websitesLoading || websitesError ? "-" : highAttention}
          sub={websitesError ? "Risk data unavailable" : highAttention > 0 ? "Needs review" : "No urgent sites"}
          icon={AlertTriangle}
          tone={websitesError ? "slate" : highAttention > 0 ? "rose" : "emerald"}
        />
        <MetricCard
          label={usage?.scan_limit_scope === "total" ? "Scans total" : "Scans this month"}
          value={usageLoading || usageError ? "-" : scansUsed ?? "-"}
          sub={usageError ? "Usage data unavailable" : `limit ${usage?.scans_limit === -1 ? "unlimited" : usage?.scans_limit ?? "?"}`}
          icon={Shield}
          tone="amber"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <GlowCard className="p-5" accent="slate">
          <div className="relative z-10 mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black tracking-normal">Risk distribution</h2>
              <p className="mt-1 text-sm text-white/[0.42]">Across monitored websites with classified scans.</p>
            </div>
            <BarChart3 className="h-5 w-5 text-cyan-200" />
          </div>
          <div className="relative z-10 space-y-4">
            {websitesError ? (
              <p className="rounded-lg border border-amber-200/[0.12] bg-amber-200/[0.04] p-4 text-sm leading-6 text-amber-100/70">
                Risk distribution is unavailable until website data reconnects.
              </p>
            ) : websitesLoading ? (
              <p className="p-4 text-sm text-white/[0.42]" role="status">Loading risk distribution…</p>
            ) : tierCounts.map(({ tier, count }) => {
              const pct = totalTiered ? Math.round((count / totalTiered) * 100) : 0;
              const tone = tier === "prohibited" || tier === "high" ? "rose" : tier === "limited" ? "cyan" : "emerald";
              return (
                <div key={tier}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <RiskBadge tier={tier} />
                    <span className="text-sm text-white/[0.48]">{count} site(s)</span>
                  </div>
                  <ProgressBar value={pct} tone={tone} label={`${tier} risk websites`} />
                </div>
              );
            })}
          </div>
        </GlowCard>

        <GlowCard className="overflow-hidden" accent="slate">
          <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] p-5">
            <div>
              <h2 className="font-black tracking-normal text-white">Recent website scans</h2>
              <p className="mt-1 text-sm text-white/[0.42]">Latest monitored surfaces and their current review state.</p>
            </div>
            <Link href="/dashboard/websites" className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-200 hover:text-cyan-100">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {websitesError ? (
            <div className="relative z-10 p-8 text-center text-sm leading-6 text-amber-100/65" role="alert">
              Recent website scans could not be loaded.
            </div>
          ) : websitesLoading ? (
            <div className="relative z-10 p-8 text-center text-white/35">
              <Loader className="mx-auto h-5 w-5 animate-spin" />
            </div>
          ) : websites.length === 0 ? (
            <EmptyState
              icon={Globe}
              title="No websites yet"
              description="Add a public website to detect AI features and generate an explainable EU AI Act readiness report."
              action={
                <Link
                  href="/dashboard/websites?add=1"
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                >
                  <Plus className="h-4 w-4" /> Add website
                </Link>
              }
              className="m-5"
            />
          ) : (
            <div className="relative z-10 divide-y divide-white/[0.04]">
              {recentWebsites.map((site) => (
                <WebsiteRow key={site.id} site={site} />
              ))}
            </div>
          )}
        </GlowCard>
      </div>
    </div>
  );
}

function WebsiteRow({ site }: { site: Website }) {
  const score = site.compliance_score;
  const tier = site.overall_risk_tier ?? "unknown";
  const hostname = safeHostname(site.url);

  return (
    <Link href={`/dashboard/websites/${site.id}`} className="group flex items-center gap-4 p-4 transition hover:bg-white/[0.025]">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055]">
        {site.favicon_url ? <img src={site.favicon_url} alt="" className="h-5 w-5" /> : <Globe className="h-4 w-4 text-white/35" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{site.name ?? hostname}</p>
        <p className="truncate text-xs text-white/[0.34]">{site.url}</p>
      </div>
      <div className="hidden min-w-fit sm:block">
        <RiskBadge tier={tier} />
      </div>
      <div className="w-14 text-right">
        <span className={`text-xl font-black ${scoreTone(score)}`}>{score ?? "-"}</span>
      </div>
      <div className="hidden w-28 text-right text-xs text-white/[0.32] lg:block">
        {site.last_scan_at ? formatDistanceToNow(new Date(site.last_scan_at), { addSuffix: true }) : "Never scanned"}
      </div>
      <ArrowRight className="h-4 w-4 text-white/20 transition group-hover:text-cyan-200" />
    </Link>
  );
}

function safeHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

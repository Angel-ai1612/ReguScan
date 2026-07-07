"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle,
  Clock,
  ExternalLink,
  Globe,
  Loader,
  Play,
  Shield,
  TrendingUp,
  XCircle,
} from "lucide-react";
import api from "@/lib/api";
import { scanApi, websiteApi, type Scan } from "@/lib/api";
import { EmptyState, GlowCard, MetricCard, PageHeader, ProgressBar, RiskBadge, StatusPill, scoreTone } from "@/components/ui/premium";

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <Loader className="h-4 w-4 animate-spin text-white/40" />,
  running: <Loader className="h-4 w-4 animate-spin text-cyan-300" />,
  completed: <CheckCircle className="h-4 w-4 text-emerald-300" />,
  needs_review: <AlertTriangle className="h-4 w-4 text-amber-300" />,
  incomplete: <AlertTriangle className="h-4 w-4 text-amber-300" />,
  failed: <XCircle className="h-4 w-4 text-rose-300" />,
  cancelled: <XCircle className="h-4 w-4 text-white/30" />,
};

type AISystemRow = {
  id: string;
  name: string;
  system_type?: string;
  provider?: string | null;
  risk_category?: string | null;
  risk_category_confidence?: number | null;
};

export default function WebsiteDetailPage() {
  const { websiteId } = useParams<{ websiteId: string }>();
  const queryClient = useQueryClient();

  const { data: website, isLoading: wsLoading } = useQuery({
    queryKey: ["website", websiteId],
    queryFn: () => websiteApi.get(websiteId),
  });

  const { data: scans = [], isLoading: scansLoading } = useQuery({
    queryKey: ["scans", websiteId],
    queryFn: () => scanApi.list(websiteId),
    refetchInterval: (query) =>
      query.state.data?.some((scan) => scan.status === "running" || scan.status === "pending") ? 3000 : false,
  });

  const { data: aiSystems = [] } = useQuery<AISystemRow[]>({
    queryKey: ["ai-systems", websiteId],
    queryFn: () => api.get(`/api/v1/websites/${websiteId}/ai-systems`).then((response) => response.data),
    enabled: !!website,
  });

  const scanMutation = useMutation({
    mutationFn: () => scanApi.trigger(websiteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans", websiteId] });
      queryClient.invalidateQueries({ queryKey: ["website", websiteId] });
      toast.success("Scan started");
    },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? "Failed to trigger scan"),
  });

  if (wsLoading) {
    return (
      <div className="flex items-center gap-3 text-white/40">
        <Loader className="h-5 w-5 animate-spin" /> Loading website
      </div>
    );
  }

  if (!website) return <div className="text-white/40">Website not found.</div>;

  const latestScan = scans[0];
  const domain = safeHostname(website.url);
  const activeScan = latestScan?.status === "running" || latestScan?.status === "pending";
  const completedScans = scans.filter((scan) => scan.compliance_score !== null);
  const trend = completedScans.slice(0, 6).reverse();

  return (
    <div className="mx-auto max-w-7xl">
      <Link href="/dashboard/websites" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 transition hover:text-white/70">
        <ArrowLeft className="h-3.5 w-3.5" /> Websites
      </Link>

      <PageHeader
        eyebrow="Website overview"
        title={website.name ?? domain}
        description="Review the latest compliance score, detected AI systems, scan quality, and historical scan outcomes for this website."
        actions={
          <button
            type="button"
            onClick={() => scanMutation.mutate()}
            disabled={scanMutation.isPending || activeScan}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {scanMutation.isPending || activeScan ? <Loader className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {activeScan ? "Scanning" : "Run scan"}
          </button>
        }
      />

      <GlowCard className="mb-6 p-5" accent="cyan">
        <div className="scan-beam" />
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055]">
              {website.favicon_url ? <img src={website.favicon_url} alt="" className="h-8 w-8" /> : <Globe className="h-6 w-6 text-white/35" />}
            </div>
            <div className="min-w-0">
              <a href={website.url} target="_blank" rel="noreferrer" className="flex w-fit max-w-full items-center gap-1 text-sm text-white/48 transition hover:text-white/78">
                <span className="truncate">{website.url}</span> <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
              </a>
              <p className="mt-2 text-sm leading-6 text-white/52">
                {latestScan ? `Latest scan ${formatDistanceToNow(new Date(latestScan.created_at), { addSuffix: true })}` : "No scan has run yet."}
              </p>
            </div>
          </div>
          <RiskBadge tier={website.overall_risk_tier ?? "unknown"} />
        </div>
      </GlowCard>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricCard label="Compliance score" value={website.compliance_score ?? "-"} icon={TrendingUp} tone="cyan" valueClassName={scoreTone(website.compliance_score)} />
        <MetricCard label="Risk tier" value={<span className="capitalize">{website.overall_risk_tier ?? "Unknown"}</span>} icon={Shield} tone={website.overall_risk_tier === "high" || website.overall_risk_tier === "prohibited" ? "rose" : "emerald"} />
        <MetricCard label="AI systems" value={aiSystems.length} sub="Active detections" icon={Bot} tone="indigo" />
        <MetricCard label="Total scans" value={scans.length} sub={activeScan ? "Scan in progress" : "Historical runs"} icon={Clock} tone="amber" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <GlowCard className="p-5" accent="slate">
          <div className="relative z-10 mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black tracking-normal">Risk trend</h2>
              <p className="mt-1 text-sm text-white/42">Latest scored scan history.</p>
            </div>
            <TrendingUp className="h-5 w-5 text-cyan-200" />
          </div>
          <div className="relative z-10 space-y-4">
            {trend.length === 0 ? (
              <p className="text-sm text-white/40">Run a scan to build a score trend.</p>
            ) : (
              trend.map((scan) => (
                <div key={scan.id}>
                  <div className="mb-1 flex items-center justify-between text-xs text-white/48">
                    <span>{format(new Date(scan.created_at), "MMM d")}</span>
                    <span className={scoreTone(scan.compliance_score)}>{scan.compliance_score}</span>
                  </div>
                  <ProgressBar value={scan.compliance_score ?? 0} tone={(scan.compliance_score ?? 0) >= 85 ? "emerald" : (scan.compliance_score ?? 0) >= 60 ? "amber" : "rose"} />
                </div>
              ))
            )}
          </div>
        </GlowCard>

        <GlowCard className="overflow-hidden" accent="slate">
          <div className="relative z-10 border-b border-white/[0.06] p-5">
            <h2 className="font-black tracking-normal">Detected AI systems</h2>
            <p className="mt-1 text-sm text-white/42">Systems detected on this site and their current risk classification.</p>
          </div>
          {aiSystems.length === 0 ? (
            <div className="relative z-10 p-8 text-center text-sm text-white/38">
              No AI systems are stored yet. Run a scan or review scan quality before treating this as clean.
            </div>
          ) : (
            <div className="relative z-10 divide-y divide-white/[0.04]">
              {aiSystems.map((system) => (
                <div key={system.id} className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045]">
                    <Bot className="h-4 w-4 text-cyan-200" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{system.name}</p>
                    <p className="mt-0.5 truncate text-xs capitalize text-white/40">
                      {system.system_type?.replace(/_/g, " ") ?? "Unknown type"} - {system.provider ?? "Unknown provider"}
                    </p>
                  </div>
                  <RiskBadge tier={system.risk_category ?? "unknown"} />
                  {system.risk_category_confidence !== null && system.risk_category_confidence !== undefined && (
                    <span className="hidden w-16 text-right text-xs text-white/36 sm:block">
                      {Math.round(system.risk_category_confidence * 100)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlowCard>
      </div>

      <GlowCard className="mt-6 overflow-hidden" accent="slate">
        <div className="relative z-10 border-b border-white/[0.06] p-5">
          <h2 className="font-black tracking-normal">Scan history</h2>
          <p className="mt-1 text-sm text-white/42">Crawl, detection, classification, and report status for this website.</p>
        </div>
        {scansLoading ? (
          <div className="relative z-10 p-8 text-center text-white/30">
            <Loader className="mx-auto h-5 w-5 animate-spin" />
          </div>
        ) : scans.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No scans yet"
            description="Run your first scan to check AI systems, compliance gaps, and report evidence."
            className="m-5"
          />
        ) : (
          <div className="relative z-10 divide-y divide-white/[0.04]">
            {scans.map((scan) => (
              <ScanRow key={scan.id} scan={scan} />
            ))}
          </div>
        )}
      </GlowCard>
    </div>
  );
}

function ScanRow({ scan }: { scan: Scan }) {
  return (
    <Link href={`/dashboard/scans/${scan.id}`} className="group flex items-center gap-4 p-4 transition hover:bg-white/[0.025]">
      <div className="flex-shrink-0">{STATUS_ICON[scan.status]}</div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold capitalize text-white">{scan.status.replace(/_/g, " ")}</span>
          {scan.stage && (scan.status === "running" || scan.status === "pending") && (
            <StatusPill tone="cyan" className="py-0.5 capitalize">{scan.stage}</StatusPill>
          )}
        </div>
        <p className="mt-0.5 text-xs text-white/32">
          {format(new Date(scan.created_at), "MMM d, yyyy HH:mm")} - {scan.triggered_by === "api" ? "via API" : scan.triggered_by === "scheduled" ? "Scheduled" : "Manual"}
        </p>
      </div>

      {(scan.status === "running" || scan.status === "pending") && (
        <div className="hidden w-28 sm:block">
          <ProgressBar value={scan.progress_percent} tone="cyan" />
        </div>
      )}

      {scan.compliance_score !== null && <span className={`w-12 text-right text-xl font-black ${scoreTone(scan.compliance_score)}`}>{scan.compliance_score}</span>}
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

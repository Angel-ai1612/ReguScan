"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { websiteApi, scanApi, type Scan } from "@/lib/api";
import api from "@/lib/api";
import {
  Globe, Play, Loader, ExternalLink, ArrowLeft,
  Clock, CheckCircle, XCircle, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import clsx from "clsx";

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending:   <Loader className="w-4 h-4 text-white/40 animate-spin" />,
  running:   <Loader className="w-4 h-4 text-indigo-400 animate-spin" />,
  completed: <CheckCircle className="w-4 h-4 text-green-400" />,
  needs_review: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  incomplete: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  failed:    <XCircle className="w-4 h-4 text-red-400" />,
  cancelled: <XCircle className="w-4 h-4 text-white/30" />,
};

const SCORE_COLOR = (s: number) =>
  s >= 85 ? "text-green-400" : s >= 60 ? "text-orange-400" : "text-red-400";

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
      query.state.data?.some((s) => s.status === "running" || s.status === "pending")
        ? 3000
        : false,
  });

  const { data: aiSystems = [] } = useQuery({
    queryKey: ["ai-systems", websiteId],
    queryFn: () => api.get(`/api/v1/websites/${websiteId}/ai-systems`).then((r) => r.data),
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
    return <div className="flex items-center gap-3 text-white/40"><Loader className="w-5 h-5 animate-spin" /> Loading…</div>;
  }
  if (!website) return <div className="text-white/40">Website not found.</div>;

  const latestScan = scans[0];
  const domain = new URL(website.url).hostname;

  return (
    <div className="max-w-5xl">
      {/* Breadcrumb */}
      <Link href="/dashboard/websites" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Websites
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
          {website.favicon_url
            ? <img src={website.favicon_url} alt="" className="w-7 h-7" />
            : <Globe className="w-6 h-6 text-white/30" />}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{website.name ?? domain}</h1>
          <a
            href={website.url}
            target="_blank"
            rel="noreferrer"
            className="text-white/40 text-sm hover:text-white/70 flex items-center gap-1.5 mt-1 w-fit"
          >
            {website.url} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <button
          onClick={() => scanMutation.mutate()}
          disabled={
            scanMutation.isPending ||
            latestScan?.status === "running" ||
            latestScan?.status === "pending"
          }
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
        >
          {scanMutation.isPending || latestScan?.status === "running"
            ? <Loader className="w-4 h-4 animate-spin" />
            : <Play className="w-4 h-4" />}
          {latestScan?.status === "running" ? "Scanning…" : "Run scan"}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <div className={clsx("text-4xl font-black", website.compliance_score !== null ? SCORE_COLOR(website.compliance_score) : "text-white/20")}>
            {website.compliance_score ?? "—"}
          </div>
          <div className="text-white/40 text-xs mt-1">Compliance Score</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className={clsx("text-2xl font-bold capitalize", `risk-${website.overall_risk_tier ?? "minimal"}`)}>
            {website.overall_risk_tier ?? "Unknown"}
          </div>
          <div className="text-white/40 text-xs mt-1">Risk Tier</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-white">{aiSystems.length}</div>
          <div className="text-white/40 text-xs mt-1">AI Systems Detected</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-white">{scans.length}</div>
          <div className="text-white/40 text-xs mt-1">Total Scans</div>
        </div>
      </div>

      {/* AI Systems */}
      {aiSystems.length > 0 && (
        <div className="glass-card mb-6">
          <div className="p-4 border-b border-white/[0.06]">
            <h2 className="font-semibold">Detected AI Systems</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {aiSystems.map((sys: any) => (
              <div key={sys.id} className="flex items-center gap-3 p-4">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{sys.name}</p>
                  <p className="text-white/40 text-xs capitalize mt-0.5">
                    {sys.system_type?.replace(/_/g, " ")} · {sys.provider ?? "Unknown provider"}
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase risk-badge-${sys.risk_category}`}>
                  {sys.risk_category}
                </span>
                {sys.risk_category_confidence && (
                  <span className="text-white/30 text-xs w-16 text-right">
                    {Math.round(sys.risk_category_confidence * 100)}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scan history */}
      <div className="glass-card">
        <div className="p-4 border-b border-white/[0.06]">
          <h2 className="font-semibold">Scan History</h2>
        </div>
        {scansLoading ? (
          <div className="p-8 text-center text-white/30"><Loader className="w-5 h-5 animate-spin mx-auto" /></div>
        ) : scans.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/50">No scans yet. Run your first scan to check compliance.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {scans.map((scan) => (
              <ScanRow key={scan.id} scan={scan} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ScanRow({ scan }: { scan: Scan }) {
  return (
    <Link
      href={`/dashboard/scans/${scan.id}`}
      className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors group"
    >
      <div className="flex-shrink-0">{STATUS_ICON[scan.status]}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium capitalize">{scan.status}</span>
          {scan.stage && scan.status === "running" && (
            <span className="text-indigo-400 text-xs">· {scan.stage}</span>
          )}
        </div>
        <p className="text-white/30 text-xs mt-0.5">
          {format(new Date(scan.created_at), "MMM d, yyyy HH:mm")} ·{" "}
          {scan.triggered_by === "api" ? "via API" : scan.triggered_by === "scheduled" ? "Scheduled" : "Manual"}
        </p>
      </div>

      {/* Progress bar for running scans */}
      {scan.status === "running" && (
        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${scan.progress_percent}%` }}
          />
        </div>
      )}

      {scan.status === "completed" && (
        <>
          {scan.gap_summary && (
            <div className="flex gap-2 text-xs">
              {scan.gap_summary.critical > 0 && (
                <span className="text-red-400 font-semibold">{scan.gap_summary.critical}C</span>
              )}
              {scan.gap_summary.high > 0 && (
                <span className="text-orange-400 font-semibold">{scan.gap_summary.high}H</span>
              )}
              {scan.gap_summary.medium > 0 && (
                <span className="text-yellow-400">{scan.gap_summary.medium}M</span>
              )}
            </div>
          )}
          {scan.compliance_score !== null && (
            <span className={clsx("text-xl font-bold w-12 text-right", SCORE_COLOR(scan.compliance_score))}>
              {scan.compliance_score}
            </span>
          )}
        </>
      )}

      <span className="text-white/20 text-xs w-24 text-right hidden lg:block">
        {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
      </span>
    </Link>
  );
}

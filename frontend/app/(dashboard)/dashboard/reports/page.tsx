"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { format } from "date-fns";
import { AlertTriangle, ArrowRight, CheckCircle, Download, ExternalLink, FileText, Filter, Globe, Loader, Search } from "lucide-react";
import { scanApi, websiteApi, type Scan, type Website } from "@/lib/api";
import { EmptyState, ErrorState, GlowCard, PageHeader, RiskBadge, StatusPill, scoreTone } from "@/components/ui/premium";

type ScoreFilter = "all" | "needs_attention" | "healthy" | "unscored";
type StatusFilter = "all" | "completed" | "needs_review" | "incomplete";

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { data: websites = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["websites"],
    queryFn: websiteApi.list,
  });

  const filteredWebsites = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return websites.filter((website) => {
      const matchesSearch =
        !normalized ||
        website.url.toLowerCase().includes(normalized) ||
        (website.name ?? "").toLowerCase().includes(normalized);
      return matchesSearch;
    });
  }, [search, websites]);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Reports"
        title="Evidence-based compliance reports"
        description="Review completed scan reports by website, score, risk tier, gap summary, and export status."
        actions={<StatusPill tone="cyan"><FileText className="h-3.5 w-3.5" /> Report library</StatusPill>}
      />

      <GlowCard className="mb-6 p-4" accent="slate">
        <div className="relative z-10 grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.055] px-3 py-2.5">
            <Search className="h-4 w-4 flex-shrink-0 text-white/35" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search reports by website or URL"
              placeholder="Search reports by website or URL"
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              ["all", "All"],
              ["needs_attention", "Needs attention"],
              ["healthy", "Healthy"],
              ["unscored", "Unscored"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setScoreFilter(value as ScoreFilter)}
                aria-pressed={scoreFilter === value}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  scoreFilter === value
                    ? "border-cyan-200/[0.28] bg-cyan-200/[0.1] text-cyan-100"
                    : "border-white/10 bg-white/[0.035] text-white/[0.52] hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Filter className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
            <label className="sr-only" htmlFor="report-status-filter">Filter by report status</label>
            <select
              id="report-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="rounded-lg border border-white/10 bg-[#0a0e1a] px-3 py-2 text-sm font-semibold text-white/[0.68] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
            >
              <option value="all">All statuses</option>
              <option value="completed">Completed</option>
              <option value="needs_review">Needs review</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
        </div>
      </GlowCard>

      {isError ? (
        <ErrorState
          title="Report library could not be loaded"
          description="Website and report states are hidden because the request failed."
          onRetry={() => void refetch()}
        />
      ) : isLoading ? (
        <GlowCard className="p-12 text-center" accent="slate">
          <Loader className="relative z-10 mx-auto h-6 w-6 animate-spin text-white/40" />
        </GlowCard>
      ) : websites.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports yet"
          description="Add a website and complete a scan to generate your first explainable compliance report."
          action={
            <Link href="/dashboard/websites" className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">
              Add a website
            </Link>
          }
        />
      ) : filteredWebsites.length === 0 ? (
        <EmptyState icon={Search} title="No reports match this filter" description="Clear the search or choose a broader score filter." />
      ) : (
        <div className="space-y-4">
          {filteredWebsites.map((site) => (
            <WebsiteReports key={site.id} website={site} scoreFilter={scoreFilter} statusFilter={statusFilter} />
          ))}
        </div>
      )}
    </div>
  );
}

function WebsiteReports({ website, scoreFilter, statusFilter }: { website: Website; scoreFilter: ScoreFilter; statusFilter: StatusFilter }) {
  const { data: scans = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["scans", website.id],
    queryFn: () => scanApi.list(website.id),
  });

  const completedScans = scans.filter((scan) => scan.status === "completed" || scan.status === "needs_review" || scan.status === "incomplete");
  const filteredScans = completedScans.filter((scan) => {
    const scoreMatches =
      scoreFilter === "all" ||
      (scoreFilter === "needs_attention" && scan.compliance_score !== null && scan.compliance_score < 85) ||
      (scoreFilter === "healthy" && scan.compliance_score !== null && scan.compliance_score >= 85) ||
      (scoreFilter === "unscored" && scan.compliance_score === null);
    const statusMatches = statusFilter === "all" || scan.status === statusFilter;
    return scoreMatches && statusMatches;
  });
  const hostname = safeHostname(website.url);

  return (
    <GlowCard className="overflow-hidden" accent="slate">
      <div className="relative z-10 flex flex-col gap-4 border-b border-white/[0.06] p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045]">
            {website.favicon_url ? <img src={website.favicon_url} alt="" className="h-5 w-5" /> : <Globe className="h-4 w-4 text-white/35" />}
          </div>
          <div className="min-w-0">
            <p className="truncate font-black tracking-normal text-white">{website.name ?? hostname}</p>
            <p className="mt-0.5 text-xs text-white/[0.34]">{filteredScans.length} matching of {completedScans.length} report(s)</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RiskBadge tier={website.overall_risk_tier ?? "unknown"} />
          <span className={`text-2xl font-black ${scoreTone(website.compliance_score)}`}>{website.compliance_score ?? "-"}</span>
          <Link href={`/dashboard/websites/${website.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-semibold text-white/[0.64] transition hover:bg-white/[0.075] hover:text-white">
            Details <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {isError ? (
        <div className="relative z-10 p-6 text-center text-sm leading-6 text-amber-100/[0.68]" role="alert">
          Reports for this website could not be loaded.
          <button type="button" onClick={() => void refetch()} className="ml-1 font-semibold text-cyan-100 hover:text-white">Try again</button>
        </div>
      ) : isLoading ? (
        <div className="relative z-10 p-6 text-center text-white/30">
          <Loader className="mx-auto h-4 w-4 animate-spin" />
        </div>
      ) : completedScans.length === 0 ? (
        <div className="relative z-10 p-6 text-center text-sm text-white/35">
          No completed scans yet.{" "}
          <Link href={`/dashboard/websites/${website.id}`} className="font-semibold text-cyan-200 hover:text-cyan-100">
            Run a scan
          </Link>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="relative z-10 p-6 text-center text-sm text-white/[0.38]">No reports for this website match the selected score and status filters.</div>
      ) : (
        <div className="relative z-10 grid gap-3 p-4 lg:grid-cols-2">
          {filteredScans.map((scan) => (
            <ScanReportCard key={scan.id} scan={scan} />
          ))}
        </div>
      )}
    </GlowCard>
  );
}

function ScanReportCard({ scan }: { scan: Scan }) {
  const score = scan.compliance_score;
  const gap = scan.gap_summary;
  const statusTone = scan.status === "completed" ? "emerald" : "amber";
  const StatusIcon = scan.status === "completed" ? CheckCircle : AlertTriangle;

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 transition hover:border-cyan-200/[0.22] hover:bg-white/[0.055]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <StatusIcon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${scan.status === "completed" ? "text-emerald-300" : "text-amber-300"}`} aria-hidden="true" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Scan - {format(new Date(scan.created_at), "MMM d, yyyy HH:mm")}</p>
            <p className="mt-1 text-xs capitalize text-white/[0.34]">{scan.status.replace(/_/g, " ")}</p>
          </div>
        </div>
        <StatusPill tone={statusTone} className="capitalize">{scan.status.replace(/_/g, " ")}</StatusPill>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2">
        <span className="text-xs uppercase tracking-[0.14em] text-white/[0.34]">Score</span>
        <span className={`text-2xl font-black ${scoreTone(score)}`}>{score ?? "-"}</span>
      </div>

      {gap && (
        <div className="mb-4 flex flex-wrap gap-2">
          {(["critical", "high", "medium", "low"] as const).map((severity) =>
            (gap[severity] ?? 0) > 0 ? (
              <span key={severity} className={`rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-xs font-semibold capitalize severity-${severity}`}>
                {gap[severity]} {severity}
              </span>
            ) : null,
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/dashboard/scans/${scan.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-300 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-200">
          View report <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
        {scan.report_url && (
          <a href={scan.report_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/[0.075] hover:text-white">
            <Download className="h-3 w-3" /> HTML
          </a>
        )}
      </div>
    </div>
  );
}

function safeHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

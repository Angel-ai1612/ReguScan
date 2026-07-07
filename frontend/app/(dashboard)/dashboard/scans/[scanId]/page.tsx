"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { scanApi, type AISystemSummary, type Gap, type GapListResponse } from "@/lib/api";
import api from "@/lib/api";
import {
  CheckCircle,
  XCircle,
  Loader,
  AlertTriangle,
  Shield,
  Copy,
  Check,
  MapPin,
  Search,
  FileText,
  Gauge,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";
import { GlowCard, MetricCard, PageHeader, ProgressBar, RiskBadge, StatusPill, scoreTone } from "@/components/ui/premium";

const STAGE_LABELS: Record<string, string> = {
  crawling: "Crawling website pages…",
  detecting: "Detecting AI systems…",
  classifying: "Classifying risk tiers (LLM)…",
  analyzing: "Analyzing compliance gaps…",
  reporting: "Compiling report…",
  done: "Scan complete",
  error: "Scan failed",
};

const SEVERITY_ORDER = ["critical", "high", "medium", "low"] as const;
const SEVERITY_STYLES: Record<string, string> = {
  critical: "border-l-red-500 bg-red-500/5",
  high: "border-l-orange-500 bg-orange-500/5",
  medium: "border-l-yellow-500 bg-yellow-500/5",
  low: "border-l-green-500 bg-green-500/5",
};

function normalizeEvidence(evidence?: Record<string, any> | null) {
  if (!evidence) return { signals: {}, sources: [] as string[], strength: "weak" };
  const signals = evidence.signals && typeof evidence.signals === "object"
    ? evidence.signals
    : evidence;
  const sources = Array.isArray(evidence.sources)
    ? evidence.sources
    : Object.keys(signals).map((key) => key.replace(/_/g, " "));
  return {
    signals,
    sources,
    strength: evidence.strength ?? "weak",
  };
}

function humanize(value?: string | null) {
  return value ? value.replace(/_/g, " ") : "Unknown";
}

function confidenceLabel(confidence?: number | null) {
  if (confidence === null || confidence === undefined) return "Not scored";
  if (confidence >= 0.75) return "High confidence";
  if (confidence >= 0.5) return "Medium confidence";
  return "Low confidence";
}

export default function ScanPage({ params }: { params: { scanId: string } }) {
  const { scanId } = params;
  const queryClient = useQueryClient();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const [liveStage, setLiveStage] = useState<string | null>(null);
  const [liveProgress, setLiveProgress] = useState(0);

  const { data: scan, isLoading } = useQuery({
    queryKey: ["scan", scanId],
    queryFn: () => scanApi.get(scanId),
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === "running" || data?.status === "pending" ? 3000 : false;
    },
  });

  const { data: gapsResponse } = useQuery<GapListResponse>({
    queryKey: ["gaps", scanId],
    queryFn: () => api.get(`/api/v1/scans/${scanId}/gaps`).then((r) => r.data),
    enabled: scan?.status === "completed" || scan?.status === "needs_review" || scan?.status === "incomplete",
  });

  // WebSocket for live progress
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (!scan || ["completed", "needs_review", "incomplete", "failed"].includes(scan.status)) return;

    let cancelled = false;

    const connect = async () => {
      const token = await getToken();
      if (cancelled || !token) return;

      const baseUrl = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000";
      const wsUrl = `${baseUrl}/ws/scans/${scanId}`;
      const ws = new WebSocket(wsUrl, ["reguscan", `clerk.${token}`]);
      wsRef.current = ws;

      ws.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          if (event.event === "scan.progress") {
            setLiveStage(event.data.stage);
            setLiveProgress(event.data.percent_complete);
          } else if (event.event === "scan.completed" || event.event === "scan.failed") {
            queryClient.invalidateQueries({ queryKey: ["scan", scanId] });
            ws.close();
          }
        } catch {}
      };
    };

    connect();

    return () => {
      cancelled = true;
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [getToken, isLoaded, isSignedIn, scan?.status, scanId, queryClient]);

  if (isLoading) return <Loading />;
  if (!scan) return <div className="text-white/40">Scan not found.</div>;

  const progress = liveProgress || scan.progress_percent;
  const stage = liveStage || scan.stage;
  const isRunning = scan.status === "pending" || scan.status === "running";
  const isReview =
    scan.status === "needs_review" ||
    scan.status === "incomplete" ||
    Boolean(scan.requires_review || scan.classification_results?.requires_review);
  const scanQuality = scan.classification_results?.scan_quality ?? scan.scan_quality ?? null;
  const scoreExplanation = scan.classification_results?.score_explanation ?? scan.score_explanation ?? null;
  const gaps = gapsResponse?.items ?? [];
  const lockedGapCount = gapsResponse?.locked_count ?? 0;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Scan results"
        title={isRunning ? "Live scan in progress" : "Evidence-based scan report"}
        description={`Scan ID: ${scanId}`}
        actions={
          <StatusPill tone={scan.status === "failed" ? "rose" : isReview ? "amber" : scan.status === "completed" ? "emerald" : "cyan"} className="capitalize">
            {scan.status.replace(/_/g, " ")}
          </StatusPill>
        }
      />

      {/* Progress */}
      {isRunning && (
        <GlowCard className="mb-6 overflow-hidden p-6" accent="cyan">
          <div className="scan-beam" />
          <div className="relative z-10 mb-5 flex items-center gap-3">
            <Loader className="h-5 w-5 animate-spin text-cyan-300" />
            <span className="font-semibold text-white">{STAGE_LABELS[stage ?? ""] ?? "Processing..."}</span>
            <span className="ml-auto text-2xl font-black text-cyan-200">{progress}%</span>
          </div>
          <div className="relative z-10">
            <ProgressBar value={progress} tone="cyan" className="h-2.5" />
          </div>
          <div className="relative z-10 mt-5 grid gap-2 sm:grid-cols-5">
            {["crawling", "detecting", "classifying", "analyzing", "reporting"].map((s) => (
              <span
                key={s}
                className={clsx(
                  "rounded-lg border px-3 py-2 text-center text-xs font-semibold capitalize transition",
                  stage === s
                    ? "border-cyan-200/24 bg-cyan-200/[0.12] text-cyan-100 shadow-[0_0_24px_rgba(103,232,249,0.12)]"
                    : "border-white/10 bg-white/[0.035] text-white/34"
                )}
              >
                {s}
              </span>
            ))}
          </div>
        </GlowCard>
      )}

      {/* Failed */}
      {scan.status === "failed" && (
        <GlowCard className="mb-6 p-4" accent="rose">
          <div className="relative z-10 flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-300" />
            <div>
              <p className="font-semibold text-rose-200">Scan failed</p>
              <p className="mt-1 text-sm text-white/55">{scan.error_message ?? "Unknown error"}</p>
            </div>
          </div>
        </GlowCard>
      )}

      {/* Completed / Needs review */}
      {(scan.status === "completed" || scan.status === "needs_review" || scan.status === "incomplete") && (
        <>
          {isReview && (
            <GlowCard className="mb-6 p-4" accent="amber">
              <div className="relative z-10 flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-300" />
                <div>
                  <p className="font-semibold text-amber-200">Needs review</p>
                  <p className="mt-1 text-sm text-white/58">
                  Missing or weak evidence is not treated as proof of compliance. Review crawl warnings and detection signals before relying on this score.
                  </p>
                  {scoreExplanation?.summary && (
                    <p className="mt-2 text-xs text-white/42">{scoreExplanation.summary}</p>
                  )}
                </div>
              </div>
            </GlowCard>
          )}

          {/* Score banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ScoreStat score={scan.compliance_score} />
            {Object.entries(scan.gap_summary ?? {}).map(([sev, count]) => (
              <MetricCard
                key={sev}
                label={sev}
                value={count as number}
                tone={sev === "critical" || sev === "high" ? "rose" : sev === "medium" ? "amber" : "emerald"}
                valueClassName={`severity-${sev}`}
                className="text-center"
              />
            ))}
          </div>

          {/* Fine exposure */}
          {scan.estimated_fine_exposure && (
            <FineExposureCard exposure={scan.estimated_fine_exposure} />
          )}

          {scan.crawl_results && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <EvidenceMetric label="Pages checked" value={scan.crawl_results.pages_succeeded ?? scan.crawl_results.pages_crawled} />
              <EvidenceMetric label="Scripts reviewed" value={scan.crawl_results.scripts_found} />
              <EvidenceMetric label="AI signals" value={scan.crawl_results.ai_systems_detected} />
              <EvidenceMetric label="Network signals" value={scan.crawl_results.network_requests} />
            </div>
          )}

          {(scanQuality || scan.crawl_results) && (
            <ScanQualityCard
              quality={scanQuality}
              crawlResults={scan.crawl_results}
              explanation={scoreExplanation}
            />
          )}

          {/* Detected systems */}
          {scan.classification_results && (
            <GlowCard className="mb-6 overflow-hidden" accent="slate">
              <div className="relative z-10 border-b border-white/[0.06] p-4">
                <h2 className="font-black tracking-normal text-white">
                  Detected AI Systems ({scan.classification_results.systems_count})
                </h2>
                <p className="mt-1 text-xs text-white/40">
                  Each system is tied to the page and signal that caused ReguScan to flag it.
                </p>
              </div>
              <div className="relative z-10 space-y-4 p-4">
                {scan.classification_results.systems.map((sys, i) => (
                  <SystemEvidenceCard key={`${sys.name}-${i}`} system={sys} />
                ))}
              </div>
            </GlowCard>
          )}

          {/* Gaps */}
          <GlowCard className="overflow-hidden" accent="slate">
            <div className="relative z-10 border-b border-white/[0.06] p-4">
              <h2 className="font-black tracking-normal">Compliance gaps and remediation</h2>
            </div>
            {gaps.length === 0 ? (
              <div className="relative z-10 p-8 text-center">
                {isReview ? (
                  <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                ) : (
                  <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                )}
                <p className="text-white/50">
                  {isReview
                    ? "No compliance gaps were generated, but scan quality requires human review."
                    : "No compliance gaps detected."}
                </p>
              </div>
            ) : (
              <div className="relative z-10 space-y-3 p-4">
                {SEVERITY_ORDER.flatMap((sev) =>
                  gaps
                    .filter((g) => g.severity === sev)
                    .map((gap) => <GapCard key={gap.id} gap={gap} />)
                )}
                {lockedGapCount > 0 && (
                  <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4">
                    <p className="text-sm font-medium text-indigo-200">
                      {lockedGapCount} more gaps available on Starter.
                    </p>
                    <p className="mt-1 text-sm text-white/55">
                      Free reports show the top 3 gaps. Upgrade for full gap analysis when paid checkout is enabled.
                    </p>
                  </div>
                )}
              </div>
            )}
          </GlowCard>

          {/* Report link */}
          {scan.report_url && (
            <a
              href={scan.report_url}
              target="_blank"
              rel="noreferrer"
              className="command-card mt-6 flex items-center justify-center gap-2 p-4 font-semibold text-cyan-200 transition-colors hover:bg-white/[0.04]"
            >
              Download Full HTML Report →
            </a>
          )}
        </>
      )}
    </div>
  );
}

function ScoreStat({ score }: { score: number | null }) {
  const color = scoreTone(score);
  return (
    <div className="glass-card p-4 text-center col-span-1">
      <div className={`text-4xl font-black ${color}`}>{score ?? "—"}</div>
      <div className="text-white/40 text-xs mt-1">Compliance Score</div>
    </div>
  );
}

function EvidenceMetric({ label, value }: { label: string; value: number }) {
  return (
    <GlowCard className="p-4" accent="slate">
      <div className="relative z-10 mb-2 flex items-center gap-2 text-xs text-white/30">
        <Gauge className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="relative z-10 text-2xl font-semibold text-white">{value}</div>
    </GlowCard>
  );
}

function ScanQualityCard({
  quality,
  crawlResults,
  explanation,
}: {
  quality?: {
    crawl_confidence?: string;
    pages_attempted?: number;
    pages_succeeded?: number;
    pages_failed?: number;
    crawl_errors?: Array<{ url?: string; stage?: string; error?: string }>;
    weak_evidence_count?: number;
    score_cap?: number | null;
  } | null;
  crawlResults?: {
    pages_crawled?: number;
    pages_attempted?: number;
    pages_succeeded?: number;
    pages_failed?: number;
    crawl_errors?: Array<{ url?: string; stage?: string; error?: string }>;
    crawl_confidence?: string;
  } | null;
  explanation?: {
    raw_score?: number;
    final_score?: number;
    review_reasons?: string[];
  } | null;
}) {
  const confidence = quality?.crawl_confidence ?? crawlResults?.crawl_confidence ?? "unknown";
  const attempted = quality?.pages_attempted ?? crawlResults?.pages_attempted ?? crawlResults?.pages_crawled ?? 0;
  const succeeded = quality?.pages_succeeded ?? crawlResults?.pages_succeeded ?? crawlResults?.pages_crawled ?? 0;
  const failed = quality?.pages_failed ?? crawlResults?.pages_failed ?? 0;
  const errors = quality?.crawl_errors ?? crawlResults?.crawl_errors ?? [];
  const confidenceClass =
    confidence === "high" ? "text-green-400" : confidence === "medium" ? "text-yellow-400" : "text-orange-400";

  return (
    <GlowCard className="mb-6 p-4" accent="slate">
      <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-black tracking-normal text-white">Scan quality</h2>
          <p className="mt-1 text-xs text-white/40">
            A perfect score requires a high-confidence crawl and meaningful detector coverage.
          </p>
        </div>
        <span className={`text-xs font-semibold uppercase ${confidenceClass}`}>
          {confidence} confidence
        </span>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <EvidenceMetric label="Pages attempted" value={attempted} />
        <EvidenceMetric label="Pages succeeded" value={succeeded} />
        <EvidenceMetric label="Pages failed" value={failed} />
        <EvidenceMetric label="Weak candidates" value={quality?.weak_evidence_count ?? 0} />
      </div>

      {explanation?.review_reasons?.length ? (
        <div className="relative z-10 mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
          <p className="text-yellow-300 text-xs font-medium mb-2">Why this needs review</p>
          <ul className="space-y-1">
            {explanation.review_reasons.map((reason) => (
              <li key={reason} className="text-white/55 text-sm">{reason}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {errors.length > 0 && (
        <div className="relative z-10 mt-4 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
          <p className="text-white/35 text-xs font-medium mb-2">Extraction warnings</p>
          <div className="space-y-2">
            {errors.slice(0, 3).map((err, index) => (
              <p key={`${err.url}-${index}`} className="text-white/55 text-xs break-words">
                {err.stage ?? "crawl"}: {err.error ?? "Unknown crawl warning"}
              </p>
            ))}
          </div>
        </div>
      )}
    </GlowCard>
  );
}

function SystemEvidenceCard({ system }: { system: AISystemSummary }) {
  const evidence = normalizeEvidence(system.detection_evidence);
  const confidence = system.confidence ?? 0;

  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-semibold">{system.name}</h3>
            <RiskBadge tier={system.risk_category} />
            <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 text-xs capitalize">
              {evidence.strength} evidence
            </span>
          </div>
          <p className="text-white/45 text-sm mt-1">
            {humanize(system.type)}{system.provider ? ` by ${system.provider}` : ""}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-white text-sm font-medium">{Math.round(confidence * 100)}%</p>
          <p className="text-white/35 text-xs">{confidenceLabel(confidence)}</p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3 mt-4">
        <EvidenceInfo
          icon={<MapPin className="w-4 h-4" />}
          label="Where found"
          value={system.page_url ?? "Page not captured"}
          href={system.page_url ?? undefined}
        />
        <EvidenceInfo
          icon={<Search className="w-4 h-4" />}
          label="Detection source"
          value={evidence.sources.length ? evidence.sources.join(", ") : "Pattern match"}
        />
        <EvidenceInfo
          icon={<FileText className="w-4 h-4" />}
          label="Detector confidence"
          value={system.detector_confidence !== null && system.detector_confidence !== undefined
            ? `${Math.round(system.detector_confidence * 100)}%`
            : "Not scored"}
        />
      </div>

      {system.applicable_articles?.length ? (
        <div className="mt-3 text-white/40 text-xs">
          Related articles: {system.applicable_articles.join(", ")}
        </div>
      ) : null}

      <EvidenceSignals evidence={evidence.signals} />

      {system.reasoning && (
        <div className="mt-4 rounded-lg bg-white/[0.035] border border-white/[0.06] p-3">
          <p className="text-white/35 text-xs font-medium mb-1">Why ReguScan classified it this way</p>
          <p className="text-white/70 text-sm leading-relaxed">{system.reasoning}</p>
        </div>
      )}
    </div>
  );
}

function EvidenceInfo({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <span className="text-white/70 text-sm break-words">
      {value}
      {href && <ExternalLink className="inline w-3 h-3 ml-1 text-white/30" />}
    </span>
  );

  return (
    <div className="rounded-lg bg-white/[0.035] border border-white/[0.06] p-3">
      <div className="flex items-center gap-2 text-white/35 text-xs mb-1">
        {icon}
        {label}
      </div>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="hover:text-indigo-300">
          {content}
        </a>
      ) : content}
    </div>
  );
}

function EvidenceSignals({ evidence }: { evidence: Record<string, any> }) {
  const entries = Object.entries(evidence).filter(([, value]) => Boolean(value));
  if (entries.length === 0) {
    return (
      <p className="mt-4 text-white/35 text-xs">
        Evidence signal was not captured for this older scan. Treat this finding as lower confidence until rescanned.
      </p>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-white/35 text-xs font-medium mb-2">Exact signal that triggered detection</p>
      <div className="flex flex-wrap gap-2">
        {entries.map(([key, value]) => (
          <span key={key} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/65">
            {key.replace(/_/g, " ")}: {String(value)}
          </span>
        ))}
      </div>
    </div>
  );
}

function FineExposureCard({ exposure }: { exposure: { tier1: number; tier2: number; tier3: number } }) {
  const total = exposure.tier1 + exposure.tier2 + exposure.tier3;
  if (total === 0) return null;
  return (
    <GlowCard className="mb-6 p-4" accent="amber">
      <div className="relative z-10 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-yellow-400 font-medium text-sm">Estimated Fine Exposure</p>
        <div className="flex gap-4 mt-2 flex-wrap">
          {exposure.tier1 > 0 && (
            <p className="text-xs text-white/60">
              <span className="text-red-400 font-bold">€{(exposure.tier1 / 1_000_000).toFixed(0)}M</span> max — Prohibited (Art.5)
            </p>
          )}
          {exposure.tier2 > 0 && (
            <p className="text-xs text-white/60">
              <span className="text-orange-400 font-bold">€{(exposure.tier2 / 1_000_000).toFixed(0)}M</span> max — High-risk / Transparency
            </p>
          )}
        </div>
        <p className="text-white/30 text-xs mt-2">* Statutory maximums. Actual fines depend on turnover and regulator discretion.</p>
      </div>
      </div>
    </GlowCard>
  );
}

function GapCard({ gap }: { gap: Gap }) {
  const [copied, setCopied] = useState(false);
  const evidence = normalizeEvidence(gap.ai_system_detection_evidence);

  const copy = () => {
    if (!gap.remediation_code_snippet) return;
    navigator.clipboard.writeText(gap.remediation_code_snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={clsx("rounded-r-lg border-l-2 p-4", SEVERITY_STYLES[gap.severity])}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/60">
          {gap.obligation_code}
        </span>
        <span className={clsx("text-xs font-bold uppercase", `severity-${gap.severity}`)}>
          {gap.severity}
        </span>
        <span
          className={clsx(
            "ml-auto text-xs px-2 py-0.5 rounded-full",
            gap.status === "resolved"
              ? "bg-green-500/20 text-green-400"
              : "bg-white/10 text-white/40"
          )}
        >
          {gap.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-3 mb-3">
        <EvidenceInfo
          icon={<Shield className="w-4 h-4" />}
          label="Risk item"
          value={`${gap.ai_system_name ?? "AI system"} (${humanize(gap.ai_system_type)})`}
        />
        <EvidenceInfo
          icon={<MapPin className="w-4 h-4" />}
          label="Page URL"
          value={gap.ai_system_page_url ?? "Page not captured"}
          href={gap.ai_system_page_url ?? undefined}
        />
        <EvidenceInfo
          icon={<Search className="w-4 h-4" />}
          label="Detection source"
          value={evidence.sources.length ? evidence.sources.join(", ") : "Pattern match"}
        />
      </div>

      <p className="text-white text-sm font-medium mb-2">{gap.obligation_description}</p>

      <div className="mb-3 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
        <p className="text-white/35 text-xs font-medium mb-1">Why this matters</p>
        <p className="text-white/60 text-sm leading-relaxed">
          This gap is tied to {gap.ai_system_name ?? "the detected AI system"} and the EU AI Act obligation{" "}
          <span className="text-white/80 font-medium">{gap.obligation_code}</span>. The finding should be reviewed
          against the page evidence and your actual business process before treating it as legal advice.
        </p>
        {gap.ai_system_reasoning && (
          <p className="text-white/50 text-sm leading-relaxed mt-2">
            Classification reason: {gap.ai_system_reasoning}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {(gap.ai_system_articles ?? [gap.obligation_code]).map((article) => (
            <span key={article} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/45">
              {article}
            </span>
          ))}
          {gap.ai_system_confidence !== null && gap.ai_system_confidence !== undefined && (
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/45">
              {Math.round(gap.ai_system_confidence * 100)}% confidence
            </span>
          )}
        </div>
      </div>

      {gap.remediation_suggestion && (
        <div className="mb-3">
          <p className="text-white/35 text-xs font-medium mb-1">Recommended fix</p>
          <p className="text-white/60 text-sm leading-relaxed">{gap.remediation_suggestion}</p>
        </div>
      )}

      <EvidenceSignals evidence={evidence.signals} />

      {gap.remediation_code_snippet && (
        <div className="relative mt-3">
          <pre className="bg-[#0a0818] border border-white/10 rounded-lg p-4 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre-wrap">
            {gap.remediation_code_snippet}
          </pre>
          <button
            onClick={copy}
            className="absolute top-2 right-2 p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/50" />}
          </button>
        </div>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center gap-3 text-white/40">
      <Loader className="w-5 h-5 animate-spin" />
      Loading scan…
    </div>
  );
}

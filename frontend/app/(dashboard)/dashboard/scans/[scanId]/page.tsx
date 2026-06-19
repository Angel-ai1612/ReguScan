"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { scanApi, type Scan, type Gap } from "@/lib/api";
import api from "@/lib/api";
import { CheckCircle, XCircle, Loader, AlertTriangle, Shield, Copy, Check } from "lucide-react";
import clsx from "clsx";

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

export default function ScanPage({ params }: { params: { scanId: string } }) {
  const { scanId } = params;
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const [liveStage, setLiveStage] = useState<string | null>(null);
  const [liveProgress, setLiveProgress] = useState(0);

  const { data: scan, isLoading } = useQuery({
    queryKey: ["scan", scanId],
    queryFn: () => scanApi.get(scanId),
    refetchInterval: (data) =>
      data?.status === "running" || data?.status === "pending" ? 3000 : false,
  });

  const { data: gaps = [] } = useQuery<Gap[]>({
    queryKey: ["gaps", scanId],
    queryFn: () => api.get(`/api/v1/scans/${scanId}/gaps`).then((r) => r.data),
    enabled: scan?.status === "completed",
  });

  // WebSocket for live progress
  useEffect(() => {
    if (!scan || scan.status === "completed" || scan.status === "failed") return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000"}/ws/scans/${scanId}`;
    const ws = new WebSocket(wsUrl);
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

    return () => ws.close();
  }, [scan?.status, scanId, queryClient]);

  if (isLoading) return <Loading />;
  if (!scan) return <div className="text-white/40">Scan not found.</div>;

  const progress = liveProgress || scan.progress_percent;
  const stage = liveStage || scan.stage;
  const isRunning = scan.status === "pending" || scan.status === "running";

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">Scan Results</h1>
      <p className="text-white/40 text-sm mb-8">Scan ID: {scanId}</p>

      {/* Progress */}
      {isRunning && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Loader className="w-5 h-5 text-indigo-400 animate-spin" />
            <span className="text-white font-medium">{STAGE_LABELS[stage ?? ""] ?? "Processing…"}</span>
            <span className="ml-auto text-indigo-400 font-bold">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {["crawling", "detecting", "classifying", "analyzing", "reporting"].map((s) => (
              <span
                key={s}
                className={clsx(
                  "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                  stage === s
                    ? "bg-indigo-500/30 text-indigo-300"
                    : "bg-white/5 text-white/30"
                )}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Failed */}
      {scan.status === "failed" && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Scan failed</p>
            <p className="text-white/50 text-sm mt-1">{scan.error_message ?? "Unknown error"}</p>
          </div>
        </div>
      )}

      {/* Completed */}
      {scan.status === "completed" && (
        <>
          {/* Score banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ScoreStat score={scan.compliance_score} />
            {Object.entries(scan.gap_summary ?? {}).map(([sev, count]) => (
              <div key={sev} className="glass-card p-4 text-center">
                <div className={`text-3xl font-bold severity-${sev}`}>{count as number}</div>
                <div className="text-white/40 text-xs mt-1 capitalize">{sev}</div>
              </div>
            ))}
          </div>

          {/* Fine exposure */}
          {scan.estimated_fine_exposure && (
            <FineExposureCard exposure={scan.estimated_fine_exposure} />
          )}

          {/* Detected systems */}
          {scan.classification_results && (
            <div className="glass-card mb-6">
              <div className="p-4 border-b border-white/[0.06]">
                <h2 className="font-semibold">
                  Detected AI Systems ({scan.classification_results.systems_count})
                </h2>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {scan.classification_results.systems.map((sys, i) => (
                  <div key={i} className="flex items-center gap-3 p-4">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{sys.name}</p>
                      <p className="text-white/40 text-xs capitalize mt-0.5">
                        {sys.type.replace(/_/g, " ")}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase risk-badge-${sys.risk_category}`}
                    >
                      {sys.risk_category}
                    </span>
                    <span className="text-white/30 text-xs w-16 text-right">
                      {Math.round(sys.confidence * 100)}% conf.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gaps */}
          <div className="glass-card">
            <div className="p-4 border-b border-white/[0.06]">
              <h2 className="font-semibold">Compliance Gaps & Remediation</h2>
            </div>
            {gaps.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-white/50">No compliance gaps detected.</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {SEVERITY_ORDER.flatMap((sev) =>
                  gaps
                    .filter((g) => g.severity === sev)
                    .map((gap) => <GapCard key={gap.id} gap={gap} />)
                )}
              </div>
            )}
          </div>

          {/* Report link */}
          {scan.report_url && (
            <a
              href={scan.report_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 mt-6 p-4 glass-card hover:bg-white/[0.04] transition-colors text-indigo-400 font-medium"
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
  const color =
    score === null ? "text-white/30" : score >= 85 ? "text-green-400" : score >= 60 ? "text-orange-400" : "text-red-400";
  return (
    <div className="glass-card p-4 text-center col-span-1">
      <div className={`text-4xl font-black ${color}`}>{score ?? "—"}</div>
      <div className="text-white/40 text-xs mt-1">Compliance Score</div>
    </div>
  );
}

function FineExposureCard({ exposure }: { exposure: { tier1: number; tier2: number; tier3: number } }) {
  const total = exposure.tier1 + exposure.tier2 + exposure.tier3;
  if (total === 0) return null;
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
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
  );
}

function GapCard({ gap }: { gap: Gap }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!gap.remediation_code_snippet) return;
    navigator.clipboard.writeText(gap.remediation_code_snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={clsx("border-l-2 rounded-r-xl p-4", SEVERITY_STYLES[gap.severity])}>
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

      <p className="text-white text-sm font-medium mb-2">{gap.obligation_description}</p>

      {gap.remediation_suggestion && (
        <p className="text-white/60 text-sm leading-relaxed mb-3">{gap.remediation_suggestion}</p>
      )}

      {gap.remediation_code_snippet && (
        <div className="relative">
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

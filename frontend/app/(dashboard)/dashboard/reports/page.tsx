"use client";
import { useQuery } from "@tanstack/react-query";
import { websiteApi, scanApi, type Website, type Scan } from "@/lib/api";
import {
  FileText, ExternalLink, Download, Loader,
  CheckCircle, XCircle, Clock,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import clsx from "clsx";

const SCORE_COLOR = (s: number) =>
  s >= 85 ? "text-green-400" : s >= 60 ? "text-orange-400" : "text-red-400";

export default function ReportsPage() {
  const { data: websites = [], isLoading } = useQuery({
    queryKey: ["websites"],
    queryFn: websiteApi.list,
  });

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-white/40 text-sm mt-1">
          Evidence-backed scan history, compliance scores, and downloadable report links.
        </p>
      </div>

      {isLoading ? (
        <div className="glass-card p-12 text-center">
          <Loader className="w-6 h-6 animate-spin text-white/40 mx-auto" />
        </div>
      ) : websites.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 mb-2">No reports yet.</p>
          <p className="text-white/35 text-sm mb-5">Add a website and complete a scan to generate your first explainable compliance report.</p>
          <Link
            href="/dashboard/websites"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
          >
            Add a website →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {websites.map((site) => (
            <WebsiteReports key={site.id} website={site} />
          ))}
        </div>
      )}
    </div>
  );
}

function WebsiteReports({ website }: { website: Website }) {
  const { data: scans = [], isLoading } = useQuery({
    queryKey: ["scans", website.id],
    queryFn: () => scanApi.list(website.id),
  });

  const completedScans = scans.filter((s) => s.status === "completed");

  return (
    <div className="glass-card">
      {/* Website header */}
      <div className="flex items-center gap-3 p-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-white/30" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{website.name ?? website.url}</p>
          <p className="text-white/30 text-xs">{completedScans.length} completed scan(s)</p>
        </div>
        <Link
          href={`/dashboard/websites/${website.id}`}
          className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
        >
          View details →
        </Link>
      </div>

      {/* Scans list */}
      {isLoading ? (
        <div className="p-6 text-center text-white/30">
          <Loader className="w-4 h-4 animate-spin mx-auto" />
        </div>
      ) : completedScans.length === 0 ? (
        <div className="p-6 text-center text-white/30 text-sm">
          No completed scans yet.{" "}
          <Link href={`/dashboard/websites/${website.id}`} className="text-indigo-400 hover:text-indigo-300">
            Run a scan →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {completedScans.map((scan) => (
            <ScanReportRow key={scan.id} scan={scan} />
          ))}
        </div>
      )}
    </div>
  );
}

function ScanReportRow({ scan }: { scan: Scan }) {
  const score = scan.compliance_score;
  const gap = scan.gap_summary;

  return (
    <div className="flex items-center gap-4 p-4">
      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm">
          Scan — {format(new Date(scan.created_at), "MMM d, yyyy HH:mm")}
        </p>
        {gap && (
          <div className="flex gap-3 mt-1">
            {(["critical", "high", "medium", "low"] as const).map((sev) =>
              (gap[sev] ?? 0) > 0 ? (
                <span key={sev} className={clsx("text-xs font-medium", `severity-${sev}`)}>
                  {gap[sev]} {sev}
                </span>
              ) : null
            )}
          </div>
        )}
      </div>

      {score !== null && (
        <div className={clsx("text-xl font-bold w-12 text-right", SCORE_COLOR(score))}>
          {score}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard/scans/${scan.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] hover:bg-white/10 rounded-lg text-xs text-white/70 transition-colors"
        >
          View <ExternalLink className="w-3 h-3" />
        </Link>
        {scan.report_url && (
          <a
            href={scan.report_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 rounded-lg text-xs text-indigo-400 transition-colors"
          >
            <Download className="w-3 h-3" /> HTML
          </a>
        )}
      </div>
    </div>
  );
}

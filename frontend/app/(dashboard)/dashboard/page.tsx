"use client";
import { useQuery } from "@tanstack/react-query";
import { websiteApi, billingApi, type Website } from "@/lib/api";
import { AlertTriangle, Globe, TrendingUp, Shield, Plus, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const RISK_COLORS: Record<string, string> = {
  prohibited: "risk-badge-prohibited",
  high: "risk-badge-high",
  limited: "risk-badge-limited",
  minimal: "risk-badge-minimal",
};

const SCORE_COLOR = (s: number) =>
  s >= 85 ? "text-green-400" : s >= 60 ? "text-orange-400" : "text-red-400";

export default function DashboardPage() {
  const { data: websites = [], isLoading } = useQuery({
    queryKey: ["websites"],
    queryFn: websiteApi.list,
  });

  const { data: usage } = useQuery({
    queryKey: ["usage"],
    queryFn: billingApi.usage,
  });

  const avgScore =
    websites.filter((w) => w.compliance_score !== null).length > 0
      ? Math.round(
          websites.reduce((sum, w) => sum + (w.compliance_score ?? 0), 0) /
            websites.filter((w) => w.compliance_score !== null).length
        )
      : null;

  const criticalCount = websites.filter((w) => w.overall_risk_tier === "prohibited").length;
  const highCount = websites.filter((w) => w.overall_risk_tier === "high").length;

  // Days until Aug 2 2026
  const deadline = new Date("2026-08-02");
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / 86_400_000);

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">EU AI Act Compliance Overview</p>
        </div>
        <Link
          href="/dashboard/websites?add=1"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add website
        </Link>
      </div>

      {/* Deadline banner */}
      {daysLeft > 0 && daysLeft <= 90 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
          <Clock className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm">
            <span className="text-red-400 font-semibold">{daysLeft} days</span>
            <span className="text-white/70"> until EU AI Act high-risk obligations are enforceable (Aug 2, 2026). </span>
            {criticalCount + highCount > 0 && (
              <span className="text-red-400 font-semibold">
                {criticalCount + highCount} site(s) need urgent attention.
              </span>
            )}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Websites Monitored",
            value: websites.length,
            sub: `of ${usage?.websites_limit === -1 ? "∞" : usage?.websites_limit ?? "?"} allowed`,
            icon: <Globe className="w-5 h-5" />,
          },
          {
            label: "Avg Compliance Score",
            value: avgScore !== null ? avgScore : "—",
            sub: avgScore !== null ? (avgScore >= 85 ? "Good standing" : "Needs attention") : "No scans yet",
            icon: <TrendingUp className="w-5 h-5" />,
            valueClass: avgScore !== null ? SCORE_COLOR(avgScore) : "text-white/40",
          },
          {
            label: "Critical / Prohibited",
            value: criticalCount,
            sub: criticalCount > 0 ? "Immediate action required" : "None detected",
            icon: <AlertTriangle className="w-5 h-5" />,
            valueClass: criticalCount > 0 ? "text-red-400" : "text-green-400",
          },
          {
            label: "High Risk",
            value: highCount,
            sub: highCount > 0 ? "Action before Aug 2" : "None detected",
            icon: <Shield className="w-5 h-5" />,
            valueClass: highCount > 0 ? "text-orange-400" : "text-green-400",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-xs font-medium">{stat.label}</span>
              <span className="text-white/20">{stat.icon}</span>
            </div>
            <div className={`text-3xl font-bold mb-1 ${stat.valueClass ?? "text-white"}`}>
              {stat.value}
            </div>
            <div className="text-white/30 text-xs">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Websites list */}
      <div className="glass-card">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white">Websites</h2>
          <Link href="/dashboard/websites" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-white/30">Loading…</div>
        ) : websites.length === 0 ? (
          <div className="p-12 text-center">
            <Globe className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/50 mb-4">No websites yet. Add your first one to start scanning.</p>
            <Link
              href="/dashboard/websites?add=1"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add website
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {websites.slice(0, 10).map((site) => (
              <WebsiteRow key={site.id} site={site} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WebsiteRow({ site }: { site: Website }) {
  const score = site.compliance_score;
  const tier = site.overall_risk_tier ?? "minimal";

  return (
    <Link
      href={`/dashboard/websites/${site.id}`}
      className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors group"
    >
      {/* Favicon / icon */}
      <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
        {site.favicon_url ? (
          <img src={site.favicon_url} alt="" className="w-5 h-5" />
        ) : (
          <Globe className="w-4 h-4 text-white/30" />
        )}
      </div>

      {/* Name + URL */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">
          {site.name ?? new URL(site.url).hostname}
        </p>
        <p className="text-white/30 text-xs truncate">{site.url}</p>
      </div>

      {/* Risk tier */}
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${RISK_COLORS[tier] ?? "risk-badge-minimal"}`}>
        {tier}
      </span>

      {/* Compliance score */}
      <div className="text-right w-16">
        {score !== null ? (
          <span className={`text-lg font-bold ${SCORE_COLOR(score)}`}>{score}</span>
        ) : (
          <span className="text-white/20 text-sm">—</span>
        )}
      </div>

      {/* Last scan */}
      <div className="text-white/30 text-xs w-28 text-right hidden lg:block">
        {site.last_scan_at
          ? formatDistanceToNow(new Date(site.last_scan_at), { addSuffix: true })
          : "Never scanned"}
      </div>

      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
    </Link>
  );
}

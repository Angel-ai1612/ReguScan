"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { websiteApi, scanApi, type Website } from "@/lib/api";
import { Globe, Plus, Play, ExternalLink, Trash2, Loader, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";

const RISK_BADGE: Record<string, string> = {
  prohibited: "risk-badge-prohibited",
  high: "risk-badge-high",
  limited: "risk-badge-limited",
  minimal: "risk-badge-minimal",
};

export default function WebsitesPage() {
  const searchParams = useSearchParams();
  const [adding, setAdding] = useState(searchParams.get("add") === "1");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const { data: websites = [], isLoading } = useQuery({
    queryKey: ["websites"],
    queryFn: websiteApi.list,
  });

  const addMutation = useMutation({
    mutationFn: () => websiteApi.create({ url, name: name || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      setAdding(false);
      setUrl("");
      setName("");
      toast.success("Website added");
    },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? "Failed to add website"),
  });

  const deleteMutation = useMutation({
    mutationFn: websiteApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      toast.success("Website removed");
    },
  });

  const scanMutation = useMutation({
    mutationFn: (websiteId: string) => scanApi.trigger(websiteId),
    onSuccess: (scan) => {
      toast.success("Scan started");
      queryClient.invalidateQueries({ queryKey: ["websites"] });
    },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? "Failed to start scan"),
  });

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Websites</h1>
          <p className="text-white/40 text-sm mt-1">{websites.length} website(s) monitored</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add website
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="glass-card p-5 mb-6">
          <h3 className="font-semibold mb-4">Add a website to scan</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yoursite.com"
              className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name (optional)"
              className="w-44 bg-white/[0.06] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => addMutation.mutate()}
                disabled={!url || addMutation.isPending}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {addMutation.isPending && <Loader className="w-3.5 h-3.5 animate-spin" />}
                Add
              </button>
              <button
                onClick={() => setAdding(false)}
                className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/10 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="glass-card p-12 text-center text-white/30">
          <Loader className="w-6 h-6 animate-spin mx-auto" />
        </div>
      ) : websites.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Globe className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 mb-6">No websites yet. Add your first site to scan for EU AI Act compliance.</p>
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add your first website
          </button>
        </div>
      ) : (
        <div className="glass-card divide-y divide-white/[0.04]">
          {websites.map((site) => (
            <div key={site.id} className="flex items-center gap-4 p-5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                {site.favicon_url ? (
                  <img src={site.favicon_url} alt="" className="w-6 h-6" />
                ) : (
                  <Globe className="w-5 h-5 text-white/30" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/dashboard/websites/${site.id}`} className="hover:text-indigo-300 transition-colors">
                  <p className="text-white font-medium truncate">{site.name ?? new URL(site.url).hostname}</p>
                </Link>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/30 text-xs hover:text-white/60 flex items-center gap-1 mt-0.5 w-fit"
                >
                  {site.url} <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {site.overall_risk_tier && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${RISK_BADGE[site.overall_risk_tier]}`}>
                  {site.overall_risk_tier}
                </span>
              )}

              <ScoreBadge score={site.compliance_score} />

              <div className="text-white/30 text-xs hidden xl:block w-32 text-right">
                {site.last_scan_at
                  ? formatDistanceToNow(new Date(site.last_scan_at), { addSuffix: true })
                  : "Never scanned"}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => scanMutation.mutate(site.id)}
                  disabled={scanMutation.isPending}
                  title="Run scan"
                  className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-indigo-400 transition-colors"
                >
                  {scanMutation.isPending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <Link
                  href={`/dashboard/websites/${site.id}`}
                  className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => {
                    if (confirm("Remove this website?")) deleteMutation.mutate(site.id);
                  }}
                  className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="w-12 text-right text-white/20 text-sm">—</span>;
  const color =
    score >= 85 ? "text-green-400" : score >= 60 ? "text-orange-400" : "text-red-400";
  return <span className={`w-12 text-right text-xl font-bold ${color}`}>{score}</span>;
}

"use client";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { ArrowRight, ExternalLink, Globe, Loader, Play, Plus, Trash2 } from "lucide-react";
import { scanApi, websiteApi, type Website } from "@/lib/api";
import { EmptyState, ErrorState, GlowCard, PageHeader, RiskBadge, StatusPill, scoreTone } from "@/components/ui/premium";

export default function WebsitesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [adding, setAdding] = useState(searchParams.get("add") === "1");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const { data: websites = [], isLoading, isError, refetch } = useQuery({
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
    onError: (e: any) => toast.error(e.response?.data?.detail ?? "Failed to remove website"),
  });

  const scanMutation = useMutation({
    mutationFn: (websiteId: string) => scanApi.trigger(websiteId),
    onSuccess: (scan) => {
      toast.success("Scan started");
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      router.push(`/dashboard/scans/${scan.id}`);
    },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? "Failed to start scan"),
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Websites"
        title="Monitored AI surfaces"
        description="Add public websites, inspect latest compliance scores, and start fresh scans when product pages change."
        actions={
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
          >
            <Plus className="h-4 w-4" /> Add website
          </button>
        }
      />

      {adding && (
        <GlowCard className="mb-6 p-5" accent="cyan">
          {addMutation.isPending && <div className="scan-beam" aria-hidden="true" />}
          <div className="relative z-10 mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black tracking-normal">Add a website to scan</h2>
              <p className="mt-1 text-sm text-white/45">Use the canonical public URL. ReguScan will normalize it before scanning.</p>
            </div>
            <StatusPill tone="cyan">Website AI detection</StatusPill>
          </div>
          <form
            className="relative z-10 flex flex-col gap-3 lg:flex-row"
            aria-busy={addMutation.isPending}
            onSubmit={(event) => {
              event.preventDefault();
              if (url && !addMutation.isPending) addMutation.mutate();
            }}
          >
            <label htmlFor="website-url" className="sr-only">Public website URL</label>
            <input
              id="website-url"
              type="url"
              inputMode="url"
              autoComplete="url"
              autoFocus
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://yoursite.com"
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-300/50 focus:outline-none"
            />
            <label htmlFor="website-name" className="sr-only">Website display name</label>
            <input
              id="website-name"
              type="text"
              autoComplete="organization"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Display name (optional)"
              className="min-w-0 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-300/50 focus:outline-none lg:w-64"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!url || addMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {addMutation.isPending && <Loader className="h-4 w-4 animate-spin" />}
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  router.replace("/dashboard/websites", { scroll: false });
                }}
                className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </GlowCard>
      )}

      {isError ? (
        <ErrorState
          title="Websites could not be loaded"
          description="No risk state is shown because the website request failed. Try the request again."
          onRetry={() => void refetch()}
        />
      ) : isLoading ? (
        <GlowCard className="p-12 text-center text-white/35" accent="slate">
          <Loader className="relative z-10 mx-auto h-6 w-6 animate-spin" />
        </GlowCard>
      ) : websites.length === 0 ? (
        <EmptyState
          icon={Globe}
          title="No websites yet"
          description="Add your first public site to detect AI features, classify risk, and generate an evidence-based compliance report."
          action={
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              <Plus className="h-4 w-4" /> Add your first website
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {websites.map((site) => (
            <WebsiteCard
              key={site.id}
              site={site}
              scanPending={scanMutation.isPending && scanMutation.variables === site.id}
              deletePending={deleteMutation.isPending && deleteMutation.variables === site.id}
              onScan={() => scanMutation.mutate(site.id)}
              onDelete={() => deleteMutation.mutate(site.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WebsiteCard({
  site,
  scanPending,
  deletePending,
  onScan,
  onDelete,
}: {
  site: Website;
  scanPending: boolean;
  deletePending: boolean;
  onScan: () => void;
  onDelete: () => void;
}) {
  const hostname = safeHostname(site.url);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const removeButtonRef = useRef<HTMLButtonElement>(null);
  const cancelDeleteButtonRef = useRef<HTMLButtonElement>(null);
  const confirmationWasOpenedRef = useRef(false);

  useEffect(() => {
    if (confirmingDelete) {
      confirmationWasOpenedRef.current = true;
      cancelDeleteButtonRef.current?.focus();
    } else if (confirmationWasOpenedRef.current) {
      confirmationWasOpenedRef.current = false;
      removeButtonRef.current?.focus();
    }
  }, [confirmingDelete]);

  return (
    <GlowCard className="p-5" accent="slate">
      <div className="relative z-10 flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055]">
          {site.favicon_url ? <img src={site.favicon_url} alt="" className="h-6 w-6" /> : <Globe className="h-5 w-5 text-white/35" />}
        </div>

        <div className="min-w-0 flex-1">
          <Link href={`/dashboard/websites/${site.id}`} className="transition hover:text-cyan-200">
            <h2 className="truncate text-lg font-black tracking-normal text-white">{site.name ?? hostname}</h2>
          </Link>
          <a href={site.url} target="_blank" rel="noreferrer" className="mt-1 flex w-fit max-w-full items-center gap-1 text-xs text-white/[0.36] transition hover:text-white/70">
            <span className="truncate">{site.url}</span> <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        </div>

        <div className="hidden sm:block">
          <RiskBadge tier={site.overall_risk_tier ?? "unknown"} />
        </div>
      </div>

      <div className="relative z-10 mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
          <p className="text-xs text-white/[0.34]">Score</p>
          <p className={`mt-1 text-2xl font-black ${scoreTone(site.compliance_score)}`}>{site.compliance_score ?? "-"}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
          <p className="text-xs text-white/[0.34]">Risk</p>
          <div className="mt-2">
            <RiskBadge tier={site.overall_risk_tier ?? "unknown"} />
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
          <p className="text-xs text-white/[0.34]">Last scan</p>
          <p className="mt-2 text-xs font-semibold leading-5 text-white/[0.64]">
            {site.last_scan_at ? formatDistanceToNow(new Date(site.last_scan_at), { addSuffix: true }) : "Never scanned"}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onScan}
          disabled={scanPending}
          title="Run scan"
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-3 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {scanPending ? <Loader className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Run scan
        </button>
        <Link
          href={`/dashboard/websites/${site.id}`}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/[0.075] hover:text-white"
        >
          Details <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          ref={removeButtonRef}
          type="button"
          onClick={() => setConfirmingDelete(true)}
          disabled={deletePending}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-white/[0.38] transition hover:border-rose-300/30 hover:bg-rose-300/[0.08] hover:text-rose-200"
          aria-label="Remove website"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {confirmingDelete && (
        <div
          className="relative z-10 mt-4 flex flex-col gap-3 rounded-lg border border-rose-200/[0.18] bg-rose-200/[0.05] p-3 sm:flex-row sm:items-center sm:justify-between"
          role="alertdialog"
          aria-label={`Remove ${site.name ?? hostname}`}
          aria-describedby={`remove-website-${site.id}-description`}
          onKeyDown={(event) => {
            if (event.key === "Escape" && !deletePending) {
              event.preventDefault();
              setConfirmingDelete(false);
            }
          }}
        >
          <p id={`remove-website-${site.id}-description`} className="text-sm leading-5 text-rose-100/[0.78]">Remove this website and hide it from the workspace?</p>
          <div className="flex gap-2">
            <button
              ref={cancelDeleteButtonRef}
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={deletePending}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/[0.64] transition hover:bg-white/[0.06]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={deletePending}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-300 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-rose-200 disabled:opacity-50"
            >
              {deletePending && <Loader className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
              Remove
            </button>
          </div>
        </div>
      )}
    </GlowCard>
  );
}

function safeHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

import type { ReactNode } from "react";
import { AlertTriangle, Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "cyan" | "emerald" | "amber" | "rose" | "indigo" | "slate";

const toneClasses: Record<Tone, string> = {
  cyan: "border-cyan-200/[0.18] bg-cyan-200/[0.06] text-cyan-100",
  emerald: "border-emerald-200/[0.18] bg-emerald-200/[0.06] text-emerald-100",
  amber: "border-amber-200/[0.18] bg-amber-200/[0.06] text-amber-100",
  rose: "border-rose-200/[0.18] bg-rose-200/[0.06] text-rose-100",
  indigo: "border-indigo-200/[0.18] bg-indigo-200/[0.06] text-indigo-100",
  slate: "border-white/10 bg-white/[0.045] text-white/70",
};

export function scoreTone(score: number | null | undefined) {
  if (score === null || score === undefined) return "text-white/[0.32]";
  if (score >= 85) return "text-emerald-300";
  if (score >= 60) return "text-amber-300";
  return "text-rose-300";
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/[0.58]">{eyebrow}</p>
        )}
        <h1 className="mt-2 text-3xl font-black leading-tight tracking-normal text-white sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

export function GlowCard({
  children,
  className,
  accent = "cyan",
  id,
}: {
  children: ReactNode;
  className?: string;
  accent?: Tone;
  id?: string;
}) {
  return (
    <div id={id} className={cn("command-card premium-card relative overflow-hidden", toneClasses[accent], className)}>
      {children}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "cyan",
  valueClassName,
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: LucideIcon;
  tone?: Tone;
  valueClassName?: string;
  className?: string;
}) {
  return (
    <GlowCard accent={tone} className={cn("metric-card p-5", className)}>
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/[0.34]">{label}</p>
          <div className={cn("mt-3 text-3xl font-black tracking-normal text-white", valueClassName)}>{value}</div>
          {sub && <div className="mt-2 text-xs leading-5 text-white/[0.42]">{sub}</div>}
        </div>
        {Icon && (
          <span className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border", toneClasses[tone])}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
    </GlowCard>
  );
}

export function RiskBadge({
  tier,
  className,
}: {
  tier?: string | null;
  className?: string;
}) {
  const normalized = tier ?? "unknown";
  const tone =
    normalized === "prohibited"
      ? "risk-badge-prohibited"
      : normalized === "high"
        ? "risk-badge-high"
        : normalized === "limited"
          ? "risk-badge-limited"
          : normalized === "minimal"
            ? "risk-badge-minimal"
            : "border-white/10 bg-white/[0.045] text-white/[0.48]";

  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em]", tone, className)}>
      {normalized === "unknown" ? "Not assessed" : normalized.replace(/_/g, " ")}
    </span>
  );
}

export function StatusPill({
  children,
  tone = "slate",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold", toneClasses[tone], className)}>
      {children}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <GlowCard className={cn("p-10 text-center sm:p-14", className)} accent="slate">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-white/35">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="mt-5 text-xl font-black tracking-normal text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">{description}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </GlowCard>
  );
}

export function LoadingState({
  label = "Loading data",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <GlowCard className={cn("p-10 text-center", className)} accent="slate">
      <div className="relative z-10" role="status" aria-live="polite">
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-cyan-200" aria-hidden="true" />
        <p className="mt-3 text-sm text-white/[0.48]">{label}</p>
      </div>
    </GlowCard>
  );
}

export function ErrorState({
  title = "We could not load this data",
  description = "Check your connection and try again.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <GlowCard className={cn("p-8 text-center", className)} accent="amber">
      <div className="relative z-10" role="alert">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg border border-amber-200/[0.18] bg-amber-200/[0.06] text-amber-200">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/[0.48]">{description}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-lg border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            Try again
          </button>
        )}
      </div>
    </GlowCard>
  );
}

export function ProgressBar({
  value,
  tone = "cyan",
  className,
  label = "Progress",
}: {
  value: number;
  tone?: Exclude<Tone, "slate">;
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const fill =
    tone === "emerald"
      ? "from-emerald-400 to-cyan-300"
      : tone === "amber"
        ? "from-amber-300 to-orange-400"
        : tone === "rose"
          ? "from-rose-400 to-orange-300"
          : tone === "indigo"
            ? "from-indigo-400 to-cyan-300"
            : "from-cyan-300 to-blue-400";

  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-white/10", className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
    >
      <div
        className={cn("scan-progress h-full rounded-full bg-gradient-to-r transition-all duration-500", fill)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

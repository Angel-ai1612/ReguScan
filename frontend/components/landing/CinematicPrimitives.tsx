"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { AlertTriangle, Check, FileText, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

export function DynamicGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.055)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]",
        className
      )}
    />
  );
}

export function ScanLine({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 z-20 h-px bg-cyan-100 shadow-[0_0_18px_3px_rgba(103,232,249,0.55)]",
        className
      )}
      initial={{ top: "12%", opacity: 0.35 }}
      animate={reducedMotion ? { top: "48%", opacity: 0.5 } : { top: ["10%", "90%", "10%"], opacity: [0, 0.9, 0] }}
      transition={reducedMotion ? undefined : { duration: 4.8, ease: "easeInOut", repeat: Infinity }}
    />
  );
}

export function RiskPulse({ tone = "amber", label }: { tone?: "amber" | "cyan" | "rose" | "emerald"; label?: string }) {
  const reducedMotion = useReducedMotion();
  const tones = {
    amber: "bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.75)]",
    cyan: "bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.75)]",
    rose: "bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.75)]",
    emerald: "bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.75)]",
  };
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/[0.64]">
      <span className="relative flex h-2.5 w-2.5">
        {!reducedMotion && (
          <motion.span
            aria-hidden="true"
            className={cn("absolute inset-0 rounded-full", tones[tone])}
            animate={{ scale: [1, 2.3], opacity: [0.6, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span className={cn("relative h-2.5 w-2.5 rounded-full", tones[tone])} />
      </span>
      {label}
    </span>
  );
}

export function GlassCommandPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[18px] border border-white/[0.11] bg-[#09111f]/90 shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl",
        className
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/55 to-transparent" />
      {children}
    </div>
  );
}

export function EvidenceBeacon({ label, value, state = "signal" }: { label: string; value: string; state?: "signal" | "warning" | "verified" }) {
  const icon = state === "warning" ? <AlertTriangle className="h-3.5 w-3.5" /> : state === "verified" ? <Check className="h-3.5 w-3.5" /> : <Radio className="h-3.5 w-3.5" />;
  const tone = state === "warning" ? "text-amber-200" : state === "verified" ? "text-emerald-200" : "text-cyan-200";
  return (
    <div className="grid grid-cols-[18px_minmax(0,1fr)] gap-3 border-b border-white/[0.07] py-3 last:border-b-0">
      <span className={cn("mt-0.5", tone)}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/[0.36]">{label}</p>
        <p className="mt-1 truncate font-mono text-xs text-white/[0.78]">{value}</p>
      </div>
    </div>
  );
}

export function ComplianceRadar({ score = 72 }: { score?: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="relative grid aspect-square place-items-center rounded-full border border-cyan-200/15 bg-cyan-200/[0.025]">
      {[78, 56, 34].map((size, index) => (
        <motion.span
          key={size}
          aria-hidden="true"
          className="absolute rounded-full border border-cyan-200/15"
          style={{ width: `${size}%`, height: `${size}%` }}
          animate={reducedMotion ? undefined : { opacity: [0.2, 0.65, 0.2], scale: [0.98, 1.03, 0.98] }}
          transition={{ duration: 4 + index, repeat: Infinity, delay: index * 0.45 }}
        />
      ))}
      <div className="relative z-10 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-100/[0.54]">readiness</p>
        <p className="mt-1 text-5xl font-light tracking-[-0.06em] text-white">{score}</p>
        <RiskPulse tone="amber" label="review" />
      </div>
    </div>
  );
}

export function AnimatedRegulationText({ articles = ["ART. 50", "ART. 13", "ART. 9"] }: { articles?: string[] }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="flex flex-wrap gap-2" aria-label={`Related regulations: ${articles.join(", ")}`}>
      {articles.map((article, index) => (
        <motion.span
          key={article}
          className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-white/[0.54]"
          initial={reducedMotion ? false : { opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: index * 0.12 }}
        >
          {article}
        </motion.span>
      ))}
    </div>
  );
}

export function ReportFragments() {
  const reducedMotion = useReducedMotion();
  const fragments = [
    ["Evidence", "/pricing · intercomSettings"],
    ["Classification", "Limited risk · 80% confidence"],
    ["Gap", "AI interaction notice missing"],
  ];
  return (
    <div className="space-y-2">
      {fragments.map(([label, value], index) => (
        <motion.div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-3"
          initial={reducedMotion ? false : { opacity: 0, y: 16, rotateX: -8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: index * 0.14 }}
        >
          <FileText className="h-4 w-4 shrink-0 text-cyan-200/[0.72]" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/[0.32]">{label}</p>
            <p className="mt-0.5 truncate text-xs text-white/[0.72]">{value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function SectionTransition({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.75, ease: [0.2, 0.75, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function MotionWordmark({ compact = false }: { compact?: boolean }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.span
      className={cn("inline-flex items-baseline tracking-[-0.04em] text-white", compact ? "text-lg font-semibold" : "text-5xl font-light sm:text-6xl")}
      initial={reducedMotion ? false : { opacity: 0, letterSpacing: "0.18em", filter: "blur(10px)" }}
      animate={{ opacity: 1, letterSpacing: "-0.04em", filter: "blur(0px)" }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      Regu<span className="font-semibold text-cyan-200">Scan</span>
    </motion.span>
  );
}

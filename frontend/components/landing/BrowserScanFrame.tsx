"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, Bot, Check, FileText, Globe2, Lock, Search, ShieldCheck } from "lucide-react";
import { EvidenceBeacon, GlassCommandPanel, RiskPulse, ScanLine } from "@/components/landing/CinematicPrimitives";
import { cn } from "@/lib/utils";

export const scanStages = [
  {
    name: "Crawl",
    verb: "Mapping public surfaces",
    detail: "42 pages · 6 scripts · 2 blocked routes",
    evidence: ["/", "/pricing", "/careers"],
  },
  {
    name: "Detect",
    verb: "AI signal located",
    detail: "Chat launcher + intercomSettings",
    evidence: ["DOM node", "script config", "launcher copy"],
  },
  {
    name: "Classify",
    verb: "Transparency risk classified",
    detail: "Limited risk · 80% confidence",
    evidence: ["chatbot", "user interaction", "public surface"],
  },
  {
    name: "Evidence",
    verb: "Source trail assembled",
    detail: "/pricing · line 184 · widget config",
    evidence: ["page URL", "matched signal", "confidence"],
  },
  {
    name: "Gaps",
    verb: "Disclosure gap mapped",
    detail: "AI interaction notice missing",
    evidence: ["Art. 50", "high priority", "suggested fix"],
  },
  {
    name: "Report",
    verb: "Review dossier ready",
    detail: "72 readiness · manual review required",
    evidence: ["4 systems", "3 priority gaps", "crawl caveat"],
  },
];

export default function BrowserScanFrame({
  stage,
  className,
  compact = false,
}: {
  stage?: number;
  className?: string;
  compact?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const [automaticStage, setAutomaticStage] = useState(reducedMotion ? scanStages.length - 1 : 0);
  const activeStage = Math.max(0, Math.min(scanStages.length - 1, stage ?? automaticStage));
  const active = scanStages[activeStage];

  useEffect(() => {
    if (stage !== undefined || reducedMotion) return;
    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setAutomaticStage((current) => (current + 1) % scanStages.length);
    }, 1450);
    return () => window.clearInterval(interval);
  }, [reducedMotion, stage]);

  return (
    <GlassCommandPanel className={cn("isolate", className)}>
      <div className="flex h-11 items-center gap-3 border-b border-white/[0.08] bg-black/25 px-3 sm:px-4">
        <div className="hidden gap-1.5 sm:flex" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-rose-300/55" />
          <span className="h-2 w-2 rounded-full bg-amber-300/55" />
          <span className="h-2 w-2 rounded-full bg-emerald-300/55" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 font-mono text-[10px] text-white/[0.52]">
          <Lock className="h-3 w-3 shrink-0 text-emerald-200/[0.72]" />
          <span className="truncate">https://acme.ai/pricing</span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-cyan-100/[0.48]">live trace</span>
      </div>

      <div className={cn("relative overflow-hidden", compact ? "min-h-[360px]" : "min-h-[520px] sm:min-h-[560px]")}>
        <Image
          src="/hero-reguscan-command-center.png"
          alt="Layered ReguScan command center interface used as the browser scan scene backdrop."
          fill
          priority={!compact}
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover opacity-[0.17] saturate-50"
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(5,9,17,0.98)_8%,rgba(5,9,17,0.78)_50%,rgba(5,9,17,0.94)_100%)]" />
        {activeStage < 4 && <ScanLine />}

        <div className="relative z-10 grid min-h-[inherit] gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_0.82fr]">
          <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#07101b]/[0.78] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/[0.34]">Observed page</p>
                <h3 className="mt-2 text-lg font-medium tracking-[-0.025em] text-white">Acme pricing</h3>
              </div>
              <RiskPulse tone={activeStage >= 4 ? "amber" : "cyan"} label={activeStage >= 4 ? "gap found" : "scanning"} />
            </div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="h-2 w-24 rounded-full bg-white/10" />
                <div className="mt-3 h-2 w-4/5 rounded-full bg-white/[0.055]" />
                <div className="mt-2 h-2 w-3/5 rounded-full bg-white/[0.055]" />
              </div>
              <motion.div
                className="relative rounded-xl border border-cyan-200/[0.28] bg-cyan-200/[0.055] p-4"
                animate={reducedMotion ? undefined : { borderColor: ["rgba(103,232,249,.18)", "rgba(103,232,249,.52)", "rgba(103,232,249,.18)"] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-200/20 bg-cyan-200/[0.08] text-cyan-100">
                    <Bot className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">Need help choosing a plan?</p>
                    <p className="mt-1 text-xs text-white/[0.42]">AI-enabled support assistant</p>
                  </div>
                </div>
                {activeStage >= 1 && (
                  <motion.div
                    className="absolute -right-2 -top-2 rounded-full border border-cyan-200/30 bg-[#081522] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-cyan-100"
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    AI signal
                  </motion.div>
                )}
              </motion.div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <div className="h-2 w-12 rounded-full bg-white/10" />
                  <div className="mt-3 h-7 w-20 rounded bg-white/[0.055]" />
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <div className="h-2 w-16 rounded-full bg-white/10" />
                  <div className="mt-3 h-7 w-24 rounded bg-white/[0.055]" />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                className="absolute inset-x-4 bottom-4 rounded-xl border border-white/[0.09] bg-[#060b13]/[0.94] p-3 shadow-2xl backdrop-blur-xl sm:inset-x-5"
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-100/[0.56]">Stage {activeStage + 1} · {active.name}</p>
                    <p className="mt-1 text-sm font-medium text-white/[0.88]">{active.verb}</p>
                  </div>
                  {activeStage === scanStages.length - 1 ? <ShieldCheck className="h-4 w-4 text-emerald-200" /> : <Search className="h-4 w-4 text-cyan-200" />}
                </div>
                <p className="mt-2 font-mono text-[10px] text-white/[0.46]">{active.detail}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex min-w-0 flex-col rounded-xl border border-white/[0.08] bg-[#070d17]/[0.88] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/[0.32]">Evidence rail</p>
                <p className="mt-2 text-base font-medium tracking-[-0.02em]">{active.name} intelligence</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-light tracking-[-0.06em] text-white">{activeStage === 5 ? "72" : `0${activeStage + 1}`}</p>
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/[0.32]">{activeStage === 5 ? "readiness" : "stage"}</p>
              </div>
            </div>

            <div className="mt-5 flex-1">
              <EvidenceBeacon label="Found on" value="/pricing" state="verified" />
              <EvidenceBeacon label="Signal" value="window.intercomSettings" />
              <EvidenceBeacon label="Risk class" value={activeStage >= 2 ? "Limited · 80% confidence" : "Pending classification"} state={activeStage >= 2 ? "verified" : "signal"} />
              <EvidenceBeacon label="Regulation" value={activeStage >= 4 ? "EU AI Act · Article 50" : "Mapping obligation"} state={activeStage >= 4 ? "warning" : "signal"} />
              <EvidenceBeacon label="Recommended fix" value={activeStage >= 4 ? "Add AI interaction notice" : "Awaiting evidence link"} state={activeStage >= 4 ? "warning" : "signal"} />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {active.evidence.map((item) => (
                <span key={item} className="truncate rounded-lg border border-white/[0.07] bg-white/[0.025] px-2 py-2 text-center font-mono text-[8px] uppercase tracking-[0.1em] text-white/[0.42]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-6 border-t border-white/[0.08] bg-black/[0.22]">
          {scanStages.map((item, index) => (
            <div
              key={item.name}
              className={cn(
                "border-r border-white/[0.06] px-1 py-2 text-center last:border-r-0 sm:px-2",
                index === activeStage ? "bg-cyan-200/[0.08] text-cyan-100" : index < activeStage ? "text-emerald-200/[0.56]" : "text-white/[0.28]"
              )}
            >
              <span className="font-mono text-[8px] uppercase tracking-[0.08em] sm:text-[9px]">{item.name}</span>
              {index < activeStage && <Check className="mx-auto mt-1 h-3 w-3" />}
            </div>
          ))}
        </div>
        <p className="sr-only" aria-live={stage === undefined ? "off" : "polite"} aria-atomic="true">
          Analysis stage {activeStage + 1} of {scanStages.length}: {active.verb}. {active.detail}
        </p>
      </div>
    </GlassCommandPanel>
  );
}

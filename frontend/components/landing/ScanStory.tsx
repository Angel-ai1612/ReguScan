"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { Bot, FileSearch, FileText, Globe2, Radar, ShieldCheck } from "lucide-react";
import BrowserScanFrame, { scanStages } from "@/components/landing/BrowserScanFrame";
import { DynamicGrid, RiskPulse } from "@/components/landing/CinematicPrimitives";
import { cn } from "@/lib/utils";

const icons = [Globe2, Radar, Bot, ShieldCheck, FileSearch, FileText];

export default function ScanStory() {
  const target = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(reducedMotion ? scanStages.length - 1 : 0);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (reducedMotion) return;
    const next = Math.min(scanStages.length - 1, Math.floor(latest * scanStages.length));
    setActive((current) => (current === next ? current : next));
  });

  const activeStage = scanStages[active];
  const ActiveIcon = icons[active];

  return (
    <section ref={target} id="scan-story" className="relative border-y border-white/[0.07] bg-[#04070d] lg:min-h-[430vh]">
      <DynamicGrid className="opacity-70" />

      <div className="relative px-5 py-20 sm:px-8 lg:hidden">
        <div className="mx-auto max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100/[0.54]">From website to risk intelligence</p>
          <h2 className="mt-4 text-4xl font-light leading-[1.03] tracking-[-0.055em] text-white">
            One continuous evidence trail. Six reviewable stages.
          </h2>
          <p className="mt-5 text-base leading-7 text-white/[0.58]">
            Mobile keeps the full story without pinning the viewport. Every stage remains readable and the final report never hides crawl-quality caveats.
          </p>
          <BrowserScanFrame stage={5} compact className="mt-10" />
          <ol className="mt-8 border-l border-white/10 pl-5">
            {scanStages.map((stage, index) => {
              const Icon = icons[index];
              return (
                <li key={stage.name} className="relative pb-8 last:pb-0">
                  <span className="absolute -left-[25px] top-1 h-2 w-2 rounded-full bg-cyan-200" />
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-cyan-200/[0.72]" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/[0.36]">0{index + 1}</span>
                    <h3 className="text-base font-medium text-white">{stage.name}</h3>
                  </div>
                  <p className="mt-2 text-sm text-white/[0.66]">{stage.verb}</p>
                  <p className="mt-1 font-mono text-[10px] text-white/[0.36]">{stage.detail}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="sticky top-0 hidden h-screen min-h-[720px] items-center overflow-hidden px-8 py-10 lg:flex">
        <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-[0.72fr_1.72fr_0.46fr] items-center gap-8">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100/[0.54]">From website to risk intelligence</p>
            <motion.div
              key={activeStage.name}
              initial={reducedMotion ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.45 }}
              className="mt-8"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-200/[0.16] bg-cyan-200/[0.06] text-cyan-100">
                <ActiveIcon className="h-5 w-5" />
              </span>
              <p className="mt-7 font-mono text-xs tracking-[0.18em] text-white/[0.32]">0{active + 1} / 06</p>
              <h2 className="mt-3 text-5xl font-light leading-[0.98] tracking-[-0.06em] text-white">{activeStage.name}</h2>
              <p className="mt-5 max-w-sm text-lg leading-7 text-white/[0.74]">{activeStage.verb}</p>
              <p className="mt-3 max-w-sm font-mono text-[11px] leading-5 text-white/[0.38]">{activeStage.detail}</p>
              <div className="mt-7">
                <RiskPulse tone={active === 5 ? "emerald" : active >= 4 ? "amber" : "cyan"} label={active === 5 ? "report ready" : active >= 4 ? "review state" : "live evidence"} />
              </div>
            </motion.div>
          </div>

          <BrowserScanFrame stage={active} compact />

          <nav aria-label="Scan story stages" className="justify-self-end">
            <ol className="space-y-3">
              {scanStages.map((stage, index) => (
                <li key={stage.name}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-current={index === active ? "step" : undefined}
                    className={cn(
                      "group flex min-h-11 items-center gap-3 rounded-full border px-3 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200",
                      index === active
                        ? "border-cyan-200/30 bg-cyan-200/[0.08] text-cyan-100"
                        : "border-transparent text-white/[0.28] hover:border-white/10 hover:text-white/60"
                    )}
                  >
                    <span className="font-mono text-[9px]">0{index + 1}</span>
                    <span className={cn("h-1.5 rounded-full transition-all", index === active ? "w-8 bg-cyan-200" : "w-2 bg-white/20 group-hover:w-4")} />
                    <span className="sr-only">{stage.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  FileSearch,
  FileText,
  Gauge,
  Globe2,
  Play,
  ScanSearch,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DemoVideoModalProps = {
  /** Rendered only when a verified video asset is explicitly supplied. */
  videoSrc?: string;
  posterSrc?: string;
};

const scanSteps = [
  {
    label: "Crawl",
    detail: "18 public pages mapped",
    icon: Globe2,
    tone: "text-cyan-100 border-cyan-200/20 bg-cyan-200/[0.09]",
  },
  {
    label: "Detect",
    detail: "AI chat widget identified",
    icon: Bot,
    tone: "text-indigo-100 border-indigo-200/20 bg-indigo-200/[0.09]",
  },
  {
    label: "Classify",
    detail: "Transparency review required",
    icon: ShieldCheck,
    tone: "text-amber-100 border-amber-200/20 bg-amber-200/[0.09]",
  },
  {
    label: "Report",
    detail: "Article 50 evidence prepared",
    icon: FileText,
    tone: "text-emerald-100 border-emerald-200/20 bg-emerald-200/[0.09]",
  },
] as const;

const evidenceRows = [
  ["Found on", "/pricing"],
  ["Signal", "chat widget config + launcher copy"],
  ["Risk", "limited-risk transparency review"],
  ["Article", "EU AI Act · Article 50"],
] as const;

export default function DemoVideoModal({
  videoSrc,
  posterSrc = "/hero-reguscan-command-center.png",
}: DemoVideoModalProps = {}) {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const showVideo = Boolean(videoSrc && !videoFailed);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(query.matches);

    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    setVideoFailed(false);
  }, [videoSrc]);

  useEffect(() => {
    if (!open || showVideo || reduceMotion) {
      setActiveStep(reduceMotion ? scanSteps.length - 1 : 0);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % scanSteps.length);
    }, 1700);

    return () => window.clearInterval(interval);
  }, [open, reduceMotion, showVideo]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="group relative isolate min-h-[380px] w-full overflow-hidden rounded-[18px] border border-white/10 bg-slate-950 text-left shadow-[0_28px_100px_rgba(0,0,0,0.34)] transition duration-300 hover:-translate-y-1 hover:border-cyan-200/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
        >
          <Image
            src={posterSrc}
            alt=""
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="-z-20 object-cover object-center opacity-55 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-65 motion-reduce:transition-none"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,7,18,0.98)_0%,rgba(3,7,18,0.9)_44%,rgba(3,7,18,0.42)_100%)]" />
          <div className="scan-beam" aria-hidden="true" />

          <div className="relative flex min-h-[380px] flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-slate-950/65 px-3 py-1.5 text-xs font-semibold text-cyan-100 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
                Sample evidence trace
              </span>
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_0_40px_rgba(103,232,249,0.14)] backdrop-blur-md transition duration-300 group-hover:scale-105 group-hover:border-cyan-200/40 group-hover:bg-cyan-200 group-hover:text-slate-950">
                <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
              </span>
            </div>

            <div className="max-w-2xl pt-16">
              <div className="mb-5 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md border border-white/[0.12] bg-black/35 px-3 py-2 font-mono text-white/[0.72] backdrop-blur-md">
                  acme.ai/pricing
                </span>
                <span className="rounded-md border border-amber-200/20 bg-amber-200/[0.09] px-3 py-2 font-semibold text-amber-100 backdrop-blur-md">
                  Article 50 signal
                </span>
                <span className="rounded-md border border-emerald-200/20 bg-emerald-200/[0.09] px-3 py-2 font-semibold text-emerald-100 backdrop-blur-md">
                  80% confidence
                </span>
              </div>
              <h3 className="max-w-xl text-3xl font-light leading-tight tracking-[-0.045em] text-white sm:text-4xl">
                See a website become a traceable evidence trail.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/[0.68] sm:text-base sm:leading-7">
                Follow one public URL through crawl, AI detection, risk classification, and a review-ready EU AI Act finding.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-100">
                Open scan walkthrough <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              </span>
            </div>
          </div>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/[0.84] backdrop-blur-md data-[state=closed]:opacity-0 data-[state=open]:opacity-100 motion-safe:transition-opacity" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-[14px] border border-white/[0.14] bg-[#050812] p-0 text-white shadow-[0_32px_120px_rgba(0,0,0,0.72)] focus:outline-none"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            closeButtonRef.current?.focus();
          }}
        >
          <header className="sticky top-0 z-30 flex items-start justify-between gap-5 border-b border-white/10 bg-[#050812]/[0.94] p-4 backdrop-blur-xl sm:px-6 sm:py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/[0.66]">Product walkthrough</p>
              <Dialog.Title className="mt-1.5 text-xl font-medium tracking-[-0.03em] sm:text-2xl">
                From public URL to review-ready evidence
              </Dialog.Title>
              <Dialog.Description className="mt-2 max-w-2xl text-sm leading-6 text-white/[0.58]">
                A sample ReguScan trace showing how a detected AI interaction becomes an explainable compliance finding.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.05] text-white/[0.72] transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                aria-label="Close scan walkthrough"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </header>

          <div className="grid lg:grid-cols-[1.42fr_0.58fr]">
            <div className="relative min-h-[430px] overflow-hidden border-b border-white/10 bg-slate-950 lg:min-h-[620px] lg:border-b-0 lg:border-r">
              {showVideo ? (
                <video
                  src={videoSrc}
                  poster={posterSrc}
                  autoPlay={!reduceMotion}
                  controls
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  onError={() => setVideoFailed(true)}
                  className="h-full min-h-[430px] w-full bg-slate-950 object-cover lg:min-h-[620px]"
                  aria-label="ReguScan website scan walkthrough"
                />
              ) : (
                <ScanSequence posterSrc={posterSrc} activeStep={activeStep} />
              )}
            </div>

            <aside className="bg-[linear-gradient(180deg,rgba(103,232,249,0.045),transparent_38%)] p-5 sm:p-6 lg:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/[0.38]">Sample finding</p>
                  <h3 className="mt-2 text-xl font-medium tracking-[-0.025em]">Chatbot disclosure missing</h3>
                </div>
                <span className="rounded-full border border-orange-200/[0.22] bg-orange-200/[0.09] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-orange-100">
                  High
                </span>
              </div>

              <dl className="mt-6 space-y-2.5">
                {evidenceRows.map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-3.5">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/[0.36]">{label}</dt>
                    <dd className="mt-1.5 text-sm leading-5 text-white/[0.78]">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 rounded-lg border border-emerald-200/[0.16] bg-emerald-200/[0.06] p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Recommended action
                </p>
                <p className="mt-2 text-sm leading-6 text-white/[0.62]">
                  Add a clear AI interaction notice beside the launcher before a visitor begins the conversation.
                </p>
              </div>

              <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-white/[0.42]">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-200" aria-hidden="true" />
                ReguScan provides technical compliance guidance, not legal advice.
              </p>
            </aside>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ScanSequence({ posterSrc, activeStep }: { posterSrc: string; activeStep: number }) {
  const active = scanSteps[activeStep];
  const ActiveIcon = active.icon;

  return (
    <div className="relative min-h-[430px] lg:min-h-[620px]" aria-hidden="true">
      <Image
        src={posterSrc}
        alt=""
        fill
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="object-cover object-center opacity-50"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,18,0.25),rgba(2,6,18,0.95)),radial-gradient(circle_at_60%_28%,rgba(103,232,249,0.14),transparent_38%)]" />
      <div className="scan-beam" />

      <div className="relative flex min-h-[430px] flex-col p-4 sm:p-6 lg:min-h-[620px] lg:p-8">
        <div className="rounded-lg border border-white/[0.12] bg-slate-950/[0.72] shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-300/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
            </div>
            <div className="min-w-0 flex-1 truncate rounded-md border border-white/[0.08] bg-black/25 px-3 py-1.5 font-mono text-xs text-white/[0.54]">
              https://acme.ai/pricing
            </div>
            <ScanSearch className="h-4 w-4 text-cyan-200" />
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:p-5">
            <div className={cn("rounded-lg border p-4 transition duration-500", active.tone)}>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
                <ActiveIcon className="h-4 w-4" /> {active.label} in progress
              </p>
              <p className="mt-2 text-lg font-bold text-white">{active.detail}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/25 px-5 py-3 text-left sm:text-right">
              <p className="text-xs uppercase tracking-[0.16em] text-white/[0.36]">Readiness</p>
              <p className="mt-1 text-4xl font-light tracking-[-0.05em] text-amber-200">72</p>
            </div>
          </div>
        </div>

        <div className="mt-auto grid gap-2 pt-8 sm:grid-cols-4">
          {scanSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isComplete = index < activeStep;

            return (
              <div
                key={step.label}
                className={cn(
                  "rounded-lg border p-3 backdrop-blur-md transition duration-500",
                  isActive
                    ? step.tone
                    : isComplete
                      ? "border-emerald-200/15 bg-emerald-200/[0.06] text-white/[0.68]"
                      : "border-white/10 bg-slate-950/60 text-white/[0.38]"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <Icon className="h-4 w-4" />
                  {isComplete ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-200" />
                  ) : index === 2 ? (
                    <Gauge className="h-3.5 w-3.5" />
                  ) : index === 3 ? (
                    <FileSearch className="h-3.5 w-3.5" />
                  ) : null}
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em]">{step.label}</p>
                <p className="mt-1 hidden text-xs leading-5 opacity-70 sm:block">{step.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

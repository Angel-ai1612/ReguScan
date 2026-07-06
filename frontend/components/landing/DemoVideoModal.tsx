"use client";

import { useEffect, useId, useState } from "react";
import { FileText, Play, ScanSearch, X } from "lucide-react";

export default function DemoVideoModal() {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] text-left transition hover:border-cyan-200/28 hover:bg-white/[0.06]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(103,232,249,0.2),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.2),rgba(8,13,28,0.92))]" />
        <div className="relative min-h-[320px] p-6 sm:p-8">
          <div className="mb-20 flex items-center justify-between">
            <span className="rounded-full border border-cyan-200/18 bg-cyan-200/[0.08] px-3 py-1 text-xs font-semibold text-cyan-100">
              Demo scan preview
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/14 bg-white/[0.08] text-white transition group-hover:scale-105 group-hover:bg-cyan-200 group-hover:text-slate-950">
              <Play className="h-5 w-5 fill-current" />
            </span>
          </div>

          <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["URL", "example.com"],
              ["Signal", "AI chatbot"],
              ["Report", "Art. 50 gap"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-white/32">{label}</p>
                <p className="mt-2 text-sm font-semibold text-white/80">{value}</p>
              </div>
            ))}
          </div>
          <h3 className="mt-6 text-3xl font-black tracking-normal text-white">Watch a website become an evidence trail.</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
            A lightweight modal is ready for the real demo video when it exists. Until then, the preview shows the exact
            product story: scan, detect, classify, and report.
          </p>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/78 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="command-card max-h-[90vh] w-full max-w-4xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/62">Watch demo scan</p>
                <h2 id={titleId} className="mt-1 text-xl font-black tracking-normal">
                  ReguScan scan walkthrough
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-white/70 transition hover:bg-white/[0.075] hover:text-white"
                aria-label="Close demo modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="min-h-[360px] bg-[linear-gradient(135deg,rgba(103,232,249,0.12),rgba(15,23,42,0.96))] p-6">
                <div className="h-full rounded-lg border border-white/10 bg-slate-950/46 p-5">
                  <div className="mb-5 flex items-center gap-2 text-sm text-white/54">
                    <ScanSearch className="h-4 w-4 text-cyan-200" /> Live scan sequence
                  </div>
                  <div className="space-y-3">
                    {["Crawl public pages", "Detect AI systems", "Classify EU AI Act risk", "Generate report evidence"].map(
                      (step, index) => (
                        <div key={step} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-200/14 text-xs font-bold text-cyan-100">
                            {index + 1}
                          </span>
                          <span className="text-sm text-white/74">{step}</span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-6 rounded-lg border border-emerald-200/16 bg-emerald-200/[0.06] p-4">
                    <p className="flex items-start gap-2 text-sm leading-6 text-white/62">
                      <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-200" />
                      Demo video slot is intentionally asset-safe. The modal works now, and a real scan recording can be added later without changing the layout.
                    </p>
                  </div>
                </div>
              </div>
              <aside className="border-t border-white/10 p-6 lg:border-l lg:border-t-0">
                <h3 className="text-lg font-black tracking-normal">What the demo should show</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-white/58">
                  <li>Entering a public website URL</li>
                  <li>Progress through crawl, detection, classification, and report stages</li>
                  <li>Evidence rows tied to page paths and technical signals</li>
                  <li>A final compliance report with guidance, not legal guarantees</li>
                </ul>
              </aside>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

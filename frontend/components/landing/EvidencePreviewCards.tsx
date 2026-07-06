"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, FileSearch, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type EvidenceCard = {
  title: string;
  severity: "critical" | "high" | "medium" | "review";
  source: string;
  article: string;
  recommendation: string;
};

const cards: EvidenceCard[] = [
  {
    title: "Chatbot disclosure missing",
    severity: "high",
    source: "/pricing widget config",
    article: "EU AI Act Art. 50",
    recommendation: "Add a clear AI interaction notice beside the launcher before users start the conversation.",
  },
  {
    title: "Recruitment AI detected",
    severity: "critical",
    source: "/careers screening form",
    article: "High-risk workflow review",
    recommendation: "Document human oversight, risk controls, and candidate notification before expanding the workflow.",
  },
  {
    title: "AI-generated content not labeled",
    severity: "medium",
    source: "/blog authoring metadata",
    article: "Transparency guidance",
    recommendation: "Label AI-generated or AI-assisted content in a place users can understand before they rely on it.",
  },
  {
    title: "Low crawl confidence",
    severity: "review",
    source: "2 blocked pages",
    article: "Needs review",
    recommendation: "Review blocked pages manually so a clean score is not treated as confirmed compliance.",
  },
];

const severityStyles: Record<EvidenceCard["severity"], string> = {
  critical: "border-rose-300/24 bg-rose-300/[0.08] text-rose-100",
  high: "border-orange-300/24 bg-orange-300/[0.08] text-orange-100",
  medium: "border-amber-300/24 bg-amber-300/[0.08] text-amber-100",
  review: "border-cyan-300/24 bg-cyan-300/[0.08] text-cyan-100",
};

export default function EvidencePreviewCards() {
  const [active, setActive] = useState(0);
  const current = cards[active];

  const stackedCards = useMemo(
    () =>
      cards.map((card, index) => {
        const offset = (index - active + cards.length) % cards.length;
        return { card, offset };
      }),
    [active]
  );

  function move(direction: -1 | 1) {
    setActive((value) => (value + direction + cards.length) % cards.length);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="relative min-h-[360px]">
        {stackedCards.map(({ card, offset }) => (
          <article
            key={card.title}
            aria-hidden={offset !== 0}
            className={cn(
              "evidence-stack-card command-card absolute inset-x-0 top-0 p-6 transition duration-300",
              offset === 0 ? "z-30 opacity-100" : "pointer-events-none opacity-45",
              offset === 1 && "z-20 translate-x-5 translate-y-5 scale-[0.96]",
              offset === 2 && "z-10 translate-x-10 translate-y-10 scale-[0.92]",
              offset > 2 && "opacity-0"
            )}
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/36">Sample finding</p>
                <h3 className="mt-3 max-w-xl text-3xl font-black tracking-normal">{card.title}</h3>
              </div>
              <span className={cn("rounded-full border px-3 py-1 text-xs font-bold uppercase", severityStyles[card.severity])}>
                {card.severity}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <EvidenceField label="Source" value={card.source} />
              <EvidenceField label="Article" value={card.article} />
            </div>
            <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-200" /> Recommended action
              </p>
              <p className="text-sm leading-6 text-white/58">{card.recommendation}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="command-card flex flex-col justify-between p-6">
        <div>
          <FileSearch className="h-6 w-6 text-cyan-200" />
          <h3 className="mt-4 text-2xl font-black tracking-normal">Evidence cards stay reviewable.</h3>
          <p className="mt-3 text-sm leading-6 text-white/58">
            The preview uses realistic AI risk findings instead of generic animation content. Each card pairs the risk with
            source evidence, article context, and a next action.
          </p>
        </div>
        <div className="mt-8">
          <div className="mb-4 flex gap-2">
            {cards.map((card, index) => (
              <button
                key={card.title}
                type="button"
                aria-label={`Show ${card.title}`}
                onClick={() => setActive(index)}
                className={cn(
                  "h-2 flex-1 rounded-full transition",
                  active === index ? "bg-cyan-200" : "bg-white/14 hover:bg-white/28"
                )}
              />
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => move(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-white/70 transition hover:bg-white/[0.075] hover:text-white"
              aria-label="Previous evidence card"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <p className="text-center text-sm text-white/48">
              {active + 1} of {cards.length}: {current.article}
            </p>
            <button
              type="button"
              onClick={() => move(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-white/70 transition hover:bg-white/[0.075] hover:text-white"
              aria-label="Next evidence card"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EvidenceField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-white/32">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white/78">{value}</p>
    </div>
  );
}

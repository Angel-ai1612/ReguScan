import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type HoverExpandCard = {
  title: string;
  description: string;
  signal: string;
  risk: string;
  accent: "cyan" | "emerald" | "amber" | "rose" | "indigo";
  icon: LucideIcon;
};

const accentStyles: Record<HoverExpandCard["accent"], string> = {
  cyan: "from-cyan-300/18 via-cyan-300/8 to-transparent text-cyan-100 border-cyan-200/18",
  emerald: "from-emerald-300/18 via-emerald-300/8 to-transparent text-emerald-100 border-emerald-200/18",
  amber: "from-amber-300/18 via-amber-300/8 to-transparent text-amber-100 border-amber-200/18",
  rose: "from-rose-300/18 via-rose-300/8 to-transparent text-rose-100 border-rose-200/18",
  indigo: "from-indigo-300/18 via-indigo-300/8 to-transparent text-indigo-100 border-indigo-200/18",
};

export default function HoverExpandCards({ cards }: { cards: HoverExpandCard[] }) {
  return (
    <div className="landing-hover-grid">
      {cards.map(({ icon: Icon, ...card }) => (
        <article
          key={card.title}
          className={cn(
            "landing-hover-card group relative overflow-hidden rounded-lg border bg-white/[0.035] p-5 transition-all duration-300 hover:bg-white/[0.065] focus-within:bg-white/[0.065]",
            accentStyles[card.accent]
          )}
        >
          <div className={cn("absolute inset-x-0 top-0 h-28 bg-gradient-to-b opacity-80", accentStyles[card.accent])} />
          <div className="relative flex min-h-[240px] flex-col justify-between">
            <div>
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/12 bg-white/[0.055]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/54">
                  {card.risk}
                </span>
              </div>
              <h3 className="text-xl font-black tracking-normal text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{card.description}</p>
            </div>
            <div className="mt-6 translate-y-2 opacity-70 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/36">Evidence signal</p>
              <p className="mt-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-white/72">
                {card.signal}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

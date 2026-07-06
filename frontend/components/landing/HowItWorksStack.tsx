import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type WorkflowStep = {
  title: string;
  detail: string;
  metric: string;
  icon: LucideIcon;
};

export default function HowItWorksStack({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
      <div className="lg:sticky lg:top-24 lg:h-fit">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/62">How ReguScan works</p>
        <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal sm:text-4xl">
          A guided scan pipeline, from URL to evidence-backed compliance report.
        </h2>
        <p className="mt-5 max-w-xl leading-7 text-white/58">
          Each step is designed to keep the output explainable. ReguScan does not just score a site; it shows what it found,
          where it found it, and why the risk needs review.
        </p>
      </div>

      <div className="space-y-5">
        {steps.map(({ icon: Icon, ...step }, index) => (
          <article
            key={step.title}
            className={cn(
              "workflow-stack-card command-card sticky p-5 sm:p-6",
              index % 3 === 0 && "border-cyan-200/18",
              index % 3 === 1 && "border-emerald-200/18",
              index % 3 === 2 && "border-amber-200/18"
            )}
            style={{ top: `${96 + index * 12}px` }}
          >
            <div className="flex items-start justify-between gap-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055]">
                  <Icon className="h-5 w-5 text-cyan-100" />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/36">
                    Step {index + 1}
                  </span>
                  <h3 className="mt-2 text-xl font-black tracking-normal">{step.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58">{step.detail}</p>
                </div>
              </div>
              <span className="hidden rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-xs text-white/52 sm:inline-flex">
                {step.metric}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

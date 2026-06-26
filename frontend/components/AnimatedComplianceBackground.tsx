import clsx from "clsx";

type AnimatedComplianceBackgroundProps = {
  className?: string;
  intensity?: "quiet" | "hero";
};

const LABELS = ["DOM", "script", "page text", "LLM", "Art. 50", "gap", "confidence"];

export default function AnimatedComplianceBackground({
  className,
  intensity = "quiet",
}: AnimatedComplianceBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "pointer-events-none absolute inset-0 overflow-hidden",
        intensity === "hero" ? "opacity-100" : "opacity-55",
        className
      )}
    >
      <div className="signal-grid absolute inset-0" />
      <div className="compliance-radar compliance-radar-a" />
      <div className="compliance-radar compliance-radar-b" />
      <div className="risk-sweep risk-sweep-green" />
      <div className="risk-sweep risk-sweep-amber" />
      <div className="risk-sweep risk-sweep-red" />
      <div className="evidence-stream">
        {LABELS.map((label, index) => (
          <span
            key={label}
            className="evidence-chip"
            style={{
              left: `${8 + index * 13}%`,
              animationDelay: `${index * 1.15}s`,
              animationDuration: `${11 + (index % 3) * 2}s`,
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

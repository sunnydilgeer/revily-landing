import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── FlowStepsModel ───────────────────────────────────────────────────────
// A process flowchart — labeled boxes connected by labeled arrows.
// No fraction bars or denominators involved; used for multi-step
// problem structure, not fraction magnitude.

export function FlowStepsModel({
  steps,
  arrowLabels,
  arrowColors,
}: {
  steps: Array<{ label: string; value: string; highlight?: boolean }>;
  arrowLabels: string[];
  arrowColors?: BarColor[];
}) {
  return (
    <div className="flex w-full items-center justify-center gap-2 overflow-x-auto">
      {steps.map((step, i) => (
        <div key={i} className="flex flex-shrink-0 items-center gap-2">
          <div
            className="flex min-w-[6.5rem] flex-col items-center gap-1 rounded-xl border px-3 py-3"
            style={{
              borderColor: step.highlight ? "#4ade8066" : "#2e3248",
              background: step.highlight ? "#4ade8011" : "#22263a",
            }}
          >
            <div className="whitespace-nowrap text-xs font-bold text-[#f1f0ee]">{step.label}</div>
            <div className="text-[#f1f0ee]">
              <MathSpan latex={step.value} />
            </div>
          </div>
          {i < arrowLabels.length && (
            <div className="flex flex-col items-center">
              <div
                className="whitespace-nowrap text-[10px] font-bold"
                style={{ color: arrowColors?.[i] ? BAR_COLORS[arrowColors[i]].fill : "#8a8fa8" }}
              >
                {arrowLabels[i]}
              </div>
              <div className="text-lg text-[#8a8fa8]">→</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


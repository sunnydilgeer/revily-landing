import { MathSpan } from "@/components/MathText";

// ── FractionCancelStepsModel ─────────────────────────────────────────────
// Sequential panels showing a fraction-multiplication cancellation
// chain: each step's expression in its own box, with an arrow to the
// next box labeled by that step's `action` (the operation applied to
// get there). The final step (typically action: "result") is rendered
// as a highlighted box with no outgoing arrow. No \cancel{} notation —
// per the source doc, cancellation is described in prose action labels
// rather than struck-through math, since this renderer has no
// confirmed \cancel{} support.

export function FractionCancelStepsModel({
  steps,
}: {
  steps: Array<{ expression: string; action: string }>;
}) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-3 overflow-x-auto">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={i} className="flex flex-shrink-0 items-center gap-3">
            <div
              className="flex min-w-[5.5rem] items-center justify-center rounded-xl border px-4 py-3"
              style={{
                borderColor: isLast ? "#4ade8066" : "#2e3248",
                background: isLast ? "#4ade8011" : "#22263a",
              }}
            >
              <div className="text-[#f1f0ee]">
                <MathSpan latex={step.expression} display />
              </div>
            </div>
            {!isLast && (
              <div className="flex flex-col items-center">
                <div className="max-w-[6rem] whitespace-normal text-center text-[9px] font-bold leading-tight text-[#8a8fa8]">
                  {step.action}
                </div>
                <div className="text-lg text-[#8a8fa8]">→</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


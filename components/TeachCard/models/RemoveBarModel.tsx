import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── RemoveBarModel ──────────────────────────────────────────────────────────
// Subtraction visual: one bar showing the starting fraction with the
// removed segments marked with an X, an arrow down, then a second bar
// showing the remainder. Matches the doc's "remove n/d" diagram style,
// distinct from the stacked-bars "add" model above.

export function RemoveBarModel({
  denominator,
  startNumerator,
  removeCount,
  removeColor = "blue",
  resultColor = "green",
}: {
  denominator: number;
  startNumerator: number;
  removeCount: number;
  removeColor?: BarColor;
  resultColor?: BarColor;
}) {
  const segments = Array.from({ length: denominator });
  const resultNumerator = startNumerator - removeCount;
  const { fill: startFill, border: startBorder } = BAR_COLORS[removeColor];
  const { fill: resultFill, border: resultBorder } = BAR_COLORS[resultColor];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1 text-xs font-bold text-[#f87171]">
          remove <MathSpan latex={`\\frac{${removeCount}}{${denominator}}`} />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
            <MathSpan latex={`\\frac{${startNumerator}}{${denominator}}`} />
          </div>
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {segments.map((_, i) => {
              const filled = i < startNumerator;
              const removed = i >= startNumerator - removeCount && i < startNumerator;
              return (
                <div
                  key={i}
                  className="relative h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                  style={{
                    background: filled ? startFill : "transparent",
                    borderColor: filled ? startBorder : "#2e3248",
                  }}
                >
                  {removed && (
                    <svg viewBox="0 0 10 10" className="absolute inset-0 h-full w-full">
                      <line x1="1" y1="1" x2="9" y2="9" stroke="#f87171" strokeWidth="1" />
                      <line x1="9" y1="1" x2="1" y2="9" stroke="#f87171" strokeWidth="1" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="text-lg font-bold text-[#8a8fa8]">↓</div>
      <div className="flex items-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${resultNumerator}}{${denominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {segments.map((_, i) => (
            <div
              key={i}
              className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
              style={{
                background: i < resultNumerator ? resultFill : "transparent",
                borderColor: i < resultNumerator ? resultBorder : "#2e3248",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


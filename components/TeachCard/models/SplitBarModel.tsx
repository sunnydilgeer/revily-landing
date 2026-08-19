import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── SplitBarModel ────────────────────────────────────────────────────────
// Scaling-up visual: a bar showing the starting fraction, a down arrow
// with an explanatory label beside it, then a second bar (potentially
// a different denominator entirely) showing the equivalent fraction.
// No crossouts — the shaded proportion is meant to look unchanged.

export function SplitBarModel({
  fromNumerator,
  fromDenominator,
  toNumerator,
  toDenominator,
  splitLabel,
  fromColor = "blue",
  toColor = "green",
}: {
  fromNumerator: number;
  fromDenominator: number;
  toNumerator: number;
  toDenominator: number;
  splitLabel?: string;
  fromColor?: BarColor;
  toColor?: BarColor;
}) {
  const fromSegments = Array.from({ length: fromDenominator });
  const toSegments = Array.from({ length: toDenominator });
  const { fill: fromFill, border: fromBorder } = BAR_COLORS[fromColor];
  const { fill: toFill, border: toBorder } = BAR_COLORS[toColor];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${fromNumerator}}{${fromDenominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {fromSegments.map((_, i) => (
            <div
              key={i}
              className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
              style={{
                background: i < fromNumerator ? fromFill : "transparent",
                borderColor: i < fromNumerator ? fromBorder : "#2e3248",
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-lg font-bold text-[#8a8fa8]">↓</div>
        {splitLabel && (
          <div className="max-w-[10rem] text-left text-[10px] leading-tight text-[#8a8fa8]">
            {splitLabel}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${toNumerator}}{${toDenominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {toSegments.map((_, i) => (
            <div
              key={i}
              className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
              style={{
                background: i < toNumerator ? toFill : "transparent",
                borderColor: i < toNumerator ? toBorder : "#2e3248",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


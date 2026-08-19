import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── RepeatedFractionAdditionModel ────────────────────────────────────────
// Stacked equal-fraction bars combining into one result bar: `groups`
// identical bars (each divided into `fractionDenominator` segments,
// `fractionNumerator` shaded) stacked vertically, an arrow down labeled
// "combine the equal parts", then one result bar of the same
// denominator with `resultNumerator` segments shaded and a brace
// underneath. Used for MD-04 (repeated addition of the same fraction —
// i.e. multiplying a fraction by a whole number).

export function RepeatedFractionAdditionModel({
  groups,
  fractionNumerator,
  fractionDenominator,
  resultNumerator,
  groupColor = "blue",
  resultColor = "green",
}: {
  groups: number;
  fractionNumerator: number;
  fractionDenominator: number;
  resultNumerator: number;
  groupColor?: BarColor;
  resultColor?: BarColor;
}) {
  const { fill: gFill, border: gBorder } = BAR_COLORS[groupColor];
  const { fill: rFill, border: rBorder } = BAR_COLORS[resultColor];
  const segs = Array.from({ length: fractionDenominator });

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-[10px] font-bold text-[#8a8fa8]">
        {groups} groups of{" "}
        <MathSpan latex={`\\frac{${fractionNumerator}}{${fractionDenominator}}`} />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        {Array.from({ length: groups }).map((_, g) => (
          <div key={g} className="flex items-center gap-3">
            <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
              <MathSpan latex={`\\frac{${fractionNumerator}}{${fractionDenominator}}`} />
            </div>
            <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
              {segs.map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                  style={{
                    background: i < fractionNumerator ? gFill : "transparent",
                    borderColor: i < fractionNumerator ? gBorder : "#2e3248",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        <div className="mt-1">combine the equal parts</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
            <MathSpan latex={`\\frac{${resultNumerator}}{${fractionDenominator}}`} />
          </div>
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {segs.map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                style={{
                  background: i < resultNumerator ? rFill : "transparent",
                  borderColor: i < resultNumerator ? rBorder : "#2e3248",
                }}
              />
            ))}
          </div>
        </div>
        <div className="border-t border-[#8a8fa8] px-2 pt-1 text-[10px] text-[#8a8fa8]">
          <MathSpan latex={`\\frac{${resultNumerator}}{${fractionDenominator}}`} />
        </div>
      </div>
    </div>
  );
}


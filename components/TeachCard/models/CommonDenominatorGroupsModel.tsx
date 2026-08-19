import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── CommonDenominatorGroupsModel ─────────────────────────────────────────
// Two stacked bars for dividing one fraction by another: (1) the
// dividend shaded over its own denominator; (2) the same amount
// rewritten over the divisor's (finer) denominator, with the shaded
// portion bracketed into groups the size of the divisor's numerator,
// each bracket labeled with the divisor fraction, and an arrow to a
// "N groups" result box. A check equation sits underneath. Used for
// MD-13 (divide one fraction by another) — mirrors the doc's own
// "3/4 rewritten as 6/8, grouped into pairs of 3/8" diagram.

export function CommonDenominatorGroupsModel({
  dividendNumerator,
  dividendDenominator,
  commonNumerator,
  commonDenominator,
  divisorNumerator,
  divisorDenominator,
  groupCount,
  splitLabel,
  dividendColor = "blue",
  commonColor = "green",
}: {
  dividendNumerator: number;
  dividendDenominator: number;
  commonNumerator: number;
  commonDenominator: number;
  divisorNumerator: number;
  divisorDenominator: number;
  groupCount: number;
  splitLabel?: string;
  dividendColor?: BarColor;
  commonColor?: BarColor;
}) {
  const { fill: dFill, border: dBorder } = BAR_COLORS[dividendColor];
  const { fill: cFill, border: cBorder } = BAR_COLORS[commonColor];
  const dividendSegs = Array.from({ length: dividendDenominator });
  const commonSegs = Array.from({ length: commonDenominator });
  const groups = Array.from({ length: groupCount });
  const segmentRem = 1.75; // matches h-7/w-7 segment size at mobile width
  const factor = dividendDenominator > 0 ? commonDenominator / dividendDenominator : 1;
  const defaultSplitLabel = `split each part into ${factor} equal pieces`;

  return (
    <div className="flex w-full flex-col items-center gap-3 overflow-x-auto">
      <div className="text-[#f1f0ee]">
        <MathSpan
          latex={`\\frac{${dividendNumerator}}{${dividendDenominator}} \\div \\frac{${divisorNumerator}}{${divisorDenominator}}`}
          display
        />
      </div>
      {/* Row 1: dividend over its own denominator */}
      <div className="flex items-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${dividendNumerator}}{${dividendDenominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {dividendSegs.map((_, i) => (
            <div
              key={i}
              className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
              style={{
                background: i < dividendNumerator ? dFill : "transparent",
                borderColor: i < dividendNumerator ? dBorder : "#2e3248",
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        <div className="mt-1 max-w-[16rem] text-center leading-tight">{splitLabel ?? defaultSplitLabel}</div>
      </div>
      {/* Row 2: rewritten over the common (divisor) denominator, grouped */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${commonNumerator}}{${commonDenominator}}`} />
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {commonSegs.map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                style={{
                  background: i < commonNumerator ? cFill : "transparent",
                  borderColor: i < commonNumerator ? cBorder : "#2e3248",
                }}
              />
            ))}
          </div>
          {groupCount > 0 && (
            <div className="flex">
              {groups.map((_, g) => (
                <div
                  key={g}
                  className="flex flex-col items-center border-b border-[#8a8fa8] pt-1"
                  style={{ width: `${divisorNumerator * segmentRem}rem` }}
                >
                  <div className="mt-1 text-[9px] text-[#8a8fa8]">
                    <MathSpan latex={`\\tfrac{${divisorNumerator}}{${divisorDenominator}}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="text-lg text-[#8a8fa8]">→</div>
        <div className="rounded-lg border border-[#4ade8066] bg-[#4ade8011] px-3 py-2 text-xs font-bold text-[#f1f0ee]">
          {groupCount} groups
        </div>
      </div>
      <div className="mt-1 rounded-lg border border-[#4ade8066] bg-[#4ade8011] px-4 py-2 text-[#f1f0ee]">
        <MathSpan
          latex={`\\frac{${dividendNumerator}}{${dividendDenominator}} \\div \\frac{${divisorNumerator}}{${divisorDenominator}} = \\frac{${commonNumerator}}{${commonDenominator}} \\div \\frac{${divisorNumerator}}{${divisorDenominator}} = ${groupCount}`}
        />
      </div>
    </div>
  );
}


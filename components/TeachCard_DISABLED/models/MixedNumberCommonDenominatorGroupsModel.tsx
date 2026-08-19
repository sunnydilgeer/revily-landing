import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── MixedNumberCommonDenominatorGroupsModel ──────────────────────────────
// Matches the source doc's own layout: convert the whole and the fraction
// straight into the common denominator FIRST (e.g. "1 = 4/4" and
// "1/2 = 2/4"), show them side by side with a "+", combine into one bar
// (e.g. "6/4"), then bracket that bar into groups the size of the divisor
// and read off the group count. There's no separate "rewrite over the
// common denominator" stage — the pieces are already in that denominator
// by the time they're combined, which is what makes the doc's version
// easier to follow than assembling in the fraction's own denominator and
// converting afterward (what this component did before). Used for MD-14
// (divide a mixed number by a fraction).

export function MixedNumberCommonDenominatorGroupsModel({
  wholePart,
  fractionNumerator,
  fractionDenominator,
  commonNumerator,
  commonDenominator,
  divisorNumerator,
  divisorDenominator,
  groupCount,
  assembleLabel,
  wholeColor = "blue",
  fractionColor = "blue",
  commonColor = "green",
}: {
  wholePart: number;
  fractionNumerator: number;
  fractionDenominator: number;
  commonNumerator: number;
  commonDenominator: number;
  divisorNumerator: number;
  divisorDenominator: number;
  groupCount: number;
  assembleLabel?: string;
  wholeColor?: BarColor;
  fractionColor?: BarColor;
  commonColor?: BarColor;
}) {
  const { fill: wFill, border: wBorder } = BAR_COLORS[wholeColor];
  const { fill: fFill, border: fBorder } = BAR_COLORS[fractionColor];
  const { fill: cFill, border: cBorder } = BAR_COLORS[commonColor];

  // Each "1 whole" is commonDenominator/commonDenominator once rewritten,
  // so wholePart wholes contribute wholePart * commonDenominator to the
  // combined numerator; whatever's left over the common denominator is
  // the fraction part, rewritten.
  const wholePartCommonNumerator = wholePart * commonDenominator;
  const fractionPartCommonNumerator = commonNumerator - wholePartCommonNumerator;

  const commonSegs = Array.from({ length: commonDenominator });
  // Sized to exactly commonNumerator (all filled, no trailing empty
  // cells) — matches the doc's own diagram, which shows the combined
  // bar as exactly as many pieces as there are, not padded out to the
  // next whole the way a "how much more could this hold" bar would be.
  const combinedSegs = Array.from({ length: commonNumerator });
  const groups = Array.from({ length: groupCount });
  const segmentRem = 1.75; // matches h-7/w-7 segment size at mobile width

  const defaultAssembleLabel =
    "combine the wholes and the fraction into one fraction over the common denominator";

  return (
    <div className="flex w-full flex-col items-center gap-3 overflow-x-auto">
      {/* Stage 1: whole and fraction, each already rewritten over the common denominator, side by side */}
      <div className="flex flex-wrap items-end justify-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <div className="text-[#f1f0ee]">
            <MathSpan latex={`${wholePart} = \\frac{${wholePartCommonNumerator}}{${commonDenominator}}`} />
          </div>
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {commonSegs.map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                style={{ background: wFill, borderColor: wBorder }}
              />
            ))}
          </div>
        </div>
        <div className="pb-3 text-lg font-bold text-[#8a8fa8]">+</div>
        <div className="flex flex-col items-center gap-1">
          <div className="text-[#f1f0ee]">
            <MathSpan
              latex={`\\frac{${fractionNumerator}}{${fractionDenominator}} = \\frac{${fractionPartCommonNumerator}}{${commonDenominator}}`}
            />
          </div>
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {commonSegs.map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                style={{
                  background: i < fractionPartCommonNumerator ? fFill : "transparent",
                  borderColor: i < fractionPartCommonNumerator ? fBorder : "#2e3248",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        <div className="mt-1 max-w-[18rem] text-center leading-tight">{assembleLabel ?? defaultAssembleLabel}</div>
      </div>

      {/* Stage 2: the combined bar, bracketed into groups the size of the divisor */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="w-12 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${commonNumerator}}{${commonDenominator}}`} />
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {combinedSegs.map((_, i) => (
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
          latex={`${wholePart}\\tfrac{${fractionNumerator}}{${fractionDenominator}} \\div \\frac{${divisorNumerator}}{${divisorDenominator}} = \\frac{${commonNumerator}}{${commonDenominator}} \\div \\frac{${divisorNumerator}}{${divisorDenominator}} = ${groupCount}`}
        />
      </div>
    </div>
  );
}
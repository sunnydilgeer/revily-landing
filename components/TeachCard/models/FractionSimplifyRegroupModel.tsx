import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── FractionSimplifyRegroupModel ─────────────────────────────────────────
// Two-step regrouping visual for simplifying a fraction. Step 1: a bar
// of `totalParts` segments with the first `shadedParts` shaded, braced
// and labeled "N shaded". Step 2: the same bar regrouped into
// `resultDenominator` equal-sized boxes (each box spanning `groupSize`
// original segments) — the first `resultNumerator` boxes labeled
// "shaded", the rest "unshaded". Used for MD-06 (simplify a fraction
// product by dividing both counts by a common factor).

export function FractionSimplifyRegroupModel({
  totalParts,
  shadedParts,
  groupSize,
  resultNumerator,
  resultDenominator,
  shadeColor = "blue",
}: {
  totalParts: number;
  shadedParts: number;
  groupSize: number;
  resultNumerator: number;
  resultDenominator: number;
  shadeColor?: BarColor;
}) {
  const { fill, border } = BAR_COLORS[shadeColor];
  const segs = Array.from({ length: totalParts });
  const boxes = Array.from({ length: resultDenominator });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-start justify-center gap-6">
        {/* Step 1 */}
        <div className="flex flex-col items-center gap-2">
          <div className="max-w-[10rem] text-center text-[10px] font-bold leading-tight text-[#8a8fa8]">
            1. Show {shadedParts} shaded parts out of {totalParts}
          </div>
          <div className="text-[9px] text-[#8a8fa8]">{totalParts} equal parts</div>
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {segs.map((_, i) => (
              <div
                key={i}
                className="h-7 w-6 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-7"
                style={{
                  background: i < shadedParts ? fill : "transparent",
                  borderColor: i < shadedParts ? border : "#2e3248",
                }}
              />
            ))}
          </div>
          <div className="text-[10px] font-bold text-[#8a8fa8]">{shadedParts} shaded</div>
        </div>
        <div className="mt-8 flex flex-col items-center text-[10px] text-[#8a8fa8]">
          <div>divide both</div>
          <div>counts by {groupSize}</div>
          <div className="text-lg leading-none">→</div>
        </div>
        {/* Step 2 */}
        <div className="flex flex-col items-center gap-2">
          <div className="max-w-[11rem] text-center text-[10px] font-bold leading-tight text-[#8a8fa8]">
            2. Regroup as {resultNumerator} shaded out of {resultDenominator}
          </div>
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {boxes.map((_, i) => {
              const isShaded = i < resultNumerator;
              return (
                <div
                  key={i}
                  className="flex h-14 w-16 flex-col items-center justify-center border-r border-[#2e3248] px-1 text-center text-[9px] font-bold last:border-r-0 sm:h-16 sm:w-20"
                  style={{
                    background: isShaded ? `${fill}33` : "transparent",
                    color: isShaded ? border : "#8a8fa8",
                  }}
                >
                  {isShaded ? "shaded" : "unshaded"}
                </div>
              );
            })}
          </div>
          <div className="text-[10px] font-bold text-[#8a8fa8]">
            {resultNumerator} of {resultDenominator} equal parts is shaded
          </div>
        </div>
      </div>
      <div className="text-[10px] text-[#8a8fa8]">
        {shadedParts} ÷ {groupSize} = {resultNumerator} and {totalParts} ÷ {groupSize} = {resultDenominator}, so{" "}
        <MathSpan latex={`\\frac{${shadedParts}}{${totalParts}}=\\frac{${resultNumerator}}{${resultDenominator}}`} />
      </div>
    </div>
  );
}


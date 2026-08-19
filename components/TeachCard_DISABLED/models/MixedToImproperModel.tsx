import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── MixedToImproperModel ────────────────────────────────────────────────
// A row of full 'whole' bars (each individually labeled) plus one
// partial bar for the fractional part, arrow down to a single result
// bar sized to hold the full improper numerator (may span more than
// one denominator's worth of segments).

export function MixedToImproperModel({
  wholeNumber,
  numerator,
  denominator,
  wholeColor = "blue",
  fractionColor = "gold",
  resultColor = "green",
}: {
  wholeNumber: number;
  numerator: number;
  denominator: number;
  wholeColor?: BarColor;
  fractionColor?: BarColor;
  resultColor?: BarColor;
}) {
  const { fill: wFill, border: wBorder } = BAR_COLORS[wholeColor];
  const { fill: fFill, border: fBorder } = BAR_COLORS[fractionColor];
  const { fill: rFill, border: rBorder } = BAR_COLORS[resultColor];
  const improperNumerator = wholeNumber * denominator + numerator;
  const totalSegments = denominator * (wholeNumber + 1);
  const segs = (n: number) => Array.from({ length: n });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-end justify-center gap-4">
        {Array.from({ length: wholeNumber }).map((_, w) => (
          <div key={w} className="flex flex-col items-center gap-1">
            <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
              {segs(denominator).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                  style={{ background: wFill, borderColor: wBorder }}
                />
              ))}
            </div>
            <div className="text-[10px] text-[#8a8fa8]">1 whole</div>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1">
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {segs(denominator).map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                style={{
                  background: i < numerator ? fFill : "transparent",
                  borderColor: i < numerator ? fBorder : "#2e3248",
                }}
              />
            ))}
          </div>
          <div className="text-[10px] text-[#8a8fa8]">
            <MathSpan latex={`\\frac{${numerator}}{${denominator}}`} />
          </div>
        </div>
      </div>
      <div className="text-lg font-bold text-[#8a8fa8]">↓</div>
      <div className="flex items-center gap-3">
        <div className="text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${improperNumerator}}{${denominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {segs(totalSegments).map((_, i) => (
            <div
              key={i}
              className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
              style={{
                background: i < improperNumerator ? rFill : "transparent",
                borderColor: i < improperNumerator ? rBorder : "#2e3248",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


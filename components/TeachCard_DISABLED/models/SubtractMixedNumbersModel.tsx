import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";
import { MixedAddendRow } from "../shared";

// ── SubtractMixedNumbersModel ───────────────────────────────────────────
// A chain of whole bars (the first `removeWhole` of them crossed out)
// plus one fractional bar (the first `removeNumerator` filled segments
// crossed out), arrow down to a result row in the same whole+partial
// form as AddMixedNumbersModel. Compact segments and wrap/scroll
// safety nets, same reasoning as the add version.

export function SubtractMixedNumbersModel({
  startWhole,
  startNumerator,
  denominator,
  removeWhole,
  removeNumerator,
  removeLabel,
  startColor = "blue",
  keepFractionColor = "gold",
  resultColor = "green",
}: {
  startWhole: number;
  startNumerator: number;
  denominator: number;
  removeWhole: number;
  removeNumerator: number;
  removeLabel?: string;
  startColor?: BarColor;
  keepFractionColor?: BarColor;
  resultColor?: BarColor;
}) {
  const { fill: sFill, border: sBorder } = BAR_COLORS[startColor];
  const { fill: kFill, border: kBorder } = BAR_COLORS[keepFractionColor];
  const { fill: rFill, border: rBorder } = BAR_COLORS[resultColor];
  const segs = Array.from({ length: denominator });
  const resultWhole = startWhole - removeWhole;
  const resultNumerator = startNumerator - removeNumerator;

  function crossOverlay() {
    return (
      <svg viewBox="0 0 10 10" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <line x1="1" y1="1" x2="9" y2="9" stroke="#f87171" strokeWidth="1" />
        <line x1="9" y1="1" x2="1" y2="9" stroke="#f87171" strokeWidth="1" />
      </svg>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2 overflow-x-auto">
      {removeLabel && <div className="text-xs font-bold text-[#f87171]">{removeLabel}</div>}
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        <div className="flex-shrink-0 text-[#f1f0ee]">
          <MathSpan latex={`${startWhole}\\tfrac{${startNumerator}}{${denominator}}`} />
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          {Array.from({ length: startWhole }).map((_, w) => (
            <div key={w} className="relative flex overflow-hidden rounded border border-[#2e3248]">
              {segs.map((_, i) => (
                <div
                  key={i}
                  className="h-5 w-5 border-r border-[#2e3248] last:border-r-0"
                  style={{ background: sFill, borderColor: sBorder }}
                />
              ))}
              {w < removeWhole && crossOverlay()}
            </div>
          ))}
          <div className="flex overflow-hidden rounded border border-[#2e3248]">
            {segs.map((_, i) => {
              const filled = i < startNumerator;
              const removed = filled && i < removeNumerator;
              return (
                <div
                  key={i}
                  className="relative h-5 w-5 border-r border-[#2e3248] last:border-r-0"
                  style={{
                    background: filled ? kFill : "transparent",
                    borderColor: filled ? kBorder : "#2e3248",
                  }}
                >
                  {removed && crossOverlay()}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="text-lg font-bold text-[#8a8fa8]">↓</div>
      <MixedAddendRow
        wholeNumber={resultWhole}
        numerator={resultNumerator}
        denominator={denominator}
        wholeColor={resultColor}
        fractionColor={keepFractionColor}
      />
    </div>
  );
}


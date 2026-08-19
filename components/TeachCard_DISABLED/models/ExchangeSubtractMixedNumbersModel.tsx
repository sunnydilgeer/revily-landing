import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";
import { MixedAddendRow } from "../shared";

// ── ExchangeSubtractMixedNumbersModel ───────────────────────────────────
// Three stages, not two: (1) the original mixed number, plainly shown;
// (2) the same value after exchanging one whole for denominator/denominator
// — one fewer whole bar, one wider fraction bar holding more than a
// single denominator's worth of segments — WITH the removal crossout
// applied on top of that exchanged form; (3) the result. This is the
// most compound of the mixed-number visuals: exchange happens before
// removal, not instead of it.

export function ExchangeSubtractMixedNumbersModel({
  originalWhole,
  originalNumerator,
  denominator,
  removeWhole,
  removeNumerator,
  exchangeLabel,
  removeLabel,
  startColor = "blue",
  originalFractionColor = "gold",
  resultColor = "green",
}: {
  originalWhole: number;
  originalNumerator: number;
  denominator: number;
  removeWhole: number;
  removeNumerator: number;
  exchangeLabel?: string;
  removeLabel?: string;
  startColor?: BarColor;
  originalFractionColor?: BarColor;
  resultColor?: BarColor;
}) {
  const { fill: sFill, border: sBorder } = BAR_COLORS[startColor];
  const { fill: oFill, border: oBorder } = BAR_COLORS[originalFractionColor];
  const { fill: rFill, border: rBorder } = BAR_COLORS[resultColor];
  const denomSegs = Array.from({ length: denominator });
  const postExchangeWhole = originalWhole - 1;
  const postExchangeNumerator = denominator + originalNumerator;
  const wideSegs = Array.from({ length: postExchangeNumerator });
  const resultWhole = postExchangeWhole - removeWhole;
  const resultNumerator = postExchangeNumerator - removeNumerator;

  function crossOverlay() {
    return (
      <svg viewBox="0 0 10 10" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <line x1="1" y1="1" x2="9" y2="9" stroke="#f87171" strokeWidth="1" />
        <line x1="9" y1="1" x2="1" y2="9" stroke="#f87171" strokeWidth="1" />
      </svg>
    );
  }

  function wholeBar(color: BarColor, key: number, crossed = false) {
    const { fill, border } = BAR_COLORS[color];
    return (
      <div key={key} className="flex flex-col items-center gap-0.5">
        <div className="relative flex overflow-hidden rounded border border-[#2e3248]">
          {denomSegs.map((_, i) => (
            <div key={i} className="h-5 w-5 border-r border-[#2e3248] last:border-r-0" style={{ background: fill, borderColor: border }} />
          ))}
          {crossed && crossOverlay()}
        </div>
        <div className="text-[9px] text-[#8a8fa8]">1 whole</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-3 overflow-x-auto">
      {/* Stage 1: original */}
      <div className="flex flex-wrap items-end justify-center gap-2">
        <div className="flex-shrink-0 text-[#f1f0ee]">
          <MathSpan latex={`${originalWhole}\\tfrac{${originalNumerator}}{${denominator}}`} />
        </div>
        <div className="flex flex-wrap items-end justify-center gap-1">
          {Array.from({ length: originalWhole }).map((_, w) => wholeBar(startColor, w))}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex overflow-hidden rounded border border-[#2e3248]">
              {denomSegs.map((_, i) => (
                <div
                  key={i}
                  className="h-5 w-5 border-r border-[#2e3248] last:border-r-0"
                  style={{
                    background: i < originalNumerator ? oFill : "transparent",
                    borderColor: i < originalNumerator ? oBorder : "#2e3248",
                  }}
                />
              ))}
            </div>
            <div className="text-[9px] text-[#8a8fa8]">
              original <MathSpan latex={`\\tfrac{${originalNumerator}}{${denominator}}`} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        {exchangeLabel && <div className="mt-1 max-w-[12rem] text-center leading-tight">{exchangeLabel}</div>}
      </div>
      {/* Stage 2: post-exchange, with removal crossout applied */}
      <div className="flex flex-wrap items-end justify-center gap-2">
        <div className="flex-shrink-0 text-[#f1f0ee]">
          <MathSpan latex={`${postExchangeWhole}\\tfrac{${postExchangeNumerator}}{${denominator}}`} />
        </div>
        <div className="flex flex-wrap items-end justify-center gap-1">
          {Array.from({ length: postExchangeWhole }).map((_, w) => wholeBar(startColor, w, w < removeWhole))}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex overflow-hidden rounded border border-[#2e3248]">
              {wideSegs.map((_, i) => {
                const isExchanged = i < denominator;
                const removed = i < removeNumerator;
                return (
                  <div
                    key={i}
                    className="relative h-5 w-5 border-r border-[#2e3248] last:border-r-0"
                    style={{
                      background: isExchanged ? sFill : oFill,
                      borderColor: isExchanged ? sBorder : oBorder,
                    }}
                  >
                    {removed && crossOverlay()}
                  </div>
                );
              })}
            </div>
            <div className="text-[9px] text-[#8a8fa8]">
              exchanged <MathSpan latex={`\\tfrac{${denominator}}{${denominator}}`} /> +{" "}
              <MathSpan latex={`\\tfrac{${originalNumerator}}{${denominator}}`} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center text-[10px] font-bold text-[#f87171]">
        <div className="text-lg font-bold leading-none text-[#8a8fa8]">↓</div>
        {removeLabel && <div className="mt-1 max-w-[12rem] text-center leading-tight">{removeLabel}</div>}
      </div>
      {/* Stage 3: result */}
      <MixedAddendRow
        wholeNumber={resultWhole}
        numerator={resultNumerator}
        denominator={denominator}
        wholeColor={resultColor}
        fractionColor={resultColor}
      />
    </div>
  );
}


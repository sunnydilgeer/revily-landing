import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── DivideShareModel ──────────────────────────────────────────────────────
// Three-stage bar visual for dividing a fraction by a whole number:
// (1) the original fraction, shaded segments over the total; (2) the
// same bar with each part split finer so the shaded count divides
// evenly by the divisor; (3) that split bar broken into `divisor`
// equal "Share" panels, one segment group per share, each labeled
// with its own value, plus a check equation underneath. Used for
// MD-10 (divide a fraction by a whole number) — mirrors the doc's own
// "split each quarter into 2, then share the 6 eighths equally"
// three-row diagram.

export function DivideShareModel({
  fromNumerator,
  fromDenominator,
  splitNumerator,
  splitDenominator,
  divisor,
  shareNumerator,
  shareDenominator,
  splitLabel,
  shareLabel,
  fromColor = "blue",
  share1Color = "green",
  share2Color = "gold",
}: {
  fromNumerator: number;
  fromDenominator: number;
  splitNumerator: number;
  splitDenominator: number;
  divisor: number;
  shareNumerator: number;
  shareDenominator: number;
  splitLabel?: string;
  shareLabel?: string;
  fromColor?: BarColor;
  share1Color?: BarColor;
  share2Color?: BarColor;
}) {
  const { fill: fromFill, border: fromBorder } = BAR_COLORS[fromColor];
  const shareColors = [BAR_COLORS[share1Color], BAR_COLORS[share2Color]];
  const fromSegs = Array.from({ length: fromDenominator });
  const splitSegs = Array.from({ length: splitDenominator });
  const shareSegs = Array.from({ length: shareDenominator });
  const shares = Array.from({ length: divisor });
  const factor = fromDenominator > 0 ? splitDenominator / fromDenominator : 1;
  const defaultSplitLabel = `split each part into ${factor}`;
  const defaultShareLabel = `share the ${splitNumerator} shaded parts equally`;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Row 1: original fraction */}
      <div className="flex items-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${fromNumerator}}{${fromDenominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {fromSegs.map((_, i) => (
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
      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        <div className="mt-1">{splitLabel ?? defaultSplitLabel}</div>
      </div>
      {/* Row 2: split into finer equal parts */}
      <div className="flex items-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${splitNumerator}}{${splitDenominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {splitSegs.map((_, i) => (
            <div
              key={i}
              className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
              style={{
                background: i < splitNumerator ? fromFill : "transparent",
                borderColor: i < splitNumerator ? fromBorder : "#2e3248",
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        <div className="mt-1">{shareLabel ?? defaultShareLabel}</div>
      </div>
      {/* Row 3: the equal shares, side by side */}
      <div className="flex flex-wrap items-start justify-center gap-6">
        {shares.map((_, s) => {
          const { fill, border } = shareColors[s % shareColors.length];
          return (
            <div key={s} className="flex flex-col items-center gap-1">
              <div className="text-xs font-bold text-[#f1f0ee]">Share {s + 1}</div>
              <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
                {shareSegs.map((_, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                    style={{
                      background: i < shareNumerator ? fill : "transparent",
                      borderColor: i < shareNumerator ? border : "#2e3248",
                    }}
                  />
                ))}
              </div>
              <div className="text-[#f1f0ee]">
                <MathSpan latex={`\\frac{${shareNumerator}}{${shareDenominator}}`} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Check equation */}
      <div className="mt-1 rounded-lg border border-[#4ade8066] bg-[#4ade8011] px-4 py-2 text-[#f1f0ee]">
        <MathSpan
          latex={`\\frac{${fromNumerator}}{${fromDenominator}} \\div ${divisor} = \\frac{${shareNumerator}}{${shareDenominator}}`}
        />
      </div>
    </div>
  );
}


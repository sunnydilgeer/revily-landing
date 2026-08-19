import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type VisualBarRow } from "../types";

// ── FractionBarRow ──────────────────────────────────────────────────────────

export function FractionBarRow({ row }: { row: VisualBarRow }) {
  const {
    numerator, denominator, color, operatorBefore, splitLabel,
    rightLabel, removeCount, remainColor, leftLabelOverride,
  } = row;
  const segments = Array.from({ length: denominator });
  const { fill, border } = BAR_COLORS[color];
  const remain = remainColor ? BAR_COLORS[remainColor] : null;
  const keepCount = removeCount ? numerator - removeCount : numerator;

  return (
    <div className="flex flex-col items-center gap-1">
      {operatorBefore && (
        <div className="text-lg font-bold text-[#8a8fa8]">{operatorBefore}</div>
      )}
      <div className="flex items-center gap-3">
        <div className="min-w-[2.5rem] flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={leftLabelOverride ?? `\\frac{${numerator}}{${denominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {segments.map((_, i) => {
            const isKept = i < keepCount;
            const isRemoved = removeCount ? i >= keepCount && i < numerator : false;
            const segFill = isKept ? (remain ? remain.fill : fill) : isRemoved ? fill : "transparent";
            const segBorder = isKept ? (remain ? remain.border : border) : isRemoved ? border : "#2e3248";
            return (
              <div
                key={i}
                className="relative h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                style={{ background: segFill, borderColor: segBorder }}
              >
                {isRemoved && (
                  <svg viewBox="0 0 10 10" className="absolute inset-0 h-full w-full">
                    <line x1="1" y1="1" x2="9" y2="9" stroke="#f87171" strokeWidth="1" />
                    <line x1="9" y1="1" x2="1" y2="9" stroke="#f87171" strokeWidth="1" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
        {splitLabel && (
          <div className="ml-1 flex items-center gap-2">
            <div className="text-lg text-[#8a8fa8]">→</div>
            <div className="max-w-[9rem] text-left text-[10px] leading-tight text-[#8a8fa8]">
              {splitLabel}
            </div>
          </div>
        )}
        {rightLabel && (
          <div className="ml-2 text-left text-[#f1f0ee]">
            <MathSpan latex={rightLabel} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── FractionRowsModel ───────────────────────────────────────────────────────
// The registry-facing wrapper for the base "add" style (style is optional/
// "add", just a plain array of bar rows) — this is what used to be the
// final inline `.map()` fallback at the bottom of TeachCard's if-chain.
// Every other model file exports one component matching its registry
// entry; this is that component for the default rows-only shape.

export function FractionRowsModel({ rows }: { rows: VisualBarRow[] }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {rows.map((row, i) => (
        <FractionBarRow key={i} row={row} />
      ))}
    </div>
  );
}


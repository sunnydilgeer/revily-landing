import { BAR_COLORS, type BarColor } from "../types";

// ── InverseGroupReconstructModel ─────────────────────────────────────────
// Three-row "rebuild the whole" visual: Row 1 (given information) shows
// `knownParts` filled boxes (no numbers yet, just a brace totaling
// `knownTotal`) plus `totalParts - knownParts` empty "?" boxes. Row 2
// (Step 1) fills in `partValue` in the known boxes only — the division
// step. Row 3 (Step 2) fills `partValue` into every box, known and
// previously-unknown alike — the multiply-back-up step — with a brace
// spanning all `totalParts` boxes labeled with the whole-value equation.
// Used for MD-03 (rebuild a whole from a known fractional part) —
// structurally the inverse of GroupPartitionModel, hence three explicit
// stages instead of one partition + highlight.

export function InverseGroupReconstructModel({
  knownParts,
  knownTotal,
  partValue,
  totalParts,
  wholeValue,
  knownColor = "green",
  unknownColor = "blue",
}: {
  knownParts: number;
  knownTotal: number;
  partValue: number;
  totalParts: number;
  wholeValue: number;
  knownColor?: BarColor;
  unknownColor?: BarColor;
}) {
  const { fill: kFill, border: kBorder } = BAR_COLORS[knownColor];
  const { border: uBorder } = BAR_COLORS[unknownColor];
  const boxes = Array.from({ length: totalParts });

  function renderRow(fillKnown: boolean, fillUnknown: boolean) {
    return (
      <div className="flex items-center justify-center gap-1.5">
        {boxes.map((_, i) => {
          const isKnown = i < knownParts;
          return (
            <div
              key={i}
              className="flex h-10 w-12 flex-shrink-0 items-center justify-center rounded-md border-2 text-sm font-bold sm:h-11 sm:w-14"
              style={{
                borderColor: isKnown ? kBorder : uBorder,
                background: isKnown ? `${kFill}22` : "transparent",
                color: isKnown ? kBorder : uBorder,
              }}
            >
              {isKnown ? (fillKnown ? partValue : "") : fillUnknown ? partValue : "?"}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-[10px] font-bold text-[#8a8fa8]">
        {knownParts} known parts total {knownTotal}
      </div>
      <div className="flex items-center gap-4">
        <div className="w-20 flex-shrink-0 text-right text-[10px] font-bold leading-tight text-[#8a8fa8]">
          given information
        </div>
        {renderRow(false, false)}
      </div>
      <div className="text-lg font-bold text-[#8a8fa8]">↓</div>
      <div className="flex items-center gap-4">
        <div className="w-20 flex-shrink-0 text-right text-[10px] font-bold leading-tight text-[#8a8fa8]">
          Step 1: {knownTotal} ÷ {knownParts} = {partValue}
        </div>
        {renderRow(true, false)}
      </div>
      <div className="text-lg font-bold text-[#8a8fa8]">↓</div>
      <div className="flex items-center gap-4">
        <div className="w-20 flex-shrink-0 text-right text-[10px] font-bold leading-tight text-[#8a8fa8]">
          Step 2: all parts equal
        </div>
        {renderRow(true, true)}
      </div>
      <div
        className="rounded-lg border px-3 py-1.5 text-xs font-bold"
        style={{ borderColor: uBorder, background: "#818cf822", color: "#a5b4fc" }}
      >
        the whole: {totalParts} × {partValue} = {wholeValue}
      </div>
    </div>
  );
}


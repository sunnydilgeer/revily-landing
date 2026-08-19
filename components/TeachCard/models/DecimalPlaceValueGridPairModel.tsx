import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";
import { numberToWords, capitalize, HundredGrid } from "../shared";

// ── DecimalPlaceValueGridPairModel ────────────────────────────────────────
// New component (FDP-01): two stacked visual blocks matching the doc's
// "2.3 Key Point" layout exactly.
//   1. Tenths strip: a 1-row strip of `tenthsModel.totalParts` cells,
//      the first `tenthsModel.shadedParts` shaded, with the fraction and
//      decimal shown underneath joined by a "same value" arrow.
//   2. Hundredths grid: a 10-column grid of `hundredthsModel.totalParts`
//      cells, the first `hundredthsModel.shadedParts` shaded row-major,
//      with the value-preserving decomposition chain
//      (`hundredthsModel.decompositionSteps`) shown beside it, each step
//      separated by a downward double-arrow (⇓) as in the doc.
// Used for FDP-01 (decimals as fractions of tenths/hundredths).
//
// numberToWords/capitalize/HundredGrid now live in shared.tsx — FDP-02
// (PercentageHundredSquarePairModel) needed the same hundred-square and
// the same "Example N · [word]" label pattern, so they were pulled out
// rather than duplicated a second time.

function Strip({
  totalParts,
  shadedParts,
  color,
}: {
  totalParts: number;
  shadedParts: number;
  color: BarColor;
}) {
  const { fill, border } = BAR_COLORS[color];
  return (
    <div className="flex overflow-hidden rounded-md border" style={{ borderColor: `${border}88` }}>
      {Array.from({ length: totalParts }).map((_, i) => (
        <div
          key={i}
          className="h-8 w-8 flex-shrink-0 border-r last:border-r-0"
          style={{
            borderColor: `${border}55`,
            background: i < shadedParts ? fill : "transparent",
          }}
        />
      ))}
    </div>
  );
}

export function DecimalPlaceValueGridPairModel({
  tenthsModel,
  hundredthsModel,
  tenthsColor = "blue",
  hundredthsColor = "green",
}: {
  tenthsModel: {
    decimal: string;
    fraction: string;
    totalParts: number;
    shadedParts: number;
  };
  hundredthsModel: {
    totalParts: number;
    shadedParts: number;
    decompositionSteps: string[];
  };
  tenthsColor?: BarColor;
  hundredthsColor?: BarColor;
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* ── Tenths strip ── */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-wide text-[#8a8fa8]">
          Example 1 · {capitalize(numberToWords(tenthsModel.shadedParts))} tenth{tenthsModel.shadedParts === 1 ? "" : "s"}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm font-bold text-[#f1f0ee]">one whole</div>
          <Strip totalParts={tenthsModel.totalParts} shadedParts={tenthsModel.shadedParts} color={tenthsColor} />
        </div>
        <div className="text-center text-[10px] text-[#8a8fa8]">
          {tenthsModel.totalParts} equal parts, with {tenthsModel.shadedParts} shaded
        </div>
        <div className="flex items-center justify-center gap-2 text-[#f1f0ee]">
          <MathSpan latex={tenthsModel.fraction} />
          <span className="text-[9px] text-[#8a8fa8]">same value →</span>
          <MathSpan latex={tenthsModel.decimal} />
        </div>
      </div>

      {/* ── Hundredths grid + decomposition chain ── */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-wide text-[#8a8fa8]">
          Example 2 · {capitalize(numberToWords(hundredthsModel.shadedParts))} hundredth{hundredthsModel.shadedParts === 1 ? "" : "s"}
        </div>
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex min-w-[10rem] flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm font-bold text-[#f1f0ee]">one whole</div>
              <div className="max-w-[10rem] flex-1">
                <HundredGrid
                  totalParts={hundredthsModel.totalParts}
                  shadedParts={hundredthsModel.shadedParts}
                  color={hundredthsColor}
                />
              </div>
            </div>
            <div className="text-center text-[10px] text-[#8a8fa8]">
              {hundredthsModel.totalParts} equal squares, with {hundredthsModel.shadedParts} shaded
            </div>
          </div>
          <div className="flex flex-shrink-0 flex-col items-center gap-1">
            {hundredthsModel.decompositionSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="text-[#f1f0ee]">
                  <MathSpan latex={step} />
                </div>
                {i < hundredthsModel.decompositionSteps.length - 1 && (
                  <div className="text-sm text-[#8a8fa8]">⇓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

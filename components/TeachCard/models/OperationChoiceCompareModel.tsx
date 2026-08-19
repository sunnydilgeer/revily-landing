import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── OperationChoiceCompareModel ───────────────────────────────────────────
// Side-by-side contrast panel used when a skill's whole point is telling
// multiply and divide apart for the same pair of quantities. Rebuilt to
// match the doc's own layout exactly: two full-width STACKED sections
// (not side-by-side cards), each a single continuous divided bar rather
// than separate gapped squares, with:
//   - Top section ("multiply" reading): a bar split into `totalGroups`
//     equal segments, the first `selectedGroups` shaded, a bracket-style
//     underline + label spanning the selected segments, and an equation
//     box (expression + " = " + result, built client-side since the DB
//     only stores them separately).
//   - Bottom section ("divide" reading): a bar split into `totalUnits`
//     numbered unit cells, a caption naming the unit, and the same
//     equation-box treatment.
// Used for MD-15 (choosing multiply vs. divide for a mixed word problem).

function EquationBox({ expression, result, color }: { expression: string; result: string | number; color: BarColor }) {
  const { border } = BAR_COLORS[color];
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-lg border bg-[#22263a] px-3 py-2 text-sm text-[#f1f0ee]"
      style={{ borderColor: `${border}55` }}
    >
      <MathSpan latex={`${expression} = ${result}`} />
    </div>
  );
}

export function OperationChoiceCompareModel({
  multiplyPanel,
  dividePanel,
  multiplyColor = "blue",
  divideColor = "green",
}: {
  multiplyPanel: {
    label: string;
    expression: string;
    totalGroups: number;
    selectedGroups: number;
    result: string | number;
  };
  dividePanel: {
    label: string;
    expression: string;
    totalUnits: number;
    unitLabel: string;
    result: string | number;
  };
  multiplyColor?: BarColor;
  divideColor?: BarColor;
}) {
  const { fill: mFill, border: mBorder } = BAR_COLORS[multiplyColor];
  const { fill: dFill, border: dBorder } = BAR_COLORS[divideColor];
  const groups = Array.from({ length: multiplyPanel.totalGroups });
  const units = Array.from({ length: dividePanel.totalUnits });
  const selectedFraction = multiplyPanel.selectedGroups / multiplyPanel.totalGroups;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* ── Multiply reading ── */}
      <div className="flex flex-col gap-2">
        <div className="text-sm font-bold" style={{ color: mBorder }}>
          {multiplyPanel.label}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[10rem] flex-1 flex-col gap-1">
            <div className="flex overflow-hidden rounded-md border" style={{ borderColor: `${mBorder}88` }}>
              {groups.map((_, g) => (
                <div
                  key={g}
                  className="h-8 flex-1 border-r last:border-r-0"
                  style={{
                    borderColor: `${mBorder}55`,
                    background: g < multiplyPanel.selectedGroups ? mFill : "transparent",
                  }}
                />
              ))}
            </div>
            {/* Bracket-style underline spanning the selected segments */}
            <div className="flex" style={{ width: `${selectedFraction * 100}%` }}>
              <div className="flex-1 border-b-2 pt-1 text-center text-[10px] font-bold" style={{ borderColor: mBorder, color: mBorder }}>
                {multiplyPanel.selectedGroups} of the {multiplyPanel.totalGroups} equal groups
              </div>
            </div>
          </div>
          <EquationBox expression={multiplyPanel.expression} result={multiplyPanel.result} color={multiplyColor} />
        </div>
      </div>

      {/* ── Divide reading ── */}
      <div className="flex flex-col gap-2">
        <div className="text-sm font-bold" style={{ color: dBorder }}>
          {dividePanel.label}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[10rem] flex-1 flex-col gap-1">
            <div className="flex flex-wrap overflow-hidden rounded-md border" style={{ borderColor: `${dBorder}88` }}>
              {units.map((_, u) => (
                <div
                  key={u}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center border-b border-r text-[10px] font-bold"
                  style={{ borderColor: `${dBorder}55`, background: `${dFill}22`, color: dBorder }}
                >
                  {u + 1}
                </div>
              ))}
            </div>
            <div className="text-center text-[10px] text-[#8a8fa8]">
              Each small box is one {dividePanel.unitLabel}. There are {dividePanel.totalUnits} {dividePanel.unitLabel}-sized groups.
            </div>
          </div>
          <EquationBox expression={dividePanel.expression} result={dividePanel.result} color={divideColor} />
        </div>
      </div>
    </div>
  );
}
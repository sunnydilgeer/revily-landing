// components/TeachCard/models/DecimalToFractionRegroupModel.tsx
//
// FDP-06 (DB id 1599): "Convert a terminating decimal to a fraction."
// Two-part visual:
//   Part A — place-value table (0.7, 0.47, 0.305 -> denominator justification)
//   Part B — hundred-square shaded, then regrouped into blocks of groupSize
//            (0.32 -> 32/100 -> 8/25)
//
// This component does NOT render its own header text or the caption —
// TeachCard (index.tsx) already renders `visual_model.caption` generically
// below whatever this returns.
//
// v2 fixes two live bugs from the first version:
//   - the table's result fraction was a 6th column, which pushed the table
//     wider than the container on mobile and scrolled off-screen with no
//     visible scrollbar. Now it's its own full-width row under each
//     example's digits (colSpan), so the table can't overflow.
//   - HundredGrid had no flex-shrink-0, so on a narrow viewport the flex
//     row squeezed it down to a few px instead of wrapping — GroupedGrid
//     already had flex-shrink-0 and kept its size, which is why only one
//     of the two grids was visible. Every flex child in the grids row is
//     now flex-shrink-0, so flex-wrap actually wraps instead of shrinking.

import { MathSpan } from "@/components/MathText";
import { HundredGrid } from "../shared";
import { BAR_COLORS, type BarColor } from "../types";

type PlaceValueRow = {
  value: string; // "0.305"
  digits: string[]; // maps 1:1 to `columns` from index 0
  fraction: string; // "305/1000" — plain string, not LaTeX
  denominator: string;
};

type PlaceValueTable = {
  rows: PlaceValueRow[];
  columns: string[]; // ["Ones","Tenths","Hundredths","Thousandths"]
};

type HundredSquareSimplification = {
  groups: number; // total groups after regrouping, e.g. 25
  result: string; // "8/25"
  decimal: string; // "0.32"
  percent: string | null; // present in DB row, unused here
  groupSize: number; // 4
  totalParts: number; // 100
  shadedParts: number; // 32
  shadedGroups: number; // 8
  initialFraction: string; // "32/100"
};

export interface DecimalToFractionRegroupProps {
  placeValueTable: PlaceValueTable;
  hundredSquareSimplification: HundredSquareSimplification;
  squareColor?: BarColor;
}

function fracToLatex(fraction: string): string {
  const [num, denom] = fraction.split("/");
  return `\\frac{${num}}{${denom}}`;
}

export function DecimalToFractionRegroupModel({
  placeValueTable,
  hundredSquareSimplification: hs,
  squareColor = "blue",
}: DecimalToFractionRegroupProps) {
  const { fill } = BAR_COLORS[squareColor];
  const colCount = placeValueTable.columns.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Part A — place-value table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th />
              {placeValueTable.columns.map((col) => (
                <th
                  key={col}
                  className="border border-[#2e3248] px-2 py-1 font-semibold text-[#f1f0ee]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {placeValueTable.rows.flatMap((row) => [
              <tr key={`${row.value}-vals`}>
                <td className="whitespace-nowrap pr-3 text-right text-[#f1f0ee]">{row.value}</td>
                {placeValueTable.columns.map((_, i) => (
                  <td
                    key={i}
                    className="border border-[#2e3248] px-2 py-1 text-center text-[#f1f0ee]"
                  >
                    {row.digits[i] ?? ""}
                  </td>
                ))}
              </tr>,
              <tr key={`${row.value}-frac`}>
                <td colSpan={colCount + 1} className="pb-3 pt-1 text-right text-[#f1f0ee]">
                  <span className="mr-1">=</span>
                  <MathSpan latex={fracToLatex(row.fraction)} />
                </td>
              </tr>,
            ])}
          </tbody>
        </table>
      </div>

      {/* Part B — hundred square + regroup */}
      <div className="flex flex-col items-center gap-4 border-t border-[#2e3248] pt-4">
        <div className="flex flex-wrap items-center justify-center" style={{ gap: 12 }}>
          {/* Explicit inline-style width, not a Tailwind class: HundredGrid's
              columns are `1fr` (see shared.tsx), which need a definite
              container width to divide up. Without one, in a flex row with
              no other width signal, the grid collapses toward zero — that
              was the "tiny blob" bug. flexShrink is also set inline so this
              doesn't depend on a `flex-shrink-0` class existing. Sized at
              100px (down from 140px) so all three items fit on one row
              side-by-side, matching the doc, instead of wrapping. */}
          <div style={{ width: 100, flexShrink: 0 }}>
            <HundredGrid totalParts={hs.totalParts} shadedParts={hs.shadedParts} color={squareColor} />
          </div>

          <div
            className="flex flex-col items-center text-center text-xs text-[#8a8fa8]"
            style={{ width: 96, flexShrink: 0 }}
          >
            <span>group every {hs.groupSize} hundredths</span>
            <span>divide both parts by {hs.groupSize}</span>
            <span aria-hidden className="mt-1 text-lg leading-none text-[#f1f0ee]">
              →
            </span>
          </div>

          <GroupedGrid totalGroups={hs.groups} shadedGroups={hs.shadedGroups} fill={fill} />
        </div>

        <div className="flex w-full flex-wrap justify-between gap-x-4 px-2 text-xs text-[#8a8fa8]">
          <span>
            {hs.shadedParts} of {hs.totalParts} small squares are shaded
          </span>
          <span>
            {hs.shadedGroups} of {hs.groups} equal groups are shaded
          </span>
        </div>

        <div className="text-[#f1f0ee]">
          <MathSpan
            latex={`${hs.decimal} = ${fracToLatex(hs.initialFraction)} = \\frac{${hs.shadedParts} \\div ${hs.groupSize}}{${hs.totalParts} \\div ${hs.groupSize}} = ${fracToLatex(hs.result)}`}
            display
          />
        </div>
      </div>
    </div>
  );
}

// Coarser grid where each cell represents one GROUP of small squares, not
// one square. Entirely inline-styled (matching HundredGrid's own
// convention in shared.tsx) rather than Tailwind width/height classes, so
// its sizing doesn't depend on those classes existing in your hand-rolled
// mini-tailwind.css. Shared-build candidate — promote to shared.tsx the
// first time a second skill needs a "regroup into blocks of N" diagram.
function GroupedGrid({
  totalGroups,
  shadedGroups,
  fill,
}: {
  totalGroups: number;
  shadedGroups: number;
  fill: string;
}) {
  const perRow = Math.min(totalGroups, 5);
  const cellSize = 16; // px — matched to HundredGrid's new 100px/10-column size
  const cells = Array.from({ length: totalGroups }, (_, i) => i < shadedGroups);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${perRow}, ${cellSize}px)`,
        gap: 2,
        flexShrink: 0,
      }}
    >
      {cells.map((shaded, i) => (
        <div
          key={i}
          style={{
            width: cellSize,
            height: cellSize,
            border: "1px solid #2e3248",
            background: shaded ? fill : "transparent",
          }}
        />
      ))}
    </div>
  );
}
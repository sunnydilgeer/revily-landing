import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── FractionAreaModel ─────────────────────────────────────────────────────
// Two-step area-model grid for multiplying two proper fractions.
// Step 1: a `rows` x `columns` grid with the first `shadedColumns`
// columns shaded across every row (shows fraction-of-whole =
// shadedColumns/columns). Step 2: the same grid, but only the first
// `selectedRows` rows within the shaded columns get the "selected"
// color — the rest of the grid (shaded-but-unselected, and
// never-shaded) stays a lighter/neutral fill — showing the final
// selection of resultNumerator/resultDenominator. Used for MD-05
// (multiply two proper fractions).

export function FractionAreaModel({
  rows,
  columns,
  shadedColumns,
  selectedRows,
  resultNumerator,
  resultDenominator,
  shadeColor = "blue",
  selectColor = "green",
}: {
  rows: number;
  columns: number;
  shadedColumns: number;
  selectedRows: number;
  resultNumerator: number;
  resultDenominator: number;
  shadeColor?: BarColor;
  selectColor?: BarColor;
}) {
  const { fill: shadeFill, border: shadeBorder } = BAR_COLORS[shadeColor];
  const { fill: selectFill, border: selectBorder } = BAR_COLORS[selectColor];
  const rowArr = Array.from({ length: rows });
  const colArr = Array.from({ length: columns });

  function grid(mode: "step1" | "step2") {
    return (
      <div className="flex flex-col overflow-hidden rounded-md border border-[#2e3248]">
        {rowArr.map((_, r) => (
          <div key={r} className="flex">
            {colArr.map((_, c) => {
              const isShaded = c < shadedColumns;
              const isSelected = mode === "step2" && isShaded && r < selectedRows;
              const fill = isSelected ? selectFill : isShaded ? shadeFill : "transparent";
              const border = isSelected ? selectBorder : isShaded ? shadeBorder : "#2e3248";
              return (
                <div
                  key={c}
                  className="h-6 w-6 border-b border-r border-[#2e3248] last:border-r-0 sm:h-7 sm:w-7"
                  style={{ background: isShaded || isSelected ? `${fill}66` : "transparent", borderColor: border }}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="text-[10px] font-bold text-[#8a8fa8]">1. Shade {shadedColumns} of {columns}</div>
          {grid("step1")}
          <div className="text-[#f1f0ee]">
            <MathSpan latex={`\\frac{${shadedColumns}}{${columns}}`} /> of the whole
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 text-[#8a8fa8]">
          <div className="text-[#f1f0ee]">
            <MathSpan latex={`\\frac{${selectedRows}}{${rows}}`} />
          </div>
          <div className="text-xl">→</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-[10px] font-bold text-[#8a8fa8]">2. Take {selectedRows} of {rows} rows</div>
          {grid("step2")}
          <div className="text-[#f1f0ee]">
            {resultNumerator} selected parts out of {resultDenominator}
          </div>
        </div>
      </div>
      <div className="text-[10px] text-[#8a8fa8]">
        split each of the {columns} shaded columns into {rows} rows: {rows} × {columns} = {resultDenominator} parts;
        select {selectedRows} × {shadedColumns} = {resultNumerator} parts
      </div>
    </div>
  );
}


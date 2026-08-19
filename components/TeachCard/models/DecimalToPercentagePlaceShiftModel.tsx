import { MathSpan } from "@/components/MathText";
import { type BarColor } from "../types";
import { HundredGrid } from "../shared";

// ── DecimalToPercentagePlaceShiftModel ────────────────────────────────────
// New component (FDP-04): two stacked sections.
//   1. Hundred-square block (reuses the shared HundredGrid also used by
//      FDP-01/02) — decimal/fraction/percent chain underneath.
//   2. Place-value shift chart: a column-header row (from
//      `placeValueShift.columns`) followed by one row per step, each
//      showing where that step's value's digits land in those columns,
//      with the tracked digit's column (`step.digitColumn`) highlighted.
//      An operation label (e.g. "×10") separates consecutive steps.
// Used for FDP-04 (converting a decimal to a percentage via place-value
// shift, including decimals smaller than 0.01).

// Strips LaTeX escaping (e.g. "37\%" -> "37%") for use in plain-text
// headings where the value isn't rendered through MathSpan — needed
// because hundredSquareModel.percent is stored as raw LaTeX ("37\\%")
// for use inside MathSpan elsewhere in this component, but this one
// heading interpolates it directly into JSX text instead.
function stripLatexEscaping(s: string): string {
  return s.replace(/\\%/g, "%").replace(/\\/g, "");
}

function digitsForColumns(value: string, columns: string[]): Record<string, string> {
  const [intPart, decPart = ""] = value.split(".");
  const onesIndex = columns.indexOf("Ones");
  const intCols = onesIndex >= 0 ? columns.slice(0, onesIndex + 1) : columns.slice(0, 3);
  const decCols = onesIndex >= 0 ? columns.slice(onesIndex + 1) : columns.slice(3);

  const digitsMap: Record<string, string> = {};
  const intDigits = intPart.split("");
  for (let i = 0; i < intCols.length; i++) {
    const idxFromRight = intCols.length - 1 - i;
    const digit = intDigits[intDigits.length - 1 - idxFromRight];
    digitsMap[intCols[i]] = digit ?? "";
  }
  for (let i = 0; i < decCols.length; i++) {
    digitsMap[decCols[i]] = decPart[i] ?? "";
  }
  return digitsMap;
}

function PlaceValueChart({
  steps,
  columns,
  result,
  highlightColor = "gold",
}: {
  steps: Array<{ value: string; digitColumn: string; operation?: string }>;
  columns: string[];
  result: string;
  highlightColor?: BarColor;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
        {columns.map((col) => (
          <div key={col} className="text-center text-[8px] font-bold uppercase text-[#8a8fa8]">
            {col}
          </div>
        ))}
      </div>
      {steps.map((step, i) => {
        const digits = digitsForColumns(step.value, columns);
        return (
          <div key={i} className="flex flex-col gap-1">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
              {columns.map((col) => {
                const isTracked = col === step.digitColumn;
                return (
                  <div
                    key={col}
                    className="flex h-8 items-center justify-center rounded border text-sm font-bold"
                    style={{
                      borderColor: isTracked ? "#fbd97a" : "#2e3248",
                      background: isTracked ? "#f9c74f22" : "#22263a",
                      color: isTracked ? "#fbd97a" : "#f1f0ee",
                    }}
                  >
                    {digits[col]}
                  </div>
                );
              })}
            </div>
            <div className="text-center text-[10px] text-[#8a8fa8]">
              <MathSpan latex={step.value} />
            </div>
            {step.operation && i < steps.length - 1 && (
              <div className="flex items-center justify-center gap-1 py-0.5">
                <div className="text-sm text-[#8a8fa8]">↓</div>
                <span className="text-[10px] font-bold text-[#8a8fa8]">
                  <MathSpan latex={step.operation} />
                </span>
              </div>
            )}
          </div>
        );
      })}
      <div className="mt-2 flex justify-center rounded-lg border border-[#2e3248] bg-[#22263a] px-3 py-2 text-[#f1f0ee]">
        <MathSpan latex={result} display />
      </div>
    </div>
  );
}

export function DecimalToPercentagePlaceShiftModel({
  hundredSquareModel,
  placeValueShift,
  squareColor = "blue",
  highlightColor = "gold",
}: {
  hundredSquareModel: {
    decimal: string;
    percent: string;
    totalParts: number;
    shadedParts: number;
  };
  placeValueShift: {
    steps: Array<{ value: string; digitColumn: string; operation?: string }>;
    result: string;
    columns: string[];
  };
  squareColor?: BarColor;
  highlightColor?: BarColor;
}) {
  const fraction = `\\frac{${hundredSquareModel.shadedParts}}{${hundredSquareModel.totalParts}}`;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* ── Hundred square example ── */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-wide text-[#8a8fa8]">
          {hundredSquareModel.decimal} and {stripLatexEscaping(hundredSquareModel.percent)} describe the same part
        </div>
        <div className="flex flex-wrap items-start gap-4">
          <div className="max-w-[10rem] flex-1">
            <HundredGrid
              totalParts={hundredSquareModel.totalParts}
              shadedParts={hundredSquareModel.shadedParts}
              color={squareColor}
            />
          </div>
          <div className="flex flex-shrink-0 flex-col items-center gap-1 text-[#f1f0ee]">
            <MathSpan latex={hundredSquareModel.decimal} />
            <span className="text-[9px] text-[#8a8fa8]">=</span>
            <MathSpan latex={fraction} />
            <span className="text-[9px] text-[#8a8fa8]">=</span>
            <MathSpan latex={hundredSquareModel.percent} />
          </div>
        </div>
        <div className="text-center text-[10px] text-[#8a8fa8]">
          {hundredSquareModel.shadedParts} of the {hundredSquareModel.totalParts} equal squares are shaded
        </div>
      </div>

      {/* ── Place-value shift chart ── */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-wide text-[#8a8fa8]">Place-value shift</div>
        <PlaceValueChart
          steps={placeValueShift.steps}
          columns={placeValueShift.columns}
          result={placeValueShift.result}
          highlightColor={highlightColor}
        />
      </div>
    </div>
  );
}

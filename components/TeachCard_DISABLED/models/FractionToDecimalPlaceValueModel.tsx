// components/TeachCard/models/FractionToDecimalPlaceValueModel.tsx
//
// FDP-07 (DB id 1643): "Convert a/10, a/100, a/1000 to a decimal."
// Two-part visual:
//   Part A — place-value table (7/10, 6/100, 42/1000 -> decimal, mirror of
//            FDP-06's table but in the opposite direction)
//   Part B — placeholder-zero step sequence for 9/1000 -> 0.009
//
// This component does NOT render its own header text or the caption —
// TeachCard (index.tsx) already renders `visual_model.caption` generically
// below whatever this returns.
//
// Sizing note: Part A reuses the colSpan-result-row table pattern from
// DecimalToFractionRegroupModel (avoids the 6th-column overflow bug).
// Part B is a single non-wrapping row (fixed-width boxes/arrows, horizontal
// scroll fallback via overflow-x-auto) rather than flex-wrap — this is a
// continuous left-to-right chain matching the doc exactly, and wrapping it
// into a multi-row grid (an earlier version of this file did that) loses
// the narrative and doesn't match the doc's layout.

import type { ReactNode } from "react";
import { MathSpan } from "@/components/MathText";

type PlaceValueRow = {
  digits: string[]; // maps 1:1 to `columns` from index 0
  result: string; // "0.042"
  fraction: string; // "42/1000" — plain string, not LaTeX
  decimalPlaces: number;
};

type PlaceValueTable = {
  rows: PlaceValueRow[];
  columns: string[]; // ["Ones","Tenths","Hundredths","Thousandths"]
};

type PlaceholderZeroSequence = {
  steps: Array<{ label: string; detail: string }>;
  fraction: string; // "9/1000"
};

export interface FractionToDecimalPlaceValueProps {
  placeValueTable: PlaceValueTable;
  placeholderZeroSequence: PlaceholderZeroSequence;
}

function fracToLatex(fraction: string): string {
  const [num, denom] = fraction.split("/");
  return `\\frac{${num}}{${denom}}`;
}

export function FractionToDecimalPlaceValueModel({
  placeValueTable,
  placeholderZeroSequence: sequence,
}: FractionToDecimalPlaceValueProps) {
  const colCount = placeValueTable.columns.length;
  const lastStep = sequence.steps[sequence.steps.length - 1];

  return (
    <div className="flex flex-col gap-6">
      {/* Part A — place-value table (fraction -> decimal) */}
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
              <tr key={`${row.fraction}-vals`}>
                <td className="whitespace-nowrap pr-3 text-right text-[#f1f0ee]">
                  <MathSpan latex={fracToLatex(row.fraction)} />
                </td>
                {placeValueTable.columns.map((_, i) => (
                  <td
                    key={i}
                    className="border border-[#2e3248] px-2 py-1 text-center text-[#f1f0ee]"
                  >
                    {row.digits[i] ?? ""}
                  </td>
                ))}
              </tr>,
              <tr key={`${row.fraction}-result`}>
                <td colSpan={colCount + 1} className="pb-3 pt-1 text-right text-[#f1f0ee]">
                  <span className="mr-1">=</span>
                  <MathSpan latex={row.result} />
                </td>
              </tr>,
            ])}
          </tbody>
        </table>
      </div>

      {/* Part B — placeholder-zero step sequence, matching the doc's
          structure exactly: [starting fraction] --label--> [box] --label-->
          [box] ... one box per step, arrow LABELS shown above the arrows
          (not stacked inside the boxes as before). Rendered as a single
          non-wrapping row with horizontal scroll fallback (fixed widths,
          not flex-1/flex-wrap) — this is a continuous chain, so wrapping
          it into a grid loses the left-to-right narrative; a wrap-based
          layout was the earlier version's mistake. */}
      <div className="flex flex-col items-center gap-6 border-t border-[#2e3248] pt-4">
        <div className="w-full overflow-x-auto">
          <div className="flex items-stretch" style={{ gap: 8, width: "max-content" }}>
            {[
              <FlowBox key="start">
                <MathSpan latex={fracToLatex(sequence.fraction)} />
              </FlowBox>,
              ...sequence.steps.flatMap((step, i) => [
                <FlowArrow key={`arrow-${i}`} label={step.label} />,
                <FlowBox key={`box-${i}`}>{step.detail}</FlowBox>,
              ]),
            ]}
          </div>
        </div>

        <div className="text-[#f1f0ee]">
          <MathSpan latex={`${fracToLatex(sequence.fraction)} = ${lastStep.detail}`} display />
        </div>
      </div>
    </div>
  );
}

function FlowBox({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg border border-[#2e3248] bg-[#22263a] px-2 py-2 text-center text-xs text-[#f1f0ee]"
      style={{ minWidth: 100, flexShrink: 0 }}
    >
      {children}
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center text-[10px] leading-tight text-[#8a8fa8]"
      style={{ width: 72, flexShrink: 0 }}
    >
      <span>{label}</span>
      <span aria-hidden className="mt-1 text-[#f1f0ee]">
        →
      </span>
    </div>
  );
}
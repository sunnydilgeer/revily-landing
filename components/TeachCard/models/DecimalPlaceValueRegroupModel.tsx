// components/TeachCard/models/DecimalPlaceValueRegroupModel.tsx
//
// FDP-06: "Convert a terminating decimal to a fraction."
// Two-part visual, matching the doc exactly:
//   Part A — place-value table (0.7, 0.47, 0.305 → denominator justification)
//   Part B — hundred-square shaded, then regrouped into blocks of `groupSize`
//            (0.32 → 32/100 → 8/25)
//
// Drop this file into components/TeachCard/models/, then wire it per
// wiring_and_sql_FDP-06.md (types.ts union member + registry.tsx entry).

import React from "react";
import { HundredGrid } from "../shared";
import MathText from "@/components/MathText";

type PlaceValueRow = {
  decimal: string; // "0.305"
  ones: string;
  tenths: string;
  hundredths: string;
  thousandths: string;
  fractionNumerator: number;
  fractionDenominator: number;
};

type RegroupExample = {
  decimal: string; // "0.32"
  totalParts: number; // 100
  shadedParts: number; // 32
  groupSize: number; // 4
  simplifiedNumerator: number; // 8
  simplifiedDenominator: number; // 25
};

export interface DecimalPlaceValueRegroupProps {
  placeValueRows: PlaceValueRow[];
  regroupExample: RegroupExample;
}

const COLUMN_ORDER = ["ones", "tenths", "hundredths", "thousandths"] as const;
const COLUMN_LABELS: Record<(typeof COLUMN_ORDER)[number], string> = {
  ones: "Ones",
  tenths: "Tenths",
  hundredths: "Hundredths",
  thousandths: "Thousandths",
};

export function DecimalPlaceValueRegroupModel({
  placeValueRows,
  regroupExample,
}: DecimalPlaceValueRegroupProps) {
  const { decimal, totalParts, shadedParts, groupSize, simplifiedNumerator, simplifiedDenominator } =
    regroupExample;
  const totalGroups = totalParts / groupSize;
  const shadedGroups = shadedParts / groupSize;

  return (
    <div className="flex flex-col gap-6">
      {/* Part A — place-value table */}
      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold">
          Visual model: the final decimal place determines the denominator
        </div>

        <div className="overflow-x-auto">
          <table className="border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-16" />
                {COLUMN_ORDER.map((c) => (
                  <th key={c} className="border px-3 py-1 font-semibold whitespace-nowrap">
                    {COLUMN_LABELS[c]}
                  </th>
                ))}
                <th className="w-16" />
              </tr>
            </thead>
            <tbody>
              {placeValueRows.map((row) => (
                <tr key={row.decimal}>
                  <td className="pr-3 text-right whitespace-nowrap">{row.decimal}</td>
                  {COLUMN_ORDER.map((c) => (
                    <td key={c} className="border px-3 py-1 text-center min-w-[3rem]">
                      {row[c]}
                    </td>
                  ))}
                  <td className="pl-3 whitespace-nowrap">
                    <MathText>{`$=\\frac{${row.fractionNumerator}}{${row.fractionDenominator}}$`}</MathText>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part B — hundred square + regroup */}
      <div className="flex flex-col items-center gap-4 border-t pt-4">
        <div className="text-sm font-semibold self-start">
          Visual model: {decimal} becomes{" "}
          <MathText>{`$\\frac{${shadedParts}}{${totalParts}}$`}</MathText> and then{" "}
          <MathText>{`$\\frac{${simplifiedNumerator}}{${simplifiedDenominator}}$`}</MathText>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <HundredGrid totalParts={totalParts} shadedParts={shadedParts} color="blue" />

          <div className="flex flex-col items-center text-xs text-center flex-shrink-0 w-32">
            <span>group every {groupSize} hundredths</span>
            <span>divide both parts by {groupSize}</span>
            <span aria-hidden className="text-lg leading-none mt-1">
              →
            </span>
          </div>

          <GroupedGrid totalGroups={totalGroups} shadedGroups={shadedGroups} color="#60a5fa" />
        </div>

        <div className="flex justify-between w-full text-xs px-2 flex-wrap gap-x-4">
          <span>
            {shadedParts} of {totalParts} small squares are shaded
          </span>
          <span>
            {simplifiedNumerator} of {simplifiedDenominator} equal groups are shaded
          </span>
        </div>

        <MathText>
          {`$${decimal} = \\frac{${shadedParts}}{${totalParts}} = \\frac{${shadedParts} \\div ${groupSize}}{${totalParts} \\div ${groupSize}} = \\frac{${simplifiedNumerator}}{${simplifiedDenominator}}$`}
        </MathText>

        <div className="text-xs text-center">
          Every change is equivalent because the numerator and denominator are divided by the same
          number.
        </div>
      </div>
    </div>
  );
}

// Coarser grid where each cell represents one GROUP of small squares, not one square.
// This is a shared-build candidate — any future skill that shows "regroup into blocks of N"
// (e.g. simplifying other hundredths fractions) can reuse this as-is. Promote to shared.tsx
// the first time a second model needs it, per HBO's "candidate shared build" convention.
//
// NOTE: uses inline style (not a Tailwind bg-{color}-400 string) deliberately — dynamic
// Tailwind class names get purged unless safelisted. Check how HundredGrid handles its
// `color` prop and match that convention once you can see its real source.
function GroupedGrid({
  totalGroups,
  shadedGroups,
  color,
}: {
  totalGroups: number;
  shadedGroups: number;
  color: string;
}) {
  const perRow = Math.min(totalGroups, 5);
  const cells = Array.from({ length: totalGroups }, (_, i) => i < shadedGroups);

  return (
    <div
      className="grid gap-0.5 flex-shrink-0"
      style={{ gridTemplateColumns: `repeat(${perRow}, minmax(0, 1.5rem))` }}
    >
      {cells.map((shaded, i) => (
        <div
          key={i}
          className="w-6 h-6 border border-gray-400"
          style={{ backgroundColor: shaded ? color : "white" }}
        />
      ))}
    </div>
  );
}

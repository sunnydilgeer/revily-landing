import type { ReactNode } from "react";
import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── BenchmarkEquivalenceModel ─────────────────────────────────────────────
// New component (FDP-03): two stacked sections matching the doc.
//   1. Benchmark table: one row per `benchmarkTable` entry — a shaded
//      unit-fraction bar (segment count parsed from the unit fraction's
//      own denominator, since the DB only gives LaTeX strings, not
//      numeric totalParts/shadedParts like FDP-01/02 did), then an arrow
//      into the fraction = hundredths-fraction = decimal = percent chain.
//   2. Multiple build: the same unit bar shown copied `copies` times
//      alongside the resulting bar, with the three multiplied equations
//      (fraction/decimal/percent) underneath — mirrors the doc's rule box
//      but as a visual diagram rather than plain text.
// Used for FDP-03 (benchmark fraction/decimal/percentage equivalences).

// Doc-matching row colors, cycled in table order (blue, green, gold,
// purple) — not part of BarColor (blue/gold/green/red) since the doc's
// 4th row is purple, not one of the four app bar colors. Same convention
// as the fixed 4-color set used for MD-17's process-strip bubbles.
const ROW_COLORS = [
  { fill: "#818cf8", border: "#a5b4fc" }, // blue
  { fill: "#4ade80", border: "#86efac" }, // green
  { fill: "#f9c74f", border: "#fbd97a" }, // gold
  { fill: "#c4a7f5", border: "#d8c2fa" }, // purple
];

// The DB only stores the unit fraction as a LaTeX string (e.g.
// "\frac{1}{5}"), not a numeric denominator — parsed here so the bar
// knows how many segments to draw. Falls back to no bar (chain-only
// row) rather than crashing if the format ever doesn't match.
function parseUnitFractionDenominator(fractionLatex: string): number | null {
  const match = fractionLatex.match(/\\frac\{1\}\{(\d+)\}/);
  return match ? parseInt(match[1], 10) : null;
}

function UnitBar({
  denominator,
  shadedCount,
  color,
}: {
  denominator: number;
  shadedCount: number;
  color: { fill: string; border: string };
}) {
  return (
    <div className="flex overflow-hidden rounded-md border" style={{ borderColor: `${color.border}88` }}>
      {Array.from({ length: denominator }).map((_, i) => (
        <div
          key={i}
          className="h-8 w-8 flex-shrink-0 border-r last:border-r-0"
          style={{
            borderColor: `${color.border}55`,
            background: i < shadedCount ? color.fill : "transparent",
          }}
        />
      ))}
    </div>
  );
}

function BoxedEquation({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-[#2e3248] bg-[#22263a] px-3 py-2 text-[#f1f0ee]">
      {children}
    </div>
  );
}

function BenchmarkRow({
  fraction,
  hundredths,
  decimal,
  percent,
  color,
}: {
  fraction: string;
  hundredths: string;
  decimal: string;
  percent: string;
  color: { fill: string; border: string };
}) {
  const denominator = parseUnitFractionDenominator(fraction);
  return (
    <div className="flex flex-wrap items-center gap-3">
      {denominator && <UnitBar denominator={denominator} shadedCount={1} color={color} />}
      <div className="text-lg text-[#8a8fa8]">→</div>
      <div className="flex flex-wrap items-center gap-1.5 text-[#f1f0ee]">
        <MathSpan latex={fraction} />
        <span className="text-sm text-[#8a8fa8]">=</span>
        <MathSpan latex={hundredths} />
        <span className="text-sm text-[#8a8fa8]">=</span>
        <MathSpan latex={decimal} />
        <span className="text-sm text-[#8a8fa8]">=</span>
        <MathSpan latex={percent} />
      </div>
    </div>
  );
}

export function BenchmarkEquivalenceModel({
  benchmarkTable,
  multipleBuild,
}: {
  benchmarkTable: Array<{
    fraction: string;
    hundredths: string;
    decimal: string;
    percent: string;
  }>;
  multipleBuild: {
    unit: { decimal: string; percent: string; fraction: string };
    copies: number;
    result: { decimal: string; percent: string; fraction: string };
  };
}) {
  const unitDenominator = parseUnitFractionDenominator(multipleBuild.unit.fraction);
  const buildColor = ROW_COLORS[3];

  return (
    <div className="flex w-full flex-col gap-6">
      {/* ── Boxed 2x2 equation grid (matches the doc's Key Point box) ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {benchmarkTable.map((row, i) => (
          <BoxedEquation key={i}>
            <MathSpan latex={`${row.fraction} = ${row.decimal} = ${row.percent}`} display />
          </BoxedEquation>
        ))}
      </div>

      {/* ── Benchmark table ── */}
      <div className="flex flex-col gap-3">
        <div className="text-xs font-bold uppercase tracking-wide text-[#8a8fa8]">
          The four benchmark unit fractions
        </div>
        {benchmarkTable.map((row, i) => (
          <BenchmarkRow key={i} {...row} color={ROW_COLORS[i % ROW_COLORS.length]} />
        ))}
      </div>

      {/* ── Multiple build ── */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-wide text-[#8a8fa8]">
          Building a multiple from {multipleBuild.copies} copies
        </div>
        {unitDenominator && (
          <div className="flex flex-wrap items-center gap-3">
            <UnitBar denominator={unitDenominator} shadedCount={1} color={buildColor} />
            <span className="text-sm font-bold text-[#8a8fa8]">× {multipleBuild.copies} →</span>
            <UnitBar denominator={unitDenominator} shadedCount={multipleBuild.copies} color={buildColor} />
          </div>
        )}
        <div className="flex flex-col items-center gap-1 text-[#f1f0ee]">
          <div className="flex items-center gap-1.5">
            <MathSpan latex={multipleBuild.unit.fraction} />
            <span className="text-sm text-[#8a8fa8]">×</span>
            <span>{multipleBuild.copies}</span>
            <span className="text-sm text-[#8a8fa8]">=</span>
            <MathSpan latex={multipleBuild.result.fraction} />
          </div>
          <div className="flex items-center gap-1.5">
            <MathSpan latex={multipleBuild.unit.decimal} />
            <span className="text-sm text-[#8a8fa8]">×</span>
            <span>{multipleBuild.copies}</span>
            <span className="text-sm text-[#8a8fa8]">=</span>
            <MathSpan latex={multipleBuild.result.decimal} />
          </div>
          <div className="flex items-center gap-1.5">
            <MathSpan latex={multipleBuild.unit.percent} />
            <span className="text-sm text-[#8a8fa8]">×</span>
            <span>{multipleBuild.copies}</span>
            <span className="text-sm text-[#8a8fa8]">=</span>
            <MathSpan latex={multipleBuild.result.percent} />
          </div>
        </div>
        <div className="mt-1 flex flex-col items-center gap-1">
          <div className="text-xs font-bold text-[#8a8fa8]">Therefore:</div>
          <BoxedEquation>
            <MathSpan
              latex={`${multipleBuild.result.fraction} = ${multipleBuild.result.decimal} = ${multipleBuild.result.percent}`}
              display
            />
          </BoxedEquation>
        </div>
      </div>
    </div>
  );
}

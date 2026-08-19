// components/TeachCard/models/FractionRepartitionZoomModel.tsx
//
// FDP-08 (DB id 1686): "Convert a fraction to a decimal using an
// equivalent fraction."
// Two-part visual, rendered in doc order (top to bottom):
//   Part 1 — strip repartition: 3/5 (5 parts, 3 shaded) repartitioned into
//            6/10 (10 parts, 6 shaded), same shaded length, landing at 0.6
//            on a number line.
//   Part 2 — eighths-to-thousandths zoom: 3/8 shaded, magnify one eighth
//            to show it equals 125 thousandths, three shaded eighths sum
//            to 375 thousandths, landing at 0.375 on a labeled number line.
//
// This component does NOT render its own header text or the caption —
// TeachCard (index.tsx) already renders `visual_model.caption` generically
// below whatever this returns.
//
// A few doc elements aren't literal DB fields (the "each fifth is split
// into 2 equal tenths" annotation, the "N of M parts" side-captions, the
// unlabeled 0.1-spaced ticks on the strip-repartition number line) — these
// are derived mechanically from parts/shaded/scale-factor via the ordinal
// helper below, not invented. See the note on this union member in
// types.ts.

import { MathSpan } from "@/components/MathText";
import { numberToWords, capitalize } from "../shared";
import { BAR_COLORS, type BarColor } from "../types";

type StripSide = { parts: number; shaded: number; fraction: string };

type StripRepartition = {
  original: StripSide;
  repartitioned: StripSide;
  numberLinePoint: string;
};

type EighthsZoom = {
  original: StripSide;
  shadedTotal: string;
  numberLineMarks: string[];
  numberLinePoint: string;
  oneEighthEquals: string;
};

export interface FractionRepartitionZoomProps {
  stripRepartition: StripRepartition;
  eighthsZoom: EighthsZoom;
}

function fracToLatex(fraction: string): string {
  const [num, denom] = fraction.split("/");
  return `\\frac{${num}}{${denom}}`;
}

// ── Ordinal fraction names ──────────────────────────────────────────────
// Covers exactly the denominators in the doc's own "Original denominator /
// Useful target" table, plus a few common extras. Generic "Nths" fallback
// for anything outside GCSE Foundation FDP's usual range.
const ORDINAL_NAMES: Record<number, { singular: string; plural: string }> = {
  2: { singular: "half", plural: "halves" },
  3: { singular: "third", plural: "thirds" },
  4: { singular: "quarter", plural: "quarters" },
  5: { singular: "fifth", plural: "fifths" },
  6: { singular: "sixth", plural: "sixths" },
  8: { singular: "eighth", plural: "eighths" },
  10: { singular: "tenth", plural: "tenths" },
  20: { singular: "twentieth", plural: "twentieths" },
  25: { singular: "twenty-fifth", plural: "twenty-fifths" },
  40: { singular: "fortieth", plural: "fortieths" },
  50: { singular: "fiftieth", plural: "fiftieths" },
  100: { singular: "hundredth", plural: "hundredths" },
  125: { singular: "hundred-and-twenty-fifth", plural: "hundred-and-twenty-fifths" },
  200: { singular: "two-hundredth", plural: "two-hundredths" },
  250: { singular: "two-hundred-and-fiftieth", plural: "two-hundred-and-fiftieths" },
  500: { singular: "five-hundredth", plural: "five-hundredths" },
  1000: { singular: "thousandth", plural: "thousandths" },
};

function ordinalName(n: number, form: "singular" | "plural" = "plural"): string {
  const entry = ORDINAL_NAMES[n];
  if (entry) return entry[form];
  return form === "singular" ? `${n}th` : `${n}ths`;
}

export function FractionRepartitionZoomModel({
  stripRepartition,
  eighthsZoom,
}: FractionRepartitionZoomProps) {
  return (
    <div className="flex flex-col gap-8">
      <StripRepartitionSection data={stripRepartition} />
      <div className="border-t border-[#2e3248] pt-6">
        <EighthsZoomSection data={eighthsZoom} />
      </div>
    </div>
  );
}

// ── Part 1: strip repartition ─────────────────────────────────────────────

function StripRepartitionSection({ data }: { data: StripRepartition }) {
  const { original, repartitioned, numberLinePoint } = data;
  const scaleFactor = repartitioned.parts / original.parts;
  const pointWords = `${capitalize(numberToWords(repartitioned.shaded))} ${ordinalName(
    repartitioned.parts
  )}`;

  return (
    <div className="flex flex-col gap-3">
      <StripRow fraction={original.fraction} parts={original.parts} shaded={original.shaded} color="blue" />

      <div className="text-center text-xs text-[#8a8fa8]">
        each {ordinalName(original.parts, "singular")} is split into {scaleFactor} equal{" "}
        {ordinalName(repartitioned.parts)}
      </div>

      <StripRow
        fraction={repartitioned.fraction}
        parts={repartitioned.parts}
        shaded={repartitioned.shaded}
        color="green"
      />

      <NumberLine point={numberLinePoint} />
      <div className="text-center text-xs text-[#8a8fa8]">
        {pointWords} reaches the point {numberLinePoint}
      </div>
    </div>
  );
}

function StripRow({
  fraction,
  parts,
  shaded,
  color,
}: {
  fraction: string;
  parts: number;
  shaded: number;
  color: BarColor;
}) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="w-12 flex-shrink-0 text-right text-[#f1f0ee]">
        <MathSpan latex={fracToLatex(fraction)} />
      </div>
      <StripBar parts={parts} shaded={shaded} color={color} />
      <div className="w-24 flex-shrink-0 text-xs text-[#8a8fa8]">
        {shaded} of {parts} parts
      </div>
    </div>
  );
}

function StripBar({ parts, shaded, color }: { parts: number; shaded: number; color: BarColor }) {
  const { fill, border } = BAR_COLORS[color];
  return (
    <div
      className="flex w-full flex-1 overflow-hidden rounded-md border"
      style={{ borderColor: `${border}88`, height: 36 }}
    >
      {Array.from({ length: parts }).map((_, i) => (
        <div
          key={i}
          className="h-full flex-1 border-r last:border-r-0"
          style={{
            borderColor: `${border}40`,
            background: i < shaded ? fill : "transparent",
          }}
        />
      ))}
    </div>
  );
}

// ── Part 2: eighths-to-thousandths zoom ────────────────────────────────────

function EighthsZoomSection({ data }: { data: EighthsZoom }) {
  const { original, shadedTotal, numberLineMarks, numberLinePoint, oneEighthEquals } = data;
  const bracketLabel = `${capitalize(numberToWords(original.shaded))} equal ${ordinalName(original.parts)}`;
  const boxValue = oneEighthEquals.split(" ")[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="text-center text-xs text-[#8a8fa8]">{bracketLabel}</div>

      <div className="flex w-full items-center gap-3">
        <StripBar parts={original.parts} shaded={original.shaded} color="blue" />
        <div className="w-16 flex-shrink-0 text-xs text-[#8a8fa8]">
          <MathSpan latex={fracToLatex(original.fraction)} /> shaded
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-start justify-center gap-6">
        <div className="flex flex-col items-center gap-1" style={{ maxWidth: 160 }}>
          <span className="text-xs text-[#8a8fa8]">magnify one eighth ↘</span>
          <div
            className="w-full rounded-md border"
            style={{
              height: 40,
              borderColor: "#a5b4fc88",
              backgroundImage:
                "repeating-linear-gradient(90deg, #818cf855 0px, #818cf855 1px, transparent 1px, transparent 6px)",
            }}
          />
          <span className="text-center text-xs text-[#8a8fa8]">
            one eighth contains
            <br />
            {oneEighthEquals}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-[#8a8fa8]">the three shaded eighths become</span>
          <AdditionBoxes count={original.shaded} value={boxValue} result={shadedTotal} />
        </div>
      </div>

      <NumberLine point={numberLinePoint} marks={numberLineMarks} />
    </div>
  );
}

function AdditionBoxes({ count, value, result }: { count: number; value: string; result: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }).flatMap((_, i) => {
          const box = (
            <div
              key={`box-${i}`}
              className="rounded-lg border border-[#2e3248] bg-[#22263a] px-3 py-1.5 text-sm text-[#f1f0ee]"
            >
              {value}
            </div>
          );
          if (i === 0) return [box];
          return [
            <span key={`plus-${i}`} className="text-[#f1f0ee]">
              +
            </span>,
            box,
          ];
        })}
      </div>
      <span aria-hidden className="text-[#f1f0ee]">
        ↓
      </span>
      <div className="text-sm font-semibold text-[#f1f0ee]">{result}</div>
    </div>
  );
}

// ── Shared number line ──────────────────────────────────────────────────
// If `marks` isn't given, defaults to 11 evenly spaced unlabeled ticks
// (0, 0.1, ... 1) with only the ends labeled — a standard number-line
// convention, not invented data.
function NumberLine({ marks, point }: { marks?: string[]; point: string }) {
  const effectiveMarks =
    marks && marks.length > 0
      ? marks
      : ["0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1"];
  const pointPct = parseFloat(point) * 100;

  return (
    <div className="relative w-full" style={{ height: 52 }}>
      <div
        className="absolute flex flex-col items-center"
        style={{ left: `${pointPct}%`, transform: "translateX(-50%)", top: 0 }}
      >
        <span className="text-xs font-semibold" style={{ color: "#f87171" }}>
          {point}
        </span>
        <span aria-hidden style={{ color: "#f87171", fontSize: 14, lineHeight: 1 }}>
          ▾
        </span>
      </div>

      <div className="absolute w-full" style={{ top: 30, borderTop: "1px solid #8a8fa8" }} />

      {effectiveMarks.map((mark) => {
        const pct = parseFloat(mark) * 100;
        const showLabel = marks !== undefined || mark === "0" || mark === "1";
        return (
          <div
            key={mark}
            className="absolute flex flex-col items-center"
            style={{ left: `${pct}%`, top: 26, transform: "translateX(-50%)" }}
          >
            <div style={{ width: 1, height: 10, background: "#8a8fa8" }} />
            {showLabel && <span className="mt-1 text-[10px] text-[#8a8fa8]">{mark}</span>}
          </div>
        );
      })}
    </div>
  );
}

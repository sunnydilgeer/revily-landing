// components/TeachCard/models/RepartitionHundredSquareImproperModel.tsx
//
// FDP-10 (DB id 1776): "Convert a fraction to a percentage using
// denominator 100."
// Two-part visual, rendered in doc order:
//   Part 1 — repartition: 3/5 (strip, 5 parts, 3 shaded) split every
//            fifth into 20 pieces -> 60/100 -> hundred square reading 60%.
//   Part 2 — improper fraction: 5/4 as five quarter-pieces -> one whole
//            hundred square (100%) + a second hundred square 25% shaded
//            -> 125% total.
//
// This component does NOT render its own header text or the caption —
// TeachCard (index.tsx) already renders `visual_model.caption` generically
// below whatever this returns.
//
// A couple of connective labels ("split every fifth into 20 equal
// pieces", "arrange the same 100 parts as a hundred square", "rebuild the
// pieces as hundred squares") are derived from the numeric fields (via the
// ordinal-name helper) or are fixed generic UI chrome describing the
// mechanical step shown, not literal DB fields — see the note on this
// union member in types.ts.

import { MathSpan } from "@/components/MathText";
import { HundredGrid, numberToWords, capitalize } from "../shared";
import { BAR_COLORS, type BarColor } from "../types";

type RepartitionModel = {
  result: string; // "60%"
  totalParts: number; // 5
  resultTotal: number; // 100
  shadedParts: number; // 3
  splitFactor: number; // 20
  resultShaded: number; // 60
  originalFraction: string; // "3/5"
};

type ImproperFractionModel = {
  result: string; // "125%"
  wholesFormed: number; // 1
  totalQuarters: number; // 5
  remainderPercent: string; // "25%"
  firstWholePercent: string; // "100%"
  remainingQuarters: number; // 1
};

export interface RepartitionHundredSquareImproperProps {
  repartitionModel: RepartitionModel;
  improperFractionModel: ImproperFractionModel;
}

function fracToLatex(fraction: string): string {
  const [num, denom] = fraction.split("/");
  return `\\frac{${num}}{${denom}}`;
}

function percentToInt(percent: string): number {
  return parseInt(percent.replace("%", ""), 10);
}

// Same bounded ordinal-name lookup used in FractionRepartitionZoomModel
// (FDP-08) — duplicated locally per this codebase's existing convention
// for not-yet-shared helpers; now needed by a third file, worth promoting
// to shared.tsx in a future cleanup pass.
const ORDINAL_NAMES: Record<number, { singular: string; plural: string }> = {
  2: { singular: "half", plural: "halves" },
  3: { singular: "third", plural: "thirds" },
  4: { singular: "quarter", plural: "quarters" },
  5: { singular: "fifth", plural: "fifths" },
  8: { singular: "eighth", plural: "eighths" },
  10: { singular: "tenth", plural: "tenths" },
  20: { singular: "twentieth", plural: "twentieths" },
  25: { singular: "twenty-fifth", plural: "twenty-fifths" },
  100: { singular: "hundredth", plural: "hundredths" },
};

function ordinalName(n: number, form: "singular" | "plural" = "plural"): string {
  const entry = ORDINAL_NAMES[n];
  if (entry) return entry[form];
  return form === "singular" ? `${n}th` : `${n}ths`;
}

export function RepartitionHundredSquareImproperModel({
  repartitionModel,
  improperFractionModel,
}: RepartitionHundredSquareImproperProps) {
  return (
    <div className="flex flex-col gap-8">
      <RepartitionSection data={repartitionModel} />
      <div className="border-t border-[#2e3248] pt-6">
        <ImproperFractionSection data={improperFractionModel} />
      </div>
    </div>
  );
}

// ── Part 1: strip -> split -> hundred square ────────────────────────────

function RepartitionSection({ data }: { data: RepartitionModel }) {
  const { result, totalParts, resultTotal, shadedParts, splitFactor, resultShaded, originalFraction } =
    data;

  return (
    <div className="flex flex-col gap-3">
      <StripRow fraction={originalFraction} parts={totalParts} shaded={shadedParts} color="blue" />
      <div className="text-center text-xs text-[#8a8fa8]">
        split every {ordinalName(totalParts, "singular")} into {splitFactor} equal pieces
      </div>
      <StripRow
        fraction={`${resultShaded}/${resultTotal}`}
        parts={resultTotal}
        shaded={resultShaded}
        color="green"
      />
      <div className="text-center text-xs text-[#8a8fa8]">
        arrange the same {resultTotal} parts as a hundred square
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <div style={{ width: 100, flexShrink: 0 }}>
          <HundredGrid totalParts={resultTotal} shadedParts={resultShaded} color="green" />
        </div>
        <span aria-hidden className="text-[#f1f0ee]">
          →
        </span>
        <ResultBox headline={result} caption={`${resultShaded} shaded squares out of ${resultTotal}`} />
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
      <div className="w-16 flex-shrink-0 text-right text-[#f1f0ee]">
        <MathSpan latex={fracToLatex(fraction)} />
      </div>
      <StripBar parts={parts} shaded={shaded} color={color} />
      <div className="w-28 flex-shrink-0 text-xs text-[#8a8fa8]">
        {shaded} of {parts} parts shaded
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

// ── Part 2: improper fraction -> two hundred squares ────────────────────

function ImproperFractionSection({ data }: { data: ImproperFractionModel }) {
  const { result, wholesFormed, totalQuarters, remainderPercent, firstWholePercent, remainingQuarters } =
    data;

  const firstWholeShaded = percentToInt(firstWholePercent);
  const remainderShaded = percentToInt(remainderPercent);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-[#f1f0ee]">
        <MathSpan latex={`\\frac{${totalQuarters}}{4}`} />
      </div>
      <div className="text-center text-xs text-[#8a8fa8]">
        The fraction {totalQuarters}/4 means {numberToWords(totalQuarters)} quarter-pieces.
      </div>

      <div className="text-xs font-semibold text-[#f1f0ee]">
        {capitalize(numberToWords(totalQuarters))} quarter-pieces
      </div>

      <div className="w-full overflow-x-auto">
        <div className="mx-auto flex justify-center" style={{ gap: 4, width: "max-content" }}>
          {Array.from({ length: totalQuarters }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded-md border text-[#f1f0ee]"
              style={{
                borderColor: "#a5b4fc88",
                background: "#818cf822",
                width: 34,
                height: 34,
                flexShrink: 0,
              }}
            >
              <MathSpan latex="\tfrac{1}{4}" />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-[#8a8fa8]">
        {capitalize(numberToWords(wholesFormed * 4))} quarters make {numberToWords(wholesFormed)} whole
        {wholesFormed === 1 ? "" : "s"}
      </div>

      <div className="text-center text-xs text-[#8a8fa8]">rebuild the pieces as hundred squares</div>

      <div className="flex flex-wrap items-start justify-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <div style={{ width: 100, flexShrink: 0 }}>
            <HundredGrid totalParts={100} shadedParts={firstWholeShaded} color="green" />
          </div>
          <span className="text-center text-xs text-[#8a8fa8]">
            {firstWholeShaded} shaded
            <br />
            hundredths
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div style={{ width: 100, flexShrink: 0 }}>
            <HundredGrid totalParts={100} shadedParts={remainderShaded} color="green" />
          </div>
          <span className="text-center text-xs text-[#8a8fa8]">
            {remainderShaded} shaded
            <br />
            hundredths
          </span>
        </div>
        <ResultBox
          headline={result}
          caption={`${firstWholeShaded} hundredths + ${remainderShaded} hundredths`}
        />
      </div>
    </div>
  );
}

function ResultBox({ headline, caption }: { headline: string; caption: string }) {
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-lg border px-4 py-3 text-center"
      style={{ borderColor: "#86efac88", background: "#4ade8011" }}
    >
      <span className="text-lg font-semibold text-[#f1f0ee]">{headline}</span>
      <span className="text-xs text-[#8a8fa8]">{caption}</span>
    </div>
  );
}
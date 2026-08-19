// components/TeachCard/models/AlignedFractionDecimalPercentModel.tsx
//
// FDP-11 (DB id 1823): "Convert a fraction to a percentage using a
// decimal."
// Two-part visual, rendered in doc order:
//   Part 1 — proper fraction: 3/8 strip -> aligned decimal line (0.375)
//            -> aligned percentage line (37.5%), same endpoint on all three.
//   Part 2 — improper fraction: 9/8 strip (first 8 pieces = 1 whole, 9th
//            piece extra) -> aligned decimal line (1.125) -> aligned
//            percentage line (112.5%).
//
// This component does NOT render its own header text or the caption —
// TeachCard (index.tsx) already renders `visual_model.caption` generically
// below whatever this returns.
//
// See the note on this union member in types.ts re: "decimal"/
// "percentage" labels being placed above their lines rather than beside
// them, as a deliberate width-collapse-risk reduction, not a data change.

import { MathSpan } from "@/components/MathText";

type Endpoint = { decimal: string; percent: string };

type ProperFractionModel = {
  endpoint: Endpoint;
  fraction: string;
  totalParts: number;
  shadedParts: number;
  decimalMarks: string[];
  percentMarks: string[];
};

type ImproperFractionModel = {
  endpoint: Endpoint;
  fraction: string;
  totalPieces: number;
  decimalMarks: string[];
  percentMarks: string[];
  piecesPerWhole: number;
};

export interface AlignedFractionDecimalPercentProps {
  properFractionModel: ProperFractionModel;
  improperFractionModel: ImproperFractionModel;
}

function fracToLatex(fraction: string): string {
  const [num, denom] = fraction.split("/");
  return `\\frac{${num}}{${denom}}`;
}

export function AlignedFractionDecimalPercentModel({
  properFractionModel,
  improperFractionModel,
}: AlignedFractionDecimalPercentProps) {
  return (
    <div className="flex flex-col gap-10">
      <ProperSection data={properFractionModel} />
      <div className="border-t border-[#2e3248] pt-6">
        <ImproperSection data={improperFractionModel} />
      </div>
    </div>
  );
}

// ── Part 1: proper fraction ──────────────────────────────────────────────

function ProperSection({ data }: { data: ProperFractionModel }) {
  const { endpoint, fraction, totalParts, shadedParts, decimalMarks, percentMarks } = data;
  // The strip spans the full row here: totalParts (eighths) represents
  // the whole 0-1 unit the number lines below also span.
  const connectorPct = (shadedParts / totalParts) * 100;
  const segments = Array.from({ length: totalParts }, (_, i) => (i < shadedParts ? "#818cf8" : "transparent"));

  return (
    <AlignedScaleSection
      fraction={fraction}
      stripWidthPct={100}
      connectorPct={connectorPct}
      connectorLabel="the shaded endpoint stays aligned"
      segments={segments}
      decimal={endpoint.decimal}
      percent={endpoint.percent}
      decimalMarks={decimalMarks}
      percentMarks={percentMarks}
    />
  );
}

// ── Part 2: improper fraction ────────────────────────────────────────────

function ImproperSection({ data }: { data: ImproperFractionModel }) {
  const { endpoint, fraction, totalPieces, decimalMarks, percentMarks, piecesPerWhole } = data;
  const maxDecimal = Math.max(...decimalMarks.map((m) => parseFloat(m)));
  // 9 pieces of 1/8 each = 1.125 "whole units" of value; the strip's own
  // width is that value as a fraction of the number line's own max (1.25),
  // so the strip's right edge lines up with the endpoint on both scales.
  const wholeSpanValue = totalPieces / piecesPerWhole;
  const stripWidthPct = (wholeSpanValue / maxDecimal) * 100;
  const segments = Array.from({ length: totalPieces }, (_, i) => (i < piecesPerWhole ? "#818cf8" : "#4ade80"));

  return (
    <AlignedScaleSection
      fraction={fraction}
      stripWidthPct={stripWidthPct}
      connectorPct={stripWidthPct}
      connectorLabel="the endpoint passes one whole"
      segments={segments}
      decimal={endpoint.decimal}
      percent={endpoint.percent}
      decimalMarks={decimalMarks}
      percentMarks={percentMarks}
    />
  );
}

// ── Shared section shell ──────────────────────────────────────────────────

function AlignedScaleSection({
  fraction,
  stripWidthPct,
  connectorPct,
  connectorLabel,
  segments,
  decimal,
  percent,
  decimalMarks,
  percentMarks,
}: {
  fraction: string;
  stripWidthPct: number;
  connectorPct: number;
  connectorLabel: string;
  segments: string[];
  decimal: string;
  percent: string;
  decimalMarks: string[];
  percentMarks: string[];
}) {
  return (
    <div className="relative flex flex-col gap-5" style={{ paddingTop: 18 }}>
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{ left: `${connectorPct}%`, top: 0, bottom: 0, borderLeft: "1px dashed #f9c74f" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute text-center"
        style={{ left: `${connectorPct}%`, top: 0, transform: "translateX(-50%)", whiteSpace: "nowrap" }}
      >
        <span style={{ fontSize: 10, color: "#f9c74f" }}>{connectorLabel}</span>
      </div>

      <div className="w-full">
        <div className="mb-1 text-xs font-semibold text-[#f1f0ee]">
          <MathSpan latex={fracToLatex(fraction)} />
        </div>
        <div style={{ width: `${stripWidthPct}%` }}>
          <div
            className="flex overflow-hidden rounded-md border"
            style={{ borderColor: "#8a8fa888", height: 32 }}
          >
            {segments.map((color, i) => (
              <div
                key={i}
                className="h-full flex-1 border-r last:border-r-0"
                style={{ borderColor: "#2e324840", background: color }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="mb-1 text-xs font-semibold text-[#8a8fa8]">decimal</div>
        <ScaleLine marks={decimalMarks} highlightValue={decimal} />
      </div>
      <div className="w-full">
        <div className="mb-1 text-xs font-semibold text-[#8a8fa8]">percentage</div>
        <ScaleLine marks={percentMarks} highlightValue={percent} />
      </div>
    </div>
  );
}

function ScaleLine({ marks, highlightValue }: { marks: string[]; highlightValue: string }) {
  const maxMark = Math.max(...marks.map((m) => parseFloat(m.replace("%", ""))));
  return (
    <div className="relative w-full" style={{ height: 42 }}>
      <div className="absolute w-full" style={{ top: 16, borderTop: "1px solid #8a8fa8" }} />
      {marks.map((mark) => {
        const val = parseFloat(mark.replace("%", ""));
        const pct = (val / maxMark) * 100;
        const isHighlight = mark === highlightValue;
        return (
          <div
            key={mark}
            className="absolute flex flex-col items-center"
            style={{ left: `${pct}%`, top: isHighlight ? 4 : 12, transform: "translateX(-50%)" }}
          >
            {isHighlight && (
              <span aria-hidden style={{ color: "#4ade80", fontSize: 12, lineHeight: 1, marginBottom: 2 }}>
                ▾
              </span>
            )}
            <div style={{ width: 1, height: 8, background: isHighlight ? "#4ade80" : "#8a8fa8" }} />
            <span
              className="mt-1 text-[10px]"
              style={{ color: isHighlight ? "#4ade80" : "#8a8fa8", fontWeight: isHighlight ? 700 : 400 }}
            >
              {mark}
            </span>
          </div>
        );
      })}
    </div>
  );
}

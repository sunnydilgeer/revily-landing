// components/TeachCard/models/TripleFormModel.tsx
//
// FDP-15 (DB id 2040): "Solve mixed GCSE Foundation FDP questions."
// Two three-panel visuals, rendered in doc order:
//   Part 1 — proper fraction: 3/5 = 0.6 = 60%, shown as a fraction strip,
//            a percentage HundredGrid, and a decimal number line (0-1).
//   Part 2 — above one: 5/4 = 1.25 = 125%, shown as a whole-plus-extra
//            fraction bar, a decimal number line (0-2), and a percentage
//            number line (0-200%) — percentage can't cleanly fit a single
//            hundred-square once it's over 100%, so this panel is a line
//            instead of a grid, unlike Part 1's percentage panel.
//
// This component does NOT render its own header text or the caption —
// TeachCard (index.tsx) already renders `visual_model.caption` generically
// below whatever this returns.

import { MathSpan } from "@/components/MathText";
import { HundredGrid } from "../shared";

type TripleFormModelData = {
  result: string; // "3/5 = 0.6 = 60%"
  fraction: { label: string; numerator: number; denominator: number };
  decimalLine: { label: string; point: number; scaleEnd: number; scaleStart: number };
  percentageGrid: { label: string; shaded: number; wholeAmount: number };
};

type TripleFormAboveOneModelData = {
  result: string; // "5/4 = 1.25 = 125%"
  fraction: { label: string; wholeParts: number; extraNumerator: number; extraDenominator: number };
  decimalScale: { label: string; point: number; scaleEnd: number; scaleStart: number };
  percentageScale: { label: string; point: number; scaleEnd: number; scaleStart: number };
};

export interface TripleFormProps {
  tripleFormModel: TripleFormModelData;
  tripleFormAboveOneModel: TripleFormAboveOneModelData;
}

function fracToLatex(fraction: string): string {
  const [num, denom] = fraction.split("/");
  return `\\frac{${num}}{${denom}}`;
}

// Handles chained comparisons/equalities, e.g. "3/5 = 0.6 = 60%".
function resultToLatex(result: string): string {
  const tokens = result.split(/\s*(<|>|=)\s*/);
  return tokens
    .map((t) => {
      if (t === "<" || t === ">" || t === "=") return t;
      const s = t.trim();
      if (s.includes("/")) return fracToLatex(s);
      if (s.endsWith("%")) return `${s.slice(0, -1)}\\%`;
      return s;
    })
    .join(" ");
}

export function TripleFormModel({ tripleFormModel, tripleFormAboveOneModel }: TripleFormProps) {
  return (
    <div className="flex flex-col gap-8">
      <ProperTriptych data={tripleFormModel} />
      <div className="border-t border-[#2e3248] pt-6">
        <AboveOneTriptych data={tripleFormAboveOneModel} />
      </div>
    </div>
  );
}

// ── Part 1: proper fraction triptych ─────────────────────────────────────

function ProperTriptych({ data }: { data: TripleFormModelData }) {
  const { result, fraction, decimalLine, percentageGrid } = data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-20 flex-shrink-0 text-xs font-semibold text-[#8a8fa8]">fraction</div>
        <div
          className="flex flex-1 overflow-hidden rounded-md border"
          style={{ borderColor: "#8a8fa888", height: 32 }}
        >
          {Array.from({ length: fraction.denominator }).map((_, i) => (
            <div
              key={i}
              className="h-full flex-1 border-r last:border-r-0"
              style={{
                borderColor: "#2e324840",
                background: i < fraction.numerator ? "#818cf8" : "transparent",
              }}
            />
          ))}
        </div>
        <div className="w-10 flex-shrink-0 text-[#818cf8]">
          <MathSpan latex={fracToLatex(fraction.label)} />
        </div>
      </div>
      <div className="text-center text-xs text-[#8a8fa8]">
        {fraction.numerator} of {fraction.denominator} equal parts are shaded
      </div>

      <div className="flex items-center gap-3">
        <div className="w-20 flex-shrink-0 text-xs font-semibold text-[#8a8fa8]">percentage</div>
        <div style={{ width: 110, flexShrink: 0 }}>
          <HundredGrid totalParts={percentageGrid.wholeAmount} shadedParts={percentageGrid.shaded} color="gold" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold" style={{ color: "#f9c74f" }}>
            {percentageGrid.label}
          </span>
          <span className="text-xs text-[#8a8fa8]">
            {percentageGrid.shaded} of the {percentageGrid.wholeAmount} small squares are shaded.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-20 flex-shrink-0 text-xs font-semibold text-[#8a8fa8]">decimal</div>
        <div className="flex-1">
          <NumberLineWithPoint
            scaleStart={decimalLine.scaleStart}
            scaleEnd={decimalLine.scaleEnd}
            point={decimalLine.point}
            label={decimalLine.label}
            color="#4ade80"
            formatTick={(v) => String(v)}
          />
        </div>
      </div>

      <div className="text-center text-[#f1f0ee]">
        <MathSpan latex={resultToLatex(result)} display />
      </div>
    </div>
  );
}

// ── Part 2: above-one triptych ────────────────────────────────────────────

function AboveOneTriptych({ data }: { data: TripleFormAboveOneModelData }) {
  const { result, fraction, decimalScale, percentageScale } = data;
  const { wholeParts, extraNumerator, extraDenominator, label } = fraction;
  const totalSegments = (wholeParts + 1) * extraDenominator;
  const filledSegments = wholeParts * extraDenominator + extraNumerator;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-24 flex-shrink-0 text-xs font-semibold text-[#8a8fa8]">fraction model</div>
        <div
          className="flex flex-1 overflow-hidden rounded-md border"
          style={{ borderColor: "#8a8fa888", height: 32 }}
        >
          {Array.from({ length: totalSegments }).map((_, i) => (
            <div
              key={i}
              className="h-full flex-1 border-r last:border-r-0"
              style={{
                borderColor: "#2e324840",
                background: i < filledSegments ? "#a78bfa" : "transparent",
              }}
            />
          ))}
        </div>
        <div className="w-10 flex-shrink-0" style={{ color: "#a78bfa" }}>
          <MathSpan latex={fracToLatex(label)} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-24 flex-shrink-0 text-xs font-semibold text-[#8a8fa8]">percentage scale</div>
        <div className="flex-1">
          <NumberLineWithPoint
            scaleStart={percentageScale.scaleStart}
            scaleEnd={percentageScale.scaleEnd}
            point={percentageScale.point}
            label={percentageScale.label}
            color="#f9c74f"
            formatTick={(v) => `${v}%`}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-24 flex-shrink-0 text-xs font-semibold text-[#8a8fa8]">decimal scale</div>
        <div className="flex-1">
          <NumberLineWithPoint
            scaleStart={decimalScale.scaleStart}
            scaleEnd={decimalScale.scaleEnd}
            point={decimalScale.point}
            label={decimalScale.label}
            color="#4ade80"
            formatTick={(v) => String(v)}
          />
        </div>
      </div>

      <div className="text-center text-[#f1f0ee]">
        <MathSpan latex={resultToLatex(result)} display />
      </div>
    </div>
  );
}

// ── Shared: number line with one highlighted point ──────────────────────
// The one piece genuinely uniform across both triptychs (decimal line in
// both, percentage line in the above-one version) — kept local since this
// is the only file that needs it three times; promote to shared.tsx if a
// future skill needs it too.
function NumberLineWithPoint({
  scaleStart,
  scaleEnd,
  point,
  label,
  color,
  formatTick,
}: {
  scaleStart: number;
  scaleEnd: number;
  point: number;
  label: string;
  color: string;
  formatTick: (v: number) => string;
}) {
  const range = scaleEnd - scaleStart;
  const tickStep = range / 4;
  const ticks: number[] = [];
  for (let v = scaleStart; v <= scaleEnd + 1e-9; v += tickStep) ticks.push(Math.round(v * 1000) / 1000);
  const pctOf = (v: number) => ((v - scaleStart) / range) * 100;
  const pointPct = pctOf(point);

  return (
    <div className="relative w-full" style={{ height: 46 }}>
      <div
        className="absolute text-center"
        style={{
          left: `clamp(45px, ${pointPct}%, calc(100% - 45px))`,
          top: 0,
          transform: "translateX(-50%)",
          width: 90,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{label}</span>
      </div>

      <div className="absolute w-full" style={{ top: 24, borderTop: "1px solid #8a8fa8" }} />

      {ticks.map((v) => (
        <div
          key={v}
          className="absolute flex flex-col items-center"
          style={{ left: `${pctOf(v)}%`, top: 20, transform: "translateX(-50%)" }}
        >
          <div style={{ width: 1, height: 8, background: "#8a8fa8" }} />
          <span className="mt-1 text-[10px] text-[#8a8fa8]">{formatTick(v)}</span>
        </div>
      ))}

      <div
        className="absolute rounded-full"
        style={{
          left: `${pointPct}%`,
          top: 21,
          width: 7,
          height: 7,
          background: color,
          transform: "translate(-50%, 0)",
        }}
      />
    </div>
  );
}

// components/TeachCard/models/BarOrderWholePlusExtraModel.tsx
//
// FDP-14 (DB id 1984): "Order fractions, decimals and percentages."
// Two-part visual, rendered in doc order:
//   Part 1 — bar ordering: three bars over the same whole (55%, 3/5,
//            0.62), shaded lengths increasing top to bottom, shared axis
//            0 to 1 underneath -> 55% < 3/5 < 0.62.
//   Part 2 — whole-plus-extra: three rows, each a full whole box plus a
//            second box shaded to the extra amount beyond one whole
//            (125%, 1.3, 7/5) -> 125% < 1.3 < 7/5.
//
// This component does NOT render its own header text or the caption —
// TeachCard (index.tsx) already renders `visual_model.caption` generically
// below whatever this returns.

import { MathSpan } from "@/components/MathText";
import { numberToWords, capitalize } from "../shared";

type Bar = { label: string; valueShaded: number };

type BarOrderModel = {
  bars: Bar[];
  result: string; // "55% < 3/5 < 0.62"
  wholeAmount: number; // 100
};

type ExtraRow = { label: string; wholeParts: number; extraShaded: number };

type WholePlusExtraModel = {
  rows: ExtraRow[];
  result: string; // "125% < 1.3 < 7/5"
};

export interface BarOrderWholePlusExtraProps {
  barOrderModel: BarOrderModel;
  wholePlusExtraModel: WholePlusExtraModel;
}

function fracToLatex(fraction: string): string {
  const [num, denom] = fraction.split("/");
  return `\\frac{${num}}{${denom}}`;
}

// Handles any number of chained comparisons, e.g. "55% < 3/5 < 0.62".
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

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function simplifyFraction(num: number, denom: number): [number, number] {
  const d = gcd(num, denom);
  return [num / d, denom / d];
}

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

function SegmentDividers({ count }: { count: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex-1"
          style={i < count - 1 ? { borderRight: "1px solid rgba(255,255,255,0.15)" } : undefined}
        />
      ))}
    </div>
  );
}

export function BarOrderWholePlusExtraModel({
  barOrderModel,
  wholePlusExtraModel,
}: BarOrderWholePlusExtraProps) {
  return (
    <div className="flex flex-col gap-8">
      <BarOrderSection data={barOrderModel} />
      <div className="border-t border-[#2e3248] pt-6">
        <WholePlusExtraSection data={wholePlusExtraModel} />
      </div>
    </div>
  );
}

// ── Part 1: bar ordering ──────────────────────────────────────────────────

function BarOrderSection({ data }: { data: BarOrderModel }) {
  const { bars, result, wholeAmount } = data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-5">
        {bars.map((bar) => {
          const pct = (bar.valueShaded / wholeAmount) * 100;
          const isFraction = bar.label.includes("/");
          const markLabel = isFraction
            ? (() => {
                const [num, denom] = bar.label.split("/");
                return `${num} of ${denom} equal parts`;
              })()
            : `ends at ${(bar.valueShaded / wholeAmount).toFixed(2).replace(/0$/, "")}`;

          return (
            <div key={bar.label}>
              <div className="mb-1 text-xs font-semibold text-[#f1f0ee]">
                {isFraction ? <MathSpan latex={fracToLatex(bar.label)} /> : bar.label}
              </div>
              <div className="relative" style={{ paddingTop: 18 }}>
                <div
                  className="absolute text-center"
                  style={{
                    left: `clamp(55px, ${pct}%, calc(100% - 55px))`,
                    top: 0,
                    transform: "translateX(-50%)",
                    width: 110,
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#f9c74f" }}>{markLabel}</span>
                </div>
                <div
                  className="relative overflow-hidden rounded-md border"
                  style={{ borderColor: "#8a8fa888", height: 30 }}
                >
                  <div className="flex h-full">
                    <div style={{ width: `${pct}%`, background: "#818cf8" }} />
                    <div style={{ width: `${100 - pct}%` }} />
                  </div>
                  <SegmentDividers count={10} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Axis maxValue={1} step={0.25} />

      <div className="text-center text-xs text-[#8a8fa8]">shorter to longer</div>

      <div className="text-center text-[#f1f0ee]">
        <MathSpan latex={resultToLatex(result)} display />
      </div>
    </div>
  );
}

function Axis({ maxValue, step }: { maxValue: number; step: number }) {
  const ticks: number[] = [];
  for (let v = 0; v <= maxValue + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);

  return (
    <div className="relative w-full" style={{ height: 26 }}>
      <div className="absolute w-full" style={{ top: 6, borderTop: "1px solid #8a8fa8" }} />
      {ticks.map((v) => (
        <div
          key={v}
          className="absolute flex flex-col items-center"
          style={{ left: `${(v / maxValue) * 100}%`, top: 2, transform: "translateX(-50%)" }}
        >
          <div style={{ width: 1, height: 8, background: "#8a8fa8" }} />
          <span className="mt-1 text-[10px] text-[#8a8fa8]">{v}</span>
        </div>
      ))}
    </div>
  );
}

// ── Part 2: whole-plus-extra ──────────────────────────────────────────────

function WholePlusExtraSection({ data }: { data: WholePlusExtraModel }) {
  const { rows, result } = data;

  return (
    <div className="flex flex-col gap-5">
      {rows.map((row) => {
        const [num, denom] = simplifyFraction(row.extraShaded, 100);
        const extraPhrase = `${numberToWords(num)} ${ordinalName(denom, num === 1 ? "singular" : "plural")}`;
        const isFraction = row.label.includes("/");

        return (
          <div key={row.label} className="flex flex-col gap-1">
            <div className="text-center text-xs font-semibold" style={{ color: "#f9c74f" }}>
              {capitalize(numberToWords(row.wholeParts))} whole{row.wholeParts === 1 ? "" : "s"} and{" "}
              {extraPhrase}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-14 flex-shrink-0 text-right text-xs text-[#f1f0ee]">
                {isFraction ? <MathSpan latex={fracToLatex(row.label)} /> : row.label}
              </div>
              <div
                className="relative overflow-hidden rounded-md border"
                style={{ borderColor: "#8a8fa888", height: 28, width: 60, background: "#818cf8" }}
              >
                <SegmentDividers count={4} />
              </div>
              <div
                className="relative overflow-hidden rounded-md border"
                style={{ borderColor: "#8a8fa888", height: 28, width: 60 }}
              >
                <div style={{ width: `${row.extraShaded}%`, height: "100%", background: "#4ade80" }} />
                <SegmentDividers count={4} />
              </div>
            </div>
          </div>
        );
      })}

      <div className="text-center text-xs text-[#8a8fa8]">less extra part to more extra part</div>

      <div className="text-center text-[#f1f0ee]">
        <MathSpan latex={resultToLatex(result)} display />
      </div>
    </div>
  );
}
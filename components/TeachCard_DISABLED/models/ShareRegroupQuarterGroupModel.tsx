// components/TeachCard/models/ShareRegroupQuarterGroupModel.tsx
//
// FDP-09 (DB id 1731): "Convert a fraction to a decimal by division."
// Two-part visual, rendered in doc order:
//   Part 1 — sharing model: 3 wholes shared across 8 groups. Each place
//            value too small to share evenly is exchanged for 10 of the
//            next smaller unit (ones->tenths->hundredths->thousandths),
//            ending with "each group receives 0.375".
//   Part 2 — quarter grouping: 7 quarter-pieces regroup into 1 whole + 3
//            remaining quarters, landing at 1.75 on a number line.
//
// This component does NOT render its own header text or the caption —
// TeachCard (index.tsx) already renders `visual_model.caption` generically
// below whatever this returns.
//
// Several labels aren't literal DB fields — see the note on this union
// member in types.ts. They're derived mechanically (parsing the target
// unit from the next step's own text, spelling out counts via the
// existing numberToWords helper), not invented. Flagged here again at the
// point of use for anyone editing this file later.

import { MathSpan } from "@/components/MathText";
import { numberToWords, capitalize } from "../shared";

type SharingStep = { exchange: string; perGroup: string; remainder: string };

type SharingModel = {
  steps: SharingStep[];
  groups: number;
  result: string; // "0.375"
  wholes: number;
};

type QuarterGrouping = {
  wholesFormed: number;
  totalQuarters: number;
  numberLineMarks: string[];
  numberLinePoint: string;
  remainingQuarters: number;
};

export interface ShareRegroupQuarterGroupProps {
  sharingModel: SharingModel;
  quarterGrouping: QuarterGrouping;
}

function leadingCount(text: string): number {
  const match = text.match(/^\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function lastWord(text: string): string {
  const words = text.trim().split(/\s+/);
  return (words[words.length - 1] ?? "").replace(/[^a-zA-Z]/g, "");
}

const PLACE_LABELS = ["Ones", "Tenths", "Hundredths", "Thousandths"];
const PLACE_COLORS = ["#818cf8", "#f9c74f", "#c084fc", "#4ade80"];

export function ShareRegroupQuarterGroupModel({
  sharingModel,
  quarterGrouping,
}: ShareRegroupQuarterGroupProps) {
  return (
    <div className="flex flex-col gap-8">
      <SharingSection data={sharingModel} />
      <div className="border-t border-[#2e3248] pt-6">
        <QuarterGroupingSection data={quarterGrouping} />
      </div>
    </div>
  );
}

// ── Part 1: sharing / exchange model ──────────────────────────────────────

function SharingSection({ data }: { data: SharingModel }) {
  const { steps, groups, result, wholes } = data;
  const digits = (() => {
    const [intPart, fracPart = ""] = result.split(".");
    return [intPart, ...fracPart.split("")];
  })();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center text-xs text-[#8a8fa8]">
        {wholes} wholes shared equally among {groups} groups
      </div>

      {steps.map((step, i) => {
        const isFinal = /^nothing/i.test(step.remainder.trim());
        const perGroupCount = leadingCount(step.perGroup);
        const remainderCount = isFinal ? 0 : leadingCount(step.remainder);
        const nextUnit = i < steps.length - 1 ? lastWord(steps[i + 1].exchange) : null;

        return (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <div style={{ width: 96, flexShrink: 0 }} className="text-[11px] text-[#8a8fa8]">
                {step.exchange}
              </div>
              <div style={{ flexShrink: 0, paddingTop: 6 }} className="text-[#f1f0ee]">
                →
              </div>
              <div className="overflow-x-auto" style={{ flex: "1 1 auto", minWidth: 0 }}>
                <div className="flex" style={{ gap: 4, width: "max-content" }}>
                  {Array.from({ length: groups }).map((_, gi) => (
                    <div
                      key={gi}
                      className="rounded-md border border-[#2e3248] text-center"
                      style={{ width: 30, flexShrink: 0, padding: "4px 2px" }}
                    >
                      <div style={{ fontSize: 9, color: "#8a8fa8" }}>{"•".repeat(perGroupCount)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="rounded-md border text-center"
                style={{
                  width: 76,
                  flexShrink: 0,
                  padding: "4px 4px",
                  borderColor: isFinal ? "#4ade8088" : "#f8717188",
                }}
              >
                <div style={{ fontSize: 11, color: "#f1f0ee" }}>
                  {isFinal ? "0" : "•".repeat(remainderCount)}
                </div>
                <div style={{ fontSize: 9, color: "#8a8fa8", marginTop: 2 }}>{step.remainder}</div>
              </div>
            </div>
            {!isFinal && nextUnit && (
              <div style={{ fontSize: 10, color: "#8a8fa8" }} className="ml-auto text-right" >
                <span style={{ display: "inline-block", width: 76 }}>exchange into {nextUnit}</span>
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-[#8a8fa8]">Each group receives</span>
        {PLACE_LABELS.map((label, i) => (
          <div
            key={label}
            className="rounded-md border text-center"
            style={{ borderColor: PLACE_COLORS[i], padding: "4px 8px", minWidth: 44 }}
          >
            <div style={{ fontSize: 9, color: PLACE_COLORS[i] }}>{label}</div>
            <div style={{ fontSize: 14, color: "#f1f0ee" }}>{digits[i] ?? ""}</div>
          </div>
        ))}
      </div>
      <div className="text-center text-xs text-[#8a8fa8]">the equal share is {result}</div>
    </div>
  );
}

// ── Part 2: quarter grouping ───────────────────────────────────────────────

function QuarterGroupingSection({ data }: { data: QuarterGrouping }) {
  const { wholesFormed, totalQuarters, numberLineMarks, numberLinePoint, remainingQuarters } = data;
  const piecesPerWhole = 4;

  const bracket1 = `${capitalize(numberToWords(wholesFormed * piecesPerWhole))} quarters make ${numberToWords(
    wholesFormed
  )} whole${wholesFormed === 1 ? "" : "s"}`;
  const bracket2 = `${capitalize(numberToWords(remainingQuarters))} quarters remain`;
  const sub1 = `${wholesFormed} whole${wholesFormed === 1 ? "" : "s"}`;
  const sub2 = `${remainingQuarters} quarters of the next whole`;

  const blueSegments = wholesFormed * piecesPerWhole;
  const purpleSegments = remainingQuarters;
  const emptySegments = piecesPerWhole - remainingQuarters;
  const totalBarSegments = blueSegments + purpleSegments + emptySegments;
  const tileWidth = 34;
  const tileGap = 4;
  const tileStride = tileWidth + tileGap;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-[#f1f0ee]">
        <MathSpan latex={`\\frac{${totalQuarters}}{4}`} />
      </div>

      <div className="w-full overflow-x-auto">
        <div className="mx-auto flex justify-center" style={{ gap: tileGap, width: "max-content" }}>
          {Array.from({ length: totalQuarters }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded-md border text-[#f1f0ee]"
              style={{
                borderColor: "#fbd97a88",
                background: "#f9c74f22",
                width: tileWidth,
                height: tileWidth,
                flexShrink: 0,
              }}
            >
              <MathSpan latex="\tfrac{1}{4}" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-1 text-center">
        <div style={{ width: blueSegments * tileStride, fontSize: 10 }} className="text-[#8a8fa8]">
          {bracket1}
          <br />
          {sub1}
        </div>
        <div style={{ width: remainingQuarters * tileStride, fontSize: 10 }} className="text-[#8a8fa8]">
          {bracket2}
          <br />
          {sub2}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-[#8a8fa8]">
        <span>regroup</span>
        <span aria-hidden className="text-[#f1f0ee]">
          →
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-[#f1f0ee]">
          <MathSpan latex={`${wholesFormed}\\tfrac{${remainingQuarters}}{4}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border" style={{ borderColor: "#8a8fa888" }}>
          {Array.from({ length: totalBarSegments }).map((_, i) => {
            const isBlue = i < blueSegments;
            const isPurple = i >= blueSegments && i < blueSegments + purpleSegments;
            return (
              <div
                key={i}
                style={{
                  width: 26,
                  height: 34,
                  borderRight: i < totalBarSegments - 1 ? "1px solid #2e3248" : "none",
                  background: isBlue ? "#818cf8" : isPurple ? "#c084fc" : "transparent",
                }}
              />
            );
          })}
        </div>
      </div>

      <NumberLine marks={numberLineMarks} point={numberLinePoint} />
    </div>
  );
}

// ── Number line (local copy — see FractionRepartitionZoomModel for the
// same helper; not yet promoted to shared.tsx, see the deferred-cleanup
// note on that file) ──────────────────────────────────────────────────────
function NumberLine({ marks, point }: { marks?: string[]; point: string }) {
  const effectiveMarks =
    marks && marks.length > 0
      ? marks
      : ["0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1"];
  const maxMark = Math.max(...effectiveMarks.map((m) => parseFloat(m)));
  const pointPct = (parseFloat(point) / maxMark) * 100;

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
        const pct = (parseFloat(mark) / maxMark) * 100;
        return (
          <div
            key={mark}
            className="absolute flex flex-col items-center"
            style={{ left: `${pct}%`, top: 26, transform: "translateX(-50%)" }}
          >
            <div style={{ width: 1, height: 10, background: "#8a8fa8" }} />
            <span className="mt-1 text-[10px] text-[#8a8fa8]">{mark}</span>
          </div>
        );
      })}
    </div>
  );
}
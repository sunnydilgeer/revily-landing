// components/TeachCard/models/HundredthsCompareNumberLineModel.tsx
//
// FDP-13 (DB id 1931): "Compare two fractions, decimals or percentages."
// Two-part visual, rendered in doc order:
//   Part 1 — hundredths comparison: two bars over the same whole, 3/5
//            (60/100) vs 58%, showing the top bar extends 2 hundredths
//            farther -> 3/5 > 58%.
//   Part 2 — number line: 0.72 and 3/4 (=0.75) on one shared scale from
//            0.65 to 0.80 -> 0.72 < 3/4.
//
// This component does NOT render its own header text or the caption —
// TeachCard (index.tsx) already renders `visual_model.caption` generically
// below whatever this returns.

import type { ReactNode } from "react";
import { MathSpan } from "@/components/MathText";

type HundredthsModel = {
  result: string; // "3/5 > 58%"
  difference: number; // 2
  wholeAmount: number; // 100
  topValueLabel: string; // "3/5"
  topValueShaded: number; // 60
  bottomValueLabel: string; // "58%"
  bottomValueShaded: number; // 58
};

type NumberLinePoint = { label: string; value: string };

type NumberLineModel = {
  pointA: NumberLinePoint;
  pointB: NumberLinePoint;
  result: string; // "0.72 < 3/4"
  scaleEnd: string; // "0.80"
  scaleStart: string; // "0.65"
};

export interface HundredthsCompareNumberLineProps {
  hundredthsModel: HundredthsModel;
  numberLineModel: NumberLineModel;
}

function fracToLatex(fraction: string): string {
  const [num, denom] = fraction.split("/");
  return `\\frac{${num}}{${denom}}`;
}

// Parses "3/5 > 58%" or "0.72 < 3/4" into LaTeX, converting any
// fraction/percent sides but leaving plain decimals as-is.
function resultToLatex(result: string): string {
  const match = result.match(/(.+?)\s*(>|<|=)\s*(.+)/);
  if (!match) return result;
  const [, left, op, right] = match;
  const side = (s: string) => {
    const t = s.trim();
    if (t.includes("/")) return fracToLatex(t);
    if (t.endsWith("%")) return `${t.slice(0, -1)}\\%`;
    return t;
  };
  return `${side(left)} ${op} ${side(right)}`;
}

export function HundredthsCompareNumberLineModel({
  hundredthsModel,
  numberLineModel,
}: HundredthsCompareNumberLineProps) {
  return (
    <div className="flex flex-col gap-8">
      <HundredthsSection data={hundredthsModel} />
      <div className="border-t border-[#2e3248] pt-6">
        <NumberLineSection data={numberLineModel} />
      </div>
    </div>
  );
}

// ── Part 1: hundredths comparison bars ────────────────────────────────────

function HundredthsSection({ data }: { data: HundredthsModel }) {
  const { result, difference, wholeAmount, topValueLabel, topValueShaded, bottomValueLabel, bottomValueShaded } =
    data;
  const topPct = (topValueShaded / wholeAmount) * 100;
  const bottomPct = (bottomValueShaded / wholeAmount) * 100;
  const [topNum, topDenom] = topValueLabel.includes("/") ? topValueLabel.split("/") : [null, null];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-1 text-xs font-semibold text-[#f1f0ee]">
          {topValueLabel.includes("/") ? <MathSpan latex={fracToLatex(topValueLabel)} /> : topValueLabel}
        </div>
        <Bar100
          totalParts={wholeAmount}
          shaded={topValueShaded}
          color="#818cf8"
          markPct={topPct}
          markLabel={`${topValueShaded} hundredths`}
          markLabelPos="above"
        />
        {topNum && (
          <div className="mt-1 text-xs text-[#8a8fa8]">
            {topNum} of {topDenom} equal parts = {topValueShaded} of {wholeAmount} parts
          </div>
        )}
      </div>

      <div>
        <div className="mb-1 text-xs font-semibold text-[#f1f0ee]">{bottomValueLabel}</div>
        <Bar100
          totalParts={wholeAmount}
          shaded={bottomValueShaded}
          color="#4ade80"
          markPct={bottomPct}
          markLabel={`${bottomValueShaded} hundredths`}
          markLabelPos="below"
        />
        <div className="mt-1 text-xs text-[#8a8fa8]">
          {bottomValueShaded} of {wholeAmount} equal parts
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "#f9c74f" }}>
        <span aria-hidden>↔</span>
        <span>{difference} hundredths farther</span>
      </div>

      <div className="text-center text-[#f1f0ee]">
        <MathSpan latex={resultToLatex(result)} display />
      </div>
    </div>
  );
}

function Bar100({
  totalParts,
  shaded,
  color,
  markPct,
  markLabel,
  markLabelPos,
}: {
  totalParts: number;
  shaded: number;
  color: string;
  markPct: number;
  markLabel: string;
  markLabelPos: "above" | "below";
}) {
  return (
    <div
      className="relative"
      style={{
        paddingTop: markLabelPos === "above" ? 18 : 0,
        paddingBottom: markLabelPos === "below" ? 18 : 0,
      }}
    >
      {markLabelPos === "above" && (
        <div
          className="absolute text-center"
          style={{ left: `${markPct}%`, top: 0, transform: "translateX(-50%)", whiteSpace: "nowrap" }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color }}>{markLabel}</span>
        </div>
      )}
      <div
        className="flex overflow-hidden rounded-md border"
        style={{ borderColor: "#8a8fa888", height: 30 }}
      >
        {Array.from({ length: totalParts }).map((_, i) => (
          <div
            key={i}
            className="h-full flex-1 border-r last:border-r-0"
            style={{ borderColor: "#2e324820", background: i < shaded ? color : "transparent" }}
          />
        ))}
      </div>
      {markLabelPos === "below" && (
        <div
          className="absolute text-center"
          style={{ left: `${markPct}%`, bottom: 0, transform: "translateX(-50%)", whiteSpace: "nowrap" }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color }}>{markLabel}</span>
        </div>
      )}
    </div>
  );
}

// ── Part 2: shared number line, two points ────────────────────────────────

function NumberLineSection({ data }: { data: NumberLineModel }) {
  const { pointA, pointB, result, scaleStart, scaleEnd } = data;
  const start = parseFloat(scaleStart);
  const end = parseFloat(scaleEnd);
  const majorStep = 0.05;
  const minorStep = 0.01;

  const majors: number[] = [];
  for (let v = start; v <= end + 1e-9; v += majorStep) majors.push(Math.round(v * 100) / 100);
  const minors: number[] = [];
  for (let v = start; v <= end + 1e-9; v += minorStep) minors.push(Math.round(v * 100) / 100);

  const pctOf = (v: number) => ((v - start) / (end - start)) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full" style={{ height: 64 }}>
        {minors.map((v) => (
          <div
            key={`minor-${v}`}
            className="absolute"
            style={{ left: `${pctOf(v)}%`, top: 32, width: 1, height: 6, background: "#8a8fa8" }}
          />
        ))}
        <div className="absolute w-full" style={{ top: 32, borderTop: "1px solid #8a8fa8" }} />
        {majors.map((v) => (
          <div
            key={`major-${v}`}
            className="absolute flex flex-col items-center"
            style={{ left: `${pctOf(v)}%`, top: 28, transform: "translateX(-50%)" }}
          >
            <div style={{ width: 1, height: 10, background: "#8a8fa8" }} />
            <span className="mt-1 text-[10px] text-[#8a8fa8]">{v.toFixed(2)}</span>
          </div>
        ))}

        <PointMarker pct={pctOf(parseFloat(pointA.value))} color="#4ade80">
          {pointA.label}
        </PointMarker>
        <PointMarker pct={pctOf(parseFloat(pointB.value))} color="#818cf8">
          {pointB.label.includes("/") ? (
            <MathSpan latex={`${fracToLatex(pointB.label)} = ${pointB.value}`} />
          ) : (
            pointB.label
          )}
        </PointMarker>
      </div>

      <div className="text-center text-[10px] text-[#8a8fa8]">Values farther to the right are larger.</div>

      <div className="text-center text-[#f1f0ee]">
        <MathSpan latex={resultToLatex(result)} display />
      </div>
    </div>
  );
}

function PointMarker({
  pct,
  color,
  children,
}: {
  pct: number;
  color: string;
  children: ReactNode;
}) {
  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: `${pct}%`, top: 0, transform: "translateX(-50%)" }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color, whiteSpace: "nowrap" }}>{children}</div>
      <span aria-hidden style={{ color, fontSize: 12, lineHeight: 1, marginTop: 2 }}>
        ▾
      </span>
    </div>
  );
}

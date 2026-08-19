// components/TeachCard/models/HundredRegroupImproperBarsModel.tsx
//
// FDP-12 (DB id 1873): "Convert a percentage to a fraction in simplest
// form."
// Two-part visual, rendered in doc order:
//   Part 1 — regrouping: 100-cell grid, 35 shaded, regrouped into 20
//            columns of 5 -> 7 whole shaded columns -> 35% = 35/100 = 7/20.
//   Part 2 — improper bars: 125% as two bars split into quarters (first
//            bar fully shaded = 100%, second bar one quarter shaded =
//            25%) -> 5 shaded quarter-pieces -> 5/4 = 1 1/4.
//
// This component does NOT render its own header text or the caption —
// TeachCard (index.tsx) already renders `visual_model.caption` generically
// below whatever this returns.

import { MathSpan } from "@/components/MathText";

type RegroupingModel = {
  result: string; // "7/20"
  groupSize: number; // 5
  totalCells: number; // 100
  shadedCells: number; // 35
  totalGroups: number; // 20
  shadedGroups: number; // 7
};

type ImproperFractionModel = {
  result: string; // "5/4"
  wholeBars: number; // 1
  mixedNumber: string; // "1 1/4"
  quartersPerBar: number; // 4
  totalShadedQuarters: number; // 5
  shadedQuartersFirstBar: number; // 4
  shadedQuartersSecondBar: number; // 1
};

export interface HundredRegroupImproperBarsProps {
  regroupingModel: RegroupingModel;
  improperFractionModel: ImproperFractionModel;
}

function fracToLatex(fraction: string): string {
  const [num, denom] = fraction.split("/");
  return `\\frac{${num}}{${denom}}`;
}

function mixedToLatex(mixed: string): string {
  const [whole, frac] = mixed.trim().split(" ");
  const [num, denom] = frac.split("/");
  return `${whole}\\tfrac{${num}}{${denom}}`;
}

export function HundredRegroupImproperBarsModel({
  regroupingModel,
  improperFractionModel,
}: HundredRegroupImproperBarsProps) {
  return (
    <div className="flex flex-col gap-8">
      <RegroupingSection data={regroupingModel} />
      <div className="border-t border-[#2e3248] pt-6">
        <ImproperBarsSection data={improperFractionModel} />
      </div>
    </div>
  );
}

// ── Part 1: hundred-cell regrouping ──────────────────────────────────────

function RegroupingSection({ data }: { data: RegroupingModel }) {
  const { result, groupSize, totalCells, shadedCells, totalGroups, shadedGroups } = data;
  const cellSize = 13;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="overflow-x-auto">
            <ColumnGroupedGrid
              totalGroups={totalGroups}
              groupSize={groupSize}
              shadedGroups={shadedGroups}
              color="#818cf8"
              cellSize={cellSize}
            />
          </div>
          <div
            className="text-center text-[10px] font-semibold"
            style={{ width: shadedGroups * (cellSize + 1), color: "#4ade80" }}
          >
            {shadedGroups} shaded groups
          </div>
          <div className="text-center text-[10px] text-[#8a8fa8]">
            {totalGroups} equal groups altogether
          </div>
        </div>
        <div className="text-xs text-[#8a8fa8]" style={{ maxWidth: 170 }}>
          <div className="font-semibold" style={{ color: "#818cf8" }}>
            {shadedCells} shaded cells
          </div>
          <div className="mt-1">Each full column contains {groupSize} cells.</div>
          <div className="mt-1 font-semibold" style={{ color: "#4ade80" }}>
            {shadedCells} cells fill {shadedGroups} whole columns.
          </div>
        </div>
      </div>

      <div className="text-center text-[#f1f0ee]">
        <MathSpan
          latex={`${shadedCells}\\% = \\frac{${shadedCells}}{${totalCells}} = ${fracToLatex(result)}`}
          display
        />
      </div>
    </div>
  );
}

function ColumnGroupedGrid({
  totalGroups,
  groupSize,
  shadedGroups,
  color,
  cellSize,
}: {
  totalGroups: number;
  groupSize: number;
  shadedGroups: number;
  color: string;
  cellSize: number;
}) {
  return (
    <div className="flex" style={{ gap: 1, width: "max-content" }}>
      {Array.from({ length: totalGroups }).map((_, colIndex) => (
        <div key={colIndex} className="flex flex-col" style={{ gap: 1 }}>
          {Array.from({ length: groupSize }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                width: cellSize,
                height: cellSize,
                border: "1px solid #2e3248",
                background: colIndex < shadedGroups ? color : "transparent",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Part 2: improper percentage as two quarter-bars ─────────────────────

function ImproperBarsSection({ data }: { data: ImproperFractionModel }) {
  const {
    result,
    mixedNumber,
    quartersPerBar,
    totalShadedQuarters,
    shadedQuartersFirstBar,
    shadedQuartersSecondBar,
  } = data;

  const firstPercent = Math.round((shadedQuartersFirstBar / quartersPerBar) * 100);
  const secondPercent = Math.round((shadedQuartersSecondBar / quartersPerBar) * 100);
  const totalPercent = Math.round((totalShadedQuarters / quartersPerBar) * 100);

  return (
    <div className="flex flex-col gap-4">
      <BarRow
        label="first whole"
        quarters={quartersPerBar}
        shaded={shadedQuartersFirstBar}
        color="#818cf8"
        captionLatex={`${firstPercent}\\% = ${shadedQuartersFirstBar} \\text{ shaded quarter${
          shadedQuartersFirstBar === 1 ? "" : "s"
        }}`}
      />
      <BarRow
        label="next whole"
        quarters={quartersPerBar}
        shaded={shadedQuartersSecondBar}
        color="#4ade80"
        captionLatex={`${secondPercent}\\% = ${shadedQuartersSecondBar} \\text{ shaded quarter${
          shadedQuartersSecondBar === 1 ? "" : "s"
        }}`}
      />

      <div className="text-center text-xs font-semibold" style={{ color: "#f9c74f" }}>
        {totalShadedQuarters} shaded quarter-pieces altogether
      </div>

      <div className="text-center text-[#f1f0ee]">
        <MathSpan
          latex={`${totalPercent}\\% = \\frac{${totalPercent}}{100} = ${fracToLatex(result)} = ${mixedToLatex(
            mixedNumber
          )}`}
          display
        />
      </div>
    </div>
  );
}

function BarRow({
  label,
  quarters,
  shaded,
  color,
  captionLatex,
}: {
  label: string;
  quarters: number;
  shaded: number;
  color: string;
  captionLatex: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-center text-xs font-semibold text-[#f1f0ee]">
        <MathSpan latex={captionLatex} />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-20 flex-shrink-0 text-right text-xs text-[#8a8fa8]">{label}</div>
        <div
          className="flex flex-1 overflow-hidden rounded-md border"
          style={{ borderColor: "#8a8fa888", height: 34 }}
        >
          {Array.from({ length: quarters }).map((_, i) => (
            <div
              key={i}
              className="h-full flex-1 border-r last:border-r-0"
              style={{ borderColor: "#2e324840", background: i < shaded ? color : "transparent" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── GroupUnitPartsByDivisorModel ─────────────────────────────────────────
// Two stacked bars for dividing a whole number by a proper fraction:
// (1) `wholeCount` wholes converted into one continuous bar of
// `totalParts` unit-fraction segments, all one color; (2) the same
// bar recolored in consecutive blocks of `groupSize` segments (the
// divisor's numerator), each block a distinct color and labeled
// "group N" underneath, with a check box reporting the group count.
// Used for MD-12 (divide a whole number by a proper fraction) —
// mirrors the doc's own "12 thirds, grouped into pairs" diagram.

export function GroupUnitPartsByDivisorModel({
  wholeCount,
  partsPerWhole,
  totalParts,
  groupSize,
  groupCount,
  unitLabel = "parts",
  baseColor = "blue",
  groupColors,
}: {
  wholeCount: number;
  partsPerWhole: number;
  totalParts: number;
  groupSize: number;
  groupCount: number;
  unitLabel?: string;
  baseColor?: BarColor;
  groupColors?: BarColor[];
}) {
  const colors: BarColor[] = groupColors && groupColors.length > 0 ? groupColors : ["blue", "gold", "green", "red"];
  const { fill: baseFill, border: baseBorder } = BAR_COLORS[baseColor];
  const parts = Array.from({ length: totalParts });
  const groups = Array.from({ length: groupCount });
  const segmentRem = 1.75; // matches h-7/w-7 segment size at mobile width

  return (
    <div className="flex w-full flex-col items-center gap-3 overflow-x-auto">
      <div className="rounded-lg border border-[#2e3248] bg-[#22263a] px-3 py-2 text-xs font-bold text-[#f1f0ee]">
        <MathSpan
          latex={`${wholeCount} \\div \\frac{${groupSize}}{${partsPerWhole}}`}
        />{" "}
        asks: how many groups of <MathSpan latex={`\\frac{${groupSize}}{${partsPerWhole}}`} /> fit into {wholeCount} wholes?
      </div>
      {/* Row 1: wholes as one continuous bar, ungrouped */}
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        <div className="w-24 flex-shrink-0 text-right text-xs font-bold text-[#f1f0ee]">
          {wholeCount} wholes
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {parts.map((_, i) => (
            <div
              key={i}
              className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
              style={{ background: baseFill, borderColor: baseBorder }}
            />
          ))}
        </div>
        <div className="text-xs font-bold text-[#8a8fa8]">
          = {totalParts} {unitLabel}
        </div>
      </div>
      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        <div className="mt-1">group into sets of {groupSize}</div>
      </div>
      {/* Row 2: same bar, recolored in blocks of groupSize, with group labels underneath */}
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        <div className="w-24 flex-shrink-0 text-right text-xs font-bold text-[#f1f0ee]">
          Group into sets
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {parts.map((_, i) => {
              const { fill, border } = BAR_COLORS[colors[Math.floor(i / groupSize) % colors.length]];
              return (
                <div
                  key={i}
                  className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                  style={{ background: fill, borderColor: border }}
                />
              );
            })}
          </div>
          <div className="flex">
            {groups.map((_, g) => (
              <div
                key={g}
                className="flex flex-col items-center border-b border-[#8a8fa8] pt-1"
                style={{ width: `${groupSize * segmentRem}rem` }}
              >
                <div className="mt-1 whitespace-nowrap text-[9px] text-[#8a8fa8]">group {g + 1}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs font-bold text-[#8a8fa8]">
          each group is <MathSpan latex={`\\frac{${groupSize}}{${partsPerWhole}}`} />
        </div>
      </div>
      <div className="mt-1 rounded-lg border border-[#4ade8066] bg-[#4ade8011] px-4 py-2 text-[#f1f0ee]">
        <MathSpan
          latex={`${wholeCount} \\div \\frac{${groupSize}}{${partsPerWhole}} = ${groupCount} \\text{ groups}`}
        />
      </div>
    </div>
  );
}


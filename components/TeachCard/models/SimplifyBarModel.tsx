import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── SimplifyBarModel ─────────────────────────────────────────────────────
// Regrouping visual: a bar divided into labeled groups (e.g. "one
// quarter" spanning 2 of 8 segments), arrow across to a second, smaller
// bar showing the simplified fraction. Only draws group brackets under
// the filled portion, matching the doc's diagram. Supports both a
// horizontal layout (AF-03's original layout) and vertical (AF-10:
// bars stacked with a down arrow) via `orientation`.

export function SimplifyBarModel({
  fromNumerator,
  fromDenominator,
  toNumerator,
  toDenominator,
  groupLabel = "group",
  transitionLabel,
  orientation = "horizontal",
  fromColor = "blue",
  toColor = "green",
}: {
  fromNumerator: number;
  fromDenominator: number;
  toNumerator: number;
  toDenominator: number;
  groupLabel?: string;
  transitionLabel?: string;
  orientation?: "horizontal" | "vertical";
  fromColor?: BarColor;
  toColor?: BarColor;
}) {
  const fromSegments = Array.from({ length: fromDenominator });
  const toSegments = Array.from({ length: toDenominator });
  const groupSize = fromDenominator / toDenominator;
  const numGroups = groupSize > 0 ? Math.floor(fromNumerator / groupSize) : 0;
  const { fill: fromFill, border: fromBorder } = BAR_COLORS[fromColor];
  const { fill: toFill, border: toBorder } = BAR_COLORS[toColor];
  const segmentRem = 1.75; // matches h-7/w-7 segment size at mobile width

  const fromBar = (
    <div className="flex flex-col items-start gap-1">
      <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
        {fromSegments.map((_, i) => (
          <div
            key={i}
            className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
            style={{
              background: i < fromNumerator ? fromFill : "transparent",
              borderColor: i < fromNumerator ? fromBorder : "#2e3248",
            }}
          />
        ))}
      </div>
      {numGroups > 0 && (
        <div className="flex">
          {Array.from({ length: numGroups }).map((_, g) => (
            <div
              key={g}
              className="flex flex-col items-center border-b border-[#8a8fa8] pt-1"
              style={{ width: `${groupSize * segmentRem}rem` }}
            >
              <div className="mt-1 whitespace-nowrap text-[9px] text-[#8a8fa8]">{groupLabel}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const toBar = (
    <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
      {toSegments.map((_, i) => (
        <div
          key={i}
          className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
          style={{
            background: i < toNumerator ? toFill : "transparent",
            borderColor: i < toNumerator ? toBorder : "#2e3248",
          }}
        />
      ))}
    </div>
  );

  const fromLabel = (
    <div className="text-right text-[#f1f0ee]">
      <MathSpan latex={`\\frac{${fromNumerator}}{${fromDenominator}}`} />
    </div>
  );

  const toLabel = (
    <div className="text-left text-[#f1f0ee]">
      <MathSpan latex={`\\frac{${toNumerator}}{${toDenominator}}`} />
    </div>
  );

  if (orientation === "vertical") {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          {fromLabel}
          {fromBar}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold text-[#8a8fa8]">↓</div>
          {transitionLabel && (
            <div className="max-w-[10rem] text-left text-[10px] leading-tight text-[#8a8fa8]">
              {transitionLabel}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {toLabel}
          {toBar}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {fromLabel}
      {fromBar}
      <div className="text-xl text-[#8a8fa8]">→</div>
      {toBar}
      {toLabel}
    </div>
  );
}


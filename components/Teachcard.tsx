"use client";

import MathText from "@/components/MathText";
import { MathSpan } from "@/components/MathText";

// ── Types ──────────────────────────────────────────────────────────────────
type BarColor = "blue" | "gold" | "green" | "red";

type VisualBarRow = {
  numerator: number;
  denominator: number;
  color: BarColor;
  operatorBefore?: "+" | "=" | "-"; // shown above this row; omit on the first row
  splitLabel?: string; // renders a horizontal arrow + label to the right of this bar, for a split-then-add composite (e.g. AF-05's "1/4 -> 2/8, then + 3/8 = 5/8")
  rightLabel?: string; // raw LaTeX shown to the right of the bar (e.g. "\frac{1}{4}=\frac{2}{8}")
  removeCount?: number; // if set, the LAST removeCount filled segments render crossed-out (X) instead of remainColor — for a split-then-subtract composite (e.g. AF-06)
  remainColor?: BarColor; // color for filled-and-kept segments when removeCount is set (defaults to `color`)
  leftLabelOverride?: string; // raw LaTeX in place of the auto \frac{numerator}{denominator} label — for a row whose label is itself an expression, e.g. "\frac{5}{8}-\frac{2}{8}"
};

type VisualModel =
  | { style?: "add"; rows: VisualBarRow[]; caption: string }
  | {
      style: "remove";
      denominator: number;
      startNumerator: number;
      removeCount: number;
      removeColor?: BarColor;
      resultColor?: BarColor;
      caption: string;
    }
  | {
      style: "simplify";
      fromNumerator: number;
      fromDenominator: number;
      toNumerator: number;
      toDenominator: number;
      groupLabel?: string; // e.g. "one quarter" — labels each bracketed group
      transitionLabel?: string; // e.g. "group every two eighths into one quarter" — shown beside the arrow in vertical orientation
      orientation?: "horizontal" | "vertical"; // defaults to horizontal (AF-03's original layout)
      fromColor?: BarColor;
      toColor?: BarColor;
      caption: string;
    }
  | {
      style: "split";
      fromNumerator: number;
      fromDenominator: number;
      toNumerator: number;
      toDenominator: number;
      splitLabel?: string; // e.g. "each fifth is split into two tenths"
      fromColor?: BarColor;
      toColor?: BarColor;
      caption: string;
    }
  | {
      style: "multiples";
      labelA: string; // e.g. "Multiples of 4"
      listA: number[];
      labelB: string; // e.g. "Multiples of 6"
      listB: number[];
      commonValues: number[]; // values highlighted in both rows
      firstCommon: number; // the one given extra emphasis
      annotation?: string; // e.g. "12 is the first number in both lists"
      caption: string;
    }
  | {
      style: "mixedToImproper";
      wholeNumber: number; // e.g. 2, in "2 1/3"
      numerator: number;
      denominator: number;
      wholeColor?: BarColor;
      fractionColor?: BarColor;
      resultColor?: BarColor;
      caption: string;
    }
  | {
      style: "addMixedNumbers";
      addends: Array<{
        wholeNumber: number;
        numerator: number;
        denominator: number;
        wholeColor?: BarColor;
        fractionColor?: BarColor;
      }>;
      result: {
        wholeNumber: number;
        numerator: number;
        denominator: number;
        wholeColor?: BarColor;
        fractionColor?: BarColor;
      };
      caption: string;
    }
  | {
      style: "subtractMixedNumbers";
      startWhole: number;
      startNumerator: number;
      denominator: number;
      removeWhole: number;
      removeNumerator: number;
      removeLabel?: string; // e.g. "remove 2 1/5"
      startColor?: BarColor;
      keepFractionColor?: BarColor;
      resultColor?: BarColor;
      caption: string;
    }
  | {
      style: "partWholeBars";
      bars: Array<{
        title: string; // e.g. "Combined Total: Add"
        titleColor?: BarColor;
        segments: Array<{ label: string; color: BarColor }>; // 2+ labeled sections
        braceLabel: string; // e.g. "total" — spans the whole bar
        equation: string; // raw LaTeX, e.g. "a+b"
      }>;
      caption: string;
    }
  | {
      style: "exchangeSubtractMixedNumbers";
      originalWhole: number; // e.g. 4, in "4 1/5"
      originalNumerator: number;
      denominator: number;
      removeWhole: number; // removed AFTER exchange
      removeNumerator: number; // removed from the post-exchange fraction (out of denominator+originalNumerator)
      exchangeLabel?: string; // "exchange one whole for five fifths"
      removeLabel?: string; // "remove 2 wholes and 3/5"
      startColor?: BarColor;
      originalFractionColor?: BarColor;
      resultColor?: BarColor;
      caption: string;
    }
  | {
      style: "flowSteps";
      steps: Array<{
        label: string; // e.g. "Start", "After adding"
        value: string; // raw LaTeX
        highlight?: boolean; // true for the final box
      }>;
      arrowLabels: string[]; // one fewer entry than steps
      arrowColors?: BarColor[]; // parallel to arrowLabels
      caption: string;
    };

// Shape of the `teach_content` jsonb column on `questions`
// (only populated when question_type = 'teach').
export type TeachContent = {
  key_point: string; // rendered via MathText — may contain $...$ / $$...$$
  rule: string;       // shown in the boxed rule callout
  formula: string;    // raw LaTeX, no $ delimiters — rendered via MathSpan
  visual_model?: VisualModel;
};

const BAR_COLORS: Record<BarColor, { fill: string; border: string }> = {
  blue:  { fill: "#818cf8", border: "#a5b4fc" },
  gold:  { fill: "#f9c74f", border: "#fbd97a" },
  green: { fill: "#4ade80", border: "#86efac" },
  red:   { fill: "#f87171", border: "#fca5a5" },
};

// ── FractionBarRow ──────────────────────────────────────────────────────────
function FractionBarRow({ row }: { row: VisualBarRow }) {
  const {
    numerator, denominator, color, operatorBefore, splitLabel,
    rightLabel, removeCount, remainColor, leftLabelOverride,
  } = row;
  const segments = Array.from({ length: denominator });
  const { fill, border } = BAR_COLORS[color];
  const remain = remainColor ? BAR_COLORS[remainColor] : null;
  const keepCount = removeCount ? numerator - removeCount : numerator;

  return (
    <div className="flex flex-col items-center gap-1">
      {operatorBefore && (
        <div className="text-lg font-bold text-[#8a8fa8]">{operatorBefore}</div>
      )}
      <div className="flex items-center gap-3">
        <div className="min-w-[2.5rem] flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={leftLabelOverride ?? `\\frac{${numerator}}{${denominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {segments.map((_, i) => {
            const isKept = i < keepCount;
            const isRemoved = removeCount ? i >= keepCount && i < numerator : false;
            const segFill = isKept ? (remain ? remain.fill : fill) : isRemoved ? fill : "transparent";
            const segBorder = isKept ? (remain ? remain.border : border) : isRemoved ? border : "#2e3248";
            return (
              <div
                key={i}
                className="relative h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                style={{ background: segFill, borderColor: segBorder }}
              >
                {isRemoved && (
                  <svg viewBox="0 0 10 10" className="absolute inset-0 h-full w-full">
                    <line x1="1" y1="1" x2="9" y2="9" stroke="#f87171" strokeWidth="1" />
                    <line x1="9" y1="1" x2="1" y2="9" stroke="#f87171" strokeWidth="1" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
        {splitLabel && (
          <div className="ml-1 flex items-center gap-2">
            <div className="text-lg text-[#8a8fa8]">→</div>
            <div className="max-w-[9rem] text-left text-[10px] leading-tight text-[#8a8fa8]">
              {splitLabel}
            </div>
          </div>
        )}
        {rightLabel && (
          <div className="ml-2 text-left text-[#f1f0ee]">
            <MathSpan latex={rightLabel} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── RemoveBarModel ──────────────────────────────────────────────────────────
// Subtraction visual: one bar showing the starting fraction with the
// removed segments marked with an X, an arrow down, then a second bar
// showing the remainder. Matches the doc's "remove n/d" diagram style,
// distinct from the stacked-bars "add" model above.
function RemoveBarModel({
  denominator,
  startNumerator,
  removeCount,
  removeColor = "blue",
  resultColor = "green",
}: {
  denominator: number;
  startNumerator: number;
  removeCount: number;
  removeColor?: BarColor;
  resultColor?: BarColor;
}) {
  const segments = Array.from({ length: denominator });
  const resultNumerator = startNumerator - removeCount;
  const { fill: startFill, border: startBorder } = BAR_COLORS[removeColor];
  const { fill: resultFill, border: resultBorder } = BAR_COLORS[resultColor];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1 text-xs font-bold text-[#f87171]">
          remove <MathSpan latex={`\\frac{${removeCount}}{${denominator}}`} />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
            <MathSpan latex={`\\frac{${startNumerator}}{${denominator}}`} />
          </div>
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {segments.map((_, i) => {
              const filled = i < startNumerator;
              const removed = i >= startNumerator - removeCount && i < startNumerator;
              return (
                <div
                  key={i}
                  className="relative h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                  style={{
                    background: filled ? startFill : "transparent",
                    borderColor: filled ? startBorder : "#2e3248",
                  }}
                >
                  {removed && (
                    <svg viewBox="0 0 10 10" className="absolute inset-0 h-full w-full">
                      <line x1="1" y1="1" x2="9" y2="9" stroke="#f87171" strokeWidth="1" />
                      <line x1="9" y1="1" x2="1" y2="9" stroke="#f87171" strokeWidth="1" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-lg font-bold text-[#8a8fa8]">↓</div>

      <div className="flex items-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${resultNumerator}}{${denominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {segments.map((_, i) => (
            <div
              key={i}
              className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
              style={{
                background: i < resultNumerator ? resultFill : "transparent",
                borderColor: i < resultNumerator ? resultBorder : "#2e3248",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SimplifyBarModel ─────────────────────────────────────────────────────
// Regrouping visual: a bar divided into labeled groups (e.g. "one
// quarter" spanning 2 of 8 segments), arrow across to a second, smaller
// bar showing the simplified fraction. Only draws group brackets under
// the filled portion, matching the doc's diagram. Supports both a
// horizontal layout (AF-03: bars side by side) and vertical (AF-10:
// bars stacked with a down arrow) via `orientation`.
function SimplifyBarModel({
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

// ── SplitBarModel ────────────────────────────────────────────────────────
// Scaling-up visual: a bar showing the starting fraction, a down arrow
// with an explanatory label beside it, then a second bar (potentially
// a different denominator entirely) showing the equivalent fraction.
// No crossouts — the shaded proportion is meant to look unchanged.
function SplitBarModel({
  fromNumerator,
  fromDenominator,
  toNumerator,
  toDenominator,
  splitLabel,
  fromColor = "blue",
  toColor = "green",
}: {
  fromNumerator: number;
  fromDenominator: number;
  toNumerator: number;
  toDenominator: number;
  splitLabel?: string;
  fromColor?: BarColor;
  toColor?: BarColor;
}) {
  const fromSegments = Array.from({ length: fromDenominator });
  const toSegments = Array.from({ length: toDenominator });
  const { fill: fromFill, border: fromBorder } = BAR_COLORS[fromColor];
  const { fill: toFill, border: toBorder } = BAR_COLORS[toColor];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${fromNumerator}}{${fromDenominator}}`} />
        </div>
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
      </div>

      <div className="flex items-center gap-2">
        <div className="text-lg font-bold text-[#8a8fa8]">↓</div>
        {splitLabel && (
          <div className="max-w-[10rem] text-left text-[10px] leading-tight text-[#8a8fa8]">
            {splitLabel}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${toNumerator}}{${toDenominator}}`} />
        </div>
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
      </div>
    </div>
  );
}

// ── MultiplesModel ───────────────────────────────────────────────────────
// No fraction bars — two rows of circled numbers, shared multiples
// highlighted, the first shared value given extra emphasis. Used for
// lowest-common-denominator skills where the concept is about matching
// numbers, not shaded parts of a whole.
function MultiplesModel({
  labelA,
  listA,
  labelB,
  listB,
  commonValues,
  firstCommon,
  annotation,
}: {
  labelA: string;
  listA: number[];
  labelB: string;
  listB: number[];
  commonValues: number[];
  firstCommon: number;
  annotation?: string;
}) {
  function renderRow(label: string, list: number[], key: string) {
    return (
      <div key={key} className="flex items-center gap-3">
        <div className="w-28 flex-shrink-0 text-right text-xs font-bold text-[#f1f0ee] sm:w-32">
          {label}
        </div>
        <div className="flex flex-wrap gap-2">
          {list.map((n, i) => {
            const isCommon = commonValues.includes(n);
            const isFirst = n === firstCommon;
            return (
              <div
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold sm:h-10 sm:w-10"
                style={{
                  border: `${isFirst ? 3 : 2}px solid ${
                    isFirst ? "#4ade80" : isCommon ? "#4ade8066" : "#2e3248"
                  }`,
                  background: isFirst ? "#4ade8022" : isCommon ? "#4ade8011" : "transparent",
                  color: isCommon ? "#86efac" : "#8a8fa8",
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {renderRow(labelA, listA, "a")}
      {renderRow(labelB, listB, "b")}
      {annotation && (
        <div className="mt-1 text-center text-xs font-bold text-[#4ade80]">{annotation}</div>
      )}
    </div>
  );
}

// ── MixedToImproperModel ────────────────────────────────────────────────
// A row of full 'whole' bars (each individually labeled) plus one
// partial bar for the fractional part, arrow down to a single result
// bar sized to hold the full improper numerator (may span more than
// one denominator's worth of segments).
function MixedToImproperModel({
  wholeNumber,
  numerator,
  denominator,
  wholeColor = "blue",
  fractionColor = "gold",
  resultColor = "green",
}: {
  wholeNumber: number;
  numerator: number;
  denominator: number;
  wholeColor?: BarColor;
  fractionColor?: BarColor;
  resultColor?: BarColor;
}) {
  const { fill: wFill, border: wBorder } = BAR_COLORS[wholeColor];
  const { fill: fFill, border: fBorder } = BAR_COLORS[fractionColor];
  const { fill: rFill, border: rBorder } = BAR_COLORS[resultColor];
  const improperNumerator = wholeNumber * denominator + numerator;
  const totalSegments = denominator * (wholeNumber + 1);
  const segs = (n: number) => Array.from({ length: n });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-end justify-center gap-4">
        {Array.from({ length: wholeNumber }).map((_, w) => (
          <div key={w} className="flex flex-col items-center gap-1">
            <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
              {segs(denominator).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                  style={{ background: wFill, borderColor: wBorder }}
                />
              ))}
            </div>
            <div className="text-[10px] text-[#8a8fa8]">1 whole</div>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1">
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {segs(denominator).map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                style={{
                  background: i < numerator ? fFill : "transparent",
                  borderColor: i < numerator ? fBorder : "#2e3248",
                }}
              />
            ))}
          </div>
          <div className="text-[10px] text-[#8a8fa8]">
            <MathSpan latex={`\\frac{${numerator}}{${denominator}}`} />
          </div>
        </div>
      </div>

      <div className="text-lg font-bold text-[#8a8fa8]">↓</div>

      <div className="flex items-center gap-3">
        <div className="text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${improperNumerator}}{${denominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {segs(totalSegments).map((_, i) => (
            <div
              key={i}
              className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
              style={{
                background: i < improperNumerator ? rFill : "transparent",
                borderColor: i < improperNumerator ? rBorder : "#2e3248",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MixedAddendRow / AddMixedNumbersModel ───────────────────────────────
// A compact "whole + partial" row: a chain of full bars (one per whole
// number) plus one partial bar for the fraction, all in one line, used
// for both addend rows and the result row of a mixed-number addition.
// Deliberately small segments (h-5/w-5, smaller than the h-7/w-7 used
// elsewhere) plus flex-wrap and a horizontal-scroll fallback, since a
// row with several whole numbers can get wide fast — never clips, at
// worst it scrolls or wraps.
function MixedAddendRow({
  wholeNumber,
  numerator,
  denominator,
  wholeColor = "blue",
  fractionColor = "gold",
}: {
  wholeNumber: number;
  numerator: number;
  denominator: number;
  wholeColor?: BarColor;
  fractionColor?: BarColor;
}) {
  const { fill: wFill, border: wBorder } = BAR_COLORS[wholeColor];
  const { fill: fFill, border: fBorder } = BAR_COLORS[fractionColor];
  const segs = Array.from({ length: denominator });

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      <div className="flex-shrink-0 text-[#f1f0ee]">
        <MathSpan
          latex={
            numerator > 0
              ? `${wholeNumber}\\tfrac{${numerator}}{${denominator}}`
              : `${wholeNumber}`
          }
        />
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {Array.from({ length: wholeNumber }).map((_, w) => (
          <div key={w} className="flex overflow-hidden rounded border border-[#2e3248]">
            {segs.map((_, i) => (
              <div
                key={i}
                className="h-5 w-5 border-r border-[#2e3248] last:border-r-0"
                style={{ background: wFill, borderColor: wBorder }}
              />
            ))}
          </div>
        ))}
        {numerator > 0 && (
          <div className="flex overflow-hidden rounded border border-[#2e3248]">
            {segs.map((_, i) => (
              <div
                key={i}
                className="h-5 w-5 border-r border-[#2e3248] last:border-r-0"
                style={{
                  background: i < numerator ? fFill : "transparent",
                  borderColor: i < numerator ? fBorder : "#2e3248",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AddMixedNumbersModel({
  addends,
  result,
}: {
  addends: Array<{
    wholeNumber: number;
    numerator: number;
    denominator: number;
    wholeColor?: BarColor;
    fractionColor?: BarColor;
  }>;
  result: {
    wholeNumber: number;
    numerator: number;
    denominator: number;
    wholeColor?: BarColor;
    fractionColor?: BarColor;
  };
}) {
  return (
    <div className="flex w-full flex-col items-center gap-2 overflow-x-auto">
      {addends.map((a, i) => (
        <MixedAddendRow key={i} {...a} />
      ))}
      <div className="text-lg font-bold text-[#8a8fa8]">↓</div>
      <MixedAddendRow {...result} />
    </div>
  );
}

// ── SubtractMixedNumbersModel ───────────────────────────────────────────
// A chain of whole bars (the first `removeWhole` of them crossed out)
// plus one fractional bar (the first `removeNumerator` filled segments
// crossed out), arrow down to a result row in the same whole+partial
// form as AddMixedNumbersModel. Compact segments and wrap/scroll
// safety nets, same reasoning as the add version.
function SubtractMixedNumbersModel({
  startWhole,
  startNumerator,
  denominator,
  removeWhole,
  removeNumerator,
  removeLabel,
  startColor = "blue",
  keepFractionColor = "gold",
  resultColor = "green",
}: {
  startWhole: number;
  startNumerator: number;
  denominator: number;
  removeWhole: number;
  removeNumerator: number;
  removeLabel?: string;
  startColor?: BarColor;
  keepFractionColor?: BarColor;
  resultColor?: BarColor;
}) {
  const { fill: sFill, border: sBorder } = BAR_COLORS[startColor];
  const { fill: kFill, border: kBorder } = BAR_COLORS[keepFractionColor];
  const { fill: rFill, border: rBorder } = BAR_COLORS[resultColor];
  const segs = Array.from({ length: denominator });
  const resultWhole = startWhole - removeWhole;
  const resultNumerator = startNumerator - removeNumerator;

  function crossOverlay() {
    return (
      <svg viewBox="0 0 10 10" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <line x1="1" y1="1" x2="9" y2="9" stroke="#f87171" strokeWidth="1" />
        <line x1="9" y1="1" x2="1" y2="9" stroke="#f87171" strokeWidth="1" />
      </svg>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2 overflow-x-auto">
      {removeLabel && <div className="text-xs font-bold text-[#f87171]">{removeLabel}</div>}

      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        <div className="flex-shrink-0 text-[#f1f0ee]">
          <MathSpan latex={`${startWhole}\\tfrac{${startNumerator}}{${denominator}}`} />
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          {Array.from({ length: startWhole }).map((_, w) => (
            <div key={w} className="relative flex overflow-hidden rounded border border-[#2e3248]">
              {segs.map((_, i) => (
                <div
                  key={i}
                  className="h-5 w-5 border-r border-[#2e3248] last:border-r-0"
                  style={{ background: sFill, borderColor: sBorder }}
                />
              ))}
              {w < removeWhole && crossOverlay()}
            </div>
          ))}
          <div className="flex overflow-hidden rounded border border-[#2e3248]">
            {segs.map((_, i) => {
              const filled = i < startNumerator;
              const removed = filled && i < removeNumerator;
              return (
                <div
                  key={i}
                  className="relative h-5 w-5 border-r border-[#2e3248] last:border-r-0"
                  style={{
                    background: filled ? kFill : "transparent",
                    borderColor: filled ? kBorder : "#2e3248",
                  }}
                >
                  {removed && crossOverlay()}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-lg font-bold text-[#8a8fa8]">↓</div>

      <MixedAddendRow
        wholeNumber={resultWhole}
        numerator={resultNumerator}
        denominator={denominator}
        wholeColor={resultColor}
        fractionColor={keepFractionColor}
      />
    </div>
  );
}

// ── PartWholeBar / PartWholeBarsModel ───────────────────────────────────
// Generic part-whole diagram for word-problem structure — no fraction
// denominators or segments involved, just labeled colored sections in
// a bar, a brace label spanning it, and an equation beside it. Used
// for "which operation does this problem need" skills (join -> add,
// remove -> subtract), not fraction magnitude.
function PartWholeBar({
  title,
  titleColor,
  segments,
  braceLabel,
  equation,
}: {
  title: string;
  titleColor?: BarColor;
  segments: Array<{ label: string; color: BarColor }>;
  braceLabel: string;
  equation: string;
}) {
  const titleHex = titleColor ? BAR_COLORS[titleColor].fill : "#8a8fa8";

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div
        className="text-xs font-bold uppercase tracking-wide"
        style={{ color: titleHex }}
      >
        {title}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {segments.map((seg, i) => {
            const { fill } = BAR_COLORS[seg.color];
            return (
              <div
                key={i}
                className="flex items-center justify-center whitespace-nowrap px-3 py-2 text-[10px] font-bold text-[#0f1117] sm:px-4"
                style={{ background: fill }}
              >
                {seg.label}
              </div>
            );
          })}
        </div>
        <div className="flex-shrink-0 text-[#f1f0ee]">
          <MathSpan latex={equation} />
        </div>
      </div>
      <div className="border-t border-[#8a8fa8] px-2 pt-1 text-[10px] text-[#8a8fa8]">
        {braceLabel}
      </div>
    </div>
  );
}

function PartWholeBarsModel({
  bars,
}: {
  bars: Array<{
    title: string;
    titleColor?: BarColor;
    segments: Array<{ label: string; color: BarColor }>;
    braceLabel: string;
    equation: string;
  }>;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-5 overflow-x-auto">
      {bars.map((b, i) => (
        <PartWholeBar key={i} {...b} />
      ))}
    </div>
  );
}

// ── ExchangeSubtractMixedNumbersModel ───────────────────────────────────
// Three stages, not two: (1) the original mixed number, plainly shown;
// (2) the same value after exchanging one whole for denominator/denominator
// — one fewer whole bar, one wider fraction bar holding more than a
// single denominator's worth of segments — WITH the removal crossout
// applied on top of that exchanged form; (3) the result. This is the
// most compound of the mixed-number visuals: exchange happens before
// removal, not instead of it.
function ExchangeSubtractMixedNumbersModel({
  originalWhole,
  originalNumerator,
  denominator,
  removeWhole,
  removeNumerator,
  exchangeLabel,
  removeLabel,
  startColor = "blue",
  originalFractionColor = "gold",
  resultColor = "green",
}: {
  originalWhole: number;
  originalNumerator: number;
  denominator: number;
  removeWhole: number;
  removeNumerator: number;
  exchangeLabel?: string;
  removeLabel?: string;
  startColor?: BarColor;
  originalFractionColor?: BarColor;
  resultColor?: BarColor;
}) {
  const { fill: sFill, border: sBorder } = BAR_COLORS[startColor];
  const { fill: oFill, border: oBorder } = BAR_COLORS[originalFractionColor];
  const { fill: rFill, border: rBorder } = BAR_COLORS[resultColor];
  const denomSegs = Array.from({ length: denominator });

  const postExchangeWhole = originalWhole - 1;
  const postExchangeNumerator = denominator + originalNumerator;
  const wideSegs = Array.from({ length: postExchangeNumerator });
  const resultWhole = postExchangeWhole - removeWhole;
  const resultNumerator = postExchangeNumerator - removeNumerator;

  function crossOverlay() {
    return (
      <svg viewBox="0 0 10 10" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <line x1="1" y1="1" x2="9" y2="9" stroke="#f87171" strokeWidth="1" />
        <line x1="9" y1="1" x2="1" y2="9" stroke="#f87171" strokeWidth="1" />
      </svg>
    );
  }
  function wholeBar(color: BarColor, key: number, crossed = false) {
    const { fill, border } = BAR_COLORS[color];
    return (
      <div key={key} className="flex flex-col items-center gap-0.5">
        <div className="relative flex overflow-hidden rounded border border-[#2e3248]">
          {denomSegs.map((_, i) => (
            <div key={i} className="h-5 w-5 border-r border-[#2e3248] last:border-r-0" style={{ background: fill, borderColor: border }} />
          ))}
          {crossed && crossOverlay()}
        </div>
        <div className="text-[9px] text-[#8a8fa8]">1 whole</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-3 overflow-x-auto">
      {/* Stage 1: original */}
      <div className="flex flex-wrap items-end justify-center gap-2">
        <div className="flex-shrink-0 text-[#f1f0ee]">
          <MathSpan latex={`${originalWhole}\\tfrac{${originalNumerator}}{${denominator}}`} />
        </div>
        <div className="flex flex-wrap items-end justify-center gap-1">
          {Array.from({ length: originalWhole }).map((_, w) => wholeBar(startColor, w))}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex overflow-hidden rounded border border-[#2e3248]">
              {denomSegs.map((_, i) => (
                <div
                  key={i}
                  className="h-5 w-5 border-r border-[#2e3248] last:border-r-0"
                  style={{
                    background: i < originalNumerator ? oFill : "transparent",
                    borderColor: i < originalNumerator ? oBorder : "#2e3248",
                  }}
                />
              ))}
            </div>
            <div className="text-[9px] text-[#8a8fa8]">
              original <MathSpan latex={`\\tfrac{${originalNumerator}}{${denominator}}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        {exchangeLabel && <div className="mt-1 max-w-[12rem] text-center leading-tight">{exchangeLabel}</div>}
      </div>

      {/* Stage 2: post-exchange, with removal crossout applied */}
      <div className="flex flex-wrap items-end justify-center gap-2">
        <div className="flex-shrink-0 text-[#f1f0ee]">
          <MathSpan latex={`${postExchangeWhole}\\tfrac{${postExchangeNumerator}}{${denominator}}`} />
        </div>
        <div className="flex flex-wrap items-end justify-center gap-1">
          {Array.from({ length: postExchangeWhole }).map((_, w) => wholeBar(startColor, w, w < removeWhole))}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex overflow-hidden rounded border border-[#2e3248]">
              {wideSegs.map((_, i) => {
                const isExchanged = i < denominator;
                const removed = i < removeNumerator;
                return (
                  <div
                    key={i}
                    className="relative h-5 w-5 border-r border-[#2e3248] last:border-r-0"
                    style={{
                      background: isExchanged ? sFill : oFill,
                      borderColor: isExchanged ? sBorder : oBorder,
                    }}
                  >
                    {removed && crossOverlay()}
                  </div>
                );
              })}
            </div>
            <div className="text-[9px] text-[#8a8fa8]">
              exchanged <MathSpan latex={`\\tfrac{${denominator}}{${denominator}}`} /> +{" "}
              <MathSpan latex={`\\tfrac{${originalNumerator}}{${denominator}}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-[10px] font-bold text-[#f87171]">
        <div className="text-lg font-bold leading-none text-[#8a8fa8]">↓</div>
        {removeLabel && <div className="mt-1 max-w-[12rem] text-center leading-tight">{removeLabel}</div>}
      </div>

      {/* Stage 3: result */}
      <MixedAddendRow
        wholeNumber={resultWhole}
        numerator={resultNumerator}
        denominator={denominator}
        wholeColor={resultColor}
        fractionColor={resultColor}
      />
    </div>
  );
}

// ── FlowStepsModel ───────────────────────────────────────────────────────
// A process flowchart — labeled boxes connected by labeled arrows.
// No fraction bars or denominators involved; used for multi-step
// problem structure, not fraction magnitude.
function FlowStepsModel({
  steps,
  arrowLabels,
  arrowColors,
}: {
  steps: Array<{ label: string; value: string; highlight?: boolean }>;
  arrowLabels: string[];
  arrowColors?: BarColor[];
}) {
  return (
    <div className="flex w-full items-center justify-center gap-2 overflow-x-auto">
      {steps.map((step, i) => (
        <div key={i} className="flex flex-shrink-0 items-center gap-2">
          <div
            className="flex min-w-[6.5rem] flex-col items-center gap-1 rounded-xl border px-3 py-3"
            style={{
              borderColor: step.highlight ? "#4ade8066" : "#2e3248",
              background: step.highlight ? "#4ade8011" : "#22263a",
            }}
          >
            <div className="whitespace-nowrap text-xs font-bold text-[#f1f0ee]">{step.label}</div>
            <div className="text-[#f1f0ee]">
              <MathSpan latex={step.value} />
            </div>
          </div>
          {i < arrowLabels.length && (
            <div className="flex flex-col items-center">
              <div
                className="whitespace-nowrap text-[10px] font-bold"
                style={{ color: arrowColors?.[i] ? BAR_COLORS[arrowColors[i]].fill : "#8a8fa8" }}
              >
                {arrowLabels[i]}
              </div>
              <div className="text-lg text-[#8a8fa8]">→</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── TeachCard ────────────────────────────────────────────────────────────
// Renders the "Key Point" teaching interstitial (doc section 2.3-equivalent)
// that sits before a concept_check question. Non-quiz — no options, single
// "Got it" button to advance. Only ever rendered for question_type = 'teach'.
export default function TeachCard({
  content,
  onContinue,
  continueLabel = "Got it →",
}: {
  content: TeachContent;
  onContinue: () => void;
  continueLabel?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-[#8a8fa8]">Key Point</div>
      </div>

      <div
        className="mb-4 text-xl leading-snug text-[#f1f0ee]"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
      >
        <MathText text={content.key_point} />
      </div>

      <div className="mb-4 rounded-xl border border-[#2e3248] bg-[#22263a] px-4 py-3 text-sm font-bold text-[#f1f0ee]">
        <MathText text={content.rule} />
      </div>

      <div className="mb-6 flex justify-center rounded-xl border border-[#2e3248] bg-[#818cf80d] px-4 py-4 text-[#f1f0ee]">
        <MathSpan latex={content.formula} display />
      </div>

      {content.visual_model && (
        <div className="mb-6 rounded-xl border border-[#2e3248] bg-[#22263a] p-4">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#8a8fa8]">
            Visual model
          </div>
          {content.visual_model.style === "remove" && "denominator" in content.visual_model ? (
            <RemoveBarModel
              denominator={content.visual_model.denominator}
              startNumerator={content.visual_model.startNumerator}
              removeCount={content.visual_model.removeCount}
              removeColor={content.visual_model.removeColor}
              resultColor={content.visual_model.resultColor}
            />
          ) : content.visual_model.style === "simplify" && "fromDenominator" in content.visual_model ? (
            <SimplifyBarModel
              fromNumerator={content.visual_model.fromNumerator}
              fromDenominator={content.visual_model.fromDenominator}
              toNumerator={content.visual_model.toNumerator}
              toDenominator={content.visual_model.toDenominator}
              groupLabel={content.visual_model.groupLabel}
              transitionLabel={content.visual_model.transitionLabel}
              orientation={content.visual_model.orientation}
              fromColor={content.visual_model.fromColor}
              toColor={content.visual_model.toColor}
            />
          ) : content.visual_model.style === "split" && "fromDenominator" in content.visual_model ? (
            <SplitBarModel
              fromNumerator={content.visual_model.fromNumerator}
              fromDenominator={content.visual_model.fromDenominator}
              toNumerator={content.visual_model.toNumerator}
              toDenominator={content.visual_model.toDenominator}
              splitLabel={content.visual_model.splitLabel}
              fromColor={content.visual_model.fromColor}
              toColor={content.visual_model.toColor}
            />
          ) : content.visual_model.style === "multiples" && "listA" in content.visual_model ? (
            <MultiplesModel
              labelA={content.visual_model.labelA}
              listA={content.visual_model.listA}
              labelB={content.visual_model.labelB}
              listB={content.visual_model.listB}
              commonValues={content.visual_model.commonValues}
              firstCommon={content.visual_model.firstCommon}
              annotation={content.visual_model.annotation}
            />
          ) : content.visual_model.style === "mixedToImproper" && "wholeNumber" in content.visual_model ? (
            <MixedToImproperModel
              wholeNumber={content.visual_model.wholeNumber}
              numerator={content.visual_model.numerator}
              denominator={content.visual_model.denominator}
              wholeColor={content.visual_model.wholeColor}
              fractionColor={content.visual_model.fractionColor}
              resultColor={content.visual_model.resultColor}
            />
          ) : content.visual_model.style === "addMixedNumbers" && "addends" in content.visual_model ? (
            <AddMixedNumbersModel
              addends={content.visual_model.addends}
              result={content.visual_model.result}
            />
          ) : content.visual_model.style === "subtractMixedNumbers" && "startWhole" in content.visual_model ? (
            <SubtractMixedNumbersModel
              startWhole={content.visual_model.startWhole}
              startNumerator={content.visual_model.startNumerator}
              denominator={content.visual_model.denominator}
              removeWhole={content.visual_model.removeWhole}
              removeNumerator={content.visual_model.removeNumerator}
              removeLabel={content.visual_model.removeLabel}
              startColor={content.visual_model.startColor}
              keepFractionColor={content.visual_model.keepFractionColor}
              resultColor={content.visual_model.resultColor}
            />
          ) : content.visual_model.style === "partWholeBars" && "bars" in content.visual_model ? (
            <PartWholeBarsModel bars={content.visual_model.bars} />
          ) : content.visual_model.style === "exchangeSubtractMixedNumbers" && "originalWhole" in content.visual_model ? (
            <ExchangeSubtractMixedNumbersModel
              originalWhole={content.visual_model.originalWhole}
              originalNumerator={content.visual_model.originalNumerator}
              denominator={content.visual_model.denominator}
              removeWhole={content.visual_model.removeWhole}
              removeNumerator={content.visual_model.removeNumerator}
              exchangeLabel={content.visual_model.exchangeLabel}
              removeLabel={content.visual_model.removeLabel}
              startColor={content.visual_model.startColor}
              originalFractionColor={content.visual_model.originalFractionColor}
              resultColor={content.visual_model.resultColor}
            />
          ) : content.visual_model.style === "flowSteps" && "steps" in content.visual_model ? (
            <FlowStepsModel
              steps={content.visual_model.steps}
              arrowLabels={content.visual_model.arrowLabels}
              arrowColors={content.visual_model.arrowColors}
            />
          ) : "rows" in content.visual_model && Array.isArray(content.visual_model.rows) ? (
            <div className="flex flex-col items-center gap-1">
              {content.visual_model.rows.map((row, i) => (
                <FractionBarRow key={i} row={row} />
              ))}
            </div>
          ) : (
            // visual_model exists but doesn't cleanly match any known
            // shape — skip the diagram rather than crash the page.
            // Shows up as a missing picture, not a broken lesson.
            null
          )}
          <div className="mt-3 text-center text-xs leading-relaxed text-[#8a8fa8]">
            <MathText text={content.visual_model.caption} />
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={onContinue}
          className="rounded-full bg-[#f9c74f] px-7 py-2.5 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          {continueLabel}
        </button>
      </div>
    </div>
  );
}
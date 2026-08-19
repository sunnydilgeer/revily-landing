"use client";

import type { ReactNode } from "react";
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
    }
  | {
      style: "groupPartition";
      wholeAmount: number; // e.g. 24, the total being partitioned
      denominator: number; // number of equal groups to split into
      groupValue: number; // value in a single group (wholeAmount / denominator)
      selectCount?: number; // MD-02: number of groups to highlight/select (defaults to 1)
      resultValue?: number; // MD-02: label under the highlighted groups when selecting more than one (defaults to groupValue)
      dotColor?: BarColor;
      highlightColor?: BarColor;
      caption: string;
    }
  | {
      style: "inverseGroupReconstruct";
      knownParts: number; // e.g. 3 — how many of the equal parts are given
      knownTotal: number; // e.g. 24 — the combined value of the known parts
      partValue: number; // e.g. 8 — knownTotal / knownParts, value of ONE part
      totalParts: number; // e.g. 5 — total equal parts in the whole (the fraction's denominator)
      wholeValue: number; // e.g. 40 — totalParts * partValue, the reconstructed whole
      knownColor?: BarColor;
      unknownColor?: BarColor;
      caption: string;
    }
  | {
      // NOTE: this shares the "addMixedNumbers" style string with the
      // AF-series variant above (a pre-existing DB naming collision,
      // not something to fix here) but is a structurally different
      // shape — discriminated at render time by the presence of
      // "groups" instead of "addends".
      style: "addMixedNumbers";
      groups: number; // e.g. 3 — how many equal-fraction bars are being repeated/added
      fractionNumerator: number; // e.g. 2, in each group's 2/7
      fractionDenominator: number; // e.g. 7
      resultNumerator: number; // e.g. 6 — groups * fractionNumerator
      groupColor?: BarColor;
      resultColor?: BarColor;
      caption: string;
    }
  | {
      style: "fractionAreaModel";
      rows: number; // e.g. 3 — grid rows (denominator of the second fraction)
      columns: number; // e.g. 5 — grid columns (denominator of the first fraction)
      shadedColumns: number; // e.g. 4 — columns shaded in step 1 (numerator of first fraction)
      selectedRows: number; // e.g. 2 — rows selected within the shaded columns in step 2 (numerator of second fraction)
      resultNumerator: number; // e.g. 8 — selectedRows * shadedColumns
      resultDenominator: number; // e.g. 15 — rows * columns
      shadeColor?: BarColor;
      selectColor?: BarColor;
      caption: string;
    }
  | {
      style: "fractionSimplifyRegroup";
      totalParts: number; // e.g. 12 — original denominator, segments in the starting bar
      shadedParts: number; // e.g. 6 — original numerator, segments shaded in the starting bar
      groupSize: number; // e.g. 6 — common factor both counts are divided by
      resultNumerator: number; // e.g. 1 — shadedParts / groupSize
      resultDenominator: number; // e.g. 2 — totalParts / groupSize
      shadeColor?: BarColor;
      caption: string;
    }
  | {
      style: "fractionCancelSteps";
      steps: Array<{
        expression: string; // raw LaTeX, e.g. "\\frac{3}{8} \\times \\frac{4}{9}"
        action: string; // describes the operation FROM this step TO the next, e.g. "divide 8 and 4 by 4"; the last step's action (e.g. "result") is unused/ignored
      }>;
      caption: string;
    }
  | {
      style: "mixedNumberConvertMultiply";
      first: {
        whole: number;
        numerator: number;
        denominator: number;
        improperNumerator: number;
        improperDenominator: number;
      };
      second: {
        whole: number;
        numerator: number;
        denominator: number;
        improperNumerator: number;
        improperDenominator: number;
      };
      resultNumerator: number; // e.g. 12 — improperNumerator product before simplifying
      resultDenominator: number; // e.g. 6 — improperDenominator product before simplifying
      resultWhole?: number; // e.g. 2 — simplified final value, when it reduces to a whole number
      firstColor?: BarColor;
      secondColor?: BarColor;
      resultColor?: BarColor;
      caption: string;
    }
  | {
      style: "commonDenominatorGroups";
      dividendNumerator: number; // e.g. 3, in 3/4
      dividendDenominator: number; // e.g. 4
      commonNumerator: number; // e.g. 6 — dividend rewritten over the common denominator
      commonDenominator: number; // e.g. 8 — matches the divisor's denominator
      divisorNumerator: number; // e.g. 3, in 3/8 — also the group size in common-denominator terms
      divisorDenominator: number; // e.g. 8
      groupCount: number; // e.g. 2 — commonNumerator / divisorNumerator
      splitLabel?: string; // e.g. "split each quarter into two equal eighths"
      dividendColor?: BarColor;
      commonColor?: BarColor;
      caption: string;
    }
  | {
      style: "groupUnitPartsByDivisor";
      wholeCount: number; // e.g. 4 — number of wholes (W)
      partsPerWhole: number; // e.g. 3 — divisor's denominator (b)
      totalParts: number; // e.g. 12 — wholeCount * partsPerWhole
      groupSize: number; // e.g. 2 — divisor's numerator (a), parts per group
      groupCount: number; // e.g. 6 — totalParts / groupSize
      unitLabel?: string; // e.g. "thirds" — plural name of the unit-fraction part
      baseColor?: BarColor; // color of the ungrouped bar; defaults to blue
      groupColors?: BarColor[]; // cycles one color per group in the grouped bar; defaults to [blue, gold, green, red]
      caption: string;
    }
  | {
      style: "countUnitFractionParts";
      wholeCount: number; // e.g. 3 — number of whole boxes (W)
      partsPerWhole: number; // e.g. 4 — unit-fraction parts per whole (n)
      total: number; // e.g. 12 — wholeCount * partsPerWhole
      unitLabel?: string; // e.g. "quarters" — plural name of the unit-fraction part
      wholeColors?: BarColor[]; // cycles one color per whole row; defaults to [blue, green, gold]
      caption: string;
    }
  | {
      style: "divideShare";
      fromNumerator: number; // e.g. 3, in 3/4
      fromDenominator: number; // e.g. 4
      splitNumerator: number; // e.g. 6 — fromNumerator after splitting each part
      splitDenominator: number; // e.g. 8 — fromDenominator after splitting each part
      divisor: number; // e.g. 2 — number of equal shares to split into
      shareNumerator: number; // e.g. 3 — value of ONE share
      shareDenominator: number; // e.g. 8 — same as splitDenominator
      splitLabel?: string; // e.g. "split each quarter into 2" — shown beside the first arrow
      shareLabel?: string; // e.g. "share the 6 eighths equally" — shown beside the second arrow
      fromColor?: BarColor;
      share1Color?: BarColor;
      share2Color?: BarColor;
      caption: string;
    }
  | {
      style: "reciprocalExchange";
      fraction: { numerator: number; denominator: number };
      fractionReciprocal: { numerator: number; denominator: number };
      wholeNumber: {
        value: number;
        asFraction: { numerator: number; denominator: number };
        reciprocal: { numerator: number; denominator: number };
      };
      fractionColor?: BarColor;
      reciprocalColor?: BarColor;
      resultColor?: BarColor;
      caption: string;
    }
  | {
      style: "mixedNumberCommonDenominatorGroups";
      wholePart: number; // e.g. 1, in "1 3/4"
      fractionNumerator: number; // e.g. 3
      fractionDenominator: number; // e.g. 4
      commonNumerator: number; // e.g. 14 — the mixed number's improper form rewritten over the common denominator
      commonDenominator: number; // e.g. 8 — matches the divisor's denominator
      divisorNumerator: number; // e.g. 7, in 7/8 — also the group size in common-denominator terms
      divisorDenominator: number; // e.g. 8
      groupCount: number; // e.g. 2 — commonNumerator / divisorNumerator
      assembleLabel?: string; // e.g. "combine into one improper fraction"
      splitLabel?: string; // e.g. "rewrite over the common denominator"
      wholeColor?: BarColor;
      fractionColor?: BarColor;
      commonColor?: BarColor;
      caption: string;
    }
  | {
      style: "operationChoiceCompare";
      multiplyPanel: {
        label: string; // e.g. "Take a fraction of a known quantity"
        expression: string; // raw LaTeX, e.g. "\\frac{3}{4} \\text{ of } 12"
        totalGroups: number; // e.g. 4 — number of equal groups shown
        selectedGroups: number; // e.g. 3 — groups counted toward the result
        result: string | number; // e.g. 9 — DB stores this as a bare number, not LaTeX
      };
      dividePanel: {
        label: string; // e.g. "Count fraction-sized groups"
        expression: string; // raw LaTeX, e.g. "3 \\div \\frac{1}{4}"
        totalUnits: number; // e.g. 12 — number of unit boxes shown
        unitLabel: string; // e.g. "quarter"
        result: string | number; // e.g. 12 — DB stores this as a bare number, not LaTeX
      };
      multiplyColor?: BarColor;
      divideColor?: BarColor;
      caption: string;
    }
  | {
      style: "relationshipClassifierGrid";
      processSteps: string[]; // e.g. ["Read", "Classify", "Calculate", "Check form"]
      highlightStep?: number; // 0-based index of the step to highlight (defaults to none)
      relationships: Array<{
        label: string; // e.g. "Known whole \\to part" — raw LaTeX, may contain \to etc.
        example: string; // raw LaTeX, e.g. "\\frac{3}{5} \\text{ of } 40"
        method: string; // raw LaTeX, e.g. "40 \\times \\frac{3}{5}"
        color?: BarColor;
      }>;
      caption: string;
    }
  | {
      // A pre-existing DB shape mismatch: the MD-16 import used a
      // nodes/edges graph shape instead of the flowSteps component's
      // steps/arrowLabels shape (see FlowStepsModel above), and the
      // intended jsonb_set patch to correct it was never actually run
      // (confirmed against the live DB — still nodes/edges as of this
      // writing). Rather than depend on a DB migration, this shares the
      // "flowSteps" style string but is discriminated by the presence
      // of "nodes" and rendered directly by NodeEdgeFlowModel below.
      style: "flowSteps";
      nodes: Array<{ id: string; label: string; sublabel?: string }>;
      edges: Array<{ from: string; to: string; operationLabel: string }>;
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
// horizontal layout (AF-03's original layout) and vertical (AF-10:
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

// ── GroupPartitionModel ──────────────────────────────────────────────────
// Dot-grid partition visual: `wholeAmount` dots split into `denominator`
// equal boxes, the first (or first `selectCount`) box(es) highlighted,
// arrow down to a "one group contains N" label. Used for MD-01 (find a
// unit fraction of an amount) and MD-02, which extends it to select/sum
// `selectCount` groups instead of just the first one.

function GroupPartitionModel({
  wholeAmount,
  denominator,
  groupValue,
  selectCount = 1,
  resultValue,
  dotColor = "blue",
  highlightColor = "green",
}: {
  wholeAmount: number;
  denominator: number;
  groupValue: number;
  selectCount?: number;
  resultValue?: number;
  dotColor?: BarColor;
  highlightColor?: BarColor;
}) {
  const { fill: dotFill } = BAR_COLORS[dotColor];
  const { fill: hiFill, border: hiBorder } = BAR_COLORS[highlightColor];
  const groups = Array.from({ length: denominator });
  const label = resultValue ?? groupValue;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-[10px] font-bold text-[#8a8fa8]">
        the whole amount: {wholeAmount} counters
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {groups.map((_, g) => {
          const isSelected = g < selectCount;
          return (
            <div
              key={g}
              className="grid grid-cols-2 gap-1 rounded-lg border-2 p-2"
              style={{
                borderColor: isSelected ? hiBorder : "#2e3248",
                background: isSelected ? `${hiFill}22` : "transparent",
              }}
            >
              {Array.from({ length: groupValue }).map((_, d) => (
                <div
                  key={d}
                  className="h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"
                  style={{ background: dotFill }}
                />
              ))}
            </div>
          );
        })}
      </div>
      <div className="text-[10px] text-[#8a8fa8]">
        divide the {wholeAmount} counters into {denominator} equal groups
      </div>
      <div className="text-lg font-bold text-[#8a8fa8]">↓</div>
      <div
        className="rounded-lg border px-3 py-1.5 text-xs font-bold"
        style={{ borderColor: hiBorder, background: `${hiFill}22`, color: hiBorder }}
      >
        {selectCount > 1 ? `${selectCount} groups contain ${label}` : `one group contains ${label}`}
      </div>
    </div>
  );
}

// ── InverseGroupReconstructModel ─────────────────────────────────────────
// Three-row "rebuild the whole" visual: Row 1 (given information) shows
// `knownParts` filled boxes (no numbers yet, just a brace totaling
// `knownTotal`) plus `totalParts - knownParts` empty "?" boxes. Row 2
// (Step 1) fills in `partValue` in the known boxes only — the division
// step. Row 3 (Step 2) fills `partValue` into every box, known and
// previously-unknown alike — the multiply-back-up step — with a brace
// spanning all `totalParts` boxes labeled with the whole-value equation.
// Used for MD-03 (rebuild a whole from a known fractional part) —
// structurally the inverse of GroupPartitionModel, hence three explicit
// stages instead of one partition + highlight.

function InverseGroupReconstructModel({
  knownParts,
  knownTotal,
  partValue,
  totalParts,
  wholeValue,
  knownColor = "green",
  unknownColor = "blue",
}: {
  knownParts: number;
  knownTotal: number;
  partValue: number;
  totalParts: number;
  wholeValue: number;
  knownColor?: BarColor;
  unknownColor?: BarColor;
}) {
  const { fill: kFill, border: kBorder } = BAR_COLORS[knownColor];
  const { border: uBorder } = BAR_COLORS[unknownColor];
  const boxes = Array.from({ length: totalParts });

  function renderRow(fillKnown: boolean, fillUnknown: boolean) {
    return (
      <div className="flex items-center justify-center gap-1.5">
        {boxes.map((_, i) => {
          const isKnown = i < knownParts;
          return (
            <div
              key={i}
              className="flex h-10 w-12 flex-shrink-0 items-center justify-center rounded-md border-2 text-sm font-bold sm:h-11 sm:w-14"
              style={{
                borderColor: isKnown ? kBorder : uBorder,
                background: isKnown ? `${kFill}22` : "transparent",
                color: isKnown ? kBorder : uBorder,
              }}
            >
              {isKnown ? (fillKnown ? partValue : "") : fillUnknown ? partValue : "?"}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-[10px] font-bold text-[#8a8fa8]">
        {knownParts} known parts total {knownTotal}
      </div>
      <div className="flex items-center gap-4">
        <div className="w-20 flex-shrink-0 text-right text-[10px] font-bold leading-tight text-[#8a8fa8]">
          given information
        </div>
        {renderRow(false, false)}
      </div>
      <div className="text-lg font-bold text-[#8a8fa8]">↓</div>
      <div className="flex items-center gap-4">
        <div className="w-20 flex-shrink-0 text-right text-[10px] font-bold leading-tight text-[#8a8fa8]">
          Step 1: {knownTotal} ÷ {knownParts} = {partValue}
        </div>
        {renderRow(true, false)}
      </div>
      <div className="text-lg font-bold text-[#8a8fa8]">↓</div>
      <div className="flex items-center gap-4">
        <div className="w-20 flex-shrink-0 text-right text-[10px] font-bold leading-tight text-[#8a8fa8]">
          Step 2: all parts equal
        </div>
        {renderRow(true, true)}
      </div>
      <div
        className="rounded-lg border px-3 py-1.5 text-xs font-bold"
        style={{ borderColor: uBorder, background: "#818cf822", color: "#a5b4fc" }}
      >
        the whole: {totalParts} × {partValue} = {wholeValue}
      </div>
    </div>
  );
}

// ── RepeatedFractionAdditionModel ────────────────────────────────────────
// Stacked equal-fraction bars combining into one result bar: `groups`
// identical bars (each divided into `fractionDenominator` segments,
// `fractionNumerator` shaded) stacked vertically, an arrow down labeled
// "combine the equal parts", then one result bar of the same
// denominator with `resultNumerator` segments shaded and a brace
// underneath. Used for MD-04 (repeated addition of the same fraction —
// i.e. multiplying a fraction by a whole number).

function RepeatedFractionAdditionModel({
  groups,
  fractionNumerator,
  fractionDenominator,
  resultNumerator,
  groupColor = "blue",
  resultColor = "green",
}: {
  groups: number;
  fractionNumerator: number;
  fractionDenominator: number;
  resultNumerator: number;
  groupColor?: BarColor;
  resultColor?: BarColor;
}) {
  const { fill: gFill, border: gBorder } = BAR_COLORS[groupColor];
  const { fill: rFill, border: rBorder } = BAR_COLORS[resultColor];
  const segs = Array.from({ length: fractionDenominator });

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-[10px] font-bold text-[#8a8fa8]">
        {groups} groups of{" "}
        <MathSpan latex={`\\frac{${fractionNumerator}}{${fractionDenominator}}`} />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        {Array.from({ length: groups }).map((_, g) => (
          <div key={g} className="flex items-center gap-3">
            <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
              <MathSpan latex={`\\frac{${fractionNumerator}}{${fractionDenominator}}`} />
            </div>
            <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
              {segs.map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                  style={{
                    background: i < fractionNumerator ? gFill : "transparent",
                    borderColor: i < fractionNumerator ? gBorder : "#2e3248",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        <div className="mt-1">combine the equal parts</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
            <MathSpan latex={`\\frac{${resultNumerator}}{${fractionDenominator}}`} />
          </div>
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {segs.map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                style={{
                  background: i < resultNumerator ? rFill : "transparent",
                  borderColor: i < resultNumerator ? rBorder : "#2e3248",
                }}
              />
            ))}
          </div>
        </div>
        <div className="border-t border-[#8a8fa8] px-2 pt-1 text-[10px] text-[#8a8fa8]">
          <MathSpan latex={`\\frac{${resultNumerator}}{${fractionDenominator}}`} />
        </div>
      </div>
    </div>
  );
}

// ── FractionAreaModel ─────────────────────────────────────────────────────
// Two-step area-model grid for multiplying two proper fractions.
// Step 1: a `rows` x `columns` grid with the first `shadedColumns`
// columns shaded across every row (shows fraction-of-whole =
// shadedColumns/columns). Step 2: the same grid, but only the first
// `selectedRows` rows within the shaded columns get the "selected"
// color — the rest of the grid (shaded-but-unselected, and
// never-shaded) stays a lighter/neutral fill — showing the final
// selection of resultNumerator/resultDenominator. Used for MD-05
// (multiply two proper fractions).

function FractionAreaModel({
  rows,
  columns,
  shadedColumns,
  selectedRows,
  resultNumerator,
  resultDenominator,
  shadeColor = "blue",
  selectColor = "green",
}: {
  rows: number;
  columns: number;
  shadedColumns: number;
  selectedRows: number;
  resultNumerator: number;
  resultDenominator: number;
  shadeColor?: BarColor;
  selectColor?: BarColor;
}) {
  const { fill: shadeFill, border: shadeBorder } = BAR_COLORS[shadeColor];
  const { fill: selectFill, border: selectBorder } = BAR_COLORS[selectColor];
  const rowArr = Array.from({ length: rows });
  const colArr = Array.from({ length: columns });

  function grid(mode: "step1" | "step2") {
    return (
      <div className="flex flex-col overflow-hidden rounded-md border border-[#2e3248]">
        {rowArr.map((_, r) => (
          <div key={r} className="flex">
            {colArr.map((_, c) => {
              const isShaded = c < shadedColumns;
              const isSelected = mode === "step2" && isShaded && r < selectedRows;
              const fill = isSelected ? selectFill : isShaded ? shadeFill : "transparent";
              const border = isSelected ? selectBorder : isShaded ? shadeBorder : "#2e3248";
              return (
                <div
                  key={c}
                  className="h-6 w-6 border-b border-r border-[#2e3248] last:border-r-0 sm:h-7 sm:w-7"
                  style={{ background: isShaded || isSelected ? `${fill}66` : "transparent", borderColor: border }}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="text-[10px] font-bold text-[#8a8fa8]">1. Shade {shadedColumns} of {columns}</div>
          {grid("step1")}
          <div className="text-[#f1f0ee]">
            <MathSpan latex={`\\frac{${shadedColumns}}{${columns}}`} /> of the whole
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 text-[#8a8fa8]">
          <div className="text-[#f1f0ee]">
            <MathSpan latex={`\\frac{${selectedRows}}{${rows}}`} />
          </div>
          <div className="text-xl">→</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-[10px] font-bold text-[#8a8fa8]">2. Take {selectedRows} of {rows} rows</div>
          {grid("step2")}
          <div className="text-[#f1f0ee]">
            {resultNumerator} selected parts out of {resultDenominator}
          </div>
        </div>
      </div>
      <div className="text-[10px] text-[#8a8fa8]">
        split each of the {columns} shaded columns into {rows} rows: {rows} × {columns} = {resultDenominator} parts;
        select {selectedRows} × {shadedColumns} = {resultNumerator} parts
      </div>
    </div>
  );
}

// ── FractionSimplifyRegroupModel ─────────────────────────────────────────
// Two-step regrouping visual for simplifying a fraction. Step 1: a bar
// of `totalParts` segments with the first `shadedParts` shaded, braced
// and labeled "N shaded". Step 2: the same bar regrouped into
// `resultDenominator` equal-sized boxes (each box spanning `groupSize`
// original segments) — the first `resultNumerator` boxes labeled
// "shaded", the rest "unshaded". Used for MD-06 (simplify a fraction
// product by dividing both counts by a common factor).

function FractionSimplifyRegroupModel({
  totalParts,
  shadedParts,
  groupSize,
  resultNumerator,
  resultDenominator,
  shadeColor = "blue",
}: {
  totalParts: number;
  shadedParts: number;
  groupSize: number;
  resultNumerator: number;
  resultDenominator: number;
  shadeColor?: BarColor;
}) {
  const { fill, border } = BAR_COLORS[shadeColor];
  const segs = Array.from({ length: totalParts });
  const boxes = Array.from({ length: resultDenominator });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-start justify-center gap-6">
        {/* Step 1 */}
        <div className="flex flex-col items-center gap-2">
          <div className="max-w-[10rem] text-center text-[10px] font-bold leading-tight text-[#8a8fa8]">
            1. Show {shadedParts} shaded parts out of {totalParts}
          </div>
          <div className="text-[9px] text-[#8a8fa8]">{totalParts} equal parts</div>
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {segs.map((_, i) => (
              <div
                key={i}
                className="h-7 w-6 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-7"
                style={{
                  background: i < shadedParts ? fill : "transparent",
                  borderColor: i < shadedParts ? border : "#2e3248",
                }}
              />
            ))}
          </div>
          <div className="text-[10px] font-bold text-[#8a8fa8]">{shadedParts} shaded</div>
        </div>
        <div className="mt-8 flex flex-col items-center text-[10px] text-[#8a8fa8]">
          <div>divide both</div>
          <div>counts by {groupSize}</div>
          <div className="text-lg leading-none">→</div>
        </div>
        {/* Step 2 */}
        <div className="flex flex-col items-center gap-2">
          <div className="max-w-[11rem] text-center text-[10px] font-bold leading-tight text-[#8a8fa8]">
            2. Regroup as {resultNumerator} shaded out of {resultDenominator}
          </div>
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {boxes.map((_, i) => {
              const isShaded = i < resultNumerator;
              return (
                <div
                  key={i}
                  className="flex h-14 w-16 flex-col items-center justify-center border-r border-[#2e3248] px-1 text-center text-[9px] font-bold last:border-r-0 sm:h-16 sm:w-20"
                  style={{
                    background: isShaded ? `${fill}33` : "transparent",
                    color: isShaded ? border : "#8a8fa8",
                  }}
                >
                  {isShaded ? "shaded" : "unshaded"}
                </div>
              );
            })}
          </div>
          <div className="text-[10px] font-bold text-[#8a8fa8]">
            {resultNumerator} of {resultDenominator} equal parts is shaded
          </div>
        </div>
      </div>
      <div className="text-[10px] text-[#8a8fa8]">
        {shadedParts} ÷ {groupSize} = {resultNumerator} and {totalParts} ÷ {groupSize} = {resultDenominator}, so{" "}
        <MathSpan latex={`\\frac{${shadedParts}}{${totalParts}}=\\frac{${resultNumerator}}{${resultDenominator}}`} />
      </div>
    </div>
  );
}

// ── FractionCancelStepsModel ─────────────────────────────────────────────
// Sequential panels showing a fraction-multiplication cancellation
// chain: each step's expression in its own box, with an arrow to the
// next box labeled by that step's `action` (the operation applied to
// get there). The final step (typically action: "result") is rendered
// as a highlighted box with no outgoing arrow. No \cancel{} notation —
// per the source doc, cancellation is described in prose action labels
// rather than struck-through math, since this renderer has no
// confirmed \cancel{} support.

function FractionCancelStepsModel({
  steps,
}: {
  steps: Array<{ expression: string; action: string }>;
}) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-3 overflow-x-auto">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={i} className="flex flex-shrink-0 items-center gap-3">
            <div
              className="flex min-w-[5.5rem] items-center justify-center rounded-xl border px-4 py-3"
              style={{
                borderColor: isLast ? "#4ade8066" : "#2e3248",
                background: isLast ? "#4ade8011" : "#22263a",
              }}
            >
              <div className="text-[#f1f0ee]">
                <MathSpan latex={step.expression} display />
              </div>
            </div>
            {!isLast && (
              <div className="flex flex-col items-center">
                <div className="max-w-[6rem] whitespace-normal text-center text-[9px] font-bold leading-tight text-[#8a8fa8]">
                  {step.action}
                </div>
                <div className="text-lg text-[#8a8fa8]">→</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── MixedNumberConvertMultiplyModel ─────────────────────────────────────
// Three panels: two "regroup into equal fractional parts" panels (one
// per mixed-number operand — a row of `improperNumerator` circles, the
// first `whole * denominator` solid-filled and the rest outlined, with
// the mixed-number = improper-fraction equation underneath), connected
// by numbered arrows to a third highlighted "multiply the fractions"
// panel showing the two improper fractions multiplied down to the
// final result. Used for MD-08 (multiply two mixed numbers).

function MixedNumberOperandPanel({
  title,
  whole,
  numerator,
  denominator,
  improperNumerator,
  improperDenominator,
  color,
}: {
  title: string;
  whole: number;
  numerator: number;
  denominator: number;
  improperNumerator: number;
  improperDenominator: number;
  color: BarColor;
}) {
  const { fill, border } = BAR_COLORS[color];
  const filledCount = whole * denominator;
  const circles = Array.from({ length: improperNumerator });

  return (
    <div
      className="flex min-w-[9rem] flex-1 flex-col items-center gap-3 rounded-xl border px-4 py-4"
      style={{ borderColor: `${border}55`, background: `${fill}0d` }}
    >
      <div className="text-xs font-bold text-[#f1f0ee]">{title}</div>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {circles.map((_, i) => (
          <div
            key={i}
            className="h-5 w-5 rounded-full border-2 sm:h-6 sm:w-6"
            style={{
              borderColor: border,
              background: i < filledCount ? fill : "transparent",
            }}
          />
        ))}
      </div>
      <div className="text-[#f1f0ee]">
        <MathSpan
          latex={`${whole}\\tfrac{${numerator}}{${denominator}}=\\frac{${improperNumerator}}{${improperDenominator}}`}
        />
      </div>
    </div>
  );
}

function StepArrow({ number }: { number: number }) {
  return (
    <div className="flex flex-shrink-0 flex-col items-center gap-1 px-1">
      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#8a8fa8] text-[9px] font-bold text-[#8a8fa8]">
        {number}
      </div>
      <div className="text-lg text-[#8a8fa8]">→</div>
    </div>
  );
}

function MixedNumberConvertMultiplyModel({
  first,
  second,
  resultNumerator,
  resultDenominator,
  resultWhole,
  firstColor = "blue",
  secondColor = "gold",
  resultColor = "green",
}: {
  first: { whole: number; numerator: number; denominator: number; improperNumerator: number; improperDenominator: number };
  second: { whole: number; numerator: number; denominator: number; improperNumerator: number; improperDenominator: number };
  resultNumerator: number;
  resultDenominator: number;
  resultWhole?: number;
  firstColor?: BarColor;
  secondColor?: BarColor;
  resultColor?: BarColor;
}) {
  const { fill: rFill, border: rBorder } = BAR_COLORS[resultColor];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full flex-wrap items-stretch justify-center gap-1">
        <MixedNumberOperandPanel
          title="First mixed number"
          {...first}
          color={firstColor}
        />
        <StepArrow number={1} />
        <MixedNumberOperandPanel
          title="Second mixed number"
          {...second}
          color={secondColor}
        />
        <StepArrow number={2} />
        <div
          className="flex min-w-[9rem] flex-1 flex-col items-center justify-center gap-2 rounded-xl border px-4 py-4"
          style={{ borderColor: `${rBorder}55`, background: `${rFill}0d` }}
        >
          <div className="text-xs font-bold text-[#f1f0ee]">Multiply the fractions</div>
          <div className="text-[#f1f0ee]">
            <MathSpan
              latex={`\\frac{${first.improperNumerator}}{${first.improperDenominator}}\\times\\frac{${second.improperNumerator}}{${second.improperDenominator}}=\\frac{${resultNumerator}}{${resultDenominator}}${
                resultWhole !== undefined ? `=${resultWhole}` : ""
              }`}
              display
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-6 text-[10px] text-[#8a8fa8]">
        <div>① Each whole is regrouped into equal fractional parts.</div>
        <div>② The resulting improper fractions are multiplied.</div>
      </div>
    </div>
  );
}

// ── CommonDenominatorGroupsModel ─────────────────────────────────────────
// Two stacked bars for dividing one fraction by another: (1) the
// dividend shaded over its own denominator; (2) the same amount
// rewritten over the divisor's (finer) denominator, with the shaded
// portion bracketed into groups the size of the divisor's numerator,
// each bracket labeled with the divisor fraction, and an arrow to a
// "N groups" result box. A check equation sits underneath. Used for
// MD-13 (divide one fraction by another) — mirrors the doc's own
// "3/4 rewritten as 6/8, grouped into pairs of 3/8" diagram.

function CommonDenominatorGroupsModel({
  dividendNumerator,
  dividendDenominator,
  commonNumerator,
  commonDenominator,
  divisorNumerator,
  divisorDenominator,
  groupCount,
  splitLabel,
  dividendColor = "blue",
  commonColor = "green",
}: {
  dividendNumerator: number;
  dividendDenominator: number;
  commonNumerator: number;
  commonDenominator: number;
  divisorNumerator: number;
  divisorDenominator: number;
  groupCount: number;
  splitLabel?: string;
  dividendColor?: BarColor;
  commonColor?: BarColor;
}) {
  const { fill: dFill, border: dBorder } = BAR_COLORS[dividendColor];
  const { fill: cFill, border: cBorder } = BAR_COLORS[commonColor];
  const dividendSegs = Array.from({ length: dividendDenominator });
  const commonSegs = Array.from({ length: commonDenominator });
  const groups = Array.from({ length: groupCount });
  const segmentRem = 1.75; // matches h-7/w-7 segment size at mobile width
  const factor = dividendDenominator > 0 ? commonDenominator / dividendDenominator : 1;
  const defaultSplitLabel = `split each part into ${factor} equal pieces`;

  return (
    <div className="flex w-full flex-col items-center gap-3 overflow-x-auto">
      <div className="text-[#f1f0ee]">
        <MathSpan
          latex={`\\frac{${dividendNumerator}}{${dividendDenominator}} \\div \\frac{${divisorNumerator}}{${divisorDenominator}}`}
          display
        />
      </div>
      {/* Row 1: dividend over its own denominator */}
      <div className="flex items-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${dividendNumerator}}{${dividendDenominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {dividendSegs.map((_, i) => (
            <div
              key={i}
              className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
              style={{
                background: i < dividendNumerator ? dFill : "transparent",
                borderColor: i < dividendNumerator ? dBorder : "#2e3248",
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        <div className="mt-1 max-w-[16rem] text-center leading-tight">{splitLabel ?? defaultSplitLabel}</div>
      </div>
      {/* Row 2: rewritten over the common (divisor) denominator, grouped */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${commonNumerator}}{${commonDenominator}}`} />
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {commonSegs.map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                style={{
                  background: i < commonNumerator ? cFill : "transparent",
                  borderColor: i < commonNumerator ? cBorder : "#2e3248",
                }}
              />
            ))}
          </div>
          {groupCount > 0 && (
            <div className="flex">
              {groups.map((_, g) => (
                <div
                  key={g}
                  className="flex flex-col items-center border-b border-[#8a8fa8] pt-1"
                  style={{ width: `${divisorNumerator * segmentRem}rem` }}
                >
                  <div className="mt-1 text-[9px] text-[#8a8fa8]">
                    <MathSpan latex={`\\tfrac{${divisorNumerator}}{${divisorDenominator}}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="text-lg text-[#8a8fa8]">→</div>
        <div className="rounded-lg border border-[#4ade8066] bg-[#4ade8011] px-3 py-2 text-xs font-bold text-[#f1f0ee]">
          {groupCount} groups
        </div>
      </div>
      <div className="mt-1 rounded-lg border border-[#4ade8066] bg-[#4ade8011] px-4 py-2 text-[#f1f0ee]">
        <MathSpan
          latex={`\\frac{${dividendNumerator}}{${dividendDenominator}} \\div \\frac{${divisorNumerator}}{${divisorDenominator}} = \\frac{${commonNumerator}}{${commonDenominator}} \\div \\frac{${divisorNumerator}}{${divisorDenominator}} = ${groupCount}`}
        />
      </div>
    </div>
  );
}

// ── GroupUnitPartsByDivisorModel ─────────────────────────────────────────
// Two stacked bars for dividing a whole number by a proper fraction:
// (1) `wholeCount` wholes converted into one continuous bar of
// `totalParts` unit-fraction segments, all one color; (2) the same
// bar recolored in consecutive blocks of `groupSize` segments (the
// divisor's numerator), each block a distinct color and labeled
// "group N" underneath, with a check box reporting the group count.
// Used for MD-12 (divide a whole number by a proper fraction) —
// mirrors the doc's own "12 thirds, grouped into pairs" diagram.

function GroupUnitPartsByDivisorModel({
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

// ── CountUnitFractionPartsModel ──────────────────────────────────────────
// One row per whole, each a bar of `partsPerWhole` numbered boxes
// running consecutively across all wholes (Whole 1: 1-n, Whole 2:
// n+1-2n, ...), colored per row, each row labeled with its own part
// count. The last row gets an arrow to a highlighted "total altogether"
// box, and a check equation sits underneath. Used for MD-11 (divide a
// whole number by a unit fraction) — mirrors the doc's own numbered
// quarters-across-three-wholes diagram.

function CountUnitFractionPartsModel({
  wholeCount,
  partsPerWhole,
  total,
  unitLabel = "parts",
  wholeColors,
}: {
  wholeCount: number;
  partsPerWhole: number;
  total: number;
  unitLabel?: string;
  wholeColors?: BarColor[];
}) {
  const colors: BarColor[] = wholeColors && wholeColors.length > 0 ? wholeColors : ["blue", "green", "gold"];
  const wholes = Array.from({ length: wholeCount });
  const parts = Array.from({ length: partsPerWhole });

  return (
    <div className="flex w-full flex-col items-center gap-3 overflow-x-auto">
      <div className="rounded-lg border border-[#2e3248] bg-[#22263a] px-3 py-1.5 text-xs font-bold text-[#f1f0ee]">
        one small box represents <MathSpan latex={`\\frac{1}{${partsPerWhole}}`} />
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        {wholes.map((_, w) => {
          const { fill, border } = BAR_COLORS[colors[w % colors.length]];
          const isLast = w === wholeCount - 1;
          return (
            <div key={w} className="flex w-full flex-wrap items-center justify-center gap-2">
              <div className="w-16 flex-shrink-0 text-right text-xs font-bold text-[#f1f0ee]">
                Whole {w + 1}
              </div>
              <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
                {parts.map((_, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center border-r border-[#2e3248] text-xs font-bold last:border-r-0 sm:h-10 sm:w-10"
                    style={{ background: fill, borderColor: border, color: "#0f1117" }}
                  >
                    {w * partsPerWhole + i + 1}
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-[#2e3248] px-2 py-1 text-[10px] font-bold text-[#8a8fa8]">
                {partsPerWhole} {unitLabel}
              </div>
              {isLast && (
                <>
                  <div className="text-lg text-[#8a8fa8]">→</div>
                  <div className="rounded-lg border border-[#4ade8066] bg-[#4ade8011] px-3 py-2 text-xs font-bold text-[#f1f0ee]">
                    {total} {unitLabel} altogether
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-1 rounded-lg border border-[#4ade8066] bg-[#4ade8011] px-4 py-2 text-[#f1f0ee]">
        <MathSpan latex={`${wholeCount} \\div \\frac{1}{${partsPerWhole}} = ${total}`} />
      </div>
    </div>
  );
}

// ── DivideShareModel ──────────────────────────────────────────────────────
// Three-stage bar visual for dividing a fraction by a whole number:
// (1) the original fraction, shaded segments over the total; (2) the
// same bar with each part split finer so the shaded count divides
// evenly by the divisor; (3) that split bar broken into `divisor`
// equal "Share" panels, one segment group per share, each labeled
// with its own value, plus a check equation underneath. Used for
// MD-10 (divide a fraction by a whole number) — mirrors the doc's own
// "split each quarter into 2, then share the 6 eighths equally"
// three-row diagram.

function DivideShareModel({
  fromNumerator,
  fromDenominator,
  splitNumerator,
  splitDenominator,
  divisor,
  shareNumerator,
  shareDenominator,
  splitLabel,
  shareLabel,
  fromColor = "blue",
  share1Color = "green",
  share2Color = "gold",
}: {
  fromNumerator: number;
  fromDenominator: number;
  splitNumerator: number;
  splitDenominator: number;
  divisor: number;
  shareNumerator: number;
  shareDenominator: number;
  splitLabel?: string;
  shareLabel?: string;
  fromColor?: BarColor;
  share1Color?: BarColor;
  share2Color?: BarColor;
}) {
  const { fill: fromFill, border: fromBorder } = BAR_COLORS[fromColor];
  const shareColors = [BAR_COLORS[share1Color], BAR_COLORS[share2Color]];
  const fromSegs = Array.from({ length: fromDenominator });
  const splitSegs = Array.from({ length: splitDenominator });
  const shareSegs = Array.from({ length: shareDenominator });
  const shares = Array.from({ length: divisor });
  const factor = fromDenominator > 0 ? splitDenominator / fromDenominator : 1;
  const defaultSplitLabel = `split each part into ${factor}`;
  const defaultShareLabel = `share the ${splitNumerator} shaded parts equally`;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Row 1: original fraction */}
      <div className="flex items-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${fromNumerator}}{${fromDenominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {fromSegs.map((_, i) => (
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
      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        <div className="mt-1">{splitLabel ?? defaultSplitLabel}</div>
      </div>
      {/* Row 2: split into finer equal parts */}
      <div className="flex items-center gap-3">
        <div className="w-10 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${splitNumerator}}{${splitDenominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {splitSegs.map((_, i) => (
            <div
              key={i}
              className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
              style={{
                background: i < splitNumerator ? fromFill : "transparent",
                borderColor: i < splitNumerator ? fromBorder : "#2e3248",
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        <div className="mt-1">{shareLabel ?? defaultShareLabel}</div>
      </div>
      {/* Row 3: the equal shares, side by side */}
      <div className="flex flex-wrap items-start justify-center gap-6">
        {shares.map((_, s) => {
          const { fill, border } = shareColors[s % shareColors.length];
          return (
            <div key={s} className="flex flex-col items-center gap-1">
              <div className="text-xs font-bold text-[#f1f0ee]">Share {s + 1}</div>
              <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
                {shareSegs.map((_, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                    style={{
                      background: i < shareNumerator ? fill : "transparent",
                      borderColor: i < shareNumerator ? border : "#2e3248",
                    }}
                  />
                ))}
              </div>
              <div className="text-[#f1f0ee]">
                <MathSpan latex={`\\frac{${shareNumerator}}{${shareDenominator}}`} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Check equation */}
      <div className="mt-1 rounded-lg border border-[#4ade8066] bg-[#4ade8011] px-4 py-2 text-[#f1f0ee]">
        <MathSpan
          latex={`\\frac{${fromNumerator}}{${fromDenominator}} \\div ${divisor} = \\frac{${shareNumerator}}{${shareDenominator}}`}
        />
      </div>
    </div>
  );
}

// ── ReciprocalExchangeModel ──────────────────────────────────────────────
// Two boxes side by side — the original fraction and its reciprocal —
// with crossing arrows showing the numerator and denominator swapping
// positions ("moves down" / "moves up"), a check row underneath
// confirming the product is 1, and a three-box whole-number flow
// ("4" -> write over 1 -> "4/1" -> exchange positions -> "1/4"). Used
// for MD-09 (find the reciprocal of a fraction or whole number).
// Digits are drawn directly as SVG text rather than via MathSpan since
// they're part of the diagram's own layout, not a formula in prose.

function ReciprocalExchangeModel({
  fraction,
  fractionReciprocal,
  wholeNumber,
  fractionColor = "blue",
  reciprocalColor = "gold",
  resultColor = "green",
}: {
  fraction: { numerator: number; denominator: number };
  fractionReciprocal: { numerator: number; denominator: number };
  wholeNumber: {
    value: number;
    asFraction: { numerator: number; denominator: number };
    reciprocal: { numerator: number; denominator: number };
  };
  fractionColor?: BarColor;
  reciprocalColor?: BarColor;
  resultColor?: BarColor;
}) {
  const { fill: fFill, border: fBorder } = BAR_COLORS[fractionColor];
  const { fill: rFill, border: rBorder } = BAR_COLORS[reciprocalColor];
  const { fill: wFill, border: wBorder } = BAR_COLORS[resultColor];

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <svg
        viewBox="0 0 640 300"
        className="w-full max-w-[640px]"
        role="img"
        aria-label="A fraction and its reciprocal, with the numerator and denominator swapping positions, and a whole number written over 1 before swapping"
      >
        <defs>
          <marker
            id="re-arrowhead"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        {/* Original fraction box */}
        <rect x="20" y="20" width="260" height="140" rx="12" fill={`${fFill}22`} stroke={fBorder} strokeWidth="1" />
        <text x="150" y="44" textAnchor="middle" fontSize="11" fontWeight="700" fill="#8a8fa8">
          ORIGINAL FRACTION
        </text>
        <text x="150" y="88" textAnchor="middle" fontSize="28" fill="#f1f0ee">
          {fraction.numerator}
        </text>
        <line x1="115" y1="100" x2="185" y2="100" stroke="#f1f0ee" strokeWidth="1" />
        <text x="150" y="132" textAnchor="middle" fontSize="28" fill="#f1f0ee">
          {fraction.denominator}
        </text>
        {/* Reciprocal box */}
        <rect x="360" y="20" width="260" height="140" rx="12" fill={`${rFill}22`} stroke={rBorder} strokeWidth="1" />
        <text x="490" y="44" textAnchor="middle" fontSize="11" fontWeight="700" fill="#8a8fa8">
          RECIPROCAL
        </text>
        <text x="490" y="88" textAnchor="middle" fontSize="28" fill="#f1f0ee">
          {fractionReciprocal.numerator}
        </text>
        <line x1="455" y1="100" x2="525" y2="100" stroke="#f1f0ee" strokeWidth="1" />
        <text x="490" y="132" textAnchor="middle" fontSize="28" fill="#f1f0ee">
          {fractionReciprocal.denominator}
        </text>
        {/* Crossing arrows */}
        <path
          d="M285 78 C 340 66, 380 66, 445 66 C 462 66, 448 116, 452 122"
          fill="none"
          stroke={fBorder}
          strokeWidth="1.5"
          markerEnd="url(#re-arrowhead)"
        />
        <text x="365" y="56" textAnchor="middle" fontSize="12" fill={fBorder}>
          moves down
        </text>
        <path
          d="M285 132 C 340 156, 380 156, 448 92"
          fill="none"
          stroke={rBorder}
          strokeWidth="1.5"
          markerEnd="url(#re-arrowhead)"
        />
        <text x="365" y="178" textAnchor="middle" fontSize="12" fill={rBorder}>
          moves up
        </text>
        {/* Check row */}
        <rect x="130" y="185" width="380" height="42" rx="8" fill={`${wFill}22`} stroke={wBorder} strokeWidth="1" />
        <text x="320" y="211" textAnchor="middle" fontSize="14" fontWeight="700" fill="#f1f0ee">
          {fraction.numerator}/{fraction.denominator} × {fractionReciprocal.numerator}/{fractionReciprocal.denominator} = 1
        </text>
        {/* Whole number flow */}
        <rect x="20" y="250" width="90" height="44" rx="8" fill="#22263a" stroke="#2e3248" strokeWidth="1" />
        <text x="65" y="278" textAnchor="middle" fontSize="18" fill="#f1f0ee">
          {wholeNumber.value}
        </text>
        <line x1="112" y1="272" x2="222" y2="272" stroke="#8a8fa8" strokeWidth="1" markerEnd="url(#re-arrowhead)" />
        <text x="167" y="260" textAnchor="middle" fontSize="11" fill="#8a8fa8">
          write over 1
        </text>
        <rect x="225" y="250" width="90" height="44" rx="8" fill={`${fFill}22`} stroke={fBorder} strokeWidth="1" />
        <text x="270" y="268" textAnchor="middle" fontSize="15" fill="#f1f0ee">
          {wholeNumber.asFraction.numerator}
        </text>
        <line x1="252" y1="272" x2="288" y2="272" stroke="#f1f0ee" strokeWidth="1" />
        <text x="270" y="286" textAnchor="middle" fontSize="15" fill="#f1f0ee">
          {wholeNumber.asFraction.denominator}
        </text>
        <line x1="317" y1="272" x2="427" y2="272" stroke="#8a8fa8" strokeWidth="1" markerEnd="url(#re-arrowhead)" />
        <text x="372" y="260" textAnchor="middle" fontSize="11" fill="#8a8fa8">
          exchange positions
        </text>
        <rect x="430" y="250" width="90" height="44" rx="8" fill={`${wFill}22`} stroke={wBorder} strokeWidth="1" />
        <text x="475" y="268" textAnchor="middle" fontSize="15" fill="#f1f0ee">
          {wholeNumber.reciprocal.numerator}
        </text>
        <line x1="457" y1="272" x2="493" y2="272" stroke="#f1f0ee" strokeWidth="1" />
        <text x="475" y="286" textAnchor="middle" fontSize="15" fill="#f1f0ee">
          {wholeNumber.reciprocal.denominator}
        </text>
      </svg>
    </div>
  );
}

// ── MixedNumberCommonDenominatorGroupsModel ──────────────────────────────
// Like CommonDenominatorGroupsModel (division via common-denominator
// grouping), but the dividend starts as a mixed number rather than a
// bare fraction. Adds one new stage on top: an "assemble the mixed
// number" row — whole bars plus a fraction bar, combined into a single
// improper-fraction bar — before continuing into the familiar
// rewrite-over-common-denominator + bracket-into-groups + check-equation
// flow. Used for MD-14 (divide a mixed number by a fraction).

function MixedNumberCommonDenominatorGroupsModel({
  wholePart,
  fractionNumerator,
  fractionDenominator,
  commonNumerator,
  commonDenominator,
  divisorNumerator,
  divisorDenominator,
  groupCount,
  assembleLabel,
  splitLabel,
  wholeColor = "blue",
  fractionColor = "blue",
  commonColor = "green",
}: {
  wholePart: number;
  fractionNumerator: number;
  fractionDenominator: number;
  commonNumerator: number;
  commonDenominator: number;
  divisorNumerator: number;
  divisorDenominator: number;
  groupCount: number;
  assembleLabel?: string;
  splitLabel?: string;
  wholeColor?: BarColor;
  fractionColor?: BarColor;
  commonColor?: BarColor;
}) {
  const { fill: wFill, border: wBorder } = BAR_COLORS[wholeColor];
  const { fill: fFill, border: fBorder } = BAR_COLORS[fractionColor];
  const { fill: cFill, border: cBorder } = BAR_COLORS[commonColor];

  const improperNumerator = wholePart * fractionDenominator + fractionNumerator;
  const improperSegs = Array.from({ length: fractionDenominator * (wholePart + 1) });
  const fracSegs = Array.from({ length: fractionDenominator });
  const commonSegs = Array.from({ length: commonDenominator });
  const groups = Array.from({ length: groupCount });
  const segmentRem = 1.75; // matches h-7/w-7 segment size at mobile width

  const rewriteFactor = fractionDenominator > 0 ? commonDenominator / fractionDenominator : 1;
  const defaultAssembleLabel = "combine the wholes and the fraction into one improper fraction";
  const defaultSplitLabel = `rewrite over the common denominator: split each part into ${rewriteFactor}`;

  return (
    <div className="flex w-full flex-col items-center gap-3 overflow-x-auto">
      <div className="text-[#f1f0ee]">
        <MathSpan
          latex={`${wholePart}\\tfrac{${fractionNumerator}}{${fractionDenominator}} \\div \\frac{${divisorNumerator}}{${divisorDenominator}}`}
          display
        />
      </div>

      {/* Stage 1: assemble the mixed number from whole bars + a fraction bar */}
      <div className="flex flex-wrap items-end justify-center gap-4">
        {Array.from({ length: wholePart }).map((_, w) => (
          <div key={w} className="flex flex-col items-center gap-1">
            <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
              {fracSegs.map((_, i) => (
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
            {fracSegs.map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                style={{
                  background: i < fractionNumerator ? fFill : "transparent",
                  borderColor: i < fractionNumerator ? fBorder : "#2e3248",
                }}
              />
            ))}
          </div>
          <div className="text-[10px] text-[#8a8fa8]">
            <MathSpan latex={`\\frac{${fractionNumerator}}{${fractionDenominator}}`} />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        <div className="mt-1 max-w-[18rem] text-center leading-tight">{assembleLabel ?? defaultAssembleLabel}</div>
      </div>

      {/* The assembled improper fraction, in the dividend's own denominator */}
      <div className="flex items-center gap-3">
        <div className="w-12 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${improperNumerator}}{${fractionDenominator}}`} />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
          {improperSegs.map((_, i) => (
            <div
              key={i}
              className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
              style={{
                background: i < improperNumerator ? fFill : "transparent",
                borderColor: i < improperNumerator ? fBorder : "#2e3248",
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center text-[10px] text-[#8a8fa8]">
        <div className="text-lg font-bold leading-none">↓</div>
        <div className="mt-1 max-w-[18rem] text-center leading-tight">{splitLabel ?? defaultSplitLabel}</div>
      </div>

      {/* Stage 2: rewritten over the common (divisor) denominator, grouped */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="w-12 flex-shrink-0 text-right text-[#f1f0ee]">
          <MathSpan latex={`\\frac{${commonNumerator}}{${commonDenominator}}`} />
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="flex overflow-hidden rounded-md border border-[#2e3248]">
            {commonSegs.map((_, i) => (
              <div
                key={i}
                className="h-7 w-7 border-r border-[#2e3248] last:border-r-0 sm:h-8 sm:w-8"
                style={{
                  background: i < commonNumerator ? cFill : "transparent",
                  borderColor: i < commonNumerator ? cBorder : "#2e3248",
                }}
              />
            ))}
          </div>
          {groupCount > 0 && (
            <div className="flex">
              {groups.map((_, g) => (
                <div
                  key={g}
                  className="flex flex-col items-center border-b border-[#8a8fa8] pt-1"
                  style={{ width: `${divisorNumerator * segmentRem}rem` }}
                >
                  <div className="mt-1 text-[9px] text-[#8a8fa8]">
                    <MathSpan latex={`\\tfrac{${divisorNumerator}}{${divisorDenominator}}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="text-lg text-[#8a8fa8]">→</div>
        <div className="rounded-lg border border-[#4ade8066] bg-[#4ade8011] px-3 py-2 text-xs font-bold text-[#f1f0ee]">
          {groupCount} groups
        </div>
      </div>

      <div className="mt-1 rounded-lg border border-[#4ade8066] bg-[#4ade8011] px-4 py-2 text-[#f1f0ee]">
        <MathSpan
          latex={`${wholePart}\\tfrac{${fractionNumerator}}{${fractionDenominator}} \\div \\frac{${divisorNumerator}}{${divisorDenominator}} = \\frac{${commonNumerator}}{${commonDenominator}} \\div \\frac{${divisorNumerator}}{${divisorDenominator}} = ${groupCount}`}
        />
      </div>
    </div>
  );
}

// ── OperationChoiceCompareModel ───────────────────────────────────────────
// Side-by-side contrast panel used when a skill's whole point is telling
// multiply and divide apart for the same pair of quantities. Left panel:
// a "Multiply" reading — `totalGroups` equal group-boxes, `selectedGroups`
// of them highlighted, expression and result underneath. Right panel: a
// "Divide" reading — `totalUnits` small unit-boxes labeled with
// `unitLabel`, expression and result underneath. No shared bar model
// between the two — the point of this component is that they look
// structurally different, not that they're variations of one diagram.
// Used for MD-15 (choosing multiply vs. divide for a mixed word problem).

function OperationChoicePanel({
  label,
  color,
  children,
}: {
  label: string;
  color: BarColor;
  children: ReactNode;
}) {
  const { fill, border } = BAR_COLORS[color];
  return (
    <div
      className="flex min-w-[11rem] flex-1 flex-col items-center gap-3 rounded-xl border px-4 py-4"
      style={{ borderColor: `${border}55`, background: `${fill}0d` }}
    >
      <div
        className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
        style={{ background: `${fill}22`, color: border }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function OperationChoiceCompareModel({
  multiplyPanel,
  dividePanel,
  multiplyColor = "blue",
  divideColor = "gold",
}: {
  multiplyPanel: {
    label: string;
    expression: string;
    totalGroups: number;
    selectedGroups: number;
    result: string | number;
  };
  dividePanel: {
    label: string;
    expression: string;
    totalUnits: number;
    unitLabel: string;
    result: string | number;
  };
  multiplyColor?: BarColor;
  divideColor?: BarColor;
}) {
  const { fill: mFill, border: mBorder } = BAR_COLORS[multiplyColor];
  const { fill: dFill, border: dBorder } = BAR_COLORS[divideColor];
  const groups = Array.from({ length: multiplyPanel.totalGroups });
  const units = Array.from({ length: dividePanel.totalUnits });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full flex-wrap items-stretch justify-center gap-4">
        <OperationChoicePanel label={multiplyPanel.label} color={multiplyColor}>
          <div className="text-[#f1f0ee]">
            <MathSpan latex={multiplyPanel.expression} display />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {groups.map((_, g) => {
              const isSelected = g < multiplyPanel.selectedGroups;
              return (
                <div
                  key={g}
                  className="h-6 w-6 rounded-md border-2 sm:h-7 sm:w-7"
                  style={{
                    borderColor: isSelected ? mBorder : "#2e3248",
                    background: isSelected ? mFill : "transparent",
                  }}
                />
              );
            })}
          </div>
          <div className="text-[10px] text-[#8a8fa8]">
            {multiplyPanel.selectedGroups} of {multiplyPanel.totalGroups} equal groups, combined
          </div>
          <div className="mt-1 rounded-lg border border-[#2e3248] bg-[#22263a] px-3 py-1.5 text-[#f1f0ee]">
            <MathSpan latex={String(multiplyPanel.result)} />
          </div>
        </OperationChoicePanel>

        <OperationChoicePanel label={dividePanel.label} color={divideColor}>
          <div className="text-[#f1f0ee]">
            <MathSpan latex={dividePanel.expression} display />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1">
            {units.map((_, u) => (
              <div
                key={u}
                className="flex h-6 w-6 items-center justify-center rounded border-2 text-[9px] font-bold sm:h-7 sm:w-7"
                style={{ borderColor: dBorder, background: `${dFill}22`, color: dBorder }}
              >
                {u + 1}
              </div>
            ))}
          </div>
          <div className="text-[10px] text-[#8a8fa8]">
            {dividePanel.totalUnits} {dividePanel.unitLabel}
          </div>
          <div className="mt-1 rounded-lg border border-[#2e3248] bg-[#22263a] px-3 py-1.5 text-[#f1f0ee]">
            <MathSpan latex={String(dividePanel.result)} />
          </div>
        </OperationChoicePanel>
      </div>
      <div className="text-[10px] text-[#8a8fa8]">
        Same two quantities, two different questions — how the question is phrased decides which operation to use.
      </div>
    </div>
  );
}

// ── RelationshipClassifierGridModel ──────────────────────────────────────
// Two-part diagram: a horizontal process strip (Read → Classify →
// Calculate → Check form, one step optionally highlighted) followed by
// a 2x2 grid of relationship-type cards, each showing a short label, a
// worked example, and the method it calls for. Mirrors the doc's own
// "known whole → part / known part → whole / product of quantities /
// how many groups?" grid. Used for MD-17 (classify a mixed fraction
// question by the relationship it describes before choosing a method).
// NOTE: the DB's field names are `processSteps` (not `steps`) and each
// relationship's `label` (not `title`) — matched here against the real
// MD-17 row, not guessed.

function ProcessStrip({ processSteps, highlightStep }: { processSteps: string[]; highlightStep?: number }) {
  return (
    // No flex-wrap: matches FlowStepsModel's convention elsewhere in this
    // file for a row of sequential steps — scrolls horizontally on narrow
    // screens instead of dropping the last step onto its own line.
    <div className="flex w-full items-center justify-center gap-2 overflow-x-auto">
      {processSteps.map((step, i) => (
        <div key={i} className="flex flex-shrink-0 items-center gap-2">
          <div
            className="flex min-w-[6rem] flex-col items-center gap-1 rounded-xl border px-3 py-2.5"
            style={{
              borderColor: i === highlightStep ? "#f9c74f66" : "#2e3248",
              background: i === highlightStep ? "#f9c74f1a" : "#22263a",
            }}
          >
            <div className="text-[10px] font-bold text-[#8a8fa8]">{i + 1}.</div>
            <div className="whitespace-nowrap text-xs font-bold text-[#f1f0ee]">{step}</div>
          </div>
          {i < processSteps.length - 1 && <div className="text-lg text-[#8a8fa8]">→</div>}
        </div>
      ))}
    </div>
  );
}

// `label` is a plain-text heading that happens to contain a bare LaTeX
// arrow command (e.g. "Known whole \to part") rather than a full math
// expression wrapped in \text{...}, unlike `example`/`method` which are
// already properly escaped. Rendering it through MathSpan puts KaTeX in
// math mode for the whole string, so the words get typeset as adjacent
// italic variables with their spaces collapsed ("Knownwhole"). Render it
// as plain text instead, converting the one LaTeX token it actually
// needs (the arrow) by hand.
function relationshipLabelText(label: string): string {
  return label.replace(/\\to\b/g, "→").replace(/\\rightarrow\b/g, "→").replace(/\\,/g, " ");
}

function RelationshipCard({
  label,
  example,
  method,
  color = "blue",
}: {
  label: string;
  example: string;
  method: string;
  color?: BarColor;
}) {
  const { fill, border } = BAR_COLORS[color];
  return (
    <div
      className="flex flex-col items-center gap-2 rounded-xl border px-4 py-3"
      style={{ borderColor: `${border}55`, background: `${fill}0d` }}
    >
      <div className="text-center text-xs font-bold text-[#f1f0ee]">
        {relationshipLabelText(label)}
      </div>
      <div className="text-[#f1f0ee]">
        <MathSpan latex={example} />
      </div>
      <div className="text-[#f1f0ee]">
        <MathSpan latex={method} />
      </div>
    </div>
  );
}

function RelationshipClassifierGridModel({
  processSteps,
  highlightStep,
  relationships,
}: {
  processSteps: string[];
  highlightStep?: number;
  relationships: Array<{
    label: string;
    example: string;
    method: string;
    color?: BarColor;
  }>;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-5 overflow-x-auto">
      <ProcessStrip processSteps={processSteps} highlightStep={highlightStep} />
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {relationships.map((r, i) => (
          <RelationshipCard key={i} {...r} />
        ))}
      </div>
    </div>
  );
}

// ── NodeEdgeFlowModel ─────────────────────────────────────────────────────
// Renders the actual nodes/edges shape MD-16's teach row has in the DB
// right now (confirmed live — the jsonb_set patch mentioned in the prior
// handoff notes was never applied). Each node is a labeled box (a bold
// value plus a smaller descriptive sublabel); each edge's operationLabel
// is shown on the arrow connecting the node at index i to the node at
// index i+1. This is a distinct component from FlowStepsModel above
// (which expects the steps/arrowLabels shape) — the two share the
// "flowSteps" style string but are discriminated by "nodes" vs "steps".

function NodeEdgeFlowModel({
  nodes,
  edges,
}: {
  nodes: Array<{ id: string; label: string; sublabel?: string }>;
  edges: Array<{ from: string; to: string; operationLabel: string }>;
}) {
  return (
    <div className="flex w-full items-center justify-center gap-2 overflow-x-auto">
      {nodes.map((node, i) => (
        <div key={node.id} className="flex flex-shrink-0 items-center gap-2">
          <div className="flex min-w-[7rem] flex-col items-center gap-1 rounded-xl border border-[#2e3248] bg-[#22263a] px-3 py-3">
            <div className="whitespace-nowrap text-sm font-bold text-[#f1f0ee]">{node.label}</div>
            {node.sublabel && (
              <div className="whitespace-nowrap text-[10px] text-[#8a8fa8]">{node.sublabel}</div>
            )}
          </div>
          {i < edges.length && (
            <div className="flex flex-col items-center">
              <div className="whitespace-nowrap text-[10px] font-bold text-[#8a8fa8]">
                <MathSpan latex={edges[i].operationLabel} />
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
          ) : content.visual_model.style === "addMixedNumbers" && "groups" in content.visual_model ? (
            <RepeatedFractionAdditionModel
              groups={content.visual_model.groups}
              fractionNumerator={content.visual_model.fractionNumerator}
              fractionDenominator={content.visual_model.fractionDenominator}
              resultNumerator={content.visual_model.resultNumerator}
              groupColor={content.visual_model.groupColor}
              resultColor={content.visual_model.resultColor}
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
          ) : content.visual_model.style === "flowSteps" && "nodes" in content.visual_model ? (
            <NodeEdgeFlowModel
              nodes={content.visual_model.nodes}
              edges={content.visual_model.edges}
            />
          ) : content.visual_model.style === "flowSteps" && "steps" in content.visual_model ? (
            <FlowStepsModel
              steps={content.visual_model.steps}
              arrowLabels={content.visual_model.arrowLabels}
              arrowColors={content.visual_model.arrowColors}
            />
          ) : content.visual_model.style === "groupPartition" && "wholeAmount" in content.visual_model ? (
            <GroupPartitionModel
              wholeAmount={content.visual_model.wholeAmount}
              denominator={content.visual_model.denominator}
              groupValue={content.visual_model.groupValue}
              selectCount={content.visual_model.selectCount}
              resultValue={content.visual_model.resultValue}
              dotColor={content.visual_model.dotColor}
              highlightColor={content.visual_model.highlightColor}
            />
          ) : content.visual_model.style === "inverseGroupReconstruct" && "knownParts" in content.visual_model ? (
            <InverseGroupReconstructModel
              knownParts={content.visual_model.knownParts}
              knownTotal={content.visual_model.knownTotal}
              partValue={content.visual_model.partValue}
              totalParts={content.visual_model.totalParts}
              wholeValue={content.visual_model.wholeValue}
              knownColor={content.visual_model.knownColor}
              unknownColor={content.visual_model.unknownColor}
            />
          ) : content.visual_model.style === "fractionAreaModel" && "shadedColumns" in content.visual_model ? (
            <FractionAreaModel
              rows={content.visual_model.rows}
              columns={content.visual_model.columns}
              shadedColumns={content.visual_model.shadedColumns}
              selectedRows={content.visual_model.selectedRows}
              resultNumerator={content.visual_model.resultNumerator}
              resultDenominator={content.visual_model.resultDenominator}
              shadeColor={content.visual_model.shadeColor}
              selectColor={content.visual_model.selectColor}
            />
          ) : content.visual_model.style === "fractionSimplifyRegroup" && "groupSize" in content.visual_model ? (
            <FractionSimplifyRegroupModel
              totalParts={content.visual_model.totalParts}
              shadedParts={content.visual_model.shadedParts}
              groupSize={content.visual_model.groupSize}
              resultNumerator={content.visual_model.resultNumerator}
              resultDenominator={content.visual_model.resultDenominator}
              shadeColor={content.visual_model.shadeColor}
            />
          ) : content.visual_model.style === "fractionCancelSteps" && "steps" in content.visual_model ? (
            <FractionCancelStepsModel steps={content.visual_model.steps} />
          ) : content.visual_model.style === "mixedNumberConvertMultiply" && "first" in content.visual_model ? (
            <MixedNumberConvertMultiplyModel
              first={content.visual_model.first}
              second={content.visual_model.second}
              resultNumerator={content.visual_model.resultNumerator}
              resultDenominator={content.visual_model.resultDenominator}
              resultWhole={content.visual_model.resultWhole}
              firstColor={content.visual_model.firstColor}
              secondColor={content.visual_model.secondColor}
              resultColor={content.visual_model.resultColor}
            />
          ) : content.visual_model.style === "commonDenominatorGroups" && "divisorNumerator" in content.visual_model ? (
            <CommonDenominatorGroupsModel
              dividendNumerator={content.visual_model.dividendNumerator}
              dividendDenominator={content.visual_model.dividendDenominator}
              commonNumerator={content.visual_model.commonNumerator}
              commonDenominator={content.visual_model.commonDenominator}
              divisorNumerator={content.visual_model.divisorNumerator}
              divisorDenominator={content.visual_model.divisorDenominator}
              groupCount={content.visual_model.groupCount}
              splitLabel={content.visual_model.splitLabel}
              dividendColor={content.visual_model.dividendColor}
              commonColor={content.visual_model.commonColor}
            />
          ) : content.visual_model.style === "groupUnitPartsByDivisor" && "groupSize" in content.visual_model ? (
            <GroupUnitPartsByDivisorModel
              wholeCount={content.visual_model.wholeCount}
              partsPerWhole={content.visual_model.partsPerWhole}
              totalParts={content.visual_model.totalParts}
              groupSize={content.visual_model.groupSize}
              groupCount={content.visual_model.groupCount}
              unitLabel={content.visual_model.unitLabel}
              baseColor={content.visual_model.baseColor}
              groupColors={content.visual_model.groupColors}
            />
          ) : content.visual_model.style === "countUnitFractionParts" && "partsPerWhole" in content.visual_model ? (
            <CountUnitFractionPartsModel
              wholeCount={content.visual_model.wholeCount}
              partsPerWhole={content.visual_model.partsPerWhole}
              total={content.visual_model.total}
              unitLabel={content.visual_model.unitLabel}
              wholeColors={content.visual_model.wholeColors}
            />
          ) : content.visual_model.style === "divideShare" && "splitDenominator" in content.visual_model ? (
            <DivideShareModel
              fromNumerator={content.visual_model.fromNumerator}
              fromDenominator={content.visual_model.fromDenominator}
              splitNumerator={content.visual_model.splitNumerator}
              splitDenominator={content.visual_model.splitDenominator}
              divisor={content.visual_model.divisor}
              shareNumerator={content.visual_model.shareNumerator}
              shareDenominator={content.visual_model.shareDenominator}
              splitLabel={content.visual_model.splitLabel}
              shareLabel={content.visual_model.shareLabel}
              fromColor={content.visual_model.fromColor}
              share1Color={content.visual_model.share1Color}
              share2Color={content.visual_model.share2Color}
            />
          ) : content.visual_model.style === "reciprocalExchange" && "fractionReciprocal" in content.visual_model ? (
            <ReciprocalExchangeModel
              fraction={content.visual_model.fraction}
              fractionReciprocal={content.visual_model.fractionReciprocal}
              wholeNumber={content.visual_model.wholeNumber}
              fractionColor={content.visual_model.fractionColor}
              reciprocalColor={content.visual_model.reciprocalColor}
              resultColor={content.visual_model.resultColor}
            />
          ) : content.visual_model.style === "mixedNumberCommonDenominatorGroups" && "wholePart" in content.visual_model ? (
            <MixedNumberCommonDenominatorGroupsModel
              wholePart={content.visual_model.wholePart}
              fractionNumerator={content.visual_model.fractionNumerator}
              fractionDenominator={content.visual_model.fractionDenominator}
              commonNumerator={content.visual_model.commonNumerator}
              commonDenominator={content.visual_model.commonDenominator}
              divisorNumerator={content.visual_model.divisorNumerator}
              divisorDenominator={content.visual_model.divisorDenominator}
              groupCount={content.visual_model.groupCount}
              assembleLabel={content.visual_model.assembleLabel}
              splitLabel={content.visual_model.splitLabel}
              wholeColor={content.visual_model.wholeColor}
              fractionColor={content.visual_model.fractionColor}
              commonColor={content.visual_model.commonColor}
            />
          ) : content.visual_model.style === "operationChoiceCompare" && "multiplyPanel" in content.visual_model ? (
            <OperationChoiceCompareModel
              multiplyPanel={content.visual_model.multiplyPanel}
              dividePanel={content.visual_model.dividePanel}
              multiplyColor={content.visual_model.multiplyColor}
              divideColor={content.visual_model.divideColor}
            />
          ) : content.visual_model.style === "relationshipClassifierGrid" && "relationships" in content.visual_model ? (
            <RelationshipClassifierGridModel
              processSteps={content.visual_model.processSteps}
              highlightStep={content.visual_model.highlightStep}
              relationships={content.visual_model.relationships}
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
// Shared types + the color palette used by every visual-model component.
// This is the ONE file that defines the visual_model discriminated union —
// adding a new teach-card diagram style means adding one new member here,
// one new file under models/, and one new entry in registry.tsx.

// ── Types ──────────────────────────────────────────────────────────────────

export type BarColor = "blue" | "gold" | "green" | "red";

export type VisualBarRow = {
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

export type VisualModel =
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
      // Matches the source doc's own layout: the whole and the fraction are
      // each converted straight into the common denominator FIRST (e.g.
      // "1 = 4/4" and "1/2 = 2/4"), shown side by side with a "+", and only
      // then combined into one bar — no separate "rewrite over the common
      // denominator" stage, since the pieces are already in that denominator
      // by the time they're combined. (An earlier version of this component
      // assembled in the fraction's own denominator first and rewrote
      // afterward — this is the corrected, doc-aligned version.)
      style: "mixedNumberCommonDenominatorGroups";
      wholePart: number; // e.g. 1, in "1 3/4"
      fractionNumerator: number; // e.g. 3
      fractionDenominator: number; // e.g. 4
      commonNumerator: number; // e.g. 14 — the mixed number's improper form rewritten over the common denominator
      commonDenominator: number; // e.g. 8 — matches the divisor's denominator
      divisorNumerator: number; // e.g. 7, in 7/8 — also the group size in common-denominator terms
      divisorDenominator: number; // e.g. 8
      groupCount: number; // e.g. 2 — commonNumerator / divisorNumerator
      assembleLabel?: string; // e.g. "combine the wholes and the fraction into one fraction over the common denominator"
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
    }
  | {
      // FDP-01: tenths strip + hundredths grid pair with a value-preserving
      // decomposition chain. Built against the real MD/FDP-01 DB row (id
      // 1383) whose `style` field was left as a literal placeholder string
      // ("NEW component needed - decimal place-value grid pair") — that
      // row's `style` needs to be updated to this real value, see the SQL
      // note given alongside this component.
      style: "decimalPlaceValueGridPair";
      tenthsModel: {
        decimal: string; // e.g. "0.4" — raw LaTeX, no $ delimiters
        fraction: string; // e.g. "\\frac{4}{10}"
        totalParts: number; // e.g. 10
        shadedParts: number; // e.g. 4
      };
      hundredthsModel: {
        totalParts: number; // e.g. 100
        shadedParts: number; // e.g. 37
        decompositionSteps: string[]; // raw LaTeX per step, e.g. ["\\frac{3}{10} + \\frac{7}{100}", "\\frac{30}{100} + \\frac{7}{100}", "\\frac{37}{100}", "0.37"]
      };
      tenthsColor?: BarColor;
      hundredthsColor?: BarColor;
      caption: string;
    }
  | {
      // FDP-02: two stacked hundred-squares (percent shown as parts per
      // hundred), the second illustrating the zero-placeholder case (e.g.
      // 6% = 0.06, not 0.6). Built against the real FDP-02 DB row (id
      // 1424), whose `style` was also left as a placeholder string —
      // needs the same kind of DB update as FDP-01's row did.
      style: "percentageHundredSquarePair";
      mainModel: {
        decimal: string; // e.g. "0.37"
        percent: string; // e.g. "37\\%" — raw LaTeX
        fraction: string; // e.g. "\\frac{37}{100}"
        totalParts: number; // e.g. 100
        shadedParts: number; // e.g. 37
      };
      zeroPlaceholderModel: {
        note: string; // e.g. "The zero holds the tenths place."
        decimal: string; // e.g. "0.06"
        percent: string; // e.g. "6\\%"
        fraction: string; // e.g. "\\frac{6}{100}"
        totalParts: number; // e.g. 100
        shadedParts: number; // e.g. 6
      };
      mainColor?: BarColor;
      zeroPlaceholderColor?: BarColor;
      caption: string;
    }
  | {
      // FDP-03: four-row benchmark equivalence table (unit fraction bar +
      // fraction = hundredths = decimal = percent chain per row) plus a
      // multiple-build diagram (e.g. 3 copies of 1/5 -> 3/5). Built
      // against the real FDP-03 DB row (id 1467) — same placeholder
      // `style` situation as FDP-01/02, needs the same kind of DB update.
      // Note: unlike FDP-01/02, this row's fractions are LaTeX strings
      // only (no numeric totalParts/shadedParts) — the component parses
      // each unit fraction's own denominator to size its bar.
      style: "benchmarkEquivalence";
      benchmarkTable: Array<{
        fraction: string; // e.g. "\\frac{1}{2}" — must be a unit fraction (numerator 1) for the bar to render
        hundredths: string; // e.g. "\\frac{50}{100}"
        decimal: string; // e.g. "0.5"
        percent: string; // e.g. "50\\%"
      }>;
      multipleBuild: {
        unit: { decimal: string; percent: string; fraction: string };
        copies: number; // e.g. 3
        result: { decimal: string; percent: string; fraction: string };
      };
      caption: string;
    }
  | {
      // FDP-04: hundred-square example (decimal = fraction = percent, the
      // fraction constructed from shadedParts/totalParts since the DB
      // doesn't store it separately here) plus a place-value shift chart
      // tracking a single digit across a fixed set of columns as the
      // value is multiplied by 10 repeatedly. Built against the real
      // FDP-04 DB row (id 1510) — same placeholder `style` situation as
      // the earlier FDP rows, needs the same kind of DB update.
      style: "decimalToPercentagePlaceShift";
      hundredSquareModel: {
        decimal: string; // e.g. "0.37"
        percent: string; // e.g. "37\\%"
        totalParts: number; // e.g. 100
        shadedParts: number; // e.g. 37
      };
      placeValueShift: {
        steps: Array<{
          value: string; // e.g. "0.006" — raw LaTeX/plain number, no $ delimiters
          digitColumn: string; // must match one entry in `columns`, e.g. "Thousandths"
          operation?: string; // e.g. "\\times 10" — shown between this step and the next; omit on the last step
        }>;
        result: string; // e.g. "0.006 = 0.6\\%"
        columns: string[]; // e.g. ["Hundreds","Tens","Ones","Tenths","Hundredths","Thousandths"] — must include "Ones" for the integer/decimal split to work correctly
      };
      squareColor?: BarColor;
      highlightColor?: BarColor;
      caption: string;
    }
  | {
      // FDP-06: place-value table (decimal -> fraction denominator
      // justification) paired with a hundred-square regroup/simplify
      // diagram. Built against the real FDP-06 DB row (id 1599), whose
      // `style` was left as a placeholder string ("NEW component needed -
      // place-value denominator table (candidate shared build with
      // FDP-01/04/05 grids) plus a hundred-square grouping/simplification
      // diagram (new)") — needs the same kind of `style` update the other
      // FDP rows did.
      style: "decimalToFractionRegroup";
      placeValueTable: {
        rows: Array<{
          value: string; // e.g. "0.305"
          digits: string[]; // maps 1:1 to `columns` from index 0; shorter than columns for fewer decimal places
          fraction: string; // e.g. "305/1000" — plain "num/denom" string, not LaTeX
          denominator: string; // e.g. "1000"
        }>;
        columns: string[]; // e.g. ["Ones","Tenths","Hundredths","Thousandths"]
      };
      hundredSquareSimplification: {
        groups: number; // total groups after regrouping, e.g. 25
        result: string; // simplified "num/denom", e.g. "8/25"
        decimal: string; // e.g. "0.32"
        percent: string | null; // present in the DB row, unused by this component
        groupSize: number; // e.g. 4
        totalParts: number; // e.g. 100
        shadedParts: number; // e.g. 32
        shadedGroups: number; // e.g. 8
        initialFraction: string; // "num/denom" before simplifying, e.g. "32/100"
      };
      squareColor?: BarColor;
      caption: string;
    }
  | {
      // FDP-07: place-value table (fraction -> decimal direction, the
      // mirror of FDP-06's decimal -> fraction table) paired with a
      // placeholder-zero step sequence (9/1000 -> fill empty tenths/
      // hundredths with zeros -> 0.009). Built against the real FDP-07
      // DB row (id 1643), whose `style` was left as a placeholder string
      // flagging it as a "candidate shared build with FDP-01/FDP-06
      // place-value grids, fraction-to-decimal direction". The table half
      // is structurally close to FDP-06's — not yet extracted into
      // shared.tsx, since that would mean touching FDP-06's already-
      // confirmed-live component; worth doing once a THIRD skill needs
      // this same shape, not before.
      style: "fractionToDecimalPlaceValue";
      placeValueTable: {
        rows: Array<{
          digits: string[]; // maps 1:1 to `columns` from index 0
          result: string; // decimal string, e.g. "0.042"
          fraction: string; // "num/denom" input label, e.g. "42/1000"
          decimalPlaces: number; // present in the DB row, unused by this component
        }>;
        columns: string[]; // e.g. ["Ones","Tenths","Hundredths","Thousandths"]
      };
      placeholderZeroSequence: {
        steps: Array<{ label: string; detail: string }>;
        fraction: string; // e.g. "9/1000" — the worked example's input fraction
      };
      caption: string;
    }
  | {
      // FDP-08: strip repartition (3/5 -> 6/10, the same shaded length
      // redivided into more/smaller equal parts, landing at 0.6 on a
      // number line) paired with an eighths-to-thousandths magnify/zoom
      // diagram (3/8 -> 375 thousandths, landing at 0.375). Built against
      // the real FDP-08 DB row (id 1686), whose `style` was left as a
      // placeholder explicitly noting this is a brand-new component and
      // NOT a share candidate with any prior FDP component.
      //
      // Note: a few doc elements (the "each fifth is split into 2 equal
      // tenths" annotation, the "3 of 5 parts" side-captions, the
      // unlabeled 0.1-spaced ticks on the strip-repartition number line)
      // aren't literal fields here — the component derives them from
      // parts/shaded/scale-factor via a small ordinal-fraction-name
      // helper, rather than the DB spelling them out. Flagged, not
      // silently done — worth HBO adding explicit fields later if this
      // wording ever needs to diverge from the mechanical derivation.
      style: "fractionRepartitionZoom";
      stripRepartition: {
        original: { parts: number; shaded: number; fraction: string };
        repartitioned: { parts: number; shaded: number; fraction: string };
        numberLinePoint: string; // e.g. "0.6"
      };
      eighthsZoom: {
        original: { parts: number; shaded: number; fraction: string };
        shadedTotal: string; // e.g. "375 thousandths"
        numberLineMarks: string[]; // e.g. ["0","0.125","0.250","0.375","1"]
        numberLinePoint: string; // e.g. "0.375"
        oneEighthEquals: string; // e.g. "125 thousandths"
      };
      caption: string;
    }
  | {
      // FDP-09: place-value exchange/regroup sharing diagram (3 wholes
      // shared across 8 groups, exchanging ones -> tenths -> hundredths
      // -> thousandths as each place value proves too small to share
      // evenly) paired with a quarter-piece grouping-into-wholes diagram
      // (7 quarters -> 1 whole + 3 quarters, landing at 1.75). Built
      // against the real FDP-09 DB row (id 1731), whose `style` was left
      // as a placeholder explicitly noting this is brand new and NOT a
      // share candidate with FDP-08 or any earlier place-value grid.
      //
      // Note: several doc elements aren't literal fields — the "exchange
      // into X" labels between rows, the dot-count visuals, the
      // "regroup" arrow label, and the bracket captions under the
      // quarter tiles are derived mechanically from the given step/count
      // data (parsing the target unit name from the NEXT step's own
      // exchange text, spelling out counts via the existing
      // numberToWords helper) rather than being literal DB fields.
      style: "shareRegroupQuarterGroup";
      sharingModel: {
        steps: Array<{ exchange: string; perGroup: string; remainder: string }>;
        groups: number;
        result: string; // e.g. "0.375"
        wholes: number;
      };
      quarterGrouping: {
        wholesFormed: number;
        totalQuarters: number;
        numberLineMarks: string[];
        numberLinePoint: string;
        remainingQuarters: number;
      };
      caption: string;
    }
  | {
      // FDP-10: strip-to-hundred-square repartition (3/5 -> split each
      // fifth into 20 pieces -> 60/100 -> hundred square reading 60%)
      // paired with an improper-fraction version (5/4 as five quarter-
      // pieces -> one whole hundred square (100%) + a second hundred
      // square 25% shaded -> 125% total). Built against the real FDP-10
      // DB row (id 1776), whose `style` explicitly flagged BOTH halves
      // as "candidate share" — with FDP-02's hundred-square-pair
      // component and with FDP-09's quarter-grouping component
      // respectively. On inspection neither is a clean drop-in: FDP-02
      // has no strip/split step at all (it renders two decimals that
      // are already out of 100 directly), and FDP-09's quarter-grouping
      // rebuilds into a bar + number line, not two hundred-squares + a
      // result box. The "row of fraction tiles + bracket caption"
      // sub-pattern IS now needed by a second skill (FDP-09, then this
      // one) — a genuine shared-build candidate for shared.tsx, deferred
      // rather than done here to avoid touching FDP-09's already-
      // confirmed-live component in the same pass. Only HundredGrid is
      // actually reused as-is.
      style: "repartitionHundredSquareImproper";
      repartitionModel: {
        result: string; // "60%"
        totalParts: number; // 5
        resultTotal: number; // 100
        shadedParts: number; // 3
        splitFactor: number; // 20
        resultShaded: number; // 60
        originalFraction: string; // "3/5"
      };
      improperFractionModel: {
        result: string; // "125%"
        wholesFormed: number; // 1
        totalQuarters: number; // 5
        remainderPercent: string; // "25%"
        firstWholePercent: string; // "100%"
        remainingQuarters: number; // 1
      };
      caption: string;
    }
  | {
      // FDP-11: aligned fraction/decimal/percentage number line — a
      // proper fraction (3/8 -> 0.375 -> 37.5%) and an improper fraction
      // (9/8 -> 1.125 -> 112.5%), each showing a strip above two stacked,
      // aligned number lines (decimal, then percentage) with the same
      // endpoint highlighted on all three. Built against the real FDP-11
      // DB row (id 1823), whose `style` explicitly notes this is the
      // first number-line-style visual across FDP-01-11 and not a share
      // candidate with any prior component.
      //
      // Layout note: the doc places "decimal"/"percentage" labels beside
      // their lines with one dashed connector spanning all three rows.
      // After repeated width-collapse bugs this session on exactly that
      // side-label-plus-content pattern, this component puts those
      // labels ABOVE each line instead — same information, no column-
      // alignment risk. Flagged as a deliberate simplification.
      style: "alignedFractionDecimalPercent";
      properFractionModel: {
        endpoint: { decimal: string; percent: string };
        fraction: string; // "3/8"
        totalParts: number; // 8
        shadedParts: number; // 3
        decimalMarks: string[];
        percentMarks: string[];
      };
      improperFractionModel: {
        endpoint: { decimal: string; percent: string };
        fraction: string; // "9/8"
        totalPieces: number; // 9
        decimalMarks: string[];
        percentMarks: string[];
        piecesPerWhole: number; // 8
      };
      caption: string;
    }
  | {
      // FDP-12: hundred-cell regrouping (35/100 shaded cells regrouped
      // into 20 columns of 5, giving 7 whole shaded columns -> 35/100 =
      // 7/20) paired with an improper-percentage bars model (125% as two
      // bars split into quarters: first bar fully shaded (100%), second
      // bar one quarter shaded (25%) -> 5 shaded quarter-pieces -> 5/4 =
      // 1 1/4). Built against the real FDP-12 DB row (id 1873), whose
      // `style` flagged both halves as candidate shares. On inspection:
      // (1) FDP-10's repartitionModel goes the opposite direction
      // (fraction -> hundred-square) and uses the standard 10-column
      // HundredGrid, while this doc's grid is 20 columns x 5 rows grouped
      // by column — not a clean reuse, a new column-grouped grid was
      // built instead. (2) neither FDP-09's tile-row+bar+numberline nor
      // FDP-10's tile-row+two-hundred-squares match this doc's two-BARS-
      // split-into-quarters rendering — also not a clean reuse. The
      // low-level "bar divided into N segments, K shaded" primitive is
      // now duplicated a fourth time across FDP-08/10/12 — a genuine
      // shared-build candidate, deferred again rather than refactoring
      // already-live components in this pass.
      style: "hundredRegroupImproperBars";
      regroupingModel: {
        result: string; // "7/20"
        groupSize: number; // 5
        totalCells: number; // 100
        shadedCells: number; // 35
        totalGroups: number; // 20
        shadedGroups: number; // 7
      };
      improperFractionModel: {
        result: string; // "5/4"
        wholeBars: number; // 1
        mixedNumber: string; // "1 1/4"
        quartersPerBar: number; // 4
        totalShadedQuarters: number; // 5
        shadedQuartersFirstBar: number; // 4
        shadedQuartersSecondBar: number; // 1
      };
      caption: string;
    }
  | {
      // FDP-13: two-bar hundredths comparison (3/5 vs 58%, showing which
      // shaded length extends farther) paired with a single shared
      // number line comparing two points (0.72 vs 3/4 = 0.75). Built
      // against the real FDP-13 DB row (id 1931), whose `style` flagged
      // both halves as candidate shares. On inspection: (1) FDP-10
      // renders hundred-SQUARES, not two stacked comparison bars with a
      // gap indicator — different shape. (2) FDP-11 aligns two SCALES
      // for the SAME point; this shows one scale with two DIFFERENT
      // points — also different, though the tick-drawing logic is
      // conceptually close (generalized fresh here rather than reusing
      // FDP-11's single-point ScaleLine as-is). Also: the precise
      // geometric connector line between the two bars' differing
      // boundaries is deliberately NOT attempted — each bar shows its
      // own boundary marker independently instead, per the same
      // width-collapse-risk reasoning as FDP-11's label placement.
      style: "hundredthsCompareNumberLine";
      hundredthsModel: {
        result: string; // "3/5 > 58%"
        difference: number; // 2
        wholeAmount: number; // 100
        topValueLabel: string; // "3/5"
        topValueShaded: number; // 60
        bottomValueLabel: string; // "58%"
        bottomValueShaded: number; // 58
      };
      numberLineModel: {
        pointA: { label: string; value: string };
        pointB: { label: string; value: string };
        result: string; // "0.72 < 3/4"
        scaleEnd: string; // "0.80"
        scaleStart: string; // "0.65"
      };
      caption: string;
    }
  | {
      // FDP-14: three-bar ordering (55% < 3/5 < 0.62, shaded lengths
      // increasing top to bottom, shared axis underneath) paired with a
      // whole-plus-extra-part model (125% < 1.3 < 7/5, each row a full
      // whole box + a second box shaded to the extra amount beyond one
      // whole, ordered by size of the extra part). Built against the
      // real FDP-14 DB row (id 1984), whose `style` flagged the first
      // half as a candidate share with the FDP-01/02/06/10/12/13 bar/
      // hundred-square family and correctly flagged the second half as
      // brand new. On inspection the first half is still a distinct
      // shape: none of those components render an N-row ordered stack
      // of bars with per-bar boundary labels and a shared axis — closest
      // relative is FDP-13's two-bar comparison, generalized to three
      // rows here rather than reused directly.
      style: "barOrderWholePlusExtra";
      barOrderModel: {
        bars: Array<{ label: string; valueShaded: number }>;
        result: string; // "55% < 3/5 < 0.62"
        wholeAmount: number; // 100
      };
      wholePlusExtraModel: {
        rows: Array<{ label: string; wholeParts: number; extraShaded: number }>;
        result: string; // "125% < 1.3 < 7/5"
      };
      caption: string;
    }
  | {
      // FDP-15: two three-panel "triptych" visuals, each showing one
      // amount in three linked forms at once — the first in the series
      // to show fraction+decimal+percentage together rather than two at
      // a time. Built against the real FDP-15 DB row (id 2040), whose
      // `style` suggested possibly building one reusable three-panel
      // component with an "above-one" variant. On inspection the two
      // variants aren't uniform enough for that: the proper-fraction
      // version shows percentage as a HundredGrid (a 100-cell square),
      // while the above-one version shows percentage as a NUMBER LINE
      // (0-200%) instead — a hundred-square can't cleanly represent
      // above 100% the same way. Built as two section renderers within
      // one component instead (matching every other multi-part FDP
      // skill), sharing a genuinely common internal "number line with
      // one highlighted point" helper across both the decimal-line and
      // percentage-line panels (that piece IS uniform), and reusing
      // HundredGrid as-is for the percentage-grid panel.
      style: "tripleForm";
      tripleFormModel: {
        result: string; // "3/5 = 0.6 = 60%"
        fraction: { label: string; numerator: number; denominator: number };
        decimalLine: { label: string; point: number; scaleEnd: number; scaleStart: number };
        percentageGrid: { label: string; shaded: number; wholeAmount: number };
      };
      tripleFormAboveOneModel: {
        result: string; // "5/4 = 1.25 = 125%"
        fraction: { label: string; wholeParts: number; extraNumerator: number; extraDenominator: number };
        decimalScale: { label: string; point: number; scaleEnd: number; scaleStart: number };
        percentageScale: { label: string; point: number; scaleEnd: number; scaleStart: number };
      };
      caption: string;
    };

// Shape of the `teach_content` jsonb column on `questions`
// (only populated when question_type = 'teach').
export type TeachContent = {
  key_point: string; // rendered via MathText — may contain $...$ / $$...$$
  key_point_steps?: string[]; // optional short bulleted alternative to key_point — each entry rendered via MathText inside a numbered list; falls back to key_point when absent/empty
  rule: string;       // shown in the boxed rule callout
  formula: string;    // raw LaTeX, no $ delimiters — rendered via MathSpan
  visual_model?: VisualModel;
};

export const BAR_COLORS: Record<BarColor, { fill: string; border: string }> = {
  blue:  { fill: "#818cf8", border: "#a5b4fc" },
  gold:  { fill: "#f9c74f", border: "#fbd97a" },
  green: { fill: "#4ade80", border: "#86efac" },
  red:   { fill: "#f87171", border: "#fca5a5" },
};
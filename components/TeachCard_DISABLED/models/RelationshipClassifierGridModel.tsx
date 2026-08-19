import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

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

// Fixed 4-color set matching the source doc's process-strip bubbles
// (purple, blue, yellow, green, in that order). Not part of BarColor
// (which is blue/gold/green/red) since the doc's step 1 bubble is
// purple/lavender, not one of the four app bar colors — this is a
// fixed visual convention for this one component, cycled by index if
// there are ever more/fewer than 4 steps.
const STEP_BUBBLE_COLORS = [
  { fill: "#a78bfa", border: "#c4b5fd" }, // 1. Read — purple
  { fill: "#60a5fa", border: "#93c5fd" }, // 2. Classify — blue
  { fill: "#f9c74f", border: "#fbd97a" }, // 3. Calculate — yellow/gold
  { fill: "#4ade80", border: "#86efac" }, // 4. Check form — green
];

export function ProcessStrip({ processSteps, highlightStep }: { processSteps: string[]; highlightStep?: number }) {
  return (
    // Compact bubbles, no scroll needed: small fixed-ish width + tight
    // padding/text so all 4 steps sit on one row at normal card widths.
    // overflow-x-auto kept only as a fallback for very narrow screens.
    <div className="flex w-full items-center justify-center gap-1.5 overflow-x-auto">
      {processSteps.map((step, i) => {
        const { fill, border } = STEP_BUBBLE_COLORS[i % STEP_BUBBLE_COLORS.length];
        const isHighlighted = i === highlightStep;
        return (
          <div key={i} className="flex flex-shrink-0 items-center gap-1.5">
            <div
              className="flex flex-col items-center gap-0.5 rounded-lg border px-2 py-1.5"
              style={{
                borderColor: `${border}${isHighlighted ? "" : "88"}`,
                background: `${fill}${isHighlighted ? "33" : "1f"}`,
              }}
            >
              <div className="text-[9px] font-bold text-[#8a8fa8]">{i + 1}.</div>
              <div className="whitespace-nowrap text-[11px] font-bold leading-tight text-[#f1f0ee]">{step}</div>
            </div>
            {i < processSteps.length - 1 && <div className="text-sm text-[#8a8fa8]">→</div>}
          </div>
        );
      })}
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
export function relationshipLabelText(label: string): string {
  return label.replace(/\\to\b/g, "→").replace(/\\rightarrow\b/g, "→").replace(/\\,/g, " ");
}

export function RelationshipCard({
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

export function RelationshipClassifierGridModel({
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
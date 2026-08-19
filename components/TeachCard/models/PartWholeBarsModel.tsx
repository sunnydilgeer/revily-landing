import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── PartWholeBar / PartWholeBarsModel ───────────────────────────────────
// Generic part-whole diagram for word-problem structure — no fraction
// denominators or segments involved, just labeled colored sections in
// a bar, a brace label spanning it, and an equation beside it. Used
// for "which operation does this problem need" skills (join -> add,
// remove -> subtract), not fraction magnitude.

export function PartWholeBar({
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

export function PartWholeBarsModel({
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


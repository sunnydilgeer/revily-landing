import { BAR_COLORS, type BarColor } from "../types";

// ── GroupPartitionModel ──────────────────────────────────────────────────
// Dot-grid partition visual: `wholeAmount` dots split into `denominator`
// equal boxes, the first (or first `selectCount`) box(es) highlighted,
// arrow down to a "one group contains N" label. Used for MD-01 (find a
// unit fraction of an amount) and MD-02, which extends it to select/sum
// `selectCount` groups instead of just the first one.

export function GroupPartitionModel({
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


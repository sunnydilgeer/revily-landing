import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── CountUnitFractionPartsModel ──────────────────────────────────────────
// One row per whole, each a bar of `partsPerWhole` numbered boxes
// running consecutively across all wholes (Whole 1: 1-n, Whole 2:
// n+1-2n, ...), colored per row, each row labeled with its own part
// count. The last row gets an arrow to a highlighted "total altogether"
// box, and a check equation sits underneath. Used for MD-11 (divide a
// whole number by a unit fraction) — mirrors the doc's own numbered
// quarters-across-three-wholes diagram.

export function CountUnitFractionPartsModel({
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


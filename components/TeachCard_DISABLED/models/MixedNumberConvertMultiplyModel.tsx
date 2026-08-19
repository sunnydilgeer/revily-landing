import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── MixedNumberConvertMultiplyModel ─────────────────────────────────────
// Three panels: two "regroup into equal fractional parts" panels (one
// per mixed-number operand — a row of `improperNumerator` circles, the
// first `whole * denominator` solid-filled and the rest outlined, with
// the mixed-number = improper-fraction equation underneath), connected
// by numbered arrows to a third highlighted "multiply the fractions"
// panel showing the two improper fractions multiplied down to the
// final result. Used for MD-08 (multiply two mixed numbers).

export function MixedNumberOperandPanel({
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

export function StepArrow({ number }: { number: number }) {
  return (
    <div className="flex flex-shrink-0 flex-col items-center gap-1 px-1">
      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#8a8fa8] text-[9px] font-bold text-[#8a8fa8]">
        {number}
      </div>
      <div className="text-lg text-[#8a8fa8]">→</div>
    </div>
  );
}

export function MixedNumberConvertMultiplyModel({
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


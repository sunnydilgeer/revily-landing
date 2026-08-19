import { MathSpan } from "@/components/MathText";
import { type BarColor } from "../types";
import { numberToWords, capitalize, HundredGrid } from "../shared";

// ── PercentageHundredSquarePairModel ──────────────────────────────────────
// New component (FDP-02): two stacked hundred-squares matching the doc's
// layout, built on the shared HundredGrid also used by FDP-01. Unlike
// FDP-01, the DB data here gives the three linked representations
// (percent/fraction/decimal) directly rather than a prose decomposition
// chain, so they're shown connected by arrows instead of an invented
// multi-step chain. `zeroPlaceholderModel` additionally carries a `note`
// field (the zero-as-tenths-place-holder point), shown under its square.
// Used for FDP-02 (percentages as parts-per-hundred).

function PercentSquareBlock({
  exampleNumber,
  model,
  color,
}: {
  exampleNumber: number;
  model: {
    decimal: string;
    percent: string;
    fraction: string;
    totalParts: number;
    shadedParts: number;
    note?: string;
  };
  color: BarColor;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-bold uppercase tracking-wide text-[#8a8fa8]">
        Example {exampleNumber} · {capitalize(numberToWords(model.shadedParts))} percent
      </div>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-[10rem] flex-1 flex-col gap-2">
          <div className="max-w-[10rem]">
            <HundredGrid totalParts={model.totalParts} shadedParts={model.shadedParts} color={color} />
          </div>
          <div className="text-center text-[10px] text-[#8a8fa8]">
            {model.shadedParts} of {model.totalParts} equal squares are shaded
          </div>
          {model.note && (
            <div className="text-center text-[10px] font-bold text-[#8a8fa8]">{model.note}</div>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-2 text-[#f1f0ee]">
          <MathSpan latex={model.percent} />
          <span className="text-sm text-[#8a8fa8]">=</span>
          <MathSpan latex={model.fraction} />
          <span className="text-sm text-[#8a8fa8]">=</span>
          <MathSpan latex={model.decimal} />
        </div>
      </div>
    </div>
  );
}

export function PercentageHundredSquarePairModel({
  mainModel,
  zeroPlaceholderModel,
  mainColor = "blue",
  zeroPlaceholderColor = "green",
}: {
  mainModel: {
    decimal: string;
    percent: string;
    fraction: string;
    totalParts: number;
    shadedParts: number;
  };
  zeroPlaceholderModel: {
    note: string;
    decimal: string;
    percent: string;
    fraction: string;
    totalParts: number;
    shadedParts: number;
  };
  mainColor?: BarColor;
  zeroPlaceholderColor?: BarColor;
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <PercentSquareBlock exampleNumber={1} model={mainModel} color={mainColor} />
      <PercentSquareBlock exampleNumber={2} model={zeroPlaceholderModel} color={zeroPlaceholderColor} />
    </div>
  );
}

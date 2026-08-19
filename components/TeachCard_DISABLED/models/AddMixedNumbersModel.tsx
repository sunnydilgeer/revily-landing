import { type BarColor } from "../types";
import { MixedAddendRow } from "../shared";

export function AddMixedNumbersModel({
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


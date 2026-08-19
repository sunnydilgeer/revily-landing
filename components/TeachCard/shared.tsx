import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "./types";

// ── MixedAddendRow ────────────────────────────────────────────────────────
// Shared by AddMixedNumbersModel, SubtractMixedNumbersModel, and
// ExchangeSubtractMixedNumbersModel — lives here (not colocated with any
// one of them) because it's genuinely reused across three model files.
// A compact "whole + partial" row: a chain of full bars (one per whole
// number) plus one partial bar for the fraction, all in one line, used
// for both addend rows and the result row of a mixed-number addition.
// Deliberately small segments (h-5/w-5, smaller than the h-7/w-7 used
// elsewhere) plus flex-wrap and a horizontal-scroll fallback, since a
// row with several whole numbers can get wide fast — never clips, at
// worst it scrolls or wraps.

export function MixedAddendRow({
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

// ── numberToWords / capitalize ────────────────────────────────────────────
// Shared by DecimalPlaceValueGridPairModel (FDP-01) and
// PercentageHundredSquarePairModel (FDP-02) for "Example N · [word]
// tenths/hundredths/percent" labels — spells out a count (always 0-99 for
// these two components) rather than hardcoding text, so labels stay
// correct if either component is reused with different data.

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

export function numberToWords(n: number): string {
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return ones === 0 ? TENS[tens] : `${TENS[tens]}-${ONES[ones]}`;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── HundredGrid ────────────────────────────────────────────────────────────
// Shared by DecimalPlaceValueGridPairModel (FDP-01) and
// PercentageHundredSquarePairModel (FDP-02) — a 10-column grid of
// `totalParts` cells, the first `shadedParts` shaded row-major. Both
// skills independently needed "a hundred-square with N shaded", so this
// is factored out here rather than duplicated (the FDP-02 DB row's own
// placeholder style string flagged this as a "candidate shared build"
// with FDP-01, which is what prompted pulling it out).

export function HundredGrid({
  totalParts,
  shadedParts,
  color,
}: {
  totalParts: number;
  shadedParts: number;
  color: BarColor;
}) {
  const { fill, border } = BAR_COLORS[color];
  const columns = 10;
  return (
    <div
      className="grid overflow-hidden rounded-md border"
      style={{ borderColor: `${border}88`, gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: totalParts }).map((_, i) => (
        <div
          key={i}
          className="aspect-square border-b border-r"
          style={{
            borderColor: `${border}40`,
            background: i < shadedParts ? fill : "transparent",
          }}
        />
      ))}
    </div>
  );
}

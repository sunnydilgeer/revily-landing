import { MathSpan } from "@/components/MathText";
import { BAR_COLORS, type BarColor } from "../types";

// ── ReciprocalExchangeModel ──────────────────────────────────────────────
// Two boxes side by side — the original fraction and its reciprocal —
// with crossing arrows showing the numerator and denominator swapping
// positions ("moves down" / "moves up"), a check row underneath
// confirming the product is 1, and a three-box whole-number flow
// ("4" -> write over 1 -> "4/1" -> exchange positions -> "1/4"). Used
// for MD-09 (find the reciprocal of a fraction or whole number).
// Digits are drawn directly as SVG text rather than via MathSpan since
// they're part of the diagram's own layout, not a formula in prose.

export function ReciprocalExchangeModel({
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


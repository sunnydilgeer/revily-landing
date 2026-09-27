/*
 * Practice templates for rounding, ordering, estimating and bounds (lessons 10–13).
 * Original questions in the style of AQA Foundation papers; `inspiredBy` is our audit trail.
 */
import { num, rotate, tidy } from '../helpers'
import type { NumberPart, QuestionBody, Template } from '../types'

type Round = { statement: string; prompt: string; answer: number; dp?: number; start: string; why: string }

function rounding(parts: Round[]): QuestionBody {
  return {
    stem: 'Round each number.',
    parts: parts.map((p): NumberPart => ({
      kind: 'number', prompt: p.prompt, answer: p.answer, dp: p.dp, marks: 1, statements: [p.statement],
      hint: 'Find the last digit you keep, then look at the digit straight after it: 5 or more rounds up.',
      chain: [
        { line: p.start },
        { line: `\\approx ${p.dp !== undefined ? p.answer.toFixed(p.dp) : String(p.answer).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,')}`, op: 'Look at the next digit', why: p.why },
      ],
    })),
  }
}

type Order = { decimals: [string[], number]; temps: [string[], number]; big: [string[], number] }

function ordering({ decimals, temps, big }: Order, by: number): QuestionBody {
  const [decimalOptions, decimalRight] = decimals
  const [tempOptions, coldest] = temps
  const [bigOptions, largest] = big
  return {
    stem: 'Comparing numbers.',
    parts: [
      {
        kind: 'choice', prompt: 'Which list is in order, smallest first?', marks: 1, statements: ['11:ordering-decimals'], ...rotate(decimalOptions, decimalRight, by),
        hint: 'Give every number the same number of decimal places, then compare.',
        reason: `Fill the gaps with zeros so each number has the same number of decimal places, then compare them like whole numbers: ${decimalOptions[decimalRight]}.`,
      },
      {
        kind: 'choice', prompt: 'At midnight, four towns had these temperatures. Which town was the coldest?', marks: 1, statements: ['11:ordering-negative-numbers'], ...rotate(tempOptions, coldest, by + 1),
        hint: 'On a number line, the coldest temperature is furthest to the left.',
        reason: `${tempOptions[coldest]} is the furthest below zero. The bigger the number after a minus sign, the colder it is.`,
      },
      {
        kind: 'choice', prompt: 'Which is the largest number?', marks: 1, statements: ['11:ordering-large-numbers'], ...rotate(bigOptions, largest, by + 2),
        hint: 'Count the digits first, then compare from the left, one column at a time.',
        reason: `Numbers with more digits are bigger. For the same number of digits, compare from the left: the first column that differs decides. ${bigOptions[largest]} is the largest.`,
      },
    ],
  }
}

function estimate(values: [number, number, number], rounded: [number, number, number], bigger: boolean, by: number): QuestionBody {
  const [a, b, c] = values, [ra, rb, rc] = rounded, top = ra * rb, answer = tidy(top * 10 / (rc * 10))
  const why = rc === 0.5 ? `Dividing by 0.5 is the same as doubling: ${top} × 2 = ${answer}.` : `Multiply the top and the bottom by 10: ${top * 10} ÷ ${rc * 10} = ${answer}.`
  const choice = rotate([
    'Bigger. The top was rounded up and the bottom was rounded down.',
    'Smaller. The top was rounded down and the bottom was rounded up.',
    'The same. Rounding does not change the answer.',
  ], bigger ? 0 : 1, by)
  return {
    stem: `Estimate the value of $\\dfrac{${a} \\times ${b}}{${c}}$`,
    parts: [
      {
        kind: 'number', prompt: 'Round each number to 1 significant figure, then work it out.', answer, marks: 2,
        statements: ['12:estimating-significant-figures', '12:estimating-calculations'],
        method: [{ prompt: `Round ${a} and ${b} to 1 significant figure. What do they multiply to?`, answer: top }],
        hint: `${a} → ${ra}. Round ${b} and ${c} the same way.`,
        chain: [
          { line: `\\frac{[[a:${a}]] \\times [[b:${b}]]}{[[c:${c}]]}` },
          { line: `\\approx \\frac{[[A:${ra}]] \\times [[B:${rb}]]}{[[C:${rc}]]}`, op: 'Round to 1 s.f.', merge: { A: ['a'], B: ['b'], C: ['c'] }, why: `Keep just the first significant figure of each number: ${a} → ${ra}, ${b} → ${rb}, ${c} → ${rc}.` },
          { line: `= \\frac{[[t:${top}]]}{[[C:${rc}]]}`, op: 'Multiply the top', merge: { t: ['A', 'B'] }, why: `${ra} × ${rb} = ${top}.` },
          { line: `= [[r:${answer}]]`, op: `÷ ${rc}`, merge: { r: ['t', 'C'] }, why },
        ],
      },
      {
        kind: 'choice', prompt: 'Is your estimate bigger or smaller than the exact answer?', marks: 1, statements: ['12:estimating-checking'], ...choice,
        hint: 'Which numbers went up when you rounded, and which went down? Dividing by a smaller number gives a bigger answer.',
        reason: bigger
          ? `${a} and ${b} were rounded up, so the top got bigger. ${c} was rounded down, and dividing by a smaller number makes the answer bigger. Both changes push the estimate up.`
          : `${a} and ${b} were rounded down, so the top got smaller. ${c} was rounded up, and dividing by a bigger number makes the answer smaller. Both push the estimate down.`,
      },
    ],
  }
}

function circleEstimate(radius: number, rounded: number, by: number): QuestionBody {
  const answer = 3 * rounded * rounded
  const choice = rotate([
    'Bigger. 3.14 is more than 3, and everything else stays the same.',
    'Smaller. 3.14 is more accurate, so the answer goes down.',
    'The same. π is π, whichever value you use.',
  ], 0, by)
  return {
    stem: `The area of a circle is $A = \\pi r^2$. A circle has radius ${radius} cm.`,
    parts: [
      {
        kind: 'number', prompt: 'Use π ≈ 3 to estimate its area.', answer, suffix: ' cm²', marks: 2, statements: ['12:estimating-formulas'],
        method: [{ prompt: `Round ${radius} to 1 significant figure and square it. What do you get?`, answer: rounded * rounded }],
        mistakes: [{ answer: (3 * rounded) ** 2, note: `That squares 3 × ${rounded}. Only the radius is squared: 3 × ${rounded}².` }],
        hint: `Round ${radius} to 1 significant figure first, then square it.`,
        chain: [
          { line: 'A = [[p:\\pi]] [[r:r^2]]' },
          { line: `\\approx [[p:3]] \\times [[r:${rounded}^2]]`, op: 'Round, then substitute', why: `Round ${radius} to ${rounded} (1 s.f.) and use π ≈ 3, as the question says.` },
          { line: `= [[p:3]] \\times [[s:${rounded * rounded}]]`, op: 'Square', merge: { s: ['r'] }, why: `${rounded}² = ${rounded} × ${rounded} = ${rounded * rounded}. Indices before multiplying.` },
          { line: `= [[a:${answer}]]`, op: '× 3', merge: { a: ['p', 's'] }, why: `3 × ${rounded * rounded} = ${answer}, so the area is about ${answer} cm².` },
        ],
      },
      {
        kind: 'choice', prompt: `Kai works it out with π = 3.14 instead of 3, and the same radius of ${rounded} cm. Will his answer be bigger or smaller than yours?`, marks: 1,
        statements: ['12:estimating-checking'], ...choice,
        hint: 'Compare 3.14 with 3. Everything else stays the same.',
        reason: `3.14 × ${rounded * rounded} is more than 3 × ${rounded * rounded}. The exam wants that comparison: “3.14 is more accurate” on its own scores nothing.`,
      },
    ],
  }
}

/** Bounds for things you count: the upper bound is the largest whole number (JUN24 1F Q20). */
function countBounds(what: string, value: number, unit: number): QuestionBody {
  const lower = value - unit / 2, upper = value + unit / 2 - 1
  return {
    stem: `The number of ${what} is ${num(value)}, correct to the nearest ${num(unit)}.`,
    parts: [
      {
        kind: 'number', prompt: `What is the smallest possible number of ${what}?`, answer: lower, marks: 1, statements: ['13:bounds-half-unit', '13:bounds-lower-upper'],
        mistakes: [{ answer: value - unit, note: `${value - unit} rounds to ${value - unit}, not ${value}. Go down half of ${unit}, not all of it.` }],
        hint: `Half of ${unit} is ${unit / 2}. What is the smallest number that rounds up to ${value}?`,
        chain: [{ line: `${value} - ${unit / 2}` }, { line: `= ${lower}`, op: 'Half a unit down', why: `${lower} is exactly halfway, and halfway rounds up to ${value}. So ${lower} is the smallest.` }],
      },
      {
        kind: 'number', prompt: `What is the largest possible number of ${what}?`, answer: upper, marks: 1, statements: ['13:bounds-lower-upper'],
        mistakes: [{ answer: value + unit / 2, note: `${value + unit / 2} would round up to ${value + unit}. ${what[0].toUpperCase() + what.slice(1)} come in whole numbers, so the largest is ${upper}.` }],
        hint: `Half a unit up is ${value + unit / 2}, but that rounds up. You can only count whole ${what}.`,
        chain: [{ line: `${value} + ${unit / 2} = ${value + unit / 2}` }, { line: `${value + unit / 2} - 1 = ${upper}`, op: 'Whole numbers only', why: `${value + unit / 2} rounds up to ${value + unit}, so it can’t be the answer. You count ${what} in whole numbers, so the largest is ${upper}. (For a length, you would write the interval with < ${value + unit / 2}.)` }],
      },
    ],
  }
}

function errorInterval(stem: string, value: number, unit: string, letter: string, half: number, accuracy: string): QuestionBody {
  const lower = tidy(value - half), upper = tidy(value + half)
  return {
    stem: `${stem} Complete the error interval for ${letter}: ☐ ≤ ${letter} < ☐`,
    parts: [
      {
        kind: 'number', prompt: `The lower bound (before ≤ ${letter})`, answer: lower, suffix: ` ${unit}`, marks: 1, statements: ['13:bounds-half-unit', '13:bounds-lower-upper'],
        hint: `Rounded ${accuracy}: what is half of that unit?`,
        chain: [
          { line: `[[v:${value}]] - [[h:${half}]]` },
          { line: `= [[l:${lower}]]`, op: 'Take off half a unit', merge: { l: ['v', 'h'] }, why: `It was rounded ${accuracy}. Half of that unit is ${half}, so the smallest value that rounds to ${value} is ${lower}.` },
        ],
      },
      {
        kind: 'number', prompt: `The upper bound (after ${letter} <)`, answer: upper, suffix: ` ${unit}`, marks: 1, statements: ['13:bounds-lower-upper', '13:bounds-error-interval'],
        hint: `Add half the unit to ${value}.`,
        chain: [
          { line: `[[v:${value}]] + [[h:${half}]]` },
          { line: `= [[u:${upper}]]`, op: 'Add half a unit', merge: { u: ['v', 'h'] }, why: `${value} + ${half} = ${upper}.` },
          { line: `${lower} \\le ${letter} < [[u:${upper}]]`, op: 'Write the interval', why: `The lower bound is included (≤). The upper bound is not (<): ${upper} itself would round up, not to ${value}.` },
        ],
      },
    ],
  }
}

function truncation(start: string, cut: number, x: number): QuestionBody {
  const next = tidy(x + 0.1)
  return {
    stem: 'Truncating means cutting a number off, with no rounding.',
    parts: [
      {
        kind: 'number', prompt: `Truncate ${start} to 1 decimal place.`, answer: cut, dp: 1, marks: 1, statements: ['13:truncation'],
        hint: 'Keep the digits up to the first decimal place and drop the rest. Do not round.',
        chain: [{ line: start }, { line: `\\to ${cut.toFixed(1)}`, op: 'Cut off', why: `Keep one decimal place and drop everything after it, even if the next digit is 5 or more. ${start} → ${cut.toFixed(1)}.` }],
      },
      {
        kind: 'number', prompt: `A number $x$ is truncated to 1 decimal place. The result is ${x}. What is the smallest value $x$ could be?`, answer: x, marks: 1, statements: ['13:truncation-error-interval'],
        hint: `Truncating only ever cuts digits off, so x can’t be less than ${x}.`,
        chain: [{ line: `x \\ge ${x}` }, { line: `${x} \\le x`, op: 'Nothing lower', why: `Cutting digits off never makes a number bigger, so x is at least ${x}. ${x} itself truncates to ${x}.` }],
      },
      {
        kind: 'number', prompt: `$x$ must be less than which number?`, answer: next, marks: 1, statements: ['13:truncation-error-interval'],
        hint: `Any number from ${x} up to (but not including) the next tenth truncates to ${x}.`,
        chain: [{ line: `${x} \\le x < ${next}` }, { line: `x < ${next}`, op: 'The next tenth', why: `${x}999… still truncates to ${x}, but ${next} truncates to ${next}. So x < ${next}: a full tenth above, not half.` }],
      },
    ],
  }
}

export const accuracyTemplates: Template[] = [
  {
    id: 'rounding-mixed', topic: 'rounding', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Nov23 3F Q8; Nov23 2F Q9a; Nov22 3F Q30 — rounding, often the last mark of a longer question',
    variants: [
      rounding([
        { statement: '10:rounding-decimal-places', prompt: 'Round 6.4827 to 2 decimal places.', answer: 6.48, dp: 2, start: '6.48\\underline{2}7', why: 'The digit after the 2nd decimal place is 2. That is less than 5, so round down: 6.48.' },
        { statement: '10:rounding-significant-figures', prompt: 'Round 38\u00a0562 to 2 significant figures.', answer: 39000, start: '38\\,\\underline{5}62', why: 'The first two significant figures are 3 and 8. The next digit is 5, so round up to 39. Zeros keep the number the right size: 39 000.' },
        { statement: '10:rounding-powers-of-ten', prompt: 'Round 4750 to the nearest 100.', answer: 4800, start: '47\\underline{5}0', why: '4750 is between 4700 and 4800. The tens digit is 5, so round up: 4800.' },
        { statement: '10:rounding-carrying', prompt: 'Round 5.997 to 2 decimal places.', answer: 6, dp: 2, start: '5.99\\underline{7}', why: 'The next digit is 7, so round up. 5.99 goes up to 6.00: the 9s roll over. Keep both decimal places.' },
      ]),
      rounding([
        { statement: '10:rounding-decimal-places', prompt: 'Round 12.3471 to 2 decimal places.', answer: 12.35, dp: 2, start: '12.34\\underline{7}1', why: 'The digit after the 2nd decimal place is 7. That is 5 or more, so round up: 12.35.' },
        { statement: '10:rounding-significant-figures', prompt: 'Round 7249 to 2 significant figures.', answer: 7200, start: '72\\underline{4}9', why: 'The first two significant figures are 7 and 2. The next digit is 4, so round down: 7200.' },
        { statement: '10:rounding-powers-of-ten', prompt: 'Round 23\u00a0650 to the nearest 1000.', answer: 24000, start: '23\\,\\underline{6}50', why: '23 650 is between 23 000 and 24 000. The hundreds digit is 6, so round up: 24 000.' },
        { statement: '10:rounding-carrying', prompt: 'Round 3.96 to 1 decimal place.', answer: 4, dp: 1, start: '3.9\\underline{6}', why: 'The next digit is 6, so round up. 3.9 goes up to 4.0: the 9 rolls over. Keep one decimal place.' },
      ]),
      rounding([
        { statement: '10:rounding-decimal-places', prompt: 'Round 0.5638 to 3 decimal places.', answer: 0.564, dp: 3, start: '0.563\\underline{8}', why: 'The digit after the 3rd decimal place is 8, so round up: 0.564.' },
        { statement: '10:rounding-significant-figures', prompt: 'Round 0.004\u00a017 to 2 significant figures.', answer: 0.0042, start: '0.0041\\underline{7}', why: 'The first significant figure is the 4 (zeros at the start don’t count). The first two are 4 and 1, and the next digit is 7, so round up: 0.0042.' },
        { statement: '10:rounding-powers-of-ten', prompt: 'Round 865 to the nearest 10.', answer: 870, start: '86\\underline{5}', why: '865 is exactly halfway between 860 and 870. Halfway rounds up: 870.' },
        { statement: '10:rounding-carrying', prompt: 'Round 9.95 to 1 decimal place.', answer: 10, dp: 1, start: '9.9\\underline{5}', why: 'The next digit is 5, so round up. 9.9 goes up to 10.0: both 9s roll over. Keep one decimal place.' },
      ]),
    ],
  },
  {
    id: 'ordering-mixed', topic: 'place-value', ramp: 'recall', style: 'standard', context: 'weather', calculator: false,
    inspiredBy: 'Jun24 3F Q2 and Q5; Nov24 3F Q4; Nov22 2F Q3 — ordering, and negative temperatures',
    variants: [
      ordering({
        decimals: [['0.3, 0.25, 0.305', '0.25, 0.3, 0.305', '0.25, 0.305, 0.3', '0.305, 0.3, 0.25'], 1],
        temps: [['Ayr: −3 °C', 'Bala: −8 °C', 'Cove: 2 °C', 'Deal: −5 °C'], 1],
        big: [['2\u00a0405\u00a0000', '2\u00a0450\u00a0000', '2\u00a0045\u00a0000', '245\u00a0000'], 1],
      }, 0),
      ordering({
        decimals: [['0.7, 0.07, 0.707', '0.07, 0.7, 0.707', '0.07, 0.707, 0.7', '0.707, 0.7, 0.07'], 1],
        temps: [['Hull: −1 °C', 'Leek: −6 °C', 'Rye: −4 °C', 'Wick: 3 °C'], 1],
        big: [['3\u00a0098\u00a0000', '3\u00a0980\u00a0000', '3\u00a0908\u00a0000', '398\u00a0000'], 1],
      }, 1),
      ordering({
        decimals: [['0.5, 0.45, 0.405', '0.405, 0.45, 0.5', '0.45, 0.405, 0.5', '0.405, 0.5, 0.45'], 1],
        temps: [['Bude: −2 °C', 'Oban: −10 °C', 'Ely: −7 °C', 'Poole: 0 °C'], 1],
        big: [['1\u00a0070\u00a0500', '1\u00a0700\u00a0050', '1\u00a0075\u00a0000', '170\u00a0500'], 1],
      }, 2),
    ],
  },
  {
    id: 'estimate-calculation', topic: 'rounding', ramp: 'apply', style: 'explain', context: 'none', calculator: false,
    inspiredBy: 'Jun25 1F Q14; Jun23 3F Q24; Nov23 2F Q9 — estimate to 1 s.f., then over or under, with a reason',
    variants: [estimate([48.7, 5.8, 0.53], [50, 6, 0.5], true, 0), estimate([31.6, 4.2, 0.46], [30, 4, 0.5], false, 1), estimate([19.2, 7.9, 0.42], [20, 8, 0.4], true, 2)],
  },
  {
    id: 'estimate-formula', topic: 'rounding', ramp: 'apply', style: 'explain', context: 'none', calculator: false,
    inspiredBy: 'Jun24 1F Q22 — circle area with π = 3, then π = 3.14: bigger or smaller?',
    variants: [circleEstimate(9.8, 10, 0), circleEstimate(6.1, 6, 1), circleEstimate(4.1, 4, 2)],
  },
  {
    id: 'bounds-error-interval', topic: 'bounds', ramp: 'stretch', style: 'standard', context: 'home', calculator: true,
    inspiredBy: 'Nov23 3F Q19; Jun25 2F Q23a; Nov24 2F Q23 — complete the error interval',
    variants: [
      errorInterval('The length of a pencil, l cm, is 14.3 cm correct to 1 decimal place.', 14.3, 'cm', 'l', 0.05, 'to 1 decimal place (the nearest 0.1)'),
      errorInterval('The mass of a suitcase, m kg, is 60 kg correct to the nearest 10 kg.', 60, 'kg', 'm', 5, 'to the nearest 10'),
      errorInterval('The height of a door, h m, is 2.13 m correct to 2 decimal places.', 2.13, 'm', 'h', 0.005, 'to 2 decimal places (the nearest 0.01)'),
    ],
  },
  {
    id: 'bounds-truncation', topic: 'bounds', ramp: 'stretch', style: 'standard', context: 'none', calculator: true,
    inspiredBy: 'Not tested by AQA Foundation 2022–25; kept because it is on the specification',
    variants: [truncation('8.679', 8.6, 5.3), truncation('12.458', 12.4, 7.8), truncation('3.9999', 3.9, 2.1)],
  },
  {
    id: 'bounds-counting', topic: 'bounds', ramp: 'stretch', style: 'standard', context: 'events', calculator: false,
    inspiredBy: 'Jun24 1F Q20 — a crowd to the nearest 100: the largest is 8449, not 8450',
    variants: [countBounds('people at the match', 8400, 100), countBounds('people at the concert', 2600, 100), countBounds('fans in the stadium', 35000, 1000)],
  },
]

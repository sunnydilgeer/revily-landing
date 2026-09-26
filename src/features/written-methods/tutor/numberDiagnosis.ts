/*
 * Explains *why* a whole-number or decimal answer is wrong, in one or two plain sentences.
 * Fixed rules, no AI. Returns null when it does not recognise the mistake, so the lesson
 * falls back to the question's hint.
 */

const toNumber = (text: string) => {
  const clean = text.replace(/[£%,\s]/g, '').replace(/[−–]/g, '-')
  return /^-?\d*\.?\d+$/.test(clean) ? Number(clean) : null
}
const near = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
const decimals = (n: number) => (String(n).split('.')[1] ?? '').length
const show = (n: number) => (Math.abs(n) >= 10000 ? n.toLocaleString('en-GB').replace(/,/g, ' ') : String(n))
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a))

function roundTo(value: number, unit: number) {
  return Math.round((value + Math.sign(value) * 1e-9 * unit) / unit) * unit
}
function cutTo(value: number, unit: number) {
  return Math.trunc((value + Math.sign(value) * 1e-9 * unit) / unit) * unit
}
const tidy = (n: number) => Number(n.toPrecision(12))

/** The size of one "step" for a rounding instruction, e.g. 0.01 for 2 d.p., 1000 for "nearest 1000". */
function roundingUnit(question: string, original: number) {
  let m = question.match(/(\d+) decimal places?/i)
  if (m) return { unit: 10 ** -Number(m[1]), kind: 'dp' as const, amount: Number(m[1]) }
  m = question.match(/(\d+) significant figures?/i)
  if (m) {
    const sf = Number(m[1]), magnitude = Math.floor(Math.log10(Math.abs(original)))
    return { unit: 10 ** (magnitude - sf + 1), kind: 'sf' as const, amount: sf }
  }
  m = question.match(/nearest £?\s?([\d ,]+)/i)
  if (m) return { unit: Number(m[1].replace(/[ ,]/g, '')), kind: 'nearest' as const, amount: 0 }
  if (/nearest penny/i.test(question)) return { unit: 0.01, kind: 'dp' as const, amount: 2 }
  return null
}

/** The number being rounded: the first number in the question with its thousands spaces removed. */
function originalNumber(question: string) {
  const m = question.match(/-?\d{1,3}(?:[ ,]\d{3})+(?:\.\d+)?|-?\d*\.\d+|-?\d+/)
  return m ? Number(m[0].replace(/[ ,]/g, '')) : null
}

function diagnoseRounding(question: string, response: string, value: number, expected: number, expectedText: string) {
  const original = originalNumber(question)
  if (original === null || !/correct to|nearest/i.test(question)) return null
  const rule = roundingUnit(question, original)
  if (!rule) return null
  const { unit } = rule

  // Right value, missing the trailing zero ("7" for "7.0").
  if (near(value, expected) && expectedText.includes('.') && !response.includes('.')) {
    return `Right value, but keep the zero. Correct to ${rule.kind === 'dp' ? `${rule.amount} decimal place${rule.amount === 1 ? '' : 's'}` : `${rule.amount} significant figures`} means writing ${expectedText}.`
  }
  // Kept the digits but lost the place-holder zeros (49 for 49 000).
  for (const scale of [10, 100, 1000, 10000]) {
    if (Number.isInteger(expected) && Number.isInteger(value) && expected >= 100 && near(value * scale, expected)) return `Keep the number the same size. Fill the places with zeros, so ${show(value)} becomes ${show(expected)}.`
  }
  const cut = tidy(cutTo(original, unit))
  const nextDigit = Math.floor(Math.abs(original) / unit * 10 + 1e-9) % 10
  if (near(value, cut) && !near(cut, expected)) {
    return `You cut the number off instead of rounding. The next digit is ${nextDigit}, which is 5 or more, so round up.`
  }
  if (near(value, tidy(cut + Math.sign(original) * unit)) && near(cut, expected)) {
    return `The next digit is ${nextDigit}, which is less than 5, so the last digit you keep stays the same.`
  }
  if (rule.kind === 'dp') {
    for (const other of [rule.amount - 1, rule.amount + 1]) {
      if (other >= 0 && near(value, tidy(roundTo(original, 10 ** -other)))) {
        return `That's correct to ${other} decimal place${other === 1 ? '' : 's'}. The question asks for ${rule.amount}.`
      }
    }
  }
  if (rule.kind === 'sf') {
    if (near(value, tidy(roundTo(original, 10 ** -rule.amount))) && !near(value, expected)) {
      return `That's ${rule.amount} decimal places. Significant figures start from the first digit that isn't zero.`
    }
  }
  return null
}

function diagnosePercent(question: string, value: number, expected: number) {
  if (/as a percentage/i.test(question) && near(value * 100, expected)) return 'To change a decimal to a percentage, multiply by 100.'
  if (/%.*as a decimal/i.test(question) && near(value, expected * 100)) return 'To change a percentage to a decimal, divide by 100.'
  return null
}

function diagnoseMultiplication(question: string, value: number, expected: number) {
  const m = question.match(/(\d+(?:\.\d+)?)\s*×\s*(\d+(?:\.\d+)?)/)
  if (!m) return null
  const a = Number(m[1]), b = Number(m[2])
  const places = decimals(a) + decimals(b)
  if (places > 0) {
    for (const scale of [10, 100, 1000, 0.1, 0.01, 0.001]) {
      if (near(value * scale, expected)) return `The digits are right, but the decimal point is in the wrong place. ${m[1]} × ${m[2]} has ${places} decimal place${places === 1 ? '' : 's'} altogether, so count ${places} in from the right of the digits you multiplied.`
    }
    return null
  }
  if (!Number.isInteger(a) || !Number.isInteger(b)) return null
  const [big, small] = b < a ? [a, b] : [b, a]
  if (small >= 10 && small < 100) {
    const units = small % 10, tens = Math.floor(small / 10)
    if (value === big * units + big * tens) return `It looks like the second row is missing its place-holder zero. You're multiplying by ${tens * 10}, not ${tens}.`
    if (value === big * units && units) return `You only multiplied by ${units}. Multiply by ${tens * 10} as well, then add the two rows.`
  }
  if (small < 10) {
    // Forgetting to carry: every column writes only its units digit, except the last column, written in full.
    const digits = String(big).split('').map(Number)
    const noCarry = Number(digits.map((d, i) => String(i === 0 ? d * small : d * small % 10)).join(''))
    if (value === noCarry && value !== expected) return 'It looks like the carried digits were missed. When a column makes 10 or more, carry the tens into the next column.'
  }
  return null
}

function diagnoseFactors(question: string, value: number, expected: number) {
  const pair = question.match(/(?:HCF|LCM) of (\d+) and (\d+)/i) ?? question.match(/every (\d+) .*every (\d+)/i)
  if (!pair) return null
  const x = Number(pair[1]), y = Number(pair[2])
  const hcf = gcd(x, y), lcm = x * y / hcf
  const askingHcf = /HCF/i.test(question)
  if (askingHcf && value === lcm) return 'That’s the LCM (lowest common multiple). The HCF is the highest number that divides into both.'
  if (!askingHcf && value === hcf) return 'That’s the HCF (highest common factor). The LCM is the lowest number that both go into.'
  if (askingHcf && value > 0 && value < hcf && x % value === 0 && y % value === 0) return `${value} goes into both, but it isn't the highest. Look for a bigger number that divides ${x} and ${y}.`
  if (!askingHcf && value > lcm && value % x === 0 && value % y === 0) return `${show(value)} is a common multiple, but not the lowest one. Look for a smaller number in both times tables.`
  return null
}

const COLUMNS: [number, string][] = [[1000000, 'millions'], [100000, 'hundred thousands'], [10000, 'ten thousands'], [1000, 'thousands'], [100, 'hundreds'], [10, 'tens'], [0.1, 'tenths'], [0.01, 'hundredths'], [0.001, 'thousandths']]

/** "What is the value of the digit 3 in 7,364?" answered with the digit itself (3 instead of 300). */
function diagnosePlaceValue(question: string, value: number, expected: number) {
  if (!/value of (the )?digit/i.test(question) || !Number.isInteger(value) || value < 1 || value > 9) return null
  const column = COLUMNS.find(([size]) => near(value * size, expected))
  return column ? `That's the digit itself. Its value depends on its column: it's in the ${column[1]} column, so it's worth ${show(expected)}.` : null
}

export function diagnoseNumber(question: string, response: string, expectedText: string): string | null {
  const value = toNumber(response), expected = toNumber(expectedText)
  if (value === null || expected === null) return null
  if (near(value, expected) && !(expectedText.includes('.') && !response.includes('.'))) return null

  return diagnosePlaceValue(question, value, expected)
    ?? diagnoseRounding(question, response.trim(), value, expected, expectedText)
    ?? diagnosePercent(question, value, expected)
    ?? diagnoseFactors(question, value, expected)
    ?? diagnoseMultiplication(question, value, expected)
    ?? (/left over/i.test(question) && value === expected - 1
      ? `That leaves some left over. You need one more to fit them all in, so round up to ${expected}.`
      : null)
    ?? decimalPointSlip(value, expected)
}

function decimalPointSlip(value: number, expected: number) {
  if (expected === 0 || value === 0) return null
  for (const scale of [10, 100, 1000]) {
    if (near(value * scale, expected) || near(value, expected * scale)) return 'The digits are right, but the decimal point is in the wrong place.'
  }
  return null
}

/*
 * Explains *why* a fraction answer is wrong, in one or two plain sentences.
 * Fixed rules, no AI. It only speaks when it recognises the mistake; otherwise it returns null
 * and the lesson falls back to its usual "Not quite" message.
 */

type Fraction = { n: number; d: number }
type Written = Fraction & { whole?: number; mixed: boolean }

export type FractionDiagnosisInput = {
  question: string
  response: string
  expected: string
  requireSimplest?: boolean
  requireMixedForm?: boolean
  requiredDenominator?: number
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a))

function parse(text: string): Written | null {
  const clean = text.trim().replace(/\s+/g, ' ').replace(/\s*\/\s*/g, '/')
  let m = clean.match(/^(\d+) (\d+)\/(\d+)$/)
  if (m) {
    const whole = +m[1], n = +m[2], d = +m[3]
    return d ? { n: whole * d + n, d, whole, mixed: true } : null
  }
  m = clean.match(/^(\d+)\/(\d+)$/)
  if (m) return +m[2] ? { n: +m[1], d: +m[2], mixed: false } : null
  m = clean.match(/^\d+$/)
  if (m) return { n: +m[0], d: 1, mixed: false }
  return null
}

const same = (a: Fraction, b: Fraction) => a.n * b.d === b.n * a.d
const fmt = (f: Fraction) => (f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`)
function asMixed(f: Fraction) {
  const whole = Math.floor(f.n / f.d), rest = f.n % f.d
  return rest ? `${whole} ${rest}/${f.d}` : `${whole}`
}

/** Pull "a/b op c/d" out of the question, when it has exactly that shape. */
function operation(question: string) {
  const m = question.match(/(\d+)\/(\d+)\s*([+\-−×÷])\s*(\d+)\/(\d+)/)
  if (!m) return null
  return { a: { n: +m[1], d: +m[2] }, op: m[3] === '−' ? '-' : m[3], b: { n: +m[4], d: +m[5] } }
}

export function diagnoseFraction(input: FractionDiagnosisInput): string | null {
  const answer = parse(input.response)
  const expected = parse(input.expected)
  if (!answer || !expected) return null
  const { question } = input

  // Right value, wrong form.
  if (same(answer, expected)) {
    if (input.requiredDenominator && answer.d !== input.requiredDenominator) {
      return `That's equal to the answer, but the question wants a denominator of ${input.requiredDenominator}.`
    }
    if (input.requireMixedForm && !answer.mixed) {
      return `Right value, but the question wants a mixed number. ${answer.n} ÷ ${answer.d} = ${Math.floor(answer.n / answer.d)} remainder ${answer.n % answer.d}, so write ${asMixed(answer)}.`
    }
    if (answer.mixed && !expected.mixed && /improper/i.test(question)) {
      return `Right value, but the question wants an improper fraction. ${answer.whole} × ${answer.d} + ${answer.n - (answer.whole ?? 0) * answer.d} = ${answer.n}, so write ${answer.n}/${answer.d}.`
    }
    const fracPart = answer.mixed ? { n: answer.n - (answer.whole ?? 0) * answer.d, d: answer.d } : answer
    const g = gcd(fracPart.n, fracPart.d)
    if (input.requireSimplest && g > 1) {
      return `That's equal to the answer, but it isn't fully simplified. ${fracPart.n} and ${fracPart.d} can both still be divided by ${g}.`
    }
    return null
  }

  const op = operation(question)
  if (op?.op === '÷') {
    const { a, b } = op
    if (same(answer, { n: a.n * b.n, d: a.d * b.d })) {
      return `You multiplied the fractions. To divide, flip the second fraction (${b.n}/${b.d} becomes ${b.d}/${b.n}), then multiply.`
    }
    if (same(answer, { n: a.d * b.n, d: a.n * b.d })) {
      return `You flipped the first fraction. Keep the first fraction and flip the second one.`
    }
  }

  // Upside down.
  if (answer.n === expected.d && answer.d === expected.n && answer.n !== answer.d) {
    return `You've got it upside down. Check which number goes on top.`
  }

  // "Simplify n/d": unchanged, or top and bottom divided by different numbers.
  const simplify = question.match(/simplify (\d+)\/(\d+)/i)
  if (simplify) {
    const start = { n: +simplify[1], d: +simplify[2] }
    if (answer.n === start.n && answer.d === start.d) {
      return `That's the fraction you started with. Find a number that divides both ${start.n} and ${start.d}.`
    }
    if (!same(answer, start)) {
      return `${fmt(answer)} isn't equal to ${start.n}/${start.d}. Whatever you divide the top by, divide the bottom by the same number.`
    }
  }

  // Mixed to improper: added the whole number instead of multiplying.
  const toImproper = question.match(/write (\d+) (\d+)\/(\d+) as an improper/i)
  if (toImproper) {
    const w = +toImproper[1], n = +toImproper[2], d = +toImproper[3]
    if (answer.d === d && answer.n === w + n) return `You added ${w} + ${n}. Multiply the whole number by the denominator first: ${w} × ${d} = ${w * d}, then add ${n}.`
    if (answer.d === d && answer.n === w + d + n) return `You added the denominator. Multiply instead: ${w} × ${d} = ${w * d}, then add ${n}.`
  }

  // Adding, subtracting and multiplying two fractions.
  if (op) {
    const { a, b } = op
    const combinedDenominators = op.op === '+' ? a.d + b.d : op.op === '-' ? Math.abs(a.d - b.d) : 0
    if (combinedDenominators > 0 && answer.d === combinedDenominators) {
      return `You ${op.op === '+' ? 'added' : 'subtracted'} the denominators. Make the denominators the same first, then ${op.op === '+' ? 'add' : 'subtract'} only the numerators.`
    }
    if ((op.op === '+' || op.op === '-') && a.d !== b.d && answer.d === Math.max(a.d, b.d) && !same(answer, expected)) {
      return `The denominators are different, so change both fractions to a common denominator before you ${op.op === '+' ? 'add' : 'subtract'}.`
    }
    if (op.op === '×' && answer.d === b.d && answer.n === a.n * b.n && a.d === b.d) {
      return `When you multiply fractions, multiply the denominators too: ${a.d} × ${b.d} = ${a.d * b.d}.`
    }
  }

  return null
}

/** Fraction of an amount, e.g. "Find 5/8 of £96": spots stopping after one part, or dividing by the numerator. */
export function diagnoseAmount(question: string, response: string): string | null {
  const m = question.match(/(\d+)\/(\d+) of £?(\d+)/)
  const value = Number(response.replace(/[£,\s]/g, ''))
  if (!m || !Number.isFinite(value)) return null
  const n = +m[1], d = +m[2], amount = +m[3], unit = amount / d
  if (n !== 1 && value === unit) return `You found one part: ${amount} ÷ ${d} = ${unit}. Now take ${n} of those parts: ${unit} × ${n}.`
  if (value === amount / n) return `You divided by the top number. Divide by the bottom number (${d}) to find one part.`
  if (value === amount * n) return `Divide by ${d} first to find one part, then multiply by ${n}.`
  return null
}

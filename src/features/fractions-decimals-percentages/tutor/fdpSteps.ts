import { decimalDivision } from '../../decimals/tutor/decimalSteps'
import { line, part, says, sign, type StepLine, type StepWorking, type WorkedStep } from '../../written-methods/tutor/stepWorking'

/*
 * Lesson 9 conversions, one move a step (src/features/EXPLANATIONS.md). A fraction becomes a decimal by scaling to a
 * power of ten when that's quick (3/4 → 75/100), otherwise by dividing, shown as a bus stop. Percentages are × 100 and
 * ÷ 100; fractions are simplified one division at a time. Every number on screen comes from a line above it.
 */

const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a
const frac = (n: number | string, d: number | string) => `${n}/${d}`
const places = (value: string) => value.includes('.') ? value.split('.')[1].length : 0
/** Exact decimal text for n/d when it ends (the denominator's primes are only 2s and 5s). */
function exact(n: number, d: number) {
  for (let k = 0; k <= 6; k++) if ((n * 10 ** k) % d === 0) {
    const digits = String((n * 10 ** k) / d)
    if (!k) return digits
    const padded = digits.padStart(k + 1, '0')
    return `${padded.slice(0, -k)}.${padded.slice(-k)}`
  }
  throw new Error(`${n}/${d} does not end`)
}
/** The power of ten a denominator scales to with a small whole multiplier (4 → 100 by × 25), if there is one. */
function scaleTo(d: number) {
  for (const target of [10, 100, 1000]) if (target % d === 0 && target / d <= 25) return { target, by: target / d }
  return undefined
}
/** Moves the point in a decimal written as text: shift("4.5", -2) → "0.045", shift("0.056", 2) → "5.6". */
function shift(value: string, by: number) {
  const [i, dec = ''] = value.split('.')
  let digits = `${i}${dec}`, point = i.length + by
  if (point <= 0) { digits = `${'0'.repeat(1 - point)}${digits}`; point = 1 }
  if (point > digits.length) digits = digits.padEnd(point, '0')
  const out = `${digits.slice(0, point)}.${digits.slice(point)}`.replace(/^0+(?=\d)/, '')
  return out.includes('.') ? out.replace(/0+$/, '').replace(/\.$/, '') : out
}
const times100 = (value: string) => shift(value, 2)
const over100 = (value: string) => shift(value, -2)

/** Simplify a fraction one division at a time (by the HCF), writing the top and bottom. */
function simplifySteps(n: number, d: number, answer: boolean): WorkedStep[] {
  const h = gcd(n, d)
  if (h === 1) return []
  return [{
    title: 'Simplify', why: 'Divide the top and the bottom by the biggest number that goes into both.',
    lines: [says(`${n} ÷ ${h} → ${n / h}`), says(`${d} ÷ ${h} → ${d / h}`), line([part(frac(n, d))], frac(n / h, d / h), { eq: true, answer })],
  }]
}

/** Fraction → decimal: scale to 10, 100 or 1000 when quick, otherwise divide the top by the bottom (bus stop). */
export function fractionToDecimalSteps(n: number, d: number, answer = true): WorkedStep[] {
  const value = exact(n, d), scale = scaleTo(d)
  if (scale) return [
    { title: `Over ${scale.target}`, why: 'Multiply the top and the bottom by the same number, so the fraction keeps its size.', lines: [says(`${scale.target} ÷ ${d} → ${scale.by}`), line([part(n), sign('×'), part(scale.by, 3)], n * scale.by)] },
    { title: 'Write the decimal', why: `Out of ${scale.target} means ${scale.target === 10 ? 'tenths' : scale.target === 100 ? 'hundredths' : 'thousandths'}.`, lines: [line([part(frac(n * scale.by, scale.target))], value, { answer })] },
  ]
  const division = decimalDivision(`${n}.${'0'.repeat(places(value))}`, String(d))
  const steps: WorkedStep[] = [{ title: 'Divide top by bottom', why: 'A fraction bar means divide. Add zeros after the point so the division can carry on.', picture: division.opening, lines: [says(`${frac(n, d)} → ${n} ÷ ${d}`)] }, ...division.steps]
  const end = steps[steps.length - 1]
  if (!answer && end.picture?.kind === 'bus-stop') steps[steps.length - 1] = { ...end, picture: { ...end.picture, done: false } }
  return steps
}
export const fractionToDecimal = (n: number, d: number, round?: number): StepWorking => {
  const steps = fractionToDecimalSteps(n, d, !round)
  if (round !== undefined) {
    const value = exact(n, d), kept = value.slice(0, value.indexOf('.') + round + 1), next = Number(value[value.indexOf('.') + round + 1])
    const rounded = (Math.round(Number(value) * 10 ** round) / 10 ** round).toFixed(round)
    steps.push({ title: `Round to ${round} places`, why: 'Look at the next digit: 5 or more rounds up, less than 5 keeps the digit.', lines: [line([part(kept, 0), sign('|'), part(value.slice(kept.length), 1)], rounded, { answer: true, mark: next >= 5 ? 'round up' : 'keep' })] })
  }
  return { kind: 'step-worked', ...(steps[0].picture ? { opening: steps[0].picture } : { start: frac(n, d) }), steps }
}

/** Decimal → fraction: over 10, 100 or 1000 by the number of decimal places, then simplify. */
export function decimalToFraction(value: string): StepWorking {
  const p = places(value), d = 10 ** p, n = Math.round(Number(value) * d)
  const simplify = simplifySteps(n, d, true)
  return { kind: 'step-worked', start: value, trail: true, steps: [
    { title: `Write it over ${d}`, why: `${p} decimal place${p === 1 ? '' : 's'} means ${d === 10 ? 'tenths' : d === 100 ? 'hundredths' : 'thousandths'}.`, lines: [line([part(value)], frac(n, d), { answer: !simplify.length })] },
    ...simplify,
  ] }
}

/** Decimal → percentage: × 100. */
export const decimalToPercentage = (value: string): StepWorking => ({ kind: 'step-worked', start: value, steps: [
  { title: 'Multiply by 100', why: 'Per cent means out of 100, so multiply by 100. The digits move two places left.', lines: [line([part(value), sign('×'), part(100, 3)], `${times100(value)}%`, { answer: true })] },
] })

/** Percentage → decimal: ÷ 100. */
export const percentageToDecimal = (value: string, first?: StepLine): StepWorking => ({ kind: 'step-worked', start: first ? undefined : `${value}%`, trail: Boolean(first), steps: [
  ...(first ? [{ title: 'Work out the top', why: 'Work out the fraction first.', lines: [first] }] : []),
  { title: 'Divide by 100', why: 'Per cent means out of 100, so divide by 100. The digits move two places right.', lines: [line([part(`${value}%`), sign('÷'), part(100, 3)], over100(value), { answer: true })] },
] })

/** Fraction → percentage: out of 100 when the bottom goes into 100, otherwise as a decimal first, then × 100. */
export function fractionToPercentage(n: number, d: number): StepWorking {
  if (100 % d === 0) return { kind: 'step-worked', start: frac(n, d), steps: [
    { title: 'Over 100', why: 'Per cent means out of 100. Multiply the top and the bottom by the same number.', lines: [says(`100 ÷ ${d} → ${100 / d}`), line([part(n), sign('×'), part(100 / d, 3)], n * 100 / d)] },
    { title: 'Write the percentage', why: 'Out of 100 is per cent.', lines: [line([part(frac(n * 100 / d, 100))], `${n * 100 / d}%`, { answer: true })] },
  ] }
  const value = exact(n, d), steps = fractionToDecimalSteps(n, d, false)
  return { kind: 'step-worked', ...(steps[0].picture ? { opening: steps[0].picture } : { start: frac(n, d) }), steps: [
    ...steps,
    { title: 'Multiply by 100', why: 'Per cent means out of 100, so multiply by 100.', lines: [line([part(value), sign('×'), part(100, 3)], `${times100(value)}%`, { answer: true })] },
  ] }
}

/** Percentage → fraction: over 100 (clearing a decimal), then simplify. */
export function percentageToFraction(value: string): StepWorking {
  const p = places(value), scale = 10 ** p, n = Math.round(Number(value) * scale), d = 100 * scale
  const simplify = simplifySteps(n, d, true)
  const lines: StepLine[] = [line([part(`${value}%`)], frac(value, 100))]
  if (p) lines.push(line([part(frac(value, 100)), sign('×'), part(scale, 3)], frac(n, d)))
  lines[lines.length - 1].answer = !simplify.length
  return { kind: 'step-worked', start: `${value}%`, trail: true, steps: [
    { title: 'Write it over 100', why: p ? 'Per cent means out of 100. Multiply the top and bottom by 10 to clear the point.' : 'Per cent means out of 100.', lines },
    ...simplify,
  ] }
}

/** A missing number in a conversion, found by one multiplication or by simplifying. */
export const findN = (start: string, steps: WorkedStep[]): StepWorking => ({ kind: 'step-worked', start, trail: true, steps })
export { frac as fraction, exact as exactDecimal, line, part, says, sign }

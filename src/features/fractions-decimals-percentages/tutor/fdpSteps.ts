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

const factorsOf = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter(f => n % f === 0)
/**
 * Simplify: first find the HCF from the factors of the top and the bottom (the shared ones marked, the HCF boxed), then
 * divide the top and the bottom by it.
 */
function simplifySteps(n: number, d: number, answer: boolean): WorkedStep[] {
  const h = gcd(n, d)
  if (h === 1) return []
  const top = factorsOf(n), bottom = factorsOf(d), shared = top.filter(f => bottom.includes(f))
  return [{
    title: 'Find the HCF', why: 'List the factors of the top and the bottom. The biggest number in both lists is the highest common factor: the biggest number you can divide both by.',
    picture: { kind: 'lists', lists: [{ label: `Factors of ${n}`, values: top, shared, pick: h }, { label: `Factors of ${d}`, values: bottom, shared, pick: h }] },
    lines: [line([part('HCF')], h)],
  }, {
    title: 'Divide top and bottom', why: 'Dividing the top and the bottom by the same number keeps the fraction the same size.',
    lines: [says(`${n} ÷ ${h} → ${n / h}`), says(`${d} ÷ ${h} → ${d / h}`), line([part(frac(n, d))], frac(n / h, d / h), { eq: true, answer })],
  }]
}

const columnName = (power: number) => power === 1 ? 'tenths' : power === 2 ? 'hundredths' : 'thousandths'

/**
 * Make the bottom 10, 100 or 1000 (or any target): how many of the bottom make the target, then multiply the top and the
 * bottom by that, so "100 ÷ 20 → 5" has a reason and "7 × 5" has a reason.
 */
export function makeBottomSteps(n: number, d: number, target: number, reason: string): WorkedStep[] {
  const by = target / d
  return [
    { title: `Make the bottom ${target}`, why: `${reason} Work out how many ${d}s make ${target}: divide ${target} by ${d}.`, lines: [says(`${target} ÷ ${d} → ${by}`)] },
    { title: 'Multiply top and bottom', why: 'Multiply the top by the same number as the bottom, so the fraction keeps its size.', lines: [line([part(n), sign('×'), part(by, 3)], n * by), line([part(d), sign('×'), part(by, 3)], target), line([part(frac(n, d))], frac(n * by, target), { eq: true })] },
  ]
}

/** Fraction → decimal: scale to 10, 100 or 1000 when quick, otherwise divide the top by the bottom (bus stop). */
export function fractionToDecimalSteps(n: number, d: number, answer = true): WorkedStep[] {
  const value = exact(n, d), scale = scaleTo(d)
  if (scale) {
    const p = places(value)
    return [
      ...makeBottomSteps(n, d, scale.target, 'Decimals count in tenths, hundredths and thousandths, so make the bottom 10, 100 or 1000.'),
      { title: 'Write the decimal', why: `The last digit goes in the ${columnName(p)} column.`, picture: { kind: 'place', value, boxed: p - 1 }, lines: [line([part(frac(n * scale.by, scale.target))], value, { answer })] },
    ]
  }
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
  return { kind: 'step-worked', ...(steps[0].picture ? { opening: steps[0].picture } : { start: frac(n, d), trail: true }), steps }
}

/** Decimal → fraction: over 10, 100 or 1000 by the number of decimal places, then simplify. */
export function decimalToFraction(value: string): StepWorking {
  const p = places(value), d = 10 ** p, n = Math.round(Number(value) * d)
  const simplify = simplifySteps(n, d, true)
  const over = overPowerSteps(value)
  over[1].lines![0].answer = !simplify.length
  return { kind: 'step-worked', start: value, trail: true, steps: [...over, ...simplify] }
}
/** 0.84 → 84 hundredths → 84/100: the place value first, because the last digit's column is why the bottom is 100. */
export function overPowerSteps(value: string): WorkedStep[] {
  const p = places(value), d = 10 ** p, n = Math.round(Number(value) * d), name = columnName(p)
  return [
    { title: 'Find the last column', why: 'The columns after the point are tenths, hundredths, then thousandths. The column of the last digit says what the fraction is out of.', picture: { kind: 'place', value, boxed: p - 1 }, lines: [line([part(value)], `${n} ${name}`)] },
    { title: `Write it over ${d}`, why: `${name[0].toUpperCase()}${name.slice(1)} means out of ${d}, so the bottom is ${d}.`, lines: [line([part(`${n} ${name}`)], frac(n, d))] },
  ]
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
  if (100 % d === 0) return { kind: 'step-worked', start: frac(n, d), trail: true, steps: [
    ...makeBottomSteps(n, d, 100, 'Per cent means out of 100, so make the bottom 100.'),
    { title: 'Write the percentage', why: 'A number out of 100 is that many per cent.', lines: [line([part(frac(n * 100 / d, 100))], `${n * 100 / d}%`, { answer: true })] },
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
  const over: WorkedStep = { title: 'Write it over 100', why: 'Per cent means out of 100.', lines: [line([part(`${value}%`)], frac(value, 100), { answer: !p && !simplify.length })] }
  const clear: WorkedStep[] = p ? [{ title: 'Clear the point', why: 'A fraction needs whole numbers. Multiply the top and the bottom by 10, so the fraction keeps its size.', lines: [line([part(value), sign('×'), part(scale, 3)], n), line([part(100), sign('×'), part(scale, 3)], d), line([part(frac(value, 100))], frac(n, d), { eq: true, answer: !simplify.length })] }] : []
  return { kind: 'step-worked', start: `${value}%`, trail: true, steps: [over, ...clear, ...simplify] }
}

/** A missing number in a conversion, found by one multiplication or by simplifying. */
export const findN = (start: string, steps: WorkedStep[]): StepWorking => ({ kind: 'step-worked', start, trail: true, steps })
export { frac as fraction, exact as exactDecimal, simplifySteps, line, part, says, sign }

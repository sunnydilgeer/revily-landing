/*
 * Explains why a standard form answer is wrong, in one plain sentence. Fixed rules, no AI.
 * Returns null when it does not recognise the mistake, so the lesson falls back to the hint.
 */
import { parseStandardForm } from '../../number-types/lessonMath'

const SUPERSCRIPT: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
export const sup = (n: number) => String(n).split('').map(c => SUPERSCRIPT[c]).join('')
const tidy = (n: number) => Number(n.toPrecision(12))
/** 3 × 10⁸, with A written as briefly as possible. */
export const sf = (a: number, n: number) => `${tidy(a)} × 10${sup(n)}`
const near = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b))
const exact = (a: number, n: number) => Number(`${tidy(a)}e${n}`)
const places = (n: number) => `${Math.abs(n)} place${Math.abs(n) === 1 ? '' : 's'}`

/** Writes a number in standard form: A with 1 ≤ A < 10, and its power. */
export function normalise(value: number) {
  const n = Math.floor(Math.log10(Math.abs(value)) + 1e-12)
  return { a: tidy(value / 10 ** n), n }
}

const toNumber = (text: string) => {
  const clean = text.trim().replace(/[£,\s]/g, '').replace(/·/g, '.').replace(/(km|cm|mm|m|g)$/i, '')
  return /^-?\d*\.?\d+$/.test(clean) ? Number(clean) : null
}

/** "Write a × 10ⁿ as an ordinary number." */
export function diagnoseOrdinary(response: string, { a, n }: { a: number; n: number }): string | null {
  const answer = toNumber(response)
  if (answer === null) return null
  const expected = exact(a, n)
  if (near(answer, expected)) return null
  if (near(answer, exact(a, -n))) return n > 0
    ? `That moved the point left. A positive power makes the number bigger, so hop the point ${places(n)} right.`
    : `That moved the point right. A negative power makes the number smaller, so hop the point ${places(n)} left.`
  if (n > 0 && !Number.isInteger(a)) {
    const appended = Number(String(a).replace('.', '') + '0'.repeat(n))
    if (near(answer, appended)) return `That adds ${n} zeros after the digits. Hop the point ${places(n)} instead. The digits after the point use up some of the hops.`
  }
  if (n < 0 && near(answer, exact(a, n - 1))) return `Count the hops, not the zeros. The point hops ${places(n)}, so there are ${-n - 1} zeros straight after the point.`
  if (near(answer, exact(a, n - 1)) || near(answer, exact(a, n + 1))) return `Count again. The point hops exactly ${places(n)} ${n > 0 ? 'right' : 'left'}. Fill each empty place with a 0.`
  return null
}

type Operation = { kind: 'multiply' | 'divide'; first: [number, number]; second: [number, number] }
export type StandardFormCheck = { a: number; n: number; operation?: Operation }

/** Any question whose answer is a number in standard form. */
export function diagnoseStandardForm(response: string, { a, n, operation }: StandardFormCheck): string | null {
  const answer = parseStandardForm(response)
  if (answer === null) return null
  if (answer.a === a && answer.n === n) return null
  const value = exact(answer.a, answer.n)

  // The right size, but A is not between 1 and 10.
  if (near(value, exact(a, n)) && (answer.a >= 10 || answer.a < 1)) {
    const shift = n - answer.n
    return answer.a >= 10
      ? `${tidy(answer.a)} is 10 or more, so this isn’t standard form yet. ${tidy(answer.a)} = ${sf(a, shift)}, so the answer is ${sf(a, n)}.`
      : `${tidy(answer.a)} is less than 1, so this isn’t standard form yet. ${tidy(answer.a)} = ${sf(a, shift)}, so the answer is ${sf(a, n)}.`
  }
  if (answer.a < 1 || answer.a >= 10) return 'In standard form, the first number must be at least 1 and less than 10.'

  if (operation) {
    const [[a1, n1], [a2, n2]] = [operation.first, operation.second]
    if (operation.kind === 'multiply') {
      if (answer.n === n1 * n2 && n1 * n2 !== n1 + n2) return `Add the powers when you multiply: ${n1} + ${n2} = ${n1 + n2}. Don’t multiply them.`
      if (near(answer.a, a1 + a2) && a1 + a2 !== tidy(a1 * a2)) return `Multiply the numbers in front, don’t add them: ${tidy(a1)} × ${tidy(a2)} = ${tidy(a1 * a2)}.`
      const product = tidy(a1 * a2)
      if (product >= 10 && answer.a === a && answer.n === n1 + n2) return `${tidy(a1)} × ${tidy(a2)} = ${product}. Writing ${product} as ${a} × 10 adds 1 to the power: ${n1 + n2} + 1 = ${n}.`
    } else {
      if (answer.n === n2 - n1 && n1 !== n2) return `Always do the first power minus the second: ${n1} − ${n2} = ${n1 - n2}.`
      if (answer.n === n1 + n2) return `Subtract the powers when you divide: ${n1} − ${n2} = ${n1 - n2}. Don’t add them.`
      const quotient = tidy(a1 / a2)
      if (quotient < 1 && answer.a === a && answer.n === n1 - n2) return `${tidy(a1)} ÷ ${tidy(a2)} = ${quotient}. Writing ${quotient} as ${a} × 10${sup(-1)} takes 1 off the power: ${n1 - n2} − 1 = ${n}.`
      if (near(answer.a, a2 / a1) && !near(a2 / a1, a1 / a2)) return `Divide the first number by the second: ${tidy(a1)} ÷ ${tidy(a2)}, not the other way round.`
    }
    return null
  }

  // Writing an ordinary number in standard form.
  if (answer.a === a && answer.n === -n) return n > 0 ? 'A large number has a positive power.' : 'A number less than 1 has a negative power.'
  if (answer.a === a && answer.n === n + 1) return n > 0
    ? `Count the hops, not the digits. The point hops ${places(n)}: one less than the number of digits in front of it.`
    : `Count the hops, not the zeros. The point hops ${places(n)}: one more than the zeros after the point.`
  if (answer.a === a && Math.abs(answer.n - n) === 1) return `Count again: the point hops exactly ${places(n)} to reach ${tidy(a)}.`
  const digits = (x: number) => String(x).replace('.', '')
  if (answer.a !== a && digits(answer.a).replace(/0/g, '') === digits(a).replace(/0/g, '')) return `Keep every zero that sits between the other digits: ${tidy(a)}.`
  return null
}

/** "Write down a number in standard form between lower and upper." */
export function diagnoseBetween(response: string, { lower, upper, n }: { lower: number; upper: number; n: number }): string | null {
  const answer = parseStandardForm(response)
  if (answer === null) return null
  if (answer.a < 1 || answer.a >= 10) return 'In standard form, the first number must be at least 1 and less than 10.'
  if (answer.value > lower && answer.value < upper) return null
  if (answer.value === lower || answer.value === upper) return `That’s exactly ${answer.value.toLocaleString('en-GB', { maximumFractionDigits: 12 }).replace(/,/g, ' ')}. Pick a number strictly between the two, such as 5 × 10${sup(n)}.`
  return `Every number between these two has the power ${n}, for example 5 × 10${sup(n)}.`
}

/** "n × 10ᵏ = …. Work out n." n must be at least 1 and less than 10. */
export function diagnoseMultiplier(response: string, expected: number): string | null {
  const answer = toNumber(response)
  if (answer === null || near(answer, expected)) return null
  if (answer >= 10 || answer < 1) return `n must be at least 1 and less than 10. Hop the point until only one non-zero digit is in front of it: ${expected}.`
  return null
}

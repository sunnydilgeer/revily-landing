/*
 * Explains why an index-laws answer is wrong, in one plain sentence. Fixed rules, no AI.
 * Works from the question's own numbers, so it can name the slip: powers multiplied instead of added,
 * the base changed, the powers taken away the wrong way round. Returns null for a mistake it doesn't
 * recognise, so the lesson falls back to the hint.
 */
import { parsePower, readTerms } from '../../number-types/lessonMath'

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
/** 7 → ⁷, −3 → ⁻³. */
export const sup = (n: number) => `${n < 0 ? '⁻' : ''}${[...String(Math.abs(n))].map(d => SUP[Number(d)]).join('')}`
/** A power as students write it: 10⁷, x¹, 7⁻³. */
export const pow = (base: string | number, power: number) => `${base}${sup(power)}`

export type Law = 'multiply' | 'divide' | 'power'
const combine = (law: Law, a: number, b: number) => law === 'multiply' ? a + b : law === 'divide' ? a - b : a * b
const sign = (n: number) => n < 0 ? `(${n})`.replace('-', '−') : String(n)
const rule = (law: Law, a: number, b: number) => law === 'multiply' ? `add the powers: ${a} + ${sign(b)} = ${a + b}`
  : law === 'divide' ? `subtract the powers: ${a} − ${sign(b)} = ${a - b}`
  : `multiply the powers: ${sign(a)} × ${b} = ${a * b}`

/** "Write … as a single power": base^a (law) base^b. */
export function diagnosePower(response: string, base: string | number, law: Law, a: number, b: number): string | null {
  const answer = combine(law, a, b), wanted = String(base)
  const given = parsePower(response)
  if (!given) {
    const value = Number(String(response).replace(/[\s,]/g, ''))
    if (Number.isFinite(value) && String(response).trim() && value === Number(wanted) ** answer) return `That’s the value, but the question asks for a single power. Write it as ${pow(base, answer)}.`
    return null
  }
  if (given.base === wanted && given.power === answer) return null
  const n = Number(wanted)
  // The base changed: 3⁴ × 3² → 9⁶, 4⁷ ÷ 4² → 1⁵, 10³ × 10⁴ → 100⁷.
  if (given.base !== wanted) {
    if (law === 'multiply' && Number(given.base) === n * n) return `The base stays as ${base}. You don’t multiply the ${base}s together: only the powers change, so ${rule(law, a, b)}.`
    if (law === 'divide' && given.base === '1') return `The base stays as ${base}. ${base} ÷ ${base} isn’t part of it: only the powers change, so ${rule(law, a, b)}.`
    return `The base stays as ${base}. Only the power changes: ${rule(law, a, b)}.`
  }
  const p = given.power
  if (law === 'multiply' && p === a * b) return `You multiplied the powers. When you multiply powers of the same base, ${rule(law, a, b)}.`
  if (law === 'power' && p === a + b) return `You added the powers. For a power of a power, ${rule(law, a, b)}. Adding is for two powers multiplied together.`
  if (law === 'divide' && b !== 0 && p === a / b) return `You divided the powers. When you divide powers of the same base, ${rule(law, a, b)}.`
  if (law === 'divide' && p === a + b) return `You added the powers. When you divide, ${rule(law, a, b)}.`
  if (law === 'divide' && p === b - a) return `Take the bottom power from the top one: ${a} − ${b} = ${a - b}, not ${b} − ${a}.`
  if (p === -answer) return `Check the sign: ${rule(law, a, b)}.`
  return null
}

/** One term such as 15a⁶ or 3a⁻⁴b, as its number in front and each letter's power. */
type Monomial = { coefficient: number; powers: Map<string, number> }
function monomial(text: string): Monomial | null {
  const terms = readTerms(text)
  if (!terms || terms.length !== 1) return null
  const powers = new Map<string, number>()
  for (const [, letter, power] of terms[0].key.matchAll(/([a-z])(?:\^(-?\d+))?/g)) powers.set(letter, Number(power ?? 1))
  return { coefficient: terms[0].coefficient, powers }
}

/**
 * "Simplify 5a⁴ × 3a²" or "20x⁶y⁵ ÷ 4x²y": numbers and each letter are worked out separately.
 * Names the first part that went wrong: the numbers added, a letter's powers multiplied, a lone letter taken as power 0.
 */
export function diagnoseTerms(response: string, first: string, second: string, law: 'multiply' | 'divide'): string | null {
  const got = monomial(response), x = monomial(first), y = monomial(second)
  if (!got || !x || !y) return null
  const numbers = law === 'multiply' ? x.coefficient * y.coefficient : x.coefficient / y.coefficient
  const [op, word] = law === 'multiply' ? ['×', 'Multiply'] : ['÷', 'Divide']
  if (got.coefficient !== numbers) {
    if (law === 'multiply' && got.coefficient === x.coefficient + y.coefficient) return `${word} the numbers: ${x.coefficient} ${op} ${y.coefficient} = ${numbers}. They aren’t added.`
    if (law === 'divide' && got.coefficient === x.coefficient - y.coefficient) return `${word} the numbers: ${x.coefficient} ${op} ${y.coefficient} = ${numbers}. They aren’t subtracted.`
    return `${word} the numbers first: ${x.coefficient} ${op} ${y.coefficient} = ${numbers}.`
  }
  for (const letter of new Set([...x.powers.keys(), ...y.powers.keys()])) {
    const a = x.powers.get(letter) ?? 0, b = y.powers.get(letter) ?? 0
    const answer = law === 'multiply' ? a + b : a - b
    const p = got.powers.get(letter) ?? 0
    if (p === answer) continue
    if (!a || !b) return `${letter} only appears once, so it stays as ${pow(letter, a || (law === 'multiply' ? b : -b)).replace(/¹$/, '')}.`
    const lone = [[first, a], [second, b]].find(([text, n]) => n === 1 && new RegExp(`${letter}(?![⁰¹²³⁴⁵⁶⁷⁸⁹^])`).test(String(text)))
    if (lone && p === (law === 'multiply' ? a + b - 1 : a - b + 1)) return `On its own, ${letter} means ${letter}¹. So ${rule(law, a, b).replace('the powers', `the powers of ${letter}`)}.`
    if (law === 'multiply' && p === a * b) return `You multiplied the powers of ${letter}. When you multiply, ${rule(law, a, b).replace('the powers', `the powers of ${letter}`)}.`
    if (law === 'divide' && p === a + b) return `When you divide, ${rule(law, a, b).replace('the powers', `the powers of ${letter}`)}.`
    if (p === -answer) return `Check the sign on ${letter}: ${rule(law, a, b).replace('the powers', `the powers of ${letter}`)}.`
    return `Work out ${letter} on its own: ${rule(law, a, b).replace('the powers', `the powers of ${letter}`)}.`
  }
  return null
}

/** A wrong answer that a question expects, with what to say about it. Answers are compared without spaces. */
export function diagnoseKnown(response: string, known: [string, string][]): string | null {
  const clean = (text: string) => text.toLowerCase().replace(/[\s,]/g, '').replace(/−/g, '-').replace(/·/g, '.')
  return known.find(([wrong]) => clean(wrong) === clean(response))?.[1] ?? null
}

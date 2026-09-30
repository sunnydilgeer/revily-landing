/*
 * Factorising into a single bracket: the common factor, each term divided by it, and one plain sentence on why an
 * answer is wrong. Fixed rules, no AI. A wrong answer is expanded back out and compared with the question term by
 * term, so the message can name the slip: a factor still shared inside the bracket, a term lost (5 ÷ 5 = 1), a sign
 * flipped, a term not divided properly. Returns null when no slip fits, so the lesson falls back to the hint.
 */
import { collect, prettyKey, readFactorised, readTerms, sameFactorised, type Term } from '../../number-types/lessonMath'
import { show, terms, times } from '../../expanding/tutor/expandingDiagnosis'

const powersOf = (key: string) => new Map([...key.matchAll(/([a-z])(?:\^(-?\d+))?/g)].map(([, letter, power]) => [letter, Number(power ?? 1)]))
const keyOf = (powers: Map<string, number>) => [...powers].filter(([, power]) => power !== 0).sort(([a], [b]) => a.localeCompare(b)).map(([letter, power]) => power === 1 ? letter : `${letter}^${power}`).join('')
const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b)

/** The biggest factor of every term: the highest common factor of the numbers, and each letter every term has, to its lowest power. */
export function commonFactor(list: Term[]): Term {
  const number = list.map(term => term.coefficient).reduce(gcd)
  const letters = new Map<string, number>()
  for (const [letter] of powersOf(list[0].key)) {
    const lowest = Math.min(...list.map(term => powersOf(term.key).get(letter) ?? 0))
    if (lowest > 0) letters.set(letter, lowest)
  }
  return { coefficient: number, key: keyOf(letters) }
}

/** 6x² ÷ 3x = 2x: numbers divide, powers of each letter subtract. */
export function divide(a: Term, b: Term): Term {
  const powers = powersOf(a.key)
  for (const [letter, power] of powersOf(b.key)) powers.set(letter, (powers.get(letter) ?? 0) - power)
  return { coefficient: a.coefficient / b.coefficient, key: keyOf(powers) }
}

/** "x^2y" → ["x", "x", "y"]: every letter written out, one copy per power. */
const lettersOf = (key: string) => [...powersOf(key)].flatMap(([letter, power]) => Array<string>(power).fill(letter))
const number = (n: number) => n < 0 ? `−${-n}` : String(n)

/**
 * A term split into the common factor's number, what's left of the number, then each letter: 6x² → 3 × 2 × x × x.
 * With `mark`, the parts of the common factor are in [brackets], which the working draws boxed: [3] × 2 × [x] × x.
 */
export function split(term: Term, factor: Term, mark = false) {
  const rest = term.coefficient / factor.coefficient
  const box = (part: string) => mark ? `[${part}]` : part
  const numbers = factor.coefficient === 1 ? [number(term.coefficient)] : [box(number(factor.coefficient)), number(rest)]
  const shared = powersOf(factor.key)
  const letters = lettersOf(term.key).map(letter => { const left = shared.get(letter) ?? 0; shared.set(letter, left - 1); return left > 0 ? box(letter) : letter })
  // A lone 1 only shows when there are no letters: 5 = 5 × 1, but 4xy = 4 × x × y.
  const shown = letters.length ? numbers.filter(n => n !== '1') : numbers
  return [...(shown.length ? shown : [number(term.coefficient)]), ...letters].join(' × ')
}

/** How one box is divided, numbers then letters: "6 ÷ 3 and x² ÷ x". */
export function division(term: Term, factor: Term) {
  const parts = []
  if (factor.coefficient !== 1) parts.push(`${number(term.coefficient)} ÷ ${factor.coefficient}`)
  if (factor.key) parts.push(`${prettyKey(term.key)} ÷ ${prettyKey(factor.key)}`)
  return parts.join(' and ')
}

/** "3 and x", "5, p and q": the parts of the common factor, as the working names them. */
export function factorParts(factor: Term) {
  const parts = [...(factor.coefficient !== 1 ? [String(factor.coefficient)] : []), ...[...powersOf(factor.key)].map(([letter, power]) => prettyKey(power === 1 ? letter : `${letter}^${power}`))]
  return parts.length < 2 ? parts.join('') : `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`
}

const listed = (list: Term[]) => { const shown = list.map(term => show(term)); return `${shown.slice(0, -1).join(', ')} and ${shown.at(-1)}` }
const sameTerm = (a: Term, b: Term) => a.key === b.key && Math.abs(a.coefficient - b.coefficient) < 1e-9
function same(given: Term[], wanted: Term[]) {
  const a = collect(given), b = collect(wanted)
  return a.size === b.size && [...b].every(([key, value]) => Math.abs((a.get(key) ?? NaN) - value) < 1e-9)
}

/** Why a "factorise fully" answer is wrong, from the question and its fully factorised answer. */
export function diagnoseFactorise(response: string, question: string, answer: string): string | null {
  if (sameFactorised(response, answer)) return null
  const asked = terms(question), wanted = readFactorised(answer)!
  const given = readFactorised(response)
  if (!given) {
    const flat = readTerms(response)
    if (flat && same(flat, asked)) return `That’s the expression you started with. Take out the common factor and write what’s left inside a bracket.`
    return flat ? `Write it with a bracket: the common factor outside, and what’s left of each term inside.` : null
  }
  const { outside, inside } = given
  const products = inside.map(term => times(outside, term))
  // It expands to the question but wasn't accepted: something is still shared inside the bracket.
  if (same(products, asked)) {
    const left = commonFactor(inside)
    if (left.coefficient === 1 && !left.key) return null
    return `Not fully factorised: ${listed(inside)} still share ${show(left)}. Take that out too, so ${show(wanted.outside)} goes outside.`
  }
  const extra = products.map((product, i) => ({ product, term: inside[i], i })).filter(({ product }) => !asked.some(term => sameTerm(term, product)))
  const lost = asked.filter(term => !products.some(product => sameTerm(term, product)))
  // A term left out of the bracket: 5(2x + 3y) for 10x + 15y + 5.
  if (!extra.length && lost.length) {
    const term = lost[0]
    return `A term is missing. Expand your answer and ${show(term)} has gone: ${show(term)} ÷ ${show(outside)} = ${show(divide(term, outside))}, and it keeps its place in the bracket.`
  }
  // A sign flipped: 7y(2y + 3) for 14y² − 21y.
  const flipped = extra.find(({ product }) => asked.some(term => term.key === product.key && Math.abs(term.coefficient + product.coefficient) < 1e-9))
  if (flipped) return `Check the signs: ${show(outside)} × ${show(flipped.term)} = ${show(flipped.product)}, but the question has ${show({ ...flipped.product, coefficient: -flipped.product.coefficient })}. Each term keeps its sign inside the bracket.`
  // Anything else: expand the answer and name the box that doesn't match.
  if (extra.length) {
    // Students keep the question's order, so the box in the same place is the one it should give back.
    const { product, term, i } = extra[0], target = (lost.includes(asked[i]) ? asked[i] : undefined) ?? lost.find(t => t.key === product.key) ?? lost[0]
    if (!target) return `Expand to check: ${show(outside)} × ${show(term)} = ${show(product)}, which isn’t in the question. The common factor has to go into every term.`
    const next = sameTerm(outside, wanted.outside) ? `Divide each term by ${show(outside)}: ${show(target)} ÷ ${show(outside)} = ${show(divide(target, outside))}.` : `Each term in the bracket, times ${show(outside)}, has to give back a term of the question.`
    return `Expand to check: ${show(outside)} × ${show(term)} = ${show(product)}, not ${show(target)}. ${next}`
  }
  return null
}

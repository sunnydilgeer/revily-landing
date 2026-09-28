/*
 * Expanding brackets: every product worked out term by term, and one plain sentence on why an answer is wrong.
 * Fixed rules, no AI. A wrong answer is matched against the usual slips, each applied to one product at a time:
 * a term inside left unmultiplied, a sign flipped, the numbers not multiplied, a letter times itself not squared,
 * the middle products missed, the last numbers added. Returns null when no slip fits, so the lesson falls back to the hint.
 */
import { collect, prettyTerm, readTerms, type Term } from '../../number-types/lessonMath'

const powersOf = (key: string) => new Map([...key.matchAll(/([a-z])(?:\^(-?\d+))?/g)].map(([, letter, power]) => [letter, Number(power ?? 1)]))
const keyOf = (powers: Map<string, number>) => [...powers].filter(([, power]) => power !== 0).sort(([a], [b]) => a.localeCompare(b)).map(([letter, power]) => power === 1 ? letter : `${letter}^${power}`).join('')

export function times(a: Term, b: Term): Term {
  const powers = powersOf(a.key)
  for (const [letter, power] of powersOf(b.key)) powers.set(letter, (powers.get(letter) ?? 0) + power)
  return { coefficient: a.coefficient * b.coefficient, key: keyOf(powers) }
}

export const terms = (text: string) => {
  const read = readTerms(text)
  if (!read) throw new Error(`Cannot read ${text}`)
  return read
}

/** One multiplication: each term of `side` times each term of `top`, row by row. */
export type Grid = { side: Term[]; top: Term[] }
export const products = (grids: Grid[]) => grids.flatMap(({ side, top }) => side.flatMap(a => top.map(b => ({ a, b, product: times(a, b) }))))

/** "−4a", "+ 12": a term as written in a sum. */
export const show = (term: Term, first = true) => prettyTerm(term, first)
const signed = (term: Term) => term.coefficient < 0 ? show(term) : `+${show(term)}`

function same(given: Map<string, number>, wanted: Map<string, number>) {
  const clean = (map: Map<string, number>) => new Map([...map].filter(([, value]) => Math.abs(value) > 1e-9))
  const a = clean(given), b = clean(wanted)
  return a.size === b.size && [...b].every(([key, value]) => Math.abs((a.get(key) ?? NaN) - value) < 1e-9)
}

export function diagnoseExpand(response: string, grids: Grid[]): string | null {
  const answer = readTerms(response)
  if (!answer) return null
  const all = products(grids)
  const given = collect(answer), wanted = collect(all.map(p => p.product))
  if (same(given, wanted)) {
    const keys = answer.map(term => term.key)
    const repeated = keys.find((key, i) => keys.indexOf(key) !== i)
    return repeated === undefined ? null : `You can still collect: the ${repeated ? `${prettyTerm({ coefficient: 1, key: repeated }).replace(/^1(?=[a-z])/, '')} terms` : 'numbers'} are like terms, so add them into one term.`
  }
  const trySlip = (change: (i: number) => Term | null): number | null => {
    for (let i = 0; i < all.length; i++) {
      const swapped = change(i)
      if (!swapped) continue
      if (same(given, collect(all.map((p, j) => j === i ? swapped : p.product)))) return i
    }
    return null
  }
  const double = grids.some(grid => grid.side.length > 1)
  if (double && grids.length === 1) {
    const [f, o, i, l] = all
    const [a, b] = grids[0].side, [c, d] = grids[0].top
    const squared = a.key === c.key && a.coefficient === c.coefficient && b.coefficient === d.coefficient
    // Only the first and last products (x² + 24), or the square of each term ((n − 4)² = n² − 16).
    if (same(given, collect([f.product, l.product])) || same(given, collect([f.product, { ...l.product, coefficient: -l.product.coefficient }]))) {
      return squared
        ? `Squaring a bracket means multiplying it by itself: (${show(a)} ${show(b, false)})(${show(c)} ${show(d, false)}). That gives four products, so there are middle terms too.`
        : `Multiply every term in the first bracket by every term in the second: four products. The middle ones, ${show(o.product)} and ${show(i.product)}, are missing.`
    }
    // The last two numbers added instead of multiplied.
    if (!b.key && !d.key && same(given, collect([f.product, o.product, i.product, { coefficient: b.coefficient + d.coefficient, key: '' }]))) return `The last term is ${show(b)} × ${show(d)} = ${show(l.product)}. Multiply, don’t add.`
  }
  // A term inside the bracket left as it is: 4(2m + 3) → 8m + 3.
  const unmultiplied = trySlip(i => grids.length && !double ? all[i].b : null)
  if (unmultiplied !== null && unmultiplied > 0) return `Multiply the term outside by every term inside the bracket: ${show(all[unmultiplied].a)} × ${show(all[unmultiplied].b)} = ${show(all[unmultiplied].product)} too.`
  // One product with the wrong sign.
  const flipped = trySlip(i => ({ ...all[i].product, coefficient: -all[i].product.coefficient }))
  if (flipped !== null) {
    const { a, b, product } = all[flipped]
    const rule = a.coefficient < 0 && b.coefficient < 0 ? 'Negative × negative is positive' : a.coefficient < 0 || b.coefficient < 0 ? 'Negative × positive is negative' : 'Positive × positive is positive'
    return `${rule}: ${show(a)} × ${show(b)} = ${signed(product)}.`
  }
  // One product left out: (a + 1)(a + 8) → a² + 8a + 8 misses a × 1.
  const missing = trySlip(i => ({ ...all[i].product, coefficient: 0 }))
  if (missing !== null) {
    const { a, b, product } = all[missing]
    return `A product is missing: ${show(a)} × ${show(b)} = ${show(product)}. Multiply every term by every term.`
  }
  // A letter times itself not squared: 5k × 3k → 15k.
  const unsquared = trySlip(i => {
    const { a, b, product } = all[i]
    const shared = [...powersOf(a.key).keys()].find(letter => powersOf(b.key).has(letter))
    if (!shared) return null
    const powers = powersOf(product.key)
    powers.set(shared, powers.get(shared)! - 1)
    return { coefficient: product.coefficient, key: keyOf(powers) }
  })
  if (unsquared !== null) {
    const { a, b, product } = all[unsquared]
    const letter = [...powersOf(a.key).keys()].find(l => powersOf(b.key).has(l))!
    return `${letter} × ${letter} is ${letter}², so ${show(a)} × ${show(b)} = ${show(product)}.`
  }
  // The numbers in front not multiplied: 2m × m → m².
  const numbers = trySlip(i => {
    const { a, b, product } = all[i]
    return Math.abs(a.coefficient) !== 1 && Math.abs(b.coefficient) !== 1 ? null : { coefficient: Math.sign(product.coefficient), key: product.key }
  })
  if (numbers !== null && all[numbers].product.coefficient !== Math.sign(all[numbers].product.coefficient)) {
    const { a, b, product } = all[numbers]
    return `Multiply the numbers too: ${show(a)} × ${show(b)} = ${show(product)}.`
  }
  return null
}

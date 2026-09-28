/*
 * Explains why a "simplify" answer is wrong, in one plain sentence. Fixed rules, no AI.
 * Works from the question's own terms, so it can say which terms were joined or which sign was lost.
 * Returns null when it does not recognise the mistake, so the lesson falls back to the hint.
 */
import { collect, prettyExpression, prettyKey, prettyTerm, readTerms } from '../../number-types/lessonMath'

const powersOf = (key: string) => new Map([...key.matchAll(/([a-z])(?:\^(\d+))?/g)].map(([, letter, power]) => [letter, Number(power ?? 1)]))
/** Every letter of `part` appears in `whole` at least as many times. */
const inside = (part: string, whole: string) => {
  const big = powersOf(whole)
  return [...powersOf(part)].every(([letter, power]) => (big.get(letter) ?? 0) >= power)
}
const describe = (key: string) => key ? prettyKey(key) : 'the number'

export function diagnoseCollect(response: string, question: string): string | null {
  const answer = readTerms(response), asked = readTerms(question)
  if (!answer || !asked) return null
  const expected = collect(asked)
  for (const [key, value] of expected) if (value === 0) expected.delete(key)
  const given = collect(answer)
  const same = given.size === expected.size && [...expected].every(([key, value]) => given.get(key) === value)

  // 1. The right terms, but not fully collected.
  const keys = answer.map(term => term.key)
  const repeated = keys.find((key, i) => keys.indexOf(key) !== i)
  if (same && repeated !== undefined) return `You can still collect: the ${repeated ? `${prettyKey(repeated)} terms` : 'numbers'} are like terms, so add them into one term.`
  if (same) return null

  // 2. A letter part the answer should not have.
  for (const key of given.keys()) {
    if (expected.has(key) || !key) continue
    const parts = [...expected.keys()].filter(other => other && inside(other, key))
    // Letters from two different terms squashed together: unlike terms were joined (3x + 2y → 5xy, u²v + uv² → u²v²).
    if (parts.length >= 2) return `${prettyKey(parts[0])} and ${prettyKey(parts[1])} are not like terms, so they can’t be joined into ${prettyKey(key)}. Keep them as separate terms.`
    // The same letters with bigger powers: the powers were added (5w + 5w + 5w → 5w³, x² + x² → x⁴).
    if (parts.length === 1 && powersOf(parts[0]).size === powersOf(key).size) return `When you add like terms, only the number in front changes. ${prettyKey(parts[0])} stays ${prettyKey(parts[0])}: it never becomes ${prettyKey(key)}.`
  }

  // 3. A term that swallowed an unlike term: 11k + 7 → 18k, 5ef + 7e → 12ef.
  for (const [key, value] of given) {
    const own = expected.get(key)
    if (own === undefined || own === value) continue
    for (const [other, total] of expected) {
      if (other === key || given.has(other) || value !== own + total) continue
      return other
        ? `${prettyKey(key)} and ${prettyKey(other)} are not like terms, so they can’t be added together. The answer is ${prettyExpression([...expected].map(([k, coefficient]) => ({ key: k, coefficient })))}.`
        : `${prettyTerm({ coefficient: total, key: '' })} is a number term, not a ${prettyKey(key)} term. Keep it as a separate term.`
    }
  }

  // 4. Lost signs and lost terms.
  for (const [key, total] of expected) {
    const got = given.get(key)
    if (got === undefined) {
      if ([...given.keys()].every(k => expected.has(k))) return `Don’t leave out ${prettyTerm({ coefficient: total, key })}. A term with no match stays in the answer as it is.`
      continue
    }
    if (got === total) continue
    // Every sign read as +: the minus in front of a term was dropped (9y − 4y → 13y).
    const negative = asked.find(term => term.key === key && term.coefficient < 0)
    const allPlus = asked.filter(term => term.key === key).reduce((sum, term) => sum + Math.abs(term.coefficient), 0)
    if (negative && got === allPlus) return `The sign belongs to the term after it. It’s ${prettyTerm(negative)}, so take ${prettyTerm({ ...negative, coefficient: -negative.coefficient })} away.`
    if (got === -total) {
      const family = asked.filter(term => term.key === key)
      return family.length > 1
        ? `Keep each sign with its term: ${prettyExpression(family)} = ${prettyTerm({ coefficient: total, key })}, not ${prettyTerm({ coefficient: got, key })}.`
        : `Check the sign in front of ${describe(key)}: it should be ${prettyTerm({ coefficient: total, key })}, not ${prettyTerm({ coefficient: got, key })}.`
    }
  }
  return null
}

/** Why a wrong option in a "which are like terms?" question is not a like term. */
export function diagnoseChoice(selected: string, notes: Record<string, string>): string | null {
  for (const id of selected.split(',').filter(Boolean)) if (notes[id]) return notes[id]
  return null
}

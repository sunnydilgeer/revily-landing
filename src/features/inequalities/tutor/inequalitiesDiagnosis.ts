import { checkAnswer, parseInequality, type InequalityEnd } from '../../number-types/lessonMath'

/*
 * Inequalities: one plain sentence on why an answer is wrong, matched against the usual slips. Fixed rules, no AI.
 * Returns null when nothing fits, so the lesson falls back to the hint.
 */

const same = (a: string, b: string) => checkAnswer({ type: 'numericInput', acceptanceRule: 'inequality', correctAnswer: b }, a)
const show = (n: number) => String(n).replace('-', '−')
const near = (a?: InequalityEnd, b?: InequalityEnd) => a !== undefined && b !== undefined && Math.abs(a.value - b.value) < 1e-9

/**
 * Why a typed inequality is wrong. `slips` are this question's own: [a wrong answer, its message], matched however it
 * is written. Then the general slips, worded for a number line (`line`) or for solving.
 */
export function diagnoseInequality(response: string, right: string, slips: [string, string][] = [], line = true): string | null {
  const typed = parseInequality(response), wanted = parseInequality(right)
  if (!typed || !wanted || same(response, right)) return null
  const own = slips.find(([wrong]) => same(response, wrong))
  if (own) return own[1]
  if (typed.letter !== wanted.letter) return `Use the letter ${wanted.letter}.`
  const two = Boolean(wanted.lower && wanted.upper)
  if (two && !(typed.lower && typed.upper)) return line ? 'There are two circles, so there are two signs: the smaller number, the letter, then the bigger number.' : 'There are two signs: keep all three parts.'
  if (!two) {
    const end = wanted.lower ?? wanted.upper!, typedEnd = typed.lower ?? typed.upper
    const flipped = Boolean(wanted.lower) !== Boolean(typed.lower)
    if (typedEnd && Math.abs(typedEnd.value - end.value) > 1e-9) return line ? `The circle is at ${show(end.value)}: that’s the number in the inequality.` : null
    if (flipped && typedEnd?.included === end.included) return line ? `Check which way the arrow points: left is smaller (<), right is bigger (>).` : null
    if (!flipped && typedEnd?.included !== end.included) return line
      ? end.included ? `A filled circle means ${show(end.value)} is included: use the sign with the line under it.` : `An open circle means ${show(end.value)} isn’t included: use the sign without the line.`
      : null
    return null
  }
  if (near(typed.lower, wanted.lower) && near(typed.upper, wanted.upper)) {
    const swapped = typed.lower!.included === wanted.upper!.included && typed.upper!.included === wanted.lower!.included
    if (swapped) return 'The signs are the wrong way round: match each sign to its own number.'
    const which = typed.lower!.included !== wanted.lower!.included ? wanted.lower! : wanted.upper!
    return line
      ? which.included ? `${show(which.value)} is included (a filled circle): use ≤ next to it.` : `${show(which.value)} isn’t included (an open circle): use < next to it.`
      : which.included ? `${show(which.value)} is included: use ≤ next to it.` : `${show(which.value)} isn’t included: use < next to it.`
  }
  return null
}

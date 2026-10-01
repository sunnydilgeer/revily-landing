import { readFormula, sameFormula } from '../../number-types/lessonMath'

/*
 * Rearranging formulae: one plain sentence on why a typed formula is wrong. Fixed rules, no AI. A wrong formula is
 * tried with numbers against the usual slips for its question (the opposite operation not used, only part of a side
 * divided, the root or square on only one letter), so any way of writing the slip is caught. Returns null when no
 * slip fits, so the lesson falls back to the hint.
 */

/** A known wrong formula, written so `sameFormula` can read it, and why it's wrong. */
export type FormulaSlip = [string, string]

/**
 * Why `response` is wrong, as the first slip it matches. Before the slips: the subject still in the answer, or a
 * letter from the formula missing.
 */
export function diagnoseFormula(response: string, answer: string, subject: string, slips: FormulaSlip[]): string | null {
  if (sameFormula(response, answer)) return null
  const typed = readFormula(response), wanted = readFormula(answer)
  if (!typed || !wanted) return null
  if (typed.letters.includes(subject.toLowerCase())) return `${subject} is still in your answer. Get ${subject} on its own on one side, so the other side says what ${subject} equals without it.`
  const slip = slips.find(([wrong]) => sameFormula(response, wrong))
  if (slip) return slip[1]
  // Letters are read in lower case; say them as the formula writes them.
  const missing = wanted.letters.filter(letter => !typed.letters.includes(letter)).map(letter => answer.match(new RegExp(letter, 'i'))?.[0] ?? letter)
  return missing.length ? `Your answer has lost ${missing.join(' and ')}. Do each move to the whole of both sides, so every letter stays.` : null
}

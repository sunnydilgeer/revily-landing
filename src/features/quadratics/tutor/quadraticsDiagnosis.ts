import { readBrackets, readTerms } from '../../number-types/lessonMath'

/*
 * Factorising x² + bx + c: one plain sentence on why two typed brackets are wrong, worked out by multiplying the
 * student's own brackets: do their two numbers multiply to c, add to b, or have the wrong signs? Fixed rules, no AI.
 * Returns null when nothing fits, so the lesson falls back to the hint.
 */

const signed = (n: number) => n < 0 ? `−${-n}` : String(n)
const term = (n: number, letter = '') => `${n < 0 ? '−' : '+'} ${Math.abs(n) === 1 && letter ? '' : Math.abs(n)}${letter}`
/** x² + 2x − 15, with no middle term when it is 0. */
export const quadratic = (letter: string, middle: number, last: number) => `${letter}² ${middle ? `${term(middle, letter)} ` : ''}${term(last)}`

/** The two numbers that factorise x² + bx + c, in the order of the pairs table, or null. */
export function factorPair(middle: number, last: number): [number, number] | null {
  for (let a = -Math.abs(last); a <= Math.abs(last); a++) if (a !== 0 && last % a === 0 && a + last / a === middle && a <= last / a) return [a, last / a]
  return null
}

export function diagnoseBrackets(response: string, letter: string, middle: number, last: number): string | null {
  const typed = readBrackets(response)
  const question = quadratic(letter, middle, last)
  if (!typed) {
    // The question multiplied out again, or typed back: it needs to be two brackets.
    const terms = readTerms(response)
    if (terms && terms.some(t => t.key === `${letter}^2`)) return `That’s still ${question} multiplied out. Factorising writes it as two brackets: (${letter} + ☐)(${letter} + ☐).`
    return null
  }
  if (typed.letter !== letter) return `The question uses ${letter}, so the brackets need ${letter} in them.`
  if (typed.brackets.some(([x]) => x !== 1)) return `Each bracket starts with ${letter} on its own: ${letter} × ${letter} makes the ${letter}².`
  const [p, q] = typed.brackets.map(([, n]) => n)
  const product = p * q, sum = p + q
  if (product === last && sum === middle) return null
  const expands = `Your brackets multiply out to ${quadratic(letter, sum, product)}, not ${question}.`
  if (middle === 0 && sum === 0) return `${expands} The number in each bracket is the square root of ${-last}: the number that times itself makes ${-last}.`
  if (middle === 0 && product === -last) return `${expands} One bracket needs a plus and the other a minus, so the middle terms cancel.`
  if (product === last && sum === -middle) return `${expands} Your numbers multiply to ${signed(last)} but add to ${signed(sum)}: swap both signs.`
  if (product === -last) return `${expands} Your numbers multiply to ${signed(product)}, not ${signed(last)}. ${last < 0 ? 'A negative last number needs one plus and one minus.' : 'A positive last number needs the same sign in both brackets.'}`
  if (product === last) return `${expands} Your numbers multiply to ${signed(last)} but add to ${signed(sum)}, not ${signed(middle)}. Try another pair.`
  if (sum === middle) return `${expands} Your numbers add to ${signed(middle)} but multiply to ${signed(product)}, not ${signed(last)}. Try another pair.`
  return `${expands} Find two numbers that multiply to ${signed(last)} and add to ${signed(middle)}.`
}

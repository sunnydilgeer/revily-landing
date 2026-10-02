import { fmt } from '../../equations/tutor/equationsDiagnosis'

/*
 * Solving x² + bx + c = 0 by factorising: one plain sentence on why two typed answers are wrong. The usual slips are
 * the numbers from the brackets with their signs kept, the numbers from the question, a pair that multiplies to c
 * but doesn't add to b, one answer only, and (when the question doesn't equal 0) factorising before making one side 0.
 * Fixed rules, no AI. Returns null when nothing fits, so the lesson falls back to the hint.
 */

/** The values typed in the two boxes, "4, -5" → [4, −5]. */
export function readValues(response: string): number[] {
  return response.replace(/[−–]/g, '-').split(',').map(part => part.trim().replace(/^[a-z]\s*=\s*/i, '')).filter(Boolean).map(Number).filter(Number.isFinite)
}

const close = (a: number, b: number) => Math.abs(a - b) < 1e-6
/** The same two values, in either order. */
const same = (values: number[], wanted: number[]) => values.length === 2 && wanted.length === 2
  && ((close(values[0], wanted[0]) && close(values[1], wanted[1])) || (close(values[0], wanted[1]) && close(values[1], wanted[0])))
const term = (n: number) => `${n < 0 ? '−' : '+'} ${Math.abs(n)}`

/**
 * Why the typed answers to (x + a)(x + b) = 0 are wrong. `middle` and `last` are b and c once one side is 0; `extra`
 * adds slips for a question that started elsewhere, such as x² + x = 20 solved as if the 20 were 0.
 */
export function diagnoseSolve(response: string, letter: string, [a, b]: [number, number], middle: number, last: number, extra: [number[], string][] = []): string | null {
  const values = readValues(response), roots = [-a, -b]
  if (!values.length || same(values, roots)) return null
  if (values.length === 1) return roots.some(root => close(root, values[0]))
    ? 'That’s one answer. Each bracket gives an answer, so there are two.'
    : `Each bracket gives an answer, so there are two. Set each bracket equal to 0 and solve it.`
  for (const [wanted, note] of extra) if (same(values, wanted)) return note
  if (same(values, [a, b])) return `Those are the numbers in the brackets. ${letter} ${term(a)} is 0 when ${letter} is ${fmt(-a)}, so each answer has the opposite sign.`
  const right = values.filter(value => roots.some(root => close(root, value)))
  if (right.length === 1 && values.some(value => [a, b].some(n => close(n, value) && !roots.some(root => close(root, value))))) return 'One answer is right. For the other, the number in the bracket changes sign: the answer is its opposite.'
  if (same(values.map(Math.abs), [Math.abs(middle), Math.abs(last)])) return 'Those are the numbers in the question. Factorise into two brackets first, then set each bracket equal to 0.'
  // Answers from a different pair: undo the sign to get the student's numbers back, and check their product and sum.
  const [p, q] = values.map(value => -value)
  if (values.length === 2 && close(p * q, last) && !close(p + q, middle)) return `Your answers come from numbers that multiply to ${fmt(last)} but add to ${fmt(p + q)}, not ${fmt(middle)}. Find the pair that adds to ${fmt(middle)}.`
  if (values.length === 2 && close(p * q, -last)) return `Your answers come from numbers that multiply to ${fmt(-last)}, not ${fmt(last)}. Check the signs in your brackets.`
  return null
}

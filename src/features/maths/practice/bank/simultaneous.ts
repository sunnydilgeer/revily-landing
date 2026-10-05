/*
 * Practice templates for simultaneous equations (lesson 27, Algebra A12).
 * Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for simultaneous equations yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import type { NumberPart, QuestionBody, Template } from '../types'

const term = (n: number, letter: string) => `${n === 1 ? '' : n}${letter}`

/** ax + by = c and dx + by = e, the same y term in both: x (2 marks, method: what is left after taking one away), then y. */
function eliminate(a: number, d: number, b: number, x: number, y: number): QuestionBody {
  const c = a * x + b * y, e = d * x + b * y
  const one = `${term(a, 'x')} + ${term(b, 'y')} = ${c}`, two = `${term(d, 'x')} + ${term(b, 'y')} = ${e}`
  const solveX: NumberPart = {
    kind: 'number', prompt: 'Work out the value of $x$.', answer: x, marks: 2, statements: ['27:simultaneous-elimination'],
    hint: `Both equations have $+${term(b, 'y')}$. Take the second away from the first.`,
    method: [{ prompt: `Take the second equation from the first. ${a - d}x = ?`, answer: c - e }],
    chain: [{ line: `${one},\\ ${two}` }, { line: `${term(a - d, 'x')} = ${c - e}`, op: 'Take one from the other', why: `The $${term(b, 'y')}$ terms are the same, so they cancel.` }, { line: `x = ${x}`, op: `Divide by ${a - d}`, why: 'Do the same to both sides.' }],
    mistakes: [{ answer: (c + e) / (a + d), note: 'Take the equations away from each other, don’t add them: adding keeps the y terms.' }],
  }
  const solveY: NumberPart = {
    kind: 'number', prompt: 'Work out the value of $y$.', answer: y, marks: 1, statements: ['27:simultaneous-elimination'],
    hint: `Put $x = ${x}$ into either equation.`,
    chain: [{ line: `${term(d, 'x')} + ${term(b, 'y')} = ${e}` }, { line: `${d * x} + ${term(b, 'y')} = ${e}`, op: `Put in x = ${x}`, why: 'x is the same in both equations.' }, { line: `${term(b, 'y')} = ${e - d * x}`, op: `Subtract ${d * x}`, why: 'Do the same to both sides.' }, ...(b === 1 ? [] : [{ line: `y = ${y}`, op: `Divide by ${b}`, why: 'Get y on its own.' }])],
  }
  return { stem: `Solve the simultaneous equations $${one}$ and $${two}$.`, parts: [solveX, solveY] }
}

/** Two orders with the same number of one thing: the price of the other (2 marks, method), then the first. */
function order(item: [string, string], firstCount: [number, number], secondCount: number, price: [number, number]): QuestionBody {
  const [thing, other] = item
  const [p, q] = price
  const [a, b] = firstCount
  const one = a * p + b * q, two = secondCount * p + b * q
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
  const first: NumberPart = {
    kind: 'number', prompt: `How much does one ${thing} cost?`, answer: p, prefix: '£', marks: 2, statements: ['27:simultaneous-words'],
    hint: `Both orders have ${plural(b, other)}. What is the difference between them?`,
    method: [{ prompt: `How much more do ${plural(a - secondCount, thing)} cost?`, prefix: '£', answer: one - two }],
    chain: [{ line: `${term(a, 'a')} + ${term(b, 'b')} = ${one},\\ ${term(secondCount, 'a')} + ${term(b, 'b')} = ${two}` }, { line: `${term(a - secondCount, 'a')} = ${one - two}`, op: 'Take one from the other', why: `The ${other}s cost the same in both, so they cancel.` }, { line: `a = ${p}`, op: `Divide by ${a - secondCount}`, why: `This is the price of one ${thing}.` }],
  }
  const second: NumberPart = {
    kind: 'number', prompt: `How much does one ${other} cost?`, answer: q, prefix: '£', marks: 1, statements: ['27:simultaneous-words'],
    hint: `Put the price of a ${thing} back into either order.`,
    chain: [{ line: `${term(secondCount, 'a')} + ${term(b, 'b')} = ${two}` }, { line: `${term(b, 'b')} = ${two - secondCount * p}`, op: `Take off ${secondCount * p}`, why: `That is the cost of the ${thing}s.` }, ...(b === 1 ? [] : [{ line: `b = ${q}`, op: `Divide by ${b}`, why: `This is the price of one ${other}.` }])],
  }
  return { stem: `${plural(a, thing)} and ${plural(b, other)} cost £${one}. ${plural(secondCount, thing)} and ${plural(b, other)} cost £${two}.`, parts: [first, second] }
}

export const simultaneousTemplates: Template[] = [
  {
    id: 'simultaneous-eliminate', topic: 'simultaneous', ramp: 'multistep', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A12.1 worksheet (the same y term in both, take one away); AQA 2022–25 references still to be counted',
    variants: [eliminate(3, 1, 2, 4, 2), eliminate(5, 2, 3, 3, 1), eliminate(4, 1, 1, 2, 5)],
  },
  {
    id: 'simultaneous-orders', topic: 'simultaneous', ramp: 'stretch', style: 'standard', context: 'food', calculator: false,
    inspiredBy: 'Estimate: modelled on the A12.2 worksheet (two café orders); AQA 2022–25 references still to be counted',
    variants: [order(['coffee', 'muffin'], [3, 2], 1, [3, 2]), order(['pizza', 'drink'], [4, 3], 2, [6, 2]), order(['ticket', 'programme'], [5, 1], 3, [8, 4])],
  },
]

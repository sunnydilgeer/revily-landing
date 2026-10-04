/*
 * Practice templates for inequalities (lesson 24, Algebra A10) and solving them (lesson 25, A11).
 * Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for inequalities yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import { rotate } from '../helpers'
import type { ChoicePart, NumberPart, QuestionBody, Template } from '../types'

const sign = (s: string) => s.replace('≤', '\\leq').replace('≥', '\\geq')
const show = (n: number) => String(n).replace('-', '−')
const texNumber = (n: number) => String(n)

/** One sign: which inequality a number line shows (choice), then the largest or smallest integer on it. */
function oneSign(at: number, closed: boolean, left: boolean, by: number): QuestionBody {
  const right = `x ${left ? (closed ? '≤' : '<') : (closed ? '≥' : '>')} ${texNumber(at)}`
  const wrongs = [`x ${left ? (closed ? '<' : '≤') : (closed ? '>' : '≥')} ${texNumber(at)}`, `x ${left ? (closed ? '≥' : '>') : (closed ? '≤' : '<')} ${texNumber(at)}`, `x ${left ? (closed ? '>' : '≥') : (closed ? '<' : '≤')} ${texNumber(at)}`]
  const read: ChoicePart = {
    kind: 'choice', prompt: 'Which inequality does it show?', marks: 1, statements: ['24:inequalities-number-line'],
    ...rotate([right, ...wrongs].map(option => `$${sign(option)}$`), 0, by),
    hint: 'Filled circle: the number is included (≤ or ≥). Left is smaller, right is bigger.',
    chain: [{ line: `\\text{${closed ? 'filled' : 'open'} circle at } ${texNumber(at)}` }, { line: sign(right), op: left ? 'Arrow left: smaller' : 'Arrow right: bigger', why: closed ? 'Filled: the number itself is included, so the sign has the line under it.' : 'Open: the number itself isn’t included.' }],
  }
  const end = closed ? at : left ? at - 1 : at + 1
  const integer: NumberPart = {
    kind: 'number', prompt: `Write down the ${left ? 'largest' : 'smallest'} integer that satisfies it.`, answer: end, marks: 1, signed: true, statements: ['24:inequalities-number-line'],
    hint: closed ? `Is ${show(at)} itself included?` : `${show(at)} isn’t included. Go one ${left ? 'below' : 'above'}.`,
    chain: [{ line: sign(right) }, { line: texNumber(end), op: closed ? `${show(at)} is included` : `One ${left ? 'below' : 'above'} ${show(at)}`, why: closed ? 'A filled circle includes the number.' : 'An open circle leaves the number out.' }],
    mistakes: closed ? [{ answer: left ? at - 1 : at + 1, note: `The circle is filled, so ${show(at)} itself is included.` }] : [{ answer: at, note: `The circle is open, so ${show(at)} isn’t included.` }],
  }
  return { stem: `A number line shows ${closed ? 'a filled' : 'an open'} circle at $${texNumber(at)}$ with an arrow pointing ${left ? 'left' : 'right'}.`, parts: [read, integer] }
}

/** Two signs: which inequality a number line shows (choice), then how many integers satisfy it (2 marks). */
function twoSigns(low: number, lowClosed: boolean, high: number, highClosed: boolean, by: number): QuestionBody {
  const s = (closed: boolean) => closed ? '≤' : '<'
  const right = `${low} ${s(lowClosed)} x ${s(highClosed)} ${high}`
  const wrongs = [`${low} ${s(!lowClosed)} x ${s(!highClosed)} ${high}`, `${low} ${s(lowClosed)} x ${s(!highClosed)} ${high}`, `${low} ${s(!lowClosed)} x ${s(highClosed)} ${high}`]
  const read: ChoicePart = {
    kind: 'choice', prompt: 'Which inequality does it show?', marks: 1, statements: ['24:inequalities-two-sided'],
    ...rotate([right, ...wrongs].map(option => `$${sign(sign(option))}$`), 0, by),
    hint: 'Filled means ≤, open means <. The smaller number goes first.',
    chain: [{ line: `${low} ${sign(s(lowClosed))} x` }, { line: sign(sign(right)), op: `${highClosed ? 'Filled' : 'Open'} at ${show(high)}`, why: 'Each end gets the sign that matches its circle.' }],
  }
  const first = lowClosed ? low : low + 1, last = highClosed ? high : high - 1, count = last - first + 1
  const howMany: NumberPart = {
    kind: 'number', prompt: 'How many integers satisfy the inequality?', answer: count, marks: 2, statements: ['24:inequalities-two-sided'],
    hint: 'Find the smallest and largest whole numbers that fit, then count them all.',
    method: [{ prompt: 'What is the smallest integer that fits?', answer: first }],
    chain: [{ line: `\\text{smallest } ${first},\\ \\text{largest } ${last}` }, { line: `${Array.from({ length: count }, (_, i) => first + i).join(',\\ ')}`, op: 'List them', why: 'Every whole number from the smallest to the largest.' }, { line: String(count), op: 'Count them', why: 'Count every number in the list.' }],
    mistakes: [{ answer: high - low + 1, note: 'Check each end: an open circle leaves that number out.' }, { answer: high - low, note: 'Count both ends that are included, and every whole number between.' }].filter(m => m.answer !== count),
  }
  return { stem: `A number line shows ${lowClosed ? 'a filled' : 'an open'} circle at $${low}$, ${highClosed ? 'a filled' : 'an open'} circle at $${high}$, and a line joining them.`, parts: [read, howMany] }
}


/** Solve ax + b (sign) c (choice), then the largest or smallest integer that fits. `negative`: a < 0, so the sign flips. */
function solveSet(a: number, b: number, c: number, s: '<' | '≤' | '>' | '≥', by: number): QuestionBody {
  const flip: Record<string, string> = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }
  const bound = (c - b) / a, final = a < 0 ? flip[s] : s
  const right = `x ${final} ${bound}`
  const statement = a < 0 ? '25:inequalities-negative' : '25:inequalities-solve'
  const wrongs = [`x ${a < 0 ? s : flip[s]} ${bound}`, `x ${final} ${(c + b) / a}`, `x ${final} ${c - b}`]
  const lhs = `${a === -1 ? '-' : a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}`
  const solve: ChoicePart = {
    kind: 'choice', prompt: `Solve $${lhs} ${sign(s)} ${c}$`, marks: 1, statements: [statement],
    ...rotate([right, ...wrongs].map(option => `$${sign(option)}$`), 0, by),
    hint: a < 0 ? 'Undo the number first. Dividing by a negative flips the sign.' : 'Undo the number first, then divide.',
    chain: [{ line: `${lhs} ${sign(s)} ${c}` }, { line: `${a === -1 ? '-' : a}x ${sign(s)} ${c - b}`, op: b < 0 ? `Add ${-b}` : `Subtract ${b}`, why: 'Do the same to both sides.' }, { line: sign(right), op: `Divide by ${a}`, why: a < 0 ? 'Dividing by a negative flips the sign.' : 'Dividing by a positive keeps the sign.' }],
  }
  const less = final === '<' || final === '≤', included = final === '≤' || final === '≥'
  const end = included ? bound : less ? bound - 1 : bound + 1
  const integer: NumberPart = {
    kind: 'number', prompt: `Write down the ${less ? 'largest' : 'smallest'} integer that satisfies $${lhs} ${sign(s)} ${c}$.`, answer: end, marks: 1, signed: true, statements: ['25:inequalities-integers'],
    hint: `Solve it first. Is ${show(bound)} itself included?`,
    chain: [{ line: sign(right) }, { line: String(end), op: included ? `${show(bound)} is included` : `One ${less ? 'below' : 'above'} ${show(bound)}`, why: included ? 'The sign has the line under it.' : 'A strict sign leaves the number out.' }],
    mistakes: [{ answer: included ? (less ? bound - 1 : bound + 1) : bound, note: included ? `${show(bound)} itself is included.` : `${show(bound)} itself isn’t included.` }],
  }
  return { stem: 'Here is an inequality.', parts: [solve, integer] }
}

/** Solve p < ax + b ≤ q (choice), then count the integers (2 marks, method: the smallest one). */
function twoSignSet(p: number, a: number, b: number, q: number, by: number): QuestionBody {
  const low = (p - b) / a, high = (q - b) / a
  const right = `${low} < x \\leq ${high}`
  const solve: ChoicePart = {
    kind: 'choice', prompt: `Solve $${p} < ${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)} \\leq ${q}$`, marks: 1, statements: ['25:inequalities-solve-two-signs'],
    ...rotate([right, `${p - b} < x \\leq ${q - b}`, `${p} < x \\leq ${high}`, `${low} \\leq x < ${high}`].map(option => `$${option}$`), 0, by),
    hint: 'Do the same to all three parts: undo the number, then divide.',
    chain: [{ line: `${p} < ${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)} \\leq ${q}` }, { line: `${p - b} < ${a}x \\leq ${q - b}`, op: b < 0 ? `Add ${-b} to all three` : `Subtract ${b} from all three`, why: 'Every part gets the same move.' }, { line: right, op: `Divide all three by ${a}`, why: 'A positive number keeps both signs.' }],
  }
  const count = high - low
  const howMany: NumberPart = {
    kind: 'number', prompt: 'How many integers satisfy the inequality?', answer: count, marks: 2, statements: ['25:inequalities-integers'],
    hint: 'The left end isn’t included; the right end is.',
    method: [{ prompt: 'What is the smallest integer that fits?', answer: low + 1 }],
    chain: [{ line: right }, { line: Array.from({ length: count }, (_, i) => low + 1 + i).join(',\\ '), op: 'List them', why: 'Leave out the left end (<), keep the right end (≤).' }, { line: String(count), op: 'Count them', why: 'Count every number in the list.' }],
    mistakes: [{ answer: count + 1, note: `${show(low)} isn’t included: its sign is <.` }],
  }
  return { stem: 'Here is an inequality with two signs.', parts: [solve, howMany] }
}

export const inequalitiesTemplates: Template[] = [
  {
    id: 'inequalities-one-sign', topic: 'inequalities', ramp: 'stretch', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A10.1 worksheet (write the inequality a number line shows); AQA 2022–25 references still to be counted',
    variants: [oneSign(4, false, true, 0), oneSign(-1, true, false, 1), oneSign(6, true, true, 2), oneSign(-3, false, false, 3)],
  },
  {
    id: 'inequalities-two-signs', topic: 'inequalities', ramp: 'multistep', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A10.2 worksheet (two-sided inequalities and their integers); AQA 2022–25 references still to be counted',
    variants: [twoSigns(-2, true, 3, false, 0), twoSigns(-4, false, 2, true, 1), twoSigns(1, true, 6, true, 2), twoSigns(-3, false, 4, false, 3)],
  },
  {
    id: 'inequalities-solve', topic: 'inequalities', ramp: 'multistep', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A11.2 and A11.4 worksheets (solve, then the largest integer); AQA 2022–25 references still to be counted',
    variants: [solveSet(3, 4, 19, '<', 0), solveSet(4, -3, 17, '≤', 1), solveSet(5, 2, -8, '>', 2)],
  },
  {
    id: 'inequalities-negative', topic: 'inequalities', ramp: 'stretch', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A11.4 worksheet (divide by a negative and flip the sign); AQA 2022–25 references still to be counted',
    variants: [solveSet(-2, 9, 1, '≥', 0), solveSet(-3, 2, -10, '<', 1), solveSet(-4, 1, -11, '≤', 2)],
  },
  {
    id: 'inequalities-two-signs-solve', topic: 'inequalities', ramp: 'stretch', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A11.3 worksheet (two signs, then count the integers); AQA 2022–25 references still to be counted',
    variants: [twoSignSet(5, 2, 1, 13, 0), twoSignSet(-4, 3, 2, 14, 1), twoSignSet(1, 2, -3, 9, 2)],
  },
]

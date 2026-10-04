/*
 * Practice templates for inequalities (lesson 24, Algebra A10).
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
]

/*
 * Practice templates for angle facts (lesson 26, Geometry G1): on a straight line, around a point, and vertically
 * opposite. Original questions in the style of AQA Foundation papers, written in words so they need no diagram. The AQA
 * 2022–25 references have not been counted for these sections yet, so `inspiredBy` says so, and the weights in
 * aqaWeights.ts are estimates.
 */
import { rotate } from '../helpers'
import type { ChoicePart, NumberPart, QuestionBody, Template } from '../types'

const deg = (n: number) => `${n}^{\\circ}`
const count = (n: number) => ['Two', 'Three', 'Four', 'Five'][n - 2]

/** Angles on a straight line: the angles given, then the missing one (2 marks when there are two to add). */
function straight(known: number[]): QuestionBody {
  const sum = known.reduce((a, b) => a + b, 0), answer = 180 - sum
  const part: NumberPart = {
    kind: 'number', prompt: 'Work out the size of angle $x$.', answer, marks: known.length > 1 ? 2 : 1, suffix: '°', statements: ['26:angles-straight-line'],
    hint: 'Angles on a straight line add up to 180°.',
    ...(known.length > 1 ? { method: [{ prompt: 'What do the angles you know add up to?', answer: sum }] } : {}),
    chain: [...(known.length > 1 ? [{ line: `${known.join(' + ')} = ${sum}` }] : [{ line: `${known[0]} + x = 180` }]), { line: `x = 180 - ${sum} = ${answer}`, op: 'Take it from 180°', why: 'Angles on a straight line add up to 180°.' }],
    mistakes: [{ answer: 360 - sum, note: 'That uses 360°. Angles on a straight line add up to 180°.' }],
  }
  return { stem: `${count(known.length + 1)} angles sit on a straight line: ${known.map(n => `$${deg(n)}$`).join(', ')} and $x$.`, parts: [part] }
}

/** Angles around a point: the angles given, then the missing one (2 marks). */
function point(known: number[]): QuestionBody {
  const sum = known.reduce((a, b) => a + b, 0), answer = 360 - sum
  const part: NumberPart = {
    kind: 'number', prompt: 'Work out the size of angle $y$.', answer, marks: 2, suffix: '°', statements: ['26:angles-around-point'],
    hint: 'Angles around a point add up to 360°.',
    method: [{ prompt: 'What do the angles you know add up to?', answer: sum }],
    chain: [{ line: `${known.join(' + ')} = ${sum}` }, { line: `y = 360 - ${sum} = ${answer}`, op: 'Take it from 360°', why: 'Angles around a point add up to 360°: a full turn.' }],
    mistakes: [{ answer: 180 - sum, note: 'Around a point is a full turn: 360°, not 180°.' }].filter(m => m.answer > 0),
  }
  return { stem: `${count(known.length + 1)} angles meet at a point: ${known.map(n => `$${deg(n)}$`).join(', ')} and $y$.`, parts: [part] }
}

/** Two lines cross: the angle opposite (choice, with the reason), then the angle next to it. */
function crossing(size: number, by: number): QuestionBody {
  const reason: ChoicePart = {
    kind: 'choice', prompt: `What is the angle opposite the $${deg(size)}$ angle, and why?`, marks: 1, statements: ['26:angles-vertically-opposite'],
    ...rotate([`$${deg(size)}$: vertically opposite angles are equal`, `$${deg(180 - size)}$: they add up to $180^{\\circ}$`, `$${deg(360 - size)}$: they add up to $360^{\\circ}$`, `$${deg(size)}$: angles on a straight line are equal`], 0, by),
    hint: 'Opposite each other, across the point where the lines cross.',
    chain: [{ line: `\\text{opposite } ${deg(size)}` }, { line: deg(size), op: 'Opposite angles are equal', why: 'Vertically opposite angles are equal.' }],
  }
  const next: NumberPart = {
    kind: 'number', prompt: `Work out the size of the angle next to the $${deg(size)}$ angle.`, answer: 180 - size, marks: 1, suffix: '°', statements: ['26:angles-straight-line'],
    hint: 'The angle next to it is on the same straight line.',
    chain: [{ line: `${size} + a = 180` }, { line: `a = ${180 - size}`, op: `Take ${size} from 180`, why: 'Angles on a straight line add up to 180°.' }],
    mistakes: [{ answer: size, note: 'That is the angle opposite. The one next to it is on a straight line with it.' }],
  }
  return { stem: `Two straight lines cross. One of the angles is $${deg(size)}$.`, parts: [reason, next] }
}

/** Angles in terms of x on a straight line (180) or around a point (360): find x. */
function algebra(coefficients: [number, number], extra: number, total: 180 | 360): QuestionBody {
  const [a, b] = coefficients, x = (total - extra) / (a + b)
  const statement = total === 180 ? '26:angles-straight-line' : '26:angles-around-point'
  const angles = [`${a}x`, `${b}x`, ...(extra ? [deg(extra)] : [])]
  const part: NumberPart = {
    kind: 'number', prompt: 'Work out the value of $x$.', answer: x, marks: 2, statements: [statement],
    hint: `The angles add up to ${total}°. Collect the x’s first.`,
    method: [{ prompt: `What is ${a + b}x equal to?`, answer: total - extra }],
    chain: [{ line: `${a}x + ${b}x${extra ? ` + ${extra}` : ''} = ${total}` }, { line: `${a + b}x = ${total - extra}`, op: 'Collect the x’s', why: extra ? `Take ${extra} from both sides too.` : 'Add the lots of x together.' }, { line: `x = ${x}`, op: `Divide by ${a + b}`, why: 'Share it into equal lots.' }],
    mistakes: [{ answer: a * x, note: `That is ${a}x, one of the angles. Divide by ${a} to find x.` }, { answer: (total === 180 ? 360 : 180) - extra > 0 ? ((total === 180 ? 360 : 180) - extra) / (a + b) : -1, note: total === 180 ? 'A straight line is 180°, not 360°.' : 'Around a point is 360°, not 180°.' }].filter((m, i, all) => m.answer > 0 && m.answer !== x && all.findIndex(o => o.answer === m.answer) === i),
  }
  return { stem: `${extra ? 'Three' : 'Two'} angles ${total === 180 ? 'sit on a straight line' : 'meet at a point'}: ${angles.map(t => `$${t}$`).join(', ')}.`, parts: [part] }
}

export const anglesTemplates: Template[] = [
  {
    id: 'angles-straight-line', topic: 'angles', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the G1.1 worksheet (angles on a straight line); AQA 2022–25 references still to be counted',
    variants: [straight([135]), straight([72]), straight([118]), straight([57])],
  },
  {
    id: 'angles-around-point', topic: 'angles', ramp: 'multistep', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the G1.1 worksheet (angles around a point); AQA 2022–25 references still to be counted',
    variants: [point([90, 140, 75]), point([125, 150]), point([110, 85, 60]), point([90, 90, 145])],
  },
  {
    id: 'angles-crossing', topic: 'angles', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the G1.1 worksheet (vertically opposite, with a reason); AQA 2022–25 references still to be counted',
    variants: [crossing(58, 0), crossing(125, 1), crossing(40, 2), crossing(103, 3)],
  },
  {
    id: 'angles-algebra-line', topic: 'angles', ramp: 'stretch', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the G1.1 worksheet (angles in terms of x on a straight line); AQA 2022–25 references still to be counted',
    variants: [algebra([2, 3], 0, 180), algebra([3, 7], 30, 180), algebra([4, 5], 0, 180), algebra([1, 2], 45, 180)],
  },
]

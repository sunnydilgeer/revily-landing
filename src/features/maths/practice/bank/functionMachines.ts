/*
 * Practice templates for function machines (lesson 29, Algebra A14): input to output, output back to input, and the
 * machine for an equation. Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have
 * not been counted for function machines yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import { rotate } from '../helpers'
import type { ChoicePart, NumberPart, QuestionBody, Template } from '../types'

type Box = ['×' | '÷' | '+' | '−', number]
const apply = ([op, n]: Box, value: number) => op === '×' ? value * n : op === '÷' ? value / n : op === '+' ? value + n : value - n
const opposite = ([op, n]: Box): Box => [({ '×': '÷', '÷': '×', '+': '−', '−': '+' } as const)[op], n]
const tex = ([op, n]: Box) => `${{ '×': '\\times', '÷': '\\div', '+': '+', '−': '-' }[op]} ${n}`
const minus = (n: number) => String(n)
const drawn = (input: string, boxes: Box[], output: string) => `$${[input, ...boxes.map(tex), output].join(' \\rightarrow ')}$`

/** Input to output: the number after box 1 (method), then the output (2 marks). */
function forwards(boxes: Box[], input: number): QuestionBody {
  const values = boxes.reduce((list, box) => [...list, apply(box, list.at(-1)!)], [input])
  const output: NumberPart = {
    kind: 'number', prompt: `Work out the output when the input is $${input}$.`, answer: values.at(-1)!, marks: 2, statements: ['29:function-machines-forwards'],
    hint: 'Go through the boxes in order, left to right, one box at a time.',
    method: [{ prompt: `What comes out of box 1? $${input} ${tex(boxes[0])} = ?$`, answer: values[1] }],
    chain: boxes.map((box, i) => ({ line: `${minus(values[i])} ${tex(box)} = ${minus(values[i + 1])}`, op: `Box ${i + 1}`, why: i === 0 ? 'Start with the input.' : 'The number from the box before goes in.' })),
    mistakes: [{ answer: [...boxes].reverse().reduce((value, box) => apply(box, value), input), note: 'Go through the boxes in order, starting with box 1. The order matters.' }],
  }
  return { stem: `Here is a function machine. ${drawn('\\text{Input}', boxes, '\\text{Output}')}`, parts: [output] }
}

/** Output to input: undo the last box first (method), then the input (2 marks). */
function backwards(boxes: Box[], output: number): QuestionBody {
  const undone = [...boxes].reverse().map(opposite)
  const values = undone.reduce((list, box) => [...list, apply(box, list.at(-1)!)], [output])
  const input: NumberPart = {
    kind: 'number', prompt: `The output is $${output}$. Work out the input.`, answer: values.at(-1)!, marks: 2, statements: ['29:function-machines-backwards'],
    hint: 'Start at the output and undo the last box first, with its opposite.',
    method: [{ prompt: `Undo the last box: $${output} ${tex(undone[0])} = ?$`, answer: values[1] }],
    chain: undone.map((box, i) => ({ line: `${minus(values[i])} ${tex(box)} = ${minus(values[i + 1])}`, op: `Undo box ${boxes.length - i}`, why: `Its opposite is ${tex(box).replace('\\times', '×').replace('\\div', '÷')}.` })),
    mistakes: [{ answer: boxes.map(opposite).reduce((value, box) => apply(box, value), output), note: 'Undo the last box first: going backwards reverses the order too.' }],
  }
  return { stem: `Here is a function machine. ${drawn('\\text{Input}', boxes, '\\text{Output}')}`, parts: [input] }
}

/** y = ax + b: which machine (1 mark), then y for one value of x through it (1 mark). */
function creating(a: number, b: number, x: number, by: number): QuestionBody {
  const sign = b < 0 ? '−' : '+'
  const right: Box[] = [['×', a], [sign, Math.abs(b)]]
  const label = (list: Box[]) => `$${list.map(tex).join(',\\ \\text{then}\\ ')}$`
  const pick: ChoicePart = {
    kind: 'choice', prompt: `Which function machine gives $y = ${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}$?`, marks: 1, statements: ['29:function-machines-creating'],
    ...rotate([label(right), label([right[1], right[0]]), label([['×', Math.abs(b)], [sign, a]]), label([['+', a], [sign, Math.abs(b)]])], 0, by),
    hint: `BIDMAS: $${a}x$, which is $${a} \\times x$, is worked out first.`,
    reason: `${a}x means ${a} × x, and multiplication comes before ${b < 0 ? 'subtraction' : 'addition'}. So × ${a} first, then ${sign} ${Math.abs(b)}.`,
  }
  const y = a * x + b
  const use: NumberPart = {
    kind: 'number', prompt: `Use the machine to work out $y$ when $x = ${x}$.`, answer: y, marks: 1, statements: ['29:function-machines-creating', '29:function-machines-forwards'],
    hint: `Put $${x}$ through the machine: $\\times ${a}$, then $${b < 0 ? '-' : '+'} ${Math.abs(b)}$.`,
    chain: [{ line: `${x} \\times ${a} = ${a * x}`, op: 'Box 1', why: `Put ${x} in: × ${a} first.` }, { line: `${a * x} ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${minus(y)}`, op: 'Box 2', why: `Then ${sign} ${Math.abs(b)}: out comes y.` }],
    mistakes: [{ answer: (x + b) * a, note: `Do × ${a} before ${sign} ${Math.abs(b)}: BIDMAS.` }],
  }
  return { stem: `For a function machine, $x$ goes in and $y$ comes out, where $y = ${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}$.`, parts: [pick, use] }
}

export const functionMachineTemplates: Template[] = [
  {
    id: 'function-machines-forwards', topic: 'function-machines', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A14.1 worksheet (two or three boxes, one negative input); AQA 2022–25 references still to be counted',
    variants: [forwards([['×', 4], ['+', 3]], 7), forwards([['÷', 3], ['−', 5]], 36), forwards([['×', 3], ['+', 7], ['÷', 2]], -7)],
  },
  {
    id: 'function-machines-backwards', topic: 'function-machines', ramp: 'multistep', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A14.2 worksheet (undo the last box first); AQA 2022–25 references still to be counted',
    variants: [backwards([['×', 5], ['−', 4]], 26), backwards([['+', 7], ['×', 2]], 30), backwards([['÷', 4], ['+', 9]], 2)],
  },
  {
    id: 'function-machines-creating', topic: 'function-machines', ramp: 'stretch', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A14.3 worksheet (y = ax + b as a machine); AQA 2022–25 references still to be counted',
    variants: [creating(3, 4, 5, 1), creating(5, -2, 3, 2), creating(2, 7, 6, 3)],
  },
]

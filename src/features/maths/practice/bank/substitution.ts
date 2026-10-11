/*
 * Practice templates for substitution (lesson 36): whole numbers into expressions, negatives and powers, and
 * formulae. Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for substitution yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import type { NumberPart, QuestionBody, Template } from '../types'

/** ax + by when x and y are whole numbers (2 marks). */
function linear(a: number, b: number, x: number, y: number): QuestionBody {
  const answer = a * x + b * y
  const part: NumberPart = {
    kind: 'number', prompt: `Work out the value of $${a}x + ${b}y$ when $x = ${x}$ and $y = ${y}$.`, answer, marks: 2, statements: ['36:substitution-expressions'],
    hint: `$${a}x$ means $${a} \\times x$. Multiply before you add.`,
    method: [{ prompt: `What is $${a} \\times ${x}$?`, answer: a * x }],
    chain: [{ line: `${a} \\times ${x} + ${b} \\times ${y}`, op: 'Swap the letters', why: 'Each letter becomes its number.' }, { line: `${a * x} + ${b * y} = ${answer}`, op: 'BIDMAS', why: 'Multiply first, then add.' }],
    mistakes: [{ answer: Number(`${a}${x}`) + Number(`${b}${y}`), note: `${a}x is ${a} × ${x}, not the digits side by side.` }],
  }
  return { stem: '', parts: [part] }
}

/** ax² + c when x is negative (2 marks). */
function squared(a: number, c: number, x: number): QuestionBody {
  const answer = a * x * x + c
  const part: NumberPart = {
    kind: 'number', prompt: `Work out the value of $${a}x^2 + ${c}$ when $x = ${x}$.`, answer, marks: 2, statements: ['36:substitution-negatives'],
    hint: 'Put the negative number in brackets. Square first: a negative squared is positive.',
    method: [{ prompt: `What is $(${x})^2$?`, answer: x * x }],
    chain: [{ line: `(${x})^2 = ${x * x}`, op: 'Indices first', why: 'Two negatives make a positive.' }, { line: `${a} \\times ${x * x} + ${c} = ${answer}`, op: 'Then multiply and add', why: 'Only x is squared, not the number in front.' }],
    mistakes: [{ answer: -a * x * x + c, note: `(${x})² is ${x} × ${x} = ${x * x}, which is positive.` }, { answer: (a * x) ** 2 + c, note: `Only x is squared: ${a} × (${x})², not (${a} × ${x})².` }],
  }
  return { stem: '', parts: [part] }
}

/** v = u + at (2 marks). */
function formula(u: number, a: number, t: number): QuestionBody {
  const answer = u + a * t
  const part: NumberPart = {
    kind: 'number', prompt: `Work out $v$ when $u = ${u}$, $a = ${a}$ and $t = ${t}$.`, answer, marks: 2, statements: ['36:substitution-formulae'],
    hint: '$at$ means $a \\times t$, worked out before adding.',
    method: [{ prompt: `What is $${a} \\times ${t}$?`, answer: a * t }],
    chain: [{ line: `v = ${u} + ${a} \\times ${t}`, op: 'Swap the letters', why: 'Each letter becomes its number.' }, { line: `v = ${u} + ${a * t} = ${answer}`, op: 'BIDMAS', why: 'Multiply first, then add.' }],
    mistakes: [{ answer: (u + a) * t, note: 'BIDMAS: multiply a × t before adding u.' }],
  }
  return { stem: 'The formula $v = u + at$ gives the speed of a moving object.', parts: [part] }
}

export const substitutionTemplates: Template[] = [
  { id: 'substitution-linear', topic: 'substitution', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: written for lesson 36; AQA 2022–25 references still to be counted',
    variants: [linear(3, 2, 4, 5), linear(5, 4, 3, 2), linear(2, 7, 6, 1)] },
  { id: 'substitution-squared', topic: 'substitution', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: written for lesson 36; AQA 2022–25 references still to be counted',
    variants: [squared(2, 5, -3), squared(3, 1, -2), squared(5, 4, -4)] },
  { id: 'substitution-formula', topic: 'substitution', ramp: 'apply', style: 'standard', context: 'none', calculator: true,
    inspiredBy: 'Estimate: written for lesson 36; AQA 2022–25 references still to be counted',
    variants: [formula(5, 3, 4), formula(12, 2.5, 6), formula(4, 9, 3)] },
]

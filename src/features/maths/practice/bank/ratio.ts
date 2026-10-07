/*
 * Practice templates for ratio problems (lesson 30, Ratio R1): a share from the difference between two parts, a ratio
 * that changes until two amounts are equal, and the form 1 : n. Original questions in the style of AQA Foundation
 * papers. The AQA 2022–25 references have not been counted for these skills yet, so `inspiredBy` says so, and the
 * weights in aqaWeights.ts are estimates.
 */
import type { NumberPart, QuestionBody, Template } from '../types'

const join = (list: (string | number)[]) => list.join(' : ')

/** Three shares in a ratio; one is `more` than another. Find a third share (2 marks, method: 1 part). */
function difference(names: [string, string, string], ratio: [number, number, number], big: number, small: number, want: number, more: number, what: string, pounds = false): QuestionBody {
  const parts = ratio[big] - ratio[small], one = more / parts, share = ratio[want] * one
  const amount = (n: number) => pounds ? `£${n}` : `${n}`
  const part: NumberPart = {
    kind: 'number', prompt: `How ${pounds ? 'much' : 'many'} does ${names[want]} get?`, answer: share, marks: 2, statements: ['30:ratio-difference'], prefix: pounds ? '£' : undefined,
    hint: `${amount(more)} is the difference between ${names[big]} and ${names[small]}, not the total. How many parts is that?`,
    method: [{ prompt: `What is 1 part worth? $${more} \\div ${parts} = ?$`, answer: one, prefix: pounds ? '£' : undefined }],
    chain: [
      { line: `${ratio[big]} - ${ratio[small]} = ${parts}`, op: 'The difference in parts', why: `${names[big]} has ${parts} more parts than ${names[small]}: those parts are the ${amount(more)}.` },
      { line: `${more} \\div ${parts} = ${one}`, op: 'Find 1 part', why: `Share the ${amount(more)} between the ${parts} parts.` },
      { line: `${ratio[want]} \\times ${one} = ${share}`, op: `${names[want]}’s share`, why: `${names[want]} has ${ratio[want]} parts.` },
    ],
    mistakes: [{ answer: more / (ratio[0] + ratio[1] + ratio[2]) * ratio[want], note: `${amount(more)} is the difference, not the total: use ${ratio[big]} − ${ratio[small]} = ${parts} parts.` }],
  }
  return { stem: `${names[0]}, ${names[1]} and ${names[2]} share ${what} in the ratio $${join(ratio)}$. ${names[big]} gets ${amount(more)} more than ${names[small]}.`, parts: [part] }
}

/** A : B = a : b. A gives B some, and then they have the same. How many did A have at first? (2 marks, method: x) */
function changing(names: [string, string], a: number, b: number, given: number, what: string): QuestionBody {
  const x = 2 * given / (a - b), first = a * x
  const part: NumberPart = {
    kind: 'number', prompt: `How many ${what} did ${names[0]} have at first?`, answer: first, marks: 2, statements: ['30:ratio-changing'],
    hint: `Call 1 part $x$: ${names[0]} has $${a}x$ and ${names[1]} has $${b}x$. Write each after the change and make them equal.`,
    method: [{ prompt: `Solve $${a}x - ${given} = ${b}x + ${given}$. What is $x$?`, answer: x }],
    chain: [
      { line: `${a}x - ${given} = ${b}x + ${given}`, op: 'After the change', why: `${names[0]} gives ${given} away and ${names[1]} gets them. Now they are equal.` },
      { line: `${a - b}x = ${2 * given}`, op: `− ${b}x, + ${given}`, why: 'Get x on one side, and the numbers on the other.' },
      { line: `x = ${x}`, op: `÷ ${a - b}`, why: 'x is 1 part.' },
      { line: `${a} \\times ${x} = ${first}`, op: `${names[0]} at first`, why: `${names[0]} had ${a} parts.` },
    ],
    mistakes: [{ answer: x, note: `That’s 1 part, x. ${names[0]} had ${a} parts.` }, { answer: first - given, note: `That’s how many ${names[0]} has now. The question asks for at first.` }],
  }
  return { stem: `The ratio of ${names[0]}’s ${what} to ${names[1]}’s ${what} is $${a} : ${b}$. ${names[0]} gives ${names[1]} ${given} ${what}. Now they have the same number of ${what}.`, parts: [part] }
}

/** a : b in the form 1 : n (1 mark). */
function unitForm(a: number, b: number, what: [string, string]): QuestionBody {
  const n = b / a
  const part: NumberPart = {
    kind: 'number', prompt: 'Write this ratio in the form $1 : n$. What is $n$?', answer: n, marks: 1, statements: ['30:ratio-unit-form'], prefix: 'n =',
    hint: `The first number must become 1. Divide both numbers by ${a}.`,
    chain: [
      { line: `${a} \\div ${a} = 1`, op: `÷ ${a}`, why: 'The first number must become 1.' },
      { line: `${b} \\div ${a} = ${n}`, op: `÷ ${a}`, why: 'Do the same to the other number.' },
    ],
    mistakes: [{ answer: b - a, note: `Divide, don’t subtract: ${b} ÷ ${a}.` }],
  }
  return { stem: `${what[0]} and ${what[1]} are mixed in the ratio $${a} : ${b}$.`, parts: [part] }
}

export const ratioTemplates: Template[] = [
  {
    id: 'ratio-difference', topic: 'ratio', ramp: 'multistep', style: 'standard', context: 'food', calculator: false,
    inspiredBy: 'Estimate: modelled on the R1.6 worksheet (the difference between two shares, not the total); AQA 2022–25 references still to be counted',
    variants: [
      difference(['Asha', 'Ben', 'Cara'], [2, 3, 7], 2, 0, 1, 35, 'some sweets'),
      difference(['Dan', 'Ella', 'Finn'], [5, 3, 1], 0, 2, 1, 28, 'some money', true),
      difference(['Gus', 'Hana', 'Ivy'], [3, 8, 6], 1, 0, 2, 40, 'some stickers'),
    ],
  },
  {
    id: 'ratio-changing', topic: 'ratio', ramp: 'stretch', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the R1.7 worksheet (call 1 part x and make the two amounts equal); AQA 2022–25 references still to be counted',
    variants: [changing(['Kai', 'Lily'], 5, 3, 4, 'stickers'), changing(['Maya', 'Nico'], 9, 5, 6, 'marbles'), changing(['Owen', 'Priya'], 8, 2, 9, 'cards')],
  },
  {
    id: 'ratio-unit-form', topic: 'ratio', ramp: 'apply', style: 'standard', context: 'home', calculator: false,
    inspiredBy: 'Estimate: modelled on the R1.8 worksheet (divide both by the first number; n can be a decimal); AQA 2022–25 references still to be counted',
    variants: [unitForm(4, 10, ['Cement', 'sand']), unitForm(2, 7, ['Squash', 'water']), unitForm(5, 30, ['Flour', 'oats'])],
  },
]

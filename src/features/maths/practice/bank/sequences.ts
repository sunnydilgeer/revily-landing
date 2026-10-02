/*
 * Practice templates for sequences (lesson 23, Algebra A9).
 * Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for sequences yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import { rotate } from '../helpers'
import type { ChoicePart, NumberPart, QuestionBody, Template } from '../types'

type Choice = { statement: string; prompt: string; options: string[]; lines: [string, string, string][]; hint: string }
function choicePart({ statement, prompt, options, lines, hint }: Choice, by: number): ChoicePart {
  return {
    kind: 'choice', prompt, marks: 1, statements: [statement], ...rotate(options.map(option => `$${option}$`), 0, by), hint,
    chain: lines.map(([line, op, why], i) => i === 0 ? { line } : { line, op, why }),
  }
}

/** Continue a special sequence, then a geometric one. */
const continuing = (special: Choice, geometric: Choice, by: number): QuestionBody => ({ stem: 'Work out the next term of each sequence.', parts: [choicePart(special, by), choicePart(geometric, by + 1)] })

/** Find the nth term, then use it: a 2-mark number part with the times table as its method mark. */
type Nth = { stem: string; nth: Choice; position: number; gap: number; first: number }
function nthSet({ stem, nth, position, gap, first }: Nth, by: number): QuestionBody {
  const b = first - gap, answer = gap * position + b
  const use: NumberPart = {
    kind: 'number', prompt: `Work out the ${position}th term.`, answer, marks: 2, statements: ['23:sequences-nth-term'],
    hint: `Put n = ${position} into your nth term.`,
    method: [{ prompt: `What is ${gap} × ${position}?`, answer: gap * position }],
    chain: [{ line: `${gap} \\times ${position} = ${gap * position}` }, { line: `${gap * position} ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${answer}`, op: b < 0 ? `Subtract ${-b}` : `Add ${b}`, why: 'Then add or take away the number in the nth term.' }],
    mistakes: [{ answer: gap * position, note: `Don’t forget the ${b < 0 ? `− ${-b}` : `+ ${b}`} in the nth term.` }, { answer: first + gap * position, note: `That starts from the first term and adds ${position} gaps. The ${position}th term only has ${position - 1} gaps after the first: use the nth term.` }],
  }
  return { stem, parts: [choicePart(nth, by), use] }
}

/** Two terms next to each other: is a total possible (choice), then find n (2 marks, method: the n term). */
type Pair = { stem: string; check: Choice; a: number; b: number; total: number }
function pairSet({ stem, check, a, b, total }: Pair, by: number): QuestionBody {
  const constant = a + 2 * b, n = (total - constant) / (2 * a)
  const find: NumberPart = {
    kind: 'number', prompt: `Two terms next to each other add to ${total}. Find the value of n for the first one.`, answer: n, marks: 2, statements: ['23:sequences-consecutive'],
    hint: 'The next term is the (n + 1)th. Add the two, put them equal to the total and solve.',
    method: [{ prompt: `The two terms add to ${2 * a}n ${constant < 0 ? '−' : '+'} ${Math.abs(constant)}. What is ${2 * a}n?`, answer: total - constant }],
    chain: [{ line: `${2 * a}n ${constant < 0 ? '-' : '+'} ${Math.abs(constant)} = ${total}` }, { line: `${2 * a}n = ${total - constant}`, op: constant < 0 ? `Add ${-constant}` : `Subtract ${constant}`, why: 'Undo the number on both sides.' }, { line: `n = ${n}`, op: `Divide by ${2 * a}`, why: 'Leave n on its own.' }],
    mistakes: [{ answer: n + 1, note: 'That’s the second term’s position. n is the first one.' }],
  }
  return { stem, parts: [choicePart(check, by), find] }
}

export const sequencesTemplates: Template[] = [
  {
    id: 'sequences-continue', topic: 'sequences', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A9.4 and A9.5 worksheets (special and geometric sequences); AQA 2022–25 references still to be counted',
    variants: [
      continuing(
        { statement: '23:sequences-special', prompt: 'Work out the next term of $1, 4, 9, 16, \\dots$', options: ['25', '23', '20', '32'], lines: [['1, 4, 9, 16', '', ''], ['5 \\times 5 = 25', 'The 5th square number', 'Each term is its position times itself.']], hint: 'These are the square numbers.' },
        { statement: '23:sequences-geometric', prompt: 'Work out the next term of $2, 6, 18, 54, \\dots$', options: ['162', '90', '108', '58'], lines: [['2, 6, 18, 54', '', ''], ['54 \\times 3 = 162', 'Multiply by 3', '6 ÷ 2 = 3, so the common ratio is 3.']], hint: 'Divide a term by the one before to find the ratio.' }, 0),
      continuing(
        { statement: '23:sequences-special', prompt: 'Work out the next term of $1, 3, 6, 10, 15, \\dots$', options: ['21', '20', '25', '30'], lines: [['1, 3, 6, 10, 15', '', ''], ['15 + 6 = 21', 'The next gap is 6', 'The gaps are 2, 3, 4, 5: each is 1 more.']], hint: 'Look at how the gaps change.' },
        { statement: '23:sequences-geometric', prompt: 'Work out the next term of $5, 10, 20, 40, \\dots$', options: ['80', '60', '50', '45'], lines: [['5, 10, 20, 40', '', ''], ['40 \\times 2 = 80', 'Multiply by 2', '10 ÷ 5 = 2, so the common ratio is 2.']], hint: 'Divide a term by the one before to find the ratio.' }, 1),
      continuing(
        { statement: '23:sequences-special', prompt: 'Work out the next term of $1, 1, 2, 3, 5, 8, \\dots$', options: ['13', '11', '16', '10'], lines: [['1, 1, 2, 3, 5, 8', '', ''], ['5 + 8 = 13', 'Add the two before', 'Each term is the two terms before it added.']], hint: 'This is the Fibonacci sequence.' },
        { statement: '23:sequences-geometric', prompt: 'Work out the next term of $3, 12, 48, \\dots$', options: ['192', '84', '96', '57'], lines: [['3, 12, 48', '', ''], ['48 \\times 4 = 192', 'Multiply by 4', '12 ÷ 3 = 4, so the common ratio is 4.']], hint: 'Divide a term by the one before to find the ratio.' }, 2),
    ],
  },
  {
    id: 'sequences-nth-term', topic: 'sequences', ramp: 'multistep', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A9.1 worksheet and textbook A9 (find the nth term, then use it); AQA 2022–25 references still to be counted',
    variants: [
      nthSet({ stem: 'Here are the first terms of a sequence: $4, 7, 10, 13, \\dots$', nth: { statement: '23:sequences-nth-term', prompt: 'Find the nth term.', options: ['3n + 1', 'n + 3', '3n + 4', '4n + 3'], lines: [['4, 7, 10, 13', '', ''], ['3n + 1', 'Gap 3, then add 1', '3n gives 3, 6, 9, 12: each term is 1 more.']], hint: 'The gap goes in front of n.' }, position: 20, gap: 3, first: 4 }, 0),
      nthSet({ stem: 'Here are the first terms of a sequence: $3, 8, 13, 18, \\dots$', nth: { statement: '23:sequences-nth-term', prompt: 'Find the nth term.', options: ['5n - 2', 'n + 5', '5n + 3', '5n + 2'], lines: [['3, 8, 13, 18', '', ''], ['5n - 2', 'Gap 5, then subtract 2', '5n gives 5, 10, 15, 20: each term is 2 less.']], hint: 'The gap goes in front of n.' }, position: 10, gap: 5, first: 3 }, 1),
      nthSet({ stem: 'Here are the first terms of a sequence: $9, 15, 21, 27, \\dots$', nth: { statement: '23:sequences-nth-term', prompt: 'Find the nth term.', options: ['6n + 3', 'n + 6', '6n + 9', '9n + 6'], lines: [['9, 15, 21, 27', '', ''], ['6n + 3', 'Gap 6, then add 3', '6n gives 6, 12, 18, 24: each term is 3 more.']], hint: 'The gap goes in front of n.' }, position: 12, gap: 6, first: 9 }, 2),
    ],
  },
  {
    id: 'sequences-terms', topic: 'sequences', ramp: 'stretch', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A9.2 and A9.3 worksheets (is it a term, terms next to each other); AQA 2022–25 references still to be counted',
    variants: [
      pairSet({ stem: 'A sequence has nth term $4n + 3$.', check: { statement: '23:sequences-in-sequence', prompt: 'Is 50 a term of this sequence?', options: ['\\text{No: } n = 11.75', '\\text{Yes: } n = 12', '\\text{Yes: } n = 13.25', '\\text{No: 50 is even}'], lines: [['4n + 3 = 50', '', ''], ['4n = 47', 'Subtract 3', 'Undo the + 3.'], ['n = 11.75', 'Divide by 4', 'Not a whole number, so 50 is not a term.']], hint: 'Put 4n + 3 equal to 50 and solve for n.' }, a: 4, b: 3, total: 50 }, 0),
      pairSet({ stem: 'A sequence has nth term $5n + 1$.', check: { statement: '23:sequences-in-sequence', prompt: 'Is 76 a term of this sequence?', options: ['\\text{Yes: } n = 15', '\\text{No: } n = 15.4', '\\text{No: 76 is even}', '\\text{Yes: } n = 76'], lines: [['5n + 1 = 76', '', ''], ['5n = 75', 'Subtract 1', 'Undo the + 1.'], ['n = 15', 'Divide by 5', 'A whole number, so 76 is the 15th term.']], hint: 'Put 5n + 1 equal to 76 and solve for n.' }, a: 5, b: 1, total: 57 }, 1),
      pairSet({ stem: 'A sequence has nth term $3n - 1$.', check: { statement: '23:sequences-in-sequence', prompt: 'Is 41 a term of this sequence?', options: ['\\text{Yes: } n = 14', '\\text{No: } n = 13.33\\dots', '\\text{Yes: } n = 41', '\\text{No: 41 is odd}'], lines: [['3n - 1 = 41', '', ''], ['3n = 42', 'Add 1', 'Undo the − 1.'], ['n = 14', 'Divide by 3', 'A whole number, so 41 is the 14th term.']], hint: 'Put 3n − 1 equal to 41 and solve for n.' }, a: 3, b: -1, total: 37 }, 2),
    ],
  },
]

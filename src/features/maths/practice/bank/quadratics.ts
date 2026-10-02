/*
 * Practice templates for factorising quadratics into two brackets (lesson 21, Algebra A7).
 * Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for factorising quadratics yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import { rotate } from '../helpers'
import type { ChoicePart, NumberPart, QuestionBody, Template } from '../types'

/** One "factorise" choice: the right brackets are first in `options`, the wrong ones are the usual slips. */
type Factorise = { statement: string; question: string; options: string[]; pair: string; why: string }

function factorisePart({ statement, question, options, pair, why }: Factorise, by: number): ChoicePart {
  return {
    kind: 'choice', prompt: `Factorise $${question}$`, marks: 1, statements: [statement], ...rotate(options.map(option => `$${option}$`), 0, by),
    hint: 'Find two numbers that multiply to the last number and add to the number in front of x.',
    chain: [{ line: question }, { line: `= ${options[0]}`, op: `Use ${pair}`, why }],
  }
}

const pair = (parts: [Factorise, Factorise], by: number): QuestionBody => ({ stem: 'Factorise each of these.', parts: parts.map((part, i) => factorisePart(part, by + i)) })

/** Factorise an area, then work out a side: a 2-mark number part, with one bracket's value as its method mark. */
type Area = { stem: string; factorise: Factorise; prompt: string; answer: number; lines: [string, string, string][]; method: [string, number]; mistakes: [number, string][] }
function areaSet({ stem, factorise, prompt, answer, lines, method, mistakes }: Area, by: number): QuestionBody {
  const side: NumberPart = {
    kind: 'number', prompt, answer, suffix: 'm²', marks: 2, statements: [factorise.statement],
    hint: 'Put the number in for x in each bracket, then multiply.',
    method: [{ prompt: method[0], answer: method[1] }],
    chain: lines.map(([line, op, why], i) => i === 0 ? { line } : { line, op, why }),
    mistakes: mistakes.map(([wrong, note]) => ({ answer: wrong, note })),
  }
  return { stem, parts: [factorisePart(factorise, by), side] }
}

export const quadraticsTemplates: Template[] = [
  {
    id: 'quadratics-same-signs', topic: 'simplifying', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A7.1 and A7.2 worksheets (all positive, negative middle term); AQA 2022–25 references still to be counted',
    variants: [
      pair([
        { statement: '21:quadratics-positive', question: 'x^2 + 7x + 12', options: ['(x + 3)(x + 4)', '(x + 2)(x + 6)', '(x + 1)(x + 12)', '(x - 3)(x - 4)'], pair: '3 and 4', why: '3 × 4 = 12 and 3 + 4 = 7.' },
        { statement: '21:quadratics-negative-middle', question: 'x^2 - 8x + 15', options: ['(x - 3)(x - 5)', '(x + 3)(x + 5)', '(x - 3)(x + 5)', '(x - 1)(x - 15)'], pair: '−3 and −5', why: '−3 × −5 = 15 and −3 + −5 = −8.' },
      ], 0),
      pair([
        { statement: '21:quadratics-positive', question: 'x^2 + 9x + 18', options: ['(x + 3)(x + 6)', '(x + 2)(x + 9)', '(x + 1)(x + 18)', '(x + 9)(x + 18)'], pair: '3 and 6', why: '3 × 6 = 18 and 3 + 6 = 9.' },
        { statement: '21:quadratics-negative-middle', question: 'x^2 - 7x + 10', options: ['(x - 2)(x - 5)', '(x + 2)(x + 5)', '(x - 2)(x + 5)', '(x - 1)(x - 10)'], pair: '−2 and −5', why: '−2 × −5 = 10 and −2 + −5 = −7.' },
      ], 1),
      pair([
        { statement: '21:quadratics-positive', question: 'x^2 + 11x + 24', options: ['(x + 3)(x + 8)', '(x + 4)(x + 6)', '(x + 2)(x + 12)', '(x + 1)(x + 24)'], pair: '3 and 8', why: '3 × 8 = 24 and 3 + 8 = 11.' },
        { statement: '21:quadratics-negative-middle', question: 'x^2 - 9x + 14', options: ['(x - 2)(x - 7)', '(x + 2)(x + 7)', '(x - 2)(x + 7)', '(x - 1)(x - 14)'], pair: '−2 and −7', why: '−2 × −7 = 14 and −2 + −7 = −9.' },
      ], 2),
    ],
  },
  {
    id: 'quadratics-mixed-signs', topic: 'simplifying', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A7.3 and A7.4 worksheets (negative last term, difference of two squares); AQA 2022–25 references still to be counted',
    variants: [
      pair([
        { statement: '21:quadratics-negative-last', question: 'x^2 + 4x - 12', options: ['(x - 2)(x + 6)', '(x + 2)(x - 6)', '(x - 3)(x + 4)', '(x - 2)(x - 6)'], pair: '−2 and 6', why: '−2 × 6 = −12 and −2 + 6 = 4.' },
        { statement: '21:quadratics-difference-of-squares', question: 'x^2 - 64', options: ['(x + 8)(x - 8)', '(x - 8)(x - 8)', '(x + 8)(x + 8)', '(x + 32)(x - 32)'], pair: '8 and −8', why: '64 = 8², and one plus, one minus makes the middle terms cancel.' },
      ], 0),
      pair([
        { statement: '21:quadratics-negative-last', question: 'x^2 - x - 20', options: ['(x + 4)(x - 5)', '(x - 4)(x + 5)', '(x - 4)(x - 5)', '(x + 2)(x - 10)'], pair: '4 and −5', why: '4 × −5 = −20 and 4 + −5 = −1.' },
        { statement: '21:quadratics-difference-of-squares', question: 'x^2 - 9', options: ['(x + 3)(x - 3)', '(x - 3)(x - 3)', '(x + 9)(x - 1)', '(x + 4.5)(x - 4.5)'], pair: '3 and −3', why: '9 = 3², and one plus, one minus makes the middle terms cancel.' },
      ], 1),
      pair([
        { statement: '21:quadratics-negative-last', question: 'x^2 + 2x - 8', options: ['(x - 2)(x + 4)', '(x + 2)(x - 4)', '(x - 1)(x + 8)', '(x + 2)(x + 4)'], pair: '−2 and 4', why: '−2 × 4 = −8 and −2 + 4 = 2.' },
        { statement: '21:quadratics-difference-of-squares', question: 'y^2 - 121', options: ['(y + 11)(y - 11)', '(y - 11)(y - 11)', '(y + 11)(y + 11)', '(y + 60.5)(y - 60.5)'], pair: '11 and −11', why: '121 = 11², and one plus, one minus makes the middle terms cancel.' },
      ], 2),
    ],
  },
  {
    id: 'quadratics-area', topic: 'simplifying', ramp: 'multistep', style: 'standard', context: 'home', calculator: false,
    inspiredBy: 'Estimate: modelled on the A7.1–A7.4 worksheets (factorise an area, then put in a value); AQA 2022–25 references still to be counted',
    variants: [
      areaSet({
        stem: 'A rectangular rug has an area of $x^2 + 6x + 8$ square metres.',
        factorise: { statement: '21:quadratics-positive', question: 'x^2 + 6x + 8', options: ['(x + 2)(x + 4)', '(x + 1)(x + 8)', '(x + 6)(x + 8)', '(x + 3)(x + 3)'], pair: '2 and 4', why: '2 × 4 = 8 and 2 + 4 = 6.' },
        prompt: 'Use your brackets to work out the area when $x = 5$.', answer: 63,
        lines: [['(5 + 2)(5 + 4)', '', ''], ['7 \\times 9', 'Work out each bracket', '5 + 2 = 7 and 5 + 4 = 9.'], ['63', 'Multiply', '7 × 9 = 63.']],
        method: ['What is 5 + 2?', 7], mistakes: [[16, 'The brackets multiply: 7 × 9 = 63, not 7 + 9.']],
      }, 0),
      areaSet({
        stem: 'A rectangular patio has an area of $x^2 + 7x + 10$ square metres.',
        factorise: { statement: '21:quadratics-positive', question: 'x^2 + 7x + 10', options: ['(x + 2)(x + 5)', '(x + 1)(x + 10)', '(x + 7)(x + 10)', '(x - 2)(x - 5)'], pair: '2 and 5', why: '2 × 5 = 10 and 2 + 5 = 7.' },
        prompt: 'Use your brackets to work out the area when $x = 4$.', answer: 54,
        lines: [['(4 + 2)(4 + 5)', '', ''], ['6 \\times 9', 'Work out each bracket', '4 + 2 = 6 and 4 + 5 = 9.'], ['54', 'Multiply', '6 × 9 = 54.']],
        method: ['What is 4 + 2?', 6], mistakes: [[15, 'The brackets multiply: 6 × 9 = 54, not 6 + 9.']],
      }, 1),
      areaSet({
        stem: 'A rectangular lawn has an area of $x^2 + 5x + 6$ square metres.',
        factorise: { statement: '21:quadratics-positive', question: 'x^2 + 5x + 6', options: ['(x + 2)(x + 3)', '(x + 1)(x + 6)', '(x + 5)(x + 6)', '(x - 2)(x - 3)'], pair: '2 and 3', why: '2 × 3 = 6 and 2 + 3 = 5.' },
        prompt: 'Use your brackets to work out the area when $x = 7$.', answer: 90,
        lines: [['(7 + 2)(7 + 3)', '', ''], ['9 \\times 10', 'Work out each bracket', '7 + 2 = 9 and 7 + 3 = 10.'], ['90', 'Multiply', '9 × 10 = 90.']],
        method: ['What is 7 + 2?', 9], mistakes: [[19, 'The brackets multiply: 9 × 10 = 90, not 9 + 10.']],
      }, 2),
    ],
  },
]

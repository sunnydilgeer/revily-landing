/*
 * Practice templates for solving quadratics by factorising (lesson 22, Algebra A8).
 * Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for solving quadratics yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import { rotate } from '../helpers'
import type { ChoicePart, NumberPart, QuestionBody, Template } from '../types'

const statement = '22:quadratic-equations'

/** One "solve" choice: the right answers are first in `options`, the wrong ones are the usual slips. */
type Solve = { prompt: string; zero?: string; brackets: string; options: string[]; why: string }

function solvePart({ prompt, zero, brackets, options, why }: Solve, by: number): ChoicePart {
  const answer = options[0]
  return {
    kind: 'choice', prompt, marks: 1, statements: [statement], ...rotate(options.map(option => `$${option}$`), 0, by),
    hint: 'Make one side 0, factorise, then set each bracket equal to 0.',
    chain: [
      ...(zero ? [{ line: zero }] : []),
      { line: `${brackets} = 0`, op: 'Factorise', why },
      { line: answer, op: 'One bracket must be 0', why: 'Each answer is the opposite of the number in its bracket.' },
    ],
  }
}

const pair = (parts: [Solve, Solve], by: number): QuestionBody => ({ stem: 'Solve each of these.', parts: parts.map((part, i) => solvePart(part, by + i)) })

/** Solve for the width of a rectangle, then work out its length: a 2-mark number part, with the width as its method mark. */
type Rectangle = { stem: string; solve: Solve; width: number; plus: number; mistakes: [number, string][] }
function rectangleSet({ stem, solve, width, plus, mistakes }: Rectangle, by: number): QuestionBody {
  const length: NumberPart = {
    kind: 'number', prompt: 'Work out the length of the rectangle.', answer: width + plus, suffix: 'm', marks: 2, statements: [statement],
    hint: 'A width can’t be negative. The length is the width plus ' + plus + '.',
    method: [{ prompt: 'What is the width, x?', answer: width, suffix: 'm' }],
    chain: [{ line: `x = ${width}` }, { line: `${width} + ${plus} = ${width + plus}`, op: `Add ${plus}`, why: `The width is the positive answer, and the length is x + ${plus}.` }],
    mistakes: mistakes.map(([wrong, note]) => ({ answer: wrong, note })),
  }
  return { stem, parts: [solvePart(solve, by), length] }
}

export const quadraticEquationsTemplates: Template[] = [
  {
    id: 'quadratic-equations-zero', topic: 'equations', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A8.1 worksheet (equations already equal to 0); AQA 2022–25 references still to be counted',
    variants: [
      pair([
        { prompt: 'Solve $x^2 + 7x + 12 = 0$', brackets: '(x + 3)(x + 4)', options: ['x = -3 \\text{ or } x = -4', 'x = 3 \\text{ or } x = 4', 'x = -3 \\text{ or } x = 4', 'x = 7 \\text{ or } x = 12'], why: '3 × 4 = 12 and 3 + 4 = 7.' },
        { prompt: 'Solve $x^2 - x - 6 = 0$', brackets: '(x + 2)(x - 3)', options: ['x = -2 \\text{ or } x = 3', 'x = 2 \\text{ or } x = -3', 'x = 2 \\text{ or } x = 3', 'x = -1 \\text{ or } x = 6'], why: '2 × −3 = −6 and 2 + −3 = −1.' },
      ], 0),
      pair([
        { prompt: 'Solve $x^2 - 8x + 15 = 0$', brackets: '(x - 3)(x - 5)', options: ['x = 3 \\text{ or } x = 5', 'x = -3 \\text{ or } x = -5', 'x = 3 \\text{ or } x = -5', 'x = 8 \\text{ or } x = 15'], why: '−3 × −5 = 15 and −3 + −5 = −8.' },
        { prompt: 'Solve $x^2 + 2x - 8 = 0$', brackets: '(x - 2)(x + 4)', options: ['x = 2 \\text{ or } x = -4', 'x = -2 \\text{ or } x = 4', 'x = 2 \\text{ or } x = 4', 'x = -2 \\text{ or } x = 8'], why: '−2 × 4 = −8 and −2 + 4 = 2.' },
      ], 1),
      pair([
        { prompt: 'Solve $x^2 + 9x + 20 = 0$', brackets: '(x + 4)(x + 5)', options: ['x = -4 \\text{ or } x = -5', 'x = 4 \\text{ or } x = 5', 'x = -4 \\text{ or } x = 5', 'x = 9 \\text{ or } x = 20'], why: '4 × 5 = 20 and 4 + 5 = 9.' },
        { prompt: 'Solve $x^2 - 3x - 10 = 0$', brackets: '(x + 2)(x - 5)', options: ['x = -2 \\text{ or } x = 5', 'x = 2 \\text{ or } x = -5', 'x = 2 \\text{ or } x = 5', 'x = -3 \\text{ or } x = 10'], why: '2 × −5 = −10 and 2 + −5 = −3.' },
      ], 2),
    ],
  },
  {
    id: 'quadratic-equations-make-zero', topic: 'equations', ramp: 'multistep', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A8.1 video and textbook A8 (make one side 0 first); AQA 2022–25 references still to be counted',
    variants: [
      { stem: 'Solve this equation.', parts: [solvePart({ prompt: 'Solve $x^2 + 2x = 24$', zero: 'x^2 + 2x - 24 = 0', brackets: '(x - 4)(x + 6)', options: ['x = 4 \\text{ or } x = -6', 'x = -4 \\text{ or } x = 6', 'x = 0 \\text{ or } x = -2', 'x = 24 \\text{ or } x = 22'], why: '−4 × 6 = −24 and −4 + 6 = 2.' }, 0)] },
      { stem: 'Solve this equation.', parts: [solvePart({ prompt: 'Solve $x^2 - 5x = 14$', zero: 'x^2 - 5x - 14 = 0', brackets: '(x + 2)(x - 7)', options: ['x = -2 \\text{ or } x = 7', 'x = 2 \\text{ or } x = -7', 'x = 0 \\text{ or } x = 5', 'x = 14 \\text{ or } x = 19'], why: '2 × −7 = −14 and 2 + −7 = −5.' }, 1)] },
      { stem: 'Solve this equation.', parts: [solvePart({ prompt: 'Solve $x^2 + x = 12$', zero: 'x^2 + x - 12 = 0', brackets: '(x - 3)(x + 4)', options: ['x = 3 \\text{ or } x = -4', 'x = -3 \\text{ or } x = 4', 'x = 0 \\text{ or } x = -1', 'x = 12 \\text{ or } x = 11'], why: '−3 × 4 = −12 and −3 + 4 = 1.' }, 2)] },
    ],
  },
  {
    id: 'quadratic-equations-rectangle', topic: 'equations', ramp: 'multistep', style: 'standard', context: 'home', calculator: false,
    inspiredBy: 'Estimate: modelled on the A8.1 worksheet Q4 and Q5 (a rectangle’s area as a quadratic); AQA 2022–25 references still to be counted',
    variants: [
      rectangleSet({
        stem: 'A rectangle has width $x$ metres and length $(x + 3)$ metres. Its area is 28 m², so $x^2 + 3x - 28 = 0$.',
        solve: { prompt: 'Solve $x^2 + 3x - 28 = 0$', brackets: '(x - 4)(x + 7)', options: ['x = 4 \\text{ or } x = -7', 'x = -4 \\text{ or } x = 7', 'x = 4 \\text{ or } x = 7', 'x = 3 \\text{ or } x = 28'], why: '−4 × 7 = −28 and −4 + 7 = 3.' },
        width: 4, plus: 3, mistakes: [[4, 'That’s the width. The length is x + 3.'], [-4, 'Use the positive answer: a width can’t be −7.']],
      }, 0),
      rectangleSet({
        stem: 'A rectangle has width $x$ metres and length $(x + 2)$ metres. Its area is 35 m², so $x^2 + 2x - 35 = 0$.',
        solve: { prompt: 'Solve $x^2 + 2x - 35 = 0$', brackets: '(x - 5)(x + 7)', options: ['x = 5 \\text{ or } x = -7', 'x = -5 \\text{ or } x = 7', 'x = 5 \\text{ or } x = 7', 'x = 2 \\text{ or } x = 35'], why: '−5 × 7 = −35 and −5 + 7 = 2.' },
        width: 5, plus: 2, mistakes: [[5, 'That’s the width. The length is x + 2.'], [-5, 'Use the positive answer: a width can’t be −7.']],
      }, 1),
      rectangleSet({
        stem: 'A rectangle has width $x$ metres and length $(x + 4)$ metres. Its area is 45 m², so $x^2 + 4x - 45 = 0$.',
        solve: { prompt: 'Solve $x^2 + 4x - 45 = 0$', brackets: '(x - 5)(x + 9)', options: ['x = 5 \\text{ or } x = -9', 'x = -5 \\text{ or } x = 9', 'x = 5 \\text{ or } x = 9', 'x = 4 \\text{ or } x = 45'], why: '−5 × 9 = −45 and −5 + 9 = 4.' },
        width: 5, plus: 4, mistakes: [[5, 'That’s the width. The length is x + 4.'], [-5, 'Use the positive answer: a width can’t be −9.']],
      }, 2),
    ],
  },
]

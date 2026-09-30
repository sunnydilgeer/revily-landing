/*
 * Practice templates for factorising into a single bracket (lesson 18, Algebra A4).
 * Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for factorising yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import { rotate } from '../helpers'
import type { ChoicePart, QuestionBody, SpotPart, Template } from '../types'

type Factorise = { statement: string; question: string; options: string[]; op: string; why: string }

/** A "factorise fully" choice: the right answer is first in `options`, and the wrong ones are the usual slips. */
function factorisePart({ statement, question, options, op, why }: Factorise, by: number): ChoicePart {
  return {
    kind: 'choice', prompt: `Factorise fully $${question}$`, marks: 1, statements: [statement], ...rotate(options.map(option => `$${option}$`), 0, by),
    hint: 'Find the biggest number and the letters that go into every term. Take them outside, and divide each term by them.',
    chain: [{ line: question }, { line: `= ${options[0]}`, op, why }],
  }
}

function factoriseSet(parts: [Factorise, Factorise], by: number): QuestionBody {
  return { stem: 'Factorise each of these fully.', parts: parts.map((part, i) => factorisePart(part, by + i)) }
}

type Spot = { name: string; question: string; lines: string[]; wrong: number; reason: string; answer: string[]; statement: string }
function spotSet({ name, question, lines, wrong, reason, answer, statement }: Spot, by: number): QuestionBody {
  const spot: SpotPart = {
    kind: 'spot', prompt: `${name} factorised $${question}$. Tap the first line that is wrong.`, marks: 1, statements: [statement], lines, wrong,
    hint: 'Expand each line back out. Does it still give the question?', reason,
  }
  const fix: ChoicePart = {
    kind: 'choice', prompt: `What should ${name}’s answer be?`, marks: 1, statements: [statement], ...rotate(answer.map(option => `$${option}$`), 0, by),
    hint: 'Take out the biggest common factor, then divide every term by it.',
    chain: [{ line: question }, { line: `= ${answer[0]}`, op: 'Take out the highest common factor', why: reason }],
  }
  return { stem: 'Spot the mistake.', parts: [spot, fix] }
}

export const factorisingTemplates: Template[] = [
  {
    id: 'factorise-fully', topic: 'simplifying', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A4 worksheets (factorise two and three terms fully); AQA 2022–25 references still to be counted',
    variants: [
      factoriseSet([
        { statement: '18:factorise-two-terms', question: '8x^2 + 12x', options: ['4x(2x + 3)', '4(2x^2 + 3x)', 'x(8x + 12)', '4x(2x + 12)'], op: 'Take out 4x', why: '4 is the biggest number in 8 and 12, and both terms have an x. 8x² ÷ 4x = 2x and 12x ÷ 4x = 3.' },
        { statement: '18:factorise-three-terms', question: '6a + 9b + 3', options: ['3(2a + 3b + 1)', '3(2a + 3b)', '3(2a + 3b + 3)', '6(a + 3b + 1)'], op: 'Take out 3', why: 'Only 3 goes into 6, 9 and 3. 3 ÷ 3 = 1, so the 1 stays in the bracket.' },
      ], 0),
      factoriseSet([
        { statement: '18:factorise-two-terms', question: '10y^2 - 15y', options: ['5y(2y - 3)', '5y(2y + 3)', '5(2y^2 - 3y)', 'y(10y - 15)'], op: 'Take out 5y', why: '5 is the biggest number in 10 and 15, and both terms have a y. 10y² ÷ 5y = 2y and −15y ÷ 5y = −3.' },
        { statement: '18:factorise-three-terms', question: '4x^2 + 8x + 12xy', options: ['4x(x + 2 + 3y)', '4(x^2 + 2x + 3xy)', 'x(4x + 8 + 12y)', '4x(x + 2x + 3y)'], op: 'Take out 4x', why: '4 goes into 4, 8 and 12, and every term has an x. 4x² ÷ 4x = x, 8x ÷ 4x = 2 and 12xy ÷ 4x = 3y.' },
      ], 1),
      factoriseSet([
        { statement: '18:factorise-two-terms', question: '14ab + 21b^2', options: ['7b(2a + 3b)', '7(2ab + 3b^2)', 'b(14a + 21b)', '7b(2a + 21b)'], op: 'Take out 7b', why: '7 is the biggest number in 14 and 21, and both terms have a b. 14ab ÷ 7b = 2a and 21b² ÷ 7b = 3b.' },
        { statement: '18:factorise-three-terms', question: '6k^3 + 9k^2 - 3k', options: ['3k(2k^2 + 3k - 1)', '3k(2k^2 + 3k)', '3(2k^3 + 3k^2 - k)', '3k(2k^2 + 3k + 1)'], op: 'Take out 3k', why: '3 goes into 6, 9 and 3, and every term has a k. −3k ÷ 3k = −1: the sign stays.' },
      ], 2),
    ],
  },
  {
    id: 'factorise-spot', topic: 'simplifying', ramp: 'apply', style: 'errorSpot', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A4 worksheet "what mistake has he made?" questions; AQA 2022–25 references still to be counted',
    variants: [
      spotSet({ name: 'Kim', statement: '18:factorise-three-terms', question: '6x^2 + 9x + 12xy', lines: ['6x^2 + 9x + 12xy', '= 3(2x^2 + 3x + 4xy)'], wrong: 1, reason: '2x², 3x and 4xy still share an x, so it isn’t fully factorised. Take out 3x: 3x(2x + 3 + 4y).', answer: ['3x(2x + 3 + 4y)', '3(2x^2 + 3x + 4xy)', 'x(6x + 9 + 12y)', '3x(2x + 3x + 4y)'] }, 0),
      spotSet({ name: 'Ravi', statement: '18:factorise-three-terms', question: '8x^2 + 12x + 4', lines: ['8x^2 + 12x + 4', '= 4(2x^2 + 3x)'], wrong: 1, reason: '4 ÷ 4 = 1, so the last term is 1, not nothing. Expanding 4(2x² + 3x) gives 8x² + 12x: the + 4 is lost.', answer: ['4(2x^2 + 3x + 1)', '4(2x^2 + 3x)', '4x(2x + 3 + 1)', '4(2x^2 + 3x + 4)'] }, 1),
      spotSet({ name: 'Sam', statement: '18:factorise-three-terms', question: '10k^3 + 15k^2 - 5k', lines: ['10k^3 + 15k^2 - 5k', '= 5k(2k^2 + 3k + 1)'], wrong: 1, reason: '−5k ÷ 5k = −1: the last term keeps its minus sign. So it is 5k(2k² + 3k − 1).', answer: ['5k(2k^2 + 3k - 1)', '5k(2k^2 + 3k + 1)', '5k(2k^2 + 3k)', '5(2k^3 + 3k^2 - k)'] }, 2),
    ],
  },
]

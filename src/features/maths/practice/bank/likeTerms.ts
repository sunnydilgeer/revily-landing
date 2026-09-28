/*
 * Practice templates for collecting like terms (lesson 15, Algebra A1).
 * Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for simplifying yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import { rotate } from '../helpers'
import type { ChoicePart, QuestionBody, SpotPart, Template } from '../types'

type Simplify = { statement: string; expression: string; options: string[]; why: string }

/** A "simplify" choice: the right answer is first in `options`, and the wrong ones are the usual slips. */
function simplifyPart({ statement, expression, options, why }: Simplify, by: number): ChoicePart {
  return {
    kind: 'choice', prompt: `Simplify $${expression}$`, marks: 1, statements: [statement], ...rotate(options.map(option => `$${option}$`), 0, by),
    hint: 'Like terms have exactly the same letters and powers. Keep each sign with the term after it.',
    chain: [{ line: expression }, { line: `= ${options[0]}`, op: 'Collect like terms', why }],
  }
}

function collectSet(parts: [Simplify, Simplify, Simplify], by: number): QuestionBody {
  return { stem: 'Simplify each expression.', parts: parts.map((part, i) => simplifyPart(part, by + i)) }
}

type Spot = { name: string; expression: string; lines: string[]; wrong: number; reason: string; answer: string[] }

function spotSet({ name, expression, lines, wrong, reason, answer }: Spot, by: number): QuestionBody {
  const spot: SpotPart = {
    kind: 'spot', prompt: `${name} simplified $${expression}$. Tap the first line that is wrong.`, marks: 1, statements: ['15:like-terms-mixed'], lines, wrong,
    hint: 'Check each line: are only like terms being added, and does every sign stay with its term?', reason,
  }
  const fix: ChoicePart = {
    kind: 'choice', prompt: `What should ${name}’s answer be?`, marks: 1, statements: ['15:like-terms-mixed'], ...rotate(answer.map(option => `$${option}$`), 0, by),
    hint: 'Collect each family of like terms separately.',
    chain: [{ line: expression }, { line: `= ${answer[0]}`, op: 'Collect like terms', why: reason }],
  }
  return { stem: 'Spot the mistake.', parts: [spot, fix] }
}

export const likeTermsTemplates: Template[] = [
  {
    id: 'like-terms-simplify', topic: 'simplifying', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A1 worksheets (simplify by collecting like terms); AQA 2022–25 references still to be counted',
    variants: [
      collectSet([
        { statement: '15:like-terms-one-letter', expression: '4x + 7 + 2x - 3', options: ['6x + 4', '6x + 10', '10x', '6x^2 + 4'], why: '4x + 2x = 6x and 7 − 3 = 4. The − belongs to the 3.' },
        { statement: '15:like-terms-different-letters', expression: '5ab + 2a + 3ab', options: ['8ab + 2a', '10ab', '10a^2b', '8ab + 2ab'], why: '5ab + 3ab = 8ab. 2a has no b, so it is not a like term and stays as it is.' },
        { statement: '15:like-terms-powers', expression: '4x^2y + 3xy^2 + x^2y', options: ['5x^2y + 3xy^2', '8x^2y^2', '8x^2y', '5x^2y + 4xy^2'], why: '4x²y + x²y = 5x²y. In 3xy² the y is squared, not the x, so it stays as it is.' },
      ], 0),
      collectSet([
        { statement: '15:like-terms-one-letter', expression: '8m - 2 - 3m + 9', options: ['5m + 7', '11m + 7', '5m - 11', '12m'], why: '8m − 3m = 5m and −2 + 9 = 7. Each sign stays with the term after it.' },
        { statement: '15:like-terms-different-letters', expression: '6xy + 4y - 2xy', options: ['4xy + 4y', '8xy', '8xy + 4y', '4x^2y^2 + 4y'], why: '6xy − 2xy = 4xy. 4y has no x, so it stays as it is.' },
        { statement: '15:like-terms-powers', expression: '2a^2b + 5ab^2 + 3a^2b - ab^2', options: ['5a^2b + 4ab^2', '9a^2b^2', '5a^2b + 6ab^2', '9a^2b'], why: '2a²b + 3a²b = 5a²b and 5ab² − ab² = 4ab². a²b and ab² are different terms.' },
      ], 1),
      collectSet([
        { statement: '15:like-terms-one-letter', expression: '3t + 10 - 7t + 2', options: ['-4t + 12', '10t + 12', '4t + 12', '8t'], why: '3t − 7t = −4t and 10 + 2 = 12.' },
        { statement: '15:like-terms-different-letters', expression: '7pq - 3q + 2pq', options: ['9pq - 3q', '6pq', '9pq + 3q', '6p^2q^2'], why: '7pq + 2pq = 9pq. −3q has no p, so it stays as it is, with its minus sign.' },
        { statement: '15:like-terms-powers', expression: 'm^2n + 4mn^2 + 6m^2n', options: ['7m^2n + 4mn^2', '11m^2n^2', '6m^2n + 4mn^2', '11m^2n'], why: 'm²n means 1m²n, so m²n + 6m²n = 7m²n. 4mn² is a different term.' },
      ], 2),
    ],
  },
  {
    id: 'like-terms-spot', topic: 'simplifying', ramp: 'apply', style: 'errorSpot', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A1 worksheet "show that … is wrong" questions; AQA 2022–25 references still to be counted',
    variants: [
      spotSet({ name: 'Freya', expression: '7pq + 3p^2q + pq - p^2q', lines: ['7pq + 3p^2q + pq - p^2q', '= 7pq + pq + 3p^2q - p^2q', '= 8pq + 4p^2q'], wrong: 2, reason: 'The minus belongs to the p²q: 3p²q − p²q = 2p²q, not 4p²q. So the answer is 8pq + 2p²q.', answer: ['8pq + 2p^2q', '8pq + 4p^2q', '10p^2q', '6pq + 2p^2q'] }, 0),
      spotSet({ name: 'Leo', expression: '6u^2v + 3uv^2 + 2u^2v - uv^2', lines: ['6u^2v + 3uv^2 + 2u^2v - uv^2', '= 6u^2v + 2u^2v + 3uv^2 - uv^2', '= 8u^2v^2'], wrong: 2, reason: 'u²v and uv² are different terms, so they never join into u²v². 6u²v + 2u²v = 8u²v and 3uv² − uv² = 2uv².', answer: ['8u^2v + 2uv^2', '10u^2v^2', '8u^2v + 4uv^2', '8uv + 2uv'] }, 1),
      spotSet({ name: 'Sam', expression: '5xy + 2x + 3xy - x', lines: ['5xy + 2x + 3xy - x', '= 5xy + 3xy + 2x - x', '= 8x^2y^2 + x'], wrong: 2, reason: 'Adding like terms only changes the number in front: 5xy + 3xy = 8xy, not 8x²y². And 2x − x = x. So the answer is 8xy + x.', answer: ['8xy + x', '8x^2y^2 + x', '9xy', '8xy + 3x'] }, 2),
    ],
  },
]

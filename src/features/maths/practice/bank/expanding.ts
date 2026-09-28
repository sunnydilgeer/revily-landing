/*
 * Practice templates for expanding brackets (lesson 17, Algebra A3).
 * Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for expanding brackets yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import { rotate } from '../helpers'
import type { ChoicePart, QuestionBody, SpotPart, Template } from '../types'

type Expand = { statement: string; question: string; options: string[]; op: string; why: string }

/** An "expand" choice: the right answer is first in `options`, and the wrong ones are the usual slips. */
function expandPart({ statement, question, options, op, why }: Expand, by: number): ChoicePart {
  return {
    kind: 'choice', prompt: `Expand${statement.endsWith('double') ? ' and simplify' : ''} $${question}$`, marks: 1, statements: [statement], ...rotate(options.map(option => `$${option}$`), 0, by),
    hint: 'Multiply every term inside by the term outside (or every term by every term), keeping each sign.',
    chain: [{ line: question }, { line: `= ${options[0]}`, op, why }],
  }
}

function expandSet(parts: [Expand, Expand], by: number): QuestionBody {
  return { stem: 'Expand each of these.', parts: parts.map((part, i) => expandPart(part, by + i)) }
}

type Spot = { name: string; question: string; lines: string[]; wrong: number; reason: string; answer: string[] }
function spotSet({ name, question, lines, wrong, reason, answer }: Spot, by: number): QuestionBody {
  const spot: SpotPart = {
    kind: 'spot', prompt: `${name} expanded $${question}$. Tap the first line that is wrong.`, marks: 1, statements: ['17:expand-double'], lines, wrong,
    hint: 'Check there are four products, and the sign of each one.', reason,
  }
  const fix: ChoicePart = {
    kind: 'choice', prompt: `What should ${name}’s answer be?`, marks: 1, statements: ['17:expand-double'], ...rotate(answer.map(option => `$${option}$`), 0, by),
    hint: 'Multiply every term by every term, then collect like terms.',
    chain: [{ line: question }, { line: `= ${answer[0]}`, op: 'Four products, then collect', why: reason }],
  }
  return { stem: 'Spot the mistake.', parts: [spot, fix] }
}

export const expandingTemplates: Template[] = [
  {
    id: 'expand-brackets', topic: 'simplifying', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A3 worksheets (expand single and double brackets); AQA 2022–25 references still to be counted',
    variants: [
      expandSet([
        { statement: '17:expand-single', question: '5(3x - 2)', options: ['15x - 10', '15x - 2', '15x + 10', '8x - 7'], op: 'Multiply both terms by 5', why: '5 × 3x = 15x and 5 × −2 = −10.' },
        { statement: '17:expand-double', question: '(x + 3)(x + 5)', options: ['x^2 + 8x + 15', 'x^2 + 15', 'x^2 + 8x + 8', '2x + 8'], op: 'Four products, then collect', why: 'x² + 5x + 3x + 15, and 5x + 3x = 8x. The last term is 3 × 5 = 15.' },
      ], 0),
      expandSet([
        { statement: '17:expand-single', question: '-2(4y - 3)', options: ['-8y + 6', '-8y - 6', '8y + 6', '-8y - 3'], op: 'Multiply both terms by −2', why: '−2 × 4y = −8y, and −2 × −3 = +6: negative × negative is positive.' },
        { statement: '17:expand-double', question: '(x + 6)(x - 2)', options: ['x^2 + 4x - 12', 'x^2 - 12', 'x^2 - 4x - 12', 'x^2 + 4x + 4'], op: 'Four products, then collect', why: 'x² − 2x + 6x − 12, and −2x + 6x = 4x. The last term is 6 × −2 = −12.' },
      ], 1),
      expandSet([
        { statement: '17:expand-single', question: '3a(2a + 5)', options: ['6a^2 + 15a', '6a + 15a', '6a^2 + 5', '21a^2'], op: 'Multiply both terms by 3a', why: '3a × 2a = 6a² (a × a = a²) and 3a × 5 = 15a.' },
        { statement: '17:expand-double', question: '(n - 3)(n - 7)', options: ['n^2 - 10n + 21', 'n^2 - 10n - 21', 'n^2 + 21', 'n^2 + 10n + 21'], op: 'Four products, then collect', why: 'n² − 7n − 3n + 21. Two negatives make +21, and −7n − 3n = −10n.' },
      ], 2),
    ],
  },
  {
    id: 'expand-spot', topic: 'simplifying', ramp: 'apply', style: 'errorSpot', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A3 worksheet "use n = 6 to show … is wrong" questions; AQA 2022–25 references still to be counted',
    variants: [
      spotSet({ name: 'Dev', question: '(n - 5)^2', lines: ['(n - 5)^2', '= n^2 - 25'], wrong: 1, reason: '(n − 5)² means (n − 5)(n − 5): four products, n² − 5n − 5n + 25. So it is n² − 10n + 25.', answer: ['n^2 - 10n + 25', 'n^2 - 25', 'n^2 + 25', 'n^2 - 10n - 25'] }, 0),
      spotSet({ name: 'Ava', question: '(x + 4)(x - 3)', lines: ['(x + 4)(x - 3)', '= x^2 - 3x + 4x + 12', '= x^2 + x + 12'], wrong: 1, reason: 'The last product is 4 × −3 = −12, not +12. So it is x² + x − 12.', answer: ['x^2 + x - 12', 'x^2 + x + 12', 'x^2 - x - 12', 'x^2 - 12'] }, 1),
      spotSet({ name: 'Kai', question: '(2m + 3)(m + 4)', lines: ['(2m + 3)(m + 4)', '= 2m^2 + 8m + 3m + 7', '= 2m^2 + 11m + 7'], wrong: 1, reason: 'The last product is 3 × 4 = 12: multiply, don’t add. So it is 2m² + 11m + 12.', answer: ['2m^2 + 11m + 12', '2m^2 + 11m + 7', 'm^2 + 11m + 12', '2m^2 + 7m + 12'] }, 2),
    ],
  },
]

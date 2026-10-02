/*
 * Practice templates for rearranging formulae (lesson 20, Algebra A6).
 * Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for changing the subject yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import { rotate } from '../helpers'
import type { ChoicePart, NumberPart, QuestionBody, Template } from '../types'

/** One "make … the subject" choice: the right formula is first in `options`, the wrong ones are the usual slips. `lines` are [line, move, why]. */
type Rearrange = { statement: string; formula: string; subject: string; options: string[]; lines: [string, string, string][] }

function rearrangePart({ statement, formula, subject, options, lines }: Rearrange, by: number): ChoicePart {
  return {
    kind: 'choice', prompt: `Make $${subject}$ the subject of $${formula}$`, marks: 1, statements: [statement], ...rotate(options.map(option => `$${subject} = ${option}$`), 0, by),
    hint: `Do the opposite to both sides, one move at a time, until ${subject} is on its own.`,
    chain: [{ line: formula }, ...lines.map(([line, op, why]) => ({ line, op, why }))],
  }
}

const pair = (stem: string, parts: [Rearrange, Rearrange], by: number): QuestionBody => ({ stem, parts: parts.map((part, i) => rearrangePart(part, by + i)) })

/** Rearrange, then use the formula: a 2-mark number part, with the value before the last move as its method mark. */
type Use = { stem: string; rearrange: Rearrange; prompt: string; answer: number; suffix: string; lines: [string, string, string][]; method: [string, number]; mistakes: [number, string][] }
function useSet({ stem, rearrange, prompt, answer, suffix, lines, method, mistakes }: Use, by: number): QuestionBody {
  const use: NumberPart = {
    kind: 'number', prompt, answer, suffix, marks: 2, statements: [rearrange.statement],
    hint: 'Put the numbers into your formula. Work out the top, or what is under the root, first.',
    method: [{ prompt: method[0], answer: method[1] }],
    chain: lines.map(([line, op, why], i) => i === 0 ? { line } : { line, op, why }),
    mistakes: mistakes.map(([wrong, note]) => ({ answer: wrong, note })),
  }
  return { stem, parts: [rearrangePart(rearrange, by), use] }
}

export const rearrangingTemplates: Template[] = [
  {
    id: 'rearrange-linear-fraction', topic: 'equations', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A6.1 and A6.2 worksheets (simple formulae, formulae with fractions); AQA 2022–25 references still to be counted',
    variants: [
      pair('Rearrange each formula.', [
        { statement: '20:rearrange-linear', formula: 'y = 4x + 7', subject: 'x', options: ['\\frac{y - 7}{4}', '\\frac{y + 7}{4}', '\\frac{y}{4} - 7', '4(y - 7)'], lines: [['y - 7 = 4x', 'Subtract 7 from both sides', 'Taking 7 away undoes + 7.'], ['x = \\frac{y - 7}{4}', 'Divide both sides by 4', 'All of y − 7 goes over 4.']] },
        { statement: '20:rearrange-fractions', formula: 'P = \\frac{Q}{3}', subject: 'Q', options: ['3P', '\\frac{P}{3}', 'P + 3', 'P - 3'], lines: [['Q = 3P', 'Multiply both sides by 3', 'Multiplying undoes ÷ 3.']] },
      ], 0),
      pair('Rearrange each formula.', [
        { statement: '20:rearrange-linear', formula: 'T = 5n - 2', subject: 'n', options: ['\\frac{T + 2}{5}', '\\frac{T - 2}{5}', '\\frac{T}{5} + 2', 'T + \\frac{2}{5}'], lines: [['T + 2 = 5n', 'Add 2 to both sides', 'Adding 2 undoes − 2.'], ['n = \\frac{T + 2}{5}', 'Divide both sides by 5', 'All of T + 2 goes over 5.']] },
        { statement: '20:rearrange-fractions', formula: 'A = \\frac{k + 4}{2}', subject: 'k', options: ['2A - 4', '2A + 4', '\\frac{A}{2} - 4', '2(A - 4)'], lines: [['2A = k + 4', 'Multiply both sides by 2', 'The 2 on the bottom cancels.'], ['k = 2A - 4', 'Subtract 4 from both sides', 'Taking 4 away undoes + 4.']] },
      ], 1),
      pair('Rearrange each formula.', [
        { statement: '20:rearrange-linear', formula: 'C = 2d + 9', subject: 'd', options: ['\\frac{C - 9}{2}', '\\frac{C + 9}{2}', 'C - \\frac{9}{2}', '\\frac{C}{2} - 9'], lines: [['C - 9 = 2d', 'Subtract 9 from both sides', 'Taking 9 away undoes + 9.'], ['d = \\frac{C - 9}{2}', 'Divide both sides by 2', 'All of C − 9 goes over 2.']] },
        { statement: '20:rearrange-fractions', formula: 'v = \\frac{u}{t}', subject: 'u', options: ['vt', '\\frac{v}{t}', '\\frac{t}{v}', 'v + t'], lines: [['u = vt', 'Multiply both sides by t', 'Multiplying undoes ÷ t.']] },
      ], 2),
    ],
  },
  {
    id: 'rearrange-squares-roots', topic: 'equations', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A6.3 and A6.4 worksheets (formulae with squares and square roots); AQA 2022–25 references still to be counted',
    variants: [
      pair('Rearrange each formula.', [
        { statement: '20:rearrange-squares', formula: 'E = 3m^2', subject: 'm', options: ['\\sqrt{\\frac{E}{3}}', '\\frac{\\sqrt{E}}{3}', '\\frac{E}{3}', '\\sqrt{3E}'], lines: [['\\frac{E}{3} = m^2', 'Divide both sides by 3', 'The 3 multiplies m².'], ['m = \\sqrt{\\frac{E}{3}}', 'Square root both sides', 'The root goes over the whole of E/3.']] },
        { statement: '20:rearrange-roots', formula: 'r = \\sqrt{5k}', subject: 'k', options: ['\\frac{r^2}{5}', '\\frac{r}{5}', '5r^2', '\\frac{r^2}{25}'], lines: [['r^2 = 5k', 'Square both sides', 'Squaring undoes the square root.'], ['k = \\frac{r^2}{5}', 'Divide both sides by 5', 'The 5 multiplies k.']] },
      ], 0),
      pair('Rearrange each formula.', [
        { statement: '20:rearrange-squares', formula: 'y = \\frac{x^2}{4}', subject: 'x', options: ['\\sqrt{4y}', '4\\sqrt{y}', '\\sqrt{\\frac{y}{4}}', '4y'], lines: [['4y = x^2', 'Multiply both sides by 4', 'The 4 on the bottom cancels.'], ['x = \\sqrt{4y}', 'Square root both sides', 'The root goes over the whole of 4y.']] },
        { statement: '20:rearrange-roots', formula: 'p = 3\\sqrt{q}', subject: 'q', options: ['\\frac{p^2}{9}', '\\frac{p^2}{3}', '\\frac{p}{9}', '(p - 3)^2'], lines: [['\\frac{p}{3} = \\sqrt{q}', 'Divide both sides by 3', 'The 3 multiplies √q.'], ['q = \\frac{p^2}{9}', 'Square both sides', 'The 3 is squared too: 3² = 9.']] },
      ], 1),
      pair('Rearrange each formula.', [
        { statement: '20:rearrange-squares', formula: 'K = 2v^2', subject: 'v', options: ['\\sqrt{\\frac{K}{2}}', '\\frac{\\sqrt{K}}{2}', '\\sqrt{2K}', '\\frac{K}{2}'], lines: [['\\frac{K}{2} = v^2', 'Divide both sides by 2', 'The 2 multiplies v².'], ['v = \\sqrt{\\frac{K}{2}}', 'Square root both sides', 'The root goes over the whole of K/2.']] },
        { statement: '20:rearrange-roots', formula: 'w = \\sqrt{\\frac{h}{2}}', subject: 'h', options: ['2w^2', '\\frac{w^2}{2}', '2w', '\\sqrt{2w}'], lines: [['w^2 = \\frac{h}{2}', 'Square both sides', 'Squaring undoes the square root.'], ['h = 2w^2', 'Multiply both sides by 2', 'The 2 on the bottom cancels.']] },
      ], 2),
    ],
  },
  {
    id: 'rearrange-then-use', topic: 'equations', ramp: 'multistep', style: 'standard', context: 'travel', calculator: false,
    inspiredBy: 'Estimate: modelled on the A6.1–A6.4 worksheets (rearrange a formula, then use it); AQA 2022–25 references still to be counted',
    variants: [
      useSet({
        stem: 'A taxi costs £C for a journey of m miles, where $C = 2m + 6$.',
        rearrange: { statement: '20:rearrange-linear', formula: 'C = 2m + 6', subject: 'm', options: ['\\frac{C - 6}{2}', '\\frac{C + 6}{2}', '\\frac{C}{2} - 6', 'C - 3'], lines: [['C - 6 = 2m', 'Subtract 6 from both sides', 'Taking 6 away undoes + 6.'], ['m = \\frac{C - 6}{2}', 'Divide both sides by 2', 'All of C − 6 goes over 2.']] },
        prompt: 'A journey costs £22. How many miles is it?', answer: 8, suffix: 'miles',
        lines: [['m = \\frac{22 - 6}{2}', '', ''], ['m = \\frac{16}{2}', 'Work out the top', '22 − 6 = 16.'], ['m = 8', 'Divide by 2', '16 ÷ 2 = 8.']],
        method: ['What is 22 − 6?', 16], mistakes: [[16, 'That’s 2m, the top. Divide it by 2: 8 miles.'], [14, 'The formula takes 6 away: (22 − 6) ÷ 2 = 8.'], [5, 'Take 6 away before dividing: (22 − 6) ÷ 2 = 8.']],
      }, 0),
      useSet({
        stem: 'A phone plan costs £C for g gigabytes of data, where $C = 3g + 10$.',
        rearrange: { statement: '20:rearrange-linear', formula: 'C = 3g + 10', subject: 'g', options: ['\\frac{C - 10}{3}', '\\frac{C + 10}{3}', '\\frac{C}{3} - 10', 'C - \\frac{10}{3}'], lines: [['C - 10 = 3g', 'Subtract 10 from both sides', 'Taking 10 away undoes + 10.'], ['g = \\frac{C - 10}{3}', 'Divide both sides by 3', 'All of C − 10 goes over 3.']] },
        prompt: 'A bill is £31. How many gigabytes were used?', answer: 7, suffix: 'gigabytes',
        lines: [['g = \\frac{31 - 10}{3}', '', ''], ['g = \\frac{21}{3}', 'Work out the top', '31 − 10 = 21.'], ['g = 7', 'Divide by 3', '21 ÷ 3 = 7.']],
        method: ['What is 31 − 10?', 21], mistakes: [[21, 'That’s 3g, the top. Divide it by 3: 7 gigabytes.'], [41 / 3, 'The formula takes 10 away: (31 − 10) ÷ 3 = 7.']],
      }, 1),
      useSet({
        stem: 'A rectangle is 4 cm wide and l cm long. Its perimeter, P cm, is $P = 2l + 8$.',
        rearrange: { statement: '20:rearrange-linear', formula: 'P = 2l + 8', subject: 'l', options: ['\\frac{P - 8}{2}', '\\frac{P + 8}{2}', '\\frac{P}{2} - 8', 'P - 4'], lines: [['P - 8 = 2l', 'Subtract 8 from both sides', 'Taking 8 away undoes + 8.'], ['l = \\frac{P - 8}{2}', 'Divide both sides by 2', 'All of P − 8 goes over 2.']] },
        prompt: 'The perimeter is 30 cm. How long is the rectangle?', answer: 11, suffix: 'cm',
        lines: [['l = \\frac{30 - 8}{2}', '', ''], ['l = \\frac{22}{2}', 'Work out the top', '30 − 8 = 22.'], ['l = 11', 'Divide by 2', '22 ÷ 2 = 11.']],
        method: ['What is 30 − 8?', 22], mistakes: [[22, 'That’s 2l, the top. Divide it by 2: 11 cm.'], [19, 'The formula takes 8 away: (30 − 8) ÷ 2 = 11.'], [7, 'Take 8 away before dividing: (30 − 8) ÷ 2 = 11.']],
      }, 2),
    ],
  },
]

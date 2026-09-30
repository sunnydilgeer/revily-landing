/*
 * Practice templates for solving equations (lesson 19, Algebra A5).
 * Original questions in the style of AQA Foundation papers. The AQA 2022–25 references have not been
 * counted for solving equations yet, so `inspiredBy` says so, and the weights in aqaWeights.ts are estimates.
 */
import { rotate } from '../helpers'
import type { ChoicePart, NumberPart, QuestionBody, Template } from '../types'

/** `method` is the first move's result, for the method mark: its line and the number it gives ("4x =", 28). */
type Solve = { statement: string; equation: string; answer: number; lines: [string, string, string][]; mistakes?: [number, string][]; method?: [string, number] }

/** "Solve …" typed after x =, marked with the working one move a line. `lines` are [line, move, why]. */
function solvePart({ statement, equation, answer, lines, mistakes = [], method }: Solve): NumberPart {
  // The method mark: the first line of working that leaves only the x term on one side.
  const [prefix, value] = method ?? (() => { const m = lines.map(([line]) => line.match(/^(.*x) = (-?\d+)$/)).find(Boolean)!; return [`${m[1].replace(/\s/g, '')} =`, Number(m[2])] as [string, number] })()
  return {
    method: [{ prompt: `After the first move, what is ${prefix.replace(/ =$/, '')}?`, answer: value, prefix }],
    kind: 'number', prompt: `Solve $${equation}$`, answer, prefix: 'x =', signed: true, marks: 2, statements: [statement],
    hint: 'Do the same to both sides, one move at a time, until x is on its own.',
    chain: [{ line: equation }, ...lines.map(([line, op, why]) => ({ line, op, why }))],
    mistakes: mistakes.map(([wrong, note]) => ({ answer: wrong, note })),
  }
}

const pair = (parts: [Solve, Solve]): QuestionBody => ({ stem: 'Solve each equation.', parts: parts.map(solvePart) })

type Squares = { square: number; a: number; c: number; options: string[]; root: { equation: string; answer: number; lines: [string, string, string][]; method: [string, number] } }
function squaresSet({ square, a, c, options, root }: Squares, by: number): QuestionBody {
  const choice: ChoicePart = {
    kind: 'choice', prompt: `Solve $${a === 1 ? '' : a}x^2 = ${c}$`, marks: 2, statements: ['19:equations-squares'], ...rotate(options.map(option => `$${option}$`), 0, by),
    hint: 'Get x² on its own, then square root. A squared number has two roots.',
    chain: [{ line: `${a === 1 ? '' : a}x^2 = ${c}` }, ...(a === 1 ? [] : [{ line: `x^2 = ${square}`, op: `Divide both sides by ${a}`, why: `${c} ÷ ${a} = ${square}.` }]), { line: options[0], op: 'Square root both sides', why: 'A negative times a negative is positive, so the negative root works too.' }],
  }
  return { stem: 'Solve these equations.', parts: [choice, { ...solvePart({ statement: '19:equations-squares', ...root }), signed: false }] }
}

export const equationsTemplates: Template[] = [
  {
    id: 'solve-linear', topic: 'equations', ramp: 'recall', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A5.1 and A5.2 worksheets (one unknown, unknown on both sides); AQA 2022–25 references still to be counted',
    variants: [
      pair([
        { statement: '19:equations-one-unknown', equation: '4x - 5 = 23', answer: 7, lines: [['4x = 28', 'Add 5 to both sides', 'Adding 5 undoes − 5.'], ['x = 7', 'Divide both sides by 4', '28 ÷ 4 = 7.']], mistakes: [[4.5, 'To undo − 5, add 5 to both sides: 23 + 5 = 28, not 23 − 5.'], [28, 'That’s 4x. Divide by 4: x = 7.']] },
        { statement: '19:equations-both-sides', equation: '7x + 2 = 3x + 18', answer: 4, lines: [['4x + 2 = 18', 'Subtract 3x from both sides', 'Take the smaller x term away from both sides.'], ['4x = 16', 'Subtract 2 from both sides', '18 − 2 = 16.'], ['x = 4', 'Divide both sides by 4', '16 ÷ 4 = 4.']], mistakes: [[1.6, 'Take 3x away from both sides, don’t add it: 7x − 3x = 4x.']] },
      ]),
      pair([
        { statement: '19:equations-one-unknown', equation: '6x + 7 = 43', answer: 6, lines: [['6x = 36', 'Subtract 7 from both sides', 'Taking 7 away undoes + 7.'], ['x = 6', 'Divide both sides by 6', '36 ÷ 6 = 6.']], mistakes: [[25 / 3, 'To undo + 7, take 7 away: 43 − 7 = 36, not 43 + 7.'], [36, 'That’s 6x. Divide by 6: x = 6.']] },
        { statement: '19:equations-both-sides', equation: '8x - 3 = 5x + 12', answer: 5, lines: [['3x - 3 = 12', 'Subtract 5x from both sides', 'Take the smaller x term away from both sides.'], ['3x = 15', 'Add 3 to both sides', '12 + 3 = 15.'], ['x = 5', 'Divide both sides by 3', '15 ÷ 3 = 5.']], mistakes: [[3, 'To undo − 3, add 3 to both sides: 12 + 3 = 15, so 3x = 15.']] },
      ]),
      pair([
        { statement: '19:equations-one-unknown', equation: '3x - 8 = 13', answer: 7, lines: [['3x = 21', 'Add 8 to both sides', 'Adding 8 undoes − 8.'], ['x = 7', 'Divide both sides by 3', '21 ÷ 3 = 7.']], mistakes: [[5 / 3, 'To undo − 8, add 8: 13 + 8 = 21, not 13 − 8.'], [21, 'That’s 3x. Divide by 3: x = 7.']] },
        { statement: '19:equations-both-sides', equation: '2x + 15 = 5x + 3', answer: 4, lines: [['15 = 3x + 3', 'Subtract 2x from both sides', 'The smaller x term is on the left, so the x terms end up on the right.'], ['12 = 3x', 'Subtract 3 from both sides', '15 − 3 = 12.'], ['x = 4', 'Divide both sides by 3', '12 ÷ 3 = 4.']], method: ['3x =', 12], mistakes: [[6, 'To undo + 3, take 3 away: 15 − 3 = 12, so 3x = 12.']] },
      ]),
    ],
  },
  {
    id: 'solve-brackets-fractions', topic: 'equations', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A5.3 and A5.4 worksheets (brackets, fractions); AQA 2022–25 references still to be counted',
    variants: [
      pair([
        { statement: '19:equations-brackets', equation: '4(x + 3) = 2x + 20', answer: 4, lines: [['4x + 12 = 2x + 20', 'Multiply out the bracket', '4 × x = 4x and 4 × 3 = 12.'], ['2x + 12 = 20', 'Subtract 2x from both sides', 'The smaller x term goes.'], ['x = 4', 'Subtract 12, then divide by 2', '8 ÷ 2 = 4.']], method: ['2x =', 8], mistakes: [[8.5, 'The 4 multiplies both terms in the bracket: 4 × 3 = 12, not 3.']] },
        { statement: '19:equations-fractions', equation: '\\frac{3x - 2}{4} = 4', answer: 6, lines: [['3x - 2 = 16', 'Multiply both sides by 4', 'The 4 on the bottom cancels.'], ['3x = 18', 'Add 2 to both sides', '16 + 2 = 18.'], ['x = 6', 'Divide both sides by 3', '18 ÷ 3 = 6.']], mistakes: [[2, 'Multiply both sides by 4 first: 3x − 2 = 16, not 4.']] },
      ]),
      pair([
        { statement: '19:equations-brackets', equation: '3(2x - 1) = 4x + 9', answer: 6, lines: [['6x - 3 = 4x + 9', 'Multiply out the bracket', '3 × 2x = 6x and 3 × −1 = −3.'], ['2x - 3 = 9', 'Subtract 4x from both sides', 'The smaller x term goes.'], ['x = 6', 'Add 3, then divide by 2', '12 ÷ 2 = 6.']], method: ['2x =', 12], mistakes: [[5, 'The 3 multiplies both terms in the bracket: 3 × −1 = −3, not −1.']] },
        { statement: '19:equations-fractions', equation: '\\frac{x + 4}{3} = \\frac{x + 8}{5}', answer: 2, lines: [['5(x + 4) = 3(x + 8)', 'Multiply both sides by 15', '15 ÷ 3 = 5 and 15 ÷ 5 = 3.'], ['5x + 20 = 3x + 24', 'Multiply out both brackets', 'Every term inside each bracket.'], ['x = 2', 'Subtract 3x and 20, then divide by 2', '4 ÷ 2 = 2.']], method: ['2x =', 4], mistakes: [[-6, 'The 15 ÷ 3 = 5 goes with the left top: 5(x + 4) = 3(x + 8), not 3(x + 4) = 5(x + 8).']] },
      ]),
      pair([
        { statement: '19:equations-brackets', equation: '5(x - 2) = 3(x + 4)', answer: 11, lines: [['5x - 10 = 3x + 12', 'Multiply out both brackets', '5 × −2 = −10 and 3 × 4 = 12.'], ['2x - 10 = 12', 'Subtract 3x from both sides', 'The smaller x term goes.'], ['x = 11', 'Add 10, then divide by 2', '22 ÷ 2 = 11.']], method: ['2x =', 22], mistakes: [[3, 'Multiply every term in each bracket: 5 × −2 = −10 and 3 × 4 = 12.']] },
        { statement: '19:equations-fractions', equation: '\\frac{2x + 1}{5} = 3', answer: 7, lines: [['2x + 1 = 15', 'Multiply both sides by 5', 'The 5 on the bottom cancels.'], ['2x = 14', 'Subtract 1 from both sides', '15 − 1 = 14.'], ['x = 7', 'Divide both sides by 2', '14 ÷ 2 = 7.']], mistakes: [[1, 'Multiply both sides by 5 first: 2x + 1 = 15, not 3.']] },
      ]),
    ],
  },
  {
    id: 'solve-squares', topic: 'equations', ramp: 'apply', style: 'standard', context: 'none', calculator: false,
    inspiredBy: 'Estimate: modelled on the A5.5 worksheet (squares and square roots); AQA 2022–25 references still to be counted',
    variants: [
      squaresSet({ square: 16, a: 2, c: 32, options: ['x = 4 \\text{ or } x = -4', 'x = 4', 'x = 8 \\text{ or } x = -8', 'x = 16 \\text{ or } x = -16'], root: { method: ['√x =', 4], equation: '3\\sqrt{x} = 12', answer: 16, lines: [['\\sqrt{x} = 4', 'Divide both sides by 3', '12 ÷ 3 = 4.'], ['x = 16', 'Square both sides', '4² = 16.']] } }, 0),
      squaresSet({ square: 81, a: 1, c: 81, options: ['x = 9 \\text{ or } x = -9', 'x = 9', 'x = 40.5 \\text{ or } x = -40.5', 'x = 81 \\text{ or } x = -81'], root: { method: ['√x =', 5], equation: '\\sqrt{x} + 2 = 7', answer: 25, lines: [['\\sqrt{x} = 5', 'Subtract 2 from both sides', '7 − 2 = 5.'], ['x = 25', 'Square both sides', '5² = 25.']] } }, 1),
      squaresSet({ square: 25, a: 4, c: 100, options: ['x = 5 \\text{ or } x = -5', 'x = 5', 'x = 25 \\text{ or } x = -25', 'x = 12.5 \\text{ or } x = -12.5'], root: { method: ['2√x =', 12], equation: '2\\sqrt{x} - 1 = 11', answer: 36, lines: [['2\\sqrt{x} = 12', 'Add 1 to both sides', '11 + 1 = 12.'], ['x = 36', 'Divide by 2, then square', '√x = 6, and 6² = 36.']] } }, 2),
    ],
  },
]

/*
 * Lesson 17H, Expanding triple brackets (Higher only). From the Higher revision guide, A5 (every box Level 6-7) and its
 * Your Turn page: multiply the first two brackets together (FOIL, as in lesson 17), multiply that by the last bracket
 * (every term by every term), then collect like terms. The expansions are worked out here from the brackets, so the
 * working and the answer can't disagree.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, type StepWorking } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { choose, screens, text } from './helpers'

const a = author(17.5, 'L17H')
const { add, finish } = a
const { worked, practice } = screens(a)

const skill = 'expanding-triple-brackets'

/** A bracket ax + b as [b, a]: its number, then its number of x. */
type Poly = number[]
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const times = (p: Poly, q: Poly): Poly => {
  const out: Poly = Array(p.length + q.length - 1).fill(0)
  p.forEach((x, i) => q.forEach((y, j) => { out[i + j] += x * y }))
  return out
}
/** One term: 3x², −x, 6. */
function term(c: number, power: number, letter: string, first: boolean) {
  const size = Math.abs(c), body = power === 0 ? String(size) : `${size === 1 ? '' : size}${letter}${power > 1 ? SUP[power] : ''}`
  return first ? `${c < 0 ? '−' : ''}${body}` : `${c < 0 ? '−' : '+'} ${body}`
}
/** Terms in the order given, highest power first, zeros left out: "x³ + 2x² − 5x − 6". */
const written = (terms: [number, number][], letter: string) => terms.filter(([c]) => c !== 0).map(([c, power], i) => term(c, power, letter, i === 0)).join(' ')
const poly = (p: Poly, letter: string) => written(p.map((c, power) => [c, power] as [number, number]).reverse(), letter)
/** Every product of a term of p with a term of q, in order, before collecting: "x³ − 2x² + 4x² − 8x + 3x − 6". */
const products = (p: Poly, q: Poly, letter: string) => {
  const terms: [number, number][] = []
  for (let i = p.length - 1; i >= 0; i--) for (let j = q.length - 1; j >= 0; j--) if (p[i] && q[j]) terms.push([p[i] * q[j], i + j])
  return written(terms, letter)
}
const bracket = (p: Poly, letter: string) => `(${poly(p, letter)})`

/** Expand three brackets: the first two, then that times the third, then collect. */
function expandWorking(letter: string, brackets: [Poly, Poly, Poly], start?: string): { working: StepWorking; answer: string } {
  const [p, q, r] = brackets
  const first = times(p, q), all = times(first, r), answer = poly(all, letter)
  const shown = start ?? brackets.map(b => bracket(b, letter)).join('')
  return {
    answer,
    working: {
      kind: 'step-worked', start: shown, steps: [
        { title: 'First two brackets', why: 'Multiply out the first two brackets with FOIL: firsts, outers, inners, lasts. Then collect like terms.', lines: [
          line([part(`${bracket(p, letter)}${bracket(q, letter)}`, 0)], products(p, q, letter), { eq: true }),
          line([part(products(p, q, letter))], poly(first, letter), { eq: true }),
        ] },
        { title: 'Times the last bracket', why: 'Multiply every term in the first bracket by every term in the last bracket.', lines: [line([part(bracket(first, letter), 0), part(bracket(r, letter), 1)], products(first, r, letter), { eq: true })] },
        { title: 'Collect like terms', why: 'Add the terms with the same power of the letter.', lines: [line([part(products(first, r, letter))], answer, { eq: true, answer: true })] },
      ],
    },
  }
}

/** A collected expression typed with the power keys: x³ + 2x² − 5x − 6. */
const expression = (answer: string): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'expression', acceptanceRule: 'collectedExpression', anyPower: true, correctAnswer: answer, displayAnswer: answer,
})
/** Practice: "Expand and simplify …", typed. */
function expand(letter: string, brackets: [Poly, Poly, Poly], sourceRef: string, hint: string, start?: string) {
  const { working, answer } = expandWorking(letter, brackets, start)
  return practice(skill, `Expand and simplify ${working.start}.`, sourceRef, expression(answer), answer, hint, working, 'Expanded expression')
}

add(skill, 'Expanding triple brackets', 'Higher A5 Expanding Triple Brackets', text(
  'Three brackets are no harder than two. Do it in two goes:',
  '1. Multiply out the first two brackets and collect like terms.',
  '2. Multiply that answer by the last bracket: every term by every term.',
  'Then collect like terms. The answer has a cubed term.',
))
const x1 = expandWorking('x', [[1, 1], [2, 1], [3, 3]])
worked(skill, `Expand ${x1.working.start}.`, 'Higher A5 Expanding Triple Brackets', x1.working,
  'Multiply the first two brackets together, then multiply the result by the last bracket. Two brackets times three terms makes six multiplications.')
const x2 = expandWorking('x', [[1, 1], [3, 1], [-2, 1]])
worked(skill, `Expand and simplify ${x2.working.start}.`, 'Higher A5 Example 1', x2.working, 'The same two goes. Watch the signs: a minus times a plus is a minus.')
expand('a', [[5, 1], [-1, 2], [3, 1]], 'Higher A5 Example 2', 'Start with (a + 5)(2a − 1).', '(a + 5)(2a − 1)(3 + a)')
expand('m', [[8, 1], [-9, 1], [1, 1]], 'Higher A5 Your Turn Q1', 'Multiply out (m + 8)(m − 9) first.')
expand('x', [[1, 1], [2, 1], [-4, 1]], 'Higher A5 Your Turn Q3', 'Multiply out (x + 1)(x + 2) first.')
expand('k', [[-3, 2], [4, 1], [4, 1]], 'Higher A5 Your Turn Q2', 'A bracket squared is that bracket twice: (k + 4)(k + 4).', '(2k − 3)(k + 4)²')
expand('x', [[-3, 1], [5, 2], [2, 1]], 'Higher A5 Your Turn Q5', 'Multiply out (x − 3)(2x + 5) first.')
practice(skill, 'Expand and simplify (a + b)³.', 'Higher A5 Your Turn Q4', expression('a³ + 3a²b + 3ab² + b³'), 'a³ + 3a²b + 3ab² + b³', 'A cube is three brackets: (a + b)(a + b)(a + b).', {
  kind: 'step-worked', start: '(a + b)³', steps: [
    { title: 'Three brackets', why: 'Cubed means three lots of the bracket multiplied together.', lines: [line([part('(a + b)³', 0)], '(a + b)(a + b)(a + b)', { eq: true })] },
    { title: 'First two brackets', why: 'Multiply out with FOIL, then collect: ab and ba are like terms.', lines: [line([part('(a + b)(a + b)', 0)], 'a² + ab + ab + b²', { eq: true }), line([part('a² + ab + ab + b²')], 'a² + 2ab + b²', { eq: true })] },
    { title: 'Times the last bracket', why: 'Multiply every term by a, then every term by b.', lines: [line([part('(a² + 2ab + b²)', 0), part('(a + b)', 1)], 'a³ + a²b + 2a²b + 2ab² + ab² + b³', { eq: true })] },
    { title: 'Collect like terms', why: 'Add the terms with the same letters and powers.', lines: [line([part('a³ + a²b + 2a²b + 2ab² + ab² + b³')], 'a³ + 3a²b + 3ab² + b³', { eq: true, answer: true })] },
  ],
}, 'Expanded expression')
const check = expandWorking('x', [[2, 1], [3, 1], [1, 1]])
practice(skill, `Ella expands ${check.working.start} and gets x³ + 6. What has she done wrong?`, 'Higher A5 extra practice', choose([
  'She only multiplied the firsts and the lasts. Every term must multiply every term',
  'Nothing. x³ + 6 is right',
  'She should have added the brackets instead',
]), 'She only multiplied the firsts and the lasts. Every term must multiply every term', 'How many terms should there be before collecting?', {
  kind: 'step-worked', start: check.working.start, steps: [
    { title: 'Expand it properly', why: 'Every term in each bracket multiplies every term in the others.', lines: [line([part(check.working.start, 0)], check.answer, { eq: true })] },
    { title: 'Write the answer', why: 'Ella only kept x times x times x and the three numbers multiplied. The x² and x terms are missing.', words: 'She only multiplied the firsts and the lasts. Every term must multiply every term' },
  ],
})

add('mixed', 'Expanding triple brackets', 'Higher A5 consolidation', text(
  'Multiply out the first two brackets and collect like terms.',
  'Multiply that by the last bracket: every term by every term.',
  'Collect like terms. A bracket squared or cubed is that bracket written out two or three times.',
))

export const tutorTripleBracketsLesson: TutorMethodLesson = {
  id: 'L017H', number: 17.5, title: 'Expanding triple brackets', level: 'GCSE Higher',
  goal: 'Expand three brackets by multiplying out two, then multiplying the result by the third.',
  labels: { [skill]: 'Expanding triple brackets', mixed: 'Review' },
  states: finish(),
}

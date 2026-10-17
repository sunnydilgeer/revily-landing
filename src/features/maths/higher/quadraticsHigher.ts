/*
 * Lesson 21 (Factorising quadratics), two Higher sections. From the Higher revision guide:
 * - A10 Type 2 (Level 6-7) and Your Turn Q4 and Q5: a number in front of x². Find the x terms that multiply to make
 *   the x² term, then try the factor pairs of the last number in the brackets, multiplying out each until the middle
 *   term comes out right (the book's "test our 3 possibilities").
 * - A11 Examples 2 and 3 (Level 6-7) and Your Turn Q1 to Q4 (Q4 Level 8-9): the difference of two squares with a common
 *   factor, with a number in front of x², with two letters, with a surd, and 99² − 98² without a calculator. This is
 *   also where A7.4 Q5 (4x² − 25), left out of the Foundation lesson as Higher, now goes.
 * The search for the brackets is here, so the working's trials and the answer come from the same numbers.
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepLine, type WorkedStep } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { choose, number, screens, type HigherAddition } from './helpers'

const harder = 'quadratics-number-in-front'
const squares = 'quadratics-harder-squares'
const a = author(21, 'L21-H')
const { worked, practice } = screens(a)

/* ---------- Brackets (px + r)(qx + s) ---------- */

export type Brackets = { p: number; r: number; q: number; s: number }
const gcd = (m: number, n: number): number => n ? gcd(n, m % n) : Math.abs(m)
const signed = (n: number, first = false) => first ? (n < 0 ? `−${-n}` : String(n)) : `${n < 0 ? '−' : '+'} ${Math.abs(n)}`
const xTerm = (n: number, letter: string) => `${n === 1 ? '' : n === -1 ? '−' : n < 0 ? `−${-n}` : n}${letter}`
/** ax² + bx + c as written: 3x² − 11x + 6. */
export const quadText = (qa: number, qb: number, qc: number, letter = 'x') =>
  [`${xTerm(qa, letter)}²`, qb ? `${qb < 0 ? '−' : '+'} ${xTerm(Math.abs(qb), letter)}` : '', qc ? signed(qc) : ''].filter(Boolean).join(' ')
/** One bracket: (3x − 2). */
export const bracketText = (p: number, r: number, letter = 'x') => `(${xTerm(p, letter)} ${signed(r)})`
export const bracketsText = ({ p, r, q, s }: Brackets, letter = 'x') => `${bracketText(p, r, letter)}${bracketText(q, s, letter)}`
const expand = ({ p, r, q, s }: Brackets): [number, number, number] => [p * q, p * s + q * r, r * s]

/**
 * The brackets to try for ax² + bx + c, in order, until one multiplies out right: x terms that make ax² (3x and x, or
 * 4x and x then 2x and 2x), then the factor pairs of c with the signs it needs, both ways round. A bracket with a common
 * factor inside is skipped: the quadratic has none, so it can't be right.
 */
export function trialsFor(qa: number, qb: number, qc: number): { tried: Brackets[]; found: Brackets } {
  const tried: Brackets[] = []
  const xPairs: [number, number][] = []
  for (let q = 1; q * q <= qa; q++) if (qa % q === 0) xPairs.push([qa / q, q])
  const size = Math.abs(qc), pairs: [number, number][] = []
  for (let d = 1; d <= size; d++) if (size % d === 0) {
    if (qc > 0) pairs.push(qb > 0 ? [d, size / d] : [-d, -size / d])
    else pairs.push([d, -size / d], [-d, size / d])
  }
  for (const [p, q] of xPairs) for (const [r, s] of pairs) {
    if (gcd(p, r) > 1 || gcd(q, s) > 1) continue
    if (p === q && tried.some(t => t.r === s && t.s === r)) continue
    const option = { p, r, q, s }
    tried.push(option)
    const [, middle] = expand(option)
    if (middle === qb) return { tried, found: option }
  }
  throw new Error(`${quadText(qa, qb, qc)} doesn't factorise`)
}

/** The steps that find the brackets: the x terms, the signs, then each try multiplied out until the middle is right. */
export function factoriseSteps(qa: number, qb: number, qc: number, letter = 'x'): { steps: WorkedStep[]; found: Brackets } {
  const { tried, found } = trialsFor(qa, qb, qc)
  const xOptions = [...new Set(tried.map(t => `${xTerm(t.p, letter)} × ${xTerm(t.q, letter)}`))]
  const signs = qc < 0 ? 'The last number is minus, so one bracket has a plus and the other a minus.'
    : qb < 0 ? 'The last number is plus and the middle is minus, so both brackets have a minus.'
    : 'Every term is plus, so both brackets have a plus.'
  const tries: StepLine[] = tried.map(t => {
    const [, middle] = expand(t), right = t === found
    return line([part(bracketsText(t, letter), right ? 1 : undefined)], quadText(qa, middle, qc, letter), { eq: true, mark: right ? '✓' : '✗' })
  })
  return {
    found,
    steps: [
      { title: `Make ${xTerm(qa, letter)}²`, why: `The two ${letter} terms in the brackets must multiply to make the first term.`, lines: [line([part(`${xTerm(qa, letter)}²`, 0)], xOptions.join(' or '), { eq: true })] },
      { title: `Try pairs for ${signed(qc, true)}`, why: `${signs} The numbers must multiply to make the last number. Multiply out each try until the middle term is right.`, lines: tries },
    ],
  }
}

/* ---------- Section 1: a number in front of x² (A10 Type 2) ---------- */

/** Two brackets typed with the x² key, in either order. */
const twoBrackets = (answer: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'expression', acceptanceRule: 'brackets', correctAnswer: answer, displayAnswer: answer })
function factoriseWorking(qa: number, qb: number, qc: number, letter = 'x') {
  const { steps, found } = factoriseSteps(qa, qb, qc, letter)
  const answer = bracketsText(found, letter), question = quadText(qa, qb, qc, letter)
  return {
    answer,
    working: { kind: 'step-worked' as const, start: question, steps: [...steps, { title: 'Write the answer', why: 'The try whose middle term matches is the answer. Multiply it out to check.', lines: [line([part(question)], answer, { eq: true, answer: true })] }] },
  }
}
function factorise(qa: number, qb: number, qc: number, sourceRef: string, hint: string, letter = 'x') {
  const { answer, working } = factoriseWorking(qa, qb, qc, letter)
  return practice(harder, `Factorise ${working.start}.`, sourceRef, twoBrackets(answer), answer, hint, working, 'Two brackets')
}

const intro = factoriseWorking(4, 3, -1)
worked(harder, `Factorise ${intro.working.start}.`, 'Higher A10 Type 2', intro.working,
  'With a number in front of x², the x terms in the brackets are no longer just x and x. Try the factor pairs in the brackets and multiply out each one until the middle term is right.')
const second = factoriseWorking(2, 7, 3)
worked(harder, `Factorise ${second.working.start}.`, 'Higher A10 Example 2', second.working, 'Two is prime, so the brackets start (2x …)(x …). Three only has one factor pair, 1 and 3, to try both ways round.')
factorise(2, 5, 2, 'Higher A10 extra practice', 'The brackets start (2x …)(x …).')
factorise(3, -11, 6, 'Higher A10 Your Turn Q4', 'Both brackets have a minus. Try the factor pairs of 6.')
factorise(3, 10, -8, 'Higher A10 extra practice', 'One bracket has a plus and one a minus.')
factorise(4, -5, -6, 'Higher A10 Your Turn Q5', 'Try (4m …)(m …) first.', 'm')
factorise(5, -13, 6, 'Higher A10 extra practice', 'The brackets start (5x …)(x …), both with a minus.')

/* ---------- Section 2: harder difference of two squares (A11) ---------- */

/** a²x² − b² as (ax + b)(ax − b): each term as a square, then one plus, one minus. */
function squaresWorking(start: string, firstRoot: string, firstSquare: string, secondRoot: string, secondSquare: string, answer: string, factor?: { out: string; inside: string }) {
  const steps: WorkedStep[] = []
  if (factor) steps.push({ title: `Take out ${factor.out}`, why: 'Both terms share a common factor. Take it out first, and the bracket left is a difference of two squares.', lines: [line([part(start, 0)], `${factor.out}(${factor.inside})`, { eq: true })] })
  steps.push({ title: 'Write as squares', why: 'Write each term as something times itself: take the square root of each.', lines: [line([part(firstSquare, 1)], `${firstRoot} × ${firstRoot}`, { eq: true }), line([part(secondSquare, 2)], `${secondRoot} × ${secondRoot}`, { eq: true })] })
  steps.push({ title: 'One plus, one minus', why: 'Put the two roots in two brackets, one with a plus and one with a minus.', lines: [line([part(start)], answer, { eq: true, answer: true })] })
  return { kind: 'step-worked' as const, start, steps }
}

worked(squares, 'Factorise 4x² − 100y².', 'Higher A11 Example 2', squaresWorking('4x² − 100y²', 'x', 'x²', '5y', '25y²', '4(x + 5y)(x − 5y)', { out: '4', inside: 'x² − 25y²' }),
  'Take out any common factor first. What is left is still a difference of two squares: a² − b² = (a + b)(a − b).')
worked(squares, 'Factorise y² − 7.', 'Higher A11 Example 3', squaresWorking('y² − 7', 'y', 'y²', '√7', '7', '(y + √7)(y − √7)'),
  'Seven isn’t a square number, but it is √7 × √7. So the roots can be surds.')
practice(squares, 'Factorise 4x² − 25.', 'A7.4 Q5a (Higher)', twoBrackets('(2x + 5)(2x − 5)'), '(2x + 5)(2x − 5)', '4x² is 2x times 2x.', squaresWorking('4x² − 25', '2x', '4x²', '5', '25', '(2x + 5)(2x − 5)'), 'Two brackets')
practice(squares, 'Factorise 4x² − 9.', 'Higher A11 Your Turn Q3', twoBrackets('(2x + 3)(2x − 3)'), '(2x + 3)(2x − 3)', 'Square root each term.', squaresWorking('4x² − 9', '2x', '4x²', '3', '9', '(2x + 3)(2x − 3)'), 'Two brackets')
practice(squares, 'Factorise 9x² − 49y².', 'Higher A11 Your Turn Q1', choose(['(3x + 7y)(3x − 7y)', '(9x + 49y)(9x − 49y)', '(3x − 7y)²']), '(3x + 7y)(3x − 7y)', 'Square root each term, letters and all.',
  squaresWorking('9x² − 49y²', '3x', '9x²', '7y', '49y²', '(3x + 7y)(3x − 7y)'))
practice(squares, 'Factorise fully 2x² − 8.', 'Higher A11 Your Turn Q2', choose(['2(x + 2)(x − 2)', '(2x + 4)(x − 2)', '2(x − 2)²']), '2(x + 2)(x − 2)', 'Take out the common factor first.',
  squaresWorking('2x² − 8', 'x', 'x²', '2', '4', '2(x + 2)(x − 2)', { out: '2', inside: 'x² − 4' }))
practice(squares, 'Factorise x² − 5.', 'Higher A11 Example 3', choose(['(x + √5)(x − √5)', '(x + 5)(x − 5)', 'It can’t be factorised']), '(x + √5)(x − √5)', 'Five is √5 × √5.', squaresWorking('x² − 5', 'x', 'x²', '√5', '5', '(x + √5)(x − √5)'))
practice(squares, 'Work out 99² − 98² without a calculator.', 'Higher A11 Your Turn Q4 (Level 8-9)', number(197, '197'), '197', 'It is a difference of two squares: a² − b² = (a + b)(a − b).', {
  kind: 'step-worked', start: '99² − 98²', steps: [
    { title: 'Spot the squares', why: 'It is one square take away another, so it factorises into a plus bracket and a minus bracket.', lines: [line([part('99² − 98²', 0)], '(99 + 98)(99 − 98)', { eq: true })] },
    { title: 'Each bracket', why: 'Work out each bracket. The minus bracket is tiny.', lines: [line([part('99', 1), sign('+'), part('98', 1)], 197), line([part('99', 2), sign('−'), part('98', 2)], 1)] },
    { title: 'Multiply', why: 'Anything times one is itself.', lines: [line([part('197', 1), sign('×'), part('1', 2)], '197', { answer: true })] },
  ],
}, 'Answer')

const states = a.finish()
export const quadraticsNumberInFront: HigherAddition = { lessonId: 'L021', skill: harder, label: 'Number in front of x²', states: states.filter(s => s.microSkillId === harder) }
export const quadraticsHarderSquares: HigherAddition = { lessonId: 'L021', skill: squares, label: 'Harder difference of two squares', states: states.filter(s => s.microSkillId === squares) }

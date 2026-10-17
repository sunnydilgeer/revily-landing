/*
 * Lesson 23 (Sequences), two Higher sections. From the Higher revision guide:
 * - A16 Geometric Sequences Involving Surds: the common ratio can be a surd (√3, 3, 3√3, 9, …), so multiply the last
 *   term by it, and simplify √3 × √3 to 3.
 * - A17 Quadratic Sequences (Level 6-7), both boxes and its Your Turn page: the second differences are the same, half
 *   of them is a, take an² away to leave a linear sequence, then add its nth term on.
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepWorking, type WorkedStep } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { fmt } from '../../equations/tutor/equationsDiagnosis'
import { number, screens, text, type HigherAddition } from './helpers'

const surds = 'sequences-surds'
const quadratic = 'sequences-quadratic'
const a = author(23, 'L23-H')
const { add } = a
const { worked, practice } = screens(a)

/** Keeps a sequence or expression on one line in a title, so a phone never breaks it. */
const nb = (expression: string) => expression.replace(/ /g, ' ')
/** −5 → "(−5)", so a subtraction reads 3 − (−5). */
const bracket = (n: number) => n < 0 ? `(${fmt(n)})` : fmt(n)

/* ---------- Section 1: geometric sequences with surds (A16) ---------- */

/** a√b in two boxes: the number in front, then the number under the root. */
const surd = (front: number, under: number): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'list', listJoiner: '√', acceptanceRule: 'numberList', correctAnswer: `${front}, ${under}`, displayAnswer: `${front}√${under}`,
})

worked(surds, `Work out the next two terms of ${nb('√3, 3, 3√3, 9, 9√3, …')}`, 'Higher A16 Geometric Sequences Involving Surds', {
  kind: 'step-worked', start: '√3, 3, 3√3, 9, 9√3, …', steps: [
    { title: 'Find the ratio', why: 'Each term is the one before multiplied by the same number. Here it is √3, which is not a whole number.', lines: [line([part('√3', 0), sign('×'), part('√3', 0)], '3', { eq: true })] },
    { title: 'Multiply the last term', why: 'Multiply 9√3 by √3. The two roots of 3 multiply to make 3.', lines: [line([part('9√3'), sign('×'), part('√3', 0)], '9 × 3', { eq: true }), line([part('9'), sign('×'), part('3', 0)], 27)] },
    { title: 'And again', why: 'Multiply 27 by √3 to get the term after.', lines: [line([part('27'), sign('×'), part('√3', 0)], '27√3', { eq: true }), line([part('next two terms')], '27 and 27√3', { answer: true })] },
  ],
}, 'A geometric sequence can multiply by a surd. Multiply by it as usual, and remember a root times itself is the number under it: √3 × √3 = 3.')

practice(surds, `Work out the next term of ${nb('√2, 2, 2√2, 4, …')}`, 'Higher A16 extra practice', surd(4, 2), '4√2', 'What do you multiply √2 by to get 2?', {
  kind: 'step-worked', start: '√2, 2, 2√2, 4, …', steps: [
    { title: 'Find the ratio', why: 'Divide a term by the one before. Each term is the last one times √2.', lines: [line([part('√2', 0), sign('×'), part('√2', 0)], '2', { eq: true })] },
    { title: 'Multiply the last term', why: 'Multiply the last term, 4, by the ratio.', lines: [line([part('4'), sign('×'), part('√2', 0)], '4√2', { eq: true, answer: true })] },
  ],
}, 'Next term')
const ratio = practice(surds, `What is the common ratio of ${nb('√5, 5, 5√5, 25, …')}?`, 'Higher A16 extra practice', number(5, '√5'), '√5', 'Divide the second term by the first.', {
  kind: 'step-worked', start: '√5, 5, 5√5, 25, …', steps: [
    { title: 'Divide by the last', why: 'The ratio is any term divided by the one before it. A number divided by its own square root is that root.', lines: [line([part('5'), sign('÷'), part('√5', 0)], '√5', { eq: true })] },
    { title: 'Check with the next', why: 'Check it works for the next pair too: the last term times the ratio makes the next one.', lines: [line([part('5'), sign('×'), part('√5', 0)], '5√5', { eq: true }), line([part('ratio')], '√5', { eq: true, answer: true })] },
  ],
})
ratio.answerPrefix = '= √'
practice(surds, `Work out the next term of ${nb('2√3, 6, 6√3, 18, …')}`, 'Higher A16 extra practice', surd(18, 3), '18√3', 'The ratio is the same surd every time.', {
  kind: 'step-worked', start: '2√3, 6, 6√3, 18, …', steps: [
    { title: 'Find the ratio', why: 'Two roots of 3 multiply to make 3, so each term is the last one times √3.', lines: [line([part('2√3'), sign('×'), part('√3', 0)], '2 × 3', { eq: true }), line([part('2'), sign('×'), part('3')], 6)] },
    { title: 'Multiply the last term', why: 'Multiply the last term, 18, by the ratio.', lines: [line([part('18'), sign('×'), part('√3', 0)], '18√3', { eq: true, answer: true })] },
  ],
}, 'Next term')
practice(surds, `Work out the 5th term of ${nb('√7, 7, 7√7, …')}`, 'Higher A16 extra practice', surd(49, 7), '49√7', 'Find the 4th term first.', {
  kind: 'step-worked', start: '√7, 7, 7√7, …', steps: [
    { title: 'Find the ratio', why: 'Each term is the last one times √7.', lines: [line([part('√7', 0), sign('×'), part('√7', 0)], '7', { eq: true })] },
    { title: 'The 4th term', why: 'Multiply the 3rd term by √7. The two roots of 7 make 7.', lines: [line([part('7√7'), sign('×'), part('√7', 0)], '7 × 7', { eq: true }), line([part('7'), sign('×'), part('7')], 49)] },
    { title: 'The 5th term', why: 'Multiply the 4th term by √7 again.', lines: [line([part('49'), sign('×'), part('√7', 0)], '49√7', { eq: true, answer: true })] },
  ],
}, '5th term')

/* ---------- Section 2: quadratic sequences (A17, Level 6-7) ---------- */

/** an² + bn + c, written the usual way: n² + 4n − 3, 2n² − 5n + 3, n² + 8n. */
function poly(qa: number, qb: number, qc: number) {
  let out = ''
  for (const [coef, letter] of [[qa, 'n²'], [qb, 'n'], [qc, '']] as [number, string][]) {
    if (coef === 0) continue
    const size = Math.abs(coef) === 1 && letter ? letter : `${Math.abs(coef)}${letter}`
    out += out ? ` ${coef < 0 ? '−' : '+'} ${size}` : `${coef < 0 ? '−' : ''}${size}`
  }
  return out || '0'
}
const diffs = (terms: number[]) => terms.slice(1).map((t, i) => t - terms[i])
const subtract = (later: number, earlier: number, family?: number, result = later - earlier) => line([part(fmt(later)), sign('−'), part(bracket(earlier), family)], fmt(result))

/** The nth term of a quadratic sequence, as the book does it: differences, halve, take an² away, the linear nth term. */
function nthWorking(terms: number[]): { working: StepWorking; answer: string } {
  const first = diffs(terms), second = diffs(first)
  const qa = second[0] / 2
  const squares = terms.map((_, i) => qa * (i + 1) ** 2)
  const rest = terms.map((t, i) => t - squares[i])
  const qb = rest[1] - rest[0], qc = rest[0] - qb
  const answer = poly(qa, qb, qc)
  const an2 = qa === 1 ? 'n²' : `${qa}n²`
  const linear = poly(0, qb, qc)
  const steps: WorkedStep[] = [
    { title: 'Find the differences', why: 'Take each term away from the next one. They are not the same, so it is not linear.', lines: first.map((_, i) => subtract(terms[i + 1], terms[i])) },
    { title: 'Second differences', why: 'Now find the differences between those differences. When they are all the same, it is a quadratic sequence.', lines: second.map((_, i) => subtract(first[i + 1], first[i], 1)) },
    { title: 'Halve to find a', why: 'The number in front of n² is half the second difference.', lines: [line([part(fmt(second[0]), 1), sign('÷'), part('2')], fmt(qa))] },
    { title: `Take away ${an2}`, why: `Work out ${an2} for each position, and take it away from each term. What is left goes up by the same amount each time.`, lines: rest.map((_, i) => subtract(terms[i], squares[i], 0)) },
    { title: 'nth term of that', why: 'What is left is linear. The difference goes in front of n, and the term before the first one is the number on the end.', lines: [
      subtract(rest[1], rest[0], undefined), subtract(rest[0], qb, 2),
    ] },
    { title: 'Put them together', why: `Add the linear nth term on to ${an2}.`, lines: [line([part(an2, 0), sign('and'), part(linear, 2)], answer, { answer: true })] },
  ]
  return { working: { kind: 'step-worked', start: terms.map(fmt).join(', '), steps }, answer }
}

/** An nth term typed with the letter keyboard, in any order. */
const expression = (answer: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'expression', acceptanceRule: 'collectedExpression', correctAnswer: answer.replace(/−/g, '-'), displayAnswer: answer })
/** Terms in boxes, "☐, ☐, ☐, ☐", in order. */
const numbers = (answer: number[]): InteractionDefinition => ({ type: 'numericInput', responseShape: 'list', listJoiner: ',', acceptanceRule: 'numberList', correctAnswer: answer.map(fmt).join(', ').replace(/−/g, '-'), displayAnswer: answer.map(fmt).join(', ') })

function findNth(terms: number[], sourceRef: string, hint: string) {
  const { working, answer } = nthWorking(terms)
  const state = practice(quadratic, `Find the nth term of ${nb(`${terms.map(fmt).join(', ')}, …`)}`, sourceRef, expression(answer), answer, hint, working)
  state.answerPrefix = 'nth term ='
  return state
}
/** The first few terms from an nth term: put n = 1, 2, 3, … in. */
function firstTerms(rule: string, count: number, value: (n: number) => number, sum: (n: number) => [string, string][], sourceRef: string, hint: string) {
  const terms = Array.from({ length: count }, (_, i) => value(i + 1))
  const shown = terms.map(fmt).join(', ')
  practice(quadratic, `A sequence has nth term ${nb(rule)}. List the first ${count} terms.`, sourceRef, numbers(terms), shown, hint, {
    kind: 'step-worked', start: rule, steps: [
      { title: 'Put n in', why: 'The 1st term is n as 1, the 2nd is n as 2, and so on. Square first, then multiply, then add or take away.', lines: terms.map((t, i) => line(sum(i + 1).map(([text, kind]) => kind === 'sign' ? sign(text) : part(text, kind === 'sq' ? 0 : undefined)), fmt(t))) },
      { title: 'Write the terms', why: 'List them in order, from the 1st term.', lines: [line([part(`n = 1 to ${count}`)], shown, { answer: true })] },
    ],
  })
}

add(quadratic, 'Quadratic sequences', 'Higher A17 Quadratic Sequences', text(
  'A quadratic sequence has an n² in its nth term: an² + bn + c.',
  'The differences between its terms are not the same, but the second differences (the differences between the differences) are.',
  'To find its nth term: halve the second difference to get a. Take an² away from each term. What is left is linear, so find its nth term, bn + c, and add it on.',
))

const easy = nthWorking([2, 9, 18, 29, 42])
worked(quadratic, `Find the nth term of ${nb('2, 9, 18, 29, 42, …')}`, 'Higher A17 Finding the nth Term (a = 1)', easy.working,
  'The second differences are all 2, so it is quadratic. Half of 2 is 1, so the nth term starts with n².')
const harder = nthWorking([4, 15, 32, 55, 84])
worked(quadratic, `Find the nth term of ${nb('4, 15, 32, 55, 84, …')}`, 'Higher A17 Finding the nth Term (a > 1)', harder.working,
  'The same steps. This time the second difference is 6, so a is 3 and you take 3n² away from each term.')

firstTerms('n² + 6n − 10', 5, n => n * n + 6 * n - 10, n => [[String(n * n), 'sq'], ['+', 'sign'], [String(6 * n), ''], ['−', 'sign'], ['10', '']], 'Higher A17 Your Turn Q1', 'Put n = 1, 2, 3, 4 and 5 in. Square n first.')
firstTerms('n² − 2', 4, n => n * n - 2, n => [[String(n * n), 'sq'], ['−', 'sign'], ['2', '']], 'Higher A17 Your Turn Q2a', 'Square n, then take 2 away.')
practice(quadratic, `A sequence has nth term ${nb('n² − 2')}. A term is 287. Which term is it?`, 'Higher A17 Your Turn Q2b', number(17, '17'), '17', 'Set n² − 2 equal to 287 and solve.', {
  kind: 'step-worked', start: 'n² − 2 = 287', steps: [
    { title: 'Add 2', why: 'Undo the take away 2 by adding it to both sides.', lines: [line([part('287'), sign('+'), part('2', 0)], 289)] },
    { title: 'Square root', why: 'n² is 289, so n is the square root of 289. A position is positive, so ignore the negative root.', lines: [line([part('√289', 0)], '17', { eq: true, answer: true })] },
  ],
}, 'Position (n)')
practice(quadratic, `A sequence has nth term ${nb('(n − 1)²')}. A term is 49. Which term is it?`, 'Higher A17 Your Turn Q3', number(8, '8'), '8', 'What number squared is 49?', {
  kind: 'step-worked', start: '(n − 1)² = 49', steps: [
    { title: 'Square root', why: 'Undo the square by square rooting both sides. A position is positive, so use the positive root.', lines: [line([part('√49', 0)], '7', { eq: true })] },
    { title: 'Add 1', why: 'The bracket is 7, so n is 1 more than 7.', lines: [line([part('7'), sign('+'), part('1', 0)], '8', { answer: true })] },
  ],
}, 'Position (n)')
findNth([9, 20, 33, 48, 65], 'Higher A17 Your Turn Q4', 'Find the second difference first, then halve it.')
findNth([0, 1, 6, 15, 28], 'Higher A17 Your Turn Q5', 'The second difference is 4, so a is 2.')
findNth([5, 14, 27, 44, 65], 'Higher A17 extra practice', 'Halve the second difference, then take an² away from each term.')

const states = a.finish()
export const sequencesSurds: HigherAddition = { lessonId: 'L023', skill: surds, label: 'Geometric with surds', states: states.filter(s => s.microSkillId === surds) }
export const quadraticSequences: HigherAddition = { lessonId: 'L023', skill: quadratic, label: 'Quadratic sequences', states: states.filter(s => s.microSkillId === quadratic) }

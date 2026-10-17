/*
 * Lesson 9H2, Completing the square (Higher only). From the Higher revision guide, A14 (Skill 1 Level 6-7, the formula
 * and Skill 2 Level 8-9) and its Your Turn page: writing ax² + bx + c as a(x + d)² + e, with d = b ÷ 2a and e = c − ad²,
 * for a = 1 (Q1, Q3) and a > 1 (3x² + 5x − 3, Q2), the turning point it gives (the book's second reason for it), and
 * solving an equation by completing the square (x² + 6x + 3 = 1, Q4, Q5). Numbers in a completed square are typed in
 * boxes (a = ☐, b = ☐), and an exact answer like −7 ± 5√2 in three, so only the simplest form passes.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign, type StepWorking, type WorkedStep } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { choose, screens, text } from './helpers'

const a = author(22.6, 'L22H2')
const { add, finish } = a
const { worked, practice } = screens(a)

const aOne = 'completing-square-a-one'
const turning = 'completing-square-turning-point'
const aMore = 'completing-square-a-more'
const solving = 'completing-square-solving'

const show = (n: number | string) => String(n).replace('-', '−')
const gcd = (m: number, n: number): number => n ? gcd(n, m % n) : Math.abs(m)
/** top/bottom in its simplest form: "5/2", "−1/4", or a whole number. */
function frac(top: number, bottom: number) {
  const d = gcd(top, bottom) * Math.sign(bottom), t = top / d, b = bottom / d
  return b === 1 ? show(t) : `${show(t)}/${b}`
}
/** "+ 3" or "− 5/2", for after a letter. */
const signed = (text: string) => text.startsWith('−') ? `− ${text.slice(1)}` : `+ ${text}`

/** Boxes with words in front: "a = ☐, b = ☐". */
const boxes = (labels: string[], values: string[], shown: string): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'list', listJoiner: ',', acceptanceRule: 'numberList', signed: true,
  listLabels: labels, correctAnswer: values.map(v => v.replace('−', '-')).join(', '), displayAnswer: shown,
})
/** "x = ☐ ± √☐", or "x = ☐ ± ☐√☐". */
const plusMinusRoot = (letter: string, numbers: number[], shown: string): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'list', listJoiner: '', acceptanceRule: 'numberList', signed: true,
  listLabels: numbers.length === 2 ? [`${letter} =`, '± √'] : [`${letter} =`, '±', '√'], correctAnswer: numbers.join(', '), displayAnswer: shown,
})

/** x² + bx + c as (x + d)² + e: halve b, then take away the extra d² that squaring the bracket adds. */
function squareSteps(b: number, c: number, x = 'x'): { steps: WorkedStep[]; d: string; e: string; form: string } {
  const d = frac(b, 2), dSquared = frac(b * b, 4), e = frac(4 * c - b * b, 4)
  const bracket = `(${x} ${signed(d)})²`
  const form = `${bracket} ${signed(e)}`
  return {
    d, e, form, steps: [
      { title: 'Halve the x number', why: `Half the number in front of ${x} goes in the bracket with ${x}.`, lines: [line([part(show(b), 0), sign('÷'), part('2')], d)] },
      { title: 'Square the half', why: `Squaring the bracket makes an extra number on the end that isn’t in the quadratic.`, lines: [
        line([part(bracket, 0)], `${x}² ${signed(show(b))}${x} ${signed(dSquared)}`, { eq: true }),
      ] },
      { title: 'Take it away', why: `Take the extra number away, and keep the number that was on the end.`, lines: [line([part(show(c), 1), sign('−'), part(dSquared, 0)], e)] },
    ],
  }
}
function aOneWorking(b: number, c: number, x = 'x'): { working: StepWorking; answer: string; d: string; e: string } {
  const start = `${x}² ${signed(show(b))}${x} ${signed(show(c))}`
  const { steps, d, e, form } = squareSteps(b, c, x)
  steps.push({ title: 'Write it', why: 'The bracket squared, then the number left over.', lines: [line([part(start)], form, { eq: true, answer: true })] })
  return { working: { kind: 'step-worked', start, steps }, answer: form, d, e }
}

/* ---------- Section 1: a = 1 (Skill 1) ---------- */

add(aOne, 'Completing the square', 'Higher A14 Completing the Square Formula', text(
  'Completing the square writes a quadratic in the form a(x + d)² + e.',
  'It helps you solve a quadratic equation, and find the lowest (or highest) point of its graph.',
  'When a is 1: halve the number in front of x to get d, then e is the number on the end take away d².',
  'x² + 6x + 2 = (x + 3)² − 7, because (x + 3)² = x² + 6x + 9, and 2 is 7 less than 9.',
))
const first = aOneWorking(6, 2)
worked(aOne, 'Write x² + 6x + 2 in the form (x + d)² + e.', 'Higher A14 Skill 1', first.working,
  'Half of 6 is 3, so the bracket is (x + 3)². That makes x² + 6x + 9, which is 7 too many, so take 7 away.')
const own1 = aOneWorking(8, 5)
practice(aOne, 'Write x² + 8x + 5 in the form (x + a)² + b, where a and b are numbers.', 'Higher A14 extra practice', boxes(['a =', 'b ='], [own1.d, own1.e], own1.answer), own1.answer, 'Halve 8 for the bracket.', own1.working)
const own2 = aOneWorking(-10, 7)
practice(aOne, 'Write x² − 10x + 7 in the form (x + a)² + b, where a and b are numbers.', 'Higher A14 extra practice', boxes(['a =', 'b ='], [own2.d, own2.e], own2.answer), own2.answer, 'Half of −10 is −5, so the bracket is (x − 5)².', own2.working)
const q1 = aOneWorking(5, 6, 'm')
practice(aOne, 'Write m² + 5m + 6 in the form (m + a)² + b, where a and b are numbers to be found.', 'Higher A14 Your Turn Q1', boxes(['a =', 'b ='], [q1.d, q1.e], q1.answer), q1.answer, 'Half of 5 is 5/2. A fraction is fine.', q1.working)
practice(aOne, 'Write x² − 2mx + n in the form (x + a)² + b, where a and b are to be found.', 'Higher A14 Your Turn Q3', choose([
  '(x − m)² + n − m²', '(x − m)² + n + m²', '(x − 2m)² + n − 4m²',
]), '(x − m)² + n − m²', 'Halve −2m for the bracket, then take away its square.', {
  kind: 'step-worked', start: 'x² − 2mx + n', steps: [
    { title: 'Halve the x number', why: 'Half the number in front of x goes in the bracket. Here it has a letter in it.', lines: [line([part('−2m', 0), sign('÷'), part('2')], '−m')] },
    { title: 'Square the half', why: 'Squaring the bracket makes an extra number on the end that isn’t in the quadratic.', lines: [line([part('(x − m)²', 0)], 'x² − 2mx + m²', { eq: true })] },
    { title: 'Take it away', why: 'Take the extra away, and keep what was on the end.', lines: [line([part('n', 1), sign('−'), part('m²', 0)], 'n − m²')] },
    { title: 'Write it', why: 'The bracket squared, then what is left over.', lines: [line([part('x² − 2mx + n')], '(x − m)² + n − m²', { eq: true, answer: true })] },
  ],
})

/* ---------- Section 2: the turning point ---------- */

add(turning, 'The turning point', 'Higher A14 Completing the Square', text(
  'A squared bracket is never less than 0, so (x + d)² + e is smallest when the bracket is 0.',
  'That happens when x is −d, and then y is e. So the lowest point of the curve, its turning point, is (−d, e).',
  'y = (x + 3)² − 7 has its turning point at (−3, −7). Mind the sign of d: it flips.',
))
function turningWorking(b: number, c: number) {
  const { steps, d, e, form } = squareSteps(b, c)
  const x = show(-b / 2), y = e
  const answer = `(${x}, ${y})`
  steps.push({ title: 'Read the point', why: 'The bracket is 0 when x is the bracket’s number with its sign flipped. Then y is the number left over.', lines: [
    line([part(`y = ${form}`)], answer, { answer: true }),
  ] })
  return { working: { kind: 'step-worked' as const, start: `y = x² ${signed(show(b))}x ${signed(show(c))}`, steps }, answer, x, y, d }
}
const turn1 = turningWorking(6, 2)
worked(turning, 'Find the turning point of y = x² + 6x + 2.', 'Higher A14 Completing the Square', turn1.working,
  'Complete the square first. Then the turning point is where the bracket is 0.')
const turn2 = turningWorking(-4, 1)
practice(turning, 'Find the turning point of y = x² − 4x + 1.', 'Higher A14 extra practice', boxes(['x =', 'y ='], [turn2.x, turn2.y], turn2.answer), turn2.answer, 'Complete the square, then flip the sign in the bracket.', turn2.working, 'Turning point')
const turn3 = turningWorking(10, 30)
practice(turning, 'Find the turning point of y = x² + 10x + 30.', 'Higher A14 extra practice', boxes(['x =', 'y ='], [turn3.x, turn3.y], turn3.answer), turn3.answer, 'Half of 10 is 5.', turn3.working, 'Turning point')

/* ---------- Section 3: a number in front of x² (Skill 2) ---------- */

add(aMore, 'A number in front of x²', 'Higher A14 Skill 2', text(
  'When a isn’t 1, take a out of the first two terms first: 3x² + 5x − 3 = 3(x² + 5/3x) − 3.',
  'Then complete the square inside the bracket, as before.',
  'Multiply the extra number by a before you take it away, because it is inside the bracket.',
))
/** ax² + bx + c as a(x + d)² + e, with whole numbers only (b divides by 2a). */
function aMoreWorking(qa: number, b: number, c: number) {
  const inner = b / qa, d = inner / 2, extra = qa * d * d, e = c - extra
  const start = `${qa}x² ${signed(show(b))}x ${signed(show(c))}`
  const form = `${qa}(x ${signed(show(d))})² ${signed(show(e))}`
  const steps: WorkedStep[] = [
    { title: 'Take out a', why: `Take the number in front of x² out of the first two terms. The number on the end stays outside.`, lines: [line([part(`${qa}x² ${signed(show(b))}x`, 0)], `${qa}(x² ${signed(show(inner))}x)`, { eq: true })] },
    { title: 'Halve the x number', why: 'Half the number in front of x, inside the bracket, goes in the new bracket.', lines: [line([part(show(inner), 1), sign('÷'), part('2')], show(d))] },
    { title: 'Take the extra away', why: 'Squaring the bracket adds the half squared. It is inside the bracket, so times it by a before taking it away.', lines: [
      line([part(qa, 0), sign('×'), part(d < 0 ? `(${show(d)})` : show(d)), sign('×'), part(d < 0 ? `(${show(d)})` : show(d))], extra),
      line([part(show(c)), sign('−'), part(extra)], show(e)),
    ] },
    { title: 'Write it', why: 'a times the bracket squared, then the number left over.', lines: [line([part(start)], form, { eq: true, answer: true })] },
  ]
  return { working: { kind: 'step-worked' as const, start, steps }, answer: form, values: [qa, d, e].map(String) }
}
worked(aMore, 'Write 3x² + 5x − 3 in the form a(x + d)² + e.', 'Higher A14 Example (Skill 2)', {
  kind: 'step-worked', start: '3x² + 5x − 3', steps: [
    { title: 'Take out a', why: 'Take three out of the first two terms. The number on the end stays outside.', lines: [line([part('3x² + 5x', 0)], '3(x² + 5/3x)', { eq: true })] },
    { title: 'Halve the x number', why: 'Half of five thirds is five sixths, so the bracket is x plus five sixths.', lines: [line([part('5/3', 1), sign('÷'), part('2')], '5/6')] },
    { title: 'Take the extra away', why: 'The half squared is inside the bracket, so times it by three before taking it away.', lines: [
      line([part('3', 0), sign('×'), part('25/36')], '25/12'),
      line([part('−3'), sign('−'), part('25/12')], '−61/12'),
    ] },
    { title: 'Write it', why: 'Three times the bracket squared, then the number left over.', lines: [line([part('3x² + 5x − 3')], '3(x + 5/6)² − 61/12', { eq: true, answer: true })] },
  ],
}, 'Take out the 3 first. The fractions are fine: d is b ÷ 2a and e is c − ad².')
const q2 = aMoreWorking(2, -8, 10)
practice(aMore, 'Write 2x² − 8x + 10 in the form a(x + b)² + c, where a, b and c are constants to be determined.', 'Higher A14 Your Turn Q2', boxes(['a =', 'b =', 'c ='], q2.values, q2.answer), q2.answer, 'Take 2 out of 2x² − 8x first.', q2.working)
const own3 = aMoreWorking(2, 12, 7)
practice(aMore, 'Write 2x² + 12x + 7 in the form a(x + b)² + c.', 'Higher A14 extra practice', boxes(['a =', 'b =', 'c ='], own3.values, own3.answer), own3.answer, 'Take 2 out of 2x² + 12x first.', own3.working)
const own4 = aMoreWorking(3, -6, 1)
practice(aMore, 'Write 3x² − 6x + 1 in the form a(x + b)² + c.', 'Higher A14 extra practice', boxes(['a =', 'b =', 'c ='], own4.values, own4.answer), own4.answer, 'Remember to times the extra by 3.', own4.working)

/* ---------- Section 4: solving by completing the square ---------- */

add(solving, 'Solving by completing the square', 'Higher A14 Example', text(
  'Make one side 0, then complete the square.',
  'Move the number to the other side, square root both sides, and remember the root can be plus or minus.',
  'Then move the bracket’s number across. The answers are exact, often with a surd in them.',
))
/** Solve x² + bx + c = 0 (b even): complete the square, then root both sides. */
function solveSteps(b: number, c: number, x: string, given?: string) {
  const start = `${x}² ${signed(show(b))}${x} ${signed(show(c))} = 0`
  const d = b / 2, k = d * d - c
  const { steps } = squareSteps(b, c, x)
  const all: WorkedStep[] = []
  if (given) all.push({ title: 'Make it 0', why: 'Take everything to one side, so the other side is 0.', lines: [line([part(given, 0)], start, { eq: true })] })
  all.push(...steps)
  all.push({ title: 'Move the number', why: 'Add the number to both sides, so the bracket squared is on its own.', lines: [line([part(`(${x} ${signed(show(d))})²`, 0)], show(k), { eq: true })] })
  all.push({ title: 'Root both sides', why: 'A square root can be plus or minus, so keep both.', lines: [line([part(`${x} ${signed(show(d))}`, 0)], `± √${k}`, { eq: true })] })
  return { all, start, d, k }
}
const book = solveSteps(6, 2, 'x', 'x² + 6x + 3 = 1')
book.all.push({ title: 'Move the 3', why: 'Take the bracket’s number away from both sides.', lines: [line([part('x + 3 = ± √7')], 'x = −3 ± √7', { answer: true })] })
worked(solving, 'By completing the square, solve x² + 6x + 3 = 1.', 'Higher A14 Example (Skill 1)', { kind: 'step-worked', start: 'x² + 6x + 3 = 1', steps: book.all },
  'Make it 0, complete the square, then undo it: move the number, square root (plus or minus), and move the 3.')
const whole = solveSteps(2, -8, 'x')
whole.all.push({ title: 'Plus and minus', why: 'Nine is a square number, so the root is three. Use the plus, then the minus.', lines: [
  line([part('3'), sign('−'), part('1')], 2), line([part('−3'), sign('−'), part('1')], '−4'),
  line([part('(x + 1)² = 9')], 'x = 2 or x = −4', { answer: true }),
] })
practice(solving, 'By completing the square, solve x² + 2x − 8 = 0.', 'Higher A14 extra practice', { type: 'numericInput', responseShape: 'roots', acceptanceRule: 'unorderedSet', correctAnswer: '2, -4', displayAnswer: 'x = 2 or x = −4' }, 'x = 2 or x = −4', 'Half of 2 is 1, so the bracket is (x + 1)².', { kind: 'step-worked', start: whole.start, steps: whole.all })
const surd1 = solveSteps(-4, -1, 'x')
surd1.all.push({ title: 'Move the −2', why: 'Add two to both sides. Five isn’t a square number, so leave the root in.', lines: [line([part('x − 2 = ± √5')], 'x = 2 ± √5', { answer: true })] })
practice(solving, 'By completing the square, solve x² − 4x − 1 = 0. Give your answers in surd form.', 'Higher A14 extra practice', plusMinusRoot('x', [2, 5], 'x = 2 ± √5'), 'x = 2 ± √5', 'Half of −4 is −2, so the bracket is (x − 2)².', { kind: 'step-worked', start: surd1.start, steps: surd1.all }, 'Exact answers')
const q4 = solveSteps(14, -1, 'z')
q4.all.push({ title: 'Simplify the surd', why: 'Twenty-five is a square factor of fifty, so five comes out in front.', lines: [line([part('√50', 0)], '5√2', { eq: true })] })
q4.all.push({ title: 'Move the 7', why: 'Take seven away from both sides.', lines: [line([part('z + 7 = ± 5√2')], 'z = −7 ± 5√2', { answer: true })] })
practice(solving, 'Use completing the square to find the exact solutions of z² + 14z − 1 = 0.', 'Higher A14 Your Turn Q4', plusMinusRoot('z', [-7, 5, 2], 'z = −7 ± 5√2'), 'z = −7 ± 5√2', 'Half of 14 is 7. Simplify √50 at the end.', { kind: 'step-worked', start: q4.start, steps: q4.all }, 'Exact answers')
const q5 = solveSteps(4, -3, 'x', '4x = 3 − x²')
q5.all.push({ title: 'Move the 2', why: 'Take two away from both sides. Seven isn’t a square number, so leave the root in.', lines: [line([part('x + 2 = ± √7')], 'x = −2 ± √7', { answer: true })] })
practice(solving, 'Use completing the square to find the exact solutions of 4x = 3 − x².', 'Higher A14 Your Turn Q5', plusMinusRoot('x', [-2, 7], 'x = −2 ± √7'), 'x = −2 ± √7', 'Make one side 0 first: x² + 4x − 3 = 0.', { kind: 'step-worked', start: '4x = 3 − x²', steps: q5.all }, 'Exact answers')

add('mixed', 'Completing the square', 'Higher A14 consolidation', text(
  'x² + bx + c = (x + b/2)² + c − (b/2)²: halve the x number, then take away its square.',
  'With a number in front of x², take it out of the first two terms first, and times the extra by it.',
  'The turning point of y = (x + d)² + e is (−d, e).',
  'To solve, complete the square, move the number across, and square root with plus or minus.',
))

export const tutorCompletingSquareLesson: TutorMethodLesson = {
  id: 'L022H2', number: 22.6, title: 'Completing the square', level: 'GCSE Higher',
  goal: 'Write a quadratic as a(x + d)² + e, find its turning point, and solve an equation by completing the square.',
  labels: { [aOne]: 'a = 1', [turning]: 'Turning point', [aMore]: 'Number in front of x²', [solving]: 'Solving by completing the square', mixed: 'Review' },
  states: finish(),
}

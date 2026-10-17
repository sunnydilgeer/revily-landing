/*
 * Lesson 15H, Functions (Higher only), after Lesson 29 Function machines. From the Higher revision guide, A26 (pages 102
 * to 105): Type 1 Evaluating functions (f(x) = 3x + 1, f(10) = 31, Level 6-7), Type 2 Composite functions (fg(x) means
 * f(g(x)): do g first, Level 8-9), Type 3 Inverse functions (write x = f(y), make y the subject, Level 8-9), Example 1
 * (f(x) = x − 3, g(x) = x²) and Example 2 (f(x) = 3x − 9), and the Your Turn page (Q1 to Q4). Numbers are typed (a
 * fraction in its simplest form); an expression with a fraction in it is marked by trying numbers (the `formula` rule),
 * so 5/x + 4 and (5 + 4x)/x are both right, and a plain expression must be fully collected.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign, type StepWorking } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { choose, fraction, number, screens, text } from './helpers'

const a = author(29.5, 'L029H')
const { add, finish } = a
const { worked, practice } = screens(a)

const evaluate = 'functions-evaluate'
const composite = 'functions-composite'
const inverse = 'functions-inverse'

/** An expression with a fraction in it, typed after its prefix and marked by trying numbers for x. */
const formula = (answer: string): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'formula', acceptanceRule: 'formula', correctAnswer: answer.replace(/−/g, '-'), displayAnswer: answer,
})
/** A plain expression typed with the letter keyboard, matched however its terms are ordered. */
const expression = (answer: string): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'expression', acceptanceRule: 'collectedExpression', anyPower: true, correctAnswer: answer.replace(/−/g, '-'), displayAnswer: answer,
})
/** A question whose answer box has words in front of it: "f⁻¹(x) =", "x =". */
function ask(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, answer: string, prefix: string, hint: string, working: StepWorking) {
  const state = practice(topic, title, sourceRef, interaction, answer, hint, working)
  state.answerPrefix = prefix
  return state
}
/** One line "from = to", the answer when it is the last move. */
const eq = (title: string, why: string, from: string, to: string, family?: number, answer = false) => ({ title, why, lines: [line([part(from, family)], to, { eq: true, answer })] })

/* ---------- Section 1: evaluating functions (Type 1, Level 6-7) ---------- */

add(evaluate, 'Functions', 'Higher A26 Functions', text(
  'A function takes an input and gives an output, like a function machine written as algebra.',
  'f(x) = 3x + 1 means: whatever goes in, times it by 3, then add 1.',
  'f(10) means the output when the input is 10. Replace every x with 10 and work it out.',
))

worked(evaluate, 'A function is given by f(x) = 3x + 1. Find f(10).', 'Higher A26 Type 1 Evaluating Functions', {
  kind: 'step-worked', start: 'f(x) = 3x + 1', steps: [
    eq('Replace x', 'Put the input in place of every x in the rule.', 'f(10)', '3 × 10 + 1', 0),
    { title: 'Work it out', why: 'Multiply first, then add.', lines: [line([part('3'), sign('×'), part('10', 0), sign('+'), part('1')], '31', { answer: true })] },
  ],
}, 'Replace x with 10 and calculate: f(10) = 3 × 10 + 1 = 31.')

ask(evaluate, 'Let f(x) = 10/(3x − 5). Find f(10).', 'Higher A26 Your Turn Q1a', fraction('2/5'), '2/5', 'f(10) =', 'Work out the bottom first: 3 × 10 − 5.', {
  kind: 'step-worked', start: 'f(x) = 10/(3x − 5)', steps: [
    { title: 'Work out the bottom', why: 'Replace x with the input in the bottom of the fraction.', lines: [line([part('3'), sign('×'), part('10', 0), sign('−'), part('5')], '25')] },
    { title: 'Divide and simplify', why: 'Divide the top by the bottom, and cancel by five.', lines: [line([part('10'), sign('÷'), part('25', 0)], '2/5', { answer: true })] },
  ],
})
ask(evaluate, 'Let f(x) = 10/(3x − 5). Find f(2).', 'Higher A26 Your Turn Q1b', number(10, '10'), '10', 'f(2) =', 'Work out the bottom first: 3 × 2 − 5.', {
  kind: 'step-worked', start: 'f(x) = 10/(3x − 5)', steps: [
    { title: 'Work out the bottom', why: 'Replace x with the input in the bottom of the fraction.', lines: [line([part('3'), sign('×'), part('2', 0), sign('−'), part('5')], '1')] },
    { title: 'Divide', why: 'Dividing by one leaves the top as it is.', lines: [line([part('10'), sign('÷'), part('1', 0)], '10', { answer: true })] },
  ],
})
ask(evaluate, 'Let f(x) = 10/(3x − 5). Find f(−1).', 'Higher A26 Your Turn Q1c', fraction('−5/4'), '−5/4', 'f(−1) =', 'Three times minus one is minus three. Then take 5.', {
  kind: 'step-worked', start: 'f(x) = 10/(3x − 5)', steps: [
    { title: 'Work out the bottom', why: 'Replace x with minus one. A positive times a negative is negative.', lines: [line([part('3'), sign('×'), part('(−1)', 0), sign('−'), part('5')], '−8')] },
    { title: 'Divide and simplify', why: 'A positive divided by a negative is negative. Cancel by two.', lines: [line([part('10'), sign('÷'), part('(−8)', 0)], '−5/4', { answer: true })] },
  ],
})
ask(evaluate, 'Let f(x) = x² − 4x. Find f(−3).', 'Higher A26 extra practice', number(21, '21'), '21', 'f(−3) =', 'Minus three squared is plus nine.', {
  kind: 'step-worked', start: 'f(x) = x² − 4x', steps: [
    { title: 'Square the input', why: 'A negative times a negative is positive.', lines: [line([part('(−3)', 0), sign('×'), part('(−3)', 0)], '9')] },
    { title: 'Times it by 4', why: 'A positive times a negative is negative.', lines: [line([part('4'), sign('×'), part('(−3)', 0)], '−12')] },
    { title: 'Take them away', why: 'Taking away a negative is the same as adding.', lines: [line([part('9'), sign('−'), part('(−12)')], '21', { answer: true })] },
  ],
})
practice(evaluate, 'Let f(x) = 2x². What is f(3)?', 'Higher A26 extra practice', choose(['18', '36', '12']), '18', 'Only the x is squared, not the 2.', {
  kind: 'step-worked', start: 'f(x) = 2x²', steps: [
    { title: 'Square the input', why: 'The power is on the x only, so square the input first.', lines: [line([part('3', 0), sign('×'), part('3', 0)], '9')] },
    { title: 'Times it by 2', why: 'Then multiply by the number in front.', lines: [line([part('2'), sign('×'), part('9')], '18', { answer: true })] },
  ],
})
ask(evaluate, 'Let f(x) = 5 − 2x. Find x when f(x) = 11.', 'Higher A26 extra practice', number(-3, '−3'), '−3', 'x =', 'Solve 5 − 2x = 11.', {
  kind: 'step-worked', start: 'f(x) = 5 − 2x', steps: [
    eq('Make an equation', 'The output is given, so set the rule equal to it and solve.', '5 − 2x', '11', 0),
    eq('Take away 5', 'Take five from both sides.', '−2x', '6', 0),
    { title: 'Divide by −2', why: 'Divide both sides by the number in front of x.', lines: [line([part('6'), sign('÷'), part('(−2)', 0)], '−3', { answer: true })] },
  ],
})

/* ---------- Section 2: composite functions (Type 2 and Example 1, Level 8-9) ---------- */

add(composite, 'Composite functions', 'Higher A26 Type 2 Composite Functions', text(
  'A composite function is one function straight after another.',
  'fg(x) means f(g(x)): do g first, then put its answer into f.',
  'gf(x) is the other way round, and usually gives a different answer.',
))

worked(composite, 'Let f(x) = 2x − 3 and g(x) = x + 1. Find fg(x).', 'Higher A26 Type 2 Composite Functions', {
  kind: 'step-worked', start: 'fg(x)', steps: [
    eq('Do g first', 'The function next to the x goes first.', 'fg(x)', 'f(x + 1)', 0),
    eq('Put it in f', 'Replace the x in f with the whole of g, in a bracket.', 'f(x + 1)', '2(x + 1) − 3', 1),
    eq('Expand and simplify', 'Multiply out the bracket, then collect the numbers.', '2(x + 1) − 3', '2x − 1', 2, true),
  ],
}, 'To find fg(x), replace x in f(x) with g(x), then expand the bracket and simplify.')

worked(composite, 'Let f(x) = x − 3 and g(x) = x². Find fg(10) and gf(−4).', 'Higher A26 Example 1 Composite Functions', {
  kind: 'step-worked', start: 'f(x) = x − 3, g(x) = x²', steps: [
    { title: 'fg(10): g first', why: 'Square the input, then put the answer into f.', lines: [line([part('10', 0), sign('×'), part('10', 0)], '100'), line([part('100'), sign('−'), part('3')], '97')] },
    { title: 'gf(−4): f first', why: 'Now f goes first, then square its answer.', lines: [line([part('−4', 1), sign('−'), part('3')], '−7'), line([part('(−7)'), sign('×'), part('(−7)')], '49', { answer: true })] },
  ],
}, 'fg(10) = f(100) = 97, and gf(−4) = g(−7) = 49. The order matters.')

worked(composite, 'Let f(x) = x − 3 and g(x) = x². Find an expression for fg(x).', 'Higher A26 Example 1 Composite Functions', {
  kind: 'step-worked', start: 'fg(x)', steps: [
    eq('Do g first', 'The function next to the x goes first.', 'fg(x)', 'f(x²)', 0),
    eq('Put it in f', 'f takes three away from whatever goes in.', 'f(x²)', 'x² − 3', 1, true),
  ],
}, 'Input g(x) into f(x): fg(x) = f(g(x)) = g(x) − 3 = x² − 3.')

ask(composite, 'Let f(x) = 15/x and g(x) = 2x − 5. Find fg(4).', 'Higher A26 Your Turn Q2a', number(5, '5'), '5', 'fg(4) =', 'Do g first: g(4) = 2 × 4 − 5.', {
  kind: 'step-worked', start: 'f(x) = 15/x, g(x) = 2x − 5', steps: [
    { title: 'Do g first', why: 'Put the input into g.', lines: [line([part('2'), sign('×'), part('4', 0), sign('−'), part('5')], '3')] },
    { title: 'Put it in f', why: 'f divides fifteen by whatever goes in.', lines: [line([part('15'), sign('÷'), part('3', 1)], '5', { answer: true })] },
  ],
})
ask(composite, 'Let f(x) = 15/x and g(x) = 2x − 5. Find gf(−30).', 'Higher A26 Your Turn Q2b', number(-6, '−6'), '−6', 'gf(−30) =', 'Do f first this time: f(−30) = 15 ÷ (−30).', {
  kind: 'step-worked', start: 'f(x) = 15/x, g(x) = 2x − 5', steps: [
    { title: 'Do f first', why: 'Now f is next to the input, so it goes first. A positive divided by a negative is negative.', lines: [line([part('15'), sign('÷'), part('(−30)', 0)], '−1/2')] },
    { title: 'Put it in g', why: 'g doubles whatever goes in, then takes five.', lines: [line([part('2'), sign('×'), part('(−1/2)', 1), sign('−'), part('5')], '−6', { answer: true })] },
  ],
})
ask(composite, 'Let f(x) = 15/x and g(x) = 2x − 5. Find gf(x).', 'Higher A26 Your Turn Q2c', formula('30/x − 5'), '30/x − 5', 'gf(x) =', 'Do f first: replace the x in g with 15/x.', {
  kind: 'step-worked', start: 'gf(x)', steps: [
    eq('Do f first', 'The function next to the x goes first.', 'gf(x)', 'g(15/x)', 0),
    eq('Put it in g', 'Replace the x in g with the whole of f.', 'g(15/x)', '2 × 15/x − 5', 1),
    eq('Simplify', 'Two lots of fifteen over x is thirty over x.', '2 × 15/x − 5', '30/x − 5', 2, true),
  ],
})
ask(composite, 'Let f(x) = 3x and g(x) = x − 2. Find fg(x).', 'Higher A26 extra practice', expression('3x − 6'), '3x − 6', 'fg(x) =', 'Do g first, then times the whole of it by 3.', {
  kind: 'step-worked', start: 'fg(x)', steps: [
    eq('Do g first', 'The function next to the x goes first.', 'fg(x)', 'f(x − 2)', 0),
    eq('Put it in f', 'f multiplies the whole input by three, so use a bracket.', 'f(x − 2)', '3(x − 2)', 1),
    eq('Expand', 'Multiply both terms in the bracket by three.', '3(x − 2)', '3x − 6', 2, true),
  ],
})
practice(composite, 'Let f(x) = x² and g(x) = x + 4. Which is fg(x)?', 'Higher A26 extra practice', choose(['(x + 4)²', 'x² + 4', '(x² + 4)²']), '(x + 4)²', 'g goes first, then f squares the whole of it.', {
  kind: 'step-worked', start: 'fg(x)', steps: [
    eq('Do g first', 'The function next to the x goes first.', 'fg(x)', 'f(x + 4)', 0),
    eq('Put it in f', 'f squares whatever goes in, so the whole bracket is squared.', 'f(x + 4)', '(x + 4)²', 1, true),
  ],
})
ask(composite, 'Let f(x) = 2x + 1 and g(x) = x². Find gf(3).', 'Higher A26 extra practice', number(49, '49'), '49', 'gf(3) =', 'Do f first: f(3) = 2 × 3 + 1.', {
  kind: 'step-worked', start: 'f(x) = 2x + 1, g(x) = x²', steps: [
    { title: 'Do f first', why: 'f is next to the input, so it goes first.', lines: [line([part('2'), sign('×'), part('3', 0), sign('+'), part('1')], '7')] },
    { title: 'Put it in g', why: 'g squares whatever goes in.', lines: [line([part('7', 1), sign('×'), part('7', 1)], '49', { answer: true })] },
  ],
})

/* ---------- Section 3: inverse functions (Type 3 and Example 2, Level 8-9) ---------- */

add(inverse, 'Inverse functions', 'Higher A26 Type 3 Inverse Functions', text(
  'The inverse function f⁻¹(x) works in reverse: it takes an output of f back to its input.',
  'Step 1: write the rule as x = f(y), with y in place of every x.',
  'Step 2: rearrange to make y the subject. Step 3: replace y with f⁻¹(x).',
))

worked(inverse, 'Given that f(x) = (x + 8)/3, find f⁻¹(x).', 'Higher A26 Type 3 Inverse Functions', {
  kind: 'step-worked', start: 'f(x) = (x + 8)/3', steps: [
    eq('Write x = f(y)', 'Swap: write x for the output and y for every x in the rule.', 'x', '(y + 8)/3', 0),
    eq('Times by 3', 'Multiply both sides by three to clear the fraction.', '3x', 'y + 8', 1),
    eq('Take away 8', 'Take eight from both sides, so y is on its own.', '3x − 8', 'y', 2),
    eq('Replace y', 'y is the inverse function.', 'f⁻¹(x)', '3x − 8', 3, true),
  ],
}, 'Write x = (y + 8)/3, rearrange to make y the subject, then replace y with f⁻¹(x).')

worked(inverse, 'Given that f(x) = 3x − 9, find f⁻¹(x).', 'Higher A26 Example 2 Inverse Functions', {
  kind: 'step-worked', start: 'f(x) = 3x − 9', steps: [
    eq('Write x = f(y)', 'Write x for the output and y for every x in the rule.', 'x', '3y − 9', 0),
    eq('Add 9', 'Add nine to both sides.', 'x + 9', '3y', 1),
    eq('Divide by 3', 'Divide both sides by three, so y is on its own.', '(x + 9)/3', 'y', 2),
    eq('Replace y', 'y is the inverse function.', 'f⁻¹(x)', '(x + 9)/3', 3, true),
  ],
}, 'The inverse undoes each step in reverse order: f times by 3 then takes 9, so f⁻¹ adds 9 then divides by 3.')

ask(inverse, 'Find the inverse function of f(x) = 5/(x − 4).', 'Higher A26 Your Turn Q3', formula('5/x + 4'), '5/x + 4', 'f⁻¹(x) =', 'Write x = 5/(y − 4), then multiply both sides by the bracket.', {
  kind: 'step-worked', start: 'f(x) = 5/(x − 4)', steps: [
    eq('Write x = f(y)', 'Write x for the output and y for every x in the rule.', 'x', '5/(y − 4)', 0),
    eq('Clear the fraction', 'Multiply both sides by the bracket.', 'x(y − 4)', '5', 1),
    eq('Divide by x', 'Divide both sides by x, leaving the bracket on its own.', 'y − 4', '5/x', 2),
    eq('Add 4', 'Add four to both sides, so y is on its own.', 'y', '5/x + 4', 3),
    eq('Replace y', 'y is the inverse function.', 'f⁻¹(x)', '5/x + 4', 3, true),
  ],
})
ask(inverse, 'Find the inverse function of g(x) = 4/x + 3.', 'Higher A26 Your Turn Q4', formula('4/(x − 3)'), '4/(x − 3)', 'g⁻¹(x) =', 'Write x = 4/y + 3, then take 3 from both sides.', {
  kind: 'step-worked', start: 'g(x) = 4/x + 3', steps: [
    eq('Write x = g(y)', 'Write x for the output and y for every x in the rule.', 'x', '4/y + 3', 0),
    eq('Take away 3', 'Take three from both sides, leaving the fraction on its own.', 'x − 3', '4/y', 1),
    eq('Times by y', 'Multiply both sides by y to clear the fraction.', 'y(x − 3)', '4', 2),
    eq('Divide by the bracket', 'Divide both sides by the whole bracket, so y is on its own.', 'y', '4/(x − 3)', 3),
    eq('Replace y', 'y is the inverse function.', 'g⁻¹(x)', '4/(x − 3)', 3, true),
  ],
})
ask(inverse, 'Find the inverse function of f(x) = 2x + 5.', 'Higher A26 extra practice', formula('(x − 5)/2'), '(x − 5)/2', 'f⁻¹(x) =', 'Write x = 2y + 5, then take 5 from both sides.', {
  kind: 'step-worked', start: 'f(x) = 2x + 5', steps: [
    eq('Write x = f(y)', 'Write x for the output and y for every x in the rule.', 'x', '2y + 5', 0),
    eq('Take away 5', 'Take five from both sides.', 'x − 5', '2y', 1),
    eq('Divide by 2', 'Divide both sides by two, so y is on its own.', '(x − 5)/2', 'y', 2),
    eq('Replace y', 'y is the inverse function.', 'f⁻¹(x)', '(x − 5)/2', 3, true),
  ],
})
ask(inverse, 'Find the inverse function of f(x) = 4(x − 1).', 'Higher A26 extra practice', formula('x/4 + 1'), 'x/4 + 1', 'f⁻¹(x) =', 'Write x = 4(y − 1), then divide both sides by 4.', {
  kind: 'step-worked', start: 'f(x) = 4(x − 1)', steps: [
    eq('Write x = f(y)', 'Write x for the output and y for every x in the rule.', 'x', '4(y − 1)', 0),
    eq('Divide by 4', 'Divide both sides by four, leaving the bracket on its own.', 'x/4', 'y − 1', 1),
    eq('Add 1', 'Add one to both sides, so y is on its own.', 'x/4 + 1', 'y', 2),
    eq('Replace y', 'y is the inverse function.', 'f⁻¹(x)', 'x/4 + 1', 3, true),
  ],
})
practice(inverse, 'Let f(x) = 7 − x. Which is f⁻¹(x)?', 'Higher A26 extra practice', choose(['7 − x', 'x − 7', 'x + 7']), '7 − x', 'Write x = 7 − y and get y on its own.', {
  kind: 'step-worked', start: 'f(x) = 7 − x', steps: [
    eq('Write x = f(y)', 'Write x for the output and y for every x in the rule.', 'x', '7 − y', 0),
    eq('Add y', 'Add y to both sides, so it is positive.', 'x + y', '7', 1),
    eq('Take away x', 'Take x from both sides. This function is its own inverse.', 'f⁻¹(x)', '7 − x', 2, true),
  ],
})

add('mixed', 'Functions', 'Higher A26 consolidation', text(
  'f(10): replace every x in the rule with 10 and work it out.',
  'fg(x) = f(g(x)): do g first, then put its answer into f. gf is the other way round.',
  'f⁻¹(x): write x = f(y), make y the subject, then replace y with f⁻¹(x).',
))

export const tutorFunctionsLesson: TutorMethodLesson = {
  id: 'L029H', number: 29.5, title: 'Functions', level: 'GCSE Higher',
  goal: 'Evaluate functions, find composite functions like fg(x), and find inverse functions f⁻¹(x).',
  labels: { [evaluate]: 'Evaluating functions', [composite]: 'Composite functions', [inverse]: 'Inverse functions', mixed: 'Review' },
  states: finish(),
}

/*
 * Lesson 25H, Iterative methods (Higher only). From the Higher revision guide, A22 (every box Level 6-7) and its Your
 * Turn page: Skill 1 trial and improvement, Skill 2 using an iteration formula (with the ANS key), and Skill 3 making
 * the formula by rearranging. Every iterate here was worked out exactly; the book's x₃ in the Skill 2 example
 * (0.6548333…) is a slip for 0.6458333…, which still rounds to 0.6.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign, type StepLine } from '../../written-methods/tutor/stepWorking'
import { choose, number, screens, text } from './helpers'

const a = author(25.5, 'L25H')
const { add, finish } = a
const { worked, practice } = screens(a)

const trial = 'iteration-trial'
const formula = 'iteration-formula'
const rearrange = 'iteration-rearrange'

/** One trial: the number put in, what it gives, and whether that is too small or too big. */
const tried = (sum: string, result: string, verdict: string, family?: number): StepLine => line([part(sum, family)], result, { mark: verdict })
/** One go of the formula: xₙ in, xₙ₊₁ out (to 4 decimal places, with … for the rest). */
const go = (from: string, put: string, result: string): StepLine => line([part(from, 0), sign('→'), part(put)], result)

/* ---------- Section 1: trial and improvement (Skill 1) ---------- */

add(trial, 'Iterative methods', 'Higher A22 introduction', text(
  'Some equations can’t be solved exactly. An iterative method repeats a process over and over, getting closer to the answer each time.',
  'Trial and improvement: try a number, see if it is too big or too small, then try a better one.',
  'Stop when you know which two numbers the answer is between, and both round to the same answer.',
))

worked(trial, 'Using trial and improvement, find the solution to x³ + 6x = 4 that lies between 0 and 1, to 1 decimal place.', 'Higher A22 Skill 1 Example', {
  kind: 'step-worked', start: 'x³ + 6x = 4', steps: [
    { title: 'Try the ends', why: 'Put in the biggest and smallest numbers in the range. We want the answer 4: one is too big and one too small, so the solution is between them.', lines: [
      tried('1³ + 6 × 1', '7', 'too big', 0), tried('0³ + 6 × 0', '0', 'too small', 0)] },
    { title: 'Narrow it down', why: 'Try numbers in between, moving towards 4 each time.', lines: [
      tried('0.5³ + 6 × 0.5', '3.125', 'too small', 1), tried('0.7³ + 6 × 0.7', '4.543', 'too big', 1), tried('0.6³ + 6 × 0.6', '3.816', 'too small', 1)] },
    { title: 'Check halfway', why: 'The answer is between 0.6 and 0.7. Try the number halfway between them to see which it rounds to.', lines: [tried('0.65³ + 6 × 0.65', '4.17…', 'too big', 2)] },
    { title: 'The answer', why: 'The solution is between 0.6 and 0.65, and every number there rounds to 0.6.', lines: [line([part('0.6 < x < 0.65')], '0.6', { answer: true })] },
  ],
}, 'Try numbers, each time asking “too big or too small?”, until you know which two numbers it is between.')

practice(trial, 'Starting with x = 2, use trial and improvement to find a solution to 2x³ − 6x = 1 to 1 decimal place.', 'Higher A22 Your Turn Q1', number(1.8, '1.8'), '1.8', 'Work out 2x³ − 6x for each x, and compare it with 1.', {
  kind: 'step-worked', start: '2x³ − 6x = 1', steps: [
    { title: 'Try 2', why: 'Put the starting number in. We want the answer 1.', lines: [tried('2 × 2³ − 6 × 2', '4', 'too big', 0)] },
    { title: 'Try smaller', why: 'Too big, so try smaller numbers until one is too small.', lines: [tried('2 × 1.9³ − 6 × 1.9', '2.318', 'too big', 1), tried('2 × 1.8³ − 6 × 1.8', '0.864', 'too small', 1)] },
    { title: 'Check halfway', why: 'The answer is between 1.8 and 1.9. Try halfway to see which it rounds to.', lines: [tried('2 × 1.85³ − 6 × 1.85', '1.56…', 'too big', 2)] },
    { title: 'The answer', why: 'The solution is between 1.8 and 1.85, so it rounds to 1.8.', lines: [line([part('1.8 < x < 1.85')], '1.8', { answer: true })] },
  ],
}).answerPrefix = 'x ='

practice(trial, 'x³ + 6x = 4. Trying x = 0.6 gives 3.816 and x = 0.7 gives 4.543. Which number should you try next to find x to 1 decimal place?', 'Higher A22 Skill 1 Example', choose(['0.65', '0.8', '0.5', '0.61']), '0.65', 'Which number tells you whether the answer rounds to 0.6 or 0.7?', {
  kind: 'step-worked', start: 'x³ + 6x = 4', steps: [
    { title: 'Between which two', why: 'One is too small and one too big, so the answer is between 0.6 and 0.7.', lines: [line([part('3.816'), sign('<'), part('4'), sign('<'), part('4.543')], '0.6 < x < 0.7')] },
    { title: 'Try halfway', why: 'Halfway between them decides which way the answer rounds.', lines: [line([part('halfway')], '0.65', { answer: true })] },
  ],
})

/* ---------- Section 2: iteration formulas (Skill 2) ---------- */

add(formula, 'Iteration formulas', 'Higher A22 Skill 2', text(
  'An iteration formula like xₙ₊₁ = (4 − xₙ³) ÷ 6 makes the next number from the last one.',
  'Put x₁ in to get x₂. Put x₂ in to get x₃, and keep going. The numbers get closer and closer to a solution.',
  'Stop when two numbers in a row round to the same answer.',
  'On a calculator, type x₁ and press =. Then type the formula with the ANS key in place of xₙ, and keep pressing =.',
))

worked(formula, 'Use the iterative formula xₙ₊₁ = (4 − xₙ³) ÷ 6 with x₁ = 1 to find the value of x to 1 decimal place.', 'Higher A22 Skill 2 Example', {
  kind: 'step-worked', start: 'xₙ₊₁ = (4 − xₙ³) ÷ 6', steps: [
    { title: 'Put x₁ in', why: 'Use x₁ as xₙ in the formula. What comes out is x₂.', lines: [go('x₁ = 1', '(4 − 1³) ÷ 6', '0.5')] },
    { title: 'Keep going', why: 'Each answer goes back into the formula. The ANS key does this for you.', lines: [
      go('x₂', '(4 − 0.5³) ÷ 6', '0.6458…'), go('x₃', '(4 − 0.6458…³) ÷ 6', '0.6217…'), go('x₄', '(4 − 0.6217…³) ÷ 6', '0.6266…')] },
    { title: 'Round them', why: 'Two numbers in a row round to the same answer, so that is the solution.', lines: [line([part('0.6217…', 0)], '0.6'), line([part('0.6266…', 0)], '0.6', { answer: true })] },
  ],
}, 'Put each answer back into the formula until two in a row round to the same answer.')

practice(formula, 'Starting with x₁ = 2, use the iterative formula xₙ₊₁ = ∛(3xₙ + 9) to find a solution to x³ − 3x − 9 = 0 to 2 decimal places.', 'Higher A22 Your Turn Q2', number(2.55, '2.55'), '2.55', 'Type 2, press =, then ∛(3 × ANS + 9) and keep pressing =.', {
  kind: 'step-worked', start: 'xₙ₊₁ = ∛(3xₙ + 9)', steps: [
    { title: 'Put x₁ in', why: 'Use 2 as xₙ. What comes out is x₂.', lines: [go('x₁ = 2', '∛(3 × 2 + 9)', '2.4662…')] },
    { title: 'Keep going', why: 'Put each answer back in, with the ANS key.', lines: [go('x₂', '∛(3 × 2.4662… + 9)', '2.5405…'), go('x₃', '∛(3 × 2.5405… + 9)', '2.5520…'), go('x₄', '∛(3 × 2.5520… + 9)', '2.5538…')] },
    { title: 'Round them', why: 'Round to 2 decimal places. Two in a row are the same, so that is the solution.', lines: [line([part('2.5520…', 0)], '2.55'), line([part('2.5538…', 0)], '2.55', { answer: true })] },
  ],
}).answerPrefix = 'x ='

const negative = practice(formula, 'Starting with x₁ = 1, use the iterative formula xₙ₊₁ = −3 ÷ (xₙ² + 5) to find a solution to x³ + 5x + 3 = 0 to 2 decimal places.', 'Higher A22 Your Turn Q3', { ...number(-0.56, '−0.56'), signed: true }, '−0.56', 'The answers are negative. Square them carefully: a negative squared is positive.', {
  kind: 'step-worked', start: 'xₙ₊₁ = −3 ÷ (xₙ² + 5)', steps: [
    { title: 'Put x₁ in', why: 'Use 1 as xₙ. What comes out is x₂.', lines: [go('x₁ = 1', '−3 ÷ (1² + 5)', '−0.5')] },
    { title: 'Keep going', why: 'Put each answer back in. A negative number squared is positive.', lines: [go('x₂', '−3 ÷ ((−0.5)² + 5)', '−0.5714…'), go('x₃', '−3 ÷ ((−0.5714…)² + 5)', '−0.5632…'), go('x₄', '−3 ÷ ((−0.5632…)² + 5)', '−0.5642…')] },
    { title: 'Round them', why: 'Round to 2 decimal places. The last two are the same, so that is the solution.', lines: [line([part('−0.5632…', 0)], '−0.56'), line([part('−0.5642…', 0)], '−0.56', { answer: true })] },
  ],
})
negative.answerPrefix = 'x ='

practice(formula, 'Starting with x₁ = 4, use the iterative formula xₙ₊₁ = 3 ÷ xₙ² + 3 to find a solution to x³ − 3x² − 3 = 0 to 3 decimal places.', 'Higher A22 Your Turn Q4', number(3.279, '3.279'), '3.279', 'Keep going until two answers in a row round to the same 3 decimal places.', {
  kind: 'step-worked', start: 'xₙ₊₁ = 3 ÷ xₙ² + 3', steps: [
    { title: 'Put x₁ in', why: 'Use 4 as xₙ. What comes out is x₂.', lines: [go('x₁ = 4', '3 ÷ 4² + 3', '3.1875')] },
    { title: 'Keep going', why: 'Put each answer back in. It jumps above and below the solution, getting closer each time.', lines: [
      go('x₂', '3 ÷ 3.1875² + 3', '3.2952…'), go('x₃', '3 ÷ 3.2952…² + 3', '3.2762…'), go('x₄', '3 ÷ 3.2762…² + 3', '3.2794…'), go('x₅', '3 ÷ 3.2794…² + 3', '3.2789…')] },
    { title: 'Round them', why: 'Round to 3 decimal places. The last two are the same, so that is the solution.', lines: [line([part('3.2794…', 0)], '3.279'), line([part('3.2789…', 0)], '3.279', { answer: true })] },
  ],
}).answerPrefix = 'x ='

practice(formula, 'Starting with x₁ = 2, use the iterative formula xₙ₊₁ = ∛(6xₙ + 5) to find a solution to x³ − 6x − 5 = 0 to 2 decimal places.', 'Higher A22 Your Turn Q5', number(2.79, '2.79'), '2.79', 'Keep going until two answers in a row round to the same 2 decimal places.', {
  kind: 'step-worked', start: 'xₙ₊₁ = ∛(6xₙ + 5)', steps: [
    { title: 'Put x₁ in', why: 'Use 2 as xₙ. What comes out is x₂.', lines: [go('x₁ = 2', '∛(6 × 2 + 5)', '2.5712…')] },
    { title: 'Keep going', why: 'Put each answer back in, with the ANS key.', lines: [
      go('x₂', '∛(6 × 2.5712… + 5)', '2.7336…'), go('x₃', '∛(6 × 2.7336… + 5)', '2.7764…'), go('x₄', '∛(6 × 2.7764… + 5)', '2.7874…'), go('x₅', '∛(6 × 2.7874… + 5)', '2.7903…')] },
    { title: 'Round them', why: 'Round to 2 decimal places. 2.7764… rounds to 2.78, but the next two both round to the same answer.', lines: [line([part('2.7874…', 0)], '2.79'), line([part('2.7903…', 0)], '2.79', { answer: true })] },
  ],
}).answerPrefix = 'x ='

/* ---------- Section 3: making the formula (Skill 3) ---------- */

add(rearrange, 'Making the formula', 'Higher A22 Skill 3', text(
  'Sometimes you have to make the iteration formula yourself, by rearranging the equation.',
  'Rearrange it into the form the question asks for, with x on its own on one side.',
  'Then write xₙ₊₁ in place of the x on its own, and xₙ in place of every other x.',
))

worked(rearrange, 'Show that x³ + x² = 7 can be rearranged to give xₙ₊₁ = ∛(7 − xₙ²).', 'Higher A22 Skill 3 Example', {
  kind: 'step-worked', start: 'x³ + x² = 7', steps: [
    { title: 'Subtract x²', why: 'Get the x³ on its own on one side.', lines: [line([part('x³ + x² = 7')], 'x³ = 7 − x²')] },
    { title: 'Cube root', why: 'Cube root both sides, so x is on its own.', lines: [line([part('x³ = 7 − x²')], 'x = ∛(7 − x²)')] },
    { title: 'Add the notation', why: 'The x on its own becomes the next number. The x inside the formula is the last one.', lines: [line([part('x = ∛(7 − x²)')], 'xₙ₊₁ = ∛(7 − xₙ²)', { answer: true })] },
  ],
}, 'Rearrange to get x on its own in the form you want, then add the little n and n + 1.')

practice(rearrange, 'Which iteration formula comes from rearranging x³ − 3x − 9 = 0?', 'Higher A22 Your Turn Q2 (rearranging)', choose([
  'xₙ₊₁ = ∛(3xₙ + 9)', 'xₙ₊₁ = ∛(3xₙ − 9)', 'xₙ₊₁ = ∛(9 − 3xₙ)', 'xₙ₊₁ = (3xₙ + 9)³',
]), 'xₙ₊₁ = ∛(3xₙ + 9)', 'Get x³ on its own first. Mind the signs as terms change sides.', {
  kind: 'step-worked', start: 'x³ − 3x − 9 = 0', steps: [
    { title: 'Get x³ alone', why: 'Add the 3x and the 9 to both sides. Each one changes sign as it moves.', lines: [line([part('x³ − 3x − 9 = 0')], 'x³ = 3x + 9')] },
    { title: 'Cube root', why: 'Cube root both sides, then add the notation.', lines: [line([part('x³ = 3x + 9')], 'xₙ₊₁ = ∛(3xₙ + 9)', { answer: true })] },
  ],
})

practice(rearrange, 'x³ + 5x + 3 = 0 rearranges to x = −3 ÷ (x² + 5). What is the first step?', 'Higher A22 Your Turn Q3 (rearranging)', choose([
  'Take x out as a common factor of x³ + 5x', 'Cube root both sides', 'Divide every term by 5', 'Square both sides',
]), 'Take x out as a common factor of x³ + 5x', 'Look at the answer: the bottom is x² + 5. Where could that come from?', {
  kind: 'step-worked', start: 'x³ + 5x + 3 = 0', steps: [
    { title: 'Move the 3', why: 'Take 3 from both sides, leaving only the terms with x on the left.', lines: [line([part('x³ + 5x + 3 = 0')], 'x³ + 5x = −3')] },
    { title: 'Factorise', why: 'Both terms have an x, so take it out. The bracket is the bottom of the formula.', lines: [line([part('x³ + 5x')], 'x(x² + 5)', { eq: true })] },
    { title: 'Divide', why: 'Divide both sides by the bracket to leave x on its own. So the first step was the common factor.', words: 'Take x out as a common factor of x³ + 5x' },
  ],
})

practice(rearrange, 'The iteration formula xₙ₊₁ = 3 ÷ xₙ² + 3 finds a solution to which equation?', 'Higher A22 Your Turn Q4 (rearranging)', choose([
  'x³ − 3x² − 3 = 0', 'x³ + 3x² + 3 = 0', 'x² − 3x − 3 = 0', 'x³ − 3x − 3 = 0',
]), 'x³ − 3x² − 3 = 0', 'Drop the little n’s, then multiply both sides by x².', {
  kind: 'step-worked', start: 'x = 3 ÷ x² + 3', steps: [
    { title: 'Drop the notation', why: 'At the solution, the next number is the same as the last, so both are just x.', lines: [line([part('xₙ₊₁ = 3 ÷ xₙ² + 3')], 'x = 3 ÷ x² + 3')] },
    { title: 'Multiply by x²', why: 'Multiply every term by x² to clear the fraction.', lines: [line([part('x = 3 ÷ x² + 3')], 'x³ = 3 + 3x²')] },
    { title: 'Make it 0', why: 'Take everything to the left side.', lines: [line([part('x³ = 3 + 3x²')], 'x³ − 3x² − 3 = 0', { answer: true })] },
  ],
})

add('mixed', 'Iterative methods', 'Higher A22 consolidation', text(
  'Trial and improvement: try numbers, asking “too big or too small?”, then check halfway to decide how it rounds.',
  'An iteration formula: put x₁ in, then each answer back in (the ANS key), until two in a row round the same.',
  'To make a formula, rearrange to get x on its own, then write xₙ₊₁ for that x and xₙ for the others.',
))

export const tutorIterativeLesson: TutorMethodLesson = {
  id: 'L025H', number: 25.5, title: 'Iterative methods', level: 'GCSE Higher',
  goal: 'Find a solution by trial and improvement, use an iteration formula with the ANS key, and rearrange an equation into one.',
  labels: { [trial]: 'Trial and improvement', [formula]: 'Iteration formulas', [rearrange]: 'Making the formula', mixed: 'Review' },
  states: finish(),
}

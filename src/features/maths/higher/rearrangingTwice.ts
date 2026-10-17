/*
 * Lesson 20 (Rearranging formulae), Higher section: the subject appears twice. From the Higher revision guide, A9
 * Question Type 5 (Level 6-7) and its Your Turn Q4 and Q5: clear any fraction, get every term with the subject on one
 * side and the rest on the other, factorise the subject out, then divide by the bracket.
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, type StepWorking } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition } from '../../number-types/types'
import { choose, screens, type HigherAddition } from './helpers'

const skill = 'rearranging-subject-twice'
const a = author(20, 'L20-H')
const { worked, practice } = screens(a)

/** A formula typed after "R =": `answer` is marked by trying numbers, so any correct form is right. */
const formula = (answer: string, shown: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'formula', acceptanceRule: 'formula', correctAnswer: answer, displayAnswer: shown })
function ask(title: string, sourceRef: string, letter: string, answer: string, shown: string, hint: string, working: StepWorking) {
  const state = practice(skill, title, sourceRef, formula(answer, shown), `${letter} = ${shown}`, hint, working)
  state.answerPrefix = `${letter} =`
  return state
}

const move = (title: string, why: string, from: string, to: string, family?: number) => ({ title, why, lines: [line([part(from, family)], to, { eq: true })] })
const last = (title: string, why: string, from: string, to: string) => ({ title, why, lines: [line([part(from, 2)], to, { eq: true, answer: true })] })

worked(skill, 'Rearrange H = 2R − gR to make R the subject.', 'Higher A9 Question Type 5', {
  kind: 'step-worked', start: 'H = 2R − gR', steps: [
    move('Factorise out R', 'R is in two terms. Take it out as a common factor, so it appears only once.', 'H = 2R − gR', 'H = R(2 − g)', 0),
    last('Divide by the bracket', 'R is multiplied by the bracket, so divide both sides by the whole bracket.', 'H ÷ (2 − g)', 'R = H/(2 − g)'),
  ],
}, 'When the subject appears twice, get both terms on one side, factorise it out, then divide by the bracket.')

ask('Rearrange P = 3t + kt to make t the subject.', 'Higher A9 extra practice', 't', 'p/(3 + k)', 'P/(3 + k)', 'Factorise out t.', {
  kind: 'step-worked', start: 'P = 3t + kt', steps: [
    move('Factorise out t', 'Both terms on the right have a t. Take it out as a common factor.', 'P = 3t + kt', 'P = t(3 + k)', 0),
    last('Divide by the bracket', 'Divide both sides by the whole bracket.', 'P ÷ (3 + k)', 't = P/(3 + k)'),
  ],
})
ask('Rearrange ax + 3 = bx + 7 to make x the subject.', 'Higher A9 extra practice', 'x', '4/(a - b)', '4/(a − b)', 'Get both x terms on the left and the numbers on the right.', {
  kind: 'step-worked', start: 'ax + 3 = bx + 7', steps: [
    move('x terms together', 'Take bx from both sides, and take 3 from both sides.', 'ax + 3 = bx + 7', 'ax − bx = 4', 0),
    move('Factorise out x', 'x is in both terms. Take it out as a common factor.', 'ax − bx', 'x(a − b)', 1),
    last('Divide by the bracket', 'Divide both sides by the whole bracket.', 'x(a − b) = 4', 'x = 4/(a − b)'),
  ],
})
ask('Rearrange x/(x + c) = a/b to make x the subject.', 'Higher A9 Your Turn Q4', 'x', 'a*c/(b - a)', 'ac/(b − a)', 'Multiply both sides by both bottoms first.', {
  kind: 'step-worked', start: 'x/(x + c) = a/b', steps: [
    move('Clear the fractions', 'Multiply both sides by both bottoms: b and the bracket.', 'x/(x + c) = a/b', 'bx = a(x + c)', 0),
    move('Expand the bracket', 'Multiply a by each term in the bracket.', 'a(x + c)', 'ax + ac', 0),
    move('x terms together', 'Take ax from both sides so both x terms are on the left.', 'bx = ax + ac', 'bx − ax = ac', 1),
    move('Factorise out x', 'Take x out as a common factor.', 'bx − ax', 'x(b − a)', 1),
    last('Divide by the bracket', 'Divide both sides by the whole bracket.', 'x(b − a) = ac', 'x = ac/(b − a)'),
  ],
})
ask('Rearrange a = (3 − 2b)/(b − 4) to make b the subject.', 'Higher A9 Your Turn Q5', 'b', '(3 + 4*a)/(a + 2)', '(3 + 4a)/(a + 2)', 'Multiply both sides by (b − 4) first.', {
  kind: 'step-worked', start: 'a = (3 − 2b)/(b − 4)', steps: [
    move('Clear the fraction', 'Multiply both sides by the bottom, the bracket b − 4.', 'a = (3 − 2b)/(b − 4)', 'a(b − 4) = 3 − 2b', 0),
    move('Expand the bracket', 'Multiply a by each term in the bracket.', 'a(b − 4)', 'ab − 4a', 0),
    move('b terms together', 'Add 2b to both sides, and add 4a to both sides.', 'ab − 4a = 3 − 2b', 'ab + 2b = 3 + 4a', 1),
    move('Factorise out b', 'Take b out as a common factor.', 'ab + 2b', 'b(a + 2)', 1),
    last('Divide by the bracket', 'Divide both sides by the whole bracket.', 'b(a + 2) = 3 + 4a', 'b = (3 + 4a)/(a + 2)'),
  ],
})
practice(skill, 'Jo rearranges y = ax + bx to make x the subject and gets x = y − a/b. What should she have done?', 'Higher A9 extra practice', choose([
  'Factorised out x to get y = x(a + b), then divided by the bracket: x = y/(a + b)',
  'Divided both sides by a, then by b',
  'Nothing. Her answer is right',
]), 'Factorised out x to get y = x(a + b), then divided by the bracket: x = y/(a + b)', 'x is in two terms. What do you do first?', {
  kind: 'step-worked', start: 'y = ax + bx', steps: [
    move('Factorise out x', 'x appears twice, so take it out as a common factor first.', 'y = ax + bx', 'y = x(a + b)', 0),
    { title: 'Write the answer', why: 'Then divide both sides by the whole bracket. Jo split the x terms up instead.', words: 'Factorised out x to get y = x(a + b), then divided by the bracket: x = y/(a + b)' },
  ],
})

export const rearrangingTwice: HigherAddition = { lessonId: 'L020', skill, label: 'Subject appears twice', states: a.finish() }

import { select, working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { MethodStep, TermsFrame } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { collect, prettyExpression, prettyKey, prettyTerm, readTerms } from '../../number-types/lessonMath'
import { diagnoseChoice, diagnoseCollect } from './likeTermsDiagnosis'

const { add, finish } = author(15)
const oneLetter = 'like-terms-one-letter'
const differentLetters = 'like-terms-different-letters'
const powers = 'like-terms-powers'
const mixed = 'like-terms-mixed'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })

/** The right answer is written first; this moves it to a different position on each question. */
let turn = 0
function choose(labels: string[]): InteractionDefinition {
  const at = (turn++ * 2 + 1) % labels.length
  const order = labels.slice(1)
  order.splice(at, 0, labels[0])
  return select(order, at)
}

/* ---------- Collecting, worked out from the expression itself ---------- */

const tex = (expression: string) => expression.replace(/−/g, '-').replace(/²/g, '^2')

/** Everything about simplifying one expression: its terms by family, each family's total, and the answer. */
function simplify(expression: string) {
  const terms = readTerms(expression)
  if (!terms) throw new Error(`Cannot read ${expression}`)
  const families = [...new Set(terms.map(term => term.key))]
  const totals = collect(terms)
  const answer = prettyExpression(families.map(key => ({ key, coefficient: totals.get(key)! })))
  const chips = terms.map((term, i) => ({ text: prettyTerm(term, i === 0), family: families.indexOf(term.key) }))
  const groups = families.map((key, family) => {
    const members = terms.filter(term => term.key === key)
    const parts = members.map((term, i) => prettyTerm(term, i === 0)).join(' ')
    return { parts, total: prettyTerm({ key, coefficient: totals.get(key)! }), family, alone: members.length === 1, key }
  })
  return { terms, families, answer, chips, groups }
}

const familyName = (key: string) => key ? `${prettyKey(key)} terms` : 'numbers'

function collecting(expression: string, extra: { title: string; math: string; say: string; answer?: string }[] = []): TutorWorking {
  const { families, answer, chips, groups } = simplify(expression)
  const frame = (stage: 'sort' | 'collect' | 'answer'): TermsFrame => ({
    terms: chips,
    groups: stage === 'sort' ? undefined : groups.map(({ parts, total, family }) => ({ parts, total, family })),
    answer: stage === 'answer' ? answer : undefined,
  })
  const sort = families.length === 1
    ? `All the terms are ${familyName(families[0])}, so they are like terms. Each sign stays with the term after it.`
    : `Colour the like terms: ${families.map(familyName).join(', ').replace(/, ([^,]*)$/, ' and $1')}. Each sign stays with the term after it.`
  const sums = groups.filter(group => !group.alone).map(group => `${group.parts} = ${group.total}`)
  const alone = groups.filter(group => group.alone).map(group => group.total)
  const collectSay = [sums.length ? `Add each family: ${sums.join(', ')}.` : '', alone.length ? `${alone.join(' and ')} ${alone.length === 1 ? 'has' : 'have'} no match, so ${alone.length === 1 ? 'it stays' : 'they stay'} as ${alone.length === 1 ? 'it is' : 'they are'}.` : ''].filter(Boolean).join(' ')
  const steps: MethodStep[] = [
    { title: 'Sort the terms', operation: tex(expression), equation: tex(expression), instruction: sort, frame: { terms: frame('sort') } },
    { title: 'Collect each family', operation: tex(expression), equation: groups.filter(group => !group.alone).map(group => `${tex(group.parts)}=${tex(group.total)}`).join(',\\ ') || tex(answer), instruction: collectSay, frame: { terms: frame('collect') } },
    { title: 'Write the answer', operation: tex(expression), equation: tex(answer), instruction: `${expression} = ${answer}.`, frame: { terms: frame('answer') } },
    ...extra.map(step => ({ title: step.title, operation: tex(expression), equation: step.math, instruction: step.say, frame: step.answer ? { ordering: { answer: step.answer } } : {} })),
  ]
  return { kind: 'method-worked', examples: [{ method: 'collect', expression: tex(expression), label: 'Collect like terms', first: 0, second: 0, steps }] }
}

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null, unit?: string) {
  const answer = interaction.displayAnswer ?? interaction.options?.filter(option => ([] as unknown[]).concat(interaction.correctAnswer).map(String).includes(option.id)).map(option => option.label).join(' and ') ?? ''
  const state = add(topic, title, sourceRef, text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  if (unit) state.answerLabel = unit
  return state
}
function worked(topic: MicroSkillId, title: string, sourceRef: string, model: TutorWorking, body?: string) {
  return add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, durationSeconds: number, sourceFile: string, textAlternative: string[]) => ({
  id: `lesson15-${name}`, src: `/media/lesson-15/${name}.mp4`, poster: `/media/lesson-15/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})

/** "Simplify …": typed, marked in any order, with the working and wrong-answer messages worked out from the expression. */
function simplifyQuestion(topic: MicroSkillId, sourceRef: string, expression: string, hint: string, title = `Simplify ${expression}.`, unit?: string) {
  const { answer } = simplify(expression)
  const interaction: InteractionDefinition = { type: 'numericInput', responseShape: 'expression', acceptanceRule: 'collectedExpression', correctAnswer: answer, displayAnswer: answer }
  return practice(topic, title, sourceRef, interaction, hint, collecting(expression), response => diagnoseCollect(response, expression), unit)
}

/** "Which of these are like terms with …?": tick every one. Notes say why each wrong option is not a like term. */
function likeTermsQuestion(topic: MicroSkillId, term: string, options: [string, true | string][], hint: string) {
  const interaction: InteractionDefinition = {
    type: 'multiSelect', acceptanceRule: 'unorderedSet',
    options: options.map(([label], i) => ({ id: String(i), label })),
    correctAnswer: options.flatMap(([, right], i) => right === true ? [String(i)] : []),
  }
  const notes = Object.fromEntries(options.flatMap(([, right], i) => right === true ? [] : [[String(i), right]]))
  const right = options.filter(([, ok]) => ok === true).map(([label]) => label)
  const model: TutorWorking = { kind: 'method-worked', examples: [{ method: 'collect', expression: tex(term), label: 'Like terms', first: 0, second: 0, steps: [
    { title: 'Look at the letters and powers', operation: tex(term), equation: tex(term), instruction: `A like term has exactly the same letters, with the same powers, as ${term}. The number in front can be anything, and the order of the letters doesn’t matter.`, frame: { ordering: { values: options.map(([label, ok]) => `${label}: ${ok === true ? 'like term' : 'not a like term'}`) } } },
    { title: 'The like terms', operation: tex(term), equation: right.map(tex).join(',\\ '), instruction: `${right.join(' and ')} ${right.length === 1 ? 'is a like term' : 'are like terms'} with ${term}.`, frame: { ordering: { answer: right.join(', ') } } },
  ] }] }
  return practice(topic, `Which of these are like terms with ${term}? Choose all that apply.`, 'A1 extra practice', interaction, hint, model, response => diagnoseChoice(response, notes))
}

/* ---------- Rung 1: one letter (A1.1) ---------- */

const oneLetterVideo = worked(oneLetter, 'Simplify 3p + 5 + 2p + 4.', 'A1.1 video', collecting('3p + 5 + 2p + 4'), 'Two kinds of term here: p terms and number terms. Collect each kind separately.')
video(oneLetterVideo, media('one-letter', 'Simplifying 3p + 5 + 2p + 4', 56, 'A1.1_Linear_Expressions_with_a_Single_Variable.mp4', [
  'The expression 3p + 5 + 2p + 4 has two kinds of term: p terms and number terms.',
  'Collect the p terms: 3p + 2p = 5p.',
  'Collect the numbers: 5 + 4 = 9.',
  'So 3p + 5 + 2p + 4 = 5p + 9.',
]))
likeTermsQuestion(oneLetter, '3x', [['7x', true], ['3', '3 is a number term. It has no x.'], ['−x', true], ['x²', 'x² means x × x. It is a different term from x.'], ['3y', '3y has a y, not an x.']], 'Like terms have exactly the same letter part. The number in front doesn’t matter.')
simplifyQuestion(oneLetter, 'A1.1 Q1', '4p + 6 + 2p − 3', 'Group the p terms, then the numbers. The − belongs to the 3.')
simplifyQuestion(oneLetter, 'A1.1 Q2', '7x + 4x', 'Both are x terms: add the numbers in front.')
simplifyQuestion(oneLetter, 'A1.1 Q3', '9y + 5 − 4y + 6', 'Collect the y terms, keeping the sign in front of each term.')
simplifyQuestion(oneLetter, 'A1.1 Q4a', '8k − 5 + 3k + 12', 'Collect the k terms, then the numbers. −5 + 12 = 7.')
simplifyQuestion(oneLetter, 'A1.1 Q4b', '(2k + 1) + (3k − 2) + (k + 4)', 'Add all three sides, then collect like terms. k means 1k.', 'A triangle has sides 2k + 1, 3k − 2 and k + 4. Write an expression for its perimeter in its simplest form.')
simplifyQuestion(oneLetter, 'A1.1 Q5a', '10w − 3 − 6w + 9', 'Collect the w terms and the numbers separately.')
simplifyQuestion(oneLetter, 'A1.1 Q5b', '5w + 5w + 5w', 'Three lots of 5w. Only the number in front changes.')
practice(oneLetter, 'Zara says 5w + 5w + 5w = 5w³. Is Zara correct?', 'A1.1 Q5c', choose([
  'No. Adding like terms only changes the number in front, so it is 15w',
  'Yes. There are three w’s, so it becomes w³',
  'No. It is 15w³',
]), 'Adding 5w three times: what happens to the number, and what happens to the w?', collecting('5w + 5w + 5w', [
  { title: 'Why not 5w³?', math: '15w\\ne5w^3', say: 'w³ means w × w × w: that comes from multiplying. Adding like terms never changes the letter or its power.', answer: 'No. 5w + 5w + 5w = 15w' },
]))

/* ---------- Rung 2: different letters (A1.2) ---------- */

const lettersVideo = worked(differentLetters, 'Simplify 4ab + 3a + 2ab.', 'A1.2 video', collecting('4ab + 3a + 2ab'), 'ab and a look alike, but they are not the same term.')
video(lettersVideo, media('different-letters', 'Simplifying 4ab + 3a + 2ab', 49, 'A1.2_Like_Terms_with_Different_Letters.mp4', [
  'In 4ab + 3a + 2ab, ab and a look similar, but they are not the same term.',
  'Collect the ab terms: 4ab + 2ab = 6ab.',
  '3a has no match, so it stays as it is.',
  'So 4ab + 3a + 2ab = 6ab + 3a.',
]))
likeTermsQuestion(differentLetters, '4ab', [['4a', '4a has no b. It is a different term from 4ab.'], ['2ab', true], ['ba', true], ['4b', '4b has no a. It is a different term from 4ab.'], ['a²b', 'a²b has a squared. The powers have to match too.']], 'The letters must match exactly, though they can be in any order.')
simplifyQuestion(differentLetters, 'A1.2 Q1', '3ab + 4a + 2ab', 'Only the ab terms combine. 4a has no match.')
simplifyQuestion(differentLetters, 'A1.2 Q2', '6mn + 2mn', 'Both terms are mn terms.')
simplifyQuestion(differentLetters, 'A1.2 Q3', '7pq + 3q + 2pq − q', 'Collect the pq terms. Then the q terms: −q means −1q.')
simplifyQuestion(differentLetters, 'A1.2 Q4a', '5xy + 3x − 2xy + 7x', 'Collect the xy terms and the x terms separately.')
simplifyQuestion(differentLetters, 'A1.2 Q4b', '4ab + 2a + 3ab − 5a', 'Collect the ab terms, then the a terms. 2a − 5a is negative.')
simplifyQuestion(differentLetters, 'A1.2 Q5a', '9cd + 4c − 3cd + 2c', 'Collect the cd terms and the c terms separately.')
simplifyQuestion(differentLetters, 'A1.2 Q5b', '2ef + 5e + 3ef', 'Collect the ef terms. 5e has no match.')
simplifyQuestion(differentLetters, 'A1.2 Q5c', '2ef + 5e + 3ef + 2e', 'ef and e are different terms. Collect each one separately.', 'Omar says ef and e are like terms because they both contain e. Simplify 2ef + 5e + 3ef + 2e correctly.')

/* ---------- Rung 3: powers (A1.3) ---------- */

const powersVideo = worked(powers, 'Simplify 3x²y + 2xy² + 4x²y.', 'A1.3 video', collecting('3x²y + 2xy² + 4x²y'), 'x²y and xy² use the same letters, but not the same powers.')
video(powersVideo, media('powers', 'Simplifying 3x²y + 2xy² + 4x²y', 49, 'A1.3_Identifying_Like_Terms_with_Powers.mp4', [
  'In 3x²y + 2xy² + 4x²y, x²y and xy² use the same letters but not the same powers.',
  'Collect the x²y terms: 3x²y + 4x²y = 7x²y.',
  '2xy² has no match, so it stays as it is.',
  'So the answer is 7x²y + 2xy².',
]))
likeTermsQuestion(powers, '3x²y', [['3xy²', 'In 3xy² the y is squared, not the x. The powers must match.'], ['−x²y', true], ['3xy', '3xy has no squares. The powers must match.'], ['5yx²', true], ['x²y²', 'x²y² has y squared as well. The powers must match.']], 'Check each letter’s power, not just the letters.')
simplifyQuestion(powers, 'A1.3 Q1', '3p²q + 4pq² + 2p²q', 'p²q and pq² are different terms.')
simplifyQuestion(powers, 'A1.3 Q2', '6m²n + 2m²n', 'Both terms are m²n terms.')
simplifyQuestion(powers, 'A1.3 Q3', '5a²b + 3ab² + a²b − ab²', 'Collect the a²b terms, then the ab² terms. a²b means 1a²b.')
simplifyQuestion(powers, 'A1.3 Q4a', '7x²y + 2xy² + 3x²y − xy²', 'Collect the x²y terms and the xy² terms separately.')
simplifyQuestion(powers, 'A1.3 Q4b', '2c²d + 3c²d + cd²', 'Collect the c²d terms. cd² has no match.')
simplifyQuestion(powers, 'A1.3 Q5a', '6u²v + 3uv² + 2u²v − uv²', 'Collect the u²v terms and the uv² terms separately.')
simplifyQuestion(powers, 'A1.3 Q5b', '4r²s + 2rs² + r²s + 5rs²', 'Collect the r²s terms and the rs² terms separately.')
practice(powers, 'Leo says 6u²v + 3uv² + 2u²v − uv² simplifies to 8u²v². Is Leo correct?', 'A1.3 Q5c', choose([
  'No. u²v and uv² are different terms, so the answer is 8u²v + 2uv²',
  'Yes. The powers combine into u²v²',
  'No. The answer is 10u²v²',
]), 'Are u²v and uv² like terms?', collecting('6u²v + 3uv² + 2u²v − uv²', [
  { title: 'Why not u²v²?', math: 'u^2v\\ne uv^2', say: 'Each power stays with its own letter. u²v and uv² never combine into one term.', answer: 'No. The answer is 8u²v + 2uv²' },
]))

/* ---------- Rung 4: letters and powers together (A1.4) ---------- */

const mixedVideo = worked(mixed, 'Simplify 5mn + 3x + 2mn + 4y.', 'A1.4 video', collecting('5mn + 3x + 2mn + 4y'), 'Sort every term first. Only exact matches combine.')
video(mixedVideo, media('letters-and-powers', 'Simplifying 5mn + 3x + 2mn + 4y', 49, 'A1.4_Multiple_Letters_and_Powers.mp4', [
  'Sort every term in 5mn + 3x + 2mn + 4y first: only exact matches combine.',
  'Collect the mn terms: 5mn + 2mn = 7mn.',
  '3x and 4y have no match, so they stay as they are.',
  'So the answer is 7mn + 3x + 4y.',
]))
likeTermsQuestion(mixed, '5mn', [['5m', '5m has no n. It is a different term from 5mn.'], ['nm', true], ['5mn²', '5mn² has n squared. The powers must match.'], ['−3mn', true], ['5', '5 is a number term. It has no letters.']], 'Same letters, same powers. The number in front and the order of the letters don’t matter.')
simplifyQuestion(mixed, 'A1.4 Q1', '4ab + 5c + 2ab + 3d', 'Collect the ab terms. 5c and 3d have no match.')
simplifyQuestion(mixed, 'A1.4 Q2', '3xy + 2xy + 4z', 'Collect the xy terms. 4z has no match.')
simplifyQuestion(mixed, 'A1.4 Q3', '5p²q + 3pq + 2p²q', 'p²q and pq are not like terms: the power makes them different.')
simplifyQuestion(mixed, 'A1.4 Q4a', '6mn + 4x + 2mn + 3y − x', 'Collect the mn terms and the x terms. y has no match.')
simplifyQuestion(mixed, 'A1.4 Q4b', '(3ab + 2) + (ab + 5)', 'Add the two lengths, then collect like terms.', 'Two strips of card are placed end to end. They are (3ab + 2) cm and (ab + 5) cm long. Write an expression for the total length in its simplest form.', 'Length (cm)')
simplifyQuestion(mixed, 'A1.4 Q5a', '7pq + 3p²q + pq − p²q', 'Collect the pq terms and the p²q terms separately.')
simplifyQuestion(mixed, 'A1.4 Q5b', '5xy + 2x + 3xy − x + 4y', 'Collect the xy terms and the x terms. 4y has no match.')
practice(mixed, 'Freya says pq and p²q are like terms because they both contain p and q. Is Freya correct?', 'A1.4 Q5c', choose([
  'No. p²q has p squared and pq does not, so they don’t combine',
  'Yes. They use the same letters',
  'Yes. So 7pq + 3p²q + pq − p²q = 10pq',
]), 'Look at the power on p in each term.', collecting('7pq + 3p²q + pq − p²q', [
  { title: 'Why they don’t combine', math: 'pq\\ne p^2q', say: 'Like terms need the same power on every letter. p²q has p squared; pq does not.', answer: 'No. The answer is 8pq + 2p²q' },
]))

add('mixed', 'Collecting like terms', 'A1.1-A1.4 consolidation', text(
  'Like terms have exactly the same letters with the same powers, like 3x²y and 5yx².',
  'The sign in front of a term belongs to it: in 9y − 4y, the 4y is taken away.',
  'Add or subtract the numbers in front. The letters and powers never change: 5w + 5w + 5w = 15w.',
  'Terms with no match stay as they are, and numbers are collected with numbers.',
))

export const tutorLikeTermsLesson: TutorMethodLesson = {
  id: 'L015', number: 15, title: 'Collecting like terms', level: 'GCSE Foundation',
  goal: 'Simplify expressions by collecting terms with the same letters and powers.',
  labels: {
    [oneLetter]: 'One letter', [differentLetters]: 'Different letters', [powers]: 'Powers',
    [mixed]: 'Letters and powers', mixed: 'Review',
  },
  states: finish(),
}

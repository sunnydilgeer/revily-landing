import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { ExpandFrame, MethodStep, WorkingLine } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { collect, prettyExpression, type Term } from '../../number-types/lessonMath'
import { diagnoseKnown } from '../../indices/tutor/indicesDiagnosis'
import { diagnoseExpand, products, show, terms, type Grid } from './expandingDiagnosis'

const { add, finish } = author(17)
const single = 'expand-single'
const double = 'expand-double'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })
const tex = (value: string) => value.replace(/−/g, '-').replace(/×/g, '\\times ').replace(/²/g, '^{2}')

/* ---------- Answers ---------- */

/** Algebra in any order, with the x² key. */
const algebra = (answer: string): InteractionDefinition => ({ type: 'numericInput', responseShape: 'expression', acceptanceRule: 'collectedExpression', correctAnswer: answer, displayAnswer: answer })
const number = (answer: number): InteractionDefinition => ({ type: 'numericInput', correctAnswer: answer, displayAnswer: String(answer), acceptanceRule: 'normalisedNumber' })
/** A choice whose right answer is written first; each wrong option says why it’s wrong. Options are shuffled when shown. */
const choose = (right: string, ...wrong: [string, string][]): InteractionDefinition => ({
  type: 'select', correctAnswer: '0',
  options: [{ id: '0', label: right }, ...wrong.map(([label, feedback], i) => ({ id: String(i + 1), label, feedback }))],
})

/* ---------- Working: the grid method, picture first (src/features/EXPLANATIONS.md) ---------- */

/** "4(2m + 3)" → the term outside and the terms inside; "(x + 4)(x + 6)" → both brackets. */
function read(bracket: string): Grid {
  const match = bracket.replace(/\s/g, '').match(/^([^(]*)\(([^)]*)\)(?:\(([^)]*)\))?$/)
  if (!match) throw new Error(`Cannot read ${bracket}`)
  const [, outside, first, second] = match
  return second !== undefined ? { side: terms(first), top: terms(second) } : { side: terms(outside), top: terms(first) }
}
/** An expression with several brackets, like "2(3x + 5) − 3(x − 4)": the sign in front belongs to the next bracket. */
const grids = (expression: string) => expression.replace(/\s/g, '').replace(/\(([^)]*)\)²/g, '($1)($1)').replace(/−/g, '-').match(/[+-]?[^+-]*\([^)]*\)(?:\([^)]*\))?/g)!.map(part => read(part.replace(/^\+/, '')))
/** The answer, collected, largest power first as the source writes it. */
export function expanded(expression: string) {
  const totals = collect(products(grids(expression)).map(p => p.product))
  return prettyExpression([...totals].map(([key, coefficient]) => ({ key, coefficient })))
}

const header = (term: Term, i: number) => i === 0 ? show(term) : show(term, false).replace(' ', '')
function expandModel(expression: string, extra: { title: string; math: string; say: string; line?: WorkingLine; answer?: string }[] = []): TutorWorking {
  const list = grids(expression), all = products(list)
  const answer = expanded(expression)
  const families = [...collect(all.map(p => p.product)).keys()]
  const family = (term: Term) => families.indexOf(term.key)
  const frame = (filled: boolean): ExpandFrame => ({ grids: list.map(({ side, top }) => ({
    side: side.map(header), top: top.map(header),
    cells: filled ? side.map(a => top.map(b => { const product = all.find(p => p.a === a && p.b === b)!.product; return { text: show(product), family: family(product) } })) : undefined,
  })) })
  const likes = families.map(key => all.filter(p => p.product.key === key)).filter(group => group.length > 1)
  const steps: MethodStep[] = [{
    title: 'Multiply each box', operation: tex(expression), equation: all.map(p => `${tex(show(p.a))}\\times ${tex(show(p.b))}=${tex(show(p.product))}`).join(',\\ '),
    instruction: `Each box is the term on its row times the term on its column. Keep each sign with its term.${list.length > 1 ? ' The sign in front of a bracket belongs to its number.' : ''}`,
    frame: { expand: frame(true) },
  }]
  const sums: WorkingLine[] = []
  if (likes.length) {
    for (const group of likes) {
      const total = group.reduce((sum, p) => sum + p.product.coefficient, 0)
      sums.push({ parts: group.map((p, i) => show(p.product, i === 0)).join(' '), total: show({ key: group[0].product.key, coefficient: total }), family: family(group[0].product) })
    }
    steps.push({ title: 'Collect like terms', operation: tex(expression), equation: likes.map(group => tex(group.map((p, i) => show(p.product, i === 0)).join(' '))).join(',\\ '), instruction: `${likes.length === 1 ? 'Two boxes are like terms, so add them.' : 'Add each family of like terms.'} The other boxes have no match.`, frame: { expand: frame(true), sums: [...sums] } })
  }
  steps.push({ title: 'The answer', operation: tex(expression), equation: tex(answer), instruction: 'Write every term, each with its sign.', frame: { ordering: { answer } } })
  for (const step of extra) {
    if (step.line) sums.push(step.line)
    steps.push({ title: step.title, operation: tex(expression), equation: step.math, instruction: step.say, frame: { sums: step.line ? [...sums] : undefined, ordering: step.answer ? { answer: step.answer } : undefined } })
  }
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: tex(expression), label: 'Expand', first: 0, second: 0, steps, pictureOnly: true }] }
}

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null, unit?: string) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const state = add(topic, title, sourceRef, text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  if (unit) state.answerLabel = unit
  return state
}
function worked(topic: MicroSkillId, title: string, sourceRef: string, model: TutorWorking, body: string) {
  return add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, durationSeconds: number, sourceFile: string, textAlternative: string[]) => ({
  id: `lesson17-${name}`, src: `/media/lesson-17/${name}.mp4`, poster: `/media/lesson-17/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
/** "Expand …": typed in any order, with the grid working and wrong-answer messages worked out from the brackets. */
function expandQuestion(topic: MicroSkillId, sourceRef: string, expression: string, hint: string, title = `${topic === double || /\)\s*[−+-]/.test(expression) ? 'Expand and simplify' : 'Expand'} ${nb(expression)}.`) {
  const list = grids(expression)
  return practice(topic, title, sourceRef, algebra(expanded(expression)), hint, expandModel(expression), response => diagnoseExpand(response, list))
}
const line = (parts: string, total: string, family = 0): WorkingLine => ({ parts, total, family })
/** Keeps an expression on one line in a title, so a phone never breaks it inside a bracket. */
const nb = (expression: string) => expression.replace(/ /g, '\u00a0')

/* ---------- Rung 1: single brackets (A3.1) ---------- */

const singleVideo = worked(single, `Expand ${nb('4(2m + 3)')}.`, 'A3.1 video + Q1', expandModel('4(2m + 3)'), 'Multiply the term outside by everything inside the bracket.')
video(singleVideo, media('single-brackets', 'Expanding 4(2m + 3) and −3(2p − 5)', 57, 'A3.1_Expanding_Single_Brackets.mp4', [
  'Multiply the outside term by everything inside the bracket. First term: 4 × 2m = 8m. Second term: 4 × 3 = 12.',
  'Put the two results together: 4(2m + 3) = 8m + 12. Check with m = 1: both sides give 20.',
  'Now with a negative outside: −3 × 2p = −6p (negative × positive is negative) and −3 × −5 = +15 (negative × negative is positive), so −3(2p − 5) = −6p + 15.',
  '4 identical bags, each holding 2 boxes of m pens and 3 loose pens: 8 boxes of m pens and 12 loose pens, 8m + 12.',
]))
expandQuestion(single, 'A3.1 Q2', '6(y − 4)', 'Multiply both terms by 6. Keep the minus sign with the 4.')
expandQuestion(single, 'A3.1 Q3', '−3(2p − 5)', 'A negative times a positive is negative. A negative times a negative is positive.')
expandQuestion(single, 'A3.1 Q4a', '5k(3k + 4)', 'Multiply the numbers, then the letters: k × k makes k².')
practice(single, 'A rectangular garden has width 5k metres and length (3k + 4) metres. Its area is 15k² + 20k square metres. Work out the area when k = 2.', 'A3.1 Q4b', number(100), 'Put 2 in for every k. Work out the power before multiplying.', expandModel('5k(3k + 4)', [
  { title: 'Put in k = 2', math: '15\\times2^{2}=60', say: 'Powers come before multiplying: 2² = 4, then 15 × 4.', line: line('15 × 2²', '60', 0) },
  { title: 'The other term', math: '20\\times2=40', say: 'Put 2 in for k here too.', line: line('20 × 2', '40', 1) },
  { title: 'Add them', math: '60+40=100', say: 'The area is the sum of the two terms.', line: line('60 + 40', '100', 2) },
  { title: 'The area', math: '100', say: 'In square metres.', answer: '100 m²' },
]), response => diagnoseKnown(response, [['940', 'Square only the 2: 15 × 2² = 15 × 4 = 60, not (15 × 2)².'], ['70', 'k² means k × k, so 15 × 2² = 15 × 4 = 60, not 15 × 2.'], ['140', 'Put 2 in for k: 15 × 2² = 60 and 20 × 2 = 40. 60 + 40 = 100.']]), 'Area (m²)')
expandQuestion(single, 'A3.1 Q5a', '−4a(3a − 2b)', 'Multiply −4a by each term. a × a = a², and two negatives make a positive.')
practice(single, 'Mia expands −4a(3a − 2b) and gets −12a² − 8ab. What has Mia done wrong?', 'A3.1 Q5b', choose(
  'The second term: −4a × −2b = +8ab, because negative × negative is positive',
  ['The first term: −4a × 3a should be −12a', 'a × a = a², so −12a² is right. The mistake is the sign of the second term: −4a × −2b = +8ab.'],
  ['Nothing. −12a² − 8ab is right', 'Look at the second term: −4a × −2b. Negative × negative is positive, so it’s +8ab.'],
), 'Check the sign of each product.', expandModel('−4a(3a − 2b)'))
expandQuestion(single, 'A3.1 Q5c', '2(3x + 5) − 3(x − 4)', 'Expand each bracket separately. The −3 multiplies both terms in its bracket. Then collect like terms.')

/* ---------- Rung 2: double brackets (A3.2) ---------- */

const doubleVideo = worked(double, `Expand and simplify ${nb('(x + 4)(x + 6)')}.`, 'A3.2 video + Q1', expandModel('(x + 4)(x + 6)'), 'Multiply every term in one bracket by every term in the other.')
video(doubleVideo, media('double-brackets', 'Expanding (x + 4)(x + 6) and (x + 7)(x − 3)', 57, 'A3.2_Expanding_Double_Brackets.mp4', [
  'Multiply every term in one bracket by every term in the other. First: x × x = x². Outside: x × 6 = 6x. Inside: 4 × x = 4x. Last: 4 × 6 = 24.',
  'Collect the like terms: 6x + 4x = 10x, so (x + 4)(x + 6) = x² + 10x + 24.',
  'Now with a negative: (x + 7)(x − 3) = x² − 3x + 7x − 21, and −3x + 7x = 4x, so it is x² + 4x − 21.',
  'A patio (x + 4) m by (x + 6) m is built from four pieces: x², 4x, 6x and 24. Add the four areas, then collect: x² + 10x + 24 square metres.',
]))
expandQuestion(double, 'A3.2 Q2', '(a + 1)(a + 8)', 'Four products, then collect the a terms. a × 1 is a.')
expandQuestion(double, 'A3.2 Q3', '(x + 7)(x − 3)', 'Multiply each pair. Watch the signs on the −3.')
expandQuestion(double, 'A3.2 Q4a', '(2m + 1)(m + 5)', 'First 2m × m, outside 2m × 5, inside 1 × m, last 1 × 5.')
practice(double, 'A rectangle has length (2m + 1) cm and width (m + 5) cm. Its area is 2m² + 11m + 5 square centimetres. Work out the area when m = 3.', 'A3.2 Q4b', number(56), 'Put 3 in for every m. Work out the power before multiplying.', expandModel('(2m + 1)(m + 5)', [
  { title: 'Put in m = 3', math: '2\\times3^{2}=18', say: 'Powers come before multiplying: 3² = 9, then 2 × 9.', line: line('2 × 3²', '18', 0) },
  { title: 'The other terms', math: '11\\times3=33', say: 'Put 3 in for m, and the 5 stays as it is.', line: line('11 × 3 and 5', '33 and 5', 1) },
  { title: 'Add them', math: '18+33+5=56', say: 'The area is the sum of the terms.', line: line('18 + 33 + 5', '56', 2) },
  { title: 'The area', math: '56', say: 'In square centimetres.', answer: '56 cm²' },
]), response => diagnoseKnown(response, [['74', 'Square only the 3: 2 × 3² = 2 × 9 = 18, not (2 × 3)².'], ['50', '3² = 3 × 3 = 9, not 3 × 2. So 2 × 9 = 18, and 18 + 33 + 5 = 56.'], ['44', 'm² means m × m: 2 × 3² = 18, not 2 × 3.']]), 'Area (cm²)')
expandQuestion(double, 'A3.2 Q5a', '(n − 4)(n − 9)', 'Two negatives multiply to a positive, so the last term is positive.')
practice(double, 'Dev says that (n − 4)² = n² − 16. Use n = 6 to show that Dev is wrong.', 'A3.2 Q5b', choose(
  '(6 − 4)² = 4, but 6² − 16 = 20, so Dev is wrong',
  ['(6 − 4)² = 20 and 6² − 16 = 20, so Dev is right', 'Work out the bracket first: 6 − 4 = 2, and 2² = 4. The other side is 36 − 16 = 20.'],
  ['(6 − 4)² = 32 and 6² − 16 = 20', 'Work out the bracket first, then square it: 6 − 4 = 2, and 2² = 4.'],
  ['(6 − 4)² = 4 and 6² − 16 = 4', '6² − 16 = 36 − 16 = 20, not 4.'],
), 'Put 6 in for n on each side. Work out the bracket first.', {
  kind: 'method-worked', examples: [{ method: 'ordering', expression: '(n-4)^{2}', label: 'Test n = 6', first: 0, second: 0, pictureOnly: true, steps: [
    { title: 'The left side', operation: '(n-4)^{2}', equation: '(6-4)^{2}=2^{2}=4', instruction: 'Bracket first, then the power.', frame: { sums: [line('(6 − 4)²', '2² = 4', 0)] } },
    { title: 'The right side', operation: 'n^{2}-16', equation: '6^{2}-16=20', instruction: 'Power first, then take away.', frame: { sums: [line('(6 − 4)²', '2² = 4', 0), line('6² − 16', '36 − 16 = 20', 1)] } },
    { title: 'The answer', operation: '4\\ne20', equation: '4\\ne20', instruction: 'The two sides give different answers, so they aren’t equal.', frame: { ordering: { answer: '4 is not 20, so Dev is wrong' } } },
  ] }],
})
expandQuestion(double, 'A3.2 Q5c', '(n − 4)²', 'Squaring means multiplying the bracket by itself: (n − 4)(n − 4).', `Expand and simplify ${nb('(n − 4)²')}.`)

add('mixed', 'Expanding brackets', 'A3.1-A3.2 consolidation', text(
  'Multiply the term outside by every term inside: 4(2m + 3) = 8m + 12.',
  'Negative × positive is negative, and negative × negative is positive: −3(2p − 5) = −6p + 15.',
  'Double brackets: multiply every term by every term (four products), then collect like terms: (x + 4)(x + 6) = x² + 10x + 24.',
  'A squared bracket is the bracket times itself: (n − 4)² = n² − 8n + 16, not n² − 16.',
))

export const tutorExpandingLesson: TutorMethodLesson = {
  id: 'L017', number: 17, title: 'Expanding brackets', level: 'GCSE Foundation',
  goal: 'Expand single and double brackets, and simplify the result.',
  labels: { [single]: 'Single brackets', [double]: 'Double brackets', mixed: 'Review' },
  states: finish(),
}

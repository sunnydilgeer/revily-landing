import { select, working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { HopFrame, MethodStep, OrderingFrame } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseBetween, diagnoseMultiplier, diagnoseOrdinary, diagnoseStandardForm, sf, sup, type StandardFormCheck } from './standardFormDiagnosis'

const { add, finish } = author(14)
const toLarge = 'standard-form-to-large'
const toSmall = 'standard-form-to-small'
const writeLarge = 'standard-form-write-large'
const writeSmall = 'standard-form-write-small'
const multiply = 'standard-form-multiply'
const divide = 'standard-form-divide'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })
const tidy = (n: number) => Number(n.toPrecision(12))
const minus = (n: number) => String(n).replace('-', '−')
const places = (n: number) => `${Math.abs(n)} place${Math.abs(n) === 1 ? '' : 's'}`

/** The right answer is written first; this moves it to a different position on each question. */
let turn = 0
function choose(labels: string[]): InteractionDefinition {
  const at = (turn++ * 2 + 1) % labels.length
  const order = labels.slice(1)
  order.splice(at, 0, labels[0])
  return select(order, at)
}

/* ---------- Numbers as digit strings, so no floating-point noise ---------- */

/** "36000" → "36 000". Whole parts of 5 digits or more are grouped in threes. */
function group(plain: string) {
  const [whole, fraction] = plain.split('.')
  const grouped = whole.length >= 5 ? whole.replace(/\B(?=(\d{3})+$)/g, ' ') : whole
  return fraction ? `${grouped}.${fraction}` : grouped
}
const tex = (value: string) => value.replaceAll(' ', '\\,')

/** a × 10ⁿ as an ordinary number, worked on the digits: "6.3", -5 → "0.000063". */
function ordinaryOf(a: string, n: number) {
  const [whole, fraction = ''] = a.split('.')
  let digits = whole + fraction, point = whole.length + n
  if (point <= 0) { digits = '0'.repeat(1 - point) + digits; point = 1 }
  if (point > digits.length) digits = digits.padEnd(point, '0')
  const out = `${digits.slice(0, point)}.${digits.slice(point)}`.replace(/^0+(?=\d)/, '').replace(/\.?0*$/, '')
  return out
}

/** The hop picture for a × 10ⁿ → ordinary number. */
function hopsToOrdinary(a: string, n: number, stage: HopFrame['stage']): HopFrame {
  const [whole, fraction = ''] = a.split('.')
  let cells = (whole + fraction).split(''), start = whole.length, added: number[] = []
  if (n > 0) {
    const end = start + n
    for (let i = cells.length; i < end; i++) { cells.push('0'); added.push(i) }
    return { cells, start, end, added, stage, answer: group(ordinaryOf(a, n)) }
  }
  const pad = 1 - (start + n)
  cells = [...'0'.repeat(pad)].concat(cells)
  added = Array.from({ length: pad }, (_, i) => i)
  start += pad
  return { cells, start, end: 1, added, stage, answer: ordinaryOf(a, n) }
}

/** The hop picture for an ordinary number → standard form: the point hops to just after the first non-zero digit. */
function hopsToStandard(ordinary: string, stage: HopFrame['stage'], answer: string): HopFrame {
  const [whole, fraction = ''] = ordinary.replaceAll(' ', '').split('.')
  const cells = (whole + fraction).split('')
  const first = cells.findIndex(cell => cell !== '0'), last = cells.length - 1 - [...cells].reverse().findIndex(cell => cell !== '0')
  const dropped = cells.map((_, i) => i).filter(i => i < first || i > last)
  return { cells, start: whole.length, end: first + 1, dropped, stage, answer }
}

/** Standard form facts for a number given as a digit string. */
function standardOf(ordinary: string) {
  const [whole, fraction = ''] = ordinary.replaceAll(' ', '').split('.')
  const cells = whole + fraction
  const first = [...cells].findIndex(cell => cell !== '0')
  const n = whole.length - (first + 1)
  const significant = cells.slice(first).replace(/0+$/, '')
  const a = significant.length > 1 ? `${significant[0]}.${significant.slice(1)}` : significant
  return { a: Number(a), n }
}

/* ---------- Working models ---------- */

type Step = { title: string; math: string; say: string; hop?: HopFrame; order?: OrderingFrame }

function lines(question: string, ...list: Step[]): TutorWorking {
  const steps: MethodStep[] = list.map(step => ({
    title: step.title, operation: question, equation: step.math, instruction: step.say, frame: { hop: step.hop, ordering: step.order },
  }))
  return { kind: 'method-worked', examples: [{ method: 'standard-form', expression: question, label: 'Standard form', first: 0, second: 0, steps }] }
}
const sfTex = (a: number | string, n: number) => `${a}\\times10^{${n}}`

/** a × 10ⁿ → ordinary number: read the power, hop the point, read the number. */
function toOrdinary(a: string, n: number, extra: Step[] = []): TutorWorking {
  const answer = n > 0 ? group(ordinaryOf(a, n)) : ordinaryOf(a, n), way = n > 0 ? 'right' : 'left'
  return lines(sfTex(a, n),
    { title: 'Read the power', math: sfTex(a, n), say: n > 0 ? `The power is ${n}, so the number is large. The point moves ${places(n)} right.` : `The power is ${minus(n)}, so the number is small. The point moves ${places(n)} left.`, hop: hopsToOrdinary(a, n, 'start') },
    { title: 'Hop the point', math: `\\text{${places(n)} ${way}}`, say: 'Hop one place at a time. Fill each empty place with a 0.', hop: hopsToOrdinary(a, n, 'hops') },
    { title: 'Read the number', math: `${sfTex(a, n)}=${tex(answer)}`, say: `${sf(Number(a), n)} = ${answer}.`, hop: hopsToOrdinary(a, n, 'result') },
    ...extra,
  )
}

/** Ordinary number → standard form: find the first non-zero digit, hop the point, write the power. */
function toStandard(ordinary: string, first: Step[] = [], extra: Step[] = []): TutorWorking {
  const { a, n } = standardOf(ordinary), answer = sf(a, n), left = n > 0
  const lead = ordinary.replaceAll(' ', '').replace(/^0\.0*/, '')[0]
  return lines(tex(ordinary), ...first,
    { title: 'Find the first digit', math: tex(ordinary), say: `The point needs to sit straight after the ${lead}, so that one digit is in front of it.`, hop: hopsToStandard(ordinary, 'start', answer) },
    { title: 'Hop the point', math: `\\text{${places(n)} ${left ? 'left' : 'right'}}`, say: `The point hops ${places(n)} ${left ? 'left' : 'right'} to give ${a}.`, hop: hopsToStandard(ordinary, 'hops', answer) },
    { title: 'Write the power', math: `${tex(ordinary)}=${sfTex(a, n)}`, say: left ? `It hopped left, so the number is large and the power is ${n}.` : `It hopped right, so the number is small and the power is ${minus(n)}.`, hop: hopsToStandard(ordinary, 'result', answer) },
    ...extra,
  )
}

/** The last step of × or ÷ when A has come out as 10 or more, or less than 1. */
function fixUp(raw: number, rawPower: number): Step {
  const { a, n } = { a: raw >= 10 ? tidy(raw / 10) : tidy(raw * 10), n: raw >= 10 ? rawPower + 1 : rawPower - 1 }
  const hop: HopFrame = raw >= 10
    ? { cells: String(raw).replace('.', '').split(''), start: String(Math.trunc(raw)).length, end: 1, dropped: String(raw).endsWith('0') ? [String(raw).length - 1] : [], stage: 'result', answer: sf(a, n) }
    : { cells: String(raw).replace('.', '').split(''), start: 1, end: 2, dropped: [0], stage: 'result', answer: sf(a, n) }
  return raw >= 10
    ? { title: 'Check the first number', math: `${sfTex(raw, rawPower)}=${sfTex(a, n)}`, say: `${raw} is 10 or more, so it isn’t standard form yet. ${raw} = ${a} × 10, so add 1 to the power.`, hop }
    : { title: 'Check the first number', math: `${sfTex(raw, rawPower)}=${sfTex(a, n)}`, say: `${raw} is less than 1, so it isn’t standard form yet. ${raw} = ${a} × 10${sup(-1)}, so take 1 off the power.`, hop }
}

type Pair = [number, number]
function times([a1, n1]: Pair, [a2, n2]: Pair, extra: Step[] = []): TutorWorking {
  const p = tidy(a1 * a2), s = n1 + n2
  const done: Step = p >= 10 ? fixUp(p, s) : { title: 'Write the answer', math: sfTex(p, s), say: `${p} is between 1 and 10, so this is standard form.`, order: { answer: sf(p, s) } }
  return lines(`(${sfTex(a1, n1)})\\times(${sfTex(a2, n2)})`,
    { title: 'Multiply the numbers', math: `${a1}\\times${a2}=${p}`, say: 'Multiply the numbers in front.', order: { values: [`Numbers: ${a1} × ${a2} = ${p}`] } },
    { title: 'Add the powers', math: `10^{${n1}}\\times10^{${n2}}=10^{${s}}`, say: `Add the powers: ${n1} + ${n2} = ${s}.`, order: { values: [`Numbers: ${a1} × ${a2} = ${p}`, `Powers: ${n1} + ${n2} = ${s}`] } },
    done, ...extra,
  )
}
function over([a1, n1]: Pair, [a2, n2]: Pair, extra: Step[] = []): TutorWorking {
  const q = tidy(a1 / a2), s = n1 - n2
  const done: Step = q < 1 || q >= 10 ? fixUp(q, s) : { title: 'Write the answer', math: sfTex(q, s), say: `${q} is between 1 and 10, so this is standard form.`, order: { answer: sf(q, s) } }
  return lines(`(${sfTex(a1, n1)})\\div(${sfTex(a2, n2)})`,
    { title: 'Divide the numbers', math: `${a1}\\div${a2}=${q}`, say: 'Divide the first number in front by the second.', order: { values: [`Numbers: ${a1} ÷ ${a2} = ${q}`] } },
    { title: 'Subtract the powers', math: `10^{${n1}}\\div10^{${n2}}=10^{${s}}`, say: `First power minus second power: ${n1} − ${minus(n2)} = ${minus(s)}.`, order: { values: [`Numbers: ${a1} ÷ ${a2} = ${q}`, `Powers: ${n1} − ${minus(n2)} = ${minus(s)}`] } },
    done, ...extra,
  )
}

/* ---------- Answers ---------- */

const ordinary = (a: string, n: number): InteractionDefinition => {
  const plain = ordinaryOf(a, n)
  return { type: 'numericInput', correctAnswer: Number(plain), displayAnswer: n > 0 ? group(plain) : plain, acceptanceRule: 'normalisedNumber' }
}
const standard = (a: number, n: number): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'standardForm', acceptanceRule: 'standardForm', correctAnswer: `${a}×10^${n}`, displayAnswer: sf(a, n),
})
const between = (lower: number, upper: number, n: number): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'standardForm', acceptanceRule: 'standardForm', correctAnswer: `5×10^${n}`, lowerBound: lower, upperBound: upper, displayAnswer: `any number × 10${sup(n)}, such as 5 × 10${sup(n)}`,
})
const multiplier = (answer: number): InteractionDefinition => ({ type: 'numericInput', correctAnswer: answer, displayAnswer: String(answer), acceptanceRule: 'normalisedNumber' })

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
function worked(topic: MicroSkillId, title: string, sourceRef: string, model: TutorWorking, body?: string) {
  return add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, durationSeconds: number, sourceFile: string, textAlternative: string[]) => ({
  id: `lesson14-${name}`, src: `/media/lesson-14/${name}.mp4`, poster: `/media/lesson-14/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})

const toOrdinaryQuestion = (topic: MicroSkillId, title: string, ref: string, a: string, n: number, unit?: string) =>
  practice(topic, title, ref, ordinary(a, n), n > 0 ? `Hop the point ${places(n)} right.` : `Hop the point ${places(n)} left.`, toOrdinary(a, n), response => diagnoseOrdinary(response, { a: Number(a), n }), unit)
const toStandardQuestion = (topic: MicroSkillId, title: string, ref: string, value: string, hint: string, unit?: string, first: Step[] = []) => {
  const { a, n } = standardOf(value)
  return practice(topic, title, ref, standard(a, n), hint, toStandard(value, first), response => diagnoseStandardForm(response, { a, n }), unit)
}
const operationQuestion = (topic: MicroSkillId, title: string, ref: string, kind: 'multiply' | 'divide', first: Pair, second: Pair, hint: string) => {
  const check: StandardFormCheck = { ...(kind === 'multiply' ? normalised(first[0] * second[0], first[1] + second[1]) : normalised(first[0] / second[0], first[1] - second[1])), operation: { kind, first, second } }
  return practice(topic, title, ref, standard(check.a, check.n), hint, kind === 'multiply' ? times(first, second) : over(first, second), response => diagnoseStandardForm(response, check))
}
function normalised(raw: number, power: number) {
  const a = tidy(raw)
  return a >= 10 ? { a: tidy(a / 10), n: power + 1 } : a < 1 ? { a: tidy(a * 10), n: power - 1 } : { a, n: power }
}
const betweenQuestion = (topic: MicroSkillId, title: string, ref: string, lower: number, upper: number, n: number) =>
  practice(topic, title, ref, between(lower, upper, n), `Every number between these two has the same power of 10. Which power?`, lines(`${tex(group(String(lower)))}\\text{ to }${tex(group(String(upper)))}`,
    { title: 'Write both ends in standard form', math: `${sfTex(1, n)}\\text{ to }${sfTex(1, n + 1)}`, say: `${group(String(lower))} = 1 × 10${sup(n)} and ${group(String(upper))} = 1 × 10${sup(n + 1)}.`, order: { values: [`Lower: 1 × 10${sup(n)}`, `Upper: 1 × 10${sup(n + 1)}`] } },
    { title: 'Pick a number in between', math: sfTex(5, n), say: `Any number from 1 to 10 (but not 1 itself) times 10${sup(n)} works, such as 5 × 10${sup(n)}.`, order: { answer: `5 × 10${sup(n)}` } },
  ), response => diagnoseBetween(response, { lower, upper, n }))

/* ---------- Rung 1: standard form into large numbers (N14.2) ---------- */

const largeVideo = worked(toLarge, 'Write 3.6 × 10⁴ as an ordinary number.', 'N14.2 Q1; video N14.2', toOrdinary('3.6', 4), 'A positive power makes a large number: the point hops right.')
video(largeVideo, media('into-large-numbers', 'Converting 3.6 × 10⁴ into an ordinary number', 27, 'N14.2_Standard_Form_into_Large_Numbers.mp4', [
  'The power in 3.6 × 10⁴ is +4, so the number is large and the point moves right.',
  'Hop the point right one place at a time until it has moved 4 places.',
  'Fill the empty places with zeros: 3.6 × 10⁴ = 36 000.',
]))
toOrdinaryQuestion(toLarge, 'Write 5 × 10³ as an ordinary number.', 'N14.2 Q2', '5', 3)
toOrdinaryQuestion(toLarge, 'Write 8.14 × 10⁵ as an ordinary number.', 'N14.2 Q3', '8.14', 5)
toOrdinaryQuestion(toLarge, 'Write 2.05 × 10⁶ as an ordinary number.', 'N14.2 Q4a', '2.05', 6)
toOrdinaryQuestion(toLarge, 'A star is 9 × 10⁷ km from Earth. Write this distance as an ordinary number.', 'N14.2 Q4b', '9', 7, 'Distance (km)')
practice(toLarge, 'n × 10⁵ = 730 000. Work out n.', 'N14.2 Q5a', multiplier(7.3), 'Write 730 000 in standard form. n is the number in front.', toStandard('730 000', [], [
  { title: 'Read off n', math: 'n=7.3', say: 'The power is already 5, so n is the number in front: 7.3.', order: { answer: 'n = 7.3' } },
]), response => diagnoseMultiplier(response, 7.3))
betweenQuestion(toLarge, 'Write a number in standard form that is between 100 000 and 1 000 000.', 'N14.2 Q5b', 100000, 1000000, 5)
practice(toLarge, 'Ali says: “To write 2.5 × 10⁴ as an ordinary number, just write 2.5 with four zeros after it.” Is Ali correct?', 'N14.2 Q5c', choose([
  'No. 2.5 × 10⁴ = 25 000, not 250 000',
  'Yes. 10⁴ means add four zeros, so it is 250 000',
  'No. It should be 2 500',
]), 'Hop the point 4 places right and compare.', toOrdinary('2.5', 4, [
  { title: 'Test Ali’s method', math: '25\\,000\\ne250\\,000', say: 'Ali’s way gives 250 000, which is ten times too big. The 5 after the point uses up one of the four hops.', order: { answer: 'No. 2.5 × 10⁴ = 25 000' } },
]))

/* ---------- Rung 2: standard form into small numbers (N14.1) ---------- */

const smallVideo = worked(toSmall, 'Write 6.3 × 10⁻⁵ as an ordinary number.', 'N14.1 Q1; video N14.1', toOrdinary('6.3', -5), 'A negative power makes a small number: the point hops left.')
video(smallVideo, media('into-small-numbers', 'Converting 6.3 × 10⁻⁵ into an ordinary number', 27, 'N14.1_Standard_Form_into_Small_Numbers.mp4', [
  'The power in 6.3 × 10⁻⁵ is −5, so the number is small and the point moves left.',
  'Hop the point left one place at a time until it has moved 5 places.',
  'Fill the empty places with zeros: 6.3 × 10⁻⁵ = 0.000063.',
]))
toOrdinaryQuestion(toSmall, 'Write 4 × 10⁻³ as an ordinary number.', 'N14.1 Q2', '4', -3)
toOrdinaryQuestion(toSmall, 'Write 7.25 × 10⁻⁴ as an ordinary number.', 'N14.1 Q3', '7.25', -4)
toOrdinaryQuestion(toSmall, 'Write 9.08 × 10⁻⁶ as an ordinary number.', 'N14.1 Q4a', '9.08', -6)
toOrdinaryQuestion(toSmall, 'A bacterium is 3.5 × 10⁻⁵ m wide. Write this width as an ordinary number.', 'N14.1 Q4b', '3.5', -5, 'Width (m)')
practice(toSmall, 'n × 10⁻⁴ = 0.00027. Work out n.', 'N14.1 Q5a', multiplier(2.7), 'Write 0.00027 in standard form. n is the number in front.', toStandard('0.00027', [], [
  { title: 'Read off n', math: 'n=2.7', say: 'The power is already −4, so n is the number in front: 2.7.', order: { answer: 'n = 2.7' } },
]), response => diagnoseMultiplier(response, 2.7))
betweenQuestion(toSmall, 'Write a number in standard form that is between 0.0001 and 0.001.', 'N14.1 Q5b', 0.0001, 0.001, -4)
practice(toSmall, 'Priya says: “The more negative the power, the bigger the number.” Is Priya correct?', 'N14.1 Q5c', choose([
  'No. 3 × 10⁻⁶ = 0.000003 is smaller than 3 × 10⁻² = 0.03',
  'Yes. 10⁻⁶ has more zeros, so it is bigger',
  'Yes. −6 is bigger than −2',
]), 'Write 3 × 10⁻² and 3 × 10⁻⁶ as ordinary numbers and compare.', lines('3\\times10^{-2}\\text{ and }3\\times10^{-6}',
  { title: 'Write both out', math: '0.03\\text{ and }0.000003', say: 'Hop the point 2 places left, then 6 places left.', order: { values: ['3 × 10⁻²: 0.03', '3 × 10⁻⁶: 0.000003'] } },
  { title: 'Compare', math: '0.000003<0.03', say: 'The more negative power gives the smaller number, so Priya is wrong.', order: { answer: 'No. A more negative power gives a smaller number' } },
))

/* ---------- Rung 3: writing large numbers in standard form (N14.3) ---------- */

const writeLargeVideo = worked(writeLarge, 'Write 84 300 000 in standard form.', 'N14.3 Q1; video N14.3', toStandard('84 300 000'), 'Hop the point left until one digit is in front. The number of hops is the power.')
video(writeLargeVideo, media('write-large-numbers', 'Writing 84 300 000 in standard form', 29, 'N14.3_Writing_Large_Numbers_in_Standard_Form.mp4', [
  'Start with 84 300 000. The point is at the end.',
  'Move the point left until only one digit is in front of it: 8.43.',
  'It moved 7 places, so 84 300 000 = 8.43 × 10⁷.',
]))
toStandardQuestion(writeLarge, 'Write 6000 in standard form.', 'N14.3 Q2', '6000', 'Hop the point left until only the 6 is in front.')
toStandardQuestion(writeLarge, 'Write 921 000 in standard form.', 'N14.3 Q3', '921 000', 'Hop the point left until you reach 9.21.')
toStandardQuestion(writeLarge, 'Write 3 070 000 in standard form.', 'N14.3 Q4a', '3 070 000', 'Hop the point left to 3.07. Keep the zero between the 3 and the 7.')
toStandardQuestion(writeLarge, 'A company’s revenue was £15 600 000. Write this in standard form.', 'N14.3 Q4b', '15 600 000', 'Hop the point left to 1.56.')
toStandardQuestion(writeLarge, 'A city has 2.4 million people. Write this in standard form.', 'N14.3 Q5a', '2 400 000', 'First write 2.4 million as an ordinary number.', undefined, [
  { title: 'Write it out', math: '2.4\\text{ million}=2\\,400\\,000', say: 'A million is 1 000 000, so 2.4 million = 2 400 000.' },
])
betweenQuestion(writeLarge, 'Write a number in standard form that is between 10 000 and 100 000.', 'N14.3 Q5b', 10000, 100000, 4)
practice(writeLarge, 'Maya says: “The power in standard form is always the number of digits in the ordinary number.” Is Maya correct?', 'N14.3 Q5c', choose([
  'No. 921 000 has 6 digits, but it is 9.21 × 10⁵',
  'Yes. 921 000 has 6 digits, so it is 9.21 × 10⁶',
  'No. The power is one more than the number of digits',
]), 'Test it on 921 000.', toStandard('921 000', [], [
  { title: 'Compare with the digits', math: '6\\text{ digits},\\ 10^{5}', say: '921 000 has 6 digits, but the point only hops 5 places. The power is one less than the number of digits.', order: { answer: 'No. 921 000 = 9.21 × 10⁵' } },
]))

/* ---------- Rung 4: writing small numbers in standard form (N14.4) ---------- */

const writeSmallVideo = worked(writeSmall, 'Write 0.000512 in standard form.', 'N14.4 Q1; video N14.4', toStandard('0.000512'), 'Hop the point right until one non-zero digit is in front. The power is minus the number of hops.')
video(writeSmallVideo, media('write-small-numbers', 'Writing 0.000512 in standard form', 27, 'N14.4_Writing_Small_Numbers_in_Standard_Form.mp4', [
  'Start with 0.000512.',
  'Move the point right until only one non-zero digit is in front of it: 5.12.',
  'It moved 4 places right, so 0.000512 = 5.12 × 10⁻⁴.',
]))
toStandardQuestion(writeSmall, 'Write 0.007 in standard form.', 'N14.4 Q2', '0.007', 'Hop the point right until the 7 is in front.')
toStandardQuestion(writeSmall, 'Write 0.000083 in standard form.', 'N14.4 Q3', '0.000083', 'Hop the point right until you reach 8.3.')
toStandardQuestion(writeSmall, 'Write 0.0000406 in standard form.', 'N14.4 Q4a', '0.0000406', 'Hop the point right to 4.06. Keep the zero between the 4 and the 6.')
toStandardQuestion(writeSmall, 'A grain of pollen is 0.000025 m across. Write this in standard form.', 'N14.4 Q4b', '0.000025', 'Hop the point right to 2.5.', 'Diameter (m)')
toStandardQuestion(writeSmall, 'A virus particle has a mass of 0.00000000094 g. Write this in standard form.', 'N14.4 Q5a', '0.00000000094', 'Hop the point right to 9.4. Count the hops carefully.', 'Mass (g)')
betweenQuestion(writeSmall, 'Write a number in standard form that is between 0.00001 and 0.0001.', 'N14.4 Q5b', 0.00001, 0.0001, -5)
practice(writeSmall, 'Jayden says: “The power is always the number of zeros straight after the decimal point.” Is Jayden correct?', 'N14.4 Q5c', choose([
  'No. 0.000512 has 3 zeros after the point, but it is 5.12 × 10⁻⁴',
  'Yes. 0.000512 has 3 zeros, so it is 5.12 × 10⁻³',
  'No. The power is one less than the number of zeros',
]), 'Test it on 0.000512.', toStandard('0.000512', [], [
  { title: 'Compare with the zeros', math: '3\\text{ zeros},\\ 10^{-4}', say: '0.000512 has 3 zeros after the point, but the point hops 4 places. The power is one more than the zeros.', order: { answer: 'No. 0.000512 = 5.12 × 10⁻⁴' } },
]))

/* ---------- Rung 5: multiplying (N14.5) ---------- */

const multiplyVideo = worked(multiply, 'Work out (2 × 10³) × (4 × 10⁵). Give your answer in standard form.', 'N14.5 Q1; video N14.5', times([2, 3], [4, 5]), 'Multiply the numbers in front. Add the powers.')
video(multiplyVideo, media('multiplying', 'Multiplying (2 × 10³) × (4 × 10⁵)', 26, 'N14.5_Multiplying_Standard_Form.mp4', [
  'Work out (2 × 10³) × (4 × 10⁵).',
  'Multiply the numbers in front: 2 × 4 = 8.',
  'Add the powers: 3 + 5 = 8, giving 10⁸.',
  'The answer is 8 × 10⁸.',
]))
operationQuestion(multiply, 'Work out (3 × 10²) × (2 × 10⁴). Give your answer in standard form.', 'N14.5 Q2', 'multiply', [3, 2], [2, 4], 'Multiply the numbers. Add the powers.')
operationQuestion(multiply, 'Work out (5 × 10⁴) × (6 × 10³). Give your answer in standard form.', 'N14.5 Q3', 'multiply', [5, 4], [6, 3], 'Multiply, add the powers, then check the first number is less than 10.')
operationQuestion(multiply, 'Work out (1.5 × 10⁶) × (4 × 10²). Give your answer in standard form.', 'N14.5 Q4a', 'multiply', [1.5, 6], [4, 2], 'Multiply the numbers. Add the powers.')
operationQuestion(multiply, 'A shop sells 3 × 10⁴ items a day. How many does it sell in 2 × 10² days? Give your answer in standard form.', 'N14.5 Q4b', 'multiply', [3, 4], [2, 2], 'Multiply items per day by the number of days.')
operationQuestion(multiply, 'Work out (8 × 10⁵) × (5 × 10³). Give your answer in standard form.', 'N14.5 Q5a', 'multiply', [8, 5], [5, 3], 'Multiply, add the powers, then rewrite the first number so it is less than 10.')
practice(multiply, 'Which two numbers multiply to give 1.2 × 10⁶?', 'N14.5 Q5b', choose([
  '(3 × 10²) × (4 × 10³)',
  '(3 × 10³) × (4 × 10³)',
  '(1.2 × 10²) × (1 × 10³)',
  '(6 × 10³) × (2 × 10³)',
]), 'The numbers in front must multiply to 12, which is 1.2 × 10.', times([3, 2], [4, 3]))
practice(multiply, 'Zara says: “Multiplying two numbers in standard form always gives an answer in standard form.” Is Zara correct?', 'N14.5 Q5c', choose([
  'No. (8 × 10⁵) × (5 × 10³) = 40 × 10⁸, and 40 is not less than 10',
  'Yes. Both numbers are in standard form, so the answer is too',
  'No. You have to multiply the powers as well',
]), 'Try (8 × 10⁵) × (5 × 10³).', times([8, 5], [5, 3]))

/* ---------- Rung 6: dividing (N14.6) ---------- */

const divideVideo = worked(divide, 'Work out (8 × 10⁷) ÷ (2 × 10³). Give your answer in standard form.', 'N14.6 Q1; video N14.6', over([8, 7], [2, 3]), 'Divide the numbers in front. Subtract the powers.')
video(divideVideo, media('dividing', 'Dividing (8 × 10⁷) ÷ (2 × 10³)', 26, 'N14.6_Dividing_Standard_Form.mp4', [
  'Work out (8 × 10⁷) ÷ (2 × 10³).',
  'Divide the numbers in front: 8 ÷ 2 = 4.',
  'Subtract the powers: 7 − 3 = 4, giving 10⁴.',
  'The answer is 4 × 10⁴.',
]))
operationQuestion(divide, 'Work out (9 × 10⁵) ÷ (3 × 10²). Give your answer in standard form.', 'N14.6 Q2', 'divide', [9, 5], [3, 2], 'Divide the numbers. Subtract the powers.')
operationQuestion(divide, 'Work out (6 × 10⁶) ÷ (4 × 10²). Give your answer in standard form.', 'N14.6 Q3', 'divide', [6, 6], [4, 2], 'Divide the numbers. Subtract the powers.')
operationQuestion(divide, 'Work out (7.2 × 10⁸) ÷ (9 × 10³). Give your answer in standard form.', 'N14.6 Q4a', 'divide', [7.2, 8], [9, 3], 'Divide, subtract the powers, then check the first number is at least 1.')
operationQuestion(divide, 'A charity raised £4 × 10⁶ from 8 × 10² events. What was the mean raised per event, in £? Give your answer in standard form.', 'N14.6 Q4b', 'divide', [4, 6], [8, 2], 'Divide the total by the number of events.')
operationQuestion(divide, 'Work out (2.4 × 10⁹) ÷ (6 × 10⁴). Give your answer in standard form.', 'N14.6 Q5a', 'divide', [2.4, 9], [6, 4], 'Divide, subtract the powers, then rewrite the first number so it is at least 1.')
practice(divide, 'Which division gives 2 × 10⁴?', 'N14.6 Q5b', choose([
  '(6 × 10⁶) ÷ (3 × 10²)',
  '(6 × 10⁸) ÷ (3 × 10²)',
  '(6 × 10²) ÷ (3 × 10⁶)',
  '(8 × 10⁶) ÷ (4 × 10³)',
]), 'The numbers in front must divide to 2, and the powers must subtract to 4.', over([6, 6], [3, 2]))
practice(divide, 'Kwame says: “When you divide in standard form, take the smaller power from the bigger power.” Is Kwame correct?', 'N14.6 Q5c', choose([
  'No. It is always the first power minus the second, even if that is negative',
  'Yes. A power can’t be negative',
  'Yes. So (4 × 10²) ÷ (8 × 10⁵) = 5 × 10²',
]), 'Try (4 × 10²) ÷ (8 × 10⁵).', over([4, 2], [8, 5]))

add('mixed', 'Standard form', 'N14.1-N14.6 consolidation', text(
  'Standard form is A × 10ⁿ, where A is at least 1 and less than 10.',
  'A positive power is a large number: the point hops right. A negative power is a small number: it hops left.',
  'The number of hops is the power. Count the hops, not the digits or the zeros.',
  'Multiply: multiply the numbers and add the powers. Divide: divide the numbers and subtract the powers.',
  'Check A at the end. If it is 10 or more, or less than 1, rewrite it.',
))

export const tutorStandardFormLesson: TutorMethodLesson = {
  id: 'L014', number: 14, title: 'Standard form', level: 'GCSE Foundation',
  goal: 'Convert between ordinary numbers and standard form, and multiply and divide numbers in standard form.',
  labels: {
    [toLarge]: 'Into large numbers', [toSmall]: 'Into small numbers', [writeLarge]: 'Write large numbers',
    [writeSmall]: 'Write small numbers', [multiply]: 'Multiply', [divide]: 'Divide', mixed: 'Review',
  },
  states: finish(),
}

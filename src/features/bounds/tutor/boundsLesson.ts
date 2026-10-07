import { select, working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { IntervalFrame, MethodStep, WorkingLine } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import { line, part, sign, type NumberLinePicture, type StepWorking, type WorkedStep } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseBound, diagnoseCut, type BoundCheck, type CutCheck } from './boundsDiagnosis'

const { add, finish } = author(13)
const halfUnit = 'bounds-half-unit'
const bounds = 'bounds-lower-upper'
const intervals = 'bounds-error-interval'
const truncate = 'truncation'
const truncatedIntervals = 'truncation-error-interval'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })
const show = (n: number) => String(Number(n.toPrecision(12)))
const tex = (value: string) => value.replaceAll(' ', '\\,')

/** The right answer is written first; this moves it to a different position on each question. */
let turn = 0
function choose(labels: string[]): InteractionDefinition {
  const at = (turn++ * 2 + 1) % labels.length
  const order = labels.slice(1)
  order.splice(at, 0, labels[0])
  return select(order, at)
}

const number = (answer: number, displayAnswer = show(answer)): InteractionDefinition => ({
  type: 'numericInput', correctAnswer: answer, displayAnswer, acceptanceRule: 'normalisedNumber',
})

/* ---------- Working models ---------- */

type Step = { title: string; math: string; say: string; values?: string[]; answer?: string; line?: IntervalFrame; sums?: WorkingLine[]; tag?: string }

function lines(question: string, ...list: Step[]): TutorWorking {
  const steps: MethodStep[] = list.map(step => ({
    title: step.title, operation: question, equation: step.math, instruction: step.say, tag: step.tag,
    frame: {
      sums: step.sums,
      interval: step.line,
      ordering: step.answer ? { answer: step.answer } : step.values ? { values: step.values } : undefined,
    },
  }))
  return { kind: 'method-worked', examples: [{ method: 'ordering', expression: question, label: 'Bounds', first: 0, second: 0, steps, pictureOnly: true }] }
}

type Ask = 'half' | 'lower' | 'upper' | 'interval'
type Test = { value: number; to: number; answer: string; why: string }
const nl = (min: number, max: number, tick: number, labels: number[], marks: NumberLinePicture['marks'] = [], span?: NumberLinePicture['span']): NumberLinePicture =>
  ({ kind: 'number-line', min, max, tick, labels, marks, ...(span ? { span } : {}) })

/**
 * A rounded value, the why first (src/features/EXPLANATIONS.md): the step size the question rounded to, the rounded
 * values either side, the halfway points between them (anything between rounds to the value), then the bound, the
 * shaded interval or a test of one value. The answer is written once, in green.
 */
type Rounded = { value: number; unit: number; target: string; letter: string; ask?: Ask; test?: Test }
function roundedBounds({ value, unit, target, letter, ask = 'interval', test }: Rounded): StepWorking {
  const n = (x: number) => Number(x.toPrecision(10))
  const v = show(value), u = show(unit), half = show(unit / 2), lo = show(n(value - unit)), hi = show(n(value + unit))
  const lower = show(n(value - unit / 2)), upper = show(n(value + unit / 2))
  const decimals = /decimal/.test(target)
  const scale = (marks: NumberLinePicture['marks'] = [], span?: NumberLinePicture['span'], labels = [value - unit, value, value + unit]) =>
    nl(n(value - 1.5 * unit), n(value + 1.5 * unit), unit / 2, labels.map(n), marks, span)
  const halfway = [{ value: n(value - unit / 2), label: lower, boxed: true }, { value: n(value + unit / 2), label: upper, boxed: true }]
  const steps: WorkedStep[] = [
    {
      title: 'Find the step size',
      why: decimals
        ? `${target[0].toUpperCase()}${target.slice(1)} means rounded to the nearest ${u}, so the rounded values go up in steps of ${u}.`
        : `${target} means the rounded values go up in steps of ${u}.`,
      picture: scale([{ value, label: '' }], undefined, [value]),
      lines: [line([part(decimals ? target : target.replace(/^The /, 'the '))], `steps of ${u}`)],
    },
    {
      title: 'Mark the neighbours',
      why: `The rounded values next to ${v} are ${lo} and ${hi}. The real value is somewhere near ${v}.`,
      picture: scale([{ value, label: '' }]),
      lines: [line([part(v), sign('−'), part(u, 1)], lo), line([part(v), sign('+'), part(u, 1)], hi)],
    },
    {
      title: 'Find the halfway points',
      why: `Anything between the halfway points is closer to ${v} than to ${lo} or ${hi}, so it rounds to ${v}. Each halfway point is half a step, ${half}, from ${v}.`,
      picture: scale([{ value, label: '' }, ...halfway]),
      lines: [line([part(lo), sign('…'), part(v)], lower, { mark: 'halfway' }), line([part(v), sign('…'), part(hi)], upper, { mark: 'halfway' })],
    },
  ]
  const shaded = scale([{ value, label: '' }, ...halfway.map(h => ({ ...h, boxed: false }))], { from: n(value - unit / 2), to: n(value + unit / 2) })
  const shade: WorkedStep = {
    title: 'Shade the interval',
    why: `${lower} rounds up to ${v}, so it is in: a filled dot. ${upper} rounds up to ${hi}, so it is not: an open dot.`,
    picture: shaded,
    lines: [line([part(lower)], v, { mark: 'in' }), line([part(upper)], hi, { mark: 'not in' })],
  }
  if (ask === 'half') steps.push({ title: 'Half a step', why: 'Half the unit is the gap from the value to a halfway point.', lines: [line([part(v), sign('−'), part(lower)], half, { answer: true })] })
  else if (ask === 'lower') steps.push({ title: 'Read the lower bound', why: `The lower bound is the halfway point below ${v}. It is the smallest value that rounds to ${v}.`, picture: shaded, lines: [line([part('Lower bound')], lower, { answer: true })] })
  else if (ask === 'upper') steps.push({ title: 'Read the upper bound', why: `The upper bound is the halfway point above ${v}. It is the edge of the interval: it rounds up to ${hi} itself.`, picture: shaded, lines: [line([part('Upper bound')], upper, { answer: true })] })
  else if (test) steps.push(shade, { title: `Test ${show(test.value)}`, why: test.why, picture: shaded, lines: [line([part(show(test.value), 0)], show(test.to))], words: test.answer })
  else steps.push(shade, { title: 'Write the interval', why: 'Use ≤ at the filled dot, because it is included, and < at the open dot, because it is not.', picture: shaded, words: `${lower} ≤ ${letter} < ${upper}` })
  return { kind: 'step-worked', start: `${letter} = ${v}, ${decimals ? `to ${target}` : target.replace(/^The /, 'to the ')}`, steps }
}

/**
 * A truncated value: the step size, the next value up, then everything from the value up to (not including) the next
 * one chops to the value. No halfway points: truncating never rounds up.
 */
type Truncated = { value: number; unit: number; letter: string; ask?: 'upper' | 'interval'; test?: Test }
function truncatedBounds({ value, unit, letter, ask = 'interval', test }: Truncated): StepWorking {
  const n = (x: number) => Number(x.toPrecision(10))
  const v = show(value), u = show(unit), hi = show(n(value + unit)), inside = show(n(value + 0.9 * unit))
  const places = u.split('.')[1]?.length ?? 0
  const target = `${places} decimal place${places === 1 ? '' : 's'}`
  const scale = (marks: NumberLinePicture['marks'] = [], span?: NumberLinePicture['span']) =>
    nl(n(value - unit / 2), n(value + 1.5 * unit), unit / 2, [value, n(value + unit)], marks, span)
  const shaded = scale([], { from: value, to: n(value + unit) })
  const steps: WorkedStep[] = [
    { title: 'Find the step size', why: `Truncated to ${target}, so the values go up in steps of ${u}.`, picture: nl(n(value - unit / 2), n(value + 1.5 * unit), unit / 2, [value], [{ value, label: '' }]), lines: [line([part(target)], `steps of ${u}`)] },
    { title: 'Mark the next value', why: `Truncating chops digits off and never rounds up, so ${v} is the smallest the value can be. The next value up is ${hi}.`, picture: scale([{ value, label: '' }, { value: n(value + unit), label: '' }]), lines: [line([part(v), sign('+'), part(u, 1)], hi)] },
    { title: 'Shade the interval', why: `Every value from ${v} up to just below ${hi} chops to ${v}. ${hi} itself chops to ${hi}, so it is not in.`, picture: shaded, lines: [line([part(inside)], v, { mark: 'in' }), line([part(hi)], hi, { mark: 'not in' })] },
  ]
  if (ask === 'upper') steps.push({ title: 'Read the upper bound', why: `The upper bound is ${hi}, the edge of the interval. The value gets close to it but never reaches it.`, picture: shaded, lines: [line([part('Upper bound')], hi, { answer: true })] })
  else if (test) steps.push({ title: `Test ${show(test.value)}`, why: test.why, picture: scale([{ value: test.value, label: show(test.value), boxed: true }], { from: value, to: n(value + unit) }), lines: [line([part(show(test.value), 0)], show(test.to))], words: test.answer })
  else steps.push({ title: 'Write the interval', why: 'Use ≤ at the filled dot, because it is included, and < at the open dot, because it is not.', picture: shaded, words: `${v} ≤ ${letter} < ${hi}` })
  return { kind: 'step-worked', start: `${letter} = ${v}, truncated to ${target}`, steps }
}

/** Truncating (chop) or rounding one number, using the shared kept-digit picture. */
type Cut = { original: string; kept: string; next: string; rest?: string; answer: string; places: number; mode: 'truncate' | 'round' }
function cut({ original, kept, next, rest = '', answer, places, mode }: Cut): TutorWorking {
  const chop = mode === 'truncate', up = !chop && Number(next) >= 5
  const frame = (stage: 'identify' | 'decide' | 'result') => ({
    original, target: `${places} decimal places`, kept, decisionDigit: next, remaining: rest, stage, roundsUp: up, chop, answer: stage === 'result' ? answer : undefined,
  })
  const place = places === 1 ? '1st' : places === 2 ? '2nd' : `${places}rd`
  const steps: MethodStep[] = [
    { title: 'Find the cut-off', operation: original, equation: `${kept}\\mid${next}${rest}`, instruction: `The cut-off comes straight after the ${place} decimal place.`, frame: { rounding: frame('identify') } },
    chop
      ? { title: 'Chop off the rest', operation: original, equation: `${original}\\to${answer}`, instruction: `Throw away everything after the cut-off. Don’t round the ${kept.slice(-1)} up.`, frame: { rounding: frame('result') } }
      : { title: 'Use the next digit', operation: original, equation: up ? `${next}\\geq5` : `${next}<5`, instruction: up ? 'The next digit is 5 or more, so round up.' : 'The next digit is less than 5, so keep the digit.', frame: { rounding: frame('result') } },
  ]
  return { kind: 'method-worked', examples: [{ method: 'rounding', expression: original, label: chop ? 'Truncate' : 'Round', first: 0, second: 0, steps, pictureOnly: true }] }
}

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking | StepWorking) {
  if (visual.kind === 'step-worked') return visual.steps.map(step => [step.title, step.why] as [string, string])
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}

function practice(
  topic: MicroSkillId,
  title: string,
  sourceRef: string,
  interaction: InteractionDefinition,
  answer: string,
  hint: string,
  model: TutorWorking | StepWorking,
  options: { unit?: string; bound?: BoundCheck; cut?: CutCheck } = {},
) {
  const state = add(topic, title, sourceRef, text(title), interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (options.unit) state.answerLabel = options.unit
  const { bound, cut: cutCheck } = options
  if (bound) state.diagnose = response => diagnoseBound(response, bound)
  if (cutCheck) state.diagnose = response => diagnoseCut(response, cutCheck)
  return state
}

function worked(topic: MicroSkillId, title: string, sourceRef: string, model: TutorWorking | StepWorking, body?: string) {
  return add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }

/* ---------- Rung 1: half the unit ---------- */

const boundsVideo = worked(halfUnit, 'A pencil is 8.4 cm long, correct to 1 decimal place. Write down the error interval for the length, l cm.', 'N13.1 Q1; video N13.1', roundedBounds(
  { value: 8.4, unit: 0.1, target: '1 decimal place', letter: 'l' },
), 'A rounded value can be out by up to half a unit either way.')
video(boundsVideo, {
  id: 'lesson13-upper-and-lower-bounds', src: '/media/lesson-13/upper-and-lower-bounds.mp4', poster: '/media/lesson-13/upper-and-lower-bounds.svg', title: 'Error interval for a pencil’s length', durationSeconds: 56, sourceFile: 'N13.1_Upper_and_Lower_Bounds.mp4',
  textAlternative: ['Lengths such as 8.37, 8.42 and 8.44 cm all round to 8.4 cm.', '1 decimal place means the unit is 0.1. Half of that is 0.05.', 'The lower bound is 8.4 − 0.05 = 8.35 and the upper bound is 8.4 + 0.05 = 8.45.', 'The error interval is 8.35 ≤ l < 8.45.'],
})
const halfPractice = (title: string, ref: string, unit: number, target: string, value: number, letter: string) => practice(halfUnit, title, ref, number(unit / 2), show(unit / 2), 'Find the unit, then halve it.', roundedBounds({ value, unit, target, letter, ask: 'half' }), { bound: { value, unit, side: 'half' } })
halfPractice('y = 6, to the nearest whole number. What is half the unit?', 'N13.1 Q2', 1, 'The nearest whole number', 6, 'y')
halfPractice('A jar holds 250 ml, to the nearest 10 ml. What is half the unit?', 'N13.1 Q3', 10, 'The nearest 10', 250, 'v')
halfPractice('A crowd was 2400, to the nearest 100. What is half the unit?', 'N13.1 Q4a', 100, 'The nearest 100', 2400, 'n')
halfPractice('A time is 12.34 s, correct to 2 decimal places. What is half the unit?', 'N13.1 Q5a', 0.01, '2 decimal places', 12.34, 't')
halfPractice('A dog weighs 70 kg, to the nearest 5 kg. What is half the unit?', 'N13 extra practice', 5, 'The nearest 5', 70, 'm')

/* ---------- Rung 2: lower and upper bounds ---------- */

const boundPractice = (title: string, ref: string, model: Rounded, side: 'lower' | 'upper', unitLabel?: string) => {
  const answer = side === 'lower' ? model.value - model.unit / 2 : model.value + model.unit / 2
  return practice(bounds, title, ref, number(Number(show(answer))), show(answer), side === 'lower' ? 'Take half the unit off.' : 'Add half the unit on.', roundedBounds({ ...model, ask: side }), { unit: unitLabel, bound: { value: model.value, unit: model.unit, side } })
}
boundPractice('y = 6 to the nearest whole number. Write down the lower bound of y.', 'N13.1 Q2', { value: 6, unit: 1, target: 'The nearest whole number', letter: 'y' }, 'lower')
boundPractice('A pencil is 8.4 cm, correct to 1 decimal place. Write down the upper bound.', 'N13.1 Q1', { value: 8.4, unit: 0.1, target: '1 decimal place', letter: 'l' }, 'upper', 'Length (cm)')
boundPractice('A jar holds 250 ml, to the nearest 10 ml. Write down the lower bound.', 'N13.1 Q3', { value: 250, unit: 10, target: 'The nearest 10', letter: 'v' }, 'lower', 'Volume (ml)')
boundPractice('A jar holds 250 ml, to the nearest 10 ml. Write down the upper bound.', 'N13.1 Q3', { value: 250, unit: 10, target: 'The nearest 10', letter: 'v' }, 'upper', 'Volume (ml)')
boundPractice('A crowd was 2400, to the nearest 100. Write down the lower bound.', 'N13.1 Q4a', { value: 2400, unit: 100, target: 'The nearest 100', letter: 'n' }, 'lower')
boundPractice('A sprinter’s time is 12.34 s, correct to 2 decimal places. Write down the lower bound.', 'N13.1 Q5a', { value: 12.34, unit: 0.01, target: '2 decimal places', letter: 't' }, 'lower', 'Time (s)')
boundPractice('A sprinter’s time is 12.34 s, correct to 2 decimal places. Write down the upper bound.', 'N13.1 Q5a', { value: 12.34, unit: 0.01, target: '2 decimal places', letter: 't' }, 'upper', 'Time (s)')
boundPractice('A dog weighs 70 kg, to the nearest 5 kg. Write down the lower bound.', 'N13 extra practice', { value: 70, unit: 5, target: 'The nearest 5', letter: 'm' }, 'lower', 'Mass (kg)')

/* ---------- Rung 3: the error interval ---------- */

practice(intervals, 'A jar holds 250 ml, to the nearest 10 ml. Which is the error interval for the volume, v ml?', 'N13.1 Q3', choose([
  '245 ≤ v < 255', '245 ≤ v ≤ 255', '240 ≤ v < 260', '245 < v ≤ 255',
]), '245 ≤ v < 255', 'Half of 10 is 5. The lower bound is included; the upper bound is not.', roundedBounds({ value: 250, unit: 10, target: 'The nearest 10', letter: 'v' }))
practice(intervals, 'A crowd was 2400, to the nearest 100. Which is the error interval for the crowd, n?', 'N13.1 Q4a', choose([
  '2350 ≤ n < 2450', '2350 ≤ n ≤ 2450', '2300 ≤ n < 2500', '2350 < n < 2450',
]), '2350 ≤ n < 2450', 'Half of 100 is 50.', roundedBounds({ value: 2400, unit: 100, target: 'The nearest 100', letter: 'n' }))
practice(intervals, 'A bag weighs 3.6 kg, correct to 1 decimal place. Which is the error interval for the mass, m kg?', 'N13 extra practice', choose([
  '3.55 ≤ m < 3.65', '3.5 ≤ m < 3.7', '3.55 ≤ m ≤ 3.65', '3.6 ≤ m < 3.7',
]), '3.55 ≤ m < 3.65', 'Half of 0.1 is 0.05.', roundedBounds({ value: 3.6, unit: 0.1, target: '1 decimal place', letter: 'm' }))
practice(intervals, 'A sprinter’s time is 12.34 s, correct to 2 decimal places. Which is the error interval for the time, t seconds?', 'N13.1 Q5a', choose([
  '12.335 ≤ t < 12.345', '12.33 ≤ t < 12.35', '12.335 ≤ t ≤ 12.345', '12.3 ≤ t < 12.4',
]), '12.335 ≤ t < 12.345', 'Half of 0.01 is 0.005.', roundedBounds({ value: 12.34, unit: 0.01, target: '2 decimal places', letter: 't' }))
practice(intervals, 'A crowd was 2400, to the nearest 100. Could there have been exactly 2450 people?', 'N13.1 Q4b', choose([
  'No, because 2450 would round to 2500',
  'Yes, because 2450 is the upper bound',
  'Yes, because 2450 is only 50 away from 2400',
]), 'No, because 2450 would round to 2500', 'Is the upper bound in the interval?', roundedBounds({ value: 2400, unit: 100, target: 'The nearest 100', letter: 'n', test: { value: 2450, to: 2500, answer: 'No, 2450 would round to 2500', why: '2450 is the open dot: it rounds up to 2500, not 2400.' } }))
practice(intervals, 'One runner took 12.34 s (to 2 d.p.). Another took 12.3 s (to 1 d.p.). Could they have run exactly the same time?', 'N13.1 Q5b', choose([
  'Yes, because a time such as 12.34 s fits in both intervals',
  'No, because 12.34 and 12.3 are different numbers',
  'No, because the two intervals don’t overlap',
]), 'Yes, because 12.34 fits in both intervals', 'Find the error interval for 12.3 s, then look for a time that fits in both.', { kind: 'step-worked', start: 't = 12.34 (to 2 d.p.) and t = 12.3 (to 1 d.p.)', steps: [
  { title: 'Second runner’s interval', why: 'Rounded to 1 decimal place, so the halfway points are half a step, 0.05, either side of 12.3.', picture: nl(12.15, 12.45, 0.05, [12.2, 12.3, 12.4], [{ value: 12.25, label: '12.25' }, { value: 12.35, label: '12.35' }], { from: 12.25, to: 12.35 }), lines: [line([part('12.25')], '12.3', { mark: 'in' }), line([part('12.35')], '12.4', { mark: 'not in' })] },
  { title: 'Look for both', why: '12.34 is inside this shaded interval, and it is also the first runner’s time. So both runners could have run 12.34 s.', picture: nl(12.15, 12.45, 0.05, [12.2, 12.3, 12.4], [{ value: 12.34, label: '12.34', boxed: true }], { from: 12.25, to: 12.35 }), lines: [line([part('12.34', 0)], '12.3', { mark: 'to 1 d.p.' })], words: 'Yes, 12.34 fits in both intervals' },
] } satisfies StepWorking)
practice(intervals, 'Lina says 12.345 s could be the sprinter’s exact time, because it is the upper bound of 12.34 s (to 2 d.p.). Is Lina correct?', 'N13.1 Q5c', choose([
  'No, because 12.345 would round to 12.35, not 12.34',
  'Yes, because the upper bound is part of the interval',
  'Yes, because 12.345 is between 12.34 and 12.35',
]), 'No, 12.345 would round to 12.35', 'Check what 12.345 rounds to.', roundedBounds({ value: 12.34, unit: 0.01, target: '2 decimal places', letter: 't', test: { value: 12.345, to: 12.35, answer: 'No, 12.345 would round to 12.35', why: '12.345 is the open dot, the upper bound. It rounds up to 12.35, so it is not in the interval.' } }))

/* ---------- Rung 4: truncate ---------- */

const truncationVideo = worked(truncate, 'Truncate 7.396 to 2 decimal places.', 'N13.2 Q1; video N13.2', cut(
  { original: '7.396', kept: '7.39', next: '6', answer: '7.39', places: 2, mode: 'truncate' },
), 'Truncating chops off everything after the cut-off. It never rounds up.')
video(truncationVideo, {
  id: 'lesson13-truncation', src: '/media/lesson-13/truncation.mp4', poster: '/media/lesson-13/truncation.svg', title: 'Truncating 7.396 to 2 decimal places', durationSeconds: 55, sourceFile: 'N13.2_Truncation.mp4',
  textAlternative: ['Truncate 7.396 to 2 decimal places.', 'The cut-off point comes straight after the 2nd decimal place, after the 9.', 'Chop off the 6. Do not round the 9 up.', '7.396 truncated to 2 decimal places is 7.39.'],
})
practice(truncate, 'Truncate 15.87 to 1 decimal place.', 'N13.2 Q2', number(15.8), '15.8', 'The cut-off comes after the 8. Chop off what is left.', cut(
  { original: '15.87', kept: '15.8', next: '7', answer: '15.8', places: 1, mode: 'truncate' },
), { cut: { original: 15.87, places: 1, mode: 'truncate' } })
practice(truncate, 'Amir truncates 5.678 to 2 decimal places. What does he get?', 'N13.2 Q4a', number(5.67), '5.67', 'Chop after the 2nd decimal place.', cut(
  { original: '5.678', kept: '5.67', next: '8', answer: '5.67', places: 2, mode: 'truncate' },
), { cut: { original: 5.678, places: 2, mode: 'truncate' } })
practice(truncate, 'Beth rounds 5.678 to 2 decimal places. What does she get?', 'N13.2 Q4a', number(5.68), '5.68', 'Rounding uses the next digit to decide.', cut(
  { original: '5.678', kept: '5.67', next: '8', answer: '5.68', places: 2, mode: 'round' },
), { cut: { original: 5.678, places: 2, mode: 'round' } })
practice(truncate, 'Why did Amir (truncating) and Beth (rounding) get different answers for 5.678?', 'N13.2 Q4b', choose([
  'Truncating chops the 8 off; rounding uses the 8 to round the 7 up',
  'Beth made a mistake, because rounding and truncating always give the same answer',
  'Amir kept too many decimal places',
]), 'Truncating chops the 8 off; rounding uses the 8 to round the 7 up', 'Look at the digit after the cut-off.', lines('5.678',
  { title: 'Look past the cut-off', math: '5.67\\mid8', say: 'The digit after the cut-off is an 8.', values: ['Truncating: ignore the 8 → 5.67', 'Rounding: 8 ≥ 5, round up → 5.68'] },
  { title: 'Explain', math: '5.67\\ne5.68', say: 'Truncating throws the 8 away. Rounding uses it to round the 7 up.', answer: 'Truncating chops the 8 off; rounding uses it to round up' },
))
practice(truncate, 'Truncate 3.14159 to 3 decimal places.', 'N13 extra practice', number(3.141), '3.141', 'Keep three decimal places. Chop off the rest.', cut(
  { original: '3.14159', kept: '3.141', next: '5', rest: '9', answer: '3.141', places: 3, mode: 'truncate' },
), { cut: { original: 3.14159, places: 3, mode: 'truncate' } })
practice(truncate, 'Truncate 9.99 to 1 decimal place.', 'N13 extra practice', number(9.9), '9.9', 'Chop after the 1st decimal place. Don’t round up to 10.', cut(
  { original: '9.99', kept: '9.9', next: '9', answer: '9.9', places: 1, mode: 'truncate' },
), { cut: { original: 9.99, places: 1, mode: 'truncate' } })

/* ---------- Rung 5: truncation error intervals ---------- */

worked(truncatedIntervals, 'A bag has a mass of 3.7 kg, truncated to 1 decimal place. Write down the error interval for the mass, m kg.', 'N13.2 Q3', truncatedBounds(
  { value: 3.7, unit: 0.1, letter: 'm' },
))
practice(truncatedIntervals, 'A pipe is 2.35 m long, truncated to 2 decimal places. Which is the error interval for the length, l m?', 'N13.2 Q5a', choose([
  '2.35 ≤ l < 2.36', '2.345 ≤ l < 2.355', '2.34 ≤ l < 2.35', '2.35 ≤ l ≤ 2.36',
]), '2.35 ≤ l < 2.36', 'Truncating never rounds up, so 2.35 is the smallest the length can be.', truncatedBounds({ value: 2.35, unit: 0.01, letter: 'l' }))
practice(truncatedIntervals, 'A pipe is 2.35 m long, truncated to 2 decimal places. Write down the upper bound.', 'N13.2 Q5a', number(2.36), '2.36', 'Add one whole unit, 0.01.', truncatedBounds({ value: 2.35, unit: 0.01, letter: 'l', ask: 'upper' }), { unit: 'Length (m)', bound: { value: 2.35, unit: 0.01, side: 'upper', truncated: true } })
practice(truncatedIntervals, 'A time is 14.2 s, truncated to 1 decimal place. Which is the error interval for the time, t seconds?', 'N13 extra practice', choose([
  '14.2 ≤ t < 14.3', '14.15 ≤ t < 14.25', '14.1 ≤ t < 14.2', '14.2 < t ≤ 14.3',
]), '14.2 ≤ t < 14.3', 'Truncated: start at 14.2 and add one whole unit.', truncatedBounds({ value: 14.2, unit: 0.1, letter: 't' }))
practice(truncatedIntervals, 'A pipe is 2.35 m long, truncated to 2 decimal places. Could it be exactly 2.359 m long?', 'N13.2 Q5b', choose([
  'Yes, because 2.359 is in the interval and truncates to 2.35',
  'No, because 2.359 rounds to 2.36',
  'No, because 2.359 is bigger than 2.35',
]), 'Yes, 2.359 is in the interval and truncates to 2.35', 'Check whether 2.359 is inside 2.35 ≤ l < 2.36.', truncatedBounds({ value: 2.35, unit: 0.01, letter: 'l', test: { value: 2.359, to: 2.35, answer: 'Yes, 2.359 truncates to 2.35', why: '2.359 is inside the shaded interval. Chopping after the 2nd decimal place gives 2.35.' } }))
practice(truncatedIntervals, 'Zara says the error interval for 2.35 m, truncated to 2 d.p., is 2.345 ≤ l < 2.355, because you go half a unit either side. Is Zara correct?', 'N13.2 Q5c', choose([
  'No. 2.347 is in her interval, but it truncates to 2.34, not 2.35',
  'Yes. You always go half a unit either side',
  'No. It should be 2.35 ≤ l ≤ 2.36',
]), 'No. 2.347 is in her interval but truncates to 2.34', 'Half a unit either side is for rounding. Test a value from Zara’s interval.', { kind: 'step-worked', start: 'Zara: 2.345 ≤ l < 2.355', steps: [
  { title: 'Zara’s interval', why: 'Zara went half a step either side of 2.35. That is the rule for rounding, not truncating.', picture: nl(2.335, 2.365, 0.005, [2.34, 2.35, 2.36], [{ value: 2.345, label: '2.345' }, { value: 2.355, label: '2.355' }], { from: 2.345, to: 2.355 }), lines: [line([part('2.35'), sign('−'), part('0.005', 1)], '2.345'), line([part('2.35'), sign('+'), part('0.005', 1)], '2.355')] },
  { title: 'Test a value', why: '2.347 is inside Zara’s interval, but truncating chops it to 2.34, not 2.35. So her interval is wrong.', picture: nl(2.335, 2.365, 0.005, [2.34, 2.35, 2.36], [{ value: 2.347, label: '2.347', boxed: true }], { from: 2.345, to: 2.355 }), lines: [line([part('2.347', 0)], '2.34', { mark: 'truncated' })], words: 'No, 2.347 truncates to 2.34' },
] } satisfies StepWorking)

add('mixed', 'Bounds and truncation', 'N13.1-N13.2 consolidation', text(
  'Rounded: go half a unit down and half a unit up.',
  'Truncated: the value itself is the lower bound. Add one whole unit for the upper bound.',
  'Write the error interval with ≤ at the lower bound and < at the upper bound.',
  'Truncating chops digits off. It never rounds up.',
))

export const tutorBoundsLesson: TutorMethodLesson = {
  id: 'L013', number: 13, title: 'Bounds and truncation', level: 'GCSE Foundation',
  goal: 'Find upper and lower bounds, write error intervals for rounded and truncated values, and truncate numbers.',
  labels: {
    [halfUnit]: 'Half the unit', [bounds]: 'Lower and upper bounds', [intervals]: 'Write the error interval',
    [truncate]: 'Truncate', [truncatedIntervals]: 'Truncation intervals', mixed: 'Review',
  },
  states: finish(),
}

import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { RatioFrame } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorMethodVisual, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, number, pair, readNumbers, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'
import { pillWidth } from '../../written-methods/tutor/RatioPictures'

/*
 * Lesson 31 (Ratio R2): Direct and inverse proportion, from Aniksha's R2.1–R2.2 PDFs and videos. Two rungs in the
 * PDFs' order. Each working draws the question's rows above the A5 board with the R1 ratio bars (RatioPictures.tsx),
 * like the rows of people in the videos: one block per person (or litre, or minute), the amount in a pill after the
 * row. The rows the working will reach, such as "1 person", are on screen from the start but faint, so the picture keeps
 * its size; the row being worked from is ringed in purple as the board writes its sum.
 */

const { add, finish } = author(31)
const direct = 'proportion-direct'
const inverse = 'proportion-inverse'

/* ---------- Rows ---------- */

/** One row per count: its name, how many blocks, and its amount (or ? for the one we want). */
const rows = (...list: [string, number, string?][]): RatioFrame => ({ bars: list.map(([name, parts, tag]) => ({ name, parts, ...(tag ? { tag } : {}) })) })
/** A move on the board, with what it changes on the rows. Rings, the note and purple pills are only on the step that sets them. */
type RowMove = BoardMove & { ratio?: Partial<RatioFrame>; tags?: (string | undefined)[] }

/** The board working with the rows drawn above it: `start` is the question's own rows, on the opening screen. */
function rowModel(start: RatioFrame, moves: RowMove[], label = 'Work it out'): TutorWorking {
  const model = boardModel([], moves, label)
  if (model.kind !== 'method-worked') throw new Error('A proportion working is a board')
  let current: RatioFrame = start
  const frames = moves.map(({ ratio, tags }) => {
    current = { ...current, rings: undefined, note: undefined, lit: undefined, ...ratio }
    if (tags) current = { ...current, bars: current.bars.map((bar, k) => tags[k] === undefined ? bar : { ...bar, tag: tags[k] }) }
    return current
  })
  // Every step keeps room for the widest pill any step shows, so the rows never move or shrink.
  const room = Math.max(0, ...[start, ...frames].flatMap(frame => frame.bars.map(bar => bar.tag ? pillWidth(bar.tag) : 0)))
  model.examples[0].steps.forEach((step, i) => {
    step.frame.ratio = { ...frames[i], room, ...(i === 0 ? { before: { ...start, room } } : {}) }
  })
  return model
}
const whole = (bar: number, parts: number) => ({ bar, from: 0, to: parts })
/** A row split into lots of `size`, each ringed: 15 pens as 3 lots of 5. */
const lots = (bar: number, parts: number, size: number) => Array.from({ length: parts / size }, (_, k) => ({ bar, from: k * size, to: (k + 1) * size }))

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
/** A question: its own rows above the answer (or its words, when the rows would be too thin), and the working once answered. */
function practice(topic: MicroSkillId, title: string, sourceRef: string, shown: RatioFrame | null, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  // The question's rows are the working's opening rows, at the same size.
  const opening = model.kind === 'method-worked' ? model.examples[0].steps[0]?.frame.ratio?.before : undefined
  const visual: TutorMethodVisual = shown ? { kind: 'ratio', ratio: opening ?? shown } : text(title)
  const state = add(topic, title, sourceRef, visual, interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  return state
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  // The rows are drawn above the board, so the heading is only the question.
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, durationSeconds: number, textAlternative: string[]) => ({
  id: `lesson31-${name}`, src: `/media/lesson-31/${name}.mp4`, poster: `/media/lesson-31/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response, right, list)
const pounds = (state: TutorMethodState) => { state.answerPrefix = '£'; return state }

/* ---------- Rung 1: direct proportion (R2.1) ---------- */

const party = rows(['4 people', 4, '12 slices'], ['1 person', 1], ['7 people', 7, '?'])
const pizza = worked(direct, 'At a party, 4 people eat 12 slices of pizza. The number of slices is directly proportional to the number of people. How many slices are needed for 7 people?', '4 people eat 12 slices. How many slices for 7 people?', 'R2.1 video + Q1', rowModel({ ...party, dim: [1] }, [
  { title: 'Find 1 person first', say: '4 people share the 12 slices. Share 12 between the 4 people to find what 1 person needs.', rows: ['12 total ÷ 4 = 3 each'], tags: [undefined, '3 slices'], ratio: { dim: [], rings: [whole(0, 4)], lit: [1], note: '1 person needs 3 slices' } },
  { title: 'Now 7 people', say: '7 people need 7 lots of 3 slices.', rows: ['7 × 3 each = 21 total', '! 21 slices'], tags: [undefined, undefined, '21 slices'], ratio: { rings: [whole(2, 7)], lit: [2] } },
]), 'Our aim: divide to find what 1 needs, then multiply for as many as you want.')
video(pizza, media('direct', '4 people eat 12 slices: how many for 7?', 'R2.1_Direct_Proportion.mp4', 100, [
  'Pizzas for a party: 4 people need 12 slices. How many slices do 7 people need?',
  'What is direct proportion? 4 people need 12 slices. More people means more slices: that is direct proportion. When one goes up, the other goes up at the same rate: double the people, double the slices. We want the slices for 7 people.',
  'See it with people: 4 people share 12 slices, so 1 person gets 12 ÷ 4 = 3 slices. 7 people need 7 × 3 = 21 slices.',
  'Find 1 first: the trick is to find what 1 person needs first. 4 people need 12, so share the 12 between 4: 12 ÷ 4 = 3. 1 person needs 3 slices.',
  'Now 7 people: now we know 1 person, we can find any number of people. 7 people need 7 lots of 3 slices: 7 × 3 = 21. 7 people need 21 slices.',
  'Check it makes sense: 7 is more than 4, so 21 should be more than 12. The rule: divide to find 1, multiply to find many. This is called the unitary method (unit means 1). The same idea works for recipes, prices, petrol and paint.',
  'Where you see it: at a party 4 people eat 12 slices of pizza. For 7 people, order 21 slices: 12 ÷ 4 = 3 and 7 × 3 = 21.',
  'Divide to find 1. Multiply to find many. More of one means more of the other.',
]))
const pens = rows(['5 pens', 5, '£3'], ['15 pens', 15, '?'])
pounds(practice(direct, '5 pens cost £3. Work out the cost of 15 pens.', 'R2.1 Q2', pens, number(9, '£9'), '15 pens is 3 lots of 5 pens.', rowModel(pens, [
  { title: 'Lots of 5 pens', say: '15 pens is 3 lots of 5 pens.', rows: ['15 ÷ 5 = 3'], ratio: { rings: lots(1, 15, 5), note: '3 lots of 5 pens' } },
  { title: 'The cost', say: 'Each lot of 5 pens costs £3.', rows: ['3 × 3 each = 9 total', '! £9'], tags: [undefined, '£9'], ratio: { lit: [1] } },
]), slips(9, [[45, '£3 is for 5 pens, not 1 pen. 15 pens is 3 lots of 5.'], [3, 'That’s how many lots of 5 pens. Each lot costs £3.'], [0.6, 'That’s 1 pen. Multiply by 15.']])))
practice(direct, 'A recipe uses 300 g of flour to make 12 biscuits. Work out how much flour is needed to make 20 biscuits.', 'R2.1 Q3', null, number(500, '500 g'), 'Find the flour for 1 biscuit first: share 300 g between 12.', boardModel([], [
  { title: 'Flour for 1 biscuit', say: 'Share the 300 g between the 12 biscuits.', rows: ['300 total ÷ 12 = 25 each'] },
  { title: 'Now 20 biscuits', say: '20 biscuits need 20 lots of 25 g.', rows: ['20 × 25 each = 500 total', '! 500 g'] },
]), slips(500, [[25, 'That’s 1 biscuit. Multiply by 20.'], [308, 'Divide and multiply, don’t add: find 1 biscuit first, 300 ÷ 12.'], [6000, '300 g makes 12 biscuits, not 1. Find 1 biscuit first: 300 ÷ 12.']]))
const car = rows(['6 litres', 6, '84 miles'], ['1 litre', 1], ['10 litres', 10, '?'])
practice(direct, 'A car uses 6 litres of petrol to travel 84 miles. How far can the car travel on 10 litres of petrol?', 'R2.1 Q4a', car, number(140, '140 miles'), 'Find the miles for 1 litre first: share 84 between 6.', rowModel({ ...car, dim: [1] }, [
  { title: 'Miles for 1 litre', say: 'Share the 84 miles between the 6 litres.', rows: ['84 total ÷ 6 = 14 each'], tags: [undefined, '14 miles'], ratio: { dim: [], rings: [whole(0, 6)], lit: [1], note: '1 litre goes 14 miles' } },
  { title: 'Now 10 litres', say: '10 litres go 10 lots of 14 miles.', rows: ['10 × 14 each = 140 total', '! 140 miles'], tags: [undefined, undefined, '140 miles'], ratio: { rings: [whole(2, 10)], lit: [2] } },
]), slips(140, [[14, 'That’s 1 litre. Multiply by 10.'], [88, 'Multiply, don’t add: find 1 litre first, then × 10.'], [840, '84 miles is for 6 litres, not 1. Find 1 litre first: 84 ÷ 6.']]))
practice(direct, 'The same car travels 14 miles on 1 litre of petrol. How many litres of petrol does it need to travel 217 miles?', 'R2.1 Q4b', null, number(15.5, '15.5 litres'), 'Every 14 miles uses 1 litre. How many lots of 14 are in 217?', boardModel([], [
  { title: 'Lots of 14 miles', say: 'Each litre goes 14 miles, so divide the miles by 14. 14 × 15 = 210, and the 7 miles left are half of 14.', rows: ['217 total ÷ 14 each = 15.5', '! 15.5 litres'] },
]), slips(15.5, [[15, '217 ÷ 14 is 15.5: 14 × 15 = 210, and the 7 miles left are half a litre.'], [3038, 'Divide, don’t multiply: 217 ÷ 14.'], [16, 'Don’t round: 217 ÷ 14 is exactly 15.5.']]))
const printer = rows(['3 minutes', 3, '45 pages'], ['1 minute', 1], ['8 minutes', 8, '?'])
practice(direct, 'A printer prints 45 pages in 3 minutes. How many pages does it print in 8 minutes?', 'R2.1 Q5a', printer, number(120, '120 pages'), 'Find the pages in 1 minute first: share 45 between 3.', rowModel({ ...printer, dim: [1] }, [
  { title: 'Pages in 1 minute', say: 'Share the 45 pages between the 3 minutes.', rows: ['45 total ÷ 3 = 15 each'], tags: [undefined, '15 pages'], ratio: { dim: [], rings: [whole(0, 3)], lit: [1], note: '1 minute prints 15 pages' } },
  { title: 'Now 8 minutes', say: '8 minutes print 8 lots of 15 pages.', rows: ['8 × 15 each = 120 total', '! 120 pages'], tags: [undefined, undefined, '120 pages'], ratio: { rings: [whole(2, 8)], lit: [2] } },
]), slips(120, [[15, 'That’s 1 minute. Multiply by 8.'], [50, 'Multiply, don’t add: find 1 minute first, then × 8.'], [360, '45 pages take 3 minutes, not 1. Find 1 minute first: 45 ÷ 3.']]))
/** Minutes and seconds typed in two boxes, with the slips of a decimal minute. */
function timeSlips(response: string) {
  const [minutes, seconds] = readNumbers(response)
  if (minutes === undefined || seconds === undefined || (minutes === 13 && seconds === 20)) return null
  if (minutes === 13 && seconds === 33) return '13.33 minutes isn’t 13 minutes 33 seconds. The 5 pages left are 5 ÷ 15 of a minute, and that is 20 seconds.'
  if (minutes === 13 && seconds === 5) return 'There are 5 pages left, not 5 seconds. 5 pages take 5 ÷ 15 of a minute: 20 seconds.'
  if (minutes === 13) return 'The 5 pages left take 5 ÷ 15 of a minute. A minute is 60 seconds: 60 ÷ 3 = 20.'
  return null
}
practice(direct, 'The printer prints 15 pages a minute. A report has 200 pages. How long does it take to print? Give your answer in minutes and seconds.', 'R2.1 Q5b', null, pair(['minutes', 'seconds'], [13, 20], '13 minutes 20 seconds'), 'How many whole lots of 15 pages fit into 200? Then work out the pages left in seconds.', boardModel([], [
  { title: 'Whole minutes', say: 'Each minute prints 15 pages. 13 lots of 15 is 195, so 13 whole minutes leave 5 pages.', rows: ['13 × 15 each = 195', '200 − 195 = 5'] },
  { title: 'The 5 pages left', say: '5 pages are 5 ÷ 15, a third, of a minute. A minute is 60 seconds, so that is 20 seconds.', rows: ['5 ÷ 15 × 60 = 20', '! 13 min 20 s'] },
]), timeSlips)
const maya = rows(['3 minutes', 3, '45 pages'], ['6 minutes', 6, '?'])
practice(direct, 'A printer prints 45 pages in 3 minutes. Maya says, “3 minutes gives 45 pages, so 6 minutes gives 45 + 3 = 48 pages.” Why is Maya wrong?', 'R2.1 Q5c', maya, choose(
  'Double the time doubles the pages: 6 minutes gives 90 pages',
  ['She should add 6, not 3: 51 pages', 'Adding never works here. 6 minutes is double 3 minutes, so double the pages: 2 × 45 = 90.'],
  ['She is right: 48 pages', '3 more minutes prints far more than 3 more pages. Double the time, double the pages: 90.'],
  ['Double the time halves the pages: 22.5 pages', 'That’s inverse proportion. More time prints more pages, so double them: 90.'],
), 'Direct proportion: you multiply, you don’t add. How many lots of 3 minutes are in 6 minutes?', rowModel(maya, [
  { title: 'Lots of 3 minutes', say: '6 minutes is 2 lots of 3 minutes.', rows: ['6 ÷ 3 = 2'], ratio: { rings: lots(1, 6, 3), note: 'double the time' } },
  { title: 'Double the pages', say: 'Each 3 minutes prints 45 pages. You multiply, you don’t add.', rows: ['2 × 45 each = 90 total', '! 90 pages, not 48'], tags: [undefined, '90 pages'], ratio: { lit: [1] } },
], 'Why'))

/* ---------- Rung 2: inverse proportion (R2.2) ---------- */

const fence = rows(['4 painters', 4, '9 hours'], ['1 painter', 1], ['6 painters', 6, '?'])
const painters = worked(inverse, '4 painters take 9 hours to paint a fence. The time taken is inversely proportional to the number of painters. How long would 6 painters take?', '4 painters take 9 hours. How long for 6 painters?', 'R2.2 video + Q1', rowModel({ ...fence, dim: [1] }, [
  { title: 'Find 1 painter first', say: 'One painter does all the work alone, so it takes 4 times longer. Multiply.', rows: ['4 × 9 each = 36 total'], tags: [undefined, '36 hours'], ratio: { dim: [], rings: [whole(0, 4)], lit: [1], note: '1 painter alone: 4 times longer' } },
  { title: 'Now 6 painters', say: '6 painters share the 36 hours of work, so divide by 6.', rows: ['36 total ÷ 6 = 6 each', '! 6 hours'], tags: [undefined, undefined, '6 hours'], ratio: { rings: [whole(2, 6)], lit: [2] } },
]), 'Our aim: multiply to find how long 1 takes, then divide to share the work.')
video(painters, media('inverse', '4 painters take 9 hours: how long for 6?', 'R2.2_Inverse_Proportion.mp4', 100, [
  'Painting a fence: 4 painters take 9 hours. How long do 6 painters take?',
  'What is inverse proportion? 4 painters take 9 hours. More painters means less time: that is inverse proportion. When one goes up, the other goes down: double the painters, half the time. We want the time for 6 painters.',
  'See it with painters: 4 painters take 9 hours, so 1 painter alone takes 4 × 9 = 36 hours. 6 painters take 36 ÷ 6 = 6 hours.',
  'Find 1 painter first: the trick is to find how long 1 painter takes. 1 painter does all the work alone, so it takes 4 times longer: 4 × 9 = 36. 1 painter takes 36 hours.',
  'Now 6 painters: 6 painters share the 36 hours of work. 36 ÷ 6 = 6, so 6 painters take 6 hours.',
  'Check it makes sense: 6 painters is more than 4, so 6 hours should be less than 9. The rule: multiply to find 1, divide to find many. It is the opposite of direct proportion. Check: 4 × 9 = 36 and 6 × 6 = 36, the same total work.',
  'Where you see it: 4 painters take 9 hours to paint a fence. 6 painters finish the same fence in 6 hours: 4 × 9 = 36 and 36 ÷ 6 = 6.',
  'Multiply to find 1. Divide to find many. More of one means less of the other.',
]))
const garden = rows(['2 people', 2, '6 hours'], ['4 people', 4, '?'])
practice(inverse, 'It takes 2 people 6 hours to clear a garden. How long would it take 4 people?', 'R2.2 Q2', garden, number(3, '3 hours'), 'More people means less time. 4 people is double 2 people.', rowModel(garden, [
  { title: 'Double the people', say: '4 people is 2 lots of 2 people: double the people.', rows: ['4 ÷ 2 = 2'], ratio: { rings: lots(1, 4, 2), note: 'double the people' } },
  { title: 'Half the time', say: 'Twice as many people share the work, so it takes half the time.', rows: ['6 ÷ 2 = 3', '! 3 hours'], tags: [undefined, '3 hours'], ratio: { lit: [1] } },
]), slips(3, [[12, 'More people means less time, not more. Double the people, half the time.'], [8, 'More people means less time. Double the people, so halve the 6 hours.'], [4, 'Take away doesn’t work here. Double the people, half the time: 6 ÷ 2.']]))
const tank = rows(['6 campers', 6, '5 days'], ['1 camper', 1], ['10 campers', 10, '?'])
practice(inverse, 'A tank of water lasts 5 days when 6 campers use it. How many days would the same tank last 10 campers?', 'R2.2 Q3', tank, number(3, '3 days'), 'Find how long the tank lasts 1 camper first: 1 camper uses less, so it lasts 6 times longer.', rowModel({ ...tank, dim: [1] }, [
  { title: 'Days for 1 camper', say: 'One camper uses less, so the water lasts 6 times longer. Multiply.', rows: ['6 × 5 each = 30 total'], tags: [undefined, '30 days'], ratio: { dim: [], rings: [whole(0, 6)], lit: [1], note: '1 camper: 6 times longer' } },
  { title: 'Now 10 campers', say: '10 campers use the water 10 times faster, so divide by 10.', rows: ['30 total ÷ 10 = 3 each', '! 3 days'], tags: [undefined, undefined, '3 days'], ratio: { rings: [whole(2, 10)], lit: [2] } },
]), slips(3, [[30, 'That’s 1 camper. 10 campers use it 10 times faster: divide by 10.'], [50 / 6, 'That’s direct proportion. More campers use the water faster, so it lasts less time.'], [50, 'More campers make the water run out sooner, not later. Find 1 camper first: 6 × 5.']]))
const bread = rows(['3 bakers', 3, '8 hours'], ['1 baker', 1], ['4 bakers', 4, '?'])
practice(inverse, 'It takes 3 bakers 8 hours to make the bread for a wedding. How long would it take 4 bakers?', 'R2.2 Q4a', bread, number(6, '6 hours'), 'Find the time for 1 baker first: 1 baker takes 3 times longer.', rowModel({ ...bread, dim: [1] }, [
  { title: 'Time for 1 baker', say: 'One baker does all the work alone, so it takes 3 times longer. Multiply.', rows: ['3 × 8 each = 24 total'], tags: [undefined, '24 hours'], ratio: { dim: [], rings: [whole(0, 3)], lit: [1], note: '1 baker alone: 3 times longer' } },
  { title: 'Now 4 bakers', say: '4 bakers share the 24 hours of work, so divide by 4.', rows: ['24 total ÷ 4 = 6 each', '! 6 hours'], tags: [undefined, undefined, '6 hours'], ratio: { rings: [whole(2, 4)], lit: [2] } },
]), slips(6, [[24, 'That’s 1 baker. 4 bakers share the work: divide by 4.'], [32 / 3, 'That’s direct proportion. More bakers means less time.'], [32, 'More bakers finish sooner, not later. Find 1 baker first: 3 × 8.']]))
practice(inverse, 'The bread takes 1 baker 24 hours. It must be ready in 2 hours. How many bakers are needed?', 'R2.2 Q4b', null, number(12, '12 bakers'), '1 baker takes 24 hours. How many bakers share it so each works only 2 hours?', boardModel([], [
  { title: 'Divide by the time allowed', say: '1 baker takes 24 hours. Share those 24 hours into 2-hour jobs, one for each baker.', rows: ['24 total ÷ 2 each = 12', '! 12 bakers'] },
]), slips(12, [[48, 'Less time needs more bakers, but divide: 24 ÷ 2.'], [1 / 12, 'Divide the other way: 24 hours ÷ 2 hours.'], [6, 'Use 1 baker’s 24 hours, not 4 bakers’ time: 24 ÷ 2.']]))
const gate = rows(['8 stewards', 8, '45 min'], ['1 steward', 1], ['12 stewards', 12, '?'])
practice(inverse, 'At a festival, 8 stewards take 45 minutes to check all the tickets at a gate. How long would it take 12 stewards?', 'R2.2 Q5a', gate, number(30, '30 minutes'), 'Find the time for 1 steward first: 1 steward takes 8 times longer.', rowModel({ ...gate, dim: [1] }, [
  { title: 'Time for 1 steward', say: 'One steward checks every ticket alone, so it takes 8 times longer. Multiply.', rows: ['8 × 45 each = 360 total'], tags: [undefined, '360 min'], ratio: { dim: [], rings: [whole(0, 8)], lit: [1], note: '1 steward: 8 times longer' } },
  { title: 'Now 12 stewards', say: '12 stewards share the 360 minutes of work, so divide by 12.', rows: ['360 total ÷ 12 = 30 each', '! 30 minutes'], tags: [undefined, undefined, '30 min'], ratio: { rings: [whole(2, 12)], lit: [2] } },
]), slips(30, [[360, 'That’s 1 steward. 12 stewards share the work: divide by 12.'], [67.5, 'That’s direct proportion. More stewards means less time.'], [540, 'More stewards finish sooner, not later. Find 1 steward first: 8 × 45.']]))
practice(inverse, 'The tickets take 1 steward 360 minutes to check. The gate must be cleared in 20 minutes. How many stewards are needed?', 'R2.2 Q5b', null, number(18, '18 stewards'), '1 steward takes 360 minutes. Divide by the 20 minutes allowed.', boardModel([], [
  { title: 'Divide by the time allowed', say: '1 steward takes 360 minutes. Share them into 20-minute jobs, one for each steward.', rows: ['360 total ÷ 20 each = 18', '! 18 stewards'] },
]), slips(18, [[7200, 'Less time needs more stewards, but divide: 360 ÷ 20.'], [1 / 18, 'Divide the other way: 360 minutes ÷ 20 minutes.'], [16, '360 ÷ 20 is 18: 20 × 18 = 360.']]))
practice(inverse, 'At a festival, 8 stewards take 45 minutes to check the tickets. Leo says, “8 stewards take 45 minutes, so 16 stewards will take 90 minutes.” Why is Leo wrong?', 'R2.2 Q5c', null, choose(
  'More stewards means less time: 16 stewards take 22.5 minutes',
  ['Leo is right: 90 minutes', 'More stewards share the work, so they finish sooner. Double the stewards, half the time: 45 ÷ 2 = 22.5.'],
  ['16 stewards take 45 + 8 = 53 minutes', 'More stewards means less time, never more. Double the stewards, half the time: 22.5 minutes.'],
  ['16 stewards take 45 − 8 = 37 minutes', 'Taking away doesn’t work here. Double the stewards, half the time: 45 ÷ 2 = 22.5.'],
), 'This is inverse proportion. Is 16 stewards more or fewer than 8?', boardModel([], [
  { title: 'Compare the stewards', say: '16 stewards is double 8 stewards.', rows: ['16 ÷ 8 = 2'] },
  { title: 'Half the time', say: 'More stewards means less time, not more. Double the stewards, half the time.', rows: ['45 ÷ 2 = 22.5', '! 22.5 minutes, not 90'] },
], 'Why'))

add('mixed', 'Direct and inverse proportion', 'R2.1-R2.2 consolidation', text(
  'Direct proportion: more of one means more of the other. Divide to find 1, then multiply to find many.',
  'Inverse proportion: more of one means less of the other. Multiply to find 1, then divide to find many.',
  'Check it makes sense: 4 × 9 = 36 and 6 × 6 = 36, so the 4 painters and the 6 painters do the same total work.',
))

export const tutorProportionLesson: TutorMethodLesson = {
  id: 'L031', number: 31, title: 'Direct and inverse proportion', level: 'GCSE Foundation',
  goal: 'Use direct proportion to scale an amount up or down, and inverse proportion to work out how long a job takes.',
  labels: { [direct]: 'Direct proportion', [inverse]: 'Inverse proportion', mixed: 'Review' },
  states: finish(),
}

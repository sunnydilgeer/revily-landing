import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { RatioFrame } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorMethodVisual, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, box, choose, nb, number, readNumbers, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'
import { pillWidth } from '../../written-methods/tutor/RatioPictures'

/*
 * Lesson 30 (Ratio R1): Ratio problems, from Aniksha's R1.6–R1.8 PDFs and videos. Three rungs in the PDFs' order: a
 * difference between two shares, a ratio that changes when some is given or added, and the form 1 : n. Each working
 * draws the question's ratio bars above the A5 board (RatioPictures.tsx), one block per part as in the videos: the
 * parts being worked on are ringed in purple as the board writes their sum, and the bars keep their size throughout.
 */

const { add, finish } = author(30)
const difference = 'ratio-difference'
const changing = 'ratio-changing'
const unitForm = 'ratio-unit-form'

/* ---------- Bars ---------- */

const bars = (...list: [string, number][]): RatioFrame => ({ bars: list.map(([name, parts]) => ({ name, parts })) })
/** A move on the board, with what it changes on the bars. Rings, the note and purple pills are only on the step that sets them. */
type RatioMove = BoardMove & { ratio?: Partial<RatioFrame>; tags?: (string | undefined)[] }

/** The board working with the bars drawn above it: `start` is the question's own bars, on the opening screen. */
function ratioModel(start: RatioFrame, moves: RatioMove[], label = 'Work it out', given: string[] = []): TutorWorking {
  const model = boardModel(given, moves, label)
  if (model.kind !== 'method-worked') throw new Error('A ratio working is a board')
  let current: RatioFrame = start
  const frames = moves.map(({ ratio, tags }) => {
    current = { ...current, rings: undefined, note: undefined, lit: undefined, match: undefined, ...ratio }
    if (tags) current = { ...current, bars: current.bars.map((bar, k) => tags[k] === undefined ? bar : { ...bar, tag: tags[k] }) }
    return current
  })
  // Every step keeps room for the widest pill any step shows, so the bars never move or shrink.
  const room = Math.max(0, ...[start, ...frames].flatMap(frame => frame.bars.map(bar => bar.tag ? pillWidth(bar.tag) : 0)))
  model.examples[0].steps.forEach((step, i) => {
    step.frame.ratio = { ...frames[i], room, ...(i === 0 ? { before: { ...start, room } } : {}) }
  })
  return model
}
/** Bar `bar` lined up against the smaller bar `small`: the parts they share fade, and the extra parts past `from` are
 * ringed. Those extra parts are the difference between the two shares. */
const extra = (bar: number, from: number, to: number, small: number): Partial<RatioFrame> => ({ rings: [{ bar, from, to }], match: { bars: [small, bar], at: from } })
const whole = (bar: number, parts: number) => ({ bar, from: 0, to: parts })

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
/** A question: its own bars above the answer (or its words, when the bars would be too thin), and the working once answered. */
function practice(topic: MicroSkillId, title: string, sourceRef: string, shown: RatioFrame | null, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  // The question's bars are the working's opening bars, at the same size.
  const opening = model.kind === 'method-worked' ? model.examples[0].steps[0]?.frame.ratio?.before : undefined
  const visual: TutorMethodVisual = shown ? { kind: 'ratio', ratio: opening ?? shown } : text(title)
  const state = add(topic, title, sourceRef, visual, interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  return state
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  // The bars are drawn above the board, so the heading is only the question.
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, durationSeconds: number, textAlternative: string[]) => ({
  id: `lesson30-${name}`, src: `/media/lesson-30/${name}.mp4`, poster: `/media/lesson-30/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response, right, list)
const pounds = (state: TutorMethodState) => { state.answerPrefix = '£'; return state }
/** A ratio typed as it is written, ☐ : ☐. */
const ratio = (answer: [number, number]): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'list', listJoiner: ':', acceptanceRule: 'numberList', correctAnswer: answer.join(', '), displayAnswer: answer.join(' : '),
})
/** A typed ratio's own slips: the same ratio not simplified, the two swapped, or a number left over from before. */
function ratioSlips(right: [number, number], list: [[number, number], string][] = []) {
  return (response: string) => {
    const [a, b] = readNumbers(response)
    if (a === undefined || b === undefined || (a === right[0] && b === right[1])) return null
    const own = list.find(([values]) => values[0] === a && values[1] === b)
    if (own) return own[1]
    if (a === right[1] && b === right[0]) return 'Check the order: write the numbers in the order the question names them.'
    if (Math.abs(a * right[1] - b * right[0]) < 1e-9) return 'That’s the same ratio, but it isn’t in the form asked for. Divide both numbers by the same thing.'
    return null
  }
}

/* ---------- Rung 1: the difference between parts (R1.6) ---------- */

const cupcakes = bars(['Dev', 2], ['Eli', 3], ['Fay', 6])
const bakeSale = worked(difference, 'At a bake sale Dev, Eli and Fay share some cupcakes in the ratio 2 : 3 : 6. Fay gets 24 more cupcakes than Dev. How many cupcakes does Eli get?', '2 : 3 : 6, and Fay has 24 more than Dev. How many for Eli?', 'R1.6 video + Q1', ratioModel(cupcakes, [
  { title: 'Line Fay up with Dev', say: 'Fay’s first 2 parts match Dev’s 2. Fay’s 24 extra cupcakes are in Fay’s other parts, the ringed ones: 6 − 2 = 4 parts.', rows: ['6 − 2 = 4'], ratio: { ...extra(2, 2, 6, 0), note: '4 parts = 24' } },
  { title: 'Find 1 part', say: 'Those 4 parts are the 24 cupcakes. Share 24 equally between the 4 parts.', rows: ['24 ÷ 4 = 6'], ratio: { each: '6', note: '1 part = 6' } },
  { title: 'Eli’s share', say: 'Eli has 3 parts, and each part is 6 cupcakes.', rows: ['3 × 6 = 18', '! Eli gets 18 cupcakes'], ratio: { rings: [whole(1, 3)], lit: [1] }, tags: [undefined, '18'] },
]), 'Our aim: turn the difference into 1 part, then multiply for the share you want.')
video(bakeSale, media('difference', 'Fay has 24 more than Dev: how many for Eli?', 'R1.6_Difference_Between_Parts_Of_A_Ratio.mp4', 104, [
  'Sharing cupcakes: Dev, Eli and Fay share cupcakes in the ratio 2 : 3 : 6. Fay has 24 more than Dev. How many does Eli have?',
  'Read the ratio: Fay has 24 more cupcakes than Dev, and we want how many Eli has. Careful: 24 is a difference, not the total.',
  'See it as bars: each block is one part, so 2, 3 and 6 parts. Fay has 4 more parts than Dev, and those 4 parts are the 24. So each part is 24 ÷ 4 = 6 cupcakes, and Eli has 3 parts: 3 × 6 = 18 cupcakes.',
  'The difference in parts: Fay has 6 parts and Dev has 2 parts. 6 − 2 = 4, so Fay has 4 parts more than Dev. The question says she has 24 more, so 4 parts = 24.',
  'Find 1 part: share the 24 equally between the 4 parts. 24 ÷ 4 = 6, so 1 part = 6 cupcakes. Check: 4 × 6 = 24.',
  'Find Eli’s share: Eli has 3 parts. 3 × 6 = 18, so Eli has 18 cupcakes. Check: Dev has 2 × 6 = 12, Fay has 6 × 6 = 36, and 36 − 12 = 24.',
  'Where you see it: at a bake sale Dev, Eli and Fay share cupcakes 2 : 3 : 6, and Fay has 24 more than Dev. 24 ÷ 4 = 6 and 3 × 6 = 18, so Eli has 18 cupcakes.',
  'The difference in parts is the difference in amount. Divide to find 1 part, then multiply for the share you want.',
]))
const sweets = bars(['Ruth', 5], ['Sam', 2])
practice(difference, 'Ruth and Sam share some sweets in the ratio 5 : 2. Ruth gets 18 more sweets than Sam. How many sweets does Sam get?', 'R1.6 Q2', sweets, number(12, '12 sweets'), 'Ruth has 3 parts more than Sam. Those 3 parts are the 18 sweets.', ratioModel(sweets, [
  { title: 'Line Ruth up with Sam', say: 'Ruth’s first 2 parts match Sam’s 2. Ruth’s 18 extra sweets are in Ruth’s other parts, the ringed ones: 5 − 2 = 3 parts.', rows: ['5 − 2 = 3'], ratio: { ...extra(0, 2, 5, 1), note: '3 parts = 18' } },
  { title: 'Find 1 part', say: 'Share the 18 sweets equally between those 3 parts.', rows: ['18 ÷ 3 = 6'], ratio: { each: '6', note: '1 part = 6' } },
  { title: 'Sam’s share', say: 'Sam has 2 parts, and each part is 6 sweets.', rows: ['2 × 6 = 12', '! Sam gets 12 sweets'], ratio: { rings: [whole(1, 2)], lit: [1] }, tags: [undefined, '12'] },
]), slips(12, [[6, 'That’s 1 part. Sam has 2 parts.'], [30, 'That’s Ruth’s share. The question asks for Sam’s.'], [36, '18 is the difference, 3 parts, not 1 part. Divide by 3 first.']]))
const trip = bars(['Tom', 3], ['Uma', 4], ['Vik', 8])
pounds(practice(difference, 'Tom, Uma and Vik save money for a school trip in the ratio 3 : 4 : 8. Vik saves £45 more than Tom. How much does Uma save?', 'R1.6 Q3', trip, number(36, '£36'), 'Vik has 5 parts more than Tom. Those 5 parts are the £45.', ratioModel(trip, [
  { title: 'Line Vik up with Tom', say: 'Vik’s first 3 parts match Tom’s 3. Vik’s extra £45 is in Vik’s other parts, the ringed ones: 8 − 3 = 5 parts.', rows: ['8 − 3 = 5'], ratio: { ...extra(2, 3, 8, 0), note: '5 parts = £45' } },
  { title: 'Find 1 part', say: 'Share the £45 equally between those 5 parts.', rows: ['45 ÷ 5 = 9'], ratio: { each: '9', note: '1 part = £9' } },
  { title: 'Uma’s share', say: 'Uma has 4 parts, and each part is £9.', rows: ['4 × 9 = 36', '! Uma saves £36'], ratio: { rings: [whole(1, 4)], lit: [1] }, tags: [undefined, '£36'] },
]), slips(36, [[9, 'That’s 1 part. Uma has 4 parts.'], [12, '£45 is the difference between Vik and Tom, not the total: 8 − 3 = 5 parts.'], [72, 'That’s Vik’s share. The question asks for Uma’s.'], [27, 'That’s Tom’s share. The question asks for Uma’s.']])))
const cafe = bars(['Teas', 7], ['Coffees', 3], ['Hot choc', 2])
practice(difference, 'A café sells teas, coffees and hot chocolates in the ratio 7 : 3 : 2. One day it sells 45 more teas than hot chocolates. How many coffees does it sell that day?', 'R1.6 Q4a', cafe, number(27, '27 coffees'), 'Teas have 5 parts more than hot chocolates. Those 5 parts are the 45.', ratioModel(cafe, [
  { title: 'Line teas up with hot chocs', say: 'The first 2 parts of teas match the 2 parts of hot chocolates. The 45 extra teas are in the other parts, the ringed ones: 7 − 2 = 5 parts.', rows: ['7 − 2 = 5'], ratio: { ...extra(0, 2, 7, 2), note: '5 parts = 45' } },
  { title: 'Find 1 part', say: 'Share the 45 equally between those 5 parts.', rows: ['45 ÷ 5 = 9'], ratio: { each: '9', note: '1 part = 9' } },
  { title: 'The coffees', say: 'Coffees have 3 parts, and each part is 9 drinks.', rows: ['3 × 9 = 27', '! 27 coffees'], ratio: { rings: [whole(1, 3)], lit: [1] }, tags: [undefined, '27'] },
]), slips(27, [[9, 'That’s 1 part. Coffees have 3 parts.'], [63, 'That’s the teas. The question asks for coffees.'], [18, 'That’s the hot chocolates. The question asks for coffees.'], [15, '45 is the difference, 5 parts, not 3 parts. Find 1 part first: 45 ÷ 5.']]))
practice(difference, 'The same café sells teas, coffees and hot chocolates in the ratio 7 : 3 : 2, and 1 part is 9 drinks. How many drinks does it sell that day in total?', 'R1.6 Q4b', { ...cafe, each: '9' }, number(108, '108 drinks'), 'Add up all the parts, then multiply by 9.', ratioModel({ ...cafe, each: '9' }, [
  { title: 'Add up the parts', say: 'Every drink is in one of the parts. Count the parts in all three bars.', rows: ['7 + 3 + 2 = 12'], ratio: { rings: [whole(0, 7), whole(1, 3), whole(2, 2)], note: '12 parts' } },
  { title: 'Multiply by 1 part', say: 'Each part is 9 drinks.', rows: ['12 × 9 = 108', '! 108 drinks'] },
]), slips(108, [[12, 'That’s the number of parts. Each part is 9 drinks.'], [45, '45 is the difference. Add up all the parts, then multiply by 9.'], [27, 'That’s just the coffees. Add every part: 7 + 3 + 2.']]))
const charity = bars(['First', 2], ['Second', 5], ['Third', 9])
pounds(practice(difference, 'A school shares the money it raises between three charities in the ratio 2 : 5 : 9. The largest amount is £84 more than the smallest amount. How much does the middle charity get?', 'R1.6 Q5a', charity, number(60, '£60'), 'The largest has 7 parts more than the smallest. Those 7 parts are the £84.', ratioModel(charity, [
  { title: 'Line Third up with First', say: 'The largest share’s first 2 parts match the smallest share’s 2. The extra £84 is in its other parts, the ringed ones: 9 − 2 = 7 parts.', rows: ['9 − 2 = 7'], ratio: { ...extra(2, 2, 9, 0), note: '7 parts = £84' } },
  { title: 'Find 1 part', say: 'Share the £84 equally between those 7 parts.', rows: ['84 ÷ 7 = 12'], ratio: { each: '12', note: '1 part = £12' } },
  { title: 'The middle share', say: 'The middle charity has 5 parts, and each part is £12.', rows: ['5 × 12 = 60', '! The middle charity gets £60'], ratio: { rings: [whole(1, 5)], lit: [1] }, tags: [undefined, '£60'] },
]), slips(60, [[12, 'That’s 1 part. The middle charity has 5 parts.'], [108, 'That’s the largest share. The middle charity has 5 parts.'], [24, 'That’s the smallest share. The middle charity has 5 parts.'], [140, '£84 is the difference, 7 parts, not 3 parts. Find 1 part first: 84 ÷ 7.']])))
pounds(practice(difference, 'The same school shares its money in the ratio 2 : 5 : 9, and 1 part is £12. How much money did the school raise in total?', 'R1.6 Q5b', { ...charity, each: '12' }, number(192, '£192'), 'Add up all the parts, then multiply by £12.', ratioModel({ ...charity, each: '12' }, [
  { title: 'Add up the parts', say: 'All the money is in the parts. Count the parts in all three bars.', rows: ['2 + 5 + 9 = 16'], ratio: { rings: [whole(0, 2), whole(1, 5), whole(2, 9)], note: '16 parts' } },
  { title: 'Multiply by 1 part', say: 'Each part is £12.', rows: ['16 × 12 = 192', '! £192'] },
]), slips(192, [[16, 'That’s the number of parts. Each part is £12.'], [84, '£84 is the difference. Add up all the parts, then multiply by £12.'], [60, 'That’s just the middle charity. Add every part: 2 + 5 + 9.']])))
pounds(practice(difference, `Jo says, “One part is £84 ÷ 16, because there are 16 parts altogether.” Test Jo’s part: if 1 part were ${nb('£84 ÷ 16 = £5.25')}, how much more would the largest charity get than the smallest?`, 'R1.6 Q5c', charity, number(36.75, '£36.75'), 'With Jo’s part, work out 9 parts take away 2 parts.', ratioModel(charity, [
  { title: 'Jo’s 1 part', say: 'Jo shares the £84 between all 16 parts.', rows: ['84 ÷ 16 = 5.25'] },
  { title: 'Test the difference', say: 'The largest has 9 parts and the smallest has 2. With Jo’s part the difference comes nowhere near £84, so Jo is wrong: £84 is the 7 ringed parts, not all 16.', rows: ['9 × 5.25 − 2 × 5.25 = 36.75', '! £36.75, not £84: Jo is wrong'], ratio: { ...extra(2, 2, 9, 0), note: '£84 is these 7 parts' } },
]), slips(36.75, [[5.25, 'That’s Jo’s 1 part. Now work out 9 parts take away 2 parts.'], [47.25, 'That’s the largest charity’s share. Take away the smallest, 2 parts.'], [84, 'That’s what the question says. Work it out with Jo’s part, £5.25, to test it.']])))

/* ---------- Rung 2: changing ratios (R1.7) ---------- */

const cards = bars(['Mira', 7], ['Noel', 3])
const swap = worked(changing, 'Mira and Noel collect football cards. The ratio of Mira’s cards to Noel’s cards is 7 : 3. Mira gives Noel 10 cards. Now they have the same number of cards. How many cards did Mira have at first?', '7 : 3, then Mira gives Noel 10 and they’re equal. How many did Mira have?', 'R1.7 video + Q1', ratioModel(cards, [
  { title: 'Call 1 part x', say: 'We don’t know 1 part yet, so call it x. Mira has 7 parts and Noel has 3.', rows: ['> Mira 7x, Noel 3x'], tags: ['7x', '3x'], ratio: { lit: [0, 1] } },
  { title: 'After the swap', say: 'Mira gives 10 away and Noel gets those 10. Now they have the same, so put = between them.', rows: ['7x −10 = 3x +10'], tags: ['7x − 10', '3x + 10'], ratio: { lit: [0, 1] } },
  { title: 'Take 3x from both sides', say: 'Get x on one side only. The boxed 3x cancels on the right.', marks: [[-1, box('3x')]], rows: ['7x −3x^ −10 = ~3x ~−3x^ +10', '4x −10 = 10'] },
  { title: 'Add 10 to both sides', say: 'The boxed −10 is with 4x. Add 10 to both sides, so it cancels.', marks: [[-1, box('−10')]], rows: ['4x ~−10 ~+10^ = 10 +10^', '4x = 20'] },
  { title: 'Divide both sides by 4', say: 'The boxed 4 multiplies x. Divide both sides by 4 to leave x: that is 1 part.', marks: [[-1, box('4x', '[4]x')]], rows: ['4x ÷4^ = 20 ÷4^', 'x = 5'], tags: ['7x', '3x'], ratio: { each: '5', note: '1 part = 5 cards' } },
  { title: 'Mira at first', say: 'At first Mira had 7 parts, and each part is 5 cards.', rows: ['7 × 5 = 35', '! Mira had 35 cards'], tags: ['35'], ratio: { rings: [whole(0, 7)], lit: [0] } },
]), 'Our aim: call 1 part x, write each amount after the change, and make them equal.')
video(swap, media('changing', 'Mira gives Noel 10: how many did Mira have?', 'R1.7_Changing_Ratios.mp4', 121, [
  'Swapping football cards: Mira and Noel’s cards are in the ratio 7 : 3. Mira gives Noel 10 cards. Now they have the same.',
  'Read the question: Mira gives Noel 10 football cards, and now they have the same number of cards. We want how many cards Mira had at first. We don’t know 1 part yet, so call it x.',
  'See it as bars: before, Mira has 7 parts, 7x, and Noel has 3 parts, 3x. Mira gives 10 cards to Noel, so Mira has 7x − 10 and Noel has 3x + 10. After, both bars are the same length: 7x − 10 = 3x + 10.',
  'Write the equation: Mira has 7x cards and Noel has 3x cards. After, Mira has 7x − 10 and Noel has 3x + 10. Now they are the same, so put = between them: 7x − 10 = 3x + 10.',
  'Take away 3x: take 3x from both sides, and the 3x on the right cancels. 4x − 10 = 10, so now x is only on the left.',
  'Add 10, then divide: add 10 to both sides, and the − 10 cancels. 4x = 20. Divide both sides by 4: x = 5.',
  'Back to the cards: x = 5, so 1 part is 5 cards. At first Mira had 7 parts: 7 × 5 = 35. Mira had 35 cards. Check: Noel had 3 × 5 = 15, and 35 − 10 = 25, 15 + 10 = 25.',
  'Where you see it: Mira and Noel collect football cards 7 : 3. Mira gives Noel 10 and now they have the same. 35 − 10 = 25 and 15 + 10 = 25, so Mira had 35 cards.',
  'Call 1 part x. Write each amount after the change. Make them equal and solve.',
]))
const gift = bars(['Ben', 3], ['Cal', 1])
practice(changing, 'Ben and Cal share £40 in the ratio 3 : 1. Ben then gives Cal £10. Write the new ratio of Ben’s money to Cal’s money in its simplest form.', 'R1.7 Q2', gift, ratio([1, 1]), 'Find each share first: £40 is 4 parts. Then move the £10 and simplify.', ratioModel(gift, [
  { title: 'Find 1 part', say: '£40 is the total, shared over 3 + 1 = 4 parts.', rows: ['40 ÷ 4 = 10'], ratio: { rings: [whole(0, 3), whole(1, 1)], each: '10', note: '4 parts = £40' } },
  { title: 'Each share', say: 'Ben has 3 parts. Cal has 1 part, £10.', rows: ['3 × 10 = 30'], tags: ['£30', '£10'], ratio: { lit: [0] } },
  { title: 'After the gift', say: 'Ben gives £10 away and Cal gets it. Change the money, not the ratio numbers.', rows: ['30 −10 = 20', '10 +10 = 20'], tags: ['£20', '£20'], ratio: { each: undefined, lit: [0, 1], note: 'after the gift' } },
  { title: 'Simplify', say: 'Both are 20. Divide both by 20.', rows: ['> 20 : 20, divide both by 20', '! 1 : 1'] },
]), ratioSlips([1, 1], [[[20, 20], 'That’s right before simplifying. Divide both by 20.'], [[3, 1], 'That’s the ratio before the gift. Move the £10 first.'], [[2, 1], 'Ben gives £10 to Cal, so Cal gets £10 more too: £20 and £20.']]))
const savings = bars(['Lena', 3], ['Max', 2])
practice(changing, 'Lena and Max save money in the ratio 3 : 2. Lena has saved £45. Max’s gran gives him £20. Write the new ratio of Lena’s savings to Max’s savings in its simplest form.', 'R1.7 Q3', savings, ratio([9, 10]), 'Lena’s 3 parts are £45. Find 1 part, then Max’s savings, then add the £20.', ratioModel(savings, [
  { title: 'Find 1 part', say: 'Lena’s 3 parts are £45. Share it equally between them.', rows: ['45 ÷ 3 = 15'], tags: ['£45'], ratio: { rings: [whole(0, 3)], each: '15', note: '3 parts = £45' } },
  { title: 'Max at first', say: 'Max has 2 parts, and each part is £15.', rows: ['2 × 15 = 30'], tags: [undefined, '£30'], ratio: { lit: [1] } },
  { title: 'Add the £20', say: 'Max’s gran gives him £20. Change his money, not the ratio numbers.', rows: ['30 +20 = 50'], tags: [undefined, '£50'], ratio: { each: undefined, lit: [1], note: 'after the gift' } },
  { title: 'Simplify', say: '45 and 50 are both in the 5 times table. Divide both by 5.', rows: ['> 45 : 50, divide both by 5', '! 9 : 10'] },
]), ratioSlips([9, 10], [[[45, 50], 'That’s right before simplifying. Divide both by 5.'], [[3, 2], 'That’s the ratio before the gift. Add the £20 to Max first.'], [[3, 4], '£20 is money, not parts. Add it to Max’s £30.']]))
const stall = bars(['Apples', 3], ['Pears', 2])
practice(changing, 'A fruit stall has apples and pears in the ratio 3 : 2. The owner adds 12 more pears. Now there are the same number of apples and pears. How many apples are there?', 'R1.7 Q4a', stall, number(36, '36 apples'), 'Call 1 part x: apples are 3x and pears are 2x. After adding 12 pears they are equal.', ratioModel(stall, [
  { title: 'Call 1 part x', say: 'We don’t know 1 part, so call it x. Apples have 3 parts and pears have 2.', rows: ['> apples 3x, pears 2x'], tags: ['3x', '2x'], ratio: { lit: [0, 1] } },
  { title: 'After adding 12 pears', say: 'Pears go up by 12. Now there are the same number, so put = between them.', rows: ['3x = 2x +12'], tags: [undefined, '2x + 12'], ratio: { lit: [1] } },
  { title: 'Take 2x from both sides', say: 'The boxed 2x cancels on the right, leaving x on its own.', marks: [[-1, box('2x')]], rows: ['3x −2x^ = ~2x ~−2x^ +12', 'x = 12'], ratio: { each: '12', note: '1 part = 12' } },
  { title: 'The apples', say: 'Apples have 3 parts, and each part is 12.', rows: ['3 × 12 = 36', '! 36 apples'], tags: ['36'], ratio: { rings: [whole(0, 3)], lit: [0] } },
]), slips(36, [[12, 'That’s 1 part, x. Apples have 3 parts.'], [24, 'That’s the pears at first. The question asks for apples.'], [60, 'That’s apples and pears together at first. Apples are 3 parts.']]))
practice(changing, 'The same stall had apples and pears in the ratio 3 : 2, with 1 part = 12. The owner added 12 more pears. How many pears are there now?', 'R1.7 Q4b', { ...stall, each: '12' }, number(36, '36 pears'), 'Pears at first are 2 parts. Then add the 12.', ratioModel({ ...stall, each: '12' }, [
  { title: 'Pears at first', say: 'Pears had 2 parts, and each part is 12.', rows: ['2 × 12 = 24'], tags: [undefined, '24'], ratio: { rings: [whole(1, 2)], lit: [1] } },
  { title: 'Add the 12', say: 'The owner adds 12 more pears.', rows: ['24 +12 = 36', '! 36 pears'], tags: [undefined, '36'], ratio: { each: undefined, lit: [1], note: 'after adding 12' } },
]), slips(36, [[24, 'That’s the pears at first. The owner adds 12 more.'], [12, 'That’s 1 part. Pears at first are 2 parts, then add 12.']]))
const cinema = bars(['Adults', 6], ['Children', 5])
practice(changing, 'In a cinema the ratio of adults to children is 6 : 5. 8 adults leave and 4 more children come in. Now there are the same number of adults and children. How many children were in the cinema at first?', 'R1.7 Q5a', cinema, number(60, '60 children'), 'Adults are 6x and children are 5x. Write each one after the change and make them equal.', ratioModel(cinema, [
  { title: 'Call 1 part x', say: 'We don’t know 1 part, so call it x. Adults have 6 parts and children have 5.', rows: ['> adults 6x, children 5x'], tags: ['6x', '5x'], ratio: { lit: [0, 1] } },
  { title: 'After the change', say: '8 adults leave and 4 children come in. Now they are the same, so put = between them.', rows: ['6x −8 = 5x +4'], tags: ['6x − 8', '5x + 4'], ratio: { lit: [0, 1] } },
  { title: 'Take 5x from both sides', say: 'The boxed 5x cancels on the right.', marks: [[-1, box('5x')]], rows: ['6x −5x^ −8 = ~5x ~−5x^ +4', 'x −8 = 4'] },
  { title: 'Add 8 to both sides', say: 'The boxed −8 is with x. Add 8 to both sides, so it cancels.', marks: [[-1, box('−8')]], rows: ['x ~−8 ~+8^ = 4 +8^', 'x = 12'], ratio: { each: '12', note: '1 part = 12 people' } },
  { title: 'Children at first', say: 'Children had 5 parts, and each part is 12 people.', rows: ['5 × 12 = 60', '! 60 children'], tags: [undefined, '60'], ratio: { rings: [whole(1, 5)], lit: [1] } },
]), slips(60, [[12, 'That’s 1 part, x. Children are 5 parts.'], [72, 'That’s the adults at first. The question asks for children.'], [64, 'That’s the children now. The question asks how many at first.']]))
practice(changing, 'The same cinema had adults and children in the ratio 6 : 5, with 1 part = 12. 8 adults left and 4 more children came in. How many people are in the cinema now?', 'R1.7 Q5b', { ...cinema, each: '12' }, number(128, '128 people'), 'Work out the adults now and the children now, then add them.', ratioModel({ ...cinema, each: '12' }, [
  { title: 'Adults now', say: 'Adults had 6 parts. Then 8 left.', rows: ['6 × 12 −8 = 64'], tags: ['64'], ratio: { each: undefined, rings: [whole(0, 6)], lit: [0], note: '8 adults left' } },
  { title: 'Children now', say: 'Children had 5 parts. Then 4 more came in.', rows: ['5 × 12 +4 = 64'], tags: [undefined, '64'], ratio: { rings: [whole(1, 5)], lit: [1], note: '4 more children came in' } },
  { title: 'Add them', say: 'Everyone in the cinema now is an adult or a child.', rows: ['64 +64 = 128', '! 128 people'] },
]), slips(128, [[132, 'That’s everyone at first. 8 left and 4 came in.'], [64, 'That’s one group. Add the adults and the children.']]))
practice(changing, 'Omar says, “After 8 adults leave and 4 children come in, the ratio is (6 − 8) : (5 + 4) = −2 : 9.” Why is Omar wrong?', 'R1.7 Q5c', { ...cinema, each: '12' }, choose(
  '6 and 5 are parts, not people: 64 adults and 64 children make 1 : 1',
  ['He should simplify −2 : 9 first', 'The numbers are wrong before you simplify. Change the real numbers of people: 72 − 8 and 60 + 4.'],
  ['He should have worked out (6 + 8) : (5 − 4) = 14 : 1', 'That swaps the signs, but it still changes the parts, not the people. Use the real numbers: 72 − 8 and 60 + 4.'],
  ['He is right: a ratio can be negative', 'You can’t have −2 people. 6 and 5 are parts: change the real numbers, 72 − 8 and 60 + 4.'],
), 'Change the real numbers of people, not the ratio numbers.', ratioModel({ ...cinema, each: '12' }, [
  { title: 'The real numbers', say: '6 and 5 are parts. Change the real numbers of people: 8 adults leave and 4 children come in.', rows: ['6 × 12 −8 = 64', '5 × 12 +4 = 64'], tags: ['64', '64'], ratio: { each: undefined, lit: [0, 1], note: 'the real numbers now' } },
  { title: 'Write the ratio', say: 'Both are 64. Divide both by 64.', rows: ['> 64 : 64, divide both by 64', '! 1 : 1, not −2 : 9'] },
], 'Why'))

/* ---------- Rung 3: the form 1 : n (R1.8) ---------- */

const concrete = bars(['Cement', 6], ['Sand', 15])
const mix = worked(unitForm, 'A builder mixes cement and sand in the ratio 6 : 15. Write this ratio in the form 1 : n.', 'Cement : sand = 6 : 15. Write it in the form 1 : n.', 'R1.8 video + Q1', ratioModel(concrete, [
  { title: 'Make 6 into 1', say: 'In 1 : n the first number is 1. Cement has 6 parts, so share both bars into 6 equal groups: what we do to one side, we do to the other.', rows: ['> Divide both by 6'], ratio: { groups: 6, note: '6 equal groups' } },
  { title: 'One group', say: 'Divide both by 6: one group is 1 part of cement and two and a half parts of sand.', rows: ['6 ÷ 6 = 1', '15 ÷ 6 = 2.5', '! 1 : 2.5'], tags: ['1', '2.5'], ratio: { groups: 6, rings: [{ bar: 0, from: 0, to: 1 }, { bar: 1, from: 0, to: 2.5 }], lit: [0, 1], note: '1 group' } },
]), 'Our aim: make the first number 1, by dividing both numbers by it.')
video(mix, media('unit-form', '6 : 15 in the form 1 : n', 'R1.8_Reducing_Ratios_To_The_Form_1_n.mp4', 104, [
  'Mixing concrete: cement : sand = 6 : 15. Write it in the form 1 : n.',
  'What does 1 : n mean? The first number is 1. It tells us: for every 1 bag of cement, how much sand? To make 6 into 1, divide by 6. What we do to one side, we do to the other side.',
  'See it as bars: 6 bags of cement and 15 bags of sand. Divide both by 6: share them into 6 equal groups. One group is 1 bag of cement and 2.5 bags of sand, so the ratio is 1 : 2.5.',
  'Divide both sides by 6: 6 ÷ 6 = 1 and 15 ÷ 6 = 2.5. 6 goes into 15 two times (12) with 3 left, and 3 ÷ 6 = 0.5. So 6 : 15 = 1 : 2.5.',
  'Check it: multiply both by 6 to go back. 1 × 6 = 6 and 2.5 × 6 = 15. n can be a decimal, and that is fine.',
  'The form n : 1: the second number is 1. Grey and red slabs 12 : 5, so divide both by 5. 12 ÷ 5 = 2.4 and 5 ÷ 5 = 1, so 12 : 5 = 2.4 : 1.',
  'Where you see it: a builder mixes 6 bags of cement with 15 bags of sand. For every 1 bag of cement, use 2.5 bags of sand: 6 : 15 = 1 : 2.5.',
  'For 1 : n, divide by the first number. For n : 1, divide by the second number. Do the same to both sides.',
]))
practice(unitForm, 'A fruit drink uses juice and water in the ratio 5 : 20. Write this ratio in the form 1 : n.', 'R1.8 Q2', null, ratio([1, 4]), 'The first number must become 1. Divide both numbers by 5.', boardModel([], [
  { title: 'Divide both by 5', say: 'The first number must become 1, so divide both numbers by 5.', rows: ['5 ÷ 5 = 1', '20 ÷ 5 = 4', '! 1 : 4'] },
]), ratioSlips([1, 4], [[[1, 15], 'Divide, don’t subtract: 20 ÷ 5 = 4.'], [[4, 1], 'In 1 : n the first number is 1: 1 : 4.']]))
const slabs = bars(['Grey', 14], ['Red', 4])
practice(unitForm, 'A garden path uses grey slabs and red slabs in the ratio 14 : 4. Write this ratio in the form n : 1.', 'R1.8 Q3', slabs, ratio([3.5, 1]), 'This time the second number must become 1. Divide both numbers by 4.', ratioModel(slabs, [
  { title: 'Divide both by 4', say: 'In n : 1 the second number is 1, so share both bars into 4 equal groups. Each group of grey has three and a half parts.', rows: ['14 ÷ 4 = 3.5', '4 ÷ 4 = 1', '! 3.5 : 1'], tags: ['3.5', '1'], ratio: { groups: 4, rings: [{ bar: 0, from: 0, to: 3.5 }, { bar: 1, from: 0, to: 1 }], lit: [0, 1], note: '1 group' } },
]), ratioSlips([3.5, 1], [[[10, 1], 'Divide, don’t subtract: 14 ÷ 4 = 3.5.'], [[3, 1], '14 ÷ 4 is 3.5: 4 goes into 14 three times with 2 left, and 2 ÷ 4 = 0.5.']]))
practice(unitForm, 'In a school the ratio of teachers to pupils is 3 : 100. Write this ratio in the form 1 : n. Give n correct to 1 decimal place.', 'R1.8 Q4a', null, ratio([1, 33.3]), 'Divide both numbers by 3, then round n to 1 decimal place.', boardModel([], [
  { title: 'Divide both by 3', say: 'The first number must become 1, so divide both numbers by 3. 100 ÷ 3 doesn’t stop: the 3s go on for ever.', rows: ['3 ÷ 3 = 1', '> 100 ÷ 3 = 33.333…'] },
  { title: 'Round to 1 decimal place', say: 'Keep one digit after the point. The next digit is 3, less than 5, so round down.', rows: ['! 1 : 33.3'] },
]), ratioSlips([1, 33.3], [[[1, 33.33], 'Give n to 1 decimal place: one digit after the point.'], [[1, 33.4], 'The next digit is 3, less than 5, so round down: 33.3.'], [[1, 97], 'Divide, don’t subtract: 100 ÷ 3.'], [[1, 33], 'Give n to 1 decimal place, not a whole number: 33.3.']]))
practice(unitForm, 'In a school the ratio of teachers to pupils is 3 : 100. Another school has the same ratio and 600 pupils. How many teachers does it have?', 'R1.8 Q4b', null, number(18, '18 teachers'), 'Every 100 pupils need 3 teachers. How many lots of 100 are in 600?', boardModel([], [
  { title: 'Lots of 100 pupils', say: 'Every 100 pupils come with 3 teachers. Count the lots of 100.', rows: ['600 ÷ 100 = 6'] },
  { title: 'The teachers', say: 'Each lot of 100 pupils needs 3 teachers.', rows: ['6 × 3 = 18', '! 18 teachers'] },
]), slips(18, [[6, 'That’s how many lots of 100. Each lot needs 3 teachers.'], [200, 'That’s 600 ÷ 3. Every 100 pupils need 3 teachers: 600 ÷ 100 = 6 lots.'], [1800, 'Every 100 pupils need 3 teachers, not every pupil: 600 ÷ 100 = 6 lots.']]))
practice(unitForm, 'A painter mixes white paint and blue paint in the ratio 8 : 36. Write this ratio in the form 1 : n.', 'R1.8 Q5a', null, ratio([1, 4.5]), 'The first number must become 1. Divide both numbers by 8.', boardModel([], [
  { title: 'Divide both by 8', say: 'The first number must become 1, so divide both numbers by 8.', rows: ['8 ÷ 8 = 1', '36 ÷ 8 = 4.5', '! 1 : 4.5'] },
]), ratioSlips([1, 4.5], [[[1, 28], 'Divide, don’t subtract: 36 ÷ 8 = 4.5.'], [[1, 4], '36 ÷ 8 is 4.5: 8 goes into 36 four times with 4 left, and 4 ÷ 8 = 0.5.']]))
practice(unitForm, 'The painter mixes white and blue paint in the ratio 1 : 4.5. She uses 12 litres of white paint. How much blue paint does she need?', 'R1.8 Q5b', null, number(54, '54 litres'), '1 litre of white needs 4.5 litres of blue. Multiply by 12.', boardModel([], [
  { title: 'Multiply by 12', say: 'Every 1 litre of white needs 4.5 litres of blue, and she uses 12 litres of white.', rows: ['12 × 4.5 = 54', '! 54 litres'] },
]), slips(54, [[16.5, 'Multiply, don’t add: 12 × 4.5.'], [48, '12 × 4.5 is 54: 12 × 4 = 48, and 12 × 0.5 = 6 more.'], [96, 'Use 1 : 4.5, not 8 : 36: 12 litres of white is 12 lots of 4.5.']]))
practice(unitForm, `Raj says, “8 : 36 in the form 1 : n is 1 : 28, because 36 − 8 = 28.” Test Raj’s ratio: multiply ${nb('1 : 28')} by 8. What does the 28 become?`, 'R1.8 Q5c', null, number(224, '224'), 'If Raj were right, 1 : 28 times 8 would give back 8 : 36.', boardModel([], [
  { title: 'Multiply back by 8', say: 'Multiplying both numbers by 8 should give back 8 : 36, if Raj is right.', rows: ['1 × 8 = 8', '28 × 8 = 224'] },
  { title: 'Compare', say: '8 : 224 is not 8 : 36, so Raj is wrong: to make 8 into 1 you divide by 8, you don’t take 8 away.', rows: ['! 8 : 224, not 8 : 36: Raj is wrong'] },
]), slips(224, [[36, 'That’s what it would be if Raj were right. Work out 28 × 8.'], [28, 'Multiply the 28 by 8.'], [216, '28 × 8 is 224: 20 × 8 = 160 and 8 × 8 = 64.']]))

add('mixed', 'Ratio problems', 'R1.6-R1.8 consolidation', text(
  'A difference between two shares: the difference in parts is the difference in amount. Divide to find 1 part, then multiply for the share you want.',
  'A ratio that changes: call 1 part x, write each amount after the change, make them equal and solve. Change the real amounts, never the ratio numbers.',
  'The form 1 : n: divide both numbers by the first number. For n : 1, divide both by the second. n can be a decimal.',
))

export const tutorRatioLesson: TutorMethodLesson = {
  id: 'L030', number: 30, title: 'Ratio problems', level: 'GCSE Foundation',
  goal: 'Find a share from the difference between two parts, solve a ratio that changes, and write a ratio in the form 1 : n.',
  labels: { [difference]: 'Difference between parts', [changing]: 'Changing ratios', [unitForm]: 'The form 1 : n', mixed: 'Review' },
  states: finish(),
}

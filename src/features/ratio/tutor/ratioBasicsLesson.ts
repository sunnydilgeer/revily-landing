import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { RatioFrame } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorMethodVisual, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, number, pair, readNumbers, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'
import { pillWidth } from '../../written-methods/tutor/RatioPictures'

/*
 * Lesson 37 (Ratio R1.1–R1.5): Ratios, the first lesson of the Ratio chapter, before Ratio problems (lesson 30, R1.6–
 * R1.8). Aniksha's R1.1–R1.5 files don't exist, so the five videos and worksheets were made with the lesson kit in her
 * style (tools/lesson-kit/packs/R1.1–R1.5), from Skills 1–5 on p91 of Sunny's book, with our own numbers (Sunny, 11
 * Oct). Five rungs in the book's order: ratios as fractions, simplifying, scaling, part to whole, and sharing an amount.
 * Workings draw the question's ratio bars above the A5 board (RatioPictures.tsx), as in lesson 30.
 */

const { add, finish } = author(37)
const fractions = 'ratio-fractions'
const simplifying = 'ratio-simplifying'
const scaling = 'ratio-scaling'
const partWhole = 'ratio-part-whole'
const sharing = 'ratio-sharing'

/* ---------- Bars ---------- */

const bars = (...list: [string, number][]): RatioFrame => ({ bars: list.map(([name, parts]) => ({ name, parts })) })
type RatioMove = BoardMove & { ratio?: Partial<RatioFrame>; tags?: (string | undefined)[] }

/** The board working with the bars drawn above it, as in lesson 30: `start` is the question's own bars. */
function ratioModel(start: RatioFrame, moves: RatioMove[], label = 'Work it out'): TutorWorking {
  const model = boardModel([], moves, label)
  if (model.kind !== 'method-worked') throw new Error('A ratio working is a board')
  let current: RatioFrame = start
  const frames = moves.map(({ ratio, tags }) => {
    current = { ...current, rings: undefined, note: undefined, lit: undefined, match: undefined, ...ratio }
    if (tags) current = { ...current, bars: current.bars.map((bar, k) => tags[k] === undefined ? bar : { ...bar, tag: tags[k] }) }
    return current
  })
  const room = Math.max(0, ...[start, ...frames].flatMap(frame => frame.bars.map(bar => bar.tag ? pillWidth(bar.tag) : 0)))
  model.examples[0].steps.forEach((step, i) => {
    step.frame.ratio = { ...frames[i], room, ...(i === 0 ? { before: { ...start, room } } : {}) }
  })
  return model
}
const whole = (bar: number, parts: number) => ({ bar, from: 0, to: parts })

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
function practice(topic: MicroSkillId, title: string, sourceRef: string, shown: boolean, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null) {
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const opening = model.kind === 'method-worked' ? model.examples[0].steps[0]?.frame.ratio?.before : undefined
  const visual: TutorMethodVisual = shown && opening ? { kind: 'ratio', ratio: opening } : text(title)
  const state = add(topic, title, sourceRef, visual, interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  return state
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, durationSeconds: number, textAlternative: string[]) => ({
  id: `lesson37-${name}`, src: `/media/lesson-37/${name}.mp4`, poster: `/media/lesson-37/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response, right, list)
const pounds = (state: TutorMethodState) => { state.answerPrefix = '£'; return state }
const fraction = (answer: string): InteractionDefinition => ({
  type: 'fractionInput', correctAnswer: answer, displayAnswer: answer, acceptanceRule: 'rational', responseShape: 'fraction', requireSimplest: true,
})
/** A ratio typed as it is written, ☐ : ☐. */
const ratio = (answer: [number, number]): InteractionDefinition => ({
  type: 'numericInput', responseShape: 'list', listJoiner: ':', acceptanceRule: 'numberList', correctAnswer: answer.join(', '), displayAnswer: answer.join(' : '),
})
/** A typed ratio's own slips: the two swapped, or the same ratio not yet in its simplest form. */
function ratioSlips(right: [number, number], list: [[number, number], string][] = []) {
  return (response: string) => {
    const [a, b] = readNumbers(response)
    if (a === undefined || b === undefined || (a === right[0] && b === right[1])) return null
    const own = list.find(([values]) => values[0] === a && values[1] === b)
    if (own) return own[1]
    if (a === right[1] && b === right[0]) return 'Check the order: write the numbers in the order the question names them.'
    if (Math.abs(a * right[1] - b * right[0]) < 1e-9) return 'That’s the same ratio, but it isn’t in its simplest form yet. Divide both numbers by a common factor again.'
    return null
  }
}

/* ---------- Rung 1: ratios as fractions (R1.1) ---------- */

const counters = bars(['Red', 4], ['Blue', 5])
const bag = worked(fractions, 'Red and blue counters are in a bag in the ratio 4 : 5. What fraction of the counters are red?', 'Red : blue = 4 : 5. What fraction are red?', 'R1.1 video + Q1', ratioModel(counters, [
  { title: 'Compare the red counters with the blue ones', say: 'The ratio of red to blue is 4 : 5. That compares the two parts, but the question asks about all the counters.', rows: ['> the ratio of red to blue is 4 : 5'] },
  { title: 'Add the parts', say: 'Every 4 red counters come with 5 blue ones, so the counters come in groups of 9. Red is 4 of the 9 parts.', rows: ['4 + 5 = 9', '! {4|9} of the counters are red'], tags: ['4', '5'], ratio: { note: '9 parts in total', rings: [whole(0, 4)] } },
]), 'Our aim: part over part compares the two. For a fraction of the whole, add the parts and put the part over the total.')
video(bag, media('fractions', 'Red : blue = 4 : 5. What fraction are red?', 'R1.1_Writing_Ratios_As_Fractions.mp4', 70, [
  'Red and blue counters: a bag has red and blue counters in the ratio 4 : 5. For every 4 red counters there are 5 blue ones.',
  'Way 1, compare the two: put the red number over the blue number. There are 4/5 as many red counters as blue counters. The other way round, there are 5/4 as many blue as red.',
  'Way 2, part of the whole: add the parts, 4 + 5 = 9.',
  'Red out of all of them: red is 4 of the 9 parts, so 4/9 of the counters are red.',
  'Which fraction? Red compared with blue is 4/5. Red out of all the counters is 4/9. "As many as" compares the two parts; "of the bag" or "of all" uses the total.',
  'Where you see it: a bag has 20 blue counters, in the ratio red : blue = 4 : 5. Red is 4/5 of blue: 4/5 × 20 = 16 red counters.',
  'Part over part compares the two. Add the parts for the total. Part over total is the fraction of the whole.',
]))
practice(fractions, 'At an animal shelter the ratio of cats to dogs is 2 : 7. What fraction of the animals are cats?', 'R1.1 Q2', true, fraction('2/9'), 'Add the parts for the total, then put the cats over it.', ratioModel(bars(['Cats', 2], ['Dogs', 7]), [
  { title: 'Add the parts', say: 'The animals come in groups of 2 + 7.', rows: ['2 + 7 = 9'], ratio: { note: '9 parts in total' } },
  { title: 'Part over total', say: 'Cats are 2 of the 9 parts.', rows: ['! {2|9} are cats'], ratio: { rings: [whole(0, 2)], lit: [0] } },
]))
practice(fractions, 'In a choir the ratio of boys to girls is 5 : 3. There are how many times as many girls as boys? Give a fraction.', 'R1.1 Q3', true, fraction('3/5'), '“As many as” compares the two parts: girls over boys.', ratioModel(bars(['Boys', 5], ['Girls', 3]), [
  { title: 'Girls over boys', say: 'This compares girls with boys, so no total: put the girls’ number over the boys’ number.', rows: ['! {3|5} as many girls as boys'], ratio: { lit: [1] } },
]))
practice(fractions, 'A drink is made from juice and water in the ratio 1 : 4. What fraction of the drink is water?', 'R1.1 Q4', true, fraction('4/5'), 'The whole drink is 1 + 4 parts.', ratioModel(bars(['Juice', 1], ['Water', 4]), [
  { title: 'Add the parts', say: 'The whole drink is 1 + 4 parts.', rows: ['1 + 4 = 5'], ratio: { note: '5 parts in total' } },
  { title: 'Part over total', say: 'Water is 4 of the 5 parts.', rows: ['! {4|5} of the drink is water'], ratio: { rings: [whole(1, 4)], lit: [1] } },
]))
practice(fractions, 'In a school the ratio of students with brown hair to students with blonde hair is 3 : 5. There are 320 students. How many have brown hair?', 'R1.1 Q5', true, number(120, '120 students'), 'Brown hair is 3/8 of the students.', ratioModel(bars(['Brown', 3], ['Blonde', 5]), [
  { title: 'The fraction', say: 'There are 3 + 5 = 8 parts, so 3/8 of the students have brown hair.', rows: ['3 + 5 = 8'], ratio: { rings: [whole(0, 3)], note: '3/8 have brown hair' } },
  { title: 'Find 3/8 of 320', say: 'Divide by 8, then multiply by 3.', rows: ['320 ÷ 8 = 40', '40 × 3 = 120', '! 120 students'], ratio: { each: '40', lit: [0] } },
]), slips(120, [[200, 'That’s the blonde students. The question asks about brown hair.'], [40, 'That’s 1 part. Brown hair is 3 parts.'], [192, 'Brown is 3/8 of the students, not 3/5: there are 3 + 5 = 8 parts.']]))

/* ---------- Rung 2: simplifying (R1.2) ---------- */

const simplify = worked(simplifying, 'Write 12 : 18 : 30 in its simplest form.', 'Simplify 12 : 18 : 30', 'R1.2 video + Q1', boardModel(['>0 12 : 18 : 30'], [
  { title: 'Find the HCF', say: '2, 3 and 6 all divide 12, 18 and 30. The biggest is 6, the highest common factor.', rows: ['>0 The HCF of 12, 18 and 30 = 6'] },
  { title: 'Divide every part by 6', say: '12 ÷ 6 = 2, 18 ÷ 6 = 3 and 30 ÷ 6 = 5.', rows: ['12 : 18 : 30 = 2 : 3 : 5'] },
  { title: 'Check it’s fully simplified', say: 'Nothing but 1 divides 2, 3 and 5, so it is in its simplest form.', rows: ['! 2 : 3 : 5'] },
]), 'Our aim: divide every part of the ratio by the same number, the highest common factor, so the numbers are as small as they can be.')
video(simplify, media('simplifying', 'Simplify 12 : 18 : 30', 'R1.2_Simplifying_Ratios.mp4', 55, [
  'Simplify a ratio: write 12 : 18 : 30 in its simplest form, the smallest whole numbers in the same ratio.',
  'Step 1, find the HCF: 2, 3 and 6 all divide 12, 18 and 30. The biggest is 6, so the HCF is 6.',
  'Step 2, divide every part: 12 ÷ 6 = 2, 18 ÷ 6 = 3, 30 ÷ 6 = 5. The answer is 2 : 3 : 5.',
  'Is it simplest? Nothing but 1 divides 2, 3 and 5, so it is in its simplest form. Dividing by a smaller factor first is fine: just keep going until you can’t.',
  'Different units: 2 m : 40 cm. Make the units the same first: 2 m = 200 cm, so 200 : 40. Divide both by 40: 5 : 1.',
  'Find the HCF of every part, divide every part by it, and use the same units first.',
]))
practice(simplifying, 'Write 10 : 25 in its simplest form.', 'R1.2 Q2', false, ratio([2, 5]), 'Both numbers are in the 5 times table.', boardModel([], [
  { title: 'Find the HCF', say: '5 is the biggest number that divides both 10 and 25.', rows: ['>0 The HCF of 10 and 25 = 5'] },
  { title: 'Divide both by 5', say: '10 ÷ 5 = 2 and 25 ÷ 5 = 5.', rows: ['10 : 25 = 2 : 5', '! 2 : 5'] },
]), ratioSlips([2, 5]))
practice(simplifying, 'Write 36 : 48 in its simplest form.', 'R1.2 Q3', false, ratio([3, 4]), 'The HCF of 36 and 48 is 12.', boardModel([], [
  { title: 'Divide both by 12', say: '12 is the highest common factor of 36 and 48.', rows: ['36 : 48 = 3 : 4', '! 3 : 4'] },
]), ratioSlips([3, 4], [[[9, 12], 'You divided by 4. 9 and 12 can both still be divided by 3.'], [[18, 24], 'You divided by 2. Keep going: 18 and 24 share a factor of 6.'], [[6, 8], 'You divided by 6. 6 and 8 can both still be divided by 2.']]))
practice(simplifying, 'Write 24 : 40 : 56 in its simplest form.', 'R1.2 Q4', false, choose(
  '3 : 5 : 7',
  ['6 : 10 : 14', 'All three are still even. Divide by 2 again.'],
  ['12 : 20 : 28', 'You divided by 2. 12, 20 and 28 still share a factor of 4.'],
  ['3 : 5 : 8', 'Divide every part by 8: 56 ÷ 8 is 7.'],
), 'The HCF of 24, 40 and 56 is 8.', boardModel([], [
  { title: 'Divide every part by 8', say: '8 is the highest common factor of 24, 40 and 56.', rows: ['24 : 40 : 56 = 3 : 5 : 7', '! 3 : 5 : 7'] },
]))
practice(simplifying, 'Write 2 m : 40 cm in its simplest form.', 'R1.2 Q5a', false, ratio([5, 1]), 'Make the units the same first: 2 m is 200 cm.', boardModel([], [
  { title: 'Same units', say: 'There are 100 cm in a metre, so 2 m is 200 cm.', rows: ['2 m : 40 cm = 200 : 40'] },
  { title: 'Divide both by 40', say: '40 is the highest common factor of 200 and 40.', rows: ['200 : 40 = 5 : 1', '! 5 : 1'] },
]), ratioSlips([5, 1], [[[1, 20], 'Make the units the same first: 2 m is 200 cm, not 2.'], [[20, 4], 'You divided by 10. Keep going: 20 and 4 share a factor of 4.']]))
practice(simplifying, 'Write 1.5 : 2.5 in its simplest form.', 'R1.2 Q5b', false, ratio([3, 5]), 'Multiply both by 10 to make whole numbers first.', boardModel([], [
  { title: 'Make whole numbers', say: 'Multiply both by 10.', rows: ['1.5 : 2.5 = 15 : 25'] },
  { title: 'Find the HCF', say: '5 is the biggest number that divides both 15 and 25.', rows: ['>0 The HCF of 15 and 25 = 5'] },
  { title: 'Divide both by 5', say: '15 ÷ 5 = 3 and 25 ÷ 5 = 5.', rows: ['15 : 25 = 3 : 5', '! 3 : 5'] },
]), ratioSlips([3, 5], [[[15, 25], 'Whole numbers now, but 15 and 25 can both be divided by 5.']]))

/* ---------- Rung 3: scaling (R1.3) ---------- */

const squash = bars(['Squash', 2], ['Water', 7])
const mix = worked(scaling, 'Squash and water are mixed in the ratio 2 : 7. How much water is needed with 10 cups of squash?', 'Squash : water = 2 : 7, and 10 cups of squash', 'R1.3 video + Q1', ratioModel(squash, [
  { title: 'Find 1 part', say: '2 parts of squash are 10 cups, so 1 part is 10 ÷ 2 = 5 cups.', rows: ['10 ÷ 2 = 5'], ratio: { rings: [whole(0, 2)], each: '5', note: '1 part = 5 cups' }, tags: ['10'] },
  { title: 'Find the water', say: 'Water is 7 parts, and every part is 5 cups.', rows: ['7 × 5 = 35', '! 35 cups of water'], ratio: { each: '5', rings: [whole(1, 7)], lit: [1] }, tags: ['10', '35'] },
]), 'Our aim: use the part you know to find what 1 part is worth, then multiply to get the part you want. Never add.')
video(mix, media('scaling', 'Squash : water = 2 : 7, with 10 cups of squash', 'R1.3_Scaling_Ratios.mp4', 55, [
  'Making squash: squash and water are mixed in the ratio 2 : 7. How much water goes with 10 cups of squash?',
  'Step 1, find the multiplier: the squash goes from 2 cups to 10 cups. 10 ÷ 2 = 5, so the whole recipe is 5 times as big.',
  'Step 2, multiply both parts: 2 × 5 = 10 and 7 × 5 = 35. The ratio is 10 : 35, so 35 cups of water.',
  'Check it: divide both by 5 and you get back to 2 : 7. Scaling multiplies every part by the same number: never add.',
  'Where you see it: a recipe uses flour and butter in the ratio 5 : 2. With 300 g of flour, 300 ÷ 5 = 60 and 2 × 60 = 120 g of butter.',
  'Find the multiplier from the part you know, multiply every part by it, and check by dividing back.',
]))
practice(scaling, 'Two numbers are in the ratio 3 : 4. The first number is 9. What is the second number?', 'R1.3 Q2', false, number(12, '12'), '3 became 9: what was it multiplied by?', boardModel([], [
  { title: 'Find the multiplier', say: '3 became 9, so it was multiplied by 3.', rows: ['9 ÷ 3 = 3'] },
  { title: 'Multiply the 4', say: 'Multiply the other part by the same number.', rows: ['4 × 3 = 12', '! 12'] },
]), slips(12, [[10, 'Scaling multiplies, it doesn’t add: 3 × 3 = 9, so 4 × 3 = 12.']]))
practice(scaling, 'A recipe uses flour and butter in the ratio 5 : 2. How much butter goes with 300 g of flour?', 'R1.3 Q3', true, number(120, '120 g'), '5 parts of flour are 300 g: find 1 part first.', ratioModel(bars(['Flour', 5], ['Butter', 2]), [
  { title: 'Find 1 part', say: '5 parts of flour are 300 g, so 1 part is 60 g.', rows: ['300 ÷ 5 = 60'], ratio: { each: '60', note: '1 part = 60 g' } },
  { title: 'The butter', say: 'Butter is 2 parts.', rows: ['2 × 60 = 120', '! 120 g'], ratio: { each: '60', rings: [whole(1, 2)], lit: [1] }, tags: [undefined, '120 g'] },
]), slips(120, [[750, 'Butter is the smaller part: divide 300 by 5 first, then multiply by 2.'], [60, 'That’s 1 part. Butter is 2 parts.'], [297, 'Scaling multiplies, it doesn’t add or take away.']]))
practice(scaling, 'Red and white paint are mixed in the ratio 3 : 8. Ali uses 40 litres of white paint. How much red paint does he use?', 'R1.3 Q4', true, number(15, '15 litres'), '8 parts of white are 40 litres.', ratioModel(bars(['Red', 3], ['White', 8]), [
  { title: 'Find 1 part', say: '8 parts of white are 40 litres, so 1 part is 5 litres.', rows: ['40 ÷ 8 = 5'], ratio: { each: '5', note: '1 part = 5 litres' } },
  { title: 'The red', say: 'Red is 3 parts.', rows: ['3 × 5 = 15', '! 15 litres'], ratio: { each: '5', rings: [whole(0, 3)], lit: [0] }, tags: ['15 l'] },
]), slips(15, [[5, 'That’s 1 part. Red is 3 parts.'], [120, '40 litres is the white, 8 parts. Divide by 8 first.'], [35, 'Scaling multiplies, it doesn’t add or take away.']]))
practice(scaling, 'Concrete is made from cement, sand and gravel in the ratio 1 : 2 : 4. A builder uses 18 kg of sand. What is the total mass of the concrete?', 'R1.3 Q5', true, number(63, '63 kg'), 'Sand is 2 parts, so find 1 part first.', ratioModel(bars(['Cement', 1], ['Sand', 2], ['Gravel', 4]), [
  { title: 'Find 1 part', say: 'Sand is 2 parts and weighs 18 kg, so 1 part is 9 kg.', rows: ['18 ÷ 2 = 9'], ratio: { each: '9', rings: [whole(1, 2)], note: '1 part = 9 kg' } },
  { title: 'Every part', say: 'Cement is 1 part, gravel is 4 parts.', rows: ['1 × 9 = 9', '4 × 9 = 36'], ratio: { each: '9' }, tags: ['9', '18', '36'] },
  { title: 'Add them up', say: 'The total is all three together.', rows: ['9 + 18 + 36 = 63', '! 63 kg'], ratio: { each: '9', note: '7 parts = 63 kg' } },
]), slips(63, [[36, 'That’s the gravel. The question asks for all of the concrete.'], [126, 'Sand is 2 parts, so 1 part is 18 ÷ 2 = 9 kg.'], [45, 'Add all three: 9 + 18 + 36.']]))

/* ---------- Rung 4: part to whole (R1.4) ---------- */

const fruit = worked(partWhole, 'The ratio of oranges to all the fruit in a bag is 3 : 8. The rest are apples. Write the ratio of oranges to apples.', 'Oranges : all the fruit = 3 : 8', 'R1.4 video + Q1', ratioModel(bars(['Oranges', 3], ['Apples', 5]), [
  { title: 'The 8 is the whole bag', say: 'The 8 includes the 3 oranges. So 3/8 of the fruit are oranges.', rows: ['> oranges are {3|8} of the fruit'], ratio: { rings: [whole(0, 3)], note: '8 pieces in total' }, tags: ['3'] },
  { title: 'Calculate the apples', say: 'The apples are what is left of the 8: 8 − 3 = 5. Check: 3 + 5 = 8.', rows: ['8 − 3 = 5'], ratio: { rings: [whole(1, 5)], lit: [1], note: '3 + 5 = 8 pieces in total' }, tags: ['3', '5'] },
  { title: 'Compare the oranges with the apples', say: 'Now compare oranges with apples. A part : part ratio never includes the whole.', rows: ['! oranges : apples = 3 : 5'], ratio: { note: '3 + 5 = 8 pieces in total' } },
]), 'Our aim: in a part : whole ratio, the whole includes the part. Take the part away from the whole to find the other part.')
video(fruit, media('part-whole', 'Oranges : all the fruit = 3 : 8', 'R1.4_Part_To_Whole_Ratios.mp4', 52, [
  'A bag of fruit: the ratio of oranges to all the fruit is 3 : 8. The rest are apples. The 8 is the whole bag, and it includes the 3 oranges.',
  'Part a, a fraction of the whole: part over whole, so 3/8 of the fruit are oranges.',
  'Part b, how many are apples? The apples are what’s left of the 8: 8 − 3 = 5. 3 + 5 = 8 pieces of fruit.',
  'Oranges to apples: 3 : 5. A part : part ratio never includes the whole.',
  'Where you see it: in a bag of 40 sweets, sour sweets : all sweets = 3 : 8. 40 ÷ 8 = 5, so 3 × 5 = 15 sour sweets and 40 − 15 = 25 others.',
  'Part : whole includes the part. Whole take away part gives the other part. Part over whole is the fraction.',
]))
practice(partWhole, 'The ratio of boys to the whole class is 4 : 9. What fraction of the class are girls?', 'R1.4 Q2', false, fraction('5/9'), 'The 9 is the whole class, boys included.', boardModel([], [
  { title: 'Calculate the girls', say: 'The 9 is the whole class, so the girls are what is left.', rows: ['9 − 4 = 5'] },
  { title: 'Write the girls as a fraction of the class', say: 'Girls are 5 of every 9.', rows: ['! {5|9} are girls'] },
]))
practice(partWhole, 'The ratio of red sweets to all the sweets in a jar is 2 : 7. Write the ratio of red sweets to other sweets.', 'R1.4 Q3', false, ratio([2, 5]), 'The 7 includes the red sweets.', boardModel([], [
  { title: 'Calculate the other sweets', say: 'The 7 is all the sweets, red included.', rows: ['7 − 2 = 5'] },
  { title: 'Compare the red sweets with the other sweets', say: 'Red compared with the others.', rows: ['! red : others = 2 : 5'] },
]), ratioSlips([2, 5], [[[2, 7], 'That’s red to all the sweets. The others are 7 − 2 = 5.'], [[2, 9], 'The 7 already includes the red sweets: take 2 away, don’t add.']]))
practice(partWhole, '2/5 of the counters in a bag are blue. The rest are red. Write the ratio of blue to red counters.', 'R1.4 Q4', false, ratio([2, 3]), '2 out of every 5 are blue.', boardModel([], [
  { title: 'Calculate the red counters', say: '2 out of every 5 counters are blue, so the other 3 are red.', rows: ['5 − 2 = 3'] },
  { title: 'Compare the blue counters with the red ones', say: 'Blue compared with red.', rows: ['! blue : red = 2 : 3'] },
]), ratioSlips([2, 3], [[[2, 5], 'That’s blue to all the counters. The red are 5 − 2 = 3.']]))
practice(partWhole, 'A bag has 40 sweets. The ratio of sour sweets to all the sweets is 3 : 8. How many sweets are not sour?', 'R1.4 Q5', false, number(25, '25 sweets'), 'The 8 parts are all 40 sweets.', boardModel([], [
  { title: 'Find 1 part', say: 'All 40 sweets are 8 parts.', rows: ['40 ÷ 8 = 5'] },
  { title: 'Calculate the sour sweets', say: 'Sour sweets are 3 parts.', rows: ['3 × 5 = 15'] },
  { title: 'Calculate the sweets that are not sour', say: 'Take the sour sweets away from all of them.', rows: ['40 − 15 = 25', '! 25 sweets'] },
]), slips(25, [[15, 'That’s the sour sweets. The question asks for the others.'], [16, 'The 8 is all the sweets, not the other sweets: 40 ÷ 8 = 5, then 3 × 5 = 15 sour.'], [5, 'That’s 1 part.']]))

/* ---------- Rung 5: sharing an amount (R1.5) ---------- */

const people = bars(['Ana', 2], ['Ben', 3], ['Cal', 4])
const share = pounds(worked(sharing, 'Ana, Ben and Cal share £720 in the ratio 2 : 3 : 4. How much does Ana get?', 'Share £720 in the ratio 2 : 3 : 4. How much for Ana?', 'R1.5 video + Q1', ratioModel(people, [
  { title: 'Add the parts', say: 'Count every block in every bar.', rows: ['2 + 3 + 4 = 9'], ratio: { note: '9 parts = £720' } },
  { title: 'Find 1 part', say: 'Share the £720 equally between the 9 parts.', rows: ['720 ÷ 9 = 80'], ratio: { each: '80', note: '1 part = £80' } },
  { title: 'Ana’s share', say: 'Ana has 2 parts, and each part is £80.', rows: ['2 × 80 = 160', '! Ana gets £160'], ratio: { each: '80', rings: [whole(0, 2)], lit: [0] }, tags: ['£160'] },
]), 'Our aim: add the parts, divide the amount by the total to find 1 part, then multiply by each person’s parts.'))
video(share, media('sharing', 'Share £720 in the ratio 2 : 3 : 4', 'R1.5_Dividing_Amounts_Into_Ratios.mp4', 51, [
  'Sharing £720: Ana, Ben and Cal share £720 in the ratio 2 : 3 : 4. How much does Ana get?',
  'Step 1, total parts: 2 + 3 + 4 = 9, so 9 parts = £720.',
  'Step 2, find 1 part: 720 ÷ 9 = 80, so 1 part = £80.',
  'Step 3, Ana’s share: Ana has 2 parts. 2 × 80 = 160, so Ana gets £160.',
  'Check it: Ben gets 3 × 80 = 240, Cal gets 4 × 80 = 320, and 160 + 240 + 320 = 720. The shares add back to the total.',
  'Add the parts, divide the amount by the total parts, and multiply 1 part by each share.',
]))
practice(sharing, 'Divide 42 in the ratio 2 : 5.', 'R1.5 Q2', true, pair(['first', 'second'], [12, 30], '12 and 30'), '2 + 5 = 7 parts.', ratioModel(bars(['First', 2], ['Second', 5]), [
  { title: 'Find 1 part', say: 'There are 2 + 5 = 7 parts, and they make 42.', rows: ['42 ÷ 7 = 6'], ratio: { each: '6', note: '1 part = 6' } },
  { title: 'Each share', say: 'Multiply 1 part by each number in the ratio.', rows: ['2 × 6 = 12', '5 × 6 = 30', '! 12 and 30'] , ratio: { each: '6' }, tags: ['12', '30'] },
]))
pounds(practice(sharing, 'Kim and Lee share £96 in the ratio 5 : 3. How much does Lee get?', 'R1.5 Q3', true, number(36, '£36'), '5 + 3 = 8 parts.', ratioModel(bars(['Kim', 5], ['Lee', 3]), [
  { title: 'Find 1 part', say: 'There are 5 + 3 = 8 parts, and they make £96.', rows: ['96 ÷ 8 = 12'], ratio: { each: '12', note: '1 part = £12' } },
  { title: 'Lee’s share', say: 'Lee has 3 parts.', rows: ['3 × 12 = 36', '! Lee gets £36'], ratio: { each: '12', rings: [whole(1, 3)], lit: [1] }, tags: [undefined, '£36'] },
]), slips(36, [[60, 'That’s Kim’s share. The question asks for Lee’s.'], [32, 'Divide by the total parts, 8, not by 3.'], [12, 'That’s 1 part. Lee has 3 parts.']])))
pounds(practice(sharing, 'Lucy buys 40 tiles. Blue and white tiles are in the ratio 3 : 2. Blue tiles cost £2.50 each and white tiles cost £1.80 each. How much does she spend?', 'R1.5 Q4', true, number(88.8, '£88.80'), 'Find how many tiles of each colour first.', ratioModel(bars(['Blue', 3], ['White', 2]), [
  { title: 'Find 1 part', say: 'There are 3 + 2 = 5 parts, and they make 40 tiles.', rows: ['40 ÷ 5 = 8'], ratio: { each: '8', note: '1 part = 8 tiles' } },
  { title: 'Tiles of each colour', say: 'Blue is 3 parts and white is 2 parts.', rows: ['3 × 8 = 24', '2 × 8 = 16'], ratio: { each: '8' }, tags: ['24', '16'] },
  { title: 'The cost', say: 'Multiply each number of tiles by its price, then add.', rows: ['24 × 2.50 = 60', '16 × 1.80 = 28.80', '60 + 28.80 = 88.80', '! £88.80'] },
]), slips(88.8, [[60, 'That’s the blue tiles. Add the white tiles too.'], [28.8, 'That’s the white tiles. Add the blue tiles too.'], [86, 'Find how many tiles of each colour first: 24 blue and 16 white.']])))
pounds(practice(sharing, 'Mia gets £250. She saves 20% and spends the rest on games, clothes and food in the ratio 5 : 2 : 1. How much does she spend on games?', 'R1.5 Q5', true, number(125, '£125'), 'Take off the 20% first, then share the rest.', ratioModel(bars(['Games', 5], ['Clothes', 2], ['Food', 1]), [
  { title: 'Take off the savings', say: 'She saves 20%, so she spends 80% of £250.', rows: ['250 × 0.8 = 200'], ratio: { note: '8 parts = £200' } },
  { title: 'Find 1 part', say: 'There are 5 + 2 + 1 = 8 parts.', rows: ['200 ÷ 8 = 25'], ratio: { each: '25', note: '1 part = £25' } },
  { title: 'Games', say: 'Games are 5 parts.', rows: ['5 × 25 = 125', '! £125 on games'], ratio: { each: '25', rings: [whole(0, 5)], lit: [0] }, tags: ['£125'] },
]), slips(125, [[156.25, 'Take off the 20% savings first: she shares £200, not £250.'], [25, 'That’s 1 part. Games are 5 parts.']])))

add('mixed', 'Ratios', 'R1.1-R1.5 consolidation', text(
  'Part over part compares the two: 4 : 5 means 4/5 as many red as blue. Part over the total is the fraction of the whole: 4/9 are red.',
  'Simplify by dividing every part by the highest common factor. Make the units the same first.',
  'Scale by finding the multiplier from the part you know, then multiplying every part by it.',
  'In a part : whole ratio, the whole includes the part: whole take away part gives the other part.',
  'To share an amount: add the parts, divide to find 1 part, then multiply by each share.',
))

export const tutorRatioBasicsLesson: TutorMethodLesson = {
  id: 'L037', number: 37, title: 'Ratios', level: 'GCSE Foundation',
  goal: 'Write a ratio as a fraction, simplify and scale ratios, use part to whole ratios, and share an amount in a ratio.',
  labels: { [fractions]: 'Ratios as fractions', [simplifying]: 'Simplifying', [scaling]: 'Scaling', [partWhole]: 'Part to whole', [sharing]: 'Sharing an amount', mixed: 'Review' },
  steadyPictures: true,
  states: finish(),
}

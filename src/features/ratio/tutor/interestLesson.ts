import { working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import type { GrowthFrame } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState, TutorMethodVisual, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { boardModel, choose, number, text, type BoardMove } from '../../simultaneous-equations/tutor/boardWorkings'

/*
 * Lesson 34 (Ratio R5): Simple interest, compound growth and decay, from Aniksha's R5.1–R5.4 PDFs and videos. Four
 * rungs in the PDFs' order: simple interest, compound growth, compound decay, and finding the number of years. One
 * method for the compound rungs, as in the videos: the multiplier is 100% plus the rise (or minus the fall) as a
 * decimal, multiplied once for each year, or original × multiplier^years. A working that goes year by year draws the
 * videos' bars above the A5 board (GrowthPictures.tsx), one bar a year, faint until its year is worked out.
 */

const { add, finish } = author(34)
const simple = 'simple-interest'
const growth = 'compound-growth'
const decay = 'compound-decay'
const periods = 'compound-periods'

/* ---------- The bars ---------- */

type Bar = [name: string, value: number, shown?: string]
/** A move on the board, and how far along the bars it reaches: bars 0 to `reach` are worked out. */
type BarMove = BoardMove & { reach?: number }
const pounds2 = (value: number) => `£${Number.isInteger(value) ? value : value.toFixed(2)}`

/** The board working with the bars drawn above it: it opens on the start bar, the years faint. */
function barsModel(bars: Bar[], moves: BarMove[], label = 'Work it out'): TutorWorking {
  const model = boardModel([], moves, label)
  if (model.kind !== 'method-worked') throw new Error('A growth working is a board')
  const top = Math.max(...bars.map(([, value]) => value))
  const frame = (reach: number, lit?: number): Omit<GrowthFrame, 'before'> => ({
    bars: bars.map(([name, value, shown], i) => ({ name, value, reached: i <= reach, ...(i <= reach ? { shown: shown ?? pounds2(value) } : {}) })),
    top, ...(lit !== undefined ? { lit } : {}),
  })
  let reach = 0
  model.examples[0].steps.forEach((step, i) => {
    const next = moves[i].reach ?? reach
    step.frame.growth = { ...frame(next, next > reach ? next : undefined), ...(i === 0 ? { before: frame(0) } : {}) }
    reach = next
  })
  return model
}
const years = (start: number, values: number[], first = 'start', each = (n: number) => `year ${n}`): Bar[] =>
  [[first, start], ...values.map((value, i): Bar => [each(i + 1), value])]

/* ---------- Screens ---------- */

function workingSteps(visual: TutorWorking) {
  return visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
}
/** A question: its bars above the answer when its working has them (or its words), and the working once answered. */
function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null) {
  faded(model)
  const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
  const opening = model.kind === 'method-worked' ? model.examples[0].steps[0]?.frame.growth?.before : undefined
  const visual: TutorMethodVisual = opening ? { kind: 'growth', growth: opening } : text(title)
  const state = add(topic, title, sourceRef, visual, interaction, working(answer, ...workingSteps(model)), hint)
  state.working = model
  if (diagnose) state.diagnose = diagnose
  return state
}
/** Sunny (8 Oct): every finished row greys out, since a step here rarely works on just the row above it. */
function faded(model: TutorWorking) {
  if (model.kind === 'method-worked') model.examples.forEach(example => { example.focus = 'all' })
  return model
}
function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
  faded(model)
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}
function video(state: TutorMethodState, definition: NonNullable<TutorMethodState['video']>) { state.video = definition }
const media = (name: string, title: string, sourceFile: string, durationSeconds: number, textAlternative: string[]) => ({
  id: `lesson34-${name}`, src: `/media/lesson-34/${name}.mp4`, poster: `/media/lesson-34/${name}.svg`, title, durationSeconds, sourceFile, textAlternative,
})
/** A slip that isn't a whole number is also caught when it is typed rounded, to 2 or 1 decimal places. */
const rounded = (list: Slip[]): Slip[] => list.flatMap(([wrong, note]) => [[wrong, note], [Math.round(wrong * 100) / 100, note], [Math.round(wrong * 10) / 10, note]])
const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response, right, rounded(list))
const pounds = (state: TutorMethodState) => { state.answerPrefix = '£'; return state }
const percent = (state: TutorMethodState) => { state.answerPrefix = '%'; return state }
/** The multiplier from a rise or a fall, as its own move. */
const multiplierMove = (change: number, rise: boolean, say: string): BoardMove => {
  const kept = rise ? 100 + change : 100 - change
  return { title: 'The multiplier', say, rows: [`100% ${rise ? '+' : '−'} ${change}% = ${kept}%`, `${kept} ÷ 100 = ${kept / 100}`] }
}

/* ---------- Rung 1: simple interest (R5.1) ---------- */

const savings = worked(simple, 'Mia puts £800 into a savings account. The account pays 5% simple interest per year. How much money is in the account after 3 years?', '£800 at 5% simple interest. How much after 3 years?', 'R5.1 video + Q1', barsModel(years(800, [840, 880, 920]), [
  { title: 'Interest for 1 year', say: 'Simple interest is the same every year, always worked out on the ORIGINAL £800. Find 1%, then multiply by 5.', rows: ['800 ÷ 100 = 8', '5 × 8 = 40 each'] },
  { title: 'Interest for 3 years', say: '3 years of £40 each.', rows: ['3 × 40 = 120 total'] },
  { title: 'Add it on', say: 'Add the interest to the original. Each year is £40 more: £840, £880, £920.', rows: ['800 + 120 = 920', '! £920'], reach: 3 },
]), 'Our aim: find 1 year’s interest on the original, multiply by the years, then add it on.')
video(savings, media('simple', '£800 at 5% simple interest for 3 years', 'R5.1_Simple_Interest.mp4', 96, [
  'A savings account: Mia saves £800 at 5% simple interest per year. How much is there after 3 years?',
  'What is simple interest? Interest is extra money the bank gives you for saving. SIMPLE interest: the same amount is added every year, and it is always worked out on the ORIGINAL £800. We want the total after 3 years.',
  'See it year by year: start with £800, then + £40 each year: £840, £880, £920. The same step up every time: that is simple interest.',
  'Interest for 1 year: find 5% of £800. 10% is £80, so 5% is half of that: 5% of £800 = £40. £40 interest each year. Every year it is £40 again: it never grows.',
  'Interest for 3 years: 3 years is 3 lots of £40. 3 years × £40 each = £120 total interest. Year 1: £40, year 2: £40, year 3: £40.',
  'Total in the account: add the interest to the original. £800 + £120 = £920, so there is £920 after 3 years. Simple is the same every year; compound is different (next unit).',
  'Where you see it: £800 saved at 5% simple interest. £40 is added every year: £840, £880, £920. 800 + 3 × 40 = 920.',
  'Well done: find the % of the ORIGINAL, multiply by the number of years, and add it on. The answer is £920.',
]))
pounds(practice(simple, '£500 is invested at 4% simple interest per year. How much interest is earned in 1 year?', 'R5.1 Q2', number(20, '£20'), 'Find 1% of £500, then multiply by 4.', boardModel([], [
  { title: 'Find 1%', say: 'Divide by 100 to find 1% of £500.', rows: ['500 ÷ 100 = 5'] },
  { title: 'Multiply by 4', say: '4% is 4 lots of 1%.', rows: ['4 × 5 = 20', '! £20'] },
]), slips(20, [[520, 'That’s the total in the account. The question asks for the interest.'], [125, '4% is 4 lots of 1%: 1% of £500 is £5, so 4 × 5.'], [200, '4% of £500 is £20: 1% is £5, not £50.']])))
pounds(practice(simple, 'Jay borrows £1200 at 6% simple interest per year. He pays it back after 2 years. How much does he pay back in total?', 'R5.1 Q3', number(1344, '£1344'), 'Find the interest for 1 year, double it, then add the £1200.', barsModel(years(1200, [1272, 1344]), [
  { title: 'Interest for 1 year', say: 'Simple interest is on the original £1200 every year. 1% is £12, so 6% is 6 × 12.', rows: ['1200 ÷ 100 = 12', '6 × 12 = 72 each'] },
  { title: 'Interest for 2 years', say: '2 years of £72 each.', rows: ['2 × 72 = 144 total'] },
  { title: 'Add it on', say: 'He pays back the £1200 and the interest.', rows: ['1200 + 144 = 1344', '! £1344'], reach: 2 },
]), slips(1344, [[144, 'That’s the interest. He pays back the £1200 too.'], [1272, 'That’s 1 year. He borrows for 2 years: 2 × 72.'], [1348.32, 'Simple interest is on the original £1200 every year: £72 each year.']])))
pounds(practice(simple, 'Priya saves £2500 at 3% simple interest per year. How much is in the account after 4 years?', 'R5.1 Q4a', number(2800, '£2800'), 'Find 1 year’s interest, multiply by 4, then add the £2500.', barsModel(years(2500, [2575, 2650, 2725, 2800]), [
  { title: 'Interest for 1 year', say: 'Find 1% of £2500, then multiply by 3.', rows: ['2500 ÷ 100 = 25', '3 × 25 = 75 each'] },
  { title: 'Interest for 4 years', say: '4 years of £75 each.', rows: ['4 × 75 = 300 total'] },
  { title: 'Add it on', say: 'Add the interest to the original £2500.', rows: ['2500 + 300 = 2800', '! £2800'], reach: 4 },
]), slips(2800, [[300, 'That’s the interest. Add the £2500 too.'], [2575, 'That’s 1 year. Multiply the £75 by 4 years.'], [2500 * 1.03 ** 4, 'Simple interest is on the original £2500 every year: £75 each year.']])))
practice(simple, 'Priya earns £75 interest each year. How many years will it take for the interest to reach £450?', 'R5.1 Q4b', number(6, '6 years'), 'Divide the target by the interest each year.', boardModel([], [
  { title: 'Divide by each year', say: 'Each year adds £75. How many lots of £75 make £450?', rows: ['450 ÷ 75 = 6', '! 6 years'] },
]), slips(6, [[150, 'Divide by the £75 earned each year, not by the 3%.'], [5, '5 years earns 5 × 75 = £375. 450 ÷ 75 = 6.']]))
percent(practice(simple, 'An account pays simple interest. £1500 grows to £1680 in 3 years. Work out the interest rate per year.', 'R5.1 Q5a', number(4, '4%'), 'Find the total interest, then the interest each year, then write it as a % of £1500.', boardModel([], [
  { title: 'Interest each year', say: 'Find the total interest, then share it over the 3 years.', rows: ['1680 − 1500 = 180 total', '180 ÷ 3 = 60 each'] },
  { title: 'As a % of £1500', say: 'Divide by the original £1500, then multiply by 100.', rows: ['60 ÷ 1500 × 100 = 4', '! 4%'] },
]), slips(4, [[12, 'That’s the interest over all 3 years. Divide by 3 first: £60 each year.'], [60, 'That’s the interest each year in pounds. Write it as a % of £1500.'], [60 / 1680 * 100, 'Divide by the original £1500, not £1680.']])))
pounds(practice(simple, 'The account pays £60 interest each year on £1500. How much would be in the account after 10 years?', 'R5.1 Q5b', number(2100, '£2100'), '10 years of £60 each, then add the original.', boardModel([], [
  { title: 'Interest for 10 years', say: '10 years of £60 each.', rows: ['10 × 60 = 600 total'] },
  { title: 'Add it on', say: 'Add the interest to the original £1500.', rows: ['1500 + 600 = 2100', '! £2100'] },
]), slips(2100, [[600, 'That’s the interest. Add the £1500 too.'], [1500 * 1.04 ** 10, 'Simple interest is £60 every year: 10 × 60, then add £1500.'], [16800, 'The interest is £60 a year on the £1500: 1500 + 10 × 60.']])))
practice(simple, 'Ben says, “With simple interest, the interest I get in year 2 is bigger than in year 1, because I have more money.” Is Ben correct?', 'R5.1 Q5c', choose(
  'No: simple interest is always on the original amount, so it is the same every year',
  ['Yes: there is more money in year 2', 'That’s compound interest. Simple interest is always worked out on the original amount.'],
  ['No: the interest gets smaller each year', 'It stays the same: the same % of the same original amount.'],
), 'Think about what simple interest is worked out on.', boardModel([], [
  { title: 'The same every year', say: 'Simple interest is always worked out on the ORIGINAL amount. Mia’s £800 at 5% earns £40 in year 1 and £40 again in year 2.', rows: ['800 ÷ 100 × 5 = 40', '> year 2: still £40', '! Ben is wrong'] },
], 'Why'))

/* ---------- Rung 2: compound growth (R5.2) ---------- */

const leo = worked(growth, 'Leo puts £2000 into a savings account paying 3% compound interest per year. How much is in the account after 2 years?', '£2000 at 3% compound interest. How much after 2 years?', 'R5.2 video + Q1', barsModel(years(2000, [2060, 2121.8]), [
  multiplierMove(3, true, 'Compound interest: each year the 3% is worked out on the NEW total. Keep the 100% and add 3%, then write it as a decimal.'),
  { title: 'Year 1', say: 'Multiply the £2000 by 1.03.', rows: ['2000 × 1.03 = 2060'], reach: 1 },
  { title: 'Year 2', say: 'Multiply the NEW total by 1.03 again. This year’s interest is £61.80, more than £60.', rows: ['2060 × 1.03 = 2121.80', '! £2121.80'], reach: 2 },
]), 'Our aim: find the multiplier, then multiply by it once for every year.')
video(leo, media('growth', '£2000 at 3% compound interest for 2 years', 'R5.2_Compound_Growth.mp4', 104, [
  'Interest on interest: Leo saves £2000 at 3% compound interest per year. How much after 2 years?',
  'What is compound interest? COMPOUND interest: each year the 3% is worked out on the NEW total, so you get interest on last year’s interest too. The amount added grows a little every year. We want the total after 2 years.',
  'See it year by year: start with £2000. Year 1 adds £60, to £2060. Year 2 adds £61.80, a bit more, because it is 3% of a bigger number: £2121.80.',
  'Year 1: 3% of £2000. 1% is £20, so 3% is £60. £2000 + £60 = £2060. The quick way: 100% + 3% = 103% = 1.03, and £2000 × 1.03 = £2060. After year 1: £2060.',
  'Year 2, interest on the interest: 3% of the NEW total £2060, not of £2000. £2060 × 1.03 = £2121.80. This year’s interest was £61.80, more than £60. After year 2: £2121.80.',
  'The quick formula: × 1.03 twice is the same as × 1.03². £2000 × 1.03² = £2121.80. The formula is original × (multiplier) ^ years. 10 years would be £2000 × 1.03¹⁰, one calculator press.',
  'Where you see it: £2000 at 3% compound interest. Year 1: × 1.03 = £2060. Year 2: × 1.03 again = £2121.80. 2000 × 1.03² = 2121.80.',
  'Well done: the multiplier is 1 + the decimal. Multiply year after year, or original × multiplier ^ years. The answer is £2121.80.',
]))
pounds(practice(growth, '£400 is saved at 10% compound interest per year. How much is there after 2 years?', 'R5.2 Q2', number(484, '£484'), 'The multiplier is 1.1. Multiply by it twice.', barsModel(years(400, [440, 484]), [
  multiplierMove(10, true, 'Keep the 100% and add 10%, then write it as a decimal.'),
  { title: 'Year 1', say: 'Multiply the £400 by 1.1.', rows: ['400 × 1.1 = 440'], reach: 1 },
  { title: 'Year 2', say: 'Multiply the NEW total by 1.1 again.', rows: ['440 × 1.1 = 484', '! £484'], reach: 2 },
]), slips(484, [[480, 'That adds £40 twice: simple interest. Year 2’s 10% is on £440.'], [440, 'That’s 1 year. Multiply by 1.1 again.'], [84, 'That’s the interest. The question asks how much there is.']])))
practice(growth, 'A town’s population is 15,000. It grows by 2% each year. Work out the population after 3 years, to the nearest whole number.', 'R5.2 Q3', number(15918, '15,918'), 'The multiplier is 1.02. Multiply by it 3 times: 15,000 × 1.02³.', boardModel([], [
  multiplierMove(2, true, 'Keep the 100% and add 2%, then write it as a decimal.'),
  { title: 'Use the power', say: '3 years is × 1.02 three times, which is × 1.02³. Round to the nearest whole number.', rows: ['15000 × 1.02³ = 15918.12', '! 15,918'] },
]), slips(15918, [[15900, 'That adds 2% of 15,000 three times: simple interest. Multiply by 1.02 three times.'], [15300, 'That’s 1 year. Use 1.02³ for 3 years.'], [15918.12, 'Round to the nearest whole number: 15,918 people.']]))
pounds(practice(growth, 'Amira invests £3500 at 4% compound interest per year. Work out the value after 5 years, to the nearest penny.', 'R5.2 Q4a', number(4258.29, '£4258.29'), 'The multiplier is 1.04. Use 3500 × 1.04⁵.', boardModel([], [
  multiplierMove(4, true, 'Keep the 100% and add 4%, then write it as a decimal.'),
  { title: 'Use the power', say: '5 years is × 1.04⁵. Round to the nearest penny: the 5 after 4258.28 rounds up.', rows: ['3500 × 1.04⁵ = 4258.285…', '! £4258.29'] },
]), slips(4258.29, [[4200, 'That’s simple interest: £140 each year. Multiply by 1.04 five times.'], [4258.28, 'Round 4258.285… to the nearest penny: the next digit is 5, so it rounds up to £4258.29.'], [4258.27, 'Work out 3500 × 1.04⁵ again: it is 4258.285…, so £4258.29.'], [3640, 'That’s 1 year. Use 1.04⁵ for 5 years.']])))
pounds(practice(growth, 'Amira’s £3500 grew to £4258.29. How much interest did she earn in total?', 'R5.2 Q4b', number(758.29, '£758.29'), 'Final value minus the original.', boardModel([], [
  { title: 'Final minus original', say: 'The interest is what she has now minus what she put in.', rows: ['4258.29 − 3500 = 758.29', '! £758.29'] },
]), slips(758.29, [[4258.29, 'That’s the value. Take off the £3500 she put in.'], [700, 'That’s simple interest. Use the compound value: 4258.29 − 3500.']])))
pounds(practice(growth, 'A car park’s charge is £6 per day. It goes up by 5% each year for 3 years. Work out the charge after 3 years, to the nearest penny.', 'R5.2 Q5a', number(6.95, '£6.95'), 'The multiplier is 1.05. Use 6 × 1.05³.', boardModel([], [
  multiplierMove(5, true, 'Keep the 100% and add 5%, then write it as a decimal.'),
  { title: 'Use the power', say: '3 years is × 1.05³. Round to the nearest penny.', rows: ['6 × 1.05³ = 6.945…', '! £6.95'] },
]), slips(6.95, [[6.9, 'That adds 5% of £6 three times. Multiply by 1.05 three times.'], [6.3, 'That’s 1 year. Use 1.05³.'], [6.94, 'Round 6.945… to the nearest penny: £6.95.']])))
practice(growth, 'Explain why the car park charge after 3 years is not simply 6 × 1.15.', 'R5.2 Q5b', choose(
  'Each year’s 5% is of a bigger charge, so the rises get bigger',
  ['6 × 1.15 is right: 3 × 5% = 15%', '6 × 1.15 adds 5% of £6 three times. Compound adds 5% of the new charge each year.'],
  ['Because 1.05³ is smaller than 1.15', '1.05³ = 1.157…, a bit bigger than 1.15: each rise is on a bigger amount.'],
), 'Compare simple and compound.', boardModel([], [
  { title: 'Compare', say: '6 × 1.15 only adds the same 5% of £6 three times. Compound works out each 5% on the new, bigger charge.', rows: ['6 × 1.15 = 6.90', '6 × 1.05³ = 6.945…', '> each 5% is of a bigger amount', '! The rises grow'] },
], 'Why'))
pounds(practice(growth, 'Sam says that £1000 at 3% compound interest for 2 years gives £1060. Work it out with compound interest: how much is there after 2 years?', 'R5.2 Q5c', number(1060.9, '£1060.90'), 'Multiply by 1.03, then by 1.03 again.', barsModel(years(1000, [1030, 1060.9]), [
  { title: 'Year 1', say: 'Multiply the £1000 by 1.03.', rows: ['1000 × 1.03 = 1030'], reach: 1 },
  { title: 'Year 2', say: 'Multiply the NEW total by 1.03 again. Sam used simple interest: year 2 earns interest on the £30 too.', rows: ['1030 × 1.03 = 1060.90', '> not £1060: Sam is wrong', '! £1060.90'], reach: 2 },
]), slips(1060.9, [[1060, 'That’s Sam’s simple interest. Year 2’s 3% is on £1030.'], [1030, 'That’s 1 year. Multiply by 1.03 again.']])))

/* ---------- Rung 3: compound decay (R5.3) ---------- */

const car = worked(decay, 'A car costs £12,000 new. Its value falls by 20% every year. Work out its value after 2 years.', '£12,000, loses 20% a year. Its value after 2 years.', 'R5.3 video + Q1', barsModel(years(12000, [9600, 7680]), [
  multiplierMove(20, false, 'Decay: the value goes DOWN each year, and the 20% is taken off the NEW value. It keeps 100% − 20% = 80%.'),
  { title: 'Year 1', say: 'Multiply the £12,000 by 0.8. It lost £2400.', rows: ['12000 × 0.8 = 9600'], reach: 1 },
  { title: 'Year 2', say: 'Keep 80% of the NEW value. It lost £1920 this year, less than £2400.', rows: ['9600 × 0.8 = 7680', '! £7680'], reach: 2 },
]), 'Our aim: find the multiplier for what is left, then multiply by it once for every year.')
video(car, media('decay', '£12,000 losing 20% a year for 2 years', 'R5.3_Compound_Decay.mp4', 104, [
  'A car loses value: a car costs £12000 and loses 20% of its value every year. What is it worth after 2 years?',
  'What is compound decay? Decay means the value goes DOWN each year. Compound: each year the 20% is taken off the NEW value, so the amount it loses gets smaller each year. We want the value after 2 years.',
  'See it year by year: start at £12000. Year 1 loses £2400, to £9600. Year 2 loses £1920, a smaller drop, because it is 20% of a smaller number: £7680.',
  'Year 1: it keeps 100% − 20% = 80% of its value. 80% = 0.8. £12000 × 0.8 = £9600. It lost £2400 in year 1. After year 1: £9600.',
  'Year 2: 80% of the NEW value £9600. £9600 × 0.8 = £7680. It lost £1920 this year, less than £2400. After year 2: £7680.',
  'The quick formula: × 0.8 twice is the same as × 0.8². £12000 × 0.8² = £7680. Decay: the multiplier is LESS than 1 (1 − the decimal). Sense check: £7680 is less than £12000.',
  'Where you see it: a £12000 car loses 20% a year. Year 1: × 0.8 = £9600. Year 2: × 0.8 again = £7680. 12000 × 0.8² = 7680.',
  'Well done: the multiplier is 1 − the decimal. Multiply year after year, or original × multiplier ^ years. The answer is £7680.',
]))
pounds(practice(decay, 'A phone worth £500 loses 10% of its value each year. What is it worth after 2 years?', 'R5.3 Q2', number(405, '£405'), 'It keeps 90% = 0.9 each year. Multiply by 0.9 twice.', barsModel(years(500, [450, 405]), [
  multiplierMove(10, false, 'It loses 10%, so it keeps 100% − 10% = 90%.'),
  { title: 'Year 1', say: 'Multiply the £500 by 0.9.', rows: ['500 × 0.9 = 450'], reach: 1 },
  { title: 'Year 2', say: 'Keep 90% of the NEW value.', rows: ['450 × 0.9 = 405', '! £405'], reach: 2 },
]), slips(405, [[400, 'That takes £50 off twice. Year 2’s 10% is of £450.'], [450, 'That’s 1 year. Multiply by 0.9 again.'], [95, 'That’s the value lost. The question asks what it is worth.']])))
practice(decay, 'A lake has 8000 fish. The number falls by 15% each year. How many fish are there after 3 years, to the nearest whole number?', 'R5.3 Q3', number(4913, '4913 fish'), 'The multiplier is 0.85. Use 8000 × 0.85³.', boardModel([], [
  multiplierMove(15, false, 'It falls by 15%, so it keeps 100% − 15% = 85%.'),
  { title: 'Use the power', say: '3 years is × 0.85 three times, which is × 0.85³.', rows: ['8000 × 0.85³ = 4913', '! 4913 fish'] },
]), slips(4913, [[4400, 'That takes 15% of 8000 off three times. Multiply by 0.85 three times.'], [6800, 'That’s 1 year. Use 0.85³ for 3 years.'], [12167, 'The number falls: the multiplier is 0.85, not 1.15.']]))
pounds(practice(decay, 'A van is bought for £24,000. It depreciates by 25% in the first year and by 12% in the second year. Work out its value after 2 years.', 'R5.3 Q4a', number(15840, '£15,840'), 'A different multiplier each year: 0.75, then 0.88.', barsModel(years(24000, [18000, 15840]), [
  { title: 'Year 1', say: '25% off leaves 75%: multiply by 0.75.', rows: ['24000 × 0.75 = 18000'], reach: 1 },
  { title: 'Year 2', say: '12% off leaves 88%: multiply the NEW value by 0.88.', rows: ['18000 × 0.88 = 15840', '! £15,840'], reach: 2 },
]), slips(15840, [[15120, 'That takes 37% of £24,000 off. The 12% comes off £18,000.'], [18000, 'That’s 1 year. Take 12% off too: × 0.88.'], [13500, 'The second year is 12%, not 25%: × 0.88.']])))
percent(practice(decay, 'The van went from £24,000 to £15,840. Work out the total percentage decrease over the 2 years.', 'R5.3 Q4b', number(34, '34%'), 'Write the final value as a fraction of the original, then take it from 100%.', boardModel([], [
  { title: 'Compare with the original', say: 'Divide the final value by the original: 0.66 is 66% of it left.', rows: ['15840 ÷ 24000 = 0.66'] },
  { title: 'The decrease', say: '66% is left, so the rest has gone.', rows: ['100 − 66 = 34', '! 34%'] },
]), slips(34, [[37, '25% + 12% isn’t right here: the 12% is of £18,000. Work out 15840 ÷ 24000.'], [66, 'That’s the part left. Take it from 100%.'], [0.66, 'That’s the part left as a decimal: 66%. The decrease is 100 − 66.']])))
practice(decay, 'A medicine dose of 200 mg leaves the body at 30% per hour. How much is left after 4 hours? Give your answer to 1 decimal place.', 'R5.3 Q5a', number(48, '48.0 mg'), 'It keeps 70% = 0.7 each hour. Use 200 × 0.7⁴.', boardModel([], [
  multiplierMove(30, false, '30% leaves each hour, so 100% − 30% = 70% stays.'),
  { title: 'Use the power', say: '4 hours is × 0.7⁴. Round to 1 decimal place.', rows: ['200 × 0.7⁴ = 48.02', '! 48.0 mg'] },
]), slips(48, [[48.02, 'Give it to 1 decimal place: 48.0 mg.'], [140, 'That’s 1 hour. Use 0.7⁴ for 4 hours.'], [1.62, 'Multiply by what stays, 0.7, not by the 0.3 that leaves.']]))
practice(decay, 'The 200 mg dose keeps 70% each hour. After how many whole hours is less than 50 mg left?', 'R5.3 Q5b', number(4, '4 hours'), 'Try 3 hours and 4 hours: 200 × 0.7³ and 200 × 0.7⁴.', boardModel([], [
  { title: 'Try 3 hours', say: 'After 3 hours there is still more than 50 mg.', rows: ['200 × 0.7³ = 68.6', '> more than 50'] },
  { title: 'Try 4 hours', say: 'After 4 hours it is under 50 mg for the first time.', rows: ['200 × 0.7⁴ = 48.02', '! 4 hours'] },
]), slips(4, [[3, 'After 3 hours 68.6 mg is left, still more than 50.'], [5, 'After 4 hours it is already 48.0 mg, less than 50.']]))
practice(decay, 'Nia says, “If a car loses 20% a year, after 5 years it has lost 100% and is worth nothing.” Why is Nia wrong?', 'R5.3 Q5c', choose(
  'Each 20% is of a smaller value, so the car never reaches £0',
  ['She is right: 5 × 20% = 100%', 'Each year it keeps 80% of what is left: a £12,000 car is still worth £3932.16 after 5 years.'],
  ['It loses more than 20% each year', 'It loses 20% of a smaller value each year, so less money each year.'],
), 'Check with the £12,000 car: 12000 × 0.8⁵.', boardModel([], [
  { title: 'Check with £12,000', say: 'Each year it keeps 80% of what is left, so 5 years is × 0.8⁵.', rows: ['12000 × 0.8⁵ = 3932.16', '> still worth £3932.16', '! Nia is wrong'] },
], 'Why'))

/* ---------- Rung 4: finding the number of years (R5.4) ---------- */

const rent = worked(periods, 'Rent is £800 a month. It rises by 5% every year. After how many years will the rent first be more than £1000 a month?', '£800 rising 5% a year. When is it over £1000?', 'R5.4 video + Q1', barsModel(years(800, [1, 2, 3, 4, 5].map(n => 800 * 1.05 ** n), 'now', n => String(n)).map(([name, value]): Bar => [name, value, `£${Math.floor(value)}`]), [
  multiplierMove(5, true, 'This time the number of years, n, is the mystery. A 5% rise is a multiplier of 1.05 each year.'),
  { title: 'Try n = 3', say: 'Try values of n until the rent goes over £1000. Each year the rent is × 1.05: £840, £882, £926.', rows: ['800 × 1.05³ = 926.10', '> too low'], reach: 3 },
  { title: 'Try n = 4', say: 'Still under £1000: getting close. One more.', rows: ['800 × 1.05⁴ = 972.41', '> too low'], reach: 4 },
  { title: 'Try n = 5', say: 'Over £1000 for the first time. n = 4 was under, n = 5 is over, so it takes 5 years.', rows: ['800 × 1.05⁵ = 1021.03', '! 5 years'], reach: 5 },
]), 'Our aim: try values of n, and stop at the first one that goes over.')
video(rent, media('periods', '£800 rising 5% a year: when is it over £1000?', 'R5.4_Finding_The_Number_Of_Periods.mp4', 112, [
  'A rising rent: rent is £800 a month and rises 5% a year. After how many years is it over £1000? £800 × 1.05ⁿ > £1000.',
  'How many years? This time the number of years, n, is the mystery. A 5% rise is a multiplier of 1.05 each year. We want the smallest n that makes the rent go over £1000. Method: try values of n until it works (trial and improvement).',
  'See it year by year: each year the rent is × 1.05: £840, £882, £926, £972 … still under £1000. Year 5: £1021, over £1000 for the first time.',
  'Try some values of n: n = 1: £800 × 1.05 = £840, too low. n = 2: £800 × 1.05² = £882, too low. Still under £1000, so keep going.',
  'Try n = 3 and n = 4: n = 3: £800 × 1.05³ = £926.10, too low. n = 4: £800 × 1.05⁴ = £972.41, too low. Getting close: one more.',
  'n = 5: £800 × 1.05⁵ = £1021.03, over £1000. So n = 5 years: n = 4 was under, n = 5 is over, so it takes 5 years. Tip: on a calculator, × 1.05 then press = again and again, and count the presses.',
  'Where you see it: rent of £800 rising 5% a year first passes £1000 after 5 years (£1021.03). 800 × 1.05⁵ = 1021.03.',
  'Well done: set up original × multiplier ^ n, try n = 1, 2, 3 …, and stop at the first one that works. The answer is 5 years.',
]))
practice(periods, '£100 is saved at 10% compound interest per year. After how many years is there more than £120?', 'R5.4 Q2', number(2, '2 years'), 'Multiply by 1.1 each year until it is over £120.', barsModel(years(100, [110, 121]), [
  { title: 'Year 1', say: '10% interest: multiply by 1.1.', rows: ['100 × 1.1 = 110', '> not more than £120'], reach: 1 },
  { title: 'Year 2', say: 'Multiply by 1.1 again: over £120 for the first time.', rows: ['110 × 1.1 = 121', '! 2 years'], reach: 2 },
]), slips(2, [[1, 'After 1 year there is £110, not more than £120.'], [3, 'After 2 years there is £121, already more than £120.']]))
practice(periods, 'A town has 20,000 people. The population grows by 4% each year. After how many whole years will it first be above 23,000?', 'R5.4 Q3', number(4, '4 years'), 'The multiplier is 1.04. Try n = 3 and n = 4.', boardModel([], [
  multiplierMove(4, true, 'A 4% rise each year: keep the 100% and add 4%.'),
  { title: 'Try n = 3', say: 'After 3 years it is still below 23,000.', rows: ['20000 × 1.04³ = 22497.28', '> too low'] },
  { title: 'Try n = 4', say: 'After 4 years it is above 23,000 for the first time.', rows: ['20000 × 1.04⁴ = 23397.17', '! 4 years'] },
]), slips(4, [[3, 'After 3 years it is 22,497, still below 23,000.'], [5, 'After 4 years it is already 23,397, above 23,000.'], [3.75, 'That adds 800 people every year: simple growth. Try n = 3 and n = 4 with 1.04.']]))
practice(periods, 'A car worth £15,000 loses 18% of its value each year. After how many years will it first be worth less than £8000?', 'R5.4 Q4a', number(4, '4 years'), 'The multiplier is 0.82. Try n = 3 and n = 4.', boardModel([], [
  multiplierMove(18, false, 'It loses 18%, so it keeps 100% − 18% = 82%.'),
  { title: 'Try n = 3', say: 'After 3 years it is still worth more than £8000.', rows: ['15000 × 0.82³ = 8270.52', '> still more than £8000'] },
  { title: 'Try n = 4', say: 'After 4 years it is worth less than £8000 for the first time.', rows: ['15000 × 0.82⁴ = 6781.83', '! 4 years'] },
]), slips(4, [[3, 'After 3 years it is £8270.52, still more than £8000.'], [5, 'After 4 years it is already £6781.83, less than £8000.']]))
practice(periods, 'Explain how you know 3 years is not enough for the £15,000 car to be worth less than £8000.', 'R5.4 Q4b', choose(
  'After 3 years it is £8270.52, still more than £8000',
  ['After 3 years it is less than £8000', '15000 × 0.82³ = £8270.52, more than £8000.'],
  ['3 × 18% = 54% off is not enough', 'Work it out with the multiplier: 15000 × 0.82³ = £8270.52.'],
), 'Look at the n = 3 value.', boardModel([], [
  { title: 'Look at n = 3', say: 'Work out the value after 3 years and compare it with £8000.', rows: ['15000 × 0.82³ = 8270.52', '> more than £8000', '! Not enough at 3'] },
], 'Why'))
practice(periods, 'Jade saves £1500 at 6% compound interest. She wants £2000. How many whole years will she have to wait?', 'R5.4 Q5a', number(5, '5 years'), 'The multiplier is 1.06. Try n = 4 and n = 5.', boardModel([], [
  multiplierMove(6, true, 'A 6% rise each year: keep the 100% and add 6%.'),
  { title: 'Try n = 4', say: 'After 4 years she still has less than £2000.', rows: ['1500 × 1.06⁴ = 1893.72', '> too low'] },
  { title: 'Try n = 5', say: 'After 5 years she has more than £2000 for the first time.', rows: ['1500 × 1.06⁵ = 2007.34', '! 5 years'] },
]), slips(5, [[4, 'After 4 years she has £1893.72, still under £2000.'], [6, 'After 5 years she has £2007.34, already over £2000.'], [500 / 90, 'That’s simple interest. Try n = 4 and n = 5 with 1.06.']]))
practice(periods, 'Would Jade reach £2000 any quicker at 7% interest?', 'R5.4 Q5b', choose(
  'No: at 7% it still takes 5 years',
  ['Yes: 4 years', '1500 × 1.07⁴ = £1966.19, still under £2000.'],
  ['Yes: 3 years', 'After 4 years at 7% it is £1966.19, still under £2000.'],
), 'Try n = 4 at 7%: 1500 × 1.07⁴.', boardModel([], [
  { title: 'Try n = 4 and n = 5', say: 'At 7% the multiplier is 1.07. After 4 years it is still under £2000.', rows: ['1500 × 1.07⁴ = 1966.19', '1500 × 1.07⁵ = 2103.83', '> 4 years is still too low', '! No, still 5 years'] },
], 'Check'))
pounds(practice(periods, 'Kai says, “5% a year means it takes 20 years to double, because 20 × 5% = 100%.” Show that Kai is wrong: how much is £100 worth after 20 years at 5% compound interest?', 'R5.4 Q5c', number(265.33, '£265.33'), 'Work out 100 × 1.05²⁰.', boardModel([], [
  { title: 'Use the power', say: '20 years at 5% is × 1.05²⁰. That is far more than double: it doubles in about 15 years.', rows: ['100 × 1.05²⁰ = 265.33', '> far more than double', '! £265.33'] },
]), slips(265.33, [[200, 'That’s simple interest: £5 a year. Compound: 100 × 1.05²⁰.'], [105, 'That’s 1 year. Use 1.05²⁰.']])))

add('mixed', 'Interest, growth and decay', 'R5.1-R5.4 consolidation', text(
  'Simple interest: the same amount every year, on the original. £800 at 5% earns £40 a year: 800 + 3 × 40 = £920.',
  'Compound growth: the multiplier is 100% + the rise as a decimal. Multiply once a year: 2000 × 1.03² = £2121.80.',
  'Compound decay: the multiplier is what is left. 20% off a year is × 0.8: 12000 × 0.8² = £7680.',
  'How many years? Try n = 1, 2, 3 … and stop at the first one that works.',
))

export const tutorInterestLesson: TutorMethodLesson = {
  id: 'L034', number: 34, title: 'Interest, growth and decay', level: 'GCSE Foundation',
  goal: 'Work out simple interest, compound growth and decay with a multiplier, and find how many years it takes to pass a target.',
  labels: { [simple]: 'Simple interest', [growth]: 'Compound growth', [decay]: 'Compound decay', [periods]: 'Finding the number of years', mixed: 'Review' },
  steadyPictures: true,
  states: finish(),
}

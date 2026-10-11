import { author } from '../../written-methods/tutor/content'
import type { FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { tilesFig } from './chancePictures'

/*
 * Probability and statistics lesson 8: Mean, median, mode and range. From P8 in Sunny's revision book (p182–184),
 * with the book's three examples (nine test scores, a range of ten values, the basketball player who left) and Your
 * Turn questions, and some of our own numbers. Four rungs: the mean (sum ÷ how many, pulled by an outlier); the median
 * and mode (in order, cross off from both ends, or the most common value); the range (a spread, not an average); and
 * using the mean backwards, from totals (Example 3, Your Turn Q4 and Q5). The first rung opens on the chance board,
 * where you drag one value and watch the four numbers move. Data is drawn as tiles: the middle lit, values crossed off
 * greyed out, answers in green.
 *
 * Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(308)
const { add, finish } = lesson
const { worked, practice, ask, play } = chanceScreens(lesson)
const mean = 'average-mean'
const middle = 'average-median-mode'
const spread = 'average-range'
const applied = 'average-applied'

/** Data as tiles: `tones` by place in the list; one tone for several places. */
const tiles = (values: number[], spoken: string, tones: [number[], FigureTone][] = [], caption?: string, perRow?: number) => {
  const t: Partial<Record<number, FigureTone>> = {}
  for (const [places, tone] of tones) for (const k of places) t[k] = tone
  return tilesFig(values.map(String), spoken, { tones: t, caption, ...(perRow ? { perRow } : {}) })
}
const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, k) => from + k)
const sorted = (values: number[]) => [...values].sort((a, b) => a - b)

/* ---------- Rung 1: the mean ---------- */

play(mean, 'Drag a value and watch the averages', 'P8 p182 Averages (play)', { mode: 'average' })
{
  const scores = [56, 79, 77, 48, 90, 68, 79, 92, 71]
  const say = 'Nine test scores.'
  const p = tiles(scores, say)
  worked(mean, 'Find the mean of these nine test scores, to 1 decimal place.', 'The mean', 'P8 p183 Example 1 (book’s numbers)', boardModel([], [
    { title: 'Add them all', say: 'Add every score together.', rows: ['Total = 56 + 79 + … + 71 = 660'], picture: tiles(scores, say, [[range(0, 8), 'lit']]) },
    { title: 'Divide by how many', say: 'There are 9 scores, so share the total between 9.', rows: ['660 ÷ 9 = 73.33…', '! Mean = 73.3'], picture: tiles(scores, say, [[range(0, 8), 'lit']], 'Mean = 73.3') },
  ], 'Mean', p), 'The mean is the total of the values divided by how many values there are. An outlier, a value far from the rest, pulls the mean towards it.')
}
{
  const values = [4, 7, 9, 12, 8], say = 'Five numbers: 4, 7, 9, 12 and 8.'
  const p = tiles(values, say)
  practice(mean, 'Find the mean of these numbers.', 'P8 p182 (own numbers)', p, number(8, '8'), 'Add them, then divide by how many.', boardModel([], [
    { title: 'Add them all', say: 'Add the five numbers.', rows: ['Total = 4 + 7 + 9 + 12 + 8 = 40'], picture: tiles(values, say, [[range(0, 4), 'lit']]) },
    { title: 'Divide by how many', say: 'There are 5 numbers.', rows: ['40 ÷ 5 = 8', '! Mean = 8'], picture: tiles(values, say, [[range(0, 4), 'lit']], 'Mean = 8') },
  ], 'Mean', p), slips(8, [[40, 'That’s the total. Divide it by how many numbers: 5.'], [10, 'There are 5 numbers, not 4.']]), { label: 'Mean', prefix: 'Mean =' })
}
const times = [0.25, 0.34, 0.39, 0.38, 0.39, 1.67, 0.28, 0.30, 0.42, 0.46]
const timesSay = 'Ten reaction times in seconds.'
{
  const p = tiles(times, timesSay, [], undefined, 5)
  practice(mean, 'Find the mean of these ten reaction times, in seconds.', 'P8 Your Turn Q3 (book’s numbers)', p, number(0.488, '0.488 s'), 'Add them, then divide by 10.', boardModel([], [
    { title: 'Add them all', say: 'Add the ten times.', rows: ['Total = 0.25 + 0.34 + … + 0.46 = 4.88'], picture: tiles(times, timesSay, [[range(0, 9), 'lit']], undefined, 5) },
    { title: 'Divide by how many', say: 'There are 10 times.', rows: ['4.88 ÷ 10 = 0.488', '! Mean = 0.488 s'], picture: tiles(times, timesSay, [[range(0, 9), 'lit']], 'Mean = 0.488 s', 5) },
  ], 'Mean', p), slips(0.488, [[4.88, 'That’s the total. Divide by 10.'], [0.39, 'That’s the mode, the most common time. The mean shares out the total.']]), { label: 'Mean time (s)', prefix: 'Mean =' })
}
{
  const p = tiles(times, timesSay, [[[5], 'lit']], undefined, 5)
  practice(mean, 'Leave out the outlier, 1.67 s. What happens to the mean?', 'P8 Your Turn Q3 (book’s numbers)', p, choose('It goes down, to 0.357 s',
    ['It goes up', '1.67 is far bigger than the rest. Taking it out lowers the mean.'], ['It stays the same', 'Every value counts in the mean, so removing one changes it.']),
  'Is 1.67 bigger or smaller than the other times?', boardModel([], [
    { title: 'Take out the outlier', say: '1.67 is far bigger than the others. Take it from the total, and count 9 times now.', rows: ['4.88 − 1.67 = 3.21'], picture: tiles(times, timesSay, [[[5], 'faint']], undefined, 5) },
    { title: 'The new mean', say: '3.21 shared between 9 is smaller than before.', rows: ['3.21 ÷ 9 = 0.357 (3 dp)', '! It goes down, to 0.357 s'], picture: tiles(times, timesSay, [[[5], 'faint']], 'Mean = 0.357 s', 5) },
  ], 'Mean', p))
}

/* ---------- Rung 2: median and mode ---------- */

{
  const scores = sorted([56, 79, 77, 48, 90, 68, 79, 92, 71])
  const say = 'The nine test scores in order.'
  const p = tiles([56, 79, 77, 48, 90, 68, 79, 92, 71], 'Nine test scores.')
  worked(middle, 'Find the median and the mode of the nine test scores.', 'Median and mode', 'P8 p183 Example 1 (book’s numbers)', boardModel([], [
    { title: 'Put them in order', say: 'Write the scores from smallest to biggest.', rows: ['>0 48, 56, 68, 71, 77, 79, 79, 90, 92'], picture: tiles(scores, say) },
    { title: 'Cross off both ends', say: 'Cross off one from each end until one is left in the middle. With 9 values, it’s the (9 + 1) ÷ 2 = 5th.', rows: ['Median = 5th value = 77'], picture: tiles(scores, say, [[[0, 1, 2, 3, 5, 6, 7, 8], 'faint'], [[4], 'lit']]) },
    { title: 'Most common value', say: '79 appears twice; every other score once. That’s the mode.', rows: ['! Median = 77, mode = 79'], picture: tiles(scores, say, [[[4], 'found'], [[5, 6], 'found']], 'Median 77, mode 79') },
  ], 'Median', p), 'The median is the middle value once they’re in order: cross off from both ends, or find the (n + 1) ÷ 2th value. An outlier doesn’t move it. The mode is the most common value; there can be two (bimodal), or none.')
}
{
  const heights = [163, 185, 164, 170, 188, 154, 168, 179], order = sorted(heights)
  const say = 'Eight heights in centimetres.'
  const p = tiles(heights, say)
  practice(middle, 'Find the median of these eight heights, in centimetres.', 'P8 Your Turn Q2 (book’s numbers)', p, number(169, '169 cm'), 'Put them in order. With 8 values there are two in the middle.', boardModel([], [
    { title: 'Put them in order', say: 'Smallest to biggest.', rows: ['>0 154, 163, 164, 168, 170, 179, 185, 188'], picture: tiles(order, say) },
    { title: 'Cross off both ends', say: 'Three off each end leaves two in the middle: 168 and 170.', rows: ['Middle = 168 and 170'], picture: tiles(order, say, [[[0, 1, 2, 5, 6, 7], 'faint'], [[3, 4], 'lit']]) },
    { title: 'Halfway between', say: 'The median is halfway between the two middle values.', rows: ['(168 + 170) ÷ 2 = 169', '! Median = 169 cm'], picture: tiles(order, say, [[[0, 1, 2, 5, 6, 7], 'faint'], [[3, 4], 'found']], 'Median = 169 cm') },
  ], 'Median', p), slips(169, [[168, 'There are two middle values, 168 and 170. Go halfway between.'], [170, 'There are two middle values, 168 and 170. Go halfway between.'], [188, 'Put them in order first.']]), { label: 'Median (cm)', prefix: 'Median =' })
}
{
  const values = [15, 4, 21, 9, 12], order = sorted(values), say = 'Five numbers.'
  const p = tiles(values, say)
  practice(middle, 'Find the median of these numbers.', 'P8 p182 (own numbers)', p, number(12, '12'), 'Put them in order first.', boardModel([], [
    { title: 'Put them in order', say: 'Smallest to biggest.', rows: ['>0 4, 9, 12, 15, 21'], picture: tiles(order, say) },
    { title: 'Cross off both ends', say: 'Two off each end leaves 12.', rows: ['! Median = 12'], picture: tiles(order, say, [[[0, 1, 3, 4], 'faint'], [[2], 'found']], 'Median = 12') },
  ], 'Median', p), slips(12, [[21, 'That’s the middle of the list as it’s given. Put them in order first.'], [12.2, 'That’s the mean. The median is the middle value.']]), { label: 'Median', prefix: 'Median =' })
}
const sales = [280, 350, 320, 400, 350, 490, 590, 470, 280, 410, 350]
const salesSay = 'Eleven values.'
{
  const p = tiles(sales, salesSay)
  practice(middle, 'Find the mode of these values.', 'P8 Your Turn Q1 (book’s numbers)', p, number(350, '350'), 'Which value comes up most often?', boardModel([], [
    { title: 'Count each value', say: '350 appears three times; 280 twice; the rest once.', rows: ['>0 350 three times, 280 twice'], picture: tiles(sales, salesSay, [[[1, 4, 10], 'lit']]) },
    { title: 'Most common value', say: '350 comes up most often.', rows: ['! Mode = 350'], picture: tiles(sales, salesSay, [[[1, 4, 10], 'found']], 'Mode = 350') },
  ], 'Mode', p), slips(350, [[280, '280 appears twice, but 350 appears three times.'], [3, 'That’s how many times it appears. The mode is the value itself.']]), { label: 'Mode', prefix: 'Mode =' })
}
{
  const values = [2, 4, 4, 7, 7, 9], say = 'Six numbers: 2, 4, 4, 7, 7 and 9.'
  const p = tiles(values, say)
  practice(middle, 'What is the mode of these numbers?', 'P8 p182 (own numbers)', p, choose('4 and 7: it’s bimodal',
    ['4', '7 appears twice too. Two values tie, so there are two modes.'], ['There is no mode', 'There is: 4 and 7 both appear twice.'], ['5.5', 'That’s the median. The mode is the most common value.']),
  'Count how often each one appears.', boardModel([], [
    { title: 'Count each value', say: '4 and 7 each appear twice; 2 and 9 once. Two values tie for most common.', rows: ['! Modes = 4 and 7'], picture: tiles(values, say, [[[1, 2, 3, 4], 'found']], 'Bimodal: 4 and 7') },
  ], 'Mode', p))
}

/* ---------- Rung 3: the range ---------- */

{
  const values = [12, 8, 4, 16, 15, 15, 5, 15, 10, 8], say = 'Ten values.'
  const p = tiles(values, say)
  worked(spread, 'Find the range of these values.', 'The range', 'P8 p183 Example 2 (book’s numbers)', boardModel([], [
    { title: 'Biggest and smallest', say: 'The biggest value is 16 and the smallest is 4.', rows: ['Biggest = 16, smallest = 4'], picture: tiles(values, say, [[[2, 3], 'lit']]) },
    { title: 'Take them away', say: 'Biggest take smallest.', rows: ['16 − 4 = 12', '! Range = 12'], picture: tiles(values, say, [[[2, 3], 'found']], 'Range = 12') },
  ], 'Range', p), 'The range is the biggest value take away the smallest. It isn’t an average: it says how spread out the data is. An outlier makes it much bigger.')
}
{
  const p = tiles(sales, salesSay)
  practice(spread, 'Find the range of these values.', 'P8 Your Turn Q1 (book’s numbers)', p, number(310, '310'), 'Biggest take smallest.', boardModel([], [
    { title: 'Biggest and smallest', say: 'The biggest is 590 and the smallest is 280.', rows: ['Biggest = 590, smallest = 280'], picture: tiles(sales, salesSay, [[[6, 0, 8], 'lit']]) },
    { title: 'Take them away', say: 'Biggest take smallest.', rows: ['590 − 280 = 310', '! Range = 310'], picture: tiles(sales, salesSay, [[[6, 0, 8], 'found']], 'Range = 310') },
  ], 'Range', p), slips(310, [[870, 'Take the smallest away, don’t add it.'], [240, 'That’s 590 − 350, the mode. Use the smallest value, 280.']]), { label: 'Range', prefix: 'Range =' })
}
{
  const values = [2.4, 3.1, 1.8, 2.9, 2.2], say = 'Five weights in kilograms.'
  const p = tiles(values, say)
  practice(spread, 'Find the range of these weights, in kilograms.', 'P8 p182 (own numbers)', p, number(1.3, '1.3 kg'), 'Find the biggest and the smallest first.', boardModel([], [
    { title: 'Biggest and smallest', say: 'The biggest is 3.1 kg and the smallest is 1.8 kg.', rows: ['Biggest = 3.1, smallest = 1.8'], picture: tiles(values, say, [[[1, 2], 'lit']]) },
    { title: 'Take them away', say: 'Biggest take smallest.', rows: ['3.1 − 1.8 = 1.3', '! Range = 1.3 kg'], picture: tiles(values, say, [[[1, 2], 'found']], 'Range = 1.3 kg') },
  ], 'Range', p), slips(1.3, [[0.2, 'That’s the first take the last. Use the biggest and smallest.'], [4.9, 'Take the smallest away, don’t add it.']]), { label: 'Range (kg)', prefix: 'Range =' })
}
{
  const values = [12, 8, 4, 16, 15, 40], say = 'Six values; the last is 40.'
  const p = tiles(values, say, [[[5], 'lit']])
  practice(spread, 'The range of 12, 8, 4, 16 and 15 is 12. Add an outlier, 40. What happens to the range?', 'P8 p182 Outliers (own numbers)', p, choose('It goes up a lot, to 36',
    ['It stays at 12', 'The biggest value is now 40, so the range changes.'], ['It goes down', 'A bigger biggest value makes the range bigger.']),
  'What’s the biggest value now?', boardModel([], [
    { title: 'New biggest value', say: 'The biggest is now 40; the smallest is still 4.', rows: ['40 − 4 = 36', '! It goes up, to 36'], picture: tiles(values, say, [[[2], 'lit'], [[5], 'found']], 'Range = 36') },
  ], 'Range', p))
}

/* ---------- Rung 4: using the mean ---------- */

worked(applied, 'Five basketball players score a mean of 12 points. One player leaves, and the mean of the other four is 10. How many points did the player who left score?', 'Using the mean', 'P8 p183 Example 3 (book’s numbers)', boardModel([], [
  { title: 'Total for five', say: 'Mean × how many gives the total.', rows: ['Total = 5 × 12 = 60'] },
  { title: 'Total for four', say: 'The four who stayed scored a mean of 10.', rows: ['Total = 4 × 10 = 40'] },
  { title: 'The difference', say: 'The player who left scored the points that went missing.', rows: ['60 − 40 = 20', '! Player who left = 20 points'] },
], 'Points'), 'Turn a mean back into a total: total = mean × how many. Compare totals to find a missing value.')
ask(applied, 'Seven planks have a mean length of 1.35 m. An eighth plank makes the mean 1.4 m. How long is the eighth plank?', 'P8 Your Turn Q4 (book’s numbers)', ['7 planks: mean 1.35 m', '8 planks: mean 1.4 m'], number(1.75, '1.75 m'), 'Find both totals: mean × how many.', boardModel([], [
  { title: 'Total for seven', say: 'Mean × how many.', rows: ['Total = 7 × 1.35 = 9.45'] },
  { title: 'Total for eight', say: 'With the eighth plank.', rows: ['Total = 8 × 1.4 = 11.2'] },
  { title: 'The difference', say: 'The extra length is the eighth plank.', rows: ['11.2 − 9.45 = 1.75', '! Eighth plank = 1.75 m'] },
], 'Length'), slips(1.75, [[0.05, 'That’s the difference between the means. Compare the totals.'], [1.4, 'That’s the new mean. Compare the totals.']]), { label: 'Length (m)', prefix: 'Plank =' })
ask(applied, 'Four numbers have a mean of 6. A fifth number makes the mean 7. What is the fifth number?', 'P8 p183 Example 3 (own numbers)', ['4 numbers: mean 6', '5 numbers: mean 7'], number(11, '11'), 'Find both totals: mean × how many.', boardModel([], [
  { title: 'Total for four', say: 'Mean × how many.', rows: ['Total = 4 × 6 = 24'] },
  { title: 'Total for five', say: 'With the fifth number.', rows: ['Total = 5 × 7 = 35'] },
  { title: 'The difference', say: 'The extra is the fifth number.', rows: ['35 − 24 = 11', '! Fifth number = 11'] },
], 'Number'), slips(11, [[1, 'That’s the difference between the means. Compare the totals.'], [7, 'That’s the new mean. Compare the totals.']]), { label: 'Number', prefix: 'Fifth =' })
const rowers = [63, 60, 57, 66, 62, 65, 69, 58]
{
  const say = 'Eight rowers’ weights in kilograms.'
  const p = tiles(rowers, say)
  practice(applied, 'Find the mean weight of the eight rowers, in kilograms.', 'P8 Your Turn Q5 (book’s numbers)', p, number(62.5, '62.5 kg'), 'Add them, then divide by 8.', boardModel([], [
    { title: 'Add them all', say: 'Add the eight weights.', rows: ['Total = 63 + 60 + … + 58 = 500'], picture: tiles(rowers, say, [[range(0, 7), 'lit']]) },
    { title: 'Divide by how many', say: 'There are 8 rowers.', rows: ['500 ÷ 8 = 62.5', '! Mean = 62.5 kg'], picture: tiles(rowers, say, [[range(0, 7), 'lit']], 'Mean = 62.5 kg') },
  ], 'Mean', p), slips(62.5, [[500, 'That’s the total. Divide by 8.'], [62, 'That’s rounded. 500 ÷ 8 is exactly 62.5.']]), { label: 'Mean (kg)', prefix: 'Mean =' })
}
ask(applied, 'Every rower gains 2% in weight. What is their new mean weight?', 'P8 Your Turn Q5 (book’s numbers)', ['Mean weight now: 62.5 kg', 'Each rower gains 2%'], number(63.75, '63.75 kg'), 'If every value goes up by 2%, so does the mean.', boardModel([], [
  { title: 'Find 2% of the mean', say: 'Every weight goes up by 2%, so the mean does too. 2% of 62.5 is 62.5 × 0.02.', rows: ['62.5 × 0.02 = 1.25'] },
  { title: 'Add it on', say: 'Add the gain to the old mean.', rows: ['62.5 + 1.25 = 63.75', '! New mean = 63.75 kg'] },
], 'Mean'), slips(63.75, [[64.5, 'That adds 2 kg. It’s 2%: 62.5 × 0.02 = 1.25.'], [1.25, 'That’s the gain. Add it on to 62.5.']]), { label: 'Mean (kg)', prefix: 'Mean =' })

add('mixed', 'Mean, median, mode and range', 'P8 consolidation', text(
  'Mean: add them up, divide by how many. An outlier pulls it.',
  'Median: put them in order and find the middle. An outlier doesn’t move it.',
  'Mode: the most common value. There can be two, or none.',
  'Range: biggest take smallest. It measures spread, not an average.',
))

export const tutorAveragesLesson: TutorMethodLesson = {
  id: 'L308', number: 308, title: 'Mean, median, mode and range', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Find the mean, median, mode and range, see what an outlier does, and use a mean to find a missing value.',
  labels: { [mean]: 'The mean', [middle]: 'Median and mode', [spread]: 'The range', [applied]: 'Using the mean', mixed: 'Review' },
  states: finish(),
}

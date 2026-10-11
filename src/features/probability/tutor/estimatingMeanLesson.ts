import { author } from '../../written-methods/tutor/content'
import type { FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { tableFig } from './chancePictures'

/*
 * Statistics lesson 14: Estimating the mean. From P14 in Sunny's revision book (p200–203): the four steps (midpoints,
 * f × m, add them up, divide by the total frequency), Cindy's video games (442 ÷ 57 = 7.75 hours), the 117 cats
 * (438.25 ÷ 117 = 3.7 kg), and Your Turn: Adam's journeys, Emily's long jump, the journeys to school, the fish, and
 * Suzanna's and Floella's darts.
 *
 * Three rungs: midpoints (the chart board's bars, with the estimated mean worked out from the midpoints as you drag);
 * the calculation, opened by a guess at why it is only an estimate; and problems (unequal classes, leaving out the
 * biggest fish, regrouping the darts). Every table is a measured table, its columns lit as each step uses them.
 *
 * The cats' last class is 4.5 < w ≤ 5 on p197 but 4.5 < w ≤ 6 on p201; the estimate uses p201's, as the book does.
 * Q5b says Floella groups in 20s (the brief said 10s): grouped in 20s her estimate is 2190 ÷ 85 = 25.8, so both round to
 * 26. Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(314)
const { add, finish } = lesson
const { worked, practice, ask, chartPlay, chart } = chanceScreens(lesson)
const mids = 'estmean-midpoints'
const calc = 'estmean-calc'
const problems = 'estmean-problems'

type Tones = [number, number, FigureTone][]
const fmt = (n: number) => Number(n.toFixed(2)).toString()
/**
 * A grouped table with as many of its working columns as a step has reached: 2 (class, f), 3 (+ midpoint) or 4
 * (+ f × m). `tones` light cells by [row, column]; rows count from 1 under the heading.
 */
function gt(head: string, classes: [string, number, number][], spoken: string, cols: 2 | 3 | 4 = 2, tones: Tones = []) {
  const heads = [head, 'f', 'm', 'f × m'].slice(0, cols)
  const rows = classes.map(([c, f, m]) => [c, String(f), fmt(m), fmt(f * m)].slice(0, cols))
  return tableFig([heads, ...rows], spoken, { tones })
}
const col = (rows: number, c: number, tone: FigureTone = 'lit'): Tones => Array.from({ length: rows }, (_, k) => [k + 1, c, tone] as [number, number, FigureTone])

/* ---------- Rung 1: midpoints ---------- */

const cindy: [string, number, number][] = [['0 < t ≤ 4', 12, 2], ['4 < t ≤ 8', 18, 6], ['8 < t ≤ 12', 19, 10], ['12 < t ≤ 16', 6, 14], ['16 < t ≤ 20', 2, 18]]
const cindySay = 'Hours of video games last week, 57 people: 12, 18, 19, 6 and 2 in the five classes.'
const cin = (cols: 2 | 3 | 4 = 2, tones: Tones = []) => gt('Time, t (h)', cindy, cindySay, cols, tones)

chartPlay(mids, 'Drag the bars. The estimated mean follows.', 'P14 p200 Estimating the mean (play)', { mode: 'bars', labels: ['0–4', '4–8', '8–12', '12–16', '16–20'], values: [12, 18, 19, 6, 2], max: 25, show: 'mean', xs: [2, 6, 10, 14, 18] })
practice(mids, 'Guess first: 12 people played between 0 and 4 hours. What one number best stands for all 12?', 'P14 p200 (guess first)', cin(2, [[1, 0, 'lit'], [1, 1, 'lit']]), choose('2 hours, the middle of the class',
  ['4 hours', 'Some played less than 4. Using the top of every class makes the estimate too big.'], ['0 hours', 'Some played nearly 4. Using the bottom of every class makes the estimate too small.']),
'We don’t know each person’s time. Which value is fairest?', boardModel([], [
  { title: 'Use the middle', say: 'Some are below the middle and some above, so the middle is the fairest guess.', rows: ['(0 + 4) ÷ 2 = 2', '! 2 hours, the midpoint'], picture: cin(3, [[1, 2, 'found']]) },
], 'Midpoint', cin()))
worked(mids, 'Find the midpoint of each of Cindy’s classes.', 'Midpoints', 'P14 p200 Example 1 (book’s numbers)', boardModel([], [
  { title: 'Add the two ends', say: 'For the last class, add the bottom and the top.', rows: ['16 + 20 = 36'], picture: cin(2, [[5, 0, 'lit']]) },
  { title: 'Halve it', say: 'Halfway between is half the sum.', rows: ['36 ÷ 2 = 18'], picture: cin(3, [[5, 2, 'found']]) },
  { title: 'Every class', say: 'Do the same for each class: a new column, m.', rows: ['! m = 2, 6, 10, 14, 18'], picture: cin(3, col(5, 2, 'found')) },
], 'Midpoints', cin()), 'The midpoint of a class is (bottom + top) ÷ 2. It stands in for every value in the class, since we don’t know them.')
{
  const cats: [string, number, number][] = [['2 < w ≤ 3', 22, 2.5], ['3 < w ≤ 3.5', 14, 3.25], ['3.5 < w ≤ 4', 39, 3.75], ['4 < w ≤ 4.5', 29, 4.25], ['4.5 < w ≤ 6', 13, 5.25]]
  const p = gt('Weight, w (kg)', cats, 'The weights of 117 cats: 22, 14, 39, 29 and 13 in the five classes.', 2, [[5, 0, 'lit']])
  practice(mids, 'What is the midpoint of the class 4.5 < w ≤ 6, in kilograms?', 'P14 p201 Example 2 (book’s numbers)', p, number(5.25, '5.25 kg'), 'Add the two ends and halve.', boardModel([], [
    { title: 'Add and halve', say: 'Bottom 4.5, top 6.', rows: ['4.5 + 6 = 10.5', '10.5 ÷ 2 = 5.25', '! m = 5.25 kg'] },
  ], 'Midpoint', p), slips(5.25, [[10.5, 'That’s the two ends added. Halve it.'], [1.5, 'That’s the width of the class. The midpoint is halfway between 4.5 and 6.']]), { label: 'Midpoint (kg)', prefix: 'm =' })
}
ask(mids, 'What is the midpoint of the class 100 < d ≤ 150, in centimetres?', 'P14 Your Turn Q2 (book’s numbers)', ['Long jump distances: 100 < d ≤ 150'], number(125, '125 cm'), 'Add the two ends and halve.', boardModel([], [
  { title: 'Add and halve', say: 'Bottom 100, top 150.', rows: ['100 + 150 = 250', '250 ÷ 2 = 125', '! m = 125 cm'] },
], 'Midpoint'), slips(125, [[250, 'That’s the two ends added. Halve it.'], [50, 'That’s the width of the class. The midpoint is halfway between.']]), { label: 'Midpoint (cm)', prefix: 'm =' })
ask(mids, 'What is the midpoint of the class 10 < t ≤ 14, in minutes?', 'P14 Your Turn Q3 (book’s numbers)', ['Journey times: 10 < t ≤ 14'], number(12, '12'), 'Classes don’t all have the same width. Still add the ends and halve.', boardModel([], [
  { title: 'Add and halve', say: 'Bottom 10, top 14.', rows: ['10 + 14 = 24', '24 ÷ 2 = 12', '! m = 12'] },
], 'Midpoint'), slips(12, [[4, 'That’s the width of the class. The midpoint is halfway between 10 and 14.'], [24, 'That’s the two ends added. Halve it.']]), { prefix: 'm =' })

/* ---------- Rung 2: the calculation ---------- */

practice(calc, 'Guess first: why can we only estimate the mean from Cindy’s table?', 'P14 p200 (guess first)', cin(), choose('We don’t know each person’s exact time',
  ['The frequencies might be wrong', 'The frequencies are exact counts. It’s the times inside each class we don’t know.'], ['We round the answer', 'Rounding at the end isn’t the reason. Even unrounded, the midpoints are only stand-ins for the real times.']),
'What has the table thrown away?', boardModel([], [
  { title: 'Lost values', say: 'The table says 12 people played 0 to 4 hours, not how long each played.', rows: ['>0 12 people: times somewhere in 0 to 4'], picture: cin(2, [[1, 0, 'lit'], [1, 1, 'lit']]) },
  { title: 'Midpoints stand in', say: 'We pretend all 12 played the midpoint, 2 hours. The real mean could be a little different.', rows: ['! We don’t know the exact times'] },
], 'Estimate', cin()))
worked(calc, 'Estimate the mean number of hours Cindy’s 57 people spent playing video games.', 'Estimating the mean', 'P14 p200 Example 1 (book’s numbers)', boardModel([], [
  { title: 'Step 1: midpoints', say: 'Add a column of midpoints, m.', rows: ['>0 m = 2, 6, 10, 14, 18'], picture: cin(3, col(5, 2)) },
  { title: 'Step 2: f × m', say: 'Multiply each frequency by its midpoint: an estimate of each class’s total hours.', rows: ['>0 24, 108, 190, 84, 36'], picture: cin(4, col(5, 3)) },
  { title: 'Step 3: add the columns', say: 'Add the f × m column, and the frequencies.', rows: ['Σfm = 24 + 108 + 190 + 84 + 36 = 442', 'Σf = 12 + 18 + 19 + 6 + 2 = 57'], picture: cin(4, [...col(5, 1), ...col(5, 3)]) },
  { title: 'Step 4: divide', say: 'Total hours ÷ total people.', rows: ['442 ÷ 57 = 7.754…', '! Estimated mean = 7.75 hours'], picture: cin(4, col(5, 3, 'found')) },
], 'Mean', cin()), 'Estimated mean = Σ(f × m) ÷ Σf: midpoints, times the frequencies, add up, divide by the total frequency. It’s only an estimate, since the midpoints stand in for the real values.')
{
  const cats: [string, number, number][] = [['2 < w ≤ 3', 22, 2.5], ['3 < w ≤ 3.5', 14, 3.25], ['3.5 < w ≤ 4', 39, 3.75], ['4 < w ≤ 4.5', 29, 4.25], ['4.5 < w ≤ 6', 13, 5.25]]
  const say = 'The weights of 117 cats: 22, 14, 39, 29 and 13 in the five classes.'
  const t = (cols: 2 | 3 | 4 = 2, tones: Tones = []) => gt('Weight, w (kg)', cats, say, cols, tones)
  practice(calc, 'Estimate the mean weight of the 117 cats, in kilograms, to 1 decimal place.', 'P14 p201 Example 2 (book’s numbers)', t(), number(3.7, '3.7 kg'), 'Midpoints, f × m, add up, divide by 117.', boardModel([], [
    { title: 'Midpoints and f × m', say: 'Midpoints 2.5, 3.25, 3.75, 4.25 and 5.25, each times its frequency.', rows: ['>0 55, 45.5, 146.25, 123.25, 68.25'], picture: t(4, col(5, 3)) },
    { title: 'Add up', say: 'Add the f × m column.', rows: ['Σfm = 438.25'], picture: t(4, col(5, 3)) },
    { title: 'Divide', say: 'Divide by the total frequency, 117 cats.', rows: ['438.25 ÷ 117 = 3.745…', '! 3.7 kg (1 dp)'], picture: t(4, col(5, 3, 'found')) },
  ], 'Mean', t()), slips(3.7, [[438.25, 'That’s Σ(f × m). Divide it by the 117 cats.'], [87.65, 'That divides by the 5 classes. Divide by the total frequency, 117.']]), { label: 'Mean (kg)', prefix: 'Mean =' })
}
{
  const adam: [string, number, number][] = [['0 < t ≤ 10', 2, 5], ['10 < t ≤ 20', 45, 15], ['20 < t ≤ 30', 25, 25], ['30 < t ≤ 40', 3, 35]]
  const say = 'Adam’s journey times to school in minutes: 2, 45, 25 and 3 in the four classes.'
  const t = (cols: 2 | 3 | 4 = 2, tones: Tones = []) => gt('Time, t (min)', adam, say, cols, tones)
  practice(calc, 'Estimate the mean time it takes Adam to get to school, to 1 decimal place.', 'P14 Your Turn Q1 (book’s numbers)', t(), number(18.9, '18.9'), 'Midpoints, f × m, add up, divide by the total frequency.', boardModel([], [
    { title: 'Midpoints and f × m', say: 'Midpoints 5, 15, 25 and 35.', rows: ['>0 10, 675, 625, 105'], picture: t(4, col(4, 3)) },
    { title: 'Add both columns', say: 'Total minutes, and total journeys.', rows: ['Σfm = 1415', 'Σf = 2 + 45 + 25 + 3 = 75'], picture: t(4, [...col(4, 1), ...col(4, 3)]) },
    { title: 'Divide', say: 'Total minutes ÷ journeys.', rows: ['1415 ÷ 75 = 18.86…', '! 18.9 minutes'], picture: t(4, col(4, 3, 'found')) },
  ], 'Mean', t()), slips(18.9, [[20, 'That’s the mean of the four midpoints. Weight each by its frequency.'], [353.75, 'That divides by the 4 classes. Divide by the 75 journeys.']]), { prefix: 'Mean =' })
}
{
  const emily: [string, number, number][] = [['0 < d ≤ 50', 4, 25], ['50 < d ≤ 100', 18, 75], ['100 < d ≤ 150', 56, 125], ['150 < d ≤ 200', 32, 175], ['200 < d ≤ 250', 8, 225]]
  const say = 'Long jump distances in centimetres: 4, 18, 56, 32 and 8 in the five classes.'
  const t = (cols: 2 | 3 | 4 = 2, tones: Tones = []) => gt('Distance, d (cm)', emily, say, cols, tones)
  practice(calc, 'Estimate the mean distance in Emily’s long jump competition, in centimetres, to 1 decimal place.', 'P14 Your Turn Q2 (book’s numbers)', t(), number(134.3, '134.3 cm'), 'Midpoints, f × m, add up, divide by the total frequency.', boardModel([], [
    { title: 'Midpoints and f × m', say: 'Midpoints 25, 75, 125, 175 and 225.', rows: ['>0 100, 1350, 7000, 5600, 1800'], picture: t(4, col(5, 3)) },
    { title: 'Add both columns', say: 'Total distance, and how many jumps.', rows: ['Σfm = 15 850', 'Σf = 118'], picture: t(4, [...col(5, 1), ...col(5, 3)]) },
    { title: 'Divide', say: 'Total ÷ how many.', rows: ['15 850 ÷ 118 = 134.32…', '! 134.3 cm'], picture: t(4, col(5, 3, 'found')) },
  ], 'Mean', t()), slips(134.3, [[3170, 'That divides by the 5 classes. Divide by the 118 jumps.'], [125, 'That’s the mean of the midpoints. Weight each by its frequency.']]), { label: 'Mean (cm)', prefix: 'Mean =' })
}

/* ---------- Rung 3: problems ---------- */

const fish: [string, number, number][] = [['0 < l ≤ 20', 16, 10], ['20 < l ≤ 30', 27, 25], ['30 < l ≤ 50', 9, 40], ['50 < l ≤ 70', 13, 60], ['70 < l ≤ 90', 8, 80], ['90 < l ≤ 300', 6, 195]]
const fishSay = 'Fish lengths in centimetres: 16, 27, 9, 13, 8 and 6 in the six classes, the last 90 to 300.'
const fishT = (cols: 2 | 3 | 4 = 2, tones: Tones = []) => gt('Length, l (cm)', fish, fishSay, cols, tones)
practice(problems, 'Guess first: leave out the 6 biggest fish, 90 to 300 cm. What happens to the estimated mean?', 'P14 Your Turn Q4 (guess first)', fishT(2, [[6, 0, 'lit'], [6, 1, 'lit']]), choose('It drops a lot',
  ['It barely changes', 'Only 6 fish, but their midpoint is 195 cm, far above the rest. They pull the mean up a lot.'], ['It goes up', 'They’re the biggest fish. Taking them out lowers the mean.']),
'How far is that class’s midpoint from the others?', boardModel([], [
  { title: 'A far-off midpoint', say: 'The last class’s midpoint is 195 cm. The others are 10 to 80.', rows: ['(90 + 300) ÷ 2 = 195'], picture: fishT(3, [[6, 2, 'lit']]) },
  { title: 'Like an outlier', say: 'Big values pull the mean up; taking them out drops it a lot.', rows: ['! It drops a lot'] },
], 'Mean', fishT()))
worked(problems, 'Estimate the mean length of Simon and Steve’s fish, to 1 decimal place.', 'Unequal classes', 'P14 Your Turn Q4a (book’s numbers)', boardModel([], [
  { title: 'Midpoints', say: 'Classes have different widths; each midpoint is still (bottom + top) ÷ 2.', rows: ['>0 m = 10, 25, 40, 60, 80, 195'], picture: fishT(3, col(6, 2)) },
  { title: 'f × m and add', say: 'Multiply, then add both columns.', rows: ['Σfm = 160 + 675 + 360 + 780 + 640 + 1170 = 3785', 'Σf = 79'], picture: fishT(4, col(6, 3)) },
  { title: 'Divide', say: 'Total length ÷ number of fish.', rows: ['3785 ÷ 79 = 47.91…', '! 47.9 cm'], picture: fishT(4, col(6, 3, 'found')) },
], 'Mean', fishT()), 'Unequal classes change nothing: each midpoint is still (bottom + top) ÷ 2. A very wide class makes the estimate rougher.')
practice(problems, 'Now leave out the 6 biggest fish. Estimate the mean length, to 1 decimal place.', 'P14 Your Turn Q4b (book’s numbers)', fishT(4, [[6, 0, 'faint'], [6, 1, 'faint'], [6, 2, 'faint'], [6, 3, 'faint']]), number(35.8, '35.8 cm'), 'Take that class’s f × m off the total, and its 6 fish off the count.', boardModel([], [
  { title: 'Take out the class', say: 'Its f × m is 1170, and it has 6 fish.', rows: ['3785 − 1170 = 2615', '79 − 6 = 73'], picture: fishT(4, [[6, 3, 'lit'], [6, 1, 'lit']]) },
  { title: 'Divide', say: 'The new total ÷ the new count.', rows: ['2615 ÷ 73 = 35.82…', '! 35.8 cm'], picture: fishT(4, col(5, 3, 'found')) },
], 'Mean', fishT()), slips(35.8, [[33.1, 'That takes off the f × m but still divides by 79. There are 73 fish now.'], [47.9, 'That’s the mean with every fish. Leave out the last class.']]), { label: 'Mean (cm)', prefix: 'Mean =' })
{
  const trip: [string, number, number][] = [['0 < t ≤ 10', 12, 5], ['10 < t ≤ 14', 18, 12], ['14 < t ≤ 20', 34, 17], ['20 < t ≤ 32', 33, 26], ['32 < t ≤ 45', 19, 38.5]]
  const say = 'Journey times to school in minutes: 12, 18, 34, 33 and 19 in five classes of different widths.'
  const t = (cols: 2 | 3 | 4 = 2, tones: Tones = []) => gt('Time, t (min)', trip, say, cols, tones)
  practice(problems, 'Estimate the mean journey time, in minutes, to 1 decimal place.', 'P14 Your Turn Q3 (book’s numbers)', t(), number(21.1, '21.1'), 'The classes have different widths. Find each midpoint carefully.', boardModel([], [
    { title: 'Midpoints', say: 'Each is (bottom + top) ÷ 2.', rows: ['>0 m = 5, 12, 17, 26, 38.5'], picture: t(3, col(5, 2)) },
    { title: 'f × m and add', say: 'Multiply, then add both columns.', rows: ['Σfm = 60 + 216 + 578 + 858 + 731.5 = 2443.5', 'Σf = 116'], picture: t(4, col(5, 3)) },
    { title: 'Divide', say: 'Total minutes ÷ journeys.', rows: ['2443.5 ÷ 116 = 21.06…', '! 21.1 minutes'], picture: t(4, col(5, 3, 'found')) },
  ], 'Mean', t()), slips(21.1, [[488.7, 'That divides by the 5 classes. Divide by the 116 journeys.'], [19.7, 'That’s the mean of the midpoints. Weight each by its frequency.']]), { prefix: 'Mean =' })
}
const darts: [string, number, number][] = [['0 < h ≤ 10', 3, 5], ['10 < h ≤ 20', 25, 15], ['20 < h ≤ 30', 28, 25], ['30 < h ≤ 40', 19, 35], ['40 < h ≤ 50', 8, 45], ['50 < h ≤ 60', 2, 55]]
const dartsSay = 'Suzanna’s darts: bullseyes in 10 minutes, 3, 25, 28, 19, 8 and 2 in six classes of 10.'
const dartT = (cols: 2 | 3 | 4 = 2, tones: Tones = []) => gt('Hits, h', darts, dartsSay, cols, tones)
practice(problems, 'Suzanna’s table: estimate the mean number of bullseyes, to 1 decimal place.', 'P14 Your Turn Q5a (book’s numbers)', dartT(), number(26.2, '26.2'), 'Midpoints, f × m, add up, divide by the total frequency.', boardModel([], [
  { title: 'Midpoints and f × m', say: 'Midpoints 5, 15, 25, 35, 45 and 55.', rows: ['>0 15, 375, 700, 665, 360, 110'], picture: dartT(4, col(6, 3)) },
  { title: 'Add both columns', say: 'Total hits, and how many people.', rows: ['Σfm = 2225', 'Σf = 85'], picture: dartT(4, [...col(6, 1), ...col(6, 3)]) },
  { title: 'Divide', say: 'Total ÷ how many.', rows: ['2225 ÷ 85 = 26.17…', '! 26.2 bullseyes'], picture: dartT(4, col(6, 3, 'found')) },
], 'Mean', dartT()), slips(26.2, [[370.8, 'That divides by the 6 classes. Divide by the 85 people.'], [30, 'That’s the mean of the midpoints. Weight each by its frequency.']]), { prefix: 'Mean =' })
{
  const floella: [string, number, number][] = [['0 < h ≤ 20', 28, 10], ['20 < h ≤ 40', 47, 30], ['40 < h ≤ 60', 10, 50]]
  const say = 'Floella’s table: the same darts in classes of 20, 28, 47 and 10.'
  const t = (cols: 2 | 3 | 4 = 2, tones: Tones = []) => gt('Hits, h', floella, say, cols, tones)
  practice(problems, 'Floella puts the same data in classes of 20 instead of 10. Estimate her mean, to the nearest whole number.', 'P14 Your Turn Q5b (book’s numbers)', t(), number(26, '26'), 'Merge pairs of Suzanna’s classes: 3 + 25, 28 + 19, 8 + 2.', boardModel([], [
    { title: 'Merge the classes', say: 'Each class of 20 is two of Suzanna’s.', rows: ['3 + 25 = 28', '28 + 19 = 47', '8 + 2 = 10'], picture: t(2, col(3, 1)) },
    { title: 'Midpoints and f × m', say: 'Midpoints 10, 30 and 50.', rows: ['280 + 1410 + 500 = 2190'], picture: t(4, col(3, 3)) },
    { title: 'Divide and compare', say: 'To the nearest whole number it’s the same as Suzanna’s: wider classes, same answer here.', rows: ['2190 ÷ 85 = 25.76…', '! 26, no change'], picture: t(4, col(3, 3, 'found')) },
  ], 'Mean', t()), slips(26, [[25.8, 'Round it to the nearest whole number.'], [730, 'That divides by the 3 classes. Divide by the 85 people.']]), { prefix: 'Mean =' })
}

/* ---------- Review: our own numbers ---------- */

chart('mixed', 'Drag the last bar so the estimated mean is 15.', 'P14 review (own numbers)', { mode: 'bars', labels: ['0–10', '10–20', '20–30'], values: [2, 5, 0], free: [2], max: 10, xs: [5, 15, 25] }, ['2'], '2',
  'The midpoints are 5, 15 and 25. Try a value and work out Σfm ÷ Σf.', boardModel([], [
    { title: 'Try a frequency', say: 'With 2 in the last class: Σfm = 2 × 5 + 5 × 15 + 2 × 25.', rows: ['10 + 75 + 50 = 135', 'Σf = 2 + 5 + 2 = 9'] },
    { title: 'Divide', say: 'It gives the mean wanted.', rows: ['135 ÷ 9 = 15', '! Last bar = 2'] },
  ], 'Frequency'), r => { const f = Number(r), m = (85 + 25 * f) / (7 + f); return `With ${f}, the estimate is ${Math.round(m * 100) / 100}. You want 15.` })
{
  const rows: [string, number, number][] = [['0 < x ≤ 10', 3, 5], ['10 < x ≤ 20', 5, 15], ['20 < x ≤ 30', 2, 25]]
  const say = 'Three classes: 3, 5 and 2.'
  const t = (cols: 2 | 3 | 4 = 2, tones: Tones = []) => gt('Value, x', rows, say, cols, tones)
  practice('mixed', 'Estimate the mean.', 'P14 review (own numbers)', t(), number(14, '14'), 'Midpoints, f × m, add up, divide by the total frequency.', boardModel([], [
    { title: 'Midpoints and f × m', say: 'Midpoints 5, 15 and 25.', rows: ['15 + 75 + 50 = 140'], picture: t(4, col(3, 3)) },
    { title: 'Divide', say: 'There are 10 values.', rows: ['140 ÷ 10 = 14', '! Mean ≈ 14'], picture: t(4, col(3, 3, 'found')) },
  ], 'Mean', t()), slips(14, [[15, 'That’s the mean of the midpoints. Weight each by its frequency.'], [46.7, 'That divides by the 3 classes. Divide by the 10 values.']]), { prefix: 'Mean =' })
}
ask('mixed', 'What is the midpoint of the class 2.5 < x ≤ 3.5?', 'P14 review (own numbers)', ['2.5 < x ≤ 3.5'], number(3, '3'), 'Add the ends and halve.', boardModel([], [
  { title: 'Add and halve', say: 'Bottom 2.5, top 3.5.', rows: ['2.5 + 3.5 = 6', '6 ÷ 2 = 3', '! m = 3'] },
], 'Midpoint'), slips(3, [[6, 'That’s the ends added. Halve it.'], [1, 'That’s the width. The midpoint is halfway between.']]), { prefix: 'm =' })

add('mixed', 'Estimating the mean', 'P14 consolidation', text(
  '1. Midpoint of each class: (bottom + top) ÷ 2.',
  '2. Multiply each frequency by its midpoint.',
  '3. Add up the f × m column, and the frequencies.',
  '4. Divide: Σ(f × m) ÷ Σf.',
  'It’s only an estimate: we don’t know the real values.',
))

export const tutorEstimatingMeanLesson: TutorMethodLesson = {
  id: 'L314', number: 314, title: 'Estimating the mean', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Estimate the mean from a grouped frequency table: midpoints, f × m, add up, divide by the total frequency, and say why it’s only an estimate.',
  labels: { [mids]: 'Midpoints', [calc]: 'Estimating the mean', [problems]: 'Estimated mean problems', mixed: 'Review' },
  states: finish(),
}

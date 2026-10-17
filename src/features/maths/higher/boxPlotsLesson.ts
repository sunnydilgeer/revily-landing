/*
 * Statistics 14H: Box plots, a Higher-only lesson after Estimating the mean (lesson 314), as in the book. From the
 * Higher revision guide, P12 Box Plots (Level 6-7, p270–272): the five values a box plot shows, the range and the
 * interquartile range (and why the IQR is the better measure of spread: outliers don't move it), the quartiles of a list
 * at the (n + 1)/4 th and 3(n + 1)/4 th values, drawing a box plot, and comparing two (median first, then IQR, in words
 * about the data).
 *
 * The book's numbers: the shoe sizes (1.5, 4, 8, 10, 13), Example 1 (3, 5, 8, 8, 9, 11, 12, 12, 13, 13, 16), Example 2's
 * TV hours (read from its chart to the nearest grid line), and Your Turn Q1 to Q3. Q1's axis skips 14 (13.5, then
 * 14.5), so its last labels are 0.5 too big: the whisker ends at 15, which the app's own axis shows.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import type { MicroSkillId } from '../../number-types/types'
import { asks } from './figureHelpers'
import { boxFig, listFig, type Axis, type BoxPlot, type Five } from './statsHigherPictures'

const a = author(314.5, 'L314H')
const { add, finish } = a
const ask = asks(a)
const quartiles = 'boxplot-quartiles'
const drawing = 'boxplot-drawing'
const comparing = 'boxplot-comparing'

function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: ReturnType<typeof boardModel>, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}

const NAMES = ['smallest', 'lower quartile', 'median', 'upper quartile', 'largest']
const said = (five: Five) => five.map((v, i) => `${NAMES[i]} ${v}`).join(', ')
const one = (five: Five, axis: Axis, spoken: string, extra: Partial<BoxPlot> = {}) => boxFig([{ five, ...extra }], axis, spoken)

/* ---------- Rung 1: quartiles and the box plot ---------- */

const shoes: Five = [1.5, 4, 8, 10, 13]
const shoeAxis: Axis = { from: 1, to: 14, step: 1, title: 'Shoe size' }
const shoeSay = `A box plot of shoe sizes: ${said(shoes)}.`

add(quartiles, 'Box plots', 'Higher P12 Box Plots - Box and Whisker Plots', text(
  'A box plot shows five values: the smallest, the lower quartile (Q₁), the median, the upper quartile (Q₃) and the largest.',
  'The box runs from Q₁ to Q₃ with a line at the median. The whiskers reach out to the smallest and largest values.',
  'Range = largest − smallest. Interquartile range (IQR) = Q₃ − Q₁: the spread of the middle half of the data.',
  'In a list of n values in order: Q₁ is the (n + 1) ÷ 4 th, the median the (n + 1) ÷ 2 th, and Q₃ the 3(n + 1) ÷ 4 th.',
))

worked(quartiles, 'The box plot shows people’s shoe sizes. Find the range and the interquartile range.', 'Range and IQR', 'Higher P12 Box and Whisker Plots (book’s numbers)', boardModel([], [
  { title: 'Read the five values', say: 'The whiskers’ ends are the smallest and largest; the box’s sides are the quartiles; the line inside is the median.', rows: ['>0 1.5, 4, 8, 10, 13'], picture: one(shoes, shoeAxis, shoeSay, { values: true }) },
  { title: 'The range', say: 'Largest take away smallest: the spread of all the data.', rows: ['Range = 13 − 1.5 = 11.5'], picture: one(shoes, shoeAxis, shoeSay, { tones: { 0: 'lit', 4: 'lit' } }) },
  { title: 'The IQR', say: 'Upper quartile take away lower quartile: the spread of the middle half, so an outlier can’t move it.', rows: ['IQR = 10 − 4 = 6', '! Range 11.5, IQR 6'], picture: one(shoes, shoeAxis, shoeSay, { tones: { 1: 'found', 3: 'found' } }) },
], 'Spread', one(shoes, shoeAxis, shoeSay)), 'The IQR is the better measure of spread: one very big or very small value changes the range but not the quartiles.')

const ex1 = [3, 5, 8, 8, 9, 11, 12, 12, 13, 13, 16]
const ex1Say = `Eleven values in order: ${ex1.join(', ')}.`
const ex1Axis: Axis = { from: 3, to: 16, step: 1 }
const ex1Five: Five = [3, 8, 11, 13, 16]
worked(quartiles, 'Construct a box plot for 3, 5, 8, 8, 9, 11, 12, 12, 13, 13, 16.', 'Constructing a box plot', 'Higher P12 Example 1 (book’s numbers)', boardModel([], [
  { title: 'Count the values', say: 'They are already in order. There are 11 of them.', rows: ['n = 11'], picture: listFig(ex1, ex1Say) },
  { title: 'The median', say: 'The middle value is the (n + 1) ÷ 2 th.', rows: ['(11 + 1) ÷ 2 = 6th', 'Median = 11'], picture: listFig(ex1, ex1Say, { 5: 'lit' }) },
  { title: 'The quartiles', say: 'The lower quartile is the (n + 1) ÷ 4 th value, the upper quartile the 3(n + 1) ÷ 4 th.', rows: ['(11 + 1) ÷ 4 = 3rd', 'Q₁ = 8', '3 × 12 ÷ 4 = 9th', 'Q₃ = 13'], picture: listFig(ex1, ex1Say, { 2: 'lit', 5: 'lit', 8: 'lit' }) },
  { title: 'Draw it', say: 'Mark the five values over a scale, draw the box from Q₁ to Q₃ with the median inside, and the whiskers out to 3 and 16.', rows: ['! 3, 8, 11, 13, 16'], picture: one(ex1Five, ex1Axis, `A box plot: ${said(ex1Five)}.`, { values: true }) },
], 'Box plot', listFig(ex1, ex1Say)), 'Put the data in order first. With n values, Q₁ is the (n + 1) ÷ 4 th, the median the (n + 1) ÷ 2 th and Q₃ the 3(n + 1) ÷ 4 th.')

{
  const list = [220, 252, 256, 312, 332, 332, 400]
  const p = listFig(list, `Seven reaction times in milliseconds, in order: ${list.join(', ')}.`)
  ask(quartiles, 'The reaction times of seven 30-year-olds, in milliseconds, are 220, 252, 256, 312, 332, 332, 400. Find the lower quartile.', 'Higher P12 Your Turn Q3 (book’s numbers)', p,
    number(252, '252'), '252', 'Seven values: which place is (n + 1) ÷ 4?', {
      kind: 'step-worked', start: 'n = 7, in order', steps: [
        { title: 'Find its place', why: 'The lower quartile is the value a quarter of the way along: the (n + 1) ÷ 4 th.', lines: [line([part('(7 + 1)'), sign('÷'), part('4')], '2', { eq: true })] },
        { title: 'Count along', why: 'The second value in the ordered list.', lines: [line([part('Q₁')], '252', { eq: true, answer: true })] },
      ],
    }, { label: 'Lower quartile (ms)', prefix: 'Q₁ =' })
  ask(quartiles, 'For the same seven reaction times, find the interquartile range.', 'Higher P12 Your Turn Q3 (book’s numbers)', p,
    number(80, '80'), '80', 'Find Q₃ too: the 3(n + 1) ÷ 4 th value.', {
      kind: 'step-worked', start: 'n = 7, Q₁ = 252', steps: [
        { title: 'Place of Q₃', why: 'Three quarters of the way along: three times the place of Q₁.', lines: [line([part('3'), sign('×'), part('2')], '6', { eq: true })] },
        { title: 'Read Q₃', why: 'The sixth value in the ordered list.', lines: [line([part('Q₃')], '332', { eq: true })] },
        { title: 'Subtract', why: 'The interquartile range is the upper quartile take away the lower quartile.', lines: [line([part('332'), sign('−'), part('252')], '80', { answer: true })] },
      ],
    }, { label: 'IQR (ms)', prefix: 'IQR =' })
}

ask(quartiles, 'A set of data has one very large value, an outlier. Why is the interquartile range a better measure of spread than the range here?', 'Higher P12 Box and Whisker Plots', one(shoes, shoeAxis, shoeSay),
  choose('The IQR uses the middle half, so the outlier doesn’t change it',
    ['The IQR is always bigger than the range', 'It never is: the middle half can’t be more spread out than all the data.'],
    ['The range ignores the largest value', 'The range uses the largest value, which is why one outlier stretches it.']),
  'The IQR uses the middle half, so the outlier doesn’t change it', 'Which two values does each one use?', {
    kind: 'step-worked', start: 'One value far bigger than the rest', steps: [
      { title: 'What each uses', why: 'The range uses the largest and smallest, so one outlier stretches it. The quartiles sit in the middle half and barely move.', words: 'The IQR uses the middle half, so the outlier doesn’t change it' },
    ],
  })

/* ---------- Rung 2: drawing and reading box plots ---------- */

const exam: Five = [71, 73, 81, 84, 92]
const examAxis: Axis = { from: 70, to: 92, step: 2 }
const examSay = 'A number line from 70 to 92.'
worked(drawing, 'Exam marks: largest 92, lower quartile 73, median 81, range 21, interquartile range 11. Draw the box plot.', 'From the facts', 'Higher P12 Your Turn Q2 (book’s numbers)', boardModel([], [
  { title: 'The smallest value', say: 'The range is largest take away smallest, so take the range off the largest.', rows: ['Smallest = 92 − 21 = 71'], picture: boxFig([{ five: exam, parts: [0, 4], tones: { 0: 'lit' } }], examAxis, examSay) },
  { title: 'The upper quartile', say: 'The IQR is Q₃ take away Q₁, so add the IQR to the lower quartile.', rows: ['Q₃ = 73 + 11 = 84'], picture: boxFig([{ five: exam, parts: [0, 1, 3, 4], tones: { 3: 'lit' } }], examAxis, examSay) },
  { title: 'Draw it', say: 'The box from 73 to 84, the median at 81, and the whiskers out to 71 and 92.', rows: ['! 71, 73, 81, 84, 92'], picture: one(exam, examAxis, `A box plot of the exam marks: ${said(exam)}.`, { values: true }) },
], 'Box plot', boxFig([{ five: exam, parts: [] }], examAxis, examSay)), 'Work out any of the five values you aren’t given from the range and IQR, then draw them over the scale.')

const sprint: Five = [10, 10.5, 11.5, 12.5, 15]
const sprintAxis: Axis = { from: 10, to: 16, step: 0.5, every: 2, title: 'Time (seconds)' }
const sprintSay = `A box plot of 100 m sprint times: ${said(sprint)}.`
ask(drawing, 'The box plot shows times to run 100 m. Find the range.', 'Higher P12 Your Turn Q1 (book’s numbers)', one(sprint, sprintAxis, sprintSay),
  number(5, '5 seconds'), '5', 'The ends of the whiskers are the smallest and largest times.', {
    kind: 'step-worked', start: 'Whiskers from 10 to 15', steps: [
      { title: 'Read the ends', why: 'The left whisker ends at the fastest time and the right whisker at the slowest.', lines: [line([part('smallest', 0)], '10', { eq: true }), line([part('largest', 1)], '15', { eq: true })] },
      { title: 'Subtract', why: 'The range is the largest take away the smallest.', lines: [line([part('15'), sign('−'), part('10')], '5', { answer: true })] },
    ],
  }, { label: 'Range (s)', prefix: 'Range =' })
ask(drawing, 'Use the same box plot. Find the interquartile range.', 'Higher P12 Your Turn Q1 (book’s numbers)', one(sprint, sprintAxis, sprintSay),
  number(2, '2 seconds'), '2', 'The sides of the box are the quartiles.', {
    kind: 'step-worked', start: 'Box from 10.5 to 12.5', steps: [
      { title: 'Read the box', why: 'The box’s left side is the lower quartile and its right side the upper quartile.', lines: [line([part('Q₁', 0)], '10.5', { eq: true }), line([part('Q₃', 1)], '12.5', { eq: true })] },
      { title: 'Subtract', why: 'The interquartile range is the upper quartile take away the lower quartile.', lines: [line([part('12.5'), sign('−'), part('10.5')], '2', { answer: true })] },
    ],
  }, { label: 'IQR (s)', prefix: 'IQR =' })
ask(drawing, 'In the sprint box plot, what does the line inside the box show?', 'Higher P12 Box and Whisker Plots', one(sprint, sprintAxis, sprintSay, { tones: { 2: 'lit' } }),
  choose('The median, 11.5 seconds',
    ['The mean, 11.5 seconds', 'A box plot doesn’t show the mean. The line in the box is the middle value.'],
    ['The mode, 11.5 seconds', 'A box plot can’t show the mode. The line in the box is the middle value.']),
  'The median, 11.5 seconds', 'A box plot shows five values. Which one sits in the middle?', {
    kind: 'step-worked', start: 'A line inside the box at 11.5', steps: [
      { title: 'The middle line', why: 'Half the times are below the line in the box and half above, so it marks the middle value.', words: 'The median, 11.5 seconds' },
    ],
  })
{
  const facts: Five = [12, 18, 25, 31, 40]
  const axis: Axis = { from: 10, to: 40, step: 2, every: 5 }
  ask(drawing, 'For some data: lower quartile 18, interquartile range 13, median 25. What is the upper quartile?', 'Higher P12 Your Turn Q2 (own numbers)', boxFig([{ five: facts, parts: [1, 2], tones: { 1: 'lit' } }], axis, 'The lower quartile, 18, and the median, 25, marked over a number line from 10 to 40.'),
    number(31, '31'), '31', 'The IQR is Q₃ take away Q₁.', {
      kind: 'step-worked', start: 'Q₁ = 18, IQR = 13', steps: [
        { title: 'Add the IQR', why: 'The upper quartile is the interquartile range above the lower quartile.', lines: [line([part('18'), sign('+'), part('13')], '31', { answer: true })] },
      ],
    }, { prefix: 'Q₃ =' })
}

/* ---------- Rung 3: comparing box plots ---------- */

const y11: Five = [8, 15, 23, 30, 35], y9: Five = [3, 15, 27, 32, 39]
const tvAxis: Axis = { from: 0, to: 40, step: 5, title: 'Hours of TV in a month' }
const tvSay = `Two box plots of hours of TV in a month. Year 11: ${said(y11)}. Year 9: ${said(y9)}.`
const tv = (a: BoxPlot['tones'] = {}, b: BoxPlot['tones'] = {}) => boxFig([{ five: y11, name: 'Year 11', tones: a }, { five: y9, name: 'Year 9', tones: b }], tvAxis, tvSay)
worked(comparing, 'The box plots show how many hours of TV a Year 11 class and a Year 9 class watched in a month. Compare them.', 'Comparing box plots', 'Higher P12 Example 2 (book’s numbers, read from its chart)', boardModel([], [
  { title: 'Compare the medians', say: 'The median is a typical value. Year 9’s is higher, so in general Year 9 watched more TV.', rows: ['Year 11 median = 23', 'Year 9 median = 27'], picture: tv({ 2: 'lit' }, { 2: 'lit' }) },
  { title: 'Compare the IQRs', say: 'The IQR is the spread of the middle half. Year 9’s is bigger, so Year 9 were less consistent.', rows: ['Year 11 IQR = 30 − 15 = 15', 'Year 9 IQR = 32 − 15 = 17'], picture: tv({ 1: 'lit', 3: 'lit' }, { 1: 'lit', 3: 'lit' }) },
  { title: 'Say what it means', say: 'Every comparison is written about the data: who watched more, who was more consistent.', rows: ['! Year 9: more TV, less consistent'] },
], 'Compare', tv()), 'Compare the medians (which group is higher on average) and the IQRs (which is more consistent), and say what each means in the question’s words.')

const r20: Five = [210, 240, 295, 310, 380], r30: Five = [220, 252, 312, 332, 400]
const reactAxis: Axis = { from: 200, to: 420, step: 20, every: 2, title: 'Reaction time (ms)' }
const reactSay = `Two box plots of reaction times. 20-year-olds: ${said(r20)}. 30-year-olds: ${said(r30)}.`
const react = (a: BoxPlot['tones'] = {}, b: BoxPlot['tones'] = {}) => boxFig([{ five: r20, name: '20s', tones: a }, { five: r30, name: '30s', tones: b }], reactAxis, reactSay)
worked(comparing, 'Draw the 30-year-olds’ box plot under the 20-year-olds’, and note two differences.', 'Two age groups', 'Higher P12 Your Turn Q3 (book’s numbers)', boardModel([], [
  { title: 'The five values', say: 'From the list of seven: smallest 220, Q₁ the 2nd, median the 4th, Q₃ the 6th, largest 400.', rows: ['>0 220, 252, 312, 332, 400'], picture: react() },
  { title: 'The averages', say: 'The 30-year-olds’ median is higher, so on average they were slower to react.', rows: ['20s median = 295', '30s median = 312'], picture: react({ 2: 'lit' }, { 2: 'lit' }) },
  { title: 'The spreads', say: 'The 20-year-olds’ middle half is narrower, so their times were more consistent.', rows: ['20s IQR = 310 − 240 = 70', '30s IQR = 332 − 252 = 80', '! 30s slower; 20s more consistent'], picture: react({ 1: 'lit', 3: 'lit' }, { 1: 'lit', 3: 'lit' }) },
], 'Compare', react()), 'Two differences: one about the median (on average), one about the IQR (consistency).')

ask(comparing, 'Which group had the more consistent reaction times?', 'Higher P12 Your Turn Q3 (book’s numbers)', react(),
  choose('The 20-year-olds: their IQR is smaller',
    ['The 30-year-olds: their median is higher', 'A higher median means slower on average. Consistency is about the spread.'],
    ['The 20-year-olds: their median is lower', 'That says they were quicker on average. Consistency is about the spread, the IQR.']),
  'The 20-year-olds: their IQR is smaller', 'Consistent means less spread out. Compare the boxes’ widths.', {
    kind: 'step-worked', start: 'IQR 70 and IQR 80', steps: [
      { title: 'Compare the IQRs', why: 'The narrower box has its middle half closer together, so those times vary less.', words: 'The 20-year-olds: their IQR is smaller' },
    ],
  })
ask(comparing, 'How much higher is the 30-year-olds’ median than the 20-year-olds’, in milliseconds?', 'Higher P12 Your Turn Q3 (book’s numbers)', react({ 2: 'lit' }, { 2: 'lit' }),
  number(17, '17'), '17', 'Read the line inside each box.', {
    kind: 'step-worked', start: 'Medians 295 and 312', steps: [
      { title: 'Subtract', why: 'The difference between the two middle values.', lines: [line([part('312'), sign('−'), part('295')], '17', { answer: true })] },
    ],
  }, { label: 'Difference (ms)', prefix: 'Difference =' })
ask(comparing, 'Using the TV box plots: which class had the bigger range, and by how much?', 'Higher P12 Example 2 (book’s numbers)', tv({ 0: 'lit', 4: 'lit' }, { 0: 'lit', 4: 'lit' }),
  number(9, '9 hours'), '9', 'Range = largest − smallest, for each class.', {
    kind: 'step-worked', start: 'Year 11: 8 to 35; Year 9: 3 to 39', steps: [
      { title: 'Each range', why: 'Largest take away smallest for each class.', lines: [line([part('35'), sign('−'), part('8')], '27'), line([part('39'), sign('−'), part('3')], '36')] },
      { title: 'The difference', why: 'Year 9’s range is the bigger one; take the other away from it.', lines: [line([part('36'), sign('−'), part('27')], '9', { answer: true })] },
    ],
  }, { label: 'Difference (hours)', prefix: 'Year 9’s by' })

/* ---------- More practice: our own numbers ---------- */

{
  const list = [4, 6, 7, 9, 10, 12, 15]
  const p = listFig(list, `Seven values in order: ${list.join(', ')}.`)
  ask(comparing, 'Find the interquartile range of 4, 6, 7, 9, 10, 12, 15.', 'Higher P12 review (own numbers)', p, number(6, '6'), '6', 'Q₁ is the 2nd value and Q₃ the 6th.', {
    kind: 'step-worked', start: 'n = 7', steps: [
      { title: 'The quartiles', why: 'The second value is the lower quartile and the sixth the upper quartile.', lines: [line([part('Q₁', 0)], '6', { eq: true }), line([part('Q₃', 1)], '12', { eq: true })] },
      { title: 'Subtract', why: 'Upper quartile take away lower quartile.', lines: [line([part('12'), sign('−'), part('6')], '6', { answer: true })] },
    ],
  }, { prefix: 'IQR =' })
}
{
  const five: Five = [20, 26, 30, 38, 45]
  ask(comparing, 'Find the range shown by the box plot.', 'Higher P12 review (own numbers)', one(five, { from: 20, to: 46, step: 2, every: 2 }, `A box plot: ${said(five)}.`),
    number(25, '25'), '25', 'Use the ends of the whiskers, not the box.', {
      kind: 'step-worked', start: 'Whiskers from 20 to 45', steps: [
        { title: 'Subtract', why: 'The range is the largest value take away the smallest.', lines: [line([part('45'), sign('−'), part('20')], '25', { answer: true })] },
      ],
    }, { prefix: 'Range =' })
}

add('mixed', 'Box plots', 'Higher P12 consolidation', text(
  'A box plot shows the smallest, Q₁, the median, Q₃ and the largest.',
  'From a list of n in order: Q₁ the (n + 1) ÷ 4 th, median the (n + 1) ÷ 2 th, Q₃ the 3(n + 1) ÷ 4 th.',
  'Range = largest − smallest. IQR = Q₃ − Q₁, which outliers don’t affect.',
  'Comparing: the medians (on average), then the IQRs (consistency), in words about the data.',
))

export const tutorBoxPlotsLesson: TutorMethodLesson = {
  id: 'L314H', number: 314.5, title: 'Box plots', level: 'GCSE Higher',
  steadyPictures: true,
  largePictures: true,
  goal: 'Find the quartiles and interquartile range, draw and read box plots, and compare two sets of data with them.',
  labels: { [quartiles]: 'Quartiles and the IQR', [drawing]: 'Drawing and reading box plots', [comparing]: 'Comparing box plots', mixed: 'Review' },
  states: finish(),
}

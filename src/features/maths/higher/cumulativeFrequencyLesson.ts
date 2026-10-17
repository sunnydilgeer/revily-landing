/*
 * Statistics 14H2: Cumulative frequency, the second Higher-only lesson after Estimating the mean (lesson 314), after
 * 14H Box plots, as in the book. From the Higher revision guide, P13 Cumulative Frequency (Level 6-7, p273–275): the
 * running total of a grouped table, plotted at the end of each class and joined with a smooth S-shaped curve, then the
 * median and quartiles read across from n ÷ 2, n ÷ 4 and 3n ÷ 4 (not (n + 1) ÷ 4 as for a list), the IQR, a box plot
 * from the graph, and how many are above a value.
 *
 * The book's numbers: the 92 students' heights (Q₁ 163, median 170, Q₃ 176, IQR 13), Your Turn Q1 (the website), Q2
 * (hours of exercise), Q3 (car prices) and Q4 (snake lengths). The curve is drawn smoothly through the points
 * (statsHigherPictures.ts), and every reading is taken from that same curve, so an answer is what its picture shows;
 * an answer read from a graph accepts anything close, as a reading by eye would be. Q2's text says the top value is an
 * ultra runner's 72 hours, but its graph and box plot scale stop at 12 to 14: the app uses 12 hours as the top value.
 */
import { author } from '../../written-methods/tutor/content'
import type { FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import type { MicroSkillId } from '../../number-types/types'
import { tableFig } from '../../probability/tutor/chancePictures'
import { asks } from './figureHelpers'
import { between } from './helpers'
import { boxFig, cfCurve, cfFig, type Axis, type Reading } from './statsHigherPictures'

const a = author(314.6, 'L314H2')
const { add, finish } = a
const ask = asks(a)
const table = 'cumfreq-table'
const graph = 'cumfreq-graph'
const reading = 'cumfreq-reading'

function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: ReturnType<typeof boardModel>, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}

type Tones = [number, number, FigureTone][]
/** A grouped table with its cumulative frequency column filled in as far as `upTo` rows. */
function cfTable(head: string, classes: [string, number][], spoken: string, upTo = 0, tones: Tones = []) {
  let run = 0
  const rows = classes.map(([c, f], k) => { run += f; return [c, String(f), k < upTo ? String(run) : ''] })
  return tableFig([[head, 'Frequency', 'Cumulative'], ...rows], spoken, { tones })
}
const r1 = (v: number) => Math.round(v * 10) / 10
const r0 = (v: number) => Math.round(v)

/* ---------- Rung 1: the cumulative frequency table ---------- */

const heights: [string, number][] = [['150 < h ≤ 160', 13], ['160 < h ≤ 170', 33], ['170 < h ≤ 180', 35], ['180 < h ≤ 190', 11]]
const heightsSay = 'The heights of 92 college students in centimetres: 13, 33, 35 and 11 in four classes of 10 from 150 to 190.'
const ht = (upTo = 0, tones: Tones = []) => cfTable('Height, h (cm)', heights, heightsSay, upTo, tones)

add(table, 'Cumulative frequency', 'Higher P13 Cumulative Frequency', text(
  'Cumulative frequency is a running total: how many values there are up to the end of each class.',
  'Plot each running total at the end of its class, and join the points with a smooth S-shaped curve.',
  'The graph gives the median and the quartiles: go across from the cumulative frequency to the curve, then down.',
))

worked(table, 'Complete the cumulative frequency column for the students’ heights.', 'Running totals', 'Higher P13 Plotting a Cumulative Frequency Graph (book’s numbers)', boardModel([], [
  { title: 'The first class', say: 'Its cumulative frequency is just its own frequency.', rows: ['>0 13'], picture: ht(1, [[1, 2, 'lit']]) },
  { title: 'Add the next', say: 'Add each class’s frequency to the total so far.', rows: ['13 + 33 = 46'], picture: ht(2, [[2, 1, 'lit'], [2, 2, 'lit']]) },
  { title: 'Keep going', say: 'The running total grows to the end.', rows: ['46 + 35 = 81', '81 + 11 = 92'], picture: ht(4, [[3, 2, 'lit'], [4, 2, 'lit']]) },
  { title: 'Check the last', say: 'The last cumulative frequency is everyone counted: the total frequency.', rows: ['! 13, 46, 81, 92'], picture: ht(4, [[4, 2, 'found']]) },
], 'Cumulative', ht()), 'Add as you go: each cumulative frequency is the one above plus this class’s frequency. The last one is the total.')

{
  const web: [string, number][] = [['0 < t ≤ 20', 16], ['20 < t ≤ 30', 24], ['30 < t ≤ 50', 19], ['50 < t ≤ 80', 8]]
  const say = 'Minutes spent on a website in one day: 16, 24, 19 and 8 in four classes up to 80 minutes.'
  ask(table, 'Find the cumulative frequency for the class 30 < t ≤ 50.', 'Higher P13 Your Turn Q1 (book’s numbers)', cfTable('Time, t (min)', web, say, 2, [[3, 2, 'x']]),
    number(59, '59'), '59', 'Add this class’s frequency to the total so far.', {
      kind: 'step-worked', start: 'Total so far = 40', steps: [
        { title: 'Add the frequency', why: 'The running total up to 30 minutes, plus the people in this class.', lines: [line([part('40'), sign('+'), part('19')], '59', { answer: true })] },
      ],
    }, { prefix: 'CF =' })
  ask(table, 'How many people are in the website table altogether?', 'Higher P13 Your Turn Q1 (book’s numbers)', cfTable('Time, t (min)', web, say, 4, [[4, 2, 'lit']]),
    number(67, '67'), '67', 'Look at the last cumulative frequency.', {
      kind: 'step-worked', start: 'Cumulative 16, 40, 59, 67', steps: [
        { title: 'The last total', why: 'The last running total has counted every class, so it is the total frequency.', lines: [line([part('59'), sign('+'), part('8')], '67', { answer: true })] },
      ],
    }, { prefix: 'Total =' })
}

/* ---------- Rung 2: the graph ---------- */

const hPts: [number, number][] = [[150, 0], [160, 13], [170, 46], [180, 81], [190, 92]]
const hX: Axis = { from: 140, to: 200, step: 10, title: 'Height (cm)' }, hY: Axis = { from: 0, to: 100, step: 10, every: 2 }
const hSay = 'Cumulative frequency of the heights plotted at the end of each class: (150, 0), (160, 13), (170, 46), (180, 81), (190, 92).'
const hFig = (o: Parameters<typeof cfFig>[4] = {}) => cfFig(hPts, hX, hY, hSay, o)

worked(graph, 'Draw the cumulative frequency graph for the students’ heights.', 'Plotting the graph', 'Higher P13 Step 2 (book’s numbers)', boardModel([], [
  { title: 'Start at zero', say: 'Nobody is shorter than 150 cm, the start of the first class, so plot 0 there.', rows: ['>0 (150, 0)'], picture: hFig({ shown: 1, lit: [0] }) },
  { title: 'End of each class', say: 'Plot each cumulative frequency at the end of its class: 13 students are 160 cm or less.', rows: ['>0 (160, 13), (170, 46)'], picture: hFig({ shown: 3, lit: [1] }) },
  { title: 'All the points', say: 'The last point is the total, 92, at 190.', rows: ['>0 (180, 81), (190, 92)'], picture: hFig({ shown: 5, lit: [4] }) },
  { title: 'A smooth curve', say: 'Join the points with a smooth curve, not straight lines. It looks like a stretched S.', rows: ['! A smooth S-shaped curve'], picture: hFig({ curve: true }) },
], 'Graph', hFig({ shown: 0 })), 'Plot at the end of each class, start at 0 at the start of the first class, and join with a smooth curve.')

{
  const web: [number, number][] = [[0, 0], [20, 16], [30, 40], [50, 59], [80, 67]]
  const p = cfFig(web, { from: 0, to: 100, step: 10, every: 2, title: 'Time (minutes)' }, { from: 0, to: 80, step: 10, every: 2 }, 'The website times plotted so far: (0, 0) and (20, 16).', { shown: 2 })
  ask(graph, 'The class 20 < t ≤ 30 has cumulative frequency 40. Where is it plotted?', 'Higher P13 Your Turn Q1b (book’s numbers)', p,
    choose('At (30, 40), the end of the class',
      ['At (25, 40), the middle of the class', 'The middle is for estimating a mean. 40 people took 30 minutes or less, so it goes at 30.'],
      ['At (20, 40), the start of the class', 'At 20 minutes only 16 people were counted. 40 is the total up to 30.']),
    'At (30, 40), the end of the class', 'Cumulative frequency counts everything up to the end of the class.', {
      kind: 'step-worked', start: '40 people took 30 minutes or less', steps: [
        { title: 'Up to the end', why: 'The running total counts every value up to and including the end of the class, so the point goes at the end.', words: 'At (30, 40), the end of the class' },
      ],
    })
}

/* ---------- Rung 3: reading the graph ---------- */

const hc = cfCurve(hPts)
const hQ1 = r1(hc.inverse(23)), hMed = r0(hc.inverse(46)), hQ3 = r1(hc.inverse(69)), hIqr = r1(hQ3 - hQ1)
const hq: Reading[] = [{ cf: 23, label: String(hQ1) }, { cf: 46, label: String(hMed) }, { cf: 69, label: String(hQ3) }]
worked(reading, 'Use the cumulative frequency graph to find the median and the interquartile range of the heights.', 'Median and IQR', 'Higher P13 Example (book’s numbers)', boardModel([], [
  { title: 'Where to read', say: 'There are 92 students, so the lower quartile, median and upper quartile are a quarter, half and three quarters of the way up.', rows: ['92 ÷ 4 = 23', '92 ÷ 2 = 46', '3 × 92 ÷ 4 = 69'], picture: hFig({ curve: true }) },
  { title: 'Read the median', say: 'Across from 46 to the curve, then down to the height.', rows: [`Median = ${hMed} cm`], picture: hFig({ curve: true, reads: [hq[1]] }) },
  { title: 'Read the quartiles', say: 'The same from 23 and from 69.', rows: [`Q₁ = ${hQ1}`, `Q₃ = ${hQ3}`], picture: hFig({ curve: true, reads: hq }) },
  { title: 'The IQR', say: 'Upper quartile take away lower quartile.', rows: [`${hQ3} − ${hQ1} = ${hIqr}`, `! Median ${hMed} cm, IQR about ${r0(hIqr)} cm`], picture: hFig({ curve: true, reads: [{ ...hq[0], tone: 'found' }, hq[1], { ...hq[2], tone: 'found' }] }) },
], 'Read', hFig({ curve: true })), 'From a graph, read across at n ÷ 4, n ÷ 2 and 3n ÷ 4 (not n + 1: the curve is already an estimate), then down. The answers are estimates.')

const snakePts: [number, number][] = [[0, 0], [1, 23], [2, 58], [3, 97], [4, 138], [5, 150], [6, 160]]
const snakeX: Axis = { from: 0, to: 7, step: 1, title: 'Length (m)' }, snakeY: Axis = { from: 0, to: 200, step: 20, every: 2 }
const snakeSay = 'Cumulative frequency of 160 snake lengths: (0, 0), (1, 23), (2, 58), (3, 97), (4, 138), (5, 150), (6, 160).'
const sc = cfCurve(snakePts), sQ1 = sc.inverse(40), sMed = sc.inverse(80), sQ3 = sc.inverse(120)
const snakes = (reads: Reading[] = []) => cfFig(snakePts, snakeX, snakeY, snakeSay, { curve: true, reads })
ask(reading, 'The graph shows the lengths of 160 snakes. Estimate the interquartile range.', 'Higher P13 Your Turn Q4b (book’s numbers)', snakes(),
  between(r1(sQ3 - sQ1), 1.75, 2.3, `about ${r1(sQ3 - sQ1)} m`), String(r1(sQ3 - sQ1)), '160 snakes: read across at 40 and at 120.', {
    kind: 'step-worked', start: 'n = 160', steps: [
      { title: 'Where to read', why: 'The quartiles are a quarter and three quarters of the way up the cumulative frequency.', lines: [line([part('160'), sign('÷'), part('4')], '40'), line([part('3'), sign('×'), part('40')], '120')] },
      { title: 'Read the quartiles', why: 'Across from each to the curve, then down to the length.', lines: [line([part('Q₁', 0)], String(r1(sQ1)), { eq: true }), line([part('Q₃', 1)], String(r1(sQ3)), { eq: true })] },
      { title: 'Subtract', why: 'The interquartile range is the upper quartile take away the lower quartile.', lines: [line([part(String(r1(sQ3))), sign('−'), part(String(r1(sQ1)))], String(r1(sQ3 - sQ1)), { answer: true })] },
    ],
  }, { label: 'IQR (m)', prefix: 'IQR ≈' })
ask(reading, 'Estimate the median length of the snakes.', 'Higher P13 Your Turn Q4 (book’s numbers)', snakes([{ cf: 80, label: '?' }]),
  between(r1(sMed), 2.4, 2.75, `about ${r1(sMed)} m`), String(r1(sMed)), 'Half of 160 is 80.', {
    kind: 'step-worked', start: 'n = 160', steps: [
      { title: 'Halfway up', why: 'The median is half the way up the cumulative frequency.', lines: [line([part('160'), sign('÷'), part('2')], '80')] },
      { title: 'Read across', why: 'Across from 80 to the curve, then down to the length.', lines: [line([part('median')], String(r1(sMed)), { eq: true, answer: true })] },
    ],
  }, { label: 'Median (m)', prefix: 'Median ≈' })
{
  const pct = (sMed - 1.78) / sMed * 100
  ask(reading, `Another sanctuary’s median snake is 1.78 m. To 1 decimal place, by what percentage is it smaller than this sanctuary’s median of ${r1(sMed)} m?`, 'Higher P13 Your Turn Q4c (book’s numbers)', snakes([{ cf: 80, tone: 'found', label: String(r1(sMed)) }]),
    between(r1((r1(sMed) - 1.78) / r1(sMed) * 100), 27, 34, `about ${r1(pct)}%`), String(r1((r1(sMed) - 1.78) / r1(sMed) * 100)), 'Percentage change: the difference ÷ the original × 100.', {
      kind: 'step-worked', start: `Medians ${r1(sMed)} m and 1.78 m`, steps: [
        { title: 'The difference', why: 'How much smaller the other median is.', lines: [line([part(String(r1(sMed))), sign('−'), part('1.78')], String(Math.round((r1(sMed) - 1.78) * 100) / 100))] },
        { title: 'As a percentage', why: 'Divide by this sanctuary’s median, the one it is compared with, and times by a hundred.', lines: [line([part(String(Math.round((r1(sMed) - 1.78) * 100) / 100)), sign('÷'), part(String(r1(sMed))), sign('×'), part('100')], `${(Math.floor((r1(sMed) - 1.78) / r1(sMed) * 10000) / 100).toFixed(2)}…`), line([part('to 1 dp')], String(r1((r1(sMed) - 1.78) / r1(sMed) * 100)), { eq: true, answer: true })] },
      ],
    }, { label: 'Smaller by (%)', prefix: 'Smaller by' })
}

const carPts: [number, number][] = [[0, 0], [10, 8], [15, 20], [20, 34], [25, 44], [30, 48]]
const carX: Axis = { from: 0, to: 35, step: 5, title: 'Price (£ thousands)' }, carY: Axis = { from: 0, to: 50, step: 5, every: 2 }
const carSay = 'Cumulative frequency of 48 car prices in thousands of pounds: (0, 0), (10, 8), (15, 20), (20, 34), (25, 44), (30, 48).'
const cc = cfCurve(carPts), carMed = cc.inverse(24), under = cc.at(17.5)
ask(reading, 'The graph shows the prices of 48 cars. Estimate how many cost more than £17 500.', 'Higher P13 Your Turn Q3c (book’s numbers)', cfFig(carPts, carX, carY, carSay, { curve: true, reads: [{ x: 17.5, label: String(r0(under)) }] }),
  between(48 - r0(under), 18.5, 23.5, `about ${48 - r0(under)}`), String(48 - r0(under)), 'The graph counts the cars up to £17 500. Take them from the total.', {
    kind: 'step-worked', start: '48 cars', steps: [
      { title: 'Read up', why: 'Up from seventeen and a half thousand to the curve, then across: the cars costing that or less.', lines: [line([part('up to £17 500')], String(r0(under)), { eq: true })] },
      { title: 'The rest', why: 'Every other car costs more.', lines: [line([part('48'), sign('−'), part(String(r0(under)))], String(48 - r0(under)), { answer: true })] },
    ],
  }, { prefix: 'Cars ≈' })
ask(reading, 'Estimate the median price of the 48 cars, in thousands of pounds.', 'Higher P13 Your Turn Q3b (book’s numbers)', cfFig(carPts, carX, carY, carSay, { curve: true }),
  between(r1(carMed), 15.9, 16.9, `about £${r1(carMed)} thousand`), String(r1(carMed)), 'Half of 48 is 24.', {
    kind: 'step-worked', start: 'n = 48', steps: [
      { title: 'Halfway up', why: 'The median is half the way up the cumulative frequency.', lines: [line([part('48'), sign('÷'), part('2')], '24')] },
      { title: 'Read across', why: 'Across from 24 to the curve, then down to the price.', lines: [line([part('median')], String(r1(carMed)), { eq: true, answer: true })] },
    ],
  }, { label: 'Median (£ thousands)', prefix: 'Median ≈' })

const exPts: [number, number][] = [[0, 0], [2, 22], [5.5, 53], [8, 62], [12, 64]]
const exX: Axis = { from: 0, to: 14, step: 1, every: 2, title: 'Time (hours)' }, exY: Axis = { from: 0, to: 80, step: 10, every: 2 }
const exSay = 'Cumulative frequency of hours of exercise a week for 64 people: (0, 0), (2, 22), (5.5, 53), (8, 62), (12, 64).'
const ec = cfCurve(exPts), eQ1 = r1(ec.inverse(16)), eMed = r1(ec.inverse(32)), eQ3 = r1(ec.inverse(48))
worked(reading, 'Draw a box plot from the cumulative frequency graph of hours of exercise. The least is 0 hours and the most 12.', 'Graph to box plot', 'Higher P13 Your Turn Q2 (book’s numbers)', boardModel([], [
  { title: 'Where to read', say: 'There are 64 people: read across at a quarter, a half and three quarters of 64.', rows: ['64 ÷ 4 = 16', '64 ÷ 2 = 32', '3 × 16 = 48'], picture: cfFig(exPts, exX, exY, exSay, { curve: true }) },
  { title: 'Read the three', say: 'Across to the curve and down each time.', rows: [`Q₁ = ${eQ1}`, `Median = ${eMed}`, `Q₃ = ${eQ3}`], picture: cfFig(exPts, exX, exY, exSay, { curve: true, reads: [{ cf: 16, label: String(eQ1) }, { cf: 32, label: String(eMed) }, { cf: 48, label: String(eQ3) }] }) },
  { title: 'Draw the box plot', say: 'The smallest and largest come from the question: 0 and 12 hours.', rows: [`! 0, ${eQ1}, ${eMed}, ${eQ3}, 12`], picture: boxFig([{ five: [0, eQ1, eMed, eQ3, 12], values: true }], { from: 0, to: 12, step: 1, every: 2, title: 'Time (hours)' }, `A box plot: smallest 0, lower quartile ${eQ1}, median ${eMed}, upper quartile ${eQ3}, largest 12.`) },
], 'Box plot', cfFig(exPts, exX, exY, exSay, { curve: true })), 'The graph gives the quartiles and median; the smallest and largest values come from the question.')

/* ---------- More practice: our own numbers ---------- */

{
  const rows: [string, number][] = [['0 < x ≤ 10', 5], ['10 < x ≤ 20', 12], ['20 < x ≤ 30', 9], ['30 < x ≤ 40', 4]]
  ask(reading, 'Find the cumulative frequency for 20 < x ≤ 30.', 'Higher P13 review (own numbers)', cfTable('Value, x', rows, 'Frequencies 5, 12, 9 and 4 in four classes of 10.', 0, [[3, 2, 'x']]),
    number(26, '26'), '26', 'Add the frequencies of every class up to this one.', {
      kind: 'step-worked', start: 'Frequencies 5, 12, 9', steps: [
        { title: 'Add them up', why: 'Everything up to the end of this class.', lines: [line([part('5'), sign('+'), part('12'), sign('+'), part('9')], '26', { answer: true })] },
      ],
    }, { prefix: 'CF =' })
}
ask(reading, 'A cumulative frequency graph shows 120 values. Where do you read across for the upper quartile?', 'Higher P13 review (own numbers)', cfFig(hPts, hX, hY, hSay, { curve: true }),
  number(90, '90'), '90', 'Three quarters of the way up.', {
    kind: 'step-worked', start: 'n = 120', steps: [
      { title: 'Three quarters', why: 'The upper quartile is three quarters of the way up the cumulative frequency.', lines: [line([part('3'), sign('×'), part('120'), sign('÷'), part('4')], '90', { answer: true })] },
    ],
  }, { prefix: 'CF =' })

add('mixed', 'Cumulative frequency', 'Higher P13 consolidation', text(
  'Cumulative frequency: a running total, down the table.',
  'Plot each total at the end of its class, start at 0, and join with a smooth S-shaped curve.',
  'Read across at n ÷ 4, n ÷ 2 and 3n ÷ 4 for Q₁, the median and Q₃, then down.',
  'More than a value: read up from it, then take that from the total.',
))

export const tutorCumulativeFrequencyLesson: TutorMethodLesson = {
  id: 'L314H2', number: 314.6, title: 'Cumulative frequency', level: 'GCSE Higher',
  steadyPictures: true,
  largePictures: true,
  goal: 'Build a cumulative frequency table and graph, and read the median, quartiles and IQR from it.',
  labels: { [table]: 'Cumulative frequency tables', [graph]: 'Drawing the graph', [reading]: 'Reading the graph', mixed: 'Review' },
  states: finish(),
}

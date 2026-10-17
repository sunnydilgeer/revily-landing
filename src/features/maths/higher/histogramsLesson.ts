/*
 * Statistics 15H: Histograms, a Higher-only lesson after Bar charts (lesson 315), as in the book. From the Higher
 * revision guide, P15 Histograms (Level 6-7 and 8-9, p279–281): no gaps between the bars, the area (not the height) is
 * the frequency, frequency density = frequency ÷ class width; drawing one from a table; reading one, including with no
 * numbers up the side by finding what one square is worth; and the Level 8-9 problems (estimates over part of a bar, an
 * estimated mean, the median inside a bar).
 *
 * The book's numbers: Example 1 (71 pieces of string), Example 2 (the quiz: 44 people from 0 to 1.5 minutes, so 22
 * from 3 to 4), and Your Turn Q1 (plant heights), Q3 (cycling distances, the bars read to whole densities: 180 up to
 * 30 km, estimated mean 48 km). Q2 (breath-holding), Q4 (the fish) and Q5 (the 185 bags of flour) can't be read
 * exactly from the photos (Q4's table is shifted against its rows), so they use our own bars in the book's shape with
 * the book's given facts (54 people for at least a minute; 185 bags, 15 of them from 35 to 40 lb). Histograms whose
 * squares are counted sit on the lesson card's own squared paper, one square a unit.
 */
import { author } from '../../written-methods/tutor/content'
import type { FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import type { MicroSkillId } from '../../number-types/types'
import { tableFig } from '../../probability/tutor/chancePictures'
import { asks } from './figureHelpers'
import { density, histFig, squaresHistFig, type Axis, type Bar } from './statsHigherPictures'

const a = author(315.5, 'L315H')
const { add, finish } = a
const ask = asks(a)
const drawing = 'histogram-drawing'
const reading = 'histogram-reading'
const problems = 'histogram-problems'

function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: ReturnType<typeof boardModel>, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}

const fmt = (n: number) => Number(n.toFixed(2)).toString()
type Tones = [number, number, FigureTone][]
/** A grouped table with its frequency density column, filled in as far as `upTo` rows. */
function fdTable(head: string, bars: Bar[], spoken: string, upTo = 0, tones: Tones = []) {
  const name = (b: Bar) => `${fmt(b[0])} < ${head[0].toLowerCase()} ≤ ${fmt(b[1])}`
  return tableFig([[head, 'Freq.', 'Freq. density'], ...bars.map((b, k) => [name(b), String(b[2]), k < upTo ? fmt(density(b)) : ''])], spoken, { tones })
}

/* ---------- Rung 1: frequency density and drawing ---------- */

add(drawing, 'Histograms', 'Higher P15 Histograms', text(
  'A histogram shows grouped data, especially when the classes are different widths. There are no gaps between the bars.',
  'The area of a bar, not its height, is the frequency of its class.',
  'So the height is the frequency density: frequency density = frequency ÷ class width.',
))

const string: Bar[] = [[0, 20, 8], [20, 30, 13], [30, 35, 18], [35, 45, 20], [45, 60, 12]]
const stringSay = 'The lengths of 71 pieces of string in centimetres: 8, 13, 18, 20 and 12 in classes 0 to 20, 20 to 30, 30 to 35, 35 to 45 and 45 to 60.'
const stringX: Axis = { from: 0, to: 60, step: 5, every: 2, title: 'Length (cm)' }, stringY: Axis = { from: 0, to: 4, step: 0.5, every: 2, title: 'Frequency density' }
const st = (upTo = 0, tones: Tones = []) => fdTable('Length (cm)', string, stringSay, upTo, tones)
worked(drawing, 'Draw a histogram of the lengths of 71 pieces of string.', 'Drawing a histogram', 'Higher P15 Example 1 (book’s numbers)', boardModel([], [
  { title: 'Divide by the width', say: 'The first class runs from 0 to 20, so it is 20 wide. Its frequency density is its frequency over its width.', rows: ['8 ÷ 20 = 0.4'], picture: st(1, [[1, 2, 'lit']]) },
  { title: 'Every class', say: 'Each class has its own width: 10, 5, 10 and 15.', rows: ['13 ÷ 10 = 1.3', '18 ÷ 5 = 3.6', '20 ÷ 10 = 2', '12 ÷ 15 = 0.8'], picture: st(5) },
  { title: 'The bar heights', say: 'These are how tall the bars are drawn.', rows: ['! Heights 0.4, 1.3, 3.6, 2, 0.8'], picture: st(5, [[1, 2, 'found'], [2, 2, 'found'], [3, 2, 'found'], [4, 2, 'found'], [5, 2, 'found']]) },
], 'Frequency density', st()), 'Work out each class width, then divide each frequency by it.')
// The drawing is its own example: a table and a chart in one example would be fitted to one scale (steady pictures).
const stringSaid = `A histogram of the string lengths: bars of height ${string.map(b => fmt(density(b))).join(', ')}.`
const sh = (o: Parameters<typeof histFig>[4] = {}) => histFig(string, stringX, stringY, stringSaid, o)
worked(drawing, 'Draw the histogram of the string lengths, with frequency densities 0.4, 1.3, 3.6, 2 and 0.8.', 'Drawing the bars', 'Higher P15 Example 1 (book’s numbers)', boardModel([], [
  { title: 'The first bar', say: 'From 0 to 20 across, and 0.4 up the frequency density axis.', rows: ['>0 0 to 20, height 0.4'], picture: sh({ hidden: [1, 2, 3, 4], tones: { 0: 'lit' }, marks: { 0: '0.4' } }) },
  { title: 'Every bar', say: 'Each bar as wide as its class and as tall as its frequency density, with no gaps.', rows: ['! Bars touch, widths differ'], picture: sh({ marks: { 0: '0.4', 1: '1.3', 2: '3.6', 3: '2', 4: '0.8' } }) },
], 'Histogram', sh({ hidden: [0, 1, 2, 3, 4] })), 'Draw bars as wide as each class and as tall as its frequency density, touching. Label the side frequency density.')

const plants: Bar[] = [[0, 10, 6], [10, 20, 15], [20, 24, 16], [24, 30, 21], [30, 50, 18]]
const plantsSay = 'Plant heights in centimetres: 6, 15, 16, 21 and 18 in classes 0 to 10, 10 to 20, 20 to 24, 24 to 30 and 30 to 50.'
const pl = (upTo = 0, tones: Tones = []) => fdTable('Height (cm)', plants, plantsSay, upTo, tones)
ask(drawing, 'Work out the frequency density for the class 20 < h ≤ 24.', 'Higher P15 Your Turn Q1 (book’s numbers)', pl(2, [[3, 2, 'x']]),
  number(4, '4'), '4', 'This class is only 4 wide.', {
    kind: 'step-worked', start: 'Frequency 16, from 20 to 24', steps: [
      { title: 'The class width', why: 'The top of the class take away the bottom.', lines: [line([part('24'), sign('−'), part('20')], '4')] },
      { title: 'Divide', why: 'Frequency density is the frequency divided by the class width.', lines: [line([part('16'), sign('÷'), part('4')], '4', { answer: true })] },
    ],
  }, { prefix: 'FD =' })
ask(drawing, 'Work out the frequency density for the class 30 < h ≤ 50.', 'Higher P15 Your Turn Q1 (book’s numbers)', pl(4, [[5, 2, 'x']]),
  number(0.9, '0.9'), '0.9', 'Find the class width first.', {
    kind: 'step-worked', start: 'Frequency 18, from 30 to 50', steps: [
      { title: 'The class width', why: 'The top of the class take away the bottom.', lines: [line([part('50'), sign('−'), part('30')], '20')] },
      { title: 'Divide', why: 'Frequency density is the frequency divided by the class width.', lines: [line([part('18'), sign('÷'), part('20')], '0.9', { answer: true })] },
    ],
  }, { prefix: 'FD =' })
{
  const p = histFig(plants, { from: 0, to: 50, step: 5, every: 2, title: 'Height (cm)' }, { from: 0, to: 4, step: 0.5, every: 2, title: 'Frequency density' }, `The plant heights as a histogram: bars of height ${plants.map(b => fmt(density(b))).join(', ')}.`)
  ask(drawing, 'In the plants’ histogram, the tallest bar is 20 < h ≤ 24, but 24 < h ≤ 30 has more plants. Why?', 'Higher P15 Your Turn Q1 (book’s numbers)', p,
    choose('The area is the frequency, and 20 to 24 is a narrow class',
      ['The histogram is drawn wrongly', 'It is right: 16 plants in a class 4 wide is a density of 4, the highest.'],
      ['The height is the frequency', 'On a histogram the height is the frequency density. The bar for 24 to 30 is shorter but wider.']),
    'The area is the frequency, and 20 to 24 is a narrow class', 'What does the height of a histogram bar show?', {
      kind: 'step-worked', start: '16 plants over 4 cm; 21 plants over 6 cm', steps: [
        { title: 'Height is density', why: 'Sixteen plants squeezed into a class four wide make a tall, thin bar; twenty-one spread over six make a shorter, wider one with more area.', words: 'The area is the frequency, and 20 to 24 is a narrow class' },
      ],
    })
}

/* ---------- Rung 2: reading a histogram ---------- */

// Example 2 on squares: a square is a quarter of a minute across, so the bars are 4, 2, 2, 4 and 4 squares wide.
const quiz = (tones: ('lit' | 'found' | undefined)[] = [], marks: (string | undefined)[] = []) => squaresHistFig([
  { from: 0, w: 4, h: 7, tone: tones[0], mark: marks[0] }, { from: 4, w: 2, h: 8, tone: tones[1], mark: marks[1] }, { from: 6, w: 2, h: 11 },
  { from: 8, w: 4, h: 9 }, { from: 12, w: 4, h: 5.5, tone: tones[4], mark: marks[4] },
], [[0, '0'], [4, '1'], [8, '2'], [12, '3'], [16, '4']], 'A histogram of the times to finish a quiz, in minutes, with no numbers up the side: bars from 0 to 1, 1 to 1.5, 1.5 to 2, 2 to 3 and 3 to 4 minutes.', 'Time (minutes)')
worked(reading, 'The histogram shows times taken to finish a quiz. 44 people took up to 1.5 minutes. How many took between 3 and 4 minutes?', 'No scale up the side', 'Higher P15 Example 2 (book’s numbers)', boardModel([], [
  { title: 'Count the squares', say: 'Up to 1.5 minutes is all of the first bar and the second. Count the squares in each: area is frequency.', rows: ['4 × 7 = 28', '2 × 8 = 16', '28 + 16 = 44 squares'], picture: quiz(['lit', 'lit'], ['28', '16']) },
  { title: 'One square', say: 'Those 44 squares are 44 people.', rows: ['44 ÷ 44 = 1 person a square'], picture: quiz(['lit', 'lit']) },
  { title: 'The last bar', say: 'From 3 to 4 minutes the bar is 4 squares wide and 5½ tall.', rows: ['4 × 5.5 = 22 squares', '! 22 people'], picture: quiz([undefined, undefined, undefined, undefined, 'found'], [undefined, undefined, undefined, undefined, '22']) },
], 'Read', quiz()), 'With no numbers up the side, use the people you are told about to find what one square is worth, then count the squares you want.')

const cycle: Bar[] = [[0, 20, 80], [20, 30, 100], [30, 60, 60], [60, 70, 90], [70, 90, 120]]
const cycleX: Axis = { from: 0, to: 90, step: 10, every: 1, title: 'Distance (km)' }, cycleY: Axis = { from: 0, to: 10, step: 1, every: 2, title: 'Frequency density' }
const cycleSay = 'A histogram of cycling routes in kilometres: frequency densities 4, 10, 2, 9 and 6 for 0 to 20, 20 to 30, 30 to 60, 60 to 70 and 70 to 90.'
const cyc = (o: Parameters<typeof histFig>[4] = {}) => histFig(cycle, cycleX, cycleY, cycleSay, o)
ask(reading, 'The histogram shows how far cyclists rode. Estimate how many rode 30 km or less.', 'Higher P15 Your Turn Q3a (book’s numbers)', cyc({ tones: { 0: 'lit', 1: 'lit' } }),
  number(180, '180'), '180', 'Frequency = frequency density × class width, for each bar up to 30.', {
    kind: 'step-worked', start: 'Densities 4 and 10', steps: [
      { title: 'First bar', why: 'Its area: the frequency density times the class width, twenty.', lines: [line([part('4'), sign('×'), part('20')], '80')] },
      { title: 'Second bar', why: 'The same for the bar from twenty to thirty, ten wide.', lines: [line([part('10'), sign('×'), part('10')], '100')] },
      { title: 'Add them', why: 'Every cyclist up to thirty kilometres is in one of those two bars.', lines: [line([part('80'), sign('+'), part('100')], '180', { answer: true })] },
    ],
  }, { prefix: 'Cyclists =' })
ask(reading, 'Find an estimate for the mean journey length, to the nearest kilometre.', 'Higher P15 Your Turn Q3b (book’s numbers)', cyc({ marks: { 0: '80', 1: '100', 2: '60', 3: '90', 4: '120' } }),
  number(48, '48 km'), '48', 'Find each frequency from its bar, then midpoints, f × m, add up and divide.', {
    kind: 'step-worked', start: 'Frequencies 80, 100, 60, 90, 120', steps: [
      { title: 'Total frequency', why: 'Add the frequencies of every bar.', lines: [line([part('80'), sign('+'), part('100'), sign('+'), part('60'), sign('+'), part('90'), sign('+'), part('120')], '450')] },
      { title: 'Midpoints times f', why: 'Each class’s midpoint times its frequency, all added up.', lines: [line([part('10 × 80'), sign('+'), part('25 × 100'), sign('+'), part('45 × 60'), sign('+'), part('65 × 90'), sign('+'), part('80 × 120')], '21450')] },
      { title: 'Divide', why: 'The total distance divided by the number of cyclists, then rounded to a whole kilometre.', lines: [line([part('21450'), sign('÷'), part('450')], '47.66…'), line([part('to the nearest km')], '48', { eq: true, answer: true })] },
    ],
  }, { label: 'Mean (km)', prefix: 'Mean ≈' })
{
  const fish: Bar[] = [[0, 4, 15], [4, 10, 15], [10, 20, 32], [20, 40, 22], [40, 45, 42], [45, 55, 30], [55, 70, 9]]
  const p = histFig(fish, { from: 0, to: 70, step: 5, every: 2, title: 'Length (cm)' }, { from: 0, to: 10, step: 1, every: 2, title: 'Frequency density' }, 'A histogram of fish lengths. The bar from 0 to 4 cm has a frequency density of 3.75.', { hidden: [2, 3, 4, 5, 6], tones: { 0: 'x' }, marks: { 0: '3.75' } })
  ask(reading, 'The bar for 0 < l ≤ 4 has frequency density 3.75. How many fish are in that class?', 'Higher P15 Your Turn Q4 (own numbers)', p,
    number(15, '15'), '15', 'Frequency = frequency density × class width.', {
      kind: 'step-worked', start: 'Density 3.75, from 0 to 4', steps: [
        { title: 'Area of the bar', why: 'The frequency is the bar’s area: its height times its width.', lines: [line([part('3.75'), sign('×'), part('4')], '15', { answer: true })] },
      ],
    }, { prefix: 'Fish =' })
  const q = histFig(fish, { from: 0, to: 70, step: 5, every: 2, title: 'Length (cm)' }, { from: 0, to: 10, step: 1, every: 2, title: 'Frequency density' }, 'The fish histogram so far: bars for 0 to 4, 4 to 10, 10 to 20 and 20 to 40 cm. 42 fish are from 40 to 45 cm, not drawn yet.', { hidden: [4, 5, 6] })
  ask(reading, '42 fish are from 40 to 45 cm. How tall should that bar be?', 'Higher P15 Your Turn Q4 (own numbers)', q,
    number(8.4, '8.4'), '8.4', 'The class is only 5 wide.', {
      kind: 'step-worked', start: '42 fish, from 40 to 45', steps: [
        { title: 'Divide', why: 'The bar’s height is the frequency density: the frequency divided by the class width, five.', lines: [line([part('42'), sign('÷'), part('5')], '8.4', { answer: true })] },
      ],
    }, { prefix: 'FD =' })
}

/* ---------- Rung 3: problems (Level 8-9) ---------- */

// Q2 on squares, a square 5 seconds across: 3 people a square, from the 54 who held for at least a minute.
const breath = (tones: ('lit' | 'found' | undefined)[] = [], marks: (string | undefined)[] = []) => squaresHistFig([
  { from: 0, w: 4, h: 4 }, { from: 4, w: 2, h: 11, tone: tones[1], mark: marks[1] }, { from: 6, w: 4, h: 6, tone: tones[2], mark: marks[2] },
  { from: 10, w: 4, h: 4.5, tone: tones[3], mark: marks[3] }, { from: 14, w: 6, h: 1.5, tone: tones[4], mark: marks[4] },
], [[0, '0'], [4, '20'], [8, '40'], [12, '60'], [16, '80'], [20, '100']], 'A histogram of how long people held their breath, in seconds, with no numbers up the side: bars from 0 to 20, 20 to 30, 30 to 50, 50 to 70 and 70 to 100.', 'Time (seconds)')
ask(problems, '54 people held their breath for at least a minute. How many held it for between 20 and 40 seconds?', 'Higher P15 Your Turn Q2 (own bars, book’s 54)', breath(),
  number(102, '102'), '102', 'Count the squares from 60 seconds on to find what one square is worth.', {
    kind: 'step-worked', start: 'A square is 5 seconds across', steps: [
      { title: 'Squares past a minute', why: 'From sixty to seventy is two squares wide and four and a half tall; from seventy to a hundred is six wide and one and a half tall.', lines: [line([part('2 × 4.5'), sign('+'), part('6 × 1.5')], '18')] },
      { title: 'One square', why: 'Those squares are the fifty-four people.', lines: [line([part('54'), sign('÷'), part('18')], '3')] },
      { title: 'From 20 to 40', why: 'All of the twenty to thirty bar, and half the width of the next one.', lines: [line([part('2 × 11'), sign('+'), part('2 × 6')], '34')] },
      { title: 'Into people', why: 'Each square is three people.', lines: [line([part('34'), sign('×'), part('3')], '102', { answer: true })] },
    ],
  }, { prefix: 'People =' })

// Q5 on squares, a square 5 lb across from 30 lb: 185 bags in 74 squares, 2.5 bags a square.
const flourBars = [{ from: 0, w: 4, h: 6 }, { from: 4, w: 1, h: 8 }, { from: 5, w: 1, h: 12 }, { from: 6, w: 2, h: 5 }, { from: 8, w: 4, h: 2 }, { from: 12, w: 1, h: 12 }]
const flour = (tones: Partial<Record<number, 'lit' | 'found'>> = {}, marks: Partial<Record<number, string>> = {}) => squaresHistFig(flourBars.map((b, k) => ({ ...b, tone: tones[k], mark: marks[k] })),
  [[0, '30'], [2, '40'], [4, '50'], [6, '60'], [8, '70'], [10, '80'], [12, '90']], 'A histogram of 185 bags of flour by weight in pounds, with no numbers up the side: bars from 30 to 50, 50 to 55, 55 to 60, 60 to 70, 70 to 90 and 90 to 95.', 'Weight (pounds)')
worked(problems, '185 bags of flour; 15 of them weigh between 35 and 40 pounds. Find what one square of the histogram is worth.', 'What a square is worth', 'Higher P15 Your Turn Q5 (own bars, book’s 185 and 15)', boardModel([], [
  { title: 'Squares for 35 to 40', say: 'From 35 to 40 is one square wide under the first bar, which is 6 squares tall.', rows: ['1 × 6 = 6 squares'], picture: flour({ 0: 'lit' }) },
  { title: 'One square', say: 'Those 6 squares are the 15 bags.', rows: ['15 ÷ 6 = 2.5 bags a square'] },
  { title: 'Check the total', say: 'Count every square: they should be all 185 bags.', rows: ['24 + 8 + 12 + 10 + 8 + 12 = 74', '74 × 2.5 = 185 ✓', '! 1 square = 2.5 bags'], picture: flour() },
], 'Scale', flour()), 'Turn the fact you’re given into a value for one square, and check it against the total if you can.')
ask(problems, 'Using 2.5 bags a square, how many bags of flour weigh more than 80 pounds?', 'Higher P15 Your Turn Q5a (own bars)', flour({ 4: 'lit', 5: 'lit' }),
  number(40, '40'), '40', 'Only the part of the 70 to 90 bar past 80 counts.', {
    kind: 'step-worked', start: '1 square = 2.5 bags', steps: [
      { title: 'From 80 to 90', why: 'Half of the seventy to ninety bar: two squares wide, two tall.', lines: [line([part('2'), sign('×'), part('2')], '4')] },
      { title: 'From 90 to 95', why: 'One square wide and twelve tall.', lines: [line([part('1'), sign('×'), part('12')], '12')] },
      { title: 'Into bags', why: 'Add the squares and times by two and a half bags each.', lines: [line([part('(4 + 12)'), sign('×'), part('2.5')], '40', { answer: true })] },
    ],
  }, { prefix: 'Bags =' })
ask(problems, 'Why is your answer for bags over 80 pounds only an estimate?', 'Higher P15 Your Turn Q5b', flour({ 4: 'lit' }),
  choose('We assume the bags in 70 to 90 are spread evenly across it',
    ['The histogram has no numbers up the side', 'We worked out exactly what a square is worth, so that isn’t the reason.'],
    ['Some bags might weigh exactly 80 pounds', 'That is about where the boundary goes, not why it is an estimate.']),
  'We assume the bags in 70 to 90 are spread evenly across it', 'We split one bar in half. What did that assume?', {
    kind: 'step-worked', start: 'Half of the 70 to 90 bar was counted', steps: [
      { title: 'Inside a class', why: 'The histogram only says how many bags are between seventy and ninety, not where. Taking half assumes they are spread evenly.', words: 'We assume the bags in 70 to 90 are spread evenly across it' },
    ],
  })
ask(problems, 'Estimate the median weight of a bag of flour, to 2 decimal places.', 'Higher P15 Your Turn Q5c (own bars)', flour({ 0: 'lit', 1: 'lit', 2: 'found' }, { 0: '60', 1: '20', 2: '30' }),
  number(57.08, '57.08 pounds'), '57.08', 'The median is the 92.5th bag. Count bags bar by bar, then go part way into its bar.', {
    kind: 'step-worked', start: '185 bags; bars hold 60, 20, 30, …', steps: [
      { title: 'Halfway', why: 'The median is halfway through the bags.', lines: [line([part('185'), sign('÷'), part('2')], '92.5')] },
      { title: 'Find its bar', why: 'Up to fifty-five pounds there are eighty bags; the next bar holds thirty more, so the median is in fifty-five to sixty.', lines: [line([part('92.5'), sign('−'), part('80')], '12.5')] },
      { title: 'Part way in', why: 'Twelve and a half of that bar’s thirty bags, as a share of its five pounds, added to fifty-five.', lines: [line([part('55'), sign('+'), part('12.5 ÷ 30 × 5')], '57.083…'), line([part('to 2 dp')], '57.08', { eq: true, answer: true })] },
    ],
  }, { label: 'Median (pounds)', prefix: 'Median ≈' })

/* ---------- More practice: our own numbers ---------- */

ask(problems, 'A class 15 < x ≤ 25 has frequency 30. What is its frequency density?', 'Higher P15 review (own numbers)', fdTable('x', [[15, 25, 30]], 'One class from 15 to 25 with frequency 30.', 0, [[1, 2, 'x']]),
  number(3, '3'), '3', 'Divide by the class width.', {
    kind: 'step-worked', start: 'Frequency 30, width 10', steps: [
      { title: 'Divide', why: 'Frequency density is the frequency divided by the class width, ten.', lines: [line([part('30'), sign('÷'), part('10')], '3', { answer: true })] },
    ],
  }, { prefix: 'FD =' })
ask(problems, 'A bar is 2.5 tall and runs from 40 to 60. What is its frequency?', 'Higher P15 review (own numbers)', histFig([[40, 60, 50]], { from: 40, to: 60, step: 5, every: 2 }, { from: 0, to: 3, step: 0.5, every: 2, title: 'Frequency density' }, 'One histogram bar from 40 to 60, frequency density 2.5.'),
  number(50, '50'), '50', 'Area = frequency.', {
    kind: 'step-worked', start: 'Density 2.5, width 20', steps: [
      { title: 'Area of the bar', why: 'Height times width gives the frequency.', lines: [line([part('2.5'), sign('×'), part('20')], '50', { answer: true })] },
    ],
  }, { prefix: 'Frequency =' })

add('mixed', 'Histograms', 'Higher P15 consolidation', text(
  'Frequency density = frequency ÷ class width: the height of each bar.',
  'Area = frequency: frequency = frequency density × class width. No gaps between the bars.',
  'No numbers up the side? Use a frequency you’re told to find what one square is worth.',
  'Part of a bar: take the same fraction of its frequency, assuming the data is spread evenly.',
))

export const tutorHistogramsLesson: TutorMethodLesson = {
  id: 'L315H', number: 315.5, title: 'Histograms', level: 'GCSE Higher',
  steadyPictures: true,
  largePictures: true,
  goal: 'Draw histograms with frequency density, read frequencies from their areas, and solve problems with them.',
  labels: { [drawing]: 'Frequency density', [reading]: 'Reading histograms', [problems]: 'Histogram problems', mixed: 'Review' },
  states: finish(),
}

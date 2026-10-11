import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { barFig } from './statsPictures'

/*
 * Statistics lesson 15: Bar charts. From P15 in Sunny's revision book (p204–206): how to draw a bar chart (100
 * students' transport), reading one (the ice cream survey, strawberry as a percentage), and Your Turn: toast toppings,
 * the bookshop's sales, a dual bar chart of transport, and the adults' and children's fruit and vegetables.
 *
 * Three rungs: draw a bar chart, built on the chart board (ChartBoard.tsx); read one, for totals, differences and
 * percentages; and dual bar charts, two groups side by side. Each rung opens with something to touch or a guess.
 *
 * Your Turn Q4's bars, as photographed, don't add up to the 70 adults and 70 children the question states, so that
 * question uses our own numbers that do. Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(315)
const { add, finish } = lesson
const { worked, practice, ask, chartPlay, chart } = chanceScreens(lesson)
const draw = 'bar-draw'
const read = 'bar-read'
const dual = 'bar-dual'

const transport = ['Walk', 'Cycle', 'Car', 'Bus', 'Train'], transportN = [29, 15, 35, 18, 3]
const iceCream = ['Choc', 'Vanilla', 'Straw.', 'Mint', 'Other'], iceN = [12, 16, 5, 3, 6]
const toast = ['Marmite', 'Butter', 'Jam', 'Peanut', 'Choc', 'Other'], toastN = [4, 15, 12, 24, 10, 10]
const books = ['Paperback', 'Hardback', 'Audio'], booksN = [12, 5, 3]
const modes = ['Walk', 'Bike', 'Bus', 'Car', 'Scooter'], boys = [6, 7, 4, 5, 3], girls = [4, 8, 9, 6, 0]
const servings = ['0–5', '6–10', '11–15', '16–20', '20+'], adults = [5, 12, 13, 22, 18], children = [16, 24, 15, 9, 6]

/* ---------- Rung 1: drawing a bar chart ---------- */

chartPlay(draw, 'Drag the bars. Watch the total.', 'P15 p204 How to draw a bar chart (play)', { mode: 'bars', labels: transport, values: [20, 10, 25, 12, 5], max: 40, show: 'total' })
ask(draw, 'Guess first: the biggest frequency is 35. What should the scale on the side go up to?', 'P15 p204 (guess first)', ['Walk 29, Cycle 15, Car 35, Bus 18, Train 3'], choose('40, a little over 35',
  ['30', 'The car bar, 35, wouldn’t fit on the chart.'], ['100', 'It fits, but every bar is squashed into the bottom and hard to read.']),
'The tallest bar has to fit, and the bars should fill the space.', boardModel([], [
  { title: 'Fit the tallest bar', say: 'The scale must reach at least 35. Going up in 5s to 40 fits it and keeps the bars big.', rows: ['! Up to 40, in steps of 5'] },
], 'Scale'))
{
  const p = barFig(transport, [transportN], 'A bar chart of how 100 students get to school.', { max: 40, step: 10, values: true, yTitle: 'Frequency' })
  worked(draw, '100 students were asked how they get to school. Draw a bar chart of the results.', 'Drawing a bar chart', 'P15 p204 How to draw a bar chart (book’s numbers)', boardModel([], [
    { title: 'Choose the scale', say: 'The biggest frequency is 35, so the side goes up to 40, in 5s.', rows: ['Biggest = 35 → scale 0 to 40'], picture: barFig(transport, [[0, 0, 0, 0, 0]], 'Empty axes, 0 to 40.', { max: 40, step: 10, yTitle: 'Frequency' }) },
    { title: 'Draw each bar', say: 'One bar for each way of travelling, all the same width, with gaps between them.', rows: ['>0 Walk 29, Cycle 15, Car 35, Bus 18, Train 3'], picture: barFig(transport, [transportN], 'The five bars.', { max: 40, step: 10, yTitle: 'Frequency', tones: [[0, 2, 'lit']] }) },
    { title: 'Label it', say: 'Label both axes and give the chart a title.', rows: ['! Gaps, equal widths, labels, a title'], picture: p },
  ], 'Bar chart', p), 'A bar chart has a bar for each category, all the same width, with gaps between them. Choose a scale that fits the tallest bar, and label both axes.')
}
chart(draw, 'Build the toast bar chart: drag each bar to its frequency. Marmite 4, Butter 15, Jam 12, Peanut butter 24, Chocolate 10, Other 10.', 'P15 Your Turn Q1 (book’s numbers)',
  { mode: 'bars', labels: toast, values: [0, 0, 0, 0, 0, 0], max: 30 }, [toastN.join(',')], toastN.join(', '), 'Drag each bar until the number on top matches the table.', boardModel([], [
    { title: 'One bar each', say: 'Each topping gets a bar as tall as its frequency.', rows: ['>0 Marmite 4, Butter 15, Jam 12', '>0 Peanut 24, Choc 10, Other 10'], picture: barFig(toast, [toastN], 'The toast bar chart.', { max: 30, step: 10, values: true, yTitle: 'Frequency' }) },
  ], 'Bar chart'), r => { const got = r.split(',').map(Number), k = got.findIndex((n, i) => n !== toastN[i]); return k < 0 ? 'Check every bar.' : `${toast[k]} should be ${toastN[k]}, not ${got[k]}.` })
{
  const p = barFig(toast, [toastN], 'The toast bar chart.', { max: 30, step: 10, values: true, yTitle: 'Frequency' })
  practice(draw, 'How many people were asked about their toast?', 'P15 Your Turn Q1 (book’s numbers)', p, number(75, '75'), 'Add up every bar.', boardModel([], [
    { title: 'Add the bars', say: 'Everyone asked is in exactly one bar.', rows: ['4 + 15 + 12 + 24 + 10 + 10 = 75', '! 75 people'], picture: barFig(toast, [toastN], 'Every bar lit.', { max: 30, step: 10, values: true, yTitle: 'Frequency', tones: toastN.map((_, k) => [0, k, 'lit'] as [number, number, 'lit']) }) },
  ], 'Total', p), slips(75, [[24, 'That’s the tallest bar. Add up all six.'], [6, 'That’s how many toppings. Add up the frequencies.']]), { label: 'People', prefix: 'Total =' })
}

/* ---------- Rung 2: reading a bar chart ---------- */

{
  const p = barFig(iceCream, [iceN], 'Ice cream votes: chocolate 12, vanilla 16, strawberry 5, mint choc 3, other 6.', { max: 18, step: 6, values: true, yTitle: 'Frequency' })
  practice(read, 'Guess first: is strawberry more or less than 10% of the votes?', 'P15 p205 (guess first)', p, choose('Just more: about 12%',
    ['Less', '10% of 42 is 4.2, and 5 votes is a little more than that.'], ['Exactly 10%', '10% of 42 is 4.2, not 5.']),
  'Find 10% of the total first.', boardModel([], [
    { title: 'Find the total', say: 'Add every bar.', rows: ['12 + 16 + 5 + 3 + 6 = 42'] },
    { title: 'Compare', say: '10% of 42 is 4.2. Strawberry has 5, a little more.', rows: ['! Just more than 10%'] },
  ], 'Percentage', p))
}
{
  const p = barFig(iceCream, [iceN], 'Ice cream votes.', { max: 18, step: 6, yTitle: 'Frequency' })
  worked(read, 'What percentage of the people chose strawberry?', 'Reading a bar chart', 'P15 p205 Understanding bar charts (book’s numbers)', boardModel([], [
    { title: 'Read each bar', say: 'Read across from the top of each bar to the scale.', rows: ['>0 Choc 12, Vanilla 16, Straw. 5, Mint 3, Other 6'], picture: barFig(iceCream, [iceN], 'Every bar read off.', { max: 18, step: 6, values: true, yTitle: 'Frequency' }) },
    { title: 'Find the total', say: 'Everyone asked is in one bar.', rows: ['12 + 16 + 5 + 3 + 6 = 42'] },
    { title: 'As a percentage', say: 'Strawberry’s share of 42, times 100.', rows: ['5 ÷ 42 × 100 = 11.9%', '! 11.9% (1 dp)'], picture: barFig(iceCream, [iceN], 'Strawberry lit.', { max: 18, step: 6, yTitle: 'Frequency', tones: [[0, 2, 'found']] }) },
  ], 'Percentage', p), 'Read a bar across to the scale; check what each line is worth first. A fraction of the total is that bar ÷ the sum of every bar.')
}
{
  const p = barFig(books, [booksN], 'Bookshop sales in thousands: paperbacks 12, hardbacks 5, audiobooks 3.', { max: 15, step: 5, yTitle: 'Sales (thousands)' })
  practice(read, 'What percentage of the bookshop’s sales were audiobooks?', 'P15 Your Turn Q2a (book’s numbers)', p, number(15, '15%'), 'Find the total of all three bars first.', boardModel([], [
    { title: 'Read the bars', say: 'Each line is 1 thousand.', rows: ['>0 Paperbacks 12, Hardbacks 5, Audio 3'], picture: barFig(books, [booksN], 'Every bar read off.', { max: 15, step: 5, values: true, yTitle: 'Sales (thousands)' }) },
    { title: 'As a percentage', say: 'Audiobooks out of the total.', rows: ['12 + 5 + 3 = 20', '3 ÷ 20 × 100 = 15', '! 15%'], picture: barFig(books, [booksN], 'Audiobooks lit.', { max: 15, step: 5, values: true, yTitle: 'Sales (thousands)', tones: [[0, 2, 'found']] }) },
  ], 'Percentage', p), slips(15, [[3, 'That’s the audiobook bar. As a percentage: 3 ÷ 20 × 100.'], [25, 'That’s 3 out of 12, the paperbacks. Use the total of all three, 20.']]), { label: 'Percentage (%)', prefix: 'Audio =' })
}
{
  const p = barFig(books, [booksN], 'Bookshop sales in thousands.', { max: 15, step: 5, values: true, yTitle: 'Sales (thousands)' })
  practice(read, 'How many more paperbacks than hardbacks were sold?', 'P15 Your Turn Q2 (book’s numbers)', p, number(7000, '7000'), 'The scale is in thousands.', boardModel([], [
    { title: 'The difference', say: 'Paperbacks take away hardbacks.', rows: ['12 − 5 = 7 thousand'] },
    { title: 'In thousands', say: 'The scale counts thousands of books.', rows: ['7 × 1000 = 7000', '! 7000 more'] },
  ], 'Difference', p), slips(7000, [[7, 'That’s 7 thousand. Write the number of books.'], [17000, 'Take them away, don’t add.']]), { label: 'Books', prefix: 'More =' })
}

/* ---------- Rung 3: dual bar charts ---------- */

{
  const p = barFig(modes, [boys, girls], 'A dual bar chart: boys and girls by how they travel.', { max: 10, step: 5, legend: ['Boys', 'Girls'], yTitle: 'Frequency' })
  practice(dual, 'Guess first: does this chart show more boys or more girls?', 'P15 Your Turn Q3 (guess first)', p, choose('More girls',
    ['More boys', 'Boys win walking and scooters, but add them: boys 25, girls 27.'], ['The same', 'Add each colour: boys 25, girls 27.']),
  'Add up each colour’s bars.', boardModel([], [
    { title: 'Add each colour', say: 'The shaded bars are boys, the clear ones girls.', rows: ['Boys: 6 + 7 + 4 + 5 + 3 = 25', 'Girls: 4 + 8 + 9 + 6 + 0 = 27', '! More girls'] },
  ], 'Totals', p))
}
{
  const p = barFig(modes, [boys, girls], 'A dual bar chart: boys and girls by how they travel.', { max: 10, step: 5, legend: ['Boys', 'Girls'], yTitle: 'Frequency' })
  worked(dual, 'Which way of travelling has the biggest difference between boys and girls?', 'Dual bar charts', 'P15 Your Turn Q3 (book’s numbers)', boardModel([], [
    { title: 'Two bars per group', say: 'A dual bar chart puts the two groups side by side, with a key to say which is which.', rows: ['>0 Walk 6 and 4, Bike 7 and 8, Bus 4 and 9', '>0 Car 5 and 6, Scooter 3 and 0'], picture: barFig(modes, [boys, girls], 'Every bar read off.', { max: 10, step: 5, legend: ['Boys', 'Girls'], values: true, yTitle: 'Frequency' }) },
    { title: 'Compare each pair', say: 'Take the shorter bar from the taller in each pair.', rows: ['>0 2, 1, 5, 1, 3', '! Bus: 9 − 4 = 5'], picture: barFig(modes, [boys, girls], 'The bus pair lit.', { max: 10, step: 5, legend: ['Boys', 'Girls'], yTitle: 'Frequency', tones: [[0, 2, 'lit'], [1, 2, 'found']] }) },
  ], 'Difference', p), 'A dual bar chart shows two groups side by side, with a key. Compare the two bars in a pair, or add up one colour for that group’s total.')
}
const fruit = (tones: [number, number, 'lit' | 'found'][] = [], values = false) => barFig(servings, [adults, children], 'Servings of fruit and vegetables a week, 70 adults and 70 children.', { max: 30, step: 10, legend: ['Adults', 'Children'], tones, values, yTitle: 'Frequency' })
practice(dual, 'How many adults and children together eat 0 to 5 servings a week?', 'P15 Your Turn Q4a (own numbers)', fruit(), number(21, '21'), 'Add the two bars over 0–5.', boardModel([], [
  { title: 'Add the pair', say: 'Read both bars over 0–5.', rows: ['>0 Adults 5, children 16', '5 + 16 = 21', '! 21 people'], picture: fruit([[0, 0, 'lit'], [1, 0, 'lit']], true) },
], 'Total', fruit()), slips(21, [[16, 'That’s just the children. Add the adults too.'], [5, 'That’s just the adults. Add the children too.']]), { label: 'People', prefix: 'Total =' })
practice(dual, 'How many more children eat 6 to 10 servings than eat over 20?', 'P15 Your Turn Q4b (own numbers)', fruit(), number(18, '18'), 'Use the children’s bars only.', boardModel([], [
  { title: 'The two bars', say: 'Children: 24 eat 6–10, and 6 eat over 20.', rows: ['24 − 6 = 18', '! 18 more'], picture: fruit([[1, 1, 'lit'], [1, 4, 'lit']], true) },
], 'Difference', fruit()), slips(18, [[12, 'That’s the adults’ 6–10 bar take the children’s over-20 one. Use the children’s bars only.'], [30, 'Take them away, don’t add.']]), { label: 'Children', prefix: 'More =' })
practice(dual, 'What basic trend does the chart show?', 'P15 Your Turn Q4d (own numbers)', fruit(), choose('Adults eat more fruit and veg than children',
  ['Children eat more fruit and veg than adults', 'The children’s bars are tallest at the low end, 0–10 servings; the adults’ at the high end.'], ['They eat about the same', 'The adults’ bars are taller from 16 servings up, and the children’s up to 10.']),
'Where are each group’s tall bars: few servings or many?', boardModel([], [
  { title: 'Where the tall bars are', say: 'Most children are in 0–10; most adults in 16 and over.', rows: ['! Adults eat more fruit and veg'], picture: fruit([[0, 3, 'lit'], [0, 4, 'lit'], [1, 0, 'lit'], [1, 1, 'lit']]) },
], 'Trend', fruit()))

/* ---------- Review: one of each, our own numbers ---------- */

chart('mixed', 'Build the bar chart: Red 8, Blue 14, Green 5, Yellow 11.', 'P15 review (own numbers)', { mode: 'bars', labels: ['Red', 'Blue', 'Green', 'Yellow'], values: [0, 0, 0, 0], max: 16 }, ['8,14,5,11'], '8, 14, 5, 11',
  'Drag each bar to its number.', boardModel([], [{ title: 'One bar each', say: 'Each bar as tall as its frequency.', rows: ['! Red 8, Blue 14, Green 5, Yellow 11'] }], 'Bar chart'),
  r => { const got = r.split(',').map(Number), want = [8, 14, 5, 11], names = ['Red', 'Blue', 'Green', 'Yellow'], k = got.findIndex((n, i) => n !== want[i]); return k < 0 ? 'Check every bar.' : `${names[k]} should be ${want[k]}, not ${got[k]}.` })
{
  const names = ['Red', 'Blue', 'Green', 'Yellow'], values = [8, 14, 5, 11]
  const p = barFig(names, [values], 'Red 8, blue 14, green 5, yellow 11.', { max: 16, step: 8, values: true, yTitle: 'Frequency' })
  practice('mixed', 'What percentage chose blue? Give it to 1 decimal place.', 'P15 review (own numbers)', p, number(36.8, '36.8%'), 'Blue out of the total, times 100.', boardModel([], [
    { title: 'Total', say: 'Add every bar.', rows: ['8 + 14 + 5 + 11 = 38'] },
    { title: 'As a percentage', say: 'Blue out of 38.', rows: ['14 ÷ 38 × 100 = 36.84…', '! 36.8% (1 dp)'] },
  ], 'Percentage', p), slips(36.8, [[14, 'That’s the blue bar. As a percentage: 14 ÷ 38 × 100.'], [37, 'Give it to 1 decimal place: 36.8.']]), { label: 'Percentage (%)', prefix: 'Blue =' })
}
practice('mixed', 'How many more girls than boys travel by bus?', 'P15 review (book’s numbers)', barFig(modes, [boys, girls], 'Boys and girls by how they travel.', { max: 10, step: 5, legend: ['Boys', 'Girls'], yTitle: 'Frequency' }), number(5, '5'), 'Read both bus bars.', boardModel([], [
  { title: 'The bus pair', say: 'Girls 9, boys 4.', rows: ['9 − 4 = 5', '! 5 more girls'] },
], 'Difference'), slips(5, [[13, 'Take them away, don’t add.'], [9, 'That’s the girls. Take away the boys, 4.']]), { label: 'Girls', prefix: 'More =' })

add('mixed', 'Bar charts', 'P15 consolidation', text(
  'Draw: one bar per category, equal widths, gaps between, a scale that fits.',
  'Read: check what each line is worth, then read across.',
  'Percentage: one bar ÷ the total × 100.',
  'Dual bar chart: two groups side by side; use the key.',
))

export const tutorBarChartsLesson: TutorMethodLesson = {
  id: 'L315', number: 315, title: 'Bar charts', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Draw a bar chart with a sensible scale, read one for totals, differences and percentages, and compare two groups on a dual bar chart.',
  labels: { [draw]: 'Drawing bar charts', [read]: 'Reading bar charts', [dual]: 'Dual bar charts', mixed: 'Review' },
  states: finish(),
}

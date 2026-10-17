import { author } from '../../written-methods/tutor/content'
import type { FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { fraction, tableFig, tilesFig } from './chancePictures'

/*
 * Statistics lesson 13: Grouped frequency tables. From P13 in Sunny's revision book (p197–199): what a class like
 * 150 < h ≤ 160 means (taller than 150, up to and including 160), the 117 cats (modal class 3.5 < w ≤ 4, the median the
 * 59th cat, in the same class), and Your Turn: Joe's herb heights, the puzzle times of 100 people, the physics marks of
 * 25 students, and the bike shop's times.
 *
 * Three rungs: building a grouped table (sorting values into classes on the sort board, edge values included, so the ≤
 * matters; then counting the physics marks into bars on the chart board); the modal class and the class containing the
 * median, from running totals; and problems (more than, percentages, fractions, money). Each rung opens with something
 * to drag or a guess.
 *
 * The book's numbers all add up: herbs 5, 7, 8, 4 (24 plants), physics 1, 8, 4, 4, 5, 3 (25), bike shop 3, 5, 4, 6, 2
 * (20 customers, mean 280 ÷ 20 = 14 minutes). Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(313)
const { add, finish } = lesson
const { worked, practice, ask, chartPlay, chart, playSort, sort } = chanceScreens(lesson)
const build = 'grouped-build'
const classes = 'grouped-classes'
const problems = 'grouped-problems'

type Tones = [number, number, FigureTone][]
/** A grouped frequency table: a heading row, then each class and its frequency; `tones` by [row, column]. */
const table = (head: [string, string], rows: [string, number | string][], spoken: string, tones: Tones = [], caption?: string) =>
  tableFig([head, ...rows.map(([c, f]) => [c, String(f)])], spoken, { tones, caption })
/** Tones for whole rows of a table (rows counted from 1, under the heading). */
const lit = (rows: number[], tone: FigureTone = 'lit', cols = [0, 1]): Tones => rows.flatMap(r => cols.map(c => [r, c, tone] as [number, number, FigureTone]))

/* ---------- Rung 1: building a grouped frequency table ---------- */

playSort(build, 'Put each height in its class. Watch the edges.', 'P13 p197 Grouped frequency tables (play)', { kind: 'bins', bins: [
  { id: 'a', label: '150 < h ≤ 160' }, { id: 'b', label: '160 < h ≤ 170' }, { id: 'c', label: '170 < h ≤ 180' },
], tiles: [
  { label: '152', to: 'a', why: '152 is taller than 150 and no taller than 160.' },
  { label: '160', to: 'a', why: '≤ 160 means up to and including 160, so exactly 160 is in 150 < h ≤ 160.' },
  { label: '165', to: 'b', why: '165 is between 160 and 170.' },
  { label: '170', to: 'b', why: 'Exactly 170 is in 160 < h ≤ 170: the ≤ includes it.' },
  { label: '171', to: 'c', why: '171 is taller than 170, so it’s in 170 < h ≤ 180.' },
  { label: '180', to: 'c', why: 'Exactly 180 is in 170 < h ≤ 180: the ≤ includes it.' },
] })
ask(build, 'Guess first: someone is exactly 160 cm tall. Which class are they in?', 'P13 p197 (guess first)', ['150 < h ≤ 160', '160 < h ≤ 170'], choose('150 < h ≤ 160',
  ['160 < h ≤ 170', '160 < h means taller than 160. Exactly 160 isn’t taller than 160.'], ['Both', 'Every value goes in exactly one class, or it would be counted twice.']),
'Read < as “more than” and ≤ as “up to and including”.', boardModel([], [
  { title: 'Read the signs', say: '150 < h ≤ 160 means taller than 150, up to and including 160.', rows: ['>0 150 < h ≤ 160: 150 is out, 160 is in'] },
  { title: 'Where 160 goes', say: '160 < h ≤ 170 starts just above 160, so 160 isn’t in it.', rows: ['! 150 < h ≤ 160'] },
], 'Class'))
{
  const heights: [string, number][] = [['150 < h ≤ 160', 14], ['160 < h ≤ 170', 50], ['170 < h ≤ 175', 32], ['175 < h ≤ 180', 19], ['180 < h ≤ 190', 8]]
  const say = 'Adults’ heights: 14, 50, 32, 19 and 8 people in the five classes.'
  const t = (tones: Tones = []) => table(['Height, h (cm)', 'Frequency'], heights, say, tones)
  worked(build, 'What does the first row of this table tell you?', 'Grouped frequency tables', 'P13 p197 (book’s numbers)', boardModel([], [
    { title: 'Read the class', say: '150 < h ≤ 160 means taller than 150 cm, but no taller than 160 cm.', rows: ['>0 150 < h ≤ 160'], picture: t(lit([1], 'lit', [0])) },
    { title: 'The edges', say: 'Exactly 150 cm is not in it. Exactly 160 cm is.', rows: ['>0 150 out, 160 in'], picture: t(lit([1], 'lit', [0])) },
    { title: 'The frequency', say: '14 people are in that class. We don’t know their exact heights.', rows: ['Frequency = 14', '! 14 people, heights unknown'], picture: t(lit([1], 'found')) },
  ], 'Class', t()), 'A grouped table puts values into classes. < means more than, ≤ means up to and including, so each value fits in exactly one class. The cost: you lose the exact values.')
}
sort(build, 'Sort these plant heights into Joe’s classes.', 'P13 Your Turn Q1 classes (own heights)', { kind: 'bins', bins: [
  { id: 'a', label: '0 < h ≤ 20' }, { id: 'b', label: '20 < h ≤ 30' }, { id: 'c', label: '30 < h ≤ 40' }, { id: 'd', label: '40 < h ≤ 70' },
], tiles: [
  { label: '9', to: 'a', why: '9 is between 0 and 20.' },
  { label: '20', to: 'a', why: '≤ 20 includes exactly 20.' },
  { label: '25', to: 'b', why: '25 is between 20 and 30.' },
  { label: '30', to: 'b', why: '≤ 30 includes exactly 30.' },
  { label: '32', to: 'c', why: '32 is between 30 and 40.' },
  { label: '40', to: 'c', why: '≤ 40 includes exactly 40.' },
  { label: '46', to: 'd', why: '46 is between 40 and 70.' },
  { label: '21', to: 'b', why: '21 is more than 20, so it’s in 20 < h ≤ 30.' },
] }, 'An edge value goes in the class that ends with it (≤).', boardModel([], [
  { title: 'The edge values', say: 'Each class includes its top value: 20, 30 and 40 go in the class they end.', rows: ['>0 20 in 0–20, 30 in 20–30, 40 in 30–40'] },
  { title: 'The rest', say: 'Every other value sits inside one class.', rows: ['! 9, 20 | 25, 30, 21 | 32, 40 | 46'] },
], 'Classes'))
const joe = [32, 39, 9, 35, 21, 22, 25, 32, 51, 33, 7, 19, 19, 55, 31, 37, 27, 28, 46, 30, 25, 38, 61, 15]
const joeSay = 'Joe’s 24 plant heights in centimetres.'
const herbs = (tones: Partial<Record<number, FigureTone>> = {}) => tilesFig(joe.map(String), joeSay, { tones, perRow: 6 })
const where = (test: (h: number) => boolean, tone: FigureTone) => Object.fromEntries(joe.map((h, k) => [k, h] as const).filter(([, h]) => test(h)).map(([k]) => [k, tone]))
practice(build, 'How many of Joe’s plants go in the class 30 < h ≤ 40?', 'P13 Your Turn Q1 (book’s numbers)', herbs(), number(8, '8'), 'Count heights more than 30, up to and including 40.', boardModel([], [
  { title: 'Find the edge', say: '30 is not more than 30, so it stays out of this class.', rows: ['>0 30 goes in 20 < h ≤ 30'], picture: herbs({ 19: 'faint' }) },
  { title: 'Count the class', say: 'More than 30, up to 40: 32, 39, 35, 32, 33, 31, 37 and 38.', rows: ['Frequency = 8', '! 8 plants'], picture: herbs(where(h => h > 30 && h <= 40, 'found')) },
], 'Frequency', herbs()), slips(8, [[9, '30 isn’t more than 30, so it goes in 20 < h ≤ 30.'], [7, 'Count again: 32 appears twice.']]), { prefix: 'Frequency =' })
practice(build, 'How many of Joe’s plants go in the class 20 < h ≤ 30?', 'P13 Your Turn Q1 (book’s numbers)', herbs(), number(7, '7'), 'Include exactly 30.', boardModel([], [
  { title: 'Count the class', say: 'More than 20, up to and including 30: 21, 22, 25, 27, 28, 30 and 25.', rows: ['Frequency = 7', '! 7 plants'], picture: herbs(where(h => h > 20 && h <= 30, 'found')) },
], 'Frequency', herbs()), slips(7, [[6, '≤ 30 includes 30. Count it here.'], [5, 'That’s 0 < h ≤ 20. This class is 20 < h ≤ 30.']]), { prefix: 'Frequency =' })
{
  const marks = [26, 11, 21, 35, 44, 23, 37, 16, 42, 11, 47, 59, 45, 16, 13, 18, 19, 25, 15, 32, 54, 8, 38, 42, 53]
  const labels = ['0–10', '11–20', '21–30', '31–40', '41–50', '51–60'], want = [1, 8, 4, 4, 5, 3]
  chart(build, `Count the 25 physics marks into classes: drag each bar to its frequency. ${marks.join(', ')}.`, 'P13 Your Turn Q3a (book’s numbers)',
    { mode: 'bars', labels, values: [0, 0, 0, 0, 0, 0], max: 10 }, [want.join(',')], want.join(', '), 'Tick each mark off as you count it. The six frequencies add up to 25.', boardModel([], [
      { title: 'Count each class', say: 'Go through the marks once, tallying each into its class.', rows: ['>0 0–10: 8', '>0 11–20: 11, 16, 11, 16, 13, 18, 19, 15', '>0 21–30: 26, 21, 23, 25', '>0 31–40: 35, 37, 32, 38', '>0 41–50: 44, 42, 47, 45, 42', '>0 51–60: 59, 54, 53'] },
      { title: 'Check the total', say: 'Every student is counted once.', rows: ['1 + 8 + 4 + 4 + 5 + 3 = 25', '! 1, 8, 4, 4, 5, 3'] },
    ], 'Frequencies'), r => { const got = r.split(',').map(Number), k = got.findIndex((n, i) => n !== want[i]); return k < 0 ? 'Check every bar.' : `${labels[k]} should be ${want[k]}, not ${got[k]}.` })
}

/* ---------- Rung 2: the modal class and the median ---------- */

const cats: [string, number][] = [['2 < w ≤ 3', 22], ['3 < w ≤ 3.5', 14], ['3.5 < w ≤ 4', 39], ['4 < w ≤ 4.5', 29], ['4.5 < w ≤ 5', 13]]
const catsSay = 'The weights of 117 cats: 22, 14, 39, 29 and 13 in the five classes.'
const catT = (tones: Tones = [], caption?: string) => table(['Weight, w (kg)', 'Frequency'], cats, catsSay, tones, caption)
chartPlay(classes, 'Drag the bars. Which class has the most cats?', 'P13 p197 Example (play)', { mode: 'bars', labels: ['2–3', '3–3.5', '3.5–4', '4–4.5', '4.5–5'], values: cats.map(c => c[1]), max: 50, show: 'total' })
practice(classes, 'Guess first: put the 117 cats in order of weight. Which class is the middle cat in?', 'P13 p197 Example (guess first)', catT(), choose('3.5 < w ≤ 4',
  ['3 < w ≤ 3.5', 'Only 22 + 14 = 36 cats are 3.5 kg or less. The middle cat, the 59th, is heavier.'], ['4 < w ≤ 4.5', 'By 4 kg there are already 22 + 14 + 39 = 75 cats, past the 59th.']),
'The middle of 117 is the 59th cat. Add the frequencies down until you pass 59.', boardModel([], [
  { title: 'The middle cat', say: '(117 + 1) ÷ 2 = 59, so the median is the 59th cat.', rows: ['(117 + 1) ÷ 2 = 59'], picture: catT() },
  { title: 'Add down the table', say: '36 cats up to 3.5 kg, 75 up to 4 kg. The 59th is in between.', rows: ['22 + 14 = 36', '36 + 39 = 75', '! 3.5 < w ≤ 4'], picture: catT(lit([3], 'found')) },
], 'Median class', catT()))
worked(classes, 'Find the modal class and the class containing the median.', 'Modal class and median', 'P13 p197 Example (book’s numbers)', boardModel([], [
  { title: 'The biggest frequency', say: 'The modal class is the class with the highest frequency: 39.', rows: ['Modal class = 3.5 < w ≤ 4'], picture: catT(lit([3], 'lit', [1])) },
  { title: 'Where the median is', say: 'There are 117 cats, so the median is the 59th.', rows: ['(117 + 1) ÷ 2 = 59'], picture: catT() },
  { title: 'Running totals', say: '36 cats weigh up to 3.5 kg and 75 up to 4 kg, so the 59th is in 3.5 < w ≤ 4.', rows: ['22 + 14 = 36', '36 + 39 = 75', '! Both: 3.5 < w ≤ 4'], picture: catT(lit([3], 'found')) },
], 'Classes', catT()), 'The modal class has the highest frequency. For the median, find its place, (n + 1) ÷ 2, then add the frequencies down until you reach it.')
practice(classes, 'How many cats weigh 3.5 kg or less?', 'P13 p197 Example (book’s numbers)', catT(), number(36, '36'), 'Which classes end at 3.5 kg or below?', boardModel([], [
  { title: 'Classes up to 3.5', say: '2 < w ≤ 3 and 3 < w ≤ 3.5 hold every cat up to 3.5 kg.', rows: ['22 + 14 = 36', '! 36 cats'], picture: catT([...lit([1, 2], 'found', [1])]) },
], 'Cats', catT()), slips(36, [[14, 'That’s just 3 < w ≤ 3.5. The lighter cats in 2 < w ≤ 3 weigh less than 3.5 kg too.'], [75, 'That’s up to 4 kg. Stop at 3.5 kg.']]), { prefix: 'Cats =' })
const puzzle: [string, number][] = [['0 < t ≤ 1', 8], ['1 < t ≤ 1.5', 22], ['1.5 < t ≤ 2', 32], ['2 < t ≤ 2.5', 19], ['2.5 < t ≤ 3', 19]]
const puzzleSay = 'Puzzle times of 100 people, in minutes: 8, 22, 32, 19 and 19 in the five classes.'
const puzT = (tones: Tones = []) => table(['Time, t (min)', 'Frequency'], puzzle, puzzleSay, tones)
practice(classes, '100 people solve a puzzle. What position in order is the median?', 'P13 Your Turn Q2 (book’s numbers)', puzT(), number(50.5, '50.5'), 'The median is in position (n + 1) ÷ 2.', boardModel([], [
  { title: 'The middle place', say: 'With 100 people, the middle is halfway between the 50th and 51st.', rows: ['(100 + 1) ÷ 2 = 50.5', '! 50.5th'] },
], 'Position', puzT()), slips(50.5, [[50, 'Use (n + 1) ÷ 2: (100 + 1) ÷ 2.'], [3, 'That’s the middle row of the table. Use the frequencies: (100 + 1) ÷ 2.']]), { prefix: 'Position =' })
practice(classes, 'Which class contains the median puzzle time?', 'P13 Your Turn Q2 (book’s numbers)', puzT(), choose('1.5 < t ≤ 2',
  ['1 < t ≤ 1.5', 'Only 8 + 22 = 30 people took 1.5 minutes or less. The 50.5th is later.'], ['2 < t ≤ 2.5', 'By 2 minutes, 8 + 22 + 32 = 62 people had finished: past the 50.5th.']),
'Add the frequencies down until you pass 50.5.', boardModel([], [
  { title: 'Running totals', say: '30 people up to 1.5 minutes, 62 up to 2 minutes.', rows: ['8 + 22 = 30', '30 + 32 = 62', '! 1.5 < t ≤ 2'], picture: puzT(lit([3], 'found')) },
], 'Median class', puzT()))

/* ---------- Rung 3: problems ---------- */

const physics: [string, number][] = [['0–10', 1], ['11–20', 8], ['21–30', 4], ['31–40', 4], ['41–50', 5], ['51–60', 3]]
const physicsSay = 'Physics marks of 25 students: 1, 8, 4, 4, 5 and 3 in the six classes.'
const phyT = (tones: Tones = []) => table(['Mark', 'Frequency'], physics, physicsSay, tones)
practice(problems, 'Guess first: how many of the 25 scored more than 45?', 'P13 Your Turn Q3 (guess first)', phyT(), choose('You can’t tell from the table',
  ['5', 'That’s everyone from 41 to 50. Some of them may have scored 45 or less.'], ['About 5 or 6', 'The table only says 5 are in 41–50, not where. The exact marks are lost.']),
'What does the table tell you about the marks inside 41–50?', boardModel([], [
  { title: 'Inside a class', say: 'The table says 5 scored 41 to 50, but not who scored what.', rows: ['>0 41–50: 5 students, marks unknown'], picture: phyT(lit([5])) },
  { title: 'The cost of grouping', say: 'Once data is grouped, the exact values are gone.', rows: ['! You can’t tell'] },
], 'Reading', phyT()))
worked(problems, 'How many took over 2 minutes? Anyone taking 90 seconds or less wins a prize: what fraction win?', 'Grouped table problems', 'P13 Your Turn Q2 (book’s numbers)', boardModel([], [
  { title: 'Over 2 minutes', say: 'The classes after 2 minutes are 2 < t ≤ 2.5 and 2.5 < t ≤ 3.', rows: ['19 + 19 = 38'], picture: puzT(lit([4, 5])) },
  { title: '90 seconds in minutes', say: '90 seconds is 1.5 minutes. Up to 1.5 is the first two classes.', rows: ['90 s = 1.5 min', '8 + 22 = 30'], picture: puzT(lit([1, 2])) },
  { title: 'As a fraction', say: '30 of the 100 people, simplified.', rows: ['30 ÷ 100 = 3 ÷ 10', '! 38 people; {3|10} win'], picture: puzT(lit([1, 2], 'found')) },
], 'Puzzle', puzT()), 'Turn the words into classes: “over 2” means the classes after 2. Add their frequencies, then give a fraction or percentage of the total.')
practice(problems, 'What percentage of the class scored above 40 marks?', 'P13 Your Turn Q3b (book’s numbers)', phyT(), number(32, '32%'), 'Above 40 is the last two classes.', boardModel([], [
  { title: 'Above 40', say: '41–50 and 51–60 are all above 40.', rows: ['5 + 3 = 8'], picture: phyT(lit([5, 6], 'lit', [1])) },
  { title: 'As a percentage', say: '8 out of the 25 students.', rows: ['8 ÷ 25 × 100 = 32', '! 32%'], picture: phyT(lit([5, 6], 'found', [1])) },
], 'Percentage', phyT()), slips(32, [[8, 'That’s how many students. As a percentage: 8 ÷ 25 × 100.'], [48, 'That’s 31–40 included. Above 40 starts at 41.']]), { label: 'Percentage (%)', prefix: 'Above 40 =' })
{
  const bike: [string, number][] = [['0–5', 3], ['6–10', 5], ['11–15', 4], ['16–20', 6], ['21+', 2]]
  const say = 'Time in the bike shop, minutes: 3, 5, 4, 6 and 2 customers in the five classes.'
  const t = (tones: Tones = []) => table(['Time (minutes)', 'Frequency'], bike, say, tones)
  practice(problems, 'Customers who stayed more than 10 minutes spent £12.50 each on average. How much did they spend in all?', 'P13 Your Turn Q4b (book’s numbers)', t(), number(150, '£150'), 'More than 10 is the last three classes.', boardModel([], [
    { title: 'More than 10', say: '11–15, 16–20 and 21+ all stayed more than 10 minutes.', rows: ['4 + 6 + 2 = 12'], picture: t(lit([3, 4, 5], 'lit', [1])) },
    { title: 'Times £12.50', say: 'Each spent £12.50.', rows: ['12 × 12.50 = 150', '! £150'], picture: t(lit([3, 4, 5], 'found', [1])) },
  ], 'Money', t()), slips(150, [[12.5, 'That’s one customer. Multiply by the 12 who stayed more than 10 minutes.'], [212.5, 'That counts 6–10 too. More than 10 starts at 11.']]), { prefix: 'Total = £' })
  practice(problems, 'What fraction of the 20 customers spent more than 10 minutes but less than 21 minutes in the shop?', 'P13 Your Turn Q4c (book’s numbers)', t(), fraction('1/2'), 'Which classes are between 10 and 21?', boardModel([], [
    { title: 'Between 10 and 21', say: '11–15 and 16–20.', rows: ['4 + 6 = 10'], picture: t(lit([3, 4], 'lit', [1])) },
    { title: 'Out of everyone', say: '10 of the 20 customers.', rows: ['{10|20} = {1|2}', '! {1|2}'], picture: t(lit([3, 4], 'found', [1])) },
  ], 'Fraction', t()), slips(1 / 2, [[12 / 20, '21+ is 21 minutes or more, not less than 21.'], [4 / 20, '16–20 is less than 21 too.']]))
  const times = [16, 23, 4, 9, 4, 18, 45, 20, 8, 6, 3, 14, 12, 17, 12, 19, 9, 16, 10, 15]
  const tiles = (all = false) => tilesFig(times.map(String), 'The 20 customers’ times in minutes.', { tones: all ? Object.fromEntries(times.map((_, k) => [k, 'lit' as FigureTone])) : {}, perRow: 5 })
  practice(problems, 'Here are the 20 times the table came from. What was the mean time, in minutes?', 'P13 Your Turn Q4d (book’s numbers)', tiles(), number(14, '14'), 'Add up all 20 times, then divide by 20.', boardModel([], [
    { title: 'Add them all', say: 'With the real values you can find the exact mean.', rows: ['16 + 23 + 4 + … + 15 = 280'], picture: tiles(true) },
    { title: 'Divide by how many', say: 'There are 20 customers.', rows: ['280 ÷ 20 = 14', '! Mean = 14 minutes'] },
  ], 'Mean', tiles()), slips(14, [[280, 'That’s the total. Divide by 20.'], [5, 'That divides by the 5 classes. Divide by the 20 customers.']]), { prefix: 'Mean =' })
}

/* ---------- Review: our own numbers ---------- */

sort('mixed', 'Sort these journey times into classes.', 'P13 review (own numbers)', { kind: 'bins', bins: [
  { id: 'a', label: '0 < t ≤ 10' }, { id: 'b', label: '10 < t ≤ 20' }, { id: 'c', label: '20 < t ≤ 30' },
], tiles: [
  { label: '10', to: 'a', why: '≤ 10 includes exactly 10.' },
  { label: '14', to: 'b', why: '14 is between 10 and 20.' },
  { label: '20', to: 'b', why: '≤ 20 includes exactly 20.' },
  { label: '27', to: 'c', why: '27 is between 20 and 30.' },
  { label: '3', to: 'a', why: '3 is between 0 and 10.' },
  { label: '21', to: 'c', why: '21 is more than 20.' },
] }, 'Each class includes its top value.', boardModel([], [
  { title: 'Edges first', say: '10 goes in 0 < t ≤ 10 and 20 in 10 < t ≤ 20.', rows: ['>0 10 and 20 end their classes'] },
  { title: 'The rest', say: 'The others sit inside a class.', rows: ['! 10, 3 | 14, 20 | 27, 21'] },
], 'Classes'))
{
  const rows: [string, number][] = [['0 < t ≤ 10', 6], ['10 < t ≤ 20', 11], ['20 < t ≤ 30', 9], ['30 < t ≤ 40', 4]]
  const say = 'Journey times of 30 people: 6, 11, 9 and 4 in the four classes.'
  const t = (tones: Tones = []) => table(['Time, t (min)', 'Frequency'], rows, say, tones)
  practice('mixed', 'How many of the 30 people took more than 20 minutes?', 'P13 review (own numbers)', t(), number(13, '13'), 'More than 20 is the classes after 20.', boardModel([], [
    { title: 'After 20', say: '20 < t ≤ 30 and 30 < t ≤ 40.', rows: ['9 + 4 = 13', '! 13 people'], picture: t(lit([3, 4], 'found', [1])) },
  ], 'People', t()), slips(13, [[24, 'That counts 10 < t ≤ 20 too. More than 20 starts after 20.'], [4, 'That’s just 30 < t ≤ 40. 20 < t ≤ 30 is more than 20 too.']]), { label: 'People', prefix: 'Over 20 =' })
  practice('mixed', 'What percentage took 10 minutes or less?', 'P13 review (own numbers)', t(), number(20, '20%'), 'Up to and including 10 is the first class.', boardModel([], [
    { title: 'Up to 10', say: '0 < t ≤ 10 has 6 people.', rows: ['6 ÷ 30 × 100 = 20', '! 20%'], picture: t(lit([1], 'found', [1])) },
  ], 'Percentage', t()), slips(20, [[6, 'That’s how many people. As a percentage: 6 ÷ 30 × 100.'], [56.7, 'That includes 10 < t ≤ 20. Only the first class is 10 or less.']]), { label: 'Percentage (%)', prefix: '10 or less =' })
}

add('mixed', 'Grouped frequency tables', 'P13 consolidation', text(
  '150 < h ≤ 160: more than 150, up to and including 160.',
  'An edge value goes in the class it ends.',
  'Modal class: the highest frequency.',
  'Median class: find (n + 1) ÷ 2, then add down the frequencies.',
  'Grouping loses the exact values.',
))

export const tutorGroupedFrequencyLesson: TutorMethodLesson = {
  id: 'L313', number: 313, title: 'Grouped frequency tables', level: 'GCSE Foundation',
  steadyPictures: true,
  steadySize: true,
  goal: 'Sort data into classes like 150 < h ≤ 160, find the modal class and the class containing the median, and answer questions from a grouped table.',
  labels: { [build]: 'Building a grouped table', [classes]: 'Modal and median class', [problems]: 'Grouped table problems', mixed: 'Review' },
  states: finish(),
}

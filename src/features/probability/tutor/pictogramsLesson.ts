import { author } from '../../written-methods/tutor/content'
import type { FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { fig, slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { fraction } from './chancePictures'

/*
 * Statistics lesson 10: Pictograms. From P10 in Sunny's revision book (p188–190): reading a pictogram (Riley's TV,
 * one TV = 30 minutes, Thursday 3½ TVs = 1 hour 45 minutes), drawing one (Faye's football club, one ball = 20 people:
 * 55, 60, 65, 40, 70), and Your Turn: the oranges (one picture = 2), Alexis's walks (one square = 2 km), the money
 * raised (one square = £20), the butterfly farm (ratios and percentages) and Gary's guitar practice (ratios).
 *
 * Three rungs: reading, drawing (built on the chart board's pictogram mode, a quarter of a picture at a time) and
 * problems. Each rung opens with something to drag or a guess. A picture is a square of four quarters, as in the
 * book's Your Turn questions; the board's answer is each free row in quarters of a picture (4½ pictures = 18).
 *
 * Riley's Tuesday and Friday are read from the photo as 4½ and 1½ TVs. Gary's question gives no key, so we use one
 * picture = 8 hours. Hidden on live: only the unlisted Probability shelf opens it.
 */

const lesson = author(310)
const { add, finish } = lesson
const { worked, practice, ask, chartPlay, chart } = chanceScreens(lesson)
const read = 'pictogram-read'
const draw = 'pictogram-draw'
const problems = 'pictogram-problems'

/** A number of quarters as pictures: 18 is 4½. */
const q = (n: number) => `${Math.floor(n / 4) || (n % 4 ? '' : '0')}${['', '¼', '½', '¾'][n % 4]}`
/** What a wrong pictogram is told: the first row that's out. */
const rowsWrong = (labels: string[], want: number[]) => (r: string) => {
  const got = r.split(',').map(Number), k = got.findIndex((n, i) => n !== want[i])
  return k < 0 ? 'Check every row.' : `${labels[k]} should be ${q(want[k])} pictures, not ${q(got[k])}.`
}
/**
 * A pictogram drawn bigger than statsPictures.ts's pictogramFig: rows packed closer and the key in the caption, so
 * five or six rows still have pictures big enough to count quarters. `values` are in quarters of a picture; a part
 * picture fills top-left, top-right, bottom-left, bottom-right, as on the chart board; every picture is drawn as its
 * four quarters, as the book's Your Turn squares are. `tones` mark whole rows and
 * `counts` write a number after a row.
 */
const pg = (labels: string[], values: number[], key: string, spoken: string, tones: [number[], FigureTone][] = [], counts: Partial<Record<number, string>> = {}, caption?: string) => {
  const t: Partial<Record<number, FigureTone>> = {}
  for (const [rows, tone] of tones) for (const k of rows) t[k] = tone
  const rowH = 0.92, S = 0.78, pitch = 0.93, n = labels.length, top = n * rowH, items: FigureItem[] = []
  const pics = Math.max(4, ...values.map(v => Math.ceil(v / 4)))
  const countW = Math.max(0, ...Object.values(counts).map(c => (c ?? '').length * 9))
  // The scale the picture will be drawn at (about 134 pixels high, 244 wide), so the labels can be measured.
  let scale = 30
  for (let i = 0; i < 3; i++) {
    const wide = (Math.max(...labels.map(l => l.length)) * 9 + 10) / scale + 0.25 + pics * pitch + (countW ? countW / scale + 0.3 : 0)
    scale = Math.min(134 / top, 244 / wide)
  }
  items.push({ kind: 'line', from: [-0.12, 0], to: [-0.12, top] })
  labels.forEach((label, k) => {
    const y0 = top - (k + 1) * rowH + (rowH - S) / 2, tone = t[k], fill = tone === 'lit' || tone === 'found' ? { fill: 'part' as const } : {}
    items.push({ kind: 'text', at: [-0.3 - label.length * 4.5 / scale, y0 + S / 2], text: label, ...(tone ? { tone } : {}) })
    for (let i = 0; i * 4 < values[k]; i++) {
      const x = i * pitch, part = Math.min(4, values[k] - i * 4)
      ;([[0, 1], [1, 1], [0, 0], [1, 0]] as const).slice(0, part).forEach(([cx, cy]) => items.push({ kind: 'shape', points: box(x + cx * S / 2, y0 + cy * S / 2, x + (cx + 1) * S / 2, y0 + (cy + 1) * S / 2), ...fill }))
    }
    const count = counts[k]
    if (count) items.push({ kind: 'text', at: [Math.ceil(values[k] / 4) * pitch + 0.15 + count.length * 4.5 / scale, y0 + S / 2], text: count, tone: tone ?? 'found' })
  })
  return fig(items, spoken, caption ?? `Key: one picture = ${key}`)
}
const box = (x0: number, y0: number, x1: number, y1: number): FigurePoint[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], short = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const tv = [8, 18, 8, 14, 6]
const walks = [8, 17, 10, 12, 14]
const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
const football = [11, 12, 13, 8, 14]
const students = ['Sally', 'Ahmed', 'Delaine', 'Priti', 'Annabelle', 'Derek'], raised = [12, 12, 5, 12, 18, 15]

/* ---------- Rung 1: reading a pictogram ---------- */

chartPlay(read, 'Drag a row of TVs. Watch the minutes.', 'P10 p188 Interpreting pictographs (play)', { mode: 'pictogram', labels: days, values: tv, key: 30 })
{
  const p = pg(short, tv, '30 min', 'Riley’s TV pictogram: one TV stands for 30 minutes.')
  practice(read, 'Guess first: one TV stands for 30 minutes. How many minutes is half a TV?', 'P10 p188 (guess first)', p, number(15, '15'), 'Half of what a whole TV stands for.', boardModel([], [
    { title: 'Half the key', say: 'A whole TV is 30 minutes, so half a TV is half of that.', rows: ['30 ÷ 2 = 15', '! Half a TV = 15 minutes'] },
  ], 'Minutes', p), slips(15, [[30, 'That’s a whole TV. Half of 30 is 15.'], [0.5, 'That’s how much of a picture. Half of 30 minutes is 15.']]), { label: 'Minutes', prefix: 'Half =' })
}
{
  const p = pg(short, tv, '30 min', 'Riley’s TV pictogram: one TV stands for 30 minutes.')
  worked(read, 'How long did Riley watch TV on Thursday? Give your answer in hours and minutes.', 'Reading a pictogram', 'P10 p188 Interpreting pictographs (book’s numbers)', boardModel([], [
    { title: 'Read the key', say: 'One TV is 30 minutes, so half a TV is 15 minutes.', rows: ['1 TV = 30 minutes', '½ TV = 15 minutes'], picture: p },
    { title: 'Count the pictures', say: 'Thursday has 3 whole TVs and half a TV.', rows: ['>0 Thursday: 3½ TVs'], picture: pg(short, tv, '30 min', 'Thursday’s row lit.', [[[3], 'lit']]) },
    { title: 'Use the key', say: 'Three whole TVs and the half, then turn the minutes into hours.', rows: ['3 × 30 + 15 = 105 minutes', '105 = 60 + 45', '! 1 hour 45 minutes'], picture: pg(short, tv, '30 min', 'Thursday is 105 minutes.', [[[3], 'found']], { 3: '105 min' }) },
  ], 'Time', p), 'Count the whole pictures and the part, then use the key: each picture is worth what the key says. Work out what a part of a picture is worth.')
}
{
  const p = pg(short, tv, '30 min', 'Riley’s TV pictogram: one TV stands for 30 minutes.')
  practice(read, 'How many minutes did Riley watch TV on Tuesday?', 'P10 p188 (book’s pictogram)', p, number(135, '135'), 'Count the whole TVs and the part.', boardModel([], [
    { title: 'Count the pictures', say: 'Tuesday has 4 whole TVs and half a TV.', rows: ['>0 Tuesday: 4½ TVs'], picture: pg(short, tv, '30 min', 'Tuesday’s row lit.', [[[1], 'lit']]) },
    { title: 'Use the key', say: 'Each whole TV is 30 minutes and the half is 15.', rows: ['4 × 30 + 15 = 135', '! Tuesday = 135 minutes'], picture: pg(short, tv, '30 min', 'Tuesday is 135 minutes.', [[[1], 'found']], { 1: '135 min' }) },
  ], 'Time', p), slips(135, [[4.5, 'That’s how many TVs. Each TV is 30 minutes.'], [120, 'You missed the half TV: add 15 minutes.']]), { label: 'Minutes', prefix: 'Tuesday =' })
}
{
  const p = pg(short, walks, '2 km', 'Alexis’s walks: each large square stands for 2 km.')
  practice(read, 'Each large square stands for 2 km. How far did Alexis walk on Tuesday?', 'P10 Your Turn Q2a (book’s numbers)', p, number(8.5, '8.5 km'), 'The small square is a quarter of a large one.', boardModel([], [
    { title: 'Count the squares', say: 'Tuesday has 4 large squares and a quarter of one.', rows: ['>0 Tuesday: 4¼ squares'], picture: pg(short, walks, '2 km', 'Tuesday’s row lit.', [[[1], 'lit']]) },
    { title: 'Use the key', say: 'A quarter of 2 km is 0.5 km.', rows: ['4 × 2 + 0.5 = 8.5', '! Tuesday = 8.5 km'], picture: pg(short, walks, '2 km', 'Tuesday is 8.5 km.', [[[1], 'found']], { 1: '8.5 km' }) },
  ], 'Distance', p), slips(8.5, [[8, 'You missed the small square: a quarter of 2 km is 0.5 km.'], [4.25, 'That’s how many squares. Each square is 2 km.']]), { label: 'Distance (km)', prefix: 'Tuesday =' })
}
{
  const p = pg(short, walks, '2 km', 'Alexis’s walks: each large square stands for 2 km.')
  practice(read, 'Alexis aimed to walk at least 6 km a day. On how many days did she reach her goal?', 'P10 Your Turn Q2b (book’s numbers)', p, number(3, '3'), 'Work out each day’s distance first.', boardModel([], [
    { title: 'Each day’s distance', say: 'Squares × 2 km for each day.', rows: ['>0 Mon 4, Tue 8.5, Wed 5, Thu 6, Fri 7 km'], picture: pg(short, walks, '2 km', 'Each day’s distance.', [], { 0: '4 km', 1: '8.5 km', 2: '5 km', 3: '6 km', 4: '7 km' }) },
    { title: 'At least 6 km', say: '“At least 6” includes 6 itself: Tuesday, Thursday and Friday.', rows: ['! Days = 3'], picture: pg(short, walks, '2 km', 'Tuesday, Thursday and Friday lit.', [[[1, 3, 4], 'found']], { 1: '8.5 km', 3: '6 km', 4: '7 km' }) },
  ], 'Days', p), slips(3, [[2, 'Thursday is exactly 6 km, and “at least 6” includes 6.'], [5, 'Monday (4 km) and Wednesday (5 km) are under 6 km.']]), { label: 'Days', prefix: 'Days =' })
}

/* ---------- Rung 2: drawing a pictogram ---------- */

chartPlay(draw, 'Make each week’s row: 55, 60, 65, 40 and 70 people.', 'P10 p188 Constructing pictographs (play)', { mode: 'pictogram', labels: weeks, values: [4, 4, 4, 4, 4], key: 20 })
ask(draw, 'Guess first: one football stands for 20 people. How many footballs show 55 people? Give it as a decimal.', 'P10 p188 (guess first)', ['1 football = 20 people', 'Week 1: 55 people'], number(2.75, '2.75'), 'How many 20s make 55?', boardModel([], [
  { title: 'Share by the key', say: '55 people, 20 to a football.', rows: ['55 ÷ 20 = 2.75', '! 2.75 footballs, which is 2¾'] },
], 'Footballs'), slips(2.75, [[3, '3 footballs is 60 people, 5 too many.'], [2.5, '2.5 footballs is 50 people, 5 too few.']]), { label: 'Balls', prefix: 'Balls =' })
{
  const p = pg(weeks, football, '20 people', 'Faye’s football pictogram: one football stands for 20 people.')
  worked(draw, 'Faye records how many people come to football training: 55, 60, 65, 40 and 70. Draw a pictogram.', 'Drawing a pictogram', 'P10 p188 Constructing pictographs (book’s numbers)', boardModel([], [
    { title: 'Choose the key', say: 'One football for 20 people. Half a football is 10, a quarter is 5.', rows: ['1 football = 20 people', '½ = 10, ¼ = 5'], picture: pg(weeks, [0, 0, 0, 0, 0], '20 people', 'Empty rows and the key.') },
    { title: 'Split each number', say: 'Week 1: 55 is two 20s and three 5s, so 2 footballs and three quarters.', rows: ['55 = 2 × 20 + 3 × 5', '>0 Week 1: 2¾ footballs'], picture: pg(weeks, [11, 0, 0, 0, 0], '20 people', 'Week 1 drawn.', [[[0], 'lit']]) },
    { title: 'Draw every row', say: 'The same for each week, and give the key.', rows: ['>0 3, 3¼, 2 and 3½ footballs', '! A row for each week, and the key'], picture: p },
  ], 'Pictogram', p), 'Choose a key that divides the numbers nicely, and show it. Then each row is the number ÷ the key, with parts of a picture for what is left.')
}
{
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'], want = [16, 18, 10, 16]
  chart(draw, 'Draw the oranges pictogram. One picture = 2 oranges. Week 1: 8, week 2: 9, week 3: 5, week 4: 8.', 'P10 Your Turn Q1 (book’s numbers)', { mode: 'pictogram', labels, values: [0, 0, 0, 0], key: 2 }, [want.join(',')], '4, 4½, 2½, 4 pictures',
    'One picture is 2 oranges, so one orange is half a picture.', boardModel([], [
      { title: 'Number ÷ key', say: 'Divide each week’s oranges by 2.', rows: ['8 ÷ 2 = 4, 9 ÷ 2 = 4½', '5 ÷ 2 = 2½, 8 ÷ 2 = 4'] },
      { title: 'Draw the rows', say: 'Half a picture is the top two quarters.', rows: ['! 4, 4½, 2½ and 4 pictures'], picture: pg(labels, want, '2 oranges', 'The oranges pictogram.', [], { 0: '8', 1: '9', 2: '5', 3: '8' }) },
    ], 'Pictogram'), rowsWrong(labels, want))
}
ask(draw, 'One picture stands for 8 goals. How many pictures show 14 goals? Give it as a decimal.', 'P10 p188 (own numbers)', ['1 picture = 8 goals', '14 goals'], number(1.75, '1.75'), 'How many 8s make 14? A quarter of a picture is 2 goals.', boardModel([], [
  { title: 'Share by the key', say: 'One whole picture is 8, and 6 more is three quarters, since a quarter is 2.', rows: ['14 ÷ 8 = 1.75', '! 1.75 pictures, which is 1¾'] },
], 'Pictures'), slips(1.75, [[1.5, '1.5 pictures is 12 goals.'], [2, '2 pictures is 16 goals.']]), { label: 'Pictures', prefix: 'Count =' })

/* ---------- Rung 3: pictogram problems ---------- */

chartPlay(problems, 'Drag Delaine’s row. What is each quarter worth?', 'P10 Your Turn Q3 (play)', { mode: 'pictogram', labels: students, values: raised, key: 20 })
const money = (tones: [number[], FigureTone][] = [], counts: Partial<Record<number, string>> = {}, caption?: string) => pg(students, raised, '£20', 'Money raised: each large square stands for £20.', tones, counts, caption)
const amounts = { 0: '£60', 1: '£60', 2: '£25', 3: '£60', 4: '£90', 5: '£75' }
practice(problems, 'Guess first: each large square is £20. What is a quarter of a square worth?', 'P10 Your Turn Q3 (guess first)', money(), number(5, '£5'), 'Share £20 into four.', boardModel([], [
  { title: 'A quarter of the key', say: 'Four quarters make a square.', rows: ['20 ÷ 4 = 5', '! A quarter = £5'] },
], 'Money', money()), slips(5, [[20, 'That’s a whole square. A quarter of £20 is £5.'], [10, 'That’s half a square. A quarter is £5.']]), { label: 'Pounds', prefix: '¼ = £' })
worked(problems, 'To the nearest pound, what was the mean amount raised?', 'Pictogram problems', 'P10 Your Turn Q3c (book’s numbers)', boardModel([], [
  { title: 'Each student’s amount', say: 'Squares × £20; a quarter is £5, a half £10, three quarters £15.', rows: ['>0 £60, £60, £25, £60, £90, £75'], picture: money([], amounts) },
  { title: 'Add them up', say: 'The total raised by all six.', rows: ['60 + 60 + 25 + 60 + 90 + 75 = 370'], picture: money([[[0, 1, 2, 3, 4, 5], 'lit']], amounts) },
  { title: 'Share between six', say: 'Mean = total ÷ how many students.', rows: ['370 ÷ 6 = 61.67', '! Mean = £62'] },
], 'Mean', money()), 'Turn every row into a number with the key first. Then answer the question with those numbers, as you would from a table.')
practice(problems, 'How many children raised more than £50?', 'P10 Your Turn Q3a (book’s numbers)', money(), number(5, '5'), 'Work out each amount first.', boardModel([], [
  { title: 'Each amount', say: 'Squares × £20.', rows: ['>0 £60, £60, £25, £60, £90, £75'], picture: money([], amounts) },
  { title: 'More than £50', say: 'Everyone except Delaine.', rows: ['! Children = 5'], picture: money([[[0, 1, 3, 4, 5], 'found']], amounts) },
], 'Children', money()), slips(5, [[4, 'Derek’s 3¾ squares is £75, more than £50 too.'], [6, 'Delaine raised £25, less than £50.']]), { label: 'Children', prefix: 'More =' })
practice(problems, 'What fraction of the children raised less than £60?', 'P10 Your Turn Q3b (book’s numbers)', money(), fraction('1/6'), 'Is £60 itself less than £60?', boardModel([], [
  { title: 'Less than £60', say: 'Sally, Ahmed and Priti raised exactly £60, which isn’t less. Only Delaine did.', rows: ['Less than £60 = 1 of 6'], picture: money([[[2], 'found']], amounts) },
  { title: 'As a fraction', say: '1 child out of 6.', rows: ['! Fraction = {1|6}'] },
], 'Fraction', money()), r => /^\s*4\s*\/\s*6\s*$/.test(r) || /^\s*2\s*\/\s*3\s*$/.test(r) ? 'Sally, Ahmed and Priti raised exactly £60. That isn’t less than £60.' : null)
{
  const labels = ['Red', 'Purple', 'Silver', 'Black', 'White'], want = [18, 12, 24, 9]
  chart(problems, 'Complete the butterfly pictogram, one square = 40. Purple Emperors: 60. Red Admirals: 3 times as many. Silver-studded Blues: ⅔ of the Red Admirals. Black Hairstreaks: 100% more than the Silver-studded. Wood Whites: 37.5% of the Black Hairstreaks.', 'P10 Your Turn Q4 (book’s numbers)',
    { mode: 'pictogram', labels, values: [0, 6, 0, 0, 0], key: 40, free: [0, 2, 3, 4] }, [want.join(',')], '4½, 3, 6, 2¼ squares', 'Find each number of butterflies, then divide by 40.', boardModel([], [
      { title: 'Red Admirals', say: '3 times the 60 Purple Emperors.', rows: ['3 × 60 = 180', '180 ÷ 40 = 4½ squares'] },
      { title: 'Silver-studded Blues', say: '⅔ of 180.', rows: ['180 ÷ 3 × 2 = 120', '120 ÷ 40 = 3 squares'] },
      { title: 'Black Hairstreaks', say: '100% more means double.', rows: ['120 × 2 = 240', '240 ÷ 40 = 6 squares'] },
      { title: 'Wood Whites', say: '37.5% of 240.', rows: ['240 × 0.375 = 90', '! 90 ÷ 40 = 2¼ squares'], picture: pg(labels, [18, 6, 12, 24, 9], '40', 'The finished butterfly pictogram.', [], { 0: '180', 1: '60', 2: '120', 3: '240', 4: '90' }) },
    ], 'Pictogram'), rowsWrong(['Red Admiral', 'Silver-studded', 'Black Hairstreak', 'Wood White'], want))
}
{
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'], want = [14, 16, 8, 12]
  chart(problems, 'Draw Gary’s guitar practice, one picture = 8 hours. Week 1 to week 2 is 7 : 8, week 2 to week 3 is 2 : 1, and week 3 to week 4 is 2 : 3. Week 4 is 24 hours.', 'P10 Your Turn Q5 (book’s numbers, our key)',
    { mode: 'pictogram', labels, values: [0, 0, 0, 0], key: 8 }, [want.join(',')], '3½, 4, 2, 3 pictures', 'Start from week 4 and work backwards.', boardModel([], [
      { title: 'Week 3', say: 'Week 3 : week 4 is 2 : 3, and 3 parts are 24 hours.', rows: ['24 ÷ 3 × 2 = 16'] },
      { title: 'Week 2', say: 'Week 2 is twice week 3.', rows: ['16 × 2 = 32'] },
      { title: 'Week 1', say: 'Week 1 : week 2 is 7 : 8, and 8 parts are 32 hours.', rows: ['32 ÷ 8 × 7 = 28'] },
      { title: 'Into pictures', say: 'Divide each by 8 hours.', rows: ['>0 28, 32, 16, 24 hours', '! 3½, 4, 2, 3 pictures'], picture: pg(labels, want, '8 hours', 'Gary’s pictogram.', [], { 0: '28 h', 1: '32 h', 2: '16 h', 3: '24 h' }) },
    ], 'Pictogram'), rowsWrong(labels, want))
}

/* ---------- Review: one of each, our own numbers ---------- */

{
  const labels = ['Mon', 'Tue', 'Wed', 'Thu'], want = [6, 10, 3, 9]
  chart('mixed', 'Draw the pictogram. One picture = 8 cakes. Monday 12, Tuesday 20, Wednesday 6, Thursday 18.', 'P10 review (own numbers)', { mode: 'pictogram', labels, values: [0, 0, 0, 0], key: 8 }, [want.join(',')], '1½, 2½, ¾, 2¼ pictures',
    'A quarter of a picture is 2 cakes.', boardModel([], [
      { title: 'Number ÷ key', say: 'Divide each day’s cakes by 8.', rows: ['12 ÷ 8 = 1½, 20 ÷ 8 = 2½', '6 ÷ 8 = ¾, 18 ÷ 8 = 2¼'] },
      { title: 'Draw the rows', say: 'A quarter is one small square.', rows: ['! 1½, 2½, ¾ and 2¼ pictures'] },
    ], 'Pictogram'), rowsWrong(labels, want))
}
{
  const labels = ['Saturday', 'Sunday'], values = [14, 5]
  const p = pg(labels, values, '12 people', 'Visitors: one picture stands for 12 people.')
  practice('mixed', 'One picture stands for 12 people. How many more people came on Saturday than on Sunday?', 'P10 review (own numbers)', p, number(27, '27'), 'Turn each row into people first.', boardModel([], [
    { title: 'Each row', say: 'A quarter of 12 is 3.', rows: ['Saturday: 3½ × 12 = 42', 'Sunday: 1¼ × 12 = 15'], picture: pg(labels, values, '12 people', 'Saturday 42, Sunday 15.', [[[0, 1], 'lit']], { 0: '42', 1: '15' }) },
    { title: 'The difference', say: 'Take Sunday from Saturday.', rows: ['42 − 15 = 27', '! 27 more people'] },
  ], 'Difference', p), slips(27, [[2.25, 'That’s the difference in pictures. Times it by 12.'], [57, 'Take them away, don’t add.']]), { label: 'People', prefix: 'More =' })
}
ask('mixed', 'One picture stands for 6 cars. How many pictures show 15 cars? Give it as a decimal.', 'P10 review (own numbers)', ['1 picture = 6 cars', '15 cars'], number(2.5, '2.5'), 'How many 6s make 15?', boardModel([], [
  { title: 'Share by the key', say: 'Two pictures is 12, and 3 more is half a picture.', rows: ['15 ÷ 6 = 2.5', '! 2.5 pictures, which is 2½'] },
], 'Pictures'), slips(2.5, [[3, '3 pictures is 18 cars.'], [9, 'That’s 15 − 6. Divide by the key instead.']]), { label: 'Pictures', prefix: 'Count =' })

add('mixed', 'Pictograms', 'P10 consolidation', text(
  'A pictogram shows data with pictures, and a key says what one picture stands for.',
  'Read: whole pictures × the key, plus the part. A quarter is a quarter of the key.',
  'Draw: each number ÷ the key, with parts of a picture for what is left.',
  'Problems: turn every row into a number first, then answer from those.',
))

export const tutorPictogramsLesson: TutorMethodLesson = {
  id: 'L310', number: 310, title: 'Pictograms', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Read a pictogram with its key, including parts of a picture, draw one with a sensible key, and use one to solve problems.',
  labels: { [read]: 'Reading pictograms', [draw]: 'Drawing pictograms', [problems]: 'Pictogram problems', mixed: 'Review' },
  states: finish(),
}

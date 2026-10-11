import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { fig, slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'

/*
 * Statistics lesson 18: Pie charts. From P18 in Sunny's revision book (p215–218): the angle of a slice is its
 * frequency ÷ the total × 360 (Brian's 60 people and their favourite colours), reading one back (Freddie's 90 people
 * and their bathrooms: 100° is 25 people, a probability of 5/18), and Your Turn: 32 students' jumpers, 510 cars under
 * a bridge, John's homework grades, the airport car park (600 Kia at 40°) and Oliver's and Lewis's leisure time.
 *
 * Four rungs: working out the angles; drawing a pie chart, built on the chart board's pie mode (ChartBoard.tsx);
 * reading one, from an angle back to a number; and comparing two pies with different totals, where a bigger slice
 * doesn't always mean more. Each rung opens with something to touch or a guess.
 *
 * The book's Your Turn pies give only one angle each (or none: the jumpers' red slice is a right angle in the photo),
 * so the other slices are our own numbers that fit the totals. The bathrooms pie gives only the 100° slice, so the
 * others (2 bathrooms 40, 3 bathrooms 18, 4 bathrooms 7) are ours too. Hidden on live: only the unlisted Probability
 * shelf opens it.
 */

const lesson = author(318)
const { add, finish } = lesson
const { worked, practice, ask, chartPlay, chart } = chanceScreens(lesson)
const angles = 'pie-angles'
const drawing = 'pie-draw'
const read = 'pie-read'
const compare = 'pie-compare'

const colours = ['Red', 'Blue', 'Green', 'Yellow', 'Other'], brian = [10, 13, 24, 5, 8]
const grades = ['A', 'B', 'C', 'D'], john = [6, 5, 10, 3]
const baths = ['1', '2', '3', '4'], bathN = [25, 40, 18, 7]
const sports = ['Golf', 'Climb', 'Tennis'], oliver = [2, 6, 4], lewis = [2, 3, 4]

type Tones = Partial<Record<number, FigureTone>>
const R = 2.2
/**
 * The pie and its labels, centred on `cx`: slices clockwise from the top, each named just outside the circle (so small
 * slices stay readable), with its angle inside when `show` is 'angles'. A `lit` or `found` slice is shaded and its
 * angle boxed; an `x` slice shows a ? inside.
 */
function pieItems(labels: string[], values: number[], cx: number, opts: { show?: 'angles'; tones?: Tones; within?: boolean }): FigureItem[] {
  const total = values.reduce((s, n) => s + n, 0), items: FigureItem[] = [{ kind: 'circle', centre: [cx, 0], r: R, fill: 'none' }]
  let turn = 0
  values.forEach((value, k) => {
    const angle = value / total * 360, from = 90 - turn - angle, to = 90 - turn, tone = opts.tones?.[k]
    turn += angle
    items.push({ kind: 'arc', centre: [cx, 0], r: R, from, to, sector: true, ...(tone === 'lit' || tone === 'found' ? { fill: 'part' as const } : {}) })
    const mid = (from + to) / 2 * Math.PI / 180, c = Math.cos(mid), s = Math.sin(mid), name = labels[k]
    if (opts.within) {
      // Two pies side by side: big slices only, so each name sits inside its slice, with a ? under an unknown one.
      items.push({ kind: 'text', at: [cx + R * 0.52 * c, R * 0.52 * s + (tone === 'x' ? 0.25 : 0)], text: name })
      if (tone === 'x') items.push({ kind: 'text', at: [cx + R * 0.52 * c, R * 0.52 * s - 0.35], text: '?', tone })
      return
    }
    items.push({ kind: 'text', at: [cx + (R + 0.25) * c, (R + 0.25) * s], text: name, dx: c * (name.length * 4.5 + 4), dy: -s * 7 })
    const inside = opts.show === 'angles' ? `${Number(angle.toFixed(1))}°` : tone === 'x' ? '?' : ''
    if (inside) items.push({ kind: 'text', at: [cx + R * (angle < 40 ? 0.68 : 0.55) * c, R * (angle < 40 ? 0.68 : 0.55) * s], text: inside, ...(tone ? { tone } : {}) })
  })
  return items
}
const pieFig = (labels: string[], values: number[], spoken: string, opts: { show?: 'angles'; tones?: Tones } = {}): AngleFrame => fig(pieItems(labels, values, 0, opts), spoken, undefined, 40)
/** Two pie charts side by side, each named above it, to compare: the slices named inside, the lit ones shaded. */
function twoPies(labels: string[], left: number[], right: number[], names: [string, string], spoken: string, opts: { tones?: [Tones, Tones] } = {}): AngleFrame {
  const gap = 5.4
  return fig([...pieItems(labels, left, 0, { tones: opts.tones?.[0], within: true }), ...pieItems(labels, right, gap, { tones: opts.tones?.[1], within: true }),
    { kind: 'text', at: [0, R + 0.45], text: names[0], tone: 'faint' }, { kind: 'text', at: [gap, R + 0.45], text: names[1], tone: 'faint' }], spoken, undefined, -14)
}

/* ---------- Rung 1: the angle of each slice ---------- */

chartPlay(angles, 'Drag the edge. Watch the angle.', 'P18 p215 How to draw a pie chart (play)', { mode: 'pie', labels: colours, values: [10, 13, 20, 9, 8], edge: 2 })
ask(angles, 'Guess first: 60 people, and 15 of them chose blue. How big is blue’s slice?', 'P18 p215 (guess first)', ['60 people in all; 15 chose blue.'], choose('90°, a quarter of the circle',
  ['15°', 'That’s the number of people. 15 out of 60 is a quarter, and a quarter of 360° is 90°.'], ['60°', '60 is how many people in all. 15 of them is a quarter of 360°, which is 90°.']),
'What fraction of the 60 is 15?', boardModel([], [
  { title: 'A fraction of 360°', say: '15 out of 60 is a quarter, so blue gets a quarter of the circle.', rows: ['15 ÷ 60 × 360 = 90', '! 90°'] },
], 'Angle'))
{
  const p = pieFig(colours, brian, 'Brian’s pie chart of 60 people’s favourite colours.', { show: 'angles' })
  worked(angles, 'Brian asked 60 people their favourite colour: red 10, blue 13, green 24, yellow 5, other 8. Work out the angle of each slice.', 'Angles in a pie chart', 'P18 p215 Example 1 (book’s numbers)', boardModel([], [
    { title: 'Find the total', say: 'Everyone asked is in one slice.', rows: ['10 + 13 + 24 + 5 + 8 = 60'], picture: pieFig(colours, brian, 'The five slices, named.') },
    { title: 'Each slice’s angle', say: 'A slice’s angle is its share of 60, times 360°.', rows: ['Red = 10 ÷ 60 × 360 = 60°', 'Blue = 13 ÷ 60 × 360 = 78°', 'Green = 24 ÷ 60 × 360 = 144°'], picture: pieFig(colours, brian, 'Red, blue and green lit.', { show: 'angles', tones: { 0: 'lit', 1: 'lit', 2: 'lit' } }) },
    { title: 'Check they make 360°', say: 'Yellow and other the same way; all five add up to the full turn.', rows: ['Yellow = 30°, Other = 48°', '60 + 78 + 144 + 30 + 48 = 360', '! 60°, 78°, 144°, 30°, 48°'], picture: p },
  ], 'Angles', p), 'Angle = frequency ÷ total × 360°. The angles always add up to 360°.')
}
chart(angles, 'Drag the edge so the green slice shows Brian’s 24 people out of 60.', 'P18 p215 Example 1 (book’s numbers)', { mode: 'pie', labels: colours, values: [10, 13, 19, 10, 8], edge: 2 }, ['144'], '144°',
  'Green’s angle is 24 ÷ 60 × 360.', boardModel([], [
    { title: 'Green’s angle', say: 'Green’s share of 60, times 360°.', rows: ['24 ÷ 60 × 360 = 144', '! Green = 144°'], picture: pieFig(colours, brian, 'Green lit, 144°.', { show: 'angles', tones: { 2: 'found' } }) },
  ], 'Angle'), r => `That’s ${r}°. Green is 24 of the 60 people: 24 ÷ 60 × 360.`)
{
  const p = pieFig(colours, brian, 'Brian’s pie chart with the blue slice marked.', { tones: { 1: 'x' } })
  practice(angles, 'Blue had 13 of Brian’s 60 people. What angle is the blue slice?', 'P18 p215 Example 1 (book’s numbers)', p, number(78, '78°'), 'Blue’s share of 60, times 360.', boardModel([], [
    { title: 'Share of 360°', say: 'Blue is 13 of the 60 people.', rows: ['13 ÷ 60 × 360 = 78', '! Blue = 78°'], picture: pieFig(colours, brian, 'Blue found, 78°.', { show: 'angles', tones: { 1: 'found' } }) },
  ], 'Angle', p), slips(78, [[13, 'That’s the number of people. Change it to an angle: 13 ÷ 60 × 360.'], [6, 'That’s the angle for one person. Blue has 13 people: 13 × 6.']]), { label: 'Angle (°)', prefix: 'Blue =' })
}
{
  const pets = ['Cats', 'Dogs', 'Fish', 'None'], petN = [14, 16, 4, 6]
  const p = pieFig(pets, petN, 'A pie chart of 40 people’s favourite pets, with the cats’ slice marked.', { tones: { 0: 'x' } })
  practice(angles, '40 people were asked their favourite pet, and 14 said cats. What angle is the cats’ slice?', 'P18 pie angles (own numbers)', p, number(126, '126°'), 'Cats’ share of 40, times 360.', boardModel([], [
    { title: 'Degrees for each person', say: 'The 360° is shared between 40 people.', rows: ['360 ÷ 40 = 9'] },
    { title: 'Cats’ angle', say: '14 people at 9° each.', rows: ['14 × 9 = 126', '! Cats = 126°'], picture: pieFig(pets, petN, 'Cats found, 126°.', { show: 'angles', tones: { 0: 'found' } }) },
  ], 'Angle', p), slips(126, [[14, 'That’s the number of people. Change it to an angle: 14 ÷ 40 × 360.'], [9, 'That’s the angle for one person. Cats have 14: 14 × 9.']]), { label: 'Angle (°)', prefix: 'Cats =' })
}

/* ---------- Rung 2: drawing a pie chart ---------- */

chartPlay(drawing, 'Drag the edge. Each student is 15°.', 'P18 Your Turn Q3 (play)', { mode: 'pie', labels: grades, values: [6, 3, 12, 3], edge: 1 })
ask(drawing, 'Guess first: John’s class has 24 students. How many degrees does each student get in the pie?', 'P18 Your Turn Q3 (guess first)', ['Grades: A 6, B 5, C 10, D 3. That’s 24 students.'], choose('15°',
  ['24°', 'That’s the number of students. Share the 360° between them: 360 ÷ 24.'], ['36°', 'That’s 360 ÷ 10. Share the 360° between all 24 students.']),
'Share the whole circle between the students.', boardModel([], [
  { title: 'Share the circle', say: 'The full turn of 360° shared between 24 students.', rows: ['360 ÷ 24 = 15', '! 15° each'] },
], 'Each student'))
{
  const p = pieFig(grades, john, 'John’s pie chart of 24 grades.', { show: 'angles' })
  worked(drawing, 'John’s class got these grades: A 6, B 5, C 10, D 3. Draw a pie chart.', 'Drawing a pie chart', 'P18 Your Turn Q3 (book’s numbers)', boardModel([], [
    { title: 'Degrees for each student', say: 'Add up the class, then share 360° between them.', rows: ['6 + 5 + 10 + 3 = 24', '360 ÷ 24 = 15'] },
    { title: 'Each slice’s angle', say: 'Each grade’s students at 15° each.', rows: ['A = 6 × 15 = 90°', 'B = 5 × 15 = 75°', 'C = 10 × 15 = 150°', 'D = 3 × 15 = 45°'], picture: pieFig(grades, john, 'The four angles.', { show: 'angles', tones: { 0: 'lit' } }) },
    { title: 'Check, then draw', say: 'They add up to 360°. Draw a line up from the centre, then measure each angle round with a protractor.', rows: ['90 + 75 + 150 + 45 = 360', '! A 90°, B 75°, C 150°, D 45°'], picture: p },
  ], 'Pie chart', p), 'Find the degrees for one, times each frequency, and check they add up to 360°. Then draw each angle with a protractor, one after another round the circle.')
}
chart(drawing, 'Draw John’s A slice: drag the edge so A has its 6 students out of 24.', 'P18 Your Turn Q3 (book’s numbers)', { mode: 'pie', labels: grades, values: [3, 8, 10, 3], edge: 0 }, ['90'], '90°',
  'Each student is 15°.', boardModel([], [
    { title: 'A’s angle', say: '6 students at 15° each.', rows: ['6 × 15 = 90', '! A = 90°'], picture: pieFig(grades, john, 'A found, 90°.', { show: 'angles', tones: { 0: 'found' } }) },
  ], 'Angle'), r => `That’s ${r}°. A has 6 students at 15° each: 6 × 15.`)
chart(drawing, 'Now draw C: drag the edge so C has its 10 students out of 24.', 'P18 Your Turn Q3 (book’s numbers)', { mode: 'pie', labels: grades, values: [6, 5, 6, 7], edge: 2 }, ['150'], '150°',
  'Each student is 15°.', boardModel([], [
    { title: 'C’s angle', say: '10 students at 15° each.', rows: ['10 × 15 = 150', '! C = 150°'], picture: pieFig(grades, john, 'C found, 150°.', { show: 'angles', tones: { 2: 'found' } }) },
  ], 'Angle'), r => `That’s ${r}°. C has 10 students at 15° each: 10 × 15.`)
{
  const p = pieFig(grades, john, 'John’s pie chart with the D slice marked.', { tones: { 3: 'x' } })
  practice(drawing, 'What angle should John draw for grade D, 3 of the 24 students?', 'P18 Your Turn Q3 (book’s numbers)', p, number(45, '45°'), 'Each student is 15°.', boardModel([], [
    { title: 'D’s angle', say: '3 students at 15° each.', rows: ['3 × 15 = 45', '! D = 45°'], picture: pieFig(grades, john, 'D found, 45°.', { show: 'angles', tones: { 3: 'found' } }) },
  ], 'Angle', p), slips(45, [[3, 'That’s the number of students. Each is 15°: 3 × 15.'], [15, 'That’s one student. D has 3: 3 × 15.']]), { label: 'Angle (°)', prefix: 'D =' })
}

/* ---------- Rung 3: reading a pie chart ---------- */

{
  const p = pieFig(['1 bathroom', '2', '3', '4'], bathN, '90 people’s bathrooms: the 1-bathroom slice is 100°.', { tones: { 0: 'lit' } })
  practice(read, 'Guess first: 90 people. The 1-bathroom slice is 100°, a little more than a quarter. About how many people is that?', 'P18 p216 (guess first)', p, choose('About 25',
    ['About 100', 'That’s the angle, not the people. A quarter of 90 is about 22, so a bit more than that.'], ['About 45', '45 is half of 90, which would be a 180° slice.']),
  'What’s a quarter of 90?', boardModel([], [
    { title: 'A bit over a quarter', say: 'A quarter of 90 is 22.5, and 100° is a little more than 90°.', rows: ['100 ÷ 360 × 90 = 25', '! About 25'] },
  ], 'People', p))
}
{
  const p = pieFig(baths, bathN, 'Freddie’s pie chart of 90 people’s bathrooms.', { tones: { 0: 'lit' } })
  worked(read, '90 people said how many bathrooms their home has. The 1-bathroom slice is 100°. What number is most common, how many have 1 bathroom, and what is the probability of picking one of them?', 'Reading a pie chart', 'P18 p216 Example 2 (book’s numbers)', boardModel([], [
    { title: 'The biggest slice', say: 'The most common answer has the biggest slice: 2 bathrooms.', rows: ['>0 Most common: 2 bathrooms'], picture: pieFig(baths, bathN, 'The 2-bathroom slice lit.', { tones: { 1: 'lit' } }) },
    { title: 'From angle to people', say: 'The slice’s share of 360°, times the 90 people.', rows: ['100 ÷ 360 × 90 = 25'], picture: pieFig(baths, bathN, 'The 1-bathroom slice, 100°.', { show: 'angles', tones: { 0: 'found' } }) },
    { title: 'As a probability', say: 'The slice’s share of the circle is the probability.', rows: ['P(1 bathroom) = 100/360 = 5/18', '! 2; 25 people; 5/18'] },
  ], 'Reading', p), 'Number = angle ÷ 360 × total. The biggest slice is the most common, and a slice’s share of 360° is the probability of picking it.')
}
{
  const jumpers = ['Red', 'White', 'Black', 'Blue', 'Green']
  const p = pieFig(jumpers, [8, 5, 10, 4, 5], '32 students’ jumpers. The red slice is a right angle.', { tones: { 0: 'lit' } })
  practice(read, '32 students wore jumpers. The red slice is a right angle, 90°. How many wore red?', 'P18 Your Turn Q1 (book’s numbers)', p, number(8, '8'), '90° is a quarter of the circle.', boardModel([], [
    { title: 'From angle to people', say: 'Red’s share of 360°, times the 32 students.', rows: ['90 ÷ 360 × 32 = 8', '! 8 students'] },
  ], 'People', p), slips(8, [[90, 'That’s the angle. Change it to students: 90 ÷ 360 × 32.'], [16, 'That’s half the pie. 90° is a quarter: 32 ÷ 4.']]), { label: 'Students', prefix: 'Red =' })
}
{
  const cars = ['Yellow', 'White', 'Black', 'Blue', 'Silver']
  const p = pieFig(cars, [85, 102, 153, 85, 85], '510 cars under a bridge. The yellow slice is 60°.', { tones: { 0: 'lit' } })
  practice(read, '510 cars passed under a bridge. Yellow’s slice is 60°. How many yellow cars were there?', 'P18 Your Turn Q2 (book’s numbers)', p, number(85, '85'), '60° is a sixth of 360°.', boardModel([], [
    { title: 'From angle to cars', say: 'Yellow’s share of 360°, times the 510 cars.', rows: ['60 ÷ 360 × 510 = 85', '! 85 yellow cars'] },
  ], 'Cars', p), slips(85, [[60, 'That’s the angle. Change it to cars: 60 ÷ 360 × 510.'], [8.5, 'Times by 510, not 51: 60 ÷ 360 × 510.']]), { label: 'Cars', prefix: 'Yellow =' })
}
const park = ['Kia', 'Ford', 'Renault', 'Mazda', 'Audi'], parkDeg = [40, 95, 85, 90, 50]
const parkFig = (tones: Tones = {}) => pieFig(park, parkDeg, 'The airport car park: Kia 40°, Renault 85°.', { tones })
practice(read, '600 Kia cars are shown by 40°. How many Renaults are there, at 85°?', 'P18 Your Turn Q4a (book’s numbers)', parkFig({ 0: 'lit', 2: 'x' }), number(1275, '1275'), 'Find how many cars 1° stands for.', boardModel([], [
  { title: 'Cars for one degree', say: '40° is 600 cars.', rows: ['600 ÷ 40 = 15 cars each degree'] },
  { title: 'Renault’s cars', say: '85° at 15 cars each.', rows: ['85 × 15 = 1275', '! 1275 Renaults'], picture: parkFig({ 2: 'found' }) },
], 'Cars', parkFig()), slips(1275, [[85, 'That’s the angle. Each degree is 15 cars: 85 × 15.'], [1200, 'That’s 80°. Renault is 85°: 85 × 15.']]), { label: 'Cars', prefix: 'Renault =' })
practice(read, 'How many cars are in the car park altogether?', 'P18 Your Turn Q4b (book’s numbers)', parkFig({ 0: 'lit' }), number(5400, '5400'), 'The whole circle is 360°, at 15 cars a degree.', boardModel([], [
  { title: 'The whole circle', say: 'Every car is in the 360°, at 15 cars each degree.', rows: ['360 × 15 = 5400', '! 5400 cars'] },
], 'Total', parkFig()), slips(5400, [[360, 'That’s degrees. Each degree is 15 cars.'], [1875, 'That’s Kia and Renault only. Use the whole 360°.']]), { label: 'Cars', prefix: 'Total =' })

/* ---------- Rung 4: comparing pie charts ---------- */

const leisure = (tones?: [Tones, Tones]) => twoPies(sports, oliver, lewis, ['Oliver, 12 hours', 'Lewis, 9 hours'], 'Oliver’s 12 hours and Lewis’s 9 hours of sport.', { tones })
practice(compare, 'Guess first: Lewis’s tennis slice (160°) is bigger than Oliver’s (120°). Does Lewis play more tennis?', 'P18 Your Turn Q5 (guess first)', leisure([{ 2: 'lit' }, { 2: 'lit' }]), choose('No: they play the same',
  ['Yes, his slice is bigger', 'A bigger slice of a smaller pie. Lewis has 9 hours, Oliver 12: both play 4 hours.'], ['No, Oliver plays more', 'Work them out: 120 ÷ 360 × 12 = 4 and 160 ÷ 360 × 9 = 4.']),
'Who has more hours to share out?', boardModel([], [
  { title: 'Change slices to hours', say: 'Each pie has its own total.', rows: ['Oliver = 120 ÷ 360 × 12 = 4', 'Lewis = 160 ÷ 360 × 9 = 4', '! The same: 4 hours each'] },
], 'Compare', leisure()))
worked(compare, 'Oliver has 12 hours of leisure a week and Lewis 9. Oliver’s tennis slice is 120° and Lewis’s 160°. Who plays more tennis?', 'Comparing pie charts', 'P18 Your Turn Q5 (own angles)', boardModel([], [
  { title: 'Oliver’s tennis', say: 'His slice’s share of his 12 hours.', rows: ['120 ÷ 360 × 12 = 4'], picture: leisure([{ 2: 'found' }, {}]) },
  { title: 'Lewis’s tennis', say: 'His slice’s share of his 9 hours.', rows: ['160 ÷ 360 × 9 = 4', '! The same: 4 hours each'], picture: leisure([{ 2: 'found' }, { 2: 'found' }]) },
], 'Compare', leisure()), 'A pie shows shares, not amounts. To compare two pies with different totals, change each slice back into a number first.')
practice(compare, 'Oliver’s golf slice is 60° of his 12 hours. How many hours does he play golf?', 'P18 Your Turn Q5 (book’s numbers)', leisure([{ 0: 'lit' }, {}]), number(2, '2 hours'), 'Golf’s share of 360°, times 12.', boardModel([], [
  { title: 'From angle to hours', say: '60° is a sixth of the circle.', rows: ['60 ÷ 360 × 12 = 2', '! 2 hours'] },
], 'Hours', leisure()), slips(2, [[60, 'That’s the angle. Change it to hours: 60 ÷ 360 × 12.'], [6, 'That’s half his time. 60° is a sixth: 12 ÷ 6.']]), { label: 'Hours', prefix: 'Golf =' })
practice(compare, 'Lewis plays the same 2 hours of golf, out of his 9 hours. What angle is Lewis’s golf slice?', 'P18 Your Turn Q5 (book’s numbers)', leisure([{}, { 0: 'x' }]), number(80, '80°'), 'Golf’s share of 9 hours, times 360.', boardModel([], [
  { title: 'Share of 360°', say: '2 of his 9 hours.', rows: ['2 ÷ 9 × 360 = 80', '! Golf = 80°'], picture: leisure([{}, { 0: 'found' }]) },
], 'Angle', leisure()), slips(80, [[60, 'That’s Oliver’s slice, from 12 hours. Lewis has 9: 2 ÷ 9 × 360.'], [40, 'Each of Lewis’s hours is 40°. Golf is 2 hours: 2 × 40.']]), { label: 'Angle (°)', prefix: 'Golf =' })
{
  const games = ['Art', 'Music', 'Drama'], classA = [10, 8, 12], classB = [8, 5, 7]
  const pies = (tones?: [Tones, Tones]) => twoPies(games, classA, classB, ['Class A, 30', 'Class B, 20'], 'Class A’s 30 students and class B’s 20 students: their favourite subject.', { tones })
  practice(compare, 'Class B has 20 students, and its art slice is 144°. How many in class B chose art?', 'P18 comparing pies (own numbers)', pies([{}, { 0: 'lit' }]), number(8, '8'), 'Art’s share of 360°, times 20.', boardModel([], [
    { title: 'From angle to students', say: 'Class B’s slice, out of its 20 students.', rows: ['144 ÷ 360 × 20 = 8', '! 8 students'] },
  ], 'Students', pies()), slips(8, [[144, 'That’s the angle. Change it to students: 144 ÷ 360 × 20.'], [12, 'Times by 20, class B’s total, not 30.']]), { label: 'Students', prefix: 'Art =' })
  practice(compare, 'Class A has 30 students and a 120° art slice. Which class has more students who chose art?', 'P18 comparing pies (own numbers)', pies([{ 0: 'lit' }, { 0: 'lit' }]), choose('Class A',
    ['Class B', 'Its slice is bigger, but its class is smaller: 8 students against class A’s 10.'], ['The same', 'Work out class A: 120 ÷ 360 × 30 = 10, and class B has 8.']),
  'Change class A’s slice into students too.', boardModel([], [
    { title: 'Both as students', say: 'Each slice out of its own class.', rows: ['A = 120 ÷ 360 × 30 = 10', 'B = 144 ÷ 360 × 20 = 8', '! Class A: 10 against 8'] },
  ], 'Compare', pies()))
}

/* ---------- Review: one of each, our own numbers ---------- */

chart('mixed', '45 people chose their favourite pet, and 20 chose dogs. Drag the edge so the dog slice is right.', 'P18 review (own numbers)', { mode: 'pie', labels: ['Dog', 'Cat', 'Fish', 'None'], values: [10, 15, 8, 12], edge: 0 }, ['160'], '160°',
  'Dogs’ share of 45, times 360.', boardModel([], [{ title: 'Dogs’ angle', say: '360 ÷ 45 = 8° for each person.', rows: ['20 × 8 = 160', '! Dog = 160°'] }], 'Angle'),
  r => `That’s ${r}°. Each of the 45 people is 8°, and 20 chose dogs: 20 × 8.`)
{
  const p = pieFig(['Swim', 'Run', 'Cycle', 'Walk'], [10, 22, 25, 15], '72 people’s favourite exercise. The swim slice is 50°.', { tones: { 0: 'lit' } })
  practice('mixed', '72 people chose their favourite exercise. Swimming’s slice is 50°. How many chose swimming?', 'P18 review (own numbers)', p, number(10, '10'), 'Swimming’s share of 360°, times 72.', boardModel([], [
    { title: 'From angle to people', say: 'Each person is 360 ÷ 72 = 5°.', rows: ['50 ÷ 5 = 10', '! 10 people'] },
  ], 'People', p), slips(10, [[50, 'That’s the angle. Each person is 5°: 50 ÷ 5.'], [5, 'That’s the angle for one person. Swimming has 50°: 50 ÷ 5.']]), { label: 'People', prefix: 'Swim =' })
}
{
  const ways = ['Walk', 'Bus', 'Car'], x = [60, 150, 90], y = [50, 70, 80]
  const p = twoPies(ways, x, y, ['School X, 300', 'School Y, 200'], 'How 300 students at school X and 200 at school Y get to school.', { tones: [{ 0: 'lit' }, { 0: 'lit' }] })
  practice('mixed', 'School X’s walk slice is 72° of 300 students; school Y’s is 90° of 200. How many more walk at school X?', 'P18 review (own numbers)', p, number(10, '10'), 'Change each slice into students first.', boardModel([], [
    { title: 'Both as students', say: 'Each slice out of its own school.', rows: ['X = 72 ÷ 360 × 300 = 60', 'Y = 90 ÷ 360 × 200 = 50'] },
    { title: 'The difference', say: 'Take them away.', rows: ['60 − 50 = 10', '! 10 more at school X'] },
  ], 'Compare', p), slips(10, [[18, 'That’s the difference in angles. Change each slice into students first.'], [-10, 'School X has more: 60 against 50.']]), { label: 'Students', prefix: 'More =' })
}

add('mixed', 'Pie charts', 'P18 consolidation', text(
  'Angle = frequency ÷ total × 360°. The angles add up to 360°.',
  'Draw: degrees for one, times each frequency, then a protractor.',
  'Read: number = angle ÷ 360 × total.',
  'Compare: a bigger slice of a smaller pie can be fewer. Change slices into numbers first.',
))

export const tutorPieChartsLesson: TutorMethodLesson = {
  id: 'L318', number: 318, title: 'Pie charts', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Work out the angles of a pie chart, draw one, read a slice back as a number, and compare two pies with different totals.',
  labels: { [angles]: 'Working out angles', [drawing]: 'Drawing pie charts', [read]: 'Reading pie charts', [compare]: 'Comparing pie charts', mixed: 'Review' },
  states: finish(),
}

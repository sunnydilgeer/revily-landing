import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { lineFig } from './statsPictures'

/*
 * Statistics lesson 17: Line graphs. From P17 in Sunny's revision book (p212–214): drawing a line graph (David's sleep
 * over a week: the independent variable along the x-axis, the dependent one up the y-axis, equal spacing, labels, a
 * title, straight lines between the points), and Your Turn: Syd's monthly temperatures, Roger's guitar sales graph and
 * its two mistakes, the shop's TVs, a village's population and the Met Office's rainfall.
 *
 * Three rungs: draw a line graph, built on the chart board's line mode (ChartBoard.tsx); read one, for rises, falls,
 * differences and the trend; and spot the mistakes in one. Each rung opens with something to touch or a guess.
 *
 * Roger's graph, as photographed: the 2014 point is at 600, not 700, and the y-axis has numbers but no label (the
 * years are equally spaced, near enough). Those are the two mistakes taught here. Hidden on live: only the unlisted
 * Probability shelf opens it.
 */

const lesson = author(317)
const { add, finish } = lesson
const { worked, practice, ask, chartPlay, chart } = chanceScreens(lesson)
const draw = 'line-draw'
const read = 'line-read'
const mistakes = 'line-mistakes'

const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'], sleep = [7.2, 6.5, 6, 8.4, 9.2, 9.1, 5.9]
const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], temps = [11, 15, 18, 21, 22, 17]
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], tvs = [1, 4, 3, 4, 6]
const decades = ['1970', '1980', '1990', '2000', '2010'], people = [0.9, 1.8, 3.5, 4.2, 6.8]
const wet = ['Jan', 'Feb', 'Mar', 'Apr', 'May'], rain = [160, 210, 140, 160, 80]
const years = ['2014', '2015', '2016', '2017', '2018'], guitars = [700, 1000, 950, 700, 1150], rogers = [600, 1000, 950, 700, 1150]

/** The first value out of place on a line graph built on the board, named. */
const firstWrong = (labels: string[], want: number[]) => (r: string) => {
  const got = r.split(',').map(Number), k = got.findIndex((n, i) => n !== want[i])
  return k < 0 ? 'Check every point.' : `${labels[k]} should be ${want[k]}, not ${got[k]}.`
}

/* ---------- Rung 1: drawing a line graph ---------- */

chartPlay(draw, 'Drag the points. Watch the line.', 'P17 p212 Drawing a line graph (play)', { mode: 'line', labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [7, 6, 7, 8, 9, 8, 6], max: 10, snap: 0.5 })
ask(draw, 'Guess first: David’s sleep each night for a week. Which goes along the bottom, the x-axis?', 'P17 p212 (guess first)', ['Mon 7.2, Tue 6.5, Wed 6, Thu 8.4, Fri 9.2, Sat 9.1, Sun 5.9 hours'], choose('The days of the week',
  ['The hours of sleep', 'Hours are what David measures, so they go up the side. The days are what he picks.'], ['Either way round', 'The thing you choose (the days) goes along the bottom; the thing you measure goes up.']),
'Which one does David choose, and which does he measure?', boardModel([], [
  { title: 'Chosen or measured', say: 'David picks the days; the hours are what he measures. What you pick goes along the x-axis.', rows: ['! The days go along the x-axis'] },
], 'Axes'))
{
  const p = lineFig(days, sleep, 'A line graph of David’s sleep over a week.', { max: 10, step: 5, yTitle: 'Sleep (hours)' })
  worked(draw, 'Draw a line graph of David’s sleep: Mon 7.2, Tue 6.5, Wed 6, Thu 8.4, Fri 9.2, Sat 9.1, Sun 5.9 hours.', 'Drawing a line graph', 'P17 p212 Example (book’s numbers)', boardModel([], [
    { title: 'Set up the axes', say: 'The days along the x-axis, equally spaced. Hours up the y-axis, from 0 to 10.', rows: ['>0 Days along x, hours of sleep up y'], picture: lineFig(days, days.map(() => null), 'Empty axes: the days along the bottom, 0 to 10 hours up the side.', { max: 10, step: 5, yTitle: 'Sleep (hours)' }) },
    { title: 'Plot each night', say: 'An × above each day, at its number of hours.', rows: ['>0 Mon 7.2, Tue 6.5, Wed 6, Thu 8.4', '>0 Fri 9.2, Sat 9.1, Sun 5.9'], picture: lineFig(days, sleep, 'Seven points, not yet joined.', { max: 10, step: 5, yTitle: 'Sleep (hours)', join: false }) },
    { title: 'Join them up', say: 'Join each point to the next with a straight line, then add a title.', rows: ['! Straight lines, both axes labelled, a title'], picture: lineFig(days, sleep, 'The points joined with straight lines.', { max: 10, step: 5, yTitle: 'Sleep (hours)', lit: [0, 1, 2, 3, 4, 5] }) },
  ], 'Line graph', p), 'What you choose (the time) goes along the x-axis, equally spaced; what you measure goes up the y-axis. Plot each point, join them with straight lines, and label both axes.')
}
chart(draw, 'Draw Syd’s line graph: drag each point to its temperature in °C. Apr 11, May 15, Jun 18, Jul 21, Aug 22, Sep 17.', 'P17 Your Turn Q1 (book’s numbers)',
  { mode: 'line', labels: months, values: [15, 15, 15, 15, 15, 15], max: 30 }, [temps.join(',')], temps.join(', '), 'Drag each point until the number above it matches the table.', boardModel([], [
    { title: 'One point each month', say: 'Each month’s point sits at its temperature; the lines join them in order.', rows: ['>0 Apr 11, May 15, Jun 18', '>0 Jul 21, Aug 22, Sep 17'], picture: lineFig(months, temps, 'Syd’s temperatures, April to September.', { max: 30, step: 10, yTitle: 'Temperature (°C)', tones: Object.fromEntries(temps.map((_, k) => [k, 'lit'])) }) },
  ], 'Line graph'), firstWrong(months, temps))
{
  const p = lineFig(months, temps, 'Syd’s average temperatures, April to September.', { max: 30, step: 10, yTitle: 'Temperature (°C)' })
  practice(draw, 'By how many degrees did the average temperature rise from April to August?', 'P17 Your Turn Q1 (book’s numbers)', p, number(11, '11 °C'), 'Read April and August, then take away.', boardModel([], [
    { title: 'Read the two points', say: 'April is 11 °C and August 22 °C.', rows: ['>0 April 11, August 22'], picture: lineFig(months, temps, 'April and August lit.', { max: 30, step: 10, yTitle: 'Temperature (°C)', tones: { 0: 'lit', 4: 'lit' } }) },
    { title: 'Take them away', say: 'The rise is the difference.', rows: ['22 − 11 = 11', '! A rise of 11 °C'] },
  ], 'Rise', p), slips(11, [[22, 'That’s August’s temperature. Take away April’s, 11.'], [33, 'Take them away, don’t add.']]), { label: 'Degrees', prefix: 'Rise =' })
}
chart(draw, 'Draw the line graph of TVs sold: Mon 1, Tue 4, Wed 3, Thu 4, Fri 6.', 'P17 Your Turn Q3 (book’s numbers)',
  { mode: 'line', labels: weekdays, values: [3, 3, 3, 3, 3], max: 8 }, [tvs.join(',')], tvs.join(', '), 'Drag each point to its number of TVs.', boardModel([], [
    { title: 'One point each day', say: 'Each day’s point sits at the number of TVs sold.', rows: ['! Mon 1, Tue 4, Wed 3, Thu 4, Fri 6'], picture: lineFig(weekdays, tvs, 'TVs sold, Monday to Friday.', { max: 8, step: 2, yTitle: 'TVs sold', tones: Object.fromEntries(tvs.map((_, k) => [k, 'lit'])) }) },
  ], 'Line graph'), firstWrong(weekdays, tvs))

/* ---------- Rung 2: reading a line graph ---------- */

const village = (opts: { tones?: Record<number, 'lit' | 'found'>; lit?: number[] } = {}) => lineFig(decades, people, 'A village’s population, in thousands, every ten years from 1970 to 2010.', { max: 8, step: 2, yTitle: 'Population (1000s)', ...opts })
practice(read, 'Guess first: in which ten years did the village grow the most?', 'P17 Your Turn Q4 (guess first)', village(), choose('2000 to 2010',
  ['1980 to 1990', 'That rise is 3.5 − 1.8 = 1.7 thousand. 2000 to 2010 is 6.8 − 4.2 = 2.6 thousand.'], ['1970 to 1980', 'That rise is only 1.8 − 0.9 = 0.9 thousand.']),
'Look for the steepest piece of line.', boardModel([], [
  { title: 'The steepest line', say: 'The steeper the line, the bigger the rise. 2000 to 2010 climbs 6.8 − 4.2 = 2.6 thousand.', rows: ['! 2000 to 2010'], picture: village({ lit: [3], tones: { 3: 'lit', 4: 'found' } }) },
], 'Biggest rise', village()))
{
  const p = lineFig(days, sleep, 'David’s sleep over a week.', { max: 10, step: 5, yTitle: 'Sleep (hours)' })
  worked(read, 'Between which two nights did David’s sleep go up the most, and by how much?', 'Reading a line graph', 'P17 p212 Example (book’s numbers)', boardModel([], [
    { title: 'Read every point', say: 'Read across from each × to the scale.', rows: ['>0 7.2, 6.5, 6, 8.4, 9.2, 9.1, 5.9'], picture: lineFig(days, sleep, 'Every point read off.', { max: 10, step: 5, yTitle: 'Sleep (hours)', tones: Object.fromEntries(sleep.map((_, k) => [k, 'lit'])) }) },
    { title: 'Find the steepest climb', say: 'The steepest line going up is Wednesday to Thursday.', rows: ['8.4 − 6 = 2.4', '! Wed to Thu: up 2.4 hours'], picture: lineFig(days, sleep, 'Wednesday to Thursday lit.', { max: 10, step: 5, yTitle: 'Sleep (hours)', lit: [2], tones: { 2: 'lit', 3: 'found' } }) },
  ], 'Biggest rise', p), 'A line going up is a rise, going down a fall; the steeper it is, the bigger the change. Take the two readings away to find it.')
}
practice(read, 'How many more people lived in the village in 2010 than in 1970?', 'P17 Your Turn Q4 (book’s numbers)', village(), number(5900, '5900'), 'The scale is in thousands.', boardModel([], [
  { title: 'Read the two points', say: '1970 is 0.9 thousand and 2010 is 6.8 thousand.', rows: ['6.8 − 0.9 = 5.9 thousand'], picture: village({ tones: { 0: 'lit', 4: 'lit' } }) },
  { title: 'In thousands', say: 'Each line on the scale is a thousand people.', rows: ['5.9 × 1000 = 5900', '! 5900 more people'] },
], 'Difference', village()), slips(5900, [[5.9, 'That’s 5.9 thousand. Write the number of people.'], [7700, 'Take them away, don’t add.']]), { label: 'People', prefix: 'More =' })
{
  const p = lineFig(wet, rain, 'UK rainfall each month, January to May.', { max: 300, step: 100, yTitle: 'Rainfall (mm)' })
  practice(read, 'How much more rain fell in February than in May?', 'P17 Your Turn Q5 (book’s numbers)', p, number(130, '130 mm'), 'Read February and May off the scale.', boardModel([], [
    { title: 'Read the two points', say: 'February is 210 mm and May 80 mm.', rows: ['>0 February 210, May 80'], picture: lineFig(wet, rain, 'February and May lit.', { max: 300, step: 100, yTitle: 'Rainfall (mm)', tones: { 1: 'lit', 4: 'lit' } }) },
    { title: 'Take them away', say: 'The difference between them.', rows: ['210 − 80 = 130', '! 130 mm more'] },
  ], 'Difference', p), slips(130, [[290, 'Take them away, don’t add.'], [70, 'That’s February take away March. Use May, 80 mm.']]), { label: 'Rainfall (mm)', prefix: 'More =' })
}
practice(read, 'What does the graph show about the village’s population?', 'P17 Your Turn Q4 (book’s numbers)', village(), choose('It went up every ten years',
  ['It went up, then down', 'Every piece of the line goes up, from 0.9 thousand to 6.8 thousand.'], ['It stayed about the same', 'It grew from under a thousand to almost seven thousand.']),
'Does each piece of line go up or down?', boardModel([], [
  { title: 'Follow the line', say: 'Every piece of the line climbs, so the population rose every ten years.', rows: ['! It went up every ten years'], picture: village({ lit: [0, 1, 2, 3] }) },
], 'Trend', village()))

/* ---------- Rung 3: mistakes in a line graph ---------- */

const roger = (tones: Record<number, 'lit' | 'found' | 'x'> = {}) => lineFig(years, rogers, 'Roger’s graph of guitar sales, 2014 to 2018, with no label on the side.', { max: 1500, step: 500, tones })
practice(mistakes, 'Guess first: Roger’s table says 2014 700, 2015 1000, 2016 950, 2017 700, 2018 1150. Which point has he plotted wrong?', 'P17 Your Turn Q2 (guess first)', roger(), choose('2014',
  ['2017', 'The 2017 point is at 700, which matches the table.'], ['2018', 'The 2018 point is at 1150, which matches the table.']),
'Check each point against the table.', boardModel([], [
  { title: 'Check each point', say: 'The 2014 point is at 600, a little above 500. The table says 700.', rows: ['! 2014: at 600, not 700'], picture: roger({ 0: 'x' }) },
], 'Wrong point', roger()))
worked(mistakes, 'State two mistakes Roger made in drawing his line graph.', 'Spotting mistakes', 'P17 Your Turn Q2 (book’s numbers)', boardModel([], [
  { title: 'Check the points', say: 'Every point against the table: 2014 should be at 700, not 600.', rows: ['>0 Mistake 1: 2014 is plotted at 600'], picture: roger({ 0: 'x' }) },
  { title: 'Check the axes', say: 'The y-axis has numbers but no label, so we can’t tell it counts guitars sold.', rows: ['! 2014 plotted wrong; no y-axis label'], picture: lineFig(years, rogers, 'Roger’s graph with its y-axis labelled.', { max: 1500, step: 500, yTitle: 'Guitars sold', tones: { 0: 'x' } }) },
], 'Mistakes', roger()), 'Check a line graph: every point against the table, equal steps on both axes, both axes labelled, and a title.')
chart(mistakes, 'Fix Roger’s graph: drag the 2014 point to where it should be.', 'P17 Your Turn Q2 (book’s numbers)',
  { mode: 'line', labels: years, values: rogers, max: 1500, free: [0], snap: 50 }, ['700'], '700', 'The table says 700 guitars in 2014.', boardModel([], [
    { title: 'Move the point', say: '2014 sold 700 guitars, so the point goes up to 700.', rows: ['! 2014 at 700'], picture: lineFig(years, guitars, 'The 2014 point moved to 700.', { max: 1500, step: 500, yTitle: 'Guitars sold', tones: { 0: 'found' } }) },
  ], 'Fixed'), r => `That’s ${r}. The table says 2014 sold 700 guitars.`)
{
  const savings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], ticks = ['0', '10', '20', '40', '50']
  const p = lineFig(savings, [1.5, 1, 2, 3, 2.5, 3.5], 'Ella’s savings graph. Its scale reads 0, 10, 20, 40, 50.', { max: 4, step: 1, ticks, yTitle: 'Savings (£)' })
  practice(mistakes, 'Ella’s scale goes up 0, 10, 20, 40, 50. Which number should be where 40 is?', 'P17 line graph mistakes (own numbers)', p, number(30, '30'), 'The steps on a scale must all be the same.', boardModel([], [
    { title: 'Find the step', say: 'The scale starts 0, 10, 20, so it goes up in 10s.', rows: ['20 + 10 = 30', '! 30, not 40'] },
  ], 'Scale', p), slips(30, [[40, 'That’s what Ella wrote. The steps go up in 10s: 0, 10, 20, …'], [20, '20 is already the line below. Go up one step of 10.']]), { label: '', prefix: 'Should be =' })
}
{
  const p = lineFig(years, [40, 55, 50, 70, 65], 'Cinema tickets sold each year, in thousands.', { max: 80, step: 20, yTitle: 'Tickets (1000s)', xs: [0.4, 1.8, 4.6, 6.0, 7.6] })
  practice(mistakes, 'What is wrong with this line graph?', 'P17 line graph mistakes (own numbers)', p, choose('The years aren’t equally spaced',
    ['The y-axis has no label', 'It does: tickets, in thousands.'], ['The points shouldn’t be joined', 'A line graph joins its points with straight lines.']),
  'Look at the gaps between the years.', boardModel([], [
    { title: 'Check the spacing', say: 'There’s a big gap from 2015 to 2016 and a small one from 2016 to 2017. Each year needs the same space.', rows: ['! The years aren’t equally spaced'] },
  ], 'Mistake', p))
}

/* ---------- Review: one of each, our own numbers ---------- */

{
  const weeks = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5'], plant = [2, 5, 9, 12, 14]
  chart('mixed', 'Draw the line graph of a plant’s height in cm: week 1 2, week 2 5, week 3 9, week 4 12, week 5 14.', 'P17 review (own numbers)', { mode: 'line', labels: weeks, values: [8, 8, 8, 8, 8], max: 16 }, [plant.join(',')], plant.join(', '),
    'Drag each point to its height.', boardModel([], [{ title: 'One point each week', say: 'Each week’s point sits at the plant’s height.', rows: ['! 2, 5, 9, 12, 14 cm'] }], 'Line graph'), firstWrong(weeks, plant))
}
{
  const sold = [30, 45, 25, 60, 50]
  const p = lineFig(weekdays, sold, 'Ice creams a café sold, Monday to Friday.', { max: 60, step: 20, yTitle: 'Ice creams' })
  practice('mixed', 'What was the biggest fall in ice creams sold from one day to the next?', 'P17 review (own numbers)', p, number(20, '20'), 'Find the steepest line going down.', boardModel([], [
    { title: 'Lines going down', say: 'Tuesday to Wednesday and Thursday to Friday go down.', rows: ['45 − 25 = 20', '60 − 50 = 10', '! A fall of 20, Tue to Wed'], picture: lineFig(weekdays, sold, 'Tuesday to Wednesday lit.', { max: 60, step: 20, yTitle: 'Ice creams', lit: [1], tones: { 1: 'lit', 2: 'found' } }) },
  ], 'Biggest fall', p), slips(20, [[35, 'That’s the biggest rise, Wednesday to Thursday. Look for a line going down.'], [10, 'That’s Thursday to Friday. Tuesday to Wednesday falls further.']]), { label: 'Ice creams', prefix: 'Fall =' })
}
practice('mixed', 'David’s sleep: what was his biggest fall from one night to the next?', 'P17 review (book’s numbers)', lineFig(days, sleep, 'David’s sleep over a week.', { max: 10, step: 5, yTitle: 'Sleep (hours)' }), number(3.2, '3.2 hours'), 'Find the steepest line going down.', boardModel([], [
  { title: 'The steepest fall', say: 'Saturday 9.1 hours to Sunday 5.9 hours.', rows: ['9.1 − 5.9 = 3.2', '! 3.2 hours, Sat to Sun'], picture: lineFig(days, sleep, 'Saturday to Sunday lit.', { max: 10, step: 5, yTitle: 'Sleep (hours)', lit: [5], tones: { 5: 'lit', 6: 'found' } }) },
], 'Biggest fall'), slips(3.2, [[2.4, 'That’s the biggest rise, Wednesday to Thursday. Look for a line going down.'], [0.7, 'That’s Monday to Tuesday. Saturday to Sunday falls further.']]), { label: 'Hours', prefix: 'Fall =' })

add('mixed', 'Line graphs', 'P17 consolidation', text(
  'Draw: time along the x-axis, equally spaced; what you measure up the y-axis.',
  'Plot each point, then join them with straight lines.',
  'Read: up is a rise, down a fall; the steeper, the bigger the change.',
  'Check: every point, equal steps, both axes labelled, a title.',
))

export const tutorLineGraphsLesson: TutorMethodLesson = {
  id: 'L317', number: 317, title: 'Line graphs', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Draw a line graph with time along the bottom, read it for rises, falls and the trend, and spot the mistakes in one.',
  labels: { [draw]: 'Drawing line graphs', [read]: 'Reading line graphs', [mistakes]: 'Spotting mistakes', mixed: 'Review' },
  states: finish(),
}

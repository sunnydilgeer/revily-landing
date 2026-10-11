import { author } from '../../written-methods/tutor/content'
import type { FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { slips } from '../../geometry/tutor/figureLesson'
import { chanceScreens } from './chanceLesson'
import { scatterFig, type ScatterAxis } from './statsPictures'

/*
 * Statistics lesson 16: Scatter graphs. From P16 in Sunny's revision book (p207–211): correlation (positive or
 * negative, strong or weak), the line of best fit, Example 1 (11 students' Maths and English marks: negative), Example 2
 * (Maths 60 reads English 50), interpolation and extrapolation, and Your Turn: graphs A, B and C, Rey's students'
 * heights and weights (predict 190 cm), the cooling cup of tea, and revision hours against exam scores.
 *
 * Three rungs on the chart board's scatter mode (ChartBoard.tsx): correlation (drag one point and watch the word
 * change), plotting (place a point; spot the outlier), and the line of best fit (drag its ends; it is read at a given x,
 * and any sensible reading is accepted). Pictures are measured scatter graphs (statsPictures.ts).
 *
 * The points come from the book's tables, not its drawn graphs: Example 1's printed graph doesn't match its own table
 * point for point. Graphs A, B and C are read by eye from the photo; C's points are spread a little more than read so it
 * is clearly weak, as the book means. Q5's outlier is (6, 85), 6 hours (the notes said 8 h, 32, which is on the trend).
 * Rey's data reaches 102 kg at 200 cm along its line, so her axes run 50 to 110 kg. Hidden on live: only the unlisted
 * Probability shelf opens it.
 */

const lesson = author(316)
const { add, finish } = lesson
const { worked, practice, ask, chartPlay, chart, sort } = chanceScreens(lesson)
const corr = 'scatter-correlation'
const plot = 'scatter-plot'
const fit = 'scatter-best-fit'

type Pts = [number, number][]
const ten = (title: string, step = 2): ScatterAxis => ({ from: 0, to: 10, step, title })
const graph = (points: Pts, spoken: string, opts: Parameters<typeof scatterFig>[4] = {}) => scatterFig(points, ten('x'), ten('y', 5), spoken, opts)

/* Graphs A, B and C (p209 Q1), read from the photo on 0 to 10 axes. */
const gA: Pts = [[0.8, 0.8], [1.6, 3], [2.2, 1.6], [3, 2.9], [4.1, 5.2], [5.5, 7], [5.8, 6.1], [6.8, 5.6], [8.1, 8.2], [8.3, 8.8]]
const gB: Pts = [[2.1, 7.6], [7.1, 7.4], [2.7, 4.9], [5.2, 4.7], [1.6, 4], [7.9, 4.4], [7, 2.9], [2.2, 1.3], [3.6, 0.9], [5.7, 1.3]]
const gC: Pts = [[1, 7.4], [2.5, 8.1], [2.6, 4.5], [3.9, 5.4], [4.6, 6.7], [4.6, 2.6], [6.3, 2.9], [6.3, 0.9], [6.9, 5.6], [8.5, 2.4], [3.2, 2.8]]
const gNeg: Pts = gA.map(([x, y]) => [x, 10 - y])

/* Example 1: 11 students' Maths and English marks (p208). */
const maths = [38, 62, 18, 75, 38, 59, 66, 92, 52, 75, 48], english = [74, 44, 85, 19, 88, 69, 50, 33, 29, 32, 56]
const me: Pts = maths.map((m, k) => [m, english[k]])
const marks = (k: string, step = 20): ScatterAxis => ({ from: 0, to: 100, step, title: k })
const meFig = (opts: Parameters<typeof scatterFig>[4] = {}) => scatterFig(me, marks('Maths mark'), marks('English mark', 25), '11 students’ Maths and English marks: as Maths goes up, English tends to go down.', opts)

/* Q2: Rey's students. */
const rey: Pts = [[180, 86], [175, 92], [161, 85], [155, 60], [187, 90], [173, 87], [158, 66], [168, 68], [161, 77], [176, 78]]
const reyX: [number, number, string] = [150, 200, 'Height (cm)'], reyY: [number, number, string] = [50, 110, 'Weight (kg)']
const reyFig = (opts: Parameters<typeof scatterFig>[4] = {}) => scatterFig(rey, { from: 150, to: 200, step: 10, title: 'Height (cm)' }, { from: 50, to: 110, step: 20, title: 'Weight (kg)' }, 'Rey’s 10 students’ heights and weights.', opts)

/* Q3: a cup of tea cooling. */
const tea: Pts = [[0, 95], [1, 89], [2, 81], [4, 76], [5, 72], [8, 55], [10, 45]]
const teaFig = (opts: Parameters<typeof scatterFig>[4] = {}) => scatterFig(tea, { from: 0, to: 10, step: 2, title: 'Time (minutes)' }, { from: 40, to: 100, step: 20, title: 'Temperature (°C)' }, 'A cup of tea’s temperature over 10 minutes.', opts)

/* Q5: hours of revision and exam score. */
const rev: Pts = [[0, 20], [2, 28], [5, 23], [6, 85], [8, 32], [10, 63], [13, 52], [14, 60], [15, 58], [16, 68], [18, 69], [25, 80]]
const revFig = (opts: Parameters<typeof scatterFig>[4] = {}) => scatterFig(rev, { from: 0, to: 30, step: 5, title: 'Revision (hours)' }, { from: 0, to: 100, step: 25, title: 'Exam score' }, '12 students’ hours of revision and exam scores.', opts)

/* ---------- Rung 1: correlation ---------- */

chartPlay(corr, 'Drag the new point. Watch the correlation.', 'P16 p207 Correlation (play)', { mode: 'scatter', points: [[1, 2], [2, 4], [3, 3], [4, 5], [6, 5], [7, 7], [8, 6]], x: [0, 10, 'x'], y: [0, 10, 'y'], move: 'point', from: [5, 5], snap: [0.5, 0.5] })
ask(corr, 'Guess first: students who revise for longer, and their exam scores. What kind of link would you expect?', 'P16 Your Turn Q5 (guess first)', ['Hours of revision', 'Exam score'], choose('Positive: more revision, higher scores',
  ['Negative', 'Negative means one goes up as the other goes down. More revision doesn’t usually mean lower scores.'], ['No link', 'Revising usually helps, so the scores tend to rise with the hours.']),
'As the hours go up, what happens to the scores?', boardModel([], [
  { title: 'Both go up', say: 'More hours tends to go with higher scores: both rise together.', rows: ['! Positive correlation'] },
], 'Correlation'))
worked(corr, 'What kinds of correlation can a scatter graph show?', 'Correlation', 'P16 p207 Correlation (book’s graphs)', boardModel([], [
  { title: 'Positive', say: 'As one goes up, so does the other: the points rise to the right.', rows: ['>0 Up together: positive'], picture: graph(gA, 'Points rising to the right: positive correlation.') },
  { title: 'Negative', say: 'As one goes up, the other goes down: the points fall to the right.', rows: ['>0 One up, one down: negative'], picture: graph(gNeg, 'Points falling to the right: negative correlation.') },
  { title: 'Strong or weak', say: 'Close to a line is strong. Spread out is weak.', rows: ['>0 Spread out: weak'], picture: graph(gC, 'Points falling to the right but spread out: weak negative correlation.') },
  { title: 'No correlation', say: 'Scattered everywhere: no link at all.', rows: ['! Positive, negative or none; strong or weak'], picture: graph(gB, 'Points scattered everywhere: no correlation.') },
], 'Correlation', graph(gA, 'A scatter graph.')), 'Positive correlation: both go up together. Negative: one goes up as the other goes down. Points close to a line are strong correlation; spread out is weak.')
sort(corr, 'Sort these pairs by the correlation you’d expect.', 'P16 Your Turn Q3–Q5 (and our own)', { kind: 'bins', bins: [{ id: 'pos', label: 'Positive' }, { id: 'neg', label: 'Negative' }, { id: 'none', label: 'None' }], tiles: [
  { label: 'Revision and score', to: 'pos', why: 'More revision tends to go with higher scores.' },
  { label: 'Tea’s time and temperature', to: 'neg', why: 'As time goes on, the tea gets colder.' },
  { label: 'Height and weight', to: 'pos', why: 'Taller people tend to weigh more.' },
  { label: 'Shoe size and phone number', to: 'none', why: 'There’s no link between them at all.' },
  { label: 'Car’s age and its value', to: 'neg', why: 'Older cars tend to be worth less.' },
  { label: 'Runner’s weight and 5 km time', to: 'pos', why: 'In the book’s data, heavier runners took longer.' },
] }, 'Does one go up with the other, go down, or neither?', boardModel([], [
  { title: 'Up together', say: 'Revision and score, height and weight, weight and time.', rows: ['>0 Positive: revision, height, runners'] },
  { title: 'One up, one down', say: 'The tea cools with time; cars lose value with age. Shoe size and phone number aren’t linked.', rows: ['! Negative: tea, car. None: shoe size'] },
], 'Correlation'))
practice(corr, 'Describe the correlation in graph C.', 'P16 Your Turn Q1 (book’s graph C)', graph(gC, 'Graph C: points falling to the right, quite spread out.'), choose('Weak negative correlation',
  ['Strong negative correlation', 'The points fall to the right, but they’re quite spread out, not close to a line.'], ['Weak positive correlation', 'The points fall as you go right, so it’s negative.'], ['No correlation', 'There is a trend: the points tend to fall to the right.']),
'Which way do the points go? Are they close to a line?', boardModel([], [
  { title: 'Which way', say: 'Going right, the points tend to go down: negative.', rows: ['>0 Falling: negative'], picture: graph(gC, 'Graph C.', { line: [[0.5, 7.6], [9, 1.6]] }) },
  { title: 'How close', say: 'They’re spread out around that trend: weak.', rows: ['! Weak negative'] },
], 'Correlation', graph(gC, 'Graph C.')))
practice(corr, 'Describe the correlation in graph B.', 'P16 Your Turn Q1 (book’s graph B)', graph(gB, 'Graph B: points scattered all over.'), choose('No correlation',
  ['Weak positive correlation', 'The points don’t rise to the right; they’re all over the place.'], ['Weak negative correlation', 'The points don’t fall to the right either; there’s no trend.']),
'Is there any trend up or down?', boardModel([], [
  { title: 'Look for a trend', say: 'High and low points at every x: no pattern.', rows: ['! No correlation'], picture: graph(gB, 'Graph B.') },
], 'Correlation', graph(gB, 'Graph B.')))

/* ---------- Rung 2: plotting ---------- */

chartPlay(plot, 'A 12th student. Drag their marks: where fits the pattern?', 'P16 p208 Example 1 (play)', { mode: 'scatter', points: me, x: [0, 100, 'Maths mark'], y: [0, 100, 'English mark'], move: 'point', from: [50, 50], snap: [5, 5] })
worked(plot, 'Plot a scatter graph of the 11 students’ Maths and English marks.', 'Plotting a scatter graph', 'P16 p208 Example 1 (book’s numbers)', boardModel([], [
  { title: 'Choose the axes', say: 'Maths along the bottom, English up the side, both 0 to 100.', rows: ['>0 x: Maths, y: English'], picture: scatterFig([], marks('Maths mark'), marks('English mark', 25), 'Empty axes, 0 to 100.') },
  { title: 'Plot one student', say: 'The first student: across to 38, up to 74. Mark it with a cross.', rows: ['>0 (38, 74)'], picture: scatterFig([[38, 74]], marks('Maths mark'), marks('English mark', 25), 'The point (38, 74).', { tones: { 0: 'lit' } }) },
  { title: 'Plot them all', say: 'Do every student the same way.', rows: ['>0 Eleven crosses'], picture: meFig() },
  { title: 'Read the pattern', say: 'Higher Maths marks tend to go with lower English marks.', rows: ['! Negative correlation'], picture: meFig({ line: [[15, 95], [95, 15]] }) },
], 'Scatter graph', meFig()), 'Each pair of values is one point: across for x, up for y. Then look at the pattern the points make.')
chart(plot, 'Plot Rey’s first student: height 180 cm, weight 86 kg. Drag the point.', 'P16 Your Turn Q2a (book’s numbers)', { mode: 'scatter', points: rey.slice(1), x: reyX, y: reyY, move: 'point', from: [170, 70], snap: [1, 1] }, ['180,86'], '(180, 86)',
  'Across to 180 on the height axis, then up to 86.', boardModel([], [
    { title: 'Across, then up', say: 'Height is along the bottom, weight up the side.', rows: ['x = 180, y = 86', '! (180, 86)'], picture: reyFig({ tones: { 0: 'found' } }) },
  ], 'Point'), r => { const [x, y] = r.split(',').map(Number); return x !== 180 ? `Your point is at ${x} cm across. Go along to 180 first.` : `Your point is at ${y} kg. Go up to 86.` })
chart(plot, 'Plot the tea’s temperature after 8 minutes: 55 °C. Drag the point.', 'P16 Your Turn Q3a (book’s numbers)', { mode: 'scatter', points: tea.filter(p => p[0] !== 8), x: [0, 10, 'Time (min)'], y: [40, 100, 'Temp (°C)'], move: 'point', from: [5, 90], snap: [1, 1] }, ['8,55'], '(8, 55)',
  'Across to 8 minutes, then up to 55 °C.', boardModel([], [
    { title: 'Across, then up', say: 'Time is along the bottom, temperature up the side.', rows: ['x = 8, y = 55', '! (8, 55)'], picture: teaFig({ tones: { 5: 'found' } }) },
  ], 'Point'), r => { const [x, y] = r.split(',').map(Number); return x !== 8 ? `Your point is at ${x} minutes. Go along to 8 first.` : `Your point is at ${y} °C. Go up to 55.` })
practice(plot, 'One point doesn’t fit the pattern: it’s an outlier. How many hours of revision did that student do?', 'P16 Your Turn Q5d (book’s numbers)', revFig(), number(6, '6'), 'Look for the point far from the others.', boardModel([], [
  { title: 'The trend', say: 'Most points rise steadily from bottom left to top right.', rows: ['>0 Positive trend'], picture: revFig({ line: [[0, 20], [30, 99]] }) },
  { title: 'Far from the rest', say: '(6, 85) is far above every other student near 6 hours.', rows: ['Outlier = (6, 85)', '! 6 hours'], picture: revFig({ tones: { 3: 'found' } }) },
], 'Outlier', revFig()), slips(6, [[85, 'That’s the score. The question asks for the hours.'], [8, '(8, 32) sits close to the others. Look for the point far above them.']]), { label: 'Hours', prefix: 'Revision =' })
practice(plot, 'Describe the correlation between Rey’s students’ heights and weights.', 'P16 Your Turn Q2a (book’s numbers)', reyFig(), choose('Positive: taller students tend to weigh more',
  ['Negative', 'The points rise to the right, so it’s positive.'], ['No correlation', 'There is a trend: the taller students are mostly the heavier ones.']),
'As height goes up, what does weight tend to do?', boardModel([], [
  { title: 'Which way', say: 'Going right, the points tend to rise: positive, and fairly strong.', rows: ['! Positive correlation'], picture: reyFig({ line: [[150, 64], [200, 103]] }) },
], 'Correlation', reyFig()))

/* ---------- Rung 3: the line of best fit ---------- */

chartPlay(fit, 'Drag the ends of the line until it runs through the middle of the points.', 'P16 p207 Line of best fit (play)', { mode: 'scatter', points: me, x: [0, 100, 'Maths mark'], y: [0, 100, 'English mark'], move: 'line', readAt: 60, from: [40, 60] })
practice(fit, 'Guess first: which prediction can you trust more from the Maths and English graph?', 'P16 p208 Example 2 (guess first)', meFig(), choose('English for a Maths mark of 60',
  ['English for a Maths mark of 5', 'No student scored that low in Maths. That’s outside the data: extrapolation.'], ['Both the same', '60 is inside the data and 5 is far outside it; the pattern may not carry on.']),
'Which Maths mark is among the data?', boardModel([], [
  { title: 'Inside or outside', say: 'The Maths marks run from 18 to 92. 60 is inside; 5 is outside.', rows: ['>0 18 to 92'], picture: meFig() },
  { title: 'Interpolation', say: 'A prediction inside the data is interpolation, and fairly reliable.', rows: ['! Maths 60'] },
], 'Prediction', meFig()))
worked(fit, 'Predict the English mark of someone who scored 60 in Maths.', 'Line of best fit', 'P16 p208 Example 2 (book’s numbers)', boardModel([], [
  { title: 'Draw the line', say: 'A straight line through the middle of the points, with about as many above as below.', rows: ['>0 Through the middle'], picture: meFig({ line: [[15, 95], [95, 15]] }) },
  { title: 'Up from 60', say: 'Go up from 60 on the Maths axis until you hit the line.', rows: ['>0 x = 60'], picture: meFig({ line: [[15, 95], [95, 15]], read: [60, 50] }) },
  { title: 'Across to English', say: 'Then across to the English axis. It reaches 50.', rows: ['! English ≈ 50'], picture: meFig({ line: [[15, 95], [95, 15]], read: [60, 50] }) },
], 'Prediction', meFig()), 'A line of best fit goes through the middle of the points. Read a prediction off it: up from x, across to y. Inside the data (interpolation) is fairly reliable; outside it (extrapolation) isn’t.')
{
  const line: [[number, number], [number, number]] = [[15, 95], [95, 15]]
  practice(fit, 'Use the line of best fit to predict the English mark for a Maths mark of 40.', 'P16 p208 Example 2 (own reading)', meFig({ line }), number(70, '70'), 'Up from 40 to the line, then across.', boardModel([], [
    { title: 'Up from 40', say: 'From 40 on the Maths axis, up to the line.', rows: ['>0 x = 40'], picture: meFig({ line, read: [40, 70] }) },
    { title: 'Across', say: 'Across to the English axis.', rows: ['! English ≈ 70'], picture: meFig({ line, read: [40, 70] }) },
  ], 'Prediction', meFig({ line })), slips(70, [[60, 'That’s 20 above the line at 60. Go up from 40, then across.'], [40, 'That’s the Maths mark. Read across to the English axis.']]), { prefix: 'English =' })
}
chart(fit, 'Drag the ends to draw a line of best fit for Rey’s students. It shows the weight it predicts for a height of 190 cm.', 'P16 Your Turn Q2b (book’s numbers)', { mode: 'scatter', points: rey, x: reyX, y: reyY, move: 'line', readAt: 190, from: [60, 70], snap: [1, 1] },
  ['98', '97', '96', '95', '94', '93', '92'], 'about 95 kg', 'Rising through the middle of the points: about as many above as below.', boardModel([], [
    { title: 'Through the middle', say: 'The line rises from about 64 kg at 150 cm to about 103 kg at 200 cm.', rows: ['>0 About 64 to 103'], picture: reyFig({ line: [[150, 64], [200, 103]] }) },
    { title: 'Read at 190', say: 'Up from 190 to the line, then across.', rows: ['>0 Up from 190, across: 95', '! About 95 kg'], picture: reyFig({ line: [[150, 64], [200, 103]], read: [190, 95] }) },
  ], 'Prediction'), r => `Your line predicts ${r} kg at 190 cm. ${Number(r) < 92 ? 'It’s too low: the tall students are about 86 to 90 kg, and 190 cm is taller still.' : 'It’s too high: keep it through the middle of the points.'}`)
practice(fit, 'Use the line of best fit to estimate the tea’s temperature after 6 minutes.', 'P16 Your Turn Q3d (book’s numbers)', teaFig({ line: [[0, 95], [10, 45]] }), number(65, '65 °C'), 'Up from 6 minutes to the line, then across.', boardModel([], [
  { title: 'Up from 6', say: 'From 6 on the time axis, up to the line.', rows: ['>0 x = 6'], picture: teaFig({ line: [[0, 95], [10, 45]], read: [6, 65] }) },
  { title: 'Across', say: 'Across to the temperature axis: halfway between 60 and 70.', rows: ['! About 65 °C'], picture: teaFig({ line: [[0, 95], [10, 45]], read: [6, 65] }) },
], 'Temperature', teaFig({ line: [[0, 95], [10, 45]] })), slips(65, [[60, 'Halfway between 60 and 70 is 65.'], [70, 'That’s the reading at 5 minutes. Go up from 6.']]), { prefix: 'Temp =' })
chart(fit, 'Draw a line of best fit for the revision data, ignoring the outlier. It shows the score it predicts for 22 hours.', 'P16 Your Turn Q5e (book’s numbers)', { mode: 'scatter', points: rev, x: [0, 30, 'Revision (hours)'], y: [0, 100, 'Exam score'], move: 'line', readAt: 22, from: [30, 40], snap: [1, 1] },
  ['82', '81', '80', '79', '78', '77', '76', '75', '74'], 'about 78', 'Rising through the middle of the points; leave out (6, 85).', boardModel([], [
    { title: 'Through the middle', say: 'Leave out the outlier. The line rises from about 20 at 0 hours to about 99 at 30.', rows: ['>0 About 20 to 99'], picture: revFig({ line: [[0, 20], [30, 99]] }) },
    { title: 'Read at 22', say: 'Up from 22 hours to the line, then across.', rows: ['>0 Up from 22, across: 78', '! About 78'], picture: revFig({ line: [[0, 20], [30, 99]], read: [22, 78] }) },
  ], 'Prediction'), r => `Your line predicts ${r} at 22 hours. ${Number(r) < 74 ? 'It’s too low: students who did 16 to 25 hours scored 68 to 80.' : 'It’s too high: keep it through the middle of the points.'}`)
practice(fit, 'Why might the graph not be good for estimating the score of a student who revised for 85 hours?', 'P16 Your Turn Q5f (book’s numbers)', revFig(), choose('85 hours is far outside the data',
  ['There’s an outlier', 'The outlier is at 6 hours. It doesn’t stop us predicting inside the data.'], ['The correlation is negative', 'It’s positive: more revision, higher scores.']),
'The data runs from 0 to 25 hours.', boardModel([], [
  { title: 'Outside the data', say: 'The hours run from 0 to 25. 85 is far outside: extrapolation.', rows: ['>0 0 to 25 hours'], picture: revFig() },
  { title: 'The line breaks', say: 'Carried on, the line would predict over 200 marks, which is impossible.', rows: ['! Far outside the data'] },
], 'Prediction', revFig()))

/* ---------- Review: our own numbers ---------- */

{
  const own: Pts = [[1, 4], [2, 5], [4, 8], [5, 10], [7, 13], [8, 16], [9, 17]]
  const x: ScatterAxis = { from: 0, to: 10, step: 2, title: 'Hours' }, y: ScatterAxis = { from: 0, to: 20, step: 5, title: 'Plants' }
  chart('mixed', 'Plot the point (6, 14). Drag it.', 'P16 review (own numbers)', { mode: 'scatter', points: own, x: [0, 10, 'Hours'], y: [0, 20, 'Plants'], move: 'point', from: [3, 4], snap: [1, 1] }, ['6,14'], '(6, 14)',
    'Across to 6, then up to 14.', boardModel([], [
      { title: 'Across, then up', say: 'x first, then y.', rows: ['x = 6, y = 14', '! (6, 14)'], picture: scatterFig([...own, [6, 14]], x, y, 'Seven points and the new point (6, 14).', { tones: { 7: 'found' } }) },
    ], 'Point'), r => { const [a, b] = r.split(',').map(Number); return a !== 6 ? `Your point is at ${a} across. Go along to 6 first.` : `Your point is at ${b} up. Go up to 14.` })
  const line: [[number, number], [number, number]] = [[0, 2], [10, 20]]
  practice('mixed', 'Use the line of best fit to predict y when x is 5.', 'P16 review (own numbers)', scatterFig(own, x, y, 'Seven points rising to the right, with a line of best fit.', { line }), number(11, '11'), 'Up from 5 to the line, then across.', boardModel([], [
    { title: 'Up and across', say: 'Up from 5 to the line, then across to the y-axis.', rows: ['>0 x = 5', '! y ≈ 11'], picture: scatterFig(own, x, y, 'The reading at 5.', { line, read: [5, 11] }) },
  ], 'Prediction', scatterFig(own, x, y, 'Seven points.', { line })), slips(11, [[10, 'That’s the point (5, 10). Read the line, not the point.'], [5, 'That’s x. Read across to the y-axis.']]), { prefix: 'y =' })
  practice('mixed', 'Which of these predictions is extrapolation?', 'P16 review (own numbers)', scatterFig(own, x, y, 'Seven points from x = 1 to x = 9.', { line }), choose('Predicting y when x is 15',
    ['Predicting y when x is 5', '5 is inside the data, 1 to 9: interpolation.'], ['Predicting y when x is 8', '8 is inside the data: interpolation.']),
  'Which x is outside 1 to 9?', boardModel([], [
    { title: 'Outside the data', say: 'The data runs from x = 1 to x = 9. Only 15 is outside it.', rows: ['! x = 15'] },
  ], 'Prediction'))
}

add('mixed', 'Scatter graphs', 'P16 consolidation', text(
  'Positive: both go up. Negative: one up, one down. None: no pattern.',
  'Close to a line: strong. Spread out: weak.',
  'Line of best fit: through the middle, about as many above as below.',
  'Predict: up from x to the line, across to y.',
  'Inside the data (interpolation) is fairly reliable; outside it (extrapolation) isn’t.',
))

export const tutorScatterGraphsLesson: TutorMethodLesson = {
  id: 'L316', number: 316, title: 'Scatter graphs', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Plot a scatter graph, describe its correlation, spot an outlier, and draw and read a line of best fit, knowing when a prediction can be trusted.',
  labels: { [corr]: 'Correlation', [plot]: 'Plotting scatter graphs', [fit]: 'Line of best fit', mixed: 'Review' },
  states: finish(),
}

/*
 * Lesson 8H, Velocity–time graphs (Higher only, after lesson 108). From the Higher revision guide, GR13 Velocity-Time
 * Graphs (p135–138) and GR14 Area Under a Curve (p139–140):
 * - Reading the graph (Level 6-7): the gradient is the acceleration, a flat part is a constant speed (not stopped), a
 *   negative gradient is a deceleration. The book's 50-second car journey (0, 0), (10, 15), (20, 15), (30, 25),
 *   (50, 0): its sections described and their accelerations 1.5, 0, 1 and −1.25 m/s². Your Turn Q1 (the ball).
 * - Distance travelled (Level 8-9 in the book's Skill 3): the area under the graph, split into triangles, rectangles
 *   and trapeziums: 75 + 150 + 200 + 250 = 675 m. Your Turn Q2 (the track cyclist) and Q3 (the runner's average
 *   acceleration), read from the book's graphs to the nearest grid line.
 * - Curved graphs (Level 6-7): average acceleration from the line joining two points (1.5 m/s²) and the acceleration
 *   at a point from a tangent (1.04 m/s²), on the book's curve, which is v = 3√t.
 * - Area under a curve (GR14, Level 8-9): equal strips, a triangle then trapeziums, added up. The book's example is
 *   drawn as v = 4.5√t, which gives its readings to 1 dp (4.5, 6.4, 7.8, 9) and 23.2 m (the book reads 4.4 and gets
 *   23.1 m). Your Turn Q1 and Q2 on curves close to the book's. An estimate accepts an answer near it, as the book says.
 */
import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import type { GraphFrame, GraphPoint } from '../../written-methods/tutor/methodWorking'
import { line, part, sign, type StepWorking, type WorkedStep } from '../../written-methods/tutor/stepWorking'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, gradient, plot, pt, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { rlGrid } from '../../real-life-graphs/tutor/realLifeWorkings'
import type { CurveFn } from '../../written-methods/tutor/curves'
import { between, choose, number, screens, text } from './helpers'

const a = author(108.5, 'L108H')
const { add, finish } = a
const { practice, graph, onGrid } = screens(a)

const reading = 'velocity-time-reading'
const distance = 'velocity-time-distance'
const curves = 'velocity-time-curves'
const area = 'area-under-curve'

const show = (n: number) => String(Math.round(n * 1000) / 1000).replace('-', '−')
const seconds = (per: number) => ({ name: 's', per })
const speed = (per: number) => ({ name: 'm/s', per })
/** The graph's axes. Squares worth 2.5 or 0.5 are numbered every other square, so the numbers don't crowd. */
function axes(xEnd: number, xPer: number, yEnd: number, yPer: number): GraphGrid {
  const g = rlGrid(seconds(xPer), xEnd, speed(yPer), yEnd)
  return Number.isInteger(yPer) ? g : { ...g, scale: { x: g.scale!.x, y: { ...g.scale!.y, every: 2 } } }
}
/** A velocity–time graph drawn as straight pieces through `corners`, there from the start. */
function journey(corners: GraphPoint[], xEnd: number, xPer: number, yEnd: number, yPer: number): GraphGrid {
  const g = axes(xEnd, xPer, yEnd, yPer)
  return { ...g, lines: corners.slice(1).map((p, i) => ({ from: corners[i], to: p, at: -1, segment: true })) }
}
/** A velocity–time curve, its polynomial in t (or a function), there from the start. */
const curved = (coeffs: number[], from: number, to: number, xEnd: number, xPer: number, yEnd: number, yPer: number, fn?: CurveFn): GraphGrid =>
  ({ ...axes(xEnd, xPer, yEnd, yPer), curves: [{ coeffs, fn, from, to, at: -1 }] })
const words = (frame: GraphFrame, step: number, text: string, family = 3) => [...(frame.working ?? []), { text, family, at: step }]

/** Moves: one section of a journey, its time across (amber) and change in speed up or down (biro blue), and its sum. */
function sectionMove(p: GraphPoint, q: GraphPoint, title: string, say: string, sum: string): GraphMove {
  const turn = pt(q.x, p.y)
  return {
    title, say, equation: latex(sum), adds: 'picture',
    change: (frame, step) => ({
      ...frame, boxed: [p, q],
      legs: [...(frame.legs ?? []), { from: p, to: turn, label: show(q.x - p.x), family: 1, at: step },
        ...(q.y !== p.y ? [{ from: turn, to: q, label: show(q.y - p.y), family: 0, at: step }] : [])],
      working: words(frame, step, sum),
    }),
  }
}
/** Moves: a shape under the graph shaded, labelled, and its area written under the grid. */
function shapeMove(corners: GraphPoint[], label: string, title: string, say: string, sum: string): GraphMove {
  return {
    title, say, equation: latex(sum), adds: 'picture',
    change: (frame, step) => ({ ...frame, regions: [...(frame.regions ?? []), { points: corners, label, at: step }], working: words(frame, step, sum) }),
  }
}
/** The corners of the area under a straight piece from p to q, down to the time axis. */
const under = (p: GraphPoint, q: GraphPoint) => [pt(p.x, 0), p, q, pt(q.x, 0)]

/* ---------- Section 1: reading the graph ---------- */

add(reading, 'Velocity–time graphs', 'Higher GR13 Velocity-Time Graphs - Key things to remember', text(
  'A velocity–time (or speed–time) graph has speed up the side and time along the bottom. It shows how the speed changes.',
  'The gradient is the acceleration: how much faster it goes each second, in m/s².',
  'A flat part means a constant speed. It is still moving! On a distance–time graph flat means stopped, but not here.',
  'A negative gradient means it is slowing down: a deceleration. The area under the graph is the distance travelled.',
))

const car = [pt(0, 0), pt(10, 15), pt(20, 15), pt(30, 25), pt(50, 0)]
// Run to 55 seconds so 50 is numbered: the axis name sits over the last numbers.
const carGrid = journey(car, 55, 5, 25, 2.5)

graph(reading, 'The speed–time graph shows a 50-second car journey. Find the acceleration in each section, and which section has the greatest.', 'Higher GR13 Skill 2: Calculating Acceleration', 'Acceleration in sections A to D', carGrid, [
  sectionMove(car[0], car[1], 'Section A', 'From 0 to 15 m/s in 10 seconds: up 15, across 10. It speeds up at a steady rate, because the line is straight.', 'A: 15 ÷ 10 = 1.5 m/s²'),
  sectionMove(car[1], car[2], 'Section B', 'Flat: the speed stays at 15 m/s for 10 seconds. It is moving at a constant speed, so the acceleration is 0.', 'B: 0 ÷ 10 = 0 m/s²'),
  sectionMove(car[2], car[3], 'Section C', 'From 15 to 25 m/s in 10 seconds: up 10, across 10.', 'C: 10 ÷ 10 = 1 m/s²'),
  sectionMove(car[3], car[4], 'Section D', 'From 25 m/s down to 0 in 20 seconds: down 25, across 20. A negative gradient is a deceleration.', 'D: −25 ÷ 20 = −1.25 m/s²'),
  answerMove('Section A: 1.5 m/s²', 'The greatest', 'Section A has the largest acceleration, 1.5 m/s². D is steeper than C, but it is slowing down.'),
], 'Up ÷ across', 'Acceleration in each section',
  'In each section, the acceleration is the gradient: the change in speed divided by the time it took.')

/** The gradient of one section of the car journey. */
function sectionWorking(start: string, up: [number, number], across: [number, number], answer: string): StepWorking {
  const dv = up[1] - up[0], dt = across[1] - across[0]
  return { kind: 'step-worked', start, steps: [
    { title: 'Change in speed', why: 'The speed at the end of the section take away the speed at the start.', lines: [line([part(show(up[1]), 0), sign('−'), part(show(up[0]), 0)], show(dv))] },
    { title: 'Time taken', why: 'The time at the end of the section take away the time at the start.', lines: [line([part(show(across[1]), 1), sign('−'), part(show(across[0]), 1)], show(dt))] },
    { title: 'Divide them', why: 'The acceleration is the gradient: change in speed divided by time, in metres per second squared.', lines: [line([part(show(dv)), sign('÷'), part(show(dt))], answer, { answer: true })] },
  ] }
}
const accC = onGrid(reading, 'Use the car’s graph. Work out the acceleration in section C, from 20 to 30 seconds.', 'Higher GR13 Skill 2: Calculating Acceleration', carGrid,
  gradient(1, '1'), '1', 'From 15 m/s to 25 m/s in 10 seconds.', sectionWorking('Section C, 20 s to 30 s', [15, 25], [20, 30], '1'), 'Acceleration (m/s²)')
const accD = onGrid(reading, 'Use the car’s graph. Work out the acceleration in section D, from 30 to 50 seconds.', 'Higher GR13 Skill 2: Calculating Acceleration', carGrid,
  gradient(-1.25, '−1.25'), '−1.25', 'It slows down, so the answer is negative.', sectionWorking('Section D, 30 s to 50 s', [25, 0], [30, 50], '−1.25'), 'Acceleration (m/s²)')

practice(reading, 'Describe what the car is doing in section B, from 10 to 20 seconds.', 'Higher GR13 Skill 1: Describing a Graph', choose([
  'Moving at a constant speed of 15 m/s',
  'Stopped for 10 seconds',
  'Speeding up to 15 m/s',
  'Slowing down to 15 m/s',
]), 'Moving at a constant speed of 15 m/s', 'Flat on a speed–time graph is not the same as flat on a distance–time graph.', {
  kind: 'step-worked', start: 'Section B is flat at 15 m/s', steps: [
    { title: 'Read the speed', why: 'The line stays at the same height the whole time.', lines: [line([part('speed', 0)], '15 m/s', { eq: true })] },
    { title: 'Flat means steady', why: 'The speed doesn’t change, so the car keeps going at that speed. Stopped would be a speed of zero.', words: 'Moving at a constant speed of 15 m/s' },
  ],
})
practice(reading, 'Describe what the car is doing in section D, from 30 to 50 seconds.', 'Higher GR13 Skill 1: Describing a Graph', choose([
  'Slowing down steadily from 25 m/s to 0 over 20 seconds',
  'Going back to where it started',
  'Speeding up from 25 m/s over 20 seconds',
  'Moving at a constant speed of 25 m/s',
]), 'Slowing down steadily from 25 m/s to 0 over 20 seconds', 'The line goes down: what does that mean for the speed?', {
  kind: 'step-worked', start: 'Section D goes from 25 m/s down to 0', steps: [
    { title: 'Read the ends', why: 'At thirty seconds the speed is twenty-five, and at fifty seconds it is zero.', lines: [line([part('50', 1), sign('−'), part('30', 1)], '20')] },
    { title: 'Going down', why: 'A straight line going down means the speed falls at a steady rate. It is not going back: that is a distance–time graph.', words: 'Slowing down steadily from 25 m/s to 0 over 20 seconds' },
  ],
})

// Your Turn Q1: draw the ball's journey from its description.
const ball = [pt(0, 0), pt(12, 4), pt(32, 2), pt(50, 2)]
const ballGrid = axes(55, 5, 5, 0.5)
graph(reading, 'A ball starts at rest and speeds up steadily to 4 m/s in 12 seconds. It then slows down at 0.1 m/s² for 20 seconds, then goes at a constant speed for 18 seconds. Draw its speed–time graph.', 'Higher GR13 Your Turn Q1', 'The ball’s journey', ballGrid, [
  { title: 'Speeding up', say: 'From rest (0 m/s) to 4 m/s in the first 12 seconds: a straight line from (0, 0) to (12, 4).', equation: latex('(0, 0)\\ \\text{to}\\ (12, 4)'), adds: 'picture',
    change: (frame, step) => ({ ...frame, lines: [{ from: ball[0], to: ball[1], at: step, segment: true }], points: [{ ...ball[1], at: step, label: '(12, 4)' }], working: words(frame, step, 'Rest to 4 m/s in 12 s') }) },
  { title: 'Slowing down', say: 'It loses 0.1 m/s every second for 20 seconds, so it loses 2 m/s and ends at 2 m/s, at 32 seconds.', equation: latex('4 - 0.1 × 20 = 2'), adds: 'picture',
    change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), { from: ball[1], to: ball[2], at: step, segment: true }], points: [...(frame.points ?? []), { ...ball[2], at: step, label: '(32, 2)', place: { dx: 1, dy: 1 } }], working: words(frame, step, '4 − 0.1 × 20 = 2 m/s at 12 + 20 = 32 s') }) },
  answerMove('(0, 0), (12, 4), (32, 2), (50, 2)', 'Constant speed', 'A constant speed is flat: 2 m/s from 32 seconds to 32 + 18 = 50 seconds.', [], {
    title: '', say: '', equation: '', adds: 'answer',
    change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), { from: ball[2], to: ball[3], at: step, segment: true, answer: true }] }),
  }),
], 'Piece by piece', 'Draw the journey', 'Draw it one piece at a time: each new piece starts where the last one ended.')

const ballSpeed = practice(reading, 'The ball is going at 4 m/s. It slows down at 0.1 m/s² for 20 seconds. How fast is it going then?', 'Higher GR13 Your Turn Q1', number(2, '2 m/s'), '2',
  'It loses 0.1 m/s every second.', {
    kind: 'step-worked', start: '4 m/s, slowing at 0.1 m/s² for 20 s', steps: [
      { title: 'Speed lost', why: 'A deceleration of nought point one means it loses that much speed every second.', lines: [line([part('0.1'), sign('×'), part('20')], '2')] },
      { title: 'Speed left', why: 'Take the speed it lost from the speed it started with.', lines: [line([part('4'), sign('−'), part('2')], '2', { answer: true })] },
    ],
  }, 'Speed (m/s)')
ballSpeed.answerPrefix = 'Speed ='

/* ---------- Section 2: distance travelled ---------- */

add(distance, 'Distance is the area', 'Higher GR13 Skill 3: Calculating Total Distance Travelled', text(
  'The area under a velocity–time graph is the distance travelled.',
  'Split the area into shapes you know: triangles (½ × base × height), rectangles (base × height) and trapeziums (½ × (a + b) × h).',
  'Work out each area and add them up. The base is a time and the height a speed, so the answer is in metres.',
))

graph(distance, 'The speed–time graph shows the 50-second car journey. Calculate the total distance travelled.', 'Higher GR13 Skill 3: Calculating Total Distance Travelled', 'Total distance in 50 seconds', carGrid, [
  shapeMove(under(car[0], car[1]), 'A', 'Triangle A', 'A triangle: base 10 seconds, height 15 m/s.', 'A = ½ × 10 × 15 = 75 m'),
  shapeMove(under(car[1], car[2]), 'B', 'Rectangle B', 'A rectangle: 10 seconds by 15 m/s.', 'B = 10 × 15 = 150 m'),
  shapeMove(under(car[2], car[3]), 'C', 'Trapezium C', 'A trapezium: parallel sides 15 and 25, 10 seconds wide.', 'C = ½ × (15 + 25) × 10 = 200 m'),
  shapeMove(under(car[3], car[4]), 'D', 'Triangle D', 'A triangle: base 20 seconds, height 25 m/s.', 'D = ½ × 20 × 25 = 250 m'),
  answerMove('675 m', 'Add them up', '75 + 150 + 200 + 250 = 675 m.'),
], 'Shapes under it', 'The area under the graph',
  'Split the area under the graph into triangles, rectangles and trapeziums, work out each one, then add them.')

/** Add up the shapes under a journey: each piece's area, then the total. */
function areaWorking(start: string, pieces: { title: string; why: string; parts: string[]; result: number }[], total: number): StepWorking {
  const steps: WorkedStep[] = pieces.map(p => ({ title: p.title, why: p.why, lines: [line(p.parts.flatMap((t, i) => i ? [sign(t[0]), part(t.slice(2))] : [part(t)]), show(p.result))] }))
  steps.push({ title: 'Add them up', why: 'The total area under the graph is the distance travelled, in metres.', lines: [line(pieces.flatMap((p, i) => i ? [sign('+'), part(show(p.result))] : [part(show(p.result))]), show(total), { answer: true })] })
  return { kind: 'step-worked', start, steps }
}
const ballDistance = onGrid(distance, 'Use the ball’s graph: (0, 0) to (12, 4) to (32, 2) to (50, 2). How far does the ball travel in the 50 seconds?', 'Higher GR13 Your Turn Q1 (distance)',
  { ...ballGrid, lines: ball.slice(1).map((p, i) => ({ from: ball[i], to: p, at: -1, segment: true })) },
  number(120, '120 m'), '120', 'A triangle, a trapezium, then a rectangle.', areaWorking('the ball’s journey', [
    { title: 'Triangle', why: 'The first piece: half of the base times the height.', parts: ['0.5', '× 12', '× 4'], result: 24 },
    { title: 'Trapezium', why: 'The second piece: half the two parallel sides added, times the width.', parts: ['0.5', '× 6', '× 20'], result: 60 },
    { title: 'Rectangle', why: 'The flat piece: base times height.', parts: ['18', '× 2'], result: 36 },
  ], 120), 'Distance (m)')
ballDistance.answerPrefix = 'Distance ='

// Your Turn Q2: the track cyclist, read from the book's graph to the nearest grid line.
const cyclist = [pt(0, 0), pt(15, 15), pt(20, 10), pt(25, 20), pt(50, 18)]
const cyclistDistance = onGrid(distance, 'The speed–time graph shows a track cyclist during a race. Work out the total distance travelled.', 'Higher GR13 Your Turn Q2', journey(cyclist, 55, 5, 25, 2.5),
  number(725, '725 m'), '725', 'A triangle, then three trapeziums.', areaWorking('the cyclist’s race', [
    { title: 'Triangle', why: 'Up to fifteen seconds: half of the base times the height.', parts: ['0.5', '× 15', '× 15'], result: 112.5 },
    { title: 'First trapezium', why: 'Fifteen to twenty seconds: the sides are fifteen and ten.', parts: ['0.5', '× 25', '× 5'], result: 62.5 },
    { title: 'Second trapezium', why: 'Twenty to twenty-five seconds: the sides are ten and twenty.', parts: ['0.5', '× 30', '× 5'], result: 75 },
    { title: 'Third trapezium', why: 'Twenty-five to fifty seconds: the sides are twenty and eighteen.', parts: ['0.5', '× 38', '× 25'], result: 475 },
  ], 725), 'Distance (m)')
cyclistDistance.answerPrefix = 'Distance ='

// Your Turn Q3: the runner, read from the book's graph to the nearest grid line.
const runner = [pt(0, 0), pt(15, 3.4), pt(30, 1.8), pt(40, 2.2), pt(50, 4)]
const runnerAcc = onGrid(distance, 'The speed–time graph shows a runner during the first 50 seconds of a race. Work out the average acceleration of the runner during this time.', 'Higher GR13 Your Turn Q3', journey(runner, 55, 5, 5, 0.5),
  number(0.08, '0.08 m/s²'), '0.08', 'Average acceleration is the change in speed over the whole time, divided by the time.', {
    kind: 'step-worked', start: 'from 0 m/s at 0 s to 4 m/s at 50 s', steps: [
      { title: 'Change in speed', why: 'Only the start and the end matter for an average: the speed at the end take away the speed at the start.', lines: [line([part('4', 0), sign('−'), part('0', 0)], '4')] },
      { title: 'Divide by time', why: 'Divide by the whole time, fifty seconds, for metres per second squared.', lines: [line([part('4'), sign('÷'), part('50')], '0.08', { answer: true })] },
    ],
  }, 'Acceleration (m/s²)')

/* ---------- Section 3: curved graphs ---------- */

// The book's runner, v = 3√t: 6 m/s at 4 seconds; the tangent at 2 seconds goes through (1, 3.2) and (3.5, 5.8).
const sqrtGrid = (k: number, yEnd: number) => curved([], 0, 4.5, 4.5, 0.5, yEnd, 1, { kind: 'sqrt', a: k })

add(curves, 'Curved graphs', 'Higher GR13 Skill 4 and Skill 5', text(
  'On a curved velocity–time graph the acceleration keeps changing.',
  'The average acceleration between two times is the gradient of the straight line joining those two points on the curve.',
  'The acceleration at one moment is the gradient of the tangent there: a straight line that just touches the curve.',
))

graph(curves, 'A speed–time graph of the first 4 seconds of someone running a race is shown. Calculate the average acceleration over the 4 seconds.', 'Higher GR13 Skill 4: Average of Curved Graphs', 'Average acceleration over 4 seconds', sqrtGrid(3, 7), [
  plot([pt(0, 0), pt(4, 6)], 'Read the two points', 'At 0 seconds the speed is 0, and at 4 seconds it is 6 m/s.'),
  { title: 'Join them', say: 'Draw a straight line from where the graph is at 0 seconds to where it is at 4 seconds. Its gradient is the average acceleration.', equation: latex('(0, 0)\\ \\text{to}\\ (4, 6)'), adds: 'picture',
    change: (frame, step) => ({ ...frame, lines: [{ from: pt(0, 0), to: pt(4, 6), at: step, segment: true, dashed: true }], legs: [{ from: pt(0, 0), to: pt(4, 0), label: '4', family: 1, at: step }, { from: pt(4, 0), to: pt(4, 6), label: '6', family: 0, at: step }], working: words(frame, step, 'up 6, across 4') }) },
  answerMove('1.5 m/s²', 'Up ÷ across', 'Gradient = (6 − 0) ÷ (4 − 0) = 1.5 m/s².'),
], 'A straight line', 'The average acceleration', 'Join the two points with a straight line and work out its gradient.')

graph(curves, 'Using the same graph, calculate the instantaneous acceleration 2 seconds in.', 'Higher GR13 Skill 5: Instantaneous Gradient of a Curve', 'Acceleration at 2 seconds', sqrtGrid(3, 7), [
  plot([pt(2, 4.24)], 'Find the point', 'Up from 2 seconds to the curve.'),
  { title: 'Draw the tangent', say: 'With a ruler, draw a straight line that just touches the curve at 2 seconds, going the same way as the curve there.', equation: latex('\\text{tangent at } 2\\text{ s}'), adds: 'picture',
    change: (frame, step) => ({ ...frame, lines: [{ from: pt(0.5, 2.65), to: pt(4.3, 6.68), at: step, segment: true, label: 'tangent' }], working: words(frame, step, 'tangent at 2 seconds') }) },
  { title: 'Two points on it', say: 'Pick two points far apart on the tangent: (1, 3.2) and (3.5, 5.8).', equation: latex('(1, 3.2),\\ (3.5, 5.8)'), adds: 'lines',
    change: (frame, step) => ({ ...frame, points: [...(frame.points ?? []), { ...pt(1, 3.2), at: step }, { ...pt(3.5, 5.8), at: step }], legs: [{ from: pt(1, 3.2), to: pt(3.5, 3.2), label: '2.5', family: 1, at: step }, { from: pt(3.5, 3.2), to: pt(3.5, 5.8), label: '2.6', family: 0, at: step }], working: words(frame, step, 'up 5.8 − 3.2 = 2.6, across 3.5 − 1 = 2.5') }) },
  answerMove('1.04 m/s²', 'Up ÷ across', 'Gradient = 2.6 ÷ 2.5 = 1.04 m/s² (3 sf). At 2 seconds the runner is speeding up by about 1.04 m/s every second.'),
], 'A tangent', 'The acceleration at a point', 'Draw a tangent at the point, then work out its gradient.')

const later = onGrid(curves, 'Use the runner’s graph. Work out the average acceleration between 1 second and 4 seconds.', 'Higher GR13 Skill 4 (own times)', sqrtGrid(3, 7),
  gradient(1, '1'), '1', 'Read the speed at 1 s and at 4 s, then divide the change by the time.', {
    kind: 'step-worked', start: 'from 1 s to 4 s', steps: [
      { title: 'Read the speeds', why: 'Up from each time to the curve, then across to the speed.', lines: [line([part('3 m/s and 6 m/s', 0)], undefined)] },
      { title: 'Change in speed', why: 'The later speed take away the earlier one.', lines: [line([part('6', 0), sign('−'), part('3', 0)], '3')] },
      { title: 'Divide by time', why: 'Three seconds pass between them.', lines: [line([part('3'), sign('÷'), part('3')], '1', { answer: true })] },
    ],
  }, 'Acceleration (m/s²)')

const atOne = onGrid(curves, 'A tangent is drawn on the runner’s graph at 1 second. Work out the acceleration at 1 second.', 'Higher GR13 Skill 5 (own time)',
  { ...sqrtGrid(3, 7), lines: [{ from: pt(0, 1.5), to: pt(3, 6), at: -1, segment: true, label: 'tangent' }], points: [{ ...pt(1, 3), at: -1 }] },
  between(1.5, 1.2, 1.8, '1.5 m/s² (anything from 1.2 to 1.8)'), '1.5', 'Pick two points far apart on the tangent: (0, 1.5) and (3, 6).', {
    kind: 'step-worked', start: 'tangent at 1 second', steps: [
      { title: 'Two points on it', why: 'Read two points far apart on the tangent, not on the curve.', lines: [line([part('(0, 1.5) and (3, 6)', 3)], undefined)] },
      { title: 'Change in speed', why: 'The higher speed take away the lower one.', lines: [line([part('6', 0), sign('−'), part('1.5', 0)], '4.5')] },
      { title: 'Divide by time', why: 'Three seconds across. The gradient of the tangent is the acceleration at that moment.', lines: [line([part('4.5'), sign('÷'), part('3')], '1.5', { answer: true })] },
    ],
  }, 'Acceleration (m/s²)')

practice(curves, 'On a velocity–time graph, what does the gradient of a tangent at a point tell you?', 'Higher GR13 Skill 5 (concept)', choose([
  'The acceleration at that moment',
  'The distance travelled so far',
  'The average acceleration over the whole journey',
  'The speed at that moment',
]), 'The acceleration at that moment', 'The gradient of a velocity–time graph is always the acceleration.', {
  kind: 'step-worked', start: 'a tangent on a velocity–time graph', steps: [
    { title: 'Gradient is acceleration', why: 'Change in speed divided by time is acceleration.', lines: [line([part('gradient', 3)], 'acceleration', { eq: true })] },
    { title: 'At one moment', why: 'A tangent touches the curve at one point only, so it gives the acceleration at that moment. The speed you read straight off the graph.', words: 'The acceleration at that moment' },
  ],
})

/* ---------- Section 4: area under a curve (Level 8-9) ---------- */

add(area, 'Area under a curve', 'Higher GR14 Area Under a Curve', text(
  'Under a curve there are no exact shapes, so the distance can only be estimated.',
  'Split the time into strips of equal width. Join where each strip meets the curve with straight lines.',
  'That makes a triangle where the speed starts at 0, then trapeziums: ½ × (a + b) × width. Add their areas.',
  'Everyone reads the graph a little differently, so answers vary. In an exam a range of answers gets the marks.',
))

// The book's example, drawn as v = 4.5√t: readings at 1, 2, 3 and 4 seconds of 4.5, 6.4, 7.8 and 9 (1 dp).
const strips = [pt(0, 0), pt(1, 4.5), pt(2, 6.4), pt(3, 7.8), pt(4, 9)]
graph(area, 'Below is a speed–time graph. Use equal width shapes to find an estimate for the total distance travelled in the first 4 seconds.', 'Higher GR14 Estimating Area using Triangles and Trapeziums', 'Distance in the first 4 seconds',
  curved([], 0, 4.5, 5, 0.5, 10, 1, { kind: 'sqrt', a: 4.5 }), [
    { ...plot(strips.slice(1), 'Strips 1 second wide', 'Four strips of 1 second each. Read the speed at 1, 2, 3 and 4 seconds: 4.5, 6.4, 7.8 and 9 m/s.'), adds: 'picture' as const },
    shapeMove(under(strips[0], strips[1]), 'A', 'Triangle A', 'The speed starts at 0, so the first strip is a triangle.', 'A = ½ × 1 × 4.5 = 2.25'),
    shapeMove(under(strips[1], strips[2]), 'B', 'Trapezium B', 'A trapezium with parallel sides 4.5 and 6.4.', 'B = ½ × (4.5 + 6.4) × 1 = 5.45'),
    shapeMove(under(strips[2], strips[3]), 'C', 'Trapezium C', 'Parallel sides 6.4 and 7.8.', 'C = ½ × (6.4 + 7.8) × 1 = 7.1'),
    shapeMove(under(strips[3], strips[4]), 'D', 'Trapezium D', 'Parallel sides 7.8 and 9.', 'D = ½ × (7.8 + 9) × 1 = 8.4'),
    answerMove('23.2 m', 'Add them up', '2.25 + 5.45 + 7.1 + 8.4 = 23.2 m. Someone who reads 4.4 at 1 second gets 23.1 m: both are fine.'),
  ], 'Strips', 'Estimate the area', 'Split it into equal strips, a triangle and trapeziums, then add their areas.')

// Your Turn Q1: the race car, v = 0.14t², close to the book's curve: 3.5, 14, 31.5 and 56 m/s at 5, 10, 15, 20 s.
const raceCar = onGrid(area, 'The speed–time graph shows a race car speeding up. Using 4 strips of equal width, estimate the distance the car travels over the 20 seconds.', 'Higher GR14 Your Turn Q1',
  curved([0, 0, 0.14], 0, 20, 22, 2, 60, 5),
  between(385, 365, 405, '385 m (anything from 365 to 405)'), '385', 'Strips 5 seconds wide. Read the speed at 5, 10, 15 and 20 seconds.', areaWorking('4 strips of 5 seconds: 3.5, 14, 31.5, 56 m/s', [
    { title: 'Triangle', why: 'The first strip starts at a speed of zero.', parts: ['0.5', '× 5', '× 3.5'], result: 8.75 },
    { title: 'Second strip', why: 'A trapezium: the parallel sides added, halved, times the width.', parts: ['0.5', '× 17.5', '× 5'], result: 43.75 },
    { title: 'Third strip', why: 'A trapezium with sides fourteen and thirty-one point five.', parts: ['0.5', '× 45.5', '× 5'], result: 113.75 },
    { title: 'Fourth strip', why: 'A trapezium with sides thirty-one point five and fifty-six.', parts: ['0.5', '× 87.5', '× 5'], result: 218.75 },
  ], 385), 'Distance (m)')
raceCar.answerPrefix = 'Distance ='

// Your Turn Q2: the motorcycle, close to the book's curve: 15, 24, 19 and 10 m/s at 5, 6, 7 and 8 seconds. Drawn in
// two pieces that meet at 5 seconds: a smooth start from rest at 2 seconds, then the peak.
const shifted = (coeffs: number[], h: number) => coeffs.reduce<number[]>((sum, c, n) => {
  // c(t − h)ⁿ multiplied out: the binomial coefficients times powers of −h.
  for (let k = 0, choose = 1; k <= n; k++, choose = choose * (n - k + 1) / k) sum[k] = (sum[k] ?? 0) + c * choose * (-h) ** (n - k)
  return sum
}, [])
const motorbike: GraphGrid = {
  ...axes(9, 1, 30, 2.5),
  curves: [
    { coeffs: shifted([0, 0, 0, 2 / 27, 13 / 81], 2), from: 2, to: 5, at: -1 },
    { coeffs: [-590, 793 / 3, -37, 5 / 3], from: 5, to: 8, at: -1 },
  ],
}
const bike = onGrid(area, 'The speed–time graph shows a motorcycle. Using 3 strips of equal width, estimate the distance travelled from t = 5 to t = 8.', 'Higher GR14 Your Turn Q2', motorbike,
  between(55.5, 52, 59, '55.5 m (anything from 52 to 59)'), '55.5', 'Strips 1 second wide. Read the speed at 5, 6, 7 and 8 seconds.', areaWorking('3 strips of 1 second: 15, 24, 19, 10 m/s', [
    { title: 'First strip', why: 'A trapezium: the parallel sides are the speeds at five and six seconds.', parts: ['0.5', '× 39', '× 1'], result: 19.5 },
    { title: 'Second strip', why: 'The speeds at six and seven seconds.', parts: ['0.5', '× 43', '× 1'], result: 21.5 },
    { title: 'Third strip', why: 'The speeds at seven and eight seconds.', parts: ['0.5', '× 29', '× 1'], result: 14.5 },
  ], 55.5), 'Distance (m)')
bike.answerPrefix = 'Distance ='

add('mixed', 'Velocity–time graphs', 'Higher GR13 and GR14 consolidation', text(
  'The gradient is the acceleration. Flat is a constant speed, and a negative gradient is slowing down.',
  'The area under the graph is the distance: split it into triangles, rectangles and trapeziums and add them.',
  'On a curve: the line joining two points gives the average acceleration, and a tangent gives the acceleration at a point.',
  'Under a curve, estimate the area with equal strips: a triangle, then trapeziums.',
))

export const tutorVelocityTimeLesson: TutorMethodLesson = {
  id: 'L108H', number: 108.5, title: 'Velocity–time graphs', level: 'GCSE Higher', graphCard: true,
  goal: 'Read a velocity–time graph: acceleration from its gradient, distance from the area under it, and estimates on a curve with a tangent or strips.',
  labels: { [reading]: 'Reading the graph', [distance]: 'Distance travelled', [curves]: 'Curved graphs', [area]: 'Area under a curve', mixed: 'Review' },
  states: finish(),
}

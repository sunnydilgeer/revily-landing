/*
 * Lesson 108 (Real-life graphs), a Higher section. From the Higher revision guide, GR15 Real Life Graphs (Level 6-7,
 * p141–143): on a curved graph the gradient keeps changing, so a rate is either an average between two points (the
 * gradient of the straight line joining them) or the rate at one point (the gradient of a tangent: a straight line
 * that just touches the curve there). The book's examples: Sammy's distance from the finish line, average speed between
 * 4 and 12 seconds (−8 m/s); a weather balloon's descent, rate at 5 minutes from the tangent through (1, 45) and
 * (9, 18.5) (−3.31 km/min). Your Turn Q4, a rocket's acceleration at 5 seconds, on a curve close to the book's.
 * The curves are drawn through the book's readings. A tangent is drawn by eye, so a gradient read from one accepts an
 * answer near it, as the book says answers will vary a little.
 */
import { author } from '../../written-methods/tutor/content'
import { line, part, sign, type StepWorking } from '../../written-methods/tutor/stepWorking'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, gradient, leg, plot, pt, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { rlGrid } from '../../real-life-graphs/tutor/realLifeWorkings'
import { between, choose, screens, text, type HigherAddition } from './helpers'

const rate = 'curve-rate'
const a = author(108, 'L108-H')
const { add } = a
const { graph, practice, onGrid } = screens(a)

const show = (n: number) => String(n).replace('-', '−')
/** The question's curve on its graph, there from the start. */
const withCurve = (g: GraphGrid, coeffs: number[], to: number): GraphGrid => ({ ...g, curves: [{ coeffs, from: 0, to, at: -1 }] })
/** Moves: a straight line drawn on the graph between two points (dashed for a line joining two points on the curve). */
/** Moves: points read off the graph, ringed, each with its coordinates on the side `place` says (clear of the steps). */
const spot = (points: { x: number; y: number; place?: { dx: number; dy: number } }[], title: string, say: string, adds: GraphMove['adds'] = 'picture'): GraphMove => ({
  ...plot(points.map(p => pt(p.x, p.y)), title, say), adds,
  change: (frame, step) => ({ ...plot(points.map(p => pt(p.x, p.y)), title, say).change(frame, step), points: [...(frame.points ?? []), ...points.map(p => ({ ...p, at: step }))] }),
})
const join = (from: { x: number; y: number }, to: { x: number; y: number }, title: string, say: string, sum: string, extra: { dashed?: boolean; label?: string } = {}): GraphMove => ({
  title, say, equation: latex(sum), adds: 'picture',
  change: (frame, step) => ({ ...frame, lines: [...(frame.lines ?? []), { from, to, at: step, segment: true, ...extra }], working: [...(frame.working ?? []), { text: sum, family: 3, at: step }] }),
})

add(rate, 'Rates on a curve', 'Higher GR15 Real Life Graphs (curves)', text(
  'On a straight line graph the gradient is the same everywhere. On a curve it keeps changing.',
  'The average rate between two points is the gradient of the straight line joining them.',
  'The rate at one point is the gradient of a tangent: a straight line that just touches the curve at that point, going the same way as the curve.',
  'A tangent is drawn by eye, so answers vary a little. In an exam a range of answers gets the marks.',
))

/* ---------- The average gradient between two points ---------- */

// Sammy's distance from the finish line in metres, through the book's readings (0, 100), (4, 76), (12, 12) and (14, 0),
// starting slowly and easing off before the line like the book's curve (through (8, 34)), so the joining line shows.
const sammy = [100, 0, -1.726374716553288, 0.002047902494331125, 0.016667552437641706, -0.0007577770691609968]
const seconds = { name: 'seconds', after: ' s', per: 2 }, metres = { name: 'metres', after: ' m', per: 10 }
const race = withCurve(rlGrid(seconds, 14, metres, 100), sammy, 14)

graph(rate, 'Sammy is running a 100 m race. Calculate his average speed between 4 seconds and 12 seconds.', 'Higher GR15 Finding the Average Gradient', 'Average speed from 4 s to 12 s', race, [
  spot([{ x: 4, y: 76, place: { dx: -1, dy: -1 } }, { x: 12, y: 12 }], 'Read the two points', 'Up from 4 seconds and from 12 seconds to the curve: 76 m and 12 m from the finish.'),
  join(pt(4, 76), pt(12, 12), 'Join them', 'Join the two points with a straight line. Its gradient is the average speed between them.', '(4, 76) to (12, 12)', { dashed: true }),
  leg(pt(4, 76), pt(12, 76), '12 − 4 = 8', 'Across 8', 'The change in time: 8 seconds.'),
  leg(pt(12, 76), pt(12, 12), '12 − 76 = −64', 'Down 64', 'The change in distance: 64 m closer to the finish, so it is −64.'),
  answerMove('−8 m/s', 'Down ÷ across', 'Gradient = −64 ÷ 8 = −8. The minus means his distance from the finish is falling: he runs 8 metres a second towards it.'),
], 'Average gradient', 'The average gradient',
  'Join the two points with a straight line, then work out its gradient: the change up (or down) divided by the change across.')

/** The average gradient between two points read off the curve. */
function averageWorking(start: string, p: [number, number], q: [number, number], answer: string, unit: string): StepWorking {
  const up = q[1] - p[1], across = q[0] - p[0]
  return { kind: 'step-worked', start, steps: [
    { title: 'Read the points', why: 'Up from each time to the curve, then across to read the distance.', lines: [line([part(`(${show(p[0])}, ${show(p[1])}) and (${show(q[0])}, ${show(q[1])})`, 3)], undefined)] },
    { title: 'Change in distance', why: 'The second distance take away the first. It falls, so it is negative.', lines: [line([part(show(q[1]), 0), sign('−'), part(show(p[1]), 0)], show(up))] },
    { title: 'Change in time', why: 'The second time take away the first.', lines: [line([part(show(q[0]), 1), sign('−'), part(show(p[0]), 1)], show(across))] },
    { title: 'Divide them', why: `The gradient is the change in distance divided by the change in time, in ${unit}.`, lines: [line([part(show(up)), sign('÷'), part(show(across))], answer, { answer: true })] },
  ] }
}
const early = onGrid(rate, 'Use Sammy’s graph. Work out the average gradient between 0 seconds and 4 seconds.', 'Higher GR15 Finding the Average Gradient (own times)', race,
  gradient(-6, '−6'), '−6', 'Read the distance at 0 s and at 4 s, then divide the change in distance by the change in time.',
  averageWorking('Sammy, 0 s to 4 s', [0, 100], [4, 76], '−6', 'metres a second'), 'Gradient (m/s)')
const late = onGrid(rate, 'Use Sammy’s graph. Work out the average gradient between 4 seconds and 14 seconds.', 'Higher GR15 Finding the Average Gradient (own times)', race,
  gradient(-7.6, '−7.6'), '−7.6', 'At 14 seconds he is at the finish: 0 m to go.',
  averageWorking('Sammy, 4 s to 14 s', [4, 76], [14, 0], '−7.6', 'metres a second'), 'Gradient (m/s)')

/* ---------- The rate at a point: a tangent ---------- */

// The balloon's altitude in km after t minutes, through the book's tangent: 31.7 km at 5 minutes, gradient −3.31.
const balloonCurve = [40, 0, -0.33125]
const minutes = { name: 'min', per: 1 }, km = { name: 'km', per: 5 }
const balloon = withCurve(rlGrid(minutes, 11, km, 50), balloonCurve, 10)
const onTangent = (t: number) => Math.round((31.71875 - 3.3125 * (t - 5)) * 1000) / 1000

graph(rate, 'The graph shows a weather balloon coming down from 40 km. Work out its rate of descent at 5 minutes, in km per minute.', 'Higher GR15 Estimating Rate at a Given Point', 'Rate of descent at 5 minutes', balloon, [
  spot([{ x: 5, y: 31.7 }], 'Find the point', 'Up from 5 minutes to the curve. This is where we want the rate.'),
  join(pt(0.5, onTangent(0.5)), pt(9.5, onTangent(9.5)), 'Draw the tangent', 'With a ruler, draw a straight line that just touches the curve at that point and goes the same way as the curve there. Make it long: it is easier to read.', 'tangent at 5 minutes'),
  spot([{ x: 1, y: 45, place: { dx: 1, dy: 1 } }, { x: 9, y: 18.5, place: { dx: -1, dy: 1 } }], 'Two points on it', 'Pick two points far apart on the tangent, not on the curve: (1, 45) and (9, 18.5).', 'lines'),
  leg(pt(1, 45), pt(9, 45), '9 − 1 = 8', 'Across 8', 'The change in time: 8 minutes.'),
  leg(pt(9, 45), pt(9, 18.5), '18.5 − 45 = −26.5', 'Down 26.5', 'The change in altitude: down 26.5 km.'),
  answerMove('−3.31 km/min', 'Down ÷ across', 'Gradient = −26.5 ÷ 8 = −3.31 (2 dp). At 5 minutes the balloon is falling about 3.31 km every minute.'),
], 'Tangent', 'The rate at a point',
  'Draw a tangent at the point, then work out the tangent’s gradient: its change up (or down) divided by its change across.')

// Your Turn Q4: a rocket's velocity in m/s after t seconds, v = 1.2t², with the tangent at 5 seconds drawn.
const rocketGrid: GraphGrid = {
  ...withCurve(rlGrid({ name: 'seconds', per: 1 }, 10, { name: 'm/s', per: 5 }, 50), [0, 0, 1.2], 6.45),
  lines: [{ from: pt(3, 6), to: pt(6.5, 48), at: -1, segment: true, label: 'tangent' }],
  points: [{ ...pt(5, 30), at: -1 }],
}
const rocket = onGrid(rate, 'The graph shows the velocity of a rocket in its first seconds. A tangent is drawn at 5 seconds. Work out the acceleration at 5 seconds.', 'Higher GR15 Your Turn Q4', rocketGrid,
  between(12, 10, 14, '12 m/s² (anything from 10 to 14)'), '12', 'Pick two points far apart on the tangent, then divide the change in velocity by the change in time.', {
    kind: 'step-worked', start: 'tangent at 5 seconds', steps: [
      { title: 'Two points on it', why: 'Read two points far apart on the tangent, not on the curve.', lines: [line([part('(3, 6) and (6.5, 48)', 3)], undefined)] },
      { title: 'Change in velocity', why: 'The higher velocity take away the lower one.', lines: [line([part('48', 0), sign('−'), part('6', 0)], '42')] },
      { title: 'Change in time', why: 'The later time take away the earlier one.', lines: [line([part('6.5', 1), sign('−'), part('3', 1)], '3.5')] },
      { title: 'Divide them', why: 'On a velocity graph the gradient is the acceleration, in metres per second squared.', lines: [line([part('42'), sign('÷'), part('3.5')], '12', { answer: true })] },
    ],
  }, 'Acceleration (m/s²)')

practice(rate, 'What is a tangent to a curve?', 'Higher GR15 Estimating Rate at a Given Point (concept)', choose([
  'A straight line that just touches the curve at one point',
  'A straight line joining two points on the curve',
  'A line straight up from the point to the axis',
  'The curve itself, near the point',
]), 'A straight line that just touches the curve at one point', 'Its gradient is the rate at that one point.', {
  kind: 'step-worked', start: 'a tangent', steps: [
    { title: 'Just touching', why: 'A tangent touches the curve at the point and goes the same way as the curve there, without cutting through it.', lines: [line([part('tangent', 3)], 'touches once')] },
    { title: 'Not a chord', why: 'A line joining two points on the curve gives the average rate between them instead.', words: 'A straight line that just touches the curve at one point' },
  ],
})

export const curveRate: HigherAddition = { lessonId: 'L108', skill: rate, label: 'Rates on a curve', states: a.finish() }

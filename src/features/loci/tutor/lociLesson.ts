import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { dp, fig, screens, show, slips } from '../../geometry/tutor/figureLesson'

/*
 * Geometry lesson 17: Loci and constructions. From GM17 in Sunny's revision book (p151–153), with our own numbers. The
 * book's four ruler-and-compass constructions, as four rungs: a locus a fixed distance from a point (a circle) or from
 * a line (two straight sides and two semicircles, Your Turn Q3); the perpendicular bisector, the points the same
 * distance from A and B; the angle bisector, the points the same distance from two lines (Your Turn Q1 and Q2); and
 * shading a region that follows two rules at once (the book's Example, and the fountain in Your Turn Q4 with its
 * 1 cm : 1.5 m scale). The perpendicular from a point is drawn as part of the bisector rung. Built like lessons 1 to
 * 16: the bisector rung opens on the measuring board, where you drag a point P and watch its distances to A and B.
 *
 * Hidden on live like lessons 1 to 16: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(217)
const { add, finish } = lesson
const { explore, worked, practice } = screens(lesson)
const distance = 'geometry-locus-distance'
const perpendicular = 'geometry-perpendicular-bisector'
const angleBisector = 'geometry-angle-bisector'
const regions = 'geometry-locus-regions'

const CM_BOX = { label: 'On the plan (cm)', prefix: 'Plan =' }
const at = (deg: number, r: number, c: FigurePoint = [0, 0]): FigurePoint => [c[0] + r * Math.cos(deg * Math.PI / 180), c[1] + r * Math.sin(deg * Math.PI / 180)]

/* ---------- Pictures ---------- */

/** The locus of points `r` from a point P: a circle, dashed while it's still being drawn. */
function pointLocus(r: string, stage: 'point' | 'compass' | 'circle', caption?: string): AngleFrame {
  const items: FigureItem[] = [{ kind: 'point', at: [0, 0], label: 'P', dx: -14, dy: 16 }]
  if (stage !== 'point') items.push({ kind: 'line', from: [0, 0], to: at(30, 1), style: 'lit' }, { kind: 'text', at: at(30, 0.5), text: r, tone: 'lit', dx: -6, dy: -16 })
  items.push({ kind: 'arc', centre: [0, 0], r: 1, from: 0, to: 359.9, style: stage === 'circle' ? 'found' : 'dashed' })
  return fig(items, `A point P and the circle of every point ${r} from it.`, caption, 40)
}

/** A line segment AB and the locus of points `d` from it: two straight sides and a semicircle round each end. */
function lineLocus(len: number, d: number, stage: 'line' | 'ends' | 'all', labels: { len: string; d: string }, caption?: string): AngleFrame {
  const h = len / 2
  const items: FigureItem[] = [
    { kind: 'line', from: [-h, 0], to: [h, 0] }, { kind: 'point', at: [-h, 0], label: 'A', dx: -4, dy: 18 }, { kind: 'point', at: [h, 0], label: 'B', dx: -4, dy: 18 },
    { kind: 'text', at: [0, 0], text: labels.len, dy: 16 },
  ]
  const style = stage === 'all' ? 'found' as const : 'lit' as const
  if (stage !== 'line') items.push({ kind: 'line', from: [-h, d], to: [h, d], style }, { kind: 'line', from: [-h, -d], to: [h, -d], style })
  items.push({ kind: 'arc', centre: [-h, 0], r: d, from: 90, to: 270, style: stage === 'all' ? 'found' : 'dashed' }, { kind: 'arc', centre: [h, 0], r: d, from: -90, to: 90, style: stage === 'all' ? 'found' : 'dashed' })
  items.push({ kind: 'line', from: [h, 0], to: [h, d], style: 'dashed' }, { kind: 'text', at: [h, d / 2], text: labels.d, dx: 22 })
  return fig(items, `A line AB of length ${labels.len} and every point ${labels.d} from it: two straight lines and a semicircle at each end.`, caption, 30)
}

/** A and B with the perpendicular bisector's construction: equal arcs from each end, and the line through where they cross. */
function bisector(ab: string, stage: 0 | 1 | 2 | 3, caption?: string): AngleFrame {
  const A: FigurePoint = [-2, 0], B: FigurePoint = [2, 0], r = 2.7, y = Math.sqrt(r * r - 4)
  const items: FigureItem[] = [{ kind: 'line', from: A, to: B }, { kind: 'point', at: A, label: 'A', dx: -16, dy: 4 }, { kind: 'point', at: B, label: 'B', dx: 8, dy: 4 }, { kind: 'text', at: [-1, 0], text: ab, dy: 16 }]
  if (stage >= 1) items.push({ kind: 'arc', centre: A, r, from: 30, to: 62, style: stage === 1 ? 'lit' : 'plain' }, { kind: 'arc', centre: A, r, from: -62, to: -30, style: stage === 1 ? 'lit' : 'plain' })
  if (stage >= 2) items.push({ kind: 'arc', centre: B, r, from: 118, to: 150, style: stage === 2 ? 'lit' : 'plain' }, { kind: 'arc', centre: B, r, from: 210, to: 242, style: stage === 2 ? 'lit' : 'plain' })
  if (stage >= 3) items.push({ kind: 'line', from: [0, -y - 0.5], to: [0, y + 0.5], style: 'found' }, { kind: 'right', at: [0, 0], a: [0, 1], b: B })
  return fig(items, `A line from A to B, ${ab} long${stage >= 1 ? ', with equal compass arcs drawn from A' : ''}${stage >= 2 ? ' and from B' : ''}${stage >= 3 ? ', and the perpendicular bisector through where they cross' : ''}.`, caption, 30)
}

/** An angle at B between arms BA and BC, with the angle bisector's construction. */
function angleFig(deg: number, label: string, stage: 0 | 1 | 2 | 3, caption?: string, half?: string): AngleFrame {
  const B: FigurePoint = [0, 0], C = at(0, 3.2), A = at(deg, 3.2), P = at(0, 1.4), Q = at(deg, 1.4)
  const items: FigureItem[] = [{ kind: 'line', from: B, to: A }, { kind: 'line', from: B, to: C }, { kind: 'point', at: A, label: 'A', dx: 8, dy: -6 }, { kind: 'point', at: B, label: 'B', dx: -16, dy: 4 }, { kind: 'point', at: C, label: 'C', dx: 4, dy: 18 }]
  items.push({ kind: 'arc', centre: B, r: 0.55, from: 0, to: deg, style: stage === 0 ? 'plain' : 'dashed' }, { kind: 'text', at: at(deg / 2, 0.95), text: label, tone: stage === 0 ? 'given' : 'faint' })
  if (stage >= 1) items.push({ kind: 'arc', centre: B, r: 1.4, from: -6, to: deg + 6, style: stage === 1 ? 'lit' : 'plain' })
  // The two small arcs from where the first arc crosses each arm meet on the bisector.
  const M = at(deg / 2, 2.4), rr = Math.hypot(M[0] - P[0], M[1] - P[1])
  const towards = (from: FigurePoint) => Math.atan2(M[1] - from[1], M[0] - from[0]) * 180 / Math.PI
  if (stage >= 2) items.push({ kind: 'arc', centre: P, r: rr, from: towards(P) - 12, to: towards(P) + 12, style: stage === 2 ? 'lit' : 'plain' }, { kind: 'arc', centre: Q, r: rr, from: towards(Q) - 12, to: towards(Q) + 12, style: stage === 2 ? 'lit' : 'plain' })
  if (stage >= 3) items.push({ kind: 'line', from: B, to: at(deg / 2, 3.2), style: 'found' }, ...(half ? [{ kind: 'text' as const, at: at(deg / 4, 2), text: half, tone: 'found' as const }] : []))
  return fig(items, `An angle ABC of ${label}${stage >= 3 ? ', split in half by its angle bisector' : ''}.`, caption, 30)
}

/* ---------- Rung 1: a fixed distance away ---------- */

worked(distance, 'Draw the locus of points 2 cm from the point P.', 'A fixed distance away', 'GM17 p151 Loci (own numbers)', boardModel([], [
  { title: 'Set the compasses', say: 'A locus is every point that follows a rule. Here: exactly 2 cm from P. Open the compasses to 2 cm.', rows: ['>0 Compasses at 2 cm'], picture: pointLocus('2 cm', 'compass') },
  { title: 'Draw all the way round', say: 'With the point on P, draw right round. Every point on the circle is 2 cm from P, and no other point is.', rows: ['! A circle, radius 2 cm, centre P'], picture: pointLocus('2 cm', 'circle', 'Every point 2 cm from P') },
], 'Locus', pointLocus('2 cm', 'point')), 'A locus is the set of all the points that follow a rule. Points a fixed distance from a point make a circle. From a line, they make two straight lines with a semicircle round each end.')
{
  const p = lineLocus(4, 1, 'line', { len: '4 cm', d: '' })
  practice(distance, 'What shape is the locus of points 1 cm from the line AB?', 'GM17 Your Turn Q3', p,
    choose('Two straight lines with a semicircle at each end', ['A circle', 'A circle is the locus round a point. A line has length: the sides are straight.'], ['Two straight lines', 'Points beyond A and B count too: they curve round the ends.'], ['A rectangle', 'The corners are rounded: past each end, the points 1 cm away make a semicircle.']),
    'Imagine a 1 cm string tied to the line, its end sliding along it.', boardModel([], [
      { title: 'Alongside the line', say: 'Next to the line, the points 1 cm away make two straight lines, one either side.', rows: ['>0 Two lines, 1 cm either side'], picture: lineLocus(4, 1, 'ends', { len: '4 cm', d: '1 cm' }) },
      { title: 'Round each end', say: 'Past A and B, the nearest point of the line is the end itself: points 1 cm from it make a semicircle.', rows: ['! Two straight lines and two semicircles'], picture: lineLocus(4, 1, 'all', { len: '4 cm', d: '1 cm' }) },
    ], 'Locus', p))
}
{
  const p = pointLocus('3 cm', 'compass')
  practice(distance, 'The locus of points 3 cm from P is a circle. How wide is the circle, all the way across?', 'GM17 p151 (own numbers)', p, number(6, '6 cm'), 'Across the circle is two radii.', boardModel([], [
    { title: 'Two radii across', say: 'The circle’s radius is 3 cm. Across, through P, is a radius each side: the diameter.', rows: ['d = 2 × 3', '! d = 6 cm'], picture: pointLocus('3 cm', 'circle', 'd = 6 cm') },
  ], 'Width', p), slips(6, [[3, 'That’s the radius, from P to the edge. Across is twice that.'], [9, 'Across is 2 × 3, not 3 × 3.']]), { label: 'Width (cm)', prefix: 'd =' })
}
{
  const per = dp(2 * 4 + 2 * Math.PI * 1, 1)
  const p = lineLocus(4, 1, 'all', { len: '4 cm', d: '1 cm' })
  practice(distance, 'This is the locus of points 1 cm from a 4 cm line. How long is it, all the way round, to 1 decimal place?', 'GM17 Your Turn Q3 (own question)', p, number(per, `${show(per, 1)} cm`), 'Two straight sides, and two semicircles that make one whole circle.', boardModel([], [
    { title: 'The straight sides', say: 'Each straight side is as long as the line: 4 cm.', rows: ['2 × 4 = 8 cm'], picture: lineLocus(4, 1, 'ends', { len: '4 cm', d: '1 cm' }) },
    { title: 'The two semicircles', say: 'Together they make a whole circle of radius 1: its circumference is 2πr.', rows: ['2 × π × 1 = 6.283… cm'], picture: lineLocus(4, 1, 'all', { len: '4 cm', d: '1 cm' }) },
    { title: 'Add them', say: 'Round at the end.', rows: ['L = 8 + 6.283…', `! L = ${show(per, 1)} cm`], picture: lineLocus(4, 1, 'all', { len: '4 cm', d: '1 cm' }, `${show(per, 1)} cm`) },
  ], 'Length', p), slips(per, [[dp(8 + Math.PI, 1), 'The two semicircles make a whole circle: 2π × 1.'], [8, 'Add the curved ends too.']]), { label: 'Length (cm)', prefix: 'L =' })
}

/* ---------- Rung 2: the perpendicular bisector ---------- */

explore(perpendicular, 'Drag P about. When is it the same distance from A and B?', 'GM17 p151 Constructing a perpendicular bisector (play)', { mode: 'locus' })
worked(perpendicular, 'Construct the perpendicular bisector of AB.', 'Perpendicular bisector', 'GM17 p151 Constructing a perpendicular bisector', boardModel([], [
  { title: 'Arcs from A', say: 'Open the compasses to more than half of AB. With the point on A, draw an arc above the line and one below.', rows: ['>0 Compasses more than half AB'], picture: bisector('6 cm', 1) },
  { title: 'Same arcs from B', say: 'Keep the compasses the same. Draw the same two arcs from B: they cross the first two.', rows: ['>0 Same arcs from B'], picture: bisector('6 cm', 2) },
  { title: 'Join the crossings', say: 'Rule a line through the two crossings. It cuts AB in half, at right angles: every point on it is the same distance from A and B.', rows: ['! The perpendicular bisector of AB'], picture: bisector('6 cm', 3, 'Every point on it is as far from A as from B') },
], 'Construct', bisector('6 cm', 0)), 'The perpendicular bisector of AB is the locus of points the same distance from A and B. It crosses AB at its middle, at 90°. The perpendicular from a point to a line is drawn the same way, from two marks on the line.')
{
  const p = bisector('8 cm', 0)
  practice(perpendicular, 'You want every point the same distance from A as from B. Which construction gives it?', 'GM17 p151', p,
    choose('The perpendicular bisector of AB', ['The angle bisector', 'An angle bisector is the same distance from two lines, not two points.'], ['A circle round A', 'Points on that circle are a fixed distance from A, whatever their distance from B.'], ['A line parallel to AB', 'Points on it can be much nearer A than B.']),
    'Same distance from two points.', boardModel([], [
      { title: 'Two points', say: 'The same distance from two points A and B: that’s the perpendicular bisector.', rows: ['! The perpendicular bisector of AB'], picture: bisector('8 cm', 3) },
    ], 'Construct', p))
}
{
  const p = bisector('9 cm', 3)
  practice(perpendicular, 'AB is 9 cm. Its perpendicular bisector crosses AB at M. How far is M from A?', 'GM17 p151 (own numbers)', p, number(4.5, '4.5 cm'), 'The bisector cuts AB exactly in half.', boardModel([], [
    { title: 'Half of AB', say: 'M is the middle of AB: half of 9 cm.', rows: ['AM = 9 ÷ 2', '! AM = 4.5 cm'], picture: bisector('9 cm', 3, 'AM = 4.5 cm') },
  ], 'Find AM', p), slips(4.5, [[9, 'That’s all of AB. The bisector cuts it in half.'], [3, 'Bisect means cut in two, not three.']]), { label: 'AM (cm)', prefix: 'AM =' })
}

/* ---------- Rung 3: the angle bisector ---------- */

worked(angleBisector, 'Construct the bisector of angle ABC.', 'Angle bisector', 'GM17 p152 Bisecting an angle', boardModel([], [
  { title: 'One arc across both', say: 'Compasses on the corner B. Draw an arc that crosses both arms.', rows: ['>0 Arc from B across both lines'], picture: angleFig(70, '70°', 1) },
  { title: 'Two small arcs', say: 'Move the point to where the arc crosses each arm in turn. Same compasses each time: two small arcs that cross.', rows: ['>0 Equal arcs from each crossing'], picture: angleFig(70, '70°', 2) },
  { title: 'Join to the corner', say: 'Rule from B through where the small arcs cross. That line halves the angle: 35° each side.', rows: ['! The angle bisector: 35° each side'], picture: angleFig(70, '70°', 3, 'Every point on it is as far from BA as from BC', '35°') },
], 'Construct', angleFig(70, '70°', 0)), 'The angle bisector cuts an angle exactly in half. It’s the locus of points the same distance from the two lines.')
{
  const p = angleFig(64, '64°', 0)
  practice(angleBisector, 'Angle ABC is 64°. You bisect it. What angle is each half?', 'GM17 Your Turn Q1 (own numbers)', p, number(32, '32°'), 'Bisect means cut in half.', boardModel([], [
    { title: 'Half the angle', say: 'The bisector splits 64° into two equal angles.', rows: ['Half = 64 ÷ 2', '! Half = 32°'], picture: angleFig(64, '64°', 3, '32° each side', '32°') },
  ], 'Half', p), slips(32, [[64, 'That’s the whole angle. The bisector cuts it in half.'], [116, 'That’s 180 − 64. Halve 64.']]), { label: 'Each half (°)', prefix: 'Half =' })
}
{
  const p = angleFig(80, '', 0)
  practice(angleBisector, 'Which construction draws every point the same distance from the lines BA and BC?', 'GM17 Your Turn Q2', p,
    choose('The angle bisector of ABC', ['The perpendicular bisector of AC', 'That’s the same distance from the points A and C, not from the lines.'], ['A circle round B', 'That’s a fixed distance from B, not the same distance from both lines.'], ['A line parallel to BC', 'That stays the same distance from BC only.']),
    'Same distance from two lines.', boardModel([], [
      { title: 'Two lines', say: 'Same distance from two lines that meet: that’s the angle bisector.', rows: ['! The angle bisector of ABC'], picture: angleFig(80, '', 3) },
    ], 'Construct', p))
}

/* ---------- Rung 4: regions ---------- */

/** A and B 4 apart, the perpendicular bisector, the circle 3 from B, and (stage 3) the region closer to A and within 3 of B. */
function regionFig(stage: 0 | 1 | 2 | 3, caption?: string): AngleFrame {
  const A: FigurePoint = [-2, 0], B: FigurePoint = [2, 0], t = Math.acos(-2 / 3) * 180 / Math.PI
  const items: FigureItem[] = [{ kind: 'line', from: A, to: B, style: 'dashed' }, { kind: 'point', at: A, label: 'A', dx: -16, dy: 4 }, { kind: 'point', at: B, label: 'B', dx: 8, dy: -8 }, { kind: 'text', at: [-1.1, 0], text: '4 cm', dy: -14 }]
  // The region: the part of B's circle on A's side of the bisector (x < 0), closed along the bisector.
  if (stage >= 3) items.unshift({ kind: 'shape', points: Array.from({ length: 25 }, (_, k) => at(t + (360 - 2 * t) * k / 24, 3, B)), fill: 'part' })
  if (stage >= 1) items.push({ kind: 'line', from: [0, -3.2], to: [0, 3.2], style: stage === 1 ? 'lit' : 'plain' })
  if (stage >= 2) items.push({ kind: 'arc', centre: B, r: 3, from: 0, to: 359.9, style: stage === 2 ? 'lit' : 'plain' }, { kind: 'line', from: B, to: at(-50, 3, B), style: 'dashed' }, { kind: 'text', at: at(-50, 1.5, B), text: '3 cm', dx: 22 })
  return fig(items, 'Points A and B 4 cm apart, the perpendicular bisector of AB and a circle of radius 3 cm round B.', caption, 20)
}
worked(regions, 'Shade the points closer to A than to B, and less than 3 cm from B.', 'Shading a region', 'GM17 p152 Example (own numbers)', boardModel([], [
  { title: 'Closer to A', say: 'The perpendicular bisector splits the page: the A side is closer to A.', rows: ['>0 Perpendicular bisector of AB'], picture: regionFig(1) },
  { title: 'Less than 3 cm from B', say: 'A circle of radius 3 cm round B: inside it is less than 3 cm away.', rows: ['>0 Circle, radius 3 cm, centre B'], picture: regionFig(2) },
  { title: 'Both rules at once', say: 'Shade only where both are true: inside the circle, on A’s side of the bisector.', rows: ['! Inside the circle, on A’s side'], picture: regionFig(3, 'Closer to A, and less than 3 cm from B') },
], 'Region', regionFig(0)), 'For a region, draw the locus for each rule, then shade where every rule is true. “Less than” is inside a circle; “more than” is outside it.')
{
  const p = regionFig(3)
  practice(regions, 'Which rules describe the shaded region?', 'GM17 p152 (own numbers)', p,
    choose('Closer to A than B, and less than 3 cm from B', ['Closer to B than A, and less than 3 cm from B', 'The shading is on A’s side of the bisector.'], ['Closer to A than B, and more than 3 cm from B', 'The shading is inside the circle: less than 3 cm.'], ['Less than 3 cm from A', 'The circle is round B, not A.']),
    'Which side of the bisector? Inside or outside the circle?', boardModel([], [
      { title: 'Read each line', say: 'The shading is on A’s side of the bisector and inside B’s circle.', rows: ['! Closer to A, less than 3 cm from B'], picture: p },
    ], 'Region', p))
}
for (const [real, right, what] of [[3, 2, 'at least 3 m from the tree'], [4.5, 3, 'at least 4.5 m from the wall']] as const) {
  const items: FigureItem[] = [{ kind: 'line', from: [-3, 0], to: [3, 0] }, { kind: 'text', at: [2.2, 0], text: 'wall', dy: 16 }, { kind: 'point', at: [0, 2.5], label: 'tree', dx: 18, dy: -10 }, { kind: 'text', at: [-2, 3.5], text: '1 cm = 1.5 m', tone: 'faint' }]
  const p = fig(items, 'A plan of a garden: a wall along the bottom and a tree. The scale is 1 centimetre to 1.5 metres.', undefined, 20)
  practice(regions, `On a plan with scale 1 cm = 1.5 m, a fountain must be ${what}. How far is that on the plan?`, 'GM17 Your Turn Q4 (own numbers)', p, number(right, `${right} cm`), 'Each centimetre is 1.5 m: how many 1.5s?', boardModel([], [
    { title: 'Metres to centimetres', say: `Divide the real distance by 1.5 to get centimetres on the plan.`, rows: [`Plan = ${real} ÷ 1.5`, `! Plan = ${right} cm`], picture: p },
  ], 'Scale', p), slips(right, [[real * 1.5, 'That multiplies. The plan is smaller: divide by 1.5.'], [real, 'Change metres to plan centimetres: divide by 1.5.']]), CM_BOX)
}

add('mixed', 'Loci and constructions', 'GM17 consolidation', text(
  'A fixed distance from a point: a circle. From a line: straight sides and round ends.',
  'Same distance from two points: the perpendicular bisector.',
  'Same distance from two lines: the angle bisector.',
  'Regions: draw each locus, then shade where every rule is true.',
))

export const tutorLociLesson: TutorMethodLesson = {
  id: 'L217', number: 217, title: 'Loci and constructions', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Draw loci a fixed distance from a point or line, construct perpendicular and angle bisectors, and shade regions.',
  labels: { [distance]: 'A fixed distance', [perpendicular]: 'Perpendicular bisector', [angleBisector]: 'Angle bisector', [regions]: 'Regions', mixed: 'Review' },
  states: finish(),
}

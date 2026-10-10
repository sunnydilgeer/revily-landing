import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { dp, fig, screens, sf, show, slips } from '../../geometry/tutor/figureLesson'

/*
 * Geometry lesson 7: Circles. From GM7 in Sunny's revision book (p128–129), with our own numbers. Four rungs: the
 * parts of a circle; circumference (πd, or 2πr), in terms of π and rounded; area (πr²); and working backwards from an
 * area or circumference to the radius or diameter, as the book's Your Turn Q3 and Q4 do. Built like lessons 1 to 6
 * (Sunny, 9 Oct): the circumference rung opens on the measuring board, where you drag the circle bigger and smaller
 * and the circumference ÷ the diameter is always π.
 *
 * Every rounded answer is worked out here from Math.PI and rounded the way the question asks (1 dp or 3 sf), and the
 * verify script works each one out again.
 *
 * Hidden on live like lessons 1 to 6: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(207)
const { add, finish } = lesson
const { explore, worked, practice } = screens(lesson)
const parts = 'geometry-circle-parts'
const circumference = 'geometry-circumference'
const area = 'geometry-circle-area'
const backwards = 'geometry-circle-backwards'

/* ---------- Pictures ---------- */

const at = (deg: number, r = 1): FigurePoint => [r * Math.cos(deg * Math.PI / 180), r * Math.sin(deg * Math.PI / 180)]
const base: FigureItem[] = [{ kind: 'circle', centre: [0, 0], r: 1 }]
const centreDot: FigureItem = { kind: 'point', at: [0, 0], label: 'C', dx: -12, dy: 14 }

/** A circle with its radius (at 35°) or diameter (across) measured and labelled. */
function circleFig(kind: 'radius' | 'diameter', label: string, tone: FigureTone = 'given', fill = false, caption?: string): AngleFrame {
  const items: FigureItem[] = [{ kind: 'circle', centre: [0, 0], r: 1, ...(fill ? {} : { fill: 'none' as const }) }, centreDot]
  if (kind === 'radius') items.push({ kind: 'line', from: [0, 0], to: at(35), style: tone === 'lit' ? 'lit' : 'plain' }, { kind: 'text', at: at(35, 0.45), text: label, tone, dx: -18, dy: -16 })
  else items.push({ kind: 'line', from: [-1, 0], to: [1, 0], style: tone === 'lit' ? 'lit' : 'plain' }, { kind: 'text', at: [0.45, 0], text: label, tone, dy: -16 })
  return fig(items, `A circle with centre C and ${kind} ${label}.`, caption)
}

/** The parts of a circle (GM7 p128), each picture lighting one part in purple. */
type Part = 'centre' | 'radius' | 'diameter' | 'circumference' | 'chord' | 'arc' | 'sector' | 'segment' | 'tangent'
const arcPoints = (from: number, to: number): FigurePoint[] => Array.from({ length: 25 }, (_, k) => at(from + (to - from) * k / 24))
function partFig(part: Part, caption?: string): AngleFrame {
  const items: FigureItem[] = [{ kind: 'circle', centre: [0, 0], r: 1, fill: 'none' }]
  if (part === 'sector') items.push({ kind: 'arc', centre: [0, 0], r: 1, from: 20, to: 85, sector: true, fill: 'part', style: 'lit' })
  if (part === 'segment') items.push({ kind: 'shape', points: arcPoints(110, 190), fill: 'part' })
  if (part === 'circumference') items.push({ kind: 'arc', centre: [0, 0], r: 1, from: 0, to: 359.9, style: 'lit' })
  if (part === 'arc') items.push({ kind: 'arc', centre: [0, 0], r: 1, from: -60, to: -10, style: 'lit' })
  if (part === 'radius' || (part === 'sector')) items.push({ kind: 'line', from: [0, 0], to: at(part === 'radius' ? 35 : 20), style: 'lit' })
  if (part === 'sector') items.push({ kind: 'line', from: [0, 0], to: at(85), style: 'lit' })
  if (part === 'diameter') items.push({ kind: 'line', from: at(160), to: at(-20), style: 'lit' })
  if (part === 'chord' || part === 'segment') items.push({ kind: 'line', from: at(110), to: at(190), style: part === 'chord' ? 'lit' : 'plain' })
  if (part === 'tangent') items.push({ kind: 'line', from: [1.316, -0.279], to: [0.416, 1.279], style: 'lit' })
  items.push({ kind: 'point', at: [0, 0], ...(part === 'centre' ? { label: 'Centre', dx: 0, dy: 16 } : {}) })
  const where: Record<Part, string> = { centre: 'the centre', radius: 'a radius, from the centre to the edge', diameter: 'a diameter, edge to edge through the centre', circumference: 'the circumference, all the way round', chord: 'a chord, edge to edge not through the centre', arc: 'an arc, part of the circumference', sector: 'a sector, between two radii and an arc', segment: 'a segment, between a chord and an arc', tangent: 'a tangent, touching the circle at one point' }
  return fig(items, `A circle with ${where[part]} drawn in purple.`, caption)
}

const r1 = (n: number) => dp(n, 1)
const C_BOX = (unit: string) => ({ label: `Circumference (${unit})`, prefix: 'C =' })
const A_BOX = (unit: string) => ({ label: `Area (${unit}²)`, prefix: 'A =' })

/* ---------- Rung 1: the parts of a circle ---------- */

{
  const SHORT: Record<Part, string> = { centre: 'The middle', radius: 'Centre to edge', diameter: 'Edge to edge, through C', circumference: 'All the way round', chord: 'Edge to edge, missing C', arc: 'Part of the edge', sector: 'Two radii and an arc', segment: 'A chord and an arc', tangent: 'Touches at one point' }
  const order: [Part, string, string][] = [
    ['centre', 'Centre', 'The point in the middle, the same distance from everywhere on the edge.'],
    ['radius', 'Radius', 'A straight line from the centre to the edge. Every radius of a circle is the same length. (Plural: radii, “ray-dee-eye”.)'],
    ['diameter', 'Diameter', 'A straight line from edge to edge through the centre: two radii, so d = 2r.'],
    ['circumference', 'Circumference', 'The distance all the way round the edge: a circle’s perimeter.'],
    ['chord', 'Chord', 'A straight line joining two points on the edge. (A diameter is the longest chord.)'],
    ['arc', 'Arc', 'Part of the circumference.'],
    ['sector', 'Sector', 'The slice between two radii and an arc, like a slice of pizza.'],
    ['segment', 'Segment', 'The part cut off by a chord, between the chord and the arc.'],
    ['tangent', 'Tangent', 'A straight line outside the circle that touches it at exactly one point.'],
  ]
  worked(parts, 'The parts of a circle.', 'Circle words', 'GM7 p128 Key circle terms', boardModel([], order.map(([part, name, say]) => ({ title: name, say, rows: [`> ${SHORT[part]}`], picture: partFig(part, name) })), 'Parts', partFig('centre')),
    'Questions use these words, so learn them: centre, radius, diameter, circumference, chord, arc, sector, segment, tangent.')
  const ask = (part: Part, name: string, wrong: [string, string][], hint: string) => {
    const say = order.find(([p]) => p === part)![2]
    practice(parts, 'What is the purple part called?', 'GM7 p128 Key circle terms', partFig(part), choose(name, ...wrong), hint,
      boardModel([], [{ title: name, say, rows: [`! ${name}`], picture: partFig(part, name) }], 'Name it', partFig(part)))
  }
  ask('chord', 'Chord', [['Diameter', 'A diameter goes through the centre. This line doesn’t.'], ['Radius', 'A radius goes from the centre to the edge.'], ['Tangent', 'A tangent touches the circle from outside, at one point.']], 'It joins two points on the edge, but misses the centre.')
  ask('sector', 'Sector', [['Segment', 'A segment is cut off by a chord. This is cut out by two radii.'], ['Arc', 'An arc is just part of the edge, a curved line.'], ['Chord', 'A chord is a straight line.']], 'Like a slice of pizza.')
  ask('tangent', 'Tangent', [['Chord', 'A chord joins two points on the edge, inside the circle.'], ['Diameter', 'A diameter goes through the centre.'], ['Arc', 'An arc is part of the circle’s edge.']], 'It only touches the circle at one point.')
  ask('segment', 'Segment', [['Sector', 'A sector’s edges are two radii, from the centre. This is cut off by a chord.'], ['Chord', 'The chord is the straight edge of this part.'], ['Arc', 'An arc is the curved line alone.']], 'A chord cuts it off.')
}

/* ---------- Rung 2: circumference ---------- */

explore(circumference, 'Drag the circle bigger and smaller. Watch C ÷ d.', 'GM7 p128 Circumference (play)', { mode: 'circle' })
{
  const p = circleFig('radius', '9 cm')
  worked(circumference, 'Find the circumference of a circle with radius 9 cm.', 'Circumference', 'GM7 p128 Example 2 (own numbers)', boardModel([], [
    { title: 'Diameter from radius', say: 'C = πd, and the diameter is two radii.', rows: ['C = πd = 2πr', 'd = 2 × 9 = 18'], picture: circleFig('diameter', '18 cm', 'lit') },
    { title: 'In terms of π', say: 'Leave π as π: that’s exact. “In terms of π” means stop here.', rows: ['C = 18π cm'], picture: circleFig('diameter', '18 cm', 'lit') },
    { title: 'As a number', say: 'Or use the π button: 18 × π = 56.548…, which is 56.5 to 1 decimal place.', rows: ['= 56.548…', '! C = 56.5 cm (1 dp)'], picture: circleFig('diameter', '18 cm', 'given', false, 'C = 56.5 cm') },
  ], 'Find C', p), 'Circumference = πd = 2πr. π is 3.14159…: the circumference is always just over 3 diameters.')
}
{
  const p = circleFig('diameter', '7.6 mm')
  practice(circumference, 'Find the circumference of this circle. Give your answer in terms of π.', 'GM7 p129 Q1a (own numbers)', p, number(7.6, '7.6π mm'), 'C = πd, and the diameter is given.', boardModel([], [
    { title: 'C = πd', say: 'The diameter is 7.6 mm, so the circumference is π × 7.6.', rows: ['C = π × 7.6', '! C = 7.6π mm'], picture: circleFig('diameter', '7.6 mm', 'lit') },
  ], 'Find C', p), slips(7.6, [[15.2, 'That’s 2 × 7.6: that would be 2πr with the diameter. C = πd.'], [r1(7.6 * Math.PI), 'Right size, but leave it in terms of π: type the number in front of π.'], [3.8, 'C = πd uses the whole diameter, 7.6.']]), C_BOX('π mm'))
}
for (const [kind, value, unit] of [['radius', 6.5, 'cm'], ['diameter', 15, 'm']] as const) {
  const d = kind === 'radius' ? value * 2 : value, C = r1(Math.PI * d)
  const p = circleFig(kind, `${value} ${unit}`)
  practice(circumference, 'Find the circumference of this circle, to 1 decimal place.', 'GM7 p128 (own numbers)', p, number(C, `${show(C, 1)} ${unit}`), kind === 'radius' ? 'Double the radius first, then times π.' : 'C = π × d.', boardModel([], [
    ...(kind === 'radius' ? [{ title: 'Diameter', say: 'Two radii make the diameter.', rows: [`d = 2 × ${value} = ${d}`], picture: circleFig('diameter', `${d} ${unit}`, 'lit') }] : []),
    { title: 'C = πd', say: `π × ${d} = ${(Math.PI * d).toFixed(3)}…, then round to 1 decimal place.`, rows: [`C = π × ${d}`, `= ${(Math.PI * d).toFixed(3)}…`, `! C = ${show(C, 1)} ${unit}`], picture: circleFig('diameter', `${d} ${unit}`, 'given', false, `C = ${show(C, 1)} ${unit}`) },
  ], 'Find C', p), slips(C, [...(kind === 'radius' ? [[r1(Math.PI * value), 'That’s π × the radius. Use the diameter: double it first.'] as [number, string]] : [[r1(Math.PI * value / 2), 'That’s π × the radius. C = πd uses the whole diameter.'] as [number, string]]), [r1(Math.PI * (d / 2) ** 2), 'That’s πr²: the area. Circumference is πd.']]), C_BOX(unit))
}

/* ---------- Rung 3: area ---------- */

{
  const p = circleFig('radius', '4.5 cm')
  const A = Math.PI * 4.5 ** 2
  worked(area, 'Find the area of this circle, to 1 decimal place.', 'Area of a circle', 'GM7 p128 Example 1 (own numbers)', boardModel([], [
    { title: 'A = πr²', say: 'Square the radius first, then times π. (r² means r × r, not 2 × r.)', rows: ['A = πr²', 'r² = 4.5 × 4.5 = 20.25'], picture: circleFig('radius', '4.5 cm', 'lit') },
    { title: 'Times π', say: `π × 20.25 = ${A.toFixed(3)}…, which is ${show(r1(A), 1)} to 1 decimal place.`, rows: ['A = π × 20.25', `= ${A.toFixed(3)}…`, `! A = ${show(r1(A), 1)} cm²`], picture: circleFig('radius', '4.5 cm', 'given', true, `A = ${show(r1(A), 1)} cm²`) },
  ], 'Find A', p), 'Area of a circle = πr². Use the radius: if you’re given the diameter, halve it first.')
}
{
  const p = circleFig('radius', '6 cm')
  practice(area, 'Find the area of this circle. Give your answer in terms of π.', 'GM7 p129 Q2 (own numbers)', p, number(36, '36π cm²'), 'Square the radius: 6² = 36.', boardModel([], [
    { title: 'A = πr²', say: 'r² = 6 × 6 = 36, so the area is 36 lots of π.', rows: ['A = π × 6²', '! A = 36π cm²'], picture: circleFig('radius', '6 cm', 'lit', true) },
  ], 'Find A', p), slips(36, [[12, '6² is 6 × 6, not 2 × 6.'], [r1(36 * Math.PI), 'Right size, but leave it in terms of π: type the number in front of π.'], [144, 'Use the radius, 6, not the diameter.']]), A_BOX('π cm'))
}
{
  const p = circleFig('diameter', '9.2 mm')
  const A = Math.PI * 4.6 ** 2, ans = sf(A, 3)
  practice(area, 'Find the area of this circle, to 3 significant figures.', 'GM7 p129 Q1b (own numbers)', p, number(ans, `${ans} mm²`), 'The diameter is given: halve it to get the radius.', boardModel([], [
    { title: 'Radius from diameter', say: 'A = πr² needs the radius: half of 9.2 is 4.6.', rows: ['r = 9.2 ÷ 2 = 4.6'], picture: circleFig('radius', '4.6 mm', 'lit') },
    { title: 'A = πr²', say: `π × 4.6² = π × 21.16 = ${A.toFixed(3)}…. To 3 significant figures that is ${ans}.`, rows: ['A = π × 4.6²', `= ${A.toFixed(3)}…`, `! A = ${ans} mm²`], picture: circleFig('radius', '4.6 mm', 'given', true, `A = ${ans} mm²`) },
  ], 'Find A', p), slips(ans, [[sf(Math.PI * 9.2 ** 2, 3), 'That uses the diameter. Halve it: r = 4.6.'], [sf(Math.PI * 9.2, 3), 'That’s the circumference, πd. Area is πr².'], [dp(A, 1), 'Right, but give it to 3 significant figures.']]), A_BOX('mm'))
}
{
  const p = circleFig('radius', '7 cm')
  const A = r1(Math.PI * 49)
  practice(area, 'Find the area of this circle, to 1 decimal place.', 'GM7 p128 (own numbers)', p, number(A, `${A} cm²`), 'r² = 49.', boardModel([], [
    { title: 'A = πr²', say: `7² = 49, and π × 49 = ${(Math.PI * 49).toFixed(3)}….`, rows: ['A = π × 7²', '= π × 49', `! A = ${A} cm²`], picture: circleFig('radius', '7 cm', 'given', true, `A = ${A} cm²`) },
  ], 'Find A', p), slips(A, [[r1(Math.PI * 14), 'That’s π × 14: r² is 7 × 7.'], [r1(Math.PI * 196), 'Use the radius, 7, not the diameter.']]), A_BOX('cm'))
}

/* ---------- Rung 4: working backwards ---------- */

{
  const r = Math.sqrt(150 / Math.PI)
  const p = circleFig('radius', 'r')
  worked(backwards, 'A circle has an area of 150 cm². Find its radius, to 1 decimal place.', 'Working backwards', 'GM7 p129 Q3 (own numbers)', boardModel([], [
    { title: 'Put in the area', say: 'Write A = πr² with the area you know.', rows: ['150 = πr²'], picture: circleFig('radius', 'r', 'x', true) },
    { title: 'Divide by π', say: 'Undo the times π: divide both sides by π.', rows: [`r² = 150 ÷ π = ${(150 / Math.PI).toFixed(3)}…`], picture: circleFig('radius', 'r', 'x', true) },
    { title: 'Square root', say: 'Undo the square: square root both sides. Round only at the end.', rows: [`r = √${(150 / Math.PI).toFixed(3)}…`, `! r = ${show(r1(r), 1)} cm`], picture: circleFig('radius', `${show(r1(r), 1)} cm`, 'found', true) },
  ], 'Find r', p), 'Working backwards: put what you know into the formula, then undo each step in reverse order.')
}
{
  const d = 80 / Math.PI, ans = sf(d, 3)
  const p = circleFig('diameter', 'd')
  practice(backwards, 'A circle has a circumference of 80 cm. Find its diameter, to 3 significant figures.', 'GM7 p129 Q4 (own numbers)', p, number(ans, `${ans} cm`), 'C = πd, so d = C ÷ π.', boardModel([], [
    { title: 'Put in C', say: 'C = πd, so 80 = π × d.', rows: ['80 = π × d'], picture: circleFig('diameter', 'd', 'x') },
    { title: 'Divide by π', say: `80 ÷ π = ${d.toFixed(4)}…, which is ${ans} to 3 significant figures.`, rows: ['d = 80 ÷ π', `! d = ${ans} cm`], picture: circleFig('diameter', `${ans} cm`, 'found') },
  ], 'Find d', p), slips(ans, [[sf(80 * Math.PI, 3), 'Divide by π, don’t multiply.'], [sf(d / 2, 3), 'That’s the radius. The question asks for the diameter.']]), { label: 'Diameter (cm)', prefix: 'd =' })
}
{
  const r = Math.sqrt(100 / Math.PI), ans = r1(r)
  const p = circleFig('radius', 'r')
  practice(backwards, 'A circle has an area of 100 cm². Find its radius, to 1 decimal place.', 'GM7 p129 Q3 (own numbers)', p, number(ans, `${ans} cm`), 'Divide by π, then square root.', boardModel([], [
    { title: 'Divide by π', say: '100 = πr², so r² = 100 ÷ π.', rows: ['100 = πr²', `r² = ${(100 / Math.PI).toFixed(3)}…`], picture: circleFig('radius', 'r', 'x', true) },
    { title: 'Square root', say: `√${(100 / Math.PI).toFixed(3)}… = ${r.toFixed(3)}….`, rows: [`! r = ${ans} cm`], picture: circleFig('radius', `${ans} cm`, 'found', true) },
  ], 'Find r', p), slips(ans, [[r1(100 / Math.PI), 'That’s r². Square root it.'], [r1(Math.sqrt(100) / Math.PI), 'Divide by π first, then square root.'], [r1(100 / (2 * Math.PI)), 'That’s from the circumference formula. Area is πr².']]), { label: 'Radius (cm)', prefix: 'r =' })
}
{
  const r = 50 / (2 * Math.PI), ans = r1(r)
  const p = circleFig('radius', 'r')
  practice(backwards, 'A circle has a circumference of 50 cm. Find its radius, to 1 decimal place.', 'GM7 p128 (working backwards)', p, number(ans, `${show(ans, 1)} cm`), 'C = 2πr, so r = C ÷ 2π.', boardModel([], [
    { title: 'Put in C', say: 'C = 2πr, so 50 = 2 × π × r.', rows: ['50 = 2πr'], picture: circleFig('radius', 'r', 'x') },
    { title: 'Divide by 2π', say: `50 ÷ 2π = ${r.toFixed(3)}….`, rows: ['r = 50 ÷ 2π', `! r = ${show(ans, 1)} cm`], picture: circleFig('radius', `${show(ans, 1)} cm`, 'found') },
  ], 'Find r', p), slips(ans, [[r1(50 / Math.PI), 'That’s the diameter. Halve it for the radius.'], [r1(Math.sqrt(50 / Math.PI)), 'That would use the area formula. Circumference is 2πr.']]), { label: 'Radius (cm)', prefix: 'r =' })
}

add('mixed', 'Circles', 'GM7 consolidation', text(
  'Radius: centre to edge. Diameter: edge to edge through the centre, d = 2r.',
  'Circumference = πd = 2πr.',
  'Area = πr²: square the radius, never the diameter.',
  '“In terms of π” means leave π in: 18π. Otherwise use the π button and round as asked.',
  'Working backwards: put in what you know, then undo, ÷ π and √.',
))

export const tutorCirclesLesson: TutorMethodLesson = {
  id: 'L207', number: 207, title: 'Circles', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Name the parts of a circle, find its circumference and area in terms of π or rounded, and work back from them to the radius or diameter.',
  labels: { [parts]: 'Parts of a circle', [circumference]: 'Circumference', [area]: 'Area', [backwards]: 'Working backwards', mixed: 'Review' },
  states: finish(),
}

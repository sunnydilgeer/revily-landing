import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { dp, fig, screens, show, slips } from '../../geometry/tutor/figureLesson'

/*
 * Geometry lesson 9: Sectors and arcs. From GM9 in Sunny's revision book (p133), with our own numbers (its Your Turn
 * page wasn't in the scans). Four rungs: a sector as a fraction of the circle (angle over 360); its area, that
 * fraction of πr²; its arc length, that fraction of πd; and its perimeter, the arc plus two radii. Built like lessons
 * 1 to 8 (Sunny, 9 Oct): the first rung opens on the measuring board, where you drag a sector round and its area and
 * arc are always that fraction of the whole circle's.
 *
 * Every rounded answer is worked out here from Math.PI and rounded to 1 decimal place, and the verify script works
 * each one out again.
 *
 * Hidden on live like lessons 1 to 8: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(209)
const { add, finish } = lesson
const { explore, worked, practice } = screens(lesson)
const fraction = 'geometry-sector-fraction'
const sectorArea = 'geometry-sector-area'
const arcLength = 'geometry-arc-length'
const sectorPerimeter = 'geometry-sector-perimeter'

/* ---------- Pictures ---------- */

const at = (deg: number, r = 1): FigurePoint => [r * Math.cos(deg * Math.PI / 180), r * Math.sin(deg * Math.PI / 180)]
type Marks = { angle?: FigureTone; r?: FigureTone; arc?: FigureTone; arcLabel?: string; fill?: boolean }

/** A sector of `angle` degrees, opening upwards, with the rest of its circle dashed; its angle and radius labelled. */
function sectorFig(angle: number, rLabel: string, marks: Marks = {}, caption?: string): AngleFrame {
  const from = 90 - angle / 2, to = 90 + angle / 2, mid = 90
  const items: FigureItem[] = [
    { kind: 'arc', centre: [0, 0], r: 1, from: to, to: from + 360, style: 'dashed' },
    { kind: 'arc', centre: [0, 0], r: 1, from, to, sector: true, fill: marks.fill ? 'part' : undefined, style: marks.arc === 'lit' || marks.arc === 'found' ? 'lit' : 'plain' },
    { kind: 'line', from: [0, 0], to: at(from), style: marks.r === 'lit' ? 'lit' : 'plain' },
    { kind: 'line', from: [0, 0], to: at(to), style: marks.r === 'lit' ? 'lit' : 'plain' },
    { kind: 'point', at: [0, 0] },
    // A narrow sector has room for its angle only out near the arc; its radius is labelled just outside it.
    { kind: 'text', at: at(mid, angle < 100 ? 0.7 : angle > 200 ? 0.28 : 0.34), text: `${angle}°`, tone: marks.angle ?? 'given' },
    { kind: 'text', at: at(from, 0.55), text: rLabel, tone: marks.r ?? 'given', dx: 26 * Math.cos((from - 90) * Math.PI / 180), dy: -18 * Math.sin((from - 90) * Math.PI / 180) + 4 },
  ]
  if (marks.arcLabel) items.push({ kind: 'text', at: at(mid, 1), text: marks.arcLabel, tone: marks.arc ?? 'given', dy: -20 })
  return fig(items, `A sector of a circle with angle ${angle}° and radius ${rLabel}; the rest of the circle is dashed.`, caption)
}

const r1 = (n: number) => dp(n, 1)
const A_BOX = { label: 'Area (cm²)', prefix: 'A =' }
const L_BOX = { label: 'Arc length (cm)', prefix: 'L =' }
const P_BOX = { label: 'Perimeter (cm)', prefix: 'P =' }

/* ---------- Rung 1: a fraction of the circle ---------- */

explore(fraction, 'Drag the edge of the sector round. Watch its area and arc.', 'GM9 p133 Sectors (play)', { mode: 'sector' })
{
  const p = sectorFig(90, '5 cm')
  worked(fraction, 'What fraction of the whole circle is this sector?', 'A fraction of a circle', 'GM9 p133 Sector of a circle (own numbers)', boardModel([], [
    { title: 'Angle over 360', say: 'A whole turn is 360°. A sector with angle θ is θ out of 360 of the circle.', rows: ['Fraction = {θ|360}'], picture: sectorFig(90, '5 cm', { angle: 'lit' }) },
    { title: 'Simplify', say: '90 out of 360 is a quarter: four of these make the whole circle.', rows: ['{90|360} = {1|4}', '! A quarter of the circle'], picture: sectorFig(90, '5 cm', { fill: true }, 'A quarter of the circle') },
  ], 'Fraction', p), 'A sector is a slice between two radii. Its angle over 360 says what fraction of the circle it is: everything about it is that fraction of the whole circle’s.')
}
for (const [angle, right, wrong, why] of [
  [45, '⅛', [['¼', '¼ of 360 is 90°. This is 45°.'], ['⅙', '⅙ of 360 is 60°. This is 45°.'], ['⅓', '⅓ of 360 is 120°.']], '45 out of 360: 360 ÷ 45 = 8, so eight of these fit round.'],
  [120, '⅓', [['¼', '¼ of 360 is 90°. This is 120°.'], ['⅙', '⅙ of 360 is 60°.'], ['½', '½ of 360 is 180°.']], '120 out of 360: 360 ÷ 120 = 3.'],
  [270, '¾', [['¼', '¼ is the missing part: the dashed bit. The sector is the rest.'], ['⅔', '⅔ of 360 is 240°.'], ['½', '½ of 360 is 180°.']], '270 out of 360: three right angles out of four.'],
] as [number, string, [string, string][], string][]) {
  const p = sectorFig(angle, '6 cm')
  practice(fraction, 'What fraction of the whole circle is this sector?', 'GM9 p133 (own numbers)', p, choose(right, ...wrong), 'Angle over 360, then simplify.', boardModel([], [
    { title: 'Angle over 360', say: why, rows: [`{${angle}|360} = {${right === '⅛' ? '1|8' : right === '⅓' ? '1|3' : '3|4'}}`, `! ${right} of the circle`], picture: sectorFig(angle, '6 cm', { fill: true, angle: 'lit' }) },
  ], 'Fraction', p))
}

/* ---------- Rung 2: sector area ---------- */

/** The worked steps for a sector's area: the whole circle's, then the fraction of it. */
function areaSteps(angle: number, r: number) {
  const whole = Math.PI * r * r, A = r1(angle / 360 * whole)
  return { A, moves: [
    { title: 'The whole circle', say: `The whole circle’s area is πr²: π × ${r}² = ${whole.toFixed(3)}….`, rows: [`πr² = π × ${r}² = ${whole.toFixed(3)}…`], picture: sectorFig(angle, `${r} cm`, { r: 'lit' as const }) },
    { title: 'The fraction of it', say: `The sector is ${angle} out of 360 of it. Times, then round at the end.`, rows: [`A = {${angle}|360} × ${whole.toFixed(3)}…`, `! A = ${show(A, 1)} cm²`], picture: sectorFig(angle, `${r} cm`, { fill: true, angle: 'lit' }, `A = ${show(A, 1)} cm²`) },
  ] }
}
{
  const { moves } = areaSteps(100, 9)
  worked(sectorArea, 'Find the area of this sector, to 1 decimal place.', 'Area of a sector', 'GM9 p133 Example 1 (own numbers)', boardModel([], moves, 'Find A', sectorFig(100, '9 cm')),
    'Area of a sector = {θ ÷ 360} × πr²: the angle’s fraction of the whole circle’s area.')
}
for (const [angle, r] of [[150, 6], [72, 10], [90, 5]] as const) {
  const { A, moves } = areaSteps(angle, r)
  const p = sectorFig(angle, `${r} cm`)
  practice(sectorArea, 'Find the area of this sector, to 1 decimal place.', 'GM9 p133 (own numbers)', p, number(A, `${show(A, 1)} cm²`), `${angle} out of 360 of πr².`, boardModel([], moves, 'Find A', p),
    slips(A, [[r1(angle / 360 * Math.PI * 2 * r), 'That’s the arc length, from πd. Area uses πr².'], [r1(Math.PI * r * r), `That’s the whole circle. Take ${angle}/360 of it.`], [r1(angle / 360 * Math.PI * 2 * r * 2 * r), 'Use the radius squared, not the diameter.']]), A_BOX)
}

/* ---------- Rung 3: arc length ---------- */

function arcSteps(angle: number, r: number) {
  const whole = Math.PI * 2 * r, L = r1(angle / 360 * whole)
  return { L, moves: [
    { title: 'The whole circumference', say: `The whole circle’s circumference is πd. The diameter is 2 × ${r} = ${2 * r}: π × ${2 * r} = ${whole.toFixed(3)}….`, rows: [`πd = π × ${2 * r} = ${whole.toFixed(3)}…`], picture: sectorFig(angle, `${r} cm`, { arc: 'lit', arcLabel: 'L' }) },
    { title: 'The fraction of it', say: `The arc is ${angle} out of 360 of the circumference.`, rows: [`L = {${angle}|360} × ${whole.toFixed(3)}…`, `! L = ${show(L, 1)} cm`], picture: sectorFig(angle, `${r} cm`, { arc: 'found', arcLabel: `${show(L, 1)} cm` }) },
  ] }
}
{
  const { moves } = arcSteps(140, 9)
  worked(arcLength, 'Find the arc length of this sector, to 1 decimal place.', 'Arc length', 'GM9 p133 Example 2 (own numbers)', boardModel([], moves, 'Find L', sectorFig(140, '9 cm', { arc: 'x', arcLabel: 'L' })),
    'Arc length = {θ ÷ 360} × πd: the angle’s fraction of the whole circumference. Remember d = 2r.')
}
for (const [angle, r] of [[60, 12], [45, 8], [270, 4]] as const) {
  const { L, moves } = arcSteps(angle, r)
  const p = sectorFig(angle, `${r} cm`, { arc: 'x', arcLabel: 'L' })
  practice(arcLength, 'Find the arc length of this sector, to 1 decimal place.', 'GM9 p133 (own numbers)', p, number(L, `${show(L, 1)} cm`), `${angle} out of 360 of πd. d = 2 × ${r}.`, boardModel([], moves, 'Find L', p),
    slips(L, [[r1(angle / 360 * Math.PI * r), `That uses the radius as the diameter. d = 2 × ${r} = ${2 * r}.`], [r1(angle / 360 * Math.PI * r * r), 'That’s the area, from πr². Arc length uses πd.'], [r1(Math.PI * 2 * r), `That’s the whole circumference. Take ${angle}/360 of it.`]]), L_BOX)
}

/* ---------- Rung 4: sector perimeter ---------- */

function perimeterSteps(angle: number, r: number) {
  const arc = angle / 360 * Math.PI * 2 * r, P = r1(arc + 2 * r)
  return { P, moves: [
    { title: 'The arc', say: `The curved edge: ${angle} out of 360 of π × ${2 * r}.`, rows: [`L = {${angle}|360} × π × ${2 * r} = ${arc.toFixed(3)}…`], picture: sectorFig(angle, `${r} cm`, { arc: 'lit', arcLabel: `${arc.toFixed(2)}…` }) },
    { title: 'Add two radii', say: `A sector has two straight edges too: two radii of ${r} cm.`, rows: [`P = ${arc.toFixed(3)}… + ${r} + ${r}`, `! P = ${show(P, 1)} cm`], picture: sectorFig(angle, `${r} cm`, { r: 'lit' }, `P = ${show(P, 1)} cm`) },
  ] }
}
{
  const { moves } = perimeterSteps(120, 8)
  worked(sectorPerimeter, 'Find the perimeter of this sector, to 1 decimal place.', 'Perimeter of a sector', 'GM9 p133 (own numbers)', boardModel([], moves, 'Find P', sectorFig(120, '8 cm')),
    'Perimeter of a sector = arc length + two radii. Don’t forget the straight edges.')
}
for (const [angle, r] of [[90, 10], [60, 9]] as const) {
  const { P, moves } = perimeterSteps(angle, r)
  const arc = angle / 360 * Math.PI * 2 * r
  const p = sectorFig(angle, `${r} cm`)
  practice(sectorPerimeter, 'Find the perimeter of this sector, to 1 decimal place.', 'GM9 p133 (own numbers)', p, number(P, `${show(P, 1)} cm`), 'Arc length, plus two radii.', boardModel([], moves, 'Find P', p),
    slips(P, [[r1(arc), 'That’s only the arc. Add the two straight edges, the radii.'], [r1(arc + r), 'There are two radii, one on each side.'], [r1(angle / 360 * Math.PI * r * r + 2 * r), 'That uses the area. The edge is the arc length, from πd.']]), P_BOX)
}

add('mixed', 'Sectors and arcs', 'GM9 consolidation', text(
  'A sector with angle θ is θ out of 360 of the circle.',
  'Sector area = θ/360 × πr².',
  'Arc length = θ/360 × πd (d = 2r).',
  'Sector perimeter = arc length + two radii.',
))

export const tutorSectorsLesson: TutorMethodLesson = {
  id: 'L209', number: 209, title: 'Sectors and arcs', level: 'GCSE Foundation',
  goal: 'See a sector as a fraction of its circle, and find its area, arc length and perimeter.',
  labels: { [fraction]: 'A fraction of a circle', [sectorArea]: 'Sector area', [arcLength]: 'Arc length', [sectorPerimeter]: 'Sector perimeter', mixed: 'Review' },
  states: finish(),
}

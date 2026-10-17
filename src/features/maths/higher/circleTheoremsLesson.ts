/*
 * Geometry 8H: Circle theorems, a Higher-only lesson after Perimeter (before Sectors and arcs, as in the book). From the
 * Higher revision guide, GM9 The 8 Circle Theorems (Level 6-7 and 8-9, p187–190): angles in the same segment are equal;
 * opposite angles in a cyclic quadrilateral add to 180°; the angle at the centre is twice the angle at the
 * circumference; the perpendicular bisector of a chord passes through the centre; a radius meets a tangent at 90°;
 * tangents from one point are equal; the angle in a semicircle is 90°; and the alternate segment theorem. Every step
 * names the rule it uses, as the book's "show your workings" questions ask.
 *
 * The book's numbers: Example 1 (CBA = 67°), Example 2 (Level 8-9, ABC = 30°), Your Turn Q1 (49°) and Q2 (58°), and the
 * Level 8-9 Q3 (EDA = 41°), Q4 (AED = 69°) and Q5 (x = 86°, between the tangent and AC). Every circle is drawn to scale,
 * its points placed so the marked angles are the true ones.
 */
import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import type { MicroSkillId } from '../../number-types/types'
import { asks, angleMark, figure } from './figureHelpers'

const a = author(208.5, 'L208H')
const { add, finish } = a
const ask = asks(a)
const angles = 'circle-theorems-angles'
const tangents = 'circle-theorems-tangents'
const combining = 'circle-theorems-combining'

function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: ReturnType<typeof boardModel>, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}

/* ---------- Pictures ---------- */

type Pt = FigurePoint
/** The point on the circle (centre 0, radius 1) at `deg` degrees anticlockwise from the right. */
const on = (deg: number): Pt => [Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180)]

type Circle = {
  /** Named points: on the circle, the centre, or outside it. A lower-case name is a point the picture doesn't label. */
  pts: Record<string, Pt>
  /** The centre's name, drawn as a dot, and where its name sits (pixels right and down; below right if not given). */
  centre?: string
  centreName?: [number, number]
  /** Straight lines between named points ("AB"), and the ones the step uses (lit) or has found. */
  lines: string[]
  lit?: string[]
  /** A tangent drawn through each of these points on the circle. */
  tangents?: string[]
  /** Angle marks: [corner, one end, other end, label, tone?, reflex?]. */
  marks?: [string, string, string, string, FigureTone?, boolean?][]
  /** Right angles marked: [corner, one end, other end]. */
  rights?: [string, string, string][]
  /** Equal lines, ticked once. */
  ticks?: string[]
  extra?: FigureItem[]
}

/** A circle with its points, chords, radii and tangents, and the angles marked; drawn to scale. */
function circle(c: Circle, spoken: string, caption?: string): AngleFrame {
  const p = (name: string) => c.pts[name]
  const items: FigureItem[] = [{ kind: 'circle', centre: [0, 0], r: 1, fill: 'none' }]
  for (const t of c.tangents ?? []) {
    const [x, y] = p(t), far = 1.25
    items.push({ kind: 'line', from: [x + y * far, y - x * far], to: [x - y * far, y + x * far] })
  }
  for (const l of c.lines) items.push({ kind: 'line', from: p(l[0]), to: p(l[1]), style: c.lit?.includes(l) ? 'lit' : 'plain' })
  for (const l of c.ticks ?? []) items.push({ kind: 'ticks', from: p(l[0]), to: p(l[1]), count: 1 })
  for (const [at, x, y] of c.rights ?? []) items.push({ kind: 'right', at: p(at), a: p(x), b: p(y) })
  for (const [at, x, y, label, tone, reflex] of c.marks ?? []) items.push(...angleMark(p(at), p(x), p(y), label, { tone, reflex }))
  for (const [name, at] of Object.entries(c.pts)) {
    if (name === name.toLowerCase()) continue
    if (name === c.centre) { items.push({ kind: 'point', at, label: name, dx: c.centreName?.[0] ?? 6, dy: c.centreName?.[1] ?? 16 }); continue }
    const len = Math.hypot(at[0], at[1]) || 1
    items.push({ kind: 'point', at, label: name, dx: at[0] / len * 15 - 4, dy: -at[1] / len * 15 + 5 })
  }
  items.push(...(c.extra ?? []))
  return figure(items, spoken, caption, 26)
}

const O: Pt = [0, 0]

add(angles, 'The circle theorems', 'Higher GM9 The 8 Circle Theorems', text(
  'Circle theorems are rules about angles in circles. Four are about angles made by chords:',
  'Angles in the same segment are equal: two angles standing on the same chord, on the same side of it.',
  'Opposite angles in a cyclic quadrilateral add to 180°. A cyclic quadrilateral has all four corners on the circle.',
  'The angle at the centre is twice the angle at the circumference, when both stand on the same arc.',
  'The angle in a semicircle is 90°: a triangle drawn on a diameter has a right angle on the circle.',
))

/* ---------- Rung 1: angles made by chords ---------- */

{
  // Example 1: BD a diameter through the centre C, A on the circle, angle ADB = 23°.
  const pts = { A: on(154), B: on(200), D: on(20), C: O }
  const base: Circle = { pts, centre: 'C', lines: ['AB', 'AD', 'BD'], marks: [['D', 'A', 'B', '23°'], ['B', 'D', 'A', 'x', 'x']] }
  worked(angles, 'BD is a diameter of the circle with centre C. Find angle CBA, giving a reason for each step.', 'Angle in a semicircle', 'Higher GM9 Example 1 (p189)', boardModel([], [
    { title: 'Angle in a semicircle', say: 'BD goes through the centre, so it is a diameter. The angle at A, standing on it, is a right angle.', rows: ['> Angle in a semicircle: BAD = 90°'], picture: circle({ ...base, lit: ['AB', 'AD'], rights: [['A', 'B', 'D']] }, 'The right angle at A, standing on the diameter BD.') },
    { title: 'Angles in a triangle', say: 'The three angles in triangle ABD add to 180°.', rows: ['CBA = 180 − 23 − 90', '! CBA = 67°'], picture: circle({ ...base, rights: [['A', 'B', 'D']], marks: [['D', 'A', 'B', '23°'], ['B', 'D', 'A', '67°', 'found']] }, 'Angle CBA is 67°.', 'CBA = 67°') },
  ], 'Find CBA', circle(base, 'A circle with centre C and diameter BD. A is on the circle. Angle ADB is 23°.')),
  'When a question says “show your workings”, name the circle theorem or angle fact you use at every step.')
}

{
  // Your Turn Q1: angle AOC = 98° at the centre, x at B on the circumference.
  const pts = { A: on(131), B: on(0), C: on(229), O }
  ask(angles, 'A, B and C lie on a circle with centre O. Angle AOC is 98°. Work out angle x, giving a reason.', 'Higher GM9 Your Turn Q1', circle({ pts, centre: 'O', lines: ['OA', 'OC', 'AB', 'CB'], marks: [['O', 'A', 'C', '98°'], ['B', 'A', 'C', 'x', 'x']] }, 'A circle with centre O. Angle AOC at the centre is 98°; x is angle ABC on the circumference.'),
    number(49, '49°'), '49°', 'The angle at the centre is twice the angle at the circumference.', {
      kind: 'step-worked', start: 'Angle AOC = 98°', steps: [
        { title: 'Centre is twice', why: 'The angle at the centre is twice the angle at the circumference on the same arc, so x is half of it.', lines: [line([part('98'), sign('÷'), part('2')], '49°', { answer: true })] },
      ],
    }, { label: 'Angle x (°)', prefix: 'x =' })
}

{
  // Your Turn Q2: BC through the centre, angle ACB = 32°.
  const pts = { A: on(74), B: on(10), C: on(190), O }
  ask(angles, 'A, B and C lie on a circle and BC passes through the centre O. Angle ACB is 32°. Work out angle x.', 'Higher GM9 Your Turn Q2', circle({ pts, centre: 'O', lines: ['AB', 'AC', 'BC'], marks: [['C', 'A', 'B', '32°'], ['B', 'A', 'C', 'x', 'x']] }, 'A circle with diameter BC through O. Angle ACB is 32°; x is angle ABC.'),
    number(58, '58°'), '58°', 'BC is a diameter. What does that make the angle at A?', {
      kind: 'step-worked', start: 'Angle ACB = 32°, BC is a diameter', steps: [
        { title: 'Angle in a semicircle', why: 'BC goes through the centre, so the angle at A standing on it is a right angle.', lines: [line([part('Angle BAC')], '90°', { eq: true })] },
        { title: 'Angles in a triangle', why: 'The three angles of triangle ABC add to one hundred and eighty degrees.', lines: [line([part('180'), sign('−'), part('90'), sign('−'), part('32')], '58°', { answer: true })] },
      ],
    }, { label: 'Angle x (°)', prefix: 'x =' })
}

{
  // Same segment: both angles stand on chord CD (arc 74°), on the same side of it.
  const pts = { A: on(150), B: on(40), C: on(240), D: on(314) }
  ask(angles, 'A, B, C and D lie on a circle. Angle CAD is 37°. Find angle x, angle CBD.', 'Higher GM9 Rule 1 (own numbers)', circle({ pts, lines: ['AC', 'AD', 'BC', 'BD'], marks: [['A', 'C', 'D', '37°'], ['B', 'C', 'D', 'x', 'x']] }, 'Angles CAD and CBD both stand on the chord CD. Angle CAD is 37°.'),
    number(37, '37°'), '37°', 'Both angles stand on the same chord, CD.', {
      kind: 'step-worked', start: 'Angle CAD = 37°', steps: [
        { title: 'Same segment', why: 'Angles standing on the same chord, in the same segment, are equal.', lines: [line([part('x')], '37°', { eq: true, answer: true })] },
      ],
    }, { label: 'Angle x (°)', prefix: 'x =' })
}

{
  // Cyclic quadrilateral ABCD: angle A = 112°, so angle C = 68°.
  const pts = { A: on(160), B: on(230), C: on(300), D: on(94) }
  ask(angles, 'ABCD is a cyclic quadrilateral. Angle DAB is 112°. Find angle x, angle BCD.', 'Higher GM9 Rule 2 (own numbers)', circle({ pts, lines: ['AB', 'BC', 'CD', 'DA'], marks: [['A', 'D', 'B', '112°'], ['C', 'B', 'D', 'x', 'x']] }, 'A cyclic quadrilateral ABCD. Angle A is 112°; x is the opposite angle, at C.'),
    number(68, '68°'), '68°', 'A and C are opposite corners of a cyclic quadrilateral.', {
      kind: 'step-worked', start: 'Angle DAB = 112°', steps: [
        { title: 'Cyclic quadrilateral', why: 'Opposite angles in a cyclic quadrilateral add to one hundred and eighty degrees.', lines: [line([part('180'), sign('−'), part('112')], '68°', { answer: true })] },
      ],
    }, { label: 'Angle x (°)', prefix: 'x =' })
}

{
  // The centre angle from the circumference one: 54° at B, so 108° at O.
  const pts = { A: on(126), B: on(0), C: on(234), O }
  ask(angles, 'A, B and C lie on a circle with centre O. Angle ABC is 54°. Find angle x, angle AOC.', 'Higher GM9 Rule 3 (own numbers)', circle({ pts, centre: 'O', lines: ['OA', 'OC', 'AB', 'CB'], marks: [['B', 'A', 'C', '54°'], ['O', 'A', 'C', 'x', 'x']] }, 'Angle ABC on the circumference is 54°; x is angle AOC at the centre.'),
    number(108, '108°'), '108°', 'The angle at the centre is twice the one at the circumference.', {
      kind: 'step-worked', start: 'Angle ABC = 54°', steps: [
        { title: 'Centre is twice', why: 'The angle at the centre is twice the angle at the circumference on the same arc.', lines: [line([part('54'), sign('×'), part('2')], '108°', { answer: true })] },
      ],
    }, { label: 'Angle x (°)', prefix: 'x =' })
}

{
  const pts = { P: on(150), Q: on(225), R: on(320), S: on(60) }
  ask(angles, 'Angle x and the 75° angle add to 180°. Which rule says so?', 'Higher GM9 Rule 2 (naming the rule)', circle({ pts, lines: ['PQ', 'QR', 'RS', 'SP'], marks: [['P', 'S', 'Q', '75°'], ['R', 'Q', 'S', 'x', 'x']] }, 'A quadrilateral PQRS with all four corners on the circle. Angle P is 75°; x is angle R, opposite it.'),
    choose('Opposite angles in a cyclic quadrilateral add to 180°',
      ['Angles in a triangle add to 180°', 'There is no triangle here: x and 75° are corners of a four-sided shape.'],
      ['Angles on a straight line add to 180°', 'The two angles aren’t on one straight line: they are opposite corners.'],
      ['Angles in the same segment are equal', 'That rule makes two angles equal, not add to 180°.']),
    'Opposite angles in a cyclic quadrilateral add to 180°', 'All four corners are on the circle.', {
      kind: 'step-worked', start: 'Angle P = 75°, x is opposite it', steps: [
        { title: 'Spot the shape', why: 'All four corners of PQRS are on the circle, and x is opposite the 75° angle.', words: 'Opposite angles in a cyclic quadrilateral add to 180°' },
      ],
    })
}

/* ---------- Rung 2: chords and tangents ---------- */

add(tangents, 'Chords and tangents', 'Higher GM9 The 8 Circle Theorems', text(
  'A tangent is a straight line that touches the circle at one point. Four more rules:',
  'A radius meets a tangent at 90°.',
  'Two tangents from the same point outside the circle are equal in length.',
  'The perpendicular bisector of a chord passes through the centre: a line from the centre at 90° to a chord cuts it in half.',
  'Alternate segment theorem: the angle between a tangent and a chord equals the angle in the alternate segment, on the other side of the chord.',
))

// Two tangents from P touch the circle at A and B; angle APB = 50°, so angle AOB = 130°.
const P2: Pt = [1 / Math.cos(65 * Math.PI / 180), 0]
const kite = { A: on(65), B: on(-65), P: P2, O }
{
  const base: Circle = { pts: kite, centre: 'O', lines: ['OA', 'OB', 'PA', 'PB'], marks: [['P', 'A', 'B', '50°'], ['O', 'A', 'B', 'x', 'x']] }
  worked(tangents, 'PA and PB are tangents to the circle with centre O. Angle APB is 50°. Find angle AOB.', 'Tangents and radii', 'Higher GM9 Rules 5 and 6 (own numbers)', boardModel([], [
    { title: 'Radius meets tangent', say: 'OA and OB are radii, and each meets its tangent at 90°.', rows: ['> Radius meets tangent at 90°: OAP = OBP = 90°'], picture: circle({ ...base, lit: ['OA', 'OB'], rights: [['A', 'O', 'P'], ['B', 'O', 'P']] }, 'Right angles where each radius meets its tangent.') },
    { title: 'Angles in a quadrilateral', say: 'OAPB has four angles, and they add to 360°.', rows: ['AOB = 360 − 90 − 90 − 50', '! AOB = 130°'], picture: circle({ ...base, rights: [['A', 'O', 'P'], ['B', 'O', 'P']], marks: [['P', 'A', 'B', '50°'], ['O', 'A', 'B', '130°', 'found']] }, 'Angle AOB is 130°.', 'AOB = 130°') },
  ], 'Find AOB', circle(base, 'Two tangents from P touch the circle at A and B. O is the centre. Angle APB is 50°.')),
  'A tangent and the radius to the point it touches always make a right angle. Look for them whenever a tangent is drawn.')
}

ask(tangents, 'PA and PB are tangents to the circle. Angle APB is 50°. Find angle x, angle PAB.', 'Higher GM9 Rule 6 (own numbers)', circle({ pts: kite, centre: 'O', lines: ['PA', 'PB', 'AB'], ticks: ['PA', 'PB'], marks: [['P', 'A', 'B', '50°'], ['A', 'P', 'B', 'x', 'x']] }, 'Tangents PA and PB, marked equal, with the chord AB. Angle APB is 50°.'),
  number(65, '65°'), '65°', 'PA and PB are equal, so triangle PAB is isosceles.', {
    kind: 'step-worked', start: 'Angle APB = 50°', steps: [
      { title: 'Equal tangents', why: 'Tangents from the same point are equal, so triangle PAB is isosceles.', lines: [line([part('PA')], 'PB', { eq: true })] },
      { title: 'Share what’s left', why: 'The two base angles share what is left of one hundred and eighty degrees equally.', lines: [line([part('180'), sign('−'), part('50')], '130'), line([part('130'), sign('÷'), part('2')], '65°', { answer: true })] },
    ],
  }, { label: 'Angle x (°)', prefix: 'x =' })

{
  // A chord 16 cm long, 6 cm from the centre of a circle of radius 10 cm.
  const pts = { A: [-0.8, -0.6] as Pt, B: [0.8, -0.6] as Pt, M: [0, -0.6] as Pt, O }
  ask(tangents, 'A circle with centre O has radius 10 cm. The chord AB is 16 cm long. How far is the chord from O?', 'Higher GM9 Rule 4 (own numbers)', circle({ pts, centre: 'O', centreName: [-18, -2], lines: ['AB', 'OM', 'OB'], ticks: ['AM', 'MB'], rights: [['M', 'O', 'B']], extra: [
    { kind: 'text', at: [0.42, -0.22], text: '10 cm', dx: 22, dy: -4 }, { kind: 'text', at: [0, -0.32], text: 'd', tone: 'x', dx: -12 }, { kind: 'measure', from: [-0.8, -0.6], to: [0.8, -0.6], label: '16 cm', offset: 40, side: 1 },
  ] }, 'A chord AB of 16 cm, with a line from the centre O meeting it at 90° at M. The radius OB is 10 cm; d is OM.'),
    number(6, '6 cm'), '6 cm', 'The line from the centre at 90° cuts the chord in half. Then use Pythagoras.', {
      kind: 'step-worked', start: 'Radius 10 cm, chord 16 cm', steps: [
        { title: 'Halve the chord', why: 'A line from the centre at right angles to a chord bisects it.', lines: [line([part('16'), sign('÷'), part('2')], '8')] },
        { title: 'Use Pythagoras', why: 'OM, MB and the radius OB make a right-angled triangle, with the radius as its hypotenuse.', lines: [line([part('10²'), sign('−'), part('8²')], '36'), line([part('√36')], '6 cm', { answer: true })] },
      ],
    }, { label: 'Distance d (cm)', prefix: 'd =' })
}

{
  // Alternate segment: the tangent at A makes 58° with AB, so angle ACB = 58°.
  const pts = { A: on(270), B: on(154), C: on(40), t: [-1.25, -1] as Pt }
  ask(tangents, 'The line through A is a tangent to the circle. The angle between it and AB is 58°. Find angle x, angle ACB.', 'Higher GM9 Rule 8 (own numbers)', circle({ pts, tangents: ['A'], lines: ['AB', 'BC', 'CA'], marks: [['A', 't', 'B', '58°'], ['C', 'A', 'B', 'x', 'x']] }, 'A tangent at A. The angle between the tangent and the chord AB is 58°; x is angle ACB in the other segment.'),
    number(58, '58°'), '58°', 'The angle between a tangent and a chord equals the angle in the alternate segment.', {
      kind: 'step-worked', start: 'Tangent and AB make 58°', steps: [
        { title: 'Alternate segment', why: 'The angle between the tangent and the chord AB equals the angle on the other side of AB, at C.', lines: [line([part('x')], '58°', { eq: true, answer: true })] },
      ],
    }, { label: 'Angle x (°)', prefix: 'x =' })
}

/* ---------- Rung 3: combining the rules (Level 8-9) ---------- */

{
  // Example 2: C the centre, A, B and D on the circle; BCD = 126°, CDA = 33°.
  const pts = { A: on(104), B: on(224), D: on(350), C: O }
  const base: Circle = { pts, centre: 'C', lines: ['AB', 'AD', 'CB', 'CD'], marks: [['C', 'B', 'D', '126°'], ['D', 'C', 'A', '33°'], ['B', 'A', 'C', 'x', 'x']] }
  worked(combining, 'A, B and D lie on a circle with centre C. Angle BCD is 126° and angle CDA is 33°. Find angle ABC.', 'Combining rules', 'Higher GM9 Example 2 (Level 8-9, p189)', boardModel([], [
    { title: 'Centre is twice', say: 'BAD is at the circumference on the same arc as BCD at the centre, so it is half of 126°.', rows: ['BAD = 126 ÷ 2 = 63°'], picture: circle({ ...base, lit: ['AB', 'AD'], marks: [['C', 'B', 'D', '126°'], ['D', 'C', 'A', '33°'], ['A', 'B', 'D', '63°', 'lit']] }, 'Angle BAD at the circumference is 63°.') },
    { title: 'Angles around a point', say: 'Inside ABCD the angle at C is the reflex one, the other way round. Angles around a point add to 360°.', rows: ['Reflex BCD = 360 − 126', '= 234°'], picture: circle({ ...base, lit: ['CB', 'CD'], marks: [['C', 'B', 'D', '234°', 'lit', true], ['D', 'C', 'A', '33°'], ['A', 'B', 'D', '63°']] }, 'The reflex angle at C is 234°.') },
    { title: 'Angles in a quadrilateral', say: 'The four angles of ABCD add to 360°.', rows: ['33 + 63 + 234 = 330', 'ABC = 360 − 330', '! ABC = 30°'], picture: circle({ ...base, marks: [['C', 'B', 'D', '234°', 'given', true], ['D', 'C', 'A', '33°'], ['A', 'B', 'D', '63°'], ['B', 'A', 'C', '30°', 'found']] }, 'Angle ABC is 30°.', 'ABC = 30°') },
  ], 'Find ABC', circle(base, 'A, B and D on a circle with centre C. Angle BCD is 126°, angle CDA is 33°, and x is angle ABC.')),
  'Harder questions need two or three rules in a row. Find any angle you can, name the rule each time, and keep going until you reach the one asked for.')
}

{
  // Your Turn Q3: BD a diameter through C; angle CDA = 18°, angle DAE = 31°.
  const pts = { A: on(184), B: on(220), D: on(40), E: on(102), C: O }
  ask(combining, 'BD is a diameter of the circle with centre C. Angle CDA is 18° and angle DAE is 31°. Find angle EDA.', 'Higher GM9 Your Turn Q3 (Level 8-9)', circle({ pts, centre: 'C', lines: ['BD', 'AB', 'AD', 'AE', 'ED'], marks: [['D', 'B', 'A', '18°'], ['A', 'D', 'E', '31°'], ['D', 'E', 'A', 'x', 'x']] }, 'A circle with diameter BD through the centre C, and points A and E on it. Angle CDA is 18°, angle DAE is 31°; x is angle EDA.'),
    number(41, '41°'), '41°', 'Start with the triangle on the diameter, then look at the cyclic quadrilateral ABDE.', {
      kind: 'step-worked', start: 'Angle CDA = 18°, angle DAE = 31°', steps: [
        { title: 'Angle in a semicircle', why: 'BD is a diameter, so the angle at A in triangle ABD is a right angle. That leaves angle ABD.', lines: [line([part('180'), sign('−'), part('90'), sign('−'), part('18')], '72°')] },
        { title: 'Cyclic quadrilateral', why: 'ABDE has all four corners on the circle, so its opposite angles at B and E add to one hundred and eighty degrees.', lines: [line([part('180'), sign('−'), part('72')], '108°')] },
        { title: 'Angles in a triangle', why: 'Triangle ADE has the angle at E and the angle at A, so take both away.', lines: [line([part('180'), sign('−'), part('108'), sign('−'), part('31')], '41°', { answer: true })] },
      ],
    }, { label: 'Angle EDA (°)', prefix: 'EDA =' })
}

{
  // Your Turn Q4: tangents from B touch at A and D; angle ABD = 42°; E on the major arc.
  const B: Pt = [Math.cos(225 * Math.PI / 180) / Math.cos(69 * Math.PI / 180), Math.sin(225 * Math.PI / 180) / Math.cos(69 * Math.PI / 180)]
  const pts = { A: on(156), D: on(294), B, E: on(30), C: O }
  ask(combining, 'A, D and E lie on a circle with centre C. AB and BD are tangents. Angle ABD is 42°. Find angle AED.', 'Higher GM9 Your Turn Q4 (Level 8-9)', circle({ pts, centre: 'C', lines: ['BA', 'BD', 'AD', 'AE', 'ED'], marks: [['B', 'A', 'D', '42°'], ['E', 'A', 'D', 'x', 'x']] }, 'Two tangents from B touch the circle at A and D. Angle ABD is 42°; x is angle AED, with E on the circle.'),
    number(69, '69°'), '69°', 'The tangents are equal, so triangle ABD is isosceles. Then use the alternate segment theorem.', {
      kind: 'step-worked', start: 'Angle ABD = 42°', steps: [
        { title: 'Equal tangents', why: 'BA and BD are tangents from the same point, so they are equal and the base angles of triangle ABD are equal.', lines: [line([part('180'), sign('−'), part('42')], '138'), line([part('138'), sign('÷'), part('2')], '69°')] },
        { title: 'Alternate segment', why: 'The angle between the tangent AB and the chord AD equals the angle in the alternate segment, at E.', lines: [line([part('Angle AED')], '69°', { eq: true, answer: true })] },
      ],
    }, { label: 'Angle AED (°)', prefix: 'AED =' })
}

{
  // Your Turn Q5: the tangent at A; angle BAC = 23°, angle ACB = 71°; x between the tangent and AC.
  const pts = { A: on(270), B: on(128), C: on(82), t: [1.25, -1] as Pt }
  ask(combining, 'The line through A is a tangent to the circle. Angle BAC is 23° and angle ACB is 71°. Find angle x, between the tangent and AC.', 'Higher GM9 Your Turn Q5 (Level 8-9)', circle({ pts, tangents: ['A'], lines: ['AB', 'BC', 'CA'], marks: [['A', 'B', 'C', '23°'], ['C', 'A', 'B', '71°'], ['A', 't', 'C', 'x', 'x']] }, 'A tangent at A and a triangle ABC on the circle. Angle BAC is 23°, angle ACB is 71°; x is between the tangent and AC.'),
    number(86, '86°'), '86°', 'Find angle ABC first. Then use the alternate segment theorem.', {
      kind: 'step-worked', start: 'Angle BAC = 23°, angle ACB = 71°', steps: [
        { title: 'Angles in a triangle', why: 'Angle ABC is what is left of the triangle’s one hundred and eighty degrees.', lines: [line([part('180'), sign('−'), part('23'), sign('−'), part('71')], '86°')] },
        { title: 'Alternate segment', why: 'The angle between the tangent and the chord AC equals the angle in the alternate segment, at B.', lines: [line([part('x')], '86°', { eq: true, answer: true })] },
      ],
    }, { label: 'Angle x (°)', prefix: 'x =' })
}

add('mixed', 'Circle theorems', 'Higher GM9 consolidation', text(
  'Same segment: equal. Cyclic quadrilateral: opposite angles add to 180°.',
  'The angle at the centre is twice the angle at the circumference. The angle in a semicircle is 90°.',
  'A radius meets a tangent at 90°, and tangents from one point are equal.',
  'The line from the centre at 90° to a chord cuts it in half.',
  'The angle between a tangent and a chord equals the angle in the alternate segment.',
  'Name the rule at every step.',
))

export const tutorCircleTheoremsLesson: TutorMethodLesson = {
  id: 'L208H', number: 208.5, title: 'Circle theorems', level: 'GCSE Higher',
  steadyPictures: true,
  largePictures: true,
  goal: 'Use the 8 circle theorems to find missing angles and lengths, naming the rule at every step.',
  labels: { [angles]: 'Angles in a circle', [tangents]: 'Chords and tangents', [combining]: 'Combining the rules', mixed: 'Review' },
  states: finish(),
}

/*
 * Geometry 20H3: 3D Pythagoras and trigonometry, a Higher-only lesson after The cosine rule. From the Higher revision
 * guide, T6 3D Pythagoras and Trigonometry (Level 6-7, p234–235): Pythagoras twice gives a² + b² + c² = d² for the
 * diagonal of a cuboid; and a length or angle inside a 3D shape is found from a right-angled triangle drawn inside it,
 * often after finding one of its sides from another triangle first.
 *
 * The book's numbers: the cuboid Example (FC = 11.2 cm) and Your Turn Q1 to Q4: a pyramid's height (√94 cm), the
 * line to a midpoint (√153 = 3√17 cm), a cuboid's diagonal (√261 = 3√29 cm) and the angle EDB in a pyramid (48.0°).
 * Answers in surd form are picked from four. The 3D pictures are drawn the way the book draws them (an oblique sketch,
 * the edges you can't see dashed), and each triangle a step uses is drawn flat beside the working.
 */
import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import type { MicroSkillId } from '../../number-types/types'
import { asks, figure } from './figureHelpers'
import { rad, tri } from './trigPictures'

const a = author(220.7, 'L220H3')
const { add, finish } = a
const ask = asks(a)
const pythagoras = 'pythagoras-3d'
const trig = 'trig-3d'

function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: ReturnType<typeof boardModel>, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}

/* ---------- Pictures ---------- */

type P3 = [number, number, number]
type Solid = {
  /** Corners: across, up, and back into the page. A lower-case name is a point the picture doesn't label. */
  pts: Record<string, P3>
  /** The shape's edges ("AB"); those touching the hidden corner are dashed. */
  edges: string[]
  hidden: string
  /** Which way going back moves on the page: up and to the right, or up and to the left. */
  back: 'right' | 'left'
  /** Lines inside the shape a step uses ("AY"), drawn in purple, or in green when found. */
  lit?: string[]
  found?: string[]
  /** Lines inside the shape drawn plain and dashed (a height, a diagonal across the base). */
  inside?: string[]
  /** Labels on edges or lines: [line, label, tone?]. */
  labels?: [string, string, FigureTone?][]
  /** Angle marks: [corner, one end, other end, label]. */
  marks?: [string, string, string, string, FigureTone?][]
}
function solid(s: Solid, spoken: string, caption?: string): AngleFrame {
  const dx = s.back === 'right' ? 0.55 : -0.55
  const at = (name: string): FigurePoint => { const [x, y, z] = s.pts[name]; return [x + dx * z, y + 0.38 * z] }
  const all = Object.keys(s.pts).map(at)
  const G: FigurePoint = [all.reduce((t, p) => t + p[0], 0) / all.length, all.reduce((t, p) => t + p[1], 0) / all.length]
  const items: FigureItem[] = []
  for (const e of s.edges) items.push({ kind: 'line', from: at(e[0]), to: at(e[1]), style: e.includes(s.hidden) ? 'dashed' : 'plain' })
  for (const e of s.inside ?? []) items.push({ kind: 'line', from: at(e[0]), to: at(e[1]), style: 'dashed' })
  for (const e of s.lit ?? []) items.push({ kind: 'line', from: at(e[0]), to: at(e[1]), style: 'lit' })
  for (const e of s.found ?? []) items.push({ kind: 'line', from: at(e[0]), to: at(e[1]), style: 'found' })
  for (const [v, p, q, label, tone] of s.marks ?? []) {
    const V = at(v), deg = (to: FigurePoint) => Math.atan2(to[1] - V[1], to[0] - V[0]) * 180 / Math.PI
    let from = deg(at(p)), turn = ((deg(at(q)) - from) % 360 + 360) % 360
    if (turn > 180) { from = deg(at(q)); turn = 360 - turn }
    // A thin angle's label goes further out, where its two lines are far enough apart for it.
    const r = 1.4, mid = rad(from + turn / 2), out = turn < 25 ? 4.5 : 2.6
    items.push({ kind: 'arc', centre: V, r, from, to: from + turn, style: tone === 'found' || tone === 'x' || tone === 'lit' ? tone : 'plain' })
    items.push({ kind: 'text', at: [V[0] + out * Math.cos(mid), V[1] + out * Math.sin(mid)], text: label, tone: tone ?? 'given' })
  }
  for (const [e, label, tone] of s.labels ?? []) {
    const p = at(e[0]), q = at(e[1]), m: FigurePoint = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], len = Math.hypot(q[0] - p[0], q[1] - p[1])
    let nx = (q[1] - p[1]) / len, ny = -(q[0] - p[0]) / len
    if ((m[0] - G[0]) * nx + (m[1] - G[1]) * ny < 0) { nx = -nx; ny = -ny }
    const d = 8 + Math.abs(nx) * (label.length * 4.5 + 6) + Math.abs(ny) * 12
    items.push({ kind: 'text', at: m, text: label, tone: tone ?? 'given', dx: nx * d, dy: -ny * d })
  }
  for (const name of Object.keys(s.pts)) {
    if (name === name.toLowerCase()) continue
    const v = at(name), len = Math.hypot(v[0] - G[0], v[1] - G[1]) || 1
    items.push({ kind: 'text', at: v, text: name, name: true, dx: (v[0] - G[0]) / len * 13 - 4, dy: -(v[1] - G[1]) / len * 13 + 5 })
  }
  return figure(items, spoken, caption, 24)
}

/** A cuboid `w` across, `h` up and `d` back, its corners named front face first (bottom left, anticlockwise), then the back. */
function box(w: number, h: number, d: number, names: string, back: 'right' | 'left', hidden: string): Omit<Solid, 'lit' | 'labels'> {
  const corners: P3[] = [[0, 0, 0], [w, 0, 0], [w, h, 0], [0, h, 0], [0, 0, d], [w, 0, d], [w, h, d], [0, h, d]]
  const pts = Object.fromEntries([...names].map((n, i) => [n, corners[i]]))
  const n = [...names]
  const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].map(([i, j]) => n[i] + n[j])
  return { pts, edges, hidden, back }
}
/** A square-based pyramid: base `s` (D front left, C front right, B back right, A back left), apex E `h` above the middle M. */
function pyramid(s: number, h: number): Omit<Solid, 'lit' | 'labels'> {
  return {
    pts: { D: [0, 0, 0], C: [s, 0, 0], B: [s, 0, s], A: [0, 0, s], E: [s / 2, h, s / 2], m: [s / 2, 0, s / 2] },
    edges: ['DC', 'CB', 'BA', 'AD', 'ED', 'EC', 'EB', 'EA'], hidden: 'A', back: 'right',
  }
}

add(pythagoras, '3D Pythagoras', 'Higher T6 3D Pythagoras', text(
  'In a 3D shape, look for a right-angled triangle inside it, then use Pythagoras or SOHCAHTOA on that triangle.',
  'Often you need two triangles: one across the bottom to find a side, then one standing up that uses it.',
  'Pythagoras twice gives the 3D Pythagoras rule for the diagonal of a cuboid: a² + b² + c² = d².',
  'Leave an answer in surd form when the question asks: √153 simplifies to 3√17.',
))

/* ---------- Rung 1: lengths with 3D Pythagoras ---------- */

{
  // Our own: a 3 by 4 by 12 cuboid, its diagonal 13 cm.
  const base = box(4, 3, 12, 'PQRSTUVW', 'right', 'T')
  const s = (o: Partial<Solid>, caption?: string) => solid({ ...base, labels: [['PQ', '4 cm'], ['PS', '3 cm'], ['QU', '12 cm']], ...o }, 'A cuboid 4 cm wide, 3 cm tall and 12 cm long, with the diagonal from P to V.', caption)
  worked(pythagoras, 'Find the length of the diagonal PV of this cuboid.', 'Pythagoras twice', 'Higher T6 3D Pythagoras (own numbers)', boardModel([], [
    { title: 'Across the bottom', say: 'P to U runs across the bottom face: a right-angled triangle with sides 4 and 12.', rows: ['PU² = 4² + 12² = 160'], picture: s({ lit: ['PU'] }) },
    { title: 'Then up', say: 'PU, the edge UV going up, and the diagonal PV make another right-angled triangle.', rows: ['PV² = PU² + 3²', 'PV² = 160 + 9 = 169'], picture: s({ lit: ['PU', 'UV', 'PV'] }) },
    { title: 'Or all at once', say: 'That is 3D Pythagoras: square all three edges, add, and square root.', rows: ['PV² = 4² + 3² + 12² = 169', '! PV = √169 = 13 cm'], picture: s({ found: ['PV'] }, 'PV = 13 cm') },
  ], 'Find PV', s({ inside: ['PV'] })), 'The diagonal of a cuboid: d² = a² + b² + c², where a, b and c are its width, height and length.')
}

{
  // Your Turn Q3: the cuboid C to G 12 cm, C to B 6 cm (back), B to A 9 cm (up); the diagonal CE.
  const base = box(12, 9, 6, 'CGHDBFEA', 'left', 'F')
  ask(pythagoras, 'The cuboid is 9 cm by 6 cm by 12 cm. Find the length of the diagonal CE, in surd form.', 'Higher T6 Your Turn Q3 (Level 6-7)', solid({ ...base, lit: ['CE'], labels: [['CG', '12 cm'], ['CB', '6 cm'], ['BA', '9 cm']] }, 'A cuboid with edges 12 cm, 6 cm and 9 cm, and the diagonal from C to E.'),
    choose('3√29 cm', ['27 cm', 'That adds the three edges. Square them first, add, then square root.'], ['15 cm', 'That is the diagonal of the 9 cm by 12 cm face. Add the 6 cm edge squared too.'], ['3√13 cm', 'That leaves out the 12 cm edge. A cuboid’s diagonal uses all three.']),
    '3√29 cm', 'Square the three edges, add them, then square root.', {
      kind: 'step-worked', start: 'Edges 9 cm, 6 cm and 12 cm', steps: [
        { title: 'Square and add', why: 'For the diagonal of a cuboid, square all three edges and add them.', lines: [line([part('81'), sign('+'), part('36'), sign('+'), part('144')], '261')] },
        { title: 'Simplify the surd', why: 'Nine is a square number that divides two hundred and sixty-one.', lines: [line([part('√261'), sign('='), part('√9 × √29')], '3√29 cm', { answer: true })] },
      ],
    })
}

{
  // Your Turn Q2: the same cuboid; Y is the midpoint of CG, so CY = 6 cm; the line AY.
  const base = box(12, 9, 6, 'CGHDBFEA', 'left', 'F')
  const pts = { ...base.pts, Y: [6, 0, 0] as P3 }
  ask(pythagoras, 'The cuboid is 9 cm by 12 cm by 6 cm. Y is the midpoint of CG, so CY = 6 cm. Find the length of AY, in surd form.', 'Higher T6 Your Turn Q2 (Level 6-7)', solid({ ...base, pts, lit: ['AY'], labels: [['CY', '6 cm'], ['CB', '6 cm'], ['BA', '9 cm']] }, 'The cuboid with A above B, B behind C, and Y halfway along the 12 cm edge CG. The line AY goes from the top back corner to Y.'),
    choose('3√17 cm', ['√117 cm', 'That is AC. Add CY squared as well to reach Y.'], ['21 cm', 'That adds 9, 6 and 6. Square them first.'], ['3√29 cm', 'That is AG, to the far end of CG. Y is halfway along it: use 6 cm, not 12 cm.']),
    '3√17 cm', 'A to C is the diagonal of the side face. Then C to Y makes a right angle with it.', {
      kind: 'step-worked', start: 'AB = 9, BC = 6, CY = 6', steps: [
        { title: 'The side face', why: 'Triangle ABC is right-angled at B. Square and add its two edges.', lines: [line([part('81'), sign('+'), part('36')], '117')] },
        { title: 'Then along to Y', why: 'Triangle ACY is right-angled at C. Add the square of CY.', lines: [line([part('117'), sign('+'), part('36')], '153')] },
        { title: 'Simplify the surd', why: 'Nine is a square number that divides one hundred and fifty-three.', lines: [line([part('√153'), sign('='), part('√9 × √17')], '3√17 cm', { answer: true })] },
      ],
    })
}

{
  // Your Turn Q1: a square-based pyramid, base 10 cm, each sloping edge 12 cm; its height EM.
  const base = pyramid(10, Math.sqrt(94))
  ask(pythagoras, 'ABCDE is a square-based pyramid. The apex E is directly over the centre of the base. Find the height of the pyramid, in surd form.', 'Higher T6 Your Turn Q1 (Level 6-7)', solid({ ...base, inside: ['DB'], lit: ['Em', 'Dm'], labels: [['DC', '10 cm'], ['EB', '12 cm']] }, 'A square-based pyramid with a 10 cm base and sloping edges of 12 cm. The height goes from E straight down to the middle of the base.'),
    choose('√94 cm', ['√194 cm', 'The sloping edge is the hypotenuse: take the half-diagonal squared away from 12², don’t add it.'], ['√44 cm', 'Use half the diagonal of the base, 5√2, not half a side.'], ['2 cm', 'Use Pythagoras with the squares, not the lengths themselves.']),
    '√94 cm', 'Half the base’s diagonal, the height and a sloping edge make a right-angled triangle.', {
      kind: 'step-worked', start: 'Base 10 cm, edge 12 cm', steps: [
        { title: 'The base diagonal', why: 'The diagonal of the square base is the hypotenuse of a right-angled triangle with two ten centimetre sides.', lines: [line([part('10²'), sign('+'), part('10²')], '200'), line([part('Diagonal')], '√200', { eq: true })] },
        { title: 'Half of it', why: 'The centre is halfway along the diagonal, so square half of it: a quarter of two hundred.', lines: [line([part('200'), sign('÷'), part('4')], '50')] },
        { title: 'Height by Pythagoras', why: 'The sloping edge is the hypotenuse. Take the half-diagonal squared from its square.', lines: [line([part('144'), sign('−'), part('50')], '94'), line([part('Height')], '√94 cm', { eq: true, answer: true })] },
      ],
    })
}

/* ---------- Rung 2: angles and lengths with trigonometry ---------- */

add(trig, '3D trigonometry', 'Higher T6 3D Trigonometry', text(
  'SOHCAHTOA works in 3D too, on a right-angled triangle inside the shape.',
  'Find the triangle with the angle or side you want, and see which of its sides you know.',
  'If a side is missing, find it first from another right-angled triangle, often one across the base.',
  'Every corner of a cuboid is a right angle. A pyramid’s apex is directly over the centre of its base.',
))

{
  // Example: FE = 9 cm, angle EFH = 26°, CH = 5 cm; FC is the line through the cuboid.
  const d = 9 * Math.tan(rad(26))
  const base = box(9, 5, d, 'FEDAGHCB', 'right', 'G')
  const s = (o: Partial<Solid>, caption?: string) => solid({ ...base, labels: [['FE', '9 cm'], ['HC', '5 cm'], ...(o.labels ?? [])], marks: [['F', 'E', 'H', '26°']], ...o }, 'A cuboid with front bottom edge FE of 9 cm and the edge HC going up 5 cm. FH crosses the bottom at 26° to FE, and FC goes through the cuboid.', caption)
  const flat1 = tri([[0, 0], [9, 0], [9, d]], { sides: [{ label: '9 cm' }, undefined, { label: '10.013…', tone: 'found' }], angles: [{ at: 0, label: '26°' }], right: 1, names: ['F', 'E', 'H'], spoken: 'Triangle FEH flat: FE 9 cm, the right angle at E, the angle 26° at F, and FH 10.013 cm.' })
  const flat2 = tri([[0, 0], [10.013, 0], [10.013, 5]], { sides: [{ label: '10.013…' }, { label: '5 cm' }, { label: '11.2 cm', tone: 'found' }], right: 1, names: ['F', 'H', 'C'], spoken: 'Triangle FHC flat: FH 10.013 cm along the bottom, HC 5 cm up, the right angle at H, and FC 11.2 cm.' })
  worked(trig, 'ABCDEFGH is a cuboid. Find the length of FC, to 3 significant figures.', 'Two triangles', 'Higher T6 3D Trigonometry Example (p234)', boardModel([], [
    { title: 'Find FH first', say: 'FC is the hypotenuse of triangle FHC, but we don’t know FH. FH is in triangle FEH, across the bottom.', rows: ['>0 Triangle FEH: adjacent FE = 9, hypotenuse FH'], picture: s({ lit: ['FH'] }) },
    { title: 'Use CAH', say: 'Adjacent and hypotenuse: cos. Keep every digit.', rows: ['cos 26° = {9|FH}', 'FH = 9 ÷ cos 26° = 10.013… cm'], picture: flat1 },
    { title: 'Pythagoras in FHC', say: 'Every corner of a cuboid is a right angle, so FHC is right-angled at H.', rows: ['FC² = 5² + (10.013…)²', '! FC = 11.2 cm'], picture: flat2 },
  ], 'Find FC', s({ lit: ['FC'] })), 'Find the triangle you need, and if one of its sides is missing, find it from another right-angled triangle first. Keep every digit until the end.')
}

{
  // Your Turn Q4: a square-based pyramid, base 14 cm, height 11 cm; the angle EDB.
  const base = pyramid(14, 11)
  ask(trig, 'ABCDE is a square-based pyramid. The apex E is directly over the centre of the base. Find angle EDB, to 1 decimal place.', 'Higher T6 Your Turn Q4 (Level 6-7)', solid({ ...base, inside: ['DB'], lit: ['Em', 'Dm'], labels: [['DC', '14 cm'], ['Em', '11 cm']], marks: [['D', 'm', 'E', 'x', 'x']] }, 'A square-based pyramid with a 14 cm base and a height of 11 cm. The angle x is at D, between the edge DE and the diagonal DB.'),
    number(48, '48.0°'), '48.0°', 'The height, half the diagonal DB and the edge DE make a right-angled triangle.', {
      kind: 'step-worked', start: 'Base 14 cm, height 11 cm', steps: [
        { title: 'The base diagonal', why: 'The diagonal of the square base is the hypotenuse of a right-angled triangle with two fourteen centimetre sides.', lines: [line([part('√(14² + 14²)')], '19.79…')] },
        { title: 'Half of it', why: 'The apex is over the centre, halfway along DB. That is the side next to the angle.', lines: [line([part('19.79…'), sign('÷'), part('2')], '9.899…')] },
        { title: 'Use TOA', why: 'The height is opposite the angle and half the diagonal is next to it, so use inverse tan and round to one decimal place.', lines: [line([part('tan⁻¹(11 ÷ 9.899…)')], '48.0°', { answer: true })] },
      ],
    }, { label: 'Angle (°)', prefix: 'EDB =' })
}

{
  // Our own: the angle between the cuboid's diagonal PV and the bottom face, in the 3 by 4 by 12 cuboid.
  const base = box(4, 3, 12, 'PQRSTUVW', 'right', 'T')
  ask(trig, 'In the 4 cm by 3 cm by 12 cm cuboid, PU = √160 cm and UV = 3 cm. Find angle VPU, to 1 decimal place.', 'Higher T6 3D Trigonometry (own numbers)', solid({ ...base, lit: ['PU', 'PV'], labels: [['PQ', '4 cm'], ['PS', '3 cm'], ['QU', '12 cm']], marks: [['P', 'U', 'V', 'x', 'x']] }, 'The cuboid with the diagonal PV and the line PU across the bottom; x is the angle between them at P.'),
    number(13.3, '13.3°'), '13.3°', 'Triangle PUV has its right angle at U.', {
      kind: 'step-worked', start: 'PU = √160, UV = 3', steps: [
        { title: 'Pick the ratio', why: 'UV is opposite the angle and PU is next to it, so it is tan.', lines: [line([part('tan x')], '3 ÷ √160', { eq: true })] },
        { title: 'Use inverse tan', why: 'Use inverse tan, then round to one decimal place.', lines: [line([part('tan⁻¹(3 ÷ √160)')], '13.3°', { answer: true })] },
      ],
    }, { label: 'Angle (°)', prefix: 'x =' })
}

add('mixed', '3D Pythagoras and trigonometry', 'Higher T6 consolidation', text(
  'Find a right-angled triangle inside the shape, and draw it flat.',
  'A cuboid’s diagonal: d² = a² + b² + c².',
  'A missing side? Find it first from another right-angled triangle, often across the base.',
  'A pyramid’s apex is over the centre of its base: use half the base’s diagonal.',
))

export const tutorPythagoras3dLesson: TutorMethodLesson = {
  id: 'L220H3', number: 220.7, title: '3D Pythagoras and trigonometry', level: 'GCSE Higher',
  steadyPictures: true,
  largePictures: true,
  goal: 'Find lengths and angles in cuboids and pyramids with Pythagoras and SOHCAHTOA, using right-angled triangles inside the shape.',
  labels: { [pythagoras]: 'Lengths in 3D', [trig]: 'Angles in 3D', mixed: 'Review' },
  states: finish(),
}

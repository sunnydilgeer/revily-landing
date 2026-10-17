/*
 * Geometry 21H: Vectors, a Higher-only lesson after Column vectors. From the Higher revision guide, T8 Vectors (Level
 * 6-7 and 8-9, p237–240): a vector as an arrow named by a letter or by its two ends (XY, from X to Y); going against an
 * arrow makes it negative; adding goes end to end and subtracting adds the negative; a multiple of a vector is
 * parallel to it. Then routes round a shape, a point a fraction of the way along a line (a ratio), and showing two
 * lines are parallel.
 *
 * The book's numbers: the notation diagram (XY = a, YZ = b, ZX = c), the Example (BD : DC = 1 : 3, AD = 9/4 a + b) and
 * Your Turn Q1 to Q5. Q2 to Q5 are Level 8-9. Answers are picked from four, since fractions of a and b are awkward to
 * type. Vectors are written in plain letters here; the book prints them in bold, and by hand you underline them.
 */
import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel, choose, text } from '../../simultaneous-equations/tutor/boardWorkings'
import type { MicroSkillId } from '../../number-types/types'
import { asks, figure } from './figureHelpers'

const a = author(221.5, 'L221H')
const { add, finish } = a
const ask = asks(a)
const rules = 'vectors-rules'
const routes = 'vectors-routes'
const proof = 'vectors-ratio-proof'

function worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: ReturnType<typeof boardModel>, body: string) {
  const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
  state.content.heading = heading
  return state
}

/* ---------- Pictures ---------- */

type Pt = FigurePoint
type Shape = {
  /** Named points. A lower-case name is a point the picture doesn't label. */
  pts: Record<string, Pt>
  /** Lines with no arrow ("AB"). */
  lines?: string[]
  /** Vectors: [from-to, label], an arrow halfway along and the label beside it. */
  arrows?: [string, string, FigureTone?][]
  /** Routes a step follows ("AB", "BD"), drawn in purple with an arrow, or green when found. */
  lit?: string[]
  found?: string[]
  /** Points marked with a dot (a midpoint, a point on a line). */
  dots?: string[]
}
const mid = (p: Pt, q: Pt): Pt => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
/** A point `k` of the way from p to q. */
const along = (p: Pt, q: Pt, k: number): Pt => [p[0] + k * (q[0] - p[0]), p[1] + k * (q[1] - p[1])]
function shape(s: Shape, spoken: string, caption?: string): AngleFrame {
  const p = (n: string) => s.pts[n]
  const all = Object.values(s.pts)
  const G: Pt = [all.reduce((t, q) => t + q[0], 0) / all.length, all.reduce((t, q) => t + q[1], 0) / all.length]
  const items: FigureItem[] = []
  const head = (from: Pt, to: Pt, style: 'plain' | 'lit' | 'found') => {
    const len = Math.hypot(to[0] - from[0], to[1] - from[1]), m = mid(from, to), u: Pt = [(to[0] - from[0]) / len, (to[1] - from[1]) / len]
    items.push({ kind: 'line', from: [m[0] - 0.05 * u[0], m[1] - 0.05 * u[1]], to: [m[0] + 0.12 * u[0], m[1] + 0.12 * u[1]], style, arrow: true })
  }
  for (const l of s.lines ?? []) items.push({ kind: 'line', from: p(l[0]), to: p(l[1]) })
  for (const [l, label, tone] of s.arrows ?? []) {
    const from = p(l[0]), to = p(l[1]), m = mid(from, to), len = Math.hypot(to[0] - from[0], to[1] - from[1])
    items.push({ kind: 'line', from, to })
    head(from, to, 'plain')
    let nx = (to[1] - from[1]) / len, ny = -(to[0] - from[0]) / len
    if ((m[0] - G[0]) * nx + (m[1] - G[1]) * ny < 0) { nx = -nx; ny = -ny }
    const d = 9 + Math.abs(nx) * (label.length * 4.5 + 6) + Math.abs(ny) * 12
    items.push({ kind: 'text', at: m, text: label, tone: tone ?? 'given', dx: nx * d, dy: -ny * d })
  }
  for (const [list, style] of [[s.lit, 'lit'], [s.found, 'found']] as const) for (const l of list ?? []) {
    items.push({ kind: 'line', from: p(l[0]), to: p(l[1]), style })
    head(p(l[0]), p(l[1]), style)
  }
  for (const n of s.dots ?? []) items.push({ kind: 'point', at: p(n) })
  for (const [name, at] of Object.entries(s.pts)) {
    if (name === name.toLowerCase()) continue
    const len = Math.hypot(at[0] - G[0], at[1] - G[1]) || 1
    items.push({ kind: 'text', at, text: name, name: true, dx: (at[0] - G[0]) / len * 14 - 4, dy: -(at[1] - G[1]) / len * 14 + 5 })
  }
  return figure(items, spoken, caption, 24)
}

add(rules, 'Vectors', 'Higher T8 Vectors', text(
  'A vector has a size and a direction. It is drawn as an arrow, and named by a letter, like a, or by its two ends: AB is the vector from A to B.',
  'Going against the arrow makes it negative: BA = −AB. It is the same length, the other way.',
  'a + b: follow a, then b from where a ends. a − b is a + (−b).',
  '3a is a + a + a: three times as long, the same way. 3(a + b) = 3a + 3b.',
  'A multiple of a vector is parallel to it: 3a + 3b is parallel to a + b.',
  'The book prints vectors in bold. When you write them by hand, underline them.',
))

/* ---------- Rung 1: the rules ---------- */

{
  // The book's notation diagram: XY = a, YZ = b, ZX = c.
  const pts = { X: [0, 0] as Pt, Y: [3.4, 3] as Pt, Z: [6.4, 0] as Pt }
  const base: Shape = { pts, arrows: [['XY', 'a'], ['YZ', 'b'], ['ZX', 'c']] }
  worked(rules, 'XY = a, YZ = b and ZX = c. Find YX and XZ.', 'Routes', 'Higher T8 Vector Notation (p237)', boardModel([], [
    { title: 'Against the arrow', say: 'YX goes from Y back to X: against a.', rows: ['YX = −a'], picture: shape({ ...base, lit: ['YX'] }, 'The route from Y back to X, against the arrow a.') },
    { title: 'Two ways to Z', say: 'X to Z: along a then along b. Or straight along ZX the wrong way.', rows: ['XZ = a + b', 'XZ = −c'], picture: shape({ ...base, lit: ['XY', 'YZ'] }, 'The route from X to Y to Z.') },
    { title: 'Both are XZ', say: 'Both routes start at X and end at Z, so they are the same vector.', rows: ['! XZ = a + b = −c'], picture: shape({ ...base, found: ['XZ'] }, 'XZ, found two ways.', 'XZ = a + b = −c') },
  ], 'Find the vectors', shape(base, 'A triangle XYZ with arrows: XY is a, YZ is b and ZX is c.')), 'Any route from the start to the end gives the same vector. Follow the arrows, and write a minus sign each time you go against one.')
}

{
  const pts = { X: [0, 0] as Pt, Y: [3.4, 3] as Pt, Z: [6.4, 0] as Pt }
  ask(rules, 'XY = a and YZ = b. Find ZX in terms of a and b.', 'Higher T8 Vector Notation (p237)', shape({ pts, arrows: [['XY', 'a'], ['YZ', 'b']], lines: ['ZX'] }, 'A triangle XYZ: XY is a and YZ is b. ZX is the third side.'),
    choose('−a − b', ['a + b', 'That is XZ. ZX goes the other way, so it is negative.'], ['a − b', 'Go from Z to Y against b, then Y to X against a: both negative.'], ['b − a', 'Z to Y is against b too, so b is negative as well.']),
    '−a − b', 'Go from Z back to Y, then back to X: against both arrows.', {
      kind: 'step-worked', start: 'XY = a, YZ = b', steps: [
        { title: 'Z to Y', why: 'This goes against the arrow b.', lines: [line([part('ZY')], '−b', { eq: true })] },
        { title: 'Y to X', why: 'This goes against the arrow a. Add the two parts of the route.', lines: [line([part('ZX'), sign('='), part('−b'), sign('+'), part('(−a)')], '−a − b', { answer: true })] },
      ],
    })
}

{
  const pts = { O: [0, 0] as Pt, P: [2, 1.2] as Pt }
  ask(rules, 'Which of these vectors is parallel to a + 2b?', 'Higher T8 Scalar multiples (p237)', shape({ pts, arrows: [['OP', 'a + 2b']] }, 'An arrow from O to P, the vector a + 2b.'),
    choose('3a + 6b', ['2a + b', 'The numbers have swapped round. A parallel vector is the same vector times a number.'], ['a + 3b', 'Adding 1 to the b part changes the direction.'], ['3a + 2b', 'Only the a part has been multiplied. Both parts must be multiplied by the same number.']),
    '3a + 6b', 'Look for a + 2b multiplied by one number.', {
      kind: 'step-worked', start: 'a + 2b', steps: [
        { title: 'Take out a number', why: 'Three a plus six b has three as a factor of both parts.', lines: [line([part('3a + 6b')], '3(a + 2b)', { eq: true })] },
        { title: 'A multiple is parallel', why: 'It is three times a + 2b, so it points the same way.', words: '3a + 6b' },
      ],
    })
}

/* ---------- Rung 2: routes round a shape ---------- */

{
  // Your Turn Q1: AB = 3a, BC = 2b, M the midpoint of AC.
  const A: Pt = [0, 0], B: Pt = [5.2, 3], C: Pt = [6.4, 0]
  const pts = { A, B, C, M: mid(A, C) }
  const base: Shape = { pts, arrows: [['AB', '3a'], ['BC', '2b']], lines: ['AC'], dots: ['M'] }
  ask(routes, 'AB = 3a and BC = 2b. M is the midpoint of AC. Find AM in terms of a and b.', 'Higher T8 Your Turn Q1 (Level 6-7)', shape(base, 'A triangle ABC: AB is 3a and BC is 2b. M is halfway along AC.'),
    choose('3/2 a + b', ['3a + 2b', 'That is the whole of AC. M is only halfway along it.'], ['3/2 a + 2b', 'Halve both parts: half of 2b is b.'], ['3a + b', 'Halve both parts: half of 3a is 3/2 a.']),
    '3/2 a + b', 'Find AC first, then take half of it.', {
      kind: 'step-worked', start: 'AB = 3a, BC = 2b', steps: [
        { title: 'Find AC', why: 'Go from A to B, then B to C.', lines: [line([part('AC'), sign('='), part('3a'), sign('+'), part('2b')], '3a + 2b')] },
        { title: 'Halve it', why: 'M is the midpoint, so AM is half of AC. Halve both parts.', lines: [line([part('AM'), sign('='), part('½(3a + 2b)')], '3/2 a + b', { answer: true })] },
      ],
    })
}

{
  // Your Turn Q2 (Level 8-9): rhombus ABCD, AB = 2a, BC = b; DC : CF = 5 : 3; E the midpoint of AD.
  const A: Pt = [0, 3], B: Pt = [3, 3], C: Pt = [3, 0], D: Pt = [0, 0], F: Pt = [4.8, 0]
  const pts = { A, B, C, D, E: mid(A, D), F }
  const base: Shape = { pts, arrows: [['AB', '2a'], ['BC', 'b']], lines: ['CD', 'DA', 'CF'], dots: ['E'] }
  ask(routes, 'ABCD is a rhombus. AB = 2a and BC = b. CF carries DC on, with DC : CF = 5 : 3. E is the midpoint of AD. Find EF.', 'Higher T8 Your Turn Q2 (Level 8-9)', shape(base, 'A rhombus ABCD: AB is 2a along the top and BC is b down the side. DC carries on past C to F. E is halfway down AD.'),
    choose('16/5 a + 1/2 b', ['16/5 a − 1/2 b', 'E to D goes down, the same way as b, so it is +½b.'], ['6/5 a + 1/2 b', 'E to F goes along all of DC first, then CF: 2a + 6/5 a.'], ['10/3 a + 1/2 b', 'CF is 3 parts to DC’s 5, so CF is 3/5 of DC, not 2/3 of it.']),
    '16/5 a + 1/2 b', 'Go E to D, then D to C, then C to F.', {
      kind: 'step-worked', start: 'AB = 2a, BC = b', steps: [
        { title: 'E to D', why: 'Opposite sides of a rhombus are parallel and equal, so AD is the same as BC. E is halfway down it.', lines: [line([part('ED')], '½b', { eq: true })] },
        { title: 'D to F', why: 'DC is the same as AB. CF is three fifths of DC, since CF is three parts to DC’s five.', lines: [line([part('DC')], '2a', { eq: true }), line([part('CF'), sign('='), part('⅗ × 2a')], '6/5 a')] },
        { title: 'Add the route', why: 'Add the three parts, putting the a parts together.', lines: [line([part('EF'), sign('='), part('½b + 2a + 6/5 a')], '16/5 a + 1/2 b', { answer: true })] },
      ],
    })
}

{
  // Your Turn Q4 (Level 8-9): a regular hexagon ABCDEF with centre O, A at the top; OB = a, DE = b.
  const at = (deg: number): Pt => [2.4 * Math.cos(deg * Math.PI / 180), 2.4 * Math.sin(deg * Math.PI / 180)]
  const pts = { A: at(90), B: at(30), C: at(-30), D: at(-90), E: at(-150), F: at(150), O: [0, 0] as Pt }
  const base: Shape = { pts, lines: ['AB', 'BC', 'CD', 'EF', 'FA'], arrows: [['OB', 'a'], ['DE', 'b']], dots: ['O'] }
  ask(routes, 'ABCDEF is a regular hexagon with centre O. OB = a and DE = b. Find AC in terms of a and b.', 'Higher T8 Your Turn Q4 (Level 8-9)', shape(base, 'A regular hexagon ABCDEF, A at the top, with centre O. OB is a, from the centre to B, and DE is b, along the bottom left side.'),
    choose('−a − 2b', ['a − 2b', 'A to O is against OA, which is a + b. Both parts turn negative.'], ['a + 2b', 'That is CA, the other way. A to C goes down, against both arrows.'], ['−a − b', 'That is AO only. Carry on from O to C, which is −b.']),
    '−a − 2b', 'A regular hexagon is six equilateral triangles. Find OA and OC first.', {
      kind: 'step-worked', start: 'OB = a, DE = b', steps: [
        { title: 'Find OF', why: 'O, D, E and F make a rhombus, so DE and OF are parallel and equal.', lines: [line([part('OF')], 'b', { eq: true })] },
        { title: 'Find OA', why: 'O, B, A and F make a rhombus too, so OA is OB and OF added.', lines: [line([part('OA')], 'a + b', { eq: true })] },
        { title: 'Find OC', why: 'C is straight across the centre from F, so OC is minus OF.', lines: [line([part('OC')], '−b', { eq: true })] },
        { title: 'A to C', why: 'Go from A back to O, then out to C.', lines: [line([part('AC'), sign('='), part('−(a + b)'), sign('+'), part('(−b)')], '−a − 2b', { answer: true })] },
      ],
    })
}

/* ---------- Rung 3: ratios and parallel lines (Level 8-9) ---------- */

add(proof, 'Ratios and proof', 'Higher T8 Vectors', text(
  'A point on a line splits it in a ratio. If BD : DC = 1 : 3, D is 1/4 of the way from B to C, so BD = 1/4 BC.',
  'Find the whole line as a vector first, then take the fraction of it.',
  'To show two lines are parallel, write one as a number times the other: if EB = a + 2b and DC = 2a + 4b = 2(a + 2b), they are parallel.',
))

{
  // The Example: AB = 3a, AC = 4b, BD : DC = 1 : 3.
  const A: Pt = [0, 0], B: Pt = [1.6, 4], C: Pt = [7, 1.6]
  const pts = { A, B, C, D: along(B, C, 0.25) }
  const base: Shape = { pts, arrows: [['AB', '3a'], ['AC', '4b']], lines: ['BC'], dots: ['D'] }
  worked(proof, 'AB = 3a and AC = 4b. D lies on BC with BD : DC = 1 : 3. Find AD in terms of a and b.', 'A point in a ratio', 'Higher T8 Example: Involving Ratios (p238)', boardModel([], [
    { title: 'Plan the route', say: 'A to D: go A to B, then B to D. We know AB, so find BD.', rows: ['AD = AB + BD'], picture: shape({ ...base, lit: ['AB', 'BD'] }, 'The route A to B to D.') },
    { title: 'Find BC', say: 'B to C: back down to A, then out to C.', rows: ['BC = −AB + AC = −3a + 4b'], picture: shape({ ...base, lit: ['BA', 'AC'] }, 'The route B to A to C.') },
    { title: 'A quarter of BC', say: '1 : 3 is 4 parts, so D is 1/4 of the way along BC.', rows: ['BD = {1|4}(−3a + 4b)', 'BD = − {3|4}a + b'], picture: shape({ ...base, lit: ['BD'] }, 'BD, a quarter of BC.') },
    { title: 'Add AB', say: 'Put the a parts together.', rows: ['AD = 3a − {3|4}a + b', '! AD = {9|4}a + b'], picture: shape({ ...base, found: ['AD'] }, 'AD found.', 'AD = 9/4 a + b') },
  ], 'Find AD', shape(base, 'A triangle ABC: AB is 3a and AC is 4b. D is on BC, a quarter of the way from B to C.')), 'For a point on a line in a ratio: find the whole line as a vector, take the fraction, then add the route to it.')
}

{
  // Your Turn Q3 (Level 8-9): AB = a, AC = 2b; BD : DC = 3 : 2; AE : ED = 1 : 2.
  const A: Pt = [0, 0], B: Pt = [1.4, 4], C: Pt = [7, 0]
  const D = along(B, C, 0.6)
  const pts = { A, B, C, D, E: along(A, D, 1 / 3) }
  ask(proof, 'AB = a and AC = 2b. D is on BC with BD : DC = 3 : 2. E is on AD with AE : ED = 1 : 2. Find AE.', 'Higher T8 Your Turn Q3 (Level 8-9)', shape({ pts, arrows: [['AB', 'a'], ['AC', '2b']], lines: ['BC', 'AD'], dots: ['D', 'E'] }, 'A triangle ABC: AB is a and AC is 2b. D is on BC, three fifths of the way from B. E is on AD, a third of the way from A.'),
    choose('2/15 a + 2/5 b', ['2/5 a + 6/5 b', 'That is all of AD. AE is only a third of it.'], ['1/5 a + 2/5 b', 'AD = a + 3/5(−a + 2b): the a parts make 2/5 a, and a third of that is 2/15 a.'], ['−1/5 a + 2/5 b', 'BD is 3/5 of BC, which is −3/5 a + 6/5 b. Add AB, which is +a.']),
    '2/15 a + 2/5 b', 'Find BC, then BD, then AD, then a third of AD.', {
      kind: 'step-worked', start: 'AB = a, AC = 2b', steps: [
        { title: 'Find BC', why: 'Go from B back to A, then out to C.', lines: [line([part('BC'), sign('='), part('−a'), sign('+'), part('2b')], '−a + 2b')] },
        { title: 'Find BD', why: 'Three to two is five parts, so D is three fifths of the way along BC.', lines: [line([part('BD'), sign('='), part('⅗(−a + 2b)')], '−3/5 a + 6/5 b')] },
        { title: 'Find AD', why: 'Go A to B, then B to D, and put the a parts together.', lines: [line([part('AD'), sign('='), part('a + (−3/5 a + 6/5 b)')], '2/5 a + 6/5 b')] },
        { title: 'A third of AD', why: 'One to two is three parts, so E is a third of the way from A to D.', lines: [line([part('AE'), sign('='), part('⅓(2/5 a + 6/5 b)')], '2/15 a + 2/5 b', { answer: true })] },
      ],
    })
}

{
  // Your Turn Q5 (Level 8-9): AE = 3a − 2b, DC = 2a + 4b; E and B the midpoints of AD and AC.
  const A: Pt = [1.2, 4], D: Pt = [0, 0], C: Pt = [6.4, 0]
  const pts = { A, D, C, E: mid(A, D), B: mid(A, C) }
  const base: Shape = { pts, arrows: [['AE', '3a − 2b'], ['DC', '2a + 4b']], lines: ['ED', 'AC', 'EB'], dots: ['E', 'B'] }
  ask(proof, 'AE = 3a − 2b and DC = 2a + 4b. E and B are the midpoints of AD and AC. Find EB in terms of a and b.', 'Higher T8 Your Turn Q5 (Level 8-9)', shape(base, 'A triangle ADC with A at the top. AE is 3a − 2b, halfway down AD, and DC is 2a + 4b along the bottom. B is halfway along AC, and EB joins the two midpoints.'),
    choose('a + 2b', ['2a + 4b', 'That is DC. EB joins the midpoints, so it is half as long.'], ['5a + 2b', 'E to A is against AE: −3a + 2b, not +3a − 2b.'], ['−a − 2b', 'That is BE, the other way.']),
    'a + 2b', 'Find AC first: A to D, then D to C. Then EB is E to A, then A to B.', {
      kind: 'step-worked', start: 'AE = 3a − 2b, DC = 2a + 4b', steps: [
        { title: 'Find AC', why: 'E is the midpoint, so AD is twice AE. Then add DC.', lines: [line([part('AC'), sign('='), part('2(3a − 2b) + 2a + 4b')], '8a')] },
        { title: 'Half of AC', why: 'B is the midpoint of AC.', lines: [line([part('AB')], '4a', { eq: true })] },
        { title: 'E to B', why: 'Go from E back to A, against AE, then A to B.', lines: [line([part('EB'), sign('='), part('−3a + 2b'), sign('+'), part('4a')], 'a + 2b', { answer: true })] },
      ],
    })
  ask(proof, 'EB = a + 2b and DC = 2a + 4b. Is EB parallel to DC?', 'Higher T8 Your Turn Q5 (Level 8-9)', shape({ ...base, lit: ['EB'] }, 'The same triangle with EB, joining the midpoints, drawn in.'),
    choose('Yes: DC = 2(a + 2b)', ['No: the numbers are different', 'Different numbers can still be parallel. Look for one vector as a multiple of the other.'], ['Yes: they both have a and b', 'Every vector here has a and b in it. Parallel needs one to be a number times the other.'], ['No: DC is longer', 'Parallel lines can be different lengths.']),
    'Yes: DC = 2(a + 2b)', 'Is DC a number times EB?', {
      kind: 'step-worked', start: 'EB = a + 2b, DC = 2a + 4b', steps: [
        { title: 'Take out 2', why: 'Two goes into both parts of DC.', lines: [line([part('2a + 4b')], '2(a + 2b)', { eq: true })] },
        { title: 'A multiple is parallel', why: 'DC is twice EB, so EB is parallel to DC, and half as long.', words: 'Yes: DC = 2(a + 2b)' },
      ],
    })
}

add('mixed', 'Vectors', 'Higher T8 consolidation', text(
  'Follow the arrows: going against one makes it negative.',
  'Any route from the start to the end gives the same vector.',
  'For a point in a ratio, find the whole line, then take the fraction of it.',
  'Parallel: one vector is a number times the other.',
))

export const tutorVectorsHigherLesson: TutorMethodLesson = {
  id: 'L221H', number: 221.5, title: 'Vectors', level: 'GCSE Higher',
  steadyPictures: true,
  largePictures: true,
  goal: 'Add, subtract and multiply vectors, find routes round a shape and points in a ratio, and show that two lines are parallel.',
  labels: { [rules]: 'The rules', [routes]: 'Routes round a shape', [proof]: 'Ratios and parallel lines', mixed: 'Review' },
  states: finish(),
}

import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigurePoint, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, number, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { fig, screens, slips } from '../../geometry/tutor/figureLesson'

/*
 * Geometry lesson 11: Similar shapes. From GM11 in Sunny's revision book (p136–137), with our own numbers except where
 * a question is the book's own. Four rungs: the scale factor (big ÷ small, from two matching lengths); a missing length
 * on the bigger shape (times the scale factor, Example 1); a missing length on the smaller shape (divide, Your Turn
 * Q2); and one triangle inside another (Example 2 and Your Turn Q3), where a side is made of two parts that have to be
 * added first. Built like lessons 1 to 10: the first rung opens on the measuring board, where you drag an enlargement
 * bigger and smaller and every length is the scale factor times the original.
 *
 * Hidden on live like lessons 1 to 10: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(211)
const { add, finish } = lesson
const { explore, worked, practice } = screens(lesson)
const factor = 'geometry-scale-factor'
const bigger = 'geometry-similar-bigger'
const smaller = 'geometry-similar-smaller'
const nested = 'geometry-similar-nested'

const LEN = { label: 'Length (cm)', prefix: 'x =' }

/* ---------- Pictures ---------- */

type Side = { label: string; tone?: FigureTone; lit?: boolean }
/**
 * A triangle with its base and left side labelled, drawn `size` across with its bottom-left corner at `at`; its name
 * in the middle. Every triangle in the lesson is the same shape, so two of them look similar.
 */
function tri(at: FigurePoint, size: number, name: string, base: Side, left: Side): FigureItem[] {
  const [x, y] = at
  const A: FigurePoint = [x, y], B: FigurePoint = [x + size, y], C: FigurePoint = [x + 0.32 * size, y + 0.62 * size]
  // The name sits above the top corner, where even a small triangle has room for it.
  const items: FigureItem[] = [{ kind: 'shape', points: [A, B, C] }, { kind: 'text', at: C, text: name, name: true, dy: -14 }]
  if (base.lit) items.push({ kind: 'line', from: A, to: B, style: 'lit' })
  if (left.lit) items.push({ kind: 'line', from: A, to: C, style: 'lit' })
  if (base.label) items.push({ kind: 'text', at: [x + size / 2, y], text: base.label, tone: base.tone ?? (base.lit ? 'lit' : 'given'), dy: 16 })
  if (left.label) items.push({ kind: 'text', at: [x + 0.16 * size, y + 0.31 * size], text: left.label, tone: left.tone ?? (left.lit ? 'lit' : 'given'), dx: -12 - left.label.length * 4 })
  return items
}
/** Two similar triangles side by side: A of size `a` and B of size `b`, with a gap between. */
function pair(a: number, b: number, sides: { aBase: Side; aLeft: Side; bBase: Side; bLeft: Side }, caption?: string): AngleFrame {
  const gap = Math.max(a, b) * 0.45
  return fig([...tri([0, 0], a, 'A', sides.aBase, sides.aLeft), ...tri([a + gap, 0], b, 'B', sides.bBase, sides.bLeft)],
    `Two similar triangles. Triangle A has base ${sides.aBase.label} and side ${sides.aLeft.label}; triangle B has base ${sides.bBase.label} and side ${sides.bLeft.label}.`, caption, 24)
}
const s = (label: string, extra: Partial<Side> = {}): Side => ({ label, ...extra })

/* ---------- Rung 1: the scale factor ---------- */

explore(factor, 'Drag the corner of the copy. Watch every length change.', 'GM11 p136 Finding the scale factor (play)', { mode: 'enlarge' })
{
  const p = pair(4, 12, { aBase: s('4 cm'), aLeft: s(''), bBase: s('12 cm'), bLeft: s('') })
  worked(factor, 'A and B are similar. Find the scale factor from A to B.', 'The scale factor', 'GM11 p136 Finding the scale factor (own numbers)', boardModel([], [
    { title: 'Match two lengths', say: 'Find a pair of sides in the same place on both shapes: the two bases.', rows: ['>0 A: 4 cm, B: 12 cm'], picture: pair(4, 12, { aBase: s('4 cm', { lit: true }), aLeft: s(''), bBase: s('12 cm', { lit: true }), bLeft: s('') }) },
    { title: 'Divide big by small', say: 'How many times bigger is B? Divide the bigger length by the smaller.', rows: ['12 ÷ 4 = 3', '! Scale factor = 3'], picture: pair(4, 12, { aBase: s('4 cm'), aLeft: s(''), bBase: s('12 cm'), bLeft: s('') }, 'Every length in B is 3 times A’s') },
  ], 'Scale factor', p), 'Similar shapes have equal angles, but one is an enlargement of the other. The scale factor is how many times bigger: bigger length ÷ matching smaller length.')
}
for (const [a, b, right, slipList] of [
  [5, 20, 4, [[15, 'That’s how much longer, 20 − 5. The scale factor divides: 20 ÷ 5.'], [0.25, 'That’s 5 ÷ 20. From A to B it gets bigger: divide the big length by the small one.']]],
  [8, 12, 1.5, [[4, 'That’s 12 − 8. Divide: 12 ÷ 8.'], [0.67, 'Divide the bigger by the smaller: 12 ÷ 8.']]],
] as [number, number, number, [number, string][]][]) {
  const p = pair(a, b, { aBase: s(`${a} cm`), aLeft: s(''), bBase: s(`${b} cm`), bLeft: s('') })
  practice(factor, 'A and B are similar. Find the scale factor from A to B.', 'GM11 p136 (own numbers)', p, number(right, String(right)), 'Divide B’s base by A’s.', boardModel([], [
    { title: 'Match two lengths', say: 'The two bases are in the same place.', rows: [`>0 A: ${a} cm, B: ${b} cm`], picture: pair(a, b, { aBase: s(`${a} cm`, { lit: true }), aLeft: s(''), bBase: s(`${b} cm`, { lit: true }), bLeft: s('') }) },
    { title: 'Divide big by small', say: 'How many times does the small one go into the big one?', rows: [`${b} ÷ ${a} = ${right}`, `! Scale factor = ${right}`], picture: p },
  ], 'Scale factor', p), slips(right, slipList), { label: 'Scale factor', prefix: 'SF =' })
}

/* ---------- Rungs 2 and 3: a missing length ---------- */

/** A missing length found with the scale factor: times it to go to the bigger shape, divide to go to the smaller. */
function missing(a: [number, number], bBase: number) {
  // a: A's base and side; bBase: B's base (its side is x). Either A or B is the bigger.
  const [aBase, aSide] = a
  const up = bBase > aBase, sf = up ? bBase / aBase : aBase / bBase
  const x = Number((up ? aSide * sf : aSide / sf).toFixed(2))
  const draw = (lit: 'bases' | 'sides' | null, found = false) => pair(aBase, bBase, {
    aBase: s(`${aBase} cm`, { lit: lit === 'bases' }), aLeft: s(`${aSide} cm`, { lit: lit === 'sides' }),
    bBase: s(`${bBase} cm`, { lit: lit === 'bases' }), bLeft: found ? s(`${x} cm`, { tone: 'found' }) : s('x', { tone: 'x', lit: lit === 'sides' }),
  }, found ? `x = ${x} cm` : undefined)
  const moves = [
    { title: 'The scale factor', say: up ? `B is the bigger one. Its base over A’s base: ${bBase} ÷ ${aBase}.` : `A is the bigger one. Its base over B’s: ${aBase} ÷ ${bBase}.`, rows: [up ? `SF = ${bBase} ÷ ${aBase} = ${sf}` : `SF = ${aBase} ÷ ${bBase} = ${sf}`], picture: draw('bases') },
    { title: up ? 'Times it' : 'Divide by it', say: up ? `x is on the bigger shape, so times the matching side, ${aSide}, by ${sf}.` : `x is on the smaller shape, so divide the matching side, ${aSide}, by ${sf}.`, rows: [up ? `x = ${aSide} × ${sf}` : `x = ${aSide} ÷ ${sf}`, `! x = ${x} cm`], picture: draw('sides', true) },
  ]
  return { x, sf, p: draw(null), moves }
}
{
  const m = missing([4, 3], 10)
  worked(bigger, 'A and B are similar. Find the length x.', 'Lengths on the bigger shape', 'GM11 p136 Example 1 (own numbers)', boardModel([], m.moves, 'Find x', m.p),
    'First the scale factor from two matching sides you know. Then, to find a side on the bigger shape, times its match on the smaller one by the scale factor.')
}
for (const [a, b] of [[[6, 4], 9], [[2.5, 4], 10]] as [[number, number], number][]) {
  const m = missing(a, b)
  practice(bigger, 'A and B are similar. Find the length x.', 'GM11 p136 (own numbers)', m.p, number(m.x, `${m.x} cm`), 'Scale factor from the bases, then times the side.', boardModel([], m.moves, 'Find x', m.p),
    slips(m.x, [[a[1] + (b - a[0]), `That adds ${b - a[0]}, as the base grew. Similar shapes multiply: every side is ${m.sf} times bigger.`], [Number((a[1] / m.sf).toFixed(2)), 'x is on the bigger shape. Times by the scale factor.']]), LEN)
}
{
  const m = missing([18, 12], 6)
  worked(smaller, 'A and B are similar. Find the length x.', 'Lengths on the smaller shape', 'GM11 Your Turn Q2 (own numbers)', boardModel([], m.moves, 'Find x', m.p),
    'Going to the smaller shape, divide by the scale factor instead. Check: the answer should be smaller than its match.')
}
for (const [a, b] of [[[20, 14], 8], [[51, 42], 17]] as [[number, number], number][]) {
  const m = missing(a, b)
  practice(smaller, 'A and B are similar. Find the length x.', 'GM11 Your Turn Q2 (own numbers)', m.p, number(m.x, `${m.x} cm`), 'Scale factor from the bases, then divide the side.', boardModel([], m.moves, 'Find x', m.p),
    slips(m.x, [[Number((a[1] * m.sf).toFixed(2)), 'x is on the smaller shape. Divide by the scale factor.'], [a[1] - (a[0] - b), `That takes away ${a[0] - b}. Similar shapes divide: B is ${m.sf} times smaller.`]]), LEN)
}

/* ---------- Rung 4: one triangle inside another ---------- */

/**
 * Triangle ABC with D on AB and E on AC, DE parallel to BC (GM11 Example 2). AD and DB are labelled along AB, DE and
 * BC across.
 */
function nest(ad: number, db: number, de: string, bc: string, lit?: 'ab' | 'across', found?: string, caption?: string): AngleFrame {
  const t = ad / (ad + db)
  const A: FigurePoint = [0, 0], B: FigurePoint = [5, 6], C: FigurePoint = [10, 0]
  const D: FigurePoint = [B[0] * t, B[1] * t], E: FigurePoint = [C[0] * t, C[1] * t]
  const items: FigureItem[] = [
    { kind: 'shape', points: [A, B, C] }, { kind: 'shape', points: [A, D, E], fill: 'part' },
    { kind: 'line', from: D, to: E, style: lit === 'across' ? 'lit' : 'plain' },
    ...(lit === 'ab' ? [{ kind: 'line' as const, from: A, to: B, style: 'lit' as const }] : []),
    ...(lit === 'across' ? [{ kind: 'line' as const, from: B, to: C, style: 'lit' as const }] : []),
    { kind: 'point', at: A, label: 'A', dx: -16, dy: 4 }, { kind: 'point', at: B, label: 'B', dx: -4, dy: -12 }, { kind: 'point', at: C, label: 'C', dx: 8, dy: 4 },
    { kind: 'point', at: D, label: 'D', dx: -18, dy: -4 }, { kind: 'point', at: E, label: 'E', dx: 2, dy: 18 },
    { kind: 'text', at: [D[0] / 2, D[1] / 2], text: `${ad} cm`, dx: -30 },
    { kind: 'text', at: [(D[0] + B[0]) / 2, (D[1] + B[1]) / 2], text: `${db} cm`, dx: -30 },
    { kind: 'text', at: [(D[0] + E[0]) / 2, (D[1] + E[1]) / 2], text: de, dx: 22, dy: -6 },
    { kind: 'text', at: [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2], text: found ?? bc, tone: found ? 'found' : bc === 'x' ? 'x' : 'given', dx: 26 },
  ]
  return fig(items, `Triangle ABC with a smaller triangle ADE inside it; DE is parallel to BC. AD is ${ad} cm and DB is ${db} cm; DE is ${de} and BC is ${bc}.`, caption, 30)
}
{
  const p = nest(4, 6, '3 cm', 'x')
  worked(nested, 'ADE and ABC are similar. Find the length x.', 'One triangle inside another', 'GM11 p136 Example 2 (own numbers)', boardModel([], [
    { title: 'The whole side', say: 'The big triangle’s side AB is both parts: AD and DB.', rows: ['AB = 4 + 6 = 10 cm'], picture: nest(4, 6, '3 cm', 'x', 'ab') },
    { title: 'The scale factor', say: 'AB on the big triangle matches AD on the small one.', rows: ['SF = 10 ÷ 4 = 2.5'], picture: nest(4, 6, '3 cm', 'x', 'ab') },
    { title: 'Times it', say: 'BC matches DE: times DE by 2.5.', rows: ['x = 3 × 2.5', '! x = 7.5 cm'], picture: nest(4, 6, '3 cm', 'x', 'across', '7.5 cm', 'x = 7.5 cm') },
  ], 'Find x', p), 'When one triangle sits inside the other, the big triangle’s side is made of two parts. Add them before you divide: AD matches AB, not DB.')
}
for (const [ad, db, de, right] of [[5, 3, 10, 16], [3, 3, 4.4, 8.8]] as const) {
  const ab = ad + db, sf = ab / ad
  const p = nest(ad, db, `${de} cm`, 'x')
  practice(nested, 'ADE and ABC are similar. Find the length x.', ad === 3 ? 'GM11 Your Turn Q3 (book’s numbers)' : 'GM11 p136 (own numbers)', p, number(right, `${right} cm`), 'Add AD and DB to get AB first.', boardModel([], [
    { title: 'The whole side', say: 'AB is AD and DB together.', rows: [`AB = ${ad} + ${db} = ${ab} cm`], picture: nest(ad, db, `${de} cm`, 'x', 'ab') },
    { title: 'The scale factor', say: 'AB matches AD.', rows: [`SF = ${ab} ÷ ${ad} = ${sf}`], picture: nest(ad, db, `${de} cm`, 'x', 'ab') },
    { title: 'Times it', say: `BC matches DE: ${de} × ${sf}.`, rows: [`x = ${de} × ${sf}`, `! x = ${right} cm`], picture: nest(ad, db, `${de} cm`, 'x', 'across', `${right} cm`, `x = ${right} cm`) },
  ], 'Find x', p), slips(right, [[Number((de * db / ad).toFixed(2)), `AB is the whole side, ${ad} + ${db} = ${ab}. The scale factor is AB ÷ AD.`], [Number((de + db).toFixed(2)), 'Similar shapes multiply. Find the scale factor AB ÷ AD.']]), LEN)
}

add('mixed', 'Similar shapes', 'GM11 consolidation', text(
  'Similar shapes: equal angles, every length multiplied by the scale factor.',
  'Scale factor = bigger length ÷ matching smaller length.',
  'To the bigger shape, times by it. To the smaller shape, divide.',
  'A triangle inside a triangle: add the two parts of the side first.',
))

export const tutorSimilarityLesson: TutorMethodLesson = {
  id: 'L211', number: 211, title: 'Similar shapes', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Find the scale factor between similar shapes, and use it to find missing lengths.',
  labels: { [factor]: 'The scale factor', [bigger]: 'On the bigger shape', [smaller]: 'On the smaller shape', [nested]: 'Triangles inside triangles', mixed: 'Review' },
  states: finish(),
}

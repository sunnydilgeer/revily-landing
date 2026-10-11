import { author } from '../../written-methods/tutor/content'
import type { AngleFrame, FigureItem, FigureTone } from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { boardModel, choose, pair, readNumbers, text } from '../../simultaneous-equations/tutor/boardWorkings'
import { fig, screens } from '../../geometry/tutor/figureLesson'

/*
 * Geometry lesson 21: Column vectors. From T3 in Sunny's revision book (p161), with our own numbers except where a
 * question is the book's. A vector is an arrow: its length and its direction. A column vector splits it into across
 * (x, on top) and up (y, underneath), negative for left or down. Four rungs: reading a vector off squared paper (the
 * book's 3 right and 2 up); adding and subtracting, one part at a time (the book's examples); multiplying by a number
 * (5 × and 12 ×); and putting them together, multiplying first, as in all three of the Your Turn questions. Built like
 * lessons 1 to 20: the first rung opens on the measuring board's translate screen, where you slide a copy across the
 * paper and the column vector under it says how far it moved. Answers go in two boxes, top number then bottom.
 *
 * Hidden on live like lessons 1 to 20: only the unlisted Geometry shelf (src/features/geometry/geometryLessons.ts)
 * opens it.
 */

const lesson = author(221)
const { add, finish } = lesson
const { explore, worked, practice } = screens(lesson)
const reading = 'geometry-vector-read'
const adding = 'geometry-vector-add'
const multiplying = 'geometry-vector-multiply'
const combining = 'geometry-vector-combine'

type V = [number, number]
/** A number as the board writes it: −3, not -3. */
const n = (x: number) => x < 0 ? `−${-x}` : String(x)
/** A column vector as a board token: ({3|−2}). */
const col = (v: V | [string, string]) => `({${typeof v[0] === 'number' ? n(v[0]) : v[0]}|${typeof v[1] === 'number' ? n(v[1] as number) : v[1]}})`
/** A number inside a sum: −4 in brackets, so 2 − (−4) reads clearly. */
const br = (x: number) => x < 0 ? `(${n(x)})` : n(x)
const shown = (v: V) => `(${n(v[0])}, ${n(v[1])})`
const vector = (v: V) => pair(['x', 'y'], v, shown(v))

/**
 * Slip messages for a column vector: the numbers swapped, a sign lost, or one of `list`'s own. Both boxes are read in
 * order, top then bottom.
 */
function vectorSlips(right: V, list: [V, string][] = []) {
  const all: [V, string][] = [...list,
    [[right[1], right[0]], 'Across goes on top, up or down underneath.'],
    [[-right[0], right[1]], 'Check the top number’s sign: right is positive, left is negative.'],
    [[right[0], -right[1]], 'Check the bottom number’s sign: up is positive, down is negative.']]
  return (response: string) => {
    const got = readNumbers(response)
    if (got.length !== 2 || (got[0] === right[0] && got[1] === right[1])) return null
    return all.find(([w]) => w[0] === got[0] && w[1] === got[1] && !(w[0] === right[0] && w[1] === right[1]))?.[1] ?? null
  }
}

/* ---------- Pictures ---------- */

/** `side`: 1 puts the label on the arrow's left (the default), −1 on its right. */
type Arrow = { from: V; v: V; label?: string; style?: 'plain' | 'lit' | 'found' | 'dashed'; tone?: FigureTone; side?: 1 | -1 }
/**
 * Arrows, each from its own start, labelled to its left; on squared paper from `grid` (low and high corners) when
 * given. `legs` draws the first arrow's across and up as dashed lines with their counts.
 */
function vecFig(arrows: Arrow[], spoken: string, o: { grid?: [V, V]; legs?: [string?, string?]; caption?: string } = {}): AngleFrame {
  const items: FigureItem[] = []
  if (o.grid) items.push({ kind: 'grid', from: o.grid[0], to: o.grid[1] })
  if (o.legs) {
    const { from: s, v } = arrows[0], corner: V = [s[0] + v[0], s[1]], end: V = [s[0] + v[0], s[1] + v[1]]
    items.push({ kind: 'line', from: s, to: corner, style: 'dashed' }, { kind: 'line', from: corner, to: end, style: 'dashed' })
    if (o.legs[0]) items.push({ kind: 'text', at: [(s[0] + corner[0]) / 2, s[1]], text: o.legs[0], tone: 'lit', dy: v[1] > 0 ? 20 : -16 })
    if (o.legs[1]) items.push({ kind: 'text', at: [corner[0], (s[1] + end[1]) / 2], text: o.legs[1], tone: 'lit', dx: v[0] > 0 ? 22 : -22 })
  }
  arrows.forEach((a, i) => {
    // The first arrow's label goes on the side away from its dashed across and up.
    const side = a.side ?? (o.legs && i === 0 && -a.v[0] * a.v[1] > 0 ? -1 : 1)
    const to: V = [a.from[0] + a.v[0], a.from[1] + a.v[1]]
    items.push({ kind: 'line', from: a.from, to, style: a.style ?? 'plain', arrow: true })
    if (a.label) {
      // Far enough out that the label's box, its width across and its height up, clears the arrow.
      const len = Math.hypot(a.v[0], a.v[1]), nx = -a.v[1] / len * side, ny = a.v[0] / len * side
      const boxed = a.tone === 'found' || a.tone === 'lit', d = 8 + Math.abs(nx) * (a.label.length * (boxed ? 4.5 : 3.5) + (boxed ? 7 : 2)) + Math.abs(ny) * (boxed ? 14 : 9)
      items.push({ kind: 'text', at: [(a.from[0] + to[0]) / 2, (a.from[1] + to[1]) / 2], text: a.label, tone: a.tone ?? 'given', dx: nx * d, dy: -ny * d })
    }
  })
  return fig(items, spoken, o.caption)
}
/** Arrows nose to tail from (0, 0): each vector `count` times, then the result from the start to the end, dashed. */
function chain(parts: [V, number, string][], result: { label: string; tone?: FigureTone; style?: Arrow['style'] } | null, spoken: string, caption?: string, grid?: [V, V]): AngleFrame {
  const arrows: Arrow[] = []
  let at: V = [0, 0]
  for (const [v, count, label] of parts) for (let k = 0; k < count; k++) {
    arrows.push({ from: at, v, label: k === 0 ? label : undefined })
    at = [at[0] + v[0], at[1] + v[1]]
  }
  // Each arrow's label goes on the outside of the path, away from the middle of all its corners.
  const corners = [...arrows.map(a => a.from), at], c: V = [corners.reduce((t, q) => t + q[0], 0) / corners.length, corners.reduce((t, q) => t + q[1], 0) / corners.length]
  for (const a of arrows) a.side = -a.v[1] * (a.from[0] + a.v[0] / 2 - c[0]) + a.v[0] * (a.from[1] + a.v[1] / 2 - c[1]) >= 0 ? 1 : -1
  // The result's label goes on the side away from the arrows it adds up: they bend round one side of it.
  if (result) {
    const bend = arrows.reduce((t, a) => t + at[0] * a.from[1] - at[1] * a.from[0], 0)
    arrows.push({ from: [0, 0], v: at, label: result.label, tone: result.tone, style: result.style ?? 'dashed', side: bend > 0 ? -1 : 1 })
  }
  return vecFig(arrows, spoken, { caption, grid })
}

/* ---------- Rung 1: reading a vector ---------- */

explore(reading, 'Slide the copy across the paper. Watch its column vector.', 'T3 p161 Column Vectors (play)', { mode: 'translate' })
{
  const g: [V, V] = [[-1, -1], [5, 4]]
  const a = (style: Arrow['style'] = 'plain', legs?: [string?, string?], caption?: string) => vecFig([{ from: [0, 0], v: [3, 2], label: 'a', style }], 'An arrow a on squared paper, going 3 squares right and 2 squares up.', { grid: g, legs, caption })
  const p = a()
  worked(reading, 'Write the vector a as a column vector.', 'Column vectors', 'T3 p161 Column Vectors (book’s numbers)', boardModel([], [
    { title: 'Across first', say: 'Start at the tail of the arrow. Count squares across to the right: 3. That’s the top number, x.', rows: ['>0 3 squares right: top number 3'], picture: a('plain', ['3']) },
    { title: 'Then up', say: 'Now count up to the arrow’s tip: 2. That’s the bottom number, y.', rows: ['>0 2 squares up: bottom number 2'], picture: a('plain', ['3', '2']) },
    { title: 'Write the column', say: 'x on top, y underneath, in tall brackets.', rows: ['! a = ({3|2})'], picture: a('found', ['3', '2'], 'a = (3 over 2)') },
  ], 'Vector a', p), 'A vector has a size and a direction. It’s drawn as an arrow. A column vector writes it as two numbers: across on top, up underneath. Left and down are negative.')
}
for (const [from, v, g, ref] of [
  [[0, 3], [4, -3], [[-1, -1], [5, 4]], 'T3 p161 (own numbers)'],
  [[3, 0], [-2, 5], [[-1, -1], [4, 6]], 'T3 p161 (own numbers)'],
] as [V, V, [V, V], string][]) {
  const across = `${Math.abs(v[0])} ${v[0] > 0 ? 'right' : 'left'}`, up = `${Math.abs(v[1])} ${v[1] > 0 ? 'up' : 'down'}`
  const b = (style: Arrow['style'] = 'plain', legs?: [string?, string?], caption?: string) => vecFig([{ from, v, label: 'b', style }], `An arrow b on squared paper, going ${across} and ${up}.`, { grid: g, legs, caption })
  const p = b()
  practice(reading, 'Write the vector b as a column vector.', ref, p, vector(v), 'Count across from the tail first, then up or down to the tip.', boardModel([], [
    { title: 'Across, then up', say: `From the tail: ${across}, so the top is ${n(v[0])}. Then ${up}, so the bottom is ${n(v[1])}.`, rows: [`>0 ${across}: top ${n(v[0])}`, `>0 ${up}: bottom ${n(v[1])}`], picture: b('lit', [String(Math.abs(v[0])), String(Math.abs(v[1]))]) },
    { title: 'Write the column', say: 'Across on top, up underneath.', rows: [`! b = ${col(v)}`], picture: b('found', [String(Math.abs(v[0])), String(Math.abs(v[1]))], `b = ${shown(v)}`) },
  ], 'Vector b', p), vectorSlips(v))
}

/* ---------- Rung 2: adding and subtracting ---------- */

{
  const moves = vecFig([{ from: [0, 0], v: [3, 0], label: '3 right' }, { from: [3, 0], v: [2, 1], label: '2 right, 1 up' }], 'Walk 3 squares right, then 2 right and 1 up.', { grid: [[-1, -1], [6, 2]] })
  practice(adding, 'Guess first: you walk 3 squares right, then 2 right and 1 up. Where do you end up from the start?', 'T3 p161 (guess first)', moves, choose('5 right, 1 up',
    ['3 right, 1 up', 'Both moves count: 3 + 2 = 5 across.'], ['2 right, 1 up', 'The first move counts too: 3 + 2 = 5 across.']),
  'Add the across moves, then the up moves.', boardModel([], [
    { title: 'Add each part', say: 'Across: 3 + 2. Up: 0 + 1. Adding vectors is adding their parts.', rows: ['({3|0}) + ({2|1}) = ({5|1})', '! 5 right, 1 up'], picture: moves },
  ], 'Guess', moves))
}

{
  // The book's example: (−3, 4) + (5, 2) = (2, 6).
  const a: V = [-3, 4], b: V = [5, 2], g: [V, V] = [[-4, -1], [3, 7]]
  const pic = (result: boolean, caption?: string) => chain([[a, 1, 'a'], [b, 1, 'b']], result ? { label: 'a + b', tone: 'found', style: 'found' } : null, 'Arrow a, then arrow b from its tip. a + b goes from the start of a to the tip of b.', caption, g)
  const p = pic(false)
  worked(adding, 'a = (−3 over 4) and b = (5 over 2). Find a + b.', 'Adding vectors', 'T3 p161 Adding Column Vectors (book’s numbers)', boardModel([], [
    { title: 'Nose to tail', say: 'Put b on the end of a. a + b is where you end up: from the start of a to the tip of b.', rows: [`a + b = ${col(a)} + ${col(b)}`], picture: p },
    { title: 'Add each part', say: 'Add the top numbers, then add the bottom numbers. They never mix.', rows: [`a + b = ${col(['−3 + 5', '4 + 2'])}`], picture: p },
    { title: 'Write the answer', say: '2 across and 6 up, the dashed arrow.', rows: [`! a + b = ${col([2, 6])}`], picture: pic(true, 'a + b = (2 over 6)') },
  ], 'a + b', p), 'To add column vectors, add the top numbers and add the bottom numbers. To subtract, subtract each part. Drawn, it’s one arrow after another.')
}
for (const [a, b, sign, g, ref] of [
  [[4, -1], [-2, 5], '+', [[-1, -2], [5, 5]], 'T3 p161 (own numbers)'],
  [[6, 3], [2, 1], '−', [[-1, -1], [7, 4]], 'T3 p161 Subtracting Column Vectors (book’s numbers)'],
  [[7, 2], [3, -4], '−', [[-1, -1], [8, 7]], 'T3 p161 (own numbers)'],
] as [V, V, '+' | '−', [V, V], string][]) {
  const s = sign === '+' ? 1 : -1, r: V = [a[0] + s * b[0], a[1] + s * b[1]]
  const second: V = [s * b[0], s * b[1]]
  const pic = (result: boolean, caption?: string) => chain([[a, 1, 'a'], [second, 1, sign === '+' ? 'b' : '−b']], result ? { label: `a ${sign} b`, tone: 'found', style: 'found' } : null, sign === '+' ? 'Arrow a, then arrow b from its tip.' : 'Arrow a, then b backwards from its tip: taking b away.', caption, g)
  const p = pic(false)
  const slipList: [V, string][] = sign === '+' ? [[[a[0] - b[0], a[1] - b[1]], 'That takes b away. Add each part.']] : [[[a[0] + b[0], a[1] + b[1]], 'That adds. Take b away from a, each part.'], [[b[0] - a[0], b[1] - a[1]], 'That’s b − a. Start with a and take b away.']]
  if (sign === '−' && b[1] < 0) slipList.push([[r[0], a[1] + b[1]], `Taking away ${n(b[1])} is the same as adding ${-b[1]}: ${a[1]} + ${-b[1]} = ${r[1]}.`])
  practice(adding, `a = ${shown(a)} and b = ${shown(b)}, as column vectors. Find a ${sign} b.`, ref, p, vector(r), sign === '+' ? 'Add the top numbers, then the bottom numbers.' : 'Take away the top numbers, then the bottom numbers.', boardModel([], [
    { title: sign === '+' ? 'Add each part' : 'Subtract each part', say: sign === '+' ? 'Top with top, bottom with bottom.' : `Top with top, bottom with bottom.${b[1] < 0 ? ` Taking away ${n(b[1])} adds ${-b[1]}.` : ''}`, rows: [`a ${sign} b = ${col(a)} ${sign} ${col(b)}`, `a ${sign} b = ${col([`${n(a[0])} ${sign} ${br(b[0])}`, `${n(a[1])} ${sign} ${br(b[1])}`])}`], picture: p },
    { title: 'Write the answer', say: `${n(r[0])} across and ${n(r[1])} up.`, rows: [`! a ${sign} b = ${col(r)}`], picture: pic(true, `a ${sign} b = ${shown(r)}`) },
  ], `a ${sign} b`, p), vectorSlips(r, slipList))
}

/* ---------- Rung 3: multiplying by a number ---------- */

{
  // The book's example: 5 × (2, −3) = (10, −15).
  const a: V = [2, -3]
  const pic = (result: boolean, caption?: string) => chain([[a, 5, 'a']], result ? { label: '5a', tone: 'found', style: 'found' } : null, 'Five copies of arrow a, nose to tail. Together they make 5a, five times as long, the same direction.', caption)
  const p = pic(false)
  worked(multiplying, 'a = (2 over −3). Find 5a.', 'Multiplying a vector', 'T3 p161 Multiplying Column Vectors (book’s numbers)', boardModel([], [
    { title: 'Times each part', say: '5a is five lots of a, one after another. Multiply the top number and the bottom number by 5.', rows: [`5a = 5 × ${col(a)}`, `5a = ${col(['5 × 2', '5 × (−3)'])}`], picture: p },
    { title: 'Work them out', say: 'A positive times a negative is negative.', rows: [`! 5a = ${col([10, -15])}`], picture: pic(true, '5a = (10 over −15)') },
  ], '5a', p), 'To multiply a column vector by a number, multiply both numbers in it. The arrow gets that many times longer and keeps its direction.')
}
for (const [a, k, ref] of [
  [[4, -2], 12, 'T3 p161 Multiplying Column Vectors (book’s numbers)'],
  [[-2, 4], 3, 'T3 p161 (own numbers)'],
] as [V, number, string][]) {
  const r: V = [k * a[0], k * a[1]]
  const pic = (result: boolean, caption?: string) => k <= 4
    ? chain([[a, k, 'a']], result ? { label: `${k}a`, tone: 'found', style: 'found' } : null, `${k} copies of arrow a, nose to tail.`, caption)
    : vecFig([{ from: [0, 0], v: a, label: 'a', style: result ? 'found' : 'plain' }], 'Arrow a.', { caption })
  const p = pic(false)
  practice(multiplying, `a = ${shown(a)}, as a column vector. Find ${k}a.`, ref, p, vector(r), `Multiply both numbers by ${k}.`, boardModel([], [
    { title: 'Times each part', say: `Multiply the top and the bottom by ${k}.`, rows: [`${k}a = ${k} × ${col(a)}`, `${k}a = ${col([`${k} × ${br(a[0])}`, `${k} × ${br(a[1])}`])}`], picture: p },
    { title: 'Work them out', say: 'Keep each sign.', rows: [`! ${k}a = ${col(r)}`], picture: pic(true, `${k}a = ${shown(r)}`) },
  ], `${k}a`, p), vectorSlips(r, [[[r[0], a[1]], 'Multiply the bottom number too.'], [[a[0], r[1]], 'Multiply the top number too.'], [[a[0] + k, a[1] + k], `Multiply by ${k}, don’t add it.`]]))
}

/* ---------- Rung 4: putting them together ---------- */

{
  // Your Turn Q1: a = (3, 8), b = (−7, 2); 2a + b.
  const a: V = [3, 8], b: V = [-7, 2]
  const pic = (result: boolean, caption?: string) => chain([[a, 2, 'a'], [b, 1, 'b']], result ? { label: '2a + b', tone: 'found', style: 'found' } : null, 'Arrow a twice, then arrow b, nose to tail. 2a + b goes from the start to the end.', caption)
  const p = pic(false)
  worked(combining, 'a = (3 over 8) and b = (−7 over 2). Write 2a + b as a column vector.', 'Putting them together', 'T3 Your Turn Q1 (book’s numbers)', boardModel([], [
    { title: 'Multiply first', say: 'Like in algebra, multiply before you add. 2a is a with both numbers doubled.', rows: [`2a = ${col(['2 × 3', '2 × 8'])} = ${col([6, 16])}`], picture: p },
    { title: 'Then add', say: 'Add 2a and b, top with top, bottom with bottom.', rows: [`2a + b = ${col(['6 + (−7)', '16 + 2'])}`], picture: p },
    { title: 'Write the answer', say: '6 + (−7) is −1.', rows: [`! 2a + b = ${col([-1, 18])}`], picture: pic(true, '2a + b = (−1 over 18)') },
  ], '2a + b', p), 'To work out something like 2a + b, multiply first, then add or subtract, one part at a time.')
}
for (const q of [
  { a: [2, 7] as V, b: [-5, 3] as V, ka: 3, kb: -2, ref: 'T3 Your Turn Q2 (book’s numbers)' },
  { a: [6, 2] as V, b: [5, -3] as V, c: [2, 1] as V, ka: 1, kb: 2, ref: 'T3 Your Turn Q3 (book’s numbers)' },
  { a: [4, -1] as V, b: [1, 3] as V, ka: 1, kb: -3, ref: 'T3 p161 (own numbers)' },
]) {
  const { a, b, ka, kb } = q, c = q.c
  const term = (k: number, name: string, first: boolean) => `${first ? (k < 0 ? '−' : '') : k < 0 ? ' − ' : ' + '}${Math.abs(k) === 1 ? '' : Math.abs(k)}${name}`
  const expr = `${term(ka, 'a', true)}${term(kb, 'b', false)}${c ? ' − c' : ''}`
  const A: V = [ka * a[0], ka * a[1]], B: V = [kb * b[0], kb * b[1]], C: V = c ? [-c[0], -c[1]] : [0, 0]
  const r: V = [A[0] + B[0] + C[0], A[1] + B[1] + C[1]]
  const parts: [V, number, string][] = [[a, ka, 'a'], [kb < 0 ? [-b[0], -b[1]] : b, Math.abs(kb), kb < 0 ? '−b' : 'b'], ...(c ? [[C, 1, '−c'] as [V, number, string]] : [])]
  const pic = (result: boolean, caption?: string) => chain(parts, result ? { label: expr, tone: 'found', style: 'found' } : null, `Arrows for ${expr}, nose to tail, and the result from start to end.`, caption)
  const p = pic(false)
  const times = (k: number, name: string, v: V) => Math.abs(k) === 1 ? null : `${Math.abs(k)}${name} = ${col([`${Math.abs(k)} × ${br(v[0])}`, `${Math.abs(k)} × ${br(v[1])}`])} = ${col([Math.abs(k) * v[0], Math.abs(k) * v[1]])}`
  const multiplied = [times(ka, 'a', a), times(kb, 'b', b)].filter((row): row is string => !!row)
  const sa: V = [Math.abs(ka) * a[0], Math.abs(ka) * a[1]], sb: V = [Math.abs(kb) * b[0], Math.abs(kb) * b[1]]
  const sum = (i: 0 | 1) => `${n(sa[i])}${kb < 0 ? ' − ' : ' + '}${br(sb[i])}${c ? ` − ${br(c[i])}` : ''}`
  const plus = (x: V, y: V, z: V = [0, 0]): V => [x[0] + y[0] + z[0], x[1] + y[1] + z[1]]
  const slipList: [V, string][] = []
  if (ka !== 1) slipList.push([plus(a, B, C), 'Multiply a by its number first.'])
  slipList.push([plus(A, [Math.sign(kb) * b[0], Math.sign(kb) * b[1]], C), 'Multiply b by its number first.'])
  if (kb < 0) slipList.push([plus(A, [-B[0], -B[1]], C), `That adds ${Math.abs(kb)}b. Take it away.`])
  if (c) slipList.push([plus(A, B, c), 'Take c away, don’t add it.'])
  practice(combining, `a = ${shown(a)}${c ? ',' : ' and'} b = ${shown(b)}${c ? ` and c = ${shown(c)}` : ''}, as column vectors. Write ${expr} as a column vector.`, q.ref, p, vector(r), 'Multiply first, then add or take away each part.', boardModel([], [
    { title: 'Multiply first', say: c ? 'Multiply each vector by its number. c is taken away just once.' : 'Multiply each vector by its number.', rows: multiplied, picture: p },
    { title: 'Then each part', say: kb < 0 ? 'Take away top from top, bottom from bottom. Watch the negatives.' : 'Top with top, bottom with bottom. Watch the negatives.', rows: [`${expr} = ${col([sum(0), sum(1)])}`], picture: p },
    { title: 'Write the answer', say: `${n(r[0])} across and ${n(r[1])} up.`, rows: [`! ${expr} = ${col(r)}`], picture: pic(true, `${expr} = ${shown(r)}`) },
  ], expr, p), vectorSlips(r, slipList))
}

add('mixed', 'Column vectors', 'T3 consolidation', text(
  'A column vector: across on top, up underneath. Left and down are negative.',
  'Add or subtract: top with top, bottom with bottom.',
  'Multiply by a number: multiply both parts.',
  'Something like 3a − 2b: multiply first, then add or subtract each part.',
))

export const tutorVectorsLesson: TutorMethodLesson = {
  id: 'L221', number: 221, title: 'Column vectors', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Write a vector as a column vector, add and subtract column vectors, multiply them by a number, and combine them.',
  labels: { [reading]: 'Reading a vector', [adding]: 'Adding and subtracting', [multiplying]: 'Multiplying', [combining]: 'Putting them together', mixed: 'Review' },
  states: finish(),
}

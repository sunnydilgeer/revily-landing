import type { GraphPoint } from '../../written-methods/tutor/methodWorking'
import { sameFormula } from '../../number-types/lessonMath'
import { latex } from '../../inequalities/tutor/inequalityWorkings'
import { answerMove, bracket, mark, pt, shared, type GraphGrid, type GraphMove } from '../../straight-line-graphs/tutor/graphWorkings'
import { acrossFrom, pair, upTo } from './gradientWorkings'

/*
 * The workings for y = mx + c (graphs lesson 3, GR2), one move a step on the question's own grid, as in the gradient
 * workings. From a graph: c first, where the line crosses the y axis (a y, so biro blue), then the gradient from there,
 * across first, then up. From two points: m = (y₂ − y₁) ÷ (x₂ − x₁), then put one point's x and y in and solve for c.
 * Rearranging: make y the subject, one move a line, and read m and c off.
 */

const show = (n: number) => String(n).replace('-', '−')
const VULGAR: Record<string, string> = { '1/2': '½', '1/3': '⅓', '2/3': '⅔', '1/4': '¼', '3/4': '¾', '1/5': '⅕' }
const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b)
/** A fraction as top/bottom, lowest terms, the sign in front: 6/4 → [3, 2]. */
export function ratio(top: number, bottom: number): [number, number] {
  if (bottom < 0) { top = -top; bottom = -bottom }
  const g = gcd(top, bottom) || 1
  return [top / g, bottom / g]
}
/** A number as the lesson writes it: 3, −2, ½, −⅓, 5/6. */
export function numberText(top: number, bottom = 1) {
  const [n, d] = ratio(top, bottom)
  if (d === 1) return show(n)
  const plain = `${Math.abs(n)}/${d}`
  return `${n < 0 ? '−' : ''}${VULGAR[plain] ?? plain}`
}
/** c as the lesson writes it: 5, −2, ½. */
const cText = (c: number) => Number.isInteger(c) ? show(c) : numberText(Math.round(c * 6), 6)
/** y = 3x − 2, y = −½x + 4, y = x + 1, y = 5, y = 2x + ½. m as top/bottom so a third stays exact. */
export function lineText(mTop: number, mBottom: number, c: number) {
  const [n, d] = ratio(mTop, mBottom)
  const mx = n === 0 ? '' : d === 1 && Math.abs(n) === 1 ? (n < 0 ? '−x' : 'x') : `${numberText(n, d)}x`
  const cc = c === 0 ? (mx ? '' : '0') : !mx ? cText(c) : c < 0 ? ` − ${cText(-c)}` : ` + ${cText(c)}`
  return `y = ${mx}${cc}`
}
/** What a student types after "y =": 3x-2, -1/2x+4. Checked as a formula, so any way of writing it passes. */
export const typedLine = (mTop: number, mBottom: number, c: number) => {
  const [n, d] = ratio(mTop, mBottom)
  return `${n}${d === 1 ? '' : `/${d}`}*x${c < 0 ? '' : '+'}${c}`
}

/** Moves: c, where the line crosses the y axis, its y lit on the axis. */
const crossing = (c: number): GraphMove => ({
  title: 'Find c', equation: latex(`c = ${show(c)}`), adds: 'lines',
  say: `c is where the line crosses the y axis. It crosses at ${show(c)}.`,
  change: (frame, step) => ({
    // Its number lit on the y axis marks the spot: a dot there would sit on top of the number.
    ...frame, marks: [mark('y', c)],
    working: [...(frame.working ?? []), { text: `c = ${show(c)}`, family: 0, at: step }],
  }),
})
/** Moves: m, up over across, a halfway result. */
const gradientLine = (up: number, across: number): GraphMove => ({
  title: 'So m is', equation: latex(`m = ${show(up)} ÷ ${show(across)} = ${numberText(up, across)}`), adds: 'lines',
  say: 'm is the gradient: up over across.',
  change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: `m = ${show(up)} ÷ ${show(across)} = ${numberText(up, across)}`, family: 3, at: step }] }),
})
/** The answer: y = mx + c, the line going green. */
const writeIt = (mTop: number, mBottom: number, c: number, say = 'Put m and c into y = mx + c.'): GraphMove =>
  answerMove(lineText(mTop, mBottom, c), 'y = mx + c', say, [0], { title: '', say: '', equation: '', adds: 'answer', change: frame => ({ ...frame, marks: [mark('y', c)] }) })

/**
 * From a graph: c, then across `across` from where it crosses the y axis and up (or down) `up` to the line, then
 * m = up ÷ across, then the equation. The grid's first line is the line.
 */
export function fromGraphMoves(c: number, across: number, up: number): GraphMove[] {
  const a = pt(0, c), b = pt(across, c + up)
  return [crossing(c), acrossFrom(a, b, false), upTo(a, b, false), gradientLine(up, across), writeIt(up, across, c)]
}

/**
 * From two points: m from the two subtractions, then the first point's x and y put into y = mx + c, then c, then the
 * equation. `start` shows the two points; the line comes in green at the end.
 */
export function fromPointsMoves(a: GraphPoint, b: GraphPoint): GraphMove[] {
  const up = b.y - a.y, across = b.x - a.x
  const [n, d] = ratio(up, across)
  const mx = (n * a.x) / d
  const c = a.y - mx
  const mText = numberText(n, d)
  const sub = `${show(a.y)} = ${mText} × ${bracket(a.x)} + c`
  return [
    {
      title: 'Find m', equation: latex(`m = (${show(b.y)} − ${bracket(a.y)}) ÷ (${show(b.x)} − ${bracket(a.x)})`), adds: 'lines',
      say: 'm is the gradient: (y₂ − y₁) ÷ (x₂ − x₁), the change in y over the change in x.',
      change: (frame, step) => ({
        ...frame, boxed: [a, b], marks: shared([a, b]),
        working: [...(frame.working ?? []), { text: `m = (${show(b.y)} − ${bracket(a.y)}) ÷ (${show(b.x)} − ${bracket(a.x)}) = ${show(up)} ÷ ${show(across)} = ${mText}`, family: 3, at: step }],
      }),
    },
    {
      title: 'Put a point in', equation: latex(sub), adds: 'lines',
      say: `Now y = ${mText}x + c. Put in one point’s x and y: ${pair(a)}.`,
      change: (frame, step) => ({ ...frame, boxed: [a], marks: shared([a]), working: [...(frame.working ?? []), { text: sub, family: 3, at: step }] }),
    },
    {
      title: 'Solve for c', equation: latex(`c = ${show(c)}`), adds: 'lines',
      say: `${mText} × ${bracket(a.x)} is ${show(mx)}, so ${show(a.y)} = ${show(mx)} + c. Take ${bracket(mx)} from both sides.`,
      change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: `${show(a.y)} = ${show(mx)} + c, so c = ${show(c)}`, family: 0, at: step }] }),
    },
    {
      ...writeIt(up, across, c),
      change: (frame, step) => writeIt(up, across, c).change({ ...frame, lines: [{ from: a, to: b, at: step }] }, step),
    },
  ]
}

/**
 * Rearranging ax + by = k into y = mx + c: take the x term to the other side, then divide by b. The grid shows the
 * line at the end, crossing the y axis at c.
 */
export function rearrangeMoves(a: number, b: number, k: number): GraphMove[] {
  const xTerm = a === 1 ? 'x' : a === -1 ? '−x' : `${show(a)}x`
  const yTerm = b === 1 ? 'y' : `${show(b)}y`
  const moved = `${yTerm} = ${a > 0 ? '−' : ''}${Math.abs(a) === 1 ? '' : Math.abs(a)}x ${k < 0 ? '−' : '+'} ${Math.abs(k)}`
  const c = k / b
  const lines = [
    { text: moved, title: a > 0 ? `Take ${xTerm} from both sides` : `Add ${xTerm.replace('−', '')} to both sides`, say: 'Get the y term on its own first.' },
    ...(b === 1 ? [] : [{ text: lineText(-a, b, c), title: `Divide by ${show(b)}`, say: `Divide every term by ${show(b)}, so y is on its own.` }]),
  ]
  return [
    ...lines.map(({ text, title, say }): GraphMove => ({
      title, equation: latex(text), adds: 'lines', say,
      change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text, family: 3, at: step }] }),
    })),
    answerMove(`m = ${numberText(-a, b)}, c = ${show(c)}`, 'Read m and c', `Now it is y = mx + c: the gradient is ${numberText(-a, b)} and it crosses the y axis at ${show(c)}.`, [0], {
      title: '', say: '', equation: '', adds: 'answer',
      change: (frame, step) => ({ ...frame, lines: [{ from: pt(0, c), to: pt(b, c - a), at: step }], marks: [mark('y', c)] }),
    }),
  ]
}

/** A rearranging step: its title, the line it leaves, and what to say. */
export type Move = [title: string, text: string, say: string]
const moveLine = ([title, text, say]: Move): GraphMove => ({
  title, equation: latex(text), adds: 'lines', say,
  change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text, family: 3, at: step }] }),
})
/** The line y = mx + c drawn through (0, c) and one gradient step on, green, c lit on the y axis. */
const joined = (mTop: number, mBottom: number, c: number, title: string, say: string): GraphMove => {
  const [n, d] = ratio(mTop, mBottom)
  return answerMove(lineText(n, d, c), title, say, [0], {
    title: '', say: '', equation: '', adds: 'answer',
    change: (frame, step) => ({ ...frame, lines: [{ from: pt(0, c), to: pt(d, c + n), at: step }, ...(frame.lines ?? [])], marks: [mark('y', c)] }),
  })
}

/** Rearranging into y = mx + c, one move a line; the line comes in green at the end. */
export function rearrangedMoves(moves: Move[], mTop: number, mBottom: number, c: number): GraphMove[] {
  return [...moves.map(moveLine), joined(mTop, mBottom, c, 'y = mx + c', 'Now it is y = mx + c.')]
}

/**
 * Drawing a line from its equation (GR4 method 2): make y the subject if it isn't, plot c on the y axis, step the
 * gradient from there (across, then up or down: across 2 for a half), plot that point, then join them with one
 * straight line. No dot at (0, c): its lit number on the y axis marks it. The grid starts empty.
 */
export function drawMoves(moves: Move[], mTop: number, mBottom: number, c: number): GraphMove[] {
  const [n, d] = ratio(mTop, mBottom)
  const a = pt(0, c), b = pt(d, c + n)
  const m = numberText(n, d)
  return [
    ...moves.map(moveLine),
    {
      title: 'Plot c', equation: latex(`c = ${show(c)}`), adds: 'picture',
      say: `c is where the line crosses the y axis: at ${pair(a)}.`,
      // c's number lit on the y axis marks the spot, as in "Find c": a dot there would sit on top of the number.
      change: (frame, step) => ({ ...frame, marks: [mark('y', c)], working: [...(frame.working ?? []), { text: `c = ${show(c)}: ${pair(a)}`, family: 0, at: step }] }),
    },
    { ...acrossFrom(a, b, false), say: d === 1 ? `The gradient is ${m}: for every 1 across, ${n < 0 ? 'down' : 'up'} ${show(Math.abs(n))}. Across 1 first.` : `The gradient is ${m}: for every ${d} across, ${n < 0 ? 'down' : 'up'} ${show(Math.abs(n))}. Across ${d} first.` },
    upTo(a, b, false),
    {
      title: 'Plot it', equation: latex(pair(b)), adds: 'picture', say: `That lands on ${pair(b)}: plot it.`,
      change: (frame, step) => ({ ...frame, points: [...(frame.points ?? []), { ...b, at: step }], boxed: [b], marks: shared([b]) }),
    },
    joined(n, d, c, 'Join', 'Join the two points with one straight line, right across the grid. Another step of the gradient lands on it too.'),
  ]
}

/** Slips drawing y = mx + c on the board (the board sends the line as "a, b, k", ax + by = k): c or m's sign lost, m upside down, c and m swapped. */
export function drawSlips(mTop: number, mBottom: number, c: number) {
  const m = mTop / mBottom
  const near = (p: number, q: number) => Math.abs(p - q) < 1e-9
  return (response: string) => {
    const [a, b, k] = response.replace(/−/g, '-').split(',').map(Number)
    if ([a, b, k].some(Number.isNaN) || b === undefined) return null
    if (b === 0) return 'That line goes straight up and down. Plot c on the y axis, then step across and up.'
    const slope = -a / b, crosses = k / b
    if (near(slope, m) && near(crosses, c)) return null
    if (near(slope, m)) return `Right gradient, but it should cross the y axis at ${cText(c)}: c, with its sign.`
    if (near(crosses, c) && near(slope, -m)) return m < 0 ? 'The gradient is negative: from c, across, then down.' : 'The gradient is positive: from c, across, then up.'
    if (near(crosses, c) && m !== 0 && near(slope, 1 / m)) return 'That’s across over up. Across first, then up or down by the top of the gradient.'
    if (near(crosses, c)) return `It crosses at ${cText(c)}, good. Now step the gradient: across ${mBottom}, then ${mTop < 0 ? 'down' : 'up'} ${Math.abs(mTop)}.`
    if (near(slope, c) && near(crosses, m)) return 'That’s m and c swapped. c is where it crosses the y axis; m is how it steps.'
    return null
  }
}

/** The usual slips with y = mx + c, each a whole line: m and c swapped, c's sign lost, m's sign lost, m upside down. */
export function lineSlips(mTop: number, mBottom: number, c: number) {
  const m = mTop / mBottom
  const slips: [string, string][] = [
    [`${c}*x+${m}`, 'That’s m and c swapped round. The gradient goes with x; c is the number on its own.'],
    [typedLine(mTop, mBottom, -c), `The line crosses the y axis at ${show(c)}, so c is ${show(c)}.`],
    [typedLine(-mTop, mBottom, c), m < 0 ? 'The line goes down from left to right, so m is negative.' : 'The line goes up from left to right, so m is positive.'],
    [typedLine(mBottom, mTop, c), 'That’s across over up. m is up over across.'],
  ]
  const right = typedLine(mTop, mBottom, c)
  return (response: string) => {
    const typed = response.replace(/^\s*y\s*=\s*/i, '')
    if (sameFormula(typed, right)) return null
    return slips.find(([wrong]) => !sameFormula(wrong, right) && sameFormula(typed, wrong))?.[1] ?? null
  }
}

/** A grid for an equation from two points: both points and (0, c) on it, a square spare all round. */
export function gridFor(points: GraphPoint[], c: number, extra: GraphGrid['lines'] = []): GraphGrid {
  const xs = [...points.map(p => p.x), 0], ys = [...points.map(p => p.y), c, 0]
  return { x: [Math.min(...xs) - 1, Math.max(...xs) + 1], y: [Math.min(...ys) - 1, Math.max(...ys) + 1], lines: extra, points: points.map(p => ({ ...p, at: -1 })) }
}

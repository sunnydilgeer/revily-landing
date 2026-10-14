import { GRAPH_SQUARES, type GraphPoint } from '../../written-methods/tutor/methodWorking'
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

/** Moves: what m and c are, before any numbers, each in the colour it is found in (Sunny, 14 Oct). */
const meaning: GraphMove = {
  title: 'What y = mx + c means', equation: latex('m is the gradient, c is where the line crosses the y axis'), adds: 'lines',
  say: 'Every straight line can be written as y = mx + c. Find the two numbers m and c, and you have its equation.',
  change: (frame, step) => ({
    ...frame, working: [...(frame.working ?? []),
      { text: 'm is the gradient: how steep the line is (up ÷ across)', family: 3, at: step },
      { text: 'c is where the line crosses the y axis', family: 0, at: step }],
  }),
}
/** Moves: c, where the line crosses the y axis, its y lit on the axis. */
const crossing = (c: number): GraphMove => ({
  title: 'Find c, where the line crosses the y axis', equation: latex(`c = ${show(c)}`), adds: 'lines',
  say: `Look where the line cuts the y axis: at ${show(c)}.`,
  change: (frame, step) => ({
    // Its number lit on the y axis marks the spot: a dot there would sit on top of the number.
    ...frame, marks: [mark('y', c)],
    working: [...(frame.working ?? []), { text: `The line crosses the y axis at ${show(c)}, so c = ${show(c)}`, family: 0, at: step }],
  }),
})
/** Moves: m, up over across, a halfway result. */
const gradientLine = (up: number, across: number): GraphMove => ({
  title: 'Find m, the gradient', equation: latex(`m = ${show(up)} ÷ ${show(across)} = ${numberText(up, across)}`), adds: 'lines',
  say: 'm is the gradient: divide the up by the across.',
  change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: `m = up ÷ across = ${show(up)} ÷ ${show(across)} = ${numberText(up, across)}`, family: 3, at: step }] }),
})
/** The answer: m and c side by side, then y = mx + c, the line going green. */
const writeIt = (mTop: number, mBottom: number, c: number, say = 'Put m in front of x and c on the end.'): GraphMove =>
  answerMove(lineText(mTop, mBottom, c), 'Put m and c into y = mx + c', say, [0], {
    title: '', say: '', equation: '', adds: 'answer',
    change: (frame, step) => ({ ...frame, marks: [mark('y', c)], working: [...(frame.working ?? []), { text: `${mIn(`m = ${numberText(mTop, mBottom)}`)} and ${cIn(`c = ${cText(c)}`)}`, family: 4, at: step }] }),
  })
/** Check it makes sense: put the second point's x in, and out comes its y. */
const checkLine = (mTop: number, mBottom: number, c: number, b: GraphPoint): GraphMove => {
  const tail = c === 0 ? '' : ` ${c < 0 ? '−' : '+'} ${cText(Math.abs(c))}`
  const text = `At x = ${show(b.x)}, y = ${numberText(mTop, mBottom)} × ${bracket(b.x)}${tail} = ${show(b.y)}, and the line goes through ${pair(b)}`
  return {
    title: 'Check it makes sense', equation: latex(text), adds: 'lines',
    say: 'Put a point’s x into the equation. The y that comes out should be on the line.',
    change: (frame, step) => ({ ...frame, boxed: [b], marks: [mark('y', c), ...shared([b])], working: [...(frame.working ?? []), { text, family: 2, at: step }] }),
  }
}

/**
 * From a graph: what m and c mean, c, then across `across` from where it crosses the y axis and up (or down) `up` to
 * the line, then m = up ÷ across, then the equation, then a check. The grid's first line is the line.
 */
export function fromGraphMoves(c: number, across: number, up: number): GraphMove[] {
  const a = pt(0, c), b = pt(across, c + up)
  return [meaning, crossing(c), acrossFrom(a, b, false), upTo(a, b, false), gradientLine(up, across), writeIt(up, across, c), checkLine(up, across, c, b)]
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

/** m and c in colour, so each keeps its colour from y = mx + c to the numbers (m purple, c biro blue). */
const mIn = (text: string) => `[[3|${text}]]`, cIn = (text: string) => `[[0|${text}]]`
/** y = 3x − 2 with m and c coloured: y = [[3|3]]x [[0|− 2]]. */
function markedLine(mTop: number, mBottom: number, c: number) {
  const [n, d] = ratio(mTop, mBottom)
  const mx = n === 0 ? '' : d === 1 && Math.abs(n) === 1 ? `${mIn(n < 0 ? '−' : '1')}x` : `${mIn(numberText(n, d))}x`
  const cc = c === 0 ? (mx ? ` + ${cIn('0')}` : cIn('0')) : !mx ? cIn(cText(c)) : c < 0 ? ` ${cIn(`− ${cText(-c)}`)}` : ` ${cIn(`+ ${cText(c)}`)}`
  return `y = ${mx}${cc}`
}
/** The lines matching an equation to y = mx + c, m and c in their colours, in plain ink (family 4). */
function matchLines(mTop: number, mBottom: number, c: number) {
  return [`y = ${mIn('m')}x + ${cIn('c')}`, markedLine(mTop, mBottom, c),
    `${mIn(`m = ${numberText(mTop, mBottom)}`)}: the number in front of x, the gradient`,
    `${cIn(`c = ${cText(c)}`)}: the number on its own, where the line crosses the y axis`]
}
const SAY_MATCH = 'Line it up under y = mx + c. m is the number in front of x, with its sign. c is the number on its own, with its sign.'
/** Moves: the equation as the question gives it, before any rearranging. */
const startMove = (start: string): GraphMove => ({
  title: 'Start with the equation', equation: latex(start), adds: 'lines',
  say: 'This is the line’s rule, but y is not on its own yet. Rearrange it, one move at a time, until it looks like y = mx + c.',
  change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), { text: start, family: 4, at: step }] }),
})
/** Moves: m and c matched to y = mx + c, a halfway step (drawing goes on to plot them). */
const matchMove = (mTop: number, mBottom: number, c: number): GraphMove => ({
  title: 'Match it to y = mx + c', equation: latex(`m = ${numberText(mTop, mBottom)}, c = ${cText(c)}`), adds: 'lines', say: SAY_MATCH,
  change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), ...matchLines(mTop, mBottom, c).map(text => ({ text, family: 4, at: step }))] }),
})

/**
 * Rearranging ax + by = k into y = mx + c, the algebra the focus and the graph a picture of it (Sunny, 14 Oct): the
 * equation as given, the x term taken off both sides with the take-away written out, the x term put first, then every
 * term divided by b. Then m and c matched to y = mx + c, the line coming in on the grid with c lit, and a check that
 * a point of the line fits the equation it started as. `start` is the equation as the question writes it.
 */
export function rearrangeMoves(a: number, b: number, k: number, start = `${a === 1 ? '' : show(a)}x + ${b === 1 ? '' : show(b)}y = ${show(k)}`): GraphMove[] {
  const xAbs = Math.abs(a) === 1 ? 'x' : `${Math.abs(a)}x`
  const yTerm = b === 1 ? 'y' : `${show(b)}y`
  const op = a > 0 ? '−' : '+'
  const [lhs, rhs] = start.split(' = ')
  const c = k / b, m = numberText(-a, b)
  const first = `${yTerm} = ${a > 0 ? '−' : ''}${xAbs} ${k < 0 ? '−' : '+'} ${Math.abs(k)}`
  const line = (text: string, step: number, family = 3) => ({ text, family, at: step })
  const move = (title: string, say: string, texts: string[]): GraphMove => ({
    title, equation: latex(texts.at(-1)!), adds: 'lines', say,
    change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), ...texts.map(text => line(text, step))] }),
  })
  // A point on the line with whole numbers, to check: x = 1 when m is whole, else x = b, keeps y whole.
  const cx = a % b === 0 ? 1 : Math.abs(b), cy = (k - a * cx) / b
  const put = (n: string, v: number) => n ? `${n} × ${bracket(v)}` : bracket(v)
  const into = start.replace(/(\d*)x/, (_, n: string) => put(n, cx)).replace(/(\d*)y/, (_, n: string) => put(n, cy))
  const checks = [`At x = ${show(cx)}: y = ${m} × ${bracket(cx)} ${c < 0 ? '−' : '+'} ${cText(Math.abs(c))} = ${show(cy)}`, `Into ${start}: ${into} ✓`]
  return [
    startMove(start),
    move(`${a > 0 ? 'Take' : 'Add'} ${xAbs} ${a > 0 ? 'from' : 'to'} both sides`, a > 0 ? `Take ${xAbs} away from both sides, so the y term is on its own on the left.` : `Add ${xAbs} to both sides, so the y term is on its own on the left.`,
      [`${lhs} ${op} ${xAbs} = ${rhs} ${op} ${xAbs}`, `${yTerm} = ${rhs} ${op} ${xAbs}`]),
    move('Put the x term first', 'Swap the order on the right, so it reads like y = mx + c: the x term, then the number.', [first]),
    ...(b === 1 ? [] : [move(`Divide every term by ${show(b)}`, `Divide every term by ${show(b)}, so y is on its own.`,
      [`y = ${a > 0 ? '−' : ''}${xAbs} ÷ ${show(b)} ${k < 0 ? '−' : '+'} ${Math.abs(k)} ÷ ${show(b)}`, lineText(-a, b, c)])]),
    answerMove(`m = ${m}, c = ${show(c)}`, 'Match it to y = mx + c', SAY_MATCH, [0], {
      title: '', say: '', equation: '', adds: 'answer',
      change: (frame, step) => ({
        ...frame, lines: [{ from: pt(0, c), to: pt(b, c - a), at: step }], marks: [mark('y', c)],
        working: [...(frame.working ?? []), ...matchLines(-a, b, c).map(text => line(text, step, 4))],
      }),
    }),
    {
      title: 'Check it makes sense', equation: latex(checks.join('. ')), adds: 'lines',
      say: `Pick an x, work out y, and put both into ${start}. It should still be true.`,
      change: (frame, step) => ({ ...frame, marks: [mark('y', c)], working: [...(frame.working ?? []), ...checks.map(text => line(text, step, 2))] }),
    },
  ]
}

/** A rearranging step: its title, the lines it writes (one a line, "\n" between: the move written out, then what it leaves), and what to say. */
export type Move = [title: string, text: string, say: string]
const moveLine = ([title, text, say]: Move): GraphMove => ({
  title, equation: latex(text.split('\n').at(-1)!), adds: 'lines', say,
  change: (frame, step) => ({ ...frame, working: [...(frame.working ?? []), ...text.split('\n').map(line => ({ text: line, family: 3, at: step }))] }),
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
export function rearrangedMoves(start: string, moves: Move[], mTop: number, mBottom: number, c: number): GraphMove[] {
  return [startMove(start), ...moves.map(moveLine), matchMove(mTop, mBottom, c), joined(mTop, mBottom, c, 'y = mx + c', 'So the line is y = mx + c with those two numbers in.')]
}

/**
 * Drawing a line from its equation (GR4 method 2): make y the subject if it isn't, plot c on the y axis, step the
 * gradient from there (across, then up or down: across 2 for a half), plot that point, then join them with one
 * straight line. No dot at (0, c): its lit number on the y axis marks it. The grid starts empty.
 */
export function drawMoves(start: string, moves: Move[], mTop: number, mBottom: number, c: number): GraphMove[] {
  const [n, d] = ratio(mTop, mBottom)
  const a = pt(0, c), b = pt(d, c + n)
  const m = numberText(n, d)
  return [
    ...(moves.length ? [startMove(start)] : []),
    ...moves.map(moveLine),
    matchMove(n, d, c),
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

/**
 * A grid for an equation from two points: both points and (0, c) on it, a square spare all round. Points too far
 * apart up and down for the graph's 11 squares (GRAPH_SQUARES) put the y axis in 2s or 5s, so it still fits.
 */
export function gridFor(points: GraphPoint[], c: number, extra: GraphGrid['lines'] = []): GraphGrid {
  const xs = [...points.map(p => p.x), 0], ys = [...points.map(p => p.y), c, 0]
  const low = Math.min(...ys) - 1, high = Math.max(...ys) + 1
  const yStep = [1, 2, 5, 10].find(step => Math.ceil(high / step) - Math.floor(low / step) <= GRAPH_SQUARES) ?? 10
  const y: [number, number] = [Math.floor(low / yStep) * yStep, Math.ceil(high / yStep) * yStep]
  return { x: [Math.min(...xs) - 1, Math.max(...xs) + 1], y, ...(yStep > 1 && { yStep }), lines: extra, points: points.map(p => ({ ...p, at: -1 })) }
}

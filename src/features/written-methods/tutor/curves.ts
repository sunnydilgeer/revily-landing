import type { GraphPoint } from './methodWorking'

/*
 * Curves for the graphs lessons (graphs lesson 6, GR6: quadratic and cubic graphs). A curve is its rule's numbers,
 * [constant, x, x², x³], drawn as one smooth line between two x's and cut off where it leaves the grid. Its sum at x is
 * written in the rule's own order, with every negative x in brackets so its square or cube keeps its sign:
 * y = x² − 3 at x = −2 is "(−2)² − 3 = 4 − 3 = 1".
 */

export type Poly = number[]
export const valueAt = (coeffs: Poly, x: number) => coeffs.reduce((sum, a, power) => sum + a * x ** power, 0)

const show = (n: number) => String(n).replace('-', '−')
const POWER = ['', '', '²', '³']

/** The rule's terms in its own order: "5 − x²" → 5, then −1 lot of x². */
export function terms(rule: string): { coef: number; power: number }[] {
  const right = rule.replace(/^y\s*=\s*/, '').replace(/−/g, '-').replace(/\s+/g, '')
  return [...right.matchAll(/([+-]?)(\d*\.?\d*)(x([²³])?)?/g)].filter(m => m[0] !== '' && m[0] !== '+' && m[0] !== '-').map(([, sign, n, x, p]) => ({
    coef: (sign === '-' ? -1 : 1) * (n === '' ? 1 : Number(n)), power: x ? p === '³' ? 3 : p === '²' ? 2 : 1 : 0,
  }))
}
/** The rule's numbers, [constant, x, x², x³], from how it is written. */
export function coefficients(rule: string): Poly {
  const coeffs = [0, 0, 0, 0]
  for (const t of terms(rule)) coeffs[t.power] += t.coef
  return coeffs
}

/**
 * The rule's sum at x, in the rule's order: "(−2)² − 3 = 4 − 3 = 1", "2³ − 4 × 2 = 8 − 8 = 0". The middle part is each
 * term worked out, so a square of a negative shows as positive.
 */
export function polySum(rule: string, x: number) {
  const list = terms(rule), X = x < 0 ? `(${show(x)})` : show(x)
  const join = (parts: { negative: boolean; text: string }[]) => parts.map((p, i) => i === 0 ? `${p.negative ? '−' : ''}${p.text}` : ` ${p.negative ? '−' : '+'} ${p.text}`).join('')
  const put = join(list.map(t => {
    const size = Math.abs(t.coef), body = t.power === 0 ? show(size) : `${X}${POWER[t.power]}`
    return { negative: t.coef < 0, text: t.power === 0 || size === 1 ? body : `${show(size)} × ${body}` }
  }))
  const values = list.map(t => t.coef * x ** t.power)
  const worked = join(values.map(v => ({ negative: v < 0, text: show(Math.abs(v)) })))
  const y = show(values.reduce((a, b) => a + b, 0))
  // A single number put in needs no middle part: 5 + 2 = 7 already shows it.
  return list.length > 1 && worked !== put ? `${put} = ${worked} = ${y}` : `${put} = ${y}`
}

/**
 * The curve between x = from and x = to as an SVG path in the picture's pixels, cut where it leaves the grid (a new
 * piece starts where it comes back in). Sampled every 1/16 of a square, which is smooth at one square to 32px.
 */
export function curvePath(coeffs: Poly, from: number, to: number, grid: { x: [number, number]; y: [number, number] }, px: (x: number) => number, py: (y: number) => number) {
  const [y0, y1] = grid.y, lo = Math.max(from, grid.x[0]), hi = Math.min(to, grid.x[1])
  const n = Math.max(2, Math.ceil((hi - lo) * 16)), inside = (y: number) => y >= y0 && y <= y1
  const at = (x: number, y: number) => `${(px(x) + 0.5).toFixed(1)} ${(py(y) + 0.5).toFixed(1)}`
  // Where the curve crosses the grid's top or bottom between two samples, found by halving.
  const edge = (a: number, b: number) => {
    const wasIn = inside(valueAt(coeffs, a))
    for (let i = 0; i < 30; i++) { const m = (a + b) / 2; if (inside(valueAt(coeffs, m)) === wasIn) a = m; else b = m }
    const x = (a + b) / 2
    return { x, y: Math.min(Math.max(valueAt(coeffs, x), y0), y1) }
  }
  let d = '', drawing = false, last = lo
  for (let i = 0; i <= n; i++) {
    const x = lo + (hi - lo) * i / n, y = valueAt(coeffs, x)
    if (inside(y)) {
      if (!drawing) { const e = i ? edge(last, x) : { x, y }; d += `M${at(e.x, e.y)} `; drawing = true; if (i) d += `L${at(x, y)} ` }
      else d += `L${at(x, y)} `
    } else if (drawing) { const e = edge(last, x); d += `L${at(e.x, e.y)} `; drawing = false }
    last = x
  }
  return d.trim()
}

/** A smooth line through dots in order (Catmull-Rom as Bézier curves), for joining a student's own points. */
export function smoothThrough(points: { x: number; y: number }[]) {
  if (points.length < 2) return ''
  const p = (i: number) => points[Math.min(Math.max(i, 0), points.length - 1)]
  const f = (n: number) => n.toFixed(1)
  let d = `M${f(points[0].x)} ${f(points[0].y)}`
  for (let i = 0; i < points.length - 1; i++) {
    const a = p(i - 1), b = p(i), c = p(i + 1), e = p(i + 2)
    d += ` C${f(b.x + (c.x - a.x) / 6)} ${f(b.y + (c.y - a.y) / 6)} ${f(c.x - (e.x - b.x) / 6)} ${f(c.y - (e.y - b.y) / 6)} ${f(c.x)} ${f(c.y)}`
  }
  return d
}

/** The table's points, one a column. */
export const tablePoints = (coeffs: Poly, xs: number[]): GraphPoint[] => xs.map(x => ({ x, y: valueAt(coeffs, x) }))
/** The answer a plotted table gives on the board: every point, in order across, "x, y, x, y". */
export const pointsKey = (points: GraphPoint[]) => [...points].sort((a, b) => a.x - b.x).map(p => `${p.x}, ${p.y}`).join(', ')

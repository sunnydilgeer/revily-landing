// Graphs for the lesson kit's packs, drawn like the app's (src/features/written-methods/tutor/GraphPictures.tsx): one
// square per unit, x numbers amber and y numbers biro blue, on the axes, in a point's brackets and in the working.
const INK = '#17213a', BIRO = '#2443b5', AMBER = '#b45309', GREEN = '#0d7446', PURPLE = '#7c3aed', GRID = '#d5ddea', MUTED = '#5e6886'
const show = n => String(n).replace('-', '−')
// x numbers are always amber and y numbers biro blue: on the axes, in a point's brackets and in the working.
const AXIS = { x: AMBER, y: BIRO }
const pair = (x, y, label) => label === `(${show(x)}, ${show(y)})` ? `(<tspan fill="${AMBER}">${show(x)}</tspan>, <tspan fill="${BIRO}">${show(y)}</tspan>)` : label
/** (x, y) in KaTeX, coloured like the axes. */
const tex = (x, y) => `(\\textcolor{${AMBER}}{${show(x).replace('−', '-')}}, \\textcolor{${BIRO}}{${show(y).replace('−', '-')}})`
/**
 * A grid drawn to its numbers: one square per unit, the axes, straight lines edge to edge (each through two points),
 * points with their coordinates, the steps between two points (across amber, up or down biro blue) and rings.
 * Everything (arrowheads, axis names, labels) stays inside the grid. `marks` highlights the axis numbers a step
 * reads, in that step's colour: [{ axis: 'x' | 'y', value, colour }].
 */
function graph({ x: [x0, x1], y: [y0, y1], unit = 30, lines = [], points = [], legs = [], rings = [], marks = [], numbers = true }) {
  const L = 1, T = 1
  const W = 2 + (x1 - x0) * unit, H = 2 + (y1 - y0) * unit
  const px = x => L + (x - x0) * unit, py = y => T + (y1 - y) * unit
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
  // Keeps a label of `size` font inside the grid: returns its anchor x and baseline y moved in from any edge.
  const inside = (x, y, text, size, anchor) => {
    const w = String(text).replace(/<[^>]+>/g, '').length * size * 0.5, pad = 4
    const left = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x
    const nx = x + Math.max(0, px(x0) + pad - left) - Math.max(0, left + w - (px(x1) - pad))
    const ny = Math.min(Math.max(y, py(y1) + pad + size * 0.8), py(y0) - pad - size * 0.2)
    return [nx, ny]
  }
  const text = (x, y, words, { size = 15, weight = 700, colour = INK, anchor = 'start', italic = false, halo = true } = {}) => {
    const [nx, ny] = inside(x, y, words, size, anchor)
    return `<text x="${nx}" y="${ny}" font-size="${size}" font-weight="${weight}"${italic ? ' font-style="italic"' : ''} fill="${colour}" text-anchor="${anchor}"${halo ? ' paint-order="stroke" stroke="#fff" stroke-width="5" stroke-linejoin="round"' : ''}>${words}</text>`
  }
  const parts = [], late = []
  for (const x of range(x0, x1)) parts.push(`<line x1="${px(x)}" x2="${px(x)}" y1="${py(y1)}" y2="${py(y0)}" stroke="${GRID}" stroke-width="1"/>`)
  for (const y of range(y0, y1)) parts.push(`<line x1="${px(x0)}" x2="${px(x1)}" y1="${py(y)}" y2="${py(y)}" stroke="${GRID}" stroke-width="1"/>`)
  // The axes, their arrowheads ending just inside the grid's edge.
  const ex = px(x1) - 3, ey = py(y1) + 3
  parts.push(`<path d="M${px(x0)} ${py(0)}H${ex}M${ex - 8} ${py(0) - 5}L${ex} ${py(0)}L${ex - 8} ${py(0) + 5}M${px(0)} ${py(y0)}V${ey}M${px(0) - 5} ${ey + 8}L${px(0)} ${ey}L${px(0) + 5} ${ey + 8}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`)
  parts.push(text(ex - 4, py(0) - 8, 'x', { size: 16, italic: true, anchor: 'end' }) + text(px(0) + 9, ey + 14, 'y', { size: 16, italic: true }))
  if (numbers) {
    const marked = (axis, v) => marks.find(m => m.axis === axis && m.value === v) && { colour: AXIS[axis] }
    const number = (axis, v, x, y, anchor) => {
      const m = marked(axis, v), words = show(v), [nx, ny] = inside(x, y, words, 12, anchor)
      if (!m) return `<text x="${nx}" y="${ny}" font-size="12" font-weight="600" fill="${MUTED}" text-anchor="${anchor}" paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round">${words}</text>`
      const w = words.length * 7.5 + 8, left = anchor === 'end' ? nx - w + 4 : nx - w / 2
      return `<rect x="${left}" y="${ny - 12}" width="${w}" height="16" rx="8" fill="${m.colour}"/><text x="${anchor === 'end' ? nx : nx}" y="${ny}" font-size="12" font-weight="800" fill="#fff" text-anchor="${anchor}">${words}</text>`
    }
    // The grid's edge numbers are left off so nothing sits outside; 0 is written once, by the origin.
    // Highlighted numbers go on top of everything, so no line or ring hides them.
    for (const x of range(x0 + 1, x1 - 1).filter(x => x)) (marked('x', x) ? late : parts).push(number('x', x, px(x), py(0) + 15, 'middle'))
    for (const y of range(y0 + 1, y1 - 1).filter(y => y)) (marked('y', y) ? late : parts).push(number('y', y, px(0) - 6, py(y) + 4, 'end'))
    parts.push(`<text x="${px(0) - 5}" y="${py(0) + 14}" font-size="12" font-weight="600" fill="${MUTED}" text-anchor="end">0</text>`)
  }
  for (const { from, to, colour = INK, label, labelAt, segment } of lines) {
    // Clip the line through `from` and `to` to the grid; a `segment` runs only from one to the other.
    const dx = to.x - from.x, dy = to.y - from.y
    let lo = -Infinity, hi = Infinity
    if (segment) { lo = 0; hi = 1 }
    else for (const [d, s, a, b] of [[dx, from.x, x0, x1], [dy, from.y, y0, y1]]) if (d) { const t1 = (a - s) / d, t2 = (b - s) / d; lo = Math.max(lo, Math.min(t1, t2)); hi = Math.min(hi, Math.max(t1, t2)) }
    const a = { x: from.x + lo * dx, y: from.y + lo * dy }, b = { x: from.x + hi * dx, y: from.y + hi * dy }
    parts.push(`<line x1="${px(a.x)}" y1="${py(a.y)}" x2="${px(b.x)}" y2="${py(b.y)}" stroke="${colour}" stroke-width="3.5" stroke-linecap="round"/>`)
    // Labels: an up-and-down line's at its foot, beside it; an across line's at its right end, above it.
    // `labelAt` moves it along the line (a y for an up-and-down line, an x for an across one).
    if (label) parts.push(dy && !dx ? text(px(a.x) + 8, labelAt === undefined ? py(y0) - 8 : py(labelAt), label, { size: 17, colour, italic: true }) : labelAt === undefined ? text(px(x1) - 8, py(b.y) - 8, label, { size: 17, colour, italic: true, anchor: 'end' }) : text(px(labelAt), py(b.y) - 8, label, { size: 17, colour, italic: true, anchor: 'middle' }))
  }
  for (const { from, to, label, dashed, colour: own } of legs) {
    const across = from.y === to.y, colour = own ?? (across ? AMBER : BIRO)
    // A dashed reading line, from a point to an axis: no arrowhead, no size.
    if (dashed) { parts.push(`<line x1="${px(from.x)}" y1="${py(from.y)}" x2="${px(to.x)}" y2="${py(to.y)}" stroke="${colour}" stroke-width="3.5" stroke-dasharray="2 8" stroke-linecap="round"/>`); continue }
    const [ax, ay, bx, by] = [px(from.x), py(from.y), px(to.x), py(to.y)], dir = across ? Math.sign(bx - ax) : Math.sign(by - ay)
    const head = across ? `M${bx - dir * 9} ${by - 6}L${bx} ${by}L${bx - dir * 9} ${by + 6}` : `M${bx - 6} ${by - dir * 9}L${bx} ${by}L${bx + 6} ${by - dir * 9}`
    parts.push(`<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${colour}" stroke-width="4" stroke-linecap="round"/><path d="${head}" fill="none" stroke="${colour}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`)
    parts.push(across ? text((ax + bx) / 2, ay - 9, label, { size: 20, weight: 800, colour, anchor: 'middle' }) : text(ax - 9, (ay + by) / 2 + 7, label, { size: 20, weight: 800, colour, anchor: 'end' }))
  }
  for (const p of rings) parts.push(`<circle cx="${px(p.x)}" cy="${py(p.y)}" r="11" fill="none" stroke="${PURPLE}" stroke-width="2.5"/>`)
  for (const { x, y, label = `(${show(x)}, ${show(y)})`, dx = 1, dy = 1 } of points) {
    parts.push(`<circle cx="${px(x)}" cy="${py(y)}" r="5.5" fill="${INK}" stroke="#fff" stroke-width="2"/>`)
    if (label) parts.push(text(px(x) + dx * 11, py(y) + (dy > 0 ? 25 : -13), label, { anchor: dx > 0 ? 'start' : 'end' }).replace(`>${label}<`, `>${pair(x, y, label)}<`))
  }
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Poppins, Lato, sans-serif">${parts.join('')}${late.join('')}</svg>`
}
/** The axis numbers in points' brackets, highlighted (x amber, y biro blue). */
const marksOf = (...ps) => ps.flatMap(p => [{ axis: 'x', value: p.x }, { axis: 'y', value: p.y }])
const pt = (x, y, extra = {}) => ({ x, y, ...extra })

module.exports = { graph, pair, tex, marksOf, pt, show, COLOURS: { INK, BIRO, AMBER, GREEN, PURPLE, GRID, MUTED }, AXIS }

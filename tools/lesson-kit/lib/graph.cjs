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
 * reads, in that step's colour: [{ axis: 'x' | 'y', value, colour }]. `curves` (optional) are smooth curves y = f(x), as
 * [{ f, from, to, colour, label, labelAt: [x, y], anchor }]. `numbersOver` draws every axis number on top of
 * the lines, in its white halo, for a steep line that crosses the axis beside a number (off by default).
 */
function graph(options) {
  if (options.scale) return scaled(options)
  return drawn(options)
}
function drawn({ x: [x0, x1], y: [y0, y1], unit = 30, lines = [], curves = [], points = [], legs = [], rings = [], marks = [], numbers = true, numbersOver = false, axes }) {
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
  if (axes) parts.push(text(ex - 2, py(0) + 19, axes.x.name, { size: 15, italic: true, anchor: 'end' }) + text(px(0) + 9, ey + 14, axes.y.name, { size: 15, italic: true }))
  else parts.push(text(ex - 4, py(0) - 8, 'x', { size: 16, italic: true, anchor: 'end' }) + text(px(0) + 9, ey + 14, 'y', { size: 16, italic: true }))
  if (axes && numbers) { const { under, over } = scaleNumbers({ axes, marks, unit, px, py, x1, y1, W, inside }); parts.push(...under); late.push(...over) }
  else if (numbers) {
    const marked = (axis, v) => marks.find(m => m.axis === axis && m.value === v) && { colour: AXIS[axis] }
    const number = (axis, v, x, y, anchor) => {
      const m = marked(axis, v), words = show(v), [nx, ny] = inside(x, y, words, 12, anchor)
      if (!m) return `<text x="${nx}" y="${ny}" font-size="12" font-weight="600" fill="${MUTED}" text-anchor="${anchor}" paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round">${words}</text>`
      const w = words.length * 7.5 + 8, left = anchor === 'end' ? nx - w + 4 : nx - w / 2
      return `<rect x="${left}" y="${ny - 12}" width="${w}" height="16" rx="8" fill="${m.colour}"/><text x="${anchor === 'end' ? nx : nx}" y="${ny}" font-size="12" font-weight="800" fill="#fff" text-anchor="${anchor}">${words}</text>`
    }
    // The grid's edge numbers are left off so nothing sits outside; 0 is written once, by the origin.
    // Highlighted numbers go on top of everything, so no line or ring hides them.
    for (const x of range(x0 + 1, x1 - 1).filter(x => x)) (marked('x', x) || numbersOver ? late : parts).push(number('x', x, px(x), py(0) + 15, 'middle'))
    for (const y of range(y0 + 1, y1 - 1).filter(y => y)) (marked('y', y) || numbersOver ? late : parts).push(number('y', y, px(0) - 6, py(y) + 4, 'end'))
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
  // Curves (optional): y = f(x), drawn smooth by sampling it every 1/32 of a square from `from` to `to`, never as
  // straight bits between plotted points. Cut where it leaves the grid's top or bottom; a new piece starts where it
  // comes back in. `label` goes at `labelAt` ([x, y] on the grid), kept inside the grid like every other label.
  for (const { f, from = x0, to = x1, colour = INK, label, labelAt, anchor = 'start', size = 17 } of curves) {
    const lo = Math.max(from, x0), hi = Math.min(to, x1), n = Math.max(2, Math.ceil((hi - lo) * 32))
    const isIn = v => v >= y0 && v <= y1
    const edge = (a, b) => {
      const was = isIn(f(a))
      for (let i = 0; i < 40; i++) { const mid = (a + b) / 2; if (isIn(f(mid)) === was) a = mid; else b = mid }
      const ex = (a + b) / 2
      return [ex, Math.min(Math.max(f(ex), y0), y1)]
    }
    const at = (cx, cy) => `${px(cx).toFixed(2)} ${py(cy).toFixed(2)}`
    let d = '', drawing = false, last = lo
    for (let i = 0; i <= n; i++) {
      const cx = lo + (hi - lo) * i / n, cy = f(cx)
      if (isIn(cy)) { d += drawing ? `L${at(cx, cy)}` : i ? `M${at(...edge(last, cx))}L${at(cx, cy)}` : `M${at(cx, cy)}`; drawing = true }
      else if (drawing) { d += `L${at(...edge(last, cx))}`; drawing = false }
      last = cx
    }
    if (d) parts.push(`<path d="${d}" fill="none" stroke="${colour}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`)
    if (label && labelAt) parts.push(text(px(labelAt[0]), py(labelAt[1]), label, { size, colour, italic: true, anchor }))
  }
  for (const { from, to, label, dashed, colour: own, place } of legs) {
    const across = from.y === to.y, colour = own ?? (across ? AMBER : BIRO)
    // A dashed reading line, from a point to an axis: no arrowhead, no size.
    if (dashed) { parts.push(`<line x1="${px(from.x)}" y1="${py(from.y)}" x2="${px(to.x)}" y2="${py(to.y)}" stroke="${colour}" stroke-width="3.5" stroke-dasharray="2 8" stroke-linecap="round"/>`); continue }
    const [ax, ay, bx, by] = [px(from.x), py(from.y), px(to.x), py(to.y)], dir = across ? Math.sign(bx - ax) : Math.sign(by - ay)
    const head = across ? `M${bx - dir * 9} ${by - 6}L${bx} ${by}L${bx - dir * 9} ${by + 6}` : `M${bx - 6} ${by - dir * 9}L${bx} ${by}L${bx + 6} ${by - dir * 9}`
    parts.push(`<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${colour}" stroke-width="4" stroke-linecap="round"/><path d="${head}" fill="none" stroke="${colour}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`)
    // `place` (optional) puts the size on the other side, 'below' a step across or 'right' of one up or down, or
    // 'above' a step across or 'left' of one up or down, further off it, clear of an arrowhead at its end or start.
    parts.push(across ? text((ax + bx) / 2, place === 'below' ? ay + 25 : place === 'above' ? ay - 13 : ay - 9, label, { size: 20, weight: 800, colour, anchor: 'middle' }) : place === 'right' ? text(ax + 11, (ay + by) / 2 + 7, label, { size: 20, weight: 800, colour }) : text(place === 'left' ? ax - 13 : ax - 9, (ay + by) / 2 + 7, label, { size: 20, weight: 800, colour, anchor: 'end' }))
  }
  for (const p of rings) parts.push(`<circle cx="${px(p.x)}" cy="${py(p.y)}" r="11" fill="none" stroke="${PURPLE}" stroke-width="2.5"/>`)
  for (const { x, y, label = `(${show(x)}, ${show(y)})`, dx = 1, dy = 1 } of points) {
    parts.push(`<circle cx="${px(x)}" cy="${py(y)}" r="5.5" fill="${INK}" stroke="#fff" stroke-width="2"/>`)
    if (label) parts.push(text(px(x) + dx * 11, py(y) + (dy > 0 ? 25 : -13), label, { anchor: dx > 0 ? 'start' : 'end' }).replace(`>${label}<`, `>${pair(x, y, label)}<`))
  }
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Poppins, Lato, sans-serif">${parts.join('')}${late.join('')}</svg>`
}
/**
 * Real-life axes (optional, graphs lesson 7 on): `scale: { x: { per, start, every, clock, name }, y: { per, start, every, name } }`.
 * Everything is given in its own units (hours, km): a square is `per` of them, the axes cross at the two `start`s, and
 * a number goes every `every` squares (a clock axis writes 9.5 as 09:30). The axes are named (`name`, such as "time"
 * and "km") instead of x and y. Drawn by turning every value into squares from where the axes cross, so the grid,
 * lines, steps, points and rings are drawn exactly as on any other grid. Points have no brackets unless given a label.
 */
function scaled({ scale, x, y, lines = [], legs = [], points = [], rings = [], marks = [], ...rest }) {
  const sq = (v, s) => Math.round((v - s.start) / s.per * 1e6) / 1e6
  const P = p => ({ ...p, x: sq(p.x, scale.x), y: sq(p.y, scale.y) })
  return drawn({
    ...rest, x: x.map(v => sq(v, scale.x)), y: y.map(v => sq(v, scale.y)), axes: scale,
    lines: lines.map(l => ({ ...l, from: P(l.from), to: P(l.to) })), legs: legs.map(l => ({ ...l, from: P(l.from), to: P(l.to) })),
    points: points.map(p => ({ ...P(p), label: p.label ?? '' })), rings: rings.map(P),
    marks: marks.map(m => ({ ...m, value: sq(m.value, scale[m.axis]) })),
  })
}
const clock = hours => { const m = Math.round(hours * 60); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}` }
/**
 * A real-life grid's axis numbers, in squares from where the axes cross, like the app's (GraphPictures.tsx): a number
 * every `every` squares, the last kept clear of the arrow and the axis's name, and the number where they cross on each
 * axis (the start time under it, 0 to its left). A value read that falls between the numbers (10:30) is numbered too,
 * highlighted; a highlighted time too close to the one before it drops a row so both can be read, and a plain number
 * a highlighted one would cover is left out.
 */
function scaleNumbers({ axes: { x: sx, y: sy }, marks, unit, px, py, x1, y1, W, inside }) {
  const word = (s, v) => { const real = Math.round((s.start + v * s.per) * 1e6) / 1e6; return s.clock ? clock(real) : show(real) }
  const wide = (s, v) => word(s, v).length * 7.5 + 8
  const nameX = sx.name.length * 8.5 + 10
  const ticks = (to, every, end) => { const out = []; for (let v = every; v < to - end + 1e-9 && v < to - 1e-9; v += every) out.push(v); return out }
  const xs = ticks(x1, sx.every ?? 1, 1 + nameX / unit), ys = ticks(y1, sy.every ?? 1, 1)
  const lit = axis => marks.filter(m => m.axis === axis).map(m => m.value)
  const litX = [...new Set(lit('x'))].sort((a, b) => a - b), litY = lit('y')
  // Rows for the highlighted times: down a row from the one before when they would touch, or from the axis's name.
  const row = new Map()
  litX.forEach((v, i) => {
    const prev = litX[i - 1], half = wide(sx, v) / 2
    const r = prev !== undefined && px(v) - half < px(prev) + wide(sx, prev) / 2 + 2 ? 1 - row.get(prev) : px(v) + half > W - 6 - nameX ? 1 : 0
    row.set(v, r)
  })
  const covered = v => litX.some(m => m !== v && !row.get(m) && Math.abs(px(m) - px(v)) < (wide(sx, m) + wide(sx, v)) / 2)
  const plain = (words, x, y, anchor) => { const [nx, ny] = inside(x, y, words, 12, anchor); return `<text x="${nx}" y="${ny}" font-size="12" font-weight="600" fill="${MUTED}" text-anchor="${anchor}" paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round">${words}</text>` }
  const pill = (words, x, y, anchor, colour) => {
    const [nx, ny] = inside(x, y, words, 12, anchor), w = words.length * 7.5 + 8, left = anchor === 'end' ? nx - w + 4 : nx - w / 2
    return `<rect x="${left}" y="${ny - 12}" width="${w}" height="16" rx="8" fill="${colour}"/><text x="${nx}" y="${ny}" font-size="12" font-weight="800" fill="#fff" text-anchor="${anchor}">${words}</text>`
  }
  const under = [], over = []
  for (const v of [0, ...xs, ...litX.filter(v => v && !xs.includes(v))]) {
    const on = litX.includes(v)
    if (on) over.push(pill(word(sx, v), px(v), py(0) + 15 + 21 * row.get(v), 'middle', AMBER))
    // The start time sits under the cross, on a white patch so the distance axis doesn't run through it.
    else if (!covered(v)) under.push((v ? '' : `<rect x="${px(v) - word(sx, v).length * 3.6 - 2}" y="${py(0) + 4}" width="${word(sx, v).length * 7.2 + 4}" height="14" fill="#fff"/>`) + plain(word(sx, v), px(v), py(0) + 15, 'middle'))
  }
  // A plain number up the side that a highlighted one between the numbers would touch (€48 beside 50) is left out.
  const coveredY = v => litY.some(m => m !== v && Math.abs(py(m) - py(v)) < 17)
  for (const v of [...ys, ...litY.filter(v => v && !ys.includes(v))]) if (litY.includes(v) || !coveredY(v)) (litY.includes(v) ? over : under).push((litY.includes(v) ? pill : plain)(word(sy, v), px(0) - 6, py(v) + 4, 'end', BIRO))
  // 0 km where the axes cross: to the left of the cross, above the time axis.
  if (litY.includes(0)) over.push(pill(word(sy, 0), px(0) - 6, py(0) - 5, 'end', BIRO))
  else under.push(plain(word(sy, 0), px(0) - 6, py(0) - 5, 'end'))
  return { under, over }
}
/** The axis numbers in points' brackets, highlighted (x amber, y biro blue). */
const marksOf = (...ps) => ps.flatMap(p => [{ axis: 'x', value: p.x }, { axis: 'y', value: p.y }])
const pt = (x, y, extra = {}) => ({ x, y, ...extra })

/**
 * A table of values: two rows, x (amber) over y (biro blue), drawn as plain HTML. A y left as null is an empty cell.
 * `lit` lights a column (its x amber, its y blue, white numbers, like a marked axis number), `grey` greys finished
 * columns out, and `answer` shows that column's y in the green answer style.
 */
function table({ x, y = x.map(() => null), lit = [], grey = [], answer = [], size = 22 }) {
  const has = (list, i) => [].concat(list).includes(i)
  const cell = (v, i, colour) => {
    const on = has(lit, i), green = colour === BIRO && has(answer, i)
    const style = green ? `background:#e2f5ea;color:${GREEN};box-shadow:inset 0 0 0 2px #8fd1ad`
      : on && v !== null ? `background:${colour};color:#fff` : `color:${colour}`
    return `<td style="${style};${has(grey, i) && !on && !green ? 'opacity:.4;' : ''}border:1.5px solid ${GRID};min-width:${size * 2}px;height:${size * 1.7}px;padding:0 ${size * 0.4}px;text-align:center;font-weight:700">${v === null ? '' : show(v)}</td>`
  }
  const head = (name, colour) => `<th style="color:${colour};border:1.5px solid ${GRID};background:#f6f8fc;padding:0 ${size * 0.5}px;font-style:italic;font-weight:700">${name}</th>`
  return `<table style="display:inline-table;border-collapse:collapse;font-size:${size}px;font-variant-numeric:tabular-nums;line-height:1;margin:0 auto">`
    + `<tr>${head('x', AMBER)}${x.map((v, i) => cell(v, i, AMBER)).join('')}</tr>`
    + `<tr>${head('y', BIRO)}${y.map((v, i) => cell(v, i, BIRO)).join('')}</tr></table>`
}

module.exports = { graph, clock, table, pair, tex, marksOf, pt, show, COLOURS: { INK, BIRO, AMBER, GREEN, PURPLE, GRID, MUTED }, AXIS }

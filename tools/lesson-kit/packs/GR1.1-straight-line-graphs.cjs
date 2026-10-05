// GR1.1 Straight line graphs: the video on lesson 26's gradient worked example (the line through (1, 2) and (3, 8)),
// and its worksheet. From the GR1 pages of Sunny's book scan (p70–71); every number is our own. The worked example and
// its steps are the lesson's own (src/features/straight-line-graphs/tutor/).
module.exports = ({ line, big, result, answer, row, picture }) => {
  const INK = '#17213a', BIRO = '#2443b5', AMBER = '#b45309', GREEN = '#0d7446', PURPLE = '#7c3aed', GRID = '#d5ddea', MUTED = '#5e6886'
  const show = n => String(n).replace('-', '−')
  /**
   * A grid drawn to its numbers: one square per unit, the axes, straight lines edge to edge (each through two points),
   * points with their coordinates, the steps between two points (across amber, up or down biro blue) and rings.
   */
  function graph({ x: [x0, x1], y: [y0, y1], unit = 30, lines = [], points = [], legs = [], rings = [], numbers = true }) {
    const L = 30, R = 26, T = 24, B = 28
    const W = L + R + (x1 - x0) * unit, H = T + B + (y1 - y0) * unit
    const px = x => L + (x - x0) * unit, py = y => T + (y1 - y) * unit
    const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
    const parts = []
    for (const x of range(x0, x1)) parts.push(`<line x1="${px(x)}" x2="${px(x)}" y1="${py(y1)}" y2="${py(y0)}" stroke="${GRID}" stroke-width="1"/>`)
    for (const y of range(y0, y1)) parts.push(`<line x1="${px(x0)}" x2="${px(x1)}" y1="${py(y)}" y2="${py(y)}" stroke="${GRID}" stroke-width="1"/>`)
    parts.push(`<path d="M${px(x0)} ${py(0)}H${px(x1) + 8}M${px(x1) + 2} ${py(0) - 5}L${px(x1) + 9} ${py(0)}L${px(x1) + 2} ${py(0) + 5}M${px(0)} ${py(y0)}V${py(y1) - 8}M${px(0) - 5} ${py(y1) - 2}L${px(0)} ${py(y1) - 9}L${px(0) + 5} ${py(y1) - 2}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`)
    parts.push(`<text x="${px(x1) + 6}" y="${py(0) + 20}" font-size="16" font-style="italic" font-weight="700" fill="${INK}">x</text><text x="${px(0) + 9}" y="${py(y1) - 6}" font-size="16" font-style="italic" font-weight="700" fill="${INK}">y</text>`)
    if (numbers) {
      for (const x of range(x0, x1).filter(x => x)) parts.push(`<text x="${px(x)}" y="${py(0) + 17}" font-size="12" font-weight="600" fill="${MUTED}" text-anchor="middle">${show(x)}</text>`)
      for (const y of range(y0, y1).filter(y => y)) parts.push(`<text x="${px(0) - 6}" y="${py(y) + 4}" font-size="12" font-weight="600" fill="${MUTED}" text-anchor="end">${show(y)}</text>`)
      parts.push(`<text x="${px(0) - 6}" y="${py(0) + 17}" font-size="12" font-weight="600" fill="${MUTED}" text-anchor="end">0</text>`)
    }
    for (const { from, to, colour = INK, label } of lines) {
      // Clip the line through `from` and `to` to the grid.
      const dx = to.x - from.x, dy = to.y - from.y
      let lo = -Infinity, hi = Infinity
      for (const [d, s, a, b] of [[dx, from.x, x0, x1], [dy, from.y, y0, y1]]) if (d) { const t1 = (a - s) / d, t2 = (b - s) / d; lo = Math.max(lo, Math.min(t1, t2)); hi = Math.min(hi, Math.max(t1, t2)) }
      const a = { x: from.x + lo * dx, y: from.y + lo * dy }, b = { x: from.x + hi * dx, y: from.y + hi * dy }
      parts.push(`<line x1="${px(a.x)}" y1="${py(a.y)}" x2="${px(b.x)}" y2="${py(b.y)}" stroke="${colour}" stroke-width="3.5" stroke-linecap="round"/>`)
      if (label) { const top = b.y > a.y ? b : a; parts.push(`<text x="${px(top.x) + (dx ? 0 : 8)}" y="${py(top.y) + (dx ? -8 : 34)}" font-size="17" font-weight="700" font-style="italic" fill="${colour}" text-anchor="${dx ? 'middle' : 'start'}">${label}</text>`) }
    }
    for (const { from, to, label } of legs) {
      const across = from.y === to.y, colour = across ? AMBER : BIRO
      const [ax, ay, bx, by] = [px(from.x), py(from.y), px(to.x), py(to.y)], dir = across ? Math.sign(bx - ax) : Math.sign(by - ay)
      const head = across ? `M${bx - dir * 9} ${by - 6}L${bx} ${by}L${bx - dir * 9} ${by + 6}` : `M${bx - 6} ${by - dir * 9}L${bx} ${by}L${bx + 6} ${by - dir * 9}`
      parts.push(`<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${colour}" stroke-width="4" stroke-linecap="round"/><path d="${head}" fill="none" stroke="${colour}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`)
      parts.push(across ? `<text x="${(ax + bx) / 2}" y="${ay - 9}" font-size="20" font-weight="800" fill="${colour}" text-anchor="middle">${label}</text>` : `<text x="${ax - 9}" y="${(ay + by) / 2 + 7}" font-size="20" font-weight="800" fill="${colour}" text-anchor="end">${label}</text>`)
    }
    for (const p of rings) parts.push(`<circle cx="${px(p.x)}" cy="${py(p.y)}" r="11" fill="none" stroke="${PURPLE}" stroke-width="2.5"/>`)
    for (const { x, y, label = `(${show(x)}, ${show(y)})`, dx = 1, dy = 1 } of points) {
      parts.push(`<circle cx="${px(x)}" cy="${py(y)}" r="5.5" fill="${INK}" stroke="#fff" stroke-width="2"/>`)
      if (label) parts.push(`<text x="${px(x) + dx * 8}" y="${py(y) + (dy > 0 ? 22 : -10)}" font-size="15" font-weight="700" fill="${INK}" text-anchor="${dx > 0 ? 'start' : 'end'}" paint-order="stroke" stroke="#fff" stroke-width="5" stroke-linejoin="round">${label}</text>`)
    }
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Poppins, Lato, sans-serif">${parts.join('')}</svg>`
  }
  const pt = (x, y, extra = {}) => ({ x, y, ...extra })
  const gradientOf = (a, b) => (b.y - a.y) / (b.x - a.x)
  const onLine = (a, b, p) => (b.x - a.x) * (p.y - a.y) === (b.y - a.y) * (p.x - a.x)

  // The video's line: through (1, 2) and (3, 8), gradient 3 (y = 3x − 1).
  const A = pt(1, 2), Bp = pt(3, 8)
  const steep = { x: [-1, 4], y: [-2, 9], unit: 22 }
  const base = { ...steep, lines: [{ from: A, to: Bp }] }
  const marked = { ...base, points: [pt(1, 2, { dx: 1, dy: 1 }), pt(3, 8, { dx: 1, dy: 1 })] }
  const upLeg = { from: A, to: pt(1, 8), label: '6' }, acrossLeg = { from: pt(1, 8), to: Bp, label: '2' }
  const side = (svg, ...words) => row(picture(svg), `<div style="display:flex;flex-direction:column;gap:14px;max-width:420px;text-align:left">${words.join('')}</div>`)

  return {
    code: 'GR1.1', topic: 'Straight line graphs: gradient', strand: 'Graphs', file: 'GR1.1_Straight_Line_Graphs',

    // Every answer below, worked out again. The kit stops if any is false.
    checks: {
      'the video line goes through (1, 2) and (3, 8), gradient 3': gradientOf(A, Bp) === 3 && onLine(A, Bp, pt(0, -1)),
      'up 6 and across 2 from (1, 2) reach (3, 8)': A.y + 6 === Bp.y && A.x + 2 === Bp.x,
      'from the coordinates: (8 − 2) ÷ (3 − 1) = 3': (8 - 2) / (3 - 1) === 3,
      'the negative example: through (−1, 3) and (2, −3), gradient −2': gradientOf(pt(-1, 3), pt(2, -3)) === -2,
      'Q1 line through (1, 2) and (3, 8): gradient 3': gradientOf(pt(1, 2), pt(3, 8)) === 3,
      'Q4 line through (−1, −3) and (2, 3): gradient 2': gradientOf(pt(-1, -3), pt(2, 3)) === 2,
      'Q5 (3, 4) and (7, 16): gradient 3': gradientOf(pt(3, 4), pt(7, 16)) === 3,
      'Q6 line through (−2, 3) and (4, 0): gradient −1/2': gradientOf(pt(-2, 3), pt(4, 0)) === -0.5,
      'Q7 (−5, 2) and (3, −6): gradient −1': gradientOf(pt(-5, 2), pt(3, -6)) === -1,
      'Q8 (2, 9) and (5, 3): gradient −2, not 2': gradientOf(pt(2, 9), pt(5, 3)) === -2 && (9 - 3) / (5 - 2) === 2,
    },

    video: {
      slides: [
        { hero: 'How steep is the line?', sub: 'The gradient: how far a line goes up for every one square across', items: [
          [picture(graph({ ...base, unit: 19 })), 3.2]] },
        { stage: 'Step 1 · two points', title: 'Pick two points on the line', items: [
          [side(graph(base), line('choose two points where the line crosses grid corners exactly')), 3.2],
          [side(graph({ ...marked, rings: [A, Bp] }), line('choose two points where the line crosses grid corners exactly'), result('(1, 2) \\text{ and } (3, 8)')), 3.6, 0]] },
        { stage: 'Step 2 · change in y', title: 'Count up', from: '$(1, 2)$ and $(3, 8)$', items: [
          [side(graph({ ...marked, legs: [upLeg] }), line('from $y = 2$ up to $y = 8$'), result('\\text{change in } y = 6')), 3.8]] },
        { stage: 'Step 3 · change in x', title: 'Count across', from: 'change in $y$ = $6$', items: [
          [side(graph({ ...marked, legs: [upLeg, acrossLeg] }), line('from $x = 1$ across to $x = 3$'), result('\\text{change in } x = 2')), 3.8]] },
        { stage: 'Step 4 · divide', title: 'Up over across', from: 'up $6$, across $2$', items: [
          [big('\\text{gradient} = \\dfrac{\\text{change in } y}{\\text{change in } x}'), 3.2],
          [answer('gradient $= \\dfrac{6}{2} = 3$'), 3.2],
          [line('for every **1** square across, the line goes up **3**'), 3.4]] },
        { title: 'Only the two points?', from: '$(1, 2)$ and $(3, 8)$', items: [
          [line('no grid needed: subtract, in the same order both times'), 3],
          [row(result('8 - 2 = 6'), result('3 - 1 = 2')), 3.6],
          [answer('gradient $= 6 \\div 2 = 3$ ✓'), 3.4]] },
        { title: 'Up or down?', items: [
          [row(picture(graph({ x: [-2, 3], y: [-2, 4], unit: 24, numbers: false, lines: [{ from: pt(0, -1), to: pt(1, 2) }] })), picture(graph({ x: [-2, 3], y: [-3, 4], unit: 24, numbers: false, lines: [{ from: pt(-1, 3), to: pt(2, -3) }] }))), 3.2],
          [line('going **up** from left to right: a **positive** gradient'), 3],
          [line('going **down** from left to right: a **negative** gradient, like $-2$'), 3.6]] },
      ],
      recap: ['Pick two points on grid corners', 'Gradient = change in y ÷ change in x', 'Up from left to right: positive. Down: negative'],
    },

    worksheet: {
      title: 'Straight Line Graphs: Gradient',
      questions: [
        { n: '1', level: 'worked', marks: 2, question: 'Work out the gradient of the line drawn below.', figure: graph({ ...base, unit: 22 }), working: [
          { say: 'Pick two points on grid corners: $(1, 2)$ and $(3, 8)$' },
          { picture: graph({ ...marked, unit: 22, legs: [upLeg, acrossLeg] }) },
          { say: 'Up $6$, across $2$' }, { mark: 'Change in $y$ and change in $x$' },
          { math: '\\text{gradient} = 6 \\div 2' }, { answer: 'Gradient $= 3$' }] },
        { n: '2', level: 'easy', marks: 1, question: 'Write down the equation of the line drawn below.', figure: graph({ x: [-4, 3], y: [-3, 3], unit: 22, lines: [{ from: pt(-1, 0), to: pt(-1, 1) }] }), working: [
          { say: 'It goes up and down, and every point on it has $x = -1$' }, { answer: '$x = -1$' }] },
        { n: '3', level: 'easy', marks: 2, question: 'Draw the lines $y = 1$ and $x = 4$ on the grid.', figure: graph({ x: [-2, 5], y: [-2, 4], unit: 22 }), working: [
          { picture: graph({ x: [-2, 5], y: [-2, 4], unit: 22, lines: [{ from: pt(0, 1), to: pt(1, 1), colour: GREEN, label: 'y = 1' }, { from: pt(4, 0), to: pt(4, 1), colour: GREEN, label: 'x = 4' }] }) },
          { mark: '$y = 1$ across, through $(0, 1)$' }, { answer: '$x = 4$ up and down, through $(4, 0)$' }] },
        { n: '4', level: 'medium', marks: 2, question: 'Work out the gradient of the line drawn below.', figure: graph({ x: [-2, 3], y: [-4, 4], unit: 22, lines: [{ from: pt(-1, -3), to: pt(2, 3) }] }), working: [
          { say: 'Two points on grid corners: $(-1, -3)$ and $(2, 3)$' }, { math: '\\text{change in } y = 6, \\quad \\text{change in } x = 3' }, { mark: 'Both changes' },
          { answer: 'Gradient $= 6 \\div 3 = 2$' }] },
        { n: '5', level: 'medium', marks: 2, question: 'Work out the gradient of the line that passes through $(3, 4)$ and $(7, 16)$.', working: [
          { say: 'Subtract in the same order both times' }, { math: '\\text{change in } y = 16 - 4 = 12' }, { math: '\\text{change in } x = 7 - 3 = 4' }, { mark: 'Both changes' },
          { answer: 'Gradient $= 12 \\div 4 = 3$' }] },
        { n: '6', level: 'hard', marks: 2, question: 'Work out the gradient of the line drawn below.', figure: graph({ x: [-3, 5], y: [-1, 4], unit: 22, lines: [{ from: pt(-2, 3), to: pt(4, 0) }] }), working: [
          { say: 'The line goes down from left to right, so the gradient is negative' }, { math: '(-2, 3) \\text{ to } (4, 0): \\text{ down } 3, \\text{ across } 6' }, { mark: 'Change in $y = -3$, change in $x = 6$' },
          { answer: 'Gradient $= -3 \\div 6 = -\\tfrac{1}{2}$' }] },
        { n: '7', level: 'very hard', marks: 2, question: 'Work out the gradient of the line that passes through $(-5, 2)$ and $(3, -6)$.', working: [
          { math: '\\text{change in } y = -6 - 2 = -8' }, { math: '\\text{change in } x = 3 - (-5) = 8' }, { mark: 'Both changes, signs right' },
          { answer: 'Gradient $= -8 \\div 8 = -1$' }] },
        { n: '8', level: 'very hard', marks: 2, question: ['Priya works out the gradient of the line through $(2, 9)$ and $(5, 3)$.', 'She writes $9 - 3 = 6$ and $5 - 2 = 3$, so the gradient is $2$. Is Priya correct? Explain.'], working: [
          { say: 'She took the $y$’s first point minus second, but the $x$’s second minus first' },
          { math: '\\text{change in } y = 3 - 9 = -6, \\quad \\text{change in } x = 5 - 2 = 3' }, { mark: 'Same order both times' },
          { answer: 'No: the gradient is $-6 \\div 3 = -2$. The line goes down.' }] },
      ],
    },
  }
}

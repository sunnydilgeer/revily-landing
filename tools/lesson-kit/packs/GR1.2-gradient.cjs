// GR1.2 Gradient: the video for graphs lesson 3, and its worksheet. From GR1 in Sunny's book scan (p70–71); every
// number is our own. This redoes GR1.1's gradient video in the order Sunny chose (7 Oct): count ACROSS first (amber),
// THEN up or down (biro blue), and say "up over across": up 6, across 2: 6 ÷ 2 = 3. The storyboard is
// /mnt/project-files/lessons/graphs/L3-gradient/STORYBOARD.md.
module.exports = ({ m, line, big, answer, row, picture }) => {
  const { graph, tex, marksOf, pt, COLOURS: { AMBER, BIRO, INK } } = require('../lib/graph.cjs')
  const X = v => `\\textcolor{${AMBER}}{${v}}`, Y = v => `\\textcolor{${BIRO}}{${v}}`
  // A bracketed negative in a sum: (−3), or a plain 3.
  const bx = v => v < 0 ? `(${X(v)})` : X(v), by = v => v < 0 ? `(${Y(v)})` : Y(v)
  // The working pill: words in ink, so only the x numbers are amber and only the y numbers blue.
  const ink = words => `\\textcolor{${INK}}{\\text{${words}}}`
  const work = t => `<div class="result">${m(t).replace('class="m ', `style="color:${INK}" class="m `)}</div>`
  const sideAt = width => (svg, ...words) => row(picture(svg), `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;max-width:${width}px;text-align:center">${words.join('')}</div>`)
  const side = sideAt(440), wide = sideAt(540)
  const x = v => ({ axis: 'x', value: v }), y = v => ({ axis: 'y', value: v })
  const gradientOf = (a, b) => (b.y - a.y) / (b.x - a.x)
  const onLine = (a, b, p) => (b.x - a.x) * (p.y - a.y) === (b.y - a.y) * (p.x - a.x)
  const across = g => g.x[1] - g.x[0]
  const inside = (g, ...ps) => ps.every(p => p.x > g.x[0] && p.x < g.x[1] && p.y > g.y[0] && p.y < g.y[1])
  // The two steps between two points: across first, from the first point (amber), then up or down to the second (blue).
  // No sizes on the arrows: the working line says them.
  const steps = (a, b) => [{ from: a, to: pt(b.x, a.y), label: '' }, { from: pt(b.x, a.y), to: b, label: '' }]
  // Every leg ends where it should: the across leg at the second point's x, the up leg on the second point.
  const reaches = (a, b) => { const [s, u] = steps(a, b); return s.from.y === s.to.y && s.to.x === b.x && u.from.x === u.to.x && u.to.y === b.y }
  // "up 6, across 2: 6 ÷ 2 = 3", the numbers coloured.
  const frac = big(`\\textcolor{${INK}}{\\text{gradient} = \\dfrac{${Y('\\text{up}')}}{${X('\\text{across}')}}}`)
  const upOver = (up, acr, g) => `${up < 0 ? 'down' : 'up'} $${Y(Math.abs(up))}$, across $${X(acr)}$: $${Y(up)} \\div ${X(acr)} = ${g}$`

  // The video's line: through (1, 2) and (3, 8): across 2, up 6, gradient 3 (y = 3x − 1).
  const A = pt(1, 2), B = pt(3, 8)
  const upGrid = { x: [-1, 6], y: [-1, 9], unit: 30 }
  const upBase = { ...upGrid, lines: [{ from: A, to: B }] }
  const upPts = { ...upBase, points: [pt(1, 2, { dx: 1, dy: 1 }), pt(3, 8, { dx: 1, dy: 1 })] }
  const [upAcross, upUp] = steps(A, B)
  // Going down: through (1, 5) and (3, 1): across 2, down 4, gradient −2 (y = −2x + 7).
  const C = pt(1, 5), D = pt(3, 1)
  // The line crosses the y axis at 7, so the axis numbers go on top of it.
  const downGrid = { x: [-1, 6], y: [-1, 8], unit: 34, numbersOver: true }
  const downPts = { ...downGrid, lines: [{ from: C, to: D }], points: [pt(1, 5, { dx: 1, dy: -1 }), pt(3, 1, { dx: 1, dy: -1 })] }
  const [downAcross, downDown] = steps(C, D)
  // No grid: (1, 2) and (4, 8): 4 − 1 = 3 across, 8 − 2 = 6 up, gradient 2.
  const E = pt(1, 2), F = pt(4, 8)

  // Worksheet lines: each through two points on grid corners, labelled where nothing else is.
  const w = 22
  const q1 = { a: A, b: B, grid: { ...upGrid, unit: w } }
  const q2 = { a: pt(1, -2), b: pt(3, 6), grid: { x: [-1, 6], y: [-4, 7], unit: w }, at: [{ dx: 1, dy: 1 }, { dx: 1, dy: 1 }] }
  const q3 = { a: pt(2, 2), b: pt(6, 4), grid: { x: [-1, 8], y: [-1, 6], unit: w }, at: [{ dx: 1, dy: 1 }, { dx: -1, dy: -1 }] }
  // A bigger square, so the line clears the y axis numbers.
  const q4 = { a: pt(-1, 3), b: pt(2, -3), grid: { x: [-4, 5], y: [-5, 5], unit: 30 }, at: [{ dx: -1, dy: 1 }, { dx: -1, dy: 1 }] }
  const drawn = ({ a, b, grid, at = [{}, {}] }) => ({ ...grid, lines: [{ from: a, to: b }], points: [pt(a.x, a.y, at[0]), pt(b.x, b.y, at[1])] })
  const figure = q => graph(drawn(q))
  // The answer's picture: the two steps on the line. Only the worked example lights its axis numbers, as the video
  // does; in the others the brackets already say them (and Q2's and Q4's steps run across the axis numbers).
  const solved = (q, lit = false) => graph({ ...drawn(q), legs: steps(q.a, q.b), marks: lit ? marksOf(q.a, q.b) : [] })
  // From two points: across = second x − first x, up = second y − first y, the same order both times.
  const fromPoints = (a, b) => [
    { math: `${ink('across:')}\\ ${X(b.x)} - ${bx(a.x)} = ${X(b.x - a.x)}` },
    { math: `${ink('up:')}\\ ${Y(b.y)} - ${by(a.y)} = ${Y(b.y - a.y)}` }]
  const graphs = [q1, q2, q3, q4]

  return {
    code: 'GR1.2', topic: 'Gradient', strand: 'Graphs', file: 'GR1.2_Gradient',

    // Every answer below, worked out again. The kit stops if any is false.
    checks: {
      'the video line goes through (1, 2) and (3, 8), gradient 3 (y = 3x − 1)': gradientOf(A, B) === 3 && onLine(A, B, pt(0, -1)),
      'across 2 from (1, 2), then up 6, reaches (3, 8)': reaches(A, B) && upAcross.to.x - upAcross.from.x === 2 && upUp.to.y - upUp.from.y === 6,
      'up 6 over across 2 is 3': 6 / 2 === 3,
      'going down: through (1, 5) and (3, 1), across 2, down 4, gradient −2': reaches(C, D) && downAcross.to.x - downAcross.from.x === 2 && downDown.to.y - downDown.from.y === -4 && gradientOf(C, D) === -2,
      'no grid: (1, 2) and (4, 8): 4 − 1 = 3, 8 − 2 = 6, gradient 2': F.x - E.x === 3 && F.y - E.y === 6 && gradientOf(E, F) === 2,
      'subtracting the other way round both times gives the same gradient': gradientOf(F, E) === gradientOf(E, F) && gradientOf(D, C) === gradientOf(C, D),
      'Q1 (worked): (1, 2) and (3, 8) → 3': gradientOf(q1.a, q1.b) === 3,
      'Q2: line through (1, −2) and (3, 6): across 2, up 8 → 4': reaches(q2.a, q2.b) && q2.b.x - q2.a.x === 2 && q2.b.y - q2.a.y === 8 && gradientOf(q2.a, q2.b) === 4,
      'Q3: line through (2, 2) and (6, 4): across 4, up 2 → 1/2': q3.b.x - q3.a.x === 4 && q3.b.y - q3.a.y === 2 && gradientOf(q3.a, q3.b) === 1 / 2,
      'Q4: line through (−1, 3) and (2, −3): across 3, down 6 → −2': q4.b.x - q4.a.x === 3 && q4.b.y - q4.a.y === -6 && gradientOf(q4.a, q4.b) === -2,
      'Q5: (2, 3) and (4, 9): 4 − 2 = 2, 9 − 3 = 6 → 3': 4 - 2 === 2 && 9 - 3 === 6 && gradientOf(pt(2, 3), pt(4, 9)) === 3,
      'Q6: (−2, 5) and (1, −4): 1 − (−2) = 3, −4 − 5 = −9 → −3': 1 - -2 === 3 && -4 - 5 === -9 && gradientOf(pt(-2, 5), pt(1, -4)) === -3,
      'Q7: (−3, 2) and (3, −1): 3 − (−3) = 6, −1 − 2 = −3 → −1/2': 3 - -3 === 6 && -1 - 2 === -3 && gradientOf(pt(-3, 2), pt(3, -1)) === -1 / 2,
      'Q8: (2, 1) and (−2, 2): −2 − 2 = −4, 2 − 1 = 1 → −1/4, and it goes down left to right': -2 - 2 === -4 && 2 - 1 === 1 && gradientOf(pt(2, 1), pt(-2, 2)) === -1 / 4 && pt(-2, 2).y > pt(2, 1).y,
      'Q9: Sam’s across ÷ up for (1, 3) and (3, 9) is 1/3, the gradient is 3': (3 - 1) / (9 - 3) === 1 / 3 && gradientOf(pt(1, 3), pt(3, 9)) === 3,
      'every point is inside its grid': inside(upGrid, A, B) && inside(downGrid, C, D) && graphs.every(q => inside(q.grid, q.a, q.b)),
      'every point is on its line': graphs.every(q => onLine(q.a, q.b, q.a) && onLine(q.a, q.b, q.b)) && onLine(C, D, pt(0, 7)),
      'every worksheet line goes up and down by whole squares': graphs.every(q => reaches(q.a, q.b) && Number.isInteger(q.b.x - q.a.x) && Number.isInteger(q.b.y - q.a.y)),
      'no grid is more than 9 squares across': [upGrid, downGrid, ...graphs.map(q => q.grid)].every(g => across(g) <= 9),
    },

    video: {
      slides: [
        { hero: 'How steep is the line?', sub: 'The gradient: up over across', items: [
          [picture(graph({ ...upBase, unit: 26 })), 2.6]] },
        { stage: 'Step 1 · two points', title: 'Pick two points on the line', opening: 1.2, items: [
          [side(graph(upBase), line('two points where the line crosses grid corners')), 2.4],
          [side(graph({ ...upPts, rings: [A, B], marks: marksOf(A, B) }), line('two points where the line crosses grid corners'), work(`${tex(1, 2)} \\text{ and } ${tex(3, 8)}`)), 3.4, 0]] },
        { stage: 'Step 2 · across', title: 'Count across first', from: `$${tex(1, 2)}$ and $${tex(3, 8)}$`, opening: 1.2, items: [
          [side(graph({ ...upPts, legs: [upAcross], marks: [x(1), x(3)] }), line(`from $${X(1)}$ to $${X(3)}$`), work(`\\text{across } ${X(2)}`)), 3.6]] },
        { stage: 'Step 3 · up', title: 'Then count up', from: `across $${X(2)}$`, opening: 1.2, items: [
          [side(graph({ ...upPts, legs: [upAcross, upUp], marks: [y(2), y(8)] }), line(`from $${Y(2)}$ to $${Y(8)}$`), work(`\\text{up } ${Y(6)}`)), 3.6]] },
        { stage: 'Step 4 · divide', title: 'Up over across', from: `across $${X(2)}$, up $${Y(6)}$`, opening: 1.2, items: [
          [side(graph({ ...upPts, legs: [upAcross, upUp] }), frac), 2.8],
          [side(graph({ ...upPts, legs: [upAcross, upUp] }), frac, answer(upOver(6, 2, 3))), 3.6, 0],
          [side(graph({ ...upPts, legs: [upAcross, upUp] }), frac, answer(upOver(6, 2, 3)), line('for every **1** across, it goes up **3**')), 3, 1]] },
        { title: 'Going down', opening: 1.2, items: [
          [wide(graph({ ...downPts, legs: [downAcross], marks: [x(1), x(3)] }), work(`\\text{across } ${X(2)}`)), 3],
          [wide(graph({ ...downPts, legs: [downAcross, downDown], marks: [y(5), y(1)] }), work(`\\text{across } ${X(2)}`), work(`\\text{down } ${Y(4)}`)), 3, 0],
          [wide(graph({ ...downPts, legs: [downAcross, downDown] }), answer(upOver(-4, 2, -2)), line('going **down** from left to right: **negative**')), 4, 1]] },
        { title: 'Only two points?', opening: 1.2, items: [
          [work(`${tex(1, 2)} \\text{ and } ${tex(4, 8)}`), 2.4],
          [line('no grid: take the first point from the second, the same order both times'), 3],
          [row(work(`\\text{across: } ${X(4)} - ${X(1)} = ${X(3)}`), work(`\\text{up: } ${Y(8)} - ${Y(2)} = ${Y(6)}`)), 3.6],
          [answer(upOver(6, 3, 2)), 3.4],
          [big(`\\textcolor{${INK}}{\\text{gradient} = \\dfrac{${Y('\\text{change in } y')}}{${X('\\text{change in } x')}} = \\dfrac{${Y('y_2 - y_1')}}{${X('x_2 - x_1')}}}`), 4]] },
      ],
      recap: ['Across first, then up', 'Gradient = up ÷ across = change in y ÷ change in x', 'From two points: (y₂ − y₁) ÷ (x₂ − x₁)', 'Up from left to right: positive. Down: negative'],
    },

    worksheet: {
      title: 'Gradient',
      questions: [
        { n: '1', level: 'worked', marks: 2, question: 'Work out the gradient of the line drawn below.', figure: figure(q1), working: [
          { say: 'Two points on grid corners. Count across first, then up' },
          { picture: solved(q1, true) },
          { mark: `Across $${X(2)}$, up $${Y(6)}$` },
          { answer: `Gradient $= ${Y(6)} \\div ${X(2)} = 3$` }] },
        { n: '2', level: 'easy', marks: 2, question: 'Work out the gradient of the line drawn below.', figure: figure(q2), working: [
          { picture: solved(q2) },
          { mark: `Across $${X(2)}$, up $${Y(8)}$` },
          { answer: `Gradient $= ${Y(8)} \\div ${X(2)} = 4$` }] },
        { n: '3', level: 'easy', marks: 2, question: 'Work out the gradient of the line drawn below.', figure: figure(q3), working: [
          { picture: solved(q3) },
          { mark: `Across $${X(4)}$, up $${Y(2)}$` },
          { answer: `Gradient $= ${Y(2)} \\div ${X(4)} = \\tfrac{1}{2}$` }] },
        { n: '4', level: 'medium', marks: 2, question: 'Work out the gradient of the line drawn below.', figure: figure(q4), working: [
          { say: 'It goes down from left to right, so the gradient is negative' },
          { picture: solved(q4) },
          { mark: `Across $${X(3)}$, down $${Y(6)}$` },
          { answer: `Gradient $= ${Y(-6)} \\div ${X(3)} = -2$` }] },
        { n: '5', level: 'medium', marks: 2, question: 'Work out the gradient of the line through $(2, 3)$ and $(4, 9)$.', working: [
          { say: 'Take the first point from the second, the same order both times' },
          ...fromPoints(pt(2, 3), pt(4, 9)), { mark: 'Across and up' },
          { answer: `Gradient $= ${Y(6)} \\div ${X(2)} = 3$` }] },
        { n: '6', level: 'hard', marks: 2, question: 'Work out the gradient of the line through $(-2, 5)$ and $(1, -4)$.', working: [
          ...fromPoints(pt(-2, 5), pt(1, -4)), { mark: 'Across and up, signs right' },
          { answer: `Gradient $= ${Y(-9)} \\div ${X(3)} = -3$` }] },
        { n: '7', level: 'hard', marks: 2, question: 'Work out the gradient of the line through $(-3, 2)$ and $(3, -1)$.', working: [
          { say: 'Gradient $= \\dfrac{y_2 - y_1}{x_2 - x_1}$: the change in $y$ over the change in $x$' },
          ...fromPoints(pt(-3, 2), pt(3, -1)), { mark: 'Across and up, signs right' },
          { answer: `Gradient $= ${Y(-3)} \\div ${X(6)} = -\\tfrac{1}{2}$` }] },
        { n: '8', level: 'very hard', marks: 2, question: 'Work out the gradient of the line through $(2, 1)$ and $(-2, 2)$.', working: [
          { say: 'The second point is on the left, so across is negative. Keep the same order for both' },
          ...fromPoints(pt(2, 1), pt(-2, 2)), { mark: 'Same order both times' },
          { answer: `Gradient $= ${Y(1)} \\div ${bx(-4)} = -\\tfrac{1}{4}$` }] },
        { n: '9', level: 'very hard', marks: 2, question: ['Sam works out the gradient of the line through $(1, 3)$ and $(3, 9)$.', 'He writes $3 - 1 = 2$ and $9 - 3 = 6$, so the gradient is $2 \\div 6 = \\tfrac{1}{3}$. Is Sam correct? Explain.'], working: [
          { say: 'Sam divided across by up. The gradient is up over across' },
          { math: `${ink('across:')}\\ ${X(3)} - ${X(1)} = ${X(2)}, \\quad ${ink('up:')}\\ ${Y(9)} - ${Y(3)} = ${Y(6)}` }, { mark: 'Says he divided across by up' },
          { answer: `No: the gradient is $${Y(6)} \\div ${X(2)} = 3$` }] },
      ],
    },
  }
}

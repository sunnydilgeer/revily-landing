// GR7.1 Simultaneous equations by graph: the video for graphs lesson 5, and its worksheet. From GR7 in Sunny's book
// scan (p84–85): each equation is a straight line, draw both on the same grid (from c and a step of the gradient, as in
// GR4.2), the solution is where they cross, check it in both, and rearrange first when an equation isn't y = mx + c.
// Every number is our own, the same as the lesson's (src/features/simultaneous-graphs/tutor/simultaneousGraphsLesson.ts).
// As in the other graphs videos, x numbers are amber and y numbers biro blue: the crossing's x is read down to the x
// axis (amber), its y across to the y axis (blue). Both lines are ink; green is only for the answer.
module.exports = ({ m, line, big, answer, row, picture }) => {
  const { graph, pt, pair, COLOURS: { AMBER, BIRO, GREEN, INK } } = require('../lib/graph.cjs')
  const X = v => `\\textcolor{${AMBER}}{${v}}`, Y = v => `\\textcolor{${BIRO}}{${v}}`, G = v => `\\textcolor{${GREEN}}{${v}}`
  const work = t => `<div class="result">${m(t).replace('class="m ', `style="color:${INK}" class="m `)}</div>`
  const checked = t => `<div class="result">${m(t).replace('class="m ', `style="color:${INK}" class="m `)} <span class="yes">✓</span></div>`
  const side = (svg, ...words) => row(picture(svg), `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;max-width:440px;text-align:center">${words.join('')}</div>`)
  const stack = (...parts) => `<div style="display:flex;flex-direction:column;align-items:center;gap:10px">${parts.join('')}</div>`
  const show = n => String(n).replace('-', '−')
  const across = g => g.x[1] - g.x[0]
  const yAxis = v => ({ axis: 'y', value: v }), xAxis = v => ({ axis: 'x', value: v })

  /** A line y = (up ÷ across)x + c, drawn from c and one step of its gradient; `eq` is ax + by = k, as it is written. */
  const L = (c, run, rise, eq, name) => ({ c, run, rise, m: rise / run, eq, name })
  const yOf = (l, x) => l.m * x + l.c
  const onLine = (l, p) => Math.abs(yOf(l, p.x) - p.y) < 1e-9 && l.eq.a * p.x + l.eq.b * p.y === l.eq.k
  /** Elimination: b₂ × the first take b₁ × the second leaves (a₁b₂ − a₂b₁)x = k₁b₂ − k₂b₁; then the same for y. */
  const eliminate = (p, q) => {
    const d = p.a * q.b - q.a * p.b
    return pt((p.k * q.b - q.k * p.b) / d, (p.a * q.k - q.a * p.k) / d)
  }
  const inside = (g, p) => p.x > g.x[0] && p.x < g.x[1] && p.y > g.y[0] && p.y < g.y[1]
  const ends = l => ({ from: pt(0, l.c), to: pt(l.run, l.c + l.rise) })
  const stepLegs = l => [{ from: pt(0, l.c), to: pt(l.run, l.c), label: '' }, { from: pt(l.run, l.c), to: pt(l.run, l.c + l.rise), label: '' }]
  /** The reading lines from the crossing: down (or up) to x on the x axis in amber, across to y on the y axis in blue. */
  const reading = p => [
    ...(p.y ? [{ from: p, to: pt(p.x, 0), dashed: true, colour: AMBER }] : []),
    ...(p.x ? [{ from: p, to: pt(0, p.y), dashed: true, colour: BIRO }] : []),
  ]
  /** Words written on a grid at (x, y), in ink with a white halo, like the kit's own line labels. */
  const tag = (g, x, y, words, anchor = 'start', size = 15) => svg => svg.replace('</svg>',
    `<text x="${1 + (x - g.x[0]) * g.unit}" y="${1 + (g.y[1] - y) * g.unit}" font-size="${size}" font-weight="700" font-style="italic" fill="${INK}" text-anchor="${anchor}" paint-order="stroke" stroke="#fff" stroke-width="5" stroke-linejoin="round">${words}</text></svg>`)
  const draw = (g, opts, ...tags) => tags.reduce((svg, f) => f(svg), graph({ ...g, ...opts }))

  // The worked example (the video and Q1): y = 2x − 3 and y = −x + 3 cross at (2, 1).
  const A = L(-3, 1, 2, { a: -2, b: 1, k: -3 }, 'y = 2x − 3'), B = L(3, 1, -1, { a: 1, b: 1, k: 3 }, 'y = −x + 3')
  const P = eliminate(A.eq, B.eq)
  const g = { x: [-2, 5], y: [-4, 5], unit: 34 }
  const names = gg => [tag(gg, 3.3, 4.3, A.name, 'end'), tag(gg, 4.85, -2.75, B.name, 'end')]
  // Its crossing's brackets, in the gap above the point between the two lines.
  const label = gg => tag(gg, 1.7, 2.35, pair(P.x, P.y, `(${P.x}, ${P.y})`), 'middle')
  const both = { lines: [ends(A), ends(B)] }
  // Rearrange first: 2y + x = 4 is y = −½x + 2.
  const R = L(2, 2, -1, { a: 1, b: 2, k: 4 }, '2y + x = 4')

  // Worksheet: each pair, its grid, and the crossing the question expects.
  const w = 26
  const qs = {
    q1: { a: A, b: B, grid: { ...g, unit: w }, expect: pt(2, 1) },
    q2: { a: L(-2, 1, 3, { a: -3, b: 1, k: -2 }, 'y = 3x − 2'), b: L(2, 1, 1, { a: -1, b: 1, k: 2 }, 'y = x + 2'), grid: { x: [-2, 5], y: [-3, 7], unit: w }, expect: pt(2, 4) },
    q3: { a: L(-1, 1, -2, { a: 2, b: 1, k: -1 }, 'y = −2x − 1'), b: L(2, 1, 1, { a: -1, b: 1, k: 2 }, 'y = x + 2'), grid: { x: [-4, 5], y: [-4, 5], unit: w }, expect: pt(-1, 1) },
    q4: { a: L(1, 1, 1, { a: -1, b: 1, k: 1 }, 'y = x + 1'), b: L(4, 1, -2, { a: 2, b: 1, k: 4 }, 'y = −2x + 4'), grid: { x: [-2, 4], y: [-3, 6], unit: w }, expect: pt(1, 2) },
    q5: { a: L(-1, 1, 2, { a: -2, b: 1, k: -1 }, 'y = 2x − 1'), b: L(-4, 1, -1, { a: 1, b: 1, k: -4 }, 'y = −x − 4'), grid: { x: [-4, 3], y: [-6, 3], unit: w }, expect: pt(-1, -3) },
    q6: { a: L(-1, 1, 1, { a: -1, b: 1, k: -1 }, 'y = x − 1'), b: R, grid: { x: [-2, 6], y: [-3, 5], unit: w }, expect: pt(2, 1) },
    q7: { a: L(-5, 1, 2, { a: -2, b: 1, k: -5 }, 'y = 2x − 5'), b: L(2, 3, -1, { a: 1, b: 3, k: 6 }, '3y + x = 6'), grid: { x: [-2, 6], y: [-6, 4], unit: w }, expect: pt(3, 1) },
  }
  const all = Object.values(qs)
  const crossOf = q => eliminate(q.a.eq, q.b.eq)
  const empty = q => graph({ ...q.grid })
  const given = (q, ...tags) => draw(q.grid, { lines: [ends(q.a), ends(q.b)] }, ...tags)
  const solved = (q, steps = true, unit = 30) => {
    const p = crossOf(q)
    return graph({
      ...q.grid, unit, lines: [ends(q.a), ends(q.b)], rings: [p],
      legs: [...(steps ? [...stepLegs(q.a), ...stepLegs(q.b)] : []), ...reading(p)],
      marks: [xAxis(p.x), yAxis(p.y)],
      points: [{ ...p, label: '' }],
    })
  }
  const step = l => `$${Y(show(l.c))}$ on the $y$ axis, then across $${X(l.run)}$, ${l.rise < 0 ? 'down' : 'up'} $${Y(Math.abs(l.rise))}$`
  const read = p => `They cross at $(${X(show(p.x))}, ${Y(show(p.y))})$: $x$ down on the $x$ axis, $y$ across on the $y$ axis`
  const sumOf = (l, x) => {
    const xs = x < 0 ? `(${X(x)})` : X(x)
    const times = l.m === 1 ? X(x) : l.m === -1 ? `-${xs}` : Number.isInteger(l.m) ? `${l.m} \\times ${xs}` : `-\\tfrac{1}{${l.run}} \\times ${xs}`
    return `$${times} ${l.c < 0 ? '-' : '+'} ${Math.abs(l.c)} = ${Y(yOf(l, x))}$ ✓`
  }
  const check = q => { const p = crossOf(q); return `Check in both: ${sumOf(q.a, p.x)} and ${sumOf(q.b, p.x)}` }
  const solution = p => `$x = ${p.x}$, $y = ${p.y}$`

  return {
    code: 'GR7.1', topic: 'Simultaneous equations by graph', strand: 'Graphs', file: 'GR7.1_Simultaneous_equations_by_graph',

    checks: {
      'y = 2x − 3 and y = −x + 3 by elimination: 3x = 6, so x = 2, then y = 1': P.x === 2 && P.y === 1 && onLine(A, P) && onLine(B, P),
      'from −3, across 1 and up 2 lands on y = 2x − 3; from 3, across 1 and down 1 on y = −x + 3': onLine(A, pt(1, -1)) && onLine(B, pt(1, 2)),
      'the check: 2 × 2 − 3 = 1 and −2 + 3 = 1': 2 * 2 - 3 === 1 && -2 + 3 === 1,
      '2y + x = 4: take x, 2y = −x + 4; divide by 2, y = −½x + 2 (every x from −100 to 100)': Array.from({ length: 201 }, (_, i) => i - 100).every(x => { const y = (-x + 4) / 2; return x + 2 * y === 4 && y === -0.5 * x + 2 }),
      'the video\'s crossing, both c\'s and both steps are inside its grid': [P, pt(0, A.c), pt(0, B.c), pt(1, -1), pt(1, 2)].every(p => inside(g, p)),
      'every worksheet pair, solved by elimination, crosses where the question expects': all.every(q => { const p = crossOf(q); return p.x === q.expect.x && p.y === q.expect.y }),
      'every worksheet crossing is on both lines': all.every(q => onLine(q.a, crossOf(q)) && onLine(q.b, crossOf(q))),
      'every worksheet crossing is inside its grid': all.every(q => inside(q.grid, crossOf(q))),
      'every step of the gradient lands on its line, inside its grid': all.every(q => [q.a, q.b].every(l => onLine(l, pt(0, l.c)) && onLine(l, pt(l.run, l.c + l.rise)) && inside(q.grid, pt(0, l.c)) && inside(q.grid, pt(l.run, l.c + l.rise)))),
      'Q7: 3y + x = 6 is y = −⅓x + 2': [pt(0, 2), pt(3, 1), pt(6, 0)].every(p => onLine(qs.q7.b, p)),
      'no grid is more than 9 squares across': [g, ...all.map(q => q.grid)].every(gg => across(gg) <= 9),
    },

    video: {
      slides: [
        { hero: 'Solving by graph', sub: 'Where two lines cross', items: [
          [picture(draw({ ...g, unit: 26 }, { ...both, rings: [P], points: [{ ...P, label: '' }] })), 2.6]] },
        { title: 'Both true at once', opening: 1.2, items: [
          [line('Simultaneous equations are both true **at the same time**, for the same $x$ and $y$'), 3.2],
          [stack(line('Simultaneous equations are both true **at the same time**, for the same $x$ and $y$'), row(m('y = 2x - 3', 'big'), m('y = -x + 3', 'big'))), 2.2, 0],
          [stack(line('Simultaneous equations are both true **at the same time**, for the same $x$ and $y$'), row(m('y = 2x - 3', 'big'), m('y = -x + 3', 'big')), line('Each one is a **straight line**: draw both on the same grid')), 3, 1]] },
        { stage: 'Step 1 · draw the first line', title: 'Draw y = 2x − 3', opening: 1.2, items: [
          [side(draw(g, { marks: [yAxis(-3)] }), line(`start at $${Y('-3')}$ on the $y$ axis`)), 2.6],
          [side(draw(g, { marks: [yAxis(-3)], legs: stepLegs(A), points: [{ ...pt(1, -1), label: '' }] }), line(`start at $${Y('-3')}$ on the $y$ axis`), line(`across $${X(1)}$, up $${Y(2)}$`)), 2.8, 0],
          [side(draw(g, { marks: [yAxis(-3)], lines: [ends(A)] }, names(g)[0]), line(`start at $${Y('-3')}$ on the $y$ axis`), line(`across $${X(1)}$, up $${Y(2)}$`), line('join, edge to edge')), 2.6, 1]] },
        { stage: 'Step 1 · draw the second line', title: 'Draw y = −x + 3', opening: 1.2, items: [
          [side(draw(g, { marks: [yAxis(3)], lines: [ends(A)] }, names(g)[0]), line(`start at $${Y(3)}$ on the $y$ axis`)), 2.6],
          [side(draw(g, { marks: [yAxis(3)], lines: [ends(A)], legs: stepLegs(B), points: [{ ...pt(1, 2), label: '' }] }, names(g)[0]), line(`start at $${Y(3)}$ on the $y$ axis`), line(`across $${X(1)}$, down $${Y(1)}$`)), 2.8, 0],
          [side(draw(g, { marks: [yAxis(3)], ...both }, ...names(g)), line(`start at $${Y(3)}$ on the $y$ axis`), line(`across $${X(1)}$, down $${Y(1)}$`), line('join, edge to edge')), 2.6, 1]] },
        { stage: 'Step 2 · read where they cross', title: 'The one point on both lines', opening: 1.2, items: [
          [side(draw(g, { ...both, rings: [P], points: [{ ...P, label: '' }] }, ...names(g), label(g)), line(`they cross at $(${X(2)}, ${Y(1)})$`)), 2.8],
          [side(draw(g, { ...both, rings: [P], points: [{ ...P, label: '' }], legs: reading(P).slice(0, 1), marks: [xAxis(2)] }, ...names(g), label(g)), line(`they cross at $(${X(2)}, ${Y(1)})$`), line(`down to the $x$ axis: $x = ${X(2)}$`)), 2.8, 0],
          [side(draw(g, { ...both, rings: [P], points: [{ ...P, label: '' }], legs: reading(P), marks: [xAxis(2), yAxis(1)] }, ...names(g), label(g)), line(`they cross at $(${X(2)}, ${Y(1)})$`), line(`down to the $x$ axis: $x = ${X(2)}$`), line(`across to the $y$ axis: $y = ${Y(1)}$`)), 2.8, 1]] },
        { stage: 'Step 3 · check in both', title: 'Put x = 2 into both', from: `$(${X(2)}, ${Y(1)})$`, opening: 1.2, items: [
          [stack(line('$y = 2x - 3$'), checked(`2 \\times ${X(2)} - 3 = ${Y(1)}`)), 2.8],
          [stack(line('$y = 2x - 3$'), checked(`2 \\times ${X(2)} - 3 = ${Y(1)}`), line('$y = -x + 3$'), checked(`-${X(2)} + 3 = ${Y(1)}`)), 2.8, 0],
          [stack(line('$y = 2x - 3$'), checked(`2 \\times ${X(2)} - 3 = ${Y(1)}`), line('$y = -x + 3$'), checked(`-${X(2)} + 3 = ${Y(1)}`), answer(`$${G('x = 2')}$, $${G('y = 1')}$`)), 3.2, 1]] },
        { title: 'Rearrange first', from: '$2y + x = 4$', opening: 1.2, items: [
          [line('not $y = mx + c$ yet: make $y$ the subject'), 2.2],
          [stack(line('take $x$ from both sides'), work('2y = -x + 4')), 2.8],
          [stack(line('divide every term by $2$'), work('y = -\\tfrac{1}{2}x + 2')), 2.8, 1],
          [stack(work('y = -\\tfrac{1}{2}x + 2'), line(`then draw it like any other: start at $${Y(2)}$, across $${X(2)}$, down $${Y(1)}$`)), 3, 2]] },
      ],
      recap: ['Each equation is a straight line', 'Draw both on the same grid', 'The solution is where they cross', 'Check it in both equations'],
    },

    worksheet: {
      title: 'Simultaneous equations by graph',
      questions: [
        { n: '1', level: 'worked', marks: 3, question: 'By drawing their graphs, solve the simultaneous equations $y = 2x - 3$ and $y = -x + 3$.', figure: empty(qs.q1), working: [
          { say: `Draw $y = 2x - 3$: ${step(qs.q1.a)}` }, { mark: 'Draws $y = 2x - 3$' },
          { say: `Draw $y = -x + 3$: ${step(qs.q1.b)}` }, { mark: 'Draws $y = -x + 3$' },
          { picture: solved(qs.q1) },
          { say: read(crossOf(qs.q1)) },
          { say: check(qs.q1) },
          { answer: solution(crossOf(qs.q1)) }] },
        { n: '2', level: 'easy', marks: 2, question: 'The graphs of $y = 3x - 2$ and $y = x + 2$ are drawn below. Use them to solve the simultaneous equations.', figure: given(qs.q2, tag(qs.q2.grid, 0.9, -1.75, 'y = 3x − 2', 'start', 13), tag(qs.q2.grid, 4.85, 3.3, 'y = x + 2', 'end', 13)), working: [
          { picture: solved(qs.q2, false) },
          { say: read(crossOf(qs.q2)) }, { mark: `Reads $(${X(2)}, ${Y(4)})$` },
          { say: check(qs.q2) },
          { answer: solution(crossOf(qs.q2)) }] },
        { n: '3', level: 'easy', marks: 2, question: 'The graphs of $y = -2x - 1$ and $y = x + 2$ are drawn below. Use them to solve the simultaneous equations.', figure: given(qs.q3, tag(qs.q3.grid, 1.5, -2.7, 'y = −2x − 1', 'start', 13), tag(qs.q3.grid, 2.85, 1.9, 'y = x + 2', 'end', 13)), working: [
          { say: 'The crossing can be left of the $y$ axis' },
          { picture: solved(qs.q3, false, 36) },
          { say: read(crossOf(qs.q3)) }, { mark: `Reads $(${X(-1)}, ${Y(1)})$` },
          { say: check(qs.q3) },
          { answer: solution(crossOf(qs.q3)) }] },
        { n: '4', level: 'medium', marks: 3, question: 'By drawing their graphs on the grid, solve the simultaneous equations $y = x + 1$ and $y = -2x + 4$.', figure: empty(qs.q4), working: [
          { say: `Draw $y = x + 1$: ${step(qs.q4.a)}` }, { mark: 'Draws $y = x + 1$' },
          { say: `Draw $y = -2x + 4$: ${step(qs.q4.b)}` }, { mark: 'Draws $y = -2x + 4$' },
          { picture: solved(qs.q4, false, 34) },
          { say: read(crossOf(qs.q4)) },
          { say: check(qs.q4) },
          { answer: solution(crossOf(qs.q4)) }] },
        { n: '5', level: 'medium', marks: 3, question: 'By drawing their graphs, solve the simultaneous equations $y = 2x - 1$ and $y = -x - 4$.', figure: empty(qs.q5), working: [
          { say: `Draw $y = 2x - 1$: ${step(qs.q5.a)}` }, { mark: 'Draws $y = 2x - 1$' },
          { say: `Draw $y = -x - 4$: ${step(qs.q5.b)}` }, { mark: 'Draws $y = -x - 4$' },
          { picture: solved(qs.q5, true, 36) },
          { say: read(crossOf(qs.q5)) },
          { say: check(qs.q5) },
          { answer: solution(crossOf(qs.q5)) }] },
        { n: '6', level: 'hard', marks: 4, question: 'By drawing their graphs, solve the simultaneous equations $y = x - 1$ and $2y + x = 4$.', figure: empty(qs.q6), working: [
          { say: 'Make $y$ the subject of $2y + x = 4$: take $x$ from both sides' },
          { math: '2y = -x + 4' },
          { say: 'Divide every term by $2$' },
          { math: 'y = -\\tfrac{1}{2}x + 2' }, { mark: 'Makes $y$ the subject' },
          { say: `Draw $y = x - 1$: ${step(qs.q6.a)}` }, { mark: 'Draws $y = x - 1$' },
          { say: `Draw $y = -\\tfrac{1}{2}x + 2$: ${step(qs.q6.b)}` }, { mark: 'Draws $2y + x = 4$' },
          { picture: solved(qs.q6) },
          { say: read(crossOf(qs.q6)) },
          { say: `Check in both: ${sumOf(qs.q6.a, 2)} and $2 \\times ${Y(1)} + ${X(2)} = 4$ ✓` },
          { answer: solution(crossOf(qs.q6)) }] },
        { n: '7', level: 'very hard', marks: 4, question: 'By drawing their graphs, solve the simultaneous equations $y = 2x - 5$ and $3y + x = 6$.', figure: graph({ ...qs.q7.grid, unit: 22 }), working: [
          { say: 'Make $y$ the subject of $3y + x = 6$: take $x$ from both sides' },
          { math: '3y = -x + 6' },
          { say: 'Divide every term by $3$' },
          { math: 'y = -\\tfrac{1}{3}x + 2' }, { mark: 'Makes $y$ the subject' },
          { say: `Draw $y = 2x - 5$: ${step(qs.q7.a)}` }, { mark: 'Draws $y = 2x - 5$' },
          { say: `Draw $y = -\\tfrac{1}{3}x + 2$: ${step(qs.q7.b)}` }, { mark: 'Draws $3y + x = 6$' },
          { picture: solved(qs.q7, true, 25) },
          { say: read(crossOf(qs.q7)) },
          { say: `Check in both: ${sumOf(qs.q7.a, 3)} and $3 \\times ${Y(1)} + ${X(3)} = 6$ ✓` },
          { answer: solution(crossOf(qs.q7)) }] },
      ],
    },
  }
}

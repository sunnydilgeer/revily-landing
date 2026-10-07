// GR2.1 The equation of a straight line: the second video in graphs lesson 3, and its worksheet. From GR2 in Sunny's
// book scan (p72–73): y = mx + c, the equation from a graph, through two points, and rearranging; every number is our
// own. As in the gradient video, x numbers are amber and y numbers biro blue; c is a y (where the line crosses the
// y axis), so it is blue too. From a graph: c first, then across and up from there for m.
module.exports = ({ m, line, big, answer, row, picture }) => {
  const { graph, tex, pt, COLOURS: { AMBER, BIRO, GREEN, INK } } = require('../lib/graph.cjs')
  const X = v => `\\textcolor{${AMBER}}{${v}}`, Y = v => `\\textcolor{${BIRO}}{${v}}`, G = v => `\\textcolor{${GREEN}}{${v}}`
  const bx = v => v < 0 ? `(${X(v)})` : X(v), by = v => v < 0 ? `(${Y(v)})` : Y(v)
  const work = t => `<div class="result">${m(t).replace('class="m ', `style="color:${INK}" class="m `)}</div>`
  const side = (svg, ...words) => row(picture(svg), `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;max-width:460px;text-align:center">${words.join('')}</div>`)
  const stack = (...parts) => `<div style="display:flex;flex-direction:column;align-items:center;gap:14px">${parts.join('')}</div>`
  const y = v => ({ axis: 'y', value: v })
  const gradientOf = (a, b) => (b.y - a.y) / (b.x - a.x)
  const cOf = (a, b) => a.y - gradientOf(a, b) * a.x
  const on = (mm, c, p) => Math.abs(mm * p.x + c - p.y) < 1e-9
  const across = g => g.x[1] - g.x[0]
  const formula = big(`y = ${G('m')}x + ${Y('c')}`)

  // From a graph: y = 3x − 2. It crosses the y axis at −2; across 1, up 3.
  const g1 = { x: [-2, 4], y: [-4, 5], unit: 34 }
  const L1 = { from: pt(0, -2), to: pt(2, 4) }
  const T1 = pt(1, 1)
  const legs1 = [{ from: pt(0, -2), to: pt(1, -2), label: '' }, { from: pt(1, -2), to: pt(1, 1), label: '' }]
  // From two points: (−2, 9) and (3, −1): m = −10 ÷ 5 = −2, then 9 = −2 × (−2) + c, so c = 5.
  const A = pt(-2, 9), B = pt(3, -1)
  // Rearranging: x + 3y = 12 → 3y = −x + 12 → y = −⅓x + 4.
  const r = { a: 1, b: 3, k: 12 }

  // Worksheet lines drawn on grids.
  const w = 22
  const q1 = { grid: { ...g1, unit: w }, m: 3, c: -2 }
  const q2 = { grid: { x: [-3, 5], y: [-3, 3], unit: w }, m: 1 / 2, c: -1 }
  const q4 = { grid: { x: [-2, 4], y: [-2, 5], unit: w }, m: -2, c: 3 }
  const drawn = q => ({ ...q.grid, lines: [{ from: pt(0, q.c), to: pt(2, q.c + 2 * q.m) }] })
  const solved = (q, across, up) => ({ ...drawn(q), legs: [{ from: pt(0, q.c), to: pt(across, q.c), label: '' }, { from: pt(across, q.c), to: pt(across, q.c + up), label: '' }], marks: [y(q.c)] })
  const graphs = [q1, q2, q4]

  return {
    code: 'GR2.1', topic: 'The equation of a straight line', strand: 'Graphs', file: 'GR2.1_Equation_of_a_line',

    checks: {
      'y = 3x − 2 crosses the y axis at −2 and goes through (1, 1) and (2, 4)': on(3, -2, pt(0, -2)) && on(3, -2, T1) && on(3, -2, L1.to),
      'from (0, −2), across 1 and up 3 lands on the line': legs1[1].to.y - legs1[0].from.y === 3 && legs1[0].to.x - legs1[0].from.x === 1 && on(3, -2, legs1[1].to),
      '(−2, 9) and (3, −1): m = (−1 − 9) ÷ (3 − (−2)) = −10 ÷ 5 = −2': -1 - 9 === -10 && 3 - -2 === 5 && gradientOf(A, B) === -2,
      '9 = −2 × (−2) + c, so c = 5, and both points are on y = −2x + 5': -2 * -2 === 4 && 9 - 4 === 5 && cOf(A, B) === 5 && on(-2, 5, A) && on(-2, 5, B),
      'x + 3y = 12 is y = −⅓x + 4: (0, 4), (3, 3) and (12, 0) are on both': [pt(0, 4), pt(3, 3), pt(12, 0)].every(p => r.a * p.x + r.b * p.y === r.k && on(-1 / 3, 4, p)),
      'Q1 (worked): y = 3x − 2': q1.m === 3 && q1.c === -2,
      'Q2: crosses at −1, across 2, up 1 → y = ½x − 1': on(0.5, -1, pt(0, -1)) && on(0.5, -1, pt(2, 0)) && q2.m === 0.5,
      'Q3: y = 4x − 7: gradient 4, y-intercept −7': on(4, -7, pt(0, -7)) && on(4, -7, pt(1, -3)),
      'Q4: crosses at 3, across 1, down 2 → y = −2x + 3': on(-2, 3, pt(0, 3)) && on(-2, 3, pt(1, 1)),
      'Q5: (1, 5) and (3, 11): m = 6 ÷ 2 = 3, 5 = 3 + c, c = 2': gradientOf(pt(1, 5), pt(3, 11)) === 3 && cOf(pt(1, 5), pt(3, 11)) === 2,
      'Q6: (−2, −5) and (3, 30): m = 35 ÷ 5 = 7, −5 = −14 + c, c = 9': gradientOf(pt(-2, -5), pt(3, 30)) === 7 && cOf(pt(-2, -5), pt(3, 30)) === 9,
      'Q7: 2x + y = 7 is y = −2x + 7': [pt(0, 7), pt(1, 5), pt(3, 1)].every(p => 2 * p.x + p.y === 7 && on(-2, 7, p)),
      'Q8: 4y − 8x = 12 is y = 2x + 3': [pt(0, 3), pt(1, 5), pt(-1, 1)].every(p => 4 * p.y - 8 * p.x === 12 && on(2, 3, p)),
      'Q9: (2, 4) and (6, 6): m = 2 ÷ 4 = ½, 4 = 1 + c, c = 3': gradientOf(pt(2, 4), pt(6, 6)) === 0.5 && cOf(pt(2, 4), pt(6, 6)) === 3,
      'every worksheet line crosses the y axis inside its grid': graphs.every(q => q.c > q.grid.y[0] && q.c < q.grid.y[1]),
      'no grid is more than 9 squares across': [g1, ...graphs.map(q => q.grid)].every(g => across(g) <= 9),
    },

    video: {
      slides: [
        { hero: 'y = mx + c', sub: 'The equation of a straight line', items: [
          [picture(graph({ ...g1, unit: 28, lines: [L1] })), 2.6]] },
        { title: 'Every straight line is y = mx + c', opening: 1.2, items: [
          [formula, 2.4],
          [stack(formula, line(`$${G('m')}$ is the **gradient**: up over across`)), 3, 0],
          [stack(formula, line(`$${G('m')}$ is the **gradient**: up over across`), line(`$${Y('c')}$ is where the line crosses the $y$ axis`)), 3.6, 1]] },
        { stage: 'From a graph · c first', title: 'Where does it cross the y axis?', opening: 1.2, items: [
          [side(graph({ ...g1, lines: [L1] }), line('find $c$ first')), 2.4],
          [side(graph({ ...g1, lines: [L1], marks: [y(-2)] }), line('it crosses at $' + Y(-2) + '$'), work(`c = ${Y(-2)}`)), 3.6, 0]] },
        { stage: 'From a graph · then m', title: 'Across, then up', from: `$c = ${Y(-2)}$`, opening: 1.2, items: [
          [side(graph({ ...g1, lines: [L1], legs: legs1, marks: [y(-2)] }), line(`from there: across $${X(1)}$, up $${Y(3)}$`), work(`m = ${Y(3)} \\div ${X(1)} = 3`)), 3.8],
          [side(graph({ ...g1, lines: [{ ...L1, colour: GREEN }], legs: legs1, marks: [y(-2)] }), work(`m = 3, \\quad c = ${Y(-2)}`), answer('$y = 3x - 2$')), 3.6, 0]] },
        { title: 'From two points', from: `$${tex(-2, 9)}$ and $${tex(3, -1)}$`, opening: 1.2, items: [
          [work(`m = \\dfrac{${Y(-1)} - ${Y(9)}}{${X(3)} - ${bx(-2)}} = \\dfrac{${Y(-10)}}{${X(5)}} = -2`), 3.6],
          [line(`put in one point, $${tex(-2, 9)}$:`), 2.4],
          [work(`${Y(9)} = -2 \\times ${bx(-2)} + c`), 3],
          [work(`${Y(9)} = 4 + c \\quad\\Rightarrow\\quad c = 5`), 3.2, 2],
          [answer('$y = -2x + 5$'), 3]] },
        { title: 'Rearranging', from: '$x + 3y = 12$', opening: 1.2, items: [
          [line('make $y$ the subject, one move at a time'), 2.6],
          [work('3y = -x + 12'), 2.8],
          [work('y = -\\tfrac{1}{3}x + 4'), 3, 1],
          [answer(`gradient $${G('-\\tfrac{1}{3}')}$, $y$-intercept $${Y(4)}$`), 3.6]] },
      ],
      recap: ['y = mx + c: m is the gradient, c where it crosses the y axis', 'From a graph: c first, then across and up for m', 'From two points: m, then put a point in for c', 'Otherwise make y the subject first'],
    },

    worksheet: {
      title: 'The equation of a straight line',
      questions: [
        { n: '1', level: 'worked', marks: 2, question: 'Find the equation of the line drawn below.', figure: graph(drawn(q1)), working: [
          { say: 'Find $c$ first: where the line crosses the $y$ axis. Then across and up from there for $m$' },
          { picture: graph(solved(q1, 1, 3)) },
          { mark: `$c = ${Y(-2)}$, $m = ${Y(3)} \\div ${X(1)} = 3$` },
          { answer: '$y = 3x - 2$' }] },
        { n: '2', level: 'easy', marks: 2, question: 'Find the equation of the line drawn below.', figure: graph(drawn(q2)), working: [
          { picture: graph(solved(q2, 2, 1)) },
          { mark: `$c = ${Y(-1)}$, $m = ${Y(1)} \\div ${X(2)} = \\tfrac{1}{2}$` },
          { answer: '$y = \\tfrac{1}{2}x - 1$' }] },
        { n: '3', level: 'easy', marks: 2, question: 'Write down the gradient and the $y$-intercept of the line $y = 4x - 7$.', working: [
          { say: 'It is already $y = mx + c$' },
          { mark: 'Gradient $4$' },
          { answer: `$y$-intercept $${Y(-7)}$` }] },
        { n: '4', level: 'medium', marks: 2, question: 'Find the equation of the line drawn below.', figure: graph(drawn(q4)), working: [
          { say: 'It goes down from left to right, so $m$ is negative' },
          { picture: graph(solved(q4, 1, -2)) },
          { mark: `$c = ${Y(3)}$, $m = ${Y(-2)} \\div ${X(1)} = -2$` },
          { answer: '$y = -2x + 3$' }] },
        { n: '5', level: 'medium', marks: 2, question: 'Find the equation of the line through $(1, 5)$ and $(3, 11)$.', working: [
          { math: `m = \\dfrac{${Y(11)} - ${Y(5)}}{${X(3)} - ${X(1)}} = \\dfrac{${Y(6)}}{${X(2)}} = 3` }, { mark: '$m = 3$' },
          { math: `${Y(5)} = 3 \\times ${X(1)} + c \\quad\\Rightarrow\\quad c = 2` },
          { answer: '$y = 3x + 2$' }] },
        { n: '6', level: 'hard', marks: 2, question: 'Find the equation of the line through $(-2, -5)$ and $(3, 30)$.', working: [
          { math: `m = \\dfrac{${Y(30)} - ${by(-5)}}{${X(3)} - ${bx(-2)}} = \\dfrac{${Y(35)}}{${X(5)}} = 7` }, { mark: '$m = 7$' },
          { math: `${Y(-5)} = 7 \\times ${bx(-2)} + c = -14 + c \\quad\\Rightarrow\\quad c = 9` },
          { answer: '$y = 7x + 9$' }] },
        { n: '7', level: 'hard', marks: 2, question: 'Find the gradient and $y$-intercept of the line $2x + y = 7$.', working: [
          { say: 'Make $y$ the subject: take $2x$ from both sides' },
          { math: 'y = -2x + 7' }, { mark: 'Gradient $-2$' },
          { answer: `$y$-intercept $${Y(7)}$` }] },
        { n: '8', level: 'very hard', marks: 2, question: 'Write $4y - 8x = 12$ in the form $y = mx + c$.', working: [
          { math: '4y = 8x + 12' }, { mark: 'Adds $8x$ to both sides' },
          { math: 'y = 2x + 3' },
          { answer: '$y = 2x + 3$' }] },
        { n: '9', level: 'very hard', marks: 2, question: 'Find the equation of the line through $(2, 4)$ and $(6, 6)$.', working: [
          { math: `m = \\dfrac{${Y(6)} - ${Y(4)}}{${X(6)} - ${X(2)}} = \\dfrac{${Y(2)}}{${X(4)}} = \\tfrac{1}{2}` }, { mark: '$m = \\tfrac{1}{2}$' },
          { math: `${Y(4)} = \\tfrac{1}{2} \\times ${X(2)} + c = 1 + c \\quad\\Rightarrow\\quad c = 3` },
          { answer: '$y = \\tfrac{1}{2}x + 3$' }] },
      ],
    },
  }
}

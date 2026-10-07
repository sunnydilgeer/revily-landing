// GR4.2 Drawing a line from y = mx + c: the third video in graphs lesson 3, and its worksheet. From GR4 method 2 in
// Sunny's book scan (p76–78): make y the subject, plot c on the y axis, step the gradient, join. Every number is our
// own. As in the other graphs videos, x numbers are amber and y numbers biro blue; c is a y, so it is blue.
module.exports = ({ m, line, big, answer, row, picture }) => {
  const { graph, pt, COLOURS: { AMBER, BIRO, GREEN, INK } } = require('../lib/graph.cjs')
  const X = v => `\\textcolor{${AMBER}}{${v}}`, Y = v => `\\textcolor{${BIRO}}{${v}}`, G = v => `\\textcolor{${GREEN}}{${v}}`
  const work = t => `<div class="result">${m(t).replace('class="m ', `style="color:${INK}" class="m `)}</div>`
  const side = (svg, ...words) => row(picture(svg), `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;max-width:460px;text-align:center">${words.join('')}</div>`)
  const stack = (...parts) => `<div style="display:flex;flex-direction:column;align-items:center;gap:14px">${parts.join('')}</div>`
  const y = v => ({ axis: 'y', value: v })
  const on = (mm, c, p) => Math.abs(mm * p.x + c - p.y) < 1e-9
  const across = g => g.x[1] - g.x[0]
  const formula = big(`y = ${G('m')}x + ${Y('c')}`)

  // Worked: 2y + 4x = 10 → 2y = −4x + 10 → y = −2x + 5. Plot (0, 5), across 1, down 2 to (1, 3), join.
  const g1 = { x: [-1, 4], y: [-2, 7], unit: 30 }
  const C1 = pt(0, 5), S1 = pt(1, 3)
  const legs1 = [{ from: C1, to: pt(1, 5), label: '' }, { from: pt(1, 5), to: S1, label: '' }]
  // A half: y − 1 = −½x → y = −½x + 1. Plot (0, 1), across 2, down 1 to (2, 0), join.
  const g2 = { x: [-3, 5], y: [-2, 4], unit: 34 }
  const C2 = pt(0, 1), S2 = pt(2, 0)
  const legs2 = [{ from: C2, to: pt(2, 1), label: '' }, { from: pt(2, 1), to: S2, label: '' }]

  // Worksheet grids: empty to draw on, and the solved line with its step.
  const w = 22
  const qs = {
    q1: { grid: { ...g1, unit: w }, m: -2, c: 5, across: 1, up: -2 },
    q2: { grid: { x: [-2, 4], y: [-5, 4], unit: w }, m: 3, c: -4, across: 1, up: 3 },
    q3: { grid: { x: [-3, 5], y: [-1, 5], unit: w }, m: 0.5, c: 2, across: 2, up: 1 },
    q5: { grid: { x: [-1, 5], y: [-3, 5], unit: w }, m: 1.5, c: -2, across: 2, up: 3 },
    q6: { grid: { x: [-2, 3], y: [-4, 5], unit: w }, m: -3, c: 1, across: 1, up: -3 },
    q7: { grid: { x: [-3, 5], y: [-2, 4], unit: w }, m: -0.5, c: 1, across: 2, up: -1 },
  }
  const empty = q => ({ ...q.grid })
  const solved = q => ({
    ...q.grid, marks: [y(q.c)],
    lines: [{ from: pt(0, q.c), to: pt(q.across, q.c + q.up), colour: GREEN }],
    points: [{ ...pt(q.across, q.c + q.up), label: '' }],
    legs: [{ from: pt(0, q.c), to: pt(q.across, q.c), label: '' }, { from: pt(q.across, q.c), to: pt(q.across, q.c + q.up), label: '' }],
  })
  const all = Object.values(qs)
  const step = q => `$${Y(q.c)}$ on the $y$ axis, then across $${X(q.across)}$, ${q.up < 0 ? 'down' : 'up'} $${Y(Math.abs(q.up))}$`

  return {
    code: 'GR4.2', topic: 'Drawing a line from y = mx + c', strand: 'Graphs', file: 'GR4.2_Drawing_from_y_mx_c',

    checks: {
      '2y + 4x = 10 is y = −2x + 5: (0, 5), (1, 3) and (5, −5) are on both': [pt(0, 5), pt(1, 3), pt(5, -5)].every(p => 2 * p.y + 4 * p.x === 10 && on(-2, 5, p)),
      'from (0, 5), across 1 and down 2 lands on (1, 3)': legs1[0].to.x - C1.x === 1 && S1.y - legs1[1].from.y === -2 && on(-2, 5, S1),
      'y − 1 = −½x is y = −½x + 1: (0, 1), (2, 0) and (−2, 2) are on both': [pt(0, 1), pt(2, 0), pt(-2, 2)].every(p => p.y - 1 === -0.5 * p.x && on(-0.5, 1, p)),
      'from (0, 1), across 2 and down 1 lands on (2, 0)': legs2[0].to.x - C2.x === 2 && S2.y - legs2[1].from.y === -1 && on(-0.5, 1, S2),
      'every worksheet step lands on its line': all.every(q => q.up / q.across === q.m && on(q.m, q.c, pt(q.across, q.c + q.up))),
      'Q4: 2y − 1 = 4x is y = 2x + ½': [pt(0, 0.5), pt(1, 2.5), pt(-1, -1.5)].every(p => 2 * p.y - 1 === 4 * p.x && on(2, 0.5, p)),
      'Q5: 2y + 4 = 3x is y = 3/2x − 2': [pt(0, -2), pt(2, 1), pt(4, 4)].every(p => 2 * p.y + 4 === 3 * p.x && on(1.5, -2, p)),
      'Q6: y + 3x − 1 = 0 is y = −3x + 1': [pt(0, 1), pt(1, -2), pt(-1, 4)].every(p => p.y + 3 * p.x - 1 === 0 && on(-3, 1, p)),
      'every point drawn is inside its grid': all.every(q => [pt(0, q.c), pt(q.across, q.c + q.up)].every(p => p.x > q.grid.x[0] && p.x < q.grid.x[1] && p.y > q.grid.y[0] && p.y < q.grid.y[1])),
      'no grid is more than 9 squares across': [g1, g2, ...all.map(q => q.grid)].every(g => across(g) <= 9),
    },

    video: {
      slides: [
        { hero: 'Drawing y = mx + c', sub: 'A straight line straight from its equation', items: [
          [picture(graph({ ...g1, unit: 28, lines: [{ from: C1, to: S1 }] })), 2.6]] },
        { title: 'No table needed', opening: 1.2, items: [
          [formula, 2.4],
          [stack(formula, line(`plot $${Y('c')}$ on the $y$ axis`)), 2.8, 0],
          [stack(formula, line(`plot $${Y('c')}$ on the $y$ axis`), line(`step the gradient $${G('m')}$: across, then up or down`)), 3.2, 1],
          [stack(formula, line(`plot $${Y('c')}$ on the $y$ axis`), line(`step the gradient $${G('m')}$: across, then up or down`), line('join with one straight line')), 3, 2]] },
        { stage: 'Step 1 · y on its own', title: 'Get it into y = mx + c', from: '$2y + 4x = 10$', opening: 1.2, items: [
          [line('take $4x$ from both sides'), 2.4],
          [work('2y = -4x + 10'), 2.8],
          [line('divide every term by $2$'), 2.4, 0],
          [work('y = -2x + 5'), 3],
          [work(`m = -2, \\quad c = ${Y(5)}`), 3.2]] },
        { stage: 'Step 2 · plot c', title: 'Where it crosses the y axis', from: '$y = -2x + 5$', opening: 1.2, items: [
          [side(graph({ ...g1, marks: [y(5)] }), line(`$c = ${Y(5)}$: it crosses the $y$ axis at $(${X(0)}, ${Y(5)})$`)), 3.4]] },
        { stage: 'Step 3 · step the gradient', title: 'Across 1, then down 2', from: '$y = -2x + 5$', opening: 1.2, items: [
          [side(graph({ ...g1, legs: legs1, marks: [y(5)] }), line(`$m = -2$: for every $${X(1)}$ across, down $${Y(2)}$`)), 3.6],
          [side(graph({ ...g1, points: [S1], legs: legs1, marks: [y(3)] }), line(`that lands on $(${X(1)}, ${Y(3)})$`)), 3, 0],
          [side(graph({ ...g1, points: [S1], lines: [{ from: C1, to: S1, colour: GREEN }], marks: [y(5)] }), line('join them, right across the grid'), answer('$y = -2x + 5$')), 3.8, 1]] },
        { title: 'A half', from: '$y - 1 = -\\tfrac{1}{2}x$', opening: 1.2, items: [
          [work('y = -\\tfrac{1}{2}x + 1'), 2.8],
          [side(graph({ ...g2, marks: [y(1)] }), line(`plot $c = ${Y(1)}$`)), 2.8, 0],
          [side(graph({ ...g2, points: [{ ...S2, label: '' }], legs: legs2, marks: [y(1)] }), line(`a half: across $${X(2)}$, down $${Y(1)}$`)), 3.4, 1],
          [side(graph({ ...g2, points: [{ ...S2, label: '' }], lines: [{ from: C2, to: S2, colour: GREEN }], marks: [y(1)] }), answer('$y = -\\tfrac{1}{2}x + 1$')), 3.4, 2]] },
      ],
      recap: ['Get it into y = mx + c first', 'Plot c on the y axis', 'Step the gradient: across, then up or down', 'Join with one straight line'],
    },

    worksheet: {
      title: 'Drawing a line from y = mx + c',
      questions: [
        { n: '1', level: 'worked', marks: 2, question: 'Draw the graph of $2y + 4x = 10$.', figure: graph(empty(qs.q1)), working: [
          { say: 'Make $y$ the subject: take $4x$ from both sides, then divide by $2$' },
          { math: 'y = -2x + 5' }, { mark: `$m = -2$, $c = ${Y(5)}$` },
          { say: step(qs.q1) },
          { picture: graph(solved(qs.q1)) },
          { answer: 'A straight line through $(0, 5)$ and $(1, 3)$' }] },
        { n: '2', level: 'easy', marks: 2, question: 'Draw the line $y = 3x - 4$.', figure: graph(empty(qs.q2)), working: [
          { mark: `Plots $(${X(0)}, ${Y(-4)})$` }, { say: step(qs.q2) },
          { picture: graph(solved(qs.q2)) },
          { answer: 'A straight line through $(0, -4)$ and $(1, -1)$' }] },
        { n: '3', level: 'easy', marks: 2, question: 'Draw the line $y = \\tfrac{1}{2}x + 2$.', figure: graph(empty(qs.q3)), working: [
          { mark: `Plots $(${X(0)}, ${Y(2)})$` }, { say: `${step(qs.q3)}: a half is $1$ up for every $2$ across` },
          { picture: graph(solved(qs.q3)) },
          { answer: 'A straight line through $(0, 2)$ and $(2, 3)$' }] },
        { n: '4', level: 'medium', marks: 2, question: 'Write $2y - 1 = 4x$ in the form $y = mx + c$.', working: [
          { math: '2y = 4x + 1' }, { mark: 'Adds $1$ to both sides' },
          { math: 'y = 2x + \\tfrac{1}{2}' },
          { answer: '$y = 2x + \\tfrac{1}{2}$' }] },
        { n: '5', level: 'hard', marks: 2, question: 'Draw the graph of $2y + 4 = 3x$.', figure: graph(empty(qs.q5)), working: [
          { math: '2y = 3x - 4 \\quad\\Rightarrow\\quad y = \\tfrac{3}{2}x - 2' }, { mark: 'Makes $y$ the subject' },
          { say: step(qs.q5) },
          { picture: graph(solved(qs.q5)) },
          { answer: 'A straight line through $(0, -2)$ and $(2, 1)$' }] },
        { n: '6', level: 'hard', marks: 2, question: 'Draw the graph of $y + 3x - 1 = 0$.', figure: graph(empty(qs.q6)), working: [
          { math: 'y = -3x + 1' }, { mark: 'Makes $y$ the subject' },
          { say: step(qs.q6) },
          { picture: graph(solved(qs.q6)) },
          { answer: 'A straight line through $(0, 1)$ and $(1, -2)$' }] },
        { n: '7', level: 'very hard', marks: 2, question: 'Draw the graph of $y - 1 = -\\tfrac{1}{2}x$.', figure: graph(empty(qs.q7)), working: [
          { math: 'y = -\\tfrac{1}{2}x + 1' }, { mark: 'Makes $y$ the subject' },
          { say: step(qs.q7) },
          { picture: graph(solved(qs.q7)) },
          { answer: 'A straight line through $(0, 1)$ and $(2, 0)$' }] },
      ],
    },
  }
}

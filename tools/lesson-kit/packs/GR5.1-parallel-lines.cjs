// GR5.1 Parallel lines: the video for graphs lesson 4, and its worksheet. From GR5 in Sunny's book scan (p79–81):
// parallel lines have the same gradient, make y the subject to compare m, and a line parallel to another through a
// point. Every number is our own, the same as the lesson's (src/features/parallel-lines/tutor/parallelLinesLesson.ts).
// As in the other graphs videos, x numbers are amber and y numbers biro blue; c is a y (where a line crosses the
// y axis), so it is blue too. Green is only for the answer.
module.exports = ({ m, line, answer, row, picture }) => {
  const { graph, tex, pt, COLOURS: { AMBER, BIRO, GREEN, INK } } = require('../lib/graph.cjs')
  const X = v => `\\textcolor{${AMBER}}{${v}}`, Y = v => `\\textcolor{${BIRO}}{${v}}`
  const work = t => `<div class="result">${m(t).replace('class="m ', `style="color:${INK}" class="m `)}</div>`
  const side = (svg, ...words) => row(picture(svg), `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;max-width:470px;text-align:center">${words.join('')}</div>`)
  const stack = (...parts) => `<div style="display:flex;flex-direction:column;align-items:center;gap:6px">${parts.join('')}</div>`
  const y = v => ({ axis: 'y', value: v })
  const across = g => g.x[1] - g.x[0]
  const xs = Array.from({ length: 201 }, (_, i) => i - 100)
  const near = (a, b) => Math.abs(a - b) < 1e-9
  /** y = mx + c, as two points for the grid: where it crosses the y axis, and one across. */
  const lineOf = (mm, c, colour) => ({ from: pt(0, c), to: pt(1, c + mm), ...(colour ? { colour } : {}) })
  /** ax + by = k is y = mx + c: every x from −100 to 100 lands on both. */
  const same = ({ a, b, k }, mm, c) => xs.every(x => near(a * x + b * (mm * x + c), k))
  /** The c that puts (px, py) on y = mx + c, tried from −100 to 100. */
  const cThrough = (mm, p) => xs.filter(c => near(mm * p.x + c, p.y))
  /** A line's gradient from two of its points, found by brute force: up over across. */
  const gradientOf = ({ a, b, k }) => { const ys = xs.map(x => (k - a * x) / b); return (ys[150] - ys[50]) / 100 }

  // The hero: three parallel lines.
  const hero = { x: [-4, 4], y: [-4, 4], unit: 28, numbersOver: true }
  // Same distance apart: y = ½x + 5 and y = ½x + 2, three units apart everywhere, both above the x axis where the gaps are drawn.
  const gap = { x: [-4, 4], y: [-1, 8], unit: 30, numbersOver: true }
  const gapLines = [lineOf(0.5, 5), lineOf(0.5, 2)]
  const gapLegs = [-3, -1, 1, 3].map(x => ({ from: pt(x, 0.5 * x + 2), to: pt(x, 0.5 * x + 5), label: '' }))
  // Same gradient: y = 2x + 3, y = 2x and y = 2x − 2.
  const three = { x: [-4, 4], y: [-3, 6], unit: 30, numbersOver: true }
  const cs = [3, 0, -2]
  const eq = c => `y = 2x${c > 0 ? ` + ${Y(c)}` : c < 0 ? ` - ${Y(-c)}` : ''}`
  // Compare: 4y − 8x = 12 is y = 2x + 3.
  const compare = { a: -8, b: 4, k: 12 }
  // Through a point: parallel to y = 3x − 1 through (2, 4) is y = 3x − 2.
  const P = pt(2, 4)
  const through = { x: [-1, 4], y: [-3, 6], unit: 34, numbersOver: true }

  // Worksheet lines, as ax + by = k.
  const q4 = { a: 6, b: 3, k: 9 }
  const q5 = [{ text: '2y - 4 = 6x', a: -6, b: 2, k: 4, m: 3, c: 2 }, { text: '3y + 6x = 3', a: 6, b: 3, k: 3, m: -2, c: 1 }, { text: 'y - 3x = 8', a: -3, b: 1, k: 8, m: 3, c: 8 }]
  const q2 = [['y = 4x + 7', 4, 7], ['y = -4x - 1', -4, -1], ['y = 1 + 4x', 4, 1], ['y = x - 4', 1, -4]]
  const q3 = { a: 3, b: 1, k: 5 }
  const q7 = { a: -1, b: 2, k: 6 }
  const q8 = { a: 8, b: 4, k: 4 }, q8grid = { x: [-2, 4], y: [-3, 7], unit: 26, numbersOver: true }

  return {
    code: 'GR5.1', topic: 'Parallel lines', strand: 'Graphs', file: 'GR5.1_Parallel_lines',

    checks: {
      'y = ½x + 5 and y = ½x + 2 are 3 apart at every x': xs.every(x => near((0.5 * x + 5) - (0.5 * x + 2), 3)) && gapLegs.every(l => l.from.y > 0) && gapLegs.every(l => near(l.to.y - l.from.y, 3)),
      'y = 2x + 3, y = 2x and y = 2x − 2 never meet: no x gives two of them the same y': cs.every(a => cs.every(b => a === b || xs.every(x => !near(2 * x + a, 2 * x + b)))),
      'the three lines cross the y axis at 3, 0 and −2, inside the grid': cs.every(c => c > three.y[0] && c < three.y[1]),
      '4y − 8x = 12: add 8x to both sides is 4y = 8x + 12': xs.every(x => near(compare.b * ((8 * x + 12) / 4) + compare.a * x, compare.k)),
      '4y − 8x = 12 is y = 2x + 3, gradient 2, the same as y = 2x + 5': same(compare, 2, 3) && gradientOf(compare) === 2,
      'parallel to y = 3x − 1 through (2, 4): 4 = 3 × 2 + c, so c = −2 and only −2': 3 * 2 === 6 && cThrough(3, P).join() === '-2',
      'y = 3x − 2 goes through (2, 4) and its c is inside the grid': near(3 * P.x - 2, P.y) && -2 > through.y[0],
      'Q1: 4y − 8x = 12 has gradient 2, so it is parallel to y = 2x + 5': gradientOf(compare) === 2,
      'Q2: only y = 4x + 7 and y = 1 + 4x have gradient 4': q2.filter(([, mm]) => mm === 4).map(([t]) => t).join() === 'y = 4x + 7,y = 1 + 4x' && xs.every(x => near(1 + 4 * x, 4 * x + 1)),
      'Q3: y = 5 − 3x is y = −3x + 5, gradient −3': same(q3, -3, 5) && gradientOf(q3) === -3,
      'Q4: 3y + 6x = 9 is y = −2x + 3, gradient −2': same(q4, -2, 3) && xs.every(x => near(3 * ((-6 * x + 9) / 3) + 6 * x, 9)) && gradientOf(q4) === -2,
      'Q5: 2y − 4 = 6x and y − 3x = 8 have gradient 3; 3y + 6x = 3 has −2': q5.every(q => same(q, q.m, q.c) && gradientOf(q) === q.m) && q5.filter(q => gradientOf(q) === 3).length === 2,
      'Q6: parallel to y = −2x + 7 through (2, 1): 1 = −4 + c, c = 5': cThrough(-2, pt(2, 1)).join() === '5',
      'Q7: 2y = x + 6 is y = ½x + 3; through (4, 1): 1 = 2 + c, c = −1': same(q7, 0.5, 3) && gradientOf(q7) === 0.5 && cThrough(0.5, pt(4, 1)).join() === '-1',
      'Q8: 4y = −8x + 4 is y = −2x + 1; through (1, 3): 3 = −2 + c, c = 5': same(q8, -2, 1) && gradientOf(q8) === -2 && cThrough(-2, pt(1, 3)).join() === '5',
      'Q8: (0, 5) and (1, 3) are inside the grid, one across and two down apart': [pt(0, 5), pt(1, 3)].every(p => p.x > q8grid.x[0] && p.x < q8grid.x[1] && p.y > q8grid.y[0] && p.y < q8grid.y[1]) && near(-2 * 1 + 5, 3),
      'no grid is more than 9 squares across or tall': [hero, gap, three, through, q8grid].every(g => across(g) <= 9 && g.y[1] - g.y[0] <= 10),
    },

    video: {
      slides: [
        { hero: 'Parallel lines', sub: 'Same gradient, never meet', items: [
          [picture(graph({ ...hero, lines: [lineOf(0.5, 2), lineOf(0.5, 0), lineOf(0.5, -2)] })), 2.6]] },
        { title: 'Always the same distance apart', opening: 1.2, items: [
          [side(graph({ ...gap, lines: gapLines }), line('parallel lines run side by side')), 2.6],
          [side(graph({ ...gap, lines: gapLines, legs: gapLegs }), line('parallel lines run side by side'), line('the gap is the same everywhere')), 3, 0],
          [side(graph({ ...gap, lines: gapLines, legs: gapLegs }), line('parallel lines run side by side'), line('the gap is the same everywhere'), line('so they **never meet**, however far they go')), 3.2, 1]] },
        { stage: 'Same gradient', title: 'y = 2x + 3, y = 2x and y = 2x − 2', opening: 1.2, items: [
          [side(graph({ ...three, lines: [lineOf(2, 3)], marks: [y(3)] }), work(eq(3))), 2.4],
          [side(graph({ ...three, lines: [lineOf(2, 3), lineOf(2, 0)], marks: [y(3)] }), work(eq(3)), work(eq(0))), 2.4, 0],
          [side(graph({ ...three, lines: [lineOf(2, 3), lineOf(2, 0), lineOf(2, -2)], marks: [y(3), y(-2)] }), work(eq(3)), work(eq(0)), work(eq(-2))), 2.6, 1],
          [side(graph({ ...three, lines: [lineOf(2, 3), lineOf(2, 0), lineOf(2, -2)], marks: [y(3), y(-2)] }), work(eq(3)), work(eq(0)), work(eq(-2)), line('all have $m = 2$: the **same gradient**, so parallel')), 3.6, 2],
          [side(graph({ ...three, lines: [lineOf(2, 3), lineOf(2, 0), lineOf(2, -2)], marks: [y(3), y(-2)] }), work(eq(3)), work(eq(0)), work(eq(-2)), line('all have $m = 2$: the **same gradient**, so parallel'), line(`only $${Y('c')}$ changes: where each crosses the $y$ axis`)), 3.8, 3]] },
        { stage: 'Is it parallel?', title: 'y = 2x + 5 and 4y − 8x = 12', opening: 1.2, items: [
          [line('$y = 2x + 5$ has $m = 2$. Make $y$ the subject of the other'), 3.2],
          [line('add $8x$ to both sides'), 2.4],
          [work('4y = 8x + 12'), 2.6],
          [line('divide every term by $4$'), 2.4],
          [work('y = 2x + 3'), 2.6],
          [answer('both have $m = 2$, so yes: they are parallel'), 3.6]] },
        { stage: 'Through a point', title: 'Parallel to y = 3x − 1, through (2, 4)', opening: 1.2, items: [
          [side(graph({ ...through, lines: [lineOf(3, -1)], points: [P] }), line('parallel, so the **same gradient**: $m = 3$'), work('y = 3x + c')), 3.4],
          [side(graph({ ...through, lines: [lineOf(3, -1)], points: [P] }), line(`put the point in: $${tex(2, 4)}$`), work(`${Y(4)} = 3 \\times ${X(2)} + c`)), 3.4, 0],
          [side(graph({ ...through, lines: [lineOf(3, -1)], points: [P] }), line(`put the point in: $${tex(2, 4)}$`), work(`${Y(4)} = 3 \\times ${X(2)} + c`), work(`${Y(4)} = 6 + c`), work(`c = ${Y(-2)}`)), 3.4, 1],
          [side(graph({ ...through, lines: [lineOf(3, -1), lineOf(3, -2, GREEN)], points: [P], marks: [y(-2)] }), work(`m = 3, \\quad c = ${Y(-2)}`), answer('$y = 3x - 2$'), line('alongside the first line, through the point')), 4, 2]] },
      ],
      recap: ['Parallel lines have the same gradient', 'Only c changes', 'Make y the subject to compare m', 'Through a point: same m, then put the point in for c'],
    },

    worksheet: {
      title: 'Parallel lines',
      questions: [
        { n: '1', level: 'worked', marks: 2, question: 'Is the line $y = 2x + 5$ parallel to the line $4y - 8x = 12$?', working: [
          { say: 'Parallel lines have the same gradient, so compare $m$. $y = 2x + 5$ has $m = 2$' },
          { say: 'Make $y$ the subject of $4y - 8x = 12$: add $8x$ to both sides' },
          { math: '4y = 8x + 12' },
          { say: 'Divide every term by $4$' },
          { math: 'y = 2x + 3' }, { mark: '$4y - 8x = 12$ has $m = 2$' },
          { answer: 'Yes: both have gradient $2$' }] },
        { n: '2', level: 'easy', marks: 2, question: ['Which of these lines are parallel to $y = 4x - 1$?', '$y = 4x + 7 \\qquad y = -4x - 1 \\qquad y = 1 + 4x \\qquad y = x - 4$'], working: [
          { say: 'Parallel lines have the same $m$: the number in front of $x$. Keep its sign' },
          { math: 'm = 4, \\quad -4, \\quad 4, \\quad 1' }, { mark: 'Sees that $y = 1 + 4x$ has $m = 4$' },
          { answer: '$y = 4x + 7$ and $y = 1 + 4x$' }] },
        { n: '3', level: 'easy', marks: 1, question: 'Write down the gradient of a line parallel to $y = 5 - 3x$.', working: [
          { say: 'Write it the usual way round, the $x$ term first' },
          { math: 'y = -3x + 5' },
          { answer: 'Gradient $-3$' }] },
        { n: '4', level: 'medium', marks: 2, question: 'Find the gradient of the line $3y + 6x = 9$.', working: [
          { math: '3y = -6x + 9' }, { mark: 'Takes $6x$ from both sides' },
          { math: 'y = -2x + 3' },
          { answer: 'Gradient $-2$' }] },
        { n: '5', level: 'medium', marks: 2, question: ['Two of these lines are parallel. Which two?', '$2y - 4 = 6x \\qquad 3y + 6x = 3 \\qquad y - 3x = 8$'], working: [
          { say: 'Make $y$ the subject of each one' },
          { math: '2y - 4 = 6x \\;\\Rightarrow\\; y = 3x + 2' },
          { math: '3y + 6x = 3 \\;\\Rightarrow\\; y = -2x + 1' },
          { math: 'y - 3x = 8 \\;\\Rightarrow\\; y = 3x + 8' }, { mark: 'Makes $y$ the subject of each' },
          { answer: '$2y - 4 = 6x$ and $y - 3x = 8$ (both $m = 3$)' }] },
        { n: '6', level: 'hard', marks: 2, question: 'Find the equation of the line parallel to $y = -2x + 7$ that goes through $(2, 1)$.', working: [
          { say: 'Parallel, so the same gradient: $m = -2$. Put the point in' },
          { math: `${Y(1)} = -2 \\times ${X(2)} + c` },
          { math: `${Y(1)} = -4 + c \\quad\\Rightarrow\\quad c = 5` }, { mark: '$c = 5$' },
          { answer: '$y = -2x + 5$' }] },
        { n: '7', level: 'hard', marks: 3, question: 'Find the equation of the line parallel to $2y = x + 6$ that goes through $(4, 1)$.', working: [
          { say: 'Divide $2y = x + 6$ by $2$ to read its gradient' },
          { math: 'y = \\tfrac{1}{2}x + 3' }, { mark: '$m = \\tfrac{1}{2}$' },
          { math: `${Y(1)} = \\tfrac{1}{2} \\times ${X(4)} + c` },
          { math: `${Y(1)} = 2 + c \\quad\\Rightarrow\\quad c = -1` }, { mark: '$c = -1$' },
          { answer: '$y = \\tfrac{1}{2}x - 1$' }] },
        { n: '8', level: 'very hard', marks: 3, question: 'On the grid, draw the line parallel to $4y = -8x + 4$ that goes through $(1, 3)$.', figure: graph(q8grid), working: [
          { say: 'Divide by $4$ to read the gradient' },
          { math: 'y = -2x + 1' }, { mark: '$m = -2$' },
          { math: `${Y(3)} = -2 \\times ${X(1)} + c \\quad\\Rightarrow\\quad c = 5` }, { mark: '$c = 5$: plot $(0, 5)$' },
          { say: `From $${tex(0, 5)}$: across $${X(1)}$, down $${Y(2)}$ to $${tex(1, 3)}$, then join. It runs alongside $y = -2x + 1$` },
          { picture: graph({ ...q8grid, marks: [y(5)], lines: [lineOf(-2, 1), lineOf(-2, 5, GREEN)], points: [{ ...pt(1, 3), label: '' }], legs: [{ from: pt(0, 5), to: pt(1, 5), label: '' }, { from: pt(1, 5), to: pt(1, 3), label: '' }] }) },
          { answer: 'A straight line through $(0, 5)$ and $(1, 3)$: $y = -2x + 5$' }] },
      ],
    },
  }
}

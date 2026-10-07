// GR3.1 Coordinates: the video for graphs lesson 1 (src/features/coordinates/), and its worksheet. From GR3 in Sunny's
// book scan (p74–75); every number is our own. Plotting is across, then up; reading is down to the x axis, then across
// to the y axis; the midpoint is halfway across, then halfway up. The storyboard is
// /mnt/project-files/lessons/graphs/L1-coordinates/STORYBOARD.md.
module.exports = ({ line, result, answer, row, picture }) => {
  const { graph, tex, marksOf, pt } = require('../lib/graph.cjs')
  const mid = (a, b) => pt((a.x + b.x) / 2, (a.y + b.y) / 2)
  const same = (a, b) => a.x === b.x && a.y === b.y
  const side = (svg, ...words) => row(picture(svg), `<div style="display:flex;flex-direction:column;gap:14px;max-width:420px;text-align:left">${words.join('')}</div>`)
  const x = v => ({ axis: 'x', value: v }), y = v => ({ axis: 'y', value: v })

  // Plot (4, 2): across 4, then up 2.
  const P = pt(4, 2), plotGrid = { x: [-1, 7], y: [-1, 5], unit: 30 }
  const across = { from: pt(0, 0), to: pt(4, 0), label: '4' }, up = { from: pt(4, 0), to: P, label: '2' }
  // Plot (−3, 2): across −3 is left.
  const N = pt(-3, 2), negGrid = { x: [-5, 3], y: [-1, 4], unit: 30 }
  // Read the dot at (−2, −4).
  const R = pt(-2, -4), readGrid = { x: [-4, 3], y: [-5, 2], unit: 30 }
  // The midpoint of (1, 2) and (7, 6): (4, 4).
  const A = pt(1, 2), B = pt(7, 6), M = mid(A, B), midGrid = { x: [-1, 8], y: [-1, 7], unit: 22 }
  const ends = [pt(1, 2, { dx: 1, dy: 1 }), pt(7, 6, { dx: -1, dy: -1 })]
  const segment = [{ from: A, to: B, segment: true }]

  // Worksheet points.
  const sheet = { A: pt(2, 3), B: pt(-3, 1), C: pt(4, -2), P: pt(0, 3), Q: pt(-4, 0) }

  return {
    code: 'GR3.1', topic: 'Coordinates', strand: 'Graphs', file: 'GR3.1_Coordinates',

    // Every answer below, worked out again. The kit stops if any is false.
    checks: {
      'across 4 then up 2 lands on (4, 2)': same(pt(across.to.x, up.to.y), P),
      'the midpoint of (1, 2) and (7, 6) is (4, 4)': same(M, pt(4, 4)),
      'Q5: the midpoint of (2, 1) and (6, 5) is (4, 3)': same(mid(pt(2, 1), pt(6, 5)), pt(4, 3)),
      'Q6: the midpoint of (−5, −1) and (1, 7) is (−2, 3)': same(mid(pt(-5, -1), pt(1, 7)), pt(-2, 3)),
      'Q7: the midpoint of (0, 3) and (5, −4) is (2.5, −0.5)': same(mid(pt(0, 3), pt(5, -4)), pt(2.5, -0.5)),
      'Q8: B is (5, 5), and the midpoint of (−1, 1) and (5, 5) is (2, 3)': same(pt(2 * 2 - -1, 2 * 3 - 1), pt(5, 5)) && same(mid(pt(-1, 1), pt(5, 5)), pt(2, 3)),
      'every worksheet point is inside its grid': [sheet.A, sheet.B, sheet.C, sheet.P, sheet.Q].every(p => p.x > -5 && p.x < 5 && p.y > -4 && p.y < 5),
    },

    video: {
      slides: [
        { hero: 'Where is the point?', sub: 'Coordinates: across, then up', items: [
          [picture(graph({ ...plotGrid, unit: 26, points: [pt(4, 2, { label: '' })] })), 3]] },
        { stage: 'Step 1 · read', title: 'Read the brackets', items: [
          [side(graph({ ...plotGrid, marks: marksOf(P) }), result(tex(4, 2)), line('the first number is **across**, the second is **up**')), 3.6]] },
        { stage: 'Step 2 · across', title: 'Across 4', from: `$${tex(4, 2)}$`, items: [
          [side(graph({ ...plotGrid, legs: [across], marks: [x(4)] }), line('start at $0$ and go along the $x$ axis')), 3.4]] },
        { stage: 'Step 3 · up', title: 'Then up 2', from: 'across $4$', items: [
          [side(graph({ ...plotGrid, legs: [across, up], marks: [y(2)] }), line('then straight up')), 3.2],
          [side(graph({ ...plotGrid, legs: [across, up], points: [pt(4, 2, { dx: -1, dy: -1 })], marks: marksOf(P) }), line('then straight up'), answer(`the point $${tex(4, 2)}$`)), 3.4, 0]] },
        { title: 'Negative goes left', from: `$${tex(-3, 2)}$`, items: [
          [side(graph({ ...negGrid, legs: [{ from: pt(0, 0), to: pt(-3, 0), label: '−3' }], marks: [x(-3)] }), line('a negative $x$ goes **left** of $0$')), 3.4],
          [side(graph({ ...negGrid, legs: [{ from: pt(0, 0), to: pt(-3, 0), label: '−3' }, { from: pt(-3, 0), to: N, label: '2' }], points: [pt(-3, 2, { dx: 1, dy: -1 })], marks: marksOf(N) }), line('a negative $x$ goes **left** of $0$'), line('then up $2$'), answer(`$${tex(-3, 2)}$`)), 3.6, 0]] },
        { title: 'Read a point', items: [
          [side(graph({ ...readGrid, points: [pt(-2, -4, { label: '' })], legs: [{ from: R, to: pt(-2, 0), dashed: true, colour: '#b45309' }], marks: [x(-2)] }), line('up to the $x$ axis: $x$ is $-2$')), 3.4],
          [side(graph({ ...readGrid, points: [pt(-2, -4, { label: '' })], legs: [{ from: R, to: pt(-2, 0), dashed: true, colour: '#b45309' }, { from: R, to: pt(0, -4), dashed: true, colour: '#2443b5' }], marks: marksOf(R) }), line('up to the $x$ axis: $x$ is $-2$'), line('across to the $y$ axis: $y$ is $-4$'), answer(`$${tex(-2, -4)}$`)), 3.8, 0]] },
        { title: 'The midpoint', from: `$${tex(1, 2)}$ and $${tex(7, 6)}$`, items: [
          [side(graph({ ...midGrid, lines: segment, points: ends, rings: [A, B], marks: [x(1), x(7), x(4)] }), line('halfway **across**: add the $x$ numbers and halve'), result('(1 + 7) \\div 2 = 4')), 4],
          [side(graph({ ...midGrid, lines: segment, points: ends, rings: [A, B], marks: [y(2), y(6), y(4)] }), line('halfway **up**: add the $y$ numbers and halve'), result('(2 + 6) \\div 2 = 4')), 4, 0],
          [side(graph({ ...midGrid, lines: segment, points: [...ends, pt(4, 4, { dx: 1, dy: 1 })], marks: marksOf(M) }), line('it sits exactly halfway along the line'), answer(`midpoint $${tex(4, 4)}$`)), 3.6, 1]] },
      ],
      recap: ['Across first, then up: (x, y)', 'Negative x goes left, negative y goes down', 'Midpoint: add and halve, the x’s and the y’s'],
    },

    worksheet: {
      title: 'Coordinates',
      questions: [
        { n: '1', level: 'worked', marks: 1, question: 'Plot the point $(4, 2)$ on the grid.', working: [
          { say: 'Across $4$ along the $x$ axis, then up $2$' },
          { picture: graph({ ...plotGrid, unit: 26, legs: [across, up], points: [pt(4, 2, { dx: -1, dy: -1 })], marks: marksOf(P) }) },
          { answer: 'The point $(4, 2)$' }] },
        { n: '2', level: 'easy', marks: 3, question: 'Write down the coordinates of the points $A$, $B$ and $C$.', figure: graph({ x: [-5, 5], y: [-4, 5], unit: 26, points: [pt(2, 3, { label: 'A' }), pt(-3, 1, { label: 'B' }), pt(4, -2, { label: 'C' })] }), working: [
          { say: 'Down (or up) to the $x$ axis first, then across to the $y$ axis' },
          { answer: '$A(2, 3)$' }, { answer: '$B(-3, 1)$' }, { answer: '$C(4, -2)$' }] },
        { n: '3', level: 'easy', marks: 2, question: 'Plot the points $(-1, 3)$ and $(2, -2)$ on the grid.', figure: graph({ x: [-4, 4], y: [-4, 4], unit: 26 }), working: [
          { picture: graph({ x: [-4, 4], y: [-4, 4], unit: 26, points: [pt(-1, 3, { dx: -1, dy: 1 }), pt(2, -2, { dx: 1, dy: 1 })], marks: [...marksOf(pt(-1, 3)), ...marksOf(pt(2, -2))] }) },
          { mark: '$(-1, 3)$: left $1$, up $3$' }, { answer: '$(2, -2)$: across $2$, down $2$' }] },
        { n: '4', level: 'medium', marks: 2, question: 'Write down the coordinates of $P$ and $Q$.', figure: graph({ x: [-5, 3], y: [-2, 5], unit: 26, points: [pt(0, 3, { label: 'P' }), pt(-4, 0, { label: 'Q', dy: -1 })] }), working: [
          { say: '$P$ is on the $y$ axis, so it didn’t go across: $x$ is $0$' }, { answer: '$P(0, 3)$' },
          { say: '$Q$ is on the $x$ axis, so it didn’t go up: $y$ is $0$' }, { answer: '$Q(-4, 0)$' }] },
        { n: '5', level: 'medium', marks: 2, question: 'Find the midpoint of the line drawn below.', figure: graph({ x: [-1, 7], y: [-1, 6], unit: 26, lines: [{ from: pt(2, 1), to: pt(6, 5), segment: true }], points: [pt(2, 1, { dx: -1, dy: -1 }), pt(6, 5, { dx: -1, dy: -1 })] }), working: [
          { math: '(2 + 6) \\div 2 = 4' }, { math: '(1 + 5) \\div 2 = 3' }, { mark: 'Add and halve, the $x$’s and the $y$’s' },
          { answer: 'Midpoint $(4, 3)$' }] },
        { n: '6', level: 'hard', marks: 2, question: 'Find the midpoint of $(-5, -1)$ and $(1, 7)$.', working: [
          { math: '(-5 + 1) \\div 2 = -2' }, { math: '(-1 + 7) \\div 2 = 3' }, { mark: 'Both halfway numbers' },
          { answer: 'Midpoint $(-2, 3)$' }] },
        { n: '7', level: 'very hard', marks: 2, question: 'Find the midpoint of $(0, 3)$ and $(5, -4)$.', working: [
          { math: '(0 + 5) \\div 2 = 2.5' }, { math: '(3 + (-4)) \\div 2 = -0.5' }, { mark: 'Both halfway numbers, halves allowed' },
          { answer: 'Midpoint $(2.5, -0.5)$' }] },
        { n: '8', level: 'very hard', marks: 2, question: ['The midpoint of the line $AB$ is $(2, 3)$.', '$A$ is the point $(-1, 1)$. Find the coordinates of $B$.'], working: [
          { say: 'From $A$ to the midpoint is half the way. Go the same again to reach $B$' },
          { math: 'x: -1 \\to 2 \\text{ is } 3 \\text{ across, so } 2 + 3 = 5' }, { math: 'y: 1 \\to 3 \\text{ is } 2 \\text{ up, so } 3 + 2 = 5' }, { mark: 'The same step again, across and up' },
          { answer: '$B(5, 5)$' }] },
      ],
    },
  }
}

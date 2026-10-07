// GR4.1 Lines from coordinates: the video for graphs lesson 2, and its worksheet. From GR1's first box (p70: across
// and up-and-down lines) and GR4 method 1 (p76–77: a table of values, then plot and join) in Sunny's book scan; every
// number is our own. A line is just points whose coordinates follow a rule, each plotted "across, then up" as in
// lesson 1. The storyboard is /mnt/project-files/lessons/graphs/L2-lines-from-coordinates/STORYBOARD.md.
module.exports = ({ m, line, answer, row, picture }) => {
  const { graph, table, marksOf, pt, show, COLOURS: { AMBER, BIRO, GREEN, INK } } = require('../lib/graph.cjs')
  const X = v => `\\textcolor{${AMBER}}{${v}}`, Y = v => `\\textcolor{${BIRO}}{${v}}`
  // A bracketed x in a sum, amber: (−1), or a plain 2.
  const bx = v => v < 0 ? `(${X(v)})` : X(v)
  // The working pill: the rule's own numbers in ink, so only x is amber and only y is blue.
  const work = tex => `<div class="result">${m(tex).replace('class="m ', `style="color:${INK}" class="m `)}</div>`
  const side = (left, ...words) => row(left, `<div style="display:flex;flex-direction:column;align-items:center;gap:14px;max-width:440px;text-align:center">${words.join('')}</div>`)
  const under = (...parts) => `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:22px">${parts.join('')}</div>`
  const x = v => ({ axis: 'x', value: v }), y = v => ({ axis: 'y', value: v })
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
  const collinear = ps => ps.every((p, i) => i < 2 || (ps[1].y - ps[0].y) * (p.x - ps[0].x) === (p.y - ps[0].y) * (ps[1].x - ps[0].x))
  const across = g => g.x[1] - g.x[0]

  // y = 3: three points with y 3, then the line across.
  const flatGrid = { x: [-4, 4], y: [-1, 5], unit: 40 }
  const flat = [pt(-3, 3), pt(1, 3), pt(3, 3, { dx: -1, dy: -1 })]
  // y = 2x − 1 for x = −1, 0, 1, 2.
  const rule = v => 2 * v - 1
  const xs = [-1, 0, 1, 2], ys = xs.map(rule)
  const P = xs.map(v => pt(v, rule(v), { label: '' }))
  const lineGrid = { x: [-2, 3], y: [-4, 4], unit: 34 }
  const ruleLine = { from: P[0], to: P[3], colour: GREEN }
  const sum = v => `2 \\times ${bx(v)} - 1 = ${Y(rule(v))}`
  // Across to x, then up (or down) to y; no across leg when x is 0.
  const legsTo = p => [...(p.x ? [{ from: pt(0, 0), to: pt(p.x, 0), label: '' }] : []), { from: pt(p.x, 0), to: p, label: '' }]
  const words = v => `${v ? `across to $${X(v)}$, then` : `$${X(0)}$: no across, just`} ${rule(v) > 0 ? 'up' : 'down'} to $${Y(rule(v))}$`

  // Worksheet tables.
  const q4 = { rule: v => v + 3, xs: [-2, -1, 0, 1, 2] }
  const q5 = { rule: v => 3 * v - 2, xs: [-1, 0, 1, 2, 3] }
  const q6 = { rule: v => 5 - 2 * v, xs: [-2, -1, 0, 1, 2, 3] }
  const q7 = { rule: v => 2 * v + 1, xs: [-1, 0, 1, 2, 3], ys: [-1, 1, 3, 4, 7] }
  const fill = q => q.xs.map(q.rule)
  const q4Grid = { x: [-3, 3], y: [-1, 6], unit: 26 }
  const q2Grid = { x: [-2, 5], y: [-3, 3], unit: 26 }, q3Grid = { x: [-2, 6], y: [-2, 4], unit: 26 }
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
  const wrong = q7.xs.filter((v, i) => q7.rule(v) !== q7.ys[i])
  const fits = (g, ps) => ps.every(p => p.x > g.x[0] && p.x < g.x[1] && p.y > g.y[0] && p.y < g.y[1])

  return {
    code: 'GR4.1', topic: 'Lines from coordinates', strand: 'Graphs', file: 'GR4.1_Lines_from_coordinates',

    // Every answer below, worked out again. The kit stops if any is false.
    checks: {
      'every point drawn on y = 3 has y 3': flat.every(p => p.y === 3),
      'y = 2x − 1 for x = −1, 0, 1, 2 gives −3, −1, 1, 3': same(ys, [-3, -1, 1, 3]),
      'the four y = 2x − 1 points line up': collinear(P),
      'Q1: the line through (−1, −3) and (2, 3) is y = 2x − 1 (every x from −100 to 100)': range(-100, 100).every(v => P[0].y + (v - P[0].x) * (P[3].y - P[0].y) / (P[3].x - P[0].x) === rule(v)),
      'Q2: the line drawn through (3, 0) and (3, 1) is x = 3': [pt(3, 0), pt(3, 1)].every(p => p.x === 3),
      'Q3: y = 1 is through (0, 1) across, x = 4 through (4, 0) up and down': pt(0, 1).y === 1 && pt(4, 0).x === 4,
      'Q4: y = x + 3 for x = −2 … 2 gives 1, 2, 3, 4, 5, and they line up': same(fill(q4), [1, 2, 3, 4, 5]) && collinear(q4.xs.map((v, i) => pt(v, fill(q4)[i]))),
      'Q5: y = 3x − 2 for x = −1 … 3 gives −5, −2, 1, 4, 7': same(fill(q5), [-5, -2, 1, 4, 7]),
      'Q6: y = 5 − 2x for x = −2 … 3 gives 9, 7, 5, 3, 1, −1': same(fill(q6), [9, 7, 5, 3, 1, -1]),
      'Q7: the only wrong value in the y = 2x + 1 table is at x = 2, and it should be 5': same(wrong, [2]) && q7.rule(2) === 5,
      'Q8: 3 × (−2) − 1 = −7, so (−2, −7) lies on y = 3x − 1': 3 * -2 - 1 === -7,
      'every point is inside its grid': fits(flatGrid, flat) && fits(lineGrid, P) && fits(q4Grid, q4.xs.map((v, i) => pt(v, fill(q4)[i]))),
      'no grid is more than 9 squares across': [flatGrid, lineGrid, q2Grid, q3Grid, q4Grid].every(g => across(g) <= 9),
    },

    video: {
      slides: [
        { hero: 'From a rule to a line', sub: 'Lines from coordinates', items: [
          [picture(graph({ ...lineGrid, unit: 24, numbers: false, lines: [ruleLine], points: P })), 3]] },
        { title: 'The line y = 3', items: [
          [side(picture(graph({ ...flatGrid, points: flat, marks: [y(3)] })), line(`every point has $y = ${Y(3)}$`)), 3.6],
          [side(picture(graph({ ...flatGrid, points: flat, lines: [{ from: flat[0], to: flat[2], colour: GREEN, label: 'y = 3', labelAt: -2 }], marks: [y(3)] })), line(`every point has $y = ${Y(3)}$`), answer('so it goes **across**')), 3.8, 0]] },
        { stage: 'Step 1 · table', title: 'A table for y = 2x − 1', items: [
          [under(table({ x: xs, size: 30 }), line('put each $x$ into the rule: double it, then take $1$')), 3.4],
          ...xs.map((v, i) => [under(table({ x: xs, y: ys.map((w, j) => j <= i ? w : null), lit: i, grey: range(0, i - 1), answer: i === 3 ? 3 : [], size: 30 }), work(sum(v))), i ? 2.8 : 3.4, i]),
        ] },
        { stage: 'Step 2 · plot and join', title: 'Across, then up', from: 'the table', items: [
          ...xs.map((v, i) => [side(picture(graph({ ...lineGrid, points: P.slice(0, i + 1), legs: legsTo(P[i]), marks: marksOf(P[i]) })), table({ x: xs, y: ys, lit: i }), line(words(v))), i ? 2.8 : 3.4, i ? i - 1 : undefined]),
          [side(picture(graph({ ...lineGrid, points: P, lines: [ruleLine] })), table({ x: xs, y: ys }), line('they line up: join them'), answer('one straight line')), 3.8, 3],
          [side(picture(graph({ ...lineGrid, points: P, lines: [ruleLine] })), table({ x: xs, y: ys }), line('they line up: join them'), answer('one straight line'), line('no $x^2$, $x^3$ or $y^2$ in the rule: always a straight line')), 3.8, 4],
        ] },
      ],
      recap: ['y = a goes across, x = a goes up and down', 'Put each x into the rule to fill the table', 'No x², x³ or y²: a straight line', 'Plot and join with one straight line'],
    },

    worksheet: {
      title: 'Lines from coordinates',
      questions: [
        { n: '1', level: 'worked', marks: 2, question: 'Complete the table for $y = 2x - 1$, then draw the line on the grid.', figure: `${table({ x: xs, size: 15 })}<div style="height:10px"></div>${graph({ ...lineGrid, unit: 22 })}`, working: [
          { say: 'Put each $x$ into the rule: double it, then take $1$' },
          { math: `${sum(-1)}, \\quad ${sum(0)}` }, { math: `${sum(1)}, \\quad ${sum(2)}` },
          { picture: table({ x: xs, y: ys, size: 15 }) }, { mark: 'All four $y$ values' },
          { say: 'Plot each pair across, then up. They line up, so join them' },
          { picture: graph({ ...lineGrid, unit: 22, points: P, lines: [ruleLine] }) },
          { answer: 'One straight line through all four points' }] },
        { n: '2', level: 'easy', marks: 1, question: 'Write down the equation of the line drawn below.', figure: graph({ ...q2Grid, lines: [{ from: pt(3, 0), to: pt(3, 1) }] }), working: [
          { say: `It goes up and down, and every point on it has $x = ${X(3)}$` }, { answer: '$x = 3$' }] },
        { n: '3', level: 'easy', marks: 2, question: 'Draw the lines $y = 1$ and $x = 4$ on the grid.', figure: graph(q3Grid), working: [
          { picture: graph({ ...q3Grid, lines: [{ from: pt(0, 1), to: pt(1, 1), colour: GREEN, label: 'y = 1', labelAt: 2 }, { from: pt(4, 0), to: pt(4, 1), colour: GREEN, label: 'x = 4', labelAt: 3 }], marks: [y(1), x(4)] }) },
          { mark: `$y = 1$ goes across, through $(${X(0)}, ${Y(1)})$` }, { answer: `$x = 4$ goes up and down, through $(${X(4)}, ${Y(0)})$` }] },
        { n: '4', level: 'medium', marks: 2, question: 'Complete the table for $y = x + 3$, then draw the line on the grid.', figure: `${table({ x: q4.xs, size: 15 })}<div style="height:10px"></div>${graph(q4Grid)}`, working: [
          { math: `${X(-2)} + 3 = ${Y(1)}, \\quad ${X(0)} + 3 = ${Y(3)}, \\quad ${bx(2)} + 3 = ${Y(5)}` },
          { picture: table({ x: q4.xs, y: fill(q4), size: 15 }) }, { mark: 'All five $y$ values' },
          { picture: graph({ ...q4Grid, points: q4.xs.map((v, i) => pt(v, fill(q4)[i], { label: '' })), lines: [{ from: pt(-2, 1), to: pt(2, 5), colour: GREEN }] }) },
          { answer: 'One straight line through all five points' }] },
        { n: '5', level: 'medium', marks: 2, question: 'Complete the table for $y = 3x - 2$.', figure: table({ x: q5.xs, size: 15 }), working: [
          { say: 'Times by $3$, then take $2$' },
          { math: `3 \\times ${bx(-1)} - 2 = ${Y(-5)}` }, { math: `3 \\times ${bx(3)} - 2 = ${Y(7)}` }, { mark: 'Three values right' },
          { picture: table({ x: q5.xs, y: fill(q5), size: 15 }) }, { answer: `$y = ${Y(-5)}, ${Y(-2)}, ${Y(1)}, ${Y(4)}, ${Y(7)}$` }] },
        { n: '6', level: 'hard', marks: 2, question: 'Complete the table for $y = 5 - 2x$.', figure: table({ x: q6.xs, size: 15 }), working: [
          { say: 'Start at $5$ and take away $2x$. Taking away a negative adds' },
          { math: `5 - 2 \\times ${bx(-2)} = 5 + 4 = ${Y(9)}` }, { math: `5 - 2 \\times ${bx(3)} = 5 - 6 = ${Y(-1)}` }, { mark: 'Both signs right' },
          { picture: table({ x: q6.xs, y: fill(q6), size: 15 }) }, { answer: `$y = ${Y(9)}, ${Y(7)}, ${Y(5)}, ${Y(3)}, ${Y(1)}, ${Y(-1)}$` }] },
        { n: '7', level: 'very hard', marks: 2, question: ['Here is a table of values for $y = 2x + 1$.', 'One $y$ value is wrong. Find it and explain.'], figure: table({ x: q7.xs, y: q7.ys, size: 15 }), working: [
          { say: 'Put each $x$ back into the rule and check. The $y$ values should go up by $2$ each time' },
          { math: `2 \\times ${X(2)} + 1 = ${Y(5)}, \\text{ not } ${Y(4)}` }, { mark: 'Works out the right value' },
          { answer: `At $x = ${X(2)}$, $y$ should be $${Y(5)}$, not $${Y(4)}$` }] },
        { n: '8', level: 'very hard', marks: 2, question: `Does the point $(${X(-2)}, ${Y(-7)})$ lie on the line $y = 3x - 1$? Show how you know.`, working: [
          { say: 'Put the $x$ into the rule and see if it gives the $y$' },
          { math: `3 \\times ${bx(-2)} - 1 = -6 - 1 = ${Y(-7)}` }, { mark: 'Substitutes $x = -2$' },
          { answer: `Yes: it gives $y = ${Y(-7)}$` }] },
      ],
    },
  }
}

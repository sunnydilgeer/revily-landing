// GR6.1 Quadratic and cubic graphs: the video for graphs lesson 6, and its worksheet. From GR6 in Sunny's book scan
// (p80–83): a rule with x² makes a U (or ∩ when the x² is taken away), a rule with x³ an S; fill a table of values,
// a negative x in brackets, then plot every column and join them with one smooth curve, freehand. Every number is our
// own; the video's are the lesson's (src/features/curve-graphs/tutor/curveGraphsLesson.ts). As in the other graphs
// videos, x numbers are amber and y numbers biro blue; green is only for the answer. Curves are drawn smooth, by
// sampling the rule finely (graph.cjs `curves`), never as straight bits between the points.
module.exports = ({ m, line, answer, row, picture }) => {
  const { graph, table, marksOf, pt, show, COLOURS: { AMBER, BIRO, GREEN, INK } } = require('../lib/graph.cjs')
  const X = v => `\\textcolor{${AMBER}}{${String(v).replace('−', '-')}}`, Y = v => `\\textcolor{${BIRO}}{${String(v).replace('−', '-')}}`
  const work = (tex, size) => `<div class="result"${size ? ` style="font-size:${size}px"` : ''}>${m(tex).replace('class="m ', `style="color:${INK}" class="m `)}</div>`
  // Maths in a line of words, in ink, so only the x numbers are amber and the y numbers blue.
  const ink = tex => `\\textcolor{${INK}}{${tex}}`
  const side = (left, ...words) => row(left, `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;max-width:440px;text-align:center">${words.join('')}</div>`)
  const under = (...parts) => `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:22px">${parts.join('')}</div>`
  const stack = (...parts) => `<div style="display:flex;flex-direction:column;align-items:center;gap:6px">${parts.join('')}</div>`
  const x = v => ({ axis: 'x', value: v }), y = v => ({ axis: 'y', value: v })
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
  const across = g => g.x[1] - g.x[0], tall = g => g.y[1] - g.y[0]
  const fine = (a, b) => Array.from({ length: Math.round((b - a) * 100) + 1 }, (_, i) => a + i / 100)

  /**
   * A rule, as its terms in the order it is written ([coefficient, power]): its text, its value at x, and the sum
   * for one x, every x in brackets when it is negative (amber in, blue out), as the lesson's workings write it.
   */
  const rule = (text, terms) => {
    const f = v => terms.reduce((s, [c, p]) => s + c * v ** p, 0)
    const sum = v => {
      const xs = v < 0 ? `(${X(v)})` : X(v)
      const join = list => list.map(([neg, body], i) => i ? ` ${neg ? '-' : '+'} ${body}` : `${neg ? '-' : ''}${body}`).join('')
      const put = join(terms.map(([c, p]) => {
        const body = p === 0 ? `${Math.abs(c)}` : p === 1 ? xs : `${xs}^${p}`
        return [c < 0, p === 0 || Math.abs(c) === 1 ? body : `${Math.abs(c)} \\times ${body}`]
      }))
      const values = terms.map(([c, p]) => c * v ** p)
      const worked = join(values.map(w => [w < 0, `${Math.abs(w)}`]))
      return terms.length > 1 ? `${put} = ${worked} = ${Y(f(v))}` : `${put} = ${Y(f(v))}`
    }
    return { text, tex: text.replace(/²/g, '^2').replace(/³/g, '^3').replace(/−/g, '-'), terms, f, sum }
  }
  const ys = (r, xs) => xs.map(r.f)
  const pts = (r, xs, extra = {}) => xs.map(v => pt(v, r.f(v), { label: '', ...extra }))
  const curveOf = (r, xs, colour = INK, extra = {}) => ({ f: r.f, from: Math.min(...xs), to: Math.max(...xs), colour, ...extra })
  /** The lowest (or highest) point between a and b, tried every 1/100: the turning point. */
  const turning = (r, a, b, top = false) => fine(a, b).reduce((best, v) => (top ? r.f(v) > r.f(best) : r.f(v) < r.f(best)) ? v : best, a)
  /** Every point drawn is inside its grid, and so is the curve between them. */
  const fits = (g, r, xs) => fine(Math.min(...xs), Math.max(...xs)).every(v => r.f(v) > g.y[0] && r.f(v) < g.y[1]) && xs.every(v => v > g.x[0] && v < g.x[1])

  // The video: y = x² − 3 (the U), y = 3 − x² (the ∩), y = x³ − 3x (the S).
  const quad = rule('y = x² − 3', [[1, 2], [-3, 0]]), xs = range(-2, 2), qys = ys(quad, xs)
  const cap = rule('y = 3 − x²', [[3, 0], [-1, 2]])
  const cubic = rule('y = x³ − 3x', [[1, 3], [-3, 1]]), cys = ys(cubic, xs)
  const shapeGrid = { x: [-4, 4], y: [-4, 4], unit: 28, numbersOver: true }
  const plotGrid = { x: [-3, 3], y: [-4, 3], unit: 40, numbersOver: true }
  const cubeGrid = { x: [-3, 3], y: [-3, 3], unit: 40, numbersOver: true }
  const P = pts(quad, xs), S = pts(cubic, xs)
  const legsTo = p => [...(p.x ? [{ from: pt(0, 0), to: pt(p.x, 0), label: '' }] : []), { from: pt(p.x, 0), to: p, label: '' }]
  const words = v => `${v ? `across to $${X(v)}$, then` : `$${X(0)}$: no across, just`} ${quad.f(v) > 0 ? 'up' : 'down'} to $${Y(quad.f(v))}$`
  const caption = (svg, words) => `<div style="display:flex;flex-direction:column;align-items:center;gap:2px">${picture(svg)}${line(words)}</div>`
  const U = graph({ ...shapeGrid, curves: [{ f: quad.f, label: quad.text, labelAt: [3.85, -3.4], anchor: 'end', size: 15 }] })
  const N = graph({ ...shapeGrid, curves: [{ f: cap.f, label: cap.text, labelAt: [3.85, 3.25], anchor: 'end', size: 15 }] })

  // Worksheet rules, each with its xs, grid and the ys worked out by hand (the checks compare them).
  const q2 = { r: rule('y = x² + 2', [[1, 2], [2, 0]]), xs: range(-2, 2), expect: [6, 3, 2, 3, 6] }
  const q3 = { r: rule('y = x² − 2x − 1', [[1, 2], [-2, 1], [-1, 0]]), xs: range(-1, 3), expect: [2, -1, -2, -1, 2], grid: { x: [-2, 4], y: [-3, 3], unit: 26, numbersOver: true } }
  const q4 = { r: rule('y = 3 + 2x − x²', [[3, 0], [2, 1], [-1, 2]]), xs: range(-1, 3), expect: [0, 3, 4, 3, 0], top: pt(1, 4), grid: { x: [-2, 4], y: [-1, 5], unit: 26, numbersOver: true } }
  const q5 = { r: rule('y = x³ − 2x', [[1, 3], [-2, 1]]), xs: range(-2, 2), expect: [-4, 1, 0, -1, 4], grid: { x: [-3, 3], y: [-5, 5], unit: 22, numbersOver: true } }
  // Q6: Sam's table for y = x² − 3x has one wrong y: he wrote −1² as −1, so x = −1 gives −1 + 3 = 2, not 4.
  const q6 = { r: rule('y = x² − 3x', [[1, 2], [-3, 1]]), xs: range(-1, 4), expect: [4, 0, -2, -2, 0, 4], given: [2, 0, -2, -2, 0, 4], grid: { x: [-2, 5], y: [-3, 5], unit: 26, numbersOver: true } }
  // Q7: y = x² − 4x + 1 is drawn; its lowest point is (2, −3).
  const q7 = { r: rule('y = x² − 4x + 1', [[1, 2], [-4, 1], [1, 0]]), low: pt(2, -3), grid: { x: [-1, 6], y: [-5, 3], unit: 28, numbersOver: true } }
  const wrong = q6.xs.filter((v, i) => q6.r.f(v) !== q6.given[i])
  const books = [[[1, 2], [-1, 1], [-5, 0]], [[1, 3], [-2, 2]], [[1, 2], [4, 1], [-9, 0]], [[1, 3], [3, 2], [-4, 0]], [[1, 2]], [[1, 2], [3, 1], [-4, 0]], [[-1, 2], [-2, 1], [8, 0]], [[2, 3], [3, 2], [1, 1]]]
  const poly = r => [0, 1, 2, 3].map(p => r.terms.filter(([, q]) => q === p).reduce((s, [c]) => s + c, 0))
  const polyOf = terms => [0, 1, 2, 3].map(p => terms.filter(([, q]) => q === p).reduce((s, [c]) => s + c, 0))
  const sheet = [quad, q2.r, q3.r, q4.r, q5.r, q6.r, q7.r]
  const blank = (q, unit = 26) => `${table({ x: q.xs, size: 15 })}<div style="height:10px"></div>${graph({ ...q.grid, unit })}`

  return {
    code: 'GR6.1', topic: 'Quadratic and cubic graphs', strand: 'Graphs', file: 'GR6.1_Quadratic_and_cubic_graphs',

    // Every table value and answer below, worked out again. The kit stops if any is false.
    checks: {
      '(−2)² = 4 and (−2)³ = −8': (-2) ** 2 === 4 && (-2) ** 3 === -8 && -2 * -2 === 4 && -2 * -2 * -2 === -8,
      'y = x² − 3 for x = −2 … 2 gives 1, −2, −3, −2, 1': same(qys, [1, -2, -3, -2, 1]) && (-2) ** 2 - 3 === 1,
      'y = x² − 3 is a U: lowest at (0, −3)': turning(quad, -2, 2) === 0 && quad.f(0) === -3,
      'y = 3 − x² is a ∩: highest at (0, 3)': turning(cap, -3, 3, true) === 0 && cap.f(0) === 3,
      'y = x³ − 3x for x = −2 … 2 gives −2, 2, 0, −2, 2': same(cys, [-2, 2, 0, -2, 2]) && (-2) ** 3 - 3 * -2 === -2,
      'y = x³ − 3x goes up, down and up again: an S': cubic.f(-1) > cubic.f(-2) && cubic.f(1) < cubic.f(-1) && cubic.f(2) > cubic.f(1),
      'the video\'s curves stay inside their grids between the points': fits(plotGrid, quad, xs) && fits(cubeGrid, cubic, xs),
      'Q1: y = x² − 3 table is 1, −2, −3, −2, 1': same(ys(quad, xs), [1, -2, -3, -2, 1]),
      'Q2: y = x² + 2 for x = −2 … 2 gives 6, 3, 2, 3, 6': same(ys(q2.r, q2.xs), q2.expect),
      'Q3: y = x² − 2x − 1 for x = −1 … 3 gives 2, −1, −2, −1, 2': same(ys(q3.r, q3.xs), q3.expect) && fits(q3.grid, q3.r, q3.xs),
      'Q3: (−1)² − 2 × (−1) − 1 = 1 + 2 − 1 = 2': (-1) ** 2 - 2 * -1 - 1 === 2,
      'Q4: y = 3 + 2x − x² for x = −1 … 3 gives 0, 3, 4, 3, 0': same(ys(q4.r, q4.xs), q4.expect) && fits(q4.grid, q4.r, q4.xs),
      'Q4: its highest point is (1, 4)': turning(q4.r, -1, 3, true) === q4.top.x && q4.r.f(q4.top.x) === q4.top.y,
      'Q5: y = x³ − 2x for x = −2 … 2 gives −4, 1, 0, −1, 4': same(ys(q5.r, q5.xs), q5.expect) && fits(q5.grid, q5.r, q5.xs),
      'Q5: (−2)³ − 2 × (−2) = −8 + 4 = −4': (-2) ** 3 - 2 * -2 === -4,
      'Q6: the only wrong y in Sam\'s table is at x = −1, and it should be 4': same(wrong, [-1]) && q6.r.f(-1) === 4 && same(ys(q6.r, q6.xs), q6.expect),
      'Q6: Sam\'s 2 is −1² + 3 (the square of −1 taken as −1)': -(1 ** 2) + 3 === 2,
      'Q6: the right curve is symmetrical: x = −1 and x = 4 give the same y': q6.r.f(-1) === q6.r.f(4),
      'Q6: every point (Sam\'s too) is inside the grid': [...q6.xs.map((v, i) => pt(v, q6.given[i])), ...q6.xs.map(v => pt(v, q6.r.f(v)))].every(p => p.x > q6.grid.x[0] && p.x < q6.grid.x[1] && p.y > q6.grid.y[0] && p.y < q6.grid.y[1]),
      'Q7: y = x² − 4x + 1 is lowest at (2, −3), and the same either side': turning(q7.r, -1, 5) === q7.low.x && q7.r.f(2) === q7.low.y && q7.r.f(1) === q7.r.f(3) && q7.r.f(0) === q7.r.f(4),
      'no rule is one of the book\'s': sheet.concat(cap, cubic).every(r => books.every(b => !same(poly(r), polyOf(b)))),
      'no grid is more than 9 squares across or 10 tall': [shapeGrid, plotGrid, cubeGrid, q3.grid, q4.grid, q5.grid, q6.grid, q7.grid].every(g => across(g) <= 9 && tall(g) <= 10),
    },

    video: {
      slides: [
        { hero: 'Curved graphs', sub: 'Quadratic and cubic graphs', items: [
          [picture(graph({ ...plotGrid, unit: 26, numbers: false, curves: [curveOf(quad, xs)], points: P })), 2.8]] },
        { title: 'A rule with x² is a quadratic', opening: 1.2, items: [
          [line('a rule with $x^2$ is a **quadratic**: its graph is a **curve**'), 3],
          [row(caption(U, 'a **U** shape')), 3, ],
          [row(caption(U, 'a **U** shape'), caption(N, '$x^2$ taken away: an upside-down **U**')), 4, 1]] },
        { stage: 'Step 1 · table', title: 'A table for y = x² − 3', opening: 1.2, items: [
          [under(table({ x: xs, size: 30 }), line('put each $x$ in, **in brackets**')), 3.2],
          ...xs.map((v, i) => [under(table({ x: xs, y: qys.map((w, j) => j <= i ? w : null), lit: i, grey: range(0, i - 1), answer: i === xs.length - 1 ? i : [], size: 30 }), work(quad.sum(v)),
            ...(i === 0 ? [line(`$${ink(`(${X(-2)})^2 = ${X(-2)} \\times ${X(-2)} = 4`)}$: a negative squared is **positive**`)] : [])), i ? 2.6 : 4.4, i]),
          [under(table({ x: xs, y: qys, answer: range(0, xs.length - 1), size: 30 }), line(`the $y$s are $${qys.map(Y).join(', ')}$`)), 3, xs.length],
        ] },
        { stage: 'Step 2 · plot and join', title: 'Across, then up or down', from: 'the table', opening: 1.2, items: [
          ...xs.map((v, i) => [side(picture(graph({ ...plotGrid, points: P.slice(0, i + 1), legs: legsTo(P[i]), marks: marksOf(P[i]) })), table({ x: xs, y: qys, lit: i }), line(words(v))), i ? 2.6 : 3.2, i ? i - 1 : undefined]),
          [side(picture(graph({ ...plotGrid, points: P, curves: [curveOf(quad, xs, GREEN)] })), table({ x: xs, y: qys }), line('join them with one **smooth curve**, freehand, not with a ruler'), answer('a U shape')), 4.2, 4],
        ] },
        { stage: 'Cubics', title: 'A rule with x³ is a cubic', opening: 1.2, items: [
          [side(picture(graph(cubeGrid)), table({ x: xs }), line('$y = x^3 - 3x$ has $x^3$: a **cubic**')), 3],
          [side(picture(graph(cubeGrid)), table({ x: xs }), work(`(${X(-2)})^3 = ${X(-2)} \\times ${X(-2)} \\times ${X(-2)} = -8`, 21), line('a negative cubed stays **negative**')), 4, 0],
          [side(picture(graph({ ...cubeGrid, points: S.slice(0, 1), legs: legsTo(S[0]), marks: marksOf(S[0]) })), table({ x: xs, y: cys.map((w, j) => j ? null : w), lit: 0 }), work(cubic.sum(-2), 21), line(`across to $${X(-2)}$, then down to $${Y(-2)}$`)), 4, 1],
          [side(picture(graph({ ...cubeGrid, points: S })), table({ x: xs, y: cys }), line('the same for every $x$, then plot each column')), 3, 2],
          [side(picture(graph({ ...cubeGrid, points: S, curves: [curveOf(cubic, xs, GREEN)] })), table({ x: xs, y: cys }), line('join them smoothly: up, down and up again'), answer('an S shape')), 4.4, 3]] },
      ],
      recap: ['Brackets round a negative x', 'A negative squared is positive; cubed, negative', 'x² makes a U or ∩, x³ an S', 'Plot every point, join them smoothly'],
    },

    worksheet: {
      title: 'Quadratic and cubic graphs',
      questions: [
        { n: '1', level: 'worked', marks: 3, question: 'Complete the table for $y = x^2 - 3$, then draw its graph on the grid.', figure: `${table({ x: xs, size: 15 })}<div style="height:10px"></div>${graph({ ...plotGrid, unit: 24 })}`, working: [
          { say: 'Put each $x$ into the rule, in brackets. A negative squared is positive' },
          { math: `${quad.sum(-2)}, \\quad ${quad.sum(-1)}` }, { math: `${quad.sum(0)}, \\quad ${quad.sum(1)}, \\quad ${quad.sum(2)}` },
          { picture: table({ x: xs, y: qys, size: 15 }) }, { mark: 'All five $y$ values' },
          { say: 'Plot each column across, then up or down' }, { mark: 'All five points plotted' },
          { say: 'Join them with one smooth curve, freehand, not with a ruler' },
          { picture: graph({ ...plotGrid, unit: 26, points: P, curves: [curveOf(quad, xs, GREEN)] }) },
          { answer: 'A smooth U through all five points' }] },
        { n: '2', level: 'easy', marks: 2, question: 'Complete the table for $y = x^2 + 2$.', figure: table({ x: q2.xs, size: 15 }), working: [
          { say: 'Square $x$, then add $2$. $(-2)^2 = -2 \\times -2 = 4$' },
          { math: `${q2.r.sum(-2)}, \\quad ${q2.r.sum(-1)}` }, { mark: 'Both negative $x$ values right' },
          { picture: table({ x: q2.xs, y: ys(q2.r, q2.xs), size: 15 }) },
          { answer: `$y = ${Y(6)}, ${Y(3)}, ${Y(2)}, ${Y(3)}, ${Y(6)}$` }] },
        { n: '3', level: 'medium', marks: 3, question: 'Complete the table for $y = x^2 - 2x - 1$, then draw its graph on the grid.', figure: blank(q3), working: [
          { say: 'Taking away $2 \\times$ a negative adds' },
          { math: q3.r.sum(-1) }, { math: q3.r.sum(3) },
          { picture: table({ x: q3.xs, y: ys(q3.r, q3.xs), size: 15 }) }, { mark: 'All five $y$ values' },
          { say: 'Plot each column, then join with one smooth curve' }, { mark: 'All five points plotted' },
          { picture: graph({ ...q3.grid, unit: 26, points: pts(q3.r, q3.xs), curves: [curveOf(q3.r, q3.xs, GREEN)] }) },
          { answer: 'A smooth U through all five points' }] },
        { n: '4', level: 'hard', marks: 3, question: ['Complete the table for $y = 3 + 2x - x^2$ and draw its graph on the grid.', 'Write down the coordinates of its highest point.'], figure: blank(q4), working: [
          { say: 'Square first, then take it away. $(-1)^2 = 1$' },
          { math: q4.r.sum(-1) }, { math: q4.r.sum(3) },
          { picture: table({ x: q4.xs, y: ys(q4.r, q4.xs), size: 15 }) }, { mark: 'All five $y$ values' },
          { say: 'The $x^2$ is taken away, so it is an upside-down U: a ∩' },
          { picture: graph({ ...q4.grid, unit: 26, points: pts(q4.r, q4.xs), curves: [curveOf(q4.r, q4.xs, GREEN)], marks: marksOf(q4.top) }) }, { mark: 'A smooth ∩ through all five points' },
          { say: `It turns at the top: $x = ${X(1)}$ down to the axis, $y = ${Y(4)}$ across` },
          { answer: `$(${X(1)}, ${Y(4)})$` }] },
        { n: '5', level: 'hard', marks: 3, question: 'Complete the table for $y = x^3 - 2x$, then draw its graph on the grid.', figure: blank(q5, 22), working: [
          { say: 'A negative cubed stays negative: $(-2)^3 = -2 \\times -2 \\times -2 = -8$' },
          { math: q5.r.sum(-2) }, { math: q5.r.sum(-1) },
          { picture: table({ x: q5.xs, y: ys(q5.r, q5.xs), size: 15 }) }, { mark: 'All five $y$ values' },
          { say: 'Plot each column, then join smoothly. It goes up, down and up again' }, { mark: 'All five points plotted' },
          { picture: graph({ ...q5.grid, unit: 22, points: pts(q5.r, q5.xs), curves: [curveOf(q5.r, q5.xs, GREEN)] }) },
          { answer: 'A smooth S through all five points' }] },
        { n: '6', level: 'very hard', marks: 2, question: ['Sam made this table for $y = x^2 - 3x$ and plotted it.', 'One $y$ value is wrong. Find it, and give the right value.'], figure: `${table({ x: q6.xs, y: q6.given, size: 15 })}<div style="height:10px"></div>${graph({ ...q6.grid, unit: 26, points: q6.xs.map((v, i) => pt(v, q6.given[i], { label: '' })) })}`, working: [
          { say: 'A U is symmetrical, but $x = -1$ and $x = 4$ should match and don\'t. Check the sum at $x = -1$' },
          { math: `${q6.r.sum(-1)}, \\text{ not } ${Y(2)}` }, { mark: '$(-1)^2 = 1$, positive (Sam took it as $-1$)' },
          { picture: graph({ ...q6.grid, unit: 26, points: [...q6.xs.map((v, i) => pt(v, q6.given[i], { label: '' })), pt(-1, 4, { label: '' })], rings: [pt(-1, 2)], curves: [curveOf(q6.r, q6.xs, GREEN)], marks: [x(-1)] }) },
          { answer: `At $x = ${X(-1)}$, $y$ should be $${Y(4)}$, not $${Y(2)}$` }] },
        { n: '7', level: 'very hard', marks: 2, question: ['The graph of $y = x^2 - 4x + 1$ is drawn below.', 'Write down the coordinates of its turning point.'], figure: graph({ ...q7.grid, unit: 26, curves: [{ f: q7.r.f, label: q7.r.text, labelAt: [5.85, -4.5], anchor: 'end', size: 14 }] }), working: [
          { say: 'The turning point is where the U stops going down and turns back up: its lowest point' },
          { say: `Read $x$ down to the $x$ axis, then $y$ across to the $y$ axis` },
          { picture: graph({ ...q7.grid, unit: 26, curves: [{ f: q7.r.f }], rings: [q7.low], points: [{ ...q7.low, label: '' }], legs: [{ from: q7.low, to: pt(2, 0), dashed: true, colour: AMBER }, { from: q7.low, to: pt(0, -3), dashed: true, colour: BIRO }], marks: marksOf(q7.low) }) },
          { mark: `Check: ${q7.r.sum(2).replace(/^/, '$').replace(/$/, '$')}` },
          { answer: `$(${X(2)}, ${Y(-3)})$` }] },
      ],
    },
  }
}

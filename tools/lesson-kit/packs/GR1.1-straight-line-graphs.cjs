// GR1.1 Straight line graphs: the video on lesson 26's gradient worked example (the line through (1, 2) and (3, 8)),
// and its worksheet. From the GR1 pages of Sunny's book scan (p70–71); every number is our own. The worked example and
// its steps are the lesson's own (src/features/straight-line-graphs/tutor/).
module.exports = ({ line, big, result, answer, row, picture }) => {
  const { graph, tex, marksOf, pt, COLOURS: { GREEN } } = require('../lib/graph.cjs')
  const gradientOf = (a, b) => (b.y - a.y) / (b.x - a.x)
  const onLine = (a, b, p) => (b.x - a.x) * (p.y - a.y) === (b.y - a.y) * (p.x - a.x)

  // The video's line: through (1, 2) and (3, 8), gradient 3 (y = 3x − 1).
  const A = pt(1, 2), Bp = pt(3, 8)
  const steep = { x: [-1, 5], y: [-1, 10], unit: 22 }
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
          [side(graph({ ...marked, rings: [A, Bp], marks: marksOf(A, Bp) }), line('choose two points where the line crosses grid corners exactly'), result(`${tex(1, 2)} \\text{ and } ${tex(3, 8)}`)), 3.6, 0]] },
        { stage: 'Step 2 · change in y', title: 'Count up', from: `$${tex(1, 2)}$ and $${tex(3, 8)}$`, items: [
          [side(graph({ ...marked, legs: [upLeg], marks: [{ axis: 'y', value: 2 }, { axis: 'y', value: 8 }] }), line('from $y = 2$ up to $y = 8$'), result('\\text{change in } y = 6')), 3.8]] },
        { stage: 'Step 3 · change in x', title: 'Count across', from: 'change in $y$ = $6$', items: [
          [side(graph({ ...marked, legs: [upLeg, acrossLeg], marks: [{ axis: 'x', value: 1 }, { axis: 'x', value: 3 }] }), line('from $x = 1$ across to $x = 3$'), result('\\text{change in } x = 2')), 3.8]] },
        { stage: 'Step 4 · divide', title: 'Up over across', from: 'up $6$, across $2$', items: [
          [big('\\text{gradient} = \\dfrac{\\text{change in } y}{\\text{change in } x}'), 3.2],
          [answer('gradient $= \\dfrac{6}{2} = 3$'), 3.2],
          [line('for every **1** square across, the line goes up **3**'), 3.4]] },
        { title: 'Only the two points?', from: `$${tex(1, 2)}$ and $${tex(3, 8)}$`, items: [
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
        { n: '1', level: 'worked', marks: 2, question: 'Work out the gradient of the line drawn below.', figure: graph({ ...base, unit: 26 }), working: [
          { say: `Pick two points on grid corners: $${tex(1, 2)}$ and $${tex(3, 8)}$` },
          { picture: graph({ ...marked, unit: 26, legs: [upLeg, acrossLeg], marks: [{ axis: 'y', value: 2 }, { axis: 'y', value: 8 }, { axis: 'x', value: 1 }, { axis: 'x', value: 3 }] }) },
          { say: 'Up $6$, across $2$' }, { mark: 'Change in $y$ and change in $x$' },
          { math: '\\text{gradient} = 6 \\div 2' }, { answer: 'Gradient $= 3$' }] },
        { n: '2', level: 'easy', marks: 1, question: 'Write down the equation of the line drawn below.', figure: graph({ x: [-4, 3], y: [-3, 3], unit: 26, lines: [{ from: pt(-1, 0), to: pt(-1, 1) }] }), working: [
          { say: 'It goes up and down, and every point on it has $x = -1$' }, { answer: '$x = -1$' }] },
        { n: '3', level: 'easy', marks: 2, question: 'Draw the lines $y = 1$ and $x = 4$ on the grid.', figure: graph({ x: [-2, 5], y: [-2, 4], unit: 26 }), working: [
          { picture: graph({ x: [-2, 5], y: [-2, 4], unit: 26, lines: [{ from: pt(0, 1), to: pt(1, 1), colour: GREEN, label: 'y = 1', labelAt: 2 }, { from: pt(4, 0), to: pt(4, 1), colour: GREEN, label: 'x = 4' }], marks: [{ axis: 'y', value: 1 }, { axis: 'x', value: 4 }] }) },
          { mark: '$y = 1$ across, through $(0, 1)$' }, { answer: '$x = 4$ up and down, through $(4, 0)$' }] },
        { n: '4', level: 'medium', marks: 2, question: 'Work out the gradient of the line drawn below.', figure: graph({ x: [-2, 3], y: [-4, 4], unit: 26, lines: [{ from: pt(-1, -3), to: pt(2, 3) }] }), working: [
          { say: 'Two points on grid corners: $(-1, -3)$ and $(2, 3)$' }, { math: '\\text{change in } y = 6, \\quad \\text{change in } x = 3' }, { mark: 'Both changes' },
          { answer: 'Gradient $= 6 \\div 3 = 2$' }] },
        { n: '5', level: 'medium', marks: 2, question: 'Work out the gradient of the line that passes through $(3, 4)$ and $(7, 16)$.', working: [
          { say: 'Subtract in the same order both times' }, { math: '\\text{change in } y = 16 - 4 = 12' }, { math: '\\text{change in } x = 7 - 3 = 4' }, { mark: 'Both changes' },
          { answer: 'Gradient $= 12 \\div 4 = 3$' }] },
        { n: '6', level: 'hard', marks: 2, question: 'Work out the gradient of the line drawn below.', figure: graph({ x: [-3, 5], y: [-1, 4], unit: 26, lines: [{ from: pt(-2, 3), to: pt(4, 0) }] }), working: [
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

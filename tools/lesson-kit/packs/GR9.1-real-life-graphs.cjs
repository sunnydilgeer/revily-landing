// GR9.1 Real-life graphs: the video for graphs lesson 8, and its worksheet. From GR9 in Sunny's book scan (p88–90): a
// conversion graph read up to the line and across (and scaled up for an amount off the graph); the gradient is a rate,
// the amount up for each one across; where a cost line starts is the fixed charge. The video's numbers are the lesson's
// (src/features/real-life-graphs/tutor/realLifeGraphsLesson.ts): £ to € at 1.2, a bath filling at 12 litres a minute, a
// plumber's £40 call-out and £20 an hour. The worksheet's are our own, none of the book's or the lesson's. Drawn like
// the app's (GraphPictures.tsx, rlGrid): each axis named and stepped in its own amounts from 0 where they cross, the
// amount across in amber and the amount up in biro blue; lines only where real amounts are, from the axes to the
// grid's edge. Green is only for the answer.
module.exports = ({ m, t, line, answer, row, picture }) => {
  const { graph, pt, show, COLOURS: { AMBER, BIRO, GREEN, INK } } = require('../lib/graph.cjs')
  const X = v => `\\textcolor{${AMBER}}{${v}}`, Y = v => `\\textcolor{${BIRO}}{${v}}`
  const side = (svg, ...words) => row(picture(svg), `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;max-width:440px;text-align:center">${words.join('')}</div>`)
  const caption = (svg, words) => `<div style="display:flex;flex-direction:column;align-items:center;gap:0">${picture(svg)}${line(words)}</div>`
  const near = (a, b) => Math.abs(a - b) < 1e-9
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

  /* ---------- Lines and their graphs, like the lesson's rlGrid ---------- */

  /** An axis's amounts: `per` of them a square, written with `before` (£) or `after` ( litres), named `name`. */
  const amount = (name, per, { before = '', after = '' } = {}) => ({ name, per, before, after })
  const text = (a, n) => `${a.before}${show(Math.round(n * 1000) / 1000)}${a.after}`
  /** A straight line y = mx + c in the graph's own amounts. */
  const L = (m, c = 0) => ({ m, c })
  const yOf = (l, x) => l.m * x + l.c, xOf = (l, y) => (y - l.c) / l.m
  /** The graph: across from 0 to `xEnd`, up from 0 to `yEnd`, one square of each below and left of where they cross. */
  const rl = (xa, xEnd, ya, yEnd, unit = 30) => ({
    x: [-xa.per, xEnd], y: [-ya.per, yEnd], unit, xa, ya,
    scale: { x: { per: xa.per, start: 0, name: xa.name }, y: { per: ya.per, start: 0, name: ya.name } },
  })
  /** The part of the line on the graph, from the axes to the grid's edge: real amounts aren't below 0. */
  const onGraph = (l, g) => {
    const [xEnd, yEnd] = [g.x[1], g.y[1]]
    const from = l.c >= 0 ? pt(0, l.c) : pt(xOf(l, 0), 0), edge = yOf(l, xEnd)
    return [from, edge > yEnd ? pt(xOf(l, yEnd), yEnd) : edge < 0 ? pt(xOf(l, 0), 0) : pt(xEnd, edge)]
  }
  const segment = (l, g, colour = INK) => { const [from, to] = onGraph(l, g); return { from, to, segment: true, colour } }
  const draw = (g, l, opts = {}, colour) => graph({ ...g, lines: l ? [segment(l, g, colour)] : [], ...opts })
  /** Reading a point: dashed down to the amount across (amber) and across to the amount up (biro blue). */
  const reading = p => [{ from: pt(p.x, 0), to: p, dashed: true, colour: AMBER }, { from: p, to: pt(0, p.y), dashed: true, colour: BIRO }]
  const xs = (...v) => v.map(value => ({ axis: 'x', value })), ys = (...v) => v.map(value => ({ axis: 'y', value }))
  const read = p => ({ legs: reading(p), points: [p], marks: [...xs(p.x), ...ys(p.y)] })
  /** The rate's triangle from a to b on a rising line: across along the bottom (its size below), then up (its size right). */
  const rise = (a, b, g) => { const turn = pt(b.x, a.y); return [{ from: a, to: turn, label: text(g.xa, b.x - a.x), place: 'below' }, { from: turn, to: b, label: text(g.ya, b.y - a.y), place: 'right' }] }
  /** The same on a falling line: across along the top (its size above), then down (its size right). */
  const fall = (a, b, g) => { const turn = pt(b.x, a.y); return [{ from: a, to: turn, label: text(g.xa, b.x - a.x), place: 'above' }, { from: turn, to: b, label: text(g.ya, a.y - b.y), place: 'right' }] }
  const inside = (g, p) => p.x >= 0 && p.x < g.x[1] && p.y >= 0 && p.y < g.y[1]
  const onLines = (g, p) => near(Math.round(p.x / g.xa.per) * g.xa.per, p.x) && near(Math.round(p.y / g.ya.per) * g.ya.per, p.y)
  const corner = (g, l, p) => near(yOf(l, p.x), p.y) && inside(g, p) && onLines(g, p)
  const squares = g => [(g.x[1] - g.x[0]) / g.xa.per, (g.y[1] - g.y[0]) / g.ya.per]

  /** A line of words on a slide, in Poppins: {£50} is an amount across (amber), [€60] an amount up (biro blue). */
  const colour = words => words.split(/(\{[^}]*\}|\[[^\]]*\])/).map(part => /^[{[]/.test(part) ? `<b style="color:${part[0] === '{' ? AMBER : BIRO};white-space:nowrap">${part.slice(1, -1)}</b>` : t(part)).join('')
  const say = words => `<p class="line">${colour(words)}</p>`
  /** A halfway result, in ink in the blue pill (never green). */
  const sum = words => `<div class="result" style="color:${INK};font-weight:600">${colour(words)}</div>`

  /* ---------- The video: the lesson's own numbers ---------- */

  // Pounds to euros: £1 is €1.20, so £50 is €60, and £400 is 10 lots of £40 (€48): €480.
  const euro = L(1.2), eg = rl(amount('£', 10, { before: '£' }), 80, amount('€', 10, { before: '€' }), 100, 30)
  const e50 = pt(50, yOf(euro, 50)), e40 = pt(40, yOf(euro, 40))
  // A bath filling at 12 litres a minute: 120 litres in 10 minutes.
  const bath = L(12), bg = rl(amount('minutes', 2, { after: ' min' }), 16, amount('litres', 20, { after: ' litres' }), 160, 30)
  const b10 = pt(10, yOf(bath, 10))
  // A plumber: £40 to come out (the fixed charge), then £20 an hour; 3 hours is £100.
  const plumber = L(20, 40), pg = rl(amount('hours', 1, { after: ' h' }), 7, amount('£', 20, { before: '£' }), 180, 32)
  const p0 = pt(0, plumber.c), p1 = pt(1, yOf(plumber, 1)), p2 = pt(2, yOf(plumber, 2)), p3 = pt(3, yOf(plumber, 3))
  // Three small graphs, no numbers: euros with pounds, litres with minutes, cost with hours.
  const tiny = (x, y, from, to) => graph({ x: [-1, 5], y: [-1, 5], unit: 28, numbers: false, scale: { x: { per: 1, start: 0, name: x }, y: { per: 1, start: 0, name: y } }, lines: [{ from, to, segment: true, colour: BIRO }] })
  const shapes = [tiny('£', '€', pt(0, 0), pt(3.4, 4)), tiny('minutes', 'litres', pt(0, 0), pt(2.4, 4.4)), tiny('hours', '£', pt(0, 1.2), pt(3.6, 3.8))]

  /* ---------- The worksheet's graphs, our own ---------- */

  // Miles to kilometres: 5 miles is 8 km, so a line through (25, 40); a square is 5 miles across and 8 km up.
  const km = L(1.6), mg = rl(amount('miles', 5, { after: ' miles' }), 50, amount('km', 8, { after: ' km' }), 80, 26)
  const m25 = pt(25, yOf(km, 25)), m48 = pt(xOf(km, 48), 48), m20 = pt(20, yOf(km, 20))
  // A printer: 25 pages a minute.
  const printer = L(25), rg = rl(amount('minutes', 1, { after: ' min' }), 8, amount('pages', 25, { after: ' pages' }), 200, 28)
  const r4 = pt(4, yOf(printer, 4))
  // A phone's battery: 90% at the start, down 15% an hour.
  const battery = L(-15, 90), bat = rl(amount('hours', 1, { after: ' h' }), 7, amount('%', 10, { after: '%' }), 100, 28)
  const bA = pt(2, yOf(battery, 2)), bB = pt(4, yOf(battery, 4))
  // A taxi: £4 when you get in, then £2 a mile.
  const taxi = L(2, 4), tg = rl(amount('miles', 1, { after: ' miles' }), 8, amount('£', 2, { before: '£' }), 20, 24)
  const tA = pt(1, yOf(taxi, 1)), tB = pt(4, yOf(taxi, 4)), t0 = pt(0, taxi.c)
  // A DJ: £50 to set up, then £25 an hour; drawn from the words, then read across from £150.
  const dj = L(25, 50), dg = rl(amount('hours', 1, { after: ' h' }), 7, amount('£', 25, { before: '£' }), 225, 26)
  const d0 = pt(0, dj.c), d1 = pt(1, yOf(dj, 1)), d150 = pt(xOf(dj, 150), 150)
  const sheet = [[km, mg], [printer, rg], [battery, bat], [taxi, tg], [dj, dg]]
  // The lesson's own lines (euros, the bath, the plumber, the download, apples, the tank, bike hire, the electrician,
  // the two gyms): the worksheet uses none of them.
  const lesson = [L(1.2), L(12), L(20, 40), L(15), L(3), L(-10, 80), L(5, 10), L(15, 30), L(10, 20), L(15)]
  // The book's examples (GR9 p88–90), never used: petrol and diesel, bike hire Mon–Thu for 4 bikes, £800 into
  // dollars, water flowing in litres a second, and its cost-a-day questions.
  const banned = /petrol|diesel|bike|dollar|\$\d|litres? (a|per) second|a day|per day/i

  const pic = (g, l, opts, colour) => draw(g, l, opts, colour)

  const worksheet = {
    title: 'Real-life graphs',
    questions: [
      { n: '1', level: 'worked', marks: 2, question: ['The graph changes miles into kilometres.', 'Use it to change 25 miles into kilometres.'], figure: pic(mg, km), working: [
        { say: 'Start at the amount you have: $25$ on the miles axis' },
        { say: `Up from $${X(25)}$ miles to the line, then across to the km axis` }, { mark: 'Up to the line and across' },
        { picture: pic(mg, km, read(m25)) },
        { answer: '40 km' }] },
      { n: '2', level: 'easy', marks: 1, question: 'Use the graph in question 1 to change 48 km into miles.', working: [
        { say: `Start at $${Y(48)}$ on the km axis: across to the line, then down to the miles` },
        { picture: pic({ ...mg, unit: 22 }, km, read(m48)) },
        { answer: '30 miles' }] },
      { n: '3', level: 'medium', marks: 2, question: ['Ravi drives 200 miles. The graph in question 1 only goes to 50 miles.', 'How far does he drive in kilometres?'], working: [
        { say: `$200$ miles is off the graph, but $200$ is $10$ lots of $${X(20)}$` },
        { picture: pic({ ...mg, unit: 22 }, km, read(m20)) },
        { say: `Read $${X(20)}$ miles: up to the line, across: $${Y(32)}$ km` }, { mark: '$20$ miles $= 32$ km' },
        { math: `${Y(32)} \\times 10 = 320` },
        { answer: '320 km' }] },
      { n: '4', level: 'medium', marks: 2, question: ['A printer prints at a steady rate.', 'How many pages a minute does it print?'], figure: pic(rg, printer), working: [
        { say: 'The gradient is the rate: the pages up for each minute across' },
        { say: `Read a point on the line: up from $${X(4)}$ minutes, across to $${Y(100)}$ pages` },
        { picture: pic(rg, printer, read(r4)) }, { mark: '$100$ pages in $4$ minutes' },
        { math: `${Y(100)} \\div ${X(4)} = 25` },
        { answer: '25 pages a minute' }] },
      { n: '5', level: 'hard', marks: 2, question: ['A phone’s battery runs down at a steady rate.', 'By how many % does it go down each hour?'], figure: pic(bat, battery), working: [
        { say: 'Two points on the line: down ÷ across' },
        { picture: pic(bat, battery, { legs: fall(bA, bB, bat), marks: [...xs(2, 4), ...ys(60, 30)] }) },
        { say: `Across: $${X(2)}$ to $${X(4)}$ is $${X(2)}$ hours. Down: $${Y(60)}$ to $${Y(30)}$ is $${Y(30)}\\%$` }, { mark: 'Down $30\\%$ in $2$ hours' },
        { math: `${Y(30)} \\div ${X(2)} = 15` },
        { answer: '15% an hour' }] },
      { n: '6', level: 'hard', marks: 3, question: ['The graph shows the cost of a taxi ride.', 'Write down the fixed charge, and work out the cost of each mile.'], figure: pic(tg, taxi), working: [
        { say: `The fixed charge is where the line starts, at $${X(0)}$ miles` },
        { say: `$${Y('\\text{£}4')}$ before any miles` }, { mark: 'Fixed charge $\\text{£}4$' },
        { say: 'Each mile is the gradient: up ÷ across, between two points on the line' },
        { picture: pic(tg, taxi, { points: [t0], legs: rise(tA, tB, tg), marks: [...xs(1, 4), ...ys(4, 6, 12)] }) },
        { math: `${Y('\\text{£}6')} \\div ${X(3)} = \\text{£}2` }, { mark: 'Up $\\text{£}6$ for $3$ miles' },
        { answer: '£4 fixed charge, £2 a mile' }] },
      { n: '7', level: 'very hard', marks: 4, question: ['A DJ charges £50 to set up, plus £25 an hour.', 'Draw the graph of the cost on the grid.', 'Use it to find how many hours of music you get for £150.'], figure: pic(dg), working: [
        { say: `Before any music it costs $${Y('\\text{£}50')}$: the line starts there, at $${X(0)}$ hours` }, { mark: `Starts at $\\text{£}50$` },
        { math: `\\text{£}50 + ${X(1)} \\times \\text{£}25 = ${Y('\\text{£}75')}\\text{ after }${X(1)}\\text{ hour}` }, { mark: `A second point, $(${X(1)}, ${Y('\\text{£}75')})$` },
        { say: 'Join them with a ruler, to the edge of the grid' }, { mark: 'A straight line' },
        { say: `Across from $${Y('\\text{£}150')}$ to the line, then down to the hours` },
        { picture: pic(dg, dj, { points: [d0, d1, d150], legs: reading(d150), marks: [...xs(1, 4), ...ys(50, 75, 150)] }, GREEN) },
        { answer: '4 hours' }] },
    ],
  }

  return {
    code: 'GR9.1', topic: 'Real-life graphs', strand: 'Graphs', file: 'GR9.1_Real_life_graphs',

    // Every answer below, worked out again from its line. The kit stops if any is false.
    checks: {
      'Euros: £50 is €60, read at a corner of the graph': e50.y === 60 && corner(eg, euro, e50),
      'Euros: £40 is €48, and £400 is 10 × £40, so 10 × €48 = €480': near(e40.y, 48) && 400 / 40 === 10 && near(e40.y * 10, yOf(euro, 400)) && near(yOf(euro, 400), 480),
      '£40 is on the graph but £400 is not': inside(eg, e40) && !inside(eg, pt(400, 480)),
      'Bath: 120 litres in 10 minutes, 120 ÷ 10 = 12 litres a minute, the gradient': b10.y === 120 && 120 / 10 === bath.m && corner(bg, bath, b10),
      'Plumber: the line starts at £40, the fixed charge': yOf(plumber, 0) === 40 && onGraph(plumber, pg)[0].x === 0 && onGraph(plumber, pg)[0].y === 40,
      'Plumber: 1 to 2 hours, £60 to £80: £20 an hour': p1.y === 60 && p2.y === 80 && (p2.y - p1.y) / (p2.x - p1.x) === 20,
      'Plumber: 3 hours is £40 + 3 × £20 = £100': p3.y === 100 && 40 + 3 * 20 === 100 && [p0, p1, p2, p3].every(p => corner(pg, plumber, p)),
      'Q1: 25 miles is 40 km': m25.y === 40 && corner(mg, km, m25),
      'Q2: 48 km is 30 miles': near(m48.x, 30) && corner(mg, km, m48),
      'Q3: 200 miles is 10 × 20 miles, 10 × 32 km = 320 km, and 200 is off the graph': m20.y === 32 && near(yOf(km, 200), 320) && !inside(mg, pt(200, 320)) && corner(mg, km, m20),
      'Q4: 100 pages in 4 minutes, 25 pages a minute': r4.y === 100 && 100 / 4 === printer.m && corner(rg, printer, r4),
      'Q5: 60% at 2 hours, 30% at 4 hours: down 30 in 2 hours, 15% an hour': bA.y === 60 && bB.y === 30 && 30 / 2 === -battery.m && corner(bat, battery, bA) && corner(bat, battery, bB),
      'Q6: the taxi starts at £4; £6 to £12 over 1 to 4 miles: £6 ÷ 3 = £2 a mile': taxi.c === 4 && tA.y === 6 && tB.y === 12 && 6 / 3 === taxi.m && corner(tg, taxi, tA) && corner(tg, taxi, tB),
      'Q7: the DJ starts at £50, £75 after an hour, and £150 is 4 hours': d0.y === 50 && d1.y === 75 && near(d150.x, 4) && 50 + 4 * 25 === 150 && [d0, d1, d150].every(p => corner(dg, dj, p)),
      'every line stays on the positive part of its grid, from an axis to the edge': [[euro, eg], [bath, bg], [plumber, pg], ...sheet].every(([l, g]) => onGraph(l, g).every(p => p.x >= 0 && p.y >= 0 && p.x <= g.x[1] + 1e-9 && p.y <= g.y[1] + 1e-9)),
      'no worksheet line is one of the lesson\'s': sheet.every(([l]) => !lesson.some(o => near(o.m, l.m) && near(o.c, l.c))),
      'no worksheet question uses the book\'s examples': !banned.test(JSON.stringify(worksheet.questions.map(q => q.question))),
      'no grid is more than 11 squares across or tall': [eg, bg, pg, mg, rg, bat, tg, dg].every(g => squares(g).every(n => n <= 11)),
    },

    video: {
      slides: [
        { hero: 'Real-life graphs', sub: 'Convert, read a rate, find a fixed charge', items: [
          [picture(draw({ ...pg, unit: 28 }, plumber)), 2.6]] },
        { title: 'One amount with another', opening: 1.2, items: [
          [row(caption(shapes[0], '**euros** with **pounds**')), 2.6],
          [row(caption(shapes[0], '**euros** with **pounds**'), caption(shapes[1], '**litres** with **minutes**')), 2.6, 0],
          [row(caption(shapes[0], '**euros** with **pounds**'), caption(shapes[1], '**litres** with **minutes**'), caption(shapes[2], '**cost** with **hours**')), 3.4, 1]] },
        { stage: 'Conversion graphs', title: '£50 into euros', opening: 1.2, items: [
          [side(draw(eg, euro, { marks: xs(10) }), say('pounds go across: a square is {£10}')), 3.4],
          [side(draw(eg, euro, { marks: [...xs(10), ...ys(10)] }), say('pounds go across: a square is {£10}'), say('euros go up: a square is [€10]')), 3.4, 0],
          [side(draw(eg, euro, read(e50)), say('pounds go across: a square is {£10}'), say('euros go up: a square is [€10]'), say('up from {£50} to the line, then across to the euros'), answer('€60')), 4.6, 1]] },
        { stage: 'Off the graph', title: '£400 into euros', opening: 1.2, items: [
          [side(draw(eg, euro, { marks: xs(80) }), say('the graph only goes to {£80}'), say('{£400} is 10 lots of {£40}')), 4],
          [side(draw(eg, euro, read(e40)), say('the graph only goes to {£80}'), say('{£400} is 10 lots of {£40}'), say('read {£40}: up to the line, across: [€48]')), 4.2, 0],
          [side(draw(eg, euro, read(e40)), say('{£400} is 10 lots of {£40}'), say('read {£40}: up to the line, across: [€48]'), sum('10 × [€48] = €480'), answer('€480')), 4.6, 1]] },
        { stage: 'The gradient is a rate', title: 'Filling a bath', opening: 1.2, items: [
          [side(draw(bg, bath), say('the bath fills at a **steady rate**: a straight line')), 3.2],
          [side(draw(bg, bath, read(b10)), say('the bath fills at a **steady rate**: a straight line'), say('up from {10 minutes} to the line, across: [120 litres]')), 4.2, 0],
          [side(draw(bg, bath, read(b10)), say('up from {10 minutes} to the line, across: [120 litres]'), sum('[120] ÷ {10} = 12'), answer('12 litres a minute')), 4.4, 1],
          [side(draw(bg, bath, read(b10)), answer('12 litres a minute'), say('the **gradient** is a **rate**: the litres up for each minute across')), 4.4, 2]] },
        { stage: 'A fixed charge', title: 'The plumber', opening: 1.2, items: [
          [side(draw(pg, plumber), say('[£40] to come out, then [£20] an hour')), 3.4],
          [side(draw(pg, plumber, { points: [p0], marks: ys(40) }), say('[£40] to come out, then [£20] an hour'), say('the line starts at [£40], at {0 hours}: the **fixed charge**')), 4.4, 0],
          [side(draw(pg, plumber, { points: [p0], legs: rise(p1, p2, pg), marks: [...xs(1, 2), ...ys(60, 80)] }), say('the line starts at [£40], at {0 hours}: the **fixed charge**'), say('each hour adds [£20]: the **gradient**')), 4.4, 1],
          [side(draw(pg, plumber, { points: [p0, p3], legs: reading(p3), marks: [...xs(3), ...ys(100)] }), say('the line starts at [£40]: the **fixed charge**'), say('each hour adds [£20]: the **gradient**'), say('{3 hours}: up to the line, across'), sum('[£40] + {3} × [£20] = £100'), answer('£100')), 5, 2]] },
      ],
      recap: ['Read up to the line, then across', 'The gradient is the rate: up for each one across', 'Where the line starts is the fixed charge'],
    },

    worksheet,
  }
}

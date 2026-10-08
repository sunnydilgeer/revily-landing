// GR8.1 Distance–time graphs: the video for graphs lesson 7, and its worksheet. From GR8 in Sunny's book scan
// (p86–88): time goes across and distance from home up; up is moving away, flat is stopped, down is coming back; the
// speed of a part is its gradient, distance ÷ time with the time in hours; and a journey drawn from its story. The
// video's journey is the lesson's, Maya's bike ride (src/features/distance-time/tutor/distanceTimeLesson.ts); the
// worksheet's journeys are our own, none of the book's. Drawn like the app's (GraphPictures.tsx): time across as clock
// times, a square for half an hour and a number each hour (amber); distance up in km (biro blue); the axes cross at
// the start time and 0 km. A part's speed is a triangle: the time across it in amber, the distance up or down in
// biro blue. Green is only for the answer.
module.exports = ({ m, t, line, answer, row, picture }) => {
  const { graph, clock, pt, show, COLOURS: { AMBER, BIRO, GREEN, INK } } = require('../lib/graph.cjs')
  const X = v => `\\textcolor{${AMBER}}{${v}}`, Y = v => `\\textcolor{${BIRO}}{${v}}`
  /** A time in amber and a distance in biro blue, for a line of words: $T(10.5)$ is 10:30, $K(15)$ is 15 km. */
  const T = h => X(clock(h).replace(':', '{:}')), K = km => Y(`${show(km)}\\text{ km}`)
  const side = (svg, ...words) => row(picture(svg), `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;max-width:440px;text-align:center">${words.join('')}</div>`)
  const caption = (svg, words) => `<div style="display:flex;flex-direction:column;align-items:center;gap:0">${picture(svg)}${line(words)}</div>`
  const near = (a, b) => Math.abs(a - b) < 1e-9
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

  /* ---------- Journeys, worked out from their corners ---------- */

  /** A journey: home at a time, then its corners in time order (hours, km from home). */
  const journey = (name, start, ...corners) => ({ name, start, corners })
  const parts = j => j.corners.map((p, i) => [i ? j.corners[i - 1] : j.start, p])
  const hours = ([a, b]) => b.x - a.x, km = ([a, b]) => Math.abs(b.y - a.y)
  const speed = part => km(part) / hours(part)
  const moving = j => parts(j).filter(part => km(part) > 0)
  const total = j => moving(j).reduce((s, part) => s + km(part), 0)
  const stopMinutes = j => parts(j).filter(part => !km(part)).map(part => Math.round(hours(part) * 60))
  /** How far from home at a time: along the part it falls in. */
  const at = (j, h) => { const [a, b] = parts(j).find(([a, b]) => h >= a.x && h <= b.x); return a.y + (b.y - a.y) * (h - a.x) / (b.x - a.x) }
  const fastest = j => moving(j).reduce((best, part) => speed(part) > speed(best) ? part : best)
  const end = j => j.corners[j.corners.length - 1]
  /** "½ hour", "1 hour", "1½ hours"; "½ h" on the graph. */
  const hoursText = h => { const whole = Math.floor(h), half = near(h - whole, 0.5); return half ? (whole ? `${whole}½ hours` : '½ hour') : `${whole} hour${whole === 1 ? '' : 's'}` }
  const short = h => hoursText(h).replace(/ hours?$/, ' h')

  /** The graph: time across from `from` (a square is `perX` hours, a number each hour), distance up (a square is `perY` km). */
  const grid = (from, to, perX, top, perY, unit = 30) => ({
    x: [from - perX, to], y: [-2 * perY, top], unit,
    scale: { x: { per: perX, start: from, every: Math.max(2, Math.round(1 / perX)), clock: true, name: 'time' }, y: { per: perY, start: 0, name: 'km' } },
  })
  const segment = ([a, b], colour = INK) => ({ from: a, to: b, segment: true, colour })
  const lines = (j, colour) => parts(j).map(part => segment(part, colour))
  /** A journey with some parts lit in biro blue (by number, from 0). */
  const lit = (j, ...which) => parts(j).map((part, i) => segment(part, which.includes(i) ? BIRO : INK))
  /**
   * The speed triangle: the time across the part (amber) and the distance up or down it (biro blue), with the step
   * across always along the top so each size sits outside the triangle, clear of the journey: going up, up from its
   * start then across to its end (the size to the left, the time above); going down, across then down to its end
   * (the time above, the size to the right).
   */
  const triangle = ([a, b]) => {
    const size = `${show(km([a, b]))} km`, time = short(b.x - a.x)
    if (b.y > a.y) { const turn = pt(a.x, b.y); return [{ from: a, to: turn, label: size, place: 'left' }, { from: turn, to: b, label: time, place: 'above' }] }
    const turn = pt(b.x, a.y)
    return [{ from: a, to: turn, label: time, place: 'above' }, { from: turn, to: b, label: size, place: 'right' }]
  }
  const across = part => triangle(part).filter(leg => leg.from.y === leg.to.y)
  /** A line of words on a slide, in Poppins: {10:30} is a time (amber), [15 km] a distance (biro blue). */
  const colour = words => words.split(/(\{[^}]*\}|\[[^\]]*\])/).map(part => /^[{[]/.test(part) ? `<b style="color:${part[0] === '{' ? AMBER : BIRO};white-space:nowrap">${part.slice(1, -1)}</b>` : t(part)).join('')
  const say = words => `<p class="line">${colour(words)}</p>`
  /** A halfway result, in ink in the blue pill (never green). */
  const sum = words => `<div class="result" style="color:${INK};font-weight:600">${colour(words)}</div>`
  const xs = (...v) => v.map(value => ({ axis: 'x', value })), ys = (...v) => v.map(value => ({ axis: 'y', value }))
  const readLegs = (p, from) => [{ from: pt(p.x, 0), to: p, dashed: true, colour: AMBER }, { from: p, to: pt(from, p.y), dashed: true, colour: BIRO }]
  const inside = (g, p) => p.x >= g.scale.x.start && p.x < g.x[1] && p.y >= 0 && p.y < g.y[1]
  const onLines = (g, p) => near(Math.round(p.x / g.scale.x.per) * g.scale.x.per, p.x) && near(Math.round(p.y / g.scale.y.per) * g.scale.y.per, p.y)

  /* ---------- The video: Maya's bike ride, the lesson's own ---------- */

  const maya = journey('Maya', pt(9, 0), pt(10, 15), pt(10.5, 15), pt(11, 30), pt(12.5, 0))
  const mg = grid(9, 13.5, 0.5, 40, 5, 34)
  const [m1, m2, m3, m4] = parts(maya)
  // Up, flat, down: three small graphs with no numbers.
  const tiny = { ...grid(0, 3, 0.5, 20, 5, 30), numbers: false }
  const shapes = [[pt(0.5, 5), pt(2, 15)], [pt(0.5, 10), pt(2, 10)], [pt(0.5, 15), pt(2, 5)]].map(part => graph({ ...tiny, lines: [segment(part, BIRO)] }))

  /* ---------- The worksheet's journeys, our own ---------- */

  // Priya's bike ride: 15 km in an hour, a 30-minute stop, 5 km more in half an hour, then home in an hour.
  const priya = journey('Priya', pt(13, 0), pt(14, 15), pt(14.5, 15), pt(15, 20), pt(16, 0))
  const pg = grid(13, 17.5, 0.5, 30, 5, 28)
  const [p1, p2, p3, p4] = parts(priya)
  // Leo's walk: 6 km in 1½ hours, a 30-minute stop, then home in 1½ hours.
  const leo = journey('Leo', pt(10, 0), pt(11.5, 6), pt(12, 6), pt(13.5, 0))
  const lg = grid(10, 14.5, 0.5, 8, 1, 28)
  const l3 = parts(leo)[2]
  // Nadia's story, drawn part by part: speed × time gives each distance, distance ÷ speed the time home.
  const story = { start: 8, legs: [{ speed: 15, for: 1 }, { speed: 10, for: 0.5 }, { stop: 1 }, { home: 20 }] }
  const told = (() => {
    let p = pt(story.start, 0)
    const corners = story.legs.map(leg => (p = leg.stop ? pt(p.x + leg.stop, p.y) : leg.home ? pt(p.x + p.y / leg.home, 0) : pt(p.x + leg.for, p.y + leg.speed * leg.for)))
    return journey('Nadia', pt(story.start, 0), ...corners)
  })()
  const nadia = journey('Nadia', pt(8, 0), pt(9, 15), pt(9.5, 20), pt(10.5, 20), pt(11.5, 0))
  const ng = grid(8, 12.5, 0.5, 25, 5, 28)
  const sheet = [priya, leo, nadia]
  const durations = j => end(j).x - j.start.x
  // The book's journeys (GR8 p86–88), never used: parts A to D (30 km by 11:00, 60 km, 09:00–14:00), Valentina
  // (17:00–18:15, 25 km), Neil (44 miles, 12:00, 3 hours), Chris (1500 m), a cyclist over 150 minutes, a car 09:00–14:00.
  const book = j => (j.corners.some(p => p.x === 11 && p.y === 30)) || total(j) === 60 || (j.start.x === 9 && end(j).x === 14)
    || (j.start.x === 17 && end(j).x === 18.25) || j.corners.some(p => p.y === 25) || j.corners.some(p => p.y === 44 || p.y === 1500)
    || (j.start.x === 12 && durations(j) === 3) || durations(j) === 2.5
  const sheetGrids = [[priya, pg], [leo, lg], [nadia, ng]]

  /** Worksheet pictures: the journey with one part lit, its triangle, the axis numbers it reads. */
  const pic = (g, opts, unit = 28) => graph({ ...g, unit, ...opts })

  return {
    code: 'GR8.1', topic: 'Distance–time graphs', strand: 'Graphs', file: 'GR8.1_Distance_time_graphs',

    // Every answer below, worked out again from the journeys' corners. The kit stops if any is false.
    checks: {
      'Maya: 15 km by 10:00, stopped until 10:30, 30 km by 11:00, home by 12:30': at(maya, 10) === 15 && at(maya, 10.5) === 15 && at(maya, 11) === 30 && at(maya, 12.5) === 0,
      'Maya: up, flat, up, down: away, stopped, away, back': same(parts(maya).map(([a, b]) => Math.sign(b.y - a.y)), [1, 0, 1, -1]),
      'Maya stops for 30 minutes': same(stopMinutes(maya), [30]),
      'Maya, 10:30 to 11:00: 15 km in ½ hour, 15 ÷ 0.5 = 30 km/h': hours(m3) === 0.5 && km(m3) === 15 && speed(m3) === 30 && 15 / 0.5 === 30,
      'Maya, 09:00 to 10:00: 15 ÷ 1 = 15 km/h, less steep and slower': speed(m1) === 15 && speed(m1) < speed(m3) && (m1[1].y - m1[0].y) / (m1[1].x - m1[0].x) < (m3[1].y - m3[0].y) / (m3[1].x - m3[0].x),
      'Maya rides home 30 km in 1½ hours, 20 km/h': km(m4) === 30 && hours(m4) === 1.5 && speed(m4) === 20 && km(m2) === 0,
      'Q1: Priya, 14:30 to 15:00: ½ hour, 5 km, 5 ÷ 0.5 = 10 km/h': hours(p3) === 0.5 && km(p3) === 5 && speed(p3) === 10,
      'Q2: Priya is 20 km from home at 15:00': at(priya, 15) === 20,
      'Q3: Priya stops once, for 30 minutes, from 14:00 to 14:30': same(stopMinutes(priya), [30]) && p2[0].x === 14 && p2[1].x === 14.5,
      'Q4: Priya rides 15 + 5 = 20 km out and 20 km back: 40 km': total(priya) === 40 && km(p1) + km(p3) === 20 && km(p4) === 20,
      'Q5: Leo walks home 6 km in 1½ hours, 12:00 to 13:30: 4 km/h': l3[0].x === 12 && l3[1].x === 13.5 && l3[1].y === 0 && km(l3) === 6 && speed(l3) === 4,
      'Q6: Priya\'s speeds are 15, 10 and 20 km/h; the fastest, coming home, is the only 20': same(moving(priya).map(speed), [15, 10, 20]) && same(fastest(priya), p4) && moving(priya).filter(part => speed(part) === 20).length === 1,
      'Q6: the fastest part is the steepest on the graph': moving(priya).every(part => same(part, p4) || km(part) / hours(part) < km(p4) / hours(p4)),
      'Q7: Nadia\'s story, worked out (15 × 1 = 15, 10 × ½ = 5, a 1-hour stop, 20 ÷ 20 = 1 hour home), gives her corners': same(told, nadia),
      'every journey ends at home, its times in order': [maya, ...sheet].every(j => end(j).y === 0 && parts(j).every(([a, b]) => b.x > a.x)),
      'every corner is on the grid\'s lines and inside it': [[maya, mg], ...sheetGrids].every(([j, g]) => [j.start, ...j.corners].every(p => inside(g, p) && onLines(g, p))),
      'no worksheet journey is one of the book\'s': sheet.every(j => !book(j)),
      'no worksheet journey uses the video\'s numbers': sheet.every(j => !same(j.corners.map(p => p.y), maya.corners.map(p => p.y))),
      'no grid is more than 11 squares across or tall': [mg, pg, lg, ng].every(g => (g.x[1] - g.x[0]) / g.scale.x.per <= 11 && (g.y[1] - g.y[0]) / g.scale.y.per <= 12),
    },

    video: {
      slides: [
        { hero: 'Distance–time graphs', sub: 'Reading a journey, and its speed', items: [
          [picture(graph({ ...mg, unit: 30, lines: lines(maya) })), 2.6]] },
        { title: 'Time across, distance up', opening: 1.2, items: [
          [side(graph(mg), say('a distance–time graph shows a **journey**')), 2.6],
          [side(graph({ ...mg, marks: xs(9, 9.5) }), say('a distance–time graph shows a **journey**'), say('**time** goes across, as clock times: a square is half an hour, {09:00} to {09:30}')), 4.4, 0],
          [side(graph({ ...mg, marks: [...xs(9, 9.5), ...ys(5)] }), say('a distance–time graph shows a **journey**'), say('**time** goes across, as clock times: a square is half an hour, {09:00} to {09:30}'), say('**distance from home** goes up: a square is [5 km]')), 4, 1]] },
        { title: 'Up, flat, down', opening: 1.2, items: [
          [row(caption(shapes[0], 'going **up**: moving away from home')), 3],
          [row(caption(shapes[0], 'going **up**: moving away'), caption(shapes[1], '**flat**: stopped')), 3, 0],
          [row(caption(shapes[0], 'going **up**: moving away'), caption(shapes[1], '**flat**: stopped'), caption(shapes[2], 'going **down**: coming back')), 3.6, 1]] },
        { stage: 'Reading a journey', title: 'Maya’s bike ride', opening: 1.2, items: [
          [side(graph({ ...mg, lines: lit(maya, 0).slice(0, 1), marks: [...xs(9, 10), ...ys(15)] }), say('{09:00} to {10:00}: up to [15 km]')), 3.4],
          [side(graph({ ...mg, lines: lit(maya, 1).slice(0, 2), marks: xs(10, 10.5) }), say('{09:00} to {10:00}: up to [15 km]'), say('{10:00} to {10:30}: flat, **stopped**')), 3.4, 0],
          [side(graph({ ...mg, lines: lit(maya, 2).slice(0, 3), marks: [...xs(10.5, 11), ...ys(30)] }), say('{09:00} to {10:00}: up to [15 km]'), say('{10:00} to {10:30}: flat, **stopped**'), say('{10:30} to {11:00}: up to [30 km]')), 3.4, 1],
          [side(graph({ ...mg, lines: lit(maya, 3), marks: xs(11, 12.5) }), say('{09:00} to {10:00}: up to [15 km]'), say('{10:00} to {10:30}: flat, **stopped**'), say('{10:30} to {11:00}: up to [30 km]'), say('{11:00} to {12:30}: down to [0 km], **home**')), 4.4, 2]] },
        { stage: 'Speed is the gradient', title: 'Maya’s speed, 10:30 to 11:00', opening: 1.2, items: [
          [side(graph({ ...mg, lines: lit(maya, 2) }), say('**speed** = distance ÷ time')), 2.8],
          [side(graph({ ...mg, lines: lit(maya, 2), legs: across(m3), marks: xs(10.5, 11) }), say('**speed** = distance ÷ time'), say('time: {10:30} to {11:00} is half an hour, {0.5 h}')), 3.8, 0],
          [side(graph({ ...mg, lines: lit(maya, 2), legs: triangle(m3), marks: ys(15, 30) }), say('**speed** = distance ÷ time'), say('time: {10:30} to {11:00} is half an hour, {0.5 h}'), say('distance: [15 km] to [30 km] is [15 km]')), 3.8, 1],
          [side(graph({ ...mg, lines: lit(maya, 2), legs: triangle(m3) }), sum('[15] ÷ {0.5} = 30'), answer('30 km/h'), say('15 km in half an hour is 30 km in a whole hour')), 4.6, 2],
          [side(graph({ ...mg, lines: lit(maya, 0, 2), legs: triangle(m3) }), answer('30 km/h'), say('{09:00} to {10:00}: [15] ÷ {1} = 15 km/h'), say('**steeper** means **faster**')), 4.6, 3]] },
      ],
      recap: ['Up is away, flat is stopped, down is coming back', 'Speed = distance ÷ time', 'The time in hours: half an hour is 0.5'],
    },

    worksheet: {
      title: 'Distance–time graphs',
      questions: [
        { n: '1', level: 'worked', marks: 3, question: ['The graph shows Priya’s bike ride.', 'Work out her speed from 14:30 to 15:00, in km/h.'], figure: pic(pg, { lines: lines(priya) }), working: [
          { say: 'Speed is the gradient of the part: distance ÷ time, with the time in hours' },
          { say: `Across the part: $${T(14.5)}$ to $${T(15)}$ is half an hour, $${X('0.5')}$ h` }, { mark: 'Time $= \\tfrac{1}{2}$ hour' },
          { say: `Up the part: $${K(15)}$ to $${K(20)}$ is $${K(5)}$` }, { mark: 'Distance $= 5$ km' },
          { picture: pic(pg, { lines: lit(priya, 2), legs: triangle(p3), marks: [...xs(14.5, 15), ...ys(15, 20)] }) },
          { math: `${Y(5)} \\div ${X('0.5')} = 10` },
          { answer: '10 km/h' }] },
        { n: '2', level: 'easy', marks: 1, question: 'Use Priya’s graph in question 1. How far from home was she at 15:00?', working: [
          { say: `Up from $${T(15)}$ to the line, then across to the km axis` },
          { picture: pic(pg, { lines: lines(priya), legs: readLegs(pt(15, 20), 13), points: [pt(15, 20)], marks: [...xs(15), ...ys(20)] }, 24) },
          { answer: '20 km' }] },
        { n: '3', level: 'easy', marks: 1, question: 'Use Priya’s graph in question 1. For how many minutes did she stop?', working: [
          { say: 'Stopped is the flat part: the distance from home doesn’t change' },
          { picture: pic(pg, { lines: lit(priya, 1), marks: xs(14, 14.5) }, 24) },
          { say: `From $${T(14)}$ to $${T(14.5)}$` },
          { answer: '30 minutes' }] },
        { n: '4', level: 'medium', marks: 2, question: 'Use Priya’s graph in question 1. How far did she ride altogether?', working: [
          { say: 'Add every part, going out and coming back. The flat part adds nothing' },
          { math: `\\text{out: } ${Y(15)} + ${Y(5)} = 20 \\text{ km}` }, { mark: 'Out: $20$ km' },
          { math: `\\text{back: } ${Y(20)} \\text{ km}` },
          { answer: '20 + 20 = 40 km' }] },
        { n: '5', level: 'medium', marks: 2, question: ['The graph shows Leo’s walk.', 'Work out his speed walking home, in km/h.'], figure: pic(lg, { lines: lines(leo) }, 26), working: [
          { say: `Coming home is the part going down: $${T(12)}$ to $${T(13.5)}$, from $${K(6)}$ to $${K(0)}$` },
          { picture: pic(lg, { lines: lit(leo, 2), legs: triangle(l3), marks: [...xs(12, 13.5), ...ys(6)] }, 26) },
          { say: 'The time in hours: $1\\tfrac{1}{2}$ hours is $1.5$' }, { mark: `Time $= ${X('1.5')}$ hours` },
          { math: `${Y(6)} \\div ${X('1.5')} = 4` },
          { answer: '4 km/h' }] },
        { n: '6', level: 'hard', marks: 3, question: 'Use Priya’s graph in question 1. Which part of her ride was fastest? Give its speed.', working: [
          { say: 'Steeper means faster. Work out the speed of each part she moves' },
          { math: `${T(13)}\\text{ to }${T(14)}\\text{: } ${Y(15)} \\div ${X(1)} = 15 \\text{ km/h}` },
          { math: `${T(14.5)}\\text{ to }${T(15)}\\text{: } ${Y(5)} \\div ${X('0.5')} = 10 \\text{ km/h}` },
          { math: `${T(15)}\\text{ to }${T(16)}\\text{: } ${Y(20)} \\div ${X(1)} = 20 \\text{ km/h}` }, { mark: 'The speed of each moving part' },
          { picture: pic(pg, { lines: lit(priya, 3), legs: triangle(p4), marks: [...xs(15, 16), ...ys(20)] }) },
          { say: 'The ride home is steepest' }, { mark: 'Picks the ride home, 15:00 to 16:00' },
          { answer: '15:00 to 16:00, coming home: 20 km/h' }] },
        { n: '7', level: 'very hard', marks: 4, question: ['Nadia leaves home at 08:00. She cycles at 15 km/h for 1 hour, then at 10 km/h for 30 minutes.', 'She stops for 1 hour, then cycles home at 20 km/h.', 'Draw her journey on the grid.'], figure: pic(ng, {}, 26), working: [
          { say: 'Draw one part at a time, from where the last one ended. Speed × time is the distance' },
          { math: `15 \\times ${X(1)} = ${Y(15)}\\text{ km by }${T(9)}` }, { mark: `Up to $${K(15)}$ at $${T(9)}$` },
          { math: `10 \\times ${X('0.5')} = ${Y(5)}\\text{ km more: }${K(20)}\\text{ by }${T(9.5)}` }, { mark: `Up to $${K(20)}$ at $${T(9.5)}$` },
          { say: `Stopped for 1 hour: flat at $${K(20)}$ until $${T(10.5)}$` }, { mark: 'Flat for 1 hour' },
          { say: 'Home: distance ÷ speed is the time' },
          { math: `${Y(20)} \\div 20 = ${X(1)}\\text{ hour: home at }${T(11.5)}` },
          { picture: pic(ng, { lines: lines(nadia, GREEN), points: nadia.corners.map(p => pt(p.x, p.y)), marks: [...xs(9, 9.5, 10.5, 11.5), ...ys(15, 20)] }, 26) },
          { answer: 'Home at 11:30: the whole journey drawn' }] },
      ],
    },
  }
}

// G1.1 Angle facts: the first Geometry lesson (lesson 26), written by Claude with our own numbers (no source pack).
// The video is the lesson's worked example: two roads cross, one angle is 70°, find the other three. It uses all three
// facts: angles on a straight line add to 180°, vertically opposite angles are equal, angles around a point add to 360°.
module.exports = ({ m, line, result, answer, board, row, picture, tick }) => {
  /*
   * An angle diagram. `rays` are directions in degrees (0 = right, turning anticlockwise) from one point, so a straight
   * line is two rays 180° apart. `arcs` mark an angle from one direction to the next: its label, and its colour (ink for
   * a given angle, blue for a letter, purple for the angle a step works on, green for the answer). A 90° arc is drawn as
   * the right-angle square. `straight` draws the base line through the point, for angles on a straight line.
   */
  const COLOUR = { ink: '#17213a', blue: '#3f51b5', purple: '#7c3aed', green: '#0d7446', grey: '#9aa6bd' }
  function angles({ rays, arcs, width = 320, height = 210, cx = 160, cy, length = 128, scale = 1 }) {
    cy = cy ?? height / 2
    const at = (deg, r) => [cx + r * Math.cos(deg * Math.PI / 180), cy - r * Math.sin(deg * Math.PI / 180)]
    const fix = n => n.toFixed(1)
    const lines = rays.map(deg => { const [x, y] = at(deg, length); return `<line x1="${cx}" y1="${cy}" x2="${fix(x)}" y2="${fix(y)}" stroke="#17213a" stroke-width="3" stroke-linecap="round"/>` })
    // Arcs next to each other alternate between two sizes, so four angles at a crossing read as four arcs, not a circle.
    const marks = arcs.map(({ from, to, label, colour = 'ink' }, i) => {
      if (label === '') return ''
      const sweep = ((to - from) % 360 + 360) % 360, c = COLOUR[colour]
      const mid = from + sweep / 2
      const r = (sweep < 50 ? 40 : 26) + (i % 2) * 10
      let shape
      if (sweep === 90) {
        const s = 20, [ax, ay] = at(from, s), [bx, by] = at(to, s)
        shape = `<path d="M${fix(ax)} ${fix(ay)} L${fix(ax + bx - cx)} ${fix(ay + by - cy)} L${fix(bx)} ${fix(by)}" fill="none" stroke="${c}" stroke-width="2.5"/>`
      } else {
        const [ax, ay] = at(from, r), [bx, by] = at(to, r)
        shape = `<path d="M${fix(ax)} ${fix(ay)} A${r} ${r} 0 ${sweep > 180 ? 1 : 0} 0 ${fix(bx)} ${fix(by)}" fill="none" stroke="${c}" stroke-width="2.5"/>`
      }
      const [lx, ly] = at(mid, sweep === 90 ? 46 : r + (sweep < 50 ? 30 : 26))
      const italic = /^[a-z]$/.test(label) ? ' font-style="italic"' : ''
      return `${shape}<text x="${fix(lx)}" y="${fix(ly + 8)}" text-anchor="middle" font-size="22" font-weight="700" fill="${c}"${italic}>${label}</text>`
    })
    return `<svg width="${width * scale}" height="${height * scale}" viewBox="0 0 ${width} ${height}">${lines.join('')}${marks.join('')}<circle cx="${cx}" cy="${cy}" r="4" fill="#17213a"/></svg>`
  }
  // Two roads crossing: 70° given, a next to it, b opposite it, c opposite a.
  const roads = (a = { label: 'a', colour: 'blue' }, b = { label: 'b', colour: 'blue' }, c = { label: 'c', colour: 'blue' }, given = 'ink', scale = 1) => picture(angles({
    rays: [25, 95, 205, 275], height: 220, scale,
    arcs: [{ from: 25, to: 95, label: '70°', colour: given }, { from: 95, to: 205, ...a }, { from: 205, to: 275, ...b }, { from: 275, to: 385, ...c }],
  }))
  // A straight line: the two rays at 0° and 180°, with the point low down so the angles sit above it.
  const straight = (rays, arcs) => angles({ rays: [0, 180, ...rays], arcs, height: 150, cy: 128, scale: 0.8 })
  const point = (rays, arcs) => angles({ rays, arcs, height: 240, length: 104, scale: 0.75 })

  // Brute force: the whole number of degrees that makes it work.
  const solve = test => { const found = []; for (let x = 0; x <= 360; x++) if (test(x)) found.push(x); return found.join() }

  return {
    code: 'G1.1', topic: 'Angle facts', strand: 'Geometry', file: 'G1.1_Angle_Facts',

    // Every answer below, worked out again. The kit stops if any is false.
    checks: {
      'the four angles where the roads cross are 70°, 110°, 70°, 110°': 95 - 25 === 70 && 205 - 95 === 110 && 275 - 205 === 70 && 385 - 275 === 110,
      'a: 70 + a = 180 gives 110': solve(a => 70 + a === 180) === '110',
      'the four road angles make 360°': 70 + 110 + 70 + 110 === 360,
      'Q2 135 + x = 180 gives 45': solve(x => 135 + x === 180) === '45',
      'Q3 is drawn 58° and 58°': 88 - 30 === 58 && 268 - 210 === 58,
      'Q4 48 + x + 67 = 180 gives 65': solve(x => 48 + x + 67 === 180) === '65' && 132 - 67 === 65,
      'Q5 90 + 140 + 75 + z = 360 gives 55': solve(z => 90 + 140 + 75 + z === 360) === '55' && 370 - 315 === 55,
      'Q6 2x + 3x = 180 gives 36, drawn as 72° and 108°': solve(x => 2 * x + 3 * x === 180) === '36' && 2 * 36 === 72 && 3 * 36 === 108,
      'Q7a 2x + 3x + 130 = 360 gives 46, drawn as 92° and 138°': solve(x => 2 * x + 3 * x + 130 === 360) === '46' && 122 - 30 === 92 && 260 - 122 === 138,
      'Q7b opposite 125° is 125°, and 55° is the angle next to it': 145 - 20 === 125 && 200 - 145 === 55 && 125 + 55 === 180,
    },

    video: {
      slides: [
        { hero: 'Two roads cross', sub: 'One angle is 70°. Find the other three.', items: [
          [roads(), 3.2], [line('three facts find every angle where lines meet'), 3]] },
        { stage: 'Fact 1 · straight line', title: 'Angles on a straight line add to 180°', items: [
          [line('a half turn is **180°**: a and 70° sit together on one straight road'), 3.4],
          [roads({ label: 'a', colour: 'purple' }, { label: 'b', colour: 'grey' }, { label: 'c', colour: 'grey' }, 'purple', 0.72), 3],
          [board('70 + a', '=', '180', '-\\,70', '-\\,70'), 3.2],
          [result('a = 110^{\\circ}'), 3, 0]] },
        { stage: 'Fact 2 · vertically opposite', title: 'Opposite angles are equal', items: [
          [line('where two lines cross, the angles **opposite** each other are the same size'), 3.4],
          [roads({ label: '110°', colour: 'ink' }, { label: 'b', colour: 'purple' }, { label: 'c', colour: 'blue' }, 'purple', 0.8), 3],
          [row(m('b = 70^{\\circ}'), m('c = 110^{\\circ}')), 3.2],
          [line('c is opposite a, so it is 110° too', 'grey'), 3]] },
        { stage: 'Fact 3 · around a point', title: 'Angles around a point add to 360°', items: [
          [line('a full turn is **360°**: all four angles meet at one point'), 3.2],
          [roads({ label: '110°', colour: 'ink' }, { label: '70°', colour: 'ink' }, { label: '110°', colour: 'ink' }, 'ink', 0.8), 3],
          [row(`<span>${m('70 + 110 + 70 + 110 = 360')} ${tick}</span>`), 3.4]] },
        { title: 'Give a reason', items: [
          [line('in an exam, say **which fact** you used, not just the number'), 3.2],
          [line('$a = 110°$: angles on a straight line add up to $180°$'), 3.2],
          [line('$b = 70°$: vertically opposite angles are equal'), 3.2],
          [answer('$a = 110°$, $b = 70°$, $c = 110°$'), 3.4]] },
      ],
      recap: ['Straight line: 180°', 'Around a point: 360°', 'Vertically opposite: equal'],
    },

    worksheet: {
      title: 'Angle Facts: Lines and Points',
      questions: [
        { n: '1', level: 'worked', marks: 2, figure: roads(undefined, { label: '', colour: 'ink' }, { label: '', colour: 'ink' }), question: 'Two straight lines cross. Work out the size of angle $a$. Give a reason.', working: [
          { say: '$a$ and $70°$ are on a straight line, so they add to $180°$' }, { math: '70 + a = 180' }, { mark: 'Using $180°$' },
          { say: 'Take $70$ from both sides' }, { answer: '$a = 110°$ (angles on a straight line add up to $180°$)' }] },
        { n: '2', level: 'easy', marks: 1, figure: straight([45], [{ from: 0, to: 45, label: 'x', colour: 'blue' }, { from: 45, to: 180, label: '135°' }]), question: 'Work out the size of angle $x$.', working: [
          { say: 'Angles on a straight line add to $180°$' }, { math: '180 - 135 = 45' }, { answer: '$x = 45°$' }] },
        { n: '3', level: 'easy', marks: 1, figure: point([30, 88, 210, 268], [{ from: 30, to: 88, label: '58°' }, { from: 210, to: 268, label: 'y', colour: 'blue' }]), question: 'Two straight lines cross. Write down the size of angle $y$. Give a reason.', working: [
          { say: '$y$ is opposite the $58°$ angle' }, { answer: '$y = 58°$ (vertically opposite angles are equal)' }] },
        { n: '4', level: 'medium', marks: 2, figure: straight([67, 132], [{ from: 0, to: 67, label: '67°' }, { from: 67, to: 132, label: 'x', colour: 'blue' }, { from: 132, to: 180, label: '48°' }]), question: 'Three angles sit on a straight line. Work out the size of angle $x$.', working: [
          { say: 'Add the angles you know' }, { math: '48 + 67 = 115' }, { mark: '$115$' },
          { say: 'They all add to $180°$' }, { math: '180 - 115 = 65' }, { answer: '$x = 65°$' }] },
        { n: '5', level: 'medium', marks: 2, figure: point([10, 100, 240, 315], [{ from: 10, to: 100, label: '90°' }, { from: 100, to: 240, label: '140°' }, { from: 240, to: 315, label: '75°' }, { from: 315, to: 370, label: 'z', colour: 'blue' }]), question: 'Four angles meet at a point. Work out the size of angle $z$.', working: [
          { say: 'Add the angles you know' }, { math: '90 + 140 + 75 = 305' }, { mark: '$305$' },
          { say: 'Angles around a point add to $360°$' }, { math: '360 - 305 = 55' }, { answer: '$z = 55°$' }] },
        { n: '6', level: 'hard', marks: 2, figure: straight([108], [{ from: 0, to: 108, label: '3x' }, { from: 108, to: 180, label: '2x' }]), question: 'Two angles on a straight line are $2x$ and $3x$. Work out the value of $x$.', working: [
          { say: 'They add to $180°$' }, { math: '2x + 3x = 180' }, { math: '5x = 180' }, { mark: '$5x = 180$' },
          { say: 'Divide both sides by $5$' }, { answer: '$x = 36$' }] },
        { n: '7a', level: 'very hard', marks: 2, figure: point([30, 122, 260], [{ from: 30, to: 122, label: '2x' }, { from: 122, to: 260, label: '3x' }, { from: 260, to: 390, label: '130°' }]), question: 'Three angles meet at a point: $2x$, $3x$ and $130°$. Work out the value of $x$.', working: [
          { say: 'Angles around a point add to $360°$' }, { math: '2x + 3x + 130 = 360' }, { math: '5x = 230' }, { mark: '$5x = 230$' },
          { say: 'Divide both sides by $5$' }, { answer: '$x = 46$' }] },
        { n: '7b', level: 'very hard', marks: 2, question: ['Two straight lines cross. One of the angles is $125°$.', 'Mia says, “The angle opposite it is $55°$, because they add up to $180°$.” Is Mia correct? Explain why.'], working: [
          { say: 'Opposite angles are equal; the angles that add to $180°$ are next to each other, on a straight line' }, { mark: 'Vertically opposite angles are equal' },
          { answer: 'No: the opposite angle is $125°$. $55°$ is the angle next to it.' }] },
      ],
    },
  }
}

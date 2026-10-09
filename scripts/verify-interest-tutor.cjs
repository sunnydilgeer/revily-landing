// Checks Lesson 34 (Ratio R5, Interest, growth and decay): source coverage, every board row balancing (powers worked
// out, rounded rows to their last digit), every bar picture's values and labels, one size through a working, nothing
// off the edge, the answers, choices, wrong-answer messages, one move a step, the videos and the route.
const { assert, boardOf, evaluate, checkStructure, checkInteractions, checkWorkings, checkVideos, checkCourse } = require('./board-lesson-checks.cjs')
const { tutorInterestLesson: lesson } = require('../src/features/ratio/tutor/interestLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { GrowthVisual, GROWTH_WIDTH, GROWTH_HEIGHT, growthSlot, growthPillWidth } = require('../src/features/written-methods/tutor/GrowthPictures.tsx')

const states = lesson.states
const parts = ['Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']
const pdfs = ['R5.1', 'R5.2', 'R5.3', 'R5.4']
const at = checkStructure(lesson, { id: 'L034', number: 34, code: 'R5', rungs: ['simple-interest', 'compound-growth', 'compound-decay', 'compound-periods'], parts })
const refs = pdfs.flatMap(pdf => [`${pdf} video + Q1`, ...parts.map(part => `${pdf} ${part}`)])

// ---------- Every board row balances ----------
// Money and percentage signs, thousands commas and words ("each", "total") are read past; a power like 1.05⁴ is
// worked out. A right side ending "…" is cut short, and one with 2 decimal places is to the nearest penny, so each
// must agree to its last digit; every other row balances exactly.
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const powers = side => side.replace(/([\d.]+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, base, power) => Array(Number([...power].map(c => SUP.indexOf(c)).join(''))).fill(base).join(' × '))
const plain = side => powers(side.replace(/[£%,]/g, '').replace(/ [a-z]+\b/gi, ''))
let rows = 0, roundedRows = 0
for (const ref of refs) {
  const board = boardOf(at(ref))
  assert.ok(board.length, `${ref} has a board`)
  for (const row of board) {
    if ('answer' in row) assert.ok(row.answer.length <= 18, `${ref}: the answer ${row.answer} fits on a phone`)
    if ('note' in row) assert.ok(row.note.length <= 30, `${ref}: the note ${row.note} fits on a phone`)
    if (!('left' in row)) continue
    assert.ok(row.left, `${ref}: every row has its own left side`)
    const cut = row.right.endsWith('…'), right = plain(row.right.replace('…', '')), places = (right.split('.')[1] ?? '').length
    const l = evaluate(plain(row.left), {}), r = evaluate(right, {})
    assert.ok(Number.isFinite(l) && Number.isFinite(r), `${ref}: ${row.left} = ${row.right} works out`)
    const off = Math.abs(l - r)
    if (cut) assert.ok(off < 10 ** -places && l >= r, `${ref}: ${row.left} = ${row.right} (${l})`)
    else if (places === 2 && /[×÷]/.test(row.left) && off > 1e-9) { assert.ok(off <= 0.005 + 1e-9, `${ref}: ${row.left} = ${row.right} to the nearest penny (${l})`); roundedRows++ }
    else assert.ok(off < 1e-9 * Math.max(1, Math.abs(l)), `${ref}: ${row.left} = ${row.right} should balance (${l})`)
    rows++
  }
}

// ---------- Every bar picture ----------
let pictures = 0, labels = 0
const shownValue = text => Number(text.replace(/[£,]/g, ''))
function checkBars(label, frame) {
  assert.ok(frame.bars.length >= 2 && frame.bars.length <= 6, `${label}: 2 to 6 bars`)
  assert.equal(frame.top, Math.max(...frame.bars.map(bar => bar.value)), `${label}: heights are against the biggest value`)
  assert.ok(frame.bars[0].reached && frame.bars[0].shown, `${label}: the start is always there`)
  const slot = growthSlot(frame)
  frame.bars.forEach((bar, i) => {
    if (!bar.reached) { assert.ok(!bar.shown, `${label}: a year not worked out yet shows no value`); return }
    assert.ok(i === 0 || frame.bars[i - 1].reached, `${label}: the years are worked out in order`)
    if (bar.shown) {
      assert.ok(growthPillWidth(bar.shown) <= slot - 4, `${label}: the pill ${bar.shown} fits over its bar`)
      // A pill is the bar's value, to the penny or cut to whole pounds (the R5.4 video's labels).
      assert.ok(Math.abs(shownValue(bar.shown) - bar.value) < 1e-9 || shownValue(bar.shown) === Math.floor(bar.value) || Math.abs(shownValue(bar.shown) - bar.value) <= 0.005, `${label}: ${bar.shown} is ${bar.value}`)
      labels++
    }
  })
  const svg = renderToStaticMarkup(React.createElement(GrowthVisual, { frame }))
  for (const [, x, y, w, h] of svg.matchAll(/<rect [^>]*?x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)) {
    assert.ok(+x >= 0 && +x + +w <= GROWTH_WIDTH && +y >= 0 && +y + +h <= GROWTH_HEIGHT, `${label}: a shape at ${x}, ${y} sits inside the picture`)
  }
  pictures++
}
for (const state of states) {
  const steps = (state.working ?? state.visual)?.examples?.[0]?.steps ?? []
  const frames = steps.map(step => step.frame.growth).filter(Boolean)
  if (state.visual.kind === 'growth') checkBars(`${state.sourceRef} (question)`, state.visual.growth)
  if (!frames.length) continue
  assert.equal(frames.length, steps.length, `${state.sourceRef}: the bars stay through the working`)
  frames.forEach((frame, i) => {
    checkBars(`${state.sourceRef} step ${i + 1}`, frame)
    if (frame.before) checkBars(`${state.sourceRef} opening`, frame.before)
  })
  // Sunny: a picture keeps its size, so every step has the same bars against the same top.
  assert.equal(new Set(frames.map(frame => `${frame.bars.length} ${frame.top}`)).size, 1, `${state.sourceRef}: one size through the working`)
  // Each year's value is the year before times the same multiplier, or matches its own row on the board.
  const values = frames[0].bars.map(bar => bar.value)
  const board = boardOf(state).filter(row => 'left' in row).map(row => evaluate(plain(row.right.replace('…', '')), {}))
  values.slice(1).forEach((value, i) => assert.ok(board.some(r => Math.abs(r - value) <= 0.005) || /R5\.4 video/.test(state.sourceRef) || /simple|R5\.1/.test(state.sourceRef), `${state.sourceRef}: bar ${i + 1} (${value}) is on the board`))
  // The answer's bar only fills in on the last step.
  assert.ok(frames.slice(0, -1).every(frame => !frame.bars.at(-1).reached), `${state.sourceRef}: the last bar waits for the last step`)
  assert.ok(frames.at(-1).bars.every(bar => bar.reached), `${state.sourceRef}: every bar is worked out by the end`)
}
// Simple interest steps up by the same amount every year; R5.4's rent is × 1.05 every year.
for (const ref of ['R5.1 video + Q1', 'R5.1 Q3', 'R5.1 Q4a']) {
  const values = (at(ref).working ?? at(ref).visual).examples[0].steps[0].frame.growth.bars.map(bar => bar.value)
  const steps = values.slice(1).map((value, i) => value - values[i])
  assert.ok(steps.every(step => Math.abs(step - steps[0]) < 1e-9), `${ref}: the same step up every year`)
}
const rentBars = at('R5.4 video + Q1').visual.examples[0].steps[0].frame.growth.bars.map(bar => bar.value)
rentBars.slice(1).forEach((value, i) => assert.ok(Math.abs(value - rentBars[i] * 1.05) < 1e-9, `R5.4: year ${i + 1} is × 1.05`))

// ---------- The answers, from the worksheets' own numbers ----------
const penny = n => Math.round(n * 100) / 100
const numberAnswers = {
  'R5.1 Q2': 500 * 0.04, 'R5.1 Q3': 1200 + 2 * 1200 * 0.06, 'R5.1 Q4a': 2500 + 4 * 2500 * 0.03, 'R5.1 Q4b': 450 / 75, 'R5.1 Q5a': (1680 - 1500) / 3 / 1500 * 100, 'R5.1 Q5b': 1500 + 10 * 60,
  'R5.2 Q2': 400 * 1.1 ** 2, 'R5.2 Q3': Math.round(15000 * 1.02 ** 3), 'R5.2 Q4a': penny(3500 * 1.04 ** 5), 'R5.2 Q4b': penny(penny(3500 * 1.04 ** 5) - 3500), 'R5.2 Q5a': penny(6 * 1.05 ** 3), 'R5.2 Q5c': 1000 * 1.03 ** 2,
  'R5.3 Q2': 500 * 0.9 ** 2, 'R5.3 Q3': Math.round(8000 * 0.85 ** 3), 'R5.3 Q4a': 24000 * 0.75 * 0.88, 'R5.3 Q4b': 100 - 15840 / 24000 * 100, 'R5.3 Q5a': Math.round(200 * 0.7 ** 4 * 10) / 10,
  'R5.4 Q5c': penny(100 * 1.05 ** 20),
}
const near = (a, b) => Math.abs(a - b) < 1e-6
for (const [ref, value] of Object.entries(numberAnswers)) {
  const { interaction } = at(ref)
  assert.ok(near(Number(interaction.correctAnswer), value), `${ref}: should be ${value}, is ${interaction.correctAnswer}`)
  assert.ok(checkAnswer(interaction, String(Math.round(value * 100) / 100)), `${ref} accepts ${value}`)
}
// Aniksha's R5.2 Q4 says £4258.27 and £758.27; 3500 × 1.04⁵ = 4258.285…, so the app says £4258.29 and £758.29.
assert.ok(near(penny(3500 * 1.04 ** 5), 4258.29), 'R5.2 Q4a: £4258.29 to the nearest penny')
// The first whole number of years past each target.
const firstYear = (start, multiplier, over) => { let n = 1; while (!over(start * multiplier ** n)) n++; return n }
const years = {
  'R5.3 Q5b': firstYear(200, 0.7, v => v < 50), 'R5.4 Q2': firstYear(100, 1.1, v => v > 120), 'R5.4 Q3': firstYear(20000, 1.04, v => v > 23000),
  'R5.4 Q4a': firstYear(15000, 0.82, v => v < 8000), 'R5.4 Q5a': firstYear(1500, 1.06, v => v >= 2000),
}
for (const [ref, n] of Object.entries(years)) assert.equal(Number(at(ref).interaction.correctAnswer), n, `${ref}: ${n} years`)
// The claims: Ben (simple interest is the same every year), 6 × 1.15 is less than 6 × 1.05³, Nia's car is still worth
// £3932.16, 3 years is not enough for the car, 7% still takes 5 years, and £100 more than doubles in 20 years.
assert.ok(near(800 * 0.05, 40), 'R5.1 Q5c: £40 every year')
assert.ok(6 * 1.15 < 6 * 1.05 ** 3, 'R5.2 Q5b: compound is more')
assert.ok(near(12000 * 0.8 ** 5, 3932.16), 'R5.3 Q5c: £3932.16 after 5 years')
assert.ok(15000 * 0.82 ** 3 > 8000, 'R5.4 Q4b: 3 years is not enough')
assert.equal(firstYear(1500, 1.07, v => v >= 2000), 5, 'R5.4 Q5b: still 5 years at 7%')
// The worked examples agree with the videos.
assert.ok(near(800 + 3 * 40, 920), 'R5.1 Q1: £920')
assert.ok(near(2000 * 1.03 ** 2, 2121.8), 'R5.2 Q1: £2121.80')
assert.ok(near(12000 * 0.8 ** 2, 7680), 'R5.3 Q1: £7680')
assert.equal(firstYear(800, 1.05, v => v > 1000), 5, 'R5.4 Q1: 5 years')
assert.equal(Number(at('R5.4 video + Q1').visual.examples[0].steps.at(-1).frame.equation.rows.at(-1).answer.split(' ')[0]), 5, 'R5.4 Q1: the answer is 5 years')
const choices = checkInteractions(states, checkAnswer)

// ---------- Wrong-answer messages ----------
const cases = [['R5.1 Q2', '520', 'interest'], ['R5.1 Q3', '144', '£1200'], ['R5.1 Q3', '1272', '2 years'], ['R5.1 Q4a', '2813.77', 'original'], ['R5.1 Q4b', '5', '75'],
  ['R5.1 Q5a', '12', 'divide by 3'], ['R5.1 Q5a', '3.57', '£1500'], ['R5.1 Q5b', '600', '£1500'],
  ['R5.2 Q2', '480', '£440'], ['R5.2 Q3', '15900', 'simple'], ['R5.2 Q4a', '4258.27', '4258.285'], ['R5.2 Q4a', '4200', 'simple'], ['R5.2 Q4b', '4258.29', '£3500'], ['R5.2 Q5a', '6.9', 'three times'], ['R5.2 Q5c', '1060', '£1030'],
  ['R5.3 Q2', '400', '£450'], ['R5.3 Q3', '12167', '0.85'], ['R5.3 Q4a', '15120', '£18,000'], ['R5.3 Q4b', '37', '£18,000'], ['R5.3 Q5a', '48.02', 'decimal place'], ['R5.3 Q5b', '3', '68.6'],
  ['R5.4 Q2', '3', '£121'], ['R5.4 Q3', '3', '22,497'], ['R5.4 Q4a', '3', '£8270.52'], ['R5.4 Q5a', '4', '£1893.72'], ['R5.4 Q5a', '5.56', 'simple'], ['R5.4 Q5c', '200', 'simple']]
for (const [ref, response, expected] of cases) {
  const state = at(ref)
  assert.ok(!checkAnswer(state.interaction, response), `${ref}: ${response} is marked wrong`)
  const message = state.diagnose?.(response)
  assert.ok(message && message.toLowerCase().includes(expected.toLowerCase()), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}

// ---------- The workings ----------
const { steps } = checkWorkings(states)
// Sunny: each method's aim is said up front, in one short line, where students first meet it.
for (const ref of pdfs.map(pdf => `${pdf} video + Q1`)) assert.match(at(ref).content.body, /^Our aim: /, `${ref} states its aim first`)

// ---------- Videos, the course ----------
checkVideos(states, 'lesson-34', {
  // Aniksha's R5_v1 files, unchanged (sha256 checked against her zip on 9 Oct).
  'simple.mp4': '2c44cc1d6cd3349ffe5c8b0866a41b7606db53278964835e02105199a984aa95',
  'growth.mp4': '477ad57ef9e1fe23cd30f42bcd822c9bc65bca60f9d7da937e34d3ededab1086',
  'decay.mp4': 'e9f12276d7543352d871cb7593da5f3dcca2e1eae6564d746ee1e0e35344b3d3',
  'periods.mp4': '8dd814030c329b0ca53b4e67999683300b2d6a42e8178062bfdb4ddc9a4d2112',
})
checkCourse(34, 'R5', 'TutorInterestLesson', 'ratio')

console.log(`Lesson 34 (R5) verified: ${states.length} screens, all 32 source questions, ${rows} board rows balanced (${roundedRows} to the nearest penny), ${pictures} bar pictures with ${labels} values checked, one size each and nothing off the edge, ${choices} choices, ${cases.length} wrong-answer messages, ${steps} steps, 4 videos and the route.`)

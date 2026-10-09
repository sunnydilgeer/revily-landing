// Checks Lesson 32 (Ratio R3, Percentages): source coverage, every board row balancing, every hundred square's pieces
// being the right share of the whole and fitting the picture, the square keeping one size through a working, the
// answers, choices, wrong-answer messages, one move a step, the videos and the route.
const { assert, boardOf, checkRows, checkStructure, checkInteractions, checkWorkings, checkVideos, checkCourse } = require('./board-lesson-checks.cjs')
const { tutorPercentLesson: lesson } = require('../src/features/ratio/tutor/percentLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { PercentVisual, PERCENT_WIDTH, PERCENT_HEIGHT, NOTE_SIZE, MAX_PILLS, PILL_ROOM, percentPillWidth, textWidth, squareOwners } = require('../src/features/written-methods/tutor/PercentPictures.tsx')

const states = lesson.states
const parts = ['Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']
const pdfs = ['R3.1', 'R3.2', 'R3.3', 'R3.4']
const at = checkStructure(lesson, { id: 'L032', number: 32, code: 'R3', rungs: ['percentage-of-amount', 'percentage-increase', 'percentage-decrease', 'percentage-change'], parts })
const refs = pdfs.flatMap(pdf => [`${pdf} video + Q1`, ...parts.map(part => `${pdf} ${part}`)])

// ---------- Every board row balances ----------
// Money and percentage signs, thousands commas and unit words are read past here.
const plain = side => side.replace(/[£%,]/g, '').replace(/ [a-z]+\b/gi, '')
let rows = 0
for (const ref of refs) {
  const board = boardOf(at(ref))
  assert.ok(board.length, `${ref} has a board`)
  rows += checkRows(ref, board.map(row => 'left' in row ? { ...row, left: plain(row.left), right: plain(row.right) } : row), () => [{}])
}

// On a phone the green answer and the purple notes stay on one line (about 18 and 30 characters at 320 px).
for (const ref of refs) for (const row of boardOf(at(ref))) {
  if ('answer' in row) assert.ok(row.answer.length <= 18, `${ref}: the answer ${row.answer} fits on a phone`)
  if ('note' in row) assert.ok(row.note.length <= 30, `${ref}: the note ${row.note} fits on a phone`)
}

// ---------- Every hundred square ----------
// A pill reads "23% = £18.40" or "3 × 1% = £2.40": its value must be that share of the whole.
const money = text => Number(text.replace(/[£,]/g, '').split(' ')[0])
let pictures = 0, values = 0
function checkSquare(label, frame) {
  const whole = money(frame.whole)
  assert.ok(Number.isFinite(whole) && whole > 0, `${label}: the whole ${frame.whole} is a number`)
  assert.ok(frame.pieces.length <= MAX_PILLS, `${label}: at most ${MAX_PILLS} pills`)
  assert.ok(frame.pieces.reduce((sum, piece) => sum + piece.size, 0) <= 100, `${label}: the pieces fit in 100 squares`)
  for (const piece of frame.pieces) {
    assert.ok(percentPillWidth(piece.label) <= PILL_ROOM, `${label}: the pill ${piece.label} fits beside the square`)
    const [share, value] = piece.label.split(' = ')
    const percent = share.includes('×') ? Number(share.split(' × ')[0]) * Number(share.split(' × ')[1].replace('%', '')) : Number(share.replace('%', ''))
    assert.equal(percent, piece.size, `${label}: ${piece.label} fills ${piece.size} squares`)
    assert.ok(Math.abs(money(value) - whole * piece.size / 100) < 1e-9, `${label}: ${piece.label} is ${piece.size}% of ${frame.whole}`)
    values++
  }
  const note = frame.note ?? `100 squares = ${frame.whole}`
  assert.ok(textWidth(note, NOTE_SIZE) <= PERCENT_WIDTH - 8, `${label}: the note ${note} fits across the picture`)
  assert.equal(squareOwners(frame).filter(owner => owner !== undefined).length, frame.pieces.reduce((sum, piece) => sum + piece.size, 0))
  const svg = renderToStaticMarkup(React.createElement(PercentVisual, { frame }))
  for (const [, x, y, w, h] of svg.matchAll(/<rect [^>]*?x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)) {
    assert.ok(+x >= 0 && +x + +w <= PERCENT_WIDTH && +y >= 0 && +y + +h <= PERCENT_HEIGHT, `${label}: a shape at ${x}, ${y} sits inside the picture`)
  }
  pictures++
}
for (const state of states) {
  if (state.visual.kind === 'percent') checkSquare(`${state.sourceRef} (question)`, state.visual.percent)
  const steps = (state.working ?? state.visual)?.examples?.[0]?.steps ?? []
  const wholes = new Set()
  steps.forEach((step, i) => {
    const frame = step.frame.percent
    if (!frame) return
    checkSquare(`${state.sourceRef} step ${i + 1}`, frame)
    if (frame.before) checkSquare(`${state.sourceRef} opening`, frame.before)
    wholes.add(frame.whole)
  })
  // Sunny: a picture keeps its size; the square is a fixed size, so it only has to stay the same whole.
  assert.ok(wholes.size <= 1, `${state.sourceRef}: one hundred square through the working`)
}

// ---------- The answers, from the worksheets' own numbers ----------
const numberAnswers = {
  'R3.1 Q2': 300 * 0.4, 'R3.1 Q3': 64 * 0.35, 'R3.1 Q4a': 850 * 0.18, 'R3.1 Q4b': 18 / 100, 'R3.1 Q5a': 120 * 0.65,
  'R3.2 Q2': 2 * 1.1, 'R3.2 Q3': 28000 * 1.04, 'R3.2 Q5a': 2000 * 1.03, 'R3.2 Q5b': 2000 * 1.03 * 1.03, 'R3.2 Q5c': 100 * 1.2 * 1.2,
  'R3.3 Q2': 50 * 0.8, 'R3.3 Q3': 9000 * 0.85, 'R3.3 Q5a': 720 * 0.75 * 0.9, 'R3.3 Q5b': (720 - 486) / 720 * 100,
  'R3.4 Q2': 5 / 20 * 100, 'R3.4 Q3': 480 / 3200 * 100, 'R3.4 Q4a': 3600 / 24000 * 100, 'R3.4 Q5a': 27000 / 180000 * 100, 'R3.4 Q5b': 20000 / 250000 * 100,
}
const near = (a, b) => Math.abs(a - b) < 1e-9
for (const [ref, value] of Object.entries(numberAnswers)) {
  const { interaction } = at(ref)
  assert.ok(near(Number(interaction.correctAnswer), value), `${ref}: should be ${value}, is ${interaction.correctAnswer}`)
  assert.ok(checkAnswer(interaction, String(Math.round(value * 100) / 100)), `${ref} accepts ${value}`)
}
// Multipliers: 1 + 12% and 1 − 35%, then the new price.
assert.ok(checkAnswer(at('R3.2 Q4a').interaction, '1.12, 39.2') && !checkAnswer(at('R3.2 Q4a').interaction, '0.12, 39.2'), 'R3.2 Q4a: × 1.12 = £39.20')
assert.ok(near(35 * 1.12, 39.2), 'R3.2 Q4a: 35 × 1.12')
assert.ok(checkAnswer(at('R3.3 Q4a').interaction, '0.65, 312') && !checkAnswer(at('R3.3 Q4a').interaction, '0.35, 312'), 'R3.3 Q4a: × 0.65 = £312')
assert.ok(near(480 * 0.65, 312), 'R3.3 Q4a: 480 × 0.65')
// The claims: 1/3 off £120 is £80, more than the first shop's £78; Ella halves and doubles correctly; Sam's 35% off
// would be £468, not £486; Jack divided by the new value; Mia compares pounds, not percentages.
assert.ok(120 - 120 / 3 > 78, 'R3.1 Q5b: the first shop is cheaper')
assert.ok(near(80 * 0.23 / 2, 9.2) && near(80 * 0.46, 36.8), 'R3.1 Q5c: Ella is right')
assert.ok(near(720 * 0.65, 468) && 468 !== 486, 'R3.3 Q5c: 35% off would be £468')
assert.ok(Math.abs(3600 / 20400 * 100 - 17.6) < 0.05, 'R3.4 Q4b: Jack divided by 20,400')
// The worked examples agree with the videos.
assert.ok(near(80 * 0.23, 18.4), 'R3.1 Q1: £18.40')
assert.ok(near(600 * 1.15, 690), 'R3.2 Q1: £690')
assert.ok(near(45 * 0.7, 31.5), 'R3.3 Q1: £31.50')
assert.ok(near(150 / 400 * 100, 37.5), 'R3.4 Q1: 37.5% decrease')
const choices = checkInteractions(states, checkAnswer)

// ---------- Wrong-answer messages ----------
const cases = [['R3.1 Q2', '30', '10%'], ['R3.1 Q3', '19.2', '5%'], ['R3.1 Q4a', '127.5', '1%'], ['R3.1 Q4b', '1.8', 'two places'], ['R3.1 Q5a', '42', 'left'],
  ['R3.2 Q2', '0.2', 'add it on'], ['R3.2 Q3', '1120', 'add it on'], ['R3.2 Q5a', '60', 'add it on'], ['R3.2 Q5b', '2120', '2,060'], ['R3.2 Q5c', '140', '£120'],
  ['R3.3 Q2', '10', 'left'], ['R3.3 Q3', '8100', '85%'], ['R3.3 Q5a', '468', '£540'], ['R3.3 Q5b', '35', '£540'],
  ['R3.4 Q2', '20', 'original'], ['R3.4 Q3', '480', 'change'], ['R3.4 Q4a', '3600', 'change'], ['R3.4 Q5a', '27000', 'profit'], ['R3.4 Q5b', '20000', 'loss']]
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
checkVideos(states, 'lesson-32', {
  // Aniksha's R3_v1 files, unchanged (sha256 checked against her zip on 8 Oct).
  'of-amount.mp4': 'd3413989f8a3eb571ab951d2f3f7c49cba538f92077e8632dfdb48111dd7d9b5',
  'increase.mp4': 'cb8d6f5841e10ba8bd6745eb6c8ba11d86bcf634e7ed8118b6866af0b0ed9302',
  'decrease.mp4': 'd5f13bb57a95b2900926eb64e87e233512ad73f17b0a7e8a42ee34c0220d313b',
  'change.mp4': 'da4329a60543cd19a6a9a7fe05c23465d5b4956ea2acc717dc1dcbfa8f27fe2f',
})
checkCourse(32, 'R3', 'TutorPercentLesson', 'ratio')

console.log(`Lesson 32 (R3) verified: ${states.length} screens, all 32 source questions, ${rows} board rows balanced, ${pictures} hundred squares with ${values} pieces checked, nothing off the edge, ${choices} choices, ${cases.length} wrong-answer messages, ${steps} steps, 4 videos and the route.`)

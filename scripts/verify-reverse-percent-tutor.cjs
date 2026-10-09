// Checks Lesson 33 (Ratio R4, Reverse percentages): source coverage, every board row balancing, every hundred square's
// pieces being the right share of the original and fitting the picture, the square keeping one whole through a
// working, the answers, choices, wrong-answer messages, one move a step, the videos and the route.
const { assert, boardOf, checkRows, checkStructure, checkInteractions, checkWorkings, checkVideos, checkCourse } = require('./board-lesson-checks.cjs')
const { tutorReversePercentLesson: lesson } = require('../src/features/ratio/tutor/reversePercentLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { PercentVisual, PERCENT_WIDTH, PERCENT_HEIGHT, NOTE_SIZE, MAX_PILLS, PILL_ROOM, percentPillWidth, textWidth } = require('../src/features/written-methods/tutor/PercentPictures.tsx')

const states = lesson.states
const parts = ['Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']
const pdfs = ['R4.1', 'R4.2']
const at = checkStructure(lesson, { id: 'L033', number: 33, code: 'R4', rungs: ['reverse-percentage', 'reverse-percentage-multiplier'], parts })
const refs = pdfs.flatMap(pdf => [`${pdf} video + Q1`, ...parts.map(part => `${pdf} ${part}`)])

// ---------- Every board row balances ----------
// Money and percentage signs, thousands commas and unit words are read past here.
const plain = side => side.replace(/[£%,]/g, '').replace(/ [a-z]+\b/gi, '')
let rows = 0
for (const ref of refs) {
  const board = boardOf(at(ref))
  assert.ok(board.length, `${ref} has a board`)
  rows += checkRows(ref, board.map(row => 'left' in row ? { ...row, left: plain(row.left), right: plain(row.right) } : row), () => [{}])
  // On a phone the green answer and the purple notes stay on one line (about 18 and 30 characters at 320 px).
  for (const row of board) {
    if ('answer' in row) assert.ok(row.answer.length <= 18, `${ref}: the answer ${row.answer} fits on a phone`)
    if ('note' in row) assert.ok(row.note.length <= 30, `${ref}: the note ${row.note} fits on a phone`)
  }
}

// ---------- Every hundred square ----------
// The whole is the original, the answer: every pill "80% = £48" must be that share of it.
const originals = { 'R4.1 video + Q1': 60, 'R4.1 Q2': 8, 'R4.1 Q4a': 520, 'R4.1 Q5a': 650 }
const money = text => Number(text.replace(/[£,]/g, '').split(' ')[0])
let pictures = 0, values = 0
function checkSquare(label, frame, original) {
  assert.ok(frame.pieces.length <= MAX_PILLS, `${label}: at most ${MAX_PILLS} pills`)
  assert.ok(frame.pieces.reduce((sum, piece) => sum + piece.size, 0) <= 100, `${label}: the pieces fit in 100 squares`)
  for (const piece of frame.pieces) {
    assert.ok(percentPillWidth(piece.label) <= PILL_ROOM, `${label}: the pill ${piece.label} fits beside the square`)
    const [share, value] = piece.label.split(' = ')
    assert.equal(Number(share.replace('%', '')), piece.size, `${label}: ${piece.label} fills ${piece.size} squares`)
    assert.ok(Math.abs(money(value) - original * piece.size / 100) < 1e-9, `${label}: ${piece.label} is ${piece.size}% of ${original}`)
    values++
  }
  const note = frame.note ?? `100 squares = ${frame.whole}`
  assert.ok(textWidth(note, NOTE_SIZE) <= PERCENT_WIDTH - 8, `${label}: the note ${note} fits across the picture`)
  // The original is the answer: the opening square and its words must not give it away.
  const shows = text => new RegExp(`(^|[^\\d.])${original}(?![\\d.])`).test(text)
  if (!frame.pieces.some(piece => piece.size === 100)) assert.ok(!shows(note) && !shows(frame.whole), `${label}: the square doesn't show the answer early`)
  const svg = renderToStaticMarkup(React.createElement(PercentVisual, { frame }))
  for (const [, x, y, w, h] of svg.matchAll(/<rect [^>]*?x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)) {
    assert.ok(+x >= 0 && +x + +w <= PERCENT_WIDTH && +y >= 0 && +y + +h <= PERCENT_HEIGHT, `${label}: a shape at ${x}, ${y} sits inside the picture`)
  }
  pictures++
}
for (const state of states) {
  const steps = (state.working ?? state.visual)?.examples?.[0]?.steps ?? []
  const squares = steps.filter(step => step.frame.percent)
  if (!squares.length) continue
  const original = originals[state.sourceRef]
  assert.ok(original, `${state.sourceRef}: a hundred square needs its original listed here`)
  assert.equal(squares.length, steps.length, `${state.sourceRef}: the square stays through the working`)
  if (state.visual.kind === 'percent') checkSquare(`${state.sourceRef} (question)`, state.visual.percent, original)
  steps.forEach((step, i) => {
    checkSquare(`${state.sourceRef} step ${i + 1}`, step.frame.percent, original)
    if (step.frame.percent.before) checkSquare(`${state.sourceRef} opening`, step.frame.percent.before, original)
  })
  // Sunny: a picture keeps its size; the square is a fixed size, so it only has to stay the same whole.
  assert.equal(new Set(steps.map(step => step.frame.percent.whole)).size, 1, `${state.sourceRef}: one hundred square through the working`)
  // The last step fills all 100 squares: the original.
  assert.deepEqual(steps.at(-1).frame.percent.pieces.map(piece => piece.size), [100], `${state.sourceRef}: ends on all 100 squares`)
}
assert.deepEqual(Object.keys(originals).filter(ref => !(at(ref).working ?? at(ref).visual).examples[0].steps[0].frame.percent), [], 'Every listed original has its square')

// ---------- The answers, from the worksheets' own numbers ----------
const numberAnswers = {
  'R4.1 Q2': 6 / 75 * 100, 'R4.1 Q3': 33 / 110 * 100, 'R4.1 Q4a': 364 / 70 * 100, 'R4.1 Q4b': 520 - 364, 'R4.1 Q5a': 117 / 18 * 100,
  'R4.2 Q2': 56 / 0.7, 'R4.2 Q4b': 520 * 0.65, 'R4.2 Q5a': 54.6 / 0.91, 'R4.2 Q5b': 201600 / 1.12,
}
const near = (a, b) => Math.abs(a - b) < 1e-6
for (const [ref, value] of Object.entries(numberAnswers)) {
  const { interaction } = at(ref)
  assert.ok(near(Number(interaction.correctAnswer), value), `${ref}: should be ${value}, is ${interaction.correctAnswer}`)
  assert.ok(checkAnswer(interaction, String(Math.round(value * 100) / 100)), `${ref} accepts ${value}`)
}
// Multipliers: 1 + 8% and 1 − 35%, then the original.
assert.ok(checkAnswer(at('R4.2 Q3').interaction, '1.08, 4') && !checkAnswer(at('R4.2 Q3').interaction, '0.08, 4'), 'R4.2 Q3: ÷ 1.08 = £4')
assert.ok(near(4.32 / 1.08, 4), 'R4.2 Q3: 4.32 ÷ 1.08')
assert.ok(checkAnswer(at('R4.2 Q4a').interaction, '0.65, 520') && !checkAnswer(at('R4.2 Q4a').interaction, '0.35, 520'), 'R4.2 Q4a: ÷ 0.65 = £520')
assert.ok(near(338 / 0.65, 520), 'R4.2 Q4a: 338 ÷ 0.65')
// The claims: the second school has 600 pupils; Ria's £57.60 gives £46.08 going forwards; Tom's 15% off £69 is £58.65.
assert.ok(144 / 24 * 100 < 650, 'R4.1 Q5b: the first school is bigger')
assert.ok(near(57.6 * 0.8, 46.08) && near(48 / 0.8, 60), 'R4.1 Q5c: Ria is wrong')
assert.ok(near(69 * 0.85, 58.65) && near(69 / 1.15, 60), 'R4.2 Q5c: Tom is wrong')
// The worked examples agree with the videos.
assert.ok(near(48 / 80 * 100, 60), 'R4.1 Q1: £60')
assert.ok(near(69 / 1.15, 60), 'R4.2 Q1: £60')
const choices = checkInteractions(states, checkAnswer)

// ---------- Wrong-answer messages ----------
const cases = [['R4.1 Q2', '7.5', '75%'], ['R4.1 Q2', '4.5', 'more than'], ['R4.1 Q3', '29.7', '110%'], ['R4.1 Q3', '0.3', '1%'], ['R4.1 Q4a', '473.2', '70%'],
  ['R4.1 Q4b', '520', 'original'], ['R4.1 Q5a', '21.06', '18%'], ['R4.1 Q5a', '6.5', '1%'],
  ['R4.2 Q2', '72.8', '0.7'], ['R4.2 Q2', '39.2', '0.7'], ['R4.2 Q4b', '182', '0.65'], ['R4.2 Q5a', '49.686', 'divide'], ['R4.2 Q5a', '50.09', '0.91'], ['R4.2 Q5b', '225792', 'divide']]
for (const [ref, response, expected] of cases) {
  const state = at(ref)
  assert.ok(!checkAnswer(state.interaction, response), `${ref}: ${response} is marked wrong`)
  const message = state.diagnose?.(response)
  assert.ok(message && message.toLowerCase().includes(expected.toLowerCase()), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}
assert.match(at('R4.2 Q3').diagnose('0.08, 4'), /108%/)
assert.match(at('R4.2 Q4a').diagnose('0.35, 520'), /0\.65/)

// ---------- The workings ----------
const { steps } = checkWorkings(states)
// Sunny: each method's aim is said up front, in one short line, where students first meet it.
for (const ref of pdfs.map(pdf => `${pdf} video + Q1`)) assert.match(at(ref).content.body, /^Our aim: /, `${ref} states its aim first`)

// ---------- Videos, the course ----------
checkVideos(states, 'lesson-33', {
  // Aniksha's R4_v1 files, unchanged (sha256 checked against her zip on 9 Oct).
  'one-to-hundred.mp4': '6a8d89fa51a21209dfb67ce5e92aae7d3daa1e67fa90bab30fc49d2b3bd4d12d',
  'decimals.mp4': '23260e2274c70cafe4a1a867a43b0741fd5754d133f3a7a96923def6ec3645f9',
})
checkCourse(33, 'R4', 'TutorReversePercentLesson', 'ratio')

console.log(`Lesson 33 (R4) verified: ${states.length} screens, all 16 source questions, ${rows} board rows balanced, ${pictures} hundred squares with ${values} pieces checked, nothing off the edge, ${choices} choices, ${cases.length} wrong-answer messages, ${steps} steps, 2 videos and the route.`)

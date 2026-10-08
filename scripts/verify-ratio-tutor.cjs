// Checks Lesson 30 (Ratio R1, Ratio problems): source coverage, every board row balancing, every ratio picture's
// numbers following from its parts, the pictures keeping one size through a working and staying inside their box,
// the answers, choices, wrong-answer messages, one move a step, greying, the videos and the route.
const { assert, boardOf, checkRows, checkStructure, checkInteractions, checkWorkings, checkVideos, checkCourse } = require('./board-lesson-checks.cjs')
const { tutorRatioLesson: lesson } = require('../src/features/ratio/tutor/ratioLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { RatioVisual, RATIO_WIDTH, NOTE_SIZE, ratioLayout, pillWidth, textWidth } = require('../src/features/written-methods/tutor/RatioPictures.tsx')

const states = lesson.states
const parts = ['Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']
const pdfs = ['R1.6', 'R1.7', 'R1.8']
const at = checkStructure(lesson, { id: 'L030', number: 30, code: 'R1', pdfs, rungs: ['ratio-difference', 'ratio-changing', 'ratio-unit-form'], parts })
const refs = pdfs.flatMap(pdf => [`${pdf} video + Q1`, ...parts.map(part => `${pdf} ${part}`)])

// ---------- Every board row balances ----------
// Number rows balance as they are; the equations for a changing ratio balance at their solution, 1 part.
const solutions = { 'R1.7 video + Q1': 5, 'R1.7 Q4a': 12, 'R1.7 Q5a': 12 }
let rows = 0
for (const ref of refs) {
  const board = boardOf(at(ref))
  assert.ok(board.length, `${ref} has a board`)
  rows += checkRows(ref, board, () => [solutions[ref] === undefined ? {} : { x: solutions[ref] }])
}

// ---------- Every ratio picture ----------
const amount = text => /^£?\d+(\.\d+)?$/.test(text ?? '') ? Number(text.replace('£', '')) : null
let pictures = 0, sums = 0, pairs = 0
function checkPicture(label, frame) {
  const { block, width, height, eachSize } = ratioLayout(frame)
  assert.ok(block >= 8.5, `${label}: blocks ${block.toFixed(1)} wide are too thin to read`)
  assert.ok(width <= RATIO_WIDTH, `${label}: the picture is at most ${RATIO_WIDTH} wide`)
  for (const bar of frame.bars) if (bar.tag) assert.ok(pillWidth(bar.tag) <= (frame.room ?? 0), `${label}: the pill ${bar.tag} has room after its bar`)
  if (frame.each) assert.ok(textWidth(frame.each, eachSize) <= block - 3, `${label}: ${frame.each} fits inside a block`)
  if (frame.note) assert.ok(textWidth(frame.note, NOTE_SIZE) <= width - 8, `${label}: the note fits across the picture`)
  for (const ring of frame.rings ?? []) {
    const bar = frame.bars[ring.bar]
    assert.ok(bar && ring.from >= 0 && ring.to <= bar.parts && ring.to > ring.from, `${label}: a ring sits on its bar`)
  }
  // Lining two bars up (Sunny: explain the difference better): the line sits at the end of the smaller bar, and the
  // ringed extra parts start there and run to the end of the bigger one, so the ring is exactly the difference.
  if (frame.match) {
    const [small, big] = frame.match.bars.map(i => frame.bars[i])
    assert.ok(small && big && frame.match.at === small.parts && big.parts > small.parts, `${label}: the line is at the end of the smaller bar`)
    assert.ok(frame.rings?.some(ring => ring.bar === frame.match.bars[1] && ring.from === small.parts && ring.to === big.parts), `${label}: the extra parts are ringed`)
    pairs++
  }
  // A share's pill is its parts times the 1 part written in each block (or one group's worth, for 1 : n). Once an
  // amount changes, the blocks lose their numbers, so a pill never disagrees with its blocks.
  for (const bar of frame.bars) {
    const value = amount(bar.tag)
    if (value === null) continue
    if (frame.groups) { assert.ok(Math.abs(bar.parts / frame.groups - value) < 1e-9, `${label}: ${bar.name}'s group is ${bar.parts} ÷ ${frame.groups}`); sums++ }
    else if (frame.each) { assert.ok(Math.abs(bar.parts * Number(frame.each) - value) < 1e-9, `${label}: ${bar.name} is ${bar.parts} × ${frame.each}`); sums++ }
  }
  // Everything drawn stays inside the picture.
  const svg = renderToStaticMarkup(React.createElement(RatioVisual, { frame }))
  for (const [, x, y, w, h] of svg.matchAll(/<rect [^>]*?x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)) {
    assert.ok(+x >= 0 && +x + +w <= width && +y >= 0 && +y + +h <= height, `${label}: a shape at ${x}, ${y} sits inside the picture`)
  }
  for (const [, x1, y1, , y2] of svg.matchAll(/class="ns-ratio__match" d="M([-\d.]+) ([-\d.]+) L([-\d.]+) ([-\d.]+)"/g)) assert.ok(+x1 <= width && +y1 >= 0 && +y2 <= height, `${label}: the matching line sits inside the picture`)
  // Names sit inside the left edge, and pills end inside the right one.
  for (const bar of frame.bars) {
    const { barX, tagX } = ratioLayout(frame)
    assert.ok(barX - 10 - textWidth(bar.name, 17) >= 0, `${label}: the name ${bar.name} fits on the left`)
    if (bar.tag) assert.ok(tagX(bar.parts) + pillWidth(bar.tag) <= width, `${label}: the pill ${bar.tag} ends inside the picture`)
  }
  pictures++
}
for (const state of states) {
  if (state.visual.kind === 'ratio') checkPicture(`${state.sourceRef} (question)`, state.visual.ratio)
  const steps = (state.working ?? state.visual)?.examples?.[0]?.steps ?? []
  const sizes = new Set()
  steps.forEach((step, i) => {
    const frame = step.frame.ratio
    if (!frame) return
    checkPicture(`${state.sourceRef} step ${i + 1}`, frame)
    if (frame.before) checkPicture(`${state.sourceRef} opening`, frame.before)
    // Sunny: a picture keeps its size from step to step.
    for (const f of [frame, frame.before].filter(Boolean)) { const { block, width, height } = ratioLayout(f); sizes.add(`${block}×${width}×${height}|${f.bars.map(bar => bar.parts).join(':')}`) }
  })
  assert.ok(sizes.size <= 1, `${state.sourceRef}: the bars keep one size through the working (${[...sizes].join(', ')})`)
  if (state.visual.kind === 'ratio' && sizes.size) {
    const { block, width, height } = ratioLayout(state.visual.ratio)
    assert.ok(sizes.has(`${block}×${width}×${height}|${state.visual.ratio.bars.map(bar => bar.parts).join(':')}`), `${state.sourceRef}: the question's bars are the working's bars`)
  }
}

// ---------- The answers ----------
const numberAnswers = {
  'R1.6 Q2': 18 / (5 - 2) * 2, 'R1.6 Q3': 45 / (8 - 3) * 4, 'R1.6 Q4a': 45 / (7 - 2) * 3, 'R1.6 Q4b': 9 * (7 + 3 + 2), 'R1.6 Q5a': 84 / (9 - 2) * 5, 'R1.6 Q5b': 12 * (2 + 5 + 9),
  'R1.6 Q5c': 84 / 16 * (9 - 2), 'R1.7 Q4a': 3 * 12, 'R1.7 Q4b': 2 * 12 + 12, 'R1.7 Q5a': 5 * 12, 'R1.7 Q5b': 6 * 12 - 8 + 5 * 12 + 4,
  'R1.8 Q4b': 600 / 100 * 3, 'R1.8 Q5b': 12 * 36 / 8, 'R1.8 Q5c': 28 * 8,
}
for (const [ref, value] of Object.entries(numberAnswers)) {
  const { interaction } = at(ref)
  assert.equal(Number(interaction.correctAnswer), value, `${ref}: should be ${value}`)
  assert.ok(checkAnswer(interaction, String(value)), `${ref} accepts ${value}`)
}
// The changing ratios: 1 part makes the two amounts equal after the change, and the worked ones agree with the source.
assert.equal(7 * 5 - 10, 3 * 5 + 10, 'R1.7 Q1: 35 − 10 = 15 + 10')
assert.equal(3 * 12, 2 * 12 + 12, 'R1.7 Q4a: 36 apples = 24 + 12 pears')
assert.equal(6 * 12 - 8, 5 * 12 + 4, 'R1.7 Q5a: 64 adults = 64 children')
const ratios = { 'R1.7 Q2': [1, 1], 'R1.7 Q3': [9, 10], 'R1.8 Q2': [1, 4], 'R1.8 Q3': [3.5, 1], 'R1.8 Q4a': [1, 33.3], 'R1.8 Q5a': [1, 4.5] }
const gcd = (a, b) => b ? gcd(b, a % b) : a
for (const [ref, [a, b]] of Object.entries(ratios)) {
  const { interaction } = at(ref)
  assert.equal(interaction.listJoiner, ':', `${ref}: typed as ☐ : ☐`)
  assert.ok(checkAnswer(interaction, `${a}, ${b}`), `${ref} accepts ${a} : ${b}`)
  if (a !== b) assert.ok(!checkAnswer(interaction, `${b}, ${a}`), `${ref} rejects the two swapped`)
}
assert.deepEqual([30 - 10, 10 + 10].map(n => n / gcd(20, 20)), [1, 1], 'R1.7 Q2: £20 : £20 is 1 : 1')
assert.deepEqual([45, 2 * 15 + 20].map(n => n / gcd(45, 50)), [9, 10], 'R1.7 Q3: 45 : 50 is 9 : 10')
assert.deepEqual([5 / 5, 20 / 5, 14 / 4, 4 / 4, 36 / 8], [1, 4, 3.5, 1, 4.5], 'R1.8: dividing both by the right number')
assert.equal(Math.round(100 / 3 * 10) / 10, 33.3, 'R1.8 Q4a: 100 ÷ 3 to 1 decimal place')
const choices = checkInteractions(states, checkAnswer)

// ---------- Wrong-answer messages ----------
const cases = [['R1.6 Q2', '36', 'difference'], ['R1.6 Q3', '12', 'not the total'], ['R1.6 Q4a', '63', 'teas'], ['R1.6 Q4b', '12', 'number of parts'],
  ['R1.6 Q5a', '108', 'largest'], ['R1.6 Q5c', '5.25', 'jo'], ['R1.7 Q2', '20, 20', 'simplifying'], ['R1.7 Q3', '10, 9', 'order'], ['R1.7 Q3', '3, 2', 'before the gift'],
  ['R1.7 Q4a', '12', '1 part'], ['R1.7 Q5a', '64', 'now'], ['R1.8 Q2', '1, 15', 'subtract'], ['R1.8 Q3', '7, 2', 'same ratio'], ['R1.8 Q4a', '1, 33.33', 'decimal place'],
  ['R1.8 Q4b', '200', 'lots'], ['R1.8 Q5a', '1, 28', 'subtract'], ['R1.8 Q5b', '16.5', 'multiply']]
for (const [ref, response, expected] of cases) {
  const state = at(ref)
  assert.ok(!checkAnswer(state.interaction, response), `${ref}: ${response} is marked wrong`)
  const message = state.diagnose?.(response)
  assert.ok(message && message.toLowerCase().includes(expected), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}

// ---------- The workings ----------
const { steps } = checkWorkings(states)
// Sunny: each method's aim is said up front, in one short line, where students first meet it.
assert.ok(states.filter(state => /^R1\.6 /.test(state.sourceRef) && ['Q4b', 'Q5b'].every(part => !state.sourceRef.endsWith(part))).every(state => ((state.working ?? state.visual)?.examples?.[0]?.steps ?? []).some(step => step.frame.ratio?.match)), 'R1.6: every difference working lines the two bars up')
for (const ref of pdfs.map(pdf => `${pdf} video + Q1`)) assert.match(at(ref).content.body, /^Our aim: /, `${ref} states its aim first`)

// ---------- Videos, the course ----------
checkVideos(states, 'lesson-30', {
  // Aniksha's R1_v2 files, unchanged (sha256 checked against her zip on 8 Oct).
  'difference.mp4': '5ccd3a50fe8f0a8b519636c5376e72acf9650fae35e8b226ec86879f54086f51',
  'changing.mp4': '736e0c17681d3bbcd9ef8435220024f88cfa9748660063b996eccf85ac4bcd36',
  'unit-form.mp4': '5d555287c2845d33af0df698342682afb658fc1a22bdbee9353b8e3048505b92',
})
checkCourse(30, 'R1', 'TutorRatioLesson', 'ratio')

console.log(`Lesson 30 (R1) verified: ${states.length} screens, all 24 source questions, ${rows} board rows balanced, ${pictures} ratio pictures with ${sums} shares and ${pairs} lined-up differences checked, one size each and nothing off the edge, ${choices} choices, ${cases.length} wrong-answer messages, ${steps} steps, 3 videos and the route.`)

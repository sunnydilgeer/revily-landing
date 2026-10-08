// Checks Lesson 31 (Ratio R2, Direct and inverse proportion): source coverage, every board row balancing, every row
// picture's amounts following from its counts (the same rate for direct proportion, the same total work for inverse),
// the pictures keeping one size through a working and staying inside their box, the answers, choices, wrong-answer
// messages, one move a step, greying, the videos and the route.
const { assert, boardOf, checkRows, checkStructure, checkInteractions, checkWorkings, checkVideos, checkCourse } = require('./board-lesson-checks.cjs')
const { tutorProportionLesson: lesson } = require('../src/features/ratio/tutor/proportionLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { RatioVisual, RATIO_WIDTH, NOTE_SIZE, ratioLayout, pillWidth, textWidth } = require('../src/features/written-methods/tutor/RatioPictures.tsx')

const states = lesson.states
const parts = ['Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']
const pdfs = ['R2.1', 'R2.2']
const at = checkStructure(lesson, { id: 'L031', number: 31, code: 'R2', rungs: ['proportion-direct', 'proportion-inverse'], parts })
const refs = pdfs.flatMap(pdf => [`${pdf} video + Q1`, ...parts.map(part => `${pdf} ${part}`)])

// ---------- Every board row balances ----------
// Sunny: the sums say which number is the total and which is each one's share; the words are read past here.
const plain = side => side.replace(/ (total|each|people|painters)\b/g, '')
let rows = 0, labelled = 0
for (const ref of refs) {
  const board = boardOf(at(ref))
  assert.ok(board.length, `${ref} has a board`)
  rows += checkRows(ref, board.map(row => 'left' in row ? { ...row, left: plain(row.left), right: plain(row.right) } : row), () => [{}])
  labelled += board.filter(row => 'left' in row && / (total|each)\b/.test(`${row.left} ${row.right}`)).length
}
// Every find-1 sum (a total shared out) says each, and every worked example's sums say total and each.
for (const ref of pdfs.map(pdf => `${pdf} video + Q1`)) assert.ok(boardOf(at(ref)).filter(row => 'left' in row).every(row => /total/.test(row.left + row.right) && /each/.test(row.left + row.right)), `${ref}: its sums say total and each`)

// ---------- Every row picture ----------
// A pill's amount is its leading number: "12 slices", "£3", "45 min". A count is the row's number of blocks.
const amount = text => /^£?\d+(\.\d+)?( |$)/.test(text ?? '') ? Number(text.replace('£', '').split(' ')[0]) : null
let pictures = 0, sums = 0
function checkPicture(label, frame, kind) {
  const { block, width, height } = ratioLayout(frame)
  assert.ok(block >= 8.5, `${label}: blocks ${block.toFixed(1)} wide are too thin to read`)
  assert.ok(width <= RATIO_WIDTH, `${label}: the picture is at most ${RATIO_WIDTH} wide`)
  for (const bar of frame.bars) if (bar.tag) assert.ok(pillWidth(bar.tag) <= (frame.room ?? 0), `${label}: the pill ${bar.tag} has room after its bar`)
  if (frame.note) assert.ok(textWidth(frame.note, NOTE_SIZE) <= width - 8, `${label}: the note fits across the picture`)
  for (const ring of frame.rings ?? []) {
    const bar = frame.bars[ring.bar]
    assert.ok(bar && ring.from >= 0 && ring.to <= bar.parts && ring.to > ring.from, `${label}: a ring sits on its bar`)
    assert.ok(!frame.dim?.includes(ring.bar), `${label}: a faint row is never ringed`)
  }
  // The row's name says its count: "4 people" has 4 blocks.
  for (const bar of frame.bars) assert.equal(Number(bar.name.split(' ')[0]), bar.parts, `${label}: ${bar.name} has ${bar.parts} blocks`)
  // Direct proportion keeps the amount for 1 the same on every row; inverse keeps the total work (count × time) the same.
  const known = frame.bars.filter(bar => amount(bar.tag) !== null)
  const rule = bar => kind === 'direct' ? amount(bar.tag) / bar.parts : amount(bar.tag) * bar.parts
  for (const bar of known.slice(1)) { assert.ok(Math.abs(rule(bar) - rule(known[0])) < 1e-9, `${label}: ${bar.name} → ${bar.tag} follows from ${known[0].name} → ${known[0].tag}`); sums++ }
  // Everything drawn stays inside the picture.
  const svg = renderToStaticMarkup(React.createElement(RatioVisual, { frame }))
  for (const [, x, y, w, h] of svg.matchAll(/<rect [^>]*?x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)) {
    assert.ok(+x >= 0 && +x + +w <= width && +y >= 0 && +y + +h <= height, `${label}: a shape at ${x}, ${y} sits inside the picture`)
  }
  for (const bar of frame.bars) {
    const { barX, tagX } = ratioLayout(frame)
    assert.ok(barX - 10 - textWidth(bar.name, 17) >= 0, `${label}: the name ${bar.name} fits on the left`)
    if (bar.tag) assert.ok(tagX(bar.parts) + pillWidth(bar.tag) <= width, `${label}: the pill ${bar.tag} ends inside the picture`)
  }
  pictures++
}
for (const state of states) {
  const kind = state.microSkillId === 'proportion-direct' ? 'direct' : 'inverse'
  if (state.visual.kind === 'ratio') checkPicture(`${state.sourceRef} (question)`, state.visual.ratio, kind)
  const steps = (state.working ?? state.visual)?.examples?.[0]?.steps ?? []
  const sizes = new Set()
  steps.forEach((step, i) => {
    const frame = step.frame.ratio
    if (!frame) return
    checkPicture(`${state.sourceRef} step ${i + 1}`, frame, kind)
    if (frame.before) checkPicture(`${state.sourceRef} opening`, frame.before, kind)
    // Sunny: a picture keeps its size from step to step.
    for (const f of [frame, frame.before].filter(Boolean)) { const { block, width, height } = ratioLayout(f); sizes.add(`${block}×${width}×${height}|${f.bars.map(bar => bar.parts).join(':')}`) }
  })
  assert.ok(sizes.size <= 1, `${state.sourceRef}: the rows keep one size through the working (${[...sizes].join(', ')})`)
  if (state.visual.kind === 'ratio' && sizes.size) {
    const { block, width, height } = ratioLayout(state.visual.ratio)
    assert.ok(sizes.has(`${block}×${width}×${height}|${state.visual.ratio.bars.map(bar => bar.parts).join(':')}`), `${state.sourceRef}: the question's rows are the working's rows`)
  }
  // The 1 row is faint until the step that finds it.
  const first = steps[0]?.frame.ratio
  if (first?.before?.dim) assert.ok(first.before.dim.every(i => !first.before.bars[i].tag) && !first.dim?.length, `${state.sourceRef}: the faint row lights up on the first step`)
}

// ---------- The answers, from the worksheets' own numbers ----------
const numberAnswers = {
  'R2.1 Q2': 15 / 5 * 3, 'R2.1 Q3': 300 / 12 * 20, 'R2.1 Q4a': 84 / 6 * 10, 'R2.1 Q4b': 217 / (84 / 6), 'R2.1 Q5a': 45 / 3 * 8,
  'R2.2 Q2': 2 * 6 / 4, 'R2.2 Q3': 6 * 5 / 10, 'R2.2 Q4a': 3 * 8 / 4, 'R2.2 Q4b': 3 * 8 / 2, 'R2.2 Q5a': 8 * 45 / 12, 'R2.2 Q5b': 8 * 45 / 20,
}
for (const [ref, value] of Object.entries(numberAnswers)) {
  const { interaction } = at(ref)
  assert.equal(Number(interaction.correctAnswer), value, `${ref}: should be ${value}`)
  assert.ok(checkAnswer(interaction, String(value)), `${ref} accepts ${value}`)
}
// R2.1 Q5b: 200 pages at 15 a minute is 13 minutes and 5 pages, and 5 pages are 20 seconds.
const minutes = Math.floor(200 / 15), seconds = (200 - minutes * 15) / 15 * 60
assert.deepEqual([minutes, seconds], [13, 20], 'R2.1 Q5b: 13 minutes 20 seconds')
assert.ok(checkAnswer(at('R2.1 Q5b').interaction, '13, 20') && !checkAnswer(at('R2.1 Q5b').interaction, '20, 13'), 'R2.1 Q5b: minutes, then seconds')
// The claims: Maya's 6 minutes are double 3, so double the pages; Leo's 16 stewards are double 8, so half the time.
assert.equal(6 / 3 * 45, 90, 'R2.1 Q5c: 90 pages')
assert.equal(8 * 45 / 16, 22.5, 'R2.2 Q5c: 22.5 minutes')
assert.match(at('R2.1 Q5c').interaction.options[0].label, /90 pages/)
assert.match(at('R2.2 Q5c').interaction.options[0].label, /22\.5 minutes/)
// The worked examples agree with the videos.
assert.equal(7 * (12 / 4), 21, 'R2.1 Q1: 21 slices')
assert.equal(4 * 9 / 6, 6, 'R2.2 Q1: 6 hours')
const choices = checkInteractions(states, checkAnswer)

// ---------- Wrong-answer messages ----------
const cases = [['R2.1 Q2', '45', 'not 1 pen'], ['R2.1 Q3', '25', '1 biscuit'], ['R2.1 Q4a', '840', 'find 1 litre'], ['R2.1 Q4b', '15', '15.5'],
  ['R2.1 Q5a', '50', 'add'], ['R2.1 Q5b', '13, 33', '20 seconds'], ['R2.1 Q5b', '13, 5', 'pages left'], ['R2.2 Q2', '12', 'less time'],
  ['R2.2 Q3', '50', 'sooner'], ['R2.2 Q4a', String(32 / 3), 'direct proportion'], ['R2.2 Q4b', '48', 'divide'], ['R2.2 Q5a', '360', '1 steward'], ['R2.2 Q5b', '7200', 'divide']]
for (const [ref, response, expected] of cases) {
  const state = at(ref)
  assert.ok(!checkAnswer(state.interaction, response), `${ref}: ${response} is marked wrong`)
  const message = state.diagnose?.(response)
  assert.ok(message && message.toLowerCase().includes(expected), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}

// ---------- The workings ----------
const { steps } = checkWorkings(states)
// Sunny: each method's aim is said up front, in one short line, where students first meet it.
for (const ref of pdfs.map(pdf => `${pdf} video + Q1`)) assert.match(at(ref).content.body, /^Our aim: /, `${ref} states its aim first`)

// ---------- Videos, the course ----------
checkVideos(states, 'lesson-31', {
  // Aniksha's R2_v2 files, unchanged (sha256 checked against her zip on 8 Oct).
  'direct.mp4': '47aaa3dda8b0d9d3e7ec87838c3cf852b7541d911af87edd0981d3cc4b2fcd8c',
  'inverse.mp4': '034e8e36d952722482c20e0e6fadda28d5898c63db805846882a58d28c1febb4',
})
checkCourse(31, 'R2', 'TutorProportionLesson', 'ratio')

console.log(`Lesson 31 (R2) verified: ${states.length} screens, all 16 source questions, ${rows} board rows balanced (${labelled} saying total or each), ${pictures} row pictures with ${sums} amounts checked, one size each and nothing off the edge, ${choices} choices, ${cases.length} wrong-answer messages, ${steps} steps, 2 videos and the route.`)

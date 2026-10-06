// Checks Lesson 29 (Algebra A14, Function machines): source coverage, every board row balancing, every machine's
// numbers following from its boxes, the pictures staying inside their box with nothing overlapping, the answers,
// choices, wrong-answer messages, one move a step, greying, the videos and the route.
const { assert, boardOf, checkRows, randomScopes, checkStructure, checkInteractions, checkWorkings, checkVideos, checkCourse } = require('./board-lesson-checks.cjs')
const { tutorFunctionMachinesLesson: lesson } = require('../src/features/function-machines/tutor/functionMachinesLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { MachineVisual, MACHINE_WIDTH, VALUE_SIZE, undoSize, undoPad, machineLayout, pillWidth } = require('../src/features/written-methods/tutor/MachinePictures.tsx')

const states = lesson.states
const parts = ['Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']
const at = checkStructure(lesson, { id: 'L029', number: 29, code: 'A14', rungs: ['function-machines-forwards', 'function-machines-backwards', 'function-machines-creating'], parts })
const refs = ['A14.1', 'A14.2', 'A14.3'].flatMap(pdf => [`${pdf} video + Q1`, ...parts.map(part => `${pdf} ${part}`)])

// ---------- Every board row balances ----------
// Number rows balance as they are; an equation's rows balance for every x, with y worked out from the equation.
const equations = {
  'A14.3 video + Q1': x => 3 * x + 4, 'A14.3 Q2': x => x + 8, 'A14.3 Q3': x => 5 * x - 2, 'A14.3 Q4a': x => (x + 6) / 4,
  'A14.3 Q5a': x => (2 * x + 5) / 3, 'A14.3 Q5c': () => 10,
}
let rows = 0
for (const ref of refs) {
  const board = boardOf(at(ref))
  assert.ok(board.length, `${ref} has a board`)
  const y = equations[ref]
  rows += checkRows(ref, board, y ? randomScopes(12, scope => ({ ...scope, ...(ref.endsWith('Q5c') ? { x: 2 } : {}), y: y(ref.endsWith('Q5c') ? 2 : scope.x) })) : () => [{}])
}

// ---------- Every machine: its numbers follow from its boxes ----------
const apply = (box, value) => {
  const [op, n] = [box[0], Number(box.slice(1).trim().replace('−', '-'))]
  return op === '×' ? value * n : op === '÷' ? value / n : op === '+' ? value + n : op === '−' ? value - n : NaN
}
const opposite = { '×': '÷', '÷': '×', '+': '−', '−': '+' }
const read = text => /^−?\d+(\.\d+)?$/.test(text ?? '') ? Number(text.replace('−', '-')) : null
let machines = 0, links = 0
function checkMachine(label, frame) {
  assert.equal(frame.values.length, frame.boxes.length + 1, `${label}: a number before and after every box`)
  frame.boxes.forEach((box, i) => {
    const before = read(frame.values[i]), after = read(frame.values[i + 1])
    if (before === null || after === null || box === '?') return
    assert.ok(Math.abs(apply(box, before) - after) < 1e-9, `${label}: ${frame.values[i]} through ${box} makes ${frame.values[i + 1]}`)
    links++
  })
  frame.undo?.forEach((op, i) => op && assert.equal(op, `${opposite[frame.boxes[i][0]]}${frame.boxes[i].slice(1)}`, `${label}: box ${i + 1} is undone by its opposite`))
  // Going backwards, the ring is on a box whose opposite is written under it.
  if (frame.back && frame.lit !== undefined) assert.ok(frame.undo?.[frame.lit], `${label}: the box being undone shows its opposite`)
  // The picture stays inside its box, and no two numbers (or opposites) underneath overlap.
  const svg = renderToStaticMarkup(React.createElement(MachineVisual, { frame }))
  const { height, valueAt, at: slotAt, arrows } = machineLayout(frame)
  // Input, every box and Output are joined by an arrow long enough to see (Sunny, 6 Oct), inside the picture.
  for (const [from, to] of arrows) assert.ok(to - from >= 10 && from >= 0 && to <= MACHINE_WIDTH, `${label}: an arrow from ${from} to ${to} is too short or off the edge`)
  for (const [, x, y, w, h] of svg.matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)) {
    assert.ok(+x >= 0 && +x + +w <= MACHINE_WIDTH && +y >= 0 && +y + +h <= height, `${label}: a shape at ${x}, ${y} sits inside the picture`)
  }
  const spans = (list, size, pad) => list.filter(Boolean).map(([centre, text]) => [centre - pillWidth(text, size, pad) / 2, centre + pillWidth(text, size, pad) / 2]).sort((a, b) => a[0] - b[0])
  for (const row of [spans(frame.values.map((v, j) => v && [valueAt(j), v]), VALUE_SIZE, 16), spans((frame.undo ?? []).map((op, i) => op && [slotAt(i + 1), `undo ${op}`]), undoSize(frame.boxes.length), undoPad(frame.boxes.length))]) {
    row.forEach((span, i) => i && assert.ok(span[0] >= row[i - 1][1] - 0.5, `${label}: two labels underneath overlap`))
  }
  machines++
}
for (const state of states) {
  if (state.visual.kind === 'machine') checkMachine(`${state.sourceRef} (question)`, state.visual.machine)
  const steps = (state.working ?? state.visual)?.examples?.[0]?.steps ?? []
  steps.forEach((step, i) => {
    if (!step.frame.machine) return
    checkMachine(`${state.sourceRef} step ${i + 1}`, step.frame.machine)
    if (step.frame.machine.before) checkMachine(`${state.sourceRef} opening`, step.frame.machine.before)
  })
}
// Each machine working rings the box the step's heading names (Box 2: …, Undo box 2: …).
for (const state of states) {
  for (const step of (state.working ?? state.visual)?.examples?.[0]?.steps ?? []) {
    const named = step.title.match(/^(?:Undo )?[Bb]ox (\d)/)
    if (named) assert.equal(step.frame.machine?.lit, Number(named[1]) - 1, `${state.sourceRef}: "${step.title}" rings box ${named[1]}`)
  }
}

// ---------- The answers ----------
const numberAnswers = {
  'A14.1 Q2': 15 + 9, 'A14.1 Q3': 36 / 3 - 5, 'A14.1 Q4a': 6 * 5 - 8, 'A14.1 Q4b': -2 * 5 - 8, 'A14.1 Q5a': (5 * 3 + 7) / 2, 'A14.1 Q5b': (-7 * 3 + 7) / 2,
  'A14.2 Q2': 14 + 6, 'A14.2 Q3': 30 / 2 - 7, 'A14.2 Q4a': (15 - 9) * 4, 'A14.2 Q4b': (2 - 9) * 4, 'A14.2 Q5a': (9 * 2 + 6) / 3, 'A14.2 Q5b': (8 * 3 - 6) / 2,
  'A14.3 Q4b': (10 + 6) / 4, 'A14.3 Q5b': (2 * 8 + 5) / 3,
}
for (const [ref, value] of Object.entries(numberAnswers)) {
  const { interaction } = at(ref)
  assert.equal(Number(interaction.correctAnswer), value, `${ref}: should be ${value}`)
  assert.ok(checkAnswer(interaction, String(value)), `${ref} accepts ${value}`)
}
// Working backwards gives the input that the machine turns into the output: check each going forwards again.
for (const [ref, boxes, output] of [['A14.2 Q2', ['− 6'], 14], ['A14.2 Q3', ['+ 7', '× 2'], 30], ['A14.2 Q4a', ['÷ 4', '+ 9'], 15], ['A14.2 Q4b', ['÷ 4', '+ 9'], 2], ['A14.2 Q5a', ['× 3', '− 6', '÷ 2'], 9]]) {
  assert.equal(boxes.reduce((value, box) => apply(box, value), Number(at(ref).interaction.correctAnswer)), output, `${ref}: the input goes through to ${output}`)
}
for (const [ref, pairAnswer] of [['A14.1 Q5c', [19, 33]], ['A14.3 Q5c', [10, 18]]]) {
  const { interaction } = at(ref)
  assert.equal(interaction.listLabels?.length, 2, `${ref}: each box is labelled`)
  assert.ok(checkAnswer(interaction, pairAnswer.join(', ')), `${ref} accepts ${pairAnswer}`)
  assert.ok(!checkAnswer(interaction, [...pairAnswer].reverse().join(', ')), `${ref} rejects the two swapped`)
}
assert.deepEqual([4 * 3 + 7, (4 + 7) * 3], [19, 33], 'A14.1 Q5c: the two machines give different outputs')
assert.deepEqual([3 * 2 + 4, (2 + 4) * 3], [10, 18], 'A14.3 Q5c: the equation and Dev’s machine disagree')
assert.ok((19 / 4 - 3) !== 4 && (19 - 3) / 4 === 4, 'A14.2 Q5c: Ben’s way gives the wrong input')
// The machines to fill in: the right choice is the boxes in BIDMAS order, checked at several values of x.
const fills = { 'A14.3 Q2': ['+ 8'], 'A14.3 Q3': ['× 5', '− 2'], 'A14.3 Q4a': ['+ 6', '÷ 4'], 'A14.3 Q5a': ['× 2', '+ 5', '÷ 3'] }
for (const [ref, boxes] of Object.entries(fills)) {
  const right = at(ref).interaction.options[0].label
  assert.equal(right.split(', then ').join('|'), boxes.join('|'), `${ref}: the right choice is ${boxes.join(', then ')}`)
  for (const x of [-3, 0, 2, 7.5]) assert.ok(Math.abs(boxes.reduce((v, box) => apply(box, v), x) - equations[ref](x)) < 1e-9, `${ref}: the machine matches the equation at x = ${x}`)
}
const choices = checkInteractions(states, checkAnswer)

// ---------- Wrong-answer messages ----------
const cases = [['A14.1 Q3', '12', 'after box 1'], ['A14.1 Q4b', '-2', 'below zero'], ['A14.1 Q5a', '22', 'after box 2'], ['A14.1 Q5b', '7', 'minus sign'],
  ['A14.1 Q5c', '33, 19', 'which is which'], ['A14.2 Q3', '11.5', 'last box first'], ['A14.2 Q4a', '51', 'last box first'], ['A14.2 Q4b', '28', 'below zero'],
  ['A14.2 Q5a', '4', 'add 6'], ['A14.3 Q4b', '8.5', '+ 6 first'], ['A14.3 Q5c', '18, 10', 'which is which']]
for (const [ref, response, expected] of cases) {
  const state = at(ref)
  assert.ok(!checkAnswer(state.interaction, response), `${ref}: ${response} is marked wrong`)
  const message = state.diagnose?.(response)
  assert.ok(message && message.toLowerCase().includes(expected), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}

// ---------- The workings ----------
const { steps } = checkWorkings(states)
// Sunny: each method's aim is said up front, in one short line, where students first meet it.
for (const ref of ['A14.1 video + Q1', 'A14.2 video + Q1', 'A14.3 video + Q1']) assert.match(at(ref).content.body, /^Our aim: /, `${ref} states its aim first`)

// ---------- Videos, the course ----------
checkVideos(states, 'lesson-29', {
  // Aniksha's A14_v1 files, unchanged (sha256 checked against the zip in her folder on 6 Oct).
  'input-to-output.mp4': 'b343c2874cb524fee67e05c8cfe37047830c777c43614325562232b192731b74',
  'output-to-input.mp4': 'd639dc328c5f17fa9106123366746bdec7948ef2217a267c722b5c565d7fa653',
  'creating.mp4': '053d4afbd87b98d0828398c761a0c1d9b398dbf05ebe982a359ed48266a054e6',
})
checkCourse(29, 'A14', 'TutorFunctionMachinesLesson')

console.log(`Lesson 29 (A14) verified: ${states.length} screens, all 24 source questions, ${rows} board rows balanced, ${machines} machine pictures with ${links} box sums checked and nothing off the edge, ${choices} choices, ${cases.length} wrong-answer messages, ${steps} steps, 3 videos and the route.`)

// Checks Lesson 27 (Algebra A12, Simultaneous equations): source coverage, every board row balancing at the
// solution, each pair of equations having exactly that one solution, the answers, choices, wrong-answer messages,
// one move a step, greying, the videos and the route.
const { assert, evaluate, boardOf, checkRows, checkStructure, checkInteractions, checkWorkings, checkVideos, checkCourse } = require('./board-lesson-checks.cjs')
const { tutorSimultaneousEquationsLesson: lesson } = require('../src/features/simultaneous-equations/tutor/simultaneousEquationsLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

const states = lesson.states
const at = checkStructure(lesson, { id: 'L027', number: 27, code: 'A12', rungs: ['simultaneous-elimination', 'simultaneous-words'], parts: ['Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c'] })

// ---------- Every board, worked out again at its solution ----------
const solutions = {
  'A12.1 video + Q1': { x: 4, y: 2 }, 'A12.1 Q2': { x: 6, y: 3 }, 'A12.1 Q3': { x: 3.5, y: 4 }, 'A12.1 Q4a': { x: 2, y: 3 }, 'A12.1 Q4b': { x: 2, y: 3 },
  'A12.1 Q5a': { x: 3.5, y: 3 }, 'A12.1 Q5b': { x: 3.5, y: 3 }, 'A12.1 Q5c': { x: 6, y: 4 },
  'A12.1 extra worked (× 3 and × 2)': { x: 2, y: 3 }, 'A12.1 extra (× 2 and × 3)': { x: 5, y: 2 },
  'A12.2 video + Q1': { t: 2, c: 3 }, 'A12.2 Q2': { p: 1, r: 2 }, 'A12.2 Q3': { a: 8, c: 5 }, 'A12.2 Q4a': { b: 4, d: 3 }, 'A12.2 Q4b': { b: 4, d: 3 },
  'A12.2 Q5a': { n: 90, p: 30 }, 'A12.2 Q5b': { n: 90, p: 30 }, 'A12.2 Q5c': { a: 1.5, b: 0.5 },
}
let rows = 0, pairs = 0
for (const [ref, solution] of Object.entries(solutions)) {
  const board = boardOf(at(ref))
  assert.ok(board.length, `${ref} has a board`)
  rows += checkRows(ref, board, () => [solution])
  // The two labelled equations meet at exactly this point: work out their coefficients and solve them again.
  const labelled = board.filter(row => row.label)
  if (labelled.length !== 2) continue
  const [u, v] = Object.keys(solution)
  const line = row => {
    const f = (p, q) => evaluate(row.left, { [u]: p, [v]: q }) - evaluate(row.right, { [u]: p, [v]: q })
    const c = f(0, 0)
    return [f(1, 0) - c, f(0, 1) - c, -c]
  }
  const [[a1, b1, c1], [a2, b2, c2]] = labelled.map(line)
  const det = a1 * b2 - a2 * b1
  assert.ok(Math.abs(det) > 1e-9, `${ref}: the two equations have one solution`)
  assert.ok(Math.abs((c1 * b2 - c2 * b1) / det - solution[u]) < 1e-9 && Math.abs((a1 * c2 - a2 * c1) / det - solution[v]) < 1e-9, `${ref}: they meet at ${JSON.stringify(solution)}`)
  pairs++
}
// The worked examples' answers: the source's own.
assert.equal(boardOf(at('A12.1 video + Q1')).at(-1).answer, 'x = 4, y = 2')
assert.equal(boardOf(at('A12.2 video + Q1')).at(-1).answer, 'Tea £2, cake £3')

// ---------- The answers ----------
const listAnswers = { 'A12.1 extra (× 2 and × 3)': [5, 2], 'A12.1 Q2': [6, 3], 'A12.1 Q3': [3.5, 4], 'A12.1 Q4a': [2, 3], 'A12.1 Q5a': [3.5, 3], 'A12.2 Q3': [8, 5], 'A12.2 Q5a': [90, 30] }
for (const [ref, [first, second]] of Object.entries(listAnswers)) {
  const { interaction } = at(ref)
  assert.equal(interaction.responseShape, 'list', `${ref} is two boxes`)
  assert.equal(interaction.listLabels?.length, 2, `${ref}: each box is labelled`)
  assert.ok(checkAnswer(interaction, `${first}, ${second}`), `${ref} accepts ${first}, ${second}`)
  assert.ok(!checkAnswer(interaction, `${second}, ${first}`), `${ref} rejects the two swapped`)
}
const numberAnswers = {
  'A12.1 Q4b': 3 * 2 + 2 * 3, 'A12.2 Q2': solutions['A12.2 Q2'].p, 'A12.2 Q4a': solutions['A12.2 Q4a'].b, 'A12.2 Q4b': solutions['A12.2 Q4b'].d,
  'A12.2 Q5b': 5 * 90 + 2 * 30,
}
for (const [ref, value] of Object.entries(numberAnswers)) {
  const { interaction } = at(ref)
  assert.equal(Number(interaction.correctAnswer), value, `${ref}: should be ${value}`)
  assert.ok(checkAnswer(interaction, String(value)), `${ref} accepts ${value}`)
}
assert.match(at('A12.1 Q5c').interaction.options[0].label, /^Yes/, 'A12.1 Q5c: Sam is correct')
const choices = checkInteractions(states, checkAnswer)

// ---------- Wrong-answer messages ----------
const cases = [['A12.1 Q2', '3, 6', 'which is which'], ['A12.1 Q3', '4, 3.5', 'which is which'],
  ['A12.1 Q2', '6, 9', 'find y'], ['A12.1 Q5a', '7, 3', 'find x'], ['A12.1 Q4b', '11', '6 + 6'],
  ['A12.2 Q2', '2', 'divide by 2'], ['A12.2 Q4a', '8', '2 burgers'], ['A12.2 Q4b', '4', 'a burger'], ['A12.2 Q5b', '5.10', 'pence']]
for (const [ref, response, expected] of cases) {
  const state = at(ref)
  assert.ok(!checkAnswer(state.interaction, response), `${ref}: ${response} is marked wrong`)
  const message = state.diagnose?.(response)
  assert.ok(message && message.toLowerCase().includes(expected), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}

// Sunny, 5 Oct: an extra worked example and question where both equations are multiplied (× 3 and × 2) before taking away.
for (const ref of ['A12.1 extra worked (× 3 and × 2)', 'A12.1 extra (× 2 and × 3)']) {
  const notes = boardOf(at(ref)).filter(row => 'note' in row).map(row => row.note)
  assert.equal(notes.length, 2, `${ref}: both equations are multiplied`)
  assert.deepEqual(notes.map(note => note.match(/× (\d)/)[1]).sort(), ['2', '3'], `${ref}: one by 2, the other by 3`)
}

// ---------- The workings ----------
const { steps } = checkWorkings(states)
// Both equations start on the board, labelled ① and ②. (A12.2 writes them from the words first.)
for (const ref of ['A12.1 video + Q1', 'A12.1 Q2', 'A12.1 Q3', 'A12.1 Q4a', 'A12.1 Q5a']) {
  const first = (at(ref).working ?? at(ref).visual).examples[0].steps[0].frame.equation
  assert.deepEqual(first.rows.slice(0, 2).map(row => row.label), ['①', '②'], `${ref}: both equations start on the board, labelled`)
  assert.equal(first.given, 2, `${ref}: the opening screen shows both equations`)
}

// ---------- Videos, the course ----------
checkVideos(states, 'lesson-27', {
  // Aniksha's A12 files, unchanged (sha256 checked against her folder on 5 Oct).
  'elimination.mp4': 'e94113464951e28840b93d0500f2aecc488494a713d08c48b7c4193bd71521fc',
  'worded-problems.mp4': 'd21ed709af290a0b953edc3b1d89664c0a02a84451f8b94ebe8643b8a533ed2f',
})
checkCourse(27, 'A12', 'TutorSimultaneousEquationsLesson')

console.log(`Lesson 27 (A12) verified: ${states.length} screens, all 16 source questions plus the × 2 and × 3 example, ${rows} board rows balanced at their solutions, ${pairs} pairs of equations solved again, ${choices} choices, ${cases.length} wrong-answer messages, ${steps} steps, 2 videos and the route.`)

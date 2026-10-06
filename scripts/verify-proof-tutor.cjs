// Checks Lesson 28 (Algebra A13, Proof): source coverage, every identity row equal for many values of its letters,
// every angle row balancing at its answer, the counterexamples, the answers, choices, wrong-answer messages, the
// angle pictures staying inside their box, one move a step, greying, the videos and the route.
const { assert, evaluate, close, boardOf, checkRows, randomScopes, checkStructure, checkInteractions, checkWorkings, checkVideos, checkCourse } = require('./board-lesson-checks.cjs')
const { tutorProofLesson: lesson } = require('../src/features/proof/tutor/proofLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

const states = lesson.states
const at = checkStructure(lesson, { id: 'L028', number: 28, code: 'A13', rungs: ['proof-counterexample', 'proof-identity', 'proof-geometric', 'proof-algebraic'], parts: ['Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c'] })

// ---------- Every board row, worked out again ----------
// Angle questions balance at their answer; the triangle proofs for any triangle; everything else is an identity,
// true for every value of its letters.
const triangle = randomScopes(12, scope => { scope.a = Math.abs(scope.a) * 4 + 10; scope.b = Math.abs(scope.b) * 4 + 10; scope.c = 180 - scope.a - scope.b; scope.e = 180 - scope.c; return scope })
const fixed = {
  'A13.3 Q2': { x: 36 }, 'A13.3 Q3': { x: 40 }, 'A13.3 Q4a': { y: 70 }, 'A13.3 Q5b': { e: 100 },
  'A13.3 video + Q1': triangle, 'A13.3 Q5a': triangle,
}
let rows = 0
for (const state of states) {
  const board = boardOf(state)
  if (!board.length) continue
  const scopes = typeof fixed[state.sourceRef] === 'function' ? fixed[state.sourceRef] : fixed[state.sourceRef] ? () => [fixed[state.sourceRef]] : randomScopes()
  // A13.2 Q5c starts with Ella's claim, which is wrong: it must fail for some x, and the rows after it must hold.
  if (state.sourceRef === 'A13.2 Q5c') {
    assert.ok(!close(evaluate(board[0].left, { x: 1 }), evaluate(board[0].right, { x: 1 })), 'A13.2 Q5c: Ella’s identity is wrong')
    rows += checkRows(state.sourceRef, board.slice(1), scopes)
    continue
  }
  rows += checkRows(state.sourceRef, board, scopes)
}
// The worked examples' answers: the source's own.
assert.equal(boardOf(at('A13.1 video + Q1')).at(-1).answer, '9 = 3 × 3: not prime')
assert.equal(boardOf(at('A13.2 video + Q1')).at(-1).answer, '6x + 9 ✓')
assert.equal(boardOf(at('A13.3 video + Q1')).at(-1).answer, 'a + b + c = 180° ✓')
assert.equal(boardOf(at('A13.4 video + Q1')).at(-1).answer, '2n + 1 is odd ✓')

// ---------- Counterexamples ----------
const prime = n => n > 1 && Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }, (_, i) => i + 2).every(d => n % d)
assert.deepEqual([1, 2, 3, 4].map(n => prime(2 * n + 1)), [true, true, true, false], 'Mia: 2n + 1 is prime for n = 1, 2, 3, not for n = 4')
assert.ok(Array.from({ length: 9 }, (_, i) => i + 1).every(n => prime(n * n + n + 11)) && !prime(10 * 10 + 10 + 11), 'A13.1 Q5: n² + n + 11 is prime for n = 1 to 9, not for 10')
assert.ok(1 > -3 && 1 ** 2 < (-3) ** 2, 'A13.1 Q5c: 1 > −3 but 1² < (−3)²')

// ---------- The answers ----------
const identityAnswers = { 'A13.2 Q2': '3(x+2) +2x', 'A13.2 Q3': '4(x−1) −2(x−5)', 'A13.2 Q4a': '(n+4)(n−2)', 'A13.2 Q5a': '(x+2)² −(x−2)²', 'A13.4 Q3': '2n +2m', 'A13.4 Q4a': 'n +(n+1) +(n+2)', 'A13.4 Q5b': '(n+1)² −n²' }
for (const [ref, question] of Object.entries(identityAnswers)) {
  const { interaction } = at(ref)
  assert.equal(interaction.responseShape, 'expression', `${ref} is typed as an expression`)
  for (const scope of randomScopes()()) assert.ok(close(evaluate(question, scope), evaluate(interaction.displayAnswer, scope)), `${ref}: ${interaction.displayAnswer} is the same as ${question}`)
  const terms = interaction.displayAnswer.split(/ (?=[+−] )/)
  if (terms.length > 1 && interaction.acceptanceRule === 'collectedExpression') {
    const swapped = [...terms.slice(1).map(term => term.replace(/^\+ /, '')), terms[0]].join(' + ').replace(/\+ − /g, '− ')
    assert.ok(checkAnswer(interaction, swapped), `${ref} accepts ${swapped} in another order`)
  }
}
assert.ok(checkAnswer(at('A13.3 Q5a').interaction, 'a + b') && checkAnswer(at('A13.3 Q5a').interaction, 'b + a'), 'A13.3 Q5a: e = a + b, either order')
assert.ok(!checkAnswer(at('A13.2 Q2').interaction, '5x + 2'), 'A13.2 Q2 rejects 5x + 2 (the 3 not multiplied in)')
assert.ok(!checkAnswer(at('A13.2 Q3').interaction, '2x - 14'), 'A13.2 Q3 rejects 2x − 14 (−2 × −5 taken as −10)')
const numberAnswers = {
  'A13.2 Q5b': 52 ** 2 - 48 ** 2, 'A13.3 Q2': 180 / 5, 'A13.3 Q3': (180 - 60) / 3, 'A13.3 Q4a': (180 - 40) / 2, 'A13.3 Q5b': 35 + 65, 'A13.4 Q4b': 7 + 8 + 9,
}
for (const [ref, value] of Object.entries(numberAnswers)) {
  const { interaction } = at(ref)
  assert.equal(Number(interaction.correctAnswer), value, `${ref}: should be ${value}`)
  assert.ok(checkAnswer(interaction, String(value)), `${ref} accepts ${value}`)
}
const choices = checkInteractions(states, checkAnswer)

// ---------- Wrong-answer messages ----------
const cases = []
for (const state of states.filter(state => state.diagnose && state.interaction.type === 'numericInput')) {
  const wrong = state.interaction.responseShape === 'expression' ? '7' : String(Number(state.interaction.correctAnswer) + 1)
  assert.ok(!checkAnswer(state.interaction, wrong), `${state.sourceRef}: ${wrong} is marked wrong`)
  cases.push(state.sourceRef)
}

// ---------- The workings ----------
const { steps, pictures } = checkWorkings(states)
// Every angle question draws its own picture, from its first screen.
for (const ref of ['A13.3 video + Q1', 'A13.3 Q2', 'A13.3 Q3', 'A13.3 Q4a', 'A13.3 Q5a', 'A13.3 Q5b', 'A13.3 Q5c']) {
  const first = at(ref).working ?? at(ref).visual
  assert.ok(first.examples[0].steps[0].frame.angles?.before, `${ref}: the picture is on the opening screen`)
}
// The triangle proof draws the parallel line, then each Z of alternate angles, then the straight line: one move a step.
const proof = (at('A13.3 video + Q1').visual ?? at('A13.3 video + Q1').working).examples[0].steps.map(step => step.frame.angles)
assert.ok(proof.some(frame => frame.parallel) && proof.some(frame => frame.zig === 'left') && proof.some(frame => frame.zig === 'right'), 'A13.3: parallel line, then both Zs')

// ---------- Videos, the course ----------
checkVideos(states, 'lesson-28', {
  // Aniksha's A13 files, unchanged (sha256 checked against her folder on 5 Oct), except A13.2: its "Where you see it"
  // scene (wrong sums: x = 2 gives 21, not 32, and 15 isn't prime) is cut out, and the same cards are covered on the
  // title screen. Source: A13.2_Proof_Algebraic_Equivalent.mp4, e9b04131b7e0a08a….
  'counterexample.mp4': '29c494e64adecfc0ede125ae6387c642b43f70a14cd7918839e86c51d3cda71f',
  'identity.mp4': '782e43b4ee0faf39beed98a9aeb0d1340f1cddae3a6a046f274b3d8dce589e7f',
  'geometric.mp4': '88e4d4823bdb0f79f6ffef3ae04e3d59cbcae51e682a7ccd917da9188ccdf05d',
  'algebraic.mp4': 'c2ed723a07890ab232f0c969f04ac1a4c110209a945d8a21224eccb636fad4da',
})
checkCourse(28, 'A13', 'TutorProofLesson')

console.log(`Lesson 28 (A13) verified: ${states.length} screens, all 28 source questions, ${rows} board rows checked (identities at 12 sets of values), ${choices} choices, ${cases.length} typed answers that reject a slip, ${steps} steps, ${pictures} angle pictures inside their box, 4 videos and the route.`)

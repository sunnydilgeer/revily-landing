const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const katex = require('katex')

const root = path.resolve(__dirname, '..')

function loadTypeScriptModule(relativePath) {
  const filename = path.join(root, relativePath)
  const source = fs.readFileSync(filename, 'utf8')
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: filename,
  }).outputText
  const module = { exports: {} }
  const local = request => request.startsWith('.') ? loadTypeScriptModule(path.relative(root, path.resolve(path.dirname(filename), request)) + '.ts') : require(request)
  Function('exports', 'module', 'require', '__filename', '__dirname', output)(module.exports, module, local, filename, path.dirname(filename))
  return module.exports
}

const { checkAnswer } = loadTypeScriptModule('src/features/number-types/lessonMath.ts')
const { operationsVariantCLesson } = loadTypeScriptModule('src/features/order-of-operations/variant-c/variantCLesson.ts')
// Rung 1 is the animated BIDMAS ladder; the tutor storyboard (L2C-01 to L2C-34) follows unchanged.
const [ladder, ...states] = operationsVariantCLesson.states
assert.equal(ladder.id, 'L2C-LADDER', 'Lesson 2 must open with the BIDMAS ladder player')
assert.equal(ladder.visual.kind, 'ladder-player')
assert.equal(ladder.microSkillId, 'bidmas-ladder')
assert.equal(ladder.interaction.type, 'continue', 'The ladder must never block the lesson')
assert.equal(ladder.transition.onComplete, 'L2C-01', 'The ladder must lead into the tutor storyboard')
const videoStates = states.filter(state => state.video)
const videoView = fs.readFileSync(path.join(root, 'src/features/order-of-operations/variant-c/TutorTeachingMedia.tsx'), 'utf8')
assert.ok(!videoView.includes('On-screen captions') && !videoView.includes('<details') && !videoView.includes('aria-describedby'), 'Video panels must omit the removed caption note and walkthrough UI')
const lessonView = fs.readFileSync(path.join(root, 'src/features/order-of-operations/variant-c/VariantCLessonView.tsx'), 'utf8')
assert.ok(lessonView.includes('teaching && !state.video && state.content.body'), 'Video-backed Lesson 2 screens must omit the removed supporting body copy')
assert.deepEqual(videoStates.map(state => state.id), ['L2C-02', 'L2C-16', 'L2C-25'], 'Each BIDMAS clip must appear at its matching topic demonstration')
for (const state of videoStates) {
  assert.equal(state.interaction.type, 'continue', 'Videos must not interfere with answer submission')
  assert.equal(state.visual.kind, 'board', 'Video clips come with their board working')
  assert.ok(state.video.durationSeconds > 0 && state.video.durationSeconds < 60)
  assert.ok(state.video.textAlternative.length >= 5, 'Silent videos need a complete written alternative')
  for (const asset of [state.video.src, state.video.poster]) {
    assert.ok(asset.startsWith('/media/lesson-2/'), 'Video assets must be lesson-scoped')
    assert.ok(fs.statSync(path.join(root, 'public', asset)).size > 0, 'Every authored media URL must have a real asset')
  }
  assert.ok(!state.video.sourceFile.includes('2026-09-12'), 'The integers clip does not belong in BIDMAS')
}

assert.equal(states.length, 34, 'Variant C should contain 34 storyboarded screens')
assert.equal(new Set(states.map(state => state.id)).size, states.length, 'Every state ID must be unique')
// Every worked example and answer is a board, one move a step (opsBoard.ts): each row equals the one before it (letters
// are checked by substituting values), each step boxes a part of the row above, and the answer appears once, at the end.
const { plainRow } = loadTypeScriptModule('src/features/order-of-operations/variant-c/opsBoard.ts')
const letters = { x: 2, y: 3, a: 5, b: 7, p: 11, q: 13, m: 17, n: 19, c: 23, d: 29 }
function evaluate(row) {
  let js = plainRow(row).split(' | ').map(side => `(${side})`).join('/')
  js = js.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
  js = js.replace(/(\d|[a-z]|\)|²|³)(?=[a-z(])/g, '$1*').replace(/²/g, '**2').replace(/³/g, '**3')
  js = js.replace(/[a-z]/g, letter => `(${letters[letter]})`)
  return Function(`return ${js}`)()
}
const toRow = answer => String(answer).replace(/\^2/g, '²').replace(/^n\s*=\s*/, '')
assert.equal(states[1].visual.kind, 'board')
let boards = 0, moves = 0
for (const state of states) {
  const working = state.visual.kind === 'board' ? state.visual : state.working
  if (state.visual.kind === 'expression') assert.ok(state.working, state.id + ': every answer has a board working')
  if (!working) continue
  boards++
  let row = working.start, value = evaluate(row)
  working.steps.forEach((step, i) => {
    moves++
    assert.ok(step.title.split(' ').length <= 4, state.id + ': short heading ' + step.title)
    assert.ok(!/[=×÷²]|\d\s*[+−]\s*\d/.test(step.instruction), state.id + ': the ⓘ is words ' + step.instruction)
    if (step.fresh) { row = step.mark; value = evaluate(row); return }
    assert.equal(plainRow(step.mark), row, state.id + ' step ' + (i + 1) + ': the box marks the row above')
    assert.equal((step.mark.match(/\[/g) ?? []).length, 1, state.id + ': one part is boxed, one move a step')
    for (const note of step.notes ?? []) {
      const [left, right] = note.split(' → ')
      assert.ok(Math.abs(evaluate(left) - evaluate(right)) < 1e-9, state.id + ': ' + note)
    }
    assert.ok(Math.abs(evaluate(step.next) - value) < 1e-9 * Math.max(1, Math.abs(value)), `${state.id} step ${i + 1}: ${plainRow(step.next)} equals ${row}`)
    row = plainRow(step.next)
  })
  const answer = state.interaction.correctAnswer
  if (state.interaction.type === 'numericInput') assert.ok(Math.abs(evaluate(row) - evaluate(toRow(answer))) < 1e-9, state.id + ': the board ends on the answer')
}
assert.equal(boards, 31)
const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8')
assert.ok(!app.includes('operationsVariant'), 'Lesson 2 must not have a variant selector')
assert.ok(!app.includes('OperationsVariantBLesson') && !app.includes('OrderOfOperationsLesson'), 'Retired Lesson 2 paths must not be rendered')
assert.ok(app.includes('case 2:') && app.includes('return <OperationsVariantCLesson />'), 'Lesson 2 must open the tutor-backed lesson directly')
assert.deepEqual(states.map(state => state.id), Array.from({ length: 34 }, (_, index) => `L2C-${String(index + 1).padStart(2, '0')}`))

states.forEach((state, index) => {
  assert.ok(state.sourceRef, `${state.id} must record its source`)
  const expectedNext = states[index + 1]?.id
  assert.equal(state.transition.onComplete, expectedNext, `${state.id} must route to the next storyboard state`)
})

const questions = states.filter(state => state.interaction.type !== 'continue')
assert.equal(questions.length, 23, 'Variant C should contain 21 tutor questions plus two retained equal-priority checks')

for (const state of questions) {
  assert.equal(state.visual.kind, 'expression', `${state.id} must put the expression and optional BIDMAS hint first`)
  assert.ok(state.feedback?.correct.workedExplanation, `${state.id} needs complete correct feedback`)
  assert.ok(state.feedback?.incorrect.workedExplanation, `${state.id} needs complete incorrect feedback`)
  assert.deepEqual(state.feedback.correct.workedExplanation, state.feedback.incorrect.workedExplanation, `${state.id} must reveal the same working on both paths`)

  const interaction = state.interaction
  const correctResponse = interaction.type === 'select' ? interaction.correctAnswer : interaction.correctAnswer
  assert.equal(checkAnswer(interaction, correctResponse), true, `${state.id} must accept its authored answer`)

  if (interaction.type === 'select') {
    const incorrect = interaction.options.find(option => option.id !== interaction.correctAnswer)
    assert.ok(incorrect, `${state.id} needs a representative incorrect option`)
    assert.equal(checkAnswer(interaction, incorrect.id), false, `${state.id} must reject an incorrect option`)
  } else if (interaction.acceptanceRule === 'numeric') {
    assert.equal(checkAnswer(interaction, Number(interaction.correctAnswer) + 1), false, `${state.id} must reject a wrong number`)
  } else if (interaction.acceptanceRule === 'normalisedAlgebra') {
    assert.equal(checkAnswer(interaction, '999z'), false, `${state.id} must reject a wrong algebraic monomial`)
  }
}

const algebraCases = [
  ['10x^2', ['10x²', '10 x ^ 2', '10*x*x']],
  ['7pq^2', ['7pq²', '7q^2p', '7 × p × q × q']],
  ['22mn', ['22mn', '22nm', '22 × m × n']],
  ['17c^2d', ['17c²d', '17dc^2', '17 × c × c × d']],
]
for (const [expected, accepted] of algebraCases) {
  const interaction = { type: 'numericInput', correctAnswer: expected, acceptanceRule: 'normalisedAlgebra' }
  accepted.forEach(response => assert.equal(checkAnswer(interaction, response), true, `${response} should be accepted as ${expected}`))
}

for (const source of ['N2.1 Q2', 'N2.1 Q5c', 'N2.2 Q2', 'N2.2 Q5c', 'N2.3 Q2', 'N2.3 Q5c']) {
  assert.ok(states.some(state => state.sourceRef.includes(source)), `Source coverage missing: ${source}`)
}
assert.equal(states.filter(state => state.sourceRef.startsWith('Video')).length, 3, 'All three tutor videos need a replayable screen')

console.log('Verified Lesson 2: ' + states.length + ' screens, ' + questions.length + ' questions, ' + boards + ' board workings, ' + moves + ' checked moves, sole tutor-backed route.')

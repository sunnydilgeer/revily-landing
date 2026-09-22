const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const katex = require('katex')
const root = path.resolve(__dirname, '..')
function load(relative) {
  const filename = path.join(root, relative)
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, fileName: filename }).outputText
  const module = { exports: {} }
  Function('exports', 'module', 'require', output)(module.exports, module, require)
  return module.exports
}
const { checkAnswer } = load('src/features/number-types/lessonMath.ts')
const { tutorPlaceValueLesson: lesson } = load('src/features/place-value/tutor/placeValueLesson.ts')
const states = lesson.states
assert.equal(states.length, 23)
assert.equal(new Set(states.map(s => s.id)).size, states.length)
for (const [i, s] of states.entries()) {
  assert.equal(s.id, `L3-${String(i + 1).padStart(2, '0')}`)
  assert.equal(s.transition.onComplete, states[i + 1]?.id)
  assert.ok(s.sourceRef)
}
const expected = {
  'N3.1 Q2': 300, 'N3.1 Q3': '0', 'N3.1 Q4a': 40602, 'N3.1 Q4b': 600,
  'N3.1 Q5a': 800030, 'N3.1 Q5b': 800000, 'N3.1 Q5c': '0',
  'N3.2 Q2': .07, 'N3.2 Q3': .005, 'N3.2 Q4a': .0007, 'N3.2 Q4b': '0',
  'N3.2 Q5a': .0069, 'N3.2 Q5b': .0009, 'N3.2 Q5c': '0',
}
const questions = states.filter(s => s.interaction.type !== 'continue')
assert.equal(questions.length, 14)
for (const [source, answer] of Object.entries(expected)) {
  const matches = questions.filter(s => s.sourceRef.startsWith(source))
  assert.equal(matches.length, 1, source + ' must appear once as practice')
  const s = matches[0], rule = s.interaction
  assert.equal(rule.correctAnswer, answer, source + ' authored answer')
  assert.ok(s.hints?.length)
  assert.ok(s.feedback.correct.workedExplanation.steps.length >= 2)
  assert.deepEqual(s.feedback.correct.workedExplanation, s.feedback.incorrect.workedExplanation)
  const response = rule.acceptanceRule === 'fraction' ? '5/1000' : answer
  assert.equal(checkAnswer(rule, response), true, source + ' authored answer accepted')
  const wrong = rule.type === 'select' ? rule.options.find(o => o.id !== answer).id : Number(answer) * 10
  assert.equal(checkAnswer(rule, wrong), false, source + ' wrong answer rejected')
}
const fraction = questions.find(s => s.interaction.acceptanceRule === 'fraction').interaction
for (const response of ['5/1000', '1/200', '10 / 2000', ' 5 / 1000 ']) assert.equal(checkAnswer(fraction, response), true, response)
for (const response of ['0.005', '5/100', '5/10000', '5/0', '1/201', '5//1000', '5/1000x', '', '1e0/200']) assert.equal(checkAnswer(fraction, response), false, response)
for (const source of ['N3.1 Q1', 'N3.2 Q1']) assert.ok(states.some(s => s.sourceRef.startsWith(source)))
for (const s of questions.filter(s => s.interaction.acceptanceRule === 'normalisedNumber')) {
  assert.equal(checkAnswer(s.interaction, s.interaction.displayAnswer), true)
  assert.equal(checkAnswer(s.interaction, `${s.interaction.correctAnswer}0`), Number(`${s.interaction.correctAnswer}0`) === s.interaction.correctAnswer)
}
// Independent calculations catch column and ratio mistakes rather than mirroring content helpers.
assert.equal(8 * 100000 / (4 * 10), 20000)
assert.equal((7 * 1e-4) / (4 * 1e-5), 17.5)
assert.equal(4 * 10000 + 6 * 100 + 2, 40602)
assert.equal(8 * 100000 + 3 * 10, 800030)
assert.equal((6 * 10 + 9) / 10000, .0069)
const corrected = questions.find(s => s.sourceRef.startsWith('N3.2 Q4b'))
assert.ok(corrected.feedback.correct.workedExplanation.answer.includes('17.5'))
const videos = states.filter(s => s.video)
assert.deepEqual(videos.map(s => s.id), ['L3-02', 'L3-14'])
assert.deepEqual(videos.map(s => s.visual.value), ['526,908', '0.6059'])
for (const s of videos) {
  assert.equal(s.interaction.type, 'continue')
  assert.equal(s.visual.kind, 'cumulative')
  assert.equal(s.visual.calculation.additionalExamples.length, 1)
  for (const asset of [s.video.src, s.video.poster]) assert.ok(fs.statSync(path.join(root, 'public', asset)).size > 1000)
  assert.ok(s.video.textAlternative.length >= 3)
}
function removeUnderlines(math) {
  return math.replace(/\\underline\{((?:[^{}]|\{[^{}]*\})*)\}/g, '$1')
}
let calculations = 0, transitions = 0
for (const s of states.filter(s => s.visual.kind === 'cumulative')) {
  for (const calculation of [s.visual.calculation, ...(s.visual.calculation.additionalExamples ?? [])]) {
    calculations++
    let previous = calculation.math
    katex.renderToString(previous, { throwOnError: true })
    for (const step of calculation.steps) {
      transitions++
      assert.equal(removeUnderlines(step.previousMath), previous, s.id + ' must preserve the expression while underlining')
      assert.ok(step.previousMath.includes('\\underline'))
      assert.ok(!step.math.includes('='))
      for (const math of [step.previousMath, step.math]) katex.renderToString(math, { throwOnError: true })
      previous = step.math
    }
  }
}
const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8')
assert.ok(!app.includes('placeValueVariant'))
assert.ok(app.includes('case 3:') && app.includes('return <TutorPlaceValueLesson />'))
console.log(`Verified Lesson 3: ${states.length} reachable screens, ${questions.length} source practice parts, ${videos.length} matching videos, ${calculations} cumulative calculations, ${transitions} underlined transitions.`)

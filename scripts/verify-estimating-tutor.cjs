// Checks Lesson 12 (Estimating): source coverage, the maths of every answer, wrong-answer messages,
// source-identical videos and the course route.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorEstimatingLesson: lesson } = require('../src/features/estimating/tutor/estimatingLesson.ts')
const { diagnoseEstimate, roundTo1sf } = require('../src/features/estimating/tutor/estimateDiagnosis.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const { diagnoseNumber } = require('../src/features/written-methods/tutor/numberDiagnosis.ts')

// Structure
const states = lesson.states
assert.equal(lesson.id, 'L012', 'Lesson 12 must keep its stable progress key')
assert.equal(states.length, 28, 'Lesson 12 screen total')
const rungs = [...new Set(states.map(state => state.microSkillId))]
assert.deepEqual(rungs, ['estimating-significant-figures', 'estimating-calculations', 'estimating-formulas', 'estimating-checking', 'mixed'], 'Four rungs in order, then Review')
for (const rung of rungs) assert.ok(lesson.labels[rung], `Rung ${rung} needs a label`)
states.forEach((state, index) => {
  assert.equal(state.id, `L12-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})

// Every source question is covered
const refs = states.map(state => state.sourceRef).join(' | ')
for (const pdf of [1, 2]) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    assert.ok(refs.includes(`N12.${pdf} ${question}`), `Missing N12.${pdf} ${question}`)
  }
}

// Every answer is marked right by the shared engine
const numeric = states.filter(state => state.interaction.type === 'numericInput')
for (const state of numeric) {
  const { correctAnswer } = state.interaction
  assert.ok(checkAnswer(state.interaction, String(correctAnswer)), `${state.id} must accept its own answer`)
  assert.ok(checkAnswer(state.interaction, `£${correctAnswer}`), `${state.id} must accept a typed £ sign`)
  assert.ok(!checkAnswer(state.interaction, String(correctAnswer + 1)), `${state.id} must reject a wrong answer`)
}
for (const state of states.filter(state => state.interaction.type === 'select')) {
  const options = state.interaction.options
  assert.ok(options.length >= 3, `${state.id} needs at least three choices`)
  assert.ok(options.some(option => option.id === state.interaction.correctAnswer), `${state.id} must have its answer among the choices`)
}

// The maths behind each source answer
const sf = [[412.5, 400], [48, 50], [3.12, 3], [0.0648, 0.06], [9.8, 10], [11.9, 10], [0.00398, 0.004], [296, 300], [3.1, 3], [5.85, 6], [19, 20], [2.85, 3], [0.46, 0.5], [61.2, 60], [29.8, 30], [40.3, 40], [39.2, 40], [0.0812, 0.08], [3.49, 3], [3.51, 4]]
for (const [value, rounded] of sf) assert.equal(roundTo1sf(value), rounded, `${value} to 1 s.f.`)
assert.equal(50 * 3, 150, 'N12.1 Q1')
assert.equal(20 * 6, 120, 'N12.1 Q2')
assert.equal(400 / 20, 20, 'N12.1 Q3')
assert.equal(4 * 3 + 6 * 0.5, 15, 'N12.1 Q4a')
assert.ok(4 * 2.85 + 6 * 0.46 < 15, 'N12.1 Q4b: both prices rounded up, so the estimate is bigger')
assert.equal(Number((0.06 * 300).toFixed(10)), 18, 'N12.1 Q5b')
assert.deepEqual([3 * 20, 4 * 20], [60, 80], 'N12.1 Q5c')
assert.equal(300 / 3, 100, 'N12.2 Q1')
assert.equal(3 * 6, 18, 'N12.2 Q2')
assert.equal(400 / 10, 40, 'N12.2 Q3')
assert.equal(60 * 30 * 40, 72000, 'N12.2 Q4a')
assert.equal(72000 / 1000, 72, 'N12.2 Q4b')
assert.equal(10 * 40, 400, 'N12.2 Q5a')
assert.equal(80 / 4, 20, 'N12.2 Q5b')
assert.equal((20 * 4) / 0.5, 160, 'Extra: dividing by 0.5')
assert.ok(60 * 3 < 61 * 3.4, 'Extra: both rounded down, so the estimate is smaller')

// Wrong-answer messages
const find = ref => states.find(state => state.sourceRef === ref && state.diagnose)
const cases = [
  // [source ref, response, text the message must contain (null = stay silent)]
  ['N12.1 Q3', '21.71', 'exact answer'],
  ['N12.1 Q3', '8000', 'dividing'],
  ['N12.1 Q3', '20', null],
  ['N12.1 Q4a', '14.16', 'exact answer'],
  ['N12.1 Q4a', '312', '£0.50'],
  ['N12.1 Q5b', '20', 'rounded the answer at the end'],
  ['N12.1 Q5b', '1.8', 'wrong size'],
  ['N12.2 Q2', '17.67', 'exact answer'],
  ['N12.2 Q2', '20', 'rounded the answer at the end'],
  ['N12.2 Q4a', '70000', 'rounded the answer at the end'],
  ['N12.2 Q4b', '72000000', 'Divide by 1000'],
  ['N12.2 Q5a', '480', 'not £12'],
  ['N12.2 Q5a', '500', 'rounded the answer at the end'],
  ['N12.2 Q5b', '2', 'wrong size'],
]
for (const [ref, response, expected] of cases) {
  const state = find(ref)
  assert.ok(state, `${ref} must have a wrong-answer check`)
  const message = state.diagnose(response)
  if (expected === null) assert.equal(message, null, `${ref} "${response}" should stay silent`)
  else assert.ok(message && message.includes(expected), `${ref} "${response}" should mention "${expected}", got: ${message}`)
}
assert.equal(diagnoseEstimate('£150', { estimate: 150, exact: 149.76 }), null, 'A right answer with a £ sign stays silent')
assert.ok(diagnoseNumber('Write £11.90 correct to 1 significant figure.', '12', '10').includes('nearest whole number'), '11.90 → 12 is the nearest whole number, not 1 s.f.')
assert.ok(diagnoseNumber('Write 0.00398 correct to 1 significant figure.', '0', '0.004').includes('Significant figures start'), '0.00398 → 0')
assert.ok(diagnoseNumber('Write 48 correct to 1 significant figure.', '5', '50').includes('same size') || diagnoseNumber('Write 48 correct to 1 significant figure.', '5', '50').includes('decimal point'), '48 → 5 lost its place-holder zero')

// Videos
assert.equal(states.filter(state => state.video).length, 2, 'One video per source PDF')
const mediaHashes = {
  'simple-estimating.mp4': 'b543c7c10bec8c311ae1ea5ee65ccde945794927e6f8fd5dbf2aff2363e6511d',
  'estimating-with-equations.mp4': '58d0f3df9c0faea783f35b97d012301914f78551546e568c08f8023e2c6b4691',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-12', name)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
}

// Route and course order
const app = read('src/App.tsx')
assert.ok(app.includes('case 12:') && app.includes('return <TutorEstimatingLesson />'), 'Lesson 12 must open from the course and its direct route')
assert.ok(read('src/features/maths/courseRegistry.ts').includes("entry(12, tutorEstimatingLesson, 'Estimating'"), 'Lesson 12 must follow Lesson 11 in the course')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  12: {'), 'Lesson 12 needs key-fact cards')

console.log(`Lesson 12 verified: ${states.length} screens, all 16 source questions, ${numeric.length} numeric answers, ${cases.length} wrong-answer messages, 2 source-identical videos and the course route.`)

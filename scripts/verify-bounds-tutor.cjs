// Checks Lesson 13 (Bounds and truncation): source coverage, the maths of every answer,
// wrong-answer messages, source-identical videos and the course route.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorBoundsLesson: lesson } = require('../src/features/bounds/tutor/boundsLesson.ts')
const { diagnoseBound, diagnoseCut, expectedBound } = require('../src/features/bounds/tutor/boundsDiagnosis.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

const tidy = n => Number(n.toPrecision(12))
const truncateTo = (n, places) => tidy(Math.trunc(tidy(n * 10 ** places)) / 10 ** places)
const roundTo = (n, places) => tidy(Math.round(tidy(n * 10 ** places)) / 10 ** places)

// Structure
const states = lesson.states
assert.equal(lesson.id, 'L013', 'Lesson 13 must keep its stable progress key')
assert.equal(states.length, 35, 'Lesson 13 screen total')
const rungs = [...new Set(states.map(state => state.microSkillId))]
assert.deepEqual(rungs, ['bounds-half-unit', 'bounds-lower-upper', 'bounds-error-interval', 'truncation', 'truncation-error-interval', 'mixed'], 'Five rungs in order, then Review')
for (const rung of rungs) assert.ok(lesson.labels[rung], `Rung ${rung} needs a label`)
states.forEach((state, index) => {
  assert.equal(state.id, `L13-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})

// Every source question is covered
const refs = states.map(state => state.sourceRef).join(' | ')
for (const pdf of [1, 2]) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    assert.ok(refs.includes(`N13.${pdf} ${question}`), `Missing N13.${pdf} ${question}`)
  }
}

// The right answer is not always in the same place
const positions = states.filter(state => state.interaction.type === 'select').map(state => state.interaction.correctAnswer)
assert.ok(new Set(positions).size >= 3, 'Right answers must be spread across positions')

// Every numeric answer is accepted by the shared engine and matches its bound or cut
const numeric = states.filter(state => state.interaction.type === 'numericInput')
for (const state of numeric) {
  const { correctAnswer } = state.interaction
  assert.ok(checkAnswer(state.interaction, String(correctAnswer)), `${state.id} must accept its own answer`)
  assert.ok(!checkAnswer(state.interaction, String(tidy(correctAnswer + 0.001))), `${state.id} must reject a near miss`)
  assert.ok(state.diagnose, `${state.id} needs a wrong-answer check`)
  assert.equal(state.diagnose(String(correctAnswer)), null, `${state.id} stays silent on the right answer`)
}

// Every error-interval choice: the right option matches the bounds worked out from the question
const intervalOf = option => option.match(/^([\d.]+) ≤ [a-z] < ([\d.]+)$/)?.slice(1).map(Number)
for (const state of states.filter(state => state.interaction.type === 'select')) {
  const { options, correctAnswer } = state.interaction
  assert.ok(options.length >= 3, `${state.id} needs at least three choices`)
  assert.equal(new Set(options.map(option => option.label)).size, options.length, `${state.id} choices must differ`)
  assert.ok(options.some(option => option.id === correctAnswer), `${state.id} must have its answer among the choices`)
}
const intervals = [
  // [title fragment, value, unit, truncated]
  ['A jar holds 250 ml', 250, 10, false],
  ['A crowd was 2400', 2400, 100, false],
  ['A bag weighs 3.6 kg', 3.6, 0.1, false],
  ['A sprinter’s time is 12.34 s, correct to 2 decimal places. Which', 12.34, 0.01, false],
  ['A pipe is 2.35 m long, truncated to 2 decimal places. Which', 2.35, 0.01, true],
  ['A time is 14.2 s', 14.2, 0.1, true],
]
for (const [fragment, value, unit, truncated] of intervals) {
  const state = states.find(state => state.content.title.startsWith(fragment) && state.interaction.type === 'select')
  assert.ok(state, `Missing interval question: ${fragment}`)
  const [lower, upper] = intervalOf(state.interaction.options.find(option => option.id === state.interaction.correctAnswer).label)
  assert.equal(lower, expectedBound({ value, unit, side: 'lower', truncated }), `${fragment} lower bound`)
  assert.equal(upper, expectedBound({ value, unit, side: 'upper', truncated }), `${fragment} upper bound`)
}

// The maths behind each source answer
assert.deepEqual([tidy(8.4 - 0.05), tidy(8.4 + 0.05)], [8.35, 8.45], 'N13.1 Q1')
assert.equal(6 - 0.5, 5.5, 'N13.1 Q2')
assert.deepEqual([250 - 5, 250 + 5], [245, 255], 'N13.1 Q3')
assert.deepEqual([2400 - 50, 2400 + 50], [2350, 2450], 'N13.1 Q4a')
assert.equal(Math.round(2450 / 100) * 100, 2500, 'N13.1 Q4b: 2450 rounds up to 2500')
assert.deepEqual([tidy(12.34 - 0.005), tidy(12.34 + 0.005)], [12.335, 12.345], 'N13.1 Q5a')
assert.ok(12.34 >= 12.25 && 12.34 < 12.35 && 12.34 >= 12.335 && 12.34 < 12.345, 'N13.1 Q5b: 12.34 is in both intervals')
assert.equal(roundTo(12.345, 2), 12.35, 'N13.1 Q5c')
assert.equal(truncateTo(7.396, 2), 7.39, 'N13.2 Q1')
assert.equal(truncateTo(15.87, 1), 15.8, 'N13.2 Q2')
assert.deepEqual([truncateTo(5.678, 2), roundTo(5.678, 2)], [5.67, 5.68], 'N13.2 Q4a')
assert.equal(truncateTo(2.359, 2), 2.35, 'N13.2 Q5b')
assert.equal(truncateTo(2.347, 2), 2.34, 'N13.2 Q5c: 2.347 is in Zara’s interval but truncates to 2.34')
assert.ok(2.347 >= 2.345 && 2.347 < 2.355, 'N13.2 Q5c: 2.347 is in Zara’s interval')
assert.deepEqual([truncateTo(3.14159, 3), truncateTo(9.99, 1)], [3.141, 9.9], 'Extra truncations')

// Wrong-answer messages
const cases = [
  // [check, response, text the message must contain (null = stay silent)]
  [{ value: 8.4, unit: 0.1, side: 'half' }, '0.1', 'whole unit'],
  [{ value: 8.4, unit: 0.1, side: 'half' }, '0.05', null],
  [{ value: 250, unit: 10, side: 'lower' }, '240', 'whole unit'],
  [{ value: 250, unit: 10, side: 'lower' }, '255', 'upper bound'],
  [{ value: 250, unit: 10, side: 'lower' }, '250', 'rounded value itself'],
  [{ value: 12.34, unit: 0.01, side: 'upper' }, '12.35', 'whole unit'],
  [{ value: 12.34, unit: 0.01, side: 'upper' }, '12.345', null],
  [{ value: 2.35, unit: 0.01, side: 'upper', truncated: true }, '2.355', 'for rounding'],
  [{ value: 2.35, unit: 0.01, side: 'upper', truncated: true }, '2.35', 'lower bound'],
]
for (const [check, response, expected] of cases) {
  const message = diagnoseBound(response, check)
  if (expected === null) assert.equal(message, null, `${JSON.stringify(check)} "${response}" should stay silent`)
  else assert.ok(message && message.includes(expected), `${JSON.stringify(check)} "${response}" should mention "${expected}", got: ${message}`)
}
assert.ok(diagnoseCut('15.9', { original: 15.87, places: 1, mode: 'truncate' }).includes('That’s rounding'), 'Rounding instead of truncating')
assert.ok(diagnoseCut('5.67', { original: 5.678, places: 2, mode: 'round' }).includes('That’s truncating'), 'Truncating instead of rounding')
assert.ok(diagnoseCut('10', { original: 9.99, places: 1, mode: 'truncate' }).includes('That’s rounding'), '9.99 is not rounded up to 10')
assert.ok(diagnoseCut('3.14', { original: 3.14159, places: 3, mode: 'truncate' }).includes('Keep exactly 3'), 'Wrong number of decimal places')

// Videos
assert.equal(states.filter(state => state.video).length, 2, 'One video per source PDF')
const mediaHashes = {
  'upper-and-lower-bounds.mp4': '33026b9b7b19719eb30ee17105fd18735422cd120a0997ebc262ca82edc60417',
  'truncation.mp4': 'd72d2bc851a76a090f5836d3d5686c6e30c1361ed37b9d0820eb7f0b3f33f6bf',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-13', name)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
}

// Route and course order
const app = read('src/App.tsx')
assert.ok(app.includes('case 13:') && app.includes('return <TutorBoundsLesson />'), 'Lesson 13 must open from the course and its direct route')
assert.ok(read('src/features/maths/courseRegistry.ts').includes("entry(13, tutorBoundsLesson, 'Bounds and truncation'"), 'Lesson 13 must follow Lesson 12 in the course')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  13: {'), 'Lesson 13 needs key-fact cards')

console.log(`Lesson 13 verified: ${states.length} screens, all 16 source questions, ${numeric.length} numeric answers, ${intervals.length} error-interval choices, ${cases.length + 4} wrong-answer messages, 2 source-identical videos and the course route.`)

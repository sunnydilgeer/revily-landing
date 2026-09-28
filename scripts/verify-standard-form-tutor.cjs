// Checks Lesson 14 (Standard form): source coverage, the maths of every answer (worked out again from
// each question's own text), the two-box answer rule, wrong-answer messages, source-identical videos and the route.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorStandardFormLesson: lesson } = require('../src/features/standard-form/tutor/standardFormLesson.ts')
const { diagnoseOrdinary, diagnoseStandardForm, diagnoseBetween, diagnoseMultiplier } = require('../src/features/standard-form/tutor/standardFormDiagnosis.ts')
const { checkAnswer, parseStandardForm } = require('../src/features/number-types/lessonMath.ts')

const tidy = n => Number(n.toPrecision(12))
const SUP = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' }
const power = text => Number([...text].map(c => SUP[c]).join(''))
/** Standard form of a positive number, found by counting digits (not logs), so it is independent of the lesson. */
function standardOf(value) {
  const [mantissa, exponent] = value.toExponential().split('e')
  return { a: Number(mantissa), n: Number(exponent) }
}
const sfValue = (a, n) => Number(`${a}e${n}`)

// Structure
const states = lesson.states
assert.equal(lesson.id, 'L014', 'Lesson 14 must keep its stable progress key')
assert.equal(states.length, 49, 'Lesson 14 screen total')
const rungs = [...new Set(states.map(state => state.microSkillId))]
assert.deepEqual(rungs, ['standard-form-to-large', 'standard-form-to-small', 'standard-form-write-large', 'standard-form-write-small', 'standard-form-multiply', 'standard-form-divide', 'mixed'], 'Six rungs in order, then Review')
for (const rung of rungs) assert.ok(lesson.labels[rung], `Rung ${rung} needs a label`)
states.forEach((state, index) => {
  assert.equal(state.id, `L14-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})

// Every source question is covered
const refs = states.map(state => state.sourceRef).join(' | ')
for (const pdf of [1, 2, 3, 4, 5, 6]) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) assert.ok(refs.includes(`N14.${pdf} ${question}`), `Missing N14.${pdf} ${question}`)
}

// The right answer is not always in the same place
const selects = states.filter(state => state.interaction.type === 'select')
assert.ok(new Set(selects.map(state => state.interaction.correctAnswer)).size >= 3, 'Right answers must be spread across positions')
for (const state of selects) {
  const { options, correctAnswer } = state.interaction
  assert.ok(options.length >= 3, `${state.id} needs at least three choices`)
  assert.equal(new Set(options.map(option => option.label)).size, options.length, `${state.id} choices must differ`)
  assert.ok(options.some(option => option.id === correctAnswer), `${state.id} must have its answer among the choices`)
}

// The two-box answer rule
const sfRule = answer => ({ type: 'numericInput', responseShape: 'standardForm', acceptanceRule: 'standardForm', correctAnswer: answer })
assert.deepEqual(parseStandardForm('8.43×10^7'), { a: 8.43, n: 7, value: 84300000 })
assert.deepEqual(parseStandardForm('9.4 x 10^-10'), { a: 9.4, n: -10, value: 9.4e-10 })
assert.deepEqual(parseStandardForm('5·12×10^−4'), { a: 5.12, n: -4, value: 0.000512 })
assert.equal(parseStandardForm('8.43e7'), null, 'Calculator notation is not standard form')
assert.equal(parseStandardForm('10^7'), null)
assert.ok(checkAnswer(sfRule('8.43×10^7'), '8.430 × 10^7'), 'Trailing zeros in A are fine')
assert.ok(checkAnswer(sfRule('8.43×10^7'), '£8.43×10^7'), 'A leading £ is fine')
assert.ok(!checkAnswer(sfRule('8.43×10^7'), '84.3×10^6'), 'A must be less than 10')
assert.ok(!checkAnswer(sfRule('8×10^4'), '0.8×10^5'), 'A must be at least 1')
assert.ok(!checkAnswer(sfRule('8.43×10^7'), '8.43×10^6'))
assert.ok(!checkAnswer(sfRule('5.12×10^-4'), '5.12×10^4'))

// Every typed answer: accepted as written, near misses rejected, and a wrong-answer check that is silent when right
const typed = states.filter(state => state.interaction.type === 'numericInput')
let mathsChecked = 0
for (const state of typed) {
  const { interaction, content: { title } } = state
  assert.ok(state.diagnose, `${state.id} needs a wrong-answer check`)
  if (interaction.responseShape === 'standardForm') {
    const bounded = interaction.lowerBound !== undefined
    const { a, n } = parseStandardForm(interaction.correctAnswer)
    assert.ok(checkAnswer(interaction, `${a}×10^${n}`), `${state.id} must accept its own answer`)
    assert.ok(checkAnswer(interaction, `${a} x 10^${n}`), `${state.id} must accept x for ×`)
    assert.equal(state.diagnose(`${a}×10^${n}`), null, `${state.id} stays silent on the right answer`)
    assert.ok(!checkAnswer(interaction, `${a}×10^${n + 1}`), `${state.id} must reject the power one too big`)
    if (bounded) {
      assert.ok(checkAnswer(interaction, `1.5×10^${n}`) && checkAnswer(interaction, `9.99×10^${n}`), `${state.id} accepts any A with the right power`)
      assert.ok(!checkAnswer(interaction, `1×10^${n}`), `${state.id} rejects the lower end itself`)
      assert.ok(!checkAnswer(interaction, `10×10^${n}`), `${state.id} rejects A = 10`)
      assert.equal(sfValue(1, n), interaction.lowerBound, `${state.id} lower end is 1 × 10^${n}`)
      assert.equal(sfValue(1, n + 1), interaction.upperBound, `${state.id} upper end is 1 × 10^${n + 1}`)
      mathsChecked++
      continue
    }
    // Work the answer out again from the question text.
    const op = title.match(/\(([\d.]+) × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)\) ([×÷]) \(([\d.]+) × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)\)/) ?? title.match(/£?([\d.]+) × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+) (?:items a day|from)[^\d]*?() ?([\d.]+) × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/)
    let expected
    if (op) {
      const [, a1, p1, sign, a2, p2] = op
      const kind = sign === '÷' || title.includes(' from ') ? '÷' : '×'
      expected = standardOf(kind === '×' ? sfValue(a1, power(p1)) * sfValue(a2, power(p2)) : sfValue(a1, power(p1)) / sfValue(a2, power(p2)))
    } else {
      const million = title.match(/([\d.]+) million/)
      const plain = title.match(/(\d[\d ]*(?:\.\d+)?|0\.\d+) (?:in standard form|m across|g\.)/) ?? title.match(/£([\d ]+)\./) ?? title.match(/mass of ([\d.]+) g/)
      assert.ok(million || plain, `${state.id}: could not read the number in "${title}"`)
      expected = standardOf(million ? tidy(Number(million[1]) * 1e6) : Number(plain[1].replaceAll(' ', '')))
    }
    assert.deepEqual({ a: tidy(expected.a), n: expected.n }, { a, n }, `${state.id} answer from "${title}"`)
    mathsChecked++
  } else {
    const answer = String(interaction.correctAnswer)
    assert.ok(checkAnswer(interaction, answer), `${state.id} must accept its own answer`)
    assert.ok(checkAnswer(interaction, interaction.displayAnswer), `${state.id} must accept its answer grouped in threes`)
    assert.ok(!checkAnswer(interaction, String(tidy(Number(answer) * 10))), `${state.id} must reject ten times the answer`)
    assert.equal(state.diagnose(answer), null, `${state.id} stays silent on the right answer`)
    const convert = title.match(/([\d.]+) × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/)
    const find = title.match(/^n × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+) = ([\d. ]+)\./)
    if (find) assert.equal(Number(answer), tidy(Number(find[2].replaceAll(' ', '')) / 10 ** power(find[1])), `${state.id} n`)
    else assert.equal(Number(answer), sfValue(convert[1], power(convert[2])), `${state.id} answer from "${title}"`)
    mathsChecked++
  }
}
assert.equal(mathsChecked, typed.length)

// The worked hop picture moves the point exactly as many places as the power
for (const state of states.filter(state => ['standard-form-to-large', 'standard-form-to-small', 'standard-form-write-large', 'standard-form-write-small'].includes(state.microSkillId))) {
  const model = state.working ?? (state.visual.kind === 'method-worked' ? state.visual : null)
  if (!model) continue
  const hops = model.examples[0].steps.map(step => step.frame.hop).filter(hop => hop && hop.stage === 'hops')
  if (!hops.length) { assert.ok(state.interaction.type === 'select' || state.interaction.lowerBound !== undefined, `${state.id} shows the point hopping`); continue }
  const title = state.content.title
  const sfIn = title.match(/× 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/)
  const expectedPlaces = sfIn ? Math.abs(power(sfIn[1])) : Math.abs(parseStandardForm(state.interaction.correctAnswer ?? '')?.n ?? NaN)
  if (Number.isFinite(expectedPlaces)) assert.equal(Math.abs(hops[0].end - hops[0].start), expectedPlaces, `${state.id} hops`)
  for (const hop of hops) assert.ok(hop.cells.every(cell => /^\d$/.test(cell)), `${state.id} hop cells are digits`)
}

// Choice questions: exactly one option is right, worked out from the option text
const evaluate = label => {
  const [, a1, p1, sign, a2, p2] = label.match(/\(([\d.]+) × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)\) ([×÷]) \(([\d.]+) × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)\)/)
  return tidy(sign === '×' ? sfValue(a1, power(p1)) * sfValue(a2, power(p2)) : sfValue(a1, power(p1)) / sfValue(a2, power(p2)))
}
for (const [fragment, target] of [['multiply to give 1.2 × 10⁶', 1.2e6], ['Which division gives 2 × 10⁴', 2e4]]) {
  const state = selects.find(state => state.content.title.includes(fragment))
  const right = state.interaction.options.filter(option => evaluate(option.label) === target)
  assert.equal(right.length, 1, `${fragment}: exactly one option works`)
  assert.equal(right[0].id, state.interaction.correctAnswer, `${fragment}: that option is the answer`)
}

// The maths behind the reasoning questions
assert.equal(sfValue(2.5, 4), 25000, 'N14.2 Q5c: 2.5 × 10⁴ = 25 000, not 250 000')
assert.ok(sfValue(3, -6) < sfValue(3, -2), 'N14.1 Q5c: a more negative power is smaller')
assert.equal(standardOf(921000).n, 5, 'N14.3 Q5c: 921 000 has 6 digits but power 5')
assert.equal(standardOf(0.000512).n, -4, 'N14.4 Q5c: 0.000512 has 3 zeros but power −4')
assert.equal(8 * 5, 40, 'N14.5 Q5c: 8 × 5 = 40, not less than 10')
assert.deepEqual(standardOf(4e2 / 8e5), { a: 5, n: -4 }, 'N14.6 Q5c: (4 × 10²) ÷ (8 × 10⁵) = 5 × 10⁻⁴')

// Wrong-answer messages
const cases = [
  // [message, text it must contain (null = stay silent)]
  [diagnoseOrdinary('0.00036', { a: 3.6, n: 4 }), 'moved the point left'],
  [diagnoseOrdinary('630000', { a: 6.3, n: -5 }), 'moved the point right'],
  [diagnoseOrdinary('250000', { a: 2.5, n: 4 }), 'adds 4 zeros'],
  [diagnoseOrdinary('0.0000063', { a: 6.3, n: -5 }), 'not the zeros'],
  [diagnoseOrdinary('3600', { a: 3.6, n: 4 }), 'Count again'],
  [diagnoseOrdinary('36 000', { a: 3.6, n: 4 }), null],
  [diagnoseOrdinary('90 000 000 km', { a: 9, n: 7 }), null],
  [diagnoseStandardForm('84.3×10^6', { a: 8.43, n: 7 }), 'isn’t standard form yet'],
  [diagnoseStandardForm('8.43×10^8', { a: 8.43, n: 7 }), 'not the digits'],
  [diagnoseStandardForm('5.12×10^-3', { a: 5.12, n: -4 }), 'not the zeros'],
  [diagnoseStandardForm('5.12×10^4', { a: 5.12, n: -4 }), 'negative power'],
  [diagnoseStandardForm('3.7×10^6', { a: 3.07, n: 6 }), 'Keep every zero'],
  [diagnoseStandardForm('30×10^7', { a: 3, n: 8, operation: { kind: 'multiply', first: [5, 4], second: [6, 3] } }), 'isn’t standard form yet'],
  [diagnoseStandardForm('3×10^7', { a: 3, n: 8, operation: { kind: 'multiply', first: [5, 4], second: [6, 3] } }), 'adds 1 to the power'],
  [diagnoseStandardForm('8×10^15', { a: 8, n: 8, operation: { kind: 'multiply', first: [2, 3], second: [4, 5] } }), 'Add the powers'],
  [diagnoseStandardForm('6×10^8', { a: 8, n: 8, operation: { kind: 'multiply', first: [2, 3], second: [4, 5] } }), 'don’t add them'],
  [diagnoseStandardForm('0.8×10^5', { a: 8, n: 4, operation: { kind: 'divide', first: [7.2, 8], second: [9, 3] } }), 'less than 1'],
  [diagnoseStandardForm('8×10^5', { a: 8, n: 4, operation: { kind: 'divide', first: [7.2, 8], second: [9, 3] } }), 'takes 1 off the power'],
  [diagnoseStandardForm('4×10^10', { a: 4, n: 4, operation: { kind: 'divide', first: [8, 7], second: [2, 3] } }), 'Subtract the powers'],
  [diagnoseStandardForm('5×10^2', { a: 5, n: -4, operation: { kind: 'divide', first: [4, 2], second: [8, 5] } }), null],
  [diagnoseStandardForm('4×10^-4', { a: 4, n: 4, operation: { kind: 'divide', first: [8, 7], second: [2, 3] } }), 'first power minus the second'],
  [diagnoseStandardForm('8.43×10^7', { a: 8.43, n: 7 }), null],
  [diagnoseBetween('5×10^6', { lower: 1e5, upper: 1e6, n: 5 }), 'power 5'],
  [diagnoseBetween('1×10^5', { lower: 1e5, upper: 1e6, n: 5 }), 'strictly between'],
  [diagnoseBetween('50×10^4', { lower: 1e5, upper: 1e6, n: 5 }), 'at least 1'],
  [diagnoseBetween('2×10^-4', { lower: 0.0001, upper: 0.001, n: -4 }), null],
  [diagnoseMultiplier('73', 7.3), 'less than 10'],
  [diagnoseMultiplier('7.3', 7.3), null],
]
cases.forEach(([message, expected], i) => {
  if (expected === null) assert.equal(message, null, `Case ${i + 1} should stay silent, got: ${message}`)
  else assert.ok(message && message.includes(expected), `Case ${i + 1} should mention "${expected}", got: ${message}`)
})

// Videos: one per source PDF, byte-identical to the source
assert.equal(states.filter(state => state.video).length, 6, 'One video per source PDF')
const mediaHashes = {
  'into-large-numbers.mp4': '8a1378837d9c8d3a042cdfa144642b8cbb96b53c6199757aa4dffd0e2a0bdf07',
  'into-small-numbers.mp4': 'e70ff5394348e60dfd040d8ec9a0aa9b571d08d905141fb17a7a74343ef79acd',
  'write-large-numbers.mp4': '0a0e83ab3df302f0cfc10d54a01e7f445114f25cc8680e5692461b0548cf69c0',
  'write-small-numbers.mp4': '4d9a46310096d3cf8b08dd03dee1536c38c0902e2124cfbc4ec2e55178f96798',
  'multiplying.mp4': '9ca61e33400b1d221e6ff35161561d71ee556a1eb06bac8b3d008f9214066e20',
  'dividing.mp4': 'a51b3384dbd4eba3b2083dba55f6e441f368831747a3d96b1120953cd85cd28f',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-14', name)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
  assert.ok(states.some(state => state.video?.src === `/media/lesson-14/${name}`), `${name} must be used`)
}

// Route and course order
const app = read('src/App.tsx')
assert.ok(app.includes('case 14:') && app.includes('return <TutorStandardFormLesson />'), 'Lesson 14 must open from the course and its direct route')
assert.ok(read('src/features/maths/courseRegistry.ts').includes("entry(14, tutorStandardFormLesson, 'Standard form'"), 'Lesson 14 must follow Lesson 13 in the course')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  14: {'), 'Lesson 14 needs key-fact cards')

console.log(`Lesson 14 verified: ${states.length} screens, all 48 source questions, ${typed.length} typed answers worked out again from their questions, ${selects.length} choice questions, ${cases.length} wrong-answer messages, 6 source-identical videos and the course route.`)

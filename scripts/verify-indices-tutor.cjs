// Checks Lesson 16 (Algebra A2, Powers and roots): source coverage, the power and algebra answer rules, every
// answer worked out again with plain arithmetic, wrong-answer messages, source-identical videos and the route.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorIndicesLesson: lesson } = require('../src/features/indices/tutor/indicesLesson.ts')
const { diagnosePower, diagnoseTerms } = require('../src/features/indices/tutor/indicesDiagnosis.ts')
const { checkAnswer, parsePower, readTerms, prettyKey } = require('../src/features/number-types/lessonMath.ts')

// ---------- The answer rules ----------
const power = answer => ({ type: 'numericInput', responseShape: 'power', acceptanceRule: 'power', correctAnswer: answer })
for (const [answer, typed] of [['10^7', '10^7'], ['10^7', '10⁷'], ['7^-3', '7^−3'], ['7^-3', '7⁻³'], ['x^1', 'x^1'], ['x^1', 'X¹'], ['k^5', 'k ^ 5']]) assert.ok(checkAnswer(power(answer), typed), `"${typed}" should be accepted for ${answer}`)
for (const [answer, typed, why] of [['3^6', '9^3', 'same value, different power'], ['3^6', '729', 'the value, not a power'], ['x^1', 'x', 'the power must show'], ['10^7', '10^12', 'wrong power'], ['7^-3', '7^3', 'lost minus'], ['3^6', '', 'empty']]) assert.ok(!checkAnswer(power(answer), typed), `"${typed}" must be rejected for ${answer} (${why})`)
assert.deepEqual(parsePower('10⁷'), { base: '10', power: 7 })
const algebra = answer => ({ type: 'numericInput', responseShape: 'expression', acceptanceRule: 'collectedExpression', correctAnswer: answer })
for (const [answer, typed] of [['15a⁶', '15a^6'], ['3a⁻⁴b', '3ba^-4'], ['3a⁻⁴b', '3a⁻⁴b'], ['14p⁷q³', '14q³p⁷'], ['x²/9', 'x^2/9'], ['8x³/125', '8x³/125'], ['a¹²', 'a^12'], ['a⁻⁸', 'a^-8']]) assert.ok(checkAnswer(algebra(answer), typed), `"${typed}" should be accepted for ${answer}`)
for (const [answer, typed, why] of [['15a⁶', '15a^8', 'powers multiplied'], ['3a⁻⁴b', '3a^4b', 'lost minus'], ['x²/9', 'x^2/3', 'bottom not squared'], ['a⁻⁸', 'a-8', 'a minus 8 is two terms'], ['x²/9', 'x^2/0', 'divide by 0']]) assert.ok(!checkAnswer(algebra(answer), typed), `"${typed}" must be rejected for ${answer} (${why})`)
assert.deepEqual(readTerms('3a^-4b - 2'), [{ coefficient: 3, key: 'a^-4b' }, { coefficient: -2, key: '' }], 'A minus after ^ belongs to the power')
assert.equal(prettyKey('a^-4b^12'), 'a⁻⁴b¹²')

// ---------- Structure ----------
const states = lesson.states
assert.equal(lesson.id, 'L016', 'A2 keeps the stable progress key L016')
assert.equal(states.length, 71, 'Lesson 16 screen total')
const rungs = [...new Set(states.map(state => state.microSkillId))]
assert.deepEqual(rungs, ['indices-power-one', 'indices-multiply', 'indices-divide', 'indices-power-zero', 'indices-one', 'indices-power-of-power', 'indices-fraction', 'roots', 'mixed'], 'Eight rungs in teaching order, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L16-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
  assert.ok(/[\d√∛ⁿ⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(state.content.title) || state.microSkillId === 'mixed', `${state.id}: the title shows the maths`)
  if (state.interaction.type !== 'continue') {
    assert.ok(state.hint?.trim(), `${state.id} needs a hint`)
    assert.ok(state.working?.kind === 'method-worked' && state.working.examples.every(example => example.pictureOnly), `${state.id} needs a picture-only working`)
  }
})

// Every source question, except A2.1 Q5c (fractional powers: Higher tier only), in the rung for its PDF.
const refs = states.map(state => state.sourceRef)
const rungOf = { 5: 'indices-power-one', 1: 'indices-multiply', 2: 'indices-divide', 4: 'indices-power-zero', 6: 'indices-one', 3: 'indices-power-of-power', 7: 'indices-fraction', 8: 'roots' }
for (const pdf of [1, 2, 3, 4, 5, 6, 7, 8]) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    if (pdf === 1 && question === 'Q5c') { assert.ok(!refs.some(ref => ref.includes('A2.1 Q5c')), 'A2.1 Q5c is Higher tier and is left out'); continue }
    const state = states.find(s => s.sourceRef === `A2.${pdf} ${question}` || (question === 'Q1' && s.sourceRef === `A2.${pdf} video + Q1`))
    assert.ok(state, `Missing A2.${pdf} ${question}`)
    assert.equal(state.microSkillId, rungOf[pdf], `A2.${pdf} ${question} belongs in its own rung`)
  }
  const first = states.find(state => state.microSkillId === rungOf[pdf])
  assert.ok(first.video && first.sourceRef.startsWith(`A2.${pdf} video`), `A2.${pdf}'s rung opens with its video`)
}

// ---------- Every answer, worked out again with plain arithmetic ----------
// Numbers: the value itself. Powers: [base, power]. Algebra: the question and the answer as functions, compared at several values.
const independent = {
  'A2.5 Q1': 12 ** 1, 'A2.5 Q2': 25 ** 1, 'A2.5 Q3': 6 ** 1 + 4 ** 1, 'A2.5 Q4a': [x => 3 * x ** 1 + 2 * x], 'A2.5 Q5a': 4 ** 1 * 4 ** 1, 'A2.5 Q5b': ['x', 1],
  'A2.1 Q1': [10, 3 + 4], 'A2.1 Q2': [6, 2 + 5], 'A2.1 Q3': [a => 5 * a ** 4 * 3 * a ** 2], 'A2.1 Q4a': [(p, q) => 7 * p ** 3 * q * 2 * p ** 4 * q ** 2], 'A2.1 Q5a': [x => 3 * x ** -2 * 4 * x ** 5], 'A2.1 Q5b': 2 ** -3 * 2 ** 5,
  'A2.2 Q1': [2, 9 - 3], 'A2.2 Q2': ['k', 8 - 3], 'A2.2 Q3': 5 ** 8 / 5 ** 5, 'A2.2 Q4a': [(x, y) => 20 * x ** 6 * y ** 5 / (4 * x ** 2 * y)], 'A2.2 Q5a': [7, 6 - 9], 'A2.2 Q5c': [(a, b) => 24 * a ** 5 * b / (8 * a ** 9)],
  'A2.4 Q1': 2 ** 0, 'A2.4 Q2': 9 ** 0, 'A2.4 Q3': 12 ** 0 + 7 ** 0, 'A2.4 Q4a': 4 * 9 ** 0, 'A2.4 Q5a': (7 + 2) ** 0, 'A2.4 Q5b': 2 * 5 ** 0,
  'A2.6 Q1': 1 ** 3, 'A2.6 Q2': 1 ** 7, 'A2.6 Q3': 1 ** 5 + 1 ** 20, 'A2.6 Q4a': 6 * 1 ** 100, 'A2.6 Q5a': 1 ** 0 + 1 ** -5, 'A2.6 Q5c': 1 ** 9 * 1 ** 15 * 1 ** -6,
  'A2.3 Q1': [3, 2 * 3], 'A2.3 Q2': [5, 4 * 2], 'A2.3 Q3': (2 ** 3) ** 2, 'A2.3 Q4a': [1, 2, 3, 4, 5, 6].find(n => (3 ** 4) ** n === 3 ** 12), 'A2.3 Q5b': [a => (a ** -2) ** 4], 'A2.3 Q5c': [a => ((a ** 2) ** 3) ** 2],
  'A2.7 Q2': [1, 8], 'A2.7 Q3': [27, 64], 'A2.7 Q4a': [x => (x / 3) ** 2], 'A2.7 Q5a': [49, 16], 'A2.7 Q5b': [3 * 16 + 1, 16], 'A2.7 Q5c': [x => (2 * x / 5) ** 3],
  'A2.8 Q1': Math.sqrt(81), 'A2.8 Q2': Math.sqrt(64), 'A2.8 Q3': Math.round(125 ** (1 / 3)), 'A2.8 Q4a': Math.sqrt(100) + Math.round(8 ** (1 / 3)), 'A2.8 Q5a': Math.round(81 ** (1 / 4)), 'A2.8 Q5c': Math.sqrt(144) - Math.round(64 ** (1 / 3)),
}
// The fraction answers, checked as fractions: (1/2)³, (3/4)³, (7/4)² and the same as a mixed number.
assert.equal((1 / 2) ** 3, 1 / 8); assert.equal((3 / 4) ** 3, 27 / 64); assert.equal((7 / 4) ** 2, 49 / 16); assert.equal(1 + 3 / 4, 7 / 4)
// Evaluate a typed algebra answer at chosen letter values, with the same reading the app uses.
function evaluate(answer, values) {
  return readTerms(answer).reduce((sum, { coefficient, key }) => sum + coefficient * [...key.matchAll(/([a-z])(?:\^(-?\d+))?/g)].reduce((product, [, letter, p]) => product * values[letter] ** Number(p ?? 1), 1), 0)
}
const typed = states.filter(state => ['numericInput', 'fractionInput'].includes(state.interaction.type))
for (const state of typed) {
  const { interaction } = state
  const expected = independent[state.sourceRef]
  assert.ok(expected !== undefined, `${state.id} (${state.sourceRef}) needs an independent answer`)
  assert.ok(checkAnswer(interaction, interaction.correctAnswer), `${state.id} accepts its own answer`)
  if (interaction.acceptanceRule === 'power') {
    assert.deepEqual(parsePower(interaction.correctAnswer), { base: String(expected[0]), power: expected[1] }, `${state.id}: ${state.content.title}`)
  } else if (interaction.acceptanceRule === 'collectedExpression') {
    const [fn] = expected, letters = [...new Set(String(interaction.correctAnswer).match(/[a-z]/g))].sort()
    for (const trial of [[2, 3], [3, 5], [0.5, 7]]) {
      const values = Object.fromEntries(letters.map((letter, i) => [letter, trial[i]]))
      const want = fn(...letters.map(letter => values[letter]))
      assert.ok(Math.abs(evaluate(interaction.correctAnswer, values) - want) < 1e-9 * Math.max(1, Math.abs(want)), `${state.id}: ${state.content.title} = ${interaction.correctAnswer} (at ${JSON.stringify(values)})`)
    }
    assert.ok(interaction.anyPower, `${state.id} offers the xⁿ key`)
  } else if (interaction.type === 'fractionInput') {
    const [n, d] = expected
    assert.ok(checkAnswer(interaction, interaction.responseShape === 'mixedNumber' ? `${Math.floor(n / d)} ${n % d}/${d}` : `${n}/${d}`), `${state.id}: ${state.content.title} = ${n}/${d}`)
  } else assert.equal(Number(interaction.correctAnswer), expected, `${state.id}: ${state.content.title}`)
  if (state.diagnose) assert.equal(state.diagnose(String(interaction.correctAnswer)), null, `${state.id} stays silent on the right answer`)
}
assert.equal(Object.keys(independent).length, typed.length, 'Every independent answer is used')

// Choices: every wrong option says why it is wrong, in its own words.
const selects = states.filter(state => state.interaction.type === 'select')
for (const state of selects) {
  assert.equal(state.interaction.correctAnswer, '0')
  const wrong = state.interaction.options.filter(option => option.id !== '0')
  assert.ok(wrong.length >= 2 && wrong.every(option => option.feedback?.trim()), `${state.id}: each wrong option needs its own message`)
  assert.ok(!checkAnswer(state.interaction, wrong[0].id), `${state.id}: a wrong option is marked wrong`)
}

// ---------- Wrong-answer messages ----------
const at = ref => states.find(state => state.sourceRef === ref)
const cases = [
  ['A2.1 Q1', '10^12', 'multiplied the powers'], ['A2.1 Q1', '100^7', 'base stays as 10'], ['A2.1 Q1', '10000000', 'single power'],
  ['A2.1 Q3', '8a^6', 'aren’t added'], ['A2.1 Q3', '15a^8', 'multiplied the powers of a'],
  ['A2.1 Q4a', '14p^7q^2', 'q means q¹'], ['A2.1 Q5a', '12x^7', 'powers of x'], ['A2.1 Q5b', '256', 'Keep the minus'], ['A2.1 Q5b', '2^2', 'value'],
  ['A2.2 Q1', '2^3', 'divided the powers'], ['A2.2 Q1', '2^12', 'added the powers'], ['A2.2 Q1', '1^6', 'base stays as 2'],
  ['A2.2 Q3', '15', 'not 5 × 3'], ['A2.2 Q4a', '5x^4y^5', 'y means y¹'], ['A2.2 Q5a', '7^3', 'bottom power from the top'], ['A2.2 Q5c', '3a^4b', 'sign'],
  ['A2.5 Q1', '1', 'doesn’t turn the number into 1'], ['A2.5 Q4a', '5x²', 'only changes the number in front'], ['A2.5 Q5a', '8', 'Multiply, don’t add'],
  ['A2.4 Q2', '0', 'not 0'], ['A2.4 Q4a', '36', 'power first'], ['A2.4 Q5b', '1', 'belongs to a only'],
  ['A2.6 Q2', '7', '1 × 1'], ['A2.6 Q4a', '600', 'not 100'], ['A2.6 Q5a', '-4', 'not −5'],
  ['A2.3 Q1', '3^5', 'added the powers'], ['A2.3 Q3', '32', 'multiply'], ['A2.3 Q4a', '8', 'multiply'], ['A2.3 Q5b', 'a^8', 'sign'], ['A2.3 Q5b', 'a^2', 'added the powers'], ['A2.3 Q5c', 'a⁷', 'added'],
  ['A2.7 Q2', '3/6', 'not by 3'], ['A2.7 Q3', '27/4', 'bottom too'], ['A2.7 Q4a', 'x^2/3', 'bottom too'], ['A2.7 Q5a', '1 9/16', '7/4'], ['A2.7 Q5c', '2x^3/125', 'Cube the 2'],
  ['A2.8 Q1', '40.5', 'isn’t half'], ['A2.8 Q2', '4', 'cube root'], ['A2.8 Q4a', '14', '2 × 2 × 2'], ['A2.8 Q5a', '9', 'square root'], ['A2.8 Q5c', '4', 'cube root'],
]
for (const [ref, response, expected] of cases) {
  const message = at(ref).diagnose(response)
  assert.ok(message && message.includes(expected), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}
assert.equal(diagnosePower('banana', 3, 'multiply', 4, 5), null, 'Unrecognised answers get the hint instead')
assert.equal(diagnoseTerms('15a^6', '5a⁴', '3a²', 'multiply'), null)

// ---------- Videos ----------
assert.equal(states.filter(state => state.video).length, 8, 'One video per source PDF')
const mediaHashes = {
  'power-one.mp4': 'dd1fadbf07aba9720f423b61c47b0825f795e79ac63e2dc270ff14caf8993fba',
  'multiplication.mp4': 'bec55d4c3f2d6964e0fc98704b7ac9afee9ae9bece55d466eb4106034b933fdc',
  'division.mp4': '8c8143985426f187c9e7abd8d408afe57e750aa3656cd4697c430241052323a3',
  'power-zero.mp4': 'd1be719e92fc5905bfd31c3ce242cd672654d1f7d5e328c95031152f6d1f9953',
  'one-law.mp4': 'fa65911125a84ece3a3465ebffcec3265631fc59d7998dcba2e4c219d9c27f3a',
  'multiple-powers.mp4': 'fda4a96e624b3efcdfcf97df686f5ed2cbcc787899172440f665b71288e231ee',
  'fraction.mp4': '3a36df51743555256bcf3af44c4f92076b0e0633230f12b972d0a4edbe09f373',
  'roots.mp4': '73a5db5ca4ee02aae1a6d25516594b00082c4448624475148d4e24d11f7e2058',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-16', name)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
  assert.ok(states.some(state => state.video?.src === `/media/lesson-16/${name}`), `${name} must be used`)
}

// ---------- The course ----------
const { mathsLessons, lessonCode } = require('../src/features/maths/courseRegistry.ts')
const a2 = mathsLessons.find(entry => entry.number === 16)
assert.equal(a2.chapterId, 'algebra')
assert.equal(a2.position, 2, 'Students see A2 as Algebra lesson 2')
assert.equal(lessonCode(a2), 'A2')
const app = read('src/App.tsx')
assert.ok(app.includes('case 16:') && app.includes('return <TutorIndicesLesson />'), 'Lesson 16 must open from the course and its direct route')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  16: {'), 'A2 needs key-fact cards')

console.log(`Lesson 16 (A2) verified: ${states.length} screens, all 63 Foundation source questions (A2.1 Q5c is Higher and left out), ${typed.length} typed answers worked out again, ${selects.length} choices with a message for every wrong option, ${cases.length} wrong-answer messages, 8 source-identical videos and the route.`)

// Checks Lesson 18 (Algebra A4, Factorising): source coverage, every answer expanded back and checked against the
// question at several letter values, fully factorised, the grid working, wrong-answer messages, source-identical
// videos and the route.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorFactorisingLesson: lesson } = require('../src/features/factorising/tutor/factorisingLesson.ts')
const { checkAnswer, readTerms } = require('../src/features/number-types/lessonMath.ts')

// ---------- Structure ----------
const states = lesson.states
assert.equal(lesson.id, 'L018', 'A4 keeps the stable progress key L018')
assert.equal(states.length, 17, 'Lesson 18 screen total')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], ['factorise-two-terms', 'factorise-three-terms', 'mixed'], 'Two rungs, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L18-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
  if (state.interaction.type !== 'continue') {
    assert.ok(state.hint?.trim(), `${state.id} needs a hint`)
    assert.ok(state.working?.kind === 'method-worked' && state.working.examples.every(example => example.pictureOnly), `${state.id} needs a picture-only working`)
  }
})
const rungOf = { 1: 'factorise-two-terms', 2: 'factorise-three-terms' }
for (const pdf of [1, 2]) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    const state = states.find(s => s.sourceRef === `A4.${pdf} ${question}` || (question === 'Q1' && s.sourceRef === `A4.${pdf} video + Q1`))
    assert.ok(state, `Missing A4.${pdf} ${question}`)
    assert.equal(state.microSkillId, rungOf[pdf])
  }
  const first = states.find(state => state.microSkillId === rungOf[pdf])
  assert.ok(first.video && first.sourceRef === `A4.${pdf} video + Q1`, `A4.${pdf}'s rung opens with its video, which works the PDF's Q1`)
}

// ---------- Every answer: expands back to the question, and nothing is left to take out ----------
// The questions, written out independently of the lesson as plain arithmetic.
const independent = {
  'A4.1 Q2': ({ a }) => 5 * a + 10, 'A4.1 Q3': ({ y }) => 14 * y ** 2 - 21 * y, 'A4.1 Q4a': ({ a, b }) => 12 * a * b + 18 * b ** 2,
  'A4.1 Q5a': ({ p, q }) => 15 * p ** 2 * q + 25 * p * q ** 2,
  'A4.2 Q2': ({ p, q, r }) => 3 * p + 6 * q + 9 * r, 'A4.2 Q3': ({ x, y }) => 6 * x ** 2 + 9 * x + 12 * x * y, 'A4.2 Q4a': ({ x }) => 12 * x ** 2 + 18 * x + 6,
  'A4.2 Q5a': ({ x, y }) => 8 * x ** 3 * y + 12 * x ** 2 * y ** 2 + 4 * x * y, 'A4.2 Q5c': ({ k }) => 9 * k ** 3 + 6 * k ** 2 - 3 * k,
}
const letterValue = (key, values) => [...key.matchAll(/([a-z])(?:\^(-?\d+))?/g)].reduce((product, [, letter, p]) => product * values[letter] ** Number(p ?? 1), 1)
const evaluate = (expression, values) => readTerms(expression).reduce((sum, { coefficient, key }) => sum + coefficient * letterValue(key, values), 0)
/** "3x(2x + 3)" → the outside term times the sum inside, both read without the lesson's own helpers. */
function evaluateFactorised(answer, values) {
  const match = answer.replace(/\s/g, '').match(/^([^(]*)\((.*)\)$/)
  assert.ok(match, `${answer} is one term times a bracket`)
  return evaluate(match[1] || '1', values) * evaluate(match[2], values)
}
const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b)
const typed = states.filter(state => state.interaction.type === 'numericInput')
for (const state of typed) {
  const { interaction } = state, expected = independent[state.sourceRef]
  assert.ok(expected, `${state.id} needs an independent question`)
  assert.equal(interaction.acceptanceRule, 'factorisedExpression')
  assert.ok(checkAnswer(interaction, interaction.correctAnswer), `${state.id} accepts its own answer`)
  const answer = String(interaction.correctAnswer)
  const letters = [...new Set(answer.match(/[a-z]/g))].sort()
  for (const trial of [[2, 3, 5], [-3, 5, -2], [7, -1, 4], [0.5, -4, 3]]) {
    const values = Object.fromEntries(letters.map((letter, i) => [letter, trial[i]]))
    // Compare within a tolerance: −0 and rounding never count as a difference.
    assert.ok(Math.abs(evaluateFactorised(answer, values) - expected(values)) < 1e-9, `${state.id}: ${answer} at ${JSON.stringify(values)}`)
  }
  // Fully factorised: the bracket's numbers share nothing, and no letter is in every term of the bracket.
  const inside = readTerms(answer.replace(/^[^(]*\(|\)$/g, ''))
  assert.equal(inside.map(term => term.coefficient).reduce(gcd), 1, `${state.id}: the numbers in the bracket share nothing`)
  for (const letter of letters) assert.ok(inside.some(term => !term.key.includes(letter)), `${state.id}: ${letter} is not left in every term`)
  // Accepted with the bracket's terms in another order, and with the bracket first.
  const [, outside, bracket] = answer.match(/^([^(]*)\((.*)\)$/)
  const parts = bracket.split(/ (?=[+−] )/)
  const reversed = parts.reverse().map((part, i) => i === 0 ? part.replace(/^\+ /, '').replace(/^− /, '−') : /^[+−] /.test(part) ? part : part.startsWith('−') ? `− ${part.slice(1)}` : `+ ${part}`).join(' ')
  assert.ok(checkAnswer(interaction, `${outside}(${reversed})`), `${state.id} accepts ${outside}(${reversed})`)
  assert.ok(checkAnswer(interaction, `(${bracket})${outside}`), `${state.id} accepts the bracket written first`)
  // Not accepted: the expression it started from, or the bracket with nothing taken out.
  const expanded = state.working.examples[0].steps[0].frame.expand.grids[0].cells[0].map(cell => cell.text).join(' + ').replace(/\+ −/g, '− ')
  assert.ok(!checkAnswer(interaction, expanded), `${state.id} rejects the question itself (${expanded})`)
  assert.equal(state.diagnose(answer), null, `${state.id} stays silent on the right answer`)
  // The working's grid: the side times each top box gives each box, and the answer is what the working writes.
  const steps = state.working.examples[0].steps
  const grid = steps.findLast(step => step.frame.expand).frame.expand.grids[0]
  assert.equal(steps.at(-1).frame.ordering.answer, answer, `${state.id}: the working reaches the answer`)
  // The answer is built from its pieces: the side of the grid outside, the top of the grid inside.
  const built = steps.at(-1).frame.bracket
  assert.equal(`${built.outside}(${built.inside.map(piece => piece.text).join(' ')})`, answer, `${state.id}: the answer's pieces make the answer`)
  assert.deepEqual(built.inside.map(piece => piece.text.replace(/^\+ /, '').replace(/^− /, '−')), grid.top, `${state.id}: the bracket holds the top of the grid`)
  grid.top.forEach((top, c) => {
    for (const trial of [[2, 3, 5], [-3, 5, -2]]) {
      const values = Object.fromEntries(letters.map((letter, i) => [letter, trial[i]]))
      assert.ok(Math.abs(evaluate(grid.side[0], values) * evaluate(top, values) - evaluate(grid.cells[0][c].text, values)) < 1e-9, `${state.id}: box ${c + 1} of the grid`)
    }
  })
}
assert.equal(Object.keys(independent).length, typed.length, 'Every independent question is used')
for (const state of states.filter(state => state.interaction.type === 'select')) {
  const wrong = state.interaction.options.filter(option => option.id !== '0')
  assert.ok(wrong.length >= 2 && wrong.every(option => option.feedback?.trim()), `${state.id}: each wrong option needs its own message`)
  assert.ok(!checkAnswer(state.interaction, '1') && checkAnswer(state.interaction, '0'), `${state.id}: the first option is the right one`)
}
// The choice questions' right answers, checked by hand.
assert.ok(evaluateFactorised('2x(2x + 5)', { x: 3 }) === 4 * 9 + 10 * 3, 'A4.1 Q4b: 2x(2x + 5) is Kim’s expression')
assert.ok(evaluateFactorised('3mn(2m + 3)', { m: 2, n: 5 }) === 6 * 4 * 5 + 9 * 2 * 5, 'A4.1 Q5c: 3mn(2m + 3) is Sam’s expression')
assert.ok(evaluateFactorised('6(2x^2 + 3x)', { x: 2 }) !== 12 * 4 + 18 * 2 + 6, 'A4.2 Q4b: Ravi’s answer loses the + 6')

// ---------- Wrong-answer messages ----------
const at = ref => states.find(state => state.sourceRef === ref)
const cases = [
  ['A4.1 Q2', '5a + 10', 'you started with'], ['A4.1 Q2', '5(a + 10)', '5 × 10 = 50'],
  ['A4.1 Q3', '7(2y² − 3y)', 'still share y'], ['A4.1 Q3', 'y(14y − 21)', 'still share 7'], ['A4.1 Q3', '7y(2y + 3)', 'Check the signs'],
  ['A4.1 Q4a', '6(2ab + 3b²)', 'still share b'], ['A4.1 Q4a', '6b(2a + 3)', '6b × 3 = 18b, not 18b²'],
  ['A4.1 Q5a', '5p(3pq + 5q²)', 'still share q'], ['A4.1 Q5a', '5pq(3p + 5)', 'not 25pq²'],
  ['A4.2 Q2', '3(p + 2q + 9r)', '9r ÷ 3 = 3r'],
  ['A4.2 Q3', '3x(2x + 3)', 'A term is missing'], ['A4.2 Q3', '3(2x² + 3x + 4xy)', 'still share x'],
  ['A4.2 Q4a', '6(2x² + 3x)', '6 ÷ 6 = 1'], ['A4.2 Q4a', '2(6x² + 9x + 3)', 'still share 3'],
  ['A4.2 Q5a', '4xy(2x² + 3xy)', '4xy ÷ 4xy = 1'], ['A4.2 Q5a', '4x(2x²y + 3xy² + y)', 'still share y'],
  ['A4.2 Q5c', '3k(3k² + 2k + 1)', 'Check the signs'], ['A4.2 Q5c', '3k(3k² + 2k)', '−3k ÷ 3k = −1'], ['A4.2 Q5c', '3(3k³ + 2k² − k)', 'still share k'],
]
for (const [ref, response, expected] of cases) {
  const message = at(ref).diagnose(response)
  assert.ok(message && message.includes(expected), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}
// Taking out the negative of the factor is fully factorised too.
assert.ok(checkAnswer(at('A4.1 Q3').interaction, '−7y(−2y + 3)'), 'A4.1 Q3 accepts −7y(−2y + 3)')

// ---------- Videos ----------
assert.equal(states.filter(state => state.video).length, 2, 'One video per source PDF')
assert.ok(states.filter(state => state.video2).every(state => state.video && state.video2.id !== state.video.id) && states.filter(state => state.video2).length === 2, 'Each worked screen also has Video 2, another way')
const mediaHashes = {
  'two-terms.mp4': '8823437050cb07e6b35ce9564dd1aa02529ed3b74155daddcbf9c156ca99192f',
  'three-terms.mp4': 'd6de0629a625cb47c82d748b0cae759c1fb12ba06ef32eeb8da2e16d2771c301',
  // Video 2 on each worked screen: the same example done another way.
  'two-terms-another-way.mp4': 'be138633501204bfee8c874118bdfb78adb63cb5eb11597e21c7288e68a67a60',
  'three-terms-another-way.mp4': '1c77a1a57331f551b90dfb1ba3c3f8439242e0d925b6dc6a0ab77da5ace070c2',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-18', name)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
  assert.ok(states.some(state => state.video?.src === `/media/lesson-18/${name}` || state.video2?.src === `/media/lesson-18/${name}`), `${name} must be used`)
}

// ---------- The course ----------
const { mathsLessons, lessonCode } = require('../src/features/maths/courseRegistry.ts')
const a4 = mathsLessons.find(entry => entry.number === 18)
assert.equal(a4.chapterId, 'algebra')
assert.equal(a4.position, 4, 'Students see A4 as Algebra lesson 4')
assert.equal(lessonCode(a4), 'A4')
const app = read('src/App.tsx')
assert.ok(app.includes('case 18:') && app.includes('return <TutorFactorisingLesson />'), 'Lesson 18 must open from the course and its direct route')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  18: {'), 'A4 needs key-fact cards')

console.log(`Lesson 18 (A4) verified: ${states.length} screens, all 16 source questions, ${typed.length} typed answers expanded back and checked against the question at four sets of values, fully factorised, accepted in another order, every grid box checked, ${cases.length} wrong-answer messages, 2 source-identical videos and the route.`)

// Checks Lesson 17 (Algebra A3, Expanding brackets): source coverage, every answer checked against the brackets at
// several letter values, the grid working, wrong-answer messages, source-identical videos and the route.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorExpandingLesson: lesson } = require('../src/features/expanding/tutor/expandingLesson.ts')
const { checkAnswer, readTerms } = require('../src/features/number-types/lessonMath.ts')

// ---------- Structure ----------
const states = lesson.states
assert.equal(lesson.id, 'L017', 'A3 keeps the stable progress key L017')
assert.equal(states.length, 17, 'Lesson 17 screen total')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], ['expand-single', 'expand-double', 'mixed'], 'Two rungs, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L17-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
  if (state.interaction.type !== 'continue') {
    assert.ok(state.hint?.trim(), `${state.id} needs a hint`)
    assert.ok(state.working?.kind === 'method-worked' && state.working.examples.every(example => example.pictureOnly), `${state.id} needs a picture-only working`)
  }
})
const rungOf = { 1: 'expand-single', 2: 'expand-double' }
for (const pdf of [1, 2]) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    const state = states.find(s => s.sourceRef === `A3.${pdf} ${question}` || (question === 'Q1' && s.sourceRef === `A3.${pdf} video + Q1`))
    assert.ok(state, `Missing A3.${pdf} ${question}`)
    assert.equal(state.microSkillId, rungOf[pdf])
  }
  const first = states.find(state => state.microSkillId === rungOf[pdf])
  assert.ok(first.video && first.sourceRef === `A3.${pdf} video + Q1`, `A3.${pdf}'s rung opens with its video, which works the PDF's Q1`)
}

// ---------- Every answer, checked against the brackets with plain arithmetic ----------
const independent = {
  'A3.1 Q2': y => 6 * (y - 4), 'A3.1 Q3': p => -3 * (2 * p - 5), 'A3.1 Q4a': k => 5 * k * (3 * k + 4), 'A3.1 Q4b': 5 * 2 * (3 * 2 + 4),
  'A3.1 Q5a': (a, b) => -4 * a * (3 * a - 2 * b), 'A3.1 Q5c': x => 2 * (3 * x + 5) - 3 * (x - 4),
  'A3.2 Q2': a => (a + 1) * (a + 8), 'A3.2 Q3': x => (x + 7) * (x - 3), 'A3.2 Q4a': m => (2 * m + 1) * (m + 5), 'A3.2 Q4b': (2 * 3 + 1) * (3 + 5),
  'A3.2 Q5a': n => (n - 4) * (n - 9), 'A3.2 Q5c': n => (n - 4) ** 2,
}
const evaluate = (answer, values) => readTerms(answer).reduce((sum, { coefficient, key }) => sum + coefficient * [...key.matchAll(/([a-z])(?:\^(-?\d+))?/g)].reduce((product, [, letter, p]) => product * values[letter] ** Number(p ?? 1), 1), 0)
const typed = states.filter(state => state.interaction.type === 'numericInput')
for (const state of typed) {
  const { interaction } = state, expected = independent[state.sourceRef]
  assert.ok(expected !== undefined, `${state.id} needs an independent answer`)
  assert.ok(checkAnswer(interaction, interaction.correctAnswer), `${state.id} accepts its own answer`)
  if (typeof expected === 'number') { assert.equal(Number(interaction.correctAnswer), expected, `${state.id}: ${state.content.title}`); continue }
  assert.equal(interaction.acceptanceRule, 'collectedExpression')
  const letters = [...new Set(String(interaction.correctAnswer).match(/[a-z]/g))].sort()
  for (const trial of [[2, 3], [-3, 5], [7, -1]]) {
    const values = Object.fromEntries(letters.map((letter, i) => [letter, trial[i]]))
    assert.ok(Math.abs(evaluate(interaction.correctAnswer, values) - expected(...letters.map(letter => values[letter]))) < 1e-9, `${state.id}: ${state.content.title} = ${interaction.correctAnswer} at ${JSON.stringify(values)}`)
  }
  const reversed = interaction.correctAnswer.split(/ (?=[+−] )/).reverse().map((part, i) => i === 0 ? part.replace(/^\+ /, '').replace(/^− /, '−') : /^[+−] /.test(part) ? part : part.startsWith('−') ? `− ${part.slice(1)}` : `+ ${part}`).join(' ')
  assert.ok(checkAnswer(interaction, reversed), `${state.id} accepts its terms in another order ("${reversed}")`)
  assert.equal(state.diagnose(interaction.correctAnswer), null, `${state.id} stays silent on the right answer`)
  // The working's grid multiplies out to the answer, and every box is filled.
  const grid = state.working.examples[0].steps[0].frame.expand
  assert.ok(grid.grids.every(g => g.cells.flat().length === g.side.length * g.top.length && g.cells.flat().every(cell => cell.text)), `${state.id}: every box is filled`)
  const boxes = grid.grids.flatMap(g => g.cells.flat().map(cell => cell.text)).join(' + ').replace(/\+ −/g, '− ')
  for (const trial of [[2, 3], [-3, 5]]) {
    const values = Object.fromEntries(letters.map((letter, i) => [letter, trial[i]]))
    assert.equal(evaluate(boxes, values), evaluate(interaction.correctAnswer, values), `${state.id}: the boxes add up to the answer`)
  }
}
assert.equal(Object.keys(independent).length, typed.length, 'Every independent answer is used')
for (const state of states.filter(state => state.interaction.type === 'select')) {
  const wrong = state.interaction.options.filter(option => option.id !== '0')
  assert.ok(wrong.length >= 2 && wrong.every(option => option.feedback?.trim()), `${state.id}: each wrong option needs its own message`)
}

// ---------- Wrong-answer messages ----------
const at = ref => states.find(state => state.sourceRef === ref)
const cases = [
  ['A3.1 Q2', '6y - 4', 'every term inside'], ['A3.1 Q2', '6y + 24', 'Negative × positive is negative'],
  ['A3.1 Q3', '-6p - 15', 'Negative × negative is positive'], ['A3.1 Q3', '6p + 15', 'Negative × positive'],
  ['A3.1 Q4a', '15k + 20k', 'k × k is k²'], ['A3.1 Q4a', '15k^2 + 4', 'every term inside'], ['A3.1 Q4b', '940', 'Square only the 2'],
  ['A3.1 Q5a', '-12a^2 - 8ab', 'Negative × negative is positive'], ['A3.1 Q5c', '3x - 2', '−3 × −4 = +12'], ['A3.1 Q5c', '6x + 10 - 3x + 12', 'still collect'],
  ['A3.2 Q2', 'a^2 + 8a + 8', '1 × a = a'],
  ['A3.2 Q3', 'x^2 - 21', 'middle ones'], ['A3.2 Q3', 'x^2 + 4x + 21', 'Negative × positive is negative'],
  ['A3.2 Q3', 'x^2 + 4x + 4', 'Multiply, don’t add'], ['A3.2 Q4a', 'm^2 + 11m + 5', 'Multiply the numbers too'], ['A3.2 Q4a', '2m^2 + 10m + m + 5', 'still collect'],
  ['A3.2 Q4b', '74', 'Square only the 3'], ['A3.2 Q5a', 'n^2 - 13n - 36', 'Negative × negative is positive'],
  ['A3.2 Q5c', 'n^2 - 16', 'multiplying it by itself'], ['A3.2 Q5c', 'n^2 + 16', 'multiplying it by itself'],
]
for (const [ref, response, expected] of cases) {
  const message = at(ref).diagnose(response)
  assert.ok(message && message.includes(expected), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}

// ---------- Videos ----------
assert.equal(states.filter(state => state.video).length, 2, 'One video per source PDF')
const mediaHashes = {
  'single-brackets.mp4': 'c6c178fe86d8937055c9daa9de3234f89649d2621310f92575d0c9e810ba1ee0',
  'double-brackets.mp4': 'c2bb855cb3fb678d2aba8b80bbb559ccceb6017a557bef7e391dedbf7b187797',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-17', name)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
  assert.ok(states.some(state => state.video?.src === `/media/lesson-17/${name}`), `${name} must be used`)
}

// ---------- The course ----------
const { mathsLessons, lessonCode } = require('../src/features/maths/courseRegistry.ts')
const a3 = mathsLessons.find(entry => entry.number === 17)
assert.equal(a3.chapterId, 'algebra')
assert.equal(a3.position, 3, 'Students see A3 as Algebra lesson 3')
assert.equal(lessonCode(a3), 'A3')
const app = read('src/App.tsx')
assert.ok(app.includes('case 17:') && app.includes('return <TutorExpandingLesson />'), 'Lesson 17 must open from the course and its direct route')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  17: {'), 'A3 needs key-fact cards')

console.log(`Lesson 17 (A3) verified: ${states.length} screens, all 16 source questions, ${typed.length} typed answers checked against the brackets and in another order, every grid adding up to its answer, ${cases.length} wrong-answer messages, 2 source-identical videos and the route.`)

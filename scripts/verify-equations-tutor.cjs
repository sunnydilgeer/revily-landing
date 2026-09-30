// Checks Lesson 19 (Algebra A5, Solving equations): source coverage, every answer put back into its equation,
// every row of every board true at the answer, other ways of typing the answer, wrong-answer messages,
// source-identical videos and the route.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorEquationsLesson: lesson } = require('../src/features/equations/tutor/equationsLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

// ---------- Structure ----------
const states = lesson.states
const rungs = ['equations-one-unknown', 'equations-squares', 'equations-both-sides', 'equations-brackets', 'equations-fractions']
assert.equal(lesson.id, 'L019', 'A5 keeps the stable progress key L019')
assert.equal(states.length, 41, 'Lesson 19 screen total')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Five rungs, easiest first (squares after one unknown), then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L19-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
  if (state.interaction.type !== 'continue') {
    assert.ok(state.hint?.trim(), `${state.id} needs a hint`)
    assert.ok(state.working?.kind === 'method-worked' && state.working.examples.every(example => example.pictureOnly), `${state.id} needs a picture-only working`)
  }
})
const rungOf = { 1: rungs[0], 5: rungs[1], 2: rungs[2], 3: rungs[3], 4: rungs[4] }
for (const pdf of [1, 2, 3, 4, 5]) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    const state = states.find(s => s.sourceRef === `A5.${pdf} ${question}` || (question === 'Q1' && s.sourceRef === `A5.${pdf} video + Q1`))
    assert.ok(state, `Missing A5.${pdf} ${question}`)
    assert.equal(state.microSkillId, rungOf[pdf])
  }
  const first = states.find(state => state.microSkillId === rungOf[pdf])
  assert.ok(first.video && first.sourceRef === `A5.${pdf} video + Q1`, `A5.${pdf}'s rung opens with its video, which works the PDF's Q1`)
}

// ---------- Every answer, put back into its equation (written out here as plain arithmetic) ----------
const equations = {
  'A5.1 video + Q1': [x => 5 * x - 3 - 27, [6]], 'A5.1 Q2': [x => x - 7 - 12, [19]], 'A5.1 Q3': [x => 7 * x + 5 - 40, [5]], 'A5.1 Q4a': [m => 2 * m + 3 - 17, [7]],
  'A5.1 Q5a': [n => 6 * n + 4 - 34, [5]], 'A5.1 Q5b': [x => 9 * x - 11 - 52, [7]], 'A5.1 Q5c': [x => 4 * x - 8 - 20, [7]],
  'A5.5 video + Q1': [x => 2 * x ** 2 - 50, [5, -5]], 'A5.5 Q2': [x => x ** 2 - 49, [7, -7]], 'A5.5 Q3': [x => 4 * Math.sqrt(x) - 20, [25]], 'A5.5 Q4a': [x => 3 * x * x - 108, [6, -6]],
  'A5.5 Q5a': [x => 3 * x ** 2 - 5 - 43, [4, -4]], 'A5.5 Q5b': [x => 2 * Math.sqrt(x) + 3 - 11, [16]], 'A5.5 Q5c': [x => x ** 2 - 36, [6, -6]],
  'A5.2 video + Q1': [x => 9 * x + 4 - (4 * x + 29), [5]], 'A5.2 Q2': [x => 5 * x - (2 * x + 12), [4]], 'A5.2 Q3': [x => 6 * x - 4 - (2 * x + 20), [6]],
  'A5.2 Q4a': [w => 4 * w + 10 - (6 * w + 2), [4]], 'A5.2 Q5a': [x => 10 * x - 7 - (4 * x + 29), [6]], 'A5.2 Q5c': [x => 5 * x + 9 - (2 * x + 3), [-2]],
  'A5.3 video + Q1': [x => 2 * (3 * x + 1) - (x + 22), [4]], 'A5.3 Q2': [x => 3 * (x + 2) - 15, [3]], 'A5.3 Q3': [x => 5 * (x - 2) - (2 * x + 11), [7]],
  'A5.3 Q4a': [x => 3 * (x + 1) - 2 * (x + 4), [5]], 'A5.3 Q5a': [x => 4 * (x + 3) - 2 * (3 * x - 2), [8]], 'A5.3 Q5c': [x => 3 * (x - 4) - (2 * x + 5), [17]],
  'A5.4 video + Q1': [x => (2 * x + 1) / 3 - 5, [7]], 'A5.4 Q2': [x => x / 4 - 6, [24]], 'A5.4 Q3': [x => (x + 2) / 3 - (x + 4) / 5, [1]],
  'A5.4 Q4a': [x => (3 * x - 1) / 4 - (x + 5) / 2, [11]], 'A5.4 Q5a': [x => (2 * x + 3) / 5 - (x + 6) / 3, [21]], 'A5.4 Q5c': [x => (x + 1) / 2 - (x + 7) / 4, [5]],
}
const near = (a, b) => Math.abs(a - b) < 1e-9
for (const [ref, [f, roots]] of Object.entries(equations)) {
  for (const r of roots) assert.ok(near(f(r), 0), `${ref}: ${r} solves it`)
  // No other answer: a linear equation changes when x does; a squared one only has ± the root.
  if (roots.length === 1 && !/A5\.5/.test(ref)) assert.ok(!near(f(roots[0] + 1), f(roots[0])), `${ref} has one answer`)
}
// Worked-out values from the answers, by hand.
const values = { 'A5.3 Q4b': 3 * (5 + 1), 'A5.4 Q4b': (11 + 5) / 2, 'A5.4 Q5b': (2 * 21 + 3) / 5 }
assert.equal((3 * 11 - 1) / 4, values['A5.4 Q4b'], 'Both bills give £8 each')
assert.equal((21 + 6) / 3, values['A5.4 Q5b'], 'Both fractions are 9')
assert.equal(2 * (5 + 4), values['A5.3 Q4b'], 'Bella pays the same £18')

const letterOf = ref => ({ 'A5.1 Q4a': 'm', 'A5.1 Q5a': 'n', 'A5.2 Q4a': 'w' })[ref] ?? 'x'
const typed = states.filter(state => state.interaction.type === 'numericInput')
for (const state of typed) {
  const { interaction, sourceRef } = state
  assert.ok(checkAnswer(interaction, interaction.correctAnswer), `${state.id} accepts its own answer`)
  if (values[sourceRef] !== undefined) {
    assert.equal(interaction.correctAnswer, values[sourceRef], `${state.id}: ${state.content.title}`)
    continue
  }
  const [, roots] = equations[sourceRef] ?? []
  assert.ok(roots, `${state.id} needs an independent equation`)
  const letter = letterOf(sourceRef)
  if (roots.length === 2) {
    assert.equal(interaction.responseShape, 'roots')
    assert.ok(checkAnswer(interaction, `${roots[1]}, ${roots[0]}`) && checkAnswer(interaction, `−${roots[0]}, ${roots[0]}`), `${state.id} accepts both answers in either order, with either minus sign`)
    assert.ok(!checkAnswer(interaction, String(roots[0])) && !checkAnswer(interaction, `${roots[0]}, ${roots[0]}`), `${state.id} needs both answers`)
  } else {
    assert.equal(interaction.correctAnswer, roots[0], `${state.id}: ${state.content.title}`)
    assert.ok(checkAnswer(interaction, `${letter} = ${roots[0]}`), `${state.id} accepts "${letter} = ${roots[0]}"`)
    assert.equal(state.answerPrefix, `${letter} =`, `${state.id} shows "${letter} =" before the box`)
  }
  assert.equal(state.diagnose(String(interaction.correctAnswer)), null, `${state.id} stays silent on the right answer`)
}
assert.equal(typed.length, Object.keys(equations).filter(ref => !/video|Q5c/.test(ref)).length + Object.keys(values).length, 'Every typed answer is checked')

// ---------- Every row of every board is true at the answer ----------
/** A side of the board as arithmetic: markers gone, fractions divided, roots and squares worked out. */
const js = side => side.replace(/[~^]/g, '').replace(/\{([^|]*)\|([^}]*)\}/g, '(($1)/($2))').replace(/√(\d+|[a-z])/g, 'Math.sqrt($1)')
  .replace(/²/g, '**2').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/(\d)(?=[a-z(M])/g, '$1*').replace(/\)(?=[\da-z(])/g, ')*')
const value = (expression, letter, x) => Function(letter, `return ${js(expression)}`)(x)
let rowsChecked = 0
for (const state of states) {
  const visual = state.working ?? state.visual
  if (visual.kind !== 'method-worked') continue
  const ref = state.sourceRef, [, roots] = equations[ref] ?? []
  if (!roots) continue
  const steps = visual.examples[0].steps, board = steps.findLast(step => step.frame.equation)?.frame.equation
  assert.ok(board, `${state.id} solves on the board`)
  const letter = letterOf(ref)
  for (const row of board.rows) {
    const claims = 'note' in row ? row.note.split(' and ').map(part => part.split(' = ')) : 'answer' in row ? [row.answer.split(' = ')] : [[row.left.replace(/[[\]]/g, ''), row.right.replace(/[[\]]/g, '')]]
    for (const [left, right] of claims) {
      if (/ or /.test(right)) continue
      assert.ok(near(value(left, letter, roots[0]), value(right, letter, roots[0])), `${state.id}: "${left} = ${right}" is true when ${letter} = ${roots[0]}`)
      rowsChecked++
    }
  }
  // The working ends on the answer, in its box, as the last row of the last move: no separate answer step, and no
  // row repeating it just above.
  const rowsText = board.rows.map(row => 'answer' in row ? row.answer : 'note' in row ? row.note : `${row.left} = ${row.right}`.replace(/[[\]~^]/g, ''))
  const answer = roots.length === 2 ? `x = ${roots[0]} or x = −${roots[0]}` : `${letter} = ${roots[0]}`.replace('-', '−')
  assert.deepEqual(board.rows.at(-1), { answer }, `${state.id}: the working ends on the answer, ${answer}`)
  assert.equal(board.rows.filter(row => 'answer' in row).length, 1, `${state.id}: one answer`)
  assert.ok(!steps.some(step => step.title === 'The answer'), `${state.id}: no separate answer step`)
  assert.ok(!rowsText.slice(0, -1).some(text => text.replace(/\s/g, '') === answer.replace(/\s/g, '')), `${state.id}: the answer isn't written twice`)
  // Every move boxes the part of the row above that it undoes, and every box sits in that row.
  for (const step of steps.filter(step => step.title !== 'Two answers')) assert.ok(step.frame.equation.rows.some(row => /\[/.test('left' in row ? row.left + row.right : '')), `${state.id}: "${step.title}" boxes what it undoes`)
  // One move per step: a new heading for each thing done to both sides.
  assert.ok(steps.every(step => step.title.split(/\bthen\b/).length === 1), `${state.id}: one move per step`)
}

// ---------- Choices ----------
for (const state of states.filter(state => state.interaction.type === 'select')) {
  const wrong = state.interaction.options.filter(option => option.id !== '0')
  assert.ok(wrong.length >= 2 && wrong.every(option => option.feedback?.trim()), `${state.id}: each wrong option needs its own message`)
  assert.ok(checkAnswer(state.interaction, '0') && !checkAnswer(state.interaction, '1'), `${state.id}: the first option is right`)
}
const right = ref => states.find(state => state.sourceRef === ref).interaction.options[0].label
assert.ok(right('A5.1 Q4b').includes(`${2 * 7 + 3}`) && right('A5.1 Q5c').endsWith(`x = ${(20 + 8) / 4}`), 'Taxi check and Tom')
assert.ok(right('A5.5 Q5c').includes(`(−6)² = ${(-6) ** 2}`), 'Ella')
assert.ok(right('A5.2 Q4b') === `Plan A: 4 × 4 + 10 = £${4 * 4 + 10}. Plan B: 6 × 4 + 2 = £${6 * 4 + 2}`, 'Phone plans')
assert.ok(right('A5.2 Q5b').includes(`${10 * 6 - 7}`) && 4 * 6 + 29 === 53, 'Both sides 53')
assert.ok(right('A5.2 Q5c').endsWith(`x = −${-((3 - 9) / 3)}`), 'Nina')
assert.ok(right('A5.3 Q5b').includes(`${4 * (8 + 3)}`) && 2 * (3 * 8 - 2) === 44, 'Both sides 44')
assert.ok(right('A5.3 Q5c').endsWith(`x = ${5 + 12}`) && right('A5.4 Q5c').endsWith('x = 5'), 'Leo and Zac')

// ---------- Wrong-answer messages ----------
const at = ref => states.find(state => state.sourceRef === ref)
const cases = [
  ['A5.1 Q2', '5', 'add 7'], ['A5.1 Q3', '45/7', 'take 5 away'], ['A5.1 Q3', '35', 'Divide both sides by 7'], ['A5.1 Q3', '1/5', 'not 7 by the number'],
  ['A5.1 Q5b', '41/9', 'add 11'], ['A5.1 Q4a', 'm = 10', 'take 3 away'],
  ['A5.5 Q2', '7', 'two answers'], ['A5.5 Q2', '7, 7', 'two answers'], ['A5.5 Q2', '49, -49', 'That’s x²'], ['A5.5 Q2', '24.5, -24.5', 'isn’t half'],
  ['A5.5 Q4a', '36, -36', 'That’s x²'], ['A5.5 Q5a', '4', 'two answers'],
  ['A5.5 Q3', '5', 'Square both sides'], ['A5.5 Q3', '10', 'not times 2'], ['A5.5 Q5b', '4', 'Square both sides'],
  ['A5.2 Q2', '12/7', 'take it away from both sides'], ['A5.2 Q3', '4', 'add 4'], ['A5.2 Q5a', '36', 'Divide both sides by 6'],
  ['A5.3 Q2', '13/3', 'both terms in the bracket'], ['A5.3 Q3', '13/3', 'both terms in the bracket'], ['A5.3 Q4a', '3', 'every term in each bracket'],
  ['A5.3 Q4b', '16', 'whole bracket'], ['A5.3 Q4b', '6', 'one ticket'],
  ['A5.4 Q2', '1.5', 'multiply both sides by 4'], ['A5.4 Q3', '-7', '15 ÷ 3 = 5'], ['A5.4 Q4a', '3', 'can’t just drop them'],
  ['A5.4 Q4b', '16', 'whole bill'], ['A5.4 Q5b', '45', 'Divide by the bottom'],
]
for (const [ref, response, expected] of cases) {
  const message = at(ref).diagnose(response)
  assert.ok(message && message.includes(expected), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}

// ---------- Videos ----------
assert.equal(states.filter(state => state.video).length, 5, 'One video per source PDF')
const mediaHashes = {
  'one-unknown.mp4': '9b12a368c33380a9d124af51cb36dc06520876816e25ef2ee380ebdc82ff29d6',
  'squares-and-roots.mp4': 'bc48f918a74660182cacae5079efe2c206bb4ad0c463d9931cc4a9872bebd8f8',
  'both-sides.mp4': 'b35ed1dc330e9718bbf65f3dca0a85eb73f4f7039d9fe17a5249654b418648e0',
  'brackets.mp4': '0c7dea505ce1bf003044a486d0bc9318458c170cfcea27f14aab3e5e7c70562c',
  'fractions.mp4': 'd0d67c4ad953b13b23e893120f10924adfba89c02add80344ddeb0d4b5c8538a',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-19', name)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
  assert.ok(states.some(state => state.video?.src === `/media/lesson-19/${name}`), `${name} must be used`)
}

// ---------- The course ----------
const { mathsLessons, lessonCode } = require('../src/features/maths/courseRegistry.ts')
const a5 = mathsLessons.find(entry => entry.number === 19)
assert.equal(a5.chapterId, 'algebra')
assert.equal(a5.position, 5, 'Students see A5 as Algebra lesson 5')
assert.equal(lessonCode(a5), 'A5')
const app = read('src/App.tsx')
assert.ok(app.includes('case 19:') && app.includes('return <TutorEquationsLesson />'), 'Lesson 19 must open from the course and its direct route')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  19: {'), 'A5 needs key-fact cards')

console.log(`Lesson 19 (A5) verified: ${states.length} screens, all 38 source questions, ${Object.keys(equations).length} equations solved independently, ${typed.length} typed answers (other spellings and orders too), ${rowsChecked} board rows true at the answer, ${cases.length} wrong-answer messages, 5 source-identical videos and the route.`)

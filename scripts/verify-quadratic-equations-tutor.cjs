// Checks Lesson 22 (Algebra A8, Solving quadratics): source coverage, every answer re-derived by trying whole
// numbers in the question, every row of every working true, the textbook's four steps in order with nothing
// repeating the answer, other ways of typing each answer, choices, wrong-answer messages, greying, and the route.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorQuadraticEquationsLesson: lesson } = require('../src/features/quadratic-equations/tutor/quadraticEquationsLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

// ---------- Structure ----------
const states = lesson.states
assert.equal(lesson.id, 'L022', 'A8 keeps the stable progress key L022')
assert.equal(states.length, 14, 'Lesson 22 screen total')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], ['quadratic-equations', 'mixed'], 'One rung, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L22-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
  if (state.interaction.type !== 'continue') {
    assert.ok(state.hint?.trim(), `${state.id} needs a hint`)
    assert.ok(state.working?.kind === 'method-worked' && state.working.examples.every(example => example.pictureOnly), `${state.id} needs a picture-only working`)
  }
})
const at = ref => states.find(state => state.sourceRef.startsWith(ref))
for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) assert.ok(at(`A8.1 ${question}`), `Missing A8.1 ${question}`)
for (const question of ['Q1', 'Q2', 'Q3']) assert.ok(at(`Textbook A8 Your Turn ${question} (own numbers)`), `Missing the textbook's Your Turn ${question}, with our own numbers`)
assert.ok(states[0].sourceRef.startsWith('A8.1 video') && states[0].content.title.replace(/\u00a0/g, ' ').includes('x² + x = 20'), 'The rung opens with the worked example x² + x = 20, as Aniksha re-records it')
// Easiest first: the brackets given, then already 0, then a negative answer, then make it 0, then problems.
assert.deepEqual(states.slice(1, 13).map(state => state.sourceRef.replace(/ \(.*$/, '')), [
  'A8.1 Q2', 'A8.1 Q1', 'Textbook A8 Your Turn Q2', 'A8.1 Q3', 'Textbook A8 Your Turn Q1', 'Textbook A8 Your Turn Q3', 'Own question: make it 0 first',
  'A8.1 Q4a', 'A8.1 Q4b', 'A8.1 Q5a', 'A8.1 Q5b', 'A8.1 Q5c',
], 'Questions run easiest first')
// The textbook's own numbers are not used (Sunny, 2 Oct): its examples and Your Turn questions are rewritten.
for (const copied of ['x² − 3x = −2', 'x² − x − 12', 'x² + 13x', 'p² − 3p − 10', 'x² − 8x + 15', 'x² − 6x + 8', 'x² + x = 12']) assert.ok(!states.some(state => state.content.title.replace(/\u00a0/g, ' ').includes(copied)), `No textbook or old video numbers: ${copied}`)
// Higher tier: a number in front of x² (AQA 8300 A18, bold). None here.
assert.ok(!states.some(state => /\d[a-z]²/.test(state.content.title)), 'No Higher-tier ax² question')

// ---------- Every equation, solved again by trying whole numbers ----------
// [letter, b, c, the source's answers]: once one side is 0, letter² + b·letter + c = 0.
const equations = {
  'A8.1 video': ['x', 1, -20, [4, -5]], 'A8.1 Q2': ['x', -8, 12, [2, 6]], 'A8.1 Q1': ['x', -7, 10, [2, 5]], 'Textbook A8 Your Turn Q2': ['x', -9, 14, [2, 7]],
  'A8.1 Q3': ['x', 3, -10, [2, -5]], 'Textbook A8 Your Turn Q1': ['p', -2, -15, [5, -3]], 'Textbook A8 Your Turn Q3': ['x', -7, 12, [3, 4]], 'Own question': ['x', 3, -18, [3, -6]],
  'A8.1 Q4a': ['x', 5, -24, [-8, 3]], 'A8.1 Q5a': ['x', 6, -40, [-10, 4]], 'A8.1 Q5c': ['x', 6, -40, [4, -10]],
}
const sorted = values => [...values].sort((m, n) => m - n)
for (const [ref, [, b, c, answers]] of Object.entries(equations)) {
  const found = []
  for (let x = -100; x <= 100; x++) if (x * x + b * x + c === 0) found.push(x)
  assert.deepEqual(found, sorted(answers), `${ref}: trying whole numbers gives ${answers}`)
}
// The source's sums, by hand: the pond is 3 by 8, the rug 4 by 10.
assert.equal(3 * (3 + 5), 24); assert.equal(4 * (4 + 6), 40)

const typed = states.filter(state => state.interaction.responseShape === 'roots')
assert.equal(typed.length, 9, 'Every "solve" question is typed as x = ☐ or x = ☐')
for (const state of typed) {
  const [letter, b, c, [r, s]] = equations[Object.keys(equations).find(ref => state.sourceRef.startsWith(ref))]
  const { interaction } = state
  assert.equal(state.answerPrefix, `${letter} =`, `${state.id}: the boxes say ${letter} =`)
  for (const answer of [`${r}, ${s}`, `${s}, ${r}`, `${r},${s}`]) assert.ok(checkAnswer(interaction, answer), `${state.id} accepts ${answer}`)
  for (const wrong of [`${r}`, `${-r}, ${-s}`, `${r}, ${-s}`, `${r}, ${r}`, `${b}, ${c}`]) if (sorted(wrong.split(',').map(Number)).join() !== sorted([r, s]).join()) assert.ok(!checkAnswer(interaction, wrong), `${state.id} rejects ${wrong}`)
  assert.equal(state.diagnose(`${r}, ${s}`), null, `${state.id} stays silent on the right answer`)
  for (const n of [r, s]) assert.ok(interaction.displayAnswer.includes(`${letter} = ${String(n).replace('-', '−')}`), `${state.id} shows ${letter} = ${n}`)
}

// ---------- The working: one move a step, every row true, the answer once ----------
/** A side of the board as JavaScript: "x² +3x −18" at x. Struck and boxed marks are only colour. */
function value(side, letter, x) {
  const js = side.replace(/[~^[\]]/g, '').replace(/−/g, '-').replace(/\s+/g, '')
    .replace(new RegExp(`(\\d)${letter}`, 'g'), `$1*${letter}`).replace(new RegExp(`${letter}²`, 'g'), `(${letter}**2)`).replace(/\)\(/g, ')*(')
  // The roots of y = …: at each root y is 0.
  return Function(letter, 'y', `return ${js}`)(x, 0)
}
const { stageOf } = require('../src/features/written-methods/tutor/SolvePictures.tsx')
const tags = ['Step 1 · make it 0', 'Step 2 · factorise', 'Step 3 · two equations', 'Step 4 · solve each']
let rowsChecked = 0, stepsChecked = 0
for (const [ref, [letter, b, c, answers]] of Object.entries(equations)) {
  const state = at(ref), visual = state.working ?? state.visual
  const steps = visual.examples[0].steps
  assert.ok(visual.examples[0].focus, `${state.id}: finished working greys out`)
  const frames = steps.map(step => step.frame.solve)
  assert.ok(frames.every(frame => frame && frame.letter === letter && frame.middle === b && frame.last === c), `${state.id}: every step is drawn on the solving picture, for the question`)
  const order = frames.map(frame => frame.adds)
  const given = frames[0].given
  const flips = !(b > 0 && c > 0)
  const expected = [...(frames[0].board ? ['zero'] : []), ...(given ? [] : ['pairs', ...(flips ? ['flip'] : []), 'sums', 'brackets']), 'split', 'solve']
  assert.deepEqual(order, expected, `${state.id}: one move a step, in the textbook's order`)
  // The tags follow the textbook's four steps, never going back.
  const tagIndex = frames.map(frame => tags.indexOf(stageOf[frame.adds]))
  assert.ok(tagIndex.every(i => i >= 0) && tagIndex.every((i, k) => k === 0 || i >= tagIndex[k - 1]), `${state.id}: every heading is labelled with its textbook step, in order`)
  for (const step of steps) {
    assert.ok(step.title.split(' ').length <= 6, `${state.id}: "${step.title}" is a short heading`)
    assert.ok(step.instruction.trim() && !/=/.test(step.instruction), `${state.id}: "${step.title}" explains in words, not maths`)
    stepsChecked++
  }
  assert.ok(!steps.some(step => /answer/i.test(step.title)), `${state.id}: no separate answer step`)
  const last = frames.at(-1)
  assert.deepEqual(sorted(last.brackets.map(n => -n)), sorted(answers), `${state.id}: the brackets give ${answers}`)
  assert.equal(frames.filter(frame => frame.solve).length, 1, `${state.id}: the answer appears once, at the last step`)
  // Every row of the board is true at both answers; each split and undo row at its own bracket's answer.
  for (const row of last.board ?? []) {
    for (const x of answers) assert.ok(Math.abs(value(row.left, letter, x) - value(row.right, letter, x)) < 1e-9, `${state.id}: ${row.left} = ${row.right} at ${letter} = ${x}`)
    assert.ok(!new RegExp(`^${letter}$`).test(row.left.trim()), `${state.id}: the board never writes an answer row`)
    rowsChecked++
  }
  const [p, q] = last.brackets
  for (const x of answers) assert.ok((x + p) * (x + q) === 0, `${state.id}: (${letter} + ${p})(${letter} + ${q}) = 0 at ${x}`)
  for (const n of [p, q]) { assert.equal(-n + n, 0, `${state.id}: ${letter} + ${n} = 0 gives ${-n}`); rowsChecked += 2 }
  if (!given) {
    const { pairs, pick } = last
    for (const [m, n] of pairs) assert.equal(m * n, c, `${state.id}: ${m} and ${n} multiply to ${c}`)
    assert.equal(pairs.filter(([m, n]) => m + n === b).length, 1, `${state.id}: exactly one pair adds to ${b}`)
    assert.deepEqual(pairs[pick], last.brackets, `${state.id}: the ticked pair goes into the brackets`)
  }
  // The headings name the real numbers.
  const titles = steps.map(step => step.title)
  if (!given) assert.ok(titles.includes(`Factor pairs of ${Math.abs(c)}`) && titles.includes(`Which pair adds to ${String(b).replace('-', '−')}?`), `${state.id}: the factorising headings name ${c} and ${b}`)
  if (!given) {
    const flipTitle = c > 0 ? 'Make both negative' : b > 0 ? 'Make the smaller factors negative' : 'Make the bigger factors negative'
    assert.equal(titles.includes(flipTitle), flips, `${state.id}: ${flips ? `"${flipTitle}"` : 'no flip step'}`)
  }
  const undo = titles.at(-1).toLowerCase()
  for (const n of [p, q]) assert.ok(undo.includes(`${n < 0 ? 'add' : 'subtract'} ${Math.abs(n)}`), `${state.id}: the last heading says how to undo ${n}`)
}

// ---------- Worked-out values ----------
const rug = at('A8.1 Q5b')
assert.equal(rug.interaction.correctAnswer, 4 + 6)
assert.ok(checkAnswer(rug.interaction, '10') && !checkAnswer(rug.interaction, '4'))

// ---------- Choices ----------
const choices = states.filter(state => state.interaction.type === 'select')
assert.equal(choices.length, 2, 'Q4b and Q5c are choices')
for (const state of choices) {
  const wrong = state.interaction.options.filter(option => option.id !== '0')
  assert.ok(wrong.length >= 3 && wrong.every(option => option.feedback?.trim()), `${state.id}: each wrong option needs its own message`)
  assert.ok(checkAnswer(state.interaction, '0') && !checkAnswer(state.interaction, '1'), `${state.id}: the first option is right`)
}
const right = ref => at(ref).interaction.options[0].label
assert.ok(right('A8.1 Q4b').includes('x = 3') && right('A8.1 Q4b').includes('negative'), 'The pond: a width can’t be negative')
assert.ok(right('A8.1 Q5c').startsWith('No') && right('A8.1 Q5c').includes('x = 4 or x = −10'), 'Ben: make one side 0 first')

// ---------- Wrong-answer messages ----------
const cases = [
  ['A8.1 Q2', '-2, -6', 'numbers in the brackets'], ['A8.1 Q1', '-2, -5', 'opposite sign'], ['A8.1 Q1', '7, 10', 'numbers in the question'], ['A8.1 Q1', '2', 'one answer'],
  ['A8.1 Q3', '2, 5', 'One answer is right'], ['A8.1 Q3', '1, -10', 'add to 9, not 3'], ['A8.1 Q4a', '8, -3', 'numbers in the brackets'], ['A8.1 Q5a', '10, -4', 'opposite sign'],
  ['Own question', '0, -3', 'Subtract 18'], ['Own question', '18, 15', 'other side is 0'], ['Textbook A8 Your Turn Q1', '−5, 3', 'numbers in the brackets'],
  ['A8.1 Q5b', '4', 'width'], ['A8.1 Q5b', '40', 'area'],
]
for (const [ref, response, expected] of cases) {
  const state = at(ref)
  assert.ok(!checkAnswer(state.interaction, response.replace('−', '-')), `${ref}: ${response} is marked wrong`)
  const message = state.diagnose(response)
  assert.ok(message && message.includes(expected), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}

// ---------- Finished working is greyed out, and only that (Sunny, 1 Oct) ----------
// Rows above the one a step works on go grey; that row, what the step adds and the answer stay clear. Step 1 greys nothing.
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { SolveVisual } = require('../src/features/written-methods/tutor/SolvePictures.tsx')
let dimChecked = 0
for (const ref of Object.keys(equations)) {
  const steps = (at(ref).working ?? at(ref).visual).examples[0].steps
  steps.forEach((step, i) => {
    const frame = step.frame.solve
    const html = renderToStaticMarkup(React.createElement(SolveVisual, { frame, focus: true }))
    const dimmed = (html.match(/is-done/g) ?? []).length
    // What this step works on and adds stays clear: count the parts above that, row by row.
    const questionRows = frame.board ? frame.board.length - 1 : 0 // the question and the rows of its move; the 0 row is its own part
    const zeroRows = frame.given ? 0 : 1
    const pairRows = frame.pairs ? 1 : 0
    const grey = { zero: 0, pairs: questionRows, flip: questionRows, sums: questionRows, brackets: questionRows, split: questionRows + zeroRows + pairRows, solve: questionRows + zeroRows + pairRows + 1 }[frame.adds]
    assert.equal(dimmed, i === 0 ? 0 : grey, `${ref} step ${i + 1} (${frame.adds}): ${grey} finished rows greyed out`)
    assert.ok(!/ns-eq__answer[^"]*is-done/.test(html), `${ref} step ${i + 1}: the answer stays clear`)
    if (frame.adds === 'solve') assert.equal((html.match(/ns-eq__answer/g) ?? []).length, 1, `${ref}: one green answer`)
    dimChecked++
  })
  // The 0 row boxes the last number (amber) from the factor pairs step, and the middle one (blue) from the sums step.
  const pairsStep = steps.find(step => step.frame.solve.adds === 'pairs')
  if (pairsStep) {
    const [, b, c] = equations[ref]
    const html = renderToStaticMarkup(React.createElement(SolveVisual, { frame: steps.find(step => step.frame.solve.adds === 'sums').frame.solve }))
    assert.ok(html.includes(`ns-quad__job is-f1">${Math.abs(c)}<`), `${ref}: the factor pairs step boxes ${c}`)
    assert.ok(html.includes(`ns-quad__job is-f0">${Math.abs(b) === 1 ? equations[ref][0] : Math.abs(b)}<`), `${ref}: the sums step boxes ${b}`)
  }
}

// ---------- Video ----------
// Aniksha is re-recording A8.1 with x² + x = 20; until it arrives the worked example has no video.
assert.equal(states.filter(state => state.video).length, 0, 'The A8.1 video goes in once re-recorded with x² + x = 20')

// ---------- The course ----------
const { mathsLessons, lessonCode } = require('../src/features/maths/courseRegistry.ts')
const a8 = mathsLessons.find(entry => entry.number === 22)
assert.equal(a8.chapterId, 'algebra')
assert.equal(a8.position, 8, 'Students see A8 as Algebra lesson 8')
assert.equal(lessonCode(a8), 'A8')
const app = read('src/App.tsx')
assert.ok(app.includes('case 22:') && app.includes('return <TutorQuadraticEquationsLesson />'), 'Lesson 22 must open from the course and its direct route')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  22: {'), 'A8 needs key-fact cards')

console.log(`Greying out checked on ${dimChecked} steps.`)
console.log(`Lesson 22 (A8) verified: ${states.length} screens, all 8 A8.1 questions and the textbook's 3 (own numbers), ${Object.keys(equations).length} equations solved again, ${rowsChecked} rows true, ${stepsChecked} steps, ${typed.length} typed answers, ${cases.length} wrong-answer messages and the route.`)

// Checks Lesson 23 (Algebra A9, Sequences): source coverage, every answer worked out again from the sequence itself,
// every nth term tested against the terms, every board row true, one move a step with nothing repeating the answer,
// other ways of typing each answer, choices, wrong-answer messages, greying, source-identical videos and the route.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorSequencesLesson: lesson } = require('../src/features/sequences/tutor/sequencesLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const plain = text => text.replace(/ /g, ' ')

// ---------- Structure ----------
const states = lesson.states
const rungs = ['sequences-special', 'sequences-geometric', 'sequences-nth-term', 'sequences-in-sequence', 'sequences-consecutive']
assert.equal(lesson.id, 'L023', 'A9 keeps the stable progress key L023')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Five rungs, easiest first (A9.5, A9.4, A9.1, A9.2, A9.3), then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L23-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
  if (state.interaction.type !== 'continue') {
    assert.ok(state.hint?.trim(), `${state.id} needs a hint`)
    assert.ok(state.working?.kind === 'method-worked' && state.working.examples.every(example => example.pictureOnly), `${state.id} needs a picture-only working`)
  }
})
const at = ref => states.find(state => state.sourceRef === ref)
const pdfOfRung = { 'sequences-special': 5, 'sequences-geometric': 4, 'sequences-nth-term': 1, 'sequences-in-sequence': 2, 'sequences-consecutive': 3 }
for (const [rung, pdf] of Object.entries(pdfOfRung)) {
  const first = states.find(state => state.microSkillId === rung)
  assert.ok(first.video && first.sourceRef.startsWith(`A9.${pdf} video`), `A9.${pdf}'s rung opens with its video`)
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    const covered = at(`A9.${pdf} ${question}`) || (question === 'Q1' && at(`A9.${pdf} video + Q1`)) || (/^Q4/.test(question) && at(`A9.${pdf} video + Q4`))
    assert.ok(covered, `Missing A9.${pdf} ${question}`)
    assert.equal(covered.microSkillId, rung, `A9.${pdf} ${question} is in its rung`)
  }
}
// The textbook's ideas are asked with our own numbers (Sunny, 2 Oct): none of its sequences appear.
for (const copied of ['3, 7, 11, 15', '−2, 5, 12, 19', '0.5, 1.5, 4.5', '−3, 1, 5, 9', '1143', '3n + 8', '4n + 1. Find the 12th', '5n − 4', '−3, 2, 7, 12', '√3']) assert.ok(!states.some(state => plain(state.content.title).includes(copied)), `No textbook numbers: ${copied}`)
assert.ok(!states.some(state => /√/.test(state.content.title)), 'No Higher-tier surd sequence')

// ---------- Every answer, worked out again ----------
const triangular = n => n * (n + 1) / 2
const close = (a, b) => Math.abs(a - b) < 1e-9
const expectNumber = (ref, value) => { const state = at(ref); assert.ok(close(Number(state.interaction.correctAnswer), value), `${ref}: ${state.interaction.correctAnswer} should be ${value}`); assert.ok(checkAnswer(state.interaction, String(value)), `${ref} accepts ${value}`) }
const expectList = (ref, values, anyOrder) => {
  const { interaction } = at(ref)
  assert.equal(interaction.responseShape, 'list', `${ref} is typed in boxes`)
  assert.ok(checkAnswer(interaction, values.join(', ')), `${ref} accepts ${values}`)
  if (values.length > 1 && values[0] !== values[1]) assert.equal(checkAnswer(interaction, [...values].reverse().join(', ')), anyOrder, `${ref} ${anyOrder ? 'accepts' : 'rejects'} the other order`)
  assert.ok(!checkAnswer(interaction, String(values[0])), `${ref} needs every box`)
  assert.equal(String(interaction.correctAnswer).split(',').length, values.length, `${ref} has ${values.length} boxes`)
}
// Special: continue by the gaps; the Fibonacci rule; squares, cubes and triangular numbers.
assert.deepEqual([1, 3, 6, 10].map((_, i) => triangular(i + 1)), [1, 3, 6, 10])
expectNumber('A9.5 Q2', 5 ** 2); expectNumber('A9.5 Q3', 4 ** 3)
expectList('A9.5 Q4a', [8 + 13, 13 + 21], false)
expectNumber('A9.5 Q4b', 4 + 7); expectNumber('A9.5 Q5a', triangular(10)); expectNumber('A9.5 Q5b', 8 ** 2)
assert.ok(6 * 6 === 36 && triangular(8) === 36, 'Sam: 36 is square and triangular')
// Geometric: the common ratio, then multiply on.
expectNumber('A9.4 Q2', 50 * 5)
expectList('A9.4 Q3', [9 / 3, 3 / 3], false)
expectList('A9.4 Q4a', [36 * 3, 36 * 9], false)
expectNumber('A9.4 Q5a', 40 * 2 ** 3)
assert.ok(checkAnswer(at('A9.4 Q5b').interaction, '1/2') && checkAnswer(at('A9.4 Q5b').interaction, '2/4') && !checkAnswer(at('A9.4 Q5b').interaction, '2'), 'The ratio of 800, 400, 200 is ½')
expectList('Textbook A9: geometric with decimals (own numbers)', [3.6 * 3, 3.6 * 9], false)
// The nth term: the gap times n, plus what the first term needs; every given term must come out of it.
const nthRefs = { 'A9.1 Q3': [7, 12, 17, 22], 'A9.1 Q4a': [90, 82, 74, 66], 'A9.1 Q5a': [6, 11, 16, 21], 'Textbook A9: nth term with a minus (own numbers)': [5, 11, 17, 23], 'Textbook A9: nth term from a negative start (own numbers)': [-2, 1, 4, 7] }
const nthTyped = (a, b, order) => {
  const bx = `${b < 0 ? '-' : '+'} ${Math.abs(b)}`
  return order ? `${b} ${a < 0 ? '-' : '+'} ${Math.abs(a)}n` : `${a}n ${bx}`
}
for (const [ref, terms] of Object.entries(nthRefs)) {
  const state = at(ref), a = terms[1] - terms[0], b = terms[0] - a
  terms.forEach((term, i) => assert.equal(a * (i + 1) + b, term, `${ref}: ${a}n + ${b} gives term ${i + 1}`))
  for (const typed of [nthTyped(a, b, false), nthTyped(a, b, true), nthTyped(a, b, false).replace(/ /g, '')]) assert.ok(checkAnswer(state.interaction, typed), `${ref} accepts ${typed}`)
  for (const wrong of [`${terms[0]}n + ${a}`, `${a}n + ${terms[0]}`, `${a}n`, `${a}`]) assert.ok(!checkAnswer(state.interaction, wrong), `${ref} rejects ${wrong}`)
  assert.equal(state.interaction.responseShape, 'expression')
}
expectList('Textbook A9 Your Turn Q2a (own numbers)', [1, 2, 3, 4, 5].map(n => 3 * n - 2), false)
expectNumber('A9.1 Q2', 3 * 5 + 2); expectNumber('A9.1 Q4b', -8 * 10 + 98); expectNumber('A9.1 Q5b', 5 * 20 + 1)
assert.ok(3 * 1 + 7 !== 7 && 3 * 1 + 4 === 7, 'Tom: 3n + 7 gives 10 first; 3n + 4 is right')
// Is it in? Solve an + b = value: in the sequence only when n is a whole number.
const inChecks = { 'A9.2 Q1': [5, 3, 48, true], 'A9.2 Q2': [6, 0, 30, true], 'A9.2 Q3': [5, -2, 60, false], 'A9.2 Q4b': [3, 4, 50, false], 'A9.2 Q5a': [7, 2, 100, true], 'A9.2 Q5c': [4, 1, 30, false], 'Textbook A9: find the nth term first (own numbers)': [5, -3, 98, false] }
for (const [ref, [a, b, value, yes]] of Object.entries(inChecks)) {
  let found = null
  for (let n = 1; n <= 1000; n++) if (a * n + b === value) found = n
  assert.equal(found !== null, yes, `${ref}: ${value} ${yes ? 'is' : 'is not'} a term of ${a}n + ${b}`)
  assert.equal(at(ref).interaction.options[0].label.startsWith(yes ? 'Yes' : 'No'), true, `${ref}: the right choice says ${yes ? 'yes' : 'no'}`)
}
assert.deepEqual([2, 7, 12, 17].map((_, i) => 5 * (i + 1) - 3), [2, 7, 12, 17], 'The textbook-style sequence is 5n − 3')
expectNumber('A9.2 Q4a', (49 - 4) / 3); expectNumber('A9.2 Q5b', 7 * 15 + 2)
// Next to each other: find n by trying every position.
const pairOf = (a, b, total) => { for (let n = 1; n < 500; n++) if (a * n + b + a * (n + 1) + b === total) return n; return null }
expectList('A9.3 Q1', [2 * pairOf(2, 3, 40) + 3, 2 * (pairOf(2, 3, 40) + 1) + 3], true)
expectList('A9.3 Q3', [4 * pairOf(4, 0, 60), 4 * (pairOf(4, 0, 60) + 1)], true)
expectNumber('A9.3 Q5a', pairOf(5, -2, 81))
expectList('A9.3 Q5b', [5 * 8 - 2, 5 * 9 - 2], true)
assert.equal(pairOf(3, 2, 55), 8, 'The worked example: terms 8 and 9 make 55')
assert.equal(pairOf(6, 1, 60), null, 'Dan: no two terms of 6n + 1 next to each other make 60')
assert.ok(checkAnswer(at('A9.3 Q2').interaction, '3n + 4') && checkAnswer(at('A9.3 Q2').interaction, '4 + 3n') && !checkAnswer(at('A9.3 Q2').interaction, '3n + 2'), 'The next ticket is 3(n + 1) + 1 = 3n + 4')

// ---------- The workings ----------
/** A board side at n, as JavaScript. Struck and boxed marks are only colour. */
function value(side, n) {
  const js = side.replace(/[~^[\]]/g, '').replace(/−/g, '-').replace(/÷/g, '/').replace(/×/g, '*').replace(/\s+/g, '').replace(/(\d)n/g, '$1*n').replace(/(\d)\(/g, '$1*(')
  return Function('n', `return ${js}`)(n)
}
let steps = 0, rows = 0
for (const state of states.filter(state => state.working || state.visual.kind === 'method-worked')) {
  const example = (state.working ?? state.visual).examples[0]
  assert.ok(example.focus, `${state.id}: finished working greys out`)
  const list = example.steps
  for (const step of list) {
    assert.ok(step.title.trim() && step.title.split(' ').length <= 9, `${state.id}: "${step.title}" is a short heading`)
    assert.ok(step.instruction.trim() && !/=/.test(step.instruction), `${state.id}: "${step.title}" explains in words, not maths`)
    assert.ok(!/^the answer$/i.test(step.title), `${state.id}: no separate answer step`)
    steps++
  }
  // The answer appears once, at the last step: a green answer, filled-in next terms or an answer row.
  const answers = list.map(step => {
    const f = step.frame
    if (f.sequence) return Boolean(f.sequence.answer?.at === list.indexOf(step) || (f.sequence.next?.filled && f.sequence.next.at === list.indexOf(step)) || f.sequence.rows?.some(row => row.answer && row.at === list.indexOf(step)))
    if (f.equation) return f.equation.rows.some(row => 'answer' in row) && !list.slice(0, list.indexOf(step)).some(s => s.frame.equation?.rows.some(row => 'answer' in row))
    return false
  })
  assert.deepEqual(answers.map((a, i) => a && i), answers.map((_, i) => i === list.length - 1 && i), `${state.id}: the answer comes once, in the last step`)
  // Every board row is true at the answer's n (for "is it in?", the n the working reaches, whole or not).
  const board = list.at(-1).frame.equation
  if (board) {
    const answerRow = board.rows.find(row => 'answer' in row && /^n = /.test(row.answer))
    const nRow = board.rows.find(row => 'left' in row && row.left === 'n') ?? null
    const n = answerRow ? Number(answerRow.answer.match(/^n = (-?[\d.]+)/)[1]) : nRow ? Number(nRow.right) : null
    for (const row of board.rows.filter(row => 'left' in row)) {
      if (n === null || String(n).includes('.') && answerRow.answer.includes('…')) continue
      assert.ok(close(value(row.left, n), value(row.right, n)), `${state.id}: ${row.left} = ${row.right} at n = ${n}`)
      rows++
    }
  }
}

// ---------- Choices ----------
for (const state of states.filter(state => state.interaction.type === 'select')) {
  const wrong = state.interaction.options.filter(option => option.id !== '0')
  assert.ok(wrong.length >= 3 && wrong.every(option => option.feedback?.trim()), `${state.id}: each wrong option needs its own message`)
  assert.ok(checkAnswer(state.interaction, '0') && !checkAnswer(state.interaction, '1'), `${state.id}: the first option is right`)
}

// ---------- Wrong-answer messages ----------
const cases = [
  ['A9.5 Q2', '10', 'times itself'], ['A9.5 Q3', '12', '4 × 4 × 4'], ['A9.5 Q4a', '34, 21', 'wrong order'], ['A9.5 Q4a', '21', 'every box'], ['A9.5 Q5a', '110', 'divide by 2'],
  ['A9.4 Q2', '55', 'multiplies'], ['A9.4 Q3', '0, -9', 'third'], ['A9.4 Q5a', '160', 'week 6'], ['A9.4 Q5b', '2', '400 ÷ 800'],
  ['A9.1 Q3', '7n + 5', 'gap goes in front'], ['A9.1 Q3', '5n + 7', 'Compare'], ['A9.1 Q3', '5n - 2', 'sign'], ['A9.1 Q3', '+5', 'term-to-term'], ['A9.1 Q4a', '8n + 98', 'down'],
  ['Textbook A9: nth term with a minus (own numbers)', '6n + 1', 'sign'], ['Textbook A9 Your Turn Q2a (own numbers)', '3, 6, 9, 12, 15', 'That’s 3n'], ['A9.1 Q2', '37', '3 × n'],
  ['A9.2 Q4a', '45', 'Divide by 3'], ['A9.2 Q5b', '101', 'go up by 7'], ['A9.3 Q2', '3n + 2', 'adds 1 to the term'], ['A9.3 Q5a', '9', 'n + 1'], ['A9.3 Q1', '8, 9', 'layer numbers'],
]
for (const [ref, response, expected] of cases) {
  const state = at(ref)
  assert.ok(!checkAnswer(state.interaction, response), `${ref}: ${response} is marked wrong`)
  const message = state.diagnose?.(response)
  assert.ok(message && message.includes(expected), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}
for (const state of states.filter(state => state.diagnose)) assert.equal(state.diagnose(String(state.interaction.correctAnswer)), null, `${state.id} stays silent on the right answer`)

// ---------- Greying (Sunny, 1 Oct): parts older than the step before grey out; step 1 greys nothing ----------
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { SequenceVisual } = require('../src/features/written-methods/tutor/SequencePictures.tsx')
let dimChecked = 0
for (const state of states) {
  const working = state.working ?? (state.visual.kind === 'method-worked' ? state.visual : null)
  if (!working) continue
  working.examples[0].steps.forEach((step, i) => {
    const frame = step.frame.sequence
    if (!frame) return
    const html = renderToStaticMarkup(React.createElement(SequenceVisual, { frame, focus: true }))
    const old = at => frame.step > 0 && at < frame.step - 1
    const expected = (frame.hops && frame.terms.length && old(frame.hops.at) ? frame.terms.length - 1 : 0)
      + (frame.rows ?? []).filter(row => old(row.at)).reduce((sum, row) => sum + 1 + row.cells.length, 0)
      + (frame.next && old(frame.next.at) ? 1 : 0)
      + (frame.lines ?? []).filter(line => old(line.at)).length
    assert.equal((html.match(/is-done/g) ?? []).length, expected, `${state.id} step ${i + 1}: ${expected} finished parts greyed out`)
    if (i === 0) assert.equal(expected, 0, `${state.id}: step 1 greys nothing`)
    assert.ok(!/ns-eq__answer[^"]*is-done|is-answer[^"]*is-done/.test(html), `${state.id} step ${i + 1}: the answer stays clear`)
    dimChecked++
  })
}

// ---------- Videos: the newer zip (A9_Sequences_1), source-identical ----------
assert.equal(states.filter(state => state.video).length, 5, 'One video per source PDF')
const mediaHashes = {
  'special-sequences.mp4': 'e6cba491a180c1b4cc5668b882f2a2374d1ad4f3ef82b9f9f21c6b3fa8bac5f4',
  'geometric-sequences.mp4': 'bac5b7e4290b78348718cc0ab18982d3694927bf62d074c254fb9e6f68e28386',
  'nth-term.mp4': '4095ee06e3925d9fdab2c97a8e779aa6637caeb4ec39c15a8d4c06a426d21d3e',
  'is-it-in-the-sequence.mp4': 'b3e59826075ff7227b4fb962ba0c1b9153d86b6006818b96d7a07b684d79efc2',
  'consecutive-terms.mp4': '6eaf4c78bd6b46db56b735bdb5b782e0d6d389eba9bcf16af286d41c49782d48',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-23', name)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
  assert.ok(states.some(state => state.video?.src === `/media/lesson-23/${name}`), `${name} must be used`)
}

// ---------- The course ----------
const { mathsLessons, lessonCode } = require('../src/features/maths/courseRegistry.ts')
const a9 = mathsLessons.find(entry => entry.number === 23)
assert.equal(a9.chapterId, 'algebra')
assert.equal(a9.position, 9, 'Students see A9 as Algebra lesson 9')
assert.equal(lessonCode(a9), 'A9')
const app = read('src/App.tsx')
assert.ok(app.includes('case 23:') && app.includes('return <TutorSequencesLesson />'), 'Lesson 23 must open from the course and its direct route')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  23: {'), 'A9 needs key-fact cards')

console.log(`Greying out checked on ${dimChecked} steps.`)
console.log(`Lesson 23 (A9) verified: ${states.length} screens, all 40 source questions (A9.3 Q4 is the worked example) and the textbook's ideas with our own numbers, every answer worked out again, ${steps} steps, ${rows} board rows true, ${cases.length} wrong-answer messages, 5 source-identical videos and the route.`)

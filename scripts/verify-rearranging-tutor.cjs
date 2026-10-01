// Checks Lesson 20 (Algebra A6, Rearranging formulae): source coverage, every rearranged formula put back into the
// original with numbers, every row of every board true for those numbers, other ways of typing each formula,
// wrong-answer messages, worked-out values, source-identical videos and the route.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorRearrangingLesson: lesson } = require('../src/features/rearranging/tutor/rearrangingLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

// ---------- Structure ----------
const states = lesson.states
const rungs = ['rearrange-linear', 'rearrange-fractions', 'rearrange-squares', 'rearrange-roots']
assert.equal(lesson.id, 'L020', 'A6 keeps the stable progress key L020')
assert.equal(states.length, 33, 'Lesson 20 screen total')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Four rungs, in the PDFs’ order, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L20-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
  if (state.interaction.type !== 'continue') {
    assert.ok(state.hint?.trim(), `${state.id} needs a hint`)
    assert.ok(state.working?.kind === 'method-worked' && state.working.examples.every(example => example.pictureOnly), `${state.id} needs a picture-only working`)
  }
})
for (const pdf of [1, 2, 3, 4]) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    const state = states.find(s => s.sourceRef === `A6.${pdf} ${question}` || (question === 'Q1' && s.sourceRef === `A6.${pdf} video + Q1`))
    assert.ok(state, `Missing A6.${pdf} ${question}`)
    assert.equal(state.microSkillId, rungs[pdf - 1])
  }
  const first = states.find(state => state.microSkillId === rungs[pdf - 1])
  assert.ok(first.video && first.sourceRef === `A6.${pdf} video + Q1`, `A6.${pdf}'s rung opens with its video, which works the PDF's Q1`)
}

// ---------- Every formula, rearranged by hand here and put back into the original ----------
// [the original as "left − right" (zero when it holds), the subject, the rearranged formula, and values for the other letters]
const formulae = {
  'A6.1 video + Q1': [v => v.C - (3 * v.m + 5), 'm', v => (v.C - 5) / 3, { C: 20 }],
  'A6.1 Q2': [v => v.y - (v.x + 9), 'x', v => v.y - 9, { y: 13.5 }],
  'A6.1 Q3': [v => v.P - (5 * v.w - 8), 'w', v => (v.P + 8) / 5, { P: 27 }],
  'A6.1 Q4a': [v => v.C - (4 * v.g + 12), 'g', v => (v.C - 12) / 4, { C: 32 }],
  'A6.1 Q5a': [v => v.P - (2 * v.l + 10), 'l', v => (v.P - 10) / 2, { P: 34 }],
  'A6.1 Q5c': [v => v.y - (3 * v.x + 6), 'x', v => (v.y - 6) / 3, { y: 21 }],
  'A6.2 video + Q1': [v => v.M - (v.a + v.b) / 2, 'a', v => 2 * v.M - v.b, { M: 72, b: 68 }],
  'A6.2 Q2': [v => v.y - v.x / 4, 'x', v => 4 * v.y, { y: 7.5 }],
  'A6.2 Q3': [v => v.A - v.b * v.h / 2, 'h', v => 2 * v.A / v.b, { A: 24, b: 6 }],
  'A6.2 Q4a': [v => v.s - v.d / v.t, 't', v => v.d / v.s, { d: 36, s: 12 }],
  'A6.2 Q5a': [v => v.c - (v.b + 20) / 4, 'b', v => 4 * v.c - 20, { c: 15 }],
  'A6.2 Q5c': [v => v.c - (v.b + 20) / 4, 'b', v => 4 * v.c - 20, { c: 9.5 }],
  'A6.3 video + Q1': [v => v.A - 6 * v.s ** 2, 's', v => Math.sqrt(v.A / 6), { A: 54 }],
  'A6.3 Q2': [v => v.y - v.x ** 2, 'x', v => Math.sqrt(v.y), { y: 20 }],
  'A6.3 Q3': [v => v.A - 5 * v.r ** 2, 'r', v => Math.sqrt(v.A / 5), { A: 45 }],
  'A6.3 Q4a': [v => v.A - v.d ** 2 / 2, 'd', v => Math.sqrt(2 * v.A), { A: 18 }],
  'A6.3 Q5a': [v => v.h - 5 * v.t ** 2, 't', v => Math.sqrt(v.h / 5), { h: 80 }],
  'A6.3 Q5c': [v => v.A - 6 * v.s ** 2, 's', v => Math.sqrt(v.A / 6), { A: 30 }],
  'A6.4 video + Q1': [v => v.t - Math.sqrt(v.h / 5), 'h', v => 5 * v.t ** 2, { t: 3 }],
  'A6.4 Q2': [v => v.y - Math.sqrt(v.x), 'x', v => v.y ** 2, { y: 7 }],
  'A6.4 Q3': [v => v.v - Math.sqrt(3 * v.a), 'a', v => v.v ** 2 / 3, { v: 6 }],
  'A6.4 Q4a': [v => v.v - Math.sqrt(20 * v.d), 'd', v => v.v ** 2 / 20, { v: 10 }],
  'A6.4 Q5a': [v => v.T - 2 * Math.sqrt(v.l), 'l', v => v.T ** 2 / 4, { T: 3 }],
  'A6.4 Q5c': [v => v.T - 2 * Math.sqrt(v.l), 'l', v => v.T ** 2 / 4, { T: 5 }],
}
const near = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b))
const at = ref => states.find(state => state.sourceRef === ref)
const valuesFor = ref => { const [, subject, solve, given] = formulae[ref]; return { ...given, [subject]: solve(given) } }
for (const [ref, [original]] of Object.entries(formulae)) assert.ok(near(original(valuesFor(ref)), 0), `${ref}: the rearranged formula puts back into the original`)

// Other ways of typing each formula, all right; the formula box's own fraction and root spellings too.
const spellings = {
  'A6.1 Q2': ['x = y − 9', 'y-9', '-9+y'], 'A6.1 Q3': ['(P+8)/(5)', 'P/5 + 8/5', '(p + 8) ÷ 5', 'w = (P+8)/5'], 'A6.1 Q4a': ['(C-12)/(4)', 'C/4 − 3', '(c−12)÷4'], 'A6.1 Q5a': ['(P-10)/(2)', 'P/2 - 5', '0.5(P − 10)'],
  'A6.2 Q2': ['4y', '4 × y', 'y4', 'x = 4y'], 'A6.2 Q3': ['(2A)/(b)', '2 × A ÷ b', '2a/b'], 'A6.2 Q4a': ['(d)/(s)', 'd ÷ s', 'D/S'], 'A6.2 Q5a': ['4c − 20', '4(c − 5)', '−20 + 4c'],
  'A6.3 Q2': ['√(y)', 'sqrt(y)', '√y'], 'A6.3 Q3': ['√((A)/(5))', '√(A÷5)', 'sqrt(a/5)'], 'A6.3 Q4a': ['√(2A)', '√(2×A)', 'sqrt(2a)'], 'A6.3 Q5a': ['√((h)/(5))', '√(h/5)'],
  'A6.4 Q2': ['y²', 'y^2', 'y×y', 'yy'], 'A6.4 Q3': ['(v²)/(3)', 'v²÷3', 'v^2/3'], 'A6.4 Q4a': ['(v²)/(20)', 'v^2/20', '(v^2)/20'], 'A6.4 Q5a': ['(T²)/(4)', '(T/2)²', 'T^2/4', '0.25T²'],
}
const formulaScreens = states.filter(state => state.interaction.responseShape === 'formula')
assert.equal(formulaScreens.length, Object.keys(spellings).length, 'Every typed formula has its spellings checked')
for (const state of formulaScreens) {
  const ref = state.sourceRef, [, subject, solve, given] = formulae[ref]
  assert.equal(state.answerPrefix, `${subject} =`, `${state.id} shows "${subject} =" before the box`)
  assert.equal(state.interaction.acceptanceRule, 'formula')
  for (const typed of [state.interaction.correctAnswer, ...spellings[ref]]) assert.ok(checkAnswer(state.interaction, typed), `${state.id} accepts "${typed}"`)
  // The answer the lesson marks against is the formula rearranged here, for other numbers too.
  const { readFormula } = require('../src/features/number-types/lessonMath.ts')
  const parsed = readFormula(state.interaction.correctAnswer)
  for (const scale of [1, 1.7, 3.1]) {
    const values = Object.fromEntries(Object.entries(given).map(([letter, value]) => [letter, value * scale]))
    assert.ok(near(parsed.at(Object.fromEntries(Object.entries(values).map(([k, v]) => [k.toLowerCase(), v]))), solve(values)), `${state.id}: the marked answer agrees with ${subject} rearranged by hand`)
  }
  assert.ok(!checkAnswer(state.interaction, subject) && !checkAnswer(state.interaction, ''), `${state.id} doesn't accept the subject or nothing`)
  assert.equal(state.diagnose(String(state.interaction.correctAnswer)), null, `${state.id} stays silent on the right answer`)
  assert.ok(state.interaction.displayAnswer.startsWith(`${subject} = `), `${state.id} shows its answer with the subject`)
}

// ---------- Worked-out values, by hand, and each put back into the original formula ----------
const values = {
  'A6.1 Q4b': [(32 - 12) / 4, g => 4 * g + 12 === 32], 'A6.1 Q5b': [(34 - 10) / 2, l => 2 * l + 10 === 34],
  'A6.2 Q4b': [36 / 12, t => 36 / t === 12], 'A6.2 Q5b': [4 * 15 - 20, b => (b + 20) / 4 === 15],
  'A6.3 Q4b': [Math.sqrt(2 * 18), d => d ** 2 / 2 === 18], 'A6.3 Q5b': [Math.sqrt(80 / 5), t => 5 * t ** 2 === 80],
  'A6.4 Q4b': [10 ** 2 / 20, d => Math.sqrt(20 * d) === 10], 'A6.4 Q5b': [3 ** 2 / 4, l => 2 * Math.sqrt(l) === 3],
}
for (const [ref, [value, back]] of Object.entries(values)) {
  const state = at(ref)
  assert.equal(state.interaction.correctAnswer, value, `${ref}: ${state.content.title}`)
  assert.ok(back(value), `${ref}: ${value} puts back into the original formula`)
  assert.ok(checkAnswer(state.interaction, String(value)) && checkAnswer(state.interaction, `${state.answerPrefix} ${value}`), `${ref} accepts ${value} and "${state.answerPrefix} ${value}"`)
  assert.equal(state.diagnose(String(value)), null)
  // The working builds the answer from the numbers in the question, and states it once.
  const steps = state.working.examples[0].steps
  assert.equal(steps.filter(step => step.frame.ordering?.answer).length, 1, `${ref}: one answer`)
  assert.ok(steps.at(-1).frame.ordering.answer.endsWith(`= ${value}`), `${ref}: the working ends on ${value}`)
}

// ---------- Every row of every board is true for the numbers above ----------
/** A side of the board as arithmetic: markers gone, fractions divided, roots and squares worked out. */
const js = side => side.replace(/[~^[\]«»‹›]/g, '').replace(/\{([^|]*)\|([^}]*)\}/g, '(($1)/($2))')
  .replace(/√\(/g, '#(').replace(/√([A-Za-z])/g, '#($1)').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
  .replace(/([\dA-Za-z)²])\s*(?=[A-Za-z(#])/g, '$1*').replace(/²/g, '**2').replace(/#/g, 'Math.sqrt')
const evaluate = (expression, v) => Function(...Object.keys(v), `return ${js(expression)}`)(...Object.values(v))
let rowsChecked = 0
for (const [ref, [, subject]] of Object.entries(formulae)) {
  const state = at(ref), visual = state.working ?? state.visual
  const steps = visual.examples[0].steps, board = steps.at(-1).frame.equation
  assert.ok(board, `${state.id} rearranges on the board`)
  const v = valuesFor(ref)
  for (const row of board.rows) {
    const [left, right] = 'answer' in row ? [row.answer.slice(0, row.answer.indexOf(' = ')), row.answer.slice(row.answer.indexOf(' = ') + 3)] : [row.left, row.right]
    assert.ok(near(evaluate(left, v), evaluate(right, v)), `${state.id}: "${left} = ${right}" is true when ${JSON.stringify(v)}`)
    rowsChecked++
  }
  // The working ends on the answer, subject first, as the last row of the last move; nothing repeats it.
  const last = board.rows.at(-1)
  assert.ok('answer' in last && last.answer.startsWith(`${subject} = `), `${state.id}: the working ends on ${subject} = …`)
  assert.equal(board.rows.filter(row => 'answer' in row).length, 1, `${state.id}: one answer`)
  assert.ok(!steps.some(step => step.title === 'The answer'), `${state.id}: no separate answer step`)
  const plain = text => text.replace(/[[\]~^«»‹›\s]/g, '')
  const [answerLeft, answerRight] = last.answer.split(' = ').map(plain)
  for (const row of board.rows.slice(0, -1)) assert.ok(!(plain(row.left) === answerRight && plain(row.right) === answerLeft) && !(plain(row.left) === answerLeft && plain(row.right) === answerRight), `${state.id}: the answer isn't written twice`)
  // Every move boxes the part of the row above that it undoes, and does one thing to both sides.
  for (const step of steps) {
    assert.ok(step.frame.equation.rows.some(row => 'left' in row && /\[/.test(row.left + row.right)), `${state.id}: "${step.title}" boxes what it undoes`)
    assert.ok(/^(Subtract|Add|Multiply|Divide|Square root|Square) .*both sides/.test(step.title) && !/\bthen\b/.test(step.title), `${state.id}: "${step.title}" is one move on both sides`)
    assert.ok(step.instruction.trim() && !/[=]/.test(step.instruction), `${state.id}: "${step.title}" explains in words, not maths`)
  }
}

// ---------- Choices ----------
for (const state of states.filter(state => state.interaction.type === 'select')) {
  const wrong = state.interaction.options.filter(option => option.id !== '0')
  assert.ok(wrong.length >= 2 && wrong.every(option => option.feedback?.trim()), `${state.id}: each wrong option needs its own message`)
  assert.ok(checkAnswer(state.interaction, '0') && !checkAnswer(state.interaction, '1'), `${state.id}: the first option is right`)
}
const right = ref => at(ref).interaction.options[0].label
assert.ok(right('A6.1 Q5c').endsWith('x = (y − 6)/3') && right('A6.2 Q5c').endsWith('b = 4c − 20'), 'Ben and Ali')
assert.ok(right('A6.3 Q5c').endsWith('s = √(A/6)') && right('A6.4 Q5c').endsWith('l = T²/4'), 'Mia and Sam')

// ---------- Wrong-answer messages ----------
const cases = [
  ['A6.1 Q2', 'y + 9', 'take it away'], ['A6.1 Q3', '(P − 8)/5', 'add it to both sides'], ['A6.1 Q3', 'P/5 + 8', 'first'], ['A6.1 Q3', 'P + 8/5', 'whole of P + 8'],
  ['A6.1 Q3', 'P + 8', 'That is 5w'], ['A6.1 Q4a', 'C/4 − 12', 'first'], ['A6.1 Q4a', '4(C − 12)', 'not multiplying'], ['A6.1 Q5a', 'P − 5', 'whole of P − 10'],
  ['A6.1 Q3', 'w + 1', 'w is still in your answer'], ['A6.1 Q4a', '12/4', 'lost C'],
  ['A6.2 Q2', 'y/4', 'multiply both sides by 4'], ['A6.2 Q3', '2Ab', 'don’t multiply'], ['A6.2 Q3', 'b/(2A)', 'upside down'], ['A6.2 Q4a', 'ds', 'don’t multiply'], ['A6.2 Q4a', 's/d', 'upside down'],
  ['A6.2 Q5a', '4c + 20', 'take it away'], ['A6.2 Q5a', 'c/4 − 20', 'multiply both sides by 4'],
  ['A6.3 Q3', '√A/5', 'whole of A/5'], ['A6.3 Q3', 'A/5', 'That is r²'], ['A6.3 Q3', '√(5A)', 'not multiply'], ['A6.3 Q4a', '2√A', 'the 2 as well'], ['A6.3 Q5a', '√h', 'Divide both sides by 5 first'],
  ['A6.4 Q2', '√y', 'squaring'], ['A6.4 Q3', 'v/3', 'Square both sides first'], ['A6.4 Q3', '3v²', 'not multiply'], ['A6.4 Q4a', 'v²', 'That is 20d'], ['A6.4 Q5a', 'T²/2', 'squared too'], ['A6.4 Q5a', 'T/4', 'Square the T'],
  ['A6.1 Q4b', '20', 'top of the fraction'], ['A6.1 Q5b', '7', 'top first'], ['A6.2 Q4b', '432', 'distance divided by speed'], ['A6.2 Q5b', '60', 'That’s 4c'],
  ['A6.3 Q4b', '36', 'square root it'], ['A6.3 Q5b', '20', 'don’t multiply'], ['A6.4 Q4b', '1', '10 × 10'], ['A6.4 Q5b', '4.5', 'not 2'],
]
for (const [ref, response, expected] of cases) {
  const state = at(ref)
  assert.ok(!checkAnswer(state.interaction, response), `${ref}: ${response} is marked wrong`)
  const message = state.diagnose(response)
  assert.ok(message && message.includes(expected), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}

// ---------- Videos ----------
assert.equal(states.filter(state => state.video).length, 4, 'One video per source PDF')
const mediaHashes = {
  'linear.mp4': '873305fa6a8cdacb225ee737fe2f1f088e1f3dabdbe8150ea8a884c74eda5e7c',
  'fractions.mp4': 'dabd6c693015a7f96c40282d541b1aad537f5cb75a9589e7755411d7f8fe0c04',
  'squares.mp4': '7ec52ae6ef567853ff5c6177534f6a054961e8bf7a0c8da381cc1fa7296f7672',
  'square-roots.mp4': 'b5a40531eded55ed3a89928138127b2466ad74c8bbb77f9da48f71715755ea80',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-20', name)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
  assert.ok(states.some(state => state.video?.src === `/media/lesson-20/${name}`), `${name} must be used`)
}

// ---------- The course ----------
const { mathsLessons, lessonCode } = require('../src/features/maths/courseRegistry.ts')
const a6 = mathsLessons.find(entry => entry.number === 20)
assert.equal(a6.chapterId, 'algebra')
assert.equal(a6.position, 6, 'Students see A6 as Algebra lesson 6')
assert.equal(lessonCode(a6), 'A6')
const app = read('src/App.tsx')
assert.ok(app.includes('case 20:') && app.includes('return <TutorRearrangingLesson />'), 'Lesson 20 must open from the course and its direct route')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  20: {'), 'A6 needs key-fact cards')

console.log(`Lesson 20 (A6) verified: ${states.length} screens, all 32 source questions, ${Object.keys(formulae).length} formulae rearranged by hand and put back in, ${formulaScreens.length} typed formulae (${Object.values(spellings).flat().length} other spellings), ${Object.keys(values).length} worked-out values, ${rowsChecked} board rows true, ${cases.length} wrong-answer messages, 4 source-identical videos and the route.`)

// ---------- Finished working is greyed out, and only that (Sunny, 1 Oct) ----------
// Every step's board: rows above the one the step works on are dimmed; that row, the rows the step adds and the
// answer are not. The first step dims nothing.
require.extensions['.tsx'] = require.extensions['.ts']
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { EquationVisual } = require('../src/features/written-methods/tutor/EquationPictures.tsx')
let dimChecked = 0
for (const state of states) {
  const visual = state.working ?? state.visual
  if (visual.kind !== 'method-worked' || !visual.examples[0].steps[0]?.frame.equation) continue
  assert.ok(visual.examples.every(example => example.focus), `${state.id}: finished working is greyed out`)
  const steps = visual.examples[0].steps
  steps.forEach((step, i) => {
    const before = i ? steps[i - 1].frame.equation.rows.length : 1
    const html = renderToStaticMarkup(React.createElement(EquationVisual, { frame: step.frame.equation, newFrom: before, focus: true }))
    const rows = [...html.matchAll(/<(?:div|p) class="ns-eq__(row|note|answer)([^"]*)"/g)]
    assert.equal(rows.length, step.frame.equation.rows.length, `${state.id} step ${i + 1}: every row drawn`)
    rows.forEach(([, kind, classes], r) => assert.equal(/is-done/.test(classes), kind !== 'answer' && r < before - 1, `${state.id} step ${i + 1}, row ${r + 1}: ${r < before - 1 ? 'finished, so greyed out' : 'being worked on or new, so not greyed out'}`))
    if (i === 0) assert.ok(!/is-done/.test(html), `${state.id}: the first step greys out nothing`)
    dimChecked++
  })
}
console.log(`Greying out checked on ${dimChecked} steps: only rows above the one being worked on.`)

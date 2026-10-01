// Checks Lesson 21 (Algebra A7, Factorising quadratics): source coverage, every answer multiplied back out and
// compared with the question, the pairs in every working, other ways of typing each answer, wrong-answer messages,
// worked-out values, source-identical videos and the route.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorQuadraticsLesson: lesson } = require('../src/features/quadratics/tutor/quadraticsLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

// ---------- Structure ----------
const states = lesson.states
const rungs = ['quadratics-positive', 'quadratics-negative-middle', 'quadratics-negative-last', 'quadratics-difference-of-squares']
assert.equal(lesson.id, 'L021', 'A7 keeps the stable progress key L021')
assert.equal(states.length, 33, 'Lesson 21 screen total')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Four rungs, in the PDFs’ order, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L21-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
  if (state.interaction.type !== 'continue') {
    assert.ok(state.hint?.trim(), `${state.id} needs a hint`)
    assert.ok(state.working?.kind === 'method-worked' && state.working.examples.every(example => example.pictureOnly), `${state.id} needs a picture-only working`)
  }
})
const at = ref => states.find(state => state.sourceRef === ref)
for (const pdf of [1, 2, 3, 4]) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    const state = at(`A7.${pdf} ${question}`) ?? (question === 'Q1' && at(`A7.${pdf} video + Q1`))
    assert.ok(state, `Missing A7.${pdf} ${question}`)
    assert.equal(state.microSkillId, rungs[pdf - 1])
  }
  const first = states.find(state => state.microSkillId === rungs[pdf - 1])
  assert.ok(first.video && first.sourceRef === `A7.${pdf} video + Q1`, `A7.${pdf}'s rung opens with its video, which works the PDF's Q1`)
}
// A7.4 Q5a was 4x² − 25: a number in front of x² is Higher tier, so the app asks x² − 100 instead.
assert.ok(!states.some(state => /4x²|2x \+ 5/.test(state.content.title)), 'No Higher-tier ax² question')

// ---------- Every quadratic, with the source's answer, multiplied back out by hand ----------
// [letter, b, c, the source's two numbers]: x² + bx + c = (x + p)(x + q).
const quadratics = {
  'A7.1 video + Q1': ['x', 8, 15, [3, 5]], 'A7.1 Q2': ['x', 5, 4, [1, 4]], 'A7.1 Q3': ['x', 10, 21, [3, 7]], 'A7.1 Q4a': ['x', 9, 20, [4, 5]], 'A7.1 Q5a': ['x', 12, 35, [5, 7]], 'A7.1 Q5c': ['x', 6, 8, [2, 4]],
  'A7.2 video + Q1': ['x', -9, 20, [-4, -5]], 'A7.2 Q2': ['x', -6, 5, [-1, -5]], 'A7.2 Q3': ['x', -11, 24, [-3, -8]], 'A7.2 Q4a': ['x', -10, 16, [-2, -8]], 'A7.2 Q5a': ['x', -14, 40, [-4, -10]], 'A7.2 Q5c': ['x', -7, 12, [-3, -4]],
  'A7.3 video + Q1': ['x', 2, -15, [5, -3]], 'A7.3 Q2': ['x', 3, -4, [4, -1]], 'A7.3 Q3': ['x', -2, -24, [-6, 4]], 'A7.3 Q4a': ['x', 5, -14, [7, -2]], 'A7.3 Q5a': ['x', -3, -28, [-7, 4]], 'A7.3 Q5c': ['x', -3, -10, [-5, 2]],
  'A7.4 video + Q1': ['x', 0, -49, [7, -7]], 'A7.4 Q2': ['x', 0, -16, [4, -4]], 'A7.4 Q3': ['y', 0, -81, [9, -9]], 'A7.4 Q4a': ['x', 0, -36, [6, -6]], 'A7.4 Q5a': ['x', 0, -100, [10, -10]], 'A7.4 Q5c': ['x', 0, -25, [5, -5]],
}
for (const [ref, [, b, c, [p, q]]] of Object.entries(quadratics)) {
  assert.equal(p + q, b, `${ref}: ${p} and ${q} add to ${b}`)
  assert.equal(p * q, c, `${ref}: ${p} and ${q} multiply to ${c}`)
  // (x + p)(x + q) at four values of x is the question at those values.
  for (const x of [-3, 0.5, 2, 11]) assert.ok((x + p) * (x + q) - (x * x + b * x + c) === 0, `${ref}: the brackets multiply out to the question at x = ${x}`)
}
const term = (n, letter) => `${n < 0 ? '−' : '+'} ${Math.abs(n)}${letter ?? ''}`
const written = (letter, p, q) => `(${letter} ${term(p)})(${letter} ${term(q)})`

const typed = states.filter(state => state.interaction.acceptanceRule === 'brackets')
assert.equal(typed.length, 16, 'Every typed factorising question: Q2, Q3, Q4a and Q5a in each rung')
for (const state of typed) {
  const [letter, b, c, [p, q]] = quadratics[state.sourceRef]
  const { interaction } = state
  for (const answer of [written(letter, p, q), written(letter, q, p), `(${letter}${p < 0 ? '' : '+'}${p})(${letter}${q < 0 ? '' : '+'}${q})`.replace(/-/g, '−'), `(${letter} ${term(q)}) × (${letter} ${term(p)})`, `(${p} + ${letter})(${letter} ${term(q)})`])
    assert.ok(checkAnswer(interaction, answer), `${state.id} accepts ${answer}`)
  const question = `${letter}² ${b ? `${term(b, letter)} ` : ''}${term(c)}`
  assert.ok(state.content.title.includes(question.replace(/ /g, ' ')), `${state.id} asks about ${question}`)
  for (const wrong of [question, ...(b ? [written(letter, -p, -q)] : []), written(letter, p, p), `${letter}(${letter} ${term(b || 1)})`]) assert.ok(!checkAnswer(interaction, wrong), `${state.id} rejects ${wrong}`)
  assert.equal(state.diagnose(String(interaction.correctAnswer)), null, `${state.id} stays silent on the right answer`)
  assert.equal(interaction.responseShape, 'expression', `${state.id} is typed with the x² key`)
}

// ---------- The working: the pairs, each one's sum, one pair that works, then the brackets ----------
let pairsChecked = 0
for (const [ref, [letter, b, c, [p, q]]] of Object.entries(quadratics)) {
  const state = at(ref), visual = state.working ?? state.visual
  const steps = visual.examples[0].steps
  const frames = steps.map(step => step.frame.quadratic)
  assert.ok(frames.every(Boolean), `${state.id}: every step is drawn on the quadratic picture`)
  assert.ok(frames.every(frame => frame.letter === letter && frame.middle === b && frame.last === c), `${state.id}: the picture is the question`)
  const last = frames.at(-1)
  assert.equal(last.adds, 'answer', `${state.id}: the working ends on the brackets`)
  assert.deepEqual([...last.answer].sort((m, n) => m - n), [p, q].sort((m, n) => m - n), `${state.id}: the brackets hold ${p} and ${q}`)
  assert.equal(frames.filter(frame => frame.adds === 'answer').length, 1, `${state.id}: one answer`)
  assert.ok(!steps.some(step => step.title === 'The answer'), `${state.id}: no separate answer step`)
  for (const step of steps) {
    assert.ok(step.title.split(' ').length <= 4, `${state.id}: "${step.title}" is a short heading`)
    assert.ok(step.instruction.trim() && !/=/.test(step.instruction), `${state.id}: "${step.title}" explains in words, not maths`)
  }
  if (b === 0) {
    assert.deepEqual(steps.map(step => step.title), ['Write as squares', 'One plus, one minus'], `${state.id}: squares, then one plus and one minus`)
    assert.equal(Math.sqrt(-c) ** 2, -c, `${state.id}: ${-c} is a square`)
    continue
  }
  // Each step adds one part of the picture, in order, and the signs step comes only when a sign is negative.
  const order = frames.map(frame => frame.adds)
  assert.deepEqual(order, b > 0 && c > 0 ? ['shape', 'pairs', 'sums', 'answer'] : ['shape', 'signs', 'pairs', 'sums', 'answer'], `${state.id}: one thing a step`)
  const { pairs, pick } = last
  for (const [m, n] of pairs) { assert.equal(m * n, c, `${state.id}: ${m} and ${n} multiply to ${c}`); pairsChecked++ }
  assert.equal(pairs.filter(([m, n]) => m + n === b).length, 1, `${state.id}: exactly one pair adds to ${b}`)
  assert.equal(pairs[pick][0] + pairs[pick][1], b, `${state.id}: the ticked pair adds to ${b}`)
  // Every pair with the right signs is listed: as many as the factor pairs of |c|.
  let count = 0
  for (let m = 1; m * m <= Math.abs(c); m++) if (Math.abs(c) % m === 0) count++
  assert.equal(pairs.length, count, `${state.id}: every pair that multiplies to ${c}, with the signs picked`)
  assert.ok(steps.find(step => step.frame.quadratic.adds === 'pairs').title.endsWith(String(c).replace('-', '−')), `${state.id}: the pairs heading names ${c}`)
}

// ---------- Worked-out values, by hand ----------
const mat = at('A7.2 Q4b')
assert.equal(mat.interaction.responseShape, 'dimensions')
for (const answer of ['8, 2', '2, 8']) assert.ok(checkAnswer(mat.interaction, answer), `The mat accepts ${answer}`)
assert.ok(!checkAnswer(mat.interaction, '8') && !checkAnswer(mat.interaction, '12, 18'), 'The mat needs both sides')
assert.deepEqual([10 - 2, 10 - 8], [8, 2])
const grass = at('A7.4 Q4b')
assert.equal(grass.interaction.correctAnswer, (10 + 6) * (10 - 6))
assert.equal(grass.interaction.correctAnswer, 10 ** 2 - 36, 'The factorised and the original area agree')
assert.ok(checkAnswer(grass.interaction, '64'))

// ---------- Choices ----------
for (const state of states.filter(state => state.interaction.type === 'select')) {
  const wrong = state.interaction.options.filter(option => option.id !== '0')
  assert.ok(wrong.length >= 2 && wrong.every(option => option.feedback?.trim()), `${state.id}: each wrong option needs its own message`)
  assert.ok(checkAnswer(state.interaction, '0') && !checkAnswer(state.interaction, '1'), `${state.id}: the first option is right`)
}
const right = ref => at(ref).interaction.options[0].label
assert.ok(right('A7.1 Q4b').includes(`${3 ** 2 + 9 * 3 + 20}`) && (3 + 4) * (3 + 5) === 56, 'Both areas 56')
assert.ok(right('A7.1 Q5b').includes('x² + 12x + 35') && right('A7.2 Q5b').includes('x² − 14x + 40') && right('A7.3 Q5b').includes('x² − 3x − 28') && right('A7.4 Q5b').includes('x² − 100'), 'Expand to check')
assert.ok(right('A7.1 Q5c').endsWith('(x + 2)(x + 4)') && right('A7.2 Q5c').endsWith('(x − 3)(x − 4)') && right('A7.3 Q5c').endsWith('(x − 5)(x + 2)') && right('A7.4 Q5c').endsWith('(x + 5)(x − 5)'), 'Kai, Zoe, Ivy and Jon')

// ---------- Wrong-answer messages ----------
const cases = [
  ['A7.1 Q2', '(x + 2)(x + 2)', 'add to 4, not 5'], ['A7.1 Q3', '(x + 1)(x + 21)', 'add to 22, not 10'], ['A7.1 Q4a', '(x + 2)(x + 7)', 'add to 9 but multiply to 14'], ['A7.1 Q5a', 'x² + 12x + 35', 'two brackets'],
  ['A7.2 Q2', '(x + 1)(x + 5)', 'swap both signs'], ['A7.2 Q3', '(x − 3)(x + 8)', 'same sign'], ['A7.2 Q4a', '(x − 4)(x − 4)', 'Try another pair'],
  ['A7.3 Q2', '(x − 4)(x + 1)', 'swap both signs'], ['A7.3 Q3', '(x − 6)(x − 4)', 'one plus and one minus'], ['A7.3 Q4a', '(x + 2)(x + 7)', 'one plus and one minus'],
  ['A7.4 Q2', '(x − 4)(x − 4)', 'middle terms cancel'], ['A7.4 Q3', '(x + 9)(x − 9)', 'uses y'], ['A7.4 Q4a', '(x + 18)(x − 18)', 'square root of 36'], ['A7.4 Q5a', '(2x + 10)(x − 10)', 'on its own'],
  ['A7.2 Q4b', '12, 18', 'takes 2 away'], ['A7.4 Q4b', '20', 'multiply'],
]
for (const [ref, response, expected] of cases) {
  const state = at(ref)
  assert.ok(!checkAnswer(state.interaction, response), `${ref}: ${response} is marked wrong`)
  const message = state.diagnose(response)
  assert.ok(message && message.includes(expected), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}

// ---------- Finished working is greyed out, and only that (Sunny, 1 Oct) ----------
// The question, what the step before added and what this step adds stay clear; everything older is greyed out.
// The first step greys out nothing, and the answer is never greyed out.
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { QuadraticVisual } = require('../src/features/written-methods/tutor/QuadraticPictures.tsx')
const partsOf = adds => adds === 'shape' ? ['brackets', 'table'] : adds === 'pairs' || adds === 'sums' ? ['table'] : adds ? [adds] : []
const classOf = { brackets: 'ns-quad__shape', squares: 'ns-quad__shape', signs: 'ns-quad__signs', table: 'ns-quad__pairs' }
let dimChecked = 0
for (const ref of Object.keys(quadratics)) {
  const steps = (at(ref).working ?? at(ref).visual).examples[0].steps
  steps.forEach((step, i) => {
    const frame = step.frame.quadratic
    const html = renderToStaticMarkup(React.createElement(QuadraticVisual, { frame }))
    const dimmed = [...html.matchAll(/class="(ns-quad__\w+)[^"]*is-done/g)].map(match => match[1]).sort()
    const shown = steps.slice(0, i + 1).flatMap(s => partsOf(s.frame.quadratic.adds)).filter(part => part !== 'answer')
    const clear = [...partsOf(frame.adds), ...partsOf(steps[i - 1]?.frame.quadratic.adds)]
    const expected = [...new Set(shown)].filter(part => !clear.includes(part)).map(part => classOf[part]).sort()
    assert.deepEqual(dimmed, expected, `${ref} step ${i + 1}: only what the steps before the last one added is greyed out`)
    if (i === 0) assert.deepEqual(dimmed, [], `${ref}: the first step greys out nothing`)
    assert.ok(!/ns-quad__question[^"]*is-done|ns-eq__answer[^"]*is-done/.test(html), `${ref} step ${i + 1}: the question and the answer stay clear`)
    dimChecked++
  })
  // The two jobs are the table's first row, under its × and + columns, from the first step.
  if (quadratics[ref][1] !== 0) {
    const html = renderToStaticMarkup(React.createElement(QuadraticVisual, { frame: steps[0].frame.quadratic }))
    const [, , b, c] = [null, ...quadratics[ref]]
    assert.ok(new RegExp(`ns-quad__target.*?is-f1">${String(c).replace('-', '−')}<.*?is-f0">${String(b).replace('-', '−')}<`).test(html), `${ref}: the table's first row is the two jobs`)
  }
}

// ---------- Videos ----------
assert.equal(states.filter(state => state.video).length, 4, 'One video per source PDF')
const mediaHashes = {
  'all-positive.mp4': '3389dca65f7d6d5f420c58cdabdee90231a3eb1d9c865175f45a5bf5abe7fe0a',
  'negative-middle.mp4': '59e65701180066d2de6ad35922bdf441040f0c99d572209bf6335b875026a223',
  'negative-last.mp4': '1a3125ace63914c48453d6907c86104bbedfe180832dd215750b31cf6b428d14',
  'difference-of-squares.mp4': 'f8252e127e7bc4b3e16d82daef108f0f580e571967823e011bbd7281ead1026d',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-21', name)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
  assert.ok(states.some(state => state.video?.src === `/media/lesson-21/${name}`), `${name} must be used`)
}

// ---------- The course ----------
const { mathsLessons, lessonCode } = require('../src/features/maths/courseRegistry.ts')
const a7 = mathsLessons.find(entry => entry.number === 21)
assert.equal(a7.chapterId, 'algebra')
assert.equal(a7.position, 7, 'Students see A7 as Algebra lesson 7')
assert.equal(lessonCode(a7), 'A7')
const app = read('src/App.tsx')
assert.ok(app.includes('case 21:') && app.includes('return <TutorQuadraticsLesson />'), 'Lesson 21 must open from the course and its direct route')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  21: {'), 'A7 needs key-fact cards')

console.log(`Greying out checked on ${dimChecked} steps.`)
console.log(`Lesson 21 (A7) verified: ${states.length} screens, all 32 source questions (A7.4 Q5a asked at Foundation), ${Object.keys(quadratics).length} quadratics multiplied back out, ${typed.length} typed answers (other orders and spellings too), ${pairsChecked} pairs in the workings, ${cases.length} wrong-answer messages, 4 source-identical videos and the route.`)

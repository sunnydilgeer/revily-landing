// Checks Lesson 25 (Algebra A11, Solving inequalities): source coverage, every answer worked out again by testing
// numbers in the question itself, every board row allowing exactly the same numbers as the question, other ways of
// writing each answer, slips rejected, one move a step with nothing repeating the answer, choices, wrong-answer
// messages, greying, source-identical videos and the route.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorSolvingInequalitiesLesson: lesson } = require('../src/features/solving-inequalities/tutor/solvingInequalitiesLesson.ts')
const { checkAnswer, parseInequality } = require('../src/features/number-types/lessonMath.ts')

// ---------- Structure ----------
const states = lesson.states
const rungs = ['inequalities-integers', 'inequalities-solve', 'inequalities-solve-two-signs', 'inequalities-negative']
assert.equal(lesson.id, 'L025', 'A11 keeps the stable progress key L025')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Four rungs, easiest first (A11.1 to A11.4), then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L25-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
  if (state.interaction.type !== 'continue') {
    assert.ok(state.hint?.trim(), `${state.id} needs a hint`)
    assert.ok(state.working?.kind === 'method-worked' && state.working.examples.every(example => example.pictureOnly), `${state.id} needs a picture-only working`)
  }
})
const at = ref => states.find(state => state.sourceRef === ref)
rungs.forEach((rung, i) => {
  const pdf = i + 1, first = states.find(state => state.microSkillId === rung)
  assert.ok(first.video && first.sourceRef === `A11.${pdf} video + Q1`, `A11.${pdf}'s rung opens with its video and Q1`)
  for (const question of ['Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    const covered = at(`A11.${pdf} ${question}`)
    assert.ok(covered, `Missing A11.${pdf} ${question}`)
    assert.equal(covered.microSkillId, rung, `A11.${pdf} ${question} is in its rung`)
  }
})

// ---------- Every answer, worked out again ----------
const xs = []
for (let x = -30; x <= 30; x += 0.25) xs.push(x)
const holds = (answer, x) => {
  const p = parseInequality(answer.replace(/−/g, '-'))
  assert.ok(p, `${answer} reads as an inequality`)
  return (!p.lower || (p.lower.included ? x >= p.lower.value : x > p.lower.value)) && (!p.upper || (p.upper.included ? x <= p.upper.value : x < p.upper.value))
}
// The questions themselves, as the numbers they allow.
const question = {
  'A11.2 video + Q1': a => 4 * a - 5 > a + 7,
  'A11.2 Q2': x => 2 * x + 3 < 11,
  'A11.2 Q3': y => 5 * y - 2 >= 3 * y + 8,
  'A11.2 Q4a': x => 3 * (x + 2) <= 2 * x + 10,
  'A11.2 Q5a': x => (2 * x + 6) / 4 > x - 1,
  'A11.2 Q5c': x => 6 * x - 1 > 4 * x + 9,
  'A11.3 video + Q1': x => 3 < 2 * x + 1 && 2 * x + 1 < 11,
  'A11.3 Q2': x => 4 <= x + 3 && x + 3 <= 9,
  'A11.3 Q3': x => -5 <= 3 * x - 2 && 3 * x - 2 < 7,
  'A11.3 Q4a': x => 1 < x / 2 + 2 && x / 2 + 2 <= 5,
  'A11.3 Q5a': x => 6 < 4 * x - 2 && 4 * x - 2 <= 18,
  'A11.3 Q5c': x => 2 < 3 * x + 5 && 3 * x + 5 < 14,
  'A11.4 video + Q1': x => -3 * x > 12,
  'A11.4 Q2': y => -y <= 6,
  'A11.4 Q3': x => 10 - 2 * x < 4,
  'A11.4 Q4a': k => 7 - 3 * k >= -2,
  'A11.4 Q5a': x => 5 - 2 * x > x - 4,
  'A11.4 Q5c': x => -4 * x <= 8,
}
/** A board side as JavaScript: moves and boxes are only colour; ÷ and × act on the whole side so far. */
const js = side => side.replace(/[~^[\]]/g, '').replace(/−/g, '-').replace(/\{([^|]*)\|([^}]*)\}/g, '(($1)/($2))').replace(/\s+/g, '')
  .replace(/÷(-?\d+)/g, '/($1)').replace(/×(-?\d+)/g, '*($1)').replace(/(\d)([a-z(])/g, '$1*$2').replace(/(^|[^\w)])-([a-z])/g, '$1-1*$2').replace(/[a-z]/g, 'v')
const evaluate = (side, v) => Function('v', `return (${js(side)})`)(v)
const compare = (a, sign, b) => ({ '<': a < b - 1e-9, '>': a > b + 1e-9, '≤': a <= b + 1e-9, '≥': a >= b - 1e-9 })[sign.replace(/[[\]]/g, '')]
let rows = 0, typed = 0
for (const [ref, rule] of Object.entries(question)) {
  const state = at(ref), working = state.working ?? state.visual
  const board = working.examples[0].steps.at(-1).frame.equation.rows
  const answer = board.find(row => 'answer' in row).answer
  assert.ok(xs.every(x => holds(answer, x) === rule(x)), `${ref}: ${answer} allows the same numbers as the question`)
  // Every row on the board allows exactly the same numbers as the question: no move changes the answer.
  for (const row of board.filter(row => 'left' in row)) {
    const ok = xs.every(x => {
      const l = evaluate(row.left, x), r = evaluate(row.right, x)
      const inRow = row.middle === undefined ? compare(l, row.sign, r) : compare(l, row.sign, evaluate(row.middle, x)) && compare(evaluate(row.middle, x), row.sign2, r)
      return inRow === rule(x)
    })
    assert.ok(ok, `${ref}: the row ${row.left} ${row.sign} ${row.middle ?? ''} ${row.sign2 ?? ''} ${row.right} allows the same numbers`)
    rows++
  }
  if (state.interaction.responseShape !== 'inequality') continue
  typed++
  const { interaction } = state
  assert.ok(xs.every(x => holds(interaction.correctAnswer, x) === rule(x)), `${ref}: the marked answer is right`)
  for (const other of [interaction.displayAnswer, interaction.displayAnswer.replace(/≤/g, '<=').replace(/≥/g, '>='), interaction.displayAnswer.replace(/\s/g, '')]) assert.ok(checkAnswer(interaction, other), `${ref} accepts ${other}`)
  const unflipped = interaction.displayAnswer.replace(/[<>≤≥]/g, s => ({ '<': '>', '>': '<', '≤': '≥', '≥': '≤' })[s])
  const loose = interaction.displayAnswer.replace(/[<>≤≥]/g, s => ({ '<': '≤', '≤': '<', '>': '≥', '≥': '>' })[s])
  for (const wrong of [unflipped, loose]) assert.ok(!checkAnswer(interaction, wrong.replace(/−/g, '-')), `${ref} rejects ${wrong}`)
}
// The worked examples' answers: the source's own.
assert.equal(at('A11.2 video + Q1').visual.examples[0].steps.at(-1).frame.equation.rows.at(-1).answer, 'a > 4')
assert.equal(at('A11.3 video + Q1').visual.examples[0].steps.at(-1).frame.equation.rows.at(-1).answer, '1 < x < 5')
assert.equal(at('A11.4 video + Q1').visual.examples[0].steps.at(-1).frame.equation.rows.at(-1).answer, 'x < −4')
// Every divide by a negative flips the sign, boxed in purple on that row; nothing else flips.
for (const ref of ['A11.4 video + Q1', 'A11.4 Q2', 'A11.4 Q3', 'A11.4 Q4a', 'A11.4 Q5c']) {
  const board = (at(ref).working ?? at(ref).visual).examples[0].steps.at(-1).frame.equation.rows
  assert.ok(board.some(row => 'sign' in row && /^\[.\]$/.test(row.sign) && /[÷×]−/.test(row.left)), `${ref}: the flip is boxed on the row that divides by a negative`)
}
assert.ok(!states.filter(state => !state.sourceRef.startsWith('A11.4')).some(state => ((state.working ?? state.visual).examples?.[0].steps.at(-1).frame.equation?.rows ?? []).some(row => /^\[/.test(row.sign ?? ''))), 'Only A11.4 flips a sign')
// Integers: every whole number in the question, found by trying them all.
const ints = rule => { const list = []; for (let n = -50; n <= 50; n++) if (rule(n)) list.push(n); return list }
const lists = {
  'A11.1 Q2': x => -1 < x && x < 3, 'A11.1 Q3': x => -3 <= x && x < 2, 'A11.1 Q5a': x => 2 * x <= 9 && x > 0,
  'A11.3 Q4b': question['A11.3 Q4a'], 'A11.3 Q5b': question['A11.3 Q5a'],
}
for (const [ref, rule] of Object.entries(lists)) {
  const { interaction } = at(ref), right = ints(rule)
  assert.equal(interaction.responseShape, 'numbers', `${ref} is typed in one box`)
  assert.ok(checkAnswer(interaction, right.join(', ')) && checkAnswer(interaction, [...right].reverse().join(' ')), `${ref} accepts ${right} in any order`)
  assert.ok(!checkAnswer(interaction, right.slice(1).join(', ')) && !checkAnswer(interaction, [...right, right.at(-1) + 1].join(', ')), `${ref} needs exactly ${right}`)
}
assert.deepEqual(ints(n => 2 < n && n <= 6), [3, 4, 5, 6], 'The team: 3, 4, 5 or 6 players')
assert.deepEqual(at('A11.1 video + Q1').visual.examples[0].steps.at(-1).frame.numberLine.dots.values, [3, 4, 5, 6])
const expectNumber = (ref, value) => { const { interaction } = at(ref); assert.equal(Number(interaction.correctAnswer), value, `${ref}: should be ${value}`); assert.ok(checkAnswer(interaction, String(value))) }
expectNumber('A11.1 Q4b', ints(n => -2 <= n && n <= 4).length)
expectNumber('A11.1 Q5b', Math.max(...ints(x => 3 * x < 20)))
expectNumber('A11.2 Q4b', Math.max(...ints(question['A11.2 Q4a'])))
expectNumber('A11.4 Q4b', Math.max(...ints(question['A11.4 Q4a'])))
assert.ok(checkAnswer(at('A11.1 Q4a').interaction, '-2, 4') && !checkAnswer(at('A11.1 Q4a').interaction, '4, -2'), 'Smallest −2, then largest 4')
// Choices: the right one is first and matches the source.
assert.ok(!ints(n => -2 < n && n <= 2).includes(-2), 'Ravi: −2 is not included')
assert.match(at('A11.1 Q5c').interaction.options[0].label, /^No/)
assert.match(at('A11.2 Q5c').interaction.options[0].label, /x > 5/)
assert.match(at('A11.3 Q5c').interaction.options[0].label, /^−1 < x < 3/)
assert.match(at('A11.4 Q5c').interaction.options[0].label, /^x ≥ −2/)
assert.match(at('A11.2 Q5b').interaction.options[0].label, /open circle at 5.*left/i)
assert.match(at('A11.4 Q5b').interaction.options[0].label, /open circle at 3.*left/i)
for (const state of states.filter(state => state.interaction.type === 'select')) {
  const wrong = state.interaction.options.filter(option => option.id !== '0')
  assert.ok(wrong.length >= 3 && wrong.every(option => option.feedback?.trim()), `${state.id}: each wrong option needs its own message`)
  assert.ok(checkAnswer(state.interaction, '0') && !checkAnswer(state.interaction, '1'), `${state.id}: the first option is right`)
}

// ---------- The workings ----------
let steps = 0
const workings = states.map(state => ({ state, working: state.working ?? (state.visual.kind === 'method-worked' ? state.visual : null) })).filter(item => item.working)
for (const { state, working } of workings) {
  const example = working.examples[0], list = example.steps
  assert.ok(example.focus, `${state.id}: finished working greys out`)
  for (const step of list) {
    assert.ok(step.title.trim() && step.title.split(' ').length <= 9, `${state.id}: "${step.title}" is a short heading`)
    assert.ok(step.instruction.trim() && !/=/.test(step.instruction), `${state.id}: "${step.title}" explains in words, not maths`)
    assert.ok(!/^the answer$/i.test(step.title), `${state.id}: no separate answer step`)
    steps++
  }
  // The answer appears once, at the last step: the board's green answer, the number line's answer or green dots.
  const answers = list.map((step, i) => {
    const f = step.frame
    if (f.numberLine) return Boolean(f.numberLine.answer?.at === i || f.numberLine.dots?.at === i)
    return f.equation.rows.some(row => 'answer' in row) && !list.slice(0, i).some(s => s.frame.equation?.rows.some(row => 'answer' in row))
  })
  assert.deepEqual(answers.map((a, i) => a && i), answers.map((_, i) => i === list.length - 1 && i), `${state.id}: the answer comes once, in the last step`)
  for (const step of list) if (step.frame.numberLine) assert.ok((step.frame.numberLine.lines ?? []).every(line => line.family === 3), `${state.id}: halfway results are purple`)
  // Each board move boxes what it acts on, in purple, in the row above.
  list.forEach((step, i) => {
    if (!step.frame.equation) return
    const before = list[i - 1]?.frame.equation?.rows.length ?? 1
    const worked = step.frame.equation.rows[before - 1]
    assert.ok(worked && JSON.stringify(worked).includes('['), `${state.id} step ${i + 1}: the part the move acts on is boxed`)
  })
}

// ---------- Wrong-answer messages ----------
const cases = [
  ['A11.1 Q2', '-1, 0, 1, 2', '−1 isn’t included'], ['A11.1 Q3', '-2, -1, 0, 1', '−3 is included'], ['A11.1 Q3', '-3, -2, -1, 0, 1, 2', '2 isn’t included'], ['A11.1 Q5a', '0, 1, 2, 3, 4', '0 isn’t included'],
  ['A11.1 Q4b', '6', 'both ends'], ['A11.1 Q5b', '7', '21'], ['A11.1 Q4a', '-1, 3', 'included'],
  ['A11.2 Q2', 'x < 8', 'Divide'], ['A11.2 Q2', 'x > 4', 'keeps the sign'], ['A11.2 Q4a', 'x <= 8', 'expand'], ['A11.2 Q5a', 'x > 5', 'less than 10'],
  ['A11.3 Q2', '4 <= x <= 6', 'left part'], ['A11.3 Q3', '-3 <= x < 9', 'Divide all three'], ['A11.3 Q4a', '-1 < x <= 3', 'Multiply'], ['A11.3 Q5a', 'x > 2', 'two signs'],
  ['A11.3 Q4b', '-2, -1, 0, 1, 2, 3, 4, 5, 6', '−2 isn’t included'],
  ['A11.4 Q2', 'y <= -6', 'flips'], ['A11.4 Q3', 'x < 3', 'flips'], ['A11.4 Q4a', 'k >= 3', 'flips'], ['A11.4 Q5a', 'x > 3', 'less than 9'], ['A11.4 Q3', 'x > -3', 'positive'],
]
for (const [ref, response, expected] of cases) {
  const state = at(ref)
  assert.ok(!checkAnswer(state.interaction, response), `${ref}: ${response} is marked wrong`)
  const message = state.diagnose?.(response)
  assert.ok(message && message.includes(expected), `${ref} → ${response} should mention "${expected}", got: ${message}`)
}
for (const state of states.filter(state => state.diagnose)) assert.equal(state.diagnose(String(state.interaction.correctAnswer)), null, `${state.id} stays silent on the right answer`)

// ---------- Greying (Sunny, 1 Oct) ----------
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { NumberLineVisual } = require('../src/features/written-methods/tutor/InequalityPictures.tsx')
const { EquationVisual } = require('../src/features/written-methods/tutor/EquationPictures.tsx')
let dimChecked = 0
for (const { state, working } of workings) {
  const list = working.examples[0].steps
  list.forEach((step, i) => {
    if (step.frame.numberLine) {
      const frame = step.frame.numberLine
      const html = renderToStaticMarkup(React.createElement(NumberLineVisual, { frame, focus: true }))
      const old = at => at >= 0 && frame.step > 0 && at < frame.step - 1
      const expected = (frame.circles ?? []).filter(c => old(c.at)).length + (frame.shade && old(frame.shade.at) ? 1 : 0) + (frame.lines ?? []).filter(line => old(line.at)).length
      assert.equal((html.match(/is-done/g) ?? []).length, expected, `${state.id} step ${i + 1}: ${expected} finished parts greyed out`)
      if (i === 0) assert.equal(expected, 0, `${state.id}: step 1 greys nothing`)
      assert.ok(!/ns-eq__answer[^"]*is-done|ns-nl__dot[^"]*is-done/.test(html), `${state.id} step ${i + 1}: the answer stays clear`)
    } else {
      // The board: rows above the one this step works on grey out; the worked row, what it adds and the answer stay clear.
      const newFrom = list[i - 1]?.frame.equation?.rows.length ?? 1
      const html = renderToStaticMarkup(React.createElement(EquationVisual, { frame: step.frame.equation, newFrom, focus: true }))
      assert.equal((html.match(/is-done/g) ?? []).length, Math.max(0, newFrom - 1), `${state.id} step ${i + 1}: ${newFrom - 1} rows greyed out`)
      if (i === 0) assert.ok(!/is-done/.test(html), `${state.id}: step 1 greys nothing`)
      if (step.frame.equation.rows.some(row => row.middle !== undefined)) assert.ok(/ns-eq is-three/.test(html), `${state.id}: two signs line up in three parts`)
    }
    dimChecked++
  })
}

// ---------- Videos: the zip's own files, source-identical ----------
assert.equal(states.filter(state => state.video).length, 4, 'One video per source PDF')
const mediaHashes = {
  'listing-integers.mp4': '7b838818c70cac8cfb911f67130c082baccd381f7d54e7c36310525814a692b6',
  'solving-inequalities.mp4': '87e6c4c6b6fa96bed47886eb06ee27cdd29f2bdf08ec083a9eb1fc476afdbd9a',
  'two-signs.mp4': '9393de93797e3e83cfd97166fe504509ae72ad622b4471462f7493bb2ee9bfb5',
  'dividing-by-a-negative.mp4': '4bb311e1715fe6c135f2e2a65ca070773d9c70c94ccc72428d4ffd29be546b7d',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-25', name)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
  assert.ok(states.some(state => state.video?.src === `/media/lesson-25/${name}`), `${name} must be used`)
}

// ---------- The course ----------
const { mathsLessons, lessonCode } = require('../src/features/maths/courseRegistry.ts')
const a11 = mathsLessons.find(entry => entry.number === 25)
assert.equal(a11.chapterId, 'algebra')
assert.equal(a11.position, 11, 'Students see A11 as Algebra lesson 11')
assert.equal(lessonCode(a11), 'A11')
const app = read('src/App.tsx')
assert.ok(app.includes('case 25:') && app.includes('return <TutorSolvingInequalitiesLesson />'), 'Lesson 25 must open from the course and its direct route')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  25: {'), 'A11 needs key-fact cards')

console.log(`Greying out checked on ${dimChecked} steps.`)
console.log(`Lesson 25 (A11) verified: ${states.length} screens, all 32 source questions, ${typed} typed inequalities and ${rows} board rows tested against every quarter from −30 to 30, ${steps} steps, ${cases.length} wrong-answer messages, 4 source-identical videos and the route.`)

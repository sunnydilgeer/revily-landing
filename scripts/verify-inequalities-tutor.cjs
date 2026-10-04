// Checks Lesson 24 (Algebra A10, Inequalities): source coverage, every answer worked out again by testing numbers
// against the source's own description, other ways of writing each answer, slips rejected, one move a step with
// nothing repeating the answer, choices, wrong-answer messages, greying, source-identical videos and the route.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorInequalitiesLesson: lesson } = require('../src/features/inequalities/tutor/inequalitiesLesson.ts')
const { checkAnswer, parseInequality } = require('../src/features/number-types/lessonMath.ts')

// ---------- Structure ----------
const states = lesson.states
const rungs = ['inequalities-number-line', 'inequalities-two-sided']
assert.equal(lesson.id, 'L024', 'A10 keeps the stable progress key L024')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Two rungs, easiest first (A10.1, A10.2), then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L24-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
  if (state.interaction.type !== 'continue') {
    assert.ok(state.hint?.trim(), `${state.id} needs a hint`)
    assert.ok(state.working?.kind === 'method-worked' && state.working.examples.every(example => example.pictureOnly), `${state.id} needs a picture-only working`)
  }
})
const at = ref => states.find(state => state.sourceRef === ref)
for (const [rung, pdf] of [['inequalities-number-line', 1], ['inequalities-two-sided', 2]]) {
  const first = states.find(state => state.microSkillId === rung)
  assert.ok(first.video && first.sourceRef === `A10.${pdf} video + Q1`, `A10.${pdf}'s rung opens with its video and Q1`)
  for (const question of ['Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) {
    const covered = at(`A10.${pdf} ${question}`)
    assert.ok(covered, `Missing A10.${pdf} ${question}`)
    assert.equal(covered.microSkillId, rung, `A10.${pdf} ${question} is in its rung`)
  }
}

// ---------- Every answer, worked out again ----------
// Each source question as the numbers it allows; the typed answer must allow exactly the same numbers.
const xs = []
for (let x = -40; x <= 600; x += 0.5) xs.push(x)
const holds = (answer, x) => {
  const { lower, upper } = parseInequality(answer)
  return (!lower || (lower.included ? x >= lower.value : x > lower.value)) && (!upper || (upper.included ? x <= upper.value : x < upper.value))
}
const allowed = {
  'A10.1 video + Q1': h => h >= 120, // at least 120 cm
  'A10.1 Q2': x => x < 3, // open circle at 3, arrow left
  'A10.1 Q3': p => p <= 8, // no more than 8
  'A10.1 Q4a': t => t < -18, // colder than −18
  'A10.1 Q5a': x => x >= -2, // closed circle at −2, arrow right
  'A10.1 Q5b': x => x >= 5, // closed circle at 5, arrow right
  'A10.2 video + Q1': t => t >= 1 && t < 5, // from 1 up to, but not including, 5
  'A10.2 Q2': x => x > -2 && x < 3, // open at −2 and 3
  'A10.2 Q3': w => w >= 500 && w <= 520, // at least 500, at most 520
  'A10.2 Q4a': x => x >= -4 && x < 1, // closed −4, open 1
  'A10.2 Q5a': a => a >= 5 && a < 12, // 5 and over, under 12
}
let typed = 0
for (const [ref, rule] of Object.entries(allowed)) {
  const state = at(ref)
  const answer = state.interaction.type === 'continue'
    ? state.visual.examples[0].steps.at(-1).frame.numberLine.answer.text
    : state.interaction.displayAnswer
  assert.ok(xs.every(x => holds(answer.replace(/−/g, '-'), x) === rule(x)), `${ref}: ${answer} allows the same numbers as the question`)
  if (state.interaction.type === 'continue') continue
  typed++
  const { interaction } = state
  assert.equal(interaction.responseShape, 'inequality', `${ref} is typed as an inequality`)
  const p = parseInequality(interaction.correctAnswer)
  const write = end => String(end.value)
  // Other ways of writing it: ASCII signs, no spaces, or the other way round (x < 3 as 3 > x).
  const reversed = p.lower && p.upper
    ? `${write(p.upper)} ${p.upper.included ? '>=' : '>'} ${p.letter} ${p.lower.included ? '>=' : '>'} ${write(p.lower)}`
    : p.lower ? `${write(p.lower)} ${p.lower.included ? '<=' : '<'} ${p.letter}` : `${write(p.upper)} ${p.upper.included ? '>=' : '>'} ${p.letter}`
  for (const other of [answer, answer.replace(/≤/g, '<=').replace(/≥/g, '>='), answer.replace(/\s/g, ''), reversed]) assert.ok(checkAnswer(interaction, other), `${ref} accepts ${other}`)
  // Slips: the other kind of circle, the other way, a different number, the wrong letter.
  const swapIncluded = answer.replace(/[<>≤≥]/g, s => ({ '<': '≤', '≤': '<', '>': '≥', '≥': '>' })[s])
  const swapWay = answer.replace(/[<>≤≥]/g, s => ({ '<': '>', '>': '<', '≤': '≥', '≥': '≤' })[s])
  for (const wrong of [swapIncluded, swapWay, answer.replace(/-?\d+$/, n => String(Number(n) + 1)), answer.replace(/[a-z]/, 'y')]) assert.ok(!checkAnswer(interaction, wrong.replace(/−/g, '-')), `${ref} rejects ${wrong}`)
}
// Integers: worked out by trying every whole number.
const ints = (rule, from = -50, to = 50) => { const list = []; for (let n = from; n <= to; n++) if (rule(n)) list.push(n); return list }
const expectNumber = (ref, value) => { const { interaction } = at(ref); assert.equal(Number(interaction.correctAnswer), value, `${ref}: should be ${value}`); assert.ok(checkAnswer(interaction, String(value)), `${ref} accepts ${value}`) }
expectNumber('A10.1 Q5a (smallest integer)', Math.min(...ints(allowed['A10.1 Q5a'])))
expectNumber('A10.2 Q4b', Math.max(...ints(allowed['A10.2 Q4a'])))
// Choices: the right one is first and matches the source.
assert.ok(!allowed['A10.1 Q4a'](-18), '−18 °C is not allowed')
assert.match(at('A10.1 Q4b').interaction.options[0].label, /^No/)
assert.match(at('A10.1 Q3 (number line)').interaction.options[0].label, /filled circle at 8.*left/i)
assert.match(at('A10.2 Q3 (number line)').interaction.options[0].label, /Filled circles at 500 and 520/)
assert.match(at('A10.2 Q5b').interaction.options[0].label, /filled circle at 5, an open circle at 12/)
assert.match(at('A10.1 Q5c').interaction.options[0].label, /^No: x > 4 has an open circle/)
assert.match(at('A10.2 Q5c').interaction.options[0].label, /−3 should be open and 2 filled/)
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
    assert.ok(step.frame.numberLine, `${state.id}: every step is drawn on the number line`)
    steps++
  }
  // The answer appears once, at the last step: a green answer box or green dots, never both.
  const answers = list.map((step, i) => { const f = step.frame.numberLine; return Boolean(f.answer?.at === i || f.dots?.at === i) })
  assert.deepEqual(answers.map((a, i) => a && i), answers.map((_, i) => i === list.length - 1 && i), `${state.id}: the answer comes once, in the last step`)
  const last = list.at(-1).frame.numberLine
  assert.ok(!(last.answer && last.dots), `${state.id}: the answer isn't shown twice`)
  // Halfway lines are purple, never green.
  assert.ok(list.every(step => (step.frame.numberLine.lines ?? []).every(line => line.family === 3)), `${state.id}: halfway results are purple`)
  // A drawn circle matches the answer: filled where the answer includes the number.
  const answerText = last.answer?.text.replace(/−/g, '-')
  const parsed = answerText && parseInequality(answerText)
  if (parsed) for (const c of last.circles ?? []) {
    const end = [parsed.lower, parsed.upper].find(e => e && e.value === c.value)
    assert.ok(end && end.included === c.closed, `${state.id}: the circle at ${c.value} matches ${answerText}`)
  }
}

// ---------- Wrong-answer messages ----------
const cases = [
  ['A10.1 Q2', 'x <= 3', 'open'], ['A10.1 Q2', 'x > 3', 'left'], ['A10.1 Q3', 'p < 8', 'allowed'], ['A10.1 Q4a', 't > -18', 'Colder'],
  ['A10.1 Q5a', 'x > -2', 'filled'], ['A10.1 Q5a', 'x >= -3', 'circle is at −2'], ['A10.1 Q5b', 'x <= 5', 'right'],
  ['A10.2 Q2', '-2 <= x <= 3', 'open'], ['A10.2 Q2', 'x > -2', 'two signs'], ['A10.2 Q4a', '-4 < x <= 1', 'wrong way round'], ['A10.2 Q4a', '-4 <= x <= 1', 'open'],
  ['A10.2 Q5a', '5 < a <= 12', 'wrong way round'], ['A10.2 Q3', '500 < w < 520', 'includes both'], ['A10.2 Q2', '-2 < y < 3', 'letter x'],
  ['A10.2 Q4b', '1', 'open'], ['A10.1 Q5a (smallest integer)', '-1', 'filled'],
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
const { NumberLineVisual } = require('../src/features/written-methods/tutor/InequalityPictures.tsx')
let dimChecked = 0
for (const { state, working } of workings) {
  working.examples[0].steps.forEach((step, i) => {
    const frame = step.frame.numberLine
    const html = renderToStaticMarkup(React.createElement(NumberLineVisual, { frame, focus: true }))
    const old = at => at >= 0 && frame.step > 0 && at < frame.step - 1
    const expected = (frame.circles ?? []).filter(c => old(c.at)).length + (frame.shade && old(frame.shade.at) ? 1 : 0) + (frame.lines ?? []).filter(line => old(line.at)).length
    assert.equal((html.match(/is-done/g) ?? []).length, expected, `${state.id} step ${i + 1}: ${expected} finished parts greyed out`)
    if (i === 0) assert.equal(expected, 0, `${state.id}: step 1 greys nothing`)
    assert.ok(!/ns-eq__answer[^"]*is-done|ns-nl__dot[^"]*is-done/.test(html), `${state.id} step ${i + 1}: the answer stays clear`)
    // The opening screen shows only what the question gives: nothing drawn yet for "show it", the line itself for "read it".
    if (i === 0) {
      const plain = renderToStaticMarkup(React.createElement(NumberLineVisual, { frame, plain: true }))
      assert.equal((plain.match(/ns-nl__circle/g) ?? []).length, (frame.circles ?? []).filter(c => c.at < 0).length, `${state.id}: the opening screen draws only the question's own circles`)
      assert.ok(!/ns-nl__box|ns-nl__dot|ns-eq__answer/.test(plain), `${state.id}: the opening screen has no working`)
    }
    dimChecked++
  })
}

// ---------- Videos: the zip's own files, source-identical ----------
assert.equal(states.filter(state => state.video).length, 2, 'One video per source PDF')
const mediaHashes = {
  'inequalities-on-a-number-line.mp4': '36d429e71aba55279b565c5b158a5c4b7023d44ec40f5ca55af366219f22dd97',
  'two-sided-inequalities.mp4': '9d2611eb87d4ea2cd6c470c83685e36f72af118fb2b991e4135875c78af603c7',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-24', name)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
  assert.ok(states.some(state => state.video?.src === `/media/lesson-24/${name}`), `${name} must be used`)
}

// ---------- The course ----------
const { mathsLessons, lessonCode } = require('../src/features/maths/courseRegistry.ts')
const a10 = mathsLessons.find(entry => entry.number === 24)
assert.equal(a10.chapterId, 'algebra')
assert.equal(a10.position, 10, 'Students see A10 as Algebra lesson 10')
assert.equal(lessonCode(a10), 'A10')
const app = read('src/App.tsx')
assert.ok(app.includes('case 24:') && app.includes('return <TutorInequalitiesLesson />'), 'Lesson 24 must open from the course and its direct route')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  24: {'), 'A10 needs key-fact cards')

console.log(`Greying out checked on ${dimChecked} steps.`)
console.log(`Lesson 24 (A10) verified: ${states.length} screens, all 16 source questions, ${typed} typed inequalities tested against every half-number from −40 to 600, ${steps} steps, ${cases.length} wrong-answer messages, 2 source-identical videos and the route.`)

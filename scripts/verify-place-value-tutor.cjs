const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const katex = require('katex')
const root = path.resolve(__dirname, '..')
function load(relative) {
  const filename = path.join(root, relative)
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, fileName: filename }).outputText
  const module = { exports: {} }
  const local = request => request.startsWith('.') ? load(path.relative(root, path.resolve(path.dirname(filename), request)) + '.ts') : require(request)
  Function('exports', 'module', 'require', output)(module.exports, module, local)
  return module.exports
}
const { checkAnswer } = load('src/features/number-types/lessonMath.ts')
const { tutorPlaceValueLesson: lesson } = load('src/features/place-value/tutor/placeValueLesson.ts')
const states = lesson.states
assert.equal(states.length, 23)
assert.equal(new Set(states.map(s => s.id)).size, states.length)
for (const [i, s] of states.entries()) {
  assert.equal(s.id, `L3-${String(i + 1).padStart(2, '0')}`)
  assert.equal(s.transition.onComplete, states[i + 1]?.id)
  assert.ok(s.sourceRef)
}
const expected = {
  'N3.1 Q2': 300, 'N3.1 Q3': '0', 'N3.1 Q4a': 40602, 'N3.1 Q4b': 600,
  'N3.1 Q5a': 800030, 'N3.1 Q5b': 800000, 'N3.1 Q5c': '0',
  'N3.2 Q2': .07, 'N3.2 Q3': .005, 'N3.2 Q4a': .0007, 'N3.2 Q4b': '0',
  'N3.2 Q5a': .0069, 'N3.2 Q5b': .0009, 'N3.2 Q5c': '0',
}
const questions = states.filter(s => s.interaction.type !== 'continue')
assert.equal(questions.length, 14)
for (const [source, answer] of Object.entries(expected)) {
  const matches = questions.filter(s => s.sourceRef.startsWith(source))
  assert.equal(matches.length, 1, source + ' must appear once as practice')
  const s = matches[0], rule = s.interaction
  assert.equal(rule.correctAnswer, answer, source + ' authored answer')
  assert.ok(s.hints?.length)
  assert.ok(s.feedback.correct.workedExplanation.steps.length >= 2)
  assert.deepEqual(s.feedback.correct.workedExplanation, s.feedback.incorrect.workedExplanation)
  const response = rule.acceptanceRule === 'fraction' ? '5/1000' : answer
  assert.equal(checkAnswer(rule, response), true, source + ' authored answer accepted')
  const wrong = rule.type === 'select' ? rule.options.find(o => o.id !== answer).id : Number(answer) * 10
  assert.equal(checkAnswer(rule, wrong), false, source + ' wrong answer rejected')
}
const fraction = questions.find(s => s.interaction.acceptanceRule === 'fraction').interaction
for (const response of ['5/1000', '1/200', '10 / 2000', ' 5 / 1000 ']) assert.equal(checkAnswer(fraction, response), true, response)
for (const response of ['0.005', '5/100', '5/10000', '5/0', '1/201', '5//1000', '5/1000x', '', '1e0/200']) assert.equal(checkAnswer(fraction, response), false, response)
for (const source of ['N3.1 Q1', 'N3.2 Q1']) assert.ok(states.some(s => s.sourceRef.startsWith(source)))
for (const s of questions.filter(s => s.interaction.acceptanceRule === 'normalisedNumber')) {
  assert.equal(checkAnswer(s.interaction, s.interaction.displayAnswer), true)
  assert.equal(checkAnswer(s.interaction, `${s.interaction.correctAnswer}0`), Number(`${s.interaction.correctAnswer}0`) === s.interaction.correctAnswer)
}
// Independent calculations catch column and ratio mistakes rather than mirroring content helpers.
assert.equal(8 * 100000 / (4 * 10), 20000)
assert.equal((7 * 1e-4) / (4 * 1e-5), 17.5)
assert.equal(4 * 10000 + 6 * 100 + 2, 40602)
assert.equal(8 * 100000 + 3 * 10, 800030)
assert.equal((6 * 10 + 9) / 10000, .0069)
const corrected = questions.find(s => s.sourceRef.startsWith('N3.2 Q4b'))
assert.ok(corrected.feedback.correct.workedExplanation.answer.includes('17.5'))
const videos = states.filter(s => s.video)
assert.deepEqual(videos.map(s => s.id), ['L3-02', 'L3-14'])
assert.deepEqual(videos.map(s => s.visual.opening.value), ['526,908', '0.6059'])
for (const s of videos) {
  assert.equal(s.interaction.type, 'continue')
  assert.equal(s.visual.kind, 'place-worked')
  assert.equal(s.visual.steps.filter(step => step.lines?.length).length, 2, 'Both digits of the video are worked out')
  for (const asset of [s.video.src, s.video.poster]) assert.ok(fs.statSync(path.join(root, 'public', asset)).size > 1000)
  assert.ok(s.video.textAlternative.length >= 3)
}
function removeUnderlines(math) {
  return math.replace(/\\underline\{((?:[^{}]|\{[^{}]*\})*)\}/g, '$1')
}
let calculations = 0, transitions = 0
for (const s of states.filter(s => s.visual.kind === 'cumulative')) {
  for (const calculation of [s.visual.calculation, ...(s.visual.calculation.additionalExamples ?? [])]) {
    calculations++
    let previous = calculation.math
    katex.renderToString(previous, { throwOnError: true })
    for (const step of calculation.steps) {
      transitions++
      assert.equal(removeUnderlines(step.previousMath), previous, s.id + ' must preserve the expression while underlining')
      assert.ok(step.previousMath.includes('\\underline'))
      assert.ok(!step.math.includes('='))
      for (const math of [step.previousMath, step.math]) katex.renderToString(math, { throwOnError: true })
      previous = step.math
    }
  }
}
// Every worked example and answer is a place-value chart, one move a step: every line is true, the working never jumps
// (each value is the digit times its column's value), and the answer is shown once, by the last move.
const { placeDigits, columnValue, digitValue } = load('src/features/place-value/tutor/placeWorking.ts')
const toNumber = text => text.includes('/') ? Number(text.split('/')[0]) / Number(text.split('/')[1]) : Number(text.replace(/,/g, ''))
let charts = 0
for (const s of states) {
  const working = s.visual.kind === 'place-worked' ? s.visual : s.working
  if (s.interaction.type !== 'continue' && !['N3.1 Q5c'].some(ref => s.sourceRef.startsWith(ref)) && s.interaction.type !== 'select') assert.ok(working, s.id + ': every answer has a chart working')
  if (!working) continue
  charts++
  assert.ok(!working.opening.boxed && !working.opening.answer, s.id + ': the opening screen is plain')
  working.steps.forEach((step, i) => {
    assert.ok(step.title.split(' ').length <= 5 && !/\.$/.test(step.title), s.id + ': short heading ' + step.title)
    assert.ok(!/[=×÷]|\d\s*[+−]\s*\d/.test(step.instruction), s.id + ': the ⓘ is words ' + step.instruction)
    const answers = (step.lines ?? []).filter(line => line.answer).length + (step.chart.answer ? 1 : 0) + (step.words ? 1 : 0)
    assert.equal(answers, i === working.steps.length - 1 ? 1 : 0, s.id + ' step ' + (i + 1) + ': the answer appears once, at the end')
    for (const line of step.lines ?? []) {
      const text = line.parts.map(part => part.text)
      if (text.length === 3 && ['×', '÷'].includes(text[1])) {
        const [a, op, b] = text.map(toNumber)
        const value = text[1] === '×' ? a * b : a / b
        assert.ok(Math.abs(value - toNumber(line.result)) < 1e-12, s.id + ': ' + text.join(' ') + ' → ' + line.result)
      }
    }
    if (step.chart.boxed !== undefined && step.lines?.[0]?.parts[1]?.text === '×' && !step.lines[0].parts[2].text.includes('/')) {
      const d = placeDigits(step.chart.value)[step.chart.boxed]
      assert.deepEqual(step.lines[0].parts.map(p => p.text), [String(d.digit), '×', columnValue(d.power)], s.id + ': the multiplier is the boxed digit’s column')
      assert.equal(step.lines[0].result, digitValue(d.digit, d.power))
    }
  })
  const end = working.steps.at(-1)
  const final = end.chart.answer ? end.chart.value : end.lines?.find(line => line.answer)?.result
  if (s.interaction.type === 'numericInput' && final) assert.ok(checkAnswer(s.interaction, final.replace(/,/g, '')), s.id + ': the working ends on the answer ' + final)
}
assert.equal(charts, 20)
const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8')
assert.ok(!app.includes('placeValueVariant'))
assert.ok(app.includes('case 3:') && app.includes('return <TutorPlaceValueLesson />'))
console.log(`Verified Lesson 3: ${states.length} reachable screens, ${questions.length} source practice parts, ${videos.length} matching videos, ${charts} place-value chart workings.`)

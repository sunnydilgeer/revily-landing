// Checks graphs lesson 8 (Real-life graphs, GR9). Three rungs, easiest first, each with its worked example; every answer
// worked out again from the question itself: conversions from the line drawn on its graph (either way, and scaled up
// for an amount off the graph), rates from the line's gradient, a fixed charge from where it starts, and the lines a
// question describes in words (a call-out charge plus a rate, two gyms) read by this file's own reader. Every reading
// lands on the graph, and the lesson is hidden.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorRealLifeGraphsLesson: lesson } = require('../src/features/real-life-graphs/tutor/realLifeGraphsLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const { lineKey } = require('../src/features/written-methods/tutor/LineBoard.tsx')
const { graphsLessons } = require('../src/features/graphs/graphsLessons.ts')

const near = (a, b) => Math.abs(a - b) < 1e-9
/** A drawn line as y = mx + c, from its two ends. */
const lineOf = line => { const m = (line.to.y - line.from.y) / (line.to.x - line.from.x); return { m, c: line.from.y - m * line.from.x } }
const onGrid = (p, g) => p.x >= g.scale.x.start && p.x < g.x[1] && p.y >= g.scale.y.start && p.y < g.y[1]
const corner = (p, g) => near(((p.x - g.x[0]) / g.scale.x.per) % 1, 0) && near(((p.y - g.y[0]) / g.scale.y.per) % 1, 0)

// ---------- Structure ----------
const states = lesson.states
const rungs = ['graphs-real-convert', 'graphs-real-rate', 'graphs-real-fixed']
assert.equal(lesson.id, 'L108', 'Hidden graphs lessons are numbered from 101')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Three rungs, easiest first, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L108-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})
for (const rung of rungs) {
  const own = states.filter(state => state.microSkillId === rung)
  assert.ok(own.some(state => state.interaction.type === 'continue' && state.visual.kind === 'method-worked'), `${rung} has its worked example`)
  assert.ok(own.filter(state => state.interaction.type !== 'continue').length >= 3, `${rung} has at least three questions`)
}
const play = states[0].board
assert.equal(play?.mode, 'rule', 'The lesson opens with a play screen: slide along a conversion line')
assert.ok(play.reads && play.grid.scale, 'The play screen reads amounts on real-life axes')
assert.deepEqual(lineOf(play.grid.lines[0]), play.rule, 'The dot slides along the line drawn')
assert.ok(states.some(state => state.video), 'The lesson has its video')
assert.ok(states.filter(state => state.board && state.interaction.type !== 'continue').length >= 3, 'Hands-on: at least three questions answered on the board')
assert.equal(states.filter(state => state.interaction.type === 'select').length, 1, 'Multiple choice only for the one concept check')
assert.ok(graphsLessons.some(entry => entry.number === 108 && entry.definition === lesson), 'Lesson 108 is on the Graphs shelf')

// ---------- Every answer worked out again ----------
let checked = 0
for (const state of states.filter(state => rungs.includes(state.microSkillId) && state.interaction.type !== 'continue')) {
  const title = state.content.title, { interaction } = state
  const g = state.board?.grid ?? state.visual.diagram.frame
  assert.ok(g.scale, `${state.id}: real-life axes`)
  const right = value => assert.ok(checkAnswer(interaction, String(value)) && !checkAnswer(interaction, String(value + 1)), `${state.id}: the answer is ${value}`)
  const tapped = p => {
    assert.ok(checkAnswer(interaction, `${p.x}, ${p.y}`), `${state.id}: the point is (${p.x}, ${p.y})`)
    assert.ok(onGrid(p, g) && corner(p, g), `${state.id}: (${p.x}, ${p.y}) is a corner on the graph, so it can be tapped`)
  }
  const [l] = (g.lines ?? []).map(lineOf)
  let m
  if ((m = /changes? [£€](\d+) into (pounds|euros)/.exec(title))) {
    const n = Number(m[1]), off = /only goes to £(\d+)/.exec(title)
    const p = m[2] === 'euros' ? { x: n, y: l.m * n + l.c } : { x: (n - l.c) / l.m, y: n }
    right(m[2] === 'euros' ? p.y : p.x)
    if (off) assert.ok(n > Number(off[1]) && Number.isInteger(n / (n / 10)) && onGrid({ x: n / 10, y: l.m * n / 10 }, g), `${state.id}: a tenth of it is on the graph`)
    else assert.ok(onGrid(p, g), `${state.id}: the reading is on the graph`)
  } else if ((m = /shows €(\d+) in pounds/.exec(title))) {
    tapped({ x: (Number(m[1]) - l.c) / l.m, y: Number(m[1]) })
  } else if (/a second\?|a minute go in|a minute drain/.test(title)) {
    right(Math.abs(l.m))
  } else if (/What does its gradient tell you/.test(title)) {
    assert.match(interaction.options.find(option => option.id === interaction.correctAnswer).label, /cost of 1 kg/, `${state.id}: the gradient is the cost of 1 kg`)
    for (const option of interaction.options.filter(option => option.id !== interaction.correctAnswer)) assert.ok(option.feedback, `${state.id}: "${option.label}" has its own note`)
  } else if (/fixed charge\?/.test(title)) {
    right(l.c)
    assert.ok(state.diagnose(String(l.m)), `${state.id}: the daily rate given as the fixed charge is explained`)
  } else if (/each extra day/.test(title)) {
    right(l.m)
    assert.ok(state.diagnose(String((l.m * 6 + l.c) / 6)), `${state.id}: a gradient from £0 is explained`)
  } else if ((m = /charges £(\d+) to come out, plus £(\d+) an hour/.exec(title))) {
    const c = Number(m[1]), k = Number(m[2])
    assert.ok(checkAnswer(interaction, lineKey({ x: 2, y: c + 2 * k }, { x: 4, y: c + 4 * k })), `${state.id}: any two points of the cost line are right`)
    assert.ok(!checkAnswer(interaction, lineKey({ x: 0, y: 0 }, { x: 1, y: k })) && state.diagnose(lineKey({ x: 0, y: 0 }, { x: 1, y: k })), `${state.id}: a line from £0 is wrong and explained`)
    for (const x of [0, 1, 2, 3, 4]) assert.ok(onGrid({ x, y: c + k * x }, g) && corner({ x, y: c + k * x }, g), `${state.id}: hour ${x} is on a corner`)
  } else if ((m = /costs £(\d+) to join, then £(\d+) a month\. Gym B costs £(\d+) a month/.exec(title))) {
    const a = { m: Number(m[2]), c: Number(m[1]) }, b = { m: Number(m[3]), c: 0 }
    const lines = g.lines.map(lineOf)
    assert.ok(lines.some(q => near(q.m, a.m) && near(q.c, a.c)) && lines.some(q => near(q.m, b.m) && near(q.c, b.c)), `${state.id}: both gyms are drawn`)
    const x = (b.c - a.c) / (a.m - b.m)
    tapped({ x, y: a.m * x + a.c })
  } else assert.fail(`${state.id}: a question this file doesn't know how to check`)
  checked++
  const frames = state.working.examples[0].steps.map(step => step.frame.graph)
  assert.equal(frames.filter(frame => frame.answer).length, 1, `${state.id}: the answer is written once`)
  assert.ok(frames.at(-1).answer, `${state.id}: the answer is the last step`)
  for (const frame of frames) {
    assert.ok((frame.x[1] - frame.x[0]) / frame.scale.x.per <= 9, `${state.id}: at most 9 squares across`)
    for (const mk of frame.marks ?? []) assert.equal(mk.family, mk.axis === 'x' ? 1 : 0, `${state.id}: ${mk.axis} highlighted in its colour`)
    for (const line of frame.lines ?? []) assert.ok(line.from.x >= 0 && line.from.y >= 0 && line.to.x >= 0 && line.to.y >= 0, `${state.id}: lines stay off the negative side`)
  }
}
assert.equal(checked, states.filter(state => state.interaction.type !== 'continue' && rungs.includes(state.microSkillId)).length, 'Every question is checked')

// ---------- Worked examples ----------
for (const state of states.filter(state => state.interaction.type === 'continue' && state.visual.kind === 'method-worked')) {
  const frames = state.visual.examples[0].steps.map(step => step.frame.graph), last = frames.at(-1), l = lineOf(frames[0].lines[0])
  let m
  if ((m = /change £(\d+) into euros/.exec(state.content.title))) assert.equal(last.answer.text, `€${l.m * Number(m[1])}`, `${state.id}: the conversion`)
  else if (/litres a minute/.test(state.content.title)) assert.equal(last.answer.text, `${l.m} litres a minute`, `${state.id}: the rate is the gradient`)
  else if ((m = /(\d+)-hour job/.exec(state.content.title))) assert.equal(last.answer.text, `£${l.m * Number(m[1]) + l.c}`, `${state.id}: fixed charge plus the rate`)
  else assert.fail(`${state.id}: a worked example this file doesn't know`)
}

// ---------- Hidden: only the Graphs shelf opens it ----------
for (const file of ['src/features/maths/courseRegistry.ts', 'src/App.tsx']) assert.ok(!/real-life-graphs|tutorRealLifeGraphsLesson|['"`]L108\b/.test(read(file)), `Lesson 108 is not in ${file}`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!read(file).includes('real-life-graphs/') && !/['"`]L108\b/.test(read(file)), `Lesson 108 is not in ${file}`)
}
console.log(`Graphs lesson 8 (real-life graphs): ${states.length} screens, ${checked} questions checked.`)

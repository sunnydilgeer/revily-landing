// Checks graphs lesson 6 (Quadratic and cubic graphs, GR6). Three rungs, easiest first, each with its worked example;
// every answer worked out again from the question's own rule, read from its words with this file's own reader (not the
// lesson's): a table's y, every point a plotting question needs, the wrong point in a table, a curve's lowest point.
// Every table and plotted point fits on its grid; the plotting board's right curve is the question's; the working ends
// with the answer once, and a plotting working ends with the smooth curve, green. And the lesson is hidden.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorCurveGraphsLesson: lesson } = require('../src/features/curve-graphs/tutor/curveGraphsLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const { graphsLessons } = require('../src/features/graphs/graphsLessons.ts')

/** "y = 5 − x²" → y at x, from the words: each term's sign, number and power. */
function rule(text) {
  const right = text.replace(/^y = /, '').replace(/−/g, '-').replace(/\s+/g, '')
  const parts = right.match(/[+-]?[^+-]+/g)
  const terms = parts.map(part => {
    const m = /^([+-]?)(\d*)(x([²³])?)?$/.exec(part)
    assert.ok(m, `"${part}" is a term of ${text}`)
    return { k: (m[1] === '-' ? -1 : 1) * (m[2] === '' ? 1 : Number(m[2])), p: m[3] ? m[4] === '³' ? 3 : m[4] === '²' ? 2 : 1 : 0 }
  })
  return { at: x => terms.reduce((s, t) => s + t.k * x ** t.p, 0), power: Math.max(...terms.map(t => t.p)), coeffs: [0, 1, 2, 3].map(p => terms.filter(t => t.p === p).reduce((s, t) => s + t.k, 0)) }
}
const ruleIn = words => /y = [\dx²³−+ ]+/.exec(words)?.[0].trim()
const inside = (p, g) => p.x > g.x[0] && p.x < g.x[1] && p.y > g.y[0] && p.y < g.y[1]
const show = n => String(n).replace('-', '−')

// ---------- Structure ----------
const states = lesson.states
const rungs = ['graphs-curve-table', 'graphs-curve-plot', 'graphs-curve-shapes']
assert.equal(lesson.id, 'L106', 'Hidden graphs lessons are numbered from 101')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Three rungs, easiest first, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L106-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})
for (const rung of rungs) {
  const own = states.filter(state => state.microSkillId === rung)
  assert.ok(own.some(state => state.interaction.type === 'continue' && state.visual.kind === 'method-worked'), `${rung} has its worked example`)
  assert.ok(own.filter(state => state.interaction.type !== 'continue').length >= 3, `${rung} has at least three questions`)
}
assert.equal(states[0].board?.mode, 'rule', 'The lesson opens with a play screen: slide along a curve')
assert.ok(states[0].board.curve && states[0].board.grid.table.xs.every(x => inside({ x, y: rule(states[0].board.curveText).at(x) }, states[0].board.grid)), 'The play screen’s curve stays on its grid')
assert.ok(states.some(state => state.video), 'The lesson has its video')
assert.ok(states.filter(state => state.board && state.interaction.type !== 'continue').length >= 5, 'Hands-on: at least five questions answered on the board')
assert.ok(states.filter(state => state.board?.mode === 'points').length >= 3, 'At least three plotting questions on the board')
assert.equal(states.filter(state => state.interaction.type === 'select').length, 1, 'Multiple choice only for the one shape check')
assert.ok(graphsLessons.some(entry => entry.number === 106 && entry.definition === lesson), 'Lesson 106 is on the Graphs shelf')

// ---------- Every answer worked out again ----------
let checked = 0
for (const state of states.filter(state => rungs.includes(state.microSkillId) && state.interaction.type !== 'continue')) {
  const words = ruleIn(state.content.title)
  assert.ok(words, `${state.id}: the question names its rule`)
  const r = rule(words), { interaction } = state
  const g = state.board?.grid ?? state.visual.diagram?.frame
  const find = /Find y when x = (−?\d+)/.exec(state.content.title)
  if (find) {
    const x = Number(find[1].replace('−', '-')), y = r.at(x)
    assert.ok(checkAnswer(interaction, String(y)) && !checkAnswer(interaction, String(y + 1)), `${state.id}: y = ${y}`)
    const t = g.table
    assert.equal(t.ys[t.ask], null, `${state.id}: the asked cell is empty`)
    assert.equal(t.xs[t.ask], x, `${state.id}: the table asks for x = ${x}`)
    t.xs.forEach((tx, i) => { if (i !== t.ask) assert.equal(t.ys[i], r.at(tx), `${state.id}: the table’s y at x = ${tx}`) })
    t.xs.forEach(tx => assert.ok(inside({ x: tx, y: r.at(tx) }, g), `${state.id}: (${tx}, ${r.at(tx)}) is on the grid`))
    if (x < 0 && r.power >= 2) {
      const flipped = [0, 1, 2, 3].reduce((s, p) => s + r.coeffs[p] * (p >= 2 ? -(x ** p) : x ** p), 0)
      if (flipped !== y) assert.ok(state.diagnose(String(flipped)), `${state.id}: a square or cube with the wrong sign is explained`)
    }
  } else if (state.board?.mode === 'points') {
    const xs = g.table.xs
    assert.deepEqual(g.table.ys, xs.map(r.at), `${state.id}: the table is the rule’s`)
    const key = xs.map(x => `${x}, ${r.at(x)}`).join(', ')
    assert.ok(checkAnswer(interaction, key), `${state.id}: plotting every column is right`)
    assert.ok(!checkAnswer(interaction, xs.map((x, i) => `${x}, ${r.at(x) + (i === 1 ? 1 : 0)}`).join(', ')), `${state.id}: one point off is wrong`)
    assert.ok(state.diagnose(xs.map((x, i) => `${x}, ${r.at(x) + (i === 1 ? 1 : 0)}`).join(', ')), `${state.id}: one point off is explained`)
    assert.deepEqual(state.board.curve.slice(0, 4).concat([0, 0, 0, 0]).slice(0, 4), r.coeffs, `${state.id}: the board’s right curve is the rule’s`)
    xs.forEach(x => assert.ok(inside({ x, y: r.at(x) }, g), `${state.id}: (${x}, ${r.at(x)}) is on the grid, off its edges`))
  } else if (/wrong y/.test(state.content.title)) {
    const t = g.table, wrong = t.xs.filter((x, i) => t.ys[i] !== r.at(x))
    assert.equal(wrong.length, 1, `${state.id}: exactly one y is wrong`)
    const p = { x: wrong[0], y: t.ys[t.xs.indexOf(wrong[0])] }
    assert.ok(checkAnswer(interaction, `${p.x}, ${p.y}`), `${state.id}: the wrong point is (${p.x}, ${p.y})`)
    assert.ok(g.points.some(q => q.x === p.x && q.y === p.y), `${state.id}: the wrong point is plotted`)
    assert.ok(state.diagnose(`${p.x}, ${r.at(p.x)}`), `${state.id}: tapping where it should be is explained`)
  } else if (/lowest point/.test(state.content.title)) {
    const curve = g.curves[0]
    assert.deepEqual(curve.coeffs, r.coeffs, `${state.id}: the drawn curve is the rule’s`)
    // The lowest corner the curve passes through, found by trying every x on the grid.
    let low = null
    for (let x = g.x[0] + 1; x < g.x[1]; x++) if (x >= curve.from && x <= curve.to && (!low || r.at(x) < low.y)) low = { x, y: r.at(x) }
    assert.ok(r.at(low.x - 0.5) > low.y && r.at(low.x + 0.5) > low.y, `${state.id}: (${low.x}, ${low.y}) is the turning point`)
    assert.ok(checkAnswer(interaction, `${low.x}, ${low.y}`), `${state.id}: the lowest point is (${low.x}, ${low.y})`)
    assert.ok(inside(low, g), `${state.id}: it is on the grid`)
  } else if (interaction.type === 'select') {
    const shape = r.power === 3 ? 'S' : r.coeffs[2] > 0 ? 'U' : '∩'
    const right = interaction.options.find(option => option.id === interaction.correctAnswer)
    assert.ok(right.label.startsWith(shape), `${state.id}: the shape is ${shape}`)
    for (const option of interaction.options.filter(option => option !== right)) assert.ok(option.feedback, `${state.id}: "${option.label}" has its own note`)
  } else assert.fail(`${state.id}: a question this file doesn’t know how to check`)
  checked++

  // The working: the answer written once, at the end; a plotting working ends with the curve, green.
  const steps = state.working.examples[0].steps, frames = steps.map(step => step.frame.graph)
  assert.equal(frames.filter(frame => frame.answer).length, 1, `${state.id}: the answer is written once`)
  assert.ok(frames.at(-1).answer, `${state.id}: the answer is the last step`)
  if (state.board?.mode === 'points') {
    const last = frames.at(-1).curves.at(-1)
    assert.ok(last.answer && last.coeffs.every((k, p) => k === r.coeffs[p]), `${state.id}: the working joins the rule’s curve, green`)
    assert.equal(frames.at(-1).answer.text, words, `${state.id}: the answer is the curve’s rule`)
  }
  for (const frame of frames) for (const m of frame.marks ?? []) assert.equal(m.family, m.axis === 'x' ? 1 : 0, `${state.id}: ${m.axis} highlighted in its colour`)
}
assert.equal(checked, states.filter(state => state.interaction.type !== 'continue' && rungs.includes(state.microSkillId)).length, 'Every question is checked')

// ---------- Worked examples: their tables and curves are the rule's ----------
for (const state of states.filter(state => state.interaction.type === 'continue' && state.visual.kind === 'method-worked')) {
  const r = rule(ruleIn(state.content.title)), frames = state.visual.examples[0].steps.map(step => step.frame.graph), last = frames.at(-1)
  assert.deepEqual(last.table.ys, last.table.xs.map(r.at), `${state.id}: the table is filled in right`)
  last.table.xs.forEach(x => assert.ok(inside({ x, y: r.at(x) }, last), `${state.id}: (${x}, ${r.at(x)}) is on the grid`))
  if (/Draw the graph/.test(state.content.title)) assert.ok(last.curves?.at(-1)?.answer, `${state.id}: it ends with the smooth curve, green`)
  for (const frame of frames) {
    assert.ok(frame.x[1] - frame.x[0] <= 9, `${state.id}: at most 9 squares across`)
    for (const line of frame.working ?? []) {
      const m = /^(.*) = (−?\d+)$/.exec(line.text)
      if (m && /\(−\d+\)[²³]/.test(m[1])) assert.ok(r.at(Number(/\((−\d+)\)/.exec(m[1])[1].replace('−', '-'))) === Number(m[2].replace('−', '-')), `${state.id}: "${line.text}" adds up`)
    }
  }
}

// ---------- Hidden: only the Graphs shelf opens it ----------
for (const file of ['src/features/maths/courseRegistry.ts', 'src/App.tsx']) assert.ok(!/curve-graphs|tutorCurveGraphsLesson|['"`]L106\b/.test(read(file)), `Lesson 106 is not in ${file}`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!read(file).includes('curve-graphs/') && !/['"`]L106\b/.test(read(file)), `Lesson 106 is not in ${file}`)
}
console.log(`Graphs lesson 6 (quadratic and cubic graphs): ${states.length} screens, ${checked} questions checked.`)
void show

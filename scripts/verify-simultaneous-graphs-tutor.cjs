// Checks graphs lesson 5 (Simultaneous equations by graph, GR7). Three rungs, easiest first, each with its worked
// example; every answer worked out again from the question's own words: each equation in it read as ax + by = k and
// the pair solved by elimination (not by reading the lesson's lines), so the crossing the lesson draws must be the
// algebra's solution. Lines drawn on the board are the question's second equation; taps land on the crossing; typed
// answers are "x, y". Every working draws the lines, reads the crossing, checks it in both and writes the answer once.
// And the lesson is hidden: only the Graphs shelf opens it.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorSimultaneousGraphsLesson: lesson } = require('../src/features/simultaneous-graphs/tutor/simultaneousGraphsLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const { lineKey } = require('../src/features/written-methods/tutor/LineBoard.tsx')
const { graphsLessons } = require('../src/features/graphs/graphsLessons.ts')

const near = (a, b) => Math.abs(a - b) < 1e-9
/** An equation from its own words, any terms on either side: "2y + 3x = −1" → { a: 3, b: 2, k: −1 } for ax + by = k. */
function equation(text) {
  const side = words => {
    const t = { x: 0, y: 0, k: 0 }
    for (const [, sign, n, v] of words.replace(/−/g, '-').replace(/½/g, '0.5').replace(/\s+/g, '').matchAll(/([+-]?)(\d*\.?\d*)([xy]?)/g)) {
      if (n === '' && !v) continue
      t[v || 'k'] += (sign === '-' ? -1 : 1) * (n === '' ? 1 : Number(n))
    }
    return t
  }
  const [l, r] = text.split('=').map(side)
  return { a: l.x - r.x, b: l.y - r.y, k: r.k - l.k }
}
const equations = title => [...title.matchAll(/(?:^|\s)(\d*y [+−] \d*x = −?\d+|y = −?\d*x(?: [+−] \d+)?)(?= |\.|,|$)/g)].map(m => equation(m[1]))
/** Elimination (Cramer's rule): the x and y that make both true. */
function solve(p, q) {
  const det = p.a * q.b - q.a * p.b
  assert.ok(det !== 0, 'The two lines cross once')
  return { x: (p.k * q.b - q.k * p.b) / det, y: (p.a * q.k - q.a * p.k) / det }
}
const on = (e, p) => near(e.a * p.x + e.b * p.y, e.k)

// ---------- Structure ----------
const states = lesson.states
const rungs = ['graphs-simultaneous-read', 'graphs-simultaneous-draw', 'graphs-simultaneous-rearrange']
assert.equal(lesson.id, 'L105', 'Hidden graphs lessons are numbered from 101')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Three rungs, easiest first, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L105-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})
for (const rung of rungs) {
  const own = states.filter(state => state.microSkillId === rung)
  assert.ok(own.some(state => state.interaction.type === 'continue' && state.visual.kind === 'method-worked'), `${rung} has its worked example`)
  assert.ok(own.filter(state => state.interaction.type !== 'continue').length >= 3, `${rung} has at least three questions`)
}
assert.equal(states[0].board?.mode, 'explore', 'The lesson opens with a play screen: put the dot on both lines')
assert.ok(states.some(state => state.video), 'The lesson has its video')
assert.ok(states.filter(state => state.board && state.interaction.type !== 'continue').length >= 5, 'Hands-on: at least five questions answered on the board')
assert.equal(states.filter(state => state.interaction.type === 'select').length, 1, 'Multiple choice only for the one concept check')
assert.ok(graphsLessons.some(entry => entry.number === 105 && entry.definition === lesson), 'Lesson 105 is on the Graphs shelf')

// ---------- Every answer worked out again ----------
let checked = 0
const pairs = new Map()
for (const state of states.filter(state => rungs.includes(state.microSkillId))) {
  let eqs = equations(state.content.title)
  // "Tap the point that solves both equations" names them on its grid instead.
  if (eqs.length < 2) eqs = (state.board?.grid ?? state.visual.diagram?.frame)?.lines?.map(line => equation(line.label)) ?? []
  if (state.interaction.type === 'continue' && state.board) continue
  assert.equal(eqs.length, 2, `${state.id}: two equations`)
  const p = solve(...eqs)
  const { interaction } = state
  if (interaction.type !== 'continue') {
    if (state.board?.mode === 'line') {
      const second = eqs[1], ends = [{ x: 0, y: second.k / second.b }, { x: second.b, y: (second.k - second.a * second.b) / second.b }]
      assert.ok(checkAnswer(interaction, lineKey(...ends)), `${state.id}: drawing ${JSON.stringify(second)} is right`)
      assert.ok(!checkAnswer(interaction, lineKey({ x: 0, y: 0 }, { x: 1, y: 1 })), `${state.id}: another line is wrong`)
      const given = state.board.grid.lines[0]
      const first = eqs[0]
      assert.ok(on(first, given.from) && on(first, given.to), `${state.id}: the grid shows the first line`)
      for (const q of [p, ends[0]]) assert.ok(q.x > state.board.grid.x[0] && q.x < state.board.grid.x[1] && q.y > state.board.grid.y[0] && q.y < state.board.grid.y[1], `${state.id}: the crossing and c are on the board`)
    } else if (interaction.type === 'select') {
      assert.match(interaction.options[0].label, /both equations/, `${state.id}: the right option says both equations`)
      for (const option of interaction.options.slice(1)) assert.ok(option.feedback, `${state.id}: "${option.label}" has its own note`)
    } else {
      assert.equal(interaction.correctAnswer, `${p.x}, ${p.y}`, `${state.id}: the solution is x = ${p.x}, y = ${p.y}`)
      assert.ok(checkAnswer(interaction, `${p.x}, ${p.y}`) && !checkAnswer(interaction, `${p.y}, ${p.x}`) || p.x === p.y, `${state.id}: x then y`)
      if (p.x !== p.y) assert.ok(state.diagnose(`${p.y}, ${p.x}`), `${state.id}: x and y swapped is explained`)
      const lines = (state.board?.grid ?? state.visual.diagram.frame).lines
      assert.equal(lines.length, 2, `${state.id}: both lines are drawn`)
      lines.forEach((line, i) => assert.ok(on(eqs[i], line.from) && on(eqs[i], line.to), `${state.id}: line ${i + 1} is the question's equation`))
      const grid = state.board?.grid ?? state.visual.diagram.frame
      assert.ok(p.x > grid.x[0] && p.x < grid.x[1] && p.y > grid.y[0] && p.y < grid.y[1], `${state.id}: the crossing is on the grid`)
      assert.ok(Number.isInteger(p.x) && Number.isInteger(p.y), `${state.id}: the crossing is on a grid corner, so it can be read`)
      if (state.board?.mode === 'plot') assert.ok(state.diagnose(`${p.x + 1}, ${(eqs[0].k - eqs[0].a * (p.x + 1)) / eqs[0].b}`), `${state.id}: a point on one line only is explained`)
    }
    checked++
  }
  // The working: lines drawn, the crossing read and checked in both, the answer once.
  const model = interaction.type === 'continue' ? state.visual : state.working
  const steps = model.examples[0].steps, frames = steps.map(step => step.frame.graph)
  assert.deepEqual(steps.slice(-3).map(step => step.title), ['Where they cross', 'Check in both', 'The solution'], `${state.id}: read, check, answer`)
  assert.equal(frames.at(-1).answer.text, `x = ${p.x}, y = ${p.y}`.replace(/-/g, '−'), `${state.id}: the answer is the solution`)
  assert.equal(frames.filter(frame => frame.answer).length, 1, `${state.id}: the answer is written once`)
  const last = frames.at(-1)
  assert.equal(last.lines.length, 2, `${state.id}: both lines are on the grid at the end`)
  last.lines.forEach((line, i) => assert.ok(on(eqs[i], line.from) && on(eqs[i], line.to), `${state.id}: the working's line ${i + 1} is the question's`))
  const checks = frames.at(-2).working.slice(-2).map(line => line.text)
  assert.ok(checks.every(text => text.endsWith('✓') && text.includes(`= ${String(p.y).replace('-', '−')} ✓`)), `${state.id}: both checks give y = ${p.y}`)
  for (const frame of frames) {
    assert.ok(frame.x[1] - frame.x[0] <= 9, `${state.id}: at most 9 squares across`)
    for (const m of frame.marks ?? []) assert.equal(m.family, m.axis === 'x' ? 1 : 0, `${state.id}: ${m.axis} highlighted in its colour`)
  }
  pairs.set(JSON.stringify(eqs), (pairs.get(JSON.stringify(eqs)) ?? 0) + 1)
}
assert.equal(checked, states.filter(state => state.interaction.type !== 'continue' && rungs.includes(state.microSkillId)).length, 'Every question is checked')

// ---------- Hidden: only the Graphs shelf opens it ----------
for (const file of ['src/features/maths/courseRegistry.ts', 'src/App.tsx']) assert.ok(!/simultaneous-graphs|tutorSimultaneousGraphsLesson|L105/.test(read(file)), `Lesson 105 is not in ${file}`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!read(file).includes('simultaneous-graphs/') && !/['"`]L105\b/.test(read(file)), `Lesson 105 is not in ${file}`)
}
console.log(`Graphs lesson 5 (simultaneous equations by graph): ${states.length} screens, ${checked} questions checked.`)

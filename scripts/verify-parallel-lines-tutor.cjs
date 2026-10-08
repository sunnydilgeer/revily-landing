// Checks graphs lesson 4 (Parallel lines, GR5). Three rungs, easiest first, each with its worked example; every answer
// worked out again from the question's own words: each equation in it read as ax + by = k, its gradient −a ÷ b, and
// parallel meaning the same gradient. Tilt, m-and-c and draw-a-line questions are answered on the board; choose-all
// questions tick exactly the parallel lines, with a note on each wrong one; the line through a point is
// y − y₁ = m(x − x₁). Workings end on the green answer, with x lit amber and y biro blue. And the lesson is hidden:
// only the Graphs shelf opens it.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorParallelLinesLesson: lesson } = require('../src/features/parallel-lines/tutor/parallelLinesLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const { lineKey } = require('../src/features/written-methods/tutor/LineBoard.tsx')
const { graphsLessons } = require('../src/features/graphs/graphsLessons.ts')

const near = (a, b) => Math.abs(a - b) < 1e-9
const num = s => Number(s.replace('−', '-'))
/** An equation's line from its own words, any terms on either side: "4y − 8x = 12" → m 2, c 3. */
function linear(text) {
  const side = words => {
    const t = { x: 0, y: 0, k: 0 }
    for (const [, sign, n, v] of words.replace(/−/g, '-').replace(/½/g, '0.5').replace(/\s+/g, '').matchAll(/([+-]?)(\d*\.?\d*)([xy]?)/g)) {
      if (n === '' && !v) continue
      t[v || 'k'] += (sign === '-' ? -1 : 1) * (n === '' ? 1 : Number(n))
    }
    return t
  }
  const [l, r] = text.split('=').map(side)
  const a = l.x - r.x, b = l.y - r.y, k = l.k - r.k
  assert.ok(b !== 0, `${text} is a line y = mx + c`)
  return { m: -a / b, c: -k / b }
}
const equations = title => [...title.matchAll(/(?:^|\s)((?:[-−\d½]*[xy](?: [+−-] [\d½]*[xy]?)*|\d+ [+−-] \d*x) = [-−]?[\d½]*[xy]?(?: [+−-] [\d½]*[xy]?)*)(?=[.,?]|\s+(?:that|parallel|in)|$)/g)].map(m => m[1])
const pointOf = title => { const m = /\((−?\d+), (−?\d+)\)/.exec(title); return m && { x: num(m[1]), y: num(m[2]) } }

// ---------- Structure ----------
const states = lesson.states
const rungs = ['graphs-parallel-gradient', 'graphs-parallel-rearrange', 'graphs-parallel-through']
assert.equal(lesson.id, 'L104', 'Hidden graphs lessons are numbered from 101')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Three rungs, easiest first, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L104-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})
for (const rung of rungs) {
  const own = states.filter(state => state.microSkillId === rung)
  assert.ok(own.some(state => state.interaction.type === 'continue' && state.visual.kind === 'method-worked'), `${rung} has its worked example`)
  assert.ok(own.filter(state => state.interaction.type !== 'continue').length >= 4, `${rung} has at least four questions`)
}
assert.ok(states.find(state => state.microSkillId === rungs[0]).board?.mode === 'tilt', 'Same gradient opens with a tilt play screen')
assert.ok(states.find(state => state.microSkillId === rungs[2]).board?.mode === 'line', 'Through a point opens with a draw-a-line play screen')
assert.ok(states.some(state => state.video), 'The lesson has its video')
assert.ok(states.filter(state => state.board && state.interaction.type !== 'continue').length >= 4, 'Hands-on: at least four questions answered on the board')
assert.ok(states.filter(state => state.interaction.type === 'select').length <= 1, 'At most one single-choice question')
assert.ok(graphsLessons.some(entry => entry.number === 104 && entry.definition === lesson), 'Lesson 104 is on the Graphs shelf')

// ---------- Every answer worked out again ----------
let checked = 0
for (const state of states.filter(state => state.interaction.type !== 'continue' && rungs.includes(state.microSkillId))) {
  const { interaction } = state, title = state.content.title
  const eqs = equations(title)
  if (state.board?.mode === 'tilt') {
    const { m } = linear(eqs[0])
    assert.equal(state.board.target, m, `${state.id}: tilt to the black line's gradient, ${m}`)
    const [a, b] = state.board.ends
    assert.ok(!near((b.y - a.y) / (b.x - a.x), m), `${state.id}: the line doesn't start parallel`)
    assert.ok(checkAnswer(interaction, String(m)) && !checkAnswer(interaction, String(-m)), `${state.id}: ${m} is right, ${-m} is not`)
  } else if (state.board?.mode === 'equation') {
    const { m } = linear(eqs[0]), c = num(/axis at (−?\d+)/.exec(title)[1])
    assert.deepEqual(state.board.equation, { m, c }, `${state.id}: the board's target is y = ${m}x + ${c}`)
    assert.ok(checkAnswer(interaction, `${m}, ${c}`) && !checkAnswer(interaction, `${state.board.rule.m}, ${state.board.rule.c}`), `${state.id}: right on the board, and it doesn't start there`)
  } else if (state.board?.mode === 'line') {
    const { m } = linear(eqs[0]), p = pointOf(title), c = p.y - m * p.x
    const d = [1, 2, 3, 4].find(d => Number.isInteger(m * d))
    assert.equal(interaction.correctAnswer, lineKey({ x: 0, y: c }, { x: d, y: c + m * d }), `${state.id}: the line drawn is y = ${m}x + ${c}`)
    assert.ok(checkAnswer(interaction, lineKey(p, { x: p.x + 2 * d, y: p.y + 2 * m * d })), `${state.id}: any two points on it are right`)
    const { grid } = state.board
    for (const q of [p, { x: 0, y: c }]) assert.ok(q.x > grid.x[0] && q.x < grid.x[1] && q.y > grid.y[0] && q.y < grid.y[1], `${state.id}: the point and the crossing are on the board`)
    assert.ok(state.diagnose(lineKey({ x: 0, y: linear(eqs[0]).c }, { x: d, y: linear(eqs[0]).c + m * d })), `${state.id}: drawing the same line again is explained`)
    assert.ok(state.diagnose(lineKey(p, { x: p.x + d, y: p.y - m * d })), `${state.id}: the other tilt through the point is explained`)
    assert.ok(state.diagnose(lineKey({ x: 0, y: c + 1 }, { x: d, y: c + 1 + m * d })), `${state.id}: parallel but missing the point is explained`)
  } else if (interaction.type === 'multiSelect') {
    const options = interaction.options.map(option => ({ id: option.id, m: linear(option.label).m }))
    const target = eqs.length ? linear(eqs[0]).m : options.map(o => o.m).find((m, i, all) => all.findIndex(n => near(n, m)) !== i)
    const right = options.filter(o => near(o.m, target)).map(o => o.id)
    assert.deepEqual([...interaction.correctAnswer].sort(), right.sort(), `${state.id}: the parallel ones are ${right}`)
    if (!eqs.length) assert.equal(right.length, 2, `${state.id}: exactly two are parallel`)
    for (const o of options.filter(o => !right.includes(o.id))) assert.ok(state.diagnose(o.id), `${state.id}: option ${o.id} has its own note`)
    assert.ok(checkAnswer(interaction, right.join(',')), `${state.id}: ticking just those is right`)
  } else if (interaction.type === 'select') {
    const [p, q] = eqs.map(linear)
    assert.equal(interaction.options[0].label.startsWith('Yes'), near(p.m, q.m), `${state.id}: the answer says whether the gradients match`)
    for (const option of interaction.options.slice(1)) assert.ok(option.feedback, `${state.id}: "${option.label}" has its own note`)
  } else if (interaction.acceptanceRule === 'openInterval') {
    const { m, c } = linear(eqs[0])
    assert.ok(near(interaction.correctAnswer, m), `${state.id}: the gradient is ${m}`)
    assert.equal(state.answerPrefix, 'Gradient =', `${state.id}: "Gradient =" before the box`)
    assert.ok(state.diagnose(String(c)), `${state.id}: giving c for m is explained`)
    assert.ok(state.diagnose(String(-m)), `${state.id}: a lost sign is explained`)
  } else if (interaction.acceptanceRule === 'formula') {
    const given = linear(eqs[0]), p = pointOf(title), c = p.y - given.m * p.x
    assert.equal(state.answerPrefix, 'y =', `${state.id}: "y =" before the box`)
    const mx = Number.isInteger(given.m) ? `${given.m}x` : `${given.m * 2}/2x`
    for (const way of [`${mx}${c < 0 ? '' : '+'}${c}`, `y = ${mx}+${c}`.replace('+-', '-'), `${c}+${mx}`.replace('+-', '-')]) assert.ok(checkAnswer(interaction, way), `${state.id} accepts ${way}`)
    assert.ok(!checkAnswer(interaction, `${mx}+${given.c}`.replace('+-', '-')), `${state.id}: the first line is wrong`)
    assert.ok(state.diagnose(`${mx}+${given.c}`.replace('+-', '-')), `${state.id}: giving the first line is explained`)
    assert.ok(state.diagnose(`${c}x+${given.m}`), `${state.id}: m and c swapped is explained`)
  } else assert.fail(`${state.id}: an unchecked question`)
  checked++
}
assert.equal(checked, states.filter(state => state.interaction.type !== 'continue' && rungs.includes(state.microSkillId)).length, 'Every question is checked')

// ---------- Workings ----------
for (const state of states.filter(state => rungs.includes(state.microSkillId))) {
  const model = state.interaction.type === 'continue' ? state.visual : state.working
  if (model?.kind !== 'method-worked') continue
  const frames = model.examples[0].steps.map(step => step.frame.graph)
  for (const frame of frames) {
    assert.ok(frame.x[1] - frame.x[0] <= 9, `${state.id}: at most 9 squares across`)
    for (const m of frame.marks ?? []) assert.equal(m.family, m.axis === 'x' ? 1 : 0, `${state.id}: ${m.axis} highlighted in its colour`)
    for (const p of frame.points ?? []) assert.ok(p.x > frame.x[0] && p.x < frame.x[1] && p.y > frame.y[0] && p.y < frame.y[1], `${state.id}: ${p.x}, ${p.y} is inside the grid`)
  }
  const last = frames.at(-1)
  assert.ok(last.answer?.text, `${state.id}: ends on its answer`)
  assert.equal(frames.filter(frame => frame.answer).length, 1, `${state.id}: the answer is written once`)
  if (state.microSkillId === 'graphs-parallel-through') {
    const given = linear(equations(state.content.title)[0]), p = pointOf(state.content.title), c = p.y - given.m * p.x
    const drawn = last.lines.at(-1)
    assert.ok(drawn.answer && near((drawn.to.y - drawn.from.y) / (drawn.to.x - drawn.from.x), given.m) && near(drawn.from.y - given.m * drawn.from.x, c), `${state.id}: the new line, green, is parallel through the point`)
  }
}

// ---------- Hidden: only the Graphs shelf opens it ----------
for (const file of ['src/features/maths/courseRegistry.ts', 'src/App.tsx']) assert.ok(!/parallel-lines|tutorParallelLinesLesson|L104/.test(read(file)), `Parallel lines is not in ${file}`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!read(file).includes('parallel-lines/') && !/['"`]L104\b/.test(read(file)), `Parallel lines is not in ${file}`)
}
console.log(`Graphs lesson 4 (parallel lines): ${states.length} screens, ${checked} questions checked.`)

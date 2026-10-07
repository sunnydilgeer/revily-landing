// Checks graphs lesson 3 (Gradient, from GR1): three rungs, each opening with a play screen on the graph board; the
// workings across first, then up (amber, then biro blue), ending "up over across"; every gradient worked out again
// from the question's own points; tilt questions reachable on their board; slips explained; and the lesson hidden:
// only the noindexed Graphs shelf page opens it.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorGradientLesson: lesson, GRADIENT_PREVIEW_ID: previewId } = require('../src/features/gradient/tutor/gradientLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

const num = s => Number(s.replace('−', '-'))
const pairs = text => [...text.matchAll(/\((−?\d+),\s(−?\d+)\)/g)].map(m => ({ x: num(m[1]), y: num(m[2]) }))

// ---------- Structure ----------
const states = lesson.states
const rungs = ['graphs-gradient-graph', 'graphs-gradient-sign', 'graphs-gradient-points']
assert.equal(lesson.id, 'L103', 'Hidden graphs lessons are numbered from 101')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Three rungs, easiest first, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L103-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})
for (const rung of rungs) {
  const own = states.filter(state => state.microSkillId === rung)
  assert.ok(own[0].interaction.type === 'continue' && own[0].board?.mode === 'tilt', `${rung} opens with a tilt play screen`)
  assert.ok(own[1].interaction.type === 'continue' && own[1].visual.kind === 'method-worked', `${rung}: then its worked example`)
  assert.ok(own.filter(state => state.interaction.type !== 'continue').length >= 5, `${rung} has at least five questions`)
}
assert.equal(states.filter(state => state.interaction.type === 'select').length, 1, 'Multiple choice only for the one concept check')
for (const mode of ['tilt', 'walk']) assert.ok(states.filter(state => state.board?.mode === mode && state.interaction.type !== 'continue').length >= 2, `Questions on the board's ${mode} mode`)

// ---------- Workings: across first, then up, up over across ----------
let checked = 0
for (const state of states) {
  const model = state.interaction.type === 'continue' ? state.visual : state.working
  if (model?.kind !== 'method-worked') continue
  const steps = model.examples[0].steps
  assert.deepEqual(steps.map(step => step.title.split(' ')[0]), ['Two', 'Across', 'Then', 'Up'], `${state.id}: two points, across, then up or down, then up over across`)
  const frames = steps.map(step => step.frame.graph)
  for (const frame of frames) assert.ok(frame.x[1] - frame.x[0] <= 9, `${state.id}: at most 9 squares across`)
  const [across, up] = [frames[1].legs.at(-1), frames[2].legs.at(-1)]
  assert.ok(across.from.y === across.to.y && across.family === 1, `${state.id}: across first, amber`)
  assert.ok(up.from.x === up.to.x && up.family === 0 && up.from.x === across.to.x, `${state.id}: then up or down from there, biro blue`)
  for (const m of frames.flatMap(frame => frame.marks ?? [])) assert.equal(m.family, m.axis === 'x' ? 1 : 0, `${state.id}: ${m.axis} highlighted in its colour`)
  const a = across.from, b = up.to, value = (b.y - a.y) / (b.x - a.x)
  const answer = frames[3].answer.text
  assert.match(answer, /^Gradient = (−?\d+) ÷ (−?\d+) = /, `${state.id}: the answer is up ÷ across`)
  const [, u, c] = /^Gradient = (−?\d+) ÷ (−?\d+)/.exec(answer)
  assert.ok(Math.abs(num(u) / num(c) - value) < 1e-9 && num(u) === b.y - a.y, `${state.id}: up over across = ${value}`)
  // The question's own points or line give the same gradient.
  const named = pairs(state.content.title)
  const own = named.length >= 2 ? named.slice(0, 2) : null
  if (own) assert.equal((own[1].y - own[0].y) / (own[1].x - own[0].x), value, `${state.id}: the gradient of the points in the question`)
  const { interaction } = state
  if (interaction.type === 'numericInput' && interaction.acceptanceRule === 'openInterval') {
    assert.ok(Math.abs(interaction.correctAnswer - value) < 1e-9, `${state.id}: the answer is ${value}`)
    for (const way of [String(value), `${b.y - a.y}/${b.x - a.x}`, String(value).replace('-', '−')]) assert.ok(checkAnswer(interaction, way), `${state.id} accepts ${way}`)
    if (state.board?.mode === 'tilt') {
      const { grid, ends, target } = state.board
      assert.equal(target, value, `${state.id}: the board's target is the answer`)
      assert.ok((ends[1].y - ends[0].y) / (ends[1].x - ends[0].x) !== target, `${state.id}: the line doesn't start at the answer`)
      assert.ok(a.x > grid.x[0] && b.x < grid.x[1] && Math.min(a.y, b.y) > grid.y[0] && Math.max(a.y, b.y) < grid.y[1], `${state.id}: the example line fits the board`)
    } else {
      assert.equal(state.answerPrefix, 'Gradient =', `${state.id}: "Gradient =" before the box`)
      if (value !== 1 && value !== -1) assert.ok(state.diagnose(String(1 / value)), `${state.id}: across ÷ up is explained`)
      assert.ok(state.diagnose(String(-value)), `${state.id}: a lost sign is explained`)
    }
    checked++
  }
  if (interaction.type === 'numericInput' && state.board?.mode === 'walk') {
    assert.equal(interaction.correctAnswer, `${b.x}, ${b.y}`, `${state.id}: the walk ends at the second point`)
    assert.deepEqual(state.board.start, a, `${state.id}: the walk starts at the first point`)
    checked++
  }
  if (interaction.type === 'select') { assert.match(interaction.options[0].label, /across ÷ up/); checked++ }
}
assert.ok(checked === states.filter(state => state.interaction.type !== 'continue').length, `Every question's answer is worked out again (${checked})`)
for (const state of states.filter(state => state.board?.mode === 'tilt' && state.interaction.type === 'continue')) {
  const [a, b] = state.board.ends, { grid } = state.board
  for (const p of [a, b]) assert.ok(p.x > grid.x[0] && p.x < grid.x[1] && p.y > grid.y[0] && p.y < grid.y[1], `${state.id}: the line's ends are on the board`)
}

// ---------- Hidden: only the preview page opens it ----------
for (const file of ['src/features/maths/courseRegistry.ts', 'src/App.tsx']) assert.ok(!/features\/gradient\/|GradientPreview|tutorGradientLesson|L103/.test(read(file)), `Gradient is not in ${file}`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!read(file).includes('features/gradient') && !read(file).includes('L103'), `Gradient is not in ${file}`)
}
assert.ok(states.find(state => state.visual.kind === 'method-worked').video, 'The first worked example carries the GR1.2 video')
for (const file of [`public/media/${previewId}/gradient.mp4`, `public/media/${previewId}/gradient.svg`]) assert.ok(fs.existsSync(path.join(root, file)), `${file} exists`)
assert.match(read(`app/preview/${require('../src/features/graphs/graphsLessons.ts').GRAPHS_SHELF_ID}/page.tsx`), /robots: \{ index: false, follow: false \}/, 'The preview page is noindexed')
console.log(`Gradient: ${states.length} screens, ${checked} answers worked out again, hidden on the Graphs shelf`)

// ---------- The Graphs shelf: only its own page imports it ----------
{
  const walk = dir => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(d => d.isDirectory() ? walk(`${dir}/${d.name}`) : [`${dir}/${d.name}`])
  const { GRAPHS_SHELF_ID } = require('../src/features/graphs/graphsLessons.ts')
  const allowed = new Set([`app/preview/${GRAPHS_SHELF_ID}/page.tsx`, 'src/features/graphs/GraphsShelf.tsx', 'src/features/graphs/graphsLessons.ts'])
  for (const file of [...walk('src'), ...walk('app')].filter(f => /\.tsx?$/.test(f) && !allowed.has(f)))
    assert.ok(!/features\/graphs\/|graphsShelf|GraphsShelf|GRAPHS_SHELF_ID/.test(read(file)) && !read(file).includes(GRAPHS_SHELF_ID), `${file} doesn't point at the hidden Graphs shelf`)
  console.log(`Graphs shelf: only /preview/${GRAPHS_SHELF_ID} opens it`)
}

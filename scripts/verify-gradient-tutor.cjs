// Checks graphs lesson 3 (Gradient and y = mx + c, from GR1 and GR2). The gradient: three rungs, each opening with a play screen on the graph board; the
// workings across first, then up (amber, then biro blue), ending "up over across"; every gradient worked out again
// from the question's own points; tilt questions reachable on their board; slips explained; and the lesson hidden:
// only the noindexed Graphs shelf page opens it. Then y = mx + c: from a graph, from two points and by rearranging,
// every equation worked out again from the question's own line, points or equation, typed answers accepted in any
// form, and the usual slips (m and c swapped, a lost sign) explained.
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
const lineRungs = ['graphs-equation-graph', 'graphs-equation-points', 'graphs-equation-rearrange']
assert.equal(lesson.id, 'L103', 'Hidden graphs lessons are numbered from 101')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, ...lineRungs, 'mixed'], 'Six rungs, easiest first, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L103-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})
for (const rung of rungs) {
  const own = states.filter(state => state.microSkillId === rung)
  assert.ok(own[0].interaction.type === 'continue' && own[0].board?.mode === 'tilt', `${rung} opens with a tilt play screen`)
  assert.ok(own[1].interaction.type === 'continue' && own[1].visual.kind === 'method-worked', `${rung}: then its worked example`)
  assert.ok(own.filter(state => state.interaction.type !== 'continue').length >= 4, `${rung} has at least four questions`)
}
for (const rung of lineRungs) {
  const own = states.filter(state => state.microSkillId === rung)
  assert.ok(own.some(state => state.interaction.type === 'continue' && state.visual.kind === 'method-worked'), `${rung} has its worked example`)
  assert.ok(own.filter(state => state.interaction.type !== 'continue').length >= 3, `${rung} has at least three questions`)
}
assert.ok(states.find(state => state.microSkillId === lineRungs[0]).board?.mode === 'equation', 'y = mx + c opens with the m-and-c play screen')
assert.equal(states.filter(state => state.interaction.type === 'select').length, 1, 'Multiple choice only for the one concept check')
for (const mode of ['tilt', 'walk']) assert.ok(states.filter(state => state.board?.mode === mode && state.interaction.type !== 'continue').length >= 2, `Questions on the board's ${mode} mode`)

// ---------- Workings: across first, then up, up over across ----------
let checked = 0
for (const state of states.filter(state => rungs.includes(state.microSkillId))) {
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

// ---------- y = mx + c: every equation worked out again ----------
const lineText = (m, c) => {
  const [n, d] = (() => { for (let d = 1; d <= 12; d++) if (Math.abs(Math.round(m * d) - m * d) < 1e-9) return [Math.round(m * d), d] })()
  const vulgar = { '1/2': '½', '1/3': '⅓', '2/3': '⅔', '1/4': '¼', '3/4': '¾', '1/5': '⅕' }
  const mText = d === 1 ? String(n).replace('-', '−') : `${n < 0 ? '−' : ''}${vulgar[`${Math.abs(n)}/${d}`] ?? `${Math.abs(n)}/${d}`}`
  const mx = n === 0 ? '' : d === 1 && Math.abs(n) === 1 ? (n < 0 ? '−x' : 'x') : `${mText}x`
  return `y = ${mx}${c === 0 ? '' : c < 0 ? ` − ${-c}` : ` + ${c}`}`
}
/** The line a question is about, worked out from the question alone: its drawn line, its two points or its equation. */
function lineOf(state) {
  const title = state.content.title.replace(/−/g, '-')
  const named = pairs(state.content.title)
  if (named.length === 2) { const [a, b] = named, m = (b.y - a.y) / (b.x - a.x); return { m, c: a.y - m * a.x } }
  let match = /y = (-?\d*)x ([+-]) (\d+)\.$/.exec(title)
  if (match) return { m: match[1] === '' ? 1 : match[1] === '-' ? -1 : Number(match[1]), c: Number(match[2] + match[3]) }
  if ((match = /y = (\d+) - (\d*)x\.$/.exec(title))) return { m: -(Number(match[2]) || 1), c: Number(match[1]) }
  // ax + by = k, in either order: 2x + y = 7, 4y - 8x = 12.
  if ((match = /(-?\d*)([xy]) ([+-]) (\d*)([xy]) = (-?\d+)/.exec(title))) {
    const coef = { [match[2]]: match[1] === '' ? 1 : match[1] === '-' ? -1 : Number(match[1]), [match[5]]: Number(match[3] + (match[4] || '1')) }
    return { m: -coef.x / coef.y, c: Number(match[6]) / coef.y }
  }
  const line = (state.visual.diagram?.frame ?? {}).lines?.[0]
  if (line) { const m = (line.to.y - line.from.y) / (line.to.x - line.from.x); return { m, c: line.from.y - m * line.from.x } }
  return null
}
for (const state of states.filter(state => lineRungs.includes(state.microSkillId))) {
  const model = state.interaction.type === 'continue' ? state.visual : state.working
  if (model?.kind !== 'method-worked') continue
  const frames = model.examples[0].steps.map(step => step.frame.graph)
  for (const frame of frames) {
    assert.ok(frame.x[1] - frame.x[0] <= 9, `${state.id}: at most 9 squares across`)
    for (const m of frame.marks ?? []) assert.equal(m.family, m.axis === 'x' ? 1 : 0, `${state.id}: ${m.axis} highlighted in its colour`)
  }
  const last = frames.at(-1)
  const drawn = last.lines.at(-1), m = (drawn.to.y - drawn.from.y) / (drawn.to.x - drawn.from.x), c = drawn.from.y - m * drawn.from.x
  assert.ok(drawn.answer, `${state.id}: the line ends green`)
  assert.ok(last.marks.some(mark => mark.axis === 'y' && mark.value === c), `${state.id}: c lit on the y axis`)
  const own = state.interaction.type === 'continue' && !/through|of /.test(state.content.title) ? null : lineOf(state)
  if (own) assert.ok(Math.abs(own.m - m) < 1e-9 && Math.abs(own.c - c) < 1e-9, `${state.id}: the working's line is the question's (m ${own.m}, c ${own.c})`)
  if (/^y = /.test(last.answer.text)) assert.equal(last.answer.text, lineText(m, c), `${state.id}: the answer is ${lineText(m, c)}`)
  else assert.match(last.answer.text.replace(/−/g, '-'), new RegExp(`^(Gradient = ${m}|m = .*, c = ${c})$`), `${state.id}: m and c read off`)
  const { interaction } = state
  if (interaction.type === 'continue') continue
  if (interaction.acceptanceRule === 'formula') {
    assert.equal(state.answerPrefix, 'y =', `${state.id}: "y =" before the box`)
    const [n, d] = (() => { for (let d = 1; d <= 12; d++) if (Math.abs(Math.round(m * d) - m * d) < 1e-9) return [Math.round(m * d), d] })()
    const mx = d === 1 ? `${n}x` : `${n}/${d}x`
    for (const way of [`${mx}${c < 0 ? '' : '+'}${c}`, `${mx} ${c < 0 ? '−' : '+'} ${Math.abs(c)}`.replace('-', '−'), `y = ${mx}+${c}`.replace('+-', '-'), `${c}+${mx}`.replace('+-', '-')])
      assert.ok(checkAnswer(interaction, way), `${state.id} accepts ${way}`)
    assert.ok(!checkAnswer(interaction, `${c}x+${m}`), `${state.id}: m and c swapped is wrong`)
    assert.ok(state.diagnose(`${c}x+${m}`), `${state.id}: m and c swapped is explained`)
    assert.ok(state.diagnose(`${mx}${-c < 0 ? '' : '+'}${-c}`), `${state.id}: c's lost sign is explained`)
  } else if (interaction.acceptanceRule === 'openInterval') {
    assert.equal(interaction.correctAnswer, m, `${state.id}: the gradient is ${m}`)
    assert.ok(state.diagnose(String(c)), `${state.id}: giving c for m is explained`)
  } else if (state.board?.mode === 'equation') {
    assert.equal(interaction.correctAnswer, `${m}, ${c}`, `${state.id}: the board's answer is m, c`)
    assert.deepEqual(state.board.equation, { m, c }, `${state.id}: the board's target is the line`)
    assert.ok(checkAnswer(interaction, `${m}, ${c}`) && !checkAnswer(interaction, `${state.board.rule.m}, ${state.board.rule.c}`), `${state.id}: the board doesn't start at the answer`)
    assert.ok(c > state.board.grid.y[0] && c < state.board.grid.y[1], `${state.id}: c is on the board`)
  } else if (state.board?.mode === 'plot') {
    assert.equal(interaction.correctAnswer, `0, ${c}`, `${state.id}: the line crosses the y axis at (0, ${c})`)
  } else assert.fail(`${state.id}: an unchecked question`)
  checked++
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
assert.ok(states.find(state => state.microSkillId === lineRungs[0] && state.visual.kind === 'method-worked').video, 'The first y = mx + c worked example carries the GR2.1 video')
for (const file of [`public/media/${previewId}/gradient.mp4`, `public/media/${previewId}/gradient.svg`, `public/media/${previewId}/equation.mp4`, `public/media/${previewId}/equation.svg`]) assert.ok(fs.existsSync(path.join(root, file)), `${file} exists`)
assert.match(read(`app/preview/${require('../src/features/graphs/graphsLessons.ts').GRAPHS_SHELF_ID}/page.tsx`), /robots: \{ index: false, follow: false \}/, 'The preview page is noindexed')
console.log(`Gradient and y = mx + c: ${states.length} screens, ${checked} answers worked out again, hidden on the Graphs shelf`)

// ---------- The Graphs shelf: only its own page imports it ----------
{
  const walk = dir => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(d => d.isDirectory() ? walk(`${dir}/${d.name}`) : [`${dir}/${d.name}`])
  const { GRAPHS_SHELF_ID } = require('../src/features/graphs/graphsLessons.ts')
  const allowed = new Set([`app/preview/${GRAPHS_SHELF_ID}/page.tsx`, 'src/features/graphs/GraphsShelf.tsx', 'src/features/graphs/graphsLessons.ts'])
  for (const file of [...walk('src'), ...walk('app')].filter(f => /\.tsx?$/.test(f) && !allowed.has(f)))
    assert.ok(!/features\/graphs\/|graphsShelf|GraphsShelf|GRAPHS_SHELF_ID/.test(read(file)) && !read(file).includes(GRAPHS_SHELF_ID), `${file} doesn't point at the hidden Graphs shelf`)
  console.log(`Graphs shelf: only /preview/${GRAPHS_SHELF_ID} opens it`)
}

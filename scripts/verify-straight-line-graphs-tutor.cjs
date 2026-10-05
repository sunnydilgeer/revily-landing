// Checks Lesson 26 (Graphs GR1, Straight line graphs): structure and rungs, every grid drawn to its own numbers (a
// labelled line is the line its label says, every point plotted on the lines it should be on), every gradient worked
// out again from the points its working reads, slips rejected and explained, one move a step with the answer once at
// the end, the video and its poster, and that the lesson stays hidden: only its noindexed preview page opens it.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorStraightLineGraphsLesson: lesson, GR1_PREVIEW_ID: previewId } = require('../src/features/straight-line-graphs/tutor/straightLineGraphsLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

// ---------- Structure ----------
const states = lesson.states
const rungs = ['graphs-horizontal-vertical', 'graphs-gradient-graph', 'graphs-gradient-points']
assert.equal(lesson.id, 'L026', 'GR1 keeps the progress key L026')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Three rungs, easiest first, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L26-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})
for (const rung of rungs) {
  const own = states.filter(state => state.microSkillId === rung)
  assert.equal(own[0].interaction.type, 'continue', `${rung} opens with its worked example`)
  assert.ok(own.filter(state => state.interaction.type !== 'continue').length >= 4, `${rung} has at least four questions`)
}
assert.ok(states.find(state => state.microSkillId === 'graphs-gradient-graph').video, 'The gradient worked example carries the GR1.1 video')

// ---------- Every grid, drawn to its own numbers ----------
const label = n => String(n).replace('-', '−')
const onLine = (line, p) => (line.to.x - line.from.x) * (p.y - line.from.y) === (line.to.y - line.from.y) * (p.x - line.from.x)
const inside = (frame, p) => p.x >= frame.x[0] && p.x <= frame.x[1] && p.y >= frame.y[0] && p.y <= frame.y[1]
function checkGrid(frame, where) {
  // One unit is one square of the page's grid (32px), so a grid fits a phone: at most 9 squares across.
  assert.ok(frame.x[1] - frame.x[0] <= 9, `${where}: the grid is at most 9 squares across`)
  // The axis numbers sit inside the grid, so there is a square left of the y axis and below the x axis.
  assert.ok(frame.x[0] <= -1 && frame.x[1] >= 1 && frame.y[0] <= -1 && frame.y[1] >= 1, `${where}: both axes, with their numbers, are inside the grid`)
  for (const mark of frame.marks ?? []) assert.ok(mark.value >= frame[mark.axis][0] && mark.value < frame[mark.axis][1], `${where}: the marked ${mark.axis} = ${mark.value} is numbered on its axis`)
  for (const line of frame.lines ?? []) {
    if (!line.label) continue
    const [letter, value] = line.label.replace('−', '-').split(' = ')
    const k = Number(value)
    if (letter === 'y') assert.ok(line.from.y === k && line.to.y === k, `${where}: ${line.label} is drawn across at y = ${k}`)
    else assert.ok(line.from.x === k && line.to.x === k, `${where}: ${line.label} is drawn up and down at x = ${k}`)
    assert.ok(letter === 'y' ? k >= frame.y[0] && k <= frame.y[1] : k >= frame.x[0] && k <= frame.x[1], `${where}: ${line.label} is on the grid`)
  }
  for (const point of frame.points ?? []) assert.ok(inside(frame, point), `${where}: (${point.x}, ${point.y}) is on the grid`)
  for (const leg of frame.legs ?? []) {
    assert.ok(leg.from.x === leg.to.x || leg.from.y === leg.to.y, `${where}: a step is straight across or straight up`)
    const size = leg.from.y === leg.to.y ? leg.to.x - leg.from.x : leg.to.y - leg.from.y
    assert.equal(leg.label, label(size), `${where}: the step is labelled ${label(size)}`)
    assert.equal(leg.family, leg.from.y === leg.to.y ? 1 : 0, `${where}: across is amber, up or down is biro blue`)
  }
}
let grids = 0, gradients = 0
for (const state of states) {
  const model = state.interaction.type === 'continue' ? state.visual : state.working
  if (model?.kind !== 'method-worked') continue
  const steps = model.examples[0].steps
  const last = steps.at(-1).frame.graph
  checkGrid(last, state.id)
  if (state.visual.kind === 'diagram') {
    assert.equal(state.visual.diagram.kind, 'graph', `${state.id}: the question shows its own grid`)
    const given = state.visual.diagram.frame
    assert.deepEqual(last.lines.filter(line => line.at < 0).map(({ answer, ...line }) => line), given.lines, `${state.id}: the question and its working draw the same lines`)
    assert.deepEqual(last.points.filter(point => point.at < 0), given.points.filter(point => point.at < 0), `${state.id}: the question and its working plot the same points`)
  }
  grids++

  // Points the working reads on a given line are on that line.
  const givenLine = last.lines.find(line => line.at < 0 && !line.label)
  if (givenLine) for (const point of last.points.filter(p => p.at >= 0)) assert.ok(onLine(givenLine, point), `${state.id}: (${point.x}, ${point.y}) is on the line drawn`)

  // A gradient, worked out again from the two ends of its steps.
  if (last.legs?.length === 2) {
    gradients++
    const [up, along] = last.legs
    const rise = up.to.y - up.from.y, run = along.to.x - along.from.x
    assert.equal(up.from.x, up.to.x, `${state.id}: change in y first`)
    assert.ok(up.to.x === along.from.x && up.to.y === along.from.y, `${state.id}: the steps join up`)
    const a = up.from, b = along.to
    if (givenLine) assert.ok(onLine(givenLine, a) && onLine(givenLine, b), `${state.id}: both points are on the line`)
    else assert.ok(last.points.some(p => p.x === a.x && p.y === a.y) && last.points.some(p => p.x === b.x && p.y === b.y), `${state.id}: the steps go from one given point to the other`)
    const right = rise / run
    assert.ok(Math.abs(right - Number(state.interaction.correctAnswer ?? right)) < 1e-9 || state.interaction.type === 'select', `${state.id}: the answer is ${right}`)
    if (!givenLine && state.interaction.type !== 'select') {
      const words = state.content.title.match(/\((−?\d+), (−?\d+)\) and \((−?\d+), (−?\d+)\)/).slice(1).map(n => Number(n.replace('−', '-')))
      assert.equal((words[3] - words[1]) / (words[2] - words[0]), right, `${state.id}: the gradient from the question's own numbers`)
    }
    assert.match(last.answer.text, new RegExp(`= ${label(rise)} ÷ ${run < 0 ? `\\(${label(run)}\\)` : run} = `), `${state.id}: the answer divides the change in y by the change in x`)
  }

  // Typed answers: other ways of writing it are accepted; slips are rejected and explained.
  if (state.interaction.type === 'numericInput') {
    const answer = Number(state.interaction.correctAnswer)
    const ways = [String(answer), String(answer).replace('-', '−')]
    if (!Number.isInteger(answer)) ways.push(answer === 0.5 ? '1/2' : '', answer === 0.5 ? '2/4' : '')
    for (const way of ways.filter(Boolean)) assert.ok(checkAnswer(state.interaction, way), `${state.id} accepts ${way}`)
    for (const wrong of [-answer, answer + 1, 1 / answer]) if (wrong !== answer) assert.ok(!checkAnswer(state.interaction, String(wrong)), `${state.id} rejects ${wrong}`)
    assert.ok(state.interaction.signed, `${state.id}: the full keyboard, for − and /`)
    assert.ok(state.diagnose, `${state.id} explains its slips`)
    if (last.legs?.length === 2) assert.ok(state.diagnose(String(-answer)) || state.diagnose(String(1 / answer)), `${state.id}: a sign or upside-down slip gets its own message`)
  } else if (state.interaction.type === 'select') {
    const options = state.interaction.options
    assert.equal(options.length, 4, `${state.id}: four choices`)
    assert.ok(options.slice(1).every(option => option.feedback), `${state.id}: every wrong choice says why`)
  }

  // One move a step: short headings, ⓘ in words with no "=", the answer once, in the last step, nothing green before.
  steps.forEach((step, i) => {
    assert.ok(step.title.split(' ').length <= 5, `${state.id} step ${i + 1}: heading "${step.title}" is short`)
    assert.ok(step.instruction && !step.instruction.includes('='), `${state.id} step ${i + 1}: ⓘ is words, not a sum`)
    const own = step.frame.graph
    checkGrid(own, `${state.id} step ${i + 1}`)
    // A step that puts down dots, a line across or up and down, or a step between points highlights the axis numbers it uses.
    const before = i ? steps[i - 1].frame.graph : { points: [], lines: [], legs: [] }
    const added = (own.points ?? []).length > (before.points ?? []).filter(p => p.at >= 0).length + (own.points ?? []).filter(p => p.at < 0).length
      || (own.lines ?? []).some(line => line.at === i && (line.from.x === line.to.x || line.from.y === line.to.y))
      || (own.legs ?? []).some(leg => leg.at === i)
    if (added) assert.ok(own.marks?.length, `${state.id} step ${i + 1}: highlights the axis numbers it uses`)
    for (const leg of (own.legs ?? []).filter(leg => leg.at === i)) {
      const axis = leg.from.y === leg.to.y ? 'x' : 'y'
      for (const end of [leg.from, leg.to]) assert.ok(own.marks.some(m => m.axis === axis && m.value === end[axis]), `${state.id} step ${i + 1}: ${axis} = ${end[axis]} is highlighted`)
    }
    assert.equal(Boolean(own.answer && own.answer.at === i), i === steps.length - 1, `${state.id} step ${i + 1}: the answer comes once, at the end`)
    if (i < steps.length - 1) assert.ok(!(own.lines ?? []).some(line => line.answer), `${state.id}: nothing green before the answer`)
  })
}
assert.ok(grids >= 17 && gradients >= 9, `Every worked example and question has a grid (${grids}) and the gradients are worked out (${gradients})`)

// ---------- Hidden: only the preview page opens it ----------
const registry = read('src/features/maths/courseRegistry.ts'), app = read('src/App.tsx')
for (const [file, text] of [['courseRegistry.ts', registry], ['App.tsx', app]]) assert.ok(!/straight-line-graphs|StraightLineGraphs/.test(text), `GR1 is not in ${file}, so no list shows it`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!read(file).includes('straight-line-graphs') && !read(file).includes('L026'), `GR1 is not in ${file}`)
}
const page = read(`app/preview/${previewId}/page.tsx`)
assert.match(page, /robots: \{ index: false, follow: false \}/, 'The preview page is noindexed')
assert.match(read('middleware.ts'), /'\/preview\/:path\*'/, 'The preview password covers the page')
for (const file of [`public/media/${previewId}/straight-line-graphs.mp4`, `public/media/${previewId}/straight-line-graphs.svg`]) assert.ok(fs.existsSync(path.join(root, file)), `${file} exists`)

console.log(`Lesson 26 (GR1 Straight line graphs) verified: ${states.length} screens in 3 rungs, ${grids} grids drawn to their own numbers, ${gradients} gradients worked out again, slips explained, one move a step, the video, and hidden behind /preview/${previewId}.`)

// Checks graphs lesson 2 (Lines from coordinates, from GR1 and GR4): three rungs, each opening with a play screen on
// the graph board; every answer worked out again from the question's own rule or line; every line answer accepted
// through any two of its points; grids at most 9 squares across with both axes inside; tables x amber and y blue; and
// that the lesson stays hidden: only the noindexed Graphs shelf page opens it.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorLinesLesson: lesson, LINES_PREVIEW_ID: previewId } = require('../src/features/lines/tutor/linesLesson.ts')
const { lineKey } = require('../src/features/written-methods/tutor/LineBoard.tsx')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

const num = s => Number(s.replace('−', '-'))
/** "y = 2x − 1", "y = 4 − x", "y = ½x + 1" as a function of x, read from the words themselves. */
function ruleOf(text) {
  const body = /y = ([\dx½ +−-]+)/.exec(text)[1].trim().replace(/−/g, '-').replace(/½/g, '0.5*').replace(/(\d)x/g, '$1*x').replace(/\*\*/g, '*')
  return x => Function('x', `return ${body}`)(x)
}

// ---------- Structure ----------
const states = lesson.states
const rungs = ['graphs-straight-lines', 'graphs-table-of-values', 'graphs-plot-and-join']
assert.equal(lesson.id, 'L102', 'Hidden graphs lessons are numbered from 101')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Three rungs, easiest first, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L102-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})
for (const rung of rungs) {
  const own = states.filter(state => state.microSkillId === rung)
  assert.ok(own[0].interaction.type === 'continue' && own[0].board, `${rung} opens with a play screen on the graph board`)
  assert.ok(own[1].interaction.type === 'continue' && own[1].visual.kind === 'method-worked', `${rung}: then its worked example`)
  assert.ok(own.filter(state => state.interaction.type !== 'continue').length >= 5, `${rung} has at least five questions`)
}
assert.equal(states.filter(state => state.interaction.type === 'select').length, 0, 'No multiple choice (Sunny, 7 Oct)')
for (const mode of ['rule', 'line', 'drag', 'plot']) assert.ok(states.some(state => state.board?.mode === mode), `The board's ${mode} mode is used`)

// ---------- Grids and tables ----------
function checkGrid(frame, where) {
  assert.ok(frame.x[1] - frame.x[0] <= 9, `${where}: the grid is at most 9 squares across`)
  assert.ok(frame.x[0] <= -1 && frame.x[1] >= 1 && frame.y[0] <= -1 && frame.y[1] >= 1, `${where}: both axes are inside the grid`)
  for (const m of frame.marks ?? []) {
    assert.ok(m.value > frame[m.axis][0] && m.value < frame[m.axis][1], `${where}: the marked ${m.axis} = ${m.value} is numbered`)
    assert.equal(m.family, m.axis === 'x' ? 1 : 0, `${where}: ${m.axis} is highlighted in its colour`)
  }
  for (const p of frame.points ?? []) assert.ok(p.x > frame.x[0] && p.x < frame.x[1] && p.y > frame.y[0] && p.y < frame.y[1], `${where}: (${p.x}, ${p.y}) is inside the grid`)
  if (frame.table) assert.equal(frame.table.xs.length, frame.table.ys.length, `${where}: every x has its y cell`)
}
for (const state of states.filter(state => state.board)) {
  checkGrid(state.board.grid, state.id)
  const { rule, start } = state.board
  if (rule) for (const x of state.board.grid.table?.xs ?? []) {
    const y = rule.m * x + rule.c
    assert.ok(y > state.board.grid.y[0] && y < state.board.grid.y[1], `${state.id}: every table x can be reached on the rule`)
  }
  if (rule && start) assert.equal(start.y, rule.m * start.x + rule.c, `${state.id}: the dot starts on the rule`)
}

// ---------- Questions and workings ----------
let checked = 0
for (const state of states) {
  const model = state.interaction.type === 'continue' ? state.visual : state.working
  if (model?.kind !== 'method-worked') continue
  const steps = model.examples[0].steps
  steps.forEach((step, i) => {
    checkGrid(step.frame.graph, `${state.id} step ${i + 1}`)
    assert.ok(step.title.split(' ').length <= 4, `${state.id} step ${i + 1}: heading "${step.title}" is short`)
    assert.equal(Boolean(step.frame.graph.answer?.at === i), i === steps.length - 1, `${state.id} step ${i + 1}: the answer comes once, at the end`)
  })
  const last = steps.at(-1).frame.graph
  // Every table the working fills in follows its rule.
  for (const step of steps) {
    const t = step.frame.graph.table
    if (!t) continue
    const f = ruleOf(/y = [\dx½ +−-]*x/.test(state.content.title) ? state.content.title : steps[0].operation.replace(/\\[a-z]+\{?|[{}]/g, ''))
    t.xs.forEach((x, i) => { if (t.ys[i] !== null) assert.equal(t.ys[i], f(x), `${state.id}: y at x = ${x} follows the rule`) })
  }
  if (state.interaction.type !== 'numericInput') continue
  const { interaction } = state
  const green = (last.lines ?? []).find(line => line.answer)
  if (interaction.correctAnswer.split(',').length === 3) {
    // A line: the green line in the working is the answer, and any two of its points draw it.
    assert.ok(green, `${state.id}: the working ends on the green line`)
    assert.equal(lineKey(green.from, green.to), interaction.correctAnswer, `${state.id}: the working's line is the answer`)
    const dx = green.to.x - green.from.x, dy = green.to.y - green.from.y
    const far = { x: green.from.x + 3 * dx, y: green.from.y + 3 * dy }
    assert.ok(checkAnswer(interaction, lineKey(far, green.to)), `${state.id}: any two points of the line are right`)
    assert.ok(!checkAnswer(interaction, lineKey(green.from, { x: green.to.x + 1, y: green.to.y + 2 })), `${state.id}: another line is wrong`)
    assert.ok(state.board?.mode === 'line' && lineKey(...state.board.line) === interaction.correctAnswer, `${state.id}: the board knows its right line`)
    if (/y = .*x/.test(state.content.title)) {
      const f = ruleOf(state.content.title)
      assert.equal(lineKey({ x: 0, y: f(0) }, { x: 1, y: f(1) }), interaction.correctAnswer, `${state.id}: the line is the title's rule`)
    }
    const across = /^Draw the line y = (−?\d+)/.exec(state.content.title), upDown = /^Draw the line x = (−?\d+)/.exec(state.content.title)
    if (across) assert.equal(interaction.correctAnswer, `0, 1, ${num(across[1])}`, `${state.id}: y = k goes across`)
    if (upDown) assert.equal(interaction.correctAnswer, `1, 0, ${num(upDown[1])}`, `${state.id}: x = k goes up and down`)
    const through = /through \((−?\d+), (−?\d+)\)/.exec(state.content.title)
    if (through) assert.equal(interaction.correctAnswer, /across/.test(state.content.title) ? `0, 1, ${num(through[2])}` : `1, 0, ${num(through[1])}`, `${state.id}: the line goes through the given point`)
    assert.ok(state.diagnose(lineKey(green.from, { x: green.to.x + 1, y: green.to.y + 2 })) !== undefined, `${state.id}: wrong lines are explained or plain`)
    checked++
  } else if (interaction.correctAnswer.split(',').length === 2) {
    // A point: on the rule's line where the question says.
    const [x, y] = interaction.correctAnswer.split(',').map(Number)
    const f = ruleOf(state.content.title)
    assert.equal(y, f(x), `${state.id}: (${x}, ${y}) is on the rule's line`)
    assert.ok(last.points.some(p => p.x === x && p.y === y), `${state.id}: the working ends on the point`)
    assert.ok(x > state.board.grid.x[0] && x < state.board.grid.x[1] && y > state.board.grid.y[0] && y < state.board.grid.y[1], `${state.id}: the point can be reached on the board`)
    checked++
  } else {
    // A number after "x =" or "y =".
    const n = Number(interaction.correctAnswer)
    const at = /when x = (−?\d+)/.exec(state.content.title)
    if (at) assert.equal(n, ruleOf(state.content.title)(num(at[1])), `${state.id}: y follows the rule`)
    else assert.equal(state.answerPrefix, 'x =', `${state.id}: an up and down line's equation`)
    assert.ok(state.answerPrefix, `${state.id}: "x =" or "y =" before the box`)
    assert.ok(last.answer.text.endsWith(String(n).replace('-', '−')), `${state.id}: the working ends at ${n}`)
    for (const way of [String(n), String(n).replace('-', '−')]) assert.ok(checkAnswer(interaction, way), `${state.id} accepts ${way}`)
    assert.ok(interaction.signed, `${state.id}: the full keyboard, for −`)
    checked++
  }
}
assert.ok(checked >= 16, `Every question's answer is worked out again (${checked})`)
// Slips the storyboard names get their own message.
const byTitle = t => states.find(state => state.content.title.startsWith(t))
assert.match(byTitle('Draw the line y = −2').diagnose('1, 0, -2'), /goes across/)
assert.match(byTitle('Draw the line across through').diagnose('0, 1, 6'), /y stays the same/)
assert.match(byTitle('y = 3x − 2').diagnose('1'), /negative/)
assert.match(byTitle('y = 4 − x').diagnose('-1'), /Start at 4/)

// ---------- Hidden: only the preview page opens it ----------
for (const file of ['src/features/maths/courseRegistry.ts', 'src/App.tsx']) assert.ok(!/features\/lines\/|LinesPreview|tutorLinesLesson|L102/.test(read(file)), `Lines is not in ${file}`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!read(file).includes('features/lines') && !read(file).includes('L102'), `Lines is not in ${file}`)
}
assert.ok(states.find(state => state.visual.kind === 'method-worked').video, 'The first worked example carries the GR4.1 video')
for (const file of [`public/media/${previewId}/lines.mp4`, `public/media/${previewId}/lines.svg`]) assert.ok(fs.existsSync(path.join(root, file)), `${file} exists`)
assert.match(read(`app/preview/${require('../src/features/graphs/graphsLessons.ts').GRAPHS_SHELF_ID}/page.tsx`), /robots: \{ index: false, follow: false \}/, 'The preview page is noindexed')
console.log(`Lines from coordinates: ${states.length} screens, ${checked} answers worked out again, hidden on the Graphs shelf`)

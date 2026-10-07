// Checks graphs lesson 1 (Coordinates, from GR3): structure and rungs, each rung opening with a play screen on the graph
// board, every answer worked out again from the question's own numbers, every board answer reachable on its board,
// every grid at most 9 squares across with both axes inside, the workings one move a step (across in amber, up in biro
// blue, the axis numbers they use highlighted), typed answers accepted however they are written and slips explained,
// and that the lesson stays hidden: only its noindexed preview page opens it.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorCoordinatesLesson: lesson, COORDINATES_PREVIEW_ID: previewId } = require('../src/features/coordinates/tutor/coordinatesLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

const num = s => Number(s.replace('−', '-'))
const pairs = text => [...text.matchAll(/\((−?[\d.]+),\s(−?[\d.]+)\)/g)].map(m => ({ x: num(m[1]), y: num(m[2]) }))
const show = p => `(${String(p.x).replace('-', '−')}, ${String(p.y).replace('-', '−')})`

// ---------- Structure ----------
const states = lesson.states
const rungs = ['graphs-coordinates', 'graphs-quadrants', 'graphs-midpoint']
assert.equal(lesson.id, 'L101', 'Graphs lessons are numbered from 101 while hidden, clear of Aniksha’s numbers')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Three rungs, easiest first, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L101-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})
for (const rung of rungs) {
  const own = states.filter(state => state.microSkillId === rung)
  assert.ok(own[0].interaction.type === 'continue' && own[0].board, `${rung} opens with a play screen on the graph board`)
  assert.ok(own[1].interaction.type === 'continue' && own[1].visual.kind === 'method-worked', `${rung}: then its worked example`)
  const questions = own.filter(state => state.interaction.type !== 'continue')
  assert.ok(questions.length >= 5, `${rung} has at least five questions`)
  assert.ok(questions.filter(state => state.board).length >= 2, `${rung}: hands-on, with board questions`)
}
const choices = states.filter(state => state.interaction.type === 'select')
assert.equal(choices.length, 1, 'Multiple choice only for the one concept check (Sunny, 7 Oct)')
for (const mode of ['walk', 'plot', 'drag', 'explore', 'midpoint']) assert.ok(states.some(state => state.board?.mode === mode), `The board's ${mode} mode is used`)

// ---------- Grids ----------
function checkGrid(frame, where) {
  assert.ok(frame.x[1] - frame.x[0] <= 9, `${where}: the grid is at most 9 squares across`)
  assert.ok(frame.x[0] <= -1 && frame.x[1] >= 1 && frame.y[0] <= -1 && frame.y[1] >= 1, `${where}: both axes, with their numbers, are inside the grid`)
  for (const mark of frame.marks ?? []) assert.ok(mark.value > frame[mark.axis][0] && mark.value < frame[mark.axis][1], `${where}: the marked ${mark.axis} = ${mark.value} is numbered on its axis`)
  for (const m of frame.marks ?? []) assert.equal(m.family, m.axis === 'x' ? 1 : 0, `${where}: ${m.axis} = ${m.value} is highlighted in the ${m.axis} colour`)
  for (const point of frame.points ?? []) assert.ok(point.x >= frame.x[0] && point.x <= frame.x[1] && point.y >= frame.y[0] && point.y <= frame.y[1], `${where}: (${point.x}, ${point.y}) is on the grid`)
  for (const leg of frame.legs ?? []) {
    assert.ok(leg.from.x === leg.to.x || leg.from.y === leg.to.y, `${where}: a step is straight across or straight up`)
    if (leg.dashed) continue
    const size = leg.from.y === leg.to.y ? leg.to.x - leg.from.x : leg.to.y - leg.from.y
    assert.equal(leg.label, String(size).replace('-', '−'), `${where}: the step is labelled with its size`)
  }
  // Across is amber and up or down biro blue; a dashed reading line is the colour of the axis it reads: down to the x axis amber.
  for (const leg of frame.legs ?? []) assert.equal(leg.family, (leg.from.y === leg.to.y) !== Boolean(leg.dashed) ? 1 : 0, `${where}: across is amber, up or down is biro blue`)
}
/** The dot can reach p: a corner inside the grid, off its edges (where the axes have no numbers). */
const reachable = (grid, p) => Number.isInteger(p.x) && Number.isInteger(p.y) && p.x > grid.x[0] && p.x < grid.x[1] && p.y > grid.y[0] && p.y < grid.y[1]

// ---------- Play screens ----------
for (const state of states.filter(state => state.interaction.type === 'continue' && state.board)) {
  const { board } = state
  checkGrid(board.grid, state.id)
  assert.ok(board.start && reachable(board.grid, board.start), `${state.id}: the dot starts on the board`)
  assert.ok(state.content.title.split('. ').length <= 2 && !state.content.body, `${state.id}: one short sentence to do, nothing else to read`)
  if (board.mode === 'midpoint') {
    const [a, b] = board.ends, m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    assert.ok(reachable(board.grid, m), `${state.id}: the midpoint is a corner the dot can reach`)
    assert.ok(board.start.x !== m.x || board.start.y !== m.y, `${state.id}: the dot doesn't start at the midpoint`)
  }
}

// ---------- Questions and workings ----------
let checked = 0
for (const state of states) {
  const model = state.interaction.type === 'continue' ? state.visual : state.working
  if (model?.kind !== 'method-worked') continue
  const steps = model.examples[0].steps
  const last = steps.at(-1).frame.graph
  checkGrid(last, state.id)
  const midpoint = state.microSkillId === 'graphs-midpoint'

  // The answer, from the question's own numbers: the point it names, or halfway between the two it names.
  const named = pairs(state.content.title)
  const given = midpoint && named.length < 2 ? (state.board?.grid ?? last).points.filter(p => p.at < 0) : midpoint ? named.slice(0, 2) : named
  let right
  if (midpoint) {
    assert.equal(given.length, 2, `${state.id}: a midpoint question gives two points`)
    right = { x: (given[0].x + given[1].x) / 2, y: (given[0].y + given[1].y) / 2 }
  } else if (named.length === 1) right = named[0]
  else right = last.points.find(p => p.at < 0) // Read the dot: the dot on the question's grid.
  assert.ok(right, `${state.id}: the answer can be worked out`)
  assert.equal(last.answer.text, show(right), `${state.id}: the working ends at ${show(right)}`)
  assert.ok(last.points.some(p => p.x === right.x && p.y === right.y), `${state.id}: the answer is on the grid`)
  if (state.interaction.type === 'numericInput') {
    assert.equal(state.interaction.correctAnswer, `${right.x}, ${right.y}`, `${state.id}: the answer is ${show(right)}`)
    checked++
  }
  if (state.interaction.type === 'select') assert.match(state.interaction.options[0].label, new RegExp(show(right).replace(/[()]/g, '\\$&').replace(' ', '\\s')), `${state.id}: the right choice is ${show(right)}`)

  // Plotting walks across from 0, then up from there, to the point.
  if (!midpoint && state.microSkillId !== 'mixed' && steps[0].title === 'Read the brackets') {
    const legs = last.legs ?? []
    const along = legs.find(leg => leg.from.y === 0 && leg.to.y === 0), up = legs.find(leg => leg.from.x === leg.to.x)
    if (right.x !== 0) assert.ok(along && along.from.x === 0 && along.to.x === right.x, `${state.id}: across ${right.x} from 0`)
    if (right.y !== 0) assert.ok(up && up.from.y === 0 && up.to.x === right.x && up.to.y === right.y, `${state.id}: then up ${right.y}`)
  }
  // Midpoint: halfway across, then halfway up, each worked out in its own colour.
  if (midpoint) {
    const [a, b] = given
    assert.match(last.working[0].text, new RegExp(`= ${String(right.x).replace('-', '−')}$`), `${state.id}: halfway across is ${right.x}`)
    assert.match(last.working[1].text, new RegExp(`= ${String(right.y).replace('-', '−')}$`), `${state.id}: halfway up is ${right.y}`)
    assert.deepEqual(last.working.map(line => line.family), [1, 0], `${state.id}: x working amber, y working blue`)
    assert.ok(last.lines.some(line => line.segment && ((line.from.x === a.x && line.to.x === b.x) || (line.from.x === b.x && line.to.x === a.x))), `${state.id}: the line between the two points is drawn`)
  }

  // Board questions: the right point is reachable, and the board's grid is the working's.
  if (state.board && state.interaction.type !== 'continue') {
    assert.ok(reachable(state.board.grid, right), `${state.id}: ${show(right)} can be reached on the board`)
    assert.deepEqual(state.board.grid.x, last.x, `${state.id}: the board and the working use the same grid`)
    assert.deepEqual(state.board.grid.y, last.y, `${state.id}: the board and the working use the same grid`)
    if (state.board.start) assert.ok(reachable(state.board.grid, state.board.start) && (state.board.start.x !== right.x || state.board.start.y !== right.y), `${state.id}: the dot starts on the board, not on the answer`)
  }

  // Answers: written any usual way is right; slips are wrong and explained.
  if (state.interaction.type === 'numericInput') {
    const minus = s => s.replace(/-/g, '−')
    for (const way of [`${right.x}, ${right.y}`, `${right.x},${right.y}`, `(${right.x}, ${right.y})`, minus(`${right.x}, ${right.y}`)]) assert.ok(checkAnswer(state.interaction, way), `${state.id} accepts ${way}`)
    assert.ok(state.interaction.signed, `${state.id}: the full keyboard, for −`)
    if (right.x !== right.y) {
      assert.ok(!checkAnswer(state.interaction, `${right.y}, ${right.x}`), `${state.id} rejects the numbers swapped`)
      assert.ok(state.diagnose(`${right.y}, ${right.x}`), `${state.id}: swapped gets its own message`)
    }
    if (right.x !== 0) assert.ok(state.diagnose(`${-right.x}, ${right.y}`), `${state.id}: a lost sign gets its own message`)
    if (midpoint) {
      const [a, b] = given
      assert.ok(/total/.test(state.diagnose(`${a.x + b.x}, ${a.y + b.y}`)), `${state.id}: not halved gets its own message`)
    }
  }

  // One move a step: short headings, ⓘ in words with no "=", the answer once, in the last step.
  steps.forEach((step, i) => {
    assert.ok(step.title.split(' ').length <= 4, `${state.id} step ${i + 1}: heading "${step.title}" is short`)
    assert.ok(step.instruction && !step.instruction.includes('='), `${state.id} step ${i + 1}: ⓘ is words, not a sum`)
    const own = step.frame.graph
    checkGrid(own, `${state.id} step ${i + 1}`)
    assert.ok(own.marks?.length, `${state.id} step ${i + 1}: highlights the axis numbers it uses`)
    for (const leg of (own.legs ?? []).filter(leg => leg.at === i && !leg.dashed)) {
      const axis = leg.from.y === leg.to.y ? 'x' : 'y'
      assert.ok(own.marks.some(m => m.axis === axis && m.value === leg.to[axis]), `${state.id} step ${i + 1}: where the step ends is highlighted`)
    }
    assert.equal(Boolean(own.answer && own.answer.at === i), i === steps.length - 1, `${state.id} step ${i + 1}: the answer comes once, at the end`)
  })
}
assert.ok(checked >= 15, `Every question's answer is worked out again (${checked})`)

// ---------- Hidden: only the preview page opens it ----------
const registry = read('src/features/maths/courseRegistry.ts'), app = read('src/App.tsx')
for (const [file, text] of [['courseRegistry.ts', registry], ['App.tsx', app]]) assert.ok(!/coordinates\/|Coordinates(Lesson|Preview)|L101/.test(text), `Coordinates is not in ${file}, so no list shows it`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!read(file).includes('features/coordinates') && !read(file).includes('L101'), `Coordinates is not in ${file}`)
}
assert.ok(states.find(state => state.microSkillId === 'graphs-coordinates' && state.visual.kind === 'method-worked').video, 'The first worked example carries the GR3.1 video')
for (const file of [`public/media/${previewId}/coordinates.mp4`, `public/media/${previewId}/coordinates.svg`]) assert.ok(fs.existsSync(path.join(root, file)), `${file} exists`)
const page = read(`app/preview/${previewId}/page.tsx`)
assert.match(page, /robots: \{ index: false, follow: false \}/, 'The preview page is noindexed')
assert.match(read('middleware.ts'), /'\/preview\/:path\*'/, 'The preview password covers the page')
console.log(`Coordinates: ${states.length} screens, ${checked} answers worked out again, hidden behind /preview/${previewId}`)

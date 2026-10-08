// Checks graphs lesson 7 (Distance–time graphs, GR8). Three rungs, easiest first, each with its worked example; every
// answer worked out again from the question itself: reading questions from the journey drawn on its graph (a distance
// at a time, what a part shows, the total distance, how long a stop is, a part's speed as distance ÷ time), and drawing
// questions from the story in their words, read by this file's own reader. Every journey fits on its graph, and the
// lesson is hidden.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorDistanceTimeLesson: lesson } = require('../src/features/distance-time/tutor/distanceTimeLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const { graphsLessons } = require('../src/features/graphs/graphsLessons.ts')

const near = (a, b) => Math.abs(a - b) < 1e-9
const hours = text => { const [h, m] = text.split(':').map(Number); return h + m / 60 }
const duration = (n, unit) => unit.startsWith('minute') ? Number(n) / 60 : Number(n)
/** A journey's parts from the graph's own lines, in time order. */
const partsOf = g => g.lines.filter(line => line.segment).map(line => [line.from, line.to]).sort((p, q) => p[0].x - q[0].x)
/** The corners a story in words gives, from home at its start time. */
function story(words) {
  const start = hours(/home at (\d\d:\d\d)/.exec(words)[1])
  let t = start, d = 0
  const out = []
  const clauses = words.split(/home at \d\d:\d\d\.\s*/)[1].replace(/ Draw (his|her) journey\.$/, '').split(/, then |, | then /)
  for (const clause of clauses) {
    let m
    if ((m = /(\d+) km in (\d+) (hours?|minutes)/.exec(clause))) { t += duration(m[2], m[3]); d += Number(m[1]) }
    else if ((m = /home at (\d+) km\/h/.exec(clause))) { t += d / Number(m[1]); d = 0 }
    else if ((m = /home in (\d+) (hours?|minutes)/.exec(clause))) { t += duration(m[1], m[2]); d = 0 }
    else if ((m = /at (\d+) km\/h for (\d+) (hours?|minutes)/.exec(clause))) { const h = duration(m[2], m[3]); t += h; d += Number(m[1]) * h }
    else if ((m = /stops for (\d+) (hours?|minutes)/.exec(clause))) t += duration(m[1], m[2])
    else if ((m = /stops until (\d\d:\d\d)/.exec(clause))) t = hours(m[1])
    else assert.fail(`"${clause}" is a part of a journey this file can read`)
    out.push({ x: t, y: d })
  }
  return { start: { x: start, y: 0 }, corners: out }
}

// ---------- Structure ----------
const states = lesson.states
const rungs = ['graphs-dt-read', 'graphs-dt-speed', 'graphs-dt-draw']
assert.equal(lesson.id, 'L107', 'Hidden graphs lessons are numbered from 101')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Three rungs, easiest first, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L107-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})
for (const rung of rungs) {
  const own = states.filter(state => state.microSkillId === rung)
  assert.ok(own.some(state => state.interaction.type === 'continue' && state.visual.kind === 'method-worked'), `${rung} has its worked example`)
  assert.ok(own.filter(state => state.interaction.type !== 'continue').length >= 3, `${rung} has at least three questions`)
}
assert.equal(states[0].board?.mode, 'journey', 'The lesson opens with a play screen: build a journey')
assert.ok(!states[0].board.journey, 'The play screen has no right answer')
assert.ok(states.some(state => state.video), 'The lesson has its video')
assert.ok(states.filter(state => state.board?.mode === 'journey' && state.interaction.type !== 'continue').length >= 3, 'At least three journeys drawn on the board')
assert.equal(states.filter(state => state.interaction.type === 'select').length, 1, 'Multiple choice only for the one concept check')
assert.ok(graphsLessons.some(entry => entry.number === 107 && entry.definition === lesson), 'Lesson 107 is on the Graphs shelf')

// ---------- Every answer worked out again ----------
let checked = 0
for (const state of states.filter(state => rungs.includes(state.microSkillId) && state.interaction.type !== 'continue')) {
  const title = state.content.title, { interaction } = state
  const g = state.board?.grid ?? state.visual.diagram.frame
  assert.ok(g.scale?.x.clock && g.scale.y.name === 'km', `${state.id}: time across, km up`)
  const right = value => assert.ok(checkAnswer(interaction, String(value)) && !checkAnswer(interaction, String(value + 1)), `${state.id}: the answer is ${value}`)
  let m
  if (state.board?.mode === 'journey') {
    const j = story(title)
    assert.deepEqual(state.board.start, j.start, `${state.id}: the journey starts at home at its time`)
    const key = j.corners.map(p => `${Math.round(p.x * 1000) / 1000}, ${p.y}`).join(', ')
    assert.ok(checkAnswer(interaction, key), `${state.id}: the story's journey is right`)
    const off = j.corners.map((p, i) => `${p.x}, ${p.y + (i === 0 ? g.scale.y.per : 0)}`).join(', ')
    assert.ok(!checkAnswer(interaction, off) && state.diagnose(off), `${state.id}: a part ending in the wrong place is wrong and explained`)
    for (const p of j.corners) {
      assert.ok(p.x > g.scale.x.start && p.x < g.x[1] && p.y >= 0 && p.y < g.y[1], `${state.id}: (${p.x}, ${p.y}) is on the graph`)
      assert.ok(near((p.x - g.x[0]) / g.scale.x.per % 1, 0) && near((p.y - g.y[0]) / g.scale.y.per % 1, 0), `${state.id}: (${p.x}, ${p.y}) is on a grid corner, so it can be tapped`)
    }
  } else {
    const parts = partsOf(g)
    assert.ok(parts.length >= 3, `${state.id}: the journey is on its graph`)
    parts.forEach(([a, b], i) => { if (i) assert.deepEqual(a, parts[i - 1][1], `${state.id}: the parts join up`) })
    assert.equal(parts[0][0].y, 0, `${state.id}: the journey starts at home`)
    if ((m = /How far from home was \w+ at (\d\d:\d\d)/.exec(title))) {
      const t = hours(m[1]), [a, b] = parts.find(([a, b]) => a.x <= t && t <= b.x)
      right(a.y + (b.y - a.y) * (t - a.x) / (b.x - a.x))
    } else if ((m = /What was \w+ doing from (\d\d:\d\d) to (\d\d:\d\d)/.exec(title))) {
      const [a, b] = parts.find(([a, b]) => near(a.x, hours(m[1])) && near(b.x, hours(m[2])))
      const label = interaction.options.find(option => option.id === interaction.correctAnswer).label
      assert.match(label, b.y > a.y ? /away/ : b.y < a.y ? /back/ : /Stopped/, `${state.id}: the part ${b.y > a.y ? 'goes away' : b.y < a.y ? 'comes back' : 'is stopped'}`)
      for (const option of interaction.options.filter(option => option.id !== interaction.correctAnswer)) assert.ok(option.feedback, `${state.id}: "${option.label}" has its own note`)
    } else if (/altogether/.test(title)) {
      right(parts.reduce((s, [a, b]) => s + Math.abs(b.y - a.y), 0))
    } else if (/minutes did \w+ stop/.test(title)) {
      const flat = parts.filter(([a, b]) => a.y === b.y)
      assert.equal(flat.length, 1, `${state.id}: one stop`)
      right(Math.round((flat[0][1].x - flat[0][0].x) * 60))
    } else if ((m = /speed.* from (\d\d:\d\d) to (\d\d:\d\d)/.exec(title))) {
      const [a, b] = parts.find(([a, b]) => near(a.x, hours(m[1])) && near(b.x, hours(m[2])))
      const s = Math.abs(b.y - a.y) / (b.x - a.x)
      right(s)
      if (!near(b.x - a.x, 1)) assert.ok(state.diagnose(String(Math.abs(b.y - a.y) / ((b.x - a.x) * 60))), `${state.id}: the time in minutes is explained`)
    } else if (/steepest part/.test(title)) {
      // Steepest on the page: the most squares up or down for each square across.
      const steep = ([a, b]) => Math.abs(b.y - a.y) / g.scale.y.per / ((b.x - a.x) / g.scale.x.per)
      const [a, b] = [...parts].sort((p, q) => steep(q) - steep(p))[0]
      assert.ok(parts.every(p => p === parts.find(q => q[0] === a) || steep(p) < steep([a, b])), `${state.id}: one part is steepest`)
      right(Math.abs(b.y - a.y) / (b.x - a.x))
    } else assert.fail(`${state.id}: a question this file doesn't know how to check`)
  }
  checked++
  const frames = state.working.examples[0].steps.map(step => step.frame.graph)
  assert.equal(frames.filter(frame => frame.answer).length, 1, `${state.id}: the answer is written once`)
  assert.ok(frames.at(-1).answer, `${state.id}: the answer is the last step`)
  for (const frame of frames) {
    assert.ok((frame.x[1] - frame.x[0]) / frame.scale.x.per <= 9, `${state.id}: at most 9 squares across`)
    for (const mk of frame.marks ?? []) assert.equal(mk.family, mk.axis === 'x' ? 1 : 0, `${state.id}: ${mk.axis} highlighted in its colour`)
  }
}
assert.equal(checked, states.filter(state => state.interaction.type !== 'continue' && rungs.includes(state.microSkillId)).length, 'Every question is checked')

// ---------- Worked examples ----------
for (const state of states.filter(state => state.interaction.type === 'continue' && state.visual.kind === 'method-worked')) {
  const frames = state.visual.examples[0].steps.map(step => step.frame.graph), last = frames.at(-1)
  if (/Draw her journey|Draw his journey/.test(state.content.title)) {
    const j = story(state.content.title)
    const drawn = last.lines.filter(line => line.at >= 0).map(line => line.to)
    assert.deepEqual(drawn, j.corners, `${state.id}: the working draws the story's journey`)
    assert.ok(last.lines.every(line => line.answer), `${state.id}: it ends green`)
  } else if (/speed from (\d\d:\d\d) to (\d\d:\d\d)/.test(state.content.title)) {
    const [, from, to] = /speed from (\d\d:\d\d) to (\d\d:\d\d)/.exec(state.content.title)
    const [a, b] = partsOf(frames[0]).find(([a, b]) => near(a.x, hours(from)) && near(b.x, hours(to)))
    assert.equal(last.answer.text, `${Math.abs(b.y - a.y) / (b.x - a.x)} km/h`, `${state.id}: the speed is distance ÷ time`)
  } else if (/How long did \w+ stop/.test(state.content.title)) {
    const [a, b] = partsOf(frames[0]).find(([a, b]) => a.y === b.y)
    assert.equal(last.answer.text, `${Math.round((b.x - a.x) * 60)} minutes`, `${state.id}: the stop is read from the flat part`)
  }
}

// ---------- Hidden: only the Graphs shelf opens it ----------
for (const file of ['src/features/maths/courseRegistry.ts', 'src/App.tsx']) assert.ok(!/distance-time\/|tutorDistanceTimeLesson|['"`]L107\b/.test(read(file)), `Lesson 107 is not in ${file}`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!read(file).includes('distance-time/') && !/['"`]L107\b/.test(read(file)), `Lesson 107 is not in ${file}`)
}
console.log(`Graphs lesson 7 (distance–time graphs): ${states.length} screens, ${checked} questions checked.`)

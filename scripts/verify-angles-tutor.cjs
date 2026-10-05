// Checks Lesson 26 (Geometry G1, Angle facts): structure and rungs, every diagram drawn to its own numbers (each labelled
// angle is the size its arc is drawn, and the facts hold: 180° on a line, 360° round a point, opposite angles equal),
// every answer worked out again from the drawing, slips rejected, one move a step with the answer once at the end,
// the video and its poster, and the route.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorAnglesLesson: lesson } = require('../src/features/angles/tutor/anglesLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

// ---------- Structure ----------
const states = lesson.states
const rungs = ['angles-straight-line', 'angles-around-point', 'angles-vertically-opposite']
assert.equal(lesson.id, 'L026', 'G1 keeps the stable progress key L026')
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
assert.ok(states[0].video, 'The first worked example carries the G1.1 video')

// ---------- Every diagram, drawn to its own numbers ----------
const sweep = arc => ((arc.to - arc.from) % 360 + 360) % 360
/** The size a label says, given x: "70°" → 70, "3x" → 3x, a bare letter → null (unknown). */
const sizeOf = (label, x) => {
  const degrees = label.match(/^(\d+)°$/)
  if (degrees) return Number(degrees[1])
  const times = label.match(/^(\d*)x$/)
  if (times && x !== undefined) return (times[1] ? Number(times[1]) : 1) * x
  return null
}
function checkDiagram(frame, where, x) {
  const labelled = frame.arcs.filter(arc => arc.label)
  for (const arc of labelled) {
    const size = sizeOf(arc.label, x)
    if (size !== null) assert.equal(sweep(arc), size, `${where}: ${arc.label} is drawn as ${sweep(arc)}°`)
  }
  if (frame.straight) {
    assert.ok(frame.rays.includes(0) && frame.rays.includes(180), `${where}: a straight line runs from 0° to 180°`)
    assert.equal(frame.arcs.reduce((sum, arc) => sum + sweep(arc), 0), 180, `${where}: the angles on the line make 180°`)
  } else {
    const total = frame.arcs.reduce((sum, arc) => sum + sweep(arc), 0)
    assert.equal(total, 360, `${where}: the angles round the point make 360°`)
  }
  // Two lines crossing: four rays in two opposite pairs, so opposite angles match.
  if (frame.rays.length === 4 && !frame.straight && frame.rays[2] - frame.rays[0] === 180) {
    assert.equal(sweep(frame.arcs[0]), sweep(frame.arcs[2]), `${where}: opposite angles are equal`)
    assert.equal(sweep(frame.arcs[1]), sweep(frame.arcs[3]), `${where}: opposite angles are equal`)
  }
}
const lastFrame = working => working.examples[0].steps.at(-1).frame.angles
let diagrams = 0, typed = 0
for (const state of states) {
  const model = state.interaction.type === 'continue' ? state.visual : state.working
  if (model?.kind !== 'method-worked') continue
  const steps = model.examples[0].steps
  const frame = lastFrame(model)
  const display = state.interaction.displayAnswer
  const x = display?.startsWith('x = ') && !display.endsWith('°') ? Number(display.slice(4)) : undefined
  checkDiagram(frame, state.id, x)
  if (state.visual.kind === 'diagram') {
    assert.equal(state.visual.diagram.kind, 'angles', `${state.id}: the question shows its own diagram`)
    assert.deepEqual(state.visual.diagram.frame.arcs, frame.arcs, `${state.id}: the question and its working draw the same angles`)
  }
  diagrams++

  // The answer, worked out again from the drawing: the letter's arc is drawn at the answer's size.
  if (state.interaction.type === 'numericInput') {
    typed++
    const answer = Number(state.interaction.correctAnswer)
    const letter = state.answerPrefix.replace(/\s*=$/, '')
    if (display.endsWith('°')) {
      const arc = frame.arcs.find(a => a.label === letter)
      assert.ok(arc, `${state.id}: ${letter} is on the diagram`)
      assert.equal(sweep(arc), answer, `${state.id}: ${letter} is drawn at ${sweep(arc)}°, not ${answer}°`)
      if (letter === 'x' && frame.arcs.every(a => a.label === 'x')) assert.equal(answer * frame.arcs.length, 360, `${state.id}: equal angles round a point`)
    } else {
      assert.ok(frame.arcs.some(a => /^\d*x$/.test(a.label)), `${state.id}: the diagram has angles in x`)
    }
    // Other ways of writing it are accepted; slips are rejected and explained.
    for (const other of [String(answer), `${answer}°`, `${letter} = ${answer}`]) assert.ok(checkAnswer(state.interaction, other), `${state.id} accepts ${other}`)
    for (const wrong of [180 - answer, 360 - answer, answer + 10]) if (wrong !== answer) assert.ok(!checkAnswer(state.interaction, String(wrong)), `${state.id} rejects ${wrong}`)
    assert.ok(state.diagnose, `${state.id} explains its slips`)
    const slip = [360 - answer, 180 - answer].find(wrong => wrong > 0 && wrong !== answer && state.diagnose(String(wrong)))
    assert.ok(slip !== undefined || display.startsWith('x'), `${state.id}: a 180°/360° mix-up gets its own message`)
  } else if (state.interaction.type === 'select') {
    const options = state.interaction.options
    assert.equal(options.length, 4, `${state.id}: four choices`)
    assert.ok(options.slice(1).every(option => option.feedback), `${state.id}: every wrong choice says why`)
  }

  // One move a step: short headings, ⓘ in words with no "=", the answer once, in the last step.
  steps.forEach((step, i) => {
    assert.ok(step.title.split(' ').length <= 5, `${state.id} step ${i + 1}: heading "${step.title}" is short`)
    assert.ok(step.instruction && !step.instruction.includes('='), `${state.id} step ${i + 1}: ⓘ is words, not a sum`)
    const own = step.frame.angles
    assert.equal(Boolean(own.answer && own.answer.at === i), i === steps.length - 1, `${state.id} step ${i + 1}: the answer comes once, at the end`)
    assert.ok(!(own.found ?? []).some(found => found.answer && found.at < steps.length - 1), `${state.id}: nothing green before the answer`)
  })
}
assert.ok(diagrams >= 15 && typed >= 9, `Every worked example and question has a diagram (${diagrams}) and most are typed (${typed})`)

// ---------- The video and the route ----------
for (const file of ['public/media/lesson-26/angle-facts.mp4', 'public/media/lesson-26/angle-facts.svg']) assert.ok(fs.existsSync(path.join(root, file)), `${file} exists`)
assert.ok(read('src/App.tsx').includes('case 26:'), 'Lesson 26 has its route')
assert.ok(read('src/features/maths/courseRegistry.ts').includes("tutorAnglesLesson.labels, 'geometry')"), 'Lesson 26 opens the Geometry chapter')

console.log(`Lesson 26 (G1 Angle facts) verified: ${states.length} screens in 3 rungs, ${diagrams} diagrams drawn to their own numbers, ${typed} typed answers worked out again, slips explained, one move a step, the video and the route.`)

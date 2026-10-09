// Checks geometry lesson 1 (Angle facts, from GM1): four rungs, each opening with a play screen on the angle board,
// every question under its own angle picture, every answer worked out again from the picture's own angles, the
// workings one move a step ending in the answer once, typed answers accepted with or without °, slips explained, and
// that the lesson stays hidden: only the noindexed Geometry shelf page opens it.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorAngleFactsLesson: lesson } = require('../src/features/angle-facts/tutor/angleFactsLesson.ts')
const { GEOMETRY_SHELF_ID: shelfId } = require('../src/features/geometry/geometryLessons.ts')
const { sizes } = require('../src/features/written-methods/tutor/AnglePictures.tsx')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

// ---------- Structure ----------
const states = lesson.states
const rungs = ['geometry-lines-points', 'geometry-shapes', 'geometry-isosceles', 'geometry-two-steps']
assert.equal(lesson.id, 'L201', 'Geometry lessons are numbered from 201 while hidden')
assert.deepEqual([...new Set(states.map(state => state.microSkillId))], [...rungs, 'mixed'], 'Four rungs, easiest first, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L201-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})
for (const rung of rungs) {
  const own = states.filter(state => state.microSkillId === rung)
  if (rung !== 'geometry-two-steps') assert.ok(own[0].interaction.type === 'continue' && own[0].angleBoard, `${rung} opens with a play screen on the angle board`)
  assert.ok(own.some(state => state.interaction.type === 'continue' && state.visual.kind === 'method-worked'), `${rung} has a worked example`)
  const questions = own.filter(state => state.interaction.type !== 'continue')
  assert.ok(questions.length >= 4, `${rung} has at least four questions`)
  assert.ok(questions.some(state => state.interaction.type === 'select' && /fact|reason|Why/i.test(state.content.title)), `${rung} asks for the reason`)
}
for (const mode of ['line', 'point', 'triangle', 'isosceles', 'quad']) assert.ok(states.some(state => state.angleBoard?.mode === mode), `The board's ${mode} mode is used`)
for (const state of states.filter(state => state.angleBoard)) assert.ok(state.content.title.split('. ').length <= 2 && !state.content.body, `${state.id}: one short sentence to do`)

// ---------- Pictures ----------
const triangleAngles = f => [f.angles[0], f.angles[1], 180 - f.angles[0] - f.angles[1], ...(f.shape === 'exterior' ? [180 - f.angles[1]] : [])]
function trueAngles(frame) {
  if (frame.shape === 'line' || frame.shape === 'point') return sizes(frame)
  if (frame.shape === 'quad') return frame.angles
  return triangleAngles(frame)
}
function checkPicture(frame, where) {
  const real = trueAngles(frame)
  if (frame.shape === 'line') assert.equal(real.reduce((a, b) => a + b), 180, `${where}: the angles on the line make 180°`)
  if (frame.shape === 'point' || (frame.shape === 'quad' && frame.angles.length)) assert.equal(real.reduce((a, b) => a + b), 360, `${where}: the angles make 360°`)
  for (const a of real) assert.ok(a > 0 && a < 180, `${where}: every angle is between 0° and 180°`)
  frame.labels.forEach((label, i) => { if (label.endsWith('°')) assert.equal(Number(label.replace('°', '')), real[i], `${where}: the angle labelled ${label} is drawn as ${real[i]}°`) })
  if (frame.equal) assert.equal(frame.angles[0], frame.angles[1], `${where}: an isosceles triangle's base angles are drawn equal`)
}

// ---------- Questions and workings ----------
let checked = 0
for (const state of states) {
  if (state.visual.kind === 'angle') checkPicture(state.visual.angle, state.id)
  const model = state.interaction.type === 'continue' ? state.visual : state.working
  if (model?.kind !== 'method-worked') continue
  const steps = model.examples[0].steps
  steps.forEach((step, i) => {
    assert.ok(step.title.split(' ').length <= 4, `${state.id} step ${i + 1}: heading "${step.title}" is short`)
    assert.ok(step.instruction, `${state.id} step ${i + 1}: says what it does`)
    if (step.frame.angles) checkPicture(step.frame.angles, `${state.id} step ${i + 1}`)
    const answers = step.frame.equation.rows.filter(row => row.answer)
    assert.equal(answers.length, i === steps.length - 1 ? 1 : 0, `${state.id} step ${i + 1}: the answer comes once, at the end`)
  })
  const last = steps.at(-1).frame
  if (state.interaction.type === 'numericInput') {
    // The answer from the picture: the angle drawn where the question's letter is.
    const picture = state.visual.angle
    const letter = state.answerPrefix.replace(' =', '')
    const at = picture.labels.indexOf(letter)
    assert.ok(at >= 0, `${state.id}: the picture marks ${letter}`)
    const right = trueAngles(picture)[at]
    assert.equal(state.interaction.correctAnswer, right, `${state.id}: ${letter} is ${right}°`)
    assert.ok(last.equation.rows.at(-1).answer.endsWith(`= ${right}°`), `${state.id}: the working ends at ${right}°`)
    assert.ok(last.angles.found?.includes(at) && last.angles.labels[at] === `${right}°`, `${state.id}: the answer is shown in the picture, in green`)
    for (const way of [`${right}`, `${right}°`, `${right} °`]) assert.ok(checkAnswer(state.interaction, way), `${state.id} accepts ${way}`)
    assert.ok(state.diagnose, `${state.id}: has its own slips`)
    checked++
  }
}
assert.ok(checked >= 12, `Every typed answer is worked out again from its picture (${checked})`)
const isoQuestions = states.filter(s => s.microSkillId === 'geometry-isosceles' && s.interaction.type === 'numericInput')
assert.ok(isoQuestions.some(s => !Number.isInteger(s.interaction.correctAnswer)), 'One isosceles answer is a half, as in the book (GM1 Q4)')

// Slips: the wrong total, and an isosceles total not halved, each get their own message.
const line = states.find(s => s.microSkillId === 'geometry-lines-points' && s.interaction.type === 'numericInput' && s.visual.angle.shape === 'line')
assert.ok(/180/.test(line.diagnose(String(360 - 117))), 'A straight line done with 360 is explained')
const top = isoQuestions.find(s => s.visual.angle.labels[2].endsWith('°'))
assert.ok(/Halve/.test(top.diagnose(String(2 * top.interaction.correctAnswer))), 'Isosceles: not halved is explained')

// ---------- Hidden: only the preview page opens it ----------
const registry = read('src/features/maths/courseRegistry.ts'), app = read('src/App.tsx')
for (const [file, text] of [['courseRegistry.ts', registry], ['App.tsx', app]]) assert.ok(!/angle-facts|AngleFacts|L201|geometryLessons/.test(text), `Angle facts is not in ${file}, so no list shows it`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!read(file).includes('angle-facts') && !read(file).includes('L201'), `Angle facts is not in ${file}`)
}
const page = read(`app/preview/${shelfId}/page.tsx`)
assert.match(page, /robots: \{ index: false, follow: false \}/, 'The preview page is noindexed')
assert.match(read('middleware.ts'), /'\/preview\/:path\*'/, 'The preview password covers the page')
console.log(`Angle facts: ${states.length} screens, ${checked} answers worked out again, hidden on the Geometry shelf`)

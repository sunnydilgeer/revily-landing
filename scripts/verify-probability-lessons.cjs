// Checks the Probability and statistics lessons (P1 to P9 in Sunny's revision book, p162–187), given the lesson
// number: node scripts/verify-probability-lessons.cjs 305. Three or four rungs then Review, each with a worked example
// and questions; every picture a measured figure that fits inside its frame, labels included; every typed answer
// matches the one worked out by hand below, is accepted with its unit typed after it (a fraction: in any equal form
// unless the question asks for its simplest), and has slip messages; every wrong choice says why; and the lesson stays
// hidden: only the noindexed Probability shelf page opens it.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const number = Number(process.argv[2])
// Each typed answer in order, worked out by hand from the book's numbers or our own.
const LESSONS = {
  301: { file: 'probabilityLesson', name: 'tutorProbabilityLesson', boards: ['scale'], answers: ['1/2', '3/5', '3/5', '1/5', 0.05, 0.22, '5/12', '1/3', '1/4', 96, 9] },
  302: { file: 'frequencyTreesLesson', name: 'tutorFrequencyTreesLesson', boards: [], answers: [102, 31, 27, 44, '44/63', '16/25', '9/25', 240, 60, 120, '9/50'] },
  303: { file: 'treeDiagramsLesson', name: 'tutorTreeDiagramsLesson', boards: ['tree'], answers: [0.5, '1/12', 0.08, '1/2', 0.65, 0.15, 0.0625, 0.48, '25/144', '35/72', 0.46] },
  304: { file: 'relativeFrequencyLesson', name: 'tutorRelativeFrequencyLesson', boards: ['spin'], answers: [0.231, 0.308, 0.827, '23/50', 40, 160, 64, 80, 0.1575, 0.315, 1575, 0.15, 0.12] },
  305: { file: 'vennLesson', name: 'tutorVennLesson', boards: [], answers: [4, '2/11', '1/3', '7/71', 66, 13, 15, 39, '1/5'] },
  306: { file: 'setNotationLesson', name: 'tutorSetNotationLesson', boards: [], answers: [6, 8, 8, 4, 5] },
  307: { file: 'dataTypesLesson', name: 'tutorDataTypesLesson', boards: [], answers: [3, 50] },
  308: { file: 'averagesLesson', name: 'tutorAveragesLesson', boards: ['average'], answers: [8, 0.488, 169, 12, 350, 310, 1.3, 1.75, 11, 62.5, 63.75] },
  309: { file: 'samplingLesson', name: 'tutorSamplingLesson', boards: [], answers: [120, 50, 20] },
}
const spec = LESSONS[number]
assert.ok(spec, `Give a lesson number, 301 to 309 (got ${process.argv[2]})`)
const lesson = require(`../src/features/probability/tutor/${spec.file}.ts`)[spec.name]
const { fitFigure } = require('../src/features/written-methods/tutor/FigurePictures.tsx')
const { steadyBounds } = require('../src/features/written-methods/tutor/AnglePictures.tsx')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
let shelf = null
try { shelf = require('../src/features/probability/probabilityLessons.ts') } catch (error) { if (!/Cannot find module/.test(error.message)) throw error }

const states = lesson.states, id = `L${number}`
assert.equal(lesson.id, id)
assert.equal(lesson.number, number)
const rungs = [...new Set(states.map(s => s.microSkillId))]
assert.ok(rungs.length >= 4 && rungs.length <= 5, 'Three or four rungs, then Review')
assert.equal(lesson.steadyPictures, true, 'Steady pictures: each worked example keeps one picture size'); assert.equal(rungs.at(-1), 'mixed')
for (const rung of rungs.slice(0, -1)) assert.ok(lesson.labels[rung], `${rung} has a label`)
states.forEach((s, i) => { assert.equal(s.id, `${id}-${String(i + 1).padStart(2, '0')}`); assert.equal(s.transition.onComplete, states[i + 1]?.id) })
for (const rung of rungs.slice(0, -1)) {
  const own = states.filter(s => s.microSkillId === rung)
  assert.ok(own.some(s => s.interaction.type === 'continue' && s.visual.kind === 'method-worked'), `${rung} has a worked example`)
  assert.ok(own.filter(s => s.interaction.type !== 'continue').length >= 2, `${rung} has questions`)
}
for (const mode of spec.boards) assert.ok(states.some(s => s.chanceBoard?.mode === mode), `The board's ${mode} screen is used`)

/** A figure: every point and label inside the 320 by 210 frame. */
function checkPicture(f, where, group) {
  assert.equal(f.shape, 'figure', `${where}: a measured figure`)
  assert.ok(f.figure.spoken.length > 5, `${where}: says what it shows`)
  const { at } = fitFigure(f.figure, 320, 210, 38, steadyBounds(f, group))
  for (const item of f.figure.items) {
    const pts = item.kind === 'shape' ? item.points : item.kind === 'line' || item.kind === 'measure' ? [item.from, item.to] : item.kind === 'point' || item.kind === 'text' ? [item.at] : item.kind === 'shade' ? item.loops.flat() : []
    for (const p of pts) { const q = at(p); assert.ok(q.x > -1 && q.x < 321 && q.y > -1 && q.y < 211, `${where}: ${item.kind} inside the frame`) }
    if (item.kind === 'text') {
      const q = at(item.at), x = q.x + (item.dx ?? 0), y = q.y + (item.dy ?? 0), half = item.text.length * 4.5
      assert.ok(x - half > -4 && x + half < 324 && y > 8 && y < 214, `${where}: label "${item.text}" inside the frame (${x.toFixed(0)}, ${y.toFixed(0)})`)
    }
  }
}

let pictures = 0
const typed = []
for (const s of states) {
  if (s.visual.kind === 'angle') { checkPicture(s.visual.angle, s.id); pictures++ }
  const model = s.interaction.type === 'continue' ? s.visual : s.working
  if (s.interaction.type !== 'continue') assert.ok(s.hint, `${s.id}: has a hint`)
  if (model?.kind !== 'method-worked') { assert.ok(s.interaction.type === 'continue', `${s.id}: a question has its working`); continue }
  const steps = model.examples[0].steps
  steps.forEach((step, i) => {
    assert.ok(step.title.split(' ').length <= 6, `${s.id} step ${i + 1}: heading "${step.title}" is short`)
    if (step.frame.angles) { checkPicture(step.frame.angles, `${s.id} step ${i + 1}`, steps.flatMap(t => [t.frame.angles, t.frame.angles?.before].filter(Boolean))); pictures++ }
    const answers = step.frame.equation.rows.filter(r => r.answer).length
    assert.equal(answers, i === steps.length - 1 ? 1 : 0, `${s.id} step ${i + 1}: the answer once, at the end`)
  })
  const last = JSON.stringify(steps.at(-1).frame.equation.rows.at(-1))
  if (s.interaction.type === 'numericInput') {
    const right = s.interaction.correctAnswer
    typed.push(right)
    const unit = (s.answerLabel ?? '').match(/\((.*)\)/)?.[1] ?? ''
    for (const way of [`${right}`, `${right} ${unit}`.trim()]) assert.ok(checkAnswer(s.interaction, way), `${s.id} accepts "${way}"`)
    assert.ok(!checkAnswer(s.interaction, `${right + 1}`), `${s.id} refuses ${right + 1}`)
    assert.ok(s.diagnose, `${s.id}: has slip messages`)
    assert.equal(s.diagnose(`${right}`), null, `${s.id}: no slip message on the right answer`)
    assert.ok(last.includes(String(right).replace('-', '−')), `${s.id}: the working ends at ${right}`)
  }
  if (s.interaction.type === 'fractionInput') {
    const right = s.interaction.correctAnswer
    typed.push(right)
    const [n, d] = right.split('/').map(Number)
    assert.ok(checkAnswer(s.interaction, right), `${s.id} accepts ${right}`)
    if (!s.interaction.requireSimplest) assert.ok(checkAnswer(s.interaction, `${n * 2}/${d * 2}`), `${s.id} accepts ${n * 2}/${d * 2}`)
    assert.ok(!checkAnswer(s.interaction, `${n + 1}/${d}`), `${s.id} refuses ${n + 1}/${d}`)
    assert.ok(last.includes(`{${n}|${d}}`) || last.includes(right), `${s.id}: the working ends at ${right}`)
  }
  if (s.interaction.type === 'select') s.interaction.options.slice(1).forEach(o => assert.ok(o.feedback, `${s.id}: "${o.label}" says why it's wrong`))
}
if (spec.answers) assert.deepEqual(typed, spec.answers, 'Every typed answer matches the one worked out by hand')
else console.log('Typed answers:', JSON.stringify(typed))

// Hidden: only the shelf page opens it.
const hiddenFrom = new RegExp(`probability/tutor|${spec.name}|${id}\\b`)
for (const [file, text] of [['courseRegistry.ts', read('src/features/maths/courseRegistry.ts')], ['App.tsx', read('src/App.tsx')]]) assert.ok(!hiddenFrom.test(text), `Not in ${file}`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!hiddenFrom.test(read(file)), `Not in ${file}`)
}
if (shelf) {
  assert.ok(shelf.probabilityLessons.some(l => l.number === number), `Lesson ${number - 300} is on the Probability shelf`)
  assert.match(read(`app/preview/${shelf.PROBABILITY_SHELF_ID}/page.tsx`), /robots: \{ index: false, follow: false \}/, 'The preview page is noindexed')
}
console.log(`${lesson.title}: ${states.length} screens, ${pictures} pictures checked, ${typed.length} answers checked${shelf ? ', hidden on the Probability shelf' : ''}`)

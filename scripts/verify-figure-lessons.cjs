// Checks geometry lessons 5 to 9 (symmetry, area, circles, perimeter, sectors; GM5 to GM9), given the lesson number:
// node scripts/verify-figure-lessons.cjs 207. Four rungs then Review, each with a worked example and questions; every
// picture a measured figure that fits inside its frame, labels included; every typed answer matches the one worked out
// by hand below, is accepted with its unit (or π) typed after it, and has slip messages; areas and perimeters match the
// shape as drawn; symmetry counts match the measuring board's own folds and turns; and the lesson stays hidden: only the
// noindexed Geometry shelf page opens it.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const number = Number(process.argv[2])
const LESSONS = {
  205: { dir: 'symmetry', name: 'tutorSymmetryLesson', boards: ['mirror', 'turn'], answers: [3, 1, 5, 1, 0, 2, 3, 1, 6, 2, 8, 1] },
  206: { dir: 'areas', name: 'tutorAreasLesson', boards: ['shear'], answers: [120, 66, 54, 52, 28.5, 30, 58.5, 48, 56, 8, 9, 96] },
  207: { dir: 'circles', name: 'tutorCirclesLesson', boards: ['circle'], answers: [7.6, 40.8, 47.1, 36, 66.5, 153.9, 25.5, 5.6, 8] },
  208: { dir: 'perimeter', name: 'tutorPerimeterLesson', boards: ['notch'], answers: [21, 36, 6.4, 6, 50, 500, 20.6, 65.1, 36, 24, 8] },
  209: { dir: 'sectors', name: 'tutorSectorsLesson', boards: ['sector'], answers: [47.1, 62.8, 19.6, 12.6, 6.3, 18.8, 35.7, 27.4] },
}
const spec = LESSONS[number]
assert.ok(spec, `Give a lesson number, 205 to 209 (got ${process.argv[2]})`)
const mod = require(`../src/features/${spec.dir}/tutor/${spec.dir}Lesson.ts`)
const lesson = mod[spec.name]
const { fitFigure } = require('../src/features/written-methods/tutor/FigurePictures.tsx')
const { SHAPES, foldsThatFit, turnsThatFit } = require('../src/features/written-methods/tutor/MeasureBoard.tsx')
const { GEOMETRY_SHELF_ID: shelfId, geometryLessons } = require('../src/features/geometry/geometryLessons.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

const states = lesson.states, id = `L${number}`
assert.equal(lesson.id, id)
const rungs = [...new Set(states.map(s => s.microSkillId))]
assert.ok(rungs.length >= 4, 'Three or four rungs, then Review'); assert.equal(rungs.at(-1), 'mixed')
states.forEach((s, i) => { assert.equal(s.id, `${id}-${String(i + 1).padStart(2, '0')}`); assert.equal(s.transition.onComplete, states[i + 1]?.id) })
for (const rung of rungs.slice(0, -1)) {
  const own = states.filter(s => s.microSkillId === rung)
  assert.ok(own.some(s => s.interaction.type === 'continue' && s.visual.kind === 'method-worked'), `${rung} has a worked example`)
  assert.ok(own.filter(s => s.interaction.type !== 'continue').length >= 2, `${rung} has questions`)
}
for (const mode of spec.boards) assert.ok(states.some(s => s.measureBoard?.mode === mode), `The board's ${mode} screen is used`)

/** A figure: every point and label inside the 320 by 210 frame. */
function checkPicture(f, where) {
  assert.equal(f.shape, 'figure', `${where}: a measured figure`)
  assert.ok(f.figure.spoken.length > 5, `${where}: says what it shows`)
  const { at } = fitFigure(f.figure)
  for (const item of f.figure.items) {
    const pts = item.kind === 'shape' ? item.points : item.kind === 'line' || item.kind === 'measure' ? [item.from, item.to] : item.kind === 'point' || item.kind === 'text' ? [item.at] : []
    for (const p of pts) { const q = at(p); assert.ok(q.x > -1 && q.x < 321 && q.y > -1 && q.y < 211, `${where}: ${item.kind} inside the frame`) }
    if (item.kind === 'measure' && item.label) {
      // Where FigurePictures.tsx sets a length's label: beside the middle of its arrow, `side` of it.
      const a = at(item.from), b = at(item.to), len = Math.hypot(b.x - a.x, b.y - a.y), n = { x: -(b.y - a.y) / len, y: (b.x - a.x) / len }
      const o = item.offset ?? 0, gap = (12 + Math.abs(n.x) * item.label.length * 4.2) * (item.side ?? 1)
      const x = (a.x + b.x) / 2 + n.x * (o + gap), y = (a.y + b.y) / 2 + n.y * (o + gap), half = item.label.length * 4.5 + 7
      assert.ok(x - half > -2 && x + half < 322 && y - 12 > -2 && y + 12 < 212, `${where}: length "${item.label}" inside the frame (${x.toFixed(0)}, ${y.toFixed(0)})`)
    }
    if (item.kind === 'text') {
      const q = at(item.at), x = q.x + (item.dx ?? 0), y = q.y + (item.dy ?? 0), half = item.text.length * 4.5
      assert.ok(x - half > -4 && x + half < 324 && y > 8 && y < 214, `${where}: label "${item.text}" inside the frame (${x.toFixed(0)}, ${y.toFixed(0)})`)
    }
  }
}
const shapeOf = f => f.figure.items.find(i => i.kind === 'shape' && !i.open)
const shoelace = pts => Math.abs(pts.reduce((a, p, i) => { const q = pts[(i + 1) % pts.length]; return a + p[0] * q[1] - q[0] * p[1] }, 0)) / 2
const around = pts => pts.reduce((a, p, i) => { const q = pts[(i + 1) % pts.length]; return a + Math.hypot(q[0] - p[0], q[1] - p[1]) }, 0)
const shapeName = pts => Object.keys(SHAPES).find(k => SHAPES[k].length === pts.length && SHAPES[k].every((p, i) => Math.hypot(p.x - pts[i][0], p.y - pts[i][1]) < 1e-9))

let pictures = 0, drawn = 0
const typed = []
for (const s of states) {
  if (s.visual.kind === 'angle') { checkPicture(s.visual.angle, s.id); pictures++ }
  const model = s.interaction.type === 'continue' ? s.visual : s.working
  if (model?.kind !== 'method-worked') continue
  const steps = model.examples[0].steps
  steps.forEach((step, i) => {
    assert.ok(step.title.split(' ').length <= 6, `${s.id} step ${i + 1}: heading is short`)
    checkPicture(step.frame.angles, `${s.id} step ${i + 1}`); pictures++
    const answers = step.frame.equation.rows.filter(r => r.answer).length
    if (s.interaction.type !== 'continue' || s.microSkillId !== 'geometry-circle-parts') assert.equal(answers, i === steps.length - 1 ? 1 : 0, `${s.id} step ${i + 1}: the answer once, at the end`)
  })
  if (s.interaction.type === 'numericInput') {
    const right = s.interaction.correctAnswer
    typed.push(right)
    const unit = (s.answerLabel ?? '').match(/\((.*)\)/)?.[1] ?? ''
    for (const way of [`${right}`, `${right} ${unit}`.trim(), `${right}${unit.replace(/ /g, '')}`]) assert.ok(checkAnswer(s.interaction, way), `${s.id} accepts "${way}"`)
    assert.ok(!checkAnswer(s.interaction, `${right + 1}`), `${s.id} refuses ${right + 1}`)
    assert.ok(s.diagnose, `${s.id}: has slip messages`)
    assert.equal(s.diagnose(`${right}`), null, `${s.id}: no slip message on the right answer`)
    const last = JSON.stringify(steps.at(-1).frame.equation.rows.at(-1))
    assert.ok(last.includes(String(right)), `${s.id}: the working ends at ${right}`)
    const f = s.visual.angle, shape = shapeOf(f.figure ? f : { figure: { items: [] } })
    // As drawn: areas and perimeters of straight-sided shapes, and the symmetry board's own count.
    if (/^Find the area of this (rectangle|parallelogram|triangle|trapezium)/.test(s.content.title)) { assert.ok(Math.abs(shoelace(shape.points) - right) < 1e-6, `${s.id}: the drawn shape's area is ${right}`); drawn++ }
    if (/^(Find the perimeter of this|A field)/.test(s.content.title) && !f.figure.items.some(i => i.kind === 'arc')) { assert.ok(Math.abs(around(shape.points) - right) < 0.05, `${s.id}: the drawn shape's perimeter is ${right} (${around(shape.points).toFixed(3)})`); drawn++ }
    if (number === 205) {
      const name = shapeName(shape.points)
      if (name) assert.equal(right, /order/i.test(s.content.title) ? turnsThatFit(name).length : foldsThatFit(name).length, `${s.id}: the ${name} fits ${right} times on the board`)
      else assert.equal(right, mod.SUN_LINES.length, `${s.id}: the sun's lines`)
      drawn++
    }
  }
  if (s.interaction.type === 'select') s.interaction.options.slice(1).forEach(o => assert.ok(o.feedback, `${s.id}: "${o.label}" says why it's wrong`))
}
assert.deepEqual(typed, spec.answers, 'Every typed answer matches the one worked out by hand')

// Hidden: only the shelf page opens it.
assert.ok(geometryLessons.some(l => l.number === number), `Lesson ${number - 200} is on the Geometry shelf`)
const hiddenFrom = new RegExp(`${spec.dir}/tutor|${spec.name}|${id}\\b`)
for (const [file, text] of [['courseRegistry.ts', read('src/features/maths/courseRegistry.ts')], ['App.tsx', read('src/App.tsx')]]) assert.ok(!hiddenFrom.test(text), `Not in ${file}`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!hiddenFrom.test(read(file)), `Not in ${file}`)
}
assert.match(read(`app/preview/${shelfId}/page.tsx`), /robots: \{ index: false, follow: false \}/, 'The preview page is noindexed')
console.log(`${lesson.title}: ${states.length} screens, ${pictures} pictures checked, ${typed.length} answers checked (${drawn} against the picture), hidden on the Geometry shelf`)

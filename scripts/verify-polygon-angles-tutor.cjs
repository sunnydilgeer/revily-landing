// Checks geometry lesson 4 (Interior and exterior angles, from GM4): four rungs, the play screens on the angle board,
// every picture a polygon that closes with its angles adding to (n − 2) × 180°, every labelled angle (inside, outside,
// or written with x) drawn at its size, every typed answer worked out again from the picture, the usual slips
// explained, and that the lesson stays hidden: only the noindexed Geometry shelf page opens it.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorPolygonAnglesLesson: lesson } = require('../src/features/polygon-angles/tutor/polygonAnglesLesson.ts')
const { polygonCorners } = require('../src/features/written-methods/tutor/AnglePictures.tsx')
const { GEOMETRY_SHELF_ID: shelfId, geometryLessons } = require('../src/features/geometry/geometryLessons.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

const states = lesson.states
const rungs = ['geometry-exterior', 'geometry-interior-sum', 'geometry-regular-angles', 'geometry-polygon-algebra']
assert.equal(lesson.id, 'L204')
assert.deepEqual([...new Set(states.map(s => s.microSkillId))], [...rungs, 'mixed'], 'Four rungs, then Review')
states.forEach((s, i) => { assert.equal(s.id, `L204-${String(i + 1).padStart(2, '0')}`); assert.equal(s.transition.onComplete, states[i + 1]?.id) })
for (const rung of rungs) {
  const own = states.filter(s => s.microSkillId === rung)
  if (rung === 'geometry-exterior' || rung === 'geometry-interior-sum') assert.ok(own[0].angleBoard, `${rung} opens with a play screen on the angle board`)
  assert.ok(own.some(s => s.interaction.type === 'continue' && s.visual.kind === 'method-worked'), `${rung} has a worked example`)
  assert.ok(own.filter(s => s.interaction.type !== 'continue').length >= 4, `${rung} has at least four questions`)
}
for (const mode of ['exterior', 'interior']) assert.ok(states.some(s => s.angleBoard?.mode === mode), `The board's ${mode} screen is used`)

/** A label's value when x is known: "x + 60", "2x", "x", "130°". */
const valueOf = (label, x) => { const m = label.replace('°', '').match(/^(\d*)x(?: \+ (\d+))?$/); return m ? (Number(m[1] || 1) * x + Number(m[2] || 0)) : Number(label.replace('°', '')) }

function checkPicture(f, where, x) {
  assert.equal(f.shape, 'polygon', `${where}: a polygon`)
  const n = f.angles.length
  assert.ok(Math.abs(f.angles.reduce((a, b) => a + b, 0) - (n - 2) * 180) < 1e-6, `${where}: angles add to ${(n - 2) * 180}°`)
  const V = polygonCorners(f.angles, f.sides, f.turn)
  assert.ok(V && V.length === n, `${where}: the shape closes`)
  const len = V.map((p, i) => Math.hypot(V[(i + 1) % n].x - p.x, V[(i + 1) % n].y - p.y))
  assert.ok(Math.min(...len) > Math.max(...len) * 0.25, `${where}: no side is too short to read (${len.map(l => l.toFixed(2))})`)
  assert.ok(f.angles.every(a => a > 20 && a < 180), `${where}: a convex shape, no corner too sharp`)
  assert.equal(f.labels.length, n, `${where}: a label for every corner (blank when unmarked)`)
  f.labels.forEach((l, i) => { if (l.endsWith('°') || (/x/.test(l) && x !== undefined)) assert.equal(valueOf(l, x), Math.round(f.angles[i]), `${where}: ${l} is drawn as ${f.angles[i]}°`) })
  f.outside?.forEach((l, i) => { if (l?.endsWith('°')) assert.equal(Number(l.replace('°', '')), Math.round(180 - f.angles[i]), `${where}: outside ${l} is drawn as ${180 - f.angles[i]}°`) })
  if (f.outside) assert.equal(f.outside.length, n, `${where}: an outside entry for every corner`)
  f.sideTicks?.forEach((t, i) => f.sideTicks.forEach((u, j) => { if (t && t === u) assert.ok(Math.abs(len[i] - len[j]) < 1e-6, `${where}: sides ${i} and ${j} are ticked equal and are`) }))
  if (f.families) assert.equal(f.families.length, f.outside ? 2 * n : n, `${where}: a colour for every mark`)
}

let checked = 0, pictures = 0
for (const s of states) {
  const typed = s.interaction.type === 'numericInput' ? s.interaction.correctAnswer : undefined
  const xs = s.visual.kind === 'angle' && s.visual.angle.labels.some(l => /\dx|x \+/.test(l)) ? typed : undefined
  if (s.visual.kind === 'angle') { checkPicture(s.visual.angle, s.id, xs); pictures++ }
  const model = s.interaction.type === 'continue' ? s.visual : s.working
  if (model?.kind !== 'method-worked') continue
  const steps = model.examples[0].steps
  steps.forEach((step, i) => {
    assert.ok(step.title.split(' ').length <= 5, `${s.id} step ${i + 1}: heading is short`)
    checkPicture(step.frame.angles, `${s.id} step ${i + 1}`, xs); pictures++
    assert.equal(step.frame.equation.rows.filter(r => r.answer).length, i === steps.length - 1 ? 1 : 0, `${s.id} step ${i + 1}: the answer once, at the end`)
    const f = step.frame.angles, n = f.angles.length
    for (const k of f.found ?? []) {
      const shown = k < n ? f.labels[k] : f.outside[k - n], size = k < n ? f.angles[k] : 180 - f.angles[k - n]
      assert.equal(shown, `${Math.round(size)}°`, `${s.id} step ${i + 1}: shows the angle it finds at its drawn size`)
    }
  })
  // Algebra worked examples: the answer's x makes every labelled angle its drawn size.
  if (s.interaction.type === 'continue' && s.visual.kind === 'method-worked') {
    const f = steps[0].frame.angles, last = steps.at(-1).frame.equation.rows.at(-1).answer
    if (f.labels.some(l => /\dx|x \+/.test(l))) { const x = Number(last.replace(/^x = /, '')); f.labels.forEach((l, i) => { if (l) assert.equal(valueOf(l, x), Math.round(f.angles[i]), `${s.id}: ${l} = ${f.angles[i]}° when x = ${x}`) }) }
  }
  if (typed !== undefined) {
    const last = steps.at(-1).frame.equation.rows.at(-1).answer
    assert.ok(last.replace('°', '').match(/= (\d+(?:\.\d+)?)/)[1] === String(typed), `${s.id}: the working ends at ${typed} (${last})`)
    const f = s.visual.angle, x = f.labels.indexOf('x'), n = f.angles.length
    if (x >= 0 && !xs) assert.equal(typed, Math.round(f.angles[x]), `${s.id}: x is the drawn angle`)
    const xOut = f.outside?.indexOf('x') ?? -1
    if (xOut >= 0) assert.equal(typed, Math.round(180 - f.angles[xOut]), `${s.id}: x is the drawn exterior angle`)
    if (f.labels.every(l => !l.includes('x')) && xOut < 0 && s.answerPrefix === 'Sum =') assert.equal(typed, (n - 2) * 180, `${s.id}: the sum is (n − 2) × 180`)
    if (s.answerPrefix === 'n =') assert.equal(typed, n, `${s.id}: the number of sides is drawn`)
    for (const way of [`${typed}`]) assert.ok(checkAnswer(s.interaction, way), `${s.id} accepts ${way}`)
    assert.ok(s.diagnose && s.diagnose(String((n) * 180)) !== undefined, `${s.id}: has slip messages`)
    checked++
  }
  if (s.interaction.type === 'select') s.interaction.options.slice(1).forEach(o => assert.ok(o.feedback, `${s.id}: "${o.label}" says why it's wrong`))
}
assert.ok(checked >= 12, `Every typed answer is worked out again (${checked})`)

// Hidden: only the shelf page opens it.
assert.ok(geometryLessons.some(l => l.number === 204), 'Lesson 4 is on the Geometry shelf')
for (const [file, text] of [['courseRegistry.ts', read('src/features/maths/courseRegistry.ts')], ['App.tsx', read('src/App.tsx')]]) assert.ok(!/polygon-angles|PolygonAngles|L204/.test(text), `Not in ${file}`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!read(file).includes('polygon-angles') && !read(file).includes('L204'), `Not in ${file}`)
}
assert.match(read(`app/preview/${shelfId}/page.tsx`), /robots: \{ index: false, follow: false \}/, 'The preview page is noindexed')
console.log(`Interior and exterior angles: ${states.length} screens, ${pictures} pictures checked, ${checked} answers worked out again, hidden on the Geometry shelf`)

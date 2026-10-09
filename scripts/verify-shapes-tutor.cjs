// Checks geometry lesson 3 (2D shapes, from GM3): four rungs, the play screens on the angle board, every picture a
// polygon that closes with its angles adding to (n − 2) × 180°, every labelled angle drawn at its size, every typed
// answer worked out again from the picture, names that match the number of sides, triangle kinds that match their
// angles, and that the lesson stays hidden: only the noindexed Geometry shelf page opens it.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorShapesLesson: lesson, NAMES } = require('../src/features/shapes/tutor/shapesLesson.ts')
const { polygonCorners } = require('../src/features/written-methods/tutor/AnglePictures.tsx')
const { triangleKind } = require('../src/features/written-methods/tutor/AngleBoard.tsx')
const { GEOMETRY_SHELF_ID: shelfId, geometryLessons } = require('../src/features/geometry/geometryLessons.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

const states = lesson.states
const rungs = ['geometry-polygon-names', 'geometry-triangle-types', 'geometry-quadrilaterals', 'geometry-shape-angles']
assert.equal(lesson.id, 'L203')
assert.deepEqual([...new Set(states.map(s => s.microSkillId))], [...rungs, 'mixed'], 'Four rungs, then Review')
states.forEach((s, i) => { assert.equal(s.id, `L203-${String(i + 1).padStart(2, '0')}`); assert.equal(s.transition.onComplete, states[i + 1]?.id) })
for (const rung of rungs) {
  const own = states.filter(s => s.microSkillId === rung)
  if (rung !== 'geometry-shape-angles') assert.ok(own[0].angleBoard, `${rung} opens with a play screen on the angle board`)
  assert.ok(own.some(s => s.interaction.type === 'continue' && s.visual.kind === 'method-worked'), `${rung} has a worked example`)
  assert.ok(own.filter(s => s.interaction.type !== 'continue').length >= 4, `${rung} has at least four questions`)
}
for (const mode of ['polygon', 'kinds', 'parallelogram']) assert.ok(states.some(s => s.angleBoard?.mode === mode), `The board's ${mode} screen is used`)

function checkPicture(f, where) {
  assert.equal(f.shape, 'polygon', `${where}: a polygon`)
  const n = f.angles.length
  assert.ok(Math.abs(f.angles.reduce((a, b) => a + b, 0) - (n - 2) * 180) < 1e-6, `${where}: angles add to ${(n - 2) * 180}°`)
  const V = polygonCorners(f.angles, f.sides)
  assert.ok(V && V.length === n, `${where}: the shape closes`)
  // Every side long enough to see, and no side crossing another.
  const len = V.map((p, i) => Math.hypot(V[(i + 1) % n].x - p.x, V[(i + 1) % n].y - p.y)), longest = Math.max(...len)
  assert.ok(Math.min(...len) > longest * 0.25, `${where}: no side is too short to read (${len.map(l => l.toFixed(2))})`)
  const side = (p, q, r) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x))
  for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) {
    if (i === 0 && j === n - 1) continue
    const [a, b, c, d] = [V[i], V[(i + 1) % n], V[j], V[(j + 1) % n]]
    assert.ok(!(side(a, b, c) !== side(a, b, d) && side(c, d, a) !== side(c, d, b)), `${where}: sides ${i} and ${j} don't cross`)
  }
  assert.equal(f.labels.length, n, `${where}: a label for every corner (blank when unmarked)`)
  f.labels.forEach((l, i) => { if (l.endsWith('°')) assert.equal(Number(l.replace('°', '')), Math.round(f.angles[i]), `${where}: ${l} is drawn as ${f.angles[i]}°`) })
  f.labels.forEach((l, i) => { if (l === ' ') assert.equal(f.angles[i], 90, `${where}: a bare mark is a right angle`) })
  for (const marks of [f.sideTicks, f.sideArrows]) if (marks) assert.equal(marks.length, n, `${where}: a mark count for every side`)
  // Ticks: sides with the same ticks are the same length. Arrows: sides with the same arrows are parallel.
  f.sideTicks?.forEach((t, i) => f.sideTicks.forEach((u, j) => { if (t && t === u) assert.ok(Math.abs(len[i] - len[j]) < 1e-6, `${where}: sides ${i} and ${j} are ticked equal and are`) }))
  const dirOf = i => Math.atan2(V[(i + 1) % n].y - V[i].y, V[(i + 1) % n].x - V[i].x)
  f.sideArrows?.forEach((t, i) => f.sideArrows.forEach((u, j) => { if (t && t === u && i !== j) assert.ok(Math.abs(Math.sin(dirOf(i) - dirOf(j))) < 1e-6, `${where}: sides ${i} and ${j} have arrows and are parallel`) }))
  if (f.caption && NAMES[n] && Object.values(NAMES).includes(f.caption)) assert.equal(f.caption, NAMES[n], `${where}: named for its ${n} sides`)
  if (n === 3 && f.caption && /Equilateral|Isosceles|Scalene|Right/.test(f.caption)) assert.equal(f.caption, triangleKind(...f.angles.map(Math.round)), `${where}: the triangle's kind matches its angles`)
}

let checked = 0, pictures = 0
for (const s of states) {
  if (s.visual.kind === 'angle') { checkPicture(s.visual.angle, s.id); pictures++ }
  const model = s.interaction.type === 'continue' ? s.visual : s.working
  if (model?.kind !== 'method-worked') continue
  const steps = model.examples[0].steps
  steps.forEach((step, i) => {
    assert.ok(step.title.split(' ').length <= 6, `${s.id} step ${i + 1}: heading is short`)
    checkPicture(step.frame.angles, `${s.id} step ${i + 1}`); pictures++
    const answers = step.frame.equation.rows.filter(r => r.answer).length
    if (s.microSkillId !== 'geometry-quadrilaterals' || s.interaction.type !== 'continue') assert.equal(answers, i === steps.length - 1 ? 1 : 0, `${s.id} step ${i + 1}: the answer once, at the end`)
    const f = step.frame.angles
    for (const k of f.found ?? []) assert.equal(f.labels[k], `${Math.round(f.angles[k])}°`, `${s.id} step ${i + 1}: shows the angle it finds at its drawn size`)
  })
  if (s.interaction.type === 'numericInput') {
    const f = s.visual.angle, x = f.labels.indexOf('x'), right = Math.round(f.angles[x])
    assert.equal(s.interaction.correctAnswer, right, `${s.id}: x is ${right}°`)
    assert.ok(steps.at(-1).frame.equation.rows.at(-1).answer.endsWith(`= ${right}°`), `${s.id}: the working ends at ${right}°`)
    for (const way of [`${right}`, `${right}°`]) assert.ok(checkAnswer(s.interaction, way), `${s.id} accepts ${way}`)
    assert.ok(s.diagnose, `${s.id}: has slip messages`)
    checked++
  }
  if (s.interaction.type === 'select') {
    const answer = steps.at(-1).frame.equation.rows.at(-1).answer, right = s.interaction.options[0].label
    assert.ok(right.toLowerCase().includes(answer.toLowerCase().replace(/^regular /, '')) || /No: |Yes: |Opposite/.test(right), `${s.id}: the working ends at the right option (${answer} / ${right})`)
    s.interaction.options.slice(1).forEach(o => assert.ok(o.feedback, `${s.id}: "${o.label}" says why it's wrong`))
  }
}
assert.ok(checked >= 5, `Every typed answer is worked out again (${checked})`)

// Hidden: only the shelf page opens it.
assert.ok(geometryLessons.some(l => l.number === 203), 'Lesson 3 is on the Geometry shelf')
for (const [file, text] of [['courseRegistry.ts', read('src/features/maths/courseRegistry.ts')], ['App.tsx', read('src/App.tsx')]]) assert.ok(!/shapes\/tutor|ShapesLesson|L203/.test(text), `Not in ${file}`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!read(file).includes('shapes/tutor') && !read(file).includes('L203'), `Not in ${file}`)
}
assert.match(read(`app/preview/${shelfId}/page.tsx`), /robots: \{ index: false, follow: false \}/, 'The preview page is noindexed')
console.log(`2D shapes: ${states.length} screens, ${pictures} pictures checked, ${checked} answers worked out again, hidden on the Geometry shelf`)

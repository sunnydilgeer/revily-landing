// Checks geometry lesson 2 (Angles in parallel lines, from GM2): four rungs, the play screens on the angle board, every
// question under its own picture, every answer worked out again from the picture's own crossing angle, every step
// naming its rule (the rule found again from where the two angles are), slips explained, and that the lesson stays
// hidden: only the noindexed Geometry shelf page opens it.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)
require.extensions['.css'] = () => {}

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorParallelAnglesLesson: lesson, RULES } = require('../src/features/parallel-angles/tutor/parallelAnglesLesson.ts')
const { GEOMETRY_SHELF_ID: shelfId, geometryLessons } = require('../src/features/geometry/geometryLessons.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')

const states = lesson.states
const rungs = ['geometry-opposite', 'geometry-f-z', 'geometry-allied', 'geometry-parallel-steps']
assert.equal(lesson.id, 'L202')
assert.deepEqual([...new Set(states.map(s => s.microSkillId))], [...rungs, 'mixed'], 'Four rungs, then Review')
states.forEach((s, i) => { assert.equal(s.id, `L202-${String(i + 1).padStart(2, '0')}`); assert.equal(s.transition.onComplete, states[i + 1]?.id) })
for (const rung of rungs) {
  const own = states.filter(s => s.microSkillId === rung)
  if (rung !== 'geometry-parallel-steps') assert.ok(own[0].angleBoard, `${rung} opens with a play screen on the angle board`)
  assert.ok(own.some(s => s.interaction.type === 'continue' && s.visual.kind === 'method-worked'), `${rung} has a worked example`)
  assert.ok(own.filter(s => s.interaction.type !== 'continue').length >= 4, `${rung} has at least four questions`)
  assert.ok(own.some(s => s.interaction.type === 'select'), `${rung} asks for the rule`)
}
for (const [mode, pair] of [['cross'], ['parallel', 'F'], ['parallel', 'Z'], ['parallel', 'C']]) assert.ok(states.some(s => s.angleBoard?.mode === mode && s.angleBoard.pair === pair), `The board's ${mode} ${pair ?? ''} screen is used`)

// Places: 0 and 2 are the crossing angle t, 1 and 3 its partner, 180 − t.
const size = (t, place) => place % 2 === 0 ? t : 180 - t
// The rule two places need, worked out here from scratch: same crossing (opposite, or side by side on a line), or the
// letter they make across the parallel lines.
function rule(a, b) {
  const [i, j] = a < b ? [a, b] : [b, a]
  const above = k => k % 4 < 2, right = k => k % 4 === 0 || k % 4 === 3
  if ((i < 4) === (j < 4)) return (i % 4 + 2) % 4 === j % 4 ? 'opposite' : 'line'
  if (i % 4 === j % 4) return 'corresponding'
  const inside = !above(i) && above(j)
  assert.ok(inside, `places ${a} and ${b} are linked by one rule`)
  return right(i) === right(j) ? 'allied' : 'alternate'
}
function checkPicture(f, where) {
  assert.ok(f.angles[0] >= 35 && f.angles[0] <= 145, `${where}: the crossing line isn't too flat to read`)
  f.labels.forEach((l, i) => { if (l.endsWith('°')) assert.equal(Number(l.replace('°', '')), size(f.angles[0], i % 4), `${where}: the angle labelled ${l} is drawn as ${size(f.angles[0], i % 4)}°`) })
  assert.equal(f.labels.length, f.shape === 'cross' ? 4 : 8, `${where}: every place has a label (blank when unmarked)`)
}

let checked = 0
for (const s of states) {
  if (s.visual.kind === 'angle') checkPicture(s.visual.angle, s.id)
  const model = s.interaction.type === 'continue' ? s.visual : s.working
  if (model?.kind !== 'method-worked') continue
  const steps = model.examples[0].steps
  steps.forEach((step, i) => {
    assert.ok(step.title.split(' ').length <= 4, `${s.id} step ${i + 1}: heading is short`)
    const f = step.frame.angles
    checkPicture(f, `${s.id} step ${i + 1}`)
    assert.equal(step.frame.equation.rows.filter(r => r.answer).length, i === steps.length - 1 ? 1 : 0, `${s.id} step ${i + 1}: the answer once, at the end`)
    if (f.found?.length) {
      // A step that finds an angle names the rule linking the angle it uses to the one it finds, and lights its letter.
      const [from] = f.boxed, [to] = f.found
      const named = step.frame.equation.rows.findLast(r => r.note)?.note
      assert.equal(named, RULES[rule(from, to)].name, `${s.id} step ${i + 1}: names the right rule`)
      if (f.shape === 'parallel') assert.deepEqual(f.pair, [from, to], `${s.id} step ${i + 1}: lights the rule's letter`)
      assert.equal(f.labels[to], `${size(f.angles[0], to % 4)}°`, `${s.id} step ${i + 1}: shows the angle it finds`)
    }
  })
  if (s.interaction.type === 'numericInput') {
    const f = s.visual.angle, x = f.labels.indexOf('x'), right = size(f.angles[0], x % 4)
    assert.equal(s.interaction.correctAnswer, right, `${s.id}: x is ${right}°`)
    assert.ok(steps.at(-1).frame.equation.rows.at(-1).answer.endsWith(`= ${right}°`), `${s.id}: the working ends at ${right}°`)
    for (const way of [`${right}`, `${right}°`]) assert.ok(checkAnswer(s.interaction, way), `${s.id} accepts ${way}`)
    const other = 180 - right
    if (other !== right) assert.ok(s.diagnose(String(other)), `${s.id}: the partner angle gets its own message`)
    checked++
  }
}
assert.ok(checked >= 12, `Every typed answer is worked out again (${checked})`)

// Hidden: only the shelf page opens it.
assert.ok(geometryLessons.some(l => l.number === 202), 'Lesson 2 is on the Geometry shelf')
for (const [file, text] of [['courseRegistry.ts', read('src/features/maths/courseRegistry.ts')], ['App.tsx', read('src/App.tsx')]]) assert.ok(!/parallel-angles|ParallelAngles|L202/.test(text), `Not in ${file}`)
for (const dir of ['src/features/cards', 'src/features/maths/practice', 'src/features/maths/readiness']) {
  const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])
  for (const file of walk(dir)) assert.ok(!read(file).includes('parallel-angles') && !read(file).includes('L202'), `Not in ${file}`)
}
assert.match(read(`app/preview/${shelfId}/page.tsx`), /robots: \{ index: false, follow: false \}/, 'The preview page is noindexed')
console.log(`Angles in parallel lines: ${states.length} screens, ${checked} answers worked out again, hidden on the Geometry shelf`)

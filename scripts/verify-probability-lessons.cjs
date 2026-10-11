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
  301: { file: 'probabilityLesson', name: 'tutorProbabilityLesson', boards: ['scale'], answers: ['1/2', '3/5', '3/5', '1/5', 0.05, 0.22, '5/12', '1/3', '1/4', 96, 9, '1/3', 0.25],
    // 1 red part in 4: 0.25. No rain: 1 − 0.3 = 0.7. Review: 3 red counters of 4, 0.75.
    drags: ['0.25', '0.7', '0.75'] },
  302: { file: 'frequencyTreesLesson', name: 'tutorFrequencyTreesLesson', boards: [], answers: [102, 31, 27, 44, '44/63', '16/25', '9/25', 240, 60, 120, '9/50', 18, '2/5', 80] },
  303: { file: 'treeDiagramsLesson', name: 'tutorTreeDiagramsLesson', boards: ['tree'], answers: [0.5, '1/12', 0.08, '1/2', 0.65, 0.15, 0.0625, 0.48, '25/144', '35/72', 0.46, 0.15],
    // P(win both) = 0.42 = 0.6 × 0.7, either way round. Review: P(lose both) = 0.12 = 0.3 × 0.4 or 0.2 × 0.6.
    drags: ['6,7 or 7,6', '8,4 or 7,6 or 6,7 or 4,8'] },
  304: { file: 'relativeFrequencyLesson', name: 'tutorRelativeFrequencyLesson', boards: ['spin'], answers: [0.231, 0.308, 0.827, '23/50', 50, 40, 160, 64, 80, 0.1575, 0.315, 1575, 0.15, 0.12, 0.3, 100] },
  305: { file: 'vennLesson', name: 'tutorVennLesson', boards: [], answers: [4, '2/11', '1/3', '7/71', 66, 13, 15, 39, '1/5', 3, '3/10'],
    // 1 to 11, odd and prime: 1 and 9 odd only, 2 prime only, 3 5 7 11 both, the evens outside. 1 to 12, even and
    // multiples of 3: 6 and 12 both, 3 and 9 B only, 2 4 8 10 A only, 1 5 7 11 outside.
    sorts: ['play onlyA,onlyB,both,outside,both,outside,both,outside,onlyA,outside,both', 'outside,onlyA,onlyB,onlyA,outside,both,outside,onlyA,onlyB,onlyA,outside,both',
      // Review, 1 to 10, factors of 12 and odd: 1 and 3 both, 2 4 6 A only, 5 7 9 B only, 8 and 10 outside.
      'both,onlyA,both,onlyA,onlyB,onlyA,onlyB,outside,onlyB,outside'] },
  306: { file: 'setNotationLesson', name: 'tutorSetNotationLesson', boards: [], answers: [6, 8, 8, 4, 5, 6],
    // 1 to 10: the odd ones in A, the even ones in A'.
    sorts: ['play A,notA,A,notA,A,notA,A,notA,A,notA', 'one,both,one,both,neither,one,neither,one'] },
  307: { file: 'dataTypesLesson', name: 'tutorDataTypesLesson', boards: [], answers: [3, 50, 24],
    // Hair colour, siblings, band, cube time, eye colour, goals; car colour, weight, sport, texts, country; heights,
    // queue, lengths, children, times; Michael, newspaper, traffic count, online survey, class vote.
    sorts: ['play words,numbers,words,numbers,words,numbers', 'words,numbers,words,numbers,words', 'continuous,discrete,continuous,discrete,continuous', 'primary,secondary,primary,secondary,primary', 'discrete,continuous,qual,discrete,continuous,qual'] },
  308: { file: 'averagesLesson', name: 'tutorAveragesLesson', boards: ['average'], answers: [8, 0.488, 169, 12, 350, 310, 1.3, 1.75, 11, 62.5, 63.75, 9.5, 11],
    // Mean 7 of seven values: 49 − (3 + 5 + 5 + 6 + 8 + 9) = 13. Range 12 from a smallest of 3: 15.
    drags: ['13', '15'] },
  309: { file: 'samplingLesson', name: 'tutorSamplingLesson', boards: [], answers: [120, 50, 20, 45],
    // Library, school list, one road, online poll, field squares; crisps, ages, books, exercise, shopping day.
    sorts: ['biased,fair,biased,biased,fair', 'play fault,fault,fine,fault,fine', 'biased,fair,biased,fair'] },
  // Toast 4 + 15 + 12 + 24 + 10 + 10 = 75; audio 3 of 20 = 15%; paperbacks − hardbacks 7 thousand; adults 5 + children
  // 16 = 21; children 24 − 6 = 18; review blue 14 of 38 = 36.8%; bus girls 9 − boys 4 = 5.
  // While a lesson is being written: no answers yet, so the script prints what it finds instead of checking it.
  310: { file: 'pictogramsLesson', name: 'tutorPictogramsLesson', boards: [] },
  311: { file: 'stemLeafLesson', name: 'tutorStemLeafLesson', boards: [] },
  312: { file: 'frequencyTablesLesson', name: 'tutorFrequencyTablesLesson', boards: [] },
  313: { file: 'groupedFrequencyLesson', name: 'tutorGroupedFrequencyLesson', boards: [] },
  314: { file: 'estimatingMeanLesson', name: 'tutorEstimatingMeanLesson', boards: [] },
  316: { file: 'scatterGraphsLesson', name: 'tutorScatterGraphsLesson', boards: [] },
  317: { file: 'lineGraphsLesson', name: 'tutorLineGraphsLesson', boards: [] },
  318: { file: 'pieChartsLesson', name: 'tutorPieChartsLesson', boards: [] },
  315: { file: 'barChartsLesson', name: 'tutorBarChartsLesson', boards: [], answers: [75, 15, 7000, 21, 18, 36.8, 5],
    drags: ['chart 4,15,12,24,10,10', 'chart 8,14,5,11'] },
}
const spec = LESSONS[number]
assert.ok(spec, `Give a lesson number, 301 to 318 (got ${process.argv[2]})`)
const lesson = require(`../src/features/probability/tutor/${spec.file}.ts`)[spec.name]
const { fitFigure } = require('../src/features/written-methods/tutor/FigurePictures.tsx')
const { steadyBounds } = require('../src/features/written-methods/tutor/AnglePictures.tsx')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const { sortAnswer, sortPlaces } = require('../src/features/written-methods/tutor/SortBoard.tsx')
const { chanceValue } = require('../src/features/written-methods/tutor/ChanceBoard.tsx')
const { chartValue } = require('../src/features/written-methods/tutor/ChartBoard.tsx')
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
const typed = [], sorted = [], dragged = []
// Room in each Venn region on the sort board (SortBoard.tsx).
const VENN_SLOTS = { onlyA: 6, both: 6, onlyB: 6, outside: 11 }
for (const s of states) {
  if (s.visual.kind === 'angle') { checkPicture(s.visual.angle, s.id); pictures++ }
  const model = s.interaction.type === 'continue' ? s.visual : s.working
  if (s.interaction.type !== 'continue') assert.ok(s.hint, `${s.id}: has a hint`)
  if (s.chanceBoard?.ask) {
    // A question on the chance board: the board can reach every right answer, each is accepted, and a wrong one is
    // told why (matched against the answers worked out by hand below).
    const rights = [s.interaction.correctAnswer].flat().map(String)
    dragged.push(rights.join(' or '))
    for (const right of rights) { assert.ok(checkAnswer(s.interaction, right), `${s.id} accepts ${right}`); assert.equal(s.diagnose(right), null, `${s.id}: no slip message on ${right}`) }
    const reach = { scale: Array.from({ length: 21 }, (_, n) => [n]), tree: Array.from({ length: 121 }, (_, n) => [Math.floor(n / 11), n % 11]), average: Array.from({ length: 20 }, (_, n) => [n + 1]) }[s.chanceBoard.mode]
    const values = reach.map(v => chanceValue(s.chanceBoard.mode, v))
    for (const right of rights) assert.ok(values.includes(right), `${s.id}: the board can reach ${right}`)
    const wrong = values.find(v => !rights.includes(v))
    assert.ok(!checkAnswer(s.interaction, wrong), `${s.id} refuses ${wrong}`)
    assert.ok(s.diagnose(wrong), `${s.id}: says why ${wrong} is wrong`)
    assert.ok(!rights.includes(chanceValue(s.chanceBoard.mode, s.chanceBoard.from ?? [])), `${s.id}: doesn't start on the answer`)
    assert.ok(s.hint && model?.kind === 'method-worked', `${s.id}: has a hint and its working`)
    continue
  }
  if (s.chartBoard?.ask) {
    // A question on the chart board: each right answer is accepted and is somewhere the board can reach, the board
    // doesn't start on it, and a wrong one (one handle a step off) is refused and told why.
    const c = s.chartBoard, rights = [s.interaction.correctAnswer].flat().map(String)
    dragged.push(`chart ${rights.join(' or ')}`)
    for (const right of rights) { assert.ok(checkAnswer(s.interaction, right), `${s.id} accepts ${right}`); assert.equal(s.diagnose(right), null, `${s.id}: no slip message on ${right}`) }
    const start = c.mode === 'scatter' ? c.from : c.values
    assert.ok(start, `${s.id}: the board says where it starts`)
    assert.ok(!rights.includes(chartValue(c, start)), `${s.id}: doesn't start on the answer`)
    if (c.mode === 'bars' || c.mode === 'line') for (const right of rights) right.split(',').map(Number).forEach(n => assert.ok(n >= 0 && n <= c.max && Math.abs(n / (c.snap ?? 1) - Math.round(n / (c.snap ?? 1))) < 1e-9, `${s.id}: the board can reach ${n}`))
    if (c.mode === 'pie') { const total = c.values.reduce((a, b) => a + b, 0), e = c.edge ?? 0; for (const right of rights) assert.ok(Array.from({ length: c.values[e] + c.values[e + 1] + 1 }, (_, n) => chartValue(c, c.values.map((v, k) => k === e ? n : v))).includes(right), `${s.id}: the pie can reach ${right}° (${total} in all)`) }
    const wrong = c.mode === 'scatter' && c.move !== 'line' ? `${Number(rights[0].split(',')[0]) + (c.snap?.[0] ?? 1)},${rights[0].split(',')[1]}` : rights[0].split(',').map((n, k) => k ? n : String(Number(n) + 1)).join(',')
    assert.ok(!checkAnswer(s.interaction, wrong), `${s.id} refuses ${wrong}`)
    assert.ok(s.diagnose(wrong), `${s.id}: says why ${wrong} is wrong`)
    assert.ok(s.hint && model?.kind === 'method-worked', `${s.id}: has a hint and its working`)
    continue
  }
  if (s.chartBoard) assert.ok(s.interaction.type === 'continue', `${s.id}: a chart board play screen`)
  if (s.sortBoard) {
    // The sort board: every tile goes to a real place and says why it goes there; a question's answer is where each
    // tile goes, matched against the sorting worked out by hand below, and a wrong sorting names a tile out of place.
    const places = sortPlaces(s.sortBoard).map(p => p.id)
    for (const tile of s.sortBoard.tiles) { assert.ok(places.includes(tile.to), `${s.id}: ${tile.label} goes to a real place`); assert.ok(tile.why, `${s.id}: ${tile.label} says why`) }
    assert.ok(new Set(s.sortBoard.tiles.map(t => t.to)).size >= 2, `${s.id}: the tiles go to more than one place`)
    if (s.sortBoard.kind === 'venn') for (const place of places) assert.ok(s.sortBoard.tiles.filter(t => t.to === place).length <= VENN_SLOTS[place], `${s.id}: room in ${place}`)
    if (s.interaction.type === 'continue') { sorted.push(`play ${sortAnswer(s.sortBoard)}`); continue }
    const right = s.interaction.correctAnswer
    assert.equal(right, sortAnswer(s.sortBoard), `${s.id}: the answer is where each tile goes`)
    sorted.push(right)
    assert.ok(checkAnswer(s.interaction, right), `${s.id} accepts the right sorting`)
    const swapped = s.sortBoard.tiles.map((t, k) => k === 0 ? places.find(p => p !== t.to) : t.to).join(',')
    assert.ok(!checkAnswer(s.interaction, swapped), `${s.id} refuses a tile out of place`)
    assert.equal(s.diagnose(right), null, `${s.id}: no slip message on the right sorting`)
    assert.match(s.diagnose(swapped), new RegExp(`^${s.sortBoard.tiles[0].label} belongs in`), `${s.id}: a wrong sorting names the tile`)
    assert.ok(s.hint && model?.kind === 'method-worked', `${s.id}: has a hint and its working`)
    continue
  }
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
if (spec.answers) {
  assert.deepEqual(sorted, spec.sorts ?? [], 'Every sorting matches the one worked out by hand')
  assert.deepEqual(dragged, spec.drags ?? [], 'Every board answer matches the one worked out by hand')
} else console.log('Sortings:', JSON.stringify(sorted), 'Board answers:', JSON.stringify(dragged))

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
console.log(`${lesson.title}: ${states.length} screens, ${pictures} pictures checked, ${typed.length} answers, ${sorted.length} sortings and ${dragged.length} board answers checked${shelf ? ', hidden on the Probability shelf' : ''}`)

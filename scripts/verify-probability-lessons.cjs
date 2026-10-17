// Checks the Probability and statistics lessons (P1 to P9 in Sunny's revision book, p162–187), given the lesson
// number: node scripts/verify-probability-lessons.cjs 305. Three or four rungs then Review, each with a worked example
// and questions; every picture a measured figure that fits inside its frame, labels included; every typed answer
// matches the one worked out by hand below, is accepted with its unit typed after it (a fraction: in any equal form
// unless the question asks for its simplest), and has slip messages; every wrong choice says why; and the lesson is on the course.
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
  315: { file: 'barChartsLesson', name: 'tutorBarChartsLesson', boards: [], answers: [75, 15, 7000, 21, 18, 36.8, 5],
    drags: ['chart 4,15,12,24,10,10', 'chart 8,14,5,11'] },
  // Syd Aug 22 − Apr 11 = 11; village 6.8 − 0.9 = 5.9 thousand = 5900; rain Feb 210 − May 80 = 130; Ella's scale 0, 10, 20,
  // [40] → 30; review ice creams Tue 45 − Wed 25 = 20; David Sat 9.1 − Sun 5.9 = 3.2. Boards: Syd 11,15,18,21,22,17; TVs
  // 1,4,3,4,6; Roger's 2014 point at 700; plant 2,5,9,12,14.
  317: { file: 'lineGraphsLesson', name: 'tutorLineGraphsLesson', boards: [], answers: [11, 5900, 130, 30, 20, 3.2],
    drags: ['chart 11,15,18,21,22,17', 'chart 1,4,3,4,6', 'chart 700', 'chart 2,5,9,12,14'] },
  // Blue 13 ÷ 60 × 360 = 78; cats 14 ÷ 40 × 360 = 126; John D 3 × 15 = 45; red 90 ÷ 360 × 32 = 8; yellow 60 ÷ 360 × 510 = 85;
  // Renault 85 × (600 ÷ 40) = 1275; total 360 × 15 = 5400; Oliver golf 60 ÷ 360 × 12 = 2; Lewis golf 2 ÷ 9 × 360 = 80;
  // class B art 144 ÷ 360 × 20 = 8; review swim 50 ÷ (360 ÷ 72) = 10; school X 60 − school Y 50 = 10. Boards: Brian's
  // green 24 of 60 = 144°; John's A 6 × 15 = 90°; C 10 × 15 = 150°; review dogs 20 of 45 = 160°.
  318: { file: 'pieChartsLesson', name: 'tutorPieChartsLesson', boards: [], answers: [78, 126, 45, 8, 85, 1275, 5400, 2, 80, 8, 10, 10],
    drags: ['chart 144', 'chart 90', 'chart 150', 'chart 160'] },
  // Joe 30 < h ≤ 40: 32, 39, 35, 32, 33, 31, 37, 38 = 8; 20 < h ≤ 30: 21, 22, 25, 27, 28, 30, 25 = 7; cats ≤ 3.5 kg 22 + 14
  // = 36; median of 100 at (100 + 1) ÷ 2 = 50.5; physics above 40 (5 + 3) ÷ 25 = 32%; bike > 10 min 12 × £12.50 = 150;
  // 10 to 21 min (4 + 6)/20 = 1/2; mean 280 ÷ 20 = 14; review over 20 min 9 + 4 = 13, 10 or less 6/30 = 20%.
  // Sorts: 152 160 | 165 170 | 171 180; 9 20 | 25 30 | 32 40 | 46 | 21 in b; review 10 | 14 20 | 27 | 3 a | 21 c.
  // Physics marks tallied 1, 8, 4, 4, 5, 3 (25).
  313: { file: 'groupedFrequencyLesson', name: 'tutorGroupedFrequencyLesson', boards: [], answers: [8, 7, 36, 50.5, 32, 150, '1/2', 14, 13, 20],
    sorts: ['play a,a,b,b,c,c', 'a,a,b,b,c,c,d,b', 'a,b,b,c,a,c'], drags: ['chart 1,8,4,4,5,3'] },
  // Midpoints (4.5 + 6) ÷ 2 = 5.25, 125, 12; cats 438.25 ÷ 117 = 3.7; Adam 1415 ÷ 75 = 18.9; Emily 15 850 ÷ 118 = 134.3;
  // fish without the 6 biggest 2615 ÷ 73 = 35.8; journeys 2443.5 ÷ 116 = 21.1; Suzanna 2225 ÷ 85 = 26.2; Floella in 20s
  // 2190 ÷ 85 = 25.76 → 26; review 140 ÷ 10 = 14, midpoint of 2.5–3.5 = 3. Board: last bar 2 gives (10 + 75 + 50) ÷ 9 = 15.
  314: { file: 'estimatingMeanLesson', name: 'tutorEstimatingMeanLesson', boards: [], answers: [5.25, 125, 12, 3.7, 18.9, 134.3, 35.8, 21.1, 26.2, 26, 14, 3],
    drags: ['chart 2'] },
  // Outlier (6, 85): 6 hours; line through (15, 95) and (95, 15) reads 70 at Maths 40; tea line (0, 95) to (10, 45) reads 65
  // at 6 min; review line (0, 2) to (10, 20) reads 11 at 5. Sort: revision +, tea −, height +, shoe size none, car age −,
  // runners +. Points (180, 86), (8, 55), (6, 14). Rey's least-squares line reads 94.8 at 190 cm (accept 92–98); revision
  // without the outlier reads 78.1 at 22 h (accept 74–82).
  316: { file: 'scatterGraphsLesson', name: 'tutorScatterGraphsLesson', boards: [], answers: [6, 70, 65, 11],
    sorts: ['pos,neg,pos,none,neg,pos'],
    drags: ['chart 180,86', 'chart 8,55', 'chart 98 or 97 or 96 or 95 or 94 or 93 or 92', 'chart 82 or 81 or 80 or 79 or 78 or 77 or 76 or 75 or 74', 'chart 6,14'] },
  // Half a TV 30 ÷ 2 = 15; Riley Tue 4½ × 30 = 135; Alexis Tue 4¼ × 2 = 8.5 km; days ≥ 6 km (4, 8.5, 5, 6, 7) = 3; 55 ÷ 20
  // = 2.75; 14 ÷ 8 = 1.75; ¼ of £20 = 5; over £50 (60, 60, 25, 60, 90, 75) = 5; under £60 = 1/6; review Sat 3½ × 12 − Sun
  // 1¼ × 12 = 27; 15 ÷ 6 = 2.5. Boards in quarters: oranges 8, 9, 5, 8 ÷ 2; butterflies RA 180, SSB 120, BH 240, WW 90 ÷ 40;
  // Gary 28, 32, 16, 24 ÷ 8; review cakes 12, 20, 6, 18 ÷ 8.
  310: { file: 'pictogramsLesson', name: 'tutorPictogramsLesson', boards: [], answers: [15, 135, 8.5, 3, 2.75, 1.75, 5, 5, '1/6', 27, 2.5],
    drags: ['chart 16,18,10,16', 'chart 18,12,24,9', 'chart 14,16,8,12', 'chart 6,10,3,9'] },
  // 16 | 5 = 165 cm; 3 | 7 = 3.7 kg; Ramona mode 32; Wallace under 20: 8 of 15 = 53.3%; Jamal 9th of 17 = 19; over 25: 7/17
  // = 0.4; calves 2740 ÷ 24 = 114; Spanish mode 57; ranges 57 − 45 = 12; medians (65 − 60) ÷ 60 = 8%; review median 23,
  // range 34 − 12 = 22. Sorted by tens digit: Scott (play), Kim, review.
  311: { file: 'stemLeafLesson', name: 'tutorStemLeafLesson', boards: [], answers: [165, 3.7, 32, 53.3, 19, 0.4, 114, 57, 12, 8, 23, 22],
    sorts: ['play s15,s18,s17,s15,s16,s16,s18,s19', 's3,s1,s2,s3,s3,s2,s1,s2,s3,s3,s4,s4', 's2,s4,s3,s2,s4,s3'] },
  // 66 − (30 + 21 + 5 + 7) = 3; not Gemma 24/32 = 3/4; shoe mode 5.5; bathrooms median 33.5th = 2; goals 102 ÷ 50 = 2.04 → 2;
  // sharks x + y = 240 − 132 = 108; mode 2; median 120.5th (117 up to 2) = 3; mean 628 ÷ 240 = 2.62 → 3; review 45 ÷ 20 = 2.25,
  // median 10.5th = 2. Boards: votes A4 D6 E4 G8 L3 S5 T2 (32); x, y = 108 ÷ 12 × 7, × 5 = 63, 45; dice 2, 1, 3, 4, 1, 1.
  312: { file: 'frequencyTablesLesson', name: 'tutorFrequencyTablesLesson', boards: [], answers: [3, '3/4', 5.5, 2, 2, 108, 2, 3, 3, 2.25, 2],
    drags: ['chart 4,6,4,8,3,5,2', 'chart 63,45', 'chart 2,1,3,4,1,1'] },
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
      // A picture with its own thin margin grows to fit a label past its edge, so a little past it is fine.
      const q = at(item.at), x = q.x + (item.dx ?? 0), y = q.y + (item.dy ?? 0), half = item.text.length * (item.small ? 3.75 : 4.5), m = f.figure.pad === undefined ? 4 : 30
      assert.ok(x - half > -m && x + half < 320 + m && y > 12 - m && y < 210 + m, `${where}: label "${item.text}" inside the frame (${x.toFixed(0)}, ${y.toFixed(0)})`)
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

// ---------- On the course: the Probability and statistics chapter, after Ratio (Sunny, 11 Oct) ----------
assert.ok(require('../src/features/maths/courseRegistry.ts').mathsLessons.some(entry => entry.number === number), `Lesson ${number} is on the course`)
if (shelf) {
  assert.ok(shelf.probabilityLessons.some(l => l.number === number), `Lesson ${number - 300} is on the Probability shelf`)
}
console.log(`${lesson.title}: ${states.length} screens, ${pictures} pictures checked, ${typed.length} answers, ${sorted.length} sortings and ${dragged.length} board answers checked, on the course`)

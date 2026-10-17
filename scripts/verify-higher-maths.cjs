// Checks Higher Maths (src/features/maths/tier.ts): Foundation is untouched, Higher adds its sections before each
// lesson's Review, 2H after Lesson 2 and 11H after Lesson 11, every screen points on to the next, every working follows the explanation
// style (step-working-check.cjs) and ends on the question's answer, and every question accepts its own answer.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')

const root = path.resolve(__dirname, '..')
const ts = require(path.join(root, 'node_modules/typescript'))
const resolve = Module._resolveFilename
Module._resolveFilename = function (request, parent, ...rest) {
  try { return resolve.call(this, request, parent, ...rest) } catch (error) {
    for (const ext of ['.ts', '.tsx']) { try { return resolve.call(this, request + ext, parent, ...rest) } catch {} }
    throw error
  }
}
for (const ext of ['.ts', '.tsx']) {
  require.extensions[ext] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: 1, target: 99, jsx: 4, esModuleInterop: true } }).outputText, file)
}
require.extensions['.css'] = () => {}

const { mathsChapters } = require(path.join(root, 'src/features/maths/courseRegistry.ts'))
const tier = require(path.join(root, 'src/features/maths/tier.ts'))
const { checkAnswer } = require(path.join(root, 'src/features/number-types/lessonMath.ts'))
const { checkStepWorking } = require('./step-working-check.cjs')

// Foundation gets the course exactly as authored.
assert.equal(tier.mathsChaptersForTier('foundation'), mathsChapters, 'Foundation chapters are the course’s own')
for (const chapter of mathsChapters) for (const entry of chapter.lessons) assert.equal(tier.forTier(entry, 'foundation'), entry, `${entry.lessonId} unchanged on Foundation`)
assert.equal(tier.parseLessonParam('11H', 'foundation'), null, '11H does not open on Foundation')

// Higher: 11, 11H, then the rest of Number; the Higher sections sit inside 11, 12 and 13.
const number = tier.mathsChaptersForTier('higher').find(chapter => chapter.id === 'number')
const ids = number.lessons.map(entry => entry.lessonId)
assert.equal(ids[ids.indexOf('L011-H') + 1], 'L011H', '11H follows Lesson 11')
for (const id of ['L012-H', 'L013-H']) assert.ok(ids.includes(id), `${id} is on Higher`)
const recurring = number.lessons.find(entry => entry.lessonId === 'L011H')
assert.equal(recurring.label, '11H')
assert.equal(tier.parseLessonParam('11h', 'higher'), 11.5)
assert.equal(tier.lessonParam(11.5), '11H')
assert.equal(number.lessons[ids.indexOf('L002H') - 1].number, 2, '2H follows Lesson 2')
assert.equal(number.lessons.find(entry => entry.lessonId === 'L002H').label, '2H')
assert.equal(tier.parseLessonParam('2H', 'higher'), 2.5)
assert.equal(tier.parseLessonParam('2H', 'foundation'), null, '2H does not open on Foundation')

// Algebra: 3H, 4H and 5H follow Powers and roots, Expanding brackets and Factorising, as in the book (A3, A5, A7);
// Rearranging, Factorising quadratics and Solving quadratics have Higher sections.
const algebra = tier.mathsChaptersForTier('higher').find(chapter => chapter.id === 'algebra')
const algebraIds = algebra.lessons.map(entry => entry.lessonId)
for (const [after, id, label, number] of [['L016', 'L016H', '3H', 16.5], ['L017', 'L017H', '4H', 17.5], ['L018', 'L018H', '5H', 18.5]]) {
  assert.equal(algebraIds[algebraIds.indexOf(after) + 1], id, `${id} follows ${after}`)
  assert.equal(algebra.lessons.find(entry => entry.lessonId === id).label, label)
  assert.equal(tier.parseLessonParam(label, 'higher'), number)
  assert.equal(tier.parseLessonParam(label, 'foundation'), null, `${label} does not open on Foundation`)
}
for (const id of ['L020-H', 'L021-H', 'L022-H', 'L023-H', 'L025-H', 'L027-H', 'L028-H']) assert.ok(algebraIds.includes(id), `${id} is on Higher`)
// Pages 68 to 99: 8H Algebraic fractions after Factorising quadratics; 9H The quadratic formula and 9H2 Completing the
// square after Solving quadratics (two Higher lessons after one lesson: the second is "9H2"); 12H Iterative methods.
for (const [after, id, label, number] of [['L021-H', 'L021H', '8H', 21.5], ['L022-H', 'L022H', '9H', 22.5], ['L022H', 'L022H2', '9H2', 22.6], ['L025-H', 'L025H', '12H', 25.5]]) {
  assert.equal(algebraIds[algebraIds.indexOf(after) + 1], id, `${id} follows ${after}`)
  assert.equal(algebra.lessons.find(entry => entry.lessonId === id).label, label)
  assert.equal(tier.parseLessonParam(label, 'higher'), number)
  assert.equal(tier.parseLessonParam(label.toLowerCase(), 'higher'), number)
  assert.equal(tier.lessonParam(number), label)
  assert.equal(tier.parseLessonParam(label, 'foundation'), null, `${label} does not open on Foundation`)
}

// Pages 100 to 131: 15H Functions after Function machines; in Graphs, 4H Circle graphs after Parallel lines and 6H,
// 6H2 and 6H3 after Quadratic and cubic graphs. A Graphs label repeats an Algebra one, so its address is "GR4H".
for (const [after, id, label, number] of [['L029', 'L029H', '15H', 29.5]]) {
  assert.equal(algebraIds[algebraIds.indexOf(after) + 1], id, `${id} follows ${after}`)
  assert.equal(algebra.lessons.find(entry => entry.lessonId === id).label, label)
  assert.equal(tier.parseLessonParam(label, 'higher'), number)
  assert.equal(tier.lessonParam(number), label)
}
const graphs = tier.mathsChaptersForTier('higher').find(chapter => chapter.id === 'graphs')
const graphIds = graphs.lessons.map(entry => entry.lessonId)
for (const [after, id, label, address, number] of [['L104-H', 'L104H', '4H', 'GR4H', 104.5], ['L106-H', 'L106H', '6H', 'GR6H', 106.5], ['L106H', 'L106H2', '6H2', 'GR6H2', 106.6], ['L106H2', 'L106H3', '6H3', 'GR6H3', 106.7]]) {
  assert.equal(graphIds[graphIds.indexOf(after) + 1], id, `${id} follows ${after}`)
  assert.equal(graphs.lessons.find(entry => entry.lessonId === id).label, label)
  assert.equal(tier.lessonParam(number), address)
  assert.equal(tier.parseLessonParam(address, 'higher'), number)
  assert.equal(tier.parseLessonParam(address.toLowerCase(), 'higher'), number)
  assert.equal(tier.parseLessonParam(address, 'foundation'), null, `${address} does not open on Foundation`)
}
assert.equal(tier.parseLessonParam('4H', 'higher'), 17.5, '4H is still Algebra’s triple brackets')
for (const id of ['L101-H', 'L104-H', 'L105-H', 'L106-H']) assert.ok(graphIds.includes(id), `${id} is on Higher`)
// Pages 132 to 163: 8H Velocity–time graphs after Real-life graphs (which has a Higher section on rates on a curve),
// and a Higher section on proportion with k in Ratio's Direct and inverse proportion.
assert.equal(graphIds[graphIds.indexOf('L108-H') + 1], 'L108H', '8H follows Real-life graphs')
assert.equal(graphs.lessons.find(entry => entry.lessonId === 'L108H').label, '8H')
assert.equal(tier.lessonParam(108.5), 'GR8H')
assert.equal(tier.parseLessonParam('gr8h', 'higher'), 108.5)
assert.equal(tier.parseLessonParam('GR8H', 'foundation'), null, 'GR8H does not open on Foundation')
assert.ok(tier.mathsChaptersForTier('higher').find(chapter => chapter.id === 'ratio').lessons.some(entry => entry.lessonId === 'L031-H'), 'L031-H is on Higher')

// Pages 164 to 195: 8H Circle theorems after Perimeter, before Sectors and arcs (GM8H); Higher sections on ½ab sin C in
// Areas of shapes, the angle from a sector's area in Sectors and arcs, and the congruence tests in Congruent shapes.
const geometry = tier.mathsChaptersForTier('higher').find(chapter => chapter.id === 'geometry')
const geometryIds = geometry.lessons.map(entry => entry.lessonId)
assert.equal(geometryIds[geometryIds.indexOf('L208') + 1], 'L208H', '8H follows Perimeter')
assert.equal(geometryIds[geometryIds.indexOf('L208H') + 1], 'L209-H', 'Sectors and arcs follows 8H')
assert.equal(geometry.lessons.find(entry => entry.lessonId === 'L208H').label, '8H')
assert.equal(tier.lessonParam(208.5), 'GM8H')
assert.equal(tier.parseLessonParam('gm8h', 'higher'), 208.5)
assert.equal(tier.parseLessonParam('GM8H', 'foundation'), null, 'GM8H does not open on Foundation')
for (const id of ['L206-H', 'L209-H', 'L210-H']) assert.ok(geometryIds.includes(id), `${id} is on Higher`)

// Pages 196 to 227: Higher sections on area and volume scale factors in Similar shapes and negative scale factors in
// The four transformations; 12H Invariant points after The four transformations (GM12H) and 15H Frustums after
// Surface area (GM15H).
for (const id of ['L211-H', 'L212-H']) assert.ok(geometryIds.includes(id), `${id} is on Higher`)
assert.equal(geometryIds[geometryIds.indexOf('L212-H') + 1], 'L212H', '12H follows The four transformations')
assert.equal(geometryIds[geometryIds.indexOf('L215') + 1], 'L215H', '15H follows Surface area')
assert.equal(geometry.lessons.find(entry => entry.lessonId === 'L212H').label, '12H')
assert.equal(geometry.lessons.find(entry => entry.lessonId === 'L215H').label, '15H')
assert.equal(tier.lessonParam(212.5), 'GM12H')
assert.equal(tier.lessonParam(215.5), 'GM15H')
assert.equal(tier.parseLessonParam('gm15h', 'higher'), 215.5)
assert.equal(tier.parseLessonParam('GM12H', 'foundation'), null, 'GM12H does not open on Foundation')
// Pages 258 to 287: 14H Box plots and 14H2 Cumulative frequency after Estimating the mean, and 15H Histograms after
// Bar charts (P14H, P14H2 and P15H). The Foundation statistics lessons get no Higher sections.
const probability = tier.mathsChaptersForTier('higher').find(chapter => chapter.id === 'probability')
const probabilityIds = probability.lessons.map(entry => entry.lessonId)
for (const [after, id, label, number, address] of [['L314', 'L314H', '14H', 314.5, 'P14H'], ['L314H', 'L314H2', '14H2', 314.6, 'P14H2'], ['L315', 'L315H', '15H', 315.5, 'P15H']]) {
  assert.equal(probabilityIds[probabilityIds.indexOf(after) + 1], id, `${id} follows ${after}`)
  assert.equal(probability.lessons.find(entry => entry.lessonId === id).label, label)
  assert.equal(tier.lessonParam(number), address)
  assert.equal(tier.parseLessonParam(address.toLowerCase(), 'higher'), number)
  assert.equal(tier.parseLessonParam(address, 'foundation'), null, `${address} does not open on Foundation`)
}
assert.equal(probabilityIds[probabilityIds.indexOf('L314H2') + 1], 'L315', 'Bar charts follows 14H2')

let screens = 0
const problems = []
for (const entry of tier.mathsLessonsForTier('higher').filter(item => item.higherOnly || item.sections.some(section => section.higher))) {
  const states = entry.definition.states
  const label = entry.lessonId
  assert.equal(new Set(states.map(state => state.id)).size, states.length, `${label}: screen ids are unique`)
  states.forEach((state, i) => assert.equal(state.transition.onComplete, states[i + 1]?.id, `${label}: ${state.id} goes on to the next screen`))
  const review = states.findIndex(state => state.microSkillId === 'mixed')
  assert.ok(review === states.length - 1, `${label}: the Review is last`)
  for (const state of states) {
    const higher = entry.higherOnly || entry.sections.find(section => section.id === state.microSkillId)?.higher
    if (!higher || state.microSkillId === 'mixed') continue
    screens++
    const name = `${label} ${state.id}`
    try {
    const working = state.working ?? (state.visual.kind === 'step-worked' ? state.visual : null)
    if (state.visual.kind === 'text') { assert.ok(state.interaction.type === 'continue' || working, `${name}: a question has its working`) }
    if (working) {
      const { answer } = checkStepWorking(working, name)
      if (state.interaction.type !== 'continue') assert.equal(answer, state.feedback.correct.workedExplanation.answer, `${name}: the working ends on the answer`)
    }
    const interaction = state.interaction
    if (interaction.type === 'select') {
      const right = interaction.options[Number(interaction.correctAnswer)]
      assert.equal(right.label, state.feedback.correct.workedExplanation.answer, `${name}: the right option is the answer`)
      assert.equal(new Set(interaction.options.map(option => option.label)).size, interaction.options.length, `${name}: options differ`)
    } else if (interaction.type !== 'continue') {
      assert.ok(checkAnswer(interaction, String(interaction.correctAnswer)), `${name}: accepts its own answer`)
    }
    } catch (error) { problems.push(error.message.split('\n')[0]) }
  }
}
assert.deepEqual(problems, [], `Higher screens:\n${problems.join('\n')}`)
// Estimates: anything on the right side of halfway is accepted, nothing on the wrong side.
const roots = tier.mathsLessonsForTier('higher').find(entry => entry.lessonId === 'L012-H').definition.states.filter(state => state.interaction.acceptanceRule === 'openInterval')
for (const state of roots) assert.ok(!checkAnswer(state.interaction, String((state.interaction.lowerBound + state.interaction.upperBound) / 2 + 0.5)), `${state.id}: rejects the other side`)
// Recurring decimals to fractions: each fraction is the decimal.
const fractions = { '1/3': 1 / 3, '5/11': 0.454545454545, '130/333': 0.390390390390, '1/6': 0.1666666666666, '139/90': 1.544444444444 }
for (const [fraction, value] of Object.entries(fractions)) { const [a, b] = fraction.split('/').map(Number); assert.ok(Math.abs(a / b - value) < 1e-9, fraction) }

// Answers typed in other ways: brackets either way round, a fractional root as a fraction or a decimal, and a surd
// only in its simplest form.
const higherStates = tier.mathsLessonsForTier('higher').flatMap(entry => entry.definition.states)
const byTitle = title => higherStates.find(state => state.content.title.startsWith(title))
assert.ok(checkAnswer(byTitle('Factorise 3x² − 11x + 6').interaction, '(x − 3)(3x − 2)'), 'brackets in either order')
assert.ok(!checkAnswer(byTitle('Factorise 3x² − 11x + 6').interaction, '(3x − 3)(x − 2)'), 'wrong brackets rejected')
const fractionRoot = byTitle('Solve 2x² + 5x − 3 = 0')
for (const typed of ['1/2, -3', '-3, 0.5', '−3, 1/2']) assert.ok(checkAnswer(fractionRoot.interaction, typed), `root typed ${typed}`)
assert.ok(!checkAnswer(fractionRoot.interaction, '1, 2, -3'), 'a split fraction is not a root')
assert.ok(checkAnswer(byTitle('Write √75').interaction, '5, 3'), '5√3')
assert.ok(!checkAnswer(byTitle('Write √75').interaction, '1, 75'), '√75 is not simplest form')

// A gradient read from a tangent, or an area from strips, is an estimate: near answers pass, far ones don't.
for (const title of ['The graph shows the velocity of a rocket', 'A tangent is drawn on the runner', 'The speed–time graph shows a race car', 'The speed–time graph shows a motorcycle']) {
  const state = byTitle(title)
  assert.equal(state.interaction.acceptanceRule, 'openInterval', `${title}: an estimate`)
  assert.ok(checkAnswer(state.interaction, String(state.interaction.correctAnswer * 1.05)), `${title}: a near answer passes`)
  assert.ok(!checkAnswer(state.interaction, String(state.interaction.correctAnswer * 1.5)), `${title}: a far answer fails`)
}
assert.ok(checkAnswer(byTitle('F is inversely proportional').interaction, '3.125'))
assert.ok(checkAnswer(byTitle('The time t, in minutes').interaction, '320/s²'), 'k/s² typed with ²')
assert.ok(!checkAnswer(byTitle('The time t, in minutes').interaction, '320/s'), 'not k/s')
assert.ok(checkAnswer(byTitle('x is directly proportional to y').interaction, '0.25y'), 'x = 0.25y')

console.log(`Higher Maths: ${screens} Higher screens checked; Foundation unchanged.`)

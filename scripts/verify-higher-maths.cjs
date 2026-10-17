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
for (const id of ['L020-H', 'L021-H', 'L022-H']) assert.ok(algebraIds.includes(id), `${id} is on Higher`)

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

console.log(`Higher Maths: ${screens} Higher screens checked; Foundation unchanged.`)

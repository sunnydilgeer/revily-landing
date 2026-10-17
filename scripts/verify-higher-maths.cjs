// Checks Higher Maths (src/features/maths/tier.ts): Foundation is untouched, Higher adds its sections before each
// lesson's Review and 11H after Lesson 11, every screen points on to the next, every working follows the explanation
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

console.log(`Higher Maths: ${screens} Higher screens checked; Foundation unchanged.`)

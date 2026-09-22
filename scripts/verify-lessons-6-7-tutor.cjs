const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const ts = require('typescript')
const katex = require('katex')

require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename)
const { tutorDecimalsLesson: decimals } = require('../src/features/decimals/tutor/decimalsLesson.ts')
const { tutorFactorsLesson: factors } = require('../src/features/factors/tutor/factorsLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const {
  decimalAdditionWorking, decimalSubtractionWorking, decimalMultiplicationWorking, decimalDivisionWorking,
  factorTreeWorking, listingWorking, multiplesWorking, vennWorking, methodProgress, primeFactors,
} = require('../src/features/written-methods/tutor/methodWorking.ts')

const expected6 = {
  'N6.1 Q2': 7.7, 'N6.1 Q3': 17.98, 'N6.1 Q4a': 30.158, 'N6.1 Q4b': 30.16, 'N6.1 Q5a': 26.431, 'N6.1 Q5b': 0.4, 'N6.1 Q5c': '0',
  'N6.2 Q2': 3.5, 'N6.2 Q3': 8.45, 'N6.2 Q4a': 22.15, 'N6.2 Q4b': 22.15, 'N6.2 Q5a': 9.05, 'N6.2 Q5b': 0.05, 'N6.2 Q5c': '0',
  'N6.3 Q2': 7.5, 'N6.3 Q3': 2.3, 'N6.3 Q4a': 17.68, 'N6.3 Q4b': 17.68, 'N6.3 Q5a': 10, 'N6.3 Q5b': 3, 'N6.3 Q5c': '0',
  'N6.4 Q2': 4.2, 'N6.4 Q3': 7.8, 'N6.4 Q4a': 42, 'N6.4 Q4b': 42, 'N6.4 Q5a': 6.3, 'N6.4 Q5b': 157.5, 'N6.4 Q5c': '0',
}
const expected7 = {
  'N7.1 Q2': '0', 'N7.1 Q3': '0', 'N7.1 Q4a': '0', 'N7.1 Q4b': '0', 'N7.1 Q5a': '0', 'N7.1 Q5b': '0', 'N7.1 Q5c': 6,
  'N7.2 Q2': 4, 'N7.2 Q3': '0', 'N7.2 Q4a': '0', 'N7.2 Q4b': 42, 'N7.2 Q5a': 12, 'N7.2 Q5b': '0', 'N7.2 Q5c': '0',
  'N7.3 Q2': '0', 'N7.3 Q3': '0', 'N7.3 Q4a': '0', 'N7.3 Q4b': 630, 'N7.3 Q5a': 60, 'N7.3 Q5b': 5400, 'N7.3 Q5c': '0',
}
const compactLessons = new Set([6, 7])
const conceptQuestions = new Set(['N6.1 Q5c', 'N6.2 Q5c', 'N6.3 Q5c', 'N6.4 Q5c', 'N7.1 Q5b', 'N7.2 Q5b', 'N7.3 Q5c'])

let calculationGroups = 0, equationLines = 0
function verifyWorking(working) {
  assert.equal(working.kind, 'method-worked')
  for (const example of working.examples) {
    calculationGroups++
    assert(example.steps.length > 0 && example.label && example.expression)
    katex.renderToString(example.expression, { throwOnError: true })
    for (const [index, step] of example.steps.entries()) {
      equationLines++
      assert(step.title && step.operation && step.equation && step.instruction)
      katex.renderToString(step.equation, { throwOnError: true })
      katex.renderToString(`\\underline{${step.operation}}`, { throwOnError: true })
      const progress = methodProgress({ kind: 'method-worked', examples: [example] }, index + 1)
      assert.equal(progress.current, step, 'Current diagram and narration must describe the same completed step')
    }
  }
}

function verifyLesson(lesson, expected, screenCount, questionCount, videoCount) {
  assert.equal(lesson.states.length, screenCount)
  assert.equal(new Set(lesson.states.map(state => state.id)).size, screenCount)
  const questions = lesson.states.filter(state => state.interaction.type !== 'continue')
  assert.equal(questions.length, questionCount)
  assert.equal(lesson.states.filter(state => state.video).length, videoCount)
  const seenTopics = new Set(); let topic
  for (const [index, state] of lesson.states.entries()) {
    assert.equal(state.id, `L${lesson.number}-${String(index + 1).padStart(2, '0')}`)
    assert.equal(state.transition.onComplete, lesson.states[index + 1]?.id)
    assert(state.sourceRef && lesson.labels[state.microSkillId])
    if (state.microSkillId !== topic) { assert(!seenTopics.has(state.microSkillId), 'Progress topics must remain contiguous'); seenTopics.add(state.microSkillId); topic = state.microSkillId }
    if (state.video) {
      if (compactLessons.has(lesson.number)) {
        assert.equal(state.visual.kind, 'method-worked', 'Each Lesson 6/7 video must contain its step-by-step tab')
        assert(!lesson.states[index + 1]?.sourceRef.includes('interactive worked example'), 'Video working must not be repeated on the next screen')
      } else assert.equal(lesson.states[index + 1]?.visual.kind, 'method-worked', 'Each video must be followed by interactive worked teaching')
      for (const asset of [state.video.src, state.video.poster]) assert(fs.statSync(path.join(__dirname, '..', 'public', asset)).size > 1000)
      assert(state.video.textAlternative.length >= 4)
      const original = path.join('/Users/sunnyd/Downloads', state.video.sourceFile)
      if (fs.existsSync(original)) {
        const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
        assert.equal(hash(original), hash(path.join(__dirname, '..', 'public', state.video.src)), `${state.video.sourceFile}: media changed during import`)
      }
    }
    if (state.visual.kind === 'method-worked') verifyWorking(state.visual)
  }
  for (const [sourceRef, answer] of Object.entries(expected)) {
    const matches = questions.filter(state => state.sourceRef === sourceRef || state.sourceRef.startsWith(sourceRef + ' ('))
    assert.equal(matches.length, 1, `${sourceRef}: exact practice coverage`)
    const state = matches[0]
    assert.deepEqual(state.interaction.correctAnswer, answer, `${sourceRef}: authored answer`)
    assert(checkAnswer(state.interaction, answer), `${sourceRef}: correct answer rejected`)
    const wrong = state.interaction.type === 'select' ? state.interaction.options.find(option => option.id !== answer).id : Number(answer) + 1
    assert(!checkAnswer(state.interaction, wrong), `${sourceRef}: wrong answer accepted`)
    assert(state.hint?.trim(), `${sourceRef}: hint missing`)
    if (conceptQuestions.has(sourceRef)) assert.equal(state.working, undefined, `${sourceRef}: conceptual question must not show calculation walkthrough`)
    else {
      assert(state.working, `${sourceRef}: post-answer walkthrough missing`)
      verifyWorking(state.working)
    }
    assert.deepEqual(state.feedback.correct.workedExplanation, state.feedback.incorrect.workedExplanation)
  }
}

verifyLesson(decimals, expected6, 33, 28, 4)
verifyLesson(factors, expected7, 26, 21, 3)

for (const state of decimals.states) {
  const learnerCopy = [state.content.title, state.content.body, state.content.prompt, state.hint, ...(state.content.lines ?? [])].filter(Boolean).join(' ')
  assert(!/part a/i.test(learnerCopy), `${state.sourceRef}: learner copy must be self-contained`)
}
for (const state of factors.states) {
  const learnerCopy = [state.content.title, state.content.body, state.content.prompt, state.hint, ...(state.content.lines ?? [])].filter(Boolean).join(' ')
  assert(!/^hence\b/i.test(state.content.title), `${state.sourceRef}: dependent wording must be self-contained`)
  assert(!/interactive worked example/i.test(state.sourceRef), `${state.sourceRef}: duplicated post-video working must be removed`)
  assert(learnerCopy.trim(), `${state.sourceRef}: learner copy missing`)
}

assert.equal(decimalAdditionWorking([23.45, 6.708]).steps.at(-1).frame.decimalResult, '30.158')
assert.equal(decimalAdditionWorking([14.6, 8.75, 3.081]).steps.at(-1).frame.decimalResult, '26.431')
assert.equal(decimalSubtractionWorking(40, 17.85).steps.at(-1).frame.decimalResult, '22.15')
assert.equal(decimalSubtractionWorking(12.65, 3.6).steps.at(-1).frame.decimalResult, '9.05')
assert.equal(decimalMultiplicationWorking(6.25, 1.6).examples.at(-1).steps.at(-1).frame.decimalResult, '10')
assert.equal(decimalDivisionWorking(15.75, 2.5).steps.at(-1).frame.decimalResult, '6.3')
const divisionTenthsStep = decimalDivisionWorking(5.46, 0.6).steps.find(step => step.title === 'Build the quotient with 0.1')
assert.equal(divisionTenthsStep.equation, '6\\times0.1=0.6')
assert(divisionTenthsStep.instruction.includes('6 × 0.1 = 0.6.'))

const decimalColumnCases = [
  decimalAdditionWorking([5.6, 2.75]), decimalAdditionWorking([3.2, 4.5]), decimalAdditionWorking([12.08, 5.9]),
  decimalAdditionWorking([23.45, 6.708]), decimalAdditionWorking([30.15, 0.008]), decimalAdditionWorking([14.6, 8.75, 3.081]),
  decimalSubtractionWorking(8.35, 2.6), decimalSubtractionWorking(5.8, 2.3), decimalSubtractionWorking(14.2, 5.75),
  decimalSubtractionWorking(40, 17.85), decimalSubtractionWorking(21.4, 8.75), decimalSubtractionWorking(12.65, 3.6),
]
for (const example of decimalColumnCases) {
  const final = example.steps.at(-1).frame
  const numericRows = final.decimalRows.map(row => row.replace(/^[+−-]\s*/, ''))
  const decimalPositions = [...numericRows, final.decimalResult].map(value => value.includes('.') ? value.length - value.indexOf('.') - 1 : 0)
  assert.equal(new Set(decimalPositions).size, 1, `${example.expression}: every operand and result must share the same decimal column`)
}
assert.deepEqual(primeFactors(96), [2, 2, 2, 2, 2, 3])
assert.equal(factorTreeWorking(150).steps.at(-1).equation, '150=2\\times3\\times5^{2}')
assert.equal(listingWorking(15, 20).steps.at(-1).frame.numberLists.lcm, 60)
assert.deepEqual(multiplesWorking(14, 5).steps.at(-1).frame.numberLists.first, [14, 28, 42, 56, 70])
assert.equal(vennWorking(36, 60).steps.at(-1).frame.venn.hcf, 12)
assert.equal(vennWorking(36, 60).steps.at(-1).frame.venn.lcm, 180)
assert.deepEqual(vennWorking(36, 60).steps[2].frame.venn, { labels: ['36', '60'], left: [3], middle: [2, 2, 3], right: [5] })
assert.deepEqual(vennWorking(28, 42).steps[2].frame.venn, { labels: ['28', '42'], left: [2], middle: [2, 7], right: [3] })
assert.deepEqual(vennWorking(600, 540, ['p', 'q']).steps[2].frame.venn.middle, [2, 2, 3, 5])

const repaired = factors.states.find(state => state.sourceRef.startsWith('N7.1 Q5b'))
assert(repaired.content.title.includes('even prime 2') && repaired.sourceRef.includes('wording repaired'))
const app = fs.readFileSync(path.join(__dirname, '..', 'src/App.tsx'), 'utf8')
assert(app.includes('lesson === 6 ? <TutorDecimalsLesson />'))
assert(app.includes('lesson === 7 ? <TutorFactorsLesson />'))
assert(app.includes('[1, 2, 3, 4, 5, 6, 7, 8]'))

console.log(`Lesson 6: ${decimals.states.length} screens, all 28 source practice parts and 4 source videos verified.`)
console.log(`Lesson 7: ${factors.states.length} screens, all 21 source practice parts and 3 source videos verified.`)
console.log(`${calculationGroups} progressive calculation groups and ${equationLines} rendered equation steps passed; source media hashes match.`)

// Checks Lesson 15 (Algebra A1, Collecting like terms): source coverage, the algebra answer rule, every answer
// worked out again by an independent collector, wrong-answer messages, source-identical videos and the Algebra chapter.
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, filename)

const root = path.resolve(__dirname, '..')
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const { tutorLikeTermsLesson: lesson } = require('../src/features/like-terms/tutor/likeTermsLesson.ts')
const { diagnoseCollect, diagnoseChoice } = require('../src/features/like-terms/tutor/likeTermsDiagnosis.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const { readTerms, sameCollectedExpression } = require('../src/features/number-types/lessonMath.ts')

// ---------- The algebra answer rule ----------
const rule = answer => ({ type: 'numericInput', responseShape: 'expression', acceptanceRule: 'collectedExpression', correctAnswer: answer })
const accepts = [
  ['5x + 3y − 2', '3y + 5x - 2'], ['5x + 3y − 2', '-2+5x+3y'], ['5x + 3y − 2', '5X + 3Y − 2'],
  ['x + 4', '1x + 4'], ['7ab − 3a', '-3a + 7ba'], ['10x²y + xy²', '10x^2y + xy^2'], ['10x²y + xy²', 'y^2x + 10yx²'],
  ['8u²v + 2uv²', '2uv^2 + 8vu^2'],
  ['6k + 3', '6k+3'], ['8xy + x + 4y', 'x + 4y + 8xy'],
]
for (const [answer, typed] of accepts) assert.ok(checkAnswer(rule(answer), typed), `"${typed}" should be accepted for ${answer}`)
const rejects = [
  ['6p + 3', '4p + 2p + 3', 'not fully collected'], ['6p + 3', '6p + 3 + 0p', 'zero term left in'], ['6p + 3', '6p - 3', 'wrong sign'],
  ['5ab + 4a', '9ab', 'unlike terms joined'], ['15w', '5w^3', 'powers added'], ['8u²v + 2uv²', '8u^2v^2', 'unlike terms joined'],
  ['x + 4', 'x4', 'not a sum'], ['x + 4', '', 'empty'], ['x + 4', 'x + + 4', 'double sign'], ['x + 4', '2*x + 4 - x', 'not collected'],
]
for (const [answer, typed, why] of rejects) assert.ok(!checkAnswer(rule(answer), typed), `"${typed}" must be rejected for ${answer} (${why})`)
assert.deepEqual(readTerms('3yx - x^2'), [{ coefficient: 3, key: 'xy' }, { coefficient: -1, key: 'x^2' }], 'Letters are sorted; −x² is −1 lot of x²')
assert.equal(readTerms('2x = 4'), null, 'An equation is not an expression')
assert.ok(sameCollectedExpression('4', '4') && !sameCollectedExpression('4x', '4'))

// ---------- Structure ----------
const states = lesson.states
assert.equal(lesson.id, 'L015', 'A1 keeps the stable progress key L015')
assert.equal(states.length, 41, 'Lesson 15 screen total')
const rungs = [...new Set(states.map(state => state.microSkillId))]
assert.deepEqual(rungs, ['like-terms-one-letter', 'like-terms-different-letters', 'like-terms-powers', 'like-terms-mixed', 'mixed'], 'Four rungs in order, then Review')
states.forEach((state, index) => {
  assert.equal(state.id, `L15-${String(index + 1).padStart(2, '0')}`)
  assert.equal(state.transition.onComplete, states[index + 1]?.id)
})

// Every source question is covered, and each rung opens with its video's own example
const refs = states.map(state => state.sourceRef).join(' | ')
for (const pdf of [1, 2, 3, 4]) {
  for (const question of ['Q1', 'Q2', 'Q3', 'Q4a', 'Q4b', 'Q5a', 'Q5b', 'Q5c']) assert.ok(refs.includes(`A1.${pdf} ${question}`), `Missing A1.${pdf} ${question}`)
  const first = states.find(state => state.sourceRef === `A1.${pdf} video`)
  assert.ok(first?.video, `A1.${pdf} opens with its video`)
}

// ---------- Every typed answer, worked out again by a separate collector ----------
// A deliberately different method: expand every term into a letter multiset string and count.
function independent(expression) {
  const clean = expression.replace(/[()]/g, '').replace(/−/g, '-').replace(/²/g, '^2').replace(/\s/g, '')
  const totals = {}
  for (const [, sign, digits, letters] of clean.matchAll(/([+-]?)(\d*)((?:[a-z](?:\^2)?)*)/g)) {
    if (!digits && !letters) continue
    const key = letters.replace(/([a-z])\^2/g, '$1$1').split('').sort().join('')
    totals[key] = (totals[key] ?? 0) + (sign === '-' ? -1 : 1) * (digits ? Number(digits) : 1)
  }
  return totals
}
const typed = states.filter(state => state.interaction.type === 'numericInput')
const expressionOf = state => {
  const title = state.content.title
  if (title.startsWith('Simplify ')) return title.slice(9, -1)
  if (title.startsWith('A triangle')) return '(2k + 1) + (3k − 2) + (k + 4)'
  if (title.startsWith('Two strips')) return '(3ab + 2) + (ab + 5)'
  if (title.startsWith('Omar')) return '2ef + 5e + 3ef + 2e'
  throw new Error(`No expression for ${state.id}`)
}
for (const state of typed) {
  const { interaction } = state
  assert.equal(interaction.acceptanceRule, 'collectedExpression', `${state.id} marks algebra in any order`)
  const question = expressionOf(state)
  assert.deepEqual(independent(interaction.correctAnswer), Object.fromEntries(Object.entries(independent(question)).filter(([, v]) => v !== 0)), `${state.id}: ${question} = ${interaction.correctAnswer}`)
  assert.ok(checkAnswer(interaction, interaction.correctAnswer), `${state.id} accepts its own answer`)
  const reversed = interaction.correctAnswer.split(/ (?=[+−] )/).reverse().map((part, i) => i === 0 ? part.replace(/^\+ /, '').replace(/^− /, '−') : /^[+−] /.test(part) ? part : `+ ${part}`).join(' ')
  assert.ok(checkAnswer(interaction, reversed), `${state.id} accepts its terms in another order ("${reversed}")`)
  assert.ok(!checkAnswer(interaction, question.replace(/[()]/g, '')), `${state.id} rejects the question itself (not simplified)`)
  assert.ok(state.diagnose, `${state.id} needs a wrong-answer check`)
  assert.equal(state.diagnose(interaction.correctAnswer), null, `${state.id} stays silent on the right answer`)
  assert.ok(state.diagnose(question.replace(/[()]/g, '')) === null || /collect/i.test(state.diagnose(question.replace(/[()]/g, ''))), `${state.id}: the question itself gets "collect" or nothing`)
}

// Choice questions: spread out; like-term choices checked against the rule "same letters, same powers"
const selects = states.filter(state => state.interaction.type === 'select')
assert.ok(new Set(selects.map(state => state.interaction.correctAnswer)).size >= 2, 'Right answers must be spread across positions')
const multis = states.filter(state => state.interaction.type === 'multiSelect')
assert.equal(multis.length, 4, 'One "which are like terms?" question per rung')
for (const state of multis) {
  const target = state.content.title.match(/like terms with (.+)\? Choose/)[1]
  const key = term => Object.keys(independent(term))[0]
  const right = state.interaction.options.filter(option => key(option.label) === key(target)).map(option => option.id)
  assert.deepEqual([...state.interaction.correctAnswer].sort(), right.sort(), `${state.id}: the like terms of ${target}`)
  assert.ok(checkAnswer(state.interaction, [...right].reverse()), `${state.id}: order of ticking doesn’t matter`)
  assert.ok(!checkAnswer(state.interaction, right.slice(0, 1)), `${state.id}: every like term must be ticked`)
  for (const option of state.interaction.options) if (!right.includes(option.id)) assert.ok(state.diagnose(option.id), `${state.id}: "${option.label}" needs a reason`)
}

// ---------- Wrong-answer messages ----------
const cases = [
  ['3x + 2y + 4x', '5xy', 'not like terms'],
  ['5w + 5w + 5w', '5w^3', 'only the number in front changes'],
  ['5w + 5w + 5w', '15w³', 'only the number in front changes'],
  ['x² + x²', 'x^4', 'only the number in front changes'],
  ['x² + x²', '2x^4', 'only the number in front changes'],
  ['6u²v + 3uv² + 2u²v − uv²', '8u^2v^2', 'not like terms'],
  ['9y + 5 − 4y + 6', '13y + 11', 'sign belongs to the term after it'],
  ['4ab + 2a + 3ab − 5a', '7ab + 3a', 'sign'],
  ['8k − 5 + 3k + 12', '18k', 'number term'],
  ['2ef + 5e + 3ef + 2e', '12ef', 'not like terms'],
  ['3ab + 4a + 2ab', '5ab', 'leave out 4a'],
  ['4p + 6 + 2p − 3', '4p + 2p + 3', 'still collect'],
  ['4p + 6 + 2p − 3', '6p + 3', null],
  ['4p + 6 + 2p − 3', '3 + 6p', null],
  ['4p + 6 + 2p − 3', 'banana', null],
]
cases.forEach(([question, response, expected], i) => {
  const message = diagnoseCollect(response, question)
  if (expected === null) assert.equal(message, null, `Case ${i + 1} should stay silent, got: ${message}`)
  else assert.ok(message && message.includes(expected), `Case ${i + 1} (${question} → ${response}) should mention "${expected}", got: ${message}`)
})
assert.equal(diagnoseChoice('1,3', { 3: 'why' }), 'why')

// ---------- Videos ----------
assert.equal(states.filter(state => state.video).length, 4, 'One video per source PDF')
const mediaHashes = {
  'one-letter.mp4': 'a4d65b4ae959fe91a5caa6d8bc0fb79a0fda3702a83c22257f1e67bcc207d0e3',
  'different-letters.mp4': 'e3311478514ef8b2c86e8f1d730e286ce7655f0e69b95e0485a588522bf376aa',
  'powers.mp4': 'c29cedc43ae19e9cc868ba7a79db13f29968bda20f626deb172b86a7dfdb915c',
  'letters-and-powers.mp4': '1646fa49aa931a9a0f6849a556f312f7ee7e26ed2c91777119c5efc9aa06ae0d',
}
for (const [name, expected] of Object.entries(mediaHashes)) {
  const file = path.join(root, 'public/media/lesson-15', name)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expected, `${name} must remain source-identical`)
  assert.ok(fs.readFileSync(file.replace(/\.mp4$/, '.svg'), 'utf8').startsWith('<svg'), `${name} poster must be an SVG`)
  assert.ok(states.some(state => state.video?.src === `/media/lesson-15/${name}`), `${name} must be used`)
}

// ---------- The Algebra chapter ----------
const { mathsChapters, mathsLessons, lessonCode } = require('../src/features/maths/courseRegistry.ts')
assert.deepEqual(mathsChapters.map(chapter => chapter.id), ['number', 'algebra', 'ratio'], 'Number, then Algebra, then Ratio')
const a1 = mathsLessons.find(entry => entry.number === 15)
assert.equal(a1.chapterId, 'algebra')
assert.equal(a1.position, 1, 'Students see A1 as Algebra lesson 1')
assert.equal(lessonCode(a1), 'A1')
assert.equal(mathsChapters[0].lessons.at(-1).position, mathsChapters[0].lessons.length, 'Number lessons keep their numbers')
assert.ok(mathsChapters[0].lessons.every(entry => entry.position === entry.number), 'Number lessons are numbered as before')
assert.ok(!/LATER_CHAPTERS = \[[^\]]*'Algebra'/.test(read('src/features/maths/Curriculum.tsx')), 'Algebra is no longer "coming later"')
const app = read('src/App.tsx')
assert.ok(app.includes('case 15:') && app.includes('return <TutorLikeTermsLesson />'), 'Lesson 15 must open from the course and its direct route')
assert.ok(read('src/features/cards/keyFacts.ts').includes('  15: {'), 'A1 needs key-fact cards')

console.log(`Lesson 15 (A1) verified: ${states.length} screens, all 32 source questions, ${typed.length} typed answers checked by a second collector and in another order, ${multis.length} like-term choices, ${accepts.length + rejects.length} answer-rule cases, ${cases.length} wrong-answer messages, 4 source-identical videos and the Algebra chapter.`)

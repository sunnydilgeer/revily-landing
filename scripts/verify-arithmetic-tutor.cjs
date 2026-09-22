const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const ts = require('typescript')
const katex = require('katex')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename)
const { tutorLongMultiplicationLesson: multiplication } = require('../src/features/long-multiplication/tutor/longMultiplicationLesson.ts')
const { tutorLongDivisionLesson: division } = require('../src/features/long-division/tutor/longDivisionLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
const expected = {
  'N5.1 Q2': 213 * 3, 'N5.1 Q3': 246 * 3, 'N5.1 Q4a': 42 * 18, 'N5.1 Q4b': 42 * 18,
  'N5.1 Q5a': 347 * 4, 'N5.1 Q5b': Math.floor((4 * 4 + Math.floor(7 * 4 / 10)) / 10), 'N5.1 Q5c': '0',
  'N4.1 Q2': 84 / 4, 'N4.1 Q3': 138 / 6, 'N4.1 Q4a': { quotient: Math.floor(250 / 8), remainder: 250 % 8 },
  'N4.1 Q4b': Math.ceil(250 / 8), 'N4.1 Q5a': 624 / 8, 'N4.1 Q5b': 624 % 8, 'N4.1 Q5c': '0',
}
function calculation(math) {
  assert.match(math, /^\d+(?:(?:\\times|\\div|\+|-)\d+)*$/)
  const parts = math.split(/([+-])/)
  const termValue = term => {
    const tokens = term.split(/(\\times|\\div)/)
    let product = Number(tokens[0])
    for (let i = 1; i < tokens.length; i += 2) product = tokens[i] === '\\times' ? product * Number(tokens[i + 1]) : product / Number(tokens[i + 1])
    return product
  }
  let result = termValue(parts[0])
  for (let i = 1; i < parts.length; i += 2) result += (parts[i] === '+' ? 1 : -1) * termValue(parts[i + 1])
  return result
}
let records = 0, results = 0
function verifyWorking(working) {
  assert.equal(working.kind, 'method-worked')
  for (const example of working.examples) {
    records++
    assert(example.steps.length && example.expression && example.label)
    katex.renderToString(example.expression, { throwOnError: true })
    for (const step of example.steps) {
      results++
      assert(step.instruction && step.title && step.operation)
      for (const math of [step.equation, `\\underline{${step.operation}}`]) katex.renderToString(math, { throwOnError: true })
      const equation = step.equation.replace(/\\;|\\,/g, '').replace('\\mathrm{r}', 'r')
      if (equation.includes('\\longrightarrow')) {
        const match = /^(\d+)\\div(\d+)\\longrightarrow(\d+)r(\d+)$/.exec(equation)
        assert(match, equation)
        const [, a, d, q, r] = match.map(Number)
        assert.equal(q, Math.floor(a / d)); assert.equal(r, a % d)
      } else {
        const [left, right] = equation.split('=')
        assert.equal(calculation(left), calculation(right), equation)
      }
    }
    const last = example.steps.at(-1).frame
    if (example.method === 'column') {
      assert.equal(Number(last.ones), example.first * (example.second % 10))
      if (example.second >= 10) {
        const zeroStep = example.steps.find(step => step.title === 'Why the second row starts with 0')
        assert.deepEqual(zeroStep.focus, { factorPlace: 1 }, 'Underline only the multiplier tens digit during the zero-start action')
        assert.equal(zeroStep.frame.tens, '0')
        assert.equal(Number(last.tens), example.first * Math.floor(example.second / 10) * 10)
        assert.equal(Number(last.total), example.first * example.second)
      }
    } else if (example.method === 'grid') {
      assert.equal(Object.keys(last.cells).length, 4)
      assert.equal(Object.values(last.cells).reduce((a, b) => a + b), example.first * example.second)
      assert.equal(Number(last.total), example.first * example.second)
    } else {
      assert.equal(Number(last.quotient), Math.floor(example.first / example.second))
      assert.equal(last.remainder, example.first % example.second)
      assert(last.remainder >= 0 && last.remainder < example.second)
    }
  }
}
for (const lesson of [multiplication, division]) {
  assert.equal(lesson.states.length, lesson.number === 4 ? 15 : 13)
  assert.equal(new Set(lesson.states.map(s => s.id)).size, lesson.states.length)
  assert(lesson.states[0].video, 'Each lesson must open on its matching source video')
  assert.equal(lesson.states[1].visual.kind, 'method-worked', 'The video must be followed by interactive worked teaching')
  assert.equal(lesson.states[1].interaction.type, 'continue')
  const seenTopics = new Set(); let topic
  for (const [i, s] of lesson.states.entries()) {
    assert.equal(s.id, `L${lesson.number}-${String(i + 1).padStart(2, '0')}`)
    assert.equal(s.transition.onComplete, lesson.states[i + 1]?.id)
    assert(!s.transition.onCorrect && !s.transition.onIncorrect, 'Either result must take the same sequential route')
    assert(s.sourceRef && lesson.labels[s.microSkillId])
    if (s.microSkillId !== topic) { assert(!seenTopics.has(s.microSkillId), 'Progress sections must be contiguous'); seenTopics.add(s.microSkillId); topic = s.microSkillId }
  }
  const questions = lesson.states.filter(s => s.interaction.type !== 'continue')
  assert.equal(questions.length, 7)
  for (const [source, answer] of Object.entries(expected).filter(([source]) => source.startsWith(lesson.number === 4 ? 'N5.1' : 'N4.1'))) {
    const matches = questions.filter(s => s.sourceRef === source || s.sourceRef.startsWith(source + ' ('))
    assert.equal(matches.length, 1, source + ': exact coverage')
    const s = matches[0], rule = s.interaction
    assert.deepEqual(rule.correctAnswer, answer, source)
    assert(checkAnswer(rule, answer), source + ': correct answer rejected')
    const wrong = rule.type === 'select' ? rule.options.find(o => o.id !== answer).id : rule.type === 'quotientRemainderInput' ? { quotient: answer.quotient, remainder: rule.divisor } : answer + 1
    assert(!checkAnswer(rule, wrong), source + ': wrong answer accepted')
    assert(s.hint?.trim())
    assert(s.working, source + ': missing step-by-step answer calculation')
    verifyWorking(s.working)
    assert.deepEqual(s.feedback.correct.workedExplanation, s.feedback.incorrect.workedExplanation)
    const explanation = s.feedback.correct.workedExplanation
    assert(explanation.steps.length >= 2 && explanation.answer)
    assert(explanation.steps.every(step => step.title && step.lines.length))
    if (rule.type === 'numericInput') {
      for (const value of [` ${answer} `, answer.toLocaleString('en-GB'), Number(answer).toFixed(2)]) assert(checkAnswer(rule, value), value)
      for (const value of ['', 'abc', '1+2', '1,23', 'NaN', 'Infinity']) assert(!checkAnswer(rule, value), value)
    }
    if (rule.type === 'select') for (const option of rule.options) assert.equal(checkAnswer(rule, option.id), option.id === answer)
    if (rule.type === 'quotientRemainderInput') {
      assert.equal(answer.quotient * rule.divisor + answer.remainder, rule.dividend)
      assert(answer.remainder < rule.divisor)
      assert(checkAnswer(rule, { quotient: '31', remainder: '02' }))
      for (const value of [{ quotient: 30, remainder: 10 }, { quotient: 31.25, remainder: 0 }, { quotient: '', remainder: 2 }, { quotient: 31, remainder: -2 }]) assert(!checkAnswer(rule, value))
    }
  }
  const q1 = lesson.states.find(s => s.sourceRef.startsWith(lesson.number === 4 ? 'N5.1 Q1;' : 'N4.1 Q1;'))
  assert(q1?.video && q1.interaction.type === 'continue')
  assert.equal(lesson.states.filter(s => s.video).length, 1)
  for (const s of lesson.states.filter(s => s.video)) {
    for (const asset of [s.video.src, s.video.poster]) assert(fs.statSync(path.join(__dirname, '..', 'public', asset)).size > 1000)
    assert(s.video.durationSeconds > 30 && s.video.textAlternative.length >= 3)
    const original = path.join('/Users/sunnyd/Downloads', s.video.sourceFile)
    if (fs.existsSync(original)) {
      const hash = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
      assert.equal(hash(original), hash(path.join(__dirname, '..', 'public', s.video.src)))
    }
  }
  for (const s of lesson.states.filter(s => s.visual.kind === 'method-worked')) verifyWorking(s.visual)
  console.log(`Lesson ${lesson.number}: ${lesson.states.length} sequential screens, all 7 source practice parts, correct/wrong grading, retained-feedback definitions, hints and bundled media verified.`)
}
assert.equal(34 * 26, 884); assert.equal(246 * 43, 10578); assert.equal(375 / 5, 75)
assert.equal(multiplication.states.find(s => s.video).visual.examples.length, 2)
const app = fs.readFileSync(path.join(__dirname, '..', 'src/App.tsx'), 'utf8')
assert(app.includes('case 4:') && app.includes('return <TutorLongMultiplicationLesson />'))
assert(app.includes('case 5:') && app.includes('return <TutorLongDivisionLesson />'))
for (const legacy of ['divisionVariant', 'multiplicationVariant', 'variantNavigation', 'ShortDivisionLesson']) assert(!app.includes(legacy))
console.log(`${records} separately labelled calculations, ${results} independently recomputed complete calculation lines; canonical arithmetic routes verified.`)

const { columnWorking, divisionWorking, methodProgress } = require('../src/features/written-methods/tutor/methodWorking.ts')
const multiExample = multiplication.states[0].visual
assert.equal(methodProgress(multiExample, 0).current, undefined)
const gridEnd = methodProgress(multiExample, 6)
assert.equal(gridEnd.active, 0, 'Completing one example must not switch to a blank next diagram')
assert.equal(gridEnd.current.equation, '600+180+80+24=884')
assert.equal(gridEnd.working[0].count, 6)
const columnStart = methodProgress(multiExample, 7)
assert.equal(columnStart.active, 1)
assert.equal(columnStart.current.equation, '3\\times6=18')
assert.equal(columnStart.current.frame.ones, '8')
assert.deepEqual(columnStart.current.focus, { topPlace: 0, factorPlace: 0 })
assert.equal(methodProgress(multiExample, 17).current.frame.total, '10578')
for (const lesson of [multiplication, division]) {
  for (const state of lesson.states) {
    for (const visual of [state.visual, state.working].filter(v => v?.kind === 'method-worked')) {
      const steps = visual.examples.flatMap(example => example.steps)
      for (let index = 1; index <= steps.length; index++) {
        const progress = methodProgress(visual, index)
        assert.equal(progress.current, steps[index - 1], 'Diagram/current explanation must use the same completed action')
        assert.equal(progress.completed.length, index)
        const math = progress.current.equation.replace(progress.current.operation, `\\underline{${progress.current.operation}}`)
        katex.renderToString(math, { throwOnError: true })
      }
    }
  }
}
console.log('Video-first openings and synchronised current-step selection passed, including the two-example boundary, Back positions and complete underlined equations.')
const addedExamples = [
  { lesson: multiplication, source: '424 × 28', method: 'column', first: 424, second: 28, ones: 3392, tens: 8480, total: 11872, steps: 11 },
  { lesson: multiplication, source: '291 × 56', method: 'column', first: 291, second: 56, ones: 1746, tens: 14550, total: 16296, steps: 12 },
  { lesson: division, source: '235 ÷ 17', method: 'long-division', first: 235, second: 17, quotient: ' 13', remainder: 14, steps: 9 },
  { lesson: division, source: '289 ÷ 29', method: 'long-division', first: 289, second: 29, quotient: '  9', remainder: 28, steps: 5 },
]
for (const expected of addedExamples) {
  const matches = expected.lesson.states.filter(s => s.sourceRef === `User-added worked example: ${expected.source}`)
  assert.equal(matches.length, 1, expected.source + ': requested example missing/duplicated')
  const state = matches[0]
  assert.equal(state.interaction.type, 'continue', 'Additional worked examples must not replace or add practice questions')
  const [example] = state.visual.examples
  assert.equal(state.visual.examples.length, 1)
  assert.equal(example.method, expected.method); assert.equal(example.first, expected.first); assert.equal(example.second, expected.second)
  assert.equal(example.steps.length, expected.steps)
  const last = example.steps.at(-1).frame
  if (example.method === 'column') for (const key of ['ones', 'tens', 'total']) assert.equal(Number(last[key]), expected[key])
  else { assert.equal(last.quotient, expected.quotient); assert.equal(last.remainder, expected.remainder) }
}
const long17 = division.states.find(s => s.sourceRef.endsWith('235 ÷ 17')).visual.examples[0].steps
assert.deepEqual(long17.map(s => s.title), ['Choose the first group of digits', 'Divide 23 by 17', 'Multiply', 'Subtract', 'Bring down 5', 'Divide 65 by 17', 'Multiply', 'Subtract', 'Read and check the answer'])
assert.deepEqual(long17[3].frame.longRows, [{ number: '17', end: 1, kind: 'subtract' }, { number: '6', end: 1, kind: 'remainder' }])
assert.deepEqual(long17[4].frame.longRows, [{ number: '17', end: 1, kind: 'subtract' }, { number: '65', end: 2, kind: 'bring-down' }])
assert.deepEqual(long17.at(-1).frame.longRows, [{ number: '17', end: 1, kind: 'subtract' }, { number: '65', end: 2, kind: 'bring-down' }, { number: '51', end: 2, kind: 'subtract' }, { number: '14', end: 2, kind: 'remainder' }])
const long29 = division.states.find(s => s.sourceRef.endsWith('289 ÷ 29')).visual.examples[0].steps
assert(long29[1].instruction.includes('29 × 10 = 290 is too big'))
assert.deepEqual(long29.at(-1).frame.longRows, [{ number: '261', end: 2, kind: 'subtract' }, { number: '28', end: 2, kind: 'remainder' }])
console.log('All four user-added worked examples verified, including subtraction/bring-down alignment and both final remainders; all source questions retained.')
const carried = columnWorking(347, 4).steps
assert.deepEqual(carried.map(s => s.frame.ones), ['8', '88', '1388'])
assert.deepEqual(carried.map(s => s.frame.carry?.value), [2, 1, undefined])
const twoRows = columnWorking(246, 43).steps
assert.equal(twoRows.length, 11, 'One useful action per click, without split calculation/result clicks')
assert.deepEqual(twoRows.slice(-4).map(s => s.frame.total), ['8', '78', '578', '10578'])
const bus = divisionWorking(375, 5).steps
assert.equal(bus.length, 4)
assert.deepEqual(bus.slice(0, 3).map(s => s.frame.quotient), [' ', ' 7', ' 75'])
assert.deepEqual(bus.slice(0, 2).map(s => s.frame.divisionCarry), [{ index: 1, value: 3 }, { index: 2, value: 2 }])
for (const [first, second] of [[405, 32], [306, 24], [132, 24]]) verifyWorking({ kind: 'method-worked', examples: [columnWorking(first, second)] })
for (const [first, second] of [[408, 4], [250, 8], [624, 8]]) verifyWorking({ kind: 'method-worked', examples: [divisionWorking(first, second)] })
console.log('Digit placement, repeated carries, internal zeros, cumulative sums, aligned quotient and remainder exchanges passed.')

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
    // One move a step, shown where it comes from: every line's sum is true, and the answer appears once, on the last step.
    for (const [index, step] of example.steps.entries()) {
      for (const line of step.frame.lines ?? []) {
        const text = line.parts.map(part => part.text).join(' ')
        if (line.result === undefined || !/^[\d ×+−]+$/.test(text) || !/^£?[\d,]+$/.test(line.result)) continue
        assert.equal(calculation(text.replace(/ /g, '').replace(/×/g, '\\times').replace(/−/g, '-')), Number(line.result.replace(/[£,]/g, '')), `${example.expression}: ${text} → ${line.result}`)
      }
      const f = step.frame
      const answers = [f.answerRow, f.answerCarry, f.answerWords, ...(f.lines ?? []).map(line => line.answer)].filter(Boolean).length
      assert.equal(answers, index === example.steps.length - 1 ? 1 : 0, `${example.expression} step ${index + 1}: the answer is shown once, by the last move`)
      assert(!/check|the answer/i.test(step.title), `${example.expression}: no separate check or answer step (${step.title})`)
      assert(step.title.split(' ').length <= 4, `${example.expression}: short heading (${step.title})`)
      assert(!/=/.test(step.instruction), `${example.expression}: the ⓘ is words, not sums (${step.instruction})`)
    }
    const last = example.steps.at(-1).frame
    if (last.answerCarry) {
      assert.equal(last.carry.value, Math.floor((Math.floor(example.first / 10) % 10 * example.second + Math.floor(example.first % 10 * example.second / 10)) / 10))
    } else if (example.method === 'column') {
      assert.equal(Number(last.ones), example.first * (example.second % 10))
      if (example.second >= 10) {
        const zeroStep = example.steps.find(step => step.title === 'Put down a 0')
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
      if (last.answerRow) assert.equal(last.answerRow, 'quotient')
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
// The video's two examples are separate screens: the grid example with the video, then 246 × 43 in columns.
assert.deepEqual(multiplication.states.find(s => s.video).visual.examples.map(e => [e.method, e.first, e.second]), [['grid', 34, 26]])
const columnVideoExample = multiplication.states.find(s => s.sourceRef.includes('(column example)'))
assert.deepEqual(columnVideoExample.visual.examples.map(e => [e.method, e.first, e.second]), [['column', 246, 43]])
assert.equal(multiplication.states.filter(s => s.visual.kind === 'method-worked' && s.visual.examples.some(e => e.method === 'grid' && e.first === 34 && e.second === 26)).length, 1, '34 × 26 is taught once')
const app = fs.readFileSync(path.join(__dirname, '..', 'src/App.tsx'), 'utf8')
assert(app.includes('case 4:') && app.includes('return <TutorLongMultiplicationLesson />'))
assert(app.includes('case 5:') && app.includes('return <TutorLongDivisionLesson />'))
for (const legacy of ['divisionVariant', 'multiplicationVariant', 'variantNavigation', 'ShortDivisionLesson']) assert(!app.includes(legacy))
console.log(`${records} separately labelled calculations, ${results} independently recomputed complete calculation lines; canonical arithmetic routes verified.`)

const { columnWorking, divisionWorking, methodProgress } = require('../src/features/written-methods/tutor/methodWorking.ts')
const gridExample = multiplication.states[0].visual
assert.equal(methodProgress(gridExample, 0).current, undefined)
const gridEnd = methodProgress(gridExample, 6)
assert.equal(gridEnd.active, 0)
assert.equal(gridEnd.current.equation, '600+180+80+24=884')
assert.equal(gridEnd.working[0].count, 6)
assert.deepEqual(gridExample.examples[0].steps.map(s => s.title), ['Split both numbers', 'Top-left box', 'Top-right box', 'Bottom-left box', 'Bottom-right box', 'Add the boxes'])
assert.equal(gridExample.examples[0].steps.at(-1).frame.lines[0].result, '884')
const columnExample = columnVideoExample.visual
const columnStart = methodProgress(columnExample, 1)
assert.equal(columnStart.current.equation, '3\\times6=18')
assert.equal(columnStart.current.frame.ones, '8')
assert.deepEqual(columnStart.current.focus, { topPlace: 0, factorPlace: 0 })
assert.equal(methodProgress(columnExample, columnExample.examples[0].steps.length).current.frame.total, '10578')
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
  { lesson: division, source: '235 ÷ 17', method: 'long-division', first: 235, second: 17, quotient: ' 13', remainder: 14, steps: 6 },
  { lesson: division, source: '289 ÷ 29', method: 'long-division', first: 289, second: 29, quotient: '  9', remainder: 28, steps: 3 },
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
assert.deepEqual(long17.map(s => s.title), ['Start with 23', 'How many 17s?', 'Subtract', 'Bring down the 5', 'How many 17s?', 'Subtract'])
assert.deepEqual(long17[1].frame.lines.map(l => [l.result, l.mark]), [['17', '✓'], ['34', 'too big']], 'The trial multiples show where the 1 comes from')
assert.deepEqual(long17[2].frame.longRows, [{ number: '17', end: 1, kind: 'subtract' }, { number: '6', end: 1, kind: 'remainder' }])
assert.deepEqual(long17[3].frame.longRows, [{ number: '17', end: 1, kind: 'subtract' }, { number: '65', end: 2, kind: 'bring-down' }])
assert.deepEqual(long17.at(-1).frame.longRows, [{ number: '17', end: 1, kind: 'subtract' }, { number: '65', end: 2, kind: 'bring-down' }, { number: '51', end: 2, kind: 'subtract' }, { number: '14', end: 2, kind: 'remainder' }])
const long29 = division.states.find(s => s.sourceRef.endsWith('289 ÷ 29')).visual.examples[0].steps
assert.deepEqual(long29[1].frame.lines.map(l => [l.parts.map(p => p.text).join(' '), l.result, l.mark]), [['29 × 9', '261', '✓'], ['29 × 10', '290', 'too big']])
assert.deepEqual(long29.at(-1).frame.longRows, [{ number: '261', end: 2, kind: 'subtract' }, { number: '28', end: 2, kind: 'remainder' }])
console.log('All four user-added worked examples verified, including subtraction/bring-down alignment and both final remainders; all source questions retained.')
const carried = columnWorking(347, 4).steps
assert.deepEqual(carried.map(s => s.frame.ones), ['8', '88', '1388'])
assert.deepEqual(carried.map(s => s.frame.carry?.value), [2, 1, undefined])
const twoRows = columnWorking(246, 43).steps
assert.equal(twoRows.length, 11, 'One useful action per click, without split calculation/result clicks')
assert.deepEqual(twoRows.slice(-4).map(s => s.frame.total), ['8', '78', '578', '10578'])
const bus = divisionWorking(375, 5).steps
assert.equal(bus.length, 3, 'One step a place, and no check step')
assert.deepEqual(bus.map(s => s.frame.quotient), [' ', ' 7', ' 75'])
assert.deepEqual(bus.map(s => s.frame.busCarries), [[{ index: 1, value: 3 }], [{ index: 1, value: 3 }, { index: 2, value: 2 }], [{ index: 1, value: 3 }, { index: 2, value: 2 }]])
assert.deepEqual(bus[1].frame.lines.map(l => [l.parts.map(p => p.text).join(' '), l.result]), [['5 × 7', '35'], ['37 − 35', '2']], 'The remainder is worked out, not announced')
// Each question's working ends on what that question asks for.
const workingFor = (lesson, source) => lesson.states.find(s => s.sourceRef.startsWith(source)).working.examples[0].steps
const oneMore = workingFor(division, 'N4.1 Q4b').at(-1).frame.lines[0]
assert.deepEqual([oneMore.parts.map(p => p.text).join(' '), oneMore.result, oneMore.answer], ['31 + 1', '32', true], 'The working reaches 32 boxes')
assert.equal(workingFor(division, 'N4.1 Q4a').at(-1).frame.answerWords, '31 full boxes, 2 buns left over')
assert.equal(workingFor(division, 'N4.1 Q5b').at(-1).frame.lines.at(-1).result, '0')
assert(workingFor(division, 'N4.1 Q5c').at(-1).frame.carriesBoxed)
assert.equal(workingFor(multiplication, 'N5.1 Q5b').at(-1).frame.carry.value, 1)
assert.equal(workingFor(multiplication, 'N5.1 Q4b').at(-1).frame.lines[0].result, '£756')
assert.equal(workingFor(multiplication, 'N5.1 Q4b')[0].title, 'Write the sum')
const carriedCol = columnWorking(246, 3).steps
assert.deepEqual(carriedCol[1].frame.lines.map(l => [l.parts.map(p => p.text).join(' '), l.result]), [['3 × 4', '12'], ['12 + 1', '13']], 'A carry is added on its own line')
assert.deepEqual(carriedCol[2].frame.carries.map(c => [c.value, Boolean(c.used), Boolean(c.boxed)]), [[1, true, false], [1, false, true]], 'Used carries are struck out; the one being added is boxed')
for (const [first, second] of [[405, 32], [306, 24], [132, 24]]) verifyWorking({ kind: 'method-worked', examples: [columnWorking(first, second)] })
for (const [first, second] of [[408, 4], [250, 8], [624, 8]]) verifyWorking({ kind: 'method-worked', examples: [divisionWorking(first, second)] })
console.log('Digit placement, repeated carries, internal zeros, cumulative sums, aligned quotient and remainder exchanges passed.')

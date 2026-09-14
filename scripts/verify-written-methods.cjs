// Run with node scripts/verify-written-methods.cjs; uses the installed TS compiler.
const fs = require('node:fs')
const assert = require('node:assert/strict')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename)
const { shortDivisionVariantB } = require('../src/features/short-division/variant-b/variantBLesson.ts')
const { longMultiplicationVariantB } = require('../src/features/long-multiplication/variant-b/variantBLesson.ts')
const { checkAnswer } = require('../src/features/number-types/lessonMath.ts')
for (const lesson of [shortDivisionVariantB, longMultiplicationVariantB]) {
  assert.equal(new Set(lesson.states.map(s => s.id)).size, lesson.states.length)
  const questions = lesson.states.filter(s => s.interaction.type !== 'continue')
  for (const state of questions) {
    const i = state.interaction
    assert(state.hint?.trim(), `${state.id}: missing hint`)
    assert(checkAnswer(i, i.correctAnswer), `${state.id}: accepted answer rejected`)
    const wrong = i.type === 'numericInput' ? Number(i.correctAnswer) + 1 : i.type === 'quotientRemainderInput' ? { quotient: i.correctAnswer.quotient, remainder: i.divisor } : i.type === 'multiSelect' ? [] : i.options.find(o => o.id !== i.correctAnswer).id
    assert(!checkAnswer(i, wrong), `${state.id}: wrong answer accepted`)
    for (const branch of ['correct', 'incorrect']) {
      const explanation = state.feedback[branch].workedExplanation
      assert(explanation.answer && explanation.steps.length >= 2, `${state.id}: incomplete explanation`)
      assert(explanation.steps.every(s => s.title && s.lines.length))
    }
    if (i.type === 'numericInput') {
      for (const answer of [` ${i.correctAnswer} `, Number(i.correctAnswer).toLocaleString('en-GB'), Number(i.correctAnswer).toFixed(3)]) assert(checkAnswer(i, answer), `${state.id}: format ${answer}`)
      for (const answer of ['', 'abc', '1,23', '1+2']) assert(!checkAnswer(i, answer))
      // Recompute full calculations when the actual question contains both operands.
      const calculation = state.content.title.match(/(?:Calculate|find) (\d+(?:\.\d+)?) ([×÷]) (\d+(?:\.\d+)?)/)
      if (calculation) assert.equal(Number(i.correctAnswer), calculation[2] === '×' ? Number(calculation[1]) * Number(calculation[3]) : Number(calculation[1]) / Number(calculation[3]))
    }
    if (i.type === 'quotientRemainderInput') {
      const a = i.correctAnswer
      assert.equal(a.quotient * i.divisor + a.remainder, i.dividend)
      assert(a.remainder >= 0 && a.remainder < i.divisor)
      assert(checkAnswer(i, { quotient: ` ${a.quotient} `, remainder: `0${a.remainder}` }))
      assert(!checkAnswer(i, { quotient: `${a.quotient}.2`, remainder: a.remainder }))
      assert(!checkAnswer(i, { quotient: a.quotient - 1, remainder: a.remainder + i.divisor }))
    }
  }
  for (const state of lesson.states) {
    if (state.visual.kind !== 'worked') continue
    assert(state.visual.steps.length > 0)
    const last = state.visual.steps.at(-1).diagram
    if (last.kind === 'multiply') {
      assert.equal(Number(last.ones), Number(last.top) * (Number(last.bottom) % 10))
      assert.equal(Number(last.tens), Number(last.top) * Math.floor(Number(last.bottom) / 10) * 10)
      assert.equal(Number(last.total), Number(last.top) * Number(last.bottom))
    }
    if (last.kind === 'division') assert.equal(Number(last.quotient), Math.floor(Number(last.dividend) / last.divisor))
  }
  console.log(`${lesson.id}: ${lesson.states.length} screens, ${questions.length} questions; all grading, explanation, format and worked-result checks passed.`)
}

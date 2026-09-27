// Checks the exam checklist: every teaching section of every maths lesson has one "I can…" statement
// (review sections have none) and no statement points at a section that no longer exists; the level
// rules, mismatch notes and May/June countdown behave as documented in readiness.ts.
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

const { mathsLessons } = require(path.join(root, 'src/features/maths/courseRegistry.ts'))
const { canStatements } = require(path.join(root, 'src/features/maths/readiness/statements.ts'))
const { levelFor, mismatch, nextExamSeries } = require(path.join(root, 'src/features/maths/readiness/readiness.ts'))

// Coverage: one statement per teaching section, none for review sections, none left over.
const expected = new Set()
for (const entry of mathsLessons) for (const section of entry.sections) {
  const key = `${entry.number}:${section.id}`
  if (section.title === 'Review') { assert.ok(!canStatements[key], `${key}: review sections have no statement`); continue }
  expected.add(key)
  assert.ok(canStatements[key]?.startsWith('I can '), `${key} (${section.title}) needs an "I can…" statement`)
}
for (const key of Object.keys(canStatements)) assert.ok(expected.has(key), `${key}: statement for a section that does not exist`)

// Levels.
const score = (firstTry, questions) => ({ firstTry, questions, on: '2026-09-27' })
assert.equal(levelFor({ started: false, finished: false, cardBoxes: [] }), 'notStarted')
assert.equal(levelFor({ started: true, finished: false, cardBoxes: [] }), 'learning')
assert.equal(levelFor({ started: true, finished: true, cardBoxes: [] }), 'learnt', 'finished with no recorded score is learnt, not secure')
assert.equal(levelFor({ started: true, finished: true, score: score(5, 7), cardBoxes: [] }), 'learnt', '5/7 is under 80%')
assert.equal(levelFor({ started: true, finished: true, score: score(6, 7), cardBoxes: [] }), 'secure')
assert.equal(levelFor({ started: true, finished: true, score: score(0, 0), cardBoxes: [] }), 'secure', 'a section with no questions is secure once finished')
assert.equal(levelFor({ started: true, finished: true, score: score(7, 7), cardBoxes: [3, 4, 1] }), 'examReady', '2 of 3 cards remembered')
assert.equal(levelFor({ started: true, finished: true, score: score(7, 7), cardBoxes: [3, 1, 1] }), 'secure', '1 of 3 cards remembered')
assert.equal(levelFor({ started: true, finished: true, score: score(4, 7), cardBoxes: [4, 4, 4] }), 'learnt', 'cards cannot make an insecure section exam-ready')

// Mismatch notes.
assert.match(mismatch('green', 'learnt', score(2, 5)), /2 of 5/)
assert.match(mismatch('green', 'learning'), /haven’t finished/)
assert.match(mismatch('red', 'examReady', score(7, 7)), /better than you think/)
assert.equal(mismatch('green', 'secure', score(6, 7)), null)
assert.equal(mismatch('amber', 'learnt', score(1, 7)), null)
assert.equal(mismatch(undefined, 'notStarted'), null)

// The May/June series: counts down to mid-May, and moves to next year once the series is over.
assert.equal(nextExamSeries(new Date(2026, 8, 27)).year, 2027)
assert.equal(nextExamSeries(new Date(2027, 2, 1)).year, 2027)
assert.equal(nextExamSeries(new Date(2027, 5, 10)).days, 0, 'during the series the countdown stays at zero')
assert.equal(nextExamSeries(new Date(2027, 6, 1)).year, 2028)

console.log(`Exam checklist verified: ${expected.size} "I can…" statements, one per teaching section; levels, mismatch notes and May/June countdown behave as documented.`)

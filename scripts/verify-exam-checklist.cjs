// Checks the exam checklist: every teaching section of every maths lesson has one "I can…" statement
// (review sections have none) and no statement points at a section that no longer exists; the level
// rules, mismatch notes and May/June countdown behave as documented in readiness.ts; the exam map
// (paperMap.ts, squarify.ts) places every statement in one topic and lays the paper out cleanly.
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
const { paperTopics, marksPerPaper, scoreTopics, biggestWin, tileLevel, PAPER_MARKS } = require(path.join(root, 'src/features/maths/readiness/paperMap.ts'))
const { squarify } = require(path.join(root, 'src/features/maths/readiness/squarify.ts'))
const { branchTiers, branchLeaves } = require(path.join(root, 'src/features/maths/readiness/paperMap.ts'))
const { bosses, isCorrect, readAnswer } = require(path.join(root, 'src/features/maths/readiness/bosses.ts'))
const katex = require(path.join(root, 'node_modules/katex'))

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

// The exam map: every statement sits in exactly one topic, and the topics make up the whole paper.
const placed = paperTopics.flatMap(topic => topic.statements)
for (const key of Object.keys(canStatements)) assert.equal(placed.filter(k => k === key).length, 1, `${key} belongs in exactly one map topic`)
for (const key of placed) assert.ok(canStatements[key], `${key}: map topic points at a statement that does not exist`)
assert.equal(new Set(paperTopics.map(topic => topic.id)).size, paperTopics.length, 'topic ids are unique')
assert.ok(Math.abs(paperTopics.reduce((sum, topic) => sum + marksPerPaper(topic), 0) - PAPER_MARKS) < 1e-9, 'topics add up to the 80-mark paper')
const money = paperTopics.find(topic => topic.id === 'money')
assert.ok(paperTopics.every(topic => marksPerPaper(topic) <= marksPerPaper(money)), 'money is the biggest topic, as in the analysis')

// Scoring: nothing done is 0 marks; everything exam-ready is every taught mark; the biggest win is the largest gap.
const none = scoreTopics({})
assert.equal(none.reduce((sum, score) => sum + score.ready, 0), 0)
const all = scoreTopics(Object.fromEntries(placed.map(key => [key, 'examReady'])))
const taught = all.filter(score => score.taught).reduce((sum, score) => sum + score.marks, 0)
assert.ok(Math.abs(all.reduce((sum, score) => sum + score.ready, 0) - taught) < 1e-9)
assert.equal(biggestWin(all), null, 'nothing left to win once every taught topic is exam-ready')
assert.equal(biggestWin(none).topic.id, [...none].filter(score => score.taught).sort((a, b) => b.marks - a.marks)[0].topic.id)
const fractionsDone = scoreTopics(Object.fromEntries(paperTopics.find(topic => topic.id === 'fractions').statements.map(key => [key, 'secure'])))
const fractions = fractionsDone.find(score => score.topic.id === 'fractions')
assert.equal(tileLevel(fractions), 'secure')
assert.ok(Math.abs(fractions.ready - fractions.marks * 0.8) < 1e-9)

// Treemap layout: tiles fill the space exactly, without overlapping, and keep their share of the area.
const tiles = squarify(paperTopics.map(topic => ({ value: marksPerPaper(topic), item: topic.id })), { x: 0, y: 0, w: 320, h: 400 })
assert.equal(tiles.length, paperTopics.length)
assert.ok(Math.abs(tiles.reduce((sum, t) => sum + t.w * t.h, 0) - 320 * 400) < 1e-6, 'tiles fill the map')
for (const t of tiles) {
  assert.ok(t.x >= -1e-9 && t.y >= -1e-9 && t.x + t.w <= 320 + 1e-6 && t.y + t.h <= 400 + 1e-6, `${t.item} stays inside the map`)
  const topic = paperTopics.find(p => p.id === t.item)
  assert.ok(Math.abs(t.w * t.h / (320 * 400) - marksPerPaper(topic) / PAPER_MARKS) < 1e-9, `${t.item} keeps its share`)
}
for (let i = 0; i < tiles.length; i++) for (let j = i + 1; j < tiles.length; j++) {
  const a = tiles[i], b = tiles[j]
  const overlap = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > 1e-6 && Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > 1e-6
  assert.ok(!overlap, `${a.item} and ${b.item} overlap`)
}

// Skill tree: prerequisites stay inside their branch, every topic gets a row, and the Number boss sits under
// the taught topics nothing else builds on.
for (const topic of paperTopics) for (const id of topic.requires ?? []) {
  const parent = paperTopics.find(candidate => candidate.id === id)
  assert.ok(parent, `${topic.id} requires ${id}, which does not exist`)
  assert.equal(parent.area, topic.area, `${topic.id} requires ${id} from another branch`)
}
for (const area of new Set(paperTopics.map(topic => topic.area))) {
  const tiers = branchTiers(area)
  assert.equal(tiers.flat().length, paperTopics.filter(topic => topic.area === area).length, `${area}: every topic is in the tree once`)
  tiers.forEach((tier, row) => tier.forEach(topic => (topic.requires ?? []).forEach(id => assert.ok(tiers.findIndex(t => t.some(p => p.id === id)) < row, `${topic.id} sits below ${id}`))))
}
assert.deepEqual(branchLeaves('number').map(topic => topic.id).sort(), ['bidmas', 'bounds', 'fdp'])

// Bosses: every question's worked chain renders, merges come from the line above, and ends on the answer.
const TERM = /\[\[([\w-]+):(.*?)\]\]/g
const keysOf = line => [...line.matchAll(TERM)].map(match => match[1])
let bossParts = 0
for (const boss of bosses) for (const round of boss.rounds) for (const part of round) {
  bossParts++
  assert.ok(Number.isFinite(part.answer) && part.prompt && part.hint)
  part.chain.forEach((step, index) => {
    katex.renderToString(step.line.replace(TERM, (_, key, body) => `\\htmlData{k=${key}}{${body}}`), { trust: true, strict: 'ignore', throwOnError: true })
    if (index === 0) return
    assert.ok(step.op && step.why, `${boss.title}: step ${index} of "${part.prompt}" needs an op and a why`)
    const above = keysOf(part.chain[index - 1].line)
    for (const [result, from] of Object.entries(step.merge ?? {})) {
      assert.ok(keysOf(step.line).includes(result))
      for (const key of from) assert.ok(above.includes(key), `${part.prompt}: ${key} merges from the line above`)
    }
  })
  const last = [...part.chain.at(-1).line.matchAll(TERM)].at(-1)[2]
  assert.equal(Number(last), part.answer, `${part.prompt}: the chain ends on the answer`)
  assert.ok(isCorrect(String(part.answer), part) && isCorrect(`£${part.answer}`, part) && isCorrect(` ${part.answer}.00 `, part))
  assert.ok(!isCorrect(String(part.answer + 1), part))
}
assert.equal(readAnswer('£1,180'), 1180)
assert.equal(readAnswer('abc'), null)

console.log(`Exam checklist verified: ${expected.size} "I can…" statements, one per teaching section; levels, mismatch notes and May/June countdown behave as documented; the exam map covers every statement once, adds up to ${PAPER_MARKS} marks and lays out without overlaps; the skill tree and ${bossParts} boss questions check out.`)

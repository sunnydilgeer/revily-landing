// Checks revision decks (every card well formed and tied to a real rung) and the review schedule.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename)
const root = path.join(__dirname, '..')
const { mathsLessons } = require(path.join(root, 'src/features/maths/courseRegistry.ts'))
const { buildDecks } = require(path.join(root, 'src/features/cards/decks.ts'))
const { KEY_FACTS } = require(path.join(root, 'src/features/cards/keyFacts.ts'))
const { review, todaysQueue, deckQueue, addDays, NEW_PER_DAY, SESSION_MAX } = require(path.join(root, 'src/features/cards/schedule.ts'))
const { rungStatus, legacyCompleted } = require(path.join(root, 'src/features/maths/rungProgress.ts'))

// ---------- Decks ----------
const decks = buildDecks(mathsLessons)
assert.equal(decks.length, mathsLessons.length, 'Every lesson has a deck')
const ids = new Set()
let facts = 0, recall = 0
for (const deck of decks) {
  const lesson = mathsLessons.find(entry => entry.number === deck.lesson)
  const rungIds = new Set(lesson.sections.map(section => section.id))
  for (const rung of Object.keys(KEY_FACTS[deck.lesson] ?? {})) assert.ok(rungIds.has(rung), `Lesson ${deck.lesson} key facts use unknown rung "${rung}"`)
  assert.ok(deck.cards.length >= 3, `Lesson ${deck.lesson} deck needs at least 3 cards`)
  for (const card of deck.cards) {
    assert.ok(!ids.has(card.id), `Duplicate card id ${card.id}`); ids.add(card.id)
    assert.ok(card.front.trim().length > 3 && card.back.trim().length > 0, `${card.id} needs a front and a back`)
    assert.ok(rungIds.has(card.rung), `${card.id} must belong to a real rung`)
    if (card.kind === 'recall') assert.ok(/\d/.test(card.front) || card.frontMath, `${card.id} "${card.front}" has no sum to answer`)
    if (card.kind === 'fact') facts++; else recall++
  }
}
assert.ok(facts >= 60, `Expected at least 60 key-fact cards, found ${facts}`)

if (process.argv.includes('--list')) {
  for (const deck of decks) for (const card of deck.cards.filter(c => c.kind === 'recall')) console.log(`L${deck.lesson} ${card.rungTitle}: ${card.front} → ${card.back}`)
}

// ---------- Shown answers match marked answers (regression: toLocaleString used to round 0.5625 to 0.563) ----------
let checkedAnswers = 0
for (const entry of mathsLessons) for (const state of entry.definition.states) {
  const interaction = state.interaction
  if (interaction.type !== 'numericInput' || typeof interaction.correctAnswer !== 'number' || interaction.displayAnswer === undefined) continue
  const shown = Number(String(interaction.displayAnswer).replace(/[£%,\s]|[a-z]+$/gi, '').replace(/[−–]/g, '-'))
  if (!Number.isFinite(shown)) continue
  assert.ok(Math.abs(shown - interaction.correctAnswer) < 1e-9, `${state.id}: shows "${interaction.displayAnswer}" but marks ${interaction.correctAnswer} as correct`)
  checkedAnswers++
}
assert.ok(checkedAnswers > 50, 'Expected to check the shown answer of every numeric question')

// ---------- Schedule ----------
const today = '2026-09-26'
let states = {}
states = review(states, 'a', true, today)
assert.deepEqual([states.a.box, states.a.due], [1, '2026-09-27'], 'First "Got it" comes back tomorrow')
states = review(states, 'a', true, '2026-09-27')
assert.deepEqual([states.a.box, states.a.due], [2, '2026-09-30'], 'Second "Got it" comes back in 3 days')
states = review(states, 'a', true, '2026-09-30')
assert.deepEqual([states.a.box, states.a.due], [3, '2026-10-07'], 'Third comes back in 7 days')
states = review(states, 'a', true, '2026-10-07')
assert.deepEqual([states.a.box, states.a.due], [4, '2026-10-28'], 'Fourth comes back in 21 days')
states = review(states, 'a', true, '2026-10-28')
assert.deepEqual([states.a.box, states.a.due], [4, '2026-11-18'], 'It stays at 21 days')
states = review(states, 'a', false, '2026-11-18')
assert.deepEqual([states.a.box, states.a.due], [1, '2026-11-19'], '"Still learning" drops to box 1, back tomorrow')
assert.equal(states.a.reviews, 6)
assert.equal(addDays('2026-12-31', 1), '2027-01-01')

const cards = Array.from({ length: 40 }, (_, i) => ({ id: `c${i}` }))
const seen = { c0: { box: 3, due: '2026-09-20', reviews: 3, introduced: '2026-09-01' }, c1: { box: 1, due: '2026-09-26', reviews: 1, introduced: '2026-09-25' }, c2: { box: 2, due: '2026-10-01', reviews: 2, introduced: '2026-09-20' } }
const queue = todaysQueue(cards, seen, today)
assert.deepEqual(queue.slice(0, 2).map(c => c.id), ['c1', 'c0'], 'Due cards come first, weakest box first')
assert.ok(!queue.some(c => c.id === 'c2'), 'Cards not yet due stay out')
assert.equal(queue.length, Math.min(SESSION_MAX, 2 + NEW_PER_DAY), 'New cards are capped per day and sessions are capped')
const introducedToday = Object.fromEntries(Array.from({ length: NEW_PER_DAY }, (_, i) => [`n${i}`, { box: 1, due: '2026-09-27', reviews: 1, introduced: today }]))
assert.equal(todaysQueue(cards, introducedToday, today).length, 0, 'No more new cards once today\'s allowance is used')

const ordered = deckQueue([{ id: 'late' }, { id: 'new' }, { id: 'due' }], { late: { box: 3, due: '2026-10-10', reviews: 3, introduced: '2026-09-01' }, due: { box: 1, due: '2026-09-26', reviews: 1, introduced: '2026-09-25' } }, today)
assert.deepEqual(ordered.map(c => c.id), ['due', 'new', 'late'], 'A deck studies due cards, then new ones, then the rest')

// ---------- Finished rungs (rungs are open, so jumping ahead must not count as finishing) ----------
const sections = [{ id: 'a', title: 'A', startIndex: 0 }, { id: 'b', title: 'B', startIndex: 3 }, { id: 'c', title: 'C', startIndex: 6 }]
const snap = (extra) => ({ lessonId: 'L', currentStateId: 'x', currentStateIndex: 7, furthestStateIndex: 7, totalStates: 9, currentSectionId: 'c', completed: false, ...extra })
assert.deepEqual(rungStatus(sections, 9, snap({ completedSections: ['a'] })).map(r => r.done), [true, false, false], 'Only rungs actually finished count once they are recorded')
assert.deepEqual(rungStatus(sections, 9, snap({})).map(r => r.done), [true, true, false], 'Older saved progress falls back to "moved past the rung"')
assert.deepEqual(rungStatus(sections, 9, snap({ completed: true })).map(r => r.done), [true, true, true])
assert.deepEqual(rungStatus(sections, 9, snap({ completedSections: [] })).map(r => r.current), [false, false, true])
assert.deepEqual(legacyCompleted(sections, 9, 3), ['a'])

console.log(`Revision cards verified: ${decks.length} decks, ${facts} key facts, ${recall} quick questions, ${checkedAnswers} shown answers, schedule rules.`)

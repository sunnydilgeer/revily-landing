import { strict as assert } from 'node:assert'
import { alignmentRows, cardGroups, practiceTasks, revisionCards, sourceReview } from './content'
import { gradePractice, newRevisionSession, restoreRevisionSession, revisionReducer, REVISION_STORAGE_KEY } from './engine'
import { coachLessonEngines, COACH_STORAGE_KEY } from '../coach/engine'
import { getScienceLessons } from '../lessonNavigation'
import { createPreviewSessionEngine } from '../previewSession'
let tests = 0
const at = '2026-09-17T13:00:00.000Z'
function test(name: string, fn: () => void) { fn(); tests++; console.log(`PASS ${name}`) }
test('only Cells Lesson 1 content: 27 original cards, all six sections and resolvable links', () => {
  assert.equal(revisionCards.length, 27)
  assert.equal(new Set(revisionCards.map(c => c.id)).size, revisionCards.length)
  cardGroups.forEach(group => assert.ok(revisionCards.some(c => c.group === group)))
  revisionCards.forEach(c => { assert.ok(c.question && c.answer && c.easy && c.slip && c.spec.length); assert.ok(c.spec.every(ref => /^4\.1(?:\.1(?:\.[12])?)?$|^MS |^WS /.test(ref))) })
  practiceTasks.forEach(task => task.cardIds.forEach(id => assert.ok(revisionCards.some(c => c.id === id))))
  alignmentRows.forEach(row => { row.groups.forEach(group => assert.ok(cardGroups.includes(group))); row.practice.forEach(id => assert.ok(practiceTasks.some(t => t.id === id))) })
})
test('practice has worked then supported then nine checks; each draft point has an allocation', () => {
  assert.equal(practiceTasks.length, 11)
  assert.deepEqual(practiceTasks.slice(0, 2).map(t => t.stage), ['worked', 'supported'])
  assert.ok(practiceTasks.slice(2).every(t => t.stage === 'independent'))
  practiceTasks.forEach(t => { assert.equal(t.points.length, t.marks); assert.ok(t.model && t.slip) })
})
test('paper and mark-scheme references stay pending, without invented verified matches', () => {
  assert.equal(sourceReview.status, 'pendingVerification')
  assert.ok(sourceReview.note.includes('not been reverified'))
  assert.ok(!('verifiedQuestionIds' in sourceReview))
})
test('revision storage cannot overwrite any original A/B lesson or Coach record', () => {
  const keys = ['a', 'b'].flatMap(v => getScienceLessons(v as 'a' | 'b').map(item => createPreviewSessionEngine(item.lesson).storageKey))
  keys.push(...coachLessonEngines.map(e => e.storageKey), COACH_STORAGE_KEY)
  assert.ok(!keys.includes(REVISION_STORAGE_KEY))
})
test('unrevealed cards cannot be self-checked; self-checks never create assessed answers', () => {
  let session = newRevisionSession()
  assert.equal(revisionReducer(session, { type: 'selfCheck', value: 'remembered' }), session)
  session = revisionReducer(session, { type: 'revealCard', at })
  session = revisionReducer(session, { type: 'selfCheck', value: 'again' })
  assert.deepEqual(session.reviewIds, ['cell'])
  assert.deepEqual(session.answers, {})
  session = revisionReducer(session, { type: 'selfCheck', value: 'remembered' })
  assert.deepEqual(session.reviewIds, [])
})
test('independent model answers stay hidden until submission; worked models are available', () => {
  let session = revisionReducer(newRevisionSession(), { type: 'model' })
  assert.deepEqual(session.models, ['worked-energy'])
  session = revisionReducer(session, { type: 'task', id: 'comparison-check' })
  assert.equal(revisionReducer(session, { type: 'model' }), session)
  assert.equal(revisionReducer(session, { type: 'submit', at }), session)
})
test('written answers remain pending, preserve text, and lock after submission', () => {
  let session = revisionReducer(newRevisionSession(), { type: 'task', id: 'comparison-check' })
  session = revisionReducer(session, { type: 'draft', text: 'Animal: nucleus and mitochondria. Bacterium: neither.' })
  session = revisionReducer(session, { type: 'submit', at })
  assert.equal(session.answers['comparison-check'].result, 'pendingReview')
  assert.equal(revisionReducer(session, { type: 'draft', text: 'different' }), session)
  assert.equal(revisionReducer(session, { type: 'submit', response: 'different', at }), session)
  assert.equal(gradePractice(practiceTasks.find(t => t.id === 'comparison-check')!, 'nonsense keywords'), 'pendingReview')
})
test('every choice grades canonically; invalid and blank responses cannot earn correct', () => {
  practiceTasks.forEach(task => {
    if (task.kind !== 'choice') return
    task.options.forEach((_, index) => assert.equal(gradePractice(task, String(index)), index === task.answer ? 'correct' : 'incorrect'))
    assert.equal(gradePractice(task, ''), 'incorrect')
  })
  const session = revisionReducer(newRevisionSession(), { type: 'task', id: 'dna-check' })
  assert.equal(revisionReducer(session, { type: 'submit', response: '99', at }), session)
})
test('numeric answers check supplied units without guessing written workings', () => {
  let session = revisionReducer(newRevisionSession(), { type: 'task', id: 'unit-check' })
  assert.equal(revisionReducer(session, { type: 'submit', response: 'seven µm', at }), session)
  session = revisionReducer(session, { type: 'submit', response: '7.0', at })
  assert.equal(session.answers['unit-check'].result, 'correct')
  assert.equal(gradePractice(practiceTasks.find(t => t.id === 'ratio-check')!, '20'), 'correct')
  assert.equal(gradePractice(practiceTasks.find(t => t.id === 'unit-check')!, '0.000007'), 'incorrect')
})
test('wrong checked answers add relevant cards to revisit without diagnosing written work', () => {
  let session = revisionReducer(newRevisionSession(), { type: 'task', id: 'membrane-check' })
  session = revisionReducer(session, { type: 'submit', response: '0', at })
  assert.deepEqual(session.reviewIds, ['membrane', 'animal-parts'])
  session = revisionReducer(session, { type: 'task', id: 'comparison-check' })
  session = revisionReducer(session, { type: 'submit', response: 'bacteria have no dna', at })
  assert.deepEqual(session.reviewIds, ['membrane', 'animal-parts'])
})
test('using relevant cards before answering persists a supported-attempt flag', () => {
  let session = revisionReducer(newRevisionSession(), { type: 'task', id: 'unit-check' })
  session = revisionReducer(session, { type: 'card', id: 'units' })
  session = revisionReducer(session, { type: 'revealCard', at })
  session = revisionReducer(session, { type: 'submit', response: '7', at })
  assert.equal(session.answers['unit-check'].supported, true)
})
test('reload preserves position, drafts, locked answers, exposure and review choices', () => {
  let session = revisionReducer(newRevisionSession(), { type: 'task', id: 'supported-protein' })
  session = revisionReducer(session, { type: 'draft', text: 'Ribosomes make the proteins released into blood.' })
  assert.deepEqual(restoreRevisionSession(JSON.parse(JSON.stringify(session))), session)
  session = revisionReducer(session, { type: 'submit', at })
  session = revisionReducer(session, { type: 'model' })
  session = revisionReducer(session, { type: 'reviewCards', ids: ['ribosomes', 'foreign'] })
  assert.deepEqual(restoreRevisionSession(JSON.parse(JSON.stringify(session))), session)
})
test('corrupt records, forged grading, impossible reveals and incompatible versions reject', () => {
  const session = newRevisionSession()
  assert.equal(restoreRevisionSession(null), null)
  assert.equal(restoreRevisionSession({ ...session, version: 2 }), null)
  assert.equal(restoreRevisionSession({ ...session, models: ['comparison-check'] }), null)
  assert.equal(restoreRevisionSession({ ...session, cards: { foreign: { revealedAt: at } } }), null)
  const answered = revisionReducer(revisionReducer(session, { type: 'task', id: 'unit-check' }), { type: 'submit', response: '0', at })
  assert.equal(restoreRevisionSession({ ...answered, answers: { 'unit-check': { ...answered.answers['unit-check'], result: 'correct' } } }), null)
})
console.log(`${tests} exam-revision checks passed.`)

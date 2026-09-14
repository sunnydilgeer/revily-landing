import { strict as assert } from 'node:assert'
import { lesson1 } from './lesson-1/lesson'
import { evidenceProfile } from './engine'
import { createPreviewSession, previewReducer, restorePreviewSession } from './previewSession'

let tests = 0
const at = '2026-09-13T15:00:00.000Z'
function test(name: string, fn: () => void) { fn(); tests++; console.log(`PASS ${name}`) }

test('questions cannot be skipped with Continue; teaching never awards a mark', () => {
  let session = createPreviewSession('test')
  assert.equal(previewReducer(session, { type: 'continue', at }), session)
  session = previewReducer(session, { type: 'jump', id: 'B1-02' })
  session = previewReducer(session, { type: 'continue', at })
  assert.equal(session.currentId, 'B1-03')
  assert.deepEqual(session.completedIds, ['B1-02'])
  assert.deepEqual(session.answers, {})
})
test('incorrect answers retain the selected response and allow Continue', () => {
  let session = createPreviewSession('test')
  session = previewReducer(session, { type: 'answer', response: 'organ', at })
  assert.equal(session.answers['B1-01'].result, 'incorrect')
  assert.equal(session.answers['B1-01'].response, 'organ')
  session = previewReducer(session, { type: 'continue', at })
  assert.equal(session.currentId, 'B1-02')
})
test('submission is locked against double taps and changing a graded answer', () => {
  const answered = previewReducer(createPreviewSession('test'), { type: 'answer', response: 'organ', at })
  assert.equal(previewReducer(answered, { type: 'answer', response: 'unit', at }), answered)
})
test('hint use is remembered after closing, but never submits a response', () => {
  let session = createPreviewSession('test')
  session = previewReducer(session, { type: 'hint' })
  session = previewReducer(session, { type: 'hint' })
  assert.deepEqual(session.hintsOpen, [])
  assert.deepEqual(session.hintsUsed, ['B1-01'])
  assert.deepEqual(session.answers, {})
  session = previewReducer(session, { type: 'answer', response: 'unit', at })
  assert.equal(session.answers['B1-01'].usedHint, true)
})
test('a hint opened after grading does not alter historical support flags', () => {
  let session = previewReducer(createPreviewSession('test'), { type: 'answer', response: 'unit', at })
  session = previewReducer(session, { type: 'hint' })
  assert.equal(session.answers['B1-01'].usedHint, false)
})
test('local reload preserves drafts, open hints, answers and section selection', () => {
  let session = previewReducer(createPreviewSession('test'), { type: 'answer', response: 'unit', at })
  session = previewReducer(session, { type: 'continue', at })
  session = previewReducer(session, { type: 'jump', id: 'B1-21' })
  session = previewReducer(session, { type: 'hint' })
  session = previewReducer(session, { type: 'draft', response: 'Respiration releases energy.' })
  assert.deepEqual(restorePreviewSession(JSON.parse(JSON.stringify(session))), session)
})
test('written answers stay pending and their original text is retained', () => {
  let session = previewReducer(createPreviewSession('test'), { type: 'jump', id: 'B1-21' })
  assert.throws(() => previewReducer(session, { type: 'answer', response: '  ', at }))
  session = previewReducer(session, { type: 'answer', response: 'mitochondria energy', at })
  assert.equal(session.answers['B1-21'].result, 'pendingTeacherReview')
  assert.equal(session.answers['B1-21'].response, 'mitochondria energy')
  session = previewReducer(session, { type: 'continue', at })
  assert.equal(session.currentId, null)
  assert.equal(session.completedIds.length, 1)
})
test('restart preserves prior answer exposure without deleting other browser data', () => {
  let session = previewReducer(createPreviewSession('test'), { type: 'answer', response: 'unit', at })
  session = previewReducer(session, { type: 'restart', sessionId: 'practice' })
  assert.deepEqual(session.completedIds, [])
  assert.deepEqual(session.answers, {})
  session = previewReducer(session, { type: 'answer', response: 'unit', at })
  assert.equal(session.answers['B1-01'].answerPreviouslySeen, true)
  const fresh = previewReducer(session, { type: 'restart', sessionId: 'fresh-test', clearPracticeHistory: true })
  assert.deepEqual(fresh.seenAnswers, [])
  assert.equal(previewReducer(fresh, { type: 'answer', response: 'unit', at }).answers['B1-01'].answerPreviouslySeen, false)
})
test('corrupt, incompatible and falsely graded stored sessions are rejected', () => {
  assert.equal(restorePreviewSession(null), null)
  const initial = createPreviewSession('test')
  assert.equal(restorePreviewSession({ ...initial, version: 'old' }), null)
  assert.equal(restorePreviewSession({ ...initial, currentId: 'unknown' }), null)
  assert.equal(restorePreviewSession({ ...initial, hintsUsed: null }), null)
  assert.equal(restorePreviewSession({ ...initial, completedIds: ['B1-12'] }), null)
  const answered = previewReducer(initial, { type: 'answer', response: 'organ', at })
  const forged = { ...answered, answers: { 'B1-01': { ...answered.answers['B1-01'], result: 'correct' } } }
  assert.equal(restorePreviewSession(forged), null)
})
test('all lesson screens flow to summary with independent evidence separate from completion', () => {
  let session = createPreviewSession('test')
  for (const state of lesson1.states) {
    assert.equal(session.currentId, state.id)
    if (state.kind !== 'teaching') session = previewReducer(session, { type: 'answer', at,
      response: state.kind === 'choice' ? state.answerId : 'Aerobic respiration releases energy for movement.' })
    session = previewReducer(session, { type: 'continue', at })
  }
  assert.equal(session.currentId, null)
  assert.equal(session.completedIds.length, lesson1.states.length)
  assert.ok(restorePreviewSession(JSON.parse(JSON.stringify(session))))
  const profile = evidenceProfile(lesson1, Object.values(session.answers))
  assert.equal(profile.dimensions.recall, 'secureInSession')
  assert.equal(profile.dimensions.explanation, 'developing')
  assert.equal(profile.dimensions.calculation, 'secureInSession')
})
test('expanded content cannot reuse an old-version learner record', () => {
  assert.equal(restorePreviewSession({ ...createPreviewSession('old'), version: '0.1.0' }), null)
  assert.equal(restorePreviewSession({ ...createPreviewSession('old'), version: '0.2.0' }), null)
})
console.log(`${tests} preview-session checks passed.`)

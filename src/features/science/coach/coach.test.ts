import { strict as assert } from 'node:assert'
import { coachTopics } from './content'
import { advanceCoachRun, answerCoachQuestion, coachLessonEngines, coachLessons, DAY, emptyCoachStore,
  makeReviewEntries, nextCoachLesson, recordCoachExposure, restoreCoachStore, revealCoachHint, startCoachRun, topicSummary, type CoachSessions } from './engine'
import { createPreviewSessionEngine } from '../previewSession'

let tests = 0
const at = '2026-09-17T09:00:00.000Z', time = Date.parse(at)
const later = new Date(time + DAY).toISOString()
function test(name: string, fn: () => void) { fn(); tests++; console.log(`PASS ${name}`) }
function learnedSessions(): CoachSessions {
  const result: CoachSessions = {}
  coachLessons.forEach((item, index) => {
    let session = coachLessonEngines[index].createPreviewSession(`coach-${item.number}`)
    for (const state of item.lesson.states.filter(s => s.kind === 'teaching')) {
      session = coachLessonEngines[index].previewReducer(session, { type: 'jump', id: state.id })
      session = coachLessonEngines[index].previewReducer(session, { type: 'continue', at })
    }
    result[item.number] = session
  })
  return result
}
const sessions = learnedSessions()
const first = coachTopics[0]
test('starter goals cover all six B lessons with valid teaching and assessment links', () => {
  assert.deepEqual([...new Set(coachTopics.map(t => t.lesson))], [1, 2, 3, 4, 5, 6])
  assert.equal(new Set(coachTopics.map(t => t.id)).size, coachTopics.length)
  const ids = new Set<string>()
  coachTopics.forEach(topic => {
    const lesson = coachLessons.find(l => l.number === topic.lesson)!.lesson
    topic.teachingIds.forEach(id => assert.equal(lesson.states.find(s => s.id === id)?.kind, 'teaching', `${topic.id}: ${id}`))
    topic.assessmentIds.forEach(id => assert.equal(lesson.states.find(s => s.id === id)?.kind, 'choice', `${topic.id}: ${id}`))
    assert.equal(topic.questions.length, 3)
    topic.questions.forEach(q => {
      assert.ok(!ids.has(q.id)); ids.add(q.id)
      assert.equal(q.options.length, 3); assert.equal(new Set(q.options).size, 3)
      assert.ok(q.answer >= 0 && q.answer < q.options.length); assert.ok(q.explanation.length > 20)
    })
  })
})
test('Coach lesson storage is separate from original A/B storage without changing content', () => {
  coachLessons.forEach((item, index) => {
    assert.notEqual(coachLessonEngines[index].storageKey, createPreviewSessionEngine(item.lesson).storageKey)
    assert.ok(coachLessonEngines[index].storageKey.startsWith('revily:science-coach:'))
    assert.equal(coachLessonEngines[index].createPreviewSession('x').lessonId, item.lesson.id)
  })
})
test('empty or skipped teaching does not unlock reviews or repairs', () => {
  assert.deepEqual(makeReviewEntries({}, emptyCoachStore(), time + DAY, 'review', false), [])
  const engine = coachLessonEngines[0]
  const skipped = engine.previewReducer(engine.createPreviewSession('skip'), { type: 'jump', id: 'B1-05' })
  assert.equal(topicSummary(first, { 1: skipped }, emptyCoachStore(), time + DAY).learned, false)
})
test('continue learning resumes the most recent unfinished lesson rather than always lesson 1', () => {
  assert.equal(nextCoachLesson({})!.number, 1)
  assert.equal(nextCoachLesson({ 6: sessions[6] })!.number, 6)
  assert.equal(nextCoachLesson({ 1: { ...sessions[1]!, lastExposureAt: later }, 6: sessions[6] })!.number, 1)
})
test('later checks open only at 24 hours; practice remains available earlier; sets stay small', () => {
  assert.deepEqual(makeReviewEntries(sessions, emptyCoachStore(), time + DAY - 1, 'review', true), [])
  assert.equal(makeReviewEntries(sessions, emptyCoachStore(), time, 'review', false).length, 5)
  assert.equal(makeReviewEntries(sessions, emptyCoachStore(), time + DAY, 'review', true).length, 5)
})
test('answers lock, cannot advance without an answer, and saved unfinished sets restore', () => {
  const entries = makeReviewEntries(sessions, emptyCoachStore(), time, 'review', false)
  let store = startCoachRun(emptyCoachStore(), entries, 'run')
  assert.equal(advanceCoachRun(store), store)
  store = answerCoachQuestion(store, sessions, first.questions[0].answer, at)
  assert.equal(answerCoachQuestion(store, sessions, 0, at), store)
  assert.deepEqual(restoreCoachStore(JSON.parse(JSON.stringify(store))), store)
  store = advanceCoachRun(store)
  assert.equal(store.run!.index, 1)
  assert.deepEqual(restoreCoachStore(JSON.parse(JSON.stringify(store))), store)
})
test('wrong review answers create repair; different supported repair clears the immediate practice list', () => {
  let store = startCoachRun(emptyCoachStore(), [{ topicId: first.id, itemId: first.questions[0].id, mode: 'review' }], 'wrong')
  store = answerCoachQuestion(store, sessions, 0, at)
  assert.equal(topicSummary(first, sessions, store, time).needsRepair, true)
  const entries = makeReviewEntries(sessions, store, time, 'repair', false)
  assert.equal(entries[0].itemId, first.questions[1].id)
  store = startCoachRun(store, entries, 'repair')
  store = answerCoachQuestion(store, sessions, first.questions[1].answer, at)
  assert.equal(store.attempts[1].assisted, true)
  assert.equal(store.attempts[1].laterCheck, false)
  assert.equal(topicSummary(first, sessions, store, time).needsRepair, false)
  assert.equal(topicSummary(first, sessions, store, time).label, 'Correct in practice')
})
test('lesson mistakes create repairs only for relevant introduced topics, not pending writing', () => {
  const engine = coachLessonEngines[0]
  let lessonSession = engine.previewReducer(sessions[1]!, { type: 'jump', id: 'B1-04' })
  const state = coachLessons[0].lesson.states.find(s => s.id === 'B1-04')!
  assert.equal(state.kind, 'choice')
  if (state.kind !== 'choice') throw Error('Expected choice')
  lessonSession = engine.previewReducer(lessonSession, { type: 'answer', response: state.options.find(o => o.id !== state.answerId)!.id, at })
  assert.equal(topicSummary(first, { ...sessions, 1: lessonSession }, emptyCoachStore(), time).needsRepair, true)
  assert.equal(topicSummary(coachTopics[1], { ...sessions, 1: lessonSession }, emptyCoachStore(), time).needsRepair, false)
})
test('fresh later questions count as later checks, but helped or repeated questions never do', () => {
  const entry = { topicId: first.id, itemId: first.questions[0].id, mode: 'review' as const }
  let store = answerCoachQuestion(startCoachRun(emptyCoachStore(), [entry], 'later'), sessions, first.questions[0].answer, later)
  assert.equal(store.attempts[0].laterCheck, true)
  assert.equal(topicSummary(first, sessions, store, time + DAY).label, 'Correct on a later check')
  store = answerCoachQuestion(startCoachRun(store, [entry], 'repeat'), sessions, first.questions[0].answer, new Date(time + DAY * 2).toISOString())
  assert.equal(store.attempts[1].previouslySeen, true)
  assert.equal(store.attempts[1].laterCheck, false)
  let helped = revealCoachHint(startCoachRun(emptyCoachStore(), [entry], 'helped'))
  assert.deepEqual(restoreCoachStore(helped), helped)
  helped = answerCoachQuestion(helped, sessions, first.questions[0].answer, later)
  assert.equal(helped.attempts[0].laterCheck, false)
  assert.equal(helped.attempts[0].assisted, true)
})
test('review uses a fresh alternate after the first question; exhausted bank remains practice', () => {
  let store = answerCoachQuestion(startCoachRun(emptyCoachStore(), [{ topicId: first.id, itemId: first.questions[0].id, mode: 'review' }], 'first'), sessions, first.questions[0].answer, at)
  const next = makeReviewEntries({ 1: sessions[1] }, store, time + DAY, 'review', true).find(e => e.topicId === first.id)!
  assert.equal(next.itemId, first.questions[2].id)
  store = answerCoachQuestion(startCoachRun(store, [next], 'alternate'), sessions, first.questions[2].answer, later)
  assert.equal(store.attempts[1].laterCheck, true)
  const repeated = makeReviewEntries({ 1: sessions[1] }, store, time + DAY * 2, 'review', true).find(e => e.topicId === first.id)!
  assert.equal(repeated.itemId, first.questions[0].id)
})
test('lesson/review exposure postpones next later check without writing into lesson records', () => {
  const before = JSON.stringify(sessions)
  const practice = new Date(time + DAY / 2).toISOString()
  const store = answerCoachQuestion(startCoachRun(emptyCoachStore(), [{ topicId: first.id, itemId: first.questions[0].id, mode: 'review' }], 'practice'), sessions, first.questions[0].answer, practice)
  assert.equal(topicSummary(first, sessions, store, time + DAY).due, false)
  assert.equal(topicSummary(first, sessions, store, time + DAY * 1.5).due, true)
  assert.equal(JSON.stringify(sessions), before)
})
test('invalid responses, unlearned answers, forged grading and corrupt storage are rejected', () => {
  const store = startCoachRun(emptyCoachStore(), [{ topicId: first.id, itemId: first.questions[0].id, mode: 'review' }], 'valid')
  assert.equal(answerCoachQuestion(store, {}, 1, at), store)
  assert.equal(answerCoachQuestion(store, sessions, 99, at), store)
  assert.equal(restoreCoachStore(null), null)
  assert.equal(restoreCoachStore({ ...store, version: 0 }), null)
  assert.equal(restoreCoachStore({ ...store, run: { ...store.run, entries: [null] } }), null)
  const answered = answerCoachQuestion(store, sessions, 0, at)
  assert.equal(restoreCoachStore({ ...answered, attempts: [{ ...answered.attempts[0], correct: true }] }), null)
  assert.equal(restoreCoachStore({ ...answered, attempts: [{ ...answered.attempts[0], laterCheck: true }] }), null)
})
test('reopening an answer or reminder postpones checks even without another submission', () => {
  const exposed = recordCoachExposure(emptyCoachStore(), first.id, new Date(time + DAY / 2).toISOString())
  assert.equal(topicSummary(first, sessions, exposed, time + DAY).due, false)
  assert.equal(topicSummary(first, sessions, exposed, time + DAY * 1.5).due, true)
  assert.deepEqual(restoreCoachStore(exposed), exposed)
  assert.equal(restoreCoachStore({ ...exposed, exposures: { invented: at } }), null)
})
console.log(`${tests} Science Coach checks passed.`)

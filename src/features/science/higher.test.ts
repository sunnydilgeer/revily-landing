import assert from 'node:assert/strict'
import { allScienceLessons, scienceEntryById } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'
import { sectionRanges } from './scienceProgress'
import { higherAdditions } from './higher/additions'
import { forTier, higherStateIds } from './tier'

// Foundation is the catalogue exactly as authored: no Higher screen, section or frame can reach it.
for (const entry of allScienceLessons) {
  assert.equal(forTier(entry, 'foundation'), entry)
  for (const state of entry.lesson.states) assert.ok(!higherStateIds.has(state.id), `${state.id} is Higher-only but in Foundation ${entry.lesson.id}`)
  for (const section of entry.sections) assert.ok(!higherStateIds.has(section.id))
  for (const id of Object.keys(entry.frames)) assert.ok(!higherStateIds.has(id))
}

const allFoundationIds = new Set(allScienceLessons.flatMap(entry => entry.lesson.states.map(state => state.id)))
for (const add of higherAdditions) {
  const foundation = scienceEntryById(add.lessonId)
  assert.ok(foundation, `${add.lessonId} is not a lesson`)
  const higher = forTier(foundation, 'higher')
  // Higher keeps every Foundation screen, in order, and adds its own just before `before`.
  const ids = higher.lesson.states.map(state => state.id)
  assert.deepEqual(ids.filter(id => !higherStateIds.has(id)), foundation.lesson.states.map(state => state.id))
  assert.equal(ids.indexOf(add.before), ids.indexOf(add.states[add.states.length - 1].id) + 1)
  for (const state of add.states) assert.ok(!allFoundationIds.has(state.id), `${state.id} clashes with a Foundation id`)
  assert.equal(add.states[0].id, add.section.id)
  // Marked with the Higher badge, not a "Higher:" title.
  assert.equal(add.section.higher, true)
  assert.ok(!/higher/i.test(add.section.label), `${add.section.id} names Higher in its title; the badge does that`)
  assert.ok(sectionRanges(higher.lesson, higher.sections).find(range => range.id === add.section.id)?.higher)
  assert.ok(higher.frames[add.section.id]?.length > 0)
  assert.ok(sectionRanges(higher.lesson, higher.sections).some(range => range.id === add.section.id))
  // Its own version, so its own saved session: switching tier never invalidates either one.
  assert.notEqual(higher.lesson.contentVersion, foundation.lesson.contentVersion)
  assert.notEqual(createPreviewSessionEngine(higher.lesson).storageKey, createPreviewSessionEngine(foundation.lesson).storageKey)
  for (const state of add.states) if (state.kind === 'choice') {
    assert.equal(new Set(state.options.map(option => option.label)).size, state.options.length)
    assert.ok(state.options.some(option => option.id === state.answerId))
  }
  // A full Higher run of the lesson completes.
  const engine = createPreviewSessionEngine(higher.lesson)
  let session = engine.createPreviewSession('higher-test')
  const at = '2026-10-01T00:00:00.000Z'
  for (const state of higher.lesson.states) {
    assert.equal(session.currentId, state.id)
    if (state.kind === 'choice') session = engine.previewReducer(session, { type: 'answer', response: state.answerId, at })
    if (state.kind === 'written') session = engine.previewReducer(session, { type: 'answer', response: 'An answer for review.', at })
    session = engine.previewReducer(session, { type: 'continue', at })
  }
  assert.equal(session.completedIds.length, higher.lesson.states.length)
}
assert.equal(higherAdditions.length, 5)
console.log('Higher tier tests passed')

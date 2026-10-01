import assert from 'node:assert/strict'
import { allScienceLessons, chemistryLessons, getScienceLesson, nextScienceLesson, parseScienceLessonRef, scienceChapterFor, scienceEntryById, scienceEntryHref, scienceLessonLabel, scienceLessonsFor, scienceSubjectLessonHref, scienceSubjects } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'
import { decodeScienceLastLesson, encodeScienceLastLesson, readScienceProgress, scienceUnits, scienceUnitsForTier, sectionRanges } from './scienceProgress'
import { higherAdditions } from './higher/additions'
import { higherLessons } from './higher/lessons'
import { buildScienceDecks } from './cards/decks'
import {
  chapterLessonsForTier, forTier, getScienceLessonForTier, higherStateIds, nextScienceLessonForTier, parseScienceLessonRefForTier, scienceCatalogueForTier, scienceLessonsForTier,
} from './tier'

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
assert.equal(higherAdditions.length, 22)

// Higher-only lessons. Foundation never sees one: not in a catalogue, list, count, unit, deck, next link, saved last lesson or URL.
const higherIds = new Set(higherLessons.map(item => item.lesson.id))
const isHigherLesson = (item: { lesson: { id: string } } | null) => item !== null && higherIds.has(item.lesson.id)
assert.equal(scienceCatalogueForTier('foundation'), allScienceLessons)
assert.ok(!allScienceLessons.some(isHigherLesson))
for (const { subject, lessons } of scienceSubjects) {
  assert.equal(scienceLessonsForTier(subject, 'foundation'), scienceLessonsFor(subject))
  assert.ok(!lessons.some(isHigherLesson))
  for (const item of lessons) {
    assert.equal(nextScienceLessonForTier(item, 'foundation'), nextScienceLesson(item))
    assert.equal(getScienceLessonForTier(subject, item.number, 'foundation'), item)
    assert.equal(getScienceLessonForTier(subject, item.number, 'higher'), item)
    // Existing numbers, labels, URLs and saved last-lesson values are unchanged.
    assert.equal(scienceLessonLabel(item), String(item.number))
    assert.equal(scienceEntryHref(item), scienceSubjectLessonHref(subject, item.number))
    assert.deepEqual(parseScienceLessonRefForTier(subject, String(item.number), 'foundation'), { subject, number: item.number })
    assert.deepEqual(parseScienceLessonRefForTier(subject, String(item.number), 'higher'), { subject, number: item.number })
    assert.equal(decodeScienceLastLesson(encodeScienceLastLesson(item), 'higher'), item)
  }
}
assert.deepEqual(scienceUnitsForTier('foundation'), scienceUnits)
for (const unit of scienceUnits) assert.ok(!unit.lessons.some(isHigherLesson))
assert.ok(!buildScienceDecks().some(deck => higherIds.has(deck.lessonId)))

for (const item of higherLessons) {
  const label = `${Math.floor(item.number)}H`
  // N + 0.5 after Lesson N, shown and linked as 'NH', with an H id, its own screens and its own saved session.
  assert.equal(item.higherOnly, true)
  assert.equal(item.number, Math.floor(item.number) + 0.5)
  assert.equal(item.label, label)
  assert.equal(item.lesson.strand, item.subject)
  assert.match(item.lesson.id, new RegExp(`^[A-Z]-[A-Z]+-0*${Math.floor(item.number)}H-[A-Z]$`))
  assert.ok(!scienceEntryById(item.lesson.id), `${item.lesson.id} clashes with a Foundation lesson id`)
  for (const state of item.lesson.states) assert.ok(!allFoundationIds.has(state.id) && !higherStateIds.has(state.id), `${state.id} clashes with another screen id`)
  assert.ok(!allScienceLessons.some(entry => createPreviewSessionEngine(entry.lesson).storageKey === createPreviewSessionEngine(item.lesson).storageKey))
  assert.ok(item.sections.length > 0 && item.sections.every(section => item.lesson.states.some(state => state.id === section.id)))
  assert.equal(forTier(item, 'higher'), item)
  // Foundation: not found by number, by URL, by saved last lesson; never a next lesson.
  assert.equal(getScienceLesson(item.subject, item.number), null)
  assert.equal(getScienceLessonForTier(item.subject, item.number, 'foundation'), null)
  for (const value of [label, label.toLowerCase(), String(item.number)]) {
    assert.equal(parseScienceLessonRef(item.subject, value), null)
    assert.equal(parseScienceLessonRefForTier(item.subject, value, 'foundation'), null)
  }
  assert.equal(decodeScienceLastLesson(encodeScienceLastLesson(item)), null)
  assert.equal(decodeScienceLastLesson(encodeScienceLastLesson(item), 'foundation'), null)
  // Higher: found, linked as ?lesson=NH, in Lesson N's chapter, between Lesson N and N + 1.
  const ref = { subject: item.subject, number: item.number }
  assert.equal(getScienceLessonForTier(item.subject, item.number, 'higher'), item)
  assert.deepEqual(parseScienceLessonRefForTier(item.subject, label, 'higher'), ref)
  assert.deepEqual(parseScienceLessonRefForTier(item.subject, label.toLowerCase(), 'higher'), ref)
  assert.equal(parseScienceLessonRefForTier(item.subject, String(item.number), 'higher'), null)
  assert.equal(decodeScienceLastLesson(encodeScienceLastLesson(item), 'higher'), item)
  assert.equal(scienceEntryHref(item), `/preview/science?subject=${item.subject}&lesson=${label}`)
  const before = getScienceLesson(item.subject, Math.floor(item.number))!
  assert.equal(scienceChapterFor(item), scienceChapterFor(before))
  assert.ok(chapterLessonsForTier(scienceChapterFor(item)!, 'higher').includes(item))
  assert.ok(!chapterLessonsForTier(scienceChapterFor(item)!, 'foundation').includes(item))
  assert.equal(nextScienceLessonForTier(before, 'higher'), item)
  assert.equal(nextScienceLessonForTier(item, 'higher'), getScienceLesson(item.subject, Math.floor(item.number) + 1))
  assert.ok(scienceCatalogueForTier('higher').includes(item))
  // A full run of the lesson completes.
  const engine = createPreviewSessionEngine(item.lesson)
  let session = engine.createPreviewSession('higher-lesson-test')
  const at = '2026-10-01T00:00:00.000Z'
  for (const state of item.lesson.states) {
    assert.equal(session.currentId, state.id)
    if (state.kind === 'choice') session = engine.previewReducer(session, { type: 'answer', response: state.answerId, at })
    if (state.kind === 'written') session = engine.previewReducer(session, { type: 'answer', response: 'An answer for review.', at })
    session = engine.previewReducer(session, { type: 'continue', at })
  }
  assert.equal(session.completedIds.length, item.lesson.states.length)
}

// Chemistry Lesson 20H (Moles): Higher order 20 → 20H → 21 in C3; Foundation 20 → 21 as before.
const moles = higherLessons.find(item => item.lesson.id === 'C-MOL-020H-C')!
assert.ok(moles)
assert.deepEqual([moles.subject, moles.number, moles.label, moles.title], ['chemistry', 20.5, '20H', 'Moles'])
assert.deepEqual(scienceLessonsForTier('chemistry', 'foundation').map(scienceLessonLabel), chemistryLessons.map(item => String(item.number)))
assert.deepEqual(scienceLessonsForTier('chemistry', 'higher').map(scienceLessonLabel).slice(18, 23), ['19', '20', '20H', '21', '22'])
assert.equal(scienceLessonsForTier('chemistry', 'higher').length, chemistryLessons.length + higherLessons.filter(item => item.subject === 'chemistry').length)
assert.equal(scienceCatalogueForTier('higher').length, allScienceLessons.length + higherLessons.length)
assert.equal(nextScienceLessonForTier(getScienceLesson('chemistry', 20)!, 'foundation')?.number, 21)
assert.equal(nextScienceLessonForTier(getScienceLesson('chemistry', 20)!, 'higher'), moles)
assert.equal(nextScienceLessonForTier(moles, 'higher')?.number, 21)
const c3 = (tier: 'foundation' | 'higher') => scienceUnitsForTier(tier).find(unit => unit.code === 'C3')!.lessons.map(scienceLessonLabel)
assert.deepEqual(c3('foundation'), ['18', '19', '20', '21'])
assert.deepEqual(c3('higher'), ['18', '19', '20', '20H', '21'])
assert.equal(scienceEntryHref(moles), '/preview/science?subject=chemistry&lesson=20H')
assert.equal(scienceEntryHref(getScienceLesson('chemistry', 20)!), '/preview/science?subject=chemistry&lesson=20')
assert.equal(scienceEntryHref(getScienceLesson('chemistry', 21)!), '/preview/science?subject=chemistry&lesson=21')
assert.equal(encodeScienceLastLesson(moles), 'chemistry:20H')
for (const bad of ['chemistry:20H', 'chemistry:20h', 'chemistry:20.5', '20H']) assert.equal(decodeScienceLastLesson(bad, 'foundation'), null)
assert.equal(parseScienceLessonRefForTier('chemistry', '20H', 'foundation'), null)
assert.equal(parseScienceLessonRefForTier(undefined, '20H', 'higher'), null, 'Biology has no Lesson 20H')
// C4 Higher-only lessons: 22H after 22 and 25H after 25; Foundation C4 unchanged.
const c4 = (tier: 'foundation' | 'higher') => scienceUnitsForTier(tier).find(unit => unit.code === 'C4')!.lessons.map(scienceLessonLabel)
assert.ok(!c4('foundation').some(label => label.endsWith('H')))
assert.deepEqual(c4('higher').filter(label => ['22', '22H', '23', '25', '25H', '26'].includes(label)), ['22', '22H', '23', '25', '25H', '26'])
const unit = (code: string, tier: 'foundation' | 'higher') => scienceUnitsForTier(tier).find(item => item.code === code)!.lessons.map(scienceLessonLabel)
assert.deepEqual(unit('C5', 'higher').slice(-2), ['30', '30H'])
assert.deepEqual(unit('C6', 'higher').filter(label => ['36', '36H'].includes(label)), ['36', '36H'])
assert.deepEqual(unit('C10', 'higher').filter(label => ['50', '50H', '51'].includes(label)), ['50', '50H', '51'])
for (const code of ['C5', 'C6', 'C10']) assert.ok(!unit(code, 'foundation').some(label => label.endsWith('H')))
for (const [label, number] of [['22H', 22.5], ['25H', 25.5], ['30H', 30.5], ['36H', 36.5], ['50H', 50.5]] as const) {
  assert.equal(parseScienceLessonRefForTier('chemistry', label, 'foundation'), null)
  assert.equal(parseScienceLessonRefForTier('chemistry', label, 'higher')?.number, number)
}
for (const bad of ['21H', '20HH', 'H', '20 H', '020H']) assert.equal(parseScienceLessonRefForTier('chemistry', bad, 'higher'), null)

// Saved progress for the lesson is read for Higher only, even when a session is on this device.
const storage = new Map<string, string>()
;(globalThis as { window?: unknown }).window = { localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => { storage.set(key, value) } } }
const molesEngine = createPreviewSessionEngine(moles.lesson)
const first = moles.lesson.states[0]
const started = first.kind === 'choice'
  ? molesEngine.previewReducer(molesEngine.createPreviewSession('saved'), { type: 'answer', response: first.answerId, at: '2026-10-01T00:00:00.000Z' })
  : molesEngine.previewReducer(molesEngine.createPreviewSession('saved'), { type: 'continue', at: '2026-10-01T00:00:00.000Z' })
storage.set(molesEngine.storageKey, JSON.stringify(started))
assert.equal(readScienceProgress('foundation')[moles.lesson.id], undefined)
assert.equal(readScienceProgress('higher')[moles.lesson.id]?.started, true)
delete (globalThis as { window?: unknown }).window
console.log('Higher tier tests passed')

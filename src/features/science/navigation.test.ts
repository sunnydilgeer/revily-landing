import assert from 'node:assert/strict'
import { scienceChapters, scienceHubHref, scienceLessons, scienceLessonHref, scienceLessonHrefById, scienceLessonNumberById, parseScienceLesson, TRANSPORT_EXAM_LESSON_ID } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'

assert.deepEqual(scienceLessons.map(item => item.number), Array.from({ length: 47 }, (_, i) => i + 1))
assert.equal(new Set(scienceLessons.map(item => item.lesson.id)).size, 47)
assert.deepEqual(scienceLessons.slice(0, 12).map(item => item.folder), ['1', '1b', '2', '2b', '3', '4', '5', '5b', '6', '6b', '6c', '7'])
// Old lesson N (N >= 7) is now N + 5; chapters cover every lesson exactly once, in order.
for (let old = 7; old <= 26; old++) assert.equal(scienceLessons[old + 4].folder, String(old))
assert.deepEqual(scienceChapters.flatMap(chapter => [...chapter.lessonNumbers]), scienceLessons.map(item => item.number))
assert.deepEqual(scienceChapters.map(chapter => [chapter.code, chapter.lessonNumbers[0], chapter.lessonNumbers[chapter.lessonNumbers.length - 1]]),
  [['B1', 1, 11], ['B2', 12, 17], ['B2b', 18, 21], ['B2c', 22, 23], ['B3', 24, 30], ['B4', 31, 34], ['B5', 35, 41], ['B6', 42, 45], ['B6b', 46, 47]])
for (const item of scienceLessons) {
  assert.equal(scienceLessonNumberById(item.lesson.id), item.number)
  assert.equal(scienceLessonHrefById(item.lesson.id), scienceLessonHref(item.number))
}
assert.equal(scienceLessonNumberById('unknown'), null)
assert.equal(scienceLessonHrefById('unknown'), scienceHubHref())
assert.equal(scienceLessonNumberById(TRANSPORT_EXAM_LESSON_ID), 11)
assert.equal(scienceHubHref(), '/preview?subject=science')
for (const item of scienceLessons) {
  const href = new URL(scienceLessonHref(item.number), 'http://localhost:3000')
  assert.equal(href.pathname, '/preview/science')
  assert.equal(href.searchParams.get('lesson'), String(item.number))
  assert.equal(href.searchParams.get('variant'), null)
  assert.equal(parseScienceLesson(String(item.number)), item.number)
  assert.ok(item.title && item.detail)
}
assert.equal(scienceLessonHref(1, 'B1-02'), '/preview/science?lesson=1&activity=B1-02')
for (const invalid of [undefined, '', '0', '48', 'abc', '01', ['1'], ['1', '2']]) assert.equal(parseScienceLesson(invalid), null)

// Storage keys are the ones testers already have on their devices (the easier-wording "-B" records).
const engines = scienceLessons.map(item => createPreviewSessionEngine(item.lesson))
assert.equal(new Set(engines.map(engine => engine.storageKey)).size, 47)
for (const [index, engine] of engines.entries()) {
  const lesson = scienceLessons[index].lesson
  assert.ok(lesson.id.endsWith('-B'), `${lesson.id} must keep its saved-progress ID`)
  assert.equal(engine.storageKey, `revily:science:${lesson.id}:${lesson.contentVersion}:preview`)
}
assert.equal(engines[0].storageKey, 'revily:science:B-CELL-001-B:0.2.0:preview')
for (const engine of engines) {
  const record = engine.createPreviewSession('navigation-check')
  assert.deepEqual(engine.restorePreviewSession(record), record)
  for (const other of engines) if (other !== engine) assert.equal(other.restorePreviewSession(record), null)
}
// Lessons are renumbered as the course grows, so learner-facing copy refers to other lessons by topic, not number.
for (const item of scienceLessons) {
  const frames = Object.values(item.frames as Record<string, Array<{ label: string; summary: string; cue: string; text: string }>>).flat().map(f => [f.label, f.summary, f.cue, f.text].join(' '))
  const states = item.lesson.states.map(s => s.kind === 'teaching' ? [s.title, s.body || '', ...(s.steps || [])].join(' ')
    : [s.title, s.hint, ...s.explanation.steps, s.explanation.answer, ...(s.kind === 'choice' ? s.options.map(o => o.label + ' ' + (o.feedback || '')) : [s.instruction || '', s.placeholder || ''])].join(' '))
  for (const text of [...frames, ...states]) assert.doesNotMatch(text, /\b[Ll]essons? \d/, `${item.lesson.id}: refer to other lessons by topic, not number`)
}
console.log('PASS one science catalogue, lesson routes, invalid query fallback and isolated saved-progress records')

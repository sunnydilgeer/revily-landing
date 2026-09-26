import assert from 'node:assert/strict'
import { scienceHubHref, scienceLessons, scienceLessonHref, parseScienceLesson } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'

assert.deepEqual(scienceLessons.map(item => item.number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26])
assert.equal(new Set(scienceLessons.map(item => item.lesson.id)).size, 26)
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
for (const invalid of [undefined, '', '0', '27', 'abc', '01', ['1'], ['1', '2']]) assert.equal(parseScienceLesson(invalid), null)

// Storage keys are the ones testers already have on their devices (the easier-wording "-B" records).
const engines = scienceLessons.map(item => createPreviewSessionEngine(item.lesson))
assert.equal(new Set(engines.map(engine => engine.storageKey)).size, 26)
for (const [index, engine] of engines.entries()) {
  const lesson = scienceLessons[index].lesson
  assert.ok(lesson.id.endsWith('-B'), `${lesson.id} must keep its saved-progress ID`)
  assert.equal(engine.storageKey, `revily:science:${lesson.id}:${lesson.contentVersion}:preview`)
}
assert.equal(engines[0].storageKey, 'revily:science:B-CELL-001-B:0.1.0:preview')
for (const engine of engines) {
  const record = engine.createPreviewSession('navigation-check')
  assert.deepEqual(engine.restorePreviewSession(record), record)
  for (const other of engines) if (other !== engine) assert.equal(other.restorePreviewSession(record), null)
}
console.log('PASS one science catalogue, lesson routes, invalid query fallback and isolated saved-progress records')

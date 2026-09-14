import assert from 'node:assert/strict'
import { scienceLessons, scienceLessonHref, parseScienceLesson } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'

assert.deepEqual(scienceLessons.map(item => item.number), [1, 2, 3])
assert.equal(new Set(scienceLessons.map(item => item.lesson.id)).size, 3)
for (const item of scienceLessons) {
  const href = scienceLessonHref(item.number)
  assert.equal(new URL(href, 'http://localhost:3000').pathname, '/preview/science')
  assert.equal(parseScienceLesson(String(item.number)), item.number)
  assert.ok(item.title && item.detail)
}
for (const invalid of [undefined, '', '0', '4', 'abc', '01', ['1'], ['1', '2']]) assert.equal(parseScienceLesson(invalid), null)
const engines = scienceLessons.map(item => createPreviewSessionEngine(item.lesson))
assert.equal(new Set(engines.map(engine => engine.storageKey)).size, 3)
for (const engine of engines) {
  const record = engine.createPreviewSession('navigation-check')
  assert.deepEqual(engine.restorePreviewSession(record), record)
  for (const other of engines) if (other !== engine) assert.equal(other.restorePreviewSession(record), null)
}
console.log('PASS unified science routes, invalid query fallback, lesson catalogue and isolated records')

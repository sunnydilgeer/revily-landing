import assert from 'node:assert/strict'
import { getScienceHubLessons, getScienceLessons, scienceLessons, scienceLessonsB, scienceLessonHref, parseScienceLesson } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'

assert.deepEqual(scienceLessons.map(item => item.number), [1, 2, 3, 4, 5, 6])
assert.deepEqual(scienceLessonsB.map(item => item.number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22])
assert.deepEqual(getScienceLessons('a'), scienceLessons)
assert.deepEqual(getScienceLessons('b'), scienceLessonsB)
assert.deepEqual(getScienceHubLessons('a').map(item => item.number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22])
assert.deepEqual(getScienceHubLessons('b'), scienceLessonsB)
assert.equal(new Set(scienceLessons.map(item => item.lesson.id)).size, 6)
assert.equal(new Set(scienceLessonsB.map(item => item.lesson.id)).size, 22)
for (const item of scienceLessonsB) {
  const href = scienceLessonHref(item.number, item.number >= 7 ? 'b' : 'a')
  assert.equal(new URL(href, 'http://localhost:3000').pathname, '/preview/science')
  if (item.number >= 7) assert.equal(new URL(href, 'http://localhost:3000').searchParams.get('variant'), 'b')
  assert.equal(parseScienceLesson(String(item.number)), item.number)
  assert.ok(item.title && item.detail)
}
for (const invalid of [undefined, '', '0', '23', 'abc', '01', ['1'], ['1', '2']]) assert.equal(parseScienceLesson(invalid), null)
const engines = [...scienceLessons, ...scienceLessonsB].map(item => createPreviewSessionEngine(item.lesson))
assert.equal(new Set(engines.map(engine => engine.storageKey)).size, 28)
for (const engine of engines) {
  const record = engine.createPreviewSession('navigation-check')
  assert.deepEqual(engine.restorePreviewSession(record), record)
  for (const other of engines) if (other !== engine) assert.equal(other.restorePreviewSession(record), null)
}
console.log('PASS unified science routes, easier-only organisation lessons, invalid query fallback and isolated records')

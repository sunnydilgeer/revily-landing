import assert from 'node:assert/strict'
import { scienceChapters, scienceHubHref, scienceLessons, scienceLessonHref, scienceLessonHrefById, scienceLessonNumberById, parseScienceLesson, TRANSPORT_EXAM_LESSON_ID } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'
import { allScienceChapters, allScienceLessons, chemistryChapters, chemistryLessons, getScienceLesson, nextScienceLesson, parseScienceLessonRef, scienceChapterFor, scienceChaptersFor, scienceEntryById, scienceLessonDir, scienceLessonsFor, scienceSubjectLessonHref } from './lessonNavigation'
import { decodeScienceLastLesson, encodeScienceLastLesson, scienceUnits } from './scienceProgress'

assert.deepEqual(scienceLessons.map(item => item.number), Array.from({ length: 58 }, (_, i) => i + 1))
assert.equal(new Set(scienceLessons.map(item => item.lesson.id)).size, 58)
assert.deepEqual(scienceLessons.slice(0, 12).map(item => item.folder), ['1', '1b', '2', '2b', '3', '4', '5', '5b', '6', '6b', '6c', '7'])
// Old lesson N (N >= 7) is now N + 5; chapters cover every lesson exactly once, in order.
for (let old = 7; old <= 26; old++) assert.equal(scienceLessons[old + 4].folder, String(old))
assert.deepEqual(scienceChapters.flatMap(chapter => [...chapter.lessonNumbers]), scienceLessons.map(item => item.number))
assert.deepEqual(scienceChapters.map(chapter => [chapter.code, chapter.lessonNumbers[0], chapter.lessonNumbers[chapter.lessonNumbers.length - 1]]),
  [['B1', 1, 11], ['B2', 12, 17], ['B2b', 18, 21], ['B2c', 22, 23], ['B3', 24, 30], ['B4', 31, 34], ['B5', 35, 41], ['B6', 42, 45], ['B6b', 46, 50], ['B7', 51, 58]])
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
for (const invalid of [undefined, '', '0', '59', 'abc', '01', ['1'], ['1', '2']]) assert.equal(parseScienceLesson(invalid), null)

// Storage keys are the ones testers already have on their devices (the easier-wording "-B" records).
const engines = scienceLessons.map(item => createPreviewSessionEngine(item.lesson))
assert.equal(new Set(engines.map(engine => engine.storageKey)).size, 58)
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

// ---------- Per-subject numbering: Biology unchanged, Chemistry restarts at Lesson 1 ----------
// Biology: same numbers, same URLs, same parser, same last-lesson value as before subjects existed.
assert.equal(scienceLessonsFor('biology'), scienceLessons)
for (const item of scienceLessons) {
  assert.equal(item.subject, 'biology')
  assert.equal(item.lesson.strand, 'biology')
  assert.equal(getScienceLesson('biology', item.number), item)
  assert.equal(scienceSubjectLessonHref('biology', item.number), scienceLessonHref(item.number))
  assert.equal(scienceSubjectLessonHref('biology', item.number, 'X-01'), scienceLessonHref(item.number, 'X-01'))
  assert.deepEqual(parseScienceLessonRef(undefined, String(item.number)), { subject: 'biology', number: item.number })
  assert.deepEqual(parseScienceLessonRef('biology', String(item.number)), { subject: 'biology', number: item.number })
  assert.equal(scienceChapterFor(item)?.code, scienceChapters.find(chapter => (chapter.lessonNumbers as readonly number[]).includes(item.number))?.code)
  assert.equal(scienceLessonDir(item), `lesson-${item.folder}`)
  assert.equal(encodeScienceLastLesson(item), String(item.number))
  assert.equal(decodeScienceLastLesson(String(item.number)), item)
}
assert.equal(scienceLessonHref(1), '/preview/science?lesson=1')
assert.equal(nextScienceLesson(scienceLessons[0])?.number, 2)
assert.equal(nextScienceLesson(scienceLessons[57]), null, 'The next-lesson chain stops at the end of a subject')
for (const invalid of [undefined, '', '0', '59', '01', ['1']]) assert.equal(parseScienceLessonRef(undefined, invalid), null)
for (const subject of ['physics', 'maths', '', ['chemistry']]) assert.equal(parseScienceLessonRef(subject, '1'), null)
// Chemistry: its own chapters, even before any lesson is built; hrefs carry subject=chemistry.
assert.deepEqual(chemistryChapters.map(chapter => [chapter.subject, chapter.code, [...chapter.lessonNumbers]]),
  [['chemistry', 'C1a', [1, 2, 3, 4]], ['chemistry', 'C1b', [5, 6, 7, 8, 9, 10, 11]], ['chemistry', 'C2', [12, 13, 14, 15, 16, 17]], ['chemistry', 'C3', [18, 19, 20, 21]], ['chemistry', 'C4', [22, 23, 24, 25, 26, 27]], ['chemistry', 'C5', [28, 29, 30]], ['chemistry', 'C6', [31, 32, 33, 34, 35, 36]], ['chemistry', 'C7', [37, 38, 39, 40]]])
assert.equal(chemistryChapters[0].title, 'Atoms, elements, compounds and mixtures')
assert.equal(chemistryChapters[1].title, 'The periodic table')
assert.deepEqual(scienceChaptersFor('chemistry'), chemistryChapters)
assert.deepEqual(scienceUnits.filter(unit => unit.subject === 'chemistry').map(unit => [unit.code, unit.lessons.length]),
  chemistryChapters.map(chapter => [chapter.code, chemistryLessons.filter(item => (chapter.lessonNumbers as readonly number[]).includes(item.number)).length]))
assert.deepEqual(allScienceChapters.map(chapter => chapter.code), [...scienceChapters.map(chapter => chapter.code), 'C1a', 'C1b', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'])
assert.equal(scienceSubjectLessonHref('chemistry', 1), '/preview/science?subject=chemistry&lesson=1')
assert.equal(scienceSubjectLessonHref('chemistry', 3, 'C3-02'), '/preview/science?subject=chemistry&lesson=3&activity=C3-02')
assert.equal(encodeScienceLastLesson({ subject: 'chemistry', number: 1 }), 'chemistry:1')
assert.equal(scienceLessonDir({ subject: 'chemistry', folder: '1' }), 'chemistry/lesson-1')
for (const bad of [null, '', 'abc', '0', 'physics:1', 'chemistry:0', 'chemistry:99']) assert.equal(decodeScienceLastLesson(bad), null)
// Rules every Chemistry lesson must keep once registered (they hold for an empty list too).
assert.deepEqual(chemistryLessons.map(item => item.number), chemistryLessons.map((_, i) => i + 1), 'Chemistry lessons are numbered 1, 2, 3 … in order')
for (const item of chemistryLessons) {
  assert.equal(item.subject, 'chemistry')
  assert.equal(item.lesson.strand, 'chemistry')
  assert.match(item.lesson.id, /^C-[A-Z]+-\d{3}[A-Z]?-C$/, `${item.lesson.id} must follow C-<TOPIC>-<NNN>-C`)
  assert.ok(scienceChapterFor(item), `Chemistry Lesson ${item.number} must be in a chemistry chapter`)
  assert.equal(getScienceLesson('chemistry', item.number), item)
  assert.deepEqual(parseScienceLessonRef('chemistry', String(item.number)), { subject: 'chemistry', number: item.number })
  assert.equal(decodeScienceLastLesson(`chemistry:${item.number}`), item)
  for (const state of item.lesson.states) assert.match(state.id, /^C\d+-\d{2}$/, `${state.id}: Chemistry screen ids are C<lesson>-NN`)
}
assert.equal(getScienceLesson('chemistry', 1), chemistryLessons[0] ?? null)
assert.equal(parseScienceLessonRef('chemistry', String(chemistryLessons.length + 1)), null, 'Unbuilt Chemistry lessons fall back to the hub')
// Across subjects: lesson ids, storage keys and screen ids never collide (numbers may).
assert.equal(new Set(allScienceLessons.map(item => item.lesson.id)).size, allScienceLessons.length)
assert.equal(new Set(allScienceLessons.map(item => createPreviewSessionEngine(item.lesson).storageKey)).size, allScienceLessons.length)
for (const item of allScienceLessons) assert.equal(scienceEntryById(item.lesson.id), item)
const allStateIds = allScienceLessons.flatMap(item => item.lesson.states.map(state => state.id))
assert.equal(new Set(allStateIds).size, allStateIds.length, 'Screen ids are unique across every Science lesson (revision card ids use them)')
console.log('PASS per-subject numbering (Biology unchanged, Chemistry C1a/C1b from Lesson 1), one science catalogue, lesson routes, invalid query fallback and isolated saved-progress records')

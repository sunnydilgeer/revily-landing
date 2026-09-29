import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CellBiologyVisual } from './components/CellBiologyVisuals'
import { LessonVisual } from './components/LessonVisual'
import { TeachingChunk, WorkedReasoning } from './components/TeachingChunk'
import { buildScienceDecks } from './cards/decks'
import { scienceFacts } from './cards/facts'
import { evidenceProfile, gradeResponse, progress, recommendedNext } from './engine'
import { chemistryChapters, chemistryLessons, getScienceLesson, nextScienceLesson, parseScienceLessonRef, scienceChapterFor, scienceLessonDir, scienceSubjectLessonHref, scienceSubjects } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'
import { scienceUnits } from './scienceProgress'
import { lessonC1, atomSections } from './chemistry/lesson-1/lesson'
import { atomFrames } from './chemistry/lesson-1/teachingFrames'
import type { EvidenceDimension, ScienceState } from './types'

let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
const lesson = lessonC1
const at = '2026-09-29T09:00:00.000Z'
const learnerText = (state: ScienceState) => state.kind === 'teaching'
  ? [state.title, state.body || '', ...(state.steps || [])].join(' ')
  : [state.title, state.hint, ...state.explanation.steps, state.explanation.answer, ...(state.kind === 'choice' ? state.options.map(o => o.label) : [])].join(' ')
const count = (html: string, particle: string) => (html.match(new RegExp(`data-particle="${particle}"`, 'g')) || []).length

check(`${lesson.id}: metadata, source links, sections and sampled requirements`, () => {
  assert.equal(lesson.id, 'C-ATM-001-C')
  assert.equal(lesson.strand, 'chemistry')
  assert.equal(lesson.contentVersion, '0.1.0')
  assert.equal(lesson.reviewStatus, 'draftNeedsTeacherReview')
  assert.equal(lesson.qualification, 'AQA-8464F')
  assert.equal(lesson.retrieval.length, 0)
  assert.equal(new Set(lesson.states.map(state => state.id)).size, lesson.states.length)
  lesson.states.forEach(state => assert.match(state.id, /^C1-\d{2}$/))
  const contexts = lesson.states.flatMap(state => state.kind === 'teaching' ? [] : [state.contextId])
  assert.equal(new Set(contexts).size, contexts.length)
  const sourceIds = lesson.sources.map(source => source.id)
  lesson.sources.forEach(source => { assert.ok(source.url.startsWith('https://')); for (const spec of ['5.1.1.1', '5.1.1.4', '5.1.1.5', '5.1.1.6']) assert.ok(source.locator.includes(spec)) })
  lesson.states.forEach(state => {
    assert.ok(state.specRefs.length && state.specRefs.every(ref => ref.startsWith('5.1.1')))
    state.sourceIds.forEach(sourceId => assert.ok(sourceIds.includes(sourceId)))
  })
  assert.equal(atomSections[0].id, lesson.states[0].id)
  assert.equal(atomSections[0].label, 'Start here')
  assert.equal(atomSections.at(-1)!.label, 'On your own')
  atomSections.forEach(section => assert.ok(lesson.states.some(state => state.id === section.id)))
  Object.entries(lesson.requirements).forEach(([dimension, rule]) => rule.inSession.forEach(id => {
    const state = lesson.states.find(candidate => candidate.id === id)!
    assert.ok(state.kind !== 'teaching')
    assert.equal(state.evidenceRole, 'independent')
    assert.ok(state.dimensions.includes(dimension as EvidenceDimension))
  }))
  assert.ok(lesson.requirements.calculation?.inSession.length, 'relative atomic mass is calculated on your own')
  assert.equal(lesson.states[0].kind === 'choice' && lesson.states[0].evidenceRole, 'diagnostic')
  assert.equal(lesson.states.at(-1)!.kind, 'written')
})

check(`${lesson.id}: every answer path grades, the maths is right, writing stays teacher-only`, () => {
  for (const state of lesson.states) {
    if (state.kind === 'teaching') continue
    assert.ok(state.hint && state.explanation.answer && state.explanation.steps.length)
    if (state.kind === 'choice') {
      assert.equal(new Set(state.options.map(option => option.id)).size, state.options.length)
      state.options.forEach(option => assert.equal(gradeResponse(state, option.id).result, option.id === state.answerId ? 'correct' : 'incorrect'))
      assert.equal(state.explanation.answer, state.options.find(option => option.id === state.answerId)!.label)
      assert.ok(!state.explanation.answer.toLowerCase().includes(state.hint.toLowerCase()), `${state.id}: the hint must not simply repeat the answer`)
    } else {
      assert.equal(state.marking, 'teacherOnly')
      assert.equal(state.rubric.marks, state.rubric.points.length)
      assert.ok(state.rubric.reject.length)
      assert.match(state.instruction || '', /not automatically marked/)
      assert.equal(gradeResponse(state, 'Saved for a teacher.').result, 'pendingTeacherReview')
    }
  }
  const answer = (id: string) => { const s = lesson.states.find(state => state.id === id); return s?.kind === 'choice' ? s.explanation.answer : '' }
  const ar = (pairs: Array<[number, number]>) => Math.round(pairs.reduce((sum, [mass, abundance]) => sum + mass * abundance, 0) / pairs.reduce((sum, [, abundance]) => sum + abundance, 0) * 10) / 10
  assert.equal(ar([[35, 75], [37, 25]]), 35.5)
  assert.equal(answer('C1-16'), String(ar([[10, 20], [11, 80]])))
  assert.equal(answer('C1-19'), String(ar([[20, 90], [22, 10]])))
  assert.equal(answer('C1-09'), String(19 - 9))
  assert.equal(answer('C1-10'), String(12 - 2))
  assert.equal(answer('C1-18'), `13 protons, ${27 - 13} neutrons, 13 electrons`)
})

check(`${lesson.id}: correct answers are spread across option positions`, () => {
  const positions = lesson.states.flatMap(state => state.kind === 'choice' ? [state.options.findIndex(option => option.id === state.answerId)] : [])
  assert.ok(new Set(positions).size >= 3, 'use at least three answer positions')
  const counts = positions.reduce<Record<number, number>>((all, p) => ({ ...all, [p]: (all[p] || 0) + 1 }), {})
  assert.ok(Math.max(...Object.values(counts)) / positions.length <= .45, 'no single position should hold most answers')
})

check(`${lesson.id}: plain Year 10 wording, one idea per sentence, no Biology lesson references`, () => {
  const frames = Object.values(atomFrames).flat()
  const all = [...frames.map(f => `${f.label}. ${f.summary} ${f.text}`), ...lesson.states.map(learnerText)].join(' ')
  assert.doesNotMatch(all, /diagnostic|misconception|distractor|lesson \d|biology|plum pudding|alpha scattering|isotopic/i)
  for (const f of frames) for (const sentence of f.text.split(/(?<=[.!?])\s+/)) assert.ok(sentence.split(/\s+/).length <= 26, `long sentence: ${sentence}`)
  for (const state of lesson.states) if (state.kind !== 'teaching') assert.ok(state.title.split(/\s+/).length <= 22, `${state.id}: question is too long`)
})

check(`${lesson.id}: teaching frames render with matching scripts and accessible diagrams`, () => {
  for (const [id, frames] of Object.entries(atomFrames)) {
    const state = lesson.states.find(s => s.id === id)
    assert.ok(state?.kind === 'teaching' && state.media)
    assert.equal(state.media.script, frames.map(f => `${f.label}. ${f.summary} ${f.text}`).join(' '))
    assert.equal(new Set(frames.map(f => f.label)).size, frames.length, `${id}: step labels must be unique`)
    for (const f of frames) {
      assert.ok(f.label && f.summary && f.cue.startsWith('Think: ') && f.text && (f.focus || '').startsWith('atom-'))
      const html = renderToStaticMarkup(createElement(TeachingChunk, { state, onExposure: () => {}, customFrames: [f] }))
      const escaped = f.text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[c]!))
      assert.ok(html.includes(escaped), `${id}: frame copy must appear on the teaching screen`)
      assert.match(html, /<svg[^>]+role="img"[^>]+aria-labelledby=/)
      assert.match(html, /<title[^>]*>[^<]{25,}<\/title>/)
      assert.ok(!html.includes('NaN') && !html.includes('undefined'))
    }
  }
  for (const state of lesson.states) if (state.kind === 'teaching' && state.phase === 'model') {
    const html = renderToStaticMarkup(createElement(WorkedReasoning, { state, onExposure: () => {} }))
    assert.match(html, /<svg[^>]+aria-labelledby=/)
    assert.ok(!html.includes('NaN'))
    assert.doesNotMatch(html.split('science-worked__prompt')[0], /35\.5|3550/, 'the worked visual sets the sum up but does not give the answer')
  }
})

check(`${lesson.id}: every drawn atom has the right numbers of protons, neutrons and electrons`, () => {
  const expect: Record<string, [number, number, number]> = {
    'atom-build-size': [3, 4, 3], // lithium-7
    'atom-build-atom': [3, 4, 3],
    'atom-build-electron': [3, 4, 3],
    'atom-particle-all': [0, 0, 0], // a table of icons only
    'atom-particle-neutral': [3, 4, 3], // lithium-7 (the key icons are not counted)
    'atom-symbol-count': [3, 4, 3],
    'atom-symbol-ion': [3 + 3, 4 + 4, 3 + 2], // Li atom and Li⁺ ion
    'atom-element-same': [3 * 3 + 2, 3 * 4 + 2, 3 * 3 + 2], // three lithium-7 atoms and one helium-4 atom
    'atom-isotope-pair': [3 + 3, 3 + 4, 3 + 3], // lithium-6 and lithium-7
    'atom-isotope-all': [3 + 3, 3 + 4, 3 + 3],
    'atom-question': [4, 5, 4], // beryllium-9
  }
  for (const [focus, [p, n, e]] of Object.entries(expect)) {
    const html = renderToStaticMarkup(<CellBiologyVisual focus={focus} />)
    assert.deepEqual([count(html, 'proton'), count(html, 'neutron'), count(html, 'electron')], [p, n, e], focus)
  }
})

check(`${lesson.id}: question diagrams never reveal the answer before submission`, () => {
  for (const state of lesson.states) {
    if (state.kind !== 'choice' || !state.visual) continue
    const hidden = renderToStaticMarkup(<CellBiologyVisual focus={state.visual.id} assessment />)
    const shown = renderToStaticMarkup(<CellBiologyVisual focus={state.visual.id} />)
    assert.ok(hidden.length > 30 && !hidden.includes('NaN'))
    assert.match(hidden, /<svg[^>]+aria-labelledby=/)
    const text = hidden.replace(/<[^>]+>/g, ' ')
    if (state.id === 'C1-17') { assert.doesNotMatch(text, /nucleus|electron|shell|mass|beryllium/i); assert.match(shown, /nucleus/) }
    if (state.id === 'C1-19') assert.doesNotMatch(hidden, /20\.2|2020/)
    const answer = state.explanation.answer.toLowerCase()
    const isDiagramLabel = /^(part|line|label|arrow|area) \w{1,2}$/.test(answer)
    if (answer.length > 2 && !isDiagramLabel) assert.ok(!hidden.toLowerCase().includes(answer), `${state.id}: the answer text must not appear in the question diagram`)
    // In the app, the question screen routes the Chemistry id to the same diagram, hidden until the answer is checked.
    const onScreen = renderToStaticMarkup(createElement(LessonVisual, { state, feedbackVisible: false }))
    assert.equal(onScreen, hidden)
  }
})

check(`${lesson.id}: complete flow reloads, locks answers and finishes the lesson`, () => {
  const engine = createPreviewSessionEngine(lesson)
  let session = engine.createPreviewSession('chemistry-lesson-1-flow')
  for (const state of lesson.states) {
    assert.equal(session.currentId, state.id)
    if (state.kind !== 'teaching') {
      if (state.kind === 'written') session = engine.previewReducer(session, { type: 'draft', response: 'Original learner response.' })
      session = engine.previewReducer(session, { type: 'answer', response: state.kind === 'choice' ? state.answerId : 'Original learner response.', at })
      const locked = session.answers[state.id]
      session = engine.previewReducer(session, { type: 'answer', response: 'changed', at })
      assert.deepEqual(session.answers[state.id], locked)
    }
    session = engine.previewReducer(session, { type: 'continue', at })
    assert.ok(engine.restorePreviewSession(session))
  }
  assert.equal(session.currentId, null)
  assert.equal(progress(lesson, session.completedIds).fraction, 1)
  const profile = evidenceProfile(lesson, Object.values(session.answers))
  assert.equal(profile.pendingReview.length, 1)
  assert.notEqual(recommendedNext(profile, false, lesson).kind, 'repair')
})

check(`${lesson.id}: a wrong independent answer keeps the learner on a repair route`, () => {
  const independent = lesson.states.find(state => state.kind === 'choice' && state.evidenceRole === 'independent')!
  if (independent.kind !== 'choice') throw new Error('expected a choice')
  const engine = createPreviewSessionEngine(lesson)
  let session = engine.createPreviewSession('chemistry-lesson-1-repair')
  session = engine.previewReducer(session, { type: 'jump', id: independent.id })
  session = engine.previewReducer(session, { type: 'answer', response: independent.options.find(option => option.id !== independent.answerId)!.id, at })
  assert.equal(session.answers[independent.id].result, 'incorrect')
  assert.equal(recommendedNext(evidenceProfile(lesson, Object.values(session.answers)), false, lesson).kind, 'repair')
})

check('Chemistry is its own section: Lesson 1 opens at /preview/science?subject=chemistry&lesson=1, in chapter C1a', () => {
  assert.equal(chemistryLessons[0], getScienceLesson('chemistry', 1))
  const entry = getScienceLesson('chemistry', 1)!
  assert.equal(entry.lesson, lessonC1)
  assert.equal(entry.title, 'Atoms, elements and isotopes')
  assert.equal(scienceLessonDir(entry), 'chemistry/lesson-1')
  assert.equal(scienceChapterFor(entry)?.code, 'C1a')
  assert.equal(scienceChapterFor(entry)?.title, chemistryChapters[0].title)
  assert.deepEqual(parseScienceLessonRef('chemistry', '1'), { subject: 'chemistry', number: 1 })
  assert.equal(scienceSubjectLessonHref('chemistry', 1), '/preview/science?subject=chemistry&lesson=1')
  assert.equal(nextScienceLesson(entry)?.number, 2, 'Lesson 1 leads on to Chemistry Lesson 2')
  // Biology Lesson 1 is untouched.
  assert.equal(getScienceLesson('biology', 1)!.lesson.id, 'B-CELL-001-B')
  assert.deepEqual(parseScienceLessonRef(undefined, '1'), { subject: 'biology', number: 1 })
  // The curriculum shows every subject with a lesson as real units, and lists the rest under "Coming later".
  assert.ok(!scienceSubjects.filter(item => item.lessons.length === 0).some(item => item.subject === 'chemistry'), 'Chemistry is no longer "Coming later"')
  const units = scienceUnits.filter(unit => unit.subject === 'chemistry')
  assert.deepEqual(units.map(unit => [unit.code, unit.subjectTitle, unit.lessons.length]), [['C1a', 'Chemistry', 4], ['C1b', 'Chemistry', 7], ['C2', 'Chemistry', 6], ['C3', 'Chemistry', 4], ['C4', 'Chemistry', 6], ['C5', 'Chemistry', 3], ['C6', 'Chemistry', 6], ['C7', 'Chemistry', 4]])
  // Revision cards: one Chemistry deck, keyed on the lesson id, with its own key facts and recall questions.
  const facts = scienceFacts[lessonC1.id]
  assert.ok(facts)
  for (const section of Object.keys(facts.sections)) assert.ok(atomSections.some(item => item.id === section), `${section} is a section start`)
  for (const id of facts.recall) assert.equal(lesson.states.find(state => state.id === id)?.kind, 'choice')
  const deck = buildScienceDecks().find(item => item.lessonId === lessonC1.id)!
  assert.equal(deck.subject, 'chemistry')
  assert.equal(deck.number, 1)
  assert.ok(deck.cards.length >= 12)
  assert.equal(new Set(buildScienceDecks().flatMap(item => item.cards.map(card => card.id))).size, buildScienceDecks().flatMap(item => item.cards).length)
})

console.log(`${checks} Chemistry Lesson 1 checks passed`)

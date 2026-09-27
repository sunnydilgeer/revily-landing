import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CellBiologyVisual } from './components/CellBiologyVisuals'
import { TeachingChunk, WorkedReasoning } from './components/TeachingChunk'
import { evidenceProfile, gradeResponse, progress, recommendedNext } from './engine'
import { scienceLessons, parseScienceLesson, scienceChapters, scienceLessonHref } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'
import { lesson27, photosynthesisRateSections } from './lesson-27/lesson'
import { photosynthesisRateFrames } from './lesson-27/teachingFrames'
import { lesson28, respirationSections } from './lesson-28/lesson'
import { respirationFrames } from './lesson-28/teachingFrames'
import { lesson29, exerciseSections } from './lesson-29/lesson'
import { exerciseFrames } from './lesson-29/teachingFrames'
import { lesson30, homeostasisSections } from './lesson-30/lesson'
import { homeostasisFrames } from './lesson-30/teachingFrames'
import { lesson31, nervousSystemSections } from './lesson-31/lesson'
import { nervousSystemFrames } from './lesson-31/teachingFrames'
import { lesson32, reactionTimeSections } from './lesson-32/lesson'
import { reactionTimeFrames } from './lesson-32/teachingFrames'
import { lesson33, hormonesSections } from './lesson-33/lesson'
import { hormonesFrames } from './lesson-33/teachingFrames'
import { lesson34, bloodGlucoseSections } from './lesson-34/lesson'
import { bloodGlucoseFrames } from './lesson-34/teachingFrames'
import { lesson35, menstrualCycleSections } from './lesson-35/lesson'
import { menstrualCycleFrames } from './lesson-35/teachingFrames'
import { lesson36, contraceptionSections } from './lesson-36/lesson'
import { contraceptionFrames } from './lesson-36/teachingFrames'
import type { EvidenceDimension, Profile, ScienceState } from './types'

let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
const lessons = [lesson27, lesson28, lesson29, lesson30, lesson31, lesson32, lesson33, lesson34, lesson35, lesson36]
const frameSets = [photosynthesisRateFrames, respirationFrames, exerciseFrames, homeostasisFrames, nervousSystemFrames, reactionTimeFrames, hormonesFrames, bloodGlucoseFrames, menstrualCycleFrames, contraceptionFrames]
const sections = [photosynthesisRateSections, respirationSections, exerciseSections, homeostasisSections, nervousSystemSections, reactionTimeSections, hormonesSections, bloodGlucoseSections, menstrualCycleSections, contraceptionSections]
const specs = ['4.4', '4.4', '4.4', '4.5', '4.5', '4.5', '4.5', '4.5', '4.5', '4.5']
const families = ['B-BIO', 'B-BIO', 'B-BIO', 'B-HOM', 'B-HOM', 'B-HOM', 'B-HOM', 'B-HOM', 'B-HOM', 'B-HOM']
const prefixes = ['energy-', 'energy-', 'energy-', 'nerve-', 'nerve-', 'nerve-', 'hormone-', 'hormone-', 'hormone-', 'hormone-']
const at = '2026-09-26T18:00:00.000Z'
const learnerText = (state: ScienceState) => state.kind === 'teaching'
  ? [state.title, state.body || '', ...(state.steps || [])].join(' ')
  : [state.title, state.hint, ...state.explanation.steps, state.explanation.answer, ...(state.kind === 'choice' ? state.options.map(o => o.label) : [])].join(' ')

lessons.forEach((lesson, index) => {
  const number = index + 27
  check(`${lesson.id}: metadata, source links, sections and sampled requirements`, () => {
    assert.equal(lesson.id, `${families[index]}-0${number}-B`)
    assert.equal(lesson.contentVersion, '0.1.0')
    assert.equal(lesson.reviewStatus, 'draftNeedsTeacherReview')
    assert.equal(lesson.qualification, 'AQA-8464F')
    assert.equal(lesson.retrieval.length, 0)
    assert.equal(new Set(lesson.states.map(state => state.id)).size, lesson.states.length)
    lesson.states.forEach(state => assert.match(state.id, new RegExp(`^B${number}-\\d{2}$`)))
    const contexts = lesson.states.flatMap(state => state.kind === 'teaching' ? [] : [state.contextId])
    assert.equal(new Set(contexts).size, contexts.length)
    const sourceIds = lesson.sources.map(source => source.id)
    lesson.sources.forEach(source => { assert.ok(source.url.startsWith('https://')); assert.ok(source.locator.includes(specs[index])) })
    lesson.states.forEach(state => {
      assert.ok(state.specRefs.length && state.specRefs.every(ref => ref.startsWith(specs[index])))
      state.sourceIds.forEach(sourceId => assert.ok(sourceIds.includes(sourceId)))
    })
    assert.equal(sections[index][0].id, lesson.states[0].id)
    sections[index].forEach(section => assert.ok(lesson.states.some(state => state.id === section.id)))
    Object.entries(lesson.requirements).forEach(([dimension, rule]) => rule.inSession.forEach(id => {
      const state = lesson.states.find(candidate => candidate.id === id)!
      assert.ok(state.kind !== 'teaching')
      assert.equal(state.evidenceRole, 'independent')
      assert.ok(state.dimensions.includes(dimension as EvidenceDimension))
    }))
    assert.equal(lesson.states[0].kind === 'choice' && lesson.states[0].evidenceRole, 'diagnostic')
    assert.equal(lesson.states.at(-1)!.kind, 'written')
  })

  check(`${lesson.id}: every answer path grades, writing stays teacher-only`, () => {
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
  })

  check(`${lesson.id}: correct answers are spread across option positions`, () => {
    const positions = lesson.states.flatMap(state => state.kind === 'choice' ? [state.options.findIndex(option => option.id === state.answerId)] : [])
    assert.ok(new Set(positions).size >= 3, 'use at least three answer positions')
    const counts = positions.reduce<Record<number, number>>((all, p) => ({ ...all, [p]: (all[p] || 0) + 1 }), {})
    assert.ok(Math.max(...Object.values(counts)) / positions.length <= .45, 'no single position should hold most answers')
  })

  check(`${lesson.id}: plain Year 10 wording, one idea per sentence`, () => {
    const frames = Object.values(frameSets[index]).flat()
    const all = [...frames.map(f => `${f.label}. ${f.summary} ${f.text}`), ...lesson.states.map(learnerText)].join(' ')
    assert.doesNotMatch(all, /inverse square|glucagon|negative feedback|diagnostic|misconception|distractor/i)
    for (const f of frames) for (const sentence of f.text.split(/(?<=[.!?])\s+/)) assert.ok(sentence.split(/\s+/).length <= 26, `long sentence: ${sentence}`)
    for (const state of lesson.states) if (state.kind !== 'teaching') assert.ok(state.title.split(/\s+/).length <= 22, `${state.id}: question is too long`)
  })

  check(`${lesson.id}: teaching frames render with matching scripts and accessible diagrams`, () => {
    for (const [id, frames] of Object.entries(frameSets[index])) {
      const state = lesson.states.find(s => s.id === id)
      assert.ok(state?.kind === 'teaching' && state.media)
      assert.equal(state.media.script, frames.map(f => `${f.label}. ${f.summary} ${f.text}`).join(' '))
      assert.equal(new Set(frames.map(f => f.label)).size, frames.length, `${id}: step labels must be unique`)
      for (const f of frames) {
        assert.ok(f.label && f.summary && f.cue.startsWith('Think: ') && f.text && (f.focus || '').startsWith(prefixes[index]))
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
    }
  })

  check(`${lesson.id}: question diagrams never reveal the answer before submission`, () => {
    for (const state of lesson.states) {
      if (state.kind !== 'choice' || !state.visual) continue
      const hidden = renderToStaticMarkup(<CellBiologyVisual focus={state.visual.id} assessment />)
      const shown = renderToStaticMarkup(<CellBiologyVisual focus={state.visual.id} />)
      assert.ok(hidden.length > 30 && !hidden.includes('NaN'))
      assert.match(hidden, /<svg[^>]+aria-labelledby=/)
      const answer = state.explanation.answer.toLowerCase()
      if (state.id === 'B26-04') { assert.doesNotMatch(hidden, /oxygen|O₂|carbon dioxide|CO₂|water|glucose|arrow 3/i); assert.match(shown, /oxygen/) }
      if (state.id === 'B26-09') { assert.doesNotMatch(hidden, /seed|root|stem|leaf|part 4/i); assert.match(shown, /seeds/) }
      if (state.id === 'B26-14') assert.doesNotMatch(hidden, /built up in the light|used up in the dark/i)
      // A one-letter answer (A, B, C…) is a label that has to be on the diagram.
      if (answer.length > 2) assert.ok(!hidden.toLowerCase().includes(answer), `${state.id}: the answer text must not appear in the question diagram`)
    }
  })

  check(`${lesson.id}: complete flow reloads, locks answers and recommends the next step`, () => {
    const engine = createPreviewSessionEngine(lesson)
    let session = engine.createPreviewSession(`lesson-${number}-flow`)
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
    assert.equal(profile.dimensions.explanation === 'secureInSession', false)
    const next = recommendedNext(profile, false, lesson)
    if (index < lessons.length - 1) assert.deepEqual(next, { kind: 'lesson', lessonId: lessons[index + 1].id })
    else assert.equal(next.kind, 'practical')
  })

  check(`${lesson.id}: a wrong independent answer keeps the learner on a repair route`, () => {
    const independent = lesson.states.find(state => state.kind === 'choice' && state.evidenceRole === 'independent')!
    if (independent.kind !== 'choice') throw new Error('expected a choice')
    const engine = createPreviewSessionEngine(lesson)
    let session = engine.createPreviewSession(`lesson-${number}-repair`)
    session = engine.previewReducer(session, { type: 'jump', id: independent.id })
    session = engine.previewReducer(session, { type: 'answer', response: independent.options.find(option => option.id !== independent.answerId)!.id, at })
    assert.equal(session.answers[independent.id].result, 'incorrect')
    const profile = evidenceProfile(lesson, Object.values(session.answers))
    assert.equal(recommendedNext(profile, false, lesson).kind, 'repair')
  })
})

check('B4 and B5 chapters list Lessons 31–41; the catalogue, parser and links include them; Lesson 31 leads on', () => {
  assert.deepEqual(scienceChapters.find(chapter => chapter.code === 'B4')?.lessonNumbers, [31, 32, 33, 34])
  assert.deepEqual(scienceChapters.find(chapter => chapter.code === 'B5')?.lessonNumbers, [35, 36, 37, 38, 39, 40, 41])
  lessons.forEach((lesson, index) => {
    assert.ok(scienceLessons.some(item => item.number === index + 32 && item.lesson.id === lesson.id && item.folder === String(index + 27)))
    assert.equal(parseScienceLesson(String(index + 32)), index + 32)
    assert.equal(scienceLessonHref((index + 32) as never), `/preview/science?lesson=${index + 32}`)
  })
  const engines = lessons.map(createPreviewSessionEngine)
  assert.equal(new Set(engines.map(engine => engine.storageKey)).size, lessons.length)
  const secure: Profile = { dimensions: { recall: 'secureInSession', understanding: 'secureInSession', explanation: 'notAssessed', application: 'secureInSession', calculation: 'notAssessed', practicalReasoning: 'notAssessed', dataInterpretation: 'secureInSession' }, pendingReview: [] }
  assert.deepEqual(recommendedNext(secure, false, { ...lesson27, id: 'B-BIO-026-B', requirements: {} }), { kind: 'lesson', lessonId: 'B-BIO-027-B' })
})

console.log(`${checks} Lessons 32–41 checks passed`)

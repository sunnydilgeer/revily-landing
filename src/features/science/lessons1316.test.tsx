import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { CellBiologyVisual } from './components/CellBiologyVisuals'
import { evidenceProfile, gradeResponse, progress, recommendedNext } from './engine'
import { getScienceHubLessons, scienceChapters, scienceLessonHref } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'
import { lesson13, bloodSections } from './variants/b/lesson-13/lesson'
import { bloodFrames } from './variants/b/lesson-13/teachingFrames'
import { lesson14, cardiovascularSections } from './variants/b/lesson-14/lesson'
import { cardiovascularFrames } from './variants/b/lesson-14/teachingFrames'
import { lesson15, healthSections } from './variants/b/lesson-15/lesson'
import { healthFrames } from './variants/b/lesson-15/teachingFrames'
import { lesson16, riskCancerSections } from './variants/b/lesson-16/lesson'
import { riskCancerFrames } from './variants/b/lesson-16/teachingFrames'
import type { EvidenceDimension, ScienceState } from './types'

let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
const lessons = [lesson13, lesson14, lesson15, lesson16]
const frameSets = [bloodFrames, cardiovascularFrames, healthFrames, riskCancerFrames]
const sections = [bloodSections, cardiovascularSections, healthSections, riskCancerSections]
const at = '2026-09-22T18:45:00.000Z'
// Lessons refactored to the Lesson 17–18 standard. Add each lesson's id as it is refactored.
const refactored: Record<string, { version: string; banned: RegExp; hiddenAnswer: Record<string, RegExp> }> = {
  'B-ORG-013-B': { version: '0.2.0', banned: /phagocyt|fibrin|antitoxin/i, hiddenAnswer: { 'B13-15': /white blood cell|red blood cell|platelet|plasma/i } },
}
const learnerText = (state: ScienceState) => state.kind === 'teaching'
  ? [state.title, state.body || '', ...(state.steps || [])].join(' ')
  : [state.title, state.hint, ...state.explanation.steps, state.explanation.answer, ...(state.kind === 'choice' ? state.options.map(o => o.label) : [])].join(' ')

lessons.forEach((lesson, index) => {
  const number = index + 13
  check(`${lesson.id}: metadata, source links and sampled requirements`, () => {
    assert.equal(lesson.id, `B-ORG-0${number}-B`)
    assert.equal(lesson.contentVersion, refactored[lesson.id]?.version ?? '0.1.0')
    assert.equal(lesson.reviewStatus, 'draftNeedsTeacherReview')
    assert.equal(lesson.qualification, 'AQA-8464F')
    assert.equal(lesson.retrieval.length, 0)
    assert.equal(new Set(lesson.states.map(state => state.id)).size, lesson.states.length)
    const sourceIds = lesson.sources.map(source => source.id)
    lesson.sources.forEach(source => { assert.ok(source.url.startsWith('https://')); assert.ok(source.locator) })
    lesson.states.forEach(state => {
      assert.ok(state.specRefs.length)
      state.sourceIds.forEach(sourceId => assert.ok(sourceIds.includes(sourceId)))
    })
    sections[index].forEach(section => assert.ok(lesson.states.some(state => state.id === section.id)))
    Object.entries(lesson.requirements).forEach(([dimension, rule]) => rule.inSession.forEach(id => {
      const state = lesson.states.find(candidate => candidate.id === id)!
      assert.ok(state.kind !== 'teaching')
      assert.equal(state.evidenceRole, 'independent')
      assert.ok(state.dimensions.includes(dimension as EvidenceDimension))
    }))
  })

  check(`${lesson.id}: answers grade, writing stays teacher-only and visuals render`, () => {
    for (const state of lesson.states) {
      if (state.kind === 'teaching') continue
      assert.ok(state.hint && state.explanation.answer && state.explanation.steps.length)
      if (state.kind === 'choice') {
        assert.equal(new Set(state.options.map(option => option.id)).size, state.options.length)
        state.options.forEach(option => assert.equal(gradeResponse(state, option.id).result, option.id === state.answerId ? 'correct' : 'incorrect'))
        assert.equal(state.explanation.answer, state.options.find(option => option.id === state.answerId)!.label)
      } else {
        assert.equal(state.marking, 'teacherOnly')
        assert.equal(state.rubric.marks, state.rubric.points.length)
        assert.ok(state.rubric.reject.length)
        assert.equal(gradeResponse(state, 'Saved for a teacher.').result, 'pendingTeacherReview')
      }
      if (state.visual) {
        const html = renderToStaticMarkup(<CellBiologyVisual focus={state.visual.id} assessment/>)
        assert.ok(html.length > 30 && !html.includes('NaN'))
      }
    }
    Object.values(frameSets[index]).flat().forEach(frame => {
      const html = renderToStaticMarkup(<CellBiologyVisual focus={frame.focus!}/>)
      assert.ok(html.length > 30 && !html.includes('NaN'))
      assert.match(html, /<svg/)
      assert.match(html, /<svg[^>]+aria-(?:label|labelledby)/)
    })
  })

  const standard = refactored[lesson.id]
  if (standard) {
    check(`${lesson.id}: Lesson 17–18 standard — answer spread, wording, hints and hidden answers`, () => {
      assert.equal(lesson.states[0].kind === 'choice' && lesson.states[0].evidenceRole, 'diagnostic')
      assert.equal(lesson.states.at(-1)!.kind, 'written')
      assert.equal(sections[index][0].id, lesson.states[0].id)
      assert.ok(lesson.states.length >= 15 && lesson.states.length <= 20, 'aim for 15–20 screens')
      const positions = lesson.states.flatMap(state => state.kind === 'choice' ? [state.options.findIndex(option => option.id === state.answerId)] : [])
      assert.ok(new Set(positions).size >= 3, 'use at least three answer positions')
      const counts = positions.reduce<Record<number, number>>((all, p) => ({ ...all, [p]: (all[p] || 0) + 1 }), {})
      assert.ok(Math.max(...Object.values(counts)) / positions.length <= .45, 'no single position should hold most answers')
      const frames = Object.values(frameSets[index]).flat()
      const all = [...frames.map(f => `${f.label}. ${f.summary} ${f.text}`), ...lesson.states.map(learnerText)].join(' ')
      assert.doesNotMatch(all, /diagnostic|misconception|distractor/i)
      assert.doesNotMatch(all, standard.banned)
      for (const f of frames) for (const sentence of f.text.split(/(?<=[.!?])\s+/)) assert.ok(sentence.split(/\s+/).length <= 26, `long sentence: ${sentence}`)
      for (const state of lesson.states) if (state.kind !== 'teaching') assert.ok(state.title.split(/\s+/).length <= 22, `${state.id}: question is too long`)
      for (const state of lesson.states) if (state.kind === 'choice') assert.ok(!state.explanation.answer.toLowerCase().includes(state.hint.toLowerCase()), `${state.id}: hint repeats the answer`)
      for (const f of frames) {
        const html = renderToStaticMarkup(<CellBiologyVisual focus={f.focus!}/>)
        assert.match(html, /<svg[^>]+role="img"[^>]+aria-labelledby=/)
        assert.match(html, /<title[^>]*>[^<]{25,}<\/title>/)
        assert.ok(!html.includes('undefined'))
      }
      const withVisual = lesson.states.filter(state => state.kind === 'choice' && state.visual)
      assert.ok(withVisual.length >= 2, 'at least two question diagrams')
      for (const state of withVisual) {
        if (state.kind !== 'choice') continue
        const hidden = renderToStaticMarkup(<CellBiologyVisual focus={state.visual!.id} assessment/>)
        assert.ok(!hidden.toLowerCase().includes(state.explanation.answer.toLowerCase().replace(/^an? /, '')), `${state.id}: diagram reveals the answer`)
        const extra = standard.hiddenAnswer[state.id]
        if (extra) assert.doesNotMatch(hidden, extra)
      }
    })
  }

  check(`${lesson.id}: complete flow reloads, locks and recommends the correct next lesson`, () => {
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
    const next = recommendedNext(profile, false, lesson)
    assert.equal(next.kind, 'lesson')
    if (next.kind === 'lesson') assert.equal(next.lessonId, index < lessons.length - 1 ? lessons[index + 1].id : 'B-ORG-017-B')
  })
})

check('Source-page overlap is excluded and the new scope keeps key scientific distinctions', () => {
  const all = frameSets.map(set => Object.values(set).flat().map(frame => `${frame.summary} ${frame.text}`).join(' '))
  assert.doesNotMatch(all.join(' '), /Benedict|Biuret|amylase|food test/i)
  assert.match(all[0], /haemoglobin/i)
  assert.match(all[0], /platelets/i)
  assert.match(all[1], /immune rejection/i)
  assert.match(all[2], /physical and mental well-being/i)
  assert.match(all[3], /does not mean every/i)
  assert.match(all[3], /secondary tumour/i)
})

check('All four new lessons have isolated storage records', () => {
  const engines = lessons.map(createPreviewSessionEngine)
  assert.equal(new Set(engines.map(engine => engine.storageKey)).size, 4)
  engines.forEach(engine => engines.forEach(other => {
    if (engine !== other) assert.equal(other.restorePreviewSession(engine.createPreviewSession('isolation')), null)
  }))
})

check('The shared hub and contents catalogue includes all four new lessons', () => {
  const hubLessonNumbers = getScienceHubLessons('b').map(item => item.number)
  const chapterLessonNumbers: readonly number[] = scienceChapters.flatMap(chapter => [...chapter.lessonNumbers])
  for (let number = 13; number <= 16; number++) {
    assert.ok(hubLessonNumbers.includes(number as 13 | 14 | 15 | 16))
    assert.ok(chapterLessonNumbers.includes(number))
    assert.equal(scienceLessonHref(number as 13 | 14 | 15 | 16, 'b'), `/preview/science?lesson=${number}&variant=b`)
  }
})

console.log(`${checks} circulation and health lesson checks passed`)

import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CellBiologyVisual } from './components/CellBiologyVisuals'
import { TeachingChunk, WorkedReasoning } from './components/TeachingChunk'
import { evidenceProfile, gradeResponse, progress, recommendedNext } from './engine'
import { getScienceHubLessons, parseScienceLesson, scienceChapters, scienceLessonHref } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'
import { lesson22, defenceSections } from './variants/b/lesson-22/lesson'
import { defenceFrames } from './variants/b/lesson-22/teachingFrames'
import { lesson21 } from './variants/b/lesson-21/lesson'
import type { EvidenceDimension, ScienceState } from './types'

let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
const lessons = [lesson22]
const frameSets = [defenceFrames]
const sections = [defenceSections]
const at = '2026-09-25T17:00:00.000Z'
const learnerText = (state: ScienceState) => state.kind === 'teaching'
  ? [state.title, state.body || '', ...(state.steps || [])].join(' ')
  : [state.title, state.hint, ...state.explanation.steps, state.explanation.answer, ...(state.kind === 'choice' ? state.options.map(o => o.label) : [])].join(' ')

lessons.forEach((lesson, index) => {
  const number = index + 22
  check(`${lesson.id}: metadata, source links, sections and sampled requirements`, () => {
    assert.equal(lesson.id, `B-INF-0${number}-B`)
    assert.equal(lesson.contentVersion, '0.1.0')
    assert.equal(lesson.reviewStatus, 'draftNeedsTeacherReview')
    assert.equal(lesson.qualification, 'AQA-8464F')
    assert.equal(lesson.retrieval.length, 0)
    assert.equal(new Set(lesson.states.map(state => state.id)).size, lesson.states.length)
    lesson.states.forEach(state => assert.match(state.id, new RegExp(`^B${number}-\\d{2}$`)))
    const contexts = lesson.states.flatMap(state => state.kind === 'teaching' ? [] : [state.contextId])
    assert.equal(new Set(contexts).size, contexts.length)
    const sourceIds = lesson.sources.map(source => source.id)
    lesson.sources.forEach(source => { assert.ok(source.url.startsWith('https://')); assert.match(source.locator, /4\.3\.1/) })
    lesson.states.forEach(state => {
      assert.ok(state.specRefs.length && state.specRefs.every(ref => ref.startsWith('4.3.1')))
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
    assert.doesNotMatch(all, /lymphocyte|phagocyte\b|memory cell|non-specific|immunity|vaccin|lysozyme|goblet|macrophage|diagnostic|misconception|distractor/i)
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
        assert.ok(f.label && f.summary && f.cue.startsWith('Think: ') && f.text && (f.focus || '').startsWith('defence-'))
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
      if (state.id === 'B22-03') { assert.doesNotMatch(hidden, /nose<|skin<|stomach<|bronchi<|defence 4/i); assert.match(shown, /stomach/) }
      if (state.id === 'B22-09') { assert.doesNotMatch(hidden, /antigen|antibod/i); assert.match(shown, /antigens/) }
      if (state.id === 'B22-14') assert.doesNotMatch(hidden, /as the antibody level rose/i)
      assert.ok(!hidden.toLowerCase().includes(answer), `${state.id}: the answer text must not appear in the question diagram`)
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
    assert.equal(next.kind, 'lesson'); if (next.kind === 'lesson') assert.equal(next.lessonId, 'B-INF-023-B')
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

check('Scope: barriers first, then three white blood cell actions; earlier lessons stay brief links', () => {
  const l22 = Object.values(defenceFrames).flat().map(frame => `${frame.summary} ${frame.text}`).join(' ')
  assert.match(l22, /Lesson 10/); assert.match(l22, /Lesson 13/); assert.match(l22, /Lesson 19/)
  for (const term of [/Mucus is/, /Cilia are/, /hydrochloric acid/, /immune system is/, /phagocytosis/, /called antigens/, /make antibodies/, /antitoxins/]) assert.match(l22, term)
  assert.doesNotMatch(l22, /antibod[^.]*kill|antigens? (?:are|is) made by white/i, 'antigens belong to the pathogen; antibodies do not kill by themselves')
})

check('Flow: follows one set of bacteria from the door handle to the cut; barriers before the immune system', () => {
  const order = lesson22.states.map(state => state.id)
  assert.ok(order.indexOf('B22-02') < order.indexOf('B22-06') && order.indexOf('B22-06') < order.indexOf('B22-08'))
  assert.match(defenceFrames['B22-02'][0].text, /door handle/); assert.match(defenceFrames['B22-06'][0].text, /cut/)
  assert.ok(defenceFrames['B22-08'].findIndex(f => /antigens/.test(f.text)) < defenceFrames['B22-08'].findIndex(f => /make antibodies/.test(f.text)))
})

check('Lesson 22 has its own storage record, separate from Lesson 21', () => {
  const [mine, previous] = [lesson22, lesson21].map(createPreviewSessionEngine)
  assert.notEqual(mine.storageKey, previous.storageKey)
  assert.equal(previous.restorePreviewSession(mine.createPreviewSession('isolation')), null)
  assert.equal(mine.restorePreviewSession(previous.createPreviewSession('isolation')), null)
})

check('Hub, chapter, parser and links include Lesson 22; Lesson 21 leads here and Lesson 22 leads to Lesson 23', () => {
  assert.deepEqual(scienceChapters.find(chapter => chapter.code === 'B3')?.lessonNumbers, [19, 20, 21, 22, 23, 24])
  assert.ok(getScienceHubLessons('b').some(item => item.number === 22) && getScienceHubLessons('a').some(item => item.number === 22))
  assert.equal(parseScienceLesson('22'), 22)
  assert.equal(scienceLessonHref(22, 'a'), '/preview/science?lesson=22&variant=b')
  assert.deepEqual(recommendedNext({ dimensions: { recall: 'secureInSession', understanding: 'secureInSession', explanation: 'notAssessed', application: 'secureInSession', calculation: 'notAssessed', practicalReasoning: 'notAssessed', dataInterpretation: 'secureInSession' }, pendingReview: [] }, false, { ...lesson22, id: 'B-INF-021-B', requirements: {} }), { kind: 'lesson', lessonId: 'B-INF-022-B' })
})

console.log(`${checks} Lesson 22 checks passed`)

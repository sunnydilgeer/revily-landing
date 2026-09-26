import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CellBiologyVisual } from './components/CellBiologyVisuals'
import { TeachingChunk, WorkedReasoning } from './components/TeachingChunk'
import { evidenceProfile, gradeResponse, progress, recommendedNext } from './engine'
import { getScienceHubLessons, parseScienceLesson, scienceChapters, scienceLessonHref } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'
import { lesson19, pathogenSections } from './variants/b/lesson-19/lesson'
import { pathogenFrames } from './variants/b/lesson-19/teachingFrames'
import { lesson20, humanDiseaseSections } from './variants/b/lesson-20/lesson'
import { humanDiseaseFrames } from './variants/b/lesson-20/teachingFrames'
import type { EvidenceDimension, ScienceState } from './types'

let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
const lessons = [lesson19, lesson20]
const frameSets = [pathogenFrames, humanDiseaseFrames]
const sections = [pathogenSections, humanDiseaseSections]
const at = '2026-09-25T17:00:00.000Z'
const learnerText = (state: ScienceState) => state.kind === 'teaching'
  ? [state.title, state.body || '', ...(state.steps || [])].join(' ')
  : [state.title, state.hint, ...state.explanation.steps, state.explanation.answer, ...(state.kind === 'choice' ? state.options.map(o => o.label) : [])].join(' ')

lessons.forEach((lesson, index) => {
  const number = index + 19
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
    assert.doesNotMatch(all, /phagocyt|antigen|antibod|lymphocyte|monoclonal|natural selection|MRSA|herd immunity|capsid|incubation|promiscu|addict|diagnostic|misconception|distractor/i)
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
        assert.ok(f.label && f.summary && f.cue.startsWith('Think: ') && f.text && /^(?:pathogen|disease)-/.test(f.focus || ''))
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
      if (state.id === 'B19-08') { assert.doesNotMatch(hidden, /virus|bacteri|fung|protist/i); assert.match(shown, /virus/i) }
      if (state.id === 'B19-11') { assert.doesNotMatch(hidden, /direct contact|dirty water|air:/i); assert.match(shown, /direct contact/) }
      if (state.id === 'B19-14') assert.doesNotMatch(hidden, /fewer cases|proves/i)
      if (state.id === 'B20-14') { assert.doesNotMatch(hidden, /Salmonella|Gonorrhoea|Measles|HIV/); assert.match(shown, /Measles/) }
      if (state.id === 'B20-15') { assert.doesNotMatch(hidden, /gonorrhoea/i); assert.match(shown, /gonorrhoea/i) }
      if (state.id === 'B20-16') assert.doesNotMatch(hidden, /rose as|fell as/i)
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
    assert.equal(next.kind, 'lesson'); if (next.kind === 'lesson') assert.equal(next.lessonId, index === 0 ? 'B-INF-020-B' : 'B-INF-021-B')
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

check('Scope: key distinctions are taught and earlier lessons stay brief links', () => {
  const [l19, l20] = frameSets.map(set => Object.values(set).flat().map(frame => `${frame.summary} ${frame.text}`).join(' '))
  assert.match(l19, /Lesson 15/); assert.match(l19, /Lesson 1\b/); assert.match(l19, /Lesson 23/)
  assert.match(l19, /pathogen is a microorganism/); assert.match(l19, /not a cell/); assert.match(l19, /toxin/); assert.match(l19, /cell damage/)
  assert.match(l19, /Hygiene means/); assert.match(l19, /isolation/); assert.match(l19, /A vector is/)
  assert.match(l20, /Lesson 19/); assert.match(l20, /Lesson 22/); assert.match(l20, /Lesson 24/)
  assert.match(l20, /resistant/); assert.match(l20, /Antiretroviral/); assert.match(l20, /AIDS/); assert.match(l20, /poultry are vaccinated/)
  assert.doesNotMatch(l19 + l20, /virus[^.]*toxin|toxin[^.]*virus/i, 'toxins belong to bacteria in these lessons')
})

check('Flow: the cold is followed to the end before other pathogens; bacteria come before viruses in Lesson 20', () => {
  const o19 = lesson19.states.map(state => state.id), o20 = lesson20.states.map(state => state.id)
  assert.ok(o19.indexOf('B19-02') < o19.indexOf('B19-05') && o19.indexOf('B19-05') < o19.indexOf('B19-07') && o19.indexOf('B19-07') < o19.indexOf('B19-10'))
  assert.match(pathogenFrames['B19-02'].map(frame => frame.text).join(' '), /cold/)
  assert.ok(o20.indexOf('B20-02') < o20.indexOf('B20-05') && o20.indexOf('B20-05') < o20.indexOf('B20-08') && o20.indexOf('B20-08') < o20.indexOf('B20-11'))
})

check('Both new lessons have isolated storage records', () => {
  const engines = [...lessons.map(createPreviewSessionEngine)]
  assert.equal(new Set(engines.map(engine => engine.storageKey)).size, 2)
  engines.forEach(engine => engines.forEach(other => {
    if (engine !== other) assert.equal(other.restorePreviewSession(engine.createPreviewSession('isolation')), null)
  }))
})

check('Hub, chapter, parser and links include Lessons 19 and 20', () => {
  const hubLessonNumbers: number[] = getScienceHubLessons('b').map(item => item.number)
  const hubA: number[] = getScienceHubLessons('a').map(item => item.number)
  assert.deepEqual(scienceChapters.find(chapter => chapter.code === 'B3')?.lessonNumbers, [19, 20, 21, 22, 23, 24])
  for (const number of [19, 20] as const) {
    assert.ok(hubLessonNumbers.includes(number) && hubA.includes(number))
    assert.equal(parseScienceLesson(String(number)), number)
    assert.equal(scienceLessonHref(number, 'a'), `/preview/science?lesson=${number}&variant=b`)
  }
  const eighteen = recommendedNext({ dimensions: { recall: 'secureInSession', understanding: 'secureInSession', explanation: 'notAssessed', application: 'secureInSession', calculation: 'notAssessed', practicalReasoning: 'notAssessed', dataInterpretation: 'secureInSession' }, pendingReview: [] }, false, { ...lesson19, id: 'B-ORG-018-B', requirements: {} })
  assert.deepEqual(eighteen, { kind: 'lesson', lessonId: 'B-INF-019-B' })
})

console.log(`${checks} infection lesson checks passed`)

import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CellBiologyVisual } from './components/CellBiologyVisuals'
import { LessonVisual } from './components/LessonVisual'
import { TeachingChunk, WorkedReasoning } from './components/TeachingChunk'
import { buildScienceDecks } from './cards/decks'
import { scienceFacts } from './cards/facts'
import { evidenceProfile, gradeResponse, progress, recommendedNext } from './engine'
import { skillsLessons, skillsChapters, getScienceLesson, nextScienceLesson, parseScienceLessonRef, scienceChapterFor, scienceLessonDir, scienceSubjectLessonHref } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'
import { scienceUnits } from './scienceProgress'
import { lessonW1, wsMethodSections } from './skills/lesson-1/lesson'
import { wsMethodFrames } from './skills/lesson-1/teachingFrames'
import { lessonW2, wsIssueSections } from './skills/lesson-2/lesson'
import { wsIssueFrames } from './skills/lesson-2/teachingFrames'
import { lessonW3, wsRiskSections } from './skills/lesson-3/lesson'
import { wsRiskFrames } from './skills/lesson-3/teachingFrames'
import { lessonW4, wsDesignSections } from './skills/lesson-4/lesson'
import { wsDesignFrames } from './skills/lesson-4/teachingFrames'
import { lessonW5, wsCollectSections } from './skills/lesson-5/lesson'
import { wsCollectFrames } from './skills/lesson-5/teachingFrames'
import { lessonW6, wsProcessSections } from './skills/lesson-6/lesson'
import { wsProcessFrames } from './skills/lesson-6/teachingFrames'
import { lessonW7, wsPresentSections } from './skills/lesson-7/lesson'
import { wsPresentFrames } from './skills/lesson-7/teachingFrames'
import { lessonW8, wsGraphSections } from './skills/lesson-8/lesson'
import { wsGraphFrames } from './skills/lesson-8/teachingFrames'
import { lessonW9, wsUnitSections } from './skills/lesson-9/lesson'
import { wsUnitFrames } from './skills/lesson-9/teachingFrames'
import { lessonW10, wsMathsSections } from './skills/lesson-10/lesson'
import { wsMathsFrames } from './skills/lesson-10/teachingFrames'
import { lessonW11, wsConcludeSections } from './skills/lesson-11/lesson'
import { wsConcludeFrames } from './skills/lesson-11/teachingFrames'
import { lessonW12, wsEvalSections } from './skills/lesson-12/lesson'
import { wsEvalFrames } from './skills/lesson-12/teachingFrames'
import { lessonW13, wsMeasureSections } from './skills/lesson-13/lesson'
import { wsMeasureFrames } from './skills/lesson-13/teachingFrames'
import { lessonW14, wsLengthSections } from './skills/lesson-14/lesson'
import { wsLengthFrames } from './skills/lesson-14/teachingFrames'
import { lessonW15, wsPhCellSections } from './skills/lesson-15/lesson'
import { wsPhCellFrames } from './skills/lesson-15/teachingFrames'
import { lessonW16, wsSafetySections } from './skills/lesson-16/lesson'
import { wsSafetyFrames } from './skills/lesson-16/teachingFrames'
import { lessonW17, wsSetupSections } from './skills/lesson-17/lesson'
import { wsSetupFrames } from './skills/lesson-17/teachingFrames'
import { lessonW18, wsGasSections } from './skills/lesson-18/lesson'
import { wsGasFrames } from './skills/lesson-18/teachingFrames'
import { lessonW19, wsHeatSections } from './skills/lesson-19/lesson'
import { wsHeatFrames } from './skills/lesson-19/teachingFrames'
import { lessonW20, wsElecSections } from './skills/lesson-20/lesson'
import { wsElecFrames } from './skills/lesson-20/teachingFrames'
import { lessonW21, wsSampleSections } from './skills/lesson-21/lesson'
import { wsSampleFrames } from './skills/lesson-21/teachingFrames'
import { lessonW22, wsPercentSections } from './skills/lesson-22/lesson'
import { wsPercentFrames } from './skills/lesson-22/teachingFrames'
import type { ScienceSection } from './lessonSections'
import type { TeachingFrame } from './teachingFrame'
import type { EvidenceDimension, ScienceLesson, ScienceState } from './types'

let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
const at = '2026-09-29T09:00:00.000Z'
const learnerText = (state: ScienceState) => state.kind === 'teaching'
  ? [state.title, state.body || '', ...(state.steps || [])].join(' ')
  : [state.title, state.hint, ...state.explanation.steps, state.explanation.answer, ...(state.kind === 'choice' ? state.options.map(o => o.label) : [])].join(' ')

type Case = { number: number; lesson: ScienceLesson; sections: readonly ScienceSection[]; frames: Record<string, TeachingFrame[]>; title: string; chapter: 'WS1' | 'WS2' }
const cases: Case[] = [
  { number: 1, lesson: lessonW1, sections: wsMethodSections, frames: wsMethodFrames, title: 'The scientific method', chapter: 'WS1' },
  { number: 2, lesson: lessonW2, sections: wsIssueSections, frames: wsIssueFrames, title: 'Communicating science and its issues', chapter: 'WS1' },
  { number: 3, lesson: lessonW3, sections: wsRiskSections, frames: wsRiskFrames, title: 'Hazards and risk', chapter: 'WS1' },
  { number: 4, lesson: lessonW4, sections: wsDesignSections, frames: wsDesignFrames, title: 'Designing investigations', chapter: 'WS1' },
  { number: 5, lesson: lessonW5, sections: wsCollectSections, frames: wsCollectFrames, title: 'Collecting data', chapter: 'WS1' },
  { number: 6, lesson: lessonW6, sections: wsProcessSections, frames: wsProcessFrames, title: 'Processing data', chapter: 'WS1' },
  { number: 7, lesson: lessonW7, sections: wsPresentSections, frames: wsPresentFrames, title: 'Presenting data', chapter: 'WS1' },
  { number: 8, lesson: lessonW8, sections: wsGraphSections, frames: wsGraphFrames, title: 'Interpreting graphs', chapter: 'WS1' },
  { number: 9, lesson: lessonW9, sections: wsUnitSections, frames: wsUnitFrames, title: 'Units and converting them', chapter: 'WS1' },
  { number: 10, lesson: lessonW10, sections: wsMathsSections, frames: wsMathsFrames, title: 'Maths skills for science', chapter: 'WS1' },
  { number: 11, lesson: lessonW11, sections: wsConcludeSections, frames: wsConcludeFrames, title: 'Drawing conclusions', chapter: 'WS1' },
  { number: 12, lesson: lessonW12, sections: wsEvalSections, frames: wsEvalFrames, title: 'Uncertainty and evaluations', chapter: 'WS1' },
  { number: 13, lesson: lessonW13, sections: wsMeasureSections, frames: wsMeasureFrames, title: 'Measuring mass, liquids and gases', chapter: 'WS2' },
  { number: 14, lesson: lessonW14, sections: wsLengthSections, frames: wsLengthFrames, title: 'Measuring volume, length, angles, temperature and time', chapter: 'WS2' },
  { number: 15, lesson: lessonW15, sections: wsPhCellSections, frames: wsPhCellFrames, title: 'Measuring pH and the size of a cell', chapter: 'WS2' },
  { number: 16, lesson: lessonW16, sections: wsSafetySections, frames: wsSafetyFrames, title: 'Safety and ethics in the lab', chapter: 'WS2' },
  { number: 17, lesson: lessonW17, sections: wsSetupSections, frames: wsSetupFrames, title: 'Setting up electrolysis and a potometer', chapter: 'WS2' },
  { number: 18, lesson: lessonW18, sections: wsGasSections, frames: wsGasFrames, title: 'Collecting gases and drawing apparatus', chapter: 'WS2' },
  { number: 19, lesson: lessonW19, sections: wsHeatSections, frames: wsHeatFrames, title: 'Heating substances safely', chapter: 'WS2' },
  { number: 20, lesson: lessonW20, sections: wsElecSections, frames: wsElecFrames, title: 'Electrical meters and light gates', chapter: 'WS2' },
  { number: 21, lesson: lessonW21, sections: wsSampleSections, frames: wsSampleFrames, title: 'Random sampling', chapter: 'WS2' },
  { number: 22, lesson: lessonW22, sections: wsPercentSections, frames: wsPercentFrames, title: 'Percentage change', chapter: 'WS2' },
]

for (const { number, lesson, sections, frames, title, chapter } of cases) {
  check(`${lesson.id}: metadata, source links, sections and sampled requirements`, () => {
    assert.match(lesson.id, new RegExp(`^W-[A-Z]{3}-${String(number).padStart(3, '0')}-W$`))
    assert.equal(lesson.title, title)
    assert.equal(lesson.strand, 'skills')
    assert.equal(lesson.contentVersion, '0.1.0')
    assert.equal(lesson.reviewStatus, 'draftNeedsTeacherReview')
    assert.equal(lesson.qualification, 'AQA-8464F')
    assert.equal(new Set(lesson.states.map(state => state.id)).size, lesson.states.length)
    lesson.states.forEach(state => assert.match(state.id, new RegExp(`^W${number}-\\d{2}$`)))
    const contexts = lesson.states.flatMap(state => state.kind === 'teaching' ? [] : [state.contextId])
    assert.equal(new Set(contexts).size, contexts.length)
    const sourceIds = lesson.sources.map(source => source.id)
    lesson.sources.forEach(source => assert.ok(source.url.startsWith('https://') && /(WS|AT) ?\d/.test(source.locator)))
    lesson.states.forEach(state => {
      assert.ok(state.specRefs.length && state.specRefs.every(ref => /^(WS|AT) ?\d/.test(ref)), `${state.id}: spec refs`)
      state.sourceIds.forEach(sourceId => assert.ok(sourceIds.includes(sourceId)))
    })
    assert.equal(sections[0].id, lesson.states[0].id)
    assert.equal(sections[0].label, 'Start here')
    assert.equal(sections.at(-1)!.label, 'On your own')
    sections.forEach(section => assert.ok(lesson.states.some(state => state.id === section.id)))
    Object.entries(lesson.requirements).forEach(([dimension, rule]) => rule.inSession.forEach(id => {
      const state = lesson.states.find(candidate => candidate.id === id)!
      assert.ok(state.kind !== 'teaching')
      assert.equal(state.evidenceRole, 'independent')
      assert.ok(state.dimensions.includes(dimension as EvidenceDimension))
    }))
    assert.equal(lesson.states[0].kind === 'choice' && lesson.states[0].evidenceRole, 'diagnostic')
    assert.equal(lesson.states.at(-1)!.kind, 'written')
  })

  check(`${lesson.id}: every answer path grades and writing stays teacher-only`, () => {
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

  check(`${lesson.id}: plain Year 10 wording, questions of 22 words or fewer, no other-lesson references`, () => {
    const all = [...Object.values(frames).flat().map(f => `${f.label}. ${f.summary} ${f.text}`), ...lesson.states.map(learnerText)].join(' ')
    assert.doesNotMatch(all, /diagnostic|misconception|distractor|lesson \d/i)
    for (const f of Object.values(frames).flat()) for (const sentence of f.text.split(/(?<=[.!?])\s+/)) assert.ok(sentence.split(/\s+/).length <= 26, `long sentence: ${sentence}`)
    for (const state of lesson.states) if (state.kind !== 'teaching') assert.ok(state.title.split(/\s+/).length <= 22, `${state.id}: question is too long`)
  })

  check(`${lesson.id}: teaching frames and worked examples render with matching scripts and accessible diagrams`, () => {
    for (const [id, set] of Object.entries(frames)) {
      const state = lesson.states.find(s => s.id === id)
      assert.ok(state?.kind === 'teaching' && state.media, `${id}: teaching screen`)
      assert.equal(state.media.script, set.map(f => `${f.label}. ${f.summary} ${f.text}`).join(' '))
      assert.equal(new Set(set.map(f => f.label)).size, set.length, `${id}: step labels must be unique`)
      for (const f of set) {
        assert.ok(f.label && f.summary && f.cue.startsWith('Think: ') && f.text && f.focus)
        const html = renderToStaticMarkup(createElement(TeachingChunk, { state, onExposure: () => {}, customFrames: [f] }))
        const escaped = f.text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[c]!))
        assert.ok(html.includes(escaped), `${id}: frame copy must appear on the teaching screen`)
        assert.match(html, /<svg[^>]+role="img"[^>]+aria-labelledby=/, `${id} ${f.focus}: accessible svg`)
        assert.match(html, /<title[^>]*>[^<]{25,}<\/title>/, `${id} ${f.focus}: descriptive title`)
        assert.ok(!html.includes('NaN') && !html.includes('undefined'), `${id} ${f.focus}: no NaN/undefined`)
      }
    }
    for (const state of lesson.states) if (state.kind === 'teaching' && state.phase === 'model') {
      const html = renderToStaticMarkup(createElement(WorkedReasoning, { state, onExposure: () => {} }))
      assert.match(html, /<svg[^>]+aria-labelledby=/, `${state.id}: worked visual`)
      assert.ok(!html.includes('NaN'))
    }
  })

  check(`${lesson.id}: question diagrams render and never show the answer text before submission`, () => {
    for (const state of lesson.states) {
      if (state.kind !== 'choice' || !state.visual) continue
      const hidden = renderToStaticMarkup(<CellBiologyVisual focus={state.visual.id} assessment />)
      assert.ok(hidden.length > 30 && !hidden.includes('NaN'), `${state.id}: renders`)
      assert.match(hidden, /<svg[^>]+aria-labelledby=/)
      const answer = state.explanation.answer.toLowerCase()
      const isDiagramLabel = /^[a-z]+ [a-z0-9]{1,2}$/.test(answer) // e.g. "Part 3", "Particle 2": the diagram numbers its parts
      const text = hidden.replace(/<[^>]+>/g, ' ').toLowerCase()
      // A data table that names the other options too (e.g. three liquids and their boiling points) gives nothing away.
      const namesEveryOption = state.options.filter(option => option.id !== state.answerId && text.includes(option.label.toLowerCase())).length >= 2
      if (answer.length > 2 && !isDiagramLabel && !namesEveryOption && !/^\d/.test(answer)) assert.ok(!text.includes(answer), `${state.id}: the answer text must not appear in the question diagram`)
      assert.equal(renderToStaticMarkup(createElement(LessonVisual, { state, feedbackVisible: false })), hidden, `${state.id}: the question screen routes to the hidden diagram`)
    }
  })

  check(`${lesson.id}: complete flow reloads, locks answers and finishes; a wrong independent answer means repair`, () => {
    const engine = createPreviewSessionEngine(lesson)
    let session = engine.createPreviewSession(`skills-lesson-${number}-flow`)
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

    const independent = lesson.states.find(state => state.kind === 'choice' && state.evidenceRole === 'independent')!
    if (independent.kind !== 'choice') throw new Error('expected a choice')
    let repair = engine.createPreviewSession(`skills-lesson-${number}-repair`)
    repair = engine.previewReducer(repair, { type: 'jump', id: independent.id })
    repair = engine.previewReducer(repair, { type: 'answer', response: independent.options.find(option => option.id !== independent.answerId)!.id, at })
    assert.equal(repair.answers[independent.id].result, 'incorrect')
    assert.equal(recommendedNext(evidenceProfile(lesson, Object.values(repair.answers)), false, lesson).kind, 'repair')
  })

  check(`${lesson.id}: registered as Working Scientifically Lesson ${number} in ${chapter}, with a revision deck`, () => {
    const entry = getScienceLesson('skills', number)!
    assert.equal(entry.lesson, lesson)
    assert.equal(entry.title, title)
    assert.equal(entry.sections, sections)
    assert.equal(entry.frames, frames)
    assert.equal(scienceLessonDir(entry), `skills/lesson-${number}`)
    assert.equal(scienceChapterFor(entry)?.code, chapter)
    assert.deepEqual(parseScienceLessonRef('skills', String(number)), { subject: 'skills', number })
    assert.equal(scienceSubjectLessonHref('skills', number), `/preview/science?subject=skills&lesson=${number}`)
    if (number > 1) assert.equal(getScienceLesson('skills', number - 1) && nextScienceLesson(getScienceLesson('skills', number - 1)!), entry, 'the previous lesson leads here')
    const facts = scienceFacts[lesson.id]
    assert.ok(facts, 'facts are registered')
    for (const section of Object.keys(facts.sections)) assert.ok(sections.some(item => item.id === section), `${section} is a section start`)
    for (const id of facts.recall) assert.equal(lesson.states.find(state => state.id === id)?.kind, 'choice', `${id}: recall is a choice question`)
    const deck = buildScienceDecks().find(item => item.lessonId === lesson.id)!
    assert.equal(deck.subject, 'skills')
    assert.equal(deck.number, number)
    assert.ok(deck.cards.length >= 8)
  })
}

check('Working Scientifically catalogue: Lessons 1–22, WS1 holds 1–12, WS2 holds 13–22, Lesson 22 is the last', () => {
  assert.deepEqual(skillsLessons.map(item => item.number), Array.from({ length: 22 }, (_, i) => i + 1))
  assert.deepEqual(skillsChapters.map(chapter => [chapter.subject, chapter.code, chapter.title, [...chapter.lessonNumbers]]), [['skills', 'WS1', 'Working scientifically', Array.from({ length: 12 }, (_, i) => i + 1)], ['skills', 'WS2', 'Practical skills', Array.from({ length: 10 }, (_, i) => i + 13)]])
  assert.deepEqual(scienceUnits.filter(unit => unit.subject === 'skills').map(unit => [unit.code, unit.lessons.length]), [['WS1', 12], ['WS2', 10]])
  assert.equal(nextScienceLesson(getScienceLesson('skills', 22)!), null)
  assert.equal(parseScienceLessonRef('skills', '23'), null)
  const cards = buildScienceDecks().flatMap(item => item.cards.map(card => card.id))
  assert.equal(new Set(cards).size, cards.length)
})

console.log(`${checks} Working Scientifically Lessons 1–22 checks passed`)

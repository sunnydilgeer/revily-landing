import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CellBiologyVisual } from './components/CellBiologyVisuals'
import { LessonVisual } from './components/LessonVisual'
import { TeachingChunk, WorkedReasoning } from './components/TeachingChunk'
import { buildScienceDecks } from './cards/decks'
import { scienceFacts } from './cards/facts'
import { evidenceProfile, gradeResponse, progress, recommendedNext } from './engine'
import { physicsLessons, getScienceLesson, nextScienceLesson, parseScienceLessonRef, scienceChapterFor, scienceLessonDir, scienceSubjectLessonHref } from './lessonNavigation'
import { createPreviewSessionEngine } from './previewSession'
import { scienceUnits } from './scienceProgress'
import { lessonP31, nucModelSections } from './physics/lesson-31/lesson'
import { nucModelFrames } from './physics/lesson-31/teachingFrames'
import { lessonP32, atomStructureSections } from './physics/lesson-32/lesson'
import { atomStructureFrames } from './physics/lesson-32/teachingFrames'
import { lessonP33, isotopeSections } from './physics/lesson-33/lesson'
import { isotopeFrames } from './physics/lesson-33/teachingFrames'
import { lessonP34, nuclearRadiationSections } from './physics/lesson-34/lesson'
import { nuclearRadiationFrames } from './physics/lesson-34/teachingFrames'
import { lessonP35, nuclearEquationSections } from './physics/lesson-35/lesson'
import { nuclearEquationFrames } from './physics/lesson-35/teachingFrames'
import { lessonP36, halfLifeSections } from './physics/lesson-36/lesson'
import { halfLifeFrames } from './physics/lesson-36/teachingFrames'
import { lessonP37, irradiationSections } from './physics/lesson-37/lesson'
import { irradiationFrames } from './physics/lesson-37/teachingFrames'
import { lessonP38, contactForceSections } from './physics/lesson-38/lesson'
import { contactForceFrames } from './physics/lesson-38/teachingFrames'
import { lessonP39, weightSections } from './physics/lesson-39/lesson'
import { weightFrames } from './physics/lesson-39/teachingFrames'
import { lessonP40, resultantSections } from './physics/lesson-40/lesson'
import { resultantFrames } from './physics/lesson-40/teachingFrames'
import { lessonP41, elasticSections } from './physics/lesson-41/lesson'
import { elasticFrames } from './physics/lesson-41/teachingFrames'
import { lessonP42, springPracSections } from './physics/lesson-42/lesson'
import { springPracFrames } from './physics/lesson-42/teachingFrames'
import { lessonP43, velocitySections } from './physics/lesson-43/lesson'
import { velocityFrames } from './physics/lesson-43/teachingFrames'
import { lessonP44, accelerationSections } from './physics/lesson-44/lesson'
import { accelerationFrames } from './physics/lesson-44/teachingFrames'
import { lessonP45, dtGraphSections } from './physics/lesson-45/lesson'
import { dtGraphFrames } from './physics/lesson-45/teachingFrames'
import { lessonP46, vtGraphSections } from './physics/lesson-46/lesson'
import { vtGraphFrames } from './physics/lesson-46/teachingFrames'
import { lessonP47, newtonLawSections } from './physics/lesson-47/lesson'
import { newtonLawFrames } from './physics/lesson-47/teachingFrames'
import { lessonP48, newtonThirdSections } from './physics/lesson-48/lesson'
import { newtonThirdFrames } from './physics/lesson-48/teachingFrames'
import { lessonP49, motionPracSections } from './physics/lesson-49/lesson'
import { motionPracFrames } from './physics/lesson-49/teachingFrames'
import { lessonP50, stoppingSections } from './physics/lesson-50/lesson'
import { stoppingFrames } from './physics/lesson-50/teachingFrames'
import { lessonP51, brakingSections } from './physics/lesson-51/lesson'
import { brakingFrames } from './physics/lesson-51/teachingFrames'
import { lessonP52, reactionTimeSections } from './physics/lesson-52/lesson'
import { reactionTimeFrames } from './physics/lesson-52/teachingFrames'
import { lessonP53, waveTypeSections } from './physics/lesson-53/lesson'
import { waveTypeFrames } from './physics/lesson-53/teachingFrames'
import { lessonP54, waveSpeedSections } from './physics/lesson-54/lesson'
import { waveSpeedFrames } from './physics/lesson-54/teachingFrames'
import { lessonP55, wavePracSections } from './physics/lesson-55/lesson'
import { wavePracFrames } from './physics/lesson-55/teachingFrames'
import { lessonP56, refractionSections } from './physics/lesson-56/lesson'
import { refractionFrames } from './physics/lesson-56/teachingFrames'
import { lessonP57, emSpectrumSections } from './physics/lesson-57/lesson'
import { emSpectrumFrames } from './physics/lesson-57/teachingFrames'
import { lessonP58, emUseSections } from './physics/lesson-58/lesson'
import { emUseFrames } from './physics/lesson-58/teachingFrames'
import { lessonP59, emMoreSections } from './physics/lesson-59/lesson'
import { emMoreFrames } from './physics/lesson-59/teachingFrames'
import type { ScienceSection } from './lessonSections'
import type { TeachingFrame } from './teachingFrame'
import type { EvidenceDimension, ScienceLesson, ScienceState } from './types'

let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
const at = '2026-09-29T09:00:00.000Z'
const learnerText = (state: ScienceState) => state.kind === 'teaching'
  ? [state.title, state.body || '', ...(state.steps || [])].join(' ')
  : [state.title, state.hint, ...state.explanation.steps, state.explanation.answer, ...(state.kind === 'choice' ? state.options.map(o => o.label) : [])].join(' ')

type Case = { number: number; lesson: ScienceLesson; sections: readonly ScienceSection[]; frames: Record<string, TeachingFrame[]>; title: string; chapter: 'P4' | 'P5' | 'P6' }
const cases: Case[] = [
  { number: 31, lesson: lessonP31, sections: nucModelSections, frames: nucModelFrames, title: 'Developing the model of the atom', chapter: 'P4' },
  { number: 32, lesson: lessonP32, sections: atomStructureSections, frames: atomStructureFrames, title: 'The structure of the atom', chapter: 'P4' },
  { number: 33, lesson: lessonP33, sections: isotopeSections, frames: isotopeFrames, title: 'Isotopes', chapter: 'P4' },
  { number: 34, lesson: lessonP34, sections: nuclearRadiationSections, frames: nuclearRadiationFrames, title: 'Alpha, beta and gamma radiation', chapter: 'P4' },
  { number: 35, lesson: lessonP35, sections: nuclearEquationSections, frames: nuclearEquationFrames, title: 'Nuclear equations', chapter: 'P4' },
  { number: 36, lesson: lessonP36, sections: halfLifeSections, frames: halfLifeFrames, title: 'Half-life', chapter: 'P4' },
  { number: 37, lesson: lessonP37, sections: irradiationSections, frames: irradiationFrames, title: 'Irradiation and contamination', chapter: 'P4' },
  { number: 38, lesson: lessonP38, sections: contactForceSections, frames: contactForceFrames, title: 'Contact and non-contact forces', chapter: 'P5' },
  { number: 39, lesson: lessonP39, sections: weightSections, frames: weightFrames, title: 'Weight, mass and gravity', chapter: 'P5' },
  { number: 40, lesson: lessonP40, sections: resultantSections, frames: resultantFrames, title: 'Resultant forces and work done', chapter: 'P5' },
  { number: 41, lesson: lessonP41, sections: elasticSections, frames: elasticFrames, title: 'Forces and elasticity', chapter: 'P5' },
  { number: 42, lesson: lessonP42, sections: springPracSections, frames: springPracFrames, title: 'Investigating springs', chapter: 'P5' },
  { number: 43, lesson: lessonP43, sections: velocitySections, frames: velocityFrames, title: 'Distance, displacement, speed and velocity', chapter: 'P5' },
  { number: 44, lesson: lessonP44, sections: accelerationSections, frames: accelerationFrames, title: 'Acceleration', chapter: 'P5' },
  { number: 45, lesson: lessonP45, sections: dtGraphSections, frames: dtGraphFrames, title: 'Distance-time graphs', chapter: 'P5' },
  { number: 46, lesson: lessonP46, sections: vtGraphSections, frames: vtGraphFrames, title: 'Velocity-time graphs and terminal velocity', chapter: 'P5' },
  { number: 47, lesson: lessonP47, sections: newtonLawSections, frames: newtonLawFrames, title: 'Newton\'s First and Second Laws', chapter: 'P5' },
  { number: 48, lesson: lessonP48, sections: newtonThirdSections, frames: newtonThirdFrames, title: 'Newton\'s Third Law', chapter: 'P5' },
  { number: 49, lesson: lessonP49, sections: motionPracSections, frames: motionPracFrames, title: 'Investigating motion', chapter: 'P5' },
  { number: 50, lesson: lessonP50, sections: stoppingSections, frames: stoppingFrames, title: 'Stopping distance and thinking distance', chapter: 'P5' },
  { number: 51, lesson: lessonP51, sections: brakingSections, frames: brakingFrames, title: 'Braking distance', chapter: 'P5' },
  { number: 52, lesson: lessonP52, sections: reactionTimeSections, frames: reactionTimeFrames, title: 'Reaction times', chapter: 'P5' },
  { number: 53, lesson: lessonP53, sections: waveTypeSections, frames: waveTypeFrames, title: 'Transverse and longitudinal waves', chapter: 'P6' },
  { number: 54, lesson: lessonP54, sections: waveSpeedSections, frames: waveSpeedFrames, title: 'Frequency, period and wave speed', chapter: 'P6' },
  { number: 55, lesson: lessonP55, sections: wavePracSections, frames: wavePracFrames, title: 'Investigating waves', chapter: 'P6' },
  { number: 56, lesson: lessonP56, sections: refractionSections, frames: refractionFrames, title: 'Refraction', chapter: 'P6' },
  { number: 57, lesson: lessonP57, sections: emSpectrumSections, frames: emSpectrumFrames, title: 'Electromagnetic waves', chapter: 'P6' },
  { number: 58, lesson: lessonP58, sections: emUseSections, frames: emUseFrames, title: 'Uses of radio waves, microwaves and infrared', chapter: 'P6' },
  { number: 59, lesson: lessonP59, sections: emMoreSections, frames: emMoreFrames, title: 'Uses of light, UV, X-rays and gamma rays', chapter: 'P6' },
]

for (const { number, lesson, sections, frames, title, chapter } of cases) {
  check(`${lesson.id}: metadata, source links, sections and sampled requirements`, () => {
    assert.match(lesson.id, new RegExp(`^P-[A-Z]{3}-${String(number).padStart(3, '0')}-P$`))
    assert.equal(lesson.title, title)
    assert.equal(lesson.strand, 'physics')
    assert.equal(lesson.contentVersion, '0.1.0')
    assert.equal(lesson.reviewStatus, 'draftNeedsTeacherReview')
    assert.equal(lesson.qualification, 'AQA-8464F')
    assert.equal(new Set(lesson.states.map(state => state.id)).size, lesson.states.length)
    lesson.states.forEach(state => assert.match(state.id, new RegExp(`^P${number}-\\d{2}$`)))
    const contexts = lesson.states.flatMap(state => state.kind === 'teaching' ? [] : [state.contextId])
    assert.equal(new Set(contexts).size, contexts.length)
    const sourceIds = lesson.sources.map(source => source.id)
    lesson.sources.forEach(source => assert.ok(source.url.startsWith('https://') && /6\.[456]\.\d/.test(source.locator)))
    lesson.states.forEach(state => {
      assert.ok(state.specRefs.length && state.specRefs.every(ref => /^6\.[456]\./.test(ref)), `${state.id}: spec refs`)
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

  check(`${lesson.id}: plain Year 10 wording, questions of 22 words or fewer, no Biology lesson references`, () => {
    const all = [...Object.values(frames).flat().map(f => `${f.label}. ${f.summary} ${f.text}`), ...lesson.states.map(learnerText)].join(' ')
    assert.doesNotMatch(all, /diagnostic|misconception|distractor|lesson \d|biology/i)
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
    let session = engine.createPreviewSession(`physics-lesson-${number}-flow`)
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
    let repair = engine.createPreviewSession(`physics-lesson-${number}-repair`)
    repair = engine.previewReducer(repair, { type: 'jump', id: independent.id })
    repair = engine.previewReducer(repair, { type: 'answer', response: independent.options.find(option => option.id !== independent.answerId)!.id, at })
    assert.equal(repair.answers[independent.id].result, 'incorrect')
    assert.equal(recommendedNext(evidenceProfile(lesson, Object.values(repair.answers)), false, lesson).kind, 'repair')
  })

  check(`${lesson.id}: registered as Physics Lesson ${number} in ${chapter}, with a revision deck`, () => {
    const entry = getScienceLesson('physics', number)!
    assert.equal(entry.lesson, lesson)
    assert.equal(entry.title, title)
    assert.equal(entry.sections, sections)
    assert.equal(entry.frames, frames)
    assert.equal(scienceLessonDir(entry), `physics/lesson-${number}`)
    assert.equal(scienceChapterFor(entry)?.code, chapter)
    assert.deepEqual(parseScienceLessonRef('physics', String(number)), { subject: 'physics', number })
    assert.equal(scienceSubjectLessonHref('physics', number), `/preview/science?subject=physics&lesson=${number}`)
    if (number > 1) assert.equal(getScienceLesson('physics', number - 1) && nextScienceLesson(getScienceLesson('physics', number - 1)!), entry, 'the previous lesson leads here')
    const facts = scienceFacts[lesson.id]
    assert.ok(facts, 'facts are registered')
    for (const section of Object.keys(facts.sections)) assert.ok(sections.some(item => item.id === section), `${section} is a section start`)
    for (const id of facts.recall) assert.equal(lesson.states.find(state => state.id === id)?.kind, 'choice', `${id}: recall is a choice question`)
    const deck = buildScienceDecks().find(item => item.lessonId === lesson.id)!
    assert.equal(deck.subject, 'physics')
    assert.equal(deck.number, number)
    assert.ok(deck.cards.length >= 8)
  })
}

check('Physics catalogue: Lessons 31–59 follow 1–30 in order, P4 holds 31–37, P5 holds 38–52, P6 starts at 53 and Lesson 59 leads on to 60', () => {
  assert.deepEqual(physicsLessons.slice(0, 59).map(item => item.number), Array.from({ length: 59 }, (_, i) => i + 1))
  assert.deepEqual(scienceUnits.filter(unit => unit.subject === 'physics').slice(0, 5).map(unit => [unit.code, unit.lessons.length]), [['P1', 14], ['P2', 12], ['P3', 4], ['P4', 7], ['P5', 15]])
  assert.equal(nextScienceLesson(getScienceLesson('physics', 59)!)?.number, 60)
  const cards = buildScienceDecks().flatMap(item => item.cards.map(card => card.id))
  assert.equal(new Set(cards).size, cards.length)
})

console.log(`${checks} Physics Lessons 31–59 checks passed`)

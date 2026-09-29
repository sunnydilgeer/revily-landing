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
import { lessonP1, storeSections } from './physics/lesson-1/lesson'
import { storeFrames } from './physics/lesson-1/teachingFrames'
import { lessonP2, conserveSections } from './physics/lesson-2/lesson'
import { conserveFrames } from './physics/lesson-2/teachingFrames'
import { lessonP3, kineticSections } from './physics/lesson-3/lesson'
import { kineticFrames } from './physics/lesson-3/teachingFrames'
import { lessonP4, potentialSections } from './physics/lesson-4/lesson'
import { potentialFrames } from './physics/lesson-4/teachingFrames'
import { lessonP5, heatCapacitySections } from './physics/lesson-5/lesson'
import { heatCapacityFrames } from './physics/lesson-5/teachingFrames'
import { lessonP6, powerSections } from './physics/lesson-6/lesson'
import { powerFrames } from './physics/lesson-6/teachingFrames'
import { lessonP7, shcPracticalSections } from './physics/lesson-7/lesson'
import { shcPracticalFrames } from './physics/lesson-7/teachingFrames'
import { lessonP8, insulationSections } from './physics/lesson-8/lesson'
import { insulationFrames } from './physics/lesson-8/teachingFrames'
import { lessonP9, efficiencySections } from './physics/lesson-9/lesson'
import { efficiencyFrames } from './physics/lesson-9/teachingFrames'
import { lessonP10, energyResourceSections } from './physics/lesson-10/lesson'
import { energyResourceFrames } from './physics/lesson-10/teachingFrames'
import { lessonP11, windSolarSections } from './physics/lesson-11/lesson'
import { windSolarFrames } from './physics/lesson-11/teachingFrames'
import { lessonP12, waterPowerSections } from './physics/lesson-12/lesson'
import { waterPowerFrames } from './physics/lesson-12/teachingFrames'
import { lessonP13, biofuelSections } from './physics/lesson-13/lesson'
import { biofuelFrames } from './physics/lesson-13/teachingFrames'
import { lessonP14, energyTrendSections } from './physics/lesson-14/lesson'
import { energyTrendFrames } from './physics/lesson-14/teachingFrames'
import { lessonP15, circuitSections } from './physics/lesson-15/lesson'
import { circuitFrames } from './physics/lesson-15/teachingFrames'
import { lessonP16, ohmSections } from './physics/lesson-16/lesson'
import { ohmFrames } from './physics/lesson-16/teachingFrames'
import { lessonP17, wireResistSections } from './physics/lesson-17/lesson'
import { wireResistFrames } from './physics/lesson-17/teachingFrames'
import { lessonP18, ivSections } from './physics/lesson-18/lesson'
import { ivFrames } from './physics/lesson-18/teachingFrames'
import { lessonP19, sensorSections } from './physics/lesson-19/lesson'
import { sensorFrames } from './physics/lesson-19/teachingFrames'
import { lessonP20, seriesSections } from './physics/lesson-20/lesson'
import { seriesFrames } from './physics/lesson-20/teachingFrames'
import { lessonP21, parallelSections } from './physics/lesson-21/lesson'
import { parallelFrames } from './physics/lesson-21/teachingFrames'
import { lessonP22, resistorPracSections } from './physics/lesson-22/lesson'
import { resistorPracFrames } from './physics/lesson-22/teachingFrames'
import { lessonP23, mainsSections } from './physics/lesson-23/lesson'
import { mainsFrames } from './physics/lesson-23/teachingFrames'
import { lessonP24, appliancePowerSections } from './physics/lesson-24/lesson'
import { appliancePowerFrames } from './physics/lesson-24/teachingFrames'
import { lessonP25, chargeEnergySections } from './physics/lesson-25/lesson'
import { chargeEnergyFrames } from './physics/lesson-25/teachingFrames'
import { lessonP26, gridSections } from './physics/lesson-26/lesson'
import { gridFrames } from './physics/lesson-26/teachingFrames'
import { lessonP27, gasParticleSections } from './physics/lesson-27/lesson'
import { gasParticleFrames } from './physics/lesson-27/teachingFrames'
import { lessonP28, densitySections } from './physics/lesson-28/lesson'
import { densityFrames } from './physics/lesson-28/teachingFrames'
import { lessonP29, internalSections } from './physics/lesson-29/lesson'
import { internalFrames } from './physics/lesson-29/teachingFrames'
import { lessonP30, latentSections } from './physics/lesson-30/lesson'
import { latentFrames } from './physics/lesson-30/teachingFrames'
import type { ScienceSection } from './lessonSections'
import type { TeachingFrame } from './teachingFrame'
import type { EvidenceDimension, ScienceLesson, ScienceState } from './types'

let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
const at = '2026-09-29T09:00:00.000Z'
const learnerText = (state: ScienceState) => state.kind === 'teaching'
  ? [state.title, state.body || '', ...(state.steps || [])].join(' ')
  : [state.title, state.hint, ...state.explanation.steps, state.explanation.answer, ...(state.kind === 'choice' ? state.options.map(o => o.label) : [])].join(' ')

type Case = { number: number; lesson: ScienceLesson; sections: readonly ScienceSection[]; frames: Record<string, TeachingFrame[]>; title: string; chapter: 'P1' | 'P2' | 'P3' }
const cases: Case[] = [
  { number: 1, lesson: lessonP1, sections: storeSections, frames: storeFrames, title: 'Energy stores and systems', chapter: 'P1' },
  { number: 2, lesson: lessonP2, sections: conserveSections, frames: conserveFrames, title: 'Conservation of energy', chapter: 'P1' },
  { number: 3, lesson: lessonP3, sections: kineticSections, frames: kineticFrames, title: 'Kinetic energy', chapter: 'P1' },
  { number: 4, lesson: lessonP4, sections: potentialSections, frames: potentialFrames, title: 'Gravitational and elastic potential energy', chapter: 'P1' },
  { number: 5, lesson: lessonP5, sections: heatCapacitySections, frames: heatCapacityFrames, title: 'Specific heat capacity', chapter: 'P1' },
  { number: 6, lesson: lessonP6, sections: powerSections, frames: powerFrames, title: 'Power', chapter: 'P1' },
  { number: 7, lesson: lessonP7, sections: shcPracticalSections, frames: shcPracticalFrames, title: 'Investigating specific heat capacity', chapter: 'P1' },
  { number: 8, lesson: lessonP8, sections: insulationSections, frames: insulationFrames, title: 'Reducing unwanted energy transfers', chapter: 'P1' },
  { number: 9, lesson: lessonP9, sections: efficiencySections, frames: efficiencyFrames, title: 'Efficiency', chapter: 'P1' },
  { number: 10, lesson: lessonP10, sections: energyResourceSections, frames: energyResourceFrames, title: 'Energy resources and their uses', chapter: 'P1' },
  { number: 11, lesson: lessonP11, sections: windSolarSections, frames: windSolarFrames, title: 'Wind, solar and geothermal power', chapter: 'P1' },
  { number: 12, lesson: lessonP12, sections: waterPowerSections, frames: waterPowerFrames, title: 'Hydro-electricity, waves and tides', chapter: 'P1' },
  { number: 13, lesson: lessonP13, sections: biofuelSections, frames: biofuelFrames, title: 'Bio-fuels and fossil fuels', chapter: 'P1' },
  { number: 14, lesson: lessonP14, sections: energyTrendSections, frames: energyTrendFrames, title: 'Trends in energy resource use', chapter: 'P1' },
  { number: 15, lesson: lessonP15, sections: circuitSections, frames: circuitFrames, title: 'Current, charge and circuit symbols', chapter: 'P2' },
  { number: 16, lesson: lessonP16, sections: ohmSections, frames: ohmFrames, title: 'Resistance and V = IR', chapter: 'P2' },
  { number: 17, lesson: lessonP17, sections: wireResistSections, frames: wireResistFrames, title: 'Investigating resistance in a wire', chapter: 'P2' },
  { number: 18, lesson: lessonP18, sections: ivSections, frames: ivFrames, title: 'I–V characteristics', chapter: 'P2' },
  { number: 19, lesson: lessonP19, sections: sensorSections, frames: sensorFrames, title: 'LDRs, thermistors and sensing circuits', chapter: 'P2' },
  { number: 20, lesson: lessonP20, sections: seriesSections, frames: seriesFrames, title: 'Series circuits', chapter: 'P2' },
  { number: 21, lesson: lessonP21, sections: parallelSections, frames: parallelFrames, title: 'Parallel circuits', chapter: 'P2' },
  { number: 22, lesson: lessonP22, sections: resistorPracSections, frames: resistorPracFrames, title: 'Investigating resistors in series and parallel', chapter: 'P2' },
  { number: 23, lesson: lessonP23, sections: mainsSections, frames: mainsFrames, title: 'Electricity in the home', chapter: 'P2' },
  { number: 24, lesson: lessonP24, sections: appliancePowerSections, frames: appliancePowerFrames, title: 'Power of electrical appliances', chapter: 'P2' },
  { number: 25, lesson: lessonP25, sections: chargeEnergySections, frames: chargeEnergyFrames, title: 'Energy, charge and power', chapter: 'P2' },
  { number: 26, lesson: lessonP26, sections: gridSections, frames: gridFrames, title: 'The National Grid', chapter: 'P2' },
  { number: 27, lesson: lessonP27, sections: gasParticleSections, frames: gasParticleFrames, title: 'The particle model and gas pressure', chapter: 'P3' },
  { number: 28, lesson: lessonP28, sections: densitySections, frames: densityFrames, title: 'Density', chapter: 'P3' },
  { number: 29, lesson: lessonP29, sections: internalSections, frames: internalFrames, title: 'Internal energy and changes of state', chapter: 'P3' },
  { number: 30, lesson: lessonP30, sections: latentSections, frames: latentFrames, title: 'Specific latent heat', chapter: 'P3' },
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
    lesson.sources.forEach(source => assert.ok(source.url.startsWith('https://') && /6\.[123]\.\d/.test(source.locator)))
    lesson.states.forEach(state => {
      assert.ok(state.specRefs.length && state.specRefs.every(ref => /^6\.[123]\./.test(ref)), `${state.id}: spec refs`)
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

check('Physics catalogue: Lessons 1–30 come first, P1 holds 1–14, P2 holds 15–26, P3 holds 27–30', () => {
  assert.deepEqual(physicsLessons.slice(0, 30).map(item => item.number), Array.from({ length: 30 }, (_, i) => i + 1))
  assert.deepEqual(scienceUnits.filter(unit => unit.subject === 'physics').slice(0, 3).map(unit => [unit.code, unit.lessons.length]), [['P1', 14], ['P2', 12], ['P3', 4]])
  const cards = buildScienceDecks().flatMap(item => item.cards.map(card => card.id))
  assert.equal(new Set(cards).size, cards.length)
})

console.log(`${checks} Physics Lessons 1–30 checks passed`)

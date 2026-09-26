import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { CellBiologyVisual } from './components/CellBiologyVisuals'
import { evidenceProfile, gradeResponse, progress, recommendedNext } from './engine'
import { createPreviewSessionEngine } from './previewSession'
import { lesson7, organisationSections } from './variants/b/lesson-7/lesson'
import { organisationFrames } from './variants/b/lesson-7/teachingFrames'
import { lesson8, enzymeSections } from './variants/b/lesson-8/lesson'
import { enzymeFrames } from './variants/b/lesson-8/teachingFrames'
import { lesson9, digestionSections } from './variants/b/lesson-9/lesson'
import { digestionFrames } from './variants/b/lesson-9/teachingFrames'
import type { EvidenceDimension } from './types'

let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
const lessons = [lesson7, lesson8, lesson9]
const frameSets = [organisationFrames, enzymeFrames, digestionFrames]
const sections = [organisationSections, enzymeSections, digestionSections]
const at = '2026-09-21T16:45:00.000Z'

lessons.forEach((lesson, index) => {
  check(`${lesson.id}: easier-only metadata, source links and assessment requirements`, () => {
    assert.equal(lesson.contentVersion, index === 2 ? '0.2.0' : '0.1.0')
    assert.equal(lesson.reviewStatus, 'draftNeedsTeacherReview')
    assert.equal(lesson.qualification, 'AQA-8464F')
    assert.equal(lesson.id, `B-ORG-00${index + 7}-B`)
    assert.equal(lesson.retrieval.length, 0)
    assert.equal(new Set(lesson.states.map(state => state.id)).size, lesson.states.length)
    const sourceIds = lesson.sources.map(source => source.id)
    lesson.sources.forEach(source => {
      assert.ok(source.url.startsWith('https://'))
      assert.ok(source.locator)
    })
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

  check(`${lesson.id}: every option grades correctly and written work stays teacher-only`, () => {
    for (const state of lesson.states) {
      if (state.kind === 'teaching') continue
      assert.ok(state.hint && state.explanation.answer && state.explanation.steps.length)
      if (state.kind === 'choice') {
        assert.equal(new Set(state.options.map(option => option.id)).size, state.options.length)
        assert.equal(state.options.filter(option => option.id === state.answerId).length, 1)
        state.options.forEach(option => assert.equal(gradeResponse(state, option.id).result, option.id === state.answerId ? 'correct' : 'incorrect'))
        assert.equal(state.explanation.answer, state.options.find(option => option.id === state.answerId)!.label)
        assert.throws(() => gradeResponse(state, 'unknown-option'))
      } else {
        assert.equal(state.marking, 'teacherOnly')
        assert.equal(state.rubric.marks, state.rubric.points.length)
        assert.ok(state.rubric.reject.length)
        assert.equal(gradeResponse(state, 'A response saved for review.').result, 'pendingTeacherReview')
        assert.throws(() => gradeResponse(state, '   '))
      }
    }
  })

  check(`${lesson.id}: teaching scripts and original visuals render without revealing answers`, () => {
    Object.entries(frameSets[index]).forEach(([id, frames]) => {
      const state = lesson.states.find(candidate => candidate.id === id)!
      assert.ok(state.kind === 'teaching' && state.media)
      assert.equal(state.media.script, frames.map(frame => `${frame.label}. ${frame.summary} ${frame.text}`).join(' '))
      frames.forEach(frame => {
        assert.ok(frame.summary && frame.text && frame.cue && frame.focus)
        const html = renderToStaticMarkup(<CellBiologyVisual focus={frame.focus!}/>)
        assert.ok(html.length > 20)
        assert.ok(!html.includes('NaN'))
      })
    })
    lesson.states.filter(state => state.visual).forEach(state => {
      const html = renderToStaticMarkup(<CellBiologyVisual focus={state.visual!.id} assessment={state.kind !== 'teaching'}/>)
      assert.ok(html.length > 20)
      assert.ok(!html.includes('NaN'))
      if (state.visual!.id === 'organisation-question') assert.ok(!html.includes('Cell') && html.includes('Level 1'))
      if (state.visual!.id === 'enzyme-match') assert.ok(!html.includes('>substrate<') && !html.includes('>enzyme<'))
      if (state.visual!.id === 'food-results-question') assert.ok(!html.includes('tests for'))
    })
  })

  check(`${lesson.id}: complete session reloads, locks answers and follows the B-only sequence`, () => {
    const engine = createPreviewSessionEngine(lesson)
    const reduce = engine.previewReducer
    let session = engine.createPreviewSession(`lesson-${index + 7}-flow`)
    session = reduce(session, { type: 'hint' })
    assert.ok(engine.restorePreviewSession(session)!.hintsOpen.includes(lesson.states[0].id))
    session = reduce(session, { type: 'hint' })
    for (const state of lesson.states) {
      assert.equal(session.currentId, state.id)
      if (state.kind !== 'teaching') {
        if (state.kind === 'written') {
          session = reduce(session, { type: 'draft', response: 'Original learner explanation.' })
          assert.equal(engine.restorePreviewSession(session)!.drafts[state.id], 'Original learner explanation.')
        }
        session = reduce(session, { type: 'answer', response: state.kind === 'choice' ? state.answerId : 'Original learner explanation.', at })
        const locked = session.answers[state.id]
        session = reduce(session, { type: 'answer', response: 'changed after submit', at })
        assert.deepEqual(session.answers[state.id], locked)
      }
      session = reduce(session, { type: 'continue', at })
      assert.ok(engine.restorePreviewSession(session))
    }
    assert.equal(session.currentId, null)
    assert.equal(progress(lesson, session.completedIds).fraction, 1)
    const profile = evidenceProfile(lesson, Object.values(session.answers))
    assert.equal(profile.pendingReview.length, 1)
    const next = recommendedNext(profile, false, lesson)
    assert.equal(next.kind, 'lesson')
    if (next.kind === 'lesson') assert.equal(next.lessonId, index < 2 ? lessons[index + 1].id : 'B-ORG-010-B')
  })
})

check('Scientific and practical boundaries match the intended Foundation lesson scope', () => {
  const organisation = Object.values(organisationFrames).flat().map(frame => `${frame.summary} ${frame.text}`).join(' ')
  const enzymes = Object.values(enzymeFrames).flat().map(frame => `${frame.summary} ${frame.text}`).join(' ')
  const digestion = Object.values(digestionFrames).flat().map(frame => `${frame.summary} ${frame.text}`).join(' ')
  assert.match(organisation, /cell, tissue, organ, organ system, organism/i)
  assert.match(organisation, /liver makes bile/i)
  assert.match(enzymes, /biological catalyst/i)
  assert.match(enzymes, /real enzymes are flexible/i)
  assert.match(enzymes, /Every 30 seconds, transfer a fresh drop/i)
  assert.match(enzymes, /teacher supervision and a risk assessment/i)
  assert.match(digestion, /glycerol and fatty acids/i)
  assert.match(digestion, /emulsification does not chemically digest/i)
  assert.match(digestion, /current AQA handbook uses ethanol and water/i)
  assert.match(digestion, /Some school methods use Sudan III/i)
  assert.match(digestion, /Do not perform these tests at home/i)
  assert.equal(1000 / 125, 8)
  assert.equal(1000 / 80, 12.5)
  assert.equal(Math.min(210, 120, 60, 170), 60)
})

check('All three easier-only lessons have isolated storage records', () => {
  const engines = lessons.map(createPreviewSessionEngine)
  assert.equal(new Set(engines.map(engine => engine.storageKey)).size, 3)
  engines.forEach(engine => engines.forEach(other => {
    if (engine !== other) assert.equal(other.restorePreviewSession(engine.createPreviewSession('isolation-check')), null)
  }))
})

console.log(`${checks} organisation lesson checks passed`)

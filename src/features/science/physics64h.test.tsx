import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CellBiologyVisual } from './components/CellBiologyVisuals'
import { LessonVisual } from './components/LessonVisual'
import { TeachingChunk, WorkedReasoning } from './components/TeachingChunk'
import { evidenceProfile, gradeResponse, progress, recommendedNext } from './engine'
import { createPreviewSessionEngine } from './previewSession'
import { lessonP64H, motorEffectSections } from './physics/lesson-64h/lesson'
import { motorEffectFrames } from './physics/lesson-64h/teachingFrames'
import { facts as motorFacts } from './cards/facts/physics/64h'
import type { ScienceSection } from './lessonSections'
import type { TeachingFrame } from './teachingFrame'
import type { EvidenceDimension, ScienceLesson, ScienceState } from './types'

// Physics Lesson 64H (The motor effect), a whole lesson only Higher students get. It is imported directly: its catalogue entry
// (higher/lessons.ts) and tier rules are tested in higher.test.ts. Same content checks as Chemistry Lesson 36H.
let checks = 0
function check(name: string, fn: () => void) { fn(); checks++; console.log(`PASS ${name}`) }
const at = '2026-09-29T09:00:00.000Z'
const learnerText = (state: ScienceState) => state.kind === 'teaching'
  ? [state.title, state.body || '', ...(state.steps || [])].join(' ')
  : [state.title, state.hint, ...state.explanation.steps, state.explanation.answer, ...(state.kind === 'choice' ? state.options.map(o => o.label) : [])].join(' ')

type Case = { number: string; lesson: ScienceLesson; sections: readonly ScienceSection[]; frames: Record<string, TeachingFrame[]>; title: string }
const cases: Case[] = [
  { number: '64H', lesson: lessonP64H, sections: motorEffectSections, frames: motorEffectFrames, title: 'The motor effect' },
]

for (const { number, lesson, sections, frames, title } of cases) {
  check(`${lesson.id}: metadata, source links, sections and sampled requirements`, () => {
    assert.equal(lesson.id, 'P-MAG-064H-P')
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
    lesson.sources.forEach(source => assert.ok(source.url.startsWith('https://') && /6\.7\.2\.2/.test(source.locator) && /6\.7\.2\.3/.test(source.locator)))
    lesson.states.forEach(state => {
      assert.ok(state.specRefs.length && state.specRefs.every(ref => /^6\.7\.2\./.test(ref)), `${state.id}: spec refs`)
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

  check(`${lesson.id}: plain Year 10 wording, questions of 22 words or fewer, no lesson-number references`, () => {
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

  check(`${lesson.id}: no tier label in learner text (the badge shows it), only 6.7.2.2–6.7.2.3 spec points`, () => {
    const all = [...Object.values(frames).flat().map(f => `${f.label}. ${f.summary} ${f.text} ${f.cue}`), ...lesson.states.map(learnerText), ...sections.map(s => `${s.label} ${s.detail}`)].join(' ')
    assert.doesNotMatch(all, /higher|foundation/i)
    lesson.states.forEach(state => state.specRefs.forEach(ref => assert.match(ref, /^6\.7\.2\.[23]$/)))
    assert.deepEqual(sections.map(s => s.label), ['Start here', 'The motor effect', 'Fleming’s left-hand rule', 'How big is the force?', 'The dc motor', 'On your own'])
    for (const id of Object.keys(frames)) for (const f of frames[id]) assert.ok(f.focus.startsWith('hmotor-'), `${f.focus}: Lesson 64H diagrams use the hmotor- prefix`)
    for (const state of lesson.states) if (state.visual) assert.ok(state.visual.id.startsWith('hmotor-'))
  })

  check(`${lesson.id}: key facts point at its sections and recall questions`, () => {
    assert.equal(motorFacts.lessonId, lesson.id)
    for (const section of Object.keys(motorFacts.sections)) assert.ok(sections.some(item => item.id === section), `${section} is a section start`)
    for (const id of motorFacts.recall) assert.equal(lesson.states.find(state => state.id === id)?.kind, 'choice', `${id}: recall is a choice question`)
  })
}

check('P-MAG-064H-P: worked and practice numbers agree with F = B I l', () => {
  const close = (a: number, b: number) => Math.abs(a - b) < 1e-9
  assert.ok(close(0.25 * 3.0 * 0.40, 0.30)) // P64H-09
  assert.ok(close(0.25 / (2.5 * 0.50), 0.20)) // P64H-10, 50 cm = 0.50 m
  assert.ok(close(0.30 * 4.0 * 0.50, 0.60)) // P64H-11
  assert.ok(close(0.12 / (0.20 * 0.15), 4.0)) // P64H-12, 15 cm = 0.15 m
  assert.ok(close(0.080 * 2.5 * 0.30, 0.060)) // P64H-16, 30 cm = 0.30 m
  for (const [i, f] of [[1.0, 0.05], [2.0, 0.10], [3.0, 0.15], [4.0, 0.20]]) assert.ok(close(0.20 * i * 0.25, f)) // P64H-18 table (B = 0.20 T, l = 0.25 m)
  // Fleming's left-hand rule as F = I × B, with x right, y into the page, z up.
  const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  assert.deepEqual(cross([0, -1, 0], [1, 0, 0]).map(v => v + 0), [0, 0, 1]) // teaching picture: current towards you, N on the left → up
  assert.deepEqual(cross([0, 1, 0], [1, 0, 0]).map(v => v + 0), [0, 0, -1]) // P64H-07: current away, N on the left → down
  assert.deepEqual(cross([0, 1, 0], [-1, 0, 0]).map(v => v + 0), [0, 0, 1]) // P64H-17: current away, poles swapped → up
  const answer = (id: string) => { const s = lessonP64H.states.find(state => state.id === id); return s?.kind === 'choice' ? s.options.find(o => o.id === s.answerId)!.label : '' }
  assert.equal(answer('P64H-07'), 'Down')
  assert.equal(answer('P64H-17'), 'Up')
  assert.equal(answer('P64H-11'), '0.60 N')
  assert.equal(answer('P64H-12'), '4.0 A')
  assert.equal(answer('P64H-16'), '0.060 N')
})

console.log(`${checks} Physics Lesson 64H checks passed`)

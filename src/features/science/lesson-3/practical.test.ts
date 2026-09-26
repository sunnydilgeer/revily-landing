import assert from 'node:assert/strict'
import { lesson3, practicalSections } from './lesson'
import { practicalFrames } from './teachingFrames'
import { lesson1 } from '../lesson-1/lesson'
import { lesson2 } from '../lesson-2/lesson'
import { createPreviewSessionEngine } from '../previewSession'
import { evidenceProfile, gradeResponse, progress, recommendedNext } from '../engine'
import type { ChoiceState } from '../types'

let checks = 0
const check = (name: string, fn: () => void) => { fn(); checks++; console.log(`PASS ${name}`) }
const engine = createPreviewSessionEngine(lesson3)
const at = '2026-09-14T07:00:00.000Z'
const find = (id: string) => lesson3.states.find(s => s.id === id)!
check('20 unique screens with resolvable menu and source references', () => {
  assert.equal(lesson3.states.length, 20)
  assert.equal(new Set(lesson3.states.map(s => s.id)).size, 20)
  for (const section of practicalSections) assert.ok(find(section.id))
  for (const state of lesson3.states) {
    assert.ok(state.specRefs.includes('10.2.1'))
    for (const id of state.sourceIds) assert.ok(lesson3.sources.some(s => s.id === id))
  }
  for (const requirement of Object.values(lesson3.requirements)) for (const id of requirement.inSession) {
    const state = find(id)
    assert.ok(state.kind !== 'teaching' && state.evidenceRole === 'independent')
  }
})
check('one route: safety, slide, microscope, look and draw, then scale, with a check after each', () => {
  const order = (id: string) => lesson3.states.findIndex(s => s.id === id)
  const route = ['B3-02', 'B3-04', 'B3-08', 'B3-12', 'B3-15', 'B3-18']
  assert.deepEqual(practicalSections.map(section => section.id).slice(1), route)
  route.forEach((id, i) => { if (i) assert.ok(order(route[i - 1]) < order(id)) })
  for (const [i, id] of route.slice(0, -1).entries()) assert.ok(lesson3.states.slice(order(id), order(route[i + 1])).some(s => s.kind !== 'teaching'), `${id} section has a check`)
  for (const state of lesson3.states) if (state.kind === 'teaching' && state.media) {
    assert.ok(practicalFrames[state.id].length)
    for (const frame of practicalFrames[state.id]) assert.ok(state.media.script.includes(frame.summary) && state.media.script.includes(frame.text))
  }
})
check('safety, observation limitations and magnification distinction are explicit', () => {
  const text = Object.values(practicalFrames).flat().map(f => f.text).join(' ')
  assert.ok(text.includes('eye protection') && text.includes('never pick it up by hand'))
  assert.ok(text.includes('watching from the side'))
  assert.ok(text.includes('Use small fine-focus movements') && text.includes('could hit the slide'))
  assert.ok(text.includes('prepares you for required practical 1. It does not replace doing it'))
  assert.ok(text.includes('not a microscope photograph') && text.includes('normally have no chloroplasts'))
  assert.ok(text.includes('The drawing can have a different magnification from the microscope'))
  assert.ok(text.includes('Your teacher provides'))
})
check('all options grade canonically with explanations, not guessed written marking', () => {
  for (const state of lesson3.states) if (state.kind === 'choice') {
    assert.equal(state.options.filter(o => o.id === state.answerId).length, 1)
    assert.equal(new Set(state.options.map(o => o.id)).size, state.options.length)
    assert.ok(state.hint && state.explanation.steps.length && state.explanation.answer)
    for (const option of state.options) assert.equal(gradeResponse(state, option.id).result, option.id === state.answerId ? 'correct' : 'incorrect')
  }
  assert.equal(gradeResponse(find('B3-20'), 'A method').result, 'pendingTeacherReview')
})
check('measurements agree independently with multiplication, division and conversion', () => {
  const numerical: Record<string, number> = { 'B3-18': 30 / .25 }
  for (const [id, result] of Object.entries(numerical)) {
    const state = find(id) as ChoiceState
    assert.equal(Number(state.options.find(o => o.id === state.answerId)!.label.replace(/[^0-9.]/g, '')), result)
  }
  assert.equal(24 / .3, 80); assert.equal(1.2 / 4 * 1000, 300)
  const steps = (find('B3-16') as { steps: string[] }).steps
  assert.ok(steps[steps.length - 1].includes('×80'))
})
check('three lesson engines reject each other and cannot navigate to foreign states', () => {
  const engines = [createPreviewSessionEngine(lesson1), createPreviewSessionEngine(lesson2), engine]
  assert.equal(new Set(engines.map(e => e.storageKey)).size, 3)
  for (const a of engines) for (const b of engines) if (a !== b) assert.equal(a.restorePreviewSession(b.createPreviewSession('foreign')), null)
  const session = engine.createPreviewSession('test')
  assert.equal(engine.previewReducer(session, { type: 'jump', id: 'B2-02' }), session)
})
check('complete flow has distinct evidence, pending written work and next topic 004', () => {
  let session = engine.createPreviewSession('flow')
  for (const state of lesson3.states) {
    assert.equal(session.currentId, state.id)
    if (state.kind !== 'teaching') session = engine.previewReducer(session, { type: 'answer', at, response: state.kind === 'choice' ? state.answerId : 'Use flat thin tissue in water and iodine; lower cover at an angle; start low and focus safely.' })
    session = engine.previewReducer(session, { type: 'continue', at })
  }
  assert.equal(session.currentId, null); assert.equal(progress(lesson3, session.completedIds).fraction, 1)
  assert.deepEqual(engine.restorePreviewSession(JSON.parse(JSON.stringify(session))), session)
  const profile = evidenceProfile(lesson3, Object.values(session.answers))
  const required = Object.keys(lesson3.requirements).filter(d => d !== 'explanation') as (keyof typeof profile.dimensions)[]
  assert.ok(required.includes('calculation') && required.includes('practicalReasoning'))
  for (const d of required) assert.equal(profile.dimensions[d], 'secureInSession')
  assert.equal(profile.dimensions.explanation, 'developing'); assert.deepEqual(profile.pendingReview, ['B3-20'])
  assert.equal(recommendedNext(profile, false, lesson3).lessonId, 'B-CELL-004-B')
})
check('hint evidence, locked responses, draft restoration and skipped completion remain honest', () => {
  let session = engine.previewReducer(engine.createPreviewSession('support'), { type: 'jump', id: 'B3-18' })
  session = engine.previewReducer(session, { type: 'hint' })
  session = engine.previewReducer(session, { type: 'answer', at, response: '120' })
  assert.ok(session.answers['B3-18'].usedHint)
  assert.equal(engine.previewReducer(session, { type: 'answer', at, response: '7.5' }), session)
  assert.equal(evidenceProfile(lesson3, Object.values(session.answers)).dimensions.calculation, 'developing')
  session = engine.previewReducer(session, { type: 'jump', id: 'B3-20' })
  session = engine.previewReducer(session, { type: 'draft', response: 'My ordered method.' })
  assert.equal(engine.restorePreviewSession(JSON.parse(JSON.stringify(session)))?.drafts['B3-20'], 'My ordered method.')
  assert.equal(progress(lesson3, session.completedIds).completed, 0)
})
console.log(`${checks} practical checks passed.`)

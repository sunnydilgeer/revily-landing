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
check('30 unique screens with resolvable menu and source references', () => {
  assert.equal(lesson3.states.length, 30)
  assert.equal(new Set(lesson3.states.map(s => s.id)).size, 30)
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
check('slide, microscope, separate plant/animal observations, drawing and scale are sequenced', () => {
  const order = (id: string) => lesson3.states.findIndex(s => s.id === id)
  assert.ok(order('B3-04') < order('B3-08'))
  assert.ok(order('B3-14') < order('B3-15') && order('B3-15') < order('B3-16'))
  assert.ok(order('B3-16') < order('B3-19') && order('B3-19') < order('B3-22'))
  for (const state of lesson3.states) if (state.kind === 'teaching' && state.media) {
    assert.ok(practicalFrames[state.id].length)
    for (const frame of practicalFrames[state.id]) assert.ok(state.media.script.includes(frame.summary) && state.media.script.includes(frame.text))
  }
})
check('safety, observation limitations and magnification distinction are explicit', () => {
  const text = Object.values(practicalFrames).flat().map(f => f.text).join(' ')
  assert.ok(text.includes('eye protection') && text.includes('never pick up shards by hand'))
  assert.ok(text.includes('Watch') || text.includes('watching the gap'))
  assert.ok(text.includes('fine adjustment at high power'))
  assert.ok(text.includes('does not complete required practical 1'))
  assert.ok(text.includes('not a micrograph') && text.includes('normally have no chloroplasts'))
  assert.ok(text.includes('not automatically the drawing magnification'))
  assert.ok(text.includes('provided by your teacher'))
})
check('all options grade canonically with explanations, not guessed written marking', () => {
  for (const state of lesson3.states) if (state.kind === 'choice') {
    assert.equal(state.options.filter(o => o.id === state.answerId).length, 1)
    assert.equal(new Set(state.options.map(o => o.id)).size, state.options.length)
    assert.ok(state.hint && state.explanation.steps.length && state.explanation.answer)
    for (const option of state.options) assert.equal(gradeResponse(state, option.id).result, option.id === state.answerId ? 'correct' : 'incorrect')
  }
  assert.equal(gradeResponse(find('B3-30'), 'A method').result, 'pendingTeacherReview')
})
check('measurements agree independently with multiplication, division and conversion', () => {
  const numerical: Record<string, number> = { 'B3-21': 10 * 40, 'B3-28': 30 / .25, 'B3-29': 1.5 / 5 * 1000 }
  for (const [id, result] of Object.entries(numerical)) {
    const state = find(id) as ChoiceState
    assert.equal(Number(state.options.find(o => o.id === state.answerId)!.label.replace(/[^0-9.]/g, '')), result)
  }
  assert.equal(24 / .3, 80); assert.equal(1.2 / 4 * 1000, 300)
  const steps = (find('B3-20') as { steps: string[] }).steps
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
  for (const d of ['recall', 'practicalReasoning', 'application', 'calculation', 'dataInterpretation'] as const) assert.equal(profile.dimensions[d], 'secureInSession')
  assert.equal(profile.dimensions.understanding, 'developing') // guided items, not required independent evidence
  assert.equal(profile.dimensions.explanation, 'developing'); assert.deepEqual(profile.pendingReview, ['B3-30'])
  assert.equal(recommendedNext(profile, false, lesson3).lessonId, 'B-CELL-004')
})
check('hint evidence, locked responses, draft restoration and skipped completion remain honest', () => {
  let session = engine.previewReducer(engine.createPreviewSession('support'), { type: 'jump', id: 'B3-28' })
  session = engine.previewReducer(session, { type: 'hint' })
  session = engine.previewReducer(session, { type: 'answer', at, response: '120' })
  assert.ok(session.answers['B3-28'].usedHint)
  assert.equal(engine.previewReducer(session, { type: 'answer', at, response: '7.5' }), session)
  assert.equal(evidenceProfile(lesson3, Object.values(session.answers)).dimensions.calculation, 'developing')
  session = engine.previewReducer(session, { type: 'jump', id: 'B3-30' })
  session = engine.previewReducer(session, { type: 'draft', response: 'My ordered method.' })
  assert.equal(engine.restorePreviewSession(JSON.parse(JSON.stringify(session)))?.drafts['B3-30'], 'My ordered method.')
  assert.equal(progress(lesson3, session.completedIds).completed, 0)
})
console.log(`${checks} practical checks passed.`)

import { strict as assert } from 'node:assert'
import { lesson1 } from '../lesson-1/lesson'
import { lesson2, microscopySections } from './lesson'
import { microscopyFrames } from './teachingFrames'
import { createPreviewSessionEngine } from '../previewSession'
import { evidenceProfile, gradeResponse, recommendedNext } from '../engine'
import type { ChoiceState } from '../types'

let checks = 0
const check = (name: string, fn: () => void) => { fn(); checks++; console.log(`PASS ${name}`) }
const engine = createPreviewSessionEngine(lesson2)
const cellsEngine = createPreviewSessionEngine(lesson1)
const at = '2026-09-14T06:00:00.000Z'
const find = (id: string) => lesson2.states.find(s => s.id === id)!
check('34 unique screens, source references and resolvable menu targets', () => {
  assert.equal(lesson2.states.length, 34)
  assert.equal(new Set(lesson2.states.map(s => s.id)).size, 34)
  for (const section of microscopySections) assert.ok(find(section.id))
  for (const state of lesson2.states) {
    assert.ok(state.specRefs.includes('4.1.1.5'))
    for (const id of state.sourceIds) assert.ok(lesson2.sources.some(s => s.id === id))
  }
})
check('each instrument precedes comparison; resolution is taught separately', () => {
  const order = (id: string) => lesson2.states.findIndex(s => s.id === id)
  assert.ok(order('B2-02') < order('B2-08') && order('B2-08') < order('B2-09'))
  assert.ok(microscopyFrames['B2-04'].every(f => f.focus.startsWith('magnification')))
  assert.ok(microscopyFrames['B2-06'].every(f => f.focus.startsWith('resolution')))
  for (const state of lesson2.states) if (state.kind === 'teaching' && state.media) {
    assert.ok(microscopyFrames[state.id].length)
    for (const frame of microscopyFrames[state.id]) assert.ok(state.media.script.includes(frame.summary))
  }
})
check('all choices grade every option and provide explanations without guessed marking', () => {
  for (const state of lesson2.states) if (state.kind === 'choice') {
    assert.equal(state.options.filter(o => o.id === state.answerId).length, 1)
    assert.equal(new Set(state.options.map(o => o.id)).size, state.options.length)
    assert.ok(state.hint && state.explanation.steps.length && state.explanation.answer)
    for (const option of state.options) assert.equal(gradeResponse(state, option.id).result, option.id === state.answerId ? 'correct' : 'incorrect')
  }
})
check('numerical answers independently agree with formulas and unit conversions', () => {
  const calculations: Record<string, number> = { 'B2-03': 10 * 10, 'B2-14': 9 / .03, 'B2-17': 10 / (25 / 1000), 'B2-22': 50 * 200 / 1000,
    'B2-29': 8 / .02, 'B2-30': 15 / (50 / 1000), 'B2-31': 24 / 600 * 1000, 'B2-32': .025 * 400 }
  for (const [id, result] of Object.entries(calculations)) {
    const state = find(id) as ChoiceState
    assert.equal(Number(state.options.find(o => o.id === state.answerId)!.label.replace(/[^0-9.]/g, '')), result)
  }
  assert.equal(6 * 10 ** -3, .006); assert.equal(7 * 10 ** -3, .007)
  assert.equal((find('B2-24') as ChoiceState).answerId, '6')
  assert.equal((find('B2-33') as ChoiceState).answerId, '7')
})
check('lesson storage and restored identities are isolated; legacy cells progress remains compatible', () => {
  assert.notEqual(engine.storageKey, cellsEngine.storageKey)
  assert.equal(engine.restorePreviewSession(cellsEngine.createPreviewSession('cells')), null)
  assert.equal(cellsEngine.restorePreviewSession(engine.createPreviewSession('micro')), null)
  const cells = cellsEngine.createPreviewSession('legacy')
  const { lessonId, ...legacy } = cells
  assert.deepEqual(cellsEngine.restorePreviewSession(legacy), cells)
  let micro = engine.createPreviewSession('test')
  assert.equal(engine.previewReducer(micro, { type: 'jump', id: 'B1-02' }), micro)
  assert.deepEqual(cellsEngine.createPreviewSession('cells').completedIds, [])
})
check('all 34 screens flow to summary; written work remains pending and saved', () => {
  let session = engine.createPreviewSession('flow')
  for (const state of lesson2.states) {
    assert.equal(session.currentId, state.id)
    if (state.kind !== 'teaching') session = engine.previewReducer(session, { type: 'answer', at, response: state.kind === 'choice' ? state.answerId : 'Greater resolution distinguishes smaller structures and improves our understanding of cell structure.' })
    session = engine.previewReducer(session, { type: 'continue', at })
  }
  assert.equal(session.currentId, null); assert.equal(session.completedIds.length, 34)
  assert.deepEqual(engine.restorePreviewSession(JSON.parse(JSON.stringify(session))), session)
  const profile = evidenceProfile(lesson2, Object.values(session.answers))
  for (const dimension of ['recall', 'understanding', 'application', 'calculation'] as const) assert.equal(profile.dimensions[dimension], 'secureInSession')
  assert.equal(profile.dimensions.explanation, 'developing'); assert.deepEqual(profile.pendingReview, ['B2-34'])
  assert.equal(profile.dimensions.practicalReasoning, 'notAssessed')
  assert.equal(recommendedNext(profile, false, lesson2).lessonId, 'B-CELL-003')
})
check('hints, submission locks and reloads retain their evidence rules', () => {
  let session = engine.previewReducer(engine.createPreviewSession('support'), { type: 'jump', id: 'B2-29' })
  session = engine.previewReducer(session, { type: 'hint' })
  session = engine.previewReducer(session, { type: 'answer', at, response: '400' })
  assert.ok(session.answers['B2-29'].usedHint)
  assert.equal(engine.previewReducer(session, { type: 'answer', at, response: '160' }), session)
  assert.deepEqual(engine.restorePreviewSession(JSON.parse(JSON.stringify(session))), session)
  assert.equal(evidenceProfile(lesson2, Object.values(session.answers)).dimensions.calculation, 'developing')
  session = engine.previewReducer(session, { type: 'jump', id: 'B2-34' })
  session = engine.previewReducer(session, { type: 'draft', response: 'My draft explanation.' })
  assert.equal(engine.restorePreviewSession(JSON.parse(JSON.stringify(session)))?.drafts['B2-34'], 'My draft explanation.')
})
console.log(`${checks} microscopy checks passed.`)

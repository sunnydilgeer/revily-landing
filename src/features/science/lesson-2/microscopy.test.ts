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
const at = '2026-09-26T06:00:00.000Z'
const find = (id: string) => lesson2.states.find(s => s.id === id)!
const order = (id: string) => lesson2.states.findIndex(s => s.id === id)
const total = lesson2.states.length
const frameText = (id: string) => microscopyFrames[id].map(f => `${f.summary} ${f.text}`).join(' ')

check('unique screens, source references and resolvable menu targets', () => {
  assert.ok(total >= 15 && total <= 19)
  assert.equal(new Set(lesson2.states.map(s => s.id)).size, total)
  for (const section of microscopySections) assert.ok(find(section.id))
  assert.equal(microscopySections.at(-1)!.label, 'On your own')
  for (const state of lesson2.states) {
    assert.ok(state.specRefs.includes('4.1.1.5'))
    for (const id of state.sourceIds) assert.ok(lesson2.sources.some(s => s.id === id))
  }
})
check('magnification is defined before it is used; each instrument precedes the comparison', () => {
  assert.ok(order('B2-02') < order('B2-04') && order('B2-04') < order('B2-03'))
  assert.ok(!/magnification/i.test(frameText('B2-02')), 'The light-microscope walkthrough must not use magnification before it is defined')
  assert.ok(order('B2-06') < order('B2-08'))
  assert.ok(microscopyFrames['B2-06'].every(f => f.focus!.startsWith('resolution')))
  assert.ok(microscopyFrames['B2-08'].some(f => f.focus === 'microscope-comparison'))
  for (const state of lesson2.states) if (state.kind === 'teaching' && state.media) {
    assert.ok(microscopyFrames[state.id].length)
    for (const frame of microscopyFrames[state.id]) assert.ok(state.media.script.includes(frame.summary))
  }
})
check('scientific caveats stay in the teaching', () => {
  assert.ok(frameText('B2-06').includes('one blurred patch'))
  assert.ok(frameText('B2-06').includes('a bigger blur'))
  assert.ok(frameText('B2-04').includes('The real cell has not grown'))
  assert.ok(frameText('B2-08').includes('The microscopes revealed these parts; they did not create them.'))
  assert.ok(frameText('B2-02').includes('It does not make it bigger.'))
})
check('all choices grade every option and provide explanations without guessed marking', () => {
  for (const state of lesson2.states) if (state.kind === 'choice') {
    assert.equal(state.options.filter(o => o.id === state.answerId).length, 1)
    assert.equal(new Set(state.options.map(o => o.id)).size, state.options.length)
    assert.ok(state.hint && state.explanation.steps.length && state.explanation.answer)
    for (const option of state.options) assert.equal(gradeResponse(state, option.id).result, option.id === state.answerId ? 'correct' : 'incorrect')
  }
})
check('numerical answers independently agree with the total-magnification rule', () => {
  const calculations: Record<string, number> = { 'B2-03': 10 * 10, 'B2-37': 10 * 40 }
  for (const [id, result] of Object.entries(calculations)) {
    const state = find(id) as ChoiceState
    assert.equal(Number(state.options.find(o => o.id === state.answerId)!.label.replace(/[^0-9.]/g, '')), result)
  }
})
check('lesson storage and restored identities are isolated; records without a lesson ID are rejected', () => {
  assert.notEqual(engine.storageKey, cellsEngine.storageKey)
  assert.equal(engine.restorePreviewSession(cellsEngine.createPreviewSession('cells')), null)
  assert.equal(cellsEngine.restorePreviewSession(engine.createPreviewSession('micro')), null)
  const cells = cellsEngine.createPreviewSession('legacy')
  const { lessonId, ...legacy } = cells
  assert.equal(cellsEngine.restorePreviewSession(legacy), null)
  const micro = engine.createPreviewSession('test')
  assert.equal(engine.previewReducer(micro, { type: 'jump', id: 'B1-02' }), micro)
  assert.deepEqual(cellsEngine.createPreviewSession('cells').completedIds, [])
})
check('all screens flow to summary; written work remains pending and saved', () => {
  let session = engine.createPreviewSession('flow')
  for (const state of lesson2.states) {
    assert.equal(session.currentId, state.id)
    if (state.kind !== 'teaching') session = engine.previewReducer(session, { type: 'answer', at, response: state.kind === 'choice' ? state.answerId : 'Greater resolution distinguishes smaller structures and improves our understanding of cell structure.' })
    session = engine.previewReducer(session, { type: 'continue', at })
  }
  assert.equal(session.currentId, null); assert.equal(session.completedIds.length, total)
  assert.deepEqual(engine.restorePreviewSession(JSON.parse(JSON.stringify(session))), session)
  const profile = evidenceProfile(lesson2, Object.values(session.answers))
  for (const dimension of ['understanding', 'application', 'calculation'] as const) assert.equal(profile.dimensions[dimension], 'secureInSession')
  assert.equal(profile.dimensions.explanation, 'developing'); assert.deepEqual(profile.pendingReview, ['B2-34'])
  assert.equal(profile.dimensions.practicalReasoning, 'notAssessed')
  // A perfect learner moves on (next lesson: magnification maths once the engine is wired to it).
  assert.equal(recommendedNext(profile, false, lesson2).kind, 'lesson')
})
check('hints, submission locks and reloads retain their evidence rules', () => {
  let session = engine.previewReducer(engine.createPreviewSession('support'), { type: 'jump', id: 'B2-37' })
  session = engine.previewReducer(session, { type: 'hint' })
  const state = find('B2-37') as ChoiceState
  session = engine.previewReducer(session, { type: 'answer', at, response: state.answerId })
  assert.ok(session.answers['B2-37'].usedHint)
  assert.equal(engine.previewReducer(session, { type: 'answer', at, response: state.options.find(o => o.id !== state.answerId)!.id }), session)
  assert.deepEqual(engine.restorePreviewSession(JSON.parse(JSON.stringify(session))), session)
  assert.equal(evidenceProfile(lesson2, Object.values(session.answers)).dimensions.calculation, 'developing')
  session = engine.previewReducer(session, { type: 'jump', id: 'B2-34' })
  session = engine.previewReducer(session, { type: 'draft', response: 'My draft explanation.' })
  assert.equal(engine.restorePreviewSession(JSON.parse(JSON.stringify(session)))?.drafts['B2-34'], 'My draft explanation.')
})
console.log(`${checks} microscopy checks passed.`)

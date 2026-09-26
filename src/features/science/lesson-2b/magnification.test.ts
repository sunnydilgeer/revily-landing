import { strict as assert } from 'node:assert'
import { lesson2 } from '../lesson-2/lesson'
import { lesson2b, magnificationSections } from './lesson'
import { magnificationFrames } from './teachingFrames'
import { createPreviewSessionEngine } from '../previewSession'
import { evidenceProfile, gradeResponse, recommendedNext } from '../engine'
import type { ChoiceState } from '../types'

let checks = 0
const check = (name: string, fn: () => void) => { fn(); checks++; console.log(`PASS ${name}`) }
const engine = createPreviewSessionEngine(lesson2b)
const microscopesEngine = createPreviewSessionEngine(lesson2)
const at = '2026-09-26T06:00:00.000Z'
const find = (id: string) => lesson2b.states.find(s => s.id === id)!
const order = (id: string) => lesson2b.states.findIndex(s => s.id === id)
const total = lesson2b.states.length
const frameText = (id: string) => magnificationFrames[id].map(f => `${f.summary} ${f.text}`).join(' ')
const answerNumber = (id: string) => { const s = find(id) as ChoiceState; return Number(s.options.find(o => o.id === s.answerId)!.label.replace(/[^0-9.]/g, '')) }

check('unique screens, source references, resolvable menu targets and no clash with the microscopes lesson', () => {
  assert.ok(total >= 15 && total <= 19)
  assert.equal(new Set(lesson2b.states.map(s => s.id)).size, total)
  for (const section of magnificationSections) assert.ok(find(section.id))
  assert.equal(magnificationSections.at(-1)!.label, 'On your own')
  for (const state of lesson2b.states) {
    assert.ok(state.specRefs.includes('4.1.1.5'))
    for (const id of state.sourceIds) assert.ok(lesson2b.sources.some(s => s.id === id))
    assert.ok(!lesson2.states.some(s => s.id === state.id), `${state.id} also appears in the microscopes lesson`)
  }
})
check('units come before the magnification rule; each worked example is followed by new-number practice', () => {
  assert.ok(order('B1-29') < order('B2-12') && order('B2-12') < order('B2-18'))
  for (const [example, practice] of [['B2-13', 'B2-17'], ['B2-16', 'B2-17'], ['B2-19', 'B2-31'], ['B2-21', 'B2-22'], ['B1-30', 'B1-35']]) {
    assert.ok(order(example) < order(practice))
    const exampleNumbers = find(example).body!.match(/\d+(\.\d+)?/g)!
    const practiceNumbers = find(practice).title.match(/\d+(\.\d+)?/g)!
    assert.notDeepEqual(practiceNumbers, exampleNumbers, `${practice} must use new numbers`)
  }
  for (const state of lesson2b.states) if (state.kind === 'teaching' && state.media)
    for (const frame of magnificationFrames[state.id]) assert.ok(state.media.script.includes(frame.summary))
})
check('scientific caveats stay in the teaching', () => {
  assert.ok(frameText('B1-29').includes('Real cell sizes vary.'))
  assert.ok(frameText('B1-29').includes('It does not mean a negative length.'))
  assert.ok(frameText('B2-12').includes('Always use the size given in the question, not this screen.'))
  assert.ok(frameText('B2-12').includes('It has no mm or µm, because it compares two sizes.'))
  assert.ok(frameText('B2-41').includes('The curved shape does not exactly fill the rectangle.'))
  const areaExample = find('B1-30')
  assert.ok(areaExample.kind === 'teaching' && (areaExample.steps || []).some(step => step.includes('does not exactly fill the rectangle')))
})
check('all choices grade every option and provide explanations without guessed marking', () => {
  for (const state of lesson2b.states) if (state.kind === 'choice') {
    assert.equal(state.options.filter(o => o.id === state.answerId).length, 1)
    assert.equal(new Set(state.options.map(o => o.id)).size, state.options.length)
    assert.ok(state.hint && state.explanation.steps.length && state.explanation.answer)
    for (const option of state.options) assert.equal(gradeResponse(state, option.id).result, option.id === state.answerId ? 'correct' : 'incorrect')
  }
})
check('numerical answers independently agree with formulas and unit conversions', () => {
  const close = (a: number, b: number) => Math.abs(a - b) < 1e-9
  const calculations: Record<string, number> = {
    'B2-40': .002 * 1000, 'B2-17': 10 / (25 / 1000), 'B2-31': 24 / 600 * 1000, 'B2-22': 50 * 200 / 1000,
    'B1-35': 6 * 2, 'B2-30': 15 / (50 / 1000),
  }
  for (const [id, result] of Object.entries(calculations)) assert.ok(close(answerNumber(id), result), `${id}: expected ${result}`)
  assert.ok(close(6 * 10 ** -3, .006)); assert.ok((find('B2-24') as ChoiceState).explanation.answer.startsWith('6 × 10⁻³'))
  assert.ok(close(12 / .03, 400) && close(18 / .03, 600) && close(15 / 500 * 1000, 30) && close(.04 * 250, 10) && close(8 * 2, 16))
  assert.ok((find('B2-42') as ChoiceState).explanation.answer.includes(String(36 / 400)))
  const written = find('B2-43')
  assert.ok(written.kind === 'written' && written.explanation.answer.includes(`${30 / 600 * 1000} µm`))
})
check('lesson storage and restored identities are isolated from the microscopes lesson', () => {
  assert.notEqual(engine.storageKey, microscopesEngine.storageKey)
  assert.equal(engine.restorePreviewSession(microscopesEngine.createPreviewSession('micro')), null)
  assert.equal(microscopesEngine.restorePreviewSession(engine.createPreviewSession('maths')), null)
  const maths = engine.createPreviewSession('test')
  assert.equal(engine.previewReducer(maths, { type: 'jump', id: 'B2-02' }), maths)
})
check('all screens flow to summary; written work remains pending and a perfect learner is not sent to revise', () => {
  let session = engine.createPreviewSession('flow')
  for (const state of lesson2b.states) {
    assert.equal(session.currentId, state.id)
    if (state.kind !== 'teaching') session = engine.previewReducer(session, { type: 'answer', at, response: state.kind === 'choice' ? state.answerId : 'Real size = image size ÷ magnification; 30 ÷ 600 = 0.05 mm = 50 µm.' })
    session = engine.previewReducer(session, { type: 'continue', at })
  }
  assert.equal(session.currentId, null); assert.equal(session.completedIds.length, total)
  assert.deepEqual(engine.restorePreviewSession(JSON.parse(JSON.stringify(session))), session)
  const profile = evidenceProfile(lesson2b, Object.values(session.answers))
  for (const dimension of ['calculation', 'understanding'] as const) assert.equal(profile.dimensions[dimension], 'secureInSession')
  assert.equal(profile.dimensions.explanation, 'developing'); assert.deepEqual(profile.pendingReview, ['B2-43'])
  assert.notEqual(recommendedNext(profile, false, lesson2b).kind, 'repair')
})
check('hints, submission locks and reloads retain their evidence rules', () => {
  let session = engine.previewReducer(engine.createPreviewSession('support'), { type: 'jump', id: 'B2-30' })
  session = engine.previewReducer(session, { type: 'hint' })
  const state = find('B2-30') as ChoiceState
  session = engine.previewReducer(session, { type: 'answer', at, response: state.answerId })
  assert.ok(session.answers['B2-30'].usedHint)
  assert.equal(engine.previewReducer(session, { type: 'answer', at, response: '0' }), session)
  assert.equal(evidenceProfile(lesson2b, Object.values(session.answers)).dimensions.calculation, 'developing')
  session = engine.previewReducer(session, { type: 'jump', id: 'B2-43' })
  session = engine.previewReducer(session, { type: 'draft', response: 'My draft method.' })
  assert.equal(engine.restorePreviewSession(JSON.parse(JSON.stringify(session)))?.drafts['B2-43'], 'My draft method.')
})
console.log(`${checks} magnification checks passed.`)

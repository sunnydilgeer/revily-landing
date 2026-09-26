import { strict as assert } from 'node:assert'
import { evidenceProfile, gradeResponse, misconceptionSignal, nextStateId, progress, recommendedNext, retrievalDueAt } from './engine'
import { lesson1 } from './lesson-1/lesson'
import { lesson1b } from './lesson-1b/lesson'
import { lesson2b } from './lesson-2b/lesson'
import type { AttemptEvent, ChoiceState, ScienceLesson } from './types'
import { scienceCurriculum } from './curriculum'
import { teachingFrames } from './lesson-1/teachingFrames'
import { plantPartIds } from './teachingFrame'

// Lesson 1 content checks run on the real lesson. Its requirements are sampled from its "On your own"
// questions and it carries no delayed retrieval, so the engine's retention/session rules are checked on a
// fixture built from lesson 1: B1-12 is made an independent recall target and B1-R01 is its delayed copy.
const lessonAll = [...lesson1.states, ...lesson1.retrieval]
const recallTarget = { ...(lesson1.states.find(s => s.id === 'B1-12') as ChoiceState), evidenceRole: 'independent' as const }
const retrievalCheck: ChoiceState = { ...recallTarget, id: 'B1-R01', phase: 'retrieval', contextId: 'cells-B1-R01', evidenceRole: 'delayed' }
const fixture: ScienceLesson = { ...lesson1,
  states: lesson1.states.map(s => s.id === 'B1-12' ? recallTarget : s), retrieval: [retrievalCheck],
  requirements: { recall: { inSession: ['B1-12'], delayed: ['B1-R01'] }, application: { inSession: ['B1-20', 'B1-19', 'B1-45'], delayed: [] }, explanation: { inSession: ['B1-46'], delayed: [] } } }
const all = [...fixture.states, ...fixture.retrieval]
const find = (id: string) => all.find(state => state.id === id)!
let assertions = 0
function check(name: string, fn: () => void) { fn(); assertions++; console.log(`PASS ${name}`) }
function event(id: string, overrides: Partial<AttemptEvent> = {}): AttemptEvent {
  const state = find(id)
  const response = state.kind === 'choice' ? state.answerId : 'A leaf cell has a cell wall, but an animal cell does not.'
  return { id: `event-${id}`, lessonId: lesson1.id, contentVersion: lesson1.contentVersion, stateId: id,
    sessionId: 'session-1', recordedAt: '2026-09-13T10:00:00.000Z', attempt: 1,
    usedHint: false, answerPreviouslySeen: false, response,
    ...gradeResponse(state, response), ...overrides }
}
const independentIn = (lesson: ScienceLesson) => lesson.states.filter(state => state.kind !== 'teaching' && state.evidenceRole === 'independent')
const lessonPasses = independentIn(lesson1).map(state => event(state.id))
const passes = independentIn(fixture).map(state => event(state.id))
const delayed = fixture.retrieval.map(state => event(state.id, { id: `delayed-${state.id}`,
  sessionId: 'session-2', recordedAt: '2026-09-14T10:01:00.000Z' }))

check('unique stable IDs and resolvable references', () => {
  assert.equal(new Set(lessonAll.map(s => s.id)).size, lessonAll.length)
  const sources = new Set(lesson1.sources.map(s => s.id))
  const misconceptions = new Set(lesson1.misconceptions.map(m => m.id))
  lessonAll.forEach(state => {
    assert.ok(state.specRefs.length)
    state.sourceIds.forEach(id => assert.ok(sources.has(id)))
    if (state.kind === 'choice') state.options.forEach(o => {
      if (o.misconceptionSignal) assert.ok(misconceptions.has(o.misconceptionSignal))
    })
  })
  for (const lesson of [lesson1, fixture]) Object.entries(lesson.requirements).forEach(([dimension, rule]) => {
    for (const [role, ids] of [['independent', rule.inSession], ['delayed', rule.delayed]] as const) {
      ids.forEach(id => {
        const state = [...lesson.states, ...lesson.retrieval].find(s => s.id === id)
        assert.ok(state && state.kind !== 'teaching')
        assert.equal(state.evidenceRole, role)
        assert.ok(state.dimensions.includes(dimension as typeof state.dimensions[number]))
      })
    }
  })
})
check('every choice answer path grades and explains', () => {
  lessonAll.forEach(state => {
    if (state.kind !== 'choice') return
    assert.equal(state.options.filter(o => o.id === state.answerId).length, 1)
    assert.equal(new Set(state.options.map(o => o.id)).size, state.options.length)
    assert.ok(state.hint && state.explanation.answer && state.explanation.steps.length)
    state.options.forEach(o => assert.equal(gradeResponse(state, o.id).result,
      o.id === state.answerId ? 'correct' : 'incorrect'))
  })
  assert.throws(() => gradeResponse(find('B1-03'), 'unknown'))
  assert.throws(() => gradeResponse(find('B1-02'), 'continue'))
})
check('fixed flow has a terminal state, progress ignores duplicates/unknown IDs', () => {
  let id: string | null = lesson1.states[0].id
  const visited: string[] = []
  while (id) { visited.push(id); id = nextStateId(lesson1, id) }
  assert.equal(visited.length, lesson1.states.length)
  assert.equal(progress(lesson1, [...visited, ...visited, 'unknown']).fraction, 1)
  assert.throws(() => nextStateId(lesson1, 'unknown'))
})
check('teaching and baseline do not certify mastery', () => {
  const empty = evidenceProfile(lesson1, [])
  assert.ok(Object.values(empty.dimensions).every(value => value === 'notAssessed'))
  assert.equal(evidenceProfile(lesson1, [event('B1-01')]).dimensions.recall, 'developing')
})
check('practice-only success is developing, not secure', () => {
  const practice = lesson1.states.filter(s => s.kind !== 'teaching' && s.evidenceRole === 'practice')
  const profile = evidenceProfile(lesson1, practice.map(s => event(s.id)))
  assert.equal(profile.dimensions.understanding, 'developing')
  assert.equal(profile.dimensions.recall, 'developing')
  assert.equal(profile.dimensions.application, 'notAssessed')
  assert.equal(profile.dimensions.calculation, 'notAssessed')
})
check('every "On your own" question is required; the written task stays pending', () => {
  assert.deepEqual(Object.keys(lesson1.requirements).sort(), ['application', 'explanation'])
  const profile = evidenceProfile(lesson1, lessonPasses)
  assert.equal(profile.dimensions.application, 'secureInSession')
  assert.equal(profile.dimensions.explanation, 'developing')
  assert.deepEqual(profile.pendingReview, ['B1-46'])
  for (const id of ['B1-20', 'B1-19', 'B1-45'])
    assert.equal(evidenceProfile(lesson1, lessonPasses.filter(e => e.stateId !== id)).dimensions.application, 'developing')
})
check('animal-then-plant route, with bacteria and area maths moved to their own lessons', () => {
  assert.deepEqual(lesson1.states.map(s => s.id), ['B1-01', 'B1-02', 'B1-03', 'B1-04', 'B1-12', 'B1-05', 'B1-06', 'B1-08',
    'B1-42', 'B1-25', 'B1-32', 'B1-26', 'B1-41', 'B1-43', 'B1-44', 'B1-20', 'B1-19', 'B1-45', 'B1-46'])
  assert.ok(['B1-02', 'B1-05', 'B1-42', 'B1-41'].every(id => lesson1.states.some(s => s.id === id && s.kind === 'teaching')))
  assert.ok(lesson1b.states.some(s => s.id === 'B1-27' && s.kind === 'teaching'))
  assert.equal((lesson2b.states.find(s => s.id === 'B1-35') as ChoiceState).explanation.answer, '12 µm²')
  assert.ok(find('B1-46').title.includes('two differences'))
  assert.ok(lesson1b.states.find(s => s.id === 'B1-21')!.title.includes('two differences'))
})
check('whole cells are taught separately before comparison and classification', () => {
  const order = (id: string) => lesson1.states.findIndex(state => state.id === id)
  assert.ok(order('B1-02') < order('B1-05'))
  assert.ok(order('B1-05') < order('B1-42'))
  assert.ok(order('B1-42') < order('B1-41'))
  assert.ok(order('B1-41') < order('B1-20'))
  assert.ok(teachingFrames['B1-42'].every(frame => frame.diagram === 'plant'))
  assert.deepEqual(teachingFrames['B1-42'].flatMap(frame => frame.focus ? [frame.focus] : []), plantPartIds.slice(5))
  assert.deepEqual([...teachingFrames['B1-02'], ...teachingFrames['B1-05']].flatMap(frame => frame.part ? [frame.part] : []), plantPartIds.slice(0, 5))
  assert.ok(teachingFrames['B1-02'][0].label.includes('animal cell'))
  assert.ok(teachingFrames['B1-41'].every(frame => frame.diagram === 'comparison'))
  for (const state of lesson1.states) if (state.kind === 'teaching' && state.media) {
    assert.ok(teachingFrames[state.id]?.length)
    for (const frame of teachingFrames[state.id]) assert.ok(state.media.script.includes(frame.summary))
  }
})
check('curriculum catalogue contains all 24 topics in the six paper groups', () => {
  const topics: Array<readonly [string, string, string]> = []
  for (const strand of scienceCurriculum) for (const paper of strand.papers) topics.push(...paper.topics)
  assert.equal(topics.length, 24)
  assert.equal(new Set(topics.map(([id]) => id)).size, 24)
  assert.deepEqual(scienceCurriculum.map(strand => strand.papers.map(paper => paper.topics.length)), [[4, 3], [5, 5], [4, 3]])
})
check('hint, retry and exposed answers cannot earn clean evidence', () => {
  for (const support of [{ usedHint: true }, { attempt: 2 }, { answerPreviouslySeen: true }]) {
    const supported = passes.map(e => e.stateId === 'B1-12' ? { ...e, ...support } : e)
    assert.equal(evidenceProfile(fixture, supported).dimensions.recall, 'developing')
  }
})
check('independent coverage is not stitched across sessions', () => {
  const split = passes.map(e => e.stateId === 'B1-20' ? { ...e, sessionId: 'other-session' } : e)
  assert.equal(evidenceProfile(fixture, split).dimensions.application, 'developing')
})
check('only direct false-claim selections signal a misconception', () => {
  assert.equal(misconceptionSignal(find('B1-06') as ChoiceState, 'create'), 'MC-ENERGY-CREATED')
  assert.equal(misconceptionSignal(find('B1-06') as ChoiceState, 'release'), undefined)
  assert.equal(misconceptionSignal(find('B1-03') as ChoiceState, 'nucleus'), undefined)
})
check('written text is saved pending; never keyword auto-marked', () => {
  assert.equal(gradeResponse(find('B1-46'), 'cell wall chloroplasts').result, 'pendingTeacherReview')
  assert.throws(() => gradeResponse(find('B1-46'), '   '))
  const marked = event('B1-46', { id: 'teacher-B1-46', recordedAt: '2026-09-13T10:01:00.000Z', result: 'correct', grading: 'teacher' })
  const profile = evidenceProfile(fixture, [...passes, marked])
  assert.equal(profile.dimensions.explanation, 'secureInSession')
  assert.deepEqual(profile.pendingReview, [])
})
check('duplicates, other versions and unknown events do not add evidence', () => {
  assert.deepEqual(evidenceProfile(fixture, [...passes, ...passes]), evidenceProfile(fixture, passes))
  assert.equal(evidenceProfile(fixture, passes.map(e => ({ ...e, contentVersion: 'old' }))).dimensions.recall, 'notAssessed')
  assert.equal(evidenceProfile(fixture, [event('B1-12', { stateId: 'unknown' })]).dimensions.recall, 'notAssessed')
})
check('next-day clean retrieval is sampled retention; immediate/same-session replay is not', () => {
  assert.equal(evidenceProfile(fixture, [...passes, ...delayed]).dimensions.recall, 'retained')
  const immediate = delayed.map(e => ({ ...e, recordedAt: '2026-09-13T11:00:00.000Z' }))
  assert.equal(evidenceProfile(fixture, [...passes, ...immediate]).dimensions.recall, 'secureInSession')
  const sameSession = delayed.map(e => ({ ...e, sessionId: 'session-1' }))
  assert.equal(evidenceProfile(fixture, [...passes, ...sameSession]).dimensions.recall, 'secureInSession')
})
check('later incorrect evidence demotes the affected dimension', () => {
  const failure = event('B1-R01', { id: 'failed-retrieval', sessionId: 'session-2',
    recordedAt: '2026-09-14T10:01:00.000Z', response: 'membrane', result: 'incorrect' })
  const profile = evidenceProfile(fixture, [...passes, failure])
  assert.equal(profile.dimensions.recall, 'developing')
  assert.equal(profile.dimensions.application, 'secureInSession')
})
check('hint-assisted delayed checks remain practice evidence', () => {
  const supported = delayed.map(e => ({ ...e, usedHint: true }))
  assert.equal(evidenceProfile(fixture, [...passes, ...supported]).dimensions.recall, 'secureInSession')
})
check('later practice exposure postpones eligible retrieval', () => {
  const repair = event('B1-03', { id: 'later-practice', recordedAt: '2026-09-13T12:00:00.000Z' })
  assert.equal(evidenceProfile(fixture, [...passes, repair, ...delayed]).dimensions.recall, 'secureInSession')
})
check('untrusted choice result and invalid timestamps do not earn evidence', () => {
  const forged = passes.map(e => e.stateId === 'B1-12' ? { ...e, response: 'membrane' } : e)
  assert.equal(evidenceProfile(fixture, forged).dimensions.recall, 'developing')
  assert.equal(evidenceProfile(fixture, [event('B1-12', { recordedAt: 'invalid' })]).dimensions.recall, 'notAssessed')
})
check('retrieval dates and deterministic recommendations', () => {
  assert.equal(retrievalDueAt('2026-09-13T10:00:00.000Z'), '2026-09-14T10:00:00.000Z')
  assert.throws(() => retrievalDueAt('invalid'))
  assert.equal(recommendedNext(evidenceProfile(fixture, []), false, fixture).kind, 'repair')
  assert.equal(recommendedNext(evidenceProfile(fixture, passes), false, fixture).lessonId, 'B-CELL-001B-B')
  assert.deepEqual(recommendedNext(evidenceProfile(fixture, passes), true, fixture), { kind: 'retrieval', lessonId: lesson1.id })
  assert.equal(recommendedNext(evidenceProfile(fixture, passes.filter(e => e.stateId !== 'B1-12')), false, fixture).kind, 'repair')
  assert.deepEqual(recommendedNext(evidenceProfile(lesson1, lessonPasses), false, lesson1), { kind: 'lesson', lessonId: 'B-CELL-001B-B' })
  assert.equal(recommendedNext(evidenceProfile(lesson1, lessonPasses.filter(e => e.stateId !== 'B1-45')), false, lesson1).kind, 'repair')
})

console.log(`${assertions} scaffold checks passed.`)

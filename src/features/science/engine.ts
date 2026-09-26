import type { AttemptEvent, ChoiceState, EvidenceDimension, Profile, ScienceLesson, ScienceState } from './types'

export const evidenceDimensions: EvidenceDimension[] = [
  'recall', 'understanding', 'explanation', 'application',
  'calculation', 'practicalReasoning', 'dataInterpretation',
]
export const minimumRetrievalDelayMs = 24 * 60 * 60 * 1000

export function gradeResponse(state: ScienceState, response: string) {
  if (state.kind === 'teaching') throw new Error('Teaching is not an assessment.')
  if (state.kind === 'written') {
    if (!response.trim()) throw new Error('A written response is required.')
    return { result: 'pendingTeacherReview' as const, grading: 'pending' as const }
  }
  if (!state.options.some(option => option.id === response)) throw new Error('Unknown option.')
  return { result: response === state.answerId ? 'correct' as const : 'incorrect' as const,
    grading: 'canonicalChoice' as const }
}

export function misconceptionSignal(state: ChoiceState, response: string): string | undefined {
  if (response === state.answerId) return undefined
  return state.options.find(option => option.id === response)?.misconceptionSignal
}

// Fixed lesson flow: reveal feedback, then Continue on either outcome. Inline repair is optional.
export function nextStateId(lesson: ScienceLesson, currentId: string): string | null {
  const index = lesson.states.findIndex(state => state.id === currentId)
  if (index < 0) throw new Error(`Unknown state: ${currentId}`)
  return lesson.states[index + 1]?.id ?? null
}

export function progress(lesson: ScienceLesson, completedIds: string[]) {
  const validIds = new Set(lesson.states.map(state => state.id))
  const completed = new Set(completedIds.filter(id => validIds.has(id))).size
  return { completed, total: lesson.states.length, fraction: completed / lesson.states.length }
}

// Production must supply a trusted, server-validated ledger, not client-asserted marks or timestamps.
// Teacher adjudication appends an event with a new ID for the same attempt identity.
function latestAttempts(lesson: ScienceLesson, events: AttemptEvent[]): AttemptEvent[] {
  const known = new Set([...lesson.states, ...lesson.retrieval].map(state => state.id))
  const seen = new Set<string>()
  const latest = new Map<string, AttemptEvent>()
  for (const event of events) {
    if (seen.has(event.id)) continue
    seen.add(event.id)
    if (event.lessonId !== lesson.id || event.contentVersion !== lesson.contentVersion
      || !known.has(event.stateId) || !Number.isFinite(Date.parse(event.recordedAt))
      || !Number.isInteger(event.attempt) || event.attempt < 1) continue
    const key = JSON.stringify([event.sessionId, event.stateId, event.attempt])
    const previous = latest.get(key)
    if (!previous || Date.parse(previous.recordedAt) < Date.parse(event.recordedAt)) latest.set(key, event)
  }
  return [...latest.values()]
}

function cleanPass(state: ScienceState, event: AttemptEvent): boolean {
  if (state.kind === 'teaching' || event.result !== 'correct' || event.attempt !== 1
    || event.usedHint || event.answerPreviouslySeen) return false
  if (state.kind === 'choice') return event.grading === 'canonicalChoice' && event.response === state.answerId
  return event.grading === 'teacher'
}

export function evidenceProfile(lesson: ScienceLesson, events: AttemptEvent[]): Profile {
  const ledger = latestAttempts(lesson, events)
  const byId = new Map([...lesson.states, ...lesson.retrieval].map(state => [state.id, state]))
  const profile: Profile = {
    dimensions: Object.fromEntries(evidenceDimensions.map(d => [d, 'notAssessed'])) as Profile['dimensions'],
    pendingReview: [...new Set(ledger.filter(e => e.result === 'pendingTeacherReview').map(e => e.stateId))],
  }
  for (const dimension of evidenceDimensions) {
    const rule = lesson.requirements[dimension]
    const relevant = ledger.filter(event => {
      const state = byId.get(event.stateId)!
      return state.kind !== 'teaching' && state.dimensions.includes(dimension)
    })
    // Practice establishes exposure/developing evidence only; never independent mastery.
    if (!relevant.length) continue
    profile.dimensions[dimension] = 'developing'
    if (!rule?.inSession.length) continue
    const sessions = [...new Set(relevant.map(event => event.sessionId))]
    let secureAt = -Infinity
    let secureSession = ''
    for (const session of sessions) {
      const requiredEvents = rule.inSession.map(id => relevant
        .filter(event => event.sessionId === session && event.stateId === id)
        .sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt))[0])
      if (requiredEvents.every((event, i) => event
        && byId.get(rule.inSession[i])!.kind !== 'teaching'
        && (byId.get(rule.inSession[i]) as ChoiceState).evidenceRole === 'independent'
        && cleanPass(byId.get(event.stateId)!, event))) {
        const time = Math.max(...requiredEvents.map(event => Date.parse(event!.recordedAt)))
        if (time > secureAt) { secureAt = time; secureSession = session }
      }
    }
    if (!Number.isFinite(secureAt)) continue
    // A later incorrect assessment contradicts the earlier evidence, including failed retrieval.
    if (relevant.some(event => event.result === 'incorrect' && Date.parse(event.recordedAt) > secureAt)) continue
    profile.dimensions[dimension] = 'secureInSession'
    const lastExposure = Math.max(secureAt, ...relevant
      .filter(event => (byId.get(event.stateId) as ChoiceState).evidenceRole !== 'delayed')
      .map(event => Date.parse(event.recordedAt)))
    const delayed = rule.delayed.map(id => relevant.filter(event => event.stateId === id)
      .sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt))[0])
    if (rule.delayed.length && delayed.every(event => event
      && event.sessionId !== secureSession
      && (byId.get(event.stateId) as ChoiceState).evidenceRole === 'delayed'
      && cleanPass(byId.get(event.stateId)!, event)
      && Date.parse(event.recordedAt) >= lastExposure + minimumRetrievalDelayMs)) {
      profile.dimensions[dimension] = 'retained'
    }
  }
  return profile
}

export function retrievalDueAt(lastLessonExposureAt: string): string {
  const timestamp = Date.parse(lastLessonExposureAt)
  if (!Number.isFinite(timestamp)) throw new Error('Invalid exposure timestamp.')
  return new Date(timestamp + minimumRetrievalDelayMs).toISOString()
}

// Recommendation contract, not a live platform router; host must resolve these registered actions.
export function recommendedNext(profile: Profile, retrievalDue: boolean, lesson?: ScienceLesson) {
  const currentLessonId = lesson?.id || 'B-CELL-001'
  if (retrievalDue) return { kind: 'retrieval' as const, lessonId: currentLessonId }
  const required = lesson ? Object.keys(lesson.requirements).filter(d => d !== 'explanation') as EvidenceDimension[] : ['recall', 'understanding'] as EvidenceDimension[]
  if (required.some(d => profile.dimensions[d] === 'notAssessed' || profile.dimensions[d] === 'developing')
    || profile.dimensions.calculation === 'developing') {
    return { kind: 'repair' as const, skillId: lesson?.states[0].skillId || 'B-CELL-PARTS-FUNCTIONS' }
  }
  // Pending written marking does not block safe forward learning or falsely award explanation skill.
  const nextLessonIds: Record<string, string> = { 'B-CELL-001': 'B-CELL-002', 'B-CELL-002': 'B-CELL-003', 'B-CELL-003': 'B-CELL-004', 'B-CELL-004': 'B-CELL-005', 'B-CELL-005': 'B-CELL-006' }
  const easierOnlyNextIds: Record<string, string> = { ...nextLessonIds,
    'B-CELL-006': 'B-ORG-007', 'B-ORG-007': 'B-ORG-008', 'B-ORG-008': 'B-ORG-009',
    'B-ORG-009': 'B-ORG-010', 'B-ORG-010': 'B-ORG-011', 'B-ORG-011': 'B-ORG-012',
    'B-ORG-012': 'B-ORG-013', 'B-ORG-013': 'B-ORG-014', 'B-ORG-014': 'B-ORG-015', 'B-ORG-015': 'B-ORG-016',
    'B-ORG-016': 'B-ORG-017', 'B-ORG-017': 'B-ORG-018',
    'B-ORG-018': 'B-INF-019', 'B-INF-019': 'B-INF-020', 'B-INF-020': 'B-INF-021', 'B-INF-021': 'B-INF-022', 'B-INF-022': 'B-INF-023', 'B-INF-023': 'B-INF-024', 'B-INF-024': 'B-INF-025' }
  const isVariantB = currentLessonId.endsWith('-B')
  const baseLessonId = isVariantB ? currentLessonId.slice(0, -2) : currentLessonId
  const baseNextLessonId = (isVariantB ? easierOnlyNextIds : nextLessonIds)[baseLessonId]
  const nextLessonId = baseNextLessonId && (isVariantB ? `${baseNextLessonId}-B` : baseNextLessonId)
  return nextLessonId ? { kind: 'lesson' as const, lessonId: nextLessonId } : { kind: 'practical' as const, lessonId: currentLessonId }
}

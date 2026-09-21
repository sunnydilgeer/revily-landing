import { gradeResponse, nextStateId } from './engine'
import { lesson1 } from './lesson-1/lesson'
import type { AttemptEvent, ScienceLesson } from './types'

export interface PreviewSession {
  lessonId?: string // Legacy Lesson 1 snapshots predate this field.
  version: string
  sessionId: string
  currentId: string | null
  completedIds: string[]
  answers: Record<string, AttemptEvent>
  drafts: Record<string, string>
  hintsUsed: string[]
  hintsOpen: string[]
  seenAnswers: string[]
  lastExposureAt: string | null
}

export type SessionAction =
  | { type: 'answer'; response: string; at: string }
  | { type: 'draft'; response: string }
  | { type: 'hint' }
  | { type: 'continue'; at: string }
  | { type: 'jump'; id: string }
  | { type: 'exposure'; at: string }
  | { type: 'restart'; sessionId: string; clearPracticeHistory?: boolean }

const unique = (values: string[]) => [...new Set(values)]

// Each lesson owns its IDs, grading context and storage key. Existing Lesson 1 exports remain compatible.
export function createPreviewSessionEngine(lesson: ScienceLesson) { return createNamespacedSessionEngine(lesson, 'science') }
export function createCoachPreviewSessionEngine(lesson: ScienceLesson) { return createNamespacedSessionEngine(lesson, 'science-coach') }
function createNamespacedSessionEngine(lesson: ScienceLesson, namespace: 'science' | 'science-coach') {
  const storageKey = `revily:${namespace}:${lesson.id}:${lesson.contentVersion}:preview`
  const ids = new Set(lesson.states.map(s => s.id))

  function createPreviewSession(sessionId: string, seenAnswers: string[] = []): PreviewSession {
    return { lessonId: lesson.id, version: lesson.contentVersion, sessionId, currentId: lesson.states[0].id,
      completedIds: [], answers: {}, drafts: {}, hintsUsed: [], hintsOpen: [],
      seenAnswers: unique(seenAnswers.filter(id => ids.has(id))), lastExposureAt: null }
  }

  function previewReducer(session: PreviewSession, action: SessionAction): PreviewSession {
    if (action.type === 'restart') return createPreviewSession(action.sessionId, action.clearPracticeHistory ? [] : session.seenAnswers)
    if (action.type === 'jump') return ids.has(action.id) ? { ...session, currentId: action.id } : session
    if (action.type === 'exposure') return { ...session, lastExposureAt: action.at }
    const state = lesson.states.find(s => s.id === session.currentId)
    if (!state) return session
    const submitted = session.answers[state.id]
    if (action.type === 'draft') {
      if (state.kind !== 'written' || submitted) return session
      return { ...session, drafts: { ...session.drafts, [state.id]: action.response.slice(0, 2000) } }
    }
    if (action.type === 'hint') {
      if (state.kind === 'teaching') return session
      const open = session.hintsOpen.includes(state.id)
      return { ...session,
        hintsOpen: open ? session.hintsOpen.filter(id => id !== state.id) : [...session.hintsOpen, state.id],
        // Consulting a hint after grading does not retroactively alter submitted evidence.
        hintsUsed: submitted || open ? session.hintsUsed : unique([...session.hintsUsed, state.id]),
      }
    }
    if (action.type === 'answer') {
      if (state.kind === 'teaching' || submitted) return session
      const response = state.kind === 'written' ? action.response.trim().slice(0, 2000) : action.response
      const grading = gradeResponse(state, response)
      const event: AttemptEvent = {
        id: `${session.sessionId}:${state.id}:1`, lessonId: lesson.id, contentVersion: lesson.contentVersion,
        sessionId: session.sessionId, stateId: state.id, recordedAt: action.at, attempt: 1,
        usedHint: session.hintsUsed.includes(state.id), answerPreviouslySeen: session.seenAnswers.includes(state.id),
        response, ...grading,
      }
      return { ...session, answers: { ...session.answers, [state.id]: event },
        seenAnswers: unique([...session.seenAnswers, state.id]), lastExposureAt: action.at }
    }
    if (action.type === 'continue') {
      if (state.kind !== 'teaching' && !submitted) return session
      return { ...session, currentId: nextStateId(lesson, state.id),
        completedIds: unique([...session.completedIds, state.id]), lastExposureAt: action.at }
    }
    return session
  }

  // Local preview persistence only: reject incompatible/corrupt snapshots, never trust them for marks.
  function restorePreviewSession(value: unknown): PreviewSession | null {
    if (!value || typeof value !== 'object') return null
    const saved = value as PreviewSession
    if (saved.lessonId !== lesson.id && !(lesson.id === 'B-CELL-001' && saved.lessonId === undefined)) return null
    if (saved.version !== lesson.contentVersion || typeof saved.sessionId !== 'string'
      || !(saved.currentId === null || ids.has(saved.currentId))) return null
    const arrays = [saved.completedIds, saved.hintsUsed, saved.hintsOpen, saved.seenAnswers]
    if (arrays.some(values => !Array.isArray(values) || values.some(id => !ids.has(id)))) return null
    if (!saved.answers || typeof saved.answers !== 'object' || Array.isArray(saved.answers)
      || !saved.drafts || typeof saved.drafts !== 'object' || Array.isArray(saved.drafts)) return null
    if (!(saved.lastExposureAt === null || (typeof saved.lastExposureAt === 'string'
      && Number.isFinite(Date.parse(saved.lastExposureAt))))) return null
    for (const [id, event] of Object.entries(saved.answers)) {
      const state = lesson.states.find(s => s.id === id)
      if (!event || !state || state.kind === 'teaching' || typeof event.id !== 'string'
        || typeof event.response !== 'string' || event.response.length > 2000
        || event.sessionId !== saved.sessionId || event.stateId !== id || event.lessonId !== lesson.id
        || event.contentVersion !== lesson.contentVersion || event.attempt !== 1
        || typeof event.usedHint !== 'boolean' || typeof event.answerPreviouslySeen !== 'boolean'
        || !Number.isFinite(Date.parse(event.recordedAt))) return null
      try {
        const grading = gradeResponse(state, event.response)
        if (event.result !== grading.result || event.grading !== grading.grading) return null
      } catch { return null }
    }
    if (saved.completedIds.some(id => lesson.states.find(state => state.id === id)?.kind !== 'teaching' && !saved.answers[id])) return null
    if (Object.keys(saved.answers).some(id => !saved.seenAnswers.includes(id))) return null
    if (Object.entries(saved.drafts).some(([id, text]) => !ids.has(id) || typeof text !== 'string' || text.length > 2000)) return null
    return { ...saved, lessonId: lesson.id, completedIds: unique(saved.completedIds), hintsUsed: unique(saved.hintsUsed),
      hintsOpen: unique(saved.hintsOpen), seenAnswers: unique(saved.seenAnswers) }
  }
  return { storageKey, createPreviewSession, previewReducer, restorePreviewSession }
}

export const { storageKey, createPreviewSession, previewReducer, restorePreviewSession } = createPreviewSessionEngine(lesson1)

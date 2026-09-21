import { getScienceLessons, type LessonNumber } from '../lessonNavigation'
import { createCoachPreviewSessionEngine, type PreviewSession } from '../previewSession'
import { coachTopics, type CoachTopic } from './content'

export const COACH_STORAGE_KEY = 'revily:science-coach:review:v1'
export const DAY = 24 * 60 * 60 * 1000
// The existing Coach pilot remains deliberately bounded to its original six Cell Biology lessons.
export const coachLessons = getScienceLessons('b').slice(0, 6)
export const coachLessonEngines = coachLessons.map(item => createCoachPreviewSessionEngine(item.lesson))
export type CoachSessions = Partial<Record<LessonNumber, PreviewSession>>
export type ReviewMode = 'review' | 'repair'
export interface ReviewEntry { topicId: string; itemId: string; mode: ReviewMode }
export interface CoachAttempt extends ReviewEntry {
  runId: string; choice: number; at: string; correct: boolean; assisted: boolean; previouslySeen: boolean
  baselineAt: string; laterCheck: boolean
}
export interface CoachRun { id: string; entries: ReviewEntry[]; index: number; hints: string[] }
export interface CoachStore { version: 1; attempts: CoachAttempt[]; exposures: Record<string, string>; run: CoachRun | null }
export const emptyCoachStore = (): CoachStore => ({ version: 1, attempts: [], exposures: {}, run: null })
export const coachLessonHref = (number: LessonNumber, activity?: string) => `/preview/scienceB?lesson=${number}${activity ? '&activity=' + encodeURIComponent(activity) : ''}`
export function nextCoachLesson(sessions: CoachSessions) {
  const unfinished = coachLessons.filter(item => sessions[item.number]?.completedIds.length !== item.lesson.states.length)
  const recent = unfinished.filter(item => sessions[item.number]?.lastExposureAt)
    .sort((a, b) => Date.parse(sessions[b.number]!.lastExposureAt!) - Date.parse(sessions[a.number]!.lastExposureAt!))
  return recent[0] || unfinished[0] || null
}
const validDate = (value: unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value))
function questionFor(entry: ReviewEntry) { return coachTopics.find(t => t.id === entry.topicId)?.questions.find(q => q.id === entry.itemId) }
function validEntry(entry: ReviewEntry) { return Boolean(entry && questionFor(entry) && ['review', 'repair'].includes(entry.mode)) }

// These records are local practice, never authoritative marks or whole-topic mastery.
export function restoreCoachStore(value: unknown): CoachStore | null {
  if (!value || typeof value !== 'object') return null
  const saved = value as CoachStore
  if (saved.version !== 1 || !Array.isArray(saved.attempts) || saved.attempts.length > 5000
    || !saved.exposures || typeof saved.exposures !== 'object' || Array.isArray(saved.exposures)
    || Object.entries(saved.exposures).some(([id, at]) => !coachTopics.some(t => t.id === id) || !validDate(at))) return null
  const seen = new Set<string>(), submitted = new Set<string>()
  for (const attempt of saved.attempts) {
    if (!validEntry(attempt) || typeof attempt.runId !== 'string' || !attempt.runId || !validDate(attempt.at) || !validDate(attempt.baselineAt)
      || Date.parse(attempt.baselineAt) > Date.parse(attempt.at) || !Number.isInteger(attempt.choice)
      || attempt.choice < 0 || attempt.choice >= questionFor(attempt)!.options.length
      || typeof attempt.assisted !== 'boolean' || typeof attempt.previouslySeen !== 'boolean'
      || attempt.correct !== (attempt.choice === questionFor(attempt)!.answer)
      || attempt.previouslySeen !== seen.has(attempt.itemId)
      || (attempt.mode === 'repair' && !attempt.assisted)
      || attempt.laterCheck !== (attempt.correct && !attempt.assisted && !attempt.previouslySeen && attempt.mode === 'review'
        && Date.parse(attempt.at) - Date.parse(attempt.baselineAt) >= DAY)
      || submitted.has(`${attempt.runId}:${attempt.itemId}`)) return null
    seen.add(attempt.itemId); submitted.add(`${attempt.runId}:${attempt.itemId}`)
  }
  if (saved.run !== null) {
    const run = saved.run
    if (!run || typeof run.id !== 'string' || !run.id || !Array.isArray(run.entries) || !run.entries.length || run.entries.length > 5
      || run.entries.some(entry => !validEntry(entry)) || new Set(run.entries.map(entry => entry.topicId)).size !== run.entries.length
      || !Number.isInteger(run.index) || run.index < 0 || run.index > run.entries.length || !Array.isArray(run.hints)
      || run.hints.some(id => !run.entries.some(entry => entry.itemId === id))) return null
    if (run.entries.slice(0, run.index).some(entry => !saved.attempts.some(a => a.runId === run.id && a.itemId === entry.itemId))) return null
  }
  return saved
}

export function topicSummary(topic: CoachTopic, sessions: CoachSessions, store: CoachStore, now: number) {
  const session = sessions[topic.lesson]
  const learned = Boolean(session && topic.teachingIds.every(id => session.completedIds.includes(id)))
  const lessonAttempts = Object.values(session?.answers || {}).filter(a => topic.assessmentIds.includes(a.stateId) && a.result !== 'pendingTeacherReview')
  const reviews = store.attempts.filter(a => a.topicId === topic.id)
  const results = [...lessonAttempts.map(a => ({ at: a.recordedAt, correct: a.result === 'correct', laterCheck: false })), ...reviews]
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
  const latest = results[results.length - 1]
  const exposure = [session?.lastExposureAt, store.exposures[topic.id], ...reviews.map(a => a.at)].filter(validDate).sort((a, b) => Date.parse(a) - Date.parse(b))
  const baselineAt = exposure[exposure.length - 1] || new Date(now).toISOString()
  const dueAt = Date.parse(baselineAt) + DAY
  const needsRepair = learned && Boolean(latest && !latest.correct)
  const label = !learned ? 'Not yet learned' : needsRepair ? 'Practise again' : latest?.laterCheck ? 'Correct on a later check' : latest?.correct ? 'Correct in practice' : 'Ready to practise'
  return { learned, needsRepair, label, baselineAt, dueAt, due: learned && now >= dueAt }
}

export function makeReviewEntries(sessions: CoachSessions, store: CoachStore, now: number, mode: ReviewMode, dueOnly: boolean): ReviewEntry[] {
  return coachTopics.map(topic => ({ topic, summary: topicSummary(topic, sessions, store, now) }))
    .filter(({ summary }) => summary.learned && (mode === 'repair' ? summary.needsRepair : !dueOnly || summary.due))
    .sort((a, b) => Number(b.summary.needsRepair) - Number(a.summary.needsRepair) || a.summary.dueAt - b.summary.dueAt)
    .slice(0, 5).map(({ topic }) => {
      const candidates = mode === 'repair' ? [topic.questions[1]] : [topic.questions[0], topic.questions[2]]
      const unseen = candidates.find(q => !store.attempts.some(a => a.itemId === q.id))
      const oldest = [...candidates].sort((a, b) => {
        const last = (id: string) => Date.parse(store.attempts.filter(event => event.itemId === id).slice(-1)[0]?.at || '1970-01-01')
        return last(a.id) - last(b.id)
      })[0]
      return { topicId: topic.id, itemId: (unseen || oldest).id, mode }
    })
}

export function startCoachRun(store: CoachStore, entries: ReviewEntry[], id: string): CoachStore {
  if (!id || !entries.length || entries.length > 5 || entries.some(entry => !validEntry(entry))
    || new Set(entries.map(entry => entry.topicId)).size !== entries.length) return store
  return { ...store, run: { id, entries, index: 0, hints: [] } }
}
export function revealCoachHint(store: CoachStore): CoachStore {
  const run = store.run, entry = run?.entries[run.index]
  if (!run || !entry || run.hints.includes(entry.itemId)) return store
  return { ...store, run: { ...run, hints: [...run.hints, entry.itemId] } }
}
export function recordCoachExposure(store: CoachStore, topicId: string, at: string): CoachStore {
  if (!coachTopics.some(t => t.id === topicId) || !validDate(at)
    || Date.parse(store.exposures[topicId] || '1970-01-01') >= Date.parse(at)) return store
  return { ...store, exposures: { ...store.exposures, [topicId]: at } }
}
export function answerCoachQuestion(store: CoachStore, sessions: CoachSessions, choice: number, at: string): CoachStore {
  const run = store.run, entry = run?.entries[run.index]
  if (!run || !entry || store.attempts.some(a => a.runId === run.id && a.itemId === entry.itemId) || !validDate(at)) return store
  const question = questionFor(entry)!
  if (!Number.isInteger(choice) || choice < 0 || choice >= question.options.length) return store
  const topic = coachTopics.find(t => t.id === entry.topicId)!
  const summary = topicSummary(topic, sessions, store, Date.parse(at))
  if (!summary.learned || Date.parse(summary.baselineAt) > Date.parse(at)) return store
  const correct = choice === question.answer, assisted = entry.mode === 'repair' || run.hints.includes(entry.itemId)
  const previouslySeen = store.attempts.some(a => a.itemId === entry.itemId)
  const attempt: CoachAttempt = { ...entry, runId: run.id, choice, at, correct, assisted, previouslySeen,
    baselineAt: summary.baselineAt, laterCheck: correct && !assisted && !previouslySeen && entry.mode === 'review' && summary.due }
  return { ...store, attempts: [...store.attempts, attempt] }
}
export function advanceCoachRun(store: CoachStore): CoachStore {
  const run = store.run, entry = run?.entries[run.index]
  if (!run || !entry || !store.attempts.some(a => a.runId === run.id && a.itemId === entry.itemId)) return store
  return { ...store, run: { ...run, index: run.index + 1 } }
}

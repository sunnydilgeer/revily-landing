import { practiceTasks, revisionCards, type PracticeTask } from './content'

export const REVISION_STORAGE_KEY = 'revily:science:exam-revision:lesson1:v1'
export type SelfCheck = 'again' | 'remembered'
export interface CardRecord { revealedAt: string; selfCheck?: SelfCheck }
export interface PracticeRecord { response: string; result: 'correct' | 'incorrect' | 'pendingReview'; submittedAt: string; supported: boolean }
export interface RevisionSession {
  version: 1; cardId: string; taskId: string; cards: Record<string, CardRecord>; drafts: Record<string, string>
  answers: Record<string, PracticeRecord>; models: string[]; supportUsed: string[]; reviewIds: string[]
}
export function newRevisionSession(): RevisionSession {
  return { version: 1, cardId: revisionCards[0].id, taskId: practiceTasks[0].id, cards: {}, drafts: {}, answers: {}, models: [], supportUsed: [], reviewIds: [] }
}
export function gradePractice(task: PracticeTask, response: string): PracticeRecord['result'] {
  if (task.kind === 'written') return 'pendingReview'
  if (!validResponse(task, response)) return 'incorrect'
  if (task.kind === 'choice') return Number(response) === task.answer ? 'correct' : 'incorrect'
  // Only a supplied-unit numeric answer is auto-checked; never infer written reasoning from keywords.
  return Number(response) === task.answer ? 'correct' : 'incorrect'
}
const validDate = (value: unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value))
const objectRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value))
export function restoreRevisionSession(value: unknown): RevisionSession | null {
  if (!objectRecord(value)) return null
  const saved = value as unknown as RevisionSession
  if (saved.version !== 1 || !revisionCards.some(c => c.id === saved.cardId) || !practiceTasks.some(t => t.id === saved.taskId)
    || !objectRecord(saved.cards) || !objectRecord(saved.drafts) || !objectRecord(saved.answers)) return null
  if (!Array.isArray(saved.models) || saved.models.some(id => !practiceTasks.some(t => t.id === id))
    || !Array.isArray(saved.supportUsed) || saved.supportUsed.some(id => !practiceTasks.some(t => t.id === id))
    || !Array.isArray(saved.reviewIds) || saved.reviewIds.some(id => !revisionCards.some(c => c.id === id))) return null
  for (const [id, record] of Object.entries(saved.cards)) {
    if (!revisionCards.some(c => c.id === id) || !record || !validDate(record.revealedAt)
      || (record.selfCheck !== undefined && !['again', 'remembered'].includes(record.selfCheck))) return null
  }
  for (const [id, text] of Object.entries(saved.drafts)) {
    const task = practiceTasks.find(t => t.id === id)
    if (!task || task.kind === 'choice' || typeof text !== 'string' || text.length > 2000) return null
  }
  for (const [id, record] of Object.entries(saved.answers)) {
    const task = practiceTasks.find(t => t.id === id)
    if (!task || task.stage === 'worked' || !record || !validResponse(task, record.response) || !validDate(record.submittedAt)
      || typeof record.supported !== 'boolean' || record.result !== gradePractice(task, record.response)
      || (task.stage === 'supported' && !record.supported)) return null
  }
  if (saved.models.some(id => practiceTasks.find(t => t.id === id)!.stage !== 'worked' && !saved.answers[id])) return null
  return saved
}
function validResponse(task: PracticeTask, response: unknown): response is string {
  if (typeof response !== 'string' || !response.trim() || response.length > 2000) return false
  if (task.kind === 'choice') return /^[0-9]+$/.test(response) && Number(response) < task.options.length
  if (task.kind === 'number') return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(response.trim()) && Number.isFinite(Number(response))
  return true
}
export type RevisionAction =
  | { type: 'card'; id: string } | { type: 'revealCard'; at: string } | { type: 'selfCheck'; value: SelfCheck }
  | { type: 'task'; id: string } | { type: 'draft'; text: string } | { type: 'submit'; response?: string; at: string }
  | { type: 'model' } | { type: 'support' } | { type: 'reviewCards'; ids: string[] }
export function revisionReducer(session: RevisionSession, action: RevisionAction): RevisionSession {
  if (action.type === 'card') return revisionCards.some(c => c.id === action.id) ? { ...session, cardId: action.id } : session
  if (action.type === 'task') return practiceTasks.some(t => t.id === action.id) ? { ...session, taskId: action.id } : session
  if (action.type === 'revealCard') {
    if (!validDate(action.at)) return session
    const activeTask = practiceTasks.find(task => task.id === session.taskId)!
    const support = activeTask.stage === 'independent' && !session.answers[activeTask.id] && activeTask.cardIds.includes(session.cardId)
    return { ...session, cards: { ...session.cards, [session.cardId]: { ...session.cards[session.cardId], revealedAt: action.at } },
      supportUsed: support ? [...new Set([...session.supportUsed, activeTask.id])] : session.supportUsed }
  }
  if (action.type === 'selfCheck') {
    const record = session.cards[session.cardId]
    if (!record || !['again', 'remembered'].includes(action.value)) return session
    return { ...session, cards: { ...session.cards, [session.cardId]: { ...record, selfCheck: action.value } },
      reviewIds: action.value === 'again' ? [...new Set([...session.reviewIds, session.cardId])] : session.reviewIds.filter(id => id !== session.cardId) }
  }
  if (action.type === 'reviewCards') return { ...session, reviewIds: [...new Set([...session.reviewIds, ...action.ids.filter(id => revisionCards.some(c => c.id === id))])] }
  const task = practiceTasks.find(t => t.id === session.taskId)!
  if (action.type === 'draft') return task.kind !== 'choice' && task.stage !== 'worked' && !session.answers[task.id] ? { ...session, drafts: { ...session.drafts, [task.id]: action.text.slice(0, 2000) } } : session
  if (action.type === 'support') return { ...session, supportUsed: [...new Set([...session.supportUsed, task.id])] }
  if (action.type === 'model') return task.stage === 'worked' || session.answers[task.id] ? { ...session, models: [...new Set([...session.models, task.id])] } : session
  if (action.type === 'submit') {
    const response = (action.response ?? session.drafts[task.id] ?? '').trim()
    if (task.stage === 'worked' || session.answers[task.id] || !validDate(action.at) || !validResponse(task, response)) return session
    const result = gradePractice(task, response)
    return { ...session, answers: { ...session.answers, [task.id]: { response, result, submittedAt: action.at,
      supported: task.stage === 'supported' || session.supportUsed.includes(task.id) } },
      reviewIds: result === 'incorrect' ? [...new Set([...session.reviewIds, ...task.cardIds])] : session.reviewIds }
  }
  return session
}

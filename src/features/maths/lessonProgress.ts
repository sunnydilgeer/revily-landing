export type LessonProgressSnapshot = {
  lessonId: string
  currentStateId: string
  currentStateIndex: number
  furthestStateIndex: number
  totalStates: number
  currentSectionId: string
  completed: boolean
  /** Rungs the student has finished (rungs are open, so position alone doesn't say this). */
  completedSections?: string[]
}

export type LessonProgressMap = Record<string, LessonProgressSnapshot>

export const MATHS_PROGRESS_STORAGE_KEY = 'revily:maths-lesson-progress:v1'
export const MATHS_LAST_LESSON_STORAGE_KEY = 'revily:maths-last-lesson:v1'
export const MATHS_PROGRESS_EVENT = 'revily:maths-progress'
export const MATHS_NAVIGATE_EVENT = 'revily:maths-navigate'

export function readMathsProgress(): LessonProgressMap {
  if (typeof window === 'undefined') return {}
  try {
    const value = JSON.parse(window.localStorage.getItem(MATHS_PROGRESS_STORAGE_KEY) ?? '{}')
    return value && typeof value === 'object' ? value as LessonProgressMap : {}
  } catch {
    return {}
  }
}

export function saveMathsProgress(snapshot: LessonProgressSnapshot) {
  if (typeof window === 'undefined') return
  const progress = readMathsProgress()
  const previous = progress[snapshot.lessonId]
  progress[snapshot.lessonId] = { ...snapshot, completedSections: snapshot.completedSections ?? previous?.completedSections }
  window.localStorage.setItem(MATHS_PROGRESS_STORAGE_KEY, JSON.stringify(progress))
  window.dispatchEvent(new CustomEvent<LessonProgressSnapshot>(MATHS_PROGRESS_EVENT, { detail: snapshot }))
}

export function requestMathsState(lessonId: string, stateId: string) {
  window.dispatchEvent(new CustomEvent(MATHS_NAVIGATE_EVENT, { detail: { lessonId, stateId } }))
}

export function lessonPercent(snapshot?: LessonProgressSnapshot) {
  if (!snapshot) return 0
  if (snapshot.completed) return 100
  return Math.round(snapshot.furthestStateIndex / Math.max(1, snapshot.totalStates - 1) * 100)
}

/** Record that a rung is finished, keeping any rungs finished earlier. */
export function markSectionComplete(lessonId: string, sectionId: string, legacy: string[] = []) {
  if (typeof window === 'undefined') return
  const current = readMathsProgress()[lessonId]
  if (!current) return
  const completedSections = [...new Set([...(current.completedSections ?? legacy), sectionId])]
  saveMathsProgress({ ...current, completedSections })
}

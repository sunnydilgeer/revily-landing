/*
 * Daily study log, kept on this device only (no accounts yet).
 * - Minutes: counted while a lesson is open, the tab is visible and the student has done
 *   something in the last two minutes, so a lesson left open overnight does not count.
 * - Streak: a day counts once the student finishes a rung or studies for 5 minutes.
 * - Daily goal: 10, 20, 30 or 45 minutes; separate from the streak so long sessions are rewarded
 *   without making a streak impossible to keep.
 */

export type StudyDay = { seconds: number; rungs: number }
export type StudyLog = Record<string, StudyDay>

export const STUDY_LOG_KEY = 'revily:study-log:v1'
export const DAILY_GOAL_KEY = 'revily:daily-goal-minutes:v1'
export const STUDY_LOG_EVENT = 'revily:study-log'
export const RUNG_COMPLETE_EVENT = 'revily:rung-complete'
export const GOAL_OPTIONS = [10, 20, 30, 45] as const
export const DEFAULT_GOAL = 20
export const STREAK_MIN_SECONDS = 5 * 60
const KEEP_DAYS = 400

export function dayKey(date = new Date()) {
  const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, '0'), d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function previousDay(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d - 1))
}

export function dayCounts(day?: StudyDay) {
  return Boolean(day && (day.rungs > 0 || day.seconds >= STREAK_MIN_SECONDS))
}

/** Days in a row that count, ending today, or ending yesterday if today has not counted yet. */
export function streakFrom(log: StudyLog, today = dayKey()) {
  let key = dayCounts(log[today]) ? today : previousDay(today)
  let streak = 0
  while (dayCounts(log[key])) {
    streak += 1
    key = previousDay(key)
  }
  return streak
}

/** The last seven days, oldest first, for a small week strip. */
export function lastSevenDays(log: StudyLog, today = dayKey()) {
  const days: { key: string; counted: boolean; minutes: number }[] = []
  let key = today
  for (let i = 0; i < 7; i++) {
    days.unshift({ key, counted: dayCounts(log[key]), minutes: Math.floor((log[key]?.seconds ?? 0) / 60) })
    key = previousDay(key)
  }
  return days
}

/* ---------- Storage (every access guarded: private windows and blocked storage must not break the app) ---------- */

export function readStudyLog(): StudyLog {
  if (typeof window === 'undefined') return {}
  try {
    const value = JSON.parse(window.localStorage.getItem(STUDY_LOG_KEY) ?? '{}')
    return value && typeof value === 'object' ? value as StudyLog : {}
  } catch {
    return {}
  }
}

function writeStudyLog(log: StudyLog) {
  const keys = Object.keys(log).sort()
  for (const old of keys.slice(0, Math.max(0, keys.length - KEEP_DAYS))) delete log[old]
  try { window.localStorage.setItem(STUDY_LOG_KEY, JSON.stringify(log)) } catch { /* storage unavailable: keep going */ }
  window.dispatchEvent(new CustomEvent(STUDY_LOG_EVENT))
}

export function addStudySeconds(seconds: number) {
  if (typeof window === 'undefined' || seconds <= 0) return
  const log = readStudyLog(), key = dayKey()
  const day = log[key] ?? { seconds: 0, rungs: 0 }
  log[key] = { ...day, seconds: day.seconds + seconds }
  writeStudyLog(log)
}

export function recordRungComplete() {
  if (typeof window === 'undefined') return
  const log = readStudyLog(), key = dayKey()
  const day = log[key] ?? { seconds: 0, rungs: 0 }
  log[key] = { ...day, rungs: day.rungs + 1 }
  writeStudyLog(log)
}

export function readDailyGoal() {
  if (typeof window === 'undefined') return DEFAULT_GOAL
  try {
    const value = Number(window.localStorage.getItem(DAILY_GOAL_KEY))
    return (GOAL_OPTIONS as readonly number[]).includes(value) ? value : DEFAULT_GOAL
  } catch {
    return DEFAULT_GOAL
  }
}

export function saveDailyGoal(minutes: number) {
  try { window.localStorage.setItem(DAILY_GOAL_KEY, String(minutes)) } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent(STUDY_LOG_EVENT))
}

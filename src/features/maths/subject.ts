/*
 * Which subject the app is showing. The app reopens on the last one used; a `subject` query
 * parameter wins, and a Maths `lesson` link always means Maths.
 */
import type { Subject } from './studyLog'

export type { Subject }
export const SUBJECTS: { id: Subject; label: string }[] = [
  { id: 'maths', label: 'Maths' },
  { id: 'science', label: 'Science' },
]
export const LAST_SUBJECT_KEY = 'revily:last-subject:v1'

export function isSubject(value: unknown): value is Subject {
  return value === 'maths' || value === 'science'
}

export function readLastSubject(): Subject {
  try {
    const value = window.localStorage.getItem(LAST_SUBJECT_KEY)
    return isSubject(value) ? value : 'maths'
  } catch {
    return 'maths'
  }
}

export function saveLastSubject(subject: Subject) {
  try { window.localStorage.setItem(LAST_SUBJECT_KEY, subject) } catch { /* storage unavailable: keep going */ }
}

/** The subject a URL asks for, falling back to the remembered one. */
export function subjectFromUrl(search: string, remembered: Subject): Subject {
  const params = new URLSearchParams(search)
  const asked = params.get('subject')
  if (isSubject(asked)) return asked
  if (params.has('lesson')) return 'maths'
  return remembered
}

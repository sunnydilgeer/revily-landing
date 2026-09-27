/*
 * Saving Practice results on this device.
 *
 *   PRACTICE_KEY   per checklist statement: parts attempted and right first time. readiness.ts reads this for
 *                  the exam-ready (gold) level; PRACTICE_EVENT tells useReadiness to refresh.
 *   SERVED_KEY     how many times each template has been shown, so the next sprint uses new numbers.
 *   SPRINTS_KEY    finished sprints, newest last, for the best and last scores.
 */
import { PRACTICE_EVENT, PRACTICE_KEY, type PracticeRecord } from '../readiness/readiness'

const SERVED_KEY = 'revily:maths-practice-served:v1'
const SPRINTS_KEY = 'revily:maths-practice-sprints:v1'

export type SprintRecord = { on: string; marks: number; outOf: number }
export type PracticeRecords = Record<string, PracticeRecord>

const today = () => new Date().toISOString().slice(0, 10)

function read<T>(key: string, fallback: T): T {
  try { return JSON.parse(window.localStorage.getItem(key) ?? 'null') ?? fallback } catch { return fallback }
}

function write(key: string, value: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage blocked: this visit only */ }
}

/** One answered part, added to each statement it tests. Pure, so the checks can test it. */
export function addAttempt(records: PracticeRecords, statements: string[], firstTry: boolean, on = today()): PracticeRecords {
  const next = { ...records }
  for (const key of new Set(statements)) {
    const old = next[key] ?? { attempted: 0, firstTry: 0, on }
    next[key] = { attempted: old.attempted + 1, firstTry: old.firstTry + (firstTry ? 1 : 0), on }
  }
  return next
}

export const readPracticeRecords = () => read<PracticeRecords>(PRACTICE_KEY, {})

/** Saves an answered part straight away, so leaving mid-sprint keeps what was done. */
export function recordAttempt(statements: string[], firstTry: boolean) {
  write(PRACTICE_KEY, addAttempt(readPracticeRecords(), statements, firstTry))
  window.dispatchEvent(new Event(PRACTICE_EVENT))
}

export const readServed = () => read<Record<string, number>>(SERVED_KEY, {})

export function markServed(ids: string[]) {
  const served = readServed()
  for (const id of ids) served[id] = (served[id] ?? 0) + 1
  write(SERVED_KEY, served)
}

export const readSprints = () => read<SprintRecord[]>(SPRINTS_KEY, [])

export function saveSprint(marks: number, outOf: number) {
  write(SPRINTS_KEY, [...readSprints(), { on: today(), marks, outOf }].slice(-50))
}

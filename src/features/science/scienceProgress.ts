/*
 * Science progress for the curriculum home, read from each lesson's saved session on this device.
 * Sections play the part Maths rungs do: a section is done when every screen in it is complete.
 */
import { progress } from './engine'
import { getScienceLessons, scienceChapters, type LessonNumber } from './lessonNavigation'
import { scienceLessonSections } from './lessonSections'
import { createPreviewSessionEngine, type PreviewSession } from './previewSession'
import type { ScienceLesson } from './types'

export const SCIENCE_LAST_LESSON_KEY = 'revily:science-last-lesson:v1'

export const scienceCatalogue = getScienceLessons('b')
const engines = new Map(scienceCatalogue.map(item => [item.number, createPreviewSessionEngine(item.lesson)] as const))

export type ScienceSectionStatus = { id: string; title: string; done: boolean; current: boolean }
export type ScienceLessonStatus = { started: boolean; completed: boolean; sections: ScienceSectionStatus[] }

/** Section status from a saved session (or none). Sections are ordered by where they start in the lesson. */
export function sectionStatus(lesson: ScienceLesson, number: LessonNumber, session: PreviewSession | null): ScienceSectionStatus[] {
  const index = new Map(lesson.states.map((state, i) => [state.id, i]))
  const ordered = [...scienceLessonSections[number]]
    .filter(section => index.has(section.id))
    .sort((a, b) => index.get(a.id)! - index.get(b.id)!)
  const done = new Set(session?.completedIds ?? [])
  const currentIndex = session?.currentId ? index.get(session.currentId) ?? -1 : -1
  return ordered.map((section, i) => {
    const start = index.get(section.id)!
    const end = i + 1 < ordered.length ? index.get(ordered[i + 1].id)! : lesson.states.length
    const ids = lesson.states.slice(start, end).map(state => state.id)
    return {
      id: section.id,
      title: section.label,
      done: ids.length > 0 && ids.every(id => done.has(id)),
      current: currentIndex >= start && currentIndex < end,
    }
  })
}

function readSession(number: LessonNumber): PreviewSession | null {
  const engine = engines.get(number)
  if (!engine) return null
  try {
    const raw = window.localStorage.getItem(engine.storageKey)
    return raw ? engine.restorePreviewSession(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export function readScienceProgress(): Partial<Record<LessonNumber, ScienceLessonStatus>> {
  const result: Partial<Record<LessonNumber, ScienceLessonStatus>> = {}
  for (const item of scienceCatalogue) {
    const session = readSession(item.number)
    if (!session) continue
    const lesson = item.lesson
    const started = session.currentId !== lesson.states[0].id || session.completedIds.length > 0
      || Object.keys(session.answers).length > 0 || Object.keys(session.drafts).length > 0
    result[item.number] = {
      started,
      completed: progress(lesson, session.completedIds).completed === lesson.states.length,
      sections: sectionStatus(lesson, item.number, session),
    }
  }
  return result
}

export function readScienceLastLesson(): LessonNumber | null {
  try {
    const value = Number(window.localStorage.getItem(SCIENCE_LAST_LESSON_KEY))
    return scienceCatalogue.some(item => item.number === value) ? value as LessonNumber : null
  } catch {
    return null
  }
}

export function saveScienceLastLesson(number: LessonNumber) {
  try { window.localStorage.setItem(SCIENCE_LAST_LESSON_KEY, String(number)) } catch { /* storage unavailable */ }
}

/** The AQA units as curriculum chapters, each with its lessons from the catalogue. */
export const scienceUnits = scienceChapters.map(chapter => ({
  code: chapter.code,
  title: chapter.title,
  lessons: scienceCatalogue.filter(item => (chapter.lessonNumbers as readonly number[]).includes(item.number)),
}))

/*
 * Science progress for the curriculum home, read from each lesson's saved session on this device.
 * Sections play the part Maths rungs do: a section is done when every screen in it is complete.
 */
import { progress } from './engine'
import { allScienceLessons, getScienceLesson, isScienceSubject, scienceSubjects, type ScienceCatalogueEntry, type ScienceLessonRef } from './lessonNavigation'
import type { ScienceSection } from './lessonSections'
import { createPreviewSessionEngine, type PreviewSession } from './previewSession'
import type { ScienceLesson } from './types'

// Biology is stored as a bare number ("12"), as it always was; other subjects as "<subject>:<number>" ("chemistry:1", "physics:1").
export const SCIENCE_LAST_LESSON_KEY = 'revily:science-last-lesson:v1'

/** Every built lesson, all subjects. Progress maps are keyed by lesson id, which is unique across subjects. */
export const scienceCatalogue = allScienceLessons
const engines = new Map(scienceCatalogue.map(item => [item.lesson.id, createPreviewSessionEngine(item.lesson)] as const))

export type ScienceSectionStatus = { id: string; title: string; done: boolean; current: boolean }
export type ScienceLessonStatus = { started: boolean; completed: boolean; sections: ScienceSectionStatus[] }
/** Lesson status keyed by lesson id. */
export type ScienceProgressMap = Partial<Record<string, ScienceLessonStatus>>

export type SectionRange = { id: string; title: string; start: number; end: number }

/** Each section's span of screens [start, end), ordered by where it starts in the lesson. */
export function sectionRanges(lesson: ScienceLesson, sections: readonly ScienceSection[]): SectionRange[] {
  const index = new Map(lesson.states.map((state, i) => [state.id, i]))
  const ordered = [...sections]
    .filter(section => index.has(section.id))
    .sort((a, b) => index.get(a.id)! - index.get(b.id)!)
  return ordered.map((section, i) => ({
    id: section.id,
    title: section.label,
    start: index.get(section.id)!,
    end: i + 1 < ordered.length ? index.get(ordered[i + 1].id)! : lesson.states.length,
  }))
}

/** Section status from a saved session (or none). */
export function sectionStatus(lesson: ScienceLesson, sections: readonly ScienceSection[], session: PreviewSession | null): ScienceSectionStatus[] {
  const done = new Set(session?.completedIds ?? [])
  const currentIndex = session?.currentId ? lesson.states.findIndex(state => state.id === session.currentId) : -1
  return sectionRanges(lesson, sections).map(range => {
    const ids = lesson.states.slice(range.start, range.end).map(state => state.id)
    return {
      id: range.id,
      title: range.title,
      done: ids.length > 0 && ids.every(id => done.has(id)),
      current: currentIndex >= range.start && currentIndex < range.end,
    }
  })
}

function readSession(lessonId: string): PreviewSession | null {
  const engine = engines.get(lessonId)
  if (!engine) return null
  try {
    const raw = window.localStorage.getItem(engine.storageKey)
    return raw ? engine.restorePreviewSession(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export function readScienceProgress(): ScienceProgressMap {
  const result: ScienceProgressMap = {}
  for (const item of scienceCatalogue) {
    const session = readSession(item.lesson.id)
    if (!session) continue
    const lesson = item.lesson
    const started = session.currentId !== lesson.states[0].id || session.completedIds.length > 0
      || Object.keys(session.answers).length > 0 || Object.keys(session.drafts).length > 0
    result[lesson.id] = {
      started,
      completed: progress(lesson, session.completedIds).completed === lesson.states.length,
      sections: sectionStatus(lesson, item.sections, session),
    }
  }
  return result
}

/** The stored last-lesson value: a bare number for Biology (unchanged format), "<subject>:<number>" otherwise. */
export function encodeScienceLastLesson(ref: ScienceLessonRef) {
  return ref.subject === 'biology' ? String(ref.number) : `${ref.subject}:${ref.number}`
}
export function decodeScienceLastLesson(value: string | null): ScienceCatalogueEntry | null {
  const match = /^(?:([a-z]+):)?([1-9]\d*)$/.exec(value ?? '')
  if (!match) return null
  const subject = match[1] ?? 'biology'
  return isScienceSubject(subject) ? getScienceLesson(subject, Number(match[2])) : null
}

export function readScienceLastLesson(): ScienceCatalogueEntry | null {
  try {
    return decodeScienceLastLesson(window.localStorage.getItem(SCIENCE_LAST_LESSON_KEY))
  } catch {
    return null
  }
}

export function saveScienceLastLesson(ref: ScienceLessonRef) {
  try { window.localStorage.setItem(SCIENCE_LAST_LESSON_KEY, encodeScienceLastLesson(ref)) } catch { /* storage unavailable */ }
}

/** The AQA units as curriculum chapters (Biology, then Chemistry, then Physics), each with its built lessons. */
export const scienceUnits = scienceSubjects.flatMap(item => item.chapters.map(chapter => ({
  subject: item.subject,
  subjectTitle: item.title,
  code: chapter.code,
  title: chapter.title,
  lessons: item.lessons.filter(entry => chapter.lessonNumbers.includes(entry.number)),
})))

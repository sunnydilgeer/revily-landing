/*
 * Science progress for the curriculum home, read from each lesson's saved session on this device.
 * Sections play the part Maths rungs do: a section is done when every screen in it is complete.
 */
import { progress } from './engine'
import { allScienceLessons, scienceLessonLabel, scienceSubjects, type ScienceCatalogueEntry } from './lessonNavigation'
import type { ScienceSection } from './lessonSections'
import { createPreviewSessionEngine, type PreviewSession } from './previewSession'
import { chapterLessonsForTier, forTier, getScienceLessonForTier, parseScienceLessonRefForTier, readScienceTier, scienceCatalogueForTier, type ScienceTier } from './tier'
import type { ScienceLesson } from './types'

// Biology is stored as a bare number ("12"), as it always was; other subjects as "<subject>:<number>" ("chemistry:1", "physics:1").
// A Higher-only lesson is stored by its label ("chemistry:20H") and only ever decodes for a Higher student.
export const SCIENCE_LAST_LESSON_KEY = 'revily:science-last-lesson:v1'

/** Every built Foundation lesson, all subjects (Higher students: `scienceCatalogueForTier`). Progress maps are keyed by lesson id, which is unique across subjects. */
export const scienceCatalogue = allScienceLessons
// One engine per lesson version (a lesson with Higher sections has its own version and saved session).
const engines = new Map<string, ReturnType<typeof createPreviewSessionEngine>>()
function engineFor(lesson: ScienceLesson) {
  const key = `${lesson.id}:${lesson.contentVersion}`
  let engine = engines.get(key)
  if (!engine) { engine = createPreviewSessionEngine(lesson); engines.set(key, engine) }
  return engine
}

export type ScienceSectionStatus = { id: string; title: string; done: boolean; current: boolean; higher?: true }
export type ScienceLessonStatus = { started: boolean; completed: boolean; sections: ScienceSectionStatus[] }
/** Lesson status keyed by lesson id. */
export type ScienceProgressMap = Partial<Record<string, ScienceLessonStatus>>

export type SectionRange = { id: string; title: string; start: number; end: number; higher?: true }

/** Each section's span of screens [start, end), ordered by where it starts in the lesson. */
export function sectionRanges(lesson: ScienceLesson, sections: readonly ScienceSection[]): SectionRange[] {
  const index = new Map(lesson.states.map((state, i) => [state.id, i]))
  const ordered = [...sections]
    .filter(section => index.has(section.id))
    .sort((a, b) => index.get(a.id)! - index.get(b.id)!)
  return ordered.map((section, i) => ({
    id: section.id,
    title: section.label,
    ...(section.higher ? { higher: true as const } : {}),
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
      ...(range.higher ? { higher: true as const } : {}),
      done: ids.length > 0 && ids.every(id => done.has(id)),
      current: currentIndex >= range.start && currentIndex < range.end,
    }
  })
}

function readSession(lesson: ScienceLesson): PreviewSession | null {
  const engine = engineFor(lesson)
  try {
    const raw = window.localStorage.getItem(engine.storageKey)
    return raw ? engine.restorePreviewSession(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

/** Progress for the student's tier, keyed by lesson id (the same ids on both tiers). Higher-only lessons are read only for Higher. */
export function readScienceProgress(tier: ScienceTier = readScienceTier()): ScienceProgressMap {
  const result: ScienceProgressMap = {}
  for (const foundation of scienceCatalogueForTier(tier)) {
    const item = forTier(foundation, tier)
    const session = readSession(item.lesson)
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

type LastLessonRef = Pick<ScienceCatalogueEntry, 'subject' | 'number' | 'label'>
/** The stored last-lesson value: a bare number for Biology (unchanged format), "<subject>:<number>" otherwise ("chemistry:20H" for a Higher-only lesson). */
export function encodeScienceLastLesson(ref: LastLessonRef) {
  return ref.subject === 'biology' ? scienceLessonLabel(ref) : `${ref.subject}:${scienceLessonLabel(ref)}`
}
/** The saved last lesson, if the tier has it (Foundation never decodes a Higher-only lesson). */
export function decodeScienceLastLesson(value: string | null, tier: ScienceTier = 'foundation'): ScienceCatalogueEntry | null {
  const match = /^(?:([a-z]+):)?([1-9]\d*H?)$/.exec(value ?? '')
  const ref = match && parseScienceLessonRefForTier(match[1], match[2], tier)
  return ref ? getScienceLessonForTier(ref.subject, ref.number, tier) : null
}

export function readScienceLastLesson(tier: ScienceTier = readScienceTier()): ScienceCatalogueEntry | null {
  try {
    return decodeScienceLastLesson(window.localStorage.getItem(SCIENCE_LAST_LESSON_KEY), tier)
  } catch {
    return null
  }
}

export function saveScienceLastLesson(ref: LastLessonRef) {
  try { window.localStorage.setItem(SCIENCE_LAST_LESSON_KEY, encodeScienceLastLesson(ref)) } catch { /* storage unavailable */ }
}

export type ScienceUnit = { subject: ScienceCatalogueEntry['subject']; subjectTitle: string; code: string; title: string; lessons: readonly ScienceCatalogueEntry[] }
function unitsFor(tier: ScienceTier): ScienceUnit[] {
  return scienceSubjects.flatMap(item => item.chapters.map(chapter => ({
    subject: item.subject,
    subjectTitle: item.title,
    code: chapter.code,
    title: chapter.title,
    lessons: chapterLessonsForTier(chapter, tier),
  })))
}
/** The AQA units as curriculum chapters (Biology, then Chemistry, then Physics), each with its built Foundation lessons. */
export const scienceUnits = unitsFor('foundation')
const higherUnits = unitsFor('higher')
/** The units as a student on `tier` sees them: Higher units also hold their Higher-only lessons, in order. */
export function scienceUnitsForTier(tier: ScienceTier): readonly ScienceUnit[] {
  return tier === 'higher' ? higherUnits : scienceUnits
}

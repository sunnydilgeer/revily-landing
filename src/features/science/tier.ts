/*
 * Foundation or Higher. There is one set of Science lessons. A Higher student gets every Foundation
 * screen plus the Higher-only sections in `higher/additions.ts`. A Foundation student gets the
 * catalogue exactly as authored: `forTier(entry, 'foundation')` returns the same entry object, so
 * Higher screens never reach Foundation (no hints, no section titles, no progress counts).
 *
 * A lesson with Higher sections gets its own content version ("0.2.0-higher"), which gives it its own
 * saved session. Switching tier never mixes the two sessions or makes one invalid.
 *
 * Whole Higher-only lessons (`higher/lessons.ts`, e.g. Chemistry Lesson 20H) are added by the `…ForTier` lookups below.
 * On Foundation each one returns exactly what the Foundation lookup in lessonNavigation.ts returns, so a Higher-only
 * lesson never appears there: no list row, count, progress, next-lesson link, contents entry or URL.
 */
import { sampledRequirements } from './lessonAuthoring'
import { higherAdditions } from './higher/additions'
import { higherLessons } from './higher/lessons'
import {
  allScienceLessons, chapterHasLesson, getScienceLesson, isScienceSubject, nextScienceLesson, parseScienceLessonRef, scienceLessonsFor, scienceSubjects,
  type ScienceCatalogueEntry, type ScienceChapter, type ScienceLessonRef, type ScienceSubject,
} from './lessonNavigation'

export type ScienceTier = 'foundation' | 'higher'
export const SCIENCE_TIER_KEY = 'revily:science-tier:v1'

export function readScienceTier(): ScienceTier {
  try { return window.localStorage.getItem(SCIENCE_TIER_KEY) === 'higher' ? 'higher' : 'foundation' }
  catch { return 'foundation' }
}
export function saveScienceTier(tier: ScienceTier) {
  try { window.localStorage.setItem(SCIENCE_TIER_KEY, tier) }
  catch { /* The choice still applies on this page; it just won't be remembered. */ }
}

/** Every Higher-only screen id. */
export const higherStateIds: ReadonlySet<string> = new Set(higherAdditions.flatMap(add => add.states.map(state => state.id)))

const higherEntries = new Map<ScienceCatalogueEntry, ScienceCatalogueEntry>()

/** The lesson as a student on `tier` sees it. Foundation always gets the entry unchanged. */
export function forTier(entry: ScienceCatalogueEntry, tier: ScienceTier): ScienceCatalogueEntry {
  if (tier !== 'higher') return entry
  const adds = higherAdditions.filter(add => add.lessonId === entry.lesson.id)
  if (adds.length === 0) return entry
  const cached = higherEntries.get(entry)
  if (cached) return cached
  const states = [...entry.lesson.states]
  for (const add of adds) {
    const at = states.findIndex(state => state.id === add.before)
    if (at < 0) throw new Error(`Higher section ${add.section.id} is placed before ${add.before}, which is not in ${entry.lesson.id}`)
    states.splice(at, 0, ...add.states)
  }
  const higher: ScienceCatalogueEntry = {
    ...entry,
    lesson: { ...entry.lesson, contentVersion: `${entry.lesson.contentVersion}-higher`, states, requirements: sampledRequirements(states) },
    sections: [...entry.sections, ...adds.map(add => add.section)],
    frames: Object.assign({}, entry.frames, ...adds.map(add => add.frames)),
  }
  higherEntries.set(entry, higher)
  return higher
}

const higherSubjectLessons = new Map<ScienceSubject, readonly ScienceCatalogueEntry[]>()

/** A subject's lessons in teaching order. Foundation: the subject catalogue unchanged. Higher: plus its Higher-only lessons in place (20, 20H, 21). */
export function scienceLessonsForTier(subject: ScienceSubject, tier: ScienceTier): readonly ScienceCatalogueEntry[] {
  if (tier !== 'higher') return scienceLessonsFor(subject)
  let lessons = higherSubjectLessons.get(subject)
  if (!lessons) {
    lessons = [...scienceLessonsFor(subject), ...higherLessons.filter(entry => entry.subject === subject)].sort((a, b) => a.number - b.number)
    higherSubjectLessons.set(subject, lessons)
  }
  return lessons
}
const higherCatalogue = scienceSubjects.flatMap(item => scienceLessonsForTier(item.subject, 'higher'))
/** Every lesson the tier gets, all subjects, in course order. Foundation is `allScienceLessons`. */
export function scienceCatalogueForTier(tier: ScienceTier): readonly ScienceCatalogueEntry[] {
  return tier === 'higher' ? higherCatalogue : allScienceLessons
}
export function getScienceLessonForTier(subject: ScienceSubject, number: number, tier: ScienceTier): ScienceCatalogueEntry | null {
  if (tier !== 'higher') return getScienceLesson(subject, number)
  return scienceLessonsForTier(subject, tier).find(item => item.number === number) ?? null
}
/** The next lesson in the same subject for the tier (Higher: 20 → 20H → 21; Foundation: 20 → 21), or null at the end. */
export function nextScienceLessonForTier(entry: ScienceLessonRef, tier: ScienceTier): ScienceCatalogueEntry | null {
  if (tier !== 'higher') return nextScienceLesson(entry)
  const lessons = scienceLessonsForTier(entry.subject, tier)
  const at = lessons.findIndex(item => item.number === entry.number)
  return at < 0 ? null : lessons[at + 1] ?? null
}
/** A chapter's lessons for the tier, in order. */
export function chapterLessonsForTier(chapter: ScienceChapter, tier: ScienceTier): readonly ScienceCatalogueEntry[] {
  return scienceLessonsForTier(chapter.subject, tier).filter(item => chapterHasLesson(chapter, item))
}
/** `parseScienceLessonRef`, plus Higher-only labels (`lesson=20H`, any case) when the tier is Higher. */
export function parseScienceLessonRefForTier(subjectValue: string | string[] | undefined, lessonValue: string | string[] | undefined, tier: ScienceTier): ScienceLessonRef | null {
  const ref = parseScienceLessonRef(subjectValue, lessonValue)
  if (ref || tier !== 'higher') return ref
  const subject = subjectValue === undefined ? 'biology' : subjectValue
  if (!isScienceSubject(subject) || typeof lessonValue !== 'string') return null
  const entry = higherLessons.find(item => item.subject === subject && item.label === lessonValue.toUpperCase())
  return entry ? { subject, number: entry.number } : null
}

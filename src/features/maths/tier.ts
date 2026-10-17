/*
 * Foundation or Higher, as in Science (../science/tier.ts). There is one set of Maths lessons. A Higher student gets
 * every Foundation lesson, plus the Higher sections in `higher/additions.ts` inside them and the Higher-only lessons in
 * `higher/lessons.ts` between them. A Foundation student gets the course exactly as authored: every lookup below returns
 * the same entries as courseRegistry.ts, so Higher screens never reach Foundation (no rows, counts, progress or links).
 *
 * A lesson with Higher sections gets its own lesson id ("L011-H"), so its saved progress is its own: switching tier
 * never mixes the two or makes one invalid.
 */
import type { TutorMethodLesson } from '../written-methods/tutor/model'
import { getMathsLesson, isMathsLessonNumber, mathsChapters, type MathsChapter, type MathsLessonEntry, type MathsLessonNumber } from './courseRegistry'
import { sectionsFor } from './sections'
import { higherAdditions } from './higher/additions'
import { higherLessons } from './higher/lessons'

export type MathsTier = 'foundation' | 'higher'
export const MATHS_TIER_KEY = 'revily:maths-tier:v1'

export function readMathsTier(): MathsTier {
  try { return window.localStorage.getItem(MATHS_TIER_KEY) === 'higher' ? 'higher' : 'foundation' }
  catch { return 'foundation' }
}
export function saveMathsTier(tier: MathsTier) {
  try { window.localStorage.setItem(MATHS_TIER_KEY, tier) }
  catch { /* The choice still applies on this page; it just won't be remembered. */ }
}

const higherEntries = new Map<MathsLessonEntry, MathsLessonEntry>()

/** The lesson as a student on `tier` sees it. Foundation always gets the entry unchanged. */
export function forTier(entry: MathsLessonEntry, tier: MathsTier): MathsLessonEntry {
  if (tier !== 'higher') return entry
  const adds = higherAdditions.filter(add => add.lessonId === entry.lessonId)
  if (adds.length === 0) return entry
  const cached = higherEntries.get(entry)
  if (cached) return cached
  const lesson = entry.definition as TutorMethodLesson
  // Higher sections go just before the Review, and every screen points on to the one after it.
  const review = lesson.states.findIndex(state => state.microSkillId === 'mixed')
  const at = review < 0 ? lesson.states.length : review
  const spliced = [...lesson.states.slice(0, at), ...adds.flatMap(add => add.states), ...lesson.states.slice(at)]
  const states = spliced.map((state, i) => ({ ...state, transition: { ...state.transition, onComplete: spliced[i + 1]?.id } }))
  const labels = { ...lesson.labels, ...Object.fromEntries(adds.map(add => [add.skill, add.label])) }
  const definition: TutorMethodLesson = { ...lesson, id: `${lesson.id}-H`, labels, states }
  const higher: MathsLessonEntry = {
    ...entry, lessonId: definition.id, stateCount: states.length, definition,
    sections: sectionsFor(definition, labels).map(section => adds.some(add => add.skill === section.id) ? { ...section, higher: true } : section),
  }
  higherEntries.set(entry, higher)
  return higher
}

/** A Higher-only lesson as a course entry, in the chapter of the lesson it follows. */
function higherOnlyEntry(item: (typeof higherLessons)[number]): MathsLessonEntry {
  const after = getMathsLesson(item.after as MathsLessonNumber)
  const lesson = item.lesson
  // A second Higher-only lesson after the same lesson is "9H2" (Completing the square after 9H, the quadratic formula).
  const nth = higherLessons.filter(other => other.after === item.after).indexOf(item)
  return {
    number: lesson.number, position: after.position, label: `${after.position}H${nth > 0 ? nth + 1 : ''}`, higherOnly: true,
    lessonId: lesson.id, chapterId: after.chapterId, title: item.title, description: item.description,
    stateCount: lesson.states.length, sections: sectionsFor(lesson, lesson.labels), definition: lesson,
  }
}

let higherChapters: MathsChapter[] | null = null
/** The chapters with their lessons for the tier. Higher: each lesson with its Higher sections, and 11H after 11. */
export function mathsChaptersForTier(tier: MathsTier): MathsChapter[] {
  if (tier !== 'higher') return mathsChapters
  higherChapters ??= mathsChapters.map(chapter => ({
    ...chapter,
    lessons: chapter.lessons.flatMap(entry => [
      forTier(entry, tier),
      ...higherLessons.filter(item => item.after === entry.number).map(higherOnlyEntry),
    ]),
  }))
  return higherChapters
}
/** Every lesson the tier gets, in course order. */
export function mathsLessonsForTier(tier: MathsTier): MathsLessonEntry[] {
  return mathsChaptersForTier(tier).flatMap(chapter => chapter.lessons)
}
export function getMathsLessonForTier(number: MathsLessonNumber, tier: MathsTier): MathsLessonEntry | undefined {
  return mathsLessonsForTier(tier).find(entry => entry.number === number)
}
export function isMathsLessonNumberForTier(value: number, tier: MathsTier): value is MathsLessonNumber {
  return tier === 'higher' ? mathsLessonsForTier(tier).some(entry => entry.number === value) : isMathsLessonNumber(value)
}

/** What the address says for a lesson: its number, or a Higher-only lesson's label ("11H"). */
export function lessonParam(number: MathsLessonNumber) {
  const item = higherLessons.find(entry => entry.lesson.number === number)
  return item ? higherOnlyEntry(item).label! : String(number)
}
/** The lesson an address names (`lesson=14`, or `lesson=11H` or `lesson=9H2` in any case for Higher), or null. */
export function parseLessonParam(value: string | null, tier: MathsTier): MathsLessonNumber | null {
  if (!value) return null
  if (/^\d+h\d*$/i.test(value)) {
    if (tier !== 'higher') return null
    return mathsLessonsForTier(tier).find(entry => entry.label === value.toUpperCase())?.number ?? null
  }
  const number = Number(value)
  return isMathsLessonNumberForTier(number, tier) ? number : null
}

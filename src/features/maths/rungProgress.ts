/*
 * Which rungs a student has finished.
 * Rungs are open: a student can jump to any rung, so "how far through the lesson" no longer means
 * "finished". Finished rungs are recorded explicitly (completedSections). Progress saved before
 * that existed falls back to the old rule: a rung is done once the student has moved past it.
 */
import type { LessonDefinition } from '../number-types/types'
import type { LessonProgressSnapshot } from './lessonProgress'

type Section = { id: string; startIndex: number }

/** Sections finished under the old rule (the student has moved past the rung's last screen). */
export function legacyCompleted(sections: Section[], stateCount: number, furthest = 0) {
  return sections.filter((section, index) => furthest > (sections[index + 1]?.startIndex ?? stateCount) - 1).map(section => section.id)
}

export function rungStatus(sections: (Section & { title: string })[], stateCount: number, snapshot?: LessonProgressSnapshot) {
  const done = new Set(snapshot?.completed
    ? sections.map(section => section.id)
    : snapshot?.completedSections ?? legacyCompleted(sections, stateCount, snapshot?.furthestStateIndex))
  return sections.map((section, index) => {
    const end = (sections[index + 1]?.startIndex ?? stateCount) - 1
    const current = Boolean(snapshot && !snapshot.completed && snapshot.currentStateIndex >= section.startIndex && snapshot.currentStateIndex <= end)
    return { ...section, done: done.has(section.id), current }
  })
}

/** Sections of a lesson, derived the same way as the course registry. */
export function sectionsOf(lesson: LessonDefinition) {
  return [...new Set(lesson.states.map(state => state.microSkillId))].map(id => ({ id: id as string, startIndex: lesson.states.findIndex(state => state.microSkillId === id) }))
}

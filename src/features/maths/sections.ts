import type { LessonDefinition, MicroSkillId } from '../number-types/types'

export type MathsSection = {
  id: MicroSkillId
  title: string
  startStateId: string
  startIndex: number
  /** A Higher-only section inside a Foundation lesson (tier.ts), shown with the H tile. */
  higher?: boolean
}

export function sectionsFor(lesson: LessonDefinition, labels: Partial<Record<MicroSkillId, string>>): MathsSection[] {
  return [...new Set(lesson.states.map(state => state.microSkillId))].map(id => {
    const startIndex = lesson.states.findIndex(state => state.microSkillId === id)
    return {
      id,
      title: labels[id] ?? id.replaceAll('-', ' '),
      startStateId: lesson.states[startIndex].id,
      startIndex,
    }
  })
}

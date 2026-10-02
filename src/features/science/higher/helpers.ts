/* Shared helpers for Higher-only sections (see additions.ts). */
import { author } from '../lessonAuthoring'
import type { ScienceSection } from '../lessonSections'
import type { TeachingFrame } from '../teachingFrame'
import type { ScienceState } from '../types'

export type HigherAddition = {
  /** The Foundation lesson this section goes into. */
  lessonId: string
  /** The Foundation screen it goes just before. */
  before: string
  section: ScienceSection
  states: ScienceState[]
  frames: Record<string, TeachingFrame[]>
}

// One new word per frame. Plain meaning first, then the GCSE term. Diagrams reuse the lesson's own.
export const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export function addition(lessonId: string, before: string, skillId: string, specRefs: string[], section: ScienceSection, frames: TeachingFrame[],
  build: (a: ReturnType<typeof author>) => ScienceState[]): HigherAddition {
  const a = author(skillId, specRefs)
  return { lessonId, before, section, frames: { [section.id]: frames }, states: [a.teach(section.id, section.label, frames), ...build(a)] }
}


/*
 * The sections of each Science lesson: the id of the state each one starts at, in teaching order.
 * The lesson player uses them for its contents menu; the curriculum uses them as progress pips.
 * Each lesson exports its own sections; the catalogue in lessonNavigation.ts collects them.
 */
import { scienceLessons, type LessonNumber } from './lessonNavigation'

/** `higher` marks a Higher-only section (see higher/additions.ts); it shows a Higher badge, never a "Higher:" title. */
export type ScienceSection = { id: string; label: string; detail?: string; higher?: true }

// Biology only, keyed by Biology lesson number (used by scripts/check-science-lesson.cjs as a fallback).
export const scienceLessonSections = Object.fromEntries(scienceLessons.map(item => [item.number, item.sections])) as unknown as Record<LessonNumber, readonly ScienceSection[]>

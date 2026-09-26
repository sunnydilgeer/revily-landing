/*
 * The sections of each Science lesson: the id of the state each one starts at, in teaching order.
 * The lesson player uses them for its contents menu; the curriculum uses them as progress pips.
 * Each lesson exports its own sections; the catalogue in lessonNavigation.ts collects them.
 */
import { scienceLessons, type LessonNumber } from './lessonNavigation'

export type ScienceSection = { id: string; label: string; detail?: string }

export const scienceLessonSections = Object.fromEntries(scienceLessons.map(item => [item.number, item.sections])) as unknown as Record<LessonNumber, readonly ScienceSection[]>

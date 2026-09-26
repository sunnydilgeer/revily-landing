/* Each lesson's teaching walkthroughs, keyed by the teaching screen they belong to. Collected from the catalogue. */
import { scienceLessons, type LessonNumber } from './lessonNavigation'
import type { TeachingFrame } from './teachingFrame'

export const lessonFrames = Object.fromEntries(scienceLessons.map(item => [item.number, item.frames])) as Record<LessonNumber, Record<string, TeachingFrame[]>>

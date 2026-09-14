import { lesson1 } from './lesson-1/lesson'
import { lesson2 } from './lesson-2/lesson'
import { lesson3 } from './lesson-3/lesson'

export type LessonNumber = 1 | 2 | 3
export const scienceLessons = [
  { number: 1, title: 'Cells', detail: 'Animal, plant and bacterial cells', lesson: lesson1 },
  { number: 2, title: 'Microscopy', detail: 'Magnification, resolution and measurements', lesson: lesson2 },
  { number: 3, title: 'Practical skills', detail: 'Prepare a slide, observe and draw', lesson: lesson3 },
] as const
export function scienceLessonHref(number: LessonNumber) { return `/preview/science?lesson=${number}` }
export function parseScienceLesson(value: string | string[] | undefined): LessonNumber | null {
  return value === '1' ? 1 : value === '2' ? 2 : value === '3' ? 3 : null
}

import { lesson1 } from './lesson-1/lesson'
import { lesson2 } from './lesson-2/lesson'
import { lesson3 } from './lesson-3/lesson'
import { lesson4 } from './lesson-4/lesson'
import { lesson5 } from './lesson-5/lesson'
import { lesson6 } from './lesson-6/lesson'
import { lesson1 as lesson1B } from './variants/b/lesson-1/lesson'
import { lesson2 as lesson2B } from './variants/b/lesson-2/lesson'
import { lesson3 as lesson3B } from './variants/b/lesson-3/lesson'
import { lesson4 as lesson4B } from './variants/b/lesson-4/lesson'
import { lesson5 as lesson5B } from './variants/b/lesson-5/lesson'
import { lesson6 as lesson6B } from './variants/b/lesson-6/lesson'
import { lesson7 as lesson7B } from './variants/b/lesson-7/lesson'
import { lesson8 as lesson8B } from './variants/b/lesson-8/lesson'
import { lesson9 as lesson9B } from './variants/b/lesson-9/lesson'

export type LessonNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type ScienceVariant = 'a' | 'b'
export const scienceLessons = [
  { number: 1, title: 'Cells', detail: 'Animal, plant and bacterial cells', lesson: lesson1 },
  { number: 2, title: 'Microscopy', detail: 'Magnification, resolution and measurements', lesson: lesson2 },
  { number: 3, title: 'Practical skills', detail: 'Prepare a slide, observe and draw', lesson: lesson3 },
  { number: 4, title: 'Specialisation', detail: 'Different cells, different jobs', lesson: lesson4 },
  { number: 5, title: 'Cell division', detail: 'Chromosomes, mitosis and stem cells', lesson: lesson5 },
  { number: 6, title: 'Transport and exchange', detail: 'Diffusion, osmosis and active transport', lesson: lesson6 },
] as const
export const scienceLessonsB = [
  { ...scienceLessons[0], lesson: lesson1B },
  { ...scienceLessons[1], lesson: lesson2B },
  { ...scienceLessons[2], lesson: lesson3B },
  { ...scienceLessons[3], lesson: lesson4B },
  { ...scienceLessons[4], lesson: lesson5B },
  { ...scienceLessons[5], lesson: lesson6B },
  { number: 7, title: 'Organisation', detail: 'Cells, tissues, organs and organ systems', lesson: lesson7B },
  { number: 8, title: 'Enzymes', detail: 'Catalysts, active sites, pH and reaction rates', lesson: lesson8B },
  { number: 9, title: 'Digestion and food tests', detail: 'Digestive enzymes, bile and practical tests', lesson: lesson9B },
] as const
export function getScienceLessons(variant: ScienceVariant = 'a') { return variant === 'b' ? scienceLessonsB : scienceLessons }
// The main catalogue exposes easier-only new lessons even while A is selected.
// Their canonical links switch to B, while Lessons 1–6 keep their A records.
export function getScienceHubLessons(variant: ScienceVariant = 'a') {
  return variant === 'b' ? scienceLessonsB : [...scienceLessons, ...scienceLessonsB.slice(6)]
}
export function scienceHubHref(variant: ScienceVariant = 'a') { return variant === 'b' ? '/preview/science?variant=b' : '/preview/science' }
export function scienceLessonHref(number: LessonNumber, variant: ScienceVariant = 'a', activity?: string | null) {
  const effectiveVariant = number >= 7 ? 'b' : variant
  return `/preview/science?lesson=${number}${effectiveVariant === 'b' ? '&variant=b' : ''}${activity ? '&activity=' + encodeURIComponent(activity) : ''}`
}
export function parseScienceVariant(value: string | string[] | undefined): ScienceVariant { return value === 'b' ? 'b' : 'a' }
export function parseScienceLesson(value: string | string[] | undefined): LessonNumber | null {
  return ['1','2','3','4','5','6','7','8','9'].includes(typeof value === 'string' ? value : '') ? Number(value) as LessonNumber : null
}

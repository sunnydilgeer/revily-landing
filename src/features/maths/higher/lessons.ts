/*
 * Higher-only Maths lessons: whole lessons only Higher students get (Higher sections inside a Foundation lesson are in
 * additions.ts). Numbering follows Science: a Higher-only lesson after Lesson N has `number: N + 0.5`, so it can never
 * clash with a Foundation number, and is labelled with N's place in its chapter plus H ("11H"), which is what students
 * see (with the H tile) and what the address carries: /preview?lesson=11H.
 */
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { tutorBidmasAlgebraLesson } from './bidmasAlgebraLesson'
import { tutorRecurringLesson } from './recurringLesson'

export type HigherLesson = {
  /** The Foundation lesson it follows, by course number. */
  after: number
  lesson: TutorMethodLesson & { number: 2.5 | 11.5 }
  title: string
  description: string
}

export const higherLessons: readonly HigherLesson[] = [
  // Number, after Lesson 2 (Order of operations): the book's N2 Level 6-7 question, algebraic fractions with BIDMAS.
  { after: 2, lesson: tutorBidmasAlgebraLesson as TutorMethodLesson & { number: 2.5 }, title: 'Simplifying with BIDMAS', description: 'Simplify fractions with algebra on the top and the bottom, using BIDMAS and the rules for powers.' },
  // Number, after Lesson 11 (Ordering numbers), as in the book (N11, N12, N13).
  { after: 11, lesson: tutorRecurringLesson as TutorMethodLesson & { number: 11.5 }, title: 'Recurring decimals', description: 'Write recurring decimals with dots, and change between recurring decimals and fractions.' },
]

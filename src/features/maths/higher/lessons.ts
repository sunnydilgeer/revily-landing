/*
 * Higher-only Maths lessons: whole lessons only Higher students get (Higher sections inside a Foundation lesson are in
 * additions.ts). Numbering follows Science: a Higher-only lesson after Lesson N has `number: N + 0.5`, so it can never
 * clash with a Foundation number, and is labelled with N's place in its chapter plus H ("11H"), which is what students
 * see (with the H tile) and what the address carries: /preview?lesson=11H.
 */
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { tutorBidmasAlgebraLesson } from './bidmasAlgebraLesson'
import { tutorRecurringLesson } from './recurringLesson'
import { tutorIndicesHigherLesson } from './indicesLesson'
import { tutorTripleBracketsLesson } from './tripleBracketsLesson'
import { tutorSurdsLesson } from './surdsLesson'

type HigherLessonNumber = 2.5 | 11.5 | 16.5 | 17.5 | 18.5

export type HigherLesson = {
  /** The Foundation lesson it follows, by course number. */
  after: number
  lesson: TutorMethodLesson & { number: HigherLessonNumber }
  title: string
  description: string
}

export const higherLessons: readonly HigherLesson[] = [
  // Number, after Lesson 2 (Order of operations): the book's N2 Level 6-7 question, algebraic fractions with BIDMAS.
  { after: 2, lesson: tutorBidmasAlgebraLesson as TutorMethodLesson & { number: 2.5 }, title: 'Simplifying with BIDMAS', description: 'Simplify fractions with algebra on the top and the bottom, using BIDMAS and the rules for powers.' },
  // Number, after Lesson 11 (Ordering numbers), as in the book (N11, N12, N13).
  { after: 11, lesson: tutorRecurringLesson as TutorMethodLesson & { number: 11.5 }, title: 'Recurring decimals', description: 'Write recurring decimals with dots, and change between recurring decimals and fractions.' },
  // Algebra, in the book's order: A3 Indices Rules after Powers and roots (A2), A5 after Expanding brackets (A4), and
  // A7 Surds after Factorising (A6).
  { after: 16, lesson: tutorIndicesHigherLesson as TutorMethodLesson & { number: 16.5 }, title: 'Negative and fractional powers', description: 'Work out negative and fractional powers like 4⁻³ and the cube root of 64 squared, and use all the rules of indices together.' },
  { after: 17, lesson: tutorTripleBracketsLesson as TutorMethodLesson & { number: 17.5 }, title: 'Expanding triple brackets', description: 'Expand three brackets, like (x + 1)(x + 3)(x − 2), by multiplying out two and then the third.' },
  { after: 18, lesson: tutorSurdsLesson as TutorMethodLesson & { number: 18.5 }, title: 'Surds', description: 'Multiply, divide, simplify and add surds, expand brackets with surds, and rationalise the denominator.' },
]

import type { LessonDefinition, MicroSkillId } from '../number-types/types'
import { variantDLesson, variantDMicroSkillLabels } from '../number-types/variant-d/variantDLesson'
import { operationsVariantCLesson, operationsVariantCLabels } from '../order-of-operations/variant-c/variantCLesson'
import { tutorPlaceValueLabels, tutorPlaceValueLesson } from '../place-value/tutor/placeValueLesson'
import { tutorLongMultiplicationLesson } from '../long-multiplication/tutor/longMultiplicationLesson'
import { tutorLongDivisionLesson } from '../long-division/tutor/longDivisionLesson'
import { tutorDecimalsLesson } from '../decimals/tutor/decimalsLesson'
import { tutorFactorsLesson } from '../factors/tutor/factorsLesson'
import { tutorFractionsLesson } from '../fractions/tutor/fractionsLesson'
import { tutorFractionsDecimalsPercentagesLesson } from '../fractions-decimals-percentages/tutor/fractionsDecimalsPercentagesLesson'
import { tutorRoundingLesson } from '../rounding/tutor/roundingLesson'
import { tutorOrderingLesson } from '../ordering/tutor/orderingLesson'

export type MathsLessonNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export type MathsSection = {
  id: MicroSkillId
  title: string
  startStateId: string
  startIndex: number
}

export type MathsLessonEntry = {
  number: MathsLessonNumber
  lessonId: string
  chapterId: 'number'
  title: string
  description: string
  stateCount: number
  sections: MathsSection[]
  /** The lesson itself, for features built from its content (revision cards). */
  definition: LessonDefinition
}

export type MathsChapter = {
  id: 'number'
  title: string
  description: string
  lessons: MathsLessonEntry[]
}

function sectionsFor(lesson: LessonDefinition, labels: Partial<Record<MicroSkillId, string>>): MathsSection[] {
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

function entry(
  number: MathsLessonNumber,
  lesson: LessonDefinition,
  title: string,
  description: string,
  labels: Partial<Record<MicroSkillId, string>>,
): MathsLessonEntry {
  return {
    number,
    lessonId: lesson.id,
    chapterId: 'number',
    title,
    description,
    stateCount: lesson.states.length,
    sections: sectionsFor(lesson, labels),
    definition: lesson,
  }
}

export const mathsLessons: MathsLessonEntry[] = [
  entry(1, variantDLesson, 'Number types', 'Recognise integers, rational and irrational numbers, multiples and factors.', variantDMicroSkillLabels),
  entry(2, operationsVariantCLesson, 'Order of operations', 'Use BIDMAS with numbers, fractions and algebraic expressions.', operationsVariantCLabels),
  entry(3, tutorPlaceValueLesson, 'Place value', 'Read, build and compare whole numbers and decimals.', tutorPlaceValueLabels),
  entry(4, tutorLongMultiplicationLesson, 'Long multiplication', 'Use grid and column methods with accurate carrying.', tutorLongMultiplicationLesson.labels),
  entry(5, tutorLongDivisionLesson, 'Long division', 'Divide accurately, regroup digits and interpret remainders.', tutorLongDivisionLesson.labels),
  entry(6, tutorDecimalsLesson, 'Decimal calculations', 'Add, subtract, multiply and divide decimals.', tutorDecimalsLesson.labels),
  entry(7, tutorFactorsLesson, 'Prime factors, HCF and LCM', 'Use factor trees, lists and Venn diagrams.', tutorFactorsLesson.labels),
  entry(8, tutorFractionsLesson, 'Fractions', 'Simplify, convert and calculate with fractions and mixed numbers.', tutorFractionsLesson.labels),
  entry(9, tutorFractionsDecimalsPercentagesLesson, 'Fractions, decimals and percentages', 'Convert between equivalent fractions, decimals and percentages.', tutorFractionsDecimalsPercentagesLesson.labels),
  entry(10, tutorRoundingLesson, 'Rounding numbers', 'Round to decimal places, significant figures and powers of ten.', tutorRoundingLesson.labels),
  entry(11, tutorOrderingLesson, 'Ordering numbers', 'Compare and order decimals, large numbers, negatives and mixed forms.', tutorOrderingLesson.labels),
]

export const mathsChapters: MathsChapter[] = [{
  id: 'number',
  title: 'Number',
  description: 'Build secure number sense and reliable written calculation methods.',
  lessons: mathsLessons,
}]

export function getMathsLesson(number: MathsLessonNumber) {
  return mathsLessons.find(lesson => lesson.number === number)!
}

export function isMathsLessonNumber(value: number): value is MathsLessonNumber {
  return Number.isInteger(value) && value >= 1 && value <= mathsLessons.length
}

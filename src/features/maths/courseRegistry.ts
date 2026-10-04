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
import { tutorEstimatingLesson } from '../estimating/tutor/estimatingLesson'
import { tutorBoundsLesson } from '../bounds/tutor/boundsLesson'
import { tutorStandardFormLesson } from '../standard-form/tutor/standardFormLesson'
import { tutorLikeTermsLesson } from '../like-terms/tutor/likeTermsLesson'
import { tutorIndicesLesson } from '../indices/tutor/indicesLesson'
import { tutorExpandingLesson } from '../expanding/tutor/expandingLesson'
import { tutorFactorisingLesson } from '../factorising/tutor/factorisingLesson'
import { tutorEquationsLesson } from '../equations/tutor/equationsLesson'
import { tutorRearrangingLesson } from '../rearranging/tutor/rearrangingLesson'
import { tutorQuadraticsLesson } from '../quadratics/tutor/quadraticsLesson'
import { tutorQuadraticEquationsLesson } from '../quadratic-equations/tutor/quadraticEquationsLesson'
import { tutorSequencesLesson } from '../sequences/tutor/sequencesLesson'
import { tutorInequalitiesLesson } from '../inequalities/tutor/inequalitiesLesson'

export type MathsLessonNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24

export type MathsSection = {
  id: MicroSkillId
  title: string
  startStateId: string
  startIndex: number
}

export type MathsChapterId = 'number' | 'algebra'

export type MathsLessonEntry = {
  /** The course-wide number: the URL (?lesson=15) and progress key (L015) use it. */
  number: MathsLessonNumber
  /** The lesson's place in its own chapter, which is what students see: Algebra's first lesson is 1. */
  position: number
  lessonId: string
  chapterId: MathsChapterId
  title: string
  description: string
  stateCount: number
  sections: MathsSection[]
  /** The lesson itself, for features built from its content (revision cards). */
  definition: LessonDefinition
}

export type MathsChapter = {
  id: MathsChapterId
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
  chapterId: MathsChapterId = 'number',
): MathsLessonEntry {
  return {
    number,
    position: 0,
    lessonId: lesson.id,
    chapterId,
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
  entry(12, tutorEstimatingLesson, 'Estimating', 'Round to 1 significant figure and estimate calculations and formulas.', tutorEstimatingLesson.labels),
  entry(13, tutorBoundsLesson, 'Bounds and truncation', 'Find upper and lower bounds, write error intervals and truncate numbers.', tutorBoundsLesson.labels),
  entry(14, tutorStandardFormLesson, 'Standard form', 'Convert to and from standard form, and multiply and divide in standard form.', tutorStandardFormLesson.labels),
  entry(15, tutorLikeTermsLesson, 'Collecting like terms', 'Simplify expressions by collecting terms with the same letters and powers.', tutorLikeTermsLesson.labels, 'algebra'),
  entry(16, tutorIndicesLesson, 'Powers and roots', 'Use the laws of indices, and work out square, cube and other roots.', tutorIndicesLesson.labels, 'algebra'),
  entry(17, tutorExpandingLesson, 'Expanding brackets', 'Expand single and double brackets, and simplify the result.', tutorExpandingLesson.labels, 'algebra'),
  entry(18, tutorFactorisingLesson, 'Factorising', 'Factorise expressions fully by taking out the highest common factor.', tutorFactorisingLesson.labels, 'algebra'),
  entry(19, tutorEquationsLesson, 'Solving equations', 'Solve equations with one unknown, including brackets, fractions, the unknown on both sides and squares.', tutorEquationsLesson.labels, 'algebra'),
  entry(20, tutorRearrangingLesson, 'Rearranging formulae', 'Change the subject of a formula, including formulae with fractions, squares and square roots.', tutorRearrangingLesson.labels, 'algebra'),
  entry(21, tutorQuadraticsLesson, 'Factorising quadratics', 'Factorise quadratics like x² + 8x + 15 into two brackets, including the difference of two squares.', tutorQuadraticsLesson.labels, 'algebra'),
  entry(22, tutorQuadraticEquationsLesson, 'Solving quadratics', 'Solve quadratic equations like x² + x = 20 by making one side 0 and factorising.', tutorQuadraticEquationsLesson.labels, 'algebra'),
  entry(23, tutorSequencesLesson, 'Sequences', 'Continue sequences, find and use the nth term, check whether a number is a term, and solve problems with terms next to each other.', tutorSequencesLesson.labels, 'algebra'),
  entry(24, tutorInequalitiesLesson, 'Inequalities', 'Write inequalities from words and number lines, and show one- and two-sided inequalities on a number line.', tutorInequalitiesLesson.labels, 'algebra'),
]

export const mathsChapters: MathsChapter[] = ([
  { id: 'number', title: 'Number', description: 'Build secure number sense and reliable written calculation methods.' },
  { id: 'algebra', title: 'Algebra', description: 'Use letters for numbers: simplify, expand and solve.' },
] as const).map(chapter => ({ ...chapter, lessons: mathsLessons.filter(entry => entry.chapterId === chapter.id) }))

// Number each lesson within its chapter.
for (const chapter of mathsChapters) chapter.lessons.forEach((entry, i) => { entry.position = i + 1 })

/** A short name for a lesson in a list of every lesson: "14" in Number, "A1" in Algebra. */
export const lessonCode = (entry: MathsLessonEntry) => entry.chapterId === 'number' ? String(entry.position) : `${entry.chapterId[0].toUpperCase()}${entry.position}`

export function getMathsLesson(number: MathsLessonNumber) {
  return mathsLessons.find(lesson => lesson.number === number)!
}

export function isMathsLessonNumber(value: number): value is MathsLessonNumber {
  return Number.isInteger(value) && value >= 1 && value <= mathsLessons.length
}

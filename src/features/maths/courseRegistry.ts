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
import { tutorSolvingInequalitiesLesson } from '../solving-inequalities/tutor/solvingInequalitiesLesson'
import { tutorSimultaneousEquationsLesson } from '../simultaneous-equations/tutor/simultaneousEquationsLesson'
import { tutorProofLesson } from '../proof/tutor/proofLesson'
import { tutorFunctionMachinesLesson } from '../function-machines/tutor/functionMachinesLesson'
import { tutorRatioLesson } from '../ratio/tutor/ratioLesson'
import { tutorRatioBasicsLesson } from '../ratio/tutor/ratioBasicsLesson'
import { tutorUnitsLesson } from '../ratio/tutor/unitsLesson'
import { tutorBestBuysLesson } from '../ratio/tutor/bestBuysLesson'
import { tutorMeasuresLesson } from '../ratio/tutor/measuresLesson'
import { tutorProportionLesson } from '../ratio/tutor/proportionLesson'
import { tutorPercentLesson } from '../ratio/tutor/percentLesson'
import { tutorReversePercentLesson } from '../ratio/tutor/reversePercentLesson'
import { tutorInterestLesson } from '../ratio/tutor/interestLesson'
import { tutorNegativesLesson } from '../negatives/tutor/negativesLesson'
import { tutorSubstitutionLesson } from '../substitution/tutor/substitutionLesson'
import { sectionsFor, type MathsSection } from './sections'
import { graphsChapter, graphsLessons, type GraphsLessonNumber } from '../graphs/graphsLessons'
import { geometryChapter, geometryLessons, type GeometryLessonNumber } from '../geometry/geometryLessons'
import { probabilityChapter, probabilityLessons, type ProbabilityLessonNumber } from '../probability/probabilityLessons'

export { sectionsFor, type MathsSection }

export type MathsLessonNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40
  | GraphsLessonNumber | GeometryLessonNumber | ProbabilityLessonNumber
  /** Higher-only lessons (higher/lessons.ts): only Higher students get them (tier.ts). */
  | 2.5 | 11.5 | 16.5 | 17.5 | 18.5

export type MathsChapterId = 'number' | 'algebra' | 'ratio' | 'graphs' | 'geometry' | 'probability'

export type MathsLessonEntry<N extends number = MathsLessonNumber, C extends string = MathsChapterId> = {
  /** The course-wide number: the URL (?lesson=15) and progress key (L015) use it. */
  number: N
  /** The lesson's place in its own chapter, which is what students see: Algebra's first lesson is 1. */
  position: number
  lessonId: string
  chapterId: C
  title: string
  description: string
  stateCount: number
  sections: MathsSection[]
  /** The lesson itself, for features built from its content (revision cards). */
  definition: LessonDefinition
  /** A Higher-only lesson (tier.ts), shown with the H tile and its `label` ("11H") in place of its position. */
  higherOnly?: boolean
  label?: string
}

export type MathsChapter<N extends number = MathsLessonNumber, C extends string = MathsChapterId> = {
  id: C
  title: string
  description: string
  lessons: MathsLessonEntry<N, C>[]
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
  // Lesson 35 is written for Revily (not in the book): AQA N2, calculating with negatives, after ordering them (Sunny, 11 Oct).
  entry(35, tutorNegativesLesson, 'Negative numbers', 'Add, subtract, multiply and divide with negative numbers, and use them for temperatures, money and floors.', tutorNegativesLesson.labels),
  entry(12, tutorEstimatingLesson, 'Estimating', 'Round to 1 significant figure and estimate calculations and formulas.', tutorEstimatingLesson.labels),
  entry(13, tutorBoundsLesson, 'Bounds and truncation', 'Find upper and lower bounds, write error intervals and truncate numbers.', tutorBoundsLesson.labels),
  entry(14, tutorStandardFormLesson, 'Standard form', 'Convert to and from standard form, and multiply and divide in standard form.', tutorStandardFormLesson.labels),
  entry(15, tutorLikeTermsLesson, 'Collecting like terms', 'Simplify expressions by collecting terms with the same letters and powers.', tutorLikeTermsLesson.labels, 'algebra'),
  // Lesson 36 is written for Revily (not in the book): AQA A2, substitution, straight after collecting like terms (Sunny, 11 Oct).
  entry(36, tutorSubstitutionLesson, 'Substitution', 'Put numbers into expressions and formulae, including negative numbers and powers, and work them out with BIDMAS.', tutorSubstitutionLesson.labels, 'algebra'),
  entry(16, tutorIndicesLesson, 'Powers and roots', 'Use the laws of indices, and work out square, cube and other roots.', tutorIndicesLesson.labels, 'algebra'),
  entry(17, tutorExpandingLesson, 'Expanding brackets', 'Expand single and double brackets, and simplify the result.', tutorExpandingLesson.labels, 'algebra'),
  entry(18, tutorFactorisingLesson, 'Factorising', 'Factorise expressions fully by taking out the highest common factor.', tutorFactorisingLesson.labels, 'algebra'),
  entry(19, tutorEquationsLesson, 'Solving equations', 'Solve equations with one unknown, including brackets, fractions, the unknown on both sides and squares.', tutorEquationsLesson.labels, 'algebra'),
  entry(20, tutorRearrangingLesson, 'Rearranging formulae', 'Change the subject of a formula, including formulae with fractions, squares and square roots.', tutorRearrangingLesson.labels, 'algebra'),
  entry(21, tutorQuadraticsLesson, 'Factorising quadratics', 'Factorise quadratics like x² + 8x + 15 into two brackets, including the difference of two squares.', tutorQuadraticsLesson.labels, 'algebra'),
  entry(22, tutorQuadraticEquationsLesson, 'Solving quadratics', 'Solve quadratic equations like x² + x = 20 by making one side 0 and factorising.', tutorQuadraticEquationsLesson.labels, 'algebra'),
  entry(23, tutorSequencesLesson, 'Sequences', 'Continue sequences, find and use the nth term, check whether a number is a term, and solve problems with terms next to each other.', tutorSequencesLesson.labels, 'algebra'),
  entry(24, tutorInequalitiesLesson, 'Inequalities', 'Write inequalities from words and number lines, and show one- and two-sided inequalities on a number line.', tutorInequalitiesLesson.labels, 'algebra'),
  entry(25, tutorSolvingInequalitiesLesson, 'Solving inequalities', 'List the integers in an inequality, solve inequalities like 4a − 5 > a + 7 and 3 < 2x + 1 < 11, and flip the sign when dividing by a negative.', tutorSolvingInequalitiesLesson.labels, 'algebra'),
  entry(27, tutorSimultaneousEquationsLesson, 'Simultaneous equations', 'Solve two equations at once, like 3x + 2y = 16 and x + 2y = 8, by making one letter disappear, and write them from a problem in words.', tutorSimultaneousEquationsLesson.labels, 'algebra'),
  entry(28, tutorProofLesson, 'Proof', 'Disprove a claim with one counterexample, show two expressions are identical, prove angle facts, and prove facts about odd and even numbers with algebra.', tutorProofLesson.labels, 'algebra'),
  entry(29, tutorFunctionMachinesLesson, 'Function machines', 'Put a number through a function machine, work backwards from the output to the input, and turn an equation like y = 3x + 4 into a machine.', tutorFunctionMachinesLesson.labels, 'algebra'),
  // Lesson 37 is the book's R1.1-R1.5, made for Revily because only R1.6-R1.8 came in the pack (Sunny, 11 Oct). It opens Ratio.
  entry(37, tutorRatioBasicsLesson, 'Ratios', 'Write a ratio as a fraction, simplify it, scale it up, switch between part to part and part to whole, and share an amount in a ratio.', tutorRatioBasicsLesson.labels, 'ratio'),
  entry(30, tutorRatioLesson, 'Ratio problems', 'Find a share from the difference between two parts, solve a ratio that changes, and write a ratio in the form 1 : n.', tutorRatioLesson.labels, 'ratio'),
  entry(31, tutorProportionLesson, 'Direct and inverse proportion', 'Scale an amount up or down with direct proportion, and work out how long a job takes with inverse proportion, by finding 1 first.', tutorProportionLesson.labels, 'ratio'),
  entry(32, tutorPercentLesson, 'Percentages', 'Find a percentage of an amount from 10%, 5% and 1%, increase or decrease by a percentage, and work out a percentage change.', tutorPercentLesson.labels, 'ratio'),
  entry(33, tutorReversePercentLesson, 'Reverse percentages', 'Find the original amount before a percentage rise or fall: find 1% and multiply by 100, or divide by the multiplier.', tutorReversePercentLesson.labels, 'ratio'),
  entry(34, tutorInterestLesson, 'Interest, growth and decay', 'Work out simple interest, compound growth and decay with a multiplier, and find how many years it takes to pass a target.', tutorInterestLesson.labels, 'ratio'),
  // Lesson 38 is the book's R6, made for Revily: no source files came for R6-R11 (Sunny, 11 Oct). R7 is taught in Real-life graphs.
  entry(38, tutorUnitsLesson, 'Converting units', 'Convert metric units, area and volume units, imperial units and money with a rate, time in hours and minutes, and speeds like km/h to m/s.', tutorUnitsLesson.labels, 'ratio'),
  // Lessons 39 and 40 are the book's R8 and R9-R11, made for Revily the same way (Sunny, 11 Oct).
  entry(39, tutorBestBuysLesson, 'Best buys', 'Compare value for money by finding the cost of the same amount of each, including offers like 3 for 2 and extra free.', tutorBestBuysLesson.labels, 'ratio'),
  entry(40, tutorMeasuresLesson, 'Compound measures', 'Use density, speed and pressure with their formula triangles, changing units like kg to g and minutes to hours first.', tutorMeasuresLesson.labels, 'ratio'),
  // The chapters after Ratio, built on their own shelves first and now on the course (Sunny, 11 Oct).
  ...graphsLessons, ...geometryLessons, ...probabilityLessons,
]

export const mathsChapters: MathsChapter[] = ([
  { id: 'number', title: 'Number', description: 'Build secure number sense and reliable written calculation methods.' },
  { id: 'algebra', title: 'Algebra', description: 'Use letters for numbers: simplify, expand and solve.' },
  { id: 'ratio', title: 'Ratio and proportion', description: 'Share, compare and scale amounts with ratios.' },
  graphsChapter, geometryChapter, probabilityChapter,
] as const).map(chapter => ({ ...chapter, lessons: mathsLessons.filter(entry => entry.chapterId === chapter.id) }))

// Number each lesson within its chapter.
for (const chapter of mathsChapters) chapter.lessons.forEach((entry, i) => { entry.position = i + 1 })

const CHAPTER_CODES: Record<MathsChapterId, string> = { number: '', algebra: 'A', ratio: 'R', graphs: 'GR', geometry: 'GM', probability: 'P' }

/** A short name for a lesson in a list of every lesson: "14" in Number, "A1" in Algebra, "GR1" in Graphs. */
export const lessonCode = (entry: MathsLessonEntry) => `${CHAPTER_CODES[entry.chapterId]}${entry.position}`

export function getMathsLesson(number: MathsLessonNumber) {
  return mathsLessons.find(lesson => lesson.number === number)!
}

export function isMathsLessonNumber(value: number): value is MathsLessonNumber {
  return Number.isInteger(value) && mathsLessons.some(entry => entry.number === value)
}

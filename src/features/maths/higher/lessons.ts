/*
 * Higher-only Maths lessons: whole lessons only Higher students get (Higher sections inside a Foundation lesson are in
 * additions.ts). Numbering follows Science: a Higher-only lesson after Lesson N has `number: N + 0.5`, so it can never
 * clash with a Foundation number, and is labelled with N's place in its chapter plus H ("11H"), which is what students
 * see (with the H tile) and what the address carries: /preview?lesson=11H. A second Higher-only lesson after the same
 * lesson is N + 0.6 and labelled "9H2".
 */
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { tutorBidmasAlgebraLesson } from './bidmasAlgebraLesson'
import { tutorRecurringLesson } from './recurringLesson'
import { tutorIndicesHigherLesson } from './indicesLesson'
import { tutorTripleBracketsLesson } from './tripleBracketsLesson'
import { tutorSurdsLesson } from './surdsLesson'
import { tutorAlgebraicFractionsLesson } from './algebraicFractionsLesson'
import { tutorQuadraticFormulaLesson } from './quadraticFormulaLesson'
import { tutorCompletingSquareLesson } from './completingSquareLesson'
import { tutorIterativeLesson } from './iterativeLesson'
import { tutorFunctionsLesson } from './functionsLesson'
import { tutorCircleGraphsLesson } from './circleGraphsLesson'
import { tutorTurningPointsLesson } from './turningPointsLesson'
import { tutorGraphTransformationsLesson } from './graphTransformationsLesson'
import { tutorTrigGraphsLesson } from './trigGraphsLesson'
import { tutorVelocityTimeLesson } from './velocityTimeLesson'
import { tutorCircleTheoremsLesson } from './circleTheoremsLesson'
import { tutorInvariantPointsLesson } from './invariantPointsLesson'
import { tutorFrustumsLesson } from './frustumsLesson'

type HigherLessonNumber = 2.5 | 11.5 | 16.5 | 17.5 | 18.5 | 21.5 | 22.5 | 22.6 | 25.5 | 29.5 | 104.5 | 106.5 | 106.6 | 106.7 | 108.5 | 208.5 | 212.5 | 215.5

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
  // A15 Algebraic fractions needs factorising quadratics (Key Skill 2), so it follows Factorising quadratics. A13 The
  // quadratic formula and A14 Completing the square follow Solving quadratics, as in the book: 9H, then 9H2.
  { after: 21, lesson: tutorAlgebraicFractionsLesson as TutorMethodLesson & { number: 21.5 }, title: 'Algebraic fractions', description: 'Simplify algebraic fractions by cancelling, factorise first to cancel brackets, and multiply, divide, add and subtract them.' },
  { after: 22, lesson: tutorQuadraticFormulaLesson as TutorMethodLesson & { number: 22.5 }, title: 'The quadratic formula', description: 'Solve any quadratic with the formula, giving answers to decimal places, significant figures or in surd form.' },
  { after: 22, lesson: tutorCompletingSquareLesson as TutorMethodLesson & { number: 22.6 }, title: 'Completing the square', description: 'Write a quadratic as a(x + d)² + e, find its turning point, and solve an equation by completing the square.' },
  // A22 Iterative methods, after Solving inequalities (A18 to A21 come before it in the book).
  { after: 25, lesson: tutorIterativeLesson as TutorMethodLesson & { number: 25.5 }, title: 'Iterative methods', description: 'Find a solution by trial and improvement, use an iteration formula with the ANS key, and rearrange an equation into one.' },
  // A26 Functions follows A25 Function machines, as in the book: 15H.
  { after: 29, lesson: tutorFunctionsLesson as TutorMethodLesson & { number: 29.5 }, title: 'Functions', description: 'Use function notation like f(x) = 3x + 1: work out f(10), combine two functions into fg(x), and find an inverse function f⁻¹(x).' },
  // Graphs. GR8 Circle graphs uses perpendicular gradients for a tangent, so it follows Parallel lines (with its Higher
  // section on perpendicular lines), and comes before Simultaneous equations by graph, which then solves a line and a
  // circle. GR7 Turning points, GR10 Graph transformations and GR11 Sin, cos and tan graphs follow Quadratic and cubic
  // graphs (with its Higher section on reciprocal and exponential graphs): 6H, 6H2 and 6H3. Their addresses are GR4H and
  // GR6H to GR6H3 (tier.ts).
  { after: 104, lesson: tutorCircleGraphsLesson as TutorMethodLesson & { number: 104.5 }, title: 'Circle graphs and tangents', description: 'Read a circle’s radius from x² + y² = r², write its equation, and find the equation of a tangent to it.' },
  { after: 106, lesson: tutorTurningPointsLesson as TutorMethodLesson & { number: 106.5 }, title: 'Turning points', description: 'Find the turning point of a quadratic graph, halfway between its roots or by completing the square.' },
  { after: 106, lesson: tutorGraphTransformationsLesson as TutorMethodLesson & { number: 106.6 }, title: 'Graph transformations', description: 'Move a graph with f(x + a) and f(x) + b, and reflect it with f(−x) and −f(x).' },
  { after: 106, lesson: tutorTrigGraphsLesson as TutorMethodLesson & { number: 106.7 }, title: 'Sin, cos and tan graphs', description: 'Sketch the graphs of sin x, cos x and tan x: their peaks, where they cross the axis, how often they repeat, and tan’s asymptotes.' },
  // GR13 Velocity-time graphs and GR14 Area under a curve follow Real-life graphs (with its Higher section on rates on
  // a curve, GR15), which teaches the gradient as a rate and the tangent first: 8H, address GR8H.
  { after: 108, lesson: tutorVelocityTimeLesson as TutorMethodLesson & { number: 108.5 }, title: 'Velocity–time graphs', description: 'Find acceleration from the gradient and distance from the area under a velocity–time graph, and estimate both on a curve with a tangent or strips.' },
  // GM9 The 8 circle theorems follows Perimeter and comes before Sectors and arcs, as in the book: 8H, address GM8H.
  { after: 208, lesson: tutorCircleTheoremsLesson as TutorMethodLesson & { number: 208.5 }, title: 'Circle theorems', description: 'Use the 8 circle theorems, chords and tangents to find missing angles and lengths, naming the rule at every step.' },
  // GM14 Invariant points follows The four transformations (12H, address GM12H), and GM18 Frustums follows Surface area
  // (GM16 Volume and GM17 Surface area come first in the book): 15H, address GM15H.
  { after: 212, lesson: tutorInvariantPointsLesson as TutorMethodLesson & { number: 212.5 }, title: 'Invariant points', description: 'Find the points that stay in the same place after a reflection, rotation, enlargement or two transformations in a row.' },
  { after: 215, lesson: tutorFrustumsLesson as TutorMethodLesson & { number: 215.5 }, title: 'Frustums', description: 'Find the volume and surface area of a cone or pyramid with its top cut off, using the similar piece that was removed.' },
]

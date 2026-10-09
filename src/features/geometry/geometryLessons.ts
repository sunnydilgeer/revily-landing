import type { MicroSkillId } from '../number-types/types'
import type { TutorMethodLesson } from '../written-methods/tutor/model'
import { sectionsFor, type MathsChapter, type MathsLessonEntry } from '../maths/courseRegistry'
import { tutorAngleFactsLesson } from '../angle-facts/tutor/angleFactsLesson'
import { tutorParallelAnglesLesson } from '../parallel-angles/tutor/parallelAnglesLesson'
import { tutorShapesLesson } from '../shapes/tutor/shapesLesson'
import { tutorPolygonAnglesLesson } from '../polygon-angles/tutor/polygonAnglesLesson'
import { tutorSymmetryLesson } from '../symmetry/tutor/symmetryLesson'
import { tutorAreasLesson } from '../areas/tutor/areasLesson'
import { tutorCirclesLesson } from '../circles/tutor/circlesLesson'
import { tutorPerimeterLesson } from '../perimeter/tutor/perimeterLesson'
import { tutorSectorsLesson } from '../sectors/tutor/sectorsLesson'

/*
 * The hidden Geometry shelf, built like the Graphs one (../graphs/graphsLessons.ts): the geometry lessons with the
 * course's own lesson page and Contents drawer, but kept off the course. Only the unlisted page in
 * app/preview/<GEOMETRY_SHELF_ID> reads this file. Nothing the course shows imports it (the course registry, App.tsx,
 * the curriculum, search, cards, exam checklist, practice), so the lessons aren't in any list or in the code those
 * pages load. The page is noindexed and sits behind the preview password. Lessons follow the book's order (Sunny, 9 Oct).
 */
export const GEOMETRY_SHELF_ID = 'geometry-598a5fb6df99'

export type GeometryLessonNumber = 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209

function entry(lesson: TutorMethodLesson & { number: GeometryLessonNumber }, title: string, description: string): MathsLessonEntry<GeometryLessonNumber, 'geometry'> {
  return {
    number: lesson.number, position: lesson.number - 200, lessonId: lesson.id, chapterId: 'geometry', title, description,
    stateCount: lesson.states.length, sections: sectionsFor(lesson, lesson.labels as Partial<Record<MicroSkillId, string>>), definition: lesson,
  }
}

export const geometryLessons = [
  entry(tutorAngleFactsLesson as TutorMethodLesson & { number: 201 }, 'Angle facts', 'Missing angles on a straight line, around a point, in triangles, quadrilaterals and isosceles triangles, with the reason.'),
  entry(tutorParallelAnglesLesson as TutorMethodLesson & { number: 202 }, 'Angles in parallel lines', 'Vertically opposite, corresponding (F), alternate (Z) and allied (C) angles, naming the rule at each step.'),
  entry(tutorShapesLesson as TutorMethodLesson & { number: 203 }, '2D shapes', 'Polygon names and regular shapes, the four triangles, the six quadrilaterals, and using a property to find an angle.'),
  entry(tutorPolygonAnglesLesson as TutorMethodLesson & { number: 204 }, 'Interior and exterior angles', 'Exterior angles add to 360°, interior angles to (n − 2) × 180°: regular polygons, missing angles and algebra.'),
  entry(tutorSymmetryLesson as TutorMethodLesson & { number: 205 }, 'Symmetry', 'Lines of symmetry and order of rotational symmetry, found by folding and turning shapes on the board.'),
  entry(tutorAreasLesson as TutorMethodLesson & { number: 206 }, 'Areas of shapes', 'Rectangles, parallelograms, triangles and trapeziums, and working back from an area to a length.'),
  entry(tutorCirclesLesson as TutorMethodLesson & { number: 207 }, 'Circles', 'The parts of a circle, circumference and area in terms of π or rounded, and working back to the radius.'),
  entry(tutorPerimeterLesson as TutorMethodLesson & { number: 208 }, 'Perimeter', 'Simple, compound and curved shapes, with missing sides from subtraction, Pythagoras or algebra.'),
  entry(tutorSectorsLesson as TutorMethodLesson & { number: 209 }, 'Sectors and arcs', 'A sector as a fraction of its circle: its area, arc length and perimeter.'),
]

export const geometryChapter: MathsChapter<GeometryLessonNumber, 'geometry'> = {
  id: 'geometry', title: 'Geometry', description: 'Angle facts, parallel lines, 2D shapes, polygon angles, symmetry, area, circles, perimeter, and sectors and arcs.', lessons: geometryLessons,
}

export const lessonFor = (number: GeometryLessonNumber) => ({ 201: tutorAngleFactsLesson, 202: tutorParallelAnglesLesson, 203: tutorShapesLesson, 204: tutorPolygonAnglesLesson, 205: tutorSymmetryLesson, 206: tutorAreasLesson, 207: tutorCirclesLesson, 208: tutorPerimeterLesson, 209: tutorSectorsLesson })[number]
export const isGeometryLessonNumber = (value: number): value is GeometryLessonNumber => geometryLessons.some(item => item.number === value)

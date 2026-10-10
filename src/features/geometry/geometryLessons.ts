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
import { tutorCongruenceLesson } from '../congruence/tutor/congruenceLesson'
import { tutorSimilarityLesson } from '../similarity/tutor/similarityLesson'
import { tutorTransformationsLesson } from '../transformations/tutor/transformationsLesson'
import { tutorSolidsLesson } from '../solids/tutor/solidsLesson'
import { tutorVolumeLesson } from '../volume/tutor/volumeLesson'
import { tutorSurfacesLesson } from '../surfaces/tutor/surfacesLesson'
import { tutorProjectionsLesson } from '../projections/tutor/projectionsLesson'
import { tutorLociLesson } from '../loci/tutor/lociLesson'
import { tutorBearingsLesson } from '../bearings/tutor/bearingsLesson'

/*
 * The hidden Geometry shelf, built like the Graphs one (../graphs/graphsLessons.ts): the geometry lessons with the
 * course's own lesson page and Contents drawer, but kept off the course. Only the unlisted page in
 * app/preview/<GEOMETRY_SHELF_ID> reads this file. Nothing the course shows imports it (the course registry, App.tsx,
 * the curriculum, search, cards, exam checklist, practice), so the lessons aren't in any list or in the code those
 * pages load. The page is noindexed and sits behind the preview password. Lessons follow the book's order (Sunny, 9 Oct).
 */
export const GEOMETRY_SHELF_ID = 'geometry-598a5fb6df99'

export type GeometryLessonNumber = 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 | 211 | 212 | 213 | 214 | 215 | 216 | 217 | 218

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
  entry(tutorCongruenceLesson as TutorMethodLesson & { number: 210 }, 'Congruent shapes', 'Shapes the same size and shape, even turned or flipped: spotting pairs and using them to find missing sides and angles.'),
  entry(tutorSimilarityLesson as TutorMethodLesson & { number: 211 }, 'Similar shapes', 'Enlarged copies with equal angles: the scale factor, and missing lengths on the bigger or smaller shape.'),
  entry(tutorTransformationsLesson as TutorMethodLesson & { number: 212 }, 'The four transformations', 'Translation by a vector, reflection in a line, rotation about a point, and enlargement by a scale factor.'),
  entry(tutorSolidsLesson as TutorMethodLesson & { number: 213 }, '3D shapes', 'Naming 3D shapes and counting their faces, edges and vertices, flat-faced and curved.'),
  entry(tutorVolumeLesson as TutorMethodLesson & { number: 214 }, 'Volume of 3D shapes', 'Prisms and cylinders, pyramids and cones, spheres and shapes made of them.'),
  entry(tutorSurfacesLesson as TutorMethodLesson & { number: 215 }, 'Surface area', 'The total area of every face: cuboids and prisms, cylinders, cones, spheres and pyramids.'),
  entry(tutorProjectionsLesson as TutorMethodLesson & { number: 216 }, 'Plans and elevations', 'A 3D shape seen from above, the front and the side, and building it back from those views.'),
  entry(tutorLociLesson as TutorMethodLesson & { number: 217 }, 'Loci and constructions', 'Points a fixed distance away, perpendicular and angle bisectors, and shading a region.'),
  entry(tutorBearingsLesson as TutorMethodLesson & { number: 218 }, 'Bearings', 'Three-figure bearings clockwise from North, bearings back the other way, and scale drawings.'),
]

export const geometryChapter: MathsChapter<GeometryLessonNumber, 'geometry'> = {
  id: 'geometry', title: 'Geometry', description: 'Angles, 2D shapes, symmetry, area, circles and perimeter; congruent and similar shapes, transformations, 3D shapes, volume and surface area, plans and elevations, loci and bearings.', lessons: geometryLessons,
}

export const lessonFor = (number: GeometryLessonNumber) => ({ 201: tutorAngleFactsLesson, 202: tutorParallelAnglesLesson, 203: tutorShapesLesson, 204: tutorPolygonAnglesLesson, 205: tutorSymmetryLesson, 206: tutorAreasLesson, 207: tutorCirclesLesson, 208: tutorPerimeterLesson, 209: tutorSectorsLesson, 210: tutorCongruenceLesson, 211: tutorSimilarityLesson, 212: tutorTransformationsLesson, 213: tutorSolidsLesson, 214: tutorVolumeLesson, 215: tutorSurfacesLesson, 216: tutorProjectionsLesson, 217: tutorLociLesson, 218: tutorBearingsLesson })[number]
export const isGeometryLessonNumber = (value: number): value is GeometryLessonNumber => geometryLessons.some(item => item.number === value)

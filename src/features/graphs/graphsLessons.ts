import type { MicroSkillId } from '../number-types/types'
import type { TutorMethodLesson } from '../written-methods/tutor/model'
import { sectionsFor, type MathsChapter, type MathsLessonEntry } from '../maths/courseRegistry'
import { tutorCoordinatesLesson } from '../coordinates/tutor/coordinatesLesson'
import { tutorLinesLesson } from '../lines/tutor/linesLesson'
import { tutorGradientLesson } from '../gradient/tutor/gradientLesson'
import { tutorParallelLinesLesson } from '../parallel-lines/tutor/parallelLinesLesson'
import { tutorSimultaneousGraphsLesson } from '../simultaneous-graphs/tutor/simultaneousGraphsLesson'
import { tutorCurveGraphsLesson } from '../curve-graphs/tutor/curveGraphsLesson'

/*
 * The hidden Graphs shelf: the graphs lessons with the course's own lesson page and Contents drawer, but kept off the
 * course. Only the unlisted page in app/preview/<GRAPHS_SHELF_ID> reads this file. Nothing the course shows imports it
 * (the course registry, App.tsx, the curriculum, search, cards, exam checklist, practice), so the lessons aren't in
 * any list or in the code those pages load. The page is noindexed and sits behind the preview password.
 */
export const GRAPHS_SHELF_ID = 'graphs-fb7c95e1c045'

export type GraphsLessonNumber = 101 | 102 | 103 | 104 | 105 | 106

function entry(lesson: TutorMethodLesson & { number: GraphsLessonNumber }, title: string, description: string): MathsLessonEntry<GraphsLessonNumber, 'graphs'> {
  return {
    number: lesson.number, position: lesson.number - 100, lessonId: lesson.id, chapterId: 'graphs', title, description,
    stateCount: lesson.states.length, sections: sectionsFor(lesson, lesson.labels as Partial<Record<MicroSkillId, string>>), definition: lesson,
  }
}

export const graphsLessons = [
  entry(tutorCoordinatesLesson as TutorMethodLesson & { number: 101 }, 'Coordinates', 'Plot and read points: across, then up, in all four quadrants, and find a midpoint.'),
  entry(tutorLinesLesson as TutorMethodLesson & { number: 102 }, 'Lines from coordinates', 'Lines like x = 3 and y = −2, tables of values, and plotting a straight line graph.'),
  entry(tutorGradientLesson as TutorMethodLesson & { number: 103 }, 'Gradient and y = mx + c', 'Find a gradient from a graph or two points, and a line’s equation y = mx + c.'),
  entry(tutorParallelLinesLesson as TutorMethodLesson & { number: 104 }, 'Parallel lines', 'Parallel lines have the same gradient: compare them, and find one through a point.'),
  entry(tutorSimultaneousGraphsLesson as TutorMethodLesson & { number: 105 }, 'Simultaneous equations by graph', 'Draw both lines and read where they cross: the x and y that solve both.'),
  entry(tutorCurveGraphsLesson as TutorMethodLesson & { number: 106 }, 'Quadratic and cubic graphs', 'Tables for x² and x³, plotting a smooth curve, and the U, ∩ and S shapes.'),
]

export const graphsChapter: MathsChapter<GraphsLessonNumber, 'graphs'> = {
  id: 'graphs', title: 'Graphs', description: 'Coordinates, straight lines, gradient, parallel lines, solving by graph, and curves.', lessons: graphsLessons,
}

export const lessonFor = (number: GraphsLessonNumber) => ({ 101: tutorCoordinatesLesson, 102: tutorLinesLesson, 103: tutorGradientLesson, 104: tutorParallelLinesLesson, 105: tutorSimultaneousGraphsLesson, 106: tutorCurveGraphsLesson })[number]
export const isGraphsLessonNumber = (value: number): value is GraphsLessonNumber => graphsLessons.some(item => item.number === value)

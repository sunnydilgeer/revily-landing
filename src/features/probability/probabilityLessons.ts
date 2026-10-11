import type { MicroSkillId } from '../number-types/types'
import type { TutorMethodLesson } from '../written-methods/tutor/model'
import type { MathsChapter, MathsLessonEntry } from '../maths/courseRegistry'
import { sectionsFor } from '../maths/sections'
import { tutorProbabilityLesson } from './tutor/probabilityLesson'
import { tutorFrequencyTreesLesson } from './tutor/frequencyTreesLesson'
import { tutorTreeDiagramsLesson } from './tutor/treeDiagramsLesson'
import { tutorRelativeFrequencyLesson } from './tutor/relativeFrequencyLesson'
import { tutorVennLesson } from './tutor/vennLesson'
import { tutorSetNotationLesson } from './tutor/setNotationLesson'
import { tutorDataTypesLesson } from './tutor/dataTypesLesson'
import { tutorAveragesLesson } from './tutor/averagesLesson'
import { tutorSamplingLesson } from './tutor/samplingLesson'

/*
 * The Probability and statistics chapter: P1 onwards from Sunny's revision book (p162 on), lessons 301 onwards in the
 * book's order. They were built on an unlisted shelf first, like Geometry (../geometry/geometryLessons.ts); now the course
 * registry (../maths/courseRegistry.ts) lists them last (Sunny, 11 Oct). The old shelf address,
 * app/preview/<PROBABILITY_SHELF_ID>, sends you to the same lesson on the course.
 */
export const PROBABILITY_SHELF_ID = 'probability-1df7422723d4'

export type ProbabilityLessonNumber = 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | 309

function entry(lesson: TutorMethodLesson & { number: ProbabilityLessonNumber }, title: string, description: string): MathsLessonEntry<ProbabilityLessonNumber, 'probability'> {
  return {
    number: lesson.number, position: lesson.number - 300, lessonId: lesson.id, chapterId: 'probability', title, description,
    stateCount: lesson.states.length, sections: sectionsFor(lesson, lesson.labels as Partial<Record<MicroSkillId, string>>), definition: lesson,
  }
}

export const probabilityLessons = [
  entry(tutorProbabilityLesson as TutorMethodLesson & { number: 301 }, 'Probability', 'The probability scale, equally likely outcomes, probabilities that add up to 1, and listing outcomes.'),
  entry(tutorFrequencyTreesLesson as TutorMethodLesson & { number: 302 }, 'Frequency trees', 'Filling in a frequency tree from the facts given, and reading probabilities from it.'),
  entry(tutorTreeDiagramsLesson as TutorMethodLesson & { number: 303 }, 'Probability and tree diagrams', 'The AND and OR rules, and probability trees for two events.'),
  entry(tutorRelativeFrequencyLesson as TutorMethodLesson & { number: 304 }, 'Relative frequency', 'Probability from an experiment, expected frequency, spotting bias, and why more trials are better.'),
  entry(tutorVennLesson as TutorMethodLesson & { number: 305 }, 'Venn diagrams', 'Sorting into two or three overlapping sets, and finding probabilities from a Venn diagram.'),
  entry(tutorSetNotationLesson as TutorMethodLesson & { number: 306 }, 'Set notation', 'ξ, A′, A ∩ B and A ∪ B, shading regions, and writing inequalities as sets.'),
  entry(tutorDataTypesLesson as TutorMethodLesson & { number: 307 }, 'Types of data', 'Qualitative or quantitative, discrete or continuous, and primary or secondary data.'),
  entry(tutorAveragesLesson as TutorMethodLesson & { number: 308 }, 'Mean, median, mode and range', 'The three averages and the range, outliers, and working back from a mean.'),
  entry(tutorSamplingLesson as TutorMethodLesson & { number: 309 }, 'Sampling and questionnaires', 'Samples and bias, and spotting and fixing a poor questionnaire.'),
]

export const probabilityChapter: MathsChapter<ProbabilityLessonNumber, 'probability'> = {
  id: 'probability', title: 'Probability and statistics', description: 'Probability, frequency and tree diagrams, relative frequency, Venn diagrams and set notation; types of data, averages, sampling and questionnaires.', lessons: probabilityLessons,
}

export const lessonFor = (number: ProbabilityLessonNumber) => ({ 301: tutorProbabilityLesson, 302: tutorFrequencyTreesLesson, 303: tutorTreeDiagramsLesson, 304: tutorRelativeFrequencyLesson, 305: tutorVennLesson, 306: tutorSetNotationLesson, 307: tutorDataTypesLesson, 308: tutorAveragesLesson, 309: tutorSamplingLesson })[number]
export const isProbabilityLessonNumber = (value: number): value is ProbabilityLessonNumber => probabilityLessons.some(item => item.number === value)

import type { MicroSkillId } from '../number-types/types'
import type { TutorMethodLesson } from '../written-methods/tutor/model'
import { sectionsFor, type MathsChapter, type MathsLessonEntry } from '../maths/courseRegistry'
import { tutorProbabilityLesson } from './tutor/probabilityLesson'
import { tutorFrequencyTreesLesson } from './tutor/frequencyTreesLesson'
import { tutorTreeDiagramsLesson } from './tutor/treeDiagramsLesson'
import { tutorRelativeFrequencyLesson } from './tutor/relativeFrequencyLesson'
import { tutorVennLesson } from './tutor/vennLesson'
import { tutorSetNotationLesson } from './tutor/setNotationLesson'
import { tutorDataTypesLesson } from './tutor/dataTypesLesson'
import { tutorAveragesLesson } from './tutor/averagesLesson'
import { tutorSamplingLesson } from './tutor/samplingLesson'
import { tutorPictogramsLesson } from './tutor/pictogramsLesson'
import { tutorStemLeafLesson } from './tutor/stemLeafLesson'
import { tutorFrequencyTablesLesson } from './tutor/frequencyTablesLesson'
import { tutorGroupedFrequencyLesson } from './tutor/groupedFrequencyLesson'
import { tutorEstimatingMeanLesson } from './tutor/estimatingMeanLesson'
import { tutorBarChartsLesson } from './tutor/barChartsLesson'
import { tutorScatterGraphsLesson } from './tutor/scatterGraphsLesson'
import { tutorLineGraphsLesson } from './tutor/lineGraphsLesson'
import { tutorPieChartsLesson } from './tutor/pieChartsLesson'

/*
 * The hidden Probability and statistics shelf, built like the Geometry one (../geometry/geometryLessons.ts): P1 to P18
 * from Sunny's revision book (p162–218), with the course's own lesson page and Contents drawer, but kept off the
 * course. Only the unlisted page in app/preview/<PROBABILITY_SHELF_ID> reads this file. Nothing the course shows
 * imports it (the course registry, App.tsx, the curriculum, search, cards, exam checklist, practice), so the lessons
 * aren't in any list or in the code those pages load. The page is noindexed and sits behind the preview password.
 * Lessons follow the book's order.
 */
export const PROBABILITY_SHELF_ID = 'probability-1df7422723d4'

export type ProbabilityLessonNumber = 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | 309 | 310 | 311 | 312 | 313 | 314 | 315 | 316 | 317 | 318

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
  entry(tutorPictogramsLesson as TutorMethodLesson & { number: 310 }, 'Pictograms', 'Reading and drawing pictograms with a key, including parts of a picture.'),
  entry(tutorStemLeafLesson as TutorMethodLesson & { number: 311 }, 'Stem and leaf diagrams', 'Drawing an ordered stem and leaf diagram with a key, reading averages and range from one, and back-to-back diagrams.'),
  entry(tutorFrequencyTablesLesson as TutorMethodLesson & { number: 312 }, 'Frequency tables', 'Building a frequency table, and the mean, median, mode and range from one.'),
  entry(tutorGroupedFrequencyLesson as TutorMethodLesson & { number: 313 }, 'Grouped frequency tables', 'Grouping data into classes, inequality notation, and the modal class and the class containing the median.'),
  entry(tutorEstimatingMeanLesson as TutorMethodLesson & { number: 314 }, 'Estimating the mean', 'Midpoints, and estimating the mean from a grouped frequency table.'),
  entry(tutorBarChartsLesson as TutorMethodLesson & { number: 315 }, 'Bar charts', 'Drawing a bar chart, reading one for totals and percentages, and dual bar charts.'),
  entry(tutorScatterGraphsLesson as TutorMethodLesson & { number: 316 }, 'Scatter graphs', 'Plotting a scatter graph, correlation, outliers, and predicting with a line of best fit.'),
  entry(tutorLineGraphsLesson as TutorMethodLesson & { number: 317 }, 'Line graphs', 'Drawing a line graph, reading one, and spotting the mistakes in one.'),
  entry(tutorPieChartsLesson as TutorMethodLesson & { number: 318 }, 'Pie charts', 'Working out the angles, drawing a pie chart, and reading and comparing pie charts.'),
]

export const probabilityChapter: MathsChapter<ProbabilityLessonNumber, 'probability'> = {
  id: 'probability', title: 'Probability and statistics', description: 'Probability, frequency and tree diagrams, relative frequency, Venn diagrams and set notation; types of data, averages, sampling and questionnaires.', lessons: probabilityLessons,
}

export const lessonFor = (number: ProbabilityLessonNumber) => ({ 301: tutorProbabilityLesson, 302: tutorFrequencyTreesLesson, 303: tutorTreeDiagramsLesson, 304: tutorRelativeFrequencyLesson, 305: tutorVennLesson, 306: tutorSetNotationLesson, 307: tutorDataTypesLesson, 308: tutorAveragesLesson, 309: tutorSamplingLesson, 310: tutorPictogramsLesson, 311: tutorStemLeafLesson, 312: tutorFrequencyTablesLesson, 313: tutorGroupedFrequencyLesson, 314: tutorEstimatingMeanLesson, 315: tutorBarChartsLesson, 316: tutorScatterGraphsLesson, 317: tutorLineGraphsLesson, 318: tutorPieChartsLesson })[number]
export const isProbabilityLessonNumber = (value: number): value is ProbabilityLessonNumber => probabilityLessons.some(item => item.number === value)

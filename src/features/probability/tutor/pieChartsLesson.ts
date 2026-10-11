import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { text } from '../../simultaneous-equations/tutor/boardWorkings'

// A placeholder while the lesson is written: one screen.
const lesson = author(318)
lesson.add('mixed', 'Pie charts', 'P placeholder', text('Coming soon.'))

export const tutorPieChartsLesson: TutorMethodLesson = {
  id: 'L318', number: 318, title: 'Pie charts', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Coming soon.',
  labels: { mixed: 'Review' },
  states: lesson.finish(),
}

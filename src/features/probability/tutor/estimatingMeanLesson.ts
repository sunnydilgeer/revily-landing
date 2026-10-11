import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { text } from '../../simultaneous-equations/tutor/boardWorkings'

// A placeholder while the lesson is written: one screen.
const lesson = author(314)
lesson.add('mixed', 'Estimating the mean', 'P placeholder', text('Coming soon.'))

export const tutorEstimatingMeanLesson: TutorMethodLesson = {
  id: 'L314', number: 314, title: 'Estimating the mean', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Coming soon.',
  labels: { mixed: 'Review' },
  states: lesson.finish(),
}

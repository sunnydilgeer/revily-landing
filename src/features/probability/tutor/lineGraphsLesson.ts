import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { text } from '../../simultaneous-equations/tutor/boardWorkings'

// A placeholder while the lesson is written: one screen.
const lesson = author(317)
lesson.add('mixed', 'Line graphs', 'P placeholder', text('Coming soon.'))

export const tutorLineGraphsLesson: TutorMethodLesson = {
  id: 'L317', number: 317, title: 'Line graphs', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Coming soon.',
  labels: { mixed: 'Review' },
  states: lesson.finish(),
}

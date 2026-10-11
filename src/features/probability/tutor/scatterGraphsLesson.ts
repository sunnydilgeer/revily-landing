import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { text } from '../../simultaneous-equations/tutor/boardWorkings'

// A placeholder while the lesson is written: one screen.
const lesson = author(316)
lesson.add('mixed', 'Scatter graphs', 'P placeholder', text('Coming soon.'))

export const tutorScatterGraphsLesson: TutorMethodLesson = {
  id: 'L316', number: 316, title: 'Scatter graphs', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Coming soon.',
  labels: { mixed: 'Review' },
  states: lesson.finish(),
}

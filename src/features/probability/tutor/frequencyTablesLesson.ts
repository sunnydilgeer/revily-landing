import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { text } from '../../simultaneous-equations/tutor/boardWorkings'

// A placeholder while the lesson is written: one screen.
const lesson = author(312)
lesson.add('mixed', 'Frequency tables', 'P placeholder', text('Coming soon.'))

export const tutorFrequencyTablesLesson: TutorMethodLesson = {
  id: 'L312', number: 312, title: 'Frequency tables', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Coming soon.',
  labels: { mixed: 'Review' },
  states: lesson.finish(),
}

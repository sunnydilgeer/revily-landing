import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { text } from '../../simultaneous-equations/tutor/boardWorkings'

// A placeholder while the lesson is written: one screen.
const lesson = author(310)
lesson.add('mixed', 'Pictograms', 'P placeholder', text('Coming soon.'))

export const tutorPictogramsLesson: TutorMethodLesson = {
  id: 'L310', number: 310, title: 'Pictograms', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Coming soon.',
  labels: { mixed: 'Review' },
  states: lesson.finish(),
}

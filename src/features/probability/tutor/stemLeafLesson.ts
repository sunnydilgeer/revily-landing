import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { text } from '../../simultaneous-equations/tutor/boardWorkings'

// A placeholder while the lesson is written: one screen.
const lesson = author(311)
lesson.add('mixed', 'Stem and leaf diagrams', 'P placeholder', text('Coming soon.'))

export const tutorStemLeafLesson: TutorMethodLesson = {
  id: 'L311', number: 311, title: 'Stem and leaf diagrams', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Coming soon.',
  labels: { mixed: 'Review' },
  states: lesson.finish(),
}

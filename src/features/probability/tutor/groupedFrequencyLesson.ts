import { author } from '../../written-methods/tutor/content'
import type { TutorMethodLesson } from '../../written-methods/tutor/model'
import { text } from '../../simultaneous-equations/tutor/boardWorkings'

// A placeholder while the lesson is written: one screen.
const lesson = author(313)
lesson.add('mixed', 'Grouped frequency tables', 'P placeholder', text('Coming soon.'))

export const tutorGroupedFrequencyLesson: TutorMethodLesson = {
  id: 'L313', number: 313, title: 'Grouped frequency tables', level: 'GCSE Foundation',
  steadyPictures: true,
  goal: 'Coming soon.',
  labels: { mixed: 'Review' },
  states: lesson.finish(),
}

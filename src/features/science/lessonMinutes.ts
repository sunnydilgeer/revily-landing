/*
 * Science lesson length from its screens, on the same reading model as Maths: reading at about 150 words a
 * minute, plus answering time. Written answers take longest; the worked explanation is read after answering.
 */
import { readingSeconds, toMinutes } from '../maths/lessonMinutes'
import type { ScienceLesson } from './types'

export function scienceLessonMinutes(lesson: ScienceLesson) {
  const seconds = lesson.states.reduce((sum, state) => {
    const read = readingSeconds(state.title, state.body)
    if (state.kind === 'teaching') return sum + 3 + read + readingSeconds(...(state.steps ?? []))
    const explanation = readingSeconds(...state.explanation.steps, state.explanation.answer)
    if (state.kind === 'choice') return sum + 12 + read + explanation + readingSeconds(...state.options.map(option => option.label))
    return sum + 60 + 20 * state.rubric.marks + read + explanation + readingSeconds(state.instruction)
  }, 0)
  return toMinutes(seconds)
}

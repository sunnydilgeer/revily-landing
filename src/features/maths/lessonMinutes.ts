/*
 * Lesson length from what is on its screens, for the curriculum contents. A Foundation student reads about
 * 150 words a minute; each kind of question adds thinking and typing time, and videos add their own length.
 * Repair screens only appear after a wrong answer, so they are left out of the usual route.
 */
import type { InteractionDefinition, LessonDefinition } from '../number-types/types'

const WORDS_PER_SECOND = 2.5
const words = (...texts: Array<string | undefined>) => texts.join(' ').split(/\s+/).filter(Boolean).length
export const readingSeconds = (...texts: Array<string | undefined>) => words(...texts) / WORDS_PER_SECOND
export const toMinutes = (seconds: number) => Math.max(2, Math.round(seconds / 60))

// Thinking and answering time on top of reading, by kind of answer.
const ANSWER_SECONDS: Record<InteractionDefinition['type'], number> = {
  continue: 3,
  select: 12,
  multiSelect: 18,
  order: 20,
  numericInput: 25,
  fractionInput: 30,
  quotientRemainderInput: 35,
}

export function mathsLessonMinutes(lesson: LessonDefinition) {
  const seconds = lesson.states.filter(state => state.phase !== 'repair').reduce((sum, state) => {
    const { content, interaction, feedback } = state
    const video = (state as { video?: { durationSeconds?: number } }).video?.durationSeconds ?? 0
    const feedbackText = interaction.type === 'continue' ? undefined : feedback?.correct?.message
    return sum + video + ANSWER_SECONDS[interaction.type]
      + readingSeconds(content.title, content.body, content.prompt, feedbackText, ...(interaction.options ?? []).map(option => option.label))
  }, 0)
  return toMinutes(seconds)
}

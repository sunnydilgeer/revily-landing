import { working } from '../../written-methods/model'
import type { TutorWorking } from '../../written-methods/tutor/model'
import type { ChanceBoardSpec } from '../../written-methods/tutor/ChanceBoard'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { text } from '../../simultaneous-equations/tutor/boardWorkings'
import { screens, type Box } from '../../geometry/tutor/figureLesson'
import type { author } from '../../written-methods/tutor/content'

/*
 * Shared by Probability and statistics lessons 1 to 9: the Geometry lessons' screens (figureLesson.ts), plus a play
 * screen on the chance board (ChanceBoard.tsx) and a question asked in words, with no picture (types of data,
 * sampling), whose working opens after it the same way.
 */
export function chanceScreens(lesson: ReturnType<typeof author>) {
  const { add } = lesson
  const base = screens(lesson)
  const steps = (visual: TutorWorking) => visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
  return {
    ...base,
    play(topic: MicroSkillId, title: string, sourceRef: string, spec: ChanceBoardSpec) {
      const state = add(topic, title, sourceRef, text(title))
      state.chanceBoard = spec
      return state
    },
    /** A question in words: `lines` are shown under its title (the data, or the survey question), then the answer. */
    ask(topic: MicroSkillId, title: string, sourceRef: string, lines: string[], interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null, box?: Box) {
      const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
      const state = add(topic, title, sourceRef, text(...(lines.length ? lines : [title])), interaction, working(answer, ...steps(model)), hint)
      state.working = model
      if (interaction.type === 'numericInput' && box) { if (box.label) state.answerLabel = box.label; state.answerPrefix = box.prefix }
      if (diagnose) state.diagnose = diagnose
      return state
    },
  }
}

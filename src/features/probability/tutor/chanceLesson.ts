import { working } from '../../written-methods/model'
import type { TutorWorking } from '../../written-methods/tutor/model'
import type { ChanceBoardSpec } from '../../written-methods/tutor/ChanceBoard'
import { sortAnswer, sortMistake, sortPlaces, type SortBoardSpec } from '../../written-methods/tutor/SortBoard'
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
    /**
     * A question answered on the chance board: the arrow's place on the scale, both sliders on the tree (any of
     * `answers`, in tenths: "6,7"), or the last value on the average board. `say` is what a wrong answer is told.
     */
    drag(topic: MicroSkillId, title: string, sourceRef: string, spec: ChanceBoardSpec, answers: string[], shown: string, hint: string, model: TutorWorking, say: (response: string) => string) {
      const interaction: InteractionDefinition = answers.length > 1 ? { type: 'numericInput', correctAnswer: answers, displayAnswer: shown, acceptanceRule: 'oneOf' } : { type: 'numericInput', correctAnswer: answers[0], displayAnswer: shown, acceptanceRule: 'exact' }
      const state = add(topic, title, sourceRef, text(title), interaction, working(shown, ...steps(model)), hint)
      state.working = model
      state.chanceBoard = { ...spec, ask: true }
      state.diagnose = response => answers.includes(response) ? null : say(response)
      return state
    },
    /** A play screen on the sort board: right tiles stay and turn green, wrong ones go back and say why. */
    playSort(topic: MicroSkillId, title: string, sourceRef: string, spec: SortBoardSpec) {
      const state = add(topic, title, sourceRef, text(title))
      state.sortBoard = spec
      return state
    },
    /** A question answered on the sort board: every tile placed, then checked; the first tile out of place says why. */
    sort(topic: MicroSkillId, title: string, sourceRef: string, spec: SortBoardSpec, hint: string, model: TutorWorking) {
      const places = sortPlaces(spec)
      const shown = places.map(p => ({ p, tiles: spec.tiles.filter(t => t.to === p.id).map(t => t.label) })).filter(g => g.tiles.length).map(g => `${g.p.label}: ${g.tiles.join(', ')}`).join('; ')
      const interaction: InteractionDefinition = { type: 'numericInput', correctAnswer: sortAnswer(spec), displayAnswer: shown, acceptanceRule: 'exact' }
      const state = add(topic, title, sourceRef, text(title), interaction, working(shown, ...steps(model)), hint)
      state.working = model
      state.sortBoard = spec
      state.diagnose = response => sortMistake(spec, response)
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

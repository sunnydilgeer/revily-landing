import { working } from '../../written-methods/model'
import type { AngleFrame, FigureItem } from '../../written-methods/tutor/methodWorking'
import type { MeasureBoardSpec } from '../../written-methods/tutor/MeasureBoard'
import type { TutorMethodState, TutorWorking } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import { diagnoseSlips, type Slip } from '../../equations/tutor/equationsDiagnosis'
import { text } from '../../simultaneous-equations/tutor/boardWorkings'
import type { author } from '../../written-methods/tutor/content'

/*
 * Shared by geometry lessons 5 to 9 (symmetry, area, circles, perimeter, sectors): the four kinds of screen, built the
 * same way as lessons 1 to 4. A play screen opens a rung on the measuring board (MeasureBoard.tsx); a worked example
 * steps through its working; a question shows its own measured figure (FigurePictures.tsx), takes the answer, and
 * opens the same step-by-step working after.
 */

/** A measured figure as a picture: drawn by FigurePictures.tsx, carried in the angle picture's slot. */
export const fig = (items: FigureItem[], spoken: string, caption?: string): AngleFrame => ({ shape: 'figure', angles: [], labels: [], figure: { items, spoken, ...(caption ? { caption } : {}) } })

/** The answer box: its label (the unit after it, in brackets) and what goes before it. */
export type Box = { label?: string; prefix: string }

/** Rounds to so many decimal places, as a number: 32.169… to 1 dp is 32.2. */
export const dp = (n: number, places = 1) => Number(n.toFixed(places))
/** Rounds to so many significant figures. */
export const sf = (n: number, figures = 3) => Number(n.toPrecision(figures))
/** A number as the board writes it: no trailing zeros, except to show the decimal places asked for. */
export const show = (n: number, places?: number) => places === undefined ? String(n) : n.toFixed(places)

export function screens(lesson: ReturnType<typeof author>) {
  const { add } = lesson
  const steps = (visual: TutorWorking) => visual.kind === 'method-worked' ? visual.examples.flatMap(example => example.steps).map(step => [step.title, step.instruction] as [string, string]) : []
  return {
    explore(topic: MicroSkillId, title: string, sourceRef: string, spec: MeasureBoardSpec) {
      const state = add(topic, title, sourceRef, text(title))
      state.measureBoard = spec
      return state
    },
    worked(topic: MicroSkillId, title: string, heading: string, sourceRef: string, model: TutorWorking, body: string) {
      const state = add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
      state.content.heading = heading
      return state
    },
    practice(topic: MicroSkillId, title: string, sourceRef: string, picture: AngleFrame, interaction: InteractionDefinition, hint: string, model: TutorWorking, diagnose?: (response: string) => string | null, box?: Box) {
      const answer = interaction.displayAnswer ?? interaction.options?.find(option => option.id === interaction.correctAnswer)?.label ?? ''
      const state: TutorMethodState = add(topic, title, sourceRef, { kind: 'angle', angle: picture }, interaction, working(answer, ...steps(model)), hint)
      state.working = model
      if (interaction.type === 'numericInput' && box) { if (box.label) state.answerLabel = box.label; state.answerPrefix = box.prefix }
      if (diagnose) state.diagnose = diagnose
      return state
    },
  }
}

/** Slip messages for a typed answer; a unit, π or degree sign typed with it is fine. */
export const slips = (right: number, list: Slip[]) => (response: string) => diagnoseSlips(response.replace(/\s*(?:°|π?\s*(?:[cm]?m[²2]?)?)\s*$/, ''), right, list.filter(([value]) => value !== right))

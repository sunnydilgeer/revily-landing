/* Shared helpers for Higher Maths: the sections added to Foundation lessons (additions.ts) and the Higher-only lessons (lessons.ts). */
import { select, working } from '../../written-methods/model'
import type { TutorMethodState } from '../../written-methods/tutor/model'
import type { StepWorking } from '../../written-methods/tutor/stepWorking'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'
import type { author } from '../../written-methods/tutor/content'

type Author = ReturnType<typeof author>

/**
 * A Higher section inside a Foundation lesson. Its screens go just before the lesson's Review (or at the end when it has
 * none) and only Higher students see them (../tier.ts). Foundation lessons are never edited for Higher content.
 */
export type HigherAddition = {
  /** The Foundation lesson this section goes into. */
  lessonId: string
  /** The section's skill id, and its title in the lesson's section list. */
  skill: MicroSkillId
  label: string
  states: TutorMethodState[]
}

export const text = (...lines: string[]) => ({ kind: 'text' as const, lines })

/** The right answer is written first; this moves it to a different position on each question. */
let turn = 0
export function choose(labels: string[]): InteractionDefinition {
  const at = (turn++ * 2 + 1) % labels.length
  const order = labels.slice(1)
  order.splice(at, 0, labels[0])
  return select(order, at)
}

export const number = (answer: number, displayAnswer: string): InteractionDefinition => ({
  type: 'numericInput', correctAnswer: answer, displayAnswer, acceptanceRule: 'normalisedNumber',
})
/** Any number strictly between the bounds counts (an estimate of a square root: closer to the right whole number). */
export const between = (example: number, lowerBound: number, upperBound: number, displayAnswer: string): InteractionDefinition => ({
  type: 'numericInput', correctAnswer: example, displayAnswer, acceptanceRule: 'openInterval', lowerBound, upperBound,
})
export const fraction = (answer: string): InteractionDefinition => ({
  type: 'fractionInput', correctAnswer: answer, displayAnswer: answer, acceptanceRule: 'rational', responseShape: 'fraction', requireSimplest: true,
})

/** Lesson screens built on one author: a worked example, and a question whose "See the working" is its own step working. */
export function screens({ add }: Author) {
  const steps = (model: StepWorking) => model.steps.map(step => [step.title, step.why] as [string, string])
  return {
    worked(topic: MicroSkillId, title: string, sourceRef: string, model: StepWorking, body?: string) {
      return add(topic, title, sourceRef, model, undefined, undefined, undefined, body)
    },
    practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, answer: string, hint: string, model: StepWorking, answerLabel?: string) {
      const state = add(topic, title, sourceRef, text(title), interaction, working(answer, ...steps(model)), hint)
      state.working = model
      if (answerLabel) state.answerLabel = answerLabel
      return state
    },
  }
}

import type { ChainStep } from './StepChain'

/** A worked step as the older lesson models store it: the line of working, a short title and a sentence. */
export type WorkedStep = { equation: string; title: string; instruction: string }

/**
 * Turns a question and its worked steps into a step chain: each equation becomes a line of working,
 * its title the operation between lines, and its instruction the why. The lines carry no moving
 * terms; a lesson that wants terms to fly between lines builds its chain directly instead.
 */
export function chainFromSteps(question: string, steps: WorkedStep[]): ChainStep[] {
  return [{ line: question }, ...steps.map(step => ({ line: step.equation, op: step.title, why: step.instruction }))]
}

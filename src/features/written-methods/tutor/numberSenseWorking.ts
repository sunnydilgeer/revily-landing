import type { MethodStep, MethodWorking, RoundingFrame, OrderingFrame } from './methodWorking'

export type NumberSenseStep = {
  title: string
  equation: string
  instruction: string
  rounding?: RoundingFrame
  ordering?: OrderingFrame
}

/**
 * Keeps authored explanations and structured number visuals together so the
 * walkthrough can show one complete step at a time.
 */
export function numberSenseWorking(
  expression: string,
  label: string,
  authoredSteps: NumberSenseStep[],
): MethodWorking {
  const steps: MethodStep[] = authoredSteps.map(step => ({
    title: step.title,
    operation: expression,
    equation: step.equation,
    instruction: step.instruction,
    frame: {
      rounding: step.rounding,
      ordering: step.ordering,
    },
  }))

  return {
    kind: 'method-worked',
    examples: [{ method: authoredSteps.some(step => step.rounding) ? 'rounding' : 'ordering', expression, label, first: 0, second: 0, steps }],
  }
}

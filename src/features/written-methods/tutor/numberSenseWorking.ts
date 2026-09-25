import type { MethodStep, MethodWorking, RoundingFrame } from './methodWorking'

export type NumberSenseStep = {
  title: string
  equation: string
  instruction: string
  rows?: string[]
  result?: string
  note?: string
  rounding?: RoundingFrame
}

/**
 * Builds a progressive, replayable number-sense explanation using the shared
 * tutor working surface. The rows are deliberately plain text so aligned
 * decimal forms, inequalities, units and percentages remain available to
 * assistive technology as well as visually readable.
 */
export function numberSenseWorking(
  expression: string,
  label: string,
  initialRows: string[],
  authoredSteps: NumberSenseStep[],
): MethodWorking {
  const steps: MethodStep[] = authoredSteps.map(step => ({
    title: step.title,
    operation: expression,
    equation: step.equation,
    instruction: step.instruction,
    frame: {
      decimalRows: step.rows ?? initialRows,
      decimalResult: step.result,
      decimalNote: step.note,
      rounding: step.rounding,
    },
  }))

  return {
    kind: 'method-worked',
    examples: [{ method: authoredSteps.some(step => step.rounding) ? 'rounding' : 'decimal', expression, label, first: 0, second: 0, steps }],
  }
}

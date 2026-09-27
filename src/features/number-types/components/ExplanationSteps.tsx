import { WorkedChain } from '../../maths/step-chain/WorkedChain'
import type { ChainStep } from '../../maths/step-chain/StepChain'
import type { FeedbackDefinition } from '../types'

type Explanation = NonNullable<FeedbackDefinition['workedExplanation']>

/**
 * A written explanation as step-by-step working, like every worked example: each step's title is
 * the operation, its lines are the working, one tap at a time. The first step is on screen at once.
 */
export function explanationChain(explanation: Explanation, showAnswer = true): ChainStep[] {
  const steps: ChainStep[] = explanation.steps.map(step => ({ line: step.lines.join('  ·  ') || step.title, op: step.title, plain: true }))
  if (showAnswer) steps.push({ line: explanation.answer, op: explanation.answerLabel ?? 'Answer', plain: true })
  return steps
}

/** showAnswer: false when the check bar already states the answer (rung lessons). */
export function ExplanationSteps({ explanation, showAnswer = true }: { explanation: Explanation; showAnswer?: boolean }) {
  return <div className="worked-explanation"><WorkedChain steps={explanationChain(explanation, showAnswer)} /></div>
}

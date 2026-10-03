'use client'

import { WorkedChain } from '../../maths/step-chain/WorkedChain'
import type { ChainStep } from '../../maths/step-chain/StepChain'
import { PictureStep } from '../../written-methods/tutor/NumberSenseWorkedExample'
import type { MethodStep } from '../../written-methods/tutor/methodWorking'
import type { FeedbackDefinition } from '../types'
import '../../written-methods/tutor/NumberSenseLesson.css'

type Explanation = NonNullable<FeedbackDefinition['workedExplanation']>

/** "20 ÷ 5 → 4": the sum in ink, the arrow, the result in blue. Words stay plain. */
function Line({ text }: { text: string }) {
  const [sum, result] = text.split(' → ')
  return <li aria-hidden="true"><span>{sum}</span>{result !== undefined && <><span>→</span><strong className="lw-result">{result}</strong></>}</li>
}

/**
 * A working one move a step (src/features/EXPLANATIONS.md): each step's heading sits above the lines it adds, earlier
 * lines stay, the ⓘ is words, and the answer appears once, in green, after the last step's lines.
 */
export function LinesWorking({ explanation }: { explanation: Explanation }) {
  const chain: ChainStep[] = [{ line: 'question' }, ...explanation.steps.map(step => ({ line: step.lines.join(', '), op: step.title, why: step.why }))]
  const picture = (revealed: number) => {
    const index = revealed - 2
    if (index < 0) return null
    const step = explanation.steps[index], last = index === explanation.steps.length - 1
    const earlier = explanation.steps.slice(0, index).flatMap(s => s.lines)
    const spoken = [...earlier, ...step.lines, ...(last ? [`Answer: ${explanation.answer}`] : [])].join('. ')
    return <div className="ns-visual lw" key={revealed} role="img" aria-label={spoken}>
      <PictureStep step={{ title: step.title, instruction: step.why ?? '', operation: '', equation: '', frame: {} } as MethodStep}>{heading => <>
        {earlier.length > 0 && <ul className="ns-term-groups lw-lines is-old">{earlier.map((line, i) => <Line key={i} text={line} />)}</ul>}
        {heading}
        <ul className="ns-term-groups lw-lines">{step.lines.map((line, i) => <Line key={i} text={line} />)}</ul>
        {last && <p className="lw-answer" aria-hidden="true">{explanation.answerLabel && <small>{explanation.answerLabel}</small>}{explanation.answer}</p>}
      </>}</PictureStep>
    </div>
  }
  return <WorkedChain steps={chain} picture={picture} pictureOnly />
}

export const isLinesWorking = (explanation: Explanation) => explanation.steps.length > 0 && explanation.steps.every(step => step.why)

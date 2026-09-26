import type { FeedbackDefinition } from '../types'

function WorkedText({ text }: { text: string }) {
  return <>{text.split(/(\d+\/\d+)/g).map((part, index) => {
    const fraction = /^(\d+)\/(\d+)$/.exec(part)
    return fraction ? <span className="lesson-explanation__fraction" key={index} role="math" aria-label={part}>
      <span aria-hidden="true">{fraction[1]}</span><span aria-hidden="true">{fraction[2]}</span>
    </span> : part
  })}</>
}

/** showAnswer: false when the check bar already states the answer (rung lessons). */
export function ExplanationSteps({ explanation, showAnswer = true }: { explanation: NonNullable<FeedbackDefinition['workedExplanation']>; showAnswer?: boolean }) {
  return <div className="lesson-explanation">
    <strong className="lesson-explanation__heading">{showAnswer ? 'Explanation' : 'Working'}</strong>
    <ol>{explanation.steps.map((step, index) => <li key={index}>
      <strong>{step.title}</strong>
      {step.lines.map((line, lineIndex) => <p key={lineIndex}><WorkedText text={line} /></p>)}
    </li>)}</ol>
    {showAnswer && <p className="lesson-explanation__answer"><strong>{explanation.answerLabel ?? 'Answer'}:</strong> <WorkedText text={explanation.answer} /></p>}
  </div>
}

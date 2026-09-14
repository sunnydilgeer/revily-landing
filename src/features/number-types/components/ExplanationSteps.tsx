import type { FeedbackDefinition } from '../types'

function WorkedText({ text }: { text: string }) {
  return <>{text.split(/(\d+\/\d+)/g).map((part, index) => {
    const fraction = /^(\d+)\/(\d+)$/.exec(part)
    return fraction ? <span className="lesson-explanation__fraction" key={index} role="math" aria-label={part}>
      <span aria-hidden="true">{fraction[1]}</span><span aria-hidden="true">{fraction[2]}</span>
    </span> : part
  })}</>
}

export function ExplanationSteps({ explanation }: { explanation: NonNullable<FeedbackDefinition['workedExplanation']> }) {
  return <div className="lesson-explanation">
    <strong className="lesson-explanation__heading">Explanation</strong>
    <ol>{explanation.steps.map((step, index) => <li key={index}>
      <strong>{step.title}</strong>
      {step.lines.map((line, lineIndex) => <p key={lineIndex}><WorkedText text={line} /></p>)}
    </li>)}</ol>
    <p className="lesson-explanation__answer"><strong>{explanation.answerLabel ?? 'Answer'}:</strong> <WorkedText text={explanation.answer} /></p>
  </div>
}

import type { FeedbackDefinition } from '../types'

export function FeedbackPanel({ feedback, correct }: { feedback: FeedbackDefinition & { correctAnswer?: string }; correct: boolean }) {
  return (
    <div className={`lesson-feedback lesson-feedback--${correct ? 'correct' : 'hint'}`} role={correct ? 'status' : 'alert'} aria-live="polite">
      <span className="lesson-feedback__icon" aria-hidden="true">{correct ? '✓' : '→'}</span>
      <div>
        <strong>{feedback.message}</strong>
        {feedback.correctAnswer && <p className="lesson-feedback__answer">{feedback.correctAnswer}</p>}
        {feedback.evidence && <p>{feedback.evidence}</p>}
        {feedback.followUpPrompt && <p className="lesson-feedback__follow-up">{feedback.followUpPrompt}</p>}
      </div>
    </div>
  )
}

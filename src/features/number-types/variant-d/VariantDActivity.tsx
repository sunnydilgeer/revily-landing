import type { Ref } from 'react'
import { parseDecimalOrFraction } from '../lessonMath'
import type { useLessonEngine } from '../useLessonEngine'
import { IntegerValueVisual, MathValue } from './IntegerValueVisual'

type Props = { engine: ReturnType<typeof useLessonEngine>; headingRef: Ref<HTMLHeadingElement> }
export function VariantDActivity({ engine, headingRef }: Props) {
  const { state, feedback, selection } = engine
  if (state.component.type !== 'integerValues') return null
  const teaching = state.interaction.type === 'continue'
  const numeric = state.interaction.type === 'numericInput'
  const reasons = state.interaction.options?.some(option => option.label.length > 25)
  const multiple = state.interaction.type === 'multiSelect'
  const accepted = Array.isArray(state.interaction.correctAnswer) ? state.interaction.correctAnswer : [state.interaction.correctAnswer]
  return <div className="d-activity">
    <IntegerValueVisual {...state.component.props} revealed={Boolean(feedback)} answerValue={numeric && feedback?.correct ? parseDecimalOrFraction(engine.inputValue) ?? undefined : undefined} />
    <h3 ref={headingRef} tabIndex={-1}>{state.content.title}</h3>
    {teaching && state.content.body && <p className="d-body">{state.content.body}</p>}
    {numeric && <div className="d-numeric">
      <label className="d-slider-label" htmlFor={`response-${state.id}`}>Your answer · decimal or fraction</label>
      <input id={`response-${state.id}`} type="text" value={engine.inputValue} disabled={Boolean(feedback)} placeholder={state.interaction.placeholder} autoComplete="off" spellCheck={false} onChange={event => engine.setInputValue(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !feedback && engine.inputValue.trim()) engine.submit() }} />
    </div>}
    {!teaching && !numeric && <div className={`d-choices${(state.interaction.options?.length ?? 0) > 3 ? ' d-choices--grid' : reasons ? ' d-choices--reasons' : ''}`} role="group" aria-label={multiple ? 'Select all that apply' : 'Choose one answer'}>
      {state.interaction.options?.map(option => {
        const selected = selection.includes(option.id)
        const correct = accepted.includes(option.id)
        const status = feedback ? correct ? 'correct' : selected ? 'incorrect' : 'neutral' : selected ? 'selected' : 'neutral'
        return <button className={`d-choice d-choice--${status}`} key={option.id} type="button" aria-pressed={selected} disabled={Boolean(feedback)} aria-label={`${option.label}${feedback && correct ? ', correct answer' : feedback && selected ? ', your answer, incorrect' : ''}`} onClick={() => multiple ? engine.toggleOption(option.id) : engine.submitSelection([option.id])}>
          <MathValue label={option.label} /><span className="d-choice__mark" aria-hidden="true">{feedback ? correct ? '✓' : selected ? '×' : '' : multiple ? selected ? '✓' : '+' : '→'}</span>
        </button>
      })}
    </div>}
    {feedback && <div className={`d-feedback${feedback.correct ? ' d-feedback--correct' : ''}`} role="status"><strong>{feedback.message}</strong><p>{feedback.evidence}</p></div>}
    <div className="d-actions">
      {engine.canGoBack && !feedback && <button className="lesson-secondary-action" type="button" onClick={engine.back}>← Back</button>}
      {(multiple || numeric) && !feedback && <button className="lesson-primary-action" type="button" disabled={numeric ? !engine.inputValue.trim() : selection.length === 0} onClick={engine.submit}>Check answer</button>}
      {(teaching || feedback) && <button className="lesson-primary-action" type="button" onClick={engine.continueLesson}>Continue <span aria-hidden="true">→</span></button>}
    </div>
  </div>
}

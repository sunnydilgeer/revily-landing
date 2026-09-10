import type { CSSProperties } from 'react'
import { MathSpan } from '../../../../components/MathText'
import type { OperationLegendItem, WorkedExpressionStep } from '../../number-types/types'

type StepSequence = {
  expression: string
  steps: WorkedExpressionStep[]
  label?: string
  legend?: OperationLegendItem[]
  optionId?: string
  optionLabel?: string
}

function Sequence({ sequence, revealed, selected, onSelect }: {
  sequence: StepSequence
  revealed: boolean
  selected: string[]
  onSelect?: (id: string) => void
}) {
  const isSelected = Boolean(sequence.optionId && selected.includes(sequence.optionId))
  return (
    <div className={`expression-sequence${sequence.optionId ? ' expression-sequence--selectable' : ''}${isSelected ? ' expression-sequence--selected' : ''}`}>
      {sequence.label && <span className="expression-sequence__label">{sequence.label}</span>}
      <div className="expression-sequence__initial"><MathSpan latex={sequence.expression} display /></div>
      {revealed && (
        <ol className="expression-sequence__steps" aria-label="Worked calculation">
          {sequence.steps.map((step, index) => (
            <li key={`${step.expression}-${index}`} style={{ '--step-index': index } as CSSProperties}>
              <span aria-hidden="true">{index === sequence.steps.length - 1 ? '=' : '→'}</span>
              <div className="expression-sequence__step-content">
                <MathSpan latex={step.expression} display />
              </div>
            </li>
          ))}
        </ol>
      )}
      {sequence.optionId && onSelect && (
      <button
        type="button"
        className="expression-sequence__select-control"
        aria-label={`Select ${sequence.optionLabel ?? sequence.expression}`}
        aria-pressed={isSelected}
        disabled={revealed}
        onClick={() => onSelect(sequence.optionId!)}
      />
      )}
    </div>
  )
}

export function ExpressionSteps({ expression, steps, legend, optionId, optionLabel, revealStepsOnAnswer = false, secondary, revealed, selected = [], onSelect }: {
  expression: string
  steps: WorkedExpressionStep[]
  legend?: OperationLegendItem[]
  optionId?: string
  optionLabel?: string
  revealStepsOnAnswer?: boolean
  secondary?: StepSequence
  revealed: boolean
  selected?: string[]
  onSelect?: (id: string) => void
}) {
  const showSteps = !revealStepsOnAnswer || revealed
  return (
    <figure className={`expression-steps${secondary ? ' expression-steps--compare' : ''}`}>
      <Sequence sequence={{ expression, steps, legend, optionId, optionLabel }} revealed={showSteps} selected={selected} onSelect={onSelect} />
      {secondary && <Sequence sequence={secondary} revealed={showSteps} selected={selected} onSelect={onSelect} />}
      <figcaption className="sr-only">
        {showSteps ? 'The worked calculation is revealed one legal operation at a time.' : 'Calculate the expression before revealing its steps.'}
      </figcaption>
    </figure>
  )
}

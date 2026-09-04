import type { CSSProperties } from 'react'
import './EquationBalance.css'

export type BalanceExpression = {
  variableCount?: number
  unitCount: number
}

type EquationBalanceProps = {
  left: BalanceExpression
  right: BalanceExpression
  variableValue?: number
}

function expressionValue(
  expression: BalanceExpression,
  variableValue: number,
) {
  return (
    (expression.variableCount ?? 0) * variableValue +
    expression.unitCount
  )
}

function expressionLabel(expression: BalanceExpression) {
  const variableCount = expression.variableCount ?? 0

  if (variableCount === 0) {
    return String(expression.unitCount)
  }

  const variablePart = variableCount === 1 ? 'x' : `${variableCount}x`

  if (expression.unitCount === 0) {
    return variablePart
  }

  return `${variablePart} + ${expression.unitCount}`
}

function NumberTiles({ count }: { count: number }) {
  return (
    <div className="number-tiles" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          className="number-tile"
          key={index}
          style={{ '--tile-index': index } as CSSProperties}
        >
          1
        </span>
      ))}
    </div>
  )
}

function ExpressionTiles({
  expression,
}: {
  expression: BalanceExpression
}) {
  const variableCount = expression.variableCount ?? 0

  return (
    <div className="expression-tiles">
      {Array.from({ length: variableCount }, (_, index) => (
        <span
          className="variable-tile"
          key={`variable-${index}`}
          style={{ '--tile-index': index } as CSSProperties}
        >
          x
        </span>
      ))}

      <NumberTiles count={expression.unitCount} />
    </div>
  )
}

function EquationBalance({
  left,
  right,
  variableValue = 0,
}: EquationBalanceProps) {
  const leftValue = expressionValue(left, variableValue)
  const rightValue = expressionValue(right, variableValue)

  const balanceState =
    leftValue === rightValue
      ? 'balanced'
      : leftValue > rightValue
        ? 'left-heavy'
        : 'right-heavy'

  const equationSymbol = balanceState === 'balanced' ? '=' : '≠'
  const leftLabel = expressionLabel(left)
  const rightLabel = expressionLabel(right)

  return (
    <>
      <div
        className={`equation-preview balance-visual balance-visual--${balanceState}`}
        role="img"
        aria-label={`${leftLabel} is ${equationSymbol === '=' ? 'equal to' : 'not equal to'} ${rightLabel}. The balance is ${balanceState.replace('-', ' ')}.`}
      >
        <div className="balance-beam" />

        <div className="balance-pivot" aria-hidden="true">
          <span />
        </div>

        <div className="balance-pans">
          <div className="balance-pan balance-pan--left">
            <span className="pan-label">Left side</span>
            <ExpressionTiles expression={left} />
          </div>

          <div className="balance-pan balance-pan--right">
            <span className="pan-label">Right side</span>
            <ExpressionTiles expression={right} />
          </div>
        </div>
      </div>

      <div className="equation-readout" aria-label={`${leftLabel} ${equationSymbol} ${rightLabel}`}>
        <strong>{leftLabel}</strong>
        <span aria-hidden="true">{equationSymbol}</span>
        <strong>{rightLabel}</strong>
      </div>
    </>
  )
}

export default EquationBalance

'use client'

import { Check, ChevronRight, Lightbulb, X } from 'lucide-react'
import { useState } from 'react'
import { MathSpan } from '../../../../components/MathText'
import type { NextOperationStage } from '../../number-types/types'

type NextOperationProps = {
  stages: NextOperationStage[]
  finalExpression: string
  finalAnswer: string
  onComplete?: () => void
}

export function NextOperation({ stages, finalExpression, finalAnswer, onComplete }: NextOperationProps) {
  const [stageIndex, setStageIndex] = useState(0)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [complete, setComplete] = useState(false)
  const stage = stages[stageIndex]
  const resolved = selectedAction !== null
  const selectedCorrectly = selectedAction === stage.correctActionId

  const choose = (actionId: string) => {
    if (!resolved) setSelectedAction(actionId)
  }

  const advance = () => {
    if (stageIndex < stages.length - 1) {
      setStageIndex((index) => index + 1)
      setSelectedAction(null)
      return
    }
    setComplete(true)
    onComplete?.()
  }

  return (
    <section className="next-operation" aria-label="Choose the next BIDMAS operation">
      <div className="next-operation__progress" aria-label={`Calculation ${stageIndex + 1} of ${stages.length}`}>
        {stages.map((_, index) => <span className={index <= stageIndex ? 'is-reached' : ''} key={index} />)}
      </div>

      <div className="next-operation__trace">
        <div className="next-operation__history" aria-hidden="true">
          {stages.slice(0, stageIndex).map((pastStage) => (
            <div key={pastStage.accessibleExpression}>
              {pastStage.tokens.map((token, index) => (
                <span key={`${token.text}-${index}`}>{token.text}{token.superscript && <sup>{token.superscript}</sup>}</span>
              ))}
            </div>
          ))}
        </div>

        <div
          className={`next-operation__expression${complete ? ' is-complete' : ''}`}
          role="group"
          aria-label={complete ? `${finalExpression} equals ${finalAnswer}` : stage.accessibleExpression}
        >
          {complete ? <span>{finalExpression} = {finalAnswer}</span> : resolved ? (
            <MathSpan latex={stage.resolvedExpression} display className="next-operation__resolved-expression" />
          ) : stage.tokens.map((token, index) => {
            const isCorrect = token.actionId === stage.correctActionId
            const isSelected = token.actionId === selectedAction
            const className = [
              'next-operation__token',
              token.actionId ? 'next-operation__token--action' : '',
              resolved && isCorrect ? 'is-correct' : '',
              resolved && isSelected && !isCorrect ? 'is-incorrect' : '',
            ].filter(Boolean).join(' ')

            if (!token.actionId) return <span className={className} key={`${token.text}-${index}`}>{token.text}{token.superscript && <sup>{token.superscript}</sup>}</span>

            return (
              <button
                className={className}
                type="button"
                key={`${token.actionId}-${index}`}
                aria-label={token.actionLabel}
                disabled={resolved}
                onClick={() => choose(token.actionId!)}
              >
                {token.text}{token.superscript && <sup>{token.superscript}</sup>}
              </button>
            )
          })}
        </div>
      </div>

      {complete ? (
        <div className="next-operation__feedback is-correct" aria-live="polite">
          <Check aria-hidden="true" size={20} />
          <div><strong>Expression complete.</strong><p>{finalExpression} = {finalAnswer}.</p></div>
        </div>
      ) : !resolved ? (
        <p className="next-operation__instruction"><Lightbulb aria-hidden="true" size={18} /> Click the operation that should be calculated next.</p>
      ) : (
        <div className={`next-operation__feedback ${selectedCorrectly ? 'is-correct' : 'is-incorrect'}`} aria-live="polite">
          {selectedCorrectly ? <Check aria-hidden="true" size={20} /> : <X aria-hidden="true" size={20} />}
          <div>
            <strong>{selectedCorrectly ? `${stage.operation} is next.` : `Not this time — ${stage.operation} is next.`}</strong>
            <p>{selectedCorrectly ? stage.correctFeedback : stage.incorrectFeedback}</p>
          </div>
        </div>
      )}

      {resolved && !complete && (
        <button className="next-operation__advance" type="button" onClick={advance}>
          {stageIndex < stages.length - 1 ? 'Show next line' : `Reveal ${finalExpression} = ${finalAnswer}`}
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      )}
    </section>
  )
}

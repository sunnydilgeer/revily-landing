'use client'

import { useEffect, useId, useState } from 'react'
import type { CSSProperties } from 'react'
import type { ShortDivisionStage } from '../../number-types/types'

type Props = {
  dividend: string
  divisor: number
  mode?: 'static' | 'question' | 'paused' | 'stepper'
  quotientDigits?: Array<string | null>
  activeDividendIndices?: number[]
  working?: string[]
  stages?: ShortDivisionStage[]
  answer?: {
    label: string
    quotientDigits: Array<string | null>
    remainder?: number
    working?: string[]
  }
  showLabels?: boolean
  revealed: boolean
  onComplete?: () => void
}

export function ShortDivisionVisual({
  dividend,
  divisor,
  mode = 'question',
  quotientDigits,
  activeDividendIndices = [],
  working = [],
  stages = [],
  answer,
  showLabels = false,
  revealed,
  onComplete,
}: Props) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const captionId = useId()
  const isStepper = mode === 'stepper'
  const currentStage = isStepper ? stages[step] : undefined
  const previousStage = isStepper && step > 0 ? stages[step - 1] : undefined
  const shouldShowAnswer = revealed && !isStepper && Boolean(answer)
  const shownQuotient = currentStage?.quotientDigits
    ?? (shouldShowAnswer ? answer?.quotientDigits : quotientDigits)
    ?? Array.from({ length: dividend.length }, () => null)
  const shownActiveIndices = currentStage?.activeDividendIndices
    ?? (shouldShowAnswer ? [] : activeDividendIndices)
  const shownWorking = currentStage?.working
    ?? (shouldShowAnswer ? answer?.working ?? [] : working)
  const isComplete = isStepper && stages.length > 0 && step === stages.length - 1

  useEffect(() => {
    if (isComplete) onComplete?.()
  }, [isComplete, onComplete])

  useEffect(() => {
    if (!playing) return
    if (step >= stages.length - 1) {
      setPlaying(false)
      return
    }
    const timer = window.setTimeout(() => {
      setDirection('forward')
      setStep((current) => Math.min(stages.length - 1, current + 1))
    }, currentStage?.durationMs ?? 2600)
    return () => window.clearTimeout(timer)
  }, [currentStage?.durationMs, playing, stages.length, step])

  function goToStep(nextStep: number) {
    const safeStep = Math.max(0, Math.min(stages.length - 1, nextStep))
    setDirection(safeStep < step ? 'backward' : 'forward')
    setStep(safeStep)
    setPlaying(false)
  }

  function togglePlayback() {
    if (playing) {
      setPlaying(false)
      return
    }
    if (isComplete) {
      setDirection('backward')
      setStep(0)
    }
    setPlaying(true)
  }

  return (
    <figure className={`short-division-visual short-division-visual--${mode}`} aria-labelledby={captionId}>
      {showLabels && (
        <div className="short-division-visual__labels" role="group" aria-label="Parts of the short-division layout">
          <span><small>Divisor</small><strong>{divisor}</strong></span>
          <span><small>Quotient</small><strong>answer goes here</strong></span>
          <span><small>Dividend</small><strong>{dividend}</strong></span>
        </div>
      )}
      {isStepper && currentStage && (
        <div className="short-division-timeline">
          <div className="short-division-timeline__heading">
            <span>Worked example</span>
            <strong>Step {step + 1} of {stages.length}: {currentStage.label ?? `Step ${step + 1}`}</strong>
          </div>
          <div className="short-division-timeline__track" role="progressbar" aria-label="Worked example progress" aria-valuemin={1} aria-valuemax={stages.length} aria-valuenow={step + 1}>
            <span style={{ width: `${stages.length <= 1 ? 100 : (step / (stages.length - 1)) * 100}%` }} />
          </div>
          <div className="short-division-timeline__dots" role="group" aria-label="Choose a worked-example step">
            {stages.map((stage, index) => (
              <button
                key={stage.label ?? index}
                type="button"
                className={index === step ? 'is-current' : index < step ? 'is-complete' : ''}
                aria-label={`Go to step ${index + 1}: ${stage.label ?? stage.narration}`}
                aria-current={index === step ? 'step' : undefined}
                onClick={() => goToStep(index)}
              >
                <span aria-hidden="true">{index < step ? '✓' : index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className={`short-division-stage short-division-stage--${direction}`} key={isStepper ? step : 'static'}>
      <div className={`short-division-work${currentStage?.regroup ? ' short-division-work--regrouping' : ''}`} style={{ '--division-columns': dividend.length } as CSSProperties}>
        <div className="short-division-work__quotient" aria-label="Quotient area">
          {dividend.split('').map((_, index) => (
            <span className={shownQuotient[index] != null && shownQuotient[index] !== previousStage?.quotientDigits?.[index] ? 'is-new' : ''} key={index} aria-label={shownQuotient[index] == null ? `No quotient digit shown in position ${index + 1}` : `Quotient digit ${shownQuotient[index]}`}>
              {shownQuotient[index] ?? ''}
            </span>
          ))}
        </div>
        <span className="short-division-work__divisor" aria-label={`Divisor ${divisor}`}>{divisor}</span>
        <div className="short-division-work__dividend" aria-label={`Dividend ${dividend}`}>
          {dividend.split('').map((digit, index) => {
            const isCarryTarget = currentStage?.regroup?.targetIndex === index
            const className = [shownActiveIndices.includes(index) ? 'is-active' : '', isCarryTarget ? 'is-carry-target' : ''].filter(Boolean).join(' ')
            return (
              <span className={className} key={index} aria-label={isCarryTarget ? `${currentStage.regroup?.carryDigit} is carried beside ${digit}, making ${currentStage.regroup?.result}` : undefined}>
                <b className="short-division-work__digit">{digit}</b>
                {isCarryTarget && currentStage.regroup && (
                  <>
                    <i className="short-division-carry-path" aria-hidden="true" />
                    <i className="short-division-carry-token" aria-hidden="true">{currentStage.regroup.carryDigit}</i>
                    <em className="short-division-carry-result" aria-hidden="true"><small>now divide</small>{currentStage.regroup.result}</em>
                  </>
                )}
              </span>
            )
          })}
        </div>
      </div>
      {shownWorking.length > 0 && (
        <ol className="short-division-visual__working" aria-label="Revealed working">
          {shownWorking.map((line) => <li key={line}>{line}</li>)}
        </ol>
      )}
      {currentStage && <figcaption id={captionId} className="short-division-visual__narration" aria-live="polite">{currentStage.narration}</figcaption>}
      {!currentStage && (
        <figcaption id={captionId} className="sr-only">
          {dividend} divided by {divisor}. {shouldShowAnswer && answer ? answer.label : 'The quotient is not yet shown.'}
        </figcaption>
      )}
      </div>
      {isStepper && (
        <div className="short-division-player" role="group" aria-label="Worked example playback controls">
          <button type="button" onClick={() => goToStep(step - 1)} disabled={step === 0}><span aria-hidden="true">←</span> Previous</button>
          <button className="short-division-player__play" type="button" aria-pressed={playing} onClick={togglePlayback}>
            <span aria-hidden="true">{playing ? 'Ⅱ' : isComplete ? '↻' : '▶'}</span>
            {playing ? 'Pause' : isComplete ? 'Replay' : 'Play'}
          </button>
          <button type="button" onClick={() => goToStep(step + 1)} disabled={isComplete}>Next <span aria-hidden="true">→</span></button>
        </div>
      )}
      {isComplete && answer && <p className="short-division-visual__answer">{answer.label}</p>}
    </figure>
  )
}

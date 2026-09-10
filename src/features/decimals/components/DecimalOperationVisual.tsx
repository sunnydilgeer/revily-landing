'use client'

import { useEffect, useId, useState } from 'react'
import type { DecimalOperationStage } from '../../number-types/types'

type Props = {
  kind: 'place-value' | 'add' | 'subtract' | 'multiply' | 'divide'
  expression: string
  mode?: 'static' | 'question' | 'stepper'
  rows?: string[]
  result?: string
  visibleResult?: string
  stages?: DecimalOperationStage[]
  answer?: string
  revealed: boolean
  onComplete?: () => void
}

export function DecimalOperationVisual({ kind, expression, mode = 'question', rows = [], result, visibleResult, stages = [], answer, revealed, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const captionId = useId()
  const isStepper = mode === 'stepper'
  const stage = isStepper ? stages[step] : undefined
  const isComplete = isStepper && stages.length > 0 && step === stages.length - 1
  const shownRows = stage?.rows ?? rows
  const shownResult = revealed ? result : visibleResult

  useEffect(() => { if (isComplete) onComplete?.() }, [isComplete, onComplete])

  useEffect(() => {
    if (!playing) return
    if (isComplete) { setPlaying(false); return }
    const timer = window.setTimeout(() => {
      setDirection('forward')
      setStep((current) => Math.min(stages.length - 1, current + 1))
    }, stage?.durationMs ?? 2400)
    return () => window.clearTimeout(timer)
  }, [isComplete, playing, stage?.durationMs, stages.length])

  function goToStep(next: number) {
    const safe = Math.max(0, Math.min(stages.length - 1, next))
    setDirection(safe < step ? 'backward' : 'forward')
    setStep(safe)
    setPlaying(false)
  }

  function togglePlayback() {
    if (playing) { setPlaying(false); return }
    if (isComplete) { setDirection('backward'); setStep(0) }
    setPlaying(true)
  }

  const accessibleText = stage?.narration ?? `${expression}${shownResult ? ` equals ${shownResult}` : ''}`

  return <figure className={`decimal-operation decimal-operation--${kind} decimal-operation--${mode}`} aria-labelledby={captionId}>
    {isStepper && stage && <div className="decimal-timeline">
      <div className="decimal-timeline__heading"><span>Worked example</span><strong>Step {step + 1} of {stages.length}: {stage.label}</strong></div>
      <div className="decimal-timeline__track" role="progressbar" aria-label="Worked example progress" aria-valuemin={1} aria-valuemax={stages.length} aria-valuenow={step + 1}><span style={{ width: `${stages.length <= 1 ? 100 : (step / (stages.length - 1)) * 100}%` }} /></div>
      <div className="decimal-timeline__dots" role="group" aria-label="Choose a worked-example step">{stages.map((item, index) => <button key={`${item.label}-${index}`} type="button" className={index === step ? 'is-current' : index < step ? 'is-complete' : ''} aria-label={`Go to step ${index + 1}: ${item.label}`} aria-current={index === step ? 'step' : undefined} onClick={() => goToStep(index)}><span aria-hidden="true">{index < step ? '✓' : index + 1}</span></button>)}</div>
    </div>}

    <div className={`decimal-stage decimal-stage--${direction}`} key={isStepper ? step : mode}>
      <div className="decimal-expression" aria-hidden="true">{stage?.expression ?? expression}</div>
      {shownRows.length > 0 && <div className="decimal-work" aria-hidden="true">{shownRows.map((row, index) => <div className={`decimal-work__row ${stage?.activeColumn === index ? 'is-active' : ''}`} key={`${row}-${index}`}>{colourDecimal(row)}</div>)}</div>}
      {stage?.markers && <div className="decimal-markers" aria-hidden="true">{stage.markers.map((marker) => <span key={marker}>{marker}</span>)}</div>}
      {!stage && shownResult && <div className="decimal-result" aria-hidden="true">{shownResult}</div>}
      <figcaption id={captionId} className={stage ? 'decimal-narration' : 'sr-only'} aria-live="polite">{accessibleText}</figcaption>
    </div>

    {isStepper && <div className="decimal-player" role="group" aria-label="Worked example playback controls">
      <button type="button" onClick={() => goToStep(step - 1)} disabled={step === 0}>← Previous</button>
      <button className="decimal-player__play" type="button" aria-pressed={playing} onClick={togglePlayback}><span aria-hidden="true">{playing ? 'Ⅱ' : isComplete ? '↻' : '▶'}</span>{playing ? 'Pause' : isComplete ? 'Replay' : 'Play'}</button>
      <button type="button" onClick={() => goToStep(step + 1)} disabled={isComplete}>Next →</button>
    </div>}
    {isComplete && answer && <p className="decimal-answer">{answer}</p>}
  </figure>
}

function colourDecimal(value: string) {
  return value.split('').map((character, index) => character === '.'
    ? <b className="decimal-point" key={index}>.</b>
    : <span key={index}>{character === ' ' ? '\u00a0' : character}</span>)
}

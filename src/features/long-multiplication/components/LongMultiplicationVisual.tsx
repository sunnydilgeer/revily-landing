'use client'

import { useEffect, useId, useState } from 'react'
import type { CSSProperties } from 'react'
import type { LongMultiplicationStage } from '../../number-types/types'

type Props = {
  multiplicand: string
  multiplier: string
  mode?: 'static' | 'question' | 'stepper'
  stages?: LongMultiplicationStage[]
  onesRow?: string
  tensRow?: string
  total?: string
  visibleOnesRow?: string
  visibleTensRow?: string
  visibleTotal?: string
  answer?: string
  showLabels?: boolean
  revealed: boolean
  onComplete?: () => void
}

export function LongMultiplicationVisual({ multiplicand, multiplier, mode = 'question', stages = [], onesRow, tensRow, total, visibleOnesRow, visibleTensRow, visibleTotal, answer, showLabels = false, revealed, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const captionId = useId()
  const arrowMarkerId = `multiply-arrow-${captionId.replaceAll(':', '')}`
  const isStepper = mode === 'stepper'
  const stage = isStepper ? stages[step] : undefined
  const previous = isStepper && step > 0 ? stages[step - 1] : undefined
  const isComplete = isStepper && stages.length > 0 && step === stages.length - 1
  const shownOnes = stage?.onesRow ?? (revealed ? onesRow : visibleOnesRow)
  const shownTens = stage?.tensRow ?? (revealed ? tensRow : visibleTensRow)
  const shownTotal = stage?.total ?? (revealed ? total : visibleTotal)
  const showMultiplicand = stage?.showMultiplicand ?? true
  const showMultiplier = stage?.showMultiplier ?? true
  const showRule = stage?.showRule ?? true
  const columnCount = Math.max(4, multiplicand.length + multiplier.length, shownOnes?.length ?? 0, shownTens?.length ?? 0, shownTotal?.length ?? 0)

  useEffect(() => { if (isComplete) onComplete?.() }, [isComplete, onComplete])

  useEffect(() => {
    if (!playing) return
    if (isComplete) { setPlaying(false); return }
    const timer = window.setTimeout(() => { setDirection('forward'); setStep((current) => Math.min(stages.length - 1, current + 1)) }, stage?.durationMs ?? 2300)
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

  return <figure className={`long-multiplication-visual long-multiplication-visual--${mode}`} aria-labelledby={captionId}>
    {isStepper && stage && <div className="multiplication-timeline">
      <div className="multiplication-timeline__heading"><span>Worked example</span><strong>Step {step + 1} of {stages.length}: {stage.label}</strong></div>
      <div className="multiplication-timeline__track" role="progressbar" aria-label="Worked example progress" aria-valuemin={1} aria-valuemax={stages.length} aria-valuenow={step + 1}><span style={{ width: `${stages.length <= 1 ? 100 : (step / (stages.length - 1)) * 100}%` }} /></div>
      <div className="multiplication-timeline__dots" role="group" aria-label="Choose a worked-example step">{stages.map((item, index) => <button key={`${item.label}-${index}`} type="button" className={index === step ? 'is-current' : index < step ? 'is-complete' : ''} aria-label={`Go to step ${index + 1}: ${item.label}`} aria-current={index === step ? 'step' : undefined} onClick={() => goToStep(index)}><span aria-hidden="true">{index < step ? '✓' : index + 1}</span></button>)}</div>
    </div>}

    <div className={`multiplication-stage multiplication-stage--${direction}`} key={isStepper ? step : mode}>
      <div className="multiplication-work" style={{ '--multiplication-columns': columnCount } as CSSProperties}>
        {showLabels && <div className="multiplication-work__label">ones under ones</div>}
        {stage?.multiplicationPairs && stage.multiplicationPairs.length > 0 && <DigitArrows pairs={stage.multiplicationPairs} multiplicandLength={multiplicand.length} multiplierLength={multiplier.length} columns={columnCount} markerId={arrowMarkerId} />}
        <NumberRow value={showMultiplicand ? multiplicand : ''} columns={columnCount} activeIndices={stage?.multiplicationPairs?.map((pair) => pair.topIndex)} label={showMultiplicand ? `Top number ${multiplicand}` : 'Top number not shown yet'} />
        <NumberRow value={showMultiplier ? multiplier : ''} columns={columnCount} prefix={showMultiplier ? '×' : undefined} activeIndices={stage?.multiplicationPairs?.map((pair) => pair.bottomIndex)} label={showMultiplier ? `Bottom number ${multiplier}` : 'Bottom number not shown yet'} />
        {showRule && <div className="multiplication-rule" />}
        {shownOnes && <NumberRow value={shownOnes} columns={columnCount} className={`${stage?.active === 'ones' ? 'is-active' : ''} ${shownOnes !== previous?.onesRow ? 'is-new' : ''}`} label={`Ones partial product ${shownOnes}`} />}
        {stage?.active === 'zero' && !shownTens && <NumberRow value="0" columns={columnCount} className="is-active is-new placeholder-row" label="Place-holding zero in the ones column" />}
        {shownTens && <NumberRow value={shownTens} columns={columnCount} className={`${stage?.active === 'tens' || stage?.active === 'zero' ? 'is-active' : ''} ${shownTens !== previous?.tensRow ? 'is-new' : ''}`} label={`Tens partial product ${shownTens}`} />}
        {shownTotal && <><div className="multiplication-rule multiplication-rule--sum" /><NumberRow value={shownTotal} columns={columnCount} className={`${stage?.active === 'add' ? 'is-active is-total' : 'is-total'} ${shownTotal !== previous?.total ? 'is-new' : ''}`} label={`Total ${shownTotal}`} /></>}
      </div>
      {stage?.placeValue && <div className="multiplication-place-value"><span>{stage.placeValue.digit}</span><div><small>{stage.placeValue.place} digit</small><strong>{stage.placeValue.value}</strong></div></div>}
      {stage?.working && <ul className="multiplication-working">{stage.working.map((line) => <li key={line}>{line}</li>)}</ul>}
      {stage && <figcaption id={captionId} className="multiplication-narration" aria-live="polite">{stage.narration}</figcaption>}
      {stage?.nextPrompt && !isComplete && <p className="multiplication-next-prompt"><small>Before you press Next</small>{stage.nextPrompt}</p>}
      {!stage && <figcaption id={captionId} className="sr-only">Column multiplication: {multiplicand} multiplied by {multiplier}.{shownTotal ? ` The product is ${shownTotal}.` : ''}</figcaption>}
    </div>

    {isStepper && <div className="multiplication-player" role="group" aria-label="Worked example playback controls">
      <button type="button" onClick={() => goToStep(step - 1)} disabled={step === 0}>← Previous</button>
      <button className="multiplication-player__play" type="button" aria-pressed={playing} onClick={togglePlayback}><span aria-hidden="true">{playing ? 'Ⅱ' : isComplete ? '↻' : '▶'}</span>{playing ? 'Pause' : isComplete ? 'Replay' : 'Play'}</button>
      <button type="button" onClick={() => goToStep(step + 1)} disabled={isComplete}>Next →</button>
    </div>}
    {isComplete && answer && <p className="multiplication-answer">{answer}</p>}
  </figure>
}

function NumberRow({ value, columns, prefix, className = '', activeIndices = [], label }: { value: string; columns: number; prefix?: string; className?: string; activeIndices?: number[]; label: string }) {
  const padded = value.padStart(columns, ' ')
  const offset = columns - value.length
  return <div className={`multiplication-number-row ${className}`} style={{ '--multiplication-columns': columns } as CSSProperties} aria-label={label}><b aria-hidden="true">{prefix}</b><span aria-hidden="true">{padded.split('').map((digit, index) => <i className={activeIndices.includes(index - offset) ? 'is-multiplying' : ''} key={index}>{digit === ' ' ? '\u00a0' : digit}</i>)}</span></div>
}

function DigitArrows({ pairs, multiplicandLength, multiplierLength, columns, markerId }: { pairs: Array<{ topIndex: number; bottomIndex: number }>; multiplicandLength: number; multiplierLength: number; columns: number; markerId: string }) {
  const xFor = (index: number, length: number) => ((columns - length + index + .5) / columns) * 100
  return <svg className="multiplication-digit-arrows" viewBox="0 0 100 96" preserveAspectRatio="none" aria-hidden="true">
    <defs><marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
    {pairs.map((pair, index) => {
      const fromX = xFor(pair.bottomIndex, multiplierLength)
      const toX = xFor(pair.topIndex, multiplicandLength)
      const bendX = (fromX + toX) / 2 + (index - (pairs.length - 1) / 2) * 2
      return <path key={`${pair.topIndex}-${pair.bottomIndex}-${index}`} d={`M ${fromX} 78 Q ${bendX} 52 ${toX} 31`} markerEnd={`url(#${markerId})`} />
    })}
  </svg>
}

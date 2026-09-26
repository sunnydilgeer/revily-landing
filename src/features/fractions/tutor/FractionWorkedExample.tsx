'use client'

import { useId, useState } from 'react'
import { MathSpan } from '../../../../components/MathText'
import { AnswerBox, StepChip } from '../../../ui'
import { fractionWorkingProgress, type FractionDisplay, type FractionFrame, type FractionWorking } from './fractionWorking'

function FractionCard({ value }: { value: FractionDisplay }) {
  return <div className={`fr-card fr-card--${value.tone ?? 'source'}`}>
    {value.label && <small>{value.label}</small>}
    <div>{value.whole !== undefined && <b>{value.whole}</b>}<span className="fr-stack"><span>{value.numerator}</span><span>{value.denominator}</span></span></div>
  </div>
}

function SegmentedBar({ value }: { value: FractionDisplay }) {
  const whole = value.whole ?? Math.floor(value.numerator / value.denominator)
  const remainder = value.whole !== undefined ? value.numerator : value.numerator % value.denominator
  const complete = value.whole !== undefined ? value.whole : whole
  if (value.denominator > 24) return <FractionCard value={value} />
  return <div className="fr-bar-row">
    <FractionCard value={value} />
    <div className="fr-whole-count" aria-hidden={complete === 0} aria-label={complete > 0 ? `${complete} complete wholes` : undefined}>{complete > 0 && <span>{complete} whole{complete === 1 ? '' : 's'}</span>}</div>
    <div className="fr-segments" style={{ '--parts': value.denominator } as React.CSSProperties} aria-label={`${remainder} of ${value.denominator} parts shaded`}>
      {Array.from({ length: value.denominator }, (_, index) => <i className={index < remainder ? 'is-filled' : ''} key={index} />)}
    </div>
  </div>
}

function FractionFrameView({ frame }: { frame: FractionFrame }) {
  if (frame.kind === 'amount') {
    const sign = frame.currency ? '£' : ''
    return <div className="fr-amount" role="img" aria-label={`${frame.selectedParts} of ${frame.parts} equal parts selected; each part is ${sign}${frame.unitValue}`}>
      <p>{sign}{frame.amount} split into {frame.parts} equal parts</p>
      <div style={{ '--parts': frame.parts } as React.CSSProperties}>{Array.from({ length: frame.parts ?? 0 }, (_, index) => <span className={index < (frame.selectedParts ?? 0) ? 'is-selected' : ''} key={index}>{sign}{frame.unitValue}</span>)}</div>
    </div>
  }
  if (frame.kind === 'reciprocal') return <div className="fr-reciprocal" role="group" aria-label={frame.note}>{frame.values?.map((value, index) => <div key={index}>{index === 2 && <span className="fr-arrow" aria-hidden="true">→</span>}<FractionCard value={value} /></div>)}</div>
  if (frame.kind === 'area') return <div className="fr-area" role="group" aria-label={frame.note}>{frame.values?.map((value, index) => <SegmentedBar value={value} key={index} />)}</div>
  return <div className={frame.kind === 'mixed' ? 'fr-mixed' : 'fr-bars'} role="group" aria-label={frame.note}>{frame.values?.map((value, index) => <SegmentedBar value={value} key={index} />)}</div>
}

/** Right-hand side of the last step, e.g. "\\frac{3}{4}" from "\\frac{18}{24}=\\frac{3}{4}". */
function finalValue(visual: FractionWorking) {
  const last = visual.steps.at(-1)?.equation ?? ''
  return last.includes('=') ? last.slice(last.lastIndexOf('=') + 1) : ''
}

export function FractionWorkedExample({ visual }: { visual: FractionWorking }) {
  const [revealed, setRevealed] = useState(0)
  const { total, current, completed } = fractionWorkingProgress(visual, revealed)
  const done = revealed === total
  const answer = finalValue(visual)
  return <figure className="fr-worked rung-worked" data-revealed-steps={revealed}>
    <div className="rung-worked__question" aria-label="Worked example">
      <MathSpan latex={visual.expression} />
      <AnswerBox solved={done && Boolean(answer)} value={<MathSpan latex={answer} />} />
    </div>
    {current && <FractionFrameView frame={current.frame} />}
    {completed.length > 0 && <ol className="rv-working rung-worked__lines" aria-label="Working so far">
      {completed.map((step, index) => <li className={`rv-line rv-step rv-step--biro${index === completed.length - 1 ? ' is-current' : ''}`} key={index}>
        <span className="rv-line__expr"><MathSpan latex={step.equation} /></span>
        <span className="rv-line__note"><StepChip tone="biro">{index + 1}</StepChip>{step.title}</span>
      </li>)}
    </ol>}
    <p className="rung-worked__say" aria-live="polite">{current ? current.instruction : 'Go through the working one step at a time.'}</p>
    <div className="rung-worked__controls">
      <button type="button" className="rv-btn rv-btn--secondary rv-icon-btn" aria-label="Previous step" disabled={!revealed} onClick={() => setRevealed(n => n - 1)}>←</button>
      <button type="button" className={`rv-btn ${done ? 'rv-btn--secondary' : 'rv-btn--dark'}`} disabled={done} onClick={() => setRevealed(n => n + 1)}>
        {revealed ? done ? `All ${total} steps shown` : `Next step (${revealed + 1} of ${total})` : 'Show the first step'}
      </button>
      <button type="button" className="rv-btn rv-btn--ghost" aria-label="Replay the working from the start" disabled={!revealed} onClick={() => setRevealed(0)}>Replay</button>
    </div>
  </figure>
}

export function AnswerFractionWorking({ visual }: { visual: FractionWorking }) {
  const [open, setOpen] = useState(false), id = useId()
  return <div className="wms-answer-working"><button type="button" className="lesson-secondary-action" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{open ? 'Hide step by step' : 'See this calculation step by step'}</button><div id={id} className="pvb-stage" hidden={!open}><FractionWorkedExample visual={visual} /></div></div>
}

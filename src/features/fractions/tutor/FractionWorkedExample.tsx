'use client'

import { useId, useState } from 'react'
import { MathSpan } from '../../../../components/MathText'
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

export function FractionWorkedExample({ visual }: { visual: FractionWorking }) {
  const [revealed, setRevealed] = useState(0)
  const { total, current, completed } = fractionWorkingProgress(visual, revealed)
  return <figure className="fr-worked" data-revealed-steps={revealed}>
    <p className="wm-step-label">{revealed ? `Step ${revealed} of ${total}` : 'Ready to start'}</p>
    <div className="wmt-original" aria-label="Original calculation"><MathSpan latex={visual.expression} display /></div>
    {current ? <>
      <FractionFrameView frame={current.frame} />
      <div className="wms-current" role="group" aria-label="Current fraction step"><p className="wms-current-title">{current.title}</p><div className="wmt-math"><MathSpan latex={current.equation} display /></div><p>{current.instruction}</p></div>
    </> : <p className="wms-start">Click Next to begin the working.</p>}
    <div className="wm-controls wms-controls"><button type="button" aria-label="Previous fraction step" disabled={!revealed} onClick={() => setRevealed(n => n - 1)}>← Back</button><button type="button" aria-label="Next fraction step" disabled={revealed === total} onClick={() => setRevealed(n => n + 1)}>Next →</button><button type="button" aria-label="Replay fraction working" disabled={!revealed} onClick={() => setRevealed(0)}>Replay</button></div>
    {completed.length > 1 && <><p className="wms-history-title">Earlier working</p><ol className="wms-history" aria-label="Earlier fraction working">{completed.slice(0, -1).map((step, index) => <li key={index}><span className="wms-history-number" aria-hidden="true">{index + 1}</span><div><div className="wmt-math"><MathSpan latex={step.equation} /></div><p>{step.instruction}</p></div></li>)}</ol></>}
    <p className="sr-only" aria-live="polite">{current?.instruction ?? 'No fraction steps revealed.'}</p>
  </figure>
}

export function AnswerFractionWorking({ visual }: { visual: FractionWorking }) {
  const [open, setOpen] = useState(false), id = useId()
  return <div className="wms-answer-working"><button type="button" className="lesson-secondary-action" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{open ? 'Hide step by step' : 'See this calculation step by step'}</button><div id={id} className="pvb-stage" hidden={!open}><FractionWorkedExample visual={visual} /></div></div>
}

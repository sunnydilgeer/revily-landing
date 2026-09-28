'use client'

import { useMemo } from 'react'
import { WorkedChain } from '../../maths/step-chain/WorkedChain'
import { methodChain } from './methodChain'
import { MathSpan } from '../../../../components/MathText'
import type { HopFrame, IntervalFrame, MethodWorking, OrderingFrame, RoundingFrame } from './methodWorking'

export function isNumberSenseWorking(visual: MethodWorking) {
  return visual.examples.every(example => example.method === 'rounding' || example.method === 'ordering' || example.method === 'estimate' || example.method === 'standard-form')
}

function RoundingVisual({ frame }: { frame: RoundingFrame }) {
  if (frame.stage === 'result') return <div className="ns-result"><span className="ns-original">{frame.original}</span><span aria-hidden="true">→</span><strong>{frame.answer}</strong></div>
  return <>
    <div className="ns-rounding" role="img" aria-label={frame.chop ? `${frame.original}. Keep ${frame.kept}. Chop off the rest.` : `${frame.original}. Keep ${frame.kept}. The decision digit is ${frame.decisionDigit}.`}>
      <div className="ns-rounding-digits" aria-hidden="true">
        <span className="ns-kept">{frame.kept.slice(0, -1)}<b>{frame.kept.slice(-1)}</b></span>
        <span className="ns-cut" />
        {frame.pointAfterKept && <span className="ns-point">.</span>}
        <b className="ns-decision">{frame.decisionDigit}</b>
        <span className="ns-remaining">{frame.remaining}</span>
      </div>
      <div className="ns-key" aria-hidden="true"><span>Last digit kept</span><span>{frame.chop ? 'Chopped off' : 'Decision digit'}</span></div>
    </div>
    {frame.stage === 'decide' && <p className="ns-rule">{frame.decisionDigit} {frame.roundsUp ? '≥' : '<'} 5 <span aria-hidden="true">→</span> <strong>{frame.roundsUp ? 'round up' : 'keep the digit'}</strong></p>}
  </>
}

function IntervalVisual({ frame }: { frame: IntervalFrame }) {
  const lower = Number(frame.lower), upper = Number(frame.upper), value = Number(frame.value)
  const pad = (upper - lower) * 0.45, min = lower - pad, max = upper + pad
  const x = (n: number) => 24 + (n - min) / (max - min) * 272
  const bounds = frame.stage !== 'value', interval = frame.stage === 'interval'
  const inside = frame.test !== undefined && Number(frame.test) >= lower && Number(frame.test) < upper
  const label = interval
    ? `Number line: ${frame.lower} is included, ${frame.upper} is not.${frame.test ? ` ${frame.test} is ${inside ? 'inside' : 'outside'} the interval.` : ''}`
    : bounds ? `Number line: ${frame.value} with bounds ${frame.lower} and ${frame.upper}.` : `Number line around ${frame.value}.`
  return <svg className="ns-line" viewBox="0 0 320 96" role="img" aria-label={label}>
    <line className="ns-line__axis" x1="8" x2="312" y1="56" y2="56" />
    {interval && <rect className="ns-line__band" x={x(lower)} y="50" width={x(upper) - x(lower)} height="12" rx="3" />}
    {value !== lower && <g className="ns-line__value"><line x1={x(value)} x2={x(value)} y1="46" y2="66" /><text x={x(value)} y="36">{frame.value}</text></g>}
    {bounds && ([[lower, frame.lower], [upper, frame.upper]] as const).map(([n, text], i) => <g key={i} className="ns-line__bound">
      <line x1={x(n)} x2={x(n)} y1="48" y2="64" />
      <text x={x(n)} y="86">{text}</text>
      {interval && <circle cx={x(n)} cy="56" r="6" className={i ? 'is-open' : 'is-closed'} />}
    </g>)}
    {value === lower && <text className="ns-line__value" x={x(value)} y="36">{frame.value}</text>}
    {frame.test && <g className={`ns-line__test${inside ? ' is-inside' : ''}`}><path d={`M${x(Number(frame.test))} 44l-6 -9h12z`} /><text x={Math.min(290, Math.max(30, x(Number(frame.test))))} y="20">{frame.test}</text></g>}
  </svg>
}

function HopVisual({ frame }: { frame: HopFrame }) {
  const { cells, start, end, stage } = frame
  const moved = stage !== 'start', places = Math.abs(end - start), left = end < start
  const added = new Set(frame.added), dropped = new Set(stage === 'result' ? frame.dropped : [])
  // Hop k (1, 2, 3…) passes over one cell, counted from where the point starts.
  const hopOver = new Map<number, number>()
  if (moved) for (let k = 1; k <= places; k++) hopOver.set(left ? start - k : start + k - 1, k)
  const point = (gap: number) => {
    if (gap === (moved ? end : start)) return <span key={`p${gap}`} className={`ns-hop-point${gap === cells.length ? ' is-trailing' : ''}`}>.</span>
    if (moved && gap === start) return <span key={`p${gap}`} className="ns-hop-point is-ghost">.</span>
    return null
  }
  const direction = `${places} place${places === 1 ? '' : 's'} ${left ? 'left' : 'right'}`
  const label = moved ? `The point hops ${direction}.${frame.added?.length ? ' Empty places are filled with zeros.' : ''}${frame.answer ? ` ${frame.answer}` : ''}` : `${cells.filter((_, i) => !added.has(i)).join('')}, with the point after ${start} digit${start === 1 ? '' : 's'}.`
  return <div className="ns-hop" role="img" aria-label={label}>
    <div className="ns-hop-row" aria-hidden="true">
      {cells.map((cell, i) => [point(i), <span key={i} className={`ns-hop-cell${added.has(i) ? ' is-added' : ''}${dropped.has(i) ? ' is-dropped' : ''}${hopOver.has(i) ? ' is-hopped' : ''}`}>
        {hopOver.has(i) && <i className="ns-hop-arc"><b>{hopOver.get(i)}</b></i>}
        {added.has(i) && !moved ? '' : cell}
      </span>])}
      {point(cells.length)}
    </div>
    {moved && <p className="ns-hop-note" aria-hidden="true">{left ? `← ${direction}` : `${direction} →`}</p>}
    {stage === 'result' && frame.answer && <p className="ns-hop-answer" aria-hidden="true">{frame.answer}</p>}
  </div>
}

function OrderingVisual({ frame }: { frame: OrderingFrame }) {
  if (frame.answer) return <p className="ns-order-answer">{frame.answer}</p>
  if (frame.comparison) {
    const parts = frame.comparison.split(/([<>])/)
    return <div className="ns-comparison" role="img" aria-label={frame.comparison.replaceAll('\\,', ' ').replaceAll('<', ' is less than ').replaceAll('>', ' is greater than ')}>
      {parts.map((part, index) => index % 2 === 0 && <span className="ns-comparison-pair" key={index} aria-hidden="true">{index > 0 && <span className="ns-comparison-sign">{parts[index - 1]}</span>}<MathSpan latex={part} /></span>)}
    </div>
  }
  return <ul className="ns-values" aria-label="Comparable values">{frame.values?.map((value, index) => {
    const separator = value.indexOf(':')
    return <li key={index}>{separator > -1 ? <><span>{value.slice(0, separator)}</span><strong>{value.slice(separator + 1).trim()}</strong></> : <strong>{value}</strong>}</li>
  })}</ul>
}

export function NumberSenseWorkedExample({ visual }: { visual: MethodWorking }) {
  const chain = useMemo(() => methodChain(visual), [visual])
  const picture = (revealed: number) => {
    const at = chain.slice(0, revealed).findLast(line => line.at)?.at
    const frame = at && visual.examples[at.example ?? 0].steps[at.step]?.frame
    if (!frame || !(frame.rounding || frame.interval || frame.ordering || frame.hop)) return null
    return <div className="ns-visual rung-worked__visual">
      {frame.rounding && <RoundingVisual frame={frame.rounding} />}
      {frame.interval && <IntervalVisual frame={frame.interval} />}
      {frame.ordering && <OrderingVisual frame={frame.ordering} />}
      {frame.hop && <HopVisual frame={frame.hop} />}
    </div>
  }
  return <WorkedChain steps={chain} picture={picture} />
}

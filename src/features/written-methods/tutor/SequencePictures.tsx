import type { ReactNode } from 'react'
import type { SequenceFrame } from './methodWorking'
import { Powers } from './Powers'

/*
 * Sequences (lesson 23), like the A9 videos: the terms in a row with the jump between each pair above them (+ 4, × 2),
 * rows lined up under the terms (4n: 4, 8, 12, 16, then what to add to each), any lines of working (6 ÷ 3 = 2), then
 * carrying on from the last term to the next ones (green once worked out), and the answer. Terms are blue, jumps amber, a row
 * that compares purple, and the answer green, as in EXPLANATIONS.md.
 */

function spoken(frame: SequenceFrame) {
  const parts = frame.terms.length ? [`The sequence ${frame.terms.join(', ')}${frame.more ? ', and so on' : ''}.`] : []
  if (frame.hops) parts.push(`The jumps: ${frame.hops.labels.join(', ')}.`)
  for (const row of frame.rows ?? []) parts.push(`${row.label ? `${row.label}: ` : ''}${row.cells.join(', ')}.`)
  if (frame.next) parts.push(`Carry on: ${frame.next.terms.map((term, i) => `${frame.next!.hops[i]} gives ${frame.next!.filled ? term : 'a new term'}`).join(', ')}.`)
  for (const line of frame.lines ?? []) parts.push(`${line.text}.`)
  if (frame.answer) parts.push(`The answer: ${frame.answer.text}.`)
  return parts.join(' ').replace(/[[\]]/g, '')
}

/** The picture so far. `plain` is the question before any working. The step's heading goes above what it adds. */
export function SequenceVisual({ frame, heading, plain, focus }: { frame: SequenceFrame; heading?: ReactNode; plain?: boolean; focus?: boolean }) {
  // Older parts grey out; what the step before added stays clear, because this step works on it (Sunny, 1 Oct).
  const done = (at: number) => focus && !plain && frame.step > 0 && at < frame.step - 1 ? ' is-done' : ''
  // Columns for the terms, or for the longest row when the question gives no terms (the first five terms of 3n − 2).
  const n = Math.max(frame.terms.length, ...(frame.rows ?? []).map(row => row.cells.length))
  const head = (adds: SequenceFrame['adds'], at?: number) => !plain && frame.adds === adds && (at === undefined || at === frame.step) && heading
    ? <div className="ns-seq__heading">{heading}</div> : null
  const columns = n ? `auto repeat(${n - 1}, minmax(1.9em, max-content) auto) minmax(1.9em, max-content)` : undefined
  // "…" hangs off the last term, so it doesn't widen the column.
  const cells = (items: string[], className: string, label = '', at?: number, answer?: boolean, more?: boolean) => [
    <span key="label" className={`ns-seq__label${at !== undefined ? done(at) : ''}`}><Powers text={label} /></span>,
    ...items.flatMap((item, i) => [
      <span key={`c${i}`} className={`${className}${answer ? ' is-answer' : ''}${at !== undefined ? done(at) : ''}`}><Powers text={item} />{more && i === items.length - 1 && <span className="ns-seq__more">…</span>}</span>,
      i < items.length - 1 ? <span key={`g${i}`} /> : null,
    ]),
  ]
  return <div className={`ns-seq${plain ? ' is-plain' : ''}`} role="img" aria-label={plain ? `The question: ${spoken({ ...frame, hops: undefined, rows: undefined, next: undefined, lines: undefined, answer: undefined })}` : spoken(frame)}>
    {head('hops')}
    {n > 0 && <div className="ns-seq__grid" style={{ gridTemplateColumns: columns }} aria-hidden="true">
      {frame.hops && !plain && frame.terms.length > 0 && [<span key="hl" />, ...frame.terms.flatMap((_, i) => [
        <span key={`hs${i}`} />,
        i < n - 1 ? <span key={`h${i}`} className={`ns-seq__hop is-f1${done(frame.hops!.at)}`}><Powers text={frame.hops!.labels[i] ?? ''} /><span className="ns-seq__arc" /></span> : null,
      ])]}
      {frame.terms.length > 0 && cells(frame.terms, 'ns-seq__term', '', undefined, false, frame.more)}
      {!plain && frame.rows?.map((row, r) => <div key={`row${r}`} className={`ns-seq__row is-f${row.family % 4}`}>
        {head('row', row.at)}
        {cells(row.cells, 'ns-seq__cell', row.label, row.at, row.answer)}
      </div>)}
    </div>}
    {!plain && frame.lines?.map((line, i) => [
      head('lines', line.at) && frame.lines!.findIndex(l => l.at === frame.step) === i && <div key={`lh${i}`} className="ns-seq__heading">{heading}</div>,
      <p key={`l${i}`} className={`ns-seq__line is-f${line.family % 4}${done(line.at)}`} aria-hidden="true"><Powers text={line.text} /></p>,
    ])}
    {!plain && frame.next && <>
      {head('next')}
      <p className={`ns-seq__next${done(frame.next.at)}`} aria-hidden="true">
        <span className="ns-seq__term">{frame.terms.at(-1)}</span>
        {frame.next.terms.map((term, i) => <span key={i} className="ns-seq__step">
          <span className="ns-seq__jump is-f1"><Powers text={frame.next!.hops[i]} /><span aria-hidden="true">→</span></span>
          <span className={`ns-seq__new${frame.next!.filled ? ' is-answer' : ''}`}>{frame.next!.filled ? term : '?'}</span>
        </span>)}
      </p>
    </>}
    {!plain && frame.answer && <>
      {head('answer')}
      <p className="ns-eq__answer" aria-hidden="true"><Powers text={frame.answer.text} /></p>
    </>}
  </div>
}

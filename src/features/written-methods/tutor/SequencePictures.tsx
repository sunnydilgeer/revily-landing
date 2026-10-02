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
  const head = (adds: SequenceFrame['adds'], at?: number) => !plain && frame.adds === adds && (at === undefined || at === frame.step) && heading
    ? <div className="ns-seq__heading">{heading}</div> : null
  // The terms, then the new ones carrying on in the same row at the same spacing (Sunny, 2 Oct): each term is a small
  // column with the jump into it above, so a phone wraps whole terms onto the next line.
  const next = !plain ? frame.next : undefined
  const all = [...frame.terms.map(text => ({ text, kind: 'given' as const })), ...(next?.terms ?? []).map(text => ({ text, kind: 'new' as const }))]
  const hopInto = (i: number) => i === 0 ? null
    : i < frame.terms.length ? frame.hops && !plain ? { label: frame.hops.labels[i - 1] ?? '', at: frame.hops.at } : null
    : { label: next!.hops[i - frame.terms.length], at: next!.at }
  // Rows under the terms (the times table, what to add) are their own lines, lined up with the terms' columns.
  const columns = Math.max(all.length, ...(frame.rows ?? []).map(row => row.cells.length))
  const wide = columns > 4 ? ' is-wide' : ''
  // Every column is as wide as the widest thing in any row (4×4 under 16), so the rows line up.
  const longest = Math.max(0, ...all.map(term => term.text.length), ...(frame.rows ?? []).flatMap(row => row.cells.map(cell => cell.replace(/\s/g, '').length)))
  const style = longest > 2 ? { ['--seq-col' as string]: `${(0.62 * longest + 0.4).toFixed(2)}em` } : undefined
  return <div className={`ns-seq${plain ? ' is-plain' : ''}${wide}`} style={style} role="img" aria-label={plain ? `The question: ${spoken({ ...frame, hops: undefined, rows: undefined, next: undefined, lines: undefined, answer: undefined })}` : spoken(frame)}>
    {(head('hops') ?? head('next'))}
    {all.length > 0 && <p className="ns-seq__terms" aria-hidden="true">{all.map((term, i) => {
      const hop = hopInto(i)
      const filled = term.kind === 'given' || next!.filled
      return <span key={i} className="ns-seq__unit">
        {i > 0 && <span className={`ns-seq__hop is-f1${hop ? done(hop.at) : ''}`}>{hop && <><span className="ns-seq__jumplabel"><Powers text={hop.label.replace(' ', '')} /></span><span className="ns-seq__arc" /></>}</span>}
        <span className={term.kind === 'given' ? 'ns-seq__term' : `ns-seq__new${filled ? ' is-answer' : ''}${done(next!.at)}`}>
          {filled ? <Powers text={term.text} /> : '?'}
        </span>
      </span>
    })}{frame.more && !next && <span className="ns-seq__more">…</span>}</p>}
    {!plain && frame.rows?.map((row, r) => <div key={`row${r}`} className={`ns-seq__rowblock is-f${row.family % 4}`}>
      {head('row', row.at)}
      <p className="ns-seq__terms" aria-hidden="true">{row.cells.map((cell, i) => <span key={i} className="ns-seq__unit">
        {i > 0 && <span className="ns-seq__hop" />}
        <span className={`ns-seq__cell${row.answer ? ' is-answer' : ''}${done(row.at)}`}><Powers text={cell} /></span>
      </span>)}{frame.more && !next && <span className="ns-seq__more is-spacer">…</span>}</p>
    </div>)}
    {!plain && frame.lines?.map((line, i) => [
      head('lines', line.at) && frame.lines!.findIndex(l => l.at === frame.step) === i && <div key={`lh${i}`} className="ns-seq__heading">{heading}</div>,
      <p key={`l${i}`} className={`ns-seq__line is-f${line.family % 4}${done(line.at)}`} aria-hidden="true"><Powers text={line.text} /></p>,
    ])}
    {!plain && frame.answer && <>
      {head('answer')}
      <p className="ns-eq__answer" aria-hidden="true"><Powers text={frame.answer.text} /></p>
    </>}
  </div>
}

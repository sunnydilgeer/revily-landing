'use client'

import type { CSSProperties } from 'react'
import { WorkedChain } from '../../maths/step-chain/WorkedChain'
import type { ChainStep } from '../../maths/step-chain/StepChain'
import { PictureStep, RoundingVisual } from './NumberSenseWorkedExample'
import { Powers } from './Powers'
import type { MethodExample, MethodStep } from './methodWorking'
import { MethodPicture as MethodPictureView } from './MethodWorkedExample'
import type { BusStopPicture, ColumnsPicture, StepLine, StepPicture, StepWorking } from './stepWorking'

const cls = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(' ')

/** Numbers in columns with their points lined up; the column worked on is highlighted, carries sit above the answer. */
function Columns({ picture }: { picture: ColumnsPicture }) {
  const split = (n: string) => { const [i, d = ''] = n.split('.'); return { i, d } }
  const rows = picture.rows.map(split)
  const places = Math.max(...rows.map(r => r.d.length))
  const whole = Math.max(...rows.map(r => r.i.length), picture.answer ? picture.answer.length - places : 0)
  const width = whole + places
  const point = places > 0
  // Each digit column, from the left; `col` counts from the right, as the steps do.
  const cols = Array.from({ length: width }, (_, k) => width - 1 - k)
  const digitAt = (row: { i: string; d: string }, col: number) => {
    if (col < places) { const k = places - 1 - col; return k < row.d.length ? { digit: row.d[k] } : picture.padded ? { digit: '0', added: true } : null }
    const k = row.i.length - 1 - (col - places)
    return k >= 0 ? { digit: row.i[k] } : null
  }
  const cells = (render: (col: number) => React.ReactNode, pointCell: React.ReactNode = '') => cols.flatMap(col => [
    <span key={col} className={cls('sp-col', col === picture.focus && 'is-focus')}>{render(col)}</span>,
    ...(point && col === places ? [<span key="point" className="sp-point">{pointCell}</span>] : []),
  ])
  const answerDigit = (col: number) => picture.answer && col < picture.answer.length ? picture.answer[picture.answer.length - 1 - col] : ''
  const regroup = (col: number) => picture.regroups?.find(r => r.col === col)
  const carry = (col: number) => picture.carries?.find(c => c.col === col)
  const spoken = `${picture.rows.join(` ${picture.op === '+' ? 'plus' : 'minus'} `)}${picture.answer ? `, answer so far ${picture.answer}` : ''}`
  return <div className="sp-columns" style={{ '--sp-cols': width + (point ? 1 : 0) } as CSSProperties} role="img" aria-label={spoken}>
    {picture.regroups?.length ? <div className="sp-row sp-small" aria-hidden="true"><span />{cells(col => { const r = regroup(col); return r ? <b className={cls('sp-regroup', r.boxed && 'is-boxed')}>{r.to}</b> : '' })}</div> : null}
    {rows.map((row, r) => <div key={r} className="sp-row" aria-hidden="true">
      <span className="sp-op">{r === rows.length - 1 ? picture.op : ''}</span>
      {cells(col => { const d = digitAt(row, col); if (!d) return ''; return <span className={cls(d.added && 'is-added', r === 0 && regroup(col) && 'is-struck')}>{d.digit}</span> }, row.d.length || picture.padded ? '.' : '')}
    </div>)}
    <div className="sp-rule" />
    {picture.carries?.length ? <div className="sp-row sp-small" aria-hidden="true"><span />{cells(col => { const c = carry(col); return c ? <b className={cls('sp-carry', c.boxed && 'is-boxed', c.used && 'is-used')}>{c.value}</b> : '' })}</div> : null}
    <div className={cls('sp-row', 'sp-answer', picture.done && 'is-done')} aria-hidden="true"><span />{cells(answerDigit, picture.answer && picture.answer.length > places ? '.' : '')}</div>
  </div>
}

/** Short division: the quotient on top, the divisor outside, carries tucked in before the next digit. */
function BusStop({ picture }: { picture: BusStopPicture }) {
  const chars = [...picture.dividend]
  const quotient = [...picture.quotient.padEnd(chars.length, ' ')]
  return <div className="sp-bus" style={{ '--sp-cols': chars.length } as CSSProperties} role="img" aria-label={`${picture.dividend} divided by ${picture.divisor}${picture.quotient.trim() ? `, answer so far ${picture.quotient.trim()}` : ''}`}>
    <div className={cls('sp-bus__top', picture.done && 'is-done')} aria-hidden="true"><span />{quotient.map((q, i) => <span key={i} className={q === '.' || chars[i] === '.' ? 'sp-point' : undefined}>{q.trim()}</span>)}</div>
    <div className="sp-bus__row" aria-hidden="true"><span className="is-f0">{picture.divisor}</span><div>{chars.map((c, i) => {
      const carried = picture.carries.find(k => k.index === i)
      return <span key={i} className={cls(i === picture.focus && 'is-focus', c === '.' && 'sp-point')}>{carried && <sup>{carried.value}</sup>}{c}</span>
    })}</div></div>
  </div>
}

function Picture({ picture }: { picture: StepPicture }) {
  if (picture.kind === 'rounding') return <div className="rung-worked__visual sp-picture"><RoundingVisual frame={picture.frame} /></div>
  if (picture.kind === 'method') return <div className="rung-worked__visual sp-picture"><MethodPictureView example={{ method: picture.method, first: picture.first } as MethodExample} frame={picture.frame} /></div>
  return <div className="rung-worked__visual sp-picture">{picture.kind === 'columns' ? <Columns picture={picture} /> : <BusStop picture={picture} />}</div>
}

function Lines({ lines, faded }: { lines: StepLine[]; faded?: boolean }) {
  return <ul className={cls('ns-term-groups sp-lines', faded && 'is-old')} aria-label={lines.map(l => `${l.parts.map(p => p.text).join(' ')}${l.result ? ` gives ${l.result}` : ''}${l.mark ? `, ${l.mark}` : ''}`).join('. ')}>
    {lines.map((l, i) => <li key={i} aria-hidden="true">
      <span className="sp-parts">{l.parts.map((p, j) => <span key={j} className={cls(p.family !== undefined && `is-f${p.family}`, p.boxed && 'ns-shared', p.struck && 'is-struck')}><Powers text={p.text} /></span>)}</span>
      {l.result !== undefined && <><span>{l.eq ? '=' : '→'}</span><strong className={l.answer ? 'sp-answer-pill' : 'sp-result'}><Powers text={l.result} /></strong></>}
      {l.mark && <small className={cls('sp-mark', l.mark === '✓' && 'is-ok')}>{l.mark}</small>}
    </li>)}
  </ul>
}

/**
 * A step working (stepWorking.ts): the opening picture plain, then one move a step. The step's heading sits under the
 * picture and above the lines it adds; its ⓘ opens below. The answer is drawn once, in green, by the last move.
 */
export function StepWorkedExample({ working }: { working: StepWorking }) {
  const chain: ChainStep[] = [{ line: 'question' }, ...working.steps.map(step => ({ line: step.title, op: step.title, why: step.why }))]
  const given = working.given && <p className="sp-given"><Powers text={working.given} /></p>
  const picture = (revealed: number) => {
    const index = revealed - 2
    if (index < 0) return <div className="ns-visual sp-working">{given}{working.opening ? <Picture picture={working.opening} /> : working.start && <p className="sp-start"><Powers text={working.start} /></p>}</div>
    const step = working.steps[index]
    const shown = working.steps.slice(0, index + 1).findLast(s => s.picture)?.picture ?? working.opening
    const earlier = working.trail ? working.steps.slice(0, index).flatMap(s => s.lines ?? []) : []
    return <div className="ns-visual sp-working" key={revealed}>
      <PictureStep step={{ title: step.title, instruction: step.why, tag: step.tag, operation: '', equation: '', frame: {} } as MethodStep}>{heading => <>
        {given}
        {shown && <Picture picture={shown} />}
        {earlier.length > 0 && <Lines lines={earlier} faded />}
        {heading}
        {step.lines && <Lines lines={step.lines} />}
        {step.words && <p className="sp-answer-pill sp-words"><Powers text={step.words} /></p>}
      </>}</PictureStep>
    </div>
  }
  return <WorkedChain steps={chain} picture={picture} pictureOnly />
}

'use client'

import type { ReactNode } from 'react'
import { MathSpan } from '../../../../components/MathText'
import { AnswerBox, StepChip } from '../../../ui'

export type WorkedLine = { key: string; math: string; note: string; group?: string }

/** The value after the last "=" (or "≈") in a LaTeX equation, used to fill the "= ?" box. */
export function finalValue(latex?: string) {
  if (!latex) return ''
  const equals = latex.lastIndexOf('='), approx = latex.lastIndexOf('\\approx')
  if (approx > equals) return latex.slice(approx + '\\approx'.length).trim()
  return equals >= 0 ? latex.slice(equals + 1).trim() : ''
}

/**
 * One worked example, one job per line.
 * The question sits at the top with its "= ?" box; the picture shows the current step; every step
 * revealed so far stays on the page as a line of working with a numbered chip and a handwritten note.
 */
export function WorkedLines({ question, answer, solved, sign, visual, lines, say, revealed, total, onReveal }: {
  question: string
  answer?: string
  /** Defaults to "every step shown"; pass it when one figure holds several examples. */
  solved?: boolean
  /** "≈" for rounding, where the answer is not equal to the question. */
  sign?: '=' | '≈'
  visual?: ReactNode
  lines: WorkedLine[]
  say?: string
  revealed: number
  total: number
  onReveal: (next: number) => void
}) {
  const done = revealed === total
  let lastGroup: string | undefined
  return <figure className="rung-worked" data-revealed-steps={revealed}>
    <div className="rung-worked__question" aria-label="Worked example">
      <MathSpan latex={question} />
      {answer && <AnswerBox sign={sign} solved={solved ?? done} value={<MathSpan latex={answer} />} />}
    </div>
    {visual}
    {lines.length > 0 && <ol className="rv-working rung-worked__lines" aria-label="Working so far">
      {lines.flatMap((line, index) => {
        const items = []
        if (line.group && line.group !== lastGroup) items.push(<li className="rung-worked__group" key={`${line.key}-group`}>{line.group}</li>)
        lastGroup = line.group
        items.push(<li className={`rv-line rv-step rv-step--biro${index === lines.length - 1 ? ' is-current' : ''}`} key={line.key}>
          <span className="rv-line__expr"><MathSpan latex={line.math} /></span>
          <span className="rv-line__note"><StepChip tone="biro">{index + 1}</StepChip>{line.note}</span>
        </li>)
        return items
      })}
    </ol>}
    <p className="rung-worked__say" aria-live="polite">{say ?? 'Go through the working one step at a time.'}</p>
    <div className="rung-worked__controls">
      <button type="button" className="rv-btn rv-btn--secondary rv-icon-btn" aria-label="Previous step" disabled={!revealed} onClick={() => onReveal(revealed - 1)}>←</button>
      <button type="button" className={`rv-btn ${done ? 'rv-btn--secondary' : 'rv-btn--dark'}`} disabled={done} onClick={() => onReveal(revealed + 1)}>
        {revealed ? done ? `All ${total} steps shown` : `Next step (${revealed + 1} of ${total})` : 'Show the first step'}
      </button>
      <button type="button" className="rv-btn rv-btn--ghost" aria-label="Replay the working from the start" disabled={!revealed} onClick={() => onReveal(0)}>Replay</button>
    </div>
  </figure>
}

'use client'

import type { ReactNode } from 'react'
import { WorkedChain } from '../../maths/step-chain/WorkedChain'
import type { ChainStep } from '../../maths/step-chain/StepChain'
import { PictureStep } from '../../written-methods/tutor/NumberSenseWorkedExample'
import { Powers } from '../../written-methods/tutor/Powers'
import type { MethodStep } from '../../written-methods/tutor/methodWorking'
import { plainRow, type BoardWorking } from './opsBoard'
import '../../written-methods/tutor/NumberSenseLesson.css'

/** Text with [boxed] parts in a purple box and {new} values in blue. */
function Marked({ text }: { text: string }) {
  return <>{text.split(/(\[[^\]]*\]|\{[^}]*\})/).map((part, i) => part.startsWith('[')
    ? <span key={i} className="ob-box"><Powers text={part.slice(1, -1)} /></span>
    : part.startsWith('{') ? <span key={i} className="ob-new"><Powers text={part.slice(1, -1)} /></span>
    : <Powers key={i} text={part} />)}</>
}

/** One row of the board: an expression, or a fraction (top | bottom); a mark around the whole row applies to all of it. */
function Row({ text, prefix, tone }: { text: string; prefix?: string; tone?: 'old' | 'answer' }) {
  const whole = /^\[.*\]$/.test(text) && !text.slice(1, -1).includes('[') ? 'ob-box' : /^\{.*\}$/.test(text) && !text.slice(1, -1).includes('{') ? 'ob-new' : ''
  const body = whole ? text.slice(1, -1) : text
  const [top, bottom] = body.split(' | ')
  const maths: ReactNode = bottom === undefined ? <Marked text={top} /> : <span className="ob-frac"><span><Marked text={top} /></span><span><Marked text={bottom} /></span></span>
  return <p className={`ob-row${tone ? ` is-${tone}` : ''}`} aria-hidden="true">
    {prefix && <span className="ob-prefix">{prefix}</span>}
    <span className={whole}>{maths}</span>
  </p>
}

const spoken = (text: string) => plainRow(text).replace(' | ', ' over ')

/**
 * A BIDMAS working as a board (opsBoard.ts): the question plain, then one move a step. Earlier rows stay, faded; the
 * current row boxes what this step works out, the heading sits under it, and the new row follows. The last row is green.
 */
export function OpsBoard({ working }: { working: BoardWorking }) {
  const chain: ChainStep[] = [{ line: working.start }, ...working.steps.map(step => ({ line: plainRow(step.next), op: step.title, why: step.instruction }))]
  const picture = (revealed: number) => {
    const index = revealed - 2
    if (index < 0) return <div className="ns-visual ob-board" role="img" aria-label={spoken(working.start)}><Row text={working.start} prefix={working.prefix} /></div>
    const step = working.steps[index]
    // Rows so far: the question (or the latest fresh start), then each earlier step's result.
    const fresh = working.steps.slice(0, index + 1).findLastIndex(s => s.fresh)
    const earlier = (fresh >= 0 ? [working.steps[fresh].mark, ...working.steps.slice(fresh + 1, index).map(s => s.next)] : [working.start, ...working.steps.slice(0, index).map(s => s.next)]).map(plainRow)
    const last = index === working.steps.length - 1
    const label = [...earlier.slice(0, -1), step.fresh ? '' : plainRow(step.mark), step.fresh ? plainRow(step.mark) : plainRow(step.next)].filter(Boolean).map(spoken).join(', then ')
    return <div className="ns-visual ob-board" key={revealed} role="img" aria-label={label}>
      <PictureStep step={{ title: step.title, instruction: step.instruction, operation: '', equation: '', frame: {} } as MethodStep}>{heading => step.fresh
        ? <>{heading}<Row text={step.mark} prefix={working.prefix} tone={last && !step.words ? 'answer' : undefined} />{step.words && <p className="ob-words">{step.words}</p>}</>
        : <>
          {earlier.slice(0, -1).map((row, i) => <Row key={i} text={row} prefix={working.prefix} tone="old" />)}
          <Row text={step.mark} prefix={working.prefix} />
          {heading}
          {step.notes?.map((note, i) => <p key={i} className="ob-note" aria-hidden="true"><Powers text={note} /></p>)}
          <Row text={step.next} prefix={working.prefix} tone={last && !step.words ? 'answer' : undefined} />
          {step.words && <p className="ob-words">{step.words}</p>}
        </>}</PictureStep>
    </div>
  }
  return <WorkedChain steps={chain} picture={picture} pictureOnly />
}

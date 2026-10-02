'use client'

import { useId, useMemo, useState, type ReactNode } from 'react'
import { chainFromSteps } from '../../maths/step-chain/fromSteps'
import { WorkedChain } from '../../maths/step-chain/WorkedChain'
import { type FractionDisplay, type FractionFrame, type FractionWorking } from './fractionWorking'
import type { FractionChainStep, NumberList } from './fractionChain'
import type { ChainStep } from '../../maths/step-chain/StepChain'
import { PictureStep } from '../../written-methods/tutor/NumberSenseWorkedExample'
import type { MethodStep } from '../../written-methods/tutor/methodWorking'

function FractionCard({ value }: { value: FractionDisplay }) {
  return <div className={`fr-card fr-card--${value.tone ?? 'source'}`}>
    {value.label && <small>{value.label}</small>}
    <div>{value.whole !== undefined && <b>{value.whole}</b>}<span className="fr-stack"><span>{value.numerator}</span><span>{value.denominator}</span></span></div>
  </div>
}

function Segments({ parts, filled }: { parts: number; filled: number }) {
  return <div className="fr-segments" style={{ '--parts': parts } as React.CSSProperties}>
    {Array.from({ length: parts }, (_, index) => <i className={index < filled ? 'is-filled' : ''} key={index} />)}
  </div>
}

/** A fraction's card and bar. More than one whole is drawn as full bars, then "+", then the part left over. */
function SegmentedBar({ value }: { value: FractionDisplay }) {
  const complete = value.whole ?? Math.floor(value.numerator / value.denominator)
  const remainder = value.whole !== undefined ? value.numerator : value.numerator % value.denominator
  if (value.denominator > 24) return <FractionCard value={value} />
  const said = `${complete ? `${complete} whole${complete === 1 ? '' : 's'}${remainder ? ' and ' : ''}` : ''}${remainder || !complete ? `${remainder} of ${value.denominator} parts` : ''}`
  return <div className="fr-bar-row">
    <FractionCard value={value} />
    {complete > 0
      ? <div className="fr-wholes" role="img" aria-label={said}>
        {Array.from({ length: complete }, (_, index) => <Segments parts={value.denominator} filled={value.denominator} key={index} />)}
        {remainder > 0 && <><b className="fr-plus" aria-hidden="true">+</b><Segments parts={value.denominator} filled={remainder} /></>}
      </div>
      : <div className="fr-bar" role="img" aria-label={said}><Segments parts={value.denominator} filled={remainder} /></div>}
  </div>
}

/** Factors or multiples of each number, the ones in every list marked and the one used boxed (HCF and LCM steps). */
function NumberLists({ lists }: { lists: NumberList[] }) {
  return <div className="frm-lists">{lists.map(list => <div className="frm-list" key={list.label} role="group" aria-label={`${list.label}: ${list.values.join(', ')}`}>
    <span className="frm-list__label">{list.label}</span>
    <span className="frm-list__values" aria-hidden="true">{list.values.map(v => <b key={v} className={v === list.pick ? 'is-pick' : list.shared.includes(v) ? 'is-shared' : undefined}>{v}</b>)}</span>
  </div>)}</div>
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

/**
 * A line of working written in LaTeX by fractionChain.ts, drawn in the app font (src/features/EXPLANATIONS.md): fractions
 * stacked, the keys that make terms fly between lines dropped, and a move (× 3, ÷ 2 on the top and bottom) in purple.
 */
function readGroup(text: string, at: number, open: string, close: string) {
  let depth = 0
  for (let i = at; i < text.length; i++) {
    if (text.startsWith(open, i)) { depth++; i += open.length - 1 }
    else if (text.startsWith(close, i)) { depth--; if (!depth) return { inner: text.slice(at + open.length, i), end: i + close.length } }
  }
  return { inner: text.slice(at + open.length), end: text.length }
}
function Tex({ text }: { text: string }): ReactNode {
  const out: ReactNode[] = []
  let plain = '', i = 0
  const flush = () => { if (plain) out.push(plain.replace(/\\,/g, '\u2009')); plain = '' }
  while (i < text.length) {
    if (text.startsWith('[[', i)) {
      flush()
      const { inner, end } = readGroup(text, i, '[[', ']]')
      const body = inner.slice(inner.indexOf(':') + 1)
      out.push(/^\\(times|div) \d+$/.test(body.trim()) ? <span key={i} className="frm-move"><Tex text={body} /></span> : <Tex key={i} text={body} />)
      i = end
    } else if (text.startsWith('\\frac', i)) {
      flush()
      const top = readGroup(text, i + 5, '{', '}'), bottom = readGroup(text, top.end, '{', '}')
      out.push(<span key={i} className="frm-frac"><span><Tex text={top.inner} /></span><span><Tex text={bottom.inner} /></span></span>)
      i = bottom.end
    } else if (text.startsWith('\\text{', i)) {
      const { inner, end } = readGroup(text, i + 5, '{', '}'); plain += inner; i = end
    } else {
      const word = /^\\(times|div|pounds) ?/.exec(text.slice(i))
      if (word) { plain += { times: ' × ', div: ' ÷ ', pounds: '£' }[word[1] as 'times' | 'div' | 'pounds']; i += word[0].length }
      else { plain += text[i] === '-' ? ' − ' : text[i] === '+' ? ' + ' : text[i] === '=' ? ' = ' : text[i]; i++ }
    }
  }
  flush()
  return <>{out}</>
}

type Group = { title: string; why: string; lines: string[]; notes: string[]; lists?: NumberList[]; last: number }

/**
 * A fraction working one move a step (src/features/EXPLANATIONS.md): the bar picture on top, then the working as a board.
 * A move and its result ("× 2 top and bottom", then the new fraction) are one step, under one heading; earlier lines
 * stay, faded; the ⓘ is words, and the last line is the answer, in green.
 */
export function FractionWorkedExample({ visual }: { visual: FractionWorking }) {
  const chain = useMemo(() => visual.chain ?? chainFromSteps(visual.expression, visual.steps), [visual])
  const groups = useMemo(() => chain.slice(1).reduce<Group[]>((all, step, i) => {
    const previous = all.at(-1)
    if (step.op === 'Work out' && previous) { previous.lines.push(step.line); previous.last = i + 1; return all }
    return [...all, { title: step.op ?? '', why: step.why ?? '', lines: step.line ? [step.line] : [], notes: (step as FractionChainStep).note ?? [], lists: (step as FractionChainStep).lists, last: i + 1 }]
  }, []), [chain])
  const steps: ChainStep[] = [chain[0], ...groups.map(group => ({ line: group.lines.join(' '), op: group.title, why: group.why }))]
  const picture = (revealed: number) => {
    const index = revealed - 2
    const upTo = index < 0 ? 0 : groups[index].last
    const frame = (chain as FractionChainStep[]).slice(0, upTo + 1).findLast(step => step.frame)?.frame
    const bars = frame && <div className="rung-worked__visual"><FractionFrameView frame={frame} /></div>
    if (index < 0) return <div className="ns-visual frm">{bars}<p className="frm-line"><Tex text={chain[0].line} /></p></div>
    const group = groups[index], lastGroup = index === groups.length - 1
    const earlier = [chain[0].line, ...groups.slice(0, index).flatMap(g => g.lines)]
    return <div className="ns-visual frm" key={revealed}>
      <PictureStep step={{ title: group.title, instruction: group.why, operation: '', equation: '', frame: {} } as MethodStep}>{heading => <>
        {bars}
        {earlier.map((line, i) => <p key={i} className="frm-line is-old"><Tex text={line} /></p>)}
        {heading}
        {group.lists && <NumberLists lists={group.lists} />}
        {group.notes.map((note, i) => <p key={`n${i}`} className="frm-note">{note}</p>)}
        {group.lines.map((line, i) => {
          const answer = lastGroup && i === group.lines.length - 1
          return <p key={i} className={`frm-line${answer ? ' is-answer' : ''}`}>{answer ? <><span className="frm-eq">=</span><span className="frm-answer"><Tex text={line.replace(/^=\s*/, '')} /></span></> : <Tex text={line} />}</p>
        })}
      </>}</PictureStep>
    </div>
  }
  return <WorkedChain steps={steps} picture={picture} pictureOnly />
}

export function AnswerFractionWorking({ visual }: { visual: FractionWorking }) {
  const [open, setOpen] = useState(false), id = useId()
  return <div className="wms-answer-working"><button type="button" className="lesson-secondary-action" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{open ? 'Hide step by step' : 'See this calculation step by step'}</button><div id={id} className="pvb-stage" hidden={!open}><FractionWorkedExample visual={visual} /></div></div>
}

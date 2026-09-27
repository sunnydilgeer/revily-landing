'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { flyTerms, prefersReducedMotion } from './flip'
import './StepChain.css'

/**
 * One line of working. Terms that move between lines are marked [[key:latex]]: a term keeps its
 * key from line to line, so the same key on the next line is where it flies to.
 *
 *   { line: '[[a:3x]] [[b:+ 5]] = [[c:20]]' }
 *   { line: '[[a:3x]] [[b:+ 5]] [[m:- 5]] = [[c:20]] [[n:- 5]]', op: '− 5 from both sides' }
 *   { line: '[[a:3x]] = [[r:15]]', op: 'Simplify', merge: { r: ['c', 'n'] } }
 *
 * Keys that appear for the first time are the operation and are coloured to match `op`.
 * Keys that disappear without being merged are struck through on the line above.
 */
export type ChainStep = {
  line: string
  /** How this line came from the one above, in a few words: "÷ 3 both sides". */
  op?: string
  /** One sentence, shown when the student taps the operation. */
  why?: string
  /** A result key and the keys on the line above that combine into it. */
  merge?: Record<string, string[]>
}

/** Equations line up on "="; columns lay each line out in fixed place-value columns split by "|". */
export type ChainLayout = { kind: 'equation' } | { kind: 'columns'; columns: string[] }

const TERM = /\[\[([\w-]+):(.*?)\]\]/g
const ARRIVE_MS = 420

type Marks = { role: Map<string, 'op' | 'result'>; fate: Map<string, 'cancel' | 'merge'> }

function keysOf(line?: string) {
  return new Set(line ? [...line.matchAll(TERM)].map(match => match[1]) : [])
}

/** What each term on line `index` is: new (op), a result, or about to cancel or merge on the next line. */
function marksFor(steps: ChainStep[], index: number, nextShown: boolean): Marks {
  const step = steps[index], previous = keysOf(steps[index - 1]?.line), role: Marks['role'] = new Map()
  for (const key of keysOf(step.line)) {
    if (step.merge && key in step.merge) role.set(key, 'result')
    else if (index > 0 && !previous.has(key)) role.set(key, 'op')
  }
  const fate: Marks['fate'] = new Map()
  const next = steps[index + 1]
  if (nextShown && next) {
    const kept = keysOf(next.line), merged = new Set(Object.values(next.merge ?? {}).flat())
    for (const key of keysOf(step.line)) {
      if (merged.has(key)) fate.set(key, 'merge')
      else if (!kept.has(key)) fate.set(key, 'cancel')
    }
  }
  return { role, fate }
}

function attrs(key: string, marks: Marks) {
  const role = marks.role.get(key), fate = marks.fate.get(key)
  return { 'data-k': key, 'data-role': role, 'data-fate': fate }
}

function latexWithTerms(source: string, marks: Marks) {
  return source.replace(TERM, (_, key: string, body: string) => {
    const data = Object.entries(attrs(key, marks)).filter(([, value]) => value).map(([name, value]) => `${name.slice(5)}=${value}`)
    return `\\htmlData{${data.join(',')}}{${body}}`
  })
}

function MathCell({ source, marks, className }: { source: string; marks: Marks; className: string }) {
  const html = katex.renderToString(`\\displaystyle ${latexWithTerms(source, marks)}`, {
    throwOnError: false,
    strict: 'ignore',
    trust: context => context.command === '\\htmlData',
  })
  return <span className={`sc-cell ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}

function EquationLine({ line, marks }: { line: string; marks: Marks }) {
  const trimmed = line.trim()
  const at = trimmed.startsWith('= ') ? 0 : trimmed.indexOf(' = ')
  if (at < 0) return <><MathCell source={trimmed} marks={marks} className="sc-cell--lhs" /><span className="sc-cell sc-cell--eq" /><span className="sc-cell sc-cell--rhs" /></>
  const lhs = trimmed.slice(0, at), rhs = trimmed.slice(at === 0 ? 2 : at + 3)
  return <>
    {lhs ? <MathCell source={lhs} marks={marks} className="sc-cell--lhs" /> : <span className="sc-cell sc-cell--lhs" />}
    <span className="sc-cell sc-cell--eq">=</span>
    <MathCell source={rhs} marks={marks} className="sc-cell--rhs" />
  </>
}

function ColumnsLine({ line, columns, marks }: { line: string; columns: string[]; marks: Marks }) {
  const cells = line.split('|')
  return <span className="sc-cell sc-cell--wide">
    <span className="sc-columns" style={columnGrid(columns)}>
      {columns.map((column, i) => {
        const content = (cells[i] ?? '').trim()
        const term = /^\[\[([\w-]+):(.*)\]\]$/.exec(content)
        return <span key={column} className="sc-column">
          {term ? <span {...attrs(term[1], marks)}>{term[2]}</span> : content}
        </span>
      })}
    </span>
  </span>
}

/** The decimal point gets a narrow column so the digits either side sit close to it. */
function columnGrid(columns: string[]) {
  return { gridTemplateColumns: columns.map(column => column === '.' ? '.8rem' : '2.5rem').join(' ') }
}

type Flight = { index: number; phase: 'flying' | 'arriving' }

/**
 * Worked steps as one chain of working: each line is the line above, transformed.
 * The parent owns `revealed` (how many lines are showing, at least 1); each time it goes up by one,
 * the operation appears first, then the terms fly down into the new line.
 */
export function StepChain({ steps, layout = { kind: 'equation' }, revealed, reduceMotion = false }: {
  steps: ChainStep[]
  layout?: ChainLayout
  revealed: number
  reduceMotion?: boolean
}) {
  const stage = useRef<HTMLOListElement>(null)
  const rows = useRef<(HTMLLIElement | null)[]>([])
  const [openWhy, setOpenWhy] = useState<number | null>(null)
  const [shown, setShown] = useState(revealed)
  const [flight, setFlight] = useState<Flight | null>(null)

  // Decide on the new line's first render, so it never flashes up before its terms arrive.
  if (revealed !== shown) {
    setShown(revealed)
    setFlight(revealed === shown + 1 && !reduceMotion && !prefersReducedMotion() ? { index: revealed - 1, phase: 'flying' } : null)
    setOpenWhy(null)
  }

  const flyingIndex = flight?.phase === 'flying' ? flight.index : null
  useLayoutEffect(() => {
    const from = flyingIndex === null ? null : rows.current[flyingIndex - 1], to = flyingIndex === null ? null : rows.current[flyingIndex]
    if (flyingIndex === null || !stage.current || !from || !to) return
    to.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    return flyTerms({
      stage: stage.current, from, to, merge: steps[flyingIndex].merge,
      onArrive: () => setFlight({ index: flyingIndex, phase: 'arriving' }),
    })
  }, [flyingIndex, steps])

  useLayoutEffect(() => {
    if (flight?.phase !== 'arriving') return
    const timer = window.setTimeout(() => setFlight(null), ARRIVE_MS)
    return () => window.clearTimeout(timer)
  }, [flight])

  const last = Math.min(revealed, steps.length) - 1
  const done = last === steps.length - 1 && !flight
  const columns = layout.kind === 'columns' ? layout.columns : null

  return <div className={`sc${columns ? ' sc--columns' : ''}`} data-reduce-motion={reduceMotion || undefined}>
    {columns && <div className="sc-head" aria-hidden="true">
      <span className="sc-columns" style={columnGrid(columns)}>
        {columns.map(column => <span key={column} className="sc-column">{column === '.' ? '' : column}</span>)}
      </span>
    </div>}
    <ol className="sc-chain" ref={stage} aria-live="polite">
      {steps.slice(0, last + 1).map((step, index) => {
        const marks = marksFor(steps, index, index < last)
        const phase = flight?.index === index ? flight.phase : null
        // The line above stays bright while its terms are still travelling.
        const dim = index < last && !(flight && index === last - 1)
        const why = openWhy === index
        return <li
          key={index}
          ref={el => { rows.current[index] = el }}
          className={['sc-row', phase && `is-${phase}`, dim && 'is-dim', done && index === last && 'is-final'].filter(Boolean).join(' ')}
        >
          {step.op && <div className="sc-op">
            {step.why
              ? <button type="button" className="sc-op__label sc-op__label--why" aria-expanded={why} onClick={() => setOpenWhy(why ? null : index)}><span>{step.op}</span></button>
              : <span className="sc-op__label"><span>{step.op}</span></span>}
            {why && <p className="sc-op__why">{step.why}</p>}
          </div>}
          {columns ? <ColumnsLine line={step.line} columns={columns} marks={marks} /> : <EquationLine line={step.line} marks={marks} />}
        </li>
      })}
    </ol>
  </div>
}

/** Small row of dots: one per step, filled up to the current one. */
export function StepDots({ total, current }: { total: number; current: number }) {
  return <span className="sc-dots" role="img" aria-label={`Step ${current} of ${total}`}>
    {Array.from({ length: total }, (_, i) => <span key={i} className={`sc-dot${i < current ? ' is-on' : ''}`} />)}
  </span>
}

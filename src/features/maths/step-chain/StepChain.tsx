'use client'

import { memo, useLayoutEffect, useRef, useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { flyTerms, prefersReducedMotion } from './flip'
import { measureStrikes, type Strike } from './strikes'
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

function renderMath(source: string, marks: Marks) {
  return katex.renderToString(`\\displaystyle ${latexWithTerms(source, marks)}`, {
    throwOnError: false,
    strict: 'ignore',
    trust: context => context.command === '\\htmlData',
  })
}

/**
 * Memoised on the HTML string: React rewrites innerHTML on every render otherwise, which replaces
 * the terms mid-flight and restarts any animation on them.
 */
const MathHtml = memo(function MathHtml({ html, className }: { html: string; className: string }) {
  return <span className={`sc-cell ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
})

function MathCell({ source, marks, className }: { source: string; marks: Marks; className: string }) {
  return <MathHtml html={renderMath(source, marks)} className={className} />
}

function EquationLine({ line, marks, centred }: { line: string; marks: Marks; centred: boolean }) {
  const trimmed = line.trim()
  // Simplifying an expression (18/24, = 18÷6 / 24÷6, = 3/4): each line is centred as a whole.
  if (centred) return <MathCell source={trimmed} marks={marks} className="sc-cell--wide" />
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

type Flight = { index: number; phase: 'flying' | 'arriving'; run: number }

/**
 * Worked steps as one chain of working: each line is the line above, transformed.
 * The parent owns `revealed` (how many lines are showing, at least 1). When it goes up, the operation
 * appears first, then the terms fly down into the new last line; when it goes down, lines just go.
 * Tapping an operation replays that step. `pace` stretches every movement (1.5 is "slower").
 */
export function StepChain({ steps, layout = { kind: 'equation' }, revealed, reduceMotion = false, pace = 1 }: {
  steps: ChainStep[]
  layout?: ChainLayout
  revealed: number
  reduceMotion?: boolean
  pace?: number
}) {
  const stage = useRef<HTMLDivElement>(null)
  const rows = useRef<(HTMLLIElement | null)[]>([])
  const runs = useRef(0)
  /** Which step's why is open: null follows the newest step, 'none' means the student closed it. */
  const [openWhy, setOpenWhy] = useState<number | 'none' | null>(null)
  const [shown, setShown] = useState(revealed)
  const [flight, setFlight] = useState<Flight | null>(null)
  const [strikes, setStrikes] = useState<Strike[]>([])
  const still = () => reduceMotion || prefersReducedMotion()
  const fly = (index: number): Flight | null => still() || index < 1 ? null : { index, phase: 'flying', run: ++runs.current }

  // Decide on the new line's first render, so it never flashes up before its terms arrive.
  if (revealed !== shown) {
    setShown(revealed)
    setFlight(revealed > shown ? fly(revealed - 1) : null)
    setOpenWhy(null)
  }

  const flying = flight?.phase === 'flying' ? flight : null
  useLayoutEffect(() => {
    if (!flying) return
    const from = rows.current[flying.index - 1], to = rows.current[flying.index]
    if (!stage.current || !from || !to) return
    to.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    return flyTerms({
      stage: stage.current, from, to, merge: steps[flying.index].merge, pace,
      onArrive: () => setFlight({ ...flying, phase: 'arriving' }),
    })
    // Keyed on the run, so replaying the same step starts a fresh flight.
  }, [flying?.run, steps, pace])

  useLayoutEffect(() => {
    if (flight?.phase !== 'arriving') return
    const timer = window.setTimeout(() => setFlight(null), ARRIVE_MS * pace)
    return () => window.clearTimeout(timer)
  }, [flight, pace])

  const last = Math.min(revealed, steps.length) - 1

  // Re-measure the crossings-out whenever lines come or go, the layout resizes, or the maths fonts land.
  useLayoutEffect(() => {
    const element = stage.current
    if (!element) return
    const measure = () => setStrikes(measureStrikes(element, rows.current.slice(0, last + 1)))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    let live = true
    document.fonts?.ready.then(() => { if (live) measure() })
    return () => { live = false; observer.disconnect() }
  }, [last, steps])

  const done = last === steps.length - 1 && !flight
  const columns = layout.kind === 'columns' ? layout.columns : null
  const expression = !columns && !steps[0].line.includes(' = ')
  // Earlier lines fade, but both lines of a step stay bright while its terms are travelling.
  const isDim = (index: number) => index < last && !(flight && (index === flight.index || index === flight.index - 1))

  return <div
    className={`sc${columns ? ' sc--columns' : ''}`}
    data-reduce-motion={reduceMotion || undefined}
    style={{ ['--sc-pace' as string]: pace }}
  >
    {columns && <div className="sc-head" aria-hidden="true">
      <span className="sc-columns" style={columnGrid(columns)}>
        {columns.map(column => <span key={column} className="sc-column">{column === '.' ? '' : column}</span>)}
      </span>
    </div>}
    <div className="sc-stage" ref={stage}>
    <ol className="sc-chain" aria-live="polite">
      {steps.slice(0, last + 1).map((step, index) => {
        const marks = marksFor(steps, index, index < last)
        const phase = flight?.index === index ? flight.phase : null
        const feeding = flight?.phase === 'flying' && flight.index === index + 1
        const dim = isDim(index)
        const why = !!step.why && (openWhy === null ? index === last : openWhy === index)
        return <li
          key={index}
          ref={el => { rows.current[index] = el }}
          className={['sc-row', phase && `is-${phase}`, feeding && 'is-feeding', dim && 'is-dim', done && index === last && 'is-final'].filter(Boolean).join(' ')}
        >
          {step.op && <div className="sc-op">
            <span className="sc-op__line">
              <button
                type="button"
                className="sc-op__label"
                aria-label={`Replay this step: ${step.op}`}
                onClick={() => { setFlight(fly(index)); setOpenWhy(index) }}
              ><span>{step.op}</span></button>
              {step.why && <button
                type="button"
                className={`sc-op__info${why ? ' is-open' : ''}`}
                aria-label="Why?"
                aria-expanded={why}
                onClick={() => setOpenWhy(why ? 'none' : index)}
              >i</button>}
            </span>
            {why && <p className="sc-op__why">{step.why}</p>}
          </div>}
          {columns ? <ColumnsLine line={step.line} columns={columns} marks={marks} /> : <EquationLine line={step.line} marks={marks} centred={expression} />}
          {done && index === last && <span className="sc-tick" role="img" aria-label="Answer">✓</span>}
        </li>
      })}
    </ol>
    <svg className="sc-strikes" aria-hidden="true">
      {strikes.map((strike, i) => <line
        key={`${strike.row}-${i}`}
        x1={strike.x1} y1={strike.y1} x2={strike.x2} y2={strike.y2}
        pathLength={1}
        // Drawn once, while the step that cancels these terms plays; after that it is just ink.
        className={[flight?.phase === 'flying' && flight.index === strike.row + 1 && 'is-drawing', isDim(strike.row) && 'is-dim'].filter(Boolean).join(' ') || undefined}
      />)}
    </svg>
    </div>
  </div>
}

/** One dot per step, filled up to the current one. With `onSelect`, each dot jumps to its step. */
export function StepDots({ total, current, onSelect }: { total: number; current: number; onSelect?: (step: number) => void }) {
  if (!onSelect) return <span className="sc-dots" role="img" aria-label={`Step ${current} of ${total}`}>
    {Array.from({ length: total }, (_, i) => <span key={i} className={`sc-dot${i < current ? ' is-on' : ''}`} />)}
  </span>
  return <span className="sc-dots" role="group" aria-label={`Step ${current} of ${total}`}>
    {Array.from({ length: total }, (_, i) => <button
      key={i}
      type="button"
      className={`sc-dot-button${i < current ? ' is-on' : ''}`}
      aria-label={`Go to step ${i + 1}`}
      aria-current={i + 1 === current ? 'step' : undefined}
      onClick={() => onSelect(i + 1)}
    ><span className="sc-dot" /></button>)}
  </span>
}

const PACE_KEY = 'revily:slower-steps'
export const SLOWER_PACE = 1.6

/** The student's "Slower animations" setting, kept on this device. */
export function useStepPace() {
  const [slower, setSlower] = useState(false)
  useLayoutEffect(() => {
    try { setSlower(window.localStorage.getItem(PACE_KEY) === '1') } catch { /* storage blocked: default pace */ }
  }, [])
  const update = (next: boolean) => {
    setSlower(next)
    try { window.localStorage.setItem(PACE_KEY, next ? '1' : '0') } catch { /* storage blocked: this visit only */ }
  }
  return { slower, setSlower: update, pace: slower ? SLOWER_PACE : 1 }
}

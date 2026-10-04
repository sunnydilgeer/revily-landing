'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { WorkedChain } from '../../maths/step-chain/WorkedChain'
import { methodChain } from './methodChain'
import { MathSpan } from '../../../../components/MathText'
import { SquaresVisual, TilesVisual } from './PowerPictures'
import { ExpandVisual } from './GridPictures'
import { EquationVisual } from './EquationPictures'
import { QuadraticVisual } from './QuadraticPictures'
import { SolveVisual } from './SolvePictures'
import { SequenceVisual } from './SequencePictures'
import { NumberLineVisual } from './InequalityPictures'
import { Boxed, Powers } from './Powers'
import type { BracketFrame, HopFrame, TermsFrame, IntervalFrame, MethodExample, MethodStep, MethodWorking, OrderingFrame, RoundingFrame, WorkingLine } from './methodWorking'

export function isNumberSenseWorking(visual: MethodWorking) {
  return visual.examples.every(example => example.method === 'rounding' || example.method === 'ordering' || example.method === 'estimate' || example.method === 'standard-form' || example.method === 'collect')
}

export function RoundingVisual({ frame }: { frame: RoundingFrame }) {
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
    : frame.stage === 'lower' ? `Number line: ${frame.value} with lower bound ${frame.lower}.`
    : bounds ? `Number line: ${frame.value} with bounds ${frame.lower} and ${frame.upper}.` : `Number line around ${frame.value}.`
  return <svg className="ns-line" viewBox="0 0 320 96" role="img" aria-label={label}>
    <line className="ns-line__axis" x1="8" x2="312" y1="56" y2="56" />
    {interval && <rect className="ns-line__band" x={x(lower)} y="50" width={x(upper) - x(lower)} height="12" rx="3" />}
    {value !== lower && <g className="ns-line__value"><line x1={x(value)} x2={x(value)} y1="46" y2="66" /><text x={x(value)} y="36">{frame.value}</text></g>}
    {bounds && ([[lower, frame.lower], [upper, frame.upper]] as const).map(([n, text], i) => (i === 0 || frame.stage !== 'lower') && <g key={i} className="ns-line__bound">
      <line x1={x(n)} x2={x(n)} y1="48" y2="64" />
      <text x={x(n)} y="86">{text}</text>
      {interval && <circle cx={x(n)} cy="56" r="6" className={i ? 'is-open' : 'is-closed'} />}
    </g>)}
    {value === lower && !bounds && <text className="ns-line__value" x={x(value)} y="36">{frame.value}</text>}
    {frame.test && <g className={`ns-line__test${inside ? ' is-inside' : ''}`}><path d={`M${x(Number(frame.test))} 44l-6 -9h12z`} /><text x={Math.min(290, Math.max(30, x(Number(frame.test))))} y="20">{frame.test}</text></g>}
  </svg>
}

/** `heading` sits above the hops, or above the answer when the hops were already shown by the step before (`headingAtAnswer`). */
function HopVisual({ frame, plain, heading, headingAtAnswer }: { frame: HopFrame; plain?: boolean; heading?: ReactNode; headingAtAnswer?: boolean }) {
  const { cells, start, end, stage } = frame
  const moved = stage !== 'start', places = Math.abs(end - start), left = end < start
  const added = new Set(frame.added), dropped = new Set(stage === 'result' ? frame.dropped : [])
  // Hop k (1, 2, 3…) passes over one cell, counted from where the point starts.
  const hopOver = new Map<number, number>()
  if (moved) for (let k = 1; k <= places; k++) hopOver.set(left ? start - k : start + k - 1, k)
  const point = (gap: number) => {
    if (gap === (moved ? end : start)) return <span key={`p${gap}`} className={`ns-hop-point${gap === cells.length ? ' is-trailing' : ''}${plain ? ' is-plain' : ''}`}>.</span>
    if (moved && gap === start) return <span key={`p${gap}`} className="ns-hop-point is-ghost">.</span>
    return null
  }
  const direction = `${places} place${places === 1 ? '' : 's'} ${left ? 'left' : 'right'}`
  const label = moved ? `The point hops ${direction}.${frame.added?.length ? ' Empty places are filled with zeros.' : ''}${frame.answer ? ` ${frame.answer}` : ''}` : `${cells.filter((_, i) => !added.has(i)).join('')}, with the point after ${start} digit${start === 1 ? '' : 's'}.`
  return <div className="ns-hop" role="img" aria-label={label}>
    {!(stage === 'result' && headingAtAnswer) && heading}
    <div className="ns-hop-row" aria-hidden="true">
      {cells.map((cell, i) => plain && added.has(i) ? point(i) : [point(i), <span key={i} className={`ns-hop-cell${i === frame.lead && !plain ? ' is-lead' : ''}${added.has(i) ? ' is-added' : ''}${dropped.has(i) ? ' is-dropped' : ''}${hopOver.has(i) ? ' is-hopped' : ''}`}>
        {hopOver.has(i) && <i className="ns-hop-arc"><b>{hopOver.get(i)}</b></i>}
        {added.has(i) && !moved ? '' : cell}
      </span>])}
      {point(cells.length)}
    </div>
    {moved && <p className="ns-hop-note" aria-hidden="true">{left ? `← ${direction}` : `${direction} →`}</p>}
    {stage === 'result' && headingAtAnswer && heading}
    {stage === 'result' && frame.answer && <p className="ns-hop-answer" aria-hidden="true"><Powers text={frame.answer} /></p>}
  </div>
}

/** Tiles split where a line may wrap: never inside brackets, so "(2 × 10³)" stays together on a phone. */
function chunks(terms: TermsFrame['terms']) {
  const out: { term: TermsFrame['terms'][number]; i: number }[][] = []
  let depth = 0
  terms.forEach((term, i) => {
    if (depth === 0 && (term.text !== ')' || !out.length)) out.push([])
    out[out.length - 1].push({ term, i })
    if (term.op && term.text === '(') depth++
    if (term.op && term.text === ')') depth--
  })
  return out
}

function TermsVisual({ frame, plain, heading }: { frame: TermsFrame; plain?: boolean; heading?: ReactNode }) {
  const label = frame.groups
    ? frame.groups.map(group => `${group.parts} gives ${group.total}`).join('. ')
    : `${frame.terms.some(term => term.op) ? 'The question' : 'The terms'}: ${frame.terms.map(term => term.text).join(' ')}.${plain ? '' : ' Like terms share a colour.'}`
  return <div className="ns-terms" role="img" aria-label={`${label}${frame.answer ? `. ${frame.answer}` : ''}`}>
    {!frame.groups && heading}
    <p className="ns-terms-row" aria-hidden="true">{chunks(frame.terms).map((chunk, c) => <span key={c} className="ns-term-chunk">{chunk.map(({ term, i }) => term.op
      ? <span key={i} className={`ns-term-op${/[()]/.test(term.text) ? ' is-bracket' : ''}`}><Powers text={term.text} /></span>
      : <span key={i} className={`ns-term ${plain ? 'is-plain' : `is-f${term.family % 4}`}`}><Powers text={term.text} /></span>)}</span>)}</p>
    {frame.groups && <ul className="ns-term-groups" aria-hidden="true">{frame.groups.map((group, i) => [
      i === (frame.newFrom ?? 0) && !frame.answer && heading && <li key="heading" className="ns-term-groups__heading">{heading}</li>,
      <li key={i} className={`is-f${group.family % 4}`}><span><Powers text={group.parts} /></span><span aria-hidden="true">→</span><strong><Powers text={group.total} /></strong></li>,
    ])}</ul>}
    {frame.answer && heading}
    {frame.answer && <p className="ns-hop-answer" aria-hidden="true"><Powers text={frame.answer} /></p>}
  </div>
}

/**
 * One step of a picture-only working (see src/features/EXPLANATIONS.md): its heading sits just above what the
 * step adds, and its explanation (closed until the student taps ⓘ) just below. Earlier steps' headings go.
 */
export function PictureStep({ step, children }: { step: MethodStep; children: (heading: ReactNode) => ReactNode }) {
  const [open, setOpen] = useState(false)
  const heading = <p className="ns-step" aria-live="polite">
    <span className="ns-step__title"><Powers text={step.title} /></span>
    {step.tag && <span className="ns-step__tag">{step.tag}</span>}
    <button type="button" className={`ns-step__info${open ? ' is-open' : ''}`} aria-label="Why?" aria-expanded={open} onClick={() => setOpen(!open)}>i</button>
  </p>
  return <>
    {children(heading)}
    {open && <p className="ns-step__why"><Powers text={step.instruction} /></p>}
  </>
}

/** A factorised answer built from coloured pieces, each labelled with where it came from. */
function BracketAnswer({ frame }: { frame: BracketFrame }) {
  const words = `${frame.outside} outside the bracket, and inside ${frame.inside.map(piece => `${piece.text.replace(/^\+ /, 'plus ')} from ${piece.from}`).join(', ')}`
  return <div className="ns-bracket" role="img" aria-label={words}>
    <span className="ns-bracket__piece is-f3" aria-hidden="true"><b><Powers text={frame.outside} /></b><small>common factor</small></span>
    <span className="ns-bracket__paren" aria-hidden="true">(</span>
    {frame.inside.map((piece, i) => <span key={i} className={`ns-bracket__piece is-f${piece.family % 4}`} aria-hidden="true"><b><Powers text={piece.text} /></b><small>from <Powers text={piece.from} /></small></span>)}
    <span className="ns-bracket__paren" aria-hidden="true">)</span>
  </div>
}

/** Lines of working under a picture; the step's heading goes above the lines it adds (from `newFrom`). */
function WorkingLines({ lines, newFrom, heading }: { lines: WorkingLine[]; newFrom?: number; heading?: ReactNode }) {
  return <ul className="ns-term-groups" aria-label={lines.map(line => line.parts ? `${line.parts} gives ${line.total}` : line.total).join('. ').replace(/[[\]]/g, '')}>{lines.map((line, i) => [
    i === newFrom && heading && <li key="heading" className="ns-term-groups__heading">{heading}</li>,
    <li key={i} className={`is-f${line.family % 4}`} aria-hidden="true">{line.parts && <><span><Powers text={line.parts} /></span><span>→</span></>}<strong><Boxed text={line.total} /></strong></li>,
  ])}</ul>
}

/**
 * A picture-only step drawn from a number line, a cut-off, term tiles, copies of a power or an area square,
 * then lines of working and an answer.
 * The picture and lines from earlier steps stay; the heading sits above whatever this step adds.
 */
function LinesStep({ example, index, heading }: { example: MethodExample; index: number; heading: ReactNode }) {
  const upTo = example.steps.slice(0, index + 1), own = example.steps[index].frame
  const interval = upTo.findLast(step => step.frame.interval)?.frame.interval
  const rounding = upTo.findLast(step => step.frame.rounding)?.frame.rounding
  const terms = upTo.findLast(step => step.frame.terms)?.frame.terms
  // Terms workings (5a⁴ × 3a²) draw each letter's copies only on that letter's step; other pictures keep theirs.
  const sorted = example.steps.some(step => step.frame.terms)
  const tiles = sorted ? own.tiles : upTo.findLast(step => step.frame.tiles)?.frame.tiles
  const newTiles = sorted && Boolean(own.tiles)
  const squares = upTo.findLast(step => step.frame.squares)?.frame.squares
  const expand = upTo.findLast(step => step.frame.expand)?.frame.expand
  const board = upTo.findLast(step => step.frame.equation)?.frame.equation
  // The question's own row is on the opening screen, so the first step's heading goes under it, above what the step adds.
  const boardBefore = example.steps.slice(0, index).findLast(step => step.frame.equation)?.frame.equation?.rows.length ?? 1
  const lines = upTo.findLast(step => step.frame.sums)?.frame.sums ?? []
  const before = example.steps.slice(0, index).findLast(step => step.frame.sums)?.frame.sums?.length ?? 0
  const values = upTo.findLast(step => step.frame.ordering?.values)?.frame.ordering
  const answer = own.ordering?.answer ?? (own.rounding?.stage === 'result' ? own.rounding.answer : undefined)
  const rule = own.rounding && own.rounding.stage !== 'identify' && !own.rounding.chop
  const at = own.quadratic || own.solve || own.sequence || own.numberLine ? 'quadratic' : newTiles ? 'tiles' : own.equation && own.equation.rows.length > boardBefore ? 'board' : own.sums && own.sums.length > before ? 'lines' : answer ? 'answer' : own.ordering?.values ? 'values' : 'picture'
  return <>
    {at === 'picture' && heading}
    {terms && <TermsVisual frame={{ terms: terms.terms }} />}
    {at === 'tiles' && heading}
    {tiles && <TilesVisual frame={tiles} />}
    {squares && <SquaresVisual frame={squares} />}
    {expand && <ExpandVisual frame={expand} />}
    {board && <EquationVisual frame={board} newFrom={at === 'board' ? boardBefore : undefined} heading={heading} focus={example.focus} />}
    {own.quadratic && <QuadraticVisual frame={own.quadratic} heading={heading} />}
    {own.solve && <SolveVisual frame={own.solve} heading={heading} focus={example.focus} />}
    {own.sequence && <SequenceVisual frame={own.sequence} heading={heading} focus={example.focus} />}
    {own.numberLine && <NumberLineVisual frame={own.numberLine} heading={heading} focus={example.focus} />}
    {interval && <IntervalVisual frame={interval} />}
    {rounding && <RoundingVisual frame={{ ...rounding, stage: 'identify' }} />}
    {lines.length > 0 && <WorkingLines lines={lines} newFrom={at === 'lines' ? before : undefined} heading={heading} />}
    {at === 'values' && heading}
    {values && <OrderingVisual frame={values} />}
    {at === 'answer' && heading}
    {rule && rounding && <p className="ns-rule">{rounding.decisionDigit} {rounding.roundsUp ? '≥' : '<'} 5 <span aria-hidden="true">→</span> <strong>{rounding.roundsUp ? 'round up' : 'keep the digit'}</strong></p>}
    {own.bracket ? <BracketAnswer frame={own.bracket} /> : answer && <p className="ns-hop-answer"><Powers text={answer} /></p>}
  </>
}

function OrderingVisual({ frame }: { frame: OrderingFrame }) {
  if (frame.answer) return <p className="ns-order-answer"><Powers text={frame.answer} /></p>
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
  // When every step has its own picture (term tiles, hops, value cards), the picture carries the whole working.
  const pictureOnly = visual.examples.every(example => example.method === 'collect'
    || (example.method === 'standard-form' && example.steps.every(step => step.frame.hop || step.frame.ordering || step.frame.terms))
    || example.pictureOnly)
  const picture = (revealed: number) => {
    const at = chain.slice(0, revealed).findLast(line => line.at)?.at
    const frame = at && visual.examples[at.example ?? 0].steps[at.step]?.frame
    if (pictureOnly) {
      const example = visual.examples[at?.example ?? 0], step = at && example.steps[at.step]
      if (!step) {
        // Before the first step: the question's own picture, plain (tiles not yet sorted, the number before any hops).
        const first = example.steps[0]?.frame
        if (first?.terms) return <div className="ns-visual rung-worked__visual"><TermsVisual frame={{ terms: first.terms.terms }} plain /></div>
        if (first?.hop?.stage === 'start') return <div className="ns-visual rung-worked__visual"><HopVisual frame={first.hop} plain /></div>
        if (first?.interval) return <div className="ns-visual rung-worked__visual"><IntervalVisual frame={{ ...first.interval, stage: 'value' }} /></div>
        if (first?.tiles?.opening) return <div className="ns-visual rung-worked__visual"><p className="ns-plain-number"><Powers text={first.tiles.opening} /></p></div>
        // Powers named on their groups start as blocks (3⁴ × 3⁵), and open into copies on the first step.
        if (first?.tiles?.rows.every(row => row.groups.every(group => group.label))) return <div className="ns-visual rung-worked__visual"><TilesVisual frame={{ ...first.tiles, folded: true, plain: true, note: undefined }} /></div>
        if (first?.tiles) return <div className="ns-visual rung-worked__visual"><TilesVisual frame={{ ...first.tiles, plain: true, note: undefined, rows: first.tiles.rows.map(row => ({ groups: row.groups.map(group => ({ ...group, crossed: undefined })) })) }} /></div>
        if (first?.expand) return <div className="ns-visual rung-worked__visual"><ExpandVisual frame={first.expand.given
          ? { given: true, grids: first.expand.grids.map(grid => ({ side: grid.side.map(() => '?'), top: grid.top.map(() => '?'), cells: grid.cells?.map(row => row.map(cell => ({ text: cell.text }))) })) }
          : { grids: first.expand.grids.map(grid => ({ ...grid, cells: undefined })) }} /></div>
        // The equation as the question writes it, before any move: the board's first row, in plain ink.
        if (first?.numberLine) return <div className="ns-visual rung-worked__visual"><NumberLineVisual frame={first.numberLine} plain /></div>
        if (first?.sequence) return <div className="ns-visual rung-worked__visual"><SequenceVisual frame={first.sequence} plain /></div>
        if (first?.solve) return <div className="ns-visual rung-worked__visual"><SolveVisual frame={first.solve} plain /></div>
        if (first?.quadratic) return <div className="ns-visual rung-worked__visual"><QuadraticVisual frame={first.quadratic} plain /></div>
        if (first?.equation) return <div className="ns-visual rung-worked__visual"><EquationVisual frame={{ rows: first.equation.rows.slice(0, 1) }} plain /></div>
        if (first?.squares) return <div className="ns-visual rung-worked__visual"><SquaresVisual frame={{ ...first.squares, shaded: [0, 0] }} /></div>
        if (first?.rounding) return <div className="ns-visual rung-worked__visual"><p className="ns-plain-number">{first.rounding.original}</p></div>
        return null
      }
      if (example.pictureOnly) return <div className="ns-visual rung-worked__visual" key={`${at.example ?? 0}-${at.step}`}><PictureStep step={step}>{heading => <LinesStep example={example} index={at.step} heading={heading} />}</PictureStep></div>
      const { terms, hop, ordering } = step.frame
      // Earlier maths stays: tiles or value cards from an earlier step remain above a step that doesn't redraw them.
      const before = example.steps.slice(0, at.step)
      const earlier = ordering?.values || terms ? undefined : before.findLast(step => step.frame.ordering?.values)?.frame.ordering
      const earlierTiles = terms ? undefined : before.findLast(step => step.frame.terms)?.frame.terms
      return <div className="ns-visual rung-worked__visual" key={`${at.example ?? 0}-${at.step}`}>{earlierTiles && <TermsVisual frame={earlierTiles} />}{earlier && <OrderingVisual frame={earlier} />}<PictureStep step={step}>{heading => terms
        ? <TermsVisual frame={terms} heading={heading} />
        : hop
          ? <><HopVisual frame={hop} heading={heading} headingAtAnswer={Boolean(before.at(-1)?.frame.hop)} />{ordering && <OrderingVisual frame={ordering} />}</>
          : <>{heading}{ordering && <OrderingVisual frame={ordering} />}</>}</PictureStep></div>
    }
    if (!frame || !(frame.rounding || frame.interval || frame.ordering || frame.hop || frame.terms)) return null
    return <div className="ns-visual rung-worked__visual">
      {frame.rounding && <RoundingVisual frame={frame.rounding} />}
      {frame.interval && <IntervalVisual frame={frame.interval} />}
      {frame.ordering && <OrderingVisual frame={frame.ordering} />}
      {frame.hop && <HopVisual frame={frame.hop} />}
      {frame.terms && <TermsVisual frame={frame.terms} />}
    </div>
  }
  return <WorkedChain steps={chain} picture={picture} pictureOnly={pictureOnly} />
}

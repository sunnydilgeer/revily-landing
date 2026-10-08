'use client'

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { AXIS, GraphVisual, HaloText, UNIT, axisText, dotBox, fitLabel, fmt, labelWidth, placeLabel, squareOf, balanced } from './GraphPictures'
import type { GraphFrame, GraphPoint } from './methodWorking'
import { LineBoard } from './LineBoard'
import { TiltBoard } from './TiltBoard'
import { EquationBoard } from './EquationBoard'
import { CurveBoard } from './CurveBoard'
import { JourneyBoard } from './JourneyBoard'
import { polySum, valueAt } from './curves'
import './GraphBoard.css'

/*
 * The graph board (graphs lessons, ../../coordinates): a hands-on answer on the page's own squares (Sunny, 7 Oct:
 * Brilliant-style, less multiple choice). The student moves a dot with a finger, the mouse or the arrow keys, and it
 * snaps to the grid's corners. As it moves, its numbers light up on the axes: x amber and y biro blue, as in brackets.
 *
 * Modes:
 * - plot: tap a corner to drop the dot (tap again to move it).
 * - drag: the dot starts somewhere; drag it (or tap where it should go).
 * - walk: "across, then up" made physical. Drag the amber handle along the x axis, then the blue one up or down.
 * - explore: a play screen with no right answer: drag the dot and its brackets follow it.
 * - midpoint: a play screen: the dot's two halves of the line, across and up from each end, lock green when they match.
 * - rule: a play screen: the dot slides along a line's rule, y = mx + c, and each x it visits fills in the table.
 * - line: tap two corners and a straight line runs through them, edge to edge (LineBoard.tsx).
 * - tilt: drag either end of a line and watch its gradient, across then up (TiltBoard.tsx).
 * - equation: step m and c up and down and watch y = mx + c move (EquationBoard.tsx).
 * - journey: tap where each part of a journey ends on a distance–time graph (JourneyBoard.tsx).
 * - points: plot every column of a table; once all are down they are joined with a smooth curve (CurveBoard.tsx).
 * A rule can be a curve (`curve`, graphs lesson 6): the dot slides along it, and once every x in the table is visited
 * the smooth curve through them appears.
 * A walk starts at 0, or at `start`: from one point of a line, across and then up to the other (a gradient's triangle).
 *
 * Only the play screens show the dot's brackets while it moves (they would give the answer away in a question).
 * After Check, the dot shows its brackets, and a wrong one shows the right point, green, beside it.
 */

export type GraphBoardGrid = Omit<GraphFrame, 'step' | 'adds'>
export type GraphBoardSpec = {
  mode: 'plot' | 'drag' | 'walk' | 'explore' | 'midpoint' | 'rule' | 'line' | 'tilt' | 'equation' | 'points' | 'journey'
  grid: GraphBoardGrid
  /** Where the dot starts (drag, explore, midpoint). */
  start?: GraphPoint
  /** The midpoint play screen: the line's two ends. */
  ends?: [GraphPoint, GraphPoint]
  /** rule (a play screen): the dot slides along y = mx + c, a whole number of squares across at a time. Each x it
   *  visits leaves a dot behind and fills its y in the grid's table. */
  rule?: { m: number; c: number }
  /** equation: the line to make, y = mx + c (EquationBoard.tsx; `rule` is where it starts). With none it is a play screen. */
  equation?: { m: number; c: number }
  /** line: the right line, through two of its points (drawn green after a wrong answer). With none it is a play screen. */
  line?: [GraphPoint, GraphPoint]
  /** tilt: the gradient to tilt the line to (TiltBoard.tsx). With none it is a play screen. */
  target?: number
  /** tilt: show the gradient as two subtractions, from the dots' coordinates. */
  subtract?: boolean
  /** walk: write how far each arrow goes beside it, across amber and up blue (counting a gradient's triangle). */
  counts?: boolean
  /** A curve's numbers, [constant, x, x², x³] (curves.ts). rule: the dot slides along it instead of `rule`'s line.
   *  points: the right curve, drawn green after a wrong answer. */
  curve?: number[]
  /** rule with a curve: how the rule is written, "y = x² − 2", for its sum under the board. */
  curveText?: string
  /** rule on real-life axes (graphs lesson 8): how each axis's amount is written under the board, "£50 is €60". */
  reads?: [string, string]
  /** journey: the right journey's corners after `start` (time, distance). With none it is a play screen showing each part's speed. */
  journey?: GraphPoint[]
}

/**
 * Where a point's brackets go on a line from a to b: the corner beside it that the line doesn't run through (as in
 * placed(), graphWorkings.ts), or the opposite clear corner when that one would run off the grid.
 */
export function clearSide(a: GraphPoint, b: GraphPoint, p: GraphPoint, grid: { x: [number, number]; y: [number, number] }) {
  const dx = Math.sign(b.x - a.x) || 1, dy = Math.sign(b.y - a.y) || 1
  const units = (pair(p).length * 15 * 0.56 + 13) / UNIT
  const fits = (sx: number, sy: number) => (sx > 0 ? p.x + units <= grid.x[1] : p.x - units >= grid.x[0]) && (sy > 0 ? p.y - 1 >= grid.y[0] : p.y + 1 <= grid.y[1])
  return fits(dx, dy) ? { dx, dy } : { dx: -dx, dy: -dy }
}

const pair = (p: GraphPoint) => `(${fmt(p.x)}, ${fmt(p.y)})`
const said = (p: GraphPoint) => pair(p).replace(/−/g, 'minus ')
const same = (a: GraphPoint | null | undefined, b: GraphPoint | null | undefined) => !!a && !!b && a.x === b.x && a.y === b.y

type BoardProps = {
  spec: GraphBoardSpec
  /** The right point, shown after a wrong answer. */
  answer?: GraphPoint
  result?: 'correct' | 'incorrect'
  disabled?: boolean
  onChange?: (value: string) => void
}

export function GraphBoard(props: BoardProps) {
  return props.spec.mode === 'line' ? <LineBoard {...props} /> : props.spec.mode === 'tilt' ? <TiltBoard {...props} /> : props.spec.mode === 'equation' ? <EquationBoard {...props} />
    : props.spec.mode === 'points' ? <CurveBoard {...props} /> : props.spec.mode === 'journey' ? <JourneyBoard {...props} /> : <PointBoard {...props} />
}

/** y = 2 × (−1) − 1 = −3: the rule's sum at x, x amber and y biro blue. */
function RuleSum({ rule, x }: { rule: { m: number; c: number }; x: number }) {
  const y = rule.m * x + rule.c
  const X = <span className="is-x">{x < 0 && rule.m !== 0 ? `(${fmt(x)})` : fmt(x)}</span>, Y = <span className="is-y">{fmt(y)}</span>
  if (rule.m === 0) return <>At x = <span className="is-x">{fmt(x)}</span>, y is still {Y}</>
  const times = rule.m === 1 ? X : <>{fmt(rule.m)} × {X}</>
  return <>y = {times}{rule.c ? ` ${rule.c < 0 ? '−' : '+'} ${Math.abs(rule.c)}` : ''} = {Y}</>
}

/** y = (−2)² − 3 = 4 − 3 = 1: a curve's sum at x, its y biro blue. */
function CurveSum({ text, x }: { text: string; x: number }) {
  const sum = polySum(text, x), cut = sum.lastIndexOf(' = ')
  return <>y = {sum.slice(0, cut)} = <span className="is-y">{sum.slice(cut + 3)}</span></>
}

function PointBoard({ spec, answer, result, disabled, onChange }: BoardProps) {
  const { mode } = spec, grid = balanced(spec.grid)
  const [x0, x1] = grid.x, [y0, y1] = grid.y
  const walk = mode === 'walk'
  const play = mode === 'explore' || mode === 'midpoint' || mode === 'rule'
  // The rule the dot slides along: a straight line, y = mx + c, or a curve (graphs lesson 6).
  const curve = mode === 'rule' ? spec.curve : undefined
  const rule = mode === 'rule' ? spec.rule ?? (curve ? { m: 0, c: 0 } : undefined) : undefined
  const f = (x: number) => curve ? valueAt(curve, x) : rule!.m * x + rule!.c
  // A walk starts at 0, or at its `start` (one point of a line, for a gradient's triangle).
  const origin = walk ? spec.start ?? { x: 0, y: 0 } : { x: 0, y: 0 }
  const [dot, setDot] = useState<GraphPoint | null>(walk ? origin : spec.start ?? null)
  const [visited, setVisited] = useState<number[]>(rule && spec.start ? [spec.start.x] : [])
  const [stage, setStage] = useState<'across' | 'up'>('across')
  const [held, setHeld] = useState(false)
  const [moved, setMoved] = useState(false)
  const pressed = useRef(false)
  const id = useId()

  // The dot stays on a numbered corner: inside the grid, off its edges.
  // On real-life axes (graphs lesson 8) a square is `per` units: the dot moves a square at a time.
  const sx = grid.scale?.x, sy = grid.scale?.y, per = { x: sx?.per ?? 1, y: sy?.per ?? 1 }
  const clamp = (p: GraphPoint): GraphPoint => ({ x: Math.min(Math.max(p.x, x0 + per.x), x1 - per.x), y: Math.min(Math.max(p.y, y0 + per.y), y1 - per.y) })
  function report(next: GraphPoint | null, nextStage = stage) {
    if (!onChange || play) return
    onChange(next && (!walk || nextStage === 'up') ? `${next.x}, ${next.y}` : '')
  }
  function moveTo(target: GraphPoint) {
    const snapped = clamp(target)
    // Walking: along the x axis first, then straight up or down from there.
    const next = walk ? stage === 'across' ? { x: snapped.x, y: origin.y } : { x: dot?.x ?? origin.x, y: snapped.y } : rule ? { x: snapped.x, y: f(snapped.x) } : snapped
    if (same(next, dot)) return
    // On a rule the dot stays on the grid: an x whose y would be off it is skipped.
    if (rule && (next.y <= y0 || next.y >= y1)) return
    setDot(next); setMoved(true); report(next)
    if (rule && !visited.includes(next.x)) setVisited([...visited, next.x])
  }
  function corner(event: PointerEvent<SVGSVGElement>): GraphPoint {
    const box = event.currentTarget.getBoundingClientRect(), square = squareOf(event.currentTarget, box)
    return { x: x0 + Math.round((event.clientX - box.left - 0.5) / square) * per.x, y: y1 - Math.round((event.clientY - box.top - 0.5) / square) * per.y }
  }
  function finishWalkStage() {
    if (walk && stage === 'across' && dot && dot.x !== origin.x) { setStage('up'); report(dot, 'up') }
  }
  function restart() {
    setDot(origin); setStage('across'); setMoved(false); report(null, 'across')
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[event.key]
    if (!step) return
    event.preventDefault()
    const from = dot ?? origin
    if (walk) {
      // Left and right walk across; up and down start the second part of the walk.
      if (step[0] !== 0 && stage === 'across') return moveTo({ x: from.x + step[0], y: origin.y })
      if (step[1] !== 0) {
        if (from.x === origin.x) return
        const next = clamp({ x: from.x, y: from.y + step[1] })
        setStage('up'); setDot(next); setMoved(true); report(next, 'up')
      }
      return
    }
    if (rule) { if (step[0]) moveTo({ x: from.x + step[0] * per.x, y: from.y }); return }
    moveTo(dot ? { x: from.x + step[0] * per.x, y: from.y + step[1] * per.y } : from)
  }

  const ends = spec.ends
  const halves = ends && dot ? { first: { x: dot.x - ends[0].x, y: dot.y - ends[0].y }, second: { x: ends[1].x - dot.x, y: ends[1].y - dot.y } } : null
  const halfway = !!halves && halves.first.x === halves.second.x && halves.first.y === halves.second.y
  const showDot = !!dot && (!walk || stage === 'up' || moved)
  // The dot's own numbers light up on the axes as it moves: only x while walking across.
  const marks: NonNullable<GraphFrame['marks']> = []
  if (dot && showDot) {
    if (!walk || dot.x !== origin.x || stage === 'up') marks.push({ axis: 'x', value: dot.x, family: 1 })
    if (!walk || stage === 'up') marks.push({ axis: 'y', value: dot.y, family: 0 })
  }
  if (result === 'incorrect' && answer && !same(answer, dot)) {
    if (!marks.some(m => m.axis === 'x' && m.value === answer.x)) marks.push({ axis: 'x', value: answer.x, family: 1 })
    if (!marks.some(m => m.axis === 'y' && m.value === answer.y)) marks.push({ axis: 'y', value: answer.y, family: 0 })
  }
  const frame: GraphFrame = {
    ...grid, step: 0, adds: 'picture', marks,
    lines: [...(grid.lines ?? []), ...(ends ? [{ from: ends[0], to: ends[1], at: -1, segment: true }] : [])],
    points: [...(grid.points ?? []), ...(ends ?? []).map(p => ({ ...p, at: -1, place: clearSide(ends![0], ends![1], p, grid) })),
      ...(rule ? visited.filter(x => x !== dot?.x).map(x => ({ x, y: f(x), at: 0, label: '' })) : [])],
    ...(rule && grid.table ? { table: { ...grid.table, ys: grid.table.xs.map(x => visited.includes(x) ? f(x) : null), lit: dot ? grid.table.xs.indexOf(dot.x) : undefined } } : {}),
    // On real-life axes the dot is read like the lesson's graphs: dashed down to one axis and across to the other.
    ...(rule && sx && sy && dot ? { legs: [...(grid.legs ?? []), { from: dot, to: { x: dot.x, y: sy.start }, label: '', family: 1, at: 0, dashed: true }, { from: dot, to: { x: sx.start, y: dot.y }, label: '', family: 0, at: 0, dashed: true }] } : {}),
    // A curve's table, every x visited: the smooth curve through them all.
    ...(curve && grid.table && grid.table.xs.every(x => visited.includes(x)) ? { curves: [...(grid.curves ?? []), { coeffs: curve, from: Math.min(...grid.table.xs), to: Math.max(...grid.table.xs), at: 0 }] } : {}),
  }

  const labelled = play || !!result
  const status = result === 'correct' || (mode === 'midpoint' && halfway) ? ' is-right' : result === 'incorrect' ? ' is-wrong' : ''
  const live = `${walk && stage === 'across' ? `Across ${fmt(dot?.x ?? 0)}` : dot ? `The dot is at ${said(dot)}` : 'No dot yet'}${mode === 'midpoint' && halfway ? '. Halfway!' : ''}`

  return <div className={`graph-board graph-board--${mode}${held ? ' is-held' : ''}${disabled ? ' is-disabled' : ''}`}>
    <div className="graph-board__surface" tabIndex={disabled ? -1 : 0} role="group" onKeyDown={onKeyDown}
      aria-label={`${walk ? 'Walk across, then up or down: arrow keys left and right go across, then up and down.' : 'Move the dot with the arrow keys.'} A grid with x from ${fmt(x0)} to ${fmt(x1)} and y from ${fmt(y0)} to ${fmt(y1)}.`} aria-describedby={`${id}-live`}>
      <GraphVisual frame={frame} live={{
        svg: disabled ? undefined : {
          onPointerDown: event => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); pressed.current = true; setHeld(true); moveTo(corner(event)) },
          onPointerMove: event => { if (pressed.current) moveTo(corner(event)) },
          onPointerUp: () => { pressed.current = false; setHeld(false); finishWalkStage() },
          onPointerCancel: () => { pressed.current = false; setHeld(false) },
          style: { touchAction: 'none', cursor: 'pointer' },
        },
        draw: ({ px, py, width, height, room }) => {
          const at = (p: GraphPoint) => ({ x: px(p.x) + 0.5, y: py(p.y) + 0.5 })
          const arrow = (from: GraphPoint, to: GraphPoint, family: number, key: string) => {
            if (same(from, to)) return null
            const a = at(from), across = from.y === to.y
            // An arrow that ends at the dot stops just short of it, so its head isn't hidden.
            const short = same(to, dot) && showDot ? 9 : 0, end = at(to)
            const b = across ? { x: end.x - Math.sign(end.x - a.x) * short, y: end.y } : { x: end.x, y: end.y - Math.sign(end.y - a.y) * short }
            const dir = across ? Math.sign(b.x - a.x) : Math.sign(b.y - a.y)
            const head = across ? `M${b.x - dir * 8} ${b.y - 6} L${b.x} ${b.y} L${b.x - dir * 8} ${b.y + 6}` : `M${b.x - 6} ${b.y - dir * 8} L${b.x} ${b.y} L${b.x + 6} ${b.y - dir * 8}`
            return <g key={key} className={`ns-graph__leg is-f${family}`}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} /><path d={head} /></g>
          }
          /** Brackets beside a point, x amber and y blue, kept inside the grid: above it, or below when `below`. */
          // After a wrong answer the two sets of brackets go on opposite sides, away from each other.
          const apart = result === 'incorrect' && answer && dot && !same(answer, dot) ? { dx: Math.sign(dot.x - answer.x) || -1, dy: Math.sign(answer.y - dot.y) || -1 } : null
          // Brackets never sit on the axis numbers, off the grid, on a dot or on other brackets (placeLabel).
          if (dot && showDot) room.taken.push(dotBox(at(dot).x, at(dot).y))
          if (apart && answer) room.taken.push(dotBox(at(answer).x, at(answer).y))
          const brackets = (p: GraphPoint, className: string, flip = false) => {
            const text = pair(p), w = labelWidth(text), { x, y } = at(p)
            const side = apart ? (flip ? { dx: -apart.dx, dy: -apart.dy } : apart) : ends ? clearSide(ends[0], ends[1], p, grid) : null
            // Below the x axis the brackets go under the dot, clear of the axis numbers.
            const below = side ? side.dy > 0 : p.y < 0
            const right = side ? side.dx > 0 : x + 12 + w < width - 3
            const pick = placeLabel(x, y, w, { right, below }, room)
            return <HaloText key={`${p.x},${p.y}`} className={`graph-board__brackets ${className}`} x={pick.l + 2} y={pick.base}>(<tspan fill={AXIS.x}>{axisText(sx, p.x)}</tspan>, <tspan fill={AXIS.y}>{axisText(sy, p.y)}</tspan>)</HaloText>
          }
          const parts = []
          if (walk && dot) {
            const turn = { x: dot.x, y: origin.y }
            parts.push(arrow(origin, turn, 1, 'across'))
            if (stage === 'up') parts.push(arrow(turn, dot, 0, 'up'))
            // Counting a gradient: how far each arrow goes, beside it in its colour.
            if (spec.counts) {
              // Each count keeps off the axes, their numbers and the dots' brackets, like every label (fitLabel).
              const a = at(origin), t = at(turn), d = at(dot), below = dot.y >= origin.y
              const box = (text: string, l: number, base: number) => ({ l, r: l + text.length * 11 + 4, t: base - 14, b: base + 4, base })
              const count = (text: string, candidates: ReturnType<typeof box>[], family: number, key: string) => {
                const c = fitLabel(candidates, room)
                return <HaloText key={key} className={`graph-board__count is-f${family}`} x={c.l + 2} y={c.base}>{text}</HaloText>
              }
              if (dot.x !== origin.x) {
                // Under (or over) the middle of the arrow first, then nearer either end, clear of an axis it crosses.
                const text = String(Math.abs(dot.x - origin.x)), w = text.length * 11 + 4
                const spots = [0.5, 0.75, 0.25].map(f => a.x + (t.x - a.x) * f - w / 2), rows = below ? [t.y + 22, t.y - 8] : [t.y - 8, t.y + 22]
                parts.push(count(text, rows.flatMap(base => spots.map(l => box(text, l, base))), 1, 'nx'))
              }
              if (stage === 'up' && dot.y !== origin.y) {
                const text = String(Math.abs(dot.y - origin.y)), w = text.length * 11 + 4, mid = (t.y + d.y) / 2 + 6, out = dot.x > origin.x
                parts.push(count(text, out ? [box(text, t.x + 8, mid), box(text, t.x - 8 - w, mid)] : [box(text, t.x - 8 - w, mid), box(text, t.x + 8, mid)], 0, 'ny'))
              }
            }
            if (!disabled) {
              const handle = stage === 'across' ? turn : dot
              parts.push(<circle key="handle" className={`graph-board__handle is-f${stage === 'across' ? 1 : 0}`} cx={at(handle).x} cy={at(handle).y} r="11" />)
            }
          }
          if (halves && ends && dot) {
            parts.push(arrow(ends[0], { x: dot.x, y: ends[0].y }, 1, 'a1'), arrow({ x: dot.x, y: ends[0].y }, dot, 0, 'a2'))
            parts.push(arrow(dot, { x: ends[1].x, y: dot.y }, 1, 'b1'), arrow({ x: ends[1].x, y: dot.y }, ends[1], 0, 'b2'))
          }
          // The student's brackets are placed first, beside their own dot; the right answer's then find room around them.
          const own = dot && showDot && labelled ? brackets(dot, '') : null
          if (result === 'incorrect' && answer && !same(answer, dot)) {
            parts.push(<g key="answer" className="graph-board__dot is-answer"><circle cx={at(answer).x} cy={at(answer).y} r="7" />{brackets(answer, 'is-answer', true)}</g>)
          }
          // While walking, the dot pops in where the walk ends, once the handle is let go.
          if (dot && showDot && !(walk && !disabled && (stage === 'across' || held))) {
            parts.push(<g key={`dot${dot.x},${dot.y}`} className={`graph-board__dot${status}${walk ? ' is-pop' : ''}`}>
              {!disabled && !walk && <circle className="graph-board__halo" cx={at(dot).x} cy={at(dot).y} r="16" />}
              <circle cx={at(dot).x} cy={at(dot).y} r="7" />
              {own}
            </g>)
          }
          return parts
        },
      }} />
    </div>
    <p className="sr-only" id={`${id}-live`} aria-live="polite">{live}</p>
    {rule && dot && <p className="graph-board__note graph-board__sum" aria-hidden="true">{spec.reads ? <><span className="is-x">{spec.reads[0]}{axisText(sx, dot.x)}</span> is <span className="is-y">{spec.reads[1]}{axisText(sy, dot.y)}</span></> : curve && spec.curveText ? <CurveSum text={spec.curveText} x={dot.x} /> : <RuleSum rule={rule} x={dot.x} />}</p>}
    {mode === 'midpoint' && <p className={`graph-board__note${halfway ? ' is-right' : ''}`} aria-hidden="true">{halfway ? 'Halfway: both halves match' : 'Drag the dot until both halves match'}</p>}
    {walk && !disabled && <div className="graph-board__tools">
      <p className="graph-board__note" aria-hidden="true">{stage === 'across' ? <>Drag the <span className="is-x">amber</span> handle across</> : <>Now drag the <span className="is-y">blue</span> handle up or down</>}</p>
      {moved && <button type="button" className="graph-board__again" onClick={restart}>Start again</button>}
    </div>}
  </div>
}

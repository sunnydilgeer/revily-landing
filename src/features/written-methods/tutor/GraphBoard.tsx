'use client'

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { AXIS, GraphVisual, UNIT, fmt } from './GraphPictures'
import type { GraphFrame, GraphPoint } from './methodWorking'
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
 *
 * Only the play screens show the dot's brackets while it moves (they would give the answer away in a question).
 * After Check, the dot shows its brackets, and a wrong one shows the right point, green, beside it.
 */

export type GraphBoardGrid = Omit<GraphFrame, 'step' | 'adds'>
export type GraphBoardSpec = {
  mode: 'plot' | 'drag' | 'walk' | 'explore' | 'midpoint'
  grid: GraphBoardGrid
  /** Where the dot starts (drag, explore, midpoint). */
  start?: GraphPoint
  /** The midpoint play screen: the line's two ends. */
  ends?: [GraphPoint, GraphPoint]
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

export function GraphBoard({ spec, answer, result, disabled, onChange }: {
  spec: GraphBoardSpec
  /** The right point, shown after a wrong answer. */
  answer?: GraphPoint
  result?: 'correct' | 'incorrect'
  disabled?: boolean
  onChange?: (value: string) => void
}) {
  const { mode, grid } = spec
  const [x0, x1] = grid.x, [y0, y1] = grid.y
  const walk = mode === 'walk'
  const play = mode === 'explore' || mode === 'midpoint'
  const [dot, setDot] = useState<GraphPoint | null>(walk ? { x: 0, y: 0 } : spec.start ?? null)
  const [stage, setStage] = useState<'across' | 'up'>('across')
  const [held, setHeld] = useState(false)
  const [moved, setMoved] = useState(false)
  const pressed = useRef(false)
  const id = useId()

  // The dot stays on a numbered corner: inside the grid, off its edges.
  const clamp = (p: GraphPoint): GraphPoint => ({ x: Math.min(Math.max(p.x, x0 + 1), x1 - 1), y: Math.min(Math.max(p.y, y0 + 1), y1 - 1) })
  function report(next: GraphPoint | null, nextStage = stage) {
    if (!onChange || play) return
    onChange(next && (!walk || nextStage === 'up') ? `${next.x}, ${next.y}` : '')
  }
  function moveTo(target: GraphPoint) {
    const snapped = clamp(target)
    // Walking: along the x axis first, then straight up or down from there.
    const next = walk ? stage === 'across' ? { x: snapped.x, y: 0 } : { x: dot?.x ?? 0, y: snapped.y } : snapped
    if (same(next, dot)) return
    setDot(next); setMoved(true); report(next)
  }
  function corner(event: PointerEvent<SVGSVGElement>): GraphPoint {
    const box = event.currentTarget.getBoundingClientRect()
    return { x: x0 + Math.round((event.clientX - box.left - 0.5) / UNIT), y: y1 - Math.round((event.clientY - box.top - 0.5) / UNIT) }
  }
  function finishWalkStage() {
    if (walk && stage === 'across' && dot && dot.x !== 0) { setStage('up'); report(dot, 'up') }
  }
  function restart() {
    setDot({ x: 0, y: 0 }); setStage('across'); setMoved(false); report(null, 'across')
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[event.key]
    if (!step) return
    event.preventDefault()
    const from = dot ?? { x: 0, y: 0 }
    if (walk) {
      // Left and right walk across; up and down start the second part of the walk.
      if (step[0] !== 0 && stage === 'across') return moveTo({ x: from.x + step[0], y: 0 })
      if (step[1] !== 0) {
        if (from.x === 0) return
        const next = clamp({ x: from.x, y: from.y + step[1] })
        setStage('up'); setDot(next); setMoved(true); report(next, 'up')
      }
      return
    }
    moveTo(dot ? { x: from.x + step[0], y: from.y + step[1] } : from)
  }

  const ends = spec.ends
  const halves = ends && dot ? { first: { x: dot.x - ends[0].x, y: dot.y - ends[0].y }, second: { x: ends[1].x - dot.x, y: ends[1].y - dot.y } } : null
  const halfway = !!halves && halves.first.x === halves.second.x && halves.first.y === halves.second.y
  const showDot = !!dot && (!walk || stage === 'up' || moved)
  // The dot's own numbers light up on the axes as it moves: only x while walking across.
  const marks: NonNullable<GraphFrame['marks']> = []
  if (dot && showDot) {
    if (!walk || dot.x !== 0 || stage === 'up') marks.push({ axis: 'x', value: dot.x, family: 1 })
    if (!walk || stage === 'up') marks.push({ axis: 'y', value: dot.y, family: 0 })
  }
  if (result === 'incorrect' && answer && !same(answer, dot)) {
    if (!marks.some(m => m.axis === 'x' && m.value === answer.x)) marks.push({ axis: 'x', value: answer.x, family: 1 })
    if (!marks.some(m => m.axis === 'y' && m.value === answer.y)) marks.push({ axis: 'y', value: answer.y, family: 0 })
  }
  const frame: GraphFrame = {
    ...grid, step: 0, adds: 'picture', marks,
    lines: [...(grid.lines ?? []), ...(ends ? [{ from: ends[0], to: ends[1], at: -1, segment: true }] : [])],
    points: [...(grid.points ?? []), ...(ends ?? []).map(p => ({ ...p, at: -1, place: clearSide(ends![0], ends![1], p, grid) }))],
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
        draw: ({ px, py, width, height }) => {
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
          // Brackets never sit on the axis numbers, off the grid or on another set of brackets: the preferred corner
          // beside the dot first, then the other three.
          const taken: { l: number; r: number; t: number; b: number }[] = []
          const axisX = px(Math.min(Math.max(0, x0), x1)), axisY = py(Math.min(Math.max(0, y0), y1))
          const brackets = (p: GraphPoint, className: string, flip = false) => {
            const text = pair(p), w = text.length * 8.6, { x, y } = at(p)
            const side = apart ? (flip ? { dx: -apart.dx, dy: -apart.dy } : apart) : ends ? clearSide(ends[0], ends[1], p, grid) : null
            // Below the x axis the brackets go under the dot, clear of the axis numbers.
            const below = side ? side.dy > 0 : p.y < 0
            const right = side ? side.dx > 0 : x + 12 + w < width - 3
            const box = (r: boolean, b: boolean) => { const l = r ? x + 12 : x - 12 - w, base = b ? y + 27 : y - 14; return { l, r: l + w, t: base - 14, b: base + 4, base } }
            const clear = (c: ReturnType<typeof box>) => c.l >= 3 && c.r <= width - 3 && c.t >= 2 && c.b <= height - 2
              && !(c.l < axisX + 4 && c.r > axisX - 30) && !(c.b > axisY - 2 && c.t < axisY + 24)
              && !taken.some(o => c.l < o.r && c.r > o.l && c.t < o.b && c.b > o.t)
            const fallback = box(right, below)
            const pick = [box(right, below), box(!right, below), box(right, !below), box(!right, !below)].find(clear)
              ?? { ...fallback, l: Math.min(Math.max(fallback.l, 3), width - 3 - w), base: Math.min(Math.max(fallback.base, 18), height - 5) }
            taken.push(pick)
            return <text className={`graph-board__brackets ${className}`} x={pick.l} y={pick.base}>(<tspan fill={AXIS.x}>{fmt(p.x)}</tspan>, <tspan fill={AXIS.y}>{fmt(p.y)}</tspan>)</text>
          }
          const parts = []
          if (walk && dot) {
            parts.push(arrow({ x: 0, y: 0 }, { x: dot.x, y: 0 }, 1, 'across'))
            if (stage === 'up') parts.push(arrow({ x: dot.x, y: 0 }, dot, 0, 'up'))
            if (!disabled) {
              const handle = stage === 'across' ? { x: dot.x, y: 0 } : dot
              parts.push(<circle key="handle" className={`graph-board__handle is-f${stage === 'across' ? 1 : 0}`} cx={at(handle).x} cy={at(handle).y} r="11" />)
            }
          }
          if (halves && ends && dot) {
            parts.push(arrow(ends[0], { x: dot.x, y: ends[0].y }, 1, 'a1'), arrow({ x: dot.x, y: ends[0].y }, dot, 0, 'a2'))
            parts.push(arrow(dot, { x: ends[1].x, y: dot.y }, 1, 'b1'), arrow({ x: ends[1].x, y: dot.y }, ends[1], 0, 'b2'))
          }
          if (result === 'incorrect' && answer && !same(answer, dot)) {
            parts.push(<g key="answer" className="graph-board__dot is-answer"><circle cx={at(answer).x} cy={at(answer).y} r="7" />{brackets(answer, 'is-answer', true)}</g>)
          }
          // While walking, the dot pops in where the walk ends, once the handle is let go.
          if (dot && showDot && !(walk && !disabled && (stage === 'across' || held))) {
            parts.push(<g key={`dot${dot.x},${dot.y}`} className={`graph-board__dot${status}${walk ? ' is-pop' : ''}`}>
              {!disabled && !walk && <circle className="graph-board__halo" cx={at(dot).x} cy={at(dot).y} r="16" />}
              <circle cx={at(dot).x} cy={at(dot).y} r="7" />
              {labelled && brackets(dot, '')}
            </g>)
          }
          return parts
        },
      }} />
    </div>
    <p className="sr-only" id={`${id}-live`} aria-live="polite">{live}</p>
    {mode === 'midpoint' && <p className={`graph-board__note${halfway ? ' is-right' : ''}`} aria-hidden="true">{halfway ? 'Halfway: both halves match' : 'Drag the dot until both halves match'}</p>}
    {walk && !disabled && <div className="graph-board__tools">
      <p className="graph-board__note" aria-hidden="true">{stage === 'across' ? <>Drag the <span className="is-x">amber</span> handle across</> : <>Now drag the <span className="is-y">blue</span> handle up or down</>}</p>
      {moved && <button type="button" className="graph-board__again" onClick={restart}>Start again</button>}
    </div>}
  </div>
}

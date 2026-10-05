import { Fragment, type ReactNode } from 'react'
import type { GraphFrame, GraphPoint } from './methodWorking'
import { Powers } from './Powers'

/*
 * Straight line graphs (lesson 26, GR1), like the GR1.1 video: a square grid with its axes, the straight lines drawn
 * edge to edge, points with their coordinates, and the step from one point to another: across (change in x, amber)
 * and up or down (change in y, biro blue). A line the question gives is plain ink; a line a step draws is biro blue,
 * and green once it is the answer. The points a step reads are ringed in purple, as in EXPLANATIONS.md.
 */

const W = 320, LEFT = 30, RIGHT = 24, TOP = 22, BOTTOM = 30, MAX_HEIGHT = 330
const fmt = (n: number) => String(n).replace('-', '−')
const fix = (n: number) => n.toFixed(1)
export const coordinate = (p: GraphPoint) => `(${fmt(p.x)}, ${fmt(p.y)})`

/** The part of the line through a and b that is inside the grid (Liang–Barsky). */
export function clip(frame: Pick<GraphFrame, 'x' | 'y'>, a: GraphPoint, b: GraphPoint): [GraphPoint, GraphPoint] {
  const dx = b.x - a.x, dy = b.y - a.y
  let low = -Infinity, high = Infinity
  for (const [d, start, min, max] of [[dx, a.x, frame.x[0], frame.x[1]], [dy, a.y, frame.y[0], frame.y[1]]] as const) {
    if (d === 0) continue
    const t1 = (min - start) / d, t2 = (max - start) / d
    low = Math.max(low, Math.min(t1, t2)); high = Math.min(high, Math.max(t1, t2))
  }
  return [{ x: a.x + low * dx, y: a.y + low * dy }, { x: a.x + high * dx, y: a.y + high * dy }]
}

/** The line's name for a screen reader: "y = 3", "x = −2", or the points it goes through. */
function spokenLine(line: NonNullable<GraphFrame['lines']>[number]) {
  if (line.label) return line.label.replace(/−/g, 'minus ')
  return `a straight line through ${coordinate(line.from)} and ${coordinate(line.to)}`
}
function spoken(frame: GraphFrame, plain?: boolean) {
  const parts = [`A grid with x from ${fmt(frame.x[0])} to ${fmt(frame.x[1])} and y from ${fmt(frame.y[0])} to ${fmt(frame.y[1])}.`]
  const own = <T extends { at: number }>(list: T[] = []) => list.filter(part => !plain || part.at < 0)
  for (const line of own(frame.lines)) parts.push(`The line ${spokenLine(line)}.`)
  for (const point of own(frame.points)) parts.push(`A point at ${coordinate(point)}.`)
  if (!plain) {
    for (const leg of frame.legs ?? []) parts.push(`${leg.from.y === leg.to.y ? 'Across' : leg.to.y > leg.from.y ? 'Up' : 'Down'} ${leg.label}.`)
    for (const line of frame.working ?? []) parts.push(`${line.text}.`)
    if (frame.answer) parts.push(`The answer: ${frame.answer.text}.`)
  }
  return parts.join(' ')
}

/** The picture so far. `plain` is the question before any working. The step's heading goes above what it adds. */
export function GraphVisual({ frame, heading, plain, focus }: { frame: GraphFrame; heading?: ReactNode; plain?: boolean; focus?: boolean }) {
  // Older parts grey out; what the step before added stays clear, because this step works on it (Sunny, 1 Oct).
  // A part with `at` −1 is the question's own picture: it is shown from the start and never greyed.
  const done = (at: number) => focus && !plain && at >= 0 && frame.step > 0 && at < frame.step - 1 ? ' is-done' : ''
  const shown = (at: number) => !plain || at < 0
  const head = (adds: GraphFrame['adds']) => !plain && frame.adds === adds && heading ? <div className="ns-graph__heading">{heading}</div> : null
  const [x0, x1] = frame.x, [y0, y1] = frame.y
  const unit = Math.min((W - LEFT - RIGHT) / (x1 - x0), (MAX_HEIGHT - TOP - BOTTOM) / (y1 - y0))
  const width = LEFT + RIGHT + (x1 - x0) * unit, height = TOP + BOTTOM + (y1 - y0) * unit
  const px = (x: number) => LEFT + (x - x0) * unit, py = (y: number) => TOP + (y1 - y) * unit
  const every = unit < 20 ? 2 : 1
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)
  const axisX = Math.min(Math.max(0, x0), x1), axisY = Math.min(Math.max(0, y0), y1)
  const lines = (frame.lines ?? []).filter(line => shown(line.at))
  const points = (frame.points ?? []).filter(point => shown(point.at))
  const legs = plain ? [] : frame.legs ?? []
  const working = plain ? [] : frame.working ?? []
  return <div className={`ns-graph${plain ? ' is-plain' : ''}`} role="img" aria-label={spoken(frame, plain)}>
    {head('picture')}
    <svg className="ns-graph__picture" viewBox={`0 0 ${fix(width)} ${fix(height)}`} style={{ maxWidth: `${Math.round(width * 1.5)}px` }} aria-hidden="true">
      <g className="ns-graph__grid">
        {range(x0, x1).map(x => <line key={`gx${x}`} x1={fix(px(x))} x2={fix(px(x))} y1={fix(py(y1))} y2={fix(py(y0))} />)}
        {range(y0, y1).map(y => <line key={`gy${y}`} x1={fix(px(x0))} x2={fix(px(x1))} y1={fix(py(y))} y2={fix(py(y))} />)}
      </g>
      <g className="ns-graph__axes">
        <line x1={fix(px(x0))} x2={fix(px(x1) + 8)} y1={fix(py(axisY))} y2={fix(py(axisY))} />
        <line x1={fix(px(axisX))} x2={fix(px(axisX))} y1={fix(py(y0))} y2={fix(py(y1) - 8)} />
        <path d={`M${fix(px(x1) + 2)} ${fix(py(axisY) - 5)} L${fix(px(x1) + 9)} ${fix(py(axisY))} L${fix(px(x1) + 2)} ${fix(py(axisY) + 5)} M${fix(px(axisX) - 5)} ${fix(py(y1) - 2)} L${fix(px(axisX))} ${fix(py(y1) - 9)} L${fix(px(axisX) + 5)} ${fix(py(y1) - 2)}`} />
        <text className="ns-graph__axis-name" x={fix(px(x1) + 6)} y={fix(py(axisY) + 20)}>x</text>
        <text className="ns-graph__axis-name" x={fix(px(axisX) + 9)} y={fix(py(y1) - 6)}>y</text>
      </g>
      <g className="ns-graph__numbers">
        {range(x0, x1).filter(x => x !== axisX && x % every === 0).map(x => <text key={`nx${x}`} x={fix(px(x))} y={fix(py(axisY) + 17)}>{fmt(x)}</text>)}
        {range(y0, y1).filter(y => y !== axisY && y % every === 0).map(y => <text key={`ny${y}`} className="is-y" x={fix(px(axisX) - 6)} y={fix(py(y) + 5)}>{fmt(y)}</text>)}
        <text className="is-y" x={fix(px(axisX) - 6)} y={fix(py(axisY) + 17)}>0</text>
      </g>
      {lines.map((line, i) => {
        const [a, b] = clip(frame, line.from, line.to)
        // The label sits near one end, nudged off the line: the right end of a line across, the bottom of a line up
        // and down (so it doesn't meet a line across the top), and the top end of a sloping line.
        const vertical = a.x === b.x
        const end = vertical ? (a.y < b.y ? a : b) : b.y > a.y || (b.y === a.y && b.x > a.x) ? b : a, other = end === b ? a : b
        const along = { x: px(other.x) - px(end.x), y: py(other.y) - py(end.y) }, size = Math.hypot(along.x, along.y)
        const at = { x: px(end.x) + along.x / size * 30, y: py(end.y) + along.y / size * 30 }
        const kind = line.answer ? ' is-answer' : line.at >= 0 ? ' is-found' : ''
        return <g key={`l${i}`} className={`ns-graph__line${kind}${done(line.at)}`}>
          <line x1={fix(px(a.x))} y1={fix(py(a.y))} x2={fix(px(b.x))} y2={fix(py(b.y))} />
          {line.label && <text x={fix(at.x + (vertical ? 8 : 0))} y={fix(at.y + (vertical ? 0 : -10))} textAnchor={vertical ? 'start' : 'middle'}>{line.label}</text>}
        </g>
      })}
      {legs.map((leg, i) => {
        const across = leg.from.y === leg.to.y
        const ax = px(leg.from.x), ay = py(leg.from.y), bx = px(leg.to.x), by = py(leg.to.y)
        const dir = across ? Math.sign(bx - ax) : Math.sign(by - ay)
        const head = across ? `M${fix(bx - dir * 8)} ${fix(by - 6)} L${fix(bx)} ${fix(by)} L${fix(bx - dir * 8)} ${fix(by + 6)}` : `M${fix(bx - 6)} ${fix(by - dir * 8)} L${fix(bx)} ${fix(by)} L${fix(bx + 6)} ${fix(by - dir * 8)}`
        // Each size goes outside the triangle the two steps make, so the line through it never crosses a label.
        const other = legs.find(o => o !== leg && (across ? o.to.x === leg.from.x && o.to.y === leg.from.y : o.from.x === leg.to.x && o.from.y === leg.to.y))
        const outside = across ? (other ? other.to.y > other.from.y : leg.from.y <= (y0 + y1) / 2) : (other ? other.to.x > other.from.x : false)
        const label = across ? { x: (ax + bx) / 2, y: ay + (outside ? -10 : 22), anchor: 'middle' as const } : { x: ax + (outside ? -9 : 9), y: (ay + by) / 2 + 6, anchor: outside ? 'end' as const : 'start' as const }
        return <g key={`g${i}`} className={`ns-graph__leg is-f${leg.family % 4}${done(leg.at)}`}>
          <line x1={fix(ax)} y1={fix(ay)} x2={fix(bx)} y2={fix(by)} />
          <path d={head} />
          <text x={fix(label.x)} y={fix(label.y)} textAnchor={label.anchor}>{leg.label}</text>
        </g>
      })}
      {points.map((point, i) => {
        // The coordinates go beside a point on a line up and down, under a point on a line across, and otherwise
        // above it (below it under the x axis, clear of the axis numbers).
        const onUpDown = lines.some(line => line.from.x === line.to.x && line.from.x === point.x) || points.filter(q => q.x === point.x).length > 2
        const onAcross = !onUpDown && (lines.some(line => line.from.y === line.to.y && line.from.y === point.y) || points.filter(q => q.y === point.y).length > 2)
        const right = point.x < (x0 + x1) / 2
        const place = point.place ? { x: point.place.dx * 7, y: point.place.dy > 0 ? 21 : -10, anchor: point.place.dx > 0 ? 'start' as const : 'end' as const }
          : onUpDown ? { x: right ? 10 : -10, y: 5, anchor: right ? 'start' as const : 'end' as const }
          : onAcross ? { x: 0, y: 21, anchor: 'middle' as const }
          : { x: right ? 9 : -9, y: point.y < axisY ? 21 : -9, anchor: right ? 'start' as const : 'end' as const }
        return <g key={`p${i}`} className={`ns-graph__point${point.at >= 0 ? ' is-found' : ''}${done(point.at)}`}>
          <circle cx={fix(px(point.x))} cy={fix(py(point.y))} r="5" />
          {point.label !== '' && <text x={fix(px(point.x) + place.x)} y={fix(py(point.y) + place.y)} textAnchor={place.anchor}>{point.label ?? coordinate(point)}</text>}
        </g>
      })}
      {!plain && (frame.boxed ?? []).map((point, i) => <circle key={`b${i}`} className="ns-graph__box" cx={fix(px(point.x))} cy={fix(py(point.y))} r="11" />)}
    </svg>
    {working.map((line, i) => <Fragment key={`w${i}`}>
      {frame.adds === 'lines' && line.at === frame.step && working.findIndex(l => l.at === frame.step) === i && head('lines')}
      <p className={`ns-graph__text is-f${line.family % 4}${done(line.at)}`} aria-hidden="true"><Powers text={line.text} /></p>
    </Fragment>)}
    {!plain && frame.answer && <>
      {head('answer')}
      <p className="ns-eq__answer" aria-hidden="true"><Powers text={frame.answer.text} /></p>
    </>}
  </div>
}

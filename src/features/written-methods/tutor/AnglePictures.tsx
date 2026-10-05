import { Fragment, type ReactNode } from 'react'
import type { AngleFrame } from './methodWorking'
import { Powers } from './Powers'

/*
 * Angle facts (lesson 26, G1), like the G1.1 video: straight lines from one point, an arc for each angle with its size
 * or letter. A given angle is plain ink and a letter is biro blue. A step boxes the angles it uses in purple; an angle
 * it finds shows its size (blue halfway, green for the answer), as in EXPLANATIONS.md. Arcs next to each other
 * alternate between two sizes, so four angles where two lines cross read as four arcs, not a circle.
 */

const W = 320
const at = (cx: number, cy: number, deg: number, r: number) => [cx + r * Math.cos(deg * Math.PI / 180), cy - r * Math.sin(deg * Math.PI / 180)]
const fix = (n: number) => n.toFixed(1)
const sweepOf = (arc: { from: number; to: number }) => ((arc.to - arc.from) % 360 + 360) % 360
const spokenLabel = (label: string) => label.replace(/°/g, ' degrees')

function spoken(frame: AngleFrame, labels: string[]) {
  const parts = [frame.straight ? 'Angles on a straight line.' : frame.rays.length === 4 && frame.arcs.length === 4 ? 'Two straight lines crossing at a point.' : 'Angles around a point.']
  parts.push(`Going round: ${labels.map(label => label ? spokenLabel(label) : 'an unmarked angle').join(', ')}.`)
  for (const line of frame.lines ?? []) parts.push(`${line.text}.`)
  if (frame.answer) parts.push(`The answer: ${frame.answer.text}.`)
  return parts.join(' ')
}

/** The picture so far. `plain` is the question before any working. The step's heading goes above what it adds. */
export function AngleVisual({ frame, heading, plain, focus }: { frame: AngleFrame; heading?: ReactNode; plain?: boolean; focus?: boolean }) {
  // Older parts grey out; what the step before added stays clear, because this step works on it (Sunny, 1 Oct).
  const done = (at: number) => focus && !plain && frame.step > 0 && at < frame.step - 1 ? ' is-done' : ''
  const head = (adds: AngleFrame['adds']) => !plain && frame.adds === adds && heading ? <div className="ns-ang__heading">{heading}</div> : null
  const height = frame.straight ? 170 : 250
  const cx = W / 2, cy = frame.straight ? 140 : height / 2, length = frame.straight ? 140 : 112
  const rays = frame.straight ? [0, 180, ...frame.rays.filter(deg => deg % 180 !== 0)] : frame.rays
  const found = plain ? [] : frame.found ?? []
  const boxed = new Set(plain ? [] : frame.boxed ?? [])
  const labels = frame.arcs.map((arc, i) => found.findLast(f => f.arc === i)?.text ?? arc.label)
  const lines = plain ? [] : frame.lines ?? []
  return <div className={`ns-ang${plain ? ' is-plain' : ''}`} role="img" aria-label={spoken({ ...frame, lines, answer: plain ? undefined : frame.answer }, labels)}>
    {head('picture')}
    <svg className="ns-ang__picture" viewBox={`0 0 ${W} ${height}`} aria-hidden="true">
      {rays.map(deg => { const [x, y] = at(cx, cy, deg, length); return <line key={deg} className="ns-ang__ray" x1={cx} y1={cy} x2={fix(x)} y2={fix(y)} /> })}
      {frame.arcs.map((arc, i) => {
        const sweep = sweepOf(arc), mid = arc.from + sweep / 2
        const r = (sweep < 50 ? 40 : 26) + (i % 2) * 10
        const own = found.findLast(f => f.arc === i)
        if (!labels[i]) return null
        const kind = own ? own.answer ? ' is-answer' : ' is-found' : boxed.has(i) ? ' is-boxed' : /^[a-z]$/.test(arc.label) ? ' is-letter' : ''
        const [lx, ly] = at(cx, cy, mid, sweep === 90 ? 48 : r + (sweep < 50 ? 30 : 27))
        let shape: ReactNode
        if (sweep === 90) {
          const [ax, ay] = at(cx, cy, arc.from, 20), [bx, by] = at(cx, cy, arc.to, 20)
          shape = <path d={`M${fix(ax)} ${fix(ay)} L${fix(ax + bx - cx)} ${fix(ay + by - cy)} L${fix(bx)} ${fix(by)}`} />
        } else {
          const [ax, ay] = at(cx, cy, arc.from, r), [bx, by] = at(cx, cy, arc.to, r)
          shape = <path d={`M${fix(ax)} ${fix(ay)} A${r} ${r} 0 ${sweep > 180 ? 1 : 0} 0 ${fix(bx)} ${fix(by)}`} />
        }
        return <g key={i} className={`ns-ang__arc${kind}${own ? done(own.at) : ''}`}>
          {shape}
          <text x={fix(lx)} y={fix(ly + 7)}>{labels[i]}</text>
        </g>
      })}
      <circle className="ns-ang__point" cx={cx} cy={cy} r="4" />
    </svg>
    {lines.map((line, i) => <Fragment key={i}>
      {frame.adds === 'lines' && line.at === frame.step && lines.findIndex(l => l.at === frame.step) === i && head('lines')}
      <p className={`ns-ang__text is-f${line.family % 4}${done(line.at)}`} aria-hidden="true"><Powers text={line.text} /></p>
    </Fragment>)}
    {!plain && frame.answer && <>
      {head('answer')}
      <p className="ns-eq__answer" aria-hidden="true"><Powers text={frame.answer.text} /></p>
    </>}
  </div>
}

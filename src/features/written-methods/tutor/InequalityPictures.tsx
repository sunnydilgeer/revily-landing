import type { ReactNode } from 'react'
import type { NumberLineFrame } from './methodWorking'
import { Powers } from './Powers'

/*
 * Inequalities on a number line (lessons 24 and 25), like the A10 and A11 videos: the numbers under the line, a filled
 * circle on a number that is included and an open one on a number that isn't, then the arrow off the end (one sign) or
 * the line joining two circles (two signs). Whole numbers that fit are marked with green dots. The circles and the line
 * are biro blue; the number a step reads or draws is boxed in purple; green is the answer, as in EXPLANATIONS.md.
 */

const fmt = (n: number) => String(n).replace('-', '−')
const X0 = 30, X1 = 290, AXIS = 38

function spoken(frame: NumberLineFrame) {
  const parts = [`A number line from ${fmt(frame.ticks[0])} to ${fmt(frame.ticks.at(-1)!)}.`]
  for (const circle of frame.circles ?? []) parts.push(`${circle.closed ? 'A filled circle' : 'An open circle'} at ${fmt(circle.value)}: ${fmt(circle.value)} is ${circle.closed ? '' : 'not '}included.`)
  if (frame.shade) parts.push(typeof frame.shade.to === 'number' ? `A line joins ${fmt(frame.shade.from)} and ${fmt(frame.shade.to)}.` : `An arrow from ${fmt(frame.shade.from)} points ${frame.shade.to}, to the ${frame.shade.to === 'left' ? 'smaller' : 'bigger'} numbers.`)
  if (frame.dots) parts.push(`The whole numbers that fit: ${frame.dots.values.map(fmt).join(', ')}.`)
  for (const line of frame.lines ?? []) parts.push(`${line.text}.`)
  if (frame.answer) parts.push(`The answer: ${frame.answer.text}.`)
  return parts.join(' ')
}

/** The picture so far. `plain` is the question before any working. The step's heading goes above what it adds. */
export function NumberLineVisual({ frame, heading, plain, focus }: { frame: NumberLineFrame; heading?: ReactNode; plain?: boolean; focus?: boolean }) {
  // Older parts grey out; what the step before added stays clear, because this step works on it (Sunny, 1 Oct).
  // A part with `at` −1 is the question's own picture: it is shown from the start and never greyed.
  const done = (at: number) => focus && !plain && at >= 0 && frame.step > 0 && at < frame.step - 1 ? ' is-done' : ''
  const shown = (at: number) => !plain || at < 0
  const head = (adds: NumberLineFrame['adds']) => !plain && frame.adds === adds && heading ? <div className="ns-nl__heading">{heading}</div> : null
  const first = frame.ticks[0], last = frame.ticks.at(-1)!
  const x = (n: number) => X0 + (n - first) / (last - first) * (X1 - X0)
  const shade = frame.shade && shown(frame.shade.at) ? frame.shade : undefined, dots = new Set(frame.dots?.values ?? [])
  const end = shade && (shade.to === 'left' ? 8 : shade.to === 'right' ? 312 : x(shade.to))
  const lines = plain ? [] : frame.lines ?? []
  return <div className={`ns-nl${plain ? ' is-plain' : ''}`} role="img" aria-label={plain ? spoken({ ...frame, circles: frame.circles?.filter(circle => circle.at < 0), shade, lines: undefined, answer: undefined, dots: undefined }) : spoken(frame)}>
    {head('line')}
    <svg className="ns-nl__line" viewBox="0 0 320 80" aria-hidden="true">
      <line className="ns-nl__axis" x1="4" x2="316" y1={AXIS} y2={AXIS} />
      <path className="ns-nl__axis-end" d={`M10 ${AXIS - 6} L4 ${AXIS} L10 ${AXIS + 6} M310 ${AXIS - 6} L316 ${AXIS} L310 ${AXIS + 6}`} />
      {frame.ticks.map(n => <g key={n} className={`ns-nl__tick${dots.has(n) && !plain ? ` is-answer${done(frame.dots!.at)}` : ''}`}>
        <line x1={x(n)} x2={x(n)} y1={AXIS - 6} y2={AXIS + 6} />
        <text x={x(n)} y={AXIS + 34}>{fmt(n)}</text>
      </g>)}
      {shade && end !== undefined && <g className={`ns-nl__shade${done(shade.at)}`}>
        <line x1={x(shade.from)} x2={end} y1={AXIS} y2={AXIS} />
        {typeof shade.to !== 'number' && <path d={shade.to === 'left' ? `M18 ${AXIS - 9} L6 ${AXIS} L18 ${AXIS + 9}` : `M302 ${AXIS - 9} L314 ${AXIS} L302 ${AXIS + 9}`} />}
      </g>}
      {(frame.circles ?? []).filter(circle => shown(circle.at)).map(circle => <circle key={circle.value} className={`ns-nl__circle ${circle.closed ? 'is-closed' : 'is-open'}${done(circle.at)}`} cx={x(circle.value)} cy={AXIS} r="8.5" />)}
      {!plain && [...dots].map(n => <circle key={`d${n}`} className={`ns-nl__dot${done(frame.dots!.at)}`} cx={x(n)} cy={AXIS} r="7.5" />)}
      {!plain && (frame.boxed ?? []).map(n => <rect key={`b${n}`} className="ns-nl__box" x={x(n) - 18} y={AXIS - 16} width="36" height="56" rx="8" />)}
    </svg>
    {lines.map((line, i) => [
      frame.adds === 'lines' && line.at === frame.step && lines.findIndex(l => l.at === frame.step) === i && head('lines'),
      <p key={`l${i}`} className={`ns-nl__text is-f${line.family % 4}${done(line.at)}`} aria-hidden="true"><Powers text={line.text} /></p>,
    ])}
    {!plain && frame.answer && <>
      {head('answer')}
      <p className="ns-eq__answer" aria-hidden="true"><Powers text={frame.answer.text} /></p>
    </>}
  </div>
}

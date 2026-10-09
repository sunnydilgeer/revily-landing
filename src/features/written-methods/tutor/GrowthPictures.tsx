import type { GrowthFrame } from './methodWorking'

/*
 * Money year by year (lesson 34, R5), like the bars in the R5 videos: one bar for the start and one for each year,
 * its value in a pill above it. Every bar is on screen from the start, a faint outline until its year is worked out,
 * so the picture keeps its size from step to step (Sunny). One colour only (Sunny, 8 Oct); the start bar is grey, as
 * in the videos. Heights are to scale from 0, against the biggest value in the working (`top`).
 */

export const GROWTH_WIDTH = 320
export const GROWTH_HEIGHT = 176
const PAD = 4, BASE = GROWTH_HEIGHT - 26, PILL_H = 22, TALLEST = BASE - PAD - PILL_H - 8
export const PILL_SIZE = 13
/** Text widths at the picture's font sizes, a little generous so nothing touches its neighbour. */
export const textWidth = (text: string, size: number) => [...text].length * size * 0.56
export const growthPillWidth = (text: string) => textWidth(text, PILL_SIZE) + 10

/** Each bar's slot: the space it and its pill get across the picture. */
export function growthSlot(frame: GrowthFrame) {
  return (GROWTH_WIDTH - 2 * PAD) / frame.bars.length
}
/** A bar's height, to scale from 0. */
export const barHeight = (frame: GrowthFrame, value: number) => Math.max(2, TALLEST * value / frame.top)

function spoken(frame: GrowthFrame) {
  const known = frame.bars.filter(bar => bar.shown).map(bar => `${bar.name} ${bar.shown}`)
  return `Bars year by year: ${known.join(', ')}${frame.bars.some(bar => !bar.reached) ? ', the rest still to work out' : ''}.`
}

export function GrowthVisual({ frame }: { frame: GrowthFrame }) {
  const slot = growthSlot(frame), width = Math.min(46, slot - 12)
  return <div className="ns-growth" role="img" aria-label={spoken(frame)}>
    <svg viewBox={`0 0 ${GROWTH_WIDTH} ${GROWTH_HEIGHT}`} aria-hidden="true">
      <line className="ns-growth__base" x1={PAD} x2={GROWTH_WIDTH - PAD} y1={BASE} y2={BASE} />
      {frame.bars.map((bar, i) => {
        // A year not worked out yet is a faint outline as tall as the start, so it gives nothing away.
        const mid = PAD + slot * (i + 0.5), h = barHeight(frame, bar.reached ? bar.value : frame.bars[0].value), pill = bar.shown ? growthPillWidth(bar.shown) : 0
        const className = `ns-growth__bar${i === 0 ? ' is-start' : ''}${bar.reached ? '' : ' is-dim'}${frame.lit === i ? ' is-lit' : ''}`
        return <g key={i} className={className}>
          <rect x={mid - width / 2} y={BASE - h} width={width} height={h} rx="3" />
          {bar.shown && <g className="ns-growth__pill">
            <rect x={mid - pill / 2} y={BASE - h - PILL_H - 4} width={pill} height={PILL_H} rx={PILL_H / 2} />
            <text x={mid} y={BASE - h - 4 - PILL_H / 2}>{bar.shown}</text>
          </g>}
          <text className="ns-growth__name" x={mid} y={BASE + 14}>{bar.name}</text>
        </g>
      })}
    </svg>
  </div>
}

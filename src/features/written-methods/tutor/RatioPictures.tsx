import type { RatioFrame } from './methodWorking'

/*
 * Ratio bars (lesson 30, R1), like the R1 videos: one bar per share, one block per part (bar 1 amber, bar 2 blue, bar
 * 3 teal), the name on the left and the share's pill just after its bar. The parts being worked on are ringed in
 * purple, with one purple line under the bars saying what they are. The picture is only as wide as its names, its
 * longest bar and the room its working needs for pills (`room`), so it is drawn as big as the card allows; every size
 * comes from the question's own bars, so it stays the same size from step to step (Sunny). Nothing runs off its edge.
 * Every picture is drawn in the same box (RATIO_WIDTH × RATIO_HEIGHT, room for three bars), its bars in the middle,
 * so the bars are one size in every question of a lesson and the box never changes (Sunny, 10 Oct).
 */

/** The widest the picture is drawn in; a narrower picture is scaled up to fill the card. */
export const RATIO_WIDTH = 320
const PAD = 4, GAP = 10, TAG_GAP = 8
const TOP = 8, BAR_H = 32, ROW = BAR_H + 14
export const NAME_SIZE = 17, TAG_SIZE = 17, NOTE_SIZE = 16
/** Text widths at the picture's font sizes, a little generous so nothing touches its neighbour. */
export const textWidth = (text: string, size: number) => [...text].length * size * 0.56
export const pillWidth = (text: string) => Math.max(32, textWidth(text, TAG_SIZE) + 12)

/** Where everything goes. Only the bars and the pills' room decide the sizes, so every step of one question lines up. */
export function ratioLayout(frame: RatioFrame) {
  const longest = Math.max(...frame.bars.map(bar => bar.parts))
  const nameW = Math.max(...frame.bars.map(bar => textWidth(bar.name, NAME_SIZE))) + 4
  const room = frame.room ?? 0
  const pills = room ? TAG_GAP + room : 0
  const barX = PAD + nameW + GAP
  const block = Math.min(30, (RATIO_WIDTH - barX - pills - PAD) / longest)
  const width = Math.floor(barX + longest * block + pills + PAD)
  const rowY = (i: number) => TOP + i * ROW
  const noteY = rowY(frame.bars.length) + 6
  return { block, rowY, barX, width, tagX: (parts: number) => barX + parts * block + TAG_GAP, noteY, height: noteY + 15, eachSize: Math.min(15, block * 0.62) }
}

/** The box every picture is drawn in: as tall as three bars and their note. */
export const RATIO_HEIGHT = ratioLayout({ bars: [0, 1, 2].map(() => ({ name: '', parts: 1 })) }).height

function spoken(frame: RatioFrame) {
  const bars = frame.bars.map(bar => `${bar.name}, ${bar.parts} ${bar.parts === 1 ? 'part' : 'parts'}${bar.tag ? `: ${bar.tag}` : ''}`).join('; ')
  return `Ratio bars. ${bars}.${frame.each ? ` Each part is ${frame.each}.` : ''}${frame.groups ? ` Split into ${frame.groups} equal groups.` : ''}${frame.match ? ` ${frame.bars[frame.match.bars[0]].name} and ${frame.bars[frame.match.bars[1]].name} lined up: the first ${frame.match.at} parts match.` : ''}${frame.note ? ` ${frame.note}.` : ''}`
}

export function RatioVisual({ frame, plain }: { frame: RatioFrame; plain?: boolean }) {
  const { block, rowY, barX, width, tagX, noteY, height, eachSize } = ratioLayout(frame)
  const lit = plain ? [] : frame.lit ?? []
  // Lining two bars up: the bigger bar's parts that match the smaller bar fade, so only its extra parts (the difference) stand out.
  const match = plain ? undefined : frame.match
  const faded = (i: number, k: number) => !!match && (!match.bars.includes(i) || (i === match.bars[1] && k < match.at))
  const [top, bottom] = match ? [Math.min(...match.bars), Math.max(...match.bars)] : [0, 0]
  return <div className={`ns-ratio${plain ? ' is-plain' : ''}`} role="img" aria-label={spoken(frame)}>
    <svg viewBox={`0 0 ${RATIO_WIDTH} ${Math.max(RATIO_HEIGHT, height)}`} aria-hidden="true"><g transform={`translate(${(RATIO_WIDTH - width) / 2} ${Math.max(0, (RATIO_HEIGHT - height) / 2)})`}>
      {frame.bars.map((bar, i) => {
        const y = rowY(i)
        return <g key={i} className={`ns-ratio__bar is-b${i % 3}${match && !match.bars.includes(i) ? ' is-out' : ''}${!plain && frame.dim?.includes(i) ? ' is-dim' : ''}`}>
          <text className="ns-ratio__name" x={barX - GAP} y={y + BAR_H / 2}>{bar.name}</text>
          {Array.from({ length: bar.parts }, (_, k) => <rect key={k} className={`ns-ratio__block${faded(i, k) ? ' is-faded' : ''}`} x={barX + k * block} y={y} width={block} height={BAR_H} rx="2" />)}
          {frame.each && Array.from({ length: bar.parts }, (_, k) => <text key={k} className="ns-ratio__each" x={barX + (k + 0.5) * block} y={y + BAR_H / 2} fontSize={eachSize}>{frame.each}</text>)}
          {frame.groups && Array.from({ length: frame.groups }, (_, k) => {
            // Every other group is shaded, so the equal groups read at a glance even on thin blocks.
            const size = bar.parts / frame.groups! * block, x = barX + k * size
            return <g key={k}>
              {k % 2 === 1 && <rect className="ns-ratio__shade" x={x} y={y} width={size} height={BAR_H} />}
              {k > 0 && <path className="ns-ratio__group" d={`M${x} ${y - 3} L${x} ${y + BAR_H + 3}`} />}
            </g>
          })}
          {bar.tag && <g className={`ns-ratio__tag${lit.includes(i) ? ' is-lit' : ''}`}>
            <rect x={tagX(bar.parts)} y={y + BAR_H / 2 - 15} width={pillWidth(bar.tag)} height="30" rx="15" />
            <text x={tagX(bar.parts) + pillWidth(bar.tag) / 2} y={y + BAR_H / 2}>{bar.tag}</text>
          </g>}
        </g>
      })}
      {match && <path className="ns-ratio__match" d={`M${barX + match.at * block} ${rowY(top) - 4} L${barX + match.at * block} ${rowY(bottom) + BAR_H + 4}`} />}
      {!plain && frame.rings?.map((ring, i) => <rect key={i} className="ns-ratio__ring" x={barX + ring.from * block - 3} y={rowY(ring.bar) - 4} width={(ring.to - ring.from) * block + 6} height={BAR_H + 8} rx="5" />)}
      {!plain && frame.note && <text className="ns-ratio__note" x={width / 2} y={noteY}>{frame.note}</text>}
    </g></svg>
  </div>
}

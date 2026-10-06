import type { MachineFrame } from './methodWorking'

/*
 * Function machines (lesson 29, A14), like the A14 videos: the input hopper on the left, one box per operation (box 1
 * amber, box 2 blue, box 3 teal), the output tray on the right, all on one belt. The numbers sit under the belt: the
 * input under the hopper, each number between the boxes it passes, the output under the tray. The box being worked on
 * and the number it makes are ringed in purple at the same moment, like the move on the board (EXPLANATIONS.md).
 * Going backwards the belt's arrows point left and each box's opposite is written under it. Everything is laid out
 * inside the 320-wide picture, so nothing runs off its edge.
 */

export const MACHINE_WIDTH = 320
const PAD = 6
const TOP = 22, BOX_H = 42, BELT = TOP + BOX_H + 9, VALUE = BELT + 24, UNDO = VALUE + 32
/** Font sizes of the numbers under the belt and the opposites under the boxes (NumberSenseLesson.css). */
export const VALUE_SIZE = 17
/** Three boxes leave less room under each, so their opposites are a size smaller. */
export const undoSize = (boxes: number) => boxes > 2 ? 11 : 12
export const undoPad = (boxes: number) => boxes > 2 ? 8 : 10

/** Where everything goes: the centre of each slot (hopper, boxes, tray) and of each number under the belt. */
export function machineLayout(frame: MachineFrame) {
  const n = frame.boxes.length
  const slot = (MACHINE_WIDTH - 2 * PAD) / (n + 2)
  const at = (k: number) => PAD + slot * (k + 0.5)
  const valueAt = (j: number) => j === 0 ? at(0) : j === n ? at(n + 1) : (at(j) + at(j + 1)) / 2
  const height = frame.undo?.some(Boolean) ? UNDO + 18 : VALUE + 20
  return { n, slot, at, valueAt, height, boxWidth: Math.min(slot - 12, 72) }
}

/** A pill's width for its text, at the picture's font sizes. */
export const pillWidth = (text: string, size = VALUE_SIZE, pad = 16) => Math.max(30, [...text].length * size * 0.56 + pad)

function spoken(frame: MachineFrame) {
  const said = (text: string) => text.replace(/−/g, 'minus ').replace(/×/g, 'times ').replace(/÷/g, 'divide by ').replace(/\+/g, 'plus ')
  const boxes = frame.boxes.map((box, i) => box === '?' ? `box ${i + 1}, not known yet` : `box ${i + 1}: ${said(box)}`).join(', then ')
  const values = frame.values.map((v, j) => v === null ? null : j === 0 ? `input ${said(v)}` : j === frame.boxes.length ? `output ${said(v)}` : `after box ${j}, ${said(v)}`).filter(Boolean)
  return `A function machine${frame.back ? ', worked backwards' : ''}: ${boxes}.${values.length ? ` ${values.join('. ')}.` : ''}`
}

export function MachineVisual({ frame, plain }: { frame: MachineFrame; plain?: boolean }) {
  const { n, slot, at, valueAt, height, boxWidth } = machineLayout(frame)
  const lit = plain ? undefined : frame.lit
  const litValue = lit === undefined ? undefined : frame.back ? lit : lit + 1
  const hopper = Math.min(slot - 16, 40)
  const chevron = (x: number) => frame.back
    ? `M${x + 4} ${BELT - 5} L${x - 3} ${BELT} L${x + 4} ${BELT + 5}`
    : `M${x - 4} ${BELT - 5} L${x + 3} ${BELT} L${x - 4} ${BELT + 5}`
  return <div className={`ns-machine${plain ? ' is-plain' : ''}`} role="img" aria-label={spoken(frame)}>
    <svg viewBox={`0 0 ${MACHINE_WIDTH} ${height}`} aria-hidden="true">
      <text className="ns-machine__caption" x={at(0)} y={TOP - 7}>Input</text>
      <text className="ns-machine__caption" x={at(n + 1)} y={TOP - 7}>Output</text>
      <path className="ns-machine__belt" d={`M${PAD} ${BELT} L${MACHINE_WIDTH - PAD} ${BELT}`} />
      {Array.from({ length: n + 1 }, (_, k) => <path key={k} className="ns-machine__arrow" d={chevron((at(k) + at(k + 1)) / 2)} />)}
      <path className="ns-machine__hopper" d={`M${at(0) - hopper / 2} ${TOP + 8} L${at(0) + hopper / 2} ${TOP + 8} L${at(0) + hopper / 4} ${BELT - 4} L${at(0) - hopper / 4} ${BELT - 4} Z`} />
      <rect className="ns-machine__tray" x={at(n + 1) - 20} y={BELT - 26} width="40" height="22" rx="5" />
      {frame.boxes.map((box, i) => {
        const x = at(i + 1) - boxWidth / 2
        const unknown = box === '?'
        return <g key={i} className={`ns-machine__box is-b${i % 3}${unknown ? ' is-unknown' : ''}${plain ? ' is-plain' : ''}`}>
          <rect x={x} y={TOP} width={boxWidth} height={BOX_H} rx="7" />
          {lit === i && <rect className="ns-machine__lit" x={x - 4} y={TOP - 4} width={boxWidth + 8} height={BOX_H + 8} rx="10" />}
          <text x={at(i + 1)} y={TOP + BOX_H / 2}>{box}</text>
        </g>
      })}
      {frame.values.map((value, j) => {
        if (value === null) return null
        const w = pillWidth(value)
        const x = Math.min(MACHINE_WIDTH - 2 - w / 2, Math.max(2 + w / 2, valueAt(j)))
        const cls = !plain && frame.answer === j ? ' is-answer' : ''
        return <g key={j} className={`ns-machine__value${cls}${litValue === j ? ' is-lit' : ''}`}>
          <rect x={x - w / 2} y={VALUE - 15} width={w} height="30" rx="15" />
          <text x={x} y={VALUE}>{value}</text>
        </g>
      })}
      {!plain && frame.undo?.map((op, i) => {
        if (!op) return null
        const label = `undo ${op}`
        const w = pillWidth(label, undoSize(n), undoPad(n))
        return <g key={i} className={`ns-machine__undo${lit === i ? ' is-lit' : ''}`}>
          <rect x={at(i + 1) - w / 2} y={UNDO - 12} width={w} height="24" rx="12" />
          <text x={at(i + 1)} y={UNDO} fontSize={undoSize(n)}>{label}</text>
        </g>
      })}
    </svg>
  </div>
}

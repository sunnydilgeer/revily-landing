import type { ReactNode } from 'react'
import { physicsPalette as P, Wire, Junction, CurrentArrow, Cell, Battery, SwitchOpen, SwitchClosed, Lamp, Fuse, Resistor, VariableResistor, Ammeter, Voltmeter, Diode, LED, LDR, Thermistor, type Pt } from './PhysicsKit'
import { Fig, Say, Num, Panel } from './WindSolarVisuals'

/*
 * Physics Lesson 15: current, charge and circuit symbols. Original, code-native schematics; not to scale. Focus ids start 'circuit-'.
 * Every symbol comes from PhysicsKit (AQA symbol sheet). Wires are straight with softly rounded square corners, loops are closed,
 * ammeters sit in the loop (series) and voltmeters on their own branch across a component (parallel).
 * Colour code (the Physics kit): wires ink; charge = blue dots; current = vermilion arrows in the conventional direction (out of the
 * long, positive side of the cell); potential difference = violet; resistance = brown.
 * One circuit (cell on the left, switch on top, lamp on the right, resistor underneath) is reused through the first walkthrough.
 */
const { ink, muted } = P
const faded = 0.3

/* ---------- Helpers ---------- */
/** White knock-out so a wire does not show through a symbol's gap (cells, switches). */
function Knock({ x, y, vertical = false, half = 6 }: { x: number; y: number; vertical?: boolean; half?: number }) {
  return vertical ? <rect x={x - 5} y={y - half} width={10} height={half * 2} fill="white" /> : <rect x={x - half} y={y - 5} width={half * 2} height={10} fill="white" />
}
/** Charge: small blue dots spread along a polyline, leaving gaps where components sit. */
function Charges({ path, step = 26, avoid = [], bunch }: { path: Pt[]; step?: number; avoid?: [number, number, number][]; bunch?: [number, number, number] }) {
  const dots: Pt[] = []
  for (let i = 0; i < path.length - 1; i++) {
    const [a, b] = [path[i], path[i + 1]], len = Math.hypot(b[0] - a[0], b[1] - a[1])
    for (let d = step / 2; d < len; d += step) {
      const p: Pt = [a[0] + (b[0] - a[0]) * d / len, a[1] + (b[1] - a[1]) * d / len]
      if (avoid.some(([x, y, r]) => Math.hypot(p[0] - x, p[1] - y) < r)) continue
      dots.push(p)
    }
  }
  const extra: Pt[] = bunch ? [-1, -.5, 0, .5, 1].map(k => [bunch[0] + k * bunch[2], bunch[1] + (Math.abs(k) === .5 ? 3 : -3)] as Pt) : []
  return <g>{[...dots, ...extra].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.2" fill={P.charge} stroke="white" strokeWidth="1.2" />)}</g>
}
function Unit({ x, y, text, colour, fill }: { x: number; y: number; text: string; colour: string; fill: string }) {
  const w = text.length * 8 + 26
  return <g><rect x={x - w / 2} y={y - 15} width={w} height={30} rx="15" fill={fill} stroke={colour} strokeWidth="1.7" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="750" fill={colour}>{text}</text></g>
}
function Check({ x, y, ok }: { x: number; y: number; ok: boolean }) {
  const c = ok ? P.useful : P.wasted
  return <g><circle cx={x} cy={y} r="14" fill={ok ? P.usefulFill : P.wastedFill} stroke={c} strokeWidth="2" />
    {ok ? <path d={`M${x - 6} ${y}l4 4.5 8 -9`} stroke={c} strokeWidth="2.6" fill="none" /> : <path d={`M${x - 5} ${y - 5}l10 10m0 -10l-10 10`} stroke={c} strokeWidth="2.6" />}</g>
}
function Dim({ on, children }: { on: boolean; children: ReactNode }) {
  return <g opacity={on ? 1 : faded}>{children}</g>
}

/* ---------- The walkthrough circuit ---------- */
const L = 110, R = 410, T = 70, B = 220, MY = 145
type Part = 'cell' | 'switch' | 'lamp' | 'resistor' | 'none'
function Loop({ focus = 'none', ammeter = false, voltmeterCell = false, dots = true, bunch = false, arrows = true }: { focus?: Part; ammeter?: boolean; voltmeterCell?: boolean; dots?: boolean; bunch?: boolean; arrows?: boolean }) {
  const on = (p: Part) => focus === 'none' || focus === p
  const path: Pt[] = [[L, MY - 30], [L, T], [R, T], [R, B], [L, B], [L, MY + 30]]
  const avoid: [number, number, number][] = [[L, MY, 30], [200, T, 27], [R, MY, 22], [260, B, 26], [330, T, 22]]
  return <g>
    <Wire points={[[L, MY + 4], [L, B], [R, B], [R, T], [L, T], [L, MY - 4]]} />
    <Knock x={L} y={MY} vertical /><Knock x={200} y={T} half={11} />
    {voltmeterCell && <g>
      <Wire points={[[L, MY - 42], [L - 58, MY - 42], [L - 58, MY + 42], [L, MY + 42]]} colour={P.pd} />
      <Junction x={L} y={MY - 42} /><Junction x={L} y={MY + 42} />
      <Voltmeter x={L - 58} y={MY} rotate={90} colour={P.pd} />
    </g>}
    <Dim on={on('cell')}><Cell x={L} y={MY} rotate={90} signs={focus === 'cell'} /></Dim>
    <Dim on={on('switch')}><SwitchClosed x={200} y={T} /></Dim>
    <Dim on={on('lamp')}><Lamp x={R} y={MY} rotate={90} lit /></Dim>
    <Dim on={on('resistor')}><Resistor x={260} y={B} colour={focus === 'resistor' ? P.resistance : P.wire} /></Dim>
    {ammeter && <Ammeter x={330} y={T} />}
    {dots && <Charges path={path} avoid={avoid} bunch={bunch ? [260, B, 11] : undefined} />}
    {arrows && <g><CurrentArrow x={270} y={T} /><CurrentArrow x={R} y={MY + 48} rotate={90} /><CurrentArrow x={180} y={B} rotate={180} />{!voltmeterCell && <CurrentArrow x={L} y={T + 22} rotate={-90} />}</g>}
  </g>
}
function CurrentFrame() {
  return <Fig title="A closed circuit: a cell, a closed switch, a lamp, a resistor and an ammeter in one loop. Blue dots of charge fill the wires, and arrows show the current flowing round from the positive side of the cell." h={290}>
    <Loop ammeter />
    <Say x={260} y={36} lines={['flow of charge = current']} anchor="middle" colour={P.current} />
    <Say x={330} y={T + 36} lines={['ammeter']} anchor="middle" size={13} colour={muted} />
    <Unit x={270} y={262} text="amperes, A" colour={P.current} fill="#fbe6dc" />
  </Fig>
}
function PdFrame() {
  return <Fig title="The same circuit with the cell highlighted. A big soft arrow beside the cell shows the push it gives the charge. A voltmeter is joined across the cell." h={290}>
    <Loop focus="cell" voltmeterCell />
    <path d={`M${L + 28} ${MY + 36}C${L + 44} ${MY + 10} ${L + 44} ${MY - 20} ${L + 30} ${MY - 44}`} stroke={P.pd} strokeWidth="7" fill="none" opacity=".35" />
    <path d={`M${L + 20} ${MY - 36}L${L + 28} ${MY - 56}L${L + 42} ${MY - 38}Z`} fill={P.pd} opacity=".55" />
    <Say x={L + 50} y={MY - 2} lines={['push']} colour={P.pd} />
    <Say x={L + 50} y={MY + 16} lines={['from the cell']} colour={P.pd} size={13} />
    <Say x={L - 58} y={MY + 78} lines={['voltmeter']} anchor="middle" size={13} colour={P.pd} />
    <Say x={300} y={36} lines={['potential difference: the push']} anchor="middle" colour={P.pd} />
    <Unit x={290} y={262} text="volts, V" colour={P.pd} fill={P.pdFill} />
  </Fig>
}
function ResistanceFrame() {
  return <Fig title="The same circuit with the resistor highlighted. The dots of charge bunch up as they squeeze through the resistor, because resistance slows the flow." h={290}>
    <Loop focus="resistor" bunch />
    <Say x={260} y={B - 46} lines={['resistance slows', 'the flow']} anchor="middle" colour={P.resistance} />
    <Say x={260} y={B + 38} lines={['resistor']} anchor="middle" size={13} colour={P.resistance} />
    <Unit x={460} y={262} text="ohms, Ω" colour={P.resistance} fill={P.resistanceFill} />
  </Fig>
}
function MiniLoop({ x, y, w = 200, h = 130, open = false, resistor, arrowSize = 1, dots = true, label }: { x: number; y: number; w?: number; h?: number; open?: boolean; resistor?: 'small' | 'large'; arrowSize?: number; dots?: boolean; label?: string }) {
  const l = x, r = x + w, t = y, b = y + h, my = y + h / 2, cx = x + w / 2
  const path: Pt[] = [[l, my - 30], [l, t], [r, t], [r, b], [l, b], [l, my + 30]]
  const avoid: [number, number, number][] = [[l, my, 28], [cx, t, 22], [r, my, 22], [cx, b, 26]]
  return <g>
    <Wire points={[[l, my + 4], [l, b], [r, b], [r, t], [l, t], [l, my - 4]]} />
    <Knock x={l} y={my} vertical /><Knock x={cx} y={t} half={11} />
    <Cell x={l} y={my} rotate={90} />
    {open ? <SwitchOpen x={cx} y={t} /> : <SwitchClosed x={cx} y={t} />}
    <Lamp x={r} y={my} rotate={90} lit={!open} />
    {resistor && <g><Resistor x={cx} y={b} colour={P.resistance} /><text x={cx} y={b + 30} textAnchor="middle" fontSize="13" fontWeight="650" fill={P.resistance}>{resistor} resistance</text></g>}
    {!open && dots && <Charges path={path} avoid={avoid} step={24} />}
    {!open && <g transform={`translate(${cx} ${t - 18}) scale(${arrowSize})`}><path d="M-22 0H14" stroke={P.current} strokeWidth="4" /><path d="M12 -8L24 0L12 8Z" fill={P.current} /></g>}
    {label && <text x={cx} y={b + (resistor ? 50 : 30)} textAnchor="middle" fontSize="13.5" fontWeight="700" fill={ink}>{label}</text>}
  </g>
}
function LoopFrame() {
  const l = 44, w = 180, t = 60, h = 130
  return <Fig title="Two circuits side by side. On the left, a complete loop with a cell: charge flows, and the current arrows are the same size at three places. On the right, the same loop with an open switch: there is a gap, so no charge flows." h={300}>
    <Wire points={[[l, t + h / 2 + 4], [l, t + h], [l + w, t + h], [l + w, t], [l, t], [l, t + h / 2 - 4]]} />
    <Knock x={l} y={t + h / 2} vertical /><Knock x={l + w / 2} y={t} half={11} />
    <Cell x={l} y={t + h / 2} rotate={90} /><SwitchClosed x={l + w / 2} y={t} /><Lamp x={l + w} y={t + h / 2} rotate={90} lit />
    <Charges path={[[l, t + h / 2 - 30], [l, t], [l + w, t], [l + w, t + h], [l, t + h], [l, t + h / 2 + 30]]} avoid={[[l, t + h / 2, 28], [l + w / 2, t, 22], [l + w, t + h / 2, 22]]} step={24} />
    {[[l + w / 2 + 44, t, 0], [l + w, t + h / 2 + 44, 90], [l + w / 2, t + h, 180]].map(([x, y, rot], i) => <CurrentArrow key={i} x={x} y={y} rotate={rot} />)}
    <Check x={l + w / 2} y={t + h / 2} ok />
    <MiniLoop x={316} y={t} w={w} h={h} open />
    <Check x={316 + w / 2} y={t + h / 2} ok={false} />
    <Say x={l + w / 2} y={t + h + 34} lines={['closed loop with a cell:', 'charge flows']} anchor="middle" size={13} />
    <Say x={316 + w / 2} y={t + h + 34} lines={['a gap:', 'no flow']} anchor="middle" size={13} colour={P.wasted} />
    <Say x={l + w / 2} y={28} lines={['single loop: same current everywhere']} anchor="start" size={13} colour={P.current} />
  </Fig>
}
function DependsFrame() {
  return <Fig title="Two identical circuits with the same cell. One has a small resistance and a big current arrow. The other has a large resistance and a small current arrow." h={290}>
    <MiniLoop x={44} y={60} w={180} h={130} resistor="small" arrowSize={1.5} />
    <MiniLoop x={316} y={60} w={180} h={130} resistor="large" arrowSize={.75} />
    <Say x={134} y={258} lines={['bigger current']} anchor="middle" colour={P.current} />
    <Say x={406} y={258} lines={['smaller current']} anchor="middle" colour={P.current} />
    <Say x={270} y={130} lines={['same', 'cell']} anchor="middle" size={13} colour={P.pd} />
  </Fig>
}

/* ---------- Charge and Q = I t ---------- */
function Stopwatch({ x, y, r = 24, text }: { x: number; y: number; r?: number; text: string }) {
  return <g>
    <rect x={x - 5} y={y - r - 10} width={10} height={7} rx="2" fill="white" stroke={ink} strokeWidth="1.6" />
    <circle cx={x} cy={y} r={r} fill="white" stroke={ink} strokeWidth="2" />
    <path d={`M${x} ${y}L${x + r * .5} ${y - r * .55}`} stroke={P.current} strokeWidth="2.2" />
    <text x={x} y={y + r * .62} textAnchor="middle" fontSize="12" fontWeight="750" fill={ink}>{text}</text>
  </g>
}
function WireTube({ x, y, w, n, label }: { x: number; y: number; w: number; n: number; label: string }) {
  const mid = x + w / 2
  return <g>
    <rect x={x} y={y - 22} width={w} height={44} rx="22" fill="#f4ece2" stroke={P.resistance} strokeWidth="1.8" />
    <path d={`M${mid} ${y - 34}V${y + 34}`} stroke={ink} strokeWidth="1.8" strokeDasharray="5 4" />
    {Array.from({ length: n }, (_, i) => { const px = mid - 12 - i * (w / 2 - 30) / Math.max(1, n - 1) * .95, py = y + ((i % 3) - 1) * 10; return <circle key={i} cx={px} cy={py} r="5" fill={P.charge} stroke="white" strokeWidth="1.2" /> })}
    <path d={`M${mid + 14} ${y}H${mid + 50}`} stroke={P.current} strokeWidth={2 + n * .4} /><path d={`M${mid + 48} ${y - 7}L${mid + 60} ${y}L${mid + 48} ${y + 7}Z`} fill={P.current} />
    <Stopwatch x={x + w - 26} y={y - 58} r={20} text="1 s" />
    <text x={mid} y={y + 58} textAnchor="middle" fontSize="13.5" fontWeight="700" fill={ink}>{label}</text>
    <text x={mid} y={y + 76} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{n} dots pass the line each second</text>
  </g>
}
function ChargeFrame() {
  return <Fig title="Two close-ups of a wire with a dashed line across it. In one second, three dots of charge pass the line for a small current, and six dots pass it for a bigger current." h={256} note="Charge is measured in coulombs, C.">
    <WireTube x={20} y={120} w={230} n={3} label="small current" />
    <WireTube x={290} y={120} w={230} n={6} label="bigger current" />
    <Say x={270} y={236} lines={['bigger current = more charge every second']} anchor="middle" colour={P.current} halo={false} />
  </Fig>
}
function Term({ x, y, big, name, unit, colour, fill }: { x: number; y: number; big: string; name: string; unit: string; colour: string; fill: string }) {
  return <g>
    <rect x={x - 54} y={y - 34} width={108} height={96} rx="16" fill={fill} stroke={colour} strokeWidth="1.8" />
    <text x={x} y={y + 6} textAnchor="middle" fontSize="30" fontWeight="800" fill={colour} fontStyle="italic">{big}</text>
    <text x={x} y={y + 30} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{name}</text>
    <text x={x} y={y + 48} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>{unit}</text>
  </g>
}
function FormulaFrame() {
  return <Fig title="An equation card. Charge flow in coulombs equals current in amperes times time in seconds. In symbols, Q equals I times t, each letter in its own colour." h={240}>
    <text x={270} y={42} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>charge flow = current × time</text>
    <Term x={90} y={110} big="Q" name="charge flow" unit="coulombs, C" colour={P.chargeLine} fill="#e1eefa" />
    <text x={180} y={122} textAnchor="middle" fontSize="28" fontWeight="700" fill={ink}>=</text>
    <Term x={270} y={110} big="I" name="current" unit="amperes, A" colour={P.current} fill="#fbe6dc" />
    <text x={360} y={122} textAnchor="middle" fontSize="28" fontWeight="700" fill={ink}>×</text>
    <Term x={450} y={110} big="t" name="time" unit="seconds, s" colour={ink} fill={P.panel} />
    <Say x={270} y={214} lines={['time must be in seconds']} anchor="middle" size={13} colour={muted} halo={false} />
  </Fig>
}
function TimeFrame() {
  return <Fig title="A stopwatch showing 2 minutes. An arrow labelled times 60 leads to 120 seconds." h={220} note="The time must be in seconds before you use Q = I × t.">
    <Stopwatch x={110} y={104} r={46} text="" />
    <text x={110} y={176} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>2 minutes</text>
    <path d="M190 104H330" stroke={ink} strokeWidth="3" /><path d="M326 94L344 104L326 114Z" fill={ink} />
    <text x={266} y={90} textAnchor="middle" fontSize="18" fontWeight="800" fill={P.current}>× 60</text>
    <text x={266} y={134} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>60 s in 1 minute</text>
    <rect x={362} y={76} width={150} height={56} rx="16" fill={P.usefulFill} stroke={P.useful} strokeWidth="1.8" />
    <text x={437} y={111} textAnchor="middle" fontSize="18" fontWeight="800" fill={ink}>120 seconds</text>
  </Fig>
}
function WorkedFrame() {
  const rows: [string, string][] = [['I = 3 A', 'current'], ['t = 40 s', 'time, already in seconds'], ['Q = I × t', 'the equation'], ['Q = 3 × 40', 'substitute'], ['Q = 120 C', 'answer, with its unit']]
  return <Fig title="Worked steps for a current of 3 A flowing for 40 s: I = 3 A, t = 40 s, Q = I × t, Q = 3 × 40, Q = 120 C." h={290}>
    {rows.map(([eq, note], i) => {
      const y = 22 + i * 52, last = i === rows.length - 1
      return <g key={eq}>
        <rect x={70} y={y} width={400} height={42} rx="12" fill={last ? P.usefulFill : P.panel} stroke={last ? P.useful : P.panelLine} strokeWidth={last ? 2.2 : 1.4} />
        <text x={96} y={y + 27} fontSize="17" fontWeight="800" fill={ink}>{eq}</text>
        <text x={450} y={y + 26} textAnchor="end" fontSize="13" fontWeight="600" fill={muted}>{note}</text>
      </g>
    })}
  </Fig>
}

/* ---------- The symbols ---------- */
function SymbolRow({ items, h = 190, note }: { items: { el: ReactNode; name: string; job?: string }[]; h?: number; note?: string }) {
  const n = items.length, w = 520 / n
  return <Fig title={`Circuit symbols with their names: ${items.map(i => i.name).join(', ')}.`} h={h} note={note}>
    {items.map((it, i) => <g key={it.name}>
      <Panel x={10 + i * w + 5} y={14} w={w - 10} h={h - 28} tint="white" />
      <g transform={`translate(${10 + i * w + w / 2} 80)`}>{it.el}</g>
      <text x={10 + i * w + w / 2} y={136} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>{it.name}</text>
      {it.job && <text x={10 + i * w + w / 2} y={156} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{it.job}</text>}
    </g>)}
  </Fig>
}
const sym = { length: 90 }
function CellSwitch() {
  return <SymbolRow items={[
    { el: <><Cell x={0} y={0} {...sym} signs /></>, name: 'cell', job: 'long line is +' },
    { el: <Battery x={0} y={0} cells={2} {...sym} />, name: 'battery', job: '2 or more cells' },
    { el: <SwitchOpen x={0} y={0} {...sym} />, name: 'open switch', job: 'a gap' },
    { el: <SwitchClosed x={0} y={0} {...sym} />, name: 'closed switch', job: 'no gap' },
  ]} />
}
function LampFuseLed() {
  return <SymbolRow items={[
    { el: <Lamp x={0} y={0} {...sym} />, name: 'filament lamp', job: 'circle with a cross' },
    { el: <Fuse x={0} y={0} {...sym} />, name: 'fuse', job: 'line runs through' },
    { el: <LED x={0} y={6} {...sym} />, name: 'LED', job: 'arrows point out' },
  ]} />
}
function Resistors() {
  return <SymbolRow items={[
    { el: <Resistor x={0} y={0} {...sym} />, name: 'resistor', job: 'plain rectangle' },
    { el: <VariableResistor x={0} y={0} {...sym} />, name: 'variable resistor', job: 'arrow through it' },
  ]} note="The arrow shows that the resistance can be changed." />
}
function Meters() {
  return <SymbolRow items={[
    { el: <Ammeter x={0} y={0} {...sym} />, name: 'ammeter', job: 'measures current' },
    { el: <Voltmeter x={0} y={0} {...sym} />, name: 'voltmeter', job: 'measures potential difference' },
  ]} />
}
function Sensors() {
  return <SymbolRow items={[
    { el: <Diode x={0} y={0} {...sym} />, name: 'diode', job: 'triangle and bar' },
    { el: <LDR x={0} y={10} {...sym} />, name: 'LDR', job: 'arrows point in' },
    { el: <Thermistor x={0} y={0} {...sym} />, name: 'thermistor', job: 'line with a foot' },
  ]} />
}

/* ---------- Drawing circuits ---------- */
function RulesFrame() {
  const l = 44, w = 180, t = 64, h = 130
  return <Fig title="Two circuit drawings. The good one has straight wires, square corners and a closed loop, and a dashed finger path follows the wire all the way round. The bad one has a curved wire and a gap." h={300}>
    <Wire points={[[l, t + h / 2 + 4], [l, t + h], [l + w, t + h], [l + w, t], [l, t], [l, t + h / 2 - 4]]} />
    <Knock x={l} y={t + h / 2} vertical />
    <Cell x={l} y={t + h / 2} rotate={90} /><Lamp x={l + w} y={t + h / 2} rotate={90} /><Resistor x={l + w / 2} y={t + h} />
    <path d={`M${l + 16} ${t + h / 2 - 20}V${t + 16}H${l + w - 16}V${t + h - 16}H${l + 16}V${t + h / 2 + 20}`} stroke={P.useful} strokeWidth="2" strokeDasharray="2 6" fill="none" />
    <path d={`M${l + 10} ${t + h / 2 + 12}L${l + 16} ${t + h / 2 + 24}L${l + 22} ${t + h / 2 + 12}`} stroke={P.useful} strokeWidth="2" fill="none" />
    <Check x={l + w / 2} y={t - 34} ok />
    <path d={`M316 ${t + h / 2 + 4}V${t + h}H${316 + w}V${t + 40}M${316 + w - 26} ${t}Q${316 + w / 2} ${t - 22} 316 ${t + 10}V${t + h / 2 - 4}`} stroke={P.wire} strokeWidth="2.5" fill="none" />
    <Knock x={316} y={t + h / 2} vertical />
    <Cell x={316} y={t + h / 2} rotate={90} /><Resistor x={316 + w / 2} y={t + h} /><Lamp x={316 + w} y={t + 72} rotate={90} length={48} />
    <circle cx={316 + w - 13} cy={t + 16} r="15" fill="none" stroke={P.wasted} strokeWidth="1.8" strokeDasharray="3 3" />
    <Check x={316 + w / 2} y={t - 34} ok={false} />
    <Say x={l + w / 2} y={t + h + 36} lines={['straight wires, closed loop:', 'follow the wire all the way round']} anchor="middle" size={13} colour={P.useful} />
    <Say x={316 + w / 2} y={t + h + 36} lines={['curved wire and a gap']} anchor="middle" size={13} colour={P.wasted} />
  </Fig>
}
function SeriesFrame() {
  return <Fig title="The circuit with an ammeter drawn in the loop, next to the lamp. Current arrows go through the ammeter, so it is in series." h={290}>
    <Wire points={[[L, MY + 4], [L, B], [R, B], [R, T], [L, T], [L, MY - 4]]} />
    <Knock x={L} y={MY} vertical /><Knock x={200} y={T} half={11} />
    <g opacity={faded}><Cell x={L} y={MY} rotate={90} /><SwitchClosed x={200} y={T} /><Lamp x={R} y={MY} rotate={90} /></g>
    <circle cx={330} cy={T} r="24" fill={P.usefulFill} opacity=".7" />
    <Ammeter x={330} y={T} />
    <CurrentArrow x={288} y={T} /><CurrentArrow x={370} y={T} /><CurrentArrow x={R} y={MY + 48} rotate={90} /><CurrentArrow x={260} y={B} rotate={180} />
    <Say x={330} y={T - 34} lines={['ammeter: in the loop (in series)']} anchor="middle" colour={P.useful} />
    <Say x={R + 24} y={MY + 5} lines={['lamp']} size={13} colour={muted} />
  </Fig>
}
function ParallelFrame() {
  const vx = R + 70
  return <Fig title="The circuit with a voltmeter on its own branch, joined across the two ends of the lamp, so it is in parallel." h={290}>
    <Wire points={[[L, MY + 4], [L, B], [R, B], [R, T], [L, T], [L, MY - 4]]} />
    <Knock x={L} y={MY} vertical /><Knock x={200} y={T} half={11} />
    <g opacity={faded}><Cell x={L} y={MY} rotate={90} /><SwitchClosed x={200} y={T} /><Ammeter x={300} y={T} /></g>
    <Lamp x={R} y={MY} rotate={90} />
    <Wire points={[[R, MY - 48], [vx, MY - 48], [vx, MY + 48], [R, MY + 48]]} colour={P.pd} />
    <Junction x={R} y={MY - 48} /><Junction x={R} y={MY + 48} />
    <Voltmeter x={vx} y={MY} rotate={90} colour={P.pd} />
    <Say x={300} y={B + 36} lines={['voltmeter: across the component (in parallel)']} anchor="middle" colour={P.pd} />
    <Say x={R - 16} y={MY + 5} lines={['lamp']} size={13} colour={muted} anchor="end" />
  </Fig>
}
function WholeFrame() {
  const vx = R + 70
  return <Fig title="A complete circuit: a cell, a closed switch, an ammeter and a lamp in one loop, with a voltmeter across the lamp. Every part is named, and a tick shows the loop is closed with straight wires." h={300}>
    <Wire points={[[L, MY + 4], [L, B], [R, B], [R, T], [L, T], [L, MY - 4]]} />
    <Knock x={L} y={MY} vertical /><Knock x={200} y={T} half={11} />
    <Cell x={L} y={MY} rotate={90} /><SwitchClosed x={200} y={T} /><Ammeter x={300} y={T} /><Lamp x={R} y={MY} rotate={90} lit />
    <Wire points={[[R, MY - 48], [vx, MY - 48], [vx, MY + 48], [R, MY + 48]]} />
    <Junction x={R} y={MY - 48} /><Junction x={R} y={MY + 48} />
    <Voltmeter x={vx} y={MY} rotate={90} />
    <CurrentArrow x={250} y={T} /><CurrentArrow x={260} y={B} rotate={180} />
    <Say x={L - 16} y={MY + 5} lines={['cell']} size={13} anchor="end" />
    <Say x={200} y={T - 22} lines={['switch']} size={13} anchor="middle" />
    <Say x={300} y={T - 22} lines={['ammeter']} size={13} anchor="middle" />
    <Say x={R - 18} y={MY + 5} lines={['lamp']} size={13} anchor="end" />
    <Say x={vx} y={MY + 72} lines={['voltmeter']} size={13} anchor="middle" />
    <Check x={270} y={MY} ok />
    <Say x={270} y={B + 38} lines={['closed loop, straight wires']} anchor="middle" size={13} colour={P.useful} />
  </Fig>
}

/* ---------- Question pictures ---------- */
function QSymbols({ assessment }: { assessment: boolean }) {
  const els = [<Resistor key="r" x={0} y={0} {...sym} />, <Fuse key="f" x={0} y={0} {...sym} />, <LED key="l" x={0} y={6} {...sym} />, <VariableResistor key="v" x={0} y={0} {...sym} />]
  return <Fig title={assessment ? 'Four circuit symbols, numbered 1 to 4.' : 'Four circuit symbols: 1 resistor, 2 fuse, 3 LED, 4 variable resistor.'} h={170}>
    {els.map((el, i) => <g key={i}><Panel x={15 + i * 130} y={14} w={120} h={140} tint="white" /><g transform={`translate(${75 + i * 130} 80)`}>{el}</g><Num n={i + 1} x={75 + i * 130} y={130} /></g>)}
  </Fig>
}
function QCircuit({ assessment }: { assessment: boolean }) {
  const vy = T - 48
  return <Fig title={assessment ? 'A circuit diagram with four numbered components.' : 'A circuit with 1 a cell on the left, 2 a lamp on top, 3 an ammeter on the right in the loop, and 4 a voltmeter across the lamp.'} h={290}>
    <g transform="translate(0 40)">
      <Wire points={[[L, MY + 4], [L, B], [R, B], [R, T], [L, T], [L, MY - 4]]} />
      <Knock x={L} y={MY} vertical />
      <Cell x={L} y={MY} rotate={90} /><Lamp x={260} y={T} /><Ammeter x={R} y={MY} rotate={90} />
      <Wire points={[[205, T], [205, vy], [315, vy], [315, T]]} />
      <Junction x={205} y={T} /><Junction x={315} y={T} />
      <Voltmeter x={260} y={vy} />
      <Num n={1} x={L - 34} y={MY} /><Num n={2} x={260} y={T + 34} /><Num n={3} x={R + 36} y={MY} /><Num n={4} x={300} y={vy - 22} />
    </g>
  </Fig>
}
function QOpen({ assessment }: { assessment: boolean }) {
  return <Fig title={assessment ? 'A circuit diagram with four numbered components.' : 'A circuit with 1 a lamp, 2 a cell, 3 an ammeter and 4 an open switch, all in one loop.'} h={272}>
    <Wire points={[[L, MY + 4], [L, B], [R, B], [R, T], [L, T], [L, MY - 4]]} />
    <Knock x={L} y={MY} vertical /><Knock x={260} y={B} half={11} />
    <Lamp x={260} y={T} /><Cell x={L} y={MY} rotate={90} /><Ammeter x={R} y={MY} rotate={90} /><SwitchOpen x={260} y={B} />
    <Num n={1} x={260} y={T - 32} /><Num n={2} x={L - 34} y={MY} /><Num n={3} x={R + 36} y={MY} /><Num n={4} x={260} y={B + 30} />
  </Fig>
}

export function CircuitVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'circuit-current': return <CurrentFrame />
    case 'circuit-pd': return <PdFrame />
    case 'circuit-resistance': return <ResistanceFrame />
    case 'circuit-loop': return <LoopFrame />
    case 'circuit-depends': return <DependsFrame />
    case 'circuit-charge': return <ChargeFrame />
    case 'circuit-formula': return <FormulaFrame />
    case 'circuit-time': return <TimeFrame />
    case 'circuit-worked-charge': return <WorkedFrame />
    case 'circuit-cell-switch': return <CellSwitch />
    case 'circuit-lamp': return <LampFuseLed />
    case 'circuit-resistor': return <Resistors />
    case 'circuit-meters': return <Meters />
    case 'circuit-sensors': return <Sensors />
    case 'circuit-rules': return <RulesFrame />
    case 'circuit-series': return <SeriesFrame />
    case 'circuit-parallel': return <ParallelFrame />
    case 'circuit-whole': return <WholeFrame />
    case 'circuit-q-symbols': return <QSymbols assessment={assessment} />
    case 'circuit-q-circuit': return <QCircuit assessment={assessment} />
    case 'circuit-q-open': return <QOpen assessment={assessment} />
    default: return null
  }
}

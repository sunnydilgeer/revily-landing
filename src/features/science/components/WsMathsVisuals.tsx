import type { ReactNode } from 'react'
import { WsDiagram, Tag, Panel, Tick, Cross, Arrow, DataTable, Stopwatch, tones, wsPalette as W, ink, muted, r1, faded, type Pt } from './WsKit'
import { Leader, Lines, graphScale, type GraphFrame } from './PhysicsKit'

/*
 * Working Scientifically Lesson 10: Maths skills for science. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'wsmaths-' and is routed from CellBiologyVisuals.tsx.
 *
 * Standard form is drawn as a row of digit tiles with the decimal point hopping between them (one numbered hop per
 * place). Rearranging uses a working card: the operation done to both sides is orange (WsKit "change"), the answer
 * line sits in green. Proportion graphs use the course ink with blue guide lines and no numbers on the axes.
 */

const change = tones.change.text, op = W.pd, good = tones.good, mark = tones.mark
const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace'

/* ---------- Digit tiles and a hopping decimal point ---------- */

const TW = 42, TH = 50
/** Digit tiles from x (left) at y (top). `added` tiles are dashed (zeros filled in). */
function Tiles({ x, y, digits, added = [], dim = false }: { x: number; y: number; digits: string[]; added?: number[]; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    {digits.map((d, i) => {
      const extra = added.includes(i)
      return <g key={i}>
        <rect x={x + i * TW + 3} y={y} width={TW - 6} height={TH} rx="9" fill={extra ? 'white' : W.tableHead} stroke={extra ? W.glassLine : W.tableLine} strokeWidth="1.8" strokeDasharray={extra ? '5 4' : undefined} />
        <text x={x + i * TW + TW / 2} y={y + TH / 2 + 9} textAnchor="middle" fontSize="26" fontWeight="700" fill={extra ? muted : ink}>{d}</text>
      </g>
    })}
  </g>
}
/** The decimal point sitting in a gap between tiles (gap 0 = before the first tile). */
function Point({ x, y, gap, strong = false, ghost = false }: { x: number; y: number; gap: number; strong?: boolean; ghost?: boolean }) {
  const cx = x + gap * TW, cy = y + TH - 5
  return ghost
    ? <circle cx={cx} cy={cy} r="5.5" fill="white" stroke={muted} strokeWidth="1.8" strokeDasharray="3 2.5" />
    : <circle cx={cx} cy={cy} r={strong ? 6.5 : 5.5} fill={strong ? change : ink} stroke="white" strokeWidth="1.5" />
}
/** Numbered hops of the point from one gap to another, drawn as small arcs above the tiles. */
function Hops({ x, y, from, to, colour = change, numbers = true }: { x: number; y: number; from: number; to: number; colour?: string; numbers?: boolean }) {
  const dir = to > from ? 1 : -1, n = Math.abs(to - from)
  return <g>
    {Array.from({ length: n }, (_, i) => {
      const g1 = from + dir * i, g2 = g1 + dir
      const a: Pt = [x + g1 * TW + dir * 3, y - 6], b: Pt = [x + g2 * TW - dir * 3, y - 6]
      return <g key={i}>
        <Arrow from={a} to={b} colour={colour} width={2} bend={dir > 0 ? -0.42 : 0.42} />
        {numbers && <text x={r1((a[0] + b[0]) / 2)} y={y - 28} textAnchor="middle" fontSize="12.5" fontWeight="750" fill={colour}>{i + 1}</text>}
      </g>
    })}
  </g>
}

function Big() {
  const x = 120, y = 92
  return <WsDiagram schematic={false} title="The number 6 000 000 J written in digit tiles. The decimal point starts at the end and hops six places to the left, counted 1 to 6, until it sits just after the 6. So 6 000 000 J is 6 × 10⁶ J.">
    <Hops x={x} y={y} from={7} to={1} />
    <Tiles x={x} y={y} digits={'6000000'.split('')} />
    <Point x={x} y={y} gap={7} ghost />
    <Point x={x} y={y} gap={1} strong />
    <text x={x + 7 * TW + 12} y={y + TH / 2 + 9} fontSize="24" fontWeight="700" fill={muted}>J</text>
    <Lines x={x + 7 * TW} y={y + TH + 26} anchor="middle" lines={['point starts here']} size={12.5} weight={650} colour={muted} />
    <Lines x={x + TW} y={y + TH + 26} anchor="middle" lines={['ends after the 6']} size={12.5} weight={650} colour={change} />
    <Lines x={270} y={36} anchor="middle" lines={['a big number: the point moves 6 places left']} size={15} />
    <Panel x={150} y={212} w={240} h={60} tone="mark" strong />
    <text x={270} y={251} textAnchor="middle" fontSize="26" fontWeight="750" fill={ink}>6 × 10⁶ J</text>
  </WsDiagram>
}
function Cell({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 52} ${y}C${x - 54} ${y - 30} ${x - 20} ${y - 40} ${x + 6} ${y - 37}C${x + 36} ${y - 34} ${x + 56} ${y - 18} ${x + 52} ${y + 4}C${x + 48} ${y + 28} ${x + 18} ${y + 38} ${x - 10} ${y + 36}C${x - 36} ${y + 34} ${x - 51} ${y + 22} ${x - 52} ${y}Z`} fill={W.plant} stroke={W.plantLine} strokeWidth="2" />
    <ellipse cx={x + 8} cy={y - 4} rx="15" ry="12" fill="#b5d4a4" stroke={W.plantLine} strokeWidth="1.8" />
    <Arrow from={[x - 44, y + 56]} to={[x + 52, y + 56]} colour={ink} width={1.8} />
    <Arrow from={[x + 44, y + 56]} to={[x - 52, y + 56]} colour={ink} width={1.8} />
    <Lines x={x} y={y + 80} anchor="middle" lines={['cell width']} size={13} weight={700} colour={muted} />
  </g>
}
function Small() {
  const x = 196, y = 92
  return <WsDiagram schematic={false} title="A cell, 0.00045 m wide. The number 0.00045 written in digit tiles. The decimal point starts after the first 0 and hops four places to the right, counted 1 to 4, landing after the 4. So 0.00045 m is 4.5 × 10⁻⁴ m.">
    <Cell x={84} y={118} />
    <Hops x={x} y={y} from={1} to={5} />
    <Tiles x={x} y={y} digits={'000045'.split('')} />
    <Point x={x} y={y} gap={1} ghost />
    <Point x={x} y={y} gap={5} strong />
    <text x={x + 6 * TW + 10} y={y + TH / 2 + 9} fontSize="24" fontWeight="700" fill={muted}>m</text>
    <Lines x={x + TW} y={y + TH + 26} anchor="middle" lines={['starts here']} size={12.5} weight={650} colour={muted} />
    <Lines x={x + 5 * TW} y={y + TH + 26} anchor="middle" lines={['ends after the 4']} size={12.5} weight={650} colour={change} />
    <Lines x={320} y={36} anchor="middle" lines={['a small number: the point moves 4 places right']} size={15} />
    <Panel x={206} y={212} w={240} h={60} tone="mark" strong />
    <text x={326} y={251} textAnchor="middle" fontSize="26" fontWeight="750" fill={ink}>4.5 × 10⁻⁴ m</text>
  </WsDiagram>
}
function Form() {
  return <WsDiagram schematic={false} title="The pattern of standard form, A × 10ⁿ. A is at least 1 and less than 10. n counts how many places the point moves, and is negative for numbers below 1. 4.5 × 10⁴ is in standard form; 45 × 10³ is not, because A is too big.">
    <text x={270} y={98} textAnchor="middle" fontSize="50" fontWeight="750" fill={ink}><tspan fill={change}>A</tspan> × 10<tspan fill={tones.measure.text}>ⁿ</tspan></text>
    <Leader from={[112, 128]} to={[196, 84]} colour={change} />
    <Lines x={20} y={146} lines={['A: at least 1,', 'less than 10']} size={14} colour={change} />
    <Leader from={[410, 120]} to={[345, 56]} colour={tones.measure.text} />
    <Lines x={362} y={140} lines={['n: places the point', 'moves (negative for', 'numbers below 1)']} size={14} colour={tones.measure.text} />
    <path d="M40 212H500" stroke={W.panelLine} strokeWidth="1.6" />
    <text x={140} y={258} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>4.5 × 10⁴</text>
    <Tick x={228} y={250} />
    <text x={354} y={258} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>45 × 10³</text>
    <Cross x={436} y={250} />
    <Lines x={354} y={286} anchor="middle" lines={['A too big']} size={13} colour={tones.bad.text} />
  </WsDiagram>
}
function Back() {
  const x1 = 176, y1 = 64, x2 = 176, y2 = 196
  return <WsDiagram schematic={false} title="Going back to an ordinary number. 7.2 × 10³: the point hops 3 places right and zeros fill the gaps, giving 7200. 3 × 10⁻²: the point hops 2 places left and zeros fill the gaps, giving 0.03.">
    <text x={24} y={y1 + 34} fontSize="22" fontWeight="750" fill={ink}>7.2 × 10³</text>
    <Hops x={x1} y={y1} from={1} to={4} numbers={false} />
    <Tiles x={x1} y={y1} digits={['7', '2', '0', '0']} added={[2, 3]} />
    <Point x={x1} y={y1} gap={1} ghost />
    <Point x={x1} y={y1} gap={4} strong />
    <text x={x1 + 4 * TW + 16} y={y1 + 34} fontSize="22" fontWeight="750" fill={ink}>= 7200</text>
    <Tag x={x1 + 2 * TW} y={y1 + TH + 26} text="positive power: move right" tone="change" size={13} />
    <text x={24} y={y2 + 34} fontSize="22" fontWeight="750" fill={ink}>3 × 10⁻²</text>
    <Hops x={x2} y={y2} from={3} to={1} numbers={false} />
    <Tiles x={x2} y={y2} digits={['0', '0', '3']} added={[0, 1]} />
    <Point x={x2} y={y2} gap={3} ghost />
    <Point x={x2} y={y2} gap={1} strong />
    <text x={x2 + 4 * TW + 16} y={y2 + 34} fontSize="22" fontWeight="750" fill={ink}>= 0.03</text>
    <Tag x={x2 + 1.5 * TW} y={y2 + TH + 26} text="negative power: move left" tone="change" size={13} />
    <Lines x={500} y={y1 + TH + 30} anchor="end" lines={['dashed tiles:', 'zeros filled in']} size={12.5} weight={650} colour={muted} />
  </WsDiagram>
}

/* ---------- Rearranging ---------- */

function Pan({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return <g>
    <path d={`M${x} ${y - 112}L${x - 56} ${y}M${x} ${y - 112}L${x + 56} ${y}`} stroke={W.metalLine} strokeWidth="1.6" />
    <circle cx={x} cy={y - 112} r="4" fill={W.metal} stroke={W.metalLine} strokeWidth="1.6" />
    {children}
    <path d={`M${x - 64} ${y}Q${x} ${y + 34} ${x + 64} ${y}Z`} fill={W.metal} stroke={W.metalLine} strokeWidth="2.2" />
  </g>
}
function Balance() {
  const bl = 130, br = 410, by = 92
  return <WsDiagram schematic={false} title="A balance scale, level. The left pan holds W and the right pan holds m × g. The same step, divide by g, is added to both pans, so the scale stays level. Do the same to both sides.">
    <Lines x={270} y={34} anchor="middle" lines={['do the same to both sides']} size={17} />
    {/* stand */}
    <path d={`M270 ${by}V262`} stroke={W.woodLine} strokeWidth="7" />
    <path d="M214 272Q270 258 326 272Z" fill={W.wood} stroke={W.woodLine} strokeWidth="2.2" />
    <path d={`M${bl - 10} ${by}H${br + 10}`} stroke={W.woodLine} strokeWidth="6" />
    <path d={`M${bl - 10} ${by}H${br + 10}`} stroke={W.wood} strokeWidth="2.4" />
    <path d={`M258 ${by + 14}L270 ${by - 4}L282 ${by + 14}Z`} fill={W.wood} stroke={W.woodLine} strokeWidth="2" />
    <Pan x={bl} y={by + 112}>
      <text x={bl} y={by + 104} textAnchor="middle" fontSize="28" fontWeight="750" fill={ink}>W</text>
    </Pan>
    <Pan x={br} y={by + 112}>
      <text x={br} y={by + 104} textAnchor="middle" fontSize="26" fontWeight="750" fill={ink}>m × g</text>
    </Pan>
    {[bl, br].map(px => <g key={px}>
      <g><rect x={px - 30} y={by + 34} width={60} height={28} rx={14} fill={tones.truth.fill} stroke={op} strokeWidth={2} /><text x={px} y={by + 54} textAnchor="middle" fontSize="17" fontWeight="800" fill={op}>÷ g</text></g>
      <Arrow from={[px, by + 64]} to={[px, by + 80]} colour={op} width={2.2} />
    </g>)}
  </WsDiagram>
}
type Row = { parts: [string, 'op' | 'plain' | 'dim'][]; note?: string; answer?: boolean }
/** A working card: one row per step, the operation in orange, the answer row in green. */
function Working({ x, y, w, rows, rowH = 58, size = 24 }: { x: number; y: number; w: number; rows: Row[]; rowH?: number; size?: number }) {
  return <g>
    <rect x={x} y={y} width={w} height={rows.length * rowH + 16} rx="18" fill={W.panel} stroke={W.panelLine} strokeWidth="1.6" />
    {rows.map((r, i) => {
      const cy = y + 8 + i * rowH
      return <g key={i}>
        {r.answer && <rect x={x + 8} y={cy + 3} width={w - 16} height={rowH - 6} rx="13" fill={good.fill} stroke={good.line} strokeWidth="2" />}
        <circle cx={x + 30} cy={cy + rowH / 2} r="11" fill="white" stroke={ink} strokeWidth="1.8" />
        <text x={x + 30} y={cy + rowH / 2 + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="750" fill={ink}>{i + 1}</text>
        <text x={x + 54} y={cy + rowH / 2 + size * 0.36} fontSize={size} fontWeight="700" fill={ink}>
          {r.parts.map(([t, k], j) => <tspan key={j} fill={k === 'op' ? op : k === 'dim' ? muted : undefined} fontWeight={k === 'op' ? 800 : undefined}>{t}</tspan>)}
        </text>
        {r.note && <text x={x + w - 14} y={cy + rowH / 2 + 5} textAnchor="end" fontSize="13" fontWeight="650" fill={muted}>{r.note}</text>}
      </g>
    })}
  </g>
}
function Divide() {
  return <WsDiagram schematic={false} title="Rearranging s = v × t to find v. Step 1: s = v × t. Step 2: divide both sides by t, so s ÷ t = v × t ÷ t, and × t and ÷ t cancel. Step 3: v = s ÷ t.">
    <Lines x={270} y={34} anchor="middle" lines={['get v on its own: divide both sides by t']} size={15} />
    <Working x={60} y={52} w={420} rowH={70} size={25} rows={[
      { parts: [['s = v × t', 'plain']] },
      { parts: [['s ', 'plain'], ['÷ t', 'op'], [' = v × t ', 'plain'], ['÷ t', 'op']], note: '× t ÷ t cancel' },
      { parts: [['v = s ÷ t', 'plain']], answer: true },
    ]} />
  </WsDiagram>
}
function Dog({ x, y }: { x: number; y: number }) {
  const fur = W.wood, line = W.woodLine
  return <g>
    <path d={`M${x + 42} ${y - 58}C${x + 62} ${y - 66} ${x + 70} ${y - 82} ${x + 66} ${y - 94}`} stroke={line} strokeWidth="6" fill="none" />
    <path d={`M${x + 42} ${y - 58}C${x + 62} ${y - 66} ${x + 70} ${y - 82} ${x + 66} ${y - 94}`} stroke={fur} strokeWidth="3" fill="none" />
    {[-34, -18, 24, 38].map((dx, i) => <path key={i} d={`M${x + dx} ${y - 40}V${y - 3}`} stroke={line} strokeWidth="10" />)}
    {[-34, -18, 24, 38].map((dx, i) => <path key={`f${i}`} d={`M${x + dx} ${y - 40}V${y - 4}`} stroke={fur} strokeWidth="6.5" />)}
    <path d={`M${x - 46} ${y - 56}C${x - 46} ${y - 78} ${x - 20} ${y - 80} ${x} ${y - 78}C${x + 26} ${y - 78} ${x + 50} ${y - 76} ${x + 50} ${y - 56}C${x + 50} ${y - 36} ${x + 30} ${y - 32} ${x} ${y - 33}C${x - 26} ${y - 33} ${x - 46} ${y - 36} ${x - 46} ${y - 56}Z`} fill={fur} stroke={line} strokeWidth="2.2" />
    <path d={`M${x - 40} ${y - 70}C${x - 52} ${y - 84} ${x - 58} ${y - 100} ${x - 52} ${y - 112}C${x - 44} ${y - 122} ${x - 22} ${y - 120} ${x - 18} ${y - 104}C${x - 16} ${y - 94} ${x - 22} ${y - 76} ${x - 40} ${y - 70}Z`} fill={fur} stroke={line} strokeWidth="2.2" />
    <path d={`M${x - 52} ${y - 104}C${x - 66} ${y - 102} ${x - 74} ${y - 94} ${x - 72} ${y - 86}C${x - 70} ${y - 80} ${x - 60} ${y - 82} ${x - 54} ${y - 90}`} fill={fur} stroke={line} strokeWidth="2.2" />
    <path d={`M${x - 26} ${y - 116}C${x - 22} ${y - 126} ${x - 10} ${y - 122} ${x - 12} ${y - 104}C${x - 14} ${y - 96} ${x - 20} ${y - 94} ${x - 22} ${y - 100}Z`} fill="#c99a62" stroke={line} strokeWidth="2" />
    <circle cx={x - 40} cy={y - 102} r="2.8" fill={ink} />
    <circle cx={x - 70} cy={y - 90} r="3.4" fill={ink} />
  </g>
}
function Weight() {
  return <WsDiagram schematic={false} title="A worked example. A dog stands on a scale reading 98 N, and g = 9.8 N/kg. Step 1: W = m × g. Step 2: divide both sides by g, so W ÷ g = m. Step 3: m = 98 ÷ 9.8. Step 4: m = 10 kg.">
    <Dog x={112} y={210} />
    <path d="M30 212H196Q204 212 204 220V232Q204 240 196 240H30Q22 240 22 232V220Q22 212 30 212Z" fill={W.metal} stroke={W.metalLine} strokeWidth="2" />
    <rect x={80} y={218} width={66} height={17} rx="4" fill="#26394a" />
    <text x={113} y={231} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#bff0c9" fontFamily={mono}>98 N</text>
    <Tag x={113} y={272} text="g = 9.8 N/kg" tone="keep" size={13} />
    <Working x={226} y={20} w={296} rowH={62} size={21} rows={[
      { parts: [['W = m × g', 'plain']] },
      { parts: [['W ', 'plain'], ['÷ g', 'op'], [' = m', 'plain']] },
      { parts: [['m = 98 ÷ 9.8', 'plain']] },
      { parts: [['m = 10 kg', 'plain']], answer: true },
    ]} />
  </WsDiagram>
}
function Triangle({ cx, cover = false }: { cx: number; cover?: boolean }) {
  const top = 62, base = 222, mid = 162, half = 96
  return <g>
    <path d={`M${cx} ${top}Q${cx + 4} ${top + 2} ${cx + half} ${base - 2}Q${cx + half} ${base} ${cx + half - 6} ${base}H${cx - half + 6}Q${cx - half} ${base} ${cx - half + 2} ${base - 4}L${cx - 2} ${top + 2}Q${cx} ${top - 1} ${cx} ${top}Z`} fill={tones.measure.fill} stroke={tones.measure.line} strokeWidth="2.4" />
    <path d={`M${cx - 58} ${mid}H${cx + 58}M${cx} ${mid}V${base}`} stroke={tones.measure.line} strokeWidth="2.2" />
    <text x={cx} y={mid - 16} textAnchor="middle" fontSize="30" fontWeight="750" fill={ink}>s</text>
    <text x={cx - 36} y={base - 18} textAnchor="middle" fontSize="28" fontWeight="750" fill={ink}>v</text>
    <text x={cx + 36} y={base - 18} textAnchor="middle" fontSize="28" fontWeight="750" fill={ink}>t</text>
    {cover && <g transform={`translate(${cx} ${mid - 26}) rotate(38)`}>
      {/* a fingertip covering s */}
      <rect x={-25} y={-150} width={50} height={172} rx={25} fill={W.skin} stroke={W.skinLine} strokeWidth="2.2" />
      <path d="M-13 -2C-14 -18 -9 -26 0 -26C9 -26 14 -18 13 -2C12 8 -12 8 -13 -2Z" fill="#f8e6d6" stroke={W.skinLine} strokeWidth="1.6" />
      <path d="M-14 -44Q0 -40 14 -44" stroke={W.skinLine} strokeWidth="1.4" fill="none" />
    </g>}
  </g>
}
function Triangles() {
  return <WsDiagram schematic={false} title="Two formula triangles for s = v × t, with s at the top and v and t at the bottom. On the right a finger covers s, leaving v × t showing: s = v × t.">
    <Triangle cx={140} />
    <Lines x={140} y={262} anchor="middle" lines={['s at the top,', 'v and t below']} size={14} weight={650} colour={muted} />
    <Triangle cx={390} cover />
    <Tag x={390} y={258} text="s = v × t" tone="measure" size={17} strong />
    <Lines x={270} y={30} anchor="middle" lines={['cover what you want to find']} size={16} />
  </WsDiagram>
}

/* ---------- Calculator habits ---------- */

function Calculator({ x, y, entry, answer, good: ok }: { x: number; y: number; entry: ReactNode; answer: string; good: boolean }) {
  const w = 216, h = 196
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="22" fill="#e9eef2" stroke={W.metalLine} strokeWidth="2.2" />
    <rect x={x + 14} y={y + 14} width={w - 28} height={72} rx="10" fill="#dfe8d6" stroke="#8ea07f" strokeWidth="1.8" />
    <text x={x + 24} y={y + 42} fontSize="16" fontWeight="700" fill={ink} fontFamily={mono}>{entry}</text>
    <text x={x + w - 24} y={y + 74} textAnchor="end" fontSize="22" fontWeight="750" fill={ink} fontFamily={mono}>{answer}</text>
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={x + 18 + (i % 5) * 37} y={y + 104 + Math.floor(i / 5) * 36} width="31" height="26" rx="8" fill="white" stroke={W.tableLine} strokeWidth="1.4" />)}
    {ok ? <Tick x={x + w - 6} y={y + 6} s={1.25} /> : <Cross x={x + w - 6} y={y + 6} s={1.25} />}
  </g>
}
function Brackets() {
  const b = (t: string) => <tspan fill={op} fontWeight="800">{t}</tspan>
  return <WsDiagram schematic={false} title="Two calculators. Left: (11.5 + 6.8) ÷ 3 typed with brackets gives 6.1, which is right. Right: 11.5 + 6.8 ÷ 3 typed without brackets gives 13.77, which is wrong because it divides only the 6.8.">
    <Calculator x={34} y={30} entry={<>{b('(')}11.5+6.8{b(')')}÷3</>} answer="6.1" good />
    <Calculator x={290} y={30} entry="11.5+6.8÷3" answer="13.77" good={false} />
    <Lines x={142} y={256} anchor="middle" lines={['brackets: adds first,', 'then divides']} size={14} colour={good.text} />
    <Lines x={398} y={256} anchor="middle" lines={['no brackets: divides', 'only the 6.8']} size={14} colour={tones.bad.text} />
  </WsDiagram>
}
function StepBox({ x, y, w, text, tone = 'plain' }: { x: number; y: number; w: number; text: string; tone?: 'plain' | 'good' | 'bad' | 'mark' }) {
  const c = tones[tone]
  return <g>
    <rect x={x} y={y} width={w} height={46} rx="12" fill={tone === 'plain' ? 'white' : c.fill} stroke={c.line} strokeWidth="1.9" />
    <text x={x + w / 2} y={y + 29} textAnchor="middle" fontSize="17" fontWeight="700" fill={ink} fontFamily={mono}>{text}</text>
  </g>
}
function Ans() {
  const y1 = 58, y2 = 176
  return <WsDiagram schematic={false} title="Two ways through a two-step calculation. Top: 10 ÷ 3 = 3.3333333, then the Ans key carries the exact value into Ans × 3, giving 10, which is right. Bottom: rounding early to 3.3 gives 3.3 × 3 = 9.9, which is wrong. Round only at the end.">
    <Lines x={16} y={y1 - 14} lines={['keep the exact value']} size={14} colour={good.text} />
    <StepBox x={16} y={y1} w={196} text="10÷3=3.3333333" />
    <circle cx={240} cy={y1 + 23} r="21" fill={mark.fill} stroke={mark.line} strokeWidth="2" />
    <text x={240} y={y1 + 28} textAnchor="middle" fontSize="13.5" fontWeight="800" fill={mark.text}>Ans</text>
    <Arrow from={[213, y1 + 23]} to={[219, y1 + 23]} colour={ink} width={2} />
    <Arrow from={[263, y1 + 23]} to={[280, y1 + 23]} colour={ink} width={2} />
    <StepBox x={284} y={y1} w={170} text="Ans×3 = 10" tone="good" />
    <Tick x={484} y={y1 + 23} />
    <Lines x={16} y={y2 - 14} lines={['round too early']} size={14} colour={tones.bad.text} />
    <StepBox x={16} y={y2} w={196} text="10÷3 ≈ 3.3" />
    <Arrow from={[213, y2 + 23]} to={[280, y2 + 23]} colour={ink} width={2} />
    <StepBox x={284} y={y2} w={170} text="3.3×3 = 9.9" tone="bad" />
    <Cross x={484} y={y2 + 23} />
    <Tag x={270} y={268} text="round only at the end" tone="mark" size={14} strong />
  </WsDiagram>
}

/* ---------- Proportion ---------- */

const GF: GraphFrame = { x: 70, y: 46, width: 250, height: 190, xMax: 4.4, yMax: 4.4 }
function Axes() {
  const s = graphScale(GF), o: Pt = [GF.x, GF.y + GF.height]
  return <g>
    <Arrow from={o} to={[s.x(4.4) + 12, o[1]]} colour={ink} width={2} />
    <Arrow from={o} to={[o[0], GF.y - 12]} colour={ink} width={2} />
    <text x={s.x(4.4) + 4} y={o[1] + 24} textAnchor="end" fontSize="16" fontWeight="750" fill={ink}>B</text>
    <text x={o[0] - 14} y={GF.y + 2} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>A</text>
    <text x={o[0] - 8} y={o[1] + 18} textAnchor="end" fontSize="12.5" fill={muted}>0</text>
  </g>
}
/** Dashed guides from two points to the axes, with ×2 / ÷2 arrows along the axes. */
function Guides({ p1, p2, yWord }: { p1: [number, number]; p2: [number, number]; yWord: string }) {
  const s = graphScale(GF), base = GF.y + GF.height, blue = tones.measure.line
  const pts = [p1, p2].map(([bx, ay]) => s.pt(bx, ay))
  return <g>
    {pts.map(([px, py], i) => <g key={i}>
      <path d={`M${px} ${py}V${base}M${px} ${py}H${GF.x}`} stroke={blue} strokeWidth="1.6" strokeDasharray="5 4" />
      <circle cx={px} cy={py} r="6" fill={tones.measure.fill} stroke={blue} strokeWidth="2.2" />
    </g>)}
    <Arrow from={[pts[0][0] + 2, base + 16]} to={[pts[1][0] - 2, base + 16]} colour={change} width={2.2} />
    <text x={r1((pts[0][0] + pts[1][0]) / 2)} y={base + 38} textAnchor="middle" fontSize="13" fontWeight="750" fill={change}>× 2</text>
    <Arrow from={[GF.x - 16, pts[0][1] + (pts[1][1] > pts[0][1] ? 2 : -2)]} to={[GF.x - 16, pts[1][1] + (pts[1][1] > pts[0][1] ? -2 : 2)]} colour={change} width={2.2} />
    <text x={GF.x - 24} y={r1((pts[0][1] + pts[1][1]) / 2 + 5)} textAnchor="end" fontSize="13" fontWeight="750" fill={change}>{yWord}</text>
  </g>
}
function Direct() {
  const s = graphScale(GF)
  return <WsDiagram schematic={false} title="Direct proportion: a straight line through the origin on axes A and B. When B doubles, A doubles too. A ∝ B.">
    <Axes />
    <path d={s.path([[0, 0], [4.1, 4.1]])} stroke={ink} strokeWidth="3.2" fill="none" />
    <Guides p1={[1.6, 1.6]} p2={[3.2, 3.2]} yWord="× 2" />
    <Tag x={440} y={80} text="direct" tone="measure" size={15} strong />
    <text x={440} y={132} textAnchor="middle" fontSize="28" fontWeight="750" fill={ink}>A ∝ B</text>
    <Lines x={440} y={176} anchor="middle" lines={['B doubles,', 'A doubles']} size={15} colour={change} />
    <Lines x={440} y={236} anchor="middle" lines={['straight line', 'through 0']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function Inverse() {
  const s = graphScale(GF), k = 3.6
  const pts: [number, number][] = Array.from({ length: 41 }, (_, i) => { const b = 0.85 + i * (4.25 - 0.85) / 40; return [b, k / b] })
  return <WsDiagram schematic={false} title="Inverse proportion: a curve going down on axes A and B. When B doubles, A halves. A ∝ 1 ÷ B.">
    <Axes />
    <path d={s.path(pts)} stroke={ink} strokeWidth="3.2" fill="none" />
    <Guides p1={[1.3, k / 1.3]} p2={[2.6, k / 2.6]} yWord="÷ 2" />
    <Tag x={440} y={80} text="inverse" tone="measure" size={15} strong />
    <text x={440} y={132} textAnchor="middle" fontSize="26" fontWeight="750" fill={ink}>A ∝ 1 ÷ B</text>
    <Lines x={440} y={176} anchor="middle" lines={['B doubles,', 'A halves']} size={15} colour={change} />
    <Lines x={440} y={236} anchor="middle" lines={['one goes up,', 'the other down']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function Symbol() {
  return <WsDiagram schematic={false} title="The proportional symbol ∝ means is proportional to. A table: direct, B doubles and A doubles, written A ∝ B. Inverse, B doubles and A halves, written A ∝ 1 ÷ B.">
    <text x={270} y={42} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}><tspan fontSize="26" fill={change}>∝</tspan>  means “is proportional to”</text>
    <DataTable x={40} y={76} cols={[130, 190, 140]} rowH={70} headH={42} size={17} rows={[
      ['', 'In a table', 'Write it as'],
      ['Direct', 'B doubles,\nA doubles', { t: 'A ∝ B', tone: 'mark' }],
      ['Inverse', 'B doubles,\nA halves', { t: 'A ∝ 1 ÷ B', tone: 'mark' }],
    ]} />
  </WsDiagram>
}
function QTable() {
  return <WsDiagram schematic={false} title="A table titled Reaction time at different temperatures. Temperature 10 °C: time 120 s. 20 °C: 60 s. 40 °C: 30 s.">
    <DataTable x={60} y={70} cols={[200, 160]} rowH={48} headH={50} size={18} title="Reaction time at different temperatures" rows={[
      ['Temperature (°C)', 'Time (s)'],
      ['10', '120'],
      ['20', '60'],
      ['40', '30'],
    ]} />
    <Stopwatch x={474} y={160} r={34} />
  </WsDiagram>
}

const views: Record<string, () => ReactNode> = {
  'wsmaths-big': Big, 'wsmaths-small': Small, 'wsmaths-form': Form, 'wsmaths-back': Back,
  'wsmaths-balance': Balance, 'wsmaths-divide': Divide, 'wsmaths-weight': Weight, 'wsmaths-triangle': Triangles,
  'wsmaths-brackets': Brackets, 'wsmaths-ans': Ans,
  'wsmaths-direct': Direct, 'wsmaths-inverse': Inverse, 'wsmaths-symbol': Symbol,
  'wsmaths-q-table': QTable,
}
export function WsMathsVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  const View = views[focus]
  return View ? <View /> : null
}

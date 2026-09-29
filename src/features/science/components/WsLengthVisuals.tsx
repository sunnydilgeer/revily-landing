import { WsDiagram, Tag, Tick, Cross, Arrow, Bench, Bracket, Numbered, Beaker, TestTube, Eye, Sight, Stopwatch, Ruler, PotPlant, Panel, tones, wsPalette as W, ink, muted, r1, type Pt } from './WsKit'
import { Lines, Leader } from './PhysicsKit'
import { Cylinder } from './DensityVisuals'
import { Chips, Bubbles, labPalette as LB } from './GasRateVisuals'
import { blob } from './GasParticleVisuals'

/*
 * Working Scientifically Lesson 14: Measuring volume, length, angles, temperature and time.
 * Original, code-native schematics; not to scale. Every focus id here starts with 'wslength-' and is routed from
 * CellBiologyVisuals.tsx.
 *
 * Drawn with WsKit, like the other practical-skills lessons: water blue, glass pale grey-blue, the thermometer thread
 * red (hot), the place to read soft yellow, good habits a green tick and poor ones a coral cross.
 * The eureka can set-up is one drawing reused through its four-step walkthrough; the ten-seeds ruler is reused by
 * the worked example; the protractor is reused by the question (numbers only there).
 */

const water = { fill: W.water, line: W.waterLine, text: '#2f7aa0' }
const sol = { fill: LB.sol, line: LB.solLine }
const thread = W.hot

function Stone({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={blob(0, 0, 19, 13, 44, 0.22, 9)} fill="#c9c1b3" stroke="#7d7466" strokeWidth="2" />
    <path d="M-8 -4q4 -3 9 -1M3 5q4 -1 7 -4" stroke="#9d9384" strokeWidth="1.5" fill="none" />
  </g>
}

/* ---------- Section 2: the eureka can ---------- */

type EurekaStage = 'can' | 'level' | 'object' | 'read'
const CAN = { x: 166, y: 258, w: 136, h: 178 }
function Eureka({ stage }: { stage: EurekaStage }) {
  const { x, y, w, h } = CAN, l = x - w / 2, r = x + w / 2, top = y - h
  const spoutY = top + 24, level = stage === 'can' ? top + 92 : spoutY + 4
  const tip: Pt = [r + 52, spoutY + 30]
  const cyl = { x: tip[0] + 34, y: 260, h: 110 }
  const cylLevel = stage === 'read' ? 0.36 : stage === 'object' ? 0.2 : 0
  const cylSurf = r1(cyl.y - 12 - (cyl.h - 18) * cylLevel)
  const titles: Record<EurekaStage, string> = {
    can: 'A eureka can: a can with a spout near the top. An irregular stone sits beside it.',
    level: 'The eureka can is filled with water above the spout and left to drain. The last drops run out of the spout until the water is level with the spout.',
    object: 'A stone is lowered into the eureka can. It pushes water out of the spout into a measuring cylinder.',
    read: 'The stone is at the bottom of the can and the spout has stopped dripping. An eye level with the water in the measuring cylinder reads its volume.',
  }
  return <WsDiagram title={titles[stage]}>
    {/* water in the can */}
    <path d={`M${l + 2} ${level}H${r - 2}V${y - 10}Q${r - 2} ${y - 2} ${r - 10} ${y - 2}H${l + 10}Q${l + 2} ${y - 2} ${l + 2} ${y - 10}Z`} fill={water.fill} />
    <path d={`M${l + 2} ${level}H${r - 2}`} stroke={water.line} strokeWidth="1.8" />
    {stage === 'object' && <g><path d={`M${x + 6} ${top - 30}V${y - 74}`} stroke={muted} strokeWidth="1.4" /><Stone x={x + 6} y={y - 62} /></g>}
    {stage === 'read' && <Stone x={x + 10} y={y - 16} />}
    {/* spout */}
    <path d={`M${r} ${spoutY - 7}L${tip[0]} ${tip[1] - 8}M${r} ${spoutY + 7}L${tip[0] - 2} ${tip[1] + 5}`} stroke={W.glassLine} strokeWidth="2.4" />
    <path d={`M${tip[0]} ${tip[1] - 8}L${tip[0] - 2} ${tip[1] + 5}`} stroke={W.glassLine} strokeWidth="2.4" />
    {(stage === 'level' || stage === 'object') && <path d={`M${r + 2} ${spoutY + 1}L${tip[0] - 2} ${tip[1] - 2}`} stroke={water.fill} strokeWidth="7" />}
    {stage === 'object' && <path d={`M${tip[0] - 1} ${tip[1]}Q${tip[0] + 22} ${tip[1] + 2} ${cyl.x - 6} ${cylSurf - 2}`} stroke={water.line} strokeWidth="3" fill="none" />}
    {stage === 'level' && <g>
      <path d={`M${tip[0]} ${tip[1] + 12}c2.5 4 3.5 6 3.5 8a3.5 3.5 0 0 1 -7 0c0 -2 1 -4 3.5 -8z`} fill={water.fill} stroke={water.line} strokeWidth="1.4" />
      <path d={`M${tip[0]} ${tip[1] + 32}c2.5 4 3.5 6 3.5 8a3.5 3.5 0 0 1 -7 0c0 -2 1 -4 3.5 -8z`} fill={water.fill} stroke={water.line} strokeWidth="1.4" />
    </g>}
    {/* the can */}
    <path d={`M${l} ${top}V${y - 12}Q${l} ${y} ${l + 12} ${y}H${r - 12}Q${r} ${y} ${r} ${y - 12}V${top}`} fill="none" stroke={W.glassLine} strokeWidth="2.6" />
    <path d={`M${l - 3} ${top}H${r + 3}`} stroke={W.glassLine} strokeWidth="3" />
    <path d={`M${r - 14} ${top + 30}V${y - 18}`} stroke="white" strokeWidth="4" opacity=".7" />
    {stage === 'can' && <g>
      <Stone x={380} y={244} s={1.3} />
      <Lines x={380} y={206} anchor="middle" lines={['irregular solid']} size={13} weight={650} colour={muted} />
      <Lines x={x} y={290} anchor="middle" lines={['eureka can']} size={16} />
      <Lines x={292} y={110} lines={['spout']} size={16} />
      <Leader from={[288, 114]} to={[r + 30, spoutY + 16]} />
    </g>}
    {stage === 'level' && <g>
      <Beaker x={cyl.x} y={cyl.y} w={56} h={46} level={0.2} marks={false} />
      <path d={`M${l + 2} ${level}H${r + 40}`} stroke={tones.mark.line} strokeWidth="2" strokeDasharray="5 4" />
      <Lines x={300} y={70} lines={['water level', 'just at the spout']} size={15} colour={tones.mark.text} />
      <Leader from={[296, 84]} to={[r + 30, level]} colour={tones.mark.line} />
      <Lines x={x} y={top - 36} anchor="middle" lines={['fill above the spout,', 'then let it drain']} size={13} weight={650} colour={muted} />
    </g>}
    {(stage === 'object' || stage === 'read') && <Cylinder x={cyl.x} y={cyl.y} h={cyl.h} w={40} level={cylLevel} marks={5} />}
    {stage === 'object' && <g>
      <Lines x={x - 30} y={top - 12} anchor="end" lines={['object']} size={15} />
      <Leader from={[x - 26, top - 16]} to={[x - 12, y - 66]} />
      <Lines x={390} y={70} lines={['water', 'pushed out']} size={15} colour={water.text} />
      <Leader from={[386, 80]} to={[tip[0] + 8, tip[1] + 8]} colour={water.line} />
      <Lines x={390} y={214} lines={['measuring', 'cylinder']} size={14} />
      <Leader from={[386, 218]} to={[cyl.x + 20, 226]} />
    </g>}
    {stage === 'read' && <g>
      <Lines x={tip[0] + 4} y={tip[1] - 44} lines={['stopped dripping']} size={14} weight={650} colour={muted} />
      <Leader from={[tip[0] + 10, tip[1] - 38]} to={[tip[0] - 2, tip[1] + 2]} colour={muted} />
      <Eye x={470} y={cylSurf + 2} look={180} />
      <Sight from={[450, cylSurf + 2]} to={[cyl.x + 24, cylSurf + 2]} tone="mark" />
      <Lines x={470} y={cylSurf - 60} anchor="middle" lines={['read the', 'volume here']} size={15} colour={tones.mark.text} />
      <Lines x={470} y={cylSurf + 38} anchor="middle" lines={['eye level']} size={13} weight={650} colour={muted} />
    </g>}
    <Bench x1={60} x2={500} y={y + 2} />
  </WsDiagram>
}

/* ---------- Section 3: length ---------- */

function MetreRuler({ x, y, w, cm, step, label = 1, h = 26, fill = '#f7ebc8', line = '#b99a52' }: { x: number; y: number; w: number; cm: number; step: number; label?: number; h?: number; fill?: string; line?: string }) {
  const n = Math.round(cm / step), px = w / cm
  return <g>
    <rect x={x - 10} y={y} width={w + 20} height={h} rx="3" fill={fill} stroke={line} strokeWidth="1.6" />
    {Array.from({ length: n + 1 }, (_, i) => {
      const v = i * step, xx = r1(x + v * px), major = v % label === 0
      return <g key={i}>
        <path d={`M${xx} ${y}v${major ? 10 : 6}`} stroke="#9c8040" strokeWidth="1.2" />
        {major && <text x={xx} y={y + h - 3} textAnchor="middle" fontSize="12" fontWeight="650" fill="#6f5a2a">{v}</text>}
      </g>
    })}
  </g>
}

function Micrometer({ x, y }: { x: number; y: number }) {
  // (x, y): the gap between the anvil and the spindle, where the wire sits.
  return <g>
    <path d={`M${x - 16} ${y - 4}V${y + 30}Q${x - 16} ${y + 50} ${x + 6} ${y + 50}H${x + 96}Q${x + 118} ${y + 50} ${x + 118} ${y + 30}V${y + 8}`} fill="none" stroke={W.metalLine} strokeWidth="17" />
    <path d={`M${x - 16} ${y - 4}V${y + 30}Q${x - 16} ${y + 50} ${x + 6} ${y + 50}H${x + 96}Q${x + 118} ${y + 50} ${x + 118} ${y + 30}V${y + 8}`} fill="none" stroke="#f0c6a0" strokeWidth="13" />
    <rect x={x - 22} y={y - 8} width={18} height={16} rx="2" fill={W.metal} stroke={W.metalLine} strokeWidth="1.6" />
    <rect x={x + 4} y={y - 6} width={104} height={12} rx="2" fill={W.metal} stroke={W.metalLine} strokeWidth="1.6" />
    <rect x={x + 108} y={y - 10} width={64} height={20} rx="3" fill={W.metal} stroke={W.metalLine} strokeWidth="1.8" />
    <path d={`M${x + 110} ${y}H${x + 170}`} stroke={W.metalLine} strokeWidth="1.2" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${x + 114 + i * 6} ${y}v${i % 2 ? -4 : -6}`} stroke={W.metalLine} strokeWidth="1.1" />)}
    <rect x={x + 172} y={y - 15} width={56} height={30} rx="5" fill="#c9d3dc" stroke={W.metalLine} strokeWidth="1.8" />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${x + 180 + i * 8} ${y - 15}v30`} stroke={W.metalLine} strokeWidth="1" opacity=".7" />)}
    <rect x={x + 228} y={y - 9} width={18} height={18} rx="3" fill="#c9d3dc" stroke={W.metalLine} strokeWidth="1.6" />
    <path d={`M${x} ${y - 30}V${y + 26}`} stroke="#c07a3a" strokeWidth="3.4" />
  </g>
}

function Rulers() {
  return <WsDiagram title="Three instruments for length. A centimetre ruler for most lengths, a metre rule for long distances, and a micrometer for tiny things such as the width of a thin wire.">
    <Lines x={40} y={40} lines={['centimetre ruler']} size={15} />
    <Lines x={186} y={40} lines={['most lengths']} size={14} weight={650} colour={muted} />
    <MetreRuler x={40} y={52} w={300} cm={15} step={1} label={5} />
    <Lines x={40} y={124} lines={['metre rule']} size={15} />
    <Lines x={140} y={124} lines={['long distances']} size={14} weight={650} colour={muted} />
    <MetreRuler x={40} y={136} w={460} cm={100} step={10} label={50} h={22} fill="#f3e2bd" />
    <Lines x={40} y={206} lines={['micrometer']} size={15} />
    <Lines x={40} y={226} lines={['tiny things, such', 'as a thin wire']} size={14} weight={650} colour={muted} />
    <Micrometer x={256} y={238} />
    <Lines x={236} y={206} lines={['wire']} size={12} weight={650} colour={muted} />
  </WsDiagram>
}

function EyeLevel() {
  const top = 120
  return <WsDiagram title="A ruler stands alongside a seedling. An eye level with the top of the seedling reads the ruler straight on. A faded eye looking down from above, at an angle, gets a wrong reading.">
    <g transform="translate(-70 0)">
    <PotPlant x={220} y={262} h={top} />
    <Ruler x={276} y={262} h={196} w={18} />
    <Sight from={[430, 262 - 34 - top]} to={[270, 262 - 34 - top]} tone="good" />
    <Eye x={452} y={262 - 34 - top} look={180} />
    <Tick x={452} y={148} s={0.85} />
    <Lines x={470} y={186} anchor="middle" lines={['eye level']} size={15} colour={tones.good.text} />
    <Sight from={[420, 34]} to={[282, 118]} tone="bad" dim />
    <Eye x={440} y={28} look={150} dim />
    <Cross x={392} y={28} s={0.75} dim />
    <Lines x={330} y={232} lines={['ruler alongside', 'the object']} size={14} />
    <Leader from={[326, 228]} to={[286, 214]} />
    </g>
  </WsDiagram>
}

function Spring({ x, top, bottom, coils = 10 }: { x: number; top: number; bottom: number; coils?: number }) {
  const step = (bottom - top) / coils
  const d = Array.from({ length: coils }, (_, i) => `Q${i % 2 ? x - 26 : x + 26} ${r1(top + (i + 0.5) * step)} ${x} ${r1(top + (i + 1) * step)}`).join('')
  return <path d={`M${x} ${top}${d}`} fill="none" stroke={W.metalLine} strokeWidth="2.6" />
}
function Marker() {
  const sx = 200, mY = 170
  return <WsDiagram title="A spring hangs from a clamp stand with masses on the end. A small marker on the bottom of the spring points at a ruler standing beside it, so every length is read from the same point.">
    <rect x={60} y={252} width={120} height={12} rx="4" fill={W.metal} stroke={W.metalLine} strokeWidth="1.8" />
    <path d="M86 252V40M86 50H214" stroke={W.metalLine} strokeWidth="5" />
    <rect x={194} y={44} width={14} height={14} rx="3" fill={W.metal} stroke={W.metalLine} strokeWidth="1.6" />
    <Spring x={sx} top={58} bottom={mY - 6} />
    <path d={`M${sx} ${mY - 6}V${mY + 10}`} stroke={W.metalLine} strokeWidth="2.4" />
    {[0, 1, 2].map(i => <rect key={i} x={sx - 20} y={mY + 10 + i * 13} width={40} height={12} rx="3" fill="#c9d3dc" stroke={W.metalLine} strokeWidth="1.6" />)}
    <path d={`M${sx + 4} ${mY - 12}L${sx + 26} ${mY - 6}L${sx + 4} ${mY}Z`} fill={tones.mark.fill} stroke={tones.mark.line} strokeWidth="2" />
    <path d={`M${sx + 28} ${mY - 6}H${316}`} stroke={tones.mark.line} strokeWidth="2" strokeDasharray="5 4" />
    <Ruler x={326} y={262} h={214} w={18} />
    <Lines x={250} y={116} anchor="middle" lines={['marker']} size={15} colour={tones.mark.text} />
    <Leader from={[240, 122]} to={[sx + 16, mY - 10]} colour={tones.mark.line} />
    <Tag x={450} y={mY - 6} text="same point every time" tone="mark" size={13} />
    <Bench x1={40} x2={500} y={266} />
  </WsDiagram>
}

const SEED = { x: 60, y: 176, cm: 30 }
function Seed({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 17} ${y}C${x - 12} ${y - 10} ${x + 8} ${y - 11} ${x + 17} ${y}C${x + 8} ${y + 11} ${x - 12} ${y + 10} ${x - 17} ${y}Z`} fill="#5f5a55" stroke="#3d3935" strokeWidth="1.6" />
    <path d={`M${x - 10} ${y - 3}H${x + 10}M${x - 10} ${y + 3}H${x + 10}`} stroke="#e7e1d6" strokeWidth="1.6" />
  </g>
}
function TenSeeds({ worked = false }: { worked?: boolean }) {
  const { x, y, cm } = SEED, end = x + 12 * cm
  return <WsDiagram title={worked
    ? 'Ten identical seeds laid end to end along a ruler reach 12 cm. 12 cm ÷ 10 = 1.2 cm, so one seed is 1.2 cm long.'
    : 'Ten identical seeds laid end to end along a ruler. Measure all ten together, then divide by ten to find the length of one.'}>
    {Array.from({ length: 10 }, (_, i) => <Seed key={i} x={r1(x + (i + 0.5) * 1.2 * cm)} y={y} />)}
    <MetreRuler x={x} y={y + 14} w={13 * cm} cm={13} step={1} label={1} h={32} />
    <path d={`M${x} ${y - 14}V${y + 14}M${end} ${y - 14}V${y + 14}`} stroke={tones.measure.line} strokeWidth="2" strokeDasharray="4 4" />
    <Bracket x1={x} x2={end} y={y - 26} colour={tones.measure.line} />
    <Tag x={(x + end) / 2} y={y - 58} text={worked ? 'ten together = 12 cm' : 'measure ten together'} tone="measure" size={14} strong />
    {worked
      ? <Tag x={270} y={264} text="12 cm ÷ 10 = 1.2 cm for one seed" tone="mark" size={15} strong />
      : <Tag x={270} y={264} text="then ÷ 10 for the length of one" tone="mark" size={15} strong />}
  </WsDiagram>
}

/* ---------- Section 4: angle, temperature, time ---------- */

const PR = { cx: 270, cy: 226, r: 170, angle: 50 }
const polar = (deg: number, rr: number): Pt => [r1(PR.cx + Math.cos(deg * Math.PI / 180) * rr), r1(PR.cy - Math.sin(deg * Math.PI / 180) * rr)]
function ProtractorScene({ labels }: { labels: boolean }) {
  const { cx, cy, r, angle } = PR
  const armEnd = polar(angle, r + 50), hit = polar(angle, r - 10)
  return <g>
    {/* the protractor */}
    <path d={`M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}V${cy + 14}H${cx - r}Z`} fill="#e6f1f8" fillOpacity=".72" stroke={W.glassLine} strokeWidth="2.2" />
    <path d={`M${cx - r + 36} ${cy}A${r - 36} ${r - 36} 0 0 1 ${cx + r - 36} ${cy}`} fill="none" stroke={W.glassLine} strokeWidth="1.2" opacity=".6" />
    {Array.from({ length: 19 }, (_, i) => {
      const a = i * 10, [x1, y1] = polar(a, r), [x2, y2] = polar(a, r - (a % 30 === 0 ? 20 : 12))
      const [tx, ty] = polar(a, r - 32)
      return <g key={a}>
        <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={W.glassLine} strokeWidth="1.5" />
        {a % 30 === 0 && <text x={tx} y={r1(ty + (a % 180 === 0 ? -6 : 4))} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>{a}</text>}
      </g>
    })}
    <path d={`M${cx - r} ${cy}H${cx + r}`} stroke={W.glassLine} strokeWidth="1.6" />
    {/* the angle drawn on the paper shows through the clear protractor */}
    <path d={`M${cx} ${cy}H${cx + r + 60}M${cx} ${cy}L${armEnd[0]} ${armEnd[1]}`} stroke={ink} strokeWidth="2.6" opacity=".85" />
    <path d={`M${cx} ${cy}V${cy - 16}`} stroke={ink} strokeWidth="2" />
    <circle cx={cx} cy={cy} r="4" fill="white" stroke={ink} strokeWidth="2" />
    {labels && <g>
      <circle cx={hit[0]} cy={hit[1]} r="7" fill={tones.mark.fill} stroke={tones.mark.line} strokeWidth="2.2" />
      <Lines x={476} y={96} anchor="middle" lines={['read the', 'scale here:']} size={14} colour={tones.mark.text} />
      <Tag x={476} y={148} text="50°" tone="mark" size={15} strong />
      <Leader from={[446, 104]} to={[hit[0] + 8, hit[1] + 2]} colour={tones.mark.line} />
      <Lines x={cx} y={cy + 44} anchor="middle" lines={['middle on the corner']} size={14} />
      <Leader from={[cx, cy + 30]} to={[cx, cy + 5]} />
      <Lines x={cx + r + 20} y={cy + 30} anchor="middle" lines={['base line']} size={14} />
      <Leader from={[cx + r + 20, cy + 16]} to={[cx + r - 10, cy + 2]} />
    </g>}
  </g>
}
function Protractor() {
  return <WsDiagram title="A protractor measures an angle of 50°. Its middle sits on the corner of the angle, its base line lies along one line, and the angle is read where the other line crosses the scale.">
    <ProtractorScene labels />
  </WsDiagram>
}
function QProtractor() {
  const { cx, cy, r } = PR
  const pts: [number, Pt, Pt][] = [
    [1, [60, 70], polar(145, r - 4)],
    [2, [60, 272], [cx - r + 16, cy + 8]],
    [3, [cx - 70, 282], [cx, cy]],
    [4, [500, 40], polar(PR.angle, r + 48)],
  ]
  return <WsDiagram title="A protractor on an angle with four numbered parts.">
    <ProtractorScene labels={false} />
    {pts.map(([n, at, to]) => <Numbered key={n} n={n} at={at} to={to} />)}
  </WsDiagram>
}

/** A thermometer standing upright; (x, y) is the middle of its bulb. `top` is the top of the tube, `level` the top of the thread. */
function Thermometer({ x, y, top, level, w = 12, dim = false, ticks = true }: { x: number; y: number; top: number; level: number; w?: number; dim?: boolean; ticks?: boolean }) {
  const br = w * 0.85
  return <g opacity={dim ? 0.35 : 1}>
    <path d={`M${x - w / 2} ${y - br + 2}V${top + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${top + w / 2}V${y - br + 2}`} fill="#fbfdfe" stroke={W.glassLine} strokeWidth="2" />
    <path d={`M${x} ${y}V${level}`} stroke={thread} strokeWidth={Math.max(3, w * 0.3)} />
    <circle cx={x} cy={y} r={br} fill={W.hotFill} stroke={W.glassLine} strokeWidth="2" />
    <circle cx={x} cy={y} r={br - 3.5} fill={thread} />
    {ticks && Array.from({ length: Math.floor((y - top - 40) / 12) }, (_, i) => <path key={i} d={`M${x + w / 2} ${r1(y - 26 - i * 12)}h${i % 5 === 0 ? -6 : -3.5}`} stroke={W.glassLine} strokeWidth="1.1" />)}
  </g>
}
function Bulb() {
  return <WsDiagram title="Left: a thermometer in a beaker of water with its bulb completely under the surface. Right, faded: a thermometer with its bulb in the air above the water, which is wrong.">
    <Beaker x={190} y={258} w={130} h={124} level={0.72} />
    <Thermometer x={190} y={228} top={40} level={120} />
    <Tick x={120} y={286} s={0.8} />
    <Lines x={136} y={291} lines={['in the liquid']} size={13} colour={tones.good.text} />
    <Lines x={272} y={100} lines={['bulb completely', 'under the surface']} size={15} colour={tones.mark.text} />
    <Leader from={[290, 122]} to={[200, 222]} colour={tones.mark.line} />
    <Beaker x={460} y={258} w={80} h={90} level={0.5} dim />
    <Thermometer x={460} y={150} top={30} level={112} w={10} dim />
    <Cross x={400} y={286} s={0.75} />
    <Lines x={414} y={291} lines={['bulb in the air']} size={13} colour={tones.bad.text} />
    <Bench x1={100} x2={500} y={260} />
  </WsDiagram>
}
function ThermoRead() {
  const x = 250, top = 20, base = 270, per = 20
  const tempY = (t: number) => r1(250 - (t - 20) * per)
  return <WsDiagram title="A close-up of a thermometer scale from 20 to 30 °C. The red thread stops at 24 °C. An eye level with the top of the thread reads it; the reading is taken once it stops changing.">
    <path d={`M${x - 14} ${base}V${top + 14}A14 14 0 0 1 ${x + 14} ${top + 14}V${base}`} fill="#fbfdfe" stroke={W.glassLine} strokeWidth="2.4" />
    <path d={`M${x} ${base}V${tempY(24)}`} stroke={thread} strokeWidth="6" />
    {Array.from({ length: 11 }, (_, i) => {
      const t = 20 + i, yy = tempY(t), major = t % 5 === 0
      return <g key={t}>
        <path d={`M${x + 14} ${yy}h${major ? 18 : 10}`} stroke={ink} strokeWidth={major ? 2 : 1.4} />
        {major && <text x={x + 40} y={yy + 5} fontSize="14" fontWeight="700" fill={ink}>{t}</text>}
      </g>
    })}
    <text x={x + 40} y={tempY(30) - 22} fontSize="13" fontWeight="700" fill={muted}>°C</text>
    <Eye x={110} y={tempY(24)} look={0} />
    <Sight from={[132, tempY(24)]} to={[x - 18, tempY(24)]} tone="mark" />
    <Lines x={110} y={tempY(24) + 40} anchor="middle" lines={['eye level']} size={14} />
    <Tag x={x + 90} y={tempY(24)} text="24 °C" tone="mark" size={14} strong />
    <Lines x={360} y={200} lines={['wait until the', 'reading stops', 'changing']} size={14} weight={650} colour={muted} />
  </WsDiagram>
}

function Timing() {
  return <WsDiagram title="Left: the stopwatch starts at the exact moment a marble chip is dropped into acid. Right: it stops at the exact moment the fizzing ends.">
    <Panel x={14} y={16} w={250} h={270} />
    <Panel x={276} y={16} w={250} h={270} />
    <TestTube x={90} y={236} w={36} h={120} level={0.5} fill={sol.fill} line={sol.line} />
    <Chips cx={90} base={104} n={1} spread={10} size={1.1} />
    <Arrow from={[90, 60]} to={[90, 84]} width={2.2} colour={muted} />
    <Stopwatch x={196} y={126} r={30} reading="0.0 s" tone="mark" />
    <Tag x={196} y={58} text="start" size={13} />
    <Lines x={139} y={262} anchor="middle" lines={['at the exact moment', 'you mix']} size={13} />
    <TestTube x={352} y={236} w={36} h={120} level={0.5} fill={sol.fill} line={sol.line} />
    <Bubbles pts={[[348, 220], [356, 206]]} r={2.6} />
    <Stopwatch x={458} y={126} r={30} reading="45 s" />
    <Tag x={458} y={58} text="stop" size={13} />
    <Lines x={401} y={262} anchor="middle" lines={['at the exact moment', 'the fizzing ends']} size={13} />
  </WsDiagram>
}

export function WsLengthVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wslength-eureka-can': return <Eureka stage="can" />
    case 'wslength-eureka-level': return <Eureka stage="level" />
    case 'wslength-eureka-object': return <Eureka stage="object" />
    case 'wslength-eureka-read': return <Eureka stage="read" />
    case 'wslength-rulers': return <Rulers />
    case 'wslength-eyelevel': return <EyeLevel />
    case 'wslength-marker': return <Marker />
    case 'wslength-ten': return <TenSeeds />
    case 'wslength-worked-ten': return <TenSeeds worked />
    case 'wslength-protractor': return <Protractor />
    case 'wslength-q-protractor': return <QProtractor />
    case 'wslength-thermometer-bulb': return <Bulb />
    case 'wslength-thermometer-read': return <ThermoRead />
    case 'wslength-stopwatch': return <Timing />
    default: return null
  }
}

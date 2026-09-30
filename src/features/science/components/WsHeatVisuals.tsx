import type { ReactNode } from 'react'
import { WsDiagram, Tag, Tick, Cross, Arrow, Numbered, NumberLine, numberScale, Bench, Beaker, TestTube, rubber, tones, wsPalette as W, ink, muted, r1, faded } from './WsKit'
import { Lines, Leader } from './PhysicsKit'
import { Flask } from './GasRateVisuals'

/*
 * Working Scientifically Lesson 19: Heating substances safely. Original, code-native schematics.
 * Every focus id here starts with 'wsheat-' and is routed from CellBiologyVisuals.tsx.
 *
 * One Bunsen burner (on a heat-proof mat, hose to the gas tap) is reused through the burner walkthrough; the air hole
 * is a dark slot in the collar when open and hidden when closed. Flames: yellow = the visible, cooler flame; blue with
 * a darker inner cone = the hotter flame. Water baths are blue, hot plates glow soft red.
 */

const flameY = { fill: '#fde8a8', core: '#f9c46b', line: '#d99a1c' }
const flameB = { fill: '#dbe9fb', core: '#9cc2f0', line: '#4f86d0', coreLine: '#3a6fbd' }
const mat = { fill: '#efe6d6', line: '#b3a384' }
const hot = { fill: '#f7c9bb', line: '#c9573f' }

type Flame = 'none' | 'yellow' | 'blue' | 'low'

/** A flame standing on (x, y), the top of the chimney. */
function FlameShape({ x, y, kind }: { x: number; y: number; kind: Flame }) {
  if (kind === 'none') return null
  if (kind === 'yellow') {
    const h = 100, w = 15
    const d = `M${x - w} ${y}C${x - w - 5} ${y - h * 0.35} ${x - 6} ${y - h * 0.55} ${x - 3} ${y - h * 0.8}C${x - 1} ${y - h * 0.92} ${x + 4} ${y - h} ${x + 3} ${y - h}C${x + 11} ${y - h * 0.72} ${x + w + 6} ${y - h * 0.45} ${x + w} ${y}Q${x} ${y + 3} ${x - w} ${y}Z`
    return <g>
      <path d={d} fill={flameY.fill} stroke={flameY.line} strokeWidth="2" />
      <path d={`M${x - 7} ${y}C${x - 9} ${y - 24} ${x - 2} ${y - 38} ${x} ${y - 50}C${x + 4} ${y - 36} ${x + 9} ${y - 22} ${x + 7} ${y}Z`} fill={flameY.core} opacity=".8" />
    </g>
  }
  const h = kind === 'low' ? 42 : 76, w = kind === 'low' ? 10 : 13, ih = kind === 'low' ? 20 : 36, iw = kind === 'low' ? 6 : 8
  const drop = (hh: number, ww: number) => `M${x - ww} ${y}C${x - ww} ${y - hh * 0.45} ${x - ww * 0.3} ${y - hh * 0.75} ${x} ${y - hh}C${x + ww * 0.3} ${y - hh * 0.75} ${x + ww} ${y - hh * 0.45} ${x + ww} ${y}Q${x} ${y + 3} ${x - ww} ${y}Z`
  return <g>
    <path d={drop(h, w)} fill={flameB.fill} stroke={flameB.line} strokeWidth="2" />
    <path d={drop(ih, iw)} fill={flameB.core} stroke={flameB.coreLine} strokeWidth="1.6" />
  </g>
}

/** The heat-proof mat, top edge at y. */
function Mat({ x, y, w = 128 }: { x: number; y: number; w?: number }) {
  return <rect x={x - w / 2} y={y} width={w} height={11} rx="3.5" fill={mat.fill} stroke={mat.line} strokeWidth="1.8" />
}
/** A gas tap on the bench at (x, y); `on` turns the lever along the pipe. */
function GasTap({ x, y, on = false }: { x: number; y: number; on?: boolean }) {
  return <g>
    <path d={`M${x - 14} ${y}V${y - 26}Q${x - 14} ${y - 32} ${x - 8} ${y - 32}H${x + 8}Q${x + 14} ${y - 32} ${x + 14} ${y - 26}V${y}Z`} fill={W.metal} stroke={W.metalLine} strokeWidth="2" />
    <rect x={x + 14} y={y - 22} width={16} height={8} rx="2" fill={W.metal} stroke={W.metalLine} strokeWidth="1.8" />
    {on ? <rect x={x - 4} y={y - 58} width={8} height={28} rx="3" fill="#f0c24a" stroke="#b08a1c" strokeWidth="1.8" />
      : <rect x={x - 22} y={y - 38} width={30} height={8} rx="3" fill="#f0c24a" stroke="#b08a1c" strokeWidth="1.8" />}
  </g>
}

/**
 * A Bunsen burner standing on a mat whose top is at y, with a rubber hose running left to a gas tap at tapX.
 * Returns the burner; `top` (chimney top) is y − 120.
 */
function Bunsen({ x, y, hole = 'closed', flame = 'none', tapX, tapOn = false, dim = false }: { x: number; y: number; hole?: 'open' | 'closed'; flame?: Flame; tapX?: number; tapOn?: boolean; dim?: boolean }) {
  const top = y - 120
  return <g opacity={dim ? faded : 1}>
    <Mat x={x} y={y} />
    {tapX !== undefined && <g>
      <GasTap x={tapX} y={y + 11} on={tapOn} />
      <path d={`M${x - 42} ${y - 10}C${x - 70} ${y - 10} ${x - 70} ${y - 11} ${x - 86} ${y - 4}S${tapX + 60} ${y - 18} ${tapX + 30} ${y - 7}`} fill="none" stroke={rubber.line} strokeWidth="10" />
      <path d={`M${x - 42} ${y - 10}C${x - 70} ${y - 10} ${x - 70} ${y - 11} ${x - 86} ${y - 4}S${tapX + 60} ${y - 18} ${tapX + 30} ${y - 7}`} fill="none" stroke={rubber.fill} strokeWidth="6" />
    </g>}
    <rect x={x - 44} y={y - 14} width={36} height={9} rx="3" fill={W.metal} stroke={W.metalLine} strokeWidth="1.8" />
    <path d={`M${x - 36} ${y}Q${x - 34} ${y - 17} ${x - 13} ${y - 19}H${x + 13}Q${x + 34} ${y - 17} ${x + 36} ${y}Z`} fill="#c3ced7" stroke={W.metalLine} strokeWidth="2" />
    <rect x={x - 8} y={top} width={16} height={104} rx="2.5" fill={W.metal} stroke={W.metalLine} strokeWidth="2" />
    <path d={`M${x - 3} ${top + 8}V${y - 60}`} stroke="white" strokeWidth="2.4" opacity=".8" />
    <rect x={x - 12} y={y - 54} width={24} height={20} rx="4" fill="#d3dbe2" stroke={W.metalLine} strokeWidth="2" />
    {hole === 'open' ? <ellipse cx={x} cy={y - 44} rx={5} ry={6} fill="#34495a" /> : <path d={`M${x - 6} ${y - 44}H${x + 6}`} stroke={W.metalLine} strokeWidth="1.6" />}
    <rect x={x - 10} y={top - 3} width={20} height={6} rx="2" fill={W.metal} stroke={W.metalLine} strokeWidth="1.8" />
    <FlameShape x={x} y={top - 3} kind={flame} />
  </g>
}

/** A lit wooden splint from `hand` to `tip`. */
function Splint({ hand, tip }: { hand: [number, number]; tip: [number, number] }) {
  return <g>
    <path d={`M${hand[0]} ${hand[1]}L${tip[0]} ${tip[1]}`} stroke="#a57a43" strokeWidth="7" />
    <path d={`M${hand[0]} ${hand[1]}L${tip[0]} ${tip[1]}`} stroke="#ecd2a6" strokeWidth="4" />
    <path d={`M${tip[0] - 6} ${tip[1] + 2}C${tip[0] - 9} ${tip[1] - 10} ${tip[0] - 2} ${tip[1] - 16} ${tip[0] - 1} ${tip[1] - 24}C${tip[0] + 6} ${tip[1] - 14} ${tip[0] + 9} ${tip[1] - 6} ${tip[0] + 5} ${tip[1] + 3}Z`} fill={flameY.fill} stroke={flameY.line} strokeWidth="1.8" />
  </g>
}
/** A circled step number. */
function Step({ n, x, y, active = true }: { n: number; x: number; y: number; active?: boolean }) {
  return <g opacity={active ? 1 : faded}>
    <circle cx={x} cy={y} r="12" fill={tones.mark.fill} stroke={tones.mark.line} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="13.5" fontWeight="750" fill={tones.mark.text}>{n}</text>
  </g>
}
function StepRow({ n, x, y, lines, active = true }: { n: number; x: number; y: number; lines: string[]; active?: boolean }) {
  return <g opacity={active ? 1 : faded}>
    <Step n={n} x={x} y={y} />
    <Lines x={x + 20} y={y + 5} lines={lines} size={14} />
  </g>
}

/* ---------- Section 2: the Bunsen burner ---------- */

const BX = 250, BY = 244, TOP = BY - 120
function Setup() {
  return <WsDiagram title="A Bunsen burner standing on a heat-proof mat. A rubber tube joins it to the gas tap. The air hole on the collar is closed.">
    <Bench x1={20} x2={520} y={BY + 11} />
    <Bunsen x={BX} y={BY} tapX={70} />
    <Lines x={346} y={BY - 40} lines={['hole closed']} size={15} />
    <Leader from={[342, BY - 44]} to={[BX + 12, BY - 44]} />
    <Lines x={346} y={BY + 2} lines={['heat-proof mat']} size={15} />
    <Leader from={[342, BY - 2]} to={[BX + 58, BY + 5]} />
    <Lines x={70} y={BY - 80} anchor="middle" lines={['gas tap']} size={15} />
    <Leader from={[70, BY - 72]} to={[70, BY - 36]} />
    <Lines x={BX} y={TOP - 30} anchor="middle" lines={['Bunsen burner']} size={15} colour={muted} />
  </WsDiagram>
}
function Light() {
  return <WsDiagram title="Lighting a Bunsen burner. Step 1: a lit splint is held over the top of the burner. Step 2: the gas tap is turned on. The burner lights with a yellow flame.">
    <Bench x1={20} x2={520} y={BY + 11} />
    <Bunsen x={BX} y={BY} tapX={70} flame="yellow" tapOn />
    <Splint hand={[430, 96]} tip={[BX + 14, TOP - 4]} />
    <StepRow n={1} x={350} y={64} lines={['light the', 'splint first']} />
    <StepRow n={2} x={96} y={148} lines={['then turn', 'on the gas']} />
    <Leader from={[92, 176]} to={[72, BY - 44]} />
    <Tag x={BX - 92} y={60} text="yellow flame" tone="mark" size={13} />
  </WsDiagram>
}
function BlueFlame() {
  return <WsDiagram title="The air hole is open and the flame is blue, with a darker inner cone. The hottest part of the flame is just above the tip of the inner cone.">
    <Bench x1={20} x2={520} y={BY + 11} />
    <Bunsen x={BX} y={BY} tapX={70} flame="blue" hole="open" tapOn />
    <Arrow from={[BX + 58, BY - 44]} to={[BX + 16, BY - 44]} colour={flameB.line} width={2.4} />
    <Lines x={BX + 64} y={BY - 39} lines={['air in']} size={13} weight={650} colour={flameB.line} />
    <Lines x={352} y={BY - 76} lines={['hole open']} size={15} />
    <Leader from={[348, BY - 80]} to={[BX + 10, BY - 50]} />
    <circle cx={BX} cy={TOP - 44} r="5" fill="white" stroke={hot.line} strokeWidth="2.6" />
    <Lines x={352} y={TOP - 40} lines={['hottest part:', 'just above the', 'blue cone']} size={14} colour={hot.line} />
    <Leader from={[348, TOP - 45]} to={[BX + 7, TOP - 44]} colour={hot.line} />
    <Tag x={140} y={50} text="blue flame: hotter" tone="change" size={14} strong />
  </WsDiagram>
}
function YellowFlame() {
  return <WsDiagram title="The air hole is closed and the flame is large and yellow. It is cooler, and it is easy to see, so no one walks into it.">
    <Bench x1={20} x2={520} y={BY + 11} />
    <Bunsen x={BX} y={BY} tapX={70} flame="yellow" tapOn />
    <Lines x={352} y={BY - 40} lines={['hole closed']} size={15} />
    <Leader from={[348, BY - 44]} to={[BX + 12, BY - 44]} />
    <Tag x={410} y={70} text="yellow flame" tone="mark" size={14} strong />
    <Lines x={410} y={104} anchor="middle" lines={['easy to see']} size={14} colour={tones.mark.text} />
    <Lines x={140} y={56} anchor="middle" lines={['not heating anything?', 'close the hole']} size={14} weight={650} colour={muted} />
  </WsDiagram>
}

/* ---------- Section 3: holding what you heat ---------- */

/** Metal tongs gripping at `at`, the handles running off to the right. */
function Tongs({ at, len = 150, angle = -10 }: { at: [number, number]; len?: number; angle?: number }) {
  return <g transform={`translate(${at[0]} ${at[1]}) rotate(${angle})`}>
    <path d={`M-4 -15Q10 -15 16 -8L${len} -6`} fill="none" stroke={W.metalLine} strokeWidth="5" />
    <path d={`M-4 15Q10 15 16 8L${len} 6`} fill="none" stroke={W.metalLine} strokeWidth="5" />
    <path d={`M-4 -15Q10 -15 16 -8L${len} -6`} fill="none" stroke={W.metal} strokeWidth="2" />
    <path d={`M-4 15Q10 15 16 8L${len} 6`} fill="none" stroke={W.metal} strokeWidth="2" />
    <path d={`M${len - 36} -6.5L${len} -6M${len - 36} 6.5L${len} 6`} stroke="#8aa0b0" strokeWidth="7" />
    <circle cx={len} cy={0} r="7" fill={W.metal} stroke={W.metalLine} strokeWidth="2" />
  </g>
}
function TongsFrame() {
  const bx = 180, top = BY - 120
  // The tube's bottom sits just above the blue cone tip; it leans right so its mouth points away.
  const base: [number, number] = [bx, top - 42], a = 62, h = 100
  const mouth: [number, number] = [r1(base[0] + Math.sin(a * Math.PI / 180) * (h - 30)), r1(base[1] - Math.cos(a * Math.PI / 180) * (h - 30))]
  return <WsDiagram title="A small test tube of liquid held near its top with metal tongs. The bottom of the tube is in the blue flame, just above the inner cone.">
    <Bench x1={20} x2={520} y={BY + 11} />
    <Bunsen x={bx} y={BY} flame="blue" hole="open" />
    <g transform={`rotate(${a} ${base[0]} ${base[1]})`}>
      <TestTube x={base[0]} y={base[1]} w={24} h={h} level={0.3} />
    </g>
    <Tongs at={mouth} len={170} angle={24} />
    <Lines x={392} y={52} lines={['tongs, near', 'the top']} size={15} />
    <Leader from={[400, 60]} to={[r1(mouth[0] + 90), r1(mouth[1] + 40)]} />
    <Lines x={392} y={180} lines={['bottom just above', 'the blue cone']} size={14} weight={650} colour={muted} />
    <Leader from={[388, 176]} to={[bx + 12, top - 52]} colour={muted} />
    <Lines x={72} y={78} anchor="middle" lines={['keep fingers', 'away from', 'the heat']} size={14} weight={650} colour={muted} />
  </WsDiagram>
}

/** A tripod standing on the bench at `ground` with a gauze on top at `g`. */
function Tripod({ x, g, ground, w = 150 }: { x: number; g: number; ground: number; w?: number }) {
  return <g>
    <path d={`M${x} ${g + 6}L${x + 6} ${ground}`} stroke={W.metalLine} strokeWidth="4" opacity=".45" />
    <path d={`M${x - w / 2 + 12} ${g + 5}L${x - w / 2 - 4} ${ground}M${x + w / 2 - 12} ${g + 5}L${x + w / 2 + 4} ${ground}`} stroke={W.metalLine} strokeWidth="5" />
    <rect x={x - w / 2 + 6} y={g + 2} width={w - 12} height={6} rx="3" fill={W.metal} stroke={W.metalLine} strokeWidth="1.8" />
  </g>
}
function Gauze({ x, y, w = 164, dim = false }: { x: number; y: number; w?: number; dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <rect x={x - w / 2} y={y - 4} width={w} height={6} rx="2" fill="#e9eef2" stroke={W.metalLine} strokeWidth="1.6" />
    {Array.from({ length: Math.floor(w / 8) }, (_, i) => <path key={i} d={`M${x - w / 2 + 4 + i * 8} ${y - 4}v6`} stroke={W.metalLine} strokeWidth="0.9" />)}
    <rect x={x - 30} y={y - 4.5} width={60} height={7} rx="3" fill="#d4d9dd" stroke={W.metalLine} strokeWidth="1.4" />
  </g>
}
function TripodFrame() {
  const bx = 190, g = BY - 146
  return <WsDiagram title="A beaker of water on a gauze, on a tripod over a Bunsen burner. Step 1: put the tripod and gauze over the burner. Step 2: light the burner. Step 3: put the beaker on the gauze.">
    <Bench x1={20} x2={520} y={BY + 11} />
    <Tripod x={bx} g={g} ground={BY + 11} />
    <Bunsen x={bx} y={BY} flame="low" hole="open" />
    <Gauze x={bx} y={g} />
    <Beaker x={bx} y={g - 4} w={84} h={78} level={0.55} />
    <StepRow n={1} x={346} y={82} lines={['tripod and gauze']} />
    <StepRow n={2} x={346} y={132} lines={['light the burner']} />
    <StepRow n={3} x={346} y={182} lines={['beaker on the gauze']} />
    <Tag x={420} y={238} text="set up before lighting" tone="mark" size={13} strong />
    <Lines x={60} y={g + 4} anchor="middle" lines={['gauze']} size={14} />
    <Leader from={[84, g]} to={[bx - 72, g - 1]} />
    <Lines x={60} y={g + 70} anchor="middle" lines={['tripod']} size={14} />
    <Leader from={[84, g + 66]} to={[bx - 69, g + 60]} />
  </WsDiagram>
}

/** A small reagent bottle with a flammable hazard sign. */
function Bottle({ x, y, label }: { x: number; y: number; label: string }) {
  return <g>
    <rect x={x - 10} y={y - 104} width={20} height={16} rx="3" fill="#8d6a4b" stroke="#6b4f37" strokeWidth="1.8" />
    <path d={`M${x - 9} ${y - 88}V${y - 80}Q${x - 36} ${y - 74} ${x - 36} ${y - 58}V${y - 6}Q${x - 36} ${y} ${x - 30} ${y}H${x + 30}Q${x + 36} ${y} ${x + 36} ${y - 6}V${y - 58}Q${x + 36} ${y - 74} ${x + 9} ${y - 80}V${y - 88}Z`} fill={W.glass} stroke={W.glassLine} strokeWidth="2.2" />
    <path d={`M${x - 34} ${y - 40}H${x + 34}V${y - 6}Q${x + 34} ${y - 2} ${x + 30} ${y - 2}H${x - 30}Q${x - 34} ${y - 2} ${x - 34} ${y - 6}Z`} fill={W.water} opacity=".5" />
    <rect x={x - 28} y={y - 66} width={56} height={20} rx="3" fill="white" stroke={W.glassLine} strokeWidth="1.4" />
    <text x={x} y={y - 52} textAnchor="middle" fontSize="12" fontWeight="750" fill={ink}>{label}</text>
    <g transform={`translate(${x} ${y - 22})`}>
      <path d="M0 -13L13 0L0 13L-13 0Z" fill="white" stroke="#c9412f" strokeWidth="2.4" />
      <path d="M-4 6C-6 1 -1 -2 0 -7C2 -3 5 0 4 6Z" fill={ink} />
    </g>
  </g>
}
/** A small water bath with a flask in it; (x, y) is the middle of its base. */
function MiniBath({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x - 62} y={y - 74} width={124} height={74} rx="10" fill={W.metal} stroke={W.metalLine} strokeWidth="2" />
    <rect x={x - 54} y={y - 66} width={108} height={40} rx="5" fill="#eef6fb" stroke={W.metalLine} strokeWidth="1.4" />
    <rect x={x - 53} y={y - 56} width={106} height={29} rx="4" fill={W.water} />
    <Flask cx={x - 6} base={y - 28} h={62} w={46} level={18} />
    <circle cx={x + 36} cy={y - 13} r="7" fill="white" stroke={ink} strokeWidth="1.8" />
    <path d={`M${x + 36} ${y - 13}l3 -5`} stroke={ink} strokeWidth="2" />
  </g>
}
function Flammable() {
  return <WsDiagram title="Left: a bottle of ethanol, which is flammable, next to a lit Bunsen burner: crossed out, because the flame could set it alight. Right: the ethanol warmed in a water bath instead: ticked.">
    <Bench x1={20} x2={250} y={BY + 11} />
    <Bench x1={290} x2={520} y={BY + 11} />
    <Bunsen x={82} y={BY} flame="blue" hole="open" />
    <Bottle x={190} y={BY} label="ethanol" />
    <Cross x={190} y={52} s={1.1} />
    <Lines x={190} y={88} anchor="middle" lines={['never near', 'a flame']} size={14} colour={tones.bad.text} />
    <MiniBath x={405} y={BY + 10} />
    <Tick x={405} y={52} s={1.1} />
    <Lines x={405} y={88} anchor="middle" lines={['use a water bath', 'or electric heater']} size={14} colour={tones.good.text} />
    <path d="M270 40V270" stroke={W.panelLine} strokeWidth="1.6" strokeDasharray="4 6" />
  </WsDiagram>
}

/* ---------- Section 4: set temperatures ---------- */

/** A water bath: a metal tank with a clear window showing the water; a control panel with a dial at the front. */
function WaterBath({ x, y, w = 250, water = 0.62, flaskUp = 0, reading = '40 °C', children }: { x: number; y: number; w?: number; water?: number; flaskUp?: number; reading?: string; children?: ReactNode }) {
  const top = y - 150, tankTop = top + 12, tankBot = y - 44, surf = r1(tankBot - (tankBot - tankTop) * water)
  void flaskUp
  return <g>
    <rect x={x - w / 2} y={top} width={w} height={150} rx="14" fill={W.metal} stroke={W.metalLine} strokeWidth="2.2" />
    <rect x={x - w / 2 + 10} y={tankTop} width={w - 20} height={tankBot - tankTop} rx="8" fill="#f3f8fb" stroke={W.metalLine} strokeWidth="1.6" />
    <path d={`M${x - w / 2 + 11} ${surf}H${x + w / 2 - 11}V${tankBot - 6}Q${x + w / 2 - 11} ${tankBot - 1} ${x + w / 2 - 17} ${tankBot - 1}H${x - w / 2 + 17}Q${x - w / 2 + 11} ${tankBot - 1} ${x - w / 2 + 11} ${tankBot - 6}Z`} fill={W.water} opacity=".85" />
    <path d={`M${x - w / 2 + 11} ${surf}H${x + w / 2 - 11}`} stroke={W.waterLine} strokeWidth="2" />
    {children}
    <rect x={x + w / 2 - 104} y={y - 34} width={56} height={22} rx="5" fill="#26394a" />
    <text x={x + w / 2 - 76} y={y - 18} textAnchor="middle" fontSize="13" fontWeight="700" fill="#bff0c9" fontFamily="ui-monospace, monospace">{reading}</text>
    <circle cx={x + w / 2 - 26} cy={y - 23} r="12" fill="white" stroke={ink} strokeWidth="2" />
    <path d={`M${x + w / 2 - 26} ${y - 23}l5 -8`} stroke={hot.line} strokeWidth="2.6" />
  </g>
}
const WB = { x: 210, y: 262, w: 250 }
function BathFrame() {
  const tankBot = WB.y - 44
  return <WsDiagram title="A water bath: a tank of water heated to a set temperature. A flask with the reaction mixture stands in the water, and a dial at the front sets the temperature.">
    <WaterBath x={WB.x} y={WB.y} w={WB.w}>
      <Flask cx={WB.x - 24} base={tankBot - 2} h={96} w={70} level={30} />
    </WaterBath>
    <Lines x={392} y={60} lines={['reaction', 'container']} size={15} />
    <Leader from={[388, 66]} to={[WB.x - 6, tankBot - 70]} />
    <Lines x={392} y={150} lines={['water all round', 'heats it evenly']} size={14} weight={650} colour={W.waterLine} />
    <Lines x={392} y={236} lines={['temperature', 'control']} size={15} />
    <Leader from={[388, 238]} to={[WB.x + WB.w / 2 - 14, WB.y - 23]} />
    <Tag x={WB.x} y={70} text="water bath" tone="change" size={14} strong />
  </WsDiagram>
}
function BathSteps() {
  const tankBot = WB.y - 44, fx = WB.x - 24
  return <WsDiagram title="Using a water bath. Step 1: set the temperature. Step 2: let the water heat up. Step 3: lower the container in with tongs. The water outside is just above the level of the substance inside.">
    <WaterBath x={WB.x} y={WB.y} w={WB.w} reading="40 °C">
      <Flask cx={fx} base={tankBot - 2} h={96} w={70} level={30} />
    </WaterBath>
    <Tongs at={[fx, tankBot - 86]} len={120} angle={-150} />
    <path d={`M${fx + 30} ${tankBot - 33}H${WB.x + WB.w / 2 - 12}`} stroke={W.waterLine} strokeWidth="1.8" strokeDasharray="4 4" />
    <Lines x={372} y={224} lines={['water outside just', 'above the substance']} size={14} colour={W.waterLine} />
    <Leader from={[368, 222]} to={[WB.x + WB.w / 2 - 14, tankBot - 50]} colour={W.waterLine} />
    <StepRow n={1} x={372} y={50} lines={['set the', 'temperature']} />
    <StepRow n={2} x={372} y={104} lines={['let the water', 'heat up']} />
    <StepRow n={3} x={372} y={158} lines={['lower it in', 'with tongs']} />
  </WsDiagram>
}
function Plate() {
  const px = 200, py = 250
  return <WsDiagram title="An electric heater with a hot plate set to a chosen temperature. A beaker of liquid stands on the plate, and a glass rod stirs it so it heats evenly.">
    <Bench x1={40} x2={500} y={py} />
    <rect x={px - 90} y={py - 58} width={180} height={58} rx="10" fill={W.metal} stroke={W.metalLine} strokeWidth="2.2" />
    <rect x={px - 80} y={py - 68} width={160} height={12} rx="4" fill={hot.fill} stroke={hot.line} strokeWidth="2" />
    <circle cx={px + 56} cy={py - 28} r="13" fill="white" stroke={ink} strokeWidth="2" />
    <path d={`M${px + 56} ${py - 28}l6 -9`} stroke={hot.line} strokeWidth="2.6" />
    <rect x={px - 66} y={py - 40} width={60} height={22} rx="5" fill="#26394a" />
    <text x={px - 36} y={py - 24} textAnchor="middle" fontSize="13" fontWeight="700" fill="#bff0c9" fontFamily="ui-monospace, monospace">150 °C</text>
    <Beaker x={px} y={py - 68} w={92} h={100} level={0.55}>
      <path d={`M${px - 8} ${py - 76}L${px + 26} ${py - 190}`} stroke={W.glassLine} strokeWidth="6" />
      <path d={`M${px - 8} ${py - 76}L${px + 26} ${py - 190}`} stroke="#f3f8fb" strokeWidth="3" />
    </Beaker>
    <path d={`M${px + 26} ${py - 190}L${px + 34} ${py - 216}`} stroke={W.glassLine} strokeWidth="6" />
    <path d={`M${px + 26} ${py - 190}L${px + 34} ${py - 216}`} stroke="#f3f8fb" strokeWidth="3" />
    <Arrow from={[px - 40, py - 104]} to={[px + 40, py - 108]} colour={tones.change.line} width={2.6} bend={-0.35} />
    <Lines x={px - 64} y={py - 134} anchor="end" lines={['stir']} size={16} colour={tones.change.text} />
    <Lines x={372} y={py - 88} lines={['hot plate']} size={15} />
    <Leader from={[368, py - 92]} to={[px + 76, py - 63]} />
    <Lines x={372} y={py - 18} lines={['set temperature']} size={15} />
    <Leader from={[368, py - 22]} to={[px + 70, py - 28]} />
    <Tag x={410} y={52} text="can go above 100 °C" tone="mark" size={13} />
  </WsDiagram>
}
function Limit() {
  const s = numberScale(70, 380, 0, 200), y = 222
  return <WsDiagram schematic={false} title="A temperature scale from 0 to 200 °C. A water bath can only reach up to 100 °C, where water boils. An electric heater can go higher.">
    <NumberLine x={70} y={y} w={380} min={0} max={200} step={25} labels={[0, 50, 100, 150, 200]} unit="°C" />
    <rect x={s(20)} y={y - 52} width={r1(s(100) - s(20))} height={22} rx="11" fill={tones.change.fill} stroke={tones.change.line} strokeWidth="2" />
    <Lines x={r1((s(20) + s(100)) / 2)} y={y - 36} anchor="middle" lines={['water bath']} size={13} colour={tones.change.text} />
    <rect x={s(20)} y={y - 96} width={r1(s(200) - s(20))} height={22} rx="11" fill={hot.fill} stroke={hot.line} strokeWidth="2" />
    <Lines x={r1((s(100) + s(200)) / 2)} y={y - 80} anchor="middle" lines={['electric heater: higher']} size={13} colour={hot.line} />
    <path d={`M${s(100)} ${y + 4}V${y - 130}`} stroke={tones.change.line} strokeWidth="2.4" strokeDasharray="6 5" />
    <Tag x={s(100)} y={y - 146} text="water boils at 100 °C" tone="change" size={14} strong />
    <Lines x={270} y={282} anchor="middle" lines={['temperature']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}

/* ---------- On your own ---------- */

function QBurner({ assessment }: { assessment: boolean }) {
  return <WsDiagram title={assessment ? 'A Bunsen burner with four numbered parts.' : 'A Bunsen burner. Part 1 is the air hole on the collar, part 2 is the chimney, part 3 is the gas inlet and part 4 is the heat-proof mat.'}>
    <Bench x1={20} x2={520} y={BY + 11} />
    <Bunsen x={BX} y={BY} tapX={70} />
    <Numbered n={1} at={[372, BY - 60]} to={[BX + 12, BY - 44]} />
    <Numbered n={2} at={[372, TOP + 10]} to={[BX + 8, TOP + 30]} />
    <Numbered n={3} at={[150, BY - 90]} to={[BX - 36, BY - 10]} />
    <Numbered n={4} at={[372, BY + 2]} to={[BX + 58, BY + 5]} />
  </WsDiagram>
}

export function WsHeatVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'wsheat-setup': return <Setup />
    case 'wsheat-light': return <Light />
    case 'wsheat-blue': return <BlueFlame />
    case 'wsheat-yellow': return <YellowFlame />
    case 'wsheat-tongs': return <TongsFrame />
    case 'wsheat-tripod': return <TripodFrame />
    case 'wsheat-flammable': return <Flammable />
    case 'wsheat-bath': return <BathFrame />
    case 'wsheat-bathsteps': return <BathSteps />
    case 'wsheat-plate': return <Plate />
    case 'wsheat-limit': return <Limit />
    case 'wsheat-q-burner': return <QBurner assessment={assessment} />
    default: return null
  }
}

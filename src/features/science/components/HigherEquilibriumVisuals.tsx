import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C6, a lesson only some students get (Chemistry Lesson 36H): Le Chatelier's principle. Original, code-native
 * schematics; not to scale. Focus ids start with 'hequil-'.
 *
 * Same visual language as the reversible reactions lesson (ReversibleVisuals.tsx): reactants are soft blue blobs and
 * products soft coral blobs, the ⇌ sign is drawn as two half-arrows, the forward arrow is blue and the backward arrow
 * coral, heat is coral/amber and cooling pale blue, a good result is green. Amber marks what the frame is about; what
 * is not being talked about is faded. Each teaching section keeps one drawing on screen and lights one step at a time;
 * the last frame shows it all. Particle counts stay honest: in the squeezed cylinder, 1 N₂ + 3 H₂ have become 2 NH₃.
 * Question views show only the reaction (molecules or a table), never the direction or the conclusion.
 */
const { ink, muted, protonFill, protonLine, electronLine, panelFill, panelLine, lightIso, darkIso, darkIsoLine } = atomPalette
const rFill = '#d6e9f8', rLine = electronLine, rInk = '#1d5787', rSoft = '#eef6fc'
const pFill = '#fbdcd6', pLine = protonLine, pInk = '#8a332c', pSoft = '#fdf1ee'
const amber = '#d98a1c', amberInk = '#8a5a14', amberSoft = '#fdf0d8'
const coolFill = '#e3f1fb', coolLine = '#7fb3d9', coolInk = '#2f6fa6'
const glass = '#6f8798', glassFill = '#f5fafd'
const faded = 0.28

function Diagram({ title, children, h = 320 }: { title: string; children: ReactNode; h?: number }) {
  const id = useId()
  return <div className="science-bio-model"><svg viewBox={`0 0 600 ${h}`} role="img" aria-labelledby={id}><title id={id}>{`${title} Original schematic, not to scale.`}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function T({ x, y, children, size = 14, bold = false, colour = ink, anchor = 'middle' }: { x: number; y: number; children: ReactNode; size?: number; bold?: boolean; colour?: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} fontSize={size} fontWeight={bold ? 700 : 400} fill={colour} textAnchor={anchor}>{children}</text>
}

// ---------- Pieces ----------
/** A soft, slightly irregular blob with a label: reactants blue, products coral. */
function Blob({ x, y, label, side, r = 15, ring = false }: { x: number; y: number; label: string; side: 'r' | 'p'; r?: number; ring?: boolean }) {
  const k = r / 15
  const d = `M${x} ${y - 15 * k}C${x + 9 * k} ${y - 15.5 * k} ${x + 15.5 * k} ${y - 8 * k} ${x + 15 * k} ${y + 1 * k}C${x + 14.5 * k} ${y + 10 * k} ${x + 8 * k} ${y + 15 * k} ${x - 1 * k} ${y + 15 * k}C${x - 10 * k} ${y + 15 * k} ${x - 15.5 * k} ${y + 8 * k} ${x - 15 * k} ${y - 1 * k}C${x - 14.5 * k} ${y - 10 * k} ${x - 8 * k} ${y - 14.5 * k} ${x} ${y - 15 * k}Z`
  const size = label.length > 2 ? 12 : Math.max(12, Math.min(15, 14 * k))
  return <g>
    {ring && <circle cx={x} cy={y} r={r + 5} fill="none" stroke={amber} strokeWidth="2.5" strokeDasharray="4 4" />}
    <path d={d} fill={side === 'r' ? rFill : pFill} stroke={side === 'r' ? rLine : pLine} strokeWidth="2" />
    <T x={x} y={y + size * .36} size={size} bold colour={side === 'r' ? rInk : pInk}>{label}</T>
  </g>
}
/** Quadratic arrow from (x1,y1) via (cx,cy) to (x2,y2). */
function QArrow({ x1, y1, cx, cy, x2, y2, c = ink, w = 3, dash }: { x1: number; y1: number; cx: number; cy: number; x2: number; y2: number; c?: string; w?: number; dash?: string }) {
  const a = Math.atan2(y2 - cy, x2 - cx), h = 8 + w * 1.5
  const pt = (t: number) => `${(x2 - h * Math.cos(a + t)).toFixed(1)} ${(y2 - h * Math.sin(a + t)).toFixed(1)}`
  const ex = x2 - h * 0.6 * Math.cos(a), ey = y2 - h * 0.6 * Math.sin(a)
  return <g><path d={`M${x1} ${y1}Q${cx} ${cy} ${ex.toFixed(1)} ${ey.toFixed(1)}`} stroke={c} strokeWidth={w} fill="none" strokeDasharray={dash} /><path d={`M${x2} ${y2}L${pt(0.42)}L${pt(-0.42)}Z`} fill={c} stroke={c} strokeWidth="1.2" /></g>
}
const Arrow = ({ x1, y1, x2, y2, c, w }: { x1: number; y1: number; x2: number; y2: number; c?: string; w?: number }) => <QArrow x1={x1} y1={y1} cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} x2={x2} y2={y2} c={c} w={w} />
/** The ⇌ sign drawn as two half-arrows. */
function Harpoons({ x, y, w = 56, c = amber, sw = 3 }: { x: number; y: number; w?: number; c?: string; sw?: number }) {
  return <g stroke={c} strokeWidth={sw} fill="none">
    <path d={`M${x - w / 2} ${y - 5}H${x + w / 2}L${x + w / 2 - 11} ${y - 14}`} />
    <path d={`M${x + w / 2} ${y + 5}H${x - w / 2}L${x - w / 2 + 11} ${y + 14}`} />
  </g>
}
function Plus({ x, y, s = 20 }: { x: number; y: number; s?: number }) { return <T x={x} y={y + s * 0.35} size={s} bold colour={muted}>+</T> }

type L = 'A' | 'B' | 'C' | 'D'
const isR = (l: L) => l === 'A' || l === 'B'
// A sealed conical flask, as in the reversible reactions lesson. Local frame: neck top at (0, 0), base at y = 152.
const SLOTS: [number, number][] = [[-54, 128], [-18, 131], [18, 128], [54, 131], [-34, 94], [2, 97], [38, 93], [2, 62]]
/** Particles for a flask that started with 4 A + 4 B after `x` forward reactions. */
function mix(x: number): L[] {
  const out: L[] = []
  for (let i = 0; i < 4; i++) { out.push(i < 4 - x ? 'A' : 'C'); out.push(i < 4 - x ? 'B' : 'D') }
  return out
}
function Flask({ x, y, parts }: { x: number; y: number; parts: L[] }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-18 0V38C-18 46 -22 50 -30 60L-80 124C-90 138 -82 152 -64 152H64C82 152 90 138 80 124L30 60C22 50 18 46 18 38V0" fill={glassFill} stroke={glass} strokeWidth="3" />
    <path d="M-15 -16Q-16 -20 -12 -20H12Q16 -20 15 -16L13 6Q13 9 10 9H-10Q-13 9 -13 6Z" fill="#b99278" stroke="#7f5f4a" strokeWidth="2" />
    {parts.map((l, i) => <Blob key={i} x={SLOTS[i][0]} y={SLOTS[i][1]} label={l} side={isR(l) ? 'r' : 'p'} />)}
  </g>
}
/** The general equation A + B ⇌ C + D drawn with blobs. */
function Equation({ y, cx = 300, r = 22, gap = 1 }: { y: number; cx?: number; r?: number; gap?: number }) {
  const u = 52 * gap
  return <g>
    <Blob x={cx - 3.3 * u} y={y} label="A" side="r" r={r} /><Plus x={cx - 2.55 * u} y={y} s={Math.max(16, 22 * gap)} /><Blob x={cx - 1.8 * u} y={y} label="B" side="r" r={r} />
    <Harpoons x={cx} y={y} w={62 * gap} />
    <Blob x={cx + 1.8 * u} y={y} label="C" side="p" r={r} /><Plus x={cx + 2.55 * u} y={y} s={Math.max(16, 22 * gap)} /><Blob x={cx + 3.3 * u} y={y} label="D" side="p" r={r} />
  </g>
}
function Thermometer({ x, y, s = 1, level = 'mid' }: { x: number; y: number; s?: number; level?: 'hot' | 'mid' | 'cold' }) {
  const top = { hot: -34, mid: -8, cold: 14 }[level]
  const fill = level === 'cold' ? coolLine : protonFill, line = level === 'cold' ? coolInk : glass
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-7} y={-40} width={14} height={70} rx="7" fill="white" stroke={glass} strokeWidth="2.5" />
    <rect x={-3} y={top} width={6} height={30 - top} fill={fill} />
    <circle cx={0} cy={36} r="11" fill={fill} stroke={line} strokeWidth="2.5" />
    {[-28, -16, -4, 8, 20].map(t => <path key={t} d={`M7 ${t}H12`} stroke={glass} strokeWidth="1.5" />)}
  </g>
}
function Gauge({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="26" fill="white" stroke={glass} strokeWidth="3" /><path d={`M${x - 17} ${y + 7}A18 18 0 0 1 ${x + 17} ${y + 7}`} stroke={panelLine} strokeWidth="4" fill="none" /><path d={`M${x} ${y + 4}L${x + 11} ${y - 12}`} stroke={ink} strokeWidth="3" /><circle cx={x} cy={y + 4} r="4" fill={ink} /></g>
}
function SmallBeaker({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 26} ${y - 26}V${y + 20}Q${x - 26} ${y + 28} ${x - 18} ${y + 28}H${x + 18}Q${x + 26} ${y + 28} ${x + 26} ${y + 20}V${y - 26}`} fill={glassFill} stroke={glass} strokeWidth="2.5" />
    {[[-14, 14], [0, 6], [14, 16], [-8, -6], [10, -2], [-16, 0], [3, 20]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="4" fill={rFill} stroke={rLine} strokeWidth="1.5" />)}</g>
}
/** A signpost pointing left or right, with up to three short lines. */
function Sign({ x, y, w, dir, lines, tone }: { x: number; y: number; w: number; dir: 'r' | 'l'; lines: string[]; tone: 'r' | 'p' }) {
  const h = 22 + lines.length * 18, tip = 22
  const [c, fill, ink2] = tone === 'r' ? [rLine, rSoft, rInk] : [pLine, pSoft, pInk]
  const d = dir === 'r'
    ? `M${x - w / 2} ${y - h / 2 + 6}Q${x - w / 2} ${y - h / 2} ${x - w / 2 + 6} ${y - h / 2}H${x + w / 2 - tip}L${x + w / 2} ${y}L${x + w / 2 - tip} ${y + h / 2}H${x - w / 2 + 6}Q${x - w / 2} ${y + h / 2} ${x - w / 2} ${y + h / 2 - 6}Z`
    : `M${x + w / 2} ${y - h / 2 + 6}Q${x + w / 2} ${y - h / 2} ${x + w / 2 - 6} ${y - h / 2}H${x - w / 2 + tip}L${x - w / 2} ${y}L${x - w / 2 + tip} ${y + h / 2}H${x + w / 2 - 6}Q${x + w / 2} ${y + h / 2} ${x + w / 2} ${y + h / 2 - 6}Z`
  const off = dir === 'r' ? -tip / 3 : tip / 3
  return <g><path d={d} fill={fill} stroke={c} strokeWidth="2" />{lines.map((l, i) => <T key={i} x={x + off} y={y + 5 - (lines.length - 1) * 9 + i * 18} size={14} bold colour={ink2}>{l}</T>)}</g>
}
type Tone = 'hot' | 'plain' | 'r' | 'p' | 'good'
const TONES: Record<Tone, [string, string, string]> = { hot: [amberSoft, amber, amberInk], plain: [panelFill, panelLine, ink], r: [rSoft, rLine, rInk], p: [pSoft, pLine, pInk], good: [lightIso, darkIso, darkIsoLine] }
function Chip({ x, y, w, lines, tone = 'plain', size = 14, h }: { x: number; y: number; w: number; lines: string[]; tone?: Tone; size?: number; h?: number }) {
  const [fill, line, text] = TONES[tone], hh = h ?? 14 + lines.length * (size + 4)
  return <g><rect x={x - w / 2} y={y - hh / 2} width={w} height={hh} rx="12" fill={fill} stroke={line} strokeWidth={tone === 'plain' ? 1.5 : 2} />
    {lines.map((l, i) => <T key={i} x={x} y={y + size * .36 - (lines.length - 1) * (size + 4) / 2 + i * (size + 4)} size={size} bold colour={text}>{l}</T>)}</g>
}
function Num({ n, x, y }: { n: number; x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="12" fill={amber} stroke={amber} strokeWidth="2" /><T x={x} y={y + 5} size={13} bold colour="white">{n}</T></g>
}

// ---------- Section 1: the system pushes back (one flask and a position track) ----------
type PushStage = 'position' | 'sides' | 'conditions' | 'principle' | 'all'
const PUSH_TITLES: Record<PushStage, string> = {
  position: 'A sealed flask at equilibrium holding one A, one B, three C and three D. Beside it, the equation A plus B, reversible arrow, C plus D, and a track from reactants on the left to products on the right. A marker on the track shows the position of equilibrium.',
  sides: 'The same flask and track. The left end of the track is labelled lies to the left: more reactants. The right end is labelled lies to the right: more products. The flask has more products, so this equilibrium lies to the right.',
  conditions: 'The same flask and track, with three tiles: a thermometer for temperature, a gauge for pressure (gases only) and a beaker of particles for concentration. The position of equilibrium depends on these conditions.',
  principle: 'The same flask. An amber arrow labelled change a condition pushes in on the flask. A green arrow labelled the system counteracts the change pushes back. The marker on the track moves. This is Le Chatelier’s principle.',
  all: 'The flask and track with three numbered steps: 1, what has changed? 2, which direction works against it? 3, the equilibrium moves that way. Moving right makes more products; moving left makes more reactants.',
}
function PushScene({ stage }: { stage: PushStage }) {
  const ends = stage === 'sides' || stage === 'all'
  const marker = 500
  return <Diagram title={PUSH_TITLES[stage]} h={320}>
    <Flask x={130} y={70} parts={mix(3)} />
    {stage !== 'principle' && <T x={130} y={252} size={14} colour={muted}>sealed flask at equilibrium</T>}
    <Equation y={50} cx={430} r={16} gap={0.68} />
    {/* position track: reactants (left) to products (right) */}
    <rect x={300} y={113} width={130} height={12} rx="6" fill={rFill} stroke={rLine} strokeWidth="1.5" />
    <rect x={430} y={113} width={130} height={12} rx="6" fill={pFill} stroke={pLine} strokeWidth="1.5" />
    <T x={300} y={146} size={13} bold colour={rInk} anchor="start">{ends ? 'more reactants' : 'reactants'}</T>
    <T x={560} y={146} size={13} bold colour={pInk} anchor="end">{ends ? 'more products' : 'products'}</T>
    {stage === 'principle'
      ? <g>
        <circle cx={marker} cy={119} r="10" fill="white" stroke={amber} strokeWidth="2" strokeDasharray="3 3" />
        <QArrow x1={488} y1={98} cx={512} cy={84} x2={536} y2={102} c={amber} w={2.5} />
        <circle cx={540} cy={119} r="11" fill={amber} stroke="white" strokeWidth="2.5" />
        <T x={430} y={96} size={13} bold colour={amberInk}>position moves</T>
      </g>
      : <g>
        <circle cx={marker} cy={119} r="11" fill={amber} stroke="white" strokeWidth="2.5" />
        <T x={stage === 'position' ? 430 : 500} y={96} size={13} bold colour={amberInk}>{stage === 'position' ? 'position of equilibrium' : 'position'}</T>
      </g>}

    {stage === 'position' && <Chip x={430} y={205} w={280} lines={['the mix when the amounts', 'stop changing']} tone="hot" />}
    {stage === 'sides' && <g>
      <g opacity={0.55}><Chip x={360} y={200} w={136} lines={['lies to the left', 'more reactants']} tone="r" /></g>
      <Chip x={510} y={200} w={136} lines={['lies to the right', 'more products']} tone="p" />
      <path d="M300 128V170" stroke={rLine} strokeWidth="1.5" strokeDasharray="3 4" opacity={0.55} />
      <path d="M560 128V170" stroke={pLine} strokeWidth="1.5" strokeDasharray="3 4" />
      <T x={510} y={260} size={13} colour={muted}>this flask: more C and D</T>
    </g>}
    {stage === 'conditions' && <g>
      {([[322, 'temperature', ''], [430, 'pressure', '(gases only)'], [538, 'concentration', '']] as const).map(([cx, name, sub]) => <g key={name}>
        <rect x={cx - 50} y={168} width={100} height={110} rx="16" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
        <T x={cx} y={sub ? 252 : 260} size={13} bold>{name}</T>
        {sub && <T x={cx} y={268} size={12} colour={muted}>{sub}</T>}
      </g>)}
      <Thermometer x={322} y={204} s={0.7} level="mid" />
      <Gauge x={430} y={206} />
      <SmallBeaker x={538} y={204} />
      <T x={430} y={304} size={14} bold colour={amberInk}>the position depends on the conditions</T>
    </g>}
    {stage === 'principle' && <g>
      <Arrow x1={450} y1={196} x2={232} y2={196} c={amber} w={6} />
      <T x={340} y={182} size={14} bold colour={amberInk}>1  change a condition</T>
      <Arrow x1={232} y1={248} x2={450} y2={248} c={darkIso} w={6} />
      <T x={340} y={276} size={14} bold colour={darkIsoLine}>2  the system counteracts the change</T>
      <Chip x={520} y={222} w={120} lines={['Le Chatelier’s', 'principle']} tone="good" size={13} />
    </g>}
    {stage === 'all' && <g>
      {['What has changed?', 'Which direction works against it?', 'The equilibrium moves that way.'].map((s, i) => <g key={s}>
        <rect x={276} y={172 + i * 44} width={316} height={34} rx="12" fill={i === 2 ? lightIso : panelFill} stroke={i === 2 ? darkIso : panelLine} strokeWidth="1.5" />
        <Num n={i + 1} x={296} y={189 + i * 44} />
        <T x={316} y={194 + i * 44} size={14} bold colour={i === 2 ? darkIsoLine : ink} anchor="start">{s}</T>
      </g>)}
    </g>}
  </Diagram>
}

// ---------- Section 2: temperature (the ammonia equation with its energy arrows) ----------
type TempStage = 'energy' | 'up' | 'down' | 'nh4cl' | 'all'
const TEMP_TITLES: Record<TempStage, string> = {
  energy: 'N₂ + 3H₂, reversible arrow, 2NH₃. The forward arrow above is labelled forward: exothermic, gives out heat. The backward arrow below is labelled backward: endothermic, takes in heat.',
  up: 'The same equation with a hot thermometer. The backward, endothermic arrow is highlighted: the system takes in heat. A signpost points left: the equilibrium moves left, so there is less ammonia.',
  down: 'The same equation with a cold thermometer. The forward, exothermic arrow is highlighted: the system gives out heat. A signpost points right: the equilibrium moves right, so there is more ammonia.',
  nh4cl: 'NH₄Cl, ammonium chloride, reversible arrow, NH₃ plus HCl, ammonia plus hydrogen chloride. Here the forward reaction is endothermic. With a hot thermometer the forward arrow is highlighted and a signpost points right: more NH₃ and HCl.',
  all: 'The ammonia equation with both energy arrows and two rules: hotter moves the equilibrium in the endothermic direction; cooler moves it in the exothermic direction.',
}
function TempScene({ stage }: { stage: TempStage }) {
  const nh4 = stage === 'nh4cl'
  const fwdEndo = nh4
  const hot = stage === 'up' || stage === 'nh4cl', cold = stage === 'down'
  // which arrow is lit: the endothermic one when hot, the exothermic one when cold
  const litFwd = (hot && fwdEndo) || (cold && !fwdEndo)
  const litBack = (hot && !fwdEndo) || (cold && fwdEndo)
  const any = litFwd || litBack
  const fwdLabel = fwdEndo ? ['forward: endothermic', ' (takes in heat)'] : ['forward: exothermic', ' (gives out heat)']
  const backLabel = fwdEndo ? ['backward: exothermic', ' (gives out heat)'] : ['backward: endothermic', ' (takes in heat)']
  const L = nh4 ? 215 : 195, R = nh4 ? 490 : 450
  return <Diagram title={TEMP_TITLES[stage]} h={362}>
    {/* equation */}
    {nh4 ? <g>
      <T x={235} y={174} size={28} bold>NH₄Cl</T>
      <T x={475} y={174} size={28} bold>NH₃ + HCl</T>
      <T x={235} y={198} size={13} colour={muted}>ammonium chloride</T>
      <T x={475} y={198} size={13} colour={muted}>ammonia + hydrogen chloride</T>
    </g> : <g>
      <T x={205} y={174} size={28} bold>N₂ + 3H₂</T>
      <T x={440} y={174} size={28} bold>2NH₃</T>
      <T x={205} y={198} size={13} colour={muted}>nitrogen + hydrogen</T>
      <T x={440} y={198} size={13} colour={muted}>ammonia</T>
    </g>}
    <Harpoons x={335} y={164} w={60} />
    {/* forward (top) and backward (bottom) arrows */}
    <g opacity={any && !litFwd ? faded : 1}>
      <QArrow x1={L} y1={128} cx={335} cy={60} x2={R} y2={128} c={litFwd ? amber : rLine} w={litFwd ? 5 : 3} />
      <text x={335} y={44} fontSize="15" textAnchor="middle" fill={litFwd ? amberInk : rInk}><tspan fontWeight="700">{fwdLabel[0]}</tspan>{fwdLabel[1]}</text>
    </g>
    <g opacity={any && !litBack ? faded : 1}>
      <QArrow x1={R} y1={214} cx={335} cy={282} x2={L} y2={214} c={litBack ? amber : pLine} w={litBack ? 5 : 3} />
      <text x={335} y={290} fontSize="15" textAnchor="middle" fill={litBack ? amberInk : pInk}><tspan fontWeight="700">{backLabel[0]}</tspan>{backLabel[1]}</text>
    </g>
    {/* thermometer */}
    {stage !== 'all' && <g>
      <Thermometer x={62} y={160} s={1.25} level={hot ? 'hot' : cold ? 'cold' : 'mid'} />
      {hot && <T x={62} y={234} size={14} bold colour={pInk}>hotter</T>}
      {cold && <T x={62} y={234} size={14} bold colour={coolInk}>cooler</T>}
    </g>}
    {stage === 'up' && <Sign x={335} y={331} w={330} dir="l" lines={['moves left: less ammonia']} tone="r" />}
    {stage === 'down' && <Sign x={335} y={331} w={330} dir="r" lines={['moves right: more ammonia']} tone="p" />}
    {stage === 'nh4cl' && <Sign x={335} y={331} w={330} dir="r" lines={['moves right: more NH₃ and HCl']} tone="p" />}
    {stage === 'energy' && <T x={335} y={336} size={14} colour={muted}>the two directions have opposite energy changes</T>}
    {stage === 'all' && <g>
      <Chip x={160} y={330} w={272} lines={['hotter → endothermic direction']} tone="p" h={34} />
      <Chip x={448} y={330} w={272} lines={['cooler → exothermic direction']} tone="r" h={34} />
    </g>}
  </Diagram>
}

// ---------- Section 3: pressure and concentration (ammonia counted in gas molecules, over a cylinder of gas) ----------
type PCStage = 'count' | 'pressure' | 'add' | 'remove' | 'all'
const PC_TITLES: Record<PCStage, string> = {
  count: 'N₂(g) + 3H₂(g), reversible arrow, 2NH₃(g), with the molecules drawn underneath: one N₂ and three H₂ on the left, 4 molecules of gas; two NH₃ on the right, 2 molecules of gas. Below, a cylinder of the gas mixture with a piston.',
  pressure: 'The piston is pushed down, raising the pressure. In the smaller space there are now fewer molecules: one N₂ and five NH₃. A signpost points right: the equilibrium moves to the side with fewer gas molecules, so there is more ammonia.',
  add: 'Extra nitrogen molecules are pumped into the cylinder through a pipe. A signpost points right: some nitrogen is used up and more ammonia forms.',
  remove: 'Ammonia molecules leave the cylinder through a pipe. A signpost points right: more ammonia is made to replace it.',
  all: 'The ammonia equation with its gas molecule counts, and four rules: pressure up, to the side with fewer gas molecules; pressure down, to the side with more gas molecules; add a reactant or remove a product, the equilibrium moves right and more products form. If both sides have the same number of gas molecules, pressure has no effect.',
}
type Mol = [number, number, 'N₂' | 'H₂' | 'NH₃']
const GAS: Mol[] = [[118, 310, 'N₂'], [158, 310, 'H₂'], [198, 310, 'NH₃'], [238, 310, 'H₂'], [134, 274, 'NH₃'], [178, 274, 'N₂'], [222, 274, 'H₂'], [178, 240, 'NH₃']]
const SQUEEZED: Mol[] = [[118, 308, 'NH₃'], [158, 308, 'N₂'], [198, 308, 'NH₃'], [238, 308, 'NH₃'], [148, 274, 'NH₃'], [208, 274, 'NH₃']]
function Cylinder({ piston, mols, inlet = false, outlet = false }: { piston: number; mols: Mol[]; inlet?: boolean; outlet?: boolean }) {
  return <g>
    {inlet && <path d="M20 262H90M20 280H90" stroke={glass} strokeWidth="3" />}
    {outlet && <path d="M270 262H332M270 280H332" stroke={glass} strokeWidth="3" />}
    <path d={`M90 168V322Q90 330 98 330H262Q270 330 270 322V168`} fill={glassFill} stroke={glass} strokeWidth="3" />
    {inlet && <path d="M90 263V279" stroke={glassFill} strokeWidth="4" />}
    {outlet && <path d="M270 263V279" stroke={glassFill} strokeWidth="4" />}
    <rect x={94} y={piston} width={172} height={12} rx="4" fill="#c9d3da" stroke={glass} strokeWidth="2" />
    <rect x={174} y={piston - 30} width={12} height={30} fill="#c9d3da" stroke={glass} strokeWidth="2" />
    <rect x={148} y={piston - 40} width={64} height={12} rx="6" fill="#c9d3da" stroke={glass} strokeWidth="2" />
    {mols.map(([x, y, l], i) => <Blob key={i} x={x} y={y} label={l} side={l === 'NH₃' ? 'p' : 'r'} r={16} />)}
  </g>
}
function PCScene({ stage }: { stage: PCStage }) {
  const leftHot = stage === 'count', rightHot = stage === 'count' || stage === 'pressure'
  return <Diagram title={PC_TITLES[stage]} h={350}>
    <T x={175} y={44} size={21} bold>N₂(g) + 3H₂(g)</T>
    <Harpoons x={322} y={36} w={60} />
    <T x={455} y={44} size={21} bold>2NH₃(g)</T>
    <Blob x={112} y={90} label="N₂" side="r" r={17} />
    {[154, 196, 238].map(x => <Blob key={x} x={x} y={90} label="H₂" side="r" r={17} />)}
    {[432, 478].map(x => <Blob key={x} x={x} y={90} label="NH₃" side="p" r={18} />)}
    <Chip x={175} y={133} w={176} lines={['4 molecules of gas']} tone={leftHot ? 'hot' : 'plain'} size={14} h={30} />
    <Chip x={455} y={133} w={176} lines={['2 molecules of gas']} tone={rightHot ? 'hot' : 'plain'} size={14} h={30} />

    {stage === 'count' && <g>
      <Cylinder piston={200} mols={GAS} />
      <rect x={340} y={204} width={240} height={96} rx="16" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <T x={460} y={234} size={14} bold>(g) means a gas.</T>
      <T x={460} y={258} size={14}>Pressure only affects</T>
      <T x={460} y={278} size={14}>equilibria with gases.</T>
    </g>}
    {stage === 'pressure' && <g>
      <Cylinder piston={240} mols={SQUEEZED} />
      <Arrow x1={180} y1={166} x2={180} y2={196} c={amber} w={4} />
      <T x={282} y={190} size={14} bold colour={amberInk} anchor="start">pressure up</T>
      <Sign x={466} y={262} w={236} dir="r" lines={['moves right:', 'fewer gas molecules,', 'more NH₃']} tone="p" />
    </g>}
    {stage === 'add' && <g>
      <Cylinder piston={200} mols={GAS} inlet />
      <Blob x={36} y={232} label="N₂" side="r" r={15} ring />
      <Blob x={70} y={232} label="N₂" side="r" r={15} ring />
      <Arrow x1={30} y1={271} x2={84} y2={271} c={amber} w={3} />
      <T x={52} y={204} size={14} bold colour={amberInk}>add N₂</T>
      <Sign x={466} y={262} w={236} dir="r" lines={['moves right:', 'some N₂ used up,', 'more NH₃']} tone="p" />
    </g>}
    {stage === 'remove' && <g>
      <Cylinder piston={200} mols={GAS.filter((_, i) => i !== 2)} outlet />
      <Blob x={312} y={236} label="NH₃" side="p" r={16} ring />
      <Arrow x1={276} y1={271} x2={330} y2={271} c={amber} w={3} />
      <T x={318} y={204} size={14} bold colour={amberInk}>remove NH₃</T>
      <Sign x={476} y={262} w={216} dir="r" lines={['moves right:', 'more NH₃ made', 'to replace it']} tone="p" />
    </g>}
    {stage === 'all' && <g>
      {([['pressure up', 'side with fewer gas molecules'], ['pressure down', 'side with more gas molecules'], ['add a reactant', 'moves right: more products'], ['remove a product', 'moves right: more products']] as const).map(([a, b], i) => {
        const y = 182 + i * 38
        return <g key={a}>
          <rect x={30} y={y - 16} width={540} height={32} rx="11" fill={i < 2 ? panelFill : pSoft} stroke={i < 2 ? panelLine : pLine} strokeWidth="1.5" />
          <T x={46} y={y + 5} size={14} bold anchor="start">{a}</T>
          <Arrow x1={204} y1={y} x2={246} y2={y} c={amber} w={3} />
          <T x={262} y={y + 5} size={14} bold colour={i < 2 ? ink : pInk} anchor="start">{b}</T>
        </g>
      })}
      <T x={300} y={336} size={13} colour={muted}>Same number of gas molecules on each side: pressure has no effect.</T>
    </g>}
  </Diagram>
}

// ---------- Worked examples (the set-up only; the steps are on the screen) ----------
function WorkedTemp() {
  return <Diagram title="CO(g) + 2H₂(g), reversible arrow, CH₃OH(g), methanol. The forward arrow above is labelled forward: exothermic. The backward arrow below is labelled backward with a question mark. A tag says temperature raised." h={270}>
    <T x={190} y={140} size={24} bold>CO(g) + 2H₂(g)</T>
    <Harpoons x={330} y={132} w={56} />
    <T x={450} y={140} size={24} bold>CH₃OH(g)</T>
    <T x={450} y={164} size={13} colour={muted}>methanol</T>
    <QArrow x1={170} y1={100} cx={320} cy={30} x2={470} y2={100} c={rLine} />
    <T x={320} y={40} size={15} bold colour={rInk}>forward: exothermic</T>
    <QArrow x1={470} y1={180} cx={320} cy={250} x2={170} y2={180} c={pLine} />
    <T x={320} y={258} size={15} bold colour={pInk}>backward: ?</T>
    <Thermometer x={548} y={60} s={0.75} level="hot" />
    <T x={548} y={118} size={13} bold colour={pInk}>temperature</T>
    <T x={548} y={134} size={13} bold colour={pInk}>raised</T>
  </Diagram>
}
function WorkedPressure() {
  return <Diagram title="CH₄(g) + H₂O(g), reversible arrow, CO(g) + 3H₂(g), with the molecules drawn underneath: one CH₄ and one H₂O on the left, 2 molecules of gas; one CO and three H₂ on the right, 4 molecules of gas. A tag says pressure raised: which side has fewer molecules?" h={250}>
    <T x={150} y={48} size={21} bold>CH₄(g) + H₂O(g)</T>
    <Harpoons x={300} y={40} w={52} />
    <T x={450} y={48} size={21} bold>CO(g) + 3H₂(g)</T>
    <Blob x={124} y={104} label="CH₄" side="r" r={20} />
    <Blob x={176} y={104} label="H₂O" side="r" r={20} />
    <Blob x={384} y={104} label="CO" side="p" r={18} />
    {[428, 472, 516].map(x => <Blob key={x} x={x} y={104} label="H₂" side="p" r={18} />)}
    <Chip x={150} y={152} w={176} lines={['2 molecules of gas']} size={14} h={30} />
    <Chip x={450} y={152} w={176} lines={['4 molecules of gas']} size={14} h={30} />
    <Chip x={300} y={212} w={360} lines={['pressure raised: which side has fewer?']} tone="hot" size={14} h={34} />
  </Diagram>
}

// ---------- Question visuals ----------
const nFill = '#d9e2f2', nLine = '#4d6fa8', nInk = '#2c4a7c', oFill = '#f6d6d2', oLine = '#b5473f', oInk = '#7f2a24'
function Atom({ x, y, el }: { x: number; y: number; el: 'N' | 'O' }) {
  return <g><circle cx={x} cy={y} r="14" fill={el === 'N' ? nFill : oFill} stroke={el === 'N' ? nLine : oLine} strokeWidth="2" /><T x={x} y={y + 5} size={13} bold colour={el === 'N' ? nInk : oInk}>{el}</T></g>
}
function NO({ x, y }: { x: number; y: number }) { return <g><Atom x={x - 12} y={y} el="N" /><Atom x={x + 12} y={y} el="O" /></g> }
function O2({ x, y }: { x: number; y: number }) { return <g><Atom x={x - 12} y={y} el="O" /><Atom x={x + 12} y={y} el="O" /></g> }
function NO2({ x, y }: { x: number; y: number }) { return <g><Atom x={x - 22} y={y + 8} el="O" /><Atom x={x + 22} y={y + 8} el="O" /><Atom x={x} y={y - 6} el="N" /></g> }
function MoleculesQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram title={assessment
    ? 'The equation 2NO(g) + O₂(g), reversible arrow, 2NO₂(g), drawn as molecules: on the left two NO molecules and one O₂ molecule; on the right two NO₂ molecules. N is a nitrogen atom and O is an oxygen atom.'
    : 'The equation 2NO(g) + O₂(g), reversible arrow, 2NO₂(g), drawn as molecules: on the left two NO molecules and one O₂ molecule, 3 molecules of gas; on the right two NO₂ molecules, 2 molecules of gas.'} h={assessment ? 230 : 260}>
    <T x={300} y={40} size={22} bold>2NO(g) + O₂(g) ⇌ 2NO₂(g)</T>
    <rect x={30} y={80} width={250} height={84} rx="18" fill={rSoft} stroke={rLine} strokeWidth="1.5" />
    <rect x={380} y={80} width={190} height={84} rx="18" fill={pSoft} stroke={pLine} strokeWidth="1.5" />
    <NO x={80} y={122} /><NO x={146} y={122} /><Plus x={192} y={122} /><O2 x={238} y={122} />
    <Harpoons x={330} y={122} w={56} c={muted} />
    <NO2 x={430} y={122} /><NO2 x={520} y={122} />
    {!assessment && <g>
      <Chip x={155} y={192} w={176} lines={['3 molecules of gas']} size={14} h={30} />
      <Chip x={475} y={192} w={176} lines={['2 molecules of gas']} size={14} h={30} />
    </g>}
    <g transform={`translate(0 ${assessment ? 0 : 36})`}>
      <Atom x={196} y={200} el="N" /><T x={216} y={205} size={13} anchor="start">nitrogen atom</T>
      <Atom x={350} y={200} el="O" /><T x={370} y={205} size={13} anchor="start">oxygen atom</T>
    </g>
  </Diagram>
}
function DataQuestion() {
  const temps = ['100', '200', '300', '400'], ys = ['12', '27', '45', '61']
  const x0 = 30, lw = 220, cw = 80, rh = 40, y = 70
  return <Diagram title="A table for the reaction X, reversible arrow, Y, in a sealed container. Temperature in degrees Celsius: 100, 200, 300, 400. Percentage of Y at equilibrium: 12, 27, 45, 61." h={180}>
    <T x={x0} y={46} size={16} bold anchor="start">X(g) ⇌ Y(g) in a sealed container</T>
    <rect x={x0} y={y} width={lw + cw * 4} height={rh * 2} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <path d={`M${x0} ${y + rh}H${x0 + lw + cw * 4}`} stroke={panelLine} strokeWidth="1.2" />
    {temps.map((_, i) => <path key={i} d={`M${x0 + lw + cw * i} ${y}V${y + rh * 2}`} stroke={panelLine} strokeWidth="1.2" />)}
    <T x={x0 + 12} y={y + 26} size={14} bold anchor="start">Temperature (°C)</T>
    <T x={x0 + 12} y={y + rh + 26} size={14} bold anchor="start">Y at equilibrium (%)</T>
    {temps.map((v, i) => <T key={`t${i}`} x={x0 + lw + cw * i + cw / 2} y={y + 26} size={15}>{v}</T>)}
    {ys.map((v, i) => <T key={`y${i}`} x={x0 + lw + cw * i + cw / 2} y={y + rh + 26} size={15}>{v}</T>)}
  </Diagram>
}

export function HigherEquilibriumVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'hequil-push-position': return <PushScene stage="position" />
    case 'hequil-push-sides': return <PushScene stage="sides" />
    case 'hequil-push-conditions': return <PushScene stage="conditions" />
    case 'hequil-push-principle': return <PushScene stage="principle" />
    case 'hequil-push-all': return <PushScene stage="all" />
    case 'hequil-temp-energy': return <TempScene stage="energy" />
    case 'hequil-temp-up': return <TempScene stage="up" />
    case 'hequil-temp-down': return <TempScene stage="down" />
    case 'hequil-temp-nh4cl': return <TempScene stage="nh4cl" />
    case 'hequil-temp-all': return <TempScene stage="all" />
    case 'hequil-pc-count': return <PCScene stage="count" />
    case 'hequil-pc-pressure': return <PCScene stage="pressure" />
    case 'hequil-pc-add': return <PCScene stage="add" />
    case 'hequil-pc-remove': return <PCScene stage="remove" />
    case 'hequil-pc-all': return <PCScene stage="all" />
    case 'hequil-worked-temp': return <WorkedTemp />
    case 'hequil-worked-pressure': return <WorkedPressure />
    case 'hequil-question-molecules': return <MoleculesQuestion assessment={assessment} />
    case 'hequil-question-data': return <DataQuestion />
    default: return <PushScene stage="all" />
  }
}

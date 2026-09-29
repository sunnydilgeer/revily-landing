import { useId, type ReactNode } from 'react'
import { WsDiagram, Tag, Panel, Tick, Cross, Arrow, Bench, Numbered, VBracket, GasSyringe, tones, wsPalette as W, ink, muted, r1, faded, type Pt } from './WsKit'
import { Lines, Leader } from './PhysicsKit'
import { Cylinder } from './DensityVisuals'
import { Flask } from './GasRateVisuals'
import { lab, GlassTube, Bubbles, TestTube, Beaker, Bung } from './WsSetupVisuals'

/*
 * Working Scientifically Lesson 18: collecting gases and drawing apparatus. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'wsgas-' and is routed from CellBiologyVisuals.tsx.
 *
 * One gas-collection set-up (flask → delivery tube → upturned measuring cylinder in a trough of water) is reused through
 * the first walkthrough, the worked example and the question. The cylinder is upside down, so its scale reads downwards:
 * the water level starts at 5 cm³ and ends at 47 cm³ (42 cm³ of gas). Water blue, gas white, the value to read soft yellow.
 * The drawing section uses plain 2D line drawings in ink, the way students draw apparatus.
 */

/* ---------- The upturned measuring cylinder ---------- */

type Cyl = { x: number; top: number; mouth: number; w: number; k: number }
const yOf = (c: Cyl, v: number) => r1(c.top + 20 + v * c.k)
/** An upturned measuring cylinder: its foot at the top, open mouth at the bottom, gas above `level` (cm³), water below. */
function UpCylinder({ c, level, numbers = true, bubbles = [], dim = false, glow = false }: { c: Cyl; level: number; numbers?: boolean; bubbles?: Pt[]; dim?: boolean; glow?: boolean }) {
  const clip = useId().replace(/:/g, '')
  const l = c.x - c.w / 2, r = c.x + c.w / 2, y = yOf(c, level)
  const body = `M${l} ${c.mouth}V${c.top + 5}Q${l} ${c.top} ${l + 5} ${c.top}H${r - 5}Q${r} ${c.top} ${r} ${c.top + 5}V${c.mouth}`
  const big = c.k >= 4
  return <g opacity={dim ? faded : 1}>
    {glow && <path d={body + 'Z'} fill="none" stroke={tones.mark.line} strokeWidth="12" opacity=".35" />}
    <defs><clipPath id={clip}><path d={body + 'Z'} /></clipPath></defs>
    <path d={body + 'Z'} fill={lab.gas} />
    <g clipPath={`url(#${clip})`}>
      <path d={`M${l} ${y}Q${c.x} ${y - 5} ${r} ${y}V${c.mouth + 2}H${l}Z`} fill={lab.water} />
      <path d={`M${l} ${y}Q${c.x} ${y - 5} ${r} ${y}`} fill="none" stroke={lab.waterLine} strokeWidth="1.8" />
      {Array.from({ length: 51 }, (_, v) => v % (big ? 1 : 5) === 0 && <path key={v} d={`M${r} ${yOf(c, v)}h${v % 10 === 0 ? -14 : v % 5 === 0 ? -10 : -5}`} stroke={W.glassLine} strokeWidth={v % 5 === 0 ? 1.4 : 1} />)}
      <Bubbles pts={bubbles} r={3.6} />
    </g>
    <path d={body} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    <path d={`M${l - 12} ${c.top - 3}H${r + 12}`} stroke={W.glassLine} strokeWidth="5" />
    <path d={`M${l} ${c.mouth}Q${l} ${c.mouth + 3} ${l - 4} ${c.mouth + 5}`} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    <path d={`M${l + 7} ${c.top + 14}V${c.mouth - 12}`} stroke="white" strokeWidth="3" opacity=".8" />
    {numbers && [0, 10, 20, 30, 40, 50].map(v => <text key={v} x={r + 6} y={yOf(c, v) + 4.5} fontSize={big ? 13 : 12} fontWeight="650" fill={muted} stroke="white" strokeWidth="3" paintOrder="stroke">{v}</text>)}
  </g>
}

/* ---------- The full set-up ---------- */

const CY: Cyl = { x: 365, top: 24, mouth: 236, w: 44, k: 3 }
const FL = { x: 110, base: 268 }
const TROUGH = { x: 365, w: 230, base: 268, h: 128, surf: 160 }
const TUBE: Pt[] = [[FL.x, 150], [FL.x, 96], [300, 96], [300, 252], [CY.x - 9, 252], [CY.x - 9, 212]]

function Ribbon({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 16} ${y}q6 -8 12 0t12 0t12 -2`} fill="none" stroke="#7d8790" strokeWidth="3.2" />
}
function ReactionFlask({ dim = false, glowBung = false }: { dim?: boolean; glowBung?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <Flask cx={FL.x} base={FL.base} h={130} w={112} level={44}>
      <Ribbon x={FL.x - 10} y={FL.base - 8} />
      <Ribbon x={FL.x + 16} y={FL.base - 12} />
      <Bubbles pts={[[FL.x - 14, FL.base - 20], [FL.x + 6, FL.base - 28], [FL.x + 20, FL.base - 22], [FL.x - 4, FL.base - 36]]} r={3} />
    </Flask>
    {glowBung && <rect x={FL.x - 24} y={126} width="48" height="34" rx="12" fill={tones.good.fill} stroke={tones.good.line} strokeWidth="2" />}
    <Bung x={FL.x} top={132} w={24} h={22} />
  </g>
}
/** Flask → delivery tube → upturned measuring cylinder in a trough of water. */
function GasRig({ level = 5, bubbles = false, numbers = true, dimFlask = false, glowBung = false, glowEnd = false, glowCyl = false, children }: {
  level?: number; bubbles?: boolean; numbers?: boolean; dimFlask?: boolean; glowBung?: boolean; glowEnd?: boolean; glowCyl?: boolean; children?: ReactNode
}) {
  const rising: Pt[] = bubbles ? [[CY.x - 8, 200], [CY.x - 2, 184], [CY.x - 9, 168], [CY.x - 3, 150]] : []
  return <g>
    <Bench x1={16} x2={524} y={270} />
    <Beaker x={TROUGH.x} base={TROUGH.base} w={TROUGH.w} h={TROUGH.h} level={TROUGH.surf} spout={false} />
    <UpCylinder c={CY} level={level} numbers={numbers} bubbles={rising} glow={glowCyl} />
    <ReactionFlask dim={dimFlask} glowBung={glowBung} />
    {glowEnd && <circle cx={CY.x - 9} cy={224} r="20" fill={tones.good.fill} stroke={tones.good.line} strokeWidth="2" opacity=".8" />}
    <GlassTube points={TUBE} />
    {children}
  </g>
}
function Setup() {
  return <WsDiagram title="Collecting a gas over water. A reaction flask with a bung has a delivery tube leading into a trough of water and up into a measuring cylinder, which is full of water and upside down.">
    <GasRig>
      <Lines x={200} y={80} anchor="middle" lines={['delivery tube']} size={14} />
      <Lines x={414} y={52} lines={['upturned', 'measuring', 'cylinder']} size={13} />
      <Leader from={[410, 64]} to={[CY.x + 22, 96]} />
      <Lines x={110} y={294} anchor="middle" lines={['reaction flask']} size={14} />
      <Lines x={420} y={294} anchor="middle" lines={['trough of water']} size={14} />
    </GasRig>
  </WsDiagram>
}
function Start() {
  const y = yOf(CY, 5)
  return <WsDiagram title="Before the reaction starts, read the water level on the scale of the upturned cylinder. This is the starting level, 5 cm³ here.">
    <GasRig dimFlask>
      <path d={`M${CY.x - 30} ${y}H${CY.x + 30}`} stroke={tones.mark.line} strokeWidth="2.6" strokeDasharray="6 4" />
      <Arrow from={[452, y]} to={[CY.x + 34, y]} colour={tones.mark.line} width={2.6} />
      <Tag x={492} y={y} text="start" tone="mark" size={13} strong />
      <Lines x={450} y={y + 34} lines={['starting', 'level']} size={14} colour={tones.mark.text} />
    </GasRig>
  </WsDiagram>
}
function Push() {
  return <WsDiagram title="Gas from the reaction travels along the delivery tube and bubbles up into the cylinder. It pushes water out of the cylinder, so the water level moves down the cylinder.">
    <GasRig level={30} bubbles>
      <Arrow from={[170, 82]} to={[240, 82]} colour={ink} width={2.6} />
      <Lines x={205} y={70} anchor="middle" lines={['gas in']} size={14} />
      <Arrow from={[428, 176]} to={[428, 236]} colour={lab.waterLine} width={2.6} />
      <Lines x={438} y={200} lines={['water', 'pushed out']} size={14} colour={lab.waterLine} />
    </GasRig>
  </WsDiagram>
}

/* ---------- Close-up of the scale ---------- */

const CLOSE: Cyl = { x: 170, top: 22, mouth: 292, w: 62, k: 4.6 }
function CloseScale({ c = CLOSE, labels = true }: { c?: Cyl; labels?: boolean }) {
  const ys = yOf(c, 5), yf = yOf(c, 47), r = c.x + c.w / 2
  return <g>
    <UpCylinder c={c} level={47} />
    <path d={`M${c.x - c.w / 2 - 10} ${ys}H${r + 36}`} stroke={muted} strokeWidth="2.2" strokeDasharray="6 5" />
    <path d={`M${c.x - c.w / 2 - 10} ${yf}H${r + 36}`} stroke={tones.mark.line} strokeWidth="2.8" />
    {labels && <g>
      <Lines x={r + 44} y={ys + 5} lines={['starting level 5 cm³']} size={14} colour={muted} />
      <Lines x={r + 44} y={yf + 5} lines={['final level 47 cm³']} size={14} colour={tones.mark.text} />
    </g>}
  </g>
}
function Volume() {
  const ys = yOf(CLOSE, 5), yf = yOf(CLOSE, 47)
  return <WsDiagram title="Close-up of the upturned cylinder's scale. The starting level was 5 cm³ and the final level is 47 cm³. The volume of gas is the final level minus the starting level.">
    <CloseScale />
    <VBracket y1={ys + 8} y2={yf - 8} x={264} dir={-1} colour={ink} />
    <Panel x={284} y={100} w={236} h={76} tone="mark" />
    <Lines x={402} y={130} anchor="middle" lines={['volume of gas =', 'final − starting']} size={17} />
  </WsDiagram>
}
function WorkedVolume() {
  const c: Cyl = { x: 96, top: 22, mouth: 292, w: 56, k: 4.6 }
  const rows: [string, boolean][] = [['start 5 cm³, final 47 cm³', false], ['volume = final − starting', false], ['= 47 − 5', false], ['= 42 cm³', true]]
  return <WsDiagram title="Worked example: the water level starts at 5 cm³ and ends at 47 cm³. Volume of gas = final − starting = 47 − 5 = 42 cm³.">
    <UpCylinder c={c} level={47} />
    <path d={`M${c.x - 38} ${yOf(c, 5)}H${c.x + 50}`} stroke={muted} strokeWidth="2.2" strokeDasharray="6 5" />
    <path d={`M${c.x - 38} ${yOf(c, 47)}H${c.x + 50}`} stroke={tones.mark.line} strokeWidth="2.8" />
    <Tag x={c.x + 94} y={yOf(c, 5)} text="5 cm³" size={13} />
    <Tag x={c.x + 94} y={yOf(c, 47)} text="47 cm³" tone="mark" size={13} />
    {rows.map(([t, ans], i) => <g key={t}>
      {ans && <Panel x={250} y={214} w={170} h={48} tone="mark" strong />}
      <text x={ans ? 335 : 256} y={72 + i * 58} textAnchor={ans ? 'middle' : 'start'} fontSize={i === 0 ? 17 : 20} fontWeight="750" fill={i === 0 ? muted : ink}>{t}</text>
    </g>)}
  </WsDiagram>
}

/* ---------- Keep it sealed ---------- */

function Sealed() {
  return <WsDiagram title="The whole system must be sealed: the bung pushed firmly into the flask and the end of the delivery tube completely inside the cylinder. If the tube end is outside the cylinder, gas escapes into the air.">
    <GasRig level={20} glowBung glowEnd numbers={false}>
      <Tick x={FL.x + 36} y={120} s={0.9} />
      <Lines x={FL.x + 52} y={124} lines={['bung in firmly']} size={13} colour={tones.good.text} />
      <Tick x={CY.x - 44} y={208} s={0.9} />
      <Lines x={CY.x - 60} y={190} anchor="end" lines={['tube end', 'inside']} size={13} colour={tones.good.text} />
    </GasRig>
    {/* inset: the tube end outside the cylinder */}
    <g>
      <rect x={410} y={16} width={120} height={150} rx="14" fill="white" stroke={tones.bad.line} strokeWidth="2" />
      <rect x={412} y={70} width={116} height={94} rx="12" fill={lab.water} />
      <path d="M412 70H528" stroke={lab.waterLine} strokeWidth="1.6" />
      <path d="M476 16V140M504 16V140" stroke={W.glassLine} strokeWidth="2.2" />
      <path d="M477 70H503V140H477Z" fill={lab.water} />
      <GlassTube points={[[418, 152], [456, 152], [456, 116]]} />
      <Bubbles pts={[[456, 100], [458, 86], [455, 74]]} r={3.4} />
      <Arrow from={[456, 64]} to={[456, 36]} colour={tones.bad.line} width={2.4} />
      <Cross x={432} y={40} s={0.8} />
      <Lines x={470} y={186} anchor="middle" lines={['tube end outside:', 'gas escapes']} size={13} colour={tones.bad.text} />
    </g>
  </WsDiagram>
}

/* ---------- Section 3: test tubes and bungs ---------- */

function TestTubeCollect() {
  const TX = 365
  return <WsDiagram title="Collecting a sample of gas: the delivery tube leads into a test tube that was filled with water and turned upside down in a trough of water. The gas collects at the top of the tube.">
    <Bench x1={16} x2={524} y={270} />
    <Beaker x={TROUGH.x} base={TROUGH.base} w={TROUGH.w} h={TROUGH.h} level={TROUGH.surf} spout={false} />
    <TestTube x={TX} top={62} bottom={236} w={36} up level={124} fill={lab.water} line={lab.waterLine}>
      <Bubbles pts={[[TX - 6, 200], [TX + 2, 180], [TX - 5, 160], [TX + 3, 140]]} r={3.6} />
    </TestTube>
    <ReactionFlask />
    <GlassTube points={[[FL.x, 150], [FL.x, 96], [300, 96], [300, 252], [TX - 6, 252], [TX - 6, 214]]} />
    <Lines x={420} y={50} lines={['upturned', 'test tube']} size={14} />
    <Leader from={[416, 58]} to={[TX + 18, 150]} />
    <Lines x={260} y={40} anchor="end" lines={['gas collects', 'here']} size={14} />
    <Leader from={[264, 44]} to={[TX - 8, 90]} />
  </WsDiagram>
}
function BungFig() {
  const bx = 140, tx = 400
  return <WsDiagram title="Step 1: while the mouth of the test tube full of gas is still under water, push a bung into it. Step 2: the sealed tube can be taken out and stored, and the gas tested later.">
    <Panel x={14} y={14} w={250} h={272} />
    <Panel x={276} y={14} w={250} h={272} />
    <Tag x={139} y={38} text="1  bung in, under water" size={13} />
    <Tag x={401} y={38} text="2  store it, test later" size={13} />
    <Beaker x={bx} base={266} w={200} h={118} level={172} spout={false} />
    <TestTube x={bx} top={64} bottom={214} w={36} up level={206} fill={lab.water} line={lab.waterLine} />
    <Bung x={bx} top={232} w={26} h={18} />
    <Arrow from={[bx + 34, 250]} to={[bx + 34, 222]} colour={ink} width={2.4} />
    <TestTube x={tx} top={96} bottom={246} w={36} />
    <Bung x={tx} top={84} w={30} h={22} />
    <Lines x={tx + 20} y={130} lines={['bung stops', 'gas escaping']} size={13} />
    <Leader from={[tx + 40, 116]} to={[tx + 14, 98]} />
    <Lines x={tx} y={272} anchor="middle" lines={['full of gas']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function Choose() {
  return <WsDiagram title="Use a measuring cylinder when you need to know the volume of gas, because it has a scale. Use a test tube when you only need a sample to test. A gas syringe measures the volume most accurately.">
    <Panel x={14} y={14} w={250} h={196} />
    <Panel x={276} y={14} w={250} h={196} />
    <Cylinder x={139} y={166} h={130} w={36} marks={5} />
    <Tag x={139} y={196} text="need a volume" tone="mark" size={13} />
    <TestTube x={401} top={66} bottom={166} w={30} />
    <Bung x={401} top={54} w={26} h={20} />
    <Tag x={401} y={196} text="need a sample to test" tone="change" size={13} />
    <Lines x={96} y={60} anchor="end" lines={['scale']} size={13} weight={650} colour={muted} />
    <Leader from={[100, 56]} to={[121, 68]} />
    <GasSyringe x={40} y={254} w={170} fill={0.45} />
    <Lines x={236} y={260} lines={['gas syringe: most accurate']} size={14} colour={tones.good.text} />
    <Tick x={470} y={254} s={0.8} />
  </WsDiagram>
}

/* ---------- Section 4: 2D scientific drawings ---------- */

const LINE = { stroke: ink, strokeWidth: 2.8, fill: 'none' as const }
function Beaker2D({ x, base, w = 80, h = 110 }: { x: number; base: number; w?: number; h?: number }) {
  const l = x - w / 2, r = x + w / 2
  return <path {...LINE} d={`M${l - 8} ${base - h - 6}L${l} ${base - h + 2}V${base}H${r}V${base - h}`} />
}
function TestTube2D({ x, top, bottom, w = 26 }: { x: number; top: number; bottom: number; w?: number }) {
  return <path {...LINE} d={`M${x - w / 2} ${top}V${bottom - w / 2}A${w / 2} ${w / 2} 0 0 0 ${x + w / 2} ${bottom - w / 2}V${top}`} />
}
function Tripod2D({ x, top, base, w = 100 }: { x: number; top: number; base: number; w?: number }) {
  return <g><path {...LINE} strokeWidth={3.4} d={`M${x - w / 2} ${top}H${x + w / 2}`} /><path {...LINE} d={`M${x - w * 0.38} ${top}L${x - w * 0.55} ${base}M${x + w * 0.38} ${top}L${x + w * 0.55} ${base}`} /></g>
}
function Bunsen2D({ x, top, base }: { x: number; top: number; base: number }) {
  return <path {...LINE} d={`M${x - 8} ${top}V${base - 16}M${x + 8} ${top}V${base - 36}H${x + 40}M${x + 40} ${base - 27}H${x + 8}V${base - 16}M${x - 32} ${base - 16}H${x + 32}V${base}H${x - 32}Z`} />
}
function Side() {
  return <WsDiagram title="A beaker drawn in 3D with shading is not a scientific drawing. Look at the beaker from the side and draw it as a flat, two-dimensional outline with no shading.">
    <Panel x={14} y={14} w={176} h={272} />
    <g opacity={0.55}>
      <ellipse cx={102} cy={84} rx={46} ry={12} fill="#eef5fa" stroke={W.glassLine} strokeWidth="2.4" />
      <path d="M56 84V210Q56 224 102 224Q148 224 148 210V84" fill={W.glass} stroke={W.glassLine} strokeWidth="2.4" />
      <path d="M64 96V206M76 100V214" stroke="#c6d7e3" strokeWidth="6" />
      <path d="M130 100V214M140 96V206" stroke="#9fb6c7" strokeWidth="5" />
    </g>
    <Cross x={102} y={250} s={0.9} />
    <Lines x={102} y={40} anchor="middle" lines={['3D and shaded']} size={13} colour={tones.bad.text} />
    {/* the eye looking from the side */}
    <g transform="translate(250 150)">
      <path d="M-24 0C-12 -16 12 -16 24 0C12 16 -12 16 -24 0Z" fill="white" stroke={ink} strokeWidth="2.2" />
      <circle r="7.5" fill="#6e8fa8" stroke={ink} strokeWidth="1.6" />
      <circle r="3" fill={ink} />
    </g>
    <path d="M282 150H330" stroke={muted} strokeWidth="2" strokeDasharray="5 5" />
    <Arrow from={[330, 150]} to={[352, 150]} colour={muted} width={2} />
    <Beaker2D x={430} base={214} w={96} h={130} />
    <Tick x={430} y={250} s={0.9} />
    <Lines x={400} y={40} anchor="middle" lines={['look from the side:', 'flat, no shading']} size={14} colour={tones.good.text} />
  </WsDiagram>
}
function Shapes() {
  const base = 208
  return <WsDiagram title="Flat 2D drawings of four pieces of apparatus: a beaker, a test tube, a tripod and a Bunsen burner.">
    <Beaker2D x={78} base={base} w={82} h={112} />
    <TestTube2D x={196} top={82} bottom={base} w={28} />
    <Tripod2D x={318} top={104} base={base} w={104} />
    <Bunsen2D x={452} top={96} base={base} />
    {[['beaker', 78], ['test tube', 196], ['tripod', 318], ['Bunsen burner', 458]].map(([t, x]) => <Lines key={t as string} x={x as number} y={250} anchor="middle" lines={[t as string]} size={15} />)}
  </WsDiagram>
}
function Ruler2D({ x, y, w }: { x: number; y: number; w: number }) {
  return <g>
    <rect x={x} y={y} width={w} height={20} rx="3" fill="#f7ebc8" stroke="#b99a52" strokeWidth="1.6" />
    {Array.from({ length: Math.floor(w / 10) }, (_, i) => <path key={i} d={`M${x + 5 + i * 10} ${y}v${i % 5 === 0 ? 9 : 5}`} stroke="#9c8040" strokeWidth="1.1" />)}
  </g>
}
function GauzeMat() {
  return <WsDiagram title="A gauze is drawn as a dashed line and a heat-proof mat as a single flat line. Straight lines are drawn with a ruler. On the right: a beaker on a gauze on a tripod over a Bunsen burner, all on a heat-proof mat.">
    <path d="M40 80H200" stroke={ink} strokeWidth="3" strokeDasharray="12 8" />
    <Lines x={120} y={108} anchor="middle" lines={['gauze']} size={15} />
    <path d="M40 170H200" stroke={ink} strokeWidth="3.4" />
    <Lines x={120} y={198} anchor="middle" lines={['heat-proof mat']} size={15} />
    <Ruler2D x={40} y={234} w={160} />
    <Lines x={120} y={278} anchor="middle" lines={['use a ruler']} size={13} weight={650} colour={muted} />
    <path d="M248 30V270" stroke={W.panelLine} strokeWidth="1.6" strokeDasharray="4 6" />
    <Beaker2D x={400} base={138} w={76} h={82} />
    <path d="M334 142H466" stroke={ink} strokeWidth="3" strokeDasharray="10 7" />
    <Tripod2D x={400} top={148} base={250} w={116} />
    <Bunsen2D x={400} top={176} base={250} />
    <path d="M300 252H520" stroke={ink} strokeWidth="3.4" />
    <Lines x={484} y={124} lines={['gauze']} size={13} colour={muted} />
    <Leader from={[480, 128]} to={[462, 142]} colour={muted} />
    <Lines x={400} y={282} anchor="middle" lines={['heat-proof mat']} size={13} colour={muted} />
  </WsDiagram>
}
function DrawSealed() {
  return <WsDiagram title="A 2D drawing of a test tube with a bung in the top shows that it is sealed; each part is labelled with a straight line. Without a bung, the tube looks open.">
    <TestTube2D x={170} top={96} bottom={250} w={34} />
    <path d="M149 72H191L187 110H153Z" fill={lab.cork} stroke={ink} strokeWidth="2.6" />
    <path d="M196 84H270" stroke={ink} strokeWidth="1.8" />
    <Lines x={278} y={89} lines={['bung']} size={15} />
    <path d="M190 190H270" stroke={ink} strokeWidth="1.8" />
    <Lines x={278} y={195} lines={['test tube']} size={15} />
    <Tick x={170} y={282} s={0.8} />
    <Lines x={190} y={40} anchor="middle" lines={['sealed']} size={15} colour={tones.good.text} />
    <g opacity={0.4}><TestTube2D x={440} top={96} bottom={250} w={34} /></g>
    <Lines x={440} y={80} anchor="middle" lines={['open']} size={15} colour={muted} />
  </WsDiagram>
}

/* ---------- On your own ---------- */

function QCollect() {
  return <WsDiagram title="A gas collection set-up with four numbered parts.">
    <GasRig level={20}>
      <Numbered n={1} at={[40, 170]} to={[80, 226]} />
      <Numbered n={2} at={[440, 44]} to={[CY.x + 22, 70]} />
      <Numbered n={3} at={[200, 50]} to={[200, 96]} />
      <Numbered n={4} at={[500, 214]} to={[462, 214]} />
    </GasRig>
  </WsDiagram>
}

export function WsGasVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wsgas-setup': return <Setup />
    case 'wsgas-start': return <Start />
    case 'wsgas-push': return <Push />
    case 'wsgas-volume': return <Volume />
    case 'wsgas-sealed': return <Sealed />
    case 'wsgas-testtube': return <TestTubeCollect />
    case 'wsgas-bung': return <BungFig />
    case 'wsgas-choose': return <Choose />
    case 'wsgas-side': return <Side />
    case 'wsgas-shapes': return <Shapes />
    case 'wsgas-gauzemat': return <GauzeMat />
    case 'wsgas-drawsealed': return <DrawSealed />
    case 'wsgas-worked-volume': return <WorkedVolume />
    case 'wsgas-q-collect': return <QCollect />
    default: return null
  }
}

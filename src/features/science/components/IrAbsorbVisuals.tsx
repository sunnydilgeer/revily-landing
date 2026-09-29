import { type ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, Lines, Leader, EnergyStoreBadge, TransferArrow, type Pt } from './PhysicsKit'
import { Num, Arrow } from './EnergyStoreVisuals'
import { WaveArrow, waveColour } from './EmSpectrumVisuals'
import { surfaces } from './IrEmitVisuals'

/*
 * Physics Lesson 61: Investigating infrared absorption (the melting-wax practical). Original, code-native schematics;
 * not to scale. Focus ids start with 'irabsorb-'.
 *
 * One scene, seen from the side: a Bunsen burner on a heat-proof mat in the middle, and two identical metal plates
 * standing either side of it, seen edge-on. Each plate's back faces the flame (left plate black back, right plate
 * white back); a metal ball is stuck to the front of each plate with candle wax. Infrared is the warm-red wavy arrow
 * used in Lessons 57–60; the surfaces use the same colours as the Leslie cube in Lesson 60.
 */
const { ink, muted } = P
const r1 = (n: number) => Math.round(n * 10) / 10
const ir = waveColour.ir
const steel = '#c9d0d6', steelLine = '#6b7883'
const wax = '#fbf1d0', waxLine = '#c9a95a'
const ballFill = '#b9c2ca', ballLine = '#56636e'
const mat = '#e9e1d2', matLine = '#a4927a'

type Back = 'black' | 'white'
type BallState = 'on' | 'falling' | 'fallen'

/** The heat-proof mat seen from the side; (x, y) is the left end of its top surface. */
function MatSide({ x = 40, y = 252, w = 460 }: { x?: number; y?: number; w?: number }) {
  return <g>
    <rect x={x} y={y} width={w} height={12} rx="4" fill={mat} stroke={matLine} strokeWidth="1.8" />
    <path d={`M${x + 8} ${y + 4}H${x + w - 8}`} stroke="white" strokeWidth="1.6" opacity=".6" />
  </g>
}

/** A Bunsen burner; (x, y) is the middle of its base. `lit` adds the flame. */
export function Bunsen({ x, y, s = 1, lit = true }: { x: number; y: number; s?: number; lit?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {lit && <g>
      <ellipse cx="0" cy="-118" rx="30" ry="42" fill={P.hotFill} opacity=".75" />
      <path d="M0 -84C-18 -92 -18 -120 0 -156C18 -120 18 -92 0 -84Z" fill="#9cc6ec" stroke="#3f8fc7" strokeWidth="1.6" />
      <path d="M0 -88C-9 -94 -9 -110 0 -128C9 -110 9 -94 0 -88Z" fill="#dff0fb" />
    </g>}
    <rect x="-7" y="-84" width="14" height="72" rx="2" fill={steel} stroke={steelLine} strokeWidth="1.8" />
    <rect x="-10" y="-40" width="20" height="12" rx="3" fill="#dfe5ea" stroke={steelLine} strokeWidth="1.6" />
    <circle cx="0" cy="-34" r="3" fill={steelLine} />
    <path d="M-30 0Q-30 -12 -18 -12H18Q30 -12 30 0Z" fill="#aab4bd" stroke={steelLine} strokeWidth="1.8" />
    <path d="M10 -20H34" stroke="#e39b4c" strokeWidth="6" />
  </g>
}

/**
 * A metal plate seen edge-on, standing on a small foot. (x, y) is the bottom of the plate; `back` is the side facing
 * the flame, which is to the right when dir = 1 and to the left when dir = −1. The ball sits on the front (the other side).
 */
function Plate({ x, y, h = 150, back, dir, ball = 'on', drips = false, backColour = true }: { x: number; y: number; h?: number; back: Back; dir: 1 | -1; ball?: BallState; drips?: boolean; backColour?: boolean }) {
  const S = surfaces[back], t = 10, coat = 6
  const front = x - dir * t / 2, backX = x + dir * t / 2
  const by = y - h * 0.6, br = 13
  const bx = front - dir * (br + 6)
  return <g>
    <path d={`M${x - 26} ${y}H${x + 26}`} stroke={steelLine} strokeWidth="5" />
    <rect x={x - t / 2} y={y - h} width={t} height={h} rx="2" fill={steel} stroke={steelLine} strokeWidth="1.8" />
    {backColour && <rect x={dir > 0 ? backX : backX - coat} y={y - h} width={coat} height={h} rx="2" fill={S.fill} stroke={S.line} strokeWidth="1.6" />}
    {ball !== 'fallen' && <path d={`M${front} ${by - 12}Q${front - dir * 12} ${by - 8} ${front - dir * 10} ${by}Q${front - dir * 12} ${by + 8} ${front} ${by + 12}Z`} fill={wax} stroke={waxLine} strokeWidth="1.6" />}
    {ball === 'fallen' && <path d={`M${front} ${by - 8}Q${front - dir * 5} ${by} ${front} ${by + 8}Z`} fill={wax} stroke={waxLine} strokeWidth="1.4" />}
    {drips && <g fill={wax} stroke={waxLine} strokeWidth="1.3"><path d={`M${front - dir * 4} ${by + 12}q${-dir * 2} 8 0 12q${dir * 3} -4 0 -12Z`} /><path d={`M${front - dir * 8} ${by + 8}q${-dir * 2} 6 0 9q${dir * 3} -3 0 -9Z`} /></g>}
    {ball === 'on' && <Ball x={bx} y={by} r={br} />}
    {ball === 'falling' && <g>
      <Ball x={bx - dir * 4} y={by + 46} r={br} />
      <g stroke={muted} strokeWidth="2.2" opacity=".7"><path d={`M${bx - dir * 4 - 6} ${by + 14}v14M${bx - dir * 4 + 6} ${by + 10}v14`} /></g>
      <Arrow from={[bx - dir * 30, by + 20]} to={[bx - dir * 30, by + 70]} colour={muted} width={2.2} />
    </g>}
    {ball === 'fallen' && <Ball x={bx - dir * 18} y={y - br} r={br} />}
  </g>
}
function Ball({ x, y, r }: { x: number; y: number; r: number }) {
  return <g>
    <circle cx={x} cy={y} r={r} fill={ballFill} stroke={ballLine} strokeWidth="1.8" />
    <circle cx={x - r * 0.35} cy={y - r * 0.38} r={r * 0.26} fill="white" opacity=".75" />
  </g>
}

/** The whole side-on scene. */
const L = 140, R = 400, BASE = 252
function Scene({ left = 'on', right = 'on', waves = 2, colours = true, drips = false }: { left?: BallState; right?: BallState; waves?: number; colours?: boolean; drips?: boolean }) {
  return <g>
    <MatSide />
    <Bunsen x={270} y={BASE} />
    {waves > 0 && [-1, 1].map(side => Array.from({ length: waves }, (_, i) => {
      const y = 116 + (waves === 1 ? 22 : i * 44)
      return <WaveArrow key={`${side}${i}`} from={[270 + side * 34, y]} to={[270 + side * 116, y]} wavelength={11} amp={4} colour={ir} width={2.6} />
    }))}
    <Plate x={L} y={BASE} back="black" dir={1} ball={left} backColour={colours} drips={drips} />
    <Plate x={R} y={BASE} back="white" dir={-1} ball={right} backColour={colours} />
  </g>
}

/* ---------- Section 1 ---------- */

function Idea() {
  const Panel = ({ x, back }: { x: number; back: Back }) => {
    const S = surfaces[back], black = back === 'black'
    return <g>
      <rect x={x} y={14} width={250} height={232} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
      {black && <ellipse cx={x + 195} cy={130} rx="42" ry="100" fill={P.thermal} opacity=".6" />}
      <rect x={x + 170} y={40} width={50} height={180} rx="6" fill={S.fill} stroke={S.line} strokeWidth="2" />
      {[70, 130, 190].map((y, i) => <WaveArrow key={y} from={[x + 20, y]} to={[x + 166, y]} wavelength={11} amp={4} colour={ir} width={2.6} opacity={black || i === 1 ? 1 : 0.95} />)}
      {!black && [70, 190].map(y => <path key={y} d={`M${x + 164} ${y}Q${x + 120} ${y + (y < 130 ? -26 : 26)} ${x + 70} ${y + (y < 130 ? -40 : 40)}`} stroke={ir} strokeWidth="2.2" fill="none" strokeDasharray="6 5" />)}
      {!black && [[70, -1], [190, 1]].map(([y, sg]) => <path key={y} d={`M${x + 70} ${y + sg * 40}l12 ${-sg * 1}l-6 ${-sg * 10}Z`} fill={ir} />)}
      <Lines x={x + 125} y={270} anchor="middle" lines={[back]} size={16} />
      <Lines x={x + 125} y={290} anchor="middle" lines={[black ? 'absorbs most of it' : 'absorbs less, reflects the rest']} size={13} weight={650} colour={muted} />
    </g>
  }
  return <PhysicsDiagram title="Infrared radiation hitting a black surface and a white surface. The black surface absorbs most of it and warms up. The white surface absorbs less and reflects the rest.">
    <Panel x={14} back="black" />
    <Panel x={276} back="white" />
  </PhysicsDiagram>
}

function Kit() {
  return <PhysicsDiagram title="The equipment: a Bunsen burner on a heat-proof mat, two identical metal plates (one with a black back, one with a white back), candle wax and two metal balls.">
    <Scene waves={0} />
    <Leader from={[270, 36]} to={[270, 122]} />
    <Lines x={270} y={28} anchor="middle" lines={['Bunsen burner']} size={14} />
    <Leader from={[76, 142]} to={[132, 158]} />
    <Lines x={20} y={128} lines={['candle', 'wax']} size={14} />
    <Leader from={[64, 214]} to={[100, 174]} />
    <Lines x={20} y={232} lines={['metal ball']} size={14} />
    <Leader from={[104, 72]} to={[140, 110]} />
    <Lines x={20} y={64} lines={['plate: black back']} size={14} />
    <Leader from={[372, 70]} to={[396, 110]} />
    <Lines x={380} y={64} lines={['plate: white back']} size={14} />
    <Leader from={[470, 286]} to={[470, 262]} />
    <Lines x={470} y={298} anchor="middle" lines={['heat-proof mat']} size={13} />
  </PhysicsDiagram>
}

function Setup() {
  return <PhysicsDiagram title="The set-up: the Bunsen burner flame in the middle gives out infrared radiation. A plate stands on each side with its back facing the flame: the black side on the left, the white side on the right.">
    <Scene />
    <Lines x={270} y={30} anchor="middle" lines={['flame gives out infrared radiation']} size={14} colour={ir} />
    <Leader from={[70, 214]} to={[144, 196]} />
    <Lines x={66} y={234} anchor="middle" lines={['black side']} size={14} />
    <Leader from={[470, 214]} to={[396, 196]} />
    <Lines x={474} y={234} anchor="middle" lines={['white side']} size={14} />
    <Lines x={270} y={290} anchor="middle" lines={['backs face the flame']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 2 ---------- */

function WaxView() {
  const x = 330, y = 150
  return <PhysicsDiagram title="Close-up of the front of one plate. A metal ball is stuck on with a blob of hot candle wax. The wax is left to cool and harden so it holds the ball.">
    <rect x={x} y={20} width={26} height={250} rx="3" fill={steel} stroke={steelLine} strokeWidth="2" />
    <rect x={x + 26} y={20} width={12} height={250} rx="3" fill={surfaces.black.fill} stroke={surfaces.black.line} strokeWidth="1.8" />
    <path d={`M${x} ${y - 34}Q${x - 36} ${y - 26} ${x - 32} ${y}Q${x - 36} ${y + 26} ${x} ${y + 34}Z`} fill={wax} stroke={waxLine} strokeWidth="2" />
    <Ball x={x - 62} y={y} r={34} />
    <path d="M190 64Q196 50 206 48Q214 58 208 72Q200 78 190 64Z" fill="#fde8a8" stroke="#c3930f" strokeWidth="1.6" />
    <rect x={190} y={70} width={16} height={60} rx="3" fill={wax} stroke={waxLine} strokeWidth="1.8" />
    <Leader from={[410, 90]} to={[312, 128]} />
    <Lines x={414} y={86} lines={['candle wax']} size={15} />
    <Leader from={[120, 230]} to={[256, 172]} />
    <Lines x={30} y={250} lines={['metal ball']} size={15} />
    <Leader from={[410, 190]} to={[344, 190]} />
    <Lines x={414} y={186} lines={['front of plate']} size={14} />
    <Leader from={[410, 238]} to={[368, 238]} />
    <Lines x={414} y={234} lines={['back faces', 'the flame']} size={14} />
    <Lines x={20} y={36} lines={['hot wax sticks the ball;', 'leave it to harden']} size={15} />
  </PhysicsDiagram>
}

function Distance() {
  const cy = 150
  const PlateTop = ({ x, dir, back }: { x: number; dir: 1 | -1; back: Back }) => {
    const S = surfaces[back]
    return <g>
      <rect x={x - 5} y={cy - 70} width={10} height={140} rx="2" fill={steel} stroke={steelLine} strokeWidth="1.8" />
      <rect x={dir > 0 ? x + 5 : x - 11} y={cy - 70} width={6} height={140} rx="2" fill={S.fill} stroke={S.line} strokeWidth="1.6" />
      <circle cx={x - dir * 22} cy={cy} r="13" fill={ballFill} stroke={ballLine} strokeWidth="1.8" />
      <path d={`M${x - dir * 5} ${cy - 9}Q${x - dir * 12} ${cy} ${x - dir * 5} ${cy + 9}`} fill={wax} stroke={waxLine} strokeWidth="1.4" />
    </g>
  }
  const DoubleArrow = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => <g>
    <Arrow from={[(x1 + x2) / 2, y]} to={[x1, y]} colour={ink} width={2.2} />
    <Arrow from={[(x1 + x2) / 2, y]} to={[x2, y]} colour={ink} width={2.2} />
  </g>
  return <PhysicsDiagram title="Looking down from above: the flame in the middle and a plate on each side. Both plates are the same distance from the flame.">
    <circle cx={270} cy={cy} r="40" fill={P.hotFill} />
    <circle cx={270} cy={cy} r="22" fill="#9cc6ec" stroke="#3f8fc7" strokeWidth="1.6" />
    <circle cx={270} cy={cy} r="9" fill="#dff0fb" />
    <PlateTop x={130} dir={1} back="black" />
    <PlateTop x={410} dir={-1} back="white" />
    <DoubleArrow x1={138} x2={246} y={cy + 94} />
    <DoubleArrow x1={294} x2={402} y={cy + 94} />
    <path d={`M138 ${cy + 76}v36M402 ${cy + 76}v36M270 ${cy + 44}v68`} stroke={muted} strokeWidth="1.4" strokeDasharray="4 4" />
    <Lines x={192} y={cy + 128} anchor="middle" lines={['same distance']} size={14} />
    <Lines x={348} y={cy + 128} anchor="middle" lines={['same distance']} size={14} />
    <Lines x={270} y={34} anchor="middle" lines={['seen from above']} size={14} weight={650} colour={muted} />
    <Lines x={270} y={cy - 54} anchor="middle" lines={['flame']} size={13} weight={650} colour={P.hot} />
  </PhysicsDiagram>
}

function Fall() {
  return <PhysicsDiagram title="The burner is lit and the balls are watched. One ball has started to drop off its plate while the other is still stuck. Which ball falls first?">
    <Scene left="falling" drips />
    <rect x={170} y={14} width={200} height={32} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="1.8" />
    <Lines x={270} y={35} anchor="middle" lines={['which ball falls first?']} size={15} />
    <Lines x={270} y={290} anchor="middle" lines={['take care: burner, plates and wax get hot']} size={13} weight={650} colour={P.hot} />
  </PhysicsDiagram>
}

/* ---------- Section 3 ---------- */

function Melt() {
  const x = 250
  return <PhysicsDiagram title="Infrared radiation from the flame is absorbed by the plate. Energy is transferred by radiation to the thermal store of the wax, so the wax warms up and softens.">
    {[70, 130, 190].map(y => <WaveArrow key={y} from={[500, y]} to={[x + 36, y]} wavelength={11} amp={4} colour={ir} width={2.6} />)}
    <Lines x={420} y={236} anchor="middle" lines={['infrared from the flame']} size={14} colour={ir} />
    <rect x={x} y={30} width={22} height={220} rx="3" fill={steel} stroke={steelLine} strokeWidth="2" />
    <rect x={x + 22} y={30} width={10} height={220} rx="3" fill={surfaces.black.fill} stroke={surfaces.black.line} strokeWidth="1.8" />
    <ellipse cx={x - 20} cy={150} rx="44" ry="50" fill={P.thermal} opacity=".45" />
    <path d={`M${x} ${122}Q${x - 30} ${128} ${x - 28} ${150}Q${x - 32} ${172} ${x} ${178}Z`} fill={wax} stroke={waxLine} strokeWidth="2" />
    <path d={`M${x - 14} ${176}q-4 14 0 20q4 -6 0 -20Z`} fill={wax} stroke={waxLine} strokeWidth="1.5" />
    <Ball x={x - 56} y={150} r={26} />
    <EnergyStoreBadge store="thermal" x={100} y={52} label="Thermal store of wax" />
    <TransferArrow from={[x - 4, 100]} to={[160, 70]} bend={0.3} colour={P.thermalLine} width={3} label="by radiation" />
    <Lines x={100} y={250} anchor="middle" lines={['wax warms and softens']} size={14} />
  </PhysicsDiagram>
}

function Result() {
  return <PhysicsDiagram title="The ball on the black plate has fallen onto the mat first. The ball on the white plate is still stuck.">
    <Scene left="fallen" waves={2} />
    <Leader from={[60, 200]} to={[96, 232]} />
    <Lines x={60} y={176} anchor="middle" lines={['falls', 'first']} size={15} colour={P.useful} />
    <Leader from={[480, 100]} to={[438, 142]} />
    <Lines x={480} y={80} anchor="middle" lines={['still', 'stuck']} size={15} colour={muted} />
    <Lines x={140} y={290} anchor="middle" lines={['black back']} size={14} />
    <Lines x={400} y={290} anchor="middle" lines={['white back']} size={14} />
  </PhysicsDiagram>
}

function Link() {
  const Panel = ({ x, into }: { x: number; into: boolean }) => <g>
    <rect x={x} y={14} width={236} height={200} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <rect x={into ? x + 150 : x + 30} y={44} width={56} height={140} rx="6" fill={surfaces.black.fill} stroke={surfaces.black.line} strokeWidth="2" />
    {[74, 114, 154].map(y => into
      ? <WaveArrow key={y} from={[x + 22, y]} to={[x + 146, y]} wavelength={11} amp={4} colour={ir} width={2.6} />
      : <WaveArrow key={y} from={[x + 92, y]} to={[x + 216, y]} wavelength={11} amp={4} colour={ir} width={2.6} />)}
    <Lines x={x + 118} y={240} anchor="middle" lines={[into ? 'good absorber' : 'good emitter']} size={16} />
    <Lines x={x + 118} y={260} anchor="middle" lines={[into ? 'takes in infrared' : 'gives out infrared']} size={13} weight={650} colour={muted} />
  </g>
  return <PhysicsDiagram title="Matt black is a good absorber of infrared radiation (this lesson) and a good emitter of infrared radiation (last lesson). Black is both.">
    <Panel x={14} into />
    <Panel x={290} into={false} />
    <rect x={190} y={100} width={160} height={36} rx="18" fill="#fff6e3" stroke="#e7b75e" strokeWidth="1.8" />
    <Lines x={270} y={123} anchor="middle" lines={['black is both']} size={16} />
    <Lines x={270} y={292} anchor="middle" lines={['good at one means good at the other']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Question ---------- */

function QSetup({ assessment }: { assessment: boolean }) {
  const names = ['metal plate', 'wax and ball', 'Bunsen burner flame', 'heat-proof mat']
  const tags: [Pt, Pt, 'start' | 'end'][] = [[[190, 60], [146, 100], 'start'], [[56, 110], [104, 150], 'start'], [[340, 40], [276, 110], 'start'], [[496, 224], [478, 254], 'end']]
  return <PhysicsDiagram title={assessment ? 'The set-up for the infrared absorption practical, with four parts numbered 1 to 4.' : 'The set-up: 1 is a metal plate, 2 is the wax and ball, 3 is the Bunsen burner flame and 4 is the heat-proof mat.'}>
    <Scene waves={0} />
    {tags.map(([p, q, anchor], i) => <g key={i}>
      <path d={`M${p[0]} ${p[1]}L${q[0]} ${q[1]}`} stroke={ink} strokeWidth="1.4" /><circle cx={q[0]} cy={q[1]} r="2.6" fill={ink} />
      <Num n={i + 1} x={p[0]} y={p[1]} />
      {!assessment && <Lines x={anchor === 'start' ? p[0] + 18 : p[0] - 18} y={p[1] + 5} anchor={anchor} lines={[names[i]]} size={13} />}
    </g>)}
  </PhysicsDiagram>
}

export function IrAbsorbVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  const views: Record<string, () => ReactNode> = {
    'irabsorb-idea': () => <Idea />,
    'irabsorb-kit': () => <Kit />,
    'irabsorb-setup': () => <Setup />,
    'irabsorb-wax': () => <WaxView />,
    'irabsorb-distance': () => <Distance />,
    'irabsorb-fall': () => <Fall />,
    'irabsorb-melt': () => <Melt />,
    'irabsorb-result': () => <Result />,
    'irabsorb-link': () => <Link />,
    'irabsorb-q-setup': () => <QSetup assessment={assessment} />,
  }
  return <>{views[focus]?.() ?? null}</>
}
void r1

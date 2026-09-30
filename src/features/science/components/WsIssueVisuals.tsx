import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, Leader } from './PhysicsKit'
import { Arrow, Bust, tones } from './WsKit'
import { Note, Icon, Scientist, Paper, Magnifier, Scale, wsTone, wsFaded, r1, tagWidth, type Tone } from './WsMethodVisuals'

/*
 * Working Scientifically Lesson 2: Communicating science and its issues. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'wsissue-' and is routed from CellBiologyVisuals.tsx.
 *
 * Built on WsKit and the shared pieces in WsMethodVisuals (notes, icons, scientist, paper, magnifier, balance scale).
 * Issue colours, the same in every frame: economic amber, social teal, personal purple, environmental green.
 * Pictures: the scientist telling the public (section 2), a made-up news page (section 3, no real paper's name),
 * four issue tiles (section 4), and the cloud / flask / right-and-wrong scale (section 5).
 */
const P = physicsPalette
const { ink, muted } = P
const W = { skin: '#f3d6bd', skinLine: '#c29274', wood: '#ecd2a6', woodLine: '#a57a43', glass: '#f3f8fb', glassLine: '#7f9db2', drink: '#c98b52', drinkLine: '#8d5a2b' }

type Issue = 'economic' | 'social' | 'personal' | 'environmental'
const issueTone: Record<Issue, Tone> = {
  economic: { fill: P.light, line: P.lightLine },
  social: { fill: P.electrostatic, line: P.electrostaticLine },
  personal: { fill: P.chemical, line: P.chemicalLine },
  environmental: { fill: P.plant, line: P.plantLine },
}

/* ---------- Small pieces ---------- */

/** A test tube; (x, y) is the rounded bottom, tilted by `angle` degrees. */
function TestTube({ x, y, angle = 0, h = 54, liquid = P.chemical, liquidLine = P.chemicalLine }: { x: number; y: number; angle?: number; h?: number; liquid?: string; liquidLine?: string }) {
  return <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path d={`M-8 ${-h * 0.45}V-8A8 8 0 0 0 8 -8V${-h * 0.45}Z`} fill={liquid} stroke="none" />
    <path d={`M-8 ${-h * 0.45}H8`} stroke={liquidLine} strokeWidth="1.4" />
    <path d={`M-8 ${-h}V-8A8 8 0 0 0 8 -8V${-h}`} fill="none" stroke={W.glassLine} strokeWidth="2" />
    <path d={`M-11 ${-h}H11`} stroke={W.glassLine} strokeWidth="2.4" />
  </g>
}
/** A speech bubble centred on (x, y) with a tail towards `tail`. */
function Bubble({ x, y, lines, tail, tone = wsTone.plain, size = 14, icon }: { x: number; y: number; lines: string[]; tail: [number, number]; tone?: Tone; size?: number; icon?: ReactNode }) {
  const w = Math.max(...lines.map(l => l.length)) * size * 0.6 + 32 + (icon ? 34 : 0), lh = size + 4, h = lines.length * lh + 18
  const tx = Math.max(x - w / 2 + 22, Math.min(x + w / 2 - 22, tail[0]))
  const base = tail[1] > y ? y + h / 2 : y - h / 2
  const textX = x - w / 2 + 16 + (icon ? 34 : 0)
  return <g>
    <path d={`M${r1(tx - 9)} ${r1(base)}L${tail[0]} ${tail[1]}L${r1(tx + 9)} ${r1(base)}`} fill="white" stroke={tone.line} strokeWidth="2" />
    <rect x={r1(x - w / 2)} y={r1(y - h / 2)} width={r1(w)} height={h} rx={Math.min(18, h / 2)} fill="white" stroke={tone.line} strokeWidth="2" />
    <path d={`M${r1(tx - 7.5)} ${r1(base)}H${r1(tx + 7.5)}`} stroke="white" strokeWidth="3" />
    {icon && <g transform={`translate(${r1(x - w / 2 + 28)} ${y})`}>{icon}</g>}
    <text x={r1(textX)} y={r1(y - h / 2 + 9 + size)} fontSize={size} fontWeight="750" fill={ink}>
      {lines.map((l, i) => <tspan key={i} x={r1(textX)} dy={i ? lh : 0}>{l}</tspan>)}
    </text>
  </g>
}
function Vial() {
  return <g>
    <rect x="-7" y="-16" width="14" height="6" rx="2" fill={P.hot} stroke={P.hotFill} strokeWidth="0" />
    <path d="M-8 -10H8V11Q8 15 4 15H-4Q-8 15 -8 11Z" fill={W.glass} stroke={W.glassLine} strokeWidth="1.8" />
    <path d="M-8 1H8V11Q8 15 4 15H-4Q-8 15 -8 11Z" fill={P.water} stroke="none" />
    <path d="M-8 -10H8V11Q8 15 4 15H-4Q-8 15 -8 11Z" fill="none" stroke={W.glassLine} strokeWidth="1.8" />
  </g>
}
function Tooth({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-16 -14C-16 -24 -6 -24 0 -19C6 -24 16 -24 16 -14C16 -4 12 2 11 12C10 22 4 22 3 12C2 6 -2 6 -3 12C-4 22 -10 22 -11 12C-12 2 -16 -4 -16 -14Z" fill="white" stroke="#8fa3b3" strokeWidth="2" />
    <path d="M-8 -16Q-4 -18 -1 -15" stroke="#c9d6df" strokeWidth="2" fill="none" />
  </g>
}
function FizzyGlass({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-15 -24L-12 18Q-11.5 22 -8 22H8Q11.5 22 12 18L15 -24Z" fill={W.glass} stroke="none" />
    <path d="M-14 -12L-12 18Q-11.5 22 -8 22H8Q11.5 22 12 18L14 -12Z" fill={W.drink} stroke="none" opacity=".9" />
    {[[-6, 8], [2, 0], [6, 12], [-2, -4]].map(([bx, by], i) => <circle key={i} cx={bx} cy={by} r="2" fill="white" opacity=".85" />)}
    <path d="M-15 -24L-12 18Q-11.5 22 -8 22H8Q11.5 22 12 18L15 -24" fill="none" stroke={W.glassLine} strokeWidth="2" />
    <path d="M6 -34L2 10" stroke="#e0736a" strokeWidth="3" />
  </g>
}
/** A small hand-held blood-test reader. */
function Reader({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-18" y="-26" width="36" height="52" rx="8" fill="#e8eef3" stroke="#6f8292" strokeWidth="2" />
    <rect x="-12" y="-20" width="24" height="18" rx="3" fill="white" stroke="#9fb3c2" strokeWidth="1.4" />
    <path d="M-7 -11H7" stroke={P.useful} strokeWidth="2.4" />
    <path d="M-4 26V34H4V26" fill="white" stroke="#6f8292" strokeWidth="1.6" />
    <path d="M0 8C-4 13 -4 17 0 17C4 17 4 13 0 8Z" fill={P.hot} stroke={P.hot} strokeWidth="1" />
  </g>
}

/* ---------- Section 2: why tell people? ---------- */

function TellScene({ mode }: { mode: 'tell' | 'habits' | 'tech' }) {
  const titles = {
    tell: 'A scientist at a lab bench holds up a test tube. A speech bubble saying "new vaccine works" travels to a group of people. Discoveries can change lives, but only if people hear about them.',
    habits: 'The same scientist and group of people. The bubble now gives advice. Above the people, a glass of fizzy drink is crossed out next to a tooth, with a tag: less sugary drink.',
    tech: 'The scientist tells people about a new blood test. On the right a doctor holds a small blood-test reader beside a patient. Tags say the doctor needs to know how to use it, and the patient what the result means.',
  }
  const crowd = mode !== 'tech'
  return <PhysicsDiagram title={titles[mode]}>
    {/* scientist behind a bench, with a rack of tubes */}
    <Scientist x={74} y={244} s={1.45} />
    <TestTube x={126} y={206} angle={24} liquid={mode === 'tech' ? P.thermal : P.water} liquidLine={mode === 'tech' ? P.thermalLine : P.waterLine} />
    <path d="M104 214Q114 206 124 206" stroke={W.skinLine} strokeWidth="9" />
    <path d="M104 214Q114 206 124 206" stroke={W.skin} strokeWidth="6" />
    <rect x={8} y={236} width={196} height={20} rx="5" fill={W.wood} stroke={W.woodLine} strokeWidth="2" />
    <g transform="translate(166 236)">
      <rect x="-26" y="-18" width="52" height="8" rx="2" fill={W.wood} stroke={W.woodLine} strokeWidth="1.6" />
      <TestTube x={-14} y={-2} h={40} liquid={P.chemical} liquidLine={P.chemicalLine} />
      <TestTube x={4} y={-2} h={40} liquid={P.plant} liquidLine={P.plantLine} />
      <TestTube x={22} y={-2} h={40} liquid={P.light} liquidLine={P.lightLine} />
    </g>
    <text x={80} y={278} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>scientist</text>

    {/* the message travels */}
    {mode === 'tech'
      ? <g><path d="M138 150Q220 74 318 128" stroke="#9fb3c2" strokeWidth="2.2" strokeDasharray="3 7" fill="none" /><Arrow from={[304, 118]} to={[324, 132]} colour="#9fb3c2" width={2.2} /></g>
      : <g><path d="M138 150Q240 64 382 150" stroke="#9fb3c2" strokeWidth="2.2" strokeDasharray="3 7" fill="none" /><Arrow from={[364, 138]} to={[384, 152]} colour="#9fb3c2" width={2.2} /></g>}

    {crowd && <g>
      <Bust x={428} y={228} s={1} kind={3} />
      <Bust x={486} y={228} s={1} kind={4} />
      <Bust x={398} y={260} s={1.1} kind={0} />
      <Bust x={456} y={260} s={1.1} kind={1} />
      <Bust x={514} y={260} s={1.1} kind={2} />
      <text x={456} y={284} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>the public</text>
    </g>}

    {mode === 'tell' && <g>
      <Bubble x={262} y={96} lines={['new vaccine works']} tail={[250, 132]} tone={wsTone.test} icon={<Vial />} />
      <Note x={270} y={30} lines={['discoveries change lives']} tone={wsTone.evidence} icon="tick" />
    </g>}
    {mode === 'habits' && <g>
      <Bubble x={236} y={92} lines={['advice:', 'fewer sugary drinks']} tail={[236, 132]} tone={wsTone.hypothesis} icon={<Icon kind="bulb" x={0} y={0} colour={P.lightLine} />} />
      <FizzyGlass x={410} y={110} s={1.1} />
      <g transform="translate(428 84)"><circle r="12" fill={tones.bad.fill} stroke={tones.bad.line} strokeWidth="2" /><path d="M-4.5 -4.5l9 9M4.5 -4.5l-9 9" stroke={tones.bad.line} strokeWidth="3" /></g>
      <Tooth x={488} y={112} s={1.1} />
      <Note x={452} y={34} lines={['less sugary drink']} tone={wsTone.evidence} size={13} />
    </g>}
    {mode === 'tech' && <g>
      <Bubble x={236} y={96} lines={['new blood test']} tail={[236, 134]} tone={wsTone.test} />
      <Scientist x={404} y={260} s={1.1} kind={1} />
      <path d="M394 232Q390 246 398 252Q406 246 402 232" fill="none" stroke="#5a6b79" strokeWidth="1.8" />
      <Bust x={500} y={260} s={1.1} kind={5} />
      <Reader x={452} y={212} />
      <Note x={396} y={168} lines={['how to use it']} tone={wsTone.plain} size={13} />
      <Note x={430} y={124} lines={['what the result means']} tone={wsTone.plain} size={13} />
      <Leader from={[494, 138]} to={[500, 196]} colour={muted} />
      <text x={404} y={284} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>doctor</text>
      <text x={500} y={284} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>patient</text>
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 3: can you trust the headline? ---------- */

/** A made-up news page; (x, y) is its top-left. */
function NewsPage({ x, y, w = 250, h = 256, headline, sub, small, hiSmall = false, picture, dim = false }: {
  x: number; y: number; w?: number; h?: number; headline: string[]; sub?: string; small?: string[]; hiSmall?: boolean; picture?: ReactNode; dim?: boolean
}) {
  const hy = y + 68, subY = hy + (headline.length - 1) * 26 + 22, py = subY + 14
  const smallY = y + h - 16 - ((small?.length ?? 1) - 1) * 16
  return <g opacity={dim ? wsFaded : 1}>
    <rect x={x + 5} y={y + 6} width={w} height={h} rx="8" fill="#dfe6ec" />
    <rect x={x} y={y} width={w} height={h} rx="8" fill="white" stroke="#9fb3c2" strokeWidth="2" />
    <path d={`M${x} ${y + 34}V${y + 8}Q${x} ${y} ${x + 8} ${y}H${x + w - 8}Q${x + w} ${y} ${x + w} ${y + 8}V${y + 34}Z`} fill="#eef3f7" />
    <text x={x + 14} y={y + 24} fontSize="16" fontWeight="850" letterSpacing="3" fill={muted}>NEWS</text>
    <path d={`M${x + w - 90} ${y + 18}H${x + w - 14}`} stroke="#c3d0da" strokeWidth="3" />
    <path d={`M${x} ${y + 34}H${x + w}`} stroke="#9fb3c2" strokeWidth="1.6" />
    <text x={x + 14} y={hy} fontSize="23" fontWeight="850" fill={ink}>{headline.map((l, i) => <tspan key={i} x={x + 14} dy={i ? 26 : 0}>{l}</tspan>)}</text>
    {sub && <text x={x + 14} y={subY} fontSize="13" fontStyle="italic" fontWeight="600" fill={muted}>{sub}</text>}
    <rect x={x + 14} y={py} width="78" height="64" rx="5" fill="#f2f7fa" stroke="#c3d0da" strokeWidth="1.4" />
    {picture && <g transform={`translate(${x + 53} ${py + 34})`}>{picture}</g>}
    {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M${x + 104} ${py + 6 + i * 13}H${x + w - (i === 4 ? 50 : 16)}`} stroke="#c9d6df" strokeWidth="3" />)}
    {small && <g>
      {hiSmall && <rect x={x + 8} y={smallY - 15} width={w - 16} height={small.length * 16 + 8} rx="6" fill={tones.mark.fill} stroke={tones.mark.line} strokeWidth="1.6" />}
      <text x={x + 14} y={smallY} fontSize="12.5" fontWeight={hiSmall ? 750 : 600} fill={hiSmall ? ink : muted}>{small.map((l, i) => <tspan key={i} x={x + 14} dy={i ? 16 : 0}>{l}</tspan>)}</text>
    </g>}
  </g>
}
function Bottle() {
  return <g>
    <path d="M-4 -26H4V-18Q12 -14 12 -6V20Q12 24 8 24H-8Q-12 24 -12 20V-6Q-12 -14 -4 -18Z" fill={P.electrostatic} stroke={P.electrostaticLine} strokeWidth="1.8" />
    <rect x="-12" y="-2" width="24" height="12" fill="white" stroke={P.electrostaticLine} strokeWidth="1.4" />
  </g>
}
function MiniNewspaper({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-30 -24H24Q30 -24 30 -18V20Q30 26 24 26H-24Q-30 26 -30 20Z" fill="white" stroke="#6f8292" strokeWidth="2" />
    <path d="M-22 -14H22" stroke={ink} strokeWidth="4" />
    <rect x="-22" y="-4" width="18" height="16" rx="2" fill="#dfe6ec" />
    {[-2, 5, 12].map(ly => <path key={ly} d={`M2 ${ly}H22`} stroke="#b8c7d2" strokeWidth="2.4" />)}
  </g>
}
function MiniTV({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-34" y="-26" width="68" height="46" rx="7" fill="#3d5163" stroke="#2d3d4b" strokeWidth="2" />
    <rect x="-28" y="-20" width="56" height="34" rx="3" fill="#dcecf8" />
    <path d="M-20 4Q-10 -10 0 -2T20 -8" stroke={P.waterLine} strokeWidth="2.4" fill="none" />
    <path d="M-10 20L-14 28H14L10 20" fill="#c9d4dd" stroke="#6f8292" strokeWidth="1.8" />
  </g>
}
function MiniWeb({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-34" y="-26" width="68" height="52" rx="6" fill="white" stroke="#6f8292" strokeWidth="2" />
    <path d="M-34 -14H34" stroke="#6f8292" strokeWidth="1.6" />
    {[-27, -20, -13].map(cx => <circle key={cx} cx={cx} cy={-20} r="2.2" fill="#9fb3c2" />)}
    <path d="M-26 -4H26" stroke={ink} strokeWidth="3.4" />
    {[6, 13].map(ly => <path key={ly} d={`M-26 ${ly}H${ly === 13 ? 10 : 26}`} stroke="#b8c7d2" strokeWidth="2.4" />)}
  </g>
}
function Scissors({ x, y, angle = 0 }: { x: number; y: number; angle?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path d="M0 0L30 -9M0 0L30 9" stroke="#6f8292" strokeWidth="4" />
    <path d="M0 0L30 -9M0 0L30 9" stroke="#dfe5ea" strokeWidth="1.6" />
    <circle cx="-9" cy="-8" r="7" fill="white" stroke={P.hot} strokeWidth="3" />
    <circle cx="-9" cy="8" r="7" fill="white" stroke={P.hot} strokeWidth="3" />
    <circle cx="1" cy="0" r="2" fill="#6f8292" />
  </g>
}
const PAGE = { headline: ['Drink boosts', 'memory!'], sub: 'scientists say', picture: <Bottle /> }
function Media() {
  return <PhysicsDiagram title='A made-up news page with a big headline, "Drink boosts memory!", and the small words "scientists say". On the right, a newspaper, a TV and a website are grouped together as the media.'>
    <NewsPage x={22} y={20} {...PAGE} small={['Tests on a new drink...']} />
    <Note x={414} y={52} lines={['the media']} tone={wsTone.test} size={15} />
    <path d="M334 96Q334 84 346 84H482Q494 84 494 96" stroke={P.waterLine} strokeWidth="2" fill="none" />
    <MiniNewspaper x={334} y={148} />
    <MiniTV x={414} y={144} />
    <MiniWeb x={494} y={146} />
    {[[334, 'newspaper'], [414, 'TV'], [494, 'website']].map(([lx, t]) => <text key={t as string} x={lx as number} y={202} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>{t as string}</text>)}
    <Lines x={414} y={246} anchor="middle" lines={['reports can be misleading']} size={14} weight={700} colour={ink} />
  </PhysicsDiagram>
}
function Oversimple() {
  return <PhysicsDiagram title='The same news page. The small print at the bottom is highlighted: only 10 people were tested, for 2 days. On the right, scissors cut the words "important details" out of the headline story: it is oversimplified.'>
    <NewsPage x={22} y={20} {...PAGE} small={['only 10 people tested,', 'for 2 days']} hiSmall />
    <Note x={414} y={50} lines={['oversimplified']} tone={wsTone.bad} size={15} icon="warn" />
    <g>
      <rect x={326} y={120} width={176} height={42} rx="8" fill="white" stroke="#9fb3c2" strokeWidth="2" strokeDasharray="6 5" />
      <text x={414} y={146} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>important details</text>
      <Scissors x={306} y={141} angle={0} />
    </g>
    <Lines x={414} y={206} anchor="middle" lines={['left out of the headline,', 'so people get the wrong idea']} size={13.5} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function Evidence({ n, good }: { n: number; good: boolean }) {
  const c = good ? P.useful : P.wasted
  return <g>{Array.from({ length: n }, (_, i) => {
    const dx = [-24, 0, 24, -12, 12][i], dy = [-30, -30, -30, -58, -58][i]
    return <g key={i} transform={`translate(${dx - 11} ${dy})`}>
      <rect width="22" height="28" rx="3" fill="white" stroke={c} strokeWidth="1.6" />
      <path d="M5 15l4 4l8 -9" stroke={c} strokeWidth="2.2" fill="none" />
    </g>
  })}</g>
}
function Bias() {
  return <PhysicsDiagram title="A balance scale. One pan holds a big heap of evidence for an idea. The other pan, evidence against, is left empty, as if it did not exist. This is biased: one side is ignored.">
    <Note x={270} y={28} lines={['biased: one side ignored']} tone={wsTone.bad} size={15} icon="cross" />
    <Scale x={270} y={96} tilt={.85} span={250} leftTone={wsTone.good} rightTone={wsTone.bad}
      leftLabel="evidence for" rightLabel="evidence against"
      left={<Evidence n={5} good />}
      right={<g><rect x="-26" y="-34" width="52" height="30" rx="6" fill="none" stroke="#9fb3c2" strokeWidth="1.8" strokeDasharray="5 5" /><text y="-12" textAnchor="middle" fontSize="18" fontWeight="800" fill={muted}>?</text></g>} />
    <Lines x={395} y={196} anchor="middle" lines={['(left out)']} size={13} weight={700} colour={muted} />
  </PhysicsDiagram>
}
function BiasExamples() {
  const g = (x: number, y: number) => {
    const lines: [string, string, number][] = [
      [`M${x} ${y + 60}Q${x + 50} ${y + 50} ${x + 80} ${y + 20}T${x + 150} ${y - 10}`, P.hot, 3.6],
      [`M${x} ${y + 64}Q${x + 60} ${y + 70} ${x + 100} ${y + 58}T${x + 150} ${y + 66}`, '#b8c7d2', 2.4],
      [`M${x} ${y + 40}Q${x + 50} ${y + 46} ${x + 90} ${y + 56}T${x + 150} ${y + 72}`, '#b8c7d2', 2.4],
    ]
    return <g>
      <path d={`M${x - 6} ${y - 20}V${y + 82}H${x + 160}`} stroke={ink} strokeWidth="1.8" fill="none" />
      {lines.map(([d, c, w], i) => <path key={i} d={d} stroke={c} strokeWidth={w} fill="none" />)}
    </g>
  }
  return <PhysicsDiagram title="Two ways a report can be biased. Left: a graph with three lines, where only one pattern is talked about and the others are greyed out. Right: a page with a column of evidence for and a hand covering the evidence against. Below, a magnifying glass asks: is anything missing?">
    <rect x={14} y={14} width={246} height={196} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
    {g(52, 58)}
    <Lines x={137} y={182} anchor="middle" lines={['talks about one pattern only']} size={13.5} />
    <rect x={280} y={14} width={246} height={196} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.6" />
    <rect x={318} y={30} width={170} height={120} rx="6" fill="white" stroke="#9fb3c2" strokeWidth="1.8" />
    <path d="M403 30V150M318 52H488" stroke="#c3d0da" strokeWidth="1.6" />
    <text x={360} y={46} textAnchor="middle" fontSize="12.5" fontWeight="750" fill={P.useful}>for</text>
    <text x={446} y={46} textAnchor="middle" fontSize="12.5" fontWeight="750" fill={P.wasted}>against</text>
    {[66, 84, 102, 120, 138].map(ly => <path key={ly} d={`M330 ${ly}H390`} stroke="#b8c7d2" strokeWidth="2.6" />)}
    {/* a hand covering the "against" column */}
    <path d="M410 150C408 118 410 92 416 70C418 62 426 62 427 70L428 88C430 62 440 62 441 72L442 92C444 68 454 68 455 78L456 96C458 76 468 78 468 88L468 120C468 136 462 150 456 158Z" fill={W.skin} stroke={W.skinLine} strokeWidth="2" />
    <Lines x={403} y={182} anchor="middle" lines={['no evidence against']} size={13.5} />
    <Magnifier x={174} y={254} r={20} angle={-35} />
    <Note x={318} y={256} lines={['is anything missing?']} tone={wsTone.hypothesis} size={14} icon="question" />
  </PhysicsDiagram>
}

/* ---------- Section 4: four kinds of issue ---------- */

function Hospital() {
  return <g>
    <path d="M14 150V78H70V150Z" fill="white" stroke="#8aa0b1" strokeWidth="2" />
    <path d="M28 70H56V78H28Z" fill="#e8eef3" stroke="#8aa0b1" strokeWidth="1.6" />
    <rect x="33" y="86" width="18" height="18" rx="2" fill={P.hotFill} stroke={P.hot} strokeWidth="1.4" />
    <path d="M42 89V101M36 95H48" stroke={P.hot} strokeWidth="3.4" />
    {[22, 50].map(wx => [112, 128].map(wy => <rect key={`${wx}-${wy}`} x={wx} y={wy} width="12" height="10" rx="1.5" fill="#dcecf8" stroke="#8aa0b1" strokeWidth="1.2" />))}
    <path d="M36 150V136H48V150" fill="#e8eef3" stroke="#8aa0b1" strokeWidth="1.4" />
    {[0, 1, 2, 3].map(i => <g key={i}><ellipse cx="96" cy={146 - i * 8} rx="15" ry="5" fill="#f6d27a" stroke={P.lightLine} strokeWidth="1.6" /></g>)}
    <ellipse cx="96" cy={114} rx="15" ry="5" fill="#fbe39a" stroke={P.lightLine} strokeWidth="1.6" />
    <text x="96" y="104" textAnchor="middle" fontSize="15" fontWeight="850" fill={P.lightLine}>£</text>
  </g>
}
function SocialTile() {
  return <g>
    <g transform="translate(62 76)">
      <path d="M-4 -24H4V-16Q12 -12 12 -4V22Q12 26 8 26H-8Q-12 26 -12 22V-4Q-12 -12 -4 -16Z" fill="#e3b58a" stroke={W.drinkLine} strokeWidth="1.8" />
      <rect x="-12" y="0" width="24" height="12" fill="white" stroke={W.drinkLine} strokeWidth="1.2" />
      <path d="M12 -6H18" stroke={P.electrostaticLine} strokeWidth="1.6" />
      <rect x="18" y="-16" width="38" height="20" rx="5" fill="white" stroke={P.electrostaticLine} strokeWidth="1.8" />
      <text x="37" y="-1.5" textAnchor="middle" fontSize="12.5" fontWeight="850" fill={P.electrostaticLine}>+tax</text>
    </g>
    <Bust x={30} y={158} s={.62} kind={0} />
    <Bust x={62} y={158} s={.62} kind={2} />
    <Bust x={94} y={158} s={.62} kind={4} />
  </g>
}
function PersonalTile() {
  return <g>
    <path d="M10 150V102L38 80L66 102V150Z" fill="#f7ebe0" stroke="#a57a43" strokeWidth="2" />
    <path d="M6 104L38 76L70 104" fill="none" stroke="#a05a3c" strokeWidth="3.4" />
    <rect x="22" y="106" width="26" height="22" rx="2" fill="#dcecf8" stroke="#8aa0b1" strokeWidth="1.6" />
    <circle cx="35" cy="116" r="5.5" fill={W.skin} stroke={W.skinLine} strokeWidth="1.2" />
    <path d="M27 128Q35 119 43 128" fill={P.chemical} stroke={P.chemicalLine} strokeWidth="1.2" />
    <path d="M52 150V136H62V150" fill="#e8eef3" stroke="#a57a43" strokeWidth="1.4" />
    <path d="M97 150L99 70H101L103 150Z" fill="white" stroke="#8aa0b1" strokeWidth="1.6" />
    {[0, 120, 240].map(a => <path key={a} d="M100 70C98 60 99 46 100 36C103 48 103 60 100 70Z" fill="white" stroke="#8aa0b1" strokeWidth="1.6" transform={`rotate(${a + 20} 100 70)`} />)}
    <circle cx="100" cy="70" r="3.4" fill="#8aa0b1" />
    <path d="M78 58q-6 6 0 12M72 54q-9 10 0 20" stroke={P.chemicalLine} strokeWidth="1.8" fill="none" />
  </g>
}
function EnvironmentTile() {
  return <g>
    <path d="M4 108Q60 94 120 106V124H4Z" fill={P.plant} stroke={P.plantLine} strokeWidth="1.6" />
    {[18, 34, 50, 66, 82].map(cx => <path key={cx} d={`M${cx} 108V96M${cx} 102q-5 -4 -6 -9M${cx} 100q5 -4 6 -9`} stroke={P.plantLine} strokeWidth="1.6" fill="none" />)}
    <g transform="translate(100 88)">
      <path d="M-11 -18H11L13 14Q13 17 10 17H-10Q-13 17 -13 14Z" fill="#f1e6d9" stroke="#8a6443" strokeWidth="1.6" />
      <path d="M-11 -18Q0 -24 11 -18" fill="none" stroke="#8a6443" strokeWidth="1.6" />
      <path d="M-4 22l-2 4M2 24l0 4M7 22l2 4" stroke="#8a6443" strokeWidth="1.6" />
    </g>
    <path d="M4 128Q60 122 120 130V152Q120 158 114 158H10Q4 158 4 152Z" fill={P.water} stroke={P.waterLine} strokeWidth="1.6" />
    <path d="M86 118Q84 124 90 130" stroke="#b58f5a" strokeWidth="2" strokeDasharray="2 4" fill="none" />
    <g transform="translate(46 143)">
      <path d="M-14 0Q-4 -9 8 0Q-4 9 -14 0Z" fill="#f4b183" stroke="#c8671f" strokeWidth="1.4" />
      <path d="M8 0L15 -6V6Z" fill="#f4b183" stroke="#c8671f" strokeWidth="1.4" />
      <circle cx="-8" cy="-1.5" r="1.4" fill={ink} />
    </g>
  </g>
}
const ISSUES: { key: Issue; name: string; tag: string; example: string; draw: ReactNode }[] = [
  { key: 'economic', name: 'economic', tag: 'can we afford it?', example: 'a medicine may cost too much to give to everyone', draw: <Hospital /> },
  { key: 'social', name: 'social', tag: 'affects people in general', example: 'a tax on sugary drinks changes prices for everyone', draw: <SocialTile /> },
  { key: 'personal', name: 'personal', tag: 'affects an individual', example: 'a family may not like a wind farm next door', draw: <PersonalTile /> },
  { key: 'environmental', name: 'environmental', tag: 'effect on the environment', example: 'fertiliser can wash off fields into rivers', draw: <EnvironmentTile /> },
]
function Issues({ on }: { on: Issue }) {
  const cur = ISSUES.find(i => i.key === on)!, idx = ISSUES.indexOf(cur)
  const tileX = (i: number) => 8 + i * 132, cx = tileX(idx) + 62
  const half = tagWidth([cur.tag], 15) / 2 + 6, noteX = Math.max(half, Math.min(540 - half, cx))
  return <PhysicsDiagram title={`Four tiles for the four kinds of issue science can raise: economic, social, personal and environmental. The ${cur.name} tile is highlighted: ${cur.tag}. For example, ${cur.example}.`}>
    {ISSUES.map((it, i) => {
      const t = issueTone[it.key], active = it.key === on, x = tileX(i)
      return <g key={it.key} opacity={active ? 1 : wsFaded + .07}>
        <rect x={x} y={12} width={124} height={172} rx="16" fill={active ? t.fill : P.panel} fillOpacity={active ? .45 : 1} stroke={t.line} strokeWidth={active ? 2.6 : 1.6} />
        <text x={x + 62} y={36} textAnchor="middle" fontSize="14" fontWeight="800" fill={t.line}>{it.name}</text>
        <g transform={`translate(${x} 20)`}>{it.draw}</g>
      </g>
    })}
    <Arrow from={[cx, 190]} to={[noteX, 212]} colour={issueTone[on].line} width={2.4} />
    <Note x={noteX} y={234} lines={[cur.tag]} tone={issueTone[on]} size={15} />
    <Lines x={270} y={282} anchor="middle" lines={[`e.g. ${cur.example}`]} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 5: can science answer everything? ---------- */

function Cloud({ x, y, dim = false }: { x: number; y: number; dim?: boolean }) {
  return <g opacity={dim ? wsFaded : 1}>
    <path d={`M${x - 70} ${y + 22}C${x - 92} ${y + 20} ${x - 92} ${y - 12} ${x - 66} ${y - 14}C${x - 64} ${y - 40} ${x - 30} ${y - 44} ${x - 16} ${y - 28}C${x - 4} ${y - 50} ${x + 36} ${y - 46} ${x + 40} ${y - 22}C${x + 66} ${y - 30} ${x + 88} ${y - 4} ${x + 70} ${y + 14}C${x + 78} ${y + 34} ${x + 50} ${y + 42} ${x + 36} ${y + 32}C${x + 20} ${y + 46} ${x - 20} ${y + 44} ${x - 30} ${y + 32}C${x - 44} ${y + 42} ${x - 66} ${y + 38} ${x - 70} ${y + 22}Z`} fill="#f2f7fa" stroke="#9fb3c2" strokeWidth="2" />
    <text x={x} y={y - 4} textAnchor="middle" fontSize="13.5" fontWeight="750" fill={ink}>how did life</text>
    <text x={x} y={y + 14} textAnchor="middle" fontSize="13.5" fontWeight="750" fill={ink}>begin on Earth?</text>
  </g>
}
function DataJar({ x, y, dim = false }: { x: number; y: number; dim?: boolean }) {
  const dots: [number, number][] = [[-20, 40], [-6, 42], [8, 40], [22, 42], [-14, 30], [0, 30], [14, 30], [-22, 20], [-6, 18], [20, 22], [6, 10]]
  return <g opacity={dim ? wsFaded : 1}>
    <rect x={x - 22} y={y - 50} width="44" height="10" rx="3" fill="#c9d4dd" stroke="#6f8292" strokeWidth="1.8" />
    <path d={`M${x - 30} ${y - 38}Q${x - 36} ${y - 30} ${x - 36} ${y - 18}V${y + 44}Q${x - 36} ${y + 54} ${x - 26} ${y + 54}H${x + 26}Q${x + 36} ${y + 54} ${x + 36} ${y + 44}V${y - 18}Q${x + 36} ${y - 30} ${x + 30} ${y - 38}Z`} fill={W.glass} stroke={W.glassLine} strokeWidth="2.2" />
    <path d={`M${x - 36} ${y + 2}H${x + 36}`} stroke={W.glassLine} strokeWidth="1.4" strokeDasharray="4 4" />
    {dots.map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="5" fill={tones.measure.fill} stroke={tones.measure.line} strokeWidth="1.5" />)}
    <text x={x} y={y - 16} textAnchor="middle" fontSize="18" fontWeight="800" fill="#9fb3c2">?</text>
  </g>
}
function Flask({ x, y, dim = false }: { x: number; y: number; dim?: boolean }) {
  return <g opacity={dim ? wsFaded : 1}>
    <path d={`M${x - 10} ${y - 50}V${y - 22}L${x - 38} ${y + 30}Q${x - 42} ${y + 40} ${x - 30} ${y + 40}H${x + 30}Q${x + 42} ${y + 40} ${x + 38} ${y + 30}L${x + 10} ${y - 22}V${y - 50}`} fill={W.glass} stroke="none" />
    <path d={`M${x - 26} ${y + 8}L${x - 38} ${y + 30}Q${x - 42} ${y + 40} ${x - 30} ${y + 40}H${x + 30}Q${x + 42} ${y + 40} ${x + 38} ${y + 30}L${x + 26} ${y + 8}Z`} fill={P.water} stroke="none" />
    <path d={`M${x - 10} ${y - 50}V${y - 22}L${x - 38} ${y + 30}Q${x - 42} ${y + 40} ${x - 30} ${y + 40}H${x + 30}Q${x + 42} ${y + 40} ${x + 38} ${y + 30}L${x + 10} ${y - 22}V${y - 50}`} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    <path d={`M${x - 15} ${y - 50}H${x + 15}`} stroke={W.glassLine} strokeWidth="2.6" />
    <circle cx={x - 8} cy={y + 22} r="3" fill="white" /><circle cx={x + 10} cy={y + 14} r="2.2" fill="white" />
  </g>
}
function RightWrong({ x, y, dim = false }: { x: number; y: number; dim?: boolean }) {
  const pan = (px: number, label: string, c: string) => <g>
    <path d={`M${px} ${y}L${px - 26} ${y + 42}M${px} ${y}L${px + 26} ${y + 42}`} stroke="#8a9aa7" strokeWidth="1.5" />
    <path d={`M${px - 32} ${y + 42}Q${px} ${y + 58} ${px + 32} ${y + 42}Z`} fill="white" stroke={c} strokeWidth="2" />
    <text x={px} y={y + 76} textAnchor="middle" fontSize="13" fontWeight="750" fill={c}>{label}</text>
  </g>
  return <g opacity={dim ? wsFaded : 1}>
    <path d={`M${x} ${y - 6}V${y + 92}`} stroke="#8a6443" strokeWidth="5" />
    <path d={`M${x - 30} ${y + 96}Q${x} ${y + 88} ${x + 30} ${y + 96}Z`} fill="#e9d6bd" stroke="#8a6443" strokeWidth="2" />
    <path d={`M${x - 56} ${y}H${x + 56}`} stroke="#6d5238" strokeWidth="4.4" />
    <circle cx={x} cy={y - 6} r="5" fill="#e9d6bd" stroke="#6d5238" strokeWidth="2" />
    {pan(x - 56, 'right', P.useful)}
    {pan(x + 56, 'wrong', P.wasted)}
  </g>
}
function Limits({ mode }: { mode: 'unknown' | 'ethics' }) {
  const unknown = mode === 'unknown'
  return <PhysicsDiagram title={unknown
    ? 'Left: a cloud asks how life began on Earth, above a jar only partly filled with data points. Not enough data yet. On the right, faded, a flask and a right-or-wrong balance.'
    : 'A flask with a tick: experiments can show what happens. A balance marked right and wrong with a question mark: experiments cannot decide this. The cloud on the left is faded.'}>
    <Cloud x={100} y={62} dim={!unknown} />
    <DataJar x={100} y={172} dim={!unknown} />
    {unknown && <Note x={110} y={268} lines={['not enough data yet']} tone={wsTone.hypothesis} size={13} icon="question" />}
    <path d="M218 24V276" stroke={P.panelLine} strokeWidth="2" strokeDasharray="4 6" />
    <Flask x={290} y={118} dim={unknown} />
    <RightWrong x={440} y={104} dim={unknown} />
    {!unknown && <g>
      <Note x={290} y={32} lines={['grows faster?']} tone={wsTone.test} size={13} />
      <Note x={440} y={32} lines={['is it right?']} tone={wsTone.predict} size={13} />
      <Icon kind="tick" x={324} y={80} colour={P.useful} s={1.3} />
      <Lines x={290} y={196} anchor="middle" lines={['experiments can', 'show what happens']} size={13.5} />
      <Note x={440} y={236} lines={['experiments cannot', 'decide this']} tone={wsTone.predict} size={13.5} />
      <Lines x={440} y={284} anchor="middle" lines={['an ethical question']} size={13} weight={750} colour={P.chemicalLine} />
    </g>}
  </PhysicsDiagram>
}
function Decide() {
  return <PhysicsDiagram title="Scientists, the government and members of the public sit round a table. An arrow brings evidence from a data sheet to the table. A speech bubble says the aim: a decision most people can live with.">
    <Paper x={20} y={110} w={64} h={82} lines={5} tone={wsTone.evidence} title="evidence" />
    <Arrow from={[94, 150]} to={[168, 178]} colour={wsTone.evidence.line} width={2.6} bend={-.12} />
    <Scientist x={196} y={212} s={1.05} />
    <Bust x={298} y={212} s={1.05} kind={5} />
    <path d="M298 186L294 200L298 208L302 200Z" fill={P.gravitationalLine} />
    <Bust x={386} y={212} s={1.05} kind={1} />
    <Bust x={462} y={212} s={1.05} kind={2} />
    <ellipse cx={332} cy={220} rx="172" ry="26" fill={W.wood} stroke={W.woodLine} strokeWidth="2.2" />
    <path d="M222 240V256M442 240V256" stroke={W.woodLine} strokeWidth="5" />
    {[[190, 'scientists'], [302, 'government'], [424, 'the public']].map(([lx, t]) => <text key={t as string} x={lx as number} y={278} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>{t as string}</text>)}
    <Bubble x={354} y={56} lines={['a decision most people', 'can live with']} tail={[338, 132]} tone={wsTone.evidence} size={14.5} />
  </PhysicsDiagram>
}

/* ---------- Question visual ---------- */

function QHeadline() {
  return <PhysicsDiagram schematic={false} title="A news card with a headline and small print about a study on chewing gum.">
    <NewsPage x={100} y={16} w={340} h={264} headline={['Chewing gum makes', 'pupils cleverer!']}
      picture={<g><Bust x={0} y={26} s={.8} kind={1} /><circle cx={16} cy={-10} r="7" fill={P.elastic} stroke={P.elasticLine} strokeWidth="1.6" /></g>}
      small={['Tested on 8 pupils. Maths scores rose', 'for 6 pupils and fell for 2.']} />
  </PhysicsDiagram>
}

export function WsIssueVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wsissue-tell': return <TellScene mode="tell" />
    case 'wsissue-habits': return <TellScene mode="habits" />
    case 'wsissue-tech': return <TellScene mode="tech" />
    case 'wsissue-media': return <Media />
    case 'wsissue-oversimple': return <Oversimple />
    case 'wsissue-bias': return <Bias />
    case 'wsissue-biasex': return <BiasExamples />
    case 'wsissue-economic': return <Issues on="economic" />
    case 'wsissue-social': return <Issues on="social" />
    case 'wsissue-personal': return <Issues on="personal" />
    case 'wsissue-environmental': return <Issues on="environmental" />
    case 'wsissue-unknown': return <Limits mode="unknown" />
    case 'wsissue-ethics': return <Limits mode="ethics" />
    case 'wsissue-decide': return <Decide />
    case 'wsissue-q-headline': return <QHeadline />
    default: return null
  }
}

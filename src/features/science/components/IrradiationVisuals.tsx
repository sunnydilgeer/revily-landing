import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, type Pt } from './PhysicsKit'
import { Arrow, Chip, seeded, r1, faded } from './GasParticleVisuals'
import { Person, Tick, skin, skinLine } from './EnergyStoreVisuals'
import { Nucleus, Ray, Source, Trefoil, radiation } from './HalfLifeVisuals'

/*
 * Physics Lesson 37: Irradiation and contamination. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'irrad-' and is routed from CellBiologyVisuals.tsx.
 *
 * Radiation pieces come from the half-life lesson: radioactive atoms are orange-red nuclei, radiation is a thin
 * wavy orange-red ray, the sealed source carries the trefoil sign. Lead is slate grey, the body a soft skin tint.
 * The comparison grid (section 4) keeps one layout: columns alpha, beta, gamma; rows outside, inside the body.
 */
const P = physicsPalette
const { ink, muted } = P
const lead = '#8792a0', leadLine = '#4f5b68', leadFill = '#c9d0d8'
const body = '#fbe4d3', bodyLine = '#d9a988'
const suit = '#f4f1dc', suitLine = '#9b9368', glove = '#b9d3f0', gloveLine = '#3f6fa3'

/** A green apple (food is a common thing to irradiate); (x, y) = its middle. */
function Apple({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -18C-9 -24 -24 -19 -23 -4C-22 12 -10 22 0 17C10 22 22 12 23 -4C24 -19 9 -24 0 -18Z" fill="#d7eab0" stroke="#6f9a3a" strokeWidth="2" />
    <path d="M0 -18Q1 -26 5 -29" stroke="#8a6443" strokeWidth="2.2" fill="none" />
    <path d="M4 -24Q13 -31 18 -23Q10 -19 4 -24Z" fill={P.plant} stroke={P.plantLine} strokeWidth="1.4" />
    <ellipse cx="-10" cy="-7" rx="4" ry="6" fill="white" opacity=".6" />
  </g>
}

/* ---------- Section 2: irradiation ---------- */

function Exposed() {
  return <PhysicsDiagram title="A radioactive source outside an apple. Radiation from the source reaches the apple: the apple is irradiated, exposed to radiation. The source stays outside.">
    <Source x={180} y={150} s={1.3} />
    {[-40, -14, 12, 38].map((dy, i) => <Ray key={i} from={[196, 150 + dy * 0.25]} to={[340, 150 + dy]} waves={4} />)}
    <Apple x={392} y={150} s={1.8} />
    <Lines x={110} y={210} anchor="middle" lines={['source stays', 'outside']} size={14} weight={650} colour={muted} />
    <Lines x={392} y={218} anchor="middle" lines={['apple']} size={14} weight={650} colour={muted} />
    <Chip x={270} y={270} text="irradiated = exposed to radiation" size={15} line={radiation.line} colour={radiation.line} fill={radiation.soft} />
  </PhysicsDiagram>
}

function Distance() {
  // Three rows, the same source in each; the apple sits further away each time and the rays spread out.
  const rows = [48, 136, 224], fan = (y: number, lens: number[]) => lens.map((len, i) => {
    const n = lens.length, a = (i - (n - 1) / 2) * 0.13
    return <Ray key={i} from={[98, y + (i - (n - 1) / 2) * 2]} to={[r1(98 + Math.cos(a) * len), r1(y + Math.sin(a) * len)]} waves={Math.max(2, Math.round(len / 34))} amp={2.4} width={2} />
  })
  return <PhysicsDiagram title="The same source with an apple near it, further away, and far away. Radiation spreads out: lots reaches the near apple, less reaches the one further away, and none reaches the one far enough away.">
    {rows.map(y => <Source key={y} x={90} y={y} s={0.75} />)}
    {/* near: every ray reaches */}
    {fan(rows[0], [66, 66, 66])}
    <Apple x={186} y={rows[0]} s={0.95} />
    <Lines x={222} y={rows[0] + 6} lines={['near: lots reaches']} size={15} />
    {/* further: the rays have spread, only one reaches */}
    {fan(rows[1], [96, 130, 190, 130, 96])}
    <Apple x={316} y={rows[1]} s={0.95} />
    <Lines x={352} y={rows[1] + 6} lines={['further: less']} size={15} />
    {/* far: the rays never get there */}
    {fan(rows[2], [96, 130, 150, 130, 96])}
    <Apple x={470} y={rows[2]} s={0.95} />
    <Lines x={440} y={rows[2] + 6} anchor="end" lines={['far: none reaches']} size={15} />
    <Lines x={270} y={290} anchor="middle" lines={['further away, less radiation reaches']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

function NotRadioactive() {
  return <PhysicsDiagram title="After irradiation, with the source taken away, the apple gives out no radiation. Being irradiated does not make an object radioactive.">
    <g opacity={faded}><Source x={110} y={150} s={1.1} /></g>
    <Lines x={80} y={196} anchor="middle" lines={['source', 'taken away']} size={13} weight={650} colour={muted} />
    <Apple x={290} y={150} s={1.9} />
    <Tick x={346} y={104} s={1.1} />
    <Lines x={390} y={132} lines={['no radiation', 'comes out']} size={16} />
    <Chip x={270} y={258} text="not radioactive afterwards" size={15} line={P.useful} colour={P.useful} fill={P.usefulFill} />
  </PhysicsDiagram>
}

/** A lead-lined storage box with the source inside; (x, y) = middle of its base. */
function LeadBox({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x - 58} y={y - 74} width={116} height={74} rx="10" fill={leadFill} stroke={leadLine} strokeWidth="2.2" />
    <rect x={x - 48} y={y - 64} width={96} height={54} rx="6" fill="#f3efe6" stroke={lead} strokeWidth="1.6" />
    <rect x={x - 62} y={y - 82} width={124} height={12} rx="5" fill={lead} stroke={leadLine} strokeWidth="2" />
    <Source x={x + 30} y={y - 36} s={0.7} sign={false} />
    <Trefoil x={x} y={y - 104} r={13} />
  </g>
}
function Protect() {
  const arm: Pt[] = [[20, -52], [44, -52]]
  return <PhysicsDiagram viewBox="0 0 540 320" title="Three ways to avoid irradiation: keep sources in a lead-lined box, stand behind a barrier that absorbs the radiation, and hold a source as far away as you can, at arm's length with tongs.">
    {[12, 188, 364].map(x => <rect key={x} x={x} y={14} width={164} height={250} rx="18" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />)}
    {/* lead-lined box */}
    <LeadBox x={94} y={214} />
    {/* barrier */}
    <Source x={246} y={168} s={0.6} />
    {[-14, 0, 14].map((dy, i) => <Ray key={i} from={[250, 168 + dy * 0.2]} to={[273, 168 + dy]} waves={1.2} amp={2.2} width={1.8} />)}
    <rect x={276} y={96} width={16} height={130} rx="5" fill={leadFill} stroke={leadLine} strokeWidth="2" />
    <path d="M270 228H300" stroke={leadLine} strokeWidth="3" />
    <Person x={334} y={228} s={0.95} arms={[[[-4, -44], [-6, -30]], [[6, -44], [8, -30]]]} />
    {/* arm's length with tongs */}
    <Person x={402} y={228} s={0.95} arms={[arm, [[6, -44], [8, -30]]]} />
    <path d={`M${402 + 44 * 0.95} ${228 - 52 * 0.95}L${490} ${168}M${402 + 44 * 0.95} ${228 - 49 * 0.95}L${490} ${174}`} stroke="#5a6b79" strokeWidth="2.2" />
    <Source x={514} y={172} s={0.55} sign={false} />
    <path d={`M${402 + 36 * 0.95} ${240}H514`} stroke={muted} strokeWidth="1.4" />
    <path d={`M${402 + 36 * 0.95} ${234}v12M514 234v12`} stroke={muted} strokeWidth="1.4" />
    {[[94, "lead-lined box"], [270, 'barrier'], [446, "arm's length"]].map(([x, t]) => <text key={t as string} x={x as number} y={292} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>{t}</text>)}
  </PhysicsDiagram>
}

/* ---------- Section 3: contamination ---------- */

/** A large gloved hand (palm up, fingers to the right); (x, y) = middle of the palm. */
function BigHand({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-120 -26H-66V26H-120Z" fill="#9cc3d9" stroke="#3f7a9c" strokeWidth="2" />
    <path d="M-68 -30Q-20 -40 30 -34Q70 -30 94 -22Q108 -16 100 -6Q92 0 60 0Q96 4 100 14Q102 26 84 28Q50 32 20 32Q-30 36 -68 30Z" fill={skin} stroke={skinLine} strokeWidth="2.2" />
    <path d="M-10 -34Q10 -64 38 -60Q48 -56 36 -44Q24 -36 20 -32" fill={skin} stroke={skinLine} strokeWidth="2.2" />
    <path d="M30 -12H84M30 14H80" stroke={skinLine} strokeWidth="1.4" opacity=".55" />
  </g>
}
const ON_HAND: Pt[] = [[222, 142], [254, 160], [288, 138], [318, 162], [350, 146], [270, 184], [236, 178], [334, 186]]
function Spill() {
  return <g>
    <path d="M52 262Q70 248 110 250Q150 252 166 262Z" fill={radiation.soft} stroke={radiation.line} strokeWidth="1.4" />
    <g transform="rotate(-78 70 226)">
      <rect x={46} y={206} width={48} height={40} rx="8" fill="#eef4f8" stroke="#7d8e9c" strokeWidth="2" />
      <rect x={52} y={198} width={36} height={10} rx="3" fill="#7d8e9c" />
    </g>
    {seededDots(96, 254, 46, 8, 12).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.4" fill={radiation.fill} stroke={radiation.line} strokeWidth="1.2" />)}
  </g>
}
function seededDots(cx: number, cy: number, rx: number, ry: number, n: number): Pt[] {
  const rand = seeded(n * 7 + cx)
  return Array.from({ length: n }, () => [r1(cx + (rand() - 0.5) * 2 * rx), r1(cy + (rand() - 0.5) * 2 * ry)] as Pt)
}
function Contaminated({ decaying }: { decaying: boolean }) {
  return <PhysicsDiagram title={decaying ? 'The radioactive atoms stay on the hand and keep decaying, each one giving out radiation.' : 'Radioactive dust spilled from a jar has got onto a hand. Radioactive atoms are now on it: the hand is contaminated.'}>
    <BigHand x={260} y={164} />
    <Spill />
    {!decaying && <Arrow from={[148, 238]} to={[206, 196]} colour={radiation.line} width={2.6} />}
    {decaying && ON_HAND.map(([x, y], i) => {
      const a = -Math.PI / 2 + (i % 4 - 1.5) * 0.55 + (i > 3 ? Math.PI : 0)
      return <Ray key={`r${i}`} from={[r1(x + Math.cos(a) * 8), r1(y + Math.sin(a) * 8)]} to={[r1(x + Math.cos(a) * 42), r1(y + Math.sin(a) * 42)]} waves={2} amp={2.4} width={1.8} />
    })}
    {ON_HAND.map(([x, y], i) => <Nucleus key={i} x={x} y={y} r={7} />)}
    <Lines x={24} y={150} lines={['spilled', 'radioactive dust']} size={13} weight={650} colour={muted} />
    {decaying
      ? <Chip x={390} y={34} text="atoms stay and keep decaying" size={14} line={radiation.line} colour={radiation.line} fill={radiation.soft} />
      : <Chip x={270} y={34} text="contaminated: radioactive atoms on or in it" size={14} line={radiation.line} colour={radiation.line} fill={radiation.soft} />}
  </PhysicsDiagram>
}

/** Head and chest outline, facing us; (x, y) = middle of the chest. */
function Bust({ x, y, children }: { x: number; y: number; children?: ReactNode }) {
  return <g>
    <path d={`M${x - 104} ${y + 110}Q${x - 106} ${y - 40} ${x - 40} ${y - 58}Q${x} ${y - 64} ${x + 40} ${y - 58}Q${x + 106} ${y - 40} ${x + 104} ${y + 110}Z`} fill={body} stroke={bodyLine} strokeWidth="2.4" />
    <path d={`M${x - 16} ${y - 60}V${y - 76}M${x + 16} ${y - 60}V${y - 76}`} stroke={bodyLine} strokeWidth="2.4" />
    <circle cx={x} cy={y - 110} r="40" fill={body} stroke={bodyLine} strokeWidth="2.4" />
    {/* lungs */}
    <path d={`M${x - 12} ${y - 30}Q${x - 58} ${y - 36} ${x - 62} ${y + 30}Q${x - 60} ${y + 62} ${x - 24} ${y + 54}Q${x - 10} ${y + 20} ${x - 12} ${y - 30}Z`} fill="#f6cfc6" stroke="#d99a8c" strokeWidth="1.8" />
    <path d={`M${x + 12} ${y - 30}Q${x + 58} ${y - 36} ${x + 62} ${y + 30}Q${x + 60} ${y + 62} ${x + 24} ${y + 54}Q${x + 10} ${y + 20} ${x + 12} ${y - 30}Z`} fill="#f6cfc6" stroke="#d99a8c" strokeWidth="1.8" />
    {children}
  </g>
}
function Inside() {
  const atoms: Pt[] = [[114, 158], [98, 186], [130, 196], [188, 162], [202, 190], [170, 204]]
  return <PhysicsDiagram title="A person with radioactive atoms inside their lungs, for example after breathing in radioactive dust. Radiation goes out in all directions from inside the body.">
    <Bust x={150} y={170} />
    {atoms.map(([x, y], i) => {
      const a = Math.atan2(y - 182, x - 150) + (i % 2 ? 0.35 : -0.35)
      return <Ray key={`r${i}`} from={[r1(x + Math.cos(a) * 9), r1(y + Math.sin(a) * 9)]} to={[r1(x + Math.cos(a) * 118), r1(y + Math.sin(a) * 118)]} waves={6} amp={2.4} width={1.8} />
    })}
    {atoms.map(([x, y], i) => <Nucleus key={i} x={x} y={y} r={7} />)}
    <Lines x={318} y={96} lines={['atoms inside', 'the body']} size={17} colour={radiation.line} />
    <Lines x={318} y={152} lines={['breathed in or swallowed']} size={14} weight={650} colour={muted} />
    <Lines x={318} y={200} lines={['you cannot move away', 'from the source']} size={15} />
  </PhysicsDiagram>
}

function Suited() {
  // A worker in a protective suit, face mask and gloves, holding a source with tongs.
  const x = 200, y = 262
  return <PhysicsDiagram title="A worker wearing a protective suit, a face mask and gloves, holding a radioactive source with long tongs so that no radioactive material gets onto their skin or into their lungs.">
    <path d={`M${x - 14} ${y - 70}L${x - 18} ${y}M${x + 14} ${y - 70}L${x + 18} ${y}`} stroke={suitLine} strokeWidth="19" />
    <path d={`M${x - 14} ${y - 70}L${x - 18} ${y}M${x + 14} ${y - 70}L${x + 18} ${y}`} stroke={suit} strokeWidth="15" />
    <path d={`M${x - 26} ${y}h16M${x + 10} ${y}h16`} stroke="#5a6b79" strokeWidth="7" />
    <path d={`M${x - 36} ${y - 60}Q${x - 40} ${y - 150} ${x} ${y - 154}Q${x + 40} ${y - 150} ${x + 36} ${y - 60}Z`} fill={suit} stroke={suitLine} strokeWidth="2.4" />
    <path d={`M${x} ${y - 150}V${y - 70}`} stroke={suitLine} strokeWidth="1.6" strokeDasharray="4 4" />
    {/* hood, face, mask */}
    <circle cx={x} cy={y - 178} r="30" fill={suit} stroke={suitLine} strokeWidth="2.4" />
    <ellipse cx={x + 4} cy={y - 178} rx="19" ry="21" fill={skin} stroke={skinLine} strokeWidth="1.6" />
    <path d={`M${x - 16} ${y - 172}Q${x + 4} ${y - 162} ${x + 24} ${y - 172}V${y - 164}Q${x + 4} ${y - 150} ${x - 16} ${y - 164}Z`} fill="#dfe8ef" stroke="#5a6b79" strokeWidth="1.8" />
    <circle cx={x + 18} cy={y - 164} r="6" fill="#7d8e9c" stroke="#5a6b79" strokeWidth="1.4" />
    <path d={`M${x - 8} ${y - 186}h4M${x + 10} ${y - 186}h4`} stroke={ink} strokeWidth="2.4" />
    {/* arms: one down, one reaching forward with tongs */}
    <path d={`M${x - 30} ${y - 140}Q${x - 46} ${y - 110} ${x - 42} ${y - 86}`} stroke={suitLine} strokeWidth="15" fill="none" />
    <path d={`M${x - 30} ${y - 140}Q${x - 46} ${y - 110} ${x - 42} ${y - 86}`} stroke={suit} strokeWidth="11" fill="none" />
    <circle cx={x - 42} cy={y - 80} r="8" fill={glove} stroke={gloveLine} strokeWidth="2" />
    <path d={`M${x + 28} ${y - 138}L${x + 72} ${y - 118}`} stroke={suitLine} strokeWidth="15" />
    <path d={`M${x + 28} ${y - 138}L${x + 72} ${y - 118}`} stroke={suit} strokeWidth="11" />
    <path d={`M${x + 78} ${y - 118}L${x + 170} ${y - 104}M${x + 78} ${y - 112}L${x + 170} ${y - 98}`} stroke="#5a6b79" strokeWidth="2.4" />
    <circle cx={x + 78} cy={y - 115} r="9" fill={glove} stroke={gloveLine} strokeWidth="2" />
    <Source x={x + 196} y={y - 100} s={0.7} />
    {[-16, 0, 16].map((dy, i) => <Ray key={i} from={[x + 202, y - 100 + dy * 0.2]} to={[x + 234, y - 100 + dy * 1.4]} waves={1.5} amp={2} width={1.8} />)}
    <Lines x={30} y={52} lines={['suit and', 'face mask']} size={15} />
    <path d="M110 56Q150 60 176 80" stroke={ink} strokeWidth="1.4" fill="none" />
    <circle cx="176" cy="80" r="2.6" fill={ink} />
    <Lines x={320} y={222} lines={['gloves and tongs']} size={15} />
    <path d="M330 206Q306 170 282 150" stroke={ink} strokeWidth="1.4" fill="none" />
    <circle cx="282" cy="150" r="2.6" fill={ink} />
    <Lines x={320} y={256} lines={['keep atoms off the skin', 'and out of the lungs']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 4: which is most dangerous? ---------- */

type Kind = 'alpha' | 'beta' | 'gamma'
const KINDS: Kind[] = ['alpha', 'beta', 'gamma']
const SYMBOL: Record<Kind, string> = { alpha: 'α', beta: 'β', gamma: 'γ' }
const COLX = [96, 243, 390], COLW = 144, ROWY = [52, 178], ROWH = 122
type Rank = { text: string; tone: 'good' | 'bad' | 'mid' }
const OUT: Record<Kind, Rank> = { alpha: { text: 'least dangerous', tone: 'good' }, beta: { text: 'more dangerous', tone: 'bad' }, gamma: { text: 'more dangerous', tone: 'bad' } }
const IN: Record<Kind, Rank> = { alpha: { text: 'most dangerous', tone: 'bad' }, beta: { text: 'in between', tone: 'mid' }, gamma: { text: 'least dangerous', tone: 'good' } }
const toneColour = { good: [P.useful, P.usefulFill], bad: [P.wasted, P.wastedFill], mid: ['#a0781e', '#fbf0d2'] }

/** Small ionisation marks: little stars where radiation knocks electrons off atoms. */
function Marks({ pts }: { pts: Pt[] }) {
  return <g stroke={radiation.line} strokeWidth="1.6">{pts.map(([x, y], i) => <path key={i} d={`M${x - 3} ${y}h6M${x} ${y - 3}v6`} />)}</g>
}
function ring(cx: number, cy: number, n: number, rMin: number, rMax: number, seed: number): Pt[] {
  const rand = seeded(seed)
  return Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2 + rand() * 0.6, rr = rMin + rand() * (rMax - rMin); return [r1(cx + Math.cos(a) * rr), r1(cy + Math.sin(a) * rr)] as Pt })
}
function OutsideCell({ kind, x, y }: { kind: Kind; x: number; y: number }) {
  const cy = y + 44, skinX = x + 72
  const stop = kind === 'alpha' ? skinX - 6 : kind === 'beta' ? x + 112 : x + COLW - 6
  return <g>
    <path d={`M${skinX} ${y + 8}H${x + COLW - 4}V${y + 80}H${skinX}Z`} fill={body} />
    <path d={`M${skinX} ${y + 8}V${y + 80}`} stroke={bodyLine} strokeWidth="3" />
    <Source x={x + 46} y={cy} s={0.42} sign={false} />
    <Ray from={[x + 50, cy]} to={[stop, cy]} waves={kind === 'alpha' ? 1.5 : 4} amp={3} width={kind === 'alpha' ? 3 : 2} />
    {kind === 'alpha' && <path d={`M${skinX - 3} ${cy - 11}V${cy + 11}`} stroke={P.wasted} strokeWidth="3" />}
    {kind === 'beta' && <Marks pts={[[x + 86, cy - 9], [x + 100, cy + 9]]} />}
    {kind === 'gamma' && <Marks pts={[[x + 100, cy + 9]]} />}
  </g>
}
function InsideCell({ kind, x, y }: { kind: Kind; x: number; y: number }) {
  const cx = x + COLW / 2, cy = y + 44
  return <g>
    <rect x={x + 4} y={y + 8} width={COLW - 8} height={72} rx="12" fill={body} stroke={bodyLine} strokeWidth="1.6" />
    {kind === 'alpha' && <Marks pts={ring(cx, cy, 14, 10, 20, 3)} />}
    {kind === 'beta' && <g>{[0.4, 2.5, 4.4].map(a => <Ray key={a} from={[r1(cx + Math.cos(a) * 9), r1(cy + Math.sin(a) * 9)]} to={[r1(cx + Math.cos(a) * 46), r1(cy + Math.sin(a) * 30)]} waves={2} amp={2} width={1.6} />)}<Marks pts={ring(cx, cy, 7, 18, 40, 9).map(([px, py]) => [px, r1(cy + (py - cy) * 0.75)] as Pt)} /></g>}
    {kind === 'gamma' && <g>{[0.2, 3.4].map(a => <Ray key={a} from={[r1(cx + Math.cos(a) * 9), r1(cy + Math.sin(a) * 9)]} to={[r1(cx + Math.cos(a) * 72), r1(cy + Math.sin(a) * 72)]} waves={4} amp={2.4} width={1.8} />)}<Marks pts={[[cx + 30, cy + 12]]} /></g>}
    <Nucleus x={cx} y={cy} r={7} />
  </g>
}
function RankTag({ x, y, rank }: { x: number; y: number; rank: Rank }) {
  const [c, f] = toneColour[rank.tone]
  return <g>
    <rect x={x + 6} y={y + 88} width={COLW - 12} height={24} rx="12" fill={f} stroke={c} strokeWidth="1.8" />
    <text x={x + COLW / 2} y={y + 105} textAnchor="middle" fontSize="12" fontWeight="750" fill={c}>{rank.text}</text>
  </g>
}
function Grid({ show, focus, title, note }: { show: { out: Kind[]; in: Kind[] }; focus?: 'out' | 'in' | 'beta'; title: string; note?: string }) {
  return <PhysicsDiagram viewBox="0 0 540 340" title={title}>
    {KINDS.map((k, i) => <g key={k}>
      <circle cx={COLX[i] + 44} cy={26} r="15" fill={radiation.soft} stroke={radiation.line} strokeWidth="1.8" />
      <text x={COLX[i] + 44} y={32} textAnchor="middle" fontSize="18" fontWeight="800" fill={radiation.line}>{SYMBOL[k]}</text>
      <text x={COLX[i] + 66} y={31} fontSize="15" fontWeight="750" fill={ink}>{k}</text>
    </g>)}
    {[['outside', 'the body'], ['inside', 'the body']].map((lines, j) => <g key={j}>
      <rect x={6} y={ROWY[j]} width={84} height={ROWH - 6} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
      <Lines x={48} y={ROWY[j] + 52} anchor="middle" lines={lines} size={14} />
    </g>)}
    {KINDS.map((k, i) => [0, 1].map(j => {
      const x = COLX[i], y = ROWY[j], filled = j === 0 ? show.out.includes(k) : show.in.includes(k)
      const lit = !focus || (focus === 'out' && j === 0) || (focus === 'in' && j === 1) || (focus === 'beta' && j === 1 && k === 'beta')
      return <g key={`${k}${j}`}>
        <rect x={x} y={y} width={COLW} height={ROWH - 6} rx="14" fill="white" stroke={lit && focus ? ink : P.panelLine} strokeWidth={lit && focus ? 2 : 1.5} />
        {filled && <g opacity={lit ? 1 : 0.4}>
          {j === 0 ? <OutsideCell kind={k} x={x} y={y} /> : <InsideCell kind={k} x={x} y={y} />}
          <RankTag x={x} y={y} rank={j === 0 ? OUT[k] : IN[k]} />
        </g>}
      </g>
    }))}
    {note && <Lines x={270} y={326} anchor="middle" lines={[note]} size={13} weight={650} colour={muted} />}
  </PhysicsDiagram>
}

export function IrradiationVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'irrad-exposed': return <Exposed />
    case 'irrad-distance': return <Distance />
    case 'irrad-notradioactive': return <NotRadioactive />
    case 'irrad-protect': return <Protect />
    case 'irrad-contaminated': return <Contaminated decaying={false} />
    case 'irrad-decay': return <Contaminated decaying />
    case 'irrad-inside': return <Inside />
    case 'irrad-suits': return <Suited />
    case 'irrad-compare': return <Grid show={{ out: [], in: [] }} title="A comparison grid: alpha, beta and gamma sources, outside the body and inside the body." note="how much harm depends on the type of radiation" />
    case 'irrad-outside': return <Grid show={{ out: KINDS, in: [] }} focus="out" title="Outside the body: alpha is stopped by the skin or a small air gap, so it is the least dangerous. Beta and gamma can get into the body and damage organs, so they are more dangerous." note="outside: can it get into the body?" />
    case 'irrad-inside-compare': return <Grid show={{ out: KINDS, in: ['alpha', 'gamma'] }} focus="in" title="Inside the body: alpha does all its damage in a very small area and is the most ionising, so it is the most dangerous. Gamma mostly passes straight out, so it is the least dangerous." note="inside: where does the damage go?" />
    case 'irrad-beta': return <Grid show={{ out: KINDS, in: KINDS }} focus="beta" title="Inside the body, beta damages a wider area and is less ionising than alpha: less dangerous than alpha, more dangerous than gamma." note="beta: damage spread over a wider area" />
    case 'irrad-table': return <Grid show={{ out: KINDS, in: KINDS }} title="The whole picture. Outside the body alpha is the least dangerous; inside the body alpha is the most dangerous and gamma the least. Research on radiation is published and peer reviewed." note="research is published and checked by other scientists: peer review" />
    default: return null
  }
}

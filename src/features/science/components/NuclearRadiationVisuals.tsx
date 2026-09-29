import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines } from './PhysicsKit'
import { Electron, Nucleus } from './AtomVisuals'
import { nuc, r1, Arrow, WavyArrow, Chip, AlphaParticle, BetaParticle, NeutronDot, Trefoil, UnstableGlow, Tick, Cross } from './NuclearModelVisuals'

/*
 * Physics Lesson 34: Alpha, beta and gamma radiation. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'nrad-' and is routed from CellBiologyVisuals.tsx.
 *
 * One colour per radiation, kept through the atomic-structure lessons: alpha coral (2 protons + 2 neutrons),
 * beta electron blue, gamma a green wave. Radiation of no particular type is orange. Paper is cream, aluminium
 * blue-grey and lead dark grey.
 */
const P = physicsPalette
const { ink, muted } = nuc
const radiation = '#c7701f'
const paper = '#fbf4dc', paperLine = '#c9b27a', alu = '#dfe6ec', aluLine = '#8499a8', lead = '#8a949d', leadLine = '#4f5963'

/* ---------- Section 2: decay and the four kinds of radiation ---------- */

function Decay() {
  return <PhysicsDiagram title="An unstable nucleus gives out radiation to become more stable. This is radioactive decay, and the radiation is called nuclear radiation.">
    <UnstableGlow cx={110} cy={140} r={64} />
    <Nucleus cx={110} cy={140} protons={6} neutrons={8} r={10} glowOn={false} />
    <Lines x={110} y={240} anchor="middle" lines={['unstable nucleus']} size={14} />
    <Arrow from={[190, 140]} to={[270, 140]} width={3} />
    <Lines x={230} y={116} anchor="middle" lines={['radioactive', 'decay']} size={13} colour={muted} />
    <Nucleus cx={350} cy={140} protons={7} neutrons={7} r={10} />
    <Lines x={350} y={240} anchor="middle" lines={['more stable nucleus']} size={14} />
    <WavyArrow from={[404, 108]} to={[510, 54]} colour={radiation} />
    <Lines x={440} y={132} lines={['nuclear', 'radiation']} size={14} colour={radiation} />
  </PhysicsDiagram>
}
function Card({ x, colour, fill, title, lines, children }: { x: number; colour: string; fill: string; title: string; lines: string[]; children: ReactNode }) {
  return <g>
    <rect x={x} y={34} width={236} height={232} rx="20" fill={fill} fillOpacity=".45" stroke={colour} strokeWidth="1.8" />
    <circle cx={x + 118} cy={112} r={52} fill="white" />
    {children}
    <Lines x={x + 118} y={202} anchor="middle" lines={[title]} size={17} colour={colour} />
    <Lines x={x + 118} y={228} anchor="middle" lines={lines} size={13.5} weight={650} colour={ink} />
  </g>
}
function AlphaBeta() {
  return <PhysicsDiagram title="An alpha particle is 2 protons and 2 neutrons. A beta particle is a fast-moving electron.">
    <Card x={24} colour={nuc.alpha} fill={nuc.alphaFill} title="alpha particle, α" lines={['2 protons and', '2 neutrons']}><AlphaParticle x={142} y={112} r={17} /></Card>
    <Card x={280} colour={nuc.beta} fill={nuc.betaFill} title="beta particle, β" lines={['a fast-moving', 'electron']}><BetaParticle x={412} y={112} r={15} /></Card>
  </PhysicsDiagram>
}
function GammaNeutron() {
  return <PhysicsDiagram title="A gamma ray is electromagnetic radiation from the nucleus: a wave, not a particle. Some decays also release a neutron.">
    <Card x={24} colour={nuc.gamma} fill={nuc.gammaFill} title="gamma ray, γ" lines={['electromagnetic', 'radiation (a wave)']}><WavyArrow from={[86, 112]} to={[200, 112]} colour={nuc.gamma} amp={9} width={3.2} /></Card>
    <Card x={280} colour={nuc.neutronLine} fill="#eef1f3" title="neutron, n" lines={['no charge;', 'some decays release one']}>
      <path d="M358 104H382M352 112H380M358 120H382" stroke={nuc.neutronLine} strokeWidth="2" opacity=".55" />
      <NeutronDot x={404} y={112} r={17} />
    </Card>
  </PhysicsDiagram>
}

/* ---------- Section 3: ionising ---------- */

function Ionise() {
  const cx = 170, cy = 158, rr = 64
  const ghost: [number, number] = [r1(cx + Math.cos(-2.2) * rr), r1(cy + Math.sin(-2.2) * rr)]
  return <PhysicsDiagram title="Ionising radiation knocks an electron off an atom. The atom is left with more protons than electrons, so it becomes a positive ion.">
    <circle cx={cx} cy={cy} r={rr + 22} fill={nuc.space} stroke={nuc.spaceLine} strokeWidth="1.5" />
    <circle cx={cx} cy={cy} r={rr} fill="none" stroke={nuc.levelLine} strokeWidth="1.8" strokeDasharray="5 5" />
    <Electron x={cx + rr * Math.cos(.6)} y={cy + rr * Math.sin(.6)} r={8.5} />
    <circle cx={ghost[0]} cy={ghost[1]} r={8.5} fill="white" stroke={nuc.electronLine} strokeWidth="1.6" strokeDasharray="3 3" />
    <Nucleus cx={cx} cy={cy} protons={2} neutrons={2} r={9} />
    <Arrow from={[20, 46]} to={[ghost[0] - 12, ghost[1] - 8]} colour={radiation} width={3.2} />
    <Lines x={20} y={34} lines={['radiation']} size={14} colour={radiation} />
    <Arrow from={[ghost[0] + 6, ghost[1] - 12]} to={[ghost[0] + 60, 30]} colour={nuc.electronLine} width={2.4} />
    <Electron x={ghost[0] + 70} y={24} r={8.5} />
    <Lines x={ghost[0] + 86} y={30} lines={['electron knocked off']} size={13} colour={nuc.electronLine} />
    <Arrow from={[280, 170]} to={[340, 170]} colour={muted} width={2.4} />
    {/* the positive ion */}
    <circle cx={430} cy={cy} r={rr * .8 + 18} fill={nuc.space} stroke={nuc.spaceLine} strokeWidth="1.5" />
    <circle cx={430} cy={cy} r={rr * .8} fill="none" stroke={nuc.levelLine} strokeWidth="1.8" strokeDasharray="5 5" />
    <Electron x={430 + rr * .8 * Math.cos(.6)} y={cy + rr * .8 * Math.sin(.6)} r={8} />
    <Nucleus cx={430} cy={cy} protons={2} neutrons={2} r={8} />
    <path d={`M${370} ${cy - 76}h-8v152h8M${490} ${cy - 76}h8v152h-8`} stroke={ink} strokeWidth="2.4" fill="none" />
    <text x={504} y={cy - 64} fontSize="22" fontWeight="800" fill={nuc.protonLine}>+</text>
    <Chip x={430} y={272} text="positive ion" size={14} colour={nuc.protonLine} fill="#fdf1ee" />
  </PhysicsDiagram>
}
function Icon({ kind, x, y, s = 1 }: { kind: 'alpha' | 'beta' | 'gamma'; x: number; y: number; s?: number }) {
  if (kind === 'alpha') return <AlphaParticle x={x} y={y} r={9 * s} signs={s >= 1} />
  if (kind === 'beta') return <BetaParticle x={x + 8} y={y} r={8 * s} />
  return <WavyArrow from={[x - 22 * s, y]} to={[x + 24 * s, y]} colour={nuc.gamma} amp={5 * s} waves={2.5} width={2.6} />
}
const KINDS = [['alpha', 'alpha, α', nuc.alpha], ['beta', 'beta, β', nuc.beta], ['gamma', 'gamma, γ', nuc.gamma]] as const
function Power() {
  return <PhysicsDiagram title="Ionising power: how easily radiation knocks electrons off atoms. Alpha, beta and gamma are all ionising radiation.">
    {KINDS.map(([k, name, c], i) => {
      const x = 120 + i * 150
      return <g key={k}>
        <circle cx={x} cy={84} r={40} fill="white" stroke={P.panelLine} strokeWidth="1.5" />
        <Icon kind={k} x={x} y={84} />
        <Lines x={x} y={148} anchor="middle" lines={[name]} size={14} colour={c} />
      </g>
    })}
    <rect x={40} y={184} width={460} height={34} rx="17" fill="#f3eefa" stroke={nuc.mass} strokeWidth="1.8" />
    <text x={270} y={206} textAnchor="middle" fontSize="15" fontWeight="750" fill={nuc.mass}>ionising power</text>
    <Lines x={270} y={252} anchor="middle" lines={['how easily it knocks electrons off atoms']} size={14} weight={650} colour={ink} />
  </PhysicsDiagram>
}
function Order() {
  const words = ['strongly ionising', 'moderately ionising', 'weakly ionising']
  return <PhysicsDiagram title="Ionising power: alpha is strongly ionising, beta is moderately ionising and gamma is weakly ionising.">
    <path d="M40 196L500 222V234L40 260Z" fill="#e6dcf5" stroke={nuc.mass} strokeWidth="1.8" />
    <text x={40} y={284} fontSize="13" fontWeight="700" fill={nuc.mass}>strong</text>
    <text x={500} y={284} textAnchor="end" fontSize="13" fontWeight="700" fill={nuc.mass}>weak</text>
    <text x={270} y={284} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>ionising power</text>
    {KINDS.map(([k, name, c], i) => {
      const x = 100 + i * 170
      return <g key={k}>
        <circle cx={x} cy={80} r={38} fill="white" stroke={c} strokeWidth="1.8" />
        <Icon kind={k} x={x} y={80} />
        <Lines x={x} y={138} anchor="middle" lines={[name]} size={14} colour={c} />
        <Lines x={x} y={158} anchor="middle" lines={[words[i]]} size={13} weight={650} colour={ink} />
      </g>
    })}
  </PhysicsDiagram>
}

/* ---------- Section 4: range and what stops each one ---------- */

const LANES = [{ k: 'alpha', y: 96, stop: 186 }, { k: 'beta', y: 168, stop: 314 }, { k: 'gamma', y: 240, stop: 446 }] as const
function Barrier({ x, w, fill, line, name }: { x: number; w: number; fill: string; line: string; name: string[] }) {
  return <g>
    <rect x={x} y={60} width={w} height={214} rx={Math.min(3, w / 2)} fill={fill} stroke={line} strokeWidth="1.6" />
    <Lines x={x + w / 2} y={name.length > 1 ? 26 : 42} anchor="middle" lines={name} size={13.5} colour={line === paperLine ? '#9a7b2e' : line === aluLine ? '#5f7688' : line} />
  </g>
}
function Source({ y }: { y: number }) {
  return <g><rect x={16} y={y - 20} width={48} height={40} rx="8" fill={nuc.lead} stroke={nuc.leadLine} strokeWidth="1.8" /><Trefoil x={36} y={y} r={8} /></g>
}
function Range({ upto }: { upto: 0 | 1 | 2 }) {
  const notes = [['a few cm in air'], ['a few metres of air'], ['a long way in air']]
  const titles = [
    'Alpha particles travel only a few centimetres in air and are stopped by a sheet of paper.',
    'Beta particles travel a few metres in air. They pass through paper but are stopped by a sheet of aluminium.',
    'Gamma rays travel a long way in air. They pass through paper and aluminium and are stopped only by thick lead or metres of concrete.',
  ]
  return <PhysicsDiagram title={titles[upto]}>
    <Barrier x={186} w={6} fill={paper} line={paperLine} name={['paper']} />
    <Barrier x={314} w={12} fill={alu} line={aluLine} name={['aluminium']} />
    <Barrier x={446} w={34} fill={lead} line={leadLine} name={['thick', 'lead']} />
    {LANES.map((l, i) => {
      if (i > upto) return null
      const on = i === upto, c = KINDS[i][2]
      return <g key={l.k} opacity={on ? 1 : .32}>
        <Source y={l.y} />
        {l.k === 'gamma'
          ? <WavyArrow from={[66, l.y]} to={[l.stop - 2, l.y]} colour={c} amp={6} waves={9} width={2.8} />
          : <Arrow from={[66, l.y]} to={[l.stop - 2, l.y]} colour={c} width={3} />}
        {l.k === 'alpha' ? <AlphaParticle x={112} y={l.y} r={6} signs={false} /> : l.k === 'beta' ? <Electron x={120} y={l.y} r={6.5} sign={false} /> : null}
        <text x={40} y={l.y + 38} textAnchor="middle" fontSize="15" fontWeight="800" fill={c}>{['α', 'β', 'γ'][i]}</text>
        {on && <text x={72} y={l.y - 14} fontSize="13" fontWeight="750" fill={c} stroke="white" strokeWidth="5" paintOrder="stroke">{notes[i][0]}</text>}
      </g>
    })}
    {upto === 2 && <Lines x={532} y={292} anchor="end" lines={['or metres of concrete']} size={12.5} weight={650} colour={leadLine} />}
  </PhysicsDiagram>
}
function Table() {
  const rows = [
    ['strong', 'a few cm', 'paper'],
    ['moderate', 'a few metres', 'aluminium'],
    ['weak', 'a long way', 'thick lead or', 'metres of concrete'],
  ]
  return <PhysicsDiagram schematic={false} title="The properties of alpha, beta and gamma. Alpha: strongly ionising, travels a few centimetres in air, stopped by paper. Beta: moderately ionising, a few metres, stopped by aluminium. Gamma: weakly ionising, travels a long way, stopped by thick lead or metres of concrete.">
    <rect x={12} y={14} width={516} height={272} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    {['', 'ionising power', 'range in air', 'stopped by'].map((h, i) => <text key={i} x={[0, 214, 330, 452][i]} y={44} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>{h}</text>)}
    {KINDS.map(([k, name, c], i) => {
      const y = 104 + i * 74
      return <g key={k}>
        <path d={`M24 ${y - 44}H516`} stroke={P.panelLine} strokeWidth="1.2" />
        <circle cx={52} cy={y - 6} r={22} fill="white" stroke={c} strokeWidth="1.5" />
        <Icon kind={k} x={52} y={y - 6} s={.8} />
        <text x={84} y={y} fontSize="15" fontWeight="750" fill={c}>{name}</text>
        <text x={214} y={y} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{rows[i][0]}</text>
        <text x={330} y={y} textAnchor="middle" fontSize="14" fontWeight="650" fill={ink}>{rows[i][1]}</text>
        <Lines x={452} y={rows[i].length > 3 ? y - 8 : y} anchor="middle" lines={rows[i].slice(2)} size={13.5} weight={700} colour={i === 0 ? '#9a7b2e' : i === 1 ? '#5f7688' : leadLine} />
      </g>
    })}
  </PhysicsDiagram>
}

/* ---------- Section 5: choosing radiation for a job ---------- */

const DOT: [number, number] = [196, 176]
function Patient() {
  return <g>
    <path d="M120 300C120 214 124 150 150 132C164 122 180 120 196 120C212 120 228 122 242 132C268 150 272 214 272 300Z" fill="#e6edf2" stroke="#7a8fa0" strokeWidth="2" />
    <path d="M184 104V124H208V104" fill="#f6e3d3" stroke="#7a8fa0" strokeWidth="2" />
    <ellipse cx={196} cy={78} rx={28} ry={32} fill="#f6e3d3" stroke="#7a8fa0" strokeWidth="2" />
    <circle cx={DOT[0]} cy={DOT[1]} r={16} fill="#fde2c8" />
    <circle cx={DOT[0]} cy={DOT[1]} r={6.5} fill={radiation} stroke="#9a520f" strokeWidth="1.4" />
  </g>
}
function Detector() {
  return <g>
    <rect x={400} y={128} width={96} height={96} rx="14" fill="#dfe5ea" stroke="#5a6b79" strokeWidth="2" />
    <rect x={400} y={146} width={14} height={60} rx="3" fill="#b8c4ce" stroke="#5a6b79" strokeWidth="1.4" />
    <path d="M430 158h48M430 176h36M430 194h44" stroke="#5a6b79" strokeWidth="2" opacity=".55" />
    <Lines x={448} y={250} anchor="middle" lines={['detector']} size={14} />
  </g>
}
function Syringe() {
  return <g transform="rotate(20 70 150)">
    <rect x={30} y={142} width={70} height={16} rx="4" fill="white" stroke="#7a8fa0" strokeWidth="1.8" />
    <rect x={56} y={145} width={40} height={10} rx="2" fill="#fde2c8" />
    <path d="M100 150H124M22 142V158M30 150H14" stroke="#7a8fa0" strokeWidth="2" />
  </g>
}
function Tracer({ which }: { which: 'plain' | 'alpha' | 'gamma' }) {
  const titles = {
    plain: 'A medical tracer: a radioactive isotope is injected into a patient, and its radiation is detected outside the body.',
    alpha: 'Alpha is no use as a tracer: it cannot pass through the body to reach the detector, and it is strongly ionising, so it would damage cells inside.',
    gamma: 'Gamma makes a good tracer: it passes out of the body to the detector and is only weakly ionising.',
  }
  return <PhysicsDiagram title={titles[which]}>
    <Patient />
    <Syringe />
    {which === 'plain' && <g>
      <path d={`M${DOT[0] + 10} ${DOT[1]}H396`} stroke={radiation} strokeWidth="2" strokeDasharray="6 6" />
      <Lines x={20} y={214} lines={['tracer', 'injected']} size={14} colour={radiation} />
      <Lines x={290} y={80} lines={['radiation detected', 'outside the body']} size={14} />
    </g>}
    {which === 'alpha' && <g>
      <path d={`M${DOT[0] + 10} ${DOT[1]}H396`} stroke={P.panelLine} strokeWidth="2" strokeDasharray="6 6" />
      <Arrow from={[DOT[0] + 10, DOT[1]]} to={[DOT[0] + 44, DOT[1]]} colour={nuc.alpha} width={3} />
      <Cross x={336} y={DOT[1]} s={1.1} />
      <Lines x={290} y={80} lines={['alpha cannot get', 'out of the body']} size={14} colour={nuc.alpha} />
      <Lines x={20} y={214} lines={['strongly', 'ionising:', 'damage']} size={14} colour={nuc.alpha} />
    </g>}
    {which === 'gamma' && <g>
      <WavyArrow from={[DOT[0] + 10, DOT[1]]} to={[396, DOT[1]]} colour={nuc.gamma} amp={6} waves={6} />
      <Tick x={448} y={100} s={1.1} />
      <Lines x={290} y={80} lines={['gamma passes out', 'of the body']} size={14} colour={nuc.gamma} />
      <Lines x={20} y={214} lines={['weakly', 'ionising:', 'less harm']} size={14} colour={nuc.gamma} />
    </g>}
    <Detector />
  </PhysicsDiagram>
}
function Sterilise() {
  return <PhysicsDiagram title="Sterilising medical equipment: the equipment is sealed in packaging first, then gamma rays pass through the packaging to reach it.">
    <rect x={20} y={128} width={64} height={64} rx="10" fill={nuc.lead} stroke={nuc.leadLine} strokeWidth="2" />
    <Trefoil x={48} y={160} r={12} />
    <Lines x={52} y={216} anchor="middle" lines={['gamma', 'source']} size={13} colour={muted} />
    <rect x={220} y={98} width={200} height={124} rx="16" fill="#eef5f9" stroke="#8aa3b5" strokeWidth="2.2" />
    <path d="M226 110h188" stroke="white" strokeWidth="5" opacity=".8" />
    {/* a syringe and a scalpel inside */}
    <g transform="rotate(-8 290 150)"><rect x={250} y={142} width={70} height={14} rx="4" fill="white" stroke="#7a8fa0" strokeWidth="1.8" /><path d="M320 149H346M250 140V158M244 149H232" stroke="#7a8fa0" strokeWidth="2" /></g>
    <g transform="rotate(10 350 190)"><path d="M300 186H352L376 180Q380 186 372 192L352 194H300Z" fill="#dfe5ea" stroke="#5a6b79" strokeWidth="1.8" /></g>
    {[128, 160, 192].map(y => <WavyArrow key={y} from={[88, y]} to={[520, y]} colour={nuc.gamma} amp={5} waves={11} width={2.4} />)}
    <Lines x={320} y={84} anchor="middle" lines={['sealed in packaging']} size={14} />
    <Lines x={320} y={252} anchor="middle" lines={['gamma rays pass through the', 'packaging to the equipment']} size={14} colour={nuc.gamma} />
  </PhysicsDiagram>
}
function QuestionBarriers() {
  const rows = [{ name: 'no sheet', level: .86 }, { name: 'paper', level: .84 }, { name: 'aluminium', level: .08 }]
  return <PhysicsDiagram title="A source and a detector with different sheets in between; the reading drops with aluminium.">
    <text x={40} y={28} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>source</text>
    <text x={230} y={28} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>in between</text>
    <text x={386} y={28} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>detector</text>
    <text x={488} y={28} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>reading</text>
    {rows.map((r, i) => {
      const y = 76 + i * 84
      return <g key={r.name}>
        <rect x={16} y={y - 20} width={48} height={40} rx="8" fill={nuc.lead} stroke={nuc.leadLine} strokeWidth="1.8" /><Trefoil x={36} y={y} r={8} />
        <path d={`M66 ${y}H358`} stroke={P.panelLine} strokeWidth="2" strokeDasharray="4 6" />
        {i === 1 && <rect x={227} y={y - 34} width={6} height={68} rx="2" fill={paper} stroke={paperLine} strokeWidth="1.6" />}
        {i === 2 && <rect x={224} y={y - 34} width={12} height={68} rx="2" fill={alu} stroke={aluLine} strokeWidth="1.6" />}
        <text x={248} y={y - 10} fontSize="13.5" fontWeight="700" fill={ink}>{r.name}</text>
        <rect x={360} y={y - 22} width={52} height={44} rx="8" fill="#dfe5ea" stroke="#5a6b79" strokeWidth="1.8" />
        <rect x={446} y={y - 12} width={84} height={24} rx="12" fill="white" stroke="#5a6b79" strokeWidth="1.6" />
        <rect x={448} y={y - 10} width={r1(80 * r.level)} height={20} rx="10" fill={r.level > .5 ? '#e0a45c' : '#b8c4ce'} />
        <text x={488} y={y + 34} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{r.level > .5 ? 'high' : 'low'}</text>
      </g>
    })}
  </PhysicsDiagram>
}

export function NuclearRadiationVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'nrad-decay': return <Decay />
    case 'nrad-alpha-beta': return <AlphaBeta />
    case 'nrad-gamma-neutron': return <GammaNeutron />
    case 'nrad-ionise': return <Ionise />
    case 'nrad-power': return <Power />
    case 'nrad-order': return <Order />
    case 'nrad-alpha-range': return <Range upto={0} />
    case 'nrad-beta-range': return <Range upto={1} />
    case 'nrad-gamma-range': return <Range upto={2} />
    case 'nrad-table': return <Table />
    case 'nrad-tracer': return <Tracer which="plain" />
    case 'nrad-tracer-alpha': return <Tracer which="alpha" />
    case 'nrad-tracer-gamma': return <Tracer which="gamma" />
    case 'nrad-steril': return <Sterilise />
    case 'nrad-q-barriers': return <QuestionBarriers />
    default: return null
  }
}

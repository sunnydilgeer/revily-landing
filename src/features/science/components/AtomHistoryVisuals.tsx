import { useId, type ReactNode } from 'react'
import { atomPalette, Electron, Nucleus, Shells } from './AtomVisuals'

/*
 * Chemistry C1b: how the model of the atom changed. Original, code-native schematics; not to scale.
 * Focus ids start with 'hist-' and are routed from CellBiologyVisuals.tsx.
 *
 * Uses the Chemistry particle colour code from AtomVisuals.tsx (proton coral red "+", neutron grey, electron blue "−",
 * thin blue-grey shells, pale blue atom space). Added here, one colour per idea:
 *   solid sphere model = slate blue-grey ball
 *   plum pudding       = pale coral "ball of positive charge" (the positive hue of the proton)
 *   alpha particle     = purple dot and path (positive, but not part of the gold atoms)
 *   gold foil          = soft gold band
 * A timeline strip of the five models sits above the model drawings, with the model being taught highlighted.
 */
const { ink, muted, protonFill, protonLine, electronFill, electronLine, shellLine, space, spaceLine, glow, panelFill, panelLine } = atomPalette
const sphereFill = '#cfdde8', sphereLine = '#5f7f96'
const puddingFill = '#fbdcd6', puddingLine = protonLine
const alpha = '#8a63c7', alphaLine = '#5f3f99'
const goldFill = '#f7e6a8', goldLine = '#c49a2c'

type Mode = 'on' | 'active' | 'off'
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox, schematic = true }: { title: string; children: ReactNode; viewBox: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Num({ n, x, y, mode, colour = ink }: { n: number | string; x: number; y: number; mode: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .42 : 1}>
    <circle cx={x} cy={y} r="12" fill={active ? colour : 'white'} stroke={active ? colour : ink} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{n}</text>
  </g>
}
function KeyRow({ n, x, y, lines, mode, colour = ink }: { n: number; x: number; y: number; lines: string[]; mode: Mode; colour?: string }) {
  const active = mode === 'active'
  return <g opacity={mode === 'off' ? .42 : 1}>
    <Num n={n} x={x} y={y} mode={mode === 'off' ? 'on' : mode} colour={colour} />
    <text x={x + 22} y={y + 5 - (lines.length - 1) * 8} fontSize="14" fontWeight={active ? 700 : 600} fill={active ? colour : ink}>{lines.map((l, j) => <tspan key={j} x={x + 22} dy={j ? 16 : 0}>{l}</tspan>)}</text>
  </g>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
/** A bare positive nucleus, drawn before anyone knew what was inside it. */
function PlainNucleus({ cx, cy, r = 9 }: { cx: number; cy: number; r?: number }) {
  return <g><circle cx={cx} cy={cy} r={r * 2} fill={glow} /><circle cx={cx} cy={cy} r={r} fill={protonFill} stroke={protonLine} strokeWidth="1.5" />{r >= 8 && <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize="13" fontWeight="700" fill="white">+</text>}</g>
}
function Dot({ x, y, r = 3.5, fill = electronFill }: { x: number; y: number; r?: number; fill?: string }) {
  return <circle cx={x} cy={y} r={r} fill={fill} />
}

// ---------- Timeline strip: the five models in order ----------
const MODELS = ['solid sphere', 'plum pudding', 'nuclear model', 'Bohr model', 'today’s model']
function ModelIcon({ i, cx, cy, s = 1 }: { i: number; cx: number; cy: number; s?: number }) {
  const r = 19 * s
  if (i === 0) return <circle cx={cx} cy={cy} r={r} fill={sphereFill} stroke={sphereLine} strokeWidth="1.8" />
  if (i === 1) return <g><circle cx={cx} cy={cy} r={r} fill={puddingFill} stroke={puddingLine} strokeWidth="1.8" />
    {[[-8, -7], [7, -9], [-3, 7], [10, 5]].map(([dx, dy], k) => <Dot key={k} x={cx + dx * s} y={cy + dy * s} r={3.2 * s} />)}</g>
  if (i === 2) return <g><circle cx={cx} cy={cy} r={r} fill={space} stroke={spaceLine} strokeWidth="1.8" strokeDasharray="4 3" />
    <circle cx={cx} cy={cy} r={3.4 * s} fill={protonFill} stroke={protonLine} strokeWidth="1" />
    {[[-11, -9], [12, -6], [-6, 12], [9, 11]].map(([dx, dy], k) => <Dot key={k} x={cx + dx * s} y={cy + dy * s} r={2.8 * s} />)}</g>
  const shells = <g><circle cx={cx} cy={cy} r={r} fill={space} stroke={spaceLine} strokeWidth="1.5" />
    <circle cx={cx} cy={cy} r={9 * s} fill="none" stroke={shellLine} strokeWidth="1.4" /><circle cx={cx} cy={cy} r={15 * s} fill="none" stroke={shellLine} strokeWidth="1.4" />
    <Dot x={cx - 9 * s} y={cy} r={2.6 * s} /><Dot x={cx + 9 * s} y={cy} r={2.6 * s} /><Dot x={cx} y={cy - 15 * s} r={2.6 * s} /></g>
  if (i === 3) return <g>{shells}<circle cx={cx} cy={cy} r={3.4 * s} fill={protonFill} stroke={protonLine} strokeWidth="1" /></g>
  return <g>{shells}<circle cx={cx - 1.8 * s} cy={cy - 1.4 * s} r={2.4 * s} fill={protonFill} /><circle cx={cx + 1.8 * s} cy={cy - 1.4 * s} r={2.4 * s} fill="#9aa6b0" /><circle cx={cx} cy={cy + 2 * s} r={2.4 * s} fill={protonFill} /></g>
}
/** current: index of the model being taught; -1 shows every model evenly. Later models are faded. */
function Timeline({ current, y = 0 }: { current: number; y?: number }) {
  const x = (i: number) => 60 + i * 120, cy = y + 32
  return <g>
    <path d={`M${x(0)} ${cy}H${x(4)}`} stroke={panelLine} strokeWidth="3" />
    {MODELS.map((name, i) => {
      const on = current < 0 || i <= current, active = i === current
      return <g key={name} opacity={on ? 1 : .32}>
        {active && <rect x={x(i) - 56} y={y + 2} width={112} height={76} rx="12" fill="#fff4e6" stroke="#e8b778" strokeWidth="1.5" />}
        <ModelIcon i={i} cx={x(i)} cy={cy} />
        <text x={x(i)} y={y + 70} textAnchor="middle" fontSize="13" fontWeight={active ? 700 : 600} fill={ink}>{name}</text>
      </g>
    })}
    <path d={`M20 ${y + 90}H580`} stroke={panelLine} strokeWidth="1.2" />
  </g>
}

// ---------- Section 1: solid spheres, electrons, plum pudding ----------
const EARLY: Record<string, number> = { 'hist-early-model': 0, 'hist-early-sphere': 1, 'hist-early-electron': 2, 'hist-early-pudding': 3 }
const PUDDING_ELECTRONS: Array<[number, number]> = [[-44, -38], [30, -52], [-58, 18], [8, -4], [48, 22], [-18, 50], [36, 62]]
function PuddingAtom({ cx, cy, r = 88, signs = true }: { cx: number; cy: number; r?: number; signs?: boolean }) {
  const s = r / 88
  return <g>
    <circle cx={cx} cy={cy} r={r} fill={puddingFill} stroke={puddingLine} strokeWidth="2" />
    {signs && [[-20, -60], [52, -20], [-40, -8], [-6, 26], [16, -34], [64, 40], [-54, 50], [20, 72]].map(([dx, dy], k) => <text key={k} x={cx + dx * s} y={cy + dy * s + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={puddingLine} opacity=".5">+</text>)}
    {PUDDING_ELECTRONS.map(([dx, dy], k) => signs ? <Electron key={k} x={cx + dx * s} y={cy + dy * s} /> : <Dot key={k} x={cx + dx * s} y={cy + dy * s} r={4.5} />)}
  </g>
}
function Early({ focus }: { focus: string }) {
  const step = EARLY[focus] ?? 3
  const cx = 160, cy = 228
  const titles = [
    'A timeline of five models of the atom: solid sphere, plum pudding, nuclear model, Bohr model and today’s model. Below, three steps: scientists collect evidence, make a model that fits it, and change the model when new evidence does not fit.',
    'The timeline with the solid sphere model highlighted. The atom is drawn as a solid ball with nothing inside, which scientists thought could not be split.',
    'The timeline with the solid sphere model still highlighted. The ball is now drawn with a dashed outline and three tiny negative electrons inside it, showing that atoms contain smaller particles.',
    'The timeline with the plum pudding model highlighted. The atom is a ball of positive charge (pale red with faint plus signs) with negative electrons scattered through it.',
  ]
  return <Diagram viewBox="0 0 600 350" title={titles[step]}>
    <Timeline current={step === 0 ? -1 : step === 2 ? 0 : step === 3 ? 1 : 0} />
    {step === 0 && <g>
      <circle cx={cx} cy={cy} r={80} fill={space} stroke={spaceLine} strokeWidth="2" strokeDasharray="7 5" />
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize="54" fontWeight="700" fill={shellLine}>?</text>
      <text x={cx} y={cy + 106} textAnchor="middle" fontSize="13" fill={muted}>far too small to see inside</text>
      <text x={330} y={132} fontSize="14" fontWeight="700" fill={ink}>How a model changes</text>
      <KeyRow n={1} x={342} y={172} lines={['collect evidence']} mode="on" />
      <KeyRow n={2} x={342} y={222} lines={['make a model', 'that fits it']} mode="on" />
      <KeyRow n={3} x={342} y={280} lines={['new evidence does not', 'fit → change the model']} mode="active" colour={protonLine} />
    </g>}
    {step === 1 && <g>
      <circle cx={cx} cy={cy} r={88} fill={sphereFill} stroke={sphereLine} strokeWidth="2.5" />
      <path d={`M${cx - 52} ${cy - 44}A70 70 0 0 1 ${cx + 10} ${cy - 72}`} fill="none" stroke="white" strokeWidth="6" opacity=".6" />
      <text x={330} y={132} fontSize="14" fontWeight="700" fill={ink}>Solid sphere model</text>
      <KeyRow n={1} x={342} y={180} lines={['a tiny solid ball', 'with nothing inside']} mode="active" colour={sphereLine} />
      <KeyRow n={2} x={342} y={246} lines={['thought to be', 'impossible to split']} mode="on" />
    </g>}
    {step === 2 && <g>
      <circle cx={cx} cy={cy} r={88} fill={sphereFill} stroke={sphereLine} strokeWidth="2.5" strokeDasharray="8 6" opacity=".55" />
      {[[-150, 60], [-30, 58], [70, 72]].map(([a, dist], k) => {
        const rad = a * Math.PI / 180, x0 = cx + Math.cos(rad) * dist, y0 = cy + Math.sin(rad) * dist
        return <Electron key={k} x={x0} y={y0} />
      })}
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize="40" fontWeight="700" fill={sphereLine} opacity=".45">?</text>
      <Pointer n={1} x={cx + 130} y={cy - 84} to={[cx + 48, cy - 24]} />
      <text x={330} y={132} fontSize="14" fontWeight="700" fill={ink}>A new discovery</text>
      <KeyRow n={1} x={342} y={180} lines={['electrons: tiny,', 'negative (−)']} mode="active" colour={electronLine} />
      <KeyRow n={2} x={342} y={246} lines={['found inside atoms,', 'so atoms are not solid']} mode="on" />
    </g>}
    {step === 3 && <g>
      <PuddingAtom cx={cx} cy={cy} />
      <Pointer n={1} x={cx + 128} y={cy - 70} to={[cx + 62, cy - 50]} />
      <Pointer n={2} x={cx + 130} y={cy + 76} to={[cx + 55, cy + 29]} />
      <text x={330} y={132} fontSize="14" fontWeight="700" fill={ink}>Plum pudding model</text>
      <KeyRow n={1} x={342} y={180} lines={['a ball of', 'positive charge']} mode="active" colour={puddingLine} />
      <KeyRow n={2} x={342} y={246} lines={['electrons scattered', 'through the ball']} mode="active" colour={electronLine} />
    </g>}
  </Diagram>
}

// ---------- Section 2 and 3: the gold foil (alpha particle scattering) experiment ----------
const NUCLEI: Array<[number, number]> = [[195, 70], [195, 170], [195, 270]]
const STRAIGHT_Y = [28, 105, 133, 210, 310]
type PathGroup = 'straight' | 'deflected' | 'back'
type FoilView = 'pudding' | 'plain' | 'nuclear'
// Observed paths: bent away from the positive nucleus (repulsion), never towards it.
const OBSERVED: Array<{ group: PathGroup; d: string; start: number }> = [
  ...STRAIGHT_Y.map(y => ({ group: 'straight' as const, d: `M24 ${y}H350`, start: y })),
  { group: 'deflected', d: 'M24 158H163Q191 155 213 133L283 63', start: 158 },
  { group: 'deflected', d: 'M24 283H163Q191 286 215 300L295 330', start: 283 },
  { group: 'back', d: 'M24 69H157C181 69 181 51 157 49L56 45', start: 69 },
]
// What the plum pudding model predicted: through, with only small changes of direction.
const PREDICTED: Array<{ group: PathGroup; d: string; start: number }> = [
  ...STRAIGHT_Y.map(y => ({ group: 'straight' as const, d: `M24 ${y}H350`, start: y })),
  { group: 'deflected', d: 'M24 158H165Q195 157 227 154L350 149', start: 158 },
  { group: 'deflected', d: 'M24 283H165Q195 284 227 287L350 292', start: 283 },
  { group: 'deflected', d: 'M24 69H165Q195 68 227 66L350 61', start: 69 },
]
function Foil({ view }: { view: FoilView }) {
  return <g>
    <rect x={165} y={14} width={60} height={312} rx="6" fill={goldFill} stroke={goldLine} strokeWidth="1.8" opacity={view === 'plain' ? 1 : .55} />
    {view === 'pudding' && NUCLEI.map(([x, y], k) => <PuddingAtom key={k} cx={x} cy={y} r={48} signs={false} />)}
    {view === 'nuclear' && NUCLEI.map(([x, y], k) => <g key={k}>
      <circle cx={x} cy={y} r={48} fill={space} stroke={spaceLine} strokeWidth="1.5" strokeDasharray="5 4" />
      {[[-26, -22], [26, 20], [28, -22]].map(([dx, dy], j) => <Dot key={j} x={x + dx} y={y + dy} r={4} />)}
      <PlainNucleus cx={x} cy={y} r={6} />
    </g>)}
  </g>
}
function AlphaPaths({ paths, show }: { paths: typeof OBSERVED; show: (g: PathGroup) => Mode }) {
  const marker = useId().replace(/:/g, '')
  return <g>
    <defs><marker id={marker} viewBox="0 0 10 10" refX="7" refY="5" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill={alphaLine} /></marker></defs>
    {paths.map((p, i) => {
      const mode = show(p.group)
      return <g key={i} opacity={mode === 'off' ? .22 : 1}>
        <path d={p.d} fill="none" stroke={alpha} strokeWidth={mode === 'active' ? 3.2 : 2.2} markerEnd={`url(#${marker})`} />
        <circle cx={24} cy={p.start} r={6} fill={alpha} stroke={alphaLine} strokeWidth="1.5" />
      </g>
    })}
  </g>
}
const SCATTER: Record<string, { view: FoilView; predicted?: boolean; active: PathGroup[] | 'all'; step: number }> = {
  'hist-alpha-predict': { view: 'pudding', predicted: true, active: 'all', step: 0 },
  'hist-alpha-results': { view: 'plain', active: 'all', step: 0 },
  'hist-alpha-wrong': { view: 'plain', active: ['deflected', 'back'], step: 0 },
  'hist-nuclear-straight': { view: 'nuclear', active: ['straight'], step: 1 },
  'hist-nuclear-close': { view: 'nuclear', active: ['deflected', 'back'], step: 2 },
}
function Scattering({ focus }: { focus: string }) {
  const cfg = SCATTER[focus] ?? SCATTER['hist-alpha-results']
  const show = (g: PathGroup): Mode => cfg.active === 'all' || cfg.active.includes(g) ? 'active' : 'off'
  const kx = 420
  const titles: Record<string, string> = {
    'hist-alpha-predict': 'The prediction. Alpha particles are fired from the left at gold foil whose atoms are drawn as plum pudding atoms. Every path goes through the foil, some changing direction by a small amount.',
    'hist-alpha-results': 'The results. Alpha particles are fired from the left at gold foil. Most paths go straight through; two change direction a lot; one bounces back towards the left.',
    'hist-alpha-wrong': 'The results, with the two paths that changed direction a lot and the one that bounced back highlighted. The plum pudding model did not predict these.',
    'hist-nuclear-straight': 'The gold atoms drawn with the nuclear model: mostly empty space with a tiny positive nucleus. The paths that go straight through, far from any nucleus, are highlighted.',
    'hist-nuclear-close': 'The gold atoms drawn with the nuclear model. Two alpha paths passing close to a nucleus curve away from it; one heading straight at a nucleus is pushed back.',
  }
  const keyTitle = cfg.predicted ? 'Predicted' : cfg.view === 'nuclear' ? 'Explained' : 'What happened'
  const rows: Array<[PathGroup, string[]]> = cfg.predicted
    ? [['straight', ['almost all go', 'straight through']], ['deflected', ['a few change', 'direction a little']]]
    : cfg.view === 'nuclear'
      ? [['straight', ['empty space:', 'straight through']], ['deflected', ['close to a', 'nucleus: pushed', 'off course']], ['back', ['straight at a', 'nucleus: pushed', 'back']]]
      : [['straight', ['most went', 'straight through']], ['deflected', ['some changed', 'direction a lot']], ['back', ['a few', 'bounced back']]]
  const badge: Record<PathGroup, [number, number]> = cfg.predicted ? { straight: [368, 210], deflected: [368, 149], back: [0, 0] } : { straight: [368, 210], deflected: [297, 52], back: [40, 44] }
  const rowMode = (g: PathGroup): Mode => cfg.active === 'all' ? 'on' : show(g) === 'active' ? 'active' : 'off'
  return <Diagram viewBox="0 0 600 350" title={titles[focus] ?? titles['hist-alpha-results']}>
    <Foil view={cfg.view} />
    <AlphaPaths paths={cfg.predicted ? PREDICTED : OBSERVED} show={show} />
    {rows.map(([g], i) => <Num key={g} n={i + 1} x={badge[g][0]} y={badge[g][1]} mode={rowMode(g) === 'off' ? 'off' : 'on'} />)}
    <text x={kx - 12} y={36} fontSize="14" fontWeight="700" fill={ink}>{keyTitle}</text>
    {rows.map(([g, lines], i) => <KeyRow key={g} n={i + 1} x={kx} y={84 + i * 70} lines={lines} mode={rowMode(g)} colour={alphaLine} />)}
    <g opacity=".95">
      <circle cx={kx} cy={292} r={6} fill={alpha} stroke={alphaLine} strokeWidth="1.5" />
      <text x={kx + 14} y={297} fontSize="13" fill={ink}>alpha particle (+)</text>
      <rect x={kx - 8} y={312} width={16} height={14} rx="3" fill={goldFill} stroke={goldLine} strokeWidth="1.5" />
      <text x={kx + 14} y={324} fontSize="13" fill={ink}>gold foil</text>
    </g>
  </Diagram>
}

function Setup() {
  const marker = useId().replace(/:/g, '')
  return <Diagram viewBox="0 0 600 300" title="The set-up. A source on the left gives out a narrow stream of small, positive alpha particles. They are fired at a very thin sheet of gold foil. What happens to them after the foil is shown by a question mark.">
    <defs><marker id={marker} viewBox="0 0 10 10" refX="7" refY="5" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" orient="auto"><path d="M0 0L10 5L0 10Z" fill={alphaLine} /></marker></defs>
    <rect x={30} y={112} width={96} height={76} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="2" />
    <text x={78} y={146} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>source of</text>
    <text x={78} y={163} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>alpha particles</text>
    {[138, 150, 162].map(y => <path key={y} d={`M130 ${y}H300`} stroke={alpha} strokeWidth="2.2" markerEnd={`url(#${marker})`} />)}
    {[[170, 138], [214, 162], [258, 150]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={6} fill={alpha} stroke={alphaLine} strokeWidth="1.5" />)}
    <rect x={312} y={40} width={10} height={220} rx="3" fill={goldFill} stroke={goldLine} strokeWidth="1.8" />
    <text x={360} y={160} textAnchor="middle" fontSize="36" fontWeight="700" fill={shellLine}>?</text>
    <Pointer n={1} x={214} y={80} to={[214, 156]} />
    <Pointer n={2} x={280} y={236} to={[312, 222]} />
    <KeyRow n={1} x={420} y={110} lines={['alpha particles:', 'small, positive (+)']} mode="active" colour={alphaLine} />
    <KeyRow n={2} x={420} y={178} lines={['a very thin sheet', 'of gold (gold foil)']} mode="active" colour={goldLine} />
  </Diagram>
}

// ---------- Section 3: the nuclear model ----------
const LOOSE_ELECTRONS: Array<[number, number]> = [[-60, -58], [70, -30], [-78, 36], [40, 70], [8, -92]]
function NuclearAtom() {
  const cx = 160, cy = 228
  return <Diagram viewBox="0 0 600 350" title="The timeline with the nuclear model highlighted. The atom is mostly empty space, with a tiny positive nucleus in the middle holding most of the mass and electrons around it.">
    <Timeline current={2} />
    <circle cx={cx} cy={cy} r={110} fill={space} stroke={spaceLine} strokeWidth="2" strokeDasharray="7 5" />
    {LOOSE_ELECTRONS.map(([dx, dy], k) => <Electron key={k} x={cx + dx} y={cy + dy} />)}
    <PlainNucleus cx={cx} cy={cy} r={8} />
    <Pointer n={1} x={cx + 40} y={cy + 130 - 22} to={[cx + 7, cy + 9]} />
    <Pointer n={2} x={cx - 132} y={cy + 96} to={[cx - 42, cy + 60]} />
    <Pointer n={3} x={cx + 150} y={cy - 88} to={[cx + 78, cy - 34]} />
    <text x={330} y={132} fontSize="14" fontWeight="700" fill={ink}>Nuclear model</text>
    <KeyRow n={1} x={342} y={174} lines={['tiny positive nucleus', 'with most of the mass']} mode="active" colour={protonLine} />
    <KeyRow n={2} x={342} y={232} lines={['mostly empty space']} mode="on" />
    <KeyRow n={3} x={342} y={284} lines={['electrons around', 'the nucleus']} mode="on" colour={electronLine} />
  </Diagram>
}
function Compare() {
  const rows: Array<[string, string, string]> = [['positive charge', 'spread through the ball', 'in a tiny nucleus'], ['mass', 'spread through the ball', 'mostly in the nucleus'], ['electrons', 'scattered in the ball', 'around the nucleus']]
  return <Diagram viewBox="0 0 600 370" title="Plum pudding model and nuclear model side by side. Positive charge: spread through the ball, or in a tiny nucleus. Mass: spread through, or mostly in the nucleus. Electrons: scattered in the ball, or around the nucleus, with the rest of the atom mostly empty space.">
    <text x={250} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>plum pudding model</text>
    <text x={460} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>nuclear model</text>
    <PuddingAtom cx={250} cy={112} r={72} />
    <circle cx={460} cy={112} r={72} fill={space} stroke={spaceLine} strokeWidth="2" strokeDasharray="7 5" />
    {LOOSE_ELECTRONS.map(([dx, dy], k) => <Electron key={k} x={460 + dx * .7} y={112 + dy * .7} />)}
    <PlainNucleus cx={460} cy={112} r={8} />
    <path d="M337 112H372" stroke={ink} strokeWidth="2.5" /><path d="M364 104L374 112L364 120" fill="none" stroke={ink} strokeWidth="2.5" />
    <rect x={20} y={200} width={560} height={150} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([what, pudding, nuclear], i) => {
      const y = 236 + i * 42
      return <g key={what} fontSize="14" fill={ink}>
        {i > 0 && <path d={`M32 ${y - 24}H568`} stroke={panelLine} strokeWidth="1.2" />}
        <text x={36} y={y} fontWeight="700">{what}</text>
        <text x={250} y={y} textAnchor="middle" fontSize="13">{pudding}</text>
        <text x={460} y={y} textAnchor="middle" fontWeight="700" fill={protonLine}>{nuclear}</text>
      </g>
    })}
  </Diagram>
}

// ---------- Section 4: Bohr's shells, then protons and neutrons (a lithium-7 atom, as in the first atoms lesson) ----------
const LATER: Record<string, number> = { 'hist-later-bohr': 1, 'hist-later-proton': 2, 'hist-later-neutron': 3 }
function Later({ focus }: { focus: string }) {
  const step = LATER[focus] ?? 3
  const cx = 160, cy = 232, radii = [62, 104]
  const titles = [
    '',
    'The timeline with the Bohr model highlighted. A positive nucleus with electrons orbiting it on two circular shells. Each shell is a fixed distance from the nucleus.',
    'The timeline moving on to today’s model. The nucleus is shown made of protons, red particles that each have the same positive charge. The electrons stay on their shells.',
    'The timeline with today’s model highlighted: a lithium atom with 3 protons and 4 neutrons in the nucleus and 3 electrons on two shells. Neutrons have no charge.',
  ]
  const marker = useId().replace(/:/g, '')
  const keyMode = (n: number): Mode => n === step ? 'active' : n < step ? 'on' : 'off'
  return <Diagram viewBox="0 0 600 362" title={titles[step]}>
    <defs><marker id={marker} viewBox="0 0 10 10" refX="6" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto"><path d="M0 0L10 5L0 10Z" fill={electronLine} /></marker></defs>
    <Timeline current={step === 1 ? 3 : 4} />
    <circle cx={cx} cy={cy} r={radii[1] + 20} fill={space} stroke={spaceLine} strokeWidth="1.5" />
    <Shells cx={cx} cy={cy} radii={radii} electrons={[2, 1]} />
    {step === 1 && <g>
      {[[-50, -20, radii[1]], [150, 180, radii[1]], [215, 245, radii[0]]].map(([a0, a1, r], k) => {
        const p = (a: number) => `${r1(cx + Math.cos(a * Math.PI / 180) * (r + 12))} ${r1(cy + Math.sin(a * Math.PI / 180) * (r + 12))}`
        return <path key={k} d={`M${p(a0)}A${r + 12} ${r + 12} 0 0 1 ${p(a1)}`} fill="none" stroke={electronLine} strokeWidth="2" markerEnd={`url(#${marker})`} />
      })}
      <path d={`M${cx} ${cy}L${r1(cx + radii[1] * .71)} ${r1(cy + radii[1] * .71)}`} stroke={ink} strokeWidth="1.8" strokeDasharray="5 4" />
      <PlainNucleus cx={cx} cy={cy} r={10} />
      <text x={cx + 84} y={cy + 88} fontSize="12" fontWeight="700" fill={ink}>fixed</text>
      <text x={cx + 84} y={cy + 103} fontSize="12" fontWeight="700" fill={ink}>distance</text>
    </g>}
    {step === 2 && <Nucleus cx={cx} cy={cy} protons={3} neutrons={4} mode="protons" />}
    {step === 3 && <Nucleus cx={cx} cy={cy} protons={3} neutrons={4} mode="full" />}
    <text x={330} y={132} fontSize="14" fontWeight="700" fill={ink}>{step === 1 ? 'Bohr model' : 'Today’s model'}</text>
    <KeyRow n={1} x={342} y={174} lines={['electrons orbit in', 'shells, each a fixed', 'distance from the nucleus']} mode={keyMode(1)} colour={electronLine} />
    <KeyRow n={2} x={342} y={240} lines={['protons: each has the', 'same positive charge']} mode={keyMode(2)} colour={protonLine} />
    <KeyRow n={3} x={342} y={296} lines={['neutrons: no charge', '(found by Chadwick)']} mode={keyMode(3)} colour={'#7f8c97'} />
  </Diagram>
}

// ---------- Put it together: the whole story ----------
function Story() {
  const x = (i: number) => 60 + i * 120, cy = 120
  const evidence = [['electrons', 'found'], ['gold foil', 'experiment'], ['Bohr’s idea,', 'experiments agree'], ['protons, then', 'neutrons found']]
  const marker = useId().replace(/:/g, '')
  return <Diagram viewBox="0 0 600 270" title="The whole story as a timeline. Solid sphere, then electrons found gives the plum pudding model. The gold foil experiment gives the nuclear model. Bohr’s idea, supported by experiments, adds shells. Protons and then neutrons are found, giving today’s model.">
    <defs><marker id={marker} viewBox="0 0 10 10" refX="7" refY="5" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" orient="auto"><path d="M0 0L10 5L0 10Z" fill={ink} /></marker></defs>
    <text x={20} y={26} fontSize="14" fontWeight="700" fill={ink}>New evidence changed the model each time</text>
    {evidence.map((lines, i) => <g key={i}>
      <path d={`M${x(i) + 34} ${cy}H${x(i + 1) - 34}`} stroke={ink} strokeWidth="2" markerEnd={`url(#${marker})`} />
      <text x={x(i) + 60} y={cy - 46} textAnchor="middle" fontSize="12" fill={muted}>{lines.map((l, j) => <tspan key={j} x={x(i) + 60} dy={j ? 15 : 0}>{l}</tspan>)}</text>
    </g>)}
    {MODELS.map((name, i) => <g key={name}>
      <ModelIcon i={i} cx={x(i)} cy={cy} s={1.35} />
      <text x={x(i)} y={cy + 50} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{name}</text>
    </g>)}
    <rect x={20} y={196} width={560} height={58} rx="10" fill="#fff4e6" stroke="#e8b778" strokeWidth="1.5" />
    <text x={300} y={220} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>Today’s model: protons and neutrons in a tiny nucleus,</text>
    <text x={300} y={240} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>electrons in shells around it</text>
  </Diagram>
}

// ---------- On your own ----------
function PathsQuestion({ assessment }: { assessment: boolean }) {
  // 1 = bounced back, 2 = straight through, 3 = deflected a lot.
  const paths = [OBSERVED.find(p => p.group === 'back')!, { group: 'straight' as const, d: 'M24 210H350', start: 210 }, OBSERVED.find(p => p.group === 'deflected')!]
  const badges: Array<[number, number]> = [[40, 44], [368, 210], [297, 52]]
  const labels = ['bounced back', 'went straight through', 'deflected a lot']
  return <Diagram viewBox="0 0 600 350" title={assessment ? 'Three numbered paths of alpha particles fired from the left at gold foil.' : 'Three alpha paths at gold foil. Path 1 bounced back, path 2 went straight through empty space, far from any nucleus, and path 3 was deflected a lot by passing close to a nucleus.'}>
    <Foil view={assessment ? 'plain' : 'nuclear'} />
    <AlphaPaths paths={paths} show={() => 'on'} />
    {badges.map(([x, y], i) => <Num key={i} n={i + 1} x={x} y={y} mode="on" />)}
    <g>
      <circle cx={420} cy={292} r={6} fill={alpha} stroke={alphaLine} strokeWidth="1.5" />
      <text x={434} y={297} fontSize="13" fill={ink}>alpha particle (+)</text>
      <rect x={412} y={312} width={16} height={14} rx="3" fill={goldFill} stroke={goldLine} strokeWidth="1.5" />
      <text x={434} y={324} fontSize="13" fill={ink}>gold foil</text>
    </g>
    {!assessment && labels.map((l, i) => <KeyRow key={l} n={i + 1} x={420} y={96 + i * 56} lines={l === 'went straight through' ? ['went straight', 'through'] : [l]} mode={i === 1 ? 'active' : 'on'} colour={alphaLine} />)}
  </Diagram>
}
function DataQuestion() {
  const rows: Array<[string, string]> = [['went straight through', '9 978'], ['changed direction a lot', '20'], ['bounced back', '2'], ['total fired', '10 000']]
  return <Diagram viewBox="0 0 600 230" schematic={false} title="Table of results from a computer model firing 10 000 alpha particles at gold foil: 9 978 went straight through, 20 changed direction a lot and 2 bounced back.">
    <text x={30} y={26} fontSize="14" fontWeight="700" fill={ink}>Computer model: alpha particles fired at gold foil</text>
    <rect x={20} y={40} width={560} height={176} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={40} y={70} fontSize="14" fontWeight="700" fill={ink}>what the alpha particle did</text>
    <text x={470} y={70} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>number</text>
    <path d="M32 82H568" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([what, n], i) => <g key={what} fontSize="14" fill={ink} fontWeight={i === 3 ? 700 : 400}>
      {i === 3 && <path d={`M32 ${182}H568`} stroke={panelLine} strokeWidth="1.5" />}
      <text x={40} y={108 + i * 30 + (i === 3 ? 8 : 0)}>{what}</text>
      <text x={470} y={108 + i * 30 + (i === 3 ? 8 : 0)} textAnchor="middle">{n}</text>
    </g>)}
  </Diagram>
}

export function AtomHistoryVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('hist-early-')) return <Early focus={focus} />
  if (focus === 'hist-alpha-setup') return <Setup />
  if (focus in SCATTER) return <Scattering focus={focus} />
  if (focus === 'hist-nuclear-atom') return <NuclearAtom />
  if (focus === 'hist-compare') return <Compare />
  if (focus.startsWith('hist-later-')) return <Later focus={focus} />
  if (focus === 'hist-story') return <Story />
  if (focus === 'hist-question') return <PathsQuestion assessment={assessment} />
  if (focus === 'hist-data') return <DataQuestion />
  return <Story />
}

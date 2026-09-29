import { physicsPalette, PhysicsDiagram, Lines } from './PhysicsKit'
import { Electron, Proton, Nucleus } from './AtomVisuals'
import { nuc, r1, Arrow, WavyArrow, Chip, Callout } from './NuclearModelVisuals'

/*
 * Physics Lesson 32: The structure of the atom. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'nucatom-' and is routed from CellBiologyVisuals.tsx.
 *
 * One lithium atom (3 protons, 4 neutrons, electrons 2 and 1) is used throughout, so the picture builds up frame by frame.
 * Energy levels are thin dashed rings (an empty level is fainter); EM radiation absorbed or released is an amber wavy arrow.
 */
const P = physicsPalette
const { ink, muted } = nuc
const LEVELS = [52, 88, 124]
type El = { lv: number; a: number; ghost?: boolean }
const LI_ELS: El[] = [{ lv: 0, a: 215 }, { lv: 0, a: 35 }, { lv: 1, a: -40 }]
const at = (cx: number, cy: number, r: number, a: number): [number, number] => [r1(cx + Math.cos(a * Math.PI / 180) * r), r1(cy + Math.sin(a * Math.PI / 180) * r)]

function LiAtom({ cx, cy, s = 1, levels = 2, els = LI_ELS, space = true, protons = 3, neutrons = 4, numbers = false, dimLevels = false }: {
  cx: number; cy: number; s?: number; levels?: number; els?: El[]; space?: boolean; protons?: number; neutrons?: number; numbers?: boolean; dimLevels?: boolean
}) {
  const radii = LEVELS.map(r => r * s)
  const used = new Set(els.filter(e => !e.ghost).map(e => e.lv))
  return <g>
    {space && <circle cx={cx} cy={cy} r={r1(radii[levels - 1] + 20 * s)} fill={nuc.space} stroke={nuc.spaceLine} strokeWidth="1.5" />}
    {radii.slice(0, levels).map((r, i) => <circle key={i} cx={cx} cy={cy} r={r1(r)} fill="none" stroke={nuc.levelLine} strokeWidth="1.8" strokeDasharray="5 5" opacity={dimLevels ? .5 : used.has(i) || i < 2 ? 1 : .6} />)}
    {numbers && radii.slice(0, levels).map((r, i) => {
      const [x, y] = at(cx, cy, r, 140)
      return <g key={`n${i}`}><circle cx={x} cy={y} r="11" fill="white" stroke={ink} strokeWidth="1.6" /><text x={x} y={y + 4.5} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{i + 1}</text></g>
    })}
    {els.map((e, i) => {
      const [x, y] = at(cx, cy, radii[e.lv], e.a)
      return e.ghost
        ? <circle key={i} cx={x} cy={y} r={r1(8.5 * s)} fill="white" stroke={nuc.electronLine} strokeWidth="1.6" strokeDasharray="3 3" />
        : <Electron key={i} x={x} y={y} r={r1(Math.max(5, 8.5 * s))} sign={s >= .8} />
    })}
    <Nucleus cx={cx} cy={cy} protons={protons} neutrons={neutrons} r={r1(Math.max(4, 9 * s))} signs={s >= .8} />
  </g>
}

/* ---------- Section 2: the nuclear model ---------- */

function Model() {
  const cx = 160, cy = 150
  return <PhysicsDiagram title="The nuclear model of a lithium atom: a tiny nucleus of protons and neutrons in the centre, with electrons orbiting it in energy levels.">
    <LiAtom cx={cx} cy={cy} />
    <Callout at={[330, 70]} to={at(cx, cy, 95, -45)} lines={['electrons']} colour={nuc.electronLine} />
    <Callout at={[330, 150]} to={[cx + 14, cy + 4]} lines={['nucleus: protons', 'and neutrons']} colour={nuc.protonLine} />
    <Callout at={[330, 238]} to={at(cx, cy, 88, 40)} lines={['energy levels']} />
  </PhysicsDiagram>
}
function Charges() {
  const rows: [string, string, string, string][] = [['proton', 'positive', '+1', nuc.protonLine], ['neutron', 'neutral', '0', nuc.neutronLine], ['electron', 'negative', '−1', nuc.electronLine]]
  return <PhysicsDiagram title="Relative charges: a proton is +1, a neutron is 0 and an electron is −1. With its protons, the nucleus has an overall positive charge.">
    <LiAtom cx={104} cy={140} s={.7} />
    <Lines x={104} y={268} anchor="middle" lines={['nucleus: positive']} size={13} colour={nuc.protonLine} />
    <rect x={218} y={34} width={312} height={222} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <text x={240} y={66} fontSize="13" fontWeight="700" fill={muted}>particle</text>
    <text x={496} y={66} textAnchor="end" fontSize="13" fontWeight="700" fill={muted}>relative charge</text>
    {rows.map(([name, kind, charge, colour], i) => {
      const y = 112 + i * 56
      return <g key={name}>
        <path d={`M232 ${y - 30}H516`} stroke={P.panelLine} strokeWidth="1.2" />
        {i === 0 ? <Proton x={250} y={y - 2} r={11} /> : i === 1 ? <circle cx={250} cy={y - 2} r={11} fill={nuc.neutron} stroke={nuc.neutronLine} strokeWidth="1.5" /> : <Electron x={250} y={y - 2} r={9} />}
        <text x={272} y={y + 3} fontSize="15" fontWeight="750" fill={colour}>{name}</text>
        <text x={364} y={y + 3} fontSize="13" fontWeight="600" fill={muted}>{kind}</text>
        <text x={484} y={y + 4} textAnchor="middle" fontSize="19" fontWeight="800" fill={colour}>{charge}</text>
      </g>
    })}
  </PhysicsDiagram>
}
function Neutral() {
  return <PhysicsDiagram title="A lithium atom has 3 protons and 3 electrons. Each +1 cancels a −1, so the atom has no overall charge.">
    <LiAtom cx={140} cy={150} />
    {[0, 1, 2].map(i => {
      const y = 70 + i * 52
      return <g key={i}>
        <Proton x={330} y={y} r={11} />
        <path d={`M346 ${y}H424`} stroke={muted} strokeWidth="1.8" strokeDasharray="5 5" />
        <Electron x={440} y={y} r={10} />
        <text x={385} y={y - 8} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>cancel</text>
      </g>
    })}
    <text x={385} y={236} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>3 + and 3 − cancel</text>
    <Chip x={385} y={268} text="no overall charge" size={14} colour={nuc.good} fill="#eef7f1" />
  </PhysicsDiagram>
}

/* ---------- Section 3: size and mass ---------- */

function TenPower({ x, y, size = 22, colour = ink }: { x: number; y: number; size?: number; colour?: string }) {
  return <text x={x} y={y} fontSize={size} fontWeight="800" fill={colour}>1 × 10<tspan dy={-size * .42} fontSize={Math.max(12, size * .6)}>−10</tspan><tspan dy={size * .42}> m</tspan></text>
}
function Size() {
  const cx = 150, cy = 150, R = 126
  const edge = at(cx, cy, R, -32)
  return <PhysicsDiagram title="An atom is very small: its radius is about 1 × 10⁻¹⁰ m, which is 0.0000000001 m.">
    <circle cx={cx} cy={cy} r={R} fill={nuc.space} stroke={nuc.spaceLine} strokeWidth="2" />
    <LiAtom cx={cx} cy={cy} s={.85} space={false} />
    <Arrow from={[cx, cy]} to={edge} colour={nuc.mass} width={2.6} />
    <text x={r1((cx + edge[0]) / 2 + 12)} y={r1((cy + edge[1]) / 2 + 22)} fontSize="13" fontWeight="700" fill={nuc.mass}>radius</text>
    <Lines x={316} y={96} lines={['radius of an atom']} size={15} colour={muted} />
    <text x={316} y={124} fontSize="15" fontWeight="700" fill={ink}>about</text>
    <TenPower x={316} y={156} size={26} colour={nuc.mass} />
    <Lines x={316} y={196} lines={['= 0.0000000001 m']} size={15} weight={700} />
    <Lines x={316} y={236} lines={['too small to see, even', 'with a light microscope']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}
function Stadium({ x, y }: { x: number; y: number }) {
  return <g>
    <ellipse cx={x} cy={y} rx={96} ry={56} fill="#dfe5ea" stroke="#8a99a6" strokeWidth="2" />
    <ellipse cx={x} cy={y} rx={78} ry={42} fill="#cfe6c2" stroke="#4f8f5a" strokeWidth="1.6" />
    <path d={`M${x} ${y - 42}V${y + 42}`} stroke="white" strokeWidth="1.6" opacity=".9" />
    <circle cx={x} cy={y} r={12} fill="none" stroke="white" strokeWidth="1.6" opacity=".9" />
    <circle cx={x} cy={y} r={3} fill="#5a9a3a" stroke="#3d7326" strokeWidth="1" />
  </g>
}
function NucleusSize() {
  const cx = 140, cy = 150, R = 118
  return <PhysicsDiagram title="The radius of the nucleus is over 10 000 times smaller than the radius of the atom. If an atom were the size of a stadium, the nucleus would be about the size of a pea in the middle.">
    <circle cx={cx} cy={cy} r={R} fill={nuc.space} stroke={nuc.spaceLine} strokeWidth="2" />
    <circle cx={cx} cy={cy} r={7} fill={nuc.glow} /><circle cx={cx} cy={cy} r={2.6} fill={nuc.proton} stroke={nuc.protonLine} strokeWidth="1" />
    <Arrow from={[cx + 8, cy]} to={[cx + R, cy]} colour={nuc.mass} width={2.4} />
    <text x={cx + 64} y={cy - 10} textAnchor="middle" fontSize="13" fontWeight="700" fill={nuc.mass}>atom radius</text>
    <Callout at={[cx, 212]} anchor="middle" to={[cx, cy + 8]} lines={['nucleus: radius over', '10 000 times smaller']} colour={nuc.protonLine} size={13} />
    <Lines x={420} y={44} anchor="middle" lines={['if the atom were', 'a stadium…']} size={14} />
    <Stadium x={420} y={158} />
    <Callout at={[420, 262]} anchor="middle" to={[420, 162]} lines={['…the nucleus would be a pea']} colour="#3d7326" size={13} />
  </PhysicsDiagram>
}
function Mass() {
  const cx = 150, cy = 150
  return <PhysicsDiagram title="The nucleus is tiny but holds almost all the mass of the atom. Most of the atom is empty space.">
    <LiAtom cx={cx} cy={cy} />
    <Callout at={[318, 62]} to={[cx + 16, cy - 8]} lines={['nucleus: almost', 'all the mass']} colour={nuc.protonLine} size={15} />
    <Callout at={[318, 150]} to={at(cx, cy, 70, 30)} lines={['mostly empty', 'space']} size={15} />
    <text x={318} y={222} fontSize="13" fontWeight="700" fill={muted}>where the mass is</text>
    <rect x={318} y={234} width={200} height={24} rx="12" fill={nuc.proton} stroke={nuc.protonLine} strokeWidth="1.5" />
    <rect x={514} y={234} width={4} height={24} fill={nuc.electron} />
    <text x={330} y={251} fontSize="13" fontWeight="700" fill="white">nucleus</text>
    <text x={518} y={276} textAnchor="end" fontSize="12" fontWeight="650" fill={nuc.electronLine}>electrons: tiny</text>
  </PhysicsDiagram>
}

/* ---------- Section 4: energy levels ---------- */

const EL_CX = 160, EL_CY = 150
function Levels() {
  return <PhysicsDiagram title="Electrons orbit at different distances called energy levels, numbered 1, 2, 3 from the nucleus. The further out the level, the more energy an electron in it has.">
    <LiAtom cx={EL_CX} cy={EL_CY} levels={3} numbers space />
    <Arrow from={[EL_CX + 22, EL_CY]} to={[EL_CX + 162, EL_CY]} colour="#c77a1c" width={3.2} />
    <Lines x={338} y={142} lines={['further out,', 'more energy']} size={16} colour="#b86f1e" />
    <Lines x={338} y={206} lines={['each level is at a', 'fixed distance']} size={13} weight={600} colour={muted} />
  </PhysicsDiagram>
}
function Jump({ dir }: { dir: 'up' | 'down' }) {
  const lo = at(EL_CX, EL_CY, LEVELS[1], -44), hi = at(EL_CX, EL_CY, LEVELS[2], -18)
  const els: El[] = [{ lv: 0, a: 215 }, { lv: 0, a: 35 }, dir === 'up' ? { lv: 1, a: -44, ghost: true } : { lv: 2, a: -18, ghost: true }, dir === 'up' ? { lv: 2, a: -18 } : { lv: 1, a: -44 }]
  const from = dir === 'up' ? lo : hi, to = dir === 'up' ? hi : lo
  const waveOut: [number, number] = [470, 50], waveNear: [number, number] = [lo[0] + 8, lo[1] - 12]
  return <PhysicsDiagram title={dir === 'up'
    ? 'An electron absorbs EM radiation and moves up from energy level 2 to energy level 3, further from the nucleus.'
    : 'An electron moves down from energy level 3 to energy level 2, closer to the nucleus, and releases EM radiation.'}>
    <LiAtom cx={EL_CX} cy={EL_CY} levels={3} numbers els={els} />
    <Arrow from={[from[0] + (to[0] - from[0]) * .22, from[1] + (to[1] - from[1]) * .22]} to={[from[0] + (to[0] - from[0]) * .76, from[1] + (to[1] - from[1]) * .76]} via={[(from[0] + to[0]) / 2 - 10, (from[1] + to[1]) / 2 + 12]} colour={ink} width={2.4} />
    {dir === 'up'
      ? <WavyArrow from={waveOut} to={waveNear} colour={nuc.em} />
      : <WavyArrow from={[lo[0] + 8, lo[1] - 12]} to={waveOut} colour={nuc.em} />}
    <Lines x={352} y={124} lines={dir === 'up' ? ['EM radiation', 'absorbed'] : ['EM radiation', 'released']} size={16} colour="#a67a0c" />
    <Lines x={352} y={184} lines={dir === 'up' ? ['the electron moves', 'up a level, further out'] : ['the electron moves', 'down a level, closer in']} size={14} weight={650} />
  </PhysicsDiagram>
}
function Ion() {
  const xs = [82, 260, 438], cy = 128, s = .62
  const outer = at(xs[1], cy, LEVELS[1] * s, -40)
  return <PhysicsDiagram title="Making an ion: a lithium atom has 3 protons and 3 electrons. Its outer electron absorbs enough EM radiation to leave the atom. With 3 protons and 2 electrons, it is now a positive ion.">
    <LiAtom cx={xs[0]} cy={cy} s={s} />
    <LiAtom cx={xs[1]} cy={cy} s={s} els={[{ lv: 0, a: 215 }, { lv: 0, a: 35 }, { lv: 1, a: -40, ghost: true }]} />
    <WavyArrow from={[xs[1] - 70, cy - 104]} to={[outer[0] - 8, outer[1] - 8]} colour={nuc.em} amp={5} width={2.4} waves={3} />
    <Arrow from={[outer[0] + 6, outer[1] - 8]} to={[outer[0] + 28, outer[1] - 40]} colour={nuc.electronLine} width={2.2} />
    <Electron x={outer[0] + 34} y={outer[1] - 50} r={7} />
    <LiAtom cx={xs[2]} cy={cy} s={s} els={[{ lv: 0, a: 215 }, { lv: 0, a: 35 }]} />
    <path d={`M${xs[2] - 72} ${cy - 72}h-8v144h8M${xs[2] + 72} ${cy - 72}h8v144h-8`} stroke={ink} strokeWidth="2.6" fill="none" />
    <text x={xs[2] + 86} y={cy - 60} fontSize="22" fontWeight="800" fill={nuc.protonLine}>+</text>
    {[0, 1].map(i => <Arrow key={i} from={[xs[i] + 74, cy + 46]} to={[xs[i + 1] - 74, cy + 46]} colour={muted} width={2.2} />)}
    <Lines x={xs[0]} y={228} anchor="middle" lines={['3 +  and  3 −', 'no charge']} size={13} />
    <Lines x={xs[1]} y={228} anchor="middle" lines={['outer electron', 'leaves']} size={13} colour={nuc.electronLine} />
    <Lines x={xs[2]} y={228} anchor="middle" lines={['3 +  and  2 −', 'charge +1']} size={13} />
    <Chip x={xs[2]} y={276} text="positive ion" size={14} colour={nuc.protonLine} fill="#fdf1ee" />
  </PhysicsDiagram>
}
function QuestionLevels() {
  const cx = 190, cy = 150, rIn = 62, rOut = 116
  const inner = at(cx, cy, rIn, -38), outer = at(cx, cy, rOut, -38)
  return <PhysicsDiagram title="An atom with an electron moving between energy levels and a wavy arrow leaving.">
    <circle cx={cx} cy={cy} r={rOut + 20} fill={nuc.space} stroke={nuc.spaceLine} strokeWidth="1.5" />
    {[rIn, rOut].map(r => <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={nuc.levelLine} strokeWidth="1.8" strokeDasharray="5 5" />)}
    <circle cx={outer[0]} cy={outer[1]} r={8.5} fill="white" stroke={nuc.electronLine} strokeWidth="1.6" strokeDasharray="3 3" />
    <Electron x={inner[0]} y={inner[1]} r={8.5} />
    <Electron x={cx - rIn} y={cy} r={8.5} />
    <Arrow from={[outer[0] - 13, outer[1] + 10]} to={[inner[0] + 11, inner[1] - 8]} colour={ink} width={2.4} />
    <Nucleus cx={cx} cy={cy} protons={2} neutrons={2} r={9} />
    <WavyArrow from={[inner[0] + 16, inner[1] - 2]} to={[470, 150]} colour={nuc.em} />
  </PhysicsDiagram>
}

export function AtomStructureVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'nucatom-model': return <Model />
    case 'nucatom-charges': return <Charges />
    case 'nucatom-neutral': return <Neutral />
    case 'nucatom-size': return <Size />
    case 'nucatom-nucleus-size': return <NucleusSize />
    case 'nucatom-mass': return <Mass />
    case 'nucatom-levels': return <Levels />
    case 'nucatom-up': return <Jump dir="up" />
    case 'nucatom-down': return <Jump dir="down" />
    case 'nucatom-ion': return <Ion />
    case 'nucatom-q-levels': return <QuestionLevels />
    default: return null
  }
}

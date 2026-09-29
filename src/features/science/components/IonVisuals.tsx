import { useId, type ReactNode } from 'react'
import { atomPalette, Electron, Nucleus } from './AtomVisuals'

/*
 * Chemistry C2 (Chemistry Lesson 12): how ions form. Original, code-native schematics; not to scale.
 * Focus ids start with 'ion-'. Atoms reuse the Chemistry particle code from AtomVisuals.tsx (proton coral, neutron grey,
 * electron blue on thin circular shells), drawn the same way as in the electronic structure lesson.
 * Every particle drawn is real: the nucleus holds the protons and neutrons of the element's commonest isotope and the
 * electrons fill 2, then up to 8, then up to 8. An ion keeps its nucleus and has electrons removed from, or added to,
 * the outer shell. Ions sit in square brackets with the charge at the top right (real minus sign). Positive ions have a
 * pale coral (proton) wash, negative ions a pale blue (electron) wash; atoms keep the neutral pale blue-grey wash.
 * One atom becomes one ion in every drawing: ions together in compounds (dot-and-cross) belong to the ionic bonding lesson.
 */
const { ink, muted, protonFill, protonLine, electronLine, shellLine, space, spaceLine, panelFill, panelLine, glow } = atomPalette

const posFill = glow, posLine = protonLine
const negFill = '#e4f0f9', negLine = electronLine
const r1 = (n: number) => Math.round(n * 10) / 10
const MINUS = '−'

// Atomic number and neutrons of the commonest isotope.
const ELEMENTS = {
  O: { name: 'oxygen', ion: 'oxide', z: 8, n: 8 }, Ne: { name: 'neon', ion: '', z: 10, n: 10 }, Na: { name: 'sodium', ion: 'sodium', z: 11, n: 12 },
  Mg: { name: 'magnesium', ion: 'magnesium', z: 12, n: 12 }, S: { name: 'sulfur', ion: 'sulfide', z: 16, n: 16 }, Cl: { name: 'chlorine', ion: 'chloride', z: 17, n: 18 },
  Ar: { name: 'argon', ion: '', z: 18, n: 22 },
} as const
type Sym = keyof typeof ELEMENTS
const CAPACITY = [2, 8, 8, 2]
function structure(electrons: number) {
  const shells: number[] = []
  let left = electrons
  for (const cap of CAPACITY) { if (left <= 0) break; const k = Math.min(cap, left); shells.push(k); left -= k }
  return shells
}
const written = (s: number[]) => s.join(',')
/** The charge written the chemist's way: 1+ is '+', 2− is '2−'. */
const chargeText = (q: number) => q === 0 ? '' : `${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : MINUS}`
const chargeWords = (q: number) => q === 0 ? '0' : `${Math.abs(q)}${q > 0 ? '+' : MINUS}`

function Diagram({ title, children, viewBox = '0 0 600 290', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(angle) * 13)} ${r1(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}
const onCircle = (cx: number, cy: number, r: number, deg: number): [number, number] => [r1(cx + Math.cos(deg * Math.PI / 180) * r), r1(cy + Math.sin(deg * Math.PI / 180) * r)]
function Formula({ x, y, sym, q, size = 20, fill = ink, anchor = 'middle' }: { x: number; y: number; sym: string; q: number; size?: number; fill?: string; anchor?: 'middle' | 'start' }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight="700" fill={fill}>{sym}<tspan dy={r1(-size * .42)} fontSize={r1(size * .68)}>{chargeText(q)}</tspan></text>
}
function Arrow({ x1, x2, y, colour = ink }: { x1: number; x2: number; y: number; colour?: string }) {
  const d = x2 > x1 ? 1 : -1
  return <g><path d={`M${x1} ${y}H${x2 - 4 * d}`} stroke={colour} strokeWidth="3" /><path d={`M${x2 - 12 * d} ${y - 9}L${x2} ${y}L${x2 - 12 * d} ${y + 9}`} fill="none" stroke={colour} strokeWidth="3" /></g>
}
/** A dashed curved arrow for an electron moving between a particle and the free electrons above the reaction arrow. */
function Move({ from, to, colour }: { from: [number, number]; to: [number, number]; colour: string }) {
  const mx = (from[0] + to[0]) / 2, my = Math.min(from[1], to[1]) - 18
  const angle = Math.atan2(to[1] - my, to[0] - mx), h = 9
  const tip: [number, number] = [to[0] - Math.cos(angle) * 2, to[1] - Math.sin(angle) * 2]
  return <g><path d={`M${from[0]} ${from[1]}Q${r1(mx)} ${r1(my)} ${r1(tip[0])} ${r1(tip[1])}`} fill="none" stroke={colour} strokeWidth="2" strokeDasharray="5 4" />
    <path d={`M${r1(tip[0] - h * Math.cos(angle - .45))} ${r1(tip[1] - h * Math.sin(angle - .45))}L${r1(tip[0])} ${r1(tip[1])}L${r1(tip[0] - h * Math.cos(angle + .45))} ${r1(tip[1] - h * Math.sin(angle + .45))}`} fill="none" stroke={colour} strokeWidth="2" /></g>
}

// ---------- One particle: an atom, or the ion made from it ----------
const START = [180, -90, -45, -90]
type Tone = 'atom' | 'pos' | 'neg' | 'plain'
const WASH: Record<Tone, [string, string]> = { atom: [space, spaceLine], pos: [posFill, posLine], neg: [negFill, negLine], plain: [space, spaceLine] }
/** Electron indices on the outer shell nearest the top of the particle (where moved electrons are drawn from or to). */
function nearTop(count: number, start: number, k: number) {
  return Array.from({ length: count }, (_, j) => j).sort((a, b) => {
    const d = (j: number) => { const deg = ((start + j * 360 / count) % 360 + 360) % 360; return Math.min(Math.abs(deg - 270), 360 - Math.abs(deg - 270)) }
    return d(a) - d(b)
  }).slice(0, k)
}
function Particle({ cx, cy, sym, electrons, radii, er = 5.5, tone = 'atom', ring = 0, highlightOuter = false, brackets = false, charge, hideCharge = false }: {
  cx: number; cy: number; sym: Sym; electrons: number; radii: number[]; er?: number; tone?: Tone; ring?: number; highlightOuter?: boolean; brackets?: boolean; charge?: number; hideCharge?: boolean
}) {
  const el = ELEMENTS[sym], shells = structure(electrons), total = el.z + el.n
  const nr = Math.min(er * 1.25, (radii[0] - er - 3) / (1.1 * Math.sqrt(Math.max(total - 0.7, .3)) + 1.7))
  const outer = radii[shells.length - 1], cloud = outer + er + 7, [fill, line] = WASH[tone]
  const last = shells.length - 1, ringed = ring ? nearTop(shells[last], START[last], ring) : []
  const half = cloud + 8, q = charge ?? 0
  return <g>
    <circle cx={cx} cy={cy} r={r1(cloud)} fill={fill} stroke={line} strokeWidth="1.5" />
    {shells.map((_, i) => <circle key={`s${i}`} cx={cx} cy={cy} r={radii[i]} fill="none" stroke={highlightOuter && i === last ? electronLine : shellLine} strokeWidth={highlightOuter && i === last ? 2.6 : 1.8} />)}
    {shells.map((count, s) => Array.from({ length: count }, (_, j) => {
      const [x, y] = onCircle(cx, cy, radii[s], START[s] + j * 360 / count)
      return <g key={`${s}-${j}`}>
        {s === last && ringed.includes(j) && <circle cx={x} cy={y} r={er + 4} fill="white" stroke={ink} strokeWidth="1.8" />}
        <Electron x={x} y={y} r={er} sign={false} />
      </g>
    }))}
    <Nucleus cx={cx} cy={cy} protons={el.z} neutrons={el.n} r={r1(nr)} mode="full" signs={false} />
    {brackets && <g fill="none" stroke={ink} strokeWidth="2.4">
      <path d={`M${r1(cx - half + 9)} ${r1(cy - half)}H${r1(cx - half)}V${r1(cy + half)}H${r1(cx - half + 9)}`} />
      <path d={`M${r1(cx + half - 9)} ${r1(cy - half)}H${r1(cx + half)}V${r1(cy + half)}H${r1(cx + half - 9)}`} />
    </g>}
    {brackets && (hideCharge
      ? <text x={r1(cx + half + 6)} y={r1(cy - half + 14)} fontSize="20" fontWeight="700" fill={muted}>?</text>
      : <text x={r1(cx + half + 4)} y={r1(cy - half + 14)} fontSize="20" fontWeight="700" fill={q > 0 ? posLine : negLine}>{chargeText(q)}</text>)}
  </g>
}
const RADII: Record<number, number[]> = { 2: [22, 42], 3: [20, 38, 56] }
const radiiFor = (electrons: number) => RADII[structure(electrons).length] ?? RADII[3]

// ---------- Atom → ion, with the moved electrons above the arrow ----------
type Change = { sym: Sym; moved: number } // moved > 0: electrons lost; < 0: electrons gained
function AtomToIon({ sym, moved, step = 'done', assessment = false, atomX = 95, ionX = 305, cy = 128 }: Change & { step?: 'atom' | 'done'; assessment?: boolean; atomX?: number; ionX?: number; cy?: number }) {
  const el = ELEMENTS[sym], ionElectrons = el.z - moved, q = moved
  const aR = radiiFor(el.z), iR = radiiFor(ionElectrons)
  const aCloud = aR[structure(el.z).length - 1] + 12.5, iHalf = iR[structure(ionElectrons).length - 1] + 20.5
  const x1 = atomX + aCloud + 12, x2 = ionX - iHalf - 10, mid = (x1 + x2) / 2
  const lose = moved > 0, n = Math.abs(moved), colour = lose ? posLine : negLine
  const free = Array.from({ length: n }, (_, i) => mid + (i - (n - 1) / 2) * 20)
  return <g>
    <Particle cx={atomX} cy={cy} sym={sym} electrons={el.z} radii={aR} ring={lose && !assessment && step === 'done' ? n : 0} />
    {step === 'done' && <g>
      <Arrow x1={x1} x2={x2} y={cy} />
      <Particle cx={ionX} cy={cy} sym={sym} electrons={ionElectrons} radii={iR} tone={assessment ? 'plain' : q > 0 ? 'pos' : 'neg'} ring={!lose && !assessment ? n : 0} brackets charge={q} hideCharge={assessment} />
      {!assessment && <g>
        {free.map((x, i) => <Electron key={i} x={x} y={cy - 88} r={5.5} sign={false} />)}
        <text x={mid} y={cy - 104} textAnchor="middle" fontSize="13" fontWeight="700" fill={colour}>{n} electron{n > 1 ? 's' : ''} {lose ? 'lost' : 'gained'}</text>
        {lose
          ? <Move from={onCircle(atomX, cy, aCloud, -50)} to={[r1(free[0] - 9), cy - 86]} colour={colour} />
          : <Move from={[r1(free[n - 1] + 9), cy - 86]} to={onCircle(ionX, cy, iHalf - 8, -125)} colour={colour} />}
      </g>}
    </g>}
  </g>
}
/** Name, electronic structure and particle count under a particle. */
function Caption({ x, y, head, structureText, counts, colour = ink, formula }: { x: number; y: number; head: string; structureText: string; counts?: string; colour?: string; formula?: { sym: string; q: number } }) {
  return <g>
    <text x={x} y={y} textAnchor="middle" fontSize="14" fontWeight="700" fill={colour}>{head}{formula && ' '}{formula && <>{formula.sym}<tspan dy="-6" fontSize="10.5">{chargeText(formula.q)}</tspan></>}</text>
    <text x={x} y={y + 21} textAnchor="middle" fontSize="16" fontWeight="700" fill={electronLine}>{structureText}</text>
    {counts && <text x={x} y={y + 40} textAnchor="middle" fontSize="12.5" fill={muted}>{counts}</text>}
  </g>
}
const countLine = (p: number, e: number) => `${p} protons · ${e} electrons`
function ChangeCaptions({ sym, moved, atomX = 95, ionX = 305, y = 226, step = 'done' }: Change & { atomX?: number; ionX?: number; y?: number; step?: 'atom' | 'done' }) {
  const el = ELEMENTS[sym], e = el.z - moved
  return <g>
    <Caption x={atomX} y={y} head={`${el.name} atom`} structureText={written(structure(el.z))} counts={countLine(el.z, el.z)} />
    {step === 'done' && <Caption x={ionX} y={y} head={`${el.ion} ion`} formula={{ sym, q: moved }} colour={moved > 0 ? posLine : negLine} structureText={written(structure(e))} counts={countLine(el.z, e)} />}
  </g>
}

// ---------- Section 1: what an ion is (sodium loses one, chlorine gains one) ----------
function ChargeSum({ x, y, p, e, head }: { x: number; y: number; p: number; e: number; head: string }) {
  const q = p - e, colour = q > 0 ? posLine : q < 0 ? negLine : ink
  return <g>
    <rect x={x} y={y} width={170} height={176} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={x + 85} y={y + 26} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{head}</text>
    <circle cx={x + 26} cy={y + 55} r="10" fill={protonFill} stroke={protonLine} strokeWidth="1.5" /><text x={x + 26} y={y + 60} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">+</text>
    <text x={x + 44} y={y + 60} fontSize="14" fill={ink}><tspan fontWeight="700">{p}</tspan> protons</text>
    <circle cx={x + 26} cy={y + 89} r="10" fill={atomPalette.electronFill} stroke={electronLine} strokeWidth="1.5" /><text x={x + 26} y={y + 94} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">{MINUS}</text>
    <text x={x + 44} y={y + 94} fontSize="14" fill={ink}><tspan fontWeight="700">{e}</tspan> electrons</text>
    <path d={`M${x + 14} ${y + 112}H${x + 156}`} stroke={panelLine} strokeWidth="1.5" />
    <text x={x + 85} y={y + 135} textAnchor="middle" fontSize="13" fill={muted}>overall charge</text>
    <text x={x + 85} y={y + 163} textAnchor="middle" fontSize="24" fontWeight="700" fill={colour}>{q === 0 ? 'none (0)' : chargeWords(q)}</text>
  </g>
}
function WhatIs({ focus }: { focus: string }) {
  if (focus === 'ion-what-atom') return <Diagram title="A sodium atom: 11 protons in the nucleus and 11 electrons in shells, 2,8,1. Beside it: 11 positive charges and 11 negative charges cancel out, so the atom has no overall charge.">
    <AtomToIon sym="Na" moved={1} step="atom" atomX={170} />
    <ChangeCaptions sym="Na" moved={1} step="atom" atomX={170} />
    <ChargeSum x={350} y={42} p={11} e={11} head="sodium atom" />
  </Diagram>
  const lose = focus === 'ion-what-lose', sym: Sym = lose ? 'Na' : 'Cl', el = ELEMENTS[sym], moved = lose ? 1 : -1
  return <Diagram title={lose
    ? 'A sodium atom, 2,8,1, loses its one outer electron and becomes a sodium ion, 2,8, drawn in square brackets with a plus sign. The ion still has 11 protons but only 10 electrons, so its overall charge is 1+.'
    : 'A chlorine atom, 2,8,7, gains one electron into its outer shell and becomes a chloride ion, 2,8,8, drawn in square brackets with a minus sign. The ion has 17 protons and 18 electrons, so its overall charge is 1−.'}>
    <AtomToIon sym={sym} moved={moved} />
    <ChangeCaptions sym={sym} moved={moved} />
    <ChargeSum x={420} y={42} p={el.z} e={el.z - moved} head={`${el.ion} ion`} />
  </Diagram>
}
const CARDS: Array<{ sym: string; q: number; name: string; note: string }> = [
  { sym: 'Na', q: 1, name: 'sodium ion', note: 'lost 1 electron' }, { sym: 'Mg', q: 2, name: 'magnesium ion', note: 'lost 2 electrons' },
  { sym: 'Cl', q: -1, name: 'chloride ion', note: 'gained 1 electron' }, { sym: 'O', q: -2, name: 'ion of oxygen', note: 'gained 2 electrons' },
]
function WriteCharges() {
  return <Diagram schematic={false} viewBox="0 0 600 270" title="Four ions written as symbols with the charge at the top right: Na+, a sodium ion, lost 1 electron; Mg2+, a magnesium ion, lost 2 electrons; Cl−, a chloride ion, gained 1 electron; O2−, an ion of oxygen, gained 2 electrons. A plus or minus on its own means a charge of 1.">
    {CARDS.map((c, i) => {
      const x = 12 + i * 147, pos = c.q > 0
      return <g key={c.sym}>
        <rect x={x} y={20} width={135} height={170} rx="12" fill={pos ? posFill : negFill} stroke={pos ? posLine : negLine} strokeWidth="1.8" />
        <Formula x={x + 64} y={92} sym={c.sym} q={c.q} size={38} fill={ink} />
        <text x={x + 67.5} y={128} textAnchor="middle" fontSize="14" fontWeight="700" fill={pos ? posLine : negLine}>charge {chargeWords(c.q)}</text>
        <text x={x + 67.5} y={152} textAnchor="middle" fontSize="13" fill={ink}>{c.name}</text>
        <text x={x + 67.5} y={172} textAnchor="middle" fontSize="12.5" fill={muted}>{c.note}</text>
      </g>
    })}
    <rect x={120} y={210} width={360} height={46} rx="23" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={300} y={230} textAnchor="middle" fontSize="13.5" fill={ink}>electrons lost or gained = size of the charge</text>
    <text x={300} y={248} textAnchor="middle" fontSize="12.5" fill={muted}>+ on its own means 1+ · {MINUS} on its own means 1{MINUS}</text>
  </Diagram>
}

// ---------- Section 2: why (the noble gas structure) ----------
function NobleGoal() {
  const gases: Array<{ sym: Sym; radii: number[] }> = [{ sym: 'Ne', radii: [26, 50] }, { sym: 'Ar', radii: [24, 45, 66] }]
  return <Diagram viewBox="0 0 600 280" title="Two noble gas atoms from Group 0: neon, 2,8, and argon, 2,8,8. Their outer shells are highlighted and full, so they are very stable. Ions end up with the same full outer shell.">
    {gases.map(({ sym, radii }, i) => {
      const cx = 170 + i * 260, el = ELEMENTS[sym]
      return <g key={sym}>
        <Particle cx={cx} cy={112} sym={sym} electrons={el.z} radii={radii} er={6} highlightOuter />
        <text x={cx} y={214} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{el.name} <tspan fill={electronLine}>{written(structure(el.z))}</tspan></text>
      </g>
    })}
    <text x={300} y={30} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>Group 0: the noble gases</text>
    <rect x={150} y={232} width={300} height={34} rx="17" fill={negFill} stroke={electronLine} strokeWidth="1.5" />
    <text x={300} y={254} textAnchor="middle" fontSize="14" fontWeight="700" fill={electronLine}>full outer shell → very stable</text>
  </Diagram>
}
function SameAs({ sym, x = 515, cy = 128 }: { sym: Sym; x?: number; cy?: number }) {
  const el = ELEMENTS[sym]
  return <g>
    <text x={x - 88} y={cy + 9} textAnchor="middle" fontSize="26" fontWeight="700" fill={muted}>=</text>
    <Particle cx={x} cy={cy} sym={sym} electrons={el.z} radii={radiiFor(el.z)} highlightOuter />
    <text x={x} y={226} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{el.name} atom</text>
    <text x={x} y={247} textAnchor="middle" fontSize="16" fontWeight="700" fill={electronLine}>{written(structure(el.z))}</text>
    <text x={x} y={266} textAnchor="middle" fontSize="12.5" fill={muted}>noble gas, Group 0</text>
  </g>
}
function WhyChange({ focus }: { focus: string }) {
  const na = focus === 'ion-why-sodium', sym: Sym = na ? 'Na' : 'Cl'
  return <Diagram title={na
    ? 'A sodium atom, 2,8,1, loses its outer electron and becomes a sodium ion, 2,8, with a 1+ charge. The ion has the same electronic structure as a neon atom, 2,8: a full outer shell.'
    : 'A chlorine atom, 2,8,7, gains one electron and becomes a chloride ion, 2,8,8, with a 1− charge. The ion has the same electronic structure as an argon atom, 2,8,8: a full outer shell.'}>
    <AtomToIon sym={sym} moved={na ? 1 : -1} atomX={80} ionX={278} />
    <ChangeCaptions sym={sym} moved={na ? 1 : -1} atomX={80} ionX={278} />
    <SameAs sym={na ? 'Ne' : 'Ar'} />
  </Diagram>
}
function WhyAll() {
  const sides = [
    { head: 'metal atoms', fill: posFill, line: posLine, lines: ['only a few outer electrons', 'lose them'], result: 'positive ions', ex: [{ sym: 'Na', q: 1 }, { sym: 'Mg', q: 2 }], lose: true },
    { head: 'non-metal atoms', fill: negFill, line: negLine, lines: ['nearly full outer shell', 'gain electrons'], result: 'negative ions', ex: [{ sym: 'Cl', q: -1 }, { sym: 'O', q: -2 }], lose: false },
  ]
  return <Diagram viewBox="0 0 600 290" schematic={false} title="Summary. Metal atoms have only a few outer electrons; they lose them and form positive ions, such as Na+ and Mg2+. Non-metal atoms have nearly full outer shells; they gain electrons and form negative ions, such as Cl− and O2−. Either way, the ion has a full outer shell like a noble gas.">
    {sides.map((s, i) => {
      const x = 14 + i * 294
      return <g key={s.head}>
        <rect x={x} y={14} width={278} height={214} rx="12" fill={s.fill} stroke={s.line} strokeWidth="1.8" />
        <text x={x + 139} y={42} textAnchor="middle" fontSize="16" fontWeight="700" fill={s.line}>{s.head}</text>
        <text x={x + 139} y={68} textAnchor="middle" fontSize="13.5" fill={ink}>{s.lines[0]}</text>
        <g>
          <circle cx={x + 104} cy={100} r={20} fill={space} stroke={spaceLine} strokeWidth="1.5" />
          <circle cx={x + 104} cy={100} r={14} fill="none" stroke={shellLine} strokeWidth="1.8" />
          <circle cx={x + 104} cy={100} r={5} fill={protonFill} stroke={protonLine} strokeWidth="1.2" />
          <text x={x + 104} y={136} textAnchor="middle" fontSize="12" fill={muted}>atom</text>
          <Arrow x1={s.lose ? x + 132 : x + 176} x2={s.lose ? x + 172 : x + 132} y={100} colour={s.line} />
          <Electron x={s.lose ? x + 186 : x + 190} y={100} r={7} sign />
        </g>
        <text x={x + 139} y={160} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{s.lines[1]}</text>
        <text x={x + 139} y={182} textAnchor="middle" fontSize="15" fontWeight="700" fill={s.line}>→ {s.result}</text>
        {s.ex.map((e, j) => <Formula key={e.sym} x={x + 104 + j * 72} y={212} sym={e.sym} q={e.q} size={22} />)}
      </g>
    })}
    <rect x={110} y={240} width={380} height={40} rx="20" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={300} y={265} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>either way: a full outer shell, like a noble gas</text>
  </Diagram>
}

// ---------- Section 3: reading the charge from the group ----------
const COLS = [
  { g: '1', x: 50, outer: 1, q: 1, els: ['Li', 'Na', 'K'] }, { g: '2', x: 108, outer: 2, q: 2, els: ['Be', 'Mg', 'Ca'] },
  { g: '3', x: 246, outer: 3, q: 0, els: ['B', 'Al', 'Ga'] }, { g: '4', x: 304, outer: 4, q: 0, els: ['C', 'Si', 'Ge'] },
  { g: '5', x: 362, outer: 5, q: 0, els: ['N', 'P', 'As'] }, { g: '6', x: 420, outer: 6, q: -2, els: ['O', 'S', 'Se'] },
  { g: '7', x: 478, outer: 7, q: -1, els: ['F', 'Cl', 'Br'] }, { g: '0', x: 536, outer: 8, q: 0, els: ['Ne', 'Ar', 'Kr'] },
]
const TW = 52, TH = 44, ROW_Y = [66, 116, 166]
function GroupTable({ charges }: { charges: boolean }) {
  return <Diagram viewBox="0 0 600 300" schematic={false} title={charges
    ? 'Part of the periodic table, rows 2 to 4. Under each group is the charge on its ions: Group 1 forms 1+ ions, Group 2 forms 2+ ions, Group 6 forms 2− ions and Group 7 forms 1− ions. Groups 1 and 2 lose electrons; Groups 6 and 7 gain them.'
    : 'Part of the periodic table, rows 2 to 4, with the group number above each column and the number of outer electrons below: Group 1 has 1, Group 2 has 2, up to Group 7 with 7, and Group 0 with 8. Groups 1 and 2 are tinted coral and Groups 6 and 7 blue.'}>
    <g>
      {charges && <g>
        <text x={105} y={20} textAnchor="middle" fontSize="13" fontWeight="700" fill={posLine}>lose electrons</text>
        <text x={475} y={20} textAnchor="middle" fontSize="13" fontWeight="700" fill={negLine}>gain electrons</text>
      </g>}
      <text x={42} y={50} fontSize="12" fill={muted} textAnchor="end">Group</text>
      {COLS.map(c => {
        const pos = c.q > 0, neg = c.q < 0, fill = pos ? posFill : neg ? negFill : panelFill, line = pos ? posLine : neg ? negLine : panelLine
        return <g key={c.g}>
          <text x={c.x + TW / 2} y={50} textAnchor="middle" fontSize="15" fontWeight="700" fill={pos ? posLine : neg ? negLine : ink}>{c.g}</text>
          {c.els.map((s, r) => <g key={s}>
            <rect x={c.x} y={ROW_Y[r]} width={TW} height={TH} rx="7" fill={fill} stroke={line} strokeWidth="1.6" />
            <text x={c.x + TW / 2} y={ROW_Y[r] + 29} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}>{s}</text>
          </g>)}
          {!charges && <text x={c.x + TW / 2} y={254} textAnchor="middle" fontSize="18" fontWeight="700" fill={pos ? posLine : neg ? negLine : ink}>{c.outer}</text>}
          {charges && c.q !== 0 && <g>
            <rect x={c.x + 1} y={232} width={TW - 2} height={34} rx="17" fill={fill} stroke={line} strokeWidth="1.8" />
            <text x={c.x + TW / 2} y={255} textAnchor="middle" fontSize="18" fontWeight="700" fill={line}>{chargeWords(c.q)}</text>
          </g>}
        </g>
      })}
      <rect x={166} y={ROW_Y[2]} width={70} height={TH} rx="7" fill="white" stroke={muted} strokeWidth="1.4" strokeDasharray="5 4" />
      <text x={201} y={ROW_Y[2] + 19} textAnchor="middle" fontSize="12" fill={muted}>transition</text>
      <text x={201} y={ROW_Y[2] + 34} textAnchor="middle" fontSize="12" fill={muted}>metals</text>
      <path d={`M40 222H592`} stroke={panelLine} strokeWidth="1.5" />
      <text x={319} y={288} textAnchor="middle" fontSize="13" fill={muted}>{charges ? 'charge on the ion' : 'outer electrons (Group 0: a full outer shell)'}</text>
    </g>
  </Diagram>
}
function GroupPanel({ x, y, lines }: { x: number; y: number; lines: Array<{ t: ReactNode; bold?: boolean; colour?: string }> }) {
  return <g>
    <rect x={x} y={y} width={176} height={lines.length * 24 + 22} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {lines.map((l, i) => <text key={i} x={x + 88} y={y + 30 + i * 24} textAnchor="middle" fontSize={l.bold ? 15 : 13.5} fontWeight={l.bold ? 700 : 400} fill={l.colour ?? ink}>{l.t}</text>)}
  </g>
}
function GroupChange({ focus }: { focus: string }) {
  const metal = focus === 'ion-group-metals'
  const sym: Sym = metal ? 'Mg' : 'O', moved = metal ? 2 : -2, colour = metal ? posLine : negLine
  const lines = metal
    ? [{ t: 'Group 2', bold: true, colour }, { t: '2 outer electrons' }, { t: 'lose 2 → 2+', bold: true, colour }, { t: '' }, { t: 'Group 1', bold: true, colour }, { t: 'lose 1 → 1+' }]
    : [{ t: 'Group 6', bold: true, colour }, { t: '6 outer electrons' }, { t: 'gain 2 → 2−', bold: true, colour }, { t: '' }, { t: 'Group 7', bold: true, colour }, { t: 'gain 1 → 1−' }]
  return <Diagram title={metal
    ? 'A magnesium atom from Group 2, 2,8,2, loses its 2 outer electrons and becomes a magnesium ion, Mg2+, 2,8. It has 12 protons and 10 electrons. Group 2 atoms lose 2 electrons to form 2+ ions; Group 1 atoms lose 1 to form 1+ ions.'
    : 'An oxygen atom from Group 6, 2,6, gains 2 electrons and becomes an oxide ion, O2−, 2,8. It has 8 protons and 10 electrons. Group 6 atoms gain 2 electrons to form 2− ions; Group 7 atoms gain 1 to form 1− ions.'}>
    <AtomToIon sym={sym} moved={moved} />
    <ChangeCaptions sym={sym} moved={moved} />
    <GroupPanel x={414} y={60} lines={lines.map(l => ({ ...l, t: l.t || ' ' }))} />
  </Diagram>
}

// ---------- On your own: a sulfur atom and the ion it forms; four particles in a table ----------
function IonQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram title={assessment
    ? 'Particle 1 is an atom with three electron shells. An arrow leads to particle 2, the ion it forms, drawn in square brackets with its charge hidden.'
    : 'A sulfur atom, 2,8,6, gains 2 electrons and becomes a sulfide ion, 2,8,8, with a 2− charge. It has 16 protons and 18 electrons.'}>
    <AtomToIon sym="S" moved={-2} assessment={assessment} atomX={130} ionX={400} cy={140} />
    <Pointer n={1} x={36} y={40} to={onCircle(130, 140, 68, -135)} />
    <Pointer n={2} x={520} y={40} to={[r1(400 + 76), r1(140 - 50)]} />
    {assessment
      ? <g><text x={130} y={244} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>atom</text><text x={400} y={244} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>ion</text>
        <text x={265} y={276} textAnchor="middle" fontSize="12.5" fill={muted}>the nucleus is the same in both</text></g>
      : <ChangeCaptions sym="S" moved={-2} atomX={130} ionX={400} y={236} />}
  </Diagram>
}
const DATA = [{ id: 'A', p: 12, e: 10 }, { id: 'B', p: 9, e: 10 }, { id: 'C', p: 18, e: 18 }, { id: 'D', p: 19, e: 18 }]
function IonData({ assessment }: { assessment: boolean }) {
  const cols = assessment ? [150, 300, 450] : [90, 225, 360, 495]
  const heads = ['particle', 'protons', 'electrons', 'overall charge']
  return <Diagram viewBox="0 0 600 250" schematic={false} title={assessment
    ? 'A table of four particles. A: 12 protons, 10 electrons. B: 9 protons, 10 electrons. C: 18 protons, 18 electrons. D: 19 protons, 18 electrons.'
    : 'A table of four particles with their overall charges. A: 12 protons, 10 electrons, 2+. B: 9 protons, 10 electrons, 1−, the only negative ion. C: 18 protons, 18 electrons, no charge, an atom. D: 19 protons, 18 electrons, 1+.'}>
    <rect x={30} y={16} width={540} height={220} rx="12" fill="white" stroke={panelLine} strokeWidth="1.5" />
    <rect x={30} y={16} width={540} height={44} rx="12" fill={panelFill} />
    <path d="M30 60H570" stroke={panelLine} strokeWidth="1.5" />
    {cols.map((x, i) => <text key={i} x={x} y={44} textAnchor="middle" fontSize="14" fontWeight="700" fill={i === 1 ? protonLine : i === 2 ? electronLine : ink}>{heads[i]}</text>)}
    {DATA.map((d, r) => {
      const y = 94 + r * 40, q = d.p - d.e
      return <g key={d.id}>
        {r > 0 && <path d={`M46 ${y - 24}H554`} stroke={panelLine} strokeWidth="1" />}
        <text x={cols[0]} y={y} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{d.id}</text>
        <text x={cols[1]} y={y} textAnchor="middle" fontSize="16" fill={ink}>{d.p}</text>
        <text x={cols[2]} y={y} textAnchor="middle" fontSize="16" fill={ink}>{d.e}</text>
        {!assessment && <text x={cols[3]} y={y} textAnchor="middle" fontSize="16" fontWeight="700" fill={q > 0 ? posLine : q < 0 ? negLine : muted}>{q === 0 ? 'none' : chargeWords(q)}</text>}
      </g>
    })}
  </Diagram>
}

export function IonVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('ion-what-')) return focus === 'ion-what-write' ? <WriteCharges /> : <WhatIs focus={focus} />
  if (focus === 'ion-why-goal') return <NobleGoal />
  if (focus === 'ion-why-sodium' || focus === 'ion-why-chlorine') return <WhyChange focus={focus} />
  if (focus === 'ion-why-all') return <WhyAll />
  if (focus === 'ion-group-table') return <GroupTable charges={false} />
  if (focus === 'ion-group-all') return <GroupTable charges />
  if (focus === 'ion-group-metals' || focus === 'ion-group-nonmetals') return <GroupChange focus={focus} />
  if (focus === 'ion-question') return <IonQuestion assessment={assessment} />
  if (focus === 'ion-data') return <IonData assessment={assessment} />
  return <WhatIs focus="ion-what-lose" />
}

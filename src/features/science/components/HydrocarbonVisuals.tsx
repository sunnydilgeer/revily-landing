import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 37: Hydrocarbons and alkanes. Original, code-native schematics; not to scale.
 * Focus ids start with 'hydro-'.
 *
 * Displayed formulae follow the covalent-bonding lesson: bold ink letters joined by straight lines, one line per single
 * covalent bond. Ball-and-stick models use the Chemistry element colours (C dark grey, H white, O soft coral).
 * Course colour code: oxygen = coral, carbon dioxide = purple, water = blue, energy = warm yellow.
 * Every molecule drawn is real: each C has four bonds, each H one, each O two.
 */
const { ink, muted, panelFill, panelLine, protonLine, glow } = atomPalette
const coral = protonLine, green = '#4f9a74', greenFill = '#e3f2e8'
const purple = '#7d5aa6', purpleFill = '#ece3f6', blue = '#246aa3', blueFill = '#dcecf8'
const amber = '#c98a1c', amberFill = '#fdf0cf', flameFill = '#f5b04c'
const r1 = (n: number) => Math.round(n * 10) / 10

type El = 'H' | 'C' | 'O'
const EL: Record<El, { fill: string; line: string; text: string }> = {
  H: { fill: '#ffffff', line: '#8d9ba6', text: '#375a73' },
  C: { fill: '#5f6b75', line: '#3c464e', text: '#ffffff' },
  O: { fill: '#f2a39b', line: '#c0625a', text: '#6e2621' },
}

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function T({ x, y, children, size = 14, colour = ink, bold = false, anchor = 'middle', italic = false }: { x: number; y: number; children: ReactNode; size?: number; colour?: string; bold?: boolean; anchor?: 'start' | 'middle' | 'end'; italic?: boolean }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 500} fill={colour} fontStyle={italic ? 'italic' : undefined}>{children}</text>
}
/** A formula with real subscripts. Digits after a letter drop low; `_{...}` marks any other subscript: "C_{n}H_{2n+2}". */
function F({ f, size = 18, colour = ink }: { f: string; size?: number; colour?: string }) {
  const parts = f.split(/(_\{[^}]*\}|(?<=[A-Za-z)])\d+)/).filter(Boolean)
  const sub = Math.max(12, Math.round(size * .68)), drop = r1(size * .3)
  const out: ReactNode[] = []
  let low = false
  parts.forEach((p, i) => {
    const isSub = p.startsWith('_{') || /^\d+$/.test(p), t = p.startsWith('_{') ? p.slice(2, -1) : p
    if (isSub) { out.push(<tspan key={i} dy={low ? 0 : drop} fontSize={sub}>{t}</tspan>); low = true }
    else { out.push(<tspan key={i} dy={low ? -drop : 0}>{t}</tspan>); low = false }
  })
  if (low) out.push(<tspan key="end" dy={-drop}>{'​'}</tspan>)
  return <tspan fill={colour} fontSize={size} fontWeight={700}>{out}</tspan>
}
function Arrow({ x1, y1, x2, y2, colour = ink, width = 2.5 }: { x1: number; y1: number; x2: number; y2: number; colour?: string; width?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1), head = 8 + width * 1.5
  const pts = [[x2, y2], [x2 - head * Math.cos(a - .45), y2 - head * Math.sin(a - .45)], [x2 - head * Math.cos(a + .45), y2 - head * Math.sin(a + .45)]]
  return <g fill={colour} stroke={colour} strokeWidth={width}><line x1={x1} y1={y1} x2={r1(x2 - head * .7 * Math.cos(a))} y2={r1(y2 - head * .7 * Math.sin(a))} /><polygon strokeWidth="1" points={pts.map(p => p.map(r1).join(',')).join(' ')} /></g>
}
function Tick({ x, y, r = 13 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill={greenFill} stroke={green} strokeWidth="2" /><path d={`M${x - r * .45} ${y}L${x - r * .1} ${y + r * .38}L${x + r * .48} ${y - r * .36}`} fill="none" stroke={green} strokeWidth="2.6" /></g>
}
function CrossMark({ x, y, r = 13 }: { x: number; y: number; r?: number }) {
  const s = r * .38
  return <g><circle cx={x} cy={y} r={r} fill={glow} stroke={coral} strokeWidth="2" /><path d={`M${x - s} ${y - s}L${x + s} ${y + s}M${x + s} ${y - s}L${x - s} ${y + s}`} stroke={coral} strokeWidth="2.6" /></g>
}
function Panel({ x, y, w, h, fill = panelFill, line = panelLine }: { x: number; y: number; w: number; h: number; fill?: string; line?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx="16" fill={fill} stroke={line} strokeWidth="1.5" />
}

// ---------- Displayed formulae (letters and lines) ----------
type At = { el: El; x: number; y: number }
type Mol = { atoms: At[]; bonds: Array<[number, number]> }
/** A straight-chain alkane with n carbons centred on (cx, y): H above and below each C, one H at each end. */
function alkane(n: number, cx: number, y: number, g: number, v = g): Mol {
  const x0 = cx - (n - 1) * g / 2, atoms: At[] = [], bonds: Array<[number, number]> = []
  for (let i = 0; i < n; i++) atoms.push({ el: 'C', x: r1(x0 + i * g), y })
  for (let i = 1; i < n; i++) bonds.push([i - 1, i])
  const addH = (x: number, hy: number, c: number) => { atoms.push({ el: 'H', x: r1(x), y: r1(hy) }); bonds.push([c, atoms.length - 1]) }
  addH(x0 - g, y, 0)
  for (let i = 0; i < n; i++) { addH(x0 + i * g, y - v, i); addH(x0 + i * g, y + v, i) }
  addH(x0 + n * g, y, n - 1)
  return { atoms, bonds }
}
/** H–C–C–O–H: two carbons with all their hydrogens, then an O–H group. Centred on cx. */
function ethanolLike(cx: number, y: number, g: number, v = g): Mol {
  const x0 = cx - g
  const atoms: At[] = [{ el: 'C', x: x0, y }, { el: 'C', x: x0 + g, y }, { el: 'O', x: x0 + 2 * g, y }, { el: 'H', x: x0 + 3 * g, y }, { el: 'H', x: x0 - g, y }]
  const bonds: Array<[number, number]> = [[0, 1], [1, 2], [2, 3], [4, 0]]
  for (const c of [0, 1]) { atoms.push({ el: 'H', x: atoms[c].x, y: y - v }); bonds.push([c, atoms.length - 1]); atoms.push({ el: 'H', x: atoms[c].x, y: y + v }); bonds.push([c, atoms.length - 1]) }
  return { atoms, bonds }
}
function Displayed({ mol, size = 22, hiAtoms = [], hiEl, hiBonds = [], opacity = 1, bondNumbers = false }: { mol: Mol; size?: number; hiAtoms?: number[]; hiEl?: El; hiBonds?: number[]; opacity?: number; bondNumbers?: boolean }) {
  const gap = size * .55
  const lit = (i: number) => hiAtoms.includes(i) || (hiEl !== undefined && mol.atoms[i].el === hiEl)
  return <g>
    <g opacity={opacity}>
      {mol.atoms.map((a, i) => lit(i) && <circle key={`g${i}`} cx={a.x} cy={a.y} r={r1(size * .72)} fill={glow} stroke={coral} strokeWidth="1.8" />)}
      {mol.bonds.map(([p, q], i) => {
        const A = mol.atoms[p], B = mol.atoms[q], d = Math.hypot(B.x - A.x, B.y - A.y), ux = (B.x - A.x) / d, uy = (B.y - A.y) / d
        const on = hiBonds.includes(i)
        return <path key={`b${i}`} d={`M${r1(A.x + ux * gap)} ${r1(A.y + uy * gap)}L${r1(B.x - ux * gap)} ${r1(B.y - uy * gap)}`} stroke={on ? coral : ink} strokeWidth={on ? 4.5 : r1(Math.max(2, size * .11))} />
      })}
      {mol.atoms.map((a, i) => <text key={`t${i}`} x={a.x} y={r1(a.y + size * .36)} textAnchor="middle" fontSize={size} fontWeight="700" fill={a.el === 'O' ? '#a8473f' : ink}>{a.el}</text>)}
    </g>
    {bondNumbers && mol.bonds.map(([p, q], i) => {
      const A = mol.atoms[p], B = mol.atoms[q], d = Math.hypot(B.x - A.x, B.y - A.y), mx = (A.x + B.x) / 2 + (B.y - A.y) / d * 18, my = (A.y + B.y) / 2 - (B.x - A.x) / d * 18
      return <g key={`n${i}`}><circle cx={r1(mx)} cy={r1(my)} r="11" fill={coral} stroke="white" strokeWidth="2" /><text x={r1(mx)} y={r1(my + 4.5)} textAnchor="middle" fontSize="13" fontWeight="700" fill="white">{i + 1}</text></g>
    })}
  </g>
}

// ---------- Ball-and-stick models ----------
function Ball({ el, x, y, r, ring = false }: { el: El; x: number; y: number; r: number; ring?: boolean }) {
  const e = EL[el]
  return <g>
    {ring && <circle cx={r1(x)} cy={r1(y)} r={r + 6} fill="none" stroke={coral} strokeWidth="2.2" strokeDasharray="4 4" />}
    <circle cx={r1(x)} cy={r1(y)} r={r} fill={e.fill} stroke={e.line} strokeWidth="1.8" />
    <ellipse cx={r1(x - r * .32)} cy={r1(y - r * .38)} rx={r1(r * .32)} ry={r1(r * .2)} fill="white" opacity={el === 'H' ? .0 : .28} />
    {r >= 11 && <text x={r1(x)} y={r1(y + (r >= 16 ? 5 : 4.5))} textAnchor="middle" fontSize={r >= 16 ? 15 : 13} fontWeight="700" fill={e.text}>{el}</text>}
  </g>
}
function Stick({ x1, y1, x2, y2, double = false }: { x1: number; y1: number; x2: number; y2: number; double?: boolean }) {
  if (!double) return <path d={`M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`} stroke="#9aa6b0" strokeWidth="5" />
  const d = Math.hypot(x2 - x1, y2 - y1), px = -(y2 - y1) / d * 4, py = (x2 - x1) / d * 4
  return <g stroke="#9aa6b0" strokeWidth="3.5"><path d={`M${r1(x1 + px)} ${r1(y1 + py)}L${r1(x2 + px)} ${r1(y2 + py)}`} /><path d={`M${r1(x1 - px)} ${r1(y1 - py)}L${r1(x2 - px)} ${r1(y2 - py)}`} /></g>
}
const polar = (x: number, y: number, d: number, deg: number) => [x + Math.cos(deg * Math.PI / 180) * d, y + Math.sin(deg * Math.PI / 180) * d] as const
/** Methane as a slightly tilted ball-and-stick model: one carbon, four hydrogens. */
function MethaneBalls({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const hs = [-95, 12, 168, 78].map(deg => polar(x, y, 50 * s, deg))
  return <g>{hs.map(([hx, hy], i) => <Stick key={i} x1={x} y1={y} x2={hx} y2={hy} />)}<Ball el="C" x={x} y={y} r={r1(19 * s)} />{hs.map(([hx, hy], i) => <Ball key={i} el="H" x={hx} y={hy} r={r1(13 * s)} />)}</g>
}
/** Methanol (CH₃OH) as ball-and-stick: carbon with three hydrogens and an O–H group. */
function MethanolBalls({ x, y }: { x: number; y: number }) {
  const hs = [-100, 180, 100].map(deg => polar(x, y, 42, deg)), ox = x + 50, oy = y, hx = ox + 30, hy = oy + 24
  return <g>{hs.map(([a, b], i) => <Stick key={i} x1={x} y1={y} x2={a} y2={b} />)}<Stick x1={x} y1={y} x2={ox} y2={oy} /><Stick x1={ox} y1={oy} x2={hx} y2={hy} />
    <Ball el="C" x={x} y={y} r={17} />{hs.map(([a, b], i) => <Ball key={i} el="H" x={a} y={b} r={12} />)}<Ball el="O" x={ox} y={oy} r={16} /><Ball el="H" x={hx} y={hy} r={12} /></g>
}
function CO2Balls({ x, y, ring = false }: { x: number; y: number; ring?: boolean }) {
  return <g><Stick x1={x - 36} y1={y} x2={x} y2={y} double /><Stick x1={x} y1={y} x2={x + 36} y2={y} double /><Ball el="O" x={x - 36} y={y} r={15} ring={ring} /><Ball el="O" x={x + 36} y={y} r={15} ring={ring} /><Ball el="C" x={x} y={y} r={17} /></g>
}
function WaterBalls({ x, y, ring = false }: { x: number; y: number; ring?: boolean }) {
  return <g><Stick x1={x} y1={y} x2={x - 24} y2={y + 20} /><Stick x1={x} y1={y} x2={x + 24} y2={y + 20} /><Ball el="O" x={x} y={y} r={15} ring={ring} /><Ball el="H" x={x - 24} y={y + 20} r={11} /><Ball el="H" x={x + 24} y={y + 20} r={11} /></g>
}
function O2Balls({ x, y }: { x: number; y: number }) {
  return <g><Stick x1={x - 12} y1={y} x2={x + 12} y2={y} double /><Ball el="O" x={x - 14} y={y} r={14} /><Ball el="O" x={x + 14} y={y} r={14} /></g>
}
function Flame({ x, y, s = 1, fill = flameFill, line = '#d9822b', inner = '#fbe0a0' }: { x: number; y: number; s?: number; fill?: string; line?: string; inner?: string }) {
  return <g><path d={`M${x} ${y}C${x - 24 * s} ${y - 20 * s} ${x - 8 * s} ${y - 44 * s} ${x - 3 * s} ${y - 64 * s}C${x + 14 * s} ${y - 46 * s} ${x + 26 * s} ${y - 26 * s} ${x} ${y}Z`} fill={fill} stroke={line} strokeWidth="2.2" />
    <path d={`M${x} ${y}C${x - 10 * s} ${y - 10 * s} ${x - 3 * s} ${y - 22 * s} ${x} ${y - 32 * s}C${x + 7 * s} ${y - 22 * s} ${x + 11 * s} ${y - 10 * s} ${x} ${y}Z`} fill={inner} /></g>
}

// ---------- Section 1: what a hydrocarbon is ----------
function WhatIsHC() {
  return <Diagram title="Left: a carbon atom plus a hydrogen atom, labelled 'hydrocarbon: carbon and hydrogen only'. Middle: a methane molecule, one carbon and four hydrogens, with a tick: a hydrocarbon. Right: a molecule with carbon, hydrogen and one oxygen atom, with a cross: not a hydrocarbon.">
    <Panel x={14} y={28} w={168} h={244} />
    <Ball el="C" x={62} y={96} r={20} /><T x={62} y={136} size={13} colour={muted}>carbon</T>
    <T x={100} y={103} size={22} bold>+</T>
    <Ball el="H" x={138} y={96} r={15} /><T x={138} y={136} size={13} colour={muted}>hydrogen</T>
    <T x={98} y={188} size={15} bold>hydrocarbon:</T>
    <T x={98} y={210} size={14}>carbon and</T>
    <T x={98} y={228} size={14}>hydrogen only</T>
    <Panel x={196} y={28} w={160} h={244} fill={greenFill} line="#b9dcc6" />
    <MethaneBalls x={274} y={134} s={.95} />
    <Tick x={334} y={52} />
    <T x={276} y={222} size={14} bold colour={green}>hydrocarbon</T>
    <T x={276} y={242} size={13} colour={muted}>C and H only</T>
    <Panel x={370} y={28} w={156} h={244} fill="#fdf1ee" line="#f0c9c2" />
    <MethanolBalls x={428} y={130} />
    <CrossMark x={504} y={52} />
    <T x={448} y={222} size={14} bold colour={coral}>not a hydrocarbon</T>
    <T x={448} y={242} size={13} colour={muted}>it contains O</T>
  </Diagram>
}
function MethaneDisplayed() {
  const m = alkane(1, 330, 140, 58)
  return <Diagram title="Methane, CH₄. Left: a ball-and-stick model, one carbon ball joined to four hydrogen balls. Right: its displayed formula, the letter C with an H above, below, left and right, each joined by a single line. Each line is one single covalent bond.">
    <T x={270} y={30} size={17} bold>methane, <F f="CH4" size={17} /></T>
    <MethaneBalls x={120} y={142} s={1.15} />
    <Arrow x1={196} y1={142} x2={248} y2={142} colour={muted} />
    <Displayed mol={m} size={24} />
    <T x={120} y={240} size={13} colour={muted}>ball-and-stick model</T>
    <T x={330} y={240} size={13} colour={muted}>displayed formula</T>
    <path d="M406 106L338 112" stroke={blue} strokeWidth="1.6" /><circle cx={338} cy={112} r="2.8" fill={blue} />
    <T x={412} y={96} size={13} bold colour={blue} anchor="start">each line =</T>
    <T x={412} y={112} size={13} bold colour={blue} anchor="start">one single</T>
    <T x={412} y={128} size={13} bold colour={blue} anchor="start">covalent bond</T>
    <T x={270} y={278} size={13} colour={muted}>C = carbon atom · H = hydrogen atom</T>
  </Diagram>
}
function FourBonds() {
  const m = alkane(1, 140, 150, 72), e = alkane(2, 392, 150, 60)
  return <Diagram title="Left: the displayed formula of methane with its four bonds numbered 1 to 4: four single bonds from the carbon atom. Right: ethane, with the bond joining its two carbon atoms highlighted: the C–C bond is a single bond too.">
    <T x={140} y={44} size={15} bold>methane</T>
    <Displayed mol={m} size={24} bondNumbers />
    <T x={140} y={252} size={14} bold colour={coral}>4 single bonds</T>
    <T x={140} y={270} size={14} bold colour={coral}>from each C</T>
    <path d="M268 40V270" stroke={panelLine} strokeWidth="2" strokeDasharray="6 6" />
    <T x={392} y={44} size={15} bold colour={muted}>ethane</T>
    <Displayed mol={e} size={24} opacity={.45} />
    <Displayed mol={{ atoms: e.atoms.slice(0, 2), bonds: [[0, 1]] }} size={24} hiBonds={[0]} />
    <T x={392} y={252} size={14} bold colour={coral}>C–C is single too</T>
    <T x={392} y={270} size={13} colour={muted}>still 4 bonds on each C</T>
  </Diagram>
}
const ALKANES: Array<{ name: string; f: string; n: number; h: number }> = [
  { name: 'methane', f: 'CH4', n: 1, h: 4 }, { name: 'ethane', f: 'C2H6', n: 2, h: 6 }, { name: 'propane', f: 'C3H8', n: 3, h: 8 }, { name: 'butane', f: 'C4H10', n: 4, h: 10 },
]
function FirstFour() {
  const cells = [[14, 14], [276, 14], [14, 178], [276, 178]]
  return <Diagram viewBox="0 0 540 360" title="The first four alkanes as displayed formulae: methane CH₄ with 1 carbon atom, ethane C₂H₆ with 2, propane C₃H₈ with 3 and butane C₄H₁₀ with 4. Each carbon has one H above and one below, with one extra H at each end of the chain.">
    {ALKANES.map((a, i) => { const [x, y] = cells[i], cx = x + 125
      return <g key={a.name}>
        <Panel x={x} y={y} w={250} h={152} />
        <circle cx={x + 24} cy={y + 24} r="13" fill={coral} /><T x={x + 24} y={y + 29} size={14} bold colour="white">{a.n}</T>
        <T x={x + 46} y={y + 30} size={16} bold anchor="start">{a.name}  <F f={a.f} size={16} colour={coral} /></T>
        <Displayed mol={alkane(a.n, cx, y + 96, 38, 34)} size={19} />
      </g> })}
    <circle cx={150} cy={345} r="9" fill={coral} /><T x={164} y={350} size={13} colour={muted} anchor="start">number = carbon atoms in the chain</T>
  </Diagram>
}

// ---------- Section 2: the general formula ----------
function AlkaneTable({ withFormula }: { withFormula: boolean }) {
  const rowH = 62, top = 64, cols = { draw: 120, name: 252, c: 380, h: 470 }
  const rows = ALKANES.length + (withFormula ? 1 : 0)
  const title = withFormula
    ? 'A table of the first four alkanes: methane 1 carbon, 4 hydrogen; ethane 2 and 6; propane 3 and 8; butane 4 and 10. Each hydrogen count is 2 times the carbons plus 2. The last row says any alkane with n carbon atoms has 2n + 2 hydrogen atoms, so the general formula is CₙH₂ₙ₊₂, where n is the number of carbon atoms.'
    : 'A table of the first four alkanes, each with its displayed formula: methane has 1 carbon and 4 hydrogen atoms, ethane 2 and 6, propane 3 and 8, butane 4 and 10.'
  return <Diagram viewBox={`0 0 540 ${withFormula ? 470 : 326}`} title={title}>
    <rect x={14} y={14} width={512} height={top - 14 + rows * rowH} rx="16" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <T x={cols.draw} y={44} size={13} bold colour={muted}>molecule</T>
    <T x={cols.name} y={44} size={13} bold colour={muted} anchor="start">name</T>
    <T x={cols.c} y={36} size={13} bold colour={muted}>carbon</T><T x={cols.c} y={52} size={13} bold colour={muted}>atoms</T>
    <T x={cols.h} y={36} size={13} bold colour={muted}>hydrogen</T><T x={cols.h} y={52} size={13} bold colour={muted}>atoms</T>
    {ALKANES.map((a, i) => { const cy = top + i * rowH + rowH / 2
      return <g key={a.name}>
        <path d={`M24 ${top + i * rowH}H516`} stroke={panelLine} strokeWidth="1.5" />
        <Displayed mol={alkane(a.n, cols.draw, cy, 28, 20)} size={14} opacity={withFormula ? .35 : 1} />
        <T x={cols.name} y={cy + 6} size={16} bold anchor="start">{a.name}</T>
        <T x={cols.c} y={cy + (withFormula ? 2 : 7)} size={20} bold colour={ink}>{a.n}</T>
        <T x={cols.h} y={cy + (withFormula ? 2 : 7)} size={20} bold colour={blue}>{a.h}</T>
        {withFormula && <T x={cols.h} y={cy + 20} size={12} colour={muted}>{`2 × ${a.n} + 2`}</T>}
      </g> })}
    {withFormula && <g>
      <rect x={20} y={top + 4 * rowH + 4} width={500} height={rowH - 10} rx="12" fill={glow} stroke={coral} strokeWidth="1.8" />
      <T x={cols.draw} y={top + 4.5 * rowH + 5} size={14} colour={muted}>any size</T>
      <T x={cols.name} y={top + 4.5 * rowH + 6} size={16} bold anchor="start">any alkane</T>
      <T x={cols.c} y={top + 4.5 * rowH + 7} size={20} bold colour={coral} italic>n</T>
      <Arrow x1={cols.c + 16} y1={top + 4.5 * rowH} x2={cols.h - 50} y2={top + 4.5 * rowH} colour={coral} width={2.2} />
      <T x={cols.h} y={top + 4.5 * rowH + 7} size={19} bold colour={coral}>2<tspan fontStyle="italic">n</tspan> + 2</T>
      <text x={270} y={424} textAnchor="middle"><F f="C_{n}H_{2n+2}" size={36} colour={coral} /></text>
      <T x={270} y={456} size={14} colour={muted}><tspan fontStyle="italic">n</tspan> = number of carbon atoms</T>
    </g>}
  </Diagram>
}
function UseFormula() {
  const m = alkane(3, 146, 150, 44, 44)
  return <Diagram title="Using the general formula for an alkane with 3 carbon atoms. Left: propane's displayed formula with its three carbon atoms highlighted, so n = 3. Right: the working: H = 2 × 3 + 2 = 8, so the formula is C₃H₈.">
    <T x={146} y={48} size={15} bold>an alkane with 3 carbon atoms</T>
    <Displayed mol={m} size={20} hiEl="C" />
    <T x={146} y={240} size={14} bold colour={coral}>3 carbon atoms, so <tspan fontStyle="italic">n</tspan> = 3</T>
    <Panel x={300} y={66} w={224} h={186} />
    <T x={320} y={104} size={18} bold anchor="start"><tspan fontStyle="italic">n</tspan> = 3</T>
    <T x={320} y={142} size={18} bold anchor="start" colour={blue}>H = 2 × 3 + 2 = 8</T>
    <T x={320} y={180} size={14} anchor="start" colour={muted}>so the formula is</T>
    <text x={320} y={220} textAnchor="start"><F f="C3H8" size={28} colour={coral} /></text>
    <T x={410} y={220} size={15} anchor="start" colour={muted}>propane</T>
  </Diagram>
}

// ---------- Section 3: complete combustion ----------
function Chip({ x, y, w, text, fill, line }: { x: number; y: number; w: number; text: string; fill: string; line: string }) {
  return <g><rect x={x} y={y - 18} width={w} height={36} rx="18" fill={fill} stroke={line} strokeWidth="2" /><T x={x + w / 2} y={y + 5} size={14} bold colour={line}>{text}</T></g>
}
function CombustionWord() {
  const y = 130
  return <Diagram viewBox="0 0 540 250" title="The word equation for complete combustion on a soft banner: hydrocarbon + oxygen → carbon dioxide + water, plus energy, with a small flame above the arrow and a tag saying plenty of oxygen.">
    <T x={270} y={30} size={16} bold>complete combustion</T>
    <rect x={14} y={y - 34} width={512} height={68} rx="30" fill="#fbf6ea" stroke="#eadcb8" strokeWidth="1.5" />
    <Flame x={258} y={y - 36} s={.6} />
    <Chip x={22} y={y} w={116} text="hydrocarbon" fill="#e7eaed" line="#4b5660" />
    <T x={151} y={y + 7} size={22} bold>+</T>
    <Chip x={164} y={y} w={74} text="oxygen" fill={glow} line={coral} />
    <Arrow x1={244} y1={y} x2={273} y2={y} width={2.6} />
    <Chip x={280} y={y} w={142} text="carbon dioxide" fill={purpleFill} line={purple} />
    <T x={435} y={y + 7} size={22} bold>+</T>
    <Chip x={448} y={y} w={70} text="water" fill={blueFill} line={blue} />
    <rect x={30} y={188} width={206} height={34} rx="17" fill="white" stroke={coral} strokeWidth="2" strokeDasharray="5 4" />
    <O2Balls x={62} y={205} /><T x={94} y={210} size={14} bold colour={coral} anchor="start">plenty of oxygen</T>
    <path d="M362 214q8 -8 0 -16t0 -16M378 214q8 -8 0 -16t0 -16" fill="none" stroke={amber} strokeWidth="2.4" />
    <T x={394} y={210} size={15} bold colour={amber} anchor="start">(+ energy)</T>
  </Diagram>
}
function Oxidation() {
  return <Diagram title="Methane and two oxygen molecules react. The carbon atom ends up joined to oxygen in carbon dioxide, and the hydrogen atoms end up joined to oxygen in two water molecules. The oxygen atoms picked up are circled in coral: gaining oxygen means being oxidised.">
    <MethaneBalls x={82} y={148} s={.9} />
    <T x={82} y={228} size={15} bold><F f="CH4" size={15} /></T>
    <T x={160} y={156} size={22} bold>+</T>
    <O2Balls x={206} y={118} /><O2Balls x={206} y={182} />
    <T x={206} y={228} size={15} bold colour={coral}>2<F f="O2" size={15} colour={coral} /></T>
    <Arrow x1={246} y1={150} x2={296} y2={150} />
    <CO2Balls x={394} y={82} ring />
    <T x={394} y={126} size={15} bold colour={purple}><F f="CO2" size={15} colour={purple} /></T>
    <T x={470} y={78} size={13} colour={muted} anchor="start">carbon</T><T x={470} y={94} size={13} colour={muted} anchor="start">+ oxygen</T>
    <WaterBalls x={352} y={180} ring /><WaterBalls x={448} y={180} ring />
    <T x={400} y={236} size={15} bold colour={blue}>2<F f="H2O" size={15} colour={blue} /></T>
    <T x={400} y={254} size={13} colour={muted}>hydrogen + oxygen</T>
    <T x={270} y={288} size={15} bold colour={coral}>gains oxygen = oxidised</T>
  </Diagram>
}
function Wisp({ x, y, h, lean, colour }: { x: number; y: number; h: number; lean: number; colour: string }) {
  return <path d={`M${x} ${y}c${lean * .3} ${-h * .25} ${-lean * .2} ${-h * .45} ${lean * .4} ${-h * .6}s${lean * .5} ${-h * .3} ${lean * .6} ${-h * .4}`} fill="none" stroke={colour} strokeWidth="3" opacity=".75" />
}
function FuelStove() {
  const cx = 270
  return <Diagram title="A camping gas stove burning a hydrocarbon fuel with small blue flames under a pan. Carbon dioxide and water vapour rise from the flame, and wavy lines show energy released as heat.">
    <path d={`M${cx - 76} 88H${cx + 76}L${cx + 66} 124Q${cx + 62} 132 ${cx + 52} 132H${cx - 52}Q${cx - 62} 132 ${cx - 66} 124Z`} fill="#c8d3db" stroke="#7f8c97" strokeWidth="2.2" />
    <path d={`M${cx + 76} 94H${cx + 132}`} stroke="#7f8c97" strokeWidth="7" />
    <path d={`M${cx - 70} 132L${cx - 50} 176M${cx + 70} 132L${cx + 50} 176`} stroke="#7f8c97" strokeWidth="3.5" />
    {[-30, -15, 0, 15, 30].map(d => <Flame key={d} x={cx + d} y={172} s={.42} fill="#8fc3ea" line="#3f8fd0" inner="#dcecf8" />)}
    <rect x={cx - 24} y={172} width={48} height={14} rx="5" fill="#9aa6b0" stroke="#6f7c87" strokeWidth="2" />
    <rect x={cx - 54} y={186} width={108} height={92} rx="26" fill="#e5ebf0" stroke="#7f8c97" strokeWidth="2.2" />
    <T x={cx} y={238} size={13} bold colour={muted}>gas fuel</T>
    <path d={`M${cx - 104} 170q10 -10 0 -20t0 -20M${cx - 88} 170q10 -10 0 -20t0 -20M${cx + 88} 170q10 -10 0 -20t0 -20M${cx + 104} 170q10 -10 0 -20t0 -20`} fill="none" stroke={amber} strokeWidth="2.6" />
    <T x={cx + 124} y={150} size={14} bold colour={amber} anchor="start">energy</T>
    <T x={cx + 124} y={168} size={14} bold colour={amber} anchor="start">released</T>
    <Wisp x={cx - 80} y={120} h={90} lean={-40} colour={purple} /><Wisp x={cx - 96} y={126} h={80} lean={-30} colour={purple} />
    <T x={cx - 134} y={40} size={15} bold colour={purple} anchor="end"><F f="CO2" size={15} colour={purple} /></T>
    <Wisp x={cx + 82} y={86} h={60} lean={30} colour={blue} /><Wisp x={cx + 60} y={82} h={52} lean={34} colour={blue} />
    <T x={cx + 122} y={40} size={15} bold colour={blue} anchor="start"><F f="H2O" size={15} colour={blue} /> vapour</T>
    <T x={cx - 170} y={250} size={13} colour={muted}>blue flame:</T>
    <T x={cx - 170} y={266} size={13} colour={muted}>plenty of oxygen</T>
  </Diagram>
}

// ---------- Section 4: balancing the equation for propane ----------
const SLOTS = [{ c: 0, t: 66, f: 'C3H8', name: 'propane' }, { c: 186, t: 190, f: 'O2', name: 'oxygen' }, { c: 302, t: 306, f: 'CO2', name: 'carbon dioxide' }, { c: 412, t: 416, f: 'H2O', name: 'water' }]
const TERM_W = [70, 38, 58, 60]
function Equation({ coefs, hi }: { coefs: Array<number | null>; hi?: number }) {
  const y = 66
  return <g>
    {SLOTS.map((s, i) => <g key={s.f}>
      {i > 0 && (coefs[i] === null
        ? <rect x={s.c - 20} y={y - 24} width={20} height={28} rx="6" fill="none" stroke={muted} strokeWidth="1.6" strokeDasharray="4 3" />
        : <g>{hi === i && <circle cx={s.c - 8} cy={y - 9} r="15" fill={glow} stroke={coral} strokeWidth="2" />}<T x={s.c - 1} y={y} size={26} bold anchor="end" colour={hi === i ? coral : ink}>{coefs[i]}</T></g>)}
      <text x={s.t} y={y}><F f={s.f} size={26} /></text>
      <T x={s.t + TERM_W[i] / 2} y={y + 32} size={12} colour={muted}>{s.name}</T>
    </g>)}
    <T x={150} y={y} size={24} bold>+</T><T x={374} y={y} size={24} bold>+</T>
    <Arrow x1={238} y1={y - 8} x2={276} y2={y - 8} width={2.6} />
  </g>
}
function CountTable({ rows }: { rows: Array<{ el: string; left: string; right: string; state: 'active' | 'done' }> }) {
  return <g>
    <Panel x={240} y={118} w={288} h={40 + rows.length * 36} />
    <T x={268} y={142} size={13} bold colour={muted}>atom</T><T x={346} y={142} size={13} bold colour={muted}>left side</T><T x={442} y={142} size={13} bold colour={muted}>right side</T>
    {rows.map((r, i) => { const y = 176 + i * 36, on = r.state === 'active'
      return <g key={r.el} opacity={on ? 1 : .6}>
        {on && <rect x={246} y={y - 21} width={276} height={32} rx="10" fill={glow} />}
        <T x={268} y={y} size={17} bold>{r.el}</T>
        <T x={346} y={y} size={r.left.length > 3 ? 13 : 17} bold colour={on ? coral : ink}>{r.left}</T>
        <T x={442} y={y} size={r.right.length > 3 ? 13 : 17} bold colour={on ? coral : ink}>{r.right}</T>
        <Tick x={510} y={y - 5} r={9} />
      </g> })}
  </g>
}
function Balance({ step }: { step: 1 | 2 | 3 | 4 }) {
  const coefs: Array<Array<number | null>> = [[1, null, null, null], [1, null, 3, null], [1, null, 3, 4], [1, 5, 3, 4]]
  const hiEl: El | undefined = step === 2 ? 'C' : step === 3 ? 'H' : undefined
  const eq = ['C₃H₈ + O₂ → CO₂ + H₂O', 'C₃H₈ + O₂ → 3CO₂ + H₂O', 'C₃H₈ + O₂ → 3CO₂ + 4H₂O', 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O'][step - 1]
  const notes = [
    'Formulae only, no numbers yet: dashed boxes show where numbers will go.',
    'Carbon: 3 on the left, so 3 CO₂ gives 3 on the right.',
    'Hydrogen: 8 on the left, so 4 H₂O gives 4 × 2 = 8 on the right.',
    'Oxygen: 6 + 4 = 10 on the right, so 5 O₂ gives 5 × 2 = 10 on the left. Every atom balances.',
  ]
  const rows = [
    { el: 'C', left: '3', right: '3', state: step === 2 ? 'active' : 'done' },
    { el: 'H', left: '8', right: '4 × 2 = 8', state: step === 3 ? 'active' : 'done' },
    { el: 'O', left: '5 × 2 = 10', right: '6 + 4 = 10', state: 'active' },
  ].slice(0, step - 1) as Array<{ el: string; left: string; right: string; state: 'active' | 'done' }>
  return <Diagram title={`Balancing the equation for the complete combustion of propane, step ${step}: ${eq}. ${notes[step - 1]}`}>
    <Equation coefs={coefs[step - 1]} hi={step === 1 ? undefined : [2, 3, 1][step - 2]} />
    <Displayed mol={alkane(3, 130, 196, 36, 36)} size={18} hiEl={hiEl} />
    <T x={130} y={262} size={13} colour={muted}>propane, <F f="C3H8" size={13} colour={muted} /></T>
    {step === 1
      ? <g>
        <Panel x={262} y={130} w={262} h={116} />
        <T x={393} y={164} size={16} bold colour={coral}>write the formulae first</T>
        <T x={393} y={194} size={14} colour={muted}>numbers go in front later</T>
        <T x={393} y={220} size={14} colour={muted}>never change a formula</T>
      </g>
      : <CountTable rows={rows} />}
  </Diagram>
}

// ---------- Question: which is not a hydrocarbon ----------
function ThreeMolecules() {
  const y = 150, g = 34
  const mols = [alkane(2, 90, y, g), ethanolLike(268, y, g), alkane(3, 448, y, g)]
  const panels: Array<[number, number]> = [[22, 136], [186, 164], [366, 164]]
  return <Diagram viewBox="0 0 540 250" title="Three displayed formulae numbered 1, 2 and 3. Molecule 1: two C atoms and six H atoms. Molecule 2: two C atoms, one O atom and six H atoms, with the O between a C and an H. Molecule 3: three C atoms and eight H atoms." schematic={false}>
    {mols.map((m, i) => <g key={i}>
      <Panel x={panels[i][0]} y={40} w={panels[i][1]} h={190} />
      <circle cx={panels[i][0] + panels[i][1] / 2} cy={40} r="15" fill="white" stroke={ink} strokeWidth="2" />
      <T x={panels[i][0] + panels[i][1] / 2} y={46} size={16} bold>{i + 1}</T>
      <Displayed mol={m} size={19} />
    </g>)}
  </Diagram>
}

export function HydrocarbonVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'hydro-hc': return <WhatIsHC />
    case 'hydro-displayed': return <MethaneDisplayed />
    case 'hydro-alkane': return <FourBonds />
    case 'hydro-four': return <FirstFour />
    case 'hydro-count': return <AlkaneTable withFormula={false} />
    case 'hydro-formula': return <AlkaneTable withFormula />
    case 'hydro-formula-use': return <UseFormula />
    case 'hydro-comb-word': return <CombustionWord />
    case 'hydro-oxidation': return <Oxidation />
    case 'hydro-comb-fuel': return <FuelStove />
    case 'hydro-bal-1': return <Balance step={1} />
    case 'hydro-bal-2': return <Balance step={2} />
    case 'hydro-bal-3': return <Balance step={3} />
    case 'hydro-bal-4': return <Balance step={4} />
    case 'hydro-q-three': return <ThreeMolecules />
    default: return <FirstFour />
  }
}

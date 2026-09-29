import { useId, type ReactNode } from 'react'
import { WsDiagram, Tag, Panel, Arrow, Stopwatch, Bench, Numbered, Bracket, tones, wsPalette as W, ink, muted, r1, faded, type Pt } from './WsKit'
import { Lines, Leader, wirePath } from './PhysicsKit'

/*
 * Working Scientifically Lesson 17: setting up electrolysis and a potometer. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'wssetup-' and is routed from CellBiologyVisuals.tsx.
 *
 * One electrolysis cell is reused through its walkthrough (the cathode, then the anode, then the gases collected), and one
 * potometer is reused through its walkthrough, the worked example and the question. Colour code: the cathode (−) blue, the
 * anode (+) coral, water blue, the plant green, gas white. The simple glassware below (glass tubing, test tubes, beakers,
 * a gloved or bare hand) is also used by WsGasVisuals (collecting gases) and WsSafetyVisuals (safety in the lab).
 */

export const lab = {
  sol: '#cfe2ee', solLine: '#7d9fb8',
  water: W.water, waterLine: W.waterLine,
  gas: '#ffffff',
  carbon: '#8c96a0', carbonLine: '#4f5a64',
  neg: '#3f7fb0', negFill: '#dcecf8',
  pos: '#c0675a', posFill: '#f8e0db',
  cork: '#dcc7a2', corkLine: '#9c835a',
  glove: '#cfd8f4', gloveLine: '#5b6fb0',
}

/* ---------- Shared glassware ---------- */

/** Glass tubing along `points` (soft corners): a glass outline with a clear bore. `bore` colours the inside (water or gas). */
export function GlassTube({ points, bore = 'white', width = 7, r = 10, dim = false }: { points: Pt[]; bore?: string; width?: number; r?: number; dim?: boolean }) {
  const d = wirePath(points, r)
  return <g opacity={dim ? faded : 1}>
    <path d={d} fill="none" stroke={W.glassLine} strokeWidth={width} />
    <path d={d} fill="none" stroke={bore} strokeWidth={width - 3.6} />
  </g>
}
/** Round bubbles with a thin glass-coloured rim. */
export function Bubbles({ pts, r = 3.4, colour = W.glassLine }: { pts: Pt[]; r?: number; colour?: string }) {
  return <g>{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r1(r * (0.75 + (i % 3) * 0.2))} fill="white" stroke={colour} strokeWidth="1.3" />)}</g>
}
/** The outline of a test tube: upright (open top, round bottom) or upside down (round top, open mouth at the bottom). */
export function tubePath(x: number, top: number, bottom: number, w: number, up = false) {
  const h = w / 2
  return up
    ? `M${x - h} ${bottom}V${top + h}A${h} ${h} 0 0 1 ${x + h} ${top + h}V${bottom}`
    : `M${x - h} ${top}V${bottom - h}A${h} ${h} 0 0 0 ${x + h} ${bottom - h}V${top}`
}
/**
 * A test tube from `top` to `bottom`. Upright: liquid from `level` down to the round bottom. Upside down (`up`): gas above
 * `level`, liquid from `level` down to the open mouth. `children` are drawn inside, clipped to the glass.
 */
export function TestTube({ x, top, bottom, w = 30, up = false, level, fill = lab.sol, line = lab.solLine, children, dim = false, glow }: {
  x: number; top: number; bottom: number; w?: number; up?: boolean; level?: number; fill?: string; line?: string; children?: ReactNode; dim?: boolean; glow?: string
}) {
  const clip = useId().replace(/:/g, '')
  const d = tubePath(x, top, bottom, w, up), inner = tubePath(x, top + 1.5, bottom - 1.5, w - 3, up)
  const lipY = up ? bottom : top
  return <g opacity={dim ? faded : 1}>
    {glow && <path d={d + 'Z'} fill="none" stroke={glow} strokeWidth="12" opacity=".35" />}
    <defs><clipPath id={clip}><path d={inner + 'Z'} /></clipPath></defs>
    <path d={d + 'Z'} fill={W.glass} />
    <g clipPath={`url(#${clip})`}>
      {level !== undefined && (up
        ? <g><rect x={x - w} y={level} width={w * 2} height={bottom - level + 4} fill={fill} /><path d={`M${x - w} ${level}H${x + w}`} stroke={line} strokeWidth="1.6" /></g>
        : <g><rect x={x - w} y={level} width={w * 2} height={bottom - level + 4} fill={fill} /><path d={`M${x - w} ${level}H${x + w}`} stroke={line} strokeWidth="1.6" /></g>)}
      {children}
    </g>
    <path d={d} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    <path d={up
      ? `M${x - w / 2} ${lipY - 3}Q${x - w / 2} ${lipY} ${x - w / 2 - 4} ${lipY + 2}M${x + w / 2} ${lipY - 3}Q${x + w / 2} ${lipY} ${x + w / 2 + 4} ${lipY + 2}`
      : `M${x - w / 2} ${lipY + 3}Q${x - w / 2} ${lipY} ${x - w / 2 - 4} ${lipY - 2}M${x + w / 2} ${lipY + 3}Q${x + w / 2} ${lipY} ${x + w / 2 + 4} ${lipY - 2}`} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    <path d={up ? `M${x - w / 2 + 6} ${bottom - 12}V${top + w / 2 + 6}` : `M${x - w / 2 + 6} ${top + 10}V${bottom - w / 2 - 4}`} stroke="white" strokeWidth="3" opacity=".85" />
  </g>
}
/** A beaker standing on `base`, centred at x. `level` is the liquid surface (y). `children` are drawn inside the liquid area. */
export function Beaker({ x, base, w, h, level, fill = lab.water, line = lab.waterLine, children, dim = false, spout = true }: {
  x: number; base: number; w: number; h: number; level?: number; fill?: string; line?: string; children?: ReactNode; dim?: boolean; spout?: boolean
}) {
  const clip = useId().replace(/:/g, '')
  const l = x - w / 2, r = x + w / 2, top = base - h
  const d = `M${l} ${top}V${base - 9}Q${l} ${base} ${l + 9} ${base}H${r - 9}Q${r} ${base} ${r} ${base - 9}V${top}`
  return <g opacity={dim ? faded : 1}>
    <defs><clipPath id={clip}><path d={d + 'Z'} /></clipPath></defs>
    <path d={d + 'Z'} fill={W.glass} />
    <g clipPath={`url(#${clip})`}>
      {level !== undefined && <g>
        <path d={`M${l} ${level}Q${x - w / 4} ${level - 2.5} ${x} ${level}T${r} ${level}V${base + 2}H${l}Z`} fill={fill} />
        <path d={`M${l} ${level}Q${x - w / 4} ${level - 2.5} ${x} ${level}T${r} ${level}`} fill="none" stroke={line} strokeWidth="1.8" />
      </g>}
      {children}
    </g>
    <path d={d} fill="none" stroke={W.glassLine} strokeWidth="2.6" />
    {spout && <path d={`M${l} ${top + 2}Q${l - 2} ${top - 1} ${l - 7} ${top - 3}`} fill="none" stroke={W.glassLine} strokeWidth="2.6" />}
    <path d={`M${r - 10} ${top + 12}V${base - 14}`} stroke="white" strokeWidth="3.4" opacity=".8" />
  </g>
}
/** A rubber bung whose top edge is at `top`. */
export function Bung({ x, top, w = 26, h = 20, dim = false }: { x: number; top: number; w?: number; h?: number; dim?: boolean }) {
  return <path opacity={dim ? faded : 1} d={`M${r1(x - w / 2 - 3)} ${top}Q${x} ${top - 2.5} ${r1(x + w / 2 + 3)} ${top}L${r1(x + w / 2 - 2)} ${top + h}Q${x} ${top + h + 2} ${r1(x - w / 2 + 2)} ${top + h}Z`} fill={lab.cork} stroke={lab.corkLine} strokeWidth="2" />
}
/**
 * A hand seen from the side, fingers curled towards +x, drawn around (0, 0) = the middle of the grip; rotate and place it
 * with `x`, `y`, `rotate`. `glove` draws a blue lab glove; otherwise it is a bare hand.
 */
export function Hand({ x, y, rotate = 0, s = 1, glove = false, insulated = false, dim = false }: { x: number; y: number; rotate?: number; s?: number; glove?: boolean; insulated?: boolean; dim?: boolean }) {
  const [fill, line] = insulated ? ['#9fb0a0', '#4f6450'] : glove ? [lab.glove, lab.gloveLine] : [W.skin, W.skinLine]
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`} opacity={dim ? faded : 1}>
    {/* wrist / cuff */}
    <path d="M-44 -12H-20V14H-44Z" fill={fill} stroke={line} strokeWidth="2" />
    {insulated && <path d="M-50 -16H-34V18H-50Z" fill={fill} stroke={line} strokeWidth="2" />}
    {/* palm and curled fingers */}
    <path d="M-22 -14C-12 -20 4 -20 12 -14C20 -8 20 8 12 14C4 19 -12 20 -22 14Z" fill={fill} stroke={line} strokeWidth="2" />
    <path d="M4 -13C14 -14 18 -6 14 0M4 1C14 0 18 7 12 13" fill="none" stroke={line} strokeWidth="1.6" />
    {/* thumb over the top */}
    <path d="M-14 -16C-8 -26 6 -26 12 -20C14 -18 12 -15 9 -15C2 -17 -6 -16 -12 -11Z" fill={fill} stroke={line} strokeWidth="2" />
  </g>
}

/* ---------- Section 2: the electrolysis cell ---------- */

const EL = { x: 160, w: 220, base: 212, h: 128, surf: 110 }
const XC = 115, XA = 205, TT = { top: 40, mouth: 176, w: 34 }, ROD_TOP = 138
type RigMode = 'rig' | 'cathode' | 'anode' | 'gases'

function Rod({ x, glow }: { x: number; glow?: string }) {
  return <g>
    {glow && <rect x={x - 11} y={ROD_TOP - 6} width="22" height={EL.base - ROD_TOP + 16} rx="11" fill={glow} opacity=".3" />}
    <rect x={x - 5} y={ROD_TOP} width="10" height={EL.base - ROD_TOP + 10} rx="3" fill={lab.carbon} stroke={lab.carbonLine} strokeWidth="1.8" />
  </g>
}
function Sign({ x, y, sign, r = 12 }: { x: number; y: number; sign: '+' | '−'; r?: number }) {
  const c = sign === '+' ? [lab.posFill, lab.pos] : [lab.negFill, lab.neg]
  return <g>
    <circle cx={x} cy={y} r={r} fill={c[0]} stroke={c[1]} strokeWidth="2" />
    <text x={x} y={r1(y + r * 0.45)} textAnchor="middle" fontSize={r * 1.45} fontWeight="800" fill={c[1]}>{sign}</text>
  </g>
}
function PowerSupply({ dim = false }: { dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <rect x={300} y={252} width={120} height={44} rx="9" fill={W.metal} stroke={W.metalLine} strokeWidth="2" />
    <rect x={318} y={262} width={24} height={10} rx="3" fill="white" stroke={W.metalLine} strokeWidth="1.4" />
    <path d="M324 252v-6h12v6M384 252v-6h12v6" fill="#3b4652" stroke="#3b4652" strokeWidth="2" />
    <text x={360} y={290} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>d.c.</text>
    <text x={330} y={288} textAnchor="middle" fontSize="16" fontWeight="800" fill={lab.neg}>−</text>
    <text x={390} y={288} textAnchor="middle" fontSize="16" fontWeight="800" fill={lab.pos}>+</text>
  </g>
}
/** The electrolysis cell: electrodes up through the base of a beaker of electrolyte, an upturned tube of solution over each. */
function Cell({ mode }: { mode: RigMode }) {
  const dimC = mode === 'anode', dimA = mode === 'cathode'
  const gasC = mode === 'gases' ? 96 : undefined, gasA = mode === 'gases' ? 92 : mode === 'anode' ? 62 : undefined
  const bubblesA: Pt[] = [[XA - 3, 132], [XA + 5, 118], [XA - 4, 104], [XA + 3, 88], [XA - 2, 74]]
  const bubblesC: Pt[] = [[XC + 3, 130], [XC - 4, 116], [XC + 4, 104]]
  return <g>
    <Beaker x={EL.x} base={EL.base} w={EL.w} h={EL.h} level={EL.surf} fill={lab.sol} line={lab.solLine} spout={false} />
    {/* wires under the cell to the power supply */}
    <g opacity={mode === 'anode' ? faded : 1}><path d={wirePath([[XC, EL.base + 8], [XC, 240], [330, 240], [330, 248]], 6)} fill="none" stroke={W.wire} strokeWidth="2.6" /></g>
    <g opacity={mode === 'cathode' ? faded : 1}><path d={wirePath([[XA, EL.base + 8], [XA, 228], [390, 228], [390, 248]], 6)} fill="none" stroke={W.wire} strokeWidth="2.6" /></g>
    <PowerSupply dim={mode === 'cathode' || mode === 'anode'} />
    {[XC, XA].map(x => <rect key={x} x={x - 9} y={EL.base - 3} width="18" height="7" rx="2" fill="#6b7580" />)}
    <g opacity={dimC ? faded : 1}>
      <TestTube x={XC} top={TT.top} bottom={TT.mouth} w={TT.w} up level={gasC ?? TT.top} fill={lab.sol} line={lab.solLine}>
        {mode === 'gases' && <Bubbles pts={bubblesC} r={3} />}
      </TestTube>
      <Rod x={XC} glow={mode === 'cathode' ? lab.neg : undefined} />
      <path d={tubePath(XC, TT.top, TT.mouth, TT.w, true)} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    </g>
    <g opacity={dimA ? faded : 1}>
      <TestTube x={XA} top={TT.top} bottom={TT.mouth} w={TT.w} up level={gasA ?? TT.top} fill={lab.sol} line={lab.solLine}>
        {(mode === 'anode' || mode === 'gases') && <Bubbles pts={bubblesA} r={3} />}
      </TestTube>
      <Rod x={XA} glow={mode === 'anode' ? lab.pos : undefined} />
      {(mode === 'anode' || mode === 'gases') && <Bubbles pts={[[XA + 2, 160], [XA - 3, 148]]} r={3} />}
      <path d={tubePath(XA, TT.top, TT.mouth, TT.w, true)} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    </g>
    {mode === 'gases' && <Bubbles pts={[[XC - 2, 160], [XC + 3, 148]]} r={3} />}
    {/* signs on the electrodes */}
    <g opacity={dimC ? faded : 1}><Sign x={XC - 30} y={196} sign="−" r={mode === 'cathode' ? 14 : 11} /></g>
    <g opacity={dimA ? faded : 1}><Sign x={XA + 30} y={196} sign="+" r={mode === 'anode' ? 14 : 11} /></g>
  </g>
}
/** A close-up of one electrode in the solution. `coat` adds a metal coating; otherwise gas bubbles rise from it. */
function Closeup({ x, y, coat = false, bubbleColour = W.glassLine }: { x: number; y: number; coat?: boolean; bubbleColour?: string }) {
  return <g>
    <rect x={x - 50} y={y} width="100" height="110" rx="14" fill={lab.sol} stroke={lab.solLine} strokeWidth="1.8" />
    <rect x={x - 7} y={y + 22} width="14" height="88" rx="3" fill={lab.carbon} stroke={lab.carbonLine} strokeWidth="1.8" />
    {coat
      ? <rect x={x - 11} y={y + 46} width="22" height="64" rx="5" fill="#e3a27a" stroke="#a9603a" strokeWidth="2" />
      : <Bubbles pts={[[x - 14, y + 84], [x + 14, y + 72], [x - 13, y + 58], [x + 15, y + 44], [x - 12, y + 32], [x + 13, y + 18]]} r={4.2} colour={bubbleColour} />}
  </g>
}
function ElecRig() {
  return <WsDiagram title="Electrolysis set-up: a beaker of electrolyte with two electrodes coming up through its base, joined to a power supply. A test tube full of solution stands upside down over each electrode.">
    <Cell mode="rig" />
    <Lines x={300} y={40} lines={['test tube of solution,', 'upside down']} size={14} />
    <Leader from={[296, 44]} to={[XA + TT.w / 2, 64]} />
    <Lines x={300} y={120} lines={['electrodes']} size={14} />
    <Leader from={[296, 116]} to={[XA + 5, 194]} />
    <Lines x={300} y={168} lines={['electrolyte']} size={14} />
    <Leader from={[296, 164]} to={[252, 188]} />
    <Lines x={430} y={278} lines={['power', 'supply']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function Cathode() {
  return <WsDiagram title="The cathode is the negative electrode. There you get either a coating of pure metal on the electrode, or bubbles of hydrogen gas.">
    <Cell mode="cathode" />
    <Tag x={415} y={30} text="cathode (negative)" tone="change" size={14} strong />
    <Closeup x={354} y={58} coat />
    <Closeup x={478} y={58} />
    <Lines x={416} y={118} anchor="middle" lines={['or']} size={14} colour={muted} />
    <Lines x={354} y={188} anchor="middle" lines={['coating of', 'pure metal']} size={13} />
    <Lines x={478} y={188} anchor="middle" lines={['bubbles of', 'hydrogen']} size={13} />
  </WsDiagram>
}
function Anode() {
  return <WsDiagram title="The anode is the positive electrode. There you get bubbles of oxygen gas, or bubbles of a halogen such as chlorine.">
    <Cell mode="anode" />
    <Tag x={415} y={30} text="anode (positive)" tone="bad" size={14} strong />
    <Closeup x={354} y={58} />
    <Closeup x={478} y={58} bubbleColour="#9aa84a" />
    <Lines x={416} y={118} anchor="middle" lines={['or']} size={14} colour={muted} />
    <Lines x={354} y={188} anchor="middle" lines={['bubbles of', 'oxygen']} size={13} />
    <Lines x={478} y={188} anchor="middle" lines={['a halogen, e.g.', 'chlorine']} size={13} />
  </WsDiagram>
}
/** A test tube of gas with a splint held at its mouth: 'do the test for the gas'. */
function GasTest({ x, y }: { x: number; y: number }) {
  return <g>
    <TestTube x={x} top={y} bottom={y + 90} w={30} />
    <path d={`M${x + 36} ${y - 40}L${x + 4} ${y - 4}`} stroke={W.woodLine} strokeWidth="6" />
    <path d={`M${x + 36} ${y - 40}L${x + 4} ${y - 4}`} stroke={W.wood} strokeWidth="3.4" />
    <path d={`M${x + 2} ${y - 2}C${x - 8} ${y - 8} ${x - 6} ${y - 20} ${x + 2} ${y - 26}C${x + 2} ${y - 16} ${x + 10} ${y - 14} ${x + 2} ${y - 2}Z`} fill={W.light} stroke={W.lightLine} strokeWidth="1.6" />
  </g>
}
function Gases() {
  return <WsDiagram title="Gas made at each electrode rises into its upside-down test tube and pushes the solution out. When a tube is full of gas, it can be tested to find out which gas it is.">
    <Cell mode="gases" />
    <Arrow from={[XA + 32, 60]} to={[XA + 32, 104]} colour={muted} width={2.4} />
    <Lines x={290} y={46} lines={['gas pushes the', 'solution out']} size={14} />
    <Leader from={[286, 58]} to={[XA + 8, 70]} />
    <Arrow from={[330, 140]} to={[410, 140]} width={2.6} bend={-0.12} />
    <GasTest x={460} y={110} />
    <Lines x={460} y={230} anchor="middle" lines={['then test', 'the gas']} size={14} />
  </WsDiagram>
}

/* ---------- Section 3: the potometer ---------- */

const PO = { cy: 196, x0: 140, mmPx: 4.4, shoot: 440, res: 382 }
const bx = (mm: number) => r1(PO.x0 + mm * PO.mmPx)
function Leaf({ x, y, a, len = 30, dim = false }: { x: number; y: number; a: number; len?: number; dim?: boolean }) {
  return <g transform={`translate(${x} ${y}) rotate(${a})`} opacity={dim ? faded : 1}>
    <path d={`M0 0C${len * 0.3} -${len * 0.36} ${len * 0.75} -${len * 0.34} ${len} 0C${len * 0.75} ${len * 0.3} ${len * 0.3} ${len * 0.32} 0 0Z`} fill={W.plant} stroke={W.plantLine} strokeWidth="1.8" />
    <path d={`M2 0H${len * 0.8}`} stroke={W.plantLine} strokeWidth="1.1" opacity=".7" />
  </g>
}
function Shoot({ x, top }: { x: number; top: number }) {
  return <g>
    <path d={`M${x} 116C${x - 2} 90 ${x + 3} 60 ${x} ${top}`} fill="none" stroke={W.plantLine} strokeWidth="4" />
    <Leaf x={x} y={96} a={-160} len={34} />
    <Leaf x={x} y={82} a={-24} len={36} />
    <Leaf x={x} y={62} a={-150} len={30} />
    <Leaf x={x + 1} y={48} a={-34} len={30} />
    <Leaf x={x} y={top + 4} a={-100} len={22} />
  </g>
}
/** The potometer: beaker of water (left) → capillary tube with a scale → reservoir with tap → tube holding the shoot (right). */
function Potometer({ bubble = 0, ghost, scale = true, dimParts = false, children }: { bubble?: number; ghost?: number; scale?: boolean; dimParts?: boolean; children?: ReactNode }) {
  const cy = PO.cy
  return <g>
    <g opacity={dimParts ? 0.55 : 1}>
      <Beaker x={66} base={286} w={78} h={62} level={248} />
      {/* reservoir, tap and the wide tube holding the shoot */}
      <path d={`M${PO.res - 4} ${cy - 4}V96M${PO.res + 4} ${cy - 4}V96`} stroke={W.glassLine} strokeWidth="2.2" />
      <path d={`M${PO.res} ${cy - 4}V96`} stroke={lab.water} strokeWidth="5.6" />
      <path d={`M${PO.res - 22} 50L${PO.res - 5} 96H${PO.res + 5}L${PO.res + 22} 50Z`} fill={W.glass} />
      <path d={`M${PO.res - 18} 60L${PO.res - 5} 96H${PO.res + 5}L${PO.res + 18} 60Z`} fill={lab.water} />
      <path d={`M${PO.res - 18} 60H${PO.res + 18}`} stroke={lab.waterLine} strokeWidth="1.6" />
      <path d={`M${PO.res - 22} 50L${PO.res - 5} 96M${PO.res + 22} 50L${PO.res + 5} 96`} stroke={W.glassLine} strokeWidth="2.4" fill="none" />
      <rect x={PO.res - 9} y={132} width="18" height="16" rx="4" fill={W.metal} stroke={W.metalLine} strokeWidth="1.8" />
      <path d={`M${PO.res - 22} 140H${PO.res + 22}`} stroke={W.metalLine} strokeWidth="4" />
    </g>
    {/* the capillary tube: from under the water in the beaker, up and along to the shoot */}
    <GlassTube points={[[66, 276], [66, cy], [PO.shoot - 6, cy]]} bore={lab.water} width={9} r={12} />
    <path d={`M${PO.shoot - 14} 114V${cy + 2}Q${PO.shoot - 14} ${cy + 16} ${PO.shoot} ${cy + 16}Q${PO.shoot + 14} ${cy + 16} ${PO.shoot + 14} ${cy + 2}V114Z`} fill={lab.water} />
    <g opacity={dimParts ? 0.55 : 1}>
      <path d={`M${PO.shoot - 14} 114V${cy - 5}M${PO.shoot - 14} ${cy + 5}V${cy + 2}Q${PO.shoot - 14} ${cy + 16} ${PO.shoot} ${cy + 16}Q${PO.shoot + 14} ${cy + 16} ${PO.shoot + 14} ${cy + 2}V114`} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
      <path d={`M${PO.shoot} 118V150`} stroke={W.plantLine} strokeWidth="4" />
      <Bung x={PO.shoot} top={104} w={30} h={18} />
      <Shoot x={PO.shoot} top={26} />
    </g>
    {scale && <g>
      <rect x={PO.x0 - 12} y={cy + 8} width={50 * PO.mmPx + 24} height="18" rx="4" fill="#f7ebc8" stroke="#b99a52" strokeWidth="1.5" />
      {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${bx(i * 5)} ${cy + 8}v${i % 2 ? 6 : 10}`} stroke="#9c8040" strokeWidth="1.3" />)}
      {[0, 10, 20, 30, 40, 50].map(v => <text key={v} x={bx(v)} y={cy + 42} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>{v}</text>)}
      <text x={bx(50) + 26} y={cy + 42} fontSize="12" fontWeight="700" fill={muted}>mm</text>
    </g>}
    {ghost !== undefined && <ellipse cx={bx(ghost)} cy={cy} rx="8" ry="2.8" fill="white" stroke={ink} strokeWidth="1.5" opacity=".35" />}
    <ellipse cx={bx(bubble)} cy={cy} rx="8" ry="2.8" fill="white" stroke={ink} strokeWidth="1.5" />
    {children}
  </g>
}
function PotometerFig() {
  return <WsDiagram title="A potometer. A leafy shoot is fitted into a tube of water. The tube joins a thin capillary tube with a scale, which dips into a beaker of water. There is an air bubble in the capillary tube and a reservoir with a tap.">
    <Potometer bubble={0}>
      <Lines x={400} y={34} anchor="end" lines={['leafy shoot']} size={14} />
      <Leader from={[404, 30]} to={[418, 58]} />
      <Lines x={350} y={92} anchor="end" lines={['tap shut during', 'the experiment']} size={13} />
      <Leader from={[354, 104]} to={[PO.res - 12, 138]} />
      <Lines x={bx(0)} y={150} anchor="middle" lines={['air bubble']} size={14} />
      <Leader from={[bx(0), 156]} to={[bx(0), PO.cy - 4]} />
      <Lines x={228} y={150} lines={['capillary tube', 'with a scale']} size={13} />
      <Leader from={[262, 170]} to={[262, PO.cy - 4]} />
      <Lines x={116} y={272} lines={['beaker of water']} size={13} />
    </Potometer>
  </WsDiagram>
}
function BubbleStart() {
  return <WsDiagram title="Before timing, the starting position of the air bubble is read on the scale (0 mm here) and a stopwatch is started.">
    <Potometer bubble={0} dimParts>
      <path d={`M${bx(0)} ${PO.cy - 14}V${PO.cy + 28}`} stroke={tones.mark.line} strokeWidth="2.4" strokeDasharray="5 4" />
      <Tag x={bx(0)} y={146} text="starting position" tone="mark" size={13} strong />
      <Stopwatch x={96} y={78} r={30} reading="0:00" />
      <Lines x={140} y={74} lines={['start the', 'stopwatch']} size={14} />
    </Potometer>
  </WsDiagram>
}
function BubbleMove() {
  return <WsDiagram title="As the plant takes up water, water moves along the capillary tube towards the shoot and pulls the air bubble with it. After a set time, the bubble has moved 30 mm from its starting position.">
    <Potometer bubble={30} ghost={0} dimParts>
      <Bracket x1={bx(0)} x2={bx(30)} y={PO.cy - 16} />
      <Lines x={bx(15)} y={PO.cy - 32} anchor="middle" lines={['how far it moved']} size={14} colour={tones.measure.text} />
      <Arrow from={[bx(8), 128]} to={[bx(42), 128]} colour={lab.waterLine} width={2.6} />
      <Lines x={bx(25)} y={114} anchor="middle" lines={['water and bubble move this way']} size={13} colour={lab.waterLine} />
      <Stopwatch x={96} y={70} r={30} reading="10:00" size={13} />
    </Potometer>
  </WsDiagram>
}
/** A straight strip of capillary tube with its scale, for the rate and worked-example frames. */
function Strip({ x, y, moved, label }: { x: number; y: number; moved: number; label?: string }) {
  const s = (mm: number) => r1(x + 12 + mm * 5)
  return <g>
    <GlassTube points={[[x - 8, y], [x + 290, y]]} bore={lab.water} width={9} />
    <rect x={x} y={y + 8} width={274} height="18" rx="4" fill="#f7ebc8" stroke="#b99a52" strokeWidth="1.5" />
    {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${s(i * 5)} ${y + 8}v${i % 2 ? 6 : 10}`} stroke="#9c8040" strokeWidth="1.3" />)}
    {[0, 10, 20, 30, 40, 50].map(v => <text key={v} x={s(v)} y={y + 42} textAnchor="middle" fontSize="12" fontWeight="650" fill={muted}>{v}</text>)}
    <text x={x + 284} y={y + 42} fontSize="12" fontWeight="700" fill={muted}>mm</text>
    <ellipse cx={s(0)} cy={y} rx="8" ry="2.8" fill="white" stroke={ink} strokeWidth="1.5" opacity=".35" />
    <ellipse cx={s(moved)} cy={y} rx="8" ry="2.8" fill="white" stroke={ink} strokeWidth="1.5" />
    <Bracket x1={s(0)} x2={s(moved)} y={y - 16} colour={tones.measure.line} />
    {label && <Lines x={r1((s(0) + s(moved)) / 2)} y={y - 32} anchor="middle" lines={[label]} size={15} colour={tones.measure.text} />}
  </g>
}
function Rate() {
  return <WsDiagram title="Transpiration rate equals the distance the bubble moved divided by the time taken.">
    <Panel x={40} y={20} w={460} h={96} tone="mark" />
    <Lines x={150} y={62} anchor="middle" lines={['transpiration', 'rate =']} size={18} />
    <text x={350} y={58} textAnchor="middle" fontSize="18" fontWeight="750" fill={tones.measure.text}>distance bubble moved</text>
    <path d="M240 70H460" stroke={ink} strokeWidth="2.4" />
    <text x={350} y={96} textAnchor="middle" fontSize="18" fontWeight="750" fill={tones.change.text}>time taken</text>
    <Strip x={48} y={210} moved={30} label="distance" />
    <Stopwatch x={440} y={214} r={32} tone="change" />
    <Lines x={440} y={276} anchor="middle" lines={['time']} size={15} colour={tones.change.text} />
  </WsDiagram>
}
function WorkedRate() {
  return <WsDiagram title="Worked example: the bubble moved 30 mm in 10 minutes. Transpiration rate = 30 mm ÷ 10 min = 3 mm/min.">
    <Strip x={48} y={90} moved={30} label="30 mm" />
    <Stopwatch x={440} y={96} r={34} reading="10 min" tone="change" size={13} />
    <Lines x={270} y={186} anchor="middle" lines={['rate = distance ÷ time']} size={17} colour={muted} />
    <text x={270} y={226} textAnchor="middle" fontSize="21" fontWeight="750" fill={ink}>= 30 mm ÷ 10 min</text>
    <Panel x={190} y={244} w={160} h={44} tone="mark" strong />
    <text x={270} y={273} textAnchor="middle" fontSize="21" fontWeight="750" fill={ink}>= 3 mm/min</text>
  </WsDiagram>
}
function QPotometer() {
  return <WsDiagram title="A potometer with four numbered parts.">
    <Potometer bubble={20} scale>
      <Numbered n={1} at={[400, 34]} to={[424, 60]} />
      <Numbered n={2} at={[140, 262]} to={[92, 264]} />
      <Numbered n={3} at={[290, 262]} to={[bx(40), PO.cy + 18]} />
      <Numbered n={4} at={[bx(20), 146]} to={[bx(20), PO.cy - 3]} />
    </Potometer>
  </WsDiagram>
}

export function WsSetupVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wssetup-elec-rig': return <ElecRig />
    case 'wssetup-cathode': return <Cathode />
    case 'wssetup-anode': return <Anode />
    case 'wssetup-gases': return <Gases />
    case 'wssetup-potometer': return <PotometerFig />
    case 'wssetup-bubble-start': return <BubbleStart />
    case 'wssetup-bubble-move': return <BubbleMove />
    case 'wssetup-rate': return <Rate />
    case 'wssetup-worked-rate': return <WorkedRate />
    case 'wssetup-q-potometer': return <QPotometer />
    default: return null
  }
}

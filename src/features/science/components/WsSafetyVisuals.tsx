import type { ReactNode } from 'react'
import { WsDiagram, Tag, Panel, Tick, Cross, Arrow, Bench, Bust, tones, wsPalette as W, ink, muted, r1, faded, type Pt } from './WsKit'
import { Lines, Leader, Cell, Lamp, Wire } from './PhysicsKit'
import { Flask, GasWisp } from './GasRateVisuals'
import { blob } from './GasParticleVisuals'
import { lab, Beaker, Hand, Bubbles } from './WsSetupVisuals'

/*
 * Working Scientifically Lesson 16: safety and ethics in the lab. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'wssafety-' and is routed from CellBiologyVisuals.tsx.
 *
 * Friendly, simple figures (no cartoon characters). Glassware and hands come from WsSetupVisuals so the practical-skills
 * lessons match. Hazard pictograms are the red-diamond GHS style (flame = flammable, exclamation mark = irritant).
 * Green tick = the safe habit, coral cross = the unsafe one; heat is drawn with coral wavy lines, cool with blue.
 */

const hot = W.hot, coat = '#fbfdff', coatLine = '#9fb2c2', trousers = '#5c6b7a', shoe = '#3b4652'

/* ---------- Small pieces ---------- */

/** A GHS hazard pictogram: a red diamond with a black flame or exclamation mark. (x, y) is its centre. */
function Ghs({ x, y, kind, s = 1 }: { x: number; y: number; kind: 'flame' | 'irritant'; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -20L20 0L0 20L-20 0Z" fill="white" stroke="#d22f27" strokeWidth="3.4" />
    {kind === 'flame'
      ? <g><path d="M-1 9C-10 8 -10 -2 -4 -7C-4 -2 -1 -1 0 -3C1 -8 3 -10 1 -14C9 -9 11 2 5 8C3 9 1 9 -1 9Z" fill="#1d252c" /><path d="M-9 11H9" stroke="#1d252c" strokeWidth="2" /></g>
      : <g><path d="M0 -12V4" stroke="#1d252c" strokeWidth="4.4" /><circle cx="0" cy="10" r="2.6" fill="#1d252c" /></g>}
  </g>
}
/** A reagent bottle standing on `base`; an optional pictogram on its label. */
function Bottle({ x, base, h = 86, w = 56, kind, fill = '#f3e7cf', line = '#a88b5a', label, cap = true }: { x: number; base: number; h?: number; w?: number; kind?: 'flame' | 'irritant'; fill?: string; line?: string; label?: string; cap?: boolean }) {
  const top = base - h, l = x - w / 2
  return <g>
    <path d={`M${l} ${top + 22}Q${l} ${top + 12} ${x - 10} ${top + 10}V${top}H${x + 10}V${top + 10}Q${l + w} ${top + 12} ${l + w} ${top + 22}V${base - 6}Q${l + w} ${base} ${l + w - 6} ${base}H${l + 6}Q${l} ${base} ${l} ${base - 6}Z`} fill={fill} stroke={line} strokeWidth="2.2" />
    {cap && <rect x={x - 12} y={top - 10} width="24" height="12" rx="3" fill="#6b7580" stroke="#4f5a64" strokeWidth="1.6" />}
    <rect x={l + 6} y={top + 28} width={w - 12} height={h - 38} rx="4" fill="white" stroke={line} strokeWidth="1.4" />
    {kind && <Ghs x={x} y={top + 28 + (h - 38) / 2} kind={kind} s={0.9} />}
    {label && <text x={x} y={top + 28 + (h - 38) / 2 + 5} textAnchor="middle" fontSize="12" fontWeight="750" fill={ink}>{label}</text>}
  </g>
}
/** A Bunsen burner on `base` with a blue (roaring) flame. */
function Bunsen({ x, base, flame = true }: { x: number; base: number; flame?: boolean }) {
  return <g>
    {flame && <g>
      <path d={`M${x} ${base - 150}C${x - 16} ${base - 124} ${x - 14} ${base - 100} ${x - 9} ${base - 92}H${x + 9}C${x + 14} ${base - 100} ${x + 16} ${base - 124} ${x} ${base - 150}Z`} fill="#bcd8f5" stroke="#5f93cc" strokeWidth="1.8" />
      <path d={`M${x} ${base - 124}C${x - 7} ${base - 110} ${x - 6} ${base - 98} ${x - 4} ${base - 93}H${x + 4}C${x + 6} ${base - 98} ${x + 7} ${base - 110} ${x} ${base - 124}Z`} fill="#3f7fd0" />
    </g>}
    <rect x={x - 8} y={base - 92} width="16" height="74" rx="3" fill={W.metal} stroke={W.metalLine} strokeWidth="2" />
    <rect x={x - 11} y={base - 42} width="22" height="12" rx="3" fill="#c3ccd4" stroke={W.metalLine} strokeWidth="1.8" />
    <path d={`M${x - 30} ${base}Q${x - 28} ${base - 18} ${x - 8} ${base - 20}H${x + 8}Q${x + 28} ${base - 18} ${x + 30} ${base}Z`} fill="#c3ccd4" stroke={W.metalLine} strokeWidth="2" />
    <path d={`M${x + 20} ${base - 9}H${x + 46}`} stroke={W.metalLine} strokeWidth="6" />
    <path d={`M${x + 20} ${base - 9}H${x + 46}`} stroke="#e6a23c" strokeWidth="3" />
  </g>
}
/** A spatula: handle at (x1, y1), scoop at (x2, y2), with a little powder on the scoop. */
function Spatula({ from, to, powder = true }: { from: Pt; to: Pt; powder?: boolean }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]) * 180 / Math.PI
  return <g>
    <path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} stroke={W.metalLine} strokeWidth="6" />
    <path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} stroke={W.metal} strokeWidth="3" />
    <g transform={`translate(${to[0]} ${to[1]}) rotate(${a})`}>
      <path d="M-4 -6H14Q20 0 14 6H-4Z" fill={W.metal} stroke={W.metalLine} strokeWidth="1.8" />
      {powder && <path d="M-2 -6Q5 -13 13 -6Z" fill="white" stroke="#b9c4cc" strokeWidth="1.3" />}
    </g>
  </g>
}
/** A glass funnel whose stem ends at (x, y). */
function Funnel({ x, y, w = 60 }: { x: number; y: number; w?: number }) {
  return <g>
    <path d={`M${x - w / 2} ${y - 74}L${x - 5} ${y - 34}V${y}M${x + w / 2} ${y - 74}L${x + 5} ${y - 34}V${y}`} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    <path d={`M${x - w / 2} ${y - 74}L${x - 5} ${y - 34}V${y}H${x + 5}V${y - 34}L${x + w / 2} ${y - 74}Z`} fill={W.glass} opacity=".7" />
    <path d={`M${x - w / 2 - 3} ${y - 74}H${x + w / 2 + 3}`} stroke={W.glassLine} strokeWidth="2.4" />
  </g>
}
/** Wavy heat lines rising from (x, y). */
function Heat({ x, y, n = 3, colour = hot }: { x: number; y: number; n?: number; colour?: string }) {
  return <g>{Array.from({ length: n }, (_, i) => {
    const cx = x + (i - (n - 1) / 2) * 14
    return <path key={i} d={`M${cx} ${y}q-6 -8 0 -16t0 -16`} fill="none" stroke={colour} strokeWidth="2.4" />
  })}</g>
}
/** Safety goggles on a head drawn by Bust (head centre = (x, y)). */
function Goggles({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-13 -2H13" stroke="#3f7fb0" strokeWidth="3" />
    <rect x="-13" y="-7" width="26" height="11" rx="5" fill="#dff1fb" stroke="#3f7fb0" strokeWidth="2" />
    <path d="M0 -6V3" stroke="#3f7fb0" strokeWidth="1.6" />
  </g>
}

/* ---------- Section 2: chemicals ---------- */

/** A student standing, in lab coat, goggles, gloves and closed shoes. (x, y) = between the feet on the floor. */
function Student({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    {/* legs and shoes */}
    <path d="M-22 -86H-4V-12H-22Z" fill={trousers} stroke="#46525f" strokeWidth="2" />
    <path d="M4 -86H22V-12H4Z" fill={trousers} stroke="#46525f" strokeWidth="2" />
    <path d="M-26 -14H-2Q2 -14 2 -8V0H-34Q-36 -10 -26 -14Z" fill={shoe} />
    <path d="M26 -14H2Q-2 -14 -2 -8V0H34Q36 -10 26 -14Z" fill={shoe} transform="translate(4 0)" />
    {/* lab coat */}
    <path d="M-34 -206Q-44 -204 -46 -190L-50 -64Q-50 -58 -44 -58H44Q50 -58 50 -64L46 -190Q44 -204 34 -206L10 -212H-10Z" fill={coat} stroke={coatLine} strokeWidth="2.2" />
    <path d="M-10 -212L0 -176L10 -212M0 -176V-60" fill="none" stroke={coatLine} strokeWidth="2" />
    {[-160, -130, -100].map(yy => <circle key={yy} cx={6} cy={yy} r="2.6" fill={coatLine} />)}
    <path d="M-40 -110H-22M22 -110H40" stroke={coatLine} strokeWidth="1.6" />
    {/* arms (sleeves) and gloved hands */}
    <path d="M-44 -196Q-60 -170 -62 -120" fill="none" stroke={coatLine} strokeWidth="19" />
    <path d="M-44 -196Q-60 -170 -62 -120" fill="none" stroke={coat} strokeWidth="15" />
    <path d="M44 -196Q60 -170 62 -120" fill="none" stroke={coatLine} strokeWidth="19" />
    <path d="M44 -196Q60 -170 62 -120" fill="none" stroke={coat} strokeWidth="15" />
    <ellipse cx={-62} cy={-106} rx="10" ry="14" fill={lab.glove} stroke={lab.gloveLine} strokeWidth="2" />
    <ellipse cx={62} cy={-106} rx="10" ry="14" fill={lab.glove} stroke={lab.gloveLine} strokeWidth="2" />
    {/* neck, head, hair and goggles */}
    <rect x="-7" y="-222" width="14" height="14" fill={W.skin} stroke={W.skinLine} strokeWidth="1.6" />
    <circle cx="0" cy="-242" r="22" fill={W.skin} stroke={W.skinLine} strokeWidth="2" />
    <path d="M-22 -244Q-20 -268 0 -267Q20 -267 22 -246Q10 -256 -22 -244Z" fill={W.hair} />
    <path d="M-22 -242H22" stroke="#3f7fb0" strokeWidth="3" />
    <rect x="-19" y="-250" width="17" height="13" rx="5" fill="#dff1fb" stroke="#3f7fb0" strokeWidth="2" />
    <rect x="2" y="-250" width="17" height="13" rx="5" fill="#dff1fb" stroke="#3f7fb0" strokeWidth="2" />
    <path d="M-7 -228Q0 -224 7 -228" fill="none" stroke={W.skinLine} strokeWidth="1.8" />
  </g>
}
function Clothing() {
  const x = 270, y = 292, s = 1
  void s
  return <WsDiagram title="A student dressed for practical work: a lab coat, safety goggles, gloves and sensible closed shoes.">
    <Student x={x} y={y} />
    <Lines x={170} y={48} anchor="end" lines={['safety goggles']} size={14} />
    <Leader from={[174, 44]} to={[x - 14, 50]} />
    <Lines x={170} y={196} anchor="end" lines={['gloves']} size={14} />
    <Leader from={[174, 192]} to={[x - 66, 188]} />
    <Lines x={372} y={124} lines={['lab coat']} size={14} />
    <Leader from={[368, 120]} to={[x + 36, 150]} />
    <Lines x={372} y={272} lines={['sensible shoes']} size={14} />
    <Leader from={[368, 268]} to={[x + 30, 284]} />
  </WsDiagram>
}
function Window({ x, y }: { x: number; y: number }) {
  return <g>
    <rect x={x} y={y} width="80" height="64" rx="6" fill="#eef7fc" stroke={W.metalLine} strokeWidth="2.2" />
    <path d={`M${x + 40} ${y}V${y + 64}M${x} ${y + 32}H${x + 40}`} stroke={W.metalLine} strokeWidth="2" />
    <path d={`M${x + 40} ${y}L${x + 64} ${y + 10}V${y + 58}L${x + 40} ${y + 64}Z`} fill="white" stroke={W.metalLine} strokeWidth="2" />
    {[0, 1, 2].map(i => <path key={i} d={`M${x + 90} ${y + 16 + i * 16}q10 -6 20 0t20 0`} fill="none" stroke={W.waterLine} strokeWidth="2.2" />)}
  </g>
}
function Hazard() {
  return <WsDiagram title="A lit Bunsen burner on the left. A bottle of flammable liquid is kept well away from the flame, next to a bottle of an irritant. An open window keeps the room well ventilated.">
    <Window x={24} y={20} />
    <Lines x={24} y={104} lines={['well ventilated']} size={13} weight={650} colour={muted} />
    <Bench x1={20} x2={520} y={260} />
    <Bunsen x={120} base={258} />
    <Bottle x={380} base={258} kind="flame" />
    <Bottle x={470} base={258} kind="irritant" fill="#e3eef6" line="#7f9db2" />
    <path d={`M170 150H330`} stroke={tones.good.line} strokeWidth="2.4" strokeDasharray="7 6" />
    <Arrow from={[250, 150]} to={[168, 150]} colour={tones.good.line} width={2.4} />
    <Arrow from={[250, 150]} to={[332, 150]} colour={tones.good.line} width={2.4} />
    <Lines x={250} y={136} anchor="middle" lines={['kept well away']} size={13} colour={tones.good.text} />
    <Lines x={380} y={286} anchor="middle" lines={['flammable']} size={14} />
    <Lines x={470} y={286} anchor="middle" lines={['irritant']} size={14} />
  </WsDiagram>
}
function Fume() {
  return <WsDiagram title="A fume cupboard seen from the front. A reaction inside a flask gives off a gas, which is drawn up and away through a duct at the top, so it cannot escape into the room.">
    {/* cabinet */}
    <rect x={120} y={60} width={260} height={220} rx="10" fill={W.metal} stroke={W.metalLine} strokeWidth="2.4" />
    <rect x={136} y={76} width={228} height={170} rx="6" fill="#f7fafc" stroke={W.metalLine} strokeWidth="2" />
    <path d="M136 246H364" stroke={W.metalLine} strokeWidth="3" />
    {/* duct */}
    <path d="M226 60V26Q226 16 236 16H264Q274 16 274 26V60" fill={W.metal} stroke={W.metalLine} strokeWidth="2.4" />
    <Flask cx={250} base={244} h={96} w={82} level={26} fill="#eef2d2" line="#a6ad5a" />
    <GasWisp x={244} y={140} len={50} colour="#9aa84a" />
    <GasWisp x={258} y={132} len={46} colour="#9aa84a" flip />
    <Arrow from={[250, 76]} to={[250, 28]} colour="#9aa84a" width={3} />
    {/* glass sash, pulled most of the way down */}
    <rect x={136} y={76} width={228} height={118} fill="#dcecf8" opacity=".45" />
    <path d="M136 194H364" stroke={W.metalLine} strokeWidth="4" />
    <path d="M150 90L178 118M162 88L200 126" stroke="white" strokeWidth="4" opacity=".8" />
    <Lines x={392} y={40} lines={['gas is drawn', 'away']} size={14} colour="#6f7a2e" />
    <Leader from={[388, 36]} to={[276, 36]} />
    <Lines x={392} y={170} lines={['fume cupboard']} size={14} />
    <Leader from={[388, 166]} to={[366, 150]} />
    <Lines x={392} y={218} lines={['glass screen']} size={13} weight={650} colour={muted} />
    <Leader from={[388, 214]} to={[366, 194]} colour={muted} />
  </WsDiagram>
}
function Transfer() {
  return <WsDiagram title="Left: a gloved hand uses a spatula to move a solid into a beaker. Right: a liquid is poured carefully from a beaker through a funnel into a flask.">
    <Panel x={14} y={14} w={250} h={248} />
    <Panel x={276} y={14} w={250} h={248} />
    {/* spatula */}
    <Beaker x={150} base={250} w={80} h={70} />
    <path d="M136 250Q150 238 164 250Z" fill="white" stroke="#b9c4cc" strokeWidth="1.3" />
    <Spatula from={[60, 104]} to={[140, 150]} />
    <Hand x={80} y={116} rotate={30} glove s={0.9} />
    {[[150, 170], [146, 190], [153, 208]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="2.4" fill="white" stroke="#9fb0bd" strokeWidth="1.2" />)}
    <Tag x={139} y={46} text="spatula" size={14} />
    {/* funnel */}
    <Flask cx={420} base={250} h={100} w={100} level={34} />
    <Funnel x={420} y={186} />
    <g transform="rotate(-58 356 86)">
      <Beaker x={356} base={120} w={50} h={56} level={82} spout={false} />
    </g>
    <path d="M392 98Q408 104 410 120V184" stroke={lab.water} strokeWidth="6" fill="none" />
    <Tag x={401} y={46} text="funnel" size={14} />
    <Lines x={270} y={288} anchor="middle" lines={['never touch chemicals, even with gloves on']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function Dilute() {
  return <WsDiagram title="Left: a small bottle of concentrated acid is poured slowly into a large beaker of water: the safe way. Right, faded: water being poured into concentrated acid, which could get very hot.">
    <Beaker x={150} base={250} w={150} h={130} level={160} />
    <g transform="rotate(-118 116 96)"><Bottle x={116} base={166} h={70} w={46} fill="#fbe6d2" line="#b0601c" cap={false} /></g>
    <path d="M116 98Q112 124 114 158" stroke="#e9b98f" strokeWidth="5" fill="none" />
    <Lines x={196} y={40} lines={['concentrated', 'acid']} size={14} colour={tones.measure.text} />
    <Leader from={[192, 44]} to={[168, 60]} colour={tones.measure.text} />
    <Tick x={70} y={206} />
    <Lines x={150} y={282} anchor="middle" lines={['concentrated into the water']} size={14} colour={tones.good.text} />
    <g opacity={faded + 0.15}>
      <Beaker x={420} base={250} w={90} h={90} level={206} fill="#fbe6d2" line="#b0601c" />
      <g transform="rotate(-70 450 92)"><Beaker x={450} base={100} w={54} h={60} level={62} spout={false} /></g>
      <path d="M404 116Q398 150 400 200" stroke={lab.water} strokeWidth="5" fill="none" />
      <Heat x={420} y={196} n={3} />
    </g>
    <Cross x={496} y={206} />
    <Lines x={420} y={282} anchor="middle" lines={['never water into acid']} size={14} colour={tones.bad.text} />
  </WsDiagram>
}

/* ---------- Section 3: equipment ---------- */

/** A clamp stand holding a pulley, a string over it and a small hanging mass. (x, base) = foot of the rod. */
function ClampPulley({ x, base, massY = 180, masses = 2 }: { x: number; base: number; massY?: number; masses?: number }) {
  const px = x + 150, py = base - 206
  return <g>
    <rect x={x - 40} y={base - 12} width="120" height="12" rx="4" fill={W.metal} stroke={W.metalLine} strokeWidth="2" />
    <rect x={x - 4} y={base - 232} width="8" height="222" rx="3" fill="#c3ccd4" stroke={W.metalLine} strokeWidth="1.8" />
    <rect x={x - 11} y={py - 10} width="22" height="20" rx="4" fill="#9aa6b1" stroke={W.metalLine} strokeWidth="1.8" />
    <path d={`M${x + 11} ${py}H${px - 14}`} stroke={W.metalLine} strokeWidth="6" />
    <circle cx={px} cy={py} r="16" fill={W.metal} stroke={W.metalLine} strokeWidth="2.2" />
    <circle cx={px} cy={py} r="4" fill={W.metalLine} />
    {/* string over the pulley: tied to the rod on the left, hanging mass on the right */}
    <path d={`M${x + 6} ${py - 20}Q${px - 60} ${py - 17} ${px} ${py - 16}Q${px + 16} ${py - 16} ${px + 16} ${py}V${massY - 12}`} fill="none" stroke="#8a6a3a" strokeWidth="1.8" />
    <path d={`M${px + 16} ${massY - 12}V${massY}`} stroke={W.metalLine} strokeWidth="2.4" />
    {Array.from({ length: masses }, (_, i) => <rect key={i} x={px} y={massY + i * 10} width="32" height="10" rx="3" fill="#b8a07a" stroke="#7f6841" strokeWidth="1.8" />)}
  </g>
}
function Clamp() {
  const base = 266, massY = 176
  return <WsDiagram title="A clamp stand holds a pulley. A string runs over the pulley to a small hanging mass, which stays well above the floor.">
    <Bench x1={20} x2={520} y={base} />
    <ClampPulley x={120} base={base} massY={massY} />
    <path d={`M286 ${massY + 26}V${base - 4}`} stroke={tones.good.line} strokeWidth="2" strokeDasharray="5 5" />
    <Lines x={62} y={46} anchor="end" lines={['clamp', 'stand']} size={14} />
    <Leader from={[66, 42]} to={[116, 70]} />
    <Lines x={346} y={200} lines={['not too heavy']} size={14} />
    <Leader from={[342, 196]} to={[304, 186]} />
    <Lines x={346} y={130} lines={['not too long:', 'the mass stays', 'off the floor']} size={14} />
    <Leader from={[342, 126]} to={[288, 120]} />
    <Tick x={318} y={236} s={0.85} />
  </WsDiagram>
}
/** An immersion heater standing upright; `drip` shows liquid dripping out as it dries. */
function ImmersionHeater({ x, base }: { x: number; base: number }) {
  return <g>
    <rect x={x - 11} y={base - 120} width="22" height="116" rx="8" fill="#c3ccd4" stroke={W.metalLine} strokeWidth="2" />
    <rect x={x - 14} y={base - 132} width="28" height="18" rx="4" fill="#3b4652" />
    <path d={`M${x} ${base - 132}C${x} ${base - 160} ${x + 40} ${base - 150} ${x + 50} ${base - 170}`} fill="none" stroke="#3b4652" strokeWidth="4" />
    <path d={`M${x - 5} ${base - 100}V${base - 12}M${x + 5} ${base - 100}V${base - 12}`} stroke={W.metalLine} strokeWidth="1.2" opacity=".7" />
  </g>
}
function HeatFig() {
  return <WsDiagram title="Left: a hot beaker on a heat-proof mat; let it cool, or handle it with insulated gloves. Right: an immersion heater is left to dry out in the air, in case liquid has leaked inside it.">
    <Bench x1={20} x2={520} y={262} />
    <rect x={60} y={252} width={170} height="10" rx="3" fill="#dcd6cc" stroke="#8f887c" strokeWidth="1.6" />
    <Beaker x={150} base={252} w={90} h={96} level={180} fill="#dfeef7" />
    <Heat x={150} y={144} n={3} />
    <Hand x={216} y={214} rotate={180} insulated s={1} />
    <Lines x={150} y={50} anchor="middle" lines={['let it cool, or use', 'insulated gloves']} size={14} />
    <path d="M300 30V270" stroke={W.panelLine} strokeWidth="1.6" strokeDasharray="4 6" />
    <ImmersionHeater x={410} base={260} />
    <Lines x={410} y={50} anchor="middle" lines={['immersion heater:', 'dry out in air']} size={14} />
    {[[430, 218], [436, 236]].map(([cx, cy], i) => <path key={i} d={`M${cx} ${cy - 6}Q${cx + 5} ${cy + 2} ${cx} ${cy + 4}Q${cx - 5} ${cy + 2} ${cx} ${cy - 6}Z`} fill={lab.water} stroke={lab.waterLine} strokeWidth="1.2" />)}
  </WsDiagram>
}
function Electric() {
  const L = 110, R = 430, T = 80, B = 220
  return <WsDiagram title="A simple circuit with one cell and a lamp. Using a low voltage and a low current keeps the wires cool and stops the components being damaged.">
    <Wire points={[[270, T], [R, T], [R, B], [L, B], [L, T], [270, T]]} />
    <Cell x={270} y={T} length={64} />
    <Lamp x={R} y={150} rotate={90} length={64} lit />
    <Tag x={270} y={36} text="low voltage and current" tone="mark" size={14} strong />
    <Tag x={270} y={B + 42} text="wires stay cool" tone="change" size={14} />
    <Leader from={[270, B + 28]} to={[270, B + 3]} colour={tones.change.line} />
    <Lines x={R + 30} y={140} lines={['lamp not', 'damaged']} size={13} colour={tones.good.text} />
    <Tick x={R + 50} y={182} s={0.8} />
  </WsDiagram>
}

/* ---------- Section 4: ethics ---------- */

function Woodlouse({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
    <path d="M13 -3q6 -6 10 -6M13 3q6 6 10 6" stroke="#4f5a64" strokeWidth="1.3" fill="none" />
    <ellipse rx="15" ry="8.5" fill="#9aa4ae" stroke="#4f5a64" strokeWidth="1.6" />
    {[-8, -3, 2, 7].map(dx => <path key={dx} d={`M${dx} -8Q${dx - 2} 0 ${dx} 8`} stroke="#4f5a64" strokeWidth="1" fill="none" />)}
  </g>
}
function Snail({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-18 6Q-4 2 18 6Q20 9 16 10H-16Q-20 9 -18 6Z" fill="#b6a58c" stroke="#7d6b52" strokeWidth="1.4" />
    <path d="M14 6q2 -8 5 -12M17 6q4 -6 8 -8" stroke="#7d6b52" strokeWidth="1.3" fill="none" />
    <circle cx="-3" cy="-4" r="11" fill="#c98e5a" stroke="#8a5a31" strokeWidth="1.8" />
    <path d="M-3 -4m-6 0a6 6 0 1 1 6 6a3 3 0 1 1 -1 -5" fill="none" stroke="#8a5a31" strokeWidth="1.5" />
  </g>
}
function Leaf({ x, y, a = 0, len = 60, fill = W.plant, line = W.plantLine }: { x: number; y: number; a?: number; len?: number; fill?: string; line?: string }) {
  return <g transform={`translate(${x} ${y}) rotate(${a})`}>
    <path d={`M0 0C${len * 0.3} -${len * 0.34} ${len * 0.75} -${len * 0.32} ${len} 0C${len * 0.75} ${len * 0.3} ${len * 0.3} ${len * 0.32} 0 0Z`} fill={fill} stroke={line} strokeWidth="1.8" />
    <path d={`M2 0H${len * 0.85}`} stroke={line} strokeWidth="1.2" opacity=".7" />
  </g>
}
function Animals() {
  return <WsDiagram title="Left: a woodlouse carried gently on a leaf held in the hand. Right: a roomy tank with soil, leaves and bark, where a few woodlice have plenty of space.">
    <Leaf x={70} y={170} a={-8} len={120} fill="#d9c48f" line="#9c8546" />
    <Woodlouse x={128} y={158} a={-8} />
    <Hand x={96} y={196} rotate={-8} s={1.1} />
    <Lines x={130} y={60} anchor="middle" lines={['handle carefully']} size={15} />
    {/* tank */}
    <rect x={272} y={96} width={240} height={160} rx="10" fill="#eef6fb" stroke={W.glassLine} strokeWidth="2.4" />
    <path d="M266 92H518" stroke={W.metalLine} strokeWidth="5" />
    {[300, 340, 380, 420, 460].map(x => <circle key={x} cx={x + 10} cy={92} r="1.6" fill="white" />)}
    <path d="M274 216Q330 206 392 214T510 210V246Q510 254 502 254H282Q274 254 274 246Z" fill={W.soil} stroke={W.soilLine} strokeWidth="1.6" />
    <path d="M300 214q20 -10 60 -6" stroke="#8d6a4b" strokeWidth="7" fill="none" />
    <Leaf x={410} y={210} a={-160} len={44} fill="#d9c48f" line="#9c8546" />
    <Leaf x={440} y={212} a={-20} len={50} />
    <Woodlouse x={336} y={196} s={0.8} a={6} />
    <Woodlouse x={470} y={196} s={0.8} a={-10} />
    <Lines x={392} y={60} anchor="middle" lines={['plenty of space']} size={15} />
    <Tick x={392} y={282} s={0.8} />
  </WsDiagram>
}
function Return() {
  return <WsDiagram title="A tray of pond snails caught for a study, with an arrow showing them being returned to the pond they came from.">
    <path d="M40 206H240L230 244Q228 250 222 250H58Q52 250 50 244Z" fill="white" stroke={W.metalLine} strokeWidth="2.2" />
    <path d="M52 216H228L224 240H56Z" fill={lab.water} opacity=".7" />
    <Snail x={90} y={220} />
    <Snail x={146} y={226} s={0.9} />
    <Snail x={196} y={218} s={0.85} />
    <Lines x={140} y={280} anchor="middle" lines={['after the study']} size={13} weight={650} colour={muted} />
    <Arrow from={[200, 150]} to={[340, 150]} width={3} bend={-0.18} />
    <path d={blob(430, 220, 96, 38, 4, 0.06, 12)} fill={lab.water} stroke={lab.waterLine} strokeWidth="2" />
    {[350, 364, 500, 512].map((x, i) => <path key={x} d={`M${x} 214Q${x + (i % 2 ? 4 : -4)} 170 ${x + (i % 2 ? 8 : -6)} ${140 + i * 6}`} stroke={W.plantLine} strokeWidth="3" fill="none" />)}
    <Snail x={420} y={226} s={0.9} />
    <Lines x={430} y={282} anchor="middle" lines={['back to their habitat']} size={14} colour={tones.good.text} />
    <Tag x={270} y={40} text="return wild animals" tone="good" size={14} strong />
  </WsDiagram>
}
function Bubble({ x, y, w, text, tail, tone = 'plain' }: { x: number; y: number; w: number; text: string[]; tail: Pt; tone?: 'plain' | 'good' | 'bad' }) {
  const c = tones[tone], h = 18 + text.length * 18
  return <g>
    <path d={`M${x + 20} ${y + h - 2}L${tail[0]} ${tail[1]}L${x + 44} ${y + h - 2}`} fill={tone === 'plain' ? 'white' : c.fill} stroke={c.line} strokeWidth="2" />
    <rect x={x} y={y} width={w} height={h} rx="14" fill={tone === 'plain' ? 'white' : c.fill} stroke={c.line} strokeWidth="2" />
    <path d={`M${x + 21} ${y + h - 2}H${x + 43}`} stroke={tone === 'plain' ? 'white' : c.fill} strokeWidth="3" />
    <Lines x={x + w / 2} y={y + 24} anchor="middle" lines={text} size={14} colour={c.text} />
  </g>
}
function People() {
  return <WsDiagram schematic={false} title="A student asks classmates, 'Are you happy to take part?' One says yes. Another raises a hand and says no, and that is fine.">
    <Bust x={100} y={260} s={1.6} kind={0} />
    <Bubble x={20} y={36} w={190} text={['Are you happy', 'to take part?']} tail={[96, 150]} />
    <Bust x={300} y={260} s={1.6} kind={2} />
    <Bubble x={250} y={78} w={100} text={['Yes!']} tail={[296, 150]} tone="good" />
    <path d="M462 222Q476 190 478 146" stroke={W.kinetic} strokeWidth="14" fill="none" />
    <path d="M462 222Q476 190 478 146" stroke={W.kineticLine} strokeWidth="2" fill="none" opacity=".0" />
    <ellipse cx={478} cy={136} rx="9" ry="12" fill={W.skin} stroke={W.skinLine} strokeWidth="1.8" />
    <Bust x={440} y={260} s={1.6} kind={1} />
    <Bubble x={356} y={36} w={116} text={['No, thanks']} tail={[420, 150]} tone="bad" />
    <Lines x={270} y={292} anchor="middle" lines={['anyone can say no']} size={14} weight={650} colour={muted} />
  </WsDiagram>
}

/* ---------- On your own: the bench scene ---------- */

function Cell4({ x, y, n, children }: { x: number; y: number; n: number; children: ReactNode }) {
  return <g>
    <rect x={x} y={y} width={252} height={138} rx="14" fill={W.panel} stroke={W.panelLine} strokeWidth="1.8" />
    <g transform={`translate(${x} ${y})`}>{children}</g>
    <circle cx={x + 22} cy={y + 22} r="14" fill="white" stroke={ink} strokeWidth="2" />
    <text x={x + 22} y={y + 27} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>{n}</text>
  </g>
}
function QScene() {
  return <WsDiagram title="A lab bench scene with four numbered parts.">
    {/* 1: goggles on, pouring through a funnel */}
    <Cell4 x={12} y={10} n={1}>
      <Bust x={66} y={132} s={1.2} kind={3} />
      <Goggles x={66} y={-42 * 1.2 + 132} s={1.2} />
      <Flask cx={190} base={130} h={62} w={62} level={18} />
      <Funnel x={190} y={92} w={40} />
      <g transform="rotate(-62 150 30)"><Beaker x={150} base={52} w={34} h={36} level={28} spout={false} /></g>
      <path d="M170 34Q180 38 182 50V90" stroke={lab.water} strokeWidth="4" fill="none" />
    </Cell4>
    {/* 2: a spatula moving a solid */}
    <Cell4 x={276} y={10} n={2}>
      <Beaker x={170} base={128} w={64} h={52} />
      <Spatula from={[70, 50]} to={[160, 70]} />
      <Hand x={84} y={58} rotate={14} glove s={0.75} />
      {[[170, 84], [168, 98]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="2.2" fill="white" stroke="#9fb0bd" strokeWidth="1.1" />)}
    </Cell4>
    {/* 3: a bare hand on a hot beaker */}
    <Cell4 x={12} y={154} n={3}>
      <rect x={70} y={122} width={130} height="8" rx="3" fill="#dcd6cc" stroke="#8f887c" strokeWidth="1.4" />
      <Beaker x={136} base={122} w={62} h={66} level={76} fill="#dfeef7" />
      <Heat x={136} y={52} n={3} />
      <Hand x={181} y={96} rotate={180} s={0.8} />
    </Cell4>
    {/* 4: a clamp stand holding a light mass */}
    <Cell4 x={276} y={154} n={4}>
      <g transform="translate(20 8) scale(0.55)"><ClampPulley x={120} base={228} massY={150} masses={1} /></g>
      <path d="M20 134H230" stroke={W.panelLine} strokeWidth="2.4" />
    </Cell4>
  </WsDiagram>
}

export function WsSafetyVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  void Bubbles
  switch (focus) {
    case 'wssafety-clothing': return <Clothing />
    case 'wssafety-hazard': return <Hazard />
    case 'wssafety-fume': return <Fume />
    case 'wssafety-transfer': return <Transfer />
    case 'wssafety-dilute': return <Dilute />
    case 'wssafety-clamp': return <Clamp />
    case 'wssafety-heat': return <HeatFig />
    case 'wssafety-electric': return <Electric />
    case 'wssafety-animals': return <Animals />
    case 'wssafety-return': return <Return />
    case 'wssafety-people': return <People />
    case 'wssafety-q-scene': return <QScene />
    default: return null
  }
}
void r1

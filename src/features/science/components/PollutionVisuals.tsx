import type { ReactNode } from 'react'
import { blob } from './InfectionVisuals'
import { footprintPalette as P, Diagram, Lines, Caption, Arrow, Panel, Puff, Sun, Cloud, Flame, Works, Person, Tree } from './FootprintVisuals'

/*
 * Chemistry Lesson 48: Air pollution. Original, code-native schematics; not to scale. Focus ids start with 'pollute-'.
 * The drawing kit (puffs, Sun, clouds, chimneys, people, flames) is shared with Lesson 47 (FootprintVisuals.tsx).
 *
 * Colour code (as the rest of the course):
 *   purple puff = carbon dioxide; blue puff = water vapour; teal = oxygen; yellow = the Sun and its light
 *   pale grey-lilac puff = carbon monoxide (kept clearly paler and greyer than purple carbon dioxide)
 *   dark grey specks = soot particles (particulates); tan drop and beads = hydrocarbon fuel (as in the crude oil lessons)
 *   yellow-green = sulfur and sulfur dioxide; soft brown = oxides of nitrogen; blue-grey = nitrogen
 */
const { ink, muted, faded, panelLine, purple, purpleInk, sunLine, leafLine, grass, sky, buildLine, skin, skinLine, jumper, amber, amberFill } = P
const teal = '#2f9c95', tealFill = '#d5efec'
const water = '#55acd0', waterFill = '#dcf0f8', waterInk = '#2f7fa8'
const coFill = '#eeecf2', coLine = '#9a93aa', coInk = '#6f6882'
const soot = '#4a4540'
const fuel = '#e3c9a3', fuelLine = '#8a6440'
const sFill = '#eef2c4', sLine = '#9aa23a', sInk = '#6d7318'
const nFill = '#f6e2cc', nLine = '#b3773f', nInk = '#8a5a2b'
const nitro = '#e1e7f0', nitroLine = '#6f86a6'
const cell = '#e8837a', cellLine = '#b4524a', cellMid = '#f2aaa2', vessel = '#fbe7e2', vesselLine = '#d59a90'
const lung = '#f8dcd8', lungLine = '#c98a84', airway = '#e5aaa2'
const coal = '#5b6167', coalLine = '#3c4146'

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

// ---------- Small pieces ----------
const Co2 = ({ x, y, r = 14, opacity = 1 }: { x: number; y: number; r?: number; opacity?: number }) => <Puff x={x} y={y} r={r} opacity={opacity} />
const Vapour = ({ x, y, r = 14, opacity = 1 }: { x: number; y: number; r?: number; opacity?: number }) => <Puff x={x} y={y} r={r} opacity={opacity} fill={waterFill} line={water} />
const CoPuff = ({ x, y, r = 14, opacity = 1 }: { x: number; y: number; r?: number; opacity?: number }) => <Puff x={x} y={y} r={r} opacity={opacity} fill={coFill} line={coLine} />
const So2 = ({ x, y, r = 14 }: { x: number; y: number; r?: number }) => <Puff x={x} y={y} r={r} fill={sFill} line={sLine} />
const Nox = ({ x, y, r = 14 }: { x: number; y: number; r?: number }) => <Puff x={x} y={y} r={r} fill={nFill} line={nLine} />
const O2Puff = ({ x, y, r = 14 }: { x: number; y: number; r?: number }) => <Puff x={x} y={y} r={r} fill={tealFill} line={teal} />
function Pair({ x, y, letter, fill, line, r = 9, rot = 0 }: { x: number; y: number; letter: string; fill: string; line: string; r?: number; rot?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${rot})`}>{[-r * .85, r * .85].map(d => <g key={d}><circle cx={r1(d)} cy={0} r={r} fill={fill} stroke={line} strokeWidth="1.6" /><text x={r1(d)} y={4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill={line} transform={`rotate(${-rot} ${r1(d)} 0)`}>{letter}</text></g>)}</g>
}
const O2 = ({ x, y, r = 5, rot = 0 }: { x: number; y: number; r?: number; rot?: number }) => <g transform={`translate(${x} ${y}) rotate(${rot})`}>{[-r * .85, r * .85].map(d => <circle key={d} cx={r1(d)} cy={0} r={r} fill={tealFill} stroke={teal} strokeWidth="1.5" />)}</g>
function Specks({ pts, r = 3.2, opacity = 1 }: { pts: Pt[]; r?: number; opacity?: number }) {
  return <g opacity={opacity}>{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r * (i % 3 === 1 ? .75 : 1)} fill={soot} />)}</g>
}
function Drop({ x, y, s = 1, fill = fuel, line = fuelLine }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -14C5 -6 9 -1 9 4A9 9 0 0 1 -9 4C-9 -1 -5 -6 0 -14Z" fill={fill} stroke={line} strokeWidth={1.6 / s} />
}
function Beads({ x, y, n = 6, gap = 13, r = 5 }: { x: number; y: number; n?: number; gap?: number; r?: number }) {
  const pts = Array.from({ length: n }, (_, i) => [x + i * gap, y + (i % 2 ? -3 : 3)] as Pt)
  return <g>{pts.slice(1).map((p, i) => <path key={i} d={`M${pts[i][0]} ${pts[i][1]}L${p[0]} ${p[1]}`} stroke={fuelLine} strokeWidth="2" />)}{pts.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={fuel} stroke={fuelLine} strokeWidth="1.5" />)}</g>
}
// A burner: a short tube with a flame on top. Sooty flames are smaller and give off dark smoke.
function Burner({ x, y, s = 3, sooty = false }: { x: number; y: number; s?: number; sooty?: boolean }) {
  return <g>
    <rect x={x - 12} y={y} width={24} height={34} rx="4" fill="#cfd8df" stroke={buildLine} strokeWidth="1.6" />
    <rect x={x - 26} y={y + 34} width={52} height={10} rx="4" fill="#b7c3cc" stroke={buildLine} strokeWidth="1.6" />
    {!sooty && <ellipse cx={x} cy={y - 4} rx={9} ry={5} fill="#9fc6ea" opacity=".9" />}
    <Flame x={x} y={y} s={s} sooty={sooty} />
    {sooty && <g><path d={`M${x - 4} ${y - 22 * s - 2}q-8 -10 0 -20t0 -20M${x + 8} ${y - 22 * s + 2}q-7 -9 0 -18t0 -18`} stroke="#6b6560" strokeWidth="3" fill="none" opacity=".6" />
      <Specks pts={[[x - 12, y - 22 * s - 20], [x + 14, y - 22 * s - 30], [x + 2, y - 22 * s - 44], [x - 8, y - 22 * s - 52]]} r={2.6} /></g>}
  </g>
}
function Coal({ x, y, s = 1, children }: { x: number; y: number; s?: number; children?: ReactNode }) {
  return <g><path d={blob(x, y, 42 * s, 30 * s, 7, .14, .8, 9)} fill={coal} stroke={coalLine} strokeWidth="1.8" />
    <path d={`M${x - 20 * s} ${y - 12 * s}l14 -8l10 10`} stroke="#8a9096" strokeWidth="2" fill="none" />{children}</g>
}
function Drum({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 26} ${y - 34}V${y + 30}A26 8 0 0 0 ${x + 26} ${y + 30}V${y - 34}Z`} fill="#6e7a86" stroke="#48525c" strokeWidth="1.8" />
    <ellipse cx={x} cy={y - 34} rx={26} ry={8} fill="#8994a0" stroke="#48525c" strokeWidth="1.8" />
    <path d={`M${x - 26} ${y - 10}A26 8 0 0 0 ${x + 26} ${y - 10}M${x - 26} ${y + 12}A26 8 0 0 0 ${x + 26} ${y + 12}`} stroke="#48525c" strokeWidth="1.5" fill="none" />
    <Drop x={x} y={y + 2} s={.9} /></g>
}
function Lungs({ x, y, s = 1, specks = false }: { x: number; y: number; s?: number; specks?: boolean }) {
  const w = 1.8 / s
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 -40C-44 -44 -62 -4 -60 34C-58 58 -38 66 -16 56C-8 52 -6 40 -6 28V-14Z" fill={lung} stroke={lungLine} strokeWidth={w} />
    <path d="M10 -40C44 -44 62 -4 60 34C58 58 38 66 16 56C8 52 6 40 6 28V-14Z" fill={lung} stroke={lungLine} strokeWidth={w} />
    <path d="M0 -76V-18M0 -18Q-10 -8 -24 -4M-24 -4Q-34 6 -38 22M-24 -4Q-30 10 -24 30M-38 22L-44 36M0 -18Q10 -8 24 -4M24 -4Q34 6 38 22M24 -4Q30 10 24 30M38 22L44 36" stroke={airway} strokeWidth={5 / s} fill="none" />
    <path d="M0 -76V-18" stroke={lungLine} strokeWidth={9 / s} opacity=".35" />
    {specks && <Specks pts={[[-24, -4], [-36, 18], [-26, 28], [-43, 34], [25, -3], [37, 20], [24, 28], [44, 35], [-31, 8], [30, 9]]} r={2.8} />}
  </g>
}
function Eye({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 22} ${y}Q${x} ${y - 20} ${x + 22} ${y}Q${x} ${y + 20} ${x - 22} ${y}Z`} fill="white" stroke={ink} strokeWidth="1.8" /><circle cx={x} cy={y} r="7" fill="#7fb0d4" stroke={ink} strokeWidth="1.4" /><circle cx={x} cy={y} r="2.6" fill={ink} /></g>
}
function Nose({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 4} ${y - 22}C${x - 2} ${y - 10} ${x + 12} ${y + 4} ${x + 10} ${y + 10}C${x + 8} ${y + 16} ${x - 2} ${y + 16} ${x - 8} ${y + 10}`} fill={skin} stroke={skinLine} strokeWidth="2" />
    <path d={`M${x + 16} ${y - 10}q6 -4 12 0M${x + 18} ${y}q6 -4 12 0`} stroke={muted} strokeWidth="1.8" fill="none" /></g>
}
const Strike = ({ x, y, r = 24 }: { x: number; y: number; r?: number }) => <path d={`M${x - r} ${y + r}L${x + r} ${y - r}`} stroke={P.red} strokeWidth="4" opacity=".85" />

// ---------- Section 1: what is released when fuels burn ----------
function Fuels() {
  return <Diagram title="Fossil fuels such as crude oil and coal contain hydrocarbons. Hydrocarbons burn in oxygen.">
    <Drum x={70} y={96} />
    <Beads x={132} y={96} n={6} />
    <text x={70} y={160} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>crude oil</text>
    <Coal x={70} y={218} s={.85} />
    <Beads x={132} y={218} n={6} />
    <text x={70} y={268} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>coal</text>
    <Lines x={132} y={146} lines={['hydrocarbons']} size={13} weight={600} colour={fuelLine} />
    <Arrow from={[212, 104]} to={[300, 160]} />
    <Arrow from={[212, 214]} to={[300, 200]} />
    <Burner x={350} y={206} s={3.2} />
    <O2Puff x={476} y={124} r={20} />
    <text x={476} y={164} textAnchor="middle" fontSize="14" fontWeight="700" fill={teal}>oxygen</text>
    <Arrow from={[450, 146]} to={[392, 176]} colour={teal} />
    <Caption y={290} text="Hydrocarbons burn in oxygen" />
  </Diagram>
}
function TwoTypes() {
  return <Diagram title="Two types of combustion. Complete combustion: plenty of oxygen, so all the fuel burns. Incomplete combustion: not enough oxygen, so some of the fuel does not burn.">
    <Panel x={16} y={14} w={246} h={272} />
    <Panel x={278} y={14} w={246} h={272} />
    <text x={139} y={42} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Complete combustion</text>
    <text x={401} y={42} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Incomplete combustion</text>
    <Burner x={139} y={180} s={3.4} />
    {([[64, 112, 104, 132], [214, 112, 174, 132], [64, 170, 106, 170], [214, 170, 172, 170]] as number[][]).map(([x1, y1, x2, y2], i) => <g key={i}><O2 x={x1} y={y1} /><Arrow from={[x1 + (x2 > x1 ? 10 : -10), y1 + (y2 - y1) * .2]} to={[x2, y2]} colour={teal} width={2} /></g>)}
    <Burner x={401} y={180} s={2.4} sooty />
    <O2 x={332} y={160} /><Arrow from={[342, 162]} to={[380, 168]} colour={teal} width={2} />
    <Lines x={139} y={248} anchor="middle" lines={['plenty of oxygen:', 'all the fuel burns']} size={13} />
    <Lines x={401} y={248} anchor="middle" lines={['not enough oxygen: some', 'fuel does not burn']} size={13} />
  </Diagram>
}
function Both() {
  return <Diagram title="Both complete and incomplete combustion release carbon dioxide and water vapour.">
    <Burner x={270} y={200} s={3.2} />
    <Arrow from={[252, 118]} to={[180, 92]} colour={purple} width={3} />
    <Arrow from={[288, 118]} to={[360, 92]} colour={water} width={3} />
    <Co2 x={134} y={78} r={26} />
    <Vapour x={406} y={78} r={26} />
    <text x={134} y={128} textAnchor="middle" fontSize="15" fontWeight="700" fill={purpleInk}>carbon dioxide</text>
    <text x={406} y={128} textAnchor="middle" fontSize="15" fontWeight="700" fill={waterInk}>water vapour</text>
    <Caption y={284} text="Both types release these two" />
  </Diagram>
}
function Incomplete() {
  return <Diagram title="Incomplete combustion also releases soot particles, called particulates, unburnt fuel and carbon monoxide gas, as well as carbon dioxide and water vapour.">
    <Burner x={130} y={204} s={2.8} sooty />
    <g opacity={faded + .1}><Co2 x={60} y={50} r={15} /><Vapour x={106} y={40} r={14} /><text x={84} y={84} textAnchor="middle" fontSize="12" fontWeight="600" fill={muted}>same two as before</text></g>
    <Arrow from={[176, 120]} to={[268, 70]} />
    <Arrow from={[180, 150]} to={[268, 146]} />
    <Arrow from={[176, 180]} to={[268, 222]} />
    <Specks pts={[[292, 62], [306, 72], [318, 58], [300, 84], [322, 80], [334, 66], [312, 94]]} r={4} />
    <Lines x={352} y={66} lines={['soot particles', '(particulates)']} />
    <Drop x={306} y={146} s={1.3} />
    <Lines x={352} y={152} lines={['unburnt fuel']} />
    <CoPuff x={306} y={226} r={20} />
    <Lines x={352} y={222} lines={['carbon monoxide,', 'CO']} colour={coInk} />
    <Caption y={288} text="Extra products when oxygen is short" />
  </Diagram>
}
function Compare() {
  const row = (x: number, y: number, icon: ReactNode, name: string, colour = ink) => <g key={name + x}>{icon}<text x={x + 58} y={y + 5} fontSize="14" fontWeight="700" fill={colour}>{name}</text></g>
  const common = (x: number) => [
    row(x, 84, <Co2 x={x + 30} y={84} r={11} />, 'carbon dioxide', purpleInk),
    row(x, 124, <Vapour x={x + 30} y={124} r={11} />, 'water vapour', waterInk),
  ]
  return <Diagram title="Side by side. Complete combustion releases carbon dioxide and water vapour only. Incomplete combustion releases those two plus carbon monoxide, soot particles and unburnt fuel.">
    <Panel x={16} y={20} w={246} h={250} />
    <Panel x={278} y={20} w={246} h={250} />
    <text x={139} y={50} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Complete</text>
    <text x={401} y={50} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Incomplete</text>
    {common(30)}{common(292)}
    <rect x={288} y={148} width={226} height={114} rx="14" fill={amberFill} opacity=".55" />
    <text x={504} y={166} textAnchor="end" fontSize="12" fontWeight="700" fill={amber}>extra</text>
    {row(292, 178, <CoPuff x={322} y={178} r={11} />, 'carbon monoxide', coInk)}
    {row(292, 214, <Specks pts={[[312, 210], [322, 218], [330, 208], [318, 224], [334, 222]]} r={3.4} />, 'soot')}
    {row(292, 248, <Drop x={322} y={250} />, 'unburnt fuel')}
    <Caption y={292} text="Incomplete combustion adds three extras" />
  </Diagram>
}

// ---------- Section 2: why carbon monoxide and particulates are harmful ----------
function RedCell({ x, y, o2 = false, co = false }: { x: number; y: number; o2?: boolean; co?: boolean }) {
  return <g><ellipse cx={x} cy={y} rx={17} ry={12} fill={cell} stroke={cellLine} strokeWidth="1.6" /><ellipse cx={x} cy={y} rx={8} ry={5} fill={cellMid} />
    {o2 && <O2 x={x + 1} y={y - 14} r={4.5} />}{co && <CoPuff x={x + 2} y={y - 15} r={9} />}</g>
}
function CoBlood() {
  const xs = [118, 190, 262, 334, 406]
  const tube = (y: number) => <g><rect x={70} y={y - 34} width={400} height={68} rx="34" fill={vessel} stroke={vesselLine} strokeWidth="2" /><Arrow from={[480, y]} to={[512, y]} colour={vesselLine} width={2.2} /></g>
  return <Diagram title="Red blood cells carry oxygen. With carbon monoxide, carbon monoxide sits on many of the cells, so fewer cells carry oxygen. Carbon monoxide stops the blood carrying enough oxygen.">
    <text x={70} y={30} fontSize="14" fontWeight="700" fill={ink}>normal blood</text>
    {tube(72)}{xs.map(x => <RedCell key={x} x={x} y={80} o2 />)}
    <text x={70} y={148} fontSize="14" fontWeight="700" fill={ink}>with carbon monoxide</text>
    {tube(190)}{xs.map((x, i) => <RedCell key={x} x={x} y={198} o2={i === 1 || i === 4} co={!(i === 1 || i === 4)} />)}
    <O2 x={96} y={252} r={5} /><text x={110} y={257} fontSize="13" fontWeight="600" fill={teal}>oxygen</text>
    <CoPuff x={206} y={252} r={9} /><text x={222} y={257} fontSize="13" fontWeight="600" fill={coInk}>carbon monoxide</text>
    <Caption y={288} text="Carbon monoxide stops the blood carrying enough oxygen" />
  </Diagram>
}
function OxygenBar({ x, y, level, dim = false }: { x: number; y: number; level: number; dim?: boolean }) {
  return <g opacity={dim ? .5 : 1}><rect x={x} y={y} width={112} height={14} rx="7" fill="white" stroke={teal} strokeWidth="1.6" /><rect x={x + 2} y={y + 2} width={Math.max(4, 108 * level)} height={10} rx="5" fill={teal} opacity=".75" /></g>
}
function CoEffects() {
  return <Diagram title="Without enough oxygen in the blood, a person can faint, can go into a coma, or can even die.">
    {[20, 190, 360].map(x => <Panel key={x} x={x} y={30} w={160} h={210} />)}
    {/* fainting: a person sitting down, hand to head */}
    <path d="M64 170H134V178H64Z" fill="#d9c9b0" stroke="#a58a6a" strokeWidth="1.5" />
    <g transform="rotate(-10 100 170)"><Person x={100} y={172} s={.85} arms="head" /></g>
    {/* coma: lying still in a bed */}
    <rect x={212} y={150} width={118} height={22} rx="6" fill="#e4e9ee" stroke={buildLine} strokeWidth="1.6" />
    <path d="M214 172V186M328 172V186" stroke={buildLine} strokeWidth="3" />
    <rect x={216} y={134} width={30} height={16} rx="7" fill="white" stroke={buildLine} strokeWidth="1.4" />
    <circle cx={236} cy={130} r="11" fill={skin} stroke={skinLine} strokeWidth="1.6" />
    <path d="M248 150V138Q248 130 258 130H320Q326 130 326 138V150Z" fill={jumper} stroke={ink} strokeWidth="1.6" />
    {/* even death: a calm, plain fading bar */}
    <rect x={424} y={72} width={32} height={100} rx="16" fill="white" stroke={teal} strokeWidth="1.8" opacity=".6" />
    <rect x={428} y={162} width={24} height={6} rx="3" fill={teal} opacity=".5" />
    {[['fainting', 100, .55], ['coma', 270, .25], ['even death', 440, .04]].map(([t, x, l]) => <g key={t as string}>
      <text x={x as number} y={206} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{t}</text>
      <OxygenBar x={(x as number) - 56} y={218} level={l as number} />
    </g>)}
    <Arrow from={[174, 135]} to={[196, 135]} colour={muted} width={2} /><Arrow from={[344, 135]} to={[366, 135]} colour={muted} width={2} />
    <text x={270} y={262} textAnchor="middle" fontSize="13" fontWeight="600" fill={teal}>oxygen in the blood</text>
    <Caption y={290} text="Less and less oxygen reaches the body" />
  </Diagram>
}
function CoDetect() {
  return <Diagram title="Carbon monoxide has no colour and no smell, so it is very hard to detect. Some homes have a carbon monoxide alarm.">
    <rect x={20} y={20} width={500} height={220} rx="16" fill="#f8f5ef" stroke={panelLine} strokeWidth="1.6" />
    <path d="M20 220H520" stroke="#d9c9b0" strokeWidth="3" />
    <Person x={100} y={220} s={1.2} />
    <CoPuff x={162} y={96} r={16} opacity={.8} /><CoPuff x={190} y={130} r={12} opacity={.8} /><CoPuff x={150} y={146} r={10} opacity={.8} />
    <Lines x={150} y={60} anchor="middle" lines={['carbon monoxide']} size={13} weight={600} colour={coInk} />
    <Eye x={276} y={96} /><Strike x={276} y={96} />
    <text x={310} y={101} fontSize="15" fontWeight="700" fill={ink}>no colour</text>
    <Nose x={270} y={170} /><Strike x={276} y={166} />
    <text x={310} y={175} fontSize="15" fontWeight="700" fill={ink}>no smell</text>
    <rect x={432} y={60} width={62} height={62} rx="16" fill="white" stroke={ink} strokeWidth="2" />
    <text x={463} y={90} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>CO</text>
    {[452, 463, 474].map(x => <circle key={x} cx={x} cy={106} r="2.2" fill={muted} />)}
    <circle cx={484} cy={70} r="3.5" fill={P.good} />
    <Lines x={463} y={144} anchor="middle" lines={['alarm']} size={13} weight={600} colour={muted} />
    <Caption y={276} text="Very hard to detect without an alarm" />
  </Diagram>
}
function PartLungs() {
  return <Diagram title="Particulates are tiny solid particles. When breathed in they can get stuck in the lungs and cause damage and breathing problems.">
    <Lungs x={230} y={170} s={1.45} specks />
    <Specks pts={[[230, 20], [240, 34], [222, 44], [236, 54]]} r={3.2} />
    <Arrow from={[262, 22]} to={[262, 56]} colour={muted} width={2} />
    <Lines x={272} y={40} lines={['breathed in']} size={13} weight={600} colour={muted} />
    <path d="M376 150L290 180" stroke={ink} strokeWidth="1.4" /><circle cx={290} cy={180} r="2.6" fill={ink} />
    <Lines x={380} y={140} lines={['tiny solid', 'particles stuck', 'in the tubes']} />
    <Caption y={290} text="Particulates get stuck in the lungs" />
  </Diagram>
}
const HAZE: Pt[] = [[40, 132], [70, 124], [96, 138], [128, 128], [160, 136], [192, 122], [222, 134], [256, 126], [290, 138], [322, 124], [352, 134], [384, 128], [414, 138], [446, 124], [478, 134], [506, 126], [56, 146], [144, 148], [238, 148], [336, 148], [430, 148], [112, 116], [304, 114], [462, 114]]
function Dimming() {
  const ray = (from: Pt, to: Pt, o = 1) => <g opacity={o}><Arrow from={from} to={to} colour="#e0b23c" width={3.4} /></g>
  return <Diagram title="Particulates in the air reflect some sunlight back into space, so less light reaches the Earth. This is global dimming.">
    <rect x={4} y={4} width={532} height={292} rx="12" fill={sky} />
    <rect x={4} y={4} width={532} height={52} rx="12" fill="#e9edf6" />
    <text x={520} y={34} textAnchor="end" fontSize="13" fontWeight="600" fill={muted}>space</text>
    <rect x={4} y={106} width={532} height={52} fill="#e7e5e2" opacity=".7" />
    <Specks pts={HAZE} r={3.2} />
    <Sun x={52} y={42} r={22} />
    {/* reflected back into space */}
    <path d="M96 58L150 108" stroke="#e0b23c" strokeWidth="3.4" /><Arrow from={[150, 108]} to={[196, 30]} colour="#e0b23c" width={3.4} />
    <path d="M108 50L236 108" stroke="#e0b23c" strokeWidth="3.4" /><Arrow from={[236, 108]} to={[300, 30]} colour="#e0b23c" width={3.4} />
    {/* some gets through */}
    {ray([82, 70], [160, 240], .9)}
    <path d="M4 250Q270 226 536 250V284Q536 296 524 296H16Q4 296 4 284V250Z" fill={grass} stroke={leafLine} strokeWidth="2" />
    <Lines x={316} y={50} lines={['some light reflected', 'back into space']} size={13} weight={600} colour="#a77c12" />
    <Lines x={330} y={186} lines={['particulates in the air']} size={13} weight={600} colour={muted} />
    <path d="M360 176L360 150" stroke={muted} strokeWidth="1.4" /><circle cx={360} cy={150} r="2.6" fill={muted} />
    <Lines x={190} y={214} lines={['less light reaches the Earth']} size={14} />
    <text x={270} y={280} textAnchor="middle" fontSize="15" fontWeight="700" fill={leafLine}>global dimming</text>
  </Diagram>
}

// ---------- Section 3: acid rain gases ----------
function Others() {
  return <Diagram title="Two other pollutants from burning fossil fuels: sulfur dioxide, SO2, and oxides of nitrogen.">
    <path d="M20 250H250" stroke={muted} strokeWidth="2" />
    <Works x={110} y={250} s={1.6} />
    <So2 x={140} y={96} r={18} /><Nox x={176} y={124} r={15} />
    <Arrow from={[164, 90]} to={[282, 82]} colour={sLine} />
    <Arrow from={[196, 132]} to={[282, 180]} colour={nLine} />
    <Panel x={290} y={40} w={230} h={84} fill="#fbfce9" line={sLine}>
      <So2 x={330} y={82} r={16} />
      <Lines x={360} y={78} lines={['sulfur dioxide,', 'SO₂']} colour={sInk} />
    </Panel>
    <Panel x={290} y={140} w={230} h={84} fill="#fdf5ec" line={nLine}>
      <Nox x={330} y={182} r={16} />
      <Lines x={360} y={178} lines={['oxides of', 'nitrogen']} colour={nInk} />
    </Panel>
    <Caption y={284} text="Two more pollutants, made in different ways" />
  </Diagram>
}
function SO2() {
  const S = ({ x, y }: { x: number; y: number }) => <g><circle cx={x} cy={y} r="9" fill={sFill} stroke={sLine} strokeWidth="1.8" /><text x={x} y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill={sInk}>S</text></g>
  return <Diagram title="Some fossil fuels contain sulfur as an impurity. When the fuel burns, the sulfur is released as sulfur dioxide, SO2.">
    <Coal x={90} y={150} s={1.25}><S x={70} y={146} /><S x={104} y={160} /><S x={92} y={130} /></Coal>
    <text x={90} y={214} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>fuel</text>
    <path d="M110 128L150 72" stroke={ink} strokeWidth="1.4" /><circle cx={110} cy={128} r="2.6" fill={ink} />
    <Lines x={150} y={66} lines={['sulfur impurity']} colour={sInk} />
    <Arrow from={[152, 150]} to={[226, 150]} />
    <Flame x={270} y={196} s={3.4} />
    <text x={270} y={220} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>burns</text>
    <Arrow from={[304, 136]} to={[378, 118]} />
    <So2 x={432} y={112} r={28} />
    <Lines x={432} y={164} anchor="middle" lines={['sulfur dioxide,', 'SO₂']} colour={sInk} />
    <Caption y={280} text="The sulfur comes from the fuel itself" />
  </Diagram>
}
const AIR: [number, number, 'N' | 'O', number][] = [[60, 90, 'N', 20], [120, 60, 'O', -15], [60, 170, 'O', 10], [120, 220, 'N', -25], [340, 60, 'N', 10], [280, 40, 'N', -20], [70, 250, 'N', 5], [140, 136, 'N', -30], [280, 130, 'O', 20]]
function NOx() {
  return <Diagram title="Nitrogen and oxygen from the air react together because of the heat from burning fuel, forming oxides of nitrogen.">
    <circle cx={210} cy={180} r={76} fill="#fde3c4" opacity=".7" />
    <circle cx={210} cy={180} r={50} fill="#fcd3a4" opacity=".6" />
    <Flame x={210} y={234} s={3.6} />
    <text x={210} y={128} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.heatLine}>heat</text>
    {AIR.map(([x, y, l, rot], i) => l === 'N' ? <Pair key={i} x={x} y={y} letter="N" fill={nitro} line={nitroLine} rot={rot} /> : <Pair key={i} x={x} y={y} letter="O" fill={tealFill} line={teal} rot={rot} />)}
    <Arrow from={[272, 150]} to={[392, 100]} />
    <Nox x={446} y={90} r={28} />
    <Lines x={446} y={140} anchor="middle" lines={['oxides of', 'nitrogen']} colour={nInk} />
    <text x={400} y={206} fontSize="13" fontWeight="700" fill={muted}>in the air:</text>
    <Pair x={412} y={230} letter="N" fill={nitro} line={nitroLine} /><text x={432} y={235} fontSize="13" fontWeight="600" fill={nitroLine}>nitrogen</text>
    <Pair x={412} y={258} letter="O" fill={tealFill} line={teal} /><text x={432} y={263} fontSize="13" fontWeight="600" fill={teal}>oxygen</text>
    <Caption y={288} text="From the air, made by the heat" />
  </Diagram>
}
function Rain({ x0, x1, y0, y1 }: { x0: number; x1: number; y0: number; y1: number }) {
  const drops: Pt[] = []
  for (let x = x0, i = 0; x <= x1; x += 22, i++) for (let y = y0 + (i % 2) * 22; y <= y1; y += 44) drops.push([x, y])
  return <g>{drops.map(([x, y], i) => <path key={i} d={`M${x} ${y}l-5 14`} stroke={water} strokeWidth="3" />)}</g>
}
function AcidRain() {
  return <Diagram title="Sulfur dioxide and oxides of nitrogen from a chimney rise and mix with clouds, causing acid rain.">
    <path d="M20 256H520" stroke={muted} strokeWidth="2" />
    <Works x={80} y={256} s={1.5} />
    <So2 x={110} y={124} r={15} /><Nox x={138} y={96} r={14} />
    <Lines x={20} y={50} lines={['sulfur dioxide and', 'oxides of nitrogen']} size={13} weight={600} colour={muted} />
    <Curve2 />
    <Cloud x={380} y={70} s={1.25} fill="#eef0f3" line="#8d98a2" />
    <Rain x0={318} x1={450} y0={118} y1={226} />
    <Lines x={470} y={176} lines={['acid', 'rain']} colour={waterInk} />
    <Caption y={288} text="The gases mix with clouds: acid rain" />
  </Diagram>
}
const Curve2 = () => <g><path d="M160 90Q230 46 290 70" stroke={muted} strokeWidth="2.4" fill="none" strokeDasharray="6 6" /><Arrow from={[284, 68]} to={[304, 76]} colour={muted} width={2.4} /></g>
function Statue({ x, y }: { x: number; y: number }) {
  return <g><rect x={x - 20} y={y - 28} width={40} height={28} rx="3" fill="#e2ddd2" stroke="#8a8272" strokeWidth="1.6" />
    <path d={`M${x - 12} ${y - 28}Q${x - 14} ${y - 50} ${x} ${y - 52}Q${x + 14} ${y - 50} ${x + 12} ${y - 28}Z`} fill="#e2ddd2" stroke="#8a8272" strokeWidth="1.6" />
    <circle cx={x} cy={y - 62} r="11" fill="#e2ddd2" stroke="#8a8272" strokeWidth="1.6" />
    {[[x - 4, y - 66], [x + 6, y - 44], [x - 8, y - 38], [x + 10, y - 16]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="2.6" fill="#b9b19f" />)}</g>
}
function Fish({ x, y, dim = false }: { x: number; y: number; dim?: boolean }) {
  return <g opacity={dim ? .45 : 1}><path d={`M${x - 14} ${y}Q${x} ${y - 9} ${x + 12} ${y}Q${x} ${y + 9} ${x - 14} ${y}ZM${x - 14} ${y}L${x - 22} ${y - 6}V${y + 6}Z`} fill="#f0b36a" stroke="#b87a33" strokeWidth="1.4" /><circle cx={x + 6} cy={y - 1} r="1.5" fill={ink} /></g>
}
function Effects() {
  return <Diagram title="Effects: acid rain kills plants and water life and damages buildings, statues and metals. Sulfur dioxide and oxides of nitrogen also cause breathing problems.">
    <Cloud x={190} y={56} s={1.1} fill="#eef0f3" line="#8d98a2" />
    <Rain x0={122} x1={260} y0={96} y1={128} />
    <path d="M20 220H370" stroke={muted} strokeWidth="2" />
    <Tree x={64} y={220} s={1.05} bare />
    <path d="M122 220Q124 192 176 190Q228 192 232 220Z" fill={waterFill} stroke={water} strokeWidth="1.8" />
    <Fish x={168} y={206} dim /><Fish x={200} y={212} dim />
    <Statue x={278} y={220} />
    <path d="M314 220V172L336 158L358 172V220Z" fill="#f3e4cf" stroke="#a58a6a" strokeWidth="1.6" /><path d="M326 220V198H346V220" fill="none" stroke="#a58a6a" strokeWidth="1.4" />
    <circle cx={330} cy={184} r="3" fill="#cbb89a" /><circle cx={348} cy={204} r="2.6" fill="#cbb89a" />
    <text x={64} y={242} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>plants</text>
    <text x={177} y={242} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>water life</text>
    <Lines x={318} y={242} anchor="middle" lines={['buildings', 'and statues']} size={13} />
    <Panel x={388} y={36} w={136} h={236}>
      <So2 x={426} y={70} r={12} /><Nox x={464} y={62} r={11} />
      <Lungs x={456} y={170} s={.62} />
      <Lines x={456} y={234} anchor="middle" lines={['breathing', 'problems']} size={13} />
    </Panel>
    <Caption y={290} text="Harm to living things and buildings" />
  </Diagram>
}

// ---------- On your own: two tiles held over two fuels ----------
function Tiles({ assessment }: { assessment: boolean }) {
  const setup = (x: number, n: number, sooty: boolean) => <g key={n}>
    <Burner x={x} y={200} s={2.6} />
    <path d={`M${x - 50} 96H${x + 50}V112H${x - 50}Z`} fill="white" stroke={buildLine} strokeWidth="1.8" />
    {sooty && <path d={blob(x, 106, 28, 7, 5, .2)} fill={soot} opacity=".9" />}
    {sooty && <path d={blob(x + 4, 106, 16, 4, 9, .2)} fill="#2e2a27" />}
    <path d={`M${x + 50} 104H${x + 96}`} stroke={muted} strokeWidth="3.5" /><path d={`M${x + 50} 100L${x + 40} 96M${x + 50} 108L${x + 40} 112`} stroke={muted} strokeWidth="2.4" />
    <text x={x} y={270} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Fuel {n}</text>
  </g>
  return <Diagram viewBox="0 0 540 290" title={assessment ? 'Two numbered burning fuels, each with a tile held above it; one tile is clean and one is blackened.' : 'Two burning fuels with a white tile held above each. The tile over fuel 1 stays clean. The tile over fuel 2 is blackened by soot, so fuel 2 was burning incompletely.'}>
    {setup(150, 1, false)}{setup(370, 2, true)}
  </Diagram>
}

export function PollutionVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'pollute-fuels') return <Fuels />
  if (focus === 'pollute-two-types') return <TwoTypes />
  if (focus === 'pollute-both') return <Both />
  if (focus === 'pollute-incomplete') return <Incomplete />
  if (focus === 'pollute-compare') return <Compare />
  if (focus === 'pollute-co-blood') return <CoBlood />
  if (focus === 'pollute-co-effects') return <CoEffects />
  if (focus === 'pollute-co-detect') return <CoDetect />
  if (focus === 'pollute-part-lungs') return <PartLungs />
  if (focus === 'pollute-dimming') return <Dimming />
  if (focus === 'pollute-others') return <Others />
  if (focus === 'pollute-so2') return <SO2 />
  if (focus === 'pollute-nox') return <NOx />
  if (focus === 'pollute-acid-rain') return <AcidRain />
  if (focus === 'pollute-effects') return <Effects />
  if (focus === 'pollute-q-tiles') return <Tiles assessment={assessment} />
  return <Both />
}

import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'
import { Flask, Bung } from './GasRateVisuals'

/*
 * Chemistry Lesson 44: tests for gases. Original, code-native schematics; not to scale. Focus ids start with 'gastest-'.
 *
 * Colour code (the same in every drawing here, and the same course colours as the rest of Science):
 *   carbon dioxide = soft purple (gas arrows, bubbles)      oxygen = teal          hydrogen = pale grey (colourless)
 *   chlorine = pale yellow-green gas                        limewater = clear pale glass; cloudy = milky white-grey
 *   blue litmus paper = soft blue; bleached = white         wooden splint = warm tan; glowing tip = red-orange, no flame
 *   flame = orange with a yellow centre                     amber = the feature in focus
 * Test tubes have rounded bottoms and a small lip, like the bromine-water tubes in the cracking lesson.
 * Question views (assessment) never show a gas name and never colour the gas, so the colour cannot give the answer.
 */
const { ink, muted, panelFill, panelLine } = atomPalette
const glass = '#f5fafd', glassLine = '#6f8fa6'
const clLight = '#eef5c8', clLine = '#9aae3c', clText = '#6d7f1c'
const litmus = '#8fb3e8', litmusLine = '#3f6fb5', bleached = '#ffffff', bleachedLine = '#b9c2c9'
const lime = '#eaf4fb', limeLine = '#9bb2c2', cloudy = '#dde1e5', cloudyLine = '#9aa5ae'
const co2 = '#8267bd', co2Soft = '#f1ebfa'
const oxy = '#2a9d8f', oxySoft = '#dcf1ee', oxyText = '#1f7a70'
const hyd = '#f1f3f5', hydText = '#5b6f80'
const wood = '#e2bf8a', woodLine = '#a47a3f', char = '#5a3a2a'
const glow = '#e8572e', glowSoft = '#f9b08f'
const flameOut = '#f5a54a', flameIn = '#fcd97d', heatLine = '#c8641e'
const halo = '#f8c979', activeLine = '#c07a22', highlight = '#fff4e6'
const warn = '#c0503f', warnSoft = '#fdecea'

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Lines({ x, y, lines, anchor = 'start', size = 14, weight = 700, colour = ink }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; colour?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{l}</tspan>)}</text>
}
function Tag({ x, y, lines, to, anchor = 'start', colour = ink, size = 14 }: { x: number; y: number; lines: string[]; to: Pt; anchor?: 'start' | 'end'; colour?: string; size?: number }) {
  const sx = anchor === 'start' ? x - 5 : x + 5
  return <g>
    <path d={`M${sx} ${y - 5}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.4" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={ink} />
    <Lines x={x} y={y} lines={lines} anchor={anchor} colour={colour} size={size} />
  </g>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: Pt }) {
  const a = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${r1(x + Math.cos(a) * 13)} ${r1(y + Math.sin(a) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}

// ---------- Pieces ----------
/** Deterministic specks for milky (cloudy) limewater, kept inside the rounded tube. */
function milk(x: number, R: number, surf: number, b: number, n: number): Array<[number, number, number]> {
  let s = 7
  const next = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  const out: Array<[number, number, number]> = []
  while (out.length < n) {
    const px = x - R + 4 + next() * (2 * R - 8), py = surf + 4 + next() * (b - surf - 7), k = next()
    const dy = py - (b - R), inside = py < b - R || Math.hypot(px - x, dy) < R - 4
    if (inside) out.push([r1(px), r1(py), k])
  }
  return out
}
type Liquid = { level: number; fill: string; line: string; milky?: boolean }
/** A round-bottomed test tube with a small lip; x is its centre line, top its mouth. The gas tint fills the space above any liquid. */
function TestTube({ x, top, h = 160, w = 36, gas, liquid, children }: { x: number; top: number; h?: number; w?: number; gas?: string; liquid?: Liquid; children?: ReactNode }) {
  const b = top + h, R = w / 2
  const inside = (y: number) => `M${x - R + 1.5} ${r1(y)}V${b - R}a${R - 1.5} ${R - 1.5} 0 0 0 ${w - 3} 0V${r1(y)}Z`
  const surf = liquid ? b - liquid.level : b
  return <g>
    <path d={inside(top + 2)} fill={gas ?? glass} />
    {liquid && <path d={inside(surf)} fill={liquid.fill} />}
    {liquid?.milky && milk(x, R, surf, b, Math.round(liquid.level * w / 55)).map(([cx, cy, k], i) => <circle key={i} cx={cx} cy={cy} r={k > .5 ? 1.5 : 1.1} fill={k > .3 ? '#ffffff' : '#c3cad0'} opacity=".8" />)}
    {liquid && <path d={`M${x - R + 1.5} ${surf}H${x + R - 1.5}`} stroke={liquid.line} strokeWidth="1.8" />}
    {children}
    <path d={`M${x - R - 4} ${top}H${x - R}V${b - R}a${R} ${R} 0 0 0 ${w} 0V${top}H${x + R + 4}`} fill="none" stroke={glassLine} strokeWidth="2.4" />
    <path d={`M${x - R + 7} ${top + 14}V${b - R - 6}`} stroke="white" strokeWidth="3" opacity=".75" />
  </g>
}
function FlameShape({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${r1(x)} ${r1(y)}) scale(${s})`}>
    <path d="M0 0C-9 -4 -8 -14 -2 -22C-1 -15 4 -14 3 -20C9 -13 10 -4 0 0Z" fill={flameOut} stroke={heatLine} strokeWidth={1.4 / s} />
    <path d="M0 -3C-4 -6 -3 -11 0 -14C1 -10 4 -8 0 -3Z" fill={flameIn} />
  </g>
}
/** A wooden splint from `from` to its tip. 'glow' = red-orange glowing tip with no flame; 'flame' = lit; 'bright' = a big relit flame. */
function Splint({ from, tip, state, fs = 1 }: { from: Pt; tip: Pt; state: 'glow' | 'flame' | 'bright'; fs?: number }) {
  const a = Math.atan2(tip[1] - from[1], tip[0] - from[0])
  const back: Pt = [r1(tip[0] - Math.cos(a) * 9), r1(tip[1] - Math.sin(a) * 9)]
  return <g>
    <path d={`M${from[0]} ${from[1]}L${tip[0]} ${tip[1]}`} stroke={woodLine} strokeWidth="7.5" />
    <path d={`M${from[0]} ${from[1]}L${tip[0]} ${tip[1]}`} stroke={wood} strokeWidth="5" />
    <path d={`M${back[0]} ${back[1]}L${tip[0]} ${tip[1]}`} stroke={char} strokeWidth="6" />
    {state === 'glow' && <g>
      <circle cx={tip[0]} cy={tip[1]} r="9" fill={glowSoft} opacity=".55" />
      <circle cx={tip[0]} cy={tip[1]} r="4.2" fill={glow} stroke="#b83a1a" strokeWidth="1" />
    </g>}
    {state === 'flame' && <FlameShape x={tip[0]} y={tip[1] + 3} s={1.1 * fs} />}
    {state === 'bright' && <g>
      <circle cx={tip[0]} cy={tip[1] - 12} r="20" fill={flameIn} opacity=".45" />
      <FlameShape x={tip[0]} y={tip[1] + 4} s={1.7} />
    </g>}
  </g>
}
/** A strip of litmus paper hanging from y1 to y2; `split` makes the part below that y bleached white. */
function Strip({ x, y1, y2, w = 14, colour = 'blue', split }: { x: number; y1: number; y2: number; w?: number; colour?: 'blue' | 'white'; split?: number }) {
  const blue = colour === 'blue'
  return <g>
    <rect x={x - w / 2} y={y1} width={w} height={y2 - y1} rx="2.5" fill={blue ? litmus : bleached} stroke={blue ? litmusLine : bleachedLine} strokeWidth="1.5" />
    {split !== undefined && <rect x={x - w / 2 + .8} y={split} width={w - 1.6} height={y2 - split - .8} rx="2" fill={bleached} />}
    {split !== undefined && <path d={`M${x - w / 2} ${y2}V${split}M${x + w / 2} ${y2}V${split}M${x - w / 2} ${y2}H${x + w / 2}`} stroke={bleachedLine} strokeWidth="1.5" fill="none" />}
  </g>
}
function DeliveryTube({ d }: { d: string }) {
  return <g><path d={d} fill="none" stroke={glassLine} strokeWidth="8" /><path d={d} fill="none" stroke={glass} strokeWidth="3.6" /></g>
}
function Bubbles({ pts, colour = co2, fill = co2Soft }: { pts: Pt[]; colour?: string; fill?: string }) {
  return <g>{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6 + (i % 3) * .8} fill={fill} stroke={colour} strokeWidth="1.3" />)}</g>
}
function Pop({ x, y, s = 1, words = true }: { x: number; y: number; s?: number; words?: boolean }) {
  const pts = Array.from({ length: 20 }, (_, i) => { const a = (i / 20) * Math.PI * 2 - Math.PI / 2, r = (i % 2 ? 19 : 31) * s; return `${r1(x + Math.cos(a) * r * 1.15)},${r1(y + Math.sin(a) * r)}` }).join(' ')
  return <g>
    <polygon points={pts} fill="#fff4d6" stroke="#e0a526" strokeWidth="2" />
    {words && <text x={x} y={y + 5} textAnchor="middle" fontSize={15 * s} fontWeight="800" fill={heatLine}>POP!</text>}
    <path d={`M${r1(x + 42 * s)} ${r1(y - 14 * s)}q${r1(8 * s)} ${r1(14 * s)} 0 ${r1(28 * s)}M${r1(x + 52 * s)} ${r1(y - 22 * s)}q${r1(12 * s)} ${r1(22 * s)} 0 ${r1(44 * s)}`} fill="none" stroke="#e0a526" strokeWidth="2.2" />
  </g>
}
function Caption({ x, y, lines, colour = ink }: { x: number; y: number; lines: string[]; colour?: string }) {
  return <Lines x={x} y={y} lines={lines} anchor="middle" colour={colour} />
}
function Panel({ x, y, w, h, hot = false }: { x: number; y: number; w: number; h: number; hot?: boolean }) {
  return <rect x={x} y={y} width={w} height={h} rx="14" fill={hot ? highlight : panelFill} stroke={hot ? halo : panelLine} strokeWidth={hot ? 2 : 1.5} />
}
const CLEAR: Liquid = { level: 58, fill: lime, line: limeLine }
const CLOUDY: Liquid = { level: 58, fill: cloudy, line: cloudyLine, milky: true }

// ---------- Section 1: chlorine and carbon dioxide ----------
function Chlorine() {
  return <Diagram title="Testing for chlorine. A test tube of pale yellow-green chlorine gas has a strip of damp blue litmus paper held in its mouth: the part inside the gas has been bleached white. Beside it, a strip before the test is blue and after the test is white. A warning says chlorine is poisonous, so only a teacher tests it.">
    <TestTube x={120} top={96} h={170} gas={clLight} />
    <Strip x={120} y1={52} y2={176} split={110} />
    <Tag x={70} y={214} anchor="end" lines={['chlorine']} to={[108, 220]} colour={clText} size={15} />
    <Tag x={150} y={40} lines={['damp litmus', 'paper']} to={[127, 66]} />
    <Tag x={160} y={148} lines={['bleached', 'white']} to={[125, 150]} colour={muted} size={13} />
    <Panel x={250} y={34} w={272} h={160} />
    <Strip x={320} y1={62} y2={146} w={18} colour="blue" />
    <Arrow x1={352} y1={104} x2={420} y2={104} colour={muted} width={2.2} />
    <Strip x={452} y1={62} y2={146} w={18} colour="white" />
    <text x={320} y={172} textAnchor="middle" fontSize="13" fontWeight="600" fill={litmusLine}>before</text>
    <text x={452} y={172} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>bleached white</text>
    <rect x={250} y={212} width={272} height={52} rx="12" fill={warnSoft} stroke={warn} strokeWidth="1.6" />
    <path d="M268 250L281 228L294 250Z" fill="#fbd3cc" stroke={warn} strokeWidth="1.8" /><text x={281} y={247} textAnchor="middle" fontSize="13" fontWeight="800" fill={warn}>!</text>
    <text x={306} y={244} fontSize="14" fontWeight="700" fill={warn}>poisonous: teacher only</text>
  </Diagram>
}
/** Flask making a gas, a delivery tube and a test tube of limewater. */
function LimewaterRig({ x, liquid, gasColour, flask = true }: { x: number; liquid: Liquid; gasColour: string; flask?: boolean }) {
  const top = 96, h = 170, b = top + h
  const pipe = flask ? `M100 142V70Q100 52 118 52H${x - 18}Q${x} 52 ${x} 70V${b - 30}` : `M${x - 70} 52H${x - 18}Q${x} 52 ${x} 70V${b - 30}`
  return <g>
    {flask && <g>
      <Flask cx={100} base={272} h={128} w={112} level={44}>
        <Bubbles pts={[[84, 250], [104, 242], [118, 254], [94, 236]]} colour={glassLine} fill="white" />
      </Flask>
      <Bung cx={100} top={140} w={26} />
    </g>}
    <TestTube x={x} top={top} h={h} liquid={liquid} />
    <DeliveryTube d={pipe} />
    <Bubbles pts={[[x + 6, b - 34], [x - 6, b - 44], [x + 5, b - 54]]} colour={gasColour} fill={gasColour === co2 ? co2Soft : 'white'} />
  </g>
}
function Co2Setup() {
  return <Diagram title="Testing for carbon dioxide. A gas is made in a conical flask and passes along a delivery tube into a test tube of clear limewater, where it bubbles through the limewater.">
    <LimewaterRig x={300} liquid={CLEAR} gasColour={co2} />
    <Arrow x1={160} y1={36} x2={250} y2={36} colour={co2} width={3} />
    <text x={205} y={24} textAnchor="middle" fontSize="15" fontWeight="700" fill={co2}>carbon dioxide gas</text>
    <Tag x={352} y={236} lines={['limewater', '(clear)']} to={[312, 240]} colour={ink} />
    <Tag x={352} y={150} lines={['gas bubbles', 'through it']} to={[308, 214]} colour={muted} size={13} />
    <text x={100} y={292} textAnchor="middle" fontSize="12" fontWeight="600" fill={muted}>reaction making a gas</text>
  </Diagram>
}
function Co2Result() {
  const side = (x: number, isCo2: boolean) => <g opacity={1}>
    <TestTube x={x} top={100} h={150} liquid={isCo2 ? CLOUDY : CLEAR} />
    <DeliveryTube d={`M${x - 80} 60H${x - 18}Q${x} 60 ${x} 78V${220}`} />
    <Bubbles pts={[[x - 3, 212], [x + 5, 198]]} colour={isCo2 ? co2 : glassLine} fill={isCo2 ? co2Soft : 'white'} />
    <Arrow x1={x - 118} y1={60} x2={x - 88} y2={60} colour={isCo2 ? co2 : muted} width={3} />
    <text x={x - 104} y={44} textAnchor="middle" fontSize="13" fontWeight="700" fill={isCo2 ? co2 : muted}>{isCo2 ? 'carbon dioxide' : 'another gas'}</text>
  </g>
  return <Diagram title="Two test tubes of limewater. Left: another gas is bubbled through and the limewater stays clear, so the gas is not carbon dioxide. Right: carbon dioxide is bubbled through and the limewater turns cloudy.">
    <path d="M270 30V280" stroke={panelLine} strokeWidth="2" strokeDasharray="6 6" />
    {side(160, false)}
    {side(420, true)}
    <Caption x={160} y={274} lines={['stays clear: not', 'carbon dioxide']} colour={muted} />
    <Caption x={420} y={274} lines={['turns cloudy:', 'carbon dioxide']} colour={co2} />
  </Diagram>
}
function PairA() {
  return <Diagram title="The first two gas tests side by side. Chlorine: damp blue litmus paper turns white. Carbon dioxide: clear limewater turns cloudy.">
    <Panel x={14} y={14} w={250} h={272} />
    <Panel x={276} y={14} w={250} h={272} />
    <text x={139} y={44} textAnchor="middle" fontSize="16" fontWeight="700" fill={clText}>chlorine</text>
    <text x={401} y={44} textAnchor="middle" fontSize="16" fontWeight="700" fill={co2}>carbon dioxide</text>
    <Strip x={84} y1={80} y2={184} w={20} colour="blue" />
    <Arrow x1={112} y1={132} x2={164} y2={132} colour={muted} width={2.2} />
    <Strip x={194} y1={80} y2={184} w={20} colour="white" />
    <TestTube x={346} top={76} h={120} liquid={CLEAR} />
    <Arrow x1={374} y1={140} x2={428} y2={140} colour={muted} width={2.2} />
    <TestTube x={456} top={76} h={120} liquid={CLOUDY} />
    <g fontSize="12" fontWeight="600" fill={muted} textAnchor="middle">
      <text x={84} y={206}>damp litmus</text><text x={194} y={206}>after</text>
      <text x={346} y={216}>limewater</text><text x={456} y={216}>after</text>
    </g>
    <Caption x={139} y={250} lines={['litmus paper', 'turns white']} colour={clText} />
    <Caption x={401} y={250} lines={['limewater', 'turns cloudy']} colour={co2} />
  </Diagram>
}

// ---------- Section 2: oxygen and hydrogen (splint tests) ----------
function Oxygen() {
  return <Diagram title="Testing for oxygen. Left: a glowing splint, with a red-orange tip and no flame, is put into a test tube of oxygen. Right: the splint relights and bursts into a bright flame inside the tube.">
    <TestTube x={120} top={104} h={150} gas={oxySoft} />
    <Splint from={[200, 30]} tip={[128, 170]} state="glow" />
    <Arrow x1={232} y1={170} x2={306} y2={170} colour={muted} width={2.6} />
    <TestTube x={400} top={104} h={150} gas={oxySoft} />
    <Splint from={[480, 30]} tip={[408, 170]} state="bright" />
    <Tag x={84} y={150} anchor="end" lines={['glowing', 'splint']} to={[124, 170]} colour={glow} />
    <Tag x={84} y={232} anchor="end" lines={['oxygen']} to={[112, 230]} colour={oxyText} size={15} />
    <Tag x={454} y={206} lines={['bursts into', 'flame']} to={[412, 172]} colour={heatLine} />
    <text x={270} y={290} textAnchor="middle" fontSize="15" fontWeight="700" fill={oxyText}>oxygen: glowing splint relights</text>
  </Diagram>
}
function Hydrogen() {
  return <Diagram title="Testing for hydrogen. A test tube of colourless hydrogen is held tilted with its open end up. A lit splint, with a flame, is held at the open end, and there is a squeaky pop.">
    <g transform="rotate(24 200 250)">
      <TestTube x={200} top={96} h={160} gas={hyd} />
    </g>
    <Splint from={[348, 44]} tip={[250, 86]} state="flame" />
    <Pop x={196} y={60} />
    <Tag x={120} y={206} anchor="end" lines={['hydrogen']} to={[168, 200]} colour={hydText} size={15} />
    <Tag x={372} y={62} lines={['lit splint', '(with a flame)']} to={[312, 60]} colour={heatLine} />
    <Tag x={372} y={134} lines={['held at the', 'open end']} to={[256, 106]} colour={muted} size={13} />
    <text x={270} y={290} textAnchor="middle" fontSize="15" fontWeight="700" fill={hydText}>hydrogen: squeaky pop</text>
  </Diagram>
}
function PairB() {
  return <Diagram title="The two splint tests compared. Oxygen: a glowing splint, with no flame, is put into the tube and relights. Hydrogen: a lit splint, with a flame, is held at the open end of the tube and gives a squeaky pop.">
    <Panel x={14} y={14} w={250} h={272} />
    <Panel x={276} y={14} w={250} h={272} />
    <text x={139} y={42} textAnchor="middle" fontSize="15" fontWeight="700" fill={glow}>glowing splint: no flame</text>
    <text x={401} y={42} textAnchor="middle" fontSize="15" fontWeight="700" fill={heatLine}>lit splint: a flame</text>
    <TestTube x={100} top={110} h={120} gas={oxySoft} />
    <Splint from={[190, 60]} tip={[106, 150]} state="glow" />
    <Lines x={148} y={176} lines={['put into', 'the tube']} size={12} weight={600} colour={muted} />
    <TestTube x={380} top={110} h={120} gas={hyd} />
    <Splint from={[480, 76]} tip={[400, 100]} state="flame" />
    <Pop x={350} y={80} s={.75} />
    <Lines x={420} y={176} lines={['held at the', 'open end']} size={12} weight={600} colour={muted} />
    <Caption x={139} y={258} lines={['relights: oxygen']} colour={oxyText} />
    <Caption x={401} y={258} lines={['squeaky pop: hydrogen']} colour={hydText} />
  </Diagram>
}

// ---------- Section 3: all four together ----------
type Icon = 'litmus' | 'glow' | 'lime' | 'pop'
function MiniIcon({ kind, x, y, result = false }: { kind: Icon; x: number; y: number; result?: boolean }) {
  // x, y is the centre of a 44 × 44 box.
  if (kind === 'litmus') return <g><Strip x={x} y1={y - 20} y2={y + 20} w={13} colour={result ? 'white' : 'blue'} split={result ? undefined : y} /></g>
  if (kind === 'lime') return <TestTube x={x} top={y - 22} h={44} w={20} liquid={{ ...(result ? CLOUDY : CLEAR), level: 22 }} />
  if (kind === 'glow') return <g><TestTube x={x - 4} top={y - 12} h={36} w={20} />
    <Splint from={[x + 18, y - 24]} tip={[x - 2, y + 6]} state={result ? 'flame' : 'glow'} fs={.62} /></g>
  return <g><TestTube x={x - 6} top={y - 2} h={26} w={18} /><Splint from={[x + 20, y - 14]} tip={[x + 4, y - 6]} state="flame" fs={.6} />{result && <Pop x={x - 14} y={y - 12} s={.38} words={false} />}</g>
}
const GASES: Array<{ gas: string; colour: string; test: string; result: string; icon: Icon }> = [
  { gas: 'chlorine', colour: clText, test: 'damp litmus paper', result: 'turns white', icon: 'litmus' },
  { gas: 'oxygen', colour: oxyText, test: 'glowing splint', result: 'relights', icon: 'glow' },
  { gas: 'carbon dioxide', colour: co2, test: 'limewater', result: 'turns cloudy', icon: 'lime' },
  { gas: 'hydrogen', colour: hydText, test: 'lit splint', result: 'squeaky pop', icon: 'pop' },
]
function Summary() {
  const x = 16, cols = [140, 208, 160], rowH = 58, top = 18, head = 34
  const xs = [x, x + cols[0], x + cols[0] + cols[1]]
  return <Diagram viewBox="0 0 540 290" schematic={false} title="A table of the four gas tests. Chlorine: damp litmus paper turns white. Oxygen: a glowing splint relights. Carbon dioxide: limewater turns cloudy. Hydrogen: a lit splint gives a squeaky pop.">
    <rect x={x} y={top} width={508} height={head + rowH * 4} rx="12" fill="white" stroke={panelLine} strokeWidth="2" />
    <path d={`M${x} ${top + head}H${x + 508}`} stroke={panelLine} strokeWidth="2" />
    <rect x={x + 1} y={top + 1} width={506} height={head - 1} rx="11" fill="#e8f1f7" />
    {['gas', 'test', 'result'].map((h, i) => <text key={h} x={xs[i] + 16} y={top + 23} fontSize="14" fontWeight="700" fill={ink}>{h}</text>)}
    {GASES.map((g, i) => { const y = top + head + i * rowH, cy = y + rowH / 2; return <g key={g.gas}>
      {i > 0 && <path d={`M${x + 10} ${y}H${x + 498}`} stroke={panelLine} strokeWidth="1.2" />}
      <text x={xs[0] + 16} y={cy + 5} fontSize="15" fontWeight="700" fill={g.colour}>{g.gas}</text>
      <MiniIcon kind={g.icon} x={xs[1] + 26} y={cy} />
      <text x={xs[1] + 54} y={cy + 5} fontSize="14" fontWeight="600" fill={ink}>{g.test}</text>
      <MiniIcon kind={g.icon} x={xs[2] + 26} y={cy} result />
      <text x={xs[2] + 50} y={cy + 5} fontSize="14" fontWeight="700" fill={ink}>{g.result}</text>
    </g> })}
  </Diagram>
}
function Backwards() {
  const order = [1, 0, 2, 3]
  return <Diagram viewBox="0 0 540 290" schematic={false} title="Working backwards from a result to the gas. A relighting splint means oxygen. Bleached litmus paper means chlorine. Cloudy limewater means carbon dioxide. A squeaky pop means hydrogen.">
    <text x={40} y={24} fontSize="13" fontWeight="700" fill={muted}>what you see</text>
    <text x={400} y={24} fontSize="13" fontWeight="700" fill={muted}>the gas</text>
    {order.map((k, i) => { const g = GASES[k], cy = 60 + i * 64; return <g key={g.gas}>
      <rect x={24} y={cy - 28} width={254} height={56} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <MiniIcon kind={g.icon} x={58} y={cy} result />
      <text x={94} y={cy + 5} fontSize="14" fontWeight="700" fill={ink}>{['splint relights', 'litmus turns white', 'limewater cloudy', 'squeaky pop'][i]}</text>
      <Arrow x1={290} y1={cy} x2={370} y2={cy} colour={g.colour} width={2.6} />
      <rect x={378} y={cy - 20} width={150} height={40} rx="20" fill="white" stroke={g.colour} strokeWidth="2.2" />
      <text x={454} y={cy + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={g.colour}>{g.gas}</text>
    </g> })}
  </Diagram>
}
function Report() {
  const rows: Array<[string, string, string]> = [['Test', 'I bubbled the gas', 'through limewater.'], ['Observation', 'The limewater', 'turned cloudy.'], ['Conclusion', 'The gas is', 'carbon dioxide.']]
  return <Diagram viewBox="0 0 540 300" schematic={false} title="Writing up a gas test in three stacked boxes. 1 Test: I bubbled the gas through limewater. 2 Observation: the limewater turned cloudy. 3 Conclusion: the gas is carbon dioxide.">
    {rows.map(([head, a, b], i) => { const y = 14 + i * 94; return <g key={head}>
      <rect x={40} y={y} width={460} height={78} rx="14" fill={i === 2 ? highlight : panelFill} stroke={i === 2 ? halo : panelLine} strokeWidth={i === 2 ? 2 : 1.5} />
      <circle cx={70} cy={y + 39} r="14" fill={i === 2 ? activeLine : 'white'} stroke={i === 2 ? activeLine : ink} strokeWidth="2" />
      <text x={70} y={y + 44} textAnchor="middle" fontSize="15" fontWeight="700" fill={i === 2 ? 'white' : ink}>{i + 1}</text>
      <text x={98} y={y + 32} fontSize="15" fontWeight="700" fill={i === 2 ? activeLine : ink}>{head}</text>
      <text x={98} y={y + 56} fontSize="14" fill={ink}>{a} {b}</text>
      {i === 0 && <g><TestTube x={450} top={y + 14} h={54} w={22} liquid={{ ...CLEAR, level: 24 }} /><DeliveryTube d={`M${420} ${y + 10}H${442}Q${450} ${y + 10} ${450} ${y + 18}V${y + 56}`} /><Bubbles pts={[[448, y + 50], [453, y + 43]]} /></g>}
      {i === 1 && <TestTube x={450} top={y + 14} h={54} w={22} liquid={{ ...CLOUDY, level: 24 }} />}
      {i === 2 && <g><circle cx={450} cy={y + 39} r="18" fill={co2Soft} stroke={co2} strokeWidth="2" /><text x={450} y={y + 44} textAnchor="middle" fontSize="13" fontWeight="700" fill={co2}>CO₂</text></g>}
      {i < 2 && <path d={`M270 ${y + 80}V${y + 92}`} stroke={muted} strokeWidth="2" />}
    </g> })}
  </Diagram>
}

// ---------- Question: four numbered tubes, no gas names, no gas colours ----------
function Question({ assessment }: { assessment: boolean }) {
  const xs = [78, 206, 334, 462], top = 108, h = 130
  const seen = ['litmus white', 'splint relights', 'cloudy', 'squeaky pop']
  const gases = ['chlorine', 'oxygen', 'carbon dioxide', 'hydrogen']
  return <Diagram viewBox="0 0 540 310" title={assessment ? 'Four numbered test tubes showing different test results.' : 'Four numbered test tubes. Tube 1: damp litmus paper turned white, so chlorine. Tube 2: a glowing splint relit inside the tube, so oxygen. Tube 3: limewater turned cloudy, so carbon dioxide. Tube 4: a lit splint at the open end gave a squeaky pop, so hydrogen.'}>
    <TestTube x={xs[0]} top={top} h={h} />
    <Strip x={xs[0]} y1={74} y2={190} split={120} />
    <TestTube x={xs[1]} top={top} h={h} />
    <Splint from={[xs[1] + 50, 50]} tip={[xs[1] + 6, 184]} state="bright" />
    <TestTube x={xs[2]} top={top} h={h} liquid={CLOUDY} />
    <TestTube x={xs[3]} top={top} h={h} />
    <Splint from={[xs[3] + 58, 60]} tip={[xs[3] + 16, 98]} state="flame" />
    <Pop x={xs[3] - 18} y={72} s={.7} />
    {xs.map((x, i) => <g key={i}>
      <Pointer n={i + 1} x={x - 38} y={top + h - 20} to={[x - 16, top + h - 30]} />
      <text x={x} y={top + h + 34} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{seen[i]}</text>
      {!assessment && <text x={x} y={top + h + 54} textAnchor="middle" fontSize="13" fontWeight="700" fill={GASES.find(g => g.gas === gases[i])!.colour}>{gases[i]}</text>}
    </g>)}
  </Diagram>
}

export function GasTestVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'gastest-chlorine': return <Chlorine />
    case 'gastest-co2-setup': return <Co2Setup />
    case 'gastest-co2-result': return <Co2Result />
    case 'gastest-pair-a': return <PairA />
    case 'gastest-oxygen': return <Oxygen />
    case 'gastest-hydrogen': return <Hydrogen />
    case 'gastest-pair-b': return <PairB />
    case 'gastest-summary': return <Summary />
    case 'gastest-backwards': return <Backwards />
    case 'gastest-report': return <Report />
    case 'gastest-q-results': return <Question assessment={assessment} />
    default: return <Summary />
  }
}

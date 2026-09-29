import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 55: Waste water treatment. Original, code-native schematics; not to scale. Focus ids start with 'sewage-'.
 *
 * Colour code (the same in every drawing here):
 *   blue = clean or treated water; paler blue = effluent; grey-olive = untreated waste water (sewage)
 *   brown = sludge; teal = air (oxygen); yellow/orange = energy (methane flame); green = plants and fertiliser
 *   tan rods = the bacteria that do the cleaning; coral blobs = harmful microbes in the waste water
 * One plant drawing is reused through the screening, sedimentation and digestion walkthroughs: the stage being
 * discussed is drawn in full and the rest is faded. The town drawing is reused through "Why treat waste water?".
 */
const { ink, muted } = atomPalette
const faded = 0.26
const water = '#bfe0f1', waterLine = '#3f93bd'
const effluent = '#dcedf6', effluentLine = '#6aa8cb'
const murky = '#cfd0b3', murkyLine = '#8b8b63'
const sludge = '#cfae84', sludgeLine = '#8a6843', solid = '#a9885c'
const oxygen = '#3fa39a', oxygenFill = '#d3eeea'
const flameOut = '#f5a54a', flameIn = '#fcd97d', heatLine = '#c8641e', energy = '#b98a17'
const leaf = '#a9d49a', leafLine = '#4f8f5a', good = '#4f9a74', bad = '#c0675a'
const tank = '#f1f4f6', tankLine = '#7f95a6'
const soil = '#f1e6d3', soilLine = '#cdb994', grass = '#b9dca9'
const bug = '#f2d3a6', bugLine = '#bf8a4a'
const germ = '#f5b9ae', germLine = '#c0675a'
const wall = '#fbf6ee', wallLine = '#9c8a74', roof = '#d99a7c', roofLine = '#a5634a'

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

// Deterministic wobbly shapes (same on server and client) so stones, flecks and sacks look hand-drawn.
function seeded(seed: number) {
  let s = (Math.abs(Math.floor(seed)) * 9973 + 7) % 2147483647 || 1
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}
function blob(cx: number, cy: number, rx: number, ry: number, seed: number, wobble = 0.12, count = 9) {
  const rand = seeded(seed)
  const pts: Pt[] = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2, k = 1 + (rand() - 0.5) * 2 * wobble
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]
  })
  const n = pts.length
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`
  }
  return d + 'Z'
}

// ---------- Shared pieces ----------
function Diagram({ title, children, viewBox = '0 0 540 300' }: { title: string; children: ReactNode; viewBox?: string }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{`${title} Original schematic, not to scale.`}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Lines({ x, y, lines, anchor = 'start', size = 14, weight = 700, colour = ink }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; colour?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{l}</tspan>)}</text>
}
function Caption({ text, y = 288 }: { text: string; y?: number }) {
  return <text x={270} y={y} textAnchor="middle" fontSize="14" fontWeight="600" fill={muted}>{text}</text>
}
function Leader({ from, to, colour = ink }: { from: Pt; to: Pt; colour?: string }) {
  return <g><path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} stroke={colour} strokeWidth="1.4" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={colour} /></g>
}
function Arrow({ from, to, colour = ink, width = 2.4, dashed = false }: { from: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), h = 6 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * .6), p(h, -h * .6), p(h * .7, 0)]
  return <g><path d={`M${from[0]} ${from[1]}L${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}
// A pipe: a soft outline with the liquid it carries showing inside.
function Pipe({ d, fill, line = tankLine, w = 8 }: { d: string; fill: string; line?: string; w?: number }) {
  return <g fill="none"><path d={d} stroke={line} strokeWidth={w + 3.5} /><path d={d} stroke={fill} strokeWidth={w} /></g>
}
function Badge({ n, x, y, on = true, solid = false }: { n: number; x: number; y: number; on?: boolean; solid?: boolean }) {
  return <g opacity={on ? 1 : .45}><circle cx={x} cy={y} r="12.5" fill={solid ? waterLine : 'white'} stroke={solid ? '#2c6f93' : ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={solid ? 'white' : ink}>{n}</text></g>
}
function Tick({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><circle r="13" fill="#e3f2e8" stroke={good} strokeWidth="2" /><path d="M-6 0l4 5l8 -10" stroke={good} strokeWidth="3" fill="none" /></g>
}
function Cross({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><circle r="12" fill="#fbe6e2" stroke={bad} strokeWidth="2" /><path d="M-5 -5l10 10M5 -5l-10 10" stroke={bad} strokeWidth="3" /></g>
}
function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C-9 -4 -8 -14 -2 -22C-1 -15 4 -14 3 -20C9 -13 10 -4 0 0Z" fill={flameOut} stroke={heatLine} strokeWidth="1.4" />
    <path d="M0 -3C-4 -6 -3 -11 0 -14C1 -10 4 -8 0 -3Z" fill={flameIn} />
  </g>
}
function Bubble({ x, y, r = 3.5 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={oxygenFill} stroke={oxygen} strokeWidth="1.5" />
}
// A working bacterium: a small rounded rod.
function Bacterium({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><rect x={-7} y={-3.5} width={14} height={7} rx="3.5" fill={bug} stroke={bugLine} strokeWidth="1.3" /></g>
}
// A harmful microbe: a spiky or round coral blob.
function Germ({ x, y, s = 1, spiky = false }: { x: number; y: number; s?: number; spiky?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {spiky && [0, 60, 120, 180, 240, 300].map(a => <path key={a} d={`M${r1(Math.cos(a * Math.PI / 180) * 6)} ${r1(Math.sin(a * Math.PI / 180) * 6)}L${r1(Math.cos(a * Math.PI / 180) * 10)} ${r1(Math.sin(a * Math.PI / 180) * 10)}`} stroke={germLine} strokeWidth="1.6" />)}
    {spiky ? <circle r="6.5" fill={germ} stroke={germLine} strokeWidth="1.5" /> : <path d={blob(0, 0, 9, 5.5, 7, .1)} fill={germ} stroke={germLine} strokeWidth="1.5" />}
  </g>
}
function Fleck({ x, y, seed, r = 4 }: { x: number; y: number; seed: number; r?: number }) {
  return <path d={blob(x, y, r, r * .7, seed, .25, 7)} fill={solid} stroke={sludgeLine} strokeWidth="1" />
}
function Sack({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-15 16C-19 4 -16 -10 -9 -16C-4 -19 4 -19 9 -16C16 -10 19 4 15 16C8 20 -8 20 -15 16Z" fill="#e6f1dc" stroke={leafLine} strokeWidth="1.8" />
    <path d="M-9 -16q9 5 18 0" stroke={leafLine} strokeWidth="1.5" fill="none" />
    <path d="M0 8V-4M0 -1q-7 -1 -8 -8q7 0 8 8M0 -3q6 -2 8 -8q-7 -1 -8 8" stroke={leafLine} strokeWidth="1.4" fill={leaf} />
  </g>
}
function Hob({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 26} ${y + 6}h52l-4 12h-44z`} fill="#e7eaec" stroke={tankLine} strokeWidth="1.8" />
    <ellipse cx={x} cy={y + 4} rx="18" ry="4.5" fill="#cfd6db" stroke="#56687a" strokeWidth="1.8" />
    <Flame x={x - 9} y={y + 2} s={.7} /><Flame x={x} y={y + 1} s={.85} /><Flame x={x + 9} y={y + 2} s={.7} />
  </g>
}
function House({ x, y, inside = false }: { x: number; y: number; inside?: boolean }) {
  // (x, y) is the bottom-left corner of the walls; walls are 70 wide and 58 high.
  return <g>
    <path d={`M${x} ${y}V${y - 58}H${x + 70}V${y}Z`} fill={wall} stroke={wallLine} strokeWidth="2" />
    <path d={`M${x - 8} ${y - 55}L${x + 35} ${y - 92}L${x + 78} ${y - 55}Q${x + 35} ${y - 60} ${x - 8} ${y - 55}Z`} fill={roof} stroke={roofLine} strokeWidth="2" />
    {inside ? <g>
      {/* bath with water, and a sink with a tap */}
      <path d={`M${x + 6} ${y - 18}h34v6q0 8 -8 8h-18q-8 0 -8 -8z`} fill="white" stroke={tankLine} strokeWidth="1.6" />
      <path d={`M${x + 8} ${y - 15}h30`} stroke={waterLine} strokeWidth="2.5" />
      <path d={`M${x + 38} ${y - 26}v-8h-5`} stroke={tankLine} strokeWidth="1.8" fill="none" />
      <path d={`M${x + 48} ${y - 38}h16v5q0 6 -8 6q-8 0 -8 -6z`} fill="white" stroke={tankLine} strokeWidth="1.6" />
      <path d={`M${x + 58} ${y - 38}v-7h-5`} stroke={tankLine} strokeWidth="1.8" fill="none" />
      <path d={`M${x + 56} ${y - 27}v${27}`} stroke={murkyLine} strokeWidth="2" strokeDasharray="3 3" />
    </g> : <g>
      <rect x={x + 10} y={y - 44} width={18} height={16} rx="3" fill={water} stroke={wallLine} strokeWidth="1.5" />
      <rect x={x + 42} y={y - 30} width={16} height={30} rx="3" fill="#e2c9a8" stroke={wallLine} strokeWidth="1.5" />
    </g>}
  </g>
}

// ---------- The town: where waste water comes from (section "Why treat waste water?") ----------
const GROUND = 176, SEWER = 226
function TownScene({ focus }: { focus: string }) {
  const homes = focus === 'sewage-homes', sources = focus === 'sewage-sources', polluted = focus === 'sewage-pollutants', back = focus === 'sewage-return'
  const on = (part: 'house' | 'farm' | 'factory' | 'sewer' | 'plant' | 'river') => {
    if (polluted) return part === 'sewer' ? .5 : .14
    if (homes) return part === 'farm' || part === 'factory' ? faded : part === 'river' ? .45 : 1
    if (sources) return part === 'river' || part === 'plant' ? .45 : 1
    return part === 'plant' || part === 'river' ? 1 : faded
  }
  const title = homes ? 'Waste water from washing-up, toilets and baths in a house goes down a drain into a sewer, which carries it to a sewage treatment plant.'
    : sources ? 'Homes, farms (agriculture) and factories (industrial processes) all send waste water into the sewers.'
      : polluted ? 'A close-up of waste water: it contains organic matter, from the remains and waste of living things, and harmful microbes. These are pollutants.'
        : 'Treated water from the sewage treatment plant goes back into a river. Untreated waste water is not put straight into the river.'
  return <Diagram title={title}>
    {/* ground and the river channel */}
    <path d={`M0 ${GROUND}Q120 ${GROUND - 4} 240 ${GROUND}T470 ${GROUND}H540V262Q540 272 530 272H10Q0 272 0 262Z`} fill={soil} stroke={soilLine} strokeWidth="1.6" />
    <path d={`M0 ${GROUND}Q120 ${GROUND - 4} 240 ${GROUND}T470 ${GROUND}`} stroke={grass} strokeWidth="5" fill="none" />
    <g opacity={on('river')}>
      <path d={`M470 ${GROUND}Q486 ${GROUND + 34} 540 ${GROUND + 34}V${GROUND}Z`} fill={water} stroke={waterLine} strokeWidth="2" />
      <path d={`M484 ${GROUND + 10}q8 -4 16 0t16 0`} stroke={waterLine} strokeWidth="1.6" fill="none" />
      <path d="M476 170q-4 -16 2 -26M482 170q2 -14 8 -20" stroke={leafLine} strokeWidth="2" fill="none" />
      <text x={514} y={164} textAnchor="middle" fontSize="13" fontWeight="600" fill={waterLine}>river</text>
    </g>
    {/* house */}
    <g opacity={on('house')}>
      <House x={28} y={GROUND} inside />
      <Pipe d={`M84 ${GROUND}V${SEWER - 6}`} fill={murky} line={murkyLine} w={6} />
    </g>
    {/* farm: crop rows and a barn */}
    <g opacity={on('farm')}>
      {[128, 146, 164].map((x, i) => <g key={x}><path d={`M${x} ${GROUND - 2}V${GROUND - 20}`} stroke={leafLine} strokeWidth="2" /><path d={blob(x - 5, GROUND - 16, 6, 3.5, i + 3, .1)} fill={leaf} stroke={leafLine} strokeWidth="1.3" /><path d={blob(x + 5, GROUND - 22, 6, 3.5, i + 9, .1)} fill={leaf} stroke={leafLine} strokeWidth="1.3" /></g>)}
      <path d={`M184 ${GROUND}V${GROUND - 40}L204 ${GROUND - 60}L224 ${GROUND - 40}V${GROUND}Z`} fill="#e9b7a0" stroke={roofLine} strokeWidth="2" />
      <path d={`M196 ${GROUND}V${GROUND - 22}H212V${GROUND}`} fill="#f7e3d6" stroke={roofLine} strokeWidth="1.6" />
      <Pipe d={`M204 ${GROUND}V${SEWER - 6}`} fill={murky} line={murkyLine} w={6} />
    </g>
    {/* factory with a chimney */}
    <g opacity={on('factory')}>
      <path d={`M262 ${GROUND}V${GROUND - 36}L284 ${GROUND - 50}V${GROUND - 36}L306 ${GROUND - 50}V${GROUND - 36}L328 ${GROUND - 50}V${GROUND}Z`} fill="#e6e9ee" stroke="#7a8796" strokeWidth="2" />
      <path d={`M312 ${GROUND - 44}V${GROUND - 92}H324V${GROUND - 48}`} fill="#d5dbe2" stroke="#7a8796" strokeWidth="2" />
      <path d={blob(326, GROUND - 104, 12, 7, 5, .15)} fill="#eef0f2" stroke="#b3bcc5" strokeWidth="1.4" />
      <path d={blob(342, GROUND - 114, 9, 6, 6, .15)} fill="#eef0f2" stroke="#b3bcc5" strokeWidth="1.4" />
      {[272, 292].map(x => <rect key={x} x={x} y={GROUND - 28} width={12} height={10} rx="2" fill={water} stroke="#7a8796" strokeWidth="1.3" />)}
      <Pipe d={`M300 ${GROUND}V${SEWER - 6}`} fill={murky} line={murkyLine} w={6} />
    </g>
    {/* the sewer, running under the ground to the plant */}
    <g opacity={on('sewer')}>
      <Pipe d={`M72 ${SEWER}H384Q396 ${SEWER} 396 ${SEWER - 12}V${GROUND - 6}`} fill={murky} line={murkyLine} w={12} />
      {[140, 250, 346].map(x => <path key={x} d={`M${x - 5} ${SEWER - 4}l6 4l-6 4`} stroke={murkyLine} strokeWidth="2" fill="none" />)}
    </g>
    {/* the plant: low rounded tanks */}
    <g opacity={on('plant')}>
      <path d={`M386 ${GROUND}V${GROUND - 22}Q386 ${GROUND - 28} 392 ${GROUND - 28}H420Q426 ${GROUND - 28} 426 ${GROUND - 22}V${GROUND}Z`} fill={tank} stroke={tankLine} strokeWidth="2" />
      <path d={`M390 ${GROUND - 20}H422`} stroke={effluentLine} strokeWidth="3" />
      <path d={`M432 ${GROUND}V${GROUND - 26}Q432 ${GROUND - 50} 450 ${GROUND - 50}Q468 ${GROUND - 50} 468 ${GROUND - 26}V${GROUND}Z`} fill={tank} stroke={tankLine} strokeWidth="2" />
      <path d={`M436 ${GROUND - 14}H464`} stroke={sludgeLine} strokeWidth="3" />
    </g>
    {/* treated water back to the river */}
    {!polluted && <g opacity={back ? 1 : on('river')}>
      <Pipe d={`M468 ${GROUND - 10}Q480 ${GROUND - 10} 484 ${GROUND + 8}`} fill={water} line={waterLine} w={5} />
    </g>}

    {homes && <g>
      <Lines x={14} y={48} lines={['washing-up,', 'toilet, bath']} />
      <Leader from={[64, 70]} to={[72, 132]} />
      <Lines x={98} y={SEWER + 32} lines={['sewer']} colour={murkyLine} />
      <Leader from={[118, SEWER + 18]} to={[118, SEWER + 4]} colour={murkyLine} />
      <Lines x={426} y={76} anchor="middle" lines={['sewage', 'treatment plant']} />
      <Leader from={[426, 110]} to={[426, 134]} />
      <Arrow from={[330, SEWER - 30]} to={[372, SEWER - 30]} colour={murkyLine} width={2} />
    </g>}
    {sources && <g>
      <Lines x={63} y={60} anchor="middle" lines={['homes']} />
      <Lines x={176} y={60} anchor="middle" lines={['agriculture', '(farming)']} />
      <Lines x={296} y={32} anchor="middle" lines={['industrial', 'processes']} />
      <Lines x={236} y={SEWER + 34} anchor="middle" lines={['waste water']} colour={murkyLine} />
      <Arrow from={[330, SEWER - 30]} to={[372, SEWER - 30]} colour={murkyLine} width={2} />
    </g>}
    {polluted && <g>
      <path d={`M250 ${SEWER - 6}L226 184M278 ${SEWER - 6}L330 184`} stroke={muted} strokeWidth="1.3" strokeDasharray="4 4" />
      <circle cx={276} cy={112} r={78} fill="white" stroke={murkyLine} strokeWidth="3" />
      <circle cx={276} cy={112} r={72} fill="#eceedd" />
      <g transform="translate(20 0)">
      {[[222, 76, 1], [268, 70, 2], [206, 116, 3], [238, 140, 4], [290, 150, 5], [226, 170, 6]].map(([x, y, s]) => <Fleck key={s} x={x} y={y} seed={s} r={6} />)}
      <path d={blob(250, 104, 12, 6, 12, .2)} fill="#b9c98f" stroke="#7c8c53" strokeWidth="1.3" />
      <path d={blob(196, 92, 7, 4, 13, .2)} fill="#b9c98f" stroke="#7c8c53" strokeWidth="1.3" />
      <Germ x={296} y={92} /><Germ x={312} y={124} s={.9} spiky /><Germ x={272} y={128} s={.8} /><Germ x={300} y={66} s={.7} spiky /><Germ x={262} y={168} s={.8} spiky /></g>
      <Lines x={14} y={62} lines={['organic matter']} colour={sludgeLine} />
      <Lines x={14} y={84} lines={['carbon compounds', 'from the remains and', 'waste of living things']} size={13} weight={600} colour={muted} />
      <Leader from={[150, 58]} to={[242, 76]} colour={sludgeLine} />
      <Lines x={370} y={62} lines={['harmful microbes']} colour={germLine} />
      <Lines x={370} y={84} lines={['e.g. some bacteria', 'and viruses']} size={13} weight={600} colour={muted} />
      <Leader from={[366, 58]} to={[316, 92]} colour={germLine} />
      <Caption y={292} text="Pollutants in waste water" />
    </g>}
    {back && <g>
      <Tick x={500} y={128} />
      <Lines x={530} y={60} anchor="end" lines={['treated first, so no', 'health problems']} colour={good} />
      <g opacity=".45">
        <path d={`M404 ${SEWER}H484Q498 ${SEWER} 500 ${GROUND + 38}`} stroke={murkyLine} strokeWidth="3" strokeDasharray="7 6" fill="none" />
        <Cross x={450} y={SEWER + 24} />
        <Lines x={432} y={SEWER + 29} anchor="end" lines={['untreated']} size={13} weight={600} colour={muted} />
      </g>
    </g>}
  </Diagram>
}

// ---------- The plant: one drawing reused for every stage ----------
type Part = 'house' | 's1' | 's2' | 's3' | 's4' | 'eff' | 'sludge' | 'river' | 'gas' | 'cooker' | 'fert'
const ALL: Part[] = ['house', 's1', 's2', 's3', 's4', 'eff', 'sludge', 'river', 'gas', 'cooker', 'fert']
type View = { on: Part[]; key: number[]; title: string }
const VIEWS: Record<string, View> = {
  'sewage-route': { on: ['house', 's1', 's2', 's3', 's4', 'eff', 'sludge', 'river'], key: [1, 2, 3, 4], title: 'A sewage treatment plant: waste water passes through four stages in order. 1 screening, 2 sedimentation, 3 aerobic digestion, 4 anaerobic digestion.' },
  'sewage-screening': { on: ['house', 's1'], key: [1], title: 'Stage 1, screening: a screen of bars catches large bits such as twigs and plastic bags, and grit, which is small bits of stone and sand.' },
  'sewage-sediment': { on: ['s2'], key: [2], title: 'Stage 2, sedimentation: in a settling tank the heavier solids sink to the bottom as sludge and the lighter liquid floats on top.' },
  'sewage-split': { on: ['s2', 'eff', 'sludge'], key: [2], title: 'Two streams leave the settling tank: effluent, the liquid waste from the top, goes to stage 3; sludge from the bottom goes to stage 4.' },
  'sewage-aerobic': { on: ['eff', 's3'], key: [3], title: 'Stage 3, aerobic digestion: air is bubbled through the effluent and bacteria use the oxygen to break down organic matter and other microbes.' },
  'sewage-released': { on: ['s3', 'river'], key: [3], title: 'After aerobic digestion the treated water is released into the environment, for example a river.' },
  'sewage-anaerobic': { on: ['sludge', 's4', 'gas'], key: [4], title: 'Stage 4, anaerobic digestion: sludge is broken down by bacteria in a sealed tank with no oxygen, making methane gas.' },
  'sewage-products': { on: ['s4', 'gas', 'cooker', 'fert'], key: [4], title: 'Anaerobic digestion makes methane, which can be used as an energy source such as for cooking, and remaining waste, which can be used as fertiliser.' },
  'sewage-whole': { on: ALL, key: [1, 2, 3, 4], title: 'The whole plant: screening, then sedimentation. Effluent goes to aerobic digestion and is released to a river. Sludge goes to anaerobic digestion, making methane and fertiliser.' },
}
const STAGES = ['screening', 'sedimentation', 'aerobic digestion', 'anaerobic digestion']

function Plant({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  const q = focus === 'sewage-q-plant'
  const view: View = q ? { on: ['house', 's1', 's2', 's3', 's4', 'eff', 'sludge', 'river'], key: [], title: 'A schematic sewage treatment plant with four numbered stages in order, from a house on the left to a river.' } : VIEWS[focus] ?? VIEWS['sewage-whole']
  const all = focus === 'sewage-whole' || focus === 'sewage-route' || q
  // Parts not being taught are faded; in the anaerobic frame the products are hidden until the next frame.
  const o = (p: Part) => view.on.includes(p) ? 1 : q || (focus === 'sewage-anaerobic' && (p === 'cooker' || p === 'fert')) ? 0 : faded
  const show = (f: string) => focus === f && !assessment
  const label = !q
  return <Diagram viewBox={q ? '-16 0 600 300' : '-16 0 600 384'} title={view.title}>
    {/* house and the inflow */}
    <g opacity={o('house')}>
      <path d={blob(40, 190, 38, 7, 3, .06)} fill={grass} stroke="none" />
      <House x={8} y={188} />
      <Pipe d="M78 176H88" fill={murky} line={murkyLine} w={7} />
    </g>
    {/* 1 screening: a channel with a screen of bars */}
    <g opacity={o('s1')}>
      <path d="M86 160H146V184Q146 200 130 200H102Q86 200 86 184Z" fill={murky} stroke={tankLine} strokeWidth="2.4" />
      <path d="M88 166q7 -3 14 0t14 0t14 0t14 0" stroke={murkyLine} strokeWidth="1.4" fill="none" />
      {[122, 128, 134].map(x => <path key={x} d={`M${x} 150V198`} stroke="#56687a" strokeWidth="2.6" />)}
      <path d="M118 150H138" stroke="#56687a" strokeWidth="3" />
      {/* a twig and a plastic bag caught on the bars, grit on the bottom */}
      <path d="M100 176L120 168M110 172l3 -8" stroke="#8a6843" strokeWidth="2.6" fill="none" />
      <path d="M104 190C100 180 108 176 114 180L118 178C120 182 120 190 116 193C112 195 106 194 104 190Z" fill="#f4f1f6" stroke="#9a8fb0" strokeWidth="1.4" />
      {[[94, 195, 1], [99, 196, 2], [92, 191, 3], [104, 197, 4], [110, 197, 5]].map(([x, y, s]) => <path key={s} d={blob(x, y, 2.6, 2, s + 20, .3, 6)} fill="#c7bba6" stroke="#8e8270" strokeWidth=".9" />)}
    </g>
    {/* 1 → 2 */}
    <g opacity={Math.max(o('s1'), o('s2'))}><Pipe d="M146 170H162" fill={murky} line={murkyLine} w={7} /></g>
    {/* 2 sedimentation: a settling tank, liquid on top, sludge settled at the bottom */}
    <g opacity={o('s2')}>
      <path d="M162 150V200Q162 228 188 228H232Q258 228 258 200V150" fill={tank} stroke={tankLine} strokeWidth="2.6" />
      <path d="M164 160H256V200Q256 226 232 226H188Q164 226 164 200Z" fill={effluent} />
      <path d="M164 204H256Q256 226 232 226H188Q164 226 164 204Z" fill={sludge} />
      <path d="M164 204q12 -3 23 0t23 0t23 0t23 0" stroke={sludgeLine} strokeWidth="1.4" fill="none" />
      <path d="M166 160q9 -3 18 0t18 0t18 0t18 0t18 0" stroke={effluentLine} strokeWidth="1.4" fill="none" />
      {[[180, 184, 31], [206, 176, 32], [236, 188, 33]].map(([x, y, s]) => <Fleck key={s} x={x} y={y} seed={s} r={3.4} />)}
      {[[180, 214, 34], [196, 218, 35], [216, 212, 36], [236, 216, 37]].map(([x, y, s]) => <Fleck key={s} x={x} y={y} seed={s} r={3.2} />)}
      <path d="M162 150V200Q162 228 188 228H232Q258 228 258 200V150" fill="none" stroke={tankLine} strokeWidth="2.6" />
    </g>
    {/* effluent pipe from the top of tank 2 to tank 3 */}
    <g opacity={o('eff')}>
      <Pipe d="M258 166H276Q284 166 284 158V104Q284 96 292 96H304" fill={effluent} line={effluentLine} w={7} />
      <Arrow from={[284, 140]} to={[284, 118]} colour={effluentLine} width={2} />
    </g>
    {/* 3 aerobic digestion: an open tank with air bubbled through */}
    <g opacity={o('s3')}>
      <path d="M304 80V124Q304 142 322 142H380Q398 142 398 124V80" fill={tank} stroke={tankLine} strokeWidth="2.6" />
      <path d="M306 90H396V124Q396 140 380 140H322Q306 140 306 124Z" fill={effluent} />
      <path d="M308 90q9 -3 18 0t18 0t18 0t18 0t16 0" stroke={effluentLine} strokeWidth="1.4" fill="none" />
      <Pipe d="M351 160V134M318 134H384" fill={oxygenFill} line={oxygen} w={3} />
      {[[322, 122, 3.5], [334, 108, 3], [346, 120, 4], [360, 104, 3], [372, 118, 3.5], [384, 100, 3], [328, 98, 2.6], [366, 94, 2.4]].map(([x, y, r], i) => <Bubble key={i} x={x} y={y} r={r} />)}
      <Bacterium x={336} y={124} rot={-20} /><Bacterium x={362} y={130} rot={15} /><Bacterium x={380} y={124} rot={-10} />
      <Fleck x={344} y={130} seed={41} r={2.4} /><Fleck x={372} y={108} seed={42} r={2} />
    </g>
    {/* treated water released to the river */}
    <g opacity={o('river')}>
      <Pipe d="M398 104H428Q436 104 436 112V118" fill={water} line={waterLine} w={6} />
      <path d="M422 142C424 124 452 118 484 120C516 122 536 128 536 140C536 150 516 154 480 154C446 154 420 152 422 142Z" fill={grass} stroke={leafLine} strokeWidth="1.4" />
      <path d="M430 138C434 128 460 126 484 128C510 130 528 134 526 140C524 146 504 148 480 147C454 146 428 145 430 138Z" fill={water} stroke={waterLine} strokeWidth="1.8" />
      <path d="M458 136q7 -3 14 0t14 0" stroke={waterLine} strokeWidth="1.4" fill="none" />
      <path d="M520 128q-2 -14 4 -22M526 128q2 -10 8 -14" stroke={leafLine} strokeWidth="2" fill="none" />
      {label && o('river') > .5 && <text x={488} y={172} textAnchor="middle" fontSize="13" fontWeight="600" fill={waterLine}>river</text>}
    </g>
    {/* sludge pipe from the bottom of tank 2 to tank 4 */}
    <g opacity={o('sludge')}>
      <Pipe d="M226 228V244Q226 252 234 252H300" fill={sludge} line={sludgeLine} w={7} />
      <Arrow from={[252, 252]} to={[276, 252]} colour={sludgeLine} width={2} />
    </g>
    {/* 4 anaerobic digestion: a sealed, rounded tank */}
    <g opacity={o('s4')}>
      <path d="M300 256C300 222 322 210 346 210C370 210 392 222 392 256V272Q392 290 374 290H318Q300 290 300 272Z" fill={tank} stroke={tankLine} strokeWidth="2.6" />
      <path d="M303 240H389V272Q389 287 374 287H318Q303 287 303 272Z" fill={sludge} />
      <path d="M303 240q11 -3 21 0t22 0t21 0t22 0" stroke={sludgeLine} strokeWidth="1.4" fill="none" />
      <Bacterium x={322} y={262} rot={20} /><Bacterium x={348} y={272} rot={-15} /><Bacterium x={372} y={258} rot={10} />
      {[[334, 254, 51], [360, 262, 52], [318, 276, 53], [376, 276, 54]].map(([x, y, s]) => <Fleck key={s} x={x} y={y} seed={s} r={2.8} />)}
      <path d="M338 211h16" stroke={tankLine} strokeWidth="4" />
    </g>
    {/* methane out of the top */}
    <g opacity={o('gas')}>
      <Pipe d="M346 210V192Q346 186 352 186H410" fill="#fbeec4" line={energy} w={5} />
      {(o('cooker') < 1 || focus === 'sewage-anaerobic') && <Arrow from={[372, 186]} to={[400, 186]} colour={energy} width={2} />}
    </g>
    <g opacity={o('cooker')}><Hob x={426} y={184} /></g>
    {/* remaining waste to fertiliser */}
    <g opacity={o('fert')}>
      <Arrow from={[396, 270]} to={[426, 270]} colour={leafLine} width={2.4} />
      <Sack x={446} y={268} /><Sack x={472} y={274} s={.8} />
    </g>

    {/* numbered stage badges */}
    <Badge n={1} x={116} y={136} solid={view.key.includes(1) && !all} on={q || view.key.includes(1) || all} />
    <Badge n={2} x={210} y={136} solid={view.key.includes(2) && !all} on={q || view.key.includes(2) || all} />
    <Badge n={3} x={351} y={62} solid={view.key.includes(3) && !all} on={q || view.key.includes(3) || all} />
    <Badge n={4} x={286} y={218} solid={view.key.includes(4) && !all} on={q || view.key.includes(4) || all} />

    {/* labels for each frame */}
    {show('sewage-route') && <g>
      <Arrow from={[40, 208]} to={[80, 208]} colour={murkyLine} width={2} />
      <Lines x={14} y={230} lines={['sewage in']} size={13} weight={600} colour={murkyLine} />
    </g>}
    {show('sewage-screening') && <ScreenZoom />}
    {show('sewage-sediment') && <g>
      {[[190, 172], [222, 168]].map(([x, y]) => <Arrow key={x} from={[x, y]} to={[x, y + 22]} colour={sludgeLine} width={1.8} />)}
      <Lines x={40} y={44} lines={['heavier solids sink']} colour={sludgeLine} />
      <Leader from={[150, 50]} to={[188, 178]} colour={sludgeLine} />
      <Lines x={236} y={36} lines={['lighter liquid floats on top']} colour={effluentLine} />
      <Leader from={[252, 42]} to={[248, 166]} colour={effluentLine} />
      <Lines x={112} y={252} lines={['sludge']} colour={sludgeLine} />
      <Leader from={[160, 246]} to={[184, 216]} colour={sludgeLine} />
    </g>}
    {show('sewage-split') && <g>
      <Lines x={136} y={52} lines={['effluent (liquid', 'waste) to stage 3']} colour={effluentLine} />
      <Leader from={[240, 74]} to={[282, 120]} colour={effluentLine} />
      <Lines x={290} y={300} anchor="end" lines={['sludge to stage 4']} colour={sludgeLine} />
      <Leader from={[258, 286]} to={[258, 257]} colour={sludgeLine} />
    </g>}
    {show('sewage-aerobic') && <g>
      <Note x={16} y={32} text="aerobic = with oxygen" />
      <Lines x={578} y={36} anchor="end" lines={['air (oxygen)', 'bubbled through']} colour={oxygen} />
      <Leader from={[470, 60]} to={[386, 100]} colour={oxygen} />
      <Lines x={16} y={70} lines={['bacteria break down organic', 'matter and other microbes']} colour={bugLine} />
      <Leader from={[266, 76]} to={[334, 122]} colour={bugLine} />
    </g>}
    {show('sewage-released') && <g>
      <Lines x={578} y={36} anchor="end" lines={['treated water released', 'into the environment']} colour={waterLine} />
      <Leader from={[500, 60]} to={[488, 128]} colour={waterLine} />
      <Arrow from={[436, 106]} to={[436, 124]} colour={waterLine} width={2} />
    </g>}
    {show('sewage-anaerobic') && <g>
      <Note x={16} y={32} text="anaerobic = without oxygen" noOxygen />
      <Lines x={418} y={191} lines={['methane gas']} colour={energy} />
      <Lines x={404} y={236} lines={['sealed: no', 'oxygen gets in']} />
      <Leader from={[400, 240]} to={[389, 246]} />
      <Lines x={292} y={300} anchor="end" lines={['bacteria break down sludge']} colour={bugLine} />
      <Leader from={[294, 292]} to={[320, 265]} colour={bugLine} />
    </g>}
    {show('sewage-products') && <g>
      <Lines x={462} y={166} lines={['methane:', 'energy source,', 'e.g. cooking']} colour={energy} />
      <Lines x={494} y={254} lines={['remaining', 'waste:', 'fertiliser']} colour={leafLine} />
    </g>}
    {show('sewage-whole') && <g>
      <Lines x={130} y={52} lines={['effluent']} colour={effluentLine} />
      <Leader from={[196, 50]} to={[282, 120]} colour={effluentLine} />
      <Lines x={290} y={300} anchor="end" lines={['sludge']} colour={sludgeLine} />
      <Leader from={[252, 290]} to={[256, 257]} colour={sludgeLine} />
      <Lines x={458} y={206} lines={['methane']} colour={energy} />
      <Lines x={494} y={276} lines={['fertiliser']} colour={leafLine} />
    </g>}

    {/* key: the four stages, the one being taught in bold */}
    {!q && <g>
      <path d="M4 316H564" stroke="#d5e2ea" strokeWidth="1.4" />
      {STAGES.map((name, i) => {
        const x = i % 2 ? 314 : 44, y = i < 2 ? 336 : 364, active = view.key.includes(i + 1)
        return <g key={name} opacity={active ? 1 : .4}>
          <Badge n={i + 1} x={x + 12} y={y - 5} solid={active && !all} />
          <text x={x + 32} y={y} fontSize="14" fontWeight={active && !all ? 700 : 600} fill={ink}>{name}</text>
        </g>
      })}
    </g>}
  </Diagram>
}

// Screening close-up: the bars of the screen catch a twig and a plastic bag; grit collects at the bottom.
function ScreenZoom() {
  const clip = useId()
  const cx = 236, cy = 70, r = 52
  return <g>
    <path d={`M${cx - 44} ${cy + 28}L120 150M${cx - 20} ${cy + 48}L136 152`} stroke={muted} strokeWidth="1.3" strokeDasharray="4 4" />
    <circle cx={cx} cy={cy} r={r + 3} fill="white" stroke={murkyLine} strokeWidth="3" />
    <clipPath id={clip}><circle cx={cx} cy={cy} r={r} /></clipPath>
    <g clipPath={`url(#${clip})`}>
      <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="#e4e6cf" />
      <path d={`M${cx - r} ${cy - 30}q10 -4 20 0t20 0t20 0t20 0t20 0t20 0`} stroke={murkyLine} strokeWidth="1.5" fill="none" />
      {[cx + 10, cx + 22, cx + 34].map(x => <path key={x} d={`M${x} ${cy - r}V${cy + r}`} stroke="#56687a" strokeWidth="4" />)}
      <path d={`M${cx - 36} ${cy - 16}L${cx + 6} ${cy - 4}M${cx - 16} ${cy - 10}l6 -12M${cx - 26} ${cy - 13}l-4 10`} stroke="#8a6843" strokeWidth="3.5" fill="none" />
      <path d={`M${cx - 20} ${cy + 22}C${cx - 30} ${cy + 6} ${cx - 16} ${cy - 2} ${cx - 4} ${cy + 4}L${cx + 4} ${cy}C${cx + 8} ${cy + 8} ${cx + 8} ${cy + 22} ${cx} ${cy + 28}C${cx - 8} ${cy + 32} ${cx - 16} ${cy + 30} ${cx - 20} ${cy + 22}Z`} fill="#f7f4fa" stroke="#9a8fb0" strokeWidth="1.8" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={blob(cx - 44 + i * 4 + (i % 3) * 2, cy + 44 - (i % 4 === 1 ? 5 : 0) - (i > 3 && i < 10 ? 3 : 0), 3.4, 2.6, i + 60, .3, 6)} fill="#c7bba6" stroke="#8e8270" strokeWidth="1" />)}
    </g>
    <Lines x={14} y={26} lines={['large bits: twigs,', 'plastic bags']} />
    <Leader from={[150, 40]} to={[cx - 20, cy - 10]} />
    <Lines x={14} y={70} lines={['grit: small bits of', 'stone and sand']} />
    <Leader from={[150, 82]} to={[cx - 30, cy + 40]} />
    <Lines x={304} y={36} lines={['screen']} />
    <Leader from={[304, 42]} to={[cx + 22, cy - 26]} />
  </g>
}

// A small boxed note, e.g. "aerobic = with oxygen". The anaerobic note carries a crossed-out O2 sign.
function Note({ x, y, text, noOxygen = false }: { x: number; y: number; text: string; noOxygen?: boolean }) {
  const w = text.length * 8.7 + 24 + (noOxygen ? 30 : 0)
  return <g>
    <rect x={x} y={y - 20} width={w} height={30} rx="15" fill={oxygenFill} stroke={oxygen} strokeWidth="1.6" />
    <text x={x + 12} y={y} fontSize="14" fontWeight="700" fill={ink}>{text}</text>
    {noOxygen && <g transform={`translate(${x + w - 22} ${y - 5})`}>
      <circle r="11" fill="white" stroke={oxygen} strokeWidth="1.6" />
      <text y="4.5" textAnchor="middle" fontSize="12" fontWeight="700" fill={oxygen}>O<tspan fontSize="9" dy="3">2</tspan></text>
      <path d="M-8 8L8 -8" stroke={bad} strokeWidth="2.4" />
    </g>}
  </g>
}

// ---------- Trade-offs ----------
function Compare() {
  const pills = (x: number, n: number, colour: string, line: string) => Array.from({ length: n }, (_, i) => <rect key={i} x={x} y={200 - i * 30} width={64} height={22} rx="11" fill={colour} stroke={line} strokeWidth="1.6" />)
  return <Diagram title="Treating waste water needs more stages than treating fresh water, but it needs less energy than desalination of salt water.">
    <text x={130} y={34} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Stages</text>
    <text x={400} y={34} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Energy needed</text>
    <path d="M270 24V250" stroke="#d5e2ea" strokeWidth="1.5" strokeDasharray="4 5" />
    {pills(50, 2, water, waterLine)}
    {pills(146, 4, murky, murkyLine)}
    <Lines x={82} y={248} anchor="middle" lines={['fresh', 'water']} size={13} weight={600} colour={muted} />
    <Lines x={178} y={248} anchor="middle" lines={['waste', 'water']} size={13} weight={600} colour={muted} />
    <Lines x={178} y={66} anchor="middle" lines={['more stages']} colour={murkyLine} />
    {/* schematic energy bars, no numbers */}
    <path d="M310 60V224H500" stroke={muted} strokeWidth="1.6" fill="none" />
    <rect x={334} y={164} width={50} height={60} rx="10" fill={murky} stroke={murkyLine} strokeWidth="1.6" />
    <rect x={420} y={74} width={50} height={150} rx="10" fill={flameIn} stroke={heatLine} strokeWidth="1.6" />
    <Flame x={445} y={64} s={1.1} />
    <Lines x={359} y={248} anchor="middle" lines={['waste', 'water']} size={13} weight={600} colour={muted} />
    <Lines x={445} y={248} anchor="middle" lines={['desalination', '(salt water)']} size={13} weight={600} colour={muted} />
    <Lines x={359} y={120} anchor="middle" lines={['less', 'energy']} colour={murkyLine} />
    <Caption y={290} text="More stages, but less energy than desalination" />
  </Diagram>
}
function Option() {
  return <Diagram title="In a dry area with a low reservoir, treated waste water could be an option for fresh water. Some people dislike the idea of drinking water that used to be sewage.">
    {/* dry ground, a low reservoir and the Sun */}
    <circle cx={60} cy={50} r={20} fill={flameIn} stroke="#e0b13c" strokeWidth="2" />
    <path d="M0 130Q100 118 200 130T400 128T540 130V168H0Z" fill="#f3e2c2" stroke="#d2b98c" strokeWidth="1.6" />
    <path d="M40 150l12 -6l8 8M90 156l10 -8l12 6M170 150l8 6l12 -8" stroke="#c6a773" strokeWidth="1.4" fill="none" />
    <path d="M214 132C220 160 320 164 330 132Z" fill="#efe0c2" stroke="#c9ad7c" strokeWidth="1.6" />
    <path d="M238 146C250 158 296 158 308 146Z" fill={water} stroke={waterLine} strokeWidth="1.6" />
    <text x={272} y={186} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>reservoir: very low</text>
    {/* the plant sending treated water to the reservoir */}
    <path d="M400 128V104Q400 96 408 96H440Q448 96 448 104V128Z" fill={tank} stroke={tankLine} strokeWidth="2" />
    <path d="M456 128V106Q456 80 476 80Q496 80 496 106V128Z" fill={tank} stroke={tankLine} strokeWidth="2" />
    <text x={448} y={70} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>treatment plant</text>
    <Pipe d="M400 116H350Q336 116 326 136" fill={water} line={waterLine} w={5} />
    <Arrow from={[372, 116]} to={[352, 116]} colour={waterLine} width={2} />
    {/* the two points */}
    <Tick x={40} y={222} />
    <Lines x={62} y={218} lines={['an option where there', 'is little fresh water']} />
    <g transform="translate(300 222)">
      <circle r="14" fill="#fdf1dc" stroke={muted} strokeWidth="2" />
      <circle cx="-5" cy="-3" r="1.8" fill={ink} /><circle cx="5" cy="-3" r="1.8" fill={ink} />
      <path d="M-5 7h10" stroke={ink} strokeWidth="2" />
    </g>
    <Lines x={322} y={218} lines={['some people dislike the', 'idea of drinking it']} />
    <Caption y={288} text="Less energy than desalination, but not everyone likes it" />
  </Diagram>
}
function Toxic() {
  return <Diagram title="Waste water with toxic substances needs extra treatment stages: adding chemicals, UV radiation, or passing it through membranes.">
    {/* factory pipe with toxic waste water */}
    <path d="M18 150V96L40 84V96L62 84V150Z" fill="#e6e9ee" stroke="#7a8796" strokeWidth="2" />
    <Pipe d="M62 136H102" fill={murky} line={murkyLine} w={10} />
    <path d="M40 22L58 52H22Z" fill="#fce7a8" stroke="#b98a17" strokeWidth="2" />
    <path d="M40 32V42" stroke="#8a6410" strokeWidth="2.6" /><circle cx={40} cy={47} r="1.6" fill="#8a6410" />
    <Lines x={66} y={32} lines={['toxic', 'substances']} colour="#8a6410" />
    {/* the three extra stages */}
    <path d="M110 76Q110 64 122 64H458Q470 64 470 76" stroke={muted} strokeWidth="1.6" fill="none" />
    <text x={290} y={54} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>extra stages</text>
    {[120, 238, 356].map(x => <rect key={x} x={x} y={90} width={104} height={100} rx="18" fill="#f7fafc" stroke="#d5e2ea" strokeWidth="1.6" />)}
    {/* dropper */}
    <g>
      <path d="M166 104h12v10h-12z" fill="#b7a0d8" stroke="#6f55a0" strokeWidth="1.5" />
      <path d="M168 114h8v28l-4 8l-4 -8z" fill="#f5fafd" stroke="#6f8fa6" strokeWidth="1.6" />
      <path d="M172 158q-4 6 0 8q4 -2 0 -8z" fill="#cfe6d6" stroke={good} strokeWidth="1.3" />
    </g>
    {/* UV lamp */}
    <g>
      <rect x={262} y={112} width={56} height={14} rx="7" fill="#e9dcfb" stroke="#7c5fb3" strokeWidth="1.6" />
      {[270, 284, 298, 312].map(x => <path key={x} d={`M${x} 132l-3 8l4 2l-3 8`} stroke="#7c5fb3" strokeWidth="1.6" fill="none" />)}
    </g>
    {/* membrane */}
    <g>
      <path d="M408 102C404 122 412 142 408 164" stroke="#6f8fa6" strokeWidth="4" fill="none" strokeDasharray="2 4" />
      <Arrow from={[374, 134]} to={[400, 134]} colour={waterLine} width={2} />
      <Arrow from={[416, 134]} to={[442, 134]} colour={waterLine} width={2} />
    </g>
    <Lines x={172} y={210} anchor="middle" lines={['adding', 'chemicals']} size={13} />
    <Lines x={290} y={210} anchor="middle" lines={['UV', 'radiation']} size={13} />
    <Lines x={408} y={210} anchor="middle" lines={['membranes']} size={13} />
    <Arrow from={[104, 136]} to={[116, 136]} colour={murkyLine} width={2} />
    <Arrow from={[226, 140]} to={[236, 140]} colour={muted} width={2} />
    <Arrow from={[344, 140]} to={[354, 140]} colour={muted} width={2} />
    <Arrow from={[462, 140]} to={[508, 140]} colour={waterLine} width={2.4} />
    <Lines x={500} y={170} anchor="middle" lines={['treated']} size={13} weight={600} colour={waterLine} />
    <Caption y={270} text="Toxic waste water needs more treatment" />
  </Diagram>
}

export function SewageVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (['sewage-homes', 'sewage-sources', 'sewage-pollutants', 'sewage-return'].includes(focus)) return <TownScene focus={focus} />
  if (focus === 'sewage-compare') return <Compare />
  if (focus === 'sewage-option') return <Option />
  if (focus === 'sewage-toxic') return <Toxic />
  return <Plant focus={focus} assessment={assessment} />
}

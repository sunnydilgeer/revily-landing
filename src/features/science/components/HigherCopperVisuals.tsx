import type { ReactNode } from 'react'
import { blob, Bacterium } from './InfectionVisuals'
import { resPalette as P, Diagram, Lines, Arrow, CurveArrow, Card, StepBadge, Heap, Rock, Stump, Flame, Ingot } from './ResourceVisuals'

/*
 * Chemistry C10, a lesson only some students get (Chemistry Lesson 50H): extracting copper from low-grade ores by
 * bioleaching and phytomining. Original, code-native schematics; not to scale. Focus ids start with 'hcopper-'.
 *
 * Same hand-drawn objects and colours as the neighbouring resources lessons (ResourceVisuals.tsx, RecycleVisuals.tsx):
 * warm grey-brown rock and soil, green plants, soft grey iron, orange flames. Copper metal and copper compounds are
 * copper-orange; copper ions in solution are blue dots in a blue solution; bacteria are the course's pink rods
 * (InfectionVisuals). Amber marks what the frame is about; earlier parts of the drawing are faded and later parts are
 * not drawn yet, so each section builds one picture. The last frame of each shows it all. Question views keep the
 * numbers and hide the words that would give the answer away.
 */
const { ink, muted, panelFill, panelLine } = P
const cu = '#e3a173', cuLine = '#9a5a32', cuInk = '#8a4a22'
const sol = '#d3e9f8', solLine = '#3f86b8', ion = '#3a86c4', solInk = '#21608f'
const ash = '#d9d4ce', ashLine = '#8b847c'
const amber = '#d98a1c', amberInk = '#8a5a14', amberSoft = '#fdf0d8'
const good = '#4f8a55', goodSoft = '#e6f3e2'
const dried = '#dcc48e', driedLine = '#9a7c3e'
const faded = 0.3

type Pt = [number, number]
function T({ x, y, children, size = 14, bold = true, colour = ink, anchor = 'middle' }: { x: number; y: number; children: ReactNode; size?: number; bold?: boolean; colour?: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} fontSize={size} fontWeight={bold ? 700 : 500} fill={colour} textAnchor={anchor}>{children}</text>
}
function Chip({ x, y, w, lines, tone = 'amber', size = 13 }: { x: number; y: number; w: number; lines: string[]; tone?: 'amber' | 'good' | 'blue' | 'plain'; size?: number }) {
  const [fill, line, text] = tone === 'amber' ? [amberSoft, amber, amberInk] : tone === 'good' ? [goodSoft, good, good] : tone === 'blue' ? [sol, solLine, solInk] : [panelFill, panelLine, ink]
  const h = lines.length * (size + 4) + 12
  return <g>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="12" fill={fill} stroke={line} strokeWidth="1.6" />
    <Lines x={x} y={y - h / 2 + 6 + size} lines={lines} anchor="middle" size={size} colour={text} />
  </g>
}
function Show({ on, dim, children }: { on: boolean; dim?: boolean; children: ReactNode }) {
  return on ? <g opacity={dim ? faded : 1}>{children}</g> : null
}
/** A numbered pointer for question views: a dark circle with a short leader to the part. */
function Pointer({ n, at, to }: { n: number; at: Pt; to: Pt }) {
  return <g>
    <path d={`M${at[0]} ${at[1]}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" />
    <circle cx={to[0]} cy={to[1]} r="3" fill={ink} />
    <StepBadge n={n} x={at[0]} y={at[1]} />
  </g>
}

// ---------- Small objects ----------
/** A lump of ore: rock with copper-orange specks of copper compound. More specks = more copper. */
function Ore({ x, y, rx, ry, specks, seed = 3 }: { x: number; y: number; rx: number; ry: number; specks: number; seed?: number }) {
  const spots: Pt[] = [[-.45, -.1], [.15, -.5], [.5, .15], [-.15, .45], [.0, -.05], [-.3, -.5], [.4, -.35], [.3, .5], [-.55, .35], [-.2, .15], [.25, .1], [.6, -.1]]
  return <g>
    <path d={blob(x, y, rx, ry, seed, .12, .85, 12)} fill={P.rock} stroke={P.rockLine} strokeWidth="1.8" />
    {spots.slice(0, specks).map(([dx, dy], i) => <path key={i} d={blob(x + dx * rx, y + dy * ry, 4.2, 3.4, seed + i * 7, .15, 1, 8)} fill={cu} stroke={cuLine} strokeWidth="1" />)}
  </g>
}
function Bug({ x, y, angle = 0, s = .42, seed = 2 }: { x: number; y: number; angle?: number; s?: number; seed?: number }) {
  return <Bacterium cx={x} cy={y} length={64 * s} thick={26 * s} angle={angle} seed={seed} />
}
function Ions({ pts, r = 3.6 }: { pts: Pt[]; r?: number }) {
  return <g>{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} fill={ion} stroke="white" strokeWidth="1" />)}</g>
}
/** A beaker with a solution; level is the liquid top. */
function Beaker({ x, y, w, h, level, fill = sol, line = solLine, children }: { x: number; y: number; w: number; h: number; level: number; fill?: string; line?: string; children?: ReactNode }) {
  return <g>
    <path d={`M${x + 3} ${level}H${x + w - 3}V${y + h - 8}Q${x + w - 3} ${y + h - 3} ${x + w - 8} ${y + h - 3}H${x + 8}Q${x + 3} ${y + h - 3} ${x + 3} ${y + h - 8}Z`} fill={fill} stroke="none" />
    <path d={`M${x + 3} ${level}H${x + w - 3}`} stroke={line} strokeWidth="1.4" opacity=".7" />
    {children}
    <path d={`M${x - 4} ${y}Q${x} ${y} ${x} ${y + 6}V${y + h - 8}Q${x} ${y + h} ${x + 8} ${y + h}H${x + w - 8}Q${x + w} ${y + h} ${x + w} ${y + h - 8}V${y + 6}Q${x + w} ${y} ${x + w + 4} ${y}`} fill="none" stroke="#6f8798" strokeWidth="2" />
  </g>
}
function CopperWire({ x, y }: { x: number; y: number }) {
  return <g>
    {[0, 1, 2, 3, 4].map(i => <ellipse key={i} cx={x - 16 + i * 8} cy={y} rx={10} ry={22} fill="none" stroke={cuLine} strokeWidth="5" />)}
    {[0, 1, 2, 3, 4].map(i => <ellipse key={i} cx={x - 16 + i * 8} cy={y} rx={10} ry={22} fill="none" stroke={cu} strokeWidth="2.6" />)}
    <path d={`M${x + 20} ${y + 18}C${x + 34} ${y + 26} ${x + 40} ${y + 10} ${x + 48} ${y + 18}`} stroke={cuLine} strokeWidth="5" fill="none" />
    <path d={`M${x + 20} ${y + 18}C${x + 34} ${y + 26} ${x + 40} ${y + 10} ${x + 48} ${y + 18}`} stroke={cu} strokeWidth="2.6" fill="none" />
  </g>
}
function CopperPipe({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 26} ${y + 30}V${y}Q${x - 26} ${y - 20} ${x - 6} ${y - 20}H${x + 26}V${y - 4}H${x - 4}Q${x - 10} ${y - 4} ${x - 10} ${y + 2}V${y + 30}Z`} fill={cu} stroke={cuLine} strokeWidth="1.8" />
    <path d={`M${x - 21} ${y + 26}V${y + 2}Q${x - 21} ${y - 14} ${x - 6} ${y - 14}H${x + 20}`} stroke="white" strokeWidth="2" fill="none" opacity=".55" />
    <rect x={x - 30} y={y + 24} width={24} height={8} rx="3" fill={cu} stroke={cuLine} strokeWidth="1.6" />
  </g>
}
function CopperIngot({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-28 0L-20 -18H20L28 0Z" fill={cu} stroke={cuLine} strokeWidth="1.8" />
    <path d="M-14 -13H10" stroke="white" strokeWidth="2.4" opacity=".8" />
  </g>
}
function Digger({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x={-30} y={-12} width={52} height={12} rx="6" fill={P.rubber} stroke={P.rubberLine} strokeWidth="1.5" />
    <rect x={-26} y={-32} width={38} height={20} rx="5" fill="#f2c08d" stroke="#b97434" strokeWidth="1.6" />
    <rect x={-22} y={-46} width={18} height={16} rx="4" fill="#f2c08d" stroke="#b97434" strokeWidth="1.6" />
    <rect x={-18} y={-43} width={10} height={8} rx="2" fill="white" stroke="#b97434" strokeWidth="1" />
    <path d="M10 -26L30 -44L44 -22" stroke="#b97434" strokeWidth="4" fill="none" />
    <path d="M38 -24L50 -26L46 -12Q40 -12 38 -24Z" fill="#c9cfd4" stroke={P.metalLine} strokeWidth="1.4" />
  </g>
}
/** A plant on the soil line y. Copper dots in the leaves show copper building up; roots go down into the soil. */
function Plant({ x, y, h = 112, copper = 0, seed = 1, roots = true }: { x: number; y: number; h?: number; copper?: number; seed?: number; roots?: boolean }) {
  const leaves: [number, number, number][] = [[-1, .3, 1], [1, .45, .95], [-1, .62, .85], [1, .76, .75], [-1, .9, .6]]
  return <g>
    {roots && <path d={`M${x} ${y}C${x - 6} ${y + 12} ${x - 14} ${y + 18} ${x - 20} ${y + 30}M${x} ${y}C${x + 2} ${y + 14} ${x + 4} ${y + 24} ${x + 2} ${y + 38}M${x} ${y}C${x + 8} ${y + 10} ${x + 16} ${y + 16} ${x + 22} ${y + 26}`} stroke="#b59572" strokeWidth="1.8" fill="none" />}
    <path d={`M${x} ${y}C${x + 2} ${y - h * .4} ${x - 2} ${y - h * .7} ${x} ${y - h}`} stroke={P.leafLine} strokeWidth="3" fill="none" />
    {leaves.map(([side, t, k], i) => {
      const ly = y - h * t, lx = x + side * 2, len = 36 * k
      const d = `M${lx} ${ly}C${lx + side * len * .3} ${ly - 14 * k} ${lx + side * len * .8} ${ly - 14 * k} ${lx + side * len} ${ly - 4 * k}C${lx + side * len * .7} ${ly + 6 * k} ${lx + side * len * .3} ${ly + 6 * k} ${lx} ${ly}Z`
      return <g key={i}>
        <path d={d} fill={P.leaf} stroke={P.leafLine} strokeWidth="1.5" />
        {copper > 0 && Array.from({ length: Math.min(copper, 2) }, (_, j) => <circle key={j} cx={lx + side * len * (.45 + j * .28)} cy={ly - 4 * k} r={2} fill={cu} stroke={cuLine} strokeWidth=".7" />)}
      </g>
    })}
    <path d={blob(x, y - h - 4, 6, 5, seed, .1)} fill={P.leaf} stroke={P.leafLine} strokeWidth="1.4" />
  </g>
}
function DriedBundle({ x, y }: { x: number; y: number }) {
  return <g>
    {[-16, -8, 0, 8, 16].map((dx, i) => <path key={i} d={`M${x + dx * .4} ${y}C${x + dx * .6} ${y - 30} ${x + dx * 1.6} ${y - 52} ${x + dx * 2.2} ${y - 70}`} stroke={driedLine} strokeWidth="2.2" fill="none" />)}
    {[-30, -14, 4, 22, 34].map((dx, i) => <path key={i} d={blob(x + dx * .9, y - 60 + (i % 2) * 10, 9, 5, 40 + i, .2, 1, 8)} fill={dried} stroke={driedLine} strokeWidth="1.3" />)}
    <rect x={x - 12} y={y - 26} width={24} height={9} rx="4" fill="#c99a6a" stroke={P.trunkLine} strokeWidth="1.4" />
  </g>
}
function Furnace({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x={14} y={-84} width={14} height={30} rx="3" fill={P.brick} stroke={P.brickLine} strokeWidth="1.6" />
    <path d="M-36 0V-40Q-36 -66 0 -66Q36 -66 36 -40V0Z" fill={P.brick} stroke={P.brickLine} strokeWidth="1.8" />
    <path d="M-36 -22H36M-36 -44H36M-12 0V-22M12 -22V-44M-14 -44V-60" stroke={P.brickLine} strokeWidth="1" opacity=".45" />
    <path d="M-19 0V-18Q-19 -34 0 -34Q19 -34 19 -18V0Z" fill="#fbe2b8" stroke={P.brickLine} strokeWidth="1.6" />
    <path d="M-12 -4L10 -12M-10 -10L12 -4" stroke={driedLine} strokeWidth="2" />
    <Flame x={-7} y={-2} s={.8} /><Flame x={6} y={-2} s={1} />
  </g>
}
function AshHeap({ x, y, w = 76, h = 34 }: { x: number; y: number; w?: number; h?: number }) {
  const specks: Pt[] = [[-.22, .35], [.12, .55], [.26, .22], [-.05, .2], [-.3, .15], [.02, .8]]
  return <g>
    <Heap x={x} y={y} w={w} h={h} fill={ash} line={ashLine} lumps={false} />
    {specks.map(([dx, dy], i) => <circle key={i} cx={x + dx * w} cy={y - h * dy} r={2.8} fill={cu} stroke={cuLine} strokeWidth=".9" />)}
  </g>
}
function Battery({ x, y }: { x: number; y: number }) {
  return <g>
    {/* short thick plate = negative (left), long thin plate = positive (right) */}
    <path d={`M${x - 6} ${y - 6}V${y + 6}`} stroke={ink} strokeWidth="4.5" />
    <path d={`M${x + 6} ${y - 12}V${y + 12}`} stroke={ink} strokeWidth="2.4" />
  </g>
}

// ---------- Section 1: copper is running short ----------
type ShortStage = 'finite' | 'grades' | 'running' | 'mining' | 'all'
const SHORT_TITLES: Record<ShortStage, string> = {
  finite: 'Copper wire and a copper pipe. Copper is a finite resource: there is only so much of it, and it will run out.',
  grades: 'Two lumps of ore. The copper-rich ore has lots of copper specks. The low-grade ore has only a few.',
  running: 'The copper-rich ore is running out, shown by a small lump inside a dashed outline. There is still lots of low-grade ore.',
  mining: 'Traditional mining: a digger moves rock, a large heap of waste rock is dumped, and trees are cut down. This damages the environment.',
  all: 'Copper is finite, copper-rich ore is running out, and traditional mining damages the environment. New ways get copper from low-grade ore: bioleaching uses bacteria and phytomining uses plants.',
}
function ShortScene({ stage }: { stage: ShortStage }) {
  const s = ['finite', 'grades', 'running', 'mining', 'all'].indexOf(stage)
  const all = stage === 'all'
  return <Diagram viewBox="0 0 600 330" title={SHORT_TITLES[stage]}>
    {/* 1 copper is finite */}
    <Card x={10} y={12} w={184} h={232} dim={!(s === 0 || all)}>
      <StepBadge n={1} x={34} y={36} />
      <CopperWire x={70} y={118} />
      <CopperPipe x={152} y={122} />
      <Lines x={102} y={200} anchor="middle" lines={['copper is a', 'finite resource']} size={14} />
    </Card>
    {/* 2 rich and low-grade ores */}
    {s >= 1 ? <Card x={208} y={12} w={184} h={232} dim={s === 3}>
      <StepBadge n={2} x={232} y={36} />
      {stage === 'running' || s >= 3
        ? <g><path d={blob(255, 112, 34, 27, 3, .12, .85, 12)} fill="none" stroke={amber} strokeWidth="1.6" strokeDasharray="5 5" /><Ore x={255} y={120} rx={18} ry={14} specks={3} seed={3} /></g>
        : <Ore x={255} y={112} rx={34} ry={27} specks={12} seed={3} />}
      <Ore x={344} y={112} rx={34} ry={27} specks={2} seed={8} />
      <T x={255} y={166} size={13} colour={cuInk}>copper-rich</T>
      <T x={344} y={166} size={13}>low-grade</T>
      {stage === 'running' || s >= 3
        ? <g><T x={255} y={190} size={13} colour={amberInk}>running out</T><T x={344} y={190} size={13} colour={good}>lots left</T></g>
        : <g><T x={255} y={190} size={12} bold={false} colour={muted}>lots of copper</T><T x={344} y={190} size={12} bold={false} colour={muted}>a little copper</T></g>}
      <T x={300} y={226} size={14}>two kinds of ore</T>
    </Card> : <Card x={208} y={12} w={184} h={232} dim />}
    {/* 3 traditional mining */}
    {s >= 3 ? <Card x={406} y={12} w={184} h={232} dim={false}>
      <StepBadge n={3} x={430} y={36} />
      <Heap x={530} y={150} w={88} h={58} />
      <Digger x={452} y={150} />
      <Stump x={430} y={176} s={.9} /><Stump x={470} y={182} s={.75} /><Stump x={560} y={180} s={.8} />
      <path d="M414 182Q500 170 584 182" stroke={P.soilLine} strokeWidth="1.6" fill="none" />
      <Lines x={498} y={208} anchor="middle" lines={['dig, move and dump', 'rock: damaging']} size={13} />
    </Card> : <Card x={406} y={12} w={184} h={232} dim />}
    {/* the new ways */}
    {all && <g>
      <rect x={10} y={258} width={580} height={64} rx="16" fill={goodSoft} stroke={good} strokeWidth="1.6" />
      <Lines x={110} y={284} anchor="middle" lines={['new ways for', 'low-grade ore']} size={14} colour={good} />
      <Bug x={236} y={290} angle={-15} s={.5} />
      <T x={270} y={295} anchor="start" size={14}>bioleaching</T>
      <Plant x={420} y={314} h={50} roots={false} />
      <T x={458} y={295} anchor="start" size={14}>phytomining</T>
    </g>}
  </Diagram>
}

// ---------- Section 2: bioleaching ----------
type BioStage = 'bacteria' | 'added' | 'soluble' | 'leachate' | 'all'
const BIO_TITLES: Record<BioStage, string> = {
  bacteria: 'A tank of solution with bacteria in it, next to a heap of low-grade copper ore.',
  added: 'The low-grade ore is added to the tank, so the ore sits in the solution with the bacteria.',
  soluble: 'A close-up of the ore in the tank: bacteria turn the copper compounds in the rock into soluble copper compounds, which go into the solution as copper ions.',
  leachate: 'The solution is run off from the tank into a beaker. This solution, the leachate, is blue and contains copper ions.',
  all: 'Bioleaching in three steps: 1 low-grade ore is added to a solution of bacteria; 2 the bacteria make the copper compounds soluble; 3 a leachate containing copper ions is collected.',
}
function BioScene({ stage }: { stage: BioStage }) {
  const s = ['bacteria', 'added', 'soluble', 'leachate', 'all'].indexOf(stage)
  const all = stage === 'all'
  const blue = s >= 3
  const tankIons: Pt[] = [[196, 160], [238, 150], [286, 166], [318, 150], [214, 194], [304, 196], [262, 186]]
  return <Diagram viewBox="0 0 600 330" title={BIO_TITLES[stage]}>
    {/* the ore heap, which empties into the tank */}
    <Show on dim={s >= 2 && !all}>
      {s === 0 ? <g>
        {[[44, 228, 2], [80, 226, 3], [62, 206, 1], [104, 230, 2], [92, 206, 2]].map(([x, y, n], i) => <Ore key={i} x={x} y={y} rx={18} ry={13} specks={n} seed={11 + i} />)}
      </g> : <g>{[[56, 230, 2], [88, 230, 1]].map(([x, y, n], i) => <Ore key={i} x={x} y={y} rx={16} ry={11} specks={n} seed={21 + i} />)}</g>}
      <Lines x={74} y={268} anchor="middle" lines={['low-grade', 'copper ore']} size={13} />
    </Show>
    {s >= 1 && <Show on dim={s >= 2 && !all}><CurveArrow from={[86, 186]} c={[110, 92]} to={[178, 110]} colour={amber} width={2.6} /></Show>}
    {/* the tank */}
    <Show on dim={s === 2}>
      <Beaker x={166} y={92} w={180} h={150} level={118} fill={blue ? sol : '#eef6fb'} line={blue ? solLine : '#9cc3dc'}>
        {blue && <Ions pts={tankIons} />}
        {s >= 1 && <g>{[[196, 226, 2], [232, 228, 3], [268, 226, 2], [306, 228, 3], [214, 210, 2], [286, 210, 2]].map(([x, y, n], i) => <Ore key={i} x={x} y={y} rx={17} ry={11} specks={blue ? 0 : n} seed={31 + i} />)}</g>}
        <Bug x={200} y={142} angle={-20} /><Bug x={252} y={132} angle={14} seed={4} /><Bug x={306} y={140} angle={-8} seed={6} />
        <Bug x={224} y={176} angle={24} seed={8} /><Bug x={286} y={182} angle={-26} seed={9} />
      </Beaker>
      <Lines x={256} y={268} anchor="middle" lines={['solution containing', 'bacteria']} size={13} />
    </Show>
    {/* close-up: copper compounds made soluble */}
    {(stage === 'soluble' || all) && <Show on dim={false}>
      <path d="M300 214L410 150" stroke={amber} strokeWidth="1.6" strokeDasharray="4 4" />
      <circle cx={300} cy={214} r={20} fill="none" stroke={amber} strokeWidth="2" />
      <circle cx={470} cy={102} r={78} fill="#eef6fb" stroke={amber} strokeWidth="2.4" />
      <path d="M397.2 130Q430 122 470 128T542.8 130A78 78 0 0 1 397.2 130Z" fill={P.rock} stroke={P.rockLine} strokeWidth="1.6" />
      {[[424, 140], [458, 146], [492, 140], [522, 146]].map(([x, y], i) => <path key={i} d={blob(x, y, 7, 5, 60 + i, .15, 1, 8)} fill={cu} stroke={cuLine} strokeWidth="1.2" />)}
      <Bug x={436} y={112} angle={-10} s={.55} seed={3} /><Bug x={508} y={110} angle={16} s={.55} seed={5} />
      {[[452, 74], [478, 58], [500, 80], [470, 92], [524, 68]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4.6} fill={ion} stroke="white" strokeWidth="1.1" />)}
      <Arrow from={[466, 128]} to={[466, 100]} colour={solLine} width={1.8} />
      <Arrow from={[492, 132]} to={[492, 104]} colour={solLine} width={1.8} />
      {!all && <Lines x={470} y={208} anchor="middle" lines={['bacteria make the copper', 'compounds soluble']} size={13} colour={amberInk} />}
    </Show>}
    {/* leachate */}
    {s >= 3 && <g>
      <path d="M346 230H372V244" stroke="#6f8798" strokeWidth="5" fill="none" />
      <rect x={364} y={222} width={10} height={14} rx="2" fill="#9aa8b4" stroke="#6f8798" strokeWidth="1.3" />
      <circle cx={372} cy={254} r={3} fill={ion} />
      <Beaker x={344} y={260} w={60} h={56} level={276} >
        <Ions pts={[[358, 290], [374, 300], [390, 288], [366, 306], [386, 306]]} r={3.2} />
      </Beaker>
      <Lines x={414} y={282} anchor="start" lines={['leachate: contains', 'copper ions, Cu²⁺']} size={13} colour={solInk} />
    </g>}
    {all && <g>
      <StepBadge n={1} x={136} y={70} />
      <StepBadge n={2} x={392} y={46} />
      <StepBadge n={3} x={330} y={286} />
    </g>}
  </Diagram>
}

// ---------- Section 3: phytomining ----------
type PhytoStage = 'grow' | 'absorb' | 'harvest' | 'burn' | 'all' | 'question'
const PHYTO_TITLES: Record<PhytoStage, string> = {
  grow: 'Plants growing in soil that contains copper compounds, shown as copper-coloured specks in the soil.',
  absorb: 'The roots take up copper compounds. The plants cannot use the copper or get rid of it, so copper builds up in the leaves.',
  harvest: 'The plants are cut down, collected and dried.',
  burn: 'The dried plants are burned in a furnace. The ash left behind contains soluble copper compounds.',
  all: 'Phytomining in four steps: 1 plants grow in soil containing copper; 2 copper builds up in the leaves; 3 the plants are harvested and dried; 4 they are burned and the ash contains soluble copper compounds.',
  question: 'A diagram of phytomining with four numbered points: 1 the roots in the soil, 2 the leaves, 3 a furnace, 4 a heap of ash.',
}
function PhytoScene({ stage, hide = false }: { stage: PhytoStage; hide?: boolean }) {
  const q = stage === 'question'
  const all = stage === 'all' || q
  const s = all ? 4 : ['grow', 'absorb', 'harvest', 'burn'].indexOf(stage)
  const soil: Pt[] = [[34, 248], [62, 270], [92, 252], [118, 276], [148, 250], [176, 272], [204, 254], [226, 280], [48, 290], [140, 292], [190, 294], [100, 296]]
  return <Diagram viewBox="0 0 600 330" title={hide ? 'A diagram of phytomining: plants growing in soil, a bundle of dried plants, a furnace and a heap of ash, with four numbered points.' : PHYTO_TITLES[stage]}>
    <Show on dim={s >= 2 && !all}>
      <path d="M14 232Q124 222 238 232V304Q238 310 232 310H20Q14 310 14 304Z" fill={P.soil} stroke={P.soilLine} strokeWidth="1.8" />
      {soil.map(([x, y], i) => <path key={i} d={blob(x, y, 4, 3.2, 80 + i, .15, 1, 8)} fill={cu} stroke={cuLine} strokeWidth="1" />)}
      <Plant x={62} y={232} copper={s >= 1 && !hide ? 2 : 0} seed={2} />
      <Plant x={126} y={230} h={124} copper={s >= 1 && !hide ? 2 : 0} seed={5} />
      <Plant x={190} y={232} copper={s >= 1 && !hide ? 2 : 0} seed={7} />
      {s >= 1 && !q && <g>
        {[[126, 216], [126, 196], [126, 176]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.8} fill={cu} stroke={cuLine} strokeWidth=".9" />)}
        <Arrow from={[142, 228]} to={[142, 186]} colour={cuLine} width={2} />
      </g>}
      {!hide && <T x={126} y={326} size={13}>{s === 0 ? 'soil containing copper' : 'grow in copper soil'}</T>}
      {stage === 'absorb' && <Chip x={126} y={42} w={220} lines={['copper builds up', 'in the leaves']} />}
    </Show>
    {s >= 2 && <Show on dim={s >= 3 && !all}>
      <Arrow from={[246, 220]} to={[276, 220]} colour={ink} width={2.2} />
      <DriedBundle x={322} y={248} />
      {!hide && <Lines x={322} y={278} anchor="middle" lines={['harvest', 'and dry']} size={13} />}
    </Show>}
    {s >= 3 && <g>
      <Arrow from={[360, 220]} to={[388, 220]} colour={ink} width={2.2} />
      <Furnace x={436} y={262} />
      {!hide && <T x={436} y={290} size={13}>burn</T>}
      <Arrow from={[480, 236]} to={[506, 236]} colour={ink} width={2.2} />
      <AshHeap x={548} y={262} />
      {!hide && <Lines x={548} y={286} anchor="middle" lines={['ash: soluble', 'copper', 'compounds']} size={13} colour={cuInk} />}
    </g>}
    {stage === 'all' && <g>
      <StepBadge n={1} x={34} y={256} /><StepBadge n={2} x={164} y={92} /><StepBadge n={3} x={296} y={150} /><StepBadge n={4} x={414} y={150} />
    </g>}
    {q && <g>
      <Pointer n={1} at={[34, 292]} to={[54, 262]} />
      <Pointer n={2} at={[236, 120]} to={[208, 166]} />
      <Pointer n={3} at={[436, 140]} to={[436, 236]} />
      <Pointer n={4} at={[560, 190]} to={[548, 248]} />
    </g>}
  </Diagram>
}

// ---------- Section 4: from a solution of copper ions to copper metal ----------
type FinishStage = 'solution' | 'electrolysis' | 'iron' | 'impact' | 'all'
const FINISH_TITLES: Record<FinishStage, string> = {
  solution: 'The leachate from bioleaching and the dissolved ash from phytomining both give a blue solution of copper ions.',
  electrolysis: 'Electrolysis of the solution: copper ions move to the negative electrode, which gets coated with copper metal.',
  iron: 'Scrap iron is put in the solution. Iron is more reactive than copper, so it displaces the copper, and copper metal forms on the iron.',
  impact: 'Compared with traditional mining, bioleaching and phytomining do much less damage to the environment, but they are slow.',
  all: 'Low-grade ore, by bioleaching or phytomining, gives a solution of copper ions. Electrolysis or scrap iron then gives copper metal. The methods do less damage but are slow.',
}
function FinishScene({ stage }: { stage: FinishStage }) {
  const s = ['solution', 'electrolysis', 'iron', 'impact', 'all'].indexOf(stage)
  const all = stage === 'all'
  const dimSources = s >= 1 && !all
  const ionsMid: Pt[] = [[204, 152], [226, 168], [248, 150], [212, 186], [240, 192], [264, 176]]
  return <Diagram viewBox="0 0 600 372" title={FINISH_TITLES[stage]}>
    {/* where the solution comes from */}
    <Show on dim={dimSources}>
      <Beaker x={20} y={50} w={80} h={62} level={66}>
        <Ions pts={[[38, 84], [58, 96], [78, 82], [86, 100]]} r={3} />
        <Bug x={46} y={98} angle={20} s={.32} /><Bug x={70} y={76} angle={-14} s={.32} seed={5} />
      </Beaker>
      <T x={60} y={134} size={13}>leachate</T>
      <AshHeap x={60} y={228} w={80} h={36} />
      <Lines x={60} y={250} anchor="middle" lines={['ash,', 'dissolved']} size={13} />
      <Arrow from={[108, 90]} to={[178, 142]} colour={solLine} width={2.2} />
      <Arrow from={[108, 206]} to={[178, 182]} colour={solLine} width={2.2} />
    </Show>
    <Show on dim={dimSources && s !== 3 ? true : s === 3}>
      <Beaker x={186} y={118} w={96} h={96} level={138}><Ions pts={ionsMid} /></Beaker>
      <Lines x={234} y={240} anchor="middle" lines={['solution of', 'copper ions, Cu²⁺']} size={13} colour={solInk} />
    </Show>
    {/* electrolysis */}
    {s >= 1 && <Show on dim={s >= 2 && !all}>
      <Arrow from={[288, 140]} to={[334, 92]} colour={ink} width={2.2} />
      <path d="M368 52V24H400M426 24H454V52" stroke={ink} strokeWidth="1.8" fill="none" />
      <Battery x={413} y={24} />
      <T x={394} y={14} size={12} bold={false} colour={muted}>−</T><T x={432} y={14} size={12} bold={false} colour={muted}>+</T>
      <Beaker x={344} y={40} w={134} h={84} level={58}>
        <Ions pts={[[392, 84], [404, 102], [420, 76], [436, 100]]} />
        <Arrow from={[386, 92]} to={[376, 92]} colour={solLine} width={1.4} />
      </Beaker>
      <rect x={362} y={44} width={12} height={66} rx="2" fill={cu} stroke={cuLine} strokeWidth="1.4" />
      <rect x={364} y={44} width={8} height={66} rx="2" fill="#9aa1a8" stroke="none" opacity=".35" />
      <rect x={448} y={44} width={12} height={66} rx="2" fill="#9aa1a8" stroke="#5f6870" strokeWidth="1.4" />
      <T x={410} y={146} size={14}>electrolysis</T>
    </Show>}
    {/* displacement with scrap iron */}
    {s >= 2 && <Show on dim={s === 3}>
      <Arrow from={[288, 196]} to={[334, 228]} colour={ink} width={2.2} />
      <Beaker x={344} y={196} w={134} h={84} level={214}>
        <Ions pts={[[364, 252], [440, 236], [458, 262]]} />
        <g transform="rotate(-20 410 244)">
          <rect x={372} y={238} width={76} height={12} rx="3" fill={P.metal} stroke={P.metalLine} strokeWidth="1.5" />
          <path d="M448 236L460 244L448 252Z" fill={P.metal} stroke={P.metalLine} strokeWidth="1.5" />
          <rect x={364} y={233} width={10} height={22} rx="2" fill={P.metal} stroke={P.metalLine} strokeWidth="1.5" />
          {[[380, 240], [396, 246], [412, 239], [428, 245], [442, 240], [368, 248]].map(([cx, cy], i) => <path key={i} d={blob(cx, cy, 5, 3, 120 + i, .2, 1, 8)} fill={cu} stroke={cuLine} strokeWidth=".9" />)}
        </g>
        {[[400, 274], [420, 275], [438, 273]].map(([cx, cy], i) => <path key={i} d={blob(cx, cy, 6, 3, 130 + i, .2, 1, 8)} fill={cu} stroke={cuLine} strokeWidth="1" />)}
      </Beaker>
      <Lines x={410} y={302} anchor="middle" lines={['scrap iron', 'displaces copper']} size={13} />
    </Show>}
    {/* copper metal */}
    {s >= 1 && <Show on dim={s === 2 || s === 3}><Arrow from={[486, 96]} to={[524, 148]} colour={cuLine} width={2.2} /></Show>}
    {s >= 1 && <Show on dim={s === 3}>
      {s >= 2 && <Arrow from={[486, 240]} to={[524, 176]} colour={cuLine} width={2.2} />}
      <CopperIngot x={558} y={170} />
      <Lines x={558} y={194} anchor="middle" lines={['copper', 'metal']} size={13} colour={cuInk} />
    </Show>}
    {/* impact */}
    {s >= 3 && <g>
      <Chip x={150} y={348} w={268} lines={['much less damage than mining']} tone="good" size={14} />
      <Chip x={420} y={348} w={200} lines={['but slow']} tone="amber" size={14} />
      <circle cx={360} cy={348} r={10} fill="white" stroke={amberInk} strokeWidth="1.6" />
      <path d="M360 341V348L365 351" stroke={amberInk} strokeWidth="1.6" fill="none" />
    </g>}
  </Diagram>
}

// ---------- Worked example: scrap iron in a leachate ----------
function WorkedIron() {
  return <Diagram viewBox="0 0 600 312" title="Before: scrap iron is put into blue copper sulfate solution. After: the iron is coated with copper, copper has collected at the bottom and the solution has turned pale green, because it now contains iron sulfate. Iron + copper sulfate → iron sulfate + copper.">
    <T x={150} y={30} size={15}>before</T>
    <Beaker x={90} y={50} w={120} h={130} level={74}>
      <Ions pts={[[110, 100], [140, 120], [180, 96], [120, 150], [190, 140], [160, 160]]} />
      <g transform="rotate(-24 150 130)">
        <rect x={112} y={124} width={74} height={12} rx="3" fill={P.metal} stroke={P.metalLine} strokeWidth="1.5" />
        <path d="M186 122L198 130L186 138Z" fill={P.metal} stroke={P.metalLine} strokeWidth="1.5" />
        <rect x={104} y={119} width={10} height={22} rx="2" fill={P.metal} stroke={P.metalLine} strokeWidth="1.5" />
      </g>
    </Beaker>
    <T x={150} y={206} size={13} colour={solInk}>blue: copper ions</T>
    <Arrow from={[244, 120]} to={[340, 120]} colour={amber} width={3} />
    <T x={292} y={106} size={13} colour={amberInk}>wait</T>
    <T x={436} y={30} size={15}>after</T>
    <Beaker x={376} y={50} w={120} h={130} level={74} fill="#e3f1df" line="#8fb88a">
      <g transform="rotate(-24 436 130)">
        <rect x={398} y={124} width={74} height={12} rx="3" fill={cu} stroke={cuLine} strokeWidth="1.5" />
        <path d="M472 122L484 130L472 138Z" fill={cu} stroke={cuLine} strokeWidth="1.5" />
        <rect x={390} y={119} width={10} height={22} rx="2" fill={cu} stroke={cuLine} strokeWidth="1.5" />
      </g>
      {[[396, 172], [416, 174], [444, 173], [470, 172], [430, 168]].map(([x, y], i) => <path key={i} d={blob(x, y, 6, 3.4, 90 + i, .2, 1, 8)} fill={cu} stroke={cuLine} strokeWidth="1" />)}
    </Beaker>
    <T x={436} y={206} size={13} colour={cuInk}>copper metal forms</T>
    <T x={436} y={224} size={13} colour={good}>pale green: iron sulfate</T>
    <rect x={60} y={254} width={480} height={40} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <T x={300} y={280} size={15}>iron + copper sulfate → iron sulfate + copper</T>
  </Diagram>
}

// ---------- On your own: data for three methods ----------
function DataQuestion() {
  const rows = [['Traditional mining', '1 month', '900'], ['Bioleaching', '2 years', '40'], ['Phytomining', '5 years', '0']]
  const x0 = 20, cols = [190, 180, 190], rh = 38, y = 54, head = 52
  const cx = (i: number) => x0 + cols.slice(0, i).reduce((a, b) => a + b, 0)
  return <Diagram viewBox="0 0 600 240" schematic={false} title="A table of made-up data for getting 1 tonne of copper from low-grade ore at one site. Traditional mining: 1 month, 900 tonnes of waste rock dumped. Bioleaching: 2 years, 40 tonnes. Phytomining: 5 years, 0 tonnes.">
    <T x={x0} y={34} size={15} anchor="start">Getting 1 tonne of copper from low-grade ore (made-up data)</T>
    <rect x={x0} y={y} width={560} height={head + rh * 3} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <path d={`M${x0} ${y + head}H${x0 + 560}`} stroke={panelLine} strokeWidth="1.4" />
    {[1, 2].map(i => <path key={i} d={`M${x0} ${y + head + rh * i}H${x0 + 560}`} stroke={panelLine} strokeWidth="1" />)}
    {[1, 2].map(i => <path key={i} d={`M${cx(i)} ${y}V${y + head + rh * 3}`} stroke={panelLine} strokeWidth="1.2" />)}
    <T x={cx(0) + 14} y={y + 32} size={14} anchor="start">Method</T>
    <Lines x={cx(1) + cols[1] / 2} y={y + 22} anchor="middle" lines={['Time taken']} size={14} />
    <T x={cx(1) + cols[1] / 2} y={y + 40} size={12} bold={false} colour={muted}>to get the copper</T>
    <Lines x={cx(2) + cols[2] / 2} y={y + 22} anchor="middle" lines={['Waste rock dumped']} size={14} />
    <T x={cx(2) + cols[2] / 2} y={y + 40} size={12} bold={false} colour={muted}>(tonnes)</T>
    {rows.map((r, i) => <g key={r[0]}>
      <T x={cx(0) + 14} y={y + head + rh * i + 25} size={14} bold={false} anchor="start">{r[0]}</T>
      <T x={cx(1) + cols[1] / 2} y={y + head + rh * i + 25} size={14} bold={false}>{r[1]}</T>
      <T x={cx(2) + cols[2] / 2} y={y + head + rh * i + 25} size={14} bold={false}>{r[2]}</T>
    </g>)}
  </Diagram>
}

export function HigherCopperVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'hcopper-short-finite': return <ShortScene stage="finite" />
    case 'hcopper-short-grades': return <ShortScene stage="grades" />
    case 'hcopper-short-running': return <ShortScene stage="running" />
    case 'hcopper-short-mining': return <ShortScene stage="mining" />
    case 'hcopper-short-all': return <ShortScene stage="all" />
    case 'hcopper-bio-bacteria': return <BioScene stage="bacteria" />
    case 'hcopper-bio-added': return <BioScene stage="added" />
    case 'hcopper-bio-soluble': return <BioScene stage="soluble" />
    case 'hcopper-bio-leachate': return <BioScene stage="leachate" />
    case 'hcopper-bio-all': return <BioScene stage="all" />
    case 'hcopper-phyto-grow': return <PhytoScene stage="grow" />
    case 'hcopper-phyto-absorb': return <PhytoScene stage="absorb" />
    case 'hcopper-phyto-harvest': return <PhytoScene stage="harvest" />
    case 'hcopper-phyto-burn': return <PhytoScene stage="burn" />
    case 'hcopper-phyto-all': return <PhytoScene stage="all" />
    case 'hcopper-finish-solution': return <FinishScene stage="solution" />
    case 'hcopper-finish-electrolysis': return <FinishScene stage="electrolysis" />
    case 'hcopper-finish-iron': return <FinishScene stage="iron" />
    case 'hcopper-finish-impact': return <FinishScene stage="impact" />
    case 'hcopper-finish-all': return <FinishScene stage="all" />
    case 'hcopper-worked-iron': return <WorkedIron />
    case 'hcopper-question-phyto': return <PhytoScene stage="question" hide={assessment} />
    case 'hcopper-data-methods': return <DataQuestion />
    default: return <ShortScene stage="all" />
  }
}

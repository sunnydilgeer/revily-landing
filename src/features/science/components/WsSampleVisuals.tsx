import { WsDiagram, Tag, Tick, Cross, Arrow, Bust, tones, wsPalette as W, ink, muted, r1, faded, type Pt } from './WsKit'
import { Lines } from './PhysicsKit'
import { blob } from './GasParticleVisuals'

/*
 * Working Scientifically Lesson 21: Random sampling. Original, code-native schematics.
 * Every focus id here starts with 'wssample-' and is routed from CellBiologyVisuals.tsx.
 *
 * Fields are soft green with small daisies; sampled squares (quadrats) are a darker green tint with a firm outline.
 * One 10 by 10 grid, numbered along the bottom and up the side, is reused through the field walkthrough; a coordinate
 * pair (a, b) means a along the bottom, then b up the side. People are WsKit busts; chosen ones get a yellow ring.
 */

const rand = (seed: number) => { const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
const field = { fill: '#e7f2df', line: W.plantLine }
const quad = { fill: '#b5d8a4', line: '#3f7a4a' }

function Daisy({ x, y, s = 1, dim = false }: { x: number; y: number; s?: number; dim?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? faded : 1}>
    {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="0" cy="-6.2" rx="2.6" ry="5" fill="white" stroke="#b8c4cc" strokeWidth="1" transform={`rotate(${i * 45})`} />)}
    <circle r="3.6" fill={W.light} stroke={W.lightLine} strokeWidth="1.2" />
  </g>
}
/** Scattered daisy positions inside a box, the same on every render. */
function scatter(x: number, y: number, w: number, h: number, n: number, seed = 1): Pt[] {
  const cols = Math.ceil(Math.sqrt(n * w / h)), rows = Math.ceil(n / cols), dx = w / cols, dy = h / rows, pts: Pt[] = []
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols && pts.length < n; i++) pts.push([r1(x + dx * (i + 0.2 + rand(seed + i * 7 + j * 13) * 0.6)), r1(y + dy * (j + 0.2 + rand(seed + i * 11 + j * 5 + 3) * 0.6))])
  return pts
}
function Quadrat({ x, y, s, dim = false, count, dark = false }: { x: number; y: number; s: number; dim?: boolean; count?: number; dark?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    <rect x={x} y={y} width={s} height={s} rx="2" fill={dark ? quad.line : quad.fill} fillOpacity={dark ? 0.85 : 0.75} stroke={quad.line} strokeWidth="2.4" />
    {count !== undefined && <text x={x + s / 2} y={y + s / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={quad.line}>{count}</text>}
  </g>
}

/* ---------- Section 2: why sample ---------- */

const FIELD = blob(190, 150, 160, 112, 4, 0.06, 12)
const DAISIES = scatter(52, 58, 276, 184, 56, 3).filter(([x, y]) => ((x - 190) / 150) ** 2 + ((y - 150) / 102) ** 2 < 0.92)
const SQUARES: Pt[] = [[92, 92], [214, 70], [148, 170], [262, 176]]
function Population() {
  return <WsDiagram schematic={false} title="A field full of daisies. All the daisies in the field together are the population.">
    <path d={FIELD} fill={field.fill} stroke={field.line} strokeWidth="1.8" />
    {DAISIES.map(([x, y], i) => <Daisy key={i} x={x} y={y} />)}
    <Tag x={440} y={130} text="population" tone="good" size={15} strong />
    <Lines x={440} y={168} anchor="middle" lines={['all the daisies', 'in the field']} size={14} colour={muted} />
  </WsDiagram>
}
function SampleFrame() {
  return <WsDiagram schematic={false} title="The same field with four small squares marked. The daisies in these squares are the sample: a small part of the population.">
    <path d={FIELD} fill={field.fill} stroke={field.line} strokeWidth="1.8" />
    {SQUARES.map(([x, y], i) => <Quadrat key={i} x={x - 4} y={y - 4} s={38} />)}
    {DAISIES.map(([x, y], i) => <Daisy key={i} x={x} y={y} dim={!SQUARES.some(([sx, sy]) => x > sx - 4 && x < sx + 34 && y > sy - 4 && y < sy + 34)} />)}
    <Arrow from={[304, 196]} to={[378, 196]} width={2.6} />
    <Tag x={440} y={196} text="sample" tone="mark" size={15} strong />
    <Lines x={440} y={232} anchor="middle" lines={['the daisies in', 'these squares']} size={14} colour={muted} />
    <Tag x={440} y={80} text="population" tone="good" size={14} />
    <Lines x={440} y={114} anchor="middle" lines={['the whole field']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function MiniField({ x, spots, good }: { x: number; spots: Pt[]; good: boolean }) {
  return <g>
    <rect x={x} y={40} width={200} height={170} rx="22" fill={field.fill} stroke={field.line} strokeWidth="1.8" />
    {scatter(x + 10, 50, 180, 150, 26, x).map(([dx, dy], i) => <Daisy key={i} x={dx} y={dy} s={0.8} />)}
    {spots.map(([sx, sy], i) => <Quadrat key={i} x={x + sx} y={40 + sy} s={26} />)}
    {good ? <Tick x={x + 100} y={236} /> : <Cross x={x + 100} y={236} />}
    <Lines x={x + 100} y={276} anchor="middle" lines={[good ? 'represents the field' : 'does not']} size={14} colour={good ? tones.good.text : tones.bad.text} />
  </g>
}
function Represent() {
  return <WsDiagram schematic={false} title="Left: sample squares spread over the whole field, which represent the field. Right: sample squares all in one corner, which do not.">
    <MiniField x={40} good spots={[[18, 18], [120, 32], [66, 88], [150, 120], [22, 132]]} />
    <MiniField x={300} good={false} spots={[[10, 12], [38, 12], [10, 40], [38, 40], [66, 12]]} />
  </WsDiagram>
}
function Token({ x, y, n, hi = false }: { x: number; y: number; n: number; hi?: boolean }) {
  return <g>
    <circle cx={x} cy={y} r="15" fill={hi ? tones.mark.fill : 'white'} stroke={hi ? tones.mark.line : W.tableLine} strokeWidth="2" />
    <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="750" fill={ink}>{n}</text>
  </g>
}
function RandomFrame() {
  const pts: Pt[] = [[198, 164], [230, 167], [262, 167], [292, 163], [214, 138], [246, 142], [278, 139], [230, 114], [262, 117]]
  return <WsDiagram schematic={false} title="A bowl of numbered tokens, one for every member. One token is drawn out without looking, so every member has the same chance of being picked.">
    {pts.map(([x, y], i) => <Token key={i} x={x} y={y} n={[4, 11, 7, 2, 9, 5, 12, 1, 8][i]} />)}
    <path d="M160 180Q164 250 244 252Q324 250 328 180Z" fill={W.pot} fillOpacity=".9" stroke={W.potLine} strokeWidth="2.2" />
    <path d="M152 180H336" stroke={W.potLine} strokeWidth="3" />
    <Token x={244} y={40} n={6} hi />
    <Arrow from={[244, 92]} to={[244, 62]} colour={muted} width={2.4} />
    <Lines x={290} y={36} lines={['picked without', 'looking']} size={13} weight={650} colour={muted} />
    <Tag x={244} y={278} text="equal chance for every member" tone="mark" size={14} w={300} strong />
  </WsDiagram>
}

/* ---------- Section 3: the grid ---------- */

const G = { x: 70, y: 36, c: 21 }
const cellX = (a: number, g = G) => g.x + (a - 1) * g.c
const cellY = (b: number, g = G) => g.y + (10 - b) * g.c
const GRID_DAISIES = scatter(G.x + 2, G.y + 2, G.c * 10 - 4, G.c * 10 - 4, 44, 9)
function Grid({ g = G, daisies = true, size = 12 }: { g?: typeof G; daisies?: boolean; size?: number }) {
  const w = g.c * 10
  return <g>
    <rect x={g.x} y={g.y} width={w} height={w} rx="6" fill={field.fill} stroke={field.line} strokeWidth="2" />
    {daisies && GRID_DAISIES.map(([x, y], i) => <Daisy key={i} x={r1(x - G.x + g.x)} y={r1(y - G.y + g.y)} s={0.55 * g.c / 21} dim />)}
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${g.x + (i + 1) * g.c} ${g.y}V${g.y + w}M${g.x} ${g.y + (i + 1) * g.c}H${g.x + w}`} stroke={field.line} strokeWidth="0.9" opacity=".55" />)}
    {Array.from({ length: 10 }, (_, i) => <g key={i} fontSize={size} fontWeight="650" fill={muted} textAnchor="middle">
      <text x={g.x + (i + 0.5) * g.c} y={g.y + w + size + 5}>{i + 1}</text>
      <text x={g.x - size * 0.75} y={g.y + w - (i + 0.5) * g.c + size * 0.36}>{i + 1}</text>
    </g>)}
  </g>
}
function GridFrame() {
  return <WsDiagram schematic={false} title="The field divided into a 10 by 10 grid. The squares are numbered 1 to 10 along the bottom and 1 to 10 up the side.">
    <Grid />
    <Lines x={320} y={110} lines={['1  divide the field', '    into a grid']} size={15} />
    <Lines x={320} y={170} lines={['2  number the grid', '    along the bottom', '    and up the side']} size={15} />
  </WsDiagram>
}
function Generator({ x, y, text, w = 120 }: { x: number; y: number; text: string; w?: number }) {
  return <g>
    <rect x={x - w / 2} y={y} width={w} height={96} rx="12" fill={W.metal} stroke={W.metalLine} strokeWidth="2" />
    <rect x={x - w / 2 + 10} y={y + 10} width={w - 20} height={32} rx="5" fill="#26394a" />
    <text x={x} y={y + 32} textAnchor="middle" fontSize="15" fontWeight="700" fill="#bff0c9" fontFamily="ui-monospace, monospace">{text}</text>
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={x - w / 2 + 14 + (i % 3) * (w - 28) / 3} y={y + 52 + Math.floor(i / 3) * 20} width={(w - 28) / 3 - 6} height={14} rx="4" fill="white" stroke={W.metalLine} strokeWidth="1.2" />)}
  </g>
}
function Coords() {
  const a = 3, b = 8, x = cellX(a), y = cellY(b)
  return <WsDiagram schematic={false} title="A random number generator gives the pair of numbers 3 and 8. Go 3 along the bottom and 8 up the side: that square is sampled.">
    <Grid />
    <path d={`M${x + G.c / 2} ${G.y + G.c * 10}V${y + G.c}`} stroke={tones.change.line} strokeWidth="2.2" strokeDasharray="5 4" />
    <path d={`M${G.x} ${y + G.c / 2}H${x}`} stroke={tones.change.line} strokeWidth="2.2" strokeDasharray="5 4" />
    <Quadrat x={x} y={y} s={G.c} />
    <Generator x={400} y={52} text="(3, 8)" />
    <Lines x={400} y={176} anchor="middle" lines={['random number', 'generator']} size={14} weight={650} colour={muted} />
    <Lines x={400} y={226} anchor="middle" lines={['3 along the bottom,', '8 up the side']} size={14} colour={tones.change.text} />
  </WsDiagram>
}
const PLACED: [number, number, number][] = [[3, 8, 4], [8, 9, 2], [6, 5, 5], [2, 3, 3], [9, 2, 4], [5, 1, 1]]
function Place() {
  return <WsDiagram schematic={false} title="Quadrats placed at six random pairs of coordinates across the grid, with the number of daisies counted in each: 4, 2, 5, 3, 4 and 1.">
    <Grid />
    {PLACED.map(([a, b, n], i) => <Quadrat key={i} x={cellX(a)} y={cellY(b)} s={G.c} count={n} />)}
    <Lines x={320} y={100} lines={['a quadrat at each', 'pair of coordinates']} size={15} />
    <Lines x={320} y={170} lines={['count the daisies', 'in each one']} size={15} />
    <Tag x={400} y={236} text="spread over the field" tone="good" size={13} />
  </WsDiagram>
}
function Bias() {
  const block: Pt[] = []
  for (let a = 1; a <= 3; a++) for (let b = 1; b <= 3; b++) block.push([a, b])
  return <WsDiagram schematic={false} title="Quadrats all bunched together in one corner of the grid. This sample is biased: it does not represent the whole field.">
    <Grid />
    {block.map(([a, b], i) => <Quadrat key={i} x={cellX(a)} y={cellY(b)} s={G.c} />)}
    <Cross x={340} y={110} />
    <Lines x={362} y={115} lines={['one corner only']} size={15} colour={tones.bad.text} />
    <Tag x={410} y={176} text="biased" tone="bad" size={15} strong />
    <Lines x={410} y={214} anchor="middle" lines={['not the whole field']} size={14} colour={muted} />
  </WsDiagram>
}

/* ---------- Section 4: people ---------- */

function Crowd({ x, y, cols, rows, gap = 38, s = 0.46, picked = [] as number[] }: { x: number; y: number; cols: number; rows: number; gap?: number; s?: number; picked?: number[] }) {
  return <g>
    {Array.from({ length: cols * rows }, (_, i) => {
      const cx = r1(x + (i % cols) * gap + (Math.floor(i / cols) % 2) * gap / 2), cy = y + Math.floor(i / cols) * gap * 0.95, hi = picked.includes(i)
      return <g key={i}>
        {hi && <circle cx={cx} cy={cy - 12} r={gap * 0.48} fill={tones.mark.fill} stroke={tones.mark.line} strokeWidth="2" />}
        <Bust x={cx} y={cy} s={s} kind={(i * 5 + 1) % 6} dim={picked.length > 0 && !hi} />
      </g>
    })}
  </g>
}
function People() {
  return <WsDiagram schematic={false} title="A crowd of people, with a few picked out at random to be the sample.">
    <Crowd x={60} y={70} cols={8} rows={6} picked={[3, 12, 22, 29, 41]} />
    <Tag x={180} y={282} text="random sample of people" tone="mark" size={14} w={270} strong />
    <Lines x={420} y={120} anchor="middle" lines={['everyone has', 'the same chance', 'of being picked']} size={14} colour={muted} />
  </WsDiagram>
}
const RECORD_ROWS: (number | '⋮')[] = [1, 2, 3, '⋮', 27, '⋮', 418, '⋮', 903, '⋮', 1200]
function Records({ x, y, hi = [], markNumbers = false }: { x: number; y: number; hi?: number[]; markNumbers?: boolean }) {
  const rowH = 20
  return <g>
    <rect x={x} y={y} width={170} height={RECORD_ROWS.length * rowH + 44} rx="12" fill="white" stroke={W.tableLine} strokeWidth="2" />
    <rect x={x} y={y} width={170} height={32} rx="12" fill={W.tableHead} />
    <path d={`M${x} ${y + 32}H${x + 170}`} stroke={W.tableLine} strokeWidth="2" />
    <text x={x + 85} y={y + 21} textAnchor="middle" fontSize="13" fontWeight="750" fill={ink}>Hospital records</text>
    {markNumbers && <rect x={x + 6} y={y + 38} width={52} height={RECORD_ROWS.length * rowH} rx="6" fill={tones.mark.fill} />}
    {RECORD_ROWS.map((r, i) => {
      const cy = y + 38 + i * rowH + rowH / 2, on = typeof r === 'number' && hi.includes(r)
      return <g key={i}>
        {on && <rect x={x + 6} y={cy - rowH / 2 + 1} width={158} height={rowH - 2} rx="6" fill={tones.mark.fill} stroke={tones.mark.line} strokeWidth="1.6" />}
        <text x={x + 32} y={cy + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="750" fill={ink}>{r}</text>
        {r !== '⋮' && <rect x={x + 66} y={cy - 3} width={84 - (Number(r) % 3) * 14} height={6} rx="3" fill={W.tableLine} />}
      </g>
    })}
  </g>
}
function RecordsFrame() {
  return <WsDiagram schematic={false} title="A list of hospital records. Every person on the list is given a number, from 1 to the last one. The whole list is the population.">
    <Records x={60} y={20} markNumbers />
    <Lines x={290} y={80} lines={['give every person', 'a number']} size={15} />
    <Arrow from={[284, 74]} to={[124, 74]} colour={tones.mark.line} width={2.2} bend={0.1} />
    <Tag x={380} y={190} text="the whole population" tone="good" size={14} strong />
    <Lines x={380} y={226} anchor="middle" lines={['everyone on the list']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}
function GeneratorFrame() {
  return <WsDiagram schematic={false} title="A random number generator picks the numbers 27, 418 and 903. The people with those numbers in the records form the sample group.">
    <Records x={24} y={20} hi={[27, 418, 903]} />
    <Generator x={290} y={40} text="27 418 903" w={140} />
    <Arrow from={[204, 88]} to={[216, 88]} colour={muted} width={2} />
    <Lines x={290} y={160} anchor="middle" lines={['random numbers']} size={14} weight={650} colour={muted} />
    <Arrow from={[290, 176]} to={[380, 214]} width={2.4} bend={0.12} />
    <rect x={380} y={186} width={146} height={92} rx="14" fill={tones.mark.fill} fillOpacity=".6" stroke={tones.mark.line} strokeWidth="2" />
    {[0, 1, 2].map(i => <Bust key={i} x={414 + i * 40} y={252} s={0.52} kind={i * 2} />)}
    <Lines x={453} y={204} anchor="middle" lines={['sample group']} size={13} colour={tones.mark.text} />
  </WsDiagram>
}
function Estimate() {
  const picked = [1, 6]
  return <WsDiagram schematic={false} title="A sample group of 8 people, of whom 2 have a second condition: 1 in 4. This is used to estimate that about 1 in 4 of the whole population have it.">
    <rect x={20} y={60} width={180} height={140} rx="16" fill={W.panel} stroke={tones.mark.line} strokeWidth="2" />
    <Lines x={110} y={48} anchor="middle" lines={['sample group']} size={14} colour={tones.mark.text} />
    {Array.from({ length: 8 }, (_, i) => {
      const cx = 50 + (i % 4) * 40, cy = 118 + Math.floor(i / 4) * 56, hi = picked.includes(i)
      return <g key={i}>{hi && <circle cx={cx} cy={cy - 12} r="19" fill={tones.measure.fill} stroke={tones.measure.line} strokeWidth="2" />}<Bust x={cx} y={cy} s={0.5} kind={i % 6} /></g>
    })}
    <Tag x={110} y={228} text="2 in 8 = 1 in 4" tone="measure" size={14} strong />
    <Arrow from={[212, 130]} to={[268, 130]} width={2.8} />
    <rect x={280} y={40} width={246} height={180} rx="18" fill={W.panel} stroke={W.panelLine} strokeWidth="2" />
    <Lines x={403} y={30} anchor="middle" lines={['whole population']} size={14} colour={muted} />
    {Array.from({ length: 24 }, (_, i) => {
      const cx = 304 + (i % 6) * 40, cy = 88 + Math.floor(i / 6) * 40
      return <g key={i}>{i % 4 === 1 && <circle cx={cx} cy={cy - 10} r="14" fill={tones.measure.fill} stroke={tones.measure.line} strokeWidth="1.6" opacity=".7" />}<Bust x={cx} y={cy} s={0.34} kind={i % 6} /></g>
    })}
    <Lines x={403} y={254} anchor="middle" lines={['estimate: about 1 in 4', 'of everyone']} size={14} colour={tones.measure.text} />
  </WsDiagram>
}

/* ---------- On your own ---------- */

function QGrids() {
  const g1 = { x: 44, y: 44, c: 20 }, g2 = { x: 304, y: 44, c: 20 }
  const block: Pt[] = []
  for (let a = 7; a <= 9; a++) for (let b = 1; b <= 3; b++) block.push([a, b])
  const spread: Pt[] = [[2, 9], [5, 8], [9, 9], [1, 5], [4, 6], [7, 6], [10, 4], [3, 2], [6, 3], [8, 1]]
  return <WsDiagram schematic={false} title="Two numbered grids with dark squares showing where quadrats were placed.">
    <Grid g={g1} daisies={false} />
    <Grid g={g2} daisies={false} />
    {block.map(([a, b], i) => <Quadrat key={i} x={cellX(a, g1)} y={cellY(b, g1)} s={g1.c} dark />)}
    {spread.map(([a, b], i) => <Quadrat key={i} x={cellX(a, g2)} y={cellY(b, g2)} s={g2.c} dark />)}
    <Tag x={g1.x + 100} y={22} text="Grid 1" size={14} />
    <Tag x={g2.x + 100} y={22} text="Grid 2" size={14} />
  </WsDiagram>
}

export function WsSampleVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wssample-population': return <Population />
    case 'wssample-sample': return <SampleFrame />
    case 'wssample-represent': return <Represent />
    case 'wssample-random': return <RandomFrame />
    case 'wssample-grid': return <GridFrame />
    case 'wssample-coords': return <Coords />
    case 'wssample-place': return <Place />
    case 'wssample-bias': return <Bias />
    case 'wssample-people': return <People />
    case 'wssample-records': return <RecordsFrame />
    case 'wssample-generator': return <GeneratorFrame />
    case 'wssample-estimate': return <Estimate />
    case 'wssample-q-grids': return <QGrids />
    default: return null
  }
}

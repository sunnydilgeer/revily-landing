import { useId, type ReactNode } from 'react'

// Lessons 19–21: original, code-native schematics for B3 Infection and response. Not to scale; not micrographs.
// Colour code: magenta = pathogens, blue = water and droplets, amber = food, red = blood, green = plant tissue.
// Drawing helpers match PlantOrganisationVisuals.tsx (seeded blob, leader labels) so both lessons look alike.
const ink = '#375a73', water = '#55acd0', dropFill = '#e2f2f9', faded = 0.3
const bug = '#b8467f', bugFill = '#f5d9e7', bugDeep = '#8e2f60'
const amber = '#c98f2c', amberFill = '#f6dfa5', red = '#c8505a', skin = '#f1dcc8', skinLine = '#b9906f'
const jumperA = '#a9cbe0', jumperB = '#c6d9b4', tissueFill = '#fbeee6', tissueLine = '#c9a48c', panelFill = '#f7fafc', panelLine = '#cfdde7'

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

// Deterministic pseudo-random numbers: shapes are identical on server and client.
function seeded(seed: number) {
  let s = (Math.abs(Math.floor(seed)) * 9973 + 7) % 2147483647 || 1
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}
function smoothClosed(points: Pt[]) {
  const n = points.length
  let d = `M${r1(points[0][0])} ${r1(points[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n], p1 = points[i], p2 = points[(i + 1) % n], p3 = points[(i + 2) % n]
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`
  }
  return d + 'Z'
}
function blob(cx: number, cy: number, rx: number, ry: number, seed: number, wobble = 0.08, squareness = 1, count = 14) {
  const rand = seeded(seed)
  const points: Pt[] = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2, c = Math.cos(angle), s = Math.sin(angle)
    const k = 1 + (rand() - 0.5) * 2 * wobble
    return [cx + Math.sign(c) * Math.pow(Math.abs(c), squareness) * rx * k, cy + Math.sign(s) * Math.pow(Math.abs(s), squareness) * ry * k]
  })
  return smoothClosed(points)
}

function Diagram({ title, children, viewBox = '0 0 540 300' }: { title: string; children: ReactNode; viewBox?: string }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{`${title} Original schematic, not to scale.`}</title>{children}</svg></div>
}
function Arrow({ x1, y1, x2, y2, colour = ink, width = 2.5, dashed = false }: { x1: number; y1: number; x2: number; y2: number; colour?: string; width?: number; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1), head = 7 + width * 1.5
  const points = [[x2, y2], [x2 - head * Math.cos(angle - .5), y2 - head * Math.sin(angle - .5)], [x2 - head * Math.cos(angle + .5), y2 - head * Math.sin(angle + .5)]]
  return <g fill={colour} stroke={colour} strokeWidth={width} strokeLinecap="round"><line x1={x1} y1={y1} x2={r1(x2 - head * .7 * Math.cos(angle))} y2={r1(y2 - head * .7 * Math.sin(angle))} strokeDasharray={dashed ? '6 5' : undefined} /><polygon strokeWidth="1" points={points.map(p => p.map(r1).join(',')).join(' ')} /></g>
}
// A label whose leader line starts beside the text and ends with a dot on the named feature.
function leaderStart(x: number, y: number, lines: string[], anchor: 'start' | 'middle' | 'end', to: Pt): Pt {
  const width = Math.max(...lines.map(line => line.length)) * 7.4
  const left = anchor === 'start' ? x : anchor === 'end' ? x - width : x - width / 2, right = left + width
  if (to[0] >= right + 4) return [right + 4, y - 5]
  if (to[0] <= left - 4) return [left - 4, y - 5]
  const cx = Math.min(Math.max(to[0], left + 6), right - 6)
  return to[1] > y ? [cx, y + (lines.length - 1) * 16 + 6] : [cx, y - 17]
}
function Label({ x, y, to, lines, anchor = 'start', dim = false, strong = false, colour = ink, size = 14 }: { x: number; y: number; to?: Pt; lines: string[]; anchor?: 'start' | 'middle' | 'end'; dim?: boolean; strong?: boolean; colour?: string; size?: number }) {
  const lineStart: Pt = to ? leaderStart(x, y, lines, anchor, to) : [x, y]
  return <g opacity={dim ? .4 : 1}>
    {to && <><path d={`M${lineStart[0]} ${lineStart[1]}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.5" fill="none" /><circle cx={to[0]} cy={to[1]} r="2.5" fill={ink} /></>}
    <text x={x} y={y} textAnchor={anchor} fill={colour} fontSize={size} fontWeight={strong ? 700 : 500}>{lines.map((line, i) => <tspan key={line} x={x} dy={i ? size + 2 : 0}>{line}</tspan>)}</text>
  </g>
}
function Badge({ n, x, y }: { n: number; x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}

// ---------- Pathogen shapes (drawn enlarged) ----------
function Virus({ cx, cy, r = 9, seed = 1 }: { cx: number; cy: number; r?: number; seed?: number }) {
  const spikes = 10
  return <g>
    {Array.from({ length: spikes }, (_, i) => {
      const a = (i / spikes) * Math.PI * 2 + seed * .3, x1 = cx + Math.cos(a) * r, y1 = cy + Math.sin(a) * r, x2 = cx + Math.cos(a) * (r * 1.45), y2 = cy + Math.sin(a) * (r * 1.45)
      return <g key={i}><line x1={r1(x1)} y1={r1(y1)} x2={r1(x2)} y2={r1(y2)} stroke={bugDeep} strokeWidth={Math.max(1.2, r / 7)} /><circle cx={r1(x2)} cy={r1(y2)} r={r1(Math.max(1.3, r / 6))} fill={bugDeep} /></g>
    })}
    <path d={blob(cx, cy, r, r, seed + 90, .05)} fill={bug} stroke={bugDeep} strokeWidth="1.2" />
  </g>
}
function Bacterium({ cx, cy, length = 64, thick = 26, angle = 0, seed = 1 }: { cx: number; cy: number; length?: number; thick?: number; angle?: number; seed?: number }) {
  const rand = seeded(seed + 7)
  return <g transform={`rotate(${angle} ${cx} ${cy})`}>
    <path d={`M${cx + length / 2 - 2} ${cy}q${length / 7} -7 ${length / 4} 0t${length / 4} 0`} stroke={bugDeep} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <path d={blob(cx, cy, length / 2, thick / 2, seed, .05, .45, 16)} fill={bugFill} stroke={bug} strokeWidth="2" />
    {[0, 1, 2].map(i => <ellipse key={i} cx={r1(cx - length / 4 + i * length / 4 + (rand() - .5) * 6)} cy={r1(cy + (rand() - .5) * thick * .35)} rx="3.4" ry="2.4" fill={bug} opacity=".55" />)}
  </g>
}
function Fungus({ cx, cy }: { cx: number; cy: number }) {
  const thread = '#8c6f8f'
  const paths = [`M${cx - 44} ${cy + 40}C${cx - 30} ${cy + 10} ${cx - 10} ${cy + 16} ${cx} ${cy - 6}C${cx + 8} ${cy - 22} ${cx + 6} ${cy - 34} ${cx + 4} ${cy - 44}`,
    `M${cx - 18} ${cy + 20}C${cx - 30} ${cy} ${cx - 34} ${cy - 16} ${cx - 30} ${cy - 34}`, `M${cx - 2} ${cy - 2}C${cx + 16} ${cy + 2} ${cx + 30} ${cy - 12} ${cx + 40} ${cy - 26}`,
    `M${cx + 20} ${cy - 2}C${cx + 30} ${cy + 16} ${cx + 44} ${cy + 22} ${cx + 48} ${cy + 36}`]
  return <g>{paths.map((d, i) => <path key={i} d={d} stroke={thread} strokeWidth="5" fill="none" strokeLinecap="round" />)}
    {[[cx + 4, cy - 50], [cx - 30, cy - 40], [cx + 44, cy - 31]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="8" fill={bugFill} stroke={bug} strokeWidth="1.8" />{[-3, 3].map(d => <circle key={d} cx={x + d} cy={y + (d > 0 ? 2 : -1)} r="1.6" fill={bug} />)}</g>)}</g>
}
function Protist({ cx, cy }: { cx: number; cy: number }) {
  return <g><path d={blob(cx, cy, 48, 34, 314, .16, 1, 16)} fill="#fbe8f1" stroke={bug} strokeWidth="2" />
    <path d={blob(cx - 8, cy - 2, 13, 11, 12, .1)} fill={bug} opacity=".75" /><circle cx={cx - 8} cy={cy - 3} r="4" fill={bugDeep} />
    {[[18, -12, 6], [22, 12, 5], [-28, 14, 4.5], [4, 20, 4]].map(([dx, dy, r], i) => <circle key={i} cx={cx + dx} cy={cy + dy} r={r} fill="white" stroke={bug} strokeWidth="1.2" />)}</g>
}
function BodyCell({ cx, cy, rx = 34, ry = 26, seed = 1, damaged = false }: { cx: number; cy: number; rx?: number; ry?: number; seed?: number; damaged?: boolean }) {
  return <g><path d={blob(cx, cy, rx, ry, seed, .1)} fill={tissueFill} stroke={tissueLine} strokeWidth="2" strokeDasharray={damaged ? '9 5' : undefined} />
    <circle cx={cx - 4} cy={cy + 2} r={ry * .32} fill="#e7c9b5" stroke={tissueLine} strokeWidth="1.2" />
    {damaged && <path d={`M${cx + rx * .35} ${cy - ry * .9}l-6 10l8 6l-7 11`} stroke={red} strokeWidth="2" fill="none" strokeLinecap="round" />}</g>
}

// ---------- People (friendly, simple, side-on) ----------
function Person({ x, y, facing = 1, jumper = jumperA, dim = false, badge = false, body = 200 }: { x: number; y: number; facing?: 1 | -1; jumper?: string; dim?: boolean; badge?: boolean; body?: number }) {
  return <g opacity={dim ? faded : 1}>
    <path d={`M${x - 40} ${y + body}L${x - 40} ${y + 66}Q${x - 40} ${y + 36} ${x - 12} ${y + 34}L${x + 12} ${y + 34}Q${x + 40} ${y + 36} ${x + 40} ${y + 66}L${x + 40} ${y + body}Z`} fill={jumper} stroke={ink} strokeWidth="1.6" />
    <circle cx={x} cy={y} r="25" fill={skin} stroke={skinLine} strokeWidth="1.6" />
    <path d={`M${x + facing * 23} ${y - 6}q${facing * 9} 7 ${facing * 1} 12`} fill={skin} stroke={skinLine} strokeWidth="1.6" />
    <path d={`M${x - facing * 25} ${y + 2}C${x - facing * 30} ${y - 26} ${x + facing * 2} ${y - 36} ${x + facing * 22} ${y - 14}C${x + facing * 8} ${y - 20} ${x - facing * 6} ${y - 14} ${x - facing * 10} ${y + 4}Z`} fill="#6d5a4b" />
    <circle cx={x + facing * 11} cy={y - 4} r="2.3" fill={ink} />
    <path d={`M${x + facing * 13} ${y + 12}q${facing * 5} 2 ${facing * 8} -1`} stroke={skinLine} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    {badge && <g><path d={`M${x} ${y + 60}l16 6v14c0 12 -8 20 -16 24c-8 -4 -16 -12 -16 -24v-14z`} fill="white" stroke={ink} strokeWidth="2" /><path d={`M${x - 7} ${y + 80}l5 6l10 -12`} stroke="#3f8f6a" strokeWidth="3" fill="none" strokeLinecap="round" /></g>}
  </g>
}
function Droplets({ from, to, seed = 5, count = 24, spread = 70, dim = false, viruses = true }: { from: Pt; to: Pt; seed?: number; count?: number; spread?: number; dim?: boolean; viruses?: boolean }) {
  const rand = seeded(seed)
  return <g opacity={dim ? faded : 1}>{Array.from({ length: count }, (_, i) => {
    const t = (i + rand()) / count, x = from[0] + (to[0] - from[0]) * t, y = from[1] + (to[1] - from[1]) * t + (rand() - .5) * (8 + t * spread), r = 2.6 + rand() * 3.4 + (i % 5 === 0 ? 2 : 0)
    return <g key={i}><circle cx={r1(x)} cy={r1(y)} r={r1(r)} fill={dropFill} stroke={water} strokeWidth="1.3" />{viruses && i % 5 === 0 && <circle cx={r1(x)} cy={r1(y)} r="1.9" fill={bug} />}</g>
  })}</g>
}

// ---------- Lesson 19: the cold in a classroom ----------
const SNEEZER: Pt = [110, 100], FRIEND: Pt = [430, 100], MOUTH: Pt = [134, 114], NOSE: Pt = [404, 100]
function ClassScene({ focus }: { focus: string }) {
  const part = focus.replace('pathogen-class-', '')
  if (part === 'cells') return <Diagram title="Zoomed in on the lining of the throat. 1: a virus gets into a cell. 2: the virus makes many copies of itself inside the cell. 3: the cell bursts and releases the new viruses. This is cell damage.">
    <text x={270} y={26} textAnchor="middle" fill={ink} fontSize="14" fontWeight="600">Inside the nose and throat, zoomed in</text>
    {[95, 270, 445].map((cx, i) => <g key={cx}>
      <path d={blob(cx, 140, 70, 56, 20 + i * 3, .07)} fill={tissueFill} stroke={tissueLine} strokeWidth="2.2" strokeDasharray={i === 2 ? '46 14 30 10 60 12' : undefined} />
      <path d={blob(cx - 18, 146, 20, 17, 9 + i, .08)} fill="#e7c9b5" stroke={tissueLine} strokeWidth="1.4" />
    </g>)}
    <Virus cx={126} cy={92} r={8} seed={2} />
    {[[248, 110], [285, 104], [300, 132], [272, 170], [300, 165], [240, 175], [320, 108], [262, 128]].map(([x, y], i) => <Virus key={i} cx={x} cy={y} r={6.5} seed={i + 3} />)}
    {[[470, 104], [496, 86], [512, 118], [500, 150], [522, 100], [458, 128], [486, 170]].map(([x, y], i) => <Virus key={i} cx={x} cy={y} r={6.5} seed={i + 9} />)}
    <Arrow x1={170} y1={140} x2={196} y2={140} /><Arrow x1={345} y1={140} x2={371} y2={140} />
    <Label x={95} y={232} lines={['1  a virus', 'gets in']} anchor="middle" strong={false} />
    <Label x={270} y={232} lines={['2  copies', 'are made']} anchor="middle" />
    <Label x={445} y={232} lines={['3  the cell bursts:', 'cell damage']} anchor="middle" strong colour={bugDeep} />
    <text x={270} y={288} textAnchor="middle" fill={ink} fontSize="12">A virus is not a cell. It can only copy itself inside a cell.</text>
  </Diagram>

  const titles: Record<string, string> = {
    overview: 'Two classmates. One has a cold and sneezes towards the other. Something too small to see passes from one person to the other.',
    virus: 'Two classmates. One sneezes. A zoomed-in circle shows that one droplet contains viruses, which are pathogens.',
    droplets: 'Two classmates. A sneeze sprays a cloud of droplets through the air towards the other person. Some droplets carry viruses.',
    breathe: 'Two classmates. The droplets have reached the second person, who breathes them in through the nose.',
    hygiene: 'The classmate with a cold sneezes into a tissue, which catches the droplets. A tap and basin show hand washing.',
    isolation: 'The classmate with a cold stays at home, inside a house, away from the other person.',
    vaccine: 'The second classmate wears a shield badge showing they are vaccinated, so they are less likely to catch the disease.',
  }
  const cloud = part === 'overview' || part === 'virus' || part === 'droplets' || part === 'vaccine'
  return <Diagram title={titles[part] || titles.overview}>
    {part === 'isolation' && <path d="M26 70L110 16L194 70V300H26Z" fill="#fbf7ef" stroke={ink} strokeWidth="2" strokeLinejoin="round" />}
    <Person x={SNEEZER[0]} y={SNEEZER[1]} facing={1} jumper={jumperA} />
    <Person x={FRIEND[0]} y={FRIEND[1]} facing={-1} jumper={jumperB} badge={part === 'vaccine'} />
    {cloud && <Droplets from={[MOUTH[0] + 6, MOUTH[1]]} to={[330, 118]} dim={part === 'overview' || part === 'vaccine'} />}
    {part === 'breathe' && <g><Droplets from={[300, 112]} to={[392, 104]} count={14} spread={28} seed={8} /><Arrow x1={330} y1={70} x2={NOSE[0] - 4} y2={NOSE[1] - 2} colour={water} width={2.5} /></g>}
    {part === 'overview' && <g><path d="M140 64C200 22 330 22 392 64" stroke={ink} strokeWidth="2" fill="none" strokeDasharray="6 5" /><Arrow x1={380} y1={56} x2={394} y2={66} /><text x={266} y={26} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">something passes from person to person</text></g>}
    {part === 'virus' && <g>
      <path d="M226 128L190 180M242 128L262 180" stroke={ink} strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx={226} cy={220} r={46} fill="white" stroke={ink} strokeWidth="2" />
      <path d={blob(226, 220, 34, 32, 4, .05)} fill={dropFill} stroke={water} strokeWidth="1.6" />
      {[[214, 208], [240, 214], [222, 234]].map(([x, y], i) => <Virus key={i} cx={x} cy={y} r={7.5} seed={i} />)}
      <Label x={284} y={214} to={[248, 214]} lines={['virus:', 'a pathogen']} strong colour={bugDeep} />
      <text x={226} y={284} textAnchor="middle" fill={ink} fontSize="12">one droplet, zoomed in</text>
    </g>}
    {part === 'droplets' && <Label x={170} y={196} to={[250, 138]} lines={['droplets carry', 'viruses']} strong />}
    {part === 'breathe' && <Label x={236} y={58} to={[330, 70]} lines={['breathed in']} strong />}
    {part === 'hygiene' && <g>
      <path d="M134 98C150 92 162 100 160 114C162 128 150 136 136 132C142 122 142 108 134 98Z" fill="white" stroke={ink} strokeWidth="1.8" /><path d="M142 106q6 6 2 14M149 104q6 8 2 18" stroke="#b9c7d2" strokeWidth="1.2" fill="none" />
      <ellipse cx={156} cy={138} rx="11" ry="8" fill={skin} stroke={skinLine} strokeWidth="1.5" />
      {[[146, 110], [150, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" fill={dropFill} stroke={water} strokeWidth="1" />)}
      <g transform="translate(222 150)"><path d="M0 0H40V14" stroke={ink} strokeWidth="6" fill="none" strokeLinecap="round" />{[26, 38].map(y => <circle key={y} cx={40} cy={y} r="3" fill={water} />)}
        <ellipse cx={30} cy={56} rx="13" ry="8" fill={skin} stroke={skinLine} strokeWidth="1.5" /><ellipse cx={52} cy={58} rx="13" ry="8" fill="#e8cbb1" stroke={skinLine} strokeWidth="1.5" />
        <path d="M-8 64H90L80 92H2Z" fill={dropFill} stroke={ink} strokeWidth="1.8" /></g>
      <Label x={176} y={58} to={[154, 98]} lines={['tissue catches', 'droplets']} strong />
      <Label x={266} y={272} to={[262, 238]} lines={['wash hands']} anchor="middle" strong />
    </g>}
    {part === 'isolation' && <g><path d="M212 150H370" stroke={ink} strokeWidth="2" strokeDasharray="6 5" /><Arrow x1={290} y1={150} x2={214} y2={150} /><Arrow x1={290} y1={150} x2={372} y2={150} />
      <Label x={290} y={126} lines={['kept apart']} anchor="middle" strong />
      <Label x={110} y={60} lines={['at home']} anchor="middle" strong /></g>}
    {part === 'vaccine' && <Label x={236} y={236} to={[416, 176]} lines={['vaccinated: less', 'likely to catch it']} strong />}
  </Diagram>
}

// ---------- Lesson 19: the four kinds of pathogen ----------
const CARD_X = [14, 146, 278, 410], CARD_W = 118
const pathogenNames = ['bacterium', 'fungus', 'protist', 'virus'] as const
function PathogenDrawing({ i }: { i: number }) {
  const cx = CARD_X[i] + CARD_W / 2
  if (i === 0) return <g><Bacterium cx={cx - 12} cy={108} length={50} thick={22} seed={3} angle={-12} /><Bacterium cx={cx - 4} cy={150} length={50} thick={22} seed={5} angle={8} /></g>
  if (i === 1) return <Fungus cx={cx} cy={130} />
  if (i === 2) return <Protist cx={cx} cy={128} />
  return <Virus cx={cx} cy={128} r={8} seed={4} />
}
function TypesScene({ focus, assessment }: { focus: string; assessment: boolean }) {
  const part = focus.replace('pathogen-types-', '')
  if (part === 'toxin') return <Diagram title="Bacteria on the left release toxins, which spread to body cells on the right. One body cell is damaged by the toxins.">
    <path d="M20 250H520" stroke={panelLine} strokeWidth="2" />
    <Bacterium cx={80} cy={110} seed={3} angle={-15} /><Bacterium cx={96} cy={160} seed={6} angle={10} /><Bacterium cx={66} cy={206} seed={8} angle={-4} />
    {(() => { const rand = seeded(40); return Array.from({ length: 24 }, (_, i) => ({ i, x: 150 + rand() * 210, y: 96 + rand() * 120 })) })().map(({ i, x, y }) => {  return <path key={i} d={`M${r1(x)} ${r1(y - 4)}l4 4l-4 4l-4 -4z`} fill={bugDeep} opacity={.85} /> })}
    <Arrow x1={170} y1={70} x2={350} y2={70} colour={bugDeep} />
    <BodyCell cx={430} cy={104} seed={2} /><BodyCell cx={462} cy={166} seed={5} damaged /><BodyCell cx={410} cy={214} seed={7} />
    <Label x={30} y={274} lines={['bacteria']} strong colour={bugDeep} />
    <Label x={188} y={56} lines={['toxins (poisons)']} strong colour={bugDeep} />
    <Label x={400} y={274} to={[470, 190]} lines={['damaged cell']} strong />
  </Diagram>
  if (part === 'question') return <Diagram title={assessment ? 'Four pathogens, drawn enlarged, numbered 1 to 4.' : 'Four pathogens, drawn enlarged: 1 a bacterium, 2 a fungus, 3 a protist, 4 a virus. Only the virus is not a cell.'}>
    {CARD_X.map((x, i) => <g key={x}><rect x={x} y={44} width={CARD_W} height={190} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" /><PathogenDrawing i={i} /><Badge n={i + 1} x={x + CARD_W / 2} y={30} />
      {!assessment && <text x={x + CARD_W / 2} y={256} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{pathogenNames[i]}</text>}</g>)}
    {!assessment && <text x={270} y={286} textAnchor="middle" fill={bugDeep} fontSize="13" fontWeight="700">Number 4 is the only one that is not a cell.</text>}
  </Diagram>
  const index = pathogenNames.findIndex(name => part === name || (part === 'bacteria' && name === 'bacterium'))
  const titles = ['Four kinds of pathogen side by side, drawn enlarged: bacteria, a fungus, a protist and a virus. The bacteria are highlighted: small rod-shaped living cells.',
    'Four kinds of pathogen side by side, drawn enlarged. The fungus is highlighted: branching threads with round spores.',
    'Four kinds of pathogen side by side, drawn enlarged. The protist is highlighted: one larger cell with a nucleus.',
    'Four kinds of pathogen side by side, drawn enlarged. The virus is highlighted: much smaller than the others and not a cell.']
  return <Diagram title={titles[index < 0 ? 3 : index]}>
    {CARD_X.map((x, i) => <g key={x} opacity={i === index ? 1 : faded}><rect x={x} y={30} width={CARD_W} height={200} rx="12" fill={panelFill} stroke={i === index ? ink : panelLine} strokeWidth={i === index ? 2 : 1.5} /><g transform="translate(0 -6)"><PathogenDrawing i={i} /></g>
      <text x={x + CARD_W / 2} y={254} textAnchor="middle" fill={ink} fontSize="14" fontWeight={i === index ? 700 : 500}>{i === 0 ? 'bacteria' : i === 1 ? 'fungi' : i === 2 ? 'protists' : 'viruses'}</text></g>)}
    <text x={270} y={286} textAnchor="middle" fill={ink} fontSize="12">{index === 3 ? 'Viruses are much smaller than bacteria and are not cells.' : index === 0 ? 'Bacteria are living cells. They reproduce quickly in the body.' : 'All drawn enlarged, not to the same scale.'}</text>
  </Diagram>
}

// ---------- Lesson 19: other routes ----------
// Two hands clasped in a handshake: the right-hand person's fingers wrap over the left-hand person's hand.
function Hands({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 96} ${y + 4}L${x - 20} ${y + 2}C${x - 6} ${y + 2} ${x + 8} ${y + 10} ${x + 14} ${y + 20}C${x + 8} ${y + 28} ${x - 8} ${y + 30} ${x - 20} ${y + 30}L${x - 96} ${y + 30}Z`} fill={skin} stroke={skinLine} strokeWidth="1.6" />
    <path d={`M${x + 96} ${y + 2}L${x + 26} ${y + 2}C${x + 12} ${y + 2} ${x - 8} ${y - 2} ${x - 18} ${y + 6}C${x - 24} ${y + 12} ${x - 20} ${y + 22} ${x - 10} ${y + 22}C${x - 2} ${y + 30} ${x + 14} ${y + 32} ${x + 28} ${y + 30}L${x + 96} ${y + 30}Z`} fill="#e8cbb1" stroke={skinLine} strokeWidth="1.6" />
    {[-10, -2, 6].map(dx => <path key={dx} d={`M${x + dx} ${y + 4}q-4 9 2 18`} stroke={skinLine} strokeWidth="1.3" fill="none" />)}
    <rect x={x - 114} y={y - 2} width={20} height={38} rx="5" fill={jumperA} stroke={ink} strokeWidth="1.4" /><rect x={x + 94} y={y - 4} width={20} height={40} rx="5" fill={jumperB} stroke={ink} strokeWidth="1.4" />
    {[[-58, 14], [-40, 22], [-24, 12], [34, 14], [54, 22]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="2.8" fill={bug} />)}
    <Arrow x1={x - 50} y1={y - 12} x2={x + 46} y2={y - 12} colour={bug} width={2} />
  </g>
}
function Stream({ x, y, w }: { x: number; y: number; w: number }) {
  return <g><path d={`M${x} ${y}q${w / 8} -8 ${w / 4} 0t${w / 4} 0t${w / 4} 0t${w / 4} 0V${y + 30}H${x}Z`} fill="#cfe7f2" stroke={water} strokeWidth="1.8" />
    {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={x + 14 + i * (w - 28) / 8} cy={y + 12 + (i % 3) * 5} r="2.4" fill={bug} />)}</g>
}
function Mosquito({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 26} ${y}L${x + 18} ${y - 4}`} stroke="#4d4d4d" strokeWidth="5" strokeLinecap="round" /><circle cx={x + 22} cy={y - 5} r="5" fill="#4d4d4d" />
    <path d={`M${x + 26} ${y - 3}L${x + 38} ${y + 14}`} stroke="#4d4d4d" strokeWidth="1.8" /><circle cx={x + 38} cy={y + 14} r="2.2" fill={bug} />
    <path d={`M${x - 6} ${y - 4}C${x - 20} ${y - 30} ${x - 34} ${y - 30} ${x - 30} ${y - 16}Z M${x + 4} ${y - 4}C${x - 4} ${y - 34} ${x + 14} ${y - 34} ${x + 12} ${y - 14}Z`} fill="#e6eef4" stroke="#7d8b96" strokeWidth="1.2" opacity=".9" />
    {[-14, -4, 6].map(dx => <path key={dx} d={`M${x + dx} ${y}l-6 14M${x + dx} ${y}l6 14`} stroke="#4d4d4d" strokeWidth="1.4" />)}</g>
}
function Mini({ x, y, facing = 1, jumper = jumperA, scale = .42, body = 110 }: { x: number; y: number; facing?: 1 | -1; jumper?: string; scale?: number; body?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><Person x={0} y={0} facing={facing} jumper={jumper} body={body} /></g>
}
function MiniSneeze({ x, y, gap = 150 }: { x: number; y: number; gap?: number }) {
  return <g><Mini x={x} y={y} /><Mini x={x + gap} y={y} facing={-1} jumper={jumperB} />
    <Droplets from={[x + 14, y + 5]} to={[x + gap - 26, y + 2]} count={12} spread={26} seed={11} /></g>
}
const ROUTE_PANELS = [{ key: 'air', x: 8, y: 8, title: 'air', caption: 'droplets breathed in' }, { key: 'contact', x: 274, y: 8, title: 'touch', caption: 'picked up from people or surfaces' },
  { key: 'water', x: 8, y: 152, title: 'dirty water', caption: 'drinking or bathing in it' }, { key: 'vector', x: 274, y: 152, title: 'vector: a living carrier', caption: 'carried by a living thing' }] as const
function RoutesScene({ focus, assessment }: { focus: string; assessment: boolean }) {
  const part = focus.replace('pathogen-routes-', '')
  if (part === 'summary') {
    const rows = [['air', 'tissues, isolation, vaccination'], ['touch', 'hand washing'], ['dirty water', 'clean drinking water'], ['vector', 'insecticides, destroy breeding places']]
    return <Diagram viewBox="0 0 540 260" title="A table matching each route to a way of stopping it. Air: tissues, isolation and vaccination. Touch: hand washing. Dirty water: clean drinking water. Vector: insecticides and destroying breeding places.">
      <text x={26} y={28} fill={ink} fontSize="14" fontWeight="700">route</text><text x={196} y={28} fill={ink} fontSize="14" fontWeight="700">how to stop it</text>
      {rows.map(([route, stop], i) => <g key={route}><rect x={14} y={42 + i * 52} width={512} height={44} rx="8" fill={i % 2 ? panelFill : '#eef5f9'} stroke={panelLine} />
        <text x={26} y={70 + i * 52} fill={i === 2 ? '#2f7fa3' : i === 3 ? '#555' : ink} fontSize="15" fontWeight="700">{route}</text><Arrow x1={142} y1={64 + i * 52} x2={180} y2={64 + i * 52} width={2} /><text x={196} y={70 + i * 52} fill={ink} fontSize="15">{stop}</text></g>)}
    </Diagram>
  }
  if (part === 'question') {
    const captions = ['air: droplets', 'direct contact', 'dirty water']
    return <Diagram viewBox="0 0 540 260" title={assessment ? 'Three numbered scenes. In the first, one person sneezes near another. In the second, two people shake hands. In the third, a person drinks from a stream.' : 'Three scenes. Scene 1: a sneeze spreads droplets through the air. Scene 2: a handshake is direct contact. Scene 3: drinking from a stream is spread by dirty water.'}>
      {[0, 1, 2].map(i => <g key={i}><rect x={8 + i * 178} y={36} width={168} height={170} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" /><Badge n={i + 1} x={92 + i * 178} y={24} />
        {!assessment && <text x={92 + i * 178} y={234} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{captions[i]}</text>}</g>)}
      <MiniSneeze x={40} y={96} gap={104} />
      <g transform="translate(270 112) scale(.62)"><Hands x={0} y={0} /></g>
      <Stream x={372} y={170} w={156} /><Mini x={426} y={96} scale={.42} body={96} /><path d="M440 118q14 2 16 16" stroke={skinLine} strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M446 132h22l-3 18h-16z" fill="#cfe7f2" stroke={ink} strokeWidth="1.5" />
    </Diagram>
  }
  const titles: Record<string, string> = {
    contact: 'Four ways pathogens spread. Touch is highlighted: two people shake hands and pathogens pass from hand to hand.',
    water: 'Four ways pathogens spread. Dirty water is highlighted: pathogens in a stream are swallowed by people who drink or bathe in it.',
    vector: 'Four ways pathogens spread. Vectors are highlighted: a mosquito lands on an arm and passes on a pathogen. Killing vectors or destroying where they breed stops this.',
  }
  return <Diagram title={titles[part] || titles.contact}>
    {ROUTE_PANELS.map(p => <g key={p.key} opacity={p.key === part ? 1 : faded}>
      <rect x={p.x} y={p.y} width={258} height={136} rx="12" fill={panelFill} stroke={p.key === part ? ink : panelLine} strokeWidth={p.key === part ? 2 : 1.5} />
      <text x={p.x + 14} y={p.y + 24} fill={ink} fontSize="15" fontWeight="700">{p.title}</text>
      <text x={p.x + 14} y={p.y + 124} fill={ink} fontSize="13">{p.key === 'vector' && part === 'vector' ? 'kill vectors; destroy breeding places' : p.caption}</text>
    </g>)}
    <g opacity={part === 'air' ? 1 : faded}><MiniSneeze x={60} y={62} gap={140} /></g>
    <g opacity={part === 'contact' ? 1 : faded}><Hands x={403} y={54} /></g>
    <g opacity={part === 'water' ? 1 : faded}><Stream x={24} y={206} w={156} /><path d="M200 186H236L232 250H204Z" fill="#cfe7f2" stroke={ink} strokeWidth="1.6" /><path d="M200 186H236" stroke={ink} strokeWidth="1.6" />{[[212, 206], [224, 222], [214, 238]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" fill={bug} />)}<Arrow x1={176} y1={200} x2={198} y2={200} colour={water} width={2} /></g>
    <g opacity={part === 'vector' ? 1 : faded}><rect x={290} y={236} width={226} height={22} rx="10" fill={skin} stroke={skinLine} strokeWidth="1.5" /><g transform="translate(402 212) scale(1.4) translate(-402 -212)"><Mosquito x={402} y={212} /></g>
</g>
  </Diagram>
}

function HandGelData() {
  const weeks = [24, 22, 9, 7], base = 226, scale = 6.4
  return <Diagram viewBox="0 0 540 280" title="Bar chart of stomach-bug cases in one school each week. Week 1: 24 cases. Week 2: 22 cases. Hand-gel stations were added after week 2. Week 3: 9 cases. Week 4: 7 cases.">
    <text x={20} y={24} fill={ink} fontSize="14" fontWeight="600">Stomach-bug cases in one school, each week</text>
    <path d={`M80 ${base}H510M80 ${base}V50`} stroke={ink} strokeWidth="2" />
    {[0, 10, 20, 30].map(v => <g key={v}><path d={`M74 ${base - v * scale}H80`} stroke={ink} /><text x={70} y={base - v * scale + 5} textAnchor="end" fontSize="12" fill={ink}>{v}</text></g>)}
    {weeks.map((v, i) => <g key={i}><rect x={110 + i * 100} y={base - v * scale} width={56} height={v * scale} fill={i < 2 ? '#e8b8cf' : bug} stroke={ink} strokeWidth="1.5" opacity={i < 2 ? 1 : .8} /><text x={138 + i * 100} y={base - v * scale - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{v}</text><text x={138 + i * 100} y={base + 18} textAnchor="middle" fontSize="12" fill={ink}>week {i + 1}</text></g>)}
    <path d={`M288 ${base}V60`} stroke={ink} strokeWidth="2" strokeDasharray="6 5" />
    <text x={296} y={70} fill={ink} fontSize="13" fontWeight="700"><tspan x={296}>hand-gel stations</tspan><tspan x={296} dy={15}>added here</tspan></text>
    <text x={88} y={50} fill={ink} fontSize="12">cases</text>
    <text x={295} y={268} textAnchor="middle" fontSize="12" fill={ink}>week</text>
  </Diagram>
}

// ---------- Lesson 20: disease cards ----------
type DiseaseKey = 'salmonella' | 'gonorrhoea' | 'measles' | 'hiv' | 'tmv' | 'blackspot' | 'malaria'
type Panel = 'cause' | 'signs' | 'spread' | 'stop'
const PANELS: Panel[] = ['cause', 'signs', 'spread', 'stop']
const panelTitle: Record<Panel, string> = { cause: 'caused by', signs: 'signs', spread: 'spreads by', stop: 'stopped by' }
type DiseaseInfo = { name: string; pathogen: 'bacteria' | 'virus' | 'fungus' | 'protist'; plant?: boolean; order: string[]; lit: Record<string, Panel[]>; text: Record<Panel, string[]>; stepText?: Record<string, Partial<Record<Panel, string[]>>> }
// Plant cards reuse the same four panels; the last two are retitled (see plantTitle).
const plantTitle: Record<Panel, string> = { ...panelTitle, spread: 'effect on the plant', stop: 'spread and control' }
const diseases: Record<DiseaseKey, DiseaseInfo> = {
  salmonella: { name: 'Salmonella', pathogen: 'bacteria', order: ['cause', 'signs', 'spread', 'stop'], lit: {},
    text: { cause: ['bacteria that', 'make toxins'], signs: ['fever, stomach', 'cramps, vomiting,', 'diarrhoea'], spread: ['food with Salmonella', 'in it; unclean', 'kitchens and hands'], stop: ['UK poultry are', 'vaccinated; clean', 'hands and kitchens'] } },
  gonorrhoea: { name: 'Gonorrhoea', pathogen: 'bacteria', order: ['cause', 'signs', 'treat', 'resistant', 'stop'], lit: { cause: ['cause', 'spread'], treat: ['stop'], resistant: ['stop'] },
    text: { cause: ['bacteria; a sexually', 'transmitted disease', '(STD)'], signs: ['thick yellow or', 'green discharge;', 'pain when urinating'], spread: ['sexual contact'], stop: ['condoms (a barrier', 'method); the right', 'antibiotic'] } },
  measles: { name: 'Measles', pathogen: 'virus', order: ['cause', 'signs', 'stop'], lit: { cause: ['cause', 'spread'] },
    text: { cause: ['a virus'], signs: ['fever (a high', 'temperature);', 'red skin rash'], spread: ['droplets from', 'coughs and sneezes'], stop: ['most young', 'children are', 'vaccinated'] } },
  hiv: { name: 'HIV', pathogen: 'virus', order: ['cause', 'signs', 'stop', 'late'], lit: { cause: ['cause', 'spread'], late: ['signs'] },
    text: { cause: ['a virus'], signs: ['flu-like at first,', 'then no symptoms', 'for years'], spread: ['sexual contact;', 'body fluids such', 'as blood (sharing', 'needles)'], stop: ['antiretroviral', 'drugs stop it', 'copying itself'] } },
  // Lesson 21. The "effect" step is taught on the photosynthesis chain, so the card reveals it when the next card step appears.
  tmv: { name: 'Tobacco mosaic virus (TMV)', pathogen: 'virus', plant: true, order: ['cause', 'signs', 'effect', 'spread'], lit: { effect: ['spread'], spread: ['stop'] },
    text: { cause: ['a virus'], signs: ['a mosaic pattern:', 'pale patches on', 'the leaves'], spread: ['less chlorophyll, so', 'less photosynthesis;', 'poor growth'], stop: ['touch: plants,', 'hands and tools'] } },
  blackspot: { name: 'Rose black spot', pathogen: 'fungus', plant: true, order: ['cause', 'signs', 'effect', 'spread', 'stop'], lit: { effect: ['spread'], spread: ['stop'] },
    text: { cause: ['a fungus'], signs: ['purple or black', 'spots; leaves turn', 'yellow and drop'], spread: ['fewer leaves, so less', 'photosynthesis;', 'poor growth'], stop: ['water or wind;', 'fungicide; destroy', 'spotted leaves'] },
    stepText: { spread: { stop: ['spread by water', 'or wind'] } } },
  malaria: { name: 'Malaria', pathogen: 'protist', order: ['cause', 'signs', 'stop'], lit: { cause: ['cause', 'spread'] },
    text: { cause: ['a protist'], signs: ['fever that keeps', 'coming back;', 'it can kill'], spread: ['mosquito bites:', 'the mosquito is', 'a vector'], stop: ['stop mosquitoes', 'breeding; sleep', 'under nets'] } },
}
function PanelIcon({ disease, panel, x, y, step = '' }: { disease: DiseaseKey; panel: Panel; x: number; y: number; step?: string }) {
  const d = diseases[disease]
  if (disease === 'tmv' && panel === 'stop') return <g transform={`translate(${x} ${y - 6}) scale(.26)`}><Hands x={0} y={0} /></g>
  if (disease === 'blackspot' && panel === 'stop' && step !== 'stop') return <g>{[-10, 0, 10].map(dx => <path key={dx} d={`M${x + dx - 8} ${y - 12 + dx / 3}q6 -5 12 0t12 0`} stroke={water} strokeWidth="2" fill="none" />)}{[-8, 4].map(dx => <path key={dx} d={`M${x + dx} ${y + 6}q4 6 0 10q-4 -4 0 -10z`} fill={water} />)}</g>
  if (disease === 'blackspot' && panel === 'stop') return <g><rect x={x - 12} y={y - 8} width={20} height={28} rx="4" fill="#dfeee0" stroke={ink} strokeWidth="1.6" /><path d={`M${x - 8} ${y - 8}v-8h14l6 4`} stroke={ink} strokeWidth="1.6" fill="none" />{[0, 6, 12].map(dy => <circle key={dy} cx={x + 18 + dy / 2} cy={y - 16 + dy} r="1.8" fill={water} />)}</g>
  if (panel === 'cause') return d.pathogen === 'bacteria' ? <Bacterium cx={x - 6} cy={y} length={34} thick={16} seed={disease === 'salmonella' ? 3 : 9} angle={-10} />
    : d.pathogen === 'fungus' ? <g transform={`translate(${x} ${y + 4}) scale(.42) translate(${-x} ${-y})`}><Fungus cx={x} cy={y} /></g>
    : d.pathogen === 'protist' ? <g transform={`translate(${x} ${y}) scale(.5) translate(${-x} ${-y})`}><Protist cx={x} cy={y} /></g>
    : <Virus cx={x} cy={y} r={10} seed={disease === 'hiv' ? 7 : disease === 'tmv' ? 5 : 3} />
  if (d.plant && panel === 'signs') return <LeafIcon x={x} y={y} kind={disease === 'tmv' ? 'mosaic' : 'spots'} />
  if (d.plant && panel === 'spread') return <g><LeafIcon x={x} y={y - 6} kind={disease === 'tmv' ? 'mosaic' : 'spots'} small /><Arrow x1={x + 18} y1={y - 14} x2={x + 18} y2={y + 16} colour={amber} width={2} /></g>
  if (disease === 'malaria' && panel === 'spread') return <g transform={`translate(${x} ${y}) scale(.7) translate(${-x} ${-y})`}><Mosquito x={x - 4} y={y + 2} /></g>
  if (panel === 'signs') return <g><rect x={x - 5} y={y - 22} width={10} height={34} rx="5" fill="white" stroke={ink} strokeWidth="1.6" /><circle cx={x} cy={y + 14} r="8" fill={red} stroke={ink} strokeWidth="1.6" /><rect x={x - 2} y={y - 6} width={4} height={18} fill={red} /></g>
  if (panel === 'spread') {
    if (disease === 'salmonella') return <g><path d={`M${x - 14} ${y + 12}C${x - 26} ${y - 4} ${x - 6} ${y - 24} ${x + 10} ${y - 12}C${x + 20} ${y - 4} ${x + 6} ${y + 10} ${x - 4} ${y + 10}Z`} fill={amberFill} stroke={amber} strokeWidth="1.8" /><path d={`M${x - 10} ${y + 10}l-8 10`} stroke="#e9e1d3" strokeWidth="5" strokeLinecap="round" /></g>
    if (disease === 'measles') return <Droplets from={[x - 16, y]} to={[x + 18, y]} count={7} spread={24} seed={21} />
    if (disease === 'hiv') return <path d={`M${x} ${y - 18}C${x + 10} ${y - 4} ${x + 14} ${y + 4} ${x + 14} ${y + 8}A14 14 0 0 1 ${x - 14} ${y + 8}C${x - 14} ${y + 4} ${x - 10} ${y - 4} ${x} ${y - 18}Z`} fill={red} stroke="#8f2f38" strokeWidth="1.4" />
    return <g><circle cx={x - 9} cy={y - 8} r="8" fill={skin} stroke={skinLine} strokeWidth="1.4" /><circle cx={x + 9} cy={y - 8} r="8" fill={skin} stroke={skinLine} strokeWidth="1.4" /><path d={`M${x - 19} ${y + 16}q10 -18 20 0M${x - 1} ${y + 16}q10 -18 20 0`} fill={jumperA} stroke={ink} strokeWidth="1.4" /></g>
  }
  return <path d={`M${x} ${y - 18}l15 6v12c0 12 -7 18 -15 22c-8 -4 -15 -10 -15 -22v-12z`} fill="white" stroke={ink} strokeWidth="1.8" />
}
const PANEL_POS: Record<Panel, Pt> = { cause: [10, 64], signs: [274, 64], spread: [10, 180], stop: [274, 180] }
function DiseaseCard({ focus }: { focus: string }) {
  const [, disease, step] = focus.split('-') as [string, DiseaseKey, string]
  const d = diseases[disease]
  const lit = d.lit[step] || [step as Panel]
  const reached = d.order.indexOf(step)
  const revealed = new Set<Panel>(d.order.slice(0, reached + 1).flatMap(s => d.lit[s] || [s as Panel]))
  const stopText = disease === 'gonorrhoea' && step === 'treat' ? ['treated with', 'penicillin, an', 'antibiotic']
    : disease === 'gonorrhoea' && step === 'resistant' ? ['many strains now', 'resistant to', 'penicillin; other', 'antibiotics used'] : d.text.stop
  const signsText = disease === 'hiv' && step === 'late' ? ['flu-like, then no', 'symptoms for years;', 'untreated: immune', 'cells damaged', '(late stage: AIDS)'] : d.text.signs
  const titles = d.plant ? plantTitle : panelTitle
  const textFor = (panel: Panel) => d.stepText?.[step]?.[panel] ?? (panel === 'stop' ? stopText : panel === 'signs' ? signsText : d.text[panel])
  const describe = PANELS.filter(p => revealed.has(p)).map(p => `${titles[p]}: ${textFor(p).join(' ')}`).join('. ')
  const headerFill = d.plant ? '#eef6ea' : d.pathogen === 'bacteria' ? '#fbeef4' : '#f3eefb'
  const kind = { bacteria: 'bacterial', virus: 'viral', fungus: 'fungal', protist: 'protist' }[d.pathogen] + (d.plant ? ' disease of plants' : ' disease')
  return <Diagram viewBox="0 0 540 300" title={`A disease card for ${d.name}, filled in so far. ${describe}. The part being taught now is highlighted.`}>
    <rect x={10} y={8} width={520} height={46} rx="10" fill={headerFill} stroke={panelLine} />
    <text x={26} y={38} fill={ink} fontSize="19" fontWeight="700">{d.name}</text>
    <text x={514} y={37} textAnchor="end" fill={bugDeep} fontSize="13" fontWeight="600">{kind}</text>
    {PANELS.map(panel => { const [x, y] = PANEL_POS[panel]; const on = lit.includes(panel), shown = revealed.has(panel), text = textFor(panel)
      return <g key={panel} opacity={on ? 1 : shown ? .55 : faded}>
        <rect x={x} y={y} width={256} height={108} rx="10" fill={on ? 'white' : panelFill} stroke={on ? ink : panelLine} strokeWidth={on ? 2.2 : 1.4} />
        <text x={x + 14} y={y + 22} fill={ink} fontSize="13" fontWeight="700">{titles[panel]}</text>
        {shown ? <><PanelIcon disease={disease} panel={panel} x={x + 34} y={y + 66} step={step} />
          <text x={x + 72} y={y + 68 - 8 * (text.length - 1)} fill={ink} fontSize="13" fontWeight={on ? 600 : 500}>{text.map((line, i) => <tspan key={line} x={x + 72} dy={i ? 16 : 0}>{line}</tspan>)}</text></>
          : <text x={x + 128} y={y + 66} textAnchor="middle" fill="#9aabb8" fontSize="22" fontWeight="700">?</text>}
      </g> })}
  </Diagram>
}

const GRID: Array<{ name: string; rows: string[][] }> = [
  { name: 'Salmonella', rows: [['bacteria'], ['food; unclean', 'kitchens'], ['fever, cramps,', 'vomiting,', 'diarrhoea']] },
  { name: 'Gonorrhoea', rows: [['bacteria'], ['sexual contact'], ['discharge;', 'pain when', 'urinating']] },
  { name: 'Measles', rows: [['virus'], ['droplets'], ['fever;', 'red skin rash']] },
  { name: 'HIV', rows: [['virus'], ['sexual contact;', 'blood'], ['flu-like, then', 'none for years']] },
]
function DiseaseGrid({ assessment, question }: { assessment: boolean; question: boolean }) {
  const colX = [102, 210, 318, 426], colW = 104, rowY = [68, 126, 184], rowH = [52, 52, 72], rowNames = ['pathogen', 'spreads by', 'signs']
  const hideNames = question && assessment
  const title = hideNames ? 'A grid of four diseases in columns numbered 1 to 4, with rows for pathogen, how it spreads and signs. Column 1: bacteria, food and unclean kitchens, fever, cramps, vomiting and diarrhoea. Column 2: bacteria, sexual contact, discharge and pain when urinating. Column 3: virus, droplets, fever and a red skin rash. Column 4: virus, sexual contact and blood, flu-like then no symptoms for years.'
    : 'A grid comparing four diseases. Salmonella: bacteria, spread in food and unclean kitchens, fever, cramps, vomiting and diarrhoea. Gonorrhoea: bacteria, sexual contact, discharge and pain when urinating. Measles: virus, droplets, fever and a red skin rash. HIV: virus, sexual contact and blood, flu-like then no symptoms for years.'
  return <Diagram viewBox="0 0 540 290" title={title}>
    {rowNames.map((name, r) => <text key={name} x={14} y={rowY[r] + 30} fill={ink} fontSize="13" fontWeight="700">{name}</text>)}
    {GRID.map((col, c) => <g key={col.name} opacity={question && !assessment && c !== 2 ? .45 : 1}>
      <rect x={colX[c]} y={question ? 30 : 14} width={colW} height={question ? 30 : 44} rx="8" fill={c < 2 ? '#fbeef4' : '#f3eefb'} stroke={panelLine} />
      {question && <Badge n={c + 1} x={colX[c] + colW / 2} y={16} />}
      {!hideNames && <text x={colX[c] + colW / 2} y={question ? 50 : 41} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{col.name}</text>}
      {col.rows.map((lines, r) => <g key={r}><rect x={colX[c]} y={rowY[r]} width={colW} height={rowH[r]} rx="6" fill={panelFill} stroke={panelLine} />
        <text x={colX[c] + 8} y={rowY[r] + (lines.length > 2 ? 20 : lines.length > 1 ? 24 : 31)} fill={ink} fontSize="12">{lines.map((line, i) => <tspan key={line} x={colX[c] + 8} dy={i ? 15 : 0}>{line}</tspan>)}</text></g>)}
    </g>)}
    <text x={270} y={280} textAnchor="middle" fill={ink} fontSize="12">{hideNames ? 'Each column is one disease.' : 'Bacteria: Salmonella and gonorrhoea. Viruses: measles and HIV.'}</text>
  </Diagram>
}
function SymptomCard({ assessment }: { assessment: boolean }) {
  return <Diagram viewBox="0 0 540 250" title={assessment ? 'A patient notes card listing signs: pain when urinating, and a thick yellow discharge. No rash and no vomiting.' : 'A patient notes card listing signs: pain when urinating, and a thick yellow discharge. No rash and no vomiting. These signs fit gonorrhoea.'}>
    <rect x={110} y={18} width={320} height={200} rx="12" fill="#fffdf6" stroke={ink} strokeWidth="1.8" />
    <path d="M110 58H430" stroke={panelLine} strokeWidth="2" />
    <text x={130} y={46} fill={ink} fontSize="16" fontWeight="700">Patient notes: signs</text>
    {['pain when urinating', 'thick yellow discharge', 'no rash, no vomiting'].map((line, i) => <g key={line}><circle cx={140} cy={88 + i * 34} r="4" fill={i < 2 ? red : '#9aabb8'} /><text x={154} y={93 + i * 34} fill={ink} fontSize="15">{line}</text></g>)}
    {!assessment && <text x={130} y={202} fill="#a4475a" fontSize="14" fontWeight="700">These signs fit gonorrhoea.</text>}
  </Diagram>
}
function MeaslesData() {
  const years = [{ vac: 95, cases: 12 }, { vac: 93, cases: 20 }, { vac: 89, cases: 64 }, { vac: 85, cases: 140 }], base = 206, scale = 1
  return <Diagram viewBox="0 0 540 290" title="Measles in one region over four years. Bars show measles cases: 12, 20, 64, then 140. The row underneath shows the percentage of children vaccinated each year: 95, 93, 89, then 85 per cent.">
    <text x={20} y={22} fill={ink} fontSize="14" fontWeight="600">Measles in one region over four years</text>
    <path d={`M150 ${base}H520M150 ${base}V46`} stroke={ink} strokeWidth="2" />
    {[0, 50, 100, 150].map(v => <g key={v}><path d={`M144 ${base - v * scale}H150`} stroke={ink} /><text x={140} y={base - v * scale + 5} textAnchor="end" fontSize="12" fill={ink}>{v}</text></g>)}
    <text x={20} y={120} fill={ink} fontSize="12"><tspan x={20}>measles</tspan><tspan x={20} dy={15}>cases</tspan></text>
    {years.map((y, i) => <g key={i}><rect x={176 + i * 88} y={base - y.cases * scale} width={50} height={y.cases * scale} fill="#e8b8cf" stroke={ink} strokeWidth="1.5" /><text x={201 + i * 88} y={base - y.cases * scale - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill={bugDeep}>{y.cases}</text><text x={201 + i * 88} y={base + 18} textAnchor="middle" fontSize="12" fill={ink}>year {i + 1}</text></g>)}
    <rect x={14} y={236} width={512} height={36} rx="8" fill="#eef6fa" stroke={panelLine} />
    <text x={24} y={259} fill="#2f7fa3" fontSize="13" fontWeight="700">children vaccinated</text>
    {years.map((y, i) => <text key={i} x={201 + i * 88} y={259} textAnchor="middle" fill="#2f7fa3" fontSize="14" fontWeight="700">{y.vac}%</text>)}
  </Diagram>
}

// ---------- Lesson 21: plant diseases, malaria and the full set ----------
const leafGreen = '#6aa86a', leafDeep = '#3f7f4c', paleLeaf = '#d9e8b8'
function LeafIcon({ x, y, kind, small = false }: { x: number; y: number; kind: 'mosaic' | 'spots' | 'healthy'; small?: boolean }) {
  const k = small ? .7 : 1
  const leaf = `M${x - 20 * k} ${y + 16 * k}C${x - 22 * k} ${y - 6 * k} ${x - 2 * k} ${y - 22 * k} ${x + 20 * k} ${y - 18 * k}C${x + 20 * k} ${y + 4 * k} ${x + 2 * k} ${y + 20 * k} ${x - 20 * k} ${y + 16 * k}Z`
  return <g>
    <path d={leaf} fill={leafGreen} stroke={leafDeep} strokeWidth="1.5" />
    {kind === 'mosaic' && [[-8, 4, 6], [4, -6, 5], [8, 6, 4], [-2, -12, 3.5]].map(([dx, dy, r], i) => <path key={i} d={blob(x + dx * k, y + dy * k, r * k, r * .8 * k, 60 + i, .2)} fill={paleLeaf} />)}
    {kind === 'spots' && [[-8, 4, 3.6], [4, -6, 3], [8, 5, 2.6], [-2, -11, 2.2]].map(([dx, dy, r], i) => <circle key={i} cx={x + dx * k} cy={y + dy * k} r={r * k} fill="#3b2a3f" />)}
    <path d={`M${x - 18 * k} ${y + 14 * k}Q${x} ${y} ${x + 18 * k} ${y - 16 * k}`} stroke={leafDeep} strokeWidth="1.2" fill="none" />
  </g>
}
function SmallPlant({ x, y, tall }: { x: number; y: number; tall: boolean }) {
  const h = tall ? 40 : 22
  return <g><path d={`M${x} ${y}V${y - h}`} stroke={leafDeep} strokeWidth="3" /><path d={`M${x} ${y - h * .5}q-14 -4 -16 -14q12 0 16 10M${x} ${y - h * .75}q14 -4 16 -14q-12 0 -16 10`} fill={leafGreen} stroke={leafDeep} strokeWidth="1.2" /><path d={`M${x - 18} ${y}H${x + 18}`} stroke={skinLine} strokeWidth="3" /></g>
}
const CHAIN_Y = [14, 70, 126, 182, 238]
function ChainIcon({ i, disease, x, y }: { i: number; disease: 'tmv' | 'blackspot'; x: number; y: number }) {
  if (i === 0) return <LeafIcon x={x} y={y} kind={disease === 'tmv' ? 'mosaic' : 'spots'} small />
  if (i === 1) return disease === 'tmv' ? <g>{[-9, 0, 9].map(dx => <ellipse key={dx} cx={x + dx} cy={y} rx="4" ry="3" fill={dx ? paleLeaf : leafGreen} stroke={leafDeep} strokeWidth="1" />)}</g>
    : <g><LeafIcon x={x - 8} y={y} kind="healthy" small /><path d={`M${x + 6} ${y + 6}l10 10`} stroke="#9aabb8" strokeWidth="2" /><path d={blob(x + 16, y + 16, 5, 3, 3, .1)} fill="#e0c86a" /></g>
  if (i === 2) return <g><circle cx={x - 8} cy={y - 6} r="7" fill={yellowSun} /><Arrow x1={x - 2} y1={y} x2={x + 10} y2={y + 10} colour="#c9a227" width={2} /></g>
  if (i === 3) return <path d={blob(x, y, 11, 8, 12, .15)} fill={amberFill} stroke={amber} strokeWidth="1.6" />
  return <SmallPlant x={x} y={y + 18} tall={false} />
}
const yellowSun = '#efc75d'
function PhotoChain({ focus, assessment }: { focus: string; assessment: boolean }) {
  const part = focus.replace('plantdisease-chain-', '')
  const disease = part === 'blackspot' ? 'blackspot' : 'tmv'
  const steps = disease === 'tmv' ? ['pale patches on the leaves', 'less chlorophyll to absorb light', 'less photosynthesis', 'less food made', 'the plant grows poorly']
    : ['spotted leaves drop off', 'fewer leaves', 'less photosynthesis', 'less food made', 'the plant grows poorly']
  const lit = part === 'tmv' ? [0, 1, 2] : part === 'growth' ? [2, 3, 4] : [0, 1, 2, 3, 4]
  const hide = part === 'question' && assessment
  const shown = hide ? steps.map((s, i) => i === 2 ? '(step 3 is blank)' : s) : steps
  const title = `${disease === 'tmv' ? 'How tobacco mosaic virus harms a plant' : 'How rose black spot harms a plant'}, as a chain of five steps from top to bottom: ${shown.join(', then ')}.`
  return <Diagram title={title}>
    {steps.map((step, i) => { const y = CHAIN_Y[i], on = lit.includes(i), blank = hide && i === 2
      return <g key={i} opacity={on ? 1 : .4}>
        <rect x={126} y={y} width={298} height={40} rx="10" fill={blank ? 'white' : on ? '#f3f9ef' : panelFill} stroke={blank ? ink : on ? leafDeep : panelLine} strokeWidth={on ? 2 : 1.4} strokeDasharray={blank ? '6 4' : undefined} />
        {!blank && <text x={275} y={y + 25} textAnchor="middle" fill={ink} fontSize="14" fontWeight={on ? 700 : 500}>{step}</text>}
        {blank && <Badge n={3} x={275} y={y + 20} />}
        {!blank && <ChainIcon i={i} disease={disease} x={92} y={y + 20} />}
        {i < 4 && <Arrow x1={275} y1={y + 42} x2={275} y2={y + 55} width={2} />}
      </g> })}
    {disease === 'blackspot' && <text x={440} y={172} fill={leafDeep} fontSize="13" fontWeight="600"><tspan x={440}>same chain</tspan><tspan x={440} dy={16}>as TMV from</tspan><tspan x={440} dy={16}>here down</tspan></text>}
    {disease === 'blackspot' && <path d="M432 146V278" stroke={leafDeep} strokeWidth="2" strokeDasharray="4 4" />}
  </Diagram>
}
function Specks({ x, y }: { x: number; y: number }) {
  return <g>{[[0, 0], [9, 4], [4, 10]].map(([dx, dy], i) => <ellipse key={i} cx={x + dx} cy={y + dy} rx="3.4" ry="2.2" fill={bug} />)}</g>
}
// Mosquito biting an arm: the proboscis tip lands on the top edge of the arm.
function Bite({ x, y }: { x: number; y: number }) {
  return <g><rect x={x - 48} y={y} width={96} height={20} rx="10" fill={skin} stroke={skinLine} strokeWidth="1.5" /><Mosquito x={x - 20} y={y - 14} /></g>
}
function MalariaCycle({ focus, assessment }: { focus: string; assessment: boolean }) {
  const part = focus.replace('malaria-cycle-', '')
  const lit = part === 'pickup' ? [0, 1] : part === 'passon' ? [2, 3] : [0, 1, 2, 3]
  const hide = part === 'question' && assessment
  const captions = [['a person', 'with malaria'], ['a mosquito feeds', 'and picks up', 'the protist'], ['the mosquito', 'carries it'], ['it bites someone', 'new and passes', 'the protist on']]
  const px = [10, 142, 274, 406], pw = 124, o = (i: number) => lit.includes(i) ? 1 : faded
  const title = hide ? 'Four numbered pictures in a row showing a mosquito and two people. Picture 1: a person who is ill. Picture 2: a mosquito biting that person. Picture 3: the mosquito flying. Picture 4: the mosquito biting a different person.'
    : 'How mosquitoes spread malaria, in four stages. 1: a person has malaria, with protists in their blood. 2: a mosquito feeds on their blood and picks up the protist. 3: the mosquito carries the protist. 4: the mosquito bites someone new and passes the protist on. The mosquito is a vector.'
  return <Diagram title={title}>
    {px.map((x, i) => <g key={x} opacity={o(i)}>
      <rect x={x} y={34} width={pw} height={170} rx="12" fill={panelFill} stroke={lit.includes(i) ? ink : panelLine} strokeWidth={lit.includes(i) ? 2 : 1.4} />
      {!hide && <text x={x + pw / 2} y={226} textAnchor="middle" fill={ink} fontSize="12" fontWeight={lit.includes(i) ? 700 : 500}>{captions[i].map((line, j) => <tspan key={line} x={x + pw / 2} dy={j ? 15 : 0}>{line}</tspan>)}</text>}
    </g>)}
    <g opacity={o(0)}><Mini x={62} y={74} jumper={jumperA} scale={.5} body={96} /><path d="M82 60q6 -8 0 -16M90 62q7 -10 0 -20" stroke={red} strokeWidth="2" fill="none" /><circle cx={100} cy={166} r="22" fill="white" stroke={ink} strokeWidth="1.5" /><circle cx={100} cy={166} r="16" fill="#f6d6da" /><Specks x={94} y={160} /><path d="M82 134L94 146" stroke={ink} strokeWidth="1.2" strokeDasharray="3 3" /></g>
    <g opacity={o(1)}><Mini x={176} y={62} jumper={jumperA} scale={.36} body={52} /><Bite x={204} y={166} /><Specks x={196} y={136} /><Arrow x1={222} y1={166} x2={204} y2={148} colour={bug} width={1.8} /></g>
    <g opacity={o(2)}><path d="M286 182C306 140 330 176 352 130" stroke={ink} strokeWidth="1.6" fill="none" strokeDasharray="5 5" /><Mosquito x={352} y={110} /><Specks x={338} y={106} /></g>
    <g opacity={o(3)}><Mini x={440} y={62} jumper={jumperB} scale={.36} body={52} /><Bite x={468} y={166} /><Specks x={478} y={172} /><Arrow x1={462} y1={146} x2={476} y2={164} colour={bug} width={1.8} /></g>
    {[0, 1, 2].map(i => <Arrow key={i} x1={px[i] + pw - 8} y1={196} x2={px[i + 1] + 10} y2={196} width={2.5} />)}
    {px.map((x, i) => <Badge key={i} n={i + 1} x={x + pw / 2} y={24} />)}
    {!hide && <text x={270} y={290} textAnchor="middle" fill={ink} fontSize="12">The mosquito is a vector: it carries the protist from person to person.</text>}
  </Diagram>
}
const GRID7 = [{ type: 'bacteria', diseases: ['Salmonella', 'gonorrhoea'] }, { type: 'viruses', diseases: ['measles', 'HIV', 'TMV (plants)'] }, { type: 'fungi', diseases: ['rose black spot (plants)'] }, { type: 'protists', diseases: ['malaria'] }]
function Grid7({ assessment, question }: { assessment: boolean; question: boolean }) {
  const hide = question && assessment, colX = [10, 142, 274, 406], w = 124
  const title = hide ? `Seven diseases in four numbered columns. ${GRID7.map((c, i) => `Column ${i + 1}: ${c.diseases.join(', ')}`).join('. ')}.`
    : `Seven diseases grouped by the kind of pathogen that causes them. ${GRID7.map(c => `${c.type}: ${c.diseases.join(', ')}`).join('. ')}.`
  return <Diagram viewBox="0 0 540 290" title={title}>
    {GRID7.map((col, i) => { const x = colX[i]
      return <g key={col.type}>
        {question && <Badge n={i + 1} x={x + w / 2} y={16} />}
        <rect x={x} y={34} width={w} height={96} rx="10" fill={i === 0 ? '#fbeef4' : i === 1 ? '#f3eefb' : i === 2 ? '#f3eef3' : '#fbe8f1'} stroke={panelLine} />
        {hide && <text x={x + w / 2} y={90} textAnchor="middle" fill="#9aabb8" fontSize="26" fontWeight="700">?</text>}
        {!hide && <><g transform={`translate(${x + w / 2} 76)`}>{i === 0 ? <Bacterium cx={0} cy={0} length={40} thick={17} seed={3} angle={-10} /> : i === 1 ? <Virus cx={0} cy={0} r={11} seed={4} /> : i === 2 ? <g transform="scale(.45)"><Fungus cx={0} cy={10} /></g> : <g transform="scale(.55)"><Protist cx={0} cy={0} /></g>}</g>
          <text x={x + w / 2} y={122} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{col.type}</text></>}
        {col.diseases.map((name, j) => { const lines = name.includes('(plants)') ? [name.replace(' (plants)', ''), '(plants)'] : [name]
          const y = 142 + j * 38
          return <g key={name}><rect x={x} y={y} width={w} height={32} rx="7" fill={name.includes('plants') ? '#eef6ea' : 'white'} stroke={panelLine} />
            <text x={x + w / 2} y={y + (lines.length > 1 ? 13 : 21)} textAnchor="middle" fill={ink} fontSize={lines[0].length > 13 ? 11.5 : 13}>{lines.map((l, k) => <tspan key={l} x={x + w / 2} dy={k ? 13 : 0} fontSize={k ? 11 : undefined}>{l}</tspan>)}</text></g> })}
      </g> })}
    <text x={270} y={282} textAnchor="middle" fill={ink} fontSize="12">{hide ? 'Each column is one kind of pathogen.' : 'Green boxes are plant diseases.'}</text>
  </Diagram>
}
function FungicideData() {
  const bars = [{ name: 'sprayed with fungicide', value: 4 }, { name: 'not sprayed', value: 31 }], base = 220, scale = 5
  return <Diagram viewBox="0 0 540 270" title="Results from one garden. Rose bushes sprayed with fungicide had 4 spotted leaves per bush. Bushes that were not sprayed had 31 spotted leaves per bush.">
    <text x={20} y={24} fill={ink} fontSize="14" fontWeight="600">Rose black spot in one garden</text>
    <g fontSize="14" fill={ink}><rect x={20} y={44} width={246} height={96} rx="8" fill="#f5faf3" stroke="#cfe0c8" />
      <text x={32} y={70} fontWeight="700">bushes</text><text x={254} y={70} textAnchor="end" fontWeight="700">spotted leaves</text><path d="M28 80H258" stroke="#cfe0c8" />
      {bars.map((b, i) => <g key={b.name}><text x={32} y={104 + i * 26}>{i ? 'not sprayed' : 'sprayed'}</text><text x={254} y={104 + i * 26} textAnchor="end">{b.value}</text></g>)}</g>
    <path d={`M300 ${base}H520M300 ${base}V48`} stroke={ink} strokeWidth="2" />
    {[0, 10, 20, 30].map(v => <g key={v}><path d={`M294 ${base - v * scale}H300`} stroke={ink} /><text x={290} y={base - v * scale + 5} textAnchor="end" fontSize="12" fill={ink}>{v}</text></g>)}
    {bars.map((b, i) => <g key={b.name}><rect x={330 + i * 100} y={base - b.value * scale} width={60} height={b.value * scale} fill={i ? '#5e5063' : '#a99bb0'} stroke={ink} strokeWidth="1.5" /><text x={360 + i * 100} y={base - b.value * scale - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{b.value}</text><text x={360 + i * 100} y={base + 18} textAnchor="middle" fontSize="12" fill={ink}>{i ? 'not sprayed' : 'sprayed'}</text></g>)}
    <text x={300} y={260} fontSize="12" fill={ink}>spotted leaves per bush</text>
  </Diagram>
}

export function InfectionVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('pathogen-class-')) return <ClassScene focus={focus} />
  if (focus.startsWith('pathogen-types-')) return <TypesScene focus={focus} assessment={assessment} />
  if (focus.startsWith('pathogen-routes-')) return <RoutesScene focus={focus} assessment={assessment} />
  if (focus === 'pathogen-handgel-data') return <HandGelData />
  if (focus === 'disease-grid') return <DiseaseGrid assessment={false} question={false} />
  if (focus === 'disease-grid-question') return <DiseaseGrid assessment={assessment} question />
  if (focus === 'disease-symptom-card') return <SymptomCard assessment={assessment} />
  if (focus === 'disease-measles-data') return <MeaslesData />
  if (/^disease-(?:salmonella|gonorrhoea|measles|hiv|tmv|blackspot|malaria)-/.test(focus)) return <DiseaseCard focus={focus} />
  if (focus.startsWith('plantdisease-chain-')) return <PhotoChain focus={focus} assessment={assessment} />
  if (focus === 'plantdisease-fungicide-data') return <FungicideData />
  if (focus.startsWith('malaria-cycle-')) return <MalariaCycle focus={focus} assessment={assessment} />
  if (focus === 'disease-grid7') return <Grid7 assessment={false} question={false} />
  if (focus === 'disease-grid7-question') return <Grid7 assessment={assessment} question />
  return <ClassScene focus="pathogen-class-overview" />
}

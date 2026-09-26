import { useId, type ReactNode } from 'react'
import { Arrow, Badge, Bacterium, BodyCell, Diagram, Label, Person, Virus, blob, infectionPalette as c } from './InfectionVisuals'
import { Antibody, WhiteCell, defenceColours } from './DefenceVisuals'

// Lessons 24–25 (drug- and trial- scenes): original, code-native schematics of medicines. Not to scale; not micrographs.
// Colour code as the other B3 diagrams: magenta = pathogens, slate blue = white blood cells and antibodies, green = plants.
// Medicines are drawn in neutral grey so they are not confused with any body substance.
const { wbcLine } = defenceColours
const pill = '#6f8290', pillFill = '#eef2f5', tissue = '#fdf3ee', leaf = '#6aa86a', leafDeep = '#3f7f4c', petal = '#c77fb3', mould = '#6f9fa0'
type Pt = [number, number]

function Zoom({ cx, cy, r, children }: { cx: number; cy: number; r: number; children: ReactNode }) {
  const id = useId().replace(/:/g, '')
  return <g><clipPath id={id}><circle cx={cx} cy={cy} r={r - 1} /></clipPath><circle cx={cx} cy={cy} r={r} fill={tissue} stroke={c.ink} strokeWidth="2" /><g clipPath={`url(#${id})`}>{children}</g></g>
}
function Packet({ x, y, w = 44, h = 26, name, dim = false }: { x: number; y: number; w?: number; h?: number; name?: string; dim?: boolean }) {
  return <g opacity={dim ? c.faded : 1}><rect x={x} y={y} width={w} height={h} rx="3" fill={pillFill} stroke={pill} strokeWidth="1.6" /><rect x={x} y={y + h - 7} width={w} height={7} fill={pill} opacity=".35" />
    {name ? <text x={x + w / 2} y={y + h / 2 + 2} textAnchor="middle" fill={c.ink} fontSize="12" fontWeight="600">{name}</text> : <ellipse cx={x + w / 2} cy={y + h / 2 - 2} rx="7" ry="4" fill="white" stroke={pill} strokeWidth="1.2" />}</g>
}
const Dots = ({ points }: { points: Pt[] }) => <g>{points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" fill={pill} />)}</g>
const Cross = ({ x, y, s = 9 }: { x: number; y: number; s?: number }) => <path d={`M${x - s} ${y - s}l${2 * s} ${2 * s}M${x + s} ${y - s}l${-2 * s} ${2 * s}`} stroke={c.ink} strokeWidth="2.2" strokeLinecap="round" />
function Coccus({ cx, cy, r = 7 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill={c.bugFill} stroke={c.bug} strokeWidth="2" />
}

// ---------- Mia in bed, with a zoom circle into her body ----------
const MIA: Pt = [120, 100], Z = { cx: 430, cy: 140, r: 100 }
const CELLS: Pt[] = [[384, 92], [482, 104], [392, 200], [484, 196]]
function Bed({ pain, ear = false, hot = false, dim = false }: { pain: boolean; ear?: boolean; hot?: boolean; dim?: boolean }) {
  const [x, y] = MIA
  return <g opacity={dim ? c.faded : 1}>
    <rect x={20} y={70} width={16} height={196} rx="4" fill="#d9c3a5" stroke="#a88a64" strokeWidth="1.6" />
    <ellipse cx={x - 10} cy={146} rx={64} ry={26} fill="white" stroke="#c9d3da" strokeWidth="1.6" />
    <Person x={x} y={y} facing={1} jumper={c.jumperB} body={150} />
    <path d="M28 196C60 182 220 182 256 196V252H28Z" fill="#d7e6f2" stroke={c.ink} strokeWidth="1.6" />
    <path d="M28 252H256V264H28ZM36 264V284M248 264V284" fill="#d9c3a5" stroke="#a88a64" strokeWidth="1.6" />
    {ear && <ellipse cx={x - 2} cy={y + 2} rx="4.5" ry="7" fill={c.skin} stroke={c.skinLine} strokeWidth="1.4" />}
    {pain && <path d={ear ? `M${x - 34} ${y - 8}l-8 5l6 4l-8 5M${x - 34} ${y + 12}l-9 2l5 5l-8 3` : `M${x - 30} ${y - 26}l-8 -4l2 -7l-9 -3M${x + 28} ${y - 28}l8 -5l-3 -6l9 -4`} stroke={c.red} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    {hot && <g><path d={`M${x + 16} ${y + 12}L${x + 50} ${y + 2}`} stroke={c.ink} strokeWidth="4" strokeLinecap="round" /><circle cx={x + 50} cy={y + 2} r="4.5" fill={c.red} /></g>}
  </g>
}
function Table({ packet, name, dim = false }: { packet: boolean; name?: string; dim?: boolean }) {
  return <g><path d="M262 206H322M268 206V282M316 206V282" stroke="#a88a64" strokeWidth="5" strokeLinecap="round" />{packet && <Packet x={254} y={178} w={76} h={26} name={name} dim={dim} />}</g>
}
function ZoomLines() { return <path d={`M${MIA[0] + 6} ${MIA[1] + 4}L${Z.cx - 96} ${Z.cy - 30}M${MIA[0] + 6} ${MIA[1] + 4}L${Z.cx - 90} ${Z.cy + 44}`} stroke={c.ink} strokeWidth="1.2" strokeDasharray="3 3" /> }
function Tissue({ children, virusesInside = 0, dim = false }: { children?: ReactNode; virusesInside?: number; dim?: boolean }) {
  return <g>{CELLS.map(([x, y], i) => <BodyCell key={i} cx={x} cy={y} rx={32} ry={24} seed={i + 3} />)}
    <g opacity={dim ? c.faded : 1}>{CELLS.slice(0, virusesInside).map(([x, y], i) => [[-12, -8], [10, -10], [14, 10]].map(([dx, dy], k) => <Virus key={`${i}${k}`} cx={x + dx} cy={y + dy} r={5} seed={i * 3 + k} />))}</g>
    {children}</g>
}
const FLU_OUTSIDE: Pt[] = [[432, 150], [344, 146], [432, 58], [522, 150]]
function FluViruses({ dim = false }: { dim?: boolean }) { return <g opacity={dim ? c.faded : 1}>{FLU_OUTSIDE.map(([x, y], i) => <Virus key={i} cx={x} cy={y} r={7} seed={i + 5} />)}</g> }
const EAR_BACTERIA: Array<[number, number, number]> = [[424, 142, 10], [444, 158, -20], [344, 146, 80], [426, 58, 5], [446, 70, -30], [522, 150, 80], [438, 244, 0]]
function EarBacteria({ dim = false, crossed = false }: { dim?: boolean; crossed?: boolean }) {
  return <g>{EAR_BACTERIA.map(([x, y, a], i) => <g key={i} opacity={dim ? .45 : 1}><Bacterium cx={x} cy={y} length={30} thick={12} angle={a} seed={i + 2} />{crossed && <Cross x={x} y={y} s={7} />}</g>)}</g>
}
function MiaScene({ focus }: { focus: string }) {
  const step = focus.replace('drug-', '')
  const flu = step.startsWith('flu-')
  const titles: Record<string, string> = {
    'flu-mia': 'Mia sits up in bed with flu. A zoomed-in circle of her body shows flu viruses in and around her body cells.',
    'flu-symptoms': 'Mia in bed with a headache and a thermometer showing a high temperature. These are symptoms. The zoomed-in circle is faded.',
    'flu-painkiller': 'A painkiller packet on Mia’s bedside table is highlighted and her headache has eased. The zoomed-in circle shows the flu viruses are still there.',
    'flu-wbc': 'In the zoomed-in circle, a white blood cell and antibodies destroy the flu viruses. Mia feels better.',
    'ear-infection': 'A month later, Mia has earache. The zoomed-in circle shows rod-shaped bacteria multiplying between her body cells.',
    'ear-antibiotic': 'An antibiotic packet on the bedside table is highlighted. In the zoomed-in circle, small grey antibiotic particles surround the bacteria, which are crossed out: they are killed.',
    'ear-right': 'In the zoomed-in circle, an antibiotic kills the rod-shaped bacteria, but round bacteria of a different type are not affected. Each antibiotic kills certain types of bacteria.',
    'ear-virus': 'In the zoomed-in circle, flu viruses are inside a body cell. Antibiotic particles around the cell do not affect them. Mia is faded.',
  }
  const pain = step === 'flu-mia' || step === 'flu-symptoms' || step === 'ear-infection'
  return <Diagram title={titles[step] || titles['flu-mia']}>
    <Bed pain={pain} ear={!flu} hot={step === 'flu-symptoms' || step === 'flu-mia'} dim={step === 'ear-right' || step === 'ear-virus' || step === 'flu-wbc'} />
    <Table packet={step !== 'flu-mia' && step !== 'flu-symptoms' && step !== 'ear-infection' && step !== 'flu-wbc'} name={step === 'flu-painkiller' ? 'painkiller' : 'antibiotic'} dim={step === 'ear-right' || step === 'ear-virus'} />
    <ZoomLines />
    <g opacity={step === 'flu-symptoms' ? c.faded : 1}><Zoom {...Z}>
      {flu && <><Tissue virusesInside={2} /><FluViruses dim={step === 'flu-wbc'} /></>}
      {step === 'flu-wbc' && <><WhiteCell cx={440} cy={150} r={26} />{[[352, 140], [440, 60]].map(([x, y]) => [0, 90, 180, 270].map(a => { const r = 20, rad = a * Math.PI / 180; return <Antibody key={`${x}${a}`} x={x + Math.cos(rad) * r} y={y + Math.sin(rad) * r} angle={a - 90} /> }))}</>}
      {step === 'ear-infection' && <><Tissue /><EarBacteria /></>}
      {step === 'ear-antibiotic' && <><Tissue /><EarBacteria dim crossed /><Dots points={[[400, 130], [470, 128], [410, 164], [372, 118], [498, 170], [424, 90], [460, 214], [412, 238]]} /></>}
      {step === 'ear-right' && <><Tissue />{EAR_BACTERIA.slice(0, 4).map(([x, y, a], i) => <g key={i} opacity=".45"><Bacterium cx={x} cy={y} length={30} thick={12} angle={a} seed={i + 2} /><Cross x={x} y={y} s={7} /></g>)}
        {[[440, 64], [454, 72], [520, 140], [522, 158], [430, 242], [446, 246]].map(([x, y], i) => <Coccus key={i} cx={x} cy={y} />)}<Dots points={[[400, 130], [470, 128], [372, 118], [424, 90], [498, 170]]} /></>}
      {step === 'ear-virus' && <><Tissue virusesInside={3} /><Dots points={[[430, 150], [352, 140], [520, 150], [440, 58], [340, 190], [448, 244]]} /></>}
    </Zoom></g>
    <text x={Z.cx} y={Z.cy + Z.r + 20} textAnchor="middle" fill={c.ink} fontSize="12">inside Mia’s body, zoomed in</text>
    {step === 'flu-mia' && <Label x={176} y={30} to={[440, 60]} lines={['flu: caused', 'by a virus']} strong colour={c.bugDeep} />}
    {step === 'flu-symptoms' && <Label x={176} y={30} to={[152, 72]} lines={['symptoms: a headache', 'and a high temperature']} strong />}
    {step === 'flu-painkiller' && <><Label x={176} y={30} to={[292, 178]} lines={['painkiller:', 'eases the headache']} strong /><Label x={530} y={30} anchor="end" to={[440, 60]} lines={['viruses', 'still there']} colour={c.bugDeep} /></>}
    {step === 'flu-wbc' && <Label x={176} y={30} to={[418, 136]} lines={['white blood cells', 'destroy the virus']} strong colour={wbcLine} />}
    {step === 'ear-infection' && <><Label x={176} y={30} to={[438, 58]} lines={['bacteria', 'multiply']} strong colour={c.bugDeep} /><Label x={20} y={30} to={[82, 96]} lines={['earache']} strong /></>}
    {step === 'ear-antibiotic' && <><Label x={176} y={30} to={[292, 178]} lines={['antibiotic:', 'kills the bacteria']} strong /><Label x={530} y={16} anchor="end" to={[470, 128]} lines={['antibiotic', 'particles']} colour={pill} /></>}
    {step === 'ear-right' && <><Label x={176} y={30} to={[350, 144]} lines={['kills this type', 'of bacteria']} strong /><Label x={530} y={16} anchor="end" to={[520, 140]} lines={['a different type:', 'not affected']} colour={c.bugDeep} /></>}
    {step === 'ear-virus' && <><Label x={176} y={30} to={[380, 88]} lines={['viruses reproduce', 'inside body cells']} strong colour={c.bugDeep} /><Label x={20} y={286} lines={['antibiotics do not kill viruses']} strong /></>}
  </Diagram>
}
function EarQuestion({ assessment }: { assessment: boolean }) {
  const Q = { cx: 300, cy: 150, r: 128 }
  const marks: Array<{ at: Pt; badge: Pt; name: string }> = [{ at: [262, 108], badge: [90, 70], name: 'virus inside a cell' }, { at: [300, 196], badge: [90, 230], name: 'bacterium' }, { at: [396, 140], badge: [510, 70], name: 'virus' }]
  return <Diagram title={assessment ? 'A zoomed-in circle of body tissue with three numbered pathogens, marked 1, 2 and 3.' : 'A zoomed-in circle of body tissue: 1 a virus inside a body cell, 2 a bacterium between the cells, 3 a virus on the outside of a cell.'}>
    <Zoom {...Q}>
      <BodyCell cx={250} cy={110} rx={62} ry={44} seed={4} /><BodyCell cx={364} cy={96} rx={52} ry={40} seed={6} /><BodyCell cx={230} cy={226} rx={56} ry={40} seed={7} /><BodyCell cx={380} cy={226} rx={58} ry={42} seed={8} />
      <Virus cx={262} cy={108} r={8} seed={2} /><Bacterium cx={300} cy={196} length={40} thick={15} angle={-15} seed={4} /><Virus cx={396} cy={140} r={8} seed={6} />
    </Zoom>
    {marks.map((m, i) => <g key={i}><path d={`M${m.badge[0]} ${m.badge[1]}L${m.at[0]} ${m.at[1]}`} stroke={c.ink} strokeWidth="1.5" /><circle cx={m.at[0]} cy={m.at[1]} r="2.5" fill={c.ink} /><Badge n={i + 1} x={m.badge[0]} y={m.badge[1]} />
      {!assessment && <text x={m.badge[0]} y={m.badge[1] + 32} textAnchor="middle" fill={c.bugDeep} fontSize="13" fontWeight="700">{m.name === 'virus inside a cell' ? <><tspan x={m.badge[0]}>virus inside</tspan><tspan x={m.badge[0]} dy={15}>a cell</tspan></> : m.name}</text>}</g>)}
    <text x={300} y={294} textAnchor="middle" fill={c.ink} fontSize="12">Drawn enlarged, not to scale.</text>
  </Diagram>
}
function Summary() {
  const card = (x: number, heading: string, lines: string[][], icon: ReactNode) => <g>
    <rect x={x} y={14} width={252} height={272} rx="12" fill={c.panelFill} stroke={c.panelLine} strokeWidth="1.5" />
    <text x={x + 126} y={42} textAnchor="middle" fill={c.ink} fontSize="15" fontWeight="700">{heading}</text>{icon}
    {lines.map((ls, i) => <text key={i} x={x + 20} y={148 + i * 50} fill={c.ink} fontSize="13">{ls.map((t, k) => <tspan key={t} x={x + 20} dy={k ? 16 : 0}>{t}</tspan>)}</text>)}
  </g>
  return <Diagram title="Painkillers and antibiotics side by side. Painkillers ease symptoms such as pain but do not kill pathogens. Antibiotics kill bacteria but not viruses, and they have greatly reduced deaths from infections caused by bacteria.">
    {card(12, 'painkillers', [['ease symptoms, such as', 'pain'], ['do not kill the pathogen'], ['used for many illnesses']], <g><Packet x={108} y={62} w={60} h={30} /><path d="M92 76l-8 -4l2 -7l-9 -3" stroke={c.red} strokeWidth="2" fill="none" opacity=".5" /></g>)}
    {card(276, 'antibiotics', [['kill bacteria inside', 'the body'], ['do not kill viruses'], ['have greatly reduced', 'deaths from infections', 'caused by bacteria']], <g><Packet x={330} y={62} w={60} h={30} /><g opacity=".5"><Bacterium cx={430} cy={76} length={30} thick={12} seed={3} /><Cross x={430} y={76} s={8} /></g></g>)}
  </Diagram>
}

// ---------- Bacteria zoom: mutation and resistance ----------
const R = { cx: 370, cy: 150, r: 124 }
const BUGS: Array<[number, number, number]> = [[300, 90, 20], [360, 70, -10], [430, 96, 40], [470, 160, -30], [300, 170, 70], [360, 150, 0], [420, 214, 15], [330, 236, -20], [260, 140, 90], [400, 150, 60]]
const CHANGED = 5
function ResistScene({ focus }: { focus: string }) {
  const step = focus.replace('drug-resist-', '')
  const strain = step === 'mrsa', antibiotic = step !== 'mutate'
  const changed = strain ? [5, 1, 6, 9, 4] : [CHANGED]
  const titles: Record<string, string> = {
    mutate: 'Bacteria, zoomed in, multiplying. One bacterium, circled, has changed: it has mutated.',
    resistant: 'Grey antibiotic particles surround the bacteria. The ordinary bacteria are crossed out because they are killed. The changed bacterium, circled, is not killed: it is resistant.',
    mrsa: 'A group of bacteria that are all the same resistant type, each circled, among antibiotic particles. This is a resistant strain, such as MRSA.',
  }
  return <Diagram title={titles[step] || titles.mutate}>
    <Zoom {...R}>
      {BUGS.map(([x, y, a], i) => { const isChanged = changed.includes(i)
        return <g key={i} opacity={antibiotic && !isChanged ? .4 : 1}><Bacterium cx={x} cy={y} length={36} thick={15} angle={a} seed={i + 1} />
          {isChanged && <circle cx={x} cy={y} r={23} fill="none" stroke={c.bugDeep} strokeWidth="2.2" strokeDasharray="5 3" />}
          {antibiotic && !isChanged && <Cross x={x} y={y} s={8} />}</g> })}
      {step === 'mutate' && [[330, 60], [470, 210]].map(([x, y], i) => <g key={i}><Bacterium cx={x - 14} cy={y} length={26} thick={12} seed={i + 30} /><Bacterium cx={x + 14} cy={y} length={26} thick={12} seed={i + 31} /></g>)}
      {antibiotic && <Dots points={[[280, 116], [340, 118], [390, 120], [450, 128], [320, 200], [380, 186], [446, 190], [290, 60], [400, 60], [480, 100], [370, 260], [250, 196]]} />}
    </Zoom>
    <text x={R.cx} y={R.cy + R.r + 18} textAnchor="middle" fill={c.ink} fontSize="12">bacteria, zoomed in</text>
    {step === 'mutate' && <><Label x={20} y={60} to={[322, 60]} lines={['bacteria multiply', 'quickly']} /><Label x={20} y={180} to={[337, 150]} lines={['one bacterium', 'has changed:', 'it has mutated']} strong colour={c.bugDeep} /></>}
    {step === 'resistant' && <><Label x={20} y={60} to={[282, 88]} lines={['killed by the', 'antibiotic']} /><Label x={20} y={180} to={[337, 150]} lines={['resistant: not', 'killed by the', 'antibiotic']} strong colour={c.bugDeep} /><Label x={20} y={130} to={[280, 116]} lines={['antibiotic']} colour={pill} /></>}
    {step === 'mrsa' && <Label x={20} y={60} to={[337, 70]} lines={['a resistant strain:', 'all one type,', 'such as MRSA']} strong colour={c.bugDeep} />}
  </Diagram>
}

// ---------- Mia's medicine cupboard and where the medicines came from ----------
function Willow({ x, y = 40, dim = false }: { x: number; y?: number; dim?: boolean }) {
  // A willow branch: a curved twig with thin shoots hanging down, each with narrow leaves.
  return <g opacity={dim ? c.faded : 1}><path d={`M${x - 46} ${y + 6}Q${x} ${y - 12} ${x + 44} ${y + 14}`} stroke="#8a6a4a" strokeWidth="5" fill="none" strokeLinecap="round" />
    {[-36, -18, 0, 18, 34].map((dx, i) => { const top = y + (dx * dx) / 160 - 2 + (dx > 0 ? dx / 8 : 0), len = 104 - Math.abs(dx) * .8
      return <g key={dx}><path d={`M${x + dx} ${top}q${i % 2 ? 5 : -5} ${len / 2} ${i % 2 ? 2 : -2} ${len}`} stroke="#7d8f55" strokeWidth="1.6" fill="none" />
        {Array.from({ length: Math.floor(len / 16) }, (_, k) => { const ly = top + 12 + k * 16, lx = x + dx + (i % 2 ? 3 : -3), side = k % 2 ? 1 : -1
          return <ellipse key={k} cx={lx + side * 6} cy={ly + 4} rx="8" ry="2.6" fill={leaf} transform={`rotate(${side * 62} ${lx + side * 6} ${ly + 4})`} /> })}</g> })}</g>
}
function Foxglove({ x, y = 250, dim = false }: { x: number; y?: number; dim?: boolean }) {
  // A foxglove: a tall stem with tube-shaped flowers hanging down on one side, getting smaller towards the top.
  return <g opacity={dim ? c.faded : 1}><path d={`M${x} ${y}V${y - 196}`} stroke={leafDeep} strokeWidth="4" strokeLinecap="round" />
    {[[-1, y - 20], [1, y - 34], [-1, y - 52]].map(([s, ly], i) => <path key={i} d={`M${x} ${ly}q${s * 30} -8 ${s * 44} ${-26}q${-s * 26} 2 ${-s * 44} 26z`} fill={leaf} />)}
    {Array.from({ length: 6 }, (_, i) => { const by = y - 84 - i * 20, k = 1 - i * .1
      return <g key={i} transform={`translate(${x + 4} ${by}) scale(${k})`}><path d="M0 0C6 -2 12 2 14 10L18 22C12 26 4 24 2 18Z" fill={petal} stroke="#9a4f87" strokeWidth="1.2" /><ellipse cx={10} cy={22} rx="7" ry="3" fill="#8e3f79" transform="rotate(-20 10 22)" /></g> })}
    {[0, 1, 2].map(i => <ellipse key={i} cx={x + 3} cy={y - 206 + i * 8} rx="3" ry="4" fill={petal} />)}</g>
}
function MouldDish({ x, y = 200, dim = false }: { x: number; y?: number; dim?: boolean }) {
  return <g opacity={dim ? c.faded : 1}><ellipse cx={x} cy={y} rx={52} ry={24} fill="#f2f6f8" stroke={c.ink} strokeWidth="1.8" />
    {[[-38, -4], [-30, 8], [34, -6], [26, 10], [40, 4], [-20, -14], [20, -15], [-42, 2]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="2.6" fill={c.bug} />)}
    <ellipse cx={x} cy={y} rx={24} ry={11} fill="none" stroke="#b9c7d2" strokeDasharray="3 3" />
    <path d={blob(x, y - 2, 13, 8, 5, .2)} fill={mould} stroke="#4d7c7d" strokeWidth="1.4" />
    {[-8, -2, 5, 10].map(dx => <path key={dx} d={`M${x + dx} ${y - 8}v-6`} stroke="#4d7c7d" strokeWidth="1.6" strokeLinecap="round" />)}</g>
}
const SOURCES = { willow: { x: 290, label: 'willow' }, foxglove: { x: 392, label: 'foxglove' }, mould: { x: 480, label: 'mould' } }
const PACKETS: Record<string, [number, number]> = { aspirin: [40, 74], digitalis: [120, 74], penicillin: [40, 154] }
const LINKS: Record<string, [keyof typeof SOURCES, string, Pt]> = { willow: ['willow', 'aspirin', [262, 46]], foxglove: ['foxglove', 'digitalis', [392, 62]], mould: ['mould', 'penicillin', [470, 172]] }
function Cupboard({ lit }: { lit: string | null }) {
  return <g><rect x={20} y={30} width={190} height={240} rx="6" fill="#f6efe4" stroke="#a88a64" strokeWidth="2" /><path d="M20 110H210M20 190H210" stroke="#a88a64" strokeWidth="2" />
    <text x={115} y={22} textAnchor="middle" fill={c.ink} fontSize="12">Mia’s medicine cupboard</text>
    {Object.entries(PACKETS).map(([name, [x, y]]) => <Packet key={name} x={x} y={y} w={74} h={34} name={name} dim={lit !== null && lit !== name} />)}
    <g opacity={lit === null ? 1 : c.faded}><rect x={130} y={150} width={30} height={38} rx="5" fill="#e3ecf2" stroke={pill} strokeWidth="1.4" /><rect x={50} y={228} width={60} height={38} rx="4" fill="#eaf1e3" stroke={pill} strokeWidth="1.4" /></g></g>
}
function SourceScene({ focus }: { focus: string }) {
  const step = focus.replace('drug-source-', '')
  if (step === 'lab') return <Diagram title="A lab bench with flasks, a new medicine packet and a leaf. Today, chemists in the pharmaceutical industry make new drugs in labs, and a new drug may still start with a chemical from a plant.">
    <Cupboard lit={null} />
    <path d="M236 232H528V244H236Z" fill="#c9d3da" stroke={c.ink} strokeWidth="1.6" /><path d="M250 244V286M514 244V286" stroke={c.ink} strokeWidth="3" />
    {[[290, 'M278 232L284 196V176H296V196L302 232Z', '#d7ecf3'], [360, 'M344 232Q344 206 356 200V170H364V200Q376 206 376 232Z', '#e7dcf2']].map(([x, d, fill]) => <path key={String(x)} d={String(d)} fill={String(fill)} stroke={c.ink} strokeWidth="1.6" />)}
    <path d="M410 226c10 -22 34 -26 46 -18c-8 18 -30 26 -46 18z" fill={leaf} stroke={leafDeep} strokeWidth="1.4" /><path d="M410 226l40 -16" stroke={leafDeep} strokeWidth="1.2" />
    <Packet x={466} y={200} w={58} h={30} name="new drug" />
    <Arrow x1={446} y1={222} x2={464} y2={218} colour={c.ink} width={1.8} />
    <Label x={236} y={60} lines={['chemists in labs:', 'the pharmaceutical', 'industry']} strong />
    <Label x={528} y={140} anchor="end" to={[432, 212]} lines={['may start from', 'a plant chemical']} colour={leafDeep} />
  </Diagram>
  const link = LINKS[step]
  const litSource = (s: string) => step === 'plants' ? s !== 'mould' : link ? link[0] === s : true
  const titles: Record<string, string> = {
    plants: 'Mia’s medicine cupboard beside a willow branch and a foxglove, highlighted. Plants make chemicals to defend themselves against pests and pathogens. A mould on a dish is faded.',
    willow: 'An arrow links the willow branch to the aspirin packet in Mia’s medicine cupboard. Aspirin was first made from a chemical in willow.',
    foxglove: 'An arrow links the foxglove to the digitalis packet in Mia’s medicine cupboard. Digitalis was first made from a chemical in foxgloves.',
    mould: 'An arrow links a mould growing on a dish to the penicillin packet in Mia’s medicine cupboard. Around the mould there is a clear ring where bacteria were killed.',
  }
  return <Diagram title={titles[step] || titles.plants}>
    <Cupboard lit={link ? link[1] : step === 'plants' ? '' : null} />
    <Willow x={SOURCES.willow.x} dim={!litSource('willow')} /><Foxglove x={SOURCES.foxglove.x} dim={!litSource('foxglove')} /><MouldDish x={SOURCES.mould.x} dim={!litSource('mould')} />
    {Object.entries(SOURCES).map(([key, s]) => <text key={key} x={s.x} y={272} textAnchor="middle" fill={c.ink} fontSize="13" fontWeight={litSource(key) ? 700 : 500} opacity={litSource(key) ? 1 : .4}>{s.label}</text>)}
    {link && (() => { const [px, py] = PACKETS[link[1]], end: Pt = [px + 74, py + 17], [sx, sy] = link[2]
      return <g><path d={`M${sx} ${sy}Q${(sx + end[0]) / 2} ${Math.min(sy, end[1]) - 70} ${end[0] + 16} ${end[1] - 8}`} stroke={c.ink} strokeWidth="2" fill="none" strokeDasharray="6 4" /><Arrow x1={end[0] + 16} y1={end[1] - 8} x2={end[0] + 2} y2={end[1]} colour={c.ink} width={2} /></g> })()}
    {step === 'plants' && <><path d="M392 196c6 -6 14 -4 16 2c-4 6 -12 6 -16 -2z" fill="#6d5a4b" /><circle cx={380} cy={186} r="2" fill={leafDeep} /><circle cx={374} cy={194} r="2" fill={leafDeep} /><Label x={528} y={290} anchor="end" lines={['plants make chemicals to defend themselves']} strong colour={leafDeep} /></>}
    {step === 'mould' && <Label x={528} y={120} anchor="end" to={[480, 186]} lines={['clear ring:', 'bacteria killed']} colour={c.bugDeep} />}
    {link && <text x={528} y={294} textAnchor="end" fill={c.ink} fontSize="14" fontWeight="700">{`${SOURCES[link[0]].label} → ${link[1]}`}</text>}
  </Diagram>
}
function SourceQuestion({ assessment }: { assessment: boolean }) {
  const xs = [100, 270, 440]
  return <Diagram title={assessment ? 'Three numbered sources: 1 a tall plant with bell-shaped flowers, 2 a branch with long, thin, hanging leaves, 3 a fuzzy growth on a dish.' : 'Three numbered sources: 1 a foxglove, which gave digitalis; 2 willow, which gave aspirin; 3 a mould on a dish, which gave penicillin.'}>
    <Foxglove x={xs[0]} y={250} /><Willow x={xs[1]} y={56} /><MouldDish x={xs[2]} y={196} />
    {xs.map((x, i) => <g key={x}><Badge n={i + 1} x={x} y={30} />{!assessment && <text x={x} y={280} textAnchor="middle" fill={c.ink} fontSize="14" fontWeight="700">{['foxglove: digitalis', 'willow: aspirin', 'mould: penicillin'][i]}</text>}</g>)}
  </Diagram>
}

// ---------- Data: clear zones around three antibiotics ----------
function ClearZoneData() {
  const bars: Array<[string, number]> = [['P', 4], ['Q', 18], ['R', 9]]
  const X = (i: number) => 150 + i * 120, Y = (v: number) => 240 - v * 9
  return <Diagram title="Bar chart of the clear zone around three antibiotics on one dish of a patient’s bacteria. The clear zone is where bacteria died. Antibiotic P: 4 mm. Antibiotic Q: 18 mm. Antibiotic R: 9 mm.">
    <text x={20} y={24} fill={c.ink} fontSize="14" fontWeight="600">Clear zone around each antibiotic</text>
    <path d="M90 240H470M90 240V50" stroke={c.ink} strokeWidth="2" /><text x={98} y={56} fill={c.ink} fontSize="12">width of clear zone in mm</text>
    {[0, 5, 10, 15, 20].map(v => <g key={v}><path d={`M84 ${Y(v)}h6`} stroke={c.ink} /><text x={80} y={Y(v) + 4} textAnchor="end" fontSize="11" fill={c.ink}>{v}</text></g>)}
    {bars.map(([name, v], i) => <g key={name}><rect x={X(i) - 30} y={Y(v)} width={60} height={v * 9} fill="#dfe6ec" stroke={pill} strokeWidth="1.6" />
      <text x={X(i)} y={Y(v) - 6} textAnchor="middle" fontSize="12" fill={c.ink}>{v} mm</text><text x={X(i)} y={258} textAnchor="middle" fontSize="13" fontWeight="700" fill={c.ink}>{name}</text></g>)}
    <text x={280} y={282} textAnchor="middle" fontSize="12" fill={c.ink}>antibiotic</text>
  </Diagram>
}

// ================= Lesson 25: testing drug M =================
const coat = '#f4f7fa'
function Mini({ x, y, scale = .5, jumper = c.jumperA, body = 150, facing = 1, blindfold = false }: { x: number; y: number; scale?: number; jumper?: string; body?: number; facing?: 1 | -1; blindfold?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><Person x={0} y={0} facing={facing} jumper={jumper} body={body} />
    {blindfold && <rect x={-27} y={-10} width={54} height={10} rx="3" fill="#4a5661" />}</g>
}
function Bottle({ x, y, label = true }: { x: number; y: number; label?: boolean }) {
  return <g><rect x={x - 20} y={y} width={40} height={58} rx="6" fill="#f3eef6" stroke={pill} strokeWidth="1.8" /><rect x={x - 12} y={y - 12} width={24} height={13} rx="2" fill={pill} />
    {label && <text x={x} y={y + 34} textAnchor="middle" fill={c.ink} fontSize="11" fontWeight="700"><tspan x={x}>drug</tspan><tspan x={x} dy={12}>M</tspan></text>}</g>
}
function CellDish({ x, y }: { x: number; y: number }) {
  return <g><ellipse cx={x} cy={y} rx={46} ry={16} fill="#f2f6f8" stroke={c.ink} strokeWidth="1.8" />{[[-26, -2], [-10, 4], [8, -4], [24, 3], [-2, -8]].map(([dx, dy], i) => <path key={i} d={blob(x + dx, y + dy, 8, 5, i + 3, .12)} fill={c.tissueFill} stroke={c.tissueLine} strokeWidth="1.2" />)}</g>
}
function Mouse({ x, y }: { x: number; y: number }) {
  return <g><ellipse cx={x} cy={y} rx={20} ry={12} fill="#d5d2cf" stroke="#8f8a86" strokeWidth="1.4" /><circle cx={x + 20} cy={y - 5} r="8" fill="#d5d2cf" stroke="#8f8a86" strokeWidth="1.4" /><circle cx={x + 16} cy={y - 13} r="4" fill="#e9c9c9" stroke="#8f8a86" /><circle cx={x + 24} cy={y - 6} r="1.4" fill={c.ink} />
    <path d={`M${x - 20} ${y + 2}q-16 4 -20 -8`} stroke="#b89a9a" strokeWidth="1.8" fill="none" /></g>
}
function Cage({ x, y, w = 110, h = 70 }: { x: number; y: number; w?: number; h?: number }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="4" fill="#fbfbf9" stroke={pill} strokeWidth="1.6" /><Mouse x={x + w / 2 - 6} y={y + h - 16} />
    {Array.from({ length: Math.floor(w / 12) }, (_, i) => <path key={i} d={`M${x + 8 + i * 12} ${y}V${y + h}`} stroke={pill} strokeWidth=".8" opacity=".6" />)}</g>
}
function Target({ x, y }: { x: number; y: number }) { return <g>{[10, 6, 2].map(r => <circle key={r} cx={x} cy={y} r={r} fill={r === 6 ? 'white' : 'none'} stroke={c.ink} strokeWidth="1.6" />)}</g> }
function Warning({ x, y }: { x: number; y: number }) { return <g><path d={`M${x} ${y - 10}L${x + 11} ${y + 9}H${x - 11}Z`} fill="#fdf1d8" stroke="#b3802a" strokeWidth="1.6" strokeLinejoin="round" /><path d={`M${x} ${y - 3}v6M${x} ${y + 6}v.5`} stroke="#b3802a" strokeWidth="2" strokeLinecap="round" /></g> }
function Spoon({ x, y }: { x: number; y: number }) { return <g><ellipse cx={x - 4} cy={y} rx="6" ry="4" fill="white" stroke={c.ink} strokeWidth="1.5" /><path d={`M${x + 2} ${y}h10`} stroke={c.ink} strokeWidth="2" /><circle cx={x + 18} cy={y - 2} r="5" fill="white" stroke={c.ink} strokeWidth="1.3" /><path d={`M${x + 18} ${y - 5}v3h2`} stroke={c.ink} strokeWidth="1.2" fill="none" /></g> }
const CHECKS = [{ key: 'efficacy', text: 'efficacy: does it work?' }, { key: 'toxicity', text: 'toxicity: how harmful?' }, { key: 'dosage', text: 'dosage: how much, how often?' }]
function LabScene({ focus }: { focus: string }) {
  const step = focus.replace(/^trial-(?:lab|check)-/, ''), check = focus.startsWith('trial-check-')
  const lit = (item: string) => check ? item === 'clipboard' : step === 'new' ? item === 'bottle' : step === 'cells' ? item === 'dish' : item === 'cage'
  const titles: Record<string, string> = {
    new: 'A lab bench with a bottle labelled drug M, highlighted, and a leaf beside it: the drug started as a plant chemical. A dish of cells, a mouse in a cage and a clipboard are faded.',
    cells: 'The lab bench with a dish of human cells highlighted. Preclinical testing starts with human cells and tissues, before any people take the drug.',
    animals: 'The lab bench with a cage holding a live mouse highlighted. Next, drug M is tested on live animals.',
    efficacy: 'A clipboard on the lab bench lists three checks. The first, efficacy, with a target symbol, is highlighted: does the drug work?',
    toxicity: 'The clipboard with its second check, toxicity, highlighted with a warning sign: how harmful is the drug, including side effects?',
    dosage: 'The clipboard with its third check, dosage, highlighted with a measuring spoon and a clock: how much of the drug, and how often?',
  }
  return <Diagram title={titles[step] || titles.new}>
    <path d="M14 232H526V244H14Z" fill="#c9d3da" stroke={c.ink} strokeWidth="1.6" /><path d="M30 244V290M510 244V290" stroke={c.ink} strokeWidth="3" />
    <g opacity={lit('bottle') ? 1 : c.faded}><Bottle x={70} y={174} /><path d="M104 230c6 -18 26 -24 38 -16c-6 16 -26 22 -38 16z" fill={leaf} stroke={leafDeep} strokeWidth="1.2" /></g>
    <g opacity={lit('dish') ? 1 : c.faded}><CellDish x={200} y={218} /></g>
    <g opacity={lit('cage') ? 1 : c.faded}><Cage x={270} y={160} /></g>
    <g opacity={lit('clipboard') ? 1 : c.faded}><rect x={400} y={60} width={124} height={170} rx="6" fill="#fbf8f1" stroke="#a88a64" strokeWidth="1.8" /><rect x={442} y={52} width={40} height={14} rx="3" fill="#a88a64" />
      {CHECKS.map((k, i) => { const y = 96 + i * 46, on = !check || k.key === step
        return <g key={k.key} opacity={on ? 1 : .35}>{i === 0 ? <Target x={420} y={y} /> : i === 1 ? <Warning x={420} y={y} /> : <Spoon x={420} y={y} />}
          <text x={448} y={y + 4} fill={c.ink} fontSize="12" fontWeight={check && on ? 700 : 500}>{k.key}</text></g> })}</g>
    {step === 'new' && <Label x={20} y={40} to={[70, 170]} lines={['drug M: a plant chemical', 'that might ease migraines']} strong />}
    {step === 'cells' && <Label x={226} y={60} to={[204, 204]} lines={['preclinical testing:', 'human cells and tissues']} strong />}
    {step === 'animals' && <Label x={20} y={40} to={[312, 172]} lines={['next: live animals']} strong />}
    {check && <Label x={20} y={40} to={[400, 96 + CHECKS.findIndex(k => k.key === step) * 46]} lines={[CHECKS.find(k => k.key === step)!.text]} strong />}
  </Diagram>
}
const VOL_X = [60, 125, 190], PAT_X = [290, 355, 420], AUNT = 1
function DoseMeter({ level, optimum = false }: { level: number; optimum?: boolean }) {
  const top = 70, bottom = 230, h = bottom - top
  return <g><text x={497} y={60} textAnchor="middle" fill={c.ink} fontSize="12" fontWeight="600">dose</text>
    <rect x={484} y={top} width={26} height={h} rx="6" fill="white" stroke={c.ink} strokeWidth="1.6" />
    {optimum && <rect x={480} y={bottom - h * .62} width={34} height={h * .14} fill="none" stroke={wbcLine} strokeWidth="2.4" rx="3" />}
    <rect x={487} y={bottom - h * level} width={20} height={h * level - 3} rx="4" fill={pill} opacity=".7" />
    {[.2, .4, .6, .8].map(k => <path key={k} d={`M484 ${bottom - h * k}h-6`} stroke={c.ink} />)}</g>
}
function ClinicScene({ focus }: { focus: string }) {
  const step = focus.replace('trial-people-', '')
  const volLit = step === 'trial' || step === 'healthy' || step === 'dose', patLit = step === 'trial' || step === 'patients' || step === 'optimum'
  const meterLit = step === 'dose' || step === 'optimum'
  const titles: Record<string, string> = {
    trial: 'A clinical trial: two groups of people take part. On the left are healthy volunteers and on the right are patients who get migraines. A dose meter is faded.',
    healthy: 'The healthy volunteers on the left are highlighted. They take drug M first, to check for harmful side effects. The patients are faded.',
    dose: 'The healthy volunteers and a dose meter are highlighted. The dose starts very low, with small steps up the meter.',
    patients: 'The patients on the right are highlighted, including Mia’s aunt. They have migraines and take drug M next.',
    optimum: 'The dose meter shows a highlighted band part-way up: the optimum dose, the dose that is most effective with few side effects.',
  }
  return <Diagram title={titles[step] || titles.trial}>
    <path d="M14 236H466" stroke="#b9c7d2" strokeWidth="2" />
    <g opacity={volLit ? 1 : c.faded}>{VOL_X.map((x, i) => <Mini key={x} x={x} y={130} scale={.55} jumper={i % 2 ? c.jumperA : c.jumperB} />)}<text x={125} y={264} textAnchor="middle" fill={c.ink} fontSize="13" fontWeight="700">healthy volunteers</text></g>
    <g opacity={patLit ? 1 : c.faded}>{PAT_X.map((x, i) => <Mini key={x} x={x} y={130} scale={.55} jumper={i === AUNT ? '#e4c9a8' : c.jumperA} />)}<text x={355} y={264} textAnchor="middle" fill={c.ink} fontSize="13" fontWeight="700">patients</text>
      {PAT_X.map(x => <path key={x} d={`M${x - 20} ${104}l-6 -4l2 -6l-7 -2`} stroke={c.red} strokeWidth="1.8" fill="none" opacity={step === 'patients' ? 1 : .5} />)}</g>
    <g opacity={meterLit ? 1 : c.faded}><DoseMeter level={step === 'dose' ? .1 : step === 'optimum' ? .56 : .3} optimum={step === 'optimum'} /></g>
    {step === 'dose' && <><Arrow x1={470} y1={214} x2={470} y2={170} colour={c.ink} width={1.8} /><Label x={466} y={34} anchor="end" lines={['very low dose,', 'raised little by little']} strong /></>}
    {step === 'trial' && <Label x={20} y={36} lines={['a clinical trial: testing on people']} strong />}
    {step === 'healthy' && <Label x={20} y={36} lines={['first: healthy volunteers']} strong />}
    {step === 'patients' && <Label x={236} y={36} to={[355, 108]} lines={['Mia’s aunt:', 'a patient']} strong />}
    {step === 'optimum' && <Label x={20} y={36} lines={['optimum dose (outlined on the meter):', 'most effective, with few side effects']} strong colour={wbcLine} />}
  </Diagram>
}
const G1 = [66, 128, 190], G2 = [350, 412, 474], DOC = 270
function Pot({ x, y, name }: { x: number; y: number; name?: string }) {
  return <g><path d={`M${x - 11} ${y}H${x + 11}L${x + 9} ${y + 22}H${x - 9}Z`} fill="white" stroke={pill} strokeWidth="1.5" /><rect x={x - 12} y={y - 5} width={24} height={6} rx="2" fill={pill} opacity=".6" />
    {name && <text x={x} y={y + 40} textAnchor="middle" fill={c.ink} fontSize="11" fontWeight="700">{name}</text>}</g>
}
function FairScene({ focus }: { focus: string }) {
  const step = focus.replace('trial-fair-', '')
  if (step === 'review') return <Diagram title="Peer review: a report of the trial results in the middle, with three other scientists around it adding ticks as they check the work, before it is published.">
    <rect x={220} y={50} width={100} height={130} rx="4" fill="white" stroke={c.ink} strokeWidth="1.8" /><text x={270} y={72} textAnchor="middle" fill={c.ink} fontSize="12" fontWeight="700">drug M results</text>
    {[90, 104, 118, 132, 146, 160].map(y => <path key={y} d={`M234 ${y}H${y % 28 ? 300 : 286}`} stroke="#b9c7d2" strokeWidth="2" />)}
    {[[330, 96], [330, 130], [206, 150]].map(([x, y], i) => <path key={i} d={`M${x - 6} ${y}l5 6l10 -12`} stroke="#3f8f6a" strokeWidth="3" fill="none" strokeLinecap="round" />)}
    {[[90, 120, c.jumperA], [450, 120, c.jumperB], [270, 230, coat]].map(([x, y, j], i) => <Mini key={i} x={Number(x)} y={Number(y)} scale={.45} jumper={String(j)} body={120} facing={Number(x) > 270 ? -1 : 1} />)}
    <Arrow x1={130} y1={130} x2={196} y2={122} colour={c.ink} width={1.6} /><Arrow x1={410} y1={130} x2={344} y2={122} colour={c.ink} width={1.6} />
    <Label x={20} y={20} lines={['peer review: other scientists', 'check the work before it is published']} strong />
  </Diagram>
  const potName2 = step === 'placebo' ? 'placebo' : undefined, potName1 = step === 'groups' || step === 'placebo' ? 'drug M' : undefined
  const patientsBlind = step === 'blind' || step === 'double', doctorBlind = step === 'double'
  const titles: Record<string, string> = {
    groups: 'Patients split into two groups with pill pots that look the same. Group 1’s pots are labelled drug M. Group 2 is faded.',
    placebo: 'Group 2’s identical-looking pots are labelled placebo: they look like the drug but do not do anything. A doctor stands between the groups to compare them.',
    blind: 'The patients in both groups wear blindfolds: in a blind trial they do not know whether they got drug M or the placebo. The doctor can see.',
    double: 'Both the patients and the doctor wear blindfolds: in a double-blind trial nobody knows who got which until all the results are gathered.',
  }
  return <Diagram title={titles[step] || titles.groups}>
    <text x={128} y={60} textAnchor="middle" fill={c.ink} fontSize="13" fontWeight="700">group 1</text><text x={412} y={60} textAnchor="middle" fill={c.ink} fontSize="13" fontWeight="700" opacity={step === 'groups' ? .4 : 1}>group 2</text>
    <g>{G1.map((x, i) => <g key={x}><Mini x={x} y={110} scale={.5} jumper={i === 1 ? '#e4c9a8' : c.jumperA} blindfold={patientsBlind} /><Pot x={x} y={200} name={i === 1 ? potName1 : undefined} /></g>)}</g>
    <g opacity={step === 'groups' ? c.faded : 1}>{G2.map((x, i) => <g key={x}><Mini x={x} y={110} scale={.5} jumper={i === 1 ? c.jumperB : c.jumperA} facing={-1} blindfold={patientsBlind} /><Pot x={x} y={200} name={i === 1 ? potName2 : undefined} /></g>)}</g>
    <g opacity={step === 'groups' ? c.faded : 1}><Mini x={DOC} y={96} scale={.56} jumper={coat} blindfold={doctorBlind} /><text x={DOC} y={266} textAnchor="middle" fill={c.ink} fontSize="12">doctor</text></g>
    {step === 'placebo' && <Label x={530} y={284} anchor="end" lines={['looks the same, does not do anything']} strong />}
    {step === 'blind' && <Label x={20} y={284} lines={['the patients do not know which they got']} strong />}
    {step === 'double' && <Label x={20} y={284} lines={['nobody knows until the results are gathered']} strong />}
    {step === 'groups' && <Label x={20} y={284} lines={['group 1 takes drug M']} strong />}
  </Diagram>
}
function StagesQuestion({ assessment }: { assessment: boolean }) {
  const PX = [10, 142, 274, 406], W = 124
  const captions = [['cells and', 'tissues'], ['live animals'], ['healthy', 'volunteers'], ['patients']]
  return <Diagram viewBox="0 0 540 260" title={assessment ? 'Four numbered pictures in a row, 1 to 4: cells in a dish, a mouse in a cage, two people standing, and two people sitting in chairs at a clinic.' : 'Four stages in order: 1 cells and tissues, 2 live animals, 3 healthy volunteers, 4 patients.'}>
    {PX.map((x, i) => <g key={x}><rect x={x} y={24} width={W} height={170} rx="10" fill={c.panelFill} stroke={c.panelLine} strokeWidth="1.5" /><Badge n={i + 1} x={x + W / 2} y={24} />
      {!assessment && <text x={x + W / 2} y={216} textAnchor="middle" fill={c.ink} fontSize="13" fontWeight="600">{captions[i].map((t, k) => <tspan key={t} x={x + W / 2} dy={k ? 15 : 0}>{t}</tspan>)}</text>}</g>)}
    <CellDish x={72} y={130} /><Cage x={152} y={100} w={104} h={64} />
    <Mini x={316} y={80} scale={.42} /><Mini x={366} y={80} scale={.42} jumper={c.jumperB} />
    {[440, 494].map((x, i) => <g key={x}><rect x={x - 18} y={150} width={36} height={8} fill="#c9b79c" /><path d={`M${x + 16} 110V172M${x - 16} 158V172`} stroke="#a88a64" strokeWidth="3" /><Mini x={x} y={96} scale={.4} body={130} jumper={i ? c.jumperA : '#e4c9a8'} /></g>)}
  </Diagram>
}
function DoseChart({ assessment }: { assessment: boolean }) {
  const relief = [20, 55, 80, 82], side = [2, 4, 6, 30]
  const X = (i: number) => 140 + i * 95, Y = (v: number) => 240 - v * 1.8
  return <Diagram title={assessment ? 'Chart of four doses of drug M. For doses 1 to 4 in order, bars show the percentage of patients whose migraines eased: 20%, 55%, 80% and 82%. A line shows the percentage with side effects: 2%, 4%, 6% and 30%.' : 'Chart of four doses of drug M, with dose 3 marked as the optimum: migraines eased for 80% with side effects for 6%, while dose 4 eased 82% but gave side effects to 30%.'}>
    <text x={20} y={24} fill={c.ink} fontSize="14" fontWeight="600">Four doses of drug M</text>
    <path d="M90 240H500M90 240V50" stroke={c.ink} strokeWidth="2" /><text x={98} y={56} fill={c.ink} fontSize="12">% of patients</text>
    {[0, 50, 100].map(v => <g key={v}><path d={`M84 ${Y(v)}h6`} stroke={c.ink} /><text x={80} y={Y(v) + 4} textAnchor="end" fontSize="11" fill={c.ink}>{v}</text></g>)}
    {relief.map((v, i) => <g key={i}><rect x={X(i) - 26} y={Y(v)} width={52} height={v * 1.8} fill="#dfe6ec" stroke={pill} strokeWidth="1.6" /><text x={X(i)} y={258} textAnchor="middle" fontSize="13" fontWeight="700" fill={c.ink}>{i + 1}</text></g>)}
    <path d={side.map((v, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(v)}`).join('')} stroke={c.ink} strokeWidth="2.4" strokeDasharray="6 4" fill="none" />
    {side.map((v, i) => <path key={i} d={`M${X(i)} ${Y(v) - 6}l6 10h-12z`} fill={c.ink} />)}
    <text x={295} y={278} textAnchor="middle" fontSize="12" fill={c.ink}>dose</text>
    <g fontSize="12"><rect x={104} y={92} width={16} height={12} fill="#dfe6ec" stroke={pill} /><text x={126} y={102} fill={c.ink}>migraines eased</text><path d="M104 120h16" stroke={c.ink} strokeWidth="2.4" strokeDasharray="6 4" /><text x={126} y={124} fill={c.ink}>side effects</text></g>
    {!assessment && <><path d={`M${X(2) - 32} ${Y(80) - 8}H${X(2) + 32}`} stroke={wbcLine} strokeWidth="3" /><text x={X(2)} y={Y(80) - 16} textAnchor="middle" fill={wbcLine} fontSize="13" fontWeight="700">optimum</text></>}
  </Diagram>
}
function ResultsChart() {
  const groups: Array<[string, number, number]> = [['drug M group', 8, 3], ['placebo group', 8, 6]]
  const Y = (v: number) => 240 - v * 20
  return <Diagram title="Bar chart from a double-blind trial of average migraine days per month. Drug M group: 8 days before and 3 days after three months. Placebo group: 8 days before and 6 days after.">
    <text x={20} y={24} fill={c.ink} fontSize="14" fontWeight="600">Migraine days per month, before and after 3 months</text>
    <path d="M90 240H500M90 240V50" stroke={c.ink} strokeWidth="2" /><text x={98} y={56} fill={c.ink} fontSize="12">average days</text>
    {[0, 2, 4, 6, 8].map(v => <g key={v}><path d={`M84 ${Y(v)}h6`} stroke={c.ink} /><text x={80} y={Y(v) + 4} textAnchor="end" fontSize="11" fill={c.ink}>{v}</text></g>)}
    {groups.map(([name, before, after], i) => { const cx = 190 + i * 200
      return <g key={name}><rect x={cx - 56} y={Y(before)} width={50} height={before * 20} fill="#eef2f5" stroke={pill} strokeWidth="1.6" /><rect x={cx + 6} y={Y(after)} width={50} height={after * 20} fill="#9fb0bd" stroke={pill} strokeWidth="1.6" />
        <text x={cx - 31} y={Y(before) - 6} textAnchor="middle" fontSize="12" fill={c.ink}>{before}</text><text x={cx + 31} y={Y(after) - 6} textAnchor="middle" fontSize="12" fill={c.ink}>{after}</text>
        <text x={cx} y={260} textAnchor="middle" fontSize="13" fontWeight="700" fill={c.ink}>{name}</text></g> })}
    <g fontSize="12"><rect x={462} y={80} width={16} height={12} fill="#eef2f5" stroke={pill} /><text x={484} y={90} fill={c.ink}>before</text><rect x={462} y={102} width={16} height={12} fill="#9fb0bd" stroke={pill} /><text x={484} y={112} fill={c.ink}>after</text></g>
    <text x={295} y={284} textAnchor="middle" fontSize="12" fill={c.ink}>Neither the patients nor the doctors knew who got which.</text>
  </Diagram>
}

export function MedicineVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'drug-ear-question') return <EarQuestion assessment={assessment} />
  if (focus === 'drug-summary') return <Summary />
  if (focus.startsWith('drug-flu-') || focus.startsWith('drug-ear-')) return <MiaScene focus={focus} />
  if (focus.startsWith('drug-resist-')) return <ResistScene focus={focus} />
  if (focus === 'drug-source-question') return <SourceQuestion assessment={assessment} />
  if (focus.startsWith('drug-source-')) return <SourceScene focus={focus} />
  if (focus === 'drug-antibiotic-data') return <ClearZoneData />
  if (focus === 'trial-stages-question') return <StagesQuestion assessment={assessment} />
  if (focus === 'trial-dose-question') return <DoseChart assessment={assessment} />
  if (focus === 'trial-results-data') return <ResultsChart />
  if (focus.startsWith('trial-lab-') || focus.startsWith('trial-check-')) return <LabScene focus={focus} />
  if (focus.startsWith('trial-people-')) return <ClinicScene focus={focus} />
  if (focus.startsWith('trial-fair-')) return <FairScene focus={focus} />
  return <MiaScene focus="drug-flu-mia" />
}

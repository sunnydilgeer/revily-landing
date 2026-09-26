import { useId, type ReactNode } from 'react'
import { Arrow, Badge, Bacterium, BodyCell, Diagram, Label, Person, Virus, blob, infectionPalette as c } from './InfectionVisuals'
import { Antibody, WhiteCell, defenceColours } from './DefenceVisuals'

// Lesson 24 (Lesson 25 will add trial- scenes here): original, code-native schematics of medicines. Not to scale; not micrographs.
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

export function MedicineVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'drug-ear-question') return <EarQuestion assessment={assessment} />
  if (focus === 'drug-summary') return <Summary />
  if (focus.startsWith('drug-flu-') || focus.startsWith('drug-ear-')) return <MiaScene focus={focus} />
  if (focus.startsWith('drug-resist-')) return <ResistScene focus={focus} />
  if (focus === 'drug-source-question') return <SourceQuestion assessment={assessment} />
  if (focus.startsWith('drug-source-')) return <SourceScene focus={focus} />
  if (focus === 'drug-antibiotic-data') return <ClearZoneData />
  return <MiaScene focus="drug-flu-mia" />
}

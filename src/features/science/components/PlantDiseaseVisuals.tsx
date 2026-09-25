import { useId, type ReactNode } from 'react'
import { Arrow, Diagram, Label, Mini, Mosquito, Protist, Virus, blob, infectionPalette as c, seeded } from './InfectionVisuals'

// Lesson 21: one garden scene per plant disease and one scene for malaria, with the part being taught
// highlighted and the rest faded (the Lesson 17–18 pattern). The photosynthesis chain is shown on the
// leaf itself (light arrows) rather than as a column of boxes.
// Colour code: green = plant tissue, yellow = light, amber = food, magenta = pathogens, red = blood.
const leafGreen = '#6aa86a', leafDeep = '#3f7f4c', pale = '#dde9b4', stemBrown = '#6f8a4a', soil = '#e9dcc5', tomato = '#d9534f'
const sun = '#efc75d', sunDeep = '#c9a227', spotInk = '#3b2a3f', yellowLeaf = '#e7cf62'
type Pt = [number, number]
const dimmed = (on: boolean) => (on ? 1 : c.faded)

function ZoomCircle({ cx, cy, r, children, from }: { cx: number; cy: number; r: number; children: ReactNode; from?: Pt }) {
  const id = useId().replace(/:/g, '')
  return <g>
    {from && <path d={`M${from[0]} ${from[1]}L${cx - r * .75} ${cy - r * .6}`} stroke={c.ink} strokeWidth="1.2" strokeDasharray="3 3" />}
    <clipPath id={id}><circle cx={cx} cy={cy} r={r - 1} /></clipPath>
    <circle cx={cx} cy={cy} r={r} fill="white" stroke={c.ink} strokeWidth="2" />
    <g clipPath={`url(#${id})`}>{children}</g>
  </g>
}
// A pointed leaf. "mosaic" adds pale patches, "spots" adds black spots with yellow rims, "yellow" is a dying leaf.
function Leaf({ x, y, size = 1, angle = 0, kind = 'healthy', seed = 1 }: { x: number; y: number; size?: number; angle?: number; kind?: 'healthy' | 'mosaic' | 'spots' | 'yellow'; seed?: number }) {
  const rx = 22 * size, ry = 11 * size, rand = seeded(seed)
  const d = `M${x - rx} ${y}C${x - rx * .5} ${y - ry * 1.3} ${x + rx * .5} ${y - ry * 1.3} ${x + rx} ${y}C${x + rx * .5} ${y + ry * 1.3} ${x - rx * .5} ${y + ry * 1.3} ${x - rx} ${y}Z`
  return <g transform={`rotate(${angle} ${x} ${y})`}>
    <path d={d} fill={kind === 'yellow' ? yellowLeaf : leafGreen} stroke={kind === 'yellow' ? '#b59a2e' : leafDeep} strokeWidth={Math.max(1, size)} />
    {kind === 'mosaic' && Array.from({ length: 4 }, (_, i) => <path key={i} d={blob(x - rx * .55 + i * rx * .36 + (rand() - .5) * 4, y + (rand() - .5) * ry * .8, rx * .2, ry * .45, seed * 7 + i, .2)} fill={pale} />)}
    {(kind === 'spots' || kind === 'yellow') && Array.from({ length: 3 }, (_, i) => { const sx = x - rx * .45 + i * rx * .45, sy = y + (rand() - .5) * ry * .7
      return <g key={i}><circle cx={sx} cy={sy} r={ry * .34} fill={kind === 'yellow' ? '#c9b24a' : yellowLeaf} opacity=".7" /><circle cx={sx} cy={sy} r={ry * .22} fill={spotInk} /></g> })}
    <path d={`M${x - rx * .9} ${y}H${x + rx * .9}`} stroke={kind === 'yellow' ? '#b59a2e' : leafDeep} strokeWidth={Math.max(.8, size * .8)} opacity=".7" />
  </g>
}
function TomatoPlant({ x, base, height = 190, kind, fruit = 3 }: { x: number; base: number; height?: number; kind: 'healthy' | 'mosaic'; fruit?: number }) {
  const levels = Math.max(3, Math.round(height / 45)), top = base - height
  return <g>
    <path d={`M${x} ${base}C${x - 6} ${base - height * .4} ${x + 6} ${base - height * .7} ${x} ${top}`} stroke={stemBrown} strokeWidth="4" fill="none" />
    {Array.from({ length: levels }, (_, i) => { const y = base - 30 - i * (height - 40) / levels, side = i % 2 ? 1 : -1
      return <g key={i}><path d={`M${x} ${y}q${side * 24} -6 ${side * 44} -2`} stroke={stemBrown} strokeWidth="2.4" fill="none" />
        {[0, 1, 2].map(j => <Leaf key={j} x={x + side * (20 + j * 14)} y={y - 8 + j * 6} size={.62} angle={side * (-20 + j * 20)} kind={kind} seed={i * 3 + j + 1} />)}</g> })}
    {Array.from({ length: fruit }, (_, i) => <circle key={i} cx={x + (i % 2 ? 14 : -14)} cy={base - 50 - i * 34} r="9" fill={tomato} stroke="#a33a36" strokeWidth="1.4" />)}
    <path d={`M${x - 40} ${base}H${x + 40}`} stroke="#b89a6a" strokeWidth="4" strokeLinecap="round" />
  </g>
}
function RoseBush({ x, base, kind, leaves = 9 }: { x: number; base: number; kind: 'healthy' | 'spots'; leaves?: number }) {
  const spots: Pt[] = [[-30, -60], [26, -74], [-20, -104], [30, -120], [-34, -140], [16, -150], [-8, -176], [34, -92], [-38, -88]]
  return <g>
    {[-14, 0, 14].map((dx, i) => <path key={i} d={`M${x + dx * .4} ${base}C${x + dx} ${base - 60} ${x + dx * 1.6} ${base - 120} ${x + dx} ${base - 180 + i * 10}`} stroke="#5f7a3a" strokeWidth="3.4" fill="none" />)}
    {spots.slice(0, leaves).map(([dx, dy], i) => <Leaf key={i} x={x + dx} y={base + dy} size={.72} angle={dx > 0 ? -20 : 20} kind={kind === 'spots' && i % 3 !== 1 ? 'spots' : 'healthy'} seed={i + 20} />)}
    <g transform={`translate(${x + 2} ${base - 196})`}>{[0, 72, 144, 216, 288].map(a => <circle key={a} cx={Math.cos(a * Math.PI / 180) * 8} cy={Math.sin(a * Math.PI / 180) * 8} r="9" fill="#d65a6a" stroke="#a63b4c" strokeWidth="1.2" />)}<circle r="6" fill="#b8424f" /></g>
    <path d={`M${x - 46} ${base}H${x + 46}`} stroke="#b89a6a" strokeWidth="4" strokeLinecap="round" />
  </g>
}
function SunRays({ targets, miss = [] }: { targets: Pt[]; miss?: number[] }) {
  return <g><circle cx={60} cy={36} r="18" fill={sun} stroke={sunDeep} strokeWidth="1.5" />
    {targets.map(([x, y], i) => miss.includes(i)
      ? <g key={i}><path d={`M76 44L${x} ${y}`} stroke={sun} strokeWidth="2.5" strokeDasharray="6 5" /><path d={`M${x} ${y}l${(x - 76) * .25} ${(y - 44) * .25}`} stroke={sun} strokeWidth="2.5" strokeDasharray="4 4" /></g>
      : <Arrow key={i} x1={76} y1={44} x2={x} y2={y} colour={sunDeep} width={2.2} />)}</g>
}

// ---------- TMV ----------
function TmvScene({ focus }: { focus: string }) {
  const step = focus === 'plantdisease-chain-tmv' ? 'chain' : focus === 'plantdisease-chain-growth' ? 'growth' : focus.replace('disease-tmv-', '')
  const titles: Record<string, string> = {
    cause: 'A tomato plant whose leaves have light and dark patches. It is infected with tobacco mosaic virus, TMV, shown enlarged beside a leaf.',
    signs: 'A zoomed-in tomato leaf with a mosaic pattern: pale patches where the leaf has lost its colour.',
    chain: 'Sunlight falls on a zoomed-in mosaic leaf. The green parts absorb light. The pale patches have less chlorophyll, so less light is absorbed and less photosynthesis happens.',
    growth: 'Two tomato plants side by side. The plant with TMV makes less food, so it is short with few tomatoes. The healthy plant is tall with more tomatoes.',
    spread: 'A gardener touches a tomato plant with TMV, then touches a healthy plant. The virus is carried on hands and tools.',
  }
  const zoom = step === 'signs' || step === 'chain' || step === 'cause'
  return <Diagram title={`${titles[step] || titles.cause}`}>
    <path d="M10 272H530" stroke={soil} strokeWidth="6" />
    <g opacity={dimmed(step === 'cause' || step === 'growth' || step === 'spread')}><TomatoPlant x={120} base={270} height={step === 'growth' ? 120 : 200} kind="mosaic" fruit={step === 'growth' ? 1 : 3} /></g>
    {step === 'cause' && <g><g transform="translate(206 70)"><Virus cx={0} cy={0} r={10} seed={5} /></g><Label x={226} y={46} lines={['tobacco mosaic', 'virus (TMV)']} strong colour={c.bugDeep} /><Label x={20} y={24} to={[76, 186]} lines={['patchy leaves']} strong /></g>}
    {zoom && <g opacity={dimmed(step !== 'cause')}><ZoomCircle cx={410} cy={160} r={104} from={step === 'cause' ? undefined : [160, 110]}>
      <rect x={300} y={50} width={220} height={220} fill="#f5f9ef" />
      <Leaf x={410} y={172} size={4.2} kind="mosaic" seed={11} />
    </ZoomCircle>
      {step === 'signs' && <Label x={300} y={290} to={[380, 170]} lines={['mosaic pattern: pale patches']} strong />}
      {step === 'chain' && <g>
        {([[350, 120, false], [392, 136, true], [432, 128, false], [470, 150, true]] as Array<[number, number, boolean]>).map(([x, y, paleHit], i) => paleHit
          ? <g key={i}><path d={`M${x - 50} ${y - 90}L${x} ${y}`} stroke={sun} strokeWidth="3" strokeDasharray="7 5" /><path d={`M${x} ${y}l20 36`} stroke={sun} strokeWidth="3" strokeDasharray="4 4" /></g>
          : <Arrow key={i} x1={x - 50} y1={y - 90} x2={x} y2={y} colour={sunDeep} width={3} />)}
        <circle cx={300} cy={30} r="16" fill={sun} stroke={sunDeep} strokeWidth="1.5" />
        <Label x={20} y={30} lines={['pale patches: less', 'chlorophyll, so less', 'light is absorbed']} strong />
        <Label x={316} y={290} lines={['so less photosynthesis']} strong colour={leafDeep} />
      </g>}
    </g>}
    {step === 'growth' && <g><TomatoPlant x={400} base={270} height={210} kind="healthy" fruit={4} />
      <Label x={20} y={40} lines={['with TMV: less food,', 'so it grows poorly']} strong /><Label x={310} y={36} lines={['healthy plant']} strong />
</g>}
    {step === 'spread' && <g><TomatoPlant x={420} base={270} height={180} kind="healthy" fruit={2} />
      <g transform="translate(262 120)">{[0, 1, 2, 3].map(i => <rect key={i} x={i * 9} y={-(i === 1 || i === 2 ? 6 : 0)} width={8} height={24} rx="4" fill={c.skin} stroke={c.skinLine} strokeWidth="1.3" />)}<path d={blob(16, 32, 20, 15, 3, .05)} fill={c.skin} stroke={c.skinLine} strokeWidth="1.5" />
        {[[6, 30], [22, 36], [14, 20]].map(([x, y], i) => <Virus key={i} cx={x} cy={y} r={3.2} seed={i} />)}</g>
      <Arrow x1={170} y1={150} x2={252} y2={150} colour={c.bug} width={2.2} /><Arrow x1={310} y1={150} x2={390} y2={150} colour={c.bug} width={2.2} />
      <Label x={20} y={30} lines={['spreads by touch: hands, tools', 'and plants touching each other']} strong /></g>}
  </Diagram>
}

// ---------- Rose black spot ----------
function Bin({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 22} ${y}H${x + 22}L${x + 18} ${y + 44}H${x - 18}Z`} fill="#c9d3da" stroke={c.ink} strokeWidth="1.6" /><rect x={x - 26} y={y - 8} width={52} height={8} rx="3" fill="#aebbc5" stroke={c.ink} strokeWidth="1.4" /></g>
}
function Sprayer({ x, y }: { x: number; y: number }) {
  return <g><rect x={x - 12} y={y} width={24} height={40} rx="5" fill="#dfeee0" stroke={c.ink} strokeWidth="1.6" /><path d={`M${x - 6} ${y}v-10h-16l-6 4`} stroke={c.ink} strokeWidth="1.8" fill="none" />
    {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={x - 34 - (i % 3) * 10} cy={y - 12 + (Math.floor(i / 3) - 1) * 8 + (i % 3) * 3} r="1.8" fill={c.water} />)}</g>
}
function BlackSpotScene({ focus }: { focus: string }) {
  const step = focus === 'plantdisease-chain-blackspot' ? 'chain' : focus.replace('disease-blackspot-', '')
  const titles: Record<string, string> = {
    cause: 'A rose bush with purple-black spots on its leaves. A zoomed-in leaf shows a spot, caused by a fungus, with fungal threads drawn enlarged.',
    signs: 'A rose bush with spotted leaves. Some spotted leaves have turned yellow and dropped to the ground.',
    chain: 'Sunlight falls on a rose bush that has lost many leaves. With fewer leaves, less light is captured, so less photosynthesis happens, less food is made and the plant grows poorly. This is the same chain as for TMV.',
    spread: 'Rain splashes and wind carry the fungus from a spotted rose bush to a healthy rose bush nearby.',
    stop: 'Stopping rose black spot: a gardener sprays fungicide on the bush and puts spotted leaves in a bin to be destroyed.',
  }
  const fallen = step === 'signs' || step === 'chain' || step === 'spread' || step === 'stop'
  return <Diagram title={titles[step] || titles.cause}>
    <path d="M10 272H530" stroke={soil} strokeWidth="6" />
    <RoseBush x={140} base={270} kind="spots" leaves={step === 'chain' ? 4 : fallen ? 7 : 9} />
    {fallen && <g opacity={dimmed(step === 'signs')}>{[[80, 262, 20], [200, 264, -30], [226, 258, 60]].map(([x, y, a], i) => <Leaf key={i} x={x} y={y} size={.7} angle={a} kind="yellow" seed={i + 60} />)}
      {step === 'signs' && <g><Leaf x={214} y={170} size={.7} angle={-30} kind="yellow" seed={71} /><path d="M214 184q6 30 -4 60" stroke={c.ink} strokeWidth="1.4" strokeDasharray="4 4" fill="none" /></g>}</g>}
    {step === 'cause' && <g><ZoomCircle cx={410} cy={150} r={104} from={[162, 136]}><rect x={300} y={40} width={220} height={220} fill="#f5f9ef" />
      <Leaf x={410} y={160} size={4} kind="spots" seed={30} />
      {[[-14, -4], [10, 6], [2, -12]].map(([dx, dy], i) => <path key={i} d={`M${392 + dx} ${156 + dy}q10 -8 18 2t18 -4`} stroke={spotInk} strokeWidth="1.4" fill="none" />)}</ZoomCircle>
      <Label x={20} y={30} to={[120, 166]} lines={['purple or black spots']} strong /><Label x={410} y={290} anchor="middle" lines={['a fungus causes the spots']} strong colour={c.bugDeep} /></g>}
    {step === 'signs' && <Label x={260} y={120} to={[214, 176]} lines={['spotted leaves turn', 'yellow and drop off']} strong />}
    {step === 'chain' && <g><SunRays targets={[[112, 186], [158, 150], [124, 124], [172, 110]]} miss={[1, 3]} />
      <text x={270} y={96} fill={c.ink} fontSize="14" fontWeight="700"><tspan x={270}>fewer leaves</tspan><tspan x={270} dy={22}>→ less photosynthesis</tspan><tspan x={270} dy={22}>→ less food made</tspan><tspan x={270} dy={22}>→ the plant grows poorly</tspan></text>
      <text x={270} y={210} fill={leafDeep} fontSize="13" fontWeight="600">the same chain as TMV</text></g>}
    {step === 'spread' && <g><RoseBush x={430} base={270} kind="healthy" leaves={9} />
      {[0, 1, 2].map(i => <path key={i} d={`M${220 + i * 10} ${90 + i * 26}q40 -12 80 0t80 0`} stroke="#9fb6c4" strokeWidth="2.2" fill="none" />)}
      {[[250, 70], [300, 60], [350, 74]].map(([x, y], i) => <path key={i} d={`M${x} ${y}q4 6 0 10q-4 -4 0 -10z`} fill={c.water} />)}
      {[[262, 110], [300, 128], [338, 116], [372, 138]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={spotInk} />)}
      <Arrow x1={230} y1={180} x2={370} y2={180} colour={c.ink} width={2.2} />
      <Label x={20} y={30} lines={['water or wind carries the fungus to other roses']} strong /></g>}
    {step === 'stop' && <g><Sprayer x={276} y={120} /><Bin x={440} y={200} />{[[430, 196, 20], [452, 192, -30]].map(([x, y, a], i) => <Leaf key={i} x={x} y={y} size={.6} angle={a} kind="spots" seed={i + 80} />)}
      <Arrow x1={240} y1={236} x2={410} y2={214} colour={c.ink} width={2} />
      <Label x={300} y={60} lines={['fungicide kills the fungus']} strong /><Label x={330} y={290} lines={['remove and destroy spotted leaves']} anchor="middle" strong /></g>}
  </Diagram>
}

// ---------- Malaria ----------
function FeverGraph({ x, y }: { x: number; y: number }) {
  const pts = Array.from({ length: 29 }, (_, i) => { const peak = i % 7 === 3 ? 42 : i % 7 === 2 || i % 7 === 4 ? 18 : 0; return [x + i * 8, y + 70 - peak] as Pt })
  return <g><path d={`M${x} ${y}V${y + 90}H${x + 234}`} stroke={c.ink} strokeWidth="2" fill="none" /><path d={`M${x} ${y + 70}H${x + 230}`} stroke="#9aabb8" strokeDasharray="5 4" />
    <path d={pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('')} stroke={c.red} strokeWidth="2.6" fill="none" />
    <text x={x + 4} y={y - 8} fill={c.ink} fontSize="12">body temperature</text><text x={x + 234} y={y + 106} textAnchor="end" fill={c.ink} fontSize="12">days →</text>
    <text x={x + 236} y={y + 74} fill="#6f8290" fontSize="11">normal</text></g>
}
function MalariaScene({ focus }: { focus: string }) {
  const step = focus.replace('disease-malaria-', '')
  const titles: Record<string, string> = {
    cause: 'A person with malaria. A zoomed-in view of their blood shows protists, drawn enlarged, among red blood cells. A mosquito is nearby, because part of the protist’s life cycle happens inside mosquitoes.',
    signs: 'A person with malaria and a graph of their body temperature over several days. The fever rises, falls and keeps coming back.',
    stop: 'Stopping malaria: a person sleeps under a mosquito net, which keeps mosquitoes out, and standing water where mosquitoes breed is removed.',
  }
  return <Diagram title={titles[step] || titles.cause}>
    {step !== 'stop' && <g><Mini x={90} y={80} jumper={c.jumperA} scale={.6} body={150} /><path d="M112 62q6 -8 0 -16M120 64q7 -10 0 -20" stroke={c.red} strokeWidth="2" fill="none" opacity={step === 'signs' ? 1 : .4} /></g>}
    {step === 'cause' && <g><ZoomCircle cx={380} cy={160} r={104} from={[104, 150]}><rect x={270} y={50} width={220} height={220} fill="#fbe9e9" />
      {[[320, 110], [440, 130], [340, 220], [460, 210], [400, 90]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="17" fill="#e98b8b" stroke="#b85b5b" strokeWidth="1.4" /><circle cx={x} cy={y} r="7" fill="#f2b0b0" /></g>)}
      {[[380, 160], [420, 190]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) scale(.45) translate(${-x} ${-y})`}><Protist cx={x} cy={y} /></g>)}</ZoomCircle>
      <g transform="translate(206 70) scale(1.3) translate(-206 -70)"><Mosquito x={206} y={70} /></g>
      <Label x={380} y={290} lines={['protists in the blood (drawn enlarged)']} anchor="middle" strong colour={c.bugDeep} />
      <Label x={250} y={30} lines={['part of its life cycle', 'happens in mosquitoes']} strong /></g>}
    {step === 'signs' && <g><FeverGraph x={250} y={70} /><Label x={250} y={220} lines={['fever that keeps', 'coming back; it can kill']} strong /></g>}
    {step === 'stop' && <g>
      <rect x={30} y={200} width={200} height={30} rx="6" fill="#dcd3c3" stroke={c.ink} strokeWidth="1.6" /><path d="M40 230v30M220 230v30" stroke={c.ink} strokeWidth="3" />
      <circle cx={62} cy={190} r="14" fill={c.skin} stroke={c.skinLine} strokeWidth="1.5" /><path d="M76 184H214V200H76Z" fill={c.jumperA} stroke={c.ink} strokeWidth="1.4" />
      <path d="M30 200C30 90 230 90 230 200" fill="white" fillOpacity=".35" stroke="#7d8b96" strokeWidth="1.6" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${46 + i * 21} 200C${46 + i * 21} 150 ${60 + i * 16} 118 ${130} 110`} stroke="#b5c0c8" strokeWidth="1" fill="none" />)}
      <g transform="translate(276 104)"><Mosquito x={0} y={0} /></g><Arrow x1={258} y1={122} x2={236} y2={146} colour={c.ink} width={2} /><path d="M226 140l14 12" stroke={c.red} strokeWidth="3" strokeLinecap="round" />
      <path d={blob(420, 236, 70, 20, 9, .12)} fill="#cfe7f2" stroke={c.water} strokeWidth="1.6" />{[[400, 232], [430, 240], [452, 230]].map(([x, y], i) => <path key={i} d={`M${x} ${y}q4 -4 8 0`} stroke={c.ink} strokeWidth="1.4" fill="none" />)}
      <path d="M362 206l116 60M478 206l-116 60" stroke={c.red} strokeWidth="3" opacity=".8" />
      <Label x={20} y={40} lines={['mosquito nets stop bites', 'while people sleep']} strong />
      <Label x={330} y={170} lines={['stop mosquitoes', 'breeding in still water']} strong /></g>}
  </Diagram>
}

export function PlantDiseaseVisual({ focus }: { focus: string }) {
  if (focus.startsWith('disease-tmv-') || focus === 'plantdisease-chain-tmv' || focus === 'plantdisease-chain-growth') return <TmvScene focus={focus} />
  if (focus.startsWith('disease-blackspot-') || focus === 'plantdisease-chain-blackspot') return <BlackSpotScene focus={focus} />
  return <MalariaScene focus={focus} />
}

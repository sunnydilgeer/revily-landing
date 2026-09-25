import { useId, type ReactNode } from 'react'
import { Arrow, Bacterium, BodyCell, Diagram, Droplets, Label, Mini, Person, Virus, blob, infectionPalette as c } from './InfectionVisuals'

// Lesson 20: one scene per disease, with the part being taught highlighted and the rest faded
// (the Lesson 17–18 pattern). The four-question comparison survives only as the end-of-lesson grid.
// Colour code as the other B3 diagrams: magenta = pathogens, blue = water/droplets, amber = food, red = blood,
// slate blue = white blood cells (immune cells).
const wbcFill = '#e3e9f7', wbcLine = '#5d74a8', wbcNucleus = '#8fa6d6'
const rawMeat = '#f2b8b0', cooked = '#d9a066', board = '#d8b98f', leaf = '#79b36a', discharge = '#c9c35a'
type Pt = [number, number]
const dimmed = (on: boolean) => (on ? 1 : c.faded)

function ZoomCircle({ cx, cy, r, children, from }: { cx: number; cy: number; r: number; children: ReactNode; from?: Pt }) {
  const id = useId().replace(/:/g, '')
  return <g>
    {from && <path d={`M${from[0]} ${from[1]}L${cx - r * .7} ${cy - r * .7}`} stroke={c.ink} strokeWidth="1.2" strokeDasharray="3 3" />}
    <clipPath id={id}><circle cx={cx} cy={cy} r={r - 1} /></clipPath>
    <circle cx={cx} cy={cy} r={r} fill="white" stroke={c.ink} strokeWidth="2" />
    <g clipPath={`url(#${id})`}>{children}</g>
  </g>
}
function ImmuneCell({ cx, cy, r = 22, damaged = false }: { cx: number; cy: number; r?: number; damaged?: boolean }) {
  return <g opacity={damaged ? .55 : 1}><path d={blob(cx, cy, r, r * .92, Math.round(cx), .1)} fill={wbcFill} stroke={wbcLine} strokeWidth="2" strokeDasharray={damaged ? '6 4' : undefined} />
    {[[-5, -3, .32], [5, -5, .28], [2, 6, .28]].map(([dx, dy, k], i) => <circle key={i} cx={cx + dx * r / 22} cy={cy + dy * r / 22} r={r * k} fill={wbcNucleus} />)}</g>
}
function Capsule({ x, y, colour = '#e7a93b', angle = -30 }: { x: number; y: number; colour?: string; angle?: number }) {
  return <g transform={`rotate(${angle} ${x} ${y})`}><rect x={x - 18} y={y - 8} width={36} height={16} rx="8" fill="white" stroke={c.ink} strokeWidth="1.6" /><path d={`M${x} ${y - 8}H${x + 10}A8 8 0 0 1 ${x + 10} ${y + 8}H${x}Z`} fill={colour} /></g>
}
function Cross({ x, y, size = 7 }: { x: number; y: number; size?: number }) {
  return <path d={`M${x - size} ${y - size}l${size * 2} ${size * 2}M${x + size} ${y - size}l${-size * 2} ${size * 2}`} stroke={c.red} strokeWidth="2.4" strokeLinecap="round" />
}
// Two simple head-and-shoulders figures, used for "passed between people" routes.
function Pair({ x, y }: { x: number; y: number }) {
  return <g><Mini x={x} y={y} scale={.62} body={80} /><Mini x={x + 130} y={y} facing={-1} jumper={c.jumperB} scale={.62} body={80} /></g>
}

// ---------- Salmonella: a kitchen, then inside the gut ----------
function Drumstick({ x, y, raw }: { x: number; y: number; raw: boolean }) {
  return <g><path d={`M${x - 34} ${y + 6}C${x - 44} ${y - 18} ${x - 10} ${y - 30} ${x + 12} ${y - 14}C${x + 24} ${y - 4} ${x + 10} ${y + 14} ${x - 6} ${y + 14}Z`} fill={raw ? rawMeat : cooked} stroke={raw ? '#c47f77' : '#a7713c'} strokeWidth="1.8" />
    <path d={`M${x + 6} ${y + 2}L${x + 30} ${y + 16}`} stroke="#efe6d8" strokeWidth="7" strokeLinecap="round" /><circle cx={x + 32} cy={y + 18} r="5" fill="#efe6d8" /></g>
}
function Hen({ x, y }: { x: number; y: number }) {
  return <g><path d={blob(x, y, 26, 20, 5, .06)} fill="white" stroke={c.ink} strokeWidth="1.6" /><circle cx={x + 24} cy={y - 18} r="11" fill="white" stroke={c.ink} strokeWidth="1.6" />
    <path d={`M${x + 20} ${y - 30}q4 -8 8 0q4 -8 6 2`} fill={c.red} /><path d={`M${x + 34} ${y - 18}l8 3l-8 3z`} fill="#e7a93b" /><circle cx={x + 27} cy={y - 20} r="1.6" fill={c.ink} />
    <path d={`M${x - 6} ${y + 18}v12M${x + 6} ${y + 18}v12`} stroke="#e7a93b" strokeWidth="2.4" /></g>
}
function SalmonellaScene({ step }: { step: string }) {
  const kitchen = step === 'cause' || step === 'spread' || step === 'stop', gut = step === 'signs'
  const titles: Record<string, string> = {
    cause: 'A kitchen worktop with a piece of undercooked chicken that is still pink inside. Salmonella bacteria, drawn enlarged, are on the chicken.',
    signs: 'A person who feels ill, with a zoomed-in view of their gut. Salmonella bacteria release toxins that damage the gut lining, causing fever, stomach cramps, vomiting and diarrhoea.',
    spread: 'A kitchen worktop. Salmonella bacteria pass from raw chicken onto an unwashed hand, then onto a bowl of salad.',
    stop: 'Stopping Salmonella: a farm hen is vaccinated, and a person washes their hands at a tap before preparing food.',
  }
  return <Diagram title={titles[step] || titles.cause}>
    <g opacity={dimmed(kitchen)}>
      <path d="M10 236H280" stroke={c.panelLine} strokeWidth="3" />
      <rect x={24} y={206} width={150} height={24} rx="6" fill={board} stroke="#a88a5e" strokeWidth="1.6" />
      <Drumstick x={84} y={190} raw={step !== 'stop'} />
      {step !== 'stop' && [[64, 180], [92, 176], [74, 196]].map(([x, y], i) => <Bacterium key={i} cx={x} cy={y} length={14} thick={6} seed={i + 3} angle={i * 30} />)}
      <path d="M198 206C204 234 262 234 268 206Z" fill="#f4f1ea" stroke={c.ink} strokeWidth="1.6" />{[[214, 202], [230, 196], [248, 202]].map(([x, y], i) => <path key={i} d={blob(x, y, 11, 7, i + 40, .2)} fill={leaf} stroke="#4f8a45" strokeWidth="1.2" />)}
      {step === 'spread' && <g><g>{[0, 1, 2, 3].map(i => <rect key={i} x={140 + i * 9} y={116 - (i === 1 || i === 2 ? 6 : 0)} width={8} height={26} rx="4" fill={c.skin} stroke={c.skinLine} strokeWidth="1.3" />)}<path d={blob(156, 150, 20, 16, 3, .05)} fill={c.skin} stroke={c.skinLine} strokeWidth="1.6" /><rect x={126} y={138} width={9} height={22} rx="4.5" fill={c.skin} stroke={c.skinLine} strokeWidth="1.3" transform="rotate(-35 130 149)" /></g>{[[150, 140], [162, 150]].map(([x, y], i) => <Bacterium key={i} cx={x} cy={y} length={12} thick={5} seed={i + 9} />)}
        <Arrow x1={104} y1={176} x2={138} y2={150} colour={c.bug} width={2.2} /><Arrow x1={180} y1={156} x2={214} y2={188} colour={c.bug} width={2.2} />
        <Label x={20} y={120} lines={['raw chicken']} strong /><Label x={150} y={100} lines={['unwashed hand']} anchor="middle" strong /><Label x={233} y={258} lines={['other food']} anchor="middle" strong /></g>}
      {step === 'cause' && <Label x={20} y={130} to={[74, 186]} lines={['undercooked chicken', 'with Salmonella', 'bacteria']} strong colour={c.bugDeep} />}
      {step === 'stop' && <g><Hen x={60} y={90} /><path d="M92 60l22 -14" stroke={c.ink} strokeWidth="3" strokeLinecap="round" /><path d="M110 44l10 -6" stroke={c.ink} strokeWidth="1.5" />
        <Label x={20} y={34} lines={['UK poultry are vaccinated']} strong />
        <g transform="translate(176 104)"><path d="M0 0H40V14" stroke={c.ink} strokeWidth="6" fill="none" strokeLinecap="round" />{[26, 38].map(y => <circle key={y} cx={40} cy={y} r="3" fill={c.water} />)}<ellipse cx={34} cy={56} rx="12" ry="7" fill={c.skin} stroke={c.skinLine} strokeWidth="1.5" /><ellipse cx={50} cy={58} rx="12" ry="7" fill="#e8cbb1" stroke={c.skinLine} strokeWidth="1.5" /></g>
        <Label x={150} y={84} lines={['clean hands and kitchens']} strong /></g>}
    </g>
    <g opacity={dimmed(gut)}>
      <Mini x={340} y={70} jumper={c.jumperA} scale={.55} body={120} />
      {gut && <path d="M360 50q6 -8 0 -16M368 52q7 -10 0 -20" stroke={c.red} strokeWidth="2" fill="none" />}
      <ZoomCircle cx={456} cy={176} r={70} from={[350, 140]}>
        <rect x={380} y={196} width={160} height={60} fill="#f6e3dc" />
        {[404, 440, 476, 512].map((x, i) => <BodyCell key={x} cx={x} cy={214} rx={17} ry={18} seed={i + 5} damaged={i === 1} />)}
        {[[424, 150], [470, 140]].map(([x, y], i) => <Bacterium key={i} cx={x} cy={y} length={26} thick={11} seed={i + 12} angle={i ? 20 : -10} />)}
        {[[438, 172], [452, 184], [482, 168], [496, 182], [466, 190]].map(([x, y], i) => <path key={i} d={`M${x} ${y - 5}l5 5l-5 5l-5 -5z`} fill={c.bugDeep} />)}
      </ZoomCircle>
      {gut && <><Label x={290} y={286} to={[440, 206]} lines={['toxins damage the gut lining']} strong colour={c.bugDeep} />
        <text x={20} y={40} fill={c.ink} fontSize="14" fontWeight="700"><tspan x={20}>signs: fever, stomach</tspan><tspan x={20} dy={17}>cramps, vomiting,</tspan><tspan x={20} dy={17}>diarrhoea</tspan></text></>}
    </g>
  </Diagram>
}

// ---------- Gonorrhoea: passed between people; bacteria and antibiotics ----------
const PAIRS: Pt[] = [[340, 100], [380, 80], [424, 96], [462, 120], [352, 150], [398, 136], [446, 160], [372, 196], [420, 196], [468, 206]]
function Diplococcus({ x, y, dim = false, strong = false }: { x: number; y: number; dim?: boolean; strong?: boolean }) {
  return <g opacity={dim ? .3 : 1}>{[-6, 6].map(dx => <circle key={dx} cx={x + dx} cy={y} r="7" fill={c.bugFill} stroke={strong ? c.bugDeep : c.bug} strokeWidth={strong ? 3 : 1.8} />)}</g>
}
function GonorrhoeaScene({ step }: { step: string }) {
  const people = step === 'cause' || step === 'signs' || step === 'stop', bugs = step !== 'signs'
  const resistant = [2, 6, 8]
  const titles: Record<string, string> = {
    cause: 'Two people, with an arrow between them showing that gonorrhoea is passed on by sexual contact. A zoomed-in circle shows the bacteria that cause it, in pairs, drawn enlarged.',
    signs: 'The signs of gonorrhoea: a thick yellow or green discharge, and pain when urinating.',
    treat: 'An antibiotic capsule of penicillin, with the gonorrhoea bacteria crossed out because penicillin used to kill them.',
    resistant: 'Penicillin kills most of the gonorrhoea bacteria, but a few highlighted bacteria from a resistant strain survive.',
    stop: 'A barrier between the two people blocks the bacteria, and a different antibiotic kills the resistant bacteria.',
  }
  return <Diagram title={titles[step] || titles.cause}>
    <g opacity={dimmed(people)}>
      <Pair x={50} y={70} />
      {step !== 'stop' && <g><Arrow x1={115} y1={96} x2={150} y2={96} width={2.2} /><Arrow x1={121} y1={96} x2={86} y2={96} width={2.2} /></g>}
      {step === 'cause' && <Label x={20} y={196} lines={['passed on by sexual', 'contact: an STD']} strong />}
      {step === 'signs' && <g><path d="M62 206c10 14 16 22 16 30a16 16 0 0 1 -32 0c0 -8 6 -16 16 -30z" fill={discharge} stroke="#948f35" strokeWidth="1.6" />
        <path d="M184 196l-12 20h12l-8 22l22 -28h-12l8 -14z" fill="#f0c24b" stroke="#b58a1d" strokeWidth="1.4" />
        <text x={20} y={274} fill={c.ink} fontSize="13" fontWeight="700"><tspan x={20}>thick yellow or</tspan><tspan x={20} dy={15}>green discharge</tspan></text>
        <text x={156} y={274} fill={c.ink} fontSize="13" fontWeight="700"><tspan x={156}>pain when</tspan><tspan x={156} dy={15}>urinating</tspan></text></g>}
      {step === 'stop' && <g><rect x={112} y={50} width={10} height={100} rx="5" fill={c.ink} />{[[98, 80], [98, 112]].map(([x, y], i) => <Diplococcus key={i} x={x} y={y} />)}
        <Label x={20} y={206} lines={['barrier method:', 'condoms']} strong /></g>}
    </g>
    <g opacity={dimmed(bugs)}>
      <ZoomCircle cx={404} cy={150} r={100}>
        {PAIRS.map(([x, y], i) => { const survivor = resistant.includes(i)
          const killed = step === 'treat' || (step === 'resistant' && !survivor) || step === 'stop'
          return <g key={i}><Diplococcus x={x} y={y} dim={killed} strong={step === 'resistant' && survivor} />{killed && <Cross x={x} y={y} />}</g> })}
        {(step === 'treat' || step === 'resistant') && <Capsule x={452} y={82} />}
        {step === 'stop' && <Capsule x={452} y={82} colour="#4fa39a" />}
      </ZoomCircle>
      {step === 'cause' && <Label x={290} y={286} lines={['bacteria, drawn enlarged']} strong colour={c.bugDeep} />}
      {step === 'treat' && <Label x={236} y={30} lines={['penicillin used to kill them']} strong />}
      {step === 'resistant' && <Label x={236} y={30} to={[424, 96]} lines={['resistant strain survives']} strong colour={c.bugDeep} />}
      {step === 'stop' && <Label x={236} y={30} lines={['another antibiotic kills them']} strong />}
    </g>
  </Diagram>
}

// ---------- Measles: the Lesson 19 classroom again ----------
function Rash({ x, y }: { x: number; y: number }) {
  return <g>{[[-12, -8], [-4, 4], [8, -6], [12, 8], [-10, 12], [2, 14], [14, -14]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="2.6" fill={c.red} opacity=".85" />)}</g>
}
function MeaslesScene({ step }: { step: string }) {
  const titles: Record<string, string> = {
    cause: 'Two classmates. One sneezes a cloud of droplets towards the other. A zoomed-in circle shows measles viruses inside one droplet.',
    signs: 'The second classmate now has measles: a red skin rash on the face and a fever.',
    stop: 'The second classmate wears a shield badge showing they were vaccinated against measles as a young child.',
  }
  return <Diagram title={titles[step] || titles.cause}>
    <Person x={110} y={100} facing={1} jumper={c.jumperA} dim={step !== 'cause'} />
    <Person x={430} y={100} facing={-1} jumper={c.jumperB} badge={step === 'stop'} />
    <Droplets from={[140, 114]} to={[330, 118]} dim={step !== 'cause'} />
    {step === 'cause' && <g><ZoomCircle cx={206} cy={220} r={46} from={[236, 128]}><path d={blob(206, 220, 34, 32, 4, .05)} fill={c.dropFill} stroke={c.water} strokeWidth="1.6" />{[[194, 208], [220, 214], [202, 234]].map(([x, y], i) => <Virus key={i} cx={x} cy={y} r={7.5} seed={i + 3} />)}</ZoomCircle>
      <Label x={262} y={214} to={[228, 214]} lines={['measles virus', 'in droplets']} strong colour={c.bugDeep} /></g>}
    {step === 'signs' && <g><Rash x={426} y={104} /><path d="M458 70q6 -8 0 -16M466 72q7 -10 0 -20" stroke={c.red} strokeWidth="2" fill="none" />
      <Label x={200} y={70} to={[414, 102]} lines={['red skin rash']} strong /><Label x={250} y={40} to={[462, 62]} lines={['fever: a high temperature']} strong /></g>}
    {step === 'stop' && <g><Label x={170} y={236} to={[416, 176]} lines={['vaccinated as', 'a young child']} strong />
      <text x={20} y={28} fill={c.ink} fontSize="13" fontWeight="600">Measles can cause complications that kill.</text></g>}
  </Diagram>
}

// ---------- HIV: how it spreads, then inside the blood ----------
const TIMELINE = [{ text: ['first few weeks:', 'flu-like illness'], x: 24 }, { text: ['then, for years:', 'often no symptoms'], x: 102 }, { text: ['untreated:', 'late stage (AIDS)'], x: 166 }]
function HivScene({ step }: { step: string }) {
  const titles: Record<string, string> = {
    cause: 'HIV spreads by sexual contact, or when body fluids such as blood pass between people, for example by sharing needles. A zoomed-in circle shows HIV viruses in the blood near immune cells.',
    signs: 'A timeline: in the first few weeks HIV causes a flu-like illness, then there are often no symptoms for years.',
    stop: 'Inside an immune cell, HIV is copying itself. An antiretroviral drug blocks the copying, so the new copies are crossed out.',
    late: 'A timeline ending in the late stage, AIDS. In the blood, immune cells are damaged and other pathogens are no longer stopped.',
  }
  const routes = step === 'cause', timeline = step === 'signs' || step === 'late' || step === 'stop'
  return <Diagram title={titles[step] || titles.cause}>
    {routes && <g><Pair x={50} y={56} /><Arrow x1={115} y1={82} x2={150} y2={82} width={2.2} /><Arrow x1={121} y1={82} x2={86} y2={82} width={2.2} />
      <text x={20} y={170} fill={c.ink} fontSize="13" fontWeight="700">sexual contact</text>
      <path d="M60 212c9 13 14 20 14 27a14 14 0 0 1 -28 0c0 -7 5 -14 14 -27z" fill={c.red} stroke="#8f2f38" strokeWidth="1.4" />
      <path d="M100 250L170 208" stroke="#9aa6ae" strokeWidth="5" strokeLinecap="round" /><path d="M170 208L184 200" stroke={c.ink} strokeWidth="1.5" /><rect x={150} y={212} width={14} height={8} fill="#cfd8de" transform="rotate(-31 157 216)" />
      <text x={20} y={278} fill={c.ink} fontSize="13" fontWeight="700"><tspan x={20}>body fluids such as blood</tspan><tspan x={20} dy={15}>(sharing needles)</tspan></text></g>}
    {timeline && <g opacity={dimmed(step !== 'stop')}>
      <path d="M24 150H256" stroke={c.ink} strokeWidth="2.5" />{TIMELINE.map((t, i) => { const on = (step === 'signs' && i < 2) || (step === 'late' && i === 2) || step === 'stop'
        const show = i < 2 || step === 'late'
        return show ? <g key={i} opacity={on ? 1 : .45}><circle cx={t.x + 12} cy={150} r="7" fill={i === 2 ? c.red : 'white'} stroke={c.ink} strokeWidth="2" />
          <text x={t.x} y={i % 2 ? 196 : 108} fill={c.ink} fontSize="12" fontWeight={on ? 700 : 500}>{t.text.map((l, j) => <tspan key={l} x={t.x} dy={j ? 15 : 0}>{l}</tspan>)}</text></g> : null })}
      <text x={24} y={40} fill={c.ink} fontSize="13" fontWeight="600">time after infection →</text></g>}
    <g opacity={dimmed(step !== 'signs')}>
      <ZoomCircle cx={410} cy={150} r={112}>
        <rect x={290} y={30} width={240} height={240} fill="#fbe9e9" />
        {step === 'stop' ? <g><ImmuneCell cx={392} cy={150} r={62} /><Virus cx={380} cy={140} r={8} seed={2} />
          {[[430, 110], [450, 150], [430, 190], [470, 120], [470, 180]].map(([x, y], i) => <g key={i} opacity=".35"><Virus cx={x} cy={y} r={7} seed={i + 5} /></g>)}
          {[[430, 110], [450, 150], [430, 190]].map(([x, y], i) => <Cross key={i} x={x} y={y} />)}
          <Capsule x={342} y={216} colour="#4fa39a" angle={-10} /></g>
        : <g>{(step === 'late' ? [[360, 110, true], [440, 190, true], [470, 110, false]] : [[360, 110, false], [440, 190, false], [470, 110, false], [350, 200, false]]).map(([x, y, d], i) => <ImmuneCell key={i} cx={x as number} cy={y as number} damaged={d as boolean} />)}
          {[[400, 120], [420, 156], [380, 170], [460, 150]].map(([x, y], i) => <Virus key={i} cx={x} cy={y} r={7} seed={i + 1} />)}
          {step === 'late' && [[340, 170], [380, 220], [470, 220]].map(([x, y], i) => <Bacterium key={i} cx={x} cy={y} length={24} thick={10} seed={i + 30} angle={i * 25} />)}</g>}
      </ZoomCircle>
      {step === 'cause' && <Label x={530} y={22} anchor="end" lines={['HIV and immune cells']} strong colour={c.bugDeep} />}
      {step === 'stop' && <Label x={20} y={250} to={[330, 220]} lines={['antiretroviral drugs', 'stop HIV copying itself']} strong />}
      {step === 'late' && <Label x={20} y={250} to={[330, 172]} lines={['immune cells damaged:', 'other infections take hold']} strong />}
    </g>
  </Diagram>
}

export function HumanDiseaseVisual({ focus }: { focus: string }) {
  const [, disease, step] = focus.split('-')
  if (disease === 'salmonella') return <SalmonellaScene step={step} />
  if (disease === 'gonorrhoea') return <GonorrhoeaScene step={step} />
  if (disease === 'measles') return <MeaslesScene step={step} />
  return <HivScene step={step} />
}

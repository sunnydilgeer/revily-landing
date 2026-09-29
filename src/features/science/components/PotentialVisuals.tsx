import { physicsPalette as P, PhysicsDiagram, EnergyStoreBadge, TransferArrow } from './PhysicsKit'
import { ink, muted, Caption, Tag, Eq, Arrow, Floor, Ball, Shelf, Book, Spring, Hand, StoreBar, StepStrip, Ring, Leader, woodLine, metal, metalLine, warn, type Piece } from './EnergyStoreVisuals'
import { qty, Spaced, UnitBox } from './KineticVisuals'

/*
 * Physics Lesson 4: Gravitational and elastic potential energy. Original, code-native schematics; not to scale.
 * Focus ids start with 'gpe-'.
 *
 * Store colours are the PhysicsKit set: gravitational potential indigo, kinetic orange, elastic potential magenta.
 * Equation colours match the kinetic energy lesson: mass m blue; lengths (height h, extension e) amber;
 * g grey; spring constant k brown. The g.p.e. worked example reuses one drawing (a bag on a shelf 3 m up)
 * with a step strip on top, as in the kinetic energy lesson.
 */

const G = P.gravitationalLine, E = P.elasticLine, KL = P.kineticLine
const len = '#b06a1f', gcol = '#5a6b79', kcol = '#8a6443'

/** A vertical dimension line with end ticks and a label. */
function Dim({ x, y1, y2, label, colour = len, side = 'right' }: { x: number; y1: number; y2: number; label: string; colour?: string; side?: 'left' | 'right' }) {
  return <g>
    <path d={`M${x} ${y1 + 3}V${y2 - 3}M${x - 6} ${y1}h12M${x - 6} ${y2}h12`} stroke={colour} strokeWidth="2" />
    <Arrow from={[x, (y1 + y2) / 2]} to={[x, y1 + 2]} colour={colour} width={2} head={0.6} />
    <Arrow from={[x, (y1 + y2) / 2]} to={[x, y2 - 2]} colour={colour} width={2} head={0.6} />
    <text x={side === 'right' ? x + 10 : x - 10} y={(y1 + y2) / 2 + 5} textAnchor={side === 'right' ? 'start' : 'end'} fontSize="15" fontWeight="700" fill={colour}>{label}</text>
  </g>
}
/** A horizontal dimension line (an extension). */
function HDim({ x1, x2, y, label, colour = len }: { x1: number; x2: number; y: number; label: string; colour?: string }) {
  return <g>
    <path d={`M${x1 + 3} ${y}H${x2 - 3}M${x1} ${y - 6}v12M${x2} ${y - 6}v12`} stroke={colour} strokeWidth="2" />
    <text x={(x1 + x2) / 2} y={y + 20} textAnchor="middle" fontSize="14" fontWeight="700" fill={colour}>{label}</text>
  </g>
}
/** A shopping bag; (x, y) is the middle of its base. */
function Bag({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-12 -40Q-12 -54 0 -54Q12 -54 12 -40" stroke={woodLine} strokeWidth="3" fill="none" />
    <path d="M-22 -40H22L19 -3Q18 0 15 0H-15Q-18 0 -19 -3Z" fill="#f3d9a6" stroke="#b07f2a" strokeWidth="2" />
    <path d="M-8 -32h16" stroke="#b07f2a" strokeWidth="1.5" opacity=".6" />
  </g>
}
function Wall({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return <g><rect x={x - 10} y={y1} width={10} height={y2 - y1} rx="2" fill="#e6e0d5" stroke="#9c8a74" strokeWidth="1.8" />{Array.from({ length: Math.floor((y2 - y1) / 14) }, (_, i) => <path key={i} d={`M${x - 10} ${y1 + 10 + i * 14}l-6 6`} stroke="#9c8a74" strokeWidth="1.4" />)}</g>
}

/* ---------- Section 2: what is g.p.e.? ---------- */

const gWords: Piece[] = [['g.p.e.', G], [' = '], ['mass', qty.mass], [' × '], ['gravitational field strength', gcol], [' × '], ['height', len]]
const gRow: Array<[string, string, number]> = [['Ep', G, 168], ['=', ink, 214], ['m', qty.mass, 252], ['×', ink, 286], ['g', gcol, 318], ['×', ink, 350], ['h', len, 382]]
function Meaning({ focus }: { focus: string }) {
  if (focus === 'gpe-raised') return <PhysicsDiagram title="The same book on the floor and on a high shelf. Lifting it transfers energy to its gravitational potential store, so the bar for the raised book is much taller.">
    <Floor x1={20} x2={520} y={256} />
    <path d="M446 60V256" stroke={woodLine} strokeWidth="4" opacity=".45" />
    <StoreBar x={56} y={256} h={150} w={28} level={0.08} store="gravitational" />
    <Book x={124} y={256} />
    <text x={96} y={282} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>on the floor</text>
    <Shelf x={394} y={96} w={92} />
    <Book x={394} y={96} />
    <StoreBar x={494} y={256} h={150} w={28} level={0.85} store="gravitational" />
    <text x={420} y={282} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>on a high shelf</text>
    <TransferArrow from={[150, 232]} to={[350, 84]} bend={-0.2} colour={G} width={3.5} label="lifted" />
    <EnergyStoreBadge store="gravitational" x={270} y={26} label="Gravitational potential (g.p.e.)" />
  </PhysicsDiagram>
  if (focus === 'gpe-three') return <PhysicsDiagram title="A bag raised above the floor. Its g.p.e. depends on three things: its mass in kilograms, its height in metres, and the gravitational field strength g in newtons per kilogram.">
    <Floor x1={20} x2={520} y={262} />
    <Shelf x={200} y={96} w={110} />
    <Bag x={200} y={96} s={1.2} />
    <Dim x={112} y1={96} y2={262} label="height (m)" side="left" />
    <Tag x={330} y={60} text="mass (kg)" colour={qty.mass} />
    <Leader from={[296, 66]} to={[222, 64]} colour={qty.mass} />
    <Arrow from={[272, 110]} to={[272, 196]} colour={gcol} width={3.5} />
    <text x={288} y={150} fontSize="15" fontWeight="700" fill={gcol}>gravity pulls down</text>
    <text x={288} y={170} fontSize="14" fontWeight="700" fill={gcol}>strength: g (N/kg)</text>
  </PhysicsDiagram>
  if (focus === 'gpe-words') return <PhysicsDiagram title="The g.p.e. equation in words: gravitational potential energy equals mass times gravitational field strength times height.">
    <EnergyStoreBadge store="gravitational" x={270} y={34} label="Gravitational potential energy" />
    <rect x={14} y={72} width={512} height={116} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Eq x={270} y={118} size={20} pieces={gWords.slice(0, 4)} />
    <Eq x={270} y={156} size={20} pieces={gWords.slice(4)} />
    <Caption text="Multiply the three together." y={232} />
  </PhysicsDiagram>
  // gpe-symbols
  return <PhysicsDiagram title="The g.p.e. equation in symbols: Ep equals m times g times h. Ep is in joules, J; m in kilograms, kg; g in newtons per kilogram, N/kg; h in metres, m. On Earth, g is 9.8 N/kg.">
    <rect x={130} y={16} width={280} height={66} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Spaced y={62} items={gRow} />
    <UnitBox x={72} y={176} to={[168, 72]} name="g.p.e." unit="joules" symbol="J" colour={G} w={124} />
    <UnitBox x={204} y={176} to={[252, 72]} name="mass" unit="kilograms" symbol="kg" colour={qty.mass} w={124} />
    <UnitBox x={336} y={176} to={[318, 72]} name="field strength" unit="newtons per kg" symbol="N/kg" colour={gcol} w={124} />
    <UnitBox x={468} y={176} to={[382, 72]} name="height" unit="metres" symbol="m" colour={len} w={124} />
    <rect x={160} y={240} width={220} height={40} rx="12" fill={P.panel} stroke={gcol} strokeWidth="1.6" />
    <text x={270} y={266} textAnchor="middle" fontSize="16" fontWeight="800" fill={gcol}>on Earth, g = 9.8 N/kg</text>
  </PhysicsDiagram>
}

/* ---------- Section 3: worked example (one drawing, three steps) ---------- */

function Worked({ step }: { step: 1 | 2 | 3 }) {
  const titles = [
    'Step 1 of 3: a 5 kg bag is on a shelf 3 m above the ground. Write the equation Ep = m × g × h, with g = 9.8 N/kg.',
    'Step 2 of 3: put the numbers in, Ep = 5 × 9.8 × 3. Multiply one step at a time: 5 × 9.8 = 49, then 49 × 3 = 147.',
    'Step 3 of 3: the answer is Ep = 147 J.',
  ]
  return <PhysicsDiagram title={titles[step - 1]}>
    <StepStrip steps={['write it', 'substitute', 'answer']} active={step} colour={G} gap={160} />
    <Floor x1={20} x2={226} y={276} />
    <path d="M30 64V276" stroke={woodLine} strokeWidth="4" opacity=".45" />
    <Shelf x={134} y={100} w={100} />
    <Bag x={134} y={100} s={1.1} />
    <Tag x={206} y={70} text="5 kg" colour={qty.mass} w={56} />
    <Leader from={[180, 72]} to={[150, 76]} colour={qty.mass} />
    <Dim x={70} y1={110} y2={276} label="3 m" side="right" />
    <rect x={236} y={52} width={292} height={236} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <g opacity={step === 1 ? 1 : 0.55}><Spaced y={94} size={24} items={gRow.map(([t, c, x]) => [t, c, x + 107] as [string, string, number])} /></g>
    {step === 1 && <g>
      <text x={382} y={136} textAnchor="middle" fontSize="15" fontWeight="600" fill={ink}>m = 5 kg</text>
      <text x={382} y={160} textAnchor="middle" fontSize="15" fontWeight="600" fill={ink}>g = 9.8 N/kg</text>
      <text x={382} y={184} textAnchor="middle" fontSize="15" fontWeight="600" fill={ink}>h = 3 m</text>
      <text x={382} y={222} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>already in kg and m:</text>
      <text x={382} y={240} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>no converting needed</text>
    </g>}
    {step >= 2 && <g opacity={step === 2 ? 1 : 0.55}>
      <Eq x={382} y={136} size={21} pieces={[['Ep', G], [' = '], ['5', qty.mass], [' × '], ['9.8', gcol], [' × '], ['3', len]]} />
      <Eq x={382} y={176} size={18} weight={650} pieces={[['5', qty.mass], [' × '], ['9.8', gcol], [' = 49']]} />
      <Eq x={382} y={206} size={18} weight={650} pieces={[['49 × '], ['3', len], [' = 147']]} />
    </g>}
    {step === 3 && <g>
      <rect x={306} y={224} width={152} height={44} rx="12" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
      <Spaced y={254} size={22} items={[['Ep', G, 332], ['= 147', ink, 394], ['J', ink, 444]]} />
      <Ring x={444} y={246} rx={13} ry={14} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 4: falling ---------- */

function Falling({ focus }: { focus: string }) {
  if (focus === 'gpe-falling') return <PhysicsDiagram title="A ball falls from a shelf. Gravity pulls it down and it speeds up. Energy is transferred mechanically from its gravitational potential store to its kinetic store.">
    <Floor x1={20} x2={270} y={272} />
    <path d="M40 30V272" stroke={woodLine} strokeWidth="4" opacity=".45" />
    <Shelf x={90} y={76} w={96} />
    <g opacity=".3"><Ball x={120} y={60} r={15} /></g>
    <g opacity=".55"><Ball x={156} y={134} r={15} /></g>
    <Ball x={170} y={226} r={15} />
    <Arrow from={[222, 110]} to={[222, 214]} colour={gcol} width={3} />
    <text x={234} y={166} fontSize="14" fontWeight="700" fill={gcol}>gravity</text>
    <EnergyStoreBadge store="gravitational" x={414} y={70} label="Gravitational potential" />
    <text x={414} y={102} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>lower and lower</text>
    <TransferArrow from={[414, 116]} to={[414, 192]} bend={0} colour={ink} width={3.5} />
    <text x={426} y={160} fontSize="14" fontWeight="700" fill={ink}>mechanically</text>
    <EnergyStoreBadge store="kinetic" x={414} y={214} />
    <text x={414} y={246} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>faster and faster</text>
  </PhysicsDiagram>
  const bars = (value: string, label1: string[], label2: string[]) => <g>
    <rect x={120} y={96} width={120} height={120} rx="12" fill={P.gravitational} stroke={G} strokeWidth="2" />
    <rect x={300} y={96} width={120} height={120} rx="12" fill={P.kinetic} stroke={KL} strokeWidth="2" />
    <text x={180} y={164} textAnchor="middle" fontSize={value ? 24 : 15} fontWeight="800" fill={G}>{value || 'lost'}</text>
    <text x={360} y={164} textAnchor="middle" fontSize={value ? 24 : 15} fontWeight="800" fill={KL}>{value || 'gained'}</text>
    <text x={270} y={168} textAnchor="middle" fontSize="36" fontWeight="800" fill={ink}>=</text>
    {label1.map((l, i) => <text key={l} x={180} y={238 + i * 17} textAnchor="middle" fontSize="13" fontWeight="700" fill={G}>{l}</text>)}
    {label2.map((l, i) => <text key={l} x={360} y={238 + i * 17} textAnchor="middle" fontSize="13" fontWeight="700" fill={KL}>{l}</text>)}
  </g>
  if (focus === 'gpe-equal') return <PhysicsDiagram title="Two equal blocks: the energy lost from the g.p.e. store equals the energy gained in the kinetic store, when there is no air resistance.">
    <EnergyStoreBadge store="gravitational" x={180} y={50} label="g.p.e." />
    <EnergyStoreBadge store="kinetic" x={360} y={50} />
    {bars('', ['energy lost from', 'the g.p.e. store'], ['energy gained in', 'the kinetic store'])}
    <Tag x={270} y={284} text="no air resistance" colour={muted} />
  </PhysicsDiagram>
  // gpe-use
  return <PhysicsDiagram title="A falling ball loses 30 J from its g.p.e. store and gains 30 J in its kinetic store. With no air resistance, the numbers are the same.">
    <Floor x1={20} x2={140} y={272} />
    <g opacity=".35"><Ball x={70} y={60} r={14} /></g>
    <Ball x={70} y={230} r={14} />
    <Arrow from={[70, 86]} to={[70, 202]} colour={gcol} width={3} />
    <g transform="translate(40 0)">{bars('30 J', ['loses 30 J from', 'the g.p.e. store'], ['gains 30 J in', 'the kinetic store'])}</g>
    <EnergyStoreBadge store="gravitational" x={220} y={50} label="g.p.e." />
    <EnergyStoreBadge store="kinetic" x={400} y={50} />
    <Tag x={310} y={284} text="no air resistance" colour={muted} />
  </PhysicsDiagram>
}

/* ---------- Section 5: springs ---------- */

const eRow: Array<[string, string, number]> = [['Ee', E, 166], ['=', ink, 210], ['½', ink, 244], ['×', ink, 276], ['k', kcol, 306], ['×', ink, 336], ['e²', len, 368]]
function Springs({ focus }: { focus: string }) {
  if (focus === 'gpe-elastic') return <PhysicsDiagram title="A spring at its normal length, and the same spring stretched by a hand. The extension is how much longer it is than its normal length. The stretched spring has energy in its elastic potential store.">
    <Wall x={60} y1={30} y2={250} />
    <text x={70} y={48} fontSize="13" fontWeight="700" fill={muted}>normal length</text>
    <Spring a={[60, 90]} b={[250, 90]} coils={10} width={12} colour={metalLine} />
    <circle cx={254} cy={90} r="4" fill={metal} stroke={metalLine} strokeWidth="1.6" />
    <text x={70} y={148} fontSize="13" fontWeight="700" fill={E}>stretched</text>
    <Spring a={[60, 190]} b={[370, 190]} coils={10} width={12} />
    <Hand x={390} y={190} s={1} rotate={180} />
    <Arrow from={[420, 150]} to={[480, 150]} colour={E} width={3} />
    <text x={450} y={138} textAnchor="middle" fontSize="13" fontWeight="700" fill={E}>pull</text>
    <path d="M254 76V214" stroke={muted} strokeWidth="1.5" strokeDasharray="4 4" />
    <HDim x1={254} x2={370} y={226} label="extension" />
    <EnergyStoreBadge store="elastic" x={160} y={274} />
  </PhysicsDiagram>
  if (focus === 'gpe-elastic-eq') return <PhysicsDiagram title="The elastic potential energy equation: Ee equals one half times k times e squared. Ee is in joules, J; the spring constant k is in newtons per metre, N/m; the extension e is in metres, m. Square e first.">
    <rect x={120} y={16} width={300} height={66} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Spaced y={62} items={eRow} />
    <UnitBox x={102} y={180} to={[166, 72]} name="elastic potential energy" unit="joules" symbol="J" colour={E} w={196} />
    <UnitBox x={292} y={180} to={[306, 72]} name="spring constant" unit="newtons per metre" symbol="N/m" colour={kcol} w={164} />
    <UnitBox x={452} y={180} to={[368, 72]} name="extension" unit="metres" symbol="m" colour={len} w={140} />
    <Ring x={370} y={52} rx={22} ry={20} colour={len} />
    <Caption text="Square the extension first." y={270} colour={len} />
  </PhysicsDiagram>
  if (focus === 'gpe-elastic-work') return <PhysicsDiagram title="Worked example: a spring with a spring constant of 200 N/m is stretched by 0.1 m. e squared is 0.1 times 0.1, which is 0.01. Ee equals one half times 200 times 0.01, which is 1 J.">
    <Wall x={40} y1={20} y2={130} />
    <Spring a={[40, 74]} b={[210, 74]} coils={9} width={12} />
    <Hand x={230} y={74} s={0.95} rotate={180} />
    <path d="M160 40V112" stroke={muted} strokeWidth="1.5" strokeDasharray="4 4" />
    <HDim x1={160} x2={210} y={118} label="0.1 m" />
    <Tag x={116} y={32} text="k = 200 N/m" colour={kcol} />
    <rect x={278} y={16} width={250} height={270} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Spaced y={56} size={22} items={eRow.map(([t, c, x]) => [t, c, x + 136] as [string, string, number])} />
    <rect x={296} y={80} width={214} height={36} rx="10" fill="#fbeedc" stroke={len} strokeWidth="1.6" />
    <Eq x={403} y={104} size={17} weight={700} pieces={[['e²', len], [' = 0.1 × 0.1 = '], ['0.01', len]]} />
    <Eq x={403} y={150} size={18} pieces={[['Ee', E], [' = ½ × '], ['200', kcol], [' × '], ['0.01', len]]} />
    <Eq x={403} y={180} size={16} weight={650} pieces={[['½ × '], ['200', kcol], [' = 100']]} />
    <Eq x={403} y={204} size={16} weight={650} pieces={[['100 × '], ['0.01', len], [' = 1']]} />
    <rect x={334} y={220} width={138} height={44} rx="12" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Spaced y={250} size={22} items={[['Ee', E, 366], ['= 1', ink, 410], ['J', ink, 450]]} />
    <Ring x={450} y={242} rx={12} ry={14} />
    <EnergyStoreBadge store="elastic" x={140} y={200} />
  </PhysicsDiagram>
  // gpe-limit
  return <PhysicsDiagram title="A spring stretched a long way, with its coils pulled open. Past the limit of proportionality, the equation for elastic potential energy stops working.">
    <Wall x={50} y1={30} y2={250} />
    <text x={60} y={50} fontSize="13" fontWeight="700" fill={muted}>stretched a little: the equation works</text>
    <Spring a={[50, 90]} b={[240, 90]} coils={10} width={12} />
    <Hand x={260} y={90} s={0.9} rotate={180} />
    <text x={60} y={160} fontSize="13" fontWeight="700" fill={warn}>stretched too far</text>
    <Spring a={[50, 204]} b={[420, 204]} coils={10} width={4} />
    <Hand x={440} y={204} s={0.9} rotate={180} />
    <rect x={250} y={236} width={276} height={50} rx="12" fill={P.wastedFill} stroke={warn} strokeWidth="1.6" />
    <text x={388} y={257} textAnchor="middle" fontSize="13" fontWeight="700" fill={warn}>past the limit of proportionality:</text>
    <text x={388} y={276} textAnchor="middle" fontSize="13" fontWeight="700" fill={warn}>the equation stops working</text>
  </PhysicsDiagram>
}

/* ---------- Question: three identical springs (no numbers, no stores) ---------- */

function QuestionSprings() {
  const top = 40, natural = 120, stretch = [150, 190, 240]
  return <PhysicsDiagram title="Three identical springs stretched by different amounts.">
    <rect x={60} y={top - 14} width={420} height={14} rx="4" fill={metal} stroke={metalLine} strokeWidth="1.8" />
    <rect x={30} y={top} width={26} height={236} rx="4" fill="#fbf6ee" stroke="#9c8a74" strokeWidth="1.6" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M30 ${top + 10 + i * 20}h${i % 2 ? 8 : 14}`} stroke="#9c8a74" strokeWidth="1.4" />)}
    <path d={`M56 ${natural}H480`} stroke={muted} strokeWidth="1.4" strokeDasharray="5 5" />
    {stretch.map((bottom, i) => {
      const x = 150 + i * 130
      return <g key={i}>
        <Spring a={[x, top]} b={[x, bottom]} coils={9} width={12} colour={metalLine} />
        <path d={`M${x} ${bottom}v6`} stroke={metalLine} strokeWidth="2.4" />
        <rect x={x - 16} y={bottom + 6} width={32} height={18} rx="4" fill="#cfd6db" stroke={metalLine} strokeWidth="1.8" />
        <text x={x} y={bottom + 50} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Spring {i + 1}</text>
      </g>
    })}
  </PhysicsDiagram>
}

export function PotentialVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  if (['gpe-raised', 'gpe-three', 'gpe-words', 'gpe-symbols'].includes(focus)) return <Meaning focus={focus} />
  if (focus === 'gpe-work-1') return <Worked step={1} />
  if (focus === 'gpe-work-2') return <Worked step={2} />
  if (focus === 'gpe-work-3') return <Worked step={3} />
  if (['gpe-falling', 'gpe-equal', 'gpe-use'].includes(focus)) return <Falling focus={focus} />
  if (['gpe-elastic', 'gpe-elastic-eq', 'gpe-elastic-work', 'gpe-limit'].includes(focus)) return <Springs focus={focus} />
  if (focus === 'gpe-q-springs') return <QuestionSprings />
  return null
}



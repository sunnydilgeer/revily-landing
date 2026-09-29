import { physicsPalette as P, PhysicsDiagram, EnergyStoreBadge, TransferArrow, energyStores, type EnergyStore } from './PhysicsKit'
import { ink, muted, r1, Caption, Tag, Eq, Arrow, Floor, Ball, Motion, Car, Lorry, Bike, StepStrip, Ring, Leader, type Piece } from './EnergyStoreVisuals'

/*
 * Physics Lesson 3: Kinetic energy. Original, code-native schematics; not to scale. Focus ids start with 'kinetic-'.
 *
 * Kinetic energy is the PhysicsKit kinetic orange everywhere. In the equation, each quantity keeps one colour:
 * kinetic energy Ek orange, mass m blue, speed v green. The same mass colour is used for m in the potential energy
 * and specific heat capacity lessons, so a student sees "blue = mass" in every Energy equation.
 * The worked example reuses one drawing (a ball with its data tags beside a working card) with a step strip on top.
 */

export const qty = { mass: '#2f6f9f', speed: '#1f8a6a', half: ink }
const K = P.kineticLine

/** A horizontal energy bar in a store's colours; `value` is out of `max`. */
export function HBar({ x, y, w = 150, h = 22, value, max = 1, store = 'kinetic', label }: { x: number; y: number; w?: number; h?: number; value: number; max?: number; store?: EnergyStore; label?: string }) {
  const { fill, line } = energyStores[store], fw = r1(Math.max(0, (w - 6) * value / max))
  return <g>
    <rect x={x} y={y - h / 2} width={w} height={h} rx={h / 2} fill="white" stroke={line} strokeWidth="1.6" />
    {fw > 0 && <rect x={x + 3} y={y - h / 2 + 3} width={Math.max(fw, h - 6)} height={h - 6} rx={(h - 6) / 2} fill={fill} stroke={line} strokeWidth="1" />}
    {label && <text x={x} y={y - h / 2 - 7} fontSize="12" fontWeight="700" fill={line}>{label}</text>}
  </g>
}
/** A speed arrow under or over a vehicle, with its label. */
function Speed({ x, y, len, label, colour = qty.speed }: { x: number; y: number; len: number; label: string; colour?: string }) {
  return <g><Arrow from={[x, y]} to={[x + len, y]} colour={colour} width={3.2} /><text x={x + len / 2} y={y - 9} textAnchor="middle" fontSize="13" fontWeight="700" fill={colour}>{label}</text></g>
}

/* ---------- Section 2: what is kinetic energy? ---------- */

function Meaning({ focus }: { focus: string }) {
  if (focus === 'kinetic-moving') return <PhysicsDiagram title="A rolling ball has energy in its kinetic store. A parked car is not moving, so it has no energy in its kinetic store.">
    <Floor x1={20} x2={250} y={200} />
    <Ball x={150} y={178} r={22} />
    <Motion x={118} y={178} len={34} />
    <Arrow from={[120, 130]} to={[200, 130]} colour={qty.speed} width={3} />
    <text x={160} y={118} textAnchor="middle" fontSize="13" fontWeight="700" fill={qty.speed}>moving</text>
    <EnergyStoreBadge store="kinetic" x={135} y={240} />
    <Floor x1={290} x2={520} y={200} />
    <Car x={405} y={200} s={1.25} fill="#dfe5ea" line="#5a6b79" />
    <Tag x={405} y={112} text="parked: not moving" colour={muted} />
    <text x={405} y={244} textAnchor="middle" fontSize="14" fontWeight="700" fill={muted}>no kinetic energy</text>
  </PhysicsDiagram>
  if (focus === 'kinetic-mass') return <PhysicsDiagram title="A bike and a lorry travel at the same speed. The lorry has much more mass, so it has much more energy in its kinetic store.">
    <Floor x1={10} x2={300} y={122} />
    <Bike x={130} y={120} s={0.8} />
    <Speed x={88} y={22} len={80} label="same speed" />
    <Floor x1={10} x2={300} y={270} />
    <Lorry x={140} y={268} s={1.1} />
    <Speed x={100} y={168} len={80} label="same speed" />
    <HBar x={330} y={84} w={190} value={0.12} label="kinetic energy: bike" />
    <HBar x={330} y={230} w={190} value={1} label="kinetic energy: lorry" />
    <text x={425} y={268} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>more mass, more energy</text>
  </PhysicsDiagram>
  if (focus === 'kinetic-speed') return <PhysicsDiagram title="Two identical cars. The faster car has more energy in its kinetic store than the slower car.">
    <Floor x1={10} x2={300} y={120} />
    <Car x={150} y={120} s={1.1} />
    <Speed x={96} y={34} len={40} label="slower" />
    <Floor x1={10} x2={300} y={262} />
    <Car x={150} y={262} s={1.1} />
    <Motion x={82} y={234} len={30} colour={K} />
    <Speed x={96} y={176} len={130} label="faster" />
    <HBar x={330} y={84} w={190} value={0.2} label="kinetic energy: slower car" />
    <HBar x={330} y={226} w={190} value={1} label="kinetic energy: faster car" />
    <text x={425} y={264} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>more speed, more energy</text>
  </PhysicsDiagram>
  // kinetic-change
  return <PhysicsDiagram title="Two panels. Speeding up: energy is transferred to the kinetic store and its bar grows. Slowing down: energy is transferred away from the kinetic store and its bar shrinks.">
    {[0, 1].map(i => {
      const x0 = i ? 274 : 6, up = i === 0
      return <g key={i}>
        <rect x={x0} y={8} width={260} height={284} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
        <text x={x0 + 130} y={36} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{up ? 'Speeding up' : 'Slowing down'}</text>
        <Floor x1={x0 + 16} x2={x0 + 244} y={140} />
        <Car x={x0 + 130} y={140} s={1} />
        <g opacity=".35"><Arrow from={[x0 + 70, 64]} to={[x0 + (up ? 110 : 190), 64]} colour={qty.speed} width={3} /></g>
        <Arrow from={[x0 + 70, 64]} to={[x0 + (up ? 190 : 110), 64]} colour={qty.speed} width={3} />
        <EnergyStoreBadge store="kinetic" x={x0 + 130} y={176} />
        <HBar x={x0 + 55} y={216} w={150} value={up ? 0.8 : 0.25} />
        {up ? <TransferArrow from={[x0 + 40, 260]} to={[x0 + 70, 196]} bend={0.3} colour={K} width={3} />
          : <TransferArrow from={[x0 + 190, 196]} to={[x0 + 226, 262]} bend={-0.3} colour={K} width={3} />}
        <text x={x0 + 130} y={272} textAnchor="middle" fontSize="13" fontWeight="700" fill={K}>{up ? 'energy transferred in' : 'energy transferred away'}</text>
      </g>
    })}
  </PhysicsDiagram>
}

/* ---------- Section 3: the equation ---------- */

const words: Piece[] = [['kinetic energy', K], [' = ½ × '], ['mass', qty.mass], [' × '], ['speed²', qty.speed]]
const symbols: Piece[] = [['Ek', K], [' = ½ × '], ['m', qty.mass], [' × '], ['v²', qty.speed]]
/** An equation laid out piece by piece at fixed centres, so symbols can be pointed at exactly. */
export function Spaced({ y, size = 28, items }: { y: number; size?: number; items: Array<[string, string, number]> }) {
  return <g fontSize={size} fontWeight="800" textAnchor="middle">{items.map(([t, c, x], i) => <text key={i} x={x} y={y} fill={c}>{t}</text>)}</g>
}
const symbolRow = (y: number, size = 28): Array<[string, string, number]> => [['Ek', K, 168], ['=', ink, 212], ['½', ink, 246], ['×', ink, 278], ['m', qty.mass, 310], ['×', ink, 342], ['v²', qty.speed, 376]]
/** A name-and-unit box under an equation symbol, joined to it by a leader. */
export function UnitBox({ x, y, name, unit, symbol, colour, w = 160, to }: { x: number; y: number; name: string; unit: string; symbol: string; colour: string; w?: number; to: [number, number] }) {
  return <g>
    <Leader from={[x, y - 34]} to={to} colour={colour} />
    <rect x={x - w / 2} y={y - 34} width={w} height={76} rx="12" fill="white" stroke={colour} strokeWidth="1.8" />
    <text x={x} y={y - 12} textAnchor="middle" fontSize="14" fontWeight="700" fill={colour}>{name}</text>
    <text x={x} y={y + 8} textAnchor="middle" fontSize="13" fontWeight="600" fill={ink}>{unit}</text>
    <text x={x} y={y + 30} textAnchor="middle" fontSize="15" fontWeight="800" fill={colour}>{symbol}</text>
  </g>
}
function Equation({ focus }: { focus: string }) {
  if (focus === 'kinetic-words') return <PhysicsDiagram title="The kinetic energy equation in words: kinetic energy equals one half times mass times speed squared. Speed squared means speed times speed.">
    <rect x={20} y={70} width={500} height={86} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Eq x={270} y={122} size={22} pieces={words} />
    <rect x={120} y={190} width={300} height={50} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Eq x={270} y={221} size={16} pieces={[['speed²', qty.speed], [' = '], ['speed', qty.speed], [' × '], ['speed', qty.speed]]} />
    <EnergyStoreBadge store="kinetic" x={270} y={36} label="Kinetic energy" />
  </PhysicsDiagram>
  if (focus === 'kinetic-symbols') return <PhysicsDiagram title="The kinetic energy equation in symbols: Ek equals one half times m times v squared. Ek is kinetic energy in joules, J. m is mass in kilograms, kg. v is speed in metres per second, m/s.">
    <rect x={120} y={22} width={300} height={70} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Spaced y={68} items={symbolRow(68)} />
    <UnitBox x={95} y={206} to={[168, 80]} name="kinetic energy" unit="joules" symbol="J" colour={K} />
    <UnitBox x={270} y={206} to={[310, 80]} name="mass" unit="kilograms" symbol="kg" colour={qty.mass} />
    <UnitBox x={445} y={206} to={[376, 80]} name="speed" unit="metres per second" symbol="m/s" colour={qty.speed} />
  </PhysicsDiagram>
  // kinetic-square
  return <PhysicsDiagram title="Only the speed is squared, not the mass. Work in order: first square v, then multiply by m, then multiply by one half. For a speed of 3 m/s, v squared is 3 times 3, which is 9.">
    <rect x={120} y={18} width={300} height={62} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Spaced y={60} items={symbolRow(60)} />
    <Ring x={378} y={50} rx={21} ry={20} colour={qty.speed} />
    <text x={378} y={104} textAnchor="middle" fontSize="13" fontWeight="700" fill={qty.speed}>only v is squared</text>
    {[['1', 'square v', qty.speed], ['2', '× m', qty.mass], ['3', '× ½', ink]].map(([n, t, c], i) => <g key={n}>
      <circle cx={70} cy={148 + i * 40} r="13" fill={i === 0 ? c : 'white'} stroke={c} strokeWidth="2" />
      <text x={70} y={153 + i * 40} textAnchor="middle" fontSize="14" fontWeight="700" fill={i === 0 ? 'white' : c}>{n}</text>
      <text x={94} y={154 + i * 40} fontSize="16" fontWeight="700" fill={c}>{t}</text>
    </g>)}
    <rect x={250} y={140} width={260} height={96} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <text x={380} y={166} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>speed = 3 m/s</text>
    <Eq x={380} y={200} size={20} pieces={[['v²', qty.speed], [' = 3 × 3 = '], ['9', qty.speed]]} />
    <text x={380} y={224} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>not 3 × 2</text>
    <Caption text="The mass is not squared." y={278} colour={qty.mass} />
  </PhysicsDiagram>
}

/* ---------- Section 4: worked example (one drawing, three steps) ---------- */

function Worked({ step }: { step: 1 | 2 | 3 }) {
  const titles = [
    'Step 1 of 3: a ball of mass 0.5 kg moves at 4 m/s. Write the equation: Ek equals one half times m times v squared.',
    'Step 2 of 3: put the numbers in. Ek equals one half times 0.5 times 4 squared. Square the speed first: 4 squared is 4 times 4, which is 16.',
    'Step 3 of 3: one half of 0.5 is 0.25, and 0.25 times 16 is 4. The kinetic energy is 4 J.',
  ]
  return <PhysicsDiagram title={titles[step - 1]}>
    <StepStrip steps={['write it', 'square', 'answer']} active={step} colour={K} gap={160} />
    <Floor x1={20} x2={220} y={210} />
    <Ball x={100} y={188} r={22} />
    <Motion x={70} y={188} len={30} />
    <Speed x={70} y={150} len={90} label="4 m/s" />
    <Tag x={100} y={244} text="mass 0.5 kg" colour={qty.mass} />
    <rect x={236} y={56} width={292} height={220} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <g opacity={step === 1 ? 1 : 0.55}><Eq x={382} y={96} size={22} pieces={symbols} /></g>
    {step === 2 && <g>
      <Eq x={382} y={134} size={20} pieces={[['Ek', K], [' = ½ × '], ['0.5', qty.mass], [' × '], ['4²', qty.speed]]} />
      <rect x={270} y={146} width={224} height={34} rx="10" fill="#e3f3ec" stroke={qty.speed} strokeWidth="1.6" />
      <Eq x={382} y={169} size={18} pieces={[['4²', qty.speed], [' = 4 × 4 = '], ['16', qty.speed]]} />
      <Eq x={382} y={210} size={20} pieces={[['Ek', K], [' = ½ × '], ['0.5', qty.mass], [' × '], ['16', qty.speed]]} />
    </g>}
    {step === 1 && <g>
      <text x={382} y={140} textAnchor="middle" fontSize="14" fontWeight="600" fill={ink}>m = 0.5 kg</text>
      <text x={382} y={164} textAnchor="middle" fontSize="14" fontWeight="600" fill={ink}>v = 4 m/s</text>
      <text x={382} y={196} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>already in kg and m/s:</text>
      <text x={382} y={214} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>no converting needed</text>
    </g>}
    {step === 3 && <g>
      <g opacity=".55"><Eq x={382} y={132} size={19} pieces={[['Ek', K], [' = ½ × '], ['0.5', qty.mass], [' × '], ['16', qty.speed]]} /></g>
      <Eq x={382} y={166} size={17} weight={650} pieces={[['½ × '], ['0.5', qty.mass], [' = 0.25']]} />
      <Eq x={382} y={194} size={17} weight={650} pieces={[['0.25 × '], ['16', qty.speed], [' = 4']]} />
      <rect x={312} y={212} width={140} height={42} rx="12" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
      <Spaced y={241} size={22} items={[['Ek', K, 348], ['= 4', ink, 392], ['J', ink, 428]]} />
      <Ring x={428} y={233} rx={13} ry={14} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Question: two cars of the same mass (no bars, no stores) ---------- */

function QuestionCars() {
  return <PhysicsDiagram title="Two cars of the same mass with different speeds.">
    {[{ y: 130, n: 'Car 1', v: '8 m/s', len: 50 }, { y: 270, n: 'Car 2', v: '20 m/s', len: 130 }].map(c => <g key={c.n}>
      <Floor x1={20} x2={520} y={c.y} />
      <Car x={130} y={c.y} s={1.15} />
      <text x={40} y={c.y - 74} fontSize="15" fontWeight="800" fill={ink}>{c.n}</text>
      <Speed x={220} y={c.y - 36} len={c.len} label={c.v} colour={ink} />
      <text x={440} y={c.y - 30} textAnchor="middle" fontSize="14" fontWeight="700" fill={qty.mass}>mass: 800 kg</text>
    </g>)}
  </PhysicsDiagram>
}

export function KineticVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  if (['kinetic-moving', 'kinetic-mass', 'kinetic-speed', 'kinetic-change'].includes(focus)) return <Meaning focus={focus} />
  if (['kinetic-words', 'kinetic-symbols', 'kinetic-square'].includes(focus)) return <Equation focus={focus} />
  if (focus === 'kinetic-work-1') return <Worked step={1} />
  if (focus === 'kinetic-work-2') return <Worked step={2} />
  if (focus === 'kinetic-work-3') return <Worked step={3} />
  if (focus === 'kinetic-q-cars') return <QuestionCars />
  return null
}

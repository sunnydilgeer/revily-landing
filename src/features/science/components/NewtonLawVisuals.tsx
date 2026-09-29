import { physicsPalette as P, PhysicsDiagram } from './PhysicsKit'
import { ink, muted, metal, metalLine, Caption, Tag, Arrow, Floor, Car, StepStrip, Tick, Eq } from './EnergyStoreVisuals'
import { mo, Force, Note } from './VtGraphVisuals'

/*
 * Physics Lesson 47: Newton's First and Second Laws. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'newton12-' and is routed from CellBiologyVisuals.tsx.
 *
 * Colours from the motion kit (VtGraphVisuals): driving force green, resistive forces coral red, resultant force
 * violet, acceleration amber, mass blue, velocity green (dotted when it only shows "keeps going").
 * Arrow length shows the size of a force within one picture; equal forces are drawn the same length.
 * The bus and trolley are exported for the Newton's Third Law and motion practical lessons.
 */

/** A single-deck bus facing right; (x, y) is the road under its middle. */
export function Bus({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const fill = '#cfe3ea', line = '#4d7f91'
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-96 -16V-80Q-96 -88 -88 -88H80Q92 -88 95 -76L98 -30Q98 -16 88 -16Z" fill={fill} stroke={line} strokeWidth="2.4" />
    {[-84, -56, -28, 0, 28].map(wx => <rect key={wx} x={wx} y={-78} width={22} height={24} rx="4" fill="#eef7fb" stroke={line} strokeWidth="1.6" />)}
    <path d="M60 -78H84Q90 -78 91 -72L93 -52H60Z" fill="#eef7fb" stroke={line} strokeWidth="1.6" />
    <rect x={62} y={-48} width={16} height={32} rx="2" fill="#eef7fb" stroke={line} strokeWidth="1.4" />
    <path d="M-96 -40H56M80 -40H97" stroke={line} strokeWidth="1.4" opacity=".6" />
    <circle cx={94} cy={-26} r="3.2" fill="#fde8a8" stroke={line} strokeWidth="1.2" />
    {[-62, 56].map(wx => <g key={wx}><circle cx={wx} cy={-14} r={13} fill="#4f5d69" stroke="#33404b" strokeWidth="1.6" /><circle cx={wx} cy={-14} r="5" fill={metal} /></g>)}
  </g>
}

/** A lab trolley facing right; (x, y) is the bench under its middle. `load` stacks that many blue masses on it. */
export function Trolley({ x, y, s = 1, load = 0, dim = false }: { x: number; y: number; s?: number; load?: number; dim?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? 0.35 : 1}>
    {Array.from({ length: load }, (_, i) => <rect key={i} x={-26 + (i % 2) * 28} y={-40 - 16 * (Math.floor(i / 2) + 1)} width={24} height={15} rx="3" fill={mo.massFill} stroke={mo.mass} strokeWidth="1.8" />)}
    <rect x={-44} y={-40} width={88} height={24} rx="6" fill={metal} stroke={metalLine} strokeWidth="2.2" />
    <path d="M-36 -28H36" stroke={metalLine} strokeWidth="1.4" opacity=".5" />
    {[-27, 27].map(wx => <g key={wx}><circle cx={wx} cy={-9} r={9} fill="#4f5d69" stroke="#33404b" strokeWidth="1.5" /><circle cx={wx} cy={-9} r="3.4" fill={metal} /></g>)}
  </g>
}

/** An acceleration arrow (amber, thinner than a force, with an open look) and its label above. */
export function Accel({ x, y, len, label, dir = 1 }: { x: number; y: number; len: number; label?: string; dir?: number }) {
  return <g>
    <Arrow from={[x, y]} to={[x + dir * len, y]} colour={mo.accel} width={3} />
    {label && <text x={x + dir * len / 2} y={y - 10} textAnchor="middle" fontSize="13" fontWeight="700" fill={mo.accel}>{label}</text>}
  </g>
}

/* ---------- Section 2: Newton's First Law ---------- */

function First({ focus }: { focus: string }) {
  const road = <Floor x1={20} x2={520} y={200} />
  if (focus === 'newton12-first-still') return <PhysicsDiagram title="A parked bus. The resultant force on it is zero, so it stays stationary.">
    {road}
    <Bus x={200} y={200} />
    <Note x={430} y={70} w={180} lines={['resultant force', '= 0']} colour={mo.resultant} fill={mo.resultantFill} line={mo.resultant} />
    <Tick x={372} y={172} />
    <text x={392} y={177} fontSize="15" fontWeight="700" fill={ink}>stays stationary</text>
    <Caption text="Not moving, and no resultant force: it stays still." y={256} />
  </PhysicsDiagram>
  if (focus === 'newton12-first-moving') return <PhysicsDiagram title="A bus moving to the right with a dotted arrow ahead: same velocity. The resultant force is zero, so it keeps moving at the same velocity.">
    {road}
    <Bus x={150} y={200} />
    <g strokeDasharray="2 7"><path d="M266 150H440" stroke={mo.velocity} strokeWidth="4" /></g>
    <Arrow from={[436, 150]} to={[462, 150]} colour={mo.velocity} width={4} />
    <text x={364} y={136} textAnchor="middle" fontSize="14" fontWeight="700" fill={mo.velocity}>same velocity</text>
    <Note x={390} y={30} w={290} size={14} lines={['resultant force = 0:', 'keeps moving at the same velocity']} colour={mo.resultant} fill={mo.resultantFill} line={mo.resultant} />
    <Caption text="Same speed, same direction." y={256} />
  </PhysicsDiagram>
  if (focus === 'newton12-bus-balanced') return <PhysicsDiagram title="A bus at a steady speed. A green driving force arrow to the right and a red resistive forces arrow to the left are the same length: the forces are balanced.">
    {road}
    <Bus x={270} y={200} />
    <Force from={[370, 150]} to={[480, 150]} colour={mo.driving} lines={['driving', 'force']} at="above" />
    <Force from={[170, 150]} to={[60, 150]} colour={mo.drag} lines={['resistive', 'forces']} at="above" />
    <Tag x={270} y={246} text="balanced: same size, opposite directions" colour={ink} />
  </PhysicsDiagram>
  if (focus === 'newton12-bus-resultant') return <PhysicsDiagram title="The bus with a long driving force arrow and a short resistive forces arrow. The resultant force arrow points to the right, so the bus speeds up in the direction of the resultant force.">
    {road}
    <Bus x={250} y={200} />
    <Force from={[350, 150]} to={[510, 150]} colour={mo.driving} lines={['driving', 'force']} at="above" />
    <Force from={[154, 150]} to={[100, 150]} colour={mo.drag} lines={['resistive', 'forces']} at="end" />
    <Force from={[197, 60]} to={[303, 60]} colour={mo.resultant} label="resultant force" at="above" width={6} />
    <Caption text="Speeds up in the direction of the resultant force." y={250} />
  </PhysicsDiagram>
  // newton12-five
  const panels: Array<{ t: string; note: string; dir: 1 | -1; turn?: boolean }> = [
    { t: 'starting', note: 'still → moving', dir: 1 },
    { t: 'stopping', note: 'moving → still', dir: -1 },
    { t: 'speeding up', note: 'faster', dir: 1 },
    { t: 'slowing down', note: 'slower', dir: -1 },
    { t: 'changing direction', note: 'turns', dir: 1, turn: true },
  ]
  return <PhysicsDiagram title="Five small panels: starting, stopping, speeding up, slowing down and changing direction. Each has a small car and a resultant force arrow.">
    {panels.map((p, i) => {
      const top = i < 3, w = top ? 170 : 256, x0 = top ? 6 + i * 177 : 6 + (i - 3) * 266, y0 = top ? 6 : 152
      const cx = x0 + w / 2
      return <g key={p.t}>
        <rect x={x0} y={y0} width={w} height={140} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
        <text x={cx} y={y0 + 24} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{p.t}</text>
        {p.turn ? <g>
          <path d={`M${cx - 70} ${y0 + 112}Q${cx + 40} ${y0 + 112} ${cx + 50} ${y0 + 50}`} stroke={muted} strokeWidth="2" strokeDasharray="5 5" fill="none" />
          <g transform={`translate(${cx + 2} ${y0 + 101}) rotate(-24)`}><Car x={0} y={10} s={0.46} /></g>
          <Force from={[cx + 2, y0 + 90]} to={[cx - 14, y0 + 56]} colour={mo.resultant} width={4} />
          <text x={cx + 64} y={y0 + 128} textAnchor="end" fontSize="13" fontWeight="600" fill={muted}>{p.note}</text>
        </g> : <g>
          <Floor x1={x0 + 14} x2={x0 + w - 14} y={y0 + 108} />
          <Car x={cx} y={y0 + 108} s={0.5} />
          <Force from={p.dir > 0 ? [cx + 26, y0 + 94] : [cx - 26, y0 + 94]} to={p.dir > 0 ? [cx + 66, y0 + 94] : [cx - 66, y0 + 94]} colour={mo.resultant} width={4} />
          <text x={cx} y={y0 + 131} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>{p.note}</text>
        </g>}
      </g>
    })}
  </PhysicsDiagram>
}

/* ---------- Section 3: Newton's Second Law ---------- */

function Second({ focus }: { focus: string }) {
  if (focus === 'newton12-force-acc') return <PhysicsDiagram title="Two identical trolleys. The top one has a small push and a short acceleration arrow. The bottom one has a big push and a long acceleration arrow.">
    {[{ y: 128, f: 40, a: 40, fl: 'small force', al: 'small acceleration' }, { y: 270, f: 100, a: 110, fl: 'big force', al: 'big acceleration' }].map(r => <g key={r.y}>
      <Floor x1={20} x2={520} y={r.y} />
      <Trolley x={220} y={r.y} />
      <Force from={[174 - r.f, r.y - 28]} to={[174, r.y - 28]} colour={mo.resultant} label={r.fl} at="start" />
      <Accel x={272} y={r.y - 28} len={r.a} />
      <text x={280 + r.a} y={r.y - 23} fontSize="13" fontWeight="700" fill={mo.accel}>{r.al}</text>
    </g>)}
  </PhysicsDiagram>
  if (focus === 'newton12-proportional') return <PhysicsDiagram title="Force 10 N gives an acceleration of 2 metres per second squared. Force 20 N gives 4 metres per second squared. Both double: acceleration is directly proportional to force.">
    <rect x={250} y={30} width={270} height={178} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <text x={330} y={62} textAnchor="middle" fontSize="14" fontWeight="700" fill={mo.resultant}>force</text>
    <text x={450} y={62} textAnchor="middle" fontSize="14" fontWeight="700" fill={mo.accel}>acceleration</text>
    <text x={330} y={104} textAnchor="middle" fontSize="20" fontWeight="800" fill={mo.resultant}>10 N</text>
    <text x={450} y={104} textAnchor="middle" fontSize="20" fontWeight="800" fill={mo.accel}>2 m/s²</text>
    <text x={330} y={184} textAnchor="middle" fontSize="20" fontWeight="800" fill={mo.resultant}>20 N</text>
    <text x={450} y={184} textAnchor="middle" fontSize="20" fontWeight="800" fill={mo.accel}>4 m/s²</text>
    {[[304, mo.resultant], [424, mo.accel]].map(([x, c]) => <g key={x as number}>
      <path d={`M${x} 112Q${(x as number) - 26} 138 ${x} 164`} stroke={c as string} strokeWidth="2.2" fill="none" />
      <path d={`M${(x as number) - 6} 158L${x} 166L${(x as number) + 4} 157`} stroke={c as string} strokeWidth="2.2" fill="none" />
      <text x={(x as number) + 8} y={144} fontSize="14" fontWeight="800" fill={c as string}>× 2</text>
    </g>)}
    {[{ y: 110, f: 30, a: 36, fl: '10 N', al: '2 m/s²' }, { y: 250, f: 60, a: 72, fl: '20 N', al: '4 m/s²' }].map(r => <g key={r.y}>
      <Floor x1={6} x2={240} y={r.y} />
      <Trolley x={110} y={r.y} s={0.8} />
      <Force from={[74 - r.f, r.y - 22]} to={[74, r.y - 22]} colour={mo.resultant} label={r.fl} at="above" />
      <Accel x={154} y={r.y - 22} len={r.a} label={r.al} />
    </g>)}
    <Caption text="Double the force, double the acceleration: directly proportional." x={270} y={286} />
  </PhysicsDiagram>
  if (focus === 'newton12-mass-acc') return <PhysicsDiagram title="An empty trolley and a loaded trolley with the same push. The empty trolley has a long acceleration arrow; the loaded one has a short one.">
    {[{ y: 128, load: 0, a: 140, l: 'empty: big acceleration' }, { y: 270, load: 4, a: 50, l: 'loaded: small acceleration' }].map(r => <g key={r.y}>
      <Floor x1={20} x2={520} y={r.y} />
      <Trolley x={220} y={r.y} load={r.load} />
      <Force from={[100, r.y - 28]} to={[174, r.y - 28]} colour={mo.resultant} label="same force" at="above" />
      <Accel x={276} y={r.y - 28} len={r.a} />
      <text x={276} y={r.y - 50} fontSize="13" fontWeight="700" fill={mo.accel}>{r.l}</text>
    </g>)}
  </PhysicsDiagram>
  // newton12-equation
  return <PhysicsDiagram title="The equation: resultant force equals mass times acceleration, F equals m a. Resultant force is in newtons, N. Mass is in kilograms, kg. Acceleration is in metres per second squared.">
    <rect x={40} y={20} width={460} height={110} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Eq x={270} y={58} size={18} pieces={[['resultant force', mo.resultant], [' = '], ['mass', mo.mass], [' × '], ['acceleration', mo.accel]]} />
    <g fontSize="36" fontWeight="800" textAnchor="middle">
      <text x={216} y={112} fill={mo.resultant}>F</text>
      <text x={256} y={112} fill={ink}>=</text>
      <text x={298} y={112} fill={mo.mass}>m</text>
      <text x={334} y={112} fill={mo.accel}>a</text>
    </g>
    {[{ x: 110, to: 216, c: mo.resultant, n: 'resultant force', u: 'newtons (N)' }, { x: 270, to: 298, c: mo.mass, n: 'mass', u: 'kilograms (kg)' }, { x: 430, to: 334, c: mo.accel, n: 'acceleration', u: 'metres per second', u2: 'squared (m/s²)' }].map(b => <g key={b.n}>
      <path d={`M${b.to} 124L${b.x} 176`} stroke={b.c} strokeWidth="1.6" />
      <circle cx={b.to} cy={124} r="2.8" fill={b.c} />
      <rect x={b.x - 74} y={176} width={148} height={80} rx="12" fill="white" stroke={b.c} strokeWidth="1.8" />
      <text x={b.x} y={202} textAnchor="middle" fontSize="14" fontWeight="700" fill={b.c}>{b.n}</text>
      <text x={b.x} y={224} textAnchor="middle" fontSize="13" fontWeight="600" fill={ink}>{b.u}</text>
      {b.u2 && <text x={b.x} y={243} textAnchor="middle" fontSize="13" fontWeight="600" fill={ink}>{b.u2}</text>}
    </g>)}
  </PhysicsDiagram>
}

/* ---------- Section 4: estimating the force on a car (one drawing, four steps) ---------- */

function Worked({ step }: { step: 1 | 2 | 3 | 4 }) {
  const titles = [
    'Step 1 of 4: a typical car reaches about 20 m/s after 10 s. Acceleration equals 20 divided by 10, which is 2 metres per second squared.',
    'Step 2 of 4: a typical car has a mass of about 1000 kg. The wavy equals sign means about.',
    'Step 3 of 4: write F equals m a, then put the numbers in: F equals 1000 times 2.',
    'Step 4 of 4: F equals 2000 N. A force arrow on the car shows the resultant force of about 2000 N.',
  ]
  const faint = (n: number) => step === n ? 1 : 0.5
  return <PhysicsDiagram title={titles[step - 1]}>
    <StepStrip steps={['a', 'm', 'F = ma', 'answer']} active={step} colour={mo.resultant} gap={124} x0={272} />
    <Floor x1={14} x2={236} y={204} />
    <Car x={122} y={204} s={1.2} />
    <Tag x={122} y={82} text="20 m/s after 10 s" colour={mo.velocity} />
    {step >= 2 && <g opacity={faint(2)}><Tag x={122} y={236} text="mass ≈ 1000 kg" colour={mo.mass} /></g>}
    {step === 4 && <Force from={[184, 176]} to={[240, 176]} colour={mo.resultant} label="2000 N" at="above" width={6} />}
    <rect x={250} y={50} width={280} height={230} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <g opacity={faint(1)}>
      <text x={390} y={82} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>a = change in velocity ÷ time</text>
      <Eq x={390} y={110} size={19} pieces={[['a', mo.accel], [' = 20 ÷ 10 = '], ['2 m/s²', mo.accel]]} />
    </g>
    {step >= 2 && <g opacity={faint(2)}>
      <Eq x={390} y={146} size={19} pieces={[['m', mo.mass], [' ≈ '], ['1000 kg', mo.mass]]} />
      {step === 2 && <text x={390} y={170} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>≈ means "about"</text>}
    </g>}
    {step >= 3 && <g opacity={faint(3)}>
      <Eq x={390} y={184} size={19} pieces={[['F', mo.resultant], [' = '], ['m', mo.mass], [' × '], ['a', mo.accel]]} />
      <Eq x={390} y={212} size={19} pieces={[['F', mo.resultant], [' = '], ['1000', mo.mass], [' × '], ['2', mo.accel]]} />
    </g>}
    {step === 4 && <g>
      <rect x={300} y={228} width={170} height={42} rx="12" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
      <Eq x={385} y={256} size={20} pieces={[['F', mo.resultant], [' = 2000 N']]} />
      <Tick x={496} y={249} s={0.85} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Question: same force, two trolleys (no masses shown) ---------- */

function QuestionTrolleys() {
  return <PhysicsDiagram title="Two identical-looking trolleys, X and Y, pushed by the same force. X has an acceleration of 4 metres per second squared and Y has 2 metres per second squared." schematic={false}>
    {[{ y: 130, n: 'X', a: 150, l: '4 m/s²' }, { y: 272, n: 'Y', a: 75, l: '2 m/s²' }].map(r => <g key={r.n}>
      <Floor x1={20} x2={520} y={r.y} />
      <Trolley x={210} y={r.y} />
      <text x={210} y={r.y - 52} textAnchor="middle" fontSize="18" fontWeight="800" fill={ink}>{r.n}</text>
      <Force from={[90, r.y - 28]} to={[164, r.y - 28]} colour={mo.resultant} label="same force" at="above" />
      <Accel x={270} y={r.y - 28} len={r.a} />
      <text x={270 + r.a + 10} y={r.y - 23} fontSize="15" fontWeight="800" fill={mo.accel}>{r.l}</text>
    </g>)}
  </PhysicsDiagram>
}

export function NewtonLawVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  if (['newton12-first-still', 'newton12-first-moving', 'newton12-bus-balanced', 'newton12-bus-resultant', 'newton12-five'].includes(focus)) return <First focus={focus} />
  if (['newton12-force-acc', 'newton12-proportional', 'newton12-mass-acc', 'newton12-equation'].includes(focus)) return <Second focus={focus} />
  const w = /^newton12-w([1-4])$/.exec(focus)
  if (w) return <Worked step={Number(w[1]) as 1 | 2 | 3 | 4} />
  if (focus === 'newton12-q-trolleys') return <QuestionTrolleys />
  return null
}

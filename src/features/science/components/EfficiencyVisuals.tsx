import { physicsPalette as P, PhysicsDiagram, Lines, type Pt } from './PhysicsKit'
import { qty, faded, r1, Card, Chip, Arrow, Steps, Fraction, Caption, Cross, Motor, Bulb } from './PowerVisuals'

/*
 * Physics Lesson 9: Efficiency. Original schematics; not to scale. Focus ids start with 'effic-'.
 *
 * Colours (as in every Physics lesson): useful energy green, wasted energy coral, the total input a neutral slate.
 * Energy is drawn as broad soft bands whose widths follow the numbers, so the useful and wasted parts visibly add up
 * to the input. One device box is reused through "What is efficiency?", one fraction card through "How do you
 * calculate it?", and the device box again, in watts, through "What about power?".
 */

const { ink, muted } = P
type Tone = 'useful' | 'wasted' | 'total'

/** A soft band arrow of width w from `from` to `to` (straight). */
function Band({ from, to, w, tone, label, labelAt, anchor = 'middle', dim = false }: { from: Pt; to: Pt; w: number; tone: Tone; label?: string[]; labelAt?: Pt; anchor?: 'start' | 'middle' | 'end'; dim?: boolean }) {
  const c = qty[tone], dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = -uy, ny = ux
  const head = Math.min(26, 12 + w * 0.3), hw = w / 2 + Math.max(7, w * 0.22)
  const b: Pt = [to[0] - ux * head, to[1] - uy * head]
  const pts: Pt[] = [
    [from[0] + nx * w / 2, from[1] + ny * w / 2], [b[0] + nx * w / 2, b[1] + ny * w / 2], [b[0] + nx * hw, b[1] + ny * hw], to,
    [b[0] - nx * hw, b[1] - ny * hw], [b[0] - nx * w / 2, b[1] - ny * w / 2], [from[0] - nx * w / 2, from[1] - ny * w / 2],
  ]
  return <g opacity={dim ? faded : 1}>
    <path d={`M${pts.map(p => `${r1(p[0])} ${r1(p[1])}`).join('L')}Z`} fill={c.fill} stroke={c.line} strokeWidth="2" />
    {label && labelAt && <Lines x={labelAt[0]} y={labelAt[1]} anchor={anchor} lines={label} size={14} weight={750} colour={c.line} />}
  </g>
}

/** A device box with an energy band in (left), useful out (right) and wasted out (down). Widths follow the values. */
function Device({ cx, cy, input, useful, unit = 'J', scale = 0.56, name = 'device', text, lamp = false, dim, len = 118 }: {
  cx: number; cy: number; input: number; useful: number; unit?: string; scale?: number; name?: string; lamp?: boolean; dim?: Tone[]; len?: number
  /** Labels for the three bands; `false` draws none, leaving the caller to place its own. */
  text?: false | { in?: string[]; out?: string[]; waste?: string[] }
}) {
  const wasted = input - useful, k = scale
  const wi = Math.max(8, input * k), wu = Math.max(6, useful * k), ww = Math.max(6, wasted * k)
  const bw = 90, bh = Math.max(76, wi + 16), left = cx - bw / 2, right = cx + bw / 2
  const d = (t: Tone) => dim?.includes(t) ?? false
  const t = text === false ? undefined : { in: [`${input} ${unit} in`, 'total input'], out: [`${useful} ${unit}`, 'useful output'], waste: [`${wasted} ${unit}`, 'wasted'], ...text }
  const outY = cy - bh / 2 + 10 + wu / 2
  return <g>
    <Band from={[left - len, cy]} to={[left + 4, cy]} w={wi} tone="total" dim={d('total')}
      label={t?.in} labelAt={[left - len / 2, cy - wi / 2 - Math.max(7, wi * 0.22) - 10 - ((t?.in?.length ?? 1) - 1) * 17]} />
    <Band from={[right - 4, outY]} to={[right + len, outY]} w={wu} tone="useful" dim={d('useful')}
      label={t?.out} labelAt={[right + len + 10, outY - 4 - ((t?.out?.length ?? 1) - 1) * 8]} anchor="start" />
    <Band from={[right - 14 - ww / 2, cy + bh / 2 - 4]} to={[right - 14 - ww / 2, cy + bh / 2 + 70]} w={ww} tone="wasted" dim={d('wasted')}
      label={t?.waste} labelAt={[right + 10, cy + bh / 2 + 36]} anchor="start" />
    <rect x={left} y={cy - bh / 2} width={bw} height={bh} rx="16" fill="#f7fafc" stroke={ink} strokeWidth="2.4" />
    {lamp ? <Bulb x={cx} y={cy - 6} r={20} /> : <Motor x={cx} y={cy - 6} s={0.9} />}
    <text x={cx} y={cy + bh / 2 - 10} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>{name}</text>
  </g>
}
/** A bar showing the useful share of the input. */
function ShareBar({ x, y, w, share, label }: { x: number; y: number; w: number; share: number; label?: string }) {
  return <g>
    <rect x={x} y={y} width={w} height={18} rx="9" fill={qty.wasted.fill} stroke={qty.wasted.line} strokeWidth="1.8" />
    <rect x={x} y={y} width={r1(w * share)} height={18} rx="9" fill={qty.useful.fill} stroke={qty.useful.line} strokeWidth="1.8" />
    {label && <text x={x + w / 2} y={y + 38} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>{label}</text>}
  </g>
}

/* ---------- Section 1: what is efficiency? ---------- */

function DeviceScene({ focus }: { focus: string }) {
  if (focus === 'effic-measure') return <PhysicsDiagram title="Two devices each take in 100 joules. Device A transfers 90 joules usefully and wastes 10: it is efficient. Device B transfers 30 joules usefully and wastes 70: it is not efficient. Each bar shows the useful part shaded green.">
    {[0, 1].map(i => {
      const useful = i ? 30 : 90, x = i ? 405 : 135
      return <g key={i}>
        <Device cx={x} cy={100} input={100} useful={useful} scale={0.4} name={i ? 'B' : 'A'} text={false} len={62} />
        <text x={x - 76} y={58} textAnchor="middle" fontSize="13" fontWeight="700" fill={qty.total.line}>100 J in</text>
        <text x={x + 80} y={50} textAnchor="middle" fontSize="13" fontWeight="700" fill={qty.useful.line}>{useful} J useful</text>
        <text x={x + 40} y={196} fontSize="13" fontWeight="700" fill={qty.wasted.line}>{100 - useful} J wasted</text>
        <ShareBar x={x - 90} y={226} w={180} share={useful / 100} label={i ? 'not efficient' : 'efficient'} />
      </g>
    })}
    <path d="M270 30V280" stroke={P.panelLine} strokeWidth="1.6" strokeDasharray="5 6" />
  </PhysicsDiagram>
  if (focus === 'effic-never') return <PhysicsDiagram title="A very good device still wastes a little energy: some energy is always wasted. A dial shows its efficiency reaching just below 100 per cent.">
    <Device cx={170} cy={118} input={100} useful={92} scale={0.62} text={false} />
    <text x={230} y={236} fontSize="14" fontWeight="750" fill={qty.wasted.line}>a little is always wasted</text>
    {/* dial */}
    <g transform="translate(430 150)">
      <path d="M-80 0A80 80 0 0 1 80 0" stroke={P.grid} strokeWidth="16" fill="none" />
      <path d="M-80 0A80 80 0 0 1 77.3 -20.7" stroke={qty.useful.line} strokeWidth="16" fill="none" strokeLinecap="butt" opacity=".75" />
      <path d="M0 0L64 -16.5" stroke={ink} strokeWidth="3.4" />
      <circle r="6" fill={ink} />
      <text x={-80} y={24} textAnchor="middle" fontSize="12" fill={muted}>0%</text>
      <text x={84} y={24} textAnchor="middle" fontSize="12" fill={muted}>100%</text>
      <Cross x={88} y={-38} s={0.8} />
      <text x={0} y={52} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>never quite 100%</text>
    </g>
  </PhysicsDiagram>
  // effic-split
  return <PhysicsDiagram title="A device takes in 100 joules, the total input. 70 joules come out usefully and 30 joules are wasted. Total input equals useful output plus wasted energy.">
    <Device cx={236} cy={112} input={100} useful={70} />
    <Card x={60} y={246} w={420} h={44} tone="plain">
      <text x={270} y={274} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}><tspan fill={qty.total.line}>total input</tspan> = <tspan fill={qty.useful.line}>useful output</tspan> + <tspan fill={qty.wasted.line}>wasted</tspan></text>
    </Card>
  </PhysicsDiagram>
}

/* ---------- Section 2: the fraction card ---------- */

function EquationScene({ focus }: { focus: string }) {
  const eq = (y: number, size = 17, dim = false) => <g opacity={dim ? 0.3 : 1}><Fraction cx={270} y={y} size={size} lhs={{ text: 'efficiency', tone: 'power' }} top={{ text: 'useful output energy transfer', tone: 'useful' }} bottom={{ text: 'total input energy transfer', tone: 'total' }} /></g>
  if (focus === 'effic-eq') return <PhysicsDiagram title="The equation: efficiency equals useful output energy transfer divided by total input energy transfer. Useful is on top and total is underneath.">
    <Card x={14} y={60} w={512} h={120} strong />
    {eq(128)}
    <Caption y={220} text="useful on top, total underneath" />
    <Caption y={244} text="both in joules, so efficiency has no unit" />
  </PhysicsDiagram>
  if (focus === 'effic-decimal') {
    const x0 = 60, x1 = 400, at = (v: number) => r1(x0 + v * (x1 - x0))
    return <PhysicsDiagram title="A number line from 0 to 1 with marks at 0.2, 0.5 and 0.8. Efficiency is always somewhere between 0 and 1. The region beyond 1 is crossed out: it cannot happen. 0.8 means 80 out of every 100 joules are useful.">
      <rect x={x0} y={112} width={x1 - x0} height={16} rx="8" fill={qty.useful.fill} stroke={qty.useful.line} strokeWidth="1.8" />
      <rect x={x1 + 8} y={112} width={100} height={16} rx="8" fill={qty.wasted.fill} stroke={qty.wasted.line} strokeWidth="1.8" strokeDasharray="5 5" />
      <path d={`M${x1 + 20} 100L${x1 + 96} 140M${x1 + 96} 100L${x1 + 20} 140`} stroke={qty.wasted.line} strokeWidth="3" />
      <text x={x1 + 58} y={172} textAnchor="middle" fontSize="13" fontWeight="700" fill={qty.wasted.line}>more than 1:</text>
      <text x={x1 + 58} y={190} textAnchor="middle" fontSize="13" fontWeight="700" fill={qty.wasted.line}>cannot happen</text>
      {[0, 0.2, 0.5, 0.8, 1].map(v => <g key={v}>
        <path d={`M${at(v)} 104V136`} stroke={ink} strokeWidth={v === 0 || v === 1 ? 2.6 : 1.8} />
        <text x={at(v)} y={v === 0 || v === 1 ? 160 : 92} textAnchor="middle" fontSize={v === 0 || v === 1 ? 16 : 14} fontWeight="750" fill={ink}>{v}</text>
      </g>)}
      <Card x={130} y={206} w={280} h={60} tone="useful">
        <Lines x={270} y={232} anchor="middle" lines={['0.8 = 80 out of every', '100 J are useful']} size={14} weight={750} colour={qty.useful.line} />
      </Card>
      <path d={`M${at(0.8)} 140L${at(0.8)} 206`} stroke={qty.useful.line} strokeWidth="1.6" strokeDasharray="4 4" />
    </PhysicsDiagram>
  }
  if (focus === 'effic-percent') return <PhysicsDiagram title="Changing between a decimal and a percentage: 0.8 times 100 equals 80 per cent, and 80 per cent divided by 100 equals 0.8.">
    <g opacity={0.55}>{eq(56, 13)}</g>
    <Chip x={130} y={170} text="0.8" tone="power" size={24} w={110} />
    <Chip x={410} y={170} text="80%" tone="power" size={24} w={110} />
    <Arrow from={[196, 146]} to={[344, 146]} colour={qty.power.line} width={3} />
    <Arrow from={[344, 196]} to={[196, 196]} colour={qty.power.line} width={3} />
    <text x={270} y={134} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>× 100</text>
    <text x={270} y={222} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>÷ 100</text>
  </PhysicsDiagram>
  // effic-steps
  return <PhysicsDiagram title="Three steps: 1, write down the useful output and the total input. 2, divide the useful output by the total input. 3, multiply by 100 if you want a percentage.">
    <g opacity={0.55}>{eq(56, 13)}</g>
    <Steps x={70} y={138} gap={50} steps={[['write down the useful output and the total input'], ['divide: useful ÷ total'], ['× 100 for a percentage']]} />
  </PhysicsDiagram>
}

/* ---------- Section 3: power ---------- */

function PowerScene({ focus }: { focus: string }) {
  if (focus === 'effic-power-eq') return <PhysicsDiagram title="A lamp takes in 20 watts and gives out 5 watts of light; the other 15 watts are wasted. Efficiency equals 5 divided by 20, which is 0.25, or 25 per cent.">
    <Device cx={196} cy={110} input={20} useful={5} unit="W" scale={2.6} name="lamp" lamp len={96} text={{ in: ['20 W in'], out: ['5 W', 'light'], waste: ['15 W', 'wasted'] }} />
    <Card x={330} y={150} w={196} h={100} tone="power" strong>
      <text x={428} y={184} textAnchor="middle" fontSize="18" fontWeight="800" fill={ink}><tspan fill={qty.useful.line}>5</tspan> ÷ <tspan fill={qty.total.line}>20</tspan> = 0.25</text>
      <text x={428} y={222} textAnchor="middle" fontSize="18" fontWeight="800" fill={qty.power.line}>= 25%</text>
    </Card>
  </PhysicsDiagram>
  if (focus === 'effic-rearrange') return <PhysicsDiagram title="Rearranging: efficiency equals useful power output divided by total power input. Multiply both sides by the total power input. This gives useful power output equals efficiency times total power input. Use the efficiency as a decimal.">
    <Fraction cx={270} y={64} size={16} lhs={{ text: 'efficiency', tone: 'power' }} top={{ text: 'useful power output', tone: 'useful' }} bottom={{ text: 'total power input', tone: 'total' }} />
    <Arrow from={[270, 100]} to={[270, 138]} colour={muted} width={2.2} />
    <Lines x={286} y={112} lines={['× total power input', 'on both sides']} size={14} weight={700} colour={muted} />
    <Card x={14} y={152} w={512} h={60} tone="useful" strong>
      <text x={270} y={188} textAnchor="middle" fontSize="15" fontWeight="800" fill={ink}><tspan fill={qty.useful.line}>useful power output</tspan> = <tspan fill={qty.power.line}>efficiency</tspan> × <tspan fill={qty.total.line}>total power input</tspan></text>
    </Card>
    <Chip x={270} y={252} text="use the decimal: 60% → 0.6" tone="power" />
  </PhysicsDiagram>
  // effic-power
  return <PhysicsDiagram title="The same device with its arrows in watts: total power input, useful power output and a smaller wasted part. Efficiency can use power instead of energy.">
    <Device cx={236} cy={112} input={100} useful={70} unit="W" />
    <Card x={14} y={246} w={512} h={44} tone="plain">
      <text x={270} y={274} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>efficiency = <tspan fill={qty.useful.line}>useful power output</tspan> ÷ <tspan fill={qty.total.line}>total power input</tspan></text>
    </Card>
  </PhysicsDiagram>
}

/* ---------- Worked examples ---------- */

function WorkedEnergy() {
  return <PhysicsDiagram title="Worked example: a motor takes in 500 joules; 350 joules are useful and 150 are wasted. Step 1, useful 350 joules and total 500 joules. Step 2, 350 divided by 500 is 0.7. Step 3, 0.7 times 100 is 70 per cent.">
    <Device cx={142} cy={120} input={500} useful={350} scale={0.11} name="motor" len={72} text={false} />
    <text x={62} y={78} textAnchor="middle" fontSize="14" fontWeight="750" fill={qty.total.line}>500 J in</text>
    <text x={226} y={78} textAnchor="middle" fontSize="14" fontWeight="750" fill={qty.useful.line}>350 J useful</text>
    <text x={190} y={226} fontSize="14" fontWeight="750" fill={qty.wasted.line}>150 J wasted</text>
    <Steps x={318} y={60} gap={66} answer="power" steps={[['useful = 350 J', 'total = 500 J'], ['350 ÷ 500 = 0.7'], ['0.7 × 100 = 70%']]} />
  </PhysicsDiagram>
}
function WorkedPower() {
  return <PhysicsDiagram title="Worked example: a machine is 60 per cent efficient with a total power input of 500 watts. Step 1, 60 per cent is 0.6. Step 2, useful power output equals efficiency times total power input. Step 3, 0.6 times 500 is 300 watts.">
    <Device cx={142} cy={120} input={500} useful={300} unit="W" scale={0.11} name="machine" len={72} text={false} />
    <text x={62} y={78} textAnchor="middle" fontSize="14" fontWeight="750" fill={qty.total.line}>500 W in</text>
    <text x={226} y={78} textAnchor="middle" fontSize="14" fontWeight="750" fill={qty.useful.line}>useful = ?</text>
    <Chip x={142} y={262} text="60% efficient" tone="power" />
    <Steps x={318} y={60} gap={66} answer="useful" steps={[['60% = 60 ÷ 100', '= 0.6'], ['useful = efficiency', '× total input'], ['0.6 × 500 = 300 W']]} />
  </PhysicsDiagram>
}

/* ---------- Question ---------- */

function QuestionLamp() {
  return <PhysicsDiagram title="An energy transfer diagram for a lamp with the energy in and the energy out.">
    <Band from={[30, 120]} to={[210, 120]} w={60} tone="total" label={['200 J in', '(electrically)']} labelAt={[108, 50]} />
    <rect x={200} y={78} width={100} height={84} rx="16" fill="#f7fafc" stroke={ink} strokeWidth="2.4" />
    <Bulb x={250} y={112} r={20} />
    <text x={250} y={154} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>lamp</text>
    <Band from={[296, 96]} to={[420, 96]} w={12} tone="total" label={['40 J', 'light']} labelAt={[430, 92]} anchor="start" />
    <Band from={[268, 160]} to={[268, 262]} w={48} tone="total" label={['160 J to the thermal', 'store of the surroundings']} labelAt={[308, 226]} anchor="start" />
  </PhysicsDiagram>
}

export function EfficiencyVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'effic-split': case 'effic-measure': case 'effic-never': return <DeviceScene focus={focus} />
    case 'effic-eq': case 'effic-decimal': case 'effic-percent': case 'effic-steps': return <EquationScene focus={focus} />
    case 'effic-power': case 'effic-power-eq': case 'effic-rearrange': return <PowerScene focus={focus} />
    case 'effic-worked-energy': return <WorkedEnergy />
    case 'effic-worked-power': return <WorkedPower />
    case 'effic-q-lamp': return <QuestionLamp />
    default: return null
  }
}


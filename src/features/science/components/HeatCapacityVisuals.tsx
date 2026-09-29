import { physicsPalette as P, PhysicsDiagram, EnergyStoreBadge, TransferArrow } from './PhysicsKit'
import { ink, muted, r1, Caption, Tag, Eq, Arrow, Thermometer, StoreBar, StepStrip, Ring, Leader, metal, metalLine, type Piece } from './EnergyStoreVisuals'
import { qty, Spaced, UnitBox } from './KineticVisuals'

/*
 * Physics Lesson 5: Specific heat capacity. Original, code-native schematics; not to scale. Focus ids start with 'shc-'.
 *
 * The thermal store is the PhysicsKit thermal red everywhere; water is the course blue; hot things are tinted red
 * and cold things blue. Thermometers are rounded tubes with a red column. Equation colours follow the other Energy
 * lessons: mass m blue; change in thermal energy ΔE thermal red; specific heat capacity c brown; temperature
 * change Δθ violet. The worked example reuses one drawing (a 2 kg block with two thermometer readings) with a
 * step strip on top, as in the kinetic and potential energy lessons.
 */

const T = P.thermalLine, ccol = '#8a6443', dtheta = '#7a4fbd'
const copper = '#f0c09a', copperLine = '#b0683a', alu = '#e3e8ec', aluLine = '#7d8e9c'

/* ---------- Pieces ---------- */

function HotPlate({ x, y, w = 110, on = true }: { x: number; y: number; w?: number; on?: boolean }) {
  return <g>
    <rect x={x - w / 2} y={y} width={w} height={26} rx="6" fill="#e6e9ee" stroke={metalLine} strokeWidth="2" />
    <rect x={x - w / 2 + 10} y={y - 5} width={w - 20} height={7} rx="3" fill={on ? P.hotFill : metal} stroke={on ? P.hot : metalLine} strokeWidth="1.8" />
    <circle cx={x + w / 2 - 16} cy={y + 13} r="5" fill={on ? P.hot : metal} stroke={metalLine} strokeWidth="1.4" />
  </g>
}
function Block({ x, y, w = 90, h = 60, fill = copper, line = copperLine, label }: { x: number; y: number; w?: number; h?: number; fill?: string; line?: string; label?: string }) {
  return <g>
    <path d={`M${x - w / 2} ${y}V${y - h + 8}Q${x - w / 2} ${y - h} ${x - w / 2 + 8} ${y - h}H${x + w / 2 - 8}Q${x + w / 2} ${y - h} ${x + w / 2} ${y - h + 8}V${y}Z`} fill={fill} stroke={line} strokeWidth="2.2" />
    <path d={`M${x - w / 2 + 8} ${y - h + 10}H${x - w / 2 + 30}`} stroke="white" strokeWidth="3" opacity=".6" />
    {label && <text x={x} y={y - h / 2 + 6} textAnchor="middle" fontSize="15" fontWeight="800" fill={line}>{label}</text>}
  </g>
}
function Beaker({ x, y, w = 80, h = 100, level = 0.7, fill = P.water, line = P.waterLine }: { x: number; y: number; w?: number; h?: number; level?: number; fill?: string; line?: string }) {
  const top = y - h, wl = r1(y - h * level)
  return <g>
    <path d={`M${x - w / 2 + 3} ${wl}H${x + w / 2 - 3}V${y - 8}Q${x + w / 2 - 3} ${y - 3} ${x + w / 2 - 8} ${y - 3}H${x - w / 2 + 8}Q${x - w / 2 + 3} ${y - 3} ${x - w / 2 + 3} ${y - 8}Z`} fill={fill} stroke="none" />
    <path d={`M${x - w / 2 + 3} ${wl}H${x + w / 2 - 3}`} stroke={line} strokeWidth="1.8" />
    <path d={`M${x - w / 2 - 6} ${top}Q${x - w / 2} ${top} ${x - w / 2} ${top + 6}V${y - 8}Q${x - w / 2} ${y} ${x - w / 2 + 8} ${y}H${x + w / 2 - 8}Q${x + w / 2} ${y} ${x + w / 2} ${y - 8}V${top}`} fill="none" stroke={metalLine} strokeWidth="2.2" />
  </g>
}
/** A tank of water with an electric immersion heater and a thermometer. (x, y) is the middle of the base. */
function Tank({ x, y, w = 170, h = 130, cable = true }: { x: number; y: number; w?: number; h?: number; cable?: boolean }) {
  const top = y - h
  return <g>
    <rect x={x - w / 2} y={top} width={w} height={h} rx="14" fill="white" stroke={metalLine} strokeWidth="2.4" />
    <path d={`M${x - w / 2 + 4} ${top + 26}H${x + w / 2 - 4}V${y - 14}Q${x + w / 2 - 4} ${y - 4} ${x + w / 2 - 14} ${y - 4}H${x - w / 2 + 14}Q${x - w / 2 + 4} ${y - 4} ${x - w / 2 + 4} ${y - 14}Z`} fill={P.water} />
    <path d={`M${x - w / 2 + 4} ${top + 26}H${x + w / 2 - 4}`} stroke={P.waterLine} strokeWidth="2" />
    {/* the heater: a rod bent into a loop with a coil */}
    <path d={`M${x - 36} ${top - 14}V${y - 30}Q${x - 36} ${y - 18} ${x - 24} ${y - 18}H${x - 4}Q${x + 8} ${y - 18} ${x + 8} ${y - 30}V${top - 14}`} fill="none" stroke={P.hot} strokeWidth="5" />
    <rect x={x - 46} y={top - 26} width={64} height={16} rx="5" fill="#e6e9ee" stroke={metalLine} strokeWidth="2" />
    {cable && <path d={`M${x - 46} ${top - 18}Q${x - 90} ${top - 20} ${x - 100} ${top + 20}`} stroke="#4f5d69" strokeWidth="3" fill="none" />}
    <Thermometer x={x + 50} y={y - 22} h={h + 10} level={0.62} />
  </g>
}
function Clock({ x, y, r = 13 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill="white" stroke={ink} strokeWidth="2" /><path d={`M${x} ${y - r + 4}V${y}L${x + r - 5} ${y + 2}`} stroke={ink} strokeWidth="2" fill="none" /></g>
}

/* ---------- Section 2: what does heating do? ---------- */

function Heating({ focus }: { focus: string }) {
  if (focus === 'shc-heating') return <PhysicsDiagram title="A metal block on a hot plate. Energy is transferred to its thermal store by heating, so its thermal store fills and its temperature goes up.">
    <HotPlate x={170} y={214} w={140} />
    <Block x={170} y={208} w={110} h={70} fill={alu} line={aluLine} />
    <Thermometer x={200} y={196} h={150} level={0.7} />
    <Arrow from={[146, 206]} to={[146, 160]} colour={P.hot} width={3.5} />
    <text x={108} y={190} textAnchor="end" fontSize="14" fontWeight="700" fill={P.hot}>by heating</text>
    <Leader from={[110, 186]} to={[140, 184]} colour={P.hot} />
    <Arrow from={[232, 150]} to={[232, 82]} colour={P.hot} width={3} />
    <text x={242} y={112} fontSize="14" fontWeight="700" fill={P.hot}>temperature up</text>
    <EnergyStoreBadge store="thermal" x={420} y={40} label="Thermal: block" />
    <StoreBar x={420} y={236} h={160} w={44} level={0.7} store="thermal" />
    <Arrow from={[476, 220]} to={[476, 110]} colour={T} width={3} />
    <text x={420} y={262} textAnchor="middle" fontSize="14" fontWeight="700" fill={T}>energy in</text>
  </PhysicsDiagram>
  if (focus === 'shc-heater') return <PhysicsDiagram title="An electric heater in a tank of water. Energy is transferred electrically to the thermal store of the heater, then by heating to the thermal store of the water. The thermometer shows the water getting hotter.">
    <Tank x={160} y={262} />
    <rect x={30} y={140} width={30} height={40} rx="6" fill="#e6e9ee" stroke={metalLine} strokeWidth="2" />
    <text x={45} y={200} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>mains</text>
    <EnergyStoreBadge store="thermal" x={300} y={46} label="Thermal: heater" />
    <EnergyStoreBadge store="thermal" x={440} y={190} label="Thermal: water" />
    <Leader from={[240, 58]} to={[150, 116]} colour={T} />
    <Leader from={[400, 206]} to={[184, 226]} colour={T} />
    <TransferArrow from={[62, 110]} to={[236, 40]} bend={-0.15} colour={P.current} width={3.5} label="electrically" />
    <TransferArrow from={[350, 64]} to={[440, 168]} bend={-0.2} colour={P.hot} width={3.5} label="by heating" />
  </PhysicsDiagram>
  // shc-describe
  return <PhysicsDiagram title="The same heater and tank. Sentence: energy is transferred electrically to the heater, then by heating to the water, so the temperature of the water increases.">
    <Tank x={270} y={190} w={150} h={110} cable={false} />
    <rect x={20} y={214} width={500} height={78} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Eq x={270} y={240} size={15} pieces={[['energy is transferred '], ['electrically', P.current], [' to the '], ['heater', T], [',']]} />
    <Eq x={270} y={262} size={15} pieces={[['then '], ['by heating', P.hot], [' to the '], ['thermal store of the water', T], [',']]} />
    <Eq x={270} y={284} size={15} pieces={[['so the '], ['temperature', dtheta], [' of the water increases']]} />
  </PhysicsDiagram>
}

/* ---------- Section 3: what is specific heat capacity? ---------- */

function Meaning({ focus }: { focus: string }) {
  if (focus === 'shc-different') return <PhysicsDiagram title="1 kg of water and 1 kg of copper on identical hot plates for the same time. The thermometer in the copper reads much higher than the thermometer in the water.">
    {[{ x: 140, water: true }, { x: 400, water: false }].map(({ x, water }) => <g key={x}>
      <HotPlate x={x} y={238} w={150} />
      {water ? <Beaker x={x} y={232} w={110} h={110} level={0.72} /> : <Block x={x} y={232} w={116} h={70} />}
      <Thermometer x={x + 30} y={water ? 212 : 196} h={150} level={water ? 0.3 : 0.9} />
      <Tag x={x + 30} y={water ? 50 : 34} text={water ? '25 °C' : '60 °C'} colour={P.hot} w={62} />
      <text x={x - 20} y={water ? 176 : 204} textAnchor="middle" fontSize="15" fontWeight="800" fill={water ? P.waterLine : copperLine}>{water ? 'water' : 'copper'}</text>
      <Tag x={x - (water ? 72 : -72)} y={120} text="1 kg" colour={qty.mass} w={52} />
    </g>)}
    <Clock x={196} y={284} />
    <text x={216} y={289} fontSize="14" fontWeight="700" fill={ink}>same heating time</text>
  </PhysicsDiagram>
  if (focus === 'shc-definition') return <PhysicsDiagram title="A 1 kg block warmed by 1 °C. The specific heat capacity is the energy needed to raise the temperature of 1 kg of a material by 1 °C. Its unit is J/kg°C.">
    <Block x={110} y={186} w={130} h={90} fill={alu} line={aluLine} />
    <Tag x={110} y={140} text="1 kg" colour={qty.mass} w={56} />
    <Thermometer x={200} y={180} h={130} level={0.5} />
    <Arrow from={[220, 118]} to={[220, 94]} colour={dtheta} width={3} />
    <text x={230} y={112} fontSize="16" fontWeight="800" fill={dtheta}>+1 °C</text>
    <TransferArrow from={[20, 70]} to={[62, 120]} bend={0.3} colour={T} width={3.5} />
    <text x={20} y={56} fontSize="14" fontWeight="700" fill={T}>how much energy?</text>
    <rect x={296} y={48} width={228} height={150} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <text x={410} y={80} textAnchor="middle" fontSize="15" fontWeight="800" fill={ccol}>specific heat capacity</text>
    <text x={410} y={104} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>= energy to warm</text>
    <Eq x={410} y={128} size={15} pieces={[['1 kg', qty.mass], [' by '], ['1 °C', dtheta]]} />
    <text x={410} y={170} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>unit</text>
    <text x={410} y={190} textAnchor="middle" fontSize="16" fontWeight="800" fill={ccol}>J/kg°C</text>
    <Caption text="joules per kilogram per degree Celsius" y={250} />
  </PhysicsDiagram>
  if (focus === 'shc-water') return <PhysicsDiagram title="Warming 1 kg of water by 1 °C takes 4200 J. Warming 1 kg of copper by 1 °C takes only about 390 J. The energy bars show the difference.">
    <Beaker x={90} y={130} w={96} h={96} level={0.8} />
    <text x={90} y={150} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.waterLine}>1 kg water</text>
    <Block x={90} y={264} w={60} h={46} label="" />
    <text x={90} y={284} textAnchor="middle" fontSize="13" fontWeight="700" fill={copperLine}>1 kg copper</text>
    <text x={168} y={80} fontSize="14" fontWeight="800" fill={dtheta}>+1 °C</text>
    <text x={168} y={232} fontSize="14" fontWeight="800" fill={dtheta}>+1 °C</text>
    <rect x={220} y={62} width={300} height={34} rx="17" fill="white" stroke={T} strokeWidth="1.6" />
    <rect x={224} y={66} width={292} height={26} rx="13" fill={P.thermal} stroke={T} strokeWidth="1" />
    <text x={370} y={126} textAnchor="middle" fontSize="20" fontWeight="800" fill={T}>4200 J</text>
    <rect x={220} y={214} width={300} height={34} rx="17" fill="white" stroke={T} strokeWidth="1.6" />
    <rect x={224} y={218} width={30} height={26} rx="13" fill={P.thermal} stroke={T} strokeWidth="1" />
    <text x={270} y={237} fontSize="18" fontWeight="800" fill={T}>about 390 J</text>
    <text x={370} y={40} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>energy needed</text>
  </PhysicsDiagram>
  // shc-high
  return <PhysicsDiagram title="Two materials warmed by the same 10 °C. The one with a high specific heat capacity stores much more energy in its thermal store, and gives out a lot when it cools. The one with a low specific heat capacity stores little.">
    {[{ x: 150, high: true }, { x: 390, high: false }].map(({ x, high }) => <g key={x}>
      <text x={x} y={30} textAnchor="middle" fontSize="15" fontWeight="800" fill={ccol}>{high ? 'high specific heat capacity' : 'low specific heat capacity'}</text>
      <StoreBar x={x} y={236} h={160} w={70} level={high ? 0.92 : 0.2} store="thermal" />
      <text x={x} y={52} textAnchor="middle" fontSize="14" fontWeight="700" fill={dtheta}>warmed by 10 °C</text>
      <text x={x} y={262} textAnchor="middle" fontSize="14" fontWeight="700" fill={T}>{high ? 'stores lots of energy' : 'stores little energy'}</text>
    </g>)}
    <Caption text="Same temperature rise, very different energy." y={288} />
  </PhysicsDiagram>
}

/* ---------- Section 4: the equation ---------- */

const words: Piece[][] = [[['change in thermal energy', T], [' =']], [['mass', qty.mass], [' × '], ['specific heat capacity', ccol]], [['× '], ['temperature change', dtheta]]]
const row: Array<[string, string, number]> = [['ΔE', T, 162], ['=', ink, 206], ['m', qty.mass, 242], ['×', ink, 274], ['c', ccol, 304], ['×', ink, 334], ['Δθ', dtheta, 372]]
function Equation({ focus }: { focus: string }) {
  if (focus === 'shc-words') return <PhysicsDiagram title="The equation in words: change in thermal energy equals mass times specific heat capacity times temperature change.">
    <EnergyStoreBadge store="thermal" x={270} y={32} label="Thermal energy" />
    <rect x={24} y={64} width={492} height={140} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    {words.map((w, i) => <Eq key={i} x={270} y={104 + i * 38} size={21} pieces={w} />)}
    <Caption text="Multiply the three together." y={246} />
  </PhysicsDiagram>
  if (focus === 'shc-symbols') return <PhysicsDiagram title="The equation in symbols: delta E equals m times c times delta theta. Delta E is the change in thermal energy in joules; m is mass in kilograms; c is specific heat capacity in J/kg°C; delta theta is the temperature change in °C. Delta means change in and theta means temperature.">
    <rect x={126} y={14} width={288} height={66} rx="16" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
    <Spaced y={60} items={row} />
    <UnitBox x={72} y={170} to={[162, 70]} name="energy change" unit="joules" symbol="J" colour={T} w={124} />
    <UnitBox x={204} y={170} to={[242, 70]} name="mass" unit="kilograms" symbol="kg" colour={qty.mass} w={124} />
    <UnitBox x={336} y={170} to={[304, 70]} name="s.h.c." unit="J per kg per °C" symbol="J/kg°C" colour={ccol} w={124} />
    <UnitBox x={468} y={170} to={[372, 70]} name="temp. change" unit="degrees Celsius" symbol="°C" colour={dtheta} w={124} />
    <rect x={60} y={234} width={420} height={48} rx="12" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    <Eq x={270} y={264} size={15} pieces={[['Δ', dtheta], [' (delta) means change in,   '], ['θ', dtheta], [' (theta) means temperature']]} />
  </PhysicsDiagram>
  // shc-delta
  return <PhysicsDiagram title="Two thermometers: the start temperature is 20 °C and the end temperature is 25 °C. The temperature change is 25 minus 20, which is 5 °C.">
    <Thermometer x={150} y={250} h={210} level={0.4} reading="20 °C" side="left" />
    <text x={150} y={284} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>start</text>
    <Thermometer x={250} y={250} h={210} level={0.6} reading="25 °C" side="left" />
    <text x={250} y={284} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>end</text>
    <path d={`M156 ${r1(240 - 188 * 0.4)}H244M256 ${r1(240 - 188 * 0.4)}H320M256 ${r1(240 - 188 * 0.6)}H320`} stroke={dtheta} strokeWidth="1.5" strokeDasharray="4 4" />
    <path d={`M330 ${r1(240 - 188 * 0.6)}Q340 ${r1(240 - 188 * 0.6)} 340 ${r1(240 - 188 * 0.5)}Q340 ${r1(240 - 188 * 0.4)} 330 ${r1(240 - 188 * 0.4)}`} stroke={dtheta} strokeWidth="2.4" fill="none" />
    <rect x={352} y={106} width={176} height={70} rx="14" fill="#f0e9fa" stroke={dtheta} strokeWidth="1.8" />
    <text x={440} y={134} textAnchor="middle" fontSize="18" fontWeight="800" fill={dtheta}>Δθ = 25 − 20</text>
    <text x={440} y={162} textAnchor="middle" fontSize="18" fontWeight="800" fill={dtheta}>= 5 °C</text>
    <text x={440} y={204} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>larger − smaller</text>
  </PhysicsDiagram>
}

/* ---------- Section 5: worked example (one drawing, three steps) ---------- */

function Worked({ step }: { step: 1 | 2 | 3 }) {
  const titles = [
    'Step 1 of 3: a 2 kg metal block with a specific heat capacity of 900 J/kg°C warms from 20 °C to 25 °C. Find the temperature change: 25 − 20 = 5 °C.',
    'Step 2 of 3: write the equation and put the numbers in: ΔE = m × c × Δθ = 2 × 900 × 5.',
    'Step 3 of 3: 2 × 900 = 1800, then 1800 × 5 = 9000. The answer is ΔE = 9000 J.',
  ]
  return <PhysicsDiagram title={titles[step - 1]}>
    <StepStrip steps={['Δθ', 'substitute', 'answer']} active={step} colour={T} gap={160} />
    <Block x={72} y={262} w={112} h={80} fill={alu} line={aluLine} />
    <Tag x={72} y={214} text="2 kg" colour={qty.mass} w={56} />
    <Tag x={80} y={156} text="c = 900 J/kg°C" colour={ccol} />
    <g opacity={step > 1 ? 0.5 : 1}>
      <Thermometer x={164} y={250} h={150} level={0.35} />
      <Tag x={164} y={86} text="20 °C" colour={P.hot} w={56} />
      <Thermometer x={226} y={250} h={150} level={0.55} />
      <Tag x={226} y={86} text="25 °C" colour={P.hot} w={56} />
    </g>
    <text x={164} y={282} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>start</text>
    <text x={226} y={282} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>end</text>
    <rect x={280} y={52} width={248} height={236} rx="16" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
    {step === 1 && <g>
      <rect x={292} y={96} width={224} height={44} rx="12" fill="#f0e9fa" stroke={dtheta} strokeWidth="1.8" />
      <Eq x={404} y={124} size={18} pieces={[['Δθ', dtheta], [' = 25 − 20 = '], ['5 °C', dtheta]]} />
      <text x={404} y={176} textAnchor="middle" fontSize="14" fontWeight="600" fill={ink}>m = 2 kg</text>
      <text x={404} y={200} textAnchor="middle" fontSize="14" fontWeight="600" fill={ink}>c = 900 J/kg°C</text>
      <text x={404} y={240} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>find the temperature</text>
      <text x={404} y={258} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>change first</text>
    </g>}
    {step >= 2 && <g opacity={step === 2 ? 1 : 0.55}>
      <Eq x={404} y={88} size={15} weight={650} pieces={[['Δθ', dtheta], [' = 5 °C']]} />
      <Spaced y={126} size={22} items={row.map(([t, c, x]) => [t, c, x + 137] as [string, string, number])} />
      <Eq x={404} y={164} size={20} pieces={[['ΔE', T], [' = '], ['2', qty.mass], [' × '], ['900', ccol], [' × '], ['5', dtheta]]} />
    </g>}
    {step === 2 && <g>
      <text x={404} y={210} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>already in kg and °C:</text>
      <text x={404} y={228} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>no converting needed</text>
    </g>}
    {step === 3 && <g>
      <Eq x={404} y={194} size={16} weight={650} pieces={[['2', qty.mass], [' × '], ['900', ccol], [' = 1800']]} />
      <Eq x={404} y={216} size={16} weight={650} pieces={[['1800 × '], ['5', dtheta], [' = 9000']]} />
      <rect x={316} y={230} width={176} height={44} rx="12" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
      <Spaced y={260} size={22} items={[['ΔE', T, 344], ['= 9000', ink, 410], ['J', ink, 468]]} />
      <Ring x={468} y={252} rx={12} ry={14} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Question: a bar chart of four materials (values shown, no "largest" wording) ---------- */

function QuestionBars() {
  const data: Array<[string, number]> = [['copper', 390], ['iron', 450], ['aluminium', 900], ['water', 4200]]
  const x0 = 120, w = 360, max = 4500, sx = (v: number) => r1(x0 + v / max * w)
  return <PhysicsDiagram title="A bar chart of specific heat capacity for copper, iron, aluminium and water." schematic={false}>
    <text x={270} y={24} textAnchor="middle" fontSize="15" fontWeight="800" fill={ink}>Four materials</text>
    <g stroke={P.grid} strokeWidth="1">{[1000, 2000, 3000, 4000].map(v => <path key={v} d={`M${sx(v)} 44V240`} />)}</g>
    {data.map(([name, v], i) => {
      const y = 62 + i * 46
      return <g key={name}>
        <text x={x0 - 10} y={y + 5} textAnchor="end" fontSize="14" fontWeight="700" fill={ink}>{name}</text>
        <rect x={x0} y={y - 13} width={r1(v / max * w)} height={26} rx="6" fill={P.thermal} stroke={T} strokeWidth="1.6" />
        <text x={sx(v) + 8} y={y + 5} fontSize="14" fontWeight="700" fill={T}>{v}</text>
      </g>
    })}
    <path d={`M${x0} 40V240H${x0 + w + 10}`} stroke={ink} strokeWidth="2" fill="none" />
    {[0, 1000, 2000, 3000, 4000].map(v => <g key={v}><path d={`M${sx(v)} 240v5`} stroke={ink} strokeWidth="1.5" /><text x={sx(v)} y={260} textAnchor="middle" fontSize="12" fill={muted}>{v}</text></g>)}
    <text x={x0 + w} y={284} textAnchor="end" fontSize="13" fontWeight="700" fill={ink}>Specific heat capacity in J/kg°C</text>
  </PhysicsDiagram>
}

export function HeatCapacityVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  if (['shc-heating', 'shc-heater', 'shc-describe'].includes(focus)) return <Heating focus={focus} />
  if (['shc-different', 'shc-definition', 'shc-water', 'shc-high'].includes(focus)) return <Meaning focus={focus} />
  if (['shc-words', 'shc-symbols', 'shc-delta'].includes(focus)) return <Equation focus={focus} />
  if (focus === 'shc-work-1') return <Worked step={1} />
  if (focus === 'shc-work-2') return <Worked step={2} />
  if (focus === 'shc-work-3') return <Worked step={3} />
  if (focus === 'shc-q-bars') return <QuestionBars />
  return null
}



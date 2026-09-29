import { useId, type ReactNode } from 'react'
import { Person } from './InfectionVisuals'
import { atmosPalette as P, Diagram, Lines, Caption, Arrow, CurveArrow, Leader, Num, Sun, Cloud, GasDot, Tree, Plant, Framed, seaPath, type Gas, type Mode, type AtmosPt as Pt } from './AtmosphereVisuals'

/*
 * Chemistry Lesson 46: greenhouse gases and climate change. Original, code-native schematics; not to scale. Focus ids start with 'ghg-'.
 * Shares the palette and pieces of AtmosphereVisuals.tsx (Lesson 45), and matches the Biology greenhouse drawing (EarthVisuals.tsx):
 *   yellow = short wavelength radiation from the Sun (tight zig-zag arrows)
 *   orange = long wavelength thermal (heat) radiation given out by the Earth and by greenhouse gases (gentle wavy arrows)
 *   purple = carbon dioxide, pale orange = methane, blue = water vapour, green = plants.
 * The greenhouse walkthrough reuses one drawing: the Sun, the Earth as a rounded globe and a thin band of atmosphere
 * (drawn far thicker than real life) holding greenhouse gas particles.
 */
const { ink, muted } = P
const r1 = (n: number) => Math.round(n * 10) / 10
const warm = '#c8505a'

// A travelling-wave arrow: a zig-zag (short wavelength) or a gentle wave (long wavelength) along a straight line, with a head.
function WaveArrow({ from, to, wavelength, amp, colour, width = 3, zig = false }: { from: Pt; to: Pt; wavelength: number; amp: number; colour: string; width?: number; zig?: boolean }) {
  const dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = -uy, ny = ux
  const head = 8 + width * 1.6, body = len - head * .8
  const steps = Math.max(8, Math.round(body / (zig ? wavelength / 2 : 2)))
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const d = body * i / steps
    const phase = d / wavelength
    const fade = Math.min(1, d / (wavelength * .6), (body - d) / (wavelength * .6))
    const off = (zig ? (i % 2 ? 1 : -1) * (i === 0 || i === steps ? 0 : 1) : Math.sin(phase * Math.PI * 2)) * amp * (zig ? 1 : fade)
    pts.push(`${r1(from[0] + ux * d + nx * off)} ${r1(from[1] + uy * d + ny * off)}`)
  }
  const tip = to, b = [to[0] - ux * head, to[1] - uy * head]
  const b1 = `${r1(b[0] + nx * head * .55)} ${r1(b[1] + ny * head * .55)}`, b2 = `${r1(b[0] - nx * head * .55)} ${r1(b[1] - ny * head * .55)}`
  return <g><path d={`M${pts.join('L')}`} stroke={colour} strokeWidth={width} fill="none" /><path d={`M${tip[0]} ${tip[1]}L${b1}L${b2}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}

// ---------- The greenhouse walkthrough drawing ----------
const C: Pt = [195, 306], EARTH_R = 112, AIR_R = 184
const polar = (deg: number, r: number): Pt => [r1(C[0] + Math.cos(deg * Math.PI / 180) * r), r1(C[1] - Math.sin(deg * Math.PI / 180) * r)]
const BAND_GASES: [number, number, Gas][] = [
  [22, 166, 'co2'], [32, 140, 'h2o'], [44, 166, 'ch4'], [90, 134, 'h2o'], [100, 166, 'ch4'], [8, 150, 'ch4'],
  [110, 140, 'co2'], [124, 168, 'h2o'], [132, 136, 'co2'], [76, 132, 'co2'], [140, 170, 'co2'],
]
const ABSORBER = polar(66, 172) // the gas particle that absorbs the Earth's heat radiation in steps 2 to 4
const LAND = ['M112 262C124 246 150 242 164 252C176 262 162 276 144 278C124 280 104 274 112 262Z', 'M224 250C240 240 268 244 278 258C284 270 266 278 248 274C230 270 214 260 224 250Z']
const PANEL_W = 342
function EarthScene({ children, glow = false, gasSize = 5.5 }: { children?: ReactNode; glow?: boolean; gasSize?: number }) {
  const clip = useId().replace(/:/g, ''), g = useId().replace(/:/g, '')
  return <g>
    <defs><radialGradient id={g}><stop offset="0" stopColor="#f7a15a" stopOpacity=".85" /><stop offset="1" stopColor="#f7a15a" stopOpacity="0" /></radialGradient></defs>
    <clipPath id={clip}><rect x={4} y={4} width={PANEL_W} height={292} rx="14" /></clipPath>
    <rect x={4} y={4} width={PANEL_W} height={292} rx="14" fill={P.space} />
    <g clipPath={`url(#${clip})`}>
      <circle cx={C[0]} cy={C[1]} r={AIR_R} fill="#e4f1f8" stroke={P.purple} strokeWidth="1.8" strokeDasharray="6 5" />
      <circle cx={C[0]} cy={C[1]} r={EARTH_R} fill={P.sea} stroke={P.seaLine} strokeWidth="2" />
      <g transform="translate(0 -26)">{LAND.map((d, i) => <path key={i} d={d} fill={P.grass} stroke={P.leafLine} strokeWidth="1.6" />)}</g>
      {glow && <ellipse cx={180} cy={C[1] - 104} rx={58} ry={20} fill={`url(#${g})`} />}
      {BAND_GASES.map(([deg, r, gas], i) => { const [x, y] = polar(deg, r); return <GasDot key={i} x={x} y={y} gas={gas} r={gasSize} label={false} /> })}
      {children}
    </g>
    <rect x={4} y={4} width={PANEL_W} height={292} rx="14" fill="none" stroke={P.panelLine} strokeWidth="1.4" />
    <text x={PANEL_W - 6} y={24} textAnchor="end" fontSize="12" fontWeight="600" fill={muted}>not to scale</text>
  </g>
}
const KX = 368
const STEP_KEY: { n: number; lines: string[]; colour: string; y: number }[] = [
  { n: 1, lines: ['short wavelength', 'radiation in'], colour: P.sunLine, y: 42 },
  { n: 2, lines: ['Earth absorbs it,', 'gives out long', 'wavelength thermal', '(heat) radiation'], colour: P.heat, y: 100 },
  { n: 3, lines: ['gases give it out', 'in all directions'], colour: P.heat, y: 190 },
  { n: 4, lines: ['some heads back:', 'surface warms'], colour: warm, y: 248 },
]
function StepKey({ modes }: { modes: Mode[] }) {
  return <g>{STEP_KEY.map((item, i) => {
    const mode = modes[i], active = mode === 'active'
    return <g key={item.n} opacity={mode === 'off' ? .4 : 1}>
      <circle cx={KX} cy={item.y} r="12" fill={active ? item.colour : 'white'} stroke={active ? item.colour : ink} strokeWidth="2" />
      <text x={KX} y={item.y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? 'white' : ink}>{item.n}</text>
      <text x={KX + 19} y={item.y + 5} fontSize="13" fontWeight={active ? 700 : 600} fill={active ? item.colour : ink}>{item.lines.map((l, j) => <tspan key={j} x={KX + 19} dy={j ? 16 : 0}>{l}</tspan>)}</text>
    </g>
  })}</g>
}
// Burst directions from the absorbing particle: every 45 degrees from "straight out", leaving out "straight in" (where step 2 arrives).
const OUT = 66
const BURST = [0, 45, 90, 135, 225, 270, 315].map(k => OUT + k)
const BACK_K = OUT + 135 + 0 // the burst arrow that heads back towards the surface in step 4
const SUN_IN: [Pt, Pt][] = [[[62, 70], polar(126, EARTH_R + 2)], [[74, 62], polar(109, EARTH_R + 2)]]
const HEAT_OUT: [Pt, Pt] = [polar(OUT, EARTH_R + 2), polar(OUT, 161)]
const BACK_DOWN: [Pt, Pt] = [[r1(ABSORBER[0] + Math.cos(212 * Math.PI / 180) * 11), r1(ABSORBER[1] - Math.sin(212 * Math.PI / 180) * 11)], polar(100, EARTH_R + 3)]
function burstArrow(deg: number, len = 26): [Pt, Pt] {
  const a = deg * Math.PI / 180
  return [[r1(ABSORBER[0] + Math.cos(a) * 11), r1(ABSORBER[1] - Math.sin(a) * 11)], [r1(ABSORBER[0] + Math.cos(a) * (11 + len)), r1(ABSORBER[1] - Math.sin(a) * (11 + len))]]
}
function EarthLabel({ text, colour }: { text: string; colour: string }) {
  const w = text.length * 8.6 + 20
  return <g><rect x={r1(C[0] - w / 2)} y={270} width={r1(w)} height={24} rx="12" fill="white" opacity=".85" /><text x={C[0]} y={287} textAnchor="middle" fontSize="14" fontWeight="700" fill={colour}>{text}</text></g>
}
function AtmosLabel() {
  const [x, y] = polar(152, 146)
  return <text x={x} y={y} textAnchor="middle" fontSize="12" fontWeight="700" fill={P.waterDeep} transform={`rotate(-62 ${x} ${y})`}>atmosphere</text>
}
// stage: 1..4 = walkthrough step highlighted; 5 = all steps (the full effect); 0 = assessment (numbers only)
function Walkthrough({ stage }: { stage: number }) {
  const o = (n: number) => stage === 0 || stage === 5 || n === stage ? 1 : n < stage ? .35 : 0
  const mode = (n: number): Mode => stage === 5 || stage === 0 ? 'on' : n === stage ? 'active' : n < stage ? 'on' : 'off'
  const titles: Record<number, string> = {
    1: 'Step 1: the Sun gives out short wavelength radiation, which passes through the atmosphere and reaches the Earth.',
    2: 'Step 2: the Earth absorbs the radiation and gives it out as long wavelength thermal (heat) radiation, which greenhouse gases absorb.',
    3: 'Step 3: the greenhouse gases give out the radiation again in all directions.',
    4: 'Step 4: some of the radiation heads back towards the Earth and warms the surface. This is the greenhouse effect.',
    5: 'The greenhouse effect in four steps: short wavelength radiation from the Sun reaches the Earth; the Earth gives out long wavelength thermal radiation; greenhouse gases absorb it and give it out in all directions; some heads back and warms the surface.',
    0: 'A drawing of the Sun, the Earth and a band of gas around it, with four numbered arrows.',
  }
  const assessment = stage === 0
  return <Diagram title={titles[stage]} schematic={!assessment}>
    <EarthScene glow={stage >= 4}>
      <g opacity={o(1)}>{SUN_IN.map(([a, b], i) => <WaveArrow key={i} from={a} to={b} wavelength={9} amp={4} colour="#e2ac2c" zig width={2.6} />)}</g>
      <g opacity={o(2)}><WaveArrow from={HEAT_OUT[0]} to={HEAT_OUT[1]} wavelength={16} amp={4.5} colour={P.heat} width={3} /></g>
      {stage >= 2 || assessment ? <GasDot x={ABSORBER[0]} y={ABSORBER[1]} gas="co2" r={9} label={false} /> : null}
      <g opacity={o(3)}>{BURST.filter(d => stage < 4 && !assessment ? true : d !== BACK_K).map(d => { const [a, b] = burstArrow(d); return <Arrow key={d} from={a} to={b} colour={P.heat} width={2} /> })}</g>
      <g opacity={o(4)}><WaveArrow from={BACK_DOWN[0]} to={BACK_DOWN[1]} wavelength={18} amp={4} colour={warm} width={3} /></g>
    </EarthScene>
    <Sun x={46} y={46} r={20} />
    {!assessment && <EarthLabel text={stage >= 4 ? 'the greenhouse effect' : 'Earth'} colour={stage >= 4 ? warm : P.leafLine} />}
    {!assessment && <AtmosLabel />}
    <g opacity={assessment || stage === 5 ? 1 : o(1) ? 1 : 0}><Num n={1} x={66} y={150} mode={mode(1)} colour={P.sunLine} /></g>
    <g opacity={assessment || stage === 5 ? 1 : o(2) ? 1 : 0}><Num n={2} x={282} y={212} mode={mode(2)} colour={P.heat} /></g>
    <g opacity={assessment || stage === 5 ? 1 : o(3) ? 1 : 0}><Num n={3} x={318} y={124} mode={mode(3)} colour={P.heat} /></g>
    <g opacity={assessment || stage === 5 ? 1 : o(4) ? 1 : 0}><Num n={4} x={212} y={150} mode={mode(4)} colour={warm} /></g>
    {!assessment && <StepKey modes={[1, 2, 3, 4].map(n => stage === 5 ? 'on' : mode(n))} />}
  </Diagram>
}
function Gases() {
  return <Diagram title="The Earth with a thin band of atmosphere holding greenhouse gases: carbon dioxide, methane and water vapour. They keep the Earth warm enough for life.">
    <EarthScene gasSize={7} />
    <Sun x={46} y={46} r={20} />
    <EarthLabel text="Earth" colour={P.leafLine} />
    <AtmosLabel />
    <text x={362} y={40} fontSize="15" fontWeight="700" fill={ink}>greenhouse gases</text>
    <GasDot x={376} y={78} gas="co2" /><Lines x={398} y={83} lines={['carbon dioxide']} size={13.5} colour={P.purple} />
    <GasDot x={376} y={118} gas="ch4" /><Lines x={398} y={123} lines={['methane']} size={13.5} colour={P.methane} />
    <GasDot x={376} y={158} gas="h2o" /><Lines x={398} y={163} lines={['water vapour']} size={13.5} colour={P.waterDeep} />
    <rect x={360} y={200} width={172} height={62} rx="16" fill={P.panelFill} stroke={P.panelLine} strokeWidth="1.5" />
    <Lines x={446} y={226} anchor="middle" lines={['keep the Earth warm', 'enough for life']} size={13} colour={warm} gap={3} />
  </Diagram>
}

// ---------- Small icons for human activities ----------
function Stump({ x, y, s = 1 }: { x: number; y: number; s?: number }) { return <Tree x={x} y={y} s={s} stump /> }
function Factory({ x, y, s = 1, smoke = true }: { x: number; y: number; s?: number; smoke?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {smoke && [[-6, -84, 8], [2, -98, 10], [12, -114, 12]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={P.smoke} stroke={P.smokeLine} strokeWidth="1.4" />)}
    <path d="M-14 -74H0V-30H-14Z" fill="#c9c2bb" stroke="#7d746c" strokeWidth="1.6" />
    <path d="M-16 -80H2V-72H-16Z" fill="#b3aaa1" stroke="#7d746c" strokeWidth="1.4" />
    <path d="M-40 0V-34L-20 -46V-34L0 -46V-34L20 -46V0Z" fill="#ddd6ce" stroke="#7d746c" strokeWidth="1.8" />
    <rect x={-32} y={-22} width={10} height={10} rx="2" fill="#f5e7a8" stroke="#7d746c" strokeWidth="1.2" /><rect x={-12} y={-22} width={10} height={10} rx="2" fill="#f5e7a8" stroke="#7d746c" strokeWidth="1.2" /><rect x={6} y={-22} width={8} height={22} rx="2" fill="#b3aaa1" stroke="#7d746c" strokeWidth="1.2" />
  </g>
}
function Car({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-34 -8C-34 -18 -30 -20 -22 -21L-14 -33C-11 -37 -8 -38 -2 -38H12C18 -38 21 -36 24 -32L31 -21C36 -20 38 -16 38 -8V-4H-34Z" fill="#8fb6d9" stroke="#4d7699" strokeWidth="1.8" />
    <path d="M-10 -22L-4 -32H6V-22ZM10 -22V-32H18L24 -22Z" fill="#eef6fb" stroke="#4d7699" strokeWidth="1.2" />
    <circle cx={-18} cy={-3} r="7" fill="#5c6670" stroke="#343c44" strokeWidth="1.4" /><circle cx={24} cy={-3} r="7" fill="#5c6670" stroke="#343c44" strokeWidth="1.4" />
    <path d="M-34 -10H-40" stroke="#7d746c" strokeWidth="2.4" />
  </g>
}
function House({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M14 -52V-36L22 -30V-52Z" fill="#c9a28a" stroke="#8a6450" strokeWidth="1.6" />
    <path d="M-28 0V-30L0 -52L28 -30V0Z" fill="#f4e7d6" stroke="#8a6450" strokeWidth="1.8" />
    <path d="M-34 -26L0 -56L34 -26" stroke="#b0604e" strokeWidth="4" fill="none" />
    <rect x={-18} y={-26} width={12} height={11} rx="2" fill="#dfeef7" stroke="#8a6450" strokeWidth="1.2" /><rect x={6} y={-20} width={11} height={20} rx="2" fill="#c9a28a" stroke="#8a6450" strokeWidth="1.2" />
  </g>
}
function Cow({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const line = '#6e655c'
  return <g transform={`translate(${x} ${y}) scale(${s})`} stroke={line} strokeWidth="1.6">
    <path d="M-26 -4V-22M-16 -4V-22M14 -4V-22M24 -4V-22" strokeWidth="4.5" />
    <path d="M-34 -30C-34 -46 -22 -50 0 -50C22 -50 32 -46 32 -30C32 -18 24 -16 0 -16C-24 -16 -34 -18 -34 -30Z" fill="#fbf8f2" />
    <path d="M-20 -48C-12 -44 -14 -34 -22 -30C-28 -34 -28 -44 -20 -48ZM8 -44C16 -46 22 -40 18 -32C12 -30 6 -36 8 -44Z" fill="#4f4944" stroke="none" />
    <path d="M-34 -36C-40 -34 -42 -26 -40 -18" fill="none" />
    <path d="M28 -50C34 -60 48 -60 54 -50C58 -42 56 -32 48 -30H36C30 -32 26 -42 28 -50Z" fill="#fbf8f2" />
    <ellipse cx={46} cy={-33} rx={9} ry={6} fill="#efc2b8" />
    <path d="M30 -56L24 -62M52 -56L58 -62" strokeWidth="2.4" />
    <circle cx={36} cy={-46} r="1.8" fill={ink} stroke="none" /><circle cx={47} cy={-46} r="1.8" fill={ink} stroke="none" />
  </g>
}
function Paddy({ x, y, w = 140, h = 44 }: { x: number; y: number; w?: number; h?: number }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="10" fill="#c4e2ef" stroke={P.seaLine} strokeWidth="1.8" />
    {Array.from({ length: 3 }, (_, row) => Array.from({ length: Math.floor(w / 22) }, (_, i) => {
      const px = x + 12 + i * 22 + (row % 2) * 8, py = y + 14 + row * 12
      return <path key={`${row}-${i}`} d={`M${px} ${py}l-4 -10M${px} ${py}l0 -12M${px} ${py}l4 -10`} stroke={P.leafLine} strokeWidth="1.6" />
    }))}
  </g>
}
function Landfill({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-70 0C-60 -30 -40 -48 -8 -52C24 -54 52 -36 70 0Z" fill="#c9b18f" stroke="#8a7050" strokeWidth="1.8" />
    <path d="M-40 -22l10 -12l8 10z" fill="#9ec3a4" stroke="#5e8a66" strokeWidth="1.2" />
    <rect x={-12} y={-40} width={16} height={12} rx="2" fill="#e6d3a8" stroke="#8a7050" strokeWidth="1.2" transform="rotate(-14 -4 -34)" />
    <path d="M18 -30h16v7h-16z" fill="#a8c7e0" stroke="#5c7f9c" strokeWidth="1.2" transform="rotate(20 26 -26)" />
    <circle cx={42} cy={-12} r="6" fill="#e3a6a0" stroke="#a7625b" strokeWidth="1.2" />
    <path d="M-24 -10c6 -4 12 -4 16 0" stroke="#8a7050" strokeWidth="1.4" fill="none" /><path d="M8 -12c6 -5 12 -3 14 1" stroke="#8a7050" strokeWidth="1.4" fill="none" />
  </g>
}
function Rising({ pts, gas, r = 12 }: { pts: Pt[]; gas: Gas; r?: number }) {
  return <g>{pts.map(([x, y], i) => <GasDot key={i} x={x} y={y} gas={gas} r={r} opacity={1 - i * .12} />)}</g>
}

// ---------- Human activities ----------
function IconPanel({ x, y, label, children }: { x: number; y: number; label: string; children: ReactNode }) {
  const clip = useId().replace(/:/g, '')
  return <g>
    <clipPath id={clip}><rect x={x} y={y} width={156} height={124} rx="16" /></clipPath>
    <rect x={x} y={y} width={156} height={124} rx="16" fill={P.sky} />
    <g clipPath={`url(#${clip})`}>{children}</g>
    <rect x={x} y={y} width={156} height={124} rx="16" fill="none" stroke={P.panelLine} strokeWidth="1.5" />
    <rect x={x + 6} y={y + 96} width={144} height={22} rx="11" fill="white" opacity=".9" />
    <text x={x + 78} y={y + 112} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={ink}>{label}</text>
  </g>
}
function Human() {
  return <Diagram viewBox="0 0 540 316" title="Four human activities that add greenhouse gases to the atmosphere: deforestation, burning fossil fuels, agriculture and creating waste.">
    {/* globe in the middle */}
    <circle cx={270} cy={150} r={78} fill="#e4f1f8" stroke={P.purple} strokeWidth="1.8" strokeDasharray="6 5" />
    <circle cx={270} cy={150} r={54} fill={P.sea} stroke={P.seaLine} strokeWidth="2" />
    <path d="M240 130C252 118 276 120 282 134C288 148 270 156 254 152C240 148 232 140 240 130ZM274 166C286 160 304 166 304 178C300 190 282 190 274 180C268 174 268 170 274 166Z" fill={P.grass} stroke={P.leafLine} strokeWidth="1.5" />
    {[[222, 106], [318, 108], [214, 186], [326, 190], [270, 84], [270, 218]].map(([x, y], i) => <GasDot key={i} x={x} y={y} gas={i % 3 === 1 ? 'ch4' : 'co2'} r={6} label={false} />)}
    <IconPanel x={10} y={14} label="deforestation">
      <Tree x={44} y={92} s={.72} seed={2} /><Stump x={86} y={92} /><Stump x={118} y={92} s={.9} />
      <path d="M10 92H166V140H10Z" fill={P.grass} />
    </IconPanel>
    <IconPanel x={374} y={14} label="burning fossil fuels">
      <path d="M374 92H530V140H374Z" fill="#dfe6d8" />
      <Factory x={418} y={92} s={.58} /><Car x={484} y={92} s={.72} />
    </IconPanel>
    <IconPanel x={10} y={162} label="agriculture">
      <path d="M10 240H166V290H10Z" fill={P.grass} />
      <Cow x={50} y={240} s={.72} /><Paddy x={100} y={206} w={56} h={34} />
    </IconPanel>
    <IconPanel x={374} y={162} label="creating waste">
      <Landfill x={452} y={244} s={.9} />
    </IconPanel>
    <Arrow from={[170, 76]} to={[204, 104]} colour={P.purple} /><Arrow from={[370, 76]} to={[336, 104]} colour={P.purple} />
    <Arrow from={[170, 226]} to={[204, 198]} colour={P.purple} /><Arrow from={[370, 226]} to={[336, 198]} colour={P.purple} />
    <Caption y={306} text="More greenhouse gases in the atmosphere" colour={P.purple} />
  </Diagram>
}
function Deforest() {
  return <Diagram title="On the left, a forest: trees take in carbon dioxide for photosynthesis. On the right, the same area with stumps: fewer trees, so less carbon dioxide is taken in and more stays in the air.">
    <Framed w={256} fill={P.sky}>
      <path d="M6 236C80 228 180 240 270 232V296H6Z" fill={P.grass} stroke={P.leafLine} strokeWidth="1.6" />
      <Tree x={60} y={240} s={1.05} seed={2} /><Tree x={138} y={236} s={1.2} seed={4} /><Tree x={214} y={240} s={1} seed={6} />
    </Framed>
    <Framed x={274} w={256} fill={P.sky}>
      <path d="M270 236C350 228 450 240 536 232V296H270Z" fill={P.grass} stroke={P.leafLine} strokeWidth="1.6" />
      <Stump x={330} y={240} /><Stump x={402} y={236} s={1.1} /><Stump x={476} y={240} />
    </Framed>
    <GasDot x={40} y={78} gas="co2" /><GasDot x={186} y={70} gas="co2" /><GasDot x={112} y={60} gas="co2" />
    <CurveArrow from={[44, 94]} to={[56, 140]} bend={-8} colour={P.purple} />
    <CurveArrow from={[114, 76]} to={[132, 124]} bend={8} colour={P.purple} />
    <CurveArrow from={[190, 86]} to={[208, 142]} bend={8} colour={P.purple} />
    {[[306, 70], [352, 104], [398, 64], [444, 112], [494, 78], [330, 150], [420, 160], [498, 150]].map(([x, y], i) => <GasDot key={i} x={x} y={y} gas="co2" />)}
    <Lines x={138} y={36} anchor="middle" lines={['trees take in carbon dioxide']} size={13.5} colour={P.purple} />
    <Lines x={402} y={36} anchor="middle" lines={['fewer trees: less taken in']} size={13.5} colour={P.purple} />
    <text x={138} y={282} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.leafLine}>forest</text>
    <text x={402} y={282} textAnchor="middle" fontSize="13" fontWeight="700" fill={P.leafLine}>trees cut down</text>
  </Diagram>
}
function Fossil() {
  return <Diagram title="A power station, a car and a house chimney, each giving off carbon dioxide. Burning fossil fuels releases carbon dioxide.">
    <Framed fill={P.sky}>
      <path d="M6 240C120 232 300 246 540 236V296H6Z" fill="#dfe6d8" stroke="#9fb08f" strokeWidth="1.6" />
    </Framed>
    <Factory x={110} y={244} s={1.15} smoke={false} />
    <Car x={290} y={244} s={1.2} />
    <House x={440} y={244} s={1.3} />
    <Rising gas="co2" pts={[[104, 140], [118, 102], [100, 66]]} />
    <Rising gas="co2" pts={[[232, 214], [214, 180], [230, 146]]} />
    <Rising gas="co2" pts={[[464, 150], [476, 114], [460, 80]]} />
    <text x={110} y={270} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>power station</text>
    <text x={290} y={270} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>vehicles</text>
    <text x={440} y={270} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>homes</text>
    <Lines x={290} y={42} anchor="middle" lines={['burning fossil fuels releases', 'carbon dioxide']} colour={P.purple} />
  </Diagram>
}
function Agri() {
  return <Diagram title="A cow giving off methane as it digests food, and a flooded rice paddy with bubbles of methane rising.">
    <Framed w={256} fill={P.sky}>
      <path d="M6 226C80 220 180 230 270 224V296H6Z" fill={P.grass} stroke={P.leafLine} strokeWidth="1.6" />
      <Cow x={118} y={234} s={1.5} />
    </Framed>
    <Framed x={274} w={256} fill={P.sky}>
      <path d="M270 226C350 220 450 230 536 224V296H270Z" fill={P.grass} stroke={P.leafLine} strokeWidth="1.6" />
      <Paddy x={296} y={188} w={212} h={62} />
    </Framed>
    <Rising gas="ch4" pts={[[70, 128], [98, 96], [72, 64]]} />
    {[[330, 160], [376, 130], [420, 156], [468, 118]].map(([x, y], i) => <g key={i}><GasDot x={x} y={y} gas="ch4" r={13} /></g>)}
    {[[344, 196], [398, 204], [452, 196]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="white" stroke={P.methane} strokeWidth="1.6" />)}
    <Lines x={176} y={48} anchor="middle" lines={['farm animals', 'digesting food']} size={14} colour={P.methane} />
    <Lines x={402} y={48} anchor="middle" lines={['rice paddies']} size={14} colour={P.methane} />
    <Lines x={402} y={278} anchor="middle" lines={['flooded fields']} size={13} weight={600} colour={P.leafLine} />
    <GasDot x={36} y={276} gas="ch4" r={12} /><text x={54} y={281} fontSize="13" fontWeight="700" fill={P.methane}>methane</text>
  </Diagram>
}
function Waste() {
  return <Diagram title="A landfill heap of waste with carbon dioxide and methane rising from it as the waste breaks down.">
    <Framed fill={P.sky}>
      <path d="M6 246C120 240 300 252 540 244V296H6Z" fill="#dfe6d8" stroke="#9fb08f" strokeWidth="1.6" />
      <Landfill x={270} y={250} s={1.7} />
    </Framed>
    <GasDot x={196} y={112} gas="co2" /><GasDot x={246} y={82} gas="ch4" /><GasDot x={296} y={110} gas="co2" /><GasDot x={342} y={80} gas="ch4" />
    <GasDot x={220} y={46} gas="ch4" opacity={.7} /><GasDot x={318} y={42} gas="co2" opacity={.7} />
    {[[210, 140], [270, 120], [332, 140]].map(([x, y], i) => <Arrow key={i} from={[x, y + 26]} to={[x, y]} colour={muted} width={2} />)}
    <Lines x={112} y={40} anchor="middle" lines={['waste breaks', 'down']} />
    <GasDot x={402} y={74} gas="co2" r={12} /><Lines x={420} y={79} lines={['carbon dioxide']} size={13} colour={P.purple} />
    <GasDot x={402} y={106} gas="ch4" r={12} /><Lines x={420} y={111} lines={['methane']} size={13} colour={P.methane} />
    <text x={270} y={284} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>landfill site</text>
  </Diagram>
}

// ---------- Evidence ----------
const TEMP_WIGGLE = [0, 5, -3, 6, -2, 4, -5, 3, 1, -4, 5, -1, 3, -3, 6, 0, -2, 4, -3, 2, 1, -2, 3, -1, 2, 0, 1, -1, 2, 0, 1]
function Temp() {
  const pts = TEMP_WIGGLE.map((w, i) => {
    const x = 74 + i * 9.4, t = Math.max(0, (x - 240) / 116)
    return [x, r1(204 - t * t * 100 - t * 20 + w * (1 - t * .3))] as Pt
  })
  return <Diagram title="A schematic line graph with no numbers. Across: time. Up: average temperature. The line wiggles up and down but has risen recently. Scientists link the rise to extra carbon dioxide from human activity.">
    <path d="M70 34V244H362" stroke={ink} strokeWidth="2" fill="none" />
    <path d="M64 42L70 32L76 42M352 238L364 244L352 250" stroke={ink} strokeWidth="2" fill="none" />
    <text x={216} y={270} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>time</text>
    <text x={0} y={0} transform="translate(48 140) rotate(-90)" textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>average temperature</text>
    <rect x={244} y={40} width={112} height={200} rx="12" fill={P.heatFill} opacity=".55" />
    <text x={300} y={232} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={P.heat}>recently</text>
    <path d={`M${pts.map(p => p.join(' ')).join('L')}`} stroke={warm} strokeWidth="3.4" fill="none" />
    <Lines x={376} y={56} lines={['average temperature', 'of the Earth’s', 'surface has gone', 'up recently']} size={13} colour={warm} gap={3} />
    <rect x={380} y={150} width={148} height={80} rx="16" fill={P.purpleFill} stroke={P.purple} strokeWidth="1.6" />
    <Lines x={454} y={174} anchor="middle" lines={['extra carbon', 'dioxide from', 'human activity']} size={13} colour={P.purple} gap={3} />
    <Leader from={[380, 176]} to={[336, 118]} colour={P.purple} />
  </Diagram>
}
function Page({ x, y, lines, tick = false, big = false }: { x: number; y: number; lines: number; tick?: boolean; big?: boolean }) {
  const w = big ? 64 : 46, h = big ? 80 : 58
  return <g>
    <path d={`M${x} ${y}h${w - 12}l12 12v${h - 12}h${-w}z`} fill="white" stroke={muted} strokeWidth="1.6" />
    {Array.from({ length: lines }, (_, i) => <path key={i} d={`M${x + 8} ${y + 16 + i * 9}h${w - 18 - (i % 2) * 8}`} stroke="#b7c3cc" strokeWidth="2.4" />)}
    {tick && <path d={`M${x + w - 22} ${y + h - 18}l7 8l14 -18`} stroke={P.good} strokeWidth="4" fill="none" />}
  </g>
}
function Peer() {
  return <Diagram title="Peer review: a scientist writes up the evidence, other scientists check it, and then it is published. This makes the information more reliable.">
    <Lines x={270} y={34} anchor="middle" lines={['peer review: other scientists check it']} size={15} />
    <g transform="translate(66 104) scale(.62)"><Person x={0} y={0} body={150} jumper="#f4f7fa" /></g>
    <Page x={100} y={124} lines={4} />
    <text x={96} y={232} textAnchor="middle" fontSize="13.5" fontWeight="700" fill={ink}>evidence</text>
    <Arrow from={[166, 150]} to={[214, 150]} colour={muted} width={2.4} />
    <g transform="translate(262 104) scale(.62)"><Person x={0} y={0} body={150} jumper="#dbe9f3" facing={-1} /></g>
    <Page x={226} y={124} lines={4} tick />
    <circle cx={306} cy={128} r="12" fill="white" stroke={ink} strokeWidth="2.4" /><path d="M314 137l10 10" stroke={ink} strokeWidth="4" />
    <text x={270} y={232} textAnchor="middle" fontSize="13.5" fontWeight="700" fill={ink}>checked</text>
    <Arrow from={[330, 150]} to={[378, 150]} colour={muted} width={2.4} />
    <rect x={392} y={96} width={104} height={114} rx="10" fill="#eef4f8" stroke={ink} strokeWidth="1.8" />
    <rect x={392} y={96} width={104} height={24} rx="10" fill={ink} /><rect x={392} y={108} width={104} height={12} fill={ink} />
    <text x={444} y={113} textAnchor="middle" fontSize="12" fontWeight="700" fill="white">journal</text>
    <Page x={412} y={128} lines={4} tick />
    <text x={444} y={232} textAnchor="middle" fontSize="13.5" fontWeight="700" fill={ink}>published</text>
    <rect x={190} y={252} width={160} height={34} rx="17" fill="#e3f2e8" stroke={P.good} strokeWidth="1.8" />
    <text x={270} y={274} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.good}>more reliable</text>
  </Diagram>
}
function Ice({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-30 0L-24 -14L-10 -18L2 -12L14 -20L28 -10L30 0Z" fill="#f4fbff" stroke="#8fb9d1" strokeWidth="1.8" />
}
function Model() {
  const around: [number, number, ReactNode][] = [
    [0, 0, <Sun key="s" x={0} y={0} r={11} />],
    [0, 0, <Cloud key="c" x={0} y={0} s={.36} />],
    [0, 0, <path key="w" d="M-18 0q4.5 -6 9 0t9 0t9 0t9 0" stroke={P.waterDeep} strokeWidth="3" fill="none" />],
    [0, 0, <Ice key="i" x={0} y={8} s={.7} />],
    [0, 0, <Tree key="t" x={0} y={24} s={.4} />],
    [0, 0, <g key="g"><GasDot x={-8} y={0} gas="co2" r={6} label={false} /><GasDot x={8} y={-4} gas="ch4" r={6} label={false} /><GasDot x={2} y={10} gas="h2o" r={6} label={false} /></g>],
  ]
  const cx = 138, cy = 158, R = 92
  const spots = around.map((_, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / around.length; return [r1(cx + Math.cos(a) * R), r1(cy + Math.sin(a) * R * .9)] as Pt })
  return <Diagram title="On the left, the real climate: many linked factors such as the Sun, clouds, oceans, ice, forests and gases around the Earth, which is very complex. On the right, a simple model with just one arrow, which may leave things out.">
    <path d={spots.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('') + 'Z'} stroke={P.panelLine} strokeWidth="1.6" fill="none" strokeDasharray="4 4" />
    {spots.map((p, i) => <path key={i} d={`M${p[0]} ${p[1]}L${cx} ${cy}M${p[0]} ${p[1]}L${spots[(i + 2) % spots.length][0]} ${spots[(i + 2) % spots.length][1]}`} stroke={P.panelLine} strokeWidth="1.4" strokeDasharray="4 4" />)}
    <circle cx={cx} cy={cy} r={34} fill={P.sea} stroke={P.seaLine} strokeWidth="2" />
    <path d="M118 150C126 140 144 142 148 152C150 162 138 166 128 164C118 162 114 156 118 150Z" fill={P.grass} stroke={P.leafLine} strokeWidth="1.4" />
    {spots.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r={24} fill="white" stroke={P.panelLine} strokeWidth="1.6" /><g transform={`translate(${p[0]} ${p[1]})`}>{around[i][2]}</g></g>)}
    <Lines x={138} y={288} anchor="middle" lines={['the real climate: very complex']} size={13.5} />
    <path d="M276 30V270" stroke={P.panelLine} strokeWidth="1.5" strokeDasharray="4 5" />
    <rect x={306} y={60} width={210} height={170} rx="18" fill={P.panelFill} stroke={P.panelLine} strokeWidth="1.6" />
    <circle cx={440} cy={168} r={34} fill={P.sea} stroke={P.seaLine} strokeWidth="2" />
    <Sun x={344} y={96} r={13} />
    <Arrow from={[358, 110]} to={[412, 146]} colour="#e2ac2c" width={3} />
    <text x={480} y={112} textAnchor="middle" fontSize="40" fontWeight="700" fill={muted} opacity=".6">?</text>
    <Lines x={411} y={260} anchor="middle" lines={['an oversimplified model', 'may leave things out']} size={13.5} gap={2} />
  </Diagram>
}
function Media() {
  return <Diagram title="A phone showing a news story with a thumbs-up and a question mark. A story can be based on good evidence, or it can be biased: favouring one view or giving only some of the facts.">
    <rect x={40} y={34} width={120} height={220} rx="20" fill="#f4f7fa" stroke={ink} strokeWidth="2.2" />
    <rect x={52} y={56} width={96} height={176} rx="8" fill="white" stroke={P.panelLine} strokeWidth="1.4" />
    <rect x={60} y={66} width={80} height={14} rx="4" fill={ink} opacity=".75" />
    {[92, 104, 116].map(y => <rect key={y} x={60} y={y} width={y === 116 ? 54 : 80} height="6" rx="3" fill="#b7c3cc" />)}
    <rect x={60} y={130} width={80} height={46} rx="6" fill={P.sky} stroke={P.panelLine} />
    <path d="M66 172L84 150L96 162L108 146L134 172Z" fill={P.grass} stroke={P.leafLine} strokeWidth="1.2" />
    {[188, 200, 212].map(y => <rect key={y} x={60} y={y} width={y === 212 ? 40 : 80} height="6" rx="3" fill="#b7c3cc" />)}
    {/* thumbs up and question mark */}
    <g transform="translate(196 92)">
      <path d="M0 16h10v26h-10zM12 18c6 -2 10 -10 10 -20c0 -6 8 -6 9 2c1 6 -2 10 -2 14h14c6 0 8 6 5 9c3 3 2 8 -2 10c2 4 0 8 -4 9c1 4 -2 7 -6 7h-24z" fill="#fbe7a6" stroke={P.sunLine} strokeWidth="1.8" />
    </g>
    <text x={216} y={194} textAnchor="middle" fontSize="44" fontWeight="700" fill={muted} opacity=".7">?</text>
    <rect x={288} y={44} width={238} height={84} rx="18" fill="#e9f5ee" stroke={P.good} strokeWidth="1.8" />
    <circle cx={320} cy={86} r="16" fill={P.good} /><path d="M312 86l6 7l11 -13" stroke="white" strokeWidth="3.4" fill="none" />
    <Lines x={346} y={82} lines={['based on good', 'evidence']} size={14} colour="#2f6d4f" gap={3} />
    <rect x={288} y={150} width={238} height={104} rx="18" fill="#fdf3e2" stroke={P.amber} strokeWidth="1.8" />
    <path d="M320 178L336 206H304Z" fill={P.amberFill} stroke={P.amber} strokeWidth="2" /><path d="M320 187V197M320 201.5V202" stroke="#8a5d17" strokeWidth="2.6" />
    <Lines x={346} y={176} lines={['biased: favours', 'one view, or gives', 'only some of the', 'facts']} size={13.5} colour="#8a5d17" gap={2} />
    <Caption y={284} text="Check the evidence behind a story" />
  </Diagram>
}

// ---------- Possible effects ----------
function CoastPanel({ x, after }: { x: number; after: boolean }) {
  const sea = after ? 176 : 196
  return <Framed x={x} y={34} w={250} h={196} fill={P.sky}>
    <path d={seaPath(x - 4, x + 254, sea, 240, 3, 30)} fill={P.sea} stroke={P.seaLine} strokeWidth="1.8" />
    {/* ice sheet on the left */}
    {after ? <path d={`M${x - 4} ${sea - 22}L${x + 24} ${sea - 28}L${x + 50} ${sea - 20}L${x + 62} ${sea + 4}H${x - 4}Z`} fill="#f4fbff" stroke="#8fb9d1" strokeWidth="1.8" />
      : <path d={`M${x - 4} ${sea - 58}L${x + 30} ${sea - 66}L${x + 70} ${sea - 60}L${x + 96} ${sea - 44}L${x + 110} ${sea + 4}H${x - 4}Z`} fill="#f4fbff" stroke="#8fb9d1" strokeWidth="1.8" />}
    {after && <g><Ice x={x + 86} y={sea + 2} s={.55} /><Ice x={x + 120} y={sea + 4} s={.4} /></g>}
    {/* low coast with a small town */}
    <path d={`M${x + 150} 240C${x + 160} 200 ${x + 176} 190 ${x + 196} 188H${x + 254}V240Z`} fill="#e7d6bb" stroke="#b39463" strokeWidth="1.6" />
    <House x={x + 206} y={190} s={.5} /><House x={x + 234} y={188} s={.45} />
    {after && <path d={`M${x + 154} ${sea}H${x + 250}`} stroke={P.seaLine} strokeWidth="2" />}
    {after && <path d={`M${x + 170} ${sea + 1}H${x + 250}V${sea + 8}H${x + 170}Z`} fill={P.sea} opacity=".8" />}
    {after && <path d={`M${x + 4} 196H${x + 246}`} stroke={P.waterDeep} strokeWidth="1.6" strokeDasharray="5 4" />}
  </Framed>
}
function IceMelt() {
  return <Diagram viewBox="0 0 540 280" title="Before and after: the polar ice gets smaller as it melts, and the sea level rises towards a coastal town, so there is more coastal flooding.">
    <text x={135} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={muted}>before</text>
    <text x={405} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={muted}>after</text>
    <CoastPanel x={10} after={false} />
    <CoastPanel x={280} after />
    <Arrow from={[264, 132]} to={[276, 132]} width={2.2} />
    <text x={30} y={112} fontSize="13.5" fontWeight="700" fill={P.waterDeep}>polar ice</text>
    <text x={330} y={120} fontSize="13.5" fontWeight="700" fill={P.waterDeep}>ice melts</text>
    <Leader from={[334, 126]} to={[310, 150]} colour={P.waterDeep} />
    <text x={292} y={222} fontSize="12" fontWeight="600" fill={P.waterDeep}>old sea level</text>
    <Lines x={270} y={262} anchor="middle" lines={['sea level rises: more coastal flooding']} size={14} colour={P.waterDeep} />
  </Diagram>
}
function RainCloud({ x, y, s = 1, dark = false }: { x: number; y: number; s?: number; dark?: boolean }) {
  return <Cloud x={x} y={y} s={s} fill={dark ? '#c9d2da' : '#ffffff'} line={dark ? '#7f8f9c' : '#9fb3c2'} />
}
function Rain() {
  return <Diagram title="Two panels: dry cracked ground under a small cloud shows too little water; heavy rain and a swollen river show too much water. Storms may become more frequent and more severe.">
    <Framed x={10} y={10} w={250} h={186} fill="#fbf4e8">
      <Sun x={60} y={52} r={18} /><Cloud x={180} y={56} s={.45} />
      <path d="M6 150C80 144 180 152 264 146V210H6Z" fill="#e3c6a0" stroke="#a9825a" strokeWidth="1.8" />
      <path d="M40 162l14 12l-4 14M100 156l-8 16l12 10l-2 14M160 160l10 10l-6 16M214 154l-10 14l8 14" stroke="#a9825a" strokeWidth="1.8" fill="none" />
    </Framed>
    <Framed x={280} y={10} w={250} h={186} fill="#eef3f7">
      <RainCloud x={404} y={50} s={.9} dark />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${340 + i * 16} ${84 + (i % 2) * 8}l-6 18`} stroke={P.water} strokeWidth="2.4" />)}
      <path d="M276 150C340 146 460 154 536 148V210H276Z" fill={P.grass} stroke={P.leafLine} strokeWidth="1.6" />
      <path d={seaPath(276, 536, 156, 210, 3, 30)} fill={P.sea} stroke={P.seaLine} strokeWidth="1.8" />
      <path d="M276 190C340 186 460 194 536 188V210H276Z" fill={P.sea} />
    </Framed>
    <text x={135} y={218} textAnchor="middle" fontSize="14" fontWeight="700" fill="#8a5d17">too little water</text>
    <text x={405} y={218} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.waterDeep}>too much water</text>
    <g transform="translate(96 262)"><RainCloud x={0} y={-8} s={.5} dark /><path d="M-2 4l-8 14h8l-6 14l16 -20h-8l6 -8z" fill="#fbe7a6" stroke={P.sunLine} strokeWidth="1.4" /></g>
    <Lines x={142} y={260} lines={['storms may be more frequent', 'and more severe']} size={14} gap={3} />
  </Diagram>
}
function Wheat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C1 -14 -1 -28 0 -40" stroke="#b5963f" strokeWidth="2" fill="none" />
    {[-44, -38, -32, -26].map((dy, i) => <g key={i}><ellipse cx={-3.5} cy={dy} rx="3" ry="5" transform={`rotate(-25 -3.5 ${dy})`} fill="#ecd48a" stroke="#b5963f" strokeWidth="1" /><ellipse cx={3.5} cy={dy + 2} rx="3" ry="5" transform={`rotate(25 3.5 ${dy + 2})`} fill="#ecd48a" stroke="#b5963f" strokeWidth="1" /></g>)}
    <ellipse cx={0} cy={-49} rx="2.6" ry="4.5" fill="#ecd48a" stroke="#b5963f" strokeWidth="1" />
  </g>
}
function Food() {
  return <Diagram title="A crop field with a small Sun and a cloud above it and a question mark. Changes in temperature and rainfall may affect food production in some places.">
    <Framed fill={P.sky}>
      <path d="M6 180C120 172 300 184 540 176V296H6Z" fill="#e9dcb5" stroke="#b5963f" strokeWidth="1.6" />
      {Array.from({ length: 3 }, (_, row) => Array.from({ length: 12 }, (_, i) => <Wheat key={`${row}-${i}`} x={34 + i * 42 + (row % 2) * 21} y={210 + row * 26} s={.85 + row * .1} />))}
    </Framed>
    <Sun x={196} y={80} r={20} />
    <Cloud x={344} y={74} s={.6} />
    <text x={270} y={96} textAnchor="middle" fontSize="40" fontWeight="700" fill={muted} opacity=".6">?</text>
    <Lines x={270} y={36} anchor="middle" lines={['temperature and rainfall changes']} size={14} />
    <rect x={120} y={252} width={300} height={32} rx="16" fill="white" opacity=".92" stroke={P.panelLine} />
    <text x={270} y={273} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>may affect food production in some places</text>
  </Diagram>
}

void Plant
export function GreenhouseVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'ghg-q-steps') return <Walkthrough stage={0} />
  const step = ['ghg-step1', 'ghg-step2', 'ghg-step3', 'ghg-step4', 'ghg-effect'].indexOf(focus)
  if (step >= 0) return <Walkthrough stage={assessment ? 0 : step + 1} />
  if (focus === 'ghg-gases') return <Gases />
  if (focus === 'ghg-human') return <Human />
  if (focus === 'ghg-deforest') return <Deforest />
  if (focus === 'ghg-fossil') return <Fossil />
  if (focus === 'ghg-agri') return <Agri />
  if (focus === 'ghg-waste') return <Waste />
  if (focus === 'ghg-temp') return <Temp />
  if (focus === 'ghg-peer') return <Peer />
  if (focus === 'ghg-model') return <Model />
  if (focus === 'ghg-media') return <Media />
  if (focus === 'ghg-ice') return <IceMelt />
  if (focus === 'ghg-rain') return <Rain />
  if (focus === 'ghg-food') return <Food />
  return <Walkthrough stage={5} />
}

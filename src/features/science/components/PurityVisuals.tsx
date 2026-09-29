import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry Lesson 41: Purity and formulations. Original, code-native schematics; not to scale. Focus ids start with 'pure-'.
 *
 * Colour code (the same in every drawing here):
 *   particles are soft circles, one colour per substance: water = blue (course colour), sugar = amber, flavour = pink,
 *   fruit pulp = orange, dissolved substances in tap water = small grey specks, an impurity = brown
 *   the wanted solid = pale cream; thermometer liquid = soft red; heat = orange flame
 *   graphs: pure sample = ink blue line, impure sample = amber line
 *   paint pigment = coral; binder = tan links; additives = small grey diamonds; solvent = pale blue
 * Worked numbers agree across drawings: pure water 0 °C and 100 °C; the data book value used for comparing is 136 °C.
 */
const { ink, muted, panelFill, panelLine } = atomPalette
const glass = '#f5fafd', glassLine = '#6f8fa6'
const water = '#d4e9f8', waterLine = '#3f8fd0'
const pWater = ['#9cc9ee', '#3f8fd0'], pSugar = ['#f3d08c', '#b9862a'], pFlavour = ['#f2a9bd', '#c0587a'], pPulp = ['#f7b98a', '#c8742c']
const pSpeck = ['#cfd5da', '#7f8c97'], pImpurity = ['#c49a74', '#7a5430'], pSolid = ['#f6eed7', '#b9a77a']
const thermo = '#ec8c83', thermoLine = '#b4524a'
const flameOut = '#f5a54a', flameIn = '#fcd97d', heatLine = '#c8641e'
const good = '#4f9a74', warn = '#c8742c'
const pureLine = '#3f78a8', impureLine = '#d38a2c'
const bookFill = '#fbf6ea', bookLine = '#b9a77a'
const pigment = ['#ef9a86', '#c0604a'], binder = '#b58f5e', additive = ['#d9dee3', '#7f8c97']
const halo = '#f8c979'
const faded = .35

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Lines({ x, y, lines, anchor = 'start', size = 14, weight = 700, colour = ink }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; colour?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={colour}>{lines.map((l, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{l}</tspan>)}</text>
}
function Caption({ text, y = 288 }: { text: string; y?: number }) {
  return <text x={270} y={y} textAnchor="middle" fontSize="14" fontWeight="600" fill={muted}>{text}</text>
}
function Leader({ from, to, colour = ink }: { from: Pt; to: Pt; colour?: string }) {
  return <g><path d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`} stroke={colour} strokeWidth="1.4" /><circle cx={to[0]} cy={to[1]} r="2.6" fill={colour} /></g>
}
function Arrow({ from, to, colour = ink, width = 2.4, dashed = false }: { from: Pt; to: Pt; colour?: string; width?: number; dashed?: boolean }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]), h = 6 + width * 1.5
  const p = (d: number, s: number): Pt => [r1(to[0] - Math.cos(a) * d + Math.cos(a + Math.PI / 2) * s), r1(to[1] - Math.sin(a) * d + Math.sin(a + Math.PI / 2) * s)]
  const [b1, b2, base] = [p(h, h * .6), p(h, -h * .6), p(h * .7, 0)]
  return <g><path d={`M${from[0]} ${from[1]}L${base[0]} ${base[1]}`} stroke={colour} strokeWidth={width} fill="none" strokeDasharray={dashed ? '6 6' : undefined} /><path d={`M${to[0]} ${to[1]}L${b1[0]} ${b1[1]}L${b2[0]} ${b2[1]}Z`} fill={colour} stroke={colour} strokeWidth="1.2" /></g>
}
function Badge({ x, y, text, colour, fill }: { x: number; y: number; text: string; colour: string; fill: string }) {
  const w = text.length * 8 + 20
  return <g><rect x={r1(x - w / 2)} y={y - 14} width={w} height={24} rx="12" fill={fill} stroke={colour} strokeWidth="1.6" /><text x={x} y={y + 3} textAnchor="middle" fontSize="13" fontWeight="700" fill={colour}>{text}</text></g>
}
function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C-9 -4 -8 -14 -2 -22C-1 -15 4 -14 3 -20C9 -13 10 -4 0 0Z" fill={flameOut} stroke={heatLine} strokeWidth="1.4" />
    <path d="M0 -3C-4 -6 -3 -11 0 -14C1 -10 4 -8 0 -3Z" fill={flameIn} />
  </g>
}

// ---------- Particles ----------
function P({ x, y, c, r = 7 }: { x: number; y: number; c: string[]; r?: number }) {
  return <circle cx={r1(x)} cy={r1(y)} r={r} fill={c[0]} stroke={c[1]} strokeWidth="1.4" />
}
/** Evenly spread, organic-looking points inside a circle (a sunflower spiral). */
function spread(cx: number, cy: number, r: number, n: number): Pt[] {
  return Array.from({ length: n }, (_, i) => { const d = r * Math.sqrt((i + .5) / n), a = i * 2.39996 + .6; return [r1(cx + Math.cos(a) * d), r1(cy + Math.sin(a) * d)] as Pt })
}
/** Loosely jittered grid of points in a box. */
function fill(x: number, y: number, w: number, h: number, cols: number, rows: number): Pt[] {
  const pts: Pt[] = []
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const jx = ((i * 7 + j * 13) % 5 - 2) * 1.6, jy = ((i * 11 + j * 3) % 5 - 2) * 1.4
    pts.push([r1(x + (i + .5 + (j % 2 ? .25 : -.1)) * w / cols + jx), r1(y + (j + .5) * h / rows + jy)])
  }
  return pts
}
function Magnifier({ cx, cy, r, from, children }: { cx: number; cy: number; r: number; from?: Pt; children: ReactNode }) {
  const clip = useId()
  const a = from ? Math.atan2(cy - from[1], cx - from[0]) : 0, s = Math.PI / 2.4
  return <g>
    {from && <path d={`M${from[0]} ${from[1]}L${r1(cx - Math.cos(a - s) * r)} ${r1(cy - Math.sin(a - s) * r)}M${from[0]} ${from[1]}L${r1(cx - Math.cos(a + s) * r)} ${r1(cy - Math.sin(a + s) * r)}`} stroke={muted} strokeWidth="1.3" strokeDasharray="4 4" />}
    <clipPath id={clip}><circle cx={cx} cy={cy} r={r - 2} /></clipPath>
    <circle cx={cx} cy={cy} r={r} fill="white" />
    <g clipPath={`url(#${clip})`}>{children}</g>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#7f9fb8" strokeWidth="3" />
  </g>
}

// ---------- Glassware ----------
/** A beaker: x,y is the top-left of the rim. `level` is the liquid height as a fraction. */
function Beaker({ x, y, w, h, level = 0, liquid = water, line = waterLine, children }: { x: number; y: number; w: number; h: number; level?: number; liquid?: string; line?: string; children?: ReactNode }) {
  const top = y + h - h * level
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="10" fill={glass} />
    {level > 0 && <path d={`M${x + 2} ${r1(top)}H${x + w - 2}V${y + h - 12}Q${x + w - 2} ${y + h - 2} ${x + w - 12} ${y + h - 2}H${x + 12}Q${x + 2} ${y + h - 2} ${x + 2} ${y + h - 12}Z`} fill={liquid} />}
    {level > 0 && <path d={`M${x + 2} ${r1(top)}H${x + w - 2}`} stroke={line} strokeWidth="1.8" />}
    {children}
    <path d={`M${x - 7} ${y - 3}Q${x} ${y - 1} ${x} ${y + 7}V${y + h - 14}Q${x} ${y + h} ${x + 14} ${y + h}H${x + w - 14}Q${x + w} ${y + h} ${x + w} ${y + h - 14}V${y}`} fill="none" stroke={glassLine} strokeWidth="2.4" />
    <path d={`M${x + 8} ${y + 14}V${y + h - 22}`} stroke="white" strokeWidth="3" opacity=".8" />
  </g>
}
/** A thermometer: x is its centre line, top its top, bulb the centre of the bulb. `reading` is the y of the top of the liquid. */
function Thermometer({ x, top, bulb, reading }: { x: number; top: number; bulb: number; reading: number }) {
  return <g>
    <path d={`M${x - 6} ${bulb - 8}V${top + 6}a6 6 0 0 1 12 0V${bulb - 8}`} fill="white" stroke={glassLine} strokeWidth="2" />
    <rect x={x - 2.6} y={reading} width={5.2} height={bulb - reading} rx="2.6" fill={thermo} />
    <circle cx={x} cy={bulb} r="10" fill={thermo} stroke={thermoLine} strokeWidth="1.8" />
  </g>
}

// ---------- Section 1: pure in everyday life and in chemistry ----------
function Carton({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M8 34L22 6H92L106 34Z" fill="#f7c98f" stroke="#c8742c" strokeWidth="2" />
    <path d="M40 6V-6H76V6" fill="#fbe3bf" stroke="#c8742c" strokeWidth="2" />
    <rect x={6} y={34} width={102} height={150} rx="10" fill="#fdf1dd" stroke="#c8742c" strokeWidth="2" />
    <circle cx={57} cy={82} r={24} fill="#f6b27a" stroke="#c8742c" strokeWidth="1.6" />
    <path d="M57 58q4 -10 12 -12" stroke={good} strokeWidth="2.4" fill="none" />
    <text x={57} y={134} textAnchor="middle" fontSize="16" fontWeight="700" fill="#a45a1e">pure juice</text>
    <text x={57} y={156} textAnchor="middle" fontSize="12" fontWeight="600" fill="#a45a1e">nothing added</text>
  </g>
}
function Everyday() {
  const pts = spread(372, 128, 76, 24)
  const kinds = [pWater, pWater, pSugar, pWater, pFlavour, pWater, pWater, pSugar, pWater, pFlavour, pWater, pSugar, pWater, pWater, pFlavour, pWater, pSugar, pWater, pWater, pFlavour, pWater, pSugar, pWater, pWater]
  return <Diagram title="A carton labelled pure juice, nothing added. A magnified view of the juice shows several different kinds of particle mixed together: water, sugar and flavour. It is still a mixture.">
    <Carton x={36} y={48} />
    <Magnifier cx={372} cy={128} r={86} from={[150, 140]}>
      <rect x={280} y={36} width={190} height={190} fill="#fdf6ec" />
      {pts.map(([x, y], i) => <P key={i} x={x} y={y} c={kinds[i]} r={8} />)}
    </Magnifier>
    {([['water', pWater], ['sugar', pSugar], ['flavour', pFlavour]] as const).map(([name, c], i) => <g key={name}>
      <P x={318 + i * 72 - 26} y={236} c={c} r={6} /><text x={318 + i * 72 - 14} y={241} fontSize="13" fontWeight="600" fill={ink}>{name}</text>
    </g>)}
    <Caption text="Nothing added, but still a mixture" y={284} />
  </Diagram>
}
function Chemistry() {
  const pts = fill(180, 124, 140, 110, 6, 4)
  return <Diagram title="A beaker of pure water. Every particle is the same kind: one substance only.">
    <Beaker x={170} y={92} w={160} h={150} level={.8}>
      {pts.map(([x, y], i) => <P key={i} x={x} y={y} c={pWater} r={8.5} />)}
    </Beaker>
    <Lines x={358} y={126} lines={['pure:', 'one substance', 'only']} size={16} colour={good} />
    <Lines x={358} y={200} lines={['one element or', 'one compound']} size={13} weight={600} colour={muted} />
    <Leader from={[352, 150]} to={[312, 160]} colour={good} />
    <Lines x={30} y={140} lines={['every particle', 'is the same']} size={14} />
    <Leader from={[140, 150]} to={[190, 160]} />
    <Caption text="A pure substance: nothing else mixed in" y={280} />
  </Diagram>
}
function Sort() {
  const cols: { x: number; name: string; pure: boolean; kinds: string[][] }[] = [
    { x: 40, name: 'pure water', pure: true, kinds: [pWater] },
    { x: 205, name: 'tap water', pure: false, kinds: [pWater] },
    { x: 370, name: 'orange juice', pure: false, kinds: [pWater, pSugar, pWater, pPulp, pWater, pFlavour] },
  ]
  return <Diagram title="Three beakers. Pure water holds only water particles, so it is pure. Tap water holds water particles plus a few dissolved specks, so it is a mixture. Orange juice holds several kinds of particle, so it is a mixture.">
    {cols.map(({ x, name, pure, kinds }, c) => {
      const pts = fill(x + 8, 96, 114, 100, 5, 4)
      return <g key={name}>
        <Beaker x={x} y={70} w={130} h={136} level={.82}>
          {pts.map(([px, py], i) => <P key={i} x={px} y={py} c={kinds[i % kinds.length]} r={7} />)}
          {c === 1 && [[64, 126], [104, 104], [36, 170], [90, 184]].map(([dx, dy], i) => <P key={`s${i}`} x={x + dx - 6} y={dy - 6} c={pSpeck} r={4} />)}
        </Beaker>
        <text x={x + 65} y={234} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{name}</text>
        <Badge x={x + 65} y={262} text={pure ? 'pure' : 'mixture'} colour={pure ? good : warn} fill={pure ? '#e3f2e8' : '#fdf0e2'} />
      </g>
    })}
    <Lines x={214} y={46} lines={['+ dissolved substances']} size={13} weight={600} colour={muted} />
    <Leader from={[296, 52]} to={[300, 94]} colour={muted} />
  </Diagram>
}
function Impure() {
  const bubble = spread(386, 140, 66, 22)
  const right = bubble.reduce((best, p, i) => p[0] > bubble[best][0] ? i : best, 0)
  const odd = new Set([4, 13, right])
  return <Diagram title="A flask holding a pale solid made in the lab. A magnified view shows mostly the wanted compound, with a few particles of a different substance mixed in: the impurity.">
    {/* conical flask */}
    <path d="M214 60V104L148 238Q144 250 158 250H286Q300 250 296 238L230 104V60Z" fill={glass} />
    <path d="M168 212Q220 196 276 212L290 238Q294 246 284 246H160Q150 246 154 238Z" fill={pSolid[0]} stroke={pSolid[1]} strokeWidth="1.4" />
    <path d="M210 58H234M214 58V104L148 238Q144 250 158 250H286Q300 250 296 238L230 104V58" fill="none" stroke={glassLine} strokeWidth="2.4" />
    <Magnifier cx={386} cy={140} r={78} from={[250, 222]}>
      {bubble.map(([x, y], i) => <P key={i} x={x} y={y} c={odd.has(i) ? pImpurity : pSolid} r={9} />)}
    </Magnifier>
    <Lines x={40} y={196} lines={['wanted', 'compound']} colour="#8c7640" />
    <Leader from={[168, 214]} to={[186, 226]} colour="#8c7640" />
    <Lines x={476} y={70} lines={['impurity']} anchor="middle" size={13} colour={pImpurity[1]} />
    <Leader from={[476, 78]} to={[bubble[right][0] + 4, bubble[right][1] - 6]} colour={pImpurity[1]} />
    <Caption text="Other substances mixed in: the sample is impure" y={286} />
  </Diagram>
}

// ---------- Section 2: melting and boiling points ----------
function Fixed() {
  return <Diagram viewBox="0 0 540 304" title="Pure water melts at one temperature, 0 °C, and boils at one temperature, 100 °C. Left: ice melting in a beaker with a thermometer reading 0 °C. Right: water boiling over a flame with a thermometer reading 100 °C.">
    <Lines x={270} y={34} anchor="middle" lines={['pure water: melts at 0 °C, boils at 100 °C']} size={15} />
    {/* melting */}
    <Beaker x={50} y={96} w={120} h={120} level={.5}>
      {[[70, 150, -8], [104, 144, 10], [136, 152, -4]].map(([x, y, a], i) => <rect key={i} x={x - 14} y={y - 14} width={28} height={26} rx="7" fill="#eef7fd" stroke="#8fb9d9" strokeWidth="1.6" transform={`rotate(${a} ${x} ${y})`} />)}
      <Thermometer x={150} top={64} bulb={196} reading={176} />
    </Beaker>
    <Badge x={110} y={250} text="melts: 0 °C" colour={pureLine} fill="#e6f0f8" />
    <text x={110} y={284} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>ice melting</text>
    {/* boiling */}
    <Beaker x={330} y={96} w={120} h={104} level={.7}>
      {[[360, 176], [384, 158], [406, 182], [372, 140], [420, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 2 ? 5 : 6.5} fill="white" stroke={waterLine} strokeWidth="1.4" />)}
      <Thermometer x={432} top={50} bulb={180} reading={70} />
    </Beaker>
    <path d="M352 82q-6 -8 0 -16t0 -16M390 84q-6 -8 0 -16t0 -16" stroke="#9cc0dd" strokeWidth="2.2" fill="none" />
    <Flame x={376} y={234} /><Flame x={394} y={238} s={1.2} /><Flame x={412} y={234} />
    <Badge x={390} y={262} text="boils: 100 °C" colour={thermoLine} fill="#fbe9e6" />
    <text x={390} y={292} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>water boiling</text>
  </Diagram>
}
function Book({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M0 10Q40 -2 80 10Q120 -2 160 10V130Q120 118 80 130Q40 118 0 130Z" fill={bookFill} stroke={bookLine} strokeWidth="2" />
    <path d="M80 10V130" stroke={bookLine} strokeWidth="1.6" />
    {[34, 50, 94, 110].map(yy => <path key={yy} d={`M12 ${yy}H68`} stroke="#e1d6b8" strokeWidth="3" />)}
    <text x={40} y={24} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>data book</text>
    <path d="M86 44H154V88H86Z" fill="#fdf1c9" stroke="none" />
    <text x={120} y={60} textAnchor="middle" fontSize="12" fontWeight="600" fill={ink}>melting point</text>
    <text x={120} y={80} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>136 °C</text>
  </g>
}
function Compare() {
  return <Diagram title="Comparing: a data book gives the melting point of the pure substance, 136 °C. A thermometer shows the melting point measured for the sample. The two values are compared.">
    <Book x={30} y={70} />
    <Lines x={110} y={236} anchor="middle" lines={['pure substance']} size={14} />
    <g>
      <rect x={368} y={206} width={86} height={34} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
      <text x={411} y={228} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>sample</text>
      <Thermometer x={411} top={52} bulb={206} reading={86} />
    </g>
    <Lines x={446} y={80} lines={['measured:', '134 °C']} size={14} colour={thermoLine} />
    <Leader from={[442, 90]} to={[418, 90]} colour={thermoLine} />
    <path d="M214 140H352" stroke={ink} strokeWidth="2.4" />
    <path d="M226 130L212 140L226 150M340 130L354 140L340 150" stroke={ink} strokeWidth="2.4" fill="none" />
    <text x={283} y={126} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>compare</text>
    <Caption text="Measure the sample, then look up the pure value" y={284} />
  </Diagram>
}
function Gap() {
  const x0 = 60, x1 = 480, t0 = 120, t1 = 140, X = (t: number) => r1(x0 + (t - t0) / (t1 - t0) * (x1 - x0))
  return <Diagram title="A temperature number line from 120 °C to 140 °C. The data book value for the pure substance is 136 °C. Sample A melts at 134 °C, close to it, so it is purer. Sample B melts at 125 °C, far away, so it is less pure.">
    <path d={`M${x0} 170H${x1}`} stroke={muted} strokeWidth="2" />
    {[120, 125, 130, 135, 140].map(t => <g key={t}><path d={`M${X(t)} 164V176`} stroke={muted} strokeWidth="1.6" /><text x={X(t)} y={196} textAnchor="middle" fontSize="12" fontWeight="600" fill={muted}>{t} °C</text></g>)}
    {/* data book value */}
    <path d={`M${X(136)} 170V84`} stroke={good} strokeWidth="2.4" strokeDasharray="5 5" />
    <circle cx={X(136)} cy={170} r={7} fill={good} />
    <Lines x={X(136)} y={60} anchor="middle" lines={['data book', '136 °C']} size={13} colour={good} />
    {/* sample A */}
    <circle cx={X(134)} cy={170} r={8} fill={thermo} stroke={thermoLine} strokeWidth="1.6" />
    <path d={`M${X(134)} 138H${X(136)}`} stroke={pureLine} strokeWidth="2" /><path d={`M${X(134)} 132V144M${X(136)} 132V144`} stroke={pureLine} strokeWidth="2" />
    <Lines x={X(134) - 10} y={122} anchor="end" lines={['A: 134 °C, small gap']} size={13} colour={pureLine} />
    <Badge x={X(134) - 6} y={232} text="purer" colour={good} fill="#e3f2e8" />
    <path d={`M${X(134)} 180V216`} stroke={good} strokeWidth="1.4" />
    {/* sample B */}
    <circle cx={X(125)} cy={170} r={8} fill={thermo} stroke={thermoLine} strokeWidth="1.6" />
    <path d={`M${X(125)} 104H${X(136)}`} stroke={impureLine} strokeWidth="2" /><path d={`M${X(125)} 98V110M${X(136)} 98V110`} stroke={impureLine} strokeWidth="2" />
    <Lines x={X(125) - 10} y={88} anchor="start" lines={['B: 125 °C, big gap']} size={13} colour={impureLine} />
    <Badge x={X(125)} y={232} text="less pure" colour={warn} fill="#fdf0e2" />
    <path d={`M${X(125)} 180V216`} stroke={warn} strokeWidth="1.4" />
    <Caption text="The closer to the data book value, the purer" y={284} />
  </Diagram>
}
/** Heating curve axes plus a pure and an impure line. kind = melting (impure lower) or boiling (impure higher). */
function Curve({ kind }: { kind: 'melting' | 'boiling' }) {
  const ox = 80, oy = 244, w = 300, h = 196
  const fixedY = kind === 'melting' ? 150 : 132
  const pure = `M${ox + 8} ${oy - 18}L${ox + 76} ${fixedY}H${ox + 176}L${ox + 236} ${oy - h + 26}`
  const impure = kind === 'melting'
    ? `M${ox + 8} ${oy - 12}L${ox + 64} ${fixedY + 36}Q${ox + 130} ${fixedY + 30} ${ox + 204} ${fixedY + 10}L${ox + 268} ${oy - h + 40}`
    : `M${ox + 8} ${oy - 30}L${ox + 88} ${fixedY - 18}Q${ox + 150} ${fixedY - 26} ${ox + 214} ${fixedY - 44}L${ox + 240} ${oy - h + 6}`
  const word = kind === 'melting' ? 'melting' : 'boiling'
  const title = kind === 'melting'
    ? 'Temperature against time while two samples are heated. The pure sample stays flat at one temperature while it melts. The impure sample starts melting at a lower temperature and its temperature keeps rising slowly, across a range.'
    : 'Temperature against time while two liquids are heated. Pure water stays flat at 100 °C while it boils. The impure liquid boils at a higher temperature, and its temperature keeps rising slowly, across a range.'
  return <Diagram title={title}>
    <path d={`M${ox} ${oy - h}V${oy}H${ox + w}`} stroke={muted} strokeWidth="2" fill="none" />
    <path d={`M${ox - 5} ${oy - h + 8}L${ox} ${oy - h}L${ox + 5} ${oy - h + 8}M${ox + w - 8} ${oy - 5}L${ox + w} ${oy}L${ox + w - 8} ${oy + 5}`} stroke={muted} strokeWidth="2" fill="none" />
    <text x={ox - 18} y={oy - h / 2} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted} transform={`rotate(-90 ${ox - 18} ${oy - h / 2})`}>temperature (°C)</text>
    <text x={ox + w / 2} y={oy + 24} textAnchor="middle" fontSize="13" fontWeight="600" fill={muted}>time</text>
    {kind === 'boiling' && <text x={ox + w - 8} y={fixedY - 6} textAnchor="end" fontSize="12" fontWeight="700" fill={pureLine}>100 °C</text>}
    <path d={`M${ox} ${fixedY}H${ox + w - 10}`} stroke={pureLine} strokeWidth="1" strokeDasharray="3 5" opacity=".6" />
    <path d={impure} stroke={impureLine} strokeWidth="3.4" fill="none" />
    <path d={pure} stroke={pureLine} strokeWidth="3.4" fill="none" />
    {kind === 'melting' ? <g>
      <Lines x={ox + 126} y={fixedY - 16} anchor="middle" lines={['pure: one temperature']} size={13} colour={pureLine} />
      <Lines x={ox + 150} y={fixedY + 60} anchor="middle" lines={['impure: lower,', 'across a range']} size={13} colour={impureLine} />
    </g> : <g>
      <Lines x={ox + 196} y={fixedY + 30} anchor="middle" lines={['pure water: one temperature']} size={13} colour={pureLine} />
      <Lines x={ox + 120} y={fixedY - 62} anchor="middle" lines={['impure: higher,', 'across a range']} size={13} colour={impureLine} />
    </g>}
    <g>
      <rect x={400} y={70} width={124} height={96} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
      <path d="M414 100h28" stroke={pureLine} strokeWidth="3.4" /><text x={450} y={105} fontSize="13" fontWeight="700" fill={ink}>pure</text>
      <path d="M414 136h28" stroke={impureLine} strokeWidth="3.4" /><text x={450} y={141} fontSize="13" fontWeight="700" fill={ink}>impure</text>
    </g>
    <Lines x={462} y={200} anchor="middle" lines={kind === 'melting' ? ['impurities', 'lower the', 'melting point'] : ['impurities', 'raise the', 'boiling point']} size={13} weight={600} colour={muted} />
    <Caption text={`Flat line while ${word}: one specific temperature`} y={292} />
  </Diagram>
}

// ---------- Section 3: formulations ----------
function MixDot({ cx, cy, r = 24, kinds }: { cx: number; cy: number; r?: number; kinds: string[][] }) {
  const pts = spread(cx, cy, r - 8, 7)
  return <g><circle cx={cx} cy={cy} r={r} fill="white" stroke="#7f9fb8" strokeWidth="2" />{pts.map(([x, y], i) => <P key={i} x={x} y={y} c={kinds[i % kinds.length]} r={4.6} />)}</g>
}
function CreamTube({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0H60L54 104Q52 110 46 110H14Q8 110 6 104Z" fill="#eef4fb" stroke="#6f93b3" strokeWidth="2" />
    <rect x={18} y={110} width={24} height={16} rx="4" fill="#b8cde0" stroke="#6f93b3" strokeWidth="2" />
    <path d="M-2 0H62" stroke="#6f93b3" strokeWidth="4" />
    <path d="M14 36H46M14 48H40" stroke="#b8cde0" strokeWidth="3" />
  </g>
}
function PaintTin({ x, y, colour = pigment, lid = false }: { x: number; y: number; colour?: string[]; lid?: boolean }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M0 8Q0 0 8 0H76Q84 0 84 8V88Q84 96 76 96H8Q0 96 0 88Z" fill="#dfe5ea" stroke="#66737e" strokeWidth="2" />
    <path d="M0 14H84" stroke="#66737e" strokeWidth="1.6" />
    <rect x={12} y={34} width={60} height={36} rx="8" fill={colour[0]} stroke={colour[1]} strokeWidth="1.6" />
    {lid && <path d="M-4 -2Q-4 -8 4 -8H80Q88 -8 88 -2V2H-4Z" fill="#c9d1d8" stroke="#66737e" strokeWidth="1.8" />}
  </g>
}
function Blister({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width={96} height={70} rx="10" fill="#e9edf0" stroke="#7f8c97" strokeWidth="2" />
    {[0, 1, 2].flatMap(i => [0, 1].map(j => <ellipse key={`${i}${j}`} cx={20 + i * 28} cy={20 + j * 30} rx={10} ry={8} fill="white" stroke="#9aa7b2" strokeWidth="1.6" />))}
  </g>
}
function Formulation() {
  return <Diagram title="Three formulations: hand cream, paint and medicine tablets. Each is a mixture of several substances designed for a particular job.">
    <CreamTube x={70} y={58} />
    <MixDot cx={150} cy={78} kinds={[pWater, pSugar, pSpeck]} />
    <text x={100} y={226} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>hand cream</text>
    <PaintTin x={228} y={96} lid />
    <MixDot cx={330} cy={78} kinds={[pigment, pWater, [binder, '#8a6440']]} />
    <text x={270} y={226} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>paint</text>
    <Blister x={392} y={122} />
    <MixDot cx={486} cy={100} kinds={[pSolid, pFlavour, pSpeck]} />
    <text x={440} y={226} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>medicine</text>
    <Caption text="Mixtures designed for a job" y={272} />
  </Diagram>
}
function Balance({ x, y, reading }: { x: number; y: number; reading: string }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M0 34Q0 26 8 26H112Q120 26 120 34V58Q120 64 114 64H6Q0 64 0 58Z" fill="#e5eaee" stroke="#66737e" strokeWidth="2" />
    <rect x={30} y={36} width={60} height={20} rx="4" fill="#dff1e6" stroke={good} strokeWidth="1.4" />
    <text x={60} y={51} textAnchor="middle" fontSize="13" fontWeight="700" fill={good}>{reading}</text>
    <path d="M14 20Q60 14 106 20V26H14Z" fill="#cfd8df" stroke="#66737e" strokeWidth="1.8" />
    <path d="M36 20Q34 -4 60 -6Q86 -4 84 20Z" fill={glass} stroke={glassLine} strokeWidth="2" />
    <path d="M38 16Q60 6 82 16Q82 20 80 20H40Q38 20 38 16Z" fill={water} />
  </g>
}
function Recipe() {
  return <Diagram title="A formula is a recipe. The card lists three parts of a hand cream with exact amounts: water 60 g, oil 30 g and wax 10 g. Each part is measured on a balance or with a spoon, then mixed to make the product.">
    <g>
      <rect x={20} y={40} width={150} height={172} rx="14" fill={bookFill} stroke={bookLine} strokeWidth="2" />
      <text x={95} y={70} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>formula</text>
      <path d="M40 80H150" stroke={bookLine} strokeWidth="1.4" />
      {([['water', '60 g', pWater], ['oil', '30 g', pSugar], ['wax', '10 g', pSolid]] as const).map(([n, a, c], i) => <g key={n}>
        <P x={46} y={108 + i * 34} c={c} r={7} />
        <text x={60} y={113 + i * 34} fontSize="14" fontWeight="600" fill={ink}>{n}</text>
        <text x={152} y={113 + i * 34} textAnchor="end" fontSize="14" fontWeight="700" fill={ink}>{a}</text>
      </g>)}
    </g>
    <Balance x={212} y={96} reading="60 g" />
    <g transform="translate(222 208)">
      <path d="M0 8Q0 -6 18 -6Q34 -6 34 8Q34 18 18 18Q0 18 0 8Z" fill="#e5eaee" stroke="#66737e" strokeWidth="2" />
      <path d="M34 6H96" stroke="#66737e" strokeWidth="5" />
      <path d="M6 6Q18 0 30 6Q28 12 18 13Q8 12 6 6Z" fill={pSolid[0]} />
    </g>
    <Lines x={274} y={82} anchor="middle" lines={['measure each part']} size={13} weight={600} colour={muted} />
    <Arrow from={[352, 150]} to={[400, 150]} width={2.6} />
    {/* finished jar */}
    <g>
      <path d="M412 128Q412 120 420 120H500Q508 120 508 128V206Q508 216 498 216H422Q412 216 412 206Z" fill="#f6f8fb" stroke="#6f93b3" strokeWidth="2" />
      <rect x={408} y={104} width={104} height={20} rx="7" fill="#b8cde0" stroke="#6f93b3" strokeWidth="2" />
      <path d="M422 150Q460 138 498 150V200Q498 206 492 206H428Q422 206 422 200Z" fill="#fbf4ea" />
      <text x={460} y={180} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>cream</text>
    </g>
    <Caption text="Exact amounts of each part, every time" y={272} />
  </Diagram>
}
function Properties() {
  return <Diagram viewBox="0 0 540 320" title="Two tins of paint. Made with the right amounts, the paint spreads smoothly and evenly. Made with too much solvent, it is too runny and drips down the wall.">
    {/* left: right amounts */}
    <rect x={40} y={36} width={200} height={132} rx="14" fill="#fbfaf7" stroke={panelLine} strokeWidth="1.6" />
    <path d="M60 70Q120 62 212 70V112Q120 104 60 112Z" fill={pigment[0]} stroke={pigment[1]} strokeWidth="1.4" />
    <PaintTin x={98} y={182} />
    <path d="M206 46l8 8l16 -18" stroke={good} strokeWidth="3.4" fill="none" />
    <Lines x={140} y={150} anchor="middle" lines={['smooth, even coat']} size={13} weight={600} colour={muted} />
    {/* right: too much solvent */}
    <rect x={300} y={36} width={200} height={132} rx="14" fill="#fbfaf7" stroke={panelLine} strokeWidth="1.6" />
    <path d="M320 70Q380 62 472 70V92Q466 96 462 92V124Q456 132 450 124V96Q420 98 410 96V140Q404 148 398 140V100Q370 102 360 98V118Q354 126 348 118V96Q332 96 320 92Z" fill="#f6c4b7" stroke={pigment[1]} strokeWidth="1.4" />
    <Lines x={400} y={160} anchor="middle" lines={['runs and drips']} size={13} weight={600} colour={muted} />
    <PaintTin x={358} y={182} colour={['#f6c4b7', pigment[1]]} />
    <Badge x={140} y={20} text="right amounts" colour={good} fill="#e3f2e8" />
    <Badge x={400} y={20} text="too much solvent" colour={warn} fill="#fdf0e2" />
    <Caption text="Right amounts give the right properties" y={308} />
  </Diagram>
}
const PAINT_KEY: { n: number; name: string; job: string[]; colour: string }[] = [
  { n: 1, name: 'pigment', job: ['gives the colour'], colour: pigment[1] },
  { n: 2, name: 'solvent', job: ['dissolves the parts,', 'makes it runny'], colour: waterLine },
  { n: 3, name: 'binder', job: ['holds the pigment', 'on the surface'], colour: '#8a6440' },
  { n: 4, name: 'additives', job: ['change the', 'properties'], colour: '#66737e' },
]
function Paint() {
  const pts = spread(212, 150, 74, 26)
  const role = (i: number) => (i % 5 === 1 ? 'pig' : i % 7 === 3 ? 'add' : i % 4 === 2 ? 'bind' : 'pig')
  const d2 = (a: Pt, x: number, y: number) => (a[0] - x) ** 2 + (a[1] - y) ** 2
  const near = (r: string, x: number, y: number): Pt => pts.filter((_, i) => role(i) === r).reduce((b, p) => d2(p, x, y) < d2(b, x, y) ? p : b)
  // the solvent pointer ends on a clear patch of liquid in the lower-left of the view
  const cands: Pt[] = []
  for (let gx = 150; gx <= 212; gx += 4) for (let gy = 160; gy <= 214; gy += 4) if (d2([gx, gy], 212, 150) < 70 * 70) cands.push([gx, gy])
  const gap = cands.reduce((b, c) => Math.min(...pts.map(p => d2(p, c[0], c[1]))) > Math.min(...pts.map(p => d2(p, b[0], b[1]))) ? c : b)
  return <Diagram title="Paint is a formulation with four parts. A magnified view of the paint shows: 1 pigment particles, which give the colour; 2 the solvent, which dissolves the other parts and makes the paint runny; 3 binder, which holds the pigment on the surface; 4 additives, which change the properties.">
    <PaintTin x={18} y={120} lid />
    <Magnifier cx={212} cy={150} r={86} from={[76, 170]}>
      <rect x={120} y={60} width={190} height={190} fill={water} />
      {pts.map(([x, y], i) => {
        const r = role(i)
        if (r === 'bind') return <path key={i} d={`M${x - 11} ${y + 3}q5 -8 11 -3t11 -3`} stroke={binder} strokeWidth="3.4" fill="none" />
        if (r === 'add') return <path key={i} d={`M${x} ${y - 6}L${x + 6} ${y}L${x} ${y + 6}L${x - 6} ${y}Z`} fill={additive[0]} stroke={additive[1]} strokeWidth="1.4" />
        return <P key={i} x={x} y={y} c={pigment} r={7} />
      })}
    </Magnifier>
    {/* pointers to one of each */}
    {([[1, 160, 44, near('pig', 160, 44)], [2, 120, 250, gap], [3, 300, 250, near('bind', 300, 250)], [4, 302, 52, near('add', 302, 52)]] as [number, number, number, Pt][]).map(([n, x, y, to]) => <g key={n}>
      <path d={`M${x} ${y}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
      <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{n}</text>
    </g>)}
    {PAINT_KEY.map(({ n, name, job, colour }, i) => <g key={n}>
      <circle cx={344} cy={48 + i * 62} r="12" fill={colour} /><text x={344} y={53 + i * 62} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">{n}</text>
      <text x={364} y={53 + i * 62} fontSize="15" fontWeight="700" fill={colour}>{name}</text>
      <Lines x={364} y={71 + i * 62} lines={job} size={13} weight={600} colour={ink} />
    </g>)}
  </Diagram>
}
function Icon({ kind }: { kind: string }) {
  const line = '#66737e'
  switch (kind) {
    case 'spray': return <g><path d="M-14 -6H10V30Q10 36 4 36H-8Q-14 36 -14 30Z" fill="#dff1e6" stroke={good} strokeWidth="2" /><path d="M-8 -6V-16H8L16 -12V-8H4V-6" fill="#cfd8df" stroke={line} strokeWidth="2" /><path d="M22 -14l8 -4M22 -10h9M22 -6l8 4" stroke="#9cc0dd" strokeWidth="2" /></g>
    case 'fuel': return <g><path d="M-18 -10Q-18 -18 -10 -18H10L18 -10V30Q18 36 12 36H-12Q-18 36 -18 30Z" fill="#f5c9a4" stroke={warn} strokeWidth="2" /><path d="M-10 -18V-24H2V-18" fill="none" stroke={warn} strokeWidth="2" /><path d="M-4 4q-7 10 0 15q7 -5 0 -15z" fill={flameOut} stroke={heatLine} strokeWidth="1.3" /></g>
    case 'medicine': return <g><rect x={-15} y={-8} width={30} height={44} rx="7" fill="#fbf4ea" stroke={line} strokeWidth="2" /><rect x={-17} y={-18} width={34} height={12} rx="4" fill="#f2a9bd" stroke="#c0587a" strokeWidth="2" /><path d="M-5 14h10M0 9v10" stroke="#c0587a" strokeWidth="2.6" /></g>
    case 'cosmetics': return <g><path d="M-18 8Q-18 2 -12 2H12Q18 2 18 8V30Q18 36 12 36H-12Q-18 36 -18 30Z" fill="#f7e6ee" stroke="#c0587a" strokeWidth="2" /><rect x={-20} y={-8} width={40} height={12} rx="5" fill="#f2a9bd" stroke="#c0587a" strokeWidth="2" /></g>
    case 'fertiliser': return <g><path d="M-18 -14Q0 -20 18 -14L22 32Q0 40 -22 32Z" fill="#efe3c8" stroke="#a87c38" strokeWidth="2" /><path d="M0 22V4M0 12q-10 -2 -10 -10q10 0 10 10M0 8q8 -2 9 -10q-9 0 -9 10" stroke={good} strokeWidth="2" fill="#bfe3c9" /></g>
    case 'alloy': return <g><path d="M-22 22L-14 0H14L22 22Z" fill="#dfe3e7" stroke={line} strokeWidth="2" /><path d="M-14 0L-6 -14H22L14 0" fill="#eceff2" stroke={line} strokeWidth="2" /><path d="M22 22L30 8V-14" fill="none" stroke={line} strokeWidth="2" /><path d="M-22 22H22" stroke={line} strokeWidth="2" /><path d="M-6 -20l24 0" stroke="none" /></g>
    default: return <g><path d="M-16 -12H16L12 32Q12 36 8 36H-8Q-12 36 -12 32Z" fill="#fdf1dd" stroke={warn} strokeWidth="2" /><path d="M-15 0H15L13 30H-13Z" fill="#f7b98a" opacity=".8" /><path d="M4 -12L10 -26" stroke="#c0587a" strokeWidth="3" /></g>
  }
}
function Everywhere() {
  const items: [string, string[]][] = [['spray', ['cleaning', 'products']], ['fuel', ['fuels']], ['medicine', ['medicines']], ['cosmetics', ['cosmetics']], ['fertiliser', ['fertilisers']], ['alloy', ['alloys']], ['food', ['food and', 'drink']]]
  const pos: Pt[] = [[80, 56], [200, 56], [320, 56], [440, 56], [140, 196], [260, 196], [380, 196]]
  return <Diagram viewBox="0 0 540 330" title="Formulations all around us: cleaning products, fuels, medicines, cosmetics, fertilisers, metal alloys, and food and drink.">
    {items.map(([k, label], i) => <g key={k}>
      <circle cx={pos[i][0]} cy={pos[i][1] + 10} r={40} fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
      <g transform={`translate(${pos[i][0]} ${pos[i][1]})`}><Icon kind={k} /></g>
      <Lines x={pos[i][0]} y={pos[i][1] + 68} anchor="middle" lines={label} size={13} />
    </g>)}
    <Caption text="All formulations: mixtures made to a recipe" y={318} />
  </Diagram>
}

// ---------- Question visual ----------
function MeltingQuestion({ assessment }: { assessment: boolean }) {
  const x0 = 70, x1 = 470, t0 = 110, t1 = 130, X = (t: number) => r1(x0 + (t - t0) / (t1 - t0) * (x1 - x0))
  return <Diagram viewBox="0 0 540 250" title={assessment
    ? 'A small table and number line comparing the melting range of a sample with a data book value.'
    : 'The sample melts across a range, from 118 °C to 124 °C, lower than the data book value of 128 °C, so it contains impurities.'}>
    <rect x={40} y={20} width={460} height={96} rx="14" fill={panelFill} stroke={panelLine} strokeWidth="1.6" />
    <path d="M40 68H500M250 20V116" stroke={panelLine} strokeWidth="1.4" />
    <text x={145} y={50} textAnchor="middle" fontSize="15" fontWeight="700" fill={thermoLine}>sample</text>
    <text x={375} y={50} textAnchor="middle" fontSize="15" fontWeight="600" fill={ink}>melts from 118 °C to 124 °C</text>
    <text x={145} y={98} textAnchor="middle" fontSize="15" fontWeight="700" fill={good}>data book value</text>
    <text x={375} y={98} textAnchor="middle" fontSize="15" fontWeight="600" fill={ink}>melts at 128 °C</text>
    <path d={`M${x0} 190H${x1}`} stroke={muted} strokeWidth="2" />
    {[110, 115, 120, 125, 130].map(t => <g key={t}><path d={`M${X(t)} 184V196`} stroke={muted} strokeWidth="1.6" /><text x={X(t)} y={216} textAnchor="middle" fontSize="12" fontWeight="600" fill={muted}>{t} °C</text></g>)}
    <rect x={X(118)} y={180} width={X(124) - X(118)} height={20} rx="10" fill={thermo} stroke={thermoLine} strokeWidth="1.6" opacity=".9" />
    <text x={(X(118) + X(124)) / 2} y={170} textAnchor="middle" fontSize="13" fontWeight="700" fill={thermoLine}>sample</text>
    <circle cx={X(128)} cy={190} r={8} fill={good} />
    <text x={X(128)} y={170} textAnchor="middle" fontSize="13" fontWeight="700" fill={good}>data book</text>
    {!assessment && <Lines x={270} y={242} anchor="middle" lines={['lower, and across a range: impurities']} size={13} colour={warn} />}
  </Diagram>
}

export function PurityVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'pure-everyday') return <Everyday />
  if (focus === 'pure-chemistry') return <Chemistry />
  if (focus === 'pure-sort') return <Sort />
  if (focus === 'pure-impure') return <Impure />
  if (focus === 'pure-fixed') return <Fixed />
  if (focus === 'pure-compare') return <Compare />
  if (focus === 'pure-gap') return <Gap />
  if (focus === 'pure-melting') return <Curve kind="melting" />
  if (focus === 'pure-boiling') return <Curve kind="boiling" />
  if (focus === 'pure-formulation') return <Formulation />
  if (focus === 'pure-recipe') return <Recipe />
  if (focus === 'pure-properties') return <Properties />
  if (focus === 'pure-paint') return <Paint />
  if (focus === 'pure-everyday-formulations') return <Everywhere />
  if (focus === 'pure-q-melting') return <MeltingQuestion assessment={assessment} />
  return <Chemistry />
}

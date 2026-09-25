import { useId, type ReactNode } from 'react'

const ink = '#375a73', blue = '#55acd0', red = '#d99090', green = '#68ae92', purple = '#a68bd0', yellow = '#efc75d'

function Diagram({ title, children, viewBox = '0 0 540 250' }: { title: string; children: ReactNode; viewBox?: string }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{title}</title>{children}</svg></div>
}

function Arrow({ x1, y1, x2, y2, colour = purple }: { x1: number; y1: number; x2: number; y2: number; colour?: string }) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const points = [[x2, y2], [x2 - 10 * Math.cos(angle - .55), y2 - 10 * Math.sin(angle - .55)], [x2 - 10 * Math.cos(angle + .55), y2 - 10 * Math.sin(angle + .55)]]
  return <g fill={colour} stroke={colour} strokeWidth="3"><line x1={x1} y1={y1} x2={x2 - 5 * Math.cos(angle)} y2={y2 - 5 * Math.sin(angle)}/><polygon points={points.map(point => point.join(',')).join(' ')}/></g>
}

function Person({ x, y, colour = blue }: { x: number; y: number; colour?: string }) {
  return <g transform={`translate(${x} ${y})`} fill={colour} stroke={ink} strokeWidth="2"><circle cy="-27" r="14"/><path d="M-23 32Q-18-5 0-7Q18-5 23 32Z"/></g>
}

function Vessel({ focus, assessment }: { focus: string; assessment: boolean }) {
  const title = useId()
  const target = focus.includes('artery') ? 0 : focus.includes('vein') || focus === 'vessel-question' ? 1 : focus.includes('capillary') ? 2 : -1
  const rows = [
    { name: 'Artery', wall: 18, lumen: 21, note: 'thick wall · small lumen · high pressure' },
    { name: 'Vein', wall: 8, lumen: 31, note: 'thinner wall · wide lumen · valves' },
    { name: 'Capillary', wall: 3, lumen: 16, note: 'wall one cell thick · exchange' },
  ]
  return <div className="science-bio-model"><svg viewBox="0 0 540 205" role="img" aria-labelledby={title}><title id={title}>{assessment && focus === 'vessel-question' ? 'A blood vessel with a wide lumen, fairly thin wall and two pocket valves.' : 'Original cross-section comparison of an artery, vein and capillary, not to scale.'}</title>
    {rows.map((row, i) => <g key={row.name} opacity={target < 0 || target === i ? 1 : .25} transform={`translate(${95 + i * 175} 78)`}>
      <circle r={50} fill="#f8e7df" stroke={target === i ? purple : ink} strokeWidth={target === i ? 5 : 2}/><circle r={50 - row.wall} fill="#f8c8c6" stroke={red} strokeWidth="2"/><circle r={row.lumen} fill="#f7fbfd" stroke={ink} strokeWidth="2"/>
      {i === 1 && <><path d="M-24-5Q-4 2 0 24Q4 2 24-5" fill="none" stroke={ink} strokeWidth="4"/><path d="M-24 5Q-4-2 0-24Q4-2 24 5" fill="none" stroke={ink} strokeWidth="4"/></>}
      {!assessment && <><text y="-63" textAnchor="middle" fill={ink} fontSize="16" fontWeight="700">{row.name}</text><text y="78" textAnchor="middle" fill={ink} fontSize="11">{row.note}</text></>}
    </g>)}
  </svg></div>
}

function FlowRate({ example = false }: { example?: boolean }) {
  return <div className="science-bio-cards" aria-label={example ? 'Worked blood-flow example: 1,200 millilitres divided by 4 minutes equals 300 millilitres per minute.' : 'Rate of blood flow equals volume divided by time.'}>
    <div><strong>Rate of blood flow</strong></div><div><strong>=</strong></div><div><strong>volume ÷ time</strong>{example && <><br/>1,200 ÷ 4 = 300 ml/min</>}</div>
  </div>
}


/* ── Blood primitives ── */
/** Highlight the part being taught: the rest fades to 30%. */
const dim = (on: boolean) => (on ? 1 : .3)
/** Seeded irregular outline around an ellipse, smoothed with quadratic curves. */
function blobPath(cx: number, cy: number, rx: number, ry: number, ks: number[], rot = 0) {
  const pts = ks.map((k, i) => { const a = (i / ks.length) * Math.PI * 2 + rot; return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k] })
  const mid = (a: number[], b: number[]) => `${((a[0] + b[0]) / 2).toFixed(1)} ${((a[1] + b[1]) / 2).toFixed(1)}`
  return `M${mid(pts[pts.length - 1], pts[0])}` + pts.map((p, i) => `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${mid(p, pts[(i + 1) % pts.length])}`).join('') + 'Z'
}
function useSvgIds() { const t = useId(); return { t, u: t.replace(/[^a-zA-Z0-9_-]/g, '') } }
/** Face-on red blood cell: shading only (paler dimple), never an inner ring that could read as a nucleus. */
function RBC({ x, y, r = 11, rotate = 0, grad }: { x: number; y: number; r?: number; rotate?: number; grad: string }) {
  return <ellipse cx={x} cy={y} rx={r} ry={r * .62} transform={`rotate(${rotate} ${x} ${y})`} fill={`url(#${grad})`} stroke="#a8404d" strokeWidth="1"/>
}
function RBCGradient({ id }: { id: string }) {
  return <radialGradient id={id}><stop offset="0" stopColor="#f2b0ae"/><stop offset=".42" stopColor="#e58b8e"/><stop offset=".78" stopColor="#cc5b66"/><stop offset="1" stopColor="#b9434f"/></radialGradient>
}
function Lbl({ x, y, children, anchor = 'start', bold = false, size = 12.5, fill = ink }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end'; bold?: boolean; size?: number; fill?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fill={fill} fontSize={size} fontWeight={bold ? 700 : 400}>{children}</text>
}
function Leader({ d, to }: { d: string; to: [number, number] }) {
  return <><path d={d} fill="none" stroke="#657a89" strokeWidth="1.2"/><circle cx={to[0]} cy={to[1]} r="2.2" fill="#657a89"/></>
}
function Platelet({ x, y, s = 1, rotate = 0 }: { x: number; y: number; s?: number; rotate?: number }) {
  return <path transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`} d="M-6-3Q-4-7 1-6Q6-6 7-1Q8 4 3 5Q-1 8-5 5Q-8 1-6-3Z" fill="#f0cf73" stroke="#a47b26" strokeWidth="1.1"/>
}
function Bacterium({ x, y, rotate = 0, s = 1 }: { x: number; y: number; rotate?: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}><rect x="-12" y="-5.5" width="24" height="11" rx="5.5" fill="#9fcf93" stroke="#4d8a4e" strokeWidth="1.3"/><path d="M-12 0H-18M12 0H17" stroke="#4d8a4e" strokeWidth="1" strokeLinecap="round"/></g>
}

type RedFocus = 'all' | 'haemoglobin' | 'shape'
function RedCellVisual({ assessment, hi = 'all' }: { assessment: boolean; hi?: RedFocus }) {
  const face = dim(hi === 'all'), side = dim(hi === 'all' || hi === 'shape'), zoom = dim(hi === 'all' || hi === 'haemoglobin')
  const { t, u } = useSvgIds(), g = `${u}-rbc`
  const sidePath = 'M220 128C220 104 238 96 254 100C270 104 278 116 290 116C302 116 310 104 326 100C342 96 360 104 360 128C360 152 342 160 326 156C310 152 302 140 290 140C278 140 270 152 254 156C238 160 220 152 220 128Z'
  const hb = Array.from({ length: 22 }, (_, i) => [455 + Math.cos(i * 2.4) * (12 + (i * 7) % 34), 116 + Math.sin(i * 2.4) * (12 + (i * 7) % 34)])
  return <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}>
    <title id={t}>{assessment ? 'A biconcave blood component containing many carrier molecules and no nucleus.' : 'A red blood cell seen face-on and from the side. The side view shows a biconcave disc, thinner in the middle than at the rim, giving a large surface area. There is no nucleus. A zoomed-in circle shows the cell packed with haemoglobin molecules, some carrying oxygen.' + (hi === 'haemoglobin' ? ' The haemoglobin close-up is highlighted.' : hi === 'shape' ? ' The side view is highlighted.' : '')}</title>
    <defs><radialGradient id={g}><stop offset="0" stopColor="#f7c9c6"/><stop offset=".4" stopColor="#efadad"/><stop offset=".64" stopColor="#d9707a"/><stop offset=".87" stopColor="#c24f5c"/><stop offset="1" stopColor="#a93f4c"/></radialGradient>
      <linearGradient id={`${u}-side`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e27a80"/><stop offset=".5" stopColor="#c9525e"/><stop offset="1" stopColor="#a93f4c"/></linearGradient>
      <clipPath id={`${u}-zoom`}><circle cx="455" cy="116" r="54"/></clipPath></defs>
    {/* face view */}
    <circle opacity={face} cx="110" cy="124" r="64" fill={`url(#${g})`} stroke="#a8404d" strokeWidth="2.5"/>
    {/* side view: thick rim, thin centre */}
    <g opacity={side}><path d={sidePath} fill={`url(#${u}-side)`} stroke="#a8404d" strokeWidth="2.5"/></g>
    {/* zoom: haemoglobin inside the cell */}<g opacity={zoom}>
    <path d="M352 110L402 80M352 146L404 154" fill="none" stroke="#9fb2bd" strokeWidth="1.2" strokeDasharray="3 3"/>
    <circle cx="455" cy="116" r="54" fill="#f6d2cf" stroke="#a8404d" strokeWidth="2"/>
    <g clipPath={`url(#${u}-zoom)`}>{hb.map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${i * 40})`}>
      <path d="M-5-1Q-5-6 0-5Q5-6 5-1Q6 4 1 5Q-5 6-5-1Z" fill="#c24a5a" stroke="#8e2d3c" strokeWidth=".7"/>
      {i % 3 === 0 && <g fill="#087f83"><circle cx="7" cy="-4" r="2.4"/><circle cx="10.5" cy="-6.5" r="2.4"/></g>}
    </g>)}</g></g>
    {!assessment && <>
      <g opacity={face}><Lbl x={110} y={30} anchor="middle" bold>no nucleus</Lbl><Lbl x={110} y={45} anchor="middle" size={11.5}>more room for haemoglobin</Lbl>
      <Leader d="M110 50V118" to={[110, 118]}/></g>
      <g opacity={side}><Lbl x={290} y={50} anchor="middle" bold>biconcave disc</Lbl><Lbl x={290} y={65} anchor="middle" size={11.5}>thin centre: large surface area</Lbl>
      <Leader d="M290 70V114" to={[290, 116]}/></g>
      <g opacity={zoom}><Lbl x={455} y={196} anchor="middle" bold>haemoglobin</Lbl>
      <g fill="#087f83"><circle cx="428" cy="211" r="2.6"/><circle cx="432" cy="208" r="2.6"/></g><Lbl x={439} y={214} size={11.5}>= oxygen</Lbl></g>
      <Lbl x={110} y={220} anchor="middle" size={12} fill="#526976">face view</Lbl><Lbl x={290} y={188} anchor="middle" size={12} fill="#526976">side view</Lbl>
    </>}
  </svg></div>
}

type WhiteFocus = 'all' | 'engulf' | 'antibody'
function WhiteCellVisual({ hi = 'all' }: { hi?: WhiteFocus }) {
  const left = dim(hi !== 'antibody'), right = dim(hi !== 'engulf')
  const { t, u } = useSvgIds()
  const phago = 'M44 150C34 118 48 84 86 76C110 70 136 70 156 76C176 82 196 80 206 88C212 94 206 101 197 97C187 93 177 97 174 107C171 119 174 128 182 132C192 136 204 132 209 140C213 148 202 153 192 151C176 151 162 164 150 176C132 190 96 192 72 182C54 174 46 162 44 150Z'
  return <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}>
    <title id={t}>{`Two different kinds of white blood cell. Left: one white blood cell changes shape, wrapping around a bacterium to engulf it; a second bacterium is already inside the cell being digested. Right: a different white blood cell releases many small Y-shaped antibody molecules, which bind to matching bacteria and clump them together. Antibodies are molecules, not cells.` + (hi === 'engulf' ? ' The engulfing cell is highlighted.' : hi === 'antibody' ? ' The antibody-making cell is highlighted.' : '')}</title>
    <defs><marker id={`${u}-a`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10L2 5Z" fill={purple}/></marker></defs>
    <path d="M270 30V222" stroke="#d6e1e6" strokeWidth="2" strokeDasharray="5 5"/>
    <g opacity={left}><Lbl x={135} y={24} anchor="middle" bold size={14}>some engulf pathogens</Lbl>
    {/* engulfing white blood cell */}
    <path d={phago} fill="#dceef8" stroke={ink} strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M70 124Q66 104 84 102Q96 100 96 112Q106 104 114 114Q122 126 110 134Q100 144 88 138Q72 140 70 124Z" fill={purple} stroke="#7a62a8"/>
    <ellipse cx="138" cy="158" rx="17" ry="12" fill="#eef6fb" stroke="#8fb2c4" strokeWidth="1.2"/>
    <Bacterium x={138} y={158} rotate={-18} s={.75}/>
    <Bacterium x={190} y={115} rotate={90} s={.9}/>
    <Lbl x={82} y={46} anchor="middle" size={11.5}>cell changes shape</Lbl><Lbl x={82} y={59} anchor="middle" size={11.5}>to wrap around it</Lbl><Leader d="M136 52L203 87" to={[205, 89]}/>
    <Lbl x={214} y={176} size={11.5}>pathogen</Lbl><Lbl x={214} y={189} size={11.5}>digested</Lbl><Leader d="M212 180L154 162" to={[152, 160]}/>
    <Lbl x={135} y={222} anchor="middle" size={12}>engulf and digest</Lbl></g>
    {/* antibody-producing white cell */}<g opacity={right}>
    <Lbl x={405} y={24} anchor="middle" bold size={14}>others make antibodies</Lbl>
    <circle cx="336" cy="130" r="40" fill="#dceef8" stroke={ink} strokeWidth="2.5"/>
    <circle cx="332" cy="130" r="26" fill={purple} stroke="#7a62a8"/>
    {(() => { const Y = (x: number, y: number, r: number, k = 1) => <g transform={`translate(${x} ${y}) rotate(${r}) scale(${k})`} stroke={purple} strokeWidth="3" fill="none" strokeLinecap="round"><path d="M0 9V0M0 0L-6-7M0 0L6-7"/></g>
      return <>
        {Y(388, 104, 60)}{Y(396, 142, 110)}{Y(408, 124, 85)}
        <path d="M418 118H440" stroke={purple} strokeWidth="1.6" strokeDasharray="3 3" markerEnd={`url(#${u}-a)`}/>
        <Bacterium x={468} y={98} rotate={20}/><Bacterium x={486} y={124} rotate={-15}/><Bacterium x={462} y={152} rotate={35}/>
        {Y(478, 110, -150, .9)}{Y(474, 138, 190, .9)}{Y(452, 124, 100, .9)}{Y(496, 142, -70, .9)}
      </> })()}
    <Lbl x={336} y={196} anchor="middle" size={11.5}>white blood cell</Lbl>
    <Lbl x={440} y={196} size={11.5} fill="#5d4a86" bold>antibodies</Lbl><Lbl x={440} y={210} size={11.5}>(molecules)</Lbl>
    <Leader d="M444 184L410 132" to={[409, 128]}/>
    <Lbl x={405} y={232} anchor="middle" size={12}>antibodies bind to matching pathogens</Lbl></g>
  </svg></div>
}

function PlateletVisual() {
  const { t, u } = useSvgIds(), g = `${u}-rbc`
  const fibrin = 'M226 64C244 82 262 70 278 88M232 90C252 76 270 100 290 84M238 112C260 98 274 118 300 104M222 82C236 104 250 92 262 118M250 60C262 80 250 100 270 118M284 66C276 88 294 100 282 120M214 104C232 116 256 106 276 128M296 92C304 110 290 120 306 132'
  return <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}>
    <title id={t}>Lengthwise section of a blood vessel with a tear in its upper wall. Platelets have collected at the damaged wall, and a mesh of threads traps red blood cells to form a clot that plugs the gap. The clot reduces blood loss and helps stop microorganisms outside from entering.</title>
    <defs><RBCGradient id={g}/></defs>
    {/* outside tissue with microorganisms kept out */}
    <Bacterium x={330} y={30} rotate={-20} s={.9}/><Bacterium x={356} y={46} rotate={30} s={.9}/>
    <path d="M340 52L318 70" stroke="#687a87" strokeWidth="2"/><path d="M312 62L324 76" stroke="#b8434f" strokeWidth="2.6" strokeLinecap="round"/>
    {/* vessel wall with a tear */}
    <path d="M24 70H214L219 78L212 86L220 96H24Z" fill="#f2cfc3" stroke="#9b6461" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M516 70H314L308 79L316 87L310 96H516Z" fill="#f2cfc3" stroke="#9b6461" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M24 188H516V214H24Z" fill="#f2cfc3"/><path d="M24 188H516M24 214H516" stroke="#9b6461" strokeWidth="2"/>
    <path d="M24 96H516V188H24Z" fill="#fbe4e1"/>
    <path d="M24 96H220M310 96H516" fill="none" stroke="#c0676f" strokeWidth="2"/>
    {/* flowing cells */}
    {[[40, 112, 10], [150, 152, 25], [196, 128, -20], [380, 156, 15], [432, 174, -10], [480, 158, 30]].map(([x, y, r], i) => <RBC key={i} x={x} y={y} r={12} rotate={r} grad={g}/>)}
    {[[110, 160, 0], [350, 172, 40]].map(([x, y, r], i) => <Platelet key={i} x={x} y={y} rotate={r}/>)}
    {/* clot: platelets clumped at the tear, fibrin mesh trapping red cells */}
    <path d="M214 98C210 80 222 58 244 50C262 44 286 46 300 56C312 66 316 88 310 104C300 120 262 126 238 118C224 114 216 108 214 98Z" fill="#f7d9a4" fillOpacity=".55"/>
    {[[236, 72, 20], [264, 66, -30], [286, 80, 10], [248, 96, -20], [276, 102, 30]].map(([x, y, r], i) => <RBC key={i} x={x} y={y} r={10} rotate={r} grad={g}/>)}
    {[[222, 92, 10], [228, 80, 40], [300, 94, -30], [296, 72, 70], [258, 112, 0], [240, 110, 20], [290, 110, -50], [232, 64, 60], [292, 62, -10]].map(([x, y, r], i) => <Platelet key={i} x={x} y={y} rotate={r} s={1.05}/>)}
    <path d={fibrin} fill="none" stroke="#8a6db8" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M60 176H150" stroke="#b8434f" strokeWidth="3"/><path d="M150 176l-9-5v10Z" fill="#b8434f"/>
    <Lbl x={24} y={236} size={11.5} fill="#8a3f47">blood flow</Lbl>
    <Lbl x={24} y={30} bold>damaged vessel wall</Lbl><Leader d="M90 36L213 72" to={[214, 74]}/>
    <Lbl x={420} y={122} anchor="start" bold size={12}>mesh of threads</Lbl><Lbl x={420} y={136} size={11.5}>traps red blood cells</Lbl><Leader d="M416 118L306 105" to={[304, 104]}/>
    <Lbl x={120} y={128} anchor="end" bold size={12}>platelets</Lbl><Lbl x={120} y={142} anchor="end" size={11.5}>clump at the wound</Lbl><Leader d="M124 128L219 94" to={[221, 93]}/>
    <Lbl x={372} y={40} size={11.5}>microorganisms</Lbl><Lbl x={372} y={54} size={11.5}>kept out</Lbl>
    <Lbl x={270} y={236} anchor="middle" bold>the clot seals the wound</Lbl>
  </svg></div>
}

type PlasmaFocus = 'all' | 'useful' | 'waste'
function PlasmaVisual({ hi = 'all' }: { hi?: PlasmaFocus }) {
  const { t, u } = useSvgIds(), g = `${u}-rbc`
  const routes = [
    { from: 'small intestine', to: 'body cells', what: ['glucose +', 'amino acids'], sx: 64, dx: 150, c: '#c08a14', kind: 'useful' },
    { from: 'glands', to: 'target organs', what: ['hormones'], sx: 176, dx: 262, c: '#7a5aa6', kind: 'useful' },
    { from: 'body cells', to: 'lungs', what: ['carbon', 'dioxide'], sx: 288, dx: 374, c: '#5b7282', kind: 'waste' },
    { from: 'liver', to: 'kidneys', what: ['urea'], sx: 400, dx: 478, c: '#1f8a86', kind: 'waste' },
  ]
  return <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}>
    <title id={t}>{`A blood vessel filled with pale yellow plasma carrying red blood cells, a white blood cell and platelets. Four routes show dissolved substances entering the plasma and leaving further along: glucose and amino acids from the small intestine to body cells; hormones from glands to target organs; carbon dioxide from body cells to the lungs; urea from the liver to the kidneys.` + (hi === 'useful' ? ' The two useful-substance routes are highlighted.' : hi === 'waste' ? ' The two waste routes are highlighted.' : '')}</title>
    <defs><RBCGradient id={g}/>{routes.map((r, i) => <marker key={i} id={`${u}-m${i}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10L2 5Z" fill={r.c}/></marker>)}</defs>
    <path d="M10 104H530V150H10Z" fill="#fff3cf"/><path d="M10 104H530M10 150H530" stroke="#c9a85c" strokeWidth="2.5"/>
    {[[40, 128, 10], [112, 118, -20], [206, 136, 15], [322, 116, -10], [352, 138, 25], [444, 120, 5], [508, 138, -15]].map(([x, y, r], i) => <RBC key={i} x={x} y={y} r={10} rotate={r} grad={g}/>)}
    <circle cx="236" cy="124" r="11" fill="#dceef8" stroke={ink} strokeWidth="1.4"/><circle cx="235" cy="124" r="6" fill={purple}/>
    {[[84, 138, 0], [290, 138, 50], [466, 140, 20]].map(([x, y, r], i) => <Platelet key={i} x={x} y={y} rotate={r} s={.8}/>)}
    {routes.map((r, i) => <g key={i} opacity={dim(hi === 'all' || hi === r.kind)}>
      <rect x={r.sx - 52} y="10" width="104" height="26" rx="9" fill="#eef7fb" stroke={ink} strokeWidth="1.5"/>
      <Lbl x={r.sx} y={27} anchor="middle" size={11.5} bold>{r.from}</Lbl>
      <path d={`M${r.sx} 38V100`} stroke={r.c} strokeWidth="2.4" markerEnd={`url(#${u}-m${i})`}/>
      {r.what.map((w, k) => <Lbl key={k} x={r.sx + 6} y={62 + k * 13} size={11} fill={r.c} bold>{w}</Lbl>)}
      {[[r.sx - 6, 112], [r.sx + 5, 116], [r.dx - 5, 142], [r.dx + 6, 138]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="2.6" fill={r.c}/>)}
      <path d={`M${r.dx} 152V200`} stroke={r.c} strokeWidth="2.4" markerEnd={`url(#${u}-m${i})`}/>
      <rect x={r.dx - 50} y="204" width="100" height="26" rx="9" fill="#eef7fb" stroke={ink} strokeWidth="1.5"/>
      <Lbl x={r.dx} y={221} anchor="middle" size={11.5} bold>{r.to}</Lbl>
    </g>)}
    <Lbl x={14} y={96} size={11} fill="#8a6a1c" bold>plasma</Lbl>
    <path d="M14 162H66" stroke="#8a6a1c" strokeWidth="1.8"/><path d="M66 162l-7-4v8Z" fill="#8a6a1c"/><Lbl x={14} y={176} size={10.5} fill="#8a6a1c">blood flow</Lbl>
    <Lbl x={270} y={246} anchor="middle" size={11.5} fill="#526976">plasma: a pale liquid carrying cells, platelets and dissolved substances</Lbl>
  </svg></div>
}

/* A magnified drop of blood: pale plasma with red cells, one white cell and platelets floating in it.
   Assessment version swaps the labels for numbered markers: 1 red cell, 2 white cell, 3 platelets, 4 plasma. */
function BloodSample({ assessment }: { assessment: boolean }) {
  const { t, u } = useSvgIds(), g = `${u}-rbc`
  const field = blobPath(270, 128, 150, 92, [1, .95, 1.03, .97, 1.02, .94, 1.04, .96, 1.01, .97], .2)
  const cells: [number, number, number][] = [[160, 95, 20], [205, 70, -15], [252, 56, 30], [302, 60, 0], [356, 70, -25], [396, 104, 10], [174, 147, -30], [214, 114, 15], [266, 100, -10], [242, 152, 25], [290, 172, -5], [338, 162, 35], [392, 142, -15], [152, 121, 40], [212, 196, 12]]
  const platelets: [number, number, number][] = [[178, 186, 0], [191, 176, 50], [186, 194, 110], [330, 200, 30], [342, 192, -40]]
  const parts = [
    { n: 1, name: 'red blood cell', job: 'carries oxygen', lx: 112, ly: 66, side: 'end', d: 'M116 70L155 92', to: [158, 94] },
    { n: 2, name: 'white blood cell', job: 'defends the body', lx: 432, ly: 66, side: 'start', d: 'M428 70L351 102', to: [348, 104] },
    { n: 3, name: 'platelets', job: 'help blood clot', lx: 112, ly: 188, side: 'end', d: 'M116 190L175 186', to: [178, 186] },
    { n: 4, name: 'plasma', job: 'carries the rest', lx: 432, ly: 188, side: 'start', d: 'M428 190L370 188', to: [368, 188] },
  ] as const
  return <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}>
    <title id={t}>{assessment ? 'A magnified drop of blood with four parts numbered 1 to 4. Original schematic, not to scale.' : 'A magnified drop of blood. Most of it is pale yellow plasma. Floating in the plasma are many red blood cells, one larger white blood cell with a nucleus, and small platelets. Original schematic, not to scale.'}</title>
    <defs><RBCGradient id={g}/></defs>
    <path d={field} fill="#fff3cf" stroke="#c9a85c" strokeWidth="2.5"/>
    {cells.map(([x, y, r], i) => <RBC key={i} x={x} y={y} r={13} rotate={r} grad={g}/>)}
    <path d={blobPath(328, 118, 27, 26, [1, .96, 1.04, .98, 1.02, .95, 1.03, .99], .4)} fill="#dceef8" stroke={ink} strokeWidth="2"/>
    <path d="M314 112Q312 100 324 101Q332 102 330 110Q338 104 344 112Q348 122 338 126Q334 136 322 132Q312 128 316 120Q310 118 314 112Z" fill={purple} stroke="#7a62a8"/>
    {platelets.map(([x, y, r], i) => <Platelet key={i} x={x} y={y} rotate={r} s={.9}/>)}
    {parts.map(p => <g key={p.n}>
      <Leader d={p.d} to={p.to as unknown as [number, number]}/>
      {assessment
        ? <g><circle cx={p.side === 'end' ? 102 : 442} cy={p.ly + 4} r="11" fill="#fff" stroke={ink} strokeWidth="2"/><Lbl x={p.side === 'end' ? 102 : 442} y={p.ly + 8.5} anchor="middle" bold>{p.n}</Lbl></g>
        : <><Lbl x={p.lx} y={p.ly} anchor={p.side} bold>{p.name}</Lbl><Lbl x={p.lx} y={p.ly + 15} anchor={p.side} size={11.5} fill="#526976">{p.job}</Lbl></>}
    </g>)}
    <Lbl x={270} y={244} anchor="middle" size={11} fill="#526976">magnified · original schematic, not to scale</Lbl>
  </svg></div>
}

function Blood({ focus, assessment }: { focus: string; assessment: boolean }) {
  if (focus === 'blood-components') return <BloodSample assessment={assessment}/>
  if (focus === 'blood-red-cell' || focus === 'blood-red-question') return <RedCellVisual assessment={assessment}/>
  if (focus === 'blood-red-haemoglobin') return <RedCellVisual assessment={assessment} hi="haemoglobin"/>
  if (focus === 'blood-red-shape') return <RedCellVisual assessment={assessment} hi="shape"/>
  if (focus === 'blood-white-cell') return <WhiteCellVisual/>
  if (focus === 'blood-white-engulf') return <WhiteCellVisual hi="engulf"/>
  if (focus === 'blood-white-antibody') return <WhiteCellVisual hi="antibody"/>
  if (focus === 'blood-platelet') return <PlateletVisual/>
  if (focus === 'blood-plasma') return <PlasmaVisual/>
  if (focus === 'blood-plasma-useful') return <PlasmaVisual hi="useful"/>
  if (focus === 'blood-plasma-waste') return <PlasmaVisual hi="waste"/>
  return <PlasmaVisual/>
}


/* Lengthwise section of a coronary artery. Fatty material builds up inside the wall, under the inner lining,
   and bulges into the lumen; it is never a loose plug. With a stent, the same deposit is pressed back into the wall. */

/* External front view of the heart: coronary arteries branch from the base of the aorta and run over the outside
   of the heart, tapering as they divide into the muscle. The person's right is on the viewer's left. */
function CoronarySupply({ assessment }: { assessment: boolean }) {
  const titleId = useId(), u = titleId.replace(/[^a-zA-Z0-9_-]/g, '')
  const heart = 'M132 100C150 80 196 76 226 84C262 76 300 90 306 122C314 160 290 196 238 212C228 215 220 216 214 212C170 196 132 170 124 136C120 120 124 108 132 100Z'
  const tube = (d: string, colour: 'red' | 'blue', w: number) => <g fill="none" strokeLinecap="round"><path d={d} stroke={colour === 'red' ? '#9d4d55' : '#4c718c'} strokeWidth={w + 4}/><path d={d} stroke={colour === 'red' ? '#e2848a' : '#9cc3da'} strokeWidth={w}/><path d={d} stroke="#fff" strokeOpacity=".28" strokeWidth={w * .35}/></g>
  const stem = 'M212 102C224 106 236 108 248 110'
  const main = 'M202 100C184 108 160 112 146 124C134 136 131 152 136 168M248 110C248 134 238 166 226 206M248 110C270 110 290 116 304 134'
  const branches = 'M146 124C162 142 176 156 188 178M139 150C150 164 158 176 164 190M245 136C258 144 268 152 280 168M238 164C250 172 258 182 264 196M272 112C276 126 280 138 292 150'
  const twigs = 'M188 178L196 190M188 178L180 188M280 168L288 178M280 168L272 180M164 190L170 198M264 196L270 203M226 206L220 210M226 206L232 209M292 150L300 158'
  const t = { fill: ink, fontSize: 12.5 }
  return <div className="science-bio-model"><svg viewBox="0 0 420 246" role="img" aria-labelledby={titleId}>
    <title id={titleId}>External front view of a heart. Large blood vessels leave the top, including the arching aorta. Two coronary arteries branch from the base of the aorta and run over the outside of the heart, dividing into smaller and smaller branches that supply the heart muscle with oxygenated blood. Veins are omitted; not to scale.</title>
    <defs>
      <linearGradient id={`${u}-m`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#eeb3a8"/><stop offset=".6" stopColor="#d7867f"/><stop offset="1" stopColor="#bf6c6c"/></linearGradient>
      <pattern id={`${u}-f`} width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)"><path d="M0 0V11" stroke="#8f4f50" strokeOpacity=".16" strokeWidth="1.4"/></pattern>
    </defs>
    {/* Great vessels (behind the heart outline where they enter) */}
    {tube('M156 104V34', 'blue', 20)}
    {tube('M224 36L222 18M246 29L250 12M268 32L278 17', 'red', 7)}
    {tube('M292 46C300 58 300 72 297 90', 'red', 22)}
    <path d={heart} fill={`url(#${u}-m)`} stroke="#944f55" strokeWidth="2.5"/>
    <path d={heart} fill={`url(#${u}-f)`}/>
    <path d="M140 118C170 124 210 118 238 110C262 104 284 108 300 120" fill="none" stroke="#b36a6a" strokeWidth="1.2" strokeOpacity=".6"/>
    {/* Aorta leaves the top of the heart; its root is visible so the coronary origins sit on it */}
    {tube('M206 102C204 72 202 50 220 38C238 26 276 28 292 46', 'red', 22)}
    <g fill="none" strokeLinecap="round" stroke="#b3303f"><path d={stem} strokeWidth="5.5"/></g>
    {/* Pulmonary trunk: to the viewer's right of the aortic root, passing in front of the left coronary stem */}
    {tube('M240 112C246 92 256 80 274 74L290 74', 'blue', 20)}
    {/* Coronary arteries: pale halo so they read as vessels lying on the surface, then tapering red */}
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" stroke="#f6d6cd">
      <path d={main} strokeWidth="10"/><path d={branches} strokeWidth="7"/><path d={twigs} strokeWidth="4.5"/>
    </g>
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" stroke="#b3303f">
      <path d={main} strokeWidth="5.5"/><path d={branches} strokeWidth="3.5"/><path d={twigs} strokeWidth="2"/>
    </g>
    <circle cx="202" cy="100" r="4" fill="#b3303f" stroke="#fff" strokeWidth="1"/><circle cx="212" cy="102" r="4" fill="#b3303f" stroke="#fff" strokeWidth="1"/>
    {!assessment && <>
      <text x="316" y="28" {...t} fontWeight="700">aorta</text><path d="M314 32L294 42" stroke="#657a89"/><circle cx="296" cy="44" r="2" fill="#657a89"/>
      <text x="322" y="150" {...t} fontWeight="700">coronary</text><text x="322" y="165" {...t} fontWeight="700">arteries</text>
      <path d="M320 146L300 134" stroke="#657a89"/><circle cx="300" cy="134" r="2" fill="#657a89"/>
      <path d="M320 160L280 168" stroke="#657a89"/><circle cx="280" cy="168" r="2" fill="#657a89"/>
      <text x="16" y="186" {...t} fontWeight="700">heart muscle</text><text x="16" y="201" {...t} fontSize={11.5}>needs oxygen for</text><text x="16" y="215" {...t} fontSize={11.5}>respiration</text>
      <path d="M92 210L204 202" stroke="#657a89"/><circle cx="204" cy="202" r="2" fill="#657a89"/>
      <text x="210" y="240" textAnchor="middle" fill={ink} fontSize="13">coronary arteries supply the heart muscle</text>
    </>}
  </svg></div>
}

function CoronaryArtery({ stent, assessment }: { stent: boolean; assessment: boolean }) {
  const titleId = useId(), u = titleId.replace(/[^a-zA-Z0-9_-]/g, '')
  const dip = stent ? 66 : 92, rise = stent ? 125 : 118
  const lumen = `M22 60H170C195 60 205 ${dip} 235 ${dip}C265 ${dip} 280 60 305 60H448V130H275C262 130 252 ${rise} 235 ${rise}C218 ${rise} 208 130 195 130H22Z`
  const liningTop = `M22 60H170C195 60 205 ${dip} 235 ${dip}C265 ${dip} 280 60 305 60H448`
  const liningBot = `M22 130H195C208 130 218 ${rise} 235 ${rise}C252 ${rise} 262 130 275 130H448`
  const plaqueTop = `M165 60C180 52 205 49 235 49C265 49 292 52 310 60H305C280 60 265 ${dip} 235 ${dip}C205 ${dip} 195 60 170 60Z`
  const plaqueBot = `M190 130C205 136 220 139 235 139C250 139 268 136 282 130H275C262 130 252 ${rise} 235 ${rise}C218 ${rise} 208 130 195 130Z`
  const cells = stent ? [[40, 78], [66, 108], [92, 84], [120, 114], [146, 90], [184, 110], [214, 80], [252, 106], [288, 84], [330, 110], [360, 82], [392, 112], [420, 88]]
    : [[36, 76], [40, 112], [68, 78], [96, 106], [104, 72], [134, 108], [150, 80], [162, 114], [222, 104], [352, 110], [428, 74]]
  const muscleFill = (downstream: boolean) => downstream && !stent ? '#f3dcd6' : '#dd9a93'
  const t = { fill: ink, fontSize: 12.5 }
  return <div className="science-bio-model"><svg viewBox="0 0 470 236" role="img" aria-labelledby={titleId}>
    <title id={titleId}>{stent
      ? 'Lengthwise section of a coronary artery. A mesh stent sits against the artery wall where fatty material had built up, pressing the deposit back into the wall and holding the lumen wide open. Blood flows through normally and reaches the heart muscle beyond. Not to scale.'
      : 'Lengthwise section of a coronary artery. Fatty material has built up inside the artery wall, under the inner lining, and bulges inwards, so the lumen is much narrower at that point. Fewer blood cells pass the narrowing, and the heart muscle beyond it receives less blood and oxygen. Not to scale.'}</title>
    <defs>
      <marker id={`${u}-a`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10L2 5Z" fill="#b8434f"/></marker>
      <pattern id={`${u}-fibre`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)"><path d="M0 0V10" stroke="#9b5552" strokeOpacity=".22" strokeWidth="1.4"/></pattern>
    </defs>
    {/* Heart muscle the artery supplies */}
    <path d="M22 160Q120 156 235 160T448 158V194Q340 199 235 195T22 196Z" fill={muscleFill(false)}/>
    {!stent && <path d="M300 159Q380 156 448 158V194Q380 197 300 196Z" fill={muscleFill(true)}/>}
    <path d="M22 160Q120 156 235 160T448 158V194Q340 199 235 195T22 196Z" fill={`url(#${u}-fibre)`} stroke="#a8625f" strokeWidth="1.5"/>
    {!stent && <path d="M300 159V196" stroke="#a8625f" strokeWidth="1.2" strokeDasharray="4 3"/>}

    {/* Artery wall, fatty deposits within it, then the blood-filled lumen with its inner lining */}
    <path d="M22 40Q235 34 448 40V150Q235 156 22 150Z" fill="#f2cfc3" stroke="#9b6461" strokeWidth="2"/>
    <g fill="#f1d27a" stroke="#b58a2c" strokeWidth="1.6"><path d={plaqueTop}/><path d={plaqueBot}/></g>
    {!stent && <g fill="#fbe9b4">{[[208, 60], [226, 70], [246, 58], [262, 68], [236, 80], [216, 131], [250, 130]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 2 ? 3 : 4}/>)}</g>}
    <path d={lumen} fill="#fbe4e1"/>
    <path d={liningTop} fill="none" stroke="#c0676f" strokeWidth="2"/><path d={liningBot} fill="none" stroke="#c0676f" strokeWidth="2"/>
    <ellipse cx="22" cy="95" rx="7" ry="55" fill="none" stroke="#9b6461" strokeWidth="1.5"/>
    {cells.map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${(i * 37) % 50 - 25})`}><ellipse rx="9" ry="5.5" fill="#c95e68" stroke="#a74454" strokeWidth=".8"/><ellipse rx="4" ry="2.2" fill="#e9a3a3"/></g>)}
    <path d="M44 95H150" stroke="#b8434f" strokeWidth="5" markerEnd={`url(#${u}-a)`}/>
    <path d={stent ? 'M324 95H430' : 'M334 95H414'} stroke="#b8434f" strokeWidth={stent ? 5 : 2} markerEnd={`url(#${u}-a)`}/>

    {stent && <g fill="none" stroke={purple} strokeWidth="2.4" strokeLinejoin="round">
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const x = 176 + i * 16; const top = (xx: number) => xx < 195 || xx > 280 ? 62 : 67; return <path key={i} d={`M${x} ${top(x)}L${x + 8} 95L${x} 124M${x + 8} 95L${x + 16} ${top(x + 16)}M${x + 8} 95L${x + 16} 124`}/> })}
      <path d="M176 62C200 64 214 67 235 67C256 67 272 64 304 62M176 125C200 124 214 123 235 123C256 123 272 124 304 125"/>
    </g>}

    {!assessment && <>
      <text x="22" y="25" {...t}>artery wall</text><path d="M48 29L60 42" stroke="#657a89"/><circle cx="60" cy="42" r="2" fill="#657a89"/>
      <text x="448" y="25" textAnchor="end" {...t}>inner lining</text><path d="M410 29L400 59" stroke="#657a89"/><circle cx="400" cy="59" r="2" fill="#657a89"/>
      {stent ? <><text x="235" y="18" textAnchor="middle" {...t} fontWeight="700" fill="#5d4a86">stent supports a wider lumen</text>
        <path d="M235 22V67" stroke="#657a89"/><circle cx="235" cy="67" r="2" fill="#657a89"/></>
      : <><text x="235" y="18" textAnchor="middle" {...t} fontWeight="700">fatty material builds up in the wall</text>
        <path d="M235 22V52" stroke="#657a89"/><circle cx="235" cy="52" r="2" fill="#657a89"/></>}
      <text x="60" y="126" {...t} fontSize={11.5} fill="#8a3f47">blood flow</text>
      {stent ? <text x="330" y="126" {...t} fontSize={11.5} fill="#8a3f47">flow restored</text>
        : <><text x="340" y="126" {...t} fontSize={11.5} fill="#8a3f47">less blood flow</text>
          <text x="320" y="80" {...t} fontSize={11.5}>narrowed lumen</text><path d="M318 76L262 100" stroke="#657a89"/><circle cx="262" cy="100" r="2" fill="#657a89"/></>}
      <text x="150" y="214" textAnchor="middle" {...t}>heart muscle</text>
      <text x="374" y="214" textAnchor="middle" {...t} fontWeight={stent ? 400 : 700}>{stent ? 'muscle keeps its' : 'less oxygen reaches'}</text>
      <text x="374" y="229" textAnchor="middle" {...t} fontWeight={stent ? 400 : 700}>{stent ? 'oxygen supply' : 'this muscle'}</text>
    </>}
  </svg></div>
}

function Coronary({ focus, assessment }: { focus: string; assessment: boolean }) {
  if (focus === 'cardio-heart') return <CoronarySupply assessment={assessment}/>
  if (focus === 'cardio-blockage' || focus === 'cardio-stent') return <CoronaryArtery stent={focus === 'cardio-stent'} assessment={assessment}/>
  if (focus === 'cardio-stent-balance') return <Diagram title="A stented coronary artery with benefits and possible risks shown on either side.">
    <rect x="150" y="76" width="240" height="92" rx="44" fill="#f5d4c9" stroke={ink} strokeWidth="3"/><rect x="150" y="101" width="240" height="42" rx="20" fill="#fff" stroke={red} strokeWidth="2"/>{Array.from({length:8},(_,i)=><g key={i} stroke={purple} strokeWidth="3"><line x1={205+i*18} y1="88" x2={223+i*18} y2="156"/><line x1={223+i*18} y1="88" x2={205+i*18} y2="156"/></g>)}
    <g fill={ink} fontSize="12" textAnchor="middle"><text x="73" y="74" fontWeight="700">benefits</text><text x="73" y="99">wider lumen</text><text x="73" y="118">quick recovery</text><text x="467" y="74" fontWeight="700">risks</text><text x="467" y="99">infection</text><text x="467" y="118">blood clot</text></g><Arrow x1={124} y1={113} x2={150} y2={113} colour={green}/><Arrow x1={416} y1={113} x2={390} y2={113} colour={red}/>
  </Diagram>
  if (focus.includes('treatment')) return <Diagram title={assessment ? 'Two cardiovascular treatments with different sites and timescales.' : 'A stent acts directly at one narrowing, while a statin lowers blood cholesterol over time.'}>
    <rect x="30" y="60" width="215" height="130" rx="20" fill="#eef7fb" stroke={ink} strokeWidth="2"/><rect x="295" y="60" width="215" height="130" rx="20" fill="#f3edf9" stroke={ink} strokeWidth="2"/><path d="M57 122H218" stroke={red} strokeWidth="32"/><path d="M57 122H218" stroke="white" strokeWidth="15"/>{Array.from({length:5},(_,i)=><path key={i} d={`M${108+i*17} 102L${124+i*17} 142M${124+i*17} 102L${108+i*17} 142`} stroke={purple} strokeWidth="3"/>)}<circle cx="367" cy="122" r="30" fill={yellow} stroke={ink} strokeWidth="2"/><rect x="391" y="100" width="58" height="44" rx="22" fill="#fff" stroke={ink} strokeWidth="2"/>
    <g fill={ink} textAnchor="middle"><text x="137" y="89" fontSize="14" fontWeight="700">{assessment?'Treatment A':'stent'}</text><text x="137" y="172" fontSize="11">one narrowed artery · quick</text><text x="402" y="89" fontSize="14" fontWeight="700">{assessment?'Treatment B':'statin'}</text><text x="402" y="172" fontSize="11">whole bloodstream · long term</text></g>
  </Diagram>
  if (focus.includes('statin')) return <Diagram title="Statins lower blood cholesterol, slowing fatty deposit build-up and reducing cardiovascular risk over time.">
    <g fill="#eef7fb" stroke={ink} strokeWidth="2"><rect x="28" y="76" width="135" height="91" rx="18"/><rect x="203" y="76" width="135" height="91" rx="18"/><rect x="378" y="76" width="135" height="91" rx="18"/></g><circle cx="95" cy="111" r="20" fill={yellow} stroke={ink}/><path d="M72 141H118" stroke={red} strokeWidth="12"/><path d="M72 141H118" stroke="white" strokeWidth="5"/><path d="M223 139H318" stroke={red} strokeWidth="18"/><path d="M223 139H318" stroke="white" strokeWidth="9"/><path d="M415 139H476" stroke={red} strokeWidth="18"/><path d="M415 139H476" stroke="white" strokeWidth="13"/>
    <g fill={ink} textAnchor="middle"><text x="95" y="60" fontSize="13" fontWeight="700">statin taken regularly</text><text x="270" y="60" fontSize="13" fontWeight="700">lower cholesterol</text><text x="445" y="60" fontSize="13" fontWeight="700">slower build-up</text><text x="270" y="214" fontSize="12">benefit develops over time; side effects are possible</text></g><Arrow x1={164} y1={122} x2={201} y2={122}/><Arrow x1={339} y1={122} x2={376} y2={122}/>
  </Diagram>
  if (focus.includes('transplant') || focus.includes('artificial')) return <Diagram title={focus.includes('transplant') ? 'A donor heart transplant, with immune rejection and infection risks.' : 'An artificial heart pumping blood, with clot and bleeding risks.'}>
    <g opacity={focus.includes('transplant')?1:.25}><path d="M145 189C64 140 68 72 111 52Q149 35 169 73Q189 34 232 55Q281 88 240 142Q205 175 145 189Z" fill="#f3b0ad" stroke={ink} strokeWidth="3"/><path d="M163 68V28M190 72L214 25" stroke={red} strokeWidth="14"/></g>
    <g opacity={focus.includes('artificial')?1:.25}><path d="M359 187C294 150 294 82 333 57Q365 39 386 72Q409 40 443 62Q485 92 452 143Q417 174 359 187Z" fill="#d9e5ea" stroke={ink} strokeWidth="3"/><circle cx="386" cy="113" r="36" fill="#fff" stroke={purple} strokeWidth="6"/><path d="M386 77V36M418 92L460 55M354 92L322 56" stroke={purple} strokeWidth="12"/></g>
    <g fill={ink} fontSize="12" fontWeight="700" textAnchor="middle"><text x="160" y="221">donor tissue · rejection risk</text><text x="386" y="221">mechanical pump · clot risk</text></g>
  </Diagram>
  if (focus === 'cardio-valve-types') return <Diagram title="A flexible biological replacement valve beside a durable mechanical valve.">
    <g transform="translate(145 115)"><circle r="73" fill="#f7e5dd" stroke={ink} strokeWidth="4"/><path d="M-50 5Q-20-42 0 4Q20-42 50 5Q20 50 0 7Q-20 50-50 5Z" fill={red} stroke="#a8545d" strokeWidth="3"/></g><g transform="translate(395 115)"><circle r="73" fill="#dce7ec" stroke={ink} strokeWidth="4"/><circle r="44" fill="#fff" stroke={purple} strokeWidth="8"/><path d="M0-42V42M-42 0H42" stroke={ink} strokeWidth="6"/></g><g fill={ink} textAnchor="middle"><text x="145" y="215" fontSize="14" fontWeight="700">biological valve</text><text x="145" y="233" fontSize="11">tissue · flexible · may wear</text><text x="395" y="215" fontSize="14" fontWeight="700">mechanical valve</text><text x="395" y="233" fontSize="11">durable · clotting trade-off</text></g>
  </Diagram>
  return <div className="science-bio-model"><svg viewBox="0 0 460 170" role="img" aria-label="A healthy one-way valve beside stiff and leaky valve models.">{[['Healthy',60],['Stiff',220],['Leaky',380]].map(([name,x],i)=><g key={String(name)}><path d={`M${Number(x)-45} 30h90v110h-90Z`} fill="#e5f4f5" stroke={ink} strokeWidth="2"/><path d={i===0?`M${Number(x)-30} 74Q${x} 98 ${Number(x)+30} 74`:i===1?`M${Number(x)-12} 74Q${x} 82 ${Number(x)+12} 74`:`M${Number(x)-30} 71Q${Number(x)-6} 100 ${Number(x)+22} 82`} fill="none" stroke={purple} strokeWidth="5"/>{!assessment&&<text x={Number(x)} y="160" textAnchor="middle" fill={ink} fontSize="13">{name}</text>}</g>)}</svg></div>
}

function Health({ focus, assessment }: { focus: string; assessment: boolean }) {
  if (focus === 'health-wellbeing') return <Diagram title="Physical and mental well-being overlap to make up health.">
    <circle cx="215" cy="119" r="84" fill="#dbeef8" stroke={blue} strokeWidth="3"/><circle cx="325" cy="119" r="84" fill="#eee5f8" stroke={purple} strokeWidth="3"/>
    <g fill={ink} textAnchor="middle"><text x="170" y="105" fontSize="16" fontWeight="700">physical</text><text x="170" y="126" fontSize="13">body function</text><text x="370" y="105" fontSize="16" fontWeight="700">mental</text><text x="370" y="126" fontSize="13">thoughts + feelings</text><text x="270" y="111" fontSize="17" fontWeight="800">health</text><text x="270" y="134" fontSize="12">well-being</text></g>
    <path d="M86 214Q270 178 454 214" fill="none" stroke={green} strokeWidth="5"/><text x="270" y="237" textAnchor="middle" fill={ink} fontSize="13">the two parts can affect each other</text>
  </Diagram>

  if (focus.includes('communicable') || focus === 'health-classify-question') {
    const nonCommunicable = focus === 'health-noncommunicable'
    return <Diagram title={assessment ? 'Two disease patterns labelled Type A and Type B.' : nonCommunicable ? 'A non-communicable disease affects one person but is not passed to another.' : 'A pathogen passing between two organisms causes communicable disease.'}>
      <Person x={125} y={125} colour={nonCommunicable ? red : blue}/><Person x={415} y={125} colour="#d9e7ec"/>
      {nonCommunicable ? <><path d="M107 127Q125 99 143 127Q125 154 107 127Z" fill={red} stroke={ink}/><Arrow x1={185} y1={124} x2={355} y2={124} colour="#b7c7cf"/><path d="M264 86L296 162M296 86L264 162" stroke="#ba5b64" strokeWidth="8"/><text x="270" y="218" textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">does not spread between organisms</text></> : <><g fill={green} stroke={ink}>{[[199,100],[228,137],[260,111],[294,139],[326,102]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="8"/>)}</g><Arrow x1={180} y1={124} x2={360} y2={124}/><text x="270" y="218" textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">pathogen can pass between organisms</text></>}
      {!assessment && <g fill={ink} fontSize="13" fontWeight="700" textAnchor="middle"><text x="125" y="55">{nonCommunicable ? 'affected person' : 'infected organism'}</text><text x="415" y="55">another organism</text></g>}
    </Diagram>
  }

  if (focus === 'health-virus-cancer') return <Diagram title="Some viruses infect cells, contribute to cell changes and increase the risk of certain cancers.">
    <g transform="translate(72 118)" fill={green} stroke={ink} strokeWidth="2">{Array.from({length:7},(_,i)=><g key={i} transform={`rotate(${i*51})`}><circle cy="-31" r="8"/><line y1="-39" y2="-51"/></g>)}<circle r="29"/></g><Arrow x1={112} y1={118} x2={195} y2={118}/>
    <g transform="translate(245 118)"><circle r="48" fill="#dbeef8" stroke={ink} strokeWidth="3"/><circle r="19" fill={purple}/><circle cx="-22" cy="-8" r="6" fill={green}/><circle cx="25" cy="14" r="6" fill={green}/></g><Arrow x1={300} y1={118} x2={378} y2={118}/>
    <g transform="translate(450 118)" fill={red} stroke={ink}>{[[0,0],[-25,-21],[22,-25],[-27,20],[26,22],[0,42]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="17"/>)}</g>
    <g fill={ink} fontSize="13" fontWeight="700" textAnchor="middle"><text x="72" y="205">virus</text><text x="245" y="205">infected cell</text><text x="450" y="205">higher cancer risk</text></g>
  </Diagram>

  if (focus === 'health-physical-mental') return <Diagram title="Physical and mental health can influence each other in both directions.">
    <rect x="45" y="74" width="175" height="102" rx="25" fill="#dbeef8" stroke={blue} strokeWidth="3"/><rect x="320" y="74" width="175" height="102" rx="25" fill="#eee5f8" stroke={purple} strokeWidth="3"/>
    <g fill={ink} textAnchor="middle"><text x="132" y="112" fontSize="16" fontWeight="700">physical health</text><text x="132" y="139" fontSize="12">pain · energy · activity</text><text x="407" y="112" fontSize="16" fontWeight="700">mental health</text><text x="407" y="139" fontSize="12">mood · sleep · behaviour</text></g><Arrow x1={225} y1={102} x2={315} y2={102}/><Arrow x1={315} y1={151} x2={225} y2={151} colour={blue}/>
  </Diagram>

  if (focus === 'health-interactions') return <Diagram title="Examples of diseases interacting: reduced immune defence raises infection risk, and immune reactions can worsen other conditions.">
    <path d="M86 45L127 62V113Q127 151 86 174Q45 151 45 113V62Z" fill="#dff2ea" stroke={green} strokeWidth="4"/><path d="M66 105L81 120L109 85" fill="none" stroke={ink} strokeWidth="6"/><text x="86" y="205" textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">immune defence</text>
    <Arrow x1={143} y1={111} x2={219} y2={111}/><g fill={red} stroke={ink}>{[[260,92],[282,126],[241,139]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="14"/>)}</g><text x="260" y="205" textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">infection risk</text>
    <Arrow x1={310} y1={111} x2={376} y2={111}/><path d="M405 78Q445 48 483 82Q501 124 462 157Q421 176 390 141Q373 105 405 78Z" fill="#eee5f8" stroke={purple} strokeWidth="3"/><path d="M408 119Q426 93 440 122T477 114" fill="none" stroke={red} strokeWidth="4"/><text x="440" y="205" textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">another condition worsens</text>
  </Diagram>

  return <Diagram title="Diet, stress and life situation all feed into health outcomes.">
    <circle cx="270" cy="126" r="58" fill="#fff3b9" stroke={yellow} strokeWidth="4"/><text x="270" y="122" textAnchor="middle" fill={ink} fontSize="18" fontWeight="800">health</text><text x="270" y="144" textAnchor="middle" fill={ink} fontSize="12">many influences</text>
    <g fill="#eef7fb" stroke={ink} strokeWidth="2"><rect x="25" y="70" width="135" height="92" rx="20"/><rect x="202" y="12" width="136" height="50" rx="18"/><rect x="380" y="70" width="135" height="92" rx="20"/></g>
    <g fill={ink} textAnchor="middle"><text x="92" y="106" fontSize="16" fontWeight="700">diet</text><text x="92" y="132" fontSize="12">nutrients + energy</text><text x="270" y="43" fontSize="16" fontWeight="700">stress</text><text x="447" y="106" fontSize="16" fontWeight="700">life situation</text><text x="447" y="132" fontSize="12">housing + care</text></g><Arrow x1={160} y1={116} x2={207} y2={122}/><Arrow x1={270} y1={62} x2={270} y2={68}/><Arrow x1={380} y1={116} x2={333} y2={122}/><text x="270" y="226" textAnchor="middle" fill={ink} fontSize="13">factors interact; none guarantees an outcome</text>
  </Diagram>
}

function RiskCancer({ focus, assessment }: { focus: string; assessment: boolean }) {
  if (focus === 'risk-chance') return <Diagram title="Two groups show that a risk factor can raise probability without guaranteeing disease.">
    <g fill={ink} fontSize="14" fontWeight="700" textAnchor="middle"><text x="145" y="25">lower-risk group</text><text x="395" y="25">higher-risk group</text></g>
    {[0,1].map(group=>Array.from({length:20},(_,i)=>{const affected=group===0?i<3:i<9; const x=78+group*250+(i%5)*34,y=58+Math.floor(i/5)*35; return <g key={`${group}-${i}`}><circle cx={x} cy={y-7} r="6" fill={affected?red:blue}/><path d={`M${x-8} ${y+15}Q${x} ${y-1} ${x+8} ${y+15}`} fill={affected?red:blue}/></g>}))}
    <g fill={ink} fontSize="12" textAnchor="middle"><text x="145" y="218">some develop disease; most do not</text><text x="395" y="218">more develop disease; some still do not</text></g>
  </Diagram>

  if (focus === 'risk-types') return <Diagram title="Lifestyle, environmental and inherited factors can combine to change disease risk.">
    <circle cx="270" cy="133" r="50" fill="#fff3b9" stroke={yellow} strokeWidth="4"/><text x="270" y="128" textAnchor="middle" fill={ink} fontSize="16" fontWeight="800">disease</text><text x="270" y="148" textAnchor="middle" fill={ink} fontSize="12">probability</text>
    {[[65,45,'lifestyle','choices + habits'],[362,45,'environment','exposures'],[197,202,'inherited','gene variants']].map(([x,y,label,note],i)=><g key={String(label)}><rect x={Number(x)} y={Number(y)} width="114" height="48" rx="14" fill={i===0?'#dbeef8':i===1?'#dff2ea':'#eee5f8'} stroke={ink} strokeWidth="2"/><text x={Number(x)+57} y={Number(y)+20} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{label}</text><text x={Number(x)+57} y={Number(y)+37} textAnchor="middle" fill={ink} fontSize="10">{note}</text></g>)}
    <Arrow x1={180} y1={87} x2={228} y2={108}/><Arrow x1={360} y1={87} x2={312} y2={108}/><Arrow x1={254} y1={201} x2={264} y2={184}/>
  </Diagram>

  if (focus === 'risk-correlation' || focus === 'risk-evidence-question') return <Diagram title={assessment ? 'A data pattern beside a proposed biological pathway.' : 'Correlation in data must be tested alongside other variables and a plausible causal mechanism.'}>
    <g transform="translate(42 32)" stroke={ink}><line y1="160" x2="190" y2="160"/><line y1="160" y2="5"/>{[[25,139],[53,126],[73,115],[102,96],[123,91],[151,61],[174,44]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="6" fill={blue}/>) }<path d="M18 145L180 37" stroke={purple} strokeWidth="3" strokeDasharray="6 5"/><text x="95" y="189" textAnchor="middle" fill={ink} stroke="none" fontSize="12">risk factor exposure</text><text transform="translate(-22 85) rotate(-90)" textAnchor="middle" fill={ink} stroke="none" fontSize="12">disease rate</text></g>
    <Arrow x1={255} y1={118} x2={305} y2={118}/><g fill="#eef7fb" stroke={ink} strokeWidth="2"><rect x="318" y="42" width="178" height="58" rx="14"/><rect x="318" y="137" width="178" height="58" rx="14"/></g><g fill={ink} textAnchor="middle"><text x="407" y="66" fontSize="13" fontWeight="700">check other variables</text><text x="407" y="84" fontSize="11">repeat studies</text><text x="407" y="161" fontSize="13" fontWeight="700">test a mechanism</text><text x="407" y="179" fontSize="11">how could it cause harm?</text></g>
  </Diagram>

  if (focus === 'risk-causation') return <Diagram title="A causal pathway links harmful exposure to cell or tissue damage and then to increased disease risk.">
    <g fill="#eef7fb" stroke={ink} strokeWidth="2"><rect x="28" y="82" width="135" height="82" rx="18"/><rect x="203" y="82" width="135" height="82" rx="18"/><rect x="378" y="82" width="135" height="82" rx="18"/></g><g fill={ink} textAnchor="middle"><text x="95" y="113" fontSize="14" fontWeight="700">exposure</text><text x="95" y="139" fontSize="11">chemical or radiation</text><text x="270" y="113" fontSize="14" fontWeight="700">biological damage</text><text x="270" y="139" fontSize="11">DNA, cells or tissue</text><text x="445" y="113" fontSize="14" fontWeight="700">higher disease risk</text><text x="445" y="139" fontSize="11">not a certain outcome</text></g><Arrow x1={164} y1={123} x2={201} y2={123}/><Arrow x1={339} y1={123} x2={376} y2={123}/>
  </Diagram>

  if (focus === 'risk-smoking') return <Diagram title="Smoking can damage airways, blood vessels and DNA, raising several disease risks.">
    <path d="M270 39V104M270 79Q225 65 183 105M270 79Q315 65 357 105" fill="none" stroke={ink} strokeWidth="10"/><path d="M183 105Q132 118 124 184Q162 219 218 181Q227 133 183 105ZM357 105Q408 118 416 184Q378 219 322 181Q313 133 357 105Z" fill="#f3b0ad" stroke={ink} strokeWidth="3"/><g fill="#6d6570">{[[78,45],[103,55],[126,39],[151,55]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={10+i*2}/>)}</g><Arrow x1={155} y1={62} x2={218} y2={95}/><g fill={red} stroke={ink}>{[[452,75],[476,105],[446,129],[486,155]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="11"/>)}</g><text x="270" y="235" textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">lung damage · cardiovascular disease · cancer risk</text>
  </Diagram>

  if (focus === 'risk-alcohol') return <Diagram title="Risk from alcohol depends on amount and duration, with the liver, brain and a developing fetus potentially affected.">
    <path d="M86 40H151L140 115Q135 145 118 153V196H157V213H63V196H102V153Q85 145 80 115Z" fill="#eef7fb" stroke={ink} strokeWidth="3"/><path d="M84 91H146L139 120Q132 139 116 140Q94 138 86 120Z" fill={yellow}/><Arrow x1={165} y1={125} x2={230} y2={125}/><path d="M261 77Q306 52 333 83Q349 110 327 133Q303 156 259 139Q226 122 235 96Q241 83 261 77Z" fill="#d99090" stroke={ink} strokeWidth="3"/><path d="M405 73Q455 45 483 79Q496 100 482 121Q463 148 413 137Q377 125 382 97Q385 83 405 73Z" fill="#eee5f8" stroke={ink} strokeWidth="3"/><g fill={ink} fontSize="13" fontWeight="700" textAnchor="middle"><text x="116" y="235">exposure</text><text x="285" y="181">liver</text><text x="438" y="181">brain</text></g>
  </Diagram>

  if (focus === 'risk-obesity') return <Diagram title="Excess body fat can reduce insulin sensitivity and increase the risk of type 2 diabetes and other diseases.">
    <Person x={96} y={118} colour={yellow}/><Arrow x1={145} y1={118} x2={210} y2={118}/><g transform="translate(270 118)"><circle r="54" fill="#dbeef8" stroke={ink} strokeWidth="3"/><circle r="24" fill={purple}/><path d="M-43-33L-64-57M39-37L61-61M45 31L69 50" stroke={red} strokeWidth="5"/><text y="80" textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">cell responds less to insulin</text></g><Arrow x1={330} y1={118} x2={390} y2={118}/><rect x="401" y="72" width="115" height="92" rx="18" fill="#f8e5e3" stroke={ink} strokeWidth="2"/><text x="458" y="105" textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">higher risk</text><text x="458" y="129" textAnchor="middle" fill={ink} fontSize="11">type 2 diabetes</text><text x="458" y="146" textAnchor="middle" fill={ink} fontSize="11">some cancers</text>
  </Diagram>

  if (focus === 'risk-radiation') return <Diagram title="Ultraviolet radiation, ionising radiation and some viruses can contribute to cell changes that raise cancer risk.">
    <g transform="translate(74 81)" stroke={yellow} strokeWidth="6">{Array.from({length:8},(_,i)=><line key={i} y1="-31" y2="-55" transform={`rotate(${i*45})`}/>) }<circle r="26" fill={yellow}/></g><text x="74" y="153" textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">UV</text><path d="M172 36L139 104H172L151 173L213 91H178L203 36Z" fill={purple} stroke={ink} strokeWidth="2"/><text x="176" y="199" textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">ionising radiation</text><g transform="translate(285 84)" fill={green} stroke={ink}>{Array.from({length:8},(_,i)=><line key={i} y1="-26" y2="-41" transform={`rotate(${i*45})`}/>) }<circle r="26"/></g><text x="285" y="153" textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">some viruses</text><Arrow x1={327} y1={112} x2={383} y2={112}/><g transform="translate(450 112)" fill={red} stroke={ink}>{[[0,0],[-25,-20],[25,-20],[-30,21],[30,21],[0,43]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="16"/>)}</g><text x="450" y="191" textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">cell changes</text>
  </Diagram>

  if (focus === 'cancer-formation') return <Diagram title="Cell changes can remove control of division, producing a growing tumour.">
    <g transform="translate(70 122)" fill="#dbeef8" stroke={ink} strokeWidth="2"><circle r="28"/><circle r="10" fill={purple}/></g><Arrow x1={108} y1={122} x2={165} y2={122}/><g transform="translate(220 122)" fill={red} stroke={ink}>{[[-18,-14],[18,-14],[-18,18],[18,18]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="22"/>)}</g><Arrow x1={261} y1={122} x2={320} y2={122}/><g transform="translate(421 122)" fill={red} stroke={ink}>{Array.from({length:12},(_,i)=><circle key={i} cx={Math.cos(i*.9)*(18+(i%3)*17)} cy={Math.sin(i*.9)*(18+(i%3)*15)} r="19"/>)}</g><g fill={ink} fontSize="13" fontWeight="700" textAnchor="middle"><text x="70" y="205">changed cell</text><text x="220" y="205">uncontrolled division</text><text x="421" y="205">tumour mass</text></g>
  </Diagram>

  if (focus === 'cancer-benign' || focus === 'cancer-malignant' || focus === 'cancer-spread-question') {
    const malignant = focus !== 'cancer-benign'
    return <Diagram title={assessment ? 'One tumour stays within a boundary while another invades tissue and sends cells through a vessel.' : malignant ? 'A malignant tumour invading tissue and spreading cells through a blood vessel to form a secondary tumour.' : 'A benign tumour contained within a membrane and not invading nearby tissue.'}>
      <path d="M30 35H510V215H30Z" fill="#f4ece6" stroke={ink} strokeWidth="2"/><path d="M40 172H500V205H40Z" fill="#dbeef8" stroke={blue} strokeWidth="3"/>
      <g transform="translate(190 112)" fill={red} stroke={ink}>{Array.from({length:11},(_,i)=><circle key={i} cx={Math.cos(i*.9)*(18+(i%3)*16)} cy={Math.sin(i*.9)*(16+(i%3)*14)} r="18"/>)}</g>
      {!malignant && <ellipse cx="190" cy="112" rx="86" ry="76" fill="none" stroke={green} strokeWidth="5"/>}
      {malignant && <><path d="M241 126Q286 142 310 174" fill="none" stroke={red} strokeWidth="8"/><g fill={red} stroke={ink}>{[[335,188],[382,189],[430,188]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="11"/>)}</g><g transform="translate(466 112)" fill={red} stroke={ink}>{[[0,0],[-21,-18],[22,-17],[-23,20],[23,21]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="15"/>)}</g></>}
      {!assessment && <g fill={ink} fontSize="13" fontWeight="700"><text x="105" y="24">{malignant?'primary tumour invades':'contained tumour'}</text>{malignant&&<><text x="304" y="159">cells enter blood</text><text x="407" y="76">secondary tumour</text></>}</g>}
    </Diagram>
  }

  if (focus === 'cancer-genetic') return <Diagram title="Inherited gene variants and changes acquired during life can both affect cancer risk.">
    <g transform="translate(95 32)" fill="none" strokeWidth="4">{Array.from({length:7},(_,i)=><g key={i}><line x1={Math.sin(i*.9)*24} y1={i*25} x2={70+Math.sin(i*.9+3.14)*24} y2={i*25} stroke={i===3?red:ink}/><circle cx={Math.sin(i*.9)*24} cy={i*25} r="5" fill={blue} stroke={blue}/><circle cx={70+Math.sin(i*.9+3.14)*24} cy={i*25} r="5" fill={purple} stroke={purple}/></g>)}</g><Arrow x1={205} y1={118} x2={285} y2={118}/><g transform="translate(386 118)" fill={red} stroke={ink}>{Array.from({length:9},(_,i)=><circle key={i} cx={Math.cos(i*.95)*(15+(i%3)*17)} cy={Math.sin(i*.95)*(15+(i%3)*16)} r="18"/>)}</g><g fill={ink} fontSize="13" fontWeight="700" textAnchor="middle"><text x="130" y="229">inherited variant can raise chance</text><text x="386" y="229">risk, not certainty</text></g>
  </Diagram>

  if (focus === 'cancer-prevention') return <Diagram title="Avoiding tobacco, limiting ultraviolet exposure and screening can reduce some cancer risks or find changes earlier.">
    <path d="M270 35L328 58V121Q328 173 270 207Q212 173 212 121V58Z" fill="#dff2ea" stroke={green} strokeWidth="4"/><path d="M240 119L260 140L302 91" fill="none" stroke={ink} strokeWidth="7"/>
    <g transform="translate(82 91)"><rect x="-42" y="-8" width="84" height="17" rx="8" fill="#eee" stroke={ink} strokeWidth="2"/><rect x="21" y="-8" width="21" height="17" fill={yellow}/><path d="M-55-38L55 38M55-38L-55 38" stroke={red} strokeWidth="7"/></g><g transform="translate(454 87)" stroke={yellow} strokeWidth="5">{Array.from({length:8},(_,i)=><line key={i} y1="-25" y2="-44" transform={`rotate(${i*45})`}/>) }<circle r="22" fill={yellow}/><path d="M-48 63Q0 27 48 63" fill="#eee5f8" stroke={purple}/></g><g fill={ink} fontSize="12" fontWeight="700" textAnchor="middle"><text x="82" y="176">avoid tobacco</text><text x="270" y="232">screening for some cancers</text><text x="454" y="176">limit UV exposure</text></g>
  </Diagram>

  return <Diagram title="Non-communicable disease can create linked costs for a person, a household and wider society.">
    <circle cx="116" cy="122" r="69" fill="#dbeef8" stroke={blue} strokeWidth="3"/><circle cx="270" cy="122" r="69" fill="#eee5f8" stroke={purple} strokeWidth="3"/><circle cx="424" cy="122" r="69" fill="#dff2ea" stroke={green} strokeWidth="3"/><g fill={ink} fontSize="14" fontWeight="700" textAnchor="middle"><text x="116" y="101">person</text><text x="116" y="128" fontSize="11">health · activity</text><text x="116" y="145" fontSize="11">quality of life</text><text x="270" y="101">household</text><text x="270" y="128" fontSize="11">care · adaptations</text><text x="270" y="145" fontSize="11">income</text><text x="424" y="101">society</text><text x="424" y="128" fontSize="11">treatment · research</text><text x="424" y="145" fontSize="11">workforce</text></g><Arrow x1={184} y1={122} x2={201} y2={122}/><Arrow x1={338} y1={122} x2={355} y2={122}/>
  </Diagram>
}

export function HealthDiseaseVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('vessel-')) return <Vessel focus={focus} assessment={assessment}/>
  if (focus.startsWith('blood-flow')) return <FlowRate example={focus.includes('example')}/>
  if (focus.startsWith('blood-')) return <Blood focus={focus} assessment={assessment}/>
  if (focus.startsWith('cardio-')) return <Coronary focus={focus} assessment={assessment}/>
  if (focus.startsWith('health-')) return <Health focus={focus} assessment={assessment}/>
  return <RiskCancer focus={focus} assessment={assessment}/>
}

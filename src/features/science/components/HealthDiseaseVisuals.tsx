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

function CoronaryArtery({ stent, assessment, hiMuscle = false, question = false }: { stent: boolean; assessment: boolean; hiMuscle?: boolean; question?: boolean }) {
  const art = dim(!hiMuscle)
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
      : question && assessment ? 'Lengthwise section of a coronary artery, badly narrowed by fatty material in its wall. A tag says the patient needs more blood flow now. Not to scale.'
      : 'Lengthwise section of a coronary artery. Fatty material has built up inside the artery wall, under the inner lining, and bulges inwards, so the lumen is much narrower at that point. Fewer blood cells pass the narrowing, and the heart muscle beyond it receives less blood and oxygen. Not to scale.' + (hiMuscle ? ' The heart muscle beyond the narrowing is highlighted.' : '')}</title>
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
    <g opacity={art}>
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
    </g>
    {question && assessment && <g>
      <rect x="150" y="4" width="170" height="24" rx="12" fill="#fff4e0" stroke="#b58a2c" strokeWidth="1.5"/>
      <Lbl x={235} y={21} anchor="middle" bold size={12}>needs more blood flow now</Lbl>
      <Leader d="M235 30V52" to={[235, 54]}/>
    </g>}

    {!assessment && <>
      <g opacity={art}>
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
      </g>
      <text x="150" y="214" textAnchor="middle" {...t}>heart muscle</text>
      <text x="374" y="214" textAnchor="middle" {...t} fontWeight={stent ? 400 : 700}>{stent ? 'muscle keeps its' : 'less oxygen reaches'}</text>
      <text x="374" y="229" textAnchor="middle" {...t} fontWeight={stent ? 400 : 700}>{stent ? 'oxygen supply' : 'this muscle'}</text>
    </>}
  </svg></div>
}

/* Small shared pieces for the Lesson 14 treatment diagrams. */
function MiniArtery({ x, y, w, h = 54, narrow = 0, stent = false, grad }: { x: number; y: number; w: number; h?: number; narrow?: number; stent?: boolean; grad: string }) {
  const m = x + w / 2, top = y + 9, bot = y + h - 9, nb = narrow * .6
  const bumpTop = `M${m - 44} ${top}C${m - 22} ${top} ${m - 20} ${top + narrow} ${m} ${top + narrow}C${m + 20} ${top + narrow} ${m + 22} ${top} ${m + 44} ${top}`
  const bumpBot = `M${m - 36} ${bot}C${m - 18} ${bot} ${m - 16} ${bot - nb} ${m} ${bot - nb}C${m + 16} ${bot - nb} ${m + 18} ${bot} ${m + 36} ${bot}`
  const mid = (top + narrow + bot - nb) / 2
  return <g>
    <path d={`M${x} ${y}Q${m} ${y - 3} ${x + w} ${y}V${y + h}Q${m} ${y + h + 3} ${x} ${y + h}Z`} fill="#f2cfc3" stroke="#9b6461" strokeWidth="1.6"/>
    <path d={`M${x} ${top}H${x + w}V${bot}H${x}Z`} fill="#fbe4e1"/>
    <path d={`M${x} ${top}H${x + w}M${x} ${bot}H${x + w}`} stroke="#c0676f" strokeWidth="1.6"/>
    {narrow > 0 && <><path d={bumpTop + 'Z'} fill="#f1d27a" stroke="#b58a2c" strokeWidth="1.2"/><path d={bumpBot + 'Z'} fill="#f1d27a" stroke="#b58a2c" strokeWidth="1.2"/></>}
    {[[x + 18, y + h / 2 - 4, 10], [x + w - 22, y + h / 2 + 5, -15], [m + (stent ? 0 : 0), stent ? y + h / 2 : mid, 20]].map(([cx, cy, r], k) => <RBC key={k} x={cx} y={cy} r={8} rotate={r} grad={grad}/>)}
    {stent && <g fill="none" stroke={purple} strokeWidth="1.8">{[0, 1, 2, 3, 4].map(k => { const sx = m - 30 + k * 12; return <path key={k} d={`M${sx} ${top + 1}L${sx + 6} ${y + h / 2}L${sx} ${bot - 1}M${sx + 6} ${y + h / 2}L${sx + 12} ${top + 1}M${sx + 6} ${y + h / 2}L${sx + 12} ${bot - 1}`}/> })}</g>}
  </g>
}
function Tablet({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y}) rotate(-20)`}><rect x="-17" y="-8" width="34" height="16" rx="8" fill="#fff" stroke={ink} strokeWidth="1.6"/><path d="M0-8V8" stroke={ink} strokeWidth="1.2"/><rect x="-17" y="-8" width="17" height="16" rx="8" fill="#cfe3ee"/><rect x="-17" y="-8" width="34" height="16" rx="8" fill="none" stroke={ink} strokeWidth="1.6"/></g>
}
function HeartShape({ x, y, s = 1, fill, stroke = ink }: { x: number; y: number; s?: number; fill: string; stroke?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M2 62C-38 40-58 12-50-16C-44-38-20-46-2-30C2-26 4-24 6-22C14-40 38-46 52-30C66-12 58 18 30 42C20 50 10 57 2 62Z" fill={fill} stroke={stroke} strokeWidth={2.2 / s}/>
}

function TreatmentCompare() {
  const { t, u } = useSvgIds(), g = `${u}-rbc`
  const panels = [
    { x: 8, fill: '#eef7fb', head: 'fix the pipe', name: 'stent', note: ['works straight away,', 'at one artery'] },
    { x: 186, fill: '#fbf4e2', head: 'slow the problem', name: 'statins', note: ['work slowly,', 'all over the body'] },
    { x: 364, fill: '#f4eefa', head: 'replace the part', name: 'new valve or heart', note: ['major surgery,', 'for a failed part'] },
  ]
  return <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}>
    <title id={t}>Three ways to treat cardiovascular disease, side by side. Fix the pipe: a stent holds one narrowed artery open and works straight away. Slow the problem: statin tablets lower cholesterol and slow fatty build-up over time. Replace the part: a faulty valve or a failing heart is replaced in major surgery. Original schematic, not to scale.</title>
    <defs><RBCGradient id={g}/></defs>
    {panels.map((p, k) => <g key={k}>
      <rect x={p.x} y="8" width="168" height="234" rx="18" fill={p.fill} stroke="#b9c9d2" strokeWidth="1.5"/>
      <Lbl x={p.x + 84} y={34} anchor="middle" bold size={14}>{p.head}</Lbl>
      <Lbl x={p.x + 84} y={186} anchor="middle" bold>{p.name}</Lbl>
      {p.note.map((n, q) => <Lbl key={q} x={p.x + 84} y={206 + q * 15} anchor="middle" size={11.5} fill="#526976">{n}</Lbl>)}
    </g>)}
    <MiniArtery x={24} y={96} w={136} stent grad={g}/>
    <Tablet x={236} y={72}/><Tablet x={276} y={64}/>
    <MiniArtery x={202} y={100} w={136} narrow={9} grad={g}/>
    <g transform="translate(412 118)"><circle r="30" fill="#e3ebef" stroke="#6e8593" strokeWidth="6"/><path d="M-3-25Q-20-14-21 0Q-20 14-3 25Z" fill="#c9d6dd" stroke="#55707f" strokeWidth="1.5"/><path d="M3-25Q20-14 21 0Q20 14 3 25Z" fill="#c9d6dd" stroke="#55707f" strokeWidth="1.5"/></g>
    <HeartShape x={492} y={104} s={.52} fill="#e59a98"/>
    <Lbl x={412} y={166} anchor="middle" size={11} fill="#526976">valve</Lbl><Lbl x={492} y={166} anchor="middle" size={11} fill="#526976">heart</Lbl>
  </svg></div>
}

function StentBalance() {
  const { t, u } = useSvgIds(), g = `${u}-rbc`
  return <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}>
    <title id={t}>A coronary artery held open by a stent, with benefits on the left and risks on the right. Benefits: it works straight away and recovery is quick. Risks: an infection can start, or a blood clot can form near the stent. Original schematic, not to scale.</title>
    <defs><RBCGradient id={g}/></defs>
    <g transform="translate(90 34) scale(1.5)"><MiniArtery x={0} y={0} w={240} stent grad={g}/></g>
    {/* a small clot forming just beyond the end of the stent */}
    <g transform="translate(318 74)"><path d="M-9-6C-3-13 9-11 11-3C13 6 3 11-4 8C-11 6-13-1-9-6Z" fill="#b8434f" fillOpacity=".9"/><path d="M-11-2L12 4M-6-10L6 10M-12 5L11-6" stroke="#8a6db8" strokeWidth="1.1"/></g>
    <Bacterium x={140} y={22} rotate={-15} s={.9}/>
    <Lbl x={270} y={138} anchor="middle" size={12} fill="#5d4a86" bold>stent holds the artery open</Lbl>
    <rect x="18" y="156" width="240" height="78" rx="14" fill="#edf7f1" stroke="#9fcbb2" strokeWidth="1.4"/>
    <Lbl x={36} y={180} bold size={14} fill="#2f7d5b">benefits</Lbl>
    <path d="M38 196l4 4 8-9M38 218l4 4 8-9" stroke="#2f7d5b" strokeWidth="2.2" fill="none"/>
    <Lbl x={58} y={202}>works straight away</Lbl><Lbl x={58} y={224}>quick recovery</Lbl>
    <rect x="282" y="156" width="240" height="78" rx="14" fill="#fbf0e9" stroke="#e1b9a2" strokeWidth="1.4"/>
    <Lbl x={300} y={180} bold size={14} fill="#a1502a">risks</Lbl>
    <Lbl x={300} y={202}>infection can start</Lbl><Lbl x={300} y={224}>a clot can form near the stent</Lbl>
    <Lbl x={24} y={26} size={12}>infection</Lbl><Leader d="M80 22L124 22" to={[126, 22]}/>
    <Lbl x={410} y={22} size={12}>blood clot</Lbl><Leader d="M406 18L323 69" to={[321, 71]}/>
  </svg></div>
}

/* Cholesterol → fatty build-up, and what statins change. hi: 'cholesterol' highlights the top artery, 'statin' the bottom one. */
function StatinVisual({ hi }: { hi: 'cholesterol' | 'statin' }) {
  const { t, u } = useSvgIds(), g = `${u}-rbc`
  const row = (y: number, many: boolean, narrow: number) => <g>
    <MiniArtery x={150} y={y} w={250} narrow={narrow} grad={g}/>
    {(many ? [[170, 22], [196, 34], [226, 24], [258, 38], [300, 26], [336, 36], [370, 24], [388, 34]] : [[190, 30], [320, 26], [372, 36]])
      .map(([x, dy], i) => <circle key={i} cx={x} cy={y + dy} r="3.4" fill="#e3b53c" stroke="#9c7a1e" strokeWidth=".8"/>)}
  </g>
  return <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}>
    <title id={t}>{`Two coronary arteries. Top: blood with high cholesterol, shown as many small yellow particles, and a thick fatty layer narrowing the artery. Bottom: with statins, fewer cholesterol particles and a thinner fatty layer, so the artery stays wider.${hi === 'cholesterol' ? ' The top artery is highlighted.' : ' The bottom artery is highlighted.'} Original schematic, not to scale.`}</title>
    <defs><RBCGradient id={g}/></defs>
    <g opacity={dim(hi === 'cholesterol')}>
      <Lbl x={138} y={58} anchor="end" bold>high cholesterol</Lbl><Lbl x={138} y={73} anchor="end" size={11.5} fill="#526976">more fatty build-up</Lbl>
      {row(32, true, 10)}
      <Lbl x={414} y={50} bold size={12}>cholesterol</Lbl><Lbl x={414} y={64} size={11.5}>in the blood</Lbl><Leader d="M410 48L392 58" to={[388, 62]}/>
      <Lbl x={414} y={96} size={11.5}>fatty layer</Lbl><Leader d="M410 93L288 75" to={[286, 74]}/>
    </g>
    <g opacity={dim(hi === 'statin')}>
      <Tablet x={42} y={170}/>
      <Lbl x={138} y={176} anchor="end" bold>with statins</Lbl><Lbl x={138} y={191} anchor="end" size={11.5} fill="#526976">less cholesterol</Lbl>
      {row(150, false, 3)}
      <Lbl x={414} y={172} bold size={12}>thinner fatty layer</Lbl><Lbl x={414} y={186} size={11.5}>artery stays wider</Lbl><Leader d="M410 170L292 162" to={[290, 161]}/>
    </g>
    <Lbl x={270} y={240} anchor="middle" size={11} fill="#526976">original schematic, not to scale</Lbl>
  </svg></div>
}

/* Cross-sections of the same artery over time, without and with statins. */
function StatinTimeline() {
  const { t } = useSvgIds()
  const ring = (cx: number, cy: number, lumen: number) => <g>
    <circle cx={cx} cy={cy} r="30" fill="#f2cfc3" stroke="#9b6461" strokeWidth="1.8"/>
    <circle cx={cx} cy={cy} r="22" fill="#f1d27a" stroke="#b58a2c" strokeWidth="1.2"/>
    <circle cx={cx} cy={cy - (22 - lumen)} r={lumen} fill="#e58b8e" stroke="#c0676f" strokeWidth="1.4"/>
  </g>
  const cols = [220, 330, 440]
  return <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}>
    <title id={t}>Cross-sections of a coronary artery at the start, some years later and many years later. Without statins, the yellow fatty layer grows quickly and the red space for blood shrinks a lot. With statins taken regularly, the fatty layer grows more slowly and the space for blood stays wider. Statins must be taken regularly and side effects are possible. Original schematic, not to scale.</title>
    {['start', 'years later', 'many years later'].map((h, i) => <Lbl key={h} x={cols[i]} y={26} anchor="middle" size={12} fill="#526976" bold>{h}</Lbl>)}
    <path d="M180 38H486" stroke="#9fb2bd" strokeWidth="1.4"/><path d="M486 38l-8-4v8Z" fill="#9fb2bd"/>
    <Lbl x={150} y={80} anchor="end" bold>without statins</Lbl><Lbl x={150} y={95} anchor="end" size={11.5} fill="#526976">narrows quickly</Lbl>
    {[20, 13, 7].map((l, i) => <g key={i}>{ring(cols[i], 86, l)}</g>)}
    <Tablet x={36} y={180}/>
    <Lbl x={150} y={176} anchor="end" bold>with statins</Lbl><Lbl x={150} y={191} anchor="end" size={11.5} fill="#526976">narrows slowly</Lbl>
    {[20, 18, 15].map((l, i) => <g key={i}>{ring(cols[i], 182, l)}</g>)}
    <Lbl x={270} y={238} anchor="middle" size={12}>taken regularly for years · side effects are possible</Lbl>
  </svg></div>
}

/* One valve panel: a vessel section with two flaps. kind: healthy (open wide), stiff (opens a little), leaky (closed with a gap, backflow). */
function ValvePanel({ x, kind, u }: { x: number; kind: 'healthy' | 'stiff' | 'leaky'; u: string }) {
  const L = x - 42, R = x + 42
  const flaps = kind === 'healthy' ? `M${L} 70Q${L + 14} 112 ${L + 18} 138M${R} 70Q${R - 14} 112 ${R - 18} 138`
    : kind === 'stiff' ? `M${L} 70Q${L + 22} 100 ${x - 7} 120M${R} 70Q${R - 22} 100 ${x + 7} 120`
    : `M${L} 70Q${L + 22} 92 ${x - 8} 96M${R} 70Q${R - 22} 92 ${x + 8} 96`
  return <g>
    <path d={`M${L - 12} 36H${L}V190H${L - 12}ZM${R} 36H${R + 12}V190H${R}Z`} fill="#f2cfc3" stroke="#9b6461" strokeWidth="1.5"/>
    <path d={`M${L} 36H${R}V190H${L}Z`} fill="#fbe4e1"/>
    <path d={flaps} fill="none" stroke="#a8545d" strokeWidth="5" strokeLinecap="round"/>
    {kind === 'healthy' && <path d={`M${x} 46V176`} stroke="#b8434f" strokeWidth="5" markerEnd={`url(#${u}-v)`}/>}
    {kind === 'stiff' && <path d={`M${x} 46V176`} stroke="#b8434f" strokeWidth="1.8" markerEnd={`url(#${u}-v)`}/>}
    {kind === 'leaky' && <path d={`M${x} 150V58`} stroke="#b8434f" strokeWidth="2.6" strokeDasharray="6 4" markerEnd={`url(#${u}-v)`}/>}
  </g>
}
function ValveProblems({ question, assessment }: { question: boolean; assessment: boolean }) {
  const { t, u } = useSvgIds()
  const marker = <defs><marker id={`${u}-v`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10L2 5Z" fill="#b8434f"/></marker></defs>
  if (question) return <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}>
    <title id={t}>{assessment ? 'A heart valve seen in a lengthwise section. When closed, its two flaps do not meet, and a dashed arrow shows some blood flowing back through the gap. Original schematic, not to scale.' : 'A leaky heart valve: when closed, the two flaps do not meet, so some blood flows backwards through the gap. Original schematic, not to scale.'}</title>
    {marker}
    <g transform="translate(-54 -24) scale(1.2)"><ValvePanel x={270} kind="leaky" u={u}/></g>
    <Lbl x={348} y={96} size={12}>flaps do not meet</Lbl><Leader d="M344 92L282 92" to={[279, 92]}/>
    <Lbl x={348} y={150} size={12} fill="#8a3f47">blood flows back</Lbl><Leader d="M344 146L275 126" to={[272, 124]}/>
    {!assessment && <Lbl x={270} y={228} anchor="middle" bold>leaky valve</Lbl>}
  </svg></div>
  return <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}>
    <title id={t}>Three heart valves in lengthwise section. Healthy: the flaps open wide and blood flows through strongly. Stiff: the flaps open only a little, so less blood flows through. Leaky: the flaps do not meet when closed, so some blood flows backwards. Original schematic, not to scale.</title>
    {marker}
    {(['healthy', 'stiff', 'leaky'] as const).map((k, i) => <g key={k}>
      <ValvePanel x={100 + i * 170} kind={k} u={u}/>
      <Lbl x={100 + i * 170} y={24} anchor="middle" bold size={13.5}>{k}</Lbl>
      <Lbl x={100 + i * 170} y={214} anchor="middle" size={11.5} fill="#526976">{['opens wide,', 'opens only', 'does not close;'][i]}</Lbl>
      <Lbl x={100 + i * 170} y={228} anchor="middle" size={11.5} fill="#526976">{['closes tightly', 'a little', 'blood flows back'][i]}</Lbl>
    </g>)}
  </svg></div>
}

function ValveTypes() {
  const { t } = useSvgIds()
  return <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}>
    <title id={t}>Two replacement heart valves seen from above. Left: a biological valve made of flexible tissue from an animal or human, with three soft flaps; it may wear out sooner. Right: a mechanical valve, a man-made ring with two hinged discs; it lasts longer, but the patient needs drugs to stop blood clots. Original schematic, not to scale.</title>
    <g transform="translate(135 104)">
      <circle r="64" fill="none" stroke="#d9c9b8" strokeWidth="7" strokeDasharray="3 3"/>
      <circle r="58" fill="#eab2aa" stroke="#a8545d" strokeWidth="3"/>
      {[-90, 30, 150].map(a => <path key={a} transform={`rotate(${a})`} d="M0 0Q26 6 58 0" fill="none" stroke="#8e3f48" strokeWidth="2.2"/>)}
      {[-30, 90, 210].map(a => <path key={a} transform={`rotate(${a})`} d="M14 0Q34 -6 50 0" fill="none" stroke="#d98c86" strokeWidth="1.4"/>)}
    </g>
    <g transform="translate(405 104)">
      <circle r="62" fill="#e3ebef" stroke="#6e8593" strokeWidth="9"/>
      <path d="M-4-52Q-40-30-42 0Q-40 30-4 52Z" fill="#c9d6dd" stroke="#55707f" strokeWidth="2"/>
      <path d="M4-52Q40-30 42 0Q40 30 4 52Z" fill="#c9d6dd" stroke="#55707f" strokeWidth="2"/>
      <circle cx="0" cy="-54" r="3.5" fill="#55707f"/><circle cx="0" cy="54" r="3.5" fill="#55707f"/>
    </g>
    <Lbl x={135} y={194} anchor="middle" bold size={13.5}>biological valve</Lbl>
    <Lbl x={135} y={211} anchor="middle" size={11.5}>tissue from an animal or human</Lbl>
    <Lbl x={135} y={226} anchor="middle" size={11.5} fill="#a1502a">may wear out sooner</Lbl>
    <Lbl x={405} y={194} anchor="middle" bold size={13.5}>mechanical valve</Lbl>
    <Lbl x={405} y={211} anchor="middle" size={11.5}>man-made · lasts longer</Lbl>
    <Lbl x={405} y={226} anchor="middle" size={11.5} fill="#a1502a">needs drugs to stop clots</Lbl>
  </svg></div>
}

function HeartReplacement({ hi }: { hi: 'transplant' | 'artificial' }) {
  const { t } = useSvgIds()
  const Y = (x: number, y: number, r: number) => <g transform={`translate(${x} ${y}) rotate(${r}) scale(.9)`} stroke={purple} strokeWidth="2.6" fill="none" strokeLinecap="round"><path d="M0 9V0M0 0L-6-7M0 0L6-7"/></g>
  return <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}>
    <title id={t}>{`Two ways to replace a failing heart. Left: a donor heart from another person, with the patient's defences, shown as small Y-shaped antibodies, able to attack it; the risk is immune rejection. Right: an artificial heart, a machine that pumps blood, powered through a cable by a battery pack; it is less likely to be rejected, but blood clots can form on it.${hi === 'transplant' ? ' The donor heart is highlighted.' : ' The artificial heart is highlighted.'} Original schematic, not to scale.`}</title>
    <g opacity={dim(hi === 'transplant')}>
      <Lbl x={135} y={26} anchor="middle" bold size={14}>donor heart</Lbl>
      <path d="M118 62V40M144 58Q146 38 164 36" stroke="#c9525e" strokeWidth="11" strokeLinecap="round" fill="none"/>
      <HeartShape x={134} y={108} s={1.05} fill="#e59a98"/>
      <path d="M100 96C112 112 126 118 132 140M156 92C152 116 146 128 138 146" stroke="#b74347" strokeWidth="3" fill="none"/>
      {Y(54, 90, 70)}{Y(48, 128, 100)}{Y(214, 102, -80)}{Y(206, 142, -110)}
      <Lbl x={135} y={200} anchor="middle" size={12}>from a donor</Lbl>
      <Lbl x={135} y={216} anchor="middle" size={12} bold fill="#a1502a">risk: immune rejection</Lbl>
    </g>
    <g opacity={dim(hi === 'artificial')}>
      <Lbl x={405} y={26} anchor="middle" bold size={14}>artificial heart</Lbl>
      <path d="M388 62V40M414 58Q416 38 434 36" stroke="#8aa0ad" strokeWidth="11" strokeLinecap="round" fill="none"/>
      <path d={blobPath(404, 104, 52, 46, [1, .96, 1.02, .97, 1, .95, 1.02, .98], .3)} fill="#dfe8ed" stroke="#55707f" strokeWidth="2.5"/>
      <circle cx="384" cy="104" r="18" fill="#f5f8fa" stroke="#55707f" strokeWidth="2"/><circle cx="426" cy="104" r="18" fill="#f5f8fa" stroke="#55707f" strokeWidth="2"/>
      <path d="M376 104h16M418 104h16" stroke="#55707f" strokeWidth="2"/>
      <path d="M430 146C440 166 470 160 482 176" stroke="#55707f" strokeWidth="2.5" fill="none"/>
      <rect x="478" y="172" width="34" height="22" rx="5" fill="#c9d6dd" stroke="#55707f" strokeWidth="2"/>
      <Lbl x={405} y={200} anchor="middle" size={12}>a machine that pumps</Lbl>
      <Lbl x={405} y={216} anchor="middle" size={12} bold fill="#a1502a">risk: blood clots</Lbl>
    </g>
    <Lbl x={270} y={244} anchor="middle" size={11} fill="#526976">original schematic, not to scale</Lbl>
  </svg></div>
}

function Coronary({ focus, assessment }: { focus: string; assessment: boolean }) {
  if (focus === 'cardio-heart') return <CoronarySupply assessment={assessment}/>
  if (focus === 'cardio-blockage' || focus === 'cardio-stent') return <CoronaryArtery stent={focus === 'cardio-stent'} assessment={assessment}/>
  if (focus === 'cardio-blockage-muscle') return <CoronaryArtery stent={false} assessment={assessment} hiMuscle/>
  if (focus === 'cardio-treatment-question') return <CoronaryArtery stent={false} assessment={assessment} question/>
  if (focus === 'cardio-compare') return <TreatmentCompare/>
  if (focus === 'cardio-stent-balance') return <StentBalance/>
  if (focus === 'cardio-cholesterol') return <StatinVisual hi="cholesterol"/>
  if (focus === 'cardio-statin') return <StatinVisual hi="statin"/>
  if (focus === 'cardio-statin-balance') return <StatinTimeline/>
  if (focus === 'cardio-valve') return <ValveProblems question={false} assessment={assessment}/>
  if (focus === 'cardio-valve-question') return <ValveProblems question assessment={assessment}/>
  if (focus === 'cardio-valve-types') return <ValveTypes/>
  if (focus === 'cardio-transplant') return <HeartReplacement hi="transplant"/>
  if (focus === 'cardio-artificial') return <HeartReplacement hi="artificial"/>
  return <CoronarySupply assessment={assessment}/>
}

/* ---------- Lesson 15: health and disease ---------- */
function Virus({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>{[0, 45, 90, 135, 180, 225, 270, 315].map(a => <path key={a} transform={`rotate(${a})`} d="M0-7V-11" stroke="#4d8a4e" strokeWidth="1.6" strokeLinecap="round"/>)}<circle r="7" fill="#9fcf93" stroke="#4d8a4e" strokeWidth="1.4"/><circle cx="-2" cy="-1" r="1.6" fill="#4d8a4e"/><circle cx="2.5" cy="2" r="1.3" fill="#4d8a4e"/></g>
}
function Figure({ x, y, s = 1, fill = '#dceef8' }: { x: number; y: number; s?: number; fill?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill} stroke={ink} strokeWidth={2 / s}><circle cy="-44" r="17"/><path d="M-28 34Q-30-6-16-20Q0-26 16-20Q30-6 28 34Q0 40-28 34Z"/></g>
}
function Cloud({ x, y, s = 1, fill = '#f4eefa' }: { x: number; y: number; s?: number; fill?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-40 10Q-54 8-52-6Q-50-20-34-18Q-30-34-12-32Q0-44 16-34Q34-38 38-22Q54-18 50-2Q52 14 34 14Q20 22 4 16Q-12 24-24 16Q-34 20-40 10Z" fill={fill} stroke="#8a78b0" strokeWidth={1.6 / s}/>
}
function TwoWay({ id, d, colour = '#7a6aa0' }: { id: string; d: string; colour?: string }) {
  return <><defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10L2 5Z" fill={colour}/></marker></defs><path d={d} fill="none" stroke={colour} strokeWidth="2" markerStart={`url(#${id})`} markerEnd={`url(#${id})`}/></>
}
function OneWay({ id, d, colour = '#657a89', w = 2 }: { id: string; d: string; colour?: string; w?: number }) {
  return <><defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10L2 5Z" fill={colour}/></marker></defs><path d={d} fill="none" stroke={colour} strokeWidth={w} markerEnd={`url(#${id})`}/></>
}
const Svg = ({ t, title, children }: { t: string; title: string; children: ReactNode }) => <div className="science-bio-model"><svg viewBox="0 0 540 250" role="img" aria-labelledby={t}><title id={t}>{title}</title>{children}</svg></div>
const Note = () => <Lbl x={270} y={244} anchor="middle" size={11} fill="#526976">original schematic, not to scale</Lbl>

function HealthWeek() {
  const { t } = useSvgIds()
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const Drop = ({ x, y, k = 1.5 }: { x: number; y: number; k?: number }) => <path transform={`translate(${x} ${y}) scale(${k})`} d="M0-7Q6 0 0 5Q-6 0 0-7Z" fill="#9cc9e0" stroke="#3f86ad" strokeWidth={1 / k}/>
  const Moon = ({ x, y, k = 1.4 }: { x: number; y: number; k?: number }) => <g transform={`translate(${x} ${y}) scale(${k})`}><path d="M4-10A10 10 0 1 0 6 8A8 8 0 1 1 4-10Z" fill="#c9cfe6" stroke="#5f6b93" strokeWidth={1.2 / k}/><path d="M9-8l5 5M14-8l-5 5" stroke="#b8434f" strokeWidth={1.6 / k}/></g>
  const Exam = ({ x, y, k = 1.35 }: { x: number; y: number; k?: number }) => <g transform={`translate(${x} ${y}) scale(${k})`}><rect x="-9" y="-11" width="18" height="22" rx="2" fill="#fff" stroke={ink} strokeWidth={1.2 / k}/><path d="M-5-5h10M-5 0h10M-5 5h6" stroke="#9fb2bd"/><path d="M13-12l3-4M15-6l5-1M-13-12l-3-4" stroke="#c08a14" strokeWidth={1.6 / k} strokeLinecap="round"/></g>
  return <Svg t={t} title="Sam's week, shown as seven day tiles from Monday to Sunday. Sam has a cold from Monday to Thursday, sleeps badly from Wednesday to Friday, and worries about an exam on Friday. None of these is serious alone, but together Sam does not feel well. Invented example.">
    {days.map((d, i) => { const x = 20 + i * 72; return <g key={d}>
      <rect x={x} y="36" width="64" height="146" rx="12" fill={i === 4 ? '#fff6e6' : '#f4f8fa'} stroke="#c3d2da" strokeWidth="1.4"/>
      <Lbl x={x + 32} y={56} anchor="middle" bold size={12.5}>{d}</Lbl>
      {i <= 3 && <><Drop x={x + 22} y={86}/><Drop x={x + 42} y={92}/></>}
      {i >= 2 && i <= 4 && <Moon x={x + 26} y={126}/>}
      {i === 4 && <Exam x={x + 32} y={160}/>}
    </g> })}
    <Lbl x={18} y={210} size={12}>Sam's week:</Lbl>
    <Drop x={112} y={206} k={1.2}/><Lbl x={124} y={210} size={12}>a cold</Lbl>
    <Moon x={198} y={205} k={1}/><Lbl x={222} y={210} size={12}>poor sleep</Lbl>
    <Exam x={320} y={204} k={1}/><Lbl x={342} y={210} size={12}>exam worry</Lbl>
    <Lbl x={270} y={238} anchor="middle" size={11} fill="#526976">invented example</Lbl>
  </Svg>
}

function Wellbeing() {
  const { t, u } = useSvgIds()
  return <Svg t={t} title="Health is a state of physical and mental well-being. A person is shown in the middle. On the left, physical well-being is about the body. On the right, a thought bubble shows mental well-being: thoughts and feelings. A two-way arrow shows that the two can affect each other.">
    <Figure x={270} y={124} s={1.35} fill="#e6f1f7"/>
    <Cloud x={404} y={64} s={1.1}/>
    <circle cx="336" cy="84" r="5" fill="#f4eefa" stroke="#8a78b0" strokeWidth="1.4"/><circle cx="322" cy="92" r="3" fill="#f4eefa" stroke="#8a78b0" strokeWidth="1.2"/>
    <path d="M388 62q6-8 12 0M410 62q6-8 12 0M392 74q14 10 28 0" stroke="#6a5a90" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <Lbl x={118} y={108} anchor="end" bold size={14}>physical</Lbl><Lbl x={118} y={124} anchor="end" size={12}>the body</Lbl><Leader d="M122 116L238 138" to={[240, 138]}/>
    <Lbl x={404} y={122} anchor="middle" bold size={14}>mental</Lbl><Lbl x={404} y={138} anchor="middle" size={12}>thoughts and feelings</Lbl>
    <TwoWay id={`${u}-tw`} d="M150 200Q270 236 392 158"/>
    <Lbl x={270} y={240} anchor="middle" size={12} bold fill="#6a5a90">the two can affect each other</Lbl>
  </Svg>
}

function Spread({ question, noncomm = false }: { question: boolean; noncomm?: boolean }) {
  const { t, u } = useSvgIds()
  if (noncomm) return <Svg t={t} title="Two people. The person on the left has coronary heart disease, shown by a heart symbol. An arrow towards the second person is crossed out: a non-communicable disease cannot be caught from someone else. Original schematic.">
    <Figure x={130} y={140}/><Figure x={410} y={140}/>
    <HeartShape x={130} y={140} s={.28} fill="#e59a98"/>
    <OneWay id={`${u}-n`} d="M176 130H356" colour="#9fb2bd"/>
    <path d="M254 114l32 32M286 114l-32 32" stroke="#b8434f" strokeWidth="4" strokeLinecap="round"/>
    <Lbl x={130} y={206} anchor="middle" size={12}>coronary heart disease</Lbl>
    <Lbl x={270} y={42} anchor="middle" bold size={14}>cannot be caught from someone else</Lbl>
    <Lbl x={270} y={232} anchor="middle" size={12} fill="#526976">non-communicable disease</Lbl>
  </Svg>
  return <Svg t={t} title={question ? 'Two people. Small virus particles labelled Disease X travel from the person on the left to the person on the right. Original schematic.' : 'Two people. Small virus particles, a kind of pathogen, travel from the person on the left to the person on the right: a communicable disease can spread between people. Original schematic.'}>
    <Figure x={130} y={140}/><Figure x={410} y={140} fill={question ? '#dceef8' : '#eaf5e6'}/>
    {[[190, 112, .9], [226, 128, 1], [262, 106, .8], [300, 124, 1], [336, 110, .9]].map(([x, y, k], i) => <Virus key={i} x={x} y={y} s={k}/>)}
    <OneWay id={`${u}-c`} d="M176 150H360" colour="#4d8a4e"/>
    {question
      ? <><rect x="196" y="28" width="148" height="28" rx="14" fill="#eef7ea" stroke="#4d8a4e" strokeWidth="1.4"/><Lbl x={270} y={47} anchor="middle" bold>Disease X · a virus</Lbl></>
      : <><Lbl x={270} y={42} anchor="middle" bold size={14}>pathogens pass between people</Lbl><Lbl x={270} y={232} anchor="middle" size={12} fill="#526976">communicable disease: it can spread</Lbl></>}
    <Lbl x={130} y={206} anchor="middle" size={12}>ill</Lbl><Lbl x={410} y={206} anchor="middle" size={12}>catches it</Lbl>
  </Svg>
}

function ImmuneDefence() {
  const { t } = useSvgIds()
  const ring = (cx: number, n: number, gaps: boolean) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; if (gaps && i % 3 !== 0) return null; return <g key={i} transform={`translate(${cx + Math.cos(a) * 66} ${118 + Math.sin(a) * 66})`}><circle r="10" fill="#dceef8" stroke={ink} strokeWidth="1.4"/><circle r="4.5" fill={purple}/></g> })
  return <Svg t={t} title="Two circles stand for the body. Left: a working immune system, a full ring of white blood cells, keeps pathogens outside. Right: an immune system that does not work properly, with gaps in the ring, so pathogens get inside and infections are more likely. Original schematic.">
    <circle cx="140" cy="118" r="54" fill="#fbf1ec"/><circle cx="400" cy="118" r="54" fill="#fbf1ec"/>
    {ring(140, 18, false)}{ring(400, 18, true)}
    {[[52, 60], [226, 70], [60, 184], [224, 176]].map(([x, y], i) => <Virus key={i} x={x} y={y} s={.9}/>)}
    {[[380, 100], [412, 138], [424, 92], [470, 44], [332, 186]].map(([x, y], i) => <Virus key={i} x={x} y={y} s={.9}/>)}
    <Lbl x={140} y={28} anchor="middle" bold size={13.5}>working immune system</Lbl>
    <Lbl x={400} y={28} anchor="middle" bold size={13.5}>not working properly</Lbl>
    <Lbl x={140} y={214} anchor="middle" size={12}>pathogens kept out</Lbl>
    <Lbl x={400} y={214} anchor="middle" size={12} bold fill="#a1502a">more infections likely</Lbl>
    <Lbl x={270} y={238} anchor="middle" size={11} fill="#526976">ring of white blood cells · original schematic</Lbl>
  </Svg>
}

function VirusCancer() {
  const { t, u } = useSvgIds()
  const cell = (x: number, y: number, r = 34, k = 0) => <g><path d={blobPath(x, y, r, r * .9, [1, .96, 1.03, .98, 1.01, .95, 1.02, .99], k)} fill="#fbe7df" stroke="#b27d74" strokeWidth="1.8"/><circle cx={x - 4} cy={y + 2} r={r * .32} fill="#e7c6d9" stroke="#a07090" strokeWidth="1.2"/></g>
  return <Svg t={t} title="Three steps. A virus enters a body cell. The virus lives inside the cell. In some cases this can trigger the cell to divide out of control, forming a growing clump of cells: some viruses can trigger some cancers. Not every infected person gets cancer. Original schematic.">
    {cell(84, 116)}<Virus x={40} y={72} s={1.1}/><OneWay id={`${u}-1`} d="M50 80L64 94" colour="#4d8a4e"/>
    {cell(250, 116, 34, 1)}<Virus x={256} y={124} s={.9}/>
    {[[420, 96], [452, 108], [436, 134], [404, 128], [470, 140], [446, 162], [412, 158], [478, 114]].map(([x, y], i) => <g key={i}>{cell(x, y, 17, i)}</g>)}
    <OneWay id={`${u}-2`} d="M134 116H194"/><OneWay id={`${u}-3`} d="M300 116H362"/>
    <Lbl x={84} y={180} anchor="middle" bold size={12.5}>a virus enters</Lbl><Lbl x={84} y={195} anchor="middle" size={12}>a body cell</Lbl>
    <Lbl x={250} y={180} anchor="middle" bold size={12.5}>it lives</Lbl><Lbl x={250} y={195} anchor="middle" size={12}>inside the cell</Lbl>
    <Lbl x={440} y={196} anchor="middle" bold size={12.5}>cells may divide</Lbl><Lbl x={440} y={211} anchor="middle" size={12}>out of control</Lbl>
    <Lbl x={270} y={32} anchor="middle" bold size={14}>some viruses can trigger some cancers</Lbl>
    <Lbl x={270} y={238} anchor="middle" size={11.5} fill="#526976">this does not happen to every infected person</Lbl>
  </Svg>
}

function Allergy() {
  const { t, u } = useSvgIds()
  const Pollen = ({ x, y }: { x: number; y: number }) => <g transform={`translate(${x} ${y})`}>{Array.from({ length: 12 }, (_, i) => <path key={i} transform={`rotate(${i * 30})`} d="M0-9V-13" stroke="#a47b26" strokeWidth="1.6" strokeLinecap="round"/>)}<circle r="9" fill={yellow} stroke="#a47b26" strokeWidth="1.4"/></g>
  const Guard = ({ x, y }: { x: number; y: number }) => <g><circle cx={x} cy={y} r="16" fill="#dceef8" stroke={ink} strokeWidth="1.6"/><circle cx={x - 2} cy={y} r="7" fill={purple}/></g>
  return <Svg t={t} title="An allergy. First, the immune system reacts to a pathogen. Later it also reacts to something harmless, such as pollen. This reaction can cause a skin rash or asthma, where the airways narrow. Original schematic.">
    <Lbl x={24} y={36} bold size={13}>1 · reacts to a pathogen</Lbl>
    <Virus x={60} y={78} s={1.2}/><OneWay id={`${u}-a`} d="M76 78H106" colour="#8a78b0"/><Guard x={126} y={78}/>
    <Lbl x={24} y={140} bold size={13}>2 · then reacts to</Lbl><Lbl x={24} y={156} bold size={13}>something harmless</Lbl>
    <Pollen x={60} y={194}/><OneWay id={`${u}-b`} d="M76 194H106" colour="#8a78b0"/><Guard x={126} y={194}/>
    <OneWay id={`${u}-c`} d="M150 186Q220 150 292 90" w={2.4}/><OneWay id={`${u}-d`} d="M150 200Q220 206 292 186" w={2.4}/>
    <path d="M304 60H500V120H304Z" fill="#f6d9cc" stroke="#b27d74" strokeWidth="1.6" rx="10"/>
    {[[332, 80], [352, 96], [376, 78], [398, 100], [424, 84], [448, 98], [470, 80]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#d9707a" fillOpacity=".7"/>)}
    <Lbl x={402} y={48} anchor="middle" bold size={13}>skin rash</Lbl>
    <path d="M304 164H500M304 208H500" stroke="#b27d74" strokeWidth="2"/>
    <path d="M304 168H370Q400 180 430 168H500V204H430Q400 192 370 204H304Z" fill="#f9e3dc"/>
    <path d="M370 168Q400 180 430 168M370 204Q400 192 430 204" fill="none" stroke="#b27d74" strokeWidth="2"/>
    <Lbl x={402} y={154} anchor="middle" bold size={13}>asthma</Lbl><Lbl x={402} y={228} anchor="middle" size={12}>airways narrow</Lbl>
    <Lbl x={126} y={116} anchor="middle" size={11}>white blood cell</Lbl>
  </Svg>
}

function BodyMind() {
  const { t, u } = useSvgIds()
  const box = (x: number, head: string, sub: string, fill: string) => <g><rect x={x - 76} y="70" width="152" height="96" rx="16" fill={fill} stroke="#b9c9d2" strokeWidth="1.4"/><Lbl x={x} y={146} anchor="middle" bold size={13}>{head}</Lbl><Lbl x={x} y={160} anchor="middle" size={11.5} fill="#526976">{sub}</Lbl></g>
  return <Svg t={t} title="Physical and mental health can affect each other. A long-term illness stops a person playing sport. This leads to low mood that lasts a long time, which can be depression. A return arrow shows mental health can affect the body too. Original schematic.">
    {box(92, 'long illness', 'physical health', '#eef7fb')}{box(270, 'stops sport', 'daily life changes', '#fbf4e2')}{box(448, 'low mood', 'mental health', '#f4eefa')}
    <Figure x={82} y={114} s={.55} fill="#dceef8"/><g transform="translate(114 100)"><rect x="-3.5" y="-20" width="7" height="26" rx="3.5" fill="#fff" stroke={ink} strokeWidth="1.3"/><circle cy="9" r="6" fill="#d9707a" stroke={ink} strokeWidth="1.3"/><path d="M0 8V-12" stroke="#d9707a" strokeWidth="3"/></g>
    <g transform="translate(270 104)"><circle r="16" fill="#fff" stroke={ink} strokeWidth="1.6"/><path d="M-16 0Q0-8 16 0M-11-11Q0 0-11 11M11-11Q0 0 11 11" fill="none" stroke={ink} strokeWidth="1.2"/><path d="M-22-22L22 22" stroke="#b8434f" strokeWidth="3"/></g>
    <Cloud x={448} y={104} s={.62} fill="#e3e0ee"/><path d="M438 128l-3 8M450 128l-3 8M462 128l-3 8" stroke="#6a8fb0" strokeWidth="1.6"/>
    <OneWay id={`${u}-1`} d="M170 118H192" w={2.4}/><OneWay id={`${u}-2`} d="M348 118H370" w={2.4}/>
    <OneWay id={`${u}-3`} d="M448 170Q448 214 270 214Q92 214 92 172" colour="#8a78b0"/>
    <Lbl x={270} y={236} anchor="middle" size={12} fill="#6a5a90">mental health can affect the body too</Lbl>
    <Lbl x={270} y={40} anchor="middle" bold size={14}>body and mind affect each other</Lbl>
  </Svg>
}

function HealthFactors({ hi }: { hi: 'dietStress' | 'life' }) {
  const { t, u } = useSvgIds()
  const on = (k: 'diet' | 'stress' | 'life') => dim(hi === 'life' ? k === 'life' : k !== 'life')
  return <Svg t={t} title={`Other factors that affect health. A person sits in the middle. Arrows point to them from a plate of food (diet), a tangle of lines (stress) and a house and clinic (life situation: money, housing and access to healthcare).${hi === 'life' ? ' Life situation is highlighted.' : ' Diet and stress are highlighted.'} Original schematic.`}>
    <Figure x={270} y={138} s={1.1} fill="#e6f1f7"/>
    <g opacity={on('diet')}><g transform="translate(86 74)"><circle r="30" fill="#fff" stroke={ink} strokeWidth="1.6"/><circle r="22" fill="none" stroke="#c3d2da"/><path d="M0 0L0-22A22 22 0 0 1 19 11Z" fill="#9fcf93"/><path d="M0 0L19 11A22 22 0 0 1-19 11Z" fill="#f0cf73"/><path d="M0 0L-19 11A22 22 0 0 1 0-22Z" fill="#e8a08c"/></g>
      <Lbl x={86} y={124} anchor="middle" bold>diet</Lbl><OneWay id={`${u}-d`} d="M120 84L222 112"/></g>
    <g opacity={on('stress')}><path d="M424 50q10-14 20 0t20 0t20 0M424 64q10-14 20 0t20 0t20 0M424 78q10-14 20 0t20 0t20 0" fill="none" stroke="#c08a14" strokeWidth="2"/>
      <Lbl x={454} y={104} anchor="middle" bold>stress</Lbl><OneWay id={`${u}-s`} d="M416 70L318 106"/></g>
    <g opacity={on('life')}><g transform="translate(410 172)"><path d="M-40 10L-20-10L0 10V36H-40Z" fill="#f4e3c8" stroke={ink} strokeWidth="1.6"/><rect x="10" y="4" width="36" height="32" rx="3" fill="#eef7fb" stroke={ink} strokeWidth="1.6"/><path d="M28 12v16M20 20h16" stroke="#b8434f" strokeWidth="3"/></g>
      <Lbl x={456} y={225} anchor="end" bold>life situation</Lbl><Lbl x={530} y={240} anchor="end" size={11.5} fill="#526976">money · housing · healthcare</Lbl><OneWay id={`${u}-l`} d="M366 190L318 170"/></g>
    <Lbl x={270} y={224} anchor="middle" size={12} bold>physical and mental health</Lbl>
  </Svg>
}

function AbsenceChart() {
  const { t } = useSvgIds()
  const data: [string, number, string][] = [['colds', 24, '#9cc9e0'], ['stomach bugs', 12, '#b9d9a8'], ['asthma', 8, '#d9c6ea'], ['injuries', 6, '#f0cf9a']]
  const x0 = 80, y0 = 200, k = 6.5, bw = 70
  return <Svg t={t} title="Bar chart of example data, not real measurements: the number of students who missed school in one term for each reason. Colds 24, stomach bugs 12, asthma 8, injuries 6. The vertical axis goes from 0 to 24, with gridlines every 2 students.">
    {Array.from({ length: 13 }, (_, i) => i * 2).map(v => <g key={v}><path d={`M${x0} ${y0 - v * k}H${x0 + 420}`} stroke={v % 4 ? '#eef2f4' : '#d6e1e6'} strokeWidth="1"/>{v % 4 === 0 && <Lbl x={x0 - 8} y={y0 - v * k + 4} anchor="end" size={11}>{v}</Lbl>}</g>)}
    {data.map(([name, v, c], i) => { const x = x0 + 30 + i * 102; return <g key={name}><rect x={x} y={y0 - v * k} width={bw} height={v * k} fill={c} stroke={ink} strokeWidth="1.2"/><Lbl x={x + bw / 2} y={y0 + 18} anchor="middle" size={12}>{name}</Lbl></g> })}
    <path d={`M${x0} ${y0 - 25 * k}V${y0}H${x0 + 420}`} fill="none" stroke={ink} strokeWidth="1.6"/>
    <text x="24" y={y0 - 12 * k} transform={`rotate(-90 24 ${y0 - 12 * k})`} textAnchor="middle" fill={ink} fontSize="12">number of students</text>
    <Lbl x={290} y={242} anchor="middle" size={11} fill="#526976">example data · not real measurements</Lbl>
  </Svg>
}

function Health({ focus, assessment }: { focus: string; assessment: boolean }) {
  if (focus === 'health-week') return <HealthWeek/>
  if (focus === 'health-wellbeing') return <Wellbeing/>
  if (focus === 'health-communicable') return <Spread question={false}/>
  if (focus === 'health-noncommunicable') return <Spread question={false} noncomm/>
  if (focus === 'health-classify-question') return <Spread question/>
  if (focus === 'health-immune' || focus === 'health-interactions') return <ImmuneDefence/>
  if (focus === 'health-virus-cancer') return <VirusCancer/>
  if (focus === 'health-allergy') return <Allergy/>
  if (focus === 'health-physical-mental') return <BodyMind/>
  if (focus === 'health-life') return <HealthFactors hi="life"/>
  if (focus === 'health-diet-stress' || focus === 'health-factors') return <HealthFactors hi="dietStress"/>
  if (focus === 'health-absence-chart') return <AbsenceChart/>
  return <Wellbeing/>
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

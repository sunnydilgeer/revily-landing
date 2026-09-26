import { useId, type ReactNode } from 'react'
import { Arrow, Badge, Bacterium, BodyCell, Diagram, Label, blob, infectionPalette as c, seeded } from './InfectionVisuals'

// Lessons 22–23: original, code-native schematics of the body's defences. Not to scale; not micrographs.
// Colour code as the other B3 diagrams, plus slate blue = white blood cells, pale yellow = mucus, green = acid.
const wbcFill = '#e3e9f7', wbcLine = '#5d74a8', wbcNucleus = '#8fa6d6', mucus = '#efe7b3', mucusLine = '#c3b152', acid = '#8fbf4f'
const bodyFill = '#f7e8db', bodyLine = '#c69f84', lungFill = '#f4d6d6', airway = '#d9958b', stomachFill = '#f1c7cc', stomachLine = '#c77b86'
type Pt = [number, number]

function WhiteCell({ cx, cy, r = 34, seed = 5, children }: { cx: number; cy: number; r?: number; seed?: number; children?: ReactNode }) {
  return <g><path d={blob(cx, cy, r, r * .92, seed, .1)} fill={wbcFill} stroke={wbcLine} strokeWidth="2" />{children}
    {[[-8, -6, .34], [6, -9, .3], [4, 7, .3]].map(([dx, dy, k], i) => <circle key={i} cx={cx + dx * r / 34} cy={cy + dy * r / 34} r={r * k} fill={wbcNucleus} opacity=".85" />)}</g>
}
function RedCell({ cx, cy, r = 14 }: { cx: number; cy: number; r?: number }) {
  return <g><circle cx={cx} cy={cy} r={r} fill="#e98b8b" stroke="#b85b5b" strokeWidth="1.4" /><circle cx={cx} cy={cy} r={r * .45} fill="#f2b0b0" /></g>
}
function Toxin({ x, y, faded = false }: { x: number; y: number; faded?: boolean }) {
  return <path d={`M${x} ${y - 5}l5 5l-5 5l-5 -5z`} fill={c.bugDeep} opacity={faded ? .35 : .9} />
}
function Antitoxin({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 8} ${y - 6}q8 6 0 12`} stroke={wbcLine} strokeWidth="3.5" fill="none" strokeLinecap="round" />
}
// Y-shaped antibody. A triangular notch at each tip fits a triangular antigen.
function Antibody({ x, y, angle = 0, colour = wbcLine }: { x: number; y: number; angle?: number; colour?: string }) {
  return <g transform={`rotate(${angle} ${x} ${y})`} stroke={colour} strokeWidth="3.2" fill="none" strokeLinecap="round">
    <path d={`M${x} ${y + 16}V${y + 2}M${x} ${y + 2}L${x - 9} ${y - 8}M${x} ${y + 2}L${x + 9} ${y - 8}`} />
    <path d={`M${x - 13} ${y - 11}l4 3l4 -3M${x + 5} ${y - 11}l4 3l4 -3`} strokeWidth="2.2" />
  </g>
}

// ---------- The body and its entrances ----------
const PART_POINT: Record<string, Pt> = { nose: [250, 58], skin: [330, 140], airways: [252, 132], stomach: [284, 256] }
const PART_LABEL: Record<string, [number, string]> = { nose: [60, 'nose'], skin: [112, 'skin'], airways: [164, 'trachea and bronchi'], stomach: [254, 'stomach'] }
const ORDER = ['skin', 'nose', 'airways', 'stomach']
function Body({ dim }: { dim: (part: string) => boolean }) {
  return <g>
    <path d="M168 300V146Q168 106 208 102H292Q332 106 332 146V300Z" fill={bodyFill} stroke={dim('skin') ? bodyLine : c.ink} strokeWidth={dim('skin') ? 2 : 3.5} />
    <rect x={238} y={80} width={24} height={26} fill={bodyFill} stroke="none" />
    <circle cx={250} cy={50} r={32} fill={bodyFill} stroke={dim('skin') ? bodyLine : c.ink} strokeWidth={dim('skin') ? 2 : 3.5} />
    <path d="M218 44C220 16 280 14 282 44C272 30 230 30 218 44Z" fill="#6d5a4b" />
    <circle cx={238} cy={48} r="2.4" fill={c.ink} /><circle cx={262} cy={48} r="2.4" fill={c.ink} /><path d="M242 70q8 5 16 0" stroke={bodyLine} strokeWidth="1.8" fill="none" />
    <g opacity={dim('nose') ? .45 : 1}><path d="M250 50l-6 12h12z" fill={dim('nose') ? '#ecd2bf' : '#e8b9a0'} stroke={dim('nose') ? bodyLine : c.ink} strokeWidth="1.6" strokeLinejoin="round" /></g>
    <g opacity={dim('airways') ? .4 : 1}>
      {[[218, 196], [282, 196]].map(([x, y]) => <path key={x} d={blob(x, y, 30, 46, x, .06)} fill={lungFill} opacity=".7" />)}
      <path d="M250 84V164M250 164L222 196M250 164L278 196" stroke={airway} strokeWidth="8" fill="none" strokeLinecap="round" />
      {[100, 116, 132, 148].map(y => <path key={y} d={`M245 ${y}h10`} stroke="#f7e1dd" strokeWidth="2" />)}
    </g>
    <path d="M258 90C262 140 262 200 262 232" stroke="#e7c3b0" strokeWidth="4" fill="none" opacity=".7" />
    <g opacity={dim('stomach') ? .4 : 1}><path d="M262 232C300 226 316 250 304 276C292 300 250 292 246 268C244 252 262 256 262 232Z" fill={stomachFill} stroke={stomachLine} strokeWidth="2" /></g>
  </g>
}
function Handle() {
  return <g><rect x={20} y={128} width={110} height={16} rx="8" fill="#c9d3da" stroke={c.ink} strokeWidth="1.6" /><rect x={112} y={112} width={14} height={48} rx="4" fill="#aebbc5" stroke={c.ink} strokeWidth="1.4" />
    {[[40, 124, -10], [64, 150, 12], [86, 122, 6], [52, 150, -4]].map(([x, y, a], i) => <Bacterium key={i} cx={x} cy={y} length={16} thick={7} angle={a} seed={i + 2} />)}
    <text x={20} y={180} fill={c.ink} fontSize="13" fontWeight="600">door handle</text></g>
}
function BodyScene({ focus, assessment }: { focus: string; assessment: boolean }) {
  const part = focus.replace('defence-body-', '')
  const question = part === 'question', lit = part === 'overview' || question ? '' : part
  const dim = (p: string) => lit !== '' && lit !== p
  const titles: Record<string, string> = {
    overview: 'A person and a door handle covered in bacteria. The body has defences at its skin, nose, airways and stomach that keep most pathogens out.',
    skin: 'A person with the skin highlighted. Bacteria from a door handle bounce off the skin, which acts as a barrier.',
    nose: 'A person with the nose highlighted. A zoomed-in circle shows hairs and sticky mucus inside the nose trapping particles.',
    stomach: 'A person with the stomach highlighted. A zoomed-in circle shows hydrochloric acid in the stomach killing swallowed bacteria.',
  }
  const clip = useId().replace(/:/g, '')
  const title = question ? (assessment ? 'A person with four numbered defences marked on the body, from 1 to 4.' : 'A person with four numbered defences: 1 nose, 2 skin, 3 trachea and bronchi, 4 stomach.') : titles[part] || titles.overview
  return <Diagram title={title}>
    <Body dim={dim} />
    {part === 'overview' && <g><Handle /><path d="M130 118C170 80 200 64 236 60" stroke={c.ink} strokeWidth="1.6" strokeDasharray="5 5" fill="none" /><path d="M130 150C146 150 156 152 166 156" stroke={c.ink} strokeWidth="1.6" strokeDasharray="5 5" fill="none" />
      <text x={20} y={26} fill={c.ink} fontSize="14" fontWeight="700">every way in is guarded</text></g>}
    {part === 'skin' && <g>{[[110, 170], [96, 214], [122, 250]].map(([x, y], i) => <g key={i}><Bacterium cx={x} cy={y} length={24} thick={10} seed={i + 4} angle={-8} /><Arrow x1={138} y1={y} x2={160} y2={y} colour={c.bug} width={1.8} /><Arrow x1={158} y1={y + 8} x2={136} y2={y + 20} colour={c.bug} width={1.8} /></g>)}
      <Label x={20} y={126} lines={['skin: a barrier']} strong /></g>}
    {part === 'nose' && <g><path d="M244 60L150 88" stroke={c.ink} strokeWidth="1.2" strokeDasharray="3 3" /><clipPath id={`${clip}n`}><circle cx={100} cy={110} r={55} /></clipPath><circle cx={100} cy={110} r={56} fill="white" stroke={c.ink} strokeWidth="2" /><g clipPath={`url(#${clip}n)`}>
      <path d="M52 124C76 110 124 110 148 124V150H52Z" fill={mucus} stroke={mucusLine} strokeWidth="1.4" />{[62, 74, 86, 98, 110, 122, 134].map((x, i) => <path key={x} d={`M${x} 150q${i % 2 ? 4 : -4} -22 0 -44`} stroke="#6d5a4b" strokeWidth="1.8" fill="none" />)}
      {[[70, 126], [104, 120], [128, 132]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.4" fill="#8d8d8d" />)}<Bacterium cx={90} cy={136} length={18} thick={8} seed={9} /></g>
      <text x={100} y={44} textAnchor="middle" fill={c.ink} fontSize="12">inside the nose, zoomed in</text>
      <Label x={20} y={214} to={[76, 140]} lines={['hairs and mucus', 'trap particles']} strong /></g>}
    {part === 'stomach' && <g><path d="M262 262L160 236" stroke={c.ink} strokeWidth="1.2" strokeDasharray="3 3" /><clipPath id={`${clip}s`}><circle cx={104} cy={222} r={55} /></clipPath><circle cx={104} cy={222} r={56} fill="white" stroke={c.ink} strokeWidth="2" /><g clipPath={`url(#${clip}s)`}>
      <path d="M52 232C80 222 128 222 156 232V262C128 272 80 272 52 262Z" fill="#e6f1d2" stroke={acid} strokeWidth="1.6" />
      {[[72, 214], [118, 206], [96, 190]].map(([x, y], i) => <path key={i} d={`M${x} ${y}q5 8 0 12q-5 -4 0 -12z`} fill={acid} />)}
      {[[82, 246], [120, 244]].map(([x, y], i) => <g key={i} opacity=".55"><Bacterium cx={x} cy={y} length={20} thick={9} seed={i + 12} /><path d={`M${x - 8} ${y - 8}l16 16M${x + 8} ${y - 8}l-16 16`} stroke={c.ink} strokeWidth="2" /></g>)}</g>
      <Label x={16} y={148} lines={['hydrochloric acid', 'kills bacteria']} strong /></g>}
    {!question && part !== 'nose' && part !== 'stomach' && ORDER.map(p => <Label key={p} x={356} y={PART_LABEL[p][0]} to={PART_POINT[p]} lines={[PART_LABEL[p][1]]} dim={dim(p)} strong={lit === p} />)}
    {(part === 'nose' || part === 'stomach') && <Label x={356} y={PART_LABEL[part][0]} to={PART_POINT[part]} lines={[PART_LABEL[part][1]]} strong />}
    {question && ['nose', 'skin', 'airways', 'stomach'].map((p, i) => { const y = PART_LABEL[p][0]; const [tx, ty] = PART_POINT[p]
      return <g key={p}><path d={`M${364} ${y - 5}L${tx} ${ty}`} stroke={c.ink} strokeWidth="1.5" /><circle cx={tx} cy={ty} r="2.5" fill={c.ink} /><Badge n={i + 1} x={378} y={y - 5} />
        {!assessment && <text x={398} y={y} fill={c.ink} fontSize="14" fontWeight="600">{p === 'airways' ? <><tspan x={398}>trachea and</tspan><tspan x={398} dy={16}>bronchi</tspan></> : PART_LABEL[p][1]}</text>}</g> })}
  </Diagram>
}

// ---------- Inside the airway ----------
function AirwayScene({ focus }: { focus: string }) {
  const cilia = focus === 'defence-airway-cilia'
  const rand = seeded(7)
  return <Diagram viewBox="0 0 540 270" title={cilia ? 'Inside the trachea, zoomed in. Tiny hairs called cilia on the lining cells sweep a layer of mucus, with trapped bacteria and dust, towards the throat.' : 'Inside the trachea, zoomed in. A layer of sticky mucus on top of the lining cells has trapped bacteria and dust.'}>
    <text x={20} y={24} fill={c.ink} fontSize="14" fontWeight="600">Inside the trachea, zoomed in</text>
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={blob(52 + i * 56, 222, 27, 30, 30 + i, .05, .6)} fill={c.tissueFill} stroke={c.tissueLine} strokeWidth="1.6" />)}
    <g opacity={cilia ? 1 : .45}>{Array.from({ length: 44 }, (_, i) => { const x = 30 + i * 11.2; return <path key={i} d={`M${x} 192q${cilia ? 6 : 3} -10 ${cilia ? 10 : 4} -20`} stroke="#8a6a55" strokeWidth="2" fill="none" strokeLinecap="round" /> })}</g>
    <g opacity={cilia ? .8 : 1}><path d="M20 172C80 160 140 178 200 166S320 160 380 170S470 160 520 166V130C460 120 400 136 340 126S220 118 160 130S60 124 20 132Z" fill={mucus} stroke={mucusLine} strokeWidth="1.6" />
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={60 + i * 66 + rand() * 20} cy={146 + rand() * 12} r="3.6" fill="#8d8d8d" />)}
      {[90, 250, 410].map((x, i) => <Bacterium key={x} cx={x} cy={150} length={24} thick={10} seed={i + 21} angle={i * 8 - 6} />)}</g>
    {cilia && <g><Arrow x1={120} y1={104} x2={440} y2={104} width={3} /><text x={450} y={98} fill={c.ink} fontSize="13" fontWeight="700"><tspan x={450}>up to the</tspan><tspan x={450} dy={15}>throat</tspan></text></g>}
    <Label x={20} y={70} to={[140, 132]} lines={['mucus traps pathogens']} strong={!cilia} />
    <Label x={330} y={70} to={cilia ? [330, 184] : [336, 186]} lines={['cilia']} strong={cilia} dim={!cilia} />
    <text x={270} y={264} textAnchor="middle" fill={c.ink} fontSize="12">cells lining the airway</text>
  </Diagram>
}

// ---------- White blood cells ----------
function CutScene({ focus }: { focus: string }) {
  const part = focus.replace('defence-wbc-', '')
  const cells = part === 'cells'
  return <Diagram title={cells ? 'Skin cut open, with bacteria entering. In the blood vessel below, a white blood cell is highlighted among red blood cells.' : 'A cut through the skin, seen from the side. Bacteria get in through the gap and move towards a blood vessel below.'}>
    <path d="M10 60H196L214 112L232 60H530V96H240L214 148L188 96H10Z" fill="#f2d5c2" stroke={c.skinLine} strokeWidth="2" />
    <text x={20} y={50} fill={c.ink} fontSize="13">skin</text>
    <path d="M10 186H530V250H10Z" fill="#fbe7e7" stroke="#d9a1a1" strokeWidth="2" /><text x={20} y={272} fill={c.ink} fontSize="13">blood vessel</text>
    <g opacity={cells ? .35 : 1}>{[60, 150, 330, 420, 490].map((x, i) => <RedCell key={x} cx={x} cy={210 + (i % 2) * 18} />)}</g>
    <g opacity={cells || part === 'cut' ? 1 : .5}><WhiteCell cx={250} cy={218} r={24} /></g>
    {[[212, 40], [222, 120], [206, 158], [230, 172]].map(([x, y], i) => <Bacterium key={i} cx={x} cy={y} length={20} thick={9} seed={i + 30} angle={70} />)}
    <Arrow x1={170} y1={20} x2={204} y2={48} colour={c.bug} width={2} />
    {!cells && <><Label x={300} y={30} to={[222, 72]} lines={['cut: the barrier', 'is broken']} strong /><Label x={300} y={140} to={[226, 160]} lines={['bacteria get in']} strong colour={c.bugDeep} /></>}
    {cells && <Label x={300} y={150} to={[266, 206]} lines={['white blood cell']} strong colour={wbcLine} />}
  </Diagram>
}
function Phagocytosis() {
  const xs = [95, 270, 445]
  return <Diagram title="Phagocytosis in three steps. 1: a white blood cell finds a bacterium. 2: it surrounds the bacterium. 3: the bacterium is digested inside the white blood cell.">
    <WhiteCell cx={80} cy={140} r={46} /><Bacterium cx={148} cy={128} length={34} thick={14} seed={3} angle={-20} />
    <Bacterium cx={326} cy={140} length={30} thick={13} seed={3} />
    <path d="M262 94C304 92 336 102 352 122C334 116 316 118 308 128C302 136 302 144 308 152C316 162 334 164 352 158C336 178 304 188 262 186C226 184 212 162 214 140C216 114 232 96 262 94Z" fill={wbcFill} stroke={wbcLine} strokeWidth="2" opacity=".92" />{[[-14, 4], [-2, 14], [-20, 20]].map(([dx, dy], i) => <circle key={i} cx={254 + dx} cy={134 + dy} r="10" fill={wbcNucleus} opacity=".85" />)}{[[-12, 4], [0, 14], [-18, 18]].map(([dx, dy], i) => <circle key={i} cx={258 + dx} cy={140 + dy} r="10" fill={wbcNucleus} opacity=".85" />)}
    <WhiteCell cx={445} cy={140} r={50} seed={9}><g opacity=".5">{[[458, 126], [470, 140], [452, 150]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="5" ry="3" fill={c.bug} />)}</g></WhiteCell>
    <Arrow x1={180} y1={140} x2={206} y2={140} /><Arrow x1={352} y1={140} x2={378} y2={140} />
    {['1  finds it', '2  surrounds it', '3  digests it'].map((t, i) => <text key={t} x={xs[i]} y={228} textAnchor="middle" fill={c.ink} fontSize="14" fontWeight={i === 2 ? 700 : 500}>{t}</text>)}
    <text x={270} y={272} textAnchor="middle" fill={c.ink} fontSize="12">This is called phagocytosis. Drawn enlarged.</text>
  </Diagram>
}
function Summary() {
  const cards = ['swallow and digest it', 'antibodies lock on', 'antitoxins stop toxins']
  return <Diagram viewBox="0 0 540 250" title="Three ways white blood cells attack pathogens: 1 swallow and digest them (phagocytosis), 2 make antibodies that lock onto antigens, 3 make antitoxins that stop toxins working.">
    {cards.map((t, i) => <g key={t}><rect x={10 + i * 176} y={20} width={168} height={180} rx="12" fill={c.panelFill} stroke={c.panelLine} strokeWidth="1.5" /><Badge n={i + 1} x={94 + i * 176} y={20} />
      <text x={94 + i * 176} y={226} textAnchor="middle" fill={c.ink} fontSize="14" fontWeight="700">{t}</text></g>)}
    <WhiteCell cx={94} cy={116} r={50} seed={9}><Bacterium cx={104} cy={120} length={26} thick={11} seed={3} /></WhiteCell>
    <path d={blob(270, 116, 46, 24, 7, .03, 1, 16)} fill={c.bugFill} stroke={c.bug} strokeWidth="2" />{[[-30, -34, 180], [0, -40, 180], [30, -34, 180], [-16, 40, 0], [18, 40, 0]].map(([dx, dy, a], i) => <Antibody key={i} x={270 + dx} y={116 + dy} angle={a} />)}
    {[[420, 90], [460, 120], [420, 140], [470, 160]].map(([x, y], i) => <g key={i}><Toxin x={x} y={y} /><Antitoxin x={x + 12} y={y} /></g>)}
  </Diagram>
}

// ---------- Antigens, antibodies and antitoxins ----------
const ANTIGEN_ANGLES = [-150, -110, -70, -30, 10, 50, 130, 170, 90]
function antigenPoint(cx: number, cy: number, rx: number, ry: number, deg: number): Pt { const a = deg * Math.PI / 180; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] }
function Pathogen({ cx, cy, rx, ry, shape, dim = false }: { cx: number; cy: number; rx: number; ry: number; shape: 'triangle' | 'square'; dim?: boolean }) {
  return <g><path d={blob(cx, cy, rx, ry, cx, .03, 1, 18)} fill={c.bugFill} stroke={c.bug} strokeWidth="2.2" />
    <g opacity={dim ? .35 : 1}>{ANTIGEN_ANGLES.map(deg => { const [x, y] = antigenPoint(cx, cy, rx + 5, ry + 5, deg)
      return shape === 'triangle' ? <path key={deg} d={`M${x} ${y - 6}l6 10h-12z`} fill={c.bugDeep} transform={`rotate(${deg + 90} ${x} ${y})`} /> : <rect key={deg} x={x - 5} y={y - 5} width={10} height={10} fill="#8a6d2f" transform={`rotate(${deg} ${x} ${y})`} /> })}</g></g>
}
function lockedAntibodies(cx: number, cy: number, rx: number, ry: number, angles: number[]) {
  return angles.map(deg => { const [x, y] = antigenPoint(cx, cy, rx + 22, ry + 22, deg); return <Antibody key={deg} x={x} y={y} angle={deg - 90} /> })
}
function AntibodyScene({ focus, assessment }: { focus: string; assessment: boolean }) {
  const part = focus.replace('defence-antibody-', '')
  const P = { cx: 360, cy: 128, rx: 92, ry: 46 }
  if (part === 'question') return <Diagram title={assessment ? 'A pathogen with small molecules on its surface marked 1, and Y-shaped molecules locked onto some of them, marked 2.' : 'A pathogen with antigens on its surface, marked 1, and antibodies locked onto some of them, marked 2.'}>
    <Pathogen {...P} shape="triangle" />{lockedAntibodies(P.cx, P.cy, P.rx, P.ry, [-110, -30, 50, 130])}
    {(() => { const a1 = antigenPoint(P.cx, P.cy, P.rx + 5, P.ry + 5, 170), a2 = antigenPoint(P.cx, P.cy, P.rx + 30, P.ry + 30, 130)
      return <><path d={`M96 60L${a1[0]} ${a1[1]}`} stroke={c.ink} strokeWidth="1.5" /><circle cx={a1[0]} cy={a1[1]} r="2.5" fill={c.ink} /><Badge n={1} x={82} y={60} />
        <path d={`M96 150L${a2[0]} ${a2[1]}`} stroke={c.ink} strokeWidth="1.5" /><circle cx={a2[0]} cy={a2[1]} r="2.5" fill={c.ink} /><Badge n={2} x={82} y={150} /></> })()}
    {!assessment && <g fill={c.ink} fontSize="14" fontWeight="700"><text x={40} y={92}>antigens</text><text x={40} y={182}>antibodies</text></g>}
    <text x={270} y={280} textAnchor="middle" fill={c.ink} fontSize="12">Drawn enlarged, not to scale.</text>
  </Diagram>
  const titles: Record<string, string> = {
    antigen: 'A pathogen, drawn enlarged, with small triangle-shaped molecules called antigens all over its surface.',
    antibody: 'A white blood cell releases Y-shaped antibodies. Their tips fit the triangle-shaped antigens, and they lock onto the pathogen.',
    specific: 'Antibodies that fit triangle-shaped antigens lock onto the first pathogen. A second pathogen has square antigens, and the same antibody does not fit it.',
  }
  const showAntibodies = part !== 'antigen', specific = part === 'specific'
  return <Diagram title={titles[part] || titles.antigen}>
    {showAntibodies && <g opacity={specific ? .5 : 1}><WhiteCell cx={80} cy={128} r={50} />{[[150, 100, 90], [176, 150, 70], [200, 116, 100]].map(([x, y, a], i) => <Antibody key={i} x={x} y={y} angle={a} />)}</g>}
    <Pathogen {...P} shape="triangle" dim={false} />
    {showAntibodies && lockedAntibodies(P.cx, P.cy, P.rx, P.ry, [-110, -30, 50, 130])}
    {part === 'antigen' && <Label x={60} y={60} to={antigenPoint(P.cx, P.cy, P.rx + 5, P.ry + 5, -150)} lines={['antigens: unique', 'molecules on the surface']} strong colour={c.bugDeep} />}
    {part === 'antibody' && <><Label x={40} y={236} to={[80, 176]} lines={['white blood cell']} colour={wbcLine} /><Label x={250} y={236} to={antigenPoint(P.cx, P.cy, P.rx + 30, P.ry + 30, 130)} lines={['antibodies lock on']} strong colour={wbcLine} /></>}
    {specific && <g><Pathogen cx={140} cy={236} rx={60} ry={30} shape="square" /><Antibody x={236} y={236} angle={-90} /><path d="M262 222l14 14M276 222l-14 14" stroke={c.red} strokeWidth="3" />
      <Label x={300} y={236} lines={['does not fit:', 'different antigens']} strong /><Label x={380} y={30} lines={['fits: locks on']} strong colour={wbcLine} /></g>}
    {part === 'antigen' && <text x={270} y={284} textAnchor="middle" fill={c.ink} fontSize="12">Drawn enlarged, not to scale.</text>}
  </Diagram>
}
function AntitoxinScene() {
  return <Diagram title="Bacteria release toxins. A white blood cell releases antitoxins, which join onto the toxins and stop them working, so the body cells nearby are not damaged.">
    <Bacterium cx={70} cy={80} length={56} thick={22} seed={3} angle={-10} /><Bacterium cx={90} cy={130} length={56} thick={22} seed={5} angle={8} />
    {[[150, 70], [190, 100], [170, 136], [230, 80]].map(([x, y], i) => <Toxin key={i} x={x} y={y} />)}
    {[[280, 110], [320, 150], [300, 190], [352, 118]].map(([x, y], i) => <g key={i}><Toxin x={x} y={y} /><Antitoxin x={x + 12} y={y} /></g>)}
    <WhiteCell cx={240} cy={236} r={40} />{[[282, 226], [300, 210]].map(([x, y], i) => <Antitoxin key={i} x={x} y={y} />)}
    <BodyCell cx={460} cy={96} seed={2} /><BodyCell cx={482} cy={172} seed={5} />
    <Label x={20} y={196} lines={['bacteria']} strong colour={c.bugDeep} /><Label x={140} y={36} lines={['toxins']} strong colour={c.bugDeep} />
    <Label x={300} y={272} to={[296, 214]} lines={['antitoxins']} strong colour={wbcLine} /><Label x={400} y={250} lines={['cells protected']} strong />
  </Diagram>
}
function InfectionData() {
  const bacteria = [5, 30, 60, 70, 45, 15, 5], antibodies = [0, 2, 10, 35, 60, 70, 72]
  const X = (d: number) => 90 + d * 66, Y = (v: number) => 226 - v * 2.3
  const line = (vals: number[]) => vals.map((v, d) => `${d ? 'L' : 'M'}${X(d)} ${Y(v)}`).join('')
  return <Diagram viewBox="0 0 540 290" title="Graph of an infected cut over six days. The number of bacteria rises from day 0 to a peak on day 3, then falls to a low level by day 6. The antibody level starts near zero, rises steeply after day 2 and stays high.">
    <text x={20} y={22} fill={c.ink} fontSize="14" fontWeight="600">An infected cut over six days</text>
    <path d={`M90 226H500M90 226V40`} stroke={c.ink} strokeWidth="2" />
    {[0, 1, 2, 3, 4, 5, 6].map(d => <g key={d}><path d={`M${X(d)} 226v6`} stroke={c.ink} /><text x={X(d)} y={246} textAnchor="middle" fontSize="12" fill={c.ink}>{d}</text></g>)}
    <text x={295} y={266} textAnchor="middle" fontSize="12" fill={c.ink}>day</text>
    <text x={20} y={130} fontSize="12" fill={c.ink}><tspan x={20}>relative</tspan><tspan x={20} dy={15}>amount</tspan></text>
    <path d={line(bacteria)} stroke={c.bug} strokeWidth="3" fill="none" />{bacteria.map((v, d) => <circle key={d} cx={X(d)} cy={Y(v)} r="4" fill={c.bug} />)}
    <path d={line(antibodies)} stroke={wbcLine} strokeWidth="3" fill="none" strokeDasharray="8 5" />{antibodies.map((v, d) => <rect key={d} x={X(d) - 4} y={Y(v) - 4} width="8" height="8" fill={wbcLine} />)}
    <g fontSize="12"><path d="M110 280H134" stroke={c.bug} strokeWidth="3" /><text x={140} y={284} fill={c.bugDeep}>number of bacteria</text><path d="M300 280H324" stroke={wbcLine} strokeWidth="3" strokeDasharray="8 5" /><text x={330} y={284} fill={wbcLine}>antibody level</text></g>
  </Diagram>
}

export function DefenceVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('defence-body-')) return <BodyScene focus={focus} assessment={assessment} />
  if (focus.startsWith('defence-airway-')) return <AirwayScene focus={focus} />
  if (focus === 'defence-wbc-phago') return <Phagocytosis />
  if (focus === 'defence-wbc-summary') return <Summary />
  if (focus.startsWith('defence-wbc-')) return <CutScene focus={focus} />
  if (focus.startsWith('defence-antibody-')) return <AntibodyScene focus={focus} assessment={assessment} />
  if (focus === 'defence-antitoxin') return <AntitoxinScene />
  if (focus === 'defence-infection-data') return <InfectionData />
  return <BodyScene focus="defence-body-overview" assessment={false} />
}

// Shared with VaccineVisuals.tsx (Lesson 23) so white blood cells and antibodies look the same in both lessons.
export const defenceColours = { wbcFill, wbcLine, wbcNucleus }
export { WhiteCell, RedCell, Antibody }

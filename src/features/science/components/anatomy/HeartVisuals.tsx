import { AnatomyFigure, Flow, Pointer, anatomy, type DiagramIds } from './AnatomyFigure'

const colourNote = 'Blue means less oxygen, red means more oxygen; all blood is actually red.'
function Tube({ d, colour, width = 24 }: { d: string; colour: 'red' | 'blue'; width?: number }) {
  return <g fill="none" strokeLinecap="butt"><path d={d} stroke={colour === 'red' ? '#9f535c' : '#4c718c'} strokeWidth={width + 5}/><path d={d} stroke={colour === 'red' ? '#f0b7b2' : '#b4d7e6'} strokeWidth={width}/><path d={d} stroke="#ffffff" strokeOpacity=".3" strokeWidth={width * .38}/></g>
}

/** Front-view cutaway. The great vessels are separated to keep their origins visible. */
function HeartSection({ ids, labels = true, stage = 'all', vesselQuestion = false, pacemaker = false }: { ids: DiagramIds; labels?: boolean; stage?: string; vesselQuestion?: boolean; pacemaker?: boolean }) {
  const atria = stage === 'atria', ventricles = stage === 'ventricles', out = stage === 'out'
  return <>
    <path d="M177 160C192 137 251 134 292 160C329 131 387 139 409 174C449 235 438 319 402 370C381 400 345 427 328 434C276 420 211 391 184 345C153 292 151 213 177 160Z" fill={`url(#${ids.ref('muscle')})`} stroke="#965d65" strokeWidth="2.5"/>
    <path d="M177 160C192 137 251 134 292 160C329 131 387 139 409 174C449 235 438 319 402 370C381 400 345 427 328 434C276 420 211 391 184 345C153 292 151 213 177 160Z" fill={`url(#${ids.ref('fibres')})`}/>
    <Tube d="M184 96V196" colour="blue"/>
    <Tube d="M161 365V290Q161 244 193 225" colour="blue" width={22}/>
    <Tube d="M481 174H384M481 207H387" colour="red" width={19}/>
    <path d="M194 165C222 147 263 160 270 183L270 231Q236 247 193 233C174 224 173 184 194 165Z" fill="#d9ebf3" stroke={atria ? anatomy.oxygen : '#739db3'} strokeWidth={atria ? 4 : 2}/>
    <path d="M347 176C366 154 398 166 408 185Q418 208 399 229L348 234Z" fill="#fbe0d9" stroke={atria ? anatomy.oxygen : '#b9797c'} strokeWidth={atria ? 4 : 2}/>
    <path d="M193 244Q230 259 271 241C274 274 286 285 295 302L301 392C263 377 218 355 198 320Q182 284 193 244Z" fill="#d9ebf3" stroke={ventricles ? anatomy.oxygen : '#739db3'} strokeWidth={ventricles ? 4 : 2}/>
    <path d="M339 247Q368 260 397 244C413 286 399 344 335 394C331 362 325 329 328 301Z" fill="#fbe0d9" stroke={ventricles ? anatomy.oxygen : '#b9797c'} strokeWidth={ventricles ? 4 : 2}/>
    {/* Open atrioventricular passages; no transverse muscle partition between each atrium and ventricle. */}
    <path d="M193 224Q231 237 270 223V264H193Z" fill="#d9ebf3"/>
    <path d="M343 222Q371 234 397 222V264H339Z" fill="#fbe0d9"/>
    {/* Continuous left-ventricular outflow into the aorta, medial to the left atrium. */}
    <Tube d="M345 284Q337 257 328 226V104C328 59 389 39 422 76Q442 99 442 133" colour="red" width={23}/>
    <Tube d="M354 65L351 32M380 59V25M405 65L416 34" colour="red" width={10}/>
    {/* Right-ventricular outflow and the pulmonary trunk are anterior to the aorta. */}
    <path d="M270 307Q293 276 293 242V152Q293 125 319 121H393M314 121H248Q228 121 219 115" fill="none" stroke="#fffefa" strokeWidth="35" strokeLinecap="butt"/>
    <Tube d="M270 307Q293 276 293 242V152Q293 125 319 121H393M314 121H248Q228 121 219 115" colour="blue" width={23}/>
    {/* Atrioventricular leaflets are in their own chamber openings, never across the septum. */}
    <g fill="#fff4ce" stroke="#a99062" strokeWidth="1.8"><path d="M192 241Q205 243 220 265L211 269Q198 258 192 241ZM270 241Q260 250 250 268L241 264Q251 246 270 241Z"/><path d="M339 245Q350 249 359 269L350 272Q340 258 339 245ZM397 242Q385 248 380 268L371 266Q379 247 397 242Z"/></g>
    <g fill="none" stroke="#bb9a7c" strokeWidth="1.3"><path d="M213 266L222 309L247 266M351 270L359 318L375 268"/></g>
    <g fill="#bd7774"><path d="M213 321l9-20l9 26Z"/><path d="M348 337l11-25l10 20Z"/></g>
    {/* Semilunar valves lie at the ventricular exits, within the corresponding outflow. */}
    <g fill="#fff4ce" stroke="#a99062" strokeWidth="1.5"><path d="M282 202Q289 196 286 186L282 187ZM304 202Q297 196 300 186L304 187Z"/><path d="M317 179Q324 173 321 163L317 164ZM339 179Q332 173 335 163L339 164Z"/></g>
    <g opacity={atria || stage === 'all' ? 1 : .38}><Flow ids={ids} d="M184 112V168" colour="blue" width={2.4}/><Flow ids={ids} d="M161 343V291Q161 258 187 242" colour="blue" width={2.4}/><Flow ids={ids} d="M466 174H413" colour="red" width={2.4}/><Flow ids={ids} d="M466 207H419" colour="red" width={2.4}/></g>
    <g opacity={ventricles || stage === 'all' ? 1 : .38}><Flow ids={ids} d="M232 215V290" colour="blue" width={2.4}/><Flow ids={ids} d="M370 217V295" colour="red" width={2.4}/></g>
    <g opacity={out || stage === 'all' ? 1 : .38}><Flow ids={ids} d="M269 320Q293 281 293 234V208" colour="blue" width={2.4}/><Flow ids={ids} d="M293 170V150Q293 121 324 121H377" colour="blue" width={2.4}/><Flow ids={ids} d="M341 259Q328 237 328 206V188" colour="red" width={2.4}/><Flow ids={ids} d="M328 148V105Q328 68 365 62" colour="red" width={2.4}/><Flow ids={ids} d="M397 62Q436 75 442 122" colour="red" width={2.4}/></g>
    {labels && <g fontSize="17" fontWeight="700"><text x="214" y="203">RA</text><text x="354" y="198">LA</text><text x="215" y="340">RV</text><text x="356" y="341">LV</text></g>}
    {vesselQuestion && <Pointer mark="X" x={494} y={66} toX={431} toY={88}/>}
    {pacemaker && <><circle cx="197" cy="171" r="7" fill="#c49323" stroke="#7c6020" strokeWidth="1.5"/><Flow ids={ids} d="M207 173Q248 156 265 188" colour="signal" width={2.4} dashed/><Flow ids={ids} d="M204 184Q195 200 204 215" colour="signal" width={2.4} dashed/></>}
  </>
}

export function HeartAnatomy({ focus, assessment }: { focus: string; assessment: boolean }) {
  const stage = focus.startsWith('heart-chambers-') ? focus.replace('heart-chambers-', '') : 'all'
  return <AnatomyFigure title="The heart: chambers and connected vessels" height={485}
    description={assessment ? 'Front-view cutaway of a four-chamber heart. Arrows show flow through the chambers and connected vessels. Where shown, pointer X marks one large vessel leaving the heart.' : 'Front-view cutaway: venae cavae enter the right atrium; blood passes to the right ventricle and leaves through the pulmonary artery. Pulmonary veins enter the left atrium; blood passes to the thick-walled left ventricle and leaves through the aorta. A muscular septum separates the two sides. Four valves are shown at chamber and outlet openings.'}
    labels={assessment ? undefined : [
      { mark: 'RA', name: 'Right atrium', detail: 'Receives blood from the body.', active: stage === 'atria' },
      { mark: 'LA', name: 'Left atrium', detail: 'Receives blood from the lungs.', active: stage === 'atria' },
      { mark: 'RV', name: 'Right ventricle', detail: 'Pumps blood to the lungs.', active: stage === 'ventricles' },
      { mark: 'LV', name: 'Left ventricle', detail: 'Thicker muscle pumps blood around the body.', active: stage === 'ventricles' },
      { mark: '1', name: 'Venae cavae', detail: 'Return blood from the upper and lower body.' },
      { mark: '2', name: 'Pulmonary artery', detail: 'Branches to the two lungs.', active: stage === 'out' },
      { mark: '3', name: 'Pulmonary veins', detail: 'Return oxygenated blood; one side is shown.' },
      { mark: '4', name: 'Aorta', detail: 'Carries blood from the left ventricle to the body.', active: stage === 'out' },
    ]}
    note={`Front-view cutaway: the person’s right is on your left. Vessels are spread apart; not to scale. Open valves and arrows show the route, not simultaneous flow through every valve. ${colourNote}`}>
    {ids => <>
      <HeartSection ids={ids} stage={stage} labels={!assessment} vesselQuestion={focus === 'heart-vessel-question'}/>
      {!assessment && <><Pointer mark="1" x={90} y={117} toX={181} toY={142}/><path d="M90 132L148 310" stroke="#657a89" strokeWidth="1.3" fill="none"/><Pointer mark="2" x={487} y={119} toX={381} toY={121} active={stage === 'out'}/><Pointer mark="3" x={525} y={238} toX={461} toY={204}/><Pointer mark="4" x={498} y={50} toX={423} toY={80} active={stage === 'out'}/>
        <path d="M90 398L303 348" stroke="#657a89" strokeWidth="1.3"/><text x="49" y="419" fontSize="13">muscular septum</text>
        <path d="M476 370L412 339" stroke="#657a89" strokeWidth="1.3"/><text x="449" y="391" fontSize="13">thick muscle</text>
      </>}
      <text x="213" y="460" textAnchor="middle" fontSize="14">right side</text><text x="378" y="460" textAnchor="middle" fontSize="14">left side</text>
    </>}
  </AnatomyFigure>
}

/** Organic capillary bed: strands fan out from one inlet, weave, and rejoin at one outlet (flow left → right in path order). */
function capillaryStrands(x0: number, x1: number, y: number, spread: number) {
  const mid = (x0 + x1) / 2, q = (x1 - x0) / 4
  const strands = [-spread, 0, spread].map((o, i) => {
    const w = i === 1 ? -6 : 7
    const e = y + o * .32 // blunt ends span the vessel mouth, so neither end reads as an arrowhead
    return `M${x0} ${e}C${x0 + 26} ${e} ${x0 + 22} ${y + o} ${x0 + 52} ${y + o}S${mid - q * .6} ${y + o + w} ${mid} ${y + o}S${x1 - 52 - q * .4} ${y + o - w} ${x1 - 52} ${y + o}C${x1 - 22} ${y + o} ${x1 - 26} ${e} ${x1} ${e}`
  })
  const links = [x0 + 80, mid - 12, mid + 44, x1 - 84].map((x, i) => `M${x} ${y - spread + (i % 2 ? 2 : -1)}Q${x + 6} ${y - spread / 2} ${x + (i % 2 ? -3 : 4)} ${y}Q${x - 5} ${y + spread / 2} ${x + 2} ${y + spread + (i % 2 ? -1 : 2)}`)
  return { strands: strands.join(' '), links: links.join(' ') }
}
function CapillaryBed({ ids, x0, x1, y, spread }: { ids: DiagramIds; x0: number; x1: number; y: number; spread: number }) {
  const bed = capillaryStrands(x0, x1, y, spread), stroke = `url(#${ids.ref('blood')})`
  return <g fill="none" stroke={stroke}><path d={bed.links} strokeWidth="2" opacity=".75"/><path d={bed.strands} strokeWidth="3.6"/></g>
}

/* Alveolar cluster for the lung bed: varied radii keep the outline lobed rather than geometric. */
const alveoli: [number, number, number][] = [[210, 62, 17], [245, 55, 20], [284, 58, 18], [320, 54, 21], [357, 58, 18], [390, 64, 16],
  [197, 90, 16], [229, 88, 18], [266, 92, 19], [302, 88, 17], [338, 92, 19], [374, 88, 18], [404, 92, 14],
  [214, 116, 15], [250, 118, 17], [288, 119, 16], [324, 118, 18], [360, 116, 16], [392, 112, 13]]
/* Body tissue cells: slightly irregular sizes and tilts. */
const bodyCells: [number, number, number, number, number][] = [[206, 412, 17, 12, -12], [244, 405, 19, 11, 8], [283, 409, 18, 12, -4], [322, 404, 20, 11, 10], [361, 409, 17, 12, -9], [396, 414, 15, 11, 14],
  [222, 441, 19, 11, 6], [262, 444, 17, 12, -10], [302, 442, 20, 11, 3], [342, 444, 18, 12, -6], [380, 440, 17, 11, 9]]

function CircuitBadge({ mark, x, y }: { mark: string; x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="15" fill="#fff" stroke="#657a89" strokeWidth="1.8"/><text x={x} y={y + 5.5} fontSize="17" textAnchor="middle" fontWeight="700">{mark}</text></g>
}

export function DoubleCirculation({ focus, assessment }: { focus: string; assessment: boolean }) {
  const pulmonary = focus !== 'heart-double-body', systemic = focus !== 'heart-double-lungs'
  const dimP = pulmonary ? 1 : .28, dimS = systemic ? 1 : .28
  const label = { fontSize: 15, fill: anatomy.ink }
  return <AnatomyFigure title="Two circuits, one continuous journey" height={490}
    description={assessment ? 'A connected two-circuit schematic. The upper circuit links the heart and lungs; the lower circuit links the heart and body. Arrowheads indicate direction.' : 'Right atrium to right ventricle, then up the pulmonary artery to the lung capillaries, where blood gains oxygen. Pulmonary veins return it to the left atrium, then the left ventricle pumps it through the aorta to the body capillaries, where cells take oxygen. Venae cavae return blood to the right atrium. The two circuits meet only at the heart; no vessels cross.'}
    labels={assessment ? undefined : [
      { mark: 'A', name: 'Pulmonary circuit', detail: 'Right heart → lungs → left heart.', active: pulmonary },
      { mark: 'B', name: 'Systemic circuit', detail: 'Left heart → body → right heart.', active: systemic },
    ]}
    note={`Flow schematic, not an anatomical layout; not to scale. The heart is seen from the front, so its right side is on your left. ${colourNote}`}>
    {ids => <>
      {/* ── Lung bed (pulmonary circuit) ── */}
      <g opacity={dimP}>
        <g fill="#f4d3cb" stroke="#c98f8d" strokeWidth="5">{alveoli.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r}/>)}</g>
        <g fill="#f9e3dc">{alveoli.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r}/>)}</g>
        <g fill="none" stroke="#e2b2ab" strokeWidth="1.2">{alveoli.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r - 3}/>)}</g>
        <CapillaryBed ids={ids} x0={184} x1={416} y={88} spread={15}/>
        <text x="300" y="24" textAnchor="middle" fontWeight="650" fontSize="17">{assessment ? 'lung capillaries' : 'lung capillaries: blood gains oxygen'}</text>
      </g>

      {/* ── Body bed (systemic circuit) ── */}
      <g opacity={dimS}>
        <path d="M190 402C214 386 262 392 300 389C344 386 392 386 414 402C432 416 428 444 410 454C382 468 334 461 300 463C260 465 214 468 190 454C172 443 172 414 190 402Z" fill="#f6e6db" stroke="#d3b09f" strokeWidth="2"/>
        <g fill="#fbf1ea" stroke="#dcbfae" strokeWidth="1.3">{bodyCells.map(([x, y, rx, ry, r], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}><ellipse rx={rx} ry={ry}/><circle r="3.2" cx={i % 2 ? 3 : -4} fill="#e2c3b3" stroke="none"/></g>)}</g>
        <CapillaryBed ids={ids} x0={184} x1={416} y={425} spread={13}/>
        <text x="300" y="484" textAnchor="middle" fontWeight="650" fontSize="17">{assessment ? 'body capillaries' : 'body capillaries: cells take oxygen'}</text>
      </g>

      {/* ── Heart muscle ── */}
      <path d="M300 204C286 184 240 176 214 190C190 204 187 240 200 272C214 310 250 338 290 356C302 361 312 364 320 366C344 352 378 326 398 296C418 264 420 222 400 198C380 176 322 180 300 204Z" fill={`url(#${ids.ref('muscle')})`} stroke="#9a6063" strokeWidth="2.5"/>
      <path d="M300 204C286 184 240 176 214 190C190 204 187 240 200 272C214 310 250 338 290 356C302 361 312 364 320 366C344 352 378 326 398 296C418 264 420 222 400 198C380 176 322 180 300 204Z" fill={`url(#${ids.ref('fibres')})`}/>

      {/* Veins enter and the aorta leaves through the heart wall; chambers are painted over the tube ends. */}
      <g opacity={dimS}>
        <Tube d="M184 424Q140 424 140 392V250Q140 222 168 222H226" colour="blue" width={13}/>
        <Tube d="M372 292H440Q470 292 470 322V392Q470 424 438 424H416" colour="red" width={13}/>
      </g>
      <g opacity={dimP}><Tube d="M416 88Q438 88 438 120Q438 150 410 150H388Q358 150 358 178V212" colour="red" width={13}/></g>

      {/* ── Chambers: organic cavities; the left ventricle has the thickest wall. ── */}
      <g strokeWidth="2">
        <path d="M220 214C228 196 256 194 266 208C274 222 272 242 258 250C240 256 222 250 216 236C213 228 215 220 220 214Z" fill="#d9ebf3" stroke="#739db3"/>
        <path d="M214 263C236 258 262 258 288 264C293 290 290 318 284 342C258 332 232 314 220 292C215 282 213 272 214 263Z" fill="#d9ebf3" stroke="#739db3"/>
        <path d="M330 208C342 194 374 194 386 206C396 218 394 240 380 250C362 256 340 252 332 240C326 230 326 218 330 208Z" fill="#fbe0d9" stroke="#b9797c"/>
        <path d="M318 264C340 258 362 258 380 264C380 292 362 318 328 346C316 320 314 292 318 264Z" fill="#fbe0d9" stroke="#b9797c"/>
      </g>
      {/* Open passages between each atrium and the ventricle below it, with valve flaps. */}
      <g fill="none" strokeWidth="18" strokeLinecap="butt"><path d="M252 240V270" stroke="#d9ebf3" strokeWidth="30"/><path d="M358 240V270" stroke="#fbe0d9" strokeWidth="30"/></g>
      <g fill="#fff4ce" stroke="#a99062" strokeWidth="1.5"><path d="M237 255Q241 265 246 274L240 276Q235 265 237 255ZM267 255Q263 265 258 274L264 276Q269 265 267 255Z"/><path d="M343 255Q347 265 352 274L346 276Q341 265 343 255ZM373 255Q369 265 364 274L370 276Q375 265 373 255Z"/></g>

      {/* Pulmonary artery: leaves the top of the right ventricle and passes in front of the heart. */}
      <g opacity={dimP}>
        <path d="M284 270V180Q284 150 254 150H192Q162 150 162 120Q162 88 184 88" fill="none" stroke="#fffefa" strokeWidth="23" strokeLinecap="butt"/>
        <Tube d="M284 270V180Q284 150 254 150H192Q162 150 162 120Q162 88 184 88" colour="blue" width={13}/>
        <Flow ids={ids} d="M284 262V196" colour="blue" width={2.6}/><Flow ids={ids} d="M246 150H196" colour="blue" width={2.6}/>
        <Flow ids={ids} d="M358 160V198" colour="red" width={2.6}/><Flow ids={ids} d="M438 104V134" colour="red" width={2.6}/>
        {!assessment && <g {...label}><text x="148" y="112" textAnchor="end">pulmonary</text><text x="148" y="129" textAnchor="end">artery</text><text x="454" y="112">pulmonary</text><text x="454" y="129">veins</text></g>}
      </g>

      <g opacity={dimS}>
        <Flow ids={ids} d="M140 384V278" colour="blue" width={2.6}/><Flow ids={ids} d="M170 222H208" colour="blue" width={2.6}/>
        <Flow ids={ids} d="M398 292H442" colour="red" width={2.6}/><Flow ids={ids} d="M470 330V386" colour="red" width={2.6}/><Flow ids={ids} d="M446 424H418" colour="red" width={2.6}/><Flow ids={ids} d="M180 424H154" colour="blue" width={2.6}/>
        {!assessment && <g {...label}><text x="126" y="318" textAnchor="end">venae</text><text x="126" y="335" textAnchor="end">cavae</text><text x="486" y="362">aorta</text></g>}
      </g>

      <Flow ids={ids} d="M252 226V290" colour="blue" width={2.6}/><Flow ids={ids} d="M358 226V292" colour="red" width={2.6}/>
      {!assessment && <g fontSize="16" fontWeight="700"><text x="231" y="234" textAnchor="middle">RA</text><text x="242" y="318" textAnchor="middle">RV</text><text x="378" y="234" textAnchor="middle">LA</text><text x="342" y="316" textAnchor="middle">LV</text></g>}
      <text x="236" y="366" textAnchor="middle" fontSize="14">heart</text>
      <CircuitBadge mark="A" x={321} y={167}/><CircuitBadge mark="B" x={420} y={368}/>
    </>}
  </AnatomyFigure>
}

export function ValveVisual() {
  return <AnatomyFigure title="A valve opens and closes with pressure" height={315}
    description="Two lengthwise sections through an atrioventricular valve. On the left, pressure from the atrium pushes the flaps apart and one arrow shows blood flowing into the ventricle. On the right, higher ventricular pressure brings the flaps together; a stop bar shows that backflow is blocked. Thin cords tether the flaps to ventricular muscle."
    labels={[
      { mark: '1', name: 'Open', detail: 'Higher pressure behind the valve pushes the flaps apart.' },
      { mark: '2', name: 'Closed', detail: 'Reverse pressure brings the flaps together; blood cannot flow back.' },
    ]} note="Lengthwise cutaway of an atrioventricular valve; the cords prevent the flaps turning inside out. Outlet valves have a different shape. The drawings show two different moments.">
    {ids => <>{[false,true].map((closed,i) => <g key={i} transform={`translate(${i*285} 0)`}>
      <text x="157" y="37" textAnchor="middle" fontSize="17" fontWeight="650">{closed ? '2 · closed' : '1 · open'}</text>
      <path d="M67 63V131Q35 208 67 276H247Q279 208 247 131V63" fill="#fbe7df" stroke="#ba8581" strokeWidth="14"/>
      <path d={closed ? 'M67 131Q110 91 157 131Q204 91 247 131L243 140Q198 115 157 139Q116 115 71 140Z' : 'M67 131Q106 137 131 182L117 188Q85 158 67 131ZM247 131Q208 137 183 182L197 188Q229 158 247 131Z'} fill="#fff1c2" stroke="#a88b53" strokeWidth="2.5"/>
      <path d={closed ? 'M98 121L111 243L147 130M167 130L202 243L220 121' : 'M118 184L111 243L128 181M186 181L202 243L197 184'} fill="none" stroke="#b89879" strokeWidth="2"/>
      <path d="M99 276l12-43l13 43M190 276l12-43l12 43" fill="#c88980"/>
      {closed ? <>
        <path d="M157 221V170" fill="none" stroke={anatomy.carbon} strokeWidth="3" strokeDasharray="4 6"/>
        <path d="M132 158H182" fill="none" stroke="#a45151" strokeWidth="7"/>
      </> : <Flow ids={ids} d="M157 79V205" colour="red" width={4}/>} 
      <text x="157" y="302" textAnchor="middle" fontSize="13">{closed ? 'backflow prevented' : 'forward flow'}</text>
    </g>)}</>}
  </AnatomyFigure>
}

export function CoronaryVisual() {
  return <AnatomyFigure title="The heart muscle has its own blood supply" height={400}
    description="External front view of the heart. Coronary arteries branch from the base of the aorta, divide across the surface of the heart and supply the heart muscle. They are distinct from the large vessels carrying blood through the chambers."
    labels={[
      { mark: '1', name: 'Aortic root', detail: 'Coronary arteries arise near the base of the aorta.' },
      { mark: '2', name: 'Coronary arteries', detail: 'Branch across the heart and into the muscle.' },
      { mark: '3', name: 'Heart muscle', detail: 'Needs oxygen and glucose for aerobic respiration.' },
    ]} note="External front-view schematic. Only selected coronary branches are shown; veins are omitted for clarity.">
    {ids => <>
      <path d="M191 132C231 96 269 121 289 143C327 111 375 117 397 155C428 208 397 282 332 350C322 361 311 370 306 372C224 343 175 290 164 224C157 186 169 151 191 132Z" fill={`url(#${ids.ref('muscle')})`} stroke="#a06667" strokeWidth="2.5"/>
      <path d="M191 132C231 96 269 121 289 143C327 111 375 117 397 155C428 208 397 282 332 350C322 361 311 370 306 372C224 343 175 290 164 224C157 186 169 151 191 132Z" fill={`url(#${ids.ref('fibres')})`}/>
      <Tube d="M213 135L205 57" colour="blue" width={29}/><Tube d="M290 151V83C290 43 352 35 371 76L381 108" colour="red" width={32}/>
      <Tube d="M337 179L340 118L392 115" colour="blue" width={29}/>
      <g fill="none" stroke="#fcdd9e" strokeWidth="9"><path d="M275 127C253 138 257 160 235 171S188 186 180 225M302 130C302 148 321 172 343 177L386 190M336 176C313 220 309 277 309 346"/></g>
      <g fill="none" stroke="#b74347" strokeWidth="4.5"><path d="M275 127C253 138 257 160 235 171S188 186 180 225M302 130C302 148 321 172 343 177L386 190M336 176C313 220 309 277 309 346"/><path d="M204 185Q219 223 223 264M189 204L181 259M322 209L350 227L379 234M314 253L341 274L356 288M310 287L290 300L274 321M316 242L280 234L248 218" strokeWidth="3"/></g>
      <Pointer mark="1" x={406} y={41} toX={279} toY={126}/><Pointer mark="2" x={112} y={145} toX={219} toY={179}/><Pointer mark="3" x={457} y={297} toX={368} toY={266}/>
      <Flow ids={ids} d="M325 198Q316 222 313 246" colour="red" width={2}/>
    </>}
  </AnatomyFigure>
}

export function PacemakerVisual({ artificial }: { artificial: boolean }) {
  return <AnatomyFigure title={artificial ? 'An artificial pacemaker assists timing' : 'The natural pacemaker starts the signal'} height={465}
    description={artificial ? 'A small pacemaker sits under the skin below the collarbone. A lead passes through a vein into the right side of the heart and ends in the right ventricle. This is one simplified example; some devices use more than one lead.' : 'A group of natural pacemaker cells is highlighted high in the wall of the right atrium, near the entrance of the superior vena cava. Dashed gold arrows show electrical impulses spreading through the atria, not blood flow.'}
    labels={artificial ? [
      { mark: '1', name: 'Pulse generator', detail: 'A small electrical device placed under the skin.' },
      { mark: '2', name: 'Insulated lead', detail: 'Passes through a vein into the right heart.' },
      { mark: '3', name: 'Electrode', detail: 'Delivers an electrical impulse to heart muscle when needed.' },
    ] : [
      { mark: '1', name: 'Natural pacemaker', detail: 'A group of cells in the right atrium wall starts each normal heartbeat.' },
      { mark: '2', name: 'Electrical impulses', detail: 'Spread through the atria; further conducting tissue coordinates the ventricles.' },
    ]} note={artificial ? 'One example of a single-lead pacemaker, shown schematically. Device and lead are enlarged; placement and number of leads vary.' : `Gold dashed arrows are electrical signals, not blood flow. ${colourNote}`}>
    {ids => <>
      <g transform="translate(45 8) scale(.94)"><HeartSection ids={ids} labels stage="atria" pacemaker={!artificial}/></g>
      {artificial ? <>
        <path d="M133 72H192Q218 72 218 107V177" fill="none" stroke="#8cabc0" strokeWidth="16"/>
        <rect x="68" y="39" width="84" height="66" rx="18" fill="#cbd6dd" stroke="#657b8b" strokeWidth="2.5"/><rect x="89" y="30" width="42" height="17" rx="6" fill="#e8e0d2" stroke="#8f8b7f"/>
        <path d="M126 38Q144 37 140 69H192Q218 72 218 107V177Q233 206 250 227L261 264Q267 310 323 340" fill="none" stroke="#fffefa" strokeWidth="5"/>
        <path d="M126 38Q144 37 140 69H192Q218 72 218 107V177Q233 206 250 227L261 264Q267 310 323 340" fill="none" stroke="#b18429" strokeWidth="2.5"/>
        <circle cx="323" cy="340" r="5" fill="#b18429"/>
        <Pointer mark="1" x={41} y={149} toX={85} toY={82}/><Pointer mark="2" x={142} y={217} toX={218} toY={140}/><Pointer mark="3" x={167} y={402} toX={323} toY={340}/>
      </> : <><Pointer mark="1" x={141} y={139} toX={230} toY={169}/><Pointer mark="2" x={114} y={257} toX={233} toY={199}/></>}
    </>}
  </AnatomyFigure>
}

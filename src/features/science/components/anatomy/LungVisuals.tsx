import { AnatomyFigure, Flow, Pointer, RedCell, anatomy, type DiagramIds } from './AnatomyFigure'

/** Continuous air space: the scalloped sacs open into a shared alveolar duct. */
function AirSacs({ ids, x = 0, y = 0, scale = 1, vessels = false }: { ids: DiagramIds; x?: number; y?: number; scale?: number; vessels?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M92 4V43C72 26 49 40 48 60C20 52 6 79 23 99C-1 120 15 149 40 145C41 173 70 182 87 161C106 187 139 173 139 150C168 153 181 126 162 106C182 85 168 58 144 61C140 35 116 32 107 44V4" fill="#eaf5f6" stroke="#b78086" strokeWidth="4"/>
    <g fill="none" stroke="#c99fa2" strokeWidth="2"><path d="M48 60l19 20m-44 19l25 4m-8 42l17-18m30 34l5-25m47 14l-21-24m44-20l-24 3m6-48l-15 18"/></g>
    {[[51,54],[25,122],[67,166],[124,158],[161,84]].map(([cx,cy]) => <ellipse key={cx} cx={cx} cy={cy} rx="5" ry="2.5" fill="#967693" transform={`rotate(${cx} ${cx} ${cy})`}/>)}
    {vessels && <g fill="none" stroke={`url(#${ids.ref('blood')})`} strokeWidth="4.5">
      <path d="M-26 81C-3 83 0 60 18 48S43 25 65 30S107 29 134 24S175 42 185 64S187 111 197 116H220"/>
      <path d="M-6 77C11 98 7 135 24 157S71 195 97 193S148 188 170 166S190 132 197 116"/>
      <path d="M18 48C16 67 23 84 43 89S78 113 78 140S79 176 97 193M65 30C77 47 79 69 74 85S87 111 111 111S144 137 140 160S148 177 153 180M134 24C119 45 119 71 135 84S174 95 189 94M24 157C41 149 61 147 78 140S111 127 111 111M43 89C41 109 28 116 14 119M140 160C156 146 167 126 159 106M74 85C96 88 116 85 135 84"/>
    </g>}
  </g>
}

export function LungAirway({ focus, assessment }: { focus: string; assessment: boolean }) {
  const stage = focus.endsWith('trachea') ? 1 : focus.endsWith('bronchi') ? 2 : 4
  const active = (n: number) => !assessment && (n === stage || (stage === 4 && n === 3))
  return <AnatomyFigure title="Inside the lungs" height={435}
    description={assessment ? 'Front view of two lungs with a branching airway. Pointers 1 to 4 identify successively smaller structures, ending in an enlarged cluster of air sacs.' : 'Front view: the trachea branches into two bronchi and then smaller bronchioles, ending in alveoli. The right lung has three lobes; the smaller left lung has two lobes and a notch beside the heart. A dashed magnification link leads to an enlarged alveolar cluster.'}
    labels={assessment ? undefined : [
      { mark: '1', name: 'Trachea', detail: 'Cartilage rings support the main airway.', active: active(1) },
      { mark: '2', name: 'Bronchi', detail: 'One main bronchus enters each lung.', active: active(2) },
      { mark: '3', name: 'Bronchioles', detail: 'Smaller airways branch throughout the lungs.', active: active(3) },
      { mark: '4', name: 'Alveoli', detail: 'Tiny air sacs at the ends of the airways.', active: active(4) },
    ]}
    note="Front view: the person’s right is on your left. Fissures divide the lungs into lobes. The enlarged inset is not to scale.">
    {ids => <>
      <path d="M181 50C144 56 106 83 82 120C54 165 52 245 66 300C81 355 183 378 291 373C366 370 413 337 413 278C413 204 390 116 342 80C319 63 299 53 282 50" fill="#f6f3ee" stroke="#e5e0d8" strokeWidth="2"/>
      <path d="M213 101C194 72 167 80 146 103C116 136 89 178 80 225C72 264 74 311 95 327C121 347 185 345 214 322C230 309 228 275 221 236C216 208 219 168 218 142Z" fill={`url(#${ids.ref('lung')})`} stroke="#ab7375" strokeWidth="2.5"/>
      <path d="M268 99C289 81 311 95 332 124C359 159 380 206 385 248C390 287 385 312 368 322C348 332 317 330 297 319C285 311 289 292 296 278C312 250 306 231 286 221C267 210 259 190 263 162Z" fill={`url(#${ids.ref('lung')})`} stroke="#ab7375" strokeWidth="2.5"/>
      <g fill="none" stroke="#b78180" strokeWidth="2"><path d="M92 208Q151 221 219 207M112 331Q177 274 219 234M280 188Q320 219 379 267"/></g>
      <path d="M236 39V145L197 176M236 145L283 176" fill="none" stroke="#8a8584" strokeWidth="24"/>
      <path d="M236 39V145L197 176M236 145L283 176" fill="none" stroke="#f4dcc4" strokeWidth="19"/>
      <g stroke="#b39e8a" strokeWidth="2">{[49,60,71,82,93,104,115,126].map(y => <path key={y} d={`M226 ${y}Q236 ${y + 3} 246 ${y}`}/>)}<path d="M205 159l10 14m-20-5l9 14m58-24l-10 13m22-5l-10 13"/></g>
      <g fill="none" stroke="#968b80" strokeWidth="10"><path d="M198 175L172 211L145 256L124 303M173 209L140 179L138 136M144 256L185 285L192 312M284 175L316 205L342 255L359 301M316 205L324 162L311 134M343 255L319 285"/></g>
      <g fill="none" stroke="#f8e4c9" strokeWidth="6"><path d="M198 175L172 211L145 256L124 303M173 209L140 179L138 136M144 256L185 285L192 312M284 175L316 205L342 255L359 301M316 205L324 162L311 134M343 255L319 285"/></g>
      <g fill="none" stroke="#b18d77" strokeWidth="3.4"><path d="M138 148l20-16m-18 44l-21-16m35 30l-32 11m47 13l30 8m-47 14l-39-5m30 29l-30 12m43-5l11 26m19-17l17-20m-66 25l20 27M313 143l-12 18m22 19l25-10m-18 64l32-13m-24 28l-25-5m38 35l24-11m-30 20l-11 22m-6-36l-20-3"/></g>
      {[[158,132],[119,160],[123,201],[200,225],[112,232],[113,274],[166,298],[200,260],[148,318],[302,160],[348,170],[362,221],[313,244],[375,268],[334,310],[305,272]].map(([x,y]) => <g key={`${x}-${y}`} fill="#f6d8cf" stroke="#b58283" strokeWidth=".9"><circle cx={x} cy={y} r="4"/><circle cx={x-4} cy={y+5} r="4"/><circle cx={x+4} cy={y+5} r="4"/></g>)}
      <path d="M82 360Q231 317 383 353" fill="none" stroke="#a76f75" strokeWidth="10"/><text x="235" y="387" textAnchor="middle" fontSize="13">diaphragm</text>
      <circle cx="364" cy="224" r="13" fill="none" stroke="#758895" strokeDasharray="3 4"/>
      <path d="M376 217L420 175M377 231L419 322" stroke="#9aa8ad" strokeDasharray="4 5" fill="none"/>
      <rect x="415" y="169" width="169" height="175" rx="18" fill="#f9f6f0" stroke="#cdd8d9"/>
      <AirSacs ids={ids} x={427} y={181} scale={.8}/>
      <text x="498" y="368" fontSize="13" textAnchor="middle">enlarged air sacs</text>
      <Pointer mark="1" x={324} y={47} toX={247} toY={78} active={active(1)}/>
      <Pointer mark="2" x={364} y={107} toX={272} toY={168} active={active(2)}/>
      <Pointer mark="3" x={45} y={263} toX={125} toY={271} active={active(3)}/>
      <Pointer mark="4" x={550} y={145} toX={538} toY={243} active={active(4)}/>
      <Flow ids={ids} d="M236 56V117" colour="oxygen" width={2.5}/>
      <text x="159" y="413" fontSize="13" textAnchor="middle">right lung · 3 lobes</text><text x="322" y="413" fontSize="13" textAnchor="middle">left lung · 2 lobes</text>
    </>}
  </AnatomyFigure>
}

export function AlveolarNetwork({ area = false }: { area?: boolean }) {
  return <AnatomyFigure title={area ? 'Many sacs, a large exchange surface' : 'A capillary network around the alveoli'} height={330}
    description="An enlarged group of connected alveoli with small blood vessels forming an interconnected mesh around their surfaces. Blood enters with less oxygen and leaves with more oxygen; air enters and leaves through a bronchiole."
    labels={[
      { mark: '1', name: 'Alveolar air spaces', detail: 'Many small sacs provide a large total surface area.', active: area },
      { mark: '2', name: 'Capillary network', detail: 'Blood flows very close to the air in the alveoli.', active: !area },
    ]}
    note="Enlarged surface model. The mesh is shown over a few sacs; real lungs contain very many alveoli. Blue and red show oxygen level, not the actual colour of blood.">
    {ids => <>
      <AirSacs ids={ids} x={158} y={47} scale={1.32} vessels/>
      <Flow ids={ids} d="M279 25V83" colour="oxygen"/>
      <Flow ids={ids} d="M305 83V25" colour="carbon"/>
      <text x="370" y="49" fontSize="15">air in / out</text>
      <Flow ids={ids} d="M58 154H116" colour="blue"/>
      <Flow ids={ids} d="M457 200H536" colour="red"/>
      <text x="59" y="182" fontSize="13">blood in</text><text x="471" y="227" fontSize="13">blood out</text>
      <Pointer mark="1" x={505} y={88} toX={307} toY={154} active={area}/>
      <Pointer mark="2" x={95} y={279} toX={214} toY={252} active={!area}/>
    </>}
  </AnatomyFigure>
}

export function AlveolarExchange({ focus, assessment }: { focus: string; assessment: boolean }) {
  const thin = focus === 'lung-adaptation-thin'
  const supply = focus === 'lung-adaptation-supply'
  return <AnatomyFigure title={thin ? 'A very thin exchange barrier' : supply ? 'Fresh air and flowing blood' : 'Gas exchange: a section through the walls'} height={350}
    description={assessment ? 'Air in an alveolus is on the left and flowing blood is on the right. Two thin cell layers separate them. Arrow X points from air to blood; arrow Y points from blood to air.' : 'Magnified section through an alveolus and an adjacent capillary. Oxygen diffuses from alveolar air through the thin alveolar and capillary walls into blood. Carbon dioxide diffuses in the opposite direction. Red blood cells stay inside the vessel.'}
    labels={assessment ? undefined : [
      { mark: '1', name: 'Alveolar wall', detail: 'One layer of flattened cells, with a moist lining.', active: thin },
      { mark: '2', name: 'Capillary wall', detail: 'One cell thick; a very thin supporting layer lies between the two walls.', active: thin },
      { mark: 'X', name: 'Oxygen → blood', detail: 'Diffuses down its concentration gradient.', active: focus.endsWith('oxygen') || supply },
      { mark: 'Y', name: 'Carbon dioxide → air', detail: 'Diffuses down its own concentration gradient.', active: focus.endsWith('carbon') || supply },
    ]}
    note={assessment ? 'Magnified section. Arrowheads show direction; cell and wall thicknesses are exaggerated.' : 'Blood flow and ventilation help maintain the concentration gradients. Wall thicknesses are exaggerated so the layers can be distinguished.'}>
    {ids => <>
      <path d="M50 79Q160 39 280 77V285Q144 317 50 277Z" fill="#eaf5f6"/>
      <path d="M279 77Q290 176 279 285L291 285Q302 177 291 77Z" fill="#f3d9cc" stroke="#b68f88" strokeWidth="1.5"/>
      <path d="M291 77Q302 177 291 285H299Q310 177 299 77Z" fill="#e3d6e6"/>
      <path d="M299 77Q310 177 299 285H311Q322 177 311 77Z" fill="#f3d9cc" stroke="#b68f88" strokeWidth="1.5"/>
      <path d="M311 77Q322 177 311 285H493Q506 177 493 77Z" fill="#fae8e3"/>
      <path d="M493 77Q506 177 493 285H505Q518 177 505 77Z" fill="#f3d9cc" stroke="#b68f88" strokeWidth="1.5"/>
      <g stroke="#b68f88" strokeWidth="1"><path d="M285 135h12m-9 97h12m7-37h12m-15-77h12m184 40h12m-12 84h12"/></g>
      <ellipse cx="292" cy="263" rx="4.5" ry="10" fill="#967693"/><ellipse cx="310" cy="101" rx="4.5" ry="10" fill="#967693"/><ellipse cx="506" cy="222" rx="4.5" ry="10" fill="#967693"/>
      <RedCell x={428} y={105} rotate={20} scale={1.3}/><RedCell x={454} y={179} rotate={-18} scale={1.3}/><RedCell x={405} y={256} rotate={12} scale={1.3}/>
      <text x="153" y="105" textAnchor="middle" fontSize="17" fontWeight="650">alveolar air</text>
      <text x="405" y="321" textAnchor="middle" fontSize="16" fontWeight="650">blood in capillary</text>
      <Flow ids={ids} d="M195 153H382" colour={assessment ? 'ink' : 'oxygen'} width={3.5}/>
      <Flow ids={ids} d="M382 222H195" colour={assessment ? 'ink' : 'carbon'} width={3.5}/>
      <text x="221" y="141" fontSize="16" fontWeight="700" fill={assessment ? anatomy.ink : anatomy.oxygen}>{assessment ? 'X' : 'X · oxygen'}</text>
      <text x="188" y="250" fontSize="16" fontWeight="700" fill={assessment ? anatomy.ink : anatomy.carbon}>{assessment ? 'Y' : 'Y · carbon dioxide'}</text>
      <Pointer mark="1" x={218} y={35} toX={284} toY={115} active={thin}/><Pointer mark="2" x={361} y={35} toX={311} toY={126} active={thin}/>
      <Flow ids={ids} d="M467 87V128" colour="red" width={2}/><Flow ids={ids} d="M469 247V282" colour="red" width={2}/>
      {supply && <><Flow ids={ids} d="M77 76V143" colour="oxygen"/><Flow ids={ids} d="M115 145V76" colour="carbon"/><text x="94" y="55" textAnchor="middle" fontSize="14">ventilation</text></>}
    </>}
  </AnatomyFigure>
}

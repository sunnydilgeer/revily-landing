import { useId, useState, type ReactNode } from 'react'
import { transportData } from '../lesson-6/practicalData'

const ink = '#37627b', blue = '#52aed0', amber = '#e5b442', green = '#67ab8b'
function ParticleModel({ focus, assessment }: { focus: string; assessment: boolean }) {
  const id = useId().replace(/:/g, '')
  const osmosis = focus.startsWith('osmosis'), active = focus === 'active' || focus === 'gut-active'
  const leftCount = active ? 3 : osmosis ? 14 : 16, rightCount = active ? 9 : osmosis ? 8 : 6
  function particles(count: number, offset: number, square = false) {
    return Array.from({ length: count }, (_, i) => {
      const x=offset+18+(i%4)*28, y=25+Math.floor(i/4)*28
      return square ? <rect key={i} x={x-5} y={y-5} width="10" height="10" fill={amber} stroke={ink} /> : <circle key={i} cx={x} cy={y} r="5" fill={blue} />
    })
  }
  return <div className="science-bio-model"><div className="science-bio-pair"><span>{active ? 'Lower ion/sugar concentration' : osmosis ? 'Dilute · lower solute concentration' : 'Higher concentration'}</span><span>{active ? 'Higher ion/sugar concentration' : osmosis ? 'Concentrated · higher solute concentration' : 'Lower concentration'}</span></div><svg viewBox="0 0 360 175" role="img" aria-labelledby={`${id}-title`}><title id={`${id}-title`}>{(osmosis ? 'Equal-sized solution regions separated by a membrane. Left: more water circles and fewer solute squares; right: fewer water circles and more solute squares. In this model only water crosses the membrane.' : active ? 'Equal-sized regions with fewer solute squares on the left and more on the right, separated by a cell membrane.' : 'Equal-sized regions with more particles on the left and fewer on the right. Small arrows show example random movements.') + (assessment ? ' No net-direction arrow is shown.' : ' A large arrow shows net movement.') + " Original schematic, representative particles, not to scale."}</title><defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill={ink}/></marker></defs><rect x="10" y="8" width="150" height="122" rx="7" fill="#f1f9fd" stroke="#b7d9e6" /><rect x="200" y="8" width="150" height="122" rx="7" fill="#f5f4fc" stroke="#cfc5df" />{particles(leftCount,15,active)}{particles(rightCount,205,active)}{osmosis && <>{[42,106].map((x,i)=><rect key={x} x={x} y={i*55+43} width="10" height="10" fill={amber} stroke={ink}/>)}{[214,246,278,310,230,265,301].map((x,i)=><rect key={i} x={x} y={37+(i%3)*34} width="10" height="10" fill={amber} stroke={ink}/>)}</>}
    {(osmosis||active) && <><path d="M175 7v44m0 10v44m0 10v17M185 7v44m0 10v44m0 10v17" stroke={green} strokeWidth="3" />{osmosis && <path d="M170 56h20M170 110h20" stroke="#b7d9e6" strokeWidth="2" strokeDasharray="2 2" />}</>}
    {!active && <><path d="M75 40l12-8M102 96l-12 7M242 85l11 7M278 44l-10-9" stroke={ink} strokeWidth="1.3" markerEnd={`url(#${id}-arrow)`}/></>}
    {!assessment && <><path d="M125 152H239" stroke={ink} strokeWidth="3" markerEnd={`url(#${id}-arrow)`}/><text x="181" y="169" textAnchor="middle" fill={ink} fontSize="11">{active ? 'Against gradient · energy required' : osmosis ? 'Net water movement' : 'Net movement'}</text></>}
  </svg><p className="science-bio-note">{osmosis ? 'Key: blue circles = water; amber squares = solute. The partially permeable membrane allows water through, not this solute.' : active ? 'Key: amber squares = transported substance. The green boundary represents a cell membrane; energy is supplied by respiration.' : 'Key: blue dots = one substance. Small arrows = example random motion. Compare equal volumes.'}</p></div>
}

/* Alveolar cluster: varied radii give a lobed, grape-like outline rather than repeated circles. */
const sacs: [number, number, number][] = [[76, 90, 12], [122, 88, 13], [56, 111, 13], [82, 112, 12], [106, 108, 11], [132, 111, 12], [150, 128, 11],
  [46, 137, 12], [71, 136, 13], [97, 133, 12], [123, 137, 13], [146, 150, 12], [60, 161, 12], [87, 159, 13], [113, 161, 12], [136, 171, 11],
  [76, 183, 11], [102, 184, 12], [124, 191, 10]]
/* Capillary strands weave across the cluster from the incoming (left) vessel to the outgoing (right) vessel. */
const strands = ['M40 100C60 94 70 104 90 99S130 92 160 104', 'M31 126C52 120 66 131 90 124S134 120 168 128', 'M30 151C54 146 70 156 96 149S140 144 169 153', 'M31 176C54 172 72 180 98 174S140 170 171 178', 'M52 196C72 196 88 200 108 198S138 196 176 202']
function AlveoliDrawing({ uid }: { uid: string }) {
  const r = (n: string) => `${uid}-${n}`, blood = { less: '#357eae', more: '#c64c59' }
  const text = { fill: '#304659', fontSize: 11 }
  return <g strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id={r('cap')} gradientUnits="userSpaceOnUse" x1="30" y1="0" x2="175" y2="0"><stop stopColor={blood.less}/><stop offset=".5" stopColor="#a685aa"/><stop offset="1" stopColor={blood.more}/></linearGradient>
      <linearGradient id={r('lumen')} gradientUnits="userSpaceOnUse" x1="208" y1="0" x2="352" y2="0"><stop stopColor="#d6e6f1"/><stop offset="1" stopColor="#f6d0cd"/></linearGradient>
      {Object.entries({ ink: '#304659', o2: '#087f83', co2: '#8555a4', less: blood.less, more: blood.more }).map(([n, c]) =>
        <marker key={n} id={r(n)} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10L2 5Z" fill={c}/></marker>)}
    </defs>

    {/* Airway (bronchiole) carrying air in and out */}
    <path d="M100 4C100 40 98 70 99 104" fill="none" stroke="#7fa6b8" strokeWidth="15"/>
    <path d="M100 4C100 40 98 70 99 104" fill="none" stroke="#e4f2f8" strokeWidth="10"/>
    <path d="M112 22V50" fill="none" stroke="#304659" strokeWidth="1.5" markerStart={`url(#${r('ink')})`} markerEnd={`url(#${r('ink')})`}/>
    <text x="118" y="33" {...text}>air in</text><text x="118" y="46" {...text}>and out</text>

    {/* Vessels: supply (less oxygen) enters left; drainage (more oxygen) leaves right */}
    <path d="M18 238C22 204 28 190 30 170C33 142 30 120 44 96" fill="none" stroke={blood.less} strokeWidth="6"/>
    <path d="M152 90C170 108 168 140 170 170C172 192 180 210 186 238" fill="none" stroke={blood.more} strokeWidth="6"/>

    {/* Air sacs: stroke pass then fill pass gives one merged, lobed outline */}
    <g fill="#f3d0c8" stroke="#c48a88" strokeWidth="4.5">{sacs.map(([x, y, rr], i) => <circle key={i} cx={x} cy={y} r={rr}/>)}</g>
    <g fill="#fbe8e2">{sacs.map(([x, y, rr], i) => <circle key={i} cx={x} cy={y} r={rr}/>)}</g>
    <g fill="none" stroke="#e0aba4" strokeWidth="1">{sacs.map(([x, y, rr], i) => <circle key={i} cx={x} cy={y} r={rr - 2.5}/>)}</g>
    <path d="M99 70V84" stroke="#e4f2f8" strokeWidth="10"/>

    <path d={strands.join(' ')} fill="none" stroke={`url(#${r('cap')})`} strokeWidth="2.4" opacity=".9"/>
    <path d="M24 214V194" stroke={blood.less} strokeWidth="1.8" markerEnd={`url(#${r('less')})`}/>
    <path d="M178 196L182 218" stroke={blood.more} strokeWidth="1.8" markerEnd={`url(#${r('more')})`}/>

    {/* Labels with short leaders */}
    <text x="4" y="58" {...text}>alveoli</text><text x="4" y="71" {...text}>(air sacs)</text>
    <path d="M52 68L66 82" stroke="#657a89" strokeWidth="1"/><circle cx="66" cy="82" r="2" fill="#657a89"/>
    <text x="138" y="62" {...text}>capillary</text><text x="138" y="75" {...text}>network</text>
    <path d="M150 79L144 99" stroke="#657a89" strokeWidth="1"/><circle cx="144" cy="99" r="2" fill="#657a89"/>
    <text x="28" y="234" {...text} fontSize={10.5} fill={blood.less}>blood in:</text><text x="28" y="247" {...text} fontSize={10.5} fill={blood.less}>less oxygen</text>
    <text x="174" y="234" {...text} fontSize={10.5} fill={blood.more} textAnchor="end">blood out:</text><text x="174" y="247" {...text} fontSize={10.5} fill={blood.more} textAnchor="end">more oxygen</text>

    {/* Zoom cue: one alveolus wall is enlarged in the inset */}
    <circle cx="146" cy="150" r="16" fill="none" stroke="#657a89" strokeWidth="1.3" strokeDasharray="3 3"/>
    <path d="M161 144L206 118" stroke="#657a89" strokeWidth="1.3" strokeDasharray="3 3"/>

    {/* Inset: alveolus air space, two thin walls, capillary */}
    <rect x="206" y="22" width="150" height="190" rx="10" fill="#fffefa" stroke="#9fb6c1" strokeWidth="1.3"/>
    <text x="281" y="16" textAnchor="middle" {...text} fontWeight="650">one alveolus, enlarged</text>
    <clipPath id={r('inset')}><rect x="207" y="23" width="148" height="188" rx="9"/></clipPath>
    <g clipPath={`url(#${r('inset')})`}>
      <rect x="206" y="22" width="150" height="80" fill="#eef7fb"/>
      <path d="M206 102C250 95 310 107 356 99V144C310 150 250 140 206 147Z" fill={`url(#${r('lumen')})`}/>
      <path d="M206 99C250 92 310 104 356 96L356 102C310 110 250 98 206 105Z" fill="#e8b0a9" stroke="#bf7f7c" strokeWidth=".8"/>
      <ellipse cx="236" cy="99.5" rx="8" ry="2.2" fill="#b56f70"/>
      <path d="M206 107C250 100 310 112 356 104L356 109C310 117 250 105 206 112Z" fill="#dc9d9d" stroke="#bf7f7c" strokeWidth=".8"/>
      <path d="M206 147C250 140 310 150 356 144L356 150C310 156 250 146 206 153Z" fill="#dc9d9d" stroke="#bf7f7c" strokeWidth=".8"/>
      <rect x="206" y="153" width="150" height="60" fill="#f7ebe3"/>
      {[[232, 127, -8], [276, 129, 6]].map(([x, y, rot]) => <g key={x} transform={`translate(${x} ${y}) rotate(${rot})`}><ellipse rx="15" ry="8" fill="#c95e68" stroke="#a74454" strokeWidth="1"/><ellipse rx="7" ry="3.2" fill="#e9a3a3"/></g>)}
    </g>
    <text x="214" y="46" {...text}>air space</text>
    <text x="214" y="88" {...text}>thin walls</text>
    <path d="M246 91L252 100" stroke="#657a89" strokeWidth="1"/>
    <text x="276" y="64" textAnchor="middle" {...text} fontSize={10} fill="#087f83" fontWeight="650">oxygen</text>
    <path d="M276 70V120" stroke="#087f83" strokeWidth="2.4" markerEnd={`url(#${r('o2')})`}/>
    <text x="350" y="52" textAnchor="end" {...text} fontSize={10} fill="#8555a4" fontWeight="650">carbon</text><text x="350" y="64" textAnchor="end" {...text} fontSize={10} fill="#8555a4" fontWeight="650">dioxide</text>
    <path d="M330 138V70" stroke="#8555a4" strokeWidth="2.4" markerEnd={`url(#${r('co2')})`}/>
    <path d="M226 168H338" stroke="#304659" strokeWidth="1.6" markerEnd={`url(#${r('ink')})`}/>
    <text x="281" y="186" textAnchor="middle" {...text}>blood flows through</text><text x="281" y="199" textAnchor="middle" {...text}>the capillary</text>
  </g>
}

/* Shared inset frame used by the alveoli, villi and gill drawings */
function Inset({ uid, title, children }: { uid: string; title: string; children: ReactNode }) {
  return <>
    <rect x="206" y="22" width="150" height="190" rx="10" fill="#fffefa" stroke="#9fb6c1" strokeWidth="1.3"/>
    <text x="281" y="16" textAnchor="middle" fill="#304659" fontSize="11" fontWeight="650">{title}</text>
    <clipPath id={`${uid}-clip`}><rect x="207" y="23" width="148" height="188" rx="9"/></clipPath>
    <g clipPath={`url(#${uid}-clip)`}>{children}</g>
  </>
}
function Marker({ id, colour }: { id: string; colour: string }) {
  return <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10L2 5Z" fill={colour}/></marker>
}
const food = '#c08a14', t11 = { fill: '#304659', fontSize: 11 }

function VilliDrawing({ uid }: { uid: string }) {
  const r = (n: string) => `${uid}-${n}`
  const villi: [number, number, number][] = [[26, 120, -3], [62, 138, 4], [100, 128, -2], [138, 142, 3], [176, 116, -4]]
  const finger = (cx: number, h: number, lean: number) => `M${cx - 14} 198C${cx - 16} ${198 - h * .5} ${cx - 13 + lean} ${198 - h + 5} ${cx + lean} ${198 - h}C${cx + 13 + lean} ${198 - h + 5} ${cx + 16} ${198 - h * .5} ${cx + 14} 198Z`
  const loop = (cx: number, h: number, lean: number) => `M${cx - 6} 204C${cx - 7} ${198 - h * .6} ${cx - 5 + lean} ${198 - h + 14} ${cx + lean} ${198 - h + 12}C${cx + 5 + lean} ${198 - h + 14} ${cx + 7} ${198 - h * .6} ${cx + 6} 204`
  const dots = [[44, 50], [82, 40], [118, 52], [158, 44], [44, 110], [82, 96], [120, 84], [156, 100], [192, 62], [8, 70]]
  return <g strokeLinejoin="round" strokeLinecap="round">
    <defs><Marker id={r('f')} colour={food}/><Marker id={r('b')} colour="#b8434f"/></defs>
    <path d="M4 196C60 192 140 200 200 194V232H4Z" fill="#f1ddd4" stroke="#c9a597" strokeWidth="1.5"/>
    <path d="M4 214C60 210 140 218 200 212" fill="none" stroke="#c75b66" strokeWidth="3"/>
    {villi.map(([cx, h, l], i) => <g key={i}><path d={finger(cx, h, l)} fill="#f6d6cc" stroke="#c48a88" strokeWidth="2"/><path d={loop(cx, h, l)} fill="none" stroke="#c75b66" strokeWidth="1.8"/></g>)}
    {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.8" fill={food}/>)}
    <path d="M150 222H192" stroke="#b8434f" strokeWidth="1.8" markerEnd={`url(#${r('b')})`}/>
    <text x="4" y="14" {...t11} fontWeight="650">villi: many finger-like folds</text><text x="4" y="27" {...t11}>give a large surface area</text>
    <path d="M60 30L64 58" stroke="#657a89"/><circle cx="64" cy="59" r="2" fill="#657a89"/>
    <text x="196" y="42" {...t11} fill={food} textAnchor="end">digested</text><text x="196" y="54" {...t11} fill={food} textAnchor="end">food</text>
    <text x="4" y="247" {...t11}>capillaries in each villus</text><path d="M112 242L132 190" stroke="#657a89"/><circle cx="132" cy="189" r="2" fill="#657a89"/>
    <circle cx="146" cy="84" r="15" fill="none" stroke="#657a89" strokeWidth="1.3" strokeDasharray="3 3"/>
    <path d="M160 80L206 70" stroke="#657a89" strokeWidth="1.3" strokeDasharray="3 3"/>
    <Inset uid={uid} title="one villus tip, enlarged">
      <rect x="206" y="22" width="150" height="190" fill="#fbf6e6"/>
      <path d="M214 212C214 116 236 58 281 54C326 58 348 116 348 212Z" fill="#f6d6cc" stroke="#c48a88" strokeWidth="2"/>
      {Array.from({ length: 13 }, (_, i) => { const a = Math.PI * (i + .5) / 13; const cx = 281 - Math.cos(a) * 60, cy = 128 - Math.sin(a) * 70; return <path key={i} d={`M${cx} ${cy}L${281 - Math.cos(a) * 49} ${128 - Math.sin(a) * 58}`} stroke="#d8a79f" strokeWidth="1.2"/> })}
      <path d="M227 212C228 128 246 74 281 70C316 74 334 128 335 212" fill="none" stroke="#e2b3a9" strokeWidth="1.4"/>
      <path d="M240 212C241 136 256 90 281 86C306 90 321 136 322 212" fill="none" stroke="#c75b66" strokeWidth="11"/>
      <path d="M240 212C241 136 256 90 281 86C306 90 321 136 322 212" fill="none" stroke="#f3c4c2" strokeWidth="8"/>
      {[[243, 160, 80], [262, 96, 30], [300, 96, -30], [319, 150, -80]].map(([x, y, rot], i) => <ellipse key={i} cx={x} cy={y} rx="5" ry="3" transform={`rotate(${rot} ${x} ${y})`} fill="#c95e68"/>)}
      {[[326, 40], [346, 56], [224, 72], [342, 78], [240, 56]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={food}/>)}
      <path d="M254 44L262 82" stroke={food} strokeWidth="2.2" markerEnd={`url(#${r('f')})`}/><path d="M318 50L306 84" stroke={food} strokeWidth="2.2" markerEnd={`url(#${r('f')})`}/>
      <path d="M322 150V200" stroke="#b8434f" strokeWidth="1.8" markerEnd={`url(#${r('b')})`}/>
    </Inset>
    <text x="212" y="36" {...t11} fill={food} fontWeight="650">food molecules</text>
    <text x="281" y="228" {...t11} textAnchor="middle" fontWeight="650">thin wall: one cell thick</text>
    <path d="M334 222L340 196" stroke="#657a89"/><circle cx="340" cy="195" r="2" fill="#657a89"/>
    <text x="281" y="242" {...t11} textAnchor="middle">short distance to the blood</text>
    <text x="281" y="150" {...t11} textAnchor="middle" fontSize={10.5}>capillary</text><text x="281" y="163" {...t11} textAnchor="middle" fontSize={10.5}>blood carries</text><text x="281" y="175" {...t11} textAnchor="middle" fontSize={10.5}>food away</text>
  </g>
}

function GillDrawing({ uid }: { uid: string }) {
  const r = (n: string) => `${uid}-${n}`, water = '#2f86b6'
  const fils = Array.from({ length: 10 }, (_, i) => 38 + i * 19)
  const archX = (y: number) => 40 - Math.sin((y - 20) / 210 * Math.PI) * 14
  return <g strokeLinejoin="round" strokeLinecap="round">
    <defs><Marker id={r('w')} colour={water}/><Marker id={r('o')} colour="#087f83"/><Marker id={r('b')} colour="#b8434f"/></defs>
    <path d={`M${archX(28)} 28${fils.map(y => `L${archX(y)} ${y}`).join('')}L${archX(222)} 222`} fill="none" stroke="#dcc8a4" strokeWidth="13"/>
    {fils.map((y, i) => { const x0 = archX(y) + 4, x1 = 156 + (i % 3) * 8, bend = (i % 2 ? 5 : -4)
      const d = `M${x0} ${y - 4}Q${(x0 + x1) / 2} ${y - 5 + bend} ${x1} ${y + bend * .6}Q${x1 + 5} ${y + 2 + bend * .6} ${x1} ${y + 3 + bend * .6}Q${(x0 + x1) / 2} ${y + 4 + bend} ${x0} ${y + 4}Z`
      return <g key={y}><path d={d} fill="#e8989a" stroke="#b8566a" strokeWidth="1.2"/>
        {Array.from({ length: 12 }, (_, k) => { const x = x0 + 8 + k * ((x1 - x0 - 12) / 12); const yy = y + bend * ((x - x0) / (x1 - x0)) * .8; return <path key={k} d={`M${x} ${yy - 4}V${yy - 7}M${x} ${yy + 4}V${yy + 7}`} stroke="#d27c85" strokeWidth="1.3"/> })}</g> })}
    {[47, 104, 161].map(y => <path key={y} d={`M64 ${y + 10}H146`} stroke={water} strokeWidth="2" markerEnd={`url(#${r('w')})`}/>)}
    <text x="4" y="13" {...t11} fontWeight="650">many thin gill filaments:</text><text x="4" y="25" {...t11}>large surface area</text>
    <path d="M134 16L156 34" stroke="#657a89"/><circle cx="156" cy="35" r="2" fill="#657a89"/>
    <text x="200" y="248" {...t11} fill={water} fontWeight="650" textAnchor="end">water flows between filaments</text>
    <text transform="translate(16 150) rotate(-90)" textAnchor="middle" {...t11} fill="#6d5a3a">gill arch</text>
    <circle cx="150" cy="114" r="15" fill="none" stroke="#657a89" strokeWidth="1.3" strokeDasharray="3 3"/>
    <path d="M164 108L206 92" stroke="#657a89" strokeWidth="1.3" strokeDasharray="3 3"/>
    <Inset uid={uid} title="one filament, enlarged">
      <rect x="206" y="22" width="150" height="190" fill="#eef7fb"/>
      <path d="M206 112H356V132H206Z" fill="#e8989a" stroke="#b8566a" strokeWidth="1.4"/>
      <path d="M206 122H356" stroke="#b8434f" strokeWidth="3"/>
      {Array.from({ length: 7 }, (_, k) => 222 + k * 19).map(x => <g key={x}>
        <path d={`M${x - 4} 112V${80 + (x % 3) * 2}Q${x} ${74 + (x % 3) * 2} ${x + 4} ${80 + (x % 3) * 2}V112Z`} fill="#f3b4b4" stroke="#c0676f" strokeWidth="1.1"/>
        <path d={`M${x - 4} 132V${164 - (x % 3) * 2}Q${x} ${170 - (x % 3) * 2} ${x + 4} ${164 - (x % 3) * 2}V132Z`} fill="#f3b4b4" stroke="#c0676f" strokeWidth="1.1"/>
        <path d={`M${x} 110V84M${x} 134V160`} stroke="#d0525f" strokeWidth="1"/></g>)}
      <path d="M346 60H222" stroke={water} strokeWidth="2.4" markerEnd={`url(#${r('w')})`}/><path d="M346 184H222" stroke={water} strokeWidth="2.4" markerEnd={`url(#${r('w')})`}/>
      {[250, 307].map(x => <path key={x} d={`M${x} 64V${84}`} stroke="#087f83" strokeWidth="2.2" markerEnd={`url(#${r('o')})`}/>)}
      <path d="M232 122H330" stroke="#fff" strokeWidth="1.6" markerEnd={`url(#${r('b')})`} opacity=".9"/>
    </Inset>
    <text x="214" y="52" {...t11} fill={water} fontWeight="650">water</text>
    <text x="350" y="52" {...t11} fill="#087f83" textAnchor="end" fontWeight="650">oxygen in</text>
    <text x="281" y="200" {...t11} textAnchor="middle" fontSize={10.5}>thin plates (lamellae)</text>
    <text x="206" y="228" {...t11} fontWeight="650">blood carries oxygen</text><text x="206" y="242" {...t11}>away along the filament</text>
    <path d="M348 226L350 126" stroke="#657a89"/><circle cx="350" cy="124" r="2" fill="#657a89"/>
  </g>
}

function ExchangeSurface({ focus }: { focus: string }) {
  const id = useId(), uid = id.replace(/[^a-zA-Z0-9_-]/g, '')
  const lung=focus==='exchange-lung', intestine=focus==='exchange-intestine', gill=focus==='exchange-gill'
  return <div className="science-bio-model"><svg viewBox={lung || intestine || gill ? '0 0 360 252' : '0 0 360 155'} role="img" aria-labelledby={id}><title id={id}>{(lung ? 'An airway ends in a cluster of many alveoli (air sacs). A capillary network covers them: blood arrives with less oxygen and leaves with more. Inset: one alveolus wall enlarged, showing air, two thin walls and a capillary with red blood cells; oxygen diffuses from air into blood and carbon dioxide from blood into air.' : intestine ? 'Section of the small intestine wall with many finger-like villi projecting into the gut, each containing a capillary network, with digested food molecules in the gut. Inset: one villus tip enlarged, showing a wall one cell thick with a capillary just beneath it; food molecules cross the wall into the blood, which carries them away.' : gill ? 'A fish gill: many thin gill filaments project from a curved gill arch, and water flows between them. Inset: one filament enlarged, covered in many thin plates called lamellae with blood vessels inside; water passes over them, oxygen diffuses from the water into the blood, and blood carries it away along the filament.' : 'Simplified leaf cross section: surface pore, internal air spaces and surrounding plant cells.') + " Original model, not to scale."}</title>{lung ? <AlveoliDrawing uid={uid}/> : intestine ? <VilliDrawing uid={uid}/> : gill ? <GillDrawing uid={uid}/> : <g><path d="M20 22H158M202 22H340M20 130H340" stroke={green} strokeWidth="8" />{[40,91,240,293].map((x,i)=><g key={x}><rect x={x} y={i%2===0?48:71} width="34" height="36" rx="10" fill="#dbefce" stroke={green} /><circle cx={x+9} cy={i%2===0?58:81} r="4" fill={green}/><circle cx={x+24} cy={i%2===0?72:95} r="4" fill={green}/></g>)}<ellipse cx="156" cy="23" rx="16" ry="12" fill="#b6d99e" stroke={green}/><ellipse cx="203" cy="23" rx="16" ry="12" fill="#b6d99e" stroke={green}/><path d="M180 4v45l-5-7m5 7l5-7" stroke={blue} fill="none" strokeWidth="2" /></g>}</svg><p className="science-bio-note">{lung ? 'Air reaches many alveoli. Nearby blood vessels and ventilation help maintain gas concentration differences.' : intestine ? 'Villi increase area. A thin surface and nearby blood supply support absorption.' : gill ? 'Many thin gill surfaces provide a large area. Water flow and blood supply help maintain gradients.' : 'Stomata allow gas passage. Air spaces expose thin cell surfaces for diffusion.'}</p></div>
}
function CubeRatios() {
  return <div className="science-bio-cards">{[1,2].map(s=><div key={s}><svg viewBox="0 0 160 100" role="img" aria-label={`Model cube, side ${s} cm; use supplied dimensions, not screen measurements.`}><g transform={s===1?'translate(35 42) scale(0.5)':undefined}><path d="M40 30L64 13H117L94 30ZM40 30H94V84H40ZM94 30L117 13V67L94 84Z" fill={s===1?'#daedf9':'#e8def7'} stroke={ink} strokeWidth="2"/></g><text x="65" y="98" textAnchor="middle" fill={ink} fontSize="12">{s} cm side</text></svg>Area: {6*s*s} cm²<br/>Volume: {s*s*s} cm³<br/>SA:V = {6/s}:1</div>)}</div>
}
function PracticalSetup() {
  const id=useId()
  return <div className="science-bio-model"><svg viewBox="0 0 440 170" role="img" aria-labelledby={id}><title id={id}>Five labelled containers from dilute to concentrated, each holding matching plant-tissue pieces. A tissue piece is blotted consistently, then placed on a balance. Teacher-supervised preparation; original schematic, not to scale.</title>{transportData.map((d,i)=><g key={d.concentration}><path d={`M${15+i*58} 17v65h44V17`} fill="none" stroke={ink} strokeWidth="2"/><path d={`M${16+i*58} 42h42v39h-42Z`} fill="#d9edf7"/><rect x={31+i*58} y="51" width="12" height="24" rx="3" fill="#e4ce92" stroke="#a28e54"/><text x={37+i*58} y="101" textAnchor="middle" fontSize="12" fill={ink}>{d.concentration.toFixed(1)}</text></g>)}<path d="M309 61h20l-6-5m6 5l-6 5" fill="none" stroke={ink} strokeWidth="2"/><rect x="339" y="23" width="81" height="37" rx="4" fill="#f4f3ee" stroke="#b1aaa1"/><rect x="372" y="32" width="12" height="22" rx="3" fill="#e4ce92" stroke="#a28e54"/><text x="380" y="75" textAnchor="middle" fontSize="12" fill={ink}>Blot</text><path d="M380 81v14l-5-5m5 5l5-5" fill="none" stroke={ink}/><path d="M342 108h76l8 35h-92Z" fill="#dfeaf1" stroke={ink}/><path d="M349 106h61" stroke={ink} strokeWidth="4"/><rect x="366" y="96" width="26" height="9" rx="3" fill="#e4ce92"/><rect x="352" y="119" width="58" height="16" rx="2" fill="#fff" stroke={ink}/><text x="381" y="131" textAnchor="middle" fontSize="11" fill={ink}>mass / g</text><text x="153" y="126" textAnchor="middle" fontSize="12" fill={ink}>Concentration (mol/dm³)</text><text x="153" y="148" textAnchor="middle" fontSize="12" fill={ink}>Matching tissue dimensions · same solution volume</text></svg><p className="science-bio-note">Measure initial mass; immerse for the same time at the same temperature; blot consistently and measure final mass. Keep tissue type and dimensions the same; repeat each concentration. Cutting and solution preparation require teacher supervision and a risk assessment.</p></div>
}
export function PracticalGraph({ plot = false }: { plot?: boolean }) {
  const id=useId(), [selected,setSelected]=useState<number|null>(null), [plotted,setPlotted]=useState<number|null>(null)
  const x=(c:number)=>54+c/0.8*262, y=(v:number)=>99-v*3.2
  return <div className="science-bio-model"><p className="science-bio-note">Example data · not laboratory measurements.</p><svg className="science-bio-graph" viewBox="0 0 360 230" role="img" aria-labelledby={id}><title id={id}>{"Graph of solution concentration against percentage mass change, with labelled axes. Equivalent values are in the table. " + (plot ? 'The point at 0.2 mol/dm³ can be plotted using the controls below.' : 'A straight illustrative trend crosses the zero mass-change line between 0.2 and 0.4 mol/dm³.')}</title>{[-25,-20,-15,-10,-5,0,5,10,15,20].map(v=><g key={v}><path d={`M54 ${y(v)}H316`} stroke={v===0?'#91acc0':'#e3ecf2'} strokeDasharray={v===0?'4 3':undefined}/><text x="45" y={y(v)+4} textAnchor="end" fill={ink} fontSize="12">{v>0?'+':''}{v}</text></g>)}<path d="M54 35V179H328" fill="none" stroke={ink} strokeWidth="2" />{[0,.1,.2,.3,.4,.5,.6,.7,.8].map(c=><text key={c} x={x(c)} y="194" textAnchor="middle" fontSize="12" fill={ink}>{c.toFixed(1)}</text>)}{!plot && <path d={`M${x(0)} ${y(15)}L${x(.8)} ${y(-25)}`} fill="none" stroke="#9c80c4" strokeWidth="2"/>}{transportData.filter(d=>!plot||d.concentration!==.2).map(d=><circle key={d.concentration} cx={x(d.concentration)} cy={y(d.percent)} r="4" fill={blue} stroke={ink}/>)}{plot&&plotted!==null&&<circle cx={x(.2)} cy={y(plotted)} r="6" fill={amber} stroke={ink}/>}<text x="187" y="218" textAnchor="middle" fontSize="12" fill={ink}>Concentration (mol/dm³)</text><text transform="translate(16 111) rotate(-90)" textAnchor="middle" fontSize="12" fill={ink}>Mass change (%)</text></svg>
    <table className="science-bio-table"><caption>Example plant-tissue results</caption><thead><tr><th scope="col">Concentration<br/>(mol/dm³)</th><th scope="col">Initial<br/>(g)</th><th scope="col">Final<br/>(g)</th><th scope="col">Change<br/>(%)</th></tr></thead><tbody>{transportData.map(d=><tr key={d.concentration}><th scope="row">{d.concentration.toFixed(1)}</th><td>{d.initial.toFixed(2)}</td><td>{d.final.toFixed(2)}</td><td>{d.percent>0?'+':''}{d.percent}</td></tr>)}</tbody></table>
    {plot&&<div className="science-bio-plot"><p>At 0.2 mol/dm³, select the percentage mass change to plot.</p><div role="group" aria-label="Select graph point">{[-5,5,15].map(v=><button className="science-secondary" type="button" key={v} aria-pressed={selected===v} onClick={()=>{setSelected(v);setPlotted(null)}}>{v>0?'+':''}{v}%</button>)}</div><button className="science-secondary" type="button" disabled={selected===null} onClick={()=>setPlotted(selected)}>Plot point</button>{plotted!==null&&<p role="status">{plotted===5?'Point plotted at (0.2, +5).':'Compare your plotted point with the table: the value is +5%, above the zero line.'}</p>}</div>}
  </div>
}
export function TransportVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus==='diffusion'||focus==='diffusion-question'||focus.startsWith('osmosis')||focus==='active'||focus==='gut-active') return <ParticleModel focus={focus} assessment={assessment}/>
  if (focus.startsWith('exchange-')) return <ExchangeSurface focus={focus}/>
  if (focus==='ratio') return <CubeRatios/>
  if (focus==='practical-setup') return <PracticalSetup/>
  if (['practical-data','practical-graph','graph-question','plot'].includes(focus)) return <PracticalGraph plot={focus==='plot'}/>
  const notes: Record<string,string[]> = {
    'diffusion-examples':['Oxygen: blood → cells when cell concentration is lower','Carbon dioxide: respiring cells → blood','Urea: cells → blood plasma'],
    'diffusion-rate':['Steeper gradient → faster net diffusion','Higher temperature → faster particle movement','Larger area → more particles can cross at once'],
    'tissue-gain':['Outside: more dilute','Net water enters cells','Tissue can gain mass'],
    'tissue-loss':['Outside: more concentrated','Net water leaves cells','Tissue can lose mass'],
    'transport-compare':['Diffusion: net higher → lower concentration','Osmosis: water, dilute → concentrated across a partially permeable membrane','Active transport: lower → higher concentration; energy from respiration'],
    'practical-setup':['Teacher-prepared plant tissue and labelled concentration range','Balance: initial and consistently blotted final mass','Same time, temperature, volumes, tissue type/dimensions; repeats'],
    percentage:['Example sample','Initial mass: 2.00 g','Final mass: 2.20 g'],
    'ratio-worked':['Cube side: 2 cm','Six equal square faces','Area = 6 × side²; volume = side³'],
    'uptake-rate':['Example mass gain: 0.20 g','Time taken: 40 min','Rate = 0.005 g/min'],
  }
  return notes[focus] ? <div className="science-bio-cards">{notes[focus].map(s=><div key={s}>{s}</div>)}</div> : null
}

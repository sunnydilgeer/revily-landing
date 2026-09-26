import { AnatomyFigure, Flow, Pointer, RedCell, anatomy, type DiagramIds } from './AnatomyFigure'

function VesselSection({ x, type, ids }: { x: number; type: 'artery' | 'vein' | 'capillary'; ids: DiagramIds }) {
  const artery = type === 'artery', capillary = type === 'capillary'
  const r = capillary ? 38 : 66
  return <g transform={`translate(${x} 116)`}>
    {!capillary && <><circle r={r} fill="#e6d1bb" stroke="#a78d78" strokeWidth="2"/><circle r={r-8} fill={`url(#${ids.ref('muscle')})`} stroke="#b87972" strokeWidth="1.5"/>
      <circle r={r-8} fill={`url(#${ids.ref('fibres')})`}/>
      <circle r={artery ? 38 : 53} fill="none" stroke="#f7d692" strokeWidth={artery ? 4 : 2}/>
      {artery && <circle r="47" fill="none" stroke="#f7d692" strokeWidth="2" strokeDasharray="12 3"/>}
    </>}
    <circle r={capillary ? r : artery ? 31 : 50} fill="#fff9f1" stroke="#b48688" strokeWidth={capillary ? 5 : 4}/>
    {capillary ? <><RedCell x={0} y={0} scale={1.35}/><ellipse cx="-35" cy="-5" rx="4" ry="11" fill="#977693" transform="rotate(15)"/><path d="M11-34l2-5M12 34l2 5" stroke="#9b7784" strokeWidth="1.3"/></> : <>
      <text y="5" textAnchor="middle" fontSize="14">lumen</text>
      {[0,90,180,270].map(angle => <ellipse key={angle} cx={artery ? 32 : 50} cy="0" rx="2" ry="5" fill="#987293" transform={`rotate(${angle})`}/>)}
    </>}
  </g>
}

export function VesselComparison({ focus, assessment }: { focus: string; assessment: boolean }) {
  const types = ['artery','vein','capillary'] as const
  return <AnatomyFigure title="Blood vessels: across and along" height={360}
    description={assessment ? 'Three vessels labelled A, B and C. Both cross-sections and lengthwise cutaways are shown. A has a thick wall; B has a wider central space and valve flaps in its lengthwise view; C has a thin single layer of flattened cells and red blood cells passing in single file. The drawings use different magnifications.' : 'An artery has a thick muscular and elastic wall around a relatively small lumen. A vein has a thinner wall and wider lumen; valves are shown in a lengthwise view. A much more magnified capillary has a wall only one endothelial cell thick and a narrow lumen for red blood cells to pass in single file.'}
    labels={assessment ? undefined : [
      { mark: 'A', name: 'Artery', detail: 'Thick muscle and elastic tissue withstand high pressure; elastic recoil helps maintain flow.', active: focus === 'vessel-artery' },
      { mark: 'B', name: 'Vein', detail: 'Thinner walls and a large lumen suit low pressure. Many veins have valves that prevent backflow.', active: focus === 'vessel-vein' },
      { mark: 'C', name: 'Capillary', detail: 'Just one layer of endothelial cells and a thin supporting layer. The narrow lumen keeps blood close to the wall.', active: focus === 'vessel-capillary' },
    ]} note={assessment ? 'Top: cross-sections. Bottom: lengthwise cutaways. Different magnifications are used; C is much more magnified.' : 'Top: cross-sections. Bottom: lengthwise cutaways. Tan = outer supporting tissue; pink = muscle; gold = elastic fibres; purple-edged inner layer = endothelium. Different magnifications: the capillary is much more enlarged.'}>
    {ids => <>
      {types.map((type,i) => <g key={type}>
        <rect x={8+i*198} y="13" width="190" height="330" rx="16" fill={focus === `vessel-${type}` ? '#eef5f0' : '#faf7f0'} stroke={focus === `vessel-${type}` ? '#8fb7a9' : '#e6e6df'}/>
        <text x={103+i*198} y="40" fontSize="16" textAnchor="middle" fontWeight="700">{assessment ? String.fromCharCode(65+i) : `${String.fromCharCode(65+i)} · ${type}`}</text>
        <VesselSection x={103+i*198} type={type} ids={ids}/>
      </g>)}
      <text x="103" y="210" textAnchor="middle" fontSize="12">cross-section</text><text x="301" y="210" textAnchor="middle" fontSize="12">cross-section</text><text x="499" y="210" textAnchor="middle" fontSize="12">extra magnification</text>
      {/* Artery: muscle and elastic layers continue along the vessel. */}
      <path d="M29 244H177V302H29Z" fill="#d9a091" stroke="#a67870" strokeWidth="1.5"/><path d="M29 244H177V302H29Z" fill={`url(#${ids.ref('fibres')})`}/>
      <path d="M29 254H177M29 292H177" stroke="#f1d394" strokeWidth="2"/>
      <path d="M29 261H177V285H29Z" fill="#fff7ed" stroke="#b48688" strokeWidth="2"/>
      <Flow ids={ids} d="M51 273H154" colour="red" width={2.5}/>
      {/* Vein: a pair of open pocket valves project into the lumen in a longitudinal view. */}
      <path d="M227 243H375V305H227Z" fill="#eed7c8" stroke="#b59a8b" strokeWidth="1.5"/><path d="M227 249H375V299H227Z" fill="#f3f7f8" stroke="#b48688" strokeWidth="2"/>
      <path d="M289 249Q307 263 326 260L325 266Q303 268 289 249ZM289 299Q307 285 326 288L325 282Q303 280 289 299Z" fill="#d8e5e9" stroke="#72929f" strokeWidth="1.5"/>
      <Flow ids={ids} d="M243 274H361" colour="blue" width={2.5}/>
      {/* Endothelial cell borders, not large holes in a dashed tube. */}
      <path d="M426 258H574V263H426ZM426 285H574V290H426Z" fill="#e5c4c2" stroke="#a98488" strokeWidth="1.2"/>
      <path d="M426 264H574V284H426Z" fill="#fff0e9"/>
      <path d="M474 258V263M538 258V263M453 285V290M520 285V290" stroke="#9b7884" strokeWidth="1.2"/>
      <ellipse cx="455" cy="260" rx="7" ry="2.3" fill="#967693"/><ellipse cx="536" cy="288" rx="7" ry="2.3" fill="#967693"/>
      <RedCell x={449} y={274} scale={.75}/><RedCell x={492} y={274} scale={.75}/><RedCell x={535} y={274} scale={.75}/>
      <Flow ids={ids} d="M437 320H562" colour="red" width={2}/>
      <text x="103" y="328" textAnchor="middle" fontSize="12">lengthwise</text><text x="301" y="328" textAnchor="middle" fontSize="12">lengthwise</text>
    </>}
  </AnatomyFigure>
}

function TissueCell({ x, y, rotate = 0, scale = 1 }: { x: number; y: number; rotate?: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}><path d="M-24-9Q-15-29 9-23Q30-14 25 8Q15 30-9 24Q-30 16-24-9Z" fill="#eee5f2" stroke="#b39cbc" strokeWidth="1.5"/><ellipse rx="7" ry="5" fill="#b5a0c4"/><path d="M-15 6q8-8 12-3" fill="none" stroke="#cec0d6" strokeWidth="2"/></g>
}

export function CapillaryNetwork() {
  const branches = [
    'M103 184C172 174 173 80 241 87S376 91 425 173L491 184',
    'M103 184C181 194 183 136 239 145S354 137 414 175L491 184',
    'M103 184C189 181 191 223 252 217S361 216 414 195L491 184',
    'M103 184C169 195 175 290 243 279S362 290 425 203L491 184',
    'M201 101Q221 124 223 144L245 183L239 219Q213 250 222 279',
    'M311 88L322 141Q299 178 320 216L303 278',
    'M382 125L362 153M379 211L368 254',
  ]
  return <AnatomyFigure title="Capillaries form a branching exchange network" height={365}
    description="A small artery branches into interconnected capillaries passing between tissue cells. The capillaries rejoin into a small vein. Oxygen and glucose move out towards the cells; carbon dioxide moves from cells into blood. Arrows on the larger vessels show the direction of blood flow."
    labels={[
      { mark: '1', name: 'Arteriole', detail: 'A small artery supplies the capillary bed.' },
      { mark: '2', name: 'Capillary network', detail: 'Many narrow branches pass close to body cells.' },
      { mark: '3', name: 'Venule', detail: 'A small vein collects blood from the network.' },
      { mark: '4', name: 'Body cells', detail: 'Exchange dissolved substances with blood via tissue fluid.' },
    ]} note="A schematic body-tissue capillary bed; vessel widths and cell sizes are not to the same scale. Blood loses oxygen as it passes through the network.">
    {ids => <>
      <rect x="117" y="52" width="366" height="256" rx="38" fill="#f8f3ee"/>
      {[[181,150],[271,113],[350,116],[282,180],[195,235],[284,249],[350,245],[421,246]].map(([x,y],i) => <TissueCell key={i} x={x} y={y} rotate={i*27} scale={.7}/>)}
      <path fill="none" stroke={`url(#${ids.ref('body-blood')})`} strokeWidth="7" d={branches.join(' ')}/>
      <path d="M27 184H107" stroke="#d89991" strokeWidth="27"/><path d="M27 184H107" stroke="#f7d9d0" strokeWidth="18"/>
      <path d="M491 184H573" stroke="#91b4c6" strokeWidth="27"/><path d="M491 184H573" stroke="#daeaf0" strokeWidth="18"/>
      <Flow ids={ids} d="M39 184H91" colour="red" width={2.5}/><Flow ids={ids} d="M503 184H561" colour="blue" width={2.5}/>
      <Flow ids={ids} d="M135 172Q151 158 159 141" colour="red" width={2}/><Flow ids={ids} d="M439 211L465 193" colour="blue" width={2}/>
      <Flow ids={ids} d="M257 146L274 161" colour="oxygen" width={2.5}/><Flow ids={ids} d="M282 226L280 209" colour="carbon" width={2.5}/>
      <Pointer mark="1" x={54} y={103} toX={72} toY={174}/><Pointer mark="2" x={205} y={32} toX={238} toY={87}/><Pointer mark="3" x={548} y={270} toX={534} toY={194}/><Pointer mark="4" x={390} y={326} toX={422} toY={248}/>
      <text x="48" y="334" fontSize="13" fill={anatomy.oxygen}>oxygen + glucose → cells</text><text x="47" y="351" fontSize="13" fill={anatomy.carbon}>carbon dioxide → blood</text>
    </>}
  </AnatomyFigure>
}

export function CapillaryWall() {
  return <AnatomyFigure title="Across a one-cell-thick capillary wall" height={365}
    description="Magnified lengthwise capillary section next to body cells. A single layer of flattened endothelial cells surrounds the blood. Oxygen and glucose pass across the wall into tissue fluid and then into body cells. Carbon dioxide travels in the opposite direction. Red blood cells remain inside the capillary."
    labels={[
      { mark: '1', name: 'Capillary wall', detail: 'One layer of flattened endothelial cells gives a short diffusion distance.' },
      { mark: '2', name: 'Red blood cell', detail: 'Stays in the bloodstream; carries oxygen.' },
      { mark: '3', name: 'Tissue fluid', detail: 'Dissolved substances pass through this fluid between blood and cells.' },
      { mark: '4', name: 'Body cell', detail: 'Uses oxygen and glucose; produces carbon dioxide.' },
    ]} note="Enlarged lengthwise section, not to scale. Endothelial cells have nuclei; the lumen contains red blood cells. Tiny junctions are not large holes in the wall.">
    {ids => <>
      <rect x="47" y="132" width="505" height="197" rx="20" fill="#f4edf2"/>
      <path d="M47 81H552V159H47Z" fill="#fff0e7"/>
      <path d="M47 72H552V82H47ZM47 159H552V169H47Z" fill="#e5c4c2" stroke="#a67e83" strokeWidth="1.5"/>
      <path d="M47 171H552" stroke="#cbb5d1" strokeWidth="2"/>
      <g fill="#92718f">{[98,273,472].map(x => <ellipse key={x} cx={x} cy="77" rx="14" ry="4"/>)}{[155,369,518].map(x => <ellipse key={x} cx={x} cy="164" rx="14" ry="4"/>)}</g>
      <path d="M189 72V82M392 72V82M251 159V169M446 159V169" stroke="#936e7d" strokeWidth="1.4"/>
      <RedCell x={105} y={117} scale={1.5}/><RedCell x={211} y={125} rotate={-8} scale={1.5}/><RedCell x={328} y={111} rotate={10} scale={1.5}/><RedCell x={492} y={124} rotate={-10} scale={1.5}/>
      <Flow ids={ids} d="M245 113H286" colour="red" width={2}/><Flow ids={ids} d="M405 116H452" colour="red" width={2}/>
      <TissueCell x={161} y={276} rotate={15}/><TissueCell x={305} y={281} rotate={-25}/><TissueCell x={463} y={274} rotate={80}/>
      <Flow ids={ids} d="M160 135V246" colour="oxygen" width={3}/><Flow ids={ids} d="M280 137V246" colour="oxygen" width={3}/><Flow ids={ids} d="M445 242V139" colour="carbon" width={3}/>
      <g fontSize="14" fontWeight="650"><text x="95" y="216" fill={anatomy.oxygen}>oxygen</text><text x="211" y="216" fill={anatomy.oxygen}>glucose</text><text x="459" y="216" fill={anatomy.carbon}>CO₂</text></g>
      <Pointer mark="1" x={390} y={33} toX={352} toY={76}/><Pointer mark="2" x={109} y={33} toX={110} toY={115}/><Pointer mark="3" x={537} y={237} toX={383} toY={242}/><Pointer mark="4" x={235} y={334} toX={294} toY={290}/>
    </>}
  </AnatomyFigure>
}

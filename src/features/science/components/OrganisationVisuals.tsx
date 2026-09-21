import { useId } from 'react'

const ink = '#375a73', blue = '#55acd0', green = '#68ae92', purple = '#a68bd0', yellow = '#efc75d', pink = '#d990ad'

function Hierarchy({ focus, assessment }: { focus: string; assessment: boolean }) {
  const levels = ['Cell', 'Tissue', 'Organ', 'Organ system', 'Organism']
  const selected = focus === 'organisation-cell' ? 0 : focus === 'organisation-tissue' ? 1 : focus === 'organisation-organ' || focus === 'stomach-organ' || focus === 'stomach-function' ? 2 : focus === 'organisation-system' || focus.startsWith('digestive-') ? 3 : focus === 'organisation-whole' ? 4 : -1
  return <div className="science-org-flow" aria-label={assessment ? 'Five connected levels of biological organisation.' : 'Cell, tissue, organ, organ system and organism, from smallest to largest.'}>
    {levels.map((level, i) => <div key={level} className={selected === i ? 'is-focus' : ''}><span aria-hidden="true">{i + 1}</span><strong>{assessment ? `Level ${i + 1}` : level}</strong>{i < levels.length - 1 && <b aria-hidden="true">→</b>}</div>)}
  </div>
}

function Epithelial({ layer }: { layer: boolean }) {
  const title = useId()
  return <div className="science-bio-model"><svg viewBox="0 0 440 175" role="img" aria-labelledby={title}><title id={title}>{layer ? 'A row of similar epithelial cells joined into a continuous lining.' : 'One epithelial cell beside a group of similar cells forming a lining.'}</title>
    {Array.from({ length: layer ? 9 : 6 }, (_, i) => <g key={i} transform={`translate(${45 + i * 39} 0)`}><path d="M0 54q19-15 38 0v67q-19 15-38 0Z" fill={i % 2 ? '#f8dce8' : '#f4e7ef'} stroke={pink} strokeWidth="2"/><circle cx="19" cy="88" r="7" fill={purple}/></g>)}
    <path d="M37 137H403" stroke={ink} strokeWidth="4"/><text x="220" y="160" textAnchor="middle" fill={ink} fontSize="14">many similar cells form a lining</text>
  </svg></div>
}

function DigestiveSystem({ focus }: { focus: string }) {
  const title = useId()
  const active = focus === 'digestive-upper' ? 'upper' : focus === 'digestive-bile' ? 'bile' : focus === 'digestive-intestines' ? 'intestines' : 'all'
  const opacity = (group: 'upper' | 'bile' | 'intestines') => active === 'all' || active === group ? 1 : .28
  const label = (text: string, x: number, y: number, toX: number, toY: number, side: 'left' | 'right', group: 'upper' | 'bile' | 'intestines') => <g opacity={opacity(group)}>
    <path d={`M${side === 'left' ? 136 : 392} ${y - 4} L${toX} ${toY}`} fill="none" stroke={ink} strokeWidth="1.5"/>
    <circle cx={toX} cy={toY} r="2.5" fill={ink}/><text x={x} y={y} textAnchor={side === 'left' ? 'start' : 'end'} fill={ink} fontSize="12.5" fontWeight="600">{text}</text>
  </g>
  return <div className="science-bio-model"><svg viewBox="0 0 520 340" role="img" aria-labelledby={title}><title id={title}>A simplified digestive system showing salivary glands and mouth, oesophagus, liver, gall bladder, stomach, pancreas, duodenum, small intestine, large intestine and rectum in their approximate relative positions.</title>
    <g opacity={opacity('upper')}>
      <ellipse cx="258" cy="31" rx="23" ry="14" fill="#f5d8bf" stroke={ink} strokeWidth="2"/>
      <path d="M245 31q13 9 26 0" fill="none" stroke={pink} strokeWidth="3"/>
      <circle cx="231" cy="27" r="7" fill={yellow} stroke={ink}/><circle cx="285" cy="27" r="7" fill={yellow} stroke={ink}/>
      <path d="M237 31l11 8m31-8l-11 8" stroke={yellow} strokeWidth="2"/>
      <path d="M258 45C258 70 255 91 271 112" fill="none" stroke={ink} strokeWidth="10" strokeLinecap="round"/>
      <path d="M258 45C258 70 255 91 271 112" fill="none" stroke="#f5b9ad" strokeWidth="6" strokeLinecap="round"/>
      <path d="M274 105C309 94 344 111 347 142C350 168 336 198 309 202C286 205 270 189 274 170C278 152 291 141 287 124C284 115 279 109 274 105Z" fill="#f2a6a4" stroke={ink} strokeWidth="2.5"/>
      <path d="M305 183C318 174 345 174 360 184C345 195 319 200 291 195C294 191 299 187 305 183Z" fill="#efc56e" stroke={ink} strokeWidth="2"/>
    </g>
    <g opacity={opacity('bile')}>
      <path d="M112 91C146 71 221 72 267 105C252 135 210 151 155 145C122 142 101 119 112 91Z" fill="#c98c55" stroke={ink} strokeWidth="2.5"/>
      <path d="M207 139C219 137 226 148 222 164C219 176 208 179 202 168C197 158 199 143 207 139Z" fill={green} stroke={ink} strokeWidth="2"/>
      <path d="M212 162C218 178 235 184 258 190C275 194 287 204 291 217" fill="none" stroke={green} strokeWidth="4" strokeLinecap="round"/>
    </g>
    <g opacity={Math.max(opacity('upper'), opacity('intestines'))}>
      <path d="M310 201C342 208 346 231 326 244C313 252 295 249 290 236C286 226 291 218 298 214" fill="none" stroke="#e5a86a" strokeWidth="9" strokeLinecap="round"/>
    </g>
    <g opacity={opacity('intestines')}>
      <path d="M177 215H334C347 215 354 224 354 237V293C354 309 345 318 329 318H305C291 318 280 326 273 335M177 215C163 215 155 224 155 238V292C155 305 164 314 178 314" fill="none" stroke="#b97852" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M177 215H334C347 215 354 224 354 237V293C354 309 345 318 329 318H305C291 318 280 326 273 335M177 215C163 215 155 224 155 238V292C155 305 164 314 178 314" fill="none" stroke="#f2c79f" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M184 238C202 225 222 227 231 242C240 257 224 267 205 260C187 253 180 271 193 281C208 293 229 277 244 270C261 262 279 270 276 284C273 299 249 302 235 290C220 278 202 290 206 304M287 239C304 229 326 237 326 251C326 266 307 271 292 263C279 256 268 245 257 246C245 247 241 257 245 270" fill="none" stroke="#e5a94e" strokeWidth="9" strokeLinecap="round"/>
      <path d="M273 334v5" stroke="#b97852" strokeWidth="12" strokeLinecap="round"/>
    </g>
    {label('salivary glands', 18, 22, 231, 27, 'left', 'upper')}
    {label('mouth', 18, 48, 247, 34, 'left', 'upper')}
    {label('oesophagus', 18, 75, 258, 73, 'left', 'upper')}
    {label('liver', 18, 112, 124, 109, 'left', 'bile')}
    {label('gall bladder', 18, 158, 207, 153, 'left', 'bile')}
    {label('stomach', 502, 126, 337, 132, 'right', 'upper')}
    {label('pancreas', 502, 184, 349, 185, 'right', 'upper')}
    {label('duodenum', 502, 211, 334, 213, 'right', 'intestines')}
    {label('large intestine', 502, 246, 352, 247, 'right', 'intestines')}
    {label('small intestine', 502, 282, 316, 276, 'right', 'intestines')}
    {label('rectum', 502, 326, 276, 326, 'right', 'intestines')}
  </svg><p className="science-bio-note">Simplified front view · organ positions are approximate · not to scale</p></div>
}

function EnzymeModel({ focus, assessment }: { focus: string; assessment: boolean }) {
  const title = useId()
  const specific = focus === 'enzyme-specific' || focus === 'enzyme-match'
  const stageOpacity = (stage: 'before' | 'bound' | 'after') => focus === 'enzyme-products' ? stage === 'after' ? 1 : .32 : focus === 'enzyme-fit' ? stage === 'after' ? .32 : 1 : 1
  const enzymePath = 'M8 18C25-2 67 0 86 18C101 31 100 48 84 57L69 64L84 72C101 82 101 100 84 113C61 131 25 124 8 105C-7 88-9 37 8 18Z'
  const boundPath = 'M8 18C25-2 67 0 86 18C99 30 99 46 87 55L76 64L87 73C100 84 99 100 84 113C61 131 25 124 8 105C-7 88-9 37 8 18Z'
  const substratePath = 'M0 16L18 4Q26 0 34 6L43 16L34 27Q25 33 18 28L5 33Z'
  const EnzymeBlob = ({ x, y, bound = false, opacity = 1 }: { x: number; y: number; bound?: boolean; opacity?: number }) => <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <path d={bound ? boundPath : enzymePath} fill="#efd8e7" stroke={ink} strokeWidth="2.5"/>
    <path d={bound ? 'M86 55L76 64L87 73' : 'M84 57L69 64L84 72'} fill="none" stroke={pink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="38" cy="34" r="6" fill="#f8e9f1"/><circle cx="29" cy="88" r="8" fill="#e4c4d9"/><circle cx="62" cy="101" r="5" fill="#f8e9f1"/>
  </g>
  const Substrate = ({ x, y, opacity = 1 }: { x: number; y: number; opacity?: number }) => <path d={substratePath} transform={`translate(${x} ${y})`} fill={blue} stroke={ink} strokeWidth="2" opacity={opacity}/>
  const arrow = (x1: number, y1: number, x2: number, y2: number, opacity = 1) => <g opacity={opacity}><path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={ink} strokeWidth="2.5" fill="none"/><path d={`M${x2} ${y2}l-9-5m9 5l-8 7`} stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round"/></g>
  if (specific) return <div className="science-bio-model"><svg viewBox="0 0 600 255" role="img" aria-labelledby={title}><title id={title}>{assessment ? 'An enzyme with a shaped active site is shown beside two differently shaped possible substrates.' : 'A simplified specificity model: one substrate has a complementary shape and can bind to the active site; a differently shaped molecule cannot bind.'}</title>
    <EnzymeBlob x={78} y={65}/>
    <path d="M170 129C221 103 261 91 304 91" fill="none" stroke={green} strokeWidth="3" strokeDasharray="6 5"/>
    <Substrate x={307} y={75}/>
    <path d="M170 140C222 161 261 176 304 177" fill="none" stroke="#b2bdc6" strokeWidth="3" strokeDasharray="6 5"/>
    <rect x="310" y="156" width="44" height="44" rx="15" fill={yellow} stroke={ink} strokeWidth="2" transform="rotate(18 332 178)"/>
    {!assessment && <>
      <text x="128" y="219" textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">enzyme</text>
      <text x="175" y="121" fill={pink} fontSize="12.5" fontWeight="700">active site</text>
      <text x="375" y="92" fill={ink} fontSize="13.5" fontWeight="700">complementary shape</text>
      <text x="375" y="112" fill={green} fontSize="12.5">can bind</text>
      <text x="375" y="177" fill={ink} fontSize="13.5" fontWeight="700">different shape</text>
      <text x="375" y="197" fill="#687a87" fontSize="12.5">does not bind well</text>
      <circle cx="355" cy="80" r="10" fill={green}/><path d="M350 80l4 4l7-9" fill="none" stroke="white" strokeWidth="2.5"/>
      <circle cx="355" cy="166" r="10" fill="#9aa8b1"/><path d="M351 162l8 8m0-8l-8 8" stroke="white" strokeWidth="2.5"/>
    </>}
  </svg>{!assessment && <p className="science-bio-note">Simplified specificity model · real enzyme molecules are flexible, not rigid locks.</p>}</div>
  return <div className="science-bio-model"><svg viewBox="0 0 600 255" role="img" aria-labelledby={title}><title id={title}>A three-stage enzyme model showing a substrate approaching a complementary active site, an enzyme-substrate complex, and products leaving while the enzyme remains available for reuse.</title>
    {!assessment && <g fill={ink} fontSize="13" fontWeight="700"><text x="100" y="24" textAnchor="middle">1 · before</text><text x="300" y="24" textAnchor="middle">2 · bound complex</text><text x="500" y="24" textAnchor="middle">3 · after</text></g>}
    <g opacity={stageOpacity('before')}><EnzymeBlob x={35} y={63}/><Substrate x={145} y={112}/>{arrow(181,128,139,128)}</g>
    <g opacity={stageOpacity('bound')}><EnzymeBlob x={235} y={63} bound/><Substrate x={307} y={112}/></g>
    <g opacity={stageOpacity('after')}><EnzymeBlob x={435} y={63}/><path d="M545 111l18-9l13 13l-14 15l-17-7Z" fill={blue} stroke={ink} strokeWidth="2"/><path d="M548 145l14-10l18 8l-7 18l-20 2Z" fill="#88c4dd" stroke={ink} strokeWidth="2"/>{arrow(536,128,570,128)}</g>
    {arrow(194,128,220,128, stageOpacity('bound'))}{arrow(394,128,420,128, stageOpacity('after'))}
    {!assessment && <>
      <path d="M116 80L103 119" stroke={pink} strokeWidth="1.5"/><text x="71" y="72" fill={pink} fontSize="12.5" fontWeight="700">active site</text>
      <text x="166" y="177" textAnchor="middle" fill={ink} fontSize="12.5">substrate</text>
      <text x="300" y="211" textAnchor="middle" fill={ink} fontSize="12.5">temporary enzyme–substrate complex</text>
      <text x="565" y="187" textAnchor="middle" fill={ink} fontSize="12.5">products</text>
      <text x="500" y="238" textAnchor="middle" fill={green} fontSize="12.5" fontWeight="700">enzyme available again</text>
    </>}
  </svg>{!assessment && <p className="science-bio-note">The substrate changes into products. The enzyme is not used up.</p>}</div>
}

function EnzymeGraph({ ph }: { ph: boolean }) {
  const title = useId()
  return <div className="science-bio-model"><svg viewBox="0 0 440 210" role="img" aria-labelledby={title}><title id={title}>{ph ? 'A reaction-rate curve with a peak at an optimum pH.' : 'A reaction-rate curve rising to an optimum temperature then falling sharply at high temperature.'}</title>
    <path d="M55 22v145h340M55 167l8-7m-8 7l8 7M395 167l-8-7m8 7l-8 7" stroke={ink} strokeWidth="2" fill="none"/>
    <path d={ph ? 'M68 160C105 158 115 104 178 76C245 46 318 82 378 158' : 'M68 158C146 151 206 91 266 48C300 29 322 76 334 158'} fill="none" stroke={ph ? purple : pink} strokeWidth="6"/>
    <path d={ph ? 'M228 46v29' : 'M271 25v30'} stroke={ink} strokeDasharray="4 4"/><text x={ph ? 228 : 271} y="20" textAnchor="middle" fill={ink} fontSize="13">optimum</text>
    <text x="226" y="198" textAnchor="middle" fill={ink} fontSize="14">{ph ? 'pH' : 'temperature'}</text><text x="15" y="100" transform="rotate(-90 15 100)" textAnchor="middle" fill={ink} fontSize="14">reaction rate</text>
  </svg></div>
}

function EnzymePractical({ focus }: { focus: string }) {
  const title = useId()
  const wells = Array.from({ length: 8 }, (_, i) => i)
  return <div className="science-bio-model"><svg viewBox="0 0 440 220" role="img" aria-labelledby={title}><title id={title}>A water bath holds labelled reaction tubes. A pipette transfers samples to iodine drops in a spotting tile at regular times.</title>
    <path d="M28 45h170v120H28Z" fill="#dff3fb" stroke={ink} strokeWidth="3"/><path d="M42 70h142v80H42Z" fill="#bfe6f5"/><text x="113" y="190" textAnchor="middle" fill={ink} fontSize="13">constant-temperature water bath</text>
    {[68,110,152].map((x,i)=><g key={x}><path d={`M${x} 27v87q0 20 14 20t14-20V27Z`} fill="#fff" stroke={ink} strokeWidth="2"/><path d={`M${x+3} 83h22v35q0 12-11 12t-11-12Z`} fill={i===1?'#f5e5a6':'#e5d9f4'}/><text x={x+14} y="20" textAnchor="middle" fill={ink} fontSize="11">pH {4+i*2}</text></g>)}
    <path d="M212 67l67 53m-8-15l8 15l-16-3" stroke={ink} strokeWidth="3" fill="none"/><rect x="282" y="87" width="137" height="91" rx="12" fill="#f4f0e8" stroke={ink} strokeWidth="2"/>
    {wells.map(i=><circle key={i} cx={307+(i%4)*29} cy={112+Math.floor(i/4)*38} r="11" fill={i<5?'#302b61':'#d89a42'} stroke={ink}/>) }
    <text x="350" y="199" textAnchor="middle" fill={ink} fontSize="13">iodine wells · every 30 s</text>
  </svg>{focus === 'enzyme-practical-endpoint' && <p className="science-bio-note">End point: the first sample that stays brown-orange.</p>}</div>
}

function DigestionCards({ focus }: { focus: string }) {
  const rows = focus.includes('protease') ? ['Protein', 'Protease', 'Amino acids'] : focus.includes('lipase') ? ['Lipid', 'Lipase', 'Glycerol + fatty acids'] : ['Starch', 'Amylase', 'Sugars']
  return <div className="science-digestion-chain" aria-label={`${rows[0]} is broken down by ${rows[1]} into ${rows[2]}.`}><span>{rows[0]}</span><b>+</b><span>{rows[1]}</span><b>→</b><span>{rows[2]}</span></div>
}

function EnzymeSites() {
  return <div className="science-bio-model"><table className="science-bio-table"><caption>Digestive enzyme sites</caption><thead><tr><th>Enzyme</th><th>Made in</th><th>Works in</th></tr></thead><tbody><tr><th>Amylase</th><td>salivary glands, pancreas, small intestine</td><td>mouth, small intestine</td></tr><tr><th>Proteases</th><td>stomach, pancreas, small intestine</td><td>stomach, small intestine</td></tr><tr><th>Lipases</th><td>pancreas, small intestine</td><td>small intestine</td></tr></tbody></table></div>
}

function BileVisual({ focus }: { focus: string }) {
  if (focus === 'bile-emulsify') return <div className="science-bio-pair"><div><svg viewBox="0 0 180 130" role="img" aria-label="One large fat drop."><circle cx="90" cy="63" r="42" fill={yellow} stroke={ink} strokeWidth="2"/></svg><strong>One large drop</strong></div><div><svg viewBox="0 0 180 130" role="img" aria-label="Many small fat droplets.">{[[35,35],[83,27],[130,39],[55,82],[108,76],[145,95],[26,107]].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r="15" fill={yellow} stroke={ink}/>)}</svg><strong>More total surface area</strong></div></div>
  return <div className="science-bio-cards"><div><strong>Liver</strong><br/>makes bile</div><div><strong>Gall bladder</strong><br/>stores bile</div><div><strong>Small intestine</strong><br/>receives bile</div></div>
}

const testCards = [
  ['Benedict’s', 'reducing sugar', 'blue → green/yellow/orange/brick-red'],
  ['Iodine', 'starch', 'brown-orange → blue-black'],
  ['Biuret', 'protein', 'blue → lilac/purple'],
  ['Ethanol emulsion', 'lipid', 'clear → cloudy white emulsion'],
]
function FoodTests({ focus, assessment }: { focus: string; assessment: boolean }) {
  const visible = focus === 'food-benedict' ? [0] : focus === 'food-iodine' ? [1] : focus === 'food-biuret' ? [2] : focus === 'food-lipid' ? [3] : [0, 1, 2, 3]
  return <div className="science-food-tests">{visible.map(i=>{ const [test,target,result] = testCards[i]; return <div key={test}><span className={`science-test-tube science-test-tube--${i}`} aria-hidden="true"/><strong>{test}</strong>{!assessment && <><small>tests for {target}</small><p>{result}</p></>}</div> })}</div>
}

export function OrganisationVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('organisation-') || focus.startsWith('stomach-')) return <Hierarchy focus={focus} assessment={assessment}/>
  if (focus.startsWith('epithelial')) return <Epithelial layer={focus.endsWith('layer')}/>
  if (focus.startsWith('digestive-')) return <DigestiveSystem focus={focus}/>
  if (['enzyme-catalyst','enzyme-cycle','enzyme-fit','enzyme-specific','enzyme-products','enzyme-match'].includes(focus)) return <EnzymeModel focus={focus} assessment={assessment}/>
  if (focus === 'enzyme-temperature') return <EnzymeGraph ph={false}/>
  if (focus === 'enzyme-ph') return <EnzymeGraph ph/>
  if (focus.startsWith('enzyme-practical')) return <EnzymePractical focus={focus}/>
  if (focus.startsWith('enzyme-result') || focus === 'enzyme-rate') return <div className="science-bio-model"><table className="science-bio-table"><caption>Original example results</caption><thead><tr><th>pH</th><th>Time / s</th><th>Rate = 1000 ÷ time / s⁻¹</th></tr></thead><tbody>{[[3,210],[5,120],[7,60],[9,170]].map(([ph,time])=><tr key={ph}><td>{ph}</td><td>{time}</td><td>{(1000/time).toFixed(1)}</td></tr>)}</tbody></table></div>
  if (focus.startsWith('digestion-amylase') || focus.startsWith('digestion-protease') || focus.startsWith('digestion-lipase')) return <DigestionCards focus={focus}/>
  if (focus.startsWith('digestion-')) return <div className="science-digestion-chain"><span>large molecule</span><b>→</b><span>small soluble molecules</span><b>→</b><span>absorption</span></div>
  if (focus.startsWith('enzyme-sites')) return <EnzymeSites/>
  if (focus.startsWith('bile-')) return <BileVisual focus={focus}/>
  if (focus === 'food-sample' || focus === 'food-safety') return <div className="science-bio-cards"><div><strong>Prepare</strong><br/>one labelled food sample</div><div><strong>Test</strong><br/>use the named reagent safely</div><div><strong>Record</strong><br/>observation before conclusion</div></div>
  if (focus.startsWith('food-')) return <FoodTests focus={focus} assessment={assessment}/>
  return <Hierarchy focus="organisation-compare" assessment={assessment}/>
}

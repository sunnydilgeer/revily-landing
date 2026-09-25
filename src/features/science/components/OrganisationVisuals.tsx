import { useId } from 'react'

const ink = '#375a73', blue = '#55acd0', green = '#68ae92', purple = '#a68bd0', yellow = '#efc75d', pink = '#d990ad'

function Hierarchy({ focus, assessment }: { focus: string; assessment: boolean }) {
  const levels = ['Cell', 'Tissue', 'Organ', 'Organ system', 'Organism']
  const selected = focus === 'organisation-cell' ? 0 : focus === 'organisation-tissue' ? 1 : focus === 'organisation-organ' || focus === 'stomach-organ' || focus === 'stomach-function' ? 2 : focus === 'organisation-system' || focus.startsWith('digestive-') ? 3 : focus === 'organisation-whole' ? 4 : -1
  return <div className="science-org-flow" aria-label={assessment ? 'Five connected levels of biological organisation.' : 'Cell, tissue, organ, organ system and organism, from smallest to largest.'}>
    {levels.map((level, i) => <div key={level} className={selected === i ? 'is-focus' : ''}><span aria-hidden="true">{i + 1}</span><strong>{assessment ? `Level ${i + 1}` : level}</strong>{i < levels.length - 1 && <b aria-hidden="true">→</b>}</div>)}
  </div>
}

/** A continuous row of similar columnar cells that share their side walls (no gaps), with small natural variation. */
function epithelialRow(x0: number, x1: number, top: (x: number) => number, h: number, seed = 1) {
  const widths = [34, 38, 31, 36, 40, 33, 37, 35, 32, 39, 34, 36, 33]
  const xs = [x0]; let k = 0
  while (xs[xs.length - 1] < x1 - 20) { xs.push(Math.min(x1, xs[xs.length - 1] + widths[(k + seed) % widths.length])); k++ }
  xs[xs.length - 1] = x1
  const wob = (n: number) => Math.sin(n * 2.7 + seed) * 2.2
  const b = xs.map((x, n) => ({ tx: x + wob(n), ty: top(x), bx: x - wob(n) * .8, by: top(x) + h + wob(n + 3) * .6, cx: x + wob(n + 1) * 1.6 }))
  return b.slice(0, -1).map((l, n) => {
    const r = b[n + 1], mx = (l.tx + r.tx) / 2, dome = top(mx) - 5 - (n % 3)
    const d = `M${l.tx.toFixed(1)} ${l.ty.toFixed(1)}Q${mx.toFixed(1)} ${dome.toFixed(1)} ${r.tx.toFixed(1)} ${r.ty.toFixed(1)}Q${r.cx.toFixed(1)} ${((r.ty + r.by) / 2).toFixed(1)} ${r.bx.toFixed(1)} ${r.by.toFixed(1)}L${l.bx.toFixed(1)} ${l.by.toFixed(1)}Q${l.cx.toFixed(1)} ${((l.ty + l.by) / 2).toFixed(1)} ${l.tx.toFixed(1)} ${l.ty.toFixed(1)}Z`
    return { d, nx: (l.bx + r.bx) / 2 + wob(n + 5), ny: l.by - h * (.28 + ((n * 7) % 5) * .03), fill: n % 3 === 0 ? '#f6dfe9' : n % 3 === 1 ? '#f3e4ec' : '#f8e6ee', mid: mx, top: dome }
  })
}
function EpiCells({ cells }: { cells: ReturnType<typeof epithelialRow> }) {
  return <g strokeLinejoin="round">{cells.map((c, n) => <g key={n}><path d={c.d} fill={c.fill} stroke={pink} strokeWidth="1.8"/><ellipse cx={c.nx} cy={c.ny} rx="6.5" ry="8.5" transform={`rotate(${(n % 3) * 6 - 6} ${c.nx} ${c.ny})`} fill={purple} stroke="#7a62a8" strokeWidth=".8"/></g>)}</g>
}
function Epithelial({ layer }: { layer: boolean }) {
  const title = useId(), t = { fill: ink, fontSize: 12.5 }
  if (layer) {
    const top = (x: number) => 66 + ((x - 220) / 220) ** 2 * 22, h = 58
    const cells = epithelialRow(22, 418, top, h, 2), one = cells[5]
    const along = (a: number, b: number, f: (x: number) => number) => Array.from({ length: 41 }, (_, k) => a + (b - a) * k / 40).map((x, k) => `${k ? 'L' : 'M'}${x.toFixed(1)} ${f(x).toFixed(1)}`).join('')
    return <div className="science-bio-model"><svg viewBox="0 0 440 190" role="img" aria-labelledby={title}><title id={title}>A curved lining made of many similar column-shaped epithelial cells. Neighbouring cells share their side walls, so the layer is continuous with no gaps. Each cell has a nucleus; sizes vary slightly. The space inside the organ is above the lining and other tissue lies beneath. One cell is outlined to compare one cell with the whole tissue.</title>
      <path d={`${along(14, 426, x => top(x) + h + 1)}L426 186H14Z`} fill="#f4ebe4"/>
      <EpiCells cells={cells}/>
      <path d={along(14, 426, x => top(x) + h + 1)} fill="none" stroke="#b58a9c" strokeWidth="2"/>
      <path d={one.d} fill="none" stroke={ink} strokeWidth="2.6"/>
      <text x="220" y="20" textAnchor="middle" {...t} fontSize={11.5} fill="#526976">space inside the organ, e.g. the digestive system</text>
      <path d={along(24, 416, x => top(x) - 16)} fill="none" stroke="#9c70c7" strokeWidth="2"/>
      <text x="220" y={top(220) - 22} textAnchor="middle" {...t} fontWeight="700" fill="#7d55a8">epithelial tissue: the whole layer</text>
      <text x={one.mid} y="176" textAnchor="middle" {...t} fontWeight="700">one cell</text>
      <path d={`M${one.mid} 164L${one.mid} ${top(one.mid) + h - 6}`} stroke="#657a89"/><circle cx={one.mid} cy={top(one.mid) + h - 6} r="2" fill="#657a89"/>
      <text x="300" y="176" {...t} fontSize={11.5} fill="#526976">underlying tissue</text>
      <text x="24" y="162" {...t} fontSize={11.5}>many similar cells,</text><text x="24" y="176" {...t} fontSize={11.5}>no gaps between them</text>
    </svg></div>
  }
  const top = (x: number) => 64 + Math.sin((x - 150) / 60) * 3, h = 62
  const cells = epithelialRow(150, 420, top, h, 4)
  return <div className="science-bio-model"><svg viewBox="0 0 440 175" role="img" aria-labelledby={title}><title id={title}>Left: one epithelial cell on its own. Right: many similar epithelial cells joined side by side, sharing their walls, to form a continuous lining: epithelial tissue.</title>
    <path d="M36 66Q56 54 76 66Q80 96 76 126Q56 132 36 126Q32 96 36 66Z" fill="#f6dfe9" stroke={pink} strokeWidth="2"/><ellipse cx="56" cy="106" rx="6.5" ry="8.5" fill={purple} stroke="#7a62a8" strokeWidth=".8"/>
    <text x="56" y="152" textAnchor="middle" {...t} fontWeight="700">one cell</text>
    <path d="M94 96H132" stroke={ink} strokeWidth="2"/><path d="M132 96l-8-5v10Z" fill={ink}/>
    <text x="113" y="84" textAnchor="middle" {...t} fontSize={11}>many</text><text x="113" y="116" textAnchor="middle" {...t} fontSize={11}>join</text>
    <path d="M146 130Q285 134 424 130V146H146Z" fill="#f4ebe4"/>
    <EpiCells cells={cells}/>
    <text x="285" y="30" textAnchor="middle" {...t} fontWeight="700" fill="#7d55a8">epithelial tissue</text>
    <path d="M152 44Q285 36 418 44" fill="none" stroke="#9c70c7" strokeWidth="2"/>
    <text x="285" y="166" textAnchor="middle" fill={ink} fontSize="13">many similar cells form a lining</text>
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
      <path d="M298 214C320 218 336 232 332 246C328 260 307 266 291 257C275 248 262 243 247 250C232 258 236 273 252 278C270 284 280 298 269 308C257 319 238 310 224 298C210 286 197 287 187 279C175 269 179 252 194 247C211 241 226 252 231 264" fill="none" stroke="#c8893d" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M298 214C320 218 336 232 332 246C328 260 307 266 291 257C275 248 262 243 247 250C232 258 236 273 252 278C270 284 280 298 269 308C257 319 238 310 224 298C210 286 197 287 187 279C175 269 179 252 194 247C211 241 226 252 231 264" fill="none" stroke="#efb44d" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M273 334v5" stroke="#b97852" strokeWidth="12" strokeLinecap="round"/>
    </g>
    {label('salivary glands', 18, 22, 231, 27, 'left', 'upper')}
    {label('mouth', 18, 48, 247, 34, 'left', 'upper')}
    {label('oesophagus', 18, 75, 258, 73, 'left', 'upper')}
    {label('liver', 18, 112, 186, 111, 'left', 'bile')}
    {label('gall bladder', 18, 158, 207, 153, 'left', 'bile')}
    {label('stomach', 502, 126, 337, 132, 'right', 'upper')}
    {label('pancreas', 502, 184, 349, 185, 'right', 'upper')}
    {label('duodenum', 502, 211, 334, 213, 'right', 'intestines')}
    {label('large intestine', 502, 246, 352, 247, 'right', 'intestines')}
    {label('small intestine', 502, 282, 269, 281, 'right', 'intestines')}
    {label('rectum', 502, 326, 276, 326, 'right', 'intestines')}
  </svg><p className="science-bio-note">Simplified front view · organ positions are approximate · not to scale</p></div>
}

/* ── Enzyme model: shared shapes (enzyme-local coordinates, 0–112 × 0–124) ──
   The active site is a pocket with a stepped back wall; substrate part A is its exact negative (2-unit clearance). */
const enzymeOutline = 'M14 22C28 4 62 0 84 10C100 17 108 30 104 44L88 44Q82 44 82 50Q82 54 76 54L70 56Q64 58 64 64Q64 72 72 74L88 80Q98 82 104 82C110 96 100 114 80 120C56 128 24 122 12 104C0 86 0 42 14 22Z'
const activeSite = 'M104 44L88 44Q82 44 82 50Q82 54 76 54L70 56Q64 58 64 64Q64 72 72 74L88 80Q98 82 104 82'
const substrateA = 'M112 46.5H88.5Q84.5 46.5 84.5 51.5Q84.5 56.5 77 56.5L71 58.3Q66.5 60 66.5 64Q66.5 70 72.6 71.6L88.6 77.6Q97 80 112 80Z'
const substrateB = 'M112 49Q121 41 133 45Q146 49 146 63Q146 77 133 80Q121 83 112 77Z'
/* A non-matching molecule of similar size: a pointed, taller tip that cannot sit in the stepped pocket. */
const otherA = 'M112 40H96Q90 40 86 45L64 63L86 81Q90 86 96 86H112Z'
const folds = 'M24 36C36 26 52 30 50 44S30 58 34 72S56 92 44 106M58 18C70 24 76 34 68 42M40 114C54 108 66 116 80 106M88 96C94 104 92 110 84 112'
function Enzyme({ x, y, k = .85, opacity = 1 }: { x: number; y: number; k?: number; opacity?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${k})`} opacity={opacity} strokeLinejoin="round" strokeLinecap="round">
    <path d={enzymeOutline} fill="#efd8e7" stroke={ink} strokeWidth="2.5"/>
    <path d={folds} fill="none" stroke="#d6a2bf" strokeWidth="2.2" opacity=".7"/>
    <path d={activeSite} fill="none" stroke={pink} strokeWidth="4.5"/>
  </g>
}
/** Substrate (A + B joined by a bond), or a single product part. `flip` mirrors it top-to-bottom: same size, wrong shape. */
function Molecule({ x, y, k = .85, part = 'both', flip = false, rotate = 0, colour = 'substrate', opacity = 1 }: { x: number; y: number; k?: number; part?: 'both' | 'A' | 'B'; flip?: boolean; rotate?: number; colour?: 'substrate' | 'other'; opacity?: number }) {
  const [a, b] = colour === 'other' ? [yellow, '#f4dc97'] : [blue, '#8fcbe2']
  const cx = part === 'A' ? 90 : part === 'B' ? 130 : 106
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${k}) translate(${-cx} -63)${flip ? ' translate(0 126) scale(1 -1)' : ''}`} opacity={opacity} strokeLinejoin="round">
    {part !== 'B' && <path d={colour === 'other' ? otherA : substrateA} fill={a} stroke={ink} strokeWidth="2"/>}
    {part !== 'A' && <path d={substrateB} fill={b} stroke={ink} strokeWidth="2"/>}
    {part === 'both' && <path d="M112 49V77" stroke={ink} strokeWidth="2.4"/>}
  </g>
}

function EnzymeModel({ focus, assessment }: { focus: string; assessment: boolean }) {
  const title = useId(), u = title.replace(/[^a-zA-Z0-9_-]/g, '')
  const specific = focus === 'enzyme-specific' || focus === 'enzyme-match'
  const stageOpacity = (stage: 'before' | 'bound' | 'after') => focus === 'enzyme-products' ? stage === 'after' ? 1 : .32 : focus === 'enzyme-fit' ? stage === 'after' ? .32 : 1 : 1
  const marker = (id: string, colour: string) => <marker id={`${u}-${id}`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10L2 5Z" fill={colour}/></marker>
  const arrow = (d: string, opacity = 1, colour = ink, id = 'ink') => <path d={d} fill="none" stroke={colour} strokeWidth="2.4" markerEnd={`url(#${u}-${id})`} opacity={opacity}/>
  /* enzyme-local point → absolute, for an enzyme drawn at (ex, ey) with scale k */
  const at = (ex: number, ey: number, k: number, lx: number, ly: number) => [ex + lx * k, ey + ly * k]

  if (specific) {
    const [ex, ey, k] = [52, 62, 1.1], mouth = at(ex, ey, k, 106, 63)
    return <div className="science-bio-model"><svg viewBox="0 0 600 255" role="img" aria-labelledby={title}><title id={title}>{assessment ? 'An enzyme with a shaped active site is shown beside two possible molecules of similar size but different shape.' : 'A simplified specificity model. The blue substrate has a shape complementary to the active site and can bind. The yellow molecule is a similar size but has a pointed, taller end that does not match the stepped active site, so it cannot bind.'}</title>
      <defs>{marker('ink', ink)}</defs>
      <Enzyme x={ex} y={ey} k={k}/>
      <path d={`M${mouth[0] + 6} ${mouth[1] - 6}C230 100 262 90 296 90`} fill="none" stroke={green} strokeWidth="3" strokeDasharray="6 5"/>
      <Molecule x={344} y={90} k={1.05}/>
      <path d={`M${mouth[0] + 6} ${mouth[1] + 6}C232 164 262 178 296 178`} fill="none" stroke="#b2bdc6" strokeWidth="3" strokeDasharray="6 5"/>
      <Molecule x={344} y={178} k={1.05} colour="other"/>
      {!assessment && <>
        <text x={ex + 56 * k} y="226" textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">enzyme</text>
        <text x="138" y="44" fill={pink} fontSize="12.5" fontWeight="700">active site</text>
        <path d={`M160 50L${at(ex, ey, k, 76, 62).join(' ')}`} stroke={pink} strokeWidth="1.5"/>
        <circle cx="415" cy="80" r="10" fill={green}/><path d="M410 80l4 4l7-9" fill="none" stroke="white" strokeWidth="2.5"/>
        <text x="432" y="84" fill={ink} fontSize="13.5" fontWeight="700">complementary shape</text>
        <text x="432" y="104" fill={green} fontSize="12.5">can bind</text>
        <circle cx="415" cy="168" r="10" fill="#9aa8b1"/><path d="M411 164l8 8m0-8l-8 8" stroke="white" strokeWidth="2.5"/>
        <text x="432" y="172" fill={ink} fontSize="13.5" fontWeight="700">different shape</text>
        <text x="432" y="192" fill="#687a87" fontSize="12.5">does not bind well</text>
      </>}
    </svg>{!assessment && <p className="science-bio-note">Simplified specificity model · real enzyme molecules are flexible, not rigid locks.</p>}</div>
  }

  const k = .85, E1 = [14, 66], E2 = [214, 66], E3 = [414, 66]
  return <div className="science-bio-model"><svg viewBox="0 0 600 262" role="img" aria-labelledby={title}><title id={title}>A three-stage enzyme model. 1: a substrate molecule with a shape complementary to the enzyme’s active site approaches. 2: the substrate is bound in the active site, forming a temporary enzyme–substrate complex. 3: the substrate has been broken into two products, which leave; the enzyme is unchanged, and a return arrow shows it can catalyse the reaction again.</title>
    <defs>{marker('ink', ink)}{marker('green', green)}</defs>
    {!assessment && <g fill={ink} fontSize="13" fontWeight="700" textAnchor="middle"><text x="100" y="22">1 · before</text><text x="300" y="22">2 · substrate bound</text><text x="500" y="22">3 · after</text></g>}

    <g opacity={stageOpacity('before')}>
      <Enzyme x={E1[0]} y={E1[1]}/>
      <Molecule x={E1[0] + (106 + 34) * k} y={E1[1] + 63 * k}/>
      {arrow('M176 96H138')}
    </g>
    <g opacity={stageOpacity('bound')}>
      <Enzyme x={E2[0]} y={E2[1]}/>
      <Molecule x={E2[0] + 106 * k} y={E2[1] + 63 * k}/>
    </g>
    <g opacity={stageOpacity('after')}>
      <Enzyme x={E3[0]} y={E3[1]}/>
      <Molecule x={538} y={98} part="A" rotate={-18}/>
      <Molecule x={570} y={150} part="B" rotate={24}/>
      {arrow('M562 88L580 76')}{arrow('M576 170L586 184')}
    </g>
    {arrow('M178 128H204', stageOpacity('bound'))}{arrow('M372 128H400', stageOpacity('after'))}
    <path d="M462 180Q462 214 436 214H86Q62 214 62 186" fill="none" stroke={green} strokeWidth="2.4" strokeDasharray="7 5" markerEnd={`url(#${u}-green)`} opacity={stageOpacity('after')}/>

    {!assessment && <>
      <text x="14" y="52" fill={ink} fontSize="12.5" fontWeight="700">enzyme</text>
      <text x="92" y="52" fill={pink} fontSize="12.5" fontWeight="700">active site</text>
      <path d={`M112 57L${at(E1[0], E1[1], k, 74, 60).join(' ')}`} stroke={pink} strokeWidth="1.5"/>
      <text x="142" y="164" textAnchor="middle" fill={ink} fontSize="12.5">substrate</text>
      <text x="300" y="194" textAnchor="middle" fill={ink} fontSize="12.5">temporary enzyme–substrate complex</text>
      <text x="540" y="198" textAnchor="middle" fill={ink} fontSize="12.5">products leave</text>
      <text x="262" y="236" textAnchor="middle" fill={green} fontSize="12.5" fontWeight="700">enzyme unchanged: available again</text>
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

function RateEquation({ breathing }: { breathing: boolean }) {
  return <div className="science-micro-equation"><strong>{breathing ? 'breathing rate' : 'blood-flow rate'}</strong><span className="science-micro-equation__equals">=</span><div className="science-micro-equation__operation"><span>{breathing ? 'number of breaths' : 'volume of blood'}</span><b>÷</b><span>time</span></div><p>{breathing ? 'Example: 84 breaths ÷ 6 min = 14 breaths per minute' : 'Example: 1,260 cm³ ÷ 7 min = 180 cm³ per minute'}</p></div>
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
  if (focus === 'breathing-rate') return <RateEquation breathing/>
  if (focus === 'blood-flow-rate') return <RateEquation breathing={false}/>
  return <Hierarchy focus="organisation-compare" assessment={assessment}/>
}

import { useId } from 'react'

function Drop({ x, y, stain = false }: { x: number; y: number; stain?: boolean }) {
  return <path d={`M${x} ${y - 20}q-20 24 0 28q20 -4 0 -28Z`} fill={stain ? '#dfb469' : '#99d6ec'} stroke={stain ? '#aa7c36' : '#478ea9'} strokeWidth="2" />
}
function OnionCells({ shaded = false, clean = false }: { shaded?: boolean; clean?: boolean }) {
  return <g stroke={clean ? '#354e63' : '#8b804e'} strokeWidth="2" fill={clean ? 'white' : '#fbefc6'}>
    {[[70, 70, 170], [242, 70, 115], [70, 124, 113], [185, 124, 172], [70, 178, 170], [242, 178, 115]].map(([x, y, w], i) => <g key={i}>
      <rect x={x} y={y} width={w} height="52" rx="9" fill={shaded ? '#a7aab6' : undefined} />
      <ellipse cx={x + w * .68} cy={y + 26} rx="8" ry="6" fill={clean ? 'white' : '#ad91c7'} stroke={clean ? '#354e63' : '#786098'} />
      {shaded && <path d={`M${x + 12} ${y + 8}l25 33m-12 -33 25 33m-10 -33 25 33m-10 -33 25 33`} stroke="#5d6577" strokeWidth="4" />}
    </g>)}
  </g>
}
function Slide({ focus }: { focus: string }) {
  const sample = !['slide-water', 'slide-peel'].includes(focus)
  const stained = ['slide-stain', 'slide-cover', 'slide-ready'].includes(focus)
  const cover = ['slide-cover', 'slide-ready'].includes(focus)
  return <figure className="science-practical-figure"><svg viewBox="0 0 440 270" role="img" aria-label={`Onion wet-mount schematic: ${sample ? 'a thin tissue layer lies flat in a drop of water' : 'water on a clean glass slide'}${stained ? ', with iodine stain' : ''}${cover ? ', and a coverslip being lowered gently' : ''}.`}>
    <path d="M52 173L145 116L388 169L298 229Z" fill="#e1f3fb" stroke="#6395b3" strokeWidth="2" />
    <ellipse cx="221" cy="168" rx="59" ry="18" fill={stained ? '#edcf83' : '#b7e2ee'} opacity=".85" />
    {sample && <g transform="translate(169 148) rotate(10)"><rect width="89" height="24" rx="3" fill={stained ? '#e9cd83' : '#daf0d6'} stroke="#789767" />{[18, 36, 54, 72].map(x => <path key={x} d={`M${x} 0v24`} stroke="#789767" />)}{stained && [12, 32, 50, 70].map(x => <circle key={x} cx={x} cy="12" r="2" fill="#8d659e" />)}</g>}
    {cover && <path d={focus === 'slide-cover' ? 'M167 151L214 71L289 91L262 172Z' : 'M162 158L194 137L283 158L251 181Z'} fill="#dceefb" fillOpacity=".4" stroke="#4b8bb0" strokeWidth="2.5" />}
    {focus === 'slide-cover' && <><path d="M250 49q64 30 26 72m2 -13 -2 13 13 -4" fill="none" stroke="#9068b3" strokeWidth="3" /><text x="277" y="39">Lower gently</text><text x="89" y="249">One edge touches first</text></>}
    {focus === 'slide-water' && <><Drop x={218} y={81} /><path d="M218 115v24" stroke="#478ea9" strokeWidth="2" strokeDasharray="4 4" /><text x="145" y="57">Drop of water</text></>}
    {focus === 'slide-stain' && <><Drop x={222} y={82} stain /><path d="M222 115v24" stroke="#aa7c36" strokeWidth="2" strokeDasharray="4 4" /><text x="145" y="56">Iodine stain</text></>}
    {focus === 'slide-peel' && <><path d="M89 64q32 -30 64 0q-4 43 -41 43q-25 -12 -23 -43Z" fill="#e9d8e9" stroke="#ae839e" strokeWidth="2" /><path d="M122 80q32 -32 69 -6l24 19 -7 15 -33 -18q-26 -12 -53 5Z" fill="#e6f2d8" stroke="#8da877" /><path d="M228 42l-42 37m35 -39 -38 42" stroke="#47667d" strokeWidth="4" /><text x="255" y="76">Thin skin</text></>}
    {focus === 'slide-flat' && <text x="111" y="76">Thin layer · no folds</text>}
    {focus === 'slide-ready' && <><path d="M293 180l46 14 -25 28 -40 -14Z" fill="#fff" stroke="#93acba" /><text x="233" y="252">Filter paper at the edge</text></>}
  </svg></figure>
}
function Equipment({ focus }: { focus: string }) {
  return <div className="science-practical-equipment">
    <svg viewBox="0 0 440 175" role="img" aria-label={focus === 'safety' ? 'Eye protection, careful glass handling and reporting breakage.' : focus === 'carry' ? 'Support a microscope at its arm and its base.' : 'Onion tissue, clean slide and coverslip, water, stain and tweezers.'}>
      {focus === 'safety' ? <><path d="M95 59h96v58h-96Zm154 0h96v58h-96Z" fill="#d3eef7" stroke="#4786a4" strokeWidth="4" /><path d="M191 80q29 -22 58 0M95 78l-30 -9m280 9 30 -9" fill="none" stroke="#4786a4" strokeWidth="4" /><text x="111" y="150">Eye protection for iodine</text></>
        : focus === 'carry' ? <><path d="M239 28q70 35 15 98" fill="none" stroke="#5486ae" strokeWidth="20" /><rect x="165" y="126" width="135" height="15" rx="7" fill="#36516b" /><path d="M214 33l-25 42h23l27 -42Z" fill="#cbb6e4" stroke="#8765ad" /><path d="M295 54l-26 9m-10 84v-12" stroke="#aa7c48" strokeWidth="9" strokeLinecap="round" /><text x="295" y="44">Arm</text><text x="274" y="161">Base</text></>
        : <><path d="M60 74q25 -31 55 0q-8 43 -48 35Z" fill="#e9d8e9" stroke="#ae839e" /><rect x="148" y="67" width="108" height="43" rx="4" fill="#e2f3fb" stroke="#6395b3" /><rect x="183" y="74" width="27" height="27" fill="#d6eedc" stroke="#79a283" /><Drop x={294} y={62} /><Drop x={350} y={62} stain /><path d="M389 43l-17 64m11 -64 -13 58" stroke="#47667d" strokeWidth="3" /><text x="60" y="144">Tissue</text><text x="157" y="144">Slide + cover</text><text x="278" y="144">Water</text><text x="337" y="144">Stain</text></>}
    </svg>
  </div>
}
function Scope({ focus }: { focus: string }) {
  const high = focus === 'scope-high'
  return <figure className="science-practical-figure"><svg viewBox="0 0 440 260" role="img" aria-label={`Focusing schematic, not an operating simulation. ${high ? 'Higher-power objective; use fine focus.' : 'Low-power objective above a slide, with a visible gap.'}`}>
    <path d="M277 55q64 59 11 151" fill="none" stroke="#6696b9" strokeWidth="25" /><path d="M140 220h167" stroke="#36516b" strokeWidth="18" strokeLinecap="round" />
    <path d="M233 22l-36 56h27l34 -56Z" fill="#cbb6e4" stroke="#8765ad" strokeWidth="2" /><ellipse cx="215" cy="80" rx="25" ry="10" fill="#5486ae" />
    <rect x="201" y="88" width="25" height={high ? 66 : 40} rx="3" fill="#d5dfed" stroke="#36516b" strokeWidth="2" /><text x="174" y="111" textAnchor="end">{high ? '×40' : '×4'}</text>
    <rect x="131" y="174" width="166" height="12" rx="3" fill="#36516b" /><rect x="168" y="166" width="87" height="7" fill="#d3eddc" stroke="#629e81" /><path d="M170 166v-8h15" stroke="#36516b" strokeWidth="3" fill="none" />
    <ellipse cx="211" cy="207" rx="24" ry="9" fill="#ffeca0" stroke="#b6a14c" /><path d="M211 198v-12" stroke="#b6a14c" strokeWidth="3" />
    <circle cx="298" cy="129" r="19" fill="#36516b" stroke={focus === 'scope-coarse' || focus === 'scope-side' ? '#a581c9' : '#36516b'} strokeWidth="5" /><circle cx="323" cy="145" r="9" fill={focus === 'scope-fine' || high ? '#b795d5' : '#36516b'} stroke="#36516b" strokeWidth="2" />
    {focus === 'scope-side' && <><path d="M91 141q20 -17 40 0q-20 17 -40 0Z" fill="#fff" stroke="#36516b" /><circle cx="111" cy="141" r="5" fill="#36516b" /><path d="M139 141h56" stroke="#8662ad" strokeDasharray="5 4" strokeWidth="2" /><text x="39" y="116">Watch the gap</text></>}
    {focus === 'scope-coarse' && <><path d="M246 134v25m-6 -7 6 7 6 -7" fill="none" stroke="#8662ad" strokeWidth="3" /><text x="49" y="249">Increase lens–slide separation</text></>}
    {(focus === 'scope-fine' || high) && <><path d="M373 111l-41 32" stroke="#8662ad" strokeWidth="2" /><text x="327" y="100">Fine focus</text></>}
    {focus === 'scope-stage' && <text x="54" y="67">Secure slide · light below</text>}
    {focus === 'scope-low' && <text x="52" y="249">Lowest objective first</text>}
  </svg></figure>
}
function Observation({ animal = false, problem }: { animal?: boolean; problem?: string }) {
  const id = useId().replace(/:/g, '')
  return <figure className="science-practical-figure"><div className="science-cell__identity">{problem ? 'Troubleshooting example' : animal ? 'Prepared animal-cell example' : 'Onion-cell example'}</div>
    <svg viewBox="0 0 440 285" role="img" aria-label={problem === 'blank' ? 'An empty illuminated circular view.' : problem === 'blur' ? 'An illustrated view with blurred cell edges.' : problem === 'bubbles' ? 'Illustrated onion cells with circular air bubbles obscuring the tissue.' : animal ? 'Separate illustrated animal cells with irregular outlines and stained nuclei, without cell walls.' : 'Illustrated onion epidermal tissue with box-like walls and some stained nuclei; no chloroplasts shown.'}>
      <defs><clipPath id={`view-${id}`}><circle cx="220" cy="144" r="124" /></clipPath><filter id={`blur-${id}`}><feGaussianBlur stdDeviation="3" /></filter></defs>
      <circle cx="220" cy="144" r="124" fill="#fffdf1" stroke="#6c8ba4" strokeWidth="3" />
      {problem !== 'blank' && <g clipPath={`url(#view-${id})`} filter={problem === 'blur' ? `url(#blur-${id})` : undefined}>
        {animal ? [[157, 115], [265, 97], [243, 204], [131, 215]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${i * 19})`}><path d="M-42 -18q7 -38 46 -24q49 21 28 54q-26 34 -60 13q-21 -8 -14 -43Z" fill="#eee5f7" stroke="#826d9e" strokeWidth="2" /><ellipse cx="1" cy="-2" rx="12" ry="10" fill="#ad91c7" stroke="#786098" /></g>) : <OnionCells />}
        {problem === 'bubbles' && <g fill="#fffdf1" fillOpacity=".9" stroke="#566374" strokeWidth="3"><circle cx="214" cy="117" r="32" /><circle cx="261" cy="182" r="19" /></g>}
      </g>}
    </svg><figcaption className="science-micro-caption">Illustrated view, not a micrograph</figcaption>
  </figure>
}
function Drawing({ focus, variant = 'a' }: { focus: string; variant?: 'a' | 'b' }) {
  const bad = variant === 'b'
  const labelled = bad || ['drawing-labels', 'drawing-record', 'measure-scale', 'assessment'].includes(focus)
  const record = ['drawing-record', 'measure-scale', 'assessment'].includes(focus)
  return <svg viewBox="0 0 440 340" role="img" aria-label={bad ? 'Drawing B: heavily shaded cells, repeated sketchy strokes and two crossing label lines; no specimen title or size information.' : `Drawing A: single unshaded cell outlines${labelled ? ', straight uncrossed wall and nucleus label lines' : ''}${record ? ', a specimen title, observation magnification and calibrated scale bar' : ''}.`}>
    {record && !bad && <text x="75" y="40" className="science-practical-svg-title">Onion epidermal cells</text>}
    <g transform="translate(-18 0)"><OnionCells clean shaded={bad} />{bad && <path d="M70 74l167 -5 9 48 -177 9m117 4 171 -3 4 47 -175 7" fill="none" stroke="#354e63" strokeWidth="3" />}</g>
    {labelled && (bad ? <><path d="M182 98L373 253M338 147L370 69" stroke="#354e63" strokeWidth="2" /><text x="322" y="65">Wall</text><text x="322" y="274">Nucleus</text></> : <><path d="M167.6 96L110 53H52M339 150L370 140" fill="none" stroke="#354e63" strokeWidth="1.5" /><text x="20" y="48">Nucleus</text><text x="342" y="130">Cell wall</text></>)}
    {record && !bad && <><path d="M80 263h56.666667M80 258v10M136.666667 258v10" stroke="#354e63" strokeWidth="2" /><text x="80" y="287">100 µm</text><text x="75" y="318">Observed at ×100</text></>}
  </svg>
}
export function PracticalVisual({ focus }: { focus: string }) {
  if (focus.startsWith('slide-')) return <Slide focus={focus} />
  if (['equipment', 'safety', 'carry'].includes(focus)) return <Equipment focus={focus} />
  if (focus.startsWith('scope-')) return <Scope focus={focus} />
  if (['blank', 'blur', 'bubbles'].includes(focus)) return <Observation problem={focus} />
  if (focus.startsWith('onion')) return <Observation />
  if (focus.startsWith('animal')) return <Observation animal />
  if (focus === 'drawing-choice') return <div className="science-practical-drawing-pair">{(['a', 'b'] as const).map(variant => <figure className="science-practical-figure" key={variant}><div className="science-cell__identity">Drawing {variant.toUpperCase()}</div><Drawing focus="assessment" variant={variant} /></figure>)}</div>
  if (focus.startsWith('drawing-') || focus === 'measure-scale') return <figure className="science-practical-figure"><Drawing focus={focus} />{focus === 'measure-scale' && <figcaption className="science-micro-caption">Example long cell: 300 µm · scale bar: 100 µm</figcaption>}</figure>
  if (focus === 'measure-field') return <div className="science-practical-measure"><span>Calibrated field: 1.2 mm</span><div className="science-practical-field" aria-label="Four similar cells span the field diameter">{[1, 2, 3, 4].map(n => <span key={n}>{n}</span>)}</div><strong>1.2 mm ÷ 4 = 0.3 mm = 300 µm</strong><p>Estimate assumes similar lengths across the full diameter.</p></div>
  if (focus === 'measure-drawing') return <div className="science-practical-measure"><span>Two different magnifications</span><p><strong>Microscope</strong><br />Eyepiece × objective</p><p><strong>Drawing</strong><br />Drawing length ÷ real length</p></div>
  if (focus === 'B3-20') return <div className="science-practical-measure"><span>Supplied measurements</span><div className="science-practical-quantities"><p>Drawing length<strong>24 mm</strong></p><p>Real length<strong>0.3 mm</strong></p></div><p>Drawing magnification = ?</p></div>
  return null
}

import { useId } from 'react'
import { CellDiagramAnnotations, DiagramKey, type DiagramAnnotation } from './CellDiagramAnnotations'

const lightParts: DiagramAnnotation[] = [
  { id: 'light-source', label: 'Light source', number: 1, x: 105, y: 264, targetX: 215, targetY: 244 },
  { id: 'light-lenses', label: 'Eyepiece and objective', number: 2, x: 151, y: 67, targetX: 259, targetY: 37 },
  { id: 'light-stage', label: 'Stage and slide', number: 3, x: 95, y: 166, targetX: 205, targetY: 188 },
  { id: 'light-focus', label: 'Focusing controls', number: 4, x: 388, y: 136, targetX: 322, targetY: 151 },
]

function LightMicroscope({ focus = 'light', visibleFocuses = [], onSelect }: { focus?: string; visibleFocuses?: string[]; onSelect?: (focus: string) => void }) {
  const opacity = (part: string) => focus === 'light' || focus === part ? 1 : .42
  return <figure className="science-micro-instrument">
    <div className="science-cell__identity">Light microscope</div>
    <svg viewBox="0 0 440 330" role="img" aria-label="Simplified light microscope. A light source illuminates a slide on the stage below an objective lens; the eyepiece is above. Focusing controls are on the supporting arm.">
      <path d="M299 75C355 101 367 207 307 265" fill="none" stroke="#adc9de" strokeWidth="38" strokeLinecap="round" />
      <path d="M299 75C355 101 367 207 307 265" fill="none" stroke="#4d83ab" strokeWidth="25" strokeLinecap="round" />
      <path d="M133 274Q219 253 315 269L339 294Q232 313 113 295Z" fill="#24668e" stroke="#225576" strokeWidth="2" />
      <g opacity={opacity('light-source')}><ellipse cx="215" cy="247" rx="25" ry="13" fill="#fff1a1" stroke="#c1a850" strokeWidth="2" /><path d="M215 238V198" stroke="#d7bd56" strokeWidth="4" strokeDasharray="5 4" /></g>
      <g opacity={opacity('light-stage')}><rect x="139" y="187" width="160" height="12" rx="4" fill="#36506c" /><rect x="177" y="180" width="67" height="6" rx="2" fill="#d6f2e6" stroke="#4b9b80" /><path d="M176 180v-7h12M243 180v-7h-12" fill="none" stroke="#36506c" strokeWidth="3" /></g>
      <g opacity={opacity('light-lenses')}><path d="M251 41L269 51L230 121L207 108Z" fill="#d7c4ee" stroke="#7e5fa6" strokeWidth="2.5" /><rect x="242" y="24" width="34" height="26" rx="5" transform="rotate(28 259 37)" fill="#36506c" /><ellipse cx="219" cy="119" rx="24" ry="11" fill="#628bae" stroke="#36506c" strokeWidth="2" /><path d="M210 126v36h16v-36" fill="#d5dfec" stroke="#36506c" strokeWidth="2" /><path d="M226 124l18 27 10 -7 -16 -25" fill="#b5c7df" stroke="#36506c" strokeWidth="2" /></g>
      <g opacity={opacity('light-focus')}><circle cx="322" cy="151" r="22" fill="#36506c" stroke="#234766" strokeWidth="2" /><circle cx="322" cy="151" r="12" fill="#cdbce7" /><circle cx="337" cy="171" r="9" fill="#36506c" /></g>
      <CellDiagramAnnotations parts={lightParts} visibleIds={visibleFocuses} focus={focus} />
    </svg>
    <DiagramKey parts={lightParts} visibleIds={visibleFocuses} focus={focus} onSelect={onSelect} />
  </figure>
}

function ElectronMicroscope() {
  return <figure className="science-micro-instrument">
    <div className="science-cell__identity">Electron microscope</div>
    <svg viewBox="0 0 440 330" role="img" aria-label="Simplified electron microscope schematic. A vertical column directs an electron beam through the instrument towards a specimen. The resulting image is displayed on a screen. Not an operating diagram or photograph.">
      <path d="M164 281H299L316 302H148Z" fill="#47618a" />
      <rect x="188" y="50" width="89" height="229" rx="19" fill="#d6c8ec" stroke="#8562ae" strokeWidth="3" />
      <ellipse cx="232" cy="52" rx="43" ry="15" fill="#8562ae" /><rect x="209" y="21" width="46" height="31" rx="9" fill="#36506c" />
      <path d="M232 64V258" stroke="#399a89" strokeWidth="3" strokeDasharray="6 5" />
      <path d="M192 113H273M192 157H273" stroke="#8562ae" strokeWidth="10" />
      <rect x="208" y="189" width="48" height="9" rx="3" fill="#f4bc86" stroke="#b47b46" /><path d="M255 192H304" stroke="#36506c" strokeWidth="3" />
      <rect x="303" y="213" width="88" height="62" rx="8" fill="#36506c" /><rect x="311" y="221" width="72" height="44" rx="3" fill="#e6f3ed" /><path d="M347 275v15h-23M347 290h23" stroke="#36506c" strokeWidth="4" />
      <circle cx="330" cy="243" r="5" fill="#9072b5" /><circle cx="350" cy="237" r="4" fill="#9072b5" /><path d="M263 246H303" stroke="#36506c" strokeWidth="2" />
    </svg>
    <p className="science-micro-caption">Electron beam → specimen → image</p>
  </figure>
}

function CellDrawing() {
  return <g><path d="M-34 -17C-13 -38 30 -24 35 1S7 31 -20 19S-46 3 -34 -17Z" fill="#b8e7d4" stroke="#279575" strokeWidth="2" /><ellipse cx="0" cy="0" rx="12" ry="10" fill="#b695d5" stroke="#8660aa" /><path d="M-22 -8l5 -2M19 10l6 -3" stroke="#b47b46" strokeWidth="4" strokeLinecap="round" /></g>
}

function MagnificationView({ enlarged }: { enlarged: boolean }) {
  return <figure className="science-micro-concept"><svg viewBox="0 0 440 220" role="img" aria-label="Two illustrative drawings of the same cell. A smaller representation is beside an enlarged image with the same structures; the real cell has not changed size.">
    <g transform="translate(95 106)"><CellDrawing /></g><path d="M159 106H211m-10 -9 10 9 -10 9" fill="none" stroke="#4783a7" strokeWidth="3" />
    <g transform={`translate(324 106) scale(${enlarged ? 2.3 : 1.8})`}><CellDrawing /></g>
  </svg><div className="science-micro-pair-labels"><span>Same cell</span><span>Larger image</span></div></figure>
}

function ResolutionView({ focus }: { focus: string }) {
  const filterId = `micro-blur-${useId().replace(/:/g, '')}`
  const separated = focus === 'resolution-high'
  return <figure className="science-micro-concept"><svg viewBox="0 0 440 200" role="img" aria-label={separated ? 'Illustration: two close points are distinguished as separate with greater resolving power.' : focus === 'resolution-zoom' ? 'Illustration: a merged blurred patch has been enlarged, but the two close points still cannot be distinguished.' : 'Illustration: two close points merge into one blurred patch with insufficient resolving power.'}>
    <defs><filter id={filterId} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="13" /></filter></defs>
    <g transform={focus === 'resolution-zoom' ? 'translate(-88 -40) scale(1.4)' : undefined}>
      <circle cx="200" cy="100" r={separated ? 12 : 22} fill="#9072b5" filter={separated ? undefined : `url(#${filterId})`} />
      <circle cx="240" cy="100" r={separated ? 12 : 22} fill="#9072b5" filter={separated ? undefined : `url(#${filterId})`} />
    </g>
  </svg><p className="science-micro-caption">{separated ? 'Two separate features' : focus === 'resolution-zoom' ? 'A bigger blur—not extra detail' : 'Features merge into one patch'}</p></figure>
}

const examples: Record<string, [string, string, string]> = {
  'B2-13': ['12 mm', '0.03 mm', '?'], 'B2-16': ['18 mm', '30 µm', '?'],
  'B2-19': ['15 mm', '?', '×500'], 'B2-21': ['?', '0.04 mm', '×250'],
}

export function MicroscopyVisual({ focus = 'light', visibleFocuses = [], onSelect }: { focus?: string; visibleFocuses?: string[]; onSelect?: (focus: string) => void }) {
  if (focus.startsWith('light')) return <LightMicroscope focus={focus} visibleFocuses={visibleFocuses} onSelect={onSelect} />
  if (focus.startsWith('electron')) return <ElectronMicroscope />
  if (focus.startsWith('microscope-comparison')) return <div className="science-micro-comparison"><LightMicroscope /><ElectronMicroscope /><div className="science-micro-comparison__note"><strong>Electron microscope</strong><p>Higher magnification · greater resolving power</p></div></div>
  if (focus.startsWith('magnification')) return <MagnificationView enlarged={focus.endsWith('large')} />
  if (focus.startsWith('resolution')) return <ResolutionView focus={focus} />
  if (examples[focus]) { const [image, real, mag] = examples[focus]; return <div className="science-micro-size-cards"><div><span>Image size</span><strong>{image}</strong></div><div><span>Real size</span><strong>{real}</strong></div><div><span>Magnification</span><strong>{mag}</strong></div></div> }
  if (focus.startsWith('units')) return <div className="science-micro-equation"><strong>1 mm = 1000 µm</strong><p>mm → µm: ×1000</p><p>µm → mm: ÷1000</p>{focus === 'units-convert' && <p>30 µm = 0.03 mm</p>}</div>
  if (focus.startsWith('standard')) return <div className="science-micro-equation"><strong>a × 10ⁿ</strong><p>1 ≤ a &lt; 10</p>{focus === 'standard-negative' && <><strong>0.003 mm = 3 × 10⁻³ mm</strong><p>3 × 0.001 mm</p></>}</div>
  const formula = focus.startsWith('real-size') ? ['Real size', 'Image size', '÷', 'Magnification'] : focus.startsWith('image-size') ? ['Image size', 'Real size', '×', 'Magnification'] : ['Magnification', 'Image size', '÷', 'Real size']
  return <div className="science-micro-equation">{focus === 'sizes' ? <div className="science-micro-size-cards"><div><span>Image size</span><strong>The picture</strong></div><div><span>Real size</span><strong>The specimen</strong></div></div> : <><strong>{formula[0]}</strong><span className="science-micro-equation__equals">=</span><p className="science-micro-equation__operation"><span>{formula[1]}</span><b>{formula[2]}</b><span>{formula[3]}</span></p></>}</div>
}

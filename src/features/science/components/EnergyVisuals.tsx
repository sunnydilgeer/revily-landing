import { useId, type ReactNode } from 'react'
import { Arrow, Badge, Diagram, Label, Person, blob } from './InfectionVisuals'
import { Epidermis, Palisade, Spongy, Vein, leafPath, plantPalette as P } from './PlantOrganisationVisuals'

// Chapter B4 (Lesson 26 onwards): original, code-native schematics of photosynthesis and its products. Not to scale.
// Colour code as the rest of the course: yellow = light, purple = carbon dioxide, blue = water, amber = glucose, starch
// and oil (food), teal = oxygen, green = plant tissue. Molecules are drawn as simple glyphs, not accurate structures.
type Pt = [number, number]
const ink = P.ink, teal = '#2f9c95', tealFill = '#d5efec', co2 = P.purple, co2Fill = '#e9e0f6', h2o = P.blue, h2oFill = '#dcf0f8'
const sugar = P.amber, sugarFill = P.amberFill, sunFill = '#f6d25e', sunLine = '#c9951c', lightInk = '#a77c12', night = '#2f3a57'
const faded = .3

// ---------- Molecule glyphs ----------
function CO2({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g>{[-9, 9].map(d => <circle key={d} cx={x + d * s} cy={y} r={5.5 * s} fill={co2Fill} stroke={co2} strokeWidth={1.6} />)}<circle cx={x} cy={y} r={5 * s} fill={co2} /></g>
}
function H2O({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g><circle cx={x} cy={y} r={6.5 * s} fill={h2oFill} stroke={h2o} strokeWidth={1.6} />{[-1, 1].map(d => <circle key={d} cx={x + d * 7.5 * s} cy={y + 5.5 * s} r={3.6 * s} fill="white" stroke={h2o} strokeWidth={1.4} />)}</g>
}
function O2({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g>{[-4.5, 4.5].map(d => <circle key={d} cx={x + d * s} cy={y} r={5.5 * s} fill={tealFill} stroke={teal} strokeWidth={1.6} />)}</g>
}
function hexPath(x: number, y: number, r: number) { return Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${i ? 'L' : 'M'}${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}` }).join('') + 'Z' }
function Glucose({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d={hexPath(x, y, 8 * s)} fill={sugarFill} stroke={sugar} strokeWidth={2} strokeLinejoin="round" />
}
function Nitrate({ x, y }: { x: number; y: number }) {
  return <g>{[0, 120, 240].map(a => { const r = a * Math.PI / 180; return <circle key={a} cx={x + Math.cos(r - Math.PI / 2) * 7} cy={y + Math.sin(r - Math.PI / 2) * 7} r="3.4" fill="#f1e7d6" stroke="#8a6d45" strokeWidth="1.3" /> })}<circle cx={x} cy={y} r="4.2" fill="#8a6d45" /></g>
}
function Spark({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y - 12}l-6 11h6l-4 12l11 -15h-6l4 -8z`} fill={sunFill} stroke={sunLine} strokeWidth="1.2" strokeLinejoin="round" />
}
function Zoom({ cx, cy, r, children, fill = '#f6fbf4' }: { cx: number; cy: number; r: number; children: ReactNode; fill?: string }) {
  const id = useId().replace(/:/g, '')
  return <g><clipPath id={id}><circle cx={cx} cy={cy} r={r - 1} /></clipPath><circle cx={cx} cy={cy} r={r} fill={fill} stroke={ink} strokeWidth="2" /><g clipPath={`url(#${id})`}>{children}</g></g>
}

// ---------- The sunflower ----------
type Part = 'roots' | 'stem' | 'leaves' | 'head'
const HEAD: Pt = [200, 62], SOIL = 232
const SF_LEAVES = [
  { node: [199, 200] as Pt, angle: 198, length: 66, width: 20 }, { node: [202, 170] as Pt, angle: -18, length: 72, width: 22 },
  { node: [201, 138] as Pt, angle: 200, length: 58, width: 18 }, { node: [202, 112] as Pt, angle: -24, length: 52, width: 16 },
]
const MAIN_LEAF = leafPath(SF_LEAVES[1]).mid
const ROOTS = ['M200 232C198 256 202 276 198 296', 'M200 240C186 250 168 256 152 272', 'M200 244C216 254 236 258 250 274', 'M199 258C188 266 180 278 176 292', 'M201 262C212 270 222 280 226 294']
function Sun() {
  return <g><circle cx={46} cy={42} r={18} fill={sunFill} stroke={sunLine} strokeWidth="1.6" />{Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <path key={i} d={`M${46 + Math.cos(a) * 24} ${42 + Math.sin(a) * 24}L${46 + Math.cos(a) * 32} ${42 + Math.sin(a) * 32}`} stroke={sunLine} strokeWidth="2.2" strokeLinecap="round" /> })}</g>
}
function Head({ cx = HEAD[0], cy = HEAD[1], k = 1 }: { cx?: number; cy?: number; k?: number }) {
  return <g>{Array.from({ length: 16 }, (_, i) => { const a = i * 22.5, r = a * Math.PI / 180, px = cx + Math.cos(r) * 29 * k, py = cy + Math.sin(r) * 29 * k
      return <ellipse key={i} cx={px} cy={py} rx={7 * k} ry={14 * k} fill="#f2c230" stroke="#c9951c" strokeWidth="1.2" transform={`rotate(${a + 90} ${px} ${py})`} /> })}
    <circle cx={cx} cy={cy} r={21 * k} fill="#7a5a36" stroke="#5a4026" strokeWidth="1.4" />
    {[6, 12, 17].flatMap((rr, ring) => Array.from({ length: 6 + ring * 5 }, (_, i) => { const a = i / (6 + ring * 5) * Math.PI * 2 + ring; return <circle key={`${ring}-${i}`} cx={cx + Math.cos(a) * rr * k} cy={cy + Math.sin(a) * rr * k} r={1.6 * k} fill="#4a331d" /> }))}</g>
}
function Sunflower({ lit = () => true, soil = true }: { lit?: (part: Part) => boolean; soil?: boolean }) {
  const o = (p: Part) => lit(p) ? 1 : faded
  return <g>
    {soil && <path d={`M10 ${SOIL}Q150 ${SOIL - 6} 270 ${SOIL}T530 ${SOIL - 2}V300H10Z`} fill={P.soil} />}
    <g opacity={o('roots')} fill="none" stroke={P.root} strokeLinecap="round">{ROOTS.map((d, i) => <path key={d} d={d} strokeWidth={i ? 2.6 : 4} />)}</g>
    <g opacity={o('stem')}><path d="M200 232C196 184 206 136 201 86" fill="none" stroke={P.deepGreen} strokeWidth="7" strokeLinecap="round" /></g>
    <g opacity={o('leaves')}>{SF_LEAVES.map((pose, i) => { const p = leafPath(pose); return <g key={i}><path d={p.outline} fill="#a9d49a" stroke={P.deepGreen} strokeWidth="2" /><path d={p.rib} stroke={P.deepGreen} strokeWidth="1.4" /></g> })}</g>
    <g opacity={o('head')}><Head /></g>
  </g>
}
function Seedling({ x }: { x: number }) {
  return <g><path d={`M${x} ${SOIL}V${SOIL - 22}`} stroke={P.deepGreen} strokeWidth="3" /><path d={`M${x} ${SOIL - 18}q-12 -10 -18 -2q8 8 18 2zM${x} ${SOIL - 20}q12 -10 18 -2q-8 8 -18 2z`} fill="#a9d49a" stroke={P.deepGreen} strokeWidth="1.4" /></g>
}
const Z = { cx: 420, cy: 150, r: 100 }
function ZoomLines({ from }: { from: Pt }) {
  return <path d={`M${from[0]} ${from[1]}L${Z.cx - 88} ${Z.cy - 48}M${from[0]} ${from[1]}L${Z.cx - 90} ${Z.cy + 44}`} stroke={ink} strokeWidth="1.2" strokeDasharray="3 3" />
}
function Caption({ text, dark = false }: { text: string; dark?: boolean }) {
  return <text x={Z.cx} y={Z.cy - Z.r - 10} textAnchor="middle" fill={dark ? 'white' : ink} fontSize="12">{text}</text>
}

function SunScene({ focus }: { focus: string }) {
  const step = focus.replace('photo-sun-', '')
  if (step === 'grow') return <Diagram title="A tall sunflower in soil next to a person for scale; the sunflower is taller. A small seedling beside it shows how it started in spring. Glyphs of carbon dioxide and water show what most of the new plant is made from.">
    <Sun /><Sunflower /><Seedling x={92} />
    <g transform="translate(320 128) scale(.6)"><Person x={0} y={0} facing={-1} body={172} /></g>
    <Label x={92} y={262} anchor="middle" lines={['spring: a seedling']} />
    <Label x={236} y={24} to={[222, 50]} lines={['summer: taller than you']} strong />
    <Label x={372} y={150} lines={['made mostly from', 'carbon dioxide', 'and water']} strong />
    <CO2 x={396} y={212} s={1.2} /><H2O x={456} y={210} s={1.2} />
  </Diagram>
  if (step === 'equation') return <Diagram title="The sunflower with four labelled arrows: light from the sun to the leaves, carbon dioxide from the air into a leaf, water up the stem from the soil, and oxygen out of the leaf into the air. Glucose is made in the leaf. A card shows the word equation: carbon dioxide plus water gives glucose plus oxygen, with light over the arrow.">
    <Sun /><Sunflower />
    {[[68, 58, 150, 128], [70, 50, 176, 94], [72, 42, 236, 140]].map(([x1, y1, x2, y2], i) => <Arrow key={i} x1={x1} y1={y1} x2={x2} y2={y2} colour={sunFill} width={2.6} />)}
    <text x={94} y={100} fill={lightInk} fontSize="13" fontWeight="700">light</text>
    <Arrow x1={336} y1={134} x2={268} y2={154} colour={co2} width={2.6} /><CO2 x={352} y={126} /><text x={346} y={110} fill={co2} fontSize="13" fontWeight="700">carbon dioxide in</text>
    <Arrow x1={250} y1={146} x2={300} y2={98} colour={teal} width={2.6} /><O2 x={312} y={86} /><text x={326} y={80} fill={teal} fontSize="13" fontWeight="700">oxygen out</text>
    <Arrow x1={208} y1={226} x2={208} y2={184} colour={h2o} width={2.6} /><H2O x={172} y={254} /><text x={156} y={260} textAnchor="end" fill={h2o} fontSize="13" fontWeight="700">water in</text>
    <Glucose x={236} y={160} s={.9} />
    <rect x={306} y={186} width={222} height={104} rx="10" fill="white" stroke={P.cellStroke} strokeWidth="1.8" />
    <text x={417} y={212} textAnchor="middle" fontSize="14" fontWeight="700"><tspan fill={co2}>carbon dioxide</tspan><tspan fill={ink}> + </tspan><tspan fill={h2o}>water</tspan></text>
    <text x={417} y={236} textAnchor="middle" fill={lightInk} fontSize="12" fontWeight="700">light</text><Arrow x1={372} y1={246} x2={462} y2={246} colour={ink} width={2.2} />
    <text x={417} y={276} textAnchor="middle" fontSize="14" fontWeight="700"><tspan fill={sugar}>glucose</tspan><tspan fill={ink}> + </tspan><tspan fill={teal}>oxygen</tspan></text>
  </Diagram>
  if (step === 'co2') return <Diagram title="The underside of a sunflower leaf, zoomed in. Carbon dioxide molecules from the air pass in through a stoma, a tiny hole between two guard cells, into the air spaces of the leaf. Oxygen molecules pass out the same way.">
    <Sunflower lit={p => p === 'leaves'} /><ZoomLines from={[MAIN_LEAF[0] + 6, MAIN_LEAF[1] + 4]} />
    <Zoom {...Z}>
      {[[350, 78], [398, 70], [446, 76], [492, 88], [372, 116], [424, 112], [474, 124], [344, 150], [492, 150]].map(([x, y], i) => <path key={i} d={blob(x, y, 20, 14, 30 + i, .14)} fill={P.cellFill} stroke={P.cellStroke} strokeWidth="1.5" />)}
      {Array.from({ length: 7 }, (_, i) => 334 + i * 26).filter(x => Math.abs(x + 12 - 420) > 20).map((x, i) => <rect key={x} x={x} y={170} width={24} height={16} rx="5" fill="#f4fbf6" stroke={P.cellStroke} strokeWidth="1.5" />)}
      {[-1, 1].map(s => <path key={s} d={blob(420 + s * 10, 178, 9, 8, 90 + s, .05)} fill="#d6ecd0" stroke={P.deepGreen} strokeWidth="1.8" />)}
      <path d="M404 250C408 220 414 198 418 150" stroke={co2} strokeWidth="2" fill="none" strokeDasharray="5 4" /><CO2 x={400} y={226} /><CO2 x={420} y={134} s={.9} />
      <path d="M424 150C428 190 440 214 452 240" stroke={teal} strokeWidth="2" fill="none" strokeDasharray="5 4" /><O2 x={450} y={222} />

    </Zoom>
    <Caption text="underside of a leaf, zoomed in" />
    <Label x={530} y={284} anchor="end" to={[420, 186]} lines={['stoma: a tiny hole']} strong /><text x={318} y={256} textAnchor="end" fill={co2} fontSize="13" fontWeight="700">CO₂ in</text><text x={528} y={246} textAnchor="end" fill={teal} fontSize="13" fontWeight="700">O₂ out</text>
    <Label x={20} y={140} lines={['carbon dioxide', 'gets in from the air']} strong colour={co2} />
  </Diagram>
  return <Diagram title="Water molecules from the soil enter the sunflower's roots and travel up the stem. A zoomed-in circle of the stem shows two xylem tubes with water molecules moving upwards.">
    <Sunflower lit={p => p === 'roots' || p === 'stem'} />
    <Arrow x1={194} y1={226} x2={194} y2={176} colour={h2o} width={2.6} /><Arrow x1={194} y1={140} x2={194} y2={100} colour={h2o} width={2.6} />
    {[[150, 262], [248, 262], [176, 284], [226, 286]].map(([x, y], i) => <H2O key={i} x={x} y={y} s={.9} />)}
    <ZoomLines from={[203, 160]} />
    <Zoom {...Z}>
      {[388, 452].map(x => <g key={x}><rect x={x - 22} y={40} width={44} height={220} fill={h2oFill} stroke={h2o} strokeWidth="2" />{Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${x - 22} ${54 + i * 20}h44`} stroke={h2o} strokeWidth="3" opacity=".55" />)}
        {[80, 140, 200].map((y, i) => <H2O key={y} x={x} y={y + (x > 400 ? 20 : 0)} s={.9} />)}</g>)}
      <rect x={410} y={40} width={20} height={220} fill="#fbf7ea" />{[330, 510].map(x => <rect key={x} x={x - 20} y={40} width={40} height={220} fill={P.cellFill} stroke={P.cellStroke} strokeWidth="1.2" />)}
      <Arrow x1={420} y1={236} x2={420} y2={68} colour={h2o} width={3} />
    </Zoom>
    <Caption text="inside the stem, zoomed in" />
    <Label x={20} y={150} lines={['water in from', 'the soil, up to', 'the leaves']} strong colour={h2o} />
    <Label x={530} y={284} anchor="end" to={[452, 246]} lines={['xylem: carries water up']} strong colour={h2o} />
  </Diagram>
}

// ---------- Inside the leaf: a palisade cell and one chloroplast ----------
const LZ = { cx: 392, cy: 150, r: 124 }
function MiniLeafSection() {
  return <g><g transform="translate(10 52) scale(.52)">
      <rect x={20} y={46} width={380} height={195} fill="#f4fbf6" /><Epidermis top={46} height={16} seed={3} /><Palisade top={63} height={70} seed={5} />
      <Spongy top={135} height={88} seed={7} avoid={[[322, 178, 44]]} /><Vein cx={322} cy={178} /><Epidermis top={225} height={16} seed={9} gapX={150} /></g>
    <rect x={80} y={84} width={16} height={40} rx="5" fill="none" stroke={ink} strokeWidth="1.8" />
    <text x={119} y={44} textAnchor="middle" fill={ink} fontSize="12">a leaf, cut across (Lesson 17)</text></g>
}
function Chloroplast({ x, y, a = 0, k = 1 }: { x: number; y: number; a?: number; k?: number }) {
  return <g transform={`rotate(${a} ${x} ${y})`}><ellipse cx={x} cy={y} rx={13 * k} ry={7 * k} fill="#86c476" stroke="#3f7f4c" strokeWidth={1.4} />
    {[-6, 0, 6].map(d => <path key={d} d={`M${x + d * k - 2.5 * k} ${y}h${5 * k}`} stroke="#2f6a37" strokeWidth={2 * k} strokeLinecap="round" />)}</g>
}
const PAL_CHLORO: Array<[number, number, number]> = [[352, 72, 70], [432, 76, 110], [346, 118, 80], [440, 122, 100], [344, 168, 90], [442, 170, 90], [348, 214, 100], [436, 218, 80], [372, 250, 0], [414, 48, 0]]
function PalisadeCell({ litChloro }: { litChloro: boolean }) {
  return <g><path d={blob(392, 150, 62, 118, 12, .04, .7)} fill={P.cellFill} stroke={P.deepGreen} strokeWidth="4" /><path d={blob(392, 150, 55, 111, 12, .04, .7)} fill="none" stroke={P.cellStroke} strokeWidth="1.2" />
    <g opacity={litChloro ? faded : 1}><path d={blob(394, 160, 30, 74, 4, .08)} fill="#eef7fb" stroke="#9cc7da" strokeWidth="1.4" /><circle cx={392} cy={70} r={14} fill="#e2d9ee" stroke="#8a7aa8" strokeWidth="1.4" /></g>
    {PAL_CHLORO.map(([x, y, a], i) => <Chloroplast key={i} x={x} y={y} a={a} />)}</g>
}
function BigChloroplast({ litGrana }: { litGrana: boolean }) {
  const stacks: Pt[] = [[326, 150], [356, 124], [360, 176], [396, 148], [430, 122], [432, 178], [462, 150]]
  return <g><ellipse cx={392} cy={150} rx={104} ry={60} fill="#e3f2dc" stroke="#3f7f4c" strokeWidth="2.4" /><ellipse cx={392} cy={150} rx={98} ry={54} fill="none" stroke="#3f7f4c" strokeWidth="1.2" />
    {stacks.slice(0, -1).map(([x, y], i) => <path key={i} d={`M${x} ${y}L${stacks[i + 1][0]} ${stacks[i + 1][1]}`} stroke="#5c9d57" strokeWidth="2" opacity=".6" />)}
    {stacks.map(([x, y], i) => <g key={i}>{[-9, -3, 3, 9].map(d => <rect key={d} x={x - 12} y={y + d - 2.5} width={24} height={5} rx="2.5" fill={litGrana ? '#2f7a3a' : '#5c9d57'} stroke="#1f5a2a" strokeWidth=".8" />)}</g>)}</g>
}
function LeafScene({ focus }: { focus: string }) {
  const step = focus.replace('photo-leaf-', '')
  const big = step !== 'chloroplast'
  const titles: Record<string, string> = {
    chloroplast: 'A small leaf cross-section with one palisade cell boxed. A zoomed-in circle shows that cell: a thick cell wall, a nucleus, a large vacuole and many green chloroplasts, which are highlighted.',
    chlorophyll: 'One chloroplast, zoomed in further. Stacks of dark green discs inside it contain chlorophyll, which absorbs the light shining in.',
    endothermic: 'One chloroplast, zoomed in. Energy from light comes in from the environment, carbon dioxide and water go in, and glucose and oxygen come out. The reaction takes in energy: it is endothermic.',
  }
  return <Diagram title={titles[step] || titles.chloroplast}>
    <MiniLeafSection />
    <path d={`M96 90L${LZ.cx - 112} ${LZ.cy - 54}M96 118L${LZ.cx - 116} ${LZ.cy + 36}`} stroke={ink} strokeWidth="1.2" strokeDasharray="3 3" />
    <Zoom {...LZ}>{big ? <BigChloroplast litGrana={step === 'chlorophyll'} /> : <PalisadeCell litChloro />}
      {step === 'endothermic' && <><Arrow x1={282} y1={144} x2={306} y2={148} colour={co2} width={2} /><CO2 x={284} y={130} /><Arrow x1={282} y1={176} x2={306} y2={166} colour={h2o} width={2} /><H2O x={282} y={188} />
        <Arrow x1={478} y1={140} x2={500} y2={132} colour={sugar} width={2} /><Glucose x={502} y={118} /><Arrow x1={478} y1={164} x2={500} y2={172} colour={teal} width={2} /><O2 x={500} y={186} /></>}
    </Zoom>
    {big && [[312, 34, 352, 108], [344, 26, 382, 102], [376, 26, 412, 102]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1} ${y1}q8 10 4 20t6 20t${(x2 - x1) - 10} ${(y2 - y1) - 40}`} stroke={sunLine} strokeWidth="2.6" fill="none" />)}
    {big && <text x={LZ.cx + 6} y={20} fill={lightInk} fontSize="13" fontWeight="700">{step === 'endothermic' ? 'energy from light' : 'light'}</text>}
    {!big && <text x={LZ.cx} y={20} textAnchor="middle" fill={ink} fontSize="12">one palisade cell, zoomed in</text>}
    {step === 'chloroplast' && <Label x={20} y={214} to={[346, 118]} lines={['chloroplasts: where', 'photosynthesis happens']} strong colour={P.deepGreen} />}
    {step === 'chlorophyll' && <><Label x={20} y={214} to={[396, 144]} lines={['chlorophyll in these', 'green stacks absorbs light']} strong colour={P.deepGreen} /><text x={20} y={270} fill={ink} fontSize="12">one chloroplast, zoomed in further</text></>}
    {step === 'endothermic' && <><Label x={20} y={214} lines={['endothermic: energy', 'is taken in from', 'the environment']} strong colour={lightInk} /><text x={20} y={286} fill={ink} fontSize="12">CO₂ + H₂O in → glucose + O₂ out</text></>}
  </Diagram>
}

// ---------- The one summary card: word equation, glyphs and symbols ----------
function Summary() {
  const cols: Array<{ x: number; word: string; sym: string; colour: string; glyph: ReactNode }> = [
    { x: 78, word: 'carbon dioxide', sym: 'CO₂', colour: co2, glyph: <CO2 x={78} y={150} s={1.7} /> },
    { x: 206, word: 'water', sym: 'H₂O', colour: h2o, glyph: <H2O x={206} y={146} s={1.7} /> },
    { x: 386, word: 'glucose', sym: 'C₆H₁₂O₆', colour: sugar, glyph: <Glucose x={386} y={150} s={2} /> },
    { x: 482, word: 'oxygen', sym: 'O₂', colour: teal, glyph: <O2 x={482} y={150} s={1.7} /> },
  ]
  return <Diagram title="Summary card for photosynthesis. Word equation: carbon dioxide plus water gives glucose plus oxygen, using light. Chemical symbols: carbon dioxide CO₂, water H₂O, glucose C₆H₁₂O₆, oxygen O₂. It happens in chloroplasts and takes in energy from light, so it is endothermic.">
    <rect x={14} y={14} width={512} height={272} rx="12" fill="#f7fbf5" stroke={P.cellStroke} strokeWidth="1.6" />
    <text x={270} y={46} textAnchor="middle" fill={ink} fontSize="16" fontWeight="700">Photosynthesis</text>
    {cols.map(c => <g key={c.word}><text x={c.x} y={96} textAnchor="middle" fill={c.colour} fontSize="14" fontWeight="700">{c.word}</text>{c.glyph}<text x={c.x} y={206} textAnchor="middle" fill={c.colour} fontSize="17" fontWeight="700">{c.sym}</text></g>)}
    {[152, 434].map(x => <text key={x} x={x} y={96} textAnchor="middle" fill={ink} fontSize="16" fontWeight="700">+</text>)}
    <text x={296} y={84} textAnchor="middle" fill={lightInk} fontSize="12" fontWeight="700">light</text><Arrow x1={256} y1={94} x2={336} y2={94} colour={ink} width={2.2} />
    <text x={270} y={248} textAnchor="middle" fill={ink} fontSize="13">in chloroplasts · energy taken in from light: endothermic</text>
    <text x={270} y={270} textAnchor="middle" fill={ink} fontSize="11">Molecules drawn as simple symbols, not real shapes.</text>
  </Diagram>
}

// ---------- Where the glucose goes ----------
function Mito({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  return <g transform={`rotate(${a} ${x} ${y})`}><ellipse cx={x} cy={y} rx="16" ry="8" fill="#f3d6cc" stroke="#b86e57" strokeWidth="1.4" /><path d={`M${x - 11} ${y}q3 -5 6 0t6 0t6 0t5 0`} stroke="#b86e57" strokeWidth="1.2" fill="none" /></g>
}
function Chain({ x, y, n, dx = 15, dy = 0 }: { x: number; y: number; n: number; dx?: number; dy?: number }) {
  return <g>{Array.from({ length: n }, (_, i) => <g key={i}>{i > 0 && <path d={`M${x + (i - 1) * dx + 7} ${y + (i - 1) * dy}L${x + i * dx - 7} ${y + i * dy}`} stroke={sugar} strokeWidth="2" />}<Glucose x={x + i * dx} y={y + i * dy} s={.75} /></g>)}</g>
}
function Bead({ x, y, c = '#c77b8f' }: { x: number; y: number; c?: string }) { return <circle cx={x} cy={y} r="5.5" fill="#f6dbe2" stroke={c} strokeWidth="1.8" /> }
function StarchGrain({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  return <g>{[1, .7, .4].map(k => <ellipse key={k} cx={x} cy={y} rx={r * k} ry={r * .8 * k} fill={k === 1 ? sugarFill : 'none'} stroke={sugar} strokeWidth="1.4" />)}</g>
}
function UseScene({ focus }: { focus: string }) {
  const step = focus.replace('photo-use-', '')
  if (step === 'insoluble') return <Diagram title="Two plant cells side by side. On the left, a cell full of dissolved glucose draws in water by osmosis, shown by blue arrows, and swells. On the right, a cell storing insoluble starch grains does not draw in extra water and stays the same size.">
    <path d={blob(140, 140, 104, 86, 5, .05)} fill="#fbf3dc" stroke={P.deepGreen} strokeWidth="3" />
    {[[100, 110], [150, 96], [190, 130], [120, 160], [170, 176], [84, 150], [210, 170], [140, 128]].map(([x, y], i) => <Glucose key={i} x={x} y={y} s={.9} />)}
    {[[140, 20, 140, 50], [262, 140, 238, 140], [18, 140, 42, 140], [140, 256, 140, 228]].map(([x1, y1, x2, y2], i) => <Arrow key={i} x1={x1} y1={y1} x2={x2} y2={y2} colour={h2o} width={2.6} />)}
    <path d={blob(410, 140, 84, 68, 8, .05)} fill={P.cellFill} stroke={P.deepGreen} strokeWidth="3" />
    {[[380, 116], [430, 110], [400, 160], [452, 156], [360, 156]].map(([x, y], i) => <StarchGrain key={i} x={x} y={y} r={13} />)}
    <text x={140} y={268} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700"><tspan x={140}>dissolved glucose: water</tspan><tspan x={140} dy={16}>moves in by osmosis</tspan></text>
    <text x={410} y={242} textAnchor="middle" fill={ink} fontSize="13" fontWeight="700"><tspan x={410}>insoluble starch:</tspan><tspan x={410} dy={16}>no extra water drawn in</tspan></text>
    <Label x={530} y={24} anchor="end" to={[430, 110]} lines={['starch grains']} colour={sugar} />
  </Diagram>
  const nightTime = step === 'starch'
  const lit = (p: Part) => step === 'respiration' ? true : step === 'cellulose' ? p === 'stem' : step === 'protein' ? p === 'roots' : step === 'oil' ? p === 'head' : p !== 'head'
  const from: Pt = step === 'cellulose' ? [203, 150] : step === 'protein' ? [206, 262] : step === 'oil' ? [224, 62] : [MAIN_LEAF[0] + 6, MAIN_LEAF[1] + 4]
  const titles: Record<string, string> = {
    respiration: 'The whole sunflower, with a zoomed-in cell. Glucose goes into the mitochondria, where respiration transfers energy from it, shown as a spark.',
    cellulose: 'The sunflower with its stem highlighted. A zoomed-in circle shows stem cells with thick cell walls made of cellulose: long chains of glucose units joined together.',
    protein: 'The sunflower with its roots highlighted, taking in nitrate ions from the soil. A zoomed-in circle shows glucose and a nitrate ion making an amino acid, and amino acids joining into a chain: a protein.',
    oil: 'The sunflower with its seed head highlighted. A zoomed-in circle shows one seed cut open, full of oil droplets.',
    starch: 'At night, with no light, the sunflower uses starch stored in its roots, stem and leaves. A zoomed-in cell shows starch grains being broken back into glucose.',
  }
  return <Diagram title={titles[step] || titles.respiration}>
    {nightTime ? <><rect x={0} y={0} width={540} height={SOIL + 4} fill={night} /><circle cx={50} cy={40} r={16} fill="#f3efd8" /><circle cx={58} cy={34} r={14} fill={night} />{[[110, 30], [300, 22], [150, 70], [280, 60], [520, 30]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" fill="white" />)}</> : <Sun />}
    <Sunflower lit={lit} />
    {step === 'protein' && [[152, 250], [248, 256], [174, 280], [232, 284]].map(([x, y], i) => <Nitrate key={i} x={x} y={y} />)}
    <ZoomLines from={from} />
    <Zoom {...Z}>
      {step === 'respiration' && <><path d={blob(420, 150, 86, 78, 21, .05)} fill={P.cellFill} stroke={P.deepGreen} strokeWidth="3" />
        {[[392, 116, 20], [450, 130, -30], [410, 190, 10], [462, 186, 40]].map(([x, y, a], i) => <Mito key={i} x={x} y={y} a={a} />)}
        <Glucose x={360} y={156} /><Arrow x1={370} y1={152} x2={390} y2={130} colour={sugar} width={2} /><Glucose x={340} y={196} s={.8} /><Spark x={420} y={100} /><Spark x={486} y={150} /></>}
      {step === 'cellulose' && <>{[[372, 100], [468, 100], [372, 200], [468, 200]].map(([x, y], i) => <rect key={i} x={x - 44} y={y - 46} width={88} height={92} rx="6" fill={P.cellFill} stroke={P.deepGreen} strokeWidth="5" />)}
        <rect x={396} y={52} width={48} height={200} fill="#fbf7ea" stroke="#c9a15c" strokeWidth="1.2" />{[70, 110, 150, 190, 230].map(y => <Chain key={y} x={402} y={y} n={3} dx={18} />)}</>}
      {step === 'protein' && <><Glucose x={346} y={104} /><text x={346} y={130} textAnchor="middle" fill={sugar} fontSize="11" fontWeight="700">glucose</text><text x={374} y={108} fill={ink} fontSize="14" fontWeight="700">+</text><Nitrate x={400} y={104} /><text x={400} y={130} textAnchor="middle" fill="#8a6d45" fontSize="11" fontWeight="700">nitrate</text>
        <Arrow x1={424} y1={104} x2={456} y2={104} colour={ink} width={2} /><Bead x={474} y={104} /><text x={474} y={130} textAnchor="middle" fill="#a25a6d" fontSize="11" fontWeight="700">amino acid</text>
        {Array.from({ length: 8 }, (_, i) => <g key={i}>{i > 0 && <path d={`M${344 + (i - 1) * 20 + 5} ${190 + Math.sin(i - 1) * 10}L${344 + i * 20 - 5} ${190 + Math.sin(i) * 10}`} stroke="#c77b8f" strokeWidth="2" />}<Bead x={344 + i * 20} y={190 + Math.sin(i) * 10} /></g>)}
        <text x={416} y={214} textAnchor="middle" fill="#a25a6d" fontSize="11" fontWeight="700">a protein</text></>}
      {step === 'oil' && <><path d="M420 64C480 80 494 190 420 238C346 190 360 80 420 64Z" fill="#f8efd5" stroke="#7a5a36" strokeWidth="3" />{[[410, 110, 9], [436, 128, 11], [404, 152, 12], [440, 170, 9], [420, 196, 10], [396, 186, 7], [426, 92, 6]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#f3d27a" stroke={sugar} strokeWidth="1.4" />)}</>}
      {step === 'starch' && <><path d={blob(420, 150, 86, 78, 23, .05)} fill={P.cellFill} stroke={P.deepGreen} strokeWidth="3" />{[[390, 120], [446, 116], [402, 180], [452, 176]].map(([x, y], i) => <StarchGrain key={i} x={x} y={y} r={16} />)}
        <Arrow x1={466} y1={166} x2={490} y2={144} colour={sugar} width={2} /><Glucose x={494} y={132} s={.8} /><Glucose x={482} y={200} s={.8} /></>}
    </Zoom>
    <Caption text={step === 'respiration' ? 'a cell, zoomed in' : step === 'cellulose' ? 'stem cells, zoomed in' : step === 'protein' ? 'making proteins' : step === 'oil' ? 'one seed, cut open' : 'a cell at night'} dark={nightTime} />
    {step === 'respiration' && <Label x={530} y={284} anchor="end" to={[450, 130]} lines={['respiration in mitochondria (Lesson 1)']} colour={ink} />}
    {step === 'respiration' && <Label x={20} y={140} lines={['energy for', 'living and', 'growing']} strong colour={lightInk} />}
    {step === 'cellulose' && <><Label x={530} y={284} anchor="end" to={[420, 230]} lines={['cellulose: glucose joined in long chains']} colour={sugar} /><Label x={20} y={140} lines={['strong walls:', 'a tall stem']} strong colour={P.deepGreen} /></>}
    {step === 'protein' && <Label x={20} y={140} lines={['nitrate ions', 'from the soil']} strong colour="#8a6d45" />}
    {step === 'oil' && <><Label x={530} y={284} anchor="end" to={[436, 128]} lines={['oil droplets stored in the seed']} colour={sugar} /><Label x={20} y={140} lines={['lipids: fats', 'and oils']} strong colour={sugar} /></>}
    {step === 'starch' && <><text x={20} y={140} fill="white" fontSize="14" fontWeight="700"><tspan x={20}>night: no light,</tspan><tspan x={20} dy={16}>no photosynthesis</tspan></text><text x={530} y={286} textAnchor="end" fill={ink} fontSize="13" fontWeight="700">stored starch → glucose</text></>}
  </Diagram>
}

// ---------- Question diagrams and data ----------
function ArrowsQuestion({ assessment }: { assessment: boolean }) {
  const arrows: Array<{ a: [number, number, number, number]; badge: Pt; name: string; colour: string }> = [
    { a: [336, 134, 268, 154], badge: [352, 128], name: 'carbon dioxide', colour: co2 },
    { a: [188, 262, 188, 208], badge: [166, 262], name: 'water', colour: h2o },
    { a: [250, 146, 300, 98], badge: [314, 86], name: 'oxygen', colour: teal },
    { a: [214, 174, 214, 222], badge: [236, 210], name: 'glucose', colour: sugar },
  ]
  return <Diagram title={assessment ? 'A sunflower with four numbered arrows: 1 from the air into a leaf, 2 from the soil up the stem, 3 from a leaf out into the air, 4 from a leaf down the stem.' : 'A sunflower with four numbered arrows: 1 carbon dioxide into a leaf, 2 water up the stem, 3 oxygen out of a leaf, 4 glucose carried from a leaf to the rest of the plant.'}>
    <Sun /><Sunflower />
    {arrows.map((ar, i) => <g key={i}><Arrow x1={ar.a[0]} y1={ar.a[1]} x2={ar.a[2]} y2={ar.a[3]} colour={assessment ? ink : ar.colour} width={2.6} /><Badge n={i + 1} x={ar.badge[0]} y={ar.badge[1]} />
      {!assessment && <text x={ar.badge[0] + (i === 1 ? -18 : 18)} y={ar.badge[1] + 5} textAnchor={i === 1 ? 'end' : 'start'} fill={ar.colour} fontSize="13" fontWeight="700">{ar.name}</text>}</g>)}
  </Diagram>
}
function PartsQuestion({ assessment }: { assessment: boolean }) {
  const parts: Array<{ to: Pt; badge: Pt; name: string }> = [
    { to: [238, 266], badge: [330, 268], name: 'roots' }, { to: [203, 206], badge: [330, 208], name: 'stem' },
    { to: MAIN_LEAF, badge: [330, 148], name: 'leaf' }, { to: [214, 64], badge: [330, 64], name: 'seeds in the flower head' },
  ]
  return <Diagram title={assessment ? 'A sunflower with four numbered parts, 1 to 4, from the bottom of the plant to the top.' : 'A sunflower with four numbered parts: 1 the roots, 2 the stem, 3 a leaf, 4 the seeds in the flower head.'}>
    <Sun /><Sunflower />
    {parts.map((p, i) => <g key={i}><path d={`M${p.badge[0] - 13} ${p.badge[1]}L${p.to[0]} ${p.to[1]}`} stroke={ink} strokeWidth="1.5" /><circle cx={p.to[0]} cy={p.to[1]} r="2.5" fill={ink} /><Badge n={i + 1} x={p.badge[0]} y={p.badge[1]} />
      {!assessment && <text x={p.badge[0] + 20} y={p.badge[1] + 5} fill={ink} fontSize="13" fontWeight="700">{p.name}</text>}</g>)}
  </Diagram>
}
function StarchData() {
  const data: Array<[number, number]> = [[0, 20], [3, 12], [6, 6], [9, 30], [12, 60], [15, 82], [18, 90], [21, 55], [24, 22]]
  const X = (h: number) => 70 + h * 18, Y = (v: number) => 240 - v * 1.8
  return <Diagram title="Line graph of the amount of starch in one sunflower leaf over 24 hours. Night runs from 00:00 to 06:00 and from 18:00 to 24:00; day runs from 06:00 to 18:00. Starch is 20 at 00:00, 6 at 06:00, 60 at 12:00, 90 at 18:00 and 22 at 24:00.">
    <text x={20} y={24} fill={ink} fontSize="14" fontWeight="600">Starch in one leaf over 24 hours</text>
    <rect x={X(0)} y={50} width={X(6) - X(0)} height={190} fill="#e9ecf4" /><rect x={X(6)} y={50} width={X(18) - X(6)} height={190} fill="#fdf6dc" /><rect x={X(18)} y={50} width={X(24) - X(18)} height={190} fill="#e9ecf4" />
    {[[3, 'night'], [12, 'day'], [21, 'night']].map(([h, t]) => <text key={String(h)} x={X(Number(h))} y={66} textAnchor="middle" fill={ink} fontSize="12">{t}</text>)}
    <path d="M70 240H500M70 240V50" stroke={ink} strokeWidth="2" /><text x={76} y={86} fill={ink} fontSize="12">amount of starch</text>
    {[0, 50, 100].map(v => <g key={v}><path d={`M64 ${Y(v)}h6`} stroke={ink} /><text x={60} y={Y(v) + 4} textAnchor="end" fontSize="11" fill={ink}>{v}</text></g>)}
    {[0, 6, 12, 18, 24].map(h => <g key={h}><path d={`M${X(h)} 240v6`} stroke={ink} /><text x={X(h)} y={258} textAnchor="middle" fontSize="11" fill={ink}>{`${String(h).padStart(2, '0')}:00`}</text></g>)}
    <text x={285} y={280} textAnchor="middle" fontSize="12" fill={ink}>time of day</text>
    <path d={data.map(([h, v], i) => `${i ? 'L' : 'M'}${X(h)} ${Y(v)}`).join('')} stroke={sugar} strokeWidth="3" fill="none" />
    {data.map(([h, v]) => <circle key={h} cx={X(h)} cy={Y(v)} r="3.8" fill={sugar} />)}
  </Diagram>
}

export function EnergyVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'photo-arrows-question') return <ArrowsQuestion assessment={assessment} />
  if (focus === 'photo-parts-question') return <PartsQuestion assessment={assessment} />
  if (focus === 'photo-starch-data') return <StarchData />
  if (focus === 'photo-summary') return <Summary />
  if (focus.startsWith('photo-sun-')) return <SunScene focus={focus} />
  if (focus.startsWith('photo-leaf-')) return <LeafScene focus={focus} />
  if (focus.startsWith('photo-use-')) return <UseScene focus={focus} />
  return <SunScene focus="photo-sun-grow" />
}

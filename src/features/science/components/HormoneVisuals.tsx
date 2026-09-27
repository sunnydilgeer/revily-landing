import { useId, type ReactNode } from 'react'
import { AnatomyFigure, Pointer } from './anatomy/AnatomyFigure'
import { Arrow, Label, blob, infectionPalette } from './InfectionVisuals'

// Chapter B5 (Lessons 38–41): hormones, blood glucose, the menstrual cycle and contraception. Original, code-native schematics. Not to scale.
// Focus ids start with 'hormone-'.
// Colour code: indigo = hormones, amber = glucose (and glycogen), red = blood, gold = nerve impulses,
// pink-red = uterus lining, cream = eggs, grey-blue = sperm, copper = the IUD.
const { ink, skin, skinLine } = infectionPalette
const faded = 0.3
const hormone = '#4153a6', hormoneFill = '#aab4ea', hormoneSoft = '#e3e7fa'
const amber = '#c98f2c', amberFill = '#f6dfa5'
const bloodLine = '#b0414d', bloodFill = '#f7d4d7', red = '#c8505a'
const signal = '#b47b13'
const gland = '#efc4b8', glandLine = '#b06c61'
const lining = '#c8505a', liningFill = '#f1b3b8', wall = '#f6dcd5', wallLine = '#bf8a80'
const eggFill = '#fff4d6', eggLine = '#c49a3c', sperm = '#5f7488'
const muted = '#657a89', good = '#3f8f6a', goodFill = '#dff0e6', panel = '#f7fafc', panelLine = '#cfdde7'
const copper = '#b8733a'

type Pt = [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

// ---------- Shared pieces ----------
function Figure({ title, children, viewBox = '0 0 540 300', note, data = false }: { title: string; children: ReactNode; viewBox?: string; note?: string; data?: boolean | string }) {
  const titleId = useId()
  return <div className="science-bio-model">
    <svg viewBox={viewBox} role="img" aria-labelledby={titleId}>
      <title id={titleId}>{`${title} ${typeof data === 'string' ? data : data ? 'Invented data for practice.' : 'Original schematic, not to scale.'}`}</title>
      <g strokeLinejoin="round" strokeLinecap="round">{children}</g>
    </svg>
    {note && <p className="science-bio-note">{note}</p>}
  </div>
}
function Text({ x, y, children, anchor = 'start', size = 14, bold = false, colour = ink, opacity }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number; bold?: boolean; colour?: string; opacity?: number }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 500} fill={colour} opacity={opacity}>{children}</text>
}
function Lines({ x, y, lines, anchor = 'start', size = 14, bold = false, colour = ink }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end'; size?: number; bold?: boolean; colour?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 500} fill={colour}>{lines.map((line, i) => <tspan key={i} x={x} dy={i ? size + 3 : 0}>{line}</tspan>)}</text>
}
// A hormone molecule: a small indigo diamond.
function Hormone({ x, y, s = 6, opacity }: { x: number; y: number; s?: number; opacity?: number }) {
  return <path d={`M${x} ${y - s}L${x + s} ${y}L${x} ${y + s}L${x - s} ${y}Z`} fill={hormoneFill} stroke={hormone} strokeWidth="1.6" opacity={opacity} />
}
// A glucose molecule: a small amber hexagon.
function Glucose({ x, y, s = 5.5 }: { x: number; y: number; s?: number }) {
  const pts = Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + i * Math.PI / 3; return `${r1(x + s * Math.cos(a))},${r1(y + s * Math.sin(a))}` }).join(' ')
  return <polygon points={pts} fill={amberFill} stroke={amber} strokeWidth="1.5" />
}
// Glycogen: many glucose units joined into one stored granule.
function Glycogen({ x, y }: { x: number; y: number }) {
  const pts: Pt[] = [[0, 0], [9, -3], [-8, 4], [3, 9], [-3, -9], [11, 7], [-11, -5]]
  return <g>{pts.map(([dx, dy], i) => <Glucose key={i} x={x + dx} y={y + dy} s={4.6} />)}</g>
}
function Egg({ x, y, r = 7, opacity }: { x: number; y: number; r?: number; opacity?: number }) {
  return <g opacity={opacity}><circle cx={x} cy={y} r={r} fill={eggFill} stroke={eggLine} strokeWidth="1.6" /><circle cx={x - r * .15} cy={y - r * .1} r={r * .3} fill="#e7c77a" /></g>
}
function Sperm({ x, y, angle = -90, s = 1, opacity }: { x: number; y: number; angle?: number; s?: number; opacity?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`} opacity={opacity}>
    <path d="M-5 0q-6 -4 -11 0t-11 0" stroke={sperm} strokeWidth="1.4" fill="none" />
    <ellipse cx="0" cy="0" rx="4.6" ry="3.2" fill="#dfe6ec" stroke={sperm} strokeWidth="1.4" />
  </g>
}
function Cross({ x, y, s = 8, colour = red }: { x: number; y: number; s?: number; colour?: string }) {
  return <path d={`M${x - s} ${y - s}L${x + s} ${y + s}M${x + s} ${y - s}L${x - s} ${y + s}`} stroke={colour} strokeWidth="3" />
}
// Numbered steps down the right-hand side, like the lesson 18 transpiration stream.
function Steps({ x, ys, items, active, upto = items.length, colour = hormone }: { x: number; ys: number[]; items: string[][]; active: number; upto?: number; colour?: string }) {
  return <g>{items.map((lines, i) => {
    const n = i + 1
    if (n > upto) return null
    const on = active === 0 || active === n
    return <g key={n} opacity={on ? 1 : .45}>
      <circle cx={x} cy={ys[i]} r="12" fill={active === n ? colour : 'white'} stroke={ink} strokeWidth="2" />
      <text x={x} y={ys[i] + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active === n ? 'white' : ink}>{n}</text>
      <Lines x={x + 20} y={ys[i] - 2} lines={lines} bold={active === n} size={14} />
    </g>
  })}</g>
}
function NumberBadge({ n, x, y, to }: { n: string; x: number; y: number; to: Pt }) {
  return <Pointer mark={n} x={x} y={y} toX={to[0]} toY={to[1]} />
}
// A horizontal blood vessel with flow arrows.
function Vessel({ x1, x2, y, h = 36, opacity }: { x1: number; x2: number; y: number; h?: number; opacity?: number }) {
  return <g opacity={opacity}>
    <rect x={x1} y={y - h / 2} width={x2 - x1} height={h} rx={h / 2} fill={bloodFill} stroke={bloodLine} strokeWidth="2" />
    <Arrow x1={x2 - 44} y1={y} x2={x2 - 14} y2={y} colour={red} width={2.2} />
    <Arrow x1={x1 + 14} y1={y} x2={x1 + 44} y2={y} colour={red} width={2.2} />
  </g>
}

// ---------- Lesson 38: a hormone's route (gland → blood → target organ) ----------
function Route({ focus }: { focus: string }) {
  const stage = focus.replace('hormone-route-', '')
  const step = ({ hormone: 1, gland: 1, blood: 2, target: 3 } as Record<string, number>)[stage] || 0
  const on = (n: number) => step === 0 || step === n ? 1 : faded
  const titles: Record<string, string> = {
    hormone: 'A gland releases a hormone, a chemical messenger, straight into the blood.',
    gland: 'A gland that releases hormones straight into the blood is an endocrine gland. All of them together make up the endocrine system.',
    blood: 'The blood carries the hormone all around the body.',
    target: 'The hormone reaches every organ, but only its target organ responds. Another organ does not respond.',
    all: 'The route of a hormone: a gland releases it into the blood, the blood carries it around the body, and only the target organ responds.',
  }
  return <Figure title={titles[stage] || titles.all}>
    <g opacity={on(1)}>
      <path d={blob(88, 132, 50, 38, 5, .07)} fill={gland} stroke={glandLine} strokeWidth="2.2" />
      {[[70, 124], [96, 112], [104, 142], [78, 148]].map(([x, y], i) => <Hormone key={i} x={x} y={y} />)}
      <Arrow x1={90} y1={160} x2={90} y2={186} colour={hormone} width={2.4} />
      {stage === 'gland' ? <Lines x={88} y={62} lines={['endocrine', 'gland']} anchor="middle" bold /> : <Text x={88} y={78} anchor="middle" bold={step === 1}>gland</Text>}
    </g>
    <Vessel x1={20} x2={352} y={208} opacity={on(2)} />
    <g opacity={on(2)}>{[[132, 200], [178, 214], [226, 202], [276, 214]].map(([x, y], i) => <Hormone key={i} x={x} y={y} />)}
      <Text x={186} y={252} anchor="middle" bold={step === 2}>blood</Text></g>
    <g opacity={on(3)}>
      <path d={blob(200, 136, 38, 28, 17, .08)} fill="#eef1f4" stroke="#9aa9b5" strokeWidth="2" />
      <Hormone x={200} y={178} opacity={.9} />
      <Lines x={200} y={70} lines={['other organ', 'no response']} anchor="middle" size={13} colour={muted} />
      <circle cx={306} cy={136} r="44" fill="none" stroke={good} strokeWidth="2" strokeDasharray="4 5" opacity={step === 3 || step === 0 ? 1 : 0} />
      <path d={blob(306, 136, 38, 28, 23, .08)} fill={goodFill} stroke={good} strokeWidth="2.2" />
      <Arrow x1={306} y1={190} x2={306} y2={168} colour={hormone} width={2.4} />
      {[[292, 156], [318, 158]].map(([x, y], i) => <Hormone key={i} x={x} y={y} s={5} />)}
      <Text x={306} y={70} anchor="middle" bold={step === 3} colour={good}>target organ</Text>
      <Text x={306} y={86} anchor="middle" size={13} colour={good}>responds</Text>
    </g>
    <Steps x={384} ys={[70, 150, 230]} active={step} items={[['gland releases', 'a hormone'], ['blood carries it', 'round the body'], ['target organ', 'responds']]} />
    {stage === 'gland' && <Text x={20} y={288} size={13}>all endocrine glands together = the endocrine system</Text>}
    <g transform="translate(20 272)" opacity={stage === 'gland' ? 0 : 1}><Hormone x={6} y={6} /><Text x={20} y={11} size={13}>= hormone</Text></g>
  </Figure>
}

// ---------- Lesson 38: the endocrine glands on a body outline ----------
const glandKey = [
  { mark: '1', id: 'pituitary', name: 'Pituitary gland', detail: 'The “master gland”: its hormones make other glands release hormones.' },
  { mark: '2', id: 'thyroid', name: 'Thyroid gland', detail: 'Thyroxine: helps control metabolism, heart rate and temperature.' },
  { mark: '3', id: 'adrenal', name: 'Adrenal glands', detail: 'Adrenaline: gets the body ready for “fight or flight”.' },
  { mark: '4', id: 'pancreas', name: 'Pancreas', detail: 'Insulin: helps control the blood glucose level.' },
  { mark: '5', id: 'ovaries', name: 'Ovaries (females)', detail: 'Oestrogen: involved in the menstrual cycle.' },
  { mark: '6', id: 'testes', name: 'Testes (males)', detail: 'Testosterone: controls puberty and sperm production.' },
]
function Glands({ focus, assessment }: { focus: string; assessment: boolean }) {
  const stage = focus.replace('hormone-glands-', '')
  const all = stage === 'all' || stage === 'question'
  const sel = (id: string) => stage === id || (stage === 'sex' && (id === 'ovaries' || id === 'testes'))
  const act = (id: string) => !assessment && (all || sel(id))
  const fill = (id: string) => act(id) ? hormoneFill : gland
  const line = (id: string) => act(id) ? hormone : glandLine
  const op = (id: string) => assessment || all || sel(id) ? 1 : .45
  const body = 'M284 122L284 146Q244 148 228 162L197 318Q193 334 205 336L214 330L238 200L240 330L252 462L292 462L300 360L308 462L348 462L360 330L362 200L386 330L395 336Q407 334 403 318L372 162Q356 148 316 146L316 122Z'
  return <AnatomyFigure title="Endocrine glands in the body" height={470}
    description={assessment ? 'A simple body outline with six glands numbered 1 to 6. The lower body is shown in two enlarged circles, one female and one male.' : 'A simple body outline showing the endocrine glands: 1 the pituitary gland under the brain, 2 the thyroid gland in the neck, 3 the adrenal glands on top of the kidneys, 4 the pancreas, 5 the ovaries in females and 6 the testes in males, shown in enlarged circles.'}
    labels={assessment ? undefined : glandKey.map(g => ({ mark: g.mark, name: g.name, detail: g.detail, active: all ? false : sel(g.id) }))}
    note="Original schematic, not to scale. Glands are drawn larger than life so they are easy to see.">
    {() => <>
      <path d={body} fill={skin} stroke={skinLine} strokeWidth="2" />
      <ellipse cx={300} cy={78} rx={40} ry={46} fill={skin} stroke={skinLine} strokeWidth="2" />
      <path d={blob(300, 66, 29, 22, 8, .06)} fill="#f4e6ea" stroke="#cfa9b6" strokeWidth="1.5" />
      {[[272, 276], [328, 276]].map(([x, y], i) => <path key={i} d={blob(x, y, 11, 17, 30 + i, .05)} fill="#f0d6cf" stroke="#c9a298" strokeWidth="1.5" opacity=".8" />)}
      <g opacity={op('pituitary')}><circle cx={300} cy={94} r={6.5} fill={fill('pituitary')} stroke={line('pituitary')} strokeWidth="2" /></g>
      <g opacity={op('thyroid')}><path d="M300 139Q296 130 288 131Q280 133 282 141Q284 148 292 147Q298 146 300 142Q302 146 308 147Q316 148 318 141Q320 133 312 131Q304 130 300 139Z" fill={fill('thyroid')} stroke={line('thyroid')} strokeWidth="2" /></g>
      <g opacity={op('adrenal')}>{[272, 328].map(x => <path key={x} d={`M${x - 11} 262Q${x - 8} 248 ${x} 246Q${x + 8} 248 ${x + 11} 262Q${x} 258 ${x - 11} 262Z`} fill={fill('adrenal')} stroke={line('adrenal')} strokeWidth="2" />)}</g>
      <g opacity={op('pancreas')}><path d="M282 230Q294 214 318 217Q338 213 354 206Q360 216 348 224Q328 232 306 236Q288 240 282 230Z" fill={fill('pancreas')} stroke={line('pancreas')} strokeWidth="2" /></g>
      <circle cx={300} cy={322} r={24} fill="none" stroke={muted} strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M277 330L160 372M323 330L440 372" stroke={muted} strokeWidth="1.3" strokeDasharray="4 4" />
      <g opacity={op('ovaries')}>
        <circle cx={100} cy={398} r={62} fill="white" stroke={muted} strokeWidth="1.5" />
        <g transform="translate(46 350) scale(.36)"><FemaleOrgans ovaryFill={fill('ovaries')} ovaryLine={line('ovaries')} /></g>
        {!assessment && <Text x={100} y={326} anchor="middle" size={13}>female</Text>}
      </g>
      <g opacity={op('testes')}>
        <circle cx={500} cy={398} r={62} fill="white" stroke={muted} strokeWidth="1.5" />
        <g transform="translate(464 360) scale(.36)"><MaleOrgans testisFill={fill('testes')} testisLine={line('testes')} /></g>
        {!assessment && <Text x={500} y={326} anchor="middle" size={13}>male</Text>}
      </g>
      <NumberBadge n="1" x={150} y={94} to={[292, 94]} />
      <NumberBadge n="2" x={450} y={139} to={[318, 139]} />
      <NumberBadge n="3" x={150} y={252} to={[262, 256]} />
      <NumberBadge n="4" x={450} y={206} to={[352, 210]} />
      <NumberBadge n="5" x={190} y={446} to={[138, 390]} />
      <NumberBadge n="6" x={410} y={446} to={[488, 420]} />
    </>}
  </AnatomyFigure>
}

// ---------- Female reproductive organs, front view (local box about 0–300 × 30–260) ----------
function FemaleOrgans({ ovaryFill = '#f5e1d0', ovaryLine = wallLine, thin = false, egg, cut = false, iud = false, diaphragm = false, dimOvaries = false, dimLining = false }:
  { ovaryFill?: string; ovaryLine?: string; thin?: boolean; egg?: 'ovary' | 'leaving' | 'tube' | 'none'; cut?: boolean; iud?: boolean; diaphragm?: boolean; dimOvaries?: boolean; dimLining?: boolean }) {
  const tube = (d: string) => <g><path d={d} stroke={wallLine} strokeWidth="12" fill="none" /><path d={d} stroke={wall} strokeWidth="8" fill="none" /></g>
  const left = 'M104 76C86 52 58 44 40 60C30 69 30 80 36 88', right = 'M196 76C214 52 242 44 260 60C270 69 270 80 264 88'
  const cavity = thin ? 'M118 80Q150 70 182 80Q182 110 156 158L144 158Q118 110 118 80Z' : 'M132 90Q150 84 168 90Q168 112 153 148L147 148Q132 112 132 90Z'
  return <g>
    {tube(left)}{tube(right)}
    <path d="M96 62Q150 36 204 62Q218 118 176 168L168 204L132 204L124 168Q82 118 96 62Z" fill={wall} stroke={wallLine} strokeWidth="2.4" />
    <g opacity={dimLining ? .45 : 1}>
      <path d="M110 70Q150 54 190 70Q194 112 160 162L140 162Q106 112 110 70Z" fill={liningFill} stroke={lining} strokeWidth="1.8" />
      {!thin && [[122, 82], [178, 82], [128, 116], [172, 116]].map(([x, y], i) => <path key={i} d={`M${x} ${y}q4 -6 8 0t8 0`} stroke={lining} strokeWidth="1.4" fill="none" transform={`translate(${i % 2 ? -8 : -4} 0)`} />)}
      <path d={cavity} fill="#fff8f7" stroke={lining} strokeWidth="1.2" />
    </g>
    <path d="M136 204L134 258M164 204L166 258" stroke={wallLine} strokeWidth="2.4" fill="none" />
    <path d="M136 204L134 258L166 258L164 204Z" fill={wall} />
    <path d="M150 170L150 256" stroke={wallLine} strokeWidth="1.2" strokeDasharray="3 4" />
    <g opacity={dimOvaries ? .45 : 1}>{[[44, 108], [256, 108]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y} rx={24} ry={15} fill={ovaryFill} stroke={ovaryLine} strokeWidth="2" />
      <circle cx={x - 9} cy={y - 2} r="3" fill={eggFill} stroke={eggLine} /><circle cx={x + 8} cy={y + 4} r="2.5" fill={eggFill} stroke={eggLine} /></g>)}</g>
    {egg === 'ovary' && <Egg x={48} y={106} r={7.5} />}
    {egg === 'leaving' && <><Egg x={38} y={84} r={7} /><path d="M44 100L40 92" stroke={eggLine} strokeWidth="1.5" /></>}
    {egg === 'tube' && <Egg x={66} y={52} r={7} />}
    {cut && [[70, 49], [230, 49]].map(([x, y], i) => <g key={i}><rect x={x - 5} y={y - 9} width={10} height={18} fill="white" /><path d={`M${x - 7} ${y - 8}L${x - 7} ${y + 8}M${x + 7} ${y - 8}L${x + 7} ${y + 8}`} stroke={ink} strokeWidth="3" /></g>)}
    {iud && <g stroke={copper} strokeWidth="3.5" fill="none"><path d="M150 96L150 142M130 98Q140 92 150 96Q160 92 170 98" /><path d="M146 110h8M146 118h8M146 126h8" strokeWidth="2" /><path d="M150 142L150 222" strokeWidth="1.2" /></g>}
    {diaphragm && <path d="M128 210Q150 224 172 210" stroke="#3b8ea0" strokeWidth="5" fill="none" />}
  </g>
}
// Male reproductive organs, simplified to the testes and sperm ducts (local box about 0–200 × 40–240).
function MaleOrgans({ testisFill = '#f5e1d0', testisLine = wallLine, cut = false, dimDucts = false }: { testisFill?: string; testisLine?: string; cut?: boolean; dimDucts?: boolean }) {
  const duct = (d: string) => <g><path d={d} stroke={wallLine} strokeWidth="9" fill="none" /><path d={d} stroke={wall} strokeWidth="5" fill="none" /></g>
  return <g>
    <g opacity={dimDucts ? .45 : 1}>
      {duct('M70 150C48 110 52 64 84 58C96 56 100 66 100 80')}
      {duct('M130 150C152 110 148 64 116 58C104 56 100 66 100 80')}
      {duct('M100 80L100 232')}
      {cut && [[56, 100], [144, 100]].map(([x, y], i) => <g key={i}><rect x={x - 8} y={y - 5} width={16} height={10} fill="white" /><path d={`M${x - 9} ${y - 7}L${x + 9} ${y - 7}M${x - 9} ${y + 7}L${x + 9} ${y + 7}`} stroke={ink} strokeWidth="3" /></g>)}
    </g>
    {[70, 130].map(x => <ellipse key={x} cx={x} cy={176} rx={20} ry={27} fill={testisFill} stroke={testisLine} strokeWidth="2" />)}
  </g>
}

// ---------- Lesson 38: nerves compared with hormones ----------
function Compare({ focus }: { focus: string }) {
  const stage = focus.replace('hormone-compare-', '')
  const top = stage === 'nerves' || stage === 'all', bottom = stage === 'hormones' || stage === 'all'
  const chip = (x: number, y: number, text: string, colour: string, fill: string) => <g><rect x={x} y={y - 17} width={150} height={26} rx={13} fill={fill} stroke={colour} strokeWidth="1.6" /><Text x={x + 75} y={y + 1} anchor="middle" size={14} bold colour={colour}>{text}</Text></g>
  return <Figure title={stage === 'nerves' ? 'Nerves: an electrical impulse travels along a neurone to one muscle. Nerves act very fast, for a very short time, on a precise area.' : stage === 'hormones' ? 'Hormones: a gland releases a hormone into the blood, which carries it to organs all over the body. Hormones act more slowly, for longer, and in a more general way.' : 'Nerves compared with hormones. Nerves: very fast, short time, precise area. Hormones: slower, longer time, more general.'}>
    <g opacity={top ? 1 : faded}>
      <Text x={20} y={32} bold colour={signal} size={15}>nerves</Text>
      <circle cx={52} cy={88} r={14} fill="#fbeccd" stroke={signal} strokeWidth="2" />
      <Arrow x1={66} y1={88} x2={258} y2={88} colour={signal} width={4} />
      <path d={blob(296, 88, 36, 22, 12, .06, .6)} fill="#e7aaa2" stroke="#a8605b" strokeWidth="2" />
      {[-8, 0, 8].map(d => <path key={d} d={`M270 ${88 + d}H322`} stroke="#a8605b" strokeWidth="1" opacity=".6" />)}
      {[100, 150, 200].map(x => <path key={x} d={`M${x} 72l8 8l-5 3l9 9`} stroke={signal} strokeWidth="2.4" fill="none" />)}
      <Lines x={52} y={124} lines={['neurone']} anchor="start" size={13} colour={muted} />
      <Text x={296} y={128} anchor="middle" size={13} colour={muted}>one muscle</Text>
      {chip(372, 48, 'very fast', signal, '#fbf1dc')}{chip(372, 84, 'very short time', signal, '#fbf1dc')}{chip(372, 120, 'precise area', signal, '#fbf1dc')}
    </g>
    <path d="M20 152H520" stroke={panelLine} strokeWidth="1.5" />
    <g opacity={bottom ? 1 : faded}>
      <Text x={20} y={180} bold colour={hormone} size={15}>hormones</Text>
      <path d={blob(52, 238, 26, 20, 3, .07)} fill={gland} stroke={glandLine} strokeWidth="2" />
      <Vessel x1={76} x2={340} y={238} h={26} />
      {[[128, 238], [196, 238], [262, 238]].map(([x, y], i) => <Hormone key={i} x={x} y={y} s={5} />)}
      {[[160, 196], [236, 196], [200, 282], [300, 280]].map(([x, y], i) => <g key={i}>
        <path d={`M${x} ${y < 238 ? 225 : 251}L${x} ${y < 238 ? y + 12 : y - 12}`} stroke={bloodLine} strokeWidth="3" />
        <path d={blob(x, y, 22, 12, 40 + i, .08)} fill={goodFill} stroke={good} strokeWidth="1.8" /><Hormone x={x} y={y} s={4} /></g>)}
      <Text x={52} y={276} anchor="middle" size={13} colour={muted}>gland</Text>
      {chip(372, 196, 'slower', hormone, hormoneSoft)}{chip(372, 232, 'longer time', hormone, hormoneSoft)}{chip(372, 268, 'more general', hormone, hormoneSoft)}
    </g>
  </Figure>
}

// Invented results for the "On your own" data question in Lesson 38.
function ResponseData() {
  const rows = [['A', 'about 0.2 seconds', 'about 1 second'], ['B', 'about 20 minutes', 'several hours']]
  return <Figure data viewBox="0 0 540 190" title="A results table for two responses in one person. Response A starts after about 0.2 seconds and lasts about 1 second. Response B starts after about 20 minutes and lasts several hours.">
    <Text x={20} y={26} bold>Two responses measured in one person</Text>
    <rect x={20} y={42} width={500} height={130} rx={10} fill={panel} stroke={panelLine} />
    <Text x={40} y={74} bold>response</Text><Text x={170} y={74} bold>starts after</Text><Text x={360} y={74} bold>lasts for</Text>
    <path d="M32 88H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map((row, i) => <g key={row[0]}><Text x={70} y={120 + i * 36} anchor="middle" bold>{row[0]}</Text><Text x={170} y={120 + i * 36}>{row[1]}</Text><Text x={360} y={120 + i * 36}>{row[2]}</Text></g>)}
  </Figure>
}

// ---------- Lesson 39: where blood glucose goes, and how insulin brings it down ----------
const glucoseSteps = [['glucose enters', 'the blood'], ['cells use glucose', 'for respiration'], ['pancreas detects', 'a high level'], ['pancreas', 'releases insulin'], ['glucose moves', 'into cells'], ['stored as', 'glycogen']]
const glucoseTitles: Record<string, string> = {
  meal: 'Step 1: after a meal with carbohydrates, glucose passes from the small intestine into the blood.',
  cells: 'Step 2: cells, such as muscle cells, take glucose from the blood and use it for respiration.',
  exercise: 'Step 2: during exercise, muscle cells take a lot more glucose from the blood.',
  pancreas: 'Step 3: the pancreas monitors the blood glucose level and detects when it is too high.',
  insulin: 'Step 4: the pancreas releases the hormone insulin into the blood.',
  'into-cells': 'Step 5: insulin makes glucose move from the blood into cells, such as liver and muscle cells.',
  glycogen: 'Step 6: in liver and muscle cells, glucose is turned into glycogen and stored.',
  all: 'Controlling blood glucose: glucose enters the blood from a meal; the pancreas detects the high level and releases insulin; glucose moves into liver and muscle cells and is stored as glycogen, so the level falls back.',
  question: 'The route of blood glucose, with four organs numbered 1 to 4: one above the blood vessel on the left, one above it on the right, one below it on the left and one below it on the right.',
}
function Gut({ x, y }: { x: number; y: number }) {
  const d = `M${x - 46} ${y - 22}C${x - 20} ${y - 40} ${x + 20} ${y - 40} ${x + 40} ${y - 22}C${x + 56} ${y - 8} ${x + 30} ${y + 6} ${x} ${y}C${x - 30} ${y - 6} ${x - 56} ${y + 8} ${x - 40} ${y + 22}C${x - 20} ${y + 38} ${x + 20} ${y + 34} ${x + 36} ${y + 26}`
  return <g><path d={d} stroke="#c98a79" strokeWidth="16" fill="none" /><path d={d} stroke="#f3cfc3" strokeWidth="11" fill="none" /></g>
}
function Muscle({ x, y, w = 110, h = 52 }: { x: number; y: number; w?: number; h?: number }) {
  return <g><path d={blob(x, y, w / 2, h / 2, 61, .04, .5)} fill="#e7aaa2" stroke="#a8605b" strokeWidth="2" />
    {[-14, -5, 4, 13].map(d => <path key={d} d={`M${x - w / 2 + 12} ${y + d}Q${x} ${y + d - 4} ${x + w / 2 - 12} ${y + d}`} stroke="#a8605b" strokeWidth="1" fill="none" opacity=".55" />)}</g>
}
function Pancreas({ x, y, s = 1, fill = '#f2d9c7', line = '#b88d72' }: { x: number; y: number; s?: number; fill?: string; line?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-52 10Q-40 -14 -8 -10Q20 -14 44 -22Q56 -12 44 0Q20 12 -10 14Q-40 22 -52 10Z" fill={fill} stroke={line} strokeWidth={2 / s} />
}
function GlucoseScene({ focus, assessment }: { focus: string; assessment: boolean }) {
  const stage = focus.replace('hormone-glucose-', '')
  const order = ['meal', 'cells', 'pancreas', 'insulin', 'into-cells', 'glycogen']
  const step = stage === 'exercise' ? 2 : order.indexOf(stage) + 1
  const question = stage === 'question'
  const upto = step || 6
  const on = (n: number | number[]) => question || step === 0 || (Array.isArray(n) ? n.includes(step) : step === n) ? 1 : faded
  const high = step >= 1 && step <= 4
  const inBlood: Pt[] = high ? [[40, 158], [66, 176], [96, 160], [124, 176], [150, 158], [178, 174], [206, 160], [236, 176], [262, 160], [290, 174], [318, 160]] : [[70, 167], [180, 167], [300, 167]]
  const stored = (step === 6 || step === 0) && !question
  return <Figure viewBox="0 0 540 320" title={glucoseTitles[stage] || glucoseTitles.all}>
    <Vessel x1={12} x2={352} y={167} h={40} />
    {!question && inBlood.map(([x, y], i) => <Glucose key={i} x={x} y={y} />)}
    <g opacity={on(1)}>
      <Gut x={86} y={62} />
      {!question && <><Arrow x1={86} y1={100} x2={86} y2={142} colour={amber} width={2.6} /><Glucose x={100} y={116} /></>}
      {!assessment && <Text x={86} y={20} anchor="middle" size={13} bold={step === 1}>small intestine</Text>}
    </g>
    <g opacity={on([2, 5, 6])}>
      <Muscle x={96} y={250} />
      {stored && [[70, 250], [118, 246]].map(([x, y], i) => <Glycogen key={i} x={x} y={y} />)}
      {!question && (step === 2 || step === 5 || step === 0) && <Arrow x1={96} y1={190} x2={96} y2={220} colour={amber} width={stage === 'exercise' ? 4.5 : 2.6} />}
      {stage === 'exercise' && <><Arrow x1={60} y1={190} x2={60} y2={222} colour={amber} width={4.5} /><Arrow x1={132} y1={190} x2={132} y2={222} colour={amber} width={4.5} /></>}
      {!assessment && <Text x={96} y={300} anchor="middle" size={13} bold={step === 2}>muscle</Text>}
      {stage === 'exercise' && <Lines x={146} y={206} lines={['exercise:', 'much more used']} size={12} bold colour={amber} />}
    </g>
    <g opacity={on([5, 6])}>
      <path d={blob(284, 82, 58, 34, 71, .06)} fill="#d9a092" stroke="#9c5a4f" strokeWidth="2.2" />
      {stored && [[262, 84], [304, 78]].map(([x, y], i) => <Glycogen key={i} x={x} y={y} />)}
      {!question && (step === 5 || step === 0) && <Arrow x1={284} y1={144} x2={284} y2={120} colour={amber} width={2.6} />}
      {!assessment && <Text x={284} y={34} anchor="middle" size={13} bold={step >= 5}>liver</Text>}
    </g>
    <g opacity={on([3, 4])}>
      <Pancreas x={262} y={256} />
      {step === 3 && <><circle cx={262} cy={220} r={14} fill="white" stroke={hormone} strokeWidth="2" /><Text x={262} y={225} anchor="middle" bold colour={hormone}>!</Text></>}
      {!question && (step === 4 || step === 0 || step >= 5) && <><Arrow x1={250} y1={236} x2={250} y2={192} colour={hormone} width={2.6} /><Hormone x={236} y={214} /></>}
      {!question && (step >= 4 || step === 0) && [[210, 168], [320, 168]].map(([x, y], i) => <Hormone key={i} x={x} y={y} />)}
      {!assessment && <Text x={262} y={300} anchor="middle" size={13} bold={step === 3 || step === 4}>pancreas</Text>}
    </g>
    {question && <><NumberBadge n="1" x={170} y={40} to={[128, 58]} /><NumberBadge n="2" x={372} y={60} to={[336, 76]} /><NumberBadge n="3" x={190} y={290} to={[146, 264]} /><NumberBadge n="4" x={352} y={272} to={[306, 240]} /></>}
    {!question && <Steps x={384} ys={[30, 80, 130, 180, 230, 280]} items={glucoseSteps} active={step} upto={upto} colour={stage === 'meal' || stage === 'cells' || stage === 'exercise' || stage === 'into-cells' || stage === 'glycogen' ? amber : hormone} />}
    {!question && <g transform="translate(140 100)" opacity={step === 0 || step === 4 ? 1 : 0}><Glucose x={6} y={6} /><Text x={18} y={11} size={12}>glucose</Text><Hormone x={6} y={28} /><Text x={18} y={33} size={12}>insulin</Text></g>}
  </Figure>
}

// ---------- Lesson 39: reading a glucose and insulin graph ----------
function curve(points: Pt[], sx: (t: number) => number, sy: (v: number) => number) {
  const p = points.map(([t, v]) => [sx(t), sy(v)] as Pt)
  let d = `M${r1(p[0][0])} ${r1(p[0][1])}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)]
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`
  }
  return d
}
const G0 = { left: 76, right: 500, top: 36, bottom: 236 }
const gx = (t: number) => G0.left + t * (G0.right - G0.left) / 180, gy = (v: number) => G0.bottom - v * (G0.bottom - G0.top) / 10
function Axes({ yLabel }: { yLabel: string }) {
  return <g>
    <path d={`M${G0.left} ${G0.top - 6}V${G0.bottom}H${G0.right + 6}`} stroke={ink} strokeWidth="2" fill="none" />
    {[0, 60, 120, 180].map(t => <g key={t}><path d={`M${gx(t)} ${G0.bottom}v6`} stroke={ink} /><Text x={gx(t)} y={G0.bottom + 22} anchor="middle" size={12}>{t}</Text></g>)}
    {[0, 2, 4, 6, 8, 10].map(v => <g key={v}><path d={`M${G0.left - 6} ${gy(v)}h6`} stroke={ink} /><Text x={G0.left - 10} y={gy(v) + 4} anchor="end" size={12}>{v}</Text></g>)}
    <Text x={(G0.left + G0.right) / 2} y={G0.bottom + 44} anchor="middle" size={13}>time after the meal (minutes)</Text>
    <text transform={`translate(22 ${(G0.top + G0.bottom) / 2}) rotate(-90)`} textAnchor="middle" fontSize="13" fill={ink}>{yLabel}</text>
  </g>
}
const glucoseLine: Pt[] = [[0, 4], [15, 6], [30, 8], [45, 7.3], [60, 6], [90, 4.8], [120, 4.2], [150, 4], [180, 4]]
const insulinLine: Pt[] = [[0, 1], [15, 1.4], [30, 3.2], [45, 5.4], [60, 6], [75, 5.3], [90, 4], [120, 2.1], [150, 1.3], [180, 1.1]]
function Graph({ focus }: { focus: string }) {
  const stage = focus.replace('hormone-graph-', '')
  const question = stage === 'question'
  const showGlucose = stage !== 'axes', showInsulin = stage === 'insulin' || question
  const titles: Record<string, string> = {
    axes: 'Empty axes for a graph. Time after the meal, 0 to 180 minutes, is on the horizontal axis. Concentration in the blood, in arbitrary units, is on the vertical axis. The meal is eaten at time 0.',
    glucose: 'The blood glucose line rises after the meal, peaks at about 30 minutes, then falls back to its starting level by about 120 minutes.',
    insulin: 'The insulin line starts to rise after glucose rises, peaks later at about 60 minutes, then falls as the glucose level falls.',
    question: 'A graph with two lines, labelled 1 and 2, showing concentrations in the blood after a meal. Line 1 peaks at about 30 minutes. Line 2 peaks later, at about 60 minutes.',
  }
  return <Figure data viewBox="0 0 540 300" title={titles[stage]}>
    <Axes yLabel="concentration in blood (a.u.)" />
    <Arrow x1={gx(0) + 18} y1={G0.top + 4} x2={gx(0) + 3} y2={G0.top + 24} colour={muted} width={2} />
    <Text x={gx(0) + 22} y={G0.top + 6} size={12} colour={muted}>meal eaten</Text>
    {showGlucose && <g opacity={stage === 'insulin' ? .6 : 1}>
      <path d={curve(glucoseLine, gx, gy)} stroke={question ? ink : amber} strokeWidth="3.5" fill="none" />
      {question ? <NumLabel n="1" x={gx(30) + 22} y={gy(8) - 8} /> : <Text x={gx(34) + 12} y={gy(8) - 4} bold colour={amber}>glucose</Text>}
    </g>}
    {showInsulin && <g>
      <path d={curve(insulinLine, gx, gy)} stroke={question ? ink : hormone} strokeWidth="3.5" fill="none" strokeDasharray={question ? '9 6' : undefined} />
      {question ? <NumLabel n="2" x={gx(66) + 20} y={gy(6) - 10} /> : <Text x={gx(64) + 10} y={gy(6) - 10} bold colour={hormone}>insulin</Text>}
    </g>}
  </Figure>
}
function NumLabel({ n, x, y }: { n: string; x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="12" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{n}</text></g>
}
function TwoPeople() {
  const a: Pt[] = [[0, 4], [30, 7], [60, 5.6], [90, 4.6], [120, 4.1], [150, 4], [180, 4]]
  const b: Pt[] = [[0, 5], [30, 8.2], [60, 9], [90, 8.7], [120, 8.1], [150, 7.6], [180, 7.3]]
  return <Figure data viewBox="0 0 540 300" title="A graph of blood glucose concentration for two people, A and B, after the same meal. Person A's glucose rises to 7 then falls back to 4 by about 120 minutes. Person B's glucose starts at 5, rises to 9 and is still above 7 at 180 minutes.">
    <Axes yLabel="blood glucose (a.u.)" />
    <path d={curve(a, gx, gy)} stroke={ink} strokeWidth="3.5" fill="none" />
    <path d={curve(b, gx, gy)} stroke={ink} strokeWidth="3.5" fill="none" strokeDasharray="9 6" />
    <Text x={gx(150)} y={gy(4) - 12} bold>person A</Text>
    <Text x={gx(150)} y={gy(7.6) - 14} bold>person B</Text>
  </Figure>
}

// ---------- Lesson 39: Type 1 and Type 2 diabetes ----------
function Diabetes({ focus }: { focus: string }) {
  const stage = focus.replace('hormone-diabetes-', '')
  const left = stage === 'what' || stage === 'type1' || stage === 'injection', right = stage === 'what' || stage === 'type2' || stage === 'type2-treat'
  const titles: Record<string, string> = {
    what: 'Diabetes: the blood glucose level is not controlled, so glucose stays high in the blood. There are two types.',
    type1: 'Type 1 diabetes: the pancreas makes too little insulin, or none, so glucose stays in the blood and does not move into cells.',
    injection: 'Type 1 diabetes is treated with insulin injections through the day.',
    type2: 'Type 2 diabetes: the pancreas still makes insulin, but the body cells do not respond to it properly, so glucose stays in the blood.',
    'type2-treat': 'Type 2 diabetes can be controlled with a carbohydrate-controlled diet and regular exercise.',
  }
  const Panel = ({ x, type }: { x: number; type: 1 | 2 }) => {
    const cx = x + 122
    return <g>
      <rect x={x} y={8} width={244} height={206} rx={12} fill={panel} stroke={panelLine} />
      <Text x={x + 14} y={32} bold size={15}>{`Type ${type}`}</Text>
      <Pancreas x={cx + 30} y={62} s={.72} />
      <Text x={cx + 30} y={96} anchor="middle" size={12} colour={muted}>pancreas</Text>
      {type === 1 ? <><Arrow x1={cx - 8} y1={74} x2={cx - 30} y2={112} colour={hormone} width={2} dashed /><Text x={x + 14} y={56} size={12} colour={hormone}>little or no</Text><Text x={x + 14} y={71} size={12} colour={hormone}>insulin</Text></>
        : <><Arrow x1={cx - 6} y1={74} x2={cx - 30} y2={116} colour={hormone} width={2.4} />{[[cx - 50, 128], [cx - 18, 124], [cx + 20, 130]].map(([hx, hy], i) => <Hormone key={i} x={hx} y={hy} s={5} />)}<Text x={x + 14} y={56} size={12} colour={hormone}>insulin made</Text></>}
      <path d={blob(cx, 170, 64, 30, 80 + type, .08)} fill="#fbeee6" stroke="#c9a48c" strokeWidth="2" />
      <Text x={cx} y={175} anchor="middle" size={12} colour={muted}>{type === 2 ? 'cell does not respond' : 'body cell'}</Text>
      {[[x + 22, 120], [x + 222, 126], [x + 26, 198], [x + 222, 196], [x + 40, 160], [x + 206, 160], [x + 64, 206], [x + 184, 206]].map(([gx2, gy2], i) => <Glucose key={i} x={gx2} y={gy2} />)}
      <Glucose x={x + 40} y={132} /><path d={`M${x + 48} 138L${x + 70} 152`} stroke={amber} strokeWidth="3" /><Cross x={x + 76} y={156} s={6} />
    </g>
  }
  const treat1 = stage === 'injection', treat2 = stage === 'type2-treat'
  return <Figure viewBox="0 0 540 300" title={titles[stage] || titles.what}>
    {stage === 'what' && <Text x={270} y={256} anchor="middle" size={14} bold>In both types, glucose stays high in the blood.</Text>}
    <g opacity={left ? 1 : faded}><Panel x={14} type={1} /></g>
    <g opacity={right ? 1 : faded}><Panel x={282} type={2} /></g>
    <g opacity={treat1 ? 1 : stage === 'what' || stage === 'type1' ? 0 : faded}>
      <g transform="translate(40 250)"><rect x={0} y={-8} width={70} height={16} rx={6} fill="#e3e7fa" stroke={hormone} strokeWidth="1.8" /><rect x={70} y={-4} width={14} height={8} fill="white" stroke={hormone} strokeWidth="1.5" /><path d="M84 0H100" stroke={muted} strokeWidth="2" /><rect x={-10} y={-5} width={10} height={10} rx={2} fill={hormone} /></g>
      <Lines x={152} y={246} lines={['insulin injections', 'through the day']} size={13} bold={treat1} />
    </g>
    <g opacity={treat2 ? 1 : stage === 'what' || stage === 'type2' ? 0 : faded}>
      <circle cx={306} cy={256} r={21} fill="white" stroke={muted} strokeWidth="2" /><path d="M306 256L306 240A16 16 0 0 1 322 256Z" fill={amberFill} stroke={amber} strokeWidth="1.5" /><path d="M306 256L322 256A16 16 0 1 1 306 240Z" fill={goodFill} stroke={good} strokeWidth="1.5" />
      <Lines x={332} y={246} lines={['carbohydrate-', 'controlled diet']} size={13} bold={treat2} />
      <path d="M450 262q2 -16 12 -18q6 6 14 4l14 8q8 3 8 10h-48z" fill="#dfe6ec" stroke={muted} strokeWidth="2" /><path d="M448 268h52" stroke={muted} strokeWidth="4" />
      <Text x={474} y={290} anchor="middle" size={13} bold={treat2}>exercise</Text>
    </g>
  </Figure>
}

// A hormone name tag: indigo pill with a diamond.
function Tag({ x, y, name, dim = false }: { x: number; y: number; name: string; dim?: boolean }) {
  const w = name.length * 8.4 + 34
  return <g opacity={dim ? faded : 1}><rect x={x} y={y - 15} width={w} height={26} rx={13} fill={hormoneSoft} stroke={hormone} strokeWidth="1.6" /><Hormone x={x + 15} y={y - 2} s={5} /><Text x={x + 27} y={y + 3} bold colour={hormone}>{name}</Text></g>
}
function Chip({ x, y, text, on = true, special = false }: { x: number; y: number; text: string; on?: boolean; special?: boolean }) {
  const w = text.length * 7.6 + 24
  return <g opacity={on ? 1 : faded}><rect x={x} y={y - 16} width={w} height={26} rx={8} fill={special ? '#fbe7ea' : panel} stroke={special ? lining : panelLine} strokeWidth="1.5" /><Text x={x + 12} y={y + 2} size={13}>{text}</Text></g>
}

// ---------- Lesson 40: puberty ----------
function Puberty({ focus }: { focus: string }) {
  const stage = focus.replace('hormone-puberty-', '')
  const male = stage !== 'oestrogen', female = stage !== 'testosterone'
  const effects = stage !== 'start', features = stage === 'features'
  const titles: Record<string, string> = {
    start: 'At puberty, the testes start releasing testosterone and the ovaries start releasing oestrogen. These are sex hormones.',
    features: 'Sex hormones cause secondary sexual characteristics, such as facial hair in males and breasts developing in females.',
    testosterone: 'Testosterone is made by the testes. It stimulates sperm production and causes facial hair to grow.',
    oestrogen: 'Oestrogen is made by the ovaries. It causes eggs to mature, is involved in the menstrual cycle, and causes breasts to develop.',
  }
  return <Figure viewBox="0 0 540 290" title={titles[stage]}>
    <g opacity={male ? 1 : faded}>
      <g transform="translate(24 20) scale(.42)"><MaleOrgans /></g>
      <Text x={66} y={134} anchor="middle" size={13}>testes</Text>
      <Arrow x1={116} y1={80} x2={146} y2={80} colour={hormone} width={2.4} />
      <Tag x={152} y={82} name="testosterone" />
      <Arrow x1={296} y1={80} x2={318} y2={80} colour={muted} width={2} />
      <Chip x={326} y={62} text="sperm production" on={effects && !features} />
      <Chip x={326} y={100} text="facial hair grows" on={effects} special={features} />
    </g>
    <path d="M20 150H520" stroke={panelLine} strokeWidth="1.5" />
    <g opacity={female ? 1 : faded}>
      <g transform="translate(20 150) scale(.3)"><FemaleOrgans /></g>
      <Text x={64} y={256} anchor="middle" size={13}>ovaries</Text>
      <Arrow x1={116} y1={204} x2={146} y2={204} colour={hormone} width={2.4} />
      <Tag x={152} y={206} name="oestrogen" />
      <Arrow x1={272} y1={204} x2={318} y2={204} colour={muted} width={2} />
      <Chip x={326} y={172} text="eggs mature" on={effects && !features} />
      <Chip x={326} y={208} text="menstrual cycle" on={effects && !features} />
      <Chip x={326} y={244} text="breasts develop" on={effects} special={features} />
    </g>
    {features && <Text x={20} y={282} size={13} colour={lining} bold>pink = secondary sexual characteristics</Text>}
  </Figure>
}

// ---------- Lesson 40: the menstrual cycle timeline (uterus lining over about 28 days) ----------
const dx = (d: number) => 40 + (d - 1) * 14.6
const BASE = 236
function thick(d: number) {
  if (d <= 4) return 36 - (d - 1) * 9
  if (d <= 14) return 9 + (d - 4) * 7.1
  if (d <= 28) return 80 + (d - 14) * .8
  if (d <= 29) return 91 - (d - 28) * 55
  return Math.max(9, 36 - (d - 29) * 9)
}
function liningPath() {
  const pts: Pt[] = []
  for (let d = 1; d <= 32.4; d += .4) {
    const ragged = d <= 4.2 || d >= 28.6
    const wobble = ragged ? (Math.round(d * 2.5) % 2 ? 5 : -3) : Math.sin(d * 2.2) * 2
    pts.push([dx(d), BASE - thick(d) - wobble])
  }
  return `M${dx(1)} ${BASE}` + pts.map(([x, y]) => `L${r1(x)} ${r1(y)}`).join('') + `L${r1(dx(32.4))} ${BASE}Z`
}
const cycleCaptions: Record<string, string> = {
  stage1: 'Stage 1 (days 1–4): the lining breaks down. This is a period.',
  stage2: 'Stage 2: the lining builds up into a thick, spongy layer.',
  stage3: 'Stage 3 (about day 14): an egg is released. This is ovulation.',
  stage4: 'Stage 4: the lining is kept thick. No fertilised egg? It breaks down.',
  all: '1 lining breaks down · 2 builds up · 3 egg released · 4 kept thick',
  intro: 'One menstrual cycle lasts about 28 days.',
  natural: 'Natural methods: avoid intercourse around the time of ovulation.',
  letters: '',
}
function Cycle({ focus }: { focus: string }) {
  const stage = focus.replace('hormone-cycle-', '')
  const letters = stage === 'letters', natural = stage === 'natural'
  const active = ({ stage1: 1, stage2: 2, stage3: 3, stage4: 4 } as Record<string, number>)[stage] || 0
  const bands = [{ n: 1, from: 1, to: 4.5, fill: '#fbe3e5' }, { n: 2, from: 4.5, to: 13.5, fill: '#eef1fb' }, { n: 3, from: 13.5, to: 14.5, fill: '#fff1cf' }, { n: 4, from: 14.5, to: 28.5, fill: '#e8f4ec' }]
  const op = (n: number) => active === 0 || active === n ? 1 : .35
  const titles: Record<string, string> = {
    stage1: 'A timeline of the uterus lining over about 28 days. Stage 1, days 1 to 4: the lining breaks down and leaves the body. This is a period, or menstruation.',
    stage2: 'Stage 2, from about day 4 to day 14: the lining builds up again into a thick, spongy layer full of blood vessels.',
    stage3: 'Stage 3, about day 14: an egg is released from an ovary. This is ovulation.',
    stage4: 'Stage 4, about day 14 to day 28: the lining is kept thick. If no fertilised egg has settled in the lining by day 28, it breaks down and the cycle starts again.',
    intro: 'A timeline of the thickness of the uterus lining over one menstrual cycle of about 28 days, split into four stages, with the start of the next cycle.',
    all: 'The whole menstrual cycle: stage 1 the lining breaks down, stage 2 it builds up, stage 3 an egg is released at about day 14, stage 4 the lining is kept thick until about day 28.',
    natural: 'The menstrual cycle timeline with the days around ovulation shaded. Natural methods avoid intercourse at this time, when an egg may be in the oviduct.',
    letters: 'A timeline of the uterus lining over about 28 days, with four points marked A, B, C and D. A is at about day 2, B at about day 9, C at day 14 and D at about day 21.',
  }
  const vessels = [7, 10, 16, 19, 22, 25].map(d => <path key={d} d={`M${dx(d)} ${BASE - 2}q4 -${thick(d) * .35} 0 -${thick(d) * .6}t0 -${thick(d) * .25}`} stroke={lining} strokeWidth="1.3" fill="none" opacity=".7" />)
  return <Figure viewBox="0 0 540 300" title={titles[stage]}>
    {!letters && <text x={270} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{cycleCaptions[stage]}</text>}
    {bands.map(b => <rect key={b.n} x={dx(b.from)} y={62} width={dx(b.to) - dx(b.from)} height={BASE - 62} fill={b.fill} opacity={letters || natural ? .5 : op(b.n)} />)}
    <rect x={dx(28.5)} y={62} width={dx(32.6) - dx(28.5)} height={BASE - 62} fill="#fbe3e5" opacity=".35" />
    {!letters && <Text x={(dx(28.5) + dx(32.6)) / 2} y={80} anchor="middle" size={12} colour={muted}>next</Text>}
    {natural && <><rect x={dx(10.5)} y={62} width={dx(17.5) - dx(10.5)} height={BASE - 62} fill="#fff1cf" stroke={eggLine} strokeDasharray="5 4" /><Lines x={dx(14)} y={80} lines={['most likely', 'to get pregnant']} anchor="middle" size={12} bold colour="#8a6a1e" /></>}
    <path d={liningPath()} fill={liningFill} stroke={lining} strokeWidth="2" />
    {vessels}
    {[[dx(2), BASE - 50], [dx(3.2), BASE - 40], [dx(1.6), BASE - 58], [dx(30), BASE - 48], [dx(31), BASE - 38]].map(([x, y], i) => <path key={i} d={blob(x, y, 3.2, 2.4, 50 + i, .2)} fill={lining} opacity={active === 1 || active === 0 || natural ? .9 : .4} />)}
    <g opacity={active === 3 || active === 0 || letters || natural ? 1 : .35}>
      <Egg x={dx(14)} y={BASE - 118} r={9} />
      <Arrow x1={dx(14)} y1={BASE - 88} x2={dx(14)} y2={BASE - 106} colour={eggLine} width={2} />
      {!letters && !natural && <Text x={dx(14) + 14} y={BASE - 114} size={12} bold={active === 3}>egg released</Text>}
    </g>
    {!letters && !natural && bands.map(b => <g key={b.n} opacity={op(b.n)}><circle cx={(dx(b.from) + dx(b.to)) / 2} cy={80} r={12} fill={active === b.n ? lining : 'white'} stroke={ink} strokeWidth="2" /><text x={(dx(b.from) + dx(b.to)) / 2} y={85} textAnchor="middle" fontSize="14" fontWeight="700" fill={active === b.n ? 'white' : ink}>{b.n}</text></g>)}
    {letters && ([['A', 2], ['B', 9], ['C', 14], ['D', 21]] as const).map(([l, d]) => <g key={l}><path d={`M${dx(d)} 88L${dx(d)} ${l === 'C' ? BASE - 130 : BASE - thick(d) - 6}`} stroke={muted} strokeWidth="1.5" /><circle cx={dx(d)} cy={76} r={13} fill="white" stroke={ink} strokeWidth="2" /><text x={dx(d)} y={81} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{l}</text></g>)}
    <path d={`M${dx(1)} 56V${BASE}H${dx(32.6) + 8}`} stroke={ink} strokeWidth="2" fill="none" />
    <path d={`M${dx(1) - 5} 62L${dx(1)} 54L${dx(1) + 5} 62`} stroke={ink} strokeWidth="2" fill="none" />
    {([[1, '1'], [4, '4'], [14, '14'], [28, '28'], [29, '1'], [32, '4']] as const).map(([d, t]) => <g key={d}><path d={`M${dx(d)} ${BASE}v6`} stroke={ink} /><Text x={dx(d)} y={BASE + 20} anchor="middle" size={12}>{t}</Text></g>)}
    <Text x={dx(14)} y={BASE + 42} anchor="middle" size={13}>day of the cycle</Text>
    <text transform={`translate(24 ${(62 + BASE) / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill={ink}>lining thickness</text>
  </Figure>
}

// ---------- Lessons 40–41: the female reproductive organs, with hormones or contraception ----------
function Organs({ focus, assessment }: { focus: string; assessment: boolean }) {
  const stage = focus.replace('hormone-organs-', '')
  const T = (x: number, y: number): Pt => [120 + x, 12 + y]
  const titles: Record<string, string> = {
    fsh: 'Front view of the female reproductive organs. FSH causes an egg to mature in one of the ovaries.',
    lh: 'LH causes the mature egg to be released from the ovary into the oviduct. This is ovulation.',
    lining: 'Oestrogen and progesterone make the uterus lining grow and keep it thick.',
    hormones: 'All four hormones: FSH makes an egg mature, LH makes the egg be released, and oestrogen and progesterone grow and maintain the uterus lining.',
    question: 'Front view of the female reproductive organs with four parts numbered 1 to 4.',
    abstinence: 'Abstinence: with no intercourse, sperm never reach the egg in the oviduct. This is the only way to be sure of avoiding pregnancy.',
  }
  const egg = stage === 'fsh' ? 'ovary' : stage === 'lh' || stage === 'hormones' ? 'leaving' : stage === 'abstinence' ? 'tube' : 'none'
  const ring = (p: Pt, r: number) => <circle cx={p[0]} cy={p[1]} r={r} fill="none" stroke={hormone} strokeWidth="2" strokeDasharray="4 4" />
  return <Figure viewBox="0 0 540 290" title={titles[stage]}>
    <g transform="translate(120 12)"><FemaleOrgans egg={egg as 'ovary'} thin={stage === 'fsh' || stage === 'lh'} dimLining={stage === 'fsh' || stage === 'lh'} dimOvaries={stage === 'lining'} /></g>
    {!assessment && stage !== 'question' && <g>
      <Label x={20} y={60} lines={['oviduct']} to={T(40, 60)} />
      <Label x={20} y={140} lines={['ovary']} to={T(28, 112)} />
      <Label x={520} y={170} lines={['uterus']} anchor="end" to={T(188, 140)} />
    </g>}
    {stage === 'fsh' && <>{ring(T(48, 106), 16)}<Tag x={14} y={224} name="FSH" /><Lines x={14} y={254} lines={['an egg matures', 'in an ovary']} size={13} /></>}
    {stage === 'lh' && <>{ring(T(38, 84), 14)}<Tag x={14} y={224} name="LH" /><Lines x={14} y={254} lines={['the egg is released:', 'ovulation']} size={13} /></>}
    {stage === 'lining' && <><Tag x={384} y={200} name="oestrogen" /><Tag x={384} y={234} name="progesterone" /><Lines x={386} y={268} lines={['lining grows and', 'is kept thick']} size={13} anchor="start" /><path d={`M${T(166, 118)[0]} ${T(166, 118)[1]}L382 194`} stroke={ink} strokeWidth="1.5" /><circle cx={T(166, 118)[0]} cy={T(166, 118)[1]} r="2.5" fill={ink} /></>}
    {stage === 'hormones' && <><Tag x={14} y={224} name="FSH" /><Tag x={82} y={258} name="LH" /><Tag x={384} y={200} name="oestrogen" /><Tag x={384} y={234} name="progesterone" /></>}
    {stage === 'abstinence' && <><Lines x={14} y={230} lines={['no intercourse:', 'sperm never', 'reach the egg']} size={13} bold /></>}
    {stage === 'question' && <><NumberBadge n="1" x={40} y={170} to={T(26, 112)} /><NumberBadge n="2" x={60} y={36} to={T(56, 48)} /><NumberBadge n="3" x={500} y={120} to={T(200, 100)} /><NumberBadge n="4" x={470} y={250} to={T(166, 240)} /></>}
  </Figure>
}

// ---------- Lesson 41: hormonal methods (cards on the left, their effect on the right) ----------
function PillIcon({ x, y }: { x: number; y: number }) {
  return <g><rect x={x} y={y} width={46} height={28} rx={5} fill="#eef1f4" stroke={muted} strokeWidth="1.6" />{[0, 1, 2, 3].map(i => [0, 1].map(j => <circle key={`${i}${j}`} cx={x + 8 + i * 10} cy={y + 8 + j * 12} r={3.4} fill={hormoneSoft} stroke={hormone} strokeWidth="1.2" />))}</g>
}
function ArmIcon({ x, y, item }: { x: number; y: number; item: 'rod' | 'patch' }) {
  return <g><rect x={x} y={y + 4} width={48} height={22} rx={11} fill={skin} stroke={skinLine} strokeWidth="1.6" />
    {item === 'rod' ? <path d={`M${x + 12} ${y + 16}H${x + 36}`} stroke={hormone} strokeWidth="3.5" /> : <rect x={x + 14} y={y + 5} width={20} height={20} rx={4} fill="#f4dcd7" stroke={hormone} strokeWidth="1.6" />}</g>
}
function SyringeIcon({ x, y }: { x: number; y: number }) {
  return <g><rect x={x + 6} y={y + 9} width={28} height={12} rx={3} fill={hormoneSoft} stroke={hormone} strokeWidth="1.6" /><path d={`M${x} ${y + 15}H${x + 6}M${x} ${y + 9}V${y + 21}M${x + 34} ${y + 15}H${x + 48}`} stroke={muted} strokeWidth="2" /></g>
}
function IudIcon({ x, y }: { x: number; y: number }) {
  return <g stroke={copper} strokeWidth="3" fill="none"><path d={`M${x + 24} ${y + 4}V${y + 26}M${x + 10} ${y + 6}Q${x + 17} ${y + 1} ${x + 24} ${y + 4}Q${x + 31} ${y + 1} ${x + 38} ${y + 6}`} /></g>
}
function CondomIcon({ x, y }: { x: number; y: number }) {
  return <g><rect x={x + 8} y={y} width={32} height={30} rx={4} fill="#eef1f4" stroke={muted} strokeWidth="1.6" /><circle cx={x + 24} cy={y + 15} r={9} fill="none" stroke={muted} strokeWidth="1.6" strokeDasharray="3 2" /></g>
}
function DiaphragmIcon({ x, y }: { x: number; y: number }) {
  return <g><ellipse cx={x + 24} cy={y + 14} rx={20} ry={8} fill="#dff1f4" stroke="#3b8ea0" strokeWidth="2" /><path d={`M${x + 4} ${y + 14}Q${x + 24} ${y + 30} ${x + 44} ${y + 14}`} fill="#dff1f4" stroke="#3b8ea0" strokeWidth="2" /></g>
}
function SpermicideIcon({ x, y }: { x: number; y: number }) {
  return <g><rect x={x + 14} y={y} width={20} height={30} rx={5} fill="#e9f3dc" stroke="#6f9a45" strokeWidth="1.6" /><rect x={x + 18} y={y - 5} width={12} height={6} rx={2} fill="#6f9a45" /></g>
}
const spermicide = '#6f9a45'
type Card = { id: string; name: string; detail: string; icon: (x: number, y: number) => ReactNode }
function Cards({ cards, active, top = 10, gap = 56 }: { cards: Card[]; active: string | string[]; top?: number; gap?: number }) {
  const is = (id: string) => Array.isArray(active) ? active.includes(id) : active === id
  return <g>{cards.map((c, i) => {
    const y = top + i * gap, on = active === 'all' || is(c.id)
    return <g key={c.id} opacity={on ? 1 : .4}>
      <rect x={8} y={y} width={214} height={gap - 6} rx={10} fill={is(c.id) ? hormoneSoft : panel} stroke={is(c.id) ? hormone : panelLine} strokeWidth={is(c.id) ? 2 : 1.3} />
      {c.icon(18, y + (gap - 6) / 2 - 15)}
      <Text x={76} y={y + (gap - 6) / 2 - 3} bold size={14}>{c.name}</Text>
      <Text x={76} y={y + (gap - 6) / 2 + 14} size={12} colour={muted}>{c.detail}</Text>
    </g>
  })}</g>
}
const hormonalCards: Card[] = [
  { id: 'pill', name: 'the pill', detail: 'one taken each day', icon: (x, y) => <PillIcon x={x} y={y + 1} /> },
  { id: 'implant', name: 'implant', detail: 'under skin, 3 years', icon: (x, y) => <ArmIcon x={x} y={y} item="rod" /> },
  { id: 'patch', name: 'patch', detail: 'on the skin, 1 week', icon: (x, y) => <ArmIcon x={x} y={y} item="patch" /> },
  { id: 'injection', name: 'injection', detail: 'lasts 2 to 3 months', icon: (x, y) => <SyringeIcon x={x} y={y} /> },
  { id: 'iud', name: 'IUD or IUS', detail: 'placed in the uterus', icon: (x, y) => <IudIcon x={x} y={y} /> },
]
function Methods({ focus }: { focus: string }) {
  const stage = focus.replace('hormone-method-', '')
  const noEgg = ['pill', 'implant', 'patch', 'injection', 'patch-injection'].includes(stage)
  const active = stage === 'patch-injection' ? 'patch' : stage === 'fertility' ? 'none' : stage
  const P = (x: number, y: number): Pt => [250 + x * .92, 34 + y * .92]
  const titles: Record<string, string> = {
    fertility: 'Pregnancy can happen if a sperm reaches an egg in the oviduct. Contraception stops this happening.',
    pill: 'The pill contains hormones. It stops FSH being released, so no eggs mature in the ovaries.',
    implant: 'An implant is a small rod under the skin of the arm. It slowly releases progesterone, which stops eggs maturing or being released.',
    'patch-injection': 'A patch on the skin and an injection also release hormones that stop eggs maturing or being released.',
    iud: 'An IUD is a small T-shaped device placed inside the uterus. It stops a fertilised egg implanting in the uterus wall.',
  }
  const caption = stage === 'fertility' ? ['sperm reaches the egg:', 'pregnancy can start'] : stage === 'pill' ? ['no FSH released:', 'no egg matures'] : noEgg ? ['no egg matures', 'or is released'] : ['stops a fertilised', 'egg implanting']
  return <Figure viewBox="0 0 540 300" title={titles[stage] || titles.fertility}>
    <Cards cards={hormonalCards} active={stage === 'patch-injection' ? ['patch', 'injection'] : active} />
    <g transform="translate(250 34) scale(.92)"><FemaleOrgans egg={stage === 'fertility' ? 'tube' : 'none'} iud={stage === 'iud'} /></g>
    {stage === 'fertility' && <>{([[150, 246, -90], [150, 212, -90], [150, 150, -95], [140, 104, -120], [116, 84, -145], [90, 64, -160]] as const).map(([x, y, a], i) => { const [px, py] = P(x, y); return <Sperm key={i} x={px} y={py} angle={a} /> })}</>}
    {noEgg && [P(44, 108), P(256, 108)].map(([x, y], i) => <Cross key={i} x={x} y={y} s={9} />)}
    <Lines x={528} y={22} lines={caption} anchor="end" size={13} bold />
  </Figure>
}

// ---------- Lesson 41: barrier methods ----------
const barrierCards: Card[] = [
  { id: 'condom', name: 'condoms', detail: 'male or female', icon: (x, y) => <CondomIcon x={x} y={y} /> },
  { id: 'diaphragm', name: 'diaphragm', detail: 'covers the entrance', icon: (x, y) => <DiaphragmIcon x={x} y={y} /> },
  { id: 'spermicide', name: 'spermicide', detail: 'kills or disables', icon: (x, y) => <SpermicideIcon x={x} y={y + 2} /> },
]
function Barrier({ focus }: { focus: string }) {
  const stage = focus.replace('hormone-barrier-', '')
  const P = (x: number, y: number): Pt => [250 + x * .9, 26 + y * .9]
  const titles: Record<string, string> = {
    condom: 'Barrier methods stop sperm reaching an egg. A condom is a barrier that stops sperm getting into the vagina.',
    sti: 'Condoms are the only method of contraception that also protects against sexually transmitted infections.',
    diaphragm: 'A diaphragm is a shallow cup that covers the entrance to the uterus, so sperm cannot get into the uterus.',
    spermicide: 'Spermicide is a chemical that kills or disables sperm. It is used with a diaphragm.',
  }
  const card = stage === 'sti' ? 'condom' : stage
  const blockY = stage === 'diaphragm' || stage === 'spermicide' ? 232 : 272
  const caption = stage === 'condom' ? ['a barrier:', 'sperm cannot get in'] : stage === 'sti' ? ['also protects', 'against STIs'] : stage === 'diaphragm' ? ['sperm cannot get', 'into the uterus'] : ['sperm are killed', 'or disabled']
  return <Figure viewBox="0 0 540 300" title={titles[stage]}>
    <Cards cards={barrierCards} active={card} top={20} gap={90} />
    <g transform="translate(250 26) scale(.9)"><FemaleOrgans egg="tube" diaphragm={stage === 'diaphragm' || stage === 'spermicide'} /></g>
    {stage === 'condom' || stage === 'sti' ? <><path d={`M${P(120, 264)[0]} ${P(120, 264)[1]}H${P(180, 264)[0]}`} stroke={ink} strokeWidth="4" />{[[132, 282], [150, 286], [168, 280]].map(([x, y], i) => { const [px, py] = P(x, y); return <Sperm key={i} x={px} y={py - 8} angle={-90} s={.9} /> })}</>
      : [[140, blockY + 12], [152, blockY + 20], [162, blockY + 10]].map(([x, y], i) => { const [px, py] = P(x, y); return <Sperm key={i} x={px} y={py} angle={-90} s={.9} opacity={stage === 'spermicide' ? .45 : 1} /> })}
    {stage === 'spermicide' && [[138, 226], [158, 230], [146, 244], [164, 248], [136, 250]].map(([x, y], i) => { const [px, py] = P(x, y); return <circle key={i} cx={px} cy={py} r={3.2} fill="#cfe5b8" stroke={spermicide} strokeWidth="1.2" /> })}
    {stage === 'spermicide' && <Cross x={P(152, 238)[0] + 22} y={P(152, 238)[1]} s={6} />}
    {stage === 'sti' && <g transform="translate(372 34) scale(.8)"><path d="M0 -18l18 7v14c0 13 -9 21 -18 25c-9 -4 -18 -12 -18 -25v-14z" fill={goodFill} stroke={good} strokeWidth="2" /><path d="M-7 3l5 6l10 -12" stroke={good} strokeWidth="3" fill="none" /></g>}
    <Lines x={528} y={20} lines={caption} anchor="end" size={13} bold />
  </Figure>
}

// ---------- Lesson 41: sterilisation ----------
function Sterile({ focus }: { focus: string }) {
  const stage = focus.replace('hormone-sterile-', '')
  const female = stage === 'female', male = stage === 'male'
  return <Figure viewBox="0 0 540 300" title={female ? 'Female sterilisation: the oviducts are cut or tied, so eggs and sperm cannot meet. It is permanent.' : 'Male sterilisation: the sperm ducts, which carry sperm from the testes towards the penis, are cut or tied. It is permanent.'}>
    <g opacity={female ? 1 : faded}>
      <Text x={20} y={26} bold size={15}>female</Text>
      <g transform="translate(14 36) scale(.72)"><FemaleOrgans cut egg="none" /></g>
      <Label x={96} y={26} lines={['oviducts cut or tied']} to={[180, 66]} />
    </g>
    <path d="M262 20V280" stroke={panelLine} strokeWidth="1.5" />
    <g opacity={male ? 1 : faded}>
      <Text x={290} y={26} bold size={15}>male</Text>
      <g transform="translate(320 16) scale(.95)"><MaleOrgans cut /></g>
      <Label x={290} y={70} lines={['sperm ducts', 'cut or tied']} to={[372, 109]} />
      <Label x={520} y={268} lines={['testes']} anchor="end" to={[462, 208]} />
      <Arrow x1={415} y1={240} x2={415} y2={278} colour={muted} width={2} />
      <Text x={426} y={286} size={12} colour={muted}>to the penis</Text>
    </g>
  </Figure>
}

// ---------- Lesson 41: weighing up methods ----------
type Point = [ '+' | '−', string ]
function ProsCons({ x, name, points }: { x: number; name: string; points: Point[] }) {
  return <g>
    <rect x={x} y={12} width={250} height={276} rx={12} fill={panel} stroke={panelLine} />
    <Text x={x + 16} y={40} bold size={15}>{name}</Text>
    {points.map(([sign, text], i) => <g key={i}>
      <circle cx={x + 26} cy={74 + i * 52} r={11} fill={sign === '+' ? goodFill : '#fbe3e5'} stroke={sign === '+' ? good : red} strokeWidth="1.8" />
      <text x={x + 26} y={79 + i * 52} textAnchor="middle" fontSize="16" fontWeight="700" fill={sign === '+' ? good : red}>{sign}</text>
      <Lines x={x + 46} y={72 + i * 52} lines={text.split('|')} size={13} />
    </g>)}
  </g>
}
function Weigh({ focus }: { focus: string }) {
  const stage = focus.replace('hormone-weigh-', '')
  if (stage === 'criteria') {
    const qs = ['How well does it work?', 'How often must you think about it?', 'Can it cause side effects?', 'Does it protect against STIs?', 'Can it be stopped or reversed?']
    return <Figure viewBox="0 0 540 300" title="Five questions to ask when weighing up a method: how well it works, how often you must think about it, side effects, protection against sexually transmitted infections, and whether it can be stopped or reversed.">
      <Text x={270} y={28} anchor="middle" bold size={15}>Questions to weigh up a method</Text>
      {qs.map((q, i) => <g key={q}><rect x={70} y={46 + i * 48} width={400} height={38} rx={10} fill={panel} stroke={panelLine} /><circle cx={94} cy={65 + i * 48} r={12} fill="white" stroke={ink} strokeWidth="2" /><text x={94} y={70 + i * 48} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>?</text><Text x={116} y={70 + i * 48}>{q}</Text></g>)}
    </Figure>
  }
  const hormonal = stage === 'hormonal'
  const a: [string, Point[]] = hormonal ? ['the pill', [['+', 'over 99% effective'], ['−', 'must be taken|every day'], ['−', 'side effects, such as|headaches or feeling sick'], ['−', 'no protection|against STIs']]]
    : ['condoms', [['+', 'protect against STIs'], ['+', 'no hormones,|so no hormone side effects'], ['−', 'must be used|every time']]]
  const b: [string, Point[]] = hormonal ? ['implant', [['+', 'lasts 3 years'], ['+', 'nothing to remember|each day'], ['−', 'hormones can cause|side effects'], ['−', 'no protection|against STIs']]]
    : ['sterilisation', [['+', 'nothing to remember'], ['−', 'permanent: lasts|for life'], ['−', 'needs an operation'], ['−', 'no protection|against STIs']]]
  return <Figure viewBox="0 0 540 300" title={`Pros and cons. ${a[0]}: ${a[1].map(p => `${p[0] === '+' ? 'pro' : 'con'}, ${p[1].replace('|', ' ')}`).join('; ')}. ${b[0]}: ${b[1].map(p => `${p[0] === '+' ? 'pro' : 'con'}, ${p[1].replace('|', ' ')}`).join('; ')}.`}>
    <ProsCons x={14} name={a[0]} points={a[1]} />
    <ProsCons x={276} name={b[0]} points={b[1]} />
  </Figure>
}

// Invented data for Lesson 40: one person's cycle lengths over four months.
function CycleLengths() {
  const rows: [string, number][] = [['January', 27], ['February', 29], ['March', 28], ['April', 30]]
  const x0 = 250, scale = 8
  return <Figure data viewBox="0 0 540 230" title="A table and bar chart of one person's menstrual cycle lengths over four months: January 27 days, February 29 days, March 28 days and April 30 days.">
    <Text x={20} y={26} bold>Length of one person’s cycle (days)</Text>
    {rows.map(([m, d], i) => <g key={m}>
      <Text x={20} y={70 + i * 40}>{m}</Text>
      <rect x={x0 - 130} y={52 + i * 40} width={d * scale} height={24} rx={4} fill={liningFill} stroke={lining} strokeWidth="1.5" />
      <Text x={x0 - 130 + d * scale + 10} y={70 + i * 40} bold>{`${d} days`}</Text>
    </g>)}
    <path d={`M${x0 - 130} 44V214`} stroke={ink} strokeWidth="1.5" />
    <Text x={x0 - 130} y={226} size={12} colour={muted}>0 days</Text>
  </Figure>
}

// Summary table: how long one dose lasts (durations as given in the spec-level sources, not invented).
function DoseData() {
  const rows = [['pill', 'one day (one pill each day)'], ['patch', 'one week'], ['injection', '2 to 3 months'], ['implant', 'about 3 years']]
  return <Figure data="Summary table." viewBox="0 0 540 230" title="A table of how long one dose lasts for four hormonal methods: the pill, one day; the patch, one week; the injection, 2 to 3 months; the implant, about 3 years.">
    <Text x={20} y={26} bold>How long one dose lasts</Text>
    <rect x={20} y={40} width={500} height={176} rx={10} fill={panel} stroke={panelLine} />
    <Text x={40} y={70} bold>method</Text><Text x={200} y={70} bold>one dose lasts</Text>
    <path d="M32 84H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map((row, i) => <g key={row[0]}><Text x={40} y={114 + i * 30}>{row[0]}</Text><Text x={200} y={114 + i * 30}>{row[1]}</Text></g>)}
  </Figure>
}

export function HormoneVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus.startsWith('hormone-route-')) return <Route focus={focus} />
  if (focus.startsWith('hormone-glands-')) return <Glands focus={focus} assessment={assessment} />
  if (focus.startsWith('hormone-compare-')) return <Compare focus={focus} />
  if (focus === 'hormone-response-data') return <ResponseData />
  if (focus.startsWith('hormone-glucose-')) return <GlucoseScene focus={focus} assessment={assessment} />
  if (focus.startsWith('hormone-graph-')) return <Graph focus={focus} />
  if (focus === 'hormone-two-people') return <TwoPeople />
  if (focus.startsWith('hormone-diabetes-')) return <Diabetes focus={focus} />
  if (focus.startsWith('hormone-puberty-')) return <Puberty focus={focus} />
  if (focus === 'hormone-cycle-lengths') return <CycleLengths />
  if (focus.startsWith('hormone-cycle-')) return <Cycle focus={focus} />
  if (focus.startsWith('hormone-organs-')) return <Organs focus={focus} assessment={assessment} />
  if (focus.startsWith('hormone-method-')) return <Methods focus={focus} />
  if (focus.startsWith('hormone-barrier-')) return <Barrier focus={focus} />
  if (focus.startsWith('hormone-sterile-')) return <Sterile focus={focus} />
  if (focus.startsWith('hormone-weigh-')) return <Weigh focus={focus} />
  if (focus === 'hormone-dose-data') return <DoseData />
  return null
}


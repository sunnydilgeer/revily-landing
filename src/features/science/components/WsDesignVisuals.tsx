import { WsDiagram, Tag, Panel, Tick, Cross, Arrow, Numbered, DataTable, Bust, Stopwatch, Bench, PotPlant, Ruler, Lampshade, Bracket, tones, wsPalette as W, ink, muted, r1, faded, type Pt } from './WsKit'
import { Leader, Lines } from './PhysicsKit'
import { IceCube, Puddle } from './GasParticleVisuals'
import { Trolley } from './NewtonLawVisuals'

/*
 * Working Scientifically Lesson 4: Designing investigations. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'wsdesign-' and is routed from CellBiologyVisuals.tsx.
 *
 * Three pictures carry the lesson: the two ice cubes (observation → hypothesis → prediction → evidence), the ramp and
 * trolley (independent, dependent and control variables), and people with stopwatches (repeatable, reproducible, valid).
 * Colour code from WsKit: the variable you change blue, the variable you measure brown-orange, the ones kept the same slate.
 */

/* ---------- Section 2: from idea to prediction ---------- */

function IceScene({ dim = false }: { dim?: boolean }) {
  return <g opacity={dim ? faded : 1}>
    {/* metal tray */}
    <path d="M36 204H244L236 220Q235 223 231 223H49Q45 223 44 220Z" fill={W.metal} stroke={W.metalLine} strokeWidth="2.2" />
    <path d="M36 204H244" stroke={W.metalLine} strokeWidth="3.4" />
    <path d="M60 212H120" stroke="white" strokeWidth="3" opacity=".9" />
    <Puddle x={142} y={200} rx={62} ry={9} seed={4} />
    <IceCube x={142} y={186} s={0.5} />
    {/* wooden board */}
    <rect x={296} y={202} width={208} height={20} rx="5" fill={W.wood} stroke={W.woodLine} strokeWidth="2.2" />
    <path d="M312 210Q360 206 400 211T488 209M330 216Q380 213 440 217" stroke={W.woodLine} strokeWidth="1.2" fill="none" opacity=".6" />
    <Puddle x={400} y={200} rx={30} ry={6} seed={7} />
    <IceCube x={400} y={172} s={0.95} />
    <Lines x={140} y={250} anchor="middle" lines={['metal tray']} size={14} weight={650} colour={muted} />
    <Lines x={400} y={250} anchor="middle" lines={['wooden board']} size={14} weight={650} colour={muted} />
  </g>
}
function Observation() {
  return <WsDiagram title="An ice cube on a metal tray and an ice cube on a wooden board. The one on metal is much smaller, with a bigger puddle: the ice on metal melts faster. This is an observation.">
    <IceScene />
    <Tag x={270} y={42} text="observation" tone="mark" size={14} strong />
    <Lines x={270} y={90} anchor="middle" lines={['the ice on metal melts faster']} size={17} />
  </WsDiagram>
}
function Hypothesis() {
  return <WsDiagram title="The same two ice cubes, faded. A thought bubble holds an idea that could explain it: metal moves energy to the ice faster than wood. This is a hypothesis.">
    <IceScene dim />
    <Tag x={270} y={24} text="hypothesis" tone="mark" size={14} strong />
    <rect x={96} y={46} width={348} height={82} rx="41" fill="white" stroke={ink} strokeWidth="2" />
    <circle cx={176} cy={146} r="8" fill="white" stroke={ink} strokeWidth="2" />
    <circle cx={160} cy={164} r="5" fill="white" stroke={ink} strokeWidth="2" />
    <Lines x={270} y={80} anchor="middle" lines={['idea: metal moves energy to', 'the ice faster than wood']} size={16} />
  </WsDiagram>
}
function Prediction() {
  const rows: { label: string; text: string[]; hi?: boolean }[] = [
    { label: 'observation', text: ['the ice on metal', 'melts faster'] },
    { label: 'hypothesis', text: ['metal moves energy to', 'the ice faster than wood'] },
    { label: 'prediction', text: ['ice on metal melts in less', 'time than ice on wood'], hi: true },
  ]
  return <WsDiagram schematic={false} title="Three steps joined by arrows: observation, then hypothesis, then prediction. The prediction says ice on metal will melt in less time than ice on wood.">
    {rows.map((r, i) => {
      const y = 12 + i * 98
      return <g key={i}>
        <Panel x={60} y={y} w={420} h={72} tone={r.hi ? 'mark' : 'plain'} strong={r.hi} dim={false} />
        <text x={84} y={y + 42} fontSize="16" fontWeight="750" fill={r.hi ? tones.mark.text : muted}>{r.label}</text>
        <Lines x={200} y={y + 32} lines={r.text} size={15} weight={r.hi ? 750 : 650} />
        {i < 2 && <Arrow from={[270, y + 76]} to={[270, y + 95]} width={2.6} />}
      </g>
    })}
  </WsDiagram>
}
function Evidence() {
  return <WsDiagram schematic={false} title="Results: the ice on metal melted in 6 minutes and the ice on wood in 11 minutes. This matches the prediction, so it supports the hypothesis. Results that did not match could show the hypothesis is wrong.">
    <Tag x={170} y={40} text="results" size={14} />
    <Stopwatch x={110} y={130} r={36} reading="6 min" size={15} />
    <Stopwatch x={230} y={130} r={36} reading="11 min" size={15} />
    <Lines x={110} y={196} anchor="middle" lines={['metal']} size={14} weight={650} colour={muted} />
    <Lines x={230} y={196} anchor="middle" lines={['wood']} size={14} weight={650} colour={muted} />
    <Arrow from={[284, 120]} to={[330, 104]} width={2.4} />
    <Tick x={356} y={100} s={1.2} />
    <Lines x={380} y={96} lines={['supports the', 'hypothesis']} size={15} />
    <g opacity={faded + 0.1}>
      <Cross x={356} y={178} s={1.2} />
      <Lines x={380} y={174} lines={['or shows', 'it is wrong']} size={15} weight={650} colour={muted} />
    </g>
    <Lines x={270} y={262} anchor="middle" lines={['the results match the prediction']} size={15} weight={650} colour={muted} />
  </WsDiagram>
}

/* ---------- Section 3: making it fair ---------- */

function Knob({ x, y, r, tone, angle = -40, lock = false, strong = false }: { x: number; y: number; r: number; tone: 'change' | 'keep'; angle?: number; lock?: boolean; strong?: boolean }) {
  const c = tones[tone], a = (angle - 90) * Math.PI / 180
  return <g>
    <circle cx={x} cy={y} r={r} fill={c.fill} stroke={c.line} strokeWidth={strong ? 2.8 : 2} />
    <circle cx={x} cy={y} r={r * 0.62} fill="white" stroke={c.line} strokeWidth="1.4" />
    <path d={`M${x} ${y}L${r1(x + Math.cos(a) * r * 0.62)} ${r1(y + Math.sin(a) * r * 0.62)}`} stroke={c.line} strokeWidth="3" />
    {lock && <g transform={`translate(${x + r * 0.75} ${y + r * 0.7})`}>
      <path d="M-4 -3V-6.5A4 4 0 0 1 4 -6.5V-3" fill="none" stroke={c.line} strokeWidth="1.8" />
      <rect x="-6" y="-3.5" width="12" height="10" rx="2.2" fill={c.line} />
    </g>}
  </g>
}
function Fair() {
  const gx = 390, gy = 112, gr = 44
  const needle = (-90 + 38) * Math.PI / 180
  return <WsDiagram schematic={false} title="A fair test drawn as a control panel: one orange dial is turned (change one thing), one blue meter reads a value (measure one thing), and a row of grey dials is locked (keep everything else the same).">
    <Knob x={150} y={104} r={40} tone="change" angle={50} strong />
    <Arrow from={[98, 62]} to={[202, 58]} colour={tones.change.line} bend={-0.36} width={2.6} />
    <Lines x={150} y={172} anchor="middle" lines={['change one thing']} size={15} colour={tones.change.text} />
    {/* meter */}
    <path d={`M${gx - gr} ${gy}A${gr} ${gr} 0 0 1 ${gx + gr} ${gy}Z`} fill={tones.measure.fill} stroke={tones.measure.line} strokeWidth="2.2" />
    {[-60, -30, 0, 30, 60].map(d => { const a = (d - 90) * Math.PI / 180; return <path key={d} d={`M${r1(gx + Math.cos(a) * (gr - 4))} ${r1(gy + Math.sin(a) * (gr - 4))}L${r1(gx + Math.cos(a) * (gr - 12))} ${r1(gy + Math.sin(a) * (gr - 12))}`} stroke={tones.measure.line} strokeWidth="1.8" /> })}
    <path d={`M${gx} ${gy}L${r1(gx + Math.cos(needle) * (gr - 10))} ${r1(gy + Math.sin(needle) * (gr - 10))}`} stroke={ink} strokeWidth="2.8" />
    <circle cx={gx} cy={gy} r="4" fill={ink} />
    <rect x={gx - gr - 8} y={gy} width={gr * 2 + 16} height="12" rx="6" fill="white" stroke={tones.measure.line} strokeWidth="2" />
    <Lines x={gx} y={172} anchor="middle" lines={['measure one thing']} size={15} colour={tones.measure.text} />
    <path d="M40 200H500" stroke={W.panelLine} strokeWidth="1.5" strokeDasharray="4 6" />
    {[130, 200, 270, 340, 410].map((x, i) => <Knob key={x} x={x} y={258} r={20} tone="keep" angle={-30 + i * 17} lock />)}
    <Lines x={270} y={224} anchor="middle" lines={['keep the rest the same']} size={14} colour={tones.keep.text} />
  </WsDiagram>
}

// The ramp: a wedge from (RX, bench − h) down to (RF, bench).
const BENCH = 256, RX = 100, RF = 400
const rampTop = (h: number) => BENCH - h
const slopeAt = (h: number, t: number): Pt => [r1(RX + (RF - RX) * t), r1(rampTop(h) + h * t)]
function Wedge({ h, ghost = false }: { h: number; ghost?: boolean }) {
  const d = `M${RX} ${BENCH}V${rampTop(h)}L${RF} ${BENCH}Z`
  return ghost ? <path d={d} fill="none" stroke={tones.change.line} strokeWidth="1.8" strokeDasharray="5 5" opacity=".7" />
    : <path d={d} fill={W.wood} stroke={W.woodLine} strokeWidth="2.2" />
}
function RampScene({ mode }: { mode: 'independent' | 'dependent' | 'control' }) {
  const h = 110, ang = Math.atan2(h, RF - RX) * 180 / Math.PI, [tx, ty] = slopeAt(h, 0.2)
  const ind = mode === 'independent', dep = mode === 'dependent', ctl = mode === 'control'
  const labels = {
    independent: { tag: 'independent variable', tone: 'change' as const, line: 'the one you change' },
    dependent: { tag: 'dependent variable', tone: 'measure' as const, line: 'the one you measure' },
    control: { tag: 'control variables', tone: 'keep' as const, line: 'keep them the same' },
  }[mode]
  const titles = {
    independent: 'A trolley on a ramp. The ramp is shown at three heights; the height is what you change, so it is the independent variable.',
    dependent: 'The same ramp with a stopwatch at the bottom. The time the trolley takes to reach the bottom is what you measure, so it is the dependent variable.',
    control: 'The same ramp with tags on the trolley, the ramp length and the surface: these are kept the same. They are control variables.',
  }[mode]
  return <WsDiagram title={titles}>
    <Bench x1={24} x2={516} y={BENCH} />
    <Wedge h={h} />
    {ind && <Wedge h={60} ghost />}
    {ind && <Wedge h={160} ghost />}
    <path d={`M${RF + 4} ${BENCH - 30}V${BENCH}`} stroke={muted} strokeWidth="2" strokeDasharray="4 4" />
    <g transform={`translate(${tx} ${ty}) rotate(${r1(ang)})`}><Trolley x={0} y={0} s={0.72} /></g>
    {ind && <g>
      <Arrow from={[78, BENCH - h / 2]} to={[78, rampTop(h) + 1]} colour={tones.change.line} width={3} />
      <Arrow from={[78, BENCH - h / 2]} to={[78, BENCH - 1]} colour={tones.change.line} width={3} />
      <Tag x={62} y={rampTop(h) - 22} text="height" tone="change" size={14} strong />
    </g>}
    <Stopwatch x={470} y={194} r={30} reading={dep ? '2.4 s' : undefined} tone={dep ? 'measure' : 'plain'} dim={ind} />
    {dep && <Lines x={470} y={248} anchor="middle" lines={['time to reach', 'the bottom']} size={13} colour={tones.measure.text} />}
    {ctl && <g>
      <Tag x={210} y={96} text="same trolley" tone="keep" />
      <Leader from={[196, 110]} to={[tx + 4, ty - 26]} colour={tones.keep.line} />
      <Tag x={330} y={150} text="same surface" tone="keep" />
      <Leader from={[322, 164]} to={slopeAt(h, 0.72)} colour={tones.keep.line} />
      <Tag x={190} y={286} text="same ramp length" tone="keep" />
      <Leader from={[190, 272]} to={[160, 232]} colour={tones.keep.line} />
    </g>}
    <Tag x={420} y={38} text={labels.tag} tone={labels.tone} size={14} strong />
    <Lines x={420} y={80} anchor="middle" lines={[labels.line]} size={15} colour={tones[labels.tone].text} />
  </WsDiagram>
}
function ControlExp() {
  const group = (xs: number[], fert: boolean) => xs.map(x => <g key={x}>
    <PotPlant x={x} y={246} h={58} />
    {fert && [-12, -4, 5, 12].map((d, i) => <circle key={i} cx={x + d} cy={206 - (i % 2) * 2} r="2.4" fill={tones.change.line} />)}
  </g>)
  return <WsDiagram title="Two identical rows of potted plants under the same lamp with the same water. The left row is given fertiliser. The right row is the control: nothing is added.">
    <Lampshade x={140} y={62} w={84} />
    <Lampshade x={400} y={62} w={84} />
    <Tag x={270} y={40} text="same light" tone="keep" />
    <Tag x={270} y={78} text="same water" tone="keep" />
    <Bench x1={40} x2={240} y={248} />
    <Bench x1={300} x2={500} y={248} />
    {group([80, 140, 200], true)}
    {group([340, 400, 460], false)}
    <path d="M270 108V270" stroke={W.panelLine} strokeWidth="1.6" strokeDasharray="4 6" />
    <Tag x={140} y={278} text="with fertiliser" tone="change" />
    <Tag x={400} y={278} text="control: nothing added" tone="keep" />
  </WsDiagram>
}

/* ---------- Section 4: trusting results ---------- */

function Repeatable() {
  return <WsDiagram schematic={false} title="One person repeats the same timing three times and gets 5.2 s, 5.1 s and 5.3 s. The readings are similar, so the results are repeatable.">
    <Bust x={82} y={176} s={1.35} kind={0} />
    <Lines x={82} y={204} anchor="middle" lines={['one person']} size={14} weight={650} colour={muted} />
    <Arrow from={[128, 128]} to={[172, 128]} width={2.4} />
    {['5.2 s', '5.1 s', '5.3 s'].map((t, i) => <g key={t}>
      <Stopwatch x={230 + i * 104} y={116} r={32} reading={t} tone="measure" size={15} />
      <Lines x={230 + i * 104} y={172} anchor="middle" lines={[`repeat ${i + 1}`]} size={13} weight={650} colour={muted} />
    </g>)}
    <Bracket x1={200} x2={466} y={194} dir={-1} />
    <Tick x={268} y={236} />
    <Lines x={288} y={241} lines={['similar each time']} size={16} />
  </WsDiagram>
}
function ResultCard({ x, y, who, value }: { x: number; y: number; who: string; value: string }) {
  return <Panel x={x - 78} y={y} w={156} h={60} tone="measure">
    <Lines x={x} y={y + 24} anchor="middle" lines={[who]} size={13} weight={650} colour={muted} />
    <Lines x={x} y={y + 47} anchor="middle" lines={[value]} size={16} colour={tones.measure.text} />
  </Panel>
}
function Reproducible() {
  return <WsDiagram schematic={false} title="You and another group each do the experiment with the same method. Your mean is 5.2 s and theirs is 5.3 s. The results are similar, so they are reproducible.">
    <Bust x={120} y={112} s={1.3} kind={0} />
    <Bust x={420} y={112} s={1.3} kind={1} />
    <ResultCard x={120} y={130} who="you" value="mean 5.2 s" />
    <ResultCard x={420} y={130} who="another group" value="mean 5.3 s" />
    <Tag x={270} y={82} text="same method" size={14} />
    <Arrow from={[208, 82]} to={[166, 82]} width={2.2} />
    <Arrow from={[332, 82]} to={[374, 82]} width={2.2} />
    <Tick x={186} y={244} />
    <Lines x={206} y={249} lines={['similar results']} size={16} />
  </WsDiagram>
}
function Valid() {
  const items = ['fair test', 'repeatable', 'reproducible']
  return <WsDiagram schematic={false} title="A checklist with three ticks: a fair test, repeatable results and reproducible results. Together they lead to valid results that answer the question.">
    <Panel x={40} y={34} w={244} h={228} />
    <Lines x={62} y={66} lines={['checklist']} size={14} colour={muted} />
    {items.map((t, i) => <g key={t}>
      <Tick x={78} y={110 + i * 54} s={1.1} />
      <Lines x={102} y={116 + i * 54} lines={[t]} size={17} />
    </g>)}
    <Arrow from={[298, 148]} to={[352, 148]} width={3} />
    <Tag x={430} y={148} text="valid" tone="good" size={20} w={130} strong />
    <Lines x={430} y={196} anchor="middle" lines={['answers the', 'question']} size={14} weight={650} colour={muted} />
  </WsDiagram>
}

/* ---------- On your own ---------- */

function QPlants() {
  const plants: [number, number, string][] = [[120, 44, '0 g'], [250, 62, '5 g'], [380, 80, '10 g']]
  return <WsDiagram title="Three plants in pots with a ruler and a lamp, four numbered parts.">
    <Lampshade x={250} y={58} w={92} />
    <Bench x1={50} x2={440} y={264} />
    {plants.map(([x, h, g]) => <g key={x}>
      <Ruler x={x - 34} y={262} h={130} />
      <PotPlant x={x} y={262} h={h} />
      <Tag x={x} y={284} text={g} size={13} />
    </g>)}
    <Numbered n={1} at={[40, 112]} to={[80, 150]} />
    <Numbered n={2} at={[490, 284]} to={[406, 284]} />
    <Numbered n={3} at={[490, 214]} to={[400, 240]} />
    <Numbered n={4} at={[490, 60]} to={[296, 56]} />
  </WsDiagram>
}
function QRepeats() {
  return <WsDiagram schematic={false} title="A table of three repeat reaction times for Student P and Student Q.">
    <DataTable x={40} y={82} cols={[136, 108, 108, 108]} rowH={52} size={17} title="Reaction time (s)"
      rows={[['', 'Repeat 1', 'Repeat 2', 'Repeat 3'], ['Student P', '0.21', '0.22', '0.21'], ['Student Q', '0.18', '0.31', '0.24']]} />
  </WsDiagram>
}

export function WsDesignVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wsdesign-observation': return <Observation />
    case 'wsdesign-hypothesis': return <Hypothesis />
    case 'wsdesign-prediction': return <Prediction />
    case 'wsdesign-evidence': return <Evidence />
    case 'wsdesign-fair': return <Fair />
    case 'wsdesign-independent': return <RampScene mode="independent" />
    case 'wsdesign-dependent': return <RampScene mode="dependent" />
    case 'wsdesign-controlvars': return <RampScene mode="control" />
    case 'wsdesign-controlexp': return <ControlExp />
    case 'wsdesign-repeatable': return <Repeatable />
    case 'wsdesign-reproducible': return <Reproducible />
    case 'wsdesign-valid': return <Valid />
    case 'wsdesign-q-plants': return <QPlants />
    case 'wsdesign-q-repeats': return <QRepeats />
    default: return null
  }
}

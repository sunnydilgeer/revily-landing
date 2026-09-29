import { useId } from 'react'
import { WsDiagram, Tag, Arrow, Bench, Bracket, Beaker, TestTube, DropPipette, Drop, Panel, tones, wsPalette as W, ink, muted, r1 } from './WsKit'
import { Lines, Leader } from './PhysicsKit'
import { GasWisp, labPalette as LB } from './GasRateVisuals'

/*
 * Working Scientifically Lesson 15: Measuring pH and the size of a cell. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'wsphcell-' and is routed from CellBiologyVisuals.tsx.
 *
 * Drawn with WsKit, like the other practical-skills lessons. Indicator colours run red (acid) through green to purple
 * (alkali), as on a universal indicator chart; litmus is red or blue. Cells are plant-tissue green with a small purple
 * nucleus, as in the Biology lessons. The 1 mm ruler bar is one drawing, reused from the counting frame through the
 * worked example and the question (numbers hidden there).
 */

const sol = { fill: LB.sol, line: LB.solLine }
const chart = ['#e8584d', '#f0874a', '#f5c24e', '#c9d85a', '#6cbd5f', '#3fa79a', '#4a7fd0', '#7b58b8']
const chartLine = ['#b23b32', '#b9602a', '#b88e1c', '#8a9a2a', '#3f8a3d', '#277a70', '#2f5ea6', '#563a8c']
const dye = { fill: '#c8a8e6', line: '#7a56a6' }
const litmus = { red: '#ef8a80', redLine: '#b0463c', blue: '#7fa7e6', blueLine: '#3b64ad' }
const cell = { fill: W.plant, line: W.plantLine, nucleus: '#d9c9ef', nucleusLine: '#7a56a6' }

/* ---------- Section 2: pH ---------- */

function Indicator() {
  return <WsDiagram title="A dropping pipette adds two drops of indicator to a test tube of colourless solution. In a second tube the indicator has changed colour.">
    <TestTube x={170} y={250} w={36} h={130} level={0.46} fill={sol.fill} line={sol.line} />
    <DropPipette x={170} y={96} h={80} />
    <Drop x={170} y={112} s={0.8} fill={dye.fill} line={dye.line} />
    <Drop x={170} y={134} s={0.8} fill={dye.fill} line={dye.line} />
    <Lines x={110} y={112} anchor="end" lines={['a couple', 'of drops']} size={14} />
    <Arrow from={[222, 190]} to={[302, 190]} width={2.6} />
    <TestTube x={360} y={250} w={36} h={130} level={0.46} fill={chart[0]} line={chartLine[0]} />
    <Lines x={404} y={196} lines={['colour', 'changes']} size={15} colour={tones.mark.text} />
    <Bench x1={100} x2={460} y={252} />
    <Lines x={170} y={282} anchor="middle" lines={['colourless solution']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}

function Universal() {
  const x0 = 180, bw = 40, y = 150
  return <WsDiagram title="A test tube of universal indicator that has turned orange, beside a colour chart that runs gradually from red for acids, through green, to purple for alkalis. Match the colour to estimate the pH.">
    <TestTube x={90} y={250} w={36} h={130} level={0.5} fill={chart[1]} line={chartLine[1]} />
    <Bench x1={50} x2={130} y={252} />
    {chart.map((c, i) => <rect key={i} x={x0 + i * bw} y={y} width={bw - 4} height={46} rx="7" fill={c} stroke={chartLine[i]} strokeWidth="1.8" />)}
    <Bracket x1={x0} x2={x0 + chart.length * bw - 4} y={y - 16} />
    <Tag x={x0 + (chart.length * bw - 4) / 2} y={y - 50} text="gradual change: estimate the pH" tone="mark" size={14} strong />
    <Lines x={x0 + 18} y={y + 72} anchor="middle" lines={['acid']} size={14} colour={chartLine[0]} />
    <Lines x={x0 + 4.5 * bw - 2} y={y + 72} anchor="middle" lines={['neutral']} size={14} colour={chartLine[4]} />
    <Lines x={x0 + 7 * bw + 16} y={y + 72} anchor="middle" lines={['alkali']} size={14} colour={chartLine[7]} />
    <rect x={x0 + bw - 5} y={y - 5} width={bw + 6} height={56} rx="10" fill="none" stroke={tones.mark.line} strokeWidth="2.6" />
    <Lines x={180} y={260} lines={['match the colour of the tube to the chart']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}

function Paper() {
  const deep = { fill: '#7fb6e6', line: '#2f6fb0' }
  return <WsDiagram title="A beaker of a strongly coloured blue solution. A glass rod carries one drop of it onto a strip of indicator paper on a white tile, and only the spot on the paper changes colour.">
    <Beaker x={130} y={250} w={110} h={110} level={0.66} fill={deep.fill} line={deep.line} />
    <Bench x1={50} x2={500} y={252} />
    <path d="M280 246Q280 236 290 236H470Q480 236 480 246V250H280Z" fill="white" stroke={W.tableLine} strokeWidth="2" />
    <rect x={300} y={224} width={160} height={14} rx="3" fill="#f6dca0" stroke="#b99a52" strokeWidth="1.6" />
    <ellipse cx={380} cy={231} rx="14" ry="6" fill={chart[5]} stroke={chartLine[5]} strokeWidth="1.4" />
    <path d="M300 96L380 206" stroke={W.glassLine} strokeWidth="9" />
    <path d="M300 96L380 206" stroke="#f7fbfd" strokeWidth="5" />
    <Drop x={381} y={220} s={0.7} fill={deep.fill} line={deep.line} />
    <Lines x={130} y={112} anchor="middle" lines={['solution is', 'already coloured']} size={14} />
    <Lines x={400} y={120} lines={['spot a drop', 'on the paper']} size={15} colour={tones.mark.text} />
    <Leader from={[410, 144]} to={[384, 222]} colour={tones.mark.line} />
    <Lines x={440} y={278} anchor="middle" lines={['indicator paper']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}

function Litmus() {
  return <WsDiagram title="Left: a strip of litmus paper turned red in acid and a strip turned blue in alkali. Right: damp indicator paper held in the mouth of a test tube of gas to test the gas.">
    <Panel x={14} y={16} w={250} h={270} />
    <Panel x={276} y={16} w={250} h={270} />
    <rect x={60} y={70} width={36} height={120} rx="5" fill={litmus.red} stroke={litmus.redLine} strokeWidth="2" />
    <rect x={180} y={70} width={36} height={120} rx="5" fill={litmus.blue} stroke={litmus.blueLine} strokeWidth="2" />
    <Lines x={78} y={222} anchor="middle" lines={['red in', 'acid']} size={15} colour={litmus.redLine} />
    <Lines x={198} y={222} anchor="middle" lines={['blue in', 'alkali']} size={15} colour={litmus.blueLine} />
    <TestTube x={400} y={254} w={40} h={150} />
    <GasWisp x={392} y={230} len={60} colour="#6fa383" width={2.6} />
    <GasWisp x={410} y={210} len={48} colour="#6fa383" width={2.6} flip />
    <path d="M402 64V98" stroke={muted} strokeWidth="2" />
    <rect x={393} y={98} width={18} height={62} rx="3" fill="#f6dca0" stroke="#b99a52" strokeWidth="1.6" />
    <path d="M397 116q5 3 10 0M397 132q5 3 10 0" stroke="#7fb6e6" strokeWidth="1.6" fill="none" />
    <Lines x={368} y={66} anchor="end" lines={['damp paper', 'in a gas']} size={15} colour={tones.mark.text} />
    <Leader from={[362, 88]} to={[392, 126]} colour={tones.mark.line} />
  </WsDiagram>
}

function Probe() {
  return <WsDiagram title="A pH probe dips into a beaker of solution. A wire joins it to a meter that shows the pH as a number, 7.0. It is electronic and more accurate than an indicator.">
    <Beaker x={150} y={252} w={120} h={110} level={0.62} fill={sol.fill} line={sol.line} />
    <Bench x1={60} x2={500} y={254} />
    <rect x={142} y={70} width={16} height={130} rx="6" fill="#dfe5ea" stroke={W.metalLine} strokeWidth="2" />
    <path d="M142 186H158V218Q158 230 150 230Q142 230 142 218Z" fill="#f3f8fb" stroke={W.metalLine} strokeWidth="2" />
    <path d="M150 70V50Q150 34 170 34H300Q320 34 320 54V124" fill="none" stroke={ink} strokeWidth="2.6" />
    <rect x={300} y={124} width={150} height={112} rx="14" fill="#eef2f5" stroke={W.metalLine} strokeWidth="2.2" />
    <rect x={318} y={142} width={114} height={52} rx="8" fill="#26394a" />
    <text x={375} y={178} textAnchor="middle" fontSize="26" fontWeight="700" fill="#bff0c9" fontFamily="ui-monospace, monospace">7.0</text>
    <text x={330} y={222} fontSize="14" fontWeight="750" fill={ink}>pH</text>
    <circle cx={420} cy={216} r="7" fill="#c9d3dc" stroke={W.metalLine} strokeWidth="1.6" />
    <Lines x={86} y={110} anchor="middle" lines={['pH probe']} size={15} />
    <Leader from={[112, 112]} to={[141, 130]} />
    <Lines x={470} y={120} lines={['meter']} size={15} />
    <Leader from={[478, 126]} to={[450, 150]} />
    <Tag x={375} y={82} text="electronic and more accurate" tone="mark" size={13} strong />
  </WsDiagram>
}

/* ---------- Section 3: cell size ---------- */

/** n equal plant cells side by side, from x to x + w, their bases on y. */
function CellRow({ x, y, w, n, h = 34, numbers = false, dim = false }: { x: number; y: number; w: number; n: number; h?: number; numbers?: boolean; dim?: boolean }) {
  const cw = w / n
  return <g opacity={dim ? 0.35 : 1}>
    {Array.from({ length: n }, (_, i) => {
      const cx = x + i * cw
      return <g key={i}>
        <rect x={r1(cx + 1)} y={y - h} width={r1(cw - 2)} height={h} rx={Math.min(8, cw / 4)} fill={cell.fill} stroke={cell.line} strokeWidth="1.8" />
        <circle cx={r1(cx + cw * 0.62)} cy={r1(y - h * 0.55)} r={Math.max(2.4, Math.min(5, cw * 0.12))} fill={cell.nucleus} stroke={cell.nucleusLine} strokeWidth="1.2" />
        {numbers && <text x={r1(cx + cw / 2)} y={y - h - 10} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>{i + 1}</text>}
      </g>
    })}
  </g>
}
/** A clear ruler strip from x to x + w marked 0 to `mm` millimetres, with 0.1 mm ticks. */
function MmRuler({ x, y, w, mm = 1, from = 0, labels = true, h = 30 }: { x: number; y: number; w: number; mm?: number; from?: number; labels?: boolean; h?: number }) {
  const per = w / mm, n = mm * 10
  return <g>
    <rect x={x - 14} y={y} width={w + 28} height={h} rx="4" fill="#eef6fb" fillOpacity=".9" stroke={W.glassLine} strokeWidth="1.6" />
    {Array.from({ length: n + 1 }, (_, i) => {
      const xx = r1(x + i * per / 10), major = i % 10 === 0, half = i % 5 === 0
      return <path key={i} d={`M${xx} ${y}v${major ? 14 : half ? 10 : 6}`} stroke={ink} strokeWidth={major ? 2 : 1.2} />
    })}
    {labels && Array.from({ length: mm + 1 }, (_, i) => <text key={i} x={r1(x + i * per)} y={y + h - 3} textAnchor="middle" fontSize="12" fontWeight="700" fill={ink}>{`${from + i} mm`}</text>)}
  </g>
}

function Microscope({ x, y }: { x: number; y: number }) {
  // (x, y) = middle of the base on the bench. The stage top is at y - 92.
  const stage = y - 92
  return <g>
    <path d={`M${x - 62} ${y}Q${x - 66} ${y - 18} ${x - 40} ${y - 20}H${x + 60}Q${x + 80} ${y - 18} ${x + 76} ${y}Z`} fill="#dfe7ee" stroke={W.metalLine} strokeWidth="2" />
    <path d={`M${x + 50} ${y - 20}C${x + 80} ${y - 70} ${x + 82} ${stage - 70} ${x + 40} ${stage - 128}`} fill="none" stroke={W.metalLine} strokeWidth="24" />
    <path d={`M${x + 50} ${y - 20}C${x + 80} ${y - 70} ${x + 82} ${stage - 70} ${x + 40} ${stage - 128}`} fill="none" stroke="#dfe7ee" strokeWidth="19" />
    <ellipse cx={x - 6} cy={y - 34} rx="18" ry="8" fill="#fff1a1" stroke="#c1a850" strokeWidth="1.8" />
    <rect x={x - 80} y={stage} width={148} height={10} rx="3" fill="#b9c6d2" stroke={W.metalLine} strokeWidth="1.8" />
    {/* body tube, objective and eyepiece */}
    <path d={`M${x - 20} ${stage - 36}L${x - 12} ${stage - 20}H${x}L${x + 8} ${stage - 36}Z`} fill="#c9d3dc" stroke={W.metalLine} strokeWidth="1.8" />
    <path d={`M${x - 20} ${stage - 36}V${stage - 100}L${x + 18} ${stage - 124}L${x + 30} ${stage - 106}L${x + 8} ${stage - 92}V${stage - 36}Z`} fill="#dfe7ee" stroke={W.metalLine} strokeWidth="2" />
    <path d={`M${x + 10} ${stage - 132}L${x + 26} ${stage - 144}L${x + 38} ${stage - 126}L${x + 22} ${stage - 114}Z`} fill="#c9d3dc" stroke={W.metalLine} strokeWidth="1.8" />
    <circle cx={x + 66} cy={stage - 20} r="14" fill="#c9d3dc" stroke={W.metalLine} strokeWidth="2" />
    <circle cx={x + 66} cy={stage - 20} r="6" fill="#eef2f5" stroke={W.metalLine} strokeWidth="1.4" />
  </g>
}

function Setup() {
  const mx = 170, my = 262, stage = my - 92
  const clip = useId().replace(/:/g, '')
  const vx = 420, vy = 130, vr = 92
  return <WsDiagram title="A light microscope with a slide on the stage and a clear ruler on top of the slide, both held by the stage clips. The objective gives a total magnification of ×100. The view shows cells with the ruler's millimetre marks over them.">
    <Microscope x={mx} y={my} />
    {/* slide, ruler and clips on the stage */}
    <rect x={mx - 58} y={stage - 5} width={96} height={5} rx="1.5" fill="#e3f1ea" stroke={W.glassLine} strokeWidth="1.4" />
    <rect x={mx - 52} y={stage - 11} width={86} height={6} rx="1.5" fill="#eef6fb" stroke={ink} strokeWidth="1.4" />
    <path d={`M${mx - 66} ${stage - 13}H${mx - 44}M${mx + 22} ${stage - 13}H${mx + 46}`} stroke={ink} strokeWidth="3" />
    <Bench x1={60} x2={300} y={my + 2} />
    <Lines x={40} y={112} lines={['clear ruler', 'on the slide']} size={14} />
    <Leader from={[76, 136]} to={[mx - 30, stage - 10]} />
    <Lines x={20} y={206} lines={['clip to', 'the stage']} size={14} />
    <Leader from={[70, 208]} to={[mx - 60, stage - 13]} />
    <Tag x={mx + 110} y={stage - 30} text="×100" tone="mark" size={14} strong />
    <Leader from={[mx + 86, stage - 30]} to={[mx + 4, stage - 28]} colour={tones.mark.line} />
    {/* the view */}
    <path d={`M${mx + 34} ${stage - 132}L${vx - 70} ${vy - 58}`} stroke={muted} strokeWidth="1.4" strokeDasharray="4 5" />
    <defs><clipPath id={clip}><circle cx={vx} cy={vy} r={vr} /></clipPath></defs>
    <circle cx={vx} cy={vy} r={vr} fill="white" />
    <g clipPath={`url(#${clip})`}>
      {[0, 1, 2, 3, 4].map(j => <CellRow key={j} x={vx - vr - (j % 2) * 16} y={vy - 50 + j * 36} w={vr * 2 + 40} n={6} h={34} />)}
      <MmRuler x={vx - 70} y={vy + 6} w={140} mm={1} labels={false} h={26} />
    </g>
    <circle cx={vx} cy={vy} r={vr} fill="none" stroke={ink} strokeWidth="2.2" />
    <Lines x={vx} y={vy + vr + 26} anchor="middle" lines={['what you see: cells and the ruler']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}

const BAR = { x: 150, y: 170, w: 240 }
function Count() {
  const { x, y, w } = BAR
  const clip = useId().replace(/:/g, '')
  return <WsDiagram title="A microscope view with a clear ruler. Five cells are lined up along 1 mm of the ruler, numbered 1 to 5.">
    <defs><clipPath id={clip}><ellipse cx={270} cy={150} rx={250} ry={132} /></clipPath></defs>
    <ellipse cx={270} cy={150} rx={250} ry={132} fill="white" />
    <g clipPath={`url(#${clip})`}>
      <CellRow x={x - 48} y={y} w={w} n={5} h={48} dim />
      <CellRow x={x} y={y} w={w} n={5} h={48} numbers />
      <CellRow x={x + w} y={y} w={w} n={5} h={48} dim />
      <MmRuler x={x} y={y + 2} w={w} mm={1} from={1} h={32} />
    </g>
    <ellipse cx={270} cy={150} rx={250} ry={132} fill="none" stroke={ink} strokeWidth="2.2" />
    <path d={`M${x} ${y + 2}V${y - 64}M${x + w} ${y + 2}V${y - 64}`} stroke={tones.mark.line} strokeWidth="2" strokeDasharray="4 4" />
    <Tag x={270} y={62} text="count the cells along 1 mm" tone="mark" size={14} strong />
    <Lines x={270} y={252} anchor="middle" lines={['5 cells']} size={15} colour={tones.mark.text} />
  </WsDiagram>
}

function Units() {
  const x = 80, w = 380, y = 150
  return <WsDiagram title="A bar 1 mm long, split into ten equal parts of 100 µm each. 1 mm is the same as 1000 µm. The symbol µm means micrometre.">
    <Bracket x1={x} x2={x + w} y={y - 18} />
    <Tag x={x + w / 2} y={y - 50} text="1 mm" tone="measure" size={16} strong />
    <rect x={x} y={y} width={w} height={26} rx="6" fill={tones.measure.fill} stroke={tones.measure.line} strokeWidth="2" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${r1(x + (i + 1) * w / 10)} ${y}v26`} stroke={tones.measure.line} strokeWidth="1.4" />)}
    {[0, 500, 1000].map(v => <text key={v} x={r1(x + v / 1000 * w)} y={y + 50} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{v}</text>)}
    <text x={x + w + 30} y={y + 50} fontSize="14" fontWeight="700" fill={muted}>µm</text>
    <Lines x={x + w / 2} y={y + 80} anchor="middle" lines={['ten parts of 100 µm']} size={13} weight={650} colour={muted} />
    <Tag x={270} y={262} text="1 mm = 1000 µm" tone="mark" size={17} strong w={200} />
    <Lines x={470} y={60} anchor="middle" lines={['µm means', 'micrometre']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}

function Formula() {
  const x = 120, w = 300, y = 206
  return <WsDiagram title="The formula: length of a cell in µm = 1000 µm ÷ the number of cells counted in 1 mm. Below, a bar of 1000 µm is shared equally between six cells.">
    <Panel x={40} y={20} w={460} h={96} tone="mark" strong>
      <Lines x={270} y={58} anchor="middle" lines={['length of a cell (µm) =']} size={18} />
      <Lines x={270} y={92} anchor="middle" lines={['1000 µm ÷ number of cells in 1 mm']} size={18} />
    </Panel>
    <CellRow x={x} y={y} w={w} n={6} h={44} />
    <rect x={x} y={y + 2} width={w} height={10} rx="4" fill={tones.measure.fill} stroke={tones.measure.line} strokeWidth="1.8" />
    <Bracket x1={x} x2={x + w} y={y + 22} dir={-1} colour={tones.measure.line} />
    <Lines x={270} y={y + 50} anchor="middle" lines={['1000 µm shared between the cells']} size={14} colour={tones.measure.text} />
    <Lines x={470} y={y - 20} anchor="middle" lines={['more cells,', 'smaller each']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}

function Worked() {
  const { x, y, w } = BAR
  return <WsDiagram title="Five cells lined up along 1 mm of a ruler. 1000 µm ÷ 5 = 200 µm, so one cell is 200 µm long.">
    <CellRow x={x} y={y - 20} w={w} n={5} h={52} numbers />
    <MmRuler x={x} y={y - 18} w={w} mm={1} h={32} />
    <Tag x={270} y={40} text="5 cells along 1 mm" tone="measure" size={14} strong />
    <Tag x={270} y={236} text="1000 µm ÷ 5 = 200 µm" tone="mark" size={17} strong w={250} />
    <Lines x={270} y={278} anchor="middle" lines={['one cell is 200 µm long']} size={14} weight={650} colour={muted} />
  </WsDiagram>
}

function QCells() {
  const { x, y, w } = BAR
  return <WsDiagram title="A row of cells lined up along a ruler marked 1 mm.">
    <CellRow x={x} y={y} w={w} n={10} h={52} />
    <MmRuler x={x} y={y + 2} w={w} mm={1} h={32} />
  </WsDiagram>
}

export function WsPhCellVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wsphcell-indicator': return <Indicator />
    case 'wsphcell-universal': return <Universal />
    case 'wsphcell-paper': return <Paper />
    case 'wsphcell-litmus': return <Litmus />
    case 'wsphcell-probe': return <Probe />
    case 'wsphcell-setup': return <Setup />
    case 'wsphcell-count': return <Count />
    case 'wsphcell-units': return <Units />
    case 'wsphcell-formula': return <Formula />
    case 'wsphcell-worked-cell': return <Worked />
    case 'wsphcell-q-cells': return <QCells />
    default: return null
  }
}

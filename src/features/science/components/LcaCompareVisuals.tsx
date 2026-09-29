import type { ReactNode } from 'react'
import { lcaStages, lcaInk, Diagram, Lines, Caption, Arrow, CurveArrow, Badge, Bolt, Factory, Person, Bin, energy, energyLine } from './LcaVisuals'

/*
 * Chemistry Lesson 52: Comparing life cycle assessments. Original, code-native schematics; not to scale. Focus ids start with 'lcause-'.
 *
 * Colour code: the four stage colours and numbered badges are the same as Lesson 51 (imported `lcaStages`).
 *   plastic bag = cool pale blue-grey; paper bag = warm tan; good point = green; bad point = soft red; energy = yellow.
 * Section 1 builds one comparison table (a row per stage, a column per bag) frame by frame, with the same cell text each time.
 */
const { ink, muted, panelFill, panelLine } = lcaInk
const plastic = '#eef4f8', plasticLine = '#7f9db3'
const paper = '#e9d3ad', paperLine = '#9c7442'
const good = '#4f9a74', goodFill = '#e2f1e8', bad = '#c0584b', badFill = '#f8e1dd'
const leaf = '#a9d4a0', leafLine = '#4f8f5a'
const halo = '#f8c979'
const faded = 0.35

type Pt = [number, number]

// ---------- Objects ----------
function PlasticBag({ x, y, s = 1, opacity = 1 }: { x: number; y: number; s?: number; opacity?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <path d="M-26 -38L-22 -3q0 3 3 3h38q3 0 3 -3L26 -38L23 -60q-2 -4 -6 -2L11 -40q-11 7 -22 0L-17 -62q-4 -2 -6 2Z" fill={plastic} stroke={plasticLine} strokeWidth={1.8 / s} />
    <path d="M-14 -26q4 8 2 18M8 -30q-3 10 2 20" stroke={plasticLine} strokeWidth={1.2 / s} fill="none" opacity=".7" />
  </g>
}
function PaperBag({ x, y, s = 1, opacity = 1 }: { x: number; y: number; s?: number; opacity?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <path d="M-11 -44q0 -18 11 -18q11 0 11 18" stroke={paperLine} strokeWidth={2.6 / s} fill="none" />
    <path d="M-23 0q-2 0 -2 -2V-44h50V-2q0 2 -2 2Z" fill={paper} stroke={paperLine} strokeWidth={1.8 / s} />
    <path d="M-25 -36h50M-18 -44l2 8M18 -44l-2 8" stroke={paperLine} strokeWidth={1.2 / s} fill="none" />
  </g>
}
function Barrel({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-13 -34V-3q0 3 13 3q13 0 13 -3V-34" fill="#5c6670" stroke="#3e464e" strokeWidth="1.6" />
    <ellipse cx={0} cy={-34} rx={13} ry={3.5} fill="#77828c" stroke="#3e464e" strokeWidth="1.6" />
    <path d="M-13 -22q13 3 26 0M-13 -11q13 3 26 0" stroke="#3e464e" strokeWidth="1.2" fill="none" />
  </g>
}
function Tree({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-3 0V-14h6V0Z" fill="#c9a77c" stroke="#8a6440" strokeWidth="1.4" />
    <path d="M0 -14q-16 0 -15 -12q-4 -12 8 -15q4 -9 13 -4q11 1 9 11q7 10 -3 16q-4 4 -12 4Z" fill={leaf} stroke={leafLine} strokeWidth="1.6" />
  </g>
}
function Loop({ x, y, r = 12, n = 3, colour = good }: { x: number; y: number; r?: number; n?: number; colour?: string }) {
  return <g>{Array.from({ length: n }, (_, i) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + .35, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - .35, m = (a0 + a1) / 2, k = 1 / Math.cos((a1 - a0) / 2)
    const p = (a: number, rr = r): Pt => [Math.round((x + rr * Math.cos(a)) * 10) / 10, Math.round((y + rr * Math.sin(a)) * 10) / 10]
    return <CurveArrow key={i} from={p(a0)} c={p(m, r * k)} to={p(a1)} colour={colour} width={1.8} />
  })}</g>
}
function Mound({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 20} ${y}q8 -24 20 -24q12 0 20 24Z`} fill="#d8d0bf" stroke="#b39463" strokeWidth="1.5" /><rect x={x - 6} y={y - 14} width={8} height={5} rx={1.5} fill={plastic} stroke={plasticLine} strokeWidth="1" transform={`rotate(-20 ${x} ${y})`} /></g>
}
function Leaf({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 10} ${y + 8}q0 -20 20 -20q0 20 -20 20Z`} fill={leaf} stroke={leafLine} strokeWidth="1.5" /><path d={`M${x - 10} ${y + 8}l14 -14`} stroke={leafLine} strokeWidth="1.2" /></g>
}
function Tag({ x, y, kind }: { x: number; y: number; kind: 'good' | 'bad' }) {
  return <g><circle cx={x} cy={y} r={11} fill={kind === 'good' ? goodFill : badFill} stroke={kind === 'good' ? good : bad} strokeWidth="1.8" />
    <path d={kind === 'good' ? `M${x - 5} ${y}h10M${x} ${y - 5}v10` : `M${x - 5} ${y}h10`} stroke={kind === 'good' ? good : bad} strokeWidth="2.6" /></g>
}
function Balance({ x, y, tilt = 0, s = 1 }: { x: number; y: number; tilt?: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 0h20l-10 -30Z" fill={panelFill} stroke={muted} strokeWidth="1.8" />
    <g transform={`rotate(${tilt} 0 -30)`}>
      <path d="M-34 -30H34" stroke={muted} strokeWidth="2.6" />
      <path d="M-34 -30l-8 16h16Z M34 -30l-8 16h16Z" fill="none" stroke={muted} strokeWidth="1.4" />
      <path d="M-44 -14q10 6 20 0M24 -14q10 6 20 0" stroke={muted} strokeWidth="2" fill="none" />
    </g>
  </g>
}

// ---------- The comparison table ----------
const LABEL_X = 14, PL_X = 170, PA_X = 400, PL_W = 222, PA_W = 186, ROW_Y = 104, ROW_H = 54, ROW_GAP = 5
const rowY = (i: number) => ROW_Y + i * (ROW_H + ROW_GAP)
type Cell = { icon: (x: number, y: number) => ReactNode; lines: string[] }
const CELLS: [Cell, Cell][] = [
  [{ icon: (x, y) => <Barrel x={x} y={y + 44} />, lines: ['crude oil'] },
    { icon: (x, y) => <Tree x={x} y={y + 48} />, lines: ['wood'] }],
  [{ icon: (x, y) => <Factory x={x - 17} y={y + 48} s={.58} />, lines: ['cracking and', 'polymerisation;', 'little waste'] },
    { icon: (x, y) => <g><Factory x={x - 17} y={y + 48} s={.58} /><Bolt x={x + 14} y={y + 16} s={.55} /></g>, lines: ['pulping: lots', 'of energy and', 'lots of waste'] }],
  [{ icon: (x, y) => <g><PlasticBag x={x} y={y + 40} s={.36} /><Loop x={x} y={y + 28} r={16} /></g>, lines: ['reused several', 'times, e.g. as', 'a bin liner'] },
    { icon: (x, y) => <g><PaperBag x={x} y={y + 44} s={.5} /></g>, lines: ['usually used', 'once'] }],
  [{ icon: (x, y) => <Mound x={x} y={y + 44} />, lines: ['recyclable, but', 'not usually', 'biodegradable'] },
    { icon: (x, y) => <g><Loop x={x - 2} y={y + 26} r={13} /><Leaf x={x + 12} y={y + 40} /></g>, lines: ['recyclable,', 'biodegradable,', 'non-toxic'] }],
]
function CellBox({ x, w, y, cell, state, stage }: { x: number; w: number; y: number; cell?: Cell; state: 'empty' | 'on' | 'dim' | 'hot'; stage: number }) {
  const s = lcaStages[stage]
  if (state === 'empty' || !cell) return <rect x={x} y={y} width={w} height={ROW_H} rx={14} fill="white" stroke={panelLine} strokeWidth="1.5" strokeDasharray="5 5" />
  const lh = 16, top = y + ROW_H / 2 - ((cell.lines.length - 1) * lh) / 2 + 4.5
  return <g opacity={state === 'dim' ? faded : 1}>
    {state === 'hot' && <rect x={x - 5} y={y - 5} width={w + 10} height={ROW_H + 10} rx={18} fill={halo} opacity=".55" />}
    <rect x={x} y={y} width={w} height={ROW_H} rx={14} fill={panelFill} stroke={state === 'dim' ? panelLine : s.line} strokeWidth={state === 'dim' ? 1.4 : 1.8} />
    {cell.icon(x + 26, y)}
    <text x={x + 52} y={top} fontSize="13" fontWeight="600" fill={ink}>{cell.lines.map((l, i) => <tspan key={i} x={x + 52} dy={i ? lh : 0}>{l}</tspan>)}</text>
  </g>
}
function Table({ states, header = true, tags = false }: { states: ('empty' | 'on' | 'dim' | 'hot')[]; header?: boolean; tags?: boolean }) {
  const marks: ['good' | 'bad' | null, 'good' | 'bad' | null][] = [[null, null], ['good', 'bad'], ['good', 'bad'], ['bad', 'good']]
  return <g>
    {header && <g>
      <PlasticBag x={PL_X + PL_W / 2} y={66} />
      <PaperBag x={PA_X + PA_W / 2} y={66} />
      <text x={PL_X + PL_W / 2} y={90} textAnchor="middle" fontSize="15" fontWeight="700" fill={plasticLine}>plastic bag</text>
      <text x={PA_X + PA_W / 2} y={90} textAnchor="middle" fontSize="15" fontWeight="700" fill={paperLine}>paper bag</text>
    </g>}
    {lcaStages.map((s, i) => { const y = rowY(i), dim = states[i] === 'dim'; return <g key={i}>
      <g opacity={dim ? .55 : 1}>
        <rect x={LABEL_X} y={y} width={150} height={ROW_H} rx={14} fill={s.fill} stroke={s.line} strokeWidth="1.6" />
        <Badge n={i + 1} x={LABEL_X + 18} y={y + ROW_H / 2} r={11} />
        <Lines x={LABEL_X + 36} y={y + (i === 0 ? ROW_H / 2 + 5 : 23)} lines={[['Raw materials'], ['Manufacture', 'and packaging'], ['Using the', 'product'], ['Product', 'disposal']][i]} size={13} />
      </g>
      <CellBox x={PL_X} w={PL_W} y={y} cell={CELLS[i][0]} state={states[i]} stage={i} />
      <CellBox x={PA_X} w={PA_W} y={y} cell={CELLS[i][1]} state={states[i]} stage={i} />
      {tags && marks[i][0] && <Tag x={PL_X + PL_W - 4} y={y + 4} kind={marks[i][0]!} />}
      {tags && marks[i][1] && <Tag x={PA_X + PA_W - 4} y={y + 4} kind={marks[i][1]!} />}
    </g> })}
  </g>
}
const VB = '0 0 600 370'
function TableFrame({ focus }: { focus: string }) {
  const titles: Record<string, string> = {
    'lcause-task': 'A plastic bag and a paper bag above an empty table with a row for each LCA stage: raw materials, manufacture and packaging, using the product, product disposal. Which bag is least harmful to the environment?',
    'lcause-make': 'Rows 1 and 2 filled in. Raw materials: plastic bag, crude oil; paper bag, wood. Manufacture: the plastic is made by cracking and polymerisation with little waste; making paper pulp uses lots of energy and makes lots of waste.',
    'lcause-use': 'Row 3 filled in. A plastic bag can be reused several times, for example as a bin liner. A paper bag is usually used once.',
    'lcause-dispose': 'Row 4 filled in. A plastic bag is recyclable but not usually biodegradable, and takes up landfill space. A paper bag is recyclable, biodegradable and non-toxic. Biodegradable means broken down naturally by microorganisms.',
    'lcause-table': 'The full comparison table: four stages for the plastic bag and the paper bag.',
  }
  const states: Record<string, ('empty' | 'on' | 'dim')[]> = {
    'lcause-task': ['empty', 'empty', 'empty', 'empty'],
    'lcause-make': ['on', 'on', 'empty', 'empty'],
    'lcause-use': ['dim', 'dim', 'on', 'empty'],
    'lcause-dispose': ['dim', 'dim', 'dim', 'on'],
    'lcause-table': ['on', 'on', 'on', 'on'],
  }
  const captions: Record<string, string> = {
    'lcause-task': 'Which bag is least harmful to the environment?',
    'lcause-make': 'Stages 1 and 2: where each bag comes from and how it is made',
    'lcause-use': 'Stage 3: how many times each bag is used',
    'lcause-dispose': 'biodegradable: broken down naturally by microorganisms',
    'lcause-table': 'Each bag has good points and bad points',
  }
  return <Diagram viewBox={VB} title={titles[focus]}>
    <Table states={states[focus]} />
    {focus === 'lcause-task' && <g><Balance x={PA_X - 4} y={70} s={.8} /><text x={PA_X - 4} y={30} textAnchor="middle" fontSize="18" fontWeight="700" fill={muted}>?</text></g>}
    <Caption x={300} y={358} text={captions[focus]} />
  </Diagram>
}
function Weigh() {
  return <Diagram viewBox={VB} title="The comparison table faded, with a plus or minus tag on the good and bad points for each bag at stages 2, 3 and 4, and a balance between the bags. Weigh up the good and bad points.">
    <Table states={['on', 'on', 'on', 'on']} tags />
    <Balance x={PA_X - 4} y={72} s={.8} />
    <Caption x={300} y={358} text="Good points and bad points: weigh them up" />
  </Diagram>
}
function Reason({ x, y, n, text, kind }: { x: number; y: number; n: number; text: string; kind: 'good' | 'bad' }) {
  return <g>
    <rect x={x} y={y} width={300} height={40} rx={20} fill={kind === 'good' ? goodFill : badFill} stroke={kind === 'good' ? good : bad} strokeWidth="1.6" />
    <Badge n={n} x={x + 22} y={y + 20} r={11} />
    <text x={x + 42} y={y + 25} fontSize="14" fontWeight="700" fill={ink}>{text}</text>
    <Tag x={x + 278} y={y + 20} kind={kind} />
  </g>
}
function Verdict() {
  return <Diagram viewBox="0 0 600 320" title="LCAs have shown that a plastic bag may be less harmful overall than a paper bag. It takes less energy to make (stage 2) and has a longer lifespan because it can be reused (stage 3), even though it is not usually biodegradable (stage 4).">
    <Lines x={300} y={36} anchor="middle" lines={['The plastic bag may be less harmful overall']} size={16} colour={good} />
    <ellipse cx={110} cy={190} rx={74} ry={80} fill={goodFill} opacity=".7" />
    <PlasticBag x={110} y={236} s={1.9} />
    <text x={110} y={262} textAnchor="middle" fontSize="15" fontWeight="700" fill={plasticLine}>plastic bag</text>
    <Reason x={196} y={80} n={2} text="takes less energy to make" kind="good" />
    <Reason x={196} y={132} n={3} text="longer lifespan: reused" kind="good" />
    <Reason x={196} y={184} n={4} text="not usually biodegradable" kind="bad" />
    <PaperBag x={548} y={236} s={1.1} opacity={faded + .1} />
    <text x={548} y={262} textAnchor="middle" fontSize="15" fontWeight="700" fill={paperLine} opacity={.6}>paper bag</text>
    <Caption y={300} text="Not biodegradable, but less energy and more uses" />
  </Diagram>
}
function Evidence() {
  const rows = [{ n: 2, from: ['Manufacture', 'uses less energy'], to: 'less energy to make' }, { n: 3, from: ['Using the product', 'reused several times'], to: 'longer lifespan' }]
  return <Diagram viewBox="0 0 600 320" title="Backing up a conclusion. Stage 2, manufacture, gives the reason: it takes less energy to make. Stage 3, using the product, gives the reason: it has a longer lifespan. Name the stage each reason comes from.">
    <Lines x={140} y={50} anchor="middle" lines={['from the table']} size={14} colour={muted} weight={600} />
    <Lines x={460} y={34} anchor="middle" lines={['Plastic bags may be', 'less harmful because…']} size={14} />
    {rows.map((r, i) => { const s = lcaStages[r.n - 1], y = 76 + i * 96; return <g key={i}>
      <rect x={16} y={y} width={250} height={64} rx={20} fill={s.fill} stroke={s.line} strokeWidth="1.8" />
      <Badge n={r.n} x={40} y={y + 32} r={13} />
      <text x={62} y={y + 27} fontSize="13" fontWeight="700" fill={s.line}>{r.from[0]}</text>
      <text x={62} y={y + 46} fontSize="14" fontWeight="700" fill={ink}>{r.from[1]}</text>
      <Arrow from={[272, y + 32]} to={[330, y + 32]} colour={s.line} width={2.6} />
      <rect x={338} y={y} width={244} height={64} rx={20} fill="white" stroke={s.line} strokeWidth="1.8" />
      <text x={460} y={y + 28} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{r.to}</text>
      <text x={460} y={y + 48} textAnchor="middle" fontSize="13" fontWeight="600" fill={s.line}>{`(stage ${r.n})`}</text>
    </g> })}
    <Caption y={296} text="Name the stage each reason comes from" />
  </Diagram>
}

// ---------- Section 3: problems with LCAs ----------
function Rock({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 16} ${y}q-4 -10 5 -14q7 -8 16 -3q9 1 11 10q3 7 -3 7Z`} fill="#d8cfc2" stroke="#8d7f6b" strokeWidth="1.6" />
}
function Measure() {
  const rows = [
    { t: 'energy used to make it', icon: <Bolt x={56} y={84} s={.9} />, f: .72 },
    { t: 'natural resources used', icon: <Rock x={58} y={180} />, f: .5 },
    { t: 'waste produced', icon: <Bin x={56} y={262} s={.62} />, f: .35 },
  ]
  return <Diagram title="Three effects that are easy to measure and give as numbers: the energy used to make a product, the natural resources used, and the waste produced.">
    <Lines x={300} y={34} anchor="middle" lines={['easy to measure: give as numbers']} size={16} />
    {rows.map((r, i) => { const y = 64 + i * 78; return <g key={i}>
      <rect x={20} y={y - 6} width={560} height={62} rx={20} fill={panelFill} stroke={panelLine} strokeWidth="1.4" />
      {r.icon}
      <text x={96} y={y + 31} fontSize="15" fontWeight="700" fill={ink}>{r.t}</text>
      <rect x={326} y={y + 12} width={230} height={22} rx={11} fill="white" stroke={muted} strokeWidth="1.4" />
      <rect x={328} y={y + 14} width={Math.round(226 * r.f)} height={18} rx={9} fill={energy} opacity=".75" stroke={energyLine} strokeWidth="1" />
      {Array.from({ length: 11 }, (_, k) => <path key={k} d={`M${337 + k * 21} ${y + 34}v${k % 5 ? 5 : 9}`} stroke={muted} strokeWidth="1.3" />)}
    </g> })}
    <Caption y={308} text="Each can be measured, so it gets a number in the LCA" />
  </Diagram>
}
function Hard() {
  return <Diagram title="Litter from a plastic bag caught on a fence. How unattractive it looks cannot be measured with a ruler, so the person doing the assessment has to use their own judgement.">
    <path d="M20 250H580" stroke="#b39463" strokeWidth="2" />
    <path d="M30 250V190q20 -24 50 -12q24 -22 54 -4q28 -18 52 2q26 -14 44 10V250Z" fill="#cfe6c4" stroke="#6ea46a" strokeWidth="1.6" />
    {[50, 110, 170, 230, 290].map(x => <rect key={x} x={x - 4} y={176} width={8} height={76} rx={3} fill="#e1c9a5" stroke="#8a6440" strokeWidth="1.4" />)}
    <path d="M44 196H296M44 226H296" stroke="#8a6440" strokeWidth="3" />
    <g transform="rotate(-18 150 200)"><PlasticBag x={150} y={220} s={.8} /></g>
    <path d="M226 250q4 -8 12 -6q6 4 2 6Z" fill="#f3e3c7" stroke="#a57b45" strokeWidth="1.2" />
    <path d="M262 250l6 -9l9 3l-3 6Z" fill={plastic} stroke={plasticLine} strokeWidth="1.2" />
    <rect x={318} y={214} width={130} height={20} rx={4} fill="#f6efd7" stroke="#b9a77a" strokeWidth="1.5" />
    {Array.from({ length: 12 }, (_, k) => <path key={k} d={`M${326 + k * 10.4} 234v${k % 5 ? -5 : -9}`} stroke="#b9a77a" strokeWidth="1.2" />)}
    <text x={383} y={202} textAnchor="middle" fontSize="30" fontWeight="700" fill={muted}>?</text>
    <Lines x={300} y={40} anchor="middle" lines={['how unattractive does it look?']} size={16} />
    <Person x={520} y={250} s={1.2} fill="#e4eef5" line={muted} />
    <circle cx={510} cy={168} r={4} fill="white" stroke={muted} strokeWidth="1.4" />
    <circle cx={502} cy={154} r={6} fill="white" stroke={muted} strokeWidth="1.4" />
    <path d="M438 138q-22 0 -22 -19q0 -19 24 -19h110q24 0 24 19q0 19 -24 19Z" fill="white" stroke={muted} strokeWidth="1.6" />
    <text x={495} y={124} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>my judgement</text>
    <Caption y={290} text="Hard to measure, so it needs a personal judgement" />
  </Diagram>
}
function Clipboard({ x, y }: { x: number; y: number }) {
  return <g><rect x={x - 12} y={y - 16} width={24} height={30} rx={3} fill="white" stroke={muted} strokeWidth="1.5" /><rect x={x - 6} y={y - 19} width={12} height={6} rx={2} fill={muted} /><path d={`M${x - 7} ${y - 5}h14M${x - 7} ${y + 2}h14M${x - 7} ${y + 8}h9`} stroke={panelLine} strokeWidth="1.4" /></g>
}
function Bias() {
  return <Diagram title="Two people carry out an LCA on the same plastic bag and reach different verdicts: one says not too bad, the other says very harmful. Results can change depending on who does the assessment. Biased means favouring one point of view in a way that is not backed up by facts.">
    <Lines x={300} y={34} anchor="middle" lines={['results could change depending on who does the assessment']} size={14} />
    <PlasticBag x={300} y={200} s={1.4} />
    <Person x={110} y={230} s={1.3} fill="#e4eef5" line={muted} /><Clipboard x={136} y={196} />
    <Person x={490} y={230} s={1.3} fill="#f3e6d6" line={paperLine} /><Clipboard x={464} y={196} />
    <Arrow from={[160, 180]} to={[244, 170]} colour={muted} width={1.8} dashed />
    <Arrow from={[440, 180]} to={[356, 170]} colour={muted} width={1.8} dashed />
    <g transform="rotate(-6 110 96)"><rect x={46} y={78} width={128} height={34} rx={17} fill={goodFill} stroke={good} strokeWidth="1.6" /><text x={110} y={100} textAnchor="middle" fontSize="14" fontWeight="700" fill={good}>not too bad</text></g>
    <g transform="rotate(6 490 96)"><rect x={420} y={78} width={140} height={34} rx={17} fill={badFill} stroke={bad} strokeWidth="1.6" /><text x={490} y={100} textAnchor="middle" fontSize="14" fontWeight="700" fill={bad}>very harmful</text></g>
    <rect x={90} y={260} width={420} height={38} rx={19} fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={300} y={284} textAnchor="middle" fontSize="13" fontWeight="600" fill={ink}>biased = favours one point of view, not backed by facts</text>
  </Diagram>
}
function Selective() {
  const bars = [{ t: 'energy used', w: 70, show: true }, { t: 'waste produced', w: 56, show: true }, { t: 'resources used', w: 150, show: false }, { t: 'litter', w: 130, show: false }]
  return <Diagram title="A selective LCA: a company report shows only two of its product's impacts, and the others are covered up. The company says its product is green. A selective LCA can be written to support a company's claims.">
    <Lines x={300} y={30} anchor="middle" lines={['selective LCA: only some impacts shown']} size={16} />
    <path d="M44 56h196l24 24V284H44Z" fill="white" stroke={muted} strokeWidth="1.8" />
    <path d="M240 56v24h24" fill="none" stroke={muted} strokeWidth="1.5" />
    <text x={60} y={84} fontSize="15" fontWeight="700" fill={ink}>Our LCA</text>
    {bars.map((b, i) => { const y = 104 + i * 44; return <g key={i}>
      <text x={60} y={y + 12} fontSize="13" fontWeight="600" fill={b.show ? ink : muted}>{b.t}</text>
      <rect x={60} y={y + 18} width={b.w} height={12} rx={6} fill={b.show ? energy : '#e3e7eb'} stroke={b.show ? energyLine : '#98a4ae'} strokeWidth="1" />
    </g> })}
    <path d="M52 186q60 -6 204 2V276q-80 6 -204 0Z" fill="#dfe3e7" stroke="#98a4ae" strokeWidth="1.6" />
    <text x={154} y={236} textAnchor="middle" fontSize="15" fontWeight="700" fill={muted}>hidden</text>
    <path d="M400 250V150q0 -8 8 -8h124q8 0 8 8V250Z" fill="#eaf0f4" stroke={muted} strokeWidth="1.8" />
    <circle cx={470} cy={180} r={18} fill={goodFill} stroke={good} strokeWidth="1.8" />
    <path d="M462 188q0 -16 16 -16q0 16 -16 16Z" fill={leaf} stroke={leafLine} strokeWidth="1.2" />
    {[416, 452, 488].map(x => <rect key={x} x={x} y={212} width={24} height={16} rx={4} fill="white" stroke={muted} strokeWidth="1.2" />)}
    <path d="M320 250H570" stroke="#b39463" strokeWidth="2" />
    <path d="M330 80q0 -18 20 -18h180q20 0 20 18q0 18 -20 18h-90l-20 16l2 -16h-72q-20 0 -20 -18Z" fill="white" stroke={muted} strokeWidth="1.6" />
    <text x={440} y={86} textAnchor="middle" fontSize="15" fontWeight="700" fill={good}>our product is green!</text>
    <Caption x={440} y={280} text="can support a company’s claims" />
  </Diagram>
}

// ---------- Question visual ----------
function CupTable() {
  const cols = [30, 290, 440], widths = [256, 146, 130]
  const rows = [['', 'Cup P', 'Cup Q'], ['Energy to make (units)', '3', '8'], ['Number of uses', '1', '40'], ['Recycled after use?', 'No', 'Yes']]
  return <Diagram viewBox="0 0 600 230" title="A table comparing two cups on energy to make, number of uses and whether they are recycled.">
    {rows.map((r, i) => { const y = 18 + i * 50; return <g key={i}>
      {r.map((c, j) => <g key={j}>
        <rect x={cols[j]} y={y} width={widths[j]} height={44} rx={10} fill={i === 0 ? '#e4eef5' : panelFill} stroke={panelLine} strokeWidth="1.5" />
        <text x={j === 0 ? cols[j] + 14 : cols[j] + widths[j] / 2} y={y + 28} textAnchor={j === 0 ? 'start' : 'middle'} fontSize={i === 0 || j === 0 ? 15 : 17} fontWeight="700" fill={ink}>{c}</text>
      </g>)}
    </g> })}
  </Diagram>
}

export function LcaCompareVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  if (['lcause-task', 'lcause-make', 'lcause-use', 'lcause-dispose', 'lcause-table'].includes(focus)) return <TableFrame focus={focus} />
  if (focus === 'lcause-weigh') return <Weigh />
  if (focus === 'lcause-verdict') return <Verdict />
  if (focus === 'lcause-evidence') return <Evidence />
  if (focus === 'lcause-measure') return <Measure />
  if (focus === 'lcause-hard') return <Hard />
  if (focus === 'lcause-bias') return <Bias />
  if (focus === 'lcause-selective') return <Selective />
  if (focus === 'lcause-q-table') return <CupTable />
  return <TableFrame focus="lcause-table" />
}

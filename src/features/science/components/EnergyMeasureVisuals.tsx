import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C5 (Chemistry Lesson 29): measuring energy changes. Original, code-native schematics; not to scale.
 * Focus ids start with 'calor-'.
 *
 * Colour code: coral (the proton tint) = temperature rise / energy given out; electron-blue = temperature fall / energy
 * taken in; reaction mixture is pale blue liquid; energy escaping is drawn as coral arrows. Ink, greys and panels come
 * from `atomPalette`. Assessment views show numbered badges instead of part names.
 */
const { ink, muted, panelFill, panelLine, protonFill, protonLine, electronFill, electronLine } = atomPalette
const coralSoft = '#fbe4e0', blueSoft = '#e0edf8'
const liquid = '#e4f1f8', glass = '#8fb0c4', red = '#c9422b', good = '#3f8a5f', goodSoft = '#e3f3e8'

function Diagram({ title, children, viewBox = '0 0 540 340' }: { title: string; children: ReactNode; viewBox?: string }) {
  const id = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={id}><title id={id}>{`${title} Original schematic, not to scale.`}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

// ---------- Thermometers ----------
const T0 = 40 // y of 40 degrees C
const ty = (deg: number) => T0 + (40 - deg) * 5
function Thermo({ x, deg, colour = red }: { x: number; deg: number; colour?: string }) {
  return <g>
    <rect x={x - 6} y={T0 - 8} width="12" height="216" rx="6" fill="#fff" stroke={glass} strokeWidth="2" />
    <rect x={x - 3} y={ty(deg)} width="6" height={T0 + 218 - ty(deg)} fill={colour} />
    <circle cx={x} cy={T0 + 218} r="13" fill={colour} stroke={glass} strokeWidth="2" />
    {[0, 10, 20, 30, 40].map(d => <g key={d}><path d={`M${x - 12} ${ty(d)}h6`} stroke={ink} strokeWidth="1.5" /><text x={x - 16} y={ty(d) + 4} textAnchor="end" fontSize="12" fill={muted}>{d}</text></g>)}
  </g>
}

function TempPair({ start, end, endLabel, calc, note }: { start: number; end: number; endLabel: string; calc?: boolean; note?: string }) {
  const up = end > start
  const fmt = (n: number) => n.toFixed(1)
  const sx = 120, ex = 380
  return <Diagram viewBox="0 0 540 350" title={`Two thermometers. At the start the temperature is ${fmt(start)} degrees Celsius. After the reactants are mixed the ${endLabel.toLowerCase()} temperature is ${fmt(end)} degrees Celsius.${calc ? ` The temperature change is ${fmt(end)} minus ${fmt(start)}, which is ${fmt(end - start)} degrees Celsius.` : ''}`}>
    <text x={sx} y="22" textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Start</text>
    <text x={ex} y="22" textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{endLabel}</text>
    <Thermo x={sx} deg={start} />
    <Thermo x={ex} deg={end} colour={red} />
    <g fontSize="16" fontWeight="700" fill={ink}>
      <path d={`M${sx + 9} ${ty(start)}h22`} stroke={ink} strokeWidth="1.5" /><text x={sx + 36} y={ty(start) + 5}>{fmt(start)} °C</text>
      <path d={`M${ex + 9} ${ty(end)}h22`} stroke={ink} strokeWidth="1.5" /><text x={ex + 36} y={ty(end) + 5}>{fmt(end)} °C</text>
    </g>
    {calc !== undefined && <g>
      <path d="M248 150H304" stroke={ink} strokeWidth="3" /><path d="M304 150l-11 -7v14z" fill={ink} stroke={ink} />
      <text x="276" y="138" textAnchor="middle" fontSize="14" fill={ink}>mix</text>
    </g>}
    {calc ? <g>
      <rect x="60" y="292" width="420" height="46" rx="10" fill={up ? coralSoft : blueSoft} stroke={up ? protonLine : electronLine} strokeWidth="2" />
      <text x="270" y="312" textAnchor="middle" fontSize="14" fill={ink}>temperature change = {up ? 'highest' : 'lowest'} − start</text>
      <text x="270" y="331" textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{fmt(end)} − {fmt(start)} = {fmt(end - start)} °C</text>
    </g> : <text x="270" y="335" textAnchor="middle" fontSize="14" fill={ink}>{note ?? 'Record the temperature before mixing, then the extreme after.'}</text>}
  </Diagram>
}

// ---------- Rise or fall ----------
function Sign() {
  const card = (x: number, up: boolean) => {
    const fill = up ? coralSoft : blueSoft, line = up ? protonLine : electronLine
    return <g>
      <rect x={x} y="16" width="240" height="220" rx="14" fill={fill} stroke={line} strokeWidth="2" />
      <path d={up ? `M${x + 50} 150V70` : `M${x + 50} 70V150`} stroke={line} strokeWidth="6" />
      <path d={up ? `M${x + 50} 56l-16 24h32z` : `M${x + 50} 164l-16 -24h32z`} fill={line} stroke={line} strokeWidth="2" />
      <text x={x + 82} y="78" fontSize="16" fontWeight="700" fill={ink}>{up ? 'Temperature' : 'Temperature'}</text>
      <text x={x + 82} y="98" fontSize="16" fontWeight="700" fill={ink}>{up ? 'goes up' : 'goes down'}</text>
      <text x={x + 82} y="126" fontSize="14" fill={ink}>{up ? 'energy given out' : 'energy taken in'}</text>
      <text x={x + 82} y="144" fontSize="14" fill={ink}>{up ? 'record the highest' : 'record the lowest'}</text>
      <rect x={x + 30} y="182" width="180" height="34" rx="17" fill="#fff" stroke={line} strokeWidth="2" />
      <text x={x + 120} y="205" textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>{up ? 'exothermic' : 'endothermic'}</text>
    </g>
  }
  return <Diagram viewBox="0 0 540 252" title="Two panels. A temperature that goes up means energy was given out to the surroundings, so the reaction is exothermic. A temperature that goes down means energy was taken in from the surroundings, so the reaction is endothermic.">
    {card(20, true)}{card(280, false)}
  </Diagram>
}

// ---------- The polystyrene-cup apparatus ----------
type AppStage = 'cup' | 'lid' | 'cotton' | 'labelled' | 'numbered'
const APP_TITLES: Record<AppStage, string> = {
  cup: 'A polystyrene cup holding the reaction mixture, with a thermometer in it and no lid. Coral arrows show energy escaping to the surroundings through the top and the sides.',
  lid: 'The same cup with a lid on top, with a small hole for the thermometer. The lid blocks the top, but coral arrows show energy still escaping through the sides.',
  cotton: 'The lidded cup now stands inside a large beaker packed with cotton wool. The cotton wool traps air around the cup, so much less energy escapes.',
  labelled: 'The finished apparatus, labelled: a thermometer through a lid, a polystyrene cup holding the reaction mixture, standing in a large beaker packed with cotton wool.',
  numbered: 'The apparatus for measuring a temperature change, with six numbered parts: a lid, a thermometer, cotton wool, a polystyrene cup, the reaction mixture and a large beaker.',
}
const CAPTIONS: Partial<Record<AppStage, string>> = {
  cup: 'Open cup: energy escapes from the top and sides',
  lid: 'Lid on: the top is blocked, the sides still leak',
  cotton: 'Cotton wool traps air, so far less energy escapes',
}
function Apparatus({ stage }: { stage: AppStage }) {
  const id = useId()
  const m = `${id}m`
  const showLid = stage !== 'cup'
  const showBeaker = stage === 'cotton' || stage === 'labelled' || stage === 'numbered'
  const arrows: Array<[number, number, number, number]> = []
  if (stage === 'cup') arrows.push([225, 116, 225, 76], [315, 116, 315, 76])
  if (stage === 'cup' || stage === 'lid') arrows.push([208, 168, 164, 168], [332, 168, 376, 168], [212, 236, 168, 236], [328, 236, 372, 236])
  const cotton: Array<[number, number]> = [[166, 150], [171, 182], [167, 214], [172, 246], [169, 278], [374, 150], [369, 182], [373, 214], [367, 246], [371, 278], [200, 284], [235, 288], [270, 290], [305, 288], [340, 284]]
  const pointer = (x1: number, y1: number, x2: number, y2: number) => <g><path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={muted} strokeWidth="1.5" /><circle cx={x2} cy={y2} r="3.5" fill={ink} /></g>
  const label = (text: string, x: number, y: number, anchor: 'start' | 'end') => <text x={x} y={y} textAnchor={anchor} fontSize="14" fontWeight="700" fill={ink}>{text}</text>
  const badge = (n: number, x: number, y: number) => <g><circle cx={x} cy={y} r="13" fill="#fff" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{n}</text></g>
  const named = stage === 'labelled', numbered = stage === 'numbered'
  return <Diagram title={APP_TITLES[stage]}>
    <defs><marker id={m} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={protonLine} /></marker></defs>
    {showBeaker && <g>
      {cotton.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="15" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />)}
      <path d="M150 110V282Q150 298 166 298H374Q390 298 390 282V110" fill="none" stroke={glass} strokeWidth="3" />
    </g>}
    <path d="M205 128H335L315 280H225Z" fill="#fff" stroke="#7d8b96" strokeWidth="2.5" />
    <path d="M215.1 205H324.9L315 280H225Z" fill={liquid} />
    {showLid && <rect x="198" y="120" width="144" height="9" rx="3" fill="#cfd8de" stroke="#7d8b96" strokeWidth="2" />}
    <rect x="266" y="50" width="8" height="220" rx="4" fill="#fff" stroke={glass} strokeWidth="2" />
    <rect x="268" y="172" width="4" height="96" fill={red} />
    <circle cx="270" cy="271" r="8" fill={red} stroke={glass} strokeWidth="2" />
    {arrows.map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} stroke={protonLine} strokeWidth="4" markerEnd={`url(#${m})`} />)}
    {named && <g>
      {pointer(142, 60, 264, 60)}{label('thermometer', 134, 65, 'end')}
      {pointer(142, 112, 203, 125)}{label('lid', 134, 117, 'end')}
      {pointer(398, 134, 389, 134)}{label('large beaker', 404, 139, 'start')}
      {pointer(398, 185, 331, 190)}{label('polystyrene cup', 404, 190, 'start')}
      {pointer(398, 235, 312, 240)}{label('reaction mixture', 404, 240, 'start')}
      {pointer(398, 285, 378, 279)}{label('cotton wool', 404, 290, 'start')}
    </g>}
    {numbered && <g>
      {pointer(139, 60, 264, 60)}{badge(2, 126, 60)}
      {pointer(139, 112, 203, 125)}{badge(1, 126, 112)}
      {pointer(405, 134, 389, 134)}{badge(6, 418, 134)}
      {pointer(405, 185, 331, 190)}{badge(4, 418, 185)}
      {pointer(405, 235, 312, 240)}{badge(5, 418, 235)}
      {pointer(405, 285, 378, 279)}{badge(3, 418, 285)}
    </g>}
    {CAPTIONS[stage] && <text x="270" y="331" textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{CAPTIONS[stage]}</text>}
  </Diagram>
}

// ---------- Variables, method, results ----------
function Vars() {
  const rows: Array<{ tag: string; fill: string; line: string; lines: string[] }> = [
    { tag: 'Change', fill: coralSoft, line: protonLine, lines: ['Acid concentration:', '10, then 20, then 30 g/dm³'] },
    { tag: 'Measure', fill: blueSoft, line: electronLine, lines: ['The highest temperature,', 'then the temperature change'] },
    { tag: 'Keep the same', fill: goodSoft, line: good, lines: ['25 cm³ of each solution', 'the same start temperature, 25 °C', 'the same cup, lid and cotton wool'] },
  ]
  let y = 14
  return <Diagram viewBox="0 0 540 300" title="A planning table for testing the effect of acid concentration. Change: the acid concentration, 10, 20 and 30 grams per cubic decimetre. Measure: the highest temperature and the temperature change. Keep the same: 25 cubic centimetres of each solution, the same start temperature of 25 degrees Celsius, and the same cup, lid and cotton wool.">
    {rows.map(r => {
      const h = r.lines.length === 3 ? 100 : 76, top = y
      y += h + 14
      return <g key={r.tag}>
        <rect x="20" y={top} width="500" height={h} rx="12" fill={r.fill} stroke={r.line} strokeWidth="2" />
        <text x="36" y={top + h / 2 + 6} fontSize="17" fontWeight="700" fill={ink}>{r.tag}</text>
        {r.lines.map((l, i) => <text key={i} x="190" y={top + h / 2 - (r.lines.length - 1) * 11 + i * 22 + 5} fontSize="15" fill={ink}>{l}</text>)}
      </g>
    })}
  </Diagram>
}

const STEPS: string[][] = [
  ['Measure 25 cm³ of acid and 25 cm³ of', 'sodium hydroxide into separate beakers.'],
  ['Stand both in a 25 °C water bath until', 'they reach the same temperature.'],
  ['Pour both into the lidded cup, which', 'stands in a beaker of cotton wool.'],
  ['Read the temperature every 30 seconds.', 'Note the highest reading.'],
  ['Work out the temperature change:', 'highest − start.'],
  ['Repeat with 20, then 30 g/dm³ acid.', 'Compare the temperature changes.'],
]
function Method({ hi }: { hi: number[] }) {
  const title = hi[0] === 0 ? 'Steps 1 to 3 of the method: measure equal volumes, bring both to the same temperature, then mix them in the lidded cup.' : 'Steps 4 to 6 of the method: record the temperature every 30 seconds, work out the temperature change, then repeat with stronger acid and compare.'
  return <Diagram viewBox="0 0 540 340" title={title}>
    {STEPS.map((s, i) => {
      const on = hi.includes(i), y = 10 + i * 54
      return <g key={i} opacity={on ? 1 : 0.32}>
        <rect x="14" y={y} width="512" height="46" rx="10" fill={on ? panelFill : '#fff'} stroke={on ? protonLine : panelLine} strokeWidth={on ? 2 : 1.5} />
        <circle cx="42" cy={y + 23} r="14" fill={on ? coralSoft : "#fff"} stroke={on ? protonLine : muted} strokeWidth="2" /><text x="42" y={y + 28} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{i + 1}</text>
        <text x="68" y={y + 20} fontSize="14" fill={ink}>{s[0]}</text><text x="68" y={y + 38} fontSize="14" fill={ink}>{s[1]}</text>
      </g>
    })}
  </Diagram>
}

function Results() {
  const data: Array<[number, number]> = [[10, 4.5], [20, 8.0], [30, 10.5]]
  const y0 = 232, k = 16
  return <Diagram viewBox="0 0 540 310" title="Bar chart of example results. Temperature change in degrees Celsius against acid concentration in grams per cubic decimetre. 10 gives 4.5, 20 gives 8.0 and 30 gives 10.5, so the bars get taller as the concentration rises.">
    {[0, 4, 8, 12].map(v => <g key={v}><path d={`M78 ${y0 - v * k}H510`} stroke={panelLine} strokeWidth="1.5" /><text x="70" y={y0 - v * k + 4} textAnchor="end" fontSize="13" fill={muted}>{v}</text></g>)}
    <path d={`M78 ${y0 - 12 * k}V${y0}`} stroke={ink} strokeWidth="2" /><path d={`M78 ${y0}H510`} stroke={ink} strokeWidth="2" />
    {data.map(([c, v], i) => {
      const cx = 170 + i * 120
      return <g key={c}><rect x={cx - 36} y={y0 - v * k} width="72" height={v * k} rx="4" fill={protonFill} stroke={protonLine} strokeWidth="2" />
        <text x={cx} y={y0 - v * k - 8} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{v.toFixed(1)}</text>
        <text x={cx} y={y0 + 20} textAnchor="middle" fontSize="14" fill={ink}>{c}</text></g>
    })}
    <text x="294" y="278" textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>Acid concentration (g/dm³)</text>
    <text x="22" y="132" textAnchor="middle" fontSize="14" fontWeight="700" fill={ink} transform="rotate(-90 22 132)">Temperature change (°C)</text>
    <text x="294" y="302" textAnchor="middle" fontSize="12" fill={muted}>Example results, invented for this lesson</text>
  </Diagram>
}

function Table() {
  const rows = [['10', '25.0', '29.0'], ['20', '22.0', '30.5'], ['30', '24.0', '36.0']]
  const cols = [20, 190, 350], w = [170, 160, 170]
  return <Diagram viewBox="0 0 540 230" title="A results table for three tests with different acid concentrations. Each row gives the acid concentration in grams per cubic decimetre, the start temperature and the highest temperature in degrees Celsius. Test 10: 25.0 and 29.0. Test 20: 22.0 and 30.5. Test 30: 24.0 and 36.0.">
    {['Acid (g/dm³)', 'Start (°C)', 'Highest (°C)'].map((h, i) => <g key={h}><rect x={cols[i]} y="20" width={w[i]} height="42" fill={blueSoft} stroke={electronLine} strokeWidth="2" /><text x={cols[i] + w[i] / 2} y="46" textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{h}</text></g>)}
    {rows.map((r, j) => r.map((c, i) => <g key={`${j}${i}`}><rect x={cols[i]} y={62 + j * 44} width={w[i]} height="44" fill="#fff" stroke={panelLine} strokeWidth="2" /><text x={cols[i] + w[i] / 2} y={90 + j * 44} textAnchor="middle" fontSize="16" fill={ink}>{c}</text></g>))}
  </Diagram>
}

export function EnergyMeasureVisual({ focus }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'calor-change-both': return <TempPair start={21.0} end={27.5} endLabel="Highest" calc={false} />
    case 'calor-change-calc': return <TempPair start={21.0} end={27.5} endLabel="Highest" calc />
    case 'calor-sign': return <Sign />
    case 'calor-cup': return <Apparatus stage="cup" />
    case 'calor-lid': return <Apparatus stage="lid" />
    case 'calor-cotton': return <Apparatus stage="cotton" />
    case 'calor-labelled': return <Apparatus stage="labelled" />
    case 'calor-vars': return <Vars />
    case 'calor-method-a': return <Method hi={[0, 1, 2]} />
    case 'calor-method-b': return <Method hi={[3, 4, 5]} />
    case 'calor-results': return <Results />
    case 'calor-q-cup': return <Apparatus stage="numbered" />
    case 'calor-q-thermo': return <TempPair start={24.0} end={18.5} endLabel="Lowest" calc={false} note="Read both thermometers." />
    case 'calor-q-table': return <Table />
    default: return <Apparatus stage="labelled" />
  }
}

import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram, GraphAxes, graphScale, type GraphFrame, type Pt } from './PhysicsKit'
import { Circuit, Tag, pdTag, currentTag, resTag, Caption, EqCard, Arrow, Halo, Card, faded, type Part } from './OhmVisuals'

/*
 * Physics Lesson 17: Investigating resistance in a wire (required practical). Original schematics; not to scale.
 * Focus ids start with 'wirer-'.
 *
 * One circuit is reused through the set-up and method walkthroughs: a battery and switch on the top wire, an ammeter
 * on the right, and the test wire lying along a metre ruler with two crocodile clips; the voltmeter is on its own
 * branch across the clipped length. The step being taught is highlighted and the rest is left plain or faded.
 * Colours (PhysicsKit): pd violet, current vermilion, resistance and the test wire brown, heat red.
 */
const { ink, muted } = P
const wood = '#f3e3c3', woodLine = '#c4a36a', clipDark = '#4d5b68', clipRed = '#c65a4c', warm = '#e8674f'

// ---------- The ruler, the test wire and the clips ----------
type RulerView = { x0: number; scale: number; y: number; from?: number; to?: number; big?: boolean }
const at = (v: RulerView, cm: number) => Math.round((v.x0 + v.scale * cm) * 10) / 10

function Clip({ x, y, red = false, ghost = false }: { x: number; y: number; red?: boolean; ghost?: boolean }) {
  const c = red ? clipRed : clipDark
  return <g opacity={ghost ? 0.3 : 1}>
    <path d={`M${x - 8} ${y - 24}H${x + 8}L${x + 4} ${y - 4}Q${x} ${y + 2} ${x - 4} ${y - 4}Z`} fill={c} fillOpacity=".85" stroke={c} strokeWidth="1.6" />
    <path d={`M${x - 5} ${y - 16}H${x + 5}`} stroke="white" strokeWidth="1.6" opacity=".7" />
  </g>
}

function Ruler({ v, heated, highlight }: { v: RulerView; heated?: [number, number]; highlight?: [number, number] }) {
  const from = v.from ?? -3, to = v.to ?? 63, top = v.y + 8, h = v.big ? 38 : 30
  const ticks = Array.from({ length: Math.floor(to) + 1 }, (_, i) => i).filter(i => i >= 0 && i <= to - 2)
  return <g>
    <rect x={at(v, from)} y={top} width={at(v, to) - at(v, from)} height={h} rx="5" fill={wood} stroke={woodLine} strokeWidth="1.6" />
    {ticks.map(cm => <path key={cm} d={`M${at(v, cm)} ${top}v${cm % 10 === 0 ? 11 : cm % 5 === 0 ? 7 : 4}`} stroke={woodLine} strokeWidth={cm % 10 === 0 ? 1.6 : 1} />)}
    {ticks.filter(cm => cm % 10 === 0 && cm <= to - 8).map(cm => <text key={cm} x={at(v, cm)} y={top + h - 5} textAnchor="middle" fontSize="12" fontWeight="650" fill="#8a6a36">{cm}</text>)}
    <text x={at(v, to) - 6} y={top + h - 5} textAnchor="end" fontSize="12" fontWeight="650" fill="#8a6a36">cm</text>
    {highlight && <Halo x={(at(v, highlight[0]) + at(v, highlight[1])) / 2} y={v.y} w={at(v, highlight[1]) - at(v, highlight[0]) + 16} h={20} />}
    {heated && <path d={`M${at(v, heated[0])} ${v.y}H${at(v, heated[1])}`} stroke={warm} strokeWidth="10" opacity=".22" />}
    <path d={`M${at(v, from) + 4} ${v.y}H${at(v, to) - 4}`} stroke={P.resistance} strokeWidth="2.2" />
  </g>
}

// ---------- The full circuit ----------
const V: RulerView = { x0: 100, scale: 6.4, y: 170 }
const TOP = 40, LEFT = 50, RIGHT = 490, LEAD = 128, VB = 96
type Show = { length: number; switchClosed?: boolean; voltmeter?: boolean; hi?: 'ammeter' | 'voltmeter' | 'switch' | 'clip'; dimAll?: boolean; heated?: boolean; readings?: boolean; arrows?: boolean }
function FullCircuit({ s }: { s: Show }) {
  const x0 = at(V, 0), xL = at(V, s.length), mid = (x0 + xL) / 2
  const dimOthers = s.hi === 'voltmeter' || s.hi === 'switch'
  const parts: Part[] = [
    { kind: 'battery', x: 170, y: TOP, dim: dimOthers },
    { kind: s.switchClosed ? 'switchClosed' : 'switchOpen', x: 340, y: TOP, hi: s.hi === 'switch', dim: dimOthers && s.hi !== 'switch' },
    { kind: 'ammeter', x: RIGHT, y: 84, rotate: 90, hi: s.hi === 'ammeter', dim: dimOthers && s.hi !== 'ammeter' },
  ]
  const vParts: Part[] = [{ kind: 'voltmeter', x: mid, y: VB, hi: s.hi === 'voltmeter' }]
  return <g>
    <Circuit dim={dimOthers && s.hi !== 'ammeter' && s.hi !== 'switch'} runs={[
      [[LEFT + 60, TOP], [LEFT, TOP], [LEFT, LEAD], [x0, LEAD], [x0, V.y - 24]],
      [[LEFT + 60, TOP], [RIGHT, TOP], [RIGHT, LEAD], [xL, LEAD], [xL, V.y - 24]],
    ]} parts={parts} arrows={s.arrows ? [{ x: 250, y: TOP, rotate: 0 }, { x: RIGHT, y: 116, rotate: 90 }, { x: LEFT, y: 90, rotate: -90 }] : []} />
    {s.voltmeter && <g opacity={s.hi && s.hi !== 'voltmeter' && s.hi !== 'clip' ? faded : 1}>
      <Circuit runs={[[[x0, LEAD], [x0, VB], [xL, VB], [xL, LEAD]]]} parts={vParts} junctions={[[x0, LEAD], [xL, LEAD]]} />
    </g>}
    <text x={151} y={26} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink} opacity={dimOthers ? faded : 1}>+</text>
    <Ruler v={V} heated={s.heated ? [0, s.length] : undefined} highlight={s.hi === 'clip' ? [0, s.length] : undefined} />
    <Clip x={x0} y={V.y} />
    <Clip x={xL} y={V.y} red />
    {s.readings && <g>
      {currentTag(RIGHT - 26, 84, '0.30 A', 'end')}
      {pdTag(mid, VB - 30, '0.60 V')}
    </g>}
  </g>
}

// ---------- Meter faces, for the calculation ----------
function MeterFace({ x, y, reading, letter, colour }: { x: number; y: number; reading: string; letter: string; colour: string }) {
  return <g>
    <rect x={x - 62} y={y - 58} width={124} height={116} rx="18" fill="#eef2f5" stroke={ink} strokeWidth="2" />
    <rect x={x - 48} y={y - 44} width={96} height={44} rx="8" fill="#eaf3e3" stroke="#8aa37a" strokeWidth="1.6" />
    <text x={x} y={y - 13} textAnchor="middle" fontSize="24" fontWeight="750" fill={colour}>{reading}</text>
    <circle cx={x} cy={y + 30} r="15" fill="white" stroke={ink} strokeWidth="2" />
    <text x={x} y={y + 36} textAnchor="middle" fontSize="16" fontWeight="750" fill={ink}>{letter}</text>
  </g>
}

// ---------- Graph ----------
const G: GraphFrame = { x: 96, y: 34, width: 360, height: 186, xMax: 50, yMax: 10 }
const results: Pt[] = [[10, 2], [20, 4], [30, 6], [40, 8]]
function Cross({ at: [x, y], colour = ink }: { at: Pt; colour?: string }) {
  return <path d={`M${x - 5} ${y - 5}l10 10M${x + 5} ${y - 5}l-10 10`} stroke={colour} strokeWidth="2.4" />
}
function Graph({ line, grid = false, points = results, children }: { line?: 'dashed' | 'solid'; grid?: boolean; points?: Pt[]; children?: ReactNode }) {
  const s = graphScale(G)
  return <g>
    <GraphAxes frame={G} xLabel="Length of wire" xUnit="cm" yLabel="Resistance" yUnit="Ω" xTicks={[10, 20, 30, 40, 50]} yTicks={[2, 4, 6, 8, 10]} grid={grid} />
    {line && <path d={s.path([[0, 0], [50, 10]])} stroke={P.resistance} strokeWidth="2.6" strokeDasharray={line === 'dashed' ? '8 7' : undefined} fill="none" />}
    {points.map(([a, b]) => <Cross key={a} at={s.pt(a, b)} />)}
    {children}
  </g>
}

export function WireResistVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wirer-question': return <PhysicsDiagram title="A short wire and a long wire of the same metal and thickness. The length is what we change (independent variable); the resistance is what we measure (dependent variable).">
      {[{ y: 70, len: 130 }, { y: 170, len: 230 }].map(({ y, len }) => <g key={y}>
        <path d={`M40 ${y}H${40 + len}`} stroke={P.resistance} strokeWidth="4" />
        <circle cx={40} cy={y} r="4.5" fill={P.resistance} /><circle cx={40 + len} cy={y} r="4.5" fill={P.resistance} />
        <path d={`M40 ${y + 16}V${y + 30}M${40 + len} ${y + 16}V${y + 30}`} stroke={P.charge} strokeWidth="1.6" />
        <Arrow from={[40 + len / 2, y + 23]} to={[44, y + 23]} colour={P.charge} width={1.8} />
        <Arrow from={[40 + len / 2, y + 23]} to={[36 + len, y + 23]} colour={P.charge} width={1.8} />
        {resTag(56 + len, y, 'R = ?', 'start')}
      </g>)}
      <text x={40} y={128} fontSize="13" fontWeight="650" fill={P.charge}>short</text>
      <text x={40} y={228} fontSize="13" fontWeight="650" fill={P.charge}>long</text>
      <Card x={356} y={34} w={172} h={96} fill="#e7f1fa" line={P.charge}>
        <text x={436} y={66} textAnchor="middle" fontSize="15" fontWeight="750" fill={P.chargeLine}>length</text>
        <text x={436} y={88} textAnchor="middle" fontSize="13" fontWeight="650" fill={ink}>what we change</text>
        <text x={436} y={112} textAnchor="middle" fontSize="12.5" fontWeight="700" fontStyle="italic" fill={muted}>independent variable</text>
      </Card>
      <Card x={356} y={160} w={172} h={96} fill={P.resistanceFill} line={P.resistance}>
        <text x={436} y={192} textAnchor="middle" fontSize="15" fontWeight="750" fill={P.resistance}>resistance</text>
        <text x={436} y={214} textAnchor="middle" fontSize="13" fontWeight="650" fill={ink}>what we measure</text>
        <text x={436} y={238} textAnchor="middle" fontSize="12.5" fontWeight="700" fontStyle="italic" fill={muted}>dependent variable</text>
      </Card>
      <Caption text="same metal, same thickness" x={170} y={280} />
    </PhysicsDiagram>
    case 'wirer-loop': return <PhysicsDiagram title="The series loop: battery, switch, test wire on a metre ruler and an ammeter, one after another in one loop.">
      <FullCircuit s={{ length: 30, switchClosed: true, hi: 'ammeter', arrows: true }} />
      <Tag x={300} y={98} text="series: one loop" colour={P.current} fill="#fbe5dc" size={14} />
      <text x={RIGHT - 36} y={66} textAnchor="end" fontSize="13" fontWeight="700" fill={ink}>ammeter</text>
      <Caption text="ammeter in series with the test wire" y={272} />
    </PhysicsDiagram>
    case 'wirer-voltmeter': return <PhysicsDiagram title="The voltmeter is connected in parallel, on its own branch across the test wire between the clips.">
      <FullCircuit s={{ length: 30, voltmeter: true, hi: 'voltmeter' }} />
      <text x={310} y={92} fontSize="14" fontWeight="700" fill={P.pd}>parallel:</text>
      <text x={310} y={110} fontSize="14" fontWeight="700" fill={P.pd}>across the test wire</text>
      <Caption text="voltmeter on its own branch" y={272} />
    </PhysicsDiagram>
    case 'wirer-clips': {
      const v: RulerView = { x0: 70, scale: 8, y: 150, from: -4, to: 54, big: true }
      return <PhysicsDiagram title="Close-up: the test wire along a metre ruler, one crocodile clip at 0 cm and one at 30 cm. The wire between the clips is the length being tested.">
        <path d={`M${at(v, 0)} 66V${v.y - 24}M${at(v, 30)} 66V${v.y - 24}`} stroke={P.wire} strokeWidth="2.5" />
        <text x={at(v, 15)} y={54} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>leads to the circuit</text>
        <Ruler v={v} highlight={[0, 30]} />
        <Clip x={at(v, 0)} y={v.y} />
        <Clip x={at(v, 30)} y={v.y} red />
        <path d={`M${at(v, 0)} 222V240M${at(v, 30)} 222V240`} stroke={P.resistance} strokeWidth="1.6" />
        <Arrow from={[at(v, 15), 231]} to={[at(v, 0) + 3, 231]} colour={P.resistance} width={1.8} />
        <Arrow from={[at(v, 15), 231]} to={[at(v, 30) - 3, 231]} colour={P.resistance} width={1.8} />
        <text x={at(v, 15)} y={262} textAnchor="middle" fontSize="14" fontWeight="700" fill={P.resistance}>length being tested: 30 cm</text>
        <text x={at(v, 0) + 12} y={112} fontSize="13" fontWeight="700" fill={ink}>stays at 0 cm</text>
        <text x={at(v, 30) + 12} y={112} fontSize="13" fontWeight="700" fill={clipRed}>moves along →</text>
      </PhysicsDiagram>
    }
    case 'wirer-set-length': return <PhysicsDiagram title="First length: one clip at 0 cm and the other at 10 cm. Write down the length, 10 cm.">
      <FullCircuit s={{ length: 10, voltmeter: true, hi: 'clip' }} />
      <Tag x={330} y={250} text="write down the length: 10 cm" colour={P.resistance} fill={P.resistanceFill} size={14} />
    </PhysicsDiagram>
    case 'wirer-read': return <PhysicsDiagram title="Switch closed: the ammeter reads 0.30 A and the voltmeter reads 0.60 V. Write both down with their units.">
      <FullCircuit s={{ length: 10, voltmeter: true, switchClosed: true, readings: true, arrows: true }} />
      <text x={340} y={76} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>switch closed</text>
      <Caption text="read both meters and write them down" y={262} />
    </PhysicsDiagram>
    case 'wirer-cool': return <PhysicsDiagram title="Open the switch between readings so the test wire cools. A hot wire has a different resistance. Do not touch the wire while it is switched on.">
      <FullCircuit s={{ length: 10, voltmeter: true, hi: 'switch', heated: true }} />
      {[118, 134, 150].map(x => <path key={x} d={`M${x} 160c-4 -5 4 -8 0 -13`} stroke={warm} strokeWidth="1.8" fill="none" opacity=".55" />)}
      <text x={340} y={76} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>switch open</text>
      <Tag x={300} y={250} text="open the switch between readings: the wire cools" colour={P.hot} fill={P.hotFill} size={13} />
      <Caption text="do not touch the wire while it is on" y={284} />
    </PhysicsDiagram>
    case 'wirer-repeat': {
      const v: RulerView = { x0: 60, scale: 8, y: 150, from: -4, to: 58, big: true }
      return <PhysicsDiagram title="Repeat for a range of lengths: move the second clip on 10 cm at a time, to 10, 20, 30, 40 and 50 cm.">
        <Ruler v={v} />
        <Clip x={at(v, 0)} y={v.y} />
        {[10, 30, 40, 50].map(cm => <Clip key={cm} x={at(v, cm)} y={v.y} red ghost />)}
        <Clip x={at(v, 20)} y={v.y} red />
        <path d={`M${at(v, 10)} 100Q${at(v, 15)} 78 ${at(v, 20) - 4} 98`} stroke={clipRed} strokeWidth="2.4" fill="none" />
        <Arrow from={[at(v, 20) - 10, 92]} to={[at(v, 20) - 2, 104]} colour={clipRed} width={2.2} />
        <text x={at(v, 15)} y={70} textAnchor="middle" fontSize="14" fontWeight="700" fill={clipRed}>move on 10 cm</text>
        <Caption text="close the switch, read both meters, open it, then move on" y={250} />
      </PhysicsDiagram>
    }
    case 'wirer-calc': return <PhysicsDiagram title="Readings of 0.60 V and 0.30 A: R = V ÷ I = 0.60 ÷ 0.30 = 2.0 Ω.">
      <MeterFace x={84} y={100} reading="0.60" letter="V" colour={P.pd} />
      <MeterFace x={84} y={236} reading="0.30" letter="A" colour={P.current} />
      <text x={160} y={96} fontSize="14" fontWeight="700" fill={P.pd}>pd, V</text>
      <text x={160} y={232} fontSize="14" fontWeight="700" fill={P.current}>current, I</text>
      <EqCard x={260} y={46} w={268} title="Resistance of 10 cm of wire" rows={[{ text: 'R = V ÷ I', state: 'dim' }, { text: 'R = 0.60 ÷ 0.30' }, { text: 'R = 2.0 Ω', state: 'hi', colour: P.resistance }]} />
    </PhysicsDiagram>
    case 'wirer-table': {
      const rows = [['10', '2.0'], ['20', '4.0'], ['30', '6.0'], ['40', '8.0']]
      return <PhysicsDiagram title="Results table: 10 cm, 2.0 Ω; 20 cm, 4.0 Ω; 30 cm, 6.0 Ω; 40 cm, 8.0 Ω. The longer the wire, the greater the resistance." schematic={false}>
        <rect x={110} y={24} width={320} height={236} rx="16" fill="white" stroke={P.panelLine} strokeWidth="1.6" />
        <path d="M110 70H430" stroke={P.panelLine} strokeWidth="1.6" />
        <rect x={111} y={25} width={318} height={44} rx="15" fill={P.panel} />
        <path d="M270 25V259" stroke={P.panelLine} strokeWidth="1.6" />
        <text x={190} y={53} textAnchor="middle" fontSize="15" fontWeight="750" fill={P.chargeLine}>Length in cm</text>
        <text x={350} y={53} textAnchor="middle" fontSize="15" fontWeight="750" fill={P.resistance}>Resistance in Ω</text>
        {rows.map(([l, r], i) => <g key={l}>
          {i > 0 && <path d={`M122 ${70 + i * 47}H418`} stroke={P.grid} strokeWidth="1.4" />}
          <text x={190} y={100 + i * 47} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}>{l}</text>
          <text x={350} y={100 + i * 47} textAnchor="middle" fontSize="18" fontWeight="700" fill={ink}>{r}</text>
        </g>)}
        <Arrow from={[462, 80]} to={[462, 240]} colour={P.resistance} width={2.6} />
        <text x={476} y={150} fontSize="13" fontWeight="700" fill={P.resistance}>longer,</text>
        <text x={476} y={168} fontSize="13" fontWeight="700" fill={P.resistance}>more R</text>
      </PhysicsDiagram>
    }
    case 'wirer-graph': return <PhysicsDiagram title="Graph of resistance against length of wire: four results plotted as crosses and a line of best fit drawn with a ruler." schematic={false}>
      <Graph line="dashed" />
      <Tag x={380} y={196} text="line of best fit (use a ruler)" colour={P.resistance} fill="white" />
    </PhysicsDiagram>
    case 'wirer-prop': {
      const s = graphScale(G)
      return <PhysicsDiagram title="The line is straight and goes through the origin, so resistance is directly proportional to length: twice the length, twice the resistance." schematic={false}>
        <Graph line="solid">
          {([[20, 4], [40, 8]] as Pt[]).map(([a, b]) => <path key={a} d={`M${s.x(0)} ${s.y(b)}H${s.x(a)}V${s.y(0)}`} stroke={P.charge} strokeWidth="1.6" strokeDasharray="5 5" fill="none" />)}
          <circle cx={s.x(0)} cy={s.y(0)} r="9" fill="none" stroke={P.useful} strokeWidth="2.4" />
          <text x={s.x(0) - 12} y={s.y(0) - 10} textAnchor="end" fontSize="13" fontWeight="700" fill={P.useful}>0, 0</text>
        </Graph>
        <Tag x={262} y={48} text="twice the length, twice the resistance" colour={P.chargeLine} fill="#e7f1fa" />
      </PhysicsDiagram>
    }
    case 'wirer-q-graph': return <PhysicsDiagram title="A graph of resistance against length of wire with a straight line through the origin." schematic={false}>
      <Graph line="solid" grid points={[[10, 2], [20, 4], [40, 8]]} />
    </PhysicsDiagram>
    default: return null
  }
}

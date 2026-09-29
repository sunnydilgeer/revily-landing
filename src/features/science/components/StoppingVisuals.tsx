import type { ReactNode } from 'react'
import { physicsPalette as P, PhysicsDiagram } from './PhysicsKit'
import { ink, muted, skin, skinLine, hair, Caption, Tag, Arrow, Car, Lorry, Tick, CrossMark, Eq, Person } from './EnergyStoreVisuals'
import { mo, Force, Note, DataTable } from './VtGraphVisuals'
import { Clock } from './ParallelVisuals'

/*
 * Physics Lesson 50: Stopping distance and thinking distance. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'stopdist-' and is routed from CellBiologyVisuals.tsx.
 *
 * Every distance is a bar under a side-on road: thinking distance blue, braking distance amber, in every frame
 * (and in the braking distance and reaction time lessons). The section 2 road is drawn to one scale throughout
 * (9 m thinking + 15 m braking), so the bar grows frame by frame on the same drawing.
 */

export const stopColours = { think: '#3f7fb0', thinkFill: '#dbe9f5', brake: '#b27c16', brakeFill: '#f7e6bd', road: '#9aa8b3', roadFill: '#eef1f4' }
const S = stopColours

/** A side-on road: a soft grey strip with a dashed centre line. */
export function Road({ x1 = 20, x2 = 520, y }: { x1?: number; x2?: number; y: number }) {
  return <g>
    <rect x={x1} y={y} width={x2 - x1} height={12} rx="6" fill={S.roadFill} stroke={S.road} strokeWidth="1.6" />
    <path d={`M${x1 + 10} ${y + 6}H${x2 - 10}`} stroke="white" strokeWidth="2" strokeDasharray="12 10" />
  </g>
}
/** A red-bordered warning triangle on a post; (x, y) is the foot of the post. */
export function Hazard({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0V-44" stroke="#7d8e9c" strokeWidth="3" />
    <path d="M0 -84L22 -46H-22Z" fill="white" stroke="#c0392b" strokeWidth="4" />
    <text x={0} y={-52} textAnchor="middle" fontSize="20" fontWeight="800" fill={ink}>!</text>
  </g>
}
/** A distance bar: blue thinking part then amber braking part, starting at x. Lengths in pixels. */
export function StopBar({ x, y, think, brake, h = 16, dimThink = false, dimBrake = false, labels }: { x: number; y: number; think: number; brake: number; h?: number; dimThink?: boolean; dimBrake?: boolean; labels?: [string?, string?] }) {
  return <g>
    {think > 0 && <g opacity={dimThink ? 0.25 : 1}>
      <rect x={x} y={y} width={think} height={h} rx="4" fill={S.thinkFill} stroke={S.think} strokeWidth="2" />
      {labels?.[0] && <text x={x + think / 2} y={y + h + 17} textAnchor="middle" fontSize="13" fontWeight="700" fill={S.think}>{labels[0]}</text>}
    </g>}
    {brake > 0 && <g opacity={dimBrake ? 0.25 : 1}>
      <rect x={x + think} y={y} width={brake} height={h} rx="4" fill={S.brakeFill} stroke={S.brake} strokeWidth="2" />
      {labels?.[1] && <text x={x + think + brake / 2} y={y + h + 17} textAnchor="middle" fontSize="13" fontWeight="700" fill={S.brake}>{labels[1]}</text>}
    </g>}
  </g>
}
/** A bracket over a distance with a label above. */
function Bracket({ x1, x2, y, label, colour = ink }: { x1: number; x2: number; y: number; label?: string; colour?: string }) {
  return <g>
    <path d={`M${x1} ${y + 8}V${y}H${x2}V${y + 8}`} stroke={colour} strokeWidth="2.2" fill="none" />
    {label && <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" fontSize="14" fontWeight="700" fill={colour}>{label}</text>}
  </g>
}
/** A small eye: "sees the hazard". */
function Eye({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 12} ${y}Q${x} ${y - 10} ${x + 12} ${y}Q${x} ${y + 10} ${x - 12} ${y}Z`} fill="white" stroke={ink} strokeWidth="1.8" /><circle cx={x} cy={y} r="4" fill={ink} /></g>
}
/** Red brake-light glow at the back of a car whose middle is at x. */
function BrakeLights({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g><circle cx={x - 47 * s} cy={y - 24 * s} r={7 * s} fill="#f5b3a7" opacity=".8" /><circle cx={x - 47 * s} cy={y - 24 * s} r={3 * s} fill="#d9533e" /></g>
}

/* ---------- Section 2: what stopping distance is (one road, 9 m + 15 m to scale) ---------- */

const X0 = 50, TH = 162, BR = 270, RY = 176
function Stopping({ focus }: { focus: string }) {
  const titles: Record<string, string> = {
    'stopdist-emergency': 'A car braking hard, brake lights on, with a backwards arrow: maximum braking force. A hazard sign is ahead. An emergency stop uses the shortest possible distance.',
    'stopdist-total': 'A road. A bracket runs from where the driver sees the hazard to where the car stops: the stopping distance.',
    'stopdist-equation': 'The bracket split into a blue part, thinking distance, and an amber part, braking distance. Stopping distance equals thinking distance plus braking distance.',
    'stopdist-thinking': 'Only the blue part is highlighted: thinking distance. The car keeps going at the same speed while the driver reacts, from seeing the hazard to pressing the brake.',
    'stopdist-braking': 'Only the amber part is highlighted: braking distance. The braking force slows the car down until it stops.',
    'stopdist-w': 'Worked example: the blue part is 9 m, the amber part is 15 m, and the total is 24 m. 9 plus 15 equals 24 m.',
  }
  const f = focus
  const endX = X0 + TH + BR
  return <PhysicsDiagram title={titles[f]}>
    <Road x1={16} x2={524} y={RY} />
    <Hazard x={506} y={RY} s={0.8} />
    {f === 'stopdist-emergency' && <g>
      <Car x={300} y={RY} s={1.15} />
      <BrakeLights x={300} y={RY} s={1.15} />
      <Force from={[236, 132]} to={[146, 132]} colour={mo.drag} lines={['maximum', 'braking force']} at="end" />
      <Note x={270} y={220} w={360} size={14} lines={['emergency stop: shortest possible distance']} colour={ink} fill="white" />
    </g>}
    {f !== 'stopdist-emergency' && <g>
      <g opacity=".3"><Car x={X0 - 8} y={RY} s={0.8} /></g>
      <Car x={endX - 40} y={RY} s={0.8} />
      <Eye x={X0} y={96} />
      <path d={`M${X0} 106V${RY}`} stroke={ink} strokeWidth="1.4" strokeDasharray="3 4" />
      <path d={`M${endX} 110V${RY}`} stroke={ink} strokeWidth="1.4" strokeDasharray="3 4" />
    </g>}
    {f === 'stopdist-total' && <g>
      <Bracket x1={X0} x2={endX} y={214} label="" />
      <path d={`M${X0} 214V222M${endX} 214V222`} stroke={ink} strokeWidth="2.2" />
      <text x={(X0 + endX) / 2} y={246} textAnchor="middle" fontSize="15" fontWeight="800" fill={ink}>stopping distance</text>
      <text x={X0 + 18} y={100} fontSize="13" fontWeight="700" fill={ink}>sees the hazard</text>
      <text x={endX - 6} y={104} textAnchor="end" fontSize="13" fontWeight="700" fill={ink}>stops</text>
    </g>}
    {['stopdist-equation', 'stopdist-thinking', 'stopdist-braking', 'stopdist-w'].includes(f) && <StopBar x={X0} y={198} think={TH} brake={BR} dimThink={f === 'stopdist-braking'} dimBrake={f === 'stopdist-thinking'}
      labels={f === 'stopdist-w' ? ['9 m', '15 m'] : [f === 'stopdist-braking' ? undefined : 'thinking distance', f === 'stopdist-thinking' ? undefined : 'braking distance']} />}
    {f === 'stopdist-equation' && <g>
      <rect x={70} y={8} width={400} height={70} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
      <Eq x={270} y={36} size={16} pieces={[['stopping distance =']]} />
      <Eq x={270} y={62} size={16} pieces={[['thinking distance', S.think], [' + '], ['braking distance', S.brake]]} />
      <Caption text="Add the two parts to get the stopping distance." y={284} />
    </g>}
    {f === 'stopdist-thinking' && <g>
      <text x={270} y={272} textAnchor="middle" fontSize="13" fontWeight="600" fill={S.think}>the car keeps going at the same speed while the driver reacts</text>
      <Tag x={120} y={36} text="see hazard" colour={S.think} />
      <Arrow from={[178, 36]} to={[236, 36]} colour={S.think} width={2.4} />
      <Tag x={300} y={36} text="press brake" colour={S.think} />
      {[80, 150].map(x => <Arrow key={x} from={[x, 130]} to={[x + 44, 130]} colour={mo.velocity} width={2.8} />)}
    </g>}
    {f === 'stopdist-braking' && <g>
      <Force from={[endX - 88, 132]} to={[endX - 150, 132]} colour={mo.drag} label="braking force" at="end" />
      <text x={X0 + TH + BR / 2} y={272} textAnchor="middle" fontSize="13" fontWeight="600" fill={S.brake}>the brakes slow the car to a stop</text>
      {[46, 30, 14].map((l, i) => <Arrow key={i} from={[X0 + TH + 20 + i * 70, 96]} to={[X0 + TH + 20 + i * 70 + l, 96]} colour={mo.velocity} width={2.8} />)}
      <text x={X0 + TH + 20} y={80} fontSize="12" fontWeight="700" fill={mo.velocity}>slowing down</text>
    </g>}
    {f === 'stopdist-w' && <g>
      <Bracket x1={X0} x2={endX} y={248} />
      <text x={(X0 + endX) / 2} y={276} textAnchor="middle" fontSize="15" fontWeight="800" fill={ink}>24 m</text>
      <rect x={170} y={20} width={200} height={46} rx="14" fill="#fff6e3" stroke="#e7b75e" strokeWidth="2" />
      <Eq x={270} y={50} size={18} pieces={[['9', S.think], [' + '], ['15', S.brake], [' = 24 m']]} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 3: speed, mass and typical distances ---------- */

function Typical({ focus }: { focus: string }) {
  if (focus === 'stopdist-factors') return <PhysicsDiagram title="Two panels. A small car has a shorter stopping distance than a heavy lorry at the same speed. A slow car has a shorter stopping distance than a fast car. Heavier: longer. Faster: longer.">
    {[{ x0: 6, t: 'heavier: longer' }, { x0: 274, t: 'faster: longer' }].map((p, i) => <g key={p.t}>
      <rect x={p.x0} y={8} width={260} height={284} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
      <text x={p.x0 + 130} y={34} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{p.t}</text>
      {[0, 1].map(r => {
        const y = 114 + r * 124, long = r === 1
        return <g key={r}>
          <Road x1={p.x0 + 10} x2={p.x0 + 250} y={y} />
          {i === 0 && !long && <Car x={p.x0 + 50} y={y} s={0.6} />}
          {i === 0 && long && <Lorry x={p.x0 + 58} y={y} s={0.6} />}
          {i === 1 && <Car x={p.x0 + 50} y={y} s={0.6} />}
          {i === 1 && <g><Arrow from={[p.x0 + 30, y - 52]} to={[p.x0 + (long ? 110 : 64), y - 52]} colour={mo.velocity} width={2.6} /><text x={p.x0 + (long ? 118 : 72)} y={y - 47} fontSize="12" fontWeight="700" fill={mo.velocity}>{long ? 'fast' : 'slow'}</text></g>}
          <StopBar x={p.x0 + 16} y={y + 20} think={long ? 70 : 42} brake={long ? 150 : 70} h={12} />
          {i === 0 && <text x={p.x0 + 250} y={y - 40} textAnchor="end" fontSize="12" fontWeight="700" fill={muted}>{long ? 'heavy lorry' : 'small car'}</text>}
        </g>
      })}
    </g>)}
  </PhysicsDiagram>
  if (focus === 'stopdist-typical') {
    const k = 4.2, rows: Array<[string, number, number, number]> = [['30 mph', 9, 14, 23], ['60 mph', 18, 55, 73], ['70 mph', 21, 75, 96]]
    return <PhysicsDiagram title="Typical stopping distances for a car, drawn to scale: at 30 mph about 23 m, at 60 mph about 73 m, at 70 mph about 96 m.">
      {rows.map(([v, t, b, total], i) => {
        const y = 52 + i * 84
        return <g key={v}>
          <Car x={46} y={y + 14} s={0.46} />
          <StopBar x={80} y={y} think={t * k} brake={b * k} h={18} />
          <text x={80} y={y - 10} fontSize="14" fontWeight="800" fill={ink}>{v}: about {total} m</text>
        </g>
      })}
      <g transform="translate(96 284)">
        <rect x={0} y={-11} width={16} height={12} rx="3" fill={S.thinkFill} stroke={S.think} strokeWidth="1.6" /><text x={22} y={0} fontSize="12" fontWeight="700" fill={S.think}>thinking</text>
        <rect x={100} y={-11} width={16} height={12} rx="3" fill={S.brakeFill} stroke={S.brake} strokeWidth="1.6" /><text x={122} y={0} fontSize="12" fontWeight="700" fill={S.brake}>braking</text>
        <text x={200} y={0} fontSize="12" fontWeight="600" fill={muted}>mph = miles per hour</text>
      </g>
    </PhysicsDiagram>
  }
  if (focus === 'stopdist-risk') return <PhysicsDiagram title="Two roads with a parked car ahead. Top: the stopping distance is shorter than the gap, so the car stops in time: safe. Bottom: the stopping distance is longer than the gap: crash.">
    {[{ y: 110, bar: [70, 150], ok: true, t: 'short stopping distance: safe' }, { y: 250, bar: [110, 280], ok: false, t: 'longer than the gap: crash' }].map(r => {
      const end = 60 + r.bar[0] + r.bar[1]
      return <g key={r.y}>
        <Road x1={16} x2={524} y={r.y} />
        <g opacity=".3"><Car x={40} y={r.y} s={0.55} /></g>
        <Car x={r.ok ? end - 28 : 414} y={r.y} s={0.55} />
        <Car x={462} y={r.y} s={0.55} fill="#dfe5ea" line="#5a6b79" />
        <StopBar x={60} y={r.y + 18} think={r.bar[0]} brake={r.ok ? r.bar[1] : 440 - 60 - r.bar[0]} h={12} />
        {!r.ok && <path d={`M440 ${r.y + 24}H${end}`} stroke={S.brake} strokeWidth="2.4" strokeDasharray="5 4" />}
        {r.ok ? <Tick x={24} y={r.y - 64} /> : <CrossMark x={24} y={r.y - 64} />}
        <text x={44} y={r.y - 59} fontSize="14" fontWeight="700" fill={r.ok ? P.useful : '#c0675a'}>{r.t}</text>
        {!r.ok && <path d="M436 -4l8 10l-10 -2l6 12" transform={`translate(0 ${r.y - 30})`} stroke="#c0392b" strokeWidth="2.4" fill="none" />}
      </g>
    })}
  </PhysicsDiagram>
  // stopdist-limit
  return <PhysicsDiagram title="Two panels. Near a school, a 20 mph speed limit sign and a short stopping distance. On a motorway, a 70 mph sign and a long stopping distance. Lower speed limit, shorter stopping distance.">
    {[{ x0: 6, lim: '20', t: 'near a school', bar: [26, 20] }, { x0: 274, lim: '70', t: 'motorway', bar: [60, 170] }].map(p => <g key={p.lim}>
      <rect x={p.x0} y={8} width={260} height={250} rx="14" fill={P.panel} stroke={P.panelLine} strokeWidth="1.5" />
      <text x={p.x0 + 130} y={34} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{p.t}</text>
      <path d={`M${p.x0 + 44} 176V116`} stroke="#7d8e9c" strokeWidth="3" />
      <circle cx={p.x0 + 44} cy={96} r="26" fill="white" stroke="#c0392b" strokeWidth="6" />
      <text x={p.x0 + 44} y={104} textAnchor="middle" fontSize="22" fontWeight="800" fill={ink}>{p.lim}</text>
      {p.lim === '20' && <g>
        <path d={`M${p.x0 + 150} 172V120L${p.x0 + 190} 92L${p.x0 + 230} 120V172Z`} fill="#f4e6d4" stroke="#a5634a" strokeWidth="2" />
        <rect x={p.x0 + 180} y={140} width={20} height={32} rx="2" fill="white" stroke="#a5634a" strokeWidth="1.6" />
        <path d={`M${p.x0 + 190} 92V72l14 5l-14 5`} stroke="#a5634a" strokeWidth="1.8" fill="#fbe0d9" />
        <text x={p.x0 + 190} y={126} textAnchor="middle" fontSize="12" fontWeight="700" fill="#a5634a">school</text>
      </g>}
      {p.lim === '70' && <g>
        <path d={`M${p.x0 + 110} 176L${p.x0 + 150} 80H${p.x0 + 170}L${p.x0 + 250} 176`} fill="#eef1f4" stroke={S.road} strokeWidth="1.6" />
        <path d={`M${p.x0 + 160} 90V172`} stroke="white" strokeWidth="3" strokeDasharray="10 8" />
      </g>}
      <Road x1={p.x0 + 10} x2={p.x0 + 250} y={176} />
      <Car x={p.x0 + 36} y={176} s={0.44} />
      <StopBar x={p.x0 + 16} y={200} think={p.bar[0]} brake={p.bar[1]} h={14} />
      <text x={p.x0 + 16} y={238} fontSize="13" fontWeight="700" fill={muted}>{p.lim === '20' ? 'short stopping distance' : 'long stopping distance'}</text>
    </g>)}
    <Caption text="Lower speed limit, shorter stopping distance." y={284} />
  </PhysicsDiagram>
}

/* ---------- Section 4: what affects thinking distance ---------- */

/** A simple face: `sleepy` gives drooping eyelids, `look` turns the eyes down to one side. */
function Face({ x, y, sleepy = false, look = false }: { x: number; y: number; sleepy?: boolean; look?: boolean }) {
  return <g>
    <circle cx={x} cy={y} r="24" fill={skin} stroke={skinLine} strokeWidth="2" />
    <path d={`M${x - 24} ${y - 4}Q${x - 22} ${y - 30} ${x} ${y - 28}Q${x + 22} ${y - 28} ${x + 24} ${y - 6}Q${x + 6} ${y - 20} ${x - 24} ${y - 4}Z`} fill={hair} />
    {[-9, 9].map(dx => sleepy
      ? <path key={dx} d={`M${x + dx - 6} ${y + 2}Q${x + dx} ${y + 7} ${x + dx + 6} ${y + 2}`} stroke={ink} strokeWidth="2.2" fill="none" />
      : <circle key={dx} cx={x + dx + (look ? 3 : 0)} cy={y + (look ? 4 : 1)} r="3" fill={ink} />)}
    <path d={sleepy ? `M${x - 6} ${y + 14}H${x + 6}` : `M${x - 7} ${y + 12}Q${x} ${y + 17} ${x + 7} ${y + 12}`} stroke={skinLine} strokeWidth="2" fill="none" />
  </g>
}
function Bottle({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 3} ${y - 40}h6v10q6 4 6 12v18h-18v-18q0 -8 6 -12z`} fill="#dcefe3" stroke={P.useful} strokeWidth="1.8" /></g>
}
function Pill({ x, y }: { x: number; y: number }) {
  return <g transform={`rotate(-30 ${x} ${y})`}><rect x={x - 12} y={y - 6} width={24} height={12} rx="6" fill="white" stroke={ink} strokeWidth="1.6" /><path d={`M${x} ${y - 6}V${y + 6}`} stroke={ink} strokeWidth="1.4" /><rect x={x} y={y - 5} width={11} height={10} rx="5" fill="#f6d2e5" /></g>
}
function Phone({ x, y }: { x: number; y: number }) {
  return <g><rect x={x - 8} y={y - 14} width={16} height={28} rx="3" fill="#4f5d69" stroke="#33404b" strokeWidth="1.4" /><rect x={x - 5.5} y={y - 10} width={11} height={19} rx="1.5" fill="#bfe0f1" /></g>
}
function Row({ y, think, brake = 0, label, face, dimBrake = true }: { y: number; think: number; brake?: number; label?: string; face?: ReactNode; dimBrake?: boolean }) {
  return <g>
    {face}
    <Road x1={110} x2={524} y={y} />
    <Car x={150} y={y} s={0.5} />
    <StopBar x={130} y={y + 18} think={think} brake={brake} h={14} dimBrake={dimBrake} />
    {label && <text x={130 + think + 8} y={y + 30} fontSize="13" fontWeight="700" fill={S.think}>{label}</text>}
  </g>
}
function Thinking({ focus }: { focus: string }) {
  if (focus === 'stopdist-think-two') return <PhysicsDiagram title="The blue thinking distance bar with two arrows feeding into it: the speed of the car, and the driver's reactions.">
    <rect x={150} y={176} width={240} height={34} rx="8" fill={S.thinkFill} stroke={S.think} strokeWidth="2.4" />
    <text x={270} y={199} textAnchor="middle" fontSize="15" fontWeight="800" fill={S.think}>thinking distance</text>
    <Note x={130} y={40} w={190} size={14} lines={['speed of the car']} colour={mo.velocity} fill={mo.velocityFill} line={mo.velocity} />
    <Note x={410} y={40} w={190} size={14} lines={["driver's reactions"]} colour={S.think} fill="white" line={S.think} />
    <Arrow from={[150, 80]} to={[220, 170]} colour={mo.velocity} width={3.2} />
    <Arrow from={[390, 80]} to={[320, 170]} colour={S.think} width={3.2} />
    <Caption text="Both affect how far the car goes before braking." y={256} />
  </PhysicsDiagram>
  if (focus === 'stopdist-think-speed') return <PhysicsDiagram title="Two cars with the same reaction time. The slow car has a short blue thinking distance bar; the fast car has a longer blue bar.">
    <Clock x={60} y={40} r={20} minutes={8} />
    <text x={90} y={45} fontSize="14" fontWeight="700" fill={ink}>same reaction time</text>
    <Row y={130} think={90} label="slow car" face={<Arrow from={[40, 102]} to={[70, 102]} colour={mo.velocity} width={2.6} />} />
    <Row y={250} think={220} label="fast car" face={<Arrow from={[30, 222]} to={[96, 222]} colour={mo.velocity} width={2.6} />} />
  </PhysicsDiagram>
  if (focus === 'stopdist-think-tired') return <PhysicsDiagram title="An alert driver has a short blue thinking distance. A tired driver, or one who has taken drugs or alcohol, reacts more slowly, so the blue thinking distance bar is longer.">
    <Row y={116} think={90} label="alert" face={<Face x={48} y={90} />} />
    <Row y={252} think={230} label="slower to react" face={<g><Face x={48} y={216} sleepy /><Bottle x={20} y={286} /><Pill x={70} y={276} /></g>} />
    <Tag x={380} y={36} text="tiredness, drugs, alcohol" colour={muted} />
  </PhysicsDiagram>
  if (focus === 'stopdist-think-phone') return <PhysicsDiagram title="A driver looks down at a phone and spots the hazard late. The blue thinking distance bar is longer than for a driver who is paying attention.">
    <g>
      <Person x={60} y={150} s={1.1} arms={[[[10, -46], [20, -54]], [[12, -44], [22, -52]]]} />
      <Phone x={84} y={92} />
    </g>
    <Road x1={140} x2={524} y={130} />
    <Car x={176} y={130} s={0.5} />
    <Hazard x={506} y={130} s={0.6} />
    <g opacity=".45"><StopBar x={156} y={150} think={90} brake={0} h={12} /></g>
    <text x={254} y={161} fontSize="12" fontWeight="700" fill={muted}>paying attention</text>
    <StopBar x={156} y={186} think={230} brake={0} h={16} />
    <text x={156 + 230 + 8} y={199} fontSize="13" fontWeight="700" fill={S.think}>on a phone</text>
    <Force from={[300, 60]} to={[480, 60]} colour={S.think} label="hazard spotted late" at="above" width={3} />
    <Caption text="A distracted driver is slower to spot a hazard." y={262} />
  </PhysicsDiagram>
  // stopdist-think-crash
  return <PhysicsDiagram title="Two roads with a hazard ahead. Normal thinking distance: the car stops in time. Longer thinking distance: the car reaches the hazard. Longer thinking distance, longer stopping distance.">
    {[{ y: 110, t: 80, ok: true }, { y: 240, t: 190, ok: false }].map(r => {
      const b = 190
      return <g key={r.y}>
        <Road x1={16} x2={524} y={r.y} />
        <Hazard x={436} y={r.y} s={0.6} />
        <Car x={r.ok ? 60 + r.t + b - 28 : 406} y={r.y} s={0.5} />
        <StopBar x={60} y={r.y + 18} think={r.t} brake={b} h={12} />
        {r.ok ? <Tick x={30} y={r.y - 56} /> : <CrossMark x={30} y={r.y - 56} />}
        <text x={50} y={r.y - 51} fontSize="13" fontWeight="700" fill={r.ok ? P.useful : '#c0675a'}>{r.ok ? 'normal thinking distance: stops in time' : 'longer thinking distance: reaches the hazard'}</text>
      </g>
    })}
    <Caption text="Longer thinking distance, longer stopping distance." y={290} />
  </PhysicsDiagram>
}

/* ---------- Question: data table only ---------- */

function QuestionTable() {
  return <PhysicsDiagram title="A table of speed in mph, thinking distance in metres and braking distance in metres: 20, 6, 6; 40, 12, 24; 60, 18, 54." schematic={false}>
    <DataTable x={60} y={46} cols={[130, 150, 140]} rowH={46} size={17} rows={[['speed\n(mph)', 'thinking\ndistance (m)', 'braking\ndistance (m)'], ['20', '6', '6'], ['40', '12', '24'], ['60', '18', '54']]} />
  </PhysicsDiagram>
}

export function StoppingVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  if (['stopdist-emergency', 'stopdist-total', 'stopdist-equation', 'stopdist-thinking', 'stopdist-braking', 'stopdist-w'].includes(focus)) return <Stopping focus={focus} />
  if (['stopdist-factors', 'stopdist-typical', 'stopdist-risk', 'stopdist-limit'].includes(focus)) return <Typical focus={focus} />
  if (focus.startsWith('stopdist-think-')) return <Thinking focus={focus} />
  if (focus === 'stopdist-q-table') return <QuestionTable />
  return null
}

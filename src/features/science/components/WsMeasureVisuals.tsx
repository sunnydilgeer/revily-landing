import { WsDiagram, Tag, Tick, Cross, Arrow, Bench, GasSyringe, Numbered, Beaker, TestTube, DropPipette, Drop, Eye, Sight, Stopwatch, rubber, gasFill, tones, wsPalette as W, ink, muted, r1, type Pt } from './WsKit'
import { useId } from 'react'
import { Lines, Leader } from './PhysicsKit'
import { Cylinder, Balance } from './DensityVisuals'
import { Flask, Bung, Chips, Bubbles, labPalette as LB } from './GasRateVisuals'

/*
 * Working Scientifically Lesson 13: Measuring mass, liquids and gases. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'wsmeasure-' and is routed from CellBiologyVisuals.tsx.
 *
 * Drawn with WsKit and the same lab pieces as the Collecting data lesson (balance, measuring cylinder, conical flask,
 * gas syringe), so the practical-skills lessons match it. Water and solutions blue, the solid pale sand, gas space pale
 * green (as in the gas syringe), rubber bulbs dusky pink; the place to read is marked in soft yellow.
 */

const solid = { fill: '#f3e3c3', line: '#b39564' }
const sol = { fill: LB.sol, line: LB.solLine }

/** A delivery tube: a glass pipe drawn as a thick outline with a pale core. */
function Tube({ d }: { d: string }) {
  return <g>
    <path d={d} fill="none" stroke={LB.glassLine} strokeWidth="5" />
    <path d={d} fill="none" stroke="white" strokeWidth="2" />
  </g>
}
/** A low mound of solid on the floor of a beaker whose base is at (x, y). */
function Pile({ x, y, w, h = 16 }: { x: number; y: number; w: number; h?: number }) {
  return <g>
    <path d={`M${x - w / 2} ${y - 2}Q${x - w / 4} ${y - h} ${x} ${y - h}Q${x + w / 4} ${y - h} ${x + w / 2} ${y - 2}Z`} fill={solid.fill} stroke={solid.line} strokeWidth="1.6" />
    {[-0.25, 0, 0.2].map((f, i) => <circle key={i} cx={r1(x + f * w)} cy={r1(y - h * 0.55 + i * 2)} r="1.6" fill={solid.line} />)}
  </g>
}
/** A small grain of solid. */
function Grain({ x, y }: { x: number; y: number }) {
  return <rect x={x - 3} y={y - 3} width="6" height="6" rx="1.5" fill={solid.fill} stroke={solid.line} strokeWidth="1.3" transform={`rotate(20 ${x} ${y})`} />
}

/* ---------- Section 2: mass ---------- */

function Zero() {
  const x = 250, y = 176
  return <WsDiagram title="An empty beaker sits on a digital balance. The zero button has been pressed, so the display reads 0.0 g.">
    <Beaker x={x} y={y} w={76} h={80} />
    <Balance x={x} y={y} reading="0.0 g" w={200} />
    <circle cx={x + 62} cy={y + 28} r="7" fill={tones.mark.fill} stroke={tones.mark.line} strokeWidth="2" />
    <Bench x1={120} x2={380} y={y + 45} />
    <Lines x={150} y={100} anchor="end" lines={['empty', 'beaker on']} size={14} />
    <Leader from={[156, 112]} to={[x - 38, 132]} />
    <Arrow from={[400, 150]} to={[x + 72, y + 22]} colour={tones.mark.line} width={2.4} bend={-0.18} />
    <Lines x={430} y={98} anchor="middle" lines={['set to zero', 'with the', 'container on']} size={14} colour={tones.mark.text} />
    <Tag x={x} y={272} text="now it shows only what you add" size={13} />
  </WsDiagram>
}

function Transfer() {
  // A beaker tipped over the flask; the wash bottle rinses the last bits across.
  return <WsDiagram title="Solid is tipped from a beaker into a conical flask. A wash bottle of solvent rinses the last bits of solid out of the beaker and into the flask.">
    <Flask cx={310} base={262} h={124} w={120} level={30} fill={sol.fill} line={sol.line}>
      <Pile x={310} y={262} w={60} h={12} />
    </Flask>
    <g transform="translate(236 86) rotate(100)">
      <Beaker x={0} y={0} w={50} h={62} marks={false} />
      <Grain x={-8} y={-50} /><Grain x={6} y={-54} />
    </g>
    <Grain x={300} y={130} /><Grain x={306} y={146} />
    {/* wash bottle */}
    <path d="M84 262Q74 262 74 250V160Q74 140 94 136H136Q156 140 156 160V250Q156 262 146 262Z" fill="#f2f6f9" stroke={W.glassLine} strokeWidth="2.2" />
    <path d="M76 190H154V250Q154 260 146 260H84Q76 260 76 250Z" fill={P_water.fill} opacity=".9" />
    <rect x="102" y="122" width="26" height="15" rx="3" fill={W.metal} stroke={W.metalLine} strokeWidth="1.8" />
    <path d="M115 122V98Q115 86 127 84L176 76" fill="none" stroke={W.glassLine} strokeWidth="4" />
    <path d="M178 75Q228 62 262 90" fill="none" stroke={P_water.line} strokeWidth="2.6" strokeDasharray="3 5" />
    <Lines x={110} y={243} anchor="middle" lines={['solvent']} size={13} colour={P_water.text} />
    <Bench x1={50} x2={400} y={264} />
    <Lines x={436} y={92} anchor="middle" lines={['wash every', 'bit across']} size={15} colour={tones.mark.text} />
    <Arrow from={[418, 116]} to={[334, 140]} colour={tones.mark.line} width={2.2} bend={-0.15} />
  </WsDiagram>
}
const P_water = { fill: '#bfe0f1', line: '#3f93bd', text: '#2f7aa0' }

function Difference() {
  const y = 158
  return <WsDiagram title="Left: a beaker with solid in it on a balance reads 45.0 g. Right: after the solid is tipped out, the empty beaker reads 42.5 g. 45.0 − 42.5 = 2.5 g of solid was moved.">
    <Tag x={130} y={40} text="before" size={13} />
    <Tag x={410} y={40} text="after" size={13} />
    <Beaker x={130} y={y} w={70} h={74}><Pile x={130} y={y} w={62} h={22} /></Beaker>
    <Balance x={130} y={y} reading="45.0 g" w={180} />
    <Beaker x={410} y={y} w={70} h={74} />
    <Balance x={410} y={y} reading="42.5 g" w={180} />
    <Arrow from={[232, 120]} to={[308, 120]} width={2.6} />
    <Lines x={270} y={100} anchor="middle" lines={['tip it out']} size={13} weight={650} colour={muted} />
    <Bench x1={30} x2={510} y={y + 45} />
    <Tag x={270} y={256} text="45.0 − 42.5 = 2.5 g moved" tone="mark" size={16} strong />
  </WsDiagram>
}

/* ---------- Section 3: liquids ---------- */

function Dropper() {
  const x = 250
  return <WsDiagram title="A dropping pipette with a rubber bulb hangs over a test tube of solution. Two drops fall from its tip.">
    <TestTube x={x} y={258} h={126} w={32} level={0.34} fill={sol.fill} line={sol.line} />
    <path d="M196 206H304" stroke={W.woodLine} strokeWidth="1" />
    <rect x="186" y="200" width="128" height="14" rx="5" fill={W.wood} stroke={W.woodLine} strokeWidth="1.8" />
    <path d="M194 214V266M306 214V266" stroke={W.woodLine} strokeWidth="4" />
    <DropPipette x={x} y={92} h={86} />
    <Drop x={x} y={112} s={0.8} fill={sol.fill} line={sol.line} />
    <Drop x={x} y={130} s={0.8} fill={sol.fill} line={sol.line} />
    <Bench x1={150} x2={350} y={268} />
    <Lines x={130} y={30} anchor="middle" lines={['rubber bulb:', 'squeeze, then', 'let go']} size={13} />
    <Leader from={[176, 40]} to={[x - 10, 24]} />
    <Lines x={344} y={116} lines={['a few drops']} size={16} colour={tones.mark.text} />
    <Leader from={[340, 111]} to={[x + 8, 118]} colour={tones.mark.line} />
    <Lines x={344} y={166} lines={['the volume is', 'not exact']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}

function Pipette() {
  const x = 230, mark = 84
  return <WsDiagram title="A long glass pipette with a rubber pipette filler on top. Its tip is in a beaker of solution, and the liquid has been drawn up to a single line on the stem.">
    <Beaker x={x} y={288} w={110} h={64} level={0.6} fill={sol.fill} line={sol.line} />
    {/* liquid inside the pipette up to the line */}
    <path d={`M${x - 2.5} 270V200L${x - 12} 188Q${x - 16} 160 ${x - 12} 146L${x - 2.5} 134V${mark}H${x + 2.5}V134L${x + 12} 146Q${x + 16} 160 ${x + 12} 188L${x + 2.5} 200V270Z`} fill={sol.fill} />
    <path d={`M${x - 4} 272V200L${x - 14} 188Q${x - 19} 160 ${x - 14} 146L${x - 4} 134V56H${x + 4}V134L${x + 14} 146Q${x + 19} 160 ${x + 14} 188L${x + 4} 200V272Z`} fill="none" stroke={W.glassLine} strokeWidth="2" />
    <path d={`M${x - 2.5} ${mark}H${x + 2.5}`} stroke={sol.line} strokeWidth="1.6" />
    <path d={`M${x - 10} ${mark}H${x + 10}`} stroke={ink} strokeWidth="2.4" />
    {/* the filler */}
    <path d={`M${x - 7} 60V48H${x + 7}V60Z`} fill={rubber.fill} stroke={rubber.line} strokeWidth="1.8" />
    <path d={`M${x} 50C${x - 30} 50 ${x - 30} 8 ${x} 8C${x + 30} 8 ${x + 30} 50 ${x} 50Z`} fill={rubber.fill} stroke={rubber.line} strokeWidth="2" />
    <path d={`M${x - 12} 22Q${x - 8} 15 ${x} 14`} fill="none" stroke="white" strokeWidth="2.4" opacity=".7" />
    <Lines x={290} y={28} lines={['pipette filler']} size={15} />
    <Leader from={[286, 24]} to={[x + 22, 28]} />
    <Lines x={290} y={48} lines={['draws liquid up safely']} size={13} weight={650} colour={muted} />
    <Lines x={290} y={90} lines={['fill exactly', 'to the line']} size={15} colour={tones.mark.text} />
    <Leader from={[286, 86]} to={[x + 11, mark]} colour={tones.mark.line} />
    <Tag x={360} y={176} text="one exact volume" tone="mark" size={14} strong />
  </WsDiagram>
}

function Cylinders() {
  return <WsDiagram title="Two measuring cylinders each hold 20 cm³ of water. In the small cylinder the water fills most of the scale, which is easy to read. In the very large cylinder it is a thin layer at the bottom, which is hard to read.">
    <Tag x={150} y={50} text="20 cm³ of water in each" size={13} />
    <Cylinder x={150} y={232} h={150} w={30} level={0.8} marks={5} />
    <Cylinder x={360} y={232} h={196} w={80} level={0.06} marks={10} />
    <Tick x={112} y={264} s={0.9} />
    <Lines x={128} y={269} lines={['right size']} size={14} colour={tones.good.text} />
    <Cross x={318} y={264} s={0.9} />
    <Lines x={334} y={269} lines={['too big']} size={14} colour={tones.bad.text} />
    <Lines x={414} y={196} lines={['a thin layer:', 'hard to read']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}

/** A tall measuring cylinder with a clearly curved meniscus. (x, y) is the middle of its foot; `surf` the height of the liquid at the glass. */
function TallCylinder({ x, y, top, w, surf, dip = 9 }: { x: number; y: number; top: number; w: number; surf: number; dip?: number }) {
  const l = x - w / 2, r = x + w / 2
  return <g>
    <path d={`M${l - 16} ${y}H${r + 16}`} stroke={W.glassLine} strokeWidth="5" />
    <path d={`M${l} ${top + 4}V${y - 7}Q${l} ${y - 3} ${l + 4} ${y - 3}H${r - 4}Q${r} ${y - 3} ${r} ${y - 7}V${top + 4}Z`} fill={W.glass} fillOpacity=".85" />
    <path d={`M${l + 1.5} ${surf}Q${x} ${surf + dip * 2} ${r - 1.5} ${surf}V${y - 7}Q${r - 1.5} ${y - 4.5} ${r - 4} ${y - 4.5}H${l + 4}Q${l + 1.5} ${y - 4.5} ${l + 1.5} ${y - 7}Z`} fill={P_water.fill} />
    <path d={`M${l + 1.5} ${surf}Q${x} ${surf + dip * 2} ${r - 1.5} ${surf}`} fill="none" stroke={P_water.line} strokeWidth="2" />
    {Array.from({ length: 9 }, (_, i) => { const yy = r1(y - 30 - i * (y - top - 50) / 8); return <path key={i} d={`M${l} ${yy}h${i % 2 ? 9 : 16}`} stroke={W.glassLine} strokeWidth="1.4" /> })}
    <path d={`M${r - 9} ${top + 18}V${y - 22}`} stroke="white" strokeWidth="3" opacity=".8" />
    <path d={`M${l} ${top + 4}V${y - 7}Q${l} ${y - 3} ${l + 4} ${y - 3}H${r - 4}Q${r} ${y - 3} ${r} ${y - 7}V${top + 4}`} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    <path d={`M${l - 5} ${top}Q${l} ${top + 1} ${l} ${top + 6}M${r} ${top + 6}Q${r} ${top} ${r + 7} ${top - 3}`} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
  </g>
}

function Meniscus() {
  const cx = 150, surf = 142, zx = 340, zy = 150, zr = 100
  const bottom = zy // the bottom of the curve in the close-up
  const clip = useId().replace(/:/g, '')
  return <WsDiagram title="A measuring cylinder with an eye level with the liquid. A close-up shows the curved surface, the meniscus. The volume is read at the bottom of the curve.">
    <TallCylinder x={cx} y={272} top={40} w={46} surf={surf} dip={4} />
    <Eye x={62} y={surf + 4} look={0} />
    <Sight from={[84, surf + 4]} to={[cx - 24, surf + 4]} />
    <Lines x={62} y={surf + 40} anchor="middle" lines={['eye level']} size={14} />
    {/* close-up */}
    <circle cx={cx} cy={surf + 3} r="22" fill="none" stroke={ink} strokeWidth="1.8" />
    <path d={`M${cx + 16} ${surf - 13}L${zx - 76} ${zy - 66}M${cx + 16} ${surf + 19}L${zx - 76} ${zy + 66}`} stroke={muted} strokeWidth="1.4" strokeDasharray="4 5" />
    <defs><clipPath id={clip}><circle cx={zx} cy={zy} r={zr} /></clipPath></defs>
    <circle cx={zx} cy={zy} r={zr} fill="white" />
    <g clipPath={`url(#${clip})`}>
      <rect x={zx - 70} y={zy - zr} width="140" height={zr * 2} fill={W.glass} />
      <path d={`M${zx - 70} ${zy - 40}Q${zx} ${zy + 40} ${zx + 70} ${zy - 40}V${zy + zr}H${zx - 70}Z`} fill={P_water.fill} />
      <path d={`M${zx - 70} ${zy - 40}Q${zx} ${zy + 40} ${zx + 70} ${zy - 40}`} fill="none" stroke={P_water.line} strokeWidth="2.6" />
      <rect x={zx - 84} y={zy - zr} width="14" height={zr * 2} fill={W.glassLine} opacity=".45" />
      <rect x={zx + 70} y={zy - zr} width="14" height={zr * 2} fill={W.glassLine} opacity=".45" />
      {[-60, -30, 0, 30, 60].map(d => <path key={d} d={`M${zx - 70} ${zy + d}h${d === 0 ? 30 : 16}`} stroke={ink} strokeWidth="1.8" />)}
      <path d={`M${zx - 38} ${bottom}H${zx + 40}`} stroke={tones.mark.line} strokeWidth="2.2" strokeDasharray="5 4" />
    </g>
    <circle cx={zx} cy={zy} r={zr} fill="none" stroke={ink} strokeWidth="2.2" />
    <circle cx={zx} cy={bottom} r="5" fill={tones.mark.fill} stroke={tones.mark.line} strokeWidth="2" />
    <Lines x={zx} y={zy - 58} anchor="middle" lines={['meniscus']} size={15} />
    <Leader from={[zx + 32, zy - 54]} to={[zx + 50, zy - 30]} />
    <Lines x={452} y={196} lines={['read the', 'bottom of', 'the curve']} size={14} colour={tones.mark.text} />
    <Arrow from={[460, 176]} to={[zx + 10, bottom + 2]} colour={tones.mark.line} width={2.2} bend={0.12} />
  </WsDiagram>
}

/* ---------- Section 4: gases ---------- */

function ReactionFlask({ cx, base = 250, h = 120, w = 104 }: { cx: number; base?: number; h?: number; w?: number }) {
  return <g>
    <Flask cx={cx} base={base} h={h} w={w} level={34} fill={sol.fill} line={sol.line}><Chips cx={cx} base={base} n={5} spread={52} size={0.8} /></Flask>
    <Bung cx={cx} top={base - h - 6} w={24} />
  </g>
}

function Syringe() {
  const fx = 130, top = 124
  return <WsDiagram title="A conical flask with a reaction mixture, closed by a bung. A delivery tube carries the gas to a gas syringe, and the gas pushes the plunger out along a scale.">
    <Tube d={`M${fx} ${top + 4}V78Q${fx} 70 ${fx + 8} 70H${226}`} />
    <ReactionFlask cx={fx} />
    <GasSyringe x={224} y={70} w={250} fill={0.44} />
    <Bench x1={40} x2={500} y={252} />
    <Lines x={180} y={52} anchor="middle" lines={['delivery tube']} size={14} />
    <Lines x={320} y={124} anchor="middle" lines={['gas syringe']} size={15} />
    <Leader from={[320, 108]} to={[304, 86]} />
    <Arrow from={[336, 32]} to={[420, 32]} colour={tones.measure.line} width={2.6} />
    <Lines x={430} y={37} lines={['gas pushes', 'the plunger']} size={14} colour={tones.measure.text} />
    <Lines x={250} y={200} lines={['reaction mixture']} size={14} />
    <Leader from={[246, 196]} to={[fx + 34, 226]} />
    <Tag x={452} y={118} text="read the scale" tone="mark" size={13} />
  </WsDiagram>
}

function Upturned() {
  const cx = 360, ctop = 40, mouth = 226, gasTo = 112, cw = 50
  return <WsDiagram title="Gas from a reaction flask travels along a delivery tube into a trough of water and bubbles up into an upside-down measuring cylinder. The gas collects at the top and pushes the water out.">
    <ReactionFlask cx={110} h={118} w={100} />
    {/* trough */}
    <path d="M222 176V256Q222 266 232 266H490Q500 266 500 256V176" fill={W.glass} stroke="none" />
    <path d="M224 194H498V256Q498 264 490 264H232Q224 264 224 256Z" fill={P_water.fill} />
    <path d="M224 194H498" stroke={P_water.line} strokeWidth="1.8" />
    <Tube d={`M110 ${126}V88Q110 80 118 80H242Q250 80 250 88V238Q250 246 258 246H${cx - 8}Q${cx} 246 ${cx} 238V${mouth + 4}`} />
    {/* the upturned cylinder */}
    <rect x={cx - cw / 2} y={ctop} width={cw} height={mouth - ctop} rx="5" fill={P_water.fill} />
    <rect x={cx - cw / 2 + 1.5} y={ctop + 1.5} width={cw - 3} height={gasTo - ctop} rx="4" fill={gasFill} />
    <path d={`M${cx - cw / 2 + 1.5} ${gasTo}H${cx + cw / 2 - 1.5}`} stroke={P_water.line} strokeWidth="1.8" />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${cx - cw / 2} ${ctop + 24 + i * 24}h${i % 2 ? 8 : 13}`} stroke={W.glassLine} strokeWidth="1.3" />)}
    <path d={`M${cx - cw / 2} ${mouth}V${ctop + 5}Q${cx - cw / 2} ${ctop} ${cx - cw / 2 + 5} ${ctop}H${cx + cw / 2 - 5}Q${cx + cw / 2} ${ctop} ${cx + cw / 2} ${ctop + 5}V${mouth}`} fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    <path d={`M${cx - cw / 2 - 12} ${ctop - 2}H${cx + cw / 2 + 12}`} stroke={W.glassLine} strokeWidth="5" />
    <Bubbles pts={[[cx - 2, 214], [cx + 4, 184], [cx - 3, 152], [cx + 2, 128]]} r={4} />
    <path d="M222 176V256Q222 266 232 266H490Q500 266 500 256V176" fill="none" stroke={W.glassLine} strokeWidth="2.4" />
    <Bench x1={40} x2={510} y={268} />
    <Arrow from={[cx + 48, 80]} to={[cx + 48, 150]} colour={tones.measure.line} width={2.6} />
    <Lines x={cx + 62} y={96} lines={['gas pushes', 'the water out']} size={14} colour={tones.measure.text} />
    <Lines x={456} y={236} anchor="middle" lines={['water']} size={14} colour={P_water.text} />
    <Lines x={cx} y={24} anchor="middle" lines={['upside down, full of water at the start']} size={13} weight={650} colour={muted} />
  </WsDiagram>
}

function BubbleCount() {
  const bx = 360
  return <WsDiagram title="Gas from a reaction flask bubbles out of a delivery tube into a beaker of water. The bubbles are different sizes, so counting them is less accurate.">
    <Tube d={`M130 128V78Q130 70 138 70H${bx - 8}Q${bx} 70 ${bx} 78V236`} />
    <ReactionFlask cx={130} />
    <Beaker x={bx} y={252} w={120} h={120} level={0.8} />
    <path d={`M${bx - 2.5} 150V236`} stroke={W.glassLine} strokeWidth="5" />
    <path d={`M${bx - 2.5} 150V236`} stroke="white" strokeWidth="2" />
    {([[bx + 14, 222, 4], [bx + 20, 200, 8], [bx + 10, 176, 3.4], [bx + 22, 158, 6]] as [number, number, number][]).map(([x, y, r], i) =>
      <circle key={i} cx={x} cy={y} r={r} fill="white" stroke={LB.glassLine} strokeWidth="1.4" />)}
    <Bench x1={40} x2={500} y={254} />
    <Lines x={450} y={176} lines={['bubbles', 'vary in size']} size={14} />
    <Leader from={[446, 172]} to={[bx + 30, 184]} />
    <Stopwatch x={470} y={56} r={24} reading="60 s" />
    <Lines x={470} y={110} anchor="middle" lines={['count for', 'a set time']} size={13} weight={650} colour={muted} />
    <Cross x={196} y={284} s={0.85} />
    <Lines x={212} y={289} lines={['less accurate, but good for comparing']} size={14} colour={tones.bad.text} />
  </WsDiagram>
}

/* ---------- Question: where to read ---------- */

function QMeniscus() {
  const cx = 290, surf = 132, top = 30, base = 276, w = 76
  const pts: [number, Pt, Pt][] = [
    [1, [190, 70], [cx - w / 2 + 2, surf]],
    [2, [420, 44], [cx + w / 2 + 2, top + 3]],
    [3, [420, 170], [cx, surf + 6]],
    [4, [420, 260], [cx + 18, base - 6]],
  ]
  return <WsDiagram title="A measuring cylinder with four numbered marks.">
    <TallCylinder x={cx} y={base} top={top} w={w} surf={surf} dip={6} />
    <Eye x={170} y={surf + 6} look={0} />
    <Sight from={[192, surf + 6]} to={[cx - w / 2 - 4, surf + 6]} />
    {pts.map(([n, at, to]) => <Numbered key={n} n={n} at={at} to={to} />)}
  </WsDiagram>
}

export function WsMeasureVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  switch (focus) {
    case 'wsmeasure-zero': return <Zero />
    case 'wsmeasure-transfer': return <Transfer />
    case 'wsmeasure-difference': return <Difference />
    case 'wsmeasure-dropper': return <Dropper />
    case 'wsmeasure-pipette': return <Pipette />
    case 'wsmeasure-cylinder': return <Cylinders />
    case 'wsmeasure-meniscus': return <Meniscus />
    case 'wsmeasure-syringe': return <Syringe />
    case 'wsmeasure-upturned': return <Upturned />
    case 'wsmeasure-bubbles': return <BubbleCount />
    case 'wsmeasure-q-meniscus': return <QMeniscus />
    default: return null
  }
}

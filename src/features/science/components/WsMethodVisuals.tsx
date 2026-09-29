import type { ReactNode } from 'react'
import { physicsPalette, PhysicsDiagram, Lines, Leader, type Pt } from './PhysicsKit'
import { Arrow, Bust, PotPlant, Ruler, tones } from './WsKit'

/*
 * Working Scientifically Lesson 1: The scientific method. Original, code-native schematics; not to scale.
 * Every focus id here starts with 'wsmethod-' and is routed from CellBiologyVisuals.tsx.
 *
 * Built on the Working Scientifically kit (WsKit: arrows, people, pot plants, rulers, ticks and crosses). The few extra
 * pieces at the top (multi-line notes, icons, paper, magnifier, balance scale, sun) are shared with lessons 2 and 3
 * (WsIssueVisuals, WsRiskVisuals).
 * Colour per step of the method, the same in every frame: observation teal, hypothesis amber, prediction purple,
 * test blue, evidence green. A tick is green and a cross coral, as in the Physics pro/con tags.
 */
const P = physicsPalette
const { ink, muted } = P
export const wsFaded = 0.28
export const r1 = (n: number) => Math.round(n * 10) / 10

export type Tone = { fill: string; line: string }
export const wsTone = {
  observe: { fill: P.electrostatic, line: P.electrostaticLine },
  hypothesis: { fill: P.light, line: P.lightLine },
  predict: { fill: P.chemical, line: P.chemicalLine },
  test: { fill: P.water, line: P.waterLine },
  evidence: { fill: P.usefulFill, line: P.useful },
  good: { fill: tones.good.fill, line: tones.good.line },
  bad: { fill: tones.bad.fill, line: tones.bad.line },
  plain: { fill: P.panel, line: tones.plain.line },
} satisfies Record<string, Tone>

/* ---------- Shared kit ---------- */

export type IconKind = 'tick' | 'cross' | 'eye' | 'bulb' | 'arrow' | 'flask' | 'question' | 'warn'
/** A small round icon (r ≈ 10) in the tone's line colour. */
export function Icon({ kind, x, y, colour = ink, s = 1 }: { kind: IconKind; x: number; y: number; colour?: string; s?: number }) {
  const glyph: Record<IconKind, ReactNode> = {
    tick: <path d="M-4.5 0.5L-1.2 4L5 -3.5" strokeWidth="2.4" fill="none" />,
    cross: <path d="M-4 -4L4 4M4 -4L-4 4" strokeWidth="2.4" fill="none" />,
    eye: <g><path d="M-7.5 0Q0 -7.5 7.5 0Q0 7.5 -7.5 0Z" fill="white" strokeWidth="1.6" /><circle r="3" fill={colour} stroke="none" /></g>,
    bulb: <g><path d="M-3 4.5V2.5Q-6.5 0 -6.5 -3Q-6.5 -8.5 0 -8.5Q6.5 -8.5 6.5 -3Q6.5 0 3 2.5V4.5Z" fill="white" strokeWidth="1.6" /><path d="M-3 6.5H3M-2 8.5H2" strokeWidth="1.6" /></g>,
    arrow: <g><path d="M-7 0H3" strokeWidth="2.4" /><path d="M1 -5L7 0L1 5Z" fill={colour} strokeWidth="1" /></g>,
    flask: <path d="M-2.5 -8V-3L-7 6Q-7.5 8 -5 8H5Q7.5 8 7 6L2.5 -3V-8M-4 -8H4" fill="white" strokeWidth="1.6" />,
    question: <g stroke="none"><text y="5" textAnchor="middle" fontSize="15" fontWeight="800" fill={colour}>?</text></g>,
    warn: <g stroke="none"><text y="5.5" textAnchor="middle" fontSize="15" fontWeight="800" fill={colour}>!</text></g>,
  }
  return <g transform={`translate(${x} ${y}) scale(${s})`} stroke={colour} strokeLinecap="round" strokeLinejoin="round">
    <circle r="10.5" fill="white" stroke={colour} strokeWidth="1.6" />
    {glyph[kind]}
  </g>
}

/** Rough width of a tag, so tags can be laid out. */
export function tagWidth(lines: string[], size = 13, icon = false) {
  return Math.round(Math.max(...lines.map(l => l.length)) * size * 0.63 + 26 + (icon ? 24 : 0))
}
/**
 * A rounded tag centred on (x, y) (or starting/ending at x). With `head`, the first line is a bold heading in the
 * tone's colour. `icon` puts a small round icon at the left.
 */
export function Note({ x, y, lines, tone = wsTone.plain, anchor = 'middle', size = 13, icon, head = false, dim = false, soft = true, w: fixedW }: {
  x: number; y: number; lines: string[]; tone?: Tone; anchor?: 'start' | 'middle' | 'end'; size?: number; icon?: IconKind; head?: boolean; dim?: boolean; soft?: boolean; w?: number
}) {
  const w = fixedW ?? tagWidth(lines, size, !!icon), lh = size + 4, h = lines.length * lh + 13
  const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x
  const top = y - h / 2, tx = left + 13 + (icon ? 23 : 0)
  return <g opacity={dim ? wsFaded : 1}>
    <rect x={r1(left)} y={r1(top)} width={w} height={h} rx={Math.min(h / 2, 15)} fill={soft ? tone.fill : 'white'} fillOpacity={soft ? 0.5 : 1} stroke={tone.line} strokeWidth="1.8" />
    {icon && <Icon kind={icon} x={r1(left + 19)} y={y} colour={tone.line} />}
    <text x={r1(tx)} y={r1(top + 6.5 + size)} fontSize={size} fontWeight="700" fill={ink}>
      {lines.map((l, i) => <tspan key={i} x={r1(tx)} dy={i ? lh : 0} fill={head && i === 0 ? tone.line : ink} fontWeight={head && i === 0 ? 800 : 650}>{l}</tspan>)}
    </text>
  </g>
}

/** A numbered circle for question views. */
export function Num({ x, y, n }: { x: number; y: number; n: number }) {
  return <g><circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2.2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={ink}>{n}</text></g>
}

/** A scientist: a WsKit bust in a white lab coat with a collar; (x, y) is the middle of the shoulders' base. */
export function Scientist({ x, y, s = 1, kind = 0, dim = false }: { x: number; y: number; s?: number; kind?: number; dim?: boolean }) {
  return <g opacity={dim ? wsFaded : 1}>
    <Bust x={x} y={y} s={s} kind={kind} />
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-24 0C-24 -18 -15 -27 0 -27C15 -27 24 -18 24 0Z" fill="white" stroke="#8fa3b3" strokeWidth="2" />
      <path d="M-7 -26L0 -12L7 -26M0 -12V0" fill="none" stroke="#8fa3b3" strokeWidth="1.6" />
    </g>
  </g>
}

/** A sheet of paper with text lines; (x, y) is its top-left. */
export function Paper({ x, y, w = 56, h = 72, title, tone = wsTone.plain, lines = 4, dim = false }: { x: number; y: number; w?: number; h?: number; title?: string; tone?: Tone; lines?: number; dim?: boolean }) {
  const fold = Math.min(14, w * .22)
  return <g opacity={dim ? wsFaded : 1}>
    <path d={`M${x} ${y + 4}Q${x} ${y} ${x + 4} ${y}H${x + w - fold}L${x + w} ${y + fold}V${y + h - 4}Q${x + w} ${y + h} ${x + w - 4} ${y + h}H${x + 4}Q${x} ${y + h} ${x} ${y + h - 4}Z`} fill="white" stroke={tone.line} strokeWidth="1.8" />
    <path d={`M${x + w - fold} ${y}V${y + fold}H${x + w}`} fill={tone.fill} stroke={tone.line} strokeWidth="1.4" />
    {Array.from({ length: lines }, (_, i) => <path key={i} d={`M${x + 8} ${r1(y + 18 + i * (h - 26) / Math.max(1, lines))}H${r1(x + w - (i % 2 ? 16 : 10))}`} stroke="#b8c7d2" strokeWidth="2.4" />)}
    {title && <text x={x + w / 2} y={y + h + 17} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{title}</text>}
  </g>
}

/** A magnifying glass; the lens centre is (x, y) and the handle points along `angle` degrees. */
export function Magnifier({ x, y, r = 22, angle = 45, colour = ink }: { x: number; y: number; r?: number; angle?: number; colour?: string }) {
  const a = angle * Math.PI / 180, hx = x + Math.cos(a) * r, hy = y + Math.sin(a) * r
  return <g>
    <path d={`M${r1(hx)} ${r1(hy)}L${r1(hx + Math.cos(a) * r * 1.1)} ${r1(hy + Math.sin(a) * r * 1.1)}`} stroke="#8a6443" strokeWidth="7" />
    <circle cx={x} cy={y} r={r} fill="#eaf5fb" fillOpacity=".55" stroke={colour} strokeWidth="3" />
    <path d={`M${r1(x - r * .55)} ${r1(y - r * .15)}Q${r1(x - r * .5)} ${r1(y - r * .5)} ${r1(x - r * .15)} ${r1(y - r * .58)}`} stroke="white" strokeWidth="3" fill="none" />
  </g>
}

/**
 * A balance scale on a stand, centred at x, with the pivot at y. `tilt` > 0 lowers the left pan. The pans' contents
 * are drawn by `left`/`right` with the pan's rim at the local origin.
 */
export function Scale({ x, y, tilt = 0, span = 150, left, right, leftLabel, rightLabel, leftTone = wsTone.plain, rightTone = wsTone.plain }: {
  x: number; y: number; tilt?: number; span?: number; left?: ReactNode; right?: ReactNode; leftLabel?: string; rightLabel?: string; leftTone?: Tone; rightTone?: Tone
}) {
  const half = span / 2, dy = tilt * 22
  const pan = (px: number, py: number, content: ReactNode, label: string | undefined, tone: Tone) => <g>
    <path d={`M${px} ${py}L${px - 38} ${py + 54}M${px} ${py}L${px + 38} ${py + 54}`} stroke="#8a9aa7" strokeWidth="1.6" />
    <g transform={`translate(${px} ${py + 54})`}>{content}</g>
    <path d={`M${px - 46} ${py + 54}Q${px} ${py + 76} ${px + 46} ${py + 54}Z`} fill={tone.fill} stroke={tone.line} strokeWidth="2" />
    {label && <text x={px} y={py + 96} textAnchor="middle" fontSize="14" fontWeight="750" fill={tone.line}>{label}</text>}
  </g>
  return <g>
    <path d={`M${x} ${y}V${y + 130}`} stroke="#8a6443" strokeWidth="6" />
    <path d={`M${x - 42} ${y + 134}Q${x} ${y + 124} ${x + 42} ${y + 134}Z`} fill="#e9d6bd" stroke="#8a6443" strokeWidth="2" />
    <path d={`M${x - half} ${y + dy}L${x + half} ${y - dy}`} stroke="#6d5238" strokeWidth="5" />
    <circle cx={x} cy={y} r="6" fill="#e9d6bd" stroke="#6d5238" strokeWidth="2" />
    {pan(x - half, y + dy, left, leftLabel, leftTone)}
    {pan(x + half, y - dy, right, rightLabel, rightTone)}
  </g>
}

/** A soft sun. */
export function Sun({ x, y, r = 20 }: { x: number; y: number; r?: number }) {
  return <g>
    {Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return <path key={i} d={`M${r1(x + Math.cos(a) * (r + 5))} ${r1(y + Math.sin(a) * (r + 5))}L${r1(x + Math.cos(a) * (r + 12))} ${r1(y + Math.sin(a) * (r + 12))}`} stroke={P.lightLine} strokeWidth="2.4" /> })}
    <circle cx={x} cy={y} r={r} fill="#fcd97d" stroke={P.lightLine} strokeWidth="2" />
  </g>
}

/* ---------- Section 2: observation → hypothesis → prediction → test (the fence garden) ---------- */

const GROUND = 214
type Step = 'observe' | 'hypothesis' | 'predict' | 'test'
const STEPS: { key: Step; name: string; tone: Tone; icon: IconKind }[] = [
  { key: 'observe', name: 'observation', tone: wsTone.observe, icon: 'eye' },
  { key: 'hypothesis', name: 'hypothesis', tone: wsTone.hypothesis, icon: 'bulb' },
  { key: 'predict', name: 'prediction', tone: wsTone.predict, icon: 'arrow' },
  { key: 'test', name: 'test', tone: wsTone.test, icon: 'flask' },
]
/** The row of four step chips under the garden: `on` steps are coloured, `done` steps outlined, the rest faint. */
function StepRow({ on, done }: { on: Step[]; done: Step[] }) {
  const w = 110, cy = 266
  return <g>{STEPS.map((s, i) => {
    const cx = 70 + i * 133, state = on.includes(s.key) ? 'on' : done.includes(s.key) ? 'done' : 'off'
    return <g key={s.key} opacity={state === 'off' ? .4 : 1}>
      {i > 0 && <Arrow from={[cx - 133 + w / 2 + 4, cy]} to={[cx - w / 2 - 4, cy]} colour={state === 'off' ? '#9fb3c2' : muted} width={2} />}
      <rect x={cx - w / 2} y={cy - 16} width={w} height={32} rx="16" fill={state === 'on' ? s.tone.fill : 'white'} stroke={state === 'off' ? '#9fb3c2' : s.tone.line} strokeWidth={state === 'on' ? 2.4 : 1.6} strokeDasharray={state === 'off' ? '4 4' : undefined} />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight={state === 'on' ? 800 : 650} fill={state === 'off' ? muted : ink}>{s.name}</text>
    </g>
  })}</g>
}
const PS = 0.72
/** Stem height (PotPlant units) that puts the plant's tip at page height `top`. */
const stemTo = (top: number) => r1((GROUND - top) / PS - 44)
function Garden({ stage }: { stage: 'observe' | 'predict' | 'test' }) {
  const tall = [60, 112, 164], shady = [372, 440]
  return <g>
    {/* sunlight on the left, the fence's shade on the right */}
    <path d={`M52 48L250 92V${GROUND}H14Z`} fill={P.light} opacity=".35" />
    <path d={`M268 92L540 150V${GROUND}H268Z`} fill="#dfe6ec" opacity=".85" />
    <Sun x={52} y={48} />
    <path d={`M8 ${GROUND}Q270 ${GROUND - 3} 532 ${GROUND}V${GROUND + 18}H8Z`} fill="#efe2c8" stroke="#b89a68" strokeWidth="1.6" />
    <path d={`M8 ${GROUND}Q270 ${GROUND - 3} 532 ${GROUND}`} stroke={P.plantLine} strokeWidth="2.4" fill="none" />
    {/* the fence, seen end on */}
    <path d={`M250 ${GROUND}V98L259 88L268 98V${GROUND}Z`} fill="#e9d6bd" stroke="#9a7550" strokeWidth="2" />
    <path d="M259 102V206" stroke="#9a7550" strokeWidth="1.2" opacity=".6" />
    <text x={130} y={GROUND + 14} textAnchor="middle" fontSize="12" fontWeight="700" fill="#8a6a2a">sunny side</text>
    <text x={400} y={GROUND + 14} textAnchor="middle" fontSize="12" fontWeight="700" fill={muted}>shady side</text>
    {tall.map((x, i) => stage !== 'observe' && i === 2
      ? stage === 'predict' ? <PotPlant key={x} x={x} y={GROUND} s={PS} h={stemTo(170)} dim /> : null
      : <PotPlant key={x} x={x} y={GROUND} s={PS} h={stemTo(98 + i * 6)} />)}
    {stage === 'observe' && <PotPlant x={214} y={GROUND} s={PS} h={stemTo(104)} />}
    {shady.map(x => <PotPlant key={x} x={x} y={GROUND} s={PS} h={stemTo(166 + (x % 3) * 3)} />)}
    {stage === 'predict' && <g>
      <PotPlant x={214} y={GROUND} s={PS} h={stemTo(170)} />
      <PotPlant x={306} y={GROUND} s={PS} h={stemTo(170)} />
      <Arrow from={[164, 150]} to={[300, 150]} bend={-.3} colour={wsTone.predict.line} width={3} />
    </g>}
    {stage === 'test' && <g>
      <PotPlant x={214} y={GROUND} s={PS} h={stemTo(112)} />
      <Ruler x={239} y={GROUND - 30} h={82} />
      <PotPlant x={306} y={GROUND} s={PS} h={stemTo(160)} />
      <Ruler x={331} y={GROUND - 30} h={82} />
    </g>}
    <Bust x={505} y={GROUND} s={.8} kind={2} />
  </g>
}
function Observe() {
  return <PhysicsDiagram title="A garden fence with the Sun on the left. Plants in pots on the sunny side are taller than those on the shady side. Observation: plants on the sunny side are taller. A gardener thinks of a hypothesis: they get more sunlight.">
    <Garden stage="observe" />
    <Note x={392} y={40} lines={['observation', 'sunny-side plants are taller']} tone={wsTone.observe} icon="eye" head />
    <Leader from={[290, 58]} to={[222, 92]} colour={wsTone.observe.line} />
    <g opacity=".85">
      <Note x={420} y={108} lines={['hypothesis', 'they get more sunlight']} tone={wsTone.hypothesis} icon="bulb" head soft />
      <circle cx={494} cy={140} r="4" fill={P.light} stroke={P.lightLine} strokeWidth="1.4" />
      <circle cx={503} cy={150} r="2.6" fill={P.light} stroke={P.lightLine} strokeWidth="1.2" />
    </g>
    <StepRow on={['observe', 'hypothesis']} done={[]} />
  </PhysicsDiagram>
}
function Predict() {
  return <PhysicsDiagram title="The same garden. One pot is moved from the sunny side into the shade. Prediction: plants moved into the shade will grow less.">
    <Garden stage="predict" />
    <Note x={404} y={52} lines={['prediction', 'plants moved into the shade', 'will grow less']} tone={wsTone.predict} icon="arrow" head />
    <StepRow on={['predict']} done={['observe', 'hypothesis']} />
  </PhysicsDiagram>
}
function Test() {
  return <PhysicsDiagram title="The test: after some weeks, a ruler shows the plant moved into the shade grew less than the one left in the sun. The result is evidence, but one result does not prove the hypothesis.">
    <Garden stage="test" />
    <Note x={404} y={34} lines={['test result', 'the shade plant grew less']} tone={wsTone.test} icon="flask" head />
    <Note x={404} y={84} lines={['evidence for the hypothesis']} tone={wsTone.evidence} icon="tick" />
    <Note x={404} y={124} lines={['one result does not prove it']} tone={wsTone.plain} size={12} />
    <StepRow on={['test']} done={['observe', 'hypothesis', 'predict']} />
  </PhysicsDiagram>
}

/** The whole chain: four boxes and the evidence box. With `numbers`, boxes show 1–4 only (question view). */
function Chain({ numbers = false }: { numbers?: boolean }) {
  const w = 108, h = 104, top = 58, xs = [18, 148, 278, 408]
  return <PhysicsDiagram schematic={false} title={numbers ? 'A chain of four numbered boxes joined by arrows.' : 'The scientific method as a chain: observation, then hypothesis, then prediction, then test. The result of the test is the evidence.'}>
    {!numbers && <text x={270} y={34} textAnchor="middle" fontSize="15" fontWeight="750" fill={ink}>the same chain in Biology, Chemistry and Physics</text>}
    {STEPS.map((s, i) => {
      const x = xs[i], tone = numbers ? wsTone.plain : s.tone
      return <g key={s.key}>
        {i > 0 && <Arrow from={[xs[i - 1] + w + 3, top + h / 2]} to={[x - 3, top + h / 2]} colour={muted} width={2.6} />}
        <rect x={x} y={top} width={w} height={h} rx="18" fill={tone.fill} fillOpacity={numbers ? 1 : .55} stroke={tone.line} strokeWidth="2.2" />
        {numbers
          ? <text x={x + w / 2} y={top + h / 2 + 12} textAnchor="middle" fontSize="34" fontWeight="800" fill={ink}>{i + 1}</text>
          : <g>
            <Icon kind={s.icon} x={x + w / 2} y={top + 36} colour={s.tone.line} s={1.7} />
            <text x={x + w / 2} y={top + 84} textAnchor="middle" fontSize="14.5" fontWeight="800" fill={ink}>{s.name}</text>
          </g>}
      </g>
    })}
    {!numbers && <g>
      <Arrow from={[xs[3] + w / 2, top + h + 4]} to={[xs[3] + w / 2, 208]} colour={muted} width={2.6} />
      <rect x={xs[3] - 4} y={212} width={w + 8} height={46} rx="16" fill={wsTone.evidence.fill} stroke={wsTone.evidence.line} strokeWidth="2.2" />
      <Icon kind="tick" x={xs[3] + 16} y={235} colour={wsTone.evidence.line} />
      <text x={xs[3] + 32} y={240} fontSize="14" fontWeight="800" fill={ink}>evidence</text>
      <Lines x={xs[3] - 16} y={228} anchor="end" lines={['the result of the test', 'is the evidence']} size={13} weight={650} colour={muted} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 3: peer review and sharing ---------- */

function Lab({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 34} ${y + 22}V${y - 8}L${x} ${y - 26}L${x + 34} ${y - 8}V${y + 22}Z`} fill={P.panel} stroke="#8aa0b1" strokeWidth="1.8" />
    <Icon kind="flask" x={x} y={y + 4} colour={wsTone.test.line} s={1.1} />
  </g>
}
function Peer({ mode }: { mode: 'peer' | 'share' | 'evidence' }) {
  const titles = {
    peer: 'A scientist hands a report to two other scientists, who look over it with magnifying glasses. This checking is peer review: is the method sensible?',
    share: 'The report becomes a scientific paper. Arrows go out to three other labs so they can repeat the work.',
    evidence: 'A balance scale: more evidence for the hypothesis on one side, some evidence against on the other. Scientists use all of it to decide what to believe.',
  }
  return <PhysicsDiagram title={titles[mode]}>
    <Scientist x={70} y={250} s={1.5} />
    <text x={70} y={276} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>the first team</text>
    {mode === 'peer' && <g>
      <Note x={270} y={30} lines={['peer review', 'is the method sensible?']} tone={wsTone.evidence} icon="question" head />
      <Arrow from={[110, 170]} to={[200, 170]} colour={muted} width={2.6} />
      <Paper x={214} y={120} w={84} h={108} title="report" lines={6} />
      <Magnifier x={262} y={158} r={24} angle={40} />
      <Magnifier x={246} y={196} r={20} angle={20} />
      <Scientist x={400} y={250} s={1.5} />
      <Scientist x={476} y={250} s={1.5} />
      <text x={438} y={276} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>other scientists check</text>
    </g>}
    {mode === 'share' && <g>
      <Note x={270} y={30} lines={['share the results', 'so others can repeat the work']} tone={wsTone.test} icon="arrow" head />
      <Arrow from={[110, 170]} to={[176, 170]} colour={muted} width={2.6} />
      <Paper x={186} y={112} w={90} h={116} lines={6} tone={wsTone.test} />
      <Lines x={231} y={250} anchor="middle" lines={['scientific paper']} size={13} />
      {[[440, 88], [470, 164], [440, 240]].map(([lx, ly], i) => <g key={i}>
        <Arrow from={[284, 170]} to={[lx - 42, ly - (ly - 170) * .1]} colour={wsTone.test.line} width={2.4} />
        <Lab x={lx} y={ly - 6} />
      </g>)}
      <Lines x={440} y={292} anchor="middle" lines={['other labs repeat it']} size={13} weight={650} colour={muted} />
    </g>}
    {mode === 'evidence' && <g>
      <Note x={300} y={30} lines={['decide what to believe']} tone={wsTone.plain} icon="question" />
      <Scale x={320} y={78} tilt={.6} span={200}
        leftTone={wsTone.good} rightTone={wsTone.bad} leftLabel="evidence for" rightLabel="evidence against"
        left={<g>{[-24, 0, 24].map((dx, i) => <g key={i} transform={`translate(${dx - 11} ${-40 + (i === 1 ? -6 : 0)})`}><rect width="22" height="30" rx="3" fill="white" stroke={P.useful} strokeWidth="1.6" /><path d="M5 16l4 4l8 -9" stroke={P.useful} strokeWidth="2.2" fill="none" /></g>)}</g>}
        right={<g transform="translate(-11 -36)"><rect width="22" height="30" rx="3" fill="white" stroke={P.wasted} strokeWidth="1.6" /><path d="M6 10l10 10M16 10l-10 10" stroke={P.wasted} strokeWidth="2.2" /></g>} />
    </g>}
  </PhysicsDiagram>
}

/* ---------- Section 4: accepted, rejected, ideas change ---------- */

function Card({ x, y, lines, tone, w = 116 }: { x: number; y: number; lines: string[]; tone: Tone; w?: number }) {
  const h = lines.length * 18 + 22
  return <g>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="10" fill={tone.fill} stroke={tone.line} strokeWidth="2.2" />
    <Lines x={x} y={y - h / 2 + 25} anchor="middle" lines={lines} size={14} />
  </g>
}
function Gate({ x, stop = false }: { x: number; stop?: boolean }) {
  return <g>
    <path d={`M${x - 70} 216Q${x} 213 ${x + 70} 216`} stroke={P.panelLine} strokeWidth="3" fill="none" />
    <path d={`M${x - 34} 214V96Q${x - 34} 62 ${x} 62Q${x + 34} 62 ${x + 34} 96V214`} fill="none" stroke="#8aa0b1" strokeWidth="9" />
    <path d={`M${x - 34} 214V96Q${x - 34} 62 ${x} 62Q${x + 34} 62 ${x + 34} 96V214`} fill="none" stroke={P.panel} strokeWidth="5" />
    <text x={x} y={52} textAnchor="middle" fontSize="14" fontWeight="800" fill={ink}>testing</text>
    <Icon kind="flask" x={x} y={84} colour={wsTone.test.line} />
    {stop && <g><circle cx={x} cy={150} r="24" fill={P.wastedFill} stroke={P.wasted} strokeWidth="2.6" /><path d={`M${x - 10} 140l20 20M${x + 10} 140l-20 20`} stroke={P.wasted} strokeWidth="4" /></g>}
  </g>
}
function Book({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 64} ${y}Q${x - 32} ${y - 10} ${x} ${y}Q${x + 32} ${y - 10} ${x + 64} ${y}V${y + 16}Q${x + 32} ${y + 6} ${x} ${y + 16}Q${x - 32} ${y + 6} ${x - 64} ${y + 16}Z`} fill="#dce6f4" stroke={P.gravitationalLine} strokeWidth="2" />
    <path d={`M${x} ${y}V${y + 16}`} stroke={P.gravitationalLine} strokeWidth="1.6" />
    <text x={x} y={y + 36} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>textbook</text>
  </g>
}
function Accepted() {
  return <PhysicsDiagram title="A hypothesis card passes through a gate labelled testing and comes out as an accepted theory, resting on a textbook. A long arrow below shows many years of testing.">
    <Card x={70} y={150} lines={['hypothesis']} tone={wsTone.hypothesis} w={110} />
    <Arrow from={[128, 150]} to={[222, 150]} colour={muted} width={3} />
    <Gate x={270} />
    <Arrow from={[318, 150]} to={[394, 150]} colour={wsTone.evidence.line} width={3} />
    <Card x={462} y={140} lines={['accepted', 'theory']} tone={wsTone.evidence} w={120} />
    <Icon kind="tick" x={516} y={112} colour={wsTone.evidence.line} s={1.2} />
    <Book x={462} y={186} />
    <Arrow from={[40, 254]} to={[500, 254]} colour={muted} width={2.4} />
    {[80, 150, 220, 290, 360, 430].map(x => <path key={x} d={`M${x} 248v12`} stroke={muted} strokeWidth="2" />)}
    <text x={270} y={284} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>many years of testing</text>
  </PhysicsDiagram>
}
function Rejected() {
  return <PhysicsDiagram title="A hypothesis card is stopped at the testing gate with a cross. Two arrows loop back to the start: change it, or make a new hypothesis, then test again.">
    <Card x={70} y={150} lines={['hypothesis']} tone={wsTone.hypothesis} w={110} />
    <Arrow from={[128, 150]} to={[216, 150]} colour={muted} width={3} />
    <Gate x={270} stop />
    <Note x={420} y={150} lines={['evidence says no']} tone={wsTone.bad} icon="cross" />
    <Arrow from={[240, 104]} to={[84, 118]} bend={.45} colour={wsTone.hypothesis.line} width={2.8} />
    <Arrow from={[240, 196]} to={[84, 182]} bend={-.45} colour={wsTone.hypothesis.line} width={2.8} />
    <Note x={162} y={46} lines={['change it']} tone={wsTone.hypothesis} />
    <Note x={162} y={256} lines={['make a new hypothesis']} tone={wsTone.hypothesis} />
    <Lines x={420} y={200} anchor="middle" lines={['then test again']} size={14} weight={700} colour={muted} />
  </PhysicsDiagram>
}
function Orbit({ x, y, centre }: { x: number; y: number; centre: 'earth' | 'sun' }) {
  const earth = (cx: number, cy: number, r: number) => <g><circle cx={cx} cy={cy} r={r} fill={P.water} stroke={P.waterLine} strokeWidth="1.8" /><path d={`M${cx - r * .5} ${cy - r * .2}q${r * .4} ${-r * .5} ${r * .7} 0q-${r * .2} ${r * .5} -${r * .6} ${r * .5}z`} fill={P.plant} stroke="none" /></g>
  return <g>
    <ellipse cx={x} cy={y} rx="48" ry="20" fill="none" stroke="#9fb3c2" strokeWidth="1.6" strokeDasharray="4 4" />
    {centre === 'earth' ? <g>{earth(x, y, 12)}<Sun x={x + 46} y={y - 6} r={8} /></g> : <g><Sun x={x} y={y} r={11} />{earth(x + 46, y - 6, 7)}</g>}
  </g>
}
function History() {
  const rowY = [94, 218]
  const change = (y: number) => <g>
    <Arrow from={[208, y]} to={[322, y]} colour={wsTone.evidence.line} width={3} />
    <text x={265} y={y - 12} textAnchor="middle" fontSize="13" fontWeight="750" fill={wsTone.evidence.line}>new evidence</text>
  </g>
  return <PhysicsDiagram title="Two ideas that changed with new evidence. The Sun goes round the Earth was replaced by the Earth goes round the Sun. An old atom model was replaced by a newer atom model.">
    <Orbit x={110} y={rowY[0]} centre="earth" />
    <Lines x={110} y={rowY[0] + 46} anchor="middle" lines={['Sun goes round the Earth']} size={13} weight={650} colour={muted} />
    {change(rowY[0])}
    <Orbit x={420} y={rowY[0]} centre="sun" />
    <Lines x={420} y={rowY[0] + 46} anchor="middle" lines={['Earth goes round the Sun']} size={13} />
    {/* atom: a ball with charges spread through it → a small nucleus with shells */}
    <circle cx={110} cy={rowY[1]} r="30" fill={P.thermal} fillOpacity=".55" stroke={P.thermalLine} strokeWidth="1.8" />
    {[[-14, -12], [10, -16], [-4, 6], [16, 8], [-18, 12], [4, -2]].map(([dx, dy], i) => <circle key={i} cx={110 + dx} cy={rowY[1] + dy} r="3.6" fill={P.charge} />)}
    <Lines x={110} y={rowY[1] + 50} anchor="middle" lines={['old atom model']} size={13} weight={650} colour={muted} />
    {change(rowY[1])}
    <circle cx={420} cy={rowY[1]} r="30" fill="none" stroke="#9fb3c2" strokeWidth="1.6" />
    <circle cx={420} cy={rowY[1]} r="17" fill="none" stroke="#9fb3c2" strokeWidth="1.6" />
    <circle cx={420} cy={rowY[1]} r="6" fill={P.thermal} stroke={P.thermalLine} strokeWidth="1.6" />
    {[[0, -17], [0, 17], [30, 0], [-30, 0], [21, 21], [-21, -21]].map(([dx, dy], i) => <circle key={i} cx={420 + dx} cy={rowY[1] + dy} r="3.6" fill={P.charge} />)}
    <Lines x={420} y={rowY[1] + 50} anchor="middle" lines={['newer atom model']} size={13} />
  </PhysicsDiagram>
}

/* ---------- Section 5: models ---------- */

function WaterMolecule({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const h = (a: number): Pt => [r1(x + Math.sin(a) * 62 * s), r1(y + Math.cos(a) * 62 * s)]
  const [a, b] = [h(-.91), h(.91)]
  return <g>
    {[a, b].map(([hx, hy], i) => <path key={i} d={`M${x} ${y}L${hx} ${hy}`} stroke="#9aa7b2" strokeWidth={8 * s} />)}
    <circle cx={x} cy={y} r={34 * s} fill="#f3a7a0" stroke={P.thermalLine} strokeWidth="2.2" />
    <path d={`M${r1(x - 20 * s)} ${r1(y - 12 * s)}Q${r1(x - 14 * s)} ${r1(y - 24 * s)} ${x} ${r1(y - 26 * s)}`} stroke="white" strokeWidth="4" fill="none" opacity=".8" />
    {[a, b].map(([hx, hy], i) => <circle key={`h${i}`} cx={hx} cy={hy} r={20 * s} fill="white" stroke="#7f95a6" strokeWidth="2.2" />)}
    <text x={x} y={y + 7} textAnchor="middle" fontSize="18" fontWeight="800" fill="#8a3a30">O</text>
    {[a, b].map(([hx, hy], i) => <text key={`t${i}`} x={hx} y={hy + 6} textAnchor="middle" fontSize="16" fontWeight="800" fill={muted}>H</text>)}
  </g>
}
function ModelWater() {
  return <PhysicsDiagram title="Left: real life, with sea, clouds and rain over hills. Right: a simple water cycle diagram, a model. A model can explain ideas and make predictions.">
    {/* real life */}
    <rect x={16} y={40} width={220} height={200} rx="18" fill="#f2f8fc" stroke="#c9d8e2" strokeWidth="1.6" />
    <path d="M16 196Q70 186 120 196T236 190V222Q236 240 218 240H34Q16 240 16 222Z" fill={P.water} stroke={P.waterLine} strokeWidth="1.8" />
    <path d="M104 196C124 150 148 112 166 112C184 112 190 140 204 140C216 140 224 124 236 122V190Q180 196 104 196Z" fill={P.plant} stroke={P.plantLine} strokeWidth="1.8" />
    <path d="M120 86q-4 -20 16 -22q8 -16 26 -8q18 -6 22 12q14 4 8 18H126q-10 0 -6 0Z" fill="white" stroke="#9fb3c2" strokeWidth="1.8" />
    {[136, 152, 168, 184].map(x => <path key={x} d={`M${x} 100l-4 12`} stroke={P.waterLine} strokeWidth="2" />)}
    <Sun x={52} y={76} r={14} />
    <text x={126} y={266} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>real life</text>
    <Arrow from={[246, 140]} to={[282, 140]} colour={muted} width={2.6} />
    {/* the model */}
    {[[360, 72, 'cloud'], [412, 200, 'rain'], [306, 200, 'sea']].map(([x, y, t]) => <g key={t as string}>
      <rect x={(x as number) - 36} y={(y as number) - 16} width="72" height="32" rx="16" fill={P.water} fillOpacity=".6" stroke={P.waterLine} strokeWidth="1.8" />
      <text x={x as number} y={(y as number) + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{t as string}</text>
    </g>)}
    <Arrow from={[318, 182]} to={[340, 90]} bend={-.25} colour={P.waterLine} width={2.4} />
    <Arrow from={[382, 90]} to={[412, 182]} bend={-.25} colour={P.waterLine} width={2.4} />
    <Arrow from={[376, 212]} to={[342, 212]} bend={-.4} colour={P.waterLine} width={2.4} />
    <text x={360} y={266} textAnchor="middle" fontSize="14" fontWeight="750" fill={ink}>a model</text>
    <Note x={478} y={112} lines={['explains']} tone={wsTone.good} icon="tick" />
    <Note x={478} y={160} lines={['predicts']} tone={wsTone.good} icon="tick" />
  </PhysicsDiagram>
}
function Spatial({ limits = false }: { limits?: boolean }) {
  return <PhysicsDiagram title={limits
    ? 'The ball-and-stick water molecule again, inside a dotted cloud with a question mark. The model does not show the electrons that make the bonds.'
    : 'A ball-and-stick model of a water molecule: one large oxygen ball joined by sticks to two small hydrogen balls. A spatial model shows where the parts are.'}>
    {limits && <ellipse cx={170} cy={156} rx="132" ry="104" fill="#eef3f7" stroke="#9fb3c2" strokeWidth="1.8" strokeDasharray="5 6" />}
    <WaterMolecule x={170} y={limits ? 132 : 112} s={1.2} />
    {!limits && <g>
      <Arrow from={[70, 250]} to={[270, 250]} bend={-.14} colour={muted} width={2.2} />
      <text x={170} y={286} textAnchor="middle" fontSize="13" fontWeight="650" fill={muted}>turn it round to see every side</text>
      <Note x={420} y={118} lines={['spatial model', 'shows where the', 'parts are']} tone={wsTone.predict} head />
      <Note x={420} y={196} lines={['sticks show which', 'atoms are joined']} tone={wsTone.plain} size={12.5} />
    </g>}
    {limits && <g>
      <text x={286} y={86} textAnchor="middle" fontSize="40" fontWeight="800" fill={P.wasted}>?</text>
      <Note x={430} y={140} lines={['does not show', 'the electrons', 'in the bonds']} tone={wsTone.bad} icon="cross" />
      <Lines x={430} y={214} anchor="middle" lines={['every model', 'leaves something out']} size={13} weight={650} colour={muted} />
    </g>}
  </PhysicsDiagram>
}
function Computational() {
  const dots: ReactNode[] = []
  for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) {
    const d = Math.hypot(c - 2.5, r - 2.5), sick = d < 2.2
    dots.push(<circle key={`${r}-${c}`} cx={112 + c * 17} cy={80 + r * 17} r="5" fill={sick ? P.thermal : 'white'} stroke={sick ? P.thermalLine : '#9fb3c2'} strokeWidth="1.5" />)
  }
  return <PhysicsDiagram title="A laptop screen shows a computer simulation: dots on a grid change colour as something spreads, and a line graph rises. This is a computational model.">
    <g transform="translate(14 22) scale(.86)">
    <path d="M86 52Q86 44 94 44H340Q348 44 348 52V196H86Z" fill="#3d5163" stroke="#2d3d4b" strokeWidth="2" />
    <rect x={96} y={54} width={242} height={132} rx="4" fill="white" />
    <path d="M60 196H374L386 212Q388 218 380 218H54Q46 218 48 212Z" fill="#c9d4dd" stroke="#6f8292" strokeWidth="2" />
    {dots}
    <path d="M252 170V70M252 170H328" stroke={ink} strokeWidth="1.6" />
    <path d="M254 166Q276 164 288 140T326 80" stroke={P.thermalLine} strokeWidth="2.6" fill="none" />
    </g>
    <Note x={436} y={112} lines={['computational model', 'a computer simulation', 'of a real process']} tone={wsTone.test} head />
    <Lines x={200} y={250} anchor="middle" lines={['e.g. how a flu virus might spread']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}
function Bohr() {
  const cx = 160, cy = 150
  const e = (r: number, n: number, off: number) => Array.from({ length: n }, (_, i) => { const a = off + i * 2 * Math.PI / n; return <circle key={`${r}-${i}`} cx={r1(cx + Math.cos(a) * r)} cy={r1(cy + Math.sin(a) * r)} r="6" fill={P.charge} stroke={P.chargeLine} strokeWidth="1.4" /> })
  return <PhysicsDiagram title="A simple Bohr model of an atom: a nucleus with electrons in two shells. It explains trends in the periodic table, but it cannot explain everything.">
    <circle cx={cx} cy={cy} r="54" fill="none" stroke="#9fb3c2" strokeWidth="2" />
    <circle cx={cx} cy={cy} r="96" fill="none" stroke="#9fb3c2" strokeWidth="2" />
    <circle cx={cx} cy={cy} r="18" fill={P.thermal} stroke={P.thermalLine} strokeWidth="2" />
    <text x={cx} y={cy + 5} textAnchor="middle" fontSize="12" fontWeight="800" fill="#8a3a30">+</text>
    {e(54, 2, 0)}{e(96, 6, -Math.PI / 2)}
    <Note x={410} y={92} lines={['explains trends in', 'the periodic table']} tone={wsTone.good} icon="tick" />
    <Note x={410} y={170} lines={['can\'t explain', 'everything']} tone={wsTone.bad} icon="cross" />
    <Lines x={410} y={240} anchor="middle" lines={['Bohr model: electrons', 'in shells round a nucleus']} size={13} weight={650} colour={muted} />
  </PhysicsDiagram>
}

export function WsMethodVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'wsmethod-observe': return <Observe />
    case 'wsmethod-predict': return <Predict />
    case 'wsmethod-test': return <Test />
    case 'wsmethod-chain': return <Chain numbers={assessment} />
    case 'wsmethod-q-chain': return <Chain numbers />
    case 'wsmethod-peer': return <Peer mode="peer" />
    case 'wsmethod-share': return <Peer mode="share" />
    case 'wsmethod-evidence': return <Peer mode="evidence" />
    case 'wsmethod-accepted': return <Accepted />
    case 'wsmethod-rejected': return <Rejected />
    case 'wsmethod-history': return <History />
    case 'wsmethod-model': return <ModelWater />
    case 'wsmethod-spatial': return <Spatial />
    case 'wsmethod-computational': return <Computational />
    case 'wsmethod-limits': return <Spatial limits />
    case 'wsmethod-bohr': return <Bohr />
    default: return null
  }
}

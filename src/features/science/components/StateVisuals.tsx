import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C2 (Chemistry Lesson 17): states of matter and changing state. Original, code-native schematics; not to scale.
 * Focus ids start with 'state-'.
 *
 * Particle model: every particle is one plain soft-grey ball (the neutral particle colour from AtomVisuals), because in
 * the model an atom, an ion or a molecule is just a small solid sphere. Each state is drawn in the same closed box:
 *   solid  = a regular block of touching particles sitting on the floor of the box (it keeps its own shape)
 *   liquid = touching particles in a random order, filling the bottom of the box
 *   gas    = a few particles far apart, each with a straight movement arrow
 * Heating and energy in = coral red (the Chemistry highlight colour); cooling and energy out = electron blue.
 * Temperature strips use the PeriodicVisuals tints: solid soft grey, liquid pale blue, gas pale amber.
 * Every melting and boiling point is a real value, rounded to the nearest degree.
 */
const { ink, muted, protonFill, protonLine, neutronFill, neutronLine, electronFill, electronLine, panelFill, panelLine, glow } = atomPalette
const faded = 0.3
const hot = protonLine, cold = electronLine
const greyFill = '#eef1f3', greyLine = '#7f8c97'
const blueFill = '#e4f0f9', blueLine = electronLine
const amberFill = '#fff4e6', amberLine = '#d9a55b', amberInk = '#8a5a14'
const r1 = (n: number) => Math.round(n * 10) / 10
const deg = (t: number) => `${t < 0 ? `−${-t}` : t} °C`

type Mode = 'on' | 'active' | 'off'
type Phase = 'solid' | 'liquid' | 'gas'

function Diagram({ title, children, viewBox = '0 0 540 320', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Num({ n, x, y }: { n: number; x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}

/** Chemical formula with subscript numbers (digits after a letter or a bracket) and optional small state symbols in (…). */
function Formula({ x, y, text, size = 18, anchor = 'middle', fill = ink, stateFill = protonLine }: { x: number; y: number; text: string; size?: number; anchor?: 'start' | 'middle' | 'end'; fill?: string; stateFill?: string }) {
  const parts: Array<{ t: string; kind: 'n' | 'sub' | 'state' }> = []
  const re = /\((s|l|g|aq)\)|(?<=[A-Za-z)])\d+|[^(\d]+|\d+|\(/g
  for (const m of text.matchAll(re)) {
    const t = m[0]
    if (m[1]) parts.push({ t, kind: 'state' })
    else if (/^\d+$/.test(t) && m.index > 0 && /[A-Za-z)]/.test(text[m.index - 1])) parts.push({ t, kind: 'sub' })
    else parts.push({ t, kind: 'n' })
  }
  const sub = Math.max(12, Math.round(size * .7)), drop = Math.round(size * .3)
  let lowered = false
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight="700" fill={fill}>{parts.map((p, i) => {
    if (p.kind === 'n') { const dy = lowered ? -drop : 0; lowered = false; return <tspan key={i} dy={dy}>{p.t}</tspan> }
    const dy = lowered ? 0 : drop; lowered = true
    return <tspan key={i} dy={dy} fontSize={sub} fill={p.kind === 'state' ? stateFill : fill}>{p.t}</tspan>
  })}{lowered && <tspan dy={-drop}>{'​'}</tspan>}</text>
}

// ---------- One particle, movement marks ----------
function P({ x, y, r = 9, fill = neutronFill, line = neutronLine }: { x: number; y: number; r?: number; fill?: string; line?: string }) {
  return <circle cx={r1(x)} cy={r1(y)} r={r} fill={fill} stroke={line} strokeWidth="1.5" />
}
/** Small arcs beside a particle on one side: it vibrates on the spot. `big` = more vibration (two arcs). */
function Wiggle({ x, y, side, big = false, colour = ink }: { x: number; y: number; side: -1 | 1; big?: boolean; colour?: string }) {
  const d = 13 * side, h = big ? 7 : 5
  return <g fill="none" stroke={colour} strokeWidth={big ? 2 : 1.6}>
    <path d={`M${x + d} ${y - h}Q${x + d + 4 * side} ${y} ${x + d} ${y + h}`} />
    {big && <path d={`M${x + d + 6 * side} ${y - h + 1}Q${x + d + 10 * side} ${y} ${x + d + 6 * side} ${y + h - 1}`} />}
  </g>
}
/** A straight movement arrow starting just outside a particle. */
function Move({ x, y, deg, len = 22, colour = ink, width = 2 }: { x: number; y: number; deg: number; len?: number; colour?: string; width?: number }) {
  const a = deg * Math.PI / 180, s = 12
  return <Arrow x1={r1(x + Math.cos(a) * s)} y1={r1(y + Math.sin(a) * s)} x2={r1(x + Math.cos(a) * (s + len))} y2={r1(y + Math.sin(a) * (s + len))} colour={colour} width={width} />
}
/** A short curved arrow over a liquid particle: it slides past its neighbours. */
function Slide({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const s = flip ? -1 : 1, x2 = x + 20 * s, y2 = y - 12
  const a = Math.atan2(y2 - (y - 22), x2 - (x + 12 * s)), head = 8
  return <g><path d={`M${x - 6 * s} ${y - 13}Q${x + 12 * s} ${y - 22} ${r1(x2 - 3 * Math.cos(a))} ${r1(y2 - 3 * Math.sin(a))}`} fill="none" stroke={ink} strokeWidth="1.8" />
    <polygon points={[[x2, y2], [x2 - head * Math.cos(a - .5), y2 - head * Math.sin(a - .5)], [x2 - head * Math.cos(a + .5), y2 - head * Math.sin(a + .5)]].map(p => p.map(r1).join(',')).join(' ')} fill={ink} /></g>
}

// ---------- One box of particles (local size 150 × 130) ----------
const BOX_W = 150, BOX_H = 130
const SOLID = Array.from({ length: 20 }, (_, i) => [39 + (i % 5) * 18, 64 + Math.floor(i / 5) * 18] as const)
// For the forces picture only: the same block pulled slightly apart so the links between particles show.
const SPACED = Array.from({ length: 20 }, (_, i) => [23 + (i % 5) * 26, 40 + Math.floor(i / 5) * 26] as const)
// Liquid: touching particles, no pattern, gaps here and there, filling the bottom of the box.
const LIQUID: Array<readonly [number, number]> = [
  [14, 118], [32, 117], [51, 118], [70, 116], [88, 118], [107, 117], [126, 118], [140, 110],
  [22, 102], [41, 100], [60, 99], [96, 100], [115, 101], [133, 94],
  [13, 86], [31, 84], [50, 82], [78, 97], [86, 83], [105, 84], [124, 79],
  [40, 66], [68, 80], [96, 67], [22, 69],
]
// Gas: a few particles far apart, each moving in a straight line in a random direction.
const GAS: Array<readonly [number, number, number]> = [[30, 34, 90], [104, 24, 0], [70, 72, 225], [122, 80, 60], [30, 102, -45], [96, 112, 180]]

function Box({ phase, x, y, scale = 1, mode = 'on', heat = 'normal', links }: { phase: Phase; x: number; y: number; scale?: number; mode?: Mode; heat?: 'normal' | 'hotter'; links?: 'weak' | 'strong' }) {
  const active = mode === 'active', hotter = heat === 'hotter'
  return <g opacity={mode === 'off' ? faded : 1} transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={0} y={0} width={BOX_W} height={BOX_H} rx="10" fill={active ? glow : panelFill} stroke={active ? hot : panelLine} strokeWidth={active ? 3 : 2} />
    {phase === 'solid' && <g>
      {links && SPACED.map(([px, py], i) => <g key={`l${i}`} stroke={links === 'strong' ? hot : muted} strokeWidth={links === 'strong' ? 4 : 1.6} strokeDasharray={links === 'strong' ? undefined : '3 4'}>
        {i % 5 < 4 && <line x1={px} y1={py} x2={px + 26} y2={py} />}
        {i < 15 && <line x1={px} y1={py} x2={px} y2={py + 26} />}
      </g>)}
      {(links ? SPACED : SOLID).map(([px, py], i) => <P key={i} x={px} y={py} />)}
      {!links && (hotter ? [0, 5, 10, 15, 4, 9, 14, 19].map(i => <Wiggle key={i} x={SOLID[i][0]} y={SOLID[i][1]} side={i % 5 ? 1 : -1} big colour={hot} />) : [0, 10, 9, 19].map(i => <Wiggle key={i} x={SOLID[i][0]} y={SOLID[i][1]} side={i % 5 ? 1 : -1} />))}
    </g>}
    {phase === 'liquid' && <g>
      {LIQUID.map(([px, py], i) => <P key={i} x={px} y={py} />)}
      <Slide x={40} y={66} /><Slide x={96} y={67} flip />
    </g>}
    {phase === 'gas' && <g>
      {GAS.map(([px, py, deg], i) => <g key={i}><P x={px} y={py} /><Move x={px} y={py} deg={deg} len={hotter ? 24 : 12} colour={hotter ? hot : ink} width={hotter ? 2.5 : 2} /></g>)}
    </g>}
  </g>
}

// ---------- Section 1: the particle model and the three states ----------
function Model() {
  const cols = [90, 270, 450], ballY = 236
  return <Diagram viewBox="0 0 540 320" title="Three kinds of particle: an argon atom, a sodium ion with a positive charge, and a water molecule made of one oxygen atom and two hydrogen atoms. Arrows show that in the particle model each one is drawn the same way, as one small solid ball.">
    <text x={270} y={28} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>A particle can be…</text>
    {/* argon atom */}
    <circle cx={cols[0]} cy={82} r={24} fill={greyFill} stroke={greyLine} strokeWidth="1.8" />
    <text x={cols[0]} y={88} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Ar</text>
    {/* sodium ion (positive ion: coral tint) */}
    <circle cx={cols[1]} cy={82} r={24} fill={glow} stroke={protonLine} strokeWidth="1.8" />
    <text x={cols[1] - 3} y={88} textAnchor="middle" fontSize="16" fontWeight="700" fill={protonLine}>Na</text>
    <text x={cols[1] + 17} y={74} textAnchor="middle" fontSize="15" fontWeight="700" fill={protonLine}>+</text>
    {/* water molecule */}
    <line x1={cols[2]} y1={80} x2={cols[2] - 24} y2={98} stroke={greyLine} strokeWidth="3" />
    <line x1={cols[2]} y1={80} x2={cols[2] + 24} y2={98} stroke={greyLine} strokeWidth="3" />
    <circle cx={cols[2] - 26} cy={100} r={12} fill="white" stroke={greyLine} strokeWidth="1.8" />
    <circle cx={cols[2] + 26} cy={100} r={12} fill="white" stroke={greyLine} strokeWidth="1.8" />
    <circle cx={cols[2]} cy={76} r={18} fill={greyFill} stroke={greyLine} strokeWidth="1.8" />
    <text x={cols[2]} y={81} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>O</text>
    <text x={cols[2] - 26} y={105} textAnchor="middle" fontSize="12" fontWeight="700" fill={ink}>H</text>
    <text x={cols[2] + 26} y={105} textAnchor="middle" fontSize="12" fontWeight="700" fill={ink}>H</text>
    {[['an atom', 'argon'], ['an ion', 'sodium ion'], ['a molecule', 'water']].map(([a, b], i) => <g key={a}>
      <text x={cols[i]} y={140} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{a}</text>
      <text x={cols[i]} y={158} textAnchor="middle" fontSize="13" fill={muted}>{b}</text>
      <Arrow x1={cols[i]} y1={170} x2={cols[i]} y2={ballY - 20} colour={muted} width={2} />
      <P x={cols[i]} y={ballY} r={13} />
    </g>)}
    <text x={270} y={286} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>In the particle model, each is drawn as one small, solid ball.</text>
  </Diagram>
}

const PHASE_LINES: Record<Phase, string[]> = {
  solid: ['strong forces', 'fixed positions', 'vibrate on the spot', 'keeps its shape'],
  liquid: ['weak forces', 'close, random order', 'move past each other', 'fixed volume only'],
  gas: ['very weak forces', 'far apart', 'random, straight lines', 'fills any container'],
}
const THREE_TITLES: Record<string, string> = {
  solid: 'Three boxes of particles. The solid is highlighted: its particles touch in a regular pattern, held in fixed positions by strong forces, and vibrate on the spot. The block keeps its own shape and volume.',
  liquid: 'Three boxes of particles. The liquid is highlighted: its particles touch but are in a random order, held by weak forces, and move past each other. The liquid has a fixed volume and fills the bottom of its box.',
  gas: 'Three boxes of particles. The gas is highlighted: a few particles far apart, with very weak forces between them, each moving in a straight line in a random direction. The gas fills the whole box.',
  all: 'The three states side by side. Solid: strong forces, fixed positions in a pattern, vibrate, fixed shape and volume. Liquid: weak forces, close in a random order, move past each other, fixed volume but not shape. Gas: very weak forces, far apart, move randomly in straight lines, no fixed shape or volume.',
}
function Three({ show }: { show: Phase | 'all' }) {
  const phases: Phase[] = ['solid', 'liquid', 'gas'], xs = [20, 195, 370]
  return <Diagram viewBox="0 0 540 300" title={THREE_TITLES[show]}>
    {phases.map((p, i) => {
      const mode: Mode = show === 'all' ? 'on' : show === p ? 'active' : 'off', cx = xs[i] + BOX_W / 2
      return <g key={p} opacity={mode === 'off' ? faded : 1}>
        <text x={cx} y={30} textAnchor="middle" fontSize="16" fontWeight="700" fill={mode === 'active' ? hot : ink}>{p}</text>
        <Box phase={p} x={xs[i]} y={44} mode={mode === 'off' ? 'on' : mode} />
        {PHASE_LINES[p].map((l, j) => <text key={j} x={cx} y={202 + j * 21} textAnchor="middle" fontSize="13" fontWeight={j === 0 ? 700 : 400} fill={ink}>{l}</text>)}
      </g>
    })}
  </Diagram>
}

function Hotter() {
  const cols = [{ x: 20, heat: 'normal' as const, head: 'cooler', colour: cold }, { x: 290, heat: 'hotter' as const, head: 'hotter', colour: hot }]
  return <Diagram viewBox="0 0 540 300" title="The same solid and the same gas, cooler on the left and hotter on the right. In the hotter solid the particles vibrate more. In the hotter gas the particles move faster, shown by longer arrows.">
    <path d="M270 20V206" stroke={panelLine} strokeWidth="2" strokeDasharray="6 5" />
    {cols.map(c => <g key={c.head}>
      <text x={c.x + 115} y={28} textAnchor="middle" fontSize="16" fontWeight="700" fill={c.colour}>{c.head}</text>
      <text x={c.x + 55} y={58} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>solid</text>
      <text x={c.x + 175} y={58} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>gas</text>
      <Box phase="solid" x={c.x} y={68} scale={.74} heat={c.heat} />
      <Box phase="gas" x={c.x + 120} y={68} scale={.74} heat={c.heat} />
      <text x={c.x + 55} y={192} textAnchor="middle" fontSize="13" fill={ink}>{c.heat === 'hotter' ? 'vibrate more' : 'vibrate a little'}</text>
      <text x={c.x + 175} y={192} textAnchor="middle" fontSize="13" fill={ink}>{c.heat === 'hotter' ? 'move faster' : 'move slower'}</text>
    </g>)}
    <text x={270} y={240} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>Hotter particles have more energy.</text>
    <text x={270} y={262} textAnchor="middle" fontSize="13" fill={muted}>Liquid particles move faster too.</text>
  </Diagram>
}

// ---------- Section 2: changing state ----------
type Change = 'physical' | 'melt' | 'boil' | 'condense' | 'freeze' | 'all'
const CHANGE_NOTES: Record<Change, Array<[string, string]>> = {
  physical: [['The same particles in every state.', ink], ['Only their arrangement and energy change.', muted]],
  melt: [['Heating: particles gain energy and vibrate more.', hot], ['At the melting point they break free: solid → liquid.', ink]],
  boil: [['Heating: particles gain more energy; forces weaken.', hot], ['At the boiling point they overcome the forces: liquid → gas.', ink]],
  condense: [['Cooling: particles lose energy; forces get stronger.', cold], ['At the boiling point the gas turns back to liquid.', ink]],
  freeze: [['Cooling: particles lose more energy and move less.', cold], ['At the melting point they are held in place: liquid → solid.', ink]],
  all: [['melting point: solid ⇄ liquid (melting, freezing)', ink], ['boiling point: liquid ⇄ gas (boiling, condensing)', ink]],
}
const CHANGE_TITLES: Record<Change, string> = {
  physical: 'A solid, a liquid and a gas made of the same particles, joined by four arrows: melting and boiling going right, freezing and condensing going left. Changes of state are physical changes: the particles stay the same.',
  melt: 'Melting is highlighted: heating the solid gives its particles energy; at the melting point they break free from their fixed positions and the solid becomes a liquid.',
  boil: 'Boiling is highlighted: heating the liquid gives its particles more energy; at the boiling point they overcome the forces holding them together and the liquid becomes a gas.',
  condense: 'Condensing is highlighted: cooling the gas takes energy from its particles and the forces between them get stronger; at the boiling point the gas becomes a liquid.',
  freeze: 'Freezing is highlighted: cooling the liquid takes more energy from its particles; at the melting point they are held in place and the liquid becomes a solid.',
  all: 'All four changes of state. Melting and freezing happen at the melting point, between solid and liquid. Boiling and condensing happen at the boiling point, between liquid and gas.',
}
function Changes({ step }: { step: Change }) {
  const s = .72, bw = BOX_W * s, xs = [12, 216, 420], y = 66
  const arrows: Array<{ key: Change; x1: number; x2: number; y: number; label: string; colour: string; below: boolean }> = [
    { key: 'melt', x1: xs[0] + bw + 6, x2: xs[1] - 6, y: 92, label: 'melting', colour: hot, below: false },
    { key: 'boil', x1: xs[1] + bw + 6, x2: xs[2] - 6, y: 92, label: 'boiling', colour: hot, below: false },
    { key: 'freeze', x1: xs[1] - 6, x2: xs[0] + bw + 6, y: 140, label: 'freezing', colour: cold, below: true },
    { key: 'condense', x1: xs[2] - 6, x2: xs[1] + bw + 6, y: 140, label: 'condensing', colour: cold, below: true },
  ]
  const on = (k: Change) => step === 'all' || step === 'physical' || step === k
  const boxOn = (p: Phase) => step === 'all' || step === 'physical' || (p === 'solid' && (step === 'melt' || step === 'freeze')) || (p === 'liquid') || (p === 'gas' && (step === 'boil' || step === 'condense'))
  return <Diagram viewBox="0 0 540 300" title={CHANGE_TITLES[step]}>
    <text x={270} y={22} textAnchor="middle" fontSize="13" fontWeight="700" fill={hot}>heating → particles gain energy</text>
    {(['solid', 'liquid', 'gas'] as Phase[]).map((p, i) => <g key={p} opacity={boxOn(p) ? 1 : faded}>
      <text x={xs[i] + bw / 2} y={56} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{p}</text>
      <Box phase={p} x={xs[i]} y={y} scale={s} />
    </g>)}
    {arrows.map(a => <g key={a.key} opacity={on(a.key) ? 1 : faded}>
      <Arrow x1={a.x1} y1={a.y} x2={a.x2} y2={a.y} colour={a.colour} width={step === a.key ? 4 : 3} />
      <text x={(a.x1 + a.x2) / 2} y={a.below ? a.y + 22 : a.y - 12} textAnchor="middle" fontSize="13" fontWeight="700" fill={a.colour}>{a.label}</text>
    </g>)}
    <text x={270} y={186} textAnchor="middle" fontSize="13" fontWeight="700" fill={cold}>← cooling: particles lose energy</text>
    <rect x={20} y={204} width={500} height={76} rx="10" fill={step === 'physical' || step === 'all' ? panelFill : step === 'melt' || step === 'boil' ? glow : blueFill} stroke={step === 'physical' || step === 'all' ? panelLine : (step === 'melt' || step === 'boil' ? protonFill : electronFill)} strokeWidth="1.8" />
    {CHANGE_NOTES[step].map(([t, c], i) => <text key={i} x={270} y={236 + i * 24} textAnchor="middle" fontSize="14" fontWeight={i === 0 ? 700 : 600} fill={c}>{t}</text>)}
  </Diagram>
}

// ---------- Section 3: forces, melting and boiling points, predicting state ----------
function Forces() {
  return <Diagram viewBox="0 0 540 300" title="Two solids. On the left, weak forces between the particles, drawn as thin dashed links: only a little energy is needed to separate them, so the melting point is low. On the right, strong forces, drawn as thick links: a lot of energy is needed, so the melting point is high.">
    {[{ x: 40, links: 'weak' as const, head: 'weaker forces', bar: 60, a: 'a little energy needed', b: 'lower melting and boiling points' },
      { x: 300, links: 'strong' as const, head: 'stronger forces', bar: 190, a: 'more energy needed', b: 'higher melting and boiling points' }].map(c => <g key={c.head}>
      <text x={c.x + 100} y={28} textAnchor="middle" fontSize="15" fontWeight="700" fill={c.links === 'strong' ? hot : ink}>{c.head}</text>
      <Box phase="solid" x={c.x + 25} y={40} links={c.links} />
      <rect x={c.x} y={190} width={200} height={16} rx="8" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
      <rect x={c.x} y={190} width={c.bar} height={16} rx="8" fill={protonFill} stroke={protonLine} strokeWidth="1.5" />
      <text x={c.x + 100} y={230} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{c.a}</text>
      <text x={c.x + 100} y={252} textAnchor="middle" fontSize="13" fill={ink}>{c.b}</text>
    </g>)}
    <text x={270} y={288} textAnchor="middle" fontSize="13" fill={muted}>Bar: energy needed to melt the solid</text>
  </Diagram>
}

/** A horizontal temperature strip: solid below the melting point, liquid between, gas above the boiling point. */
type Zone = Phase | 'none'
function TempStrip({ x, y, w, min, max, mp, bp, show = 'all', label, marker, zoneLabels = true, h = 34, names = false }: { x: number; y: number; w: number; min: number; max: number; mp: number; bp: number; show?: Zone | 'all'; label?: string; marker?: number; zoneLabels?: boolean; h?: number; names?: boolean }) {
  const X = (t: number) => r1(x + (t - min) / (max - min) * w)
  const zones: Array<{ p: Phase; a: number; b: number; fill: string; line: string; text: string }> = [
    { p: 'solid', a: min, b: mp, fill: greyFill, line: greyLine, text: ink },
    { p: 'liquid', a: mp, b: bp, fill: blueFill, line: blueLine, text: blueLine },
    { p: 'gas', a: bp, b: max, fill: amberFill, line: amberLine, text: amberInk },
  ]
  return <g>
    {label && <text x={x} y={y - 10} fontSize="14" fontWeight="700" fill={ink}>{label}</text>}
    {zones.map(z => {
      const lit = show === 'all' || show === z.p, blank = show === 'none'
      const zw = X(z.b) - X(z.a)
      return <g key={z.p} opacity={lit || blank ? 1 : faded}>
        <rect x={X(z.a)} y={y} width={zw} height={h} fill={blank ? 'white' : z.fill} stroke={blank ? muted : z.line} strokeWidth={show === z.p ? 3 : 1.6} />
        {zoneLabels && !blank && zw > 46 && <text x={(X(z.a) + X(z.b)) / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={z.text}>{z.p}</text>}
      </g>
    })}
    {[mp, bp].map((t, i) => <g key={i}>
      <path d={`M${X(t)} ${y - 4}V${y + h + 6}`} stroke={ink} strokeWidth="2.5" />
      <text x={X(t)} y={y + h + 22} textAnchor={i === 0 && X(bp) - X(mp) < 70 ? 'end' : i === 1 && X(bp) - X(mp) < 70 ? 'start' : 'middle'} fontSize="13" fontWeight="700" fill={ink}>{deg(t)}</text>
      {names && <text x={X(t)} y={y + h + 40} textAnchor="middle" fontSize="13" fill={muted}>{i === 0 ? 'melting point' : 'boiling point'}</text>}
    </g>)}
    {marker !== undefined && <g>
      <path d={`M${X(marker)} ${y - 18}V${y + h + 2}`} stroke={hot} strokeWidth="2.5" strokeDasharray="5 4" />
      <text x={X(marker)} y={y - 22} textAnchor="middle" fontSize="13" fontWeight="700" fill={hot}>{deg(marker)}</text>
    </g>}
  </g>
}

function Compare() {
  const x = 150, w = 360, min = -250, max = 150
  const X = (t: number) => x + (t - min) / (max - min) * w
  return <Diagram viewBox="0 0 540 300" schematic={false} title="Two temperature strips on the same scale from minus 250 to 150 degrees Celsius. Oxygen melts at minus 219 and boils at minus 183 degrees Celsius. Water melts at 0 and boils at 100 degrees Celsius. The forces between water particles are stronger, so both its melting and boiling points are higher.">
    <text x={20} y={78} fontSize="15" fontWeight="700" fill={ink}>oxygen</text>
    <text x={20} y={96} fontSize="13" fill={muted}>weaker forces</text>
    <TempStrip x={x} y={60} w={w} min={min} max={max} mp={-219} bp={-183} />
    <text x={20} y={178} fontSize="15" fontWeight="700" fill={ink}>water</text>
    <text x={20} y={196} fontSize="13" fill={hot}>stronger forces</text>
    <TempStrip x={x} y={160} w={w} min={min} max={max} mp={0} bp={100} />
    <path d={`M${x} 250H${x + w}`} stroke={ink} strokeWidth="1.5" />
    {[-200, -100, 0, 100].map(t => <g key={t}><path d={`M${X(t)} 250v6`} stroke={ink} strokeWidth="1.5" /><text x={X(t)} y={272} textAnchor="middle" fontSize="12" fill={ink}>{t < 0 ? `−${-t}` : t}</text></g>)}
    <text x={x + w} y={292} textAnchor="end" fontSize="13" fontWeight="700" fill={ink}>temperature (°C)</text>
  </Diagram>
}

const PREDICT_TITLES: Record<Phase | 'all', string> = {
  solid: 'A temperature strip for water from minus 50 to 150 degrees Celsius. The part below the melting point, 0 degrees Celsius, is highlighted: below its melting point, water is a solid (ice).',
  gas: 'The same strip for water. The part above the boiling point, 100 degrees Celsius, is highlighted: above its boiling point, water is a gas (steam).',
  liquid: 'The same strip for water. The part between 0 and 100 degrees Celsius is highlighted: between its melting and boiling points, water is a liquid. A marker at 25 degrees Celsius, room temperature, falls in this part.',
  all: 'The whole strip for water: solid below 0 degrees Celsius, liquid from 0 to 100, gas above 100.',
}
function Predict({ show }: { show: Phase }) {
  const note: Record<Phase, [string, string]> = {
    solid: ['below the melting point → solid', 'water below 0 °C is ice'],
    gas: ['above the boiling point → gas', 'water above 100 °C is steam'],
    liquid: ['between the two → liquid', 'at 25 °C (room temperature) water is a liquid'],
  }
  return <Diagram viewBox="0 0 540 250" schematic={false} title={PREDICT_TITLES[show]}>
    <TempStrip x={40} y={80} w={460} min={-50} max={150} mp={0} bp={100} show={show} label="water" marker={show === 'liquid' ? 25 : undefined} names />
    <text x={270} y={196} textAnchor="middle" fontSize="15" fontWeight="700" fill={show === 'solid' ? ink : show === 'liquid' ? blueLine : amberInk}>{note[show][0]}</text>
    <text x={270} y={220} textAnchor="middle" fontSize="13" fill={ink}>{note[show][1]}</text>
  </Diagram>
}

/** A small data table: substance, melting point, boiling point, optional last column. */
function DataTable({ title, rows, extra, desc, viewH = 200 }: { title: string; rows: Array<[string, string, string, string?]>; extra?: string; desc: string; viewH?: number }) {
  const cols = extra ? [36, 210, 330, 450] : [36, 250, 410]
  return <Diagram viewBox={`0 0 540 ${viewH}`} schematic={false} title={desc}>
    <text x={30} y={24} fontSize="14" fontWeight="700" fill={ink}>{title}</text>
    <rect x={20} y={38} width={500} height={52 + rows.length * 34} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}>
      <text x={cols[0]} y={66}>substance</text>
      <text x={cols[1]} y={66} textAnchor="middle">melting point</text>
      <text x={cols[2]} y={66} textAnchor="middle">boiling point</text>
      {extra && <text x={cols[3]} y={66} textAnchor="middle" fill={hot}>{extra}</text>}
    </g>
    <path d="M32 78H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([s, m, b, e], i) => <g key={s} fontSize="14" fill={ink}>
      <text x={cols[0]} y={106 + i * 34}>{s}</text><text x={cols[1]} y={106 + i * 34} textAnchor="middle">{m}</text><text x={cols[2]} y={106 + i * 34} textAnchor="middle">{b}</text>
      {e && <text x={cols[3]} y={106 + i * 34} textAnchor="middle" fontWeight="700" fill={hot}>{e}</text>}
    </g>)}
  </Diagram>
}

// ---------- Section 4: state symbols ----------
function MiniIcon({ kind, x, y }: { kind: Phase | 'aq'; x: number; y: number }) {
  if (kind === 'aq') return <g>
    <path d={`M${x} ${y}V${y + 52}q0 6 6 6H${x + 58}q6 0 6 -6V${y}`} fill="none" stroke={greyLine} strokeWidth="2" />
    <path d={`M${x + 2} ${y + 18}H${x + 62}V${y + 52}q0 4 -4 4H${x + 6}q-4 0 -4 -4Z`} fill={blueFill} stroke="none" />
    <path d={`M${x + 2} ${y + 18}H${x + 62}`} stroke={blueLine} strokeWidth="1.5" />
    {[[14, 30], [34, 40], [50, 28], [22, 48], [46, 50]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r="4.5" fill={amberLine} stroke={amberInk} strokeWidth="1" />)}
  </g>
  return <Box phase={kind} x={x} y={y} scale={.43} />
}
const SYMBOLS: Array<{ k: Phase | 'aq'; sym: string; word: string }> = [
  { k: 'solid', sym: '(s)', word: 'solid' }, { k: 'liquid', sym: '(l)', word: 'liquid' }, { k: 'gas', sym: '(g)', word: 'gas' }, { k: 'aq', sym: '(aq)', word: 'aqueous' },
]
function Symbols({ aq }: { aq: boolean }) {
  return <Diagram viewBox="0 0 540 280" title={aq
    ? 'Four state symbols: (s) solid, (l) liquid, (g) gas and (aq) aqueous. Aqueous is highlighted: a beaker of water with small particles of a substance spread through it, because aqueous means dissolved in water.'
    : 'Four state symbols, each with a small box of particles: (s) solid, (l) liquid and (g) gas are highlighted; (aq) aqueous is still to come.'}>
    {SYMBOLS.map((s, i) => {
      const x = 12 + i * 131, active = aq ? s.k === 'aq' : s.k !== 'aq', dim = aq ? s.k !== 'aq' : s.k === 'aq'
      return <g key={s.k} opacity={dim ? (aq ? .55 : faded) : 1}>
        <rect x={x} y={20} width={122} height={180} rx="12" fill={active ? glow : panelFill} stroke={active ? hot : panelLine} strokeWidth={active ? 2.5 : 1.8} />
        <text x={x + 61} y={62} textAnchor="middle" fontSize="26" fontWeight="700" fill={hot}>{s.sym}</text>
        <MiniIcon kind={s.k} x={x + 29} y={84} />
        <text x={x + 61} y={176} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{s.word}</text>
      </g>
    })}
    {aq ? <g>
      <text x={270} y={232} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>aqueous = dissolved in water</text>
      <text x={270} y={256} textAnchor="middle" fontSize="13" fill={muted}>salt water: salt (sodium chloride) dissolved in water</text>
    </g> : <text x={270} y={236} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>Each symbol goes straight after a formula.</text>}
  </Diagram>
}

function Equation() {
  const labels: Array<[number, string, string]> = [[88, 'solid', 'magnesium'], [212, 'aqueous', 'hydrochloric acid'], [380, 'aqueous', 'magnesium chloride'], [493, 'gas', 'hydrogen']]
  return <Diagram viewBox="0 0 540 250" schematic={false} title="The equation Mg(s) + 2HCl(aq) → MgCl2(aq) + H2(g), with each state symbol explained: magnesium is a solid, hydrochloric acid is aqueous (dissolved in water), magnesium chloride is aqueous and hydrogen is a gas.">
    <text x={270} y={30} textAnchor="middle" fontSize="14" fontWeight="700" fill={muted}>magnesium reacting with hydrochloric acid</text>
    <rect x={14} y={48} width={512} height={62} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <Formula x={48} y={88} text="Mg(s)" size={22} anchor="start" />
    <text x={122} y={88} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>+</text>
    <Formula x={140} y={88} text="2HCl(aq)" size={22} anchor="start" />
    <text x={262} y={88} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>→</text>
    <Formula x={286} y={88} text="MgCl2(aq)" size={22} anchor="start" />
    <text x={422} y={88} textAnchor="middle" fontSize="22" fontWeight="700" fill={ink}>+</text>
    <Formula x={440} y={88} text="H2(g)" size={22} anchor="start" />
    {labels.map(([x, st, name]) => <g key={name}>
      <path d={`M${x} 104V142`} stroke={hot} strokeWidth="1.6" /><circle cx={x} cy={104} r="2.8" fill={hot} />
      <text x={x} y={162} textAnchor="middle" fontSize="14" fontWeight="700" fill={hot}>{st}</text>
      {name.split(' ').map((w, j) => <text key={j} x={x} y={184 + j * 18} textAnchor="middle" fontSize="13" fill={ink}>{w}</text>)}
    </g>)}
  </Diagram>
}

function Water() {
  const cols: Array<{ p: Phase; f: string; name: string }> = [{ p: 'solid', f: 'H2O(s)', name: 'ice' }, { p: 'liquid', f: 'H2O(l)', name: 'water' }, { p: 'gas', f: 'H2O(g)', name: 'steam' }]
  return <Diagram viewBox="0 0 540 280" title="Water in three states: ice is H2O(s), liquid water is H2O(l) and steam is H2O(g). The formula stays the same because the particles are the same; only the state symbol changes.">
    {cols.map((c, i) => {
      const x = 30 + i * 175
      return <g key={c.p}>
        <text x={x + 60} y={28} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{c.name}</text>
        <Box phase={c.p} x={x} y={40} scale={.8} />
        <Formula x={x + 60} y={178} text={c.f} size={22} />
      </g>
    })}
    <text x={270} y={226} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>Same formula, same particles.</text>
    <text x={270} y={250} textAnchor="middle" fontSize="14" fontWeight="700" fill={hot}>Only the state symbol changes.</text>
  </Diagram>
}

// ---------- On your own ----------
function BoxesQuestion({ assessment }: { assessment: boolean }) {
  const order: Phase[] = ['solid', 'gas', 'liquid'], xs = [20, 195, 370]
  return <Diagram viewBox="0 0 540 222" title={assessment ? 'Three closed boxes of particles numbered 1, 2 and 3. Box 1: particles touching in a regular block. Box 2: a few particles far apart, each with a straight arrow. Box 3: particles touching in a random order, filling the bottom of the box.' : 'Box 1 is a solid, box 2 is a gas and box 3 is a liquid. The liquid has a fixed volume but takes the shape of the bottom of its box.'}>
    {order.map((p, i) => <g key={p}>
      <Num n={i + 1} x={xs[i] + BOX_W / 2} y={22} />
      <Box phase={p} x={xs[i]} y={46} mode={!assessment && p === 'liquid' ? 'active' : 'on'} />
      {!assessment && <text x={xs[i] + BOX_W / 2} y={206} textAnchor="middle" fontSize="15" fontWeight="700" fill={p === 'liquid' ? hot : ink}>{p}</text>}
    </g>)}
  </Diagram>
}
function PhosphorusQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram viewBox="0 0 540 220" schematic={false} title={assessment
    ? 'A temperature strip from 0 to 350 degrees Celsius for white phosphorus. The melting point, 44 degrees Celsius, and the boiling point, 280 degrees Celsius, are marked. A dashed marker shows 100 degrees Celsius. The states are not labelled.'
    : 'A temperature strip for white phosphorus: solid below 44 degrees Celsius, liquid from 44 to 280, gas above 280. The marker at 100 degrees Celsius is in the liquid part.'}>
    <text x={40} y={30} fontSize="14" fontWeight="700" fill={ink}>white phosphorus</text>
    <TempStrip x={40} y={80} w={460} min={0} max={350} mp={44} bp={280} show={assessment ? 'none' : 'all'} marker={100} names />
    {!assessment && <text x={270} y={200} textAnchor="middle" fontSize="14" fontWeight="700" fill={blueLine}>100 °C is between 44 °C and 280 °C → liquid</text>}
  </Diagram>
}

export function StateVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'state-model': return <Model />
    case 'state-solid': return <Three show="solid" />
    case 'state-liquid': return <Three show="liquid" />
    case 'state-gas': return <Three show="gas" />
    case 'state-hotter': return <Hotter />
    case 'state-all': return <Three show="all" />
    case 'state-change-physical': return <Changes step="physical" />
    case 'state-change-melt': return <Changes step="melt" />
    case 'state-change-boil': return <Changes step="boil" />
    case 'state-change-condense': return <Changes step="condense" />
    case 'state-change-freeze': return <Changes step="freeze" />
    case 'state-change-all': return <Changes step="all" />
    case 'state-mp-forces': return <Forces />
    case 'state-mp-compare': return <Compare />
    case 'state-predict-solid': return <Predict show="solid" />
    case 'state-predict-gas': return <Predict show="gas" />
    case 'state-predict-liquid': return <Predict show="liquid" />
    case 'state-predict-example': return <DataTable title="Which state at room temperature (25 °C)?" extra="at 25 °C" rows={[['chlorine', '−101 °C', '−34 °C', 'gas'], ['mercury', '−39 °C', '357 °C', 'liquid'], ['sulfur', '115 °C', '445 °C', 'solid']]}
      desc="A table. Chlorine: melts at minus 101, boils at minus 34 degrees Celsius, so it is a gas at 25 degrees Celsius. Mercury: melts at minus 39, boils at 357, so it is a liquid at 25. Sulfur: melts at 115, boils at 445, so it is a solid at 25." />
    case 'state-predict-guided': return <DataTable title="Melting and boiling points" rows={[['ammonia', '−78 °C', '−33 °C'], ['iodine', '114 °C', '184 °C'], ['propanone', '−95 °C', '56 °C']]}
      desc="A table of melting and boiling points. Ammonia: melts at minus 78, boils at minus 33 degrees Celsius. Iodine: melts at 114, boils at 184. Propanone: melts at minus 95, boils at 56." />
    case 'state-symbol-list': return <Symbols aq={false} />
    case 'state-symbol-aq': return <Symbols aq />
    case 'state-symbol-equation': return <Equation />
    case 'state-symbol-water': return <Water />
    case 'state-question-boxes': return <BoxesQuestion assessment={assessment} />
    case 'state-question-phosphorus': return <PhosphorusQuestion assessment={assessment} />
    default: return <Three show="all" />
  }
}

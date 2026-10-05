'use client'

import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import type { Phase } from '../kit/DialGame'
import { PlayGame, type PlayGameConfig, type PlayStageProps } from '../kit/PlayGame'
import { isTiles, wrongSlots } from '../kit/tiles'
import { n } from '../kit/types'
import { FACTORS, makeRounds, type Scene } from './rounds'
import './Rewild.css'

const ROWAN: Speaker = {
  name: 'Ranger Rowan', emoji: '🧑🏼‍🌾',
  right: ['Spot on. The beavers would high-five you, if they had the thumbs.', 'Textbook ecology. I’m writing that in the survey log.', 'Bang on. That’s a field day well spent.', 'Lovely. The valley’s coming back to life.', 'Nailed it. Even the owls look impressed.'],
  wrong: ['Hmm. A beaver could gnaw a better answer than that.', 'Nope. The heron just shook its head at you.', 'That’s gone a bit swampy. Check it again.', 'Not quite. Back to the clipboard, ecologist.'],
}

const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value))

/** Emoji drawn at a point, centred. Animations go on an inner group, never the positioned one. */
function Icon({ x, y, size, children }: { x: number; y: number; size: number; children: string }) {
  return <g transform={`translate(${x} ${y})`}><g><text y={size * .35} textAnchor="middle" fontSize={size} className="rw-emoji">{children}</text></g></g>
}

/** A little flower: petals round a centre. */
function Flower({ x, y, r, kind }: { x: number; y: number; r: number; kind: 'orchid' | 'buttercup' | 'sweet' }) {
  return <g transform={`translate(${x} ${y})`}><g className={`rw-flower rw-flower--${kind}`}>
    {[0, 72, 144, 216, 288].map(a => <circle key={a} cx={Math.cos(a * Math.PI / 180) * r * .55} cy={Math.sin(a * Math.PI / 180) * r * .55} r={r * .5} className="rw-petal" />)}
    <circle r={r * .32} className="rw-centre" />
  </g></g>
}

/**
 * The valley behind every picture. It rewilds round by round (`level`): wildflowers, then the owl and
 * voles, then the beavers and their dam, then dragonflies, and an otter at the very end. A right answer
 * brings the next creature in early.
 */
function Valley({ level, phase }: { level: number; phase: Phase }) {
  const shown = level + (phase === 'hit' ? 1 : 0)
  const fresh = (at: number) => phase === 'hit' && at === level + 1 ? 'rw-arrive' : undefined
  return <g aria-hidden="true">
    <rect x="0" y="0" width="320" height="260" className="rw-sky" />
    <circle cx="296" cy="20" r="13" className="rw-sun" />
    <path d="M0 52 Q60 32 130 46 T250 42 T320 46 V260 H0 Z" className={`rw-hill${shown >= 1 ? ' is-wild' : ''}`} />
    <path d="M0 238 Q70 228 150 238 T320 234 V260 H0 Z" className="rw-river" />
    <path d="M14 246 Q40 242 66 246 M196 250 Q226 246 256 250" className="rw-ripple" />
    {shown >= 1 && <g className={fresh(1)}>
      {[18, 52, 92, 148, 196, 238, 282].map((x, i) => <Flower key={x} x={x} y={44 - Math.sin(x / 40) * 4} r={5} kind={i % 2 ? 'buttercup' : 'orchid'} />)}
      <Icon x={206} y={22} size={16}>🐝</Icon>
    </g>}
    {shown >= 2 && <g className={fresh(2)}><Icon x={24} y={26} size={22}>🦉</Icon><Icon x={34} y={232} size={16}>🐭</Icon></g>}
    {shown >= 3 && <g className={fresh(3)}>
      <path d="M248 244 L268 232 M252 236 L274 246 M258 230 L264 250" className="rw-sticks" />
      <Icon x={292} y={242} size={22}>🦫</Icon>
    </g>}
    {shown >= 4 && <g className={fresh(4)}><Icon x={118} y={20} size={16}>🦋</Icon><Icon x={170} y={20} size={14}>🐸</Icon></g>}
    {shown >= 5 && <g className={fresh(5)}><Icon x={150} y={246} size={20}>🦦</Icon><Icon x={210} y={244} size={16}>🦆</Icon></g>}
  </g>
}

/** A label in a pill, for the picture's live number. */
function Pill({ x, y, text, tone }: { x: number; y: number; text: string; tone: string }) {
  const w = Math.max(56, text.length * 8.6 + 20)
  return <g className={`rw-pill is-${tone}`}><rect x={x - w / 2} y={y - 15} width={w} height="24" rx="12" /><text x={x} y={y + 2} textAnchor="middle">{text}</text></g>
}

/** How a dial answer reads in the picture: '?' until touched, then the value; red with which way when wrong. */
function dialState(phase: Phase, value: number, start: number, answer: number) {
  const touched = !(phase === 'set' && value === start)
  const shown = phase === 'hit' ? answer : value
  const tone = phase === 'hit' ? 'hit' : phase === 'miss' ? 'miss' : 'set'
  const way = phase === 'miss' ? (value > answer ? 'too high' : 'too low') : ''
  return { touched, shown, tone, way }
}

/** Round 1: five quadrats as columns of orchids, and a mean line the dial moves. A right answer levels them off. */
function Mean({ scene, value, start, answer, phase }: { scene: Scene; value: number; start: number; answer: number; phase: Phase }) {
  const counts = scene.counts!, s = dialState(phase, value, start, answer)
  const unit = 8.4, floor = 206, y = (v: number) => clamp(floor - v * unit, 56, floor)
  return <g>
    {counts.map((c, i) => {
      const x = 48 + i * 56
      return <g key={i}>
        <rect x={x - 22} y={70} width="44" height={floor - 68} rx="6" className="rw-quadcol" />
        {phase === 'hit' && <rect x={x - 20} y={y(answer)} width="40" height={floor - y(answer)} rx="4" className="rw-level-bar" style={{ animationDelay: `${i * 70}ms` }} />}
        {Array.from({ length: c }, (_, k) => <Flower key={k} x={x + (k % 2 ? 7 : -7)} y={floor - 4 - k * unit} r={7} kind="orchid" />)}
        <text x={x} y={224} textAnchor="middle" className="rw-count">{c}</text>
      </g>
    })}
    {s.touched && <g className={`rw-meanline is-${s.tone}`}>
      <line x1="18" x2="302" y1={y(s.shown)} y2={y(s.shown)} />
    </g>}
    <Pill x={160} y={56} text={s.touched ? `mean ${n(s.shown)}${s.way ? ` · ${s.way}` : ''}` : 'mean ?'} tone={s.tone} />
  </g>
}

/** The whole meadow or field as a grid of square metres: flowers fill it as the estimate rises. */
function Meadow({ scene, value, start, answer, phase }: { scene: Scene; value: number; start: number; answer: number; phase: Phase }) {
  const f = scene.field!, s = dialState(phase, value, start, answer)
  const cols = 12, rows = 6, cell = 22, left = 160 - cols * cell / 2, top = 76, total = cols * rows
  const filled = s.touched ? clamp(Math.round(total * s.shown / answer), 0, total) : 0
  const over = s.touched && s.shown > answer
  return <g>
    <text x="160" y="66" textAnchor="middle" className="rw-head">{f.area} · {f.mean} per m²</text>
    <rect x={left - 4} y={top - 4} width={cols * cell + 8} height={rows * cell + 8} rx="8" className={`rw-plot${over ? ' is-over' : ''}`} />
    {Array.from({ length: total }, (_, i) => {
      const x = left + (i % cols) * cell, y = top + Math.floor(i / cols) * cell
      const on = i < filled
      return <g key={i}>
        <rect x={x + 1} y={y + 1} width={cell - 2} height={cell - 2} rx="3" className="rw-m2" />
        {on && <g className={phase === 'hit' ? 'rw-pop' : undefined} style={phase === 'hit' ? { animationDelay: `${(i % 24) * 22}ms` } : undefined}>
          <Flower x={x + cell / 2} y={y + cell / 2} r={7} kind={f.flower} />
        </g>}
      </g>
    })}
    <Pill x={160} y={top + rows * cell + 22} text={s.touched ? `${n(s.shown)}${s.way ? ` · ${s.way}` : ''}` : '? plants'} tone={s.tone} />
  </g>
}

/** The transect: a tape up from the river and a 25-square quadrat; a gauge fills with the % cover. */
function Transect({ scene, value, start, answer, phase }: { scene: Scene; value: number; start: number; answer: number; phase: Phase }) {
  const near = scene.near!, s = dialState(phase, value, start, answer)
  const left = 64, top = 64, cell = 31
  // Fill from the bottom row (nearest the river) up.
  const order = Array.from({ length: 25 }, (_, i) => 24 - i)
  const covered = new Set(order.slice(0, near))
  const gauge = s.touched ? clamp(s.shown, 0, 100) / 100 * 155 : 0
  return <g>
    <line x1="30" y1="232" x2="30" y2="58" className="rw-tape" />
    {[0, 1, 2, 3, 4].map(m => <line key={m} x1="24" x2="36" y1={222 - m * 38} y2={222 - m * 38} className="rw-tape" />)}
    <text x="38" y="226" className="rw-note">river</text>
    <rect x={left - 3} y={top - 3} width={cell * 5 + 6} height={cell * 5 + 6} rx="4" className="rw-frame" />
    {Array.from({ length: 25 }, (_, i) => {
      const x = left + (i % 5) * cell, y = top + Math.floor(i / 5) * cell, on = covered.has(i)
      const rank = order.indexOf(i)
      return <g key={i}>
        <rect x={x + 1} y={y + 1} width={cell - 2} height={cell - 2} rx="3" className={`rw-sq${on ? ' is-on' : ''}`} />
        {on && phase !== 'hit' && <><Flower x={x + 10} y={y + 11} r={7} kind="sweet" /><Flower x={x + 21} y={y + 20} r={7} kind="sweet" /></>}
        {on && phase === 'hit' && <g className="rw-pop" style={{ animationDelay: `${rank * 30}ms` }}><text x={x + cell / 2} y={y + cell / 2 + 5} textAnchor="middle" className="rw-sq__t">4%</text></g>}
      </g>
    })}
    <rect x="248" y="64" width="34" height="153" rx="8" className="rw-gauge" />
    <rect x="248" y={217 - gauge} width="34" height={gauge} rx="8" className={`rw-gauge__fill is-${s.tone}`} />
    {[0, 50, 100].map(p => <text key={p} x="290" y={221 - p * 1.55} className="rw-tick">{p}</text>)}
    <Pill x={265} y={50} text={s.touched ? `${n(s.shown)}%` : '?%'} tone={s.tone} />
    {s.way && <text x="265" y="238" textAnchor="middle" className="rw-way">{s.way}</text>}
  </g>
}

/** The meadowsweet and its two non-living factors: the tiles land in the bubbles. */
function Factors({ picked, phase }: { picked: string[]; phase: Phase }) {
  const spots = [[66, 112], [254, 112]]
  return <g>
    <text x="160" y="62" textAnchor="middle" className="rw-head">What isn’t alive here?</text>
    <g transform="translate(160 214)"><g className={phase === 'hit' ? 'rw-grow' : undefined}>
      <path d="M0 0 V-92 M0 -40 Q-22 -50 -30 -70 M0 -56 Q22 -66 28 -86" className="rw-stem" />
      {[[0, -98], [-12, -92], [12, -94], [-30, -76], [-24, -84], [28, -92], [34, -84], [-6, -106], [8, -106]].map(([x, y], i) => <Flower key={i} x={x} y={y} r={10} kind="sweet" />)}
      <path d="M-14 -20 Q-34 -30 -40 -14 Q-26 -10 -14 -20 M14 -28 Q34 -38 40 -22 Q26 -18 14 -28" className="rw-leaf" />
    </g></g>
    {spots.map(([x, y], i) => {
      const tile = picked[i]
      const f = tile ? FACTORS[tile] : undefined
      const bad = phase === 'miss' && f && !f.abiotic
      return <g key={i} className={`rw-bubble${f ? ' is-filled' : ''}${phase === 'set' && i === picked.length ? ' is-next' : ''}${bad ? ' is-wrong' : ''}${phase === 'hit' ? ' is-hit' : ''}`}>
        <circle cx={x} cy={y} r="42" />
        {f ? <>
          <g className="rw-land-in"><Icon x={x} y={y - 6} size={30}>{f.icon}</Icon></g>
          <text x={x} y={y + 30} textAnchor="middle" className="rw-bubble__t">{f.name}</text>
        </> : <text x={x} y={y + 6} textAnchor="middle" className="rw-bubble__q">?</text>}
        <text x={x} y={y + 60} textAnchor="middle" className="rw-note">non-living</text>
      </g>
    })}
  </g>
}

const ANIMAL: Record<string, [string, string]> = { grass: ['🌾', 'Grass'], vole: ['🐭', 'Vole'], owl: ['🦉', 'Barn owl'], sun: ['☀️', 'Sun'], mushroom: ['🍄', 'Mushroom'] }

/** The food chain: three rings joined by energy arrows; each tile lands as its creature. */
function Chain({ picked, phase, wrong }: { picked: string[]; phase: Phase; wrong: Set<number> }) {
  const shown = phase === 'hit' ? ['grass', 'vole', 'owl'] : picked
  const xs = [56, 160, 264], roles = [['producer', ''], ['primary', 'consumer'], ['secondary', 'consumer']]
  return <g>
    <text x="160" y="66" textAnchor="middle" className="rw-head">Who eats who? Arrows show energy.</text>
    {[0, 1].map(i => <g key={i} className={`rw-arrow${phase === 'hit' ? ' is-flow' : ''}`}>
      <path d={`M${xs[i] + 40} 132 H${xs[i + 1] - 42}`} /><path d={`M${xs[i + 1] - 49} 125 L${xs[i + 1] - 42} 132 L${xs[i + 1] - 49} 139`} />
    </g>)}
    {xs.map((x, i) => {
      const tile = shown[i]
      return <g key={i} className={`rw-ring${tile ? ' is-filled' : ''}${phase === 'set' && i === picked.length ? ' is-next' : ''}${wrong.has(i) ? ' is-wrong' : ''}${phase === 'hit' ? ' is-hit' : ''}`}>
        <circle cx={x} cy="132" r="38" />
        {tile ? <>
          <g className={phase === 'hit' ? 'rw-hop' : 'rw-land-in'} style={phase === 'hit' ? { animationDelay: `${i * 160}ms` } : undefined}><Icon x={x} y={124} size={32}>{ANIMAL[tile][0]}</Icon></g>
          <text x={x} y="158" textAnchor="middle" className="rw-ring__t">{ANIMAL[tile][1]}</text>
        </> : <text x={x} y="140" textAnchor="middle" className="rw-bubble__q">{i + 1}</text>}
        <text x={x} y="190" textAnchor="middle" className="rw-role">{roles[i][0]}</text>
        <text x={x} y="206" textAnchor="middle" className="rw-role">{roles[i][1]}</text>
      </g>
    })}
  </g>
}

/** Predator–prey: the cycles up top, then the owls sharing out the peak's voles as bars. */
function Graph({ scene, value, start, answer, phase }: { scene: Scene; value: number; start: number; answer: number; phase: Phase }) {
  const g = scene.graph!, s = dialState(phase, value, start, answer)
  const x0 = 34, w = 270, top = 56, h = 64
  const curve = (amp: number, mid: number, lag: number) => Array.from({ length: 49 }, (_, i) => `${i ? 'L' : 'M'}${x0 + i * w / 48} ${top + h / 2 - (mid + amp * Math.sin(i / 48 * Math.PI * 3 - lag)) * h / 2}`).join(' ')
  const per = s.touched ? s.shown : 0, barMax = 38, scale = barMax / (answer * 1.5)
  const spacing = Math.min(30, 256 / g.owls), first = 160 - (g.owls - 1) * spacing / 2
  const shared = g.owls * per
  return <g>
    <path d={`M${x0} ${top - 6} V${top + h} H${x0 + w}`} className="rw-axis" />
    <path d={curve(.85, 0, 0)} className="rw-curve rw-curve--vole" />
    <path d={curve(.45, -.35, 1)} className="rw-curve rw-curve--owl" />
    <Icon x={x0 + 50} y={top - 4} size={14}>🐭</Icon><Icon x={x0 + 90} y={top + 22} size={14}>🦉</Icon>
    <text x={x0 + w} y={top + h + 13} textAnchor="end" className="rw-tick">years →</text>
    <line x1="24" x2="296" y1="208" y2="208" className="rw-ground" />
    {Array.from({ length: g.owls }, (_, i) => {
      const x = first + i * spacing, bh = Math.min(per * scale, barMax * 1.1)
      return <g key={i}>
        {per > 0 && <rect x={x - spacing * .3} y={208 - bh} width={spacing * .6} height={bh} rx="3" className={`rw-share is-${s.tone}`} />}
        <Icon x={x} y={222} size={Math.min(18, spacing * .8)}>🦉</Icon>
      </g>
    })}
    <Pill x={160} y={154} text={s.touched ? `${g.owls} × ${n(per)} = ${n(shared)} of ${n(g.peak)} voles` : `${n(g.peak)} voles ÷ ${g.owls} owls`} tone={s.tone} />
  </g>
}

/** The valley map: 20 squares of wetland, 5% each. The dial drains them for farmland. */
function Wetland({ value, start, answer, phase }: { value: number; start: number; answer: number; phase: Phase }) {
  const s = dialState(phase, value, start, answer)
  const drained = s.touched ? clamp(Math.round(s.shown / 5), 0, 20) : 0
  const cell = 46, left = 160 - cell * 2.5, top = 76
  return <g>
    <text x="160" y="66" textAnchor="middle" className="rw-head">1900 wetland map · 1 square = 5%</text>
    {Array.from({ length: 20 }, (_, i) => {
      const x = left + (i % 5) * cell, y = top + Math.floor(i / 5) * 33, dry = i < drained
      return <g key={i}>
        <rect x={x + 1} y={y + 1} width={cell - 2} height="31" rx="5" className={`rw-cell${dry ? ' is-dry' : ''}`} />
        {dry ? <path d={`M${x + 8} ${y + 10} H${x + cell - 8} M${x + 8} ${y + 17} H${x + cell - 8} M${x + 8} ${y + 24} H${x + cell - 8}`} className="rw-furrow" />
          : <path d={`M${x + 10} ${y + 18} q5 -5 10 0 t10 0`} className="rw-wave" />}
      </g>
    })}
    <Pill x={160} y={226} text={s.touched ? `${n(s.shown)}% drained${s.way ? ` · ${s.way}` : ''}` : '?% drained'} tone={s.tone} />
  </g>
}

const DAM_LABEL: Record<string, string> = { pond: 'Pond forms', less: 'Less flooding', more: 'More species', dry: 'River dries up', worse: 'Worse flooding', fewer: 'Fewer species' }

/** The beaver dam in cross-section: each effect you place changes the river, live. */
function Dam({ picked, phase, wrong }: { picked: string[]; phase: Phase; wrong: Set<number> }) {
  const shown = phase === 'hit' ? ['pond', 'less', 'more'] : picked
  const up = shown[0], down = shown[1], life = shown[2]
  const plaque = (i: number, x: number, y: number, name: string) => {
    const tile = shown[i]
    return <g className={`rw-plaque${tile ? ' is-filled' : ''}${phase === 'set' && i === picked.length ? ' is-next' : ''}${wrong.has(i) ? ' is-wrong' : ''}${phase === 'hit' ? ' is-hit' : ''}`}>
      <text x={x} y={y - 6} textAnchor="middle" className="rw-note">{name}</text>
      <rect x={x - 66} y={y} width="132" height="30" rx="8" />
      <text x={x} y={y + 20} textAnchor="middle" className="rw-plaque__t">{tile ? DAM_LABEL[tile] : '?'}</text>
    </g>
  }
  const pondY = up === 'pond' ? 150 : up === 'dry' ? 196 : 176
  return <g>
    {plaque(2, 160, 72, 'wildlife')}
    {plaque(0, 78, 122, 'upstream')}
    {plaque(1, 242, 122, 'downstream, in a storm')}
    <path d="M10 160 Q40 200 90 206 L150 208 V228 H10 Z" className="rw-bank" />
    <path d="M10 160 Q40 200 90 206 L150 208 V228 H10 Z" className="rw-bank" transform="translate(320 0) scale(-1 1)" />
    <g className={up ? 'rw-rise' : undefined}><path d={`M${up === 'pond' ? 16 : 40} ${pondY} H150 V212 Q90 212 ${up === 'pond' ? 16 : 40} ${pondY} Z`} className={`rw-water${up === 'dry' ? ' is-low' : ''}`} /></g>
    <path d={down === 'worse' ? 'M170 166 H312 L310 212 H170 Z' : 'M170 196 H284 Q250 212 170 212 Z'} className={`rw-water${down === 'worse' ? ' is-flood' : ''}`} />
    {down === 'worse' && <path d="M178 160 q8 -8 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" className="rw-floodwave" />}
    <path d="M150 150 L174 214 M156 146 L168 214 M164 144 L158 214 M172 148 L150 214 M146 166 L178 170 M146 186 L178 190" className="rw-sticks rw-sticks--big" />
    <Icon x={186} y={184} size={26}>🦫</Icon>
    {life === 'more' && <g className="rw-arrive">
      <Icon x={60} y={180} size={18}>🦆</Icon><Icon x={110} y={196} size={16}>🐟</Icon><Icon x={34} y={158} size={16}>🐸</Icon><Icon x={128} y={150} size={16}>🦋</Icon><Icon x={240} y={198} size={14}>🐟</Icon>
    </g>}
    {life === 'fewer' && <Icon x={70} y={186} size={18}>🥀</Icon>}
  </g>
}

/** Ten random spots on the field (column, row on a 10 × 8 grid). */
const SPOTS: [number, number][] = [[1, 1], [6, 0], [3, 2], [8, 3], [0, 5], [4, 6], [7, 6], [2, 4], [9, 1], [5, 4]]
/** Where someone who picks the flowery spots would put them: all in the corner patch. */
const BIASED: [number, number][] = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 0], [3, 1], [0, 2], [1, 2]]

/** The field practical, built step by step: each method tile you place adds its step to the picture. */
function Method({ scene, picked, phase }: { scene: Scene; picked: string[]; phase: Phase }) {
  const has = (tile: string) => phase === 'hit' || picked.includes(tile)
  const counts = scene.counts!, mean = counts.reduce((a, b) => a + b, 0) / counts.length
  const left = 18, top = 64, cell = 20, cols = 10, rows = 8
  const biased = phase !== 'hit' && picked.includes('flowery')
  const spots = biased ? BIASED : SPOTS
  const spotsShown = has('random') || biased
  const at = ([c, r]: [number, number]) => [left + c * cell + cell / 2, top + r * cell + cell / 2]
  return <g>
    <rect x={left} y={top} width={cols * cell} height={rows * cell} rx="6" className="rw-field" />
    {[[30, 70], [44, 64], [36, 84], [56, 78], [26, 92], [64, 66]].map(([x, y], i) => <Flower key={i} x={x} y={y} r={6} kind="buttercup" />)}
    {[[150, 150], [96, 190], [186, 112], [120, 104]].map(([x, y], i) => <Flower key={`s${i}`} x={x} y={y} r={5} kind="buttercup" />)}
    {has('grid') && <g className="rw-land-in">
      {Array.from({ length: cols - 1 }, (_, i) => <line key={`c${i}`} x1={left + (i + 1) * cell} x2={left + (i + 1) * cell} y1={top} y2={top + rows * cell} className="rw-gridline" />)}
      {Array.from({ length: rows - 1 }, (_, i) => <line key={`r${i}`} x1={left} x2={left + cols * cell} y1={top + (i + 1) * cell} y2={top + (i + 1) * cell} className="rw-gridline" />)}
    </g>}
    {spotsShown && spots.map((p, i) => {
      const [x, y] = at(p)
      return <g key={i} className={`rw-spot${biased ? ' is-biased' : ''}`}>
        {has('place') || biased ? <rect x={x - 9} y={y - 9} width="18" height="18" rx="2" className="rw-mini-quad" /> : <circle cx={x} cy={y} r="4" />}
        {has('count') && <text x={x} y={y + 4.5} textAnchor="middle" className="rw-mini-count">{counts[i]}</text>}
      </g>
    })}
    <g className="rw-side">
      {has('random') && <g className="rw-land-in"><Icon x={266} y={80} size={30}>🎲</Icon><text x="266" y="112" textAnchor="middle" className="rw-note">random</text></g>}
      {biased && <text x="266" y="134" textAnchor="middle" className="rw-way">biased!</text>}
      {picked.includes('every') && phase !== 'hit' && <g><Icon x={266} y={150} size={22}>😵</Icon><text x="266" y="176" textAnchor="middle" className="rw-way">thousands!</text></g>}
      {has('mean') && <g className="rw-land-in">
        <rect x="226" y="186" width="80" height="44" rx="10" className={`rw-meanbox is-${phase === 'hit' ? 'hit' : phase === 'miss' ? 'miss' : 'set'}`} />
        <text x="266" y="203" textAnchor="middle" className="rw-note">mean</text>
        <text x="266" y="224" textAnchor="middle" className="rw-meanbox__t">{n(mean)} /m²</text>
      </g>}
    </g>
  </g>
}

function Stage({ round, task, value, picked, phase }: PlayStageProps<Scene>) {
  const scene = task.scene
  const wrong = phase === 'miss' && isTiles(task) ? new Set(wrongSlots(task, picked)) : new Set<number>()
  const dial = isTiles(task) ? { start: 0, answer: 0 } : { start: task.start, answer: task.answer }
  const props = { scene, value, phase, ...dial }
  return <svg viewBox="0 0 320 260" className={`rw-board is-${phase}`} role="img" aria-label={`${round.title}: ${task.label}`}>
    <Valley level={scene.level} phase={phase} />
    {scene.layout === 'mean' && <Mean {...props} />}
    {scene.layout === 'meadow' && <Meadow {...props} />}
    {scene.layout === 'transect' && <Transect {...props} />}
    {scene.layout === 'factors' && <Factors picked={picked} phase={phase} />}
    {scene.layout === 'chain' && <Chain picked={picked} phase={phase} wrong={wrong} />}
    {scene.layout === 'graph' && <Graph {...props} />}
    {scene.layout === 'wetland' && <Wetland {...props} />}
    {scene.layout === 'dam' && <Dam picked={picked} phase={phase} wrong={wrong} />}
    {scene.layout === 'method' && <Method scene={scene} picked={picked} phase={phase} />}
  </svg>
}

const config: PlayGameConfig<Scene> = {
  labId: 'science-rewild',
  name: 'Rewild',
  speaker: ROWAN,
  intros: [
    'Morning, ecologist! Wellies on. Our first job: count the bee orchids in the new wildflower meadow. No, you can’t count every single one.',
    'Down to the riverbank with the tape measure. Let’s see how the plants change as we walk away from the water, and why.',
    'The voles are booming and the barn owls have noticed. Grab the binoculars: we’re mapping who eats who.',
    'Big news: the beavers have been released! They’re about to undo a century of drainage, one dam at a time.',
    'Survey day at the local school field. Your required practical, and the whole Year 10 is watching. No pressure.',
  ],
  ranks: [
    { badge: '🦫', name: 'Chief Ecologist', line: 'Every survey spot on, first go. The beavers have named a dam after you.' },
    { badge: '🦉', name: 'Field Ecologist', line: 'A muddy slip or two, but the valley is thriving.' },
    { badge: '🌼', name: 'Survey Volunteer', line: 'You got there. Rowan double-checked your clipboard, though.' },
    { badge: '🥾', name: 'Welly Washer', line: 'You’re on welly-washing duty for now. Back to the field guide.' },
  ],
  rule: ['Mean = total ÷ number of quadrats. Population = mean per m² × area.', 'Food chains start with a producer. Abiotic = non-living, biotic = living.', 'Grid, random coordinates, quadrats, count, mean: random stops bias.'],
  start: 'Pull on the wellies',
  action: task => isTiles(task) ? 'Lock it in' : 'Survey it',
  asker: task => `Ranger Rowan · ${isTiles(task) ? 'tap the tiles in order' : 'set it, then survey it'}`,
  busted: {
    emoji: '🌊', kicker: 'Washed out', title: 'Three slips. Rowan is redoing this survey.',
    tip: 'Find the mean first: total ÷ number of quadrats, then × the area. Food chains start with the producer. Abiotic means non-living.',
    retry: 'Back in the field',
  },
  burst: '🌼',
  brag: (name, badge) => `I brought beavers back to a British valley in Rewild. Rank: ${name} ${badge}`,
  again: 'Rewild another valley',
  sound: sfx.tick,
  actionMs: 750,
  Stage,
}

/** A fresh valley every play: the game remounts with new numbers on "again". */
export default function Rewild() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <PlayGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

'use client'

import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { DialGame, type DialGameConfig, type Phase, type StageProps } from '../kit/DialGame'
import { n, u } from '../kit/types'
import { makeRounds, shells, signed, SYMBOLS, type Element, type Ion, type Scene } from './rounds'
import './ElementHunter.css'

const TAMSIN: Speaker = {
  name: 'Professor Tamsin Trevithick', emoji: '👩🏼‍🔬',
  right: ['Proper job! That’s going in the core sample log.', 'Lovely. Even the granite’s impressed, and granite’s seen everything.', 'Spot on. Britain’s battery bosses owe you a pasty.', 'That’s Chief Scientist thinking, that is.', 'Dreckly? No, you got that right now.'],
  wrong: ['Ah. That’s the kind of answer that ends up in a mine shaft.', 'Not quite. I’ve seen tidier work from a seagull.', 'Hmm. The rock didn’t lie, so one of us did.', 'Nope. Back down the drill hole, my lover.'],
}

/** The stage's mood: calm while setting, busy while it runs, then happy, too high (red, hot) or too low (blue, frosty). */
function moodFor(phase: Phase, value: number, answer: number) {
  if (phase === 'hit') return 'is-hit'
  if (phase === 'go') return 'is-go'
  if (phase === 'miss') return value > answer ? 'is-high' : 'is-low'
  return ''
}

/** A value on the picture. The dial's value gets a highlighted box. */
function Tag({ x, y, text, dial = false, anchor = 'middle' }: { x: number; y: number; text: string; dial?: boolean; anchor?: 'start' | 'middle' | 'end' }) {
  const width = Math.max(34, text.length * 8.2 + 12)
  const left = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x
  return <g className={`eh-tag${dial ? ' is-dial' : ''}`}>
    {dial && <rect x={left} y={y - 15} width={width} height="21" rx="6" />}
    <text x={anchor === 'middle' ? x : anchor === 'end' ? x - 6 : x + 6} y={y} textAnchor={anchor}>{text}</text>
  </g>
}

/* ---------------------------------------------------------------- A Bohr atom: nucleus, then electrons in shells */

const SHELL_R = [32, 46, 60, 74]
function Bohr({ cx, cy, protons, neutrons, electrons, full = false }: { cx: number; cy: number; protons: number; neutrons?: string; electrons: number; full?: boolean }) {
  const filled = shells(Math.min(electrons, 28))
  return <g className={`eh-atom${full ? ' is-full' : ''}`}>
    {SHELL_R.slice(0, Math.max(filled.length, 1)).map((r, i) => <circle key={r} cx={cx} cy={cy} r={r} className={`eh-shell${i === filled.length - 1 ? ' eh-shell--outer' : ''}`} />)}
    <g className="eh-electrons">
      {filled.flatMap((count, s) => Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2 + s * 0.3
        return <circle key={`${s}-${i}`} cx={cx + SHELL_R[s] * Math.cos(angle)} cy={cy + SHELL_R[s] * Math.sin(angle)} r="4.5" className="eh-electron" />
      }))}
    </g>
    <g className="eh-nucleus">
      <circle cx={cx} cy={cy} r="22" />
      <text x={cx} y={neutrons === undefined ? cy + 5 : cy - 2} textAnchor="middle">{protons}p</text>
      {neutrons !== undefined && <text x={cx} y={cy + 13} textAnchor="middle">{neutrons}n</text>}
    </g>
  </g>
}

/* ---------------------------------------------------------------- Round 1: the atom and its nucleus */

function AtomScene({ el, neutrons, dial, value, live, mood, moved }: { el: Element; neutrons: number; dial: 'neutrons' | 'mass'; value: number; live: string; mood: string; moved: boolean }) {
  const nShown = dial === 'neutrons' ? (mood === 'is-hit' ? `${neutrons}` : moved ? n(value) : '?') : `${neutrons}`
  const massShown = dial === 'mass' ? (mood === 'is-hit' ? `${el.a}` : moved ? n(value) : '?') : `${el.a}`
  return <svg viewBox="0 0 320 200" className={`eh-svg ${mood}`} role="img" aria-label={`An atom of ${el.name}: ${el.z} protons, ${el.z} electrons`}>
    <Bohr cx={92} cy={100} protons={el.z} neutrons={nShown} electrons={el.z} />
    <text x="92" y="20" textAnchor="middle" className="eh-pop">💥</text>
    <text x="248" y="52" textAnchor="middle" className="eh-symbol">
      <tspan className="eh-symbol__num" dy="-12">{massShown}</tspan><tspan dy="12">{el.sym}</tspan>
    </text>
    <text x="248" y="70" textAnchor="middle" className="eh-note">{el.name}</text>
    {dial === 'neutrons'
      ? <><Tag x={248} y={104} text={`Mass number ${el.a}`} /><Tag x={248} y={130} text={`Protons ${el.z}`} /><Tag x={248} y={160} text={`Neutrons = ${live}`} dial /></>
      : <><Tag x={248} y={104} text={`Protons ${el.z}`} /><Tag x={248} y={130} text={`Neutrons ${neutrons}`} /><Tag x={248} y={160} text={`Mass no. = ${live}`} dial /></>}
    <text x="248" y="190" textAnchor="middle" className="eh-note">electrons = protons</text>
  </svg>
}

/* ---------------------------------------------------------------- Round 2: the first 20 elements */

const COL_W = 36, ROW_H = 30, X0 = 16, Y0 = 32
const cellOf = (z: number): [number, number] => {
  if (z === 1) return [0, 0]
  if (z === 2) return [7, 0]
  const sh = shells(z), outer = sh[sh.length - 1]
  return [outer === 8 ? 7 : outer - 1, sh.length - 1]
}

function TableScene({ z, dial, value, live, mood, moved, phase }: { z: number; dial: 'group' | 'electrons'; value: number; live: string; mood: string; moved: boolean; phase: Phase }) {
  const shown = phase === 'hit' ? (dial === 'group' ? cellOf(z)[0] + 1 : z) : value
  const lit = moved || phase === 'hit'
  const col = dial === 'group' && lit ? (shown <= 0 || shown >= 8 ? 7 : shown - 1) : -1
  const sh = shells(z)
  return <svg viewBox="0 0 320 204" className={`eh-svg eh-table ${mood}`} role="img" aria-label="The first 20 elements of the periodic table">
    {[1, 2, 3, 4, 5, 6, 7, 0].map((g, i) => <text key={g} x={X0 + i * COL_W + COL_W / 2} y={Y0 - 8} textAnchor="middle" className={`eh-note${i === col ? ' eh-col-head' : ''}`}>{g}</text>)}
    {col >= 0 && <rect x={X0 + col * COL_W} y={Y0} width={COL_W} height={ROW_H * 4} rx="4" className="eh-col" />}
    {SYMBOLS.slice(1).map((sym, i) => {
      const [c, r] = cellOf(i + 1)
      const isPick = dial === 'electrons' && lit && shown === i + 1
      const isTarget = phase === 'hit' && i + 1 === z
      return <g key={sym} className={`eh-cell${isPick ? ' is-pick' : ''}${isTarget ? ' is-target' : ''}`}>
        <rect x={X0 + c * COL_W + 2} y={Y0 + r * ROW_H + 2} width={COL_W - 4} height={ROW_H - 4} rx="4" />
        <text x={X0 + c * COL_W + COL_W / 2} y={Y0 + r * ROW_H + 20} textAnchor="middle">{sym}</text>
      </g>
    })}
    <text x="300" y="18" textAnchor="end" className="eh-pop">💥</text>
    {dial === 'group'
      ? <><Tag x={84} y={180} text={sh.join(',')} /><Tag x={228} y={180} text={`Group = ${live}`} dial /></>
      : <><Tag x={84} y={180} text={`Group ${cellOf(z)[0] + 1} · Period ${sh.length}`} /><Tag x={238} y={180} text={`Electrons = ${live}`} dial /></>}
    <text x="160" y="202" textAnchor="middle" className="eh-note">{dial === 'group' ? 'shells → period · outer electrons → group' : 'shells hold 2, then 8, then 8'}</text>
  </svg>
}

/* ---------------------------------------------------------------- Round 3: an ion, and ions snapping together */

function IonScene({ ion, value, live, mood, moved, phase }: { ion: Ion; value: number; live: string; mood: string; moved: boolean; phase: Phase }) {
  const charge = phase === 'hit' ? ion.charge : moved ? value : 0
  const electrons = Math.max(0, ion.z - charge)
  return <svg viewBox="0 0 320 200" className={`eh-svg ${mood}`} role="img" aria-label={`A ${ion.name} atom, group ${ion.group}, gaining or losing electrons`}>
    <Bohr cx={92} cy={100} protons={ion.z} electrons={electrons} full={phase === 'hit'} />
    <text x="92" y="20" textAnchor="middle" className="eh-pop">💥</text>
    <text x="248" y="44" textAnchor="middle" className="eh-symbol">{phase === 'hit' ? ion.text : ion.sym}</text>
    <Tag x={248} y={84} text={`Protons ${ion.z}`} />
    <Tag x={248} y={112} text={`Electrons ${moved || phase === 'hit' ? electrons : ion.z}`} />
    <Tag x={248} y={146} text={`Charge = ${live}`} dial />
    <text x="248" y="180" textAnchor="middle" className="eh-note">{ion.charge > 0 ? 'metal: loses electrons' : 'non-metal: gains electrons'}</text>
  </svg>
}

function IonBall({ x, y, r, ion }: { x: number; y: number; r: number; ion: Ion }) {
  return <g className={`eh-ion ${ion.charge > 0 ? 'eh-ion--plus' : 'eh-ion--minus'}`}>
    <circle cx={x} cy={y} r={r} />
    <text x={x} y={y + 5} textAnchor="middle">{ion.text}</text>
  </g>
}

function LatticeScene({ count, per, formula, value, live, mood, moved, phase, answer }: { count: Ion; per: Ion; formula: string; value: number; live: string; mood: string; moved: boolean; phase: Phase; answer: number }) {
  const k = phase === 'hit' ? answer : moved ? Math.max(0, Math.min(6, value)) : 0
  const net = k * count.charge + per.charge
  return <svg viewBox="0 0 320 200" className={`eh-svg eh-lattice ${mood}`} role="img" aria-label={`One ${per.text} ion with ${count.text} ions around it`}>
    <g className="eh-snap">
      {Array.from({ length: k }, (_, i) => {
        const angle = (i / Math.max(k, 1)) * 2 * Math.PI - Math.PI / 2
        return <g key={`${k}-${i}`} className="eh-snap__ion" style={{ animationDelay: `${i * 60}ms` }}>
          <line x1={96} y1={100} x2={96 + 62 * Math.cos(angle)} y2={100 + 62 * Math.sin(angle)} className="eh-link" />
          <IonBall x={96 + 62 * Math.cos(angle)} y={100 + 62 * Math.sin(angle)} r={19} ion={count} />
        </g>
      })}
      <IonBall x={96} y={100} r={26} ion={per} />
    </g>
    <text x="96" y="22" textAnchor="middle" className="eh-pop">💥</text>
    <Tag x={250} y={56} text={`${count.text} ions = ${live}`} dial />
    <Tag x={250} y={96} text={`Total charge ${moved || phase === 'hit' ? signed(net) : '?'}`} />
    <Tag x={250} y={136} text={`Formula ${phase === 'hit' ? formula : '?'}`} />
    <text x="250" y="176" textAnchor="middle" className="eh-note">charges must add to 0</text>
  </svg>
}

/* ---------------------------------------------------------------- Rounds 4 and 5: the thermometer */

const T_MAX = 50, T_BASE = 170, T_TOP = 26
const ty = (t: number) => T_BASE - Math.max(-4, Math.min(T_MAX + 4, t)) / T_MAX * (T_BASE - T_TOP)

function ThermoScene({ scene, value, live, phase, moved }: { scene: Extract<Scene, { kind: 'thermo' }>; value: number; live: string; phase: Phase; moved: boolean }) {
  const sign = scene.dir === 'rise' ? 1 : -1
  const temp = phase === 'hit' ? scene.target : moved ? scene.start + sign * value : scene.start
  // The picture follows the temperature: hotter than it should be glows red and steams, colder frosts over blue.
  const mood = phase === 'hit' ? 'is-hit' : phase === 'go' ? 'is-go' : phase === 'miss' ? (temp > scene.target ? 'is-high' : 'is-low') : ''
  const word = scene.dir === 'rise' ? 'Rise' : 'Drop'
  return <svg viewBox="0 0 320 204" className={`eh-svg eh-thermo ${mood}`} role="img" aria-label={`A thermometer: starts at ${scene.start} °C`}>
    {[0, 10, 20, 30, 40, 50].map(t => <g key={t}>
      <line x1="54" x2="62" y1={ty(t)} y2={ty(t)} className="eh-tick" />
      <text x="48" y={ty(t) + 5} textAnchor="end" className="eh-note">{t}</text>
    </g>)}
    <rect x="62" y={T_TOP - 8} width="18" height={T_BASE - T_TOP + 14} rx="9" className="eh-glass" />
    <rect x="66" y={ty(temp)} width="10" height={T_BASE + 6 - ty(temp)} className="eh-liquid" />
    <circle cx="71" cy={T_BASE + 14} r="13" className="eh-bulb" />
    <line x1="58" x2="84" y1={ty(scene.start)} y2={ty(scene.start)} className="eh-startline" />
    <text x="71" y="14" textAnchor="middle" className="eh-steam">♨️</text>
    <text x="100" y={ty(temp) + 5} className="eh-frost">❄️</text>
    {scene.item === 'cup'
      ? <>
        <g className="eh-cup">
          <path d="M100 96 L108 168 H148 L156 96 Z" className="eh-cup__body" />
          <path d="M103 122 L108 168 H148 L153 122 Z" className="eh-cup__liquid" />
          <rect x="96" y="88" width="64" height="8" rx="3" className="eh-cup__lid" />
        </g>
        <text x="128" y="190" textAnchor="middle" className="eh-note">polystyrene</text>
        <text x="200" y="30" className="eh-head">Time</text><text x="300" y="30" textAnchor="end" className="eh-head">°C</text>
        {scene.readings?.map(([s, c], i) => <g key={s} className="eh-row">
          <text x="200" y={52 + i * 22} className="eh-cell-text">{s} s</text>
          <text x="300" y={52 + i * 22} textAnchor="end" className="eh-cell-text">{c}</text>
        </g>)}
        <Tag x={250} y={180} text={`${word} = ${live}`} dial />
      </>
      : <>
        <text x="132" y="112" textAnchor="middle" className="eh-item">{scene.item === 'warmer' ? '🧤' : '🧊'}</text>
        <text x="132" y="142" textAnchor="middle" className="eh-note">{scene.item === 'warmer' ? 'hand warmer' : 'cold pack'}</text>
        <Tag x={248} y={60} text={`Start ${u(scene.start, '°C')}`} />
        <Tag x={248} y={92} text={`Final ${u(scene.target, '°C')}`} />
        <Tag x={248} y={130} text={`${word} = ${live}`} dial />
        <text x="248" y="164" textAnchor="middle" className="eh-note">{scene.dir === 'rise' ? 'exothermic: warms up' : 'endothermic: cools down'}</text>
      </>}
  </svg>
}

function RepeatsScene({ rises, value, live, mood, moved, phase, answer }: { rises: number[]; value: number; live: string; mood: string; moved: boolean; phase: Phase; answer: number }) {
  const base = 166, scale = 8
  const y = (t: number) => base - Math.max(0, Math.min(18, t)) * scale
  const mean = phase === 'hit' ? answer : value
  return <svg viewBox="0 0 320 200" className={`eh-svg eh-repeats ${mood}`} role="img" aria-label={`Three repeats: ${rises.join(', ')} °C`}>
    <line x1="24" x2="206" y1={base} y2={base} className="eh-axis" />
    {rises.map((r, i) => <g key={i} className="eh-bar">
      <rect x={40 + i * 56} y={y(r)} width="40" height={base - y(r)} rx="4" />
      <text x={60 + i * 56} y={y(r) - 6} textAnchor="middle" className="eh-bar__label">{r}</text>
      <text x={60 + i * 56} y={base + 18} textAnchor="middle" className="eh-note">Run {i + 1}</text>
    </g>)}
    {(moved || phase === 'hit') && <line x1="24" x2="206" y1={y(mean)} y2={y(mean)} className="eh-mean" />}
    <text x="200" y="22" textAnchor="end" className="eh-pop">💥</text>
    <Tag x={262} y={80} text={`Mean = ${live}`} dial />
    <text x="262" y="112" textAnchor="middle" className="eh-note">rise in °C</text>
    <text x="262" y="132" textAnchor="middle" className="eh-note">total ÷ 3</text>
  </svg>
}

function Stage({ task, value, phase }: StageProps<Scene>) {
  const moved = phase !== 'set' || value !== task.start
  const show = (v: number) => task.label === 'Charge' ? signed(v) : u(v, task.unit)
  const live = phase === 'hit' ? show(task.answer) : moved ? show(value) : '?'
  const mood = moodFor(phase, value, task.answer)
  const s = task.scene
  if (s.kind === 'atom') return <AtomScene el={s.el} neutrons={s.neutrons} dial={s.dial} value={value} live={live} mood={mood} moved={moved} />
  if (s.kind === 'table') return <TableScene z={s.z} dial={s.dial} value={value} live={live} mood={mood} moved={moved} phase={phase} />
  if (s.kind === 'ion') return <IonScene ion={s.ion} value={value} live={live} mood={mood} moved={moved} phase={phase} />
  if (s.kind === 'lattice') return <LatticeScene count={s.count} per={s.per} formula={s.formula} value={value} live={live} mood={mood} moved={moved} phase={phase} answer={task.answer} />
  if (s.kind === 'thermo') return <ThermoScene scene={s} value={value} live={live} phase={phase} moved={moved} />
  return <RepeatsScene rises={s.rises} value={value} live={live} mood={mood} moved={moved} phase={phase} answer={task.answer} />
}

const config: DialGameConfig<Scene> = {
  labId: 'science-element',
  name: 'Element Hunter',
  speaker: TAMSIN,
  intros: [
    'Dreckly means “sometime”, but Britain needs lithium NOW. Under this Cornish granite there’s enough for a million EV batteries. First, let’s see what an atom is made of.',
    'The drill’s brought up a brine full of mystery atoms. Luckily, the periodic table is basically a treasure map. Let’s read it.',
    'Lithium on its own is useless to a battery. It’s the ions that do the work. Let’s get them snapping together.',
    'Field day on Bodmin Moor. It’s blowing a hoolie, so I’ve brought chemistry to keep us warm. And something to cool us down when you trip over a rock.',
    'The inspector’s here for the required practical. Polystyrene cups at the ready. Nobody sneeze on the thermometer.',
  ],
  ranks: [
    { badge: '💎', name: 'Chief Materials Scientist', line: 'Lithium mined, silicon refined, chips made in Britain. They’re naming a crystal after you.' },
    { badge: '🔋', name: 'Battery Chemist', line: 'A few sparks along the way, but the EVs are charging on your lithium.' },
    { badge: '⛏️', name: 'Field Geologist', line: 'You found the seam. Tamsin had to point quite hard, mind.' },
    { badge: '🪨', name: 'Rock Botherer', line: 'You hit a lot of granite. Grab your hard hat and dig again.' },
  ],
  rule: ['Atomic number = protons = electrons. Neutrons = mass number − atomic number.', 'Outer electrons = group, shells = period. Metals lose electrons (+), non-metals gain them (−); ionic charges add to 0.', 'Temperature change = highest − start. Exothermic warms up, endothermic cools down. Mean = total ÷ number of repeats.'],
  start: 'Hard hats on',
  action: 'Test it',
  // "Li⁺ ions" keeps its symbol; plain words go lower case: "set the mass number".
  asker: task => `Tamsin · set the ${task.label.endsWith(' ions') ? task.label : task.label.toLowerCase()}, then test it`,
  busted: {
    emoji: '🪨', kicker: 'Rockfall', title: 'Three slips and the drill’s stuck in the granite.',
    tip: 'Write the rule before the numbers. Neutrons = mass number − atomic number. Group = outer electrons. Charges add to zero. Temperature change = highest − start.',
    retry: 'Dig again',
  },
  burst: '💎',
  brag: (name, badge) => `I hunted lithium in Cornwall and silicon for British chips in Element Hunter. Rank: ${name} ${badge}`,
  again: 'Hunt again',
  sound: sfx.tick,
  actionMs: 750,
  Stage,
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function ElementHunter() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <DialGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

'use client'

import type { CSSProperties } from 'react'
import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { PlayGame, type Phase, type PlayGameConfig, type PlayStageProps } from '../kit/PlayGame'
import { isTiles, wrongSlots } from '../kit/tiles'
import { n, u } from '../kit/types'
import { makeRounds, METALS, shells, signed, SYMBOLS, type Element, type Ion, type IonTile, type Reaction, type Scene } from './rounds'
import './ElementHunter.css'

const TAMSIN: Speaker = {
  name: 'Professor Tamsin Trevithick', emoji: '👩🏼‍🔬',
  right: ['Proper job! That’s going in the core sample log.', 'Lovely. Even the granite’s impressed, and granite’s seen everything.', 'Spot on. Britain’s battery bosses owe you a pasty.', 'That’s Chief Scientist thinking, that is.', 'Dreckly? No, you got that right now.'],
  wrong: ['Ah. That’s the kind of answer that ends up in a mine shaft.', 'Not quite. I’ve seen tidier work from a seagull.', 'Hmm. The rock didn’t lie, so one of us did.', 'Nope. Back down the drill hole, my lover.'],
}

/** A value on the picture. The dial's value gets a highlighted box. */
function Tag({ x, y, text, dial = false, anchor = 'middle' }: { x: number; y: number; text: string; dial?: boolean; anchor?: 'start' | 'middle' | 'end' }) {
  const width = Math.max(34, text.length * 8.4 + 14)
  const left = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x
  return <g className={`eh-tag${dial ? ' is-dial' : ''}`}>
    {dial && <rect x={left} y={y - 16} width={width} height="23" rx="7" />}
    <text x={anchor === 'middle' ? x : anchor === 'end' ? x - 7 : x + 7} y={y} textAnchor={anchor}>{text}</text>
  </g>
}

/* ---------------------------------------------------------------- A Bohr atom: a packed nucleus, then electrons on shells */

const SHELL_R = [38, 56, 74, 92]

/** Protons and neutrons packed sunflower-style, mixed evenly, so the nucleus visibly grows as neutrons go in. */
function Nucleus({ cx, cy, protons, neutrons }: { cx: number; cy: number; protons: number; neutrons: number }) {
  const total = protons + neutrons
  return <g className="eh-nucleus">
    <circle cx={cx} cy={cy} r={3.3 * Math.sqrt(total) + 7} className="eh-nucleus__halo" />
    {Array.from({ length: total }, (_, i) => {
      const isProton = Math.floor((i + 1) * protons / total) > Math.floor(i * protons / total)
      const r = 3.3 * Math.sqrt(i + 0.5), a = i * 2.39996
      return <circle key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r="3.8" className={isProton ? 'eh-proton' : 'eh-neutron'} />
    })}
  </g>
}

type ShellState = 'ok' | 'wrong' | 'next' | 'empty'

/** Shells with their electrons. `counts[i]` electrons on shell i; `states` colours each ring. */
function Bohr({ cx, cy, protons, neutrons, counts, states, spin = false, rings }: {
  cx: number; cy: number; protons: number; neutrons: number; counts: number[]; states?: ShellState[]; spin?: boolean; rings?: number
}) {
  const shown = Math.max(rings ?? counts.length, 1)
  const origin: CSSProperties = { transformOrigin: `${cx}px ${cy}px` }
  return <g className="eh-atom">
    {SHELL_R.slice(0, shown).map((r, i) => <circle key={r} cx={cx} cy={cy} r={r} className={`eh-shell is-${states?.[i] ?? (i < counts.length ? 'ok' : 'empty')}`} />)}
    <g className={spin ? 'eh-orbit' : undefined} style={origin}>
      {counts.map((count, s) => Array.from({ length: Math.min(count, 12) }, (_, i) => {
        const angle = (i / Math.min(count, 12)) * 2 * Math.PI - Math.PI / 2 + s * 0.4
        return <g key={`${s}-${i}-${count}`} className="eh-e-in" style={{ animationDelay: `${i * 35}ms` }}>
          <circle cx={cx + SHELL_R[s] * Math.cos(angle)} cy={cy + SHELL_R[s] * Math.sin(angle)} r="6" className={`eh-electron${states?.[s] === 'wrong' ? ' is-wrong' : ''}`} />
        </g>
      }))}
    </g>
    <Nucleus cx={cx} cy={cy} protons={protons} neutrons={neutrons} />
  </g>
}

/** The element's own periodic-table cell: mass number up top, atomic number below, glowing when solved. */
function Cell({ x, y, el, mass, lit }: { x: number; y: number; el: Element; mass: string; lit: boolean }) {
  return <g className={`eh-el${lit ? ' is-lit' : ''}`}>
    <rect x={x} y={y} width="92" height="112" rx="12" />
    <text x={x + 10} y={y + 22} className="eh-el__num">{mass}</text>
    <text x={x + 46} y={y + 62} textAnchor="middle" className="eh-el__sym">{el.sym}</text>
    <text x={x + 46} y={y + 82} textAnchor="middle" className="eh-el__name">{el.name}</text>
    <text x={x + 10} y={y + 102} className="eh-el__num">{el.z}</text>
  </g>
}

/* ---------------------------------------------------------------- Round 1: the atom */

function AtomScene({ scene, task, value, picked, phase }: { scene: Extract<Scene, { kind: 'atom' }>; task: PlayStageProps<Scene>['task']; value: number; picked: string[]; phase: Phase }) {
  const { el, neutrons } = scene
  const answer = shells(el.z)
  if (scene.mode === 'neutrons') {
    const moved = phase !== 'set' || value !== 0
    const shown = phase === 'hit' ? neutrons : Math.max(0, Math.min(40, value))
    const live = phase === 'hit' ? `${neutrons}` : moved ? n(value) : '?'
    return <>
      <Bohr cx={112} cy={122} protons={el.z} neutrons={shown} counts={answer} spin={phase === 'hit' || phase === 'go'} />
      <Cell x={218} y={14} el={el} mass={`${el.a}`} lit={phase === 'hit'} />
      <Tag x={262} y={152} text={`${el.z} protons`} />
      <Tag x={262} y={182} text={`n = ${live}`} dial />
      <text x="264" y="210" textAnchor="middle" className="eh-note">{phase === 'hit' ? `${el.z} + ${neutrons} = ${el.a} ✓` : `mass − atomic`}</text>
      <text x="112" y="236" textAnchor="middle" className="eh-note">{shown === 0 ? 'nucleus: protons only so far' : `${el.z} p + ${shown} n in the nucleus`}</text>
    </>
  }
  const placed = phase === 'hit' ? answer : picked.map(Number)
  const wrong = phase === 'miss' && isTiles(task) ? new Set(wrongSlots(task, picked)) : new Set<number>()
  const states: ShellState[] = answer.map((_, i) => wrong.has(i) ? 'wrong' : i < placed.length ? 'ok' : i === placed.length && phase === 'set' ? 'next' : 'empty')
  const total = placed.reduce((sum, c) => sum + c, 0)
  return <>
    <Bohr cx={112} cy={122} protons={el.z} neutrons={neutrons} counts={placed} states={states} rings={answer.length} spin={phase === 'hit'} />
    <Cell x={218} y={14} el={el} mass={`${el.a}`} lit={phase === 'hit'} />
    <Tag x={262} y={152} text={`${el.z} electrons`} />
    <Tag x={262} y={182} text={`placed ${total}`} dial />
    <text x="264" y="210" textAnchor="middle" className="eh-note">{placed.length ? placed.join(', ') : '2, then 8, then 8'}</text>
  </>
}

/* ---------------------------------------------------------------- Round 2: the first 20 elements */

const COL_W = 36, ROW_H = 38, X0 = 16, Y0 = 34
const cellOf = (z: number): [number, number] => {
  if (z === 1) return [0, 0]
  if (z === 2) return [7, 0]
  const sh = shells(z), outer = sh[sh.length - 1]
  return [outer === 8 ? 7 : outer - 1, sh.length - 1]
}
/** The metal / non-metal staircase: between groups 2 and 3 in period 2, groups 3 and 4 in period 3, 4 and 5 in period 4. */
const STAIRS = `M${X0 + 2 * COL_W} ${Y0 + ROW_H} V${Y0 + 2 * ROW_H} H${X0 + 3 * COL_W} V${Y0 + 3 * ROW_H} H${X0 + 4 * COL_W} V${Y0 + 4 * ROW_H}`

function Table({ marks, col = -1, stairs = false, lit = -1 }: { marks: Map<number, string>; col?: number; stairs?: boolean; lit?: number }) {
  return <g>
    {[1, 2, 3, 4, 5, 6, 7, 0].map((g, i) => <text key={g} x={X0 + i * COL_W + COL_W / 2} y={Y0 - 10} textAnchor="middle" className={`eh-note${i === col ? ' eh-col-head' : ''}`}>{g}</text>)}
    {col >= 0 && <rect x={X0 + col * COL_W} y={Y0} width={COL_W} height={ROW_H * 4} rx="6" className="eh-col" />}
    {SYMBOLS.slice(1).map((sym, i) => {
      const z = i + 1, [c, r] = cellOf(z)
      const mark = marks.get(z)
      return <g key={sym} className={`eh-cell${mark ? ` ${mark}` : ''}${z === lit ? ' is-target' : ''}`}>
        <rect x={X0 + c * COL_W + 2} y={Y0 + r * ROW_H + 2} width={COL_W - 4} height={ROW_H - 4} rx="6" />
        <text x={X0 + c * COL_W + COL_W / 2} y={Y0 + r * ROW_H + 25} textAnchor="middle">{sym}</text>
      </g>
    })}
    {stairs && <path d={STAIRS} className="eh-stairs" />}
  </g>
}

function GroupScene({ z, value, phase }: { z: number; value: number; phase: Phase }) {
  const moved = phase !== 'set' || value !== 0
  const g = shells(z)[shells(z).length - 1]
  const col = phase === 'hit' ? g - 1 : moved && value >= 1 && value <= 8 ? (value === 8 ? 7 : value - 1) : -1
  const sh = shells(z)
  return <>
    <Table marks={new Map()} col={col} lit={phase === 'hit' ? z : -1} />
    <text x="16" y="216" className="eh-config">
      {sh.map((c, i) => <tspan key={i} className={i === sh.length - 1 ? 'eh-config__outer' : undefined}>{c}{i < sh.length - 1 ? ',' : ''}</tspan>)}
    </text>
    <text x="16" y="236" className="eh-note">mystery atom</text>
    <Tag x={232} y={220} text={`Group = ${phase === 'hit' ? g : moved ? n(value) : '?'}`} dial />
  </>
}

function SortScene({ picks, task, picked, phase }: { picks: number[]; task: PlayStageProps<Scene>['task']; picked: string[]; phase: Phase }) {
  const placed = phase === 'hit' ? picks.map(z => METALS.has(z) ? 'metal' : 'non-metal') : picked
  const wrong = phase === 'miss' && isTiles(task) ? new Set(wrongSlots(task, picked)) : new Set<number>()
  const marks = new Map<number, string>(picks.map((z, i) => [z, `is-pickable${placed[i] ? ` is-${placed[i]}` : ''}${wrong.has(i) ? ' is-wrong' : ''}${i === placed.length && phase === 'set' ? ' is-next' : ''}`]))
  return <>
    <Table marks={marks} stairs={phase === 'hit' || phase === 'miss'} />
    {picks.map((z, i) => {
      const [c, r] = cellOf(z)
      return <g key={z} className="eh-badge"><circle cx={X0 + c * COL_W + COL_W - 4} cy={Y0 + r * ROW_H + 4} r="8" /><text x={X0 + c * COL_W + COL_W - 4} y={Y0 + r * ROW_H + 8} textAnchor="middle">{i + 1}</text></g>
    })}
    <g className="eh-legend">
      <rect x="16" y="200" width="22" height="22" rx="5" className="eh-legend__metal" /><text x="44" y="216">Metal</text>
      <rect x="120" y="200" width="22" height="22" rx="5" className="eh-legend__non" /><text x="148" y="216">Non-metal</text>
    </g>
    <text x="304" y="216" textAnchor="end" className="eh-note">{phase === 'hit' || phase === 'miss' ? '— staircase line' : `${Math.min(placed.length, 4)} / 4`}</text>
  </>
}

/* ---------------------------------------------------------------- Round 3: an ion, and ions snapping together */

function IonScene({ ion, value, phase }: { ion: Ion; value: number; phase: Phase }) {
  const moved = phase !== 'set' || value !== 0
  const charge = phase === 'hit' ? ion.charge : moved ? value : 0
  const electrons = Math.max(0, ion.z - charge)
  const lost = Math.max(0, charge)
  const counts = shells(electrons)
  const live = phase === 'hit' ? signed(ion.charge) : moved ? signed(value) : '?'
  return <>
    <Bohr cx={104} cy={122} protons={ion.z} neutrons={(MASS[ion.sym] ?? 2 * ion.z) - ion.z} counts={counts} spin={phase === 'hit'} />
    {phase === 'hit' && <g className="eh-bracket">
      <path d={`M${104 - 92} 26 h-8 V218 h8 M${104 + 92} 26 h8 V218 h-8`} />
      <text x={104 + 100} y="28">{`${Math.abs(ion.charge) > 1 ? Math.abs(ion.charge) : ''}${ion.charge > 0 ? '+' : '−'}`}</text>
    </g>}
    {Array.from({ length: Math.min(lost, 4) }, (_, i) => <g key={`${lost}-${i}`} className="eh-fly"><circle cx={232 + i * 18} cy={204} r="6" className="eh-electron" /></g>)}
    {lost > 0 && <text x="232" y="232" className="eh-note">lost</text>}
    <text x="264" y="60" textAnchor="middle" className="eh-big">{phase === 'hit' ? ion.text : ion.sym}</text>
    <Tag x={264} y={96} text={`${ion.z} p`} />
    <Tag x={264} y={124} text={`${electrons} e`} />
    <Tag x={264} y={160} text={`charge ${live}`} dial />
  </>
}

/** Mass numbers of the usual atoms, so an ion's nucleus has its neutrons too. */
const MASS: Record<string, number> = { Li: 7, Na: 23, K: 39, Mg: 24, Ca: 40, F: 19, Cl: 35, O: 16, S: 32 }

/** Where up to three ions sit on the bench: tight when they've snapped together. */
const SPOTS = (count: number, tight: boolean): [number, number][] => {
  const d = tight ? 0.8 : 1
  if (count <= 1) return [[160, 92]]
  if (count === 2) return [[160 - 44 * d, 92], [160 + 44 * d, 92]]
  return [[160, 92 - 30 * d], [160 - 48 * d, 92 + 28 * d], [160 + 48 * d, 92 + 28 * d]]
}

function FormulaScene({ scene, picked, phase }: { scene: Extract<Scene, { kind: 'formula' }>; picked: string[]; phase: Phase }) {
  const hit = phase === 'hit'
  const placed = (hit ? [] : picked).map(text => scene.tiles.find(t => t.text === text)!)
  // On a hit the right ions sit snapped together.
  const ions: IonTile[] = hit ? solvedIons(scene) : placed
  const net = ions.reduce((sum, t) => sum + t.charge, 0)
  const spots = SPOTS(ions.length, hit)
  const x = (c: number) => 160 + Math.max(-3, Math.min(3, c)) * 38
  return <>
    <text x="160" y="22" textAnchor="middle" className="eh-head">{scene.compound}</text>
    <g className={`eh-snap${hit ? ' is-snapped' : ''}`}>
      {ions.map((t, i) => <g key={`${i}-${t.text}`} className="eh-drop"><g className={`eh-ion ${t.charge > 0 ? 'eh-ion--plus' : 'eh-ion--minus'}${t.real ? '' : ' is-fake'}`}>
        <circle cx={spots[i][0]} cy={spots[i][1]} r="30" />
        <text x={spots[i][0]} y={spots[i][1] + 7} textAnchor="middle">{t.text}</text>
      </g></g>)}
      {!ions.length && <text x="160" y="98" textAnchor="middle" className="eh-note">tap ions onto the bench</text>}
    </g>
    {hit && <text x="160" y="176" textAnchor="middle" className="eh-formula">{scene.formula}</text>}
    <g className={`eh-meter${net === 0 && ions.length ? ' is-zero' : net > 0 ? ' is-plus' : net < 0 ? ' is-minus' : ''}`}>
      <rect x="40" y="198" width="240" height="10" rx="5" className="eh-meter__track" />
      <rect x="146" y="194" width="28" height="18" rx="6" className="eh-meter__zero" />
      {[-3, -2, -1, 0, 1, 2, 3].map(c => <text key={c} x={x(c)} y="232" textAnchor="middle" className="eh-note">{signed(c)}</text>)}
      <g className="eh-meter__needle"><path d={`M${x(net)} 190 l-8 -12 h16 Z`} /></g>
      <text x="22" y="208" textAnchor="middle" className="eh-meter__sign">−</text>
      <text x="298" y="208" textAnchor="middle" className="eh-meter__sign">+</text>
    </g>
  </>
}
/** The right ions, in a stable order: the one with the bigger charge first, then its partners. */
function solvedIons(scene: Extract<Scene, { kind: 'formula' }>): IonTile[] {
  const real = scene.tiles.filter(t => t.real)
  const [big, small] = Math.abs(real[0].charge) >= Math.abs(real[1].charge) ? [real[0], real[1]] : [real[1], real[0]]
  return [big, ...Array.from({ length: Math.abs(big.charge) / Math.abs(small.charge) }, () => small)]
}

/* ---------------------------------------------------------------- Round 4: the thermometer and the reaction cards */

const T_MAX = 50, T_BASE = 196, T_TOP = 30
const ty = (t: number) => T_BASE - Math.max(-4, Math.min(T_MAX + 4, t)) / T_MAX * (T_BASE - T_TOP)

function ThermoScene({ scene, value, phase }: { scene: Extract<Scene, { kind: 'thermo' }>; value: number; phase: Phase }) {
  const moved = phase !== 'set' || value !== 0
  const rise = scene.target - scene.start
  const temp = phase === 'hit' ? scene.target : moved ? scene.start + value : scene.start
  const live = phase === 'hit' ? u(rise, '°C') : moved ? u(value, '°C') : '?'
  return <>
    {[0, 10, 20, 30, 40, 50].map(t => <g key={t}>
      <line x1="40" x2="48" y1={ty(t)} y2={ty(t)} className="eh-tick" />
      <text x="34" y={ty(t) + 5} textAnchor="end" className="eh-note">{t}</text>
    </g>)}
    <rect x="48" y={T_TOP - 10} width="22" height={T_BASE - T_TOP + 16} rx="11" className="eh-glass" />
    <rect x="53" y={ty(temp)} width="12" height={T_BASE + 8 - ty(temp)} className="eh-liquid" />
    <circle cx="59" cy={T_BASE + 16} r="15" className="eh-bulb" />
    <line x1="42" x2="76" y1={ty(scene.start)} y2={ty(scene.start)} className="eh-startline" />
    {temp !== scene.start && <g className="eh-risebar">
      <path d={`M84 ${ty(scene.start)} V${ty(temp)}`} />
      <path d={`M79 ${ty(temp) + (temp > scene.start ? 7 : -7)} L84 ${ty(temp)} L89 ${ty(temp) + (temp > scene.start ? 7 : -7)}`} />
    </g>}
    <text x="59" y="14" textAnchor="middle" className="eh-steam">♨️</text>
    <text x="90" y={ty(temp) + 5} className="eh-frost">❄️</text>
    {scene.item === 'cup'
      ? <>
        <g className="eh-cup">
          <path d="M100 110 L109 196 H155 L164 110 Z" className="eh-cup__body" />
          <path d="M103 138 L109 196 H155 L161 138 Z" className="eh-cup__liquid" />
          <rect x="96" y="100" width="72" height="10" rx="3" className="eh-cup__lid" />
        </g>
        <text x="132" y="220" textAnchor="middle" className="eh-note">polystyrene</text>
        <text x="200" y="28" className="eh-head">Time</text><text x="306" y="28" textAnchor="end" className="eh-head">°C</text>
        {scene.readings?.map(([s, c], i) => <g key={s} className={`eh-row${phase === 'hit' && c === scene.target ? ' is-peak' : ''}`}>
          <rect x="194" y={36 + i * 26} width="118" height="24" rx="6" />
          <text x="202" y={53 + i * 26} className="eh-cell-text">{s} s</text>
          <text x="304" y={53 + i * 26} textAnchor="end" className="eh-cell-text">{c}</text>
        </g>)}
        <Tag x={252} y={190} text={`Rise = ${live}`} dial />
      </>
      : <>
        <g className="eh-warmer">
          <circle cx="148" cy="104" r="52" className="eh-warmer__glow" />
          <text x="148" y="124" textAnchor="middle" className="eh-item">🧤</text>
        </g>
        <text x="148" y="182" textAnchor="middle" className="eh-note">hand warmer</text>
        <Tag x={264} y={48} text={`Start ${u(scene.start, '°C')}`} />
        <Tag x={264} y={82} text={`Final ${u(scene.target, '°C')}`} />
        <Tag x={264} y={126} text={`Rise = ${live}`} dial />
        <text x="264" y="160" textAnchor="middle" className="eh-note">final − start</text>
      </>}
  </>
}

function ReactionsScene({ list, task, picked, phase }: { list: Reaction[]; task: PlayStageProps<Scene>['task']; picked: string[]; phase: Phase }) {
  const placed = phase === 'hit' ? list.map(r => r.exo ? 'exo' : 'endo') : picked
  const wrong = phase === 'miss' && isTiles(task) ? new Set(wrongSlots(task, picked)) : new Set<number>()
  return <>{list.map((r, i) => {
    const x = 8 + (i % 2) * 156, y = 8 + Math.floor(i / 2) * 116
    const tag = placed[i]
    return <g key={r.name} className={`eh-card${tag ? ` is-${tag}` : ''}${wrong.has(i) ? ' is-wrong' : ''}${i === placed.length && phase === 'set' ? ' is-next' : ''}`}>
      <rect x={x} y={y} width="148" height="108" rx="14" />
      <circle cx={x + 16} cy={y + 16} r="10" className="eh-card__num" /><text x={x + 16} y={y + 21} textAnchor="middle" className="eh-card__numt">{i + 1}</text>
      <text x={x + 44} y={y + 66} textAnchor="middle" className="eh-card__icon">{r.icon}</text>
      <text x={x + 74} y={y + 98} textAnchor="middle" className="eh-card__name">{r.name}</text>
      {tag && <g transform={`translate(${x + 108} ${y + 52}) rotate(-10)`}><g className="eh-stamp">
        <rect x="-34" y="-16" width="68" height="30" rx="6" />
        <text y="6" textAnchor="middle">{tag === 'exo' ? 'EXO ↑' : 'ENDO ↓'}</text>
      </g></g>}
    </g>
  })}</>
}

function RepeatsScene({ rises, value, phase, answer }: { rises: number[]; value: number; phase: Phase; answer: number }) {
  const moved = phase !== 'set' || value !== 0
  const base = 196, scale = 9
  const y = (t: number) => base - Math.max(0, Math.min(18, t)) * scale
  const mean = phase === 'hit' ? answer : value
  return <>
    <line x1="20" x2="212" y1={base} y2={base} className="eh-axis" />
    {rises.map((r, i) => <g key={i} className="eh-bar">
      <rect x={34 + i * 60} y={y(r)} width="46" height={base - y(r)} rx="5" />
      <text x={57 + i * 60} y={y(r) - 8} textAnchor="middle" className="eh-bar__label">{r}</text>
      <text x={57 + i * 60} y={base + 20} textAnchor="middle" className="eh-note">Run {i + 1}</text>
    </g>)}
    {moved && <line x1="20" x2="212" y1={y(mean)} y2={y(mean)} className="eh-mean" />}
    <Tag x={266} y={84} text={`Mean = ${phase === 'hit' ? u(answer, '°C') : moved ? u(value, '°C') : '?'}`} dial />
    <text x="266" y="118" textAnchor="middle" className="eh-note">rise in °C</text>
    <text x="266" y="140" textAnchor="middle" className="eh-note">total ÷ 3</text>
  </>
}

function Stage({ task, value, picked, phase }: PlayStageProps<Scene>) {
  const s = task.scene
  // Dials go red when too high and blue when too low; tile tasks mark their wrong slots.
  const mood = phase === 'miss' && !isTiles(task) ? (value > task.answer ? ' is-high' : ' is-low') : ''
  const label = s.kind === 'atom' ? `An atom of ${s.el.name}` : s.kind === 'table' || s.kind === 'sort' ? 'The first 20 elements of the periodic table'
    : s.kind === 'ion' ? `A ${s.ion.name} atom becoming an ion` : s.kind === 'formula' ? `Ions making ${s.compound}` : s.kind === 'reactions' ? 'Four reactions to label' : s.kind === 'thermo' ? 'A thermometer' : 'Three repeat results'
  return <svg viewBox="0 0 320 244" className={`eh-svg is-${phase}${mood}`} role="img" aria-label={label}>
    {s.kind === 'atom' && <AtomScene scene={s} task={task} value={value} picked={picked} phase={phase} />}
    {s.kind === 'table' && <GroupScene z={s.z} value={value} phase={phase} />}
    {s.kind === 'sort' && <SortScene picks={s.picks} task={task} picked={picked} phase={phase} />}
    {s.kind === 'ion' && <IonScene ion={s.ion} value={value} phase={phase} />}
    {s.kind === 'formula' && <FormulaScene scene={s} picked={picked} phase={phase} />}
    {s.kind === 'thermo' && <ThermoScene scene={s} value={value} phase={phase} />}
    {s.kind === 'reactions' && <ReactionsScene list={s.list} task={task} picked={picked} phase={phase} />}
    {s.kind === 'repeats' && <RepeatsScene rises={s.rises} value={value} phase={phase} answer={isTiles(task) ? 0 : task.answer} />}
  </svg>
}

const config: PlayGameConfig<Scene> = {
  labId: 'science-element',
  name: 'Element Hunter',
  speaker: TAMSIN,
  intros: [
    'Dreckly means “sometime”, but Britain needs lithium NOW. Under this Cornish granite there’s enough for a million EV batteries. First, let’s see what an atom is made of.',
    'The drill’s brought up a brine full of mystery atoms. Luckily, the periodic table is basically a treasure map. Let’s read it.',
    'Lithium on its own is useless to a battery. It’s the ions that do the work. Let’s get them snapping together.',
    'Field day on Bodmin Moor. It’s blowing a hoolie, so I’ve brought chemistry to keep us warm. Some reactions warm you up, some cool you down.',
    'The inspector’s here for the required practical. Polystyrene cups at the ready. Nobody sneeze on the thermometer.',
  ],
  ranks: [
    { badge: '💎', name: 'Chief Materials Scientist', line: 'Lithium mined, silicon refined, chips made in Britain. They’re naming a crystal after you.' },
    { badge: '🔋', name: 'Battery Chemist', line: 'A few sparks along the way, but the EVs are charging on your lithium.' },
    { badge: '⛏️', name: 'Field Geologist', line: 'You found the seam. Tamsin had to point quite hard, mind.' },
    { badge: '🪨', name: 'Rock Botherer', line: 'You hit a lot of granite. Grab your hard hat and dig again.' },
  ],
  rule: ['Atomic number = protons = electrons. Neutrons = mass number − atomic number. Shells fill 2, 8, 8.', 'Outer electrons = group, shells = period. Metals lose electrons (+), non-metals gain them (−); ionic charges add to 0.', 'Exothermic warms up, endothermic cools down. Temperature change = highest − start. Mean = total ÷ repeats.'],
  start: 'Hard hats on',
  action: task => !isTiles(task) ? 'Test it'
    : task.scene.kind === 'atom' ? 'Fill the shells' : task.scene.kind === 'formula' ? 'Snap them together' : task.scene.kind === 'reactions' ? 'Stamp them' : 'Lock it in',
  asker: task => isTiles(task) ? `Tamsin · tap the tiles${task.anyOrder ? '' : ' in order'}` : `Tamsin · set the ${task.label.toLowerCase()}, then test it`,
  busted: {
    emoji: '🪨', kicker: 'Rockfall', title: 'Three slips and the drill’s stuck in the granite.',
    tip: 'Write the rule before the numbers. Neutrons = mass number − atomic number. Shells hold 2, then 8. Group = outer electrons. Charges add to zero. Exothermic warms, endothermic cools.',
    retry: 'Dig again',
  },
  burst: '💎',
  brag: (name, badge) => `I hunted lithium in Cornwall and silicon for British chips in Element Hunter. Rank: ${name} ${badge}`,
  again: 'Hunt again',
  sound: sfx.tick,
  actionMs: 800,
  Stage,
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function ElementHunter() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <PlayGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

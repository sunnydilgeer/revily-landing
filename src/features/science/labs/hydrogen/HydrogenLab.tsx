'use client'

import type { CSSProperties } from 'react'
import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { DialGame, type DialGameConfig, type Phase, type StageProps } from '../kit/DialGame'
import { n, u } from '../kit/types'
import { makeRounds, tally, type Load, type Molecule, type Scene, type Term } from './rounds'
import './HydrogenLab.css'

const PIP: Speaker = {
  name: 'Professor Pip', emoji: '🥽',
  right: ['Fizztastic! Look at those bubbles go.', 'Textbook. I’m framing that one.', 'Ooh, perfectly balanced. Chef’s kiss.', 'That’s Net Zero thinking, that is.', 'Spot on. The buses thank you.'],
  wrong: ['Whoops. That’s foam on the ceiling again.', 'Hmm, the numbers don’t add up. Goggles on, try again.', 'Not quite. Even the wind turbines sighed.', 'Fizz-fail! Back to the bench.'],
}

/** The stage's mood: calm while setting, fizzing while it runs, then happy, overflowing (too high) or flat (too low). */
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
  return <g className={`hl-tag${dial ? ' is-dial' : ''}`}>
    {dial && <rect x={left} y={y - 15} width={width} height="21" rx="6" />}
    <text x={anchor === 'middle' ? x : anchor === 'end' ? x - 6 : x + 6} y={y} textAnchor={anchor}>{text}</text>
  </g>
}

/** Rising bubbles in a column, for fizzing. */
function Bubbles({ x, y, height, count = 5 }: { x: number; y: number; height: number; count?: number }) {
  return <g className="hl-bubbles">
    {Array.from({ length: count }, (_, i) => <circle key={i} cx={x + ((i * 7) % 13) - 6} cy={y} r={2 + (i % 3)}
      style={{ animationDelay: `${i * 0.17}s`, '--rise': `${-Math.max(10, height)}px` } as CSSProperties} />)}
  </g>
}

/* ---------------------------------------------------------------- Molecule: ball and stick */

const HEAVY_GAP = 64, BOND = 40
function hAngles(count: number, index: number, length: number): number[] {
  if (length === 1) return ({ 1: [0], 2: [145, 35], 3: [90, 210, 330], 4: [45, 135, 225, 315] } as Record<number, number[]>)[count] ?? []
  const left = index === 0
  const set = ({ 1: [135], 2: [150, 210], 3: [180, 120, 240] } as Record<number, number[]>)[count] ?? []
  return left ? set : set.map(a => 180 - a)
}

function MoleculeScene({ molecule, live, mood }: { molecule: Molecule; live: string; mood: string }) {
  const length = molecule.backbone.length, cx = 160, cy = 82
  const xs = molecule.backbone.map((_, i) => cx + (i - (length - 1) / 2) * HEAVY_GAP)
  const hs = molecule.backbone.flatMap((_, i) => hAngles(molecule.h[i], i, length).map(angle => ({
    x: xs[i] + BOND * Math.cos(angle * Math.PI / 180), y: cy + BOND * Math.sin(angle * Math.PI / 180), from: xs[i],
  })))
  const key = molecule.atoms.map(([el]) => `${el} = ${({ H: 1, C: 12, N: 14, O: 16, S: 32, Mg: 24 } as Record<string, number>)[el]}`).join(' · ')
  return <svg viewBox="0 0 320 190" className={`hl-svg ${mood}`} role="img" aria-label={`A model of ${molecule.name}, ${molecule.formula}`}>
    <circle cx={cx} cy={cy} r="74" className="hl-glow" />
    {xs.slice(1).map((x, i) => <line key={`b${i}`} x1={xs[i]} y1={cy} x2={x} y2={cy} className="hl-bond" />)}
    {hs.map((h, i) => <line key={`hb${i}`} x1={h.from} y1={cy} x2={h.x} y2={h.y} className="hl-bond" />)}
    <g className="hl-molecule">
      {molecule.backbone.map((el, i) => <g key={`a${i}`} className={`hl-atom hl-atom--${el}`}>
        <circle cx={xs[i]} cy={cy} r="20" /><text x={xs[i]} y={cy + 5} textAnchor="middle">{el}</text>
      </g>)}
      {hs.map((h, i) => <g key={`h${i}`} className="hl-atom hl-atom--H">
        <circle cx={h.x} cy={h.y} r="12" /><text x={h.x} y={h.y + 5} textAnchor="middle">H</text>
      </g>)}
    </g>
    <text x={cx} y="26" textAnchor="middle" className="hl-pop">💥</text>
    <Tag x={cx} y={160} text={`Mr of ${molecule.formula} = ${live}`} dial />
    <text x={cx} y="184" textAnchor="middle" className="hl-note">{key}</text>
  </svg>
}

/* ---------------------------------------------------------------- Equation: the terms, then an atom count */

function EquationScene({ left, right, live, value, phase, mood }: { left: Term[]; right: Term[]; live: string; value: number; phase: Phase; mood: string }) {
  const term = (t: Term, i: number, all: Term[]) => <span key={i} className="hl-eq__term">
    {t.coef === null ? <span className="hl-eq__blank">{live}</span> : t.coef > 1 ? <b>{t.coef}</b> : null}
    {t.formula}{i < all.length - 1 && <span className="hl-eq__plus">+</span>}
  </span>
  const shown = phase === 'hit' || phase === 'miss'
  const l = tally(left, value), r = tally(right, value)
  const elements = Object.keys(l)
  return <div className={`hl-eq ${mood}`}>
    <p className="hl-eq__line" aria-label="The equation">{left.map(term)}<span className="hl-eq__arrow">→</span>{right.map(term)}</p>
    <div className="hl-eq__count" aria-live="polite">
      {elements.map(el => {
        const ok = l[el as keyof typeof l] === r[el as keyof typeof r]
        return <div key={el} className={shown ? (ok ? 'is-ok' : 'is-off') : ''}>
          <span className="hl-eq__el">{el} atoms</span>
          <span>{shown ? l[el as keyof typeof l] : '?'}</span><span className="hl-eq__vs">{shown ? (ok ? '=' : '≠') : '|'}</span><span>{shown ? r[el as keyof typeof r] : '?'}</span>
        </div>
      })}
    </div>
    <span className="hl-eq__pop" aria-hidden="true">💥</span>
  </div>
}

/* ---------------------------------------------------------------- Mass: a balance with a pan each side */

function MassScene({ left, right, value, live, phase, mood, answer }: { left: Load[]; right: Load[]; value: number; live: string; phase: Phase; mood: string; answer: number }) {
  const weigh = (loads: Load[]) => loads.reduce((s, l) => s + (l.grams ?? (phase === 'hit' ? answer : value)), 0)
  const tilt = phase === 'miss' ? Math.max(-12, Math.min(12, (weigh(right) - weigh(left)) / Math.max(1, weigh(left)) * 40)) : 0
  const pan = (loads: Load[], x: number) => loads.map((l, i) => <Tag key={i} x={x} y={92 - (loads.length - 1 - i) * 26}
    text={`${l.name} ${l.grams === null ? live : `${n(l.grams)} g`}`} dial={l.grams === null} />)
  return <svg viewBox="0 0 320 190" className={`hl-svg ${mood}`} role="img" aria-label="A balance: reactants on the left pan, products on the right">
    <text x="80" y="22" textAnchor="middle" className="hl-head">Reactants</text>
    <text x="240" y="22" textAnchor="middle" className="hl-head">Products</text>
    <path d="M160 120 L140 172 H180 Z" className="hl-stand" />
    <g className="hl-beam" style={{ transform: `rotate(${tilt}deg)` }}>
      <line x1="60" y1="120" x2="260" y2="120" className="hl-beam__bar" />
      <path d="M40 120 H120 L112 130 H48 Z" className="hl-pan" />
      <path d="M200 120 H280 L272 130 H208 Z" className="hl-pan" />
      <g>{pan(left, 80)}</g>
      <g>{pan(right, 240)}</g>
    </g>
    <circle cx="160" cy="120" r="5" className="hl-pivot" />
    <text x="160" y="58" textAnchor="middle" className="hl-pop">💥</text>
  </svg>
}

/* ---------------------------------------------------------------- Hofmann voltameter */

const TUBE_TOP = 36, TUBE_H = 120, TUBE_MAX = 150
const level = (cm3: number) => Math.min(TUBE_H + 10, Math.max(0, cm3) / TUBE_MAX * TUBE_H)

function CellScene({ h2, o2, total, value, live, phase, mood, answer }: { h2: number | null; o2: number | null; total?: number; value: number; live: string; phase: Phase; mood: string; answer: number }) {
  const hVol = phase === 'hit' ? answer : phase === 'set' && live === '?' ? 0 : value
  const oVol = o2 ?? (total !== undefined && (phase === 'hit' || phase === 'miss') ? Math.max(0, total - hVol) : 0)
  const oText = o2 !== null ? `${n(o2)} cm³` : total !== undefined && (phase === 'hit' || phase === 'miss') ? `${n(Math.max(0, total - hVol))} cm³` : '?'
  const tube = (x: number, gas: number, cls: string) => <g className={cls}>
    <rect x={x - 17} y={TUBE_TOP} width="34" height={TUBE_H + 20} rx="6" className="hl-tube__water" />
    <rect x={x - 17} y={TUBE_TOP} width="34" height={level(gas)} rx="6" className="hl-tube__gas" />
    {[0, 50, 100, 150].map(v => <line key={v} x1={x + 9} x2={x + 17} y1={TUBE_TOP + level(v)} y2={TUBE_TOP + level(v)} className="hl-tick" />)}
    <rect x={x - 17} y={TUBE_TOP} width="34" height={TUBE_H + 20} rx="6" className="hl-tube__glass" />
    <rect x={x - 4} y={TUBE_TOP + TUBE_H + 20} width="8" height="18" className="hl-electrode" />
    <Bubbles x={x} y={TUBE_TOP + TUBE_H + 14} height={TUBE_H - level(gas) - 6} count={cls.includes('hy') ? 6 : 3} />
  </g>
  return <svg viewBox="0 0 320 236" className={`hl-svg hl-cell ${mood}`} role="img" aria-label="Electrolysis of water: hydrogen collects over the negative electrode, oxygen over the positive">
    <path d={`M100 ${TUBE_TOP + TUBE_H + 20} V186 H220 V${TUBE_TOP + TUBE_H + 20}`} className="hl-base" />
    <rect x="152" y="18" width="16" height="168" rx="4" className="hl-tube__water" />
    <rect x="152" y="18" width="16" height="168" rx="4" className="hl-tube__glass" />
    {tube(100, hVol, 'hl-tube hl-tube--hy')}
    {tube(220, oVol, 'hl-tube hl-tube--ox')}
    <text x="100" y="24" textAnchor="middle" className="hl-head">H₂</text>
    <text x="220" y="24" textAnchor="middle" className="hl-head">O₂</text>
    <text x="100" y="208" textAnchor="middle" className="hl-sign">− electrode</text>
    <text x="220" y="208" textAnchor="middle" className="hl-sign">+ electrode</text>
    <Tag x={74} y={110} text={h2 !== null ? `${n(h2)} cm³` : live} dial={h2 === null} anchor="end" />
    <Tag x={246} y={110} text={oText} anchor="start" />
    {total !== undefined && <Tag x={160} y={230} text={`Total ${n(total)} cm³`} />}
    <text x="100" y={TUBE_TOP - 2} textAnchor="middle" className="hl-pop">💥</text>
  </svg>
}

/* ---------------------------------------------------------------- Flask and gas syringe */

function SyringeScene({ scene, live, phase, mood, answer, value }: { scene: Extract<Scene, { kind: 'syringe' }>; live: string; phase: Phase; mood: string; answer: number; value: number }) {
  const out = Math.min(1, scene.volume / 100) * 110
  const pushed = phase === 'hit' || phase === 'go' || scene.dial === 'rate' ? out : 0
  return <svg viewBox="0 0 320 200" className={`hl-svg hl-syr ${mood}`} role="img" aria-label={`Magnesium and acid in a flask, gas collected in a syringe: ${scene.volume} cm³`}>
    <path d="M38 70 V100 L14 156 Q12 164 22 164 H86 Q96 164 94 156 L70 100 V70 Z" className="hl-flask" />
    <path d="M26 132 H82 L92 156 Q94 162 86 162 H22 Q14 162 16 156 Z" className="hl-acid" />
    <rect x="40" y="148" width="26" height="6" rx="2" className="hl-mg" />
    <Bubbles x={54} y={150} height={46} count={phase === 'set' ? 2 : 7} />
    <rect x="36" y="62" width="36" height="12" rx="3" className="hl-bung" />
    <path d="M54 62 V44 H130 V82" className="hl-pipe" />
    <rect x="120" y="82" width="134" height="26" rx="4" className="hl-tube__glass" />
    <rect x="122" y="84" width={pushed} height="22" className="hl-tube__gas hl-syr__gas" />
    {[0, 20, 40, 60, 80, 100].map(v => <g key={v}><line x1={122 + v * 1.1} x2={122 + v * 1.1} y1="82" y2="90" className="hl-tick" /></g>)}
    <g className="hl-plunger" style={{ transform: `translateX(${pushed}px)` }}>
      <rect x="124" y="85" width="6" height="20" className="hl-plunger__head" />
      <line x1="127" y1="95" x2="190" y2="95" className="hl-plunger__rod" />
      <rect x="188" y="84" width="6" height="22" rx="2" className="hl-plunger__head" />
    </g>
    <text x="187" y="76" textAnchor="middle" className="hl-note">gas syringe (cm³)</text>
    <text x="12" y="186" className="hl-note">{scene.note}</text>
    <text x="54" y="40" textAnchor="middle" className="hl-pop">💥</text>
    {scene.readings
      ? <>{scene.readings.map(([t, v], i) => <Tag key={i} x={232} y={136 + i * 24} text={`${t} s → ${v} cm³`} />)}
        <Tag x={232} y={190} text={`Rate = ${live}`} dial /></>
      : <><Tag x={190} y={136} text={`Volume ${n(scene.volume)} cm³`} />
        <Tag x={190} y={162} text={`Time ${scene.dial === 'time' ? live : `${n(scene.time ?? 0)} s`}`} dial={scene.dial === 'time'} />
        {scene.dial === 'rate' && <Tag x={190} y={188} text={`Rate = ${live}`} dial />}</>}
    {phase === 'miss' && scene.dial === 'time' && <text x="300" y="30" textAnchor="end" className="hl-note">{value > answer ? 'too slow' : 'too fast'}</text>}
  </svg>
}

/* ---------------------------------------------------------------- The town: buses and CO₂ clouds */

function TownScene({ before, percent, value, live, phase, mood, answer }: { before: number; percent: number; value: number; live: string; phase: Phase; mood: string; answer: number }) {
  const saved = phase === 'hit' ? answer : phase === 'miss' ? value : 0
  const gone = Math.max(0, Math.min(20, Math.round(saved / before * 20)))
  return <svg viewBox="0 0 320 200" className={`hl-svg hl-town ${mood}`} role="img" aria-label={`The town's buses: ${n(before)} tonnes of CO₂ a year, cut by ${percent}%`}>
    {Array.from({ length: 20 }, (_, i) => <text key={i} x={28 + (i % 10) * 29} y={30 + Math.floor(i / 10) * 30} textAnchor="middle"
      className={`hl-cloud${i < gone ? ' is-gone' : ''}`} style={{ transitionDelay: `${i * 30}ms` }}>☁️</text>)}
    <text x="160" y="96" textAnchor="middle" className="hl-head">CO₂ a year</text>
    <line x1="10" y1="140" x2="310" y2="140" className="hl-road" />
    {[60, 160, 260].map((x, i) => <g key={x} className="hl-bus" style={{ animationDelay: `${i * 0.12}s` }}>
      <text x={x} y="134" textAnchor="middle" className="hl-bus__emoji">🚌</text>
      <text x={x + 26} y="128" textAnchor="middle" className="hl-bus__puff">💧</text>
    </g>)}
    <Tag x={84} y={166} text={`Before ${n(before)} t`} />
    <Tag x={236} y={166} text={`Cut ${percent}%`} />
    <Tag x={160} y={192} text={`Saved = ${live}`} dial />
    <text x="160" y="70" textAnchor="middle" className="hl-pop">💥</text>
  </svg>
}

function Stage({ task, value, phase }: StageProps<Scene>) {
  const live = phase === 'hit' ? u(task.answer, task.unit) : phase === 'set' && value === task.start ? '?' : u(value, task.unit)
  const mood = moodFor(phase, value, task.answer)
  const s = task.scene
  const shown = phase === 'hit' ? task.answer : value
  if (s.kind === 'molecule') return <MoleculeScene molecule={s.molecule} live={live} mood={mood} />
  if (s.kind === 'equation') return <EquationScene left={s.left} right={s.right} live={live} value={shown} phase={phase} mood={mood} />
  if (s.kind === 'mass') return <MassScene left={s.left} right={s.right} value={value} live={live} phase={phase} mood={mood} answer={task.answer} />
  if (s.kind === 'cell') return <CellScene h2={s.h2} o2={s.o2} total={s.total} value={value} live={live} phase={phase} mood={mood} answer={task.answer} />
  if (s.kind === 'syringe') return <SyringeScene scene={s} live={live} phase={phase} mood={mood} answer={task.answer} value={value} />
  return <TownScene before={s.before} percent={s.percent} value={value} live={live} phase={phase} mood={mood} answer={task.answer} />
}

const config: DialGameConfig<Scene> = {
  labId: 'science-hydrogen',
  name: 'Green Hydrogen Lab',
  speaker: PIP,
  intros: [
    'Welcome to the lab! Offshore wind in, hydrogen out. First rule of chemistry: know what everything weighs.',
    'Atoms are like my socks: you never lose any, they just end up somewhere else. Let’s balance some equations.',
    'The turbines are spinning, the current’s flowing. Time to split some water. Watch those bubbles!',
    'The wind’s dropped! Backup plan: magnesium and acid. How fast can we make hydrogen?',
    'Big day. The inspector wants the rates practical, then the mayor wants to know how much CO₂ we’ve saved.',
  ],
  ranks: [
    { badge: '🧪', name: 'Net Zero Hero', line: 'Not a single bubble out of place. The town runs on your hydrogen.' },
    { badge: '⚗️', name: 'Lab Chemist', line: 'A little foam on the ceiling, but the buses are rolling.' },
    { badge: '🥽', name: 'Lab Assistant', line: 'You got there. Pip kept the fire blanket handy, though.' },
    { badge: '🛢️', name: 'Diesel Fan', line: 'The buses are still belching CO₂. Back to the bench.' },
  ],
  rule: ['Mr: add the Ar of every atom. The small number counts the atom before it.', 'Balance with the big numbers. Mass in = mass out. Water splits into H₂ : O₂ = 2 : 1.', 'Mean rate = amount of product ÷ time. Faster rate, less time.'],
  start: 'Goggles on',
  action: 'Run it',
  asker: task => `Pip · set the ${task.label.length > 3 ? task.label.charAt(0).toLowerCase() + task.label.slice(1) : task.label}, then run it`,
  busted: {
    emoji: '🧯', kicker: 'Lab evacuated', title: 'Three fizz-ups. The fire alarm’s going off.',
    tip: 'Write the rule first, then the numbers. Mr: count × Ar for each element, then add. Water gives twice as much hydrogen as oxygen. Rate = amount ÷ time.',
    retry: 'Mop up and try again',
  },
  burst: '🫧',
  brag: (name, badge) => `I fuelled a whole town’s buses in the Green Hydrogen Lab. Rank: ${name} ${badge}`,
  again: 'Run the plant again',
  sound: sfx.bubble,
  actionMs: 800,
  Stage,
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function HydrogenLab() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <DialGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

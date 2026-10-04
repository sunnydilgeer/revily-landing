'use client'

import type { ReactNode } from 'react'
import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { DialGame, type DialGameConfig, type Phase, type StageProps } from '../kit/DialGame'
import { n, u } from '../kit/types'
import { makeRounds, type Scene } from './rounds'
import './RiverRescue.css'

const DEV: Speaker = {
  name: 'Inspector Dev Sandhu', emoji: '🧑🏽‍🔬',
  right: ['Water-ful work! The trout are clapping.', 'Crystal clear. Just like that answer.', 'That’s the stuff. Case closed, current flowing.', 'Spot on. And I mean that chromatographically.', 'Brilliant. I’d swim in that result.'],
  wrong: ['Hmm, that answer’s a bit murky.', 'Not quite. The ducks look unimpressed.', 'Oof. That’s gone straight down the drain.', 'Nope. Even the sludge is judging us.'],
}

/** The scene's mood: calm while setting, flowing while it runs, then clear, overflowing (too high) or thin (too low). */
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
  return <g className={`rr-tag${dial ? ' is-dial' : ''}`}>
    {dial && <rect x={left} y={y - 15} width={width} height="21" rx="6" />}
    <text x={anchor === 'middle' ? x : anchor === 'end' ? x - 6 : x + 6} y={y} textAnchor={anchor}>{text}</text>
  </g>
}

/** The river along the bottom of every scene: murky until the job is done, then clear with a fish. */
function River({ y, height = 26 }: { y: number; height?: number }) {
  return <g className="rr-river" aria-hidden="true">
    <path d={`M0 ${y} Q40 ${y - 5} 80 ${y} T160 ${y} T240 ${y} T320 ${y} V${y + height} H0 Z`} className="rr-river__water" />
    <path d={`M20 ${y + 10} q12 -4 24 0 M140 ${y + 14} q12 -4 24 0 M250 ${y + 9} q12 -4 24 0`} className="rr-river__ripple" />
    <text x="250" y={y + height - 4} className="rr-river__fish">🐟</text>
    <text x="70" y={y + height - 4} className="rr-river__scum">🫧</text>
  </g>
}

/** The verdict that pops up: too much (overflow) or too little (thin). */
function Verdict({ x, y, mood }: { x: number; y: number; mood: string }) {
  if (mood !== 'is-high' && mood !== 'is-low') return null
  return <text x={x} y={y} textAnchor="end" className="rr-verdict">{mood === 'is-high' ? 'too much ⬆' : 'too little ⬇'}</text>
}

function Frame({ label, height, mood, children }: { label: string; height: number; mood: string; children: ReactNode }) {
  return <svg viewBox={`0 0 320 ${height}`} className={`rr-svg ${mood}`} role="img" aria-label={label}>
    {children}
    <River y={height - 26} />
    <Verdict x={314} y={18} mood={mood} />
  </svg>
}

/* ---------------------------------------------------------------- Formulation: a bar split into a part and the rest */

function FormulaScene({ s, shown, live, mood }: { s: Extract<Scene, { kind: 'formula' }>; shown: number; live: string; mood: string }) {
  const frac = s.percent === null ? shown / 100 : shown / s.total
  const known = (s.percent ?? 0) / 100
  const width = 260 * Math.max(0, Math.min(1.08, live === '?' ? 0 : frac))
  return <Frame label={`A ${s.total} g sample split into ${s.name.toLowerCase()} and everything else`} height={200} mood={mood}>
    <text x="30" y="44" className="rr-emoji">{s.emoji}</text>
    <Tag x={180} y={36} text={`Sample ${n(s.total)} g`} />
    <rect x="30" y="64" width="260" height="34" rx="8" className="rr-bar" />
    <rect x="30" y="64" width={width} height="34" rx="8" className="rr-bar__part" />
    {s.percent !== null && <line x1={30 + 260 * known} x2={30 + 260 * known} y1="58" y2="104" className="rr-bar__mark" />}
    {[0, 25, 50, 75, 100].map(p => <text key={p} x={30 + 2.6 * p} y="118" textAnchor="middle" className="rr-note">{p}%</text>)}
    <Tag x={90} y={150} text={`${s.name} ${s.part === null ? live : `${n(s.part)} g`}`} dial={s.part === null} />
    <Tag x={236} y={150} text={s.percent === null ? `= ${live}` : `= ${s.percent}%`} dial={s.percent === null} />
  </Frame>
}

/* ---------------------------------------------------------------- Chromatography paper */

const BASE = 150, CM = 10, PX = 70
/** The paper: on Rf jobs the spot sits where it ran and a ghost ring shows where the dialled Rf would put it; on distance jobs the spot climbs to the dial. */
function ChromaScene({ s, shown, live, mood, set }: { s: Extract<Scene, { kind: 'chroma' }>; shown: number; live: string; mood: string; set: boolean }) {
  const y = (cm: number) => BASE - Math.max(0, Math.min(12.5, cm)) * CM
  const frontY = y(s.front)
  const dialCm = set && live === '?' ? 0 : s.rf === null ? shown * s.front : shown
  const spotY = s.spot !== null ? y(s.spot) : y(dialCm)
  return <Frame label={`A chromatography paper: the solvent front moved ${s.front} cm`} height={204} mood={mood}>
    <rect x={PX - 32} y="20" width="64" height="146" rx="3" className="rr-paper" />
    <rect x={PX - 32} y={frontY} width="64" height={BASE - frontY + 16} className="rr-paper__wet" />
    <line x1={PX - 32} x2={PX + 32} y1={frontY} y2={frontY} className="rr-front" />
    <line x1={PX - 32} x2={PX + 32} y1={BASE} y2={BASE} className="rr-start" />
    <path d={`M${PX - 42} 160 H${PX + 42} V176 H${PX - 42} Z`} className="rr-solvent" />
    {s.rf === null && !set && <circle cx={PX} cy={y(dialCm)} r="9" className="rr-ghost" />}
    <circle cx={PX} cy={spotY} r="7" className="rr-spot" />
    {[0, 5, 10].map(cm => <g key={cm}><line x1={PX - 40} x2={PX - 34} y1={y(cm)} y2={y(cm)} className="rr-tick" />
      <text x={PX - 44} y={y(cm) + 5} textAnchor="end" className="rr-note">{cm}</text></g>)}
    <text x={PX - 44} y="16" textAnchor="end" className="rr-note">cm</text>
    <path d={`M${PX + 32} ${frontY} L132 40`} className="rr-pointer" />
    <Tag x={132} y={44} text={`Solvent front ${n(s.front)} cm`} anchor="start" />
    <path d={`M${PX + 9} ${spotY} L132 76`} className="rr-pointer" />
    <Tag x={132} y={80} text={`Spot ${s.spot === null ? live : `${n(s.spot)} cm`}`} dial={s.spot === null} anchor="start" />
    <Tag x={132} y={116} text={`Rf ${s.rf === null ? live : n(s.rf)}`} dial={s.rf === null} anchor="start" />
    <text x="138" y="146" className="rr-note">pencil start line ↙</text>
  </Frame>
}

/* ---------------------------------------------------------------- pH: indicator bar with a marker */

const PH_COLOURS = ['var(--rv-redpen)', 'var(--rv-step-i)', 'var(--rv-yellow)', 'var(--rv-good)', 'var(--rv-teal)', 'var(--rv-biro)', 'var(--rv-step-b)']
function PhBar({ y, ph, cls = 'rr-ph__marker' }: { y: number; ph: number | null; cls?: string }) {
  const x = (p: number) => 20 + p / 14 * 280
  return <g>
    <defs><linearGradient id="rr-ph" x1="0" x2="1">{PH_COLOURS.map((c, i) => <stop key={i} offset={i / (PH_COLOURS.length - 1)} stopColor={c} />)}</linearGradient></defs>
    <rect x="20" y={y} width="280" height="18" rx="9" fill="url(#rr-ph)" className="rr-ph" />
    {[0, 7, 14].map(p => <text key={p} x={x(p)} y={y + 36} textAnchor="middle" className="rr-note">{p}</text>)}
    <text x={x(2)} y={y + 36} textAnchor="middle" className="rr-note">acid</text>
    <text x={x(12)} y={y + 36} textAnchor="middle" className="rr-note">alkali</text>
    {ph !== null && <path d={`M${x(ph)} ${y - 2} l-7 -12 h14 Z`} className={cls} />}
  </g>
}

function PhScene({ readings, shown, live, mood, set }: { readings: number[]; shown: number; live: string; mood: string; set: boolean }) {
  return <Frame label={`pH readings of mine water: ${readings.map(r => n(r)).join(', ')}`} height={200} mood={mood}>
    <text x="22" y="40" className="rr-emoji">⛏️</text>
    {readings.map((r, i) => <Tag key={i} x={110 + i * 64} y={34} text={n(r)} />)}
    <text x="174" y="56" textAnchor="middle" className="rr-note">probe readings</text>
    <PhBar y={90} ph={set && live === '?' ? null : Math.max(0, Math.min(14, shown))} />
    <Tag x={160} y={160} text={`Mean pH ${live}`} dial />
  </Frame>
}

function LimeScene({ s, shown, live, mood, phase, answer }: { s: Extract<Scene, { kind: 'lime' }>; shown: number; live: string; mood: string; phase: Phase; answer: number }) {
  // The pond's pH after the lime goes in: 7 on the dot when right, under 7 short, over 7 too much.
  const ph = phase === 'hit' ? 7 : phase === 'miss' ? Math.max(0, Math.min(14, 7 + (shown - answer) / answer * 6)) : s.startPh
  return <Frame label={`A settling pond of ${n(s.litres)} litres of acid mine water`} height={200} mood={mood}>
    <text x="22" y="40" className="rr-emoji">🪣</text>
    <Tag x={180} y={28} text={`${s.rate} kg per 1,000 litres`} />
    <Tag x={180} y={54} text={`Pond ${n(s.litres)} litres`} />
    <PhBar y={86} ph={ph} />
    <Tag x={160} y={156} text={`Lime ${live}`} dial />
  </Frame>
}

/* ---------------------------------------------------------------- Waterworks: river → filter beds → sterilise → homes */

function BedsScene({ s, shown, live, mood, set }: { s: Extract<Scene, { kind: 'beds' }>; shown: number; live: string; mood: string; set: boolean }) {
  const on = set && live === '?' ? 0 : Math.max(0, Math.min(20, Math.round(shown)))
  return <Frame label={`A waterworks needing ${n(s.need)} cubic metres an hour, ${s.each} per filter bed`} height={214} mood={mood}>
    <Tag x={160} y={24} text={`Need ${n(s.need)} m³ an hour`} />
    <text x="10" y="76" className="rr-emoji">🏞️</text>
    <path d="M44 70 H60 M260 70 H276" className="rr-pipe" />
    {Array.from({ length: 20 }, (_, i) => <rect key={i} x={64 + (i % 10) * 19.5} y={46 + Math.floor(i / 10) * 26} width="16" height="20" rx="3"
      className={`rr-bed${i < on ? ' is-on' : ''}`} style={{ transitionDelay: `${i * 25}ms` }} />)}
    <text x="282" y="64" className="rr-emoji rr-emoji--sm">🧪</text>
    <text x="282" y="92" className="rr-emoji rr-emoji--sm">🏠</text>
    <text x="160" y="116" textAnchor="middle" className="rr-note">filter beds · then chlorine · then homes</text>
    <Tag x={90} y={150} text={`${s.each} m³ each`} />
    <Tag x={230} y={150} text={`Running ${live}`} dial />
  </Frame>
}

function TankScene({ s, shown, live, mood, set }: { s: Extract<Scene, { kind: 'tank' }>; shown: number; live: string; mood: string; set: boolean }) {
  const depth = set && live === '?' ? 0 : Math.max(0, Math.min(70, shown / 300 * 70))
  return <Frame label={`A settling tank: ${s.inflow} tonnes in, ${s.outflow} tonnes of liquid out`} height={210} mood={mood}>
    <path d="M60 40 V140 H260 V40" className="rr-tank" />
    <rect x="62" y="60" width="196" height="78" className="rr-tank__liquid" />
    <rect x="62" y={138 - depth} width="196" height={depth} className="rr-tank__sludge" />
    <path d="M14 52 H62 M258 64 H306" className="rr-pipe" />
    <Tag x={36} y={40} text={`${s.inflow} t in`} />
    <Tag x={284} y={52} text={`${s.outflow} t out`} />
    <Tag x={160} y={164} text={`Sludge ${live}`} dial />
  </Frame>
}

/* ---------------------------------------------------------------- The practical: an evaporating dish on a balance */

function DishScene({ s, shown, live, mood, set }: { s: Extract<Scene, { kind: 'dish' }>; shown: number; live: string; mood: string; set: boolean }) {
  const pile = set && live === '?' ? 0 : Math.max(0, Math.min(16, shown * 5))
  return <Frame label={`An evaporating dish on a balance: ${n(s.before)} g empty, ${n(s.after)} g after evaporating ${s.sample} cm³`} height={214} mood={mood}>
    <g className="rr-steam" aria-hidden="true"><text x="140" y="34">♨️</text></g>
    <path d="M110 70 Q160 110 210 70 Z" className="rr-dish" />
    <ellipse cx="160" cy={78} rx={pile * 1.8} ry={pile / 2.2} className="rr-residue" />
    <rect x="96" y="96" width="128" height="40" rx="6" className="rr-balance" />
    <text x="160" y="122" textAnchor="middle" className="rr-balance__read">{n(s.after)} g</text>
    <Tag x={60} y={40} text={`Empty ${n(s.before)} g`} />
    <Tag x={262} y={40} text={`${s.sample} cm³`} />
    <Tag x={160} y={164} text={`Solids ${live}`} dial />
  </Frame>
}

function LitreScene({ s, shown, live, mood, set }: { s: Extract<Scene, { kind: 'litre' }>; shown: number; live: string; mood: string; set: boolean }) {
  const k = 1000 / s.sample
  const fill = set && live === '?' ? 0 : Math.max(0, Math.min(1.1, shown / (s.solids * k)))
  return <Frame label={`Scaling ${s.sample} cubic centimetres of river water up to a litre`} height={214} mood={mood}>
    <Tag x={70} y={30} text={`${s.sample} cm³ → ${n(s.solids)} g`} />
    <path d="M220 24 V136 Q220 146 230 146 H282 Q292 146 292 136 V24" className="rr-tank" />
    <rect x="222" y={144 - 118 * Math.min(1, fill)} width="68" height={118 * Math.min(1, fill)} className="rr-litre" />
    <text x="256" y="18" textAnchor="middle" className="rr-note">1,000 cm³</text>
    {Array.from({ length: Math.min(20, k) }, (_, i) => <rect key={i} x={28 + (i % 5) * 32} y={50 + Math.floor(i / 5) * 22} width="24" height="16" rx="3"
      className={`rr-cup${i < Math.round(fill * k) ? ' is-on' : ''}`} />)}
    <text x="100" y="146" textAnchor="middle" className="rr-note">{k} samples make a litre</text>
    <Tag x={160} y={170} text={`Per litre ${live}`} dial />
  </Frame>
}

function Stage({ task, value, phase }: StageProps<Scene>) {
  const set = phase === 'set' && value === task.start
  const live = phase === 'hit' ? u(task.answer, task.unit) : set ? '?' : u(value, task.unit)
  const mood = moodFor(phase, value, task.answer)
  const shown = phase === 'hit' ? task.answer : value
  const s = task.scene
  const props = { shown, live, mood, set }
  if (s.kind === 'formula') return <FormulaScene s={s} {...props} />
  if (s.kind === 'chroma') return <ChromaScene s={s} {...props} />
  if (s.kind === 'ph') return <PhScene readings={s.readings} {...props} />
  if (s.kind === 'lime') return <LimeScene s={s} {...props} phase={phase} answer={task.answer} />
  if (s.kind === 'beds') return <BedsScene s={s} {...props} />
  if (s.kind === 'tank') return <TankScene s={s} {...props} />
  if (s.kind === 'dish') return <DishScene s={s} {...props} />
  return <LitreScene s={s} {...props} />
}

/** "Spot distance" → "spot distance", but symbols like "Rf" stay as they are. */
const lower = (label: string) => label.length > 3 && /^[A-Z][a-z]/.test(label) ?label.charAt(0).toLowerCase() + label.slice(1) : label

const config: DialGameConfig<Scene> = {
  labId: 'science-river',
  name: 'River Rescue',
  speaker: DEV,
  intros: [
    'Morning, rookie! Inspector Dev Sandhu, Environment Agency. Something’s foaming in the river, and wild-swimming season starts Saturday. First: what’s actually in this stuff?',
    'A mystery dye is staining the water. Three factories upstream, one culprit. Chromatography will tell us who. Let’s make them dye of embarrassment.',
    'Orange water from an old mine. That’s acid, I’d bet my wellies on it. Let’s measure the pH and neutralise it.',
    'The river’s cleaner. Now the town needs drinking water, and the sewage works needs a check-up. Let’s go with the flow.',
    'Final test before the swimmers dive in. Required practical: is this water fit to drink? No pressure. Well, some water pressure.',
  ],
  ranks: [
    { badge: '🏞️', name: 'Chief Environment Scientist', line: 'Spotless. The river sparkles and the swimmers are in.' },
    { badge: '🔬', name: 'Senior Water Analyst', line: 'A couple of splashes, but you cracked the case.' },
    { badge: '🥾', name: 'Field Sampler', line: 'Muddy wellies, but you got there. Dev’s proud.' },
    { badge: '🦆', name: 'Duck Pond Paddler', line: 'The river’s still murky. Wade back in and try again.' },
  ],
  rule: ['Percentage = part ÷ total × 100. A pure substance is one element or compound.', 'Rf = spot distance ÷ solvent distance. Same dye, same Rf.', 'Below pH 7 is acid. Filter, then sterilise. Solids = dish after − dish before.'],
  start: 'Wellies on',
  action: 'Test it',
  asker: task => `Dev · set the ${lower(task.label)}, then test it`,
  busted: {
    emoji: '🚱', kicker: 'River closed', title: 'Three slips. The “No swimming” signs are going up.',
    tip: 'Write the rule first, then the numbers. Percentage = part ÷ total × 100. Rf = spot ÷ solvent front, measured from the start line. Mean = total ÷ how many.',
    retry: 'Grab a fresh sample',
  },
  burst: '💧',
  brag: (name, badge) => `I traced the polluter and made the river safe in River Rescue. Rank: ${name} ${badge}`,
  again: 'Rescue another river',
  sound: sfx.bubble,
  actionMs: 800,
  Stage,
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function RiverRescue() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <DialGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

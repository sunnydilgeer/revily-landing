'use client'

import type { CSSProperties, ReactNode } from 'react'
import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { PlayGame, type PlayGameConfig, type PlayStageProps } from '../kit/PlayGame'
import { isTiles } from '../kit/tiles'
import { n, u } from '../kit/types'
import { STAGES, STEPS, makeRounds, type Dye, type GasId, type Sample, type Scene, type StageId, type StepId } from './rounds'
import './RiverRescue.css'

const DEV: Speaker = {
  name: 'Inspector Dev Sandhu', emoji: '🧑🏽‍🔬',
  right: ['Water-ful work! The trout are clapping.', 'Crystal clear. Just like that answer.', 'That’s the stuff. Case closed, current flowing.', 'Spot on. And I mean that chromatographically.', 'Brilliant. I’d swim in that result.'],
  wrong: ['Hmm, that answer’s a bit murky.', 'Not quite. The ducks look unimpressed.', 'Oof. That’s gone straight down the drain.', 'Nope. Even the sludge is judging us.'],
}

const H = 270, RIVER_Y = 240
const ORDER = ['pure', 'chroma', 'acid', 'treat', 'boss']

/* ---------------------------------------------------------------- The river: murky at the start, sparkling by the end */

/** One fish. The jump animates an inner group so the outer translate stays put. */
function Fish({ x, y, jump, flip }: { x: number; y: number; jump: boolean; flip: boolean }) {
  return <g transform={`translate(${x} ${y})${flip ? ' scale(-1 1)' : ''}`}><g className={jump ? 'rr-jump' : 'rr-bob'}>
    <path d="M-10 0 Q-2 -7 8 0 Q-2 7 -10 0 Z" className="rr-fish" />
    <path d="M-10 0 L-16 -5 V5 Z" className="rr-fish" />
    <circle cx="4" cy="-1.2" r="1.3" className="rr-fish__eye" />
  </g></g>
}

/** Ten jobs clean the river: the water clears, litter goes, fish come back. */
function River({ progress, jump }: { progress: number; jump: boolean }) {
  const y = RIVER_Y, clean = Math.round(progress * 10)
  const fish = Math.floor(clean / 2), junk = 5 - fish
  return <g className="rr-river" aria-hidden="true">
    <path d={`M0 ${y} Q40 ${y - 5} 80 ${y} T160 ${y} T240 ${y} T320 ${y} V${H} H0 Z`} className="rr-river__water"
      style={{ fill: `color-mix(in srgb, var(--rv-teal) ${clean}%, color-mix(in srgb, var(--rv-yellow-deep) 55%, var(--rv-ink-2)))` }} />
    <g className="rr-river__ripples"><path d={`M14 ${y + 9} q12 -4 24 0 M134 ${y + 14} q12 -4 24 0 M246 ${y + 8} q12 -4 24 0`} className="rr-river__ripple" /></g>
    {Array.from({ length: junk }, (_, i) => <g key={`j${i}`} transform={`translate(${290 - i * 58} ${y + 15})`}>
      {i % 2 ? <rect x="-7" y="-4" width="14" height="8" rx="2" className="rr-junk" /> : <circle r="5" className="rr-junk" />}
    </g>)}
    {Array.from({ length: fish }, (_, i) => <Fish key={`f${i}`} x={34 + i * 58} y={y + 16 - (i % 2) * 4} flip={i % 2 === 1} jump={jump && i === fish - 1} />)}
  </g>
}

function Frame({ label, mood, progress, verdict, children }: { label: string; mood: string; progress: number; verdict?: string; children: ReactNode }) {
  return <svg viewBox={`0 0 320 ${H}`} className={`rr-svg ${mood}`} role="img" aria-label={label}>
    {children}
    <River progress={progress} jump={mood.includes('is-hit')} />
    {verdict && <g className="rr-verdict"><rect x={318 - verdict.length * 7.6 - 14} y="2" width={verdict.length * 7.6 + 14} height="22" rx="11" /><text x={311} y={18} textAnchor="end">{verdict}</text></g>}
  </svg>
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

/* ---------------------------------------------------------------- Round 1: the sample shelf and the fertiliser scoop */

const TINT: Record<string, string> = {
  water: 'var(--rv-teal-tint)', clear: 'var(--rv-surface)', copper: 'var(--rv-step-i)', white: 'var(--rv-surface)', sea: 'var(--rv-teal)',
  juice: 'var(--rv-yellow)', steel: 'var(--rv-line-strong)', cleaner: 'var(--rv-step-b-light)', river: 'color-mix(in srgb, var(--rv-yellow-deep) 60%, var(--rv-good))',
}

function Vessel({ s, x, y }: { s: Sample; x: number; y: number }) {
  const tint = TINT[s.tint] ?? 'var(--rv-surface)'
  if (s.look === 'liquid') return <g transform={`translate(${x} ${y})`}>
    <path d="M-8 -30 V-16 L-24 18 Q-26 24 -20 24 H20 Q26 24 24 18 L8 -16 V-30" className="rr-glass" />
    <path d="M-17 4 L-24 18 Q-26 24 -20 24 H20 Q26 24 24 18 L17 4 Z" style={{ fill: tint }} className="rr-liquid" />
  </g>
  if (s.look === 'gas') return <g transform={`translate(${x} ${y})`}>
    <rect x="-18" y="-26" width="36" height="50" rx="4" className="rr-glass" />
    <rect x="-22" y="-32" width="44" height="7" rx="2" className="rr-lid" />
    <path d="M-10 -8 q5 -6 10 0 t10 0 M-10 8 q5 -6 10 0 t10 0" className="rr-swirl" />
  </g>
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-28 12 Q0 30 28 12 Z" className="rr-glass" />
    {[-12, 0, 12, -6, 6].map((dx, i) => <rect key={i} x={dx - 6} y={i < 3 ? 2 : -8} width="12" height="10" rx="3" style={{ fill: tint }} className="rr-lump" />)}
  </g>
}

function ShelfScene({ s, picked, phase, mood, progress }: { s: Extract<Scene, { kind: 'shelf' }>; picked: string[]; phase: string; mood: string; progress: number }) {
  const inTray = phase === 'hit' ? s.samples.filter(x => x.pure).map(x => x.value) : picked
  const nameOf = (v: string) => s.samples.find(x => x.value === v)?.label ?? v
  return <Frame label="Six samples on a shelf, and a tray for the pure ones" mood={mood} progress={progress} verdict={phase === 'miss' ? 'not both pure' : undefined}>
    {s.samples.map((sample, i) => {
      const cx = 56 + (i % 3) * 104, cy = 46 + Math.floor(i / 3) * 90
      const on = inTray.includes(sample.value)
      const bad = phase === 'miss' && on && !sample.pure
      return <g key={sample.value} className={`rr-cell${on ? ' is-on' : ''}${bad ? ' is-bad' : ''}${phase === 'hit' && sample.pure ? ' is-good' : ''}`}>
        <rect x={cx - 50} y={cy - 40} width="100" height="84" rx="12" className="rr-cell__card" />
        <Vessel s={sample} x={cx} y={cy - 2} />
        <text x={cx} y={cy + 38} textAnchor="middle" className="rr-cell__name" {...(sample.label.length > 12 ? { textLength: 92, lengthAdjust: 'spacingAndGlyphs' } : {})}>{sample.label}</text>
      </g>
    })}
    <g className={`rr-tray is-${phase}`}>
      <rect x="8" y="196" width="304" height="36" rx="10" />
      <text x="20" y="219" className="rr-tray__label">PURE</text>
      {[0, 1].map(k => <g key={k} className={inTray[k] ? 'rr-chip is-on' : 'rr-chip'}>
        <rect x={66 + k * 122} y="202" width="114" height="24" rx="12" />
        <text x={66 + k * 122 + 57} y="219" textAnchor="middle">{inTray[k] ? nameOf(inTray[k]) : '?'}</text>
      </g>)}
    </g>
  </Frame>
}

function ScoopScene({ s, shown, live, mood, progress, verdict }: { s: Extract<Scene, { kind: 'scoop' }>; shown: number; live: string; mood: string; progress: number; verdict?: string }) {
  const lit = live === '?' ? 0 : Math.max(0, Math.min(100, Math.round(shown / s.total * 100)))
  return <Frame label={`A ${s.total} g scoop of fertiliser drawn as 100 squares, ${s.percent}% nitrate`} mood={mood} progress={progress} verdict={verdict}>
    <text x="90" y="22" textAnchor="middle" className="rr-head">{s.total} g scoop</text>
    {Array.from({ length: 100 }, (_, i) => {
      const nitrate = i < s.percent
      return <rect key={i} x={20 + (i % 10) * 14.2} y={32 + Math.floor(i / 10) * 14.2} width="12.4" height="12.4" rx="2.5"
        className={`rr-sq${nitrate ? ' is-nitrate' : ''}${i < lit ? ' is-lit' : ''}`} style={{ transitionDelay: `${(i % 10) * 12}ms` }} />
    })}
    <rect x="172" y="34" width="14" height="14" rx="3" className="rr-sq is-nitrate" />
    <text x="192" y="46" className="rr-note">nitrate {s.percent}%</text>
    <Tag x={244} y={86} text={`1 square = 1%`} />
    <Tag x={244} y={112} text={`= ${n(s.total / 100)} g`} />
    <Tag x={244} y={164} text={`Nitrate ${live}`} dial />
    <text x="244" y="196" textAnchor="middle" className="rr-note">{lit} squares lit</text>
  </Frame>
}

/* ---------------------------------------------------------------- Round 2: the chromatogram */

const DYE: Record<Dye, string> = { b: 'var(--rv-step-b)', i: 'var(--rv-step-i)', as: 'var(--rv-step-as)', biro: 'var(--rv-biro)', good: 'var(--rv-good)' }
const START = 186, FRONT = 44

/** A spot that climbs up from the start line when the paper first appears. */
function Spot({ x, y, dye, r = 8, cls = '' }: { x: number; y: number; dye: Dye; r?: number; cls?: string }) {
  return <g className="rr-rise" style={{ '--rise': `${START - y}px` } as CSSProperties}>
    <ellipse cx={x} cy={y} rx={r} ry={r * .8} style={{ fill: DYE[dye] }} className={`rr-spot ${cls}`} />
  </g>
}

function ChromaScene({ s, picked, phase, mood, progress, shown, live, verdict }: { s: Extract<Scene, { kind: 'chroma' }>; picked: string[]; phase: string; mood: string; progress: number; shown: number; live: string; verdict?: string }) {
  const y = (cm: number) => START - cm * (START - FRONT) / s.front
  const culprit = (k: number) => s.factories.find(f => f.cm === s.river[k].cm && f.dye === s.river[k].dye)!
  if (s.mode === 'rf') {
    const f = culprit(0), ghostY = y(Math.max(0, Math.min(1.05, shown)) * s.front)
    return <Frame label={`Chromatogram: river spot ${s.river[0].cm} cm, solvent front ${s.front} cm`} mood={mood} progress={progress} verdict={verdict}>
      <rect x="30" y="14" width="120" height="196" rx="4" className="rr-paper" />
      <rect x="30" y={FRONT} width="120" height={START - FRONT + 24} className="rr-paper__wet" />
      <line x1="30" x2="150" y1={FRONT} y2={FRONT} className="rr-front" />
      <line x1="30" x2="150" y1={START} y2={START} className="rr-start" />
      <rect x="22" y="200" width="136" height="20" rx="4" className="rr-solvent" />
      <text x="72" y="32" textAnchor="middle" className="rr-lane">River</text>
      <text x="124" y="32" textAnchor="middle" className="rr-lane">{f.letter}</text>
      {s.river.map((spot, k) => <Spot key={k} x={72} y={y(spot.cm)} dye={spot.dye} cls={k ? 'is-dim' : ''} />)}
      <Spot x={124} y={y(f.cm)} dye={f.dye} />
      {live !== '?' && <ellipse cx="72" cy={ghostY} rx="12" ry="10" className="rr-ghost" />}
      <path d={`M18 ${START} V${FRONT}`} className="rr-measure" markerEnd="url(#rr-arrow)" />
      <path d={`M50 ${START} V${y(s.river[0].cm) + 8}`} className="rr-measure is-spot" />
      <defs><marker id="rr-arrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 Z" className="rr-arrowhead" /></marker></defs>
      <Tag x={168} y={56} text={`Front ${s.front} cm`} anchor="start" />
      <Tag x={168} y={92} text={`Spot ${s.river[0].cm} cm`} anchor="start" />
      <Tag x={168} y={140} text={`Rf ${live}`} dial anchor="start" />
      <text x="174" y="184" className="rr-note">both from the</text>
      <text x="174" y="200" className="rr-note">pencil line</text>
    </Frame>
  }
  const laneX = (k: number) => 132 + k * 48
  const shownPicks = phase === 'hit' ? [culprit(0).letter, culprit(1).letter] : picked
  const wrong = phase === 'miss' ? shownPicks.map((p, k) => p !== culprit(k).letter) : [false, false]
  return <Frame label="Chromatogram: the river sample beside four factories’ dyes" mood={mood} progress={progress} verdict={phase === 'miss' ? 'fix the red line' : undefined}>
    <rect x="10" y="14" width="300" height="196" rx="4" className="rr-paper" />
    <rect x="10" y={FRONT} width="300" height={START - FRONT + 24} className="rr-paper__wet" />
    <line x1="10" x2="310" y1={FRONT} y2={FRONT} className="rr-front" />
    <line x1="10" x2="310" y1={START} y2={START} className="rr-start" />
    <rect x="2" y="200" width="316" height="20" rx="4" className="rr-solvent" />
    <line x1="96" x2="96" y1="20" y2="204" className="rr-divider" />
    <text x="50" y="34" textAnchor="middle" className="rr-lane">River</text>
    {s.factories.map((f, k) => {
      const culpritHit = phase === 'hit' && shownPicks.includes(f.letter)
      return <g key={f.letter} className={culpritHit ? 'rr-culprit' : undefined}>
        {culpritHit && <circle cx={laneX(k)} cy="29" r="12" className="rr-culprit__ring" />}
        <text x={laneX(k)} y="34" textAnchor="middle" className="rr-lane">{f.letter}</text>
        <Spot x={laneX(k)} y={y(f.cm)} dye={f.dye} r={7} />
      </g>
    })}
    {s.river.map((spot, k) => {
      const p = shownPicks[k], at = s.factories.findIndex(f => f.letter === p)
      return <g key={k}>
        {at >= 0 && <path d={`M62 ${y(spot.cm)} L${laneX(at) - 10} ${y(s.factories[at].cm)}`} className={`rr-link${wrong[k] ? ' is-bad' : ''}`} />}
        <Spot x={50} y={y(spot.cm)} dye={spot.dye} r={9} />
      </g>
    })}
    {phase === 'set' && shownPicks.length < 2 && <text x="50" y={y(s.river[shownPicks.length].cm) + 4} textAnchor="middle" className="rr-next">◀</text>}
  </Frame>
}

/* ---------------------------------------------------------------- Round 3: the indicator beaker and the gas jars */

const PH_COLOURS = ['var(--rv-redpen)', 'var(--rv-step-i)', 'var(--rv-yellow)', 'var(--rv-good)', 'var(--rv-teal)', 'var(--rv-biro)', 'var(--rv-step-b)']
const phColour = (p: number) => PH_COLOURS[p < 3 ? 0 : p < 5 ? 1 : p < 6.5 ? 2 : p < 7.5 ? 3 : p < 10 ? 4 : p < 12 ? 5 : 6]

function PhScene({ readings, shown, live, mood, progress, verdict }: { readings: number[]; shown: number; live: string; mood: string; progress: number; verdict?: string }) {
  const ph = Math.max(0, Math.min(14, shown))
  const colour = live === '?' ? 'var(--rv-surface)' : phColour(ph)
  const cell = 20
  return <Frame label={`Mine water with universal indicator; probe readings ${readings.map(r => n(r)).join(', ')}`} mood={mood} progress={progress} verdict={verdict}>
    <path d="M40 28 V150 Q40 166 56 166 H124 Q140 166 140 150 V28" className="rr-beaker" />
    <rect x="42" y="62" width="96" height="102" rx="12" className="rr-beaker__liquid" style={{ fill: colour }} />
    <g className="rr-bubbles">{[60, 90, 118].map((x, i) => <circle key={i} cx={x} cy={150} r="3.5" className="rr-bubble" style={{ animationDelay: `${i * 300}ms` }} />)}</g>
    <line x1="112" y1="14" x2="112" y2="140" className="rr-probe" />
    <circle cx="112" cy="142" r="5" className="rr-probe__tip" />
    <text x="236" y="28" textAnchor="middle" className="rr-head">Probe readings</text>
    {readings.map((r, i) => <g key={i} className="rr-reading">
      <rect x="196" y={38 + i * 32} width="80" height="26" rx="8" /><text x="236" y={56 + i * 32} textAnchor="middle">pH {n(r)}</text>
    </g>)}
    <Tag x={236} y={156} text={`Mean ${live}`} dial />
    {Array.from({ length: 15 }, (_, p) => <rect key={p} x={10 + p * cell} y="186" width={cell - 2} height="18" rx="3"
      style={{ fill: PH_COLOURS[Math.round(p / 14 * 6)] }} className={`rr-phcell${live !== '?' && Math.round(ph) === p ? ' is-on' : ''}`} />)}
    {[0, 7, 14].map(p => <text key={p} x={19 + p * cell} y="222" textAnchor="middle" className="rr-note">{p}</text>)}
    <text x="72" y="222" textAnchor="middle" className="rr-note">acid</text>
    <text x="250" y="222" textAnchor="middle" className="rr-note">alkali</text>
    {live !== '?' && <path d={`M${19 + ph * cell} 184 l-7 -11 h14 Z`} className="rr-ph__marker" />}
  </Frame>
}

const FORMULA: Record<string, string> = { h2: 'H₂', o2: 'O₂', co2: 'CO₂', cl2: 'Cl₂', n2: 'N₂' }

/** What each jar's test shows. */
function TestPicture({ gas }: { gas: GasId }) {
  switch (gas) {
    case 'h2': return <g>
      <line x1="-22" y1="-56" x2="2" y2="-38" className="rr-splint" />
      <path d="M2 -38 q6 -10 0 -18 q-6 8 0 18" className="rr-flame" />
      <g className="rr-pop"><path d="M8 -70 l4 8 8 -4 -3 9 9 3 -9 4 4 8 -9 -3 -2 9 -4 -8 -8 4 2 -9 -8 -4 9 -3 -3 -9 8 4 Z" className="rr-burst" /></g>
      <text x="14" y="-58" textAnchor="middle" className="rr-pop__t">POP!</text>
    </g>
    case 'o2': return <g>
      <line x1="-22" y1="-56" x2="2" y2="-38" className="rr-splint" />
      <circle cx="2" cy="-38" r="4" className="rr-ember" />
      <g className="rr-relight"><path d="M2 -40 q10 -14 0 -26 q-10 12 0 26" className="rr-flame" /></g>
    </g>
    case 'co2': return <g>
      <path d="M-10 -66 V-36 Q-10 -28 0 -28 Q10 -28 10 -36 V-66" className="rr-glass" />
      <path d="M-9 -50 V-36 Q-9 -29 0 -29 Q9 -29 9 -36 V-50 Z" className="rr-milky" />
      <line x1="0" y1="-74" x2="0" y2="-34" className="rr-tube" />
    </g>
    case 'cl2': return <g>
      <rect x="-6" y="-74" width="12" height="40" rx="2" className="rr-litmus" />
      <rect x="-6" y="-50" width="12" height="16" rx="2" className="rr-litmus is-bleached" />
    </g>
  }
}

function GasScene({ s, picked, phase, mood, progress }: { s: Extract<Scene, { kind: 'gas' }>; picked: string[]; phase: string; mood: string; progress: number }) {
  const names = phase === 'hit' ? s.tests : picked
  const results: Record<GasId, string> = { h2: 'squeaky pop', o2: 'splint relit', co2: 'limewater milky', cl2: 'litmus bleached' }
  return <Frame label="Four gas jars from the acid outfall, each showing a test result" mood={mood} progress={progress} verdict={phase === 'miss' ? 'fix the red jars' : undefined}>
    {s.tests.map((gas, k) => {
      const x = 40 + k * 80, bad = phase === 'miss' && names[k] !== gas, next = phase === 'set' && k === picked.length
      return <g key={k} className={`rr-jar${bad ? ' is-bad' : ''}${next ? ' is-next' : ''}${names[k] ? ' is-filled' : ''}`}>
        <text x={x} y="20" textAnchor="middle" className="rr-note">jar {k + 1}</text>
        <g transform={`translate(${x} 124)`}><TestPicture gas={gas} /></g>
        <rect x={x - 26} y="94" width="52" height="66" rx="6" className="rr-jar__glass" />
        <rect x={x - 30} y="88" width="60" height="8" rx="2" className="rr-lid" />
        <text x={x} y="182" textAnchor="middle" className="rr-jar__result">{results[gas].split(' ')[0]}</text>
        <text x={x} y="196" textAnchor="middle" className="rr-jar__result">{results[gas].split(' ')[1]}</text>
        <rect x={x - 30} y="128" width="60" height="26" rx="8" className="rr-jar__tag" />
        <text x={x} y="147" textAnchor="middle" className="rr-jar__name">{names[k] ? FORMULA[names[k]] ?? names[k] : '?'}</text>
      </g>
    })}
  </Frame>
}

/* ---------------------------------------------------------------- Round 4: the waterworks and its filter beds */

function StageIcon({ id }: { id: StageId }) {
  switch (id) {
    case 'screen': return <g>{[-14, -5, 4, 13].map(x => <line key={x} x1={x} x2={x} y1="-16" y2="16" className="rr-mesh" />)}<path d="M-20 6 l6 -4 4 6 M8 -6 l6 4" className="rr-twig" /></g>
    case 'settle': return <g><rect x="-22" y="6" width="44" height="12" rx="2" className="rr-sediment" />{[-12, 0, 12].map(x => <circle key={x} cx={x} cy="-6" r="2.5" className="rr-grain" />)}</g>
    case 'filter': return <g>{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-18 + (i % 6) * 7.2} cy={i < 6 ? 2 : 12} r={i < 6 ? 2.6 : 3.8} className={i < 6 ? 'rr-sand' : 'rr-gravel'} />)}</g>
    case 'sterilise': return <g><circle r="15" className="rr-uv" /><text y="6" textAnchor="middle" className="rr-icon__t">Cl</text></g>
    case 'distil': return <g><path d="M-8 -16 V-4 L-18 14 H18 L8 -4 V-16" className="rr-glass" /><path d="M8 -12 H22" className="rr-tube" /></g>
    case 'evaporate': return <g><path d="M-18 8 Q0 22 18 8 Z" className="rr-glass" /><path d="M-8 -2 q4 -6 0 -12 M2 -2 q4 -6 0 -12" className="rr-steam-line" /></g>
  }
}

function WorksScene({ picked, phase, mood, progress }: { picked: string[]; phase: string; mood: string; progress: number }) {
  const right: StageId[] = ['screen', 'settle', 'filter', 'sterilise']
  const placed = (phase === 'hit' ? right : picked) as StageId[]
  return <Frame label="The waterworks: four empty tanks between the river and the tap" mood={mood} progress={progress} verdict={phase === 'miss' ? 'fix the red tanks' : undefined}>
    <text x="160" y="22" textAnchor="middle" className="rr-head">River → 4 tanks → tap</text>
    <path d="M6 112 H312" className="rr-main-pipe" />
    <path d="M6 112 H312" className={`rr-flow${phase === 'hit' ? ' is-clean' : ''}`} />
    <g transform="translate(6 70)"><path d="M0 26 q8 -6 16 0 t16 0" className="rr-wave" /><path d="M0 34 q8 -6 16 0 t16 0" className="rr-wave" /></g>
    {[0, 1, 2, 3].map(k => {
      const x = 42 + k * 62, id = placed[k], bad = phase === 'miss' && id && id !== right[k], next = phase === 'set' && k === picked.length
      const water = phase === 'hit' ? `color-mix(in srgb, var(--rv-teal) ${30 + k * 22}%, var(--rv-yellow-deep))` : 'color-mix(in srgb, var(--rv-yellow-deep) 50%, var(--rv-ink-2))'
      return <g key={k} className={`rr-tank${id ? ' is-filled' : ''}${bad ? ' is-bad' : ''}${next ? ' is-next' : ''}`}>
        <text x={x + 26} y="54" textAnchor="middle" className="rr-tank__n">{k + 1}</text>
        <rect x={x} y="64" width="52" height="78" rx="6" className="rr-tank__box" />
        {id && <rect x={x + 3} y="92" width="46" height="47" rx="4" style={{ fill: water }} className="rr-tank__water" />}
        {id && <g transform={`translate(${x + 26} 106)`}><g className="rr-drop-in"><StageIcon id={id} /></g></g>}
        <text x={x + 26} y="162" textAnchor="middle" className="rr-tank__label">{id ? STAGES[id].short : '?'}</text>
      </g>
    })}
    <g transform="translate(300 84)">
      <path d="M-8 22 V8 H8" className="rr-tap" />
      <g className={phase === 'hit' ? 'rr-drip' : 'rr-drip is-off'}><path d="M8 14 q4 6 0 10 q-4 -4 0 -10" className="rr-drop" /></g>
    </g>
    <g className={`rr-glassful${phase === 'hit' ? ' is-full' : ''}`}>
      <path d="M286 176 L290 212 H310 L314 176" className="rr-glass" />
      <rect x="290" y="186" width="20" height="25" className="rr-glassful__water" />
    </g>
    <text x="150" y="200" textAnchor="middle" className="rr-note">{phase === 'hit' ? 'Potable water: safe to drink' : 'Which stage goes in each tank?'}</text>
  </Frame>
}

function BedsScene({ s, shown, live, mood, progress, verdict }: { s: Extract<Scene, { kind: 'beds' }>; shown: number; live: string; mood: string; progress: number; verdict?: string }) {
  const on = live === '?' ? 0 : Math.max(0, Math.min(20, Math.round(shown)))
  return <Frame label={`A waterworks needing ${n(s.need)} cubic metres an hour, ${s.each} per filter bed`} mood={mood} progress={progress} verdict={verdict}>
    <text x="160" y="22" textAnchor="middle" className="rr-head">Need {n(s.need)} m³ an hour</text>
    {Array.from({ length: 20 }, (_, i) => {
      const x = 22 + (i % 5) * 56, y = 36 + Math.floor(i / 5) * 34
      return <g key={i} className={`rr-bed${i < on ? ' is-on' : ''}`} style={{ transitionDelay: `${i * 25}ms` }}>
        <rect x={x} y={y} width="50" height="28" rx="5" className="rr-bed__box" />
        <rect x={x + 3} y={y + 15} width="44" height="10" rx="2" className="rr-bed__sand" />
        <rect x={x + 3} y={y + 4} width="44" height="11" rx="2" className="rr-bed__water" />
      </g>
    })}
    <Tag x={90} y={196} text={`${s.each} m³ each`} />
    <Tag x={232} y={196} text={`Running ${live}`} dial />
    <text x="160" y="224" textAnchor="middle" className="rr-note">{on ? `${on} × ${s.each} = ${n(on * s.each)} m³` : 'beds running: 0'}</text>
  </Frame>
}

/* ---------------------------------------------------------------- Round 5: the practical as a comic strip, then the balances */

function Balance({ x, y, reading, residue, dim = false }: { x: number; y: number; reading: string; residue: number; dim?: boolean }) {
  return <g transform={`translate(${x} ${y})`} className={dim ? 'rr-dim' : undefined}>
    <path d="M-30 -20 Q0 6 30 -20 Z" className="rr-dish" />
    {residue > 0 && <ellipse cx="0" cy="-14" rx={residue * 1.6} ry={Math.max(2, residue / 2.4)} className="rr-residue" />}
    <rect x="-40" y="-4" width="80" height="34" rx="6" className="rr-balance" />
    <text x="0" y="20" textAnchor="middle" className="rr-balance__read">{reading}</text>
  </g>
}

function StepPicture({ id, s }: { id: StepId; s: Extract<Scene, { kind: 'practical' }> }) {
  switch (id) {
    case 'weigh': return <Balance x={0} y={10} reading={`${n(s.before)} g`} residue={0} />
    case 'reweigh': return <Balance x={0} y={10} reading={`${n(s.after)} g`} residue={8} />
    case 'add': return <g><path d="M-30 -10 Q0 16 30 -10 Z" className="rr-dish" /><path d="M-6 -18 Q0 -4 -2 -6" className="rr-pour" /><rect x="-2" y="-42" width="16" height="30" rx="2" transform="rotate(35 6 -27)" className="rr-glass" /><text x="22" y="22" className="rr-mini">{s.sample} cm³</text></g>
    case 'heat': return <g><path d="M-30 -14 Q0 12 30 -14 Z" className="rr-dish" /><path d="M-24 0 L-30 26 M24 0 L30 26" className="rr-tripod" /><path d="M0 26 q8 -10 0 -20 q-8 10 0 20" className="rr-flame" /><g className="rr-steam"><path d="M-10 -22 q4 -6 0 -12 M8 -22 q4 -6 0 -12" className="rr-steam-line" /></g></g>
    case 'indicator': return <g><path d="M-30 -6 Q0 20 30 -6 Z" className="rr-dish" /><rect x="-4" y="-40" width="8" height="24" rx="3" className="rr-dropper" /><circle cx="0" cy="-10" r="3" className="rr-drop-ind" /></g>
    case 'pour': return <g><g transform="rotate(-30)"><path d="M-30 -6 Q0 20 30 -6 Z" className="rr-dish" /></g><path d="M24 4 q4 12 0 22" className="rr-pour" /></g>
  }
}

function PracticalScene({ s, picked, phase, mood, progress }: { s: Extract<Scene, { kind: 'practical' }>; picked: string[]; phase: string; mood: string; progress: number }) {
  const right: StepId[] = ['weigh', 'add', 'heat', 'reweigh']
  const placed = (phase === 'hit' ? right : picked) as StepId[]
  return <Frame label="The water practical as four empty comic panels" mood={mood} progress={progress} verdict={phase === 'miss' ? 'fix the red panels' : undefined}>
    {[0, 1, 2, 3].map(k => {
      const x = 8 + (k % 2) * 156, y = 6 + Math.floor(k / 2) * 114, id = placed[k]
      const bad = phase === 'miss' && id && id !== right[k], next = phase === 'set' && k === picked.length
      return <g key={k} className={`rr-panel${id ? ' is-filled' : ''}${bad ? ' is-bad' : ''}${next ? ' is-next' : ''}`}>
        <rect x={x} y={y} width="148" height="106" rx="10" className="rr-panel__box" />
        <circle cx={x + 16} cy={y + 16} r="11" className="rr-panel__n" />
        <text x={x + 16} y={y + 21} textAnchor="middle" className="rr-panel__nt">{k + 1}</text>
        {id ? <g transform={`translate(${x + 74} ${y + 46})`}><g className="rr-drop-in"><StepPicture id={id} s={s} /></g></g>
          : <text x={x + 74} y={y + 62} textAnchor="middle" className="rr-panel__q">?</text>}
        <text x={x + 74} y={y + 99} textAnchor="middle" className="rr-panel__label">{id ? STEPS[id] : ''}</text>
      </g>
    })}
  </Frame>
}

function DishScene({ s, shown, live, mood, progress, verdict }: { s: Extract<Scene, { kind: 'dish' }>; shown: number; live: string; mood: string; progress: number; verdict?: string }) {
  const pile = live === '?' ? 0 : Math.max(0, Math.min(18, 3 + shown * 6))
  return <Frame label={`Evaporating dish: ${n(s.before)} g empty, ${n(s.after)} g after evaporating ${s.sample} cm³`} mood={mood} progress={progress} verdict={verdict}>
    <text x="78" y="30" textAnchor="middle" className="rr-head">Before</text>
    <text x="242" y="30" textAnchor="middle" className="rr-head">After</text>
    <Balance x={78} y={96} reading={`${n(s.before)} g`} residue={0} />
    <g className="rr-steam is-loop"><path d="M230 52 q4 -6 0 -12 M246 52 q4 -6 0 -12" className="rr-steam-line" /></g>
    <Balance x={242} y={96} reading={`${n(s.after)} g`} residue={pile} />
    <text x="160" y="102" textAnchor="middle" className="rr-minus">−</text>
    <text x="160" y="158" textAnchor="middle" className="rr-note">{s.sample} cm³ of river water, boiled dry</text>
    <Tag x={160} y={198} text={`Solids ${live}`} dial />
  </Frame>
}

/* ---------------------------------------------------------------- The stage */

function Stage({ round, task, value, picked, phase }: PlayStageProps<Scene>) {
  const s = task.scene
  const progress = Math.min(10, ORDER.indexOf(round.id) * 2 + round.tasks.indexOf(task) + (phase === 'hit' ? 1 : 0)) / 10
  if (isTiles(task)) {
    const mood = `is-${phase}`
    const props = { picked, phase, mood, progress }
    if (s.kind === 'shelf') return <ShelfScene s={s} {...props} />
    if (s.kind === 'chroma') return <ChromaScene s={s} {...props} shown={0} live="?" />
    if (s.kind === 'gas') return <GasScene s={s} {...props} />
    if (s.kind === 'works') return <WorksScene {...props} />
    if (s.kind === 'practical') return <PracticalScene s={s} {...props} />
    return null
  }
  const set = phase === 'set' && value === task.start
  const live = phase === 'hit' ? u(task.answer, task.unit) : set ? '?' : u(value, task.unit)
  const shown = phase === 'hit' ? task.answer : value
  const high = phase === 'miss' && value > task.answer
  const mood = `is-${phase}${phase === 'miss' ? (high ? ' is-high' : ' is-low') : ''}`
  const verdict = phase === 'miss' ? (high ? 'too high ⬆' : 'too low ⬇') : undefined
  const props = { shown, live, mood, progress, verdict }
  if (s.kind === 'scoop') return <ScoopScene s={s} {...props} />
  if (s.kind === 'chroma') return <ChromaScene s={s} {...props} picked={[]} phase={phase} />
  if (s.kind === 'ph') return <PhScene readings={s.readings} {...props} />
  if (s.kind === 'beds') return <BedsScene s={s} {...props} />
  if (s.kind === 'dish') return <DishScene s={s} {...props} />
  return null
}

/** "Spot distance" → "spot distance", but symbols like "Rf" stay as they are. */
const lower = (label: string) => label.length > 3 && /^[A-Z][a-z]/.test(label) ? label.charAt(0).toLowerCase() + label.slice(1) : label

const config: PlayGameConfig<Scene> = {
  labId: 'science-river',
  name: 'River Rescue',
  speaker: DEV,
  intros: [
    'Morning, rookie! Inspector Dev Sandhu, Environment Agency. Something’s foaming in the river, and wild-swimming season starts Saturday. First: what’s actually in this stuff?',
    'A mystery dye is staining the water. Four factories upstream. Chromatography will tell us who. Let’s make them dye of embarrassment.',
    'Orange water from an old mine, and it’s fizzing. That’s acid, I’d bet my wellies on it. Let’s measure the pH and test those gases.',
    'The river’s cleaner. Now the town needs drinking water. Let’s build the waterworks and go with the flow.',
    'Final test before the swimmers dive in. Required practical: what’s dissolved in this water? No pressure. Well, some water pressure.',
  ],
  ranks: [
    { badge: '🏞️', name: 'Chief Environment Scientist', line: 'Spotless. The river sparkles and the swimmers are in.' },
    { badge: '🔬', name: 'Senior Water Analyst', line: 'A couple of splashes, but you cracked the case.' },
    { badge: '🥾', name: 'Field Sampler', line: 'Muddy wellies, but you got there. Dev’s proud.' },
    { badge: '🦆', name: 'Duck Pond Paddler', line: 'The river’s still murky. Wade back in and try again.' },
  ],
  rule: ['A pure substance is one element or compound. Same dye, same Rf: Rf = spot ÷ solvent front.', 'Pop: hydrogen. Relights: oxygen. Milky limewater: CO₂. Bleached litmus: chlorine.', 'Screen, settle, filter, sterilise. Solids = dish after − dish before.'],
  start: 'Wellies on',
  action: task => isTiles(task) ? 'Lock it in' : 'Test it',
  asker: task => isTiles(task) ? 'Dev · tap the tiles in order' : `Dev · set the ${lower(task.label)}, then test it`,
  busted: {
    emoji: '🚱', kicker: 'River closed', title: 'Three slips. The “No swimming” signs are going up.',
    tip: 'Pure means one element or compound. Match spots by height: same Rf, same dye. Screen, settle, filter, then sterilise. Weigh the dish empty first.',
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
  return data ? <PlayGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

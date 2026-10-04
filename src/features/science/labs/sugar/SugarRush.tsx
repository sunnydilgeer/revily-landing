'use client'

import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import type { Phase } from '../kit/DialGame'
import { PlayGame, type PlayGameConfig, type PlayStageProps } from '../kit/PlayGame'
import { isTiles, wrongSlots, type TileTask } from '../kit/tiles'
import { n, u, type Task } from '../kit/types'
import { makeRounds, ordinal, type Scene } from './rounds'
import './SugarRush.css'

const KEMI: Speaker = {
  name: 'Nurse Kemi', emoji: '👩🏿‍⚕️',
  right: ['Yes! Steady as a healthy pancreas.', 'Gorgeous. I’d give you a biscuit, but… diabetes clinic.', 'Spot on. You’re making my job look easy.', 'Lovely jubbly. Next patient!', 'Textbook. Literally, it’s in the textbook.'],
  wrong: ['Ooh, that reading made the monitor beep.', 'Not quite, my love. Have another look.', 'Hmm. Even the vending machine knows that’s off.', 'Steady on! Check your working first.'],
}

/** Everything a picture needs: dial state (value, too high/low) or tile state (what's placed, which slots are wrong). */
type View = {
  scene: Scene
  phase: Phase
  /** Dial: the value to draw (the answer on a hit), and whether the dial is untouched. */
  shown: number
  fresh: boolean
  live: string
  high: boolean
  /** Tiles: what's in each slot, its label, and the slots marked wrong. */
  picked: string[]
  labels: string[]
  wrong: Set<number>
  answer: string[]
}

/** Greedy word wrap for SVG text: short lines for a narrow card. */
const wrap = (text: string, max: number) => text.split(' ').reduce<string[]>((lines, word) => {
  const last = lines[lines.length - 1]
  if (last !== undefined && (last + ' ' + word).length <= max) lines[lines.length - 1] = `${last} ${word}`
  else lines.push(word)
  return lines
}, [])

/** A slot's look: empty (dashed), next to fill (pulsing), placed, right (on a hit) or wrong (on a miss). */
const slotClass = (v: View, i: number) => {
  if (v.phase === 'hit') return 'is-right'
  if (v.wrong.has(i)) return 'is-wrong'
  if (v.picked[i]) return 'is-placed'
  return v.phase === 'set' && i === v.picked.length ? 'is-next' : 'is-empty'
}

/** The given values and the dial's slot, as a row of chips along the bottom. */
function Chips({ given, live, label, y = 206 }: { given: [string, string][]; live?: string; label?: string; y?: number }) {
  const rows: [string, string, boolean][] = [...given.map(([a, b]) => [a, b, false] as [string, string, boolean]), ...(label ? [[label, live ?? '?', true] as [string, string, boolean]] : [])]
  const w = (308 - (rows.length - 1) * 6) / rows.length
  return <g>
    {rows.map(([name, value, dial], i) => {
      const x = 6 + i * (w + 6)
      return <g key={i} className={`sr-chip${dial ? ' is-dial' : ''}`}>
        <rect x={x} y={y} width={w} height={40} rx="10" />
        <text x={x + w / 2} y={y + 15} textAnchor="middle" className="sr-chip__name">{name}</text>
        <text x={x + w / 2} y={y + 34} textAnchor="middle" className="sr-chip__value">{value}</text>
      </g>
    })}
  </g>
}

/* ---------- Round 1: the body and its reflex arc ---------- */

const ARC = {
  receptor: 'M44 146',
  sensory: 'M44 146 C84 142 124 130 164 120 S230 112 258 112',
  relay: 'M258 112 C268 104 268 94 258 86',
  motor: 'M258 86 C242 82 228 86 216 90',
  all: 'M44 146 C84 142 124 130 164 120 S230 112 258 112 C268 104 268 94 258 86 C242 82 228 86 216 90',
}
const ARC_SHORT: Record<string, string> = { receptor: 'receptor', sensory: 'sensory', relay: 'relay', motor: 'motor', effector: 'effector', brain: 'brain?', hormone: 'hormone?' }
/** Where each part's tag sits, in slot order: receptor, sensory, relay, motor, effector. */
const ARC_TAGS: [number, number][] = [[54, 100], [124, 158], [280, 160], [216, 128], [160, 64]]
const ARC_PARTS = ['receptor', 'sensory', 'relay', 'motor', 'effector']

function Reflex(v: View & { dial: boolean }) {
  const a = v.scene.arc!
  const part = (i: number) => v.dial ? (v.phase === 'hit' ? 'is-right' : v.phase === 'miss' ? 'is-wrong' : 'is-placed') : slotClass(v, i)
  const jerk = v.phase === 'hit'
  const note = v.dial
    ? v.phase === 'hit' ? `Reflex! Hand off the ${a.what}.` : v.phase === 'miss' ? (v.high ? 'Faster than any nerve!' : 'Too slow… ouch!') : ''
    : v.phase === 'hit' ? `Reflex! Hand off the ${a.what}.` : v.phase === 'miss' ? `Impulse blocked at step ${[...v.wrong][0] + 1}.` : 'Build it: receptor end first.'
  return <g className={v.dial && v.phase === 'miss' ? (v.high ? 'is-high' : 'is-low') : ''}>
    {/* The patient: head, torso with the spinal cord, and an arm reaching for the danger. */}
    <circle cx="262" cy="22" r="18" className="sr-skin" />
    <circle cx="256" cy="20" r="2.4" className="sr-ink" /><circle cx="268" cy="20" r="2.4" className="sr-ink" />
    <path d={v.phase === 'hit' ? 'M255 30 Q262 26 269 30' : v.phase === 'miss' ? 'M256 31 Q262 25 268 31' : 'M256 29 Q262 33 268 29'} className="sr-ink-line" fill="none" />
    <rect x="226" y="44" width="72" height="156" rx="22" className="sr-skin" />
    <rect x="255" y="50" width="14" height="146" rx="7" className="sr-cord" />
    {Array.from({ length: 10 }, (_, i) => <line key={i} x1="255" x2="269" y1={60 + i * 14} y2={60 + i * 14} className="sr-vert" />)}
    <text x="290" y="194" textAnchor="end" className="sr-tiny">spine</text>
    <g className={jerk ? 'sr-jerk' : undefined}>
      <path d="M236 78 L160 112 L66 132" className="sr-arm-out" fill="none" />
      <path d="M236 78 L160 112 L66 132" className="sr-arm" fill="none" />
      <circle cx="52" cy="136" r="17" className="sr-skin" />
      <ellipse cx="200" cy="94" rx="22" ry="11" transform="rotate(-24 200 94)" className={`sr-muscle ${part(4)}`} />
      <path d={ARC.sensory} className={`sr-nerve ${part(1)}`} fill="none" />
      <path d={ARC.relay} className={`sr-nerve ${part(2)}`} fill="none" />
      <path d={ARC.motor} className={`sr-nerve ${part(3)}`} fill="none" />
      <circle cx="44" cy="146" r="6" className={`sr-receptor ${part(0)}`} />
      {(v.phase === 'go' || v.phase === 'hit' || (v.dial && v.phase === 'miss')) &&
        <path d={ARC.all} pathLength={100} className={`sr-pulse${v.phase === 'go' ? ' is-run' : ''}`} fill="none" />}
    </g>
    <text x="34" y="190" textAnchor="middle" className={`sr-danger${v.phase === 'miss' ? ' is-ouch' : ''}`}>{a.emoji}</text>
    {ARC_TAGS.map(([x, y], i) => {
      const tile = v.dial ? ARC_PARTS[i] : v.phase === 'hit' ? v.answer[i] : v.picked[i]
      return <g key={i} className={`sr-tag ${v.dial ? 'is-placed' : slotClass(v, i)}`}>
        <rect x={x - 38} y={y - 10} width="76" height="22" rx="11" />
        <text x={x} y={y + 5} textAnchor="middle">{tile ? ARC_SHORT[tile] ?? tile : i + 1}</text>
      </g>
    })}
    {v.dial
      ? <><text x="140" y="192" textAnchor="middle" className="sr-note">{note}</text>
        <Chips given={v.scene.given} label="Speed" live={v.live} /></>
      : <text x="160" y="232" textAnchor="middle" className="sr-note">{note}</text>}
  </g>
}

/* ---------- Round 2: the glucose monitor and the control chain ---------- */

type Shape = 'rise' | 'settle' | 'spike' | 'crash'
/** A glucose trace: flat at the start, up to the peak, then it stops (rise), settles back into the band, keeps spiking, or crashes below it. */
function trace(X0: number, X1: number, Y: (mmol: number) => number, base: number, peak: number, shape: Shape) {
  const w = X1 - X0, px = X0 + w * .38
  const up = `M${X0} ${Y(base)} L${X0 + w * .12} ${Y(base)} C${X0 + w * .25} ${Y(base)} ${X0 + w * .28} ${Y(peak)} ${px} ${Y(peak)}`
  if (shape === 'rise') return up
  if (shape === 'settle') return `${up} C${X0 + w * .5} ${Y(peak)} ${X0 + w * .62} ${Y(base)} ${X0 + w * .78} ${Y(base)} L${X1} ${Y(base)}`
  if (shape === 'crash') return `${up} C${X0 + w * .48} ${Y(peak)} ${X0 + w * .56} ${Y(1.5)} ${X0 + w * .7} ${Y(1.5)} L${X0 + w * .78} ${Y(2.2)} L${X0 + w * .86} ${Y(1.2)} L${X1} ${Y(1.6)}`
  return `${up} L${X0 + w * .5} ${Y(peak + .6)} L${X0 + w * .58} ${Y(peak - .4)} L${X0 + w * .68} ${Y(peak + 1)} L${X0 + w * .78} ${Y(peak + .2)} L${X1} ${Y(peak + 1.4)}`
}

function Monitor(v: View) {
  const g = v.scene.glucose!
  const Y = (mmol: number) => 184 - Math.max(0, Math.min(17, mmol)) * 9.6
  const peak = v.fresh ? g.base : g.base + v.shown
  const cls = v.phase === 'miss' ? (v.high ? 'is-high' : 'is-low') : ''
  const shape: Shape = v.phase === 'hit' ? 'settle' : v.phase === 'miss' ? (v.high ? 'spike' : 'crash') : 'rise'
  return <g className={cls}>
    <rect x="6" y="6" width="308" height="194" rx="16" className="sr-mon" />
    <rect x="36" y={Y(7)} width="270" height={Y(4) - Y(7)} className="sr-band" />
    <text x="300" y={Y(4) - 6} textAnchor="end" className="sr-mon__tag">healthy 4–7</text>
    {[4, 7, 12].map(m => <text key={m} x="28" y={Y(m) + 4} textAnchor="end" className="sr-mon__tag">{m}</text>)}
    <line x1="36" y1={Y(g.peak)} x2="306" y2={Y(g.peak)} className="sr-target" />
    <text x="300" y={Y(g.peak) - 6} textAnchor="end" className="sr-mon__tag">peak</text>
    <path key={shape} d={trace(36, 306, Y, g.base, peak, shape)} className={`sr-trace${v.phase === 'set' ? '' : ' is-run'}`} fill="none" pathLength={100} />
    <circle cx={36 + 270 * .38} cy={Y(peak)} r="6" className="sr-blip" />
    <text x="52" y="192" className="sr-mon__tag">🥤 drink</text>
    <text x="300" y="30" textAnchor="end" className="sr-mon__big">{v.phase === 'hit' ? 'SETTLED' : v.phase === 'miss' ? (v.high ? 'TOO HIGH' : 'TOO LOW') : 'mmol/L'}</text>
    <Chips given={v.scene.given} label="Rise" live={v.live} />
  </g>
}

const CHAIN_BOX: [number, number][] = [[6, 122], [164, 122], [164, 178], [6, 178]]
function Control(v: View) {
  const g = v.scene.glucose!
  const Y = (mmol: number) => 100 - Math.max(0, Math.min(16, mmol)) * 5.4
  return <g className={v.phase === 'miss' ? 'is-high' : ''}>
    <rect x="6" y="6" width="308" height="106" rx="14" className="sr-mon" />
    <rect x="30" y={Y(7)} width="278" height={Y(4) - Y(7)} className="sr-band" />
    <text x="302" y={Y(4) - 4} textAnchor="end" className="sr-mon__tag">healthy</text>
    <path key={v.phase} d={trace(30, 308, Y, g.base, g.peak, v.phase === 'hit' ? 'settle' : 'spike')} className={`sr-trace${v.phase === 'hit' || v.phase === 'miss' ? ' is-run' : ''}`} fill="none" pathLength={100} />
    <text x="302" y="26" textAnchor="end" className="sr-mon__big">{v.phase === 'hit' ? 'SETTLED' : v.phase === 'miss' ? 'STILL HIGH' : `${g.peak} mmol/L`}</text>
    {CHAIN_BOX.map(([x, y], i) => {
      const tile = v.phase === 'hit' ? v.answer[i] : v.picked[i]
      return <g key={i} className={`sr-card ${slotClass(v, i)}`} style={{ animationDelay: `${i * 140}ms` }}>
        <rect x={x} y={y} width="150" height="44" rx="12" />
        <circle cx={x + 18} cy={y + 22} r="11" className="sr-card__num" />
        <text x={x + 18} y={y + 26} textAnchor="middle" className="sr-card__n">{i + 1}</text>
        <text x={x + 34} y={y + 17} className="sr-card__slot">{['The change', 'Detected by', 'Releases', 'Result'][i]}</text>
        <text x={x + 34} y={y + 36} className="sr-card__t is-sm">{tile ? v.labels[i] : '…'}</text>
      </g>
    })}
    <text x="160" y="240" textAnchor="middle" className="sr-note">{v.phase === 'hit' ? 'Insulin in, glucose into cells: back in range.' : v.phase === 'miss' ? 'Wrong link: the glucose stays high.' : 'Fill the loop, 1 → 4.'}</text>
  </g>
}

/* ---------- Round 3: the clinic list and the diabetes files ---------- */

function Person({ x, y, cls, delay }: { x: number; y: number; cls: string; delay: number }) {
  return <g className={`sr-person ${cls}`} style={{ animationDelay: `${delay}ms` }}>
    <circle cx={x} cy={y} r="9" />
    <path d={`M${x - 11} ${y + 46} V${y + 22} Q${x - 11} ${y + 12} ${x} ${y + 12} Q${x + 11} ${y + 12} ${x + 11} ${y + 22} V${y + 46} Z`} />
  </g>
}

function Crowd(v: View) {
  const per = v.scene.crowd!.per
  const raw = v.fresh ? 0 : v.shown / per
  const marked = Math.max(0, Math.min(20, Math.round(raw)))
  const note = v.phase === 'hit' ? 'Type 2 in teal, type 1 in orange.' : raw > 20 ? 'More than the whole list!' : `1 figure = ${n(per)} patients`
  return <g>
    <rect x="6" y="6" width="308" height="168" rx="14" className="sr-room" />
    {Array.from({ length: 20 }, (_, i) => {
      const x = 25 + (i % 10) * 30, y = 24 + Math.floor(i / 10) * 76
      const cls = i < marked ? 'is-t2' : v.phase === 'hit' ? 'is-t1' : ''
      return <Person key={i} x={x} y={y} cls={`${cls}${v.phase === 'hit' ? ' is-hop' : ''}`} delay={i * 30} />
    })}
    <text x="160" y="194" textAnchor="middle" className={`sr-note${raw > 20 ? ' is-bad' : ''}`}>{note}</text>
    <Chips given={v.scene.given} label="Type 2 count" live={v.live} y={206} />
  </g>
}

const FILE_ROWS: [number, number, string][] = [[6, 84, 'Cause'], [6, 160, 'Treated with'], [164, 84, 'Cause'], [164, 160, 'Risk factor']]
function Files(v: View) {
  return <g>
    {[0, 1].map(k => {
      const x = 6 + k * 158
      return <g key={k} className={`sr-file is-t${k + 1}`}>
        <rect x={x} y="10" width="150" height="234" rx="12" className="sr-file__board" />
        <rect x={x} y="10" width="150" height="44" rx="12" className="sr-file__head" />
        <rect x={x + 50} y="4" width="50" height="14" rx="5" className="sr-file__clip" />
        <text x={x + 75} y="42" textAnchor="middle" className="sr-file__title">Type {k + 1}</text>
        {v.phase === 'hit' && <g className="sr-stamp" style={{ animationDelay: `${k * 200}ms` }}>
          <text x={x + 75} y="234" textAnchor="middle" className="sr-stamp__t">✓ FILED</text>
        </g>}
      </g>
    })}
    {FILE_ROWS.map(([x, y, name], i) => {
      const tile = v.phase === 'hit' ? v.answer[i] : v.picked[i]
      const lines = tile ? wrap(v.labels[i], 16) : []
      return <g key={i} className={`sr-row ${slotClass(v, i)}`}>
        <text x={x + 12} y={y - 8} className="sr-row__name">{name}</text>
        <rect x={x + 8} y={y} width="134" height="48" rx="10" />
        {lines.length ? lines.map((line, j) => <text key={j} x={x + 75} y={y + 29 + (j - (lines.length - 1) / 2) * 16} textAnchor="middle" className="sr-row__t">{line}</text>)
          : <text x={x + 75} y={y + 30} textAnchor="middle" className="sr-row__q">?</text>}
      </g>
    })}
  </g>
}

/* ---------- Round 4: the cycle wheel and the calendar ---------- */

const CX = 160, CY = 126, R = 62
const onRing = (day: number, r = R): [number, number] => {
  const a = (-90 + (day - 1) / 28 * 360) * Math.PI / 180
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}
/** Slot order: egg matures (day 4), egg released (day 14), lining builds (day 10), lining kept (day 21), each with its card corner. */
const STATIONS: { day: number; box: [number, number]; name: string }[] = [
  { day: 4, box: [206, 8], name: 'Egg matures' },
  { day: 14, box: [6, 196], name: 'Egg released' },
  { day: 10, box: [206, 196], name: 'Lining builds' },
  { day: 21, box: [6, 8], name: 'Lining kept' },
]
function Cycle(v: View) {
  const arc = (from: number, to: number) => { const [x1, y1] = onRing(from), [x2, y2] = onRing(to); return `M${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2}` }
  return <g>
    <circle cx={CX} cy={CY} r={R} className="sr-ring" />
    <path d={arc(1, 6)} className="sr-ring__period" fill="none" />
    {[1, 7, 14, 21].map(d => { const [x, y] = onRing(d, R - 20); return <text key={d} x={x} y={y + 4} textAnchor="middle" className="sr-tiny">{d}</text> })}
    <text x={CX} y={CY - 2} textAnchor="middle" className="sr-ring__big">28</text>
    <text x={CX} y={CY + 16} textAnchor="middle" className="sr-tiny">day cycle</text>
    {STATIONS.map((s, i) => {
      const [dx, dy] = onRing(s.day), [bx, by] = s.box
      const tile = v.phase === 'hit' ? v.answer[i] : v.picked[i]
      return <g key={i} className={`sr-card ${slotClass(v, i)}`} style={{ animationDelay: `${i * 140}ms` }}>
        <line x1={dx} y1={dy} x2={bx + 54} y2={by < 100 ? by + 46 : by} className="sr-lead" />
        <circle cx={dx} cy={dy} r="7" className="sr-station" />
        <rect x={bx} y={by} width="108" height="46" rx="12" />
        <text x={bx + 54} y={by + 17} textAnchor="middle" className="sr-card__slot">{s.name}</text>
        <text x={bx + 54} y={by + 37} textAnchor="middle" className="sr-card__t is-sm">{tile ? v.labels[i] : '?'}</text>
      </g>
    })}
    {v.phase === 'hit' && <g className="sr-orbit"><circle cx={CX} cy={CY - R} r="8" className="sr-egg" /></g>}
  </g>
}

function Calendar(v: View) {
  const start = v.scene.calendar!.start
  const pick = v.fresh ? 0 : v.shown
  const trail = v.phase === 'hit' || v.phase === 'miss'
  return <g className={v.phase === 'miss' ? (v.high ? 'is-high' : 'is-low') : ''}>
    {'MTWTFSS'.split('').map((d, i) => <text key={i} x={28 + i * 44} y="16" textAnchor="middle" className="sr-tiny">{d}</text>)}
    {Array.from({ length: 31 }, (_, i) => {
      const date = i + 1, x = 8 + (i % 7) * 44, y = 24 + Math.floor(i / 7) * 36
      const period = date >= start && date < start + 5
      const mine = date === pick
      const cycleDay = date - start + 1
      return <g key={date} className={`sr-day${period ? ' is-period' : ''}${mine ? ' is-picked' : ''}`}>
        <rect x={x} y={y} width="40" height="32" rx="8" />
        <text x={x + 6} y={y + 15} className="sr-day__n">{date}</text>
        {trail && cycleDay >= 1 && date <= pick && !(mine && v.phase === 'hit') && <text x={x + 36} y={y + 28} textAnchor="end" className="sr-day__c">d{cycleDay}</text>}
        {mine && v.phase === 'hit' && <g className="sr-pop"><text x={x + 30} y={y + 18} textAnchor="middle" className="sr-day__egg">🥚</text></g>}
      </g>
    })}
    <Chips given={v.scene.given} label="Ovulation" live={v.fresh ? '?' : `the ${ordinal(v.shown)}`} />
  </g>
}

/* ---------- Round 5: the ruler drop ---------- */

const HAND_Y = 122, K = 2.2
/** cm a ruler falls in a reaction time (s = ½gt²), shown on the ruler, never asked for. */
const cmFor = (ms: number) => 490 * (ms / 1000) ** 2

/** The ruler, held with zero at the fingers. `drop` cm is where it's caught; `fell` lets it go right past. */
function Rig({ drop, ghost, phase, fell }: { drop: number; ghost: number | null; phase: Phase; fell: boolean }) {
  const moved = phase === 'go' || phase === 'hit' || phase === 'miss'
  const y = moved ? (fell ? 112 : Math.min(50, drop) * K) : 0
  const closed = phase === 'hit' || (moved && !fell)
  return <g>
    <g className={`sr-rule${moved ? ' is-drop' : ''}${fell ? ' is-fell' : ''}`} style={{ transform: `translateY(${y}px)` }}>
      <rect x="54" y={HAND_Y - 50 * K - 6} width="40" height={50 * K + 6} rx="4" className="sr-rule__body" />
      {Array.from({ length: 11 }, (_, i) => {
        const ty = HAND_Y - i * 5 * K
        return <g key={i}>
          <line x1="54" x2={i % 2 ? 62 : 68} y1={ty} y2={ty} className="sr-rule__tick" />
          {i % 2 === 0 && <text x="90" y={ty + 4} textAnchor="end" className="sr-rule__n">{i * 5}</text>}
        </g>
      })}
      {ghost !== null && ghost <= 50 && <line x1="48" x2="100" y1={HAND_Y - ghost * K} y2={HAND_Y - ghost * K} className="sr-ghost" />}
    </g>
    <g className="sr-finger" style={{ transform: `translateY(${closed ? 0 : -8}px)` }}><rect x="40" y={HAND_Y - 12} width="84" height="10" rx="5" className="sr-skin" /></g>
    <g className="sr-finger" style={{ transform: `translateY(${closed ? 0 : 8}px)` }}><rect x="40" y={HAND_Y + 2} width="84" height="10" rx="5" className="sr-skin" /></g>
    <circle cx="130" cy={HAND_Y} r="20" className="sr-skin" />
    {moved && <text x="146" y={HAND_Y + 50} textAnchor="end" className="sr-note">{fell ? 'Dropped it!' : `caught at ${n(Math.round(Math.min(50, drop)))} cm`}</text>}
  </g>
}

function Steps(v: View) {
  const r = v.scene.ruler!
  return <g>
    <rect x="6" y="6" width="146" height="238" rx="14" className="sr-room" />
    <Rig drop={cmFor(r.mean)} ghost={null} phase={v.phase} fell={v.phase === 'miss'} />
    {Array.from({ length: 5 }, (_, i) => {
      const y = 8 + i * 47, tile = v.phase === 'hit' ? v.answer[i] : v.picked[i]
      return <g key={i} className={`sr-card ${slotClass(v, i)}`} style={{ animationDelay: `${i * 120}ms` }}>
        <rect x="160" y={y} width="154" height="40" rx="11" />
        <circle cx="178" cy={y + 20} r="11" className="sr-card__num" />
        <text x="178" y={y + 25} textAnchor="middle" className="sr-card__n">{i + 1}</text>
        <text x="194" y={y + 25} className={tile ? 'sr-card__t is-sm' : 'sr-card__slot'}>{tile ? v.labels[i] : 'step ' + (i + 1)}</text>
      </g>
    })}
  </g>
}

function Ruler(v: View) {
  const r = v.scene.ruler!
  const ms = v.fresh ? 0 : v.shown
  const cm = cmFor(ms)
  const hit = v.phase === 'hit'
  return <g className={v.phase === 'miss' ? (v.high ? 'is-high' : 'is-low') : ''}>
    <rect x="6" y="6" width="146" height="238" rx="14" className="sr-room" />
    <Rig drop={cm} ghost={v.fresh ? null : cm} phase={v.phase} fell={cm > 50} />
    <text x="164" y="22" className="sr-chip__name">Dev’s catches (ms)</text>
    {r.trials.map((t, i) => {
      const x = 162 + (i % 2) * 78, y = 32 + Math.floor(i / 2) * 38
      const odd = i === r.anomaly
      return <g key={i} className={`sr-trial${hit ? (odd ? ' is-out' : ' is-in') : ''}`}>
        <rect x={x} y={y} width="72" height="30" rx="9" />
        <text x={x + 36} y={y + 20} textAnchor="middle">{t}</text>
      </g>
    })}
    <g className="sr-chip is-dial">
      <rect x="162" y="160" width="150" height="56" rx="12" />
      <text x="237" y="180" textAnchor="middle" className="sr-chip__name">Mean time</text>
      <text x="237" y="204" textAnchor="middle" className="sr-chip__value">{v.live}</text>
    </g>
    <text x="237" y="236" textAnchor="middle" className="sr-note">{hit ? 'Anomaly out. Caught!' : v.phase === 'miss' ? (v.high ? 'Too slow a catch' : 'Too quick a catch') : ''}</text>
  </g>
}

function Stage({ task, value, picked, phase }: PlayStageProps<Scene>) {
  const scene = task.scene
  const tiles = isTiles(task) ? task as TileTask<Scene> : null
  const dial = tiles ? null : task as Task<Scene>
  const fresh = !!dial && phase === 'set' && value === dial.start
  const shown = dial ? (phase === 'hit' ? dial.answer : value) : 0
  const placed = tiles ? (phase === 'hit' ? tiles.answer : picked) : []
  const v: View = {
    scene, phase, shown, fresh,
    live: dial ? (fresh ? '?' : /^[a-z]{5,}$/i.test(dial.unit) ? n(shown) : u(shown, dial.unit)) : '',
    high: !!dial && value > dial.answer,
    picked, answer: tiles?.answer ?? [],
    labels: placed.map(p => tiles?.palette.find(t => t.value === p)?.label ?? p),
    wrong: tiles && phase === 'miss' ? new Set(wrongSlots(tiles, picked)) : new Set<number>(),
  }
  const label: Record<Scene['layout'], string> = {
    arc: `A reflex arc from the hand to the spinal cord and back to the arm muscle`, monitor: 'Blood glucose monitor', control: 'Blood glucose control chain',
    crowd: 'The clinic list as 20 figures', files: 'Type 1 and type 2 diabetes files', cycle: 'The 28-day menstrual cycle', calendar: 'A month calendar',
    steps: 'The ruler-drop practical', ruler: 'The ruler-drop practical',
  }
  return <svg viewBox="0 0 320 250" className={`sr-board is-${phase}`} role="img" aria-label={`${label[scene.layout]}${dial ? `, ${dial.label} ${v.live}` : ''}`}>
    {scene.layout === 'arc' && <Reflex {...v} dial={!!dial} />}
    {scene.layout === 'monitor' && <Monitor {...v} />}
    {scene.layout === 'control' && <Control {...v} />}
    {scene.layout === 'crowd' && <Crowd {...v} />}
    {scene.layout === 'files' && <Files {...v} />}
    {scene.layout === 'cycle' && <Cycle {...v} />}
    {scene.layout === 'calendar' && <Calendar {...v} />}
    {scene.layout === 'steps' && <Steps {...v} />}
    {scene.layout === 'ruler' && <Ruler {...v} />}
  </svg>
}

const config: PlayGameConfig<Scene> = {
  labId: 'science-sugar',
  name: 'Sugar Rush',
  speaker: KEMI,
  intros: [
    'Morning! I’m Kemi, and this is the busiest diabetes and reflex clinic in the NHS. First patient just grabbed something sharp. Let’s trace that reflex.',
    'Next up, a glucose test. Sugary drink in, monitor on, and we watch the pancreas do its thing.',
    'Millions of people in the UK live with diabetes. Grab the clinic list: I need it sorted for the team meeting.',
    'Hormone clinic this afternoon. All very professional, no giggling at the back.',
    'Boss round: the reaction time practical. Dev the porter has volunteered. Well, I volunteered him.',
  ],
  ranks: [
    { badge: '🏅', name: 'Consultant Endocrinologist', line: 'Every patient steady, first go. Hormones, nerves, the lot. The clinic is yours.' },
    { badge: '🩺', name: 'Diabetes Specialist Nurse', line: 'A wobble or two, but every reading came back into the healthy band.' },
    { badge: '📋', name: 'Healthcare Assistant', line: 'You got there. Kemi double-checked the charts, though.' },
    { badge: '🍪', name: 'Biscuit Tin Guard', line: 'You’re guarding the biscuit tin for now. Back to the textbook, then back on shift.' },
  ],
  rule: [
    'Reflex arc: receptor → sensory → relay → motor neurone → effector. Speed = distance ÷ time.',
    'Glucose high → pancreas → insulin → glucose into cells, liver stores glycogen. Type 1: too little insulin. Type 2: cells stop responding.',
    'Repeat trials, leave out anomalies, then find the mean. Change one variable; control the rest.',
  ],
  start: 'Start the clinic',
  action: task => task.scene.layout === 'arc' ? 'Fire the impulse' : task.scene.layout === 'ruler' ? 'Drop the ruler' : task.scene.layout === 'control' ? 'Release insulin' : isTiles(task) ? 'Lock it in' : 'Check it',
  asker: task => `Nurse Kemi · ${isTiles(task) ? 'tap the tiles in order' : `set the ${task.label.charAt(0).toLowerCase() + task.label.slice(1)}`}`,
  busted: {
    emoji: '🚨', kicker: 'Monitor alarm', title: 'Three slips. Kemi’s taking this patient back.',
    tip: 'Reflex: receptor first, effector last. Glucose: pancreas → insulin → glycogen. A rise is a difference: subtract. Leave anomalies out before you find a mean.',
    retry: 'Back on shift',
  },
  burst: '🍬',
  brag: (name, badge) => `I ran a whole diabetes clinic in Sugar Rush and kept every patient’s glucose steady. Rank: ${name} ${badge}`,
  again: 'Next clinic',
  sound: sfx.tick,
  actionMs: 800,
  Stage,
}

/** Fresh patients every play: the game remounts with a new set on "again". */
export default function SugarRush() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <PlayGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

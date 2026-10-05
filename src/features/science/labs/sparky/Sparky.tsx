'use client'

import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { DialGame, type DialGameConfig, type Phase, type StageProps } from '../kit/DialGame'
import { u } from '../kit/types'
import { makeRounds, slotText, type Board, type Slot } from './rounds'
import './Sparky.css'

const SAL: Speaker = {
  name: 'Sal', emoji: '👷🏽‍♀️',
  right: ['Lights on. You’re a natural, mate.', 'Spot on. I’ll put that on your certificate.', 'Bang on the numbers. No smoke, no drama.', 'That’s how a sparky does it.', 'Wired right first time. Love to see it.'],
  wrong: ['Smell that? That’s a melted lamp.', 'Pop. There goes another bulb.', 'Nope. The customer’s sitting in the dark.', 'That circuit just tripped the whole street.'],
}

/** The lamps' mood: off while setting, flickering while it powers up, then lit, dim (too low) or fried (too high). */
function lampState(phase: Phase, value: number, answer: number) {
  if (phase === 'hit') return 'is-on'
  if (phase === 'go') return 'is-go'
  if (phase === 'miss') return value > answer ? 'is-fried' : 'is-dim'
  return ''
}

/** A lamp: a circle with a cross, glowing when lit. */
function Lamp({ x, y }: { x: number; y: number }) {
  return <g className="sp-lamp" transform={`translate(${x} ${y})`}>
    <circle className="sp-lamp__glow" r="24" />
    <circle className="sp-lamp__body" r="12" />
    <path className="sp-lamp__x" d="M-8.5 -8.5 L8.5 8.5 M8.5 -8.5 L-8.5 8.5" />
    <text className="sp-lamp__pop" y="-16" textAnchor="middle">💥</text>
  </g>
}

/** A cell across a horizontal wire: the long plate is positive. */
function Cell({ x, y }: { x: number; y: number }) {
  return <g className="sp-cell">
    <rect x={x - 10} y={y - 4} width="20" height="8" className="sp-gap" />
    <line x1={x - 5} y1={y - 14} x2={x - 5} y2={y + 14} className="sp-plate" />
    <line x1={x + 5} y1={y - 7} x2={x + 5} y2={y + 7} className="sp-plate sp-plate--thick" />
  </g>
}

/** An ammeter or voltmeter: a circle with its letter. */
function Meter({ x, y, letter }: { x: number; y: number; letter: string }) {
  return <g className="sp-meter" transform={`translate(${x} ${y})`}>
    <circle r="11" />
    <text y="4.5" textAnchor="middle">{letter}</text>
  </g>
}

/** A value on the board. The dial's slot gets a highlighted box. */
function Tag({ x, y, text, dial, anchor = 'middle' }: { x: number; y: number; text?: string; dial: boolean; anchor?: 'start' | 'middle' | 'end' }) {
  if (!text) return null
  const width = Math.max(34, text.length * 8.4 + 12)
  const left = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x
  return <g className={`sp-tag${dial ? ' is-dial' : ''}`}>
    {dial && <rect x={left} y={y - 15} width={width} height="21" rx="6" />}
    <text x={anchor === 'middle' ? x : anchor === 'end' ? x - 6 : x + 6} y={y} textAnchor={anchor}>{text}</text>
  </g>
}

function CircuitBoard({ board, live, mood }: { board: Board; live: string; mood: string }) {
  const t = (slot: Slot) => slotText(board, slot, live)
  const d = (slot: Slot) => board.dial === slot
  const supply = <><Cell x={160} y={board.layout === 'parallel' ? 30 : 40} /><Tag x={160} y={board.layout === 'parallel' ? 15 : 22} text={t('supply')} dial={d('supply')} /></>

  if (board.layout === 'single') return <svg viewBox="0 0 320 190" className={`sp-board ${mood}`} role="img" aria-label="A cell, an ammeter and a lamp in a loop">
    <rect x="40" y="40" width="240" height="110" rx="4" className="sp-wire" />
    {supply}
    <Lamp x={280} y={95} /><Tag x={258} y={100} text={t('r1')} dial={d('r1')} anchor="end" />
    <Meter x={160} y={150} letter="A" /><Tag x={160} y={182} text={t('a')} dial={d('a')} />
  </svg>

  if (board.layout === 'series') return <svg viewBox="0 0 320 190" className={`sp-board ${mood}`} role="img" aria-label="A cell, an ammeter and two lamps in series">
    <rect x="40" y="40" width="240" height="110" rx="4" className="sp-wire" />
    {supply}
    <Lamp x={120} y={150} /><Tag x={120} y={182} text={t('r1')} dial={d('r1')} />
    <Lamp x={200} y={150} /><Tag x={200} y={182} text={t('r2')} dial={d('r2')} />
    <Meter x={280} y={95} letter="A" /><Tag x={258} y={100} text={t('a')} dial={d('a')} anchor="end" />
    {board.dial === 'rt' && <Tag x={145} y={100} text={`Total = ${live}`} dial />}
  </svg>

  if (board.layout === 'parallel') return <svg viewBox="0 0 320 190" className={`sp-board ${mood}`} role="img" aria-label="A cell feeding two lamps in parallel branches">
    <rect x="40" y="30" width="240" height="130" rx="4" className="sp-wire" />
    <line x1="40" y1="95" x2="280" y2="95" className="sp-wire" />
    <circle cx="40" cy="95" r="3.5" className="sp-dot" /><circle cx="280" cy="95" r="3.5" className="sp-dot" />
    {supply}
    <Meter x={40} y={62} letter="A" /><Tag x={56} y={67} text={t('a')} dial={d('a')} anchor="start" />
    <Meter x={110} y={95} letter="A" /><Tag x={110} y={76} text={t('a1')} dial={d('a1')} />
    <Lamp x={200} y={95} /><Tag x={200} y={74} text={t('r1')} dial={d('r1')} />
    <Lamp x={200} y={160} /><Tag x={200} y={186} text={t('r2')} dial={d('r2')} />
    <text x="236" y="122" className="sp-note">lamp 1</text><text x="236" y="150" className="sp-note">lamp 2</text>
  </svg>

  // The wire practical: a test wire on a metre rule, the clip at the length being tested.
  const len = Number.parseFloat(board.slots.len ?? '50')
  const clip = 70 + 180 * Math.min(1, len / 100)
  return <svg viewBox="0 0 320 200" className={`sp-board ${mood}`} role="img" aria-label={`The resistance of a wire practical, clipped at ${board.slots.len}`}>
    <path d={`M70 120 H40 V40 H280 V120 H${clip}`} className="sp-wire" fill="none" />
    <line x1="70" y1="120" x2="250" y2="120" className="sp-testwire" />
    <rect x="66" y="126" width="188" height="11" rx="2" className="sp-rule" />
    {[0, 25, 50, 75, 100].map(cm => <line key={cm} x1={70 + 1.8 * cm} y1="126" x2={70 + 1.8 * cm} y2="131" className="sp-tick" />)}
    <path d={`M70 120 V172 H149 M171 172 H${clip} V120`} className="sp-lead" fill="none" />
    <Cell x={160} y={40} />
    <Meter x={40} y={80} letter="A" /><Tag x={56} y={85} text={t('a')} dial={d('a')} anchor="start" />
    <Meter x={160} y={172} letter="V" /><Tag x={180} y={196} text={t('v')} dial={d('v')} anchor="start" />
    <circle cx={clip} cy="120" r="5" className="sp-clip" />
    <Tag x={clip} y={110} text={board.slots.len} dial={false} />
    <Tag x={160} y={85} text={`R = ${live}`} dial />
  </svg>
}

const ROWS: [Slot, string][] = [['v', 'Voltage'], ['a', 'Current'], ['p', 'Power'], ['t', 'Time'], ['e', 'Energy']]

/** The smart plug's screen: what's plugged in, and its numbers. */
function Charger({ board, live, mood }: { board: Board; live: string; mood: string }) {
  return <div className={`sp-charger ${mood}`}>
    <span className="sp-charger__device" aria-hidden="true">{board.device?.emoji}<span className="sp-charger__pop">💥</span></span>
    <dl className="sp-charger__screen" aria-label={`Smart plug for the ${board.device?.name}`}>
      {ROWS.filter(([slot]) => board.slots[slot] || board.dial === slot).map(([slot, name]) => <div key={slot} className={board.dial === slot ? 'is-dial' : ''}>
        <dt>{name}</dt><dd>{slotText(board, slot, live)}</dd>
      </div>)}
    </dl>
  </div>
}

function Stage({ task, value, phase }: StageProps<Board>) {
  const live = phase === 'hit' ? u(task.answer, task.unit) : phase === 'set' && value === task.start ? '?' : u(value, task.unit)
  const mood = lampState(phase, value, task.answer)
  return task.scene.layout === 'charger'
    ? <Charger board={task.scene} live={live} mood={mood} />
    : <CircuitBoard board={task.scene} live={live} mood={mood} />
}

const config: DialGameConfig<Board> = {
  labId: 'science-sparky',
  name: 'Sparky',
  speaker: SAL,
  intros: [
    'First day on the tools? Easy one. The porch light. Get the numbers right or it’s dark, or on fire.',
    'Mrs Okafor wants fairy lights down the garden path. Two lamps, one wire. What could go wrong?',
    'Solar panels on the roof, a battery in the garage. Every room gets its own branch. That’s parallel.',
    'Smart plugs everywhere in this house. Tell me what everything’s pulling before the trip switch does.',
    'Assessment day. The inspector wants the resistance-of-a-wire practical, done properly. No pressure.',
  ],
  ranks: [
    { badge: '⚡', name: 'Master Sparky', line: 'Every lamp lit, first go. Sal’s putting you on the big jobs.' },
    { badge: '🔌', name: 'Qualified Sparky', line: 'A popped bulb or two, but the whole house is lit.' },
    { badge: '💡', name: 'Apprentice', line: 'You got there. Sal kept the fire extinguisher close, though.' },
    { badge: '🕯️', name: 'Candle Seller', line: 'The customers are using candles now. Back to the van.' },
  ],
  rule: ['V = I × R. Cover the one you want: I = V ÷ R, R = V ÷ I.', 'Series: resistances add, same current. Parallel: full voltage each branch, currents add.', 'Power P = V × I. Energy E = P × t, with t in seconds.'],
  start: 'Grab the tools',
  action: 'Switch on',
  asker: task => `Sal · set the ${task.label.toLowerCase().split(' ')[0]}, then switch on`,
  busted: {
    emoji: '🧯', kicker: 'Trip switch', title: 'Three blown lamps. The house is in the dark.',
    tip: 'Write the equation first, then swap in the numbers. V = I × R, so I = V ÷ R. Series: add the resistances. Parallel: every branch gets the full voltage, then add the currents.',
    retry: 'Reset the trip switch',
  },
  burst: '💡',
  brag: (name, badge) => `I wired a whole solar house in Sparky without frying a single bulb. Rank: ${name} ${badge}`,
  again: 'Wire another house',
  sound: sfx.stamp,
  Stage,
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function Sparky() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <DialGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

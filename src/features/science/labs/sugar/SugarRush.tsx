'use client'

import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { DialGame, type DialGameConfig, type Phase, type StageProps } from '../kit/DialGame'
import { u, type Task } from '../kit/types'
import { makeRounds, ordinal, type Scene } from './rounds'
import './SugarRush.css'

const KEMI: Speaker = {
  name: 'Nurse Kemi', emoji: '👩🏿‍⚕️',
  right: ['Yes! Steady as a healthy pancreas.', 'Gorgeous. I’d give you a biscuit, but… diabetes clinic.', 'Spot on. You’re making my job look easy.', 'Lovely jubbly. Next patient!', 'Textbook. Literally, it’s in the textbook.'],
  wrong: ['Ooh, that reading made the monitor beep.', 'Not quite, my love. Have another look.', 'Hmm. Even the vending machine knows that’s off.', 'Steady on! Check your working first.'],
}

/** The scene's mood: plain while setting, playing on Check, then settled (right), too high or too low. */
function mood(phase: Phase, value: number, answer: number) {
  if (phase === 'hit') return 'is-hit'
  if (phase === 'go') return 'is-go'
  if (phase === 'miss') return value > answer ? 'is-miss is-high' : 'is-miss is-low'
  return ''
}

const note = (cls: string, hit: string, high: string, low: string) =>
  cls.includes('is-hit') ? hit : cls.includes('is-high') ? high : cls.includes('is-low') ? low : ''

/** The readout beside the picture: the given values, then the dial's slot. */
function Readout({ given, label, live, x = 186, y = 30 }: { given: [string, string][]; label: string; live: string; x?: number; y?: number }) {
  const rows = [...given, [label, live] as [string, string]]
  return <g className="sr-readout">
    {rows.map(([name, text], i) => {
      const dial = i === rows.length - 1, top = y + i * 50
      return <g key={name} className={dial ? 'sr-slot is-dial' : 'sr-slot'}>
        <text x={x} y={top} className="sr-slot__name">{name}</text>
        {dial && <rect x={x - 4} y={top + 6} width={130} height={26} rx="6" />}
        <text x={x + 2} y={top + 25} className="sr-slot__value">{text}</text>
      </g>
    })}
  </g>
}

type Part = { scene: Scene; shown: number; answer: number; fresh: boolean; label: string; live: string; cls: string }

/** The reflex arc: receptor, sensory neurone up to the spinal cord, relay, motor neurone out to the effector. The impulse runs the path on Check. */
function Reflex({ scene, shown, answer, fresh, label, live, cls }: Part) {
  const r = scene.reflex!
  const lit = fresh ? 0 : Math.max(0.08, Math.min(1, shown / answer)) * 100
  const path = 'M30 160 C30 110 50 70 92 60 L120 60 C150 70 160 110 160 160'
  return <svg viewBox="0 0 320 200" className={`sr-board ${cls}`} role="img" aria-label={`Reflex arc from receptor to effector, ${label} ${live}`}>
    <rect x="62" y="22" width="88" height="54" rx="12" className="sr-cord" />
    <text x="106" y="42" textAnchor="middle" className="sr-tag">spinal cord</text>
    <path d={path} className="sr-nerve" fill="none" />
    <path d={path} className="sr-nerve__lit" pathLength={100} strokeDasharray={`${lit} 100`} fill="none" />
    <circle cx="106" cy="60" r="5" className="sr-relay" />
    <text x="30" y="186" textAnchor="middle" className="sr-emoji">{r.from}</text>
    <text x="160" y="186" textAnchor="middle" className="sr-emoji">{r.to}</text>
    <text x="44" y="160" className="sr-tag">sensory</text>
    <text x="148" y="160" textAnchor="end" className="sr-tag">motor</text>
    <text x="96" y="132" textAnchor="middle" className="sr-note">{scene.given[1][0] === 'Speed' ? note(cls, 'reflex!', 'too slow: ouch', 'impossibly fast') : note(cls, 'reflex!', 'impossibly fast', 'too slow: ouch')}</text>
    <Readout given={scene.given} label={label} live={live} />
  </svg>
}

/** The clinic glucose monitor: the trace climbs after the drink and comes back to the healthy band. */
function Glucose({ scene, shown, fresh, label, live, cls }: Part) {
  const g = scene.glucose!
  const X = (min: number) => 22 + Math.min(240, min) * 148 / 240
  const Y = (mmol: number) => 116 - Math.max(0, Math.min(14, mmol)) * 92 / 14
  const peak = g.mode === 'rise' ? (fresh ? g.base : g.base + shown) : g.peak
  const back = g.mode === 'fall' ? (fresh ? g.peakAt : g.peakAt + shown) : g.backAt
  const d = `M${X(0)} ${Y(g.base)} L${X(10)} ${Y(g.base)} C${X(g.peakAt * 0.6)} ${Y(g.base)} ${X(g.peakAt * 0.7)} ${Y(peak)} ${X(g.peakAt)} ${Y(peak)}`
    + ` C${X(g.peakAt + (back - g.peakAt) * 0.4)} ${Y(peak)} ${X(back - Math.max(5, (back - g.peakAt) * 0.3))} ${Y(g.base)} ${X(back)} ${Y(g.base)} L${X(240)} ${Y(g.base)}`
  return <svg viewBox="0 0 320 200" className={`sr-board ${cls}`} role="img" aria-label={`Blood glucose monitor, ${label} ${live}`}>
    <rect x="6" y="10" width="172" height="134" rx="10" className="sr-mon" />
    <rect x="22" y={Y(7)} width="148" height={Y(4) - Y(7)} className="sr-band" />
    <text x="168" y={Y(7) - 4} textAnchor="end" className="sr-mon__tag">healthy</text>
    <line x1="22" y1="116" x2="170" y2="116" className="sr-axis" />
    {[0, 60, 120, 180].map(t => <text key={t} x={X(t)} y="134" textAnchor="middle" className="sr-mon__tag">{t}</text>)}
    {g.mode === 'rise' && <line x1="22" y1={Y(g.peak)} x2="170" y2={Y(g.peak)} className="sr-target" />}
    {g.mode === 'fall' && <line x1={X(g.backAt)} y1="20" x2={X(g.backAt)} y2="116" className="sr-target" />}
    <path d={d} className="sr-trace" fill="none" />
    <text x="92" y="160" textAnchor="middle" className="sr-tag">time after drink (min)</text>
    <text x="92" y="186" textAnchor="middle" className="sr-note">{note(cls, 'back in the band', g.mode === 'rise' ? 'spiked too high' : 'took too long', g.mode === 'rise' ? 'barely moved' : 'dropped too fast')}</text>
    <Readout given={scene.given} label={label} live={live} />
  </svg>
}

/** The clinic list as 20 dots: type 1 in orange, the dial colours in type 2. */
function Crowd({ scene, shown, fresh, label, live, cls }: Part) {
  const c = scene.crowd!
  const free = 20 - c.type1 - c.matched
  const marked = fresh ? 0 : Math.max(0, Math.min(free, Math.round(shown / c.per)))
  const over = !fresh && shown / c.per > free
  return <svg viewBox="0 0 320 200" className={`sr-board ${cls}`} role="img" aria-label={`Clinic list as 20 dots, ${label} ${live}`}>
    <rect x="6" y="14" width="172" height="148" rx="12" className="sr-room" />
    {Array.from({ length: 20 }, (_, i) => {
      const kind = i < c.type1 ? 'is-t1' : i < c.type1 + c.matched ? 'is-match' : i < c.type1 + c.matched + marked ? 'is-t2' : ''
      return <circle key={i} cx={30 + (i % 5) * 31} cy={38 + Math.floor(i / 5) * 33} r="12" className={`sr-dot ${kind}`} />
    })}
    {over && <text x="92" y="10" textAnchor="middle" className="sr-note">more than there are!</text>}
    <g className="sr-key">
      <circle cx="16" cy="180" r="6" className="sr-dot is-t2" /><text x="26" y="185">type 2</text>
      {c.type1 > 0 && <><circle cx="84" cy="180" r="6" className="sr-dot is-t1" /><text x="94" y="185">type 1</text></>}
    </g>
    <text x="186" y="194" className="sr-tag">{c.key}</text>
    <Readout given={scene.given} label={label} live={live} />
  </svg>
}

/** A month on the clinic calendar: day 1 of the cycle in red, the dial's date ringed. */
function Calendar({ scene, shown, answer, fresh, label, live, cls }: Part) {
  const start = scene.calendar!.start
  return <svg viewBox="0 0 320 200" className={`sr-board ${cls}`} role="img" aria-label={`Calendar, day 1 on the ${ordinal(start)}, ${label} ${live}`}>
    <rect x="6" y="10" width="172" height="164" rx="10" className="sr-room" />
    {'MTWTFSS'.split('').map((day, i) => <text key={i} x={20 + i * 24} y="30" textAnchor="middle" className="sr-tag">{day}</text>)}
    {Array.from({ length: 31 }, (_, i) => {
      const date = i + 1, cx = 20 + (i % 7) * 24, cy = 50 + Math.floor(i / 7) * 26
      const period = date >= start && date < start + 5
      const picked = !fresh && date === shown
      return <g key={date} className={`sr-day${period ? ' is-period' : ''}${picked ? ' is-picked' : ''}${date === answer && cls.includes('is-hit') ? ' is-egg' : ''}`}>
        <rect x={cx - 11} y={cy - 12} width="22" height="22" rx="6" />
        <text x={cx} y={cy + 4} textAnchor="middle">{date}</text>
      </g>
    })}
    <text x="92" y="192" textAnchor="middle" className="sr-note">{note(cls, 'day 14: ovulation', 'too late in the cycle', 'too early in the cycle')}</text>
    <Readout given={scene.given} label={label} live={live === '?' ? '?' : `the ${ordinal(shown)}`} />
  </svg>
}

/** The tracked days as one long bar, a tick every 28 days. The dial drops an egg every cycle at day 14. */
function Cycles({ scene, shown, fresh, label, live, cls }: Part) {
  const days = scene.days!, W = 160, X = (day: number) => 14 + day * W / days
  const eggs = fresh ? 0 : Math.max(0, Math.min(30, shown))
  return <svg viewBox="0 0 320 200" className={`sr-board ${cls}`} role="img" aria-label={`${days} tracked days, ${label} ${live}`}>
    <rect x="14" y="88" width={W} height="20" rx="6" className="sr-bar" />
    {Array.from({ length: Math.floor(days / 28) + 1 }, (_, i) => <line key={i} x1={X(i * 28)} y1="82" x2={X(i * 28)} y2="114" className="sr-tick" />)}
    {Array.from({ length: eggs }, (_, i) => {
      const x = X(14 + i * 28), out = 14 + i * 28 > days
      return <circle key={i} cx={Math.min(x, 178)} cy={out ? 70 : 76} r="5" className={`sr-egg${out ? ' is-out' : ''}`} />
    })}
    <text x="14" y="134" className="sr-tag">day 0</text>
    <text x="174" y="134" textAnchor="end" className="sr-tag">day {days}</text>
    <text x="92" y="166" textAnchor="middle" className="sr-note">{note(cls, 'one egg every cycle', 'more eggs than cycles', 'missed some cycles')}</text>
    <Readout given={scene.given} label={label} live={live} />
  </svg>
}

/** The ruler drop: the catch mark slides down the ruler with the dial (further = slower), beside the trial results. */
function Ruler({ scene, shown, fresh, label, live, cls }: Part) {
  const r = scene.ruler!
  const time = r.before !== undefined ? r.before - shown : shown
  const cm = fresh ? 0 : 490 * (time / 1000) ** 2
  const y = 24 + Math.min(52, Math.max(0, cm)) * 2.6
  const hit = cls.includes('is-hit')
  return <svg viewBox="0 0 320 200" className={`sr-board ${cls}`} role="img" aria-label={`Ruler drop test, ${label} ${live}`}>
    <g className="sr-ruler">
      <rect x="60" y="20" width="34" height="138" rx="3" className="sr-ruler__body" />
      {Array.from({ length: 11 }, (_, i) => <g key={i}>
        <line x1="60" y1={24 + i * 13} x2={i % 2 ? 68 : 74} y2={24 + i * 13} className="sr-tick" />
        {i % 2 === 0 && <text x="90" y={28 + i * 13} textAnchor="end" className="sr-ruler__num">{i * 5}</text>}
      </g>)}
    </g>
    <text x="40" y="24" textAnchor="middle" className="sr-tag">cm</text>
    <g className="sr-catch" style={{ transform: `translateY(${y - 24}px)` }}>
      <line x1="52" y1="24" x2="104" y2="24" className="sr-catch__line" />
      <text x="128" y="30" textAnchor="middle" className="sr-emoji">🤏</text>
    </g>
    {cm > 52 && <text x="77" y="178" textAnchor="middle" className="sr-note">missed it!</text>}
    <text x="77" y="194" textAnchor="middle" className="sr-note">{cm > 52 ? '' : r.before !== undefined ? note(cls, 'caught it', 'too quick', 'slow catch') : note(cls, 'caught it', 'slow catch', 'too quick')}</text>
    <g className="sr-trials">
      {r.before !== undefined && <><text x="186" y="22" className="sr-slot__name">Before</text><text x="188" y="44" className="sr-slot__value">{r.before} ms</text></>}
      <text x="186" y={r.before !== undefined ? 70 : 22} className="sr-slot__name">{r.before !== undefined ? 'After coffee (ms)' : 'Trials (ms)'}</text>
      {r.trials.map((t, i) => {
        const cx = 186 + (i % 3) * 44, cy = (r.before !== undefined ? 78 : 30) + Math.floor(i / 3) * 28
        const odd = i === r.anomaly
        return <g key={i} className={`sr-chip${odd ? ' is-odd' : ''}${odd && hit ? ' is-out' : ''}`}>
          <rect x={cx} y={cy} width="40" height="22" rx="6" />
          <text x={cx + 20} y={cy + 16} textAnchor="middle">{t}</text>
        </g>
      })}
    </g>
    <Readout given={[]} label={label} live={live} y={144} />
  </svg>
}

function Stage({ task, value, phase }: StageProps<Scene>) {
  const t = task as Task<Scene>
  const fresh = phase === 'set' && value === t.start
  const shown = phase === 'hit' ? t.answer : value
  const part: Part = { scene: t.scene, shown, answer: t.answer, fresh, label: t.label, live: fresh ? '?' : u(shown, t.unit), cls: mood(phase, value, t.answer) }
  switch (t.scene.layout) {
    case 'reflex': return <Reflex {...part} />
    case 'glucose': return <Glucose {...part} />
    case 'crowd': return <Crowd {...part} />
    case 'calendar': return <Calendar {...part} />
    case 'cycles': return <Cycles {...part} />
    default: return <Ruler {...part} />
  }
}

const config: DialGameConfig<Scene> = {
  labId: 'science-sugar',
  name: 'Sugar Rush',
  speaker: KEMI,
  intros: [
    'Morning! I’m Kemi, and this is the busiest diabetes and reflex clinic in the NHS. First patient just trod on a drawing pin. Let’s see how fast her nerves are.',
    'Next up, a glucose test. Sugary drink in, monitor on, and we watch the pancreas do its thing.',
    'Millions of people in the UK live with diabetes. Grab the clinic list: I need numbers for the team meeting.',
    'Hormone clinic this afternoon. All very professional, no giggling at the back.',
    'Boss round: the reaction time practical. Dev the porter has volunteered. Well, I volunteered him.',
  ],
  ranks: [
    { badge: '🏅', name: 'Consultant Endocrinologist', line: 'Every patient steady, first go. Hormones, nerves, the lot. The clinic is yours.' },
    { badge: '💉', name: 'Diabetes Specialist Nurse', line: 'A wobble or two, but every reading came back into the healthy band.' },
    { badge: '📋', name: 'Healthcare Assistant', line: 'You got there. Kemi double-checked the charts, though.' },
    { badge: '🍪', name: 'Biscuit Tin Guard', line: 'You’re guarding the biscuit tin for now. Back to the textbook, then back on shift.' },
  ],
  rule: [
    'Reflex arc: receptor → sensory → relay → motor neurone → effector. Speed = distance ÷ time.',
    'High blood glucose: the pancreas releases insulin, glucose moves into cells, the liver stores glycogen. Type 1: not enough insulin. Type 2: cells stop responding.',
    'Repeat trials, leave out anomalies, then find the mean. Change one variable; control the rest.',
  ],
  start: 'Start the clinic',
  action: 'Check it',
  asker: task => `Nurse Kemi · set the ${task.label.charAt(0).toLowerCase() + task.label.slice(1)}, then check it`,
  busted: {
    emoji: '🚨', kicker: 'Monitor alarm', title: 'Three slips. Kemi’s taking this patient back.',
    tip: 'Write the equation first: speed = distance ÷ time. A rise or a “how many more” is a difference: subtract. Leave anomalies out before you find a mean.',
    retry: 'Back on shift',
  },
  burst: '🍬',
  brag: (name, badge) => `I ran a whole diabetes clinic in Sugar Rush and kept every patient’s glucose steady. Rank: ${name} ${badge}`,
  again: 'Next clinic',
  sound: sfx.tick,
  Stage,
}

/** Fresh patients every play: the game remounts with a new set on "again". */
export default function SugarRush() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <DialGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

'use client'

import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { DialGame, type DialGameConfig, type Phase, type StageProps } from '../kit/DialGame'
import { u } from '../kit/types'
import { makeRounds, type Scene } from './rounds'
import './PitCrew.css'

const ADE: Speaker = {
  name: 'Chief Ade', emoji: '🎧',
  right: ['Box box, lovely. That’s a perfect lap.', 'Stopped on a sixpence. The sensors love you.', 'Textbook. I’m framing that telemetry.', 'Clean as a fresh set of tyres.', 'That’s pole-position physics, that is.'],
  wrong: ['Red flag! Check your numbers.', 'Ouch. The lollipop lady is NOT impressed.', 'Telemetry says no. Have another look.', 'That’s a drive-through penalty, mate.'],
}

/** How the run went: parked at the start, driving, on the line, stopped short or overshot. */
function moodOf(phase: Phase, value: number, answer: number) {
  if (phase === 'hit') return 'is-hit'
  if (phase === 'go') return 'is-go'
  if (phase === 'miss') return value > answer ? 'is-over' : 'is-short'
  return ''
}

/** How far along the run the car (or trolley) gets: 1 is the line. A miss is always clearly off it. */
function reach(phase: Phase, value: number, answer: number) {
  if (phase === 'set') return 0
  if (phase === 'hit') return 1
  const ratio = answer > 0 ? Math.max(0, value / answer) : 0
  if (phase === 'miss' && ratio >= 1) return Math.min(1.45, Math.max(1.18, ratio))
  if (phase === 'miss') return Math.min(ratio, 0.82)
  return Math.min(1.45, ratio)
}

/** A top-down electric car, nose pointing right, its front bumper at x = 0. */
function Car() {
  return <g className="pc-car">
    <rect x="-46" y="-13" width="46" height="26" rx="8" className="pc-car__body" />
    <rect x="-20" y="-10" width="11" height="20" rx="3" className="pc-car__glass" />
    <rect x="-40" y="-9" width="8" height="18" rx="3" className="pc-car__glass" />
    <rect x="-36" y="-15" width="9" height="4" rx="1.5" className="pc-car__tyre" /><rect x="-36" y="11" width="9" height="4" rx="1.5" className="pc-car__tyre" />
    <rect x="-13" y="-15" width="9" height="4" rx="1.5" className="pc-car__tyre" /><rect x="-13" y="11" width="9" height="4" rx="1.5" className="pc-car__tyre" />
    <circle cx="-26" cy="0" r="4" className="pc-car__lidar" />
    <rect x="-49" y="-11" width="3" height="6" rx="1" className="pc-car__brake" /><rect x="-49" y="5" width="3" height="6" rx="1" className="pc-car__brake" />
  </g>
}

/** A horizontal force arrow, starting at x and pointing `dir`, with its label above. */
function Arrow({ x, y, length, dir, label, tone }: { x: number; y: number; length: number; dir: 1 | -1; label: string; tone: 'fwd' | 'back' }) {
  const tip = x + dir * length
  return <g className={`pc-arrow pc-arrow--${tone}`}>
    <line x1={x} y1={y} x2={tip - dir * 7} y2={y} />
    <path d={`M${tip} ${y} L${tip - dir * 9} ${y - 6} L${tip - dir * 9} ${y + 6} Z`} />
    <text x={(x + tip) / 2} y={y - 8} textAnchor="middle">{label}</text>
  </g>
}


function Road({ scene, span, spanIsDial, phase, value, answer }: { scene: Scene; span?: string; spanIsDial: boolean; phase: Phase; value: number; answer: number }) {
  const START = scene.arrows ? 100 : 66, end = scene.zebra ? 246 : 284
  const line = START + (end - START) * (scene.lineAt ?? 1)
  const shift = (line - START) * reach(phase, value, answer)
  return <svg viewBox="0 0 320 156" className="pc-scene" role="img" aria-label={`The EV on the road, with the ${scene.goal.toLowerCase()} line ahead${scene.zebra ? ' and a zebra crossing beyond it' : ''}`}>
    <rect x="0" y="30" width="320" height="82" className="pc-road" />
    <line x1="0" y1="30" x2="320" y2="30" className="pc-kerb" /><line x1="0" y1="112" x2="320" y2="112" className="pc-kerb" />
    <line x1="0" y1="64" x2="320" y2="64" className="pc-lane" />
    <line x1={START} y1="68" x2={START} y2="112" className="pc-start" />
    {scene.lineAt !== undefined && <rect x={line} y="68" width={end - line} height="44" className="pc-brakezone" />}
    {scene.zebra && <g className="pc-zebra">
      {[0, 1, 2, 3, 4, 5, 6].map(i => <rect key={i} x="256" y={33 + i * 11.4} width="34" height="6.5" />)}
      <text x="306" y="62" textAnchor="middle" className="pc-ped">🚶🏾</text>
      <circle cx="306" cy="24" r="6" className="pc-beacon" />
    </g>}
    <line x1={line} y1="34" x2={line} y2="112" className="pc-goal" />
    <text x={Math.min(line, 300)} y="20" textAnchor={line > 250 ? 'end' : 'middle'} className="pc-goal__label">{scene.goal}</text>

    <g className="pc-mover" style={{ transform: `translateX(${shift}px)` }}>
      <g transform={`translate(${START} 90)`}><Car /></g>
    </g>
    {scene.arrows && phase === 'set' && <>
      <Arrow x={START - 23} y={52} length={72} dir={1} label={scene.arrows.forward} tone="fwd" />
      {scene.arrows.back && <Arrow x={START - 23} y={52} length={52} dir={-1} label={scene.arrows.back} tone="back" />}
    </>}

    {span && <g className={`pc-span${spanIsDial ? ' is-dial' : ''}`}>
      <line x1={START} y1="128" x2={line} y2="128" />
      <line x1={START} y1="122" x2={START} y2="134" /><line x1={line} y1="122" x2={line} y2="134" />
      <rect x={(START + line) / 2 - Math.max(34, span.length * 8.4 + 12) / 2} y="133" width={Math.max(34, span.length * 8.4 + 12)} height="21" rx="6" />
      <text x={(START + line) / 2} y="148" textAnchor="middle">{span}</text>
    </g>}
    <text x="314" y="148" textAnchor="end" className="pc-flag">{phase === 'hit' ? 'On the line ✓' : phase === 'miss' ? value > answer ? 'Overshot!' : 'Stopped short' : ''}</text>
  </svg>
}

/** The weighbridge: the car side-on, sitting on the plate, its weight arrow pulling down. */
function Weighbridge({ scene, live }: { scene: Scene; live: string }) {
  return <svg viewBox="0 0 320 156" className="pc-scene" role="img" aria-label="The EV side-on on a weighbridge, with its weight arrow pointing down">
    <line x1="0" y1="118" x2="320" y2="118" className="pc-ground" />
    <rect x="70" y="112" width="180" height="10" rx="2" className="pc-plate" />
    <g className="pc-sidecar">
      <path d="M92 104 L96 82 Q100 76 112 74 L134 58 Q140 54 150 54 L190 54 Q200 54 208 62 L222 74 Q236 76 236 86 L236 104 Z" className="pc-car__body" />
      <path d="M140 60 L152 60 L152 74 L124 74 Z M158 60 L188 60 Q194 60 198 64 L208 74 L158 74 Z" className="pc-car__glass" />
      <circle cx="122" cy="104" r="10" className="pc-car__tyre" /><circle cx="208" cy="104" r="10" className="pc-car__tyre" />
      <circle cx="122" cy="104" r="4" className="pc-hub" /><circle cx="208" cy="104" r="4" className="pc-hub" />
    </g>
    <g className="pc-arrow pc-arrow--down">
      <line x1="165" y1="80" x2="165" y2="136" />
      <path d="M165 146 L159 135 L171 135 Z" />
    </g>
    <text x="40" y="34" className="pc-goal__label">{scene.goal}</text>
    <g className="pc-span is-dial">
      <rect x="174" y="128" width={`W = ${live}`.length * 8.4 + 14} height="21" rx="6" />
      <text x="181" y="143">W = {live}</text>
    </g>
  </svg>
}

/** The practical: a trolley on the bench, pulled by hanging masses over a pulley, through a light gate. */
function Bench({ scene, phase, value, answer }: { scene: Scene; phase: Phase; value: number; answer: number }) {
  const start = 60, gate = 214
  const shift = (gate - start) * reach(phase, value, answer)
  const drop = Math.min(shift, 120) * 0.25
  return <svg viewBox="0 0 320 156" className="pc-scene" role="img" aria-label="A trolley pulled along a bench by hanging masses, through a light gate">
    <rect x="0" y="96" width="290" height="10" className="pc-bench" />
    <line x1="20" y1="106" x2="20" y2="156" className="pc-ground" /><line x1="270" y1="106" x2="270" y2="156" className="pc-ground" />
    <circle cx="292" cy="94" r="8" className="pc-pulley" />
    <g className="pc-gate"><rect x={gate - 3} y="52" width="6" height="44" rx="2" /><line x1={gate} y1="60" x2={gate} y2="94" className="pc-beam" /></g>
    <text x={gate} y="42" textAnchor="middle" className="pc-goal__label">{scene.goal}</text>
    <line x1={start + 4 + shift} y1="80" x2="292" y2="86" className="pc-string" />
    <g className="pc-hang" style={{ transform: `translateY(${drop}px)` }}>
      <line x1="300" y1="94" x2="300" y2="110" className="pc-string" />
      <rect x="292" y="110" width="16" height="22" rx="2" className="pc-weight" />
    </g>
    <g className="pc-mover" style={{ transform: `translateX(${shift}px)` }}>
      <rect x={start - 48} y="66" width="52" height="22" rx="4" className="pc-car__body" />
      <rect x={start - 46} y="56" width="10" height="10" rx="1" className="pc-card" />
      <circle cx={start - 36} cy="90" r="6" className="pc-car__tyre" /><circle cx={start - 8} cy="90" r="6" className="pc-car__tyre" />
    </g>
    <text x="314" y="24" textAnchor="end" className="pc-flag">{phase === 'hit' ? 'Through the gate ✓' : phase === 'miss' ? value > answer ? 'Too fast!' : 'Too slow' : ''}</text>
  </svg>
}

function Stage({ task, value, phase }: StageProps<Scene>) {
  const scene = task.scene
  const live = phase === 'hit' ? u(task.answer, task.unit) : phase === 'set' && value === task.start ? '?' : u(value, task.unit)
  const mood = moodOf(phase, value, task.answer)
  const spanIsDial = !scene.span && task.unit === 'm'
  const span = scene.span ?? (spanIsDial ? live : undefined)
  return <div className={`pc-stage ${mood}`}>
    {scene.look === 'road' && <Road scene={scene} span={span} spanIsDial={spanIsDial} phase={phase} value={value} answer={task.answer} />}
    {scene.look === 'weigh' && <Weighbridge scene={scene} live={live} />}
    {scene.look === 'trolley' && <Bench scene={scene} phase={phase} value={value} answer={task.answer} />}
    <dl className="pc-dash" aria-label="Telemetry">
      {scene.rows.map(([name, text]) => <div key={name}><dt>{name}</dt><dd>{text}</dd></div>)}
      <div className="is-dial"><dt>{scene.dial}</dt><dd>{live}</dd></div>
    </dl>
  </div>
}

const config: DialGameConfig<Scene> = {
  labId: 'science-pit',
  name: 'Pit Crew',
  speaker: ADE,
  intros: [
    'Welcome to the crew. Brand-new self-driving EV, built in Coventry. First job: the test track. Tell it how fast it’s going.',
    'Big one. There’s a zebra crossing outside the primary school. This car stops before the stripes, every time, or it doesn’t go on the road.',
    'Launch control. The motor pushes, the air pushes back. Get me the numbers that actually move the car.',
    'Slip road onto the dual carriageway, then it’s on the weighbridge for the regulators. Acceleration first, then weight.',
    'Last job, and it’s the required practical. The trolley on the bench is how we prove F = m a. Make it count.',
  ],
  ranks: [
    { badge: '🏆', name: 'Race Engineer', line: 'Every stop on the line, first go. Chief Ade wants you on the pit wall.' },
    { badge: '🏁', name: 'Pit Crew Pro', line: 'A couple of wobbles, but the car’s road-legal. Proper job.' },
    { badge: '🔧', name: 'Junior Mechanic', line: 'You got it over the line. The lollipop lady is still a bit nervous.' },
    { badge: '🛞', name: 'Tyre Fetcher', line: 'Back to fetching tyres for now. Run the numbers again.' },
  ],
  rule: ['Speed = distance ÷ time. Stopping distance = thinking + braking; thinking = speed × reaction time.', 'Resultant force = bigger − smaller (opposite ways). F = m × a, so a = F ÷ m.', 'a = change in velocity ÷ time. Weight W = m × g, with g = 9.8 N/kg.'],
  start: 'Into the garage',
  action: 'Send it',
  asker: task => `Chief Ade · set the ${task.label.toLowerCase()}, then send it`,
  busted: {
    emoji: '🚩', kicker: 'Red flag', title: 'Three bad runs. The car’s back in the garage.',
    tip: 'Write the equation first, then swap in the numbers. Stopping distance is thinking PLUS braking. Use the RESULTANT force in F = m a. Acceleration uses the CHANGE in velocity.',
    retry: 'Back out on track',
  },
  burst: '🏁',
  brag: (name, badge) => `I tuned a self-driving EV in Pit Crew so it stops bang on the line at the zebra crossing. Rank: ${name} ${badge}`,
  again: 'New test day',
  sound: sfx.whoosh,
  actionMs: 900,
  Stage,
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function PitCrew() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <DialGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

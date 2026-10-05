'use client'

import type { CSSProperties, ReactNode } from 'react'
import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { DialGame, type DialGameConfig, type Phase, type StageProps } from '../kit/DialGame'
import { u } from '../kit/types'
import { makeRounds, type Scene } from './rounds'
import './SkyShield.css'

const OKORO: Speaker = {
  name: 'Squadron Leader Okoro', emoji: '👩🏿‍✈️',
  right: ['Textbook. The control tower just cheered.', 'That’s Sky Shield standard. Proud of you.', 'Smooth as a Red Arrows flypast.', 'Bang on. I’m putting that in your service record.', 'Runway’s safer already. Lovely work, engineer.'],
  wrong: ['Abort, abort. Check those numbers.', 'The drone’s sulking on the tarmac. Try again.', 'Close, but the rogue drone is laughing at us.', 'Deep breath. Engineers check, then check again.'],
}

/** How the flight went: on the pad, flying, on target, short or overshot. */
function moodOf(phase: Phase, value: number, answer: number) {
  if (phase === 'hit') return 'is-hit'
  if (phase === 'go') return 'is-go'
  if (phase === 'miss') return value > answer ? 'is-over' : 'is-short'
  return ''
}

/** How far along its flight the drone gets: 1 is the target. A miss is always clearly off it. */
function reach(phase: Phase, value: number, answer: number, cap = 1.4) {
  if (phase === 'set') return 0
  if (phase === 'hit') return 1
  const ratio = answer > 0 ? Math.max(0, value / answer) : 0
  if (phase === 'miss' && ratio >= 1) return Math.min(cap, Math.max(1.2, ratio))
  if (phase === 'miss') return Math.min(ratio, 0.75)
  return Math.min(cap, ratio)
}

/** Our defence drone, side-on: a quadcopter with two rotor pairs and a net pod underneath. Centred on 0,0. */
function Quad() {
  return <g className="ss-quad">
    <line x1="-26" y1="-4" x2="26" y2="-4" className="ss-quad__arm" />
    <line x1="-26" y1="-4" x2="-26" y2="-10" className="ss-quad__arm" /><line x1="26" y1="-4" x2="26" y2="-10" className="ss-quad__arm" />
    <ellipse cx="-26" cy="-11" rx="15" ry="2.6" className="ss-rotor" /><ellipse cx="26" cy="-11" rx="15" ry="2.6" className="ss-rotor" />
    <rect x="-13" y="-9" width="26" height="13" rx="5" className="ss-quad__body" />
    <rect x="-6" y="-6" width="12" height="4" rx="2" className="ss-quad__visor" />
    <path d="M-8 4 L-11 12 M8 4 L11 12" className="ss-quad__arm" />
    <rect x="-6" y="4" width="12" height="7" rx="2" className="ss-quad__pod" />
    <circle cx="0" cy="-12" r="1.6" className="ss-quad__beacon" />
  </g>
}

/** The rogue drone: smaller, scruffier, red light blinking. Centred on 0,0. */
function Rogue({ netted }: { netted: boolean }) {
  return <g className={`ss-rogue${netted ? ' is-netted' : ''}`}>
    <line x1="-17" y1="-3" x2="17" y2="-3" className="ss-rogue__arm" />
    <ellipse cx="-17" cy="-7" rx="10" ry="2" className="ss-rotor ss-rotor--rogue" /><ellipse cx="17" cy="-7" rx="10" ry="2" className="ss-rotor ss-rotor--rogue" />
    <rect x="-8" y="-7" width="16" height="9" rx="3" className="ss-rogue__body" />
    <circle cx="0" cy="5" r="2.2" className="ss-rogue__light" />
    <g className="ss-net">
      <circle r="22" className="ss-net__ring" />
      <path d="M-20 -9 L20 9 M-20 9 L20 -9 M-9 -20 L9 20 M9 -20 L-9 20 M-22 0 H22 M0 -22 V22" className="ss-net__mesh" />
    </g>
  </g>
}

/** The night sky over the airport: stars, a runway with lights and the control tower. */
function Sky({ children, label }: { children: ReactNode; label: string }) {
  return <svg viewBox="0 0 320 190" className="ss-scene" role="img" aria-label={label}>
    <rect x="0" y="0" width="320" height="190" className="ss-sky" />
    {[[22, 18], [64, 34], [118, 12], [176, 28], [232, 14], [292, 36], [300, 10], [90, 52], [204, 48]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" className="ss-star" />)}
    <rect x="0" y="166" width="320" height="24" className="ss-ground" />
    <rect x="0" y="172" width="320" height="10" className="ss-runway" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <rect key={i} x={10 + i * 40} y="176" width="20" height="2" className="ss-runway__dash" />)}
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => <circle key={i} cx={20 + i * 35} cy="185" r="1.8" className="ss-runway__light" />)}
    <g className="ss-tower"><rect x="292" y="128" width="10" height="38" /><rect x="286" y="118" width="22" height="12" rx="2" /><rect x="289" y="121" width="16" height="5" className="ss-tower__glass" /></g>
    {children}
  </svg>
}

/** A tag for a value on the scene. The dial's own tag gets the dashed box. */
function Tag({ x, y, text, dial = false, anchor = 'middle' }: { x: number; y: number; text: string; dial?: boolean; anchor?: 'start' | 'middle' | 'end' }) {
  const width = Math.max(34, text.length * 8 + 12)
  const left = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x
  return <g className={`ss-tag${dial ? ' is-dial' : ''}`}>
    <rect x={left} y={y - 15} width={width} height="21" rx="6" />
    <text x={anchor === 'middle' ? x : anchor === 'end' ? x - 6 : x + 6} y={y} textAnchor={anchor}>{text}</text>
  </g>
}

const PAD = 148, HOVER = 58

/** Lift-off and power: our drone on the pad, climbing to the hover line. */
function Launch({ scene, live, phase, value, answer }: { scene: Scene; live: string; phase: Phase; value: number; answer: number }) {
  const climb = (PAD - HOVER) * reach(phase, value, answer)
  const power = scene.look === 'power'
  return <Sky label={`Our defence drone on the launch pad, with the ${scene.goal.toLowerCase()} line above it`}>
    <line x1="40" y1={HOVER} x2="260" y2={HOVER} className="ss-goal" />
    <text x="260" y={HOVER - 8} textAnchor="end" className="ss-goal__label">{scene.goal}</text>
    <rect x="128" y="160" width="64" height="6" rx="2" className="ss-pad" />
    <g className="ss-mover" style={{ transform: `translateY(${-climb}px)` }}>
      <g transform={`translate(160 ${PAD})`}>
        <Quad />
        {scene.arrows && phase === 'set' && <>
          <g className="ss-arrow ss-arrow--up"><line x1="34" y1="-6" x2="34" y2="-46" /><path d="M34 -54 L28 -44 L40 -44 Z" /><text x="42" y="-34">{scene.arrows.up}</text></g>
          <g className="ss-arrow ss-arrow--down"><line x1="-34" y1="0" x2="-34" y2="30" /><path d="M-34 38 L-40 28 L-28 28 Z" /><text x="-42" y="24" textAnchor="end">{scene.arrows.down}</text></g>
        </>}
        <text className="ss-sparks" x="0" y="-18" textAnchor="middle">⚡</text>
      </g>
    </g>
    {power && <g className="ss-battery" transform="translate(16 120)">
      <rect width="34" height="18" rx="3" /><rect x="34" y="5" width="3" height="8" rx="1" />
      <rect x="3" y="3" width={phase === 'set' ? 28 : phase === 'hit' ? 20 : 10} height="12" rx="1.5" className="ss-battery__charge" />
    </g>}
    <Tag x={6} y={24} text={`${scene.dial}: ${live}`} dial anchor="start" />
    <text x="314" y="24" textAnchor="end" className="ss-flag">{phase === 'hit' ? 'Hovering ✓' : phase === 'miss' ? value > answer ? (power ? 'Overloaded!' : 'Overshot!') : 'Can’t climb' : ''}</text>
  </Sky>
}

const DISH = { x: 40, y: 150 }, TARGET = { x: 250, y: 62 }

/** Track it: the sensor dish hears the buzz, then pings the rogue drone and times the echo. */
function Track({ scene, live, phase, value, answer, task }: { scene: Scene; live: string; phase: Phase; value: number; answer: number; task: string }) {
  const wave = task === 'track-1'
  const along = reach(phase, value, answer, 1.3)
  const dx = TARGET.x - DISH.x, dy = TARGET.y - DISH.y
  const length = Math.hypot(dx, dy), angle = Math.atan2(dy, dx) * 180 / Math.PI
  // The buzz drawn as a wave from the drone to the dish: its wavelength follows the dial (the answer is 28 px).
  const shown = phase === 'hit' ? answer : value
  const px = shown > 0 && answer > 0 ? Math.min(90, Math.max(8, 28 * shown / answer)) : 0
  let path = ''
  if (px) for (let s = 0; s <= length - 26; s += 2) path += `${s ? 'L' : 'M'}${(s + 14).toFixed(1)} ${(6 * Math.sin(2 * Math.PI * s / px)).toFixed(1)} `
  return <Sky label="The sensor dish on the airfield, tracking the rogue drone in the night sky">
    <g className="ss-sweep" transform={`translate(${DISH.x} ${DISH.y})`}><path d="M0 0 L70 -24 A74 74 0 0 1 60 -44 Z" /></g>
    <g transform={`translate(${DISH.x} ${DISH.y})`} className="ss-dish">
      <line x1="0" y1="0" x2="0" y2="16" /><path d="M-14 -4 Q0 12 14 -14" className="ss-dish__bowl" /><circle cx="6" cy="-4" r="2.5" />
    </g>
    <g transform={`translate(${DISH.x} ${DISH.y}) rotate(${angle})`}>
      <line x1="14" y1="0" x2={length - 26} y2="0" className="ss-path" />
      {wave && path && <path d={path} className={`ss-buzz${phase === 'go' || phase === 'hit' ? ' is-live' : ''}`} />}
      {!wave && phase !== 'set' && <g className="ss-ping" style={{ transform: `translateX(${(length - 30) * along}px)` }}><circle cx="14" r="5" /><path d="M20 -8 Q26 0 20 8" /></g>}
    </g>
    <g transform={`translate(${TARGET.x} ${TARGET.y})`}>
      <Rogue netted={false} />
      <g className="ss-lock"><circle r="20" /><path d="M-26 0 H-14 M14 0 H26 M0 -26 V-14 M0 14 V26" /></g>
    </g>
    <text x={TARGET.x} y={TARGET.y - 26} textAnchor="middle" className="ss-goal__label">{scene.goal}</text>
    <Tag x={196} y={140} text={`${wave ? 'λ' : 'd'} = ${live}`} dial />
    <text x="8" y="24" className="ss-flag">{phase === 'hit' ? 'Locked on ✓' : phase === 'miss' ? 'Lost it!' : ''}</text>
  </Sky>
}

/** Intercept: the net-drone flies across to the rogue drone and nets it on a hit. */
function Chase({ scene, live, phase, value, answer }: { scene: Scene; live: string; phase: Phase; value: number; answer: number }) {
  const start = { x: 46, y: 104 }, end = { x: 238, y: 70 }
  const r = reach(phase, value, answer, 1.3)
  const style: CSSProperties = { transform: `translate(${(end.x - start.x) * r}px, ${(end.y - start.y) * r}px)` }
  return <Sky label="Our net-drone flying to intercept the rogue drone over the runway">
    <line x1={start.x} y1={start.y} x2={end.x + 22} y2={end.y - 4} className="ss-path" />
    <g transform={`translate(${end.x + 30} ${end.y - 6})`}><Rogue netted={phase === 'hit'} /></g>
    <text x={end.x + 30} y={end.y - 34} textAnchor="middle" className="ss-goal__label">{scene.goal}</text>
    <g className="ss-mover" style={style}><g transform={`translate(${start.x} ${start.y})`}><Quad /></g></g>
    <Tag x={160} y={150} text={`${scene.dial}: ${live}`} dial />
    <text x="8" y="24" className="ss-flag">{phase === 'hit' ? 'Netted ✓' : phase === 'miss' ? value > answer ? 'Overshot!' : 'Fell short' : ''}</text>
  </Sky>
}

/** The required practical: a ripple tank from above, crests cast as bright lines, a ruler underneath. */
function Tank({ scene, live, phase }: { scene: Scene; live: string; phase: Phase }) {
  const { waves, cm } = scene.tank ?? { waves: 10, cm: 50 }
  const left = 44, width = 240, gap = width / waves
  return <svg viewBox="0 0 320 190" className="ss-scene ss-scene--tank" role="img" aria-label={`A ripple tank from above: ${waves} waves across ${cm} cm of ruler`}>
    <rect x="10" y="12" width="300" height="118" rx="10" className="ss-tank" />
    <rect x="18" y="20" width="12" height="102" rx="3" className="ss-bar" />
    <clipPath id="ss-tank-clip"><rect x="32" y="20" width="270" height="102" /></clipPath>
    <g clipPath="url(#ss-tank-clip)">
      <g className={`ss-crests${phase === 'go' || phase === 'hit' ? ' is-live' : ''}`} style={{ '--ss-gap': `${gap}px` } as CSSProperties}>
        {Array.from({ length: waves + 3 }, (_, i) => <line key={i} x1={left + (i - 1) * gap} y1="20" x2={left + (i - 1) * gap} y2="122" />)}
      </g>
    </g>
    <rect x={left - 4} y="138" width={width + 8} height="14" rx="2" className="ss-ruler" />
    {Array.from({ length: waves + 1 }, (_, i) => <line key={i} x1={left + i * gap} y1="138" x2={left + i * gap} y2="145" className="ss-ruler__tick" />)}
    <text x={left} y="168" className="ss-goal__label">0</text>
    <text x={left + width} y="168" textAnchor="end" className="ss-goal__label">{cm} cm</text>
    <g className="ss-bracket"><line x1={left} y1="30" x2={left + gap} y2="30" /><line x1={left} y1="25" x2={left} y2="35" /><line x1={left + gap} y1="25" x2={left + gap} y2="35" /></g>
    <Tag x={left + width / 2} y={186} text={`${scene.dial}: ${live}`} dial />
    <text x="300" y="34" textAnchor="end" className="ss-flag ss-flag--tank">{phase === 'hit' ? 'Calibrated ✓' : phase === 'miss' ? 'Re-measure!' : ''}</text>
  </svg>
}

function Stage({ task, value, phase }: StageProps<Scene>) {
  const scene = task.scene
  const live = phase === 'hit' ? u(task.answer, task.unit) : phase === 'set' && value === task.start ? '?' : u(value, task.unit)
  const mood = moodOf(phase, value, task.answer)
  const props = { scene, live, phase, value, answer: task.answer }
  return <div className={`ss-stage ${mood}`}>
    {(scene.look === 'lift' || scene.look === 'power') && <Launch {...props} />}
    {scene.look === 'track' && <Track {...props} task={task.id} />}
    {scene.look === 'chase' && <Chase {...props} />}
    {scene.look === 'tank' && <Tank scene={scene} live={live} phase={phase} />}
    <dl className="ss-dash" aria-label="Ops panel">
      {scene.rows.map(([name, text]) => <div key={name}><dt>{name}</dt><dd>{text}</dd></div>)}
      <div className="is-dial"><dt>{scene.dial}</dt><dd>{live}</dd></div>
    </dl>
  </div>
}

const config: DialGameConfig<Scene> = {
  labId: 'science-shield',
  name: 'Sky Shield',
  speaker: OKORO,
  intros: [
    'Welcome to Sky Shield, engineer. Rogue drones have shut the runway and four hundred passengers are waiting. First, get our net-drone off the ground.',
    'It flies! Now it needs to stay up. Every rotor is an electric motor, and the battery only holds so much. Work out the power.',
    'Ops room. The rogue drone is out there in the dark. Our sensors can hear its propellers. Find it.',
    'We’ve got a lock. Launch the net-drone, work out the timing, and bring that rogue drone down safely.',
    'Runway’s open again. Brilliant. Before we sign the sensors off, the boss wants the ripple-tank practical. Engineers prove it on the bench.',
  ],
  ranks: [
    { badge: '🛡️', name: 'Chief Engineer, Sky Shield', line: 'Every drone netted, first go. The RAF would snap you up tomorrow.' },
    { badge: '🎖️', name: 'Flight Systems Engineer', line: 'A wobble or two, but the runway is open. Proper defence engineering.' },
    { badge: '🔧', name: 'Defence Apprentice', line: 'You got the job done. Squadron Leader Okoro sees big things ahead.' },
    { badge: '📻', name: 'Cadet on Radio Duty', line: 'Back to the radio for now. Run the numbers again and earn your wings.' },
  ],
  rule: ['Weight W = m × g (g = 9.8 N/kg). Resultant = thrust − weight.', 'Power P = V × I. Flight time t = E ÷ P. Echo distance = speed × time ÷ 2.', 'Wave speed v = f × λ. Time = distance ÷ speed. Eₖ = ½ m v².'],
  start: 'To the hangar',
  action: 'Launch',
  asker: task => `${OKORO.name} · set the ${task.label.replace(/ [A-Za-zλ]$/, '').toLowerCase()}, then launch`,
  busted: {
    emoji: '🪂', kicker: 'Mission paused', title: 'Three drones back on the pad. The runway’s still shut.',
    tip: 'Write the equation first, then swap in the numbers. Weight is m × 9.8. An echo goes there and back, so halve it. In ½ m v², only the speed is squared.',
    retry: 'Back to the hangar',
  },
  burst: '🛡️',
  brag: (name, badge) => `I netted the rogue drones and reopened the runway in Sky Shield. Rank: ${name} ${badge}`,
  again: 'New mission',
  sound: sfx.whoosh,
  actionMs: 900,
  Stage,
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function SkyShield() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <DialGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

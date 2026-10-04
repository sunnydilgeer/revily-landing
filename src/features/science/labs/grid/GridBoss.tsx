'use client'

import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { DialGame, type DialGameConfig, type Phase, type StageProps } from '../kit/DialGame'
import { u } from '../kit/types'
import { makeRounds, type Scene } from './rounds'
import './GridBoss.css'

const GARY: Speaker = {
  name: 'Gridlock Gary', emoji: '🎧',
  right: ['Fifty hertz, rock steady. Somebody get this legend a biscuit.', 'Lights on, kettles on, Britain lives. Beautiful.', 'Nailed it. I’m not crying, it’s the air con.', 'That’s grid-boss behaviour right there.', 'Bang on. The nation’s tea is safe.'],
  wrong: ['The frequency’s wobbling! Somebody’s toast just went cold!', 'Half of Leeds just went dark. LEEDS.', 'Alarms! Why is it always alarms?', 'Nope. That’s a power cut and an angry tweet.'],
}

/** The grid's mood: humming while you set, surging on Go, then steady, sagging (too low) or overloaded (too high). */
function gridMood(phase: Phase, value: number, answer: number) {
  if (phase === 'hit') return 'is-on'
  if (phase === 'go') return 'is-go'
  if (phase === 'miss') return value > answer ? 'is-high' : 'is-low'
  return ''
}

const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x))

/** The 50 Hz frequency meter: steady when supply matches demand. */
function Hertz({ x, y }: { x: number; y: number }) {
  return <g className="gb-hz" transform={`translate(${x} ${y})`} aria-hidden="true">
    <rect x="-38" y="-34" width="76" height="52" rx="8" className="gb-hz__face" />
    <path d="M-26 0 A26 26 0 0 1 26 0" className="gb-hz__arc" />
    <path d="M-5 -25.5 A26 26 0 0 1 5 -25.5" className="gb-hz__safe" />
    <g className="gb-hz__needle"><line x1="0" y1="0" x2="0" y2="-24" /><circle r="3.5" /></g>
    <text y="15" textAnchor="middle" className="gb-hz__label">50 Hz</text>
  </g>
}

/** A row of houses and flats, windows lit by the grid. */
function Skyline({ y }: { y: number }) {
  const blocks = [[0, 34, 38], [36, 26, 54], [64, 40, 30], [106, 30, 62], [138, 44, 40], [184, 26, 48], [212, 38, 34], [252, 30, 58], [284, 36, 42]]
  return <g className="gb-city" aria-hidden="true">
    {blocks.map(([x, w, h], i) => <g key={i}>
      <rect x={x} y={y - h} width={w} height={h} className="gb-block" />
      {Array.from({ length: Math.floor((h - 8) / 12) }, (_, r) => Array.from({ length: Math.floor((w - 6) / 10) }, (_, c) =>
        <rect key={`${r}-${c}`} x={x + 5 + c * 10} y={y - h + 6 + r * 12} width="5" height="6" className={`gb-win gb-win--${(i + r + c) % 3}`} />))}
    </g>)}
    <text x="40" y={y - 62} className="gb-pop">💥</text><text x="250" y={y - 66} className="gb-pop">💥</text>
  </g>
}

/** A label in the scene. The dial's one gets a highlighted box. */
function Tag({ x, y, text, dial = false, anchor = 'middle' }: { x: number; y: number; text: string; dial?: boolean; anchor?: 'start' | 'middle' | 'end' }) {
  const width = Math.max(34, text.length * 8.2 + 12)
  const left = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x
  return <g className={`gb-tag${dial ? ' is-dial' : ''}`}>
    {dial && <rect x={left} y={y - 15} width={width} height="21" rx="6" />}
    <text x={anchor === 'middle' ? x : anchor === 'end' ? x - 6 : x + 6} y={y} textAnchor={anchor}>{text}</text>
  </g>
}

function Kettle({ x, y }: { x: number; y: number }) {
  return <g className="gb-kettle" transform={`translate(${x} ${y})`}>
    <path className="gb-steam" d="M-4 -34 q-6 -8 0 -16 q6 -8 0 -16 M6 -34 q-6 -8 0 -16" />
    <path className="gb-kettle__body" d="M-20 0 L-16 -28 Q0 -36 16 -28 L20 0 Z" />
    <path className="gb-kettle__line" d="M20 -22 Q32 -18 26 -6 M-20 -16 L-30 -26" />
    <rect x="-22" y="0" width="44" height="5" rx="2" className="gb-kettle__base" />
  </g>
}

function Turbine({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${size})`}>
    <path d="M-2 0 L-4 70 L4 70 L2 0 Z" className="gb-mast" />
    <g className="gb-rotor">
      {[0, 120, 240].map(a => <path key={a} d="M0 0 C4 -10 3 -30 0 -38 C-3 -30 -4 -10 0 0" transform={`rotate(${a})`} className="gb-blade" />)}
      <circle r="3.5" className="gb-hub" />
    </g>
  </g>
}

type SceneProps = { scene: Scene; value: number; max: number; live: string }

function SurgeScene({ live }: SceneProps) {
  return <>
    <Skyline y={178} />
    <Kettle x={50} y={86} /><Kettle x={112} y={86} />
    <Tag x={180} y={50} text={live} dial />
    <Hertz x={274} y={44} />
  </>
}

function PlantScene({ scene, value, live }: SceneProps) {
  const { sankey, plant } = scene
  const share = sankey?.mode === 'eff' ? clamp(value / 100) : clamp(1 - value / (sankey?.total ?? 1))
  const W = 46, useful = Math.max(3, W * share), waste = Math.max(3, W - useful)
  return <>
    {plant === 'gas'
      ? <g className="gb-plant">
        <path d="M18 150 L26 90 Q34 80 42 90 L50 150 Z" className="gb-tower" />
        <rect x="56" y="70" width="10" height="80" className="gb-stack" />
        <rect x="52" y="112" width="34" height="38" className="gb-hall" />
        <path className="gb-steam gb-steam--big" d="M30 82 q-8 -10 0 -20 q8 -10 0 -20 M40 80 q-8 -10 0 -18" />
        <text x="16" y="172" className="gb-note">Gas station</text>
      </g>
      : <g><path d="M0 150 Q40 142 80 150 T160 150" className="gb-sea" /><Turbine x={50} y={80} /><text x="12" y="172" className="gb-note">Offshore wind</text></g>}
    {/* Sankey: energy in on the left, useful straight on, wasted bending down. */}
    <g className="gb-sankey">
      <rect x="106" y={60} width="50" height={W} className="gb-flow" />
      <rect x="156" y={60} width="76" height={useful} className="gb-flow gb-flow--use" />
      <path d={`M156 ${60 + useful} H180 Q${190 + waste} ${60 + useful} ${190 + waste} ${80 + W} V150 H190 V${80 + W} Q190 ${60 + W} 170 ${60 + W} H156 Z`} className="gb-flow gb-flow--waste" />
      <text x="238" y={60 + useful / 2 + 5} className="gb-note">useful</text>
      <text x={198 + waste} y="146" className="gb-note">wasted</text>
    </g>
    <Tag x={160} y={32} text={live} dial />
    <Hertz x={274} y={44} />
  </>
}

function HydroScene({ scene, value, max, live }: SceneProps) {
  const up = scene.hydro === 'up', fill = clamp(value / max)
  const top = 66 - 20 * (up ? fill : 1 - fill * 0.6)
  return <>
    <path d="M0 176 L0 120 L40 70 L70 82 L110 40 L150 60 L180 56 L220 120 L250 136 L320 140 L320 176 Z" className="gb-mountain" />
    <path d={`M84 ${top} H156 L150 66 H92 Z`} className="gb-lake" />
    <path d="M150 64 Q190 100 214 150" className={`gb-pipe${up ? ' is-up' : ''}`} />
    <rect x="206" y="138" width="34" height="22" rx="3" className="gb-hall" />
    <path d="M240 162 H320 V176 H200 V162 Z" className="gb-lake" />
    <text x="86" y="32" className="gb-note">Dinorwig, Wales</text>
    <Tag x={120} y={104} text={live} dial />
    <Hertz x={274} y={44} />
  </>
}

function MixScene({ scene, value, live }: SceneProps) {
  const mix = scene.mix!
  const gas = Math.min(mix.gas ?? value, mix.demand * 1.25 - mix.nuclear - mix.wind - mix.solar), scale = 2.4, base = 160, x = 116, w = 64
  const parts: [string, number][] = [['nuclear', mix.nuclear], ['wind', mix.wind], ['solar', mix.solar], ['gas', gas]]
  let y = base
  const demandY = base - mix.demand * scale
  return <>
    <rect x={x - 6} y={demandY - 4} width={w + 12} height={base - demandY + 8} rx="6" className="gb-panel" />
    {parts.map(([name, gw]) => { y -= gw * scale; return <rect key={name} x={x} y={y} width={w} height={Math.max(0, gw * scale)} className={`gb-bar gb-bar--${name}`} /> })}
    <line x1={x - 14} x2={x + w + 14} y1={demandY} y2={demandY} className="gb-demand" />
    <text x={x + w / 2} y={demandY - 10} textAnchor="middle" className="gb-note">demand {mix.demand} GW</text>
    <g className="gb-key">
      {(['nuclear', 'wind', 'solar', 'gas'] as const).map((name, i) => <g key={name} transform={`translate(8 ${30 + i * 20})`}>
        <rect width="13" height="13" rx="3" className={`gb-bar gb-bar--${name}`} /><text x="19" y="11.5" className="gb-note">{name}</text>
      </g>)}
    </g>
    <Tag x={x + w + 14} y={demandY + 60} text={live} dial anchor="start" />
    <Hertz x={274} y={44} />
  </>
}

function HeatScene({ scene, value, max, live }: SceneProps) {
  const level = clamp(value / max), mercury = 12 + 88 * level
  return <>
    {scene.vessel === 'kettle'
      ? <g transform="translate(70 150) scale(1.9)"><Kettle x={0} y={0} /></g>
      : <g className="gb-beaker">
        <rect x="26" y="70" width="88" height="86" rx="4" className="gb-lagging" />
        <path d="M36 66 V150 H104 V66" className="gb-glass" />
        <rect x="38" y="84" width="64" height="64" className="gb-water" />
        <rect x="58" y="44" width="8" height="94" rx="4" className="gb-heater" />
        <text x="16" y="174" className="gb-note">insulated beaker</text>
      </g>}
    <g className="gb-thermo" transform="translate(150 40)">
      <rect x="-6" width="12" height="112" rx="6" className="gb-thermo__tube" />
      <rect x="-3" y={112 - mercury} width="6" height={mercury} rx="3" className="gb-thermo__mercury" />
      <circle cy="114" r="9" className="gb-thermo__bulb" />
    </g>
    <Tag x={226} y={112} text={live} dial />
    <Hertz x={274} y={44} />
  </>
}

function Stage({ task, value, phase }: StageProps<Scene>) {
  const scene = task.scene
  const live = phase === 'hit' ? u(task.answer, task.unit) : phase === 'set' && value === task.start ? '?' : u(value, task.unit)
  const shown = phase === 'hit' ? task.answer : value
  const dial = scene.rows.find(row => row.value === undefined)?.name ?? task.label
  const mood = gridMood(phase, value, task.answer)
  const props: SceneProps = { scene, value: shown, max: task.max, live }
  return <div className={`gb-stage ${mood}`}>
    <svg viewBox="0 0 320 180" className="gb-scene" role="img" aria-label={`National Grid control room: ${dial} is ${live}`}>
      {scene.layout === 'surge' && <SurgeScene {...props} />}
      {scene.layout === 'plant' && <PlantScene {...props} />}
      {scene.layout === 'hydro' && <HydroScene {...props} />}
      {scene.layout === 'mix' && <MixScene {...props} />}
      {scene.layout === 'heat' && <HeatScene {...props} />}
    </svg>
    <dl className="gb-readout" aria-label="Control room readout">
      {scene.rows.map(row => <div key={row.name} className={row.value === undefined ? 'is-dial' : ''}>
        <dt>{row.name}</dt><dd>{row.value ?? live}</dd>
      </div>)}
    </dl>
  </div>
}

const config: DialGameConfig<Scene> = {
  labId: 'science-grid',
  name: 'Grid Boss',
  speaker: GARY,
  intros: [
    'It’s 5:59. The adverts are on. Millions of people are standing up. The kettles are coming. THE KETTLES.',
    'We need more power, and we need it clean. Tell me which stations are actually earning their keep.',
    'Big gun time. There’s a mountain in Wales full of water, and it’s basically a giant battery. Let’s use it.',
    'Demand’s spiking, the wind’s dropped a bit and the sun’s going down. Balance it, boss, or we lose Birmingham.',
    'You’ve kept the lights on. Now the engineers want to see you do the specific heat capacity practical. Properly.',
  ],
  ranks: [
    { badge: '⚡', name: 'Grid Boss', line: 'Fifty hertz all night. Gary wants you running the Net Zero grid.' },
    { badge: '🎧', name: 'Control Room Pro', line: 'A wobble or two, but Britain got its tea.' },
    { badge: '🔌', name: 'Trainee Engineer', line: 'The lights flickered. Gary needed a lie down. But you got there.' },
    { badge: '🕯️', name: 'Blackout Britain', line: 'The nation is drinking cold tea by candlelight. Back to training.' },
  ],
  rule: ['Power P = E ÷ t, energy E = P × t, with t in seconds.', 'Efficiency = useful ÷ total (× 100 for %). Wasted = total − useful.', 'Ep = m g h, Ek = ½ m v², ΔE = m c Δθ.'],
  start: 'Take the controls',
  action: 'Send the power',
  asker: task => `Gary · set the ${task.label.replace(/ \S{1,2}$/, "").toLowerCase()}, then send it`,
  busted: {
    emoji: '🌑', kicker: 'Blackout', title: 'Three mistakes. The whole country just went dark.',
    tip: 'Write the equation first, then swap in the numbers. Time in seconds for power. Use the temperature CHANGE. Square only the speed, and don’t forget the ½.',
    retry: 'Restart the grid',
  },
  burst: '⚡',
  brag: (name, badge) => `I survived the 6pm kettle surge and kept Britain’s lights on in Grid Boss. Rank: ${name} ${badge}`,
  again: 'Run another night shift',
  sound: sfx.whoosh,
  actionMs: 800,
  Stage,
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function GridBoss() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <DialGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

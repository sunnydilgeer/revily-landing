'use client'

import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { DialGame, type DialGameConfig, type Phase, type StageProps } from '../kit/DialGame'
import { n, type Task } from '../kit/types'
import { makeRounds, type Scene } from './rounds'
import './Rewild.css'

const ROWAN: Speaker = {
  name: 'Ranger Rowan', emoji: '🧑🏼‍🌾',
  right: ['Spot on. The beavers would high-five you, if they had the thumbs.', 'Textbook ecology. I’m writing that in the survey log.', 'Bang on. That’s a field day well spent.', 'Lovely. The valley’s coming back to life.', 'Nailed it. Even the owls look impressed.'],
  wrong: ['Hmm. A beaver could gnaw a better number than that.', 'Nope. The heron just shook its head at you.', 'That’s gone a bit swampy. Check your working.', 'Not quite. Back to the clipboard, ecologist.'],
}

/** The valley's mood: still while setting, rustling on Survey, then thriving (right), flooded (too high) or barren (too low). */
function mood(phase: Phase, value: number, answer: number) {
  if (phase === 'hit') return 'is-hit'
  if (phase === 'go') return 'is-go'
  if (phase === 'miss') return value > answer ? 'is-miss is-high' : 'is-miss is-low'
  return ''
}

/** Short units for the readout: long word units would run off a phone screen. */
const fmt = (value: number, unit: string) => unit === '%' ? `${n(value)}%` : unit === 'years' ? `${n(value)} yrs` : n(value)

const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value))

/** The readout beside the picture: the given values, then the dial's slot. */
function Readout({ given, label, live }: { given: [string, string][]; label: string; live: string }) {
  const rows = [...given, [label, live] as [string, string]]
  return <g className="rw-readout">
    {rows.map(([name, text], i) => {
      const dial = i === rows.length - 1, top = 30 + i * 50
      return <g key={name} className={dial ? 'rw-slot is-dial' : 'rw-slot'}>
        <text x={186} y={top} className="rw-slot__name">{name}</text>
        {dial && <rect x={182} y={top + 6} width={130} height={26} rx="6" />}
        <text x={188} y={top + 25} className={`rw-slot__value${text.length > 12 ? ' is-long' : ''}`}>{text}</text>
      </g>
    })}
  </g>
}

/** The river along the bottom with the beaver dam: wildlife pops up when right, it floods when too high, dries when too low. */
function River({ cls }: { cls: string }) {
  return <g className="rw-river">
    <path d="M6 156 Q50 148 92 156 T178 154 V178 H6 Z" className="rw-river__water" />
    <path d="M6 150 Q50 140 92 148 T178 146 V178 H6 Z" className="rw-river__flood" />
    <g className="rw-dam">
      <path d="M118 150 L150 176 M124 148 L146 178 M132 148 L138 178 M142 150 L128 177 M150 152 L120 176" />
    </g>
    <text x="104" y="172" className="rw-river__beaver">🦫</text>
    <g className="rw-wild" aria-hidden="true">
      <text x="18" y="174">🐟</text><text x="56" y="160">🦆</text><text x="152" y="146">🐸</text><text x="24" y="24">🐝</text><text x="150" y="24">🦋</text>
    </g>
    {cls.includes('is-low') && <text x="16" y="172" className="rw-river__dry">🍂</text>}
  </g>
}

const SPOTS = Array.from({ length: 25 }, (_, i) => [((i * 7) % 25) % 5, Math.floor(((i * 7) % 25) / 5)] as [number, number])

/** A 1 m² quadrat on the meadow: flowers fill it as the dial goes up; ten of them at the right answer. */
function Meadow({ scene, ratio }: { scene: Scene; ratio: number }) {
  const count = clamp(Math.round(10 * ratio), 0, 25)
  const flower = scene.flower === 'buttercup' ? '🌼' : '🌸'
  return <g>
    <rect x="34" y="34" width="110" height="100" className="rw-quad" />
    {[1, 2, 3, 4].map(i => <g key={i}><line x1={34 + i * 22} y1="34" x2={34 + i * 22} y2="134" className="rw-quad__string" /><line x1="34" y1={34 + i * 20} x2="144" y2={34 + i * 20} className="rw-quad__string" /></g>)}
    {SPOTS.slice(0, count).map(([c, r], i) => <text key={i} x={45 + c * 22} y={50 + r * 20} textAnchor="middle" className="rw-flower">{flower}</text>)}
    <text x="89" y="28" textAnchor="middle" className="rw-note">1 m² quadrat</text>
  </g>
}

/** The transect: a 25-square quadrat by the tape, squares shaded with meadowsweet cover. */
function Transect({ scene, value, touched }: { scene: Scene; value: number; touched: boolean }) {
  const grid = scene.grid!
  const shaded = !touched ? (grid.mode === 'drop' ? grid.from : 0) : clamp(Math.round(grid.mode === 'drop' ? grid.from - value / 4 : value / 4), 0, 25)
  return <g>
    <line x1="18" y1="140" x2="18" y2="20" className="rw-tape" />
    {[0, 2, 4, 6, 8, 10].map(m => <g key={m}><line x1="13" y1={140 - m * 11} x2="23" y2={140 - m * 11} className="rw-tape" /></g>)}
    <text x="26" y="24" className="rw-note">{grid.mode === 'drop' ? '10 m' : '2 m'}</text>
    <rect x="44" y="30" width="110" height="110" className="rw-quad" />
    {Array.from({ length: 25 }, (_, i) => <rect key={i} x={45 + (i % 5) * 21.6} y={31 + Math.floor(i / 5) * 21.6} width="20" height="20" rx="2" className={`rw-sq${i < shaded ? ' is-on' : ''}`} />)}
  </g>
}

/** The vole and owl populations over the years: the dial draws a line up from the start. */
function Graph({ scene, value, touched }: { scene: Scene; value: number; touched: boolean }) {
  const g = scene.graph!, top = g.peak * 1.3
  const y = (v: number) => 140 - clamp(v / top, 0, 1.06) * 112
  const mid = (g.low + g.peak) / 2, amp = (g.peak - g.low) / 2
  const vole = Array.from({ length: 41 }, (_, i) => `${i ? 'L' : 'M'}${34 + i * 3.5} ${y(mid - amp * Math.cos(i / 40 * Math.PI * 2 + 0))}`).join(' ')
  const owlTop = Math.max(g.owls * 2.2, g.low * 0.35), owlLow = owlTop * 0.35
  const owl = Array.from({ length: 41 }, (_, i) => `${i ? 'L' : 'M'}${34 + i * 3.5} ${y((owlTop + owlLow) / 2 - (owlTop - owlLow) / 2 * Math.cos(i / 40 * Math.PI * 2 - 1.2))}`).join(' ')
  const level = touched ? g.base + value * g.per : g.base
  return <g>
    <path d="M30 22 V140 H176" className="rw-axis" />
    <path d={vole} className="rw-curve rw-curve--vole" />
    <path d={owl} className="rw-curve rw-curve--owl" />
    <line x1="30" y1={y(g.peak)} x2="176" y2={y(g.peak)} className="rw-peak" />
    <line x1="30" y1={y(level)} x2="176" y2={y(level)} className="rw-level" />
    <text x="34" y="20" className="rw-note">{scene.tag}</text>
    <text x="104" y={Math.max(32, y(g.peak) - 4)} textAnchor="middle" className="rw-key">🐭</text>
    <text x="150" y={y(owlTop) - 4} className="rw-key">🦉</text>
  </g>
}

/** The valley map: 20 cells of wetland, 5% each. Draining turns them brown; beaver dams flood them back. */
function Wetland({ scene, ratio, touched }: { scene: Scene; ratio: number; touched: boolean }) {
  const wet = scene.wet!
  const moved = touched ? Math.round(wet.lost * ratio) : 0
  const drained = wet.mode === 'lose' ? clamp(moved, 0, 20) : clamp(wet.lost - moved, 0, wet.lost)
  return <g>
    {Array.from({ length: 20 }, (_, i) => <rect key={i} x={30 + (i % 5) * 24} y={30 + Math.floor(i / 5) * 26} width="22" height="24" rx="4" className={`rw-cell${i < drained ? ' is-dry' : ''}`} />)}
    <text x="90" y="24" textAnchor="middle" className="rw-note">1 square = 5%</text>
  </g>
}

function Stage({ task, value, phase }: StageProps<Scene>) {
  const t = task as Task<Scene>
  const touched = !(phase === 'set' && value === t.start)
  const shown = phase === 'hit' ? t.answer : value
  const live = touched ? fmt(shown, t.unit) : '?'
  const ratio = touched ? shown / t.answer : 0
  const cls = mood(phase, value, t.answer)
  const scene = t.scene
  const note = cls.includes('is-high') ? 'overcrowded: flood!' : cls.includes('is-low') ? 'too barren' : cls.includes('is-hit') ? 'wildlife returns' : ''
  return <svg viewBox="0 0 320 200" className={`rw-board ${cls}`} role="img" aria-label={`Valley survey, ${t.label} ${live}`}>
    <rect x="6" y="8" width="172" height="170" rx="12" className="rw-land" />
    {scene.layout === 'meadow' && <Meadow scene={scene} ratio={ratio} />}
    {scene.layout === 'transect' && <Transect scene={scene} value={shown} touched={touched} />}
    {scene.layout === 'graph' && <Graph scene={scene} value={shown} touched={touched} />}
    {scene.layout === 'wetland' && <Wetland scene={scene} ratio={ratio} touched={touched} />}
    <River cls={cls} />
    <text x="92" y="196" textAnchor="middle" className="rw-mood">{note}</text>
    <Readout given={scene.given} label={t.label} live={live} />
  </svg>
}

const config: DialGameConfig<Scene> = {
  labId: 'science-rewild',
  name: 'Rewild',
  speaker: ROWAN,
  intros: [
    'Morning, ecologist! Wellies on. Our first job: count the bee orchids in the new wildflower meadow. No, you can’t count every single one.',
    'Down to the riverbank with the tape measure. Let’s see how the plants change as we walk away from the water.',
    'The voles are booming and the barn owls have noticed. Grab the binoculars: we’re mapping who eats who.',
    'Big news: the beavers have been released! They’re about to undo a century of drainage, one dam at a time.',
    'Survey day at the local school field. Your required practical, and the whole Year 10 is watching. No pressure.',
  ],
  ranks: [
    { badge: '🦫', name: 'Chief Ecologist', line: 'Every survey spot on, first go. The beavers have named a dam after you.' },
    { badge: '🦉', name: 'Field Ecologist', line: 'A muddy slip or two, but the valley is thriving.' },
    { badge: '🌼', name: 'Survey Volunteer', line: 'You got there. Rowan double-checked your clipboard, though.' },
    { badge: '🥾', name: 'Welly Washer', line: 'You’re on welly-washing duty for now. Back to the field guide.' },
  ],
  rule: ['Mean = total ÷ number of quadrats. Population = mean per m² × area.', 'Percentage cover: squares covered ÷ squares in total × 100. Abiotic = non-living, biotic = living.', 'Prey rise, then predators rise. Place quadrats randomly to avoid bias.'],
  start: 'Pull on the wellies',
  action: 'Survey it',
  asker: task => `Ranger Rowan · set the ${task.label.toLowerCase()}, then survey it`,
  busted: {
    emoji: '🌊', kicker: 'Washed out', title: 'Three slips. Rowan is redoing this survey.',
    tip: 'Find the mean first: total ÷ number of quadrats. Then multiply by the area. For percentages, put the part over the whole and × 100.',
    retry: 'Back in the field',
  },
  burst: '🌼',
  brag: (name, badge) => `I brought beavers back to a British valley in Rewild. Rank: ${name} ${badge}`,
  again: 'Rewild another valley',
  sound: sfx.tick,
  Stage,
}

/** A fresh valley every play: the game remounts with new numbers on "again". */
export default function Rewild() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <DialGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

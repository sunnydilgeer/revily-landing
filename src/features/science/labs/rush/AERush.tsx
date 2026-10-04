'use client'

import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { DialGame, type DialGameConfig, type Phase, type StageProps } from '../kit/DialGame'
import { n, u, type Task } from '../kit/types'
import { makeRounds, type Scene, type Specimen } from './rounds'
import './AERush.css'

const PATEL: Speaker = {
  name: 'Dr Patel', emoji: '👩🏽‍⚕️',
  right: ['Spot on. You’ll make consultant yet.', 'Textbook. I’m putting that in your portfolio.', 'Right first time. The patient thanks you.', 'Lovely. That’s proper medicine.', 'Nailed it. Next patient, please!'],
  wrong: ['Hmm. Check your working before you check the patient.', 'Nope. The patient is looking at you funny.', 'I wouldn’t sign that off, doctor.', 'Back to the notes. Slowly this time.'],
}

/** The scene's mood: blank while setting, scanning on Check, then sharp (right), too big or too small. */
function mood(phase: Phase, value: number, answer: number) {
  if (phase === 'hit') return 'is-hit'
  if (phase === 'go') return 'is-go'
  if (phase === 'miss') return value > answer ? 'is-miss is-high' : 'is-miss is-low'
  return ''
}

const fmt = (value: number, unit: string) => unit === '' ? `×${n(value)}` : u(value, unit)

/** The readout beside the picture: the given values, then the dial's slot. */
function Readout({ given, label, live, x = 186, y = 34 }: { given: [string, string][]; label: string; live: string; x?: number; y?: number }) {
  const rows = [...given, [label, live] as [string, string]]
  return <g className="ae-readout">
    {rows.map(([name, text], i) => {
      const dial = i === rows.length - 1, top = y + i * 50
      return <g key={name} className={dial ? 'ae-slot is-dial' : 'ae-slot'}>
        <text x={x} y={top} className="ae-slot__name">{name}</text>
        {dial && <rect x={x - 4} y={top + 6} width={130} height={26} rx="6" />}
        <text x={x + 2} y={top + 25} className="ae-slot__value">{text}</text>
      </g>
    })}
  </g>
}

/** What's on the slide. Drawn around (0, 0), about 60 units across at the right size. */
function Bug({ kind }: { kind: Specimen }) {
  if (kind === 'pollen') return <g className="ae-bug ae-bug--pollen">
    {Array.from({ length: 14 }, (_, i) => <path key={i} d="M0 -34 L4 -27 L-4 -27 Z" transform={`rotate(${i * 360 / 14})`} />)}
    <circle r="27" /><circle r="9" className="ae-bug__core" />
  </g>
  if (kind === 'splinter') return <g className="ae-bug ae-bug--splinter">
    <path d="M-34 6 L30 -6 L36 -2 L-30 10 Z" /><path d="M-20 5 L10 -1" className="ae-bug__grain" />
  </g>
  return <g className="ae-bug ae-bug--rod">
    <rect x="-30" y="-9" width="60" height="18" rx="9" /><path d="M30 0 q8 -6 14 0 t12 0" className="ae-bug__tail" />
    <rect x="-28" y="12" width="44" height="16" rx="8" transform="rotate(-14)" className="ae-bug__twin" />
  </g>
}

/** The eyepiece: the specimen grows with the dial, blurry until the number is right. */
function Eyepiece({ scene, ratio, label, live, cls }: { scene: Scene; ratio: number; label: string; live: string; cls: string }) {
  const size = Math.max(0.12, Math.min(2.6, ratio))
  const blur = cls.includes('is-hit') ? 0 : Math.min(4, 0.6 + Math.abs(Math.log2(Math.max(ratio, 0.05))) * 1.6)
  return <svg viewBox="0 0 320 200" className={`ae-board ${cls}`} role="img" aria-label={`Microscope view of the ${scene.specimen}, ${label} ${live}`}>
    <defs>
      <clipPath id="ae-eye"><circle cx="92" cy="100" r="80" /></clipPath>
      <filter id="ae-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={blur} /></filter>
    </defs>
    <circle cx="92" cy="100" r="88" className="ae-eye__rim" />
    <circle cx="92" cy="100" r="80" className="ae-eye__glass" />
    <g clipPath="url(#ae-eye)">
      <g className="ae-eye__spec" filter={blur ? 'url(#ae-blur)' : undefined} transform={`translate(92 100) scale(${size})`}><Bug kind={scene.specimen ?? 'bacteria'} /></g>
      <line x1="92" y1="20" x2="92" y2="180" className="ae-eye__cross" /><line x1="12" y1="100" x2="172" y2="100" className="ae-eye__cross" />
    </g>
    <circle cx="92" cy="100" r="80" className="ae-eye__ring" />
    <text x="92" y="196" textAnchor="middle" className="ae-eye__note">{cls.includes('is-high') ? 'way too big' : cls.includes('is-low') ? 'too small to see' : cls.includes('is-hit') ? 'in focus' : ''}</text>
    <Readout given={scene.given} label={label} live={live} />
  </svg>
}

/** People as dots: the dial colours them in, one dot at a time. */
function Crowd({ scene, value, label, live, cls }: { scene: Scene; value: number; label: string; live: string; cls: string }) {
  const crowd = scene.crowd!
  const cols = 10, rows = Math.ceil(crowd.dots / cols), gap = Math.min(16, 132 / rows), r = Math.min(6, gap / 2 - 1)
  const marked = Math.min(crowd.dots - crowd.fixed, Math.round(value / crowd.per))
  const over = value / crowd.per > crowd.dots - crowd.fixed
  return <svg viewBox="0 0 320 200" className={`ae-board ${cls}`} role="img" aria-label={`${crowd.dots} dots, ${label} ${live}`}>
    <rect x="6" y="14" width="172" height={rows * gap + 22} rx="12" className="ae-crowd__bg" />
    {Array.from({ length: crowd.dots }, (_, i) => {
      const kind = i < crowd.fixed ? 'is-fixed' : i < crowd.fixed + marked ? `is-${crowd.tint}` : ''
      return <circle key={i} cx={20 + (i % cols) * 16} cy={25 + gap / 2 + Math.floor(i / cols) * gap} r={r} className={`ae-dot ${kind}`} />
    })}
    {over && <text x="92" y="9" textAnchor="middle" className="ae-eye__note">more than there are!</text>}
    <g className="ae-key">
      <circle cx="16" cy="190" r="5" className={`ae-dot is-${crowd.tint}`} /><text x="26" y="195">{crowd.key}</text>
    </g>
    <Readout given={scene.given} label={label} live={live} />
  </svg>
}

/** A heart monitor over the bed: the trace beats faster as the dial goes up, and steadies green when right. */
function Monitor({ scene, value, answer, label, live, cls }: { scene: Scene; value: number; answer: number; label: string; live: string; cls: string }) {
  const beats = Math.max(0, Math.min(9, Math.round(4 * value / answer)))
  let d = 'M14 70'
  for (let i = 0; i < beats; i++) {
    const at = 14 + (i + 0.5) * 150 / Math.max(beats, 1)
    d += ` L${at - 8} 70 L${at - 4} 62 L${at} 84 L${at + 4} 38 L${at + 8} 76 L${at + 11} 70`
  }
  d += ' L164 70'
  return <svg viewBox="0 0 320 200" className={`ae-board ${cls}`} role="img" aria-label={`Heart monitor, ${label} ${live}`}>
    <rect x="6" y="16" width="168" height="104" rx="10" className="ae-mon__screen" />
    <path d={d} className="ae-mon__trace" fill="none" />
    <text x="164" y="36" textAnchor="end" className="ae-mon__bpm">♥ {live}</text>
    <rect x="22" y="150" width="140" height="22" rx="8" className="ae-bed" />
    <rect x="26" y="138" width="40" height="16" rx="6" className="ae-pillow" />
    <text x="46" y="148" textAnchor="middle" className="ae-mon__who">{scene.patient}</text>
    <line x1="30" y1="172" x2="30" y2="190" className="ae-bed__leg" /><line x1="154" y1="172" x2="154" y2="190" className="ae-bed__leg" />
    <Readout given={scene.given} label={label} live={live} />
  </svg>
}

/** The practical's field of view: a row of onion cells, a bracket that grows with the dial. */
function Field({ scene, ratio, label, live, cls }: { scene: Scene; ratio: number; label: string; live: string; cls: string }) {
  const across = scene.across ?? 4, w = 160 / across
  const span = Math.max(0, Math.min(170, w * ratio))
  return <svg viewBox="0 0 320 200" className={`ae-board ${cls}`} role="img" aria-label={`Field of view with ${across} cells across, ${label} ${live}`}>
    <defs><clipPath id="ae-field"><circle cx="92" cy="100" r="80" /></clipPath></defs>
    <circle cx="92" cy="100" r="88" className="ae-eye__rim" />
    <circle cx="92" cy="100" r="80" className="ae-eye__glass" />
    <g clipPath="url(#ae-field)">
      {[-1, 0, 1].map(row => Array.from({ length: across }, (_, i) =>
        <rect key={`${row}-${i}`} x={12 + i * w + (row === 0 ? 0 : (row * w) / 2)} y={84 + row * 34} width={w - 2} height="32" rx="4" className={`ae-cell${row === 0 ? ' is-row' : ''}`} />))}
      {Array.from({ length: across }, (_, i) => <circle key={i} cx={12 + i * w + w * 0.62} cy="100" r={Math.min(4, w / 6)} className="ae-cell__nucleus" />)}
    </g>
    <circle cx="92" cy="100" r="80" className="ae-eye__ring" />
    {span > 0 && <path d={`M12 70 V64 H${12 + span} V70`} className="ae-bracket" fill="none" />}
    <path d="M12 184 H172 M12 179 V189 M172 179 V189" className="ae-scale" fill="none" />
    <Readout given={scene.given} label={label} live={live} />
  </svg>
}

function Stage({ task, value, phase }: StageProps<Scene>) {
  const t = task as Task<Scene>
  const shown = phase === 'hit' ? t.answer : value
  const live = phase === 'set' && value === t.start ? '?' : fmt(shown, t.unit)
  const ratio = phase === 'set' && value === t.start ? 0.25 : shown / t.answer
  const cls = mood(phase, value, t.answer)
  const label = t.label.replace(/ ×$/, '').replace('Total magnification', 'Total mag.')
  const scene = t.scene
  if (scene.layout === 'crowd') return <Crowd scene={scene} value={phase === 'set' && value === t.start ? 0 : shown} label={label} live={live} cls={cls} />
  if (scene.layout === 'monitor') return <Monitor scene={scene} value={phase === 'set' && value === t.start ? 0 : shown} answer={t.answer} label={label} live={live} cls={cls} />
  if (scene.layout === 'field') return <Field scene={scene} ratio={phase === 'set' && value === t.start ? 0 : ratio} label={label} live={live} cls={cls} />
  return <Eyepiece scene={scene} ratio={ratio} label={label} live={live} cls={cls} />
}

const config: DialGameConfig<Scene> = {
  labId: 'science-rush',
  name: 'A&E Rush',
  speaker: PATEL,
  intros: [
    'Welcome to A&E, doctor. Monday night, 40 in the waiting room. First stop: the microscope. Show me you can work it.',
    'Infected wound in cubicle 3. Swab’s on the slide. Let’s find out what we’re fighting.',
    'Ward round. Some have bacteria, some have viruses. If I catch anyone giving antibiotics for a cold, you’re on bedpans till Christmas.',
    'Phone’s ringing: measles at the local school. Public Health wants numbers, and someone’s just fainted in the jab queue.',
    'Quiet hour. Perfect time for your microscopy practical. The registrar is watching, so do it properly.',
  ],
  ranks: [
    { badge: '🩺', name: 'Consultant', line: 'Every patient sorted, first go. Dr Patel wants you on her team.' },
    { badge: '🏥', name: 'Registrar', line: 'A wobble or two, but every patient went home well.' },
    { badge: '📋', name: 'Junior Doctor', line: 'You got there. Dr Patel double-checked your notes, though.' },
    { badge: '🩹', name: 'Plaster Monitor', line: 'You’re on plasters and cups of tea for now. Back to the textbook.' },
  ],
  rule: ['Magnification = image size ÷ real size. Real size = image ÷ magnification. Same units: 1 mm = 1000 µm.', 'Total magnification = eyepiece × objective.', 'Antibiotics kill bacteria, not viruses. Vaccines train white blood cells to make antibodies.'],
  start: 'Scrub in',
  action: 'Check it',
  asker: task => `Dr Patel · set the ${task.label.replace(/ ×$/, '').toLowerCase()}, then check it`,
  busted: {
    emoji: '🚑', kicker: 'Code red', title: 'Three slips. Dr Patel is taking over this patient.',
    tip: 'Write the equation first: magnification = image ÷ real. Get both sizes in the same unit (1 mm = 1000 µm). Lenses multiply. And antibiotics never treat viruses.',
    retry: 'Back on shift',
  },
  burst: '🩺',
  brag: (name, badge) => `I ran a whole A&E shift in A&E Rush and never gave antibiotics for a virus. Rank: ${name} ${badge}`,
  again: 'Next shift',
  sound: sfx.tick,
  Stage,
}

/** Fresh patients every play: the game remounts with a new set on "again". */
export default function AERush() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <DialGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

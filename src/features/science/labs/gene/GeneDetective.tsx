'use client'

import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { DialGame, type DialGameConfig, type Phase, type StageProps } from '../kit/DialGame'
import { n, u, type Task } from '../kit/types'
import { makeRounds, type Scene } from './rounds'
import './GeneDetective.css'

const MENSAH: Speaker = {
  name: 'Dr Mensah', emoji: '👩🏾‍🔬',
  right: ['Case closed. Sherlock wishes he had your alleles.', 'Spot on. That’s going in the family report.', 'Beautiful. Mendel would be proud, and he grew peas for a living.', 'Lovely work. The parents will sleep tonight.', 'Nailed it. You’re a natural, possibly a dominant one.'],
  wrong: ['Hmm. Let’s not tell the family THAT.', 'Nope. Back to the Punnett square, detective.', 'Close, but the genes don’t lie. Check again.', 'I wouldn’t sign that report. Count the boxes.'],
}

/** The scene's mood: plain while setting, scanning on Check, then matched (right), too many or too few. */
function mood(phase: Phase, value: number, answer: number) {
  if (phase === 'hit') return 'is-hit'
  if (phase === 'go') return 'is-go'
  if (phase === 'miss') return value > answer ? 'is-miss is-high' : 'is-miss is-low'
  return ''
}

/** The readout beside the picture: the given values, then the dial's slot. */
function Readout({ given, label, live, x = 196, y = 30 }: { given: [string, string][]; label: string; live: string; x?: number; y?: number }) {
  const rows = [...given, [label, live] as [string, string]]
  return <g className="gd-readout">
    {rows.map(([name, text], i) => {
      const dial = i === rows.length - 1, top = y + i * 50
      return <g key={name + i} className={dial ? 'gd-slot is-dial' : 'gd-slot'}>
        <text x={x} y={top} className="gd-slot__name">{name}</text>
        {dial && <rect x={x - 4} y={top + 6} width={122} height={26} rx="6" />}
        <text x={x + 2} y={top + 25} className="gd-slot__value">{text}</text>
      </g>
    })}
  </g>
}

const note = (cls: string, high: string, low: string, hit: string) => cls.includes('is-high') ? high : cls.includes('is-low') ? low : cls.includes('is-hit') ? hit : ''

/** A cell with its nucleus: one little chromosome per unit on the dial, in mum (blue) and dad (orange) pairs. */
function Cell({ scene, count, label, live, cls }: { scene: Scene; count: number; label: string; live: string; cls: string }) {
  const shown = Math.max(0, Math.min(100, Math.round(count)))
  const gamete = !!scene.gamete
  const cols = 10, w = 11, h = 9
  const gx = 92 - (cols * w) / 2, gy = 40
  return <svg viewBox="0 0 320 200" className={`gd-board ${cls}`} role="img" aria-label={`${gamete ? 'Sex cell' : 'Body cell'} nucleus, ${label} ${live}`}>
    {gamete
      ? <g className="gd-cell"><path d="M150 100 q14 -12 26 -4 q-10 4 -26 4 q14 12 26 4" className="gd-tail" /><circle cx="92" cy="100" r="74" className="gd-cell__wall" /></g>
      : <g className="gd-cell"><path d="M18 100 C18 40 58 16 98 20 C146 24 174 58 168 104 C164 150 128 182 88 180 C44 178 18 150 18 100 Z" className="gd-cell__wall" /></g>}
    <rect x="30" y="32" width="124" height="136" rx="44" className="gd-nucleus" />
    {Array.from({ length: shown }, (_, i) => {
      const col = i % cols, row = Math.floor(i / cols)
      const x = gx + col * w + 2, y = gy + row * 12
      return <g key={i} className={`gd-chromo ${gamete || i % 2 === 0 ? 'is-mum' : 'is-dad'}`}>
        <rect x={x} y={y} width="4" height={h} rx="2" />
        <rect x={x + 4.2} y={y} width="4" height={h} rx="2" className="gd-chromo__twin" />
      </g>
    })}
    <text x="92" y="197" textAnchor="middle" className="gd-note">{note(cls, 'too many chromosomes', 'some are missing', gamete ? 'one from each pair' : 'all in pairs')}</text>
    <Readout given={scene.given} label={label} live={live} />
  </svg>
}

/** A Punnett square: alleles round the edge, genotypes inside. The dial lights boxes 25% at a time. */
function Punnett({ scene, value, label, live, cls }: { scene: Scene; value: number; label: string; live: string; cls: string }) {
  const sq = scene.square!
  const size = 58, x0 = 44, y0 = 40
  // Light the boxes the question wants first, then the rest: too high spills into the wrong ones.
  const order = [...sq.boxes.keys()].sort((a, b) => Number(sq.boxes[b].target) - Number(sq.boxes[a].target))
  const lit = Math.max(0, Math.min(100, value)) / 25
  return <svg viewBox="0 0 320 200" className={`gd-board ${cls}`} role="img" aria-label={`Punnett square ${sq.side.join('')} by ${sq.top.join('')}, ${label} ${live}`}>
    {sq.top.map((a, i) => <text key={`t${i}`} x={x0 + i * size + size / 2} y={y0 - 10} textAnchor="middle" className="gd-allele">{a}</text>)}
    {sq.side.map((a, i) => <text key={`s${i}`} x={x0 - 14} y={y0 + i * size + size / 2 + 6} textAnchor="middle" className="gd-allele">{a}</text>)}
    {sq.boxes.map((box, i) => {
      const x = x0 + (i % 2) * size, y = y0 + Math.floor(i / 2) * size
      const rank = order.indexOf(i), fill = Math.max(0, Math.min(1, lit - rank))
      return <g key={i} className={`gd-box is-${box.kind}${box.target ? ' is-target' : ''}${fill >= 1 ? ' is-lit' : ''}`}>
        <rect x={x} y={y} width={size} height={size} className="gd-box__frame" />
        {fill > 0 && <rect x={x + 3} y={y + size - 3 - (size - 6) * fill} width={size - 6} height={(size - 6) * fill} rx="4" className="gd-box__fill" />}
        <text x={x + size / 2} y={y + size / 2 + 7} textAnchor="middle" className="gd-box__g">{box.g}</text>
      </g>
    })}
    <text x={x0 + size} y="196" textAnchor="middle" className="gd-note">{note(cls, 'too many boxes', 'boxes left out', sq.key)}</text>
    <Readout given={scene.given} label={label} live={live} />
  </svg>
}

/** Babies (or pups, or kittens) in rows: the dial paints them one at a time. */
function Crowd({ scene, value, label, live, cls }: { scene: Scene; value: number; label: string; live: string; cls: string }) {
  const crowd = scene.crowd!
  const cols = 8, rows = Math.ceil(crowd.total / cols), gap = Math.min(21, 150 / rows)
  const marked = Math.max(0, Math.min(crowd.total, Math.round(value)))
  return <svg viewBox="0 0 320 200" className={`gd-board ${cls}`} role="img" aria-label={`${crowd.total} ${crowd.icon}, ${label} ${live}`}>
    <rect x="4" y="10" width="180" height={rows * gap + 14} rx="12" className="gd-crowd__bg" />
    {Array.from({ length: crowd.total }, (_, i) => {
      const cx = 18 + (i % cols) * 22, cy = 17 + gap / 2 + Math.floor(i / cols) * gap
      return <g key={i} className={`gd-kid${i < marked ? ` is-on is-${crowd.tint}` : ''}`}>
        <circle cx={cx} cy={cy} r={Math.min(10, gap / 2)} className="gd-kid__ring" />
        <text x={cx} y={cy + 5} textAnchor="middle" className="gd-kid__icon">{crowd.icon}</text>
      </g>
    })}
    <g className="gd-key"><circle cx="14" cy="190" r="6" className={`gd-kid__ring is-key is-${crowd.tint}`} /><text x="25" y="195">{crowd.key}</text></g>
    <Readout given={scene.given} label={label} live={live} />
  </svg>
}

function Stage({ task, value, phase }: StageProps<Scene>) {
  const t = task as Task<Scene>
  const fresh = phase === 'set' && value === t.start
  const shown = phase === 'hit' ? t.answer : value
  const live = fresh ? '?' : t.unit === '%' ? u(shown, '%') : n(shown)
  const cls = mood(phase, value, t.answer)
  const scene = t.scene
  if (scene.layout === 'punnett') return <Punnett scene={scene} value={fresh ? 0 : shown} label={t.label} live={live} cls={cls} />
  if (scene.layout === 'crowd') return <Crowd scene={scene} value={fresh ? 0 : shown} label={t.label} live={live} cls={cls} />
  return <Cell scene={scene} count={fresh ? 0 : shown} label={t.label} live={live} cls={cls} />
}

const config: DialGameConfig<Scene> = {
  labId: 'science-gene',
  name: 'Gene Detective',
  speaker: MENSAH,
  intros: [
    'Welcome to the genomics lab! Every newborn’s DNA comes through here now. First, let’s check you know what a genome looks like.',
    'Phone call from a dog breeder. She wants odds before the litter arrives. Grab a Punnett square.',
    'Family clinic. Baby Zara’s screen flagged something. Her parents are nervous, so be kind and be right.',
    'Maternity ward wants a quick one, then the ward lab has news. Not good news. Bacterial news.',
    'The big case: a whole study group of newborns. The consultant is reading your report, so no pressure. Lots of pressure.',
  ],
  ranks: [
    { badge: '🧬', name: 'Consultant Geneticist', line: 'Every family case cracked, first go. Dr Mensah wants you running the lab.' },
    { badge: '🔬', name: 'Genetic Counsellor', line: 'A wobble or two, but every family got the right answer.' },
    { badge: '🧪', name: 'Lab Trainee', line: 'You got there. Dr Mensah double-checked your Punnett squares, though.' },
    { badge: '🫙', name: 'Sample Labeller', line: 'You’re on sticky labels for now. Back to the alleles.' },
  ],
  rule: ['Body cells have chromosomes in pairs (humans: 23 pairs = 46). Meiosis halves it for gametes.', 'Punnett square: one allele from each parent per box. Each box is 25%. Dominant shows with one copy, recessive needs two.', 'Expected number = probability × total. A 3 : 1 ratio means 3 of every 4.'],
  start: 'Open the case',
  action: 'Check it',
  asker: task => `Dr Mensah · ${task.unit === '%' ? 'set the chance' : `count the ${task.unit}`}, then check it`,
  busted: {
    emoji: '📁', kicker: 'Case reopened', title: 'Three slips. Dr Mensah is taking this family herself.',
    tip: 'Draw the Punnett square: one parent’s alleles across, the other’s down. Count the boxes you want; each one is 25%. Then probability × total for the number of babies.',
    retry: 'Reopen the case',
  },
  burst: '🧬',
  brag: (name, badge) => `I cracked every family case in Gene Detective. Punnett squares fear me. Rank: ${name} ${badge}`,
  again: 'Next case file',
  sound: sfx.tick,
  Stage,
}

/** Fresh families every play: the game remounts with a new set on "again". */
export default function GeneDetective() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <DialGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

'use client'

import { useMemo } from 'react'
import type { Speaker } from '../../../maths/labs/kit/Lab'
import { useGenerated } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import type { Phase } from '../kit/DialGame'
import { PlayGame, type PlayGameConfig, type PlayStageProps } from '../kit/PlayGame'
import { isTiles, wrongSlots } from '../kit/tiles'
import { boxesOf, genotype, makeRounds, type Scene, type TraitId } from './rounds'
import './GeneDetective.css'

const MENSAH: Speaker = {
  name: 'Dr Mensah', emoji: '👩🏾‍🔬',
  right: ['Case closed. Sherlock wishes he had your alleles.', 'Textbook. I’m framing that square.', 'Spot on. The Blobbits approve.', 'That’s consultant-level genetics.', 'Beautiful. Mendel would be proud.'],
  wrong: ['Hmm. Let’s not tell the family THAT.', 'The Blobbits look confused. So am I.', 'Close, but genes don’t lie. Check again.', 'One allele from each parent. Always.'],
}

/** What a genotype looks like for each trait. */
function lookOf(trait: TraitId, g: string) {
  switch (trait) {
    case 'colour': return { kind: 'blob' as const, fill: g.includes('G') ? 'var(--rv-good)' : 'var(--rv-yellow)', glow: false, badge: '' }
    case 'glow': return { kind: 'blob' as const, fill: g.includes('N') ? 'var(--rv-biro-light)' : 'var(--rv-teal)', glow: !g.includes('N'), badge: '' }
    case 'sex': return { kind: 'baby' as const, fill: g === 'XY' ? 'var(--rv-teal-tint)' : 'var(--rv-yellow-tint)', glow: false, badge: g === 'XY' ? '♂' : '♀' }
    case 'cf': return { kind: 'baby' as const, fill: 'var(--rv-yellow-tint)', glow: false, badge: g === 'ff' ? 'CF' : g === 'Ff' ? 'c' : '' }
    case 'poly': return { kind: 'baby' as const, fill: 'var(--rv-yellow-tint)', glow: false, badge: g.includes('D') ? '6' : '' }
  }
}

/** A Blobbit (or, for the NHS rounds, a baby) drawn for a genotype. `g` of '?' draws an egg. */
function Critter({ x, y, s, trait, g, hop = false }: { x: number; y: number; s: number; trait: TraitId; g: string; hop?: boolean }) {
  if (g.includes('?')) return <g transform={`translate(${x} ${y})`}><ellipse rx={s * .8} ry={s} className="gd-egg" /><text y={s * .35} textAnchor="middle" className="gd-egg__q" fontSize={s}>?</text></g>
  const look = lookOf(trait, g)
  // Too small for a face (a 100-egg clutch): a bright dot in the right colour reads better.
  if (s < 8) return <g transform={`translate(${x} ${y})`}>{look.glow && <circle r={s * 1.5} className="gd-aura" />}<circle r={s} fill={look.kind === 'baby' && look.badge ? (look.badge === '♂' || look.badge === 'CF' || look.badge === '6' ? 'var(--rv-teal)' : 'var(--rv-yellow)') : look.fill} className="gd-dot" /></g>
  // The hop animates an inner group: a CSS transform on the outer one would replace its translate.
  return <g transform={`translate(${x} ${y})`}><g className={hop ? 'gd-hop' : undefined}>
    {look.glow && <circle r={s * 1.5} className="gd-aura" />}
    {look.kind === 'blob'
      ? <>
        <line x1="0" y1={-s * .8} x2={s * .3} y2={-s * 1.35} className="gd-line" /><circle cx={s * .3} cy={-s * 1.4} r={s * .16} fill={look.fill} className="gd-line" />
        <ellipse cx={-s * .45} cy={s * .82} rx={s * .3} ry={s * .14} className="gd-foot" /><ellipse cx={s * .45} cy={s * .82} rx={s * .3} ry={s * .14} className="gd-foot" />
        <ellipse rx={s} ry={s * .88} fill={look.fill} className="gd-body" />
        <circle cx={-s * .34} cy={-s * .15} r={s * .26} className="gd-eye" /><circle cx={s * .34} cy={-s * .15} r={s * .26} className="gd-eye" />
        <circle cx={-s * .28} cy={-s * .12} r={s * .12} className="gd-pupil" /><circle cx={s * .4} cy={-s * .12} r={s * .12} className="gd-pupil" />
        <path d={`M${-s * .25} ${s * .3} Q0 ${s * .5} ${s * .25} ${s * .3}`} className="gd-line" fill="none" />
      </>
      : <>
        <circle r={s} fill={look.fill} className="gd-body" />
        <path d={`M${-s * .55} ${-s * .55} Q0 ${-s * 1.25} ${s * .4} ${-s * .75}`} className="gd-line" fill="none" />
        <circle cx={-s * .32} cy={-s * .05} r={s * .1} className="gd-pupil" /><circle cx={s * .32} cy={-s * .05} r={s * .1} className="gd-pupil" />
        <path d={`M${-s * .25} ${s * .35} Q0 ${s * .55} ${s * .25} ${s * .35}`} className="gd-line" fill="none" />
        {look.badge && <g transform={`translate(${s * .78} ${-s * .72})`}><circle r={s * .42} className="gd-badge" /><text y={s * .15} textAnchor="middle" fontSize={s * .45} className="gd-badge__t">{look.badge}</text></g>}
      </>}
  </g></g>
}

/** The cross: both parents with their genotype tags. */
function Parents({ scene, y, compact = false }: { scene: Scene; y: number; compact?: boolean }) {
  const a = genotype(...scene.top), b = genotype(...scene.side)
  const s = compact ? 13 : 20
  return <g>
    <Critter x={compact ? 98 : 50} y={y} s={s} trait={scene.trait} g={a} />
    <text x={compact ? 98 : 50} y={y + s + 18} textAnchor="middle" className="gd-gt">{a}</text>
    <text x="160" y={y + 6} textAnchor="middle" className="gd-cross">×</text>
    <Critter x={compact ? 222 : 270} y={y} s={s} trait={scene.trait} g={b} />
    <text x={compact ? 222 : 270} y={y + s + 18} textAnchor="middle" className="gd-gt">{b}</text>
  </g>
}

/** The Punnett square: alleles across and down, boxes filling as you tap. A right answer hatches a baby in each box. */
function Square({ scene, picked, phase, wrong }: { scene: Scene; picked: string[]; phase: Phase; wrong: Set<number> }) {
  const boxes = phase === 'hit' ? boxesOf(scene.top, scene.side) : picked
  const X = 128, Y = 64, W = 84
  return <g>
    <Critter x={46} y={34} s={15} trait={scene.trait} g={genotype(...scene.top)} />
    <text x={46} y={66} textAnchor="middle" className="gd-name">{scene.names[0]}</text>
    <text x={X - 10} y={38} textAnchor="end" className="gd-arrow">→</text>
    <Critter x={46} y={150} s={15} trait={scene.trait} g={genotype(...scene.side)} />
    <text x={46} y={182} textAnchor="middle" className="gd-name">{scene.names[1]}</text>
    <text x={X - 20} y={Y + W * 1.1} textAnchor="end" className="gd-arrow">↓</text>
    {scene.top.map((allele, col) => <g key={`t${col}`}><circle cx={X + W * col + W / 2} cy={34} r={17} className="gd-allele" /><text x={X + W * col + W / 2} y={41} textAnchor="middle" className="gd-allele__t">{allele}</text></g>)}
    {scene.side.map((allele, row) => <g key={`s${row}`}><circle cx={X - 2} cy={Y + W * row + W / 2} r={17} className="gd-allele" /><text x={X - 2} y={Y + W * row + W / 2 + 7} textAnchor="middle" className="gd-allele__t">{allele}</text></g>)}
    {[0, 1, 2, 3].map(i => {
      const col = i % 2, row = Math.floor(i / 2), bx = X + 20 + W * col - 2, by = Y + W * row
      const tile = boxes[i]
      const next = phase === 'set' && i === picked.length
      return <g key={i} className={`gd-box${tile ? ' is-filled' : ''}${next ? ' is-next' : ''}${wrong.has(i) ? ' is-wrong' : ''}`}>
        <rect x={bx} y={by} width={W - 6} height={W - 6} rx="12" />
        {tile && <text x={bx + (phase === 'hit' ? 24 : (W - 6) / 2)} y={by + (phase === 'hit' ? 30 : (W - 6) / 2 + 10)} textAnchor="middle" className={`gd-box__t${phase === 'hit' ? ' is-small' : ''}`}>{tile}</text>}
        {phase === 'hit' && <Critter x={bx + 50} y={by + 48} s={15} trait={scene.trait} g={tile} hop />}
      </g>
    })}
  </g>
}

/** Who's hiding gold: two green parents, their gold baby, and Blobbit A's genotype tag filling as you tap. */
function Deduce({ scene, picked, phase }: { scene: Scene; picked: string[]; phase: Phase }) {
  const tag = phase === 'hit' ? 'Gg' : [0, 1].map(i => picked[i] ?? '?').join('')
  return <g>
    <Critter x={80} y={58} s={26} trait="colour" g="GG" />
    <text x={80} y={112} textAnchor="middle" className="gd-name">{scene.names[0]}</text>
    <g className={`gd-tag is-${phase}`}><rect x={52} y={120} width={56} height={30} rx="8" /><text x={80} y={142} textAnchor="middle">{tag}</text></g>
    <text x="160" y="66" textAnchor="middle" className="gd-cross">×</text>
    <Critter x={240} y={58} s={26} trait="colour" g="GG" />
    <text x={240} y={112} textAnchor="middle" className="gd-name">{scene.names[1]}</text>
    <text x={240} y={142} textAnchor="middle" className="gd-gt">G?</text>
    <path d="M160 88 V170" className="gd-arrow-line" />
    <Critter x={160} y={196} s={20} trait="colour" g="gg" hop={phase === 'hit'} />
    <text x={206} y={202} className="gd-name">baby: gold (gg)</text>
  </g>
}

/** Seeded-ish shuffle so a clutch hatches the same way while the screen is up. */
function hatch(total: number, p: number, seed: string) {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  const next = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296 }
  return Array.from({ length: total }, () => next() < p)
}

/** The clutch: a tray of eggs. Predict, then they hatch, and the real count lands near your prediction. */
function Clutch({ scene, value, phase, id }: { scene: Scene; value: number; phase: Phase; id: string }) {
  const c = scene.clutch!
  const result = useMemo(() => hatch(c.total, c.p, id + Date.now()), [c.total, c.p, id]) // eslint-disable-line react-hooks/exhaustive-deps
  const hits = result.filter(Boolean).length
  const cols = c.total > 60 ? 20 : Math.min(c.total, 10), rows = Math.ceil(c.total / cols)
  const cell = Math.min(290 / cols, 118 / rows), left = 160 - (cols * cell) / 2
  const kinds = boxesOf(scene.top, scene.side)
  const yes = kinds.find(g => c.kinds.includes(g))!, no = kinds.find(g => !c.kinds.includes(g)) ?? yes
  const hatched = phase === 'hit'
  return <g>
    <Parents scene={scene} y={22} compact />
    {result.map((isKind, i) => {
      const x = left + (i % cols) * cell + cell / 2, y = 78 + Math.floor(i / cols) * cell + cell / 2
      return hatched
        ? <g key={i} style={{ animationDelay: `${(i % 25) * 18}ms` }} className="gd-pop"><Critter x={x} y={y} s={cell * .36} trait={scene.trait} g={isKind ? yes : no} /></g>
        : <ellipse key={i} cx={x} cy={y} rx={cell * .3} ry={cell * .38} className={`gd-egg${phase === 'go' ? ' gd-wobble' : ''}`} style={{ animationDelay: `${(i % 7) * 40}ms` }} />
    })}
    <text x="160" y="222" textAnchor="middle" className="gd-result">
      {hatched ? `Hatched: ${hits} ${c.ask} of ${c.total}. You predicted ${scene.clutch && c.total === 100 ? `${value}%` : value}.`
        : phase === 'miss' ? `Predicted ${c.total === 100 ? `${value}%` : value}. Dr Mensah isn’t convinced.` : `${c.total} eggs. Predict, then hatch!`}
    </text>
    {hatched && <text x="160" y="240" textAnchor="middle" className="gd-note">Chance lands close, not exact. That’s why it’s “expected”.</text>}
  </g>
}

function Stage({ task, value, picked, phase }: PlayStageProps<Scene>) {
  const scene = task.scene
  const wrong = phase === 'miss' && isTiles(task) ? new Set(wrongSlots(task, picked)) : new Set<number>()
  return <svg viewBox="0 0 320 250" className={`gd-board is-${phase}`} role="img"
    aria-label={scene.layout === 'square' ? `Punnett square: ${scene.top.join('')} across, ${scene.side.join('')} down` : scene.layout === 'deduce' ? 'Two green parents and a gold baby' : `A clutch of ${scene.clutch?.total} eggs`}>
    {scene.layout === 'square' && <Square scene={scene} picked={picked} phase={phase} wrong={wrong} />}
    {scene.layout === 'deduce' && <Deduce scene={scene} picked={picked} phase={phase} />}
    {scene.layout === 'clutch' && <Clutch scene={scene} value={value} phase={phase} id={task.id} />}
  </svg>
}

const config: PlayGameConfig<Scene> = {
  labId: 'science-gene',
  name: 'Creature Breeder',
  speaker: MENSAH,
  intros: [
    'Meet the Blobbits: our lab’s fast-breeding model creatures. Two of them just laid eggs. Let’s predict the babies before they hatch.',
    'Plot twist: two green Blobbits hatched a GOLD baby. One of them is hiding something in their genes.',
    'Some Blobbits glow in the dark. It’s rare, because glowing is recessive. Rare, but not impossible…',
    'Real people now. The NHS maternity ward wants to know: boy or girl? It’s the same square, I promise.',
    'Newborn genome screening flagged a family. Same genetics, real stakes. Take your time, counsellor.',
  ],
  ranks: [
    { badge: '🧬', name: 'Consultant Geneticist', line: 'Every square perfect, first go. The NHS genomics team wants you.' },
    { badge: '🔬', name: 'Genetic Counsellor', line: 'A wobble or two, but every family got the right answer.' },
    { badge: '🐣', name: 'Blobbit Breeder', line: 'You got there. The Blobbits forgive you. Mostly.' },
    { badge: '🥚', name: 'Egg Watcher', line: 'Lots of cracked predictions. Breed again and beat it.' },
  ],
  rule: ['Each parent passes on ONE allele: one from the row, one from the column.', 'Count the boxes you want: each box is 1 in 4, or 25%.', 'Expected number = total ÷ 4 × boxes. Real hatchings land close.'],
  start: 'Open the lab',
  action: task => isTiles(task) ? 'Lock it in' : task.scene.layout === 'clutch' ? 'Hatch!' : 'Check it',
  asker: task => `Dr Mensah · ${isTiles(task) ? 'tap the tiles in order' : 'set your prediction'}`,
  busted: {
    emoji: '🥚', kicker: 'Lab locked', title: 'Three wrong calls. The Blobbits have stopped laying.',
    tip: 'One allele from the row, one from the column, in every box. Big letters hide small ones. Each box is 25%, and the expected number is total ÷ 4 × the boxes you want.',
    retry: 'Try the round again',
  },
  burst: '🐣',
  brag: (name, badge) => `I bred a whole clutch of Blobbits and cracked an NHS genetics case in Creature Breeder. Rank: ${name} ${badge}`,
  again: 'Breed again',
  sound: sfx.bubble,
  actionMs: 900,
  Stage,
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function GeneDetective() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <PlayGame key={play} rounds={data} onReplay={regenerate} config={config} /> : null
}

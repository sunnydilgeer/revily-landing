'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { areaTitles, branchLeaves, branchTiers, tileLevel, type AreaId, type TopicScore } from './paperMap'
import { levelLabels } from './readiness'
import './SkillTree.css'

export const BOSS_ID = 'boss'
const ROW = 118
const NODE = 58
/** From a node's centre to just under its label. */
const LABEL_DROP = 58
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Node symbols: a glance at what each topic is about. */
const symbols: Record<string, string> = {
  'number-types': 'π', 'place-value': '10³', bidmas: '( )', factors: '2×3', 'written-methods': '×÷', rounding: '≈',
  fractions: '½', decimals: '0.1', bounds: '±', fdp: '½ %', percentages: '%', money: '£',
  simplifying: '2a', 'function-machines': '→', substitution: 'x=3', equations: '=', sequences: '1,3,5', 'straight-lines': '╱',
  ratio: '2:3', conversions: 'km', speed: '⏱',
  shapes: '◇', angles: '∠', area: '▭', volume: '⬚', transformations: '↻', pythagoras: 'a²', trigonometry: 'sin',
  probability: '🎲', 'frequency-trees': '⑂', charts: '▥', averages: 'x̄',
}

const tabTitles: Record<AreaId, string> = { number: 'Number', algebra: 'Algebra', geometry: 'Geometry', ratio: 'Ratio', probability: 'Probability', statistics: 'Statistics' }

export const branchOrder: AreaId[] = ['number', 'algebra', 'geometry', 'ratio', 'probability', 'statistics']

type Placed = { id: string; x: number; y: number }

/** One branch of the exam as a skill tree: topics light up as the student gets ready, with a boss at the end. */
export default function SkillTree({ area, onArea, scores, selected, onSelect, bossOpen, bossBeaten }: {
  area: AreaId
  onArea: (area: AreaId) => void
  scores: TopicScore[]
  selected: string
  onSelect: (id: string) => void
  bossOpen: boolean
  bossBeaten: boolean
}) {
  const byId = useMemo(() => new Map(scores.map(score => [score.topic.id, score])), [scores])
  const tiers = useMemo(() => branchTiers(area), [area])
  const leaves = useMemo(() => branchLeaves(area), [area])
  const hasBoss = leaves.length > 0

  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  useIsoLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => setWidth(node.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Rows from the roots down. Within a row, nodes sit under the average position of their parents. Rows of
  // topics not in Revily yet move to the right-hand side, leaving the middle clear for the path to the boss.
  const placed = useMemo(() => {
    const at = new Map<string, Placed>()
    tiers.forEach((tier, row) => {
      const order = row === 0 ? tier : [...tier].sort((a, b) => parentX(a.requires) - parentX(b.requires))
      const aside = hasBoss && order.every(topic => !byId.get(topic.id)?.taught)
      order.forEach((topic, index) => {
        const slot = (index + 0.5) / order.length
        at.set(topic.id, { id: topic.id, x: (aside ? 0.62 + slot * 0.3 : slot) * width, y: row * ROW + NODE / 2 + 8 })
      })
    })
    function parentX(requires?: string[]) {
      const xs = (requires ?? []).map(id => at.get(id)?.x ?? 0)
      return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0
    }
    if (hasBoss) at.set(BOSS_ID, { id: BOSS_ID, x: width / 2, y: tiers.length * ROW + NODE / 2 + 18 })
    return at
  }, [tiers, hasBoss, byId, width])

  const edges = useMemo(() => {
    const list: { from: Placed; to: Placed; lit: boolean; soon: boolean }[] = []
    for (const tier of tiers) for (const topic of tier) for (const parent of topic.requires ?? []) {
      const from = placed.get(parent), to = placed.get(topic.id)
      const score = byId.get(parent)
      if (from && to) list.push({ from, to, lit: Boolean(score && (tileLevel(score) === 'secure' || tileLevel(score) === 'examReady')), soon: !byId.get(topic.id)?.taught })
    }
    const boss = placed.get(BOSS_ID)
    if (boss) for (const leaf of leaves) {
      const from = placed.get(leaf.id), score = byId.get(leaf.id)
      if (from) list.push({ from, to: boss, lit: Boolean(score && tileLevel(score) !== 'notStarted' && tileLevel(score) !== 'learning'), soon: false })
    }
    return list
  }, [tiers, leaves, placed, byId])

  const height = Math.max(...[...placed.values()].map(node => node.y)) + NODE / 2 + 56
  const branchMarks = scores.filter(score => score.topic.area === area)
  const ready = branchMarks.reduce((sum, score) => sum + score.ready, 0)
  const worth = branchMarks.reduce((sum, score) => sum + score.marks, 0)

  return <div className="st">
    <div className="st-branches" role="tablist" aria-label="Branches">
      {branchOrder.map(id => {
        const taught = scores.some(score => score.topic.area === id && score.taught)
        return <button key={id} type="button" role="tab" aria-selected={id === area} className={`st-branch${id === area ? ' is-on' : ''}`} onClick={() => onArea(id)}>
          {!taught && <span aria-hidden="true">🔒 </span>}{tabTitles[id]}
        </button>
      })}
    </div>
    <p className="st-branch-score">
      <strong>{areaTitles[area]}</strong> · ready for about {Math.round(ready)} of {Math.round(worth)} marks
      {bossBeaten && <span className="st-mastered">👑 Mastered</span>}
    </p>

    <div className="st-tree" ref={ref} style={{ height: width ? height : undefined }}>
      {width > 0 && <>
        <svg className="st-edges" width={width} height={height} aria-hidden="true">
          {edges.map(({ from, to, lit, soon }) => {
            // From under the parent's label to the top of the child, so lines never cross a name.
            const x1 = from.x, y1 = from.y + LABEL_DROP, x2 = to.x, y2 = to.y - (to.id === BOSS_ID ? 44 : NODE / 2 + 4)
            const mid = (y1 + y2) / 2
            return <path
              key={`${from.id}-${to.id}`}
              className={`st-edge${lit ? ' is-lit' : ''}${soon ? ' is-soon' : ''}`}
              d={`M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`}
            />
          })}
        </svg>
        {tiers.flat().map(topic => {
          const at = placed.get(topic.id)!, score = byId.get(topic.id)!
          const level = tileLevel(score)
          const state = score.taught ? level : 'soon'
          return <button
            key={topic.id}
            type="button"
            className={`st-node st-node--${state}${selected === topic.id ? ' is-selected' : ''}`}
            style={{ left: at.x, top: at.y }}
            aria-pressed={selected === topic.id}
            aria-label={`${topic.title}: ${score.taught ? levelLabels[level] : 'not in Revily yet'}, about ${Math.round(score.marks)} marks a paper`}
            onClick={() => onSelect(topic.id)}
          >
            <span className="st-node__orb" style={{ ['--share' as string]: `${score.share * 360}deg` }}>
              <span className="st-node__symbol" aria-hidden="true">{score.taught ? symbols[topic.id] ?? '•' : '🔒'}</span>
            </span>
            <span className="st-node__marks" aria-hidden="true">★{Math.max(1, Math.round(score.marks))}</span>
            <span className="st-node__label">{topic.short ?? topic.title}</span>
          </button>
        })}
        {hasBoss && (() => {
          const at = placed.get(BOSS_ID)!
          return <button
            type="button"
            className={`st-node st-boss${bossBeaten ? ' is-beaten' : bossOpen ? ' is-open' : ''}${selected === BOSS_ID ? ' is-selected' : ''}`}
            style={{ left: at.x, top: at.y }}
            aria-pressed={selected === BOSS_ID}
            aria-label={`${areaTitles[area]} boss: ${bossBeaten ? 'beaten' : bossOpen ? 'ready to fight' : 'locked'}`}
            onClick={() => onSelect(BOSS_ID)}
          >
            <span className="st-node__orb"><span className="st-node__symbol" aria-hidden="true">{bossBeaten ? '👑' : bossOpen ? '⚔️' : '🔒'}</span></span>
            <span className="st-node__label">Boss</span>
          </button>
        })()}
      </>}
    </div>
  </div>
}

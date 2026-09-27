'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import BossCharacter from './BossCharacter'
import { CrownIcon, LockIcon, StarIcon, TopicIcon } from '../../../ui/icons'
import { branchLeaves, branchTiers, tileLevel, type AreaId, type TopicScore } from './paperMap'
import { levelLabels, levelOrder, type Level } from './readiness'
import { assignColumns, colX, railPoints, roundedPath, ROW, rowY, type Grid, type RailNode } from './rails'
import './SkillTree.css'

export const BOSS_ID = 'boss'
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Node size follows the marks a topic is worth: keystones are the big-ticket topics of the paper. */
export type NodeKind = 'keystone' | 'standard' | 'stud'
export const nodeKind = (marks: number): NodeKind => marks >= 3.5 ? 'keystone' : marks >= 1.5 ? 'standard' : 'stud'
const nodeSize: Record<NodeKind, number> = { keystone: 84, standard: 64, stud: 52 }
const BOSS_SIZE = 108

/** What a node looks like: not in Revily yet, waiting on earlier topics, ready to start, or a level. */
export type NodeState = 'soon' | 'dormant' | 'available' | Exclude<Level, 'notStarted'>

export function nodeState(score: TopicScore, byId: Map<string, TopicScore>): NodeState {
  if (!score.taught) return 'soon'
  const level = tileLevel(score)
  if (level !== 'notStarted') return level
  const ready = (score.topic.requires ?? []).every(id => {
    const parent = byId.get(id)
    return !parent?.taught || levelOrder.indexOf(tileLevel(parent)) >= levelOrder.indexOf('learning')
  })
  return ready ? 'available' : 'dormant'
}

const stateLabel = (state: NodeState) => state === 'soon' ? 'not in Revily yet' : state === 'dormant' ? 'not started' : state === 'available' ? 'ready to start' : levelLabels[state].toLowerCase()

const formatGain = (marks: number) => String(Math.max(0.1, Math.round(marks * 10) / 10))

/** A deterministic scatter of stars for a branch's sky. */
function starsFor(seed: number, width: number, height: number) {
  let t = seed
  const next = () => { t = (t + 0x6d2b79f5) | 0; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296 }
  return Array.from({ length: Math.round(width * height / 5200) }, (_, index) => ({ x: next() * width, y: next() * height, r: next() < 0.15 ? 1.6 : 0.6 + next() * 0.7, twinkle: index % 7 === 0, delay: next() * 4 }))
}

type Placed = RailNode

/** One branch of the exam as a skill tree in the night sky, lit up by what the student has learnt. */
/** A topic that moved on since the last visit: waiting its turn, then lighting up with the marks it gained. */
export type Arrival = { phase: 'waiting' | 'igniting'; gain: number }

export default function SkillTree({ area, scores, selected, onSelect, bossOpen, bossBeaten, arrival }: {
  area: AreaId
  scores: TopicScore[]
  selected: string | null
  onSelect: (id: string) => void
  bossOpen: boolean
  bossBeaten: boolean
  /** Topics that levelled up since the last visit: dimmed while they wait their turn, then lighting up. */
  arrival: Record<string, Arrival>
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

  // Nodes on a grid of columns, rows from the roots down. Rows of topics not in Revily yet keep to the
  // right-hand columns, leaving the middle clear for the rails down to the boss.
  const grid: Grid = useMemo(() => ({ width, cols: Math.max(3, ...tiers.map(tier => tier.length)), top: 58, row: ROW }), [width, tiers])
  const placed = useMemo(() => {
    const aside = (row: number) => hasBoss && tiers[row].every(topic => !byId.get(topic.id)?.taught)
    const cols = assignColumns(tiers, grid.cols, aside)
    const at = new Map<string, Placed>()
    tiers.forEach((tier, row) => tier.forEach(topic => {
      const col = cols.get(topic.id)!
      at.set(topic.id, { id: topic.id, row, col, x: colX(grid, col), y: rowY(grid, row), size: nodeSize[nodeKind(byId.get(topic.id)!.marks)] })
    }))
    if (hasBoss) at.set(BOSS_ID, { id: BOSS_ID, row: tiers.length, col: (grid.cols - 1) / 2, x: width / 2, y: rowY(grid, tiers.length) + 20, size: BOSS_SIZE })
    return at
  }, [tiers, hasBoss, byId, grid, width])

  const edges = useMemo(() => {
    const taken = new Set([...placed.values()].map(node => `${node.row}:${node.col}`))
    const occupied = (row: number, col: number) => taken.has(`${row}:${col}`)
    const list: { from: Placed; to: Placed; d: string; lit: boolean; soon: boolean }[] = []
    const litFrom = (id: string) => { const score = byId.get(id); return Boolean(score && ['secure', 'examReady'].includes(tileLevel(score))) }
    const link = (from: Placed, to: Placed, lit: boolean, soon: boolean) => list.push({ from, to, lit, soon, d: roundedPath(railPoints(grid, from, to, occupied)) })
    for (const tier of tiers) for (const topic of tier) for (const parent of topic.requires ?? []) {
      const from = placed.get(parent), to = placed.get(topic.id)
      if (from && to) link(from, to, litFrom(parent), !byId.get(topic.id)?.taught)
    }
    const boss = placed.get(BOSS_ID)
    if (boss) for (const leaf of leaves) {
      const from = placed.get(leaf.id)
      if (from) link(from, boss, litFrom(leaf.id), false)
    }
    // Unlit rails first, so a lit rail sharing a stretch with an unlit one is drawn on top.
    return list.sort((a, b) => Number(a.lit) - Number(b.lit))
  }, [tiers, leaves, placed, byId, grid])

  const height = Math.max(0, ...[...placed.values()].map(node => node.y + node.size / 2)) + 72
  const stars = useMemo(() => width ? starsFor(area.length * 7919 + 13, width, height) : [], [area, width, height])

  return <div className={`st st--${area}`} ref={ref} style={{ height: width ? height : 520, ['--label-w' as string]: `${Math.max(60, Math.min(86, width / grid.cols - 14))}px` }}>
    {width > 0 && <>
      <svg className="st-sky" width={width} height={height} aria-hidden="true">
        {stars.map((star, index) => <circle key={index} cx={star.x} cy={star.y} r={star.r} className={star.twinkle ? 'st-star is-twinkling' : 'st-star'} style={star.twinkle ? { animationDelay: `${star.delay}s` } : undefined} />)}
      </svg>
      <svg className="st-edges" width={width} height={height} aria-hidden="true">
        {edges.map(({ from, to, d, soon }) => <path key={`case-${from.id}-${to.id}`} className={`st-edge-case${soon ? ' is-soon' : ''}`} d={d} />)}
        {edges.map(({ from, to, d, lit, soon }) => {
          // A rail out of a topic that just levelled up draws in once the topic has lit up.
          const coming = arrival[from.id]?.phase
          return <g key={`${from.id}-${to.id}`}>
            <path className={`st-edge${soon ? ' is-soon' : ''}`} d={d} />
            {lit && <path className={`st-edge-lit${coming === 'waiting' ? ' is-waiting' : coming === 'igniting' ? ' is-drawing' : ''}`} d={d} pathLength={1} />}
            {lit && !coming && <path className="st-edge-flow" d={d} pathLength={1} />}
          </g>
        })}
      </svg>

      {tiers.flat().map(topic => {
        const at = placed.get(topic.id)!, score = byId.get(topic.id)!
        const kind = nodeKind(score.marks), state = nodeState(score, byId)
        const share = state === 'soon' ? 0 : score.share
        return <button
          key={topic.id}
          id={`node-${topic.id}`}
          type="button"
          className={`sn sn--${kind} sn--${state}${selected === topic.id ? ' is-selected' : ''}${arrival[topic.id]?.phase === 'waiting' ? ' is-pending' : arrival[topic.id]?.phase === 'igniting' ? ' is-igniting' : ''}`}
          style={{ left: at.x, top: at.y, ['--size' as string]: `${at.size}px` }}
          aria-label={`${topic.title}: ${stateLabel(state)}, about ${Math.max(1, Math.round(score.marks))} marks a paper`}
          onClick={() => onSelect(topic.id)}
        >
          <span className="sn-core">
            <NodeRing kind={kind} share={share} />
            <TopicIcon id={topic.id} size={kind === 'keystone' ? 34 : kind === 'standard' ? 27 : 22} className="sn-icon" />
            {state === 'soon' && <span className="sn-badge sn-badge--lock"><LockIcon size={11} strokeWidth={2.6} /></span>}
            {state === 'examReady' && <span className="sn-badge sn-badge--crown"><CrownIcon size={12} strokeWidth={2.4} /></span>}
            {arrival[topic.id]?.phase === 'igniting' && <span className="sn-burst" aria-hidden="true" />}
            {arrival[topic.id]?.phase === 'igniting' && <span className="sn-gain" aria-hidden="true">+{formatGain(arrival[topic.id].gain)}<StarIcon size={11} /></span>}
          </span>
          <span className="sn-label">{topic.short ?? topic.title}</span>
          <span className="sn-marks"><StarIcon size={10} />{Math.max(1, Math.round(score.marks))}</span>
        </button>
      })}

      {hasBoss && (() => {
        const at = placed.get(BOSS_ID)!
        const state = bossBeaten ? 'beaten' : bossOpen ? 'open' : 'locked'
        return <button
          type="button"
          id="node-boss"
          className={`sn-boss sn-boss--${state}${selected === BOSS_ID ? ' is-selected' : ''}`}
          style={{ left: at.x, top: at.y }}
          aria-label={`The Treasurer, the Number boss: ${state === 'beaten' ? 'beaten' : state === 'open' ? 'ready to fight' : 'locked'}`}
          onClick={() => onSelect(BOSS_ID)}
        >
          <span className="sn-boss__plinth" aria-hidden="true" />
          <span className="sn-boss__art" aria-hidden="true"><BossCharacter mood="idle" damage={bossBeaten ? 3 : 0} size={BOSS_SIZE} /></span>
          {state === 'locked' && <span className="sn-badge sn-badge--lock sn-boss__badge"><LockIcon size={13} strokeWidth={2.6} /></span>}
          {state === 'beaten' && <span className="sn-badge sn-badge--crown sn-boss__badge"><CrownIcon size={14} strokeWidth={2.4} /></span>}
          <span className="sn-boss__kicker">Boss</span>
          <span className="sn-boss__name">The Treasurer</span>
        </button>
      })()}
    </>}
  </div>
}

/** The progress ring round a node: a hexagon for keystones, a circle for the rest. */
function NodeRing({ kind, share }: { kind: NodeKind; share: number }) {
  const shape = kind === 'keystone'
    ? { as: 'polygon' as const, points: '50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5' }
    : { as: 'circle' as const }
  return <svg className="sn-ring" viewBox="0 0 100 100" aria-hidden="true">
    {shape.as === 'polygon'
      ? <><polygon className="sn-ring__track" points={shape.points} /><polygon className="sn-ring__fill" points={shape.points} pathLength={1} style={{ strokeDasharray: `${share} 1` }} /></>
      : <><circle className="sn-ring__track" cx="50" cy="50" r="46" /><circle className="sn-ring__fill" cx="50" cy="50" r="46" pathLength={1} style={{ strokeDasharray: `${share} 1` }} transform="rotate(-90 50 50)" /></>}
  </svg>
}

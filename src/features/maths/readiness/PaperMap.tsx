'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { areaTitles, tileLevel, type AreaId, type TopicScore } from './paperMap'
import { levelLabels } from './readiness'
import { squarify, type Rect } from './squarify'
import './PaperMap.css'

const AREA_GAP = 8
const TILE_GAP = 3
/** Height of the strip above each area that holds its name. */
const AREA_HEAD = 20
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const inset = (rect: Rect, by: number): Rect => ({ x: rect.x + by / 2, y: rect.y + by / 2, w: Math.max(0, rect.w - by), h: Math.max(0, rect.h - by) })
const round = (marks: number) => Math.round(marks)
const aboutMarks = (marks: number) => marks < 1 ? 'under 1 mark' : `about ${round(marks)} mark${round(marks) === 1 ? '' : 's'}`

/** The longest name that fits the tile without breaking a word, or null when none does. */
function labelFor(topic: { title: string; short?: string }, rect: Rect) {
  if (rect.h < 32) return null
  const room = rect.w - 14
  const fits = (name: string) => Math.max(...name.split(' ').map(word => word.length)) * 6.9 <= room && (rect.h >= 50 || name.length * 6.9 <= room)
  return [topic.title, topic.short].find((name): name is string => Boolean(name && fits(name))) ?? null
}

/** The marks map: the whole Foundation paper as tiles sized by marks, coloured by how ready the student is. */
export function MarksMap({ scores, selected, onSelect }: { scores: TopicScore[]; selected: string | null; onSelect: (id: string) => void }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  useIsoLayoutEffect(() => {
    const node = mapRef.current
    if (!node) return
    const measure = () => setSize({ w: node.clientWidth, h: node.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const layout = useMemo(() => {
    if (!size) return null
    const areas = new Map<AreaId, TopicScore[]>()
    for (const score of scores) areas.set(score.topic.area, [...(areas.get(score.topic.area) ?? []), score])
    const areaRects = squarify([...areas].map(([area, list]) => ({ value: list.reduce((sum, score) => sum + score.marks, 0), item: area })), { x: 0, y: 0, ...size })
    return areaRects.map(area => {
      const outer = inset(area, AREA_GAP)
      const headed = outer.w >= 64 && outer.h >= 90
      const box = headed ? { ...outer, y: outer.y + AREA_HEAD, h: outer.h - AREA_HEAD } : outer
      return { area: area.item, outer, headed, tiles: squarify(areas.get(area.item)!.map(score => ({ value: score.marks, item: score })), box).map(tile => ({ ...inset(tile, TILE_GAP), score: tile.item })) }
    })
  }, [scores, size])

  return <div className="pm-map" ref={mapRef}>
    {layout?.map(({ area, outer, headed, tiles }) => <div key={area} className="pm-area" role="group" aria-label={areaTitles[area]}>
      {tiles.map(({ score, ...rect }) => {
        const level = tileLevel(score)
        const label = labelFor(score.topic, rect)
        return <button
          key={score.topic.id}
          type="button"
          className={[
            'pm-tile',
            score.taught ? `pm-tile--${level}` : 'pm-tile--soon',
            selected === score.topic.id ? 'is-selected' : '',
          ].join(' ')}
          style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
          aria-pressed={selected === score.topic.id}
          aria-label={`${score.topic.title}: ${aboutMarks(score.marks)} a paper. ${score.taught ? `${levelLabels[level]}, ready for ${aboutMarks(score.ready)}.` : 'Not in Revily yet.'}`}
          onClick={() => onSelect(score.topic.id)}
        >
          {score.taught && <span className="pm-tile__fill" style={{ height: `${score.share * 100}%` }} />}
          {label && <span className="pm-tile__title">{label}</span>}
          {label && rect.h >= 56 && rect.w >= 56 && <span className="pm-tile__marks">{round(score.marks) || '<1'} marks</span>}
        </button>
      })}
      {headed && <span className="pm-area__label" style={{ left: outer.x + 2, top: outer.y, width: outer.w - 4 }}>{areaTitles[area]}</span>}
    </div>)}
  </div>
}

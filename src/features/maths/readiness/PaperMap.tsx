'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { labCatalog } from '../labs/catalog'
import { areaTitles, biggestWin, GRADE_4_SHARE, PAPER_MARKS, scoreTopics, tileLevel, type AreaId, type TopicScore } from './paperMap'
import { levelLabels, type Level } from './readiness'
import { squarify, type Rect } from './squarify'
import SkillTree, { BOSS_ID } from './SkillTree'
import BossFight from './BossFight'
import { bosses, readBossRecords, type Boss } from './bosses'
import './PaperMap.css'

type View = 'tree' | 'map'

export type StatementRow = { key: string; statement: string; level: Level; href: string }

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

/** How ready the student is for the whole Foundation paper: as a skill tree (default) or a map of the marks. */
export default function PaperMap({ rows }: { rows: StatementRow[] }) {
  const byKey = useMemo(() => new Map(rows.map(row => [row.key, row])), [rows])
  const scores = useMemo(() => scoreTopics(Object.fromEntries(rows.map(row => [row.key, row.level]))), [rows])
  const win = biggestWin(scores)
  const [view, setView] = useState<View>('tree')
  const [area, setArea] = useState<AreaId>('number')
  const [selected, setSelected] = useState<string | null>(null)
  const [records, setRecords] = useState<ReturnType<typeof readBossRecords>>({})
  const [bossOverride, setBossOverride] = useState(false)
  const [fighting, setFighting] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('view') === 'map') setView('map')
    setBossOverride(params.get('boss') === 'open')
    setRecords(readBossRecords())
  }, [])

  function show(next: View) {
    setView(next)
    const url = new URL(window.location.href)
    url.searchParams.set('view', next)
    window.history.replaceState(null, '', url)
  }

  const boss = bosses.find(candidate => candidate.area === area)
  const bossTaught = scores.filter(score => score.topic.area === area && score.taught)
  const bossOpen = Boolean(boss) && (bossOverride || bossTaught.every(score => ['learnt', 'secure', 'examReady'].includes(tileLevel(score))))
  const bossBeaten = Boolean(records[area]?.beatenOn)
  const inArea = (id: string | null) => id === BOSS_ID ? Boolean(boss) : scores.some(score => score.topic.id === id && (view === 'map' || score.topic.area === area))
  const fallback = view === 'tree' && win?.topic.area !== area ? scores.find(score => score.topic.area === area)!.topic.id : win?.topic.id ?? 'fractions'
  const currentId = inArea(selected) ? selected! : fallback
  const current = scores.find(score => score.topic.id === currentId)

  const ready = scores.reduce((sum, score) => sum + score.ready, 0)
  const taught = scores.filter(score => score.taught).reduce((sum, score) => sum + score.marks, 0)
  const nextStep = (score: TopicScore) => score.topic.statements.map(key => byKey.get(key)).find(row => row && row.level !== 'examReady')

  return <section className="pm" aria-labelledby="pm-title">
    <div className="pm-score">
      <h2 id="pm-title" className="pm-score__line">You’re ready for about <strong>{round(ready)}</strong> of {PAPER_MARKS} marks</h2>
      <div className="pm-bar" role="img" aria-label={`Ready for about ${round(ready)} of ${PAPER_MARKS} marks. Revily teaches about ${round(taught)} so far. Grade 4 usually needs about ${round(PAPER_MARKS * GRADE_4_SHARE)}.`}>
        <span className="pm-bar__taught" style={{ width: `${taught / PAPER_MARKS * 100}%` }} />
        <span className="pm-bar__ready" style={{ width: `${ready / PAPER_MARKS * 100}%` }} />
        <span className="pm-bar__grade" style={{ left: `${GRADE_4_SHARE * 100}%` }}><span>Grade 4</span></span>
      </div>
      <p className="pm-legend">
        <span><i className="pm-swatch pm-swatch--ready" />Ready</span>
        <span><i className="pm-swatch pm-swatch--taught" />In Revily so far ({round(taught)})</span>
        <span><i className="pm-swatch pm-swatch--soon" />Coming</span>
      </p>
    </div>

    {win && (() => {
      const step = nextStep(win)
      return <a className="pm-win" href={step?.href ?? '/preview'}>
        <span className="pm-win__kicker">Biggest win next</span>
        <span className="pm-win__title">{win.topic.title}</span>
        <span className="pm-win__marks">up to +{Math.max(1, round(win.marks - win.ready))} marks</span>
        <span className="pm-win__go" aria-hidden="true">→</span>
      </a>
    })()}

    <div className="pm-views" role="tablist" aria-label="How to see it">
      <button type="button" role="tab" aria-selected={view === 'tree'} className={view === 'tree' ? 'is-on' : ''} onClick={() => show('tree')}>Skill tree</button>
      <button type="button" role="tab" aria-selected={view === 'map'} className={view === 'map' ? 'is-on' : ''} onClick={() => show('map')}>Marks map</button>
    </div>

    {view === 'tree'
      ? <SkillTree area={area} onArea={next => { setArea(next); setSelected(null) }} scores={scores} selected={currentId} onSelect={setSelected} bossOpen={bossOpen} bossBeaten={bossBeaten} />
      : <MarksMap scores={scores} selected={currentId} onSelect={setSelected} />}

    {currentId === BOSS_ID && boss
      ? <BossDetail boss={boss} open={bossOpen} beaten={bossBeaten} waiting={bossTaught.filter(score => !['learnt', 'secure', 'examReady'].includes(tileLevel(score)))} onFight={() => setFighting(true)} />
      : current && <TopicDetail score={current} byKey={byKey} />}

    {fighting && boss && <BossFight boss={boss} record={records[area]} onClose={() => { setFighting(false); setRecords(readBossRecords()) }} onWin={() => setRecords(readBossRecords())} />}
  </section>
}

function MarksMap({ scores, selected, onSelect }: { scores: TopicScore[]; selected: string; onSelect: (id: string) => void }) {
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

function BossDetail({ boss, open, beaten, waiting, onFight }: { boss: Boss; open: boolean; beaten: boolean; waiting: TopicScore[]; onFight: () => void }) {
  return <div className="pm-detail pm-boss" aria-live="polite">
    <p className="pm-detail__area">{areaTitles[boss.area]} · Boss</p>
    <h3>{boss.title}</h3>
    <p className="pm-detail__facts">{boss.story}</p>
    {beaten && <p className="pm-boss__beaten">👑 Beaten. The {areaTitles[boss.area]} branch is mastered. Fight again any time with new numbers.</p>}
    {open
      ? <button type="button" className="pm-boss__fight" onClick={onFight}>{beaten ? 'Fight again' : 'Fight the boss'}</button>
      : <>
        <p className="pm-detail__soon">Unlocks when you’ve learnt every topic in the branch. Still to go:</p>
        <ul className="pm-boss__waiting">{waiting.map(score => <li key={score.topic.id}>{score.topic.title}</li>)}</ul>
      </>}
  </div>
}

function TopicDetail({ score, byKey }: { score: TopicScore; byKey: Map<string, StatementRow> }) {
  const { topic } = score
  const statements = topic.statements.map(key => byKey.get(key)).filter((row): row is StatementRow => Boolean(row))
  const labs = labCatalog.filter(lab => topic.labs?.includes(lab.id))
  return <div className="pm-detail" aria-live="polite">
    <p className="pm-detail__area">{areaTitles[topic.area]}</p>
    <h3>{topic.title}</h3>
    <p className="pm-detail__facts">
      Worth {aboutMarks(score.marks)} a paper
      {topic.sittings ? ` · in ${topic.sittings} of the last 10 exams` : ''}
      {score.taught ? ` · you’re ready for ${aboutMarks(score.ready)}` : ''}
    </p>
    {!score.taught && <p className="pm-detail__soon">Not in Revily yet. {topic.sittings === 10 ? 'It comes up in every exam, so it’s high on our list.' : 'It’s on our list.'}</p>}
    {labs.length > 0 && <ul className="pm-labs">
      {labs.map(lab => <li key={lab.id}><a href={lab.href}><span aria-hidden="true">{lab.emoji}</span> {lab.title}<small>{lab.skill}</small></a></li>)}
    </ul>}
    {statements.length > 0 && <ul className="pm-statements">
      {statements.map(row => <li key={row.key}>
        <a href={row.href}>
          <span className={`xc-level xc-level--${row.level}`}>{levelLabels[row.level]}</span>
          <span>{row.statement}</span>
        </a>
      </li>)}
    </ul>}
  </div>
}


'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { labCatalog } from '../labs/catalog'
import BossCharacter from './BossCharacter'
import BossFight from './BossFight'
import { bosses, readBossRecords, type Boss } from './bosses'
import { ArrowIcon, BackIcon, ChecklistIcon, CrownIcon, GridIcon, LockIcon, StarIcon, TopicIcon } from './icons'
import { MarksMap } from './PaperMap'
import { areaTitles, biggestWin, GRADE_4_SHARE, PAPER_MARKS, scoreTopics, tileLevel, type AreaId, type TopicScore } from './paperMap'
import { levelLabels, levelOrder, type Level } from './readiness'
import Sheet from './Sheet'
import SkillTree, { BOSS_ID, nodeKind, nodeState, type Arrival, type NodeState } from './SkillTree'
import './ExamWorld.css'

export type StatementRow = { key: string; statement: string; level: Level; href: string }

const branchOrder: AreaId[] = ['number', 'algebra', 'geometry', 'ratio', 'probability', 'statistics']
const branchNames: Record<AreaId, string> = { number: 'Number', algebra: 'Algebra', geometry: 'Geometry', ratio: 'Ratio', probability: 'Probability', statistics: 'Statistics' }
const LEARNT: Level[] = ['learnt', 'secure', 'examReady']

const SEEN_KEY = 'revily:maths-tree-seen:v1'
type Seen = { levels: Record<string, Level>; ready: number }
function readSeen(): Seen | null {
  try { return JSON.parse(window.localStorage.getItem(SEEN_KEY) ?? 'null') } catch { return null }
}
function writeSeen(seen: Seen) {
  try { window.localStorage.setItem(SEEN_KEY, JSON.stringify(seen)) } catch { /* storage blocked: the arrival plays again next time */ }
}
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const whole = (marks: number) => Math.max(1, Math.round(marks))

/** The exam as a world to explore: the marks you're ready for, and a skill tree for each branch of the course. */
export default function ExamWorld({ rows, loaded, weeks, year, checklist }: {
  rows: StatementRow[]
  loaded: boolean
  weeks: number
  year: number
  checklist: ReactNode
}) {
  const byKey = useMemo(() => new Map(rows.map(row => [row.key, row])), [rows])
  const scores = useMemo(() => scoreTopics(Object.fromEntries(rows.map(row => [row.key, row.level]))), [rows])
  const byId = useMemo(() => new Map(scores.map(score => [score.topic.id, score])), [scores])
  const ready = scores.reduce((sum, score) => sum + score.ready, 0)
  const taught = scores.filter(score => score.taught).reduce((sum, score) => sum + score.marks, 0)

  const [area, setArea] = useState<AreaId>('number')
  const [selected, setSelected] = useState<string | null>(null)
  const [sheet, setSheet] = useState<'checklist' | 'map' | null>(null)
  const [records, setRecords] = useState<ReturnType<typeof readBossRecords>>({})
  const [bossOverride, setBossOverride] = useState(false)
  const [fighting, setFighting] = useState(false)
  const [shown, setShown] = useState<number | null>(null)
  const [arrival, setArrival] = useState<Record<string, Arrival>>({})

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('view') === 'map') setSheet('map')
    setBossOverride(params.get('boss') === 'open')
    setRecords(readBossRecords())
  }, [])

  // Arrival: topics that levelled up since the last visit light up one by one and the marks count up.
  const arrived = useRef(false)
  useEffect(() => {
    if (!loaded || arrived.current) return
    arrived.current = true
    const seen = readSeen()
    const levels = Object.fromEntries(scores.filter(score => score.taught).map(score => [score.topic.id, tileLevel(score)]))
    writeSeen({ levels, ready })
    const improved = scores.filter(score => score.taught && score.topic.area === 'number'
      && levelOrder.indexOf(levels[score.topic.id]) > levelOrder.indexOf(seen?.levels[score.topic.id] ?? 'notStarted'))
    const from = Math.min(seen?.ready ?? 0, ready)
    if (reducedMotion() || (!improved.length && from === ready)) { setShown(ready); return }

    const STEP = 700, START = 450
    setArrival(Object.fromEntries(improved.map(score => [score.topic.id, 'waiting' as const])))
    const timers: number[] = []
    improved.forEach((score, index) => {
      const at = START + index * STEP
      if (index === 0) timers.push(window.setTimeout(() => document.getElementById(`node-${score.topic.id}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), at - 300))
      timers.push(window.setTimeout(() => setArrival(current => ({ ...current, [score.topic.id]: 'igniting' })), at))
      timers.push(window.setTimeout(() => setArrival(current => { const next = { ...current }; delete next[score.topic.id]; return next }), at + 1400))
    })
    const duration = START + Math.max(1, improved.length) * STEP
    const began = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - began) / duration)
      setShown(from + (ready - from) * (1 - Math.pow(1 - t, 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => { timers.forEach(clearTimeout); cancelAnimationFrame(frame) }
  }, [loaded, scores, ready])

  const boss = bosses.find(candidate => candidate.area === area)
  const branchTaught = scores.filter(score => score.topic.area === area && score.taught)
  const bossOpen = Boolean(boss) && (bossOverride || branchTaught.every(score => LEARNT.includes(tileLevel(score))))
  const bossBeaten = Boolean(records[area]?.beatenOn)

  const nextStep = (score: TopicScore) => score.topic.statements.map(key => byKey.get(key)).find(row => row && row.level !== 'examReady')
  const win = biggestWin(scores)
  const numberBossOpen = bossOverride || scores.filter(score => score.topic.area === 'number' && score.taught).every(score => LEARNT.includes(tileLevel(score)))

  const display = shown ?? (loaded ? ready : 0)
  const selectedScore = selected && selected !== BOSS_ID ? byId.get(selected) : undefined

  return <main className="ew">
    <header className="ew-hud">
      <div className="ew-hud__bar">
        <a className="ew-icon" href="/preview" aria-label="Back to the curriculum"><BackIcon size={20} /></a>
        <p className="ew-hud__title">GCSE Maths · Foundation</p>
        <div className="ew-hud__actions">
          <button type="button" className="ew-icon" aria-label="Exam checklist" onClick={() => setSheet('checklist')}><ChecklistIcon size={20} /></button>
          <button type="button" className="ew-icon" aria-label="Marks map" onClick={() => setSheet('map')}><GridIcon size={20} /></button>
        </div>
      </div>

      <div className="ew-score">
        <div>
          <p className="ew-kicker">Marks you’re ready for</p>
          <p className="ew-score__value" aria-live="polite"><span className="ew-score__num">{Math.round(display)}</span><span className="ew-score__of">/{PAPER_MARKS}</span></p>
        </div>
        <div className="ew-countdown">
          <span className="ew-countdown__num">{weeks}</span>
          <span className="ew-countdown__label">weeks to<br />May {year}</span>
        </div>
      </div>
      <div className="ew-meter" role="img" aria-label={`Ready for about ${Math.round(ready)} of ${PAPER_MARKS} marks. Revily teaches about ${Math.round(taught)} so far. Grade 4 usually needs about ${Math.round(PAPER_MARKS * GRADE_4_SHARE)}.`}>
        <span className="ew-meter__taught" style={{ width: `${taught / PAPER_MARKS * 100}%` }} />
        <span className="ew-meter__ready" style={{ width: `${display / PAPER_MARKS * 100}%` }} />
        <span className="ew-meter__goal" style={{ left: `${GRADE_4_SHARE * 100}%` }}><span>Grade 4</span></span>
      </div>
      <p className="ew-meter__legend"><span className="is-ready">Ready</span><span className="is-taught">In Revily so far · {Math.round(taught)}</span></p>
    </header>

    <nav className="ew-branches" aria-label="Branches">
      {branchOrder.map(id => {
        const list = scores.filter(score => score.topic.area === id)
        const open = list.some(score => score.taught)
        const worth = list.reduce((sum, score) => sum + score.marks, 0), got = list.reduce((sum, score) => sum + score.ready, 0)
        return <button key={id} type="button" className={`ew-branch${id === area ? ' is-on' : ''}${open ? '' : ' is-locked'}`} aria-pressed={id === area} onClick={() => { setArea(id); setSelected(null) }}>
          <span className="ew-branch__name">{!open && <LockIcon size={12} strokeWidth={2.6} />}{branchNames[id]}</span>
          <span className="ew-branch__marks">{open ? `${Math.round(got)}/${Math.round(worth)}` : `${Math.round(worth)} marks`}{records[id]?.beatenOn && <CrownIcon size={12} />}</span>
        </button>
      })}
    </nav>

    <SkillTree area={area} scores={scores} selected={selected} onSelect={setSelected} bossOpen={bossOpen} bossBeaten={bossBeaten} arrival={arrival} />
    <p className="ew-note">Tap anything to look closer. Marks come from what each topic has been worth in the last 30 Foundation papers: a rough guide, not a prediction.</p>

    <Quest win={win} nextHref={win ? nextStep(win)?.href : undefined} bossOpen={numberBossOpen} bossBeaten={Boolean(records.number?.beatenOn)} onBoss={() => { setArea('number'); setSelected(BOSS_ID) }} />

    {selectedScore && <Sheet label={selectedScore.topic.title} onClose={() => setSelected(null)}>
      <TopicPanel score={selectedScore} state={nodeState(selectedScore, byId)} byKey={byKey} next={nextStep(selectedScore)} />
    </Sheet>}
    {selected === BOSS_ID && boss && <Sheet label="The Treasurer, Number boss" onClose={() => setSelected(null)}>
      <BossPanel boss={boss} open={bossOpen} beaten={bossBeaten} waiting={branchTaught.filter(score => !LEARNT.includes(tileLevel(score)))} onFight={() => { setSelected(null); setFighting(true) }} />
    </Sheet>}
    {sheet === 'map' && <Sheet label="Marks map" tone="paper" onClose={() => setSheet(null)}>
      <div className="ew-sheet-head">
        <p className="ew-kicker ew-kicker--ink">The whole paper</p>
        <h2>Marks map</h2>
        <p>Every topic sized by the marks it’s worth. Tap one to open it.</p>
      </div>
      <MarksMap scores={scores} selected={null} onSelect={id => { setSheet(null); setArea(byId.get(id)!.topic.area); setSelected(id) }} />
    </Sheet>}
    {sheet === 'checklist' && <Sheet label="Exam checklist" tone="paper" onClose={() => setSheet(null)}>
      <div className="ew-sheet-head">
        <p className="ew-kicker ew-kicker--ink">Every skill</p>
        <h2>Exam checklist</h2>
      </div>
      {checklist}
    </Sheet>}
    {fighting && boss && <BossFight boss={boss} record={records[area]} readyMarks={Math.round(ready)} onClose={() => { setFighting(false); setRecords(readBossRecords()) }} onWin={() => setRecords(readBossRecords())} />}
  </main>
}

/** The quest tracker: the one thing to do next, always in reach. */
function Quest({ win, nextHref, bossOpen, bossBeaten, onBoss }: {
  win: TopicScore | null
  nextHref?: string
  bossOpen: boolean
  bossBeaten: boolean
  onBoss: () => void
}) {
  if (bossOpen && !bossBeaten) {
    return <button type="button" className="ew-quest ew-quest--boss" onClick={onBoss}>
      <span className="ew-quest__icon ew-quest__icon--boss" aria-hidden="true"><BossCharacter mood="idle" damage={0} size={46} /></span>
      <span className="ew-quest__text"><span className="ew-quest__kicker">Boss unlocked</span><span className="ew-quest__title">Face the Treasurer</span></span>
      <span className="ew-quest__go">Fight <ArrowIcon size={16} /></span>
    </button>
  }
  if (!win) return null
  const started = win.share > 0
  return <a className="ew-quest" href={nextHref ?? '/preview'}>
    <span className={`ew-quest__icon ew-quest__icon--${nodeKind(win.marks)}`}><TopicIcon id={win.topic.id} size={22} /></span>
    <span className="ew-quest__text">
      <span className="ew-quest__kicker">{started ? 'Keep going' : 'Next quest'} · +{whole(win.marks - win.ready)} <StarIcon size={10} /></span>
      <span className="ew-quest__title">{win.topic.title}</span>
    </span>
    <span className="ew-quest__go">Train <ArrowIcon size={16} /></span>
  </a>
}

function TopicPanel({ score, state, byKey, next }: { score: TopicScore; state: NodeState; byKey: Map<string, StatementRow>; next?: StatementRow }) {
  const { topic } = score
  const kind = nodeKind(score.marks)
  const statements = topic.statements.map(key => byKey.get(key)).filter((row): row is StatementRow => Boolean(row))
  const labs = labCatalog.filter(lab => topic.labs?.includes(lab.id))
  const level = tileLevel(score)
  const cta = !score.taught ? null : level === 'examReady' ? 'Practise again' : score.share > 0 ? 'Keep training' : 'Start training'
  const href = next?.href ?? statements[0]?.href

  return <div className="tp">
    <div className="tp-hero">
      <span className={`tp-badge sn--${state} sn--${kind}`}><TopicIcon id={topic.id} size={30} /></span>
      <div>
        <p className="ew-kicker">{areaTitles[topic.area]}</p>
        <h2>{topic.title}</h2>
      </div>
    </div>
    <ul className="tp-facts">
      <li><StarIcon size={13} /> {whole(score.marks)} mark{whole(score.marks) === 1 ? '' : 's'} a paper</li>
      {topic.sittings && <li>In {topic.sittings} of the last 10 exams</li>}
      {score.taught && <li className={`tp-level tp-level--${level}`}>{levelLabels[level]}</li>}
    </ul>

    {score.taught
      ? <>
        <div className="tp-progress">
          <div className="tp-progress__bar"><span style={{ width: `${score.share * 100}%` }} /></div>
          <p>Ready for about <strong>{Math.round(score.ready * 10) / 10}</strong> of {whole(score.marks)} marks</p>
        </div>
        {cta && href && <a className="ew-cta" href={href}>{cta} <ArrowIcon size={18} /></a>}
        <p className="tp-subhead">Skills · {statements.filter(row => row.level === 'secure' || row.level === 'examReady').length} of {statements.length} secure</p>
        <ul className="tp-skills">
          {statements.map(row => <li key={row.key}>
            <a href={row.href}>
              <span className={`tp-dot tp-dot--${row.level}`} aria-hidden="true" />
              <span className="tp-skill">{row.statement}<small>{levelLabels[row.level]}</small></span>
              <ArrowIcon size={16} className="tp-chevron" />
            </a>
          </li>)}
        </ul>
      </>
      : <div className="tp-soon">
        <LockIcon size={18} />
        <p><strong>Coming to Revily.</strong> {topic.sittings === 10 ? 'It’s in every exam, so it’s high on our list.' : 'It’s on our list.'}</p>
      </div>}

    {labs.length > 0 && <>
      <p className="tp-subhead">Train it in the Lab now</p>
      <ul className="tp-labs">
        {labs.map(lab => <li key={lab.id}><a href={lab.href}><span className="tp-labs__emoji" aria-hidden="true">{lab.emoji}</span><span>{lab.title}<small>{lab.skill}</small></span><ArrowIcon size={16} /></a></li>)}
      </ul>
    </>}
  </div>
}

function BossPanel({ boss, open, beaten, waiting, onFight }: { boss: Boss; open: boolean; beaten: boolean; waiting: TopicScore[]; onFight: () => void }) {
  return <div className="bp">
    <div className={`bp-art${open || beaten ? '' : ' is-locked'}${beaten ? ' is-beaten' : ''}`}><BossCharacter mood="idle" damage={beaten ? 3 : 0} size={150} /></div>
    <p className="ew-kicker ew-kicker--alarm">{areaTitles[boss.area]} boss</p>
    <h2>The Treasurer</h2>
    <p className="bp-story">{boss.story}</p>
    <ul className="tp-facts bp-rules">
      <li>{boss.rounds[0].length} questions</li>
      <li>3 hearts</li>
      <li>New numbers every fight</li>
    </ul>
    {beaten && <p className="bp-beaten"><CrownIcon size={18} /> Beaten. The {areaTitles[boss.area]} branch is mastered.</p>}
    {open
      ? <button type="button" className="ew-cta ew-cta--alarm" onClick={onFight}>{beaten ? 'Rematch' : 'Fight the Treasurer'} <ArrowIcon size={18} /></button>
      : <div className="bp-locked">
        <p><LockIcon size={16} /> Learn every {areaTitles[boss.area]} topic to unlock this fight.</p>
        <ul>{waiting.map(score => <li key={score.topic.id}><TopicIcon id={score.topic.id} size={14} />{score.topic.short ?? score.topic.title}</li>)}</ul>
      </div>}
  </div>
}

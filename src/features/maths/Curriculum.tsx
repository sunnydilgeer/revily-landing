'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { Button } from '../../ui'
import { mathsChapters, mathsLessons, type MathsLessonEntry, type MathsLessonNumber } from './courseRegistry'
import type { LessonProgressMap, LessonProgressSnapshot } from './lessonProgress'
import { mathsLessonMinutes } from './lessonMinutes'
import { rungStatus } from './rungProgress'
import './Curriculum.css'
import './ContentsDrawer.css'

type Props = {
  progress: LessonProgressMap
  lastLesson: MathsLessonNumber
  onOpenLesson: (lesson: MathsLessonNumber, skill?: string) => void
}

const LATER_CHAPTERS = ['Ratio and proportion', 'Geometry and measures', 'Probability', 'Statistics']

/** Rung status for one lesson (done = finished, current = where the student is now). */
export function rungsFor(entry: MathsLessonEntry, snapshot?: LessonProgressSnapshot) {
  return rungStatus(entry.sections, entry.stateCount, snapshot)
}

export type TocStatus = 'done' | 'next' | 'progress' | 'todo'

export const Lock = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-label="Not built yet"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
const Play = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z" fill="currentColor" /></svg>

export type SearchResult = { key: string; title: string; label: string; onPick: () => void }

/** Search across every lesson and skill, the same as in the Contents drawer. With a query, results replace the contents. */
export function CurriculumSearch({ query, onQuery, placeholder, results }: { query: string; onQuery: (value: string) => void; placeholder: string; results: SearchResult[] | null }) {
  return <div className="toc cur-search">
    <div className="toc-search">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
      <input type="search" value={query} onChange={event => onQuery(event.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </div>
    {results && <section className="cur-panel cur-search__results" aria-label="Search results">
      <p className="toc-results-count" role="status">{results.length === 0 ? `Nothing matches “${query.trim()}”` : `${results.length} ${results.length === 1 ? 'match' : 'matches'}`}</p>
      <ul className="toc-results">
        {results.map(result => <li key={result.key}>
          <button type="button" onClick={result.onPick}><strong>{result.title}</strong><span>{result.label}</span></button>
        </li>)}
      </ul>
    </section>}
  </div>
}

/** One chapter in the left-hand contents list. */
export function TocChapter({ code, title, meta, selected, locked, onSelect }: { code: string; title: string; meta: ReactNode; selected: boolean; locked?: boolean; onSelect: () => void }) {
  return <li>
    <button type="button" className={`cur-toc__chapter${locked ? ' is-locked' : ''}`} aria-pressed={selected} aria-controls="cur-panel" onClick={onSelect}>
      <span className="cur-toc__num" aria-hidden="true">{code}</span>
      <span className="cur-toc__title">{title}</span>
      <small>{meta}</small>
    </button>
  </li>
}

/** One lesson on the chapter's line: the next lesson is a highlighted card with its button, every other lesson is a single row. */
export function TocLesson({ status, title, badge, minutes, detail, action, onOpen }: { status: TocStatus; title: string; badge?: ReactNode; minutes: number; detail: string; action: string; onOpen: () => void }) {
  if (status === 'next') return <li className="cur-lesson is-next">
    <span className="cur-lesson__dot" aria-hidden="true" />
    <div className="cur-lesson__body">
      <h3>{title}{badge}</h3>
      <p>{detail}</p>
    </div>
    <Button variant="dark" className="cur-lesson__go" onClick={onOpen} aria-label={`${action} ${title}`}><Play />{action}</Button>
  </li>
  return <li className={`cur-lesson is-${status}`}>
    <button type="button" className="cur-lesson__row" onClick={onOpen} aria-label={`${action} ${title}${status === 'done' ? ' (done)' : status === 'progress' ? ' (in progress)' : ''}`}>
      <span className="cur-lesson__dot" aria-hidden="true">{status === 'done' ? '✓' : ''}</span>
      <span className="cur-lesson__title">{title}{badge}</span>
      <small>{minutes} min</small>
    </button>
  </li>
}

export default function Curriculum({ progress, lastLesson, onOpenLesson }: Props) {
  const lastEntry = mathsLessons.find(entry => entry.number === lastLesson) ?? mathsLessons[0]
  const nextIncomplete = mathsLessons.find(entry => !progress[entry.lessonId]?.completed)
  const upNext = progress[lastEntry.lessonId] && !progress[lastEntry.lessonId].completed ? lastEntry : nextIncomplete ?? lastEntry
  const upNextSnapshot = progress[upNext.lessonId]
  const upNextRungs = rungsFor(upNext, upNextSnapshot)
  // Continue resumes where the student is; with no position yet, suggest the first unfinished rung.
  const currentRung = upNextRungs.findIndex(rung => rung.current)
  const upNextRungIndex = currentRung >= 0 ? currentRung : Math.max(0, upNextRungs.findIndex(rung => !rung.done))
  const doneLessons = mathsLessons.filter(entry => progress[entry.lessonId]?.completed).length
  const chapterCount = mathsChapters.length + LATER_CHAPTERS.length

  // The chapter you're in is open; pick another from the list on the left.
  const [selected, setSelected] = useState<string>(upNext.chapterId)
  const chapterIndex = mathsChapters.findIndex(chapter => chapter.id === selected)
  const chapter = mathsChapters[chapterIndex]
  const laterIndex = LATER_CHAPTERS.indexOf(selected)

  // Search matches lesson titles and skill titles; a skill opens its lesson at that skill.
  const [query, setQuery] = useState('')
  const results = useMemo<SearchResult[] | null>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return mathsChapters.flatMap(item => item.lessons.flatMap(entry => [
      ...(entry.title.toLowerCase().includes(q) ? [{ key: entry.lessonId, title: entry.title, label: `Lesson · ${item.title}`, onPick: () => onOpenLesson(entry.number) }] : []),
      ...entry.sections.filter(section => section.title.toLowerCase().includes(q))
        .map(section => ({ key: `${entry.lessonId}-${section.id}`, title: section.title, label: `Skill · ${entry.title}`, onPick: () => onOpenLesson(entry.number, section.id) })),
    ]))
  }, [onOpenLesson, query])

  return <div className="cur">
    <header className="cur-head">
      <div>
        <h1>Curriculum</h1>
        <p>GCSE Foundation Maths · {chapterCount} chapters · pick up at the highlighted lesson</p>
      </div>
      <div className="cur-overall" aria-label={`${doneLessons} of ${mathsLessons.length} lessons complete`}>
        <div className="cur-overall__bar" aria-hidden="true"><span style={{ width: `${doneLessons / mathsLessons.length * 100}%` }} /></div>
        <span>{doneLessons} / {mathsLessons.length} lessons</span>
      </div>
    </header>

    <CurriculumSearch query={query} onQuery={setQuery} placeholder="Search lessons and skills" results={results} />

    {!results && <div className="cur-toc">
      <nav className="cur-toc__chapters" aria-label="Chapters">
        <ol>
          {mathsChapters.map((item, index) => <TocChapter key={item.id} code={String(index + 1)} title={item.title}
            meta={`${item.lessons.filter(entry => progress[entry.lessonId]?.completed).length} / ${item.lessons.length}`}
            selected={item.id === selected} onSelect={() => setSelected(item.id)} />)}
          {LATER_CHAPTERS.map((title, index) => <TocChapter key={title} code={String(mathsChapters.length + index + 1)} title={title}
            meta={<Lock />} locked selected={title === selected} onSelect={() => setSelected(title)} />)}
        </ol>
      </nav>

      <section className="cur-panel" id="cur-panel" aria-labelledby="cur-panel-title">
        {chapter ? <>
          <header className="cur-panel__head">
            <h2 id="cur-panel-title">Chapter {chapterIndex + 1} · {chapter.title}</h2>
            <span>{chapter.lessons.length} {chapter.lessons.length === 1 ? 'lesson' : 'lessons'}</span>
          </header>
          <ol className="cur-path">
            {chapter.lessons.map(entry => {
              const snapshot = progress[entry.lessonId]
              const status: TocStatus = snapshot?.completed ? 'done' : entry.lessonId === upNext.lessonId ? 'next' : snapshot ? 'progress' : 'todo'
              const minutes = mathsLessonMinutes(entry.definition)
              const detail = upNextSnapshot
                ? `Up next · section ${upNextRungIndex + 1} of ${upNextRungs.length} · ${upNextRungs[upNextRungIndex]?.title}`
                : `Start here · ${upNextRungs.length} sections · ${minutes} min`
              return <TocLesson key={entry.lessonId} status={status} title={entry.title} minutes={minutes} detail={detail}
                action={status === 'done' ? 'Review' : snapshot ? 'Continue' : 'Start'} onOpen={() => onOpenLesson(entry.number)} />
            })}
          </ol>
        </> : <div className="cur-panel__later">
          <h2 id="cur-panel-title">Chapter {mathsChapters.length + laterIndex + 1} · {selected}</h2>
          <p><Lock /> Coming later. This chapter isn’t built yet, so keep climbing in {mathsChapters.find(item => item.id === upNext.chapterId)?.title}.</p>
          <Button variant="secondary" onClick={() => setSelected(upNext.chapterId)}>Back to where I’m up to</Button>
        </div>}
      </section>

    </div>}
  </div>
}

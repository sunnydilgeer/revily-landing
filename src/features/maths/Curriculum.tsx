'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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

const LATER_CHAPTERS = ['Ratio and proportion', 'Probability', 'Statistics']

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
export type TocSection = { id: string; title: string; badge?: ReactNode }

const Chevron = () => <svg className="cur-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>

/**
 * One lesson on the chapter's line. Tapping a lesson folds its sections open, the same as in Contents; a section
 * opens the lesson at that point. The next lesson is a highlighted card with its Start button and its sections open.
 */
export function TocLesson({ id, status, title, badge, minutes, detail, action, sections, currentSectionId, onOpen, onOpenSection }: {
  id: string; status: TocStatus; title: string; badge?: ReactNode; minutes: number; detail: string; action: string
  sections: TocSection[]; currentSectionId?: string; onOpen: () => void; onOpenSection: (sectionId: string) => void
}) {
  const [open, setOpen] = useState(status === 'next')
  const listId = `cur-sections-${id}`
  const list = open && <ol className="cur-sections" id={listId} aria-label={`${title} sections`}>
    {sections.map(section => <li key={section.id}>
      <button type="button" aria-current={section.id === currentSectionId ? 'step' : undefined} onClick={() => onOpenSection(section.id)}>
        <span className="cur-section__dot" aria-hidden="true" />{section.title}{section.badge}
      </button>
    </li>)}
  </ol>
  if (status === 'next') return <li className="cur-lesson is-next" data-lesson={id}>
    <div className="cur-lesson__card">
      <span className="cur-lesson__dot" aria-hidden="true" />
      <div className="cur-lesson__body">
        <h3>{title}{badge}</h3>
        <p>{detail}</p>
      </div>
      <Button variant="dark" className="cur-lesson__go" onClick={onOpen} aria-label={`${action} ${title}`}><Play />{action}</Button>
      <button type="button" className="cur-lesson__fold" aria-expanded={open} aria-controls={listId}
        aria-label={`${open ? 'Hide' : 'Show'} sections in ${title}`} onClick={() => setOpen(!open)}><Chevron /></button>
    </div>
    {list}
  </li>
  return <li className={`cur-lesson is-${status}`} data-lesson={id}>
    <button type="button" className="cur-lesson__row" aria-expanded={open} aria-controls={listId} onClick={() => setOpen(!open)}>
      <span className="cur-lesson__dot" aria-hidden="true">{status === 'done' ? '✓' : ''}</span>
      <span className="cur-lesson__title">{title}{badge}{status === 'done' && <span className="cur-sr"> (done)</span>}{status === 'progress' && <span className="cur-sr"> (in progress)</span>}</span>
      <small>{minutes} min</small>
      <Chevron />
    </button>
    {list}
  </li>
}

/** True on phone-width screens, where the contents is one long list instead of two columns. */
export function useIsPhone() {
  const [phone, setPhone] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 799px)')
    const update = () => setPhone(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return phone
}

export type AccordionChapter = { id: string; code: string; title: string; lessonIds: string[]; lessons?: ReactNode; locked?: boolean }

/**
 * Phones: every chapter in one card, each folding open and closed (and each lesson inside folds too). The chapter
 * holding the last lesson you viewed starts open, and the page scrolls to that lesson once.
 */
export function ChapterAccordion({ chapters, focusLessonId, label }: { chapters: AccordionChapter[]; focusLessonId?: string; label: string }) {
  const [folds, setFolds] = useState<Record<string, boolean>>({})
  const focusChapter = chapters.find(chapter => focusLessonId && chapter.lessonIds.includes(focusLessonId))?.id
  const isOpen = (id: string) => folds[id] ?? id === focusChapter
  const scrolledTo = useRef<string | null>(null)
  useEffect(() => {
    if (!focusLessonId || scrolledTo.current === focusLessonId) return
    const row = document.querySelector(`.cur-acc [data-lesson="${CSS.escape(focusLessonId)}"]`)
    if (!row) return
    scrolledTo.current = focusLessonId
    window.requestAnimationFrame(() => row.scrollIntoView({ block: 'center' }))
  })
  return <div className="cur-acc" role="list" aria-label={label}>
    {chapters.map(chapter => {
      const open = isOpen(chapter.id)
      const bodyId = `cur-acc-${chapter.id}`
      return <section className={`cur-acc__chapter${chapter.locked ? ' is-locked' : ''}`} key={chapter.id} role="listitem">
        <h2>
          <button type="button" className="cur-acc__head" aria-expanded={open} aria-controls={bodyId} onClick={() => setFolds(current => ({ ...current, [chapter.id]: !open }))}>
            <span className="cur-toc__num" aria-hidden="true">{chapter.code}</span>
            <span className="cur-acc__title">{chapter.title}</span>
            <small>{chapter.locked ? <Lock /> : `${chapter.lessonIds.length} ${chapter.lessonIds.length === 1 ? 'lesson' : 'lessons'}`}</small>
            <Chevron />
          </button>
        </h2>
        {open && <div className="cur-acc__body" id={bodyId}>
          {chapter.locked ? <p className="cur-acc__later"><Lock /> Coming later. This chapter isn’t built yet.</p> : <ol className="cur-path">{chapter.lessons}</ol>}
        </div>}
      </section>
    })}
  </div>
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

  const phone = useIsPhone()
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

  const renderLesson = (entry: MathsLessonEntry) => {
    const snapshot = progress[entry.lessonId]
    const status: TocStatus = snapshot?.completed ? 'done' : entry.lessonId === upNext.lessonId ? 'next' : snapshot ? 'progress' : 'todo'
    const minutes = mathsLessonMinutes(entry.definition)
    const detail = upNextSnapshot
      ? `Up next · section ${upNextRungIndex + 1} of ${upNextRungs.length} · ${upNextRungs[upNextRungIndex]?.title}`
      : `Start here · ${upNextRungs.length} sections · ${minutes} min`
    return <TocLesson key={entry.lessonId} id={entry.lessonId} status={status} title={entry.title} minutes={minutes} detail={detail}
      action={status === 'done' ? 'Review' : snapshot ? 'Continue' : 'Start'} onOpen={() => onOpenLesson(entry.number)}
      sections={entry.sections} currentSectionId={status === 'next' ? snapshot?.currentSectionId : undefined}
      onOpenSection={sectionId => onOpenLesson(entry.number, sectionId)} />
  }

  // Phones: no header, just search and every chapter in one list, opened at the last lesson you viewed.
  if (phone) return <div className="cur cur--phone">
    <CurriculumSearch query={query} onQuery={setQuery} placeholder="Search lessons and skills" results={results} />
    {!results && <ChapterAccordion label="Chapters" focusLessonId={lastEntry.lessonId} chapters={[
      ...mathsChapters.map((item, index) => ({ id: item.id, code: String(index + 1), title: item.title, lessonIds: item.lessons.map(entry => entry.lessonId), lessons: item.lessons.map(renderLesson) })),
      ...LATER_CHAPTERS.map((title, index) => ({ id: `later-${index}`, code: String(mathsChapters.length + index + 1), title, lessonIds: [], locked: true })),
    ]} />}
  </div>

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
            {chapter.lessons.map(renderLesson)}
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

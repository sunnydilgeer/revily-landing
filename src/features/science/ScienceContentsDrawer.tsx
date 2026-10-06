'use client'

/*
 * Science lesson Contents: the same open book as Maths. Every subject, unit, lesson and section is one or two
 * taps away, nothing locked and no progress tracking. Units fold, tapping a lesson folds its sections open, and search covers
 * every subject. Then the details that used to sit under each screen (sources, restart, draft status).
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { scienceChaptersFor, scienceEntryHref, scienceLessonHref, scienceLessonLabel, scienceLessonNumberById, scienceSubjects, scienceSubjectTitle, TRANSPORT_EXAM_LESSON_ID, type ScienceCatalogueEntry, type ScienceSubject } from './lessonNavigation'
import type { PreviewSession } from './previewSession'
import { sectionStatus } from './scienceProgress'
import { chapterLessonsForTier, forTier, getScienceLessonForTier, type ScienceTier } from './tier'
import '../maths/ContentsDrawer.css'
import { scrollContentsToCurrent } from '../maths/MathsContentsDrawer'
import { HigherBadge } from './higher/HigherBadge'

type Props = {
  open: boolean
  subject: ScienceSubject
  lessonNumber: number
  tier: ScienceTier
  chapterTitle: string
  session: PreviewSession
  storageAvailable: boolean
  onClose: () => void
  onJump: (stateId: string) => void
  onRestart: (clearPracticeHistory: boolean) => void
}

// Four lessons follow one story: how the body gets food and oxygen to its cells (keyed by lesson id).
const TRANSPORT_STORY = [
  { lessonId: 'B-ORG-009-B', title: 'Nutrients enter blood', route: 'Food becomes soluble molecules' },
  { lessonId: 'B-ORG-010-B', title: 'Oxygen enters blood', route: 'Air reaches the alveoli' },
  { lessonId: 'B-ORG-011-B', title: 'The heart pumps blood', route: 'Blood completes two linked circuits' },
  { lessonId: 'B-ORG-012-B', title: 'Vessels deliver and exchange', route: 'Blood reaches body cells and returns' },
] as const

const FOLDS_KEY = 'revily:science-contents-folds:v1'
const readFolds = (): Record<string, boolean> => { try { return JSON.parse(window.localStorage.getItem(FOLDS_KEY) ?? '{}') } catch { return {} } }
const stripChapter = (title: string) => title.replace(/^Chapter \d+ · /, '')
const shownSubjects = scienceSubjects.filter(item => item.lessons.length > 0)

const Chevron = () => <svg className="toc-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'

export default function ScienceContentsDrawer({ open, subject, lessonNumber, tier, chapterTitle, session, storageAvailable, onClose, onJump, onRestart }: Props) {
  const drawerRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [clearHistory, setClearHistory] = useState(false)
  const [query, setQuery] = useState('')
  const [listSubject, setListSubject] = useState<ScienceSubject>(subject)
  const [folds, setFolds] = useState<Record<string, boolean>>({})
  // Sections start open for the lesson you're in and closed for the rest.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!open) { setConfirmRestart(false); setClearHistory(false); return }
    setQuery('')
    setListSubject(subject)
    // The unit you're in always opens, so the lesson you're on is there to scroll to.
    const unitCode = scienceChaptersFor(subject).find(chapter => chapterLessonsForTier(chapter, tier).some(item => item.number === lessonNumber))?.code
    setFolds(unitCode ? { ...readFolds(), [unitCode]: true } : readFolds())
    setOpenSections({})
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const stopScroll = scrollContentsToCurrent(drawerRef.current)
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab' || !drawerRef.current) return
      const focusable = [...drawerRef.current.querySelectorAll<HTMLElement>(focusableSelector)].filter(element => element.getClientRects().length > 0)
      if (focusable.length === 0) return
      const first = focusable[0], last = focusable.at(-1)!
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      stopScroll()
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [lessonNumber, onClose, open, subject, tier])

  // Search matches lesson and section titles in every subject.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return shownSubjects.flatMap(item => item.chapters.flatMap(chapter => chapterLessonsForTier(chapter, tier).flatMap(raw => {
      const lessonEntry = forTier(raw, tier)
      return [
        ...(lessonEntry.title.toLowerCase().includes(q) ? [{ entry: lessonEntry, label: `Lesson · ${chapter.code} ${chapter.title}`, title: lessonEntry.title, href: scienceEntryHref(lessonEntry) }] : []),
        ...sectionStatus(lessonEntry.lesson, lessonEntry.sections, null).filter(section => stripChapter(section.title).toLowerCase().includes(q))
          .map(section => ({ entry: lessonEntry, label: `Section · ${lessonEntry.title}`, title: stripChapter(section.title), href: scienceEntryHref(lessonEntry, section.id) })),
      ]
    })))
  }, [query, tier])

  if (!open) return null
  const entry = forTier(getScienceLessonForTier(subject, lessonNumber, tier)!, tier)
  const lesson = entry.lesson
  const sections = sectionStatus(lesson, entry.sections, session)
  const currentSection = sections.find(section => section.current) ?? sections[0]
  const isCurrentLesson = (item: ScienceCatalogueEntry) => item.subject === subject && item.number === lessonNumber
  const currentUnit = scienceChaptersFor(subject).find(chapter => chapterLessonsForTier(chapter, tier).some(isCurrentLesson))?.code
  // The unit you're in starts open; in another subject, its first unit does.
  const firstUnit = scienceChaptersFor(listSubject).find(chapter => chapterLessonsForTier(chapter, tier).length > 0)?.code
  const unitOpen = (code: string) => folds[code] ?? (listSubject === subject ? code === currentUnit : code === firstUnit)
  const toggleUnit = (code: string) => {
    const next = { ...folds, [code]: !unitOpen(code) }
    setFolds(next)
    try { window.localStorage.setItem(FOLDS_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
  }

  return <div className="maths-drawer-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <aside className="maths-contents-drawer toc" id="science-contents" ref={drawerRef} role="dialog" aria-modal="true" aria-labelledby="science-contents-title">
      <header className="toc-head">
        <div>
          <p>AQA Combined Science · {tier === 'higher' ? 'Higher' : 'Foundation'}</p>
          <h2 id="science-contents-title">Science</h2>
        </div>
        <button ref={closeButtonRef} className="toc-close" type="button" onClick={onClose} aria-label="Close contents">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </header>

      <div className="toc-search">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search lessons and sections" aria-label="Search lessons and sections" />
      </div>

      <div className="toc-body">
        {results ? <section aria-label="Search results">
          <p className="toc-results-count" role="status">{results.length === 0 ? `Nothing matches “${query.trim()}”` : `${results.length} ${results.length === 1 ? 'match' : 'matches'}`}</p>
          <ul className="toc-results">
            {results.map(result => <li key={result.href}>
              <a href={result.href}><strong>{result.title}</strong><span>{scienceSubjectTitle(result.entry.subject)} · {result.label}</span></a>
            </li>)}
          </ul>
        </section> : <>
          <button type="button" className="toc-here" onClick={onClose}>
            <span className="toc-here__kicker">You’re here</span>
            <strong>{entry.title}</strong>
            {currentSection && <span className="toc-here__skill">{stripChapter(currentSection.title)}</span>}
            <span className="toc-here__meta">Back to lesson →</span>
          </button>

          <div className="toc-subjects" role="group" aria-label="Subject">
            {shownSubjects.map(item => <button key={item.subject} type="button" aria-pressed={item.subject === listSubject} onClick={() => setListSubject(item.subject)}>
              {item.subject === 'skills' ? 'Skills' : item.title}
            </button>)}
          </div>

          {scienceChaptersFor(listSubject).map(chapter => {
            const lessons = chapterLessonsForTier(chapter, tier)
            if (lessons.length === 0) return null
            const open = unitOpen(chapter.code)
            return <section className="toc-chapter" key={chapter.code}>
              <h3>
                <button type="button" className="toc-chapter__head" aria-expanded={open} aria-controls={`toc-unit-${chapter.code}`} onClick={() => toggleUnit(chapter.code)}>
                  <span className="toc-chapter__copy">
                    <span className="toc-chapter__eyebrow toc-chapter__eyebrow--code">Unit {chapter.code}</span>
                    <span className="toc-chapter__title">{chapter.title}</span>
                    <span className="toc-chapter__meta">{lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}</span>
                  </span>
                  <Chevron />
                </button>
              </h3>
              {open && <ol className="toc-lessons" id={`toc-unit-${chapter.code}`}>
                {lessons.map(raw => {
                  const item = forTier(raw, tier)
                  const isCurrent = isCurrentLesson(item)
                  const sectionsOpen = openSections[item.lesson.id] ?? isCurrent
                  const itemSections = isCurrent ? sections : sectionStatus(item.lesson, item.sections, null)
                  return <li className={`toc-lesson${isCurrent ? ' is-current' : ''}`} key={item.lesson.id}>
                    <button type="button" className="toc-lesson__open" aria-current={isCurrent ? 'page' : undefined}
                      aria-expanded={sectionsOpen} aria-controls={`toc-sections-${item.lesson.id}`}
                      onClick={() => setOpenSections(current => ({ ...current, [item.lesson.id]: !sectionsOpen }))}>
                      <span className="toc-lesson__num" aria-hidden="true">{scienceLessonLabel(item)}</span>
                      <span className="toc-lesson__title">{item.title}{item.higherOnly && <HigherBadge />}</span>
                      <Chevron />
                    </button>
                    {sectionsOpen && <ol className="toc-skills" id={`toc-sections-${item.lesson.id}`} aria-label={`${item.title} sections`}>
                      {itemSections.map(section => <li key={section.id}>
                        {isCurrent
                          ? <button type="button" aria-current={section.current ? 'step' : undefined} onClick={() => onJump(section.id)}>
                            <span className="toc-skill__dot" aria-hidden="true" />{stripChapter(section.title)}{section.higher && <HigherBadge />}
                          </button>
                          : <a href={scienceEntryHref(item, section.id)}>
                            <span className="toc-skill__dot" aria-hidden="true" />{stripChapter(section.title)}{section.higher && <HigherBadge />}
                          </a>}
                      </li>)}
                    </ol>}
                  </li>
                })}
              </ol>}
            </section>
          })}
        </>}

        {TRANSPORT_STORY.some(step => step.lessonId === entry.lesson.id) && <section className="sl-drawer-story" aria-labelledby="transport-story-title">
          <h3 id="transport-story-title">How the transport lessons connect</h3>
          <ol>{TRANSPORT_STORY.map(step => {
            const number = scienceLessonNumberById(step.lessonId)!
            return <li key={step.lessonId} className={step.lessonId === entry.lesson.id ? 'is-current' : ''}>
              <a href={scienceLessonHref(number)}><strong>{number} · {step.title}</strong></a><span>{step.route}</span>
            </li>
          })}</ol>
        </section>}

        <details className="maths-lesson-options">
          <summary>Lesson information and options</summary>
          <div>
            <p><strong>Course</strong><span>AQA Combined Science Trilogy · {tier === 'higher' ? 'Higher' : 'Foundation'}</span></p>
            <p><strong>Unit</strong><span>{chapterTitle}</span></p>
            <p><strong>Status</strong><span>Draft, awaiting review by a qualified teacher</span></p>
            <p><strong>Progress</strong><span>{storageAvailable ? 'Saved on this device' : 'Not saved: this browser is blocking storage'}</span></p>
          </div>
          <div className="sl-drawer-extra">
            <h4>Sources</h4>
            <ul>{lesson.sources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> <span>{source.locator}</span></li>)}</ul>
            {entry.lesson.id.startsWith('B-CELL-') && <p><a href="/preview/science/coverage">Curriculum and exam map</a>{entry.lesson.id === TRANSPORT_EXAM_LESSON_ID && <> · <a href="/preview/science/exam">Transport exam practice</a></>}</p>}
            {!confirmRestart
              ? <button type="button" className="sl-drawer-restart" onClick={() => setConfirmRestart(true)}>Restart this lesson</button>
              : <div className="sl-drawer-confirm" role="group" aria-label="Restart this lesson">
                <p>Start this lesson again? Answers you’ve already seen will count as practice.</p>
                <label><input type="checkbox" checked={clearHistory} onChange={event => setClearHistory(event.target.checked)} /> Also clear this lesson’s practice history</label>
                <div>
                  <button type="button" className="sl-drawer-restart" onClick={() => { setConfirmRestart(false); setClearHistory(false) }}>Keep my progress</button>
                  <button type="button" className="sl-drawer-restart sl-drawer-restart--go" onClick={() => onRestart(clearHistory)}>Restart</button>
                </div>
              </div>}
          </div>
        </details>
      </div>
    </aside>
  </div>
}

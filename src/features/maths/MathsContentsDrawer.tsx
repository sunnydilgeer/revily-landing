import { useEffect, useMemo, useRef, useState } from 'react'
import { mathsChapters, type MathsChapter, type MathsLessonEntry, type MathsLessonNumber, type MathsSection } from './courseRegistry'
import type { LessonProgressMap } from './lessonProgress'
import './ContentsDrawer.css'

/*
 * Contents: an open book. Every lesson and every skill is one or two taps away, nothing locked and no progress
 * tracking. Chapters fold, and tapping a lesson folds its skills open (a skill opens the lesson), and search jumps straight to a lesson or skill. Open/closed
 * chapters are remembered. Progress is only read to know which skill you're on.
 */
type Props<N extends number, C extends string> = {
  open: boolean
  currentLesson: MathsLessonEntry<N, C>
  progress: LessonProgressMap
  onClose: () => void
  onSelectLesson: (lesson: N) => void
  onSelectSkill: (lesson: N, section: MathsSection) => void
  /** The chapters to list: the course's own unless a page passes its own shelf. */
  chapters?: MathsChapter<N, C>[]
}

/**
 * When Contents opens, scroll its list to the lesson you're on: the lesson row sits about a quarter of the way down,
 * so its sections show underneath. Waits two frames for the open chapter to render. Returns a cancel function.
 */
export function scrollContentsToCurrent(drawer: HTMLElement | null) {
  let frame = window.requestAnimationFrame(() => {
    frame = window.requestAnimationFrame(() => {
      const list = drawer?.querySelector<HTMLElement>('.toc-body')
      const row = drawer?.querySelector<HTMLElement>('.toc-lesson.is-current')
      if (!list || !row) return
      const offset = row.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop
      list.scrollTop = Math.max(0, offset - list.clientHeight * 0.25)
    })
  })
  return () => window.cancelAnimationFrame(frame)
}

const focusableSelector = 'a[href], button:not([disabled]), input, summary, [tabindex]:not([tabindex="-1"])'
const FOLDS_KEY = 'revily:maths-contents-folds:v1'

function readFolds(): Record<string, boolean> {
  try { return JSON.parse(window.localStorage.getItem(FOLDS_KEY) ?? '{}') } catch { return {} }
}

const Chevron = () => <svg className="toc-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>

export default function MathsContentsDrawer<N extends number = MathsLessonNumber, C extends string = string>({ open, currentLesson, progress, onClose, onSelectLesson, onSelectSkill, chapters = mathsChapters as unknown as MathsChapter<N, C>[] }: Props<N, C>) {
  const drawerRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [query, setQuery] = useState('')
  const [folds, setFolds] = useState<Record<string, boolean>>({})
  // Skills start open for the lesson you're in and closed for the rest.
  const [openSkills, setOpenSkills] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!open) return
    // The chapter you're in always opens, so the lesson you're on is there to scroll to.
    setFolds({ ...readFolds(), [currentLesson.chapterId]: true })
    setOpenSkills({ [currentLesson.lessonId]: true })
    setQuery('')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const stopScroll = scrollContentsToCurrent(drawerRef.current)

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !drawerRef.current) return
      const focusable = [...drawerRef.current.querySelectorAll<HTMLElement>(focusableSelector)]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable.at(-1)!
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      stopScroll()
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentLesson.lessonId, onClose, open])

  // Search matches lesson titles and skill titles.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return chapters.flatMap(chapter => chapter.lessons.flatMap(entry => [
      ...(entry.title.toLowerCase().includes(q) ? [{ entry, chapter: chapter.title, section: undefined }] : []),
      ...entry.sections.filter(section => section.title.toLowerCase().includes(q)).map(section => ({ entry, chapter: chapter.title, section })),
    ]))
  }, [chapters, query])

  if (!open) return null
  const currentSnapshot = progress[currentLesson.lessonId]
  const currentSkill = currentLesson.sections.find(section => section.id === currentSnapshot?.currentSectionId) ?? currentLesson.sections[0]
  const isChapterOpen = (id: string) => folds[id] ?? id === currentLesson.chapterId
  const toggleChapter = (id: string) => {
    const next = { ...folds, [id]: !isChapterOpen(id) }
    setFolds(next)
    try { window.localStorage.setItem(FOLDS_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
  }
  const pickSkill = (entry: MathsLessonEntry<N, C>, section: MathsSection) => {
    onSelectSkill(entry.number, section)
    onClose()
  }
  const pickLesson = (entry: MathsLessonEntry<N, C>) => entry.lessonId === currentLesson.lessonId ? onClose() : onSelectLesson(entry.number)

  return <div className="maths-drawer-backdrop" onMouseDown={event => {
    if (event.target === event.currentTarget) onClose()
  }}>
    <aside className="maths-contents-drawer toc" id="maths-contents" ref={drawerRef} role="dialog" aria-modal="true" aria-labelledby="maths-contents-title">
      <header className="toc-head">
        <div>
          <p>GCSE Foundation</p>
          <h2 id="maths-contents-title">Maths</h2>
        </div>
        <button ref={closeButtonRef} className="toc-close" type="button" onClick={onClose} aria-label="Close contents">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </header>

      <div className="toc-search">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search lessons and skills" aria-label="Search lessons and skills" />
      </div>

      <div className="toc-body">
        {results ? <section aria-label="Search results">
          <p className="toc-results-count" role="status">{results.length === 0 ? `Nothing matches “${query.trim()}”` : `${results.length} ${results.length === 1 ? 'match' : 'matches'}`}</p>
          <ul className="toc-results">
            {results.map(({ entry, chapter, section }) => <li key={`${entry.lessonId}-${section?.id ?? 'lesson'}`}>
              <button type="button" onClick={() => section ? pickSkill(entry, section) : pickLesson(entry)}>
                <strong>{section ? section.title : entry.title}</strong>
                <span>{section ? `Skill · ${entry.title}` : `Lesson · ${chapter}`}</span>
              </button>
            </li>)}
          </ul>
        </section> : <>
          <button type="button" className="toc-here" onClick={onClose}>
            <span className="toc-here__kicker">You’re here</span>
            <strong>{currentLesson.title}</strong>
            <span className="toc-here__skill">{currentSkill?.title}</span>
            <span className="toc-here__meta">Back to lesson →</span>
          </button>

          {chapters.map((chapter, index) => {
            const chapterOpen = isChapterOpen(chapter.id)
            return <section className="toc-chapter" key={chapter.id}>
              <h3>
                <button type="button" className="toc-chapter__head" aria-expanded={chapterOpen} aria-controls={`toc-chapter-${chapter.id}`} onClick={() => toggleChapter(chapter.id)}>
                  <span className="toc-chapter__copy">
                    <span className="toc-chapter__eyebrow">Chapter {index + 1}</span>
                    <span className="toc-chapter__title">{chapter.title}</span>
                    <span className="toc-chapter__meta">{chapter.lessons.length} lessons</span>
                  </span>
                  <Chevron />
                </button>
              </h3>
              {chapterOpen && <ol className="toc-lessons" id={`toc-chapter-${chapter.id}`}>
                {chapter.lessons.map(entry => {
                  const isCurrent = entry.lessonId === currentLesson.lessonId
                  const skillsOpen = openSkills[entry.lessonId] ?? false
                  return <li className={`toc-lesson${isCurrent ? ' is-current' : ''}`} key={entry.lessonId}>
                    <button type="button" className="toc-lesson__open" aria-current={isCurrent ? 'page' : undefined}
                      aria-expanded={skillsOpen} aria-controls={`toc-skills-${entry.lessonId}`}
                      onClick={() => setOpenSkills(current => ({ ...current, [entry.lessonId]: !skillsOpen }))}>
                      <span className="toc-lesson__num" aria-hidden="true">{entry.position}</span>
                      <span className="toc-lesson__title">{entry.title}</span>
                      <Chevron />
                    </button>
                    {skillsOpen && <ol className="toc-skills" id={`toc-skills-${entry.lessonId}`} aria-label={`${entry.title} skills`}>
                      {entry.sections.map(section => {
                        const isCurrentSection = isCurrent && currentSnapshot?.currentSectionId === section.id
                        return <li key={section.id}>
                          <button type="button" aria-current={isCurrentSection ? 'step' : undefined} onClick={() => pickSkill(entry, section)}>
                            <span className="toc-skill__dot" aria-hidden="true" />
                            {section.title}
                          </button>
                        </li>
                      })}
                    </ol>}
                  </li>
                })}
              </ol>}
            </section>
          })}
        </>}
      </div>
    </aside>
  </div>
}

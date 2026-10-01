import { useEffect, useMemo, useRef, useState } from 'react'
import { mathsChapters, type MathsLessonEntry, type MathsLessonNumber, type MathsSection } from './courseRegistry'
import { lessonPercent, type LessonProgressMap, type LessonProgressSnapshot } from './lessonProgress'
import './ContentsDrawer.css'

/*
 * Contents: every lesson and every skill is one or two taps away, nothing locked. Chapters fold, each
 * lesson's skills fold, and search jumps straight to a lesson or skill. Open/closed chapters are remembered.
 */
type Props = {
  open: boolean
  currentLesson: MathsLessonEntry
  progress: LessonProgressMap
  onClose: () => void
  onSelectLesson: (lesson: MathsLessonNumber) => void
  onSelectSkill: (lesson: MathsLessonNumber, section: MathsSection) => void
}

const focusableSelector = 'a[href], button:not([disabled]), input, summary, [tabindex]:not([tabindex="-1"])'
const FOLDS_KEY = 'revily:maths-contents-folds:v1'

function readFolds(): Record<string, boolean> {
  try { return JSON.parse(window.localStorage.getItem(FOLDS_KEY) ?? '{}') } catch { return {} }
}

const skillDone = (snapshot: LessonProgressSnapshot | undefined, section: MathsSection) =>
  Boolean(snapshot?.completed || snapshot?.completedSections?.includes(section.id))

/** A small progress ring: empty, part-filled, or a tick when done. */
function Ring({ percent, size = 26 }: { percent: number; size?: number }) {
  if (percent >= 100) return <span className="toc-ring is-done" style={{ width: size, height: size }} aria-hidden="true">
    <svg viewBox="0 0 24 24" width={size * .55} height={size * .55} fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
  </span>
  const r = 10, c = 2 * Math.PI * r
  return <svg className="toc-ring" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r={r} className="toc-ring__track" />
    {percent > 0 && <circle cx="12" cy="12" r={r} className="toc-ring__fill" strokeDasharray={`${c * percent / 100} ${c}`} transform="rotate(-90 12 12)" />}
  </svg>
}

const Chevron = () => <svg className="toc-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>

export default function MathsContentsDrawer({ open, currentLesson, progress, onClose, onSelectLesson, onSelectSkill }: Props) {
  const drawerRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [query, setQuery] = useState('')
  const [folds, setFolds] = useState<Record<string, boolean>>({})
  // Skills start open for the lesson you're in and closed for the rest.
  const [openSkills, setOpenSkills] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!open) return
    setFolds(readFolds())
    setOpenSkills({ [currentLesson.lessonId]: true })
    setQuery('')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

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
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentLesson.lessonId, onClose, open])

  // Search matches lesson titles and skill titles.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return mathsChapters.flatMap(chapter => chapter.lessons.flatMap(entry => [
      ...(entry.title.toLowerCase().includes(q) ? [{ entry, chapter: chapter.title, section: undefined }] : []),
      ...entry.sections.filter(section => section.title.toLowerCase().includes(q)).map(section => ({ entry, chapter: chapter.title, section })),
    ]))
  }, [query])

  if (!open) return null
  const currentSnapshot = progress[currentLesson.lessonId]
  const currentSkill = currentLesson.sections.find(section => section.id === currentSnapshot?.currentSectionId) ?? currentLesson.sections[0]
  const isChapterOpen = (id: string) => folds[id] ?? id === currentLesson.chapterId
  const toggleChapter = (id: string) => {
    const next = { ...folds, [id]: !isChapterOpen(id) }
    setFolds(next)
    try { window.localStorage.setItem(FOLDS_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
  }
  const pickSkill = (entry: MathsLessonEntry, section: MathsSection) => {
    onSelectSkill(entry.number, section)
    onClose()
  }
  const pickLesson = (entry: MathsLessonEntry) => entry.lessonId === currentLesson.lessonId ? onClose() : onSelectLesson(entry.number)

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
            <span className="toc-here__bar" aria-hidden="true"><span style={{ width: `${lessonPercent(currentSnapshot)}%` }} /></span>
            <span className="toc-here__meta">{lessonPercent(currentSnapshot)}% · Back to lesson</span>
          </button>

          {mathsChapters.map((chapter, index) => {
            const doneLessons = chapter.lessons.filter(entry => progress[entry.lessonId]?.completed).length
            const chapterOpen = isChapterOpen(chapter.id)
            return <section className="toc-chapter" key={chapter.id}>
              <h3>
                <button type="button" className="toc-chapter__head" aria-expanded={chapterOpen} aria-controls={`toc-chapter-${chapter.id}`} onClick={() => toggleChapter(chapter.id)}>
                  <span className="toc-chapter__copy">
                    <span className="toc-chapter__eyebrow">Chapter {index + 1}</span>
                    <span className="toc-chapter__title">{chapter.title}</span>
                    <span className="toc-chapter__meta">{doneLessons} of {chapter.lessons.length} lessons done</span>
                  </span>
                  <Ring percent={Math.round(doneLessons / chapter.lessons.length * 100)} size={34} />
                  <Chevron />
                </button>
              </h3>
              {chapterOpen && <ol className="toc-lessons" id={`toc-chapter-${chapter.id}`}>
                {chapter.lessons.map(entry => {
                  const snapshot = progress[entry.lessonId]
                  const isCurrent = entry.lessonId === currentLesson.lessonId
                  const skillsOpen = openSkills[entry.lessonId] ?? false
                  const percent = lessonPercent(snapshot)
                  return <li className={`toc-lesson${isCurrent ? ' is-current' : ''}`} key={entry.lessonId}>
                    <div className="toc-lesson__row">
                      <button type="button" className="toc-lesson__open" aria-current={isCurrent ? 'page' : undefined} onClick={() => pickLesson(entry)}>
                        <Ring percent={percent} />
                        <span className="toc-lesson__num" aria-hidden="true">{entry.position}</span>
                        <span className="toc-lesson__title">{entry.title}</span>
                        {percent > 0 && percent < 100 && <small>{percent}%</small>}
                      </button>
                      <button type="button" className="toc-lesson__fold" aria-expanded={skillsOpen} aria-controls={`toc-skills-${entry.lessonId}`}
                        aria-label={`${skillsOpen ? 'Hide' : 'Show'} skills in ${entry.title}`}
                        onClick={() => setOpenSkills(current => ({ ...current, [entry.lessonId]: !skillsOpen }))}>
                        <Chevron />
                      </button>
                    </div>
                    {skillsOpen && <ol className="toc-skills" id={`toc-skills-${entry.lessonId}`} aria-label={`${entry.title} skills`}>
                      {entry.sections.map(section => {
                        const isCurrentSection = isCurrent && currentSnapshot?.currentSectionId === section.id
                        const done = skillDone(snapshot, section)
                        return <li key={section.id}>
                          <button type="button" aria-current={isCurrentSection ? 'step' : undefined} className={done ? 'is-done' : ''} onClick={() => pickSkill(entry, section)}>
                            <span className="toc-skill__dot" aria-hidden="true" />
                            {section.title}
                            {done && <span className="toc-sr"> (done)</span>}
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

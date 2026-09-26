import { useEffect, useRef } from 'react'
import { mathsChapters, type MathsLessonEntry, type MathsLessonNumber } from './courseRegistry'
import { lessonPercent, requestMathsState, type LessonProgressMap } from './lessonProgress'

type Props = {
  open: boolean
  currentLesson: MathsLessonEntry
  progress: LessonProgressMap
  onClose: () => void
  onSelectLesson: (lesson: MathsLessonNumber) => void
  onShowAll: () => void
}

const focusableSelector = 'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'

export default function MathsContentsDrawer({ open, currentLesson, progress, onClose, onSelectLesson, onShowAll }: Props) {
  const drawerRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
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
  }, [onClose, open])

  if (!open) return null
  const currentSnapshot = progress[currentLesson.lessonId]

  return <div className="maths-drawer-backdrop" onMouseDown={event => {
    if (event.target === event.currentTarget) onClose()
  }}>
    <aside
      className="maths-contents-drawer"
      id="maths-contents"
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="maths-contents-title"
    >
      <header className="maths-drawer-header">
        <div>
          <p>GCSE Foundation Maths</p>
          <h2 id="maths-contents-title">Contents</h2>
        </div>
        <button ref={closeButtonRef} className="maths-drawer-close" type="button" onClick={onClose} aria-label="Close contents">×</button>
      </header>

      <div className="maths-drawer-body">
        {mathsChapters.map(chapter => <section className="maths-drawer-chapter" key={chapter.id} aria-labelledby={`drawer-chapter-${chapter.id}`}>
          <h3 id={`drawer-chapter-${chapter.id}`}>{chapter.title}</h3>
          <ol>
            {chapter.lessons.map(entry => {
              const isCurrent = entry.lessonId === currentLesson.lessonId
              const snapshot = progress[entry.lessonId]
              return <li className={isCurrent ? 'is-current' : ''} key={entry.lessonId}>
                <button
                  className="maths-drawer-lesson"
                  type="button"
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={() => isCurrent ? undefined : onSelectLesson(entry.number)}
                >
                  <span className="maths-drawer-number" aria-hidden="true">{snapshot?.completed ? '✓' : entry.number}</span>
                  <span>{entry.title}</span>
                  {snapshot && <small>{lessonPercent(snapshot)}%</small>}
                </button>
                {isCurrent && <div className="maths-drawer-current-progress">
                  <div className="maths-drawer-progress-label">
                    <span>Lesson progress</span>
                    <strong>{lessonPercent(currentSnapshot)}%</strong>
                  </div>
                  <div className="maths-progress-track" aria-hidden="true"><span style={{ width: `${lessonPercent(currentSnapshot)}%` }} /></div>
                </div>}
                {isCurrent && <ol className="maths-section-list" aria-label={`${entry.title} sections`}>
                  {entry.sections.map(section => {
                    const isCurrentSection = currentSnapshot?.currentSectionId === section.id
                    const isDone = Boolean(currentSnapshot?.completed || currentSnapshot?.completedSections?.includes(section.id))
                    return <li key={section.id}>
                      <button
                        type="button"
                        aria-current={isCurrentSection ? 'step' : undefined}
                        onClick={() => {
                          requestMathsState(entry.lessonId, section.startStateId)
                          onClose()
                        }}
                      >
                        <span aria-hidden="true">{isDone ? '✓' : '○'}</span>
                        {section.title}
                      </button>
                    </li>
                  })}
                </ol>}
              </li>
            })}
          </ol>
        </section>)}

        <button className="maths-all-lessons" type="button" onClick={onShowAll}>All Maths lessons</button>

        <details className="maths-lesson-options">
          <summary>Lesson information and options</summary>
          <div>
            <p><strong>Course</strong><span>GCSE Foundation Maths</span></p>
            <p><strong>Chapter</strong><span>Number</span></p>
            <p><strong>Progress</strong><span>Saved on this device</span></p>
          </div>
        </details>
      </div>
    </aside>
  </div>
}

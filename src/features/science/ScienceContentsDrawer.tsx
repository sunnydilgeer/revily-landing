'use client'

/*
 * Science lesson Contents: the same drawer as Maths. Every lesson and this lesson's sections, then
 * the details that used to sit under each screen (sources, where the lesson fits, restart, draft status).
 */
import { useEffect, useRef, useState } from 'react'
import { progress } from './engine'
import { scienceChapters, scienceHubHref, scienceLessonHref, scienceLessonNumberById, scienceLessons, TRANSPORT_EXAM_LESSON_ID, type LessonNumber } from './lessonNavigation'
import type { PreviewSession } from './previewSession'
import { sectionStatus } from './scienceProgress'

type Props = {
  open: boolean
  lessonNumber: LessonNumber
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

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'

export default function ScienceContentsDrawer({ open, lessonNumber, chapterTitle, session, storageAvailable, onClose, onJump, onRestart }: Props) {
  const drawerRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [clearHistory, setClearHistory] = useState(false)

  useEffect(() => {
    if (!open) { setConfirmRestart(false); setClearHistory(false); return }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
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
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  if (!open) return null
  const entry = scienceLessons.find(item => item.number === lessonNumber)!
  const lesson = entry.lesson
  const sections = sectionStatus(lesson, lessonNumber, session)
  const completion = progress(lesson, session.completedIds)
  const percent = Math.round(completion.fraction * 100)

  return <div className="maths-drawer-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <aside className="maths-contents-drawer" id="science-contents" ref={drawerRef} role="dialog" aria-modal="true" aria-labelledby="science-contents-title">
      <header className="maths-drawer-header">
        <div>
          <p>AQA Combined Science · Biology</p>
          <h2 id="science-contents-title">Contents</h2>
        </div>
        <button ref={closeButtonRef} className="maths-drawer-close" type="button" onClick={onClose} aria-label="Close contents">×</button>
      </header>

      <div className="maths-drawer-body">
        {scienceChapters.map(chapter => <section className="maths-drawer-chapter" key={chapter.code} aria-labelledby={`drawer-unit-${chapter.code}`}>
          <h3 id={`drawer-unit-${chapter.code}`}>{chapter.code} · {chapter.title}</h3>
          <ol>
            {scienceLessons.filter(item => (chapter.lessonNumbers as readonly number[]).includes(item.number)).map(item => {
              const isCurrent = item.number === lessonNumber
              return <li className={isCurrent ? 'is-current' : ''} key={item.number}>
                <a className="maths-drawer-lesson" href={isCurrent ? undefined : scienceLessonHref(item.number)} aria-current={isCurrent ? 'page' : undefined} onClick={event => { if (isCurrent) event.preventDefault() }}>
                  <span className="maths-drawer-number" aria-hidden="true">{item.number}</span>
                  <span>{item.title}</span>
                  {isCurrent && <small>{percent}%</small>}
                </a>
                {isCurrent && <div className="maths-drawer-current-progress">
                  <div className="maths-drawer-progress-label"><span>Lesson progress</span><strong>{percent}%</strong></div>
                  <div className="maths-progress-track" aria-hidden="true"><span style={{ width: `${percent}%` }} /></div>
                </div>}
                {isCurrent && <ol className="maths-section-list" aria-label={`${item.title} sections`}>
                  {sections.map(section => <li key={section.id}>
                    <button type="button" aria-current={section.current ? 'step' : undefined} onClick={() => onJump(section.id)}>
                      <span aria-hidden="true">{section.done ? '✓' : '○'}</span>
                      {section.title.replace(/^Chapter \d+ · /, '')}
                    </button>
                  </li>)}
                </ol>}
              </li>
            })}
          </ol>
        </section>)}

        {TRANSPORT_STORY.some(step => step.lessonId === entry.lesson.id) && <section className="sl-drawer-story" aria-labelledby="transport-story-title">
          <h3 id="transport-story-title">How the transport lessons connect</h3>
          <ol>{TRANSPORT_STORY.map(step => {
            const number = scienceLessonNumberById(step.lessonId)!
            return <li key={step.lessonId} className={step.lessonId === entry.lesson.id ? 'is-current' : ''}>
              <a href={scienceLessonHref(number)}><strong>{number} · {step.title}</strong></a><span>{step.route}</span>
            </li>
          })}</ol>
        </section>}

        <a className="maths-all-lessons" href={scienceHubHref()}>All Science lessons</a>

        <details className="maths-lesson-options">
          <summary>Lesson information and options</summary>
          <div>
            <p><strong>Course</strong><span>AQA Combined Science Trilogy · Foundation</span></p>
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

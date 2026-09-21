'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { getScienceHubLessons, scienceLessonHref, type ScienceVariant } from './lessonNavigation'
import { ScienceVariantSwitch } from './components/ScienceVariantSwitch'
import { createPreviewSessionEngine } from './previewSession'
import { progress } from './engine'
import './ScienceLesson.css'
import './FriendlyLesson.css'

const catalogs = { a: getScienceHubLessons('a'), b: getScienceHubLessons('b') }
const variantEngines = { a: catalogs.a.map(item => createPreviewSessionEngine(item.lesson)), b: catalogs.b.map(item => createPreviewSessionEngine(item.lesson)) }
type LessonProgress = { completed: number; started: boolean }
export default function ScienceLessonHub({ variant = 'a' }: { variant?: ScienceVariant }) {
  const scienceLessons = catalogs[variant]
  const engines = variantEngines[variant]
  const [saved, setSaved] = useState<LessonProgress[] | null>(null)
  const [storageAvailable, setStorageAvailable] = useState(true)
  useEffect(() => {
    const records = engines.map((engine, i) => {
      try {
        const raw = window.localStorage.getItem(engine.storageKey)
        const session = raw ? engine.restorePreviewSession(JSON.parse(raw)) : null
        return { completed: session ? progress(scienceLessons[i].lesson, session.completedIds).completed : 0,
          started: Boolean(session && (session.currentId !== scienceLessons[i].lesson.states[0].id || Object.keys(session.answers).length || Object.keys(session.drafts).length || session.completedIds.length)) }
      } catch (error) {
        if (!(error instanceof SyntaxError)) setStorageAvailable(false)
        return { completed: 0, started: false }
      }
    })
    setSaved(records)
  }, [engines, scienceLessons])
  return <div className="science-preview science-preview--revision">
    <header className="science-header"><Link className="science-brand" href="/" aria-label="Revily home"><span aria-hidden="true">R</span><strong>Revily</strong></Link><span className="science-header__subject">Science</span></header>
    <main className="science-course">
      <ScienceVariantSwitch variant={variant} />
      <nav aria-label="Exam preparation" className="science-variant__links"><Link className="science-variant__link" href={`/preview/science/coverage?variant=${variant}`}>Curriculum and exam map</Link><Link className="science-variant__link" href={`/preview/science/exam?variant=${variant}`}>Lesson 6 exam practice</Link></nav>
      <div className="science-topic"><div><span className="science-eyebrow">Biology · Paper 1</span><h1>Cell biology and organisation</h1></div></div>
      <nav aria-label="Science lessons" className="science-course__path"><ol>{scienceLessons.map((item, i) => {
        const record = saved?.[i]
        const total = item.lesson.states.length
        const complete = record?.completed === total
        return <li key={item.number}><Link className={`science-course__lesson science-course__lesson--${item.number}`} href={scienceLessonHref(item.number, variant)} aria-label={`Lesson ${item.number}: ${item.title}`}>
          <span className="science-course__number" aria-hidden="true">{complete ? <Check size={23} /> : item.number}</span>
          <div className="science-course__description"><span className="science-eyebrow">Lesson {item.number}</span><h2>{item.title}</h2><p>{item.detail}</p><span className="science-course__status">{!saved ? 'Loading progress…' : complete ? 'All activities completed' : record?.started ? `${record.completed} / ${total} activities completed` : 'Not started'}</span></div>
          <span className="science-course__action">{!saved ? 'Open' : complete ? 'Review' : record?.started ? 'Resume' : 'Start'}<ArrowRight size={17} aria-hidden="true" /></span>
        </Link></li>
      })}</ol></nav>
      {!storageAvailable && <p className="science-storage-warning" role="status">Saved progress is unavailable in this browser. You can still open every lesson.</p>}
    </main>
  </div>
}

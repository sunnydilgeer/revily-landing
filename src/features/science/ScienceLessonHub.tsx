'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Settings } from 'lucide-react'
import { getScienceHubLessons, scienceChapters, scienceLessonHref, type ScienceVariant } from './lessonNavigation'
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
  const firstIncompleteIndex = saved ? saved.findIndex((record, index) => record.completed < scienceLessons[index].lesson.states.length) : 0
  const continueIndex = firstIncompleteIndex >= 0 ? firstIncompleteIndex : Math.max(scienceLessons.length - 1, 0)
  const continueItem = scienceLessons[continueIndex]
  const continueRecord = saved?.[continueIndex]
  const continueComplete = continueRecord?.completed === continueItem?.lesson.states.length
  return <div className="science-preview science-preview--revision">
    <header className="science-header"><Link className="science-brand" href="/" aria-label="Revily home"><span aria-hidden="true">R</span><strong>Revily</strong></Link><span className="science-header__subject">Science</span><details className="science-preferences"><summary><Settings size={16} aria-hidden="true" /> Preferences</summary><div className="science-preferences__panel"><ScienceVariantSwitch variant={variant} /></div></details></header>
    <main className="science-course">
      <div className="science-course__heading"><div><span className="science-eyebrow">Biology · Paper 1</span><h1>Cell biology and organisation</h1></div><nav aria-label="Course resources"><Link href={`/preview/science/coverage?variant=${variant}`}>Curriculum map</Link><Link href={`/preview/science/exam?variant=${variant}`}>Lesson 6 practice</Link></nav></div>
      {continueItem && <Link className="science-course__continue" href={scienceLessonHref(continueItem.number, variant)}>
        <span><span className="science-eyebrow">{continueComplete ? 'Review a lesson' : continueRecord?.started ? 'Continue learning' : 'Start learning'}</span><strong>Lesson {continueItem.number} · {continueItem.title}</strong><small>{continueRecord?.started && !continueComplete ? `${continueRecord.completed} of ${continueItem.lesson.states.length} activities complete` : continueItem.detail}</small></span>
        <span className="science-course__continue-action">{continueComplete ? 'Review' : continueRecord?.started ? 'Continue' : 'Start'} <ArrowRight size={17} aria-hidden="true" /></span>
      </Link>}
      <nav aria-label="Science lessons" className="science-course__path">{scienceChapters.map(chapter => {
        const chapterLessons = scienceLessons.map((item, index) => ({ item, index })).filter(({ item }) => (chapter.lessonNumbers as readonly number[]).includes(item.number))
        const completeLessons = chapterLessons.filter(({ item, index }) => saved?.[index]?.completed === item.lesson.states.length).length
        return <section className="science-course__chapter" key={chapter.code} aria-labelledby={`science-chapter-${chapter.code}`}>
          <header><span className="science-course__chapter-code">{chapter.code}</span><h2 id={`science-chapter-${chapter.code}`}>{chapter.title}</h2><span>{saved ? `${completeLessons} of ${chapterLessons.length} lessons complete` : `${chapterLessons.length} lessons`}</span></header>
          <ol>{chapterLessons.map(({ item, index }) => {
            const record = saved?.[index]
            const total = item.lesson.states.length
            const complete = record?.completed === total
            return <li key={item.number}><Link className={`science-course__lesson science-course__lesson--${item.number}`} href={scienceLessonHref(item.number, variant)} aria-label={`Lesson ${item.number}: ${item.title}`}>
              <span className={`science-course__number${complete ? ' is-complete' : ''}`} aria-hidden="true">{complete ? <Check size={17} /> : item.number}</span>
              <div className="science-course__description"><h3>{item.number} · {item.title}</h3><p>{item.detail}</p></div>
              <span className="science-course__status">{!saved ? 'Loading…' : complete ? 'Review' : record?.started ? `Resume · ${record.completed}/${total}` : 'Start'}</span>
            </Link></li>
          })}</ol>
        </section>
      })}</nav>
      {!storageAvailable && <p className="science-storage-warning" role="status">Saved progress is unavailable in this browser. You can still open every lesson.</p>}
    </main>
  </div>
}

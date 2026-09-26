'use client'

/*
 * Science curriculum home. Same layout as Maths: up next, today, then the AQA units as chapters with
 * each lesson's sections as pips. The unit you're in is open; the others fold to one row.
 */
import { useEffect, useState } from 'react'
import { Button } from '../../ui'
import TodayCard from '../maths/TodayCard'
import type { StudySummary } from '../maths/useStudy'
import { scienceLessonHref, type LessonNumber } from './lessonNavigation'
import { readScienceLastLesson, readScienceProgress, saveScienceLastLesson, scienceCatalogue, scienceUnits, sectionStatus, type ScienceLessonStatus } from './scienceProgress'
import '../maths/Curriculum.css'
import './ScienceCurriculum.css'

// Science lessons still open in the Science lesson player for now.
function onOpenLesson(number: LessonNumber) {
  saveScienceLastLesson(number)
  window.location.assign(scienceLessonHref(number, 'b'))
}

const LATER = [{ code: 'C', title: 'Chemistry' }, { code: 'P', title: 'Physics' }]

const Lock = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-label="Not built yet"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>

export default function ScienceCurriculum({ study }: { study: StudySummary }) {
  const [progress, setProgress] = useState<Partial<Record<LessonNumber, ScienceLessonStatus>>>({})
  const [lastLesson, setLastLesson] = useState<LessonNumber | null>(null)
  useEffect(() => {
    setProgress(readScienceProgress())
    setLastLesson(readScienceLastLesson())
  }, [])
  const last = scienceCatalogue.find(item => item.number === lastLesson)
  const nextIncomplete = scienceCatalogue.find(item => !progress[item.number]?.completed)
  const upNext = last && progress[last.number]?.started && !progress[last.number]?.completed ? last : nextIncomplete ?? last ?? scienceCatalogue[0]
  const upNextStatus = progress[upNext.number]
  const upNextSections = upNextStatus?.sections ?? sectionStatus(upNext.lesson, upNext.number, null)
  const current = upNextSections.findIndex(section => section.current && !section.done)
  const upNextIndex = current >= 0 ? current : Math.max(0, upNextSections.findIndex(section => !section.done))
  const doneLessons = scienceCatalogue.filter(item => progress[item.number]?.completed).length
  const upNextUnit = scienceUnits.find(unit => unit.lessons.some(item => item.number === upNext.number))!.code
  // The unit you're in is open unless you fold it; others stay folded until you open them.
  const [folds, setFolds] = useState<Record<string, boolean>>({})
  const isOpen = (code: string) => folds[code] ?? code === upNextUnit
  const toggle = (code: string) => setFolds(current => ({ ...current, [code]: !isOpen(code) }))

  return <div className="cur">
    <header className="cur-head">
      <div>
        <h1>Curriculum</h1>
        <p>AQA Combined Science Trilogy · Foundation</p>
      </div>
      <div className="cur-overall" aria-label={`${doneLessons} of ${scienceCatalogue.length} lessons complete`}>
        <div className="cur-overall__bar" aria-hidden="true"><span style={{ width: `${doneLessons / scienceCatalogue.length * 100}%` }} /></div>
        <span>{doneLessons} / {scienceCatalogue.length} lessons</span>
      </div>
    </header>

    <div className="cur-top">
      <section className="cur-next" aria-labelledby="up-next-title">
        <div className="cur-next__copy">
          <span className="cur-kicker cur-kicker--night">{upNextStatus?.started ? 'Up next' : 'Start here'}</span>
          <h2 id="up-next-title">{upNext.title}</h2>
          {upNextSections.length > 0 && <p>Section {upNextIndex + 1} of {upNextSections.length} · {upNextSections[upNextIndex]?.title}</p>}
          <Button size="lg" className="cur-next__go" onClick={() => onOpenLesson(upNext.number)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z" fill="currentColor" /></svg>
            {upNextStatus?.started ? 'Continue' : 'Start lesson'}
          </Button>
        </div>
        <ol className="cur-next__ladder" aria-hidden="true">
          {upNextSections.slice(Math.max(0, upNextIndex - 1), upNextIndex + 3).map(section => <li key={section.id} className={section.done ? 'is-done' : section.id === upNextSections[upNextIndex]?.id ? 'is-next' : ''}>{section.title}</li>)}
        </ol>
      </section>
      <TodayCard study={study} />
    </div>

    {scienceUnits.map(unit => {
      const open = isOpen(unit.code)
      const doneInUnit = unit.lessons.filter(item => progress[item.number]?.completed).length
      const summary = `${unit.lessons.length} lesson${unit.lessons.length === 1 ? '' : 's'}${doneInUnit ? ` · ${doneInUnit} done` : ''}`
      if (!open) return <button key={unit.code} type="button" className="sci-unit-row" aria-expanded={false} onClick={() => toggle(unit.code)}>
        <span className="cur-chapter__num" aria-hidden="true">{unit.code}</span>
        <span className="sci-unit-row__title">{unit.title}</span>
        <small>{summary}</small>
      </button>
      return <section className="cur-chapter" key={unit.code} aria-labelledby={`unit-${unit.code}`}>
        <header className="cur-chapter__head">
          <span className="cur-chapter__num" aria-hidden="true">{unit.code}</span>
          <div>
            <h2 id={`unit-${unit.code}`}>{unit.title}</h2>
            <p>{summary} · Biology</p>
          </div>
          <button type="button" className="sci-unit-fold" aria-expanded={true} onClick={() => toggle(unit.code)}>
            <span className="sr-only">Fold {unit.title}</span>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg>
          </button>
        </header>
        <ol className="cur-path">
          {unit.lessons.map(item => {
            const record = progress[item.number]
            const sections = record?.sections ?? sectionStatus(item.lesson, item.number, null)
            const doneSections = sections.filter(section => section.done).length
            const status = record?.completed ? 'done' : item.number === upNext.number ? 'next' : record?.started ? 'progress' : 'todo'
            const action = status === 'done' ? 'Review' : record?.started ? 'Continue' : 'Start'
            return <li className={`cur-lesson is-${status}`} key={item.number}>
              <span className="cur-lesson__node" aria-hidden="true">{status === 'done' ? '✓' : item.number}</span>
              <div className="cur-lesson__body">
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <div className="cur-rungs sci-pips" role="img" aria-label={`${doneSections} of ${sections.length} sections done`}>
                  {sections.map(section => <span key={section.id} title={section.title} className={section.done ? 'is-done' : section.current ? 'is-current' : ''} />)}
                  <small>{doneSections} / {sections.length} sections</small>
                </div>
              </div>
              <Button variant={status === 'next' ? 'primary' : 'secondary'} onClick={() => onOpenLesson(item.number)} aria-label={`${action} ${item.title}`}>{action}</Button>
            </li>
          })}
        </ol>
      </section>
    })}

    <section className="cur-later" aria-labelledby="later-title">
      <h2 id="later-title">Coming later</h2>
      <ul>
        {LATER.map(subject => <li key={subject.code}>
          <span className="cur-chapter__num is-locked" aria-hidden="true">{subject.code}</span>
          <span>{subject.title}</span>
          <Lock />
        </li>)}
      </ul>
    </section>

    <p className="sci-draft-note">Draft content, awaiting review by a qualified teacher.</p>
  </div>
}

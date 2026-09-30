'use client'

/*
 * Science curriculum home. Same contents layout as Maths: the AQA units down the left, one subject at a time,
 * and the chosen unit's lessons on a line on the right. The unit you're in is chosen to start with.
 */
import { useEffect, useState } from 'react'
import { Button } from '../../ui'
import TodayCard from '../maths/TodayCard'
import { Lock, TocChapter, TocLesson, estimateMinutes, type TocStatus } from '../maths/Curriculum'
import type { StudySummary } from '../maths/useStudy'
import { scienceSubjectLessonHref, scienceSubjects, type ScienceCatalogueEntry } from './lessonNavigation'
import { readScienceLastLesson, readScienceProgress, saveScienceLastLesson, scienceCatalogue, scienceUnits, sectionStatus, type ScienceProgressMap } from './scienceProgress'
import '../maths/Curriculum.css'
import './ScienceCurriculum.css'

// Science lessons still open in the Science lesson player for now.
function onOpenLesson(entry: ScienceCatalogueEntry) {
  saveScienceLastLesson(entry)
  window.location.assign(scienceSubjectLessonHref(entry.subject, entry.number))
}

// A subject becomes a real section of the curriculum as soon as it has one lesson; until then it is listed under Coming later.
const LATER = scienceSubjects.filter(item => item.lessons.length === 0).map(item => ({ code: item.code, title: item.title }))
const shownSubjects = scienceSubjects.filter(item => item.lessons.length > 0)
const shownUnits = scienceUnits.filter(unit => shownSubjects.some(item => item.subject === unit.subject))

export default function ScienceCurriculum({ study }: { study: StudySummary }) {
  const [progress, setProgress] = useState<ScienceProgressMap>({})
  const [last, setLast] = useState<ScienceCatalogueEntry | null>(null)
  useEffect(() => {
    setProgress(readScienceProgress())
    setLast(readScienceLastLesson())
  }, [])
  const nextIncomplete = scienceCatalogue.find(item => !progress[item.lesson.id]?.completed)
  const upNext = last && progress[last.lesson.id]?.started && !progress[last.lesson.id]?.completed ? last : nextIncomplete ?? last ?? scienceCatalogue[0]
  const upNextStatus = progress[upNext.lesson.id]
  const upNextSections = upNextStatus?.sections ?? sectionStatus(upNext.lesson, upNext.sections, null)
  const current = upNextSections.findIndex(section => section.current && !section.done)
  const upNextIndex = current >= 0 ? current : Math.max(0, upNextSections.findIndex(section => !section.done))
  const doneLessons = scienceCatalogue.filter(item => progress[item.lesson.id]?.completed).length
  const upNextUnit = scienceUnits.find(unit => unit.lessons.includes(upNext))!.code
  // The unit you're in is shown until you pick another; the saved last lesson arrives after the first render.
  const [picked, setPicked] = useState<string | null>(null)
  const selected = picked ?? upNextUnit
  const unit = shownUnits.find(item => item.code === selected)
  const laterSubject = LATER.find(item => item.code === selected)
  // The unit list shows one subject at a time, starting with the one you're in.
  const [pickedSubject, setListSubject] = useState<string | null>(null)
  const listSubject = pickedSubject ?? unit?.subject ?? upNext.subject

  return <div className="cur">
    <header className="cur-head">
      <div>
        <h1>Curriculum</h1>
        <p>AQA Combined Science Trilogy · Foundation · {shownUnits.length} units</p>
      </div>
      <div className="cur-overall" aria-label={`${doneLessons} of ${scienceCatalogue.length} lessons complete`}>
        <div className="cur-overall__bar" aria-hidden="true"><span style={{ width: `${doneLessons / scienceCatalogue.length * 100}%` }} /></div>
        <span>{doneLessons} / {scienceCatalogue.length} lessons</span>
      </div>
    </header>

    <div className="cur-toc">
      <nav className="cur-toc__chapters" aria-label="Units">
        <div className="cur-toc__subjects" role="group" aria-label="Subject">
          {shownSubjects.map(subject => <button key={subject.code} type="button" aria-pressed={subject.subject === listSubject}
            onClick={() => setListSubject(subject.subject)}>{subject.code === 'WS' ? 'Skills' : subject.title}</button>)}
        </div>
        <ol>
          {shownUnits.filter(item => item.subject === listSubject).map(item => <TocChapter key={item.code} code={item.code} title={item.title}
            meta={item.lessons.length === 0 ? <Lock /> : `${item.lessons.filter(entry => progress[entry.lesson.id]?.completed).length} / ${item.lessons.length}`}
            locked={item.lessons.length === 0} selected={item.code === selected} onSelect={() => setPicked(item.code)} />)}
          {LATER.length > 0 && <li className="cur-toc__group" aria-hidden="true">Coming later</li>}
          {LATER.map(subject => <TocChapter key={subject.code} code={subject.code} title={subject.title} meta={<Lock />} locked
            selected={subject.code === selected} onSelect={() => setPicked(subject.code)} />)}
        </ol>
      </nav>

      <section className="cur-panel" id="cur-panel" aria-labelledby="cur-panel-title">
        {unit && unit.lessons.length > 0 ? <>
          <header className="cur-panel__head">
            <h2 id="cur-panel-title">{unit.code} · {unit.title}</h2>
            <span>{unit.lessons.length} {unit.lessons.length === 1 ? 'lesson' : 'lessons'}</span>
          </header>
          <ol className="cur-path">
            {unit.lessons.map(item => {
              const record = progress[item.lesson.id]
              const status: TocStatus = record?.completed ? 'done' : item === upNext ? 'next' : record?.started ? 'progress' : 'todo'
              const minutes = estimateMinutes(item.lesson.states.length)
              const detail = upNextStatus?.started
                ? `Up next · section ${upNextIndex + 1} of ${upNextSections.length} · ${upNextSections[upNextIndex]?.title}`
                : `Start here · ${upNextSections.length} sections · ${minutes} min`
              return <TocLesson key={item.lesson.id} status={status} title={item.title} minutes={minutes} detail={detail}
                action={status === 'done' ? 'Review' : record?.started ? 'Continue' : 'Start'} onOpen={() => onOpenLesson(item)} />
            })}
          </ol>
        </> : <div className="cur-panel__later">
          <h2 id="cur-panel-title">{unit ? `${unit.code} · ${unit.title}` : laterSubject?.title}</h2>
          <p><Lock /> Coming later. {unit ? 'This unit' : 'This subject'} isn’t built yet, so keep going in {upNextUnit}.</p>
          <Button variant="secondary" onClick={() => setPicked(upNextUnit)}>Back to where I’m up to</Button>
        </div>}
        <p className="sci-draft-note">Draft content, awaiting review by a qualified teacher.</p>
      </section>

      <div className="cur-toc__today"><TodayCard study={study} /></div>
    </div>
  </div>
}

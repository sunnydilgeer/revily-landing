'use client'

/*
 * Science curriculum home. Same contents layout as Maths: the AQA units down the left, one subject at a time,
 * and the chosen unit's lessons on a line on the right. The unit you're in is chosen to start with.
 */
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../ui'
import { ChapterAccordion, CurriculumSearch, Lock, TocChapter, TocLesson, useIsPhone, type SearchResult, type TocStatus } from '../maths/Curriculum'
import { scienceEntryHref, scienceSubjects, scienceSubjectTitle, type ScienceCatalogueEntry } from './lessonNavigation'
import { scienceLessonMinutes } from './lessonMinutes'
import { readScienceLastLesson, readScienceProgress, saveScienceLastLesson, scienceUnitsForTier, sectionStatus, type ScienceProgressMap } from './scienceProgress'
import { forTier, readScienceTier, saveScienceTier, scienceCatalogueForTier, type ScienceTier } from './tier'
import { HigherBadge } from './higher/HigherBadge'
import '../maths/Curriculum.css'
import './ScienceCurriculum.css'

// Science lessons still open in the Science lesson player for now.
function onOpenLesson(entry: ScienceCatalogueEntry, section?: string) {
  saveScienceLastLesson(entry)
  window.location.assign(scienceEntryHref(entry, section))
}
const stripChapter = (title: string) => title.replace(/^Chapter \d+ · /, '')

// A subject becomes a real section of the curriculum as soon as it has one lesson; until then it is listed under Coming later.
const LATER = scienceSubjects.filter(item => item.lessons.length === 0).map(item => ({ code: item.code, title: item.title }))
const shownSubjects = scienceSubjects.filter(item => item.lessons.length > 0)
const shownUnitsFor = (tier: ScienceTier) => scienceUnitsForTier(tier).filter(unit => shownSubjects.some(item => item.subject === unit.subject))

export default function ScienceCurriculum() {
  const [progress, setProgress] = useState<ScienceProgressMap>({})
  const [last, setLast] = useState<ScienceCatalogueEntry | null>(null)
  const [tier, setTier] = useState<ScienceTier>('foundation')
  useEffect(() => {
    const saved = readScienceTier()
    setTier(saved)
    setProgress(readScienceProgress(saved))
    setLast(readScienceLastLesson(saved))
  }, [])
  function chooseTier(next: ScienceTier) {
    saveScienceTier(next)
    setTier(next)
    setProgress(readScienceProgress(next))
    setLast(readScienceLastLesson(next))
  }
  // Foundation never gets a Higher-only lesson: not in the list, the counts, the progress or Up next.
  const scienceCatalogue = scienceCatalogueForTier(tier)
  const shownUnits = shownUnitsFor(tier)
  const nextIncomplete = scienceCatalogue.find(item => !progress[item.lesson.id]?.completed)
  const upNext = last && progress[last.lesson.id]?.started && !progress[last.lesson.id]?.completed ? last : nextIncomplete ?? last ?? scienceCatalogue[0]
  const upNextStatus = progress[upNext.lesson.id]
  const upNextTiered = forTier(upNext, tier)
  const upNextSections = upNextStatus?.sections ?? sectionStatus(upNextTiered.lesson, upNextTiered.sections, null)
  const current = upNextSections.findIndex(section => section.current && !section.done)
  const upNextIndex = current >= 0 ? current : Math.max(0, upNextSections.findIndex(section => !section.done))
  const doneLessons = scienceCatalogue.filter(item => progress[item.lesson.id]?.completed).length
  const upNextUnit = shownUnits.find(unit => unit.lessons.includes(upNext))!.code
  // The unit you're in is shown until you pick another; the saved last lesson arrives after the first render.
  const [picked, setPicked] = useState<string | null>(null)
  const selected = picked ?? upNextUnit
  const unit = shownUnits.find(item => item.code === selected)
  const laterSubject = LATER.find(item => item.code === selected)
  // The unit list shows one subject at a time, starting with the one you're in.
  const [pickedSubject, setListSubject] = useState<string | null>(null)
  const phone = useIsPhone()
  const listSubject = pickedSubject ?? unit?.subject ?? upNext.subject

  // Search matches lesson and section titles in every subject; a section opens its lesson at that section.
  const [query, setQuery] = useState('')
  const results = useMemo<SearchResult[] | null>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return shownUnitsFor(tier).flatMap(item => item.lessons.flatMap(raw => {
      const entry = forTier(raw, tier)
      const where = `${scienceSubjectTitle(entry.subject)} · ${item.code}`
      return [
        ...(entry.title.toLowerCase().includes(q) ? [{ key: entry.lesson.id, title: entry.title, label: `Lesson · ${where} ${item.title}`, onPick: () => onOpenLesson(entry) }] : []),
        ...sectionStatus(entry.lesson, entry.sections, null).filter(section => stripChapter(section.title).toLowerCase().includes(q))
          .map(section => ({ key: `${entry.lesson.id}-${section.id}`, title: stripChapter(section.title), label: `Section · ${where} · ${entry.title}`, onPick: () => onOpenLesson(entry, section.id) })),
      ]
    }))
  }, [query, tier])

  const renderLesson = (item: ScienceCatalogueEntry) => {
    const record = progress[item.lesson.id]
    const status: TocStatus = record?.completed ? 'done' : item === upNext ? 'next' : record?.started ? 'progress' : 'todo'
    const minutes = scienceLessonMinutes(forTier(item, tier).lesson)
    const detail = upNextStatus?.started
      ? `Up next · section ${upNextIndex + 1} of ${upNextSections.length} · ${upNextSections[upNextIndex]?.title}`
      : `Start here · ${upNextSections.length} sections · ${minutes} min`
    const tiered = forTier(item, tier)
    const sections = item === upNext ? upNextSections : sectionStatus(tiered.lesson, tiered.sections, null)
    return <TocLesson key={item.lesson.id} id={item.lesson.id} status={status} title={item.title} badge={item.higherOnly && <HigherBadge />} minutes={minutes} detail={detail}
      action={status === 'done' ? 'Review' : record?.started ? 'Continue' : 'Start'} onOpen={() => onOpenLesson(item)}
      sections={sections.map(section => ({ id: section.id, title: stripChapter(section.title), badge: section.higher && <HigherBadge /> }))}
      currentSectionId={status === 'next' && upNextStatus?.started ? sections.find(section => section.current)?.id : undefined}
      onOpenSection={sectionId => onOpenLesson(item, sectionId)} />
  }

  const tierSwitch = <div className="cur-tier" role="group" aria-label="Tier">
    {(['foundation', 'higher'] as const).map(option => <button key={option} type="button" aria-pressed={tier === option}
      onClick={() => chooseTier(option)}>{option === 'higher' ? 'Higher' : 'Foundation'}</button>)}
  </div>

  // Phones: no header, just the tier, search, a subject switch and every unit in one list, opened at the last
  // lesson you viewed (or the next one, before you've opened any).
  if (phone) {
    const focus = last ?? upNext
    const phoneSubject = pickedSubject ?? focus.subject
    return <div className="cur cur--phone">
      {tierSwitch}
      <CurriculumSearch query={query} onQuery={setQuery} placeholder="Search lessons and sections" results={results} />
      {!results && <>
        <div className="cur-toc__subjects" role="group" aria-label="Subject">
          {shownSubjects.map(subject => <button key={subject.code} type="button" aria-pressed={subject.subject === phoneSubject}
            onClick={() => setListSubject(subject.subject)}>{subject.code === 'WS' ? 'Skills' : subject.title}</button>)}
        </div>
        <ChapterAccordion label="Units" focusLessonId={focus.lesson.id} chapters={[
          ...shownUnits.filter(item => item.subject === phoneSubject).map(item => ({ id: item.code, code: item.code, title: item.title,
            lessonIds: item.lessons.map(entry => entry.lesson.id), lessons: item.lessons.map(renderLesson), locked: item.lessons.length === 0 })),
          ...LATER.map(subject => ({ id: `later-${subject.code}`, code: subject.code, title: subject.title, lessonIds: [], locked: true })),
        ]} />
        <p className="sci-draft-note">Draft content, awaiting review by a qualified teacher.</p>
      </>}
    </div>
  }

  return <div className="cur">
    <header className="cur-head">
      <div>
        <h1>Curriculum</h1>
        <p>AQA Combined Science Trilogy · {tier === 'higher' ? 'Higher' : 'Foundation'} · {shownUnits.length} units</p>
        {tierSwitch}
      </div>
      <div className="cur-overall" aria-label={`${doneLessons} of ${scienceCatalogue.length} lessons complete`}>
        <div className="cur-overall__bar" aria-hidden="true"><span style={{ width: `${doneLessons / scienceCatalogue.length * 100}%` }} /></div>
        <span>{doneLessons} / {scienceCatalogue.length} lessons</span>
      </div>
    </header>

    <CurriculumSearch query={query} onQuery={setQuery} placeholder="Search lessons and sections" results={results} />

    {!results && <div className="cur-toc">
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
            {unit.lessons.map(renderLesson)}
          </ol>
        </> : <div className="cur-panel__later">
          <h2 id="cur-panel-title">{unit ? `${unit.code} · ${unit.title}` : laterSubject?.title}</h2>
          <p><Lock /> Coming later. {unit ? 'This unit' : 'This subject'} isn’t built yet, so keep going in {upNextUnit}.</p>
          <Button variant="secondary" onClick={() => setPicked(upNextUnit)}>Back to where I’m up to</Button>
        </div>}
        <p className="sci-draft-note">Draft content, awaiting review by a qualified teacher.</p>
      </section>

    </div>}
  </div>
}

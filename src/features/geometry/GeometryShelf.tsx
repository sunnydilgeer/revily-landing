'use client'

import '../../App.css'
import '../maths/MathsNavigation.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CloseIcon, ContentsIcon } from '../../ui/icons'
import { LessonBarSlot } from '../maths/rungs'
import MathsContentsDrawer from '../maths/MathsContentsDrawer'
import type { MathsSection } from '../maths/courseRegistry'
import { MATHS_PROGRESS_EVENT, readMathsProgress, requestMathsState, type LessonProgressMap, type LessonProgressSnapshot } from '../maths/lessonProgress'
import TutorMethodLessonView from '../written-methods/tutor/TutorMethodLessonView'
import { geometryChapter, geometryLessons, isGeometryLessonNumber, lessonFor, type GeometryLessonNumber } from './geometryLessons'

/*
 * The hidden Geometry shelf (geometryLessons.ts): a lesson at a time with the course's own header and Contents drawer, which
 * lists only the Geometry chapter. ?lesson=201 picks the lesson and ?section= the skill, as on the course.
 */
function lessonFromUrl(): GeometryLessonNumber {
  const value = Number(new URL(window.location.href).searchParams.get('lesson'))
  return isGeometryLessonNumber(value) ? value : 201
}

export default function GeometryShelf() {
  const [lesson, setLesson] = useState<GeometryLessonNumber>(201)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [progress, setProgress] = useState<LessonProgressMap>({})
  const contentsButtonRef = useRef<HTMLButtonElement>(null)
  const [barSlot, setBarSlot] = useState<HTMLDivElement | null>(null)
  const current = geometryLessons.find(item => item.number === lesson)!

  useEffect(() => {
    setProgress(readMathsProgress())
    const sync = () => { setLesson(lessonFromUrl()); setDrawerOpen(false) }
    const update = (event: Event) => {
      const snapshot = (event as CustomEvent<LessonProgressSnapshot>).detail
      if (snapshot) setProgress(currentMap => ({ ...currentMap, [snapshot.lessonId]: snapshot }))
    }
    sync()
    window.addEventListener('popstate', sync)
    window.addEventListener(MATHS_PROGRESS_EVENT, update)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener(MATHS_PROGRESS_EVENT, update)
    }
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    window.requestAnimationFrame(() => contentsButtonRef.current?.focus())
  }, [])
  const openLesson = useCallback((number: GeometryLessonNumber, skill?: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('lesson', String(number))
    if (skill) url.searchParams.set('section', skill)
    else url.searchParams.delete('section')
    window.history.pushState({}, '', `${url.pathname}${url.search}`)
    setLesson(number)
    setDrawerOpen(false)
    window.scrollTo({ top: 0 })
  }, [])
  const selectSkill = useCallback((number: GeometryLessonNumber, section: MathsSection) => {
    if (number === lesson) requestMathsState(current.lessonId, section.startStateId)
    else openLesson(number, section.id)
    window.requestAnimationFrame(() => contentsButtonRef.current?.focus())
  }, [current.lessonId, lesson, openLesson])

  return <div className="app-shell app-shell--lesson app-shell--study">
    <header className="site-header lesson-bar">
      <nav className="lesson-bar__crumbs" aria-label="Breadcrumb">
        <a className="lesson-bar__close" href="/preview" aria-label="Close the lesson and go back to Chapters"><CloseIcon size={22} /></a>
        <span className="sr-only" aria-current="page">Geometry: {current.title}</span>
      </nav>
      <div className="lesson-bar__slot" ref={setBarSlot} />
      <button ref={contentsButtonRef} className="maths-contents-button lesson-bar__contents" type="button" aria-expanded={drawerOpen}
        aria-controls="maths-contents" onClick={() => setDrawerOpen(true)}><ContentsIcon size={20} /><span>Contents</span></button>
    </header>

    <LessonBarSlot.Provider value={barSlot}><main className="lesson-preview geometry-shelf" id="main-content"><TutorMethodLessonView key={lesson} lesson={lessonFor(lesson)} /></main></LessonBarSlot.Provider>

    <MathsContentsDrawer open={drawerOpen} currentLesson={current} progress={progress} chapters={[geometryChapter]}
      onClose={closeDrawer} onSelectLesson={number => openLesson(number)} onSelectSkill={selectSkill} />
  </div>
}

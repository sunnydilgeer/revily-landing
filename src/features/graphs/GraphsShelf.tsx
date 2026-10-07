'use client'

import '../../App.css'
import '../maths/MathsNavigation.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { RevilyLogo } from '../../ui'
import MathsContentsDrawer from '../maths/MathsContentsDrawer'
import type { MathsSection } from '../maths/courseRegistry'
import { MATHS_PROGRESS_EVENT, readMathsProgress, requestMathsState, type LessonProgressMap, type LessonProgressSnapshot } from '../maths/lessonProgress'
import TutorMethodLessonView from '../written-methods/tutor/TutorMethodLessonView'
import { graphsChapter, graphsLessons, isGraphsLessonNumber, lessonFor, type GraphsLessonNumber } from './graphsLessons'

/*
 * The hidden Graphs shelf (graphsLessons.ts): a lesson at a time with the course's own header and Contents drawer, which
 * lists only the Graphs chapter. ?lesson=101 picks the lesson and ?section= the skill, as on the course.
 */
function lessonFromUrl(): GraphsLessonNumber {
  const value = Number(new URL(window.location.href).searchParams.get('lesson'))
  return isGraphsLessonNumber(value) ? value : 101
}

export default function GraphsShelf() {
  const [lesson, setLesson] = useState<GraphsLessonNumber>(101)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [progress, setProgress] = useState<LessonProgressMap>({})
  const contentsButtonRef = useRef<HTMLButtonElement>(null)
  const current = graphsLessons.find(item => item.number === lesson)!

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
  const openLesson = useCallback((number: GraphsLessonNumber, skill?: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('lesson', String(number))
    if (skill) url.searchParams.set('section', skill)
    else url.searchParams.delete('section')
    window.history.pushState({}, '', `${url.pathname}${url.search}`)
    setLesson(number)
    setDrawerOpen(false)
    window.scrollTo({ top: 0 })
  }, [])
  const selectSkill = useCallback((number: GraphsLessonNumber, section: MathsSection) => {
    if (number === lesson) requestMathsState(current.lessonId, section.startStateId)
    else openLesson(number, section.id)
    window.requestAnimationFrame(() => contentsButtonRef.current?.focus())
  }, [current.lessonId, lesson, openLesson])

  return <div className="app-shell app-shell--lesson app-shell--study">
    <header className="site-header">
      <RevilyLogo wordmark={false} size={24} href="/preview" />
      <nav className="maths-breadcrumbs" aria-label="Breadcrumb">
        <span>Graphs</span>
        <span aria-hidden="true">/</span>
        <span className="maths-breadcrumb-number" aria-current="page">{current.title}</span>
      </nav>
      <button ref={contentsButtonRef} className="maths-contents-button" type="button" aria-expanded={drawerOpen}
        aria-controls="maths-contents" onClick={() => setDrawerOpen(true)}>Contents</button>
    </header>

    <main className="lesson-preview" id="main-content"><TutorMethodLessonView key={lesson} lesson={lessonFor(lesson)} /></main>

    <MathsContentsDrawer open={drawerOpen} currentLesson={current} progress={progress} chapters={[graphsChapter]}
      onClose={closeDrawer} onSelectLesson={number => openLesson(number)} onSelectSkill={selectSkill} />
  </div>
}

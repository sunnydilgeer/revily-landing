'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import './features/maths/MathsNavigation.css'
import NumberTypesLesson from './features/number-types/NumberTypesLessonView'
import OperationsVariantCLesson from './features/order-of-operations/variant-c/VariantCLessonView'
import TutorPlaceValueLesson from './features/place-value/tutor/PlaceValueLessonView'
import TutorLongMultiplicationLesson from './features/long-multiplication/tutor/LongMultiplicationLessonView'
import TutorLongDivisionLesson from './features/long-division/tutor/LongDivisionLessonView'
import TutorDecimalsLesson from './features/decimals/tutor/DecimalsLessonView'
import TutorFactorsLesson from './features/factors/tutor/FactorsLessonView'
import TutorFractionsLesson from './features/fractions/tutor/FractionsLessonView'
import { variantDLesson, variantDMicroSkillLabels } from './features/number-types/variant-d/variantDLesson'
import MathsCourseOverview from './features/maths/MathsCourseOverview'
import MathsContentsDrawer from './features/maths/MathsContentsDrawer'
import { getMathsLesson, isMathsLessonNumber, type MathsLessonNumber } from './features/maths/courseRegistry'
import {
  MATHS_LAST_LESSON_STORAGE_KEY,
  MATHS_PROGRESS_EVENT,
  readMathsProgress,
  type LessonProgressMap,
  type LessonProgressSnapshot,
} from './features/maths/lessonProgress'

type MathsView = 'overview' | 'lesson'

function lessonFromUrl() {
  const value = Number(new URLSearchParams(window.location.search).get('lesson'))
  return isMathsLessonNumber(value) ? value : null
}

function pushLessonQuery(lesson?: MathsLessonNumber) {
  const url = new URL(window.location.href)
  if (lesson) url.searchParams.set('lesson', String(lesson))
  else url.searchParams.delete('lesson')
  window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
}

function App() {
  const [view, setView] = useState<MathsView>('overview')
  const [lesson, setLesson] = useState<MathsLessonNumber>(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [progress, setProgress] = useState<LessonProgressMap>({})
  const [lastLesson, setLastLesson] = useState<MathsLessonNumber>(1)
  const contentsButtonRef = useRef<HTMLButtonElement>(null)
  const currentLesson = getMathsLesson(lesson)

  useEffect(() => {
    setProgress(readMathsProgress())
    const storedLastLesson = Number(window.localStorage.getItem(MATHS_LAST_LESSON_STORAGE_KEY))
    if (isMathsLessonNumber(storedLastLesson)) setLastLesson(storedLastLesson)

    function syncFromUrl() {
      const selectedLesson = lessonFromUrl()
      if (selectedLesson) {
        setLesson(selectedLesson)
        setLastLesson(selectedLesson)
        window.localStorage.setItem(MATHS_LAST_LESSON_STORAGE_KEY, String(selectedLesson))
        setView('lesson')
      } else {
        setView('overview')
      }
      setDrawerOpen(false)
    }

    function updateProgress(event: Event) {
      const snapshot = (event as CustomEvent<LessonProgressSnapshot>).detail
      if (!snapshot) return
      setProgress(current => ({ ...current, [snapshot.lessonId]: snapshot }))
    }

    syncFromUrl()
    window.addEventListener('popstate', syncFromUrl)
    window.addEventListener(MATHS_PROGRESS_EVENT, updateProgress)
    return () => {
      window.removeEventListener('popstate', syncFromUrl)
      window.removeEventListener(MATHS_PROGRESS_EVENT, updateProgress)
    }
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    window.requestAnimationFrame(() => contentsButtonRef.current?.focus())
  }, [])

  const openLesson = useCallback((number: MathsLessonNumber) => {
    setLesson(number)
    setLastLesson(number)
    setView('lesson')
    setDrawerOpen(false)
    window.localStorage.setItem(MATHS_LAST_LESSON_STORAGE_KEY, String(number))
    pushLessonQuery(number)
  }, [])

  const showOverview = useCallback(() => {
    setView('overview')
    setDrawerOpen(false)
    pushLessonQuery()
  }, [])

  const selectLessonFromDrawer = useCallback((number: MathsLessonNumber) => {
    openLesson(number)
    window.requestAnimationFrame(() => contentsButtonRef.current?.focus())
  }, [openLesson])

  return <div className={`app-shell ${view === 'lesson' ? 'app-shell--lesson app-shell--study' : 'app-shell--course'}`}>
    <header className="site-header">
      <a className="brand" href="/" aria-label="Revily home">
        <span className="brand-mark" aria-hidden="true">R</span>
        {view === 'overview' && <span>Revily</span>}
      </a>

      {view === 'overview' ? <span className="prototype-label">GCSE Foundation Maths</span> : <>
        <nav className="maths-breadcrumbs" aria-label="Breadcrumb">
          <button type="button" onClick={showOverview}>Maths</button>
          <span aria-hidden="true">/</span>
          <span>Number</span>
          <span aria-hidden="true">/</span>
          <span className="maths-breadcrumb-number" aria-current="page">{currentLesson.title}</span>
        </nav>
        <button
          ref={contentsButtonRef}
          className="maths-contents-button"
          type="button"
          aria-expanded={drawerOpen}
          aria-controls="maths-contents"
          onClick={() => setDrawerOpen(true)}
        >Contents</button>
      </>}
    </header>

    {view === 'overview'
      ? <MathsCourseOverview progress={progress} lastLesson={lastLesson} onOpenLesson={openLesson} />
      : <main className="lesson-preview" id="main-content">{renderLesson(lesson)}</main>}

    <MathsContentsDrawer
      open={view === 'lesson' && drawerOpen}
      currentLesson={currentLesson}
      progress={progress}
      onClose={closeDrawer}
      onSelectLesson={selectLessonFromDrawer}
      onShowAll={showOverview}
    />
  </div>
}

function renderLesson(lesson: MathsLessonNumber) {
  switch (lesson) {
    case 1:
      return <NumberTypesLesson focusMode lesson={variantDLesson} labels={variantDMicroSkillLabels} />
    case 2:
      return <OperationsVariantCLesson />
    case 3:
      return <TutorPlaceValueLesson />
    case 4:
      return <TutorLongMultiplicationLesson />
    case 5:
      return <TutorLongDivisionLesson />
    case 6:
      return <TutorDecimalsLesson />
    case 7:
      return <TutorFactorsLesson />
    case 8:
      return <TutorFractionsLesson />
  }
}

export default App

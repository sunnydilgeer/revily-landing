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
import TutorFractionsDecimalsPercentagesLesson from './features/fractions-decimals-percentages/tutor/FractionsDecimalsPercentagesLessonView'
import TutorRoundingLesson from './features/rounding/tutor/RoundingLessonView'
import TutorOrderingLesson from './features/ordering/tutor/OrderingLessonView'
import TutorEstimatingLesson from './features/estimating/tutor/EstimatingLessonView'
import TutorBoundsLesson from './features/bounds/tutor/BoundsLessonView'
import { variantDLesson, variantDMicroSkillLabels } from './features/number-types/variant-d/variantDLesson'
import Curriculum from './features/maths/Curriculum'
import AppShell, { sectionHref, type AppSection } from './features/maths/AppShell'
import ComingSoon from './features/maths/ComingSoon'
import LabsHome from './features/maths/labs/LabsHome'
import PracticeHome from './features/maths/practice/PracticeHome'
import RevisionCards from './features/cards/RevisionCards'
import { useStudySummary, useStudyTimer } from './features/maths/useStudy'
import { readLastSubject, saveLastSubject, subjectFromUrl, type Subject } from './features/maths/subject'
import dynamic from 'next/dynamic'
import { RevilyLogo } from './ui'
import MathsContentsDrawer from './features/maths/MathsContentsDrawer'
import { getMathsLesson, isMathsLessonNumber, type MathsLessonNumber } from './features/maths/courseRegistry'
import {
  MATHS_LAST_LESSON_STORAGE_KEY,
  MATHS_PROGRESS_EVENT,
  readMathsProgress,
  type LessonProgressMap,
  type LessonProgressSnapshot,
} from './features/maths/lessonProgress'

// Science carries its whole lesson catalogue, so Maths students don't download it until they switch.
const ScienceCurriculum = dynamic(() => import('./features/science/ScienceCurriculum'), { ssr: false })
const ScienceCards = dynamic(() => import('./features/science/cards/ScienceCards'), { ssr: false })

type MathsView = 'overview' | 'lesson' | 'cards' | 'practice' | 'lab'

function sectionFromUrl(): MathsView {
  const value = new URLSearchParams(window.location.search).get('view')
  return value === 'cards' || value === 'practice' || value === 'lab' ? value : 'overview'
}

function lessonFromUrl() {
  const value = Number(new URLSearchParams(window.location.search).get('lesson'))
  return isMathsLessonNumber(value) ? value : null
}

function pushLessonQuery(lesson?: MathsLessonNumber, section?: 'cards' | 'practice') {
  const url = new URL(window.location.href)
  url.searchParams.delete('view')
  url.searchParams.delete('subject')
  if (lesson) url.searchParams.set('lesson', String(lesson))
  else url.searchParams.delete('lesson')
  if (section) url.searchParams.set('view', section)
  window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
}

function App() {
  const [view, setView] = useState<MathsView>('overview')
  const [lesson, setLesson] = useState<MathsLessonNumber>(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [progress, setProgress] = useState<LessonProgressMap>({})
  const [lastLesson, setLastLesson] = useState<MathsLessonNumber>(1)
  const [subject, setSubject] = useState<Subject>('maths')
  const contentsButtonRef = useRef<HTMLButtonElement>(null)
  const currentLesson = getMathsLesson(lesson)
  const study = useStudySummary()
  useStudyTimer(view === 'cards' || (subject === 'maths' && view === 'lesson'), subject)

  useEffect(() => {
    setProgress(readMathsProgress())
    const storedLastLesson = Number(window.localStorage.getItem(MATHS_LAST_LESSON_STORAGE_KEY))
    if (isMathsLessonNumber(storedLastLesson)) setLastLesson(storedLastLesson)

    // Memory only picks the subject on first load. Science addresses always say subject=science,
    // so on Back/Forward an address without it is Maths.
    function syncFromUrl(firstLoad = false) {
      const urlSubject = subjectFromUrl(window.location.search, firstLoad ? readLastSubject() : 'maths')
      setSubject(urlSubject)
      saveLastSubject(urlSubject)
      if (urlSubject === 'science') {
        // Reopening on Science from a bare /preview: make the address say so, without a new history entry.
        const url = new URL(window.location.href)
        if (url.searchParams.get('subject') !== 'science') {
          url.searchParams.set('subject', 'science')
          window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
        }
        setView(sectionFromUrl())
        setDrawerOpen(false)
        return
      }
      const selectedLesson = lessonFromUrl()
      if (selectedLesson) {
        setLesson(selectedLesson)
        setLastLesson(selectedLesson)
        window.localStorage.setItem(MATHS_LAST_LESSON_STORAGE_KEY, String(selectedLesson))
        setView('lesson')
      } else {
        setView(sectionFromUrl())
      }
      setDrawerOpen(false)
    }

    function updateProgress(event: Event) {
      const snapshot = (event as CustomEvent<LessonProgressSnapshot>).detail
      if (!snapshot) return
      setProgress(current => ({ ...current, [snapshot.lessonId]: snapshot }))
    }

    syncFromUrl(true)
    const onPopState = () => syncFromUrl()
    window.addEventListener('popstate', onPopState)
    window.addEventListener(MATHS_PROGRESS_EVENT, updateProgress)
    return () => {
      window.removeEventListener('popstate', onPopState)
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

  const navigate = useCallback((section: AppSection) => {
    setDrawerOpen(false)
    setView(section === 'curriculum' ? 'overview' : section)
    window.history.pushState({}, '', sectionHref(subject, section))
    window.scrollTo({ top: 0 })
  }, [subject])

  const switchSubject = useCallback((next: Subject) => {
    setSubject(next)
    saveLastSubject(next)
    setView('overview')
    setDrawerOpen(false)
    window.history.pushState({}, '', sectionHref(next, 'curriculum'))
    window.scrollTo({ top: 0 })
  }, [])

  const selectLessonFromDrawer = useCallback((number: MathsLessonNumber) => {
    openLesson(number)
    window.requestAnimationFrame(() => contentsButtonRef.current?.focus())
  }, [openLesson])

  if (subject === 'science' || view !== 'lesson') {
    const active: AppSection = view === 'overview' || view === 'lesson' ? 'curriculum' : view
    return <div className="app-shell app-shell--course">
      <AppShell active={active} onNavigate={navigate} study={study} subject={subject} onSwitchSubject={switchSubject}>
        {subject === 'science'
          ? active === 'curriculum'
            ? <ScienceCurriculum study={study} />
            : active === 'cards'
              ? <ScienceCards onOpenCurriculum={() => navigate('curriculum')} />
              : <ComingSoon section={active} subject="science" onBack={() => navigate('curriculum')} />
          : view === 'overview'
            ? <Curriculum progress={progress} lastLesson={lastLesson} study={study} onOpenLesson={openLesson} />
            : view === 'cards'
              ? <RevisionCards progress={progress} onOpenCurriculum={() => navigate('curriculum')} />
              : view === 'lab'
                ? <LabsHome />
                : <PracticeHome />}
      </AppShell>
    </div>
  }

  return <div className="app-shell app-shell--lesson app-shell--study">
    <header className="site-header">
      <RevilyLogo wordmark={false} size={24} href="/preview" />
      <nav className="maths-breadcrumbs" aria-label="Breadcrumb">
        <button type="button" onClick={showOverview}>Curriculum</button>
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
    </header>

    <main className="lesson-preview" id="main-content">{renderLesson(lesson)}</main>

    <MathsContentsDrawer
      open={drawerOpen}
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
    case 9:
      return <TutorFractionsDecimalsPercentagesLesson />
    case 10:
      return <TutorRoundingLesson />
    case 11:
      return <TutorOrderingLesson />
    case 12:
      return <TutorEstimatingLesson />
    case 13:
      return <TutorBoundsLesson />
  }
}

export default App

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
import TutorStandardFormLesson from './features/standard-form/tutor/StandardFormLessonView'
import TutorLikeTermsLesson from './features/like-terms/tutor/LikeTermsLessonView'
import TutorIndicesLesson from './features/indices/tutor/IndicesLessonView'
import TutorExpandingLesson from './features/expanding/tutor/ExpandingLessonView'
import TutorFactorisingLesson from './features/factorising/tutor/FactorisingLessonView'
import TutorEquationsLesson from './features/equations/tutor/EquationsLessonView'
import TutorRearrangingLesson from './features/rearranging/tutor/RearrangingLessonView'
import TutorQuadraticsLesson from './features/quadratics/tutor/QuadraticsLessonView'
import TutorQuadraticEquationsLesson from './features/quadratic-equations/tutor/QuadraticEquationsLessonView'
import TutorSequencesLesson from './features/sequences/tutor/SequencesLessonView'
import TutorInequalitiesLesson from './features/inequalities/tutor/InequalitiesLessonView'
import TutorSolvingInequalitiesLesson from './features/solving-inequalities/tutor/SolvingInequalitiesLessonView'
import TutorSimultaneousEquationsLesson from './features/simultaneous-equations/tutor/SimultaneousEquationsLessonView'
import TutorProofLesson from './features/proof/tutor/ProofLessonView'
import TutorFunctionMachinesLesson from './features/function-machines/tutor/FunctionMachinesLessonView'
import TutorRatioLesson from './features/ratio/tutor/RatioLessonView'
import TutorProportionLesson from './features/ratio/tutor/ProportionLessonView'
import TutorPercentLesson from './features/ratio/tutor/PercentLessonView'
import TutorReversePercentLesson from './features/ratio/tutor/ReversePercentLessonView'
import TutorInterestLesson from './features/ratio/tutor/InterestLessonView'
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
import { CloseIcon, ContentsIcon } from './ui/icons'
import { useLessonFrame } from './features/maths/lessonFrame'
import { LessonBarSlot } from './features/maths/rungs'
import MathsContentsDrawer from './features/maths/MathsContentsDrawer'
import { getMathsLesson, isMathsLessonNumber, type MathsLessonNumber, type MathsSection } from './features/maths/courseRegistry'
import {
  MATHS_LAST_LESSON_STORAGE_KEY,
  MATHS_PROGRESS_EVENT,
  readMathsProgress,
  requestMathsState,
  type LessonProgressMap,
  type LessonProgressSnapshot,
} from './features/maths/lessonProgress'

// Science carries its whole lesson catalogue, so Maths students don't download it until they switch.
const ScienceCurriculum = dynamic(() => import('./features/science/ScienceCurriculum'), { ssr: false })
const ScienceCards = dynamic(() => import('./features/science/cards/ScienceCards'), { ssr: false })
const ScienceLabsHome = dynamic(() => import('./features/science/labs/ScienceLabsHome'), { ssr: false })

type MathsView = 'overview' | 'lesson' | 'cards' | 'practice' | 'lab'

function sectionFromUrl(): MathsView {
  const value = new URLSearchParams(window.location.search).get('view')
  return value === 'cards' || value === 'practice' || value === 'lab' ? value : 'overview'
}

function lessonFromUrl() {
  const value = Number(new URLSearchParams(window.location.search).get('lesson'))
  return isMathsLessonNumber(value) ? value : null
}

function pushLessonQuery(lesson?: MathsLessonNumber, section?: 'cards' | 'practice', skill?: string) {
  const url = new URL(window.location.href)
  url.searchParams.delete('view')
  url.searchParams.delete('subject')
  if (lesson) url.searchParams.set('lesson', String(lesson))
  else url.searchParams.delete('lesson')
  // The lesson opens at this skill (its engine reads ?section= once, then removes it).
  if (skill) url.searchParams.set('section', skill)
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
  // The lesson's section title and progress draw into the top bar (see LessonBarSlot in rungs.tsx).
  const [barSlot, setBarSlot] = useState<HTMLDivElement | null>(null)
  // The lesson page is one fixed screen; a card taller than its space scrolls inside (see lessonFrame.ts).
  const [mainEl, setMainEl] = useState<HTMLElement | null>(null)
  useLessonFrame(mainEl)
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

  const openLesson = useCallback((number: MathsLessonNumber, skill?: string) => {
    setLesson(number)
    setLastLesson(number)
    setView('lesson')
    setDrawerOpen(false)
    window.localStorage.setItem(MATHS_LAST_LESSON_STORAGE_KEY, String(number))
    pushLessonQuery(number, undefined, skill)
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

  // A skill in the open lesson moves within it; a skill in another lesson opens that lesson at the skill.
  const selectSkillFromDrawer = useCallback((number: MathsLessonNumber, section: MathsSection) => {
    if (number === lesson) requestMathsState(getMathsLesson(number).lessonId, section.startStateId)
    else openLesson(number, section.id)
    window.requestAnimationFrame(() => contentsButtonRef.current?.focus())
  }, [lesson, openLesson])

  if (subject === 'science' || view !== 'lesson') {
    const active: AppSection = view === 'overview' || view === 'lesson' ? 'curriculum' : view
    return <div className="app-shell app-shell--course">
      <AppShell active={active} onNavigate={navigate} study={study} subject={subject} onSwitchSubject={switchSubject}>
        {subject === 'science'
          ? active === 'curriculum'
            ? <ScienceCurriculum />
            : active === 'cards'
              ? <ScienceCards onOpenCurriculum={() => navigate('curriculum')} />
              : active === 'lab'
                ? <ScienceLabsHome />
                : <ComingSoon section={active} subject="science" onBack={() => navigate('curriculum')} />
          : view === 'overview'
            ? <Curriculum progress={progress} lastLesson={lastLesson} onOpenLesson={openLesson} />
            : view === 'cards'
              ? <RevisionCards progress={progress} onOpenCurriculum={() => navigate('curriculum')} />
              : view === 'lab'
                ? <LabsHome />
                : <PracticeHome />}
      </AppShell>
    </div>
  }

  return <div className="app-shell app-shell--lesson app-shell--study app-shell--frame">
    <header className="site-header lesson-bar">
      <nav className="lesson-bar__crumbs" aria-label="Breadcrumb">
        <button type="button" className="lesson-bar__close" onClick={showOverview} aria-label="Close the lesson and go back to Chapters"><CloseIcon size={22} /></button>
        <span className="sr-only" aria-current="page">{currentLesson.title}</span>
      </nav>
      <div className="lesson-bar__slot" ref={setBarSlot} />
      <button
        ref={contentsButtonRef}
        className="maths-contents-button lesson-bar__contents"
        type="button"
        aria-expanded={drawerOpen}
        aria-controls="maths-contents"
        onClick={() => setDrawerOpen(true)}
      ><ContentsIcon size={20} /><span>Contents</span></button>
    </header>

    <LessonBarSlot.Provider value={barSlot}><main ref={setMainEl} className="lesson-preview" id="main-content">{renderLesson(lesson)}</main></LessonBarSlot.Provider>

    <MathsContentsDrawer
      open={drawerOpen}
      currentLesson={currentLesson}
      progress={progress}
      onClose={closeDrawer}
      onSelectLesson={selectLessonFromDrawer}
      onSelectSkill={selectSkillFromDrawer}
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
    case 14:
      return <TutorStandardFormLesson />
    case 15:
      return <TutorLikeTermsLesson />
    case 16:
      return <TutorIndicesLesson />
    case 17:
      return <TutorExpandingLesson />
    case 18:
      return <TutorFactorisingLesson />
    case 19:
      return <TutorEquationsLesson />
    case 20:
      return <TutorRearrangingLesson />
    case 21:
      return <TutorQuadraticsLesson />
    case 22:
      return <TutorQuadraticEquationsLesson />
    case 23:
      return <TutorSequencesLesson />
    case 24:
      return <TutorInequalitiesLesson />
    case 25:
      return <TutorSolvingInequalitiesLesson />
    case 27:
      return <TutorSimultaneousEquationsLesson />
    case 28:
      return <TutorProofLesson />
    case 29:
      return <TutorFunctionMachinesLesson />
    case 30:
      return <TutorRatioLesson />
    case 31:
      return <TutorProportionLesson />
    case 32:
      return <TutorPercentLesson />
    case 33:
      return <TutorReversePercentLesson />
    case 34:
      return <TutorInterestLesson />
  }
}

export default App

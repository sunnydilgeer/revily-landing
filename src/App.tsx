'use client'

import { useRef, useState } from 'react'
import './App.css'
import NumberTypesLesson from './features/number-types/NumberTypesLessonView'
import OperationsVariantCLesson from './features/order-of-operations/variant-c/VariantCLessonView'
import TutorPlaceValueLesson from './features/place-value/tutor/PlaceValueLessonView'
import TutorLongMultiplicationLesson from './features/long-multiplication/tutor/LongMultiplicationLessonView'
import TutorLongDivisionLesson from './features/long-division/tutor/LongDivisionLessonView'
import TutorDecimalsLesson from './features/decimals/tutor/DecimalsLessonView'
import TutorFactorsLesson from './features/factors/tutor/FactorsLessonView'
import { variantDLesson, variantDMicroSkillLabels } from './features/number-types/variant-d/variantDLesson'

function App() {
  const [lesson, setLesson] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(6)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const focusMode = true
  function chooseLesson(value: 1 | 2 | 3 | 4 | 5 | 6 | 7) {
    setLesson(value)
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }
  const lessonNavigation = <nav className="preview-lesson-nav" aria-label="Preview lesson">
    {([1, 2, 3, 4, 5, 6, 7] as const).map(value => <button key={value} type="button" className={lesson === value ? 'is-active' : ''} onClick={() => chooseLesson(value)}>Lesson {value}</button>)}
  </nav>
  return (
    <div className={`app-shell app-shell--lesson${focusMode ? ' app-shell--study' : ''}`} onKeyDown={event => {
      if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButtonRef.current?.focus() }
    }}>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Revily home">
          <span className="brand-mark" aria-hidden="true">R</span>
          {!focusMode && <span>Revily</span>}
        </a>
        {focusMode ? <button ref={menuButtonRef} type="button" className="study-menu-toggle" aria-expanded={menuOpen} aria-controls="study-menu" onClick={() => setMenuOpen(open => !open)}>Lesson menu <span aria-hidden="true">{menuOpen ? '−' : '+'}</span></button> : lessonNavigation}
      </header>
      {focusMode && menuOpen && <div className="study-menu" id="study-menu">
        {lessonNavigation}
        <button type="button" className="study-menu-close" onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus() }}>Back to lesson</button>
      </div>}
      <main className="lesson-preview">
        {lesson === 1 ? (
          <NumberTypesLesson
            focusMode
            lesson={variantDLesson}
            labels={variantDMicroSkillLabels}
          />
        ) : lesson === 2 ? <OperationsVariantCLesson /> : lesson === 3 ? <TutorPlaceValueLesson /> : lesson === 4 ? <TutorLongMultiplicationLesson /> : lesson === 5 ? <TutorLongDivisionLesson /> : lesson === 6 ? <TutorDecimalsLesson /> : <TutorFactorsLesson />}
      </main>
    </div>
  )
}

export default App

'use client'

import { useRef, useState } from 'react'
import './App.css'
import NumberTypesLesson from './features/number-types/NumberTypesLessonView'
import OperationsVariantCLesson from './features/order-of-operations/variant-c/VariantCLessonView'
import PlaceValueLesson from './features/place-value/PlaceValueLessonView'
import PlaceValueVariantBLesson from './features/place-value/variant-b/VariantBLessonView'
import ShortDivisionVariantBLesson from './features/short-division/variant-b/VariantBLessonView'
import LongMultiplicationVariantBLesson from './features/long-multiplication/variant-b/VariantBLessonView'
import ShortDivisionLesson from './features/short-division/ShortDivisionLessonView'
import LongMultiplicationLesson from './features/long-multiplication/LongMultiplicationLessonView'
import DecimalsLesson from './features/decimals/DecimalsLessonView'
import { variantDLesson, variantDMicroSkillLabels } from './features/number-types/variant-d/variantDLesson'

function App() {
  const [lesson, setLesson] = useState<1 | 2 | 3 | 4 | 5 | 6>(6)
  const [placeValueVariant, setPlaceValueVariant] = useState<'a' | 'b'>('b')
  const [divisionVariant, setDivisionVariant] = useState<'a' | 'b'>('b')
  const [multiplicationVariant, setMultiplicationVariant] = useState<'a' | 'b'>('b')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const focusMode = lesson === 1 || lesson === 2 || (lesson === 3 && placeValueVariant === 'b') || (lesson === 4 && divisionVariant === 'b') || (lesson === 5 && multiplicationVariant === 'b')
  function chooseLesson(value: 1 | 2 | 3 | 4 | 5 | 6) {
    setLesson(value)
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }
  const lessonNavigation = <nav className="preview-lesson-nav" aria-label="Preview lesson">
    {([1, 2, 3, 4, 5, 6] as const).map(value => <button key={value} type="button" className={lesson === value ? 'is-active' : ''} onClick={() => chooseLesson(value)}>Lesson {value}</button>)}
  </nav>
  const variantNavigation = lesson === 3 || lesson === 4 || lesson === 5 ? <nav className="preview-variant-nav" aria-label={`Choose Lesson ${lesson} variant`}>
    <span>Lesson {lesson} approach</span>
    <div>{(['a', 'b'] as const).map(value => <button key={value} type="button" aria-pressed={(lesson === 3 ? placeValueVariant : lesson === 4 ? divisionVariant : multiplicationVariant) === value} onClick={() => {
      if (lesson === 3) setPlaceValueVariant(value)
      else if (lesson === 4) setDivisionVariant(value)
      else setMultiplicationVariant(value)
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }}><strong>{value.toUpperCase()}</strong> {value === 'a' ? 'Current' : 'Step by step'}</button>)}</div>
  </nav> : null
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
        {variantNavigation}
        <button type="button" className="study-menu-close" onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus() }}>Back to lesson</button>
      </div>}
      <main className="lesson-preview">
        {!focusMode && variantNavigation}
        {lesson === 1 ? (
          <NumberTypesLesson
            focusMode
            lesson={variantDLesson}
            labels={variantDMicroSkillLabels}
          />
        ) : lesson === 2 ? <OperationsVariantCLesson /> : lesson === 3 ? placeValueVariant === 'b' ? <PlaceValueVariantBLesson /> : <PlaceValueLesson /> : lesson === 4 ? divisionVariant === 'b' ? <ShortDivisionVariantBLesson /> : <ShortDivisionLesson /> : lesson === 5 ? multiplicationVariant === 'b' ? <LongMultiplicationVariantBLesson /> : <LongMultiplicationLesson /> : <DecimalsLesson />}
      </main>
    </div>
  )
}

export default App

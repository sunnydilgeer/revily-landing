'use client'

import { useRef, useState } from 'react'
import './App.css'
import NumberTypesLesson from './features/number-types/NumberTypesLessonView'
import OrderOfOperationsLesson from './features/order-of-operations/OrderOfOperationsLessonView'
import OperationsVariantBLesson from './features/order-of-operations/variant-b/VariantBLessonView'
import PlaceValueLesson from './features/place-value/PlaceValueLessonView'
import PlaceValueVariantBLesson from './features/place-value/variant-b/VariantBLessonView'
import ShortDivisionVariantBLesson from './features/short-division/variant-b/VariantBLessonView'
import LongMultiplicationVariantBLesson from './features/long-multiplication/variant-b/VariantBLessonView'
import ShortDivisionLesson from './features/short-division/ShortDivisionLessonView'
import LongMultiplicationLesson from './features/long-multiplication/LongMultiplicationLessonView'
import DecimalsLesson from './features/decimals/DecimalsLessonView'
import { numberTypesLesson } from './features/number-types/numberTypesLesson'
import { variantBLesson, variantBMicroSkillLabels } from './features/number-types/variant-b/variantBLesson'
import { variantDLesson, variantDMicroSkillLabels } from './features/number-types/variant-d/variantDLesson'

function App() {
  const [lesson, setLesson] = useState<1 | 2 | 3 | 4 | 5 | 6>(6)
  const [numberVariant, setNumberVariant] = useState<'a' | 'b' | 'd'>('b')
  const [operationsVariant, setOperationsVariant] = useState<'a' | 'b'>('b')
  const [placeValueVariant, setPlaceValueVariant] = useState<'a' | 'b'>('b')
  const [divisionVariant, setDivisionVariant] = useState<'a' | 'b'>('b')
  const [multiplicationVariant, setMultiplicationVariant] = useState<'a' | 'b'>('b')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const focusMode = (lesson === 1 && numberVariant === 'd') || (lesson === 2 && operationsVariant === 'b') || (lesson === 3 && placeValueVariant === 'b') || (lesson === 4 && divisionVariant === 'b') || (lesson === 5 && multiplicationVariant === 'b')
  function chooseLesson(value: 1 | 2 | 3 | 4 | 5 | 6) {
    setLesson(value)
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }
  function chooseVariant(value: 'a' | 'b' | 'd') {
    setNumberVariant(value)
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }
  const lessonNavigation = <nav className="preview-lesson-nav" aria-label="Preview lesson">
    {([1, 2, 3, 4, 5, 6] as const).map(value => <button key={value} type="button" className={lesson === value ? 'is-active' : ''} onClick={() => chooseLesson(value)}>Lesson {value}</button>)}
  </nav>
  const variantNavigation = lesson === 2 || lesson === 3 || lesson === 4 || lesson === 5 ? <nav className="preview-variant-nav" aria-label={`Choose Lesson ${lesson} variant`}>
    <span>Lesson {lesson} approach</span>
    <div>{(['a', 'b'] as const).map(value => <button key={value} type="button" aria-pressed={(lesson === 2 ? operationsVariant : lesson === 3 ? placeValueVariant : lesson === 4 ? divisionVariant : multiplicationVariant) === value} onClick={() => {
      if (lesson === 2) setOperationsVariant(value)
      else if (lesson === 3) setPlaceValueVariant(value)
      else if (lesson === 4) setDivisionVariant(value)
      else setMultiplicationVariant(value)
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }}><strong>{value.toUpperCase()}</strong> {value === 'a' ? 'Current' : 'Step by step'}</button>)}</div>
  </nav> : lesson === 1 && <nav className="preview-variant-nav" aria-label="Choose Lesson 1 variant">
    <span>Lesson 1 approach</span>
    <div>
      <button type="button" aria-pressed={numberVariant === 'a'} onClick={() => chooseVariant('a')}><strong>A</strong> Current</button>
      <button type="button" aria-pressed={numberVariant === 'b'} onClick={() => chooseVariant('b')}><strong>B</strong> Nested sets</button>
      <button type="button" aria-pressed={numberVariant === 'd'} onClick={() => chooseVariant('d')}><strong>D</strong> Anushka</button>
    </div>
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
        {variantNavigation}
        <button type="button" className="study-menu-close" onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus() }}>Back to lesson</button>
      </div>}
      <main className="lesson-preview">
        {!focusMode && variantNavigation}
        {lesson === 1 ? (
          <NumberTypesLesson
            key={numberVariant}
            focusMode={focusMode}
            lesson={numberVariant === 'a' ? numberTypesLesson : numberVariant === 'b' ? variantBLesson : variantDLesson}
            labels={numberVariant === 'a' ? undefined : numberVariant === 'b' ? variantBMicroSkillLabels : variantDMicroSkillLabels}
            variantLabel={`Variant ${numberVariant.toUpperCase()}`}
          />
        ) : lesson === 2 ? operationsVariant === 'b' ? <OperationsVariantBLesson /> : <OrderOfOperationsLesson /> : lesson === 3 ? placeValueVariant === 'b' ? <PlaceValueVariantBLesson /> : <PlaceValueLesson /> : lesson === 4 ? divisionVariant === 'b' ? <ShortDivisionVariantBLesson /> : <ShortDivisionLesson /> : lesson === 5 ? multiplicationVariant === 'b' ? <LongMultiplicationVariantBLesson /> : <LongMultiplicationLesson /> : <DecimalsLesson />}
      </main>
    </div>
  )
}

export default App

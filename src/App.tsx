'use client'

import { useRef, useState } from 'react'
import './App.css'
import NumberTypesLesson from './features/number-types/NumberTypesLessonView'
import OrderOfOperationsLesson from './features/order-of-operations/OrderOfOperationsLessonView'
import PlaceValueLesson from './features/place-value/PlaceValueLessonView'
import ShortDivisionLesson from './features/short-division/ShortDivisionLessonView'
import LongMultiplicationLesson from './features/long-multiplication/LongMultiplicationLessonView'
import DecimalsLesson from './features/decimals/DecimalsLessonView'
import { numberTypesLesson } from './features/number-types/numberTypesLesson'
import { variantBLesson, variantBMicroSkillLabels } from './features/number-types/variant-b/variantBLesson'
import { variantDLesson, variantDMicroSkillLabels } from './features/number-types/variant-d/variantDLesson'

function App() {
  const [lesson, setLesson] = useState<1 | 2 | 3 | 4 | 5 | 6>(6)
  const [numberVariant, setNumberVariant] = useState<'a' | 'b' | 'd'>('b')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const focusMode = lesson === 1 && numberVariant === 'd'
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
  const variantNavigation = lesson === 1 && <nav className="preview-variant-nav" aria-label="Choose Lesson 1 variant">
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
        ) : lesson === 2 ? <OrderOfOperationsLesson /> : lesson === 3 ? <PlaceValueLesson /> : lesson === 4 ? <ShortDivisionLesson /> : lesson === 5 ? <LongMultiplicationLesson /> : <DecimalsLesson />}
      </main>
    </div>
  )
}

export default App

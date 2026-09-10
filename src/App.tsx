'use client'

import { useState } from 'react'
import './App.css'
import NumberTypesLesson from './features/number-types/NumberTypesLessonView'
import OrderOfOperationsLesson from './features/order-of-operations/OrderOfOperationsLessonView'
import PlaceValueLesson from './features/place-value/PlaceValueLessonView'
import ShortDivisionLesson from './features/short-division/ShortDivisionLessonView'
import LongMultiplicationLesson from './features/long-multiplication/LongMultiplicationLessonView'
import DecimalsLesson from './features/decimals/DecimalsLessonView'
import { numberTypesLesson } from './features/number-types/numberTypesLesson'
import { variantBLesson, variantBMicroSkillLabels } from './features/number-types/variant-b/variantBLesson'

function App() {
  const [lesson, setLesson] = useState<1 | 2 | 3 | 4 | 5 | 6>(6)
  const [numberVariant, setNumberVariant] = useState<'a' | 'b'>('b')
  return (
    <div className="app-shell app-shell--lesson">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Revily home">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span>Revily</span>
        </a>
        <nav className="preview-lesson-nav" aria-label="Preview lesson">
          <button type="button" className={lesson === 1 ? 'is-active' : ''} onClick={() => setLesson(1)}>Lesson 1</button>
          <button type="button" className={lesson === 2 ? 'is-active' : ''} onClick={() => setLesson(2)}>Lesson 2</button>
          <button type="button" className={lesson === 3 ? 'is-active' : ''} onClick={() => setLesson(3)}>Lesson 3</button>
          <button type="button" className={lesson === 4 ? 'is-active' : ''} onClick={() => setLesson(4)}>Lesson 4</button>
          <button type="button" className={lesson === 5 ? 'is-active' : ''} onClick={() => setLesson(5)}>Lesson 5</button>
          <button type="button" className={lesson === 6 ? 'is-active' : ''} onClick={() => setLesson(6)}>Lesson 6</button>
        </nav>
      </header>

      <main className="lesson-preview">
        {lesson === 1 && (
          <nav className="preview-variant-nav" aria-label="Choose Lesson 1 variant">
            <span>Lesson 1 approach</span>
            <div>
              <button type="button" aria-pressed={numberVariant === 'a'} onClick={() => setNumberVariant('a')}><strong>A</strong> Current</button>
              <button type="button" aria-pressed={numberVariant === 'b'} onClick={() => setNumberVariant('b')}><strong>B</strong> Nested sets</button>
            </div>
          </nav>
        )}
        {lesson === 1 ? (
          <NumberTypesLesson
            key={numberVariant}
            lesson={numberVariant === 'a' ? numberTypesLesson : variantBLesson}
            labels={numberVariant === 'a' ? undefined : variantBMicroSkillLabels}
            variantLabel={`Variant ${numberVariant.toUpperCase()}`}
          />
        ) : lesson === 2 ? <OrderOfOperationsLesson /> : lesson === 3 ? <PlaceValueLesson /> : lesson === 4 ? <ShortDivisionLesson /> : lesson === 5 ? <LongMultiplicationLesson /> : <DecimalsLesson />}
      </main>
    </div>
  )
}

export default App

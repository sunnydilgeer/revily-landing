import './App.css'
import NumberTypesLesson from './features/number-types/NumberTypesLessonView'

function App() {
  return (
    <div className="app-shell app-shell--lesson">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Revily home">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span>Revily</span>
        </a>
        <span className="prototype-label">GCSE Foundation · Lesson 1</span>
      </header>

      <main className="lesson-preview">
        <NumberTypesLesson />
      </main>
    </div>
  )
}

export default App

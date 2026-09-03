import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Revily home">
          <span className="brand-mark" aria-hidden="true">
            R
          </span>
          <span>Revily</span>
        </a>

        <span className="prototype-label">Foundation prototype</span>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">GCSE Foundation Maths</p>

            <h1>Learn maths by doing.</h1>

            <p className="hero-description">
              Explore ideas, make predictions and understand why the maths
              works—before memorising the method.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#prototype">
                See the first lesson
              </a>

              <a className="button button-secondary" href="#principles">
                How Revily teaches
              </a>
            </div>
          </div>

          <div className="concept-card" aria-label="Equation balance preview">
            <div className="concept-card-header">
              <span>Equation balance</span>
              <span className="status-pill">Coming next</span>
            </div>

            <div className="equation-preview" aria-hidden="true">
              <div className="equation-side">
                <span className="math-tile math-tile-variable">x</span>
                <span className="math-symbol">+</span>
                <span className="math-tile">3</span>
              </div>

              <span className="equals-sign">=</span>

              <div className="equation-side">
                <span className="math-tile math-tile-answer">8</span>
              </div>
            </div>

            <p>
              What can you remove from both sides while keeping the equation
              balanced?
            </p>
          </div>
        </section>

        <section className="prototype-section" id="prototype">
          <div>
            <p className="eyebrow">Prototype 01</p>
            <h2>Equality as balance</h2>
          </div>

          <p>
            Our first working lesson will let students manipulate both sides of
            an equation and see why performing the same operation preserves
            equality.
          </p>
        </section>

        <section className="principles-section" id="principles">
          <div className="section-heading">
            <p className="eyebrow">Learning progression</p>
            <h2>From understanding to independence</h2>
          </div>

          <ol className="principle-grid">
            <li>
              <span>01</span>
              <h3>Concrete</h3>
              <p>Begin with objects and actions students can make sense of.</p>
            </li>

            <li>
              <span>02</span>
              <h3>Visual</h3>
              <p>Reveal the mathematical relationship through interaction.</p>
            </li>

            <li>
              <span>03</span>
              <h3>Symbolic</h3>
              <p>Fade the support and connect the experience to notation.</p>
            </li>

            <li>
              <span>04</span>
              <h3>Exam</h3>
              <p>Apply the idea independently in GCSE-style problems.</p>
            </li>
          </ol>
        </section>
      </main>

      <footer>
        <span>Revily</span>
        <span>Learn GCSE Maths by doing.</span>
      </footer>
    </div>
  )
}

export default App
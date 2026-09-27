'use client'

import { useEffect, useState } from 'react'
import { labAreas, labCatalog, labTeasers } from './catalog'
import { readBests, type Best } from './kit/Lab'
import './LabsHome.css'

const HOW = [
  { emoji: '🎮', title: 'Play', line: 'Heists, storms, potions, robots, pool and packs: pick a game.' },
  { emoji: '🧠', title: 'Learn the move', line: 'Every answer shows you the working, step by step.' },
  { emoji: '📝', title: 'Bank exam marks', line: 'The same move answers a real GCSE question.' },
]

/** The Arcade (the 'lab' section in code and URLs): games where the maths is the cheat code, each tied to the exam question it trains. */
export default function LabsHome() {
  const [bests, setBests] = useState<Record<string, Best>>({})
  useEffect(() => setBests(readBests()), [])
  const played = labCatalog.filter(lab => bests[lab.id]).length

  return <div className="labs">
    <header className="labs-hero">
      <div className="labs-hero__copy">
        <h1>Games where the maths is the cheat code</h1>
        <p>Beat each game and you’ve practised a real GCSE Maths skill without noticing.</p>
      </div>
      <div className="labs-hero__score" aria-label={`${played} of ${labCatalog.length} games cleared`}>
        <strong>{played}/{labCatalog.length}</strong>
        <span>games cleared</span>
      </div>
    </header>

    <ol className="labs-how" aria-label="How the Arcade works">
      {HOW.map((step, index) => <li key={step.title}>
        <span className="labs-how__emoji" aria-hidden="true">{step.emoji}</span>
        <div>
          <strong><span className="labs-how__n">{index + 1}</span>{step.title}</strong>
          <span>{step.line}</span>
        </div>
      </li>)}
    </ol>

    {labAreas.map(area => <section key={area.id} className="labs-group" aria-labelledby={`labs-${area.id}`}>
      <div className="labs-group__head">
        <h2 id={`labs-${area.id}`}>{area.title}</h2>
        <span className="labs-chip">{area.chip}</span>
      </div>
      <ul className="labs-grid">
        {labCatalog.filter(lab => lab.area === area.id).map(lab => {
          const best = bests[lab.id]
          return <li key={lab.id}>
            <a className={`labs-card labs-card--${lab.id}`} href={lab.href}>
              <div className="labs-card__art">
                <span className="labs-card__emoji" aria-hidden="true">{lab.emoji}</span>
                <span className="labs-card__time">{lab.minutes} min</span>
              </div>
              <div className="labs-card__body">
                <h3>{lab.title}</h3>
                <p className="labs-card__hook">{lab.hook}</p>
                <span className="labs-card__skill">Topic: {lab.skill}</span>
                <dl className="labs-card__bridge">
                  <div><dt>🎮 In the game</dt><dd>{lab.inGame}</dd></div>
                  <div><dt>📝 In the exam</dt><dd>{lab.inExam}</dd></div>
                </dl>
                <div className="labs-card__foot">
                  <span className={`labs-card__best${best ? ' is-set' : ''}`}>{best ? <>{best.badge} Best: {best.name}</> : 'Not played yet'}</span>
                  <span className="labs-card__play">{best ? 'Play again' : 'Play'} →</span>
                </div>
              </div>
            </a>
          </li>
        })}
      </ul>
    </section>)}

    <section className="labs-group" aria-labelledby="labs-soon">
      <div className="labs-group__head">
        <h2 id="labs-soon">Coming soon</h2>
      </div>
      <ul className="labs-soon">
        {labTeasers.map(teaser => <li key={teaser.title}>
          <span className="labs-soon__emoji" aria-hidden="true">{teaser.emoji}</span>
          <div><strong>{teaser.title}</strong><span>{teaser.skill}</span></div>
          <span className="labs-soon__lock" aria-label="Locked">🔒</span>
        </li>)}
      </ul>
    </section>
  </div>
}

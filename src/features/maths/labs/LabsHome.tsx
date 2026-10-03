'use client'

import { useEffect, useState } from 'react'
import { labAreas, labCatalog, labTeasers } from './catalog'
import { readBests, type Best } from './kit/Lab'
import './LabsHome.css'

/** The Arcade (the 'lab' section in code and URLs): games where the maths is the cheat code, each tied to the exam question it trains. */
export default function LabsHome() {
  const [bests, setBests] = useState<Record<string, Best>>({})
  useEffect(() => setBests(readBests()), [])
  const played = labCatalog.filter(lab => bests[lab.id]).length

  return <div className="labs">
    <header className="labs-hero">
      <div className="labs-hero__copy">
        <h1>Games where the maths is the cheat code</h1>
      </div>
      <div className="labs-hero__score" aria-label={`${played} of ${labCatalog.length} games cleared`}>
        <strong>{played}/{labCatalog.length}</strong>
        <span>games cleared</span>
      </div>
    </header>

    {labAreas.map(area => <section key={area.id} className="labs-group" aria-labelledby={`labs-${area.id}`}>
      <div className="labs-group__head">
        <h2 id={`labs-${area.id}`}>{area.title}</h2>
        <span className="labs-chip">{area.chip}</span>
      </div>
      <ul className="labs-grid">
        {labCatalog.filter(lab => lab.area === area.id).map(lab => <li key={lab.id}>
          <a className="labs-card" href={lab.href}>
            <h3>{lab.title}</h3>
            <p className="labs-card__hook">{lab.hook}</p>
            <span className="labs-card__skill">Topic: {lab.skill}</span>
            <span className="labs-card__play">Play →</span>
          </a>
        </li>)}
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

'use client'

import { useEffect, useState } from 'react'
import { readBests, type Best } from '../../maths/labs/kit/Lab'
import { scienceAreas, scienceLabCatalog } from './catalog'
import '@fontsource/press-start-2p/400.css'
import '../../maths/labs/LabsHome.css'

/** The Science Arcade: the same dark retro cabinets as the Maths Arcade, one neon per science. */
export default function ScienceLabsHome() {
  const [bests, setBests] = useState<Record<string, Best>>({})
  useEffect(() => setBests(readBests()), [])
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const before = meta?.content ?? null
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta) }
    meta.content = '#070a1a'
    return () => { if (before === null) meta?.remove(); else if (meta) meta.content = before }
  }, [])
  const played = scienceLabCatalog.filter(lab => bests[`science-${lab.id}`]).length

  return <div className="labs">
    <header className="labs-hero">
      <div className="labs-hero__copy">
        <h1>Games where the science is the move</h1>
      </div>
      <div className="labs-hero__score" aria-label={`${played} of ${scienceLabCatalog.length} games cleared`}>
        <strong>{played}/{scienceLabCatalog.length}</strong>
        <span>games cleared</span>
      </div>
    </header>

    {scienceAreas.map(area => <section key={area.id} className="labs-group" aria-labelledby={`labs-${area.id}`}>
      <div className="labs-group__head">
        <h2 id={`labs-${area.id}`}>{area.title}</h2>
        <span className="labs-chip">{area.chip}</span>
      </div>
      <ul className="labs-grid">
        {scienceLabCatalog.filter(lab => lab.area === area.id).map(lab => <li key={lab.id}>
          <a className={`labs-card labs-card--${lab.area}`} href={lab.href}>
            <span className="labs-card__icon" aria-hidden="true">{lab.emoji}</span>
            <h3>{lab.title}</h3>
            <p className="labs-card__hook">{lab.tagline}</p>
            <span className="labs-card__foot">
              <span className="labs-card__skill">{lab.tag}</span>
              <span className="labs-card__play">Play →</span>
            </span>
          </a>
        </li>)}
      </ul>
    </section>)}
  </div>
}

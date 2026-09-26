'use client'

import { Button } from '../../ui'
import { SECTION_ICONS, type AppSection } from './AppShell'

const COPY: Record<Exclude<AppSection, 'curriculum'>, { title: string; lines: string[]; unlock: string }> = {
  cards: {
    title: 'Revision cards',
    lines: [
      'Quick flip cards that lock in what you learned. Cards you find hard come back sooner.',
      'Each lesson will get its own deck.',
    ],
    unlock: 'Not built yet. Finishing a lesson will unlock its deck.',
  },
  practice: {
    title: 'Practice',
    lines: [
      'Exam-style questions with marks, worked answers and how the marks are given, like the real paper.',
      'You’ll also be able to type in any sum and watch it worked out step by step.',
    ],
    unlock: 'Not built yet. Three finished lessons will unlock the first mixed paper.',
  },
}

export default function ComingSoon({ section, onBack }: { section: Exclude<AppSection, 'curriculum'>; onBack: () => void }) {
  const copy = COPY[section]
  return <div className={`soon soon--${section}`}>
    <span className="soon__icon" aria-hidden="true">{SECTION_ICONS[section]}</span>
    <h1>{copy.title}</h1>
    {copy.lines.map(line => <p key={line}>{line}</p>)}
    <p className="soon__unlock">{copy.unlock}</p>
    <Button size="lg" onClick={onBack}>Back to Curriculum</Button>
  </div>
}

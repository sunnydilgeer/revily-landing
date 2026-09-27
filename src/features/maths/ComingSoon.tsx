'use client'

import { Button } from '../../ui'
import { SECTION_ICONS, type AppSection } from './AppShell'
import type { Subject } from './subject'

type Copy = Record<Exclude<AppSection, 'curriculum'>, { title: string; lines: string[]; unlock: string }>

const MATHS: Copy = {
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
  lab: {
    title: 'Arcade',
    lines: ['Games where the maths is the cheat code. Each one trains a real GCSE skill.'],
    unlock: 'Open the Arcade to play.',
  },
}

const SCIENCE: Copy = {
  cards: {
    title: 'Revision cards',
    lines: [
      'Quick flip cards for the key facts and words from each Science lesson. Cards you find hard come back sooner.',
      'Science cards stay separate from Maths, so a session is one subject at a time.',
    ],
    unlock: 'Not built yet. Finishing a lesson will unlock its deck.',
  },
  practice: {
    title: 'Practice',
    lines: [
      'Exam-style Science questions with marks. For written answers you’ll tick off the mark-scheme points you hit.',
      'You’ll also see which parts of the exam you’ve covered and how ready you are.',
    ],
    unlock: 'Not built yet.',
  },
  lab: {
    title: 'Arcade',
    lines: [
      'Science games you can play on screen: change one thing, watch what happens, explain why.',
      'The Maths Arcade is open now. Switch to Maths to play it.',
    ],
    unlock: 'Not built yet.',
  },
}

export default function ComingSoon({ section, subject = 'maths', onBack }: { section: Exclude<AppSection, 'curriculum'>; subject?: Subject; onBack: () => void }) {
  const copy = (subject === 'science' ? SCIENCE : MATHS)[section]
  return <div className={`soon soon--${section}`}>
    <span className="soon__icon" aria-hidden="true">{SECTION_ICONS[section]}</span>
    <h1>{copy.title}</h1>
    {copy.lines.map(line => <p key={line}>{line}</p>)}
    <p className="soon__unlock">{copy.unlock}</p>
    <Button size="lg" onClick={onBack}>Back to Curriculum</Button>
  </div>
}

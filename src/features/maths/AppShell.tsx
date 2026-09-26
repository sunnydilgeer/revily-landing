'use client'

import type { ReactNode } from 'react'
import { RevilyLogo } from '../../ui'
import type { StudySummary } from './useStudy'
import './AppShell.css'

export type AppSection = 'curriculum' | 'cards' | 'practice'

export const SECTION_ICONS: Record<AppSection, ReactNode> = {
  curriculum: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M7 3v18M17 3v18M7 7h10M7 12h10M7 17h10" /></svg>,
  cards: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="7" width="13" height="14" rx="2" /><path d="M8 3h11a2 2 0 0 1 2 2v12" /></svg>,
  practice: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20l4-1 11-11-3-3L5 16z" /><path d="M14 6l3 3" /></svg>,
}

export const SECTIONS: { id: AppSection; label: string }[] = [
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'cards', label: 'Revision cards' },
  { id: 'practice', label: 'Practice' },
]

export const Bolt = ({ size = 20 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M13 3L5 14h6l-1 7 8-11h-6z" /></svg>

export function streakLabel(streak: number) {
  return streak === 0 ? 'No streak yet' : `${streak} day${streak === 1 ? '' : 's'} in a row`
}

export default function AppShell({ active, onNavigate, study, children }: {
  active: AppSection
  onNavigate: (section: AppSection) => void
  study: StudySummary
  children: ReactNode
}) {
  const nav = (placement: 'side' | 'bottom') => <nav className={`shell-nav shell-nav--${placement}`} aria-label="Main">
    {SECTIONS.map(section => <a
      key={section.id}
      href={section.id === 'curriculum' ? '/preview' : `/preview?view=${section.id}`}
      className={`shell-nav__item shell-nav__item--${section.id}${active === section.id ? ' is-active' : ''}`}
      aria-current={active === section.id ? 'page' : undefined}
      onClick={event => { event.preventDefault(); onNavigate(section.id) }}
    >
      <span className="shell-nav__icon">{SECTION_ICONS[section.id]}</span>
      <span className="shell-nav__label">{section.label}</span>
    </a>)}
  </nav>

  return <div className="shell">
    <aside className="shell-side">
      <RevilyLogo onNight href="/" size={26} />
      {nav('side')}
      <div className="shell-side__foot">
        <div className="shell-streak">
          <span className={`shell-streak__bolt${study.streak ? ' is-lit' : ''}`}><Bolt /></span>
          <div>
            <strong>{streakLabel(study.streak)}</strong>
            <span>{study.rungsToday || study.minutesToday >= 5 ? 'Today counts. Nice work.' : 'Finish one rung today to keep it going'}</span>
          </div>
        </div>
        <p className="shell-side__note">Preview · progress is saved on this device</p>
      </div>
    </aside>

    <header className="shell-top">
      <RevilyLogo href="/" size={24} />
      <span className={`shell-top__streak${study.streak ? ' is-lit' : ''}`} aria-label={streakLabel(study.streak)}><Bolt size={18} />{study.streak}</span>
    </header>

    <main className="shell-main" id="main-content">{children}</main>
    {nav('bottom')}
  </div>
}

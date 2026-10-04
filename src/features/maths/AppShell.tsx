'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { RevilyLogo } from '../../ui'
import { StarIcon } from '../../ui/icons'
import { modeLink } from '../../ui/modeTransition'
import { PAPER_MARKS } from './readiness/paperTopics'
import { usePathMarks } from './readiness/useReadiness'
import type { StudySummary } from './useStudy'
import { SUBJECTS, type Subject } from './subject'
import './AppShell.css'

export type AppSection = 'curriculum' | 'cards' | 'practice' | 'lab'

export const SECTION_ICONS: Record<AppSection, ReactNode> = {
  curriculum: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M7 3v18M17 3v18M7 7h10M7 12h10M7 17h10" /></svg>,
  cards: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="7" width="13" height="14" rx="2" /><path d="M8 3h11a2 2 0 0 1 2 2v12" /></svg>,
  practice: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20l4-1 11-11-3-3L5 16z" /><path d="M14 6l3 3" /></svg>,
  // The Arcade: a game controller.
  lab: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7.5 7h9a5 5 0 0 1 4.9 4l.9 4.6a2.6 2.6 0 0 1-4.4 2.3L15.5 15.5h-7L6.1 17.9a2.6 2.6 0 0 1-4.4-2.3L2.6 11a5 5 0 0 1 4.9-4Z" /><path d="M8 9.5v4M6 11.5h4" /><circle cx="15.5" cy="10.5" r=".6" fill="currentColor" /><circle cx="17.5" cy="12.5" r=".6" fill="currentColor" /></svg>,
}

export const SECTIONS: { id: AppSection; label: string }[] = [
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'cards', label: 'Revision cards' },
  { id: 'practice', label: 'Practice' },
  { id: 'lab', label: 'Arcade' },
]

export const Bolt = ({ size = 20 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M13 3L5 14h6l-1 7 8-11h-6z" /></svg>

export function streakLabel(streak: number) {
  return streak === 0 ? 'No streak yet' : `${streak} day${streak === 1 ? '' : 's'} in a row`
}

/** Link for a section in a subject. Maths keeps its original URLs. */
export function sectionHref(subject: Subject, section: AppSection) {
  const params = new URLSearchParams()
  if (subject !== 'maths') params.set('subject', subject)
  if (section !== 'curriculum') params.set('view', section)
  const query = params.toString()
  return query ? `/preview?${query}` : '/preview'
}

/** Maths | Science: one tap, in the sidebar on desktop and the top bar on phones. */
function SubjectSwitch({ subject, onSwitch, placement }: { subject: Subject; onSwitch: (subject: Subject) => void; placement: 'side' | 'top' }) {
  return <div className={`subject-switch subject-switch--${placement}`} role="group" aria-label="Subject">
    {SUBJECTS.map(option => <button
      key={option.id}
      type="button"
      aria-pressed={subject === option.id}
      onClick={() => { if (subject !== option.id) onSwitch(option.id) }}
    >{option.label}</button>)}
  </div>
}

/** True while the page is being scrolled down; false again on any scroll up or near the top. */
function useHideOnScrollDown() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last) < 8) return
      setHidden(y > last && y > 60)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return hidden
}

/** The way into the exam path: the marks the student is ready for, as a little piece of the night sky. */
function PathPill({ placement }: { placement: 'side' | 'top' }) {
  const { ready, loaded } = usePathMarks()
  const marks = loaded ? Math.round(ready) : 0
  const label = `Exam path: ready for about ${marks} of ${PAPER_MARKS} marks`
  if (placement === 'top') {
    return <a className="path-pill" href="/preview/ready" onClick={modeLink('night')} aria-label={label}>
      <StarIcon size={14} /><strong>{marks}</strong><span>/{PAPER_MARKS}</span>
    </a>
  }
  return <a className="path-card" href="/preview/ready" onClick={modeLink('night')} aria-label={label}>
    <span className="path-card__kicker"><StarIcon size={12} /> Exam path</span>
    <span className="path-card__marks"><strong>{marks}</strong>/{PAPER_MARKS} marks ready</span>
    <span className="path-card__meter" aria-hidden="true"><span style={{ width: `${Math.max(3, ready / PAPER_MARKS * 100)}%` }} /></span>
  </a>
}

export default function AppShell({ active, onNavigate, study, subject = 'maths', onSwitchSubject, children }: {
  active: AppSection
  onNavigate: (section: AppSection) => void
  study: StudySummary
  subject?: Subject
  onSwitchSubject?: (subject: Subject) => void
  children: ReactNode
}) {
  const barHidden = useHideOnScrollDown()
  const nav = (placement: 'side' | 'bottom') => <nav className={`shell-nav shell-nav--${placement}${placement === 'bottom' && barHidden ? ' is-hidden' : ''}`} aria-label="Main">
    {SECTIONS.map(section => <a
      key={section.id}
      href={sectionHref(subject, section.id)}
      className={`shell-nav__item shell-nav__item--${section.id}${active === section.id ? ' is-active' : ''}`}
      aria-current={active === section.id ? 'page' : undefined}
      onClick={event => { event.preventDefault(); onNavigate(section.id) }}
    >
      <span className="shell-nav__icon">{SECTION_ICONS[section.id]}</span>
      <span className="shell-nav__label">{section.label}</span>
    </a>)}
  </nav>

  return <div className="shell" data-subject={subject} data-section={active}>
    <aside className="shell-side">
      <RevilyLogo onNight href="/" size={26} />
      {onSwitchSubject && <SubjectSwitch subject={subject} onSwitch={onSwitchSubject} placement="side" />}
      {nav('side')}
      <div className="shell-side__foot">
        {subject === 'maths' && <PathPill placement="side" />}
        <div className="shell-streak">
          <span className={`shell-streak__bolt${study.streak ? ' is-lit' : ''}`}><Bolt /></span>
          <div>
            <strong>{streakLabel(study.streak)}</strong>
            <span>{study.rungsToday || study.minutesToday >= 5 ? 'Today counts. Nice work.' : subject === 'science' ? 'Study for 5 minutes today to keep it going' : 'Finish one section today to keep it going'}</span>
          </div>
        </div>
        <p className="shell-side__note">Preview · progress is saved on this device</p>
      </div>
    </aside>

    <header className="shell-top">
      <RevilyLogo href="/" size={24} />
      {onSwitchSubject && <SubjectSwitch subject={subject} onSwitch={onSwitchSubject} placement="top" />}
      {subject === 'maths' && <PathPill placement="top" />}
      <span className={`shell-top__streak${study.streak ? ' is-lit' : ''}`} aria-label={streakLabel(study.streak)}><Bolt size={18} />{study.streak}</span>
    </header>

    <main className="shell-main" id="main-content">{children}</main>
    {nav('bottom')}
  </div>
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, Lightbulb, RotateCcw, Sprout } from 'lucide-react'
import { coachTopics } from './content'
import { advanceCoachRun, answerCoachQuestion, COACH_STORAGE_KEY, coachLessonEngines, coachLessonHref, coachLessons, emptyCoachStore,
  makeReviewEntries, nextCoachLesson, recordCoachExposure, restoreCoachStore, revealCoachHint, startCoachRun, topicSummary, type CoachSessions, type CoachStore, type ReviewMode } from './engine'
import './ScienceCoach.css'

export default function ScienceCoach({ view = 'home' }: { view?: 'home' | ReviewMode }) {
  const [sessions, setSessions] = useState<CoachSessions>({})
  const [store, setStore] = useState<CoachStore>(emptyCoachStore)
  const [ready, setReady] = useState(false), [storageAvailable, setStorageAvailable] = useState(true)
  const [choicesVisible, setChoicesVisible] = useState(false), [now, setNow] = useState(0)
  const heading = useRef<HTMLHeadingElement>(null), questionHeading = useRef<HTMLHeadingElement>(null), choices = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function load() {
      const loaded: CoachSessions = {}
      try {
        coachLessonEngines.forEach((engine, i) => {
          const raw = localStorage.getItem(engine.storageKey)
          if (raw) { try { const session = engine.restorePreviewSession(JSON.parse(raw)); if (session) loaded[coachLessons[i].number] = session } catch { /* Reject malformed lesson data. */ } }
        })
        const raw = localStorage.getItem(COACH_STORAGE_KEY)
        if (raw) { try { setStore(restoreCoachStore(JSON.parse(raw)) || emptyCoachStore()) } catch { setStore(emptyCoachStore()) } }
      } catch { setStorageAvailable(false) }
      setSessions(loaded); setNow(Date.now()); setReady(true)
    }
    load()
    const refreshClock = () => setNow(Date.now())
    const visible = () => { if (document.visibilityState === 'visible') refreshClock() }
    window.addEventListener('storage', load)
    window.addEventListener('focus', refreshClock)
    document.addEventListener('visibilitychange', visible)
    const timer = window.setInterval(refreshClock, 30000)
    return () => { window.removeEventListener('storage', load); window.removeEventListener('focus', refreshClock); document.removeEventListener('visibilitychange', visible); window.clearInterval(timer) }
  }, [])
  // Save only user actions, not the initial empty loading state or an unrelated storage event.
  function update(next: CoachStore) {
    setStore(next); setNow(Date.now())
    try { localStorage.setItem(COACH_STORAGE_KEY, JSON.stringify(next)) } catch { setStorageAvailable(false) }
  }
  const summaries = coachTopics.map(topic => ({ topic, ...topicSummary(topic, sessions, store, now) }))
  const due = summaries.filter(t => t.due), repairs = summaries.filter(t => t.needsRepair), learned = summaries.filter(t => t.learned)
  const nextLesson = nextCoachLesson(sessions)
  const current = nextLesson || coachLessons[0]
  const currentSession = sessions[current.number]
  const run = store.run
  const mode = view === 'repair' ? 'repair' : 'review'
  const matchingRun = run?.entries[0]?.mode === mode ? run : null
  const entry = matchingRun?.entries[matchingRun.index]
  const topic = entry ? coachTopics.find(t => t.id === entry.topicId)! : null
  const question = topic?.questions.find(q => q.id === entry?.itemId)
  const submitted = entry ? store.attempts.find(a => a.runId === matchingRun!.id && a.itemId === entry.itemId) : undefined
  const hintOpen = Boolean(entry && matchingRun?.hints.includes(entry.itemId))
  const otherRun = run && !matchingRun && run.index < run.entries.length ? run : null
  useEffect(() => {
    setChoicesVisible(false)
    if (ready && view !== 'home' && matchingRun) questionHeading.current?.focus({ preventScroll: true })
  }, [entry?.itemId, matchingRun?.id, ready, view])
  useEffect(() => { if (choicesVisible) choices.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus() }, [choicesVisible])
  useEffect(() => {
    // Reopening saved feedback is another exposure too; it must postpone a later memory check.
    if (ready && view !== 'home' && entry && (entry.mode === 'repair' || submitted || hintOpen)) {
      update(recordCoachExposure(store, entry.topicId, new Date().toISOString()))
    }
    // Trigger once per answer/reminder display, not each clock tick or persistence update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, view, entry?.itemId, matchingRun?.id, submitted?.at, hintOpen])
  const when = (time: number) => new Date(time).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  function start(dueOnly: boolean) {
    const entries = makeReviewEntries(sessions, store, Date.now(), mode, dueOnly)
    update(startCoachRun(store, entries, crypto.randomUUID()))
  }
  return <div className="coach">
    <header className="coach-header"><Link className="coach-brand" href="/preview/scienceB"><span aria-hidden="true"><Sprout size={24} /></span><strong>Science Coach</strong></Link><span className="coach-header__label">GCSE Foundation</span><Link className="coach-home-link" href="/preview/scienceB">{view === 'home' ? 'Your learning' : <><ArrowLeft size={16} /> Coach home</>}</Link></header>
    <main className="coach-main" aria-busy={!ready}>
      {!ready ? <p role="status">Getting your next steps ready…</p> : view === 'home' ? <>
        <section className="coach-welcome"><div><span className="coach-eyebrow">Biology · Cell biology</span><h1 ref={heading}>A little practice.<br />A clearer understanding.</h1><p>You don’t need to plan everything. Start here, and take one step at a time.</p></div><div className="coach-welcome__note"><Sprout size={32} aria-hidden="true" /><strong>Learn it. Try it. Come back to it.</strong><span>Six lessons. Small steps. Help when you need it.</span></div></section>
        <section aria-labelledby="coach-today"><div className="coach-section-title"><h2 id="coach-today">Your next steps</h2><span>No streaks. No rush.</span></div><div className="coach-actions">
          <article className="coach-card coach-card--learn"><span className="coach-card__icon"><BookOpen size={22} /></span><span className="coach-eyebrow">1 · Keep learning</span><h3>{nextLesson ? current.title : 'Revisit a lesson'}</h3><p>{nextLesson ? current.detail : 'You’ve finished the lesson activities. You can still review their ideas.'}</p><Link className="coach-button" href={coachLessonHref(current.number)}>{currentSession && currentSession.completedIds.length ? 'Continue learning' : 'Start learning'}<ArrowRight size={17} /></Link><small>{nextLesson ? `Lesson ${current.number} · ${currentSession?.completedIds.length || 0} of ${current.lesson.states.length} activities finished` : 'Finishing activities is not the same as remembering them.'}</small></article>
          <article className="coach-card"><span className="coach-card__icon"><Clock3 size={22} /></span><span className="coach-eyebrow">2 · Remember a little</span><h3>Your five-minute review</h3><p>{due.length ? `${due.length} ${due.length === 1 ? 'idea is' : 'ideas are'} ready for a later check.` : learned.length ? 'Nothing is due yet. You can practise now, or come back later.' : 'Learn something first. Your review will use ideas you have already covered.'}</p><Link className="coach-button coach-button--light" href="/preview/scienceB?view=review">{due.length ? 'Start your review' : 'Open your review'}<ArrowRight size={17} /></Link><small>Up to five questions. Think first, then check.</small></article>
          <article className="coach-card"><span className="coach-card__icon"><Lightbulb size={22} /></span><span className="coach-eyebrow">3 · Get a little help</span><h3>Practise something tricky</h3><p>{repairs.length ? `${repairs.length} ${repairs.length === 1 ? 'idea needs' : 'ideas need'} another try. We’ll explain it, then give you a different question.` : 'When an answer goes wrong, you’ll find a small next step here.'}</p><Link className="coach-button coach-button--light" href="/preview/scienceB?view=repair">{repairs.length ? 'Let’s work on it' : 'See your practice list'}<ArrowRight size={17} /></Link><small>Mistakes are a place to start, not a grade.</small></article>
        </div></section>
        <section aria-labelledby="coach-lessons"><div className="coach-section-title"><h2 id="coach-lessons">Your six lessons</h2><span>Easier wording throughout</span></div><div className="coach-lessons">{coachLessons.map(item => {
          const completed = sessions[item.number]?.completedIds.length || 0
          return <Link className="coach-lesson" href={coachLessonHref(item.number)} key={item.number}><span className="coach-lesson__number">{item.number}</span><div><h3>{item.title}</h3><p>{item.detail}</p><span>{completed === item.lesson.states.length ? 'Activities finished · keep practising' : completed ? `${completed} of ${item.lesson.states.length} activities finished` : 'Ready when you are'}</span><div className="coach-progress" aria-hidden="true"><span style={{ width: `${completed / item.lesson.states.length * 100}%` }} /></div></div><ArrowRight size={18} aria-hidden="true" /></Link>
        })}</div></section>
        <section className="coach-goals" aria-labelledby="coach-goals"><div className="coach-section-title"><h2 id="coach-goals">What you’re practising</h2><span>{learned.length} of {coachTopics.length} starter goals introduced</span></div><p>A small review checklist—not the full GCSE curriculum. Correct answers here check these questions, not every part of a topic.</p><div className="coach-goal-list">{summaries.map(summary => <div className="coach-goal" key={summary.topic.id}><span className={`coach-dot ${summary.needsRepair ? 'coach-dot--help' : summary.learned ? 'coach-dot--ready' : ''}`} aria-hidden="true" /><div><Link href={coachLessonHref(summary.topic.lesson, summary.topic.teachingIds[0])}>{summary.topic.goal}</Link><small>Lesson {summary.topic.lesson}{summary.learned && !summary.due ? ` · Next later check: ${when(summary.dueAt)}` : summary.due ? ' · Later check ready' : ''}</small></div><span className="coach-status">{summary.label}</span></div>)}</div></section>
      </> : <>
        <div className="coach-review-heading"><span className="coach-eyebrow">{mode === 'repair' ? 'A little help' : 'A little remembering'}</span><h1>{mode === 'repair' ? 'Let’s work on it.' : 'Your five-minute review.'}</h1><p>{mode === 'repair' ? 'Read a short reminder. Then try a different question.' : 'Try to remember first. You can always ask for help.'}</p></div>
        {otherRun ? <section className="coach-review-card"><h2>You have a review in progress.</h2><p>Your answers are saved. Finish that small set before starting another.</p><Link className="coach-button" href={`/preview/scienceB?view=${otherRun.entries[0].mode}`}>Continue your saved set <ArrowRight size={17} /></Link></section> : matchingRun && !entry ? <section className="coach-review-card coach-finish" aria-live="polite"><span className="coach-finish__icon"><Check size={30} /></span><h2 ref={questionHeading} tabIndex={-1}>That’s enough for now.</h2><p>You tried {matchingRun.entries.length} {matchingRun.entries.length === 1 ? 'question' : 'questions'}. {store.attempts.filter(a => a.runId === matchingRun.id && a.correct).length} answered correctly.</p><p>Helped answers and repeated questions are practice. Fresh, unassisted answers at least a day later are labelled as later checks—not whole-topic mastery.</p><div className="coach-finish__results">{matchingRun.entries.map(item => {
          const attempt = store.attempts.find(a => a.runId === matchingRun.id && a.itemId === item.itemId)!
          return <div key={item.itemId}><span>{coachTopics.find(t => t.id === item.topicId)!.goal}</span><strong>{!attempt.correct ? 'Another try will help' : attempt.laterCheck ? 'Correct on a later check' : 'Correct in practice'}</strong></div>
        })}</div><div className="coach-button-row"><Link className="coach-button" href="/preview/scienceB">Back to your next steps <ArrowRight size={17} /></Link>{mode === 'review' && repairs.length > 0 && <Link className="coach-button coach-button--light" href="/preview/scienceB?view=repair">Get help with mistakes</Link>}<button className="coach-text-button" type="button" onClick={() => update({ ...store, run: null })}>Close this summary</button></div></section> : entry && topic && question ? <section className="coach-review-card">
          <div className="coach-question-meta"><span>Question {matchingRun!.index + 1} of {matchingRun!.entries.length}</span><span>Lesson {topic.lesson}</span></div>
          {mode === 'repair' && <aside className="coach-reminder"><strong>Let’s make this clearer</strong><p>{topic.reminder}</p><span>This is supported practice, not a memory test.</span></aside>}
          <h2 tabIndex={-1} ref={questionHeading}>{question.prompt}</h2>
          {!choicesVisible && !submitted ? <div className="coach-think"><p>Take a moment. Can you say the answer to yourself?</p><button className="coach-button" type="button" onClick={() => setChoicesVisible(true)}>Show the choices <ArrowRight size={17} /></button></div> : <div ref={choices} className="coach-choices" role="group" aria-label="Choose an answer">{question.options.map((option, index) => <button key={option} type="button" disabled={Boolean(submitted)} aria-pressed={submitted?.choice === index} className={`coach-choice ${submitted && index === question.answer ? 'coach-choice--correct' : submitted?.choice === index ? 'coach-choice--retry' : ''}`} onClick={() => update(answerCoachQuestion(store, sessions, index, new Date().toISOString()))}><span>{option}</span>{submitted && index === question.answer ? <Check size={18} aria-label="Correct answer" /> : <ArrowRight size={16} aria-hidden="true" />}</button>)}</div>}
          {!submitted && mode === 'review' && <div className="coach-help"><button className="coach-text-button" type="button" aria-expanded={hintOpen} onClick={() => update(revealCoachHint(store))}><Lightbulb size={16} /> I need a reminder</button>{hintOpen && <aside className="coach-reminder"><p>{topic.reminder}</p><span>That’s fine—this answer will count as supported practice.</span></aside>}</div>}
          {submitted && <div className="coach-feedback" role="status"><strong>{submitted.correct ? 'That’s right.' : 'Let’s make this clearer.'}</strong><p>{question.explanation}</p><small>{submitted.laterCheck ? 'Fresh question · correct on a later check' : submitted.previouslySeen ? 'You have seen this question before · practice only' : submitted.assisted ? 'With a reminder · supported practice' : 'Practice checked · later remembering is separate'}</small><button className="coach-button" type="button" onClick={() => update(advanceCoachRun(store))}>{matchingRun!.index + 1 === matchingRun!.entries.length ? 'Finish this small set' : 'Next question'}<ArrowRight size={17} /></button></div>}
          <Link className="coach-teaching-link" href={coachLessonHref(topic.lesson, topic.teachingIds[0])}><BookOpen size={16} /> Revisit this part of the lesson</Link>
        </section> : <section className="coach-review-card">
          <span className="coach-empty-icon">{mode === 'repair' ? <Lightbulb size={28} /> : <Clock3 size={28} />}</span>
          <h2>{mode === 'repair' ? repairs.length ? 'A fresh start for a tricky idea.' : 'Nothing on your practice list yet.' : due.length ? 'A few ideas are ready to revisit.' : learned.length ? 'Nothing is due just yet.' : 'First, learn a little.'}</h2>
          <p>{mode === 'repair' ? repairs.length ? 'We’ll remind you of the idea and give you a different question. If you’ve used that repair question before, it stays practice.' : 'Wrong choices from your lessons or reviews will appear here after the relevant teaching. Written answers still need teacher review.' : due.length ? 'This set uses ideas you learned at least a day ago, unless you’ve practised them more recently.' : learned.length ? 'A later check starts at least 24 hours after the latest lesson or review exposure. You can still practise now.' : 'Finish the relevant teaching in a lesson. Then we can ask questions about it. Skipping ahead does not introduce a review goal.'}</p>
          {mode === 'repair' && repairs.length > 0 ? <button className="coach-button" type="button" onClick={() => start(false)}>Start supported practice <ArrowRight size={17} /></button> : mode === 'review' && due.length > 0 ? <button className="coach-button" type="button" onClick={() => start(true)}>Start your small review <ArrowRight size={17} /></button> : mode === 'review' && learned.length > 0 ? <button className="coach-button coach-button--light" type="button" onClick={() => start(false)}><RotateCcw size={17} /> Practise now</button> : <Link className="coach-button" href={coachLessonHref(current.number)}>Continue learning <ArrowRight size={17} /></Link>}
          {mode === 'review' && learned.length > 0 && due.length === 0 && <p className="coach-next-check">Earliest later check: {when(Math.min(...learned.map(t => t.dueAt)))}</p>}
        </section>}
      </>}
      {!storageAvailable && <p className="coach-storage-warning" role="status">Browser storage is unavailable. New review answers last only on this page; lessons may not save or unlock reviews when you leave.</p>}
      <footer className="coach-footer"><p>Cell Biology starter · AQA Combined Science: Trilogy, Foundation · Draft questions awaiting teacher review.</p><p>Saved on this browser only. No account, teacher-marking queue or full-GCSE mastery assessment is connected. Real practicals still need your teacher.</p><Link href="/preview/science?variant=b">Open the original Science prototype <ArrowRight size={14} /></Link></footer>
    </main>
  </div>
}

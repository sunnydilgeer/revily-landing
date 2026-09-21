'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { scienceLessonHref, type ScienceVariant } from './lessonNavigation'
import { coverageTopics, coverageLessonHref, newPilotSession, pilotReducer, pilotStorageKey, restorePilotSession, transportPilot, type PilotAction } from './examPreparation'
import './ScienceLesson.css'
import './FriendlyLesson.css'
import './ExamPreparation.css'

export default function TransportExamPilot({ variant }: { variant: ScienceVariant }) {
  const [session, setSession] = useState(newPilotSession)
  const [ready, setReady] = useState(false)
  const [storage, setStorage] = useState(true)
  const [notice, setNotice] = useState('')
  const taskHeading = useRef<HTMLHeadingElement>(null)
  const previousScreen = useRef<number | null>(null)
  const storageKey = pilotStorageKey(variant)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        let restored = null
        try { restored = restorePilotSession(JSON.parse(raw)) } catch { /* Preserve invalid saved data until an explicit new attempt. */ }
        if (restored) setSession(restored)
        else { setNotice('Saved pilot data could not be read. Practice is available for this visit, but saving is disabled to preserve that record.'); setStorage(false) }
      }
    } catch { setStorage(false) }
    setReady(true)
  }, [storageKey])
  useEffect(() => {
    if (!ready || !storage) return
    try { localStorage.setItem(storageKey, JSON.stringify(session)) } catch { setStorage(false) }
  }, [session, ready, storage, storageKey])
  useEffect(() => {
    if (!ready) return
    const previous = previousScreen.current
    previousScreen.current = session.current
    if (previous !== null && previous !== session.current) {
      taskHeading.current?.focus({ preventScroll: true })
      taskHeading.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
  }, [ready, session.current])
  function act(action: PilotAction) { setSession(s => pilotReducer(s, action)) }
  const task = transportPilot[session.current]
  const submitted = task && session.submitted[task.id]
  const modelSeen = task && session.modelSeen.includes(task.id)
  const canContinue = task && (task.stage === 'worked' ? modelSeen : Boolean(submitted))
  return <div className="science-preview science-preview--revision">
    <header className="science-header"><Link className="science-brand" href="/" aria-label="Revily home"><span aria-hidden="true">R</span><strong>Revily</strong></Link><Link href={scienceLessonHref(6, variant)}>Back to Lesson 6</Link></header>
    <main className="science-course exam-preparation">
      <span className="science-eyebrow">Lesson 6 · Foundation · Variant {variant.toUpperCase()}</span><h1>Explain it. Then try it yourself.</h1>
      <p>Original Revily exam-style practice. Your written answers are not automatically marked.</p>
      <details className="exam-revisit"><summary>Before you start</summary><p>Learn diffusion, osmosis, active transport and percentage mass change first. You can inspect this pilot without finishing the lesson; that does not mean you are ready for assessment.</p><p>These draft questions and marking points need qualified teacher review. They are not official AQA material and do not predict your GCSE grade.</p></details>
      <nav className="exam-links" aria-label="Exam practice resources"><Link href={`/preview/science/coverage?variant=${variant}`}>See the curriculum and paper map</Link></nav>
      <div className="exam-progress" role="progressbar" aria-label="Exam-practice position" aria-valuemin={0} aria-valuemax={4} aria-valuenow={session.current}>Screen {Math.min(session.current + 1, 4)} of 4 · Worked → supported → independent</div>
      {!ready ? <p>Opening your saved practice…</p> : task ? <article className="exam-panel" key={task.id}>
        <span className="science-eyebrow">{task.stage === 'worked' ? 'Worked example' : task.stage === 'supported' ? 'Supported practice · not independent evidence' : 'Independent practice'}</span><h2 ref={taskHeading} tabIndex={-1}>{task.title}</h2>
        <p className="exam-prompt">{task.prompt}</p>
        <p><strong>{task.stage === 'worked' ? 'Explain' : task.id === 'EP6-03' ? 'Calculate and explain' : 'Explain'}:</strong> {task.id === 'EP6-03' ? 'Show the numbers and working, then give the scientific reason.' : 'Link the process to the direction or reason. Naming it alone is not a full explanation.'}</p>
        {task.scaffold && <aside className="exam-scaffold"><h3>Use these prompts</h3><ol>{task.scaffold.map(point => <li key={point}>{point}</li>)}</ol></aside>}
        {task.stage !== 'worked' && <form onSubmit={e => { e.preventDefault(); act({ type: 'submit' }) }}><label>Your answer<textarea rows={6} maxLength={6000} value={session.drafts[task.id] || ''} readOnly={Boolean(submitted)} onChange={e => act({ type: 'draft', text: e.target.value })} placeholder={task.id === 'EP6-03' ? 'Show your calculation and explain why the mass decreased…' : 'Explain how or why using the information given…'} /></label>{!submitted && <button type="submit" disabled={!session.drafts[task.id]?.trim()}>Submit for teacher review</button>}</form>}
        {submitted && <p role="status">Answer saved locally · pending teacher review. This prototype does not send it to a teacher. Your answer is locked; comparing it with the model does not award marks.</p>}
        {task.stage === 'worked' && !modelSeen && <button type="button" onClick={() => act({ type: 'reveal' })}>Show the worked answer</button>}
        {submitted && !modelSeen && <button type="button" onClick={() => act({ type: 'reveal' })}>Compare with the model answer</button>}
        {modelSeen && <section className="exam-model" aria-label="Draft answer guidance"><h3>Model answer</h3><p>{task.model}</p><h3>Draft marking points · {task.marks} marks</h3><ol>{task.points.map(point => <li key={point}>{point}</li>)}</ol><p>Equivalent scientifically correct wording can be accepted. Your teacher decides the marks.</p><p><strong>Watch out:</strong> {task.commonSlip}</p>{task.stage !== 'worked' && <p>You have now seen the answer. A repeat of this question is practice, not fresh independent evidence.</p>}</section>}
        <details className="exam-revisit"><summary>Revisit the teaching</summary><p>For an independent attempt, use these links after answering. If you use support first, treat your response as supported practice.</p><ul>{task.topicIds.map(id => { const topic = coverageTopics.find(t => t.id === id)!; return <li key={id}><Link href={coverageLessonHref(topic, variant)}>{topic.title}</Link></li> })}</ul></details>
        <div className="exam-controls"><button type="button" disabled={session.current === 0} onClick={() => act({ type: 'back' })}>Previous practice screen</button><button type="button" disabled={!canContinue} onClick={() => act({ type: 'next' })}>{session.current === 3 ? 'Finish practice' : 'Next practice screen'}</button></div>
      </article> : <section className="exam-panel"><h2 ref={taskHeading} tabIndex={-1}>Practice attempted—not yet marked</h2><p>You have seen one worked example and submitted three answers. Written work remains pending teacher review. No marks, mastery status or lesson completion have been awarded.</p><ul>{transportPilot.filter(t => t.stage !== 'worked').map(t => <li key={t.id}><h3>{t.title}</h3><p className="exam-answer">{session.submitted[t.id]}</p><p>Pending teacher review · {session.modelSeen.includes(t.id) ? 'model answer seen' : 'model answer not seen'}</p></li>)}</ul><button type="button" onClick={() => act({ type: 'back' })}>Review my last answer</button><p><Link href={scienceLessonHref(6, variant)}>Return to Lesson 6</Link></p></section>}
      <p role="status">{notice}</p><p>{storage ? 'Practice drafts and submitted answers stay in this browser. A/B pilot records are separate from each other and from lesson progress.' : 'Saving is unavailable. New work may be lost when you leave or reload.'}</p>
    </main>
  </div>
}

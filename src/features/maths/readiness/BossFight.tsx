'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { WorkedChain } from '../step-chain/WorkedChain'
import { HEARTS, isCorrect, readAnswer, saveBossRecord, type Boss, type BossRecord } from './bosses'
import './BossFight.css'

type Phase = 'intro' | 'fight' | 'hit' | 'won' | 'lost'

/** A boss fight: land a hit with every question before your hearts run out. */
export default function BossFight({ boss, record, onClose, onWin }: {
  boss: Boss
  record?: BossRecord
  onClose: () => void
  onWin: () => void
}) {
  const [attempt] = useState(record?.attempts ?? 0)
  const parts = boss.rounds[attempt % boss.rounds.length]
  const [phase, setPhase] = useState<Phase>('intro')
  const [index, setIndex] = useState(0)
  const [hearts, setHearts] = useState(HEARTS)
  const [typed, setTyped] = useState('')
  const [miss, setMiss] = useState(false)
  const [showWorking, setShowWorking] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const part = parts[index]

  useEffect(() => {
    const node = dialog.current
    node?.showModal()
    document.documentElement.classList.add('has-boss-open')
    return () => { document.documentElement.classList.remove('has-boss-open'); node?.close() }
  }, [])
  useEffect(() => { if (phase === 'fight') input.current?.focus() }, [phase, index])

  function start() {
    saveBossRecord(boss.area, { ...record, attempts: attempt + 1 })
    setPhase('fight')
  }

  function check(event: FormEvent) {
    event.preventDefault()
    if (readAnswer(typed) === null) return
    if (isCorrect(typed, part)) {
      setMiss(false)
      setShowWorking(false)
      if (index === parts.length - 1) {
        saveBossRecord(boss.area, { attempts: attempt + 1, beatenOn: new Date().toISOString().slice(0, 10) })
        onWin()
        setPhase('won')
      } else setPhase('hit')
      return
    }
    const left = hearts - 1
    setHearts(left)
    setMiss(true)
    if (left === 0) setPhase('lost')
  }

  function next() {
    setIndex(index + 1)
    setTyped('')
    setShowWorking(false)
    setPhase('fight')
  }

  const bossHp = parts.length - index - (phase === 'hit' || phase === 'won' ? 1 : 0)

  return <dialog ref={dialog} className="bf" aria-labelledby="bf-title" onCancel={event => { event.preventDefault(); onClose() }}>
    <div className="bf-top">
      <button type="button" className="bf-close" aria-label="Leave the fight" onClick={onClose}>✕</button>
      <div className="bf-hearts" aria-label={`${hearts} of ${HEARTS} hearts left`}>
        {Array.from({ length: HEARTS }, (_, i) => <span key={i} className={i < hearts ? 'is-full' : ''} aria-hidden="true">♥</span>)}
      </div>
    </div>

    <div className="bf-boss">
      <div className={`bf-boss__face${phase === 'hit' || phase === 'won' ? ' is-hit' : ''}${phase === 'won' ? ' is-down' : ''}`} aria-hidden="true">{phase === 'won' ? '💥' : '👾'}</div>
      <p className="bf-kicker">Number boss</p>
      <h2 id="bf-title">{boss.title}</h2>
      <div className="bf-hp" aria-label={`Boss health ${bossHp} of ${parts.length}`}>
        {parts.map((_, i) => <span key={i} className={i < bossHp ? 'is-full' : ''} />)}
      </div>
    </div>

    <div className="bf-body">
      {phase === 'intro' && <>
        <p className="bf-story">{boss.story}</p>
        <ul className="bf-rules">
          <li><strong>{parts.length} questions.</strong> Each right answer is a hit.</li>
          <li><strong>{HEARTS} hearts.</strong> Each wrong answer costs one.</li>
          <li>Use paper for your working, like in the exam.</li>
        </ul>
        <button type="button" className="bf-cta" onClick={start}>Fight</button>
      </>}

      {(phase === 'fight' || phase === 'lost') && <form className="bf-question" onSubmit={check}>
        <p className="bf-count">Question {index + 1} of {parts.length}</p>
        <p className="bf-prompt">{part.prompt}</p>
        {phase === 'fight' && <>
          <label className="bf-answer">
            <span className="visually-hidden">Your answer</span>
            {part.prefix && <span className="bf-answer__prefix" aria-hidden="true">{part.prefix}</span>}
            <input ref={input} inputMode="decimal" autoComplete="off" value={typed} onChange={event => { setTyped(event.target.value); setMiss(false) }} placeholder="Answer" />
          </label>
          {miss && <p className="bf-miss" role="alert">Not quite, you lost a heart. <span>Hint: {part.hint}</span></p>}
          <button type="submit" className="bf-cta" disabled={readAnswer(typed) === null}>Attack</button>
        </>}
      </form>}

      {phase === 'hit' && <div className="bf-result">
        <p className="bf-hit" role="status">Hit! The answer is {part.prefix ?? ''}{part.answer}.</p>
        {showWorking
          ? <WorkedChain steps={part.chain} />
          : <button type="button" className="bf-link" onClick={() => setShowWorking(true)}>See the working</button>}
        <button type="button" className="bf-cta" onClick={next}>Next question</button>
      </div>}

      {phase === 'lost' && <div className="bf-result">
        <p className="bf-lost" role="status">Out of hearts. The boss wins this round.</p>
        <p className="bf-note">Here’s how to answer it. Next time you’ll get new numbers.</p>
        <WorkedChain steps={part.chain} />
        <button type="button" className="bf-cta" onClick={onClose}>Back to the tree</button>
      </div>}

      {phase === 'won' && <div className="bf-result">
        <p className="bf-won" role="status">Boss beaten! 👑</p>
        <p className="bf-note">You’ve mastered the Number branch. That’s exam-style questions, done under pressure.</p>
        {showWorking
          ? <WorkedChain steps={part.chain} />
          : <button type="button" className="bf-link" onClick={() => setShowWorking(true)}>See the working for the last one</button>}
        <button type="button" className="bf-cta" onClick={onClose}>Back to the tree</button>
      </div>}
    </div>
  </dialog>
}

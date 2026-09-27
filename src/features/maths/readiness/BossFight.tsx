'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { WorkedChain } from '../step-chain/WorkedChain'
import BossCharacter, { type BossMood } from './BossCharacter'
import { HEARTS, isCorrect, readAnswer, saveBossRecord, type Boss, type BossRecord } from './bosses'
import { ArrowIcon, CloseIcon, CrownIcon, HeartIcon } from '../../../ui/icons'
import './BossFight.css'

type Phase = 'vs' | 'fight' | 'hit' | 'won' | 'lost'

/** A boss fight: land a hit with every question before your hearts run out. */
export default function BossFight({ boss, record, readyMarks, onClose, onWin }: {
  boss: Boss
  record?: BossRecord
  readyMarks: number
  onClose: () => void
  onWin: () => void
}) {
  const [attempt, setAttempt] = useState(record?.attempts ?? 0)
  const [beatenBefore] = useState(Boolean(record?.beatenOn))
  const parts = boss.rounds[attempt % boss.rounds.length]
  const [phase, setPhase] = useState<Phase>('vs')
  const [index, setIndex] = useState(0)
  const [hearts, setHearts] = useState(HEARTS)
  const [breaking, setBreaking] = useState<number | null>(null)
  const [typed, setTyped] = useState('')
  const [miss, setMiss] = useState(0)
  const [mood, setMood] = useState<BossMood>('idle')
  const [showWorking, setShowWorking] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])
  const part = parts[index]
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }

  useEffect(() => {
    const node = dialog.current
    node?.showModal()
    document.documentElement.classList.add('has-boss-open')
    const pending = timers.current
    return () => { pending.forEach(clearTimeout); document.documentElement.classList.remove('has-boss-open'); node?.close() }
  }, [])
  useEffect(() => { if (phase === 'fight') input.current?.focus() }, [phase, index])

  function start() {
    saveBossRecord(boss.area, { ...(beatenBefore ? { beatenOn: record?.beatenOn } : {}), attempts: attempt + 1 })
    setPhase('fight')
  }

  function check(event: FormEvent) {
    event.preventDefault()
    if (readAnswer(typed) === null || phase !== 'fight') return
    if (isCorrect(typed, part)) {
      setMiss(0)
      setShowWorking(false)
      const last = index === parts.length - 1
      setMood('hit')
      setPhase('hit')
      if (last) {
        saveBossRecord(boss.area, { attempts: attempt + 1, beatenOn: new Date().toISOString().slice(0, 10) })
        onWin()
        later(() => setMood('down'), 550)
        later(() => setPhase('won'), 1300)
      } else later(() => setMood('idle'), 600)
      return
    }
    const left = hearts - 1
    setBreaking(left)
    later(() => setBreaking(null), 600)
    setHearts(left)
    setMiss(count => count + 1)
    setMood('taunt')
    if (left === 0) later(() => setPhase('lost'), 700)
    else later(() => setMood('idle'), 900)
  }

  function next() {
    setIndex(index + 1)
    setTyped('')
    setShowWorking(false)
    setPhase('fight')
  }

  function rematch() {
    setAttempt(attempt + 1)
    setIndex(0)
    setHearts(HEARTS)
    setTyped('')
    setMiss(0)
    setShowWorking(false)
    setMood('idle')
    setPhase('vs')
  }

  const landed = index + (phase === 'hit' || phase === 'won' ? 1 : 0)
  const bossHp = parts.length - landed

  return <dialog ref={dialog} className={`bf bf--${phase}`} aria-labelledby="bf-title" onCancel={event => { event.preventDefault(); onClose() }}>
    <div className="bf-top">
      <button type="button" className="bf-close" aria-label="Leave the fight" onClick={onClose}><CloseIcon size={18} /></button>
      <div className="bf-hearts" role="img" aria-label={`${hearts} of ${HEARTS} hearts left`}>
        {Array.from({ length: HEARTS }, (_, i) => <span key={i} className={`bf-heart${i < hearts ? ' is-full' : ''}${breaking === i ? ' is-breaking' : ''}`}><HeartIcon size={24} empty={i >= hearts} /></span>)}
      </div>
    </div>

    {phase === 'vs'
      ? <div className="bf-vs">
        <div className="bf-vs__side bf-vs__side--you">
          <span className="bf-vs__avatar" aria-hidden="true">You</span>
          <span className="bf-vs__stat">{readyMarks}/80 marks</span>
          <span className="bf-vs__stat">{HEARTS} hearts</span>
        </div>
        <span className="bf-vs__versus" aria-hidden="true">VS</span>
        <div className="bf-vs__side bf-vs__side--boss">
          <BossCharacter mood="idle" damage={0} size={132} />
        </div>
        <div className="bf-vs__title">
          <p className="bf-kicker">Number boss</p>
          <h2 id="bf-title">The Treasurer</h2>
          <p className="bf-vs__story">{boss.story}</p>
        </div>
      </div>
      : <div className="bf-stage">
        <div className="bf-stage__boss">
          {phase === 'won'
            ? <span className="bf-victory" aria-hidden="true"><span className="bf-victory__rays" /><CrownIcon size={84} strokeWidth={1.6} /></span>
            : <BossCharacter mood={mood} damage={landed} size={132} />}
          {phase === 'hit' && <span className="bf-pop" aria-hidden="true">HIT!</span>}
        </div>
        <p className="bf-kicker">{phase === 'won' ? 'Defeated' : 'Number boss'}</p>
        <h2 id="bf-title" className="bf-stage__name">The Treasurer</h2>
        <div className="bf-hp" role="img" aria-label={`Boss health ${bossHp} of ${parts.length}`}>
          {parts.map((_, i) => <span key={i} className={i < bossHp ? 'is-full' : ''} />)}
        </div>
      </div>}

    <div className="bf-card">
      {phase === 'vs' && <>
        <ul className="bf-rules">
          <li><strong>{parts.length}</strong> exam-style questions</li>
          <li><strong>{HEARTS}</strong> hearts</li>
          <li>Working on paper, like the real thing</li>
        </ul>
        <button type="button" className="rv-btn rv-btn--alarm rv-btn--lg rv-btn--block" onClick={start}>Fight <ArrowIcon size={18} /></button>
      </>}

      {phase === 'fight' && <form className="bf-question" onSubmit={check}>
        <p className="bf-count">Question {index + 1} of {parts.length}</p>
        <p className="bf-prompt">{part.prompt}</p>
        <label className={`bf-answer${miss ? ' is-wrong' : ''}`} key={miss}>
          <span className="bf-sr">Your answer</span>
          {part.prefix && <span className="bf-answer__prefix" aria-hidden="true">{part.prefix}</span>}
          <input ref={input} inputMode="decimal" autoComplete="off" value={typed} onChange={event => setTyped(event.target.value)} placeholder="Your answer" />
        </label>
        {miss > 0 && <p className="bf-miss" role="alert"><strong>Blocked. You lost a heart.</strong> {part.hint}</p>}
        <button type="submit" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={readAnswer(typed) === null}>Attack</button>
      </form>}

      {phase === 'hit' && index < parts.length - 1 && <div className="bf-result">
        <p className="bf-verdict bf-verdict--hit" role="status">Direct hit! <span>{part.prefix ?? ''}{part.answer} is right.</span></p>
        {showWorking
          ? <WorkedChain steps={part.chain} />
          : <button type="button" className="bf-link" onClick={() => setShowWorking(true)}>See the working</button>}
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={next}>Next question <ArrowIcon size={18} /></button>
      </div>}

      {phase === 'hit' && index === parts.length - 1 && <p className="bf-verdict bf-verdict--hit" role="status">Final blow!</p>}

      {phase === 'won' && <div className="bf-result bf-result--won">
        <div className="bf-banner" role="status">
          <span className="bf-banner__kicker">Branch mastered</span>
          <span className="bf-banner__title">Number</span>
        </div>
        <ul className="bf-stats">
          <li><strong>{parts.length}/{parts.length}</strong> hits</li>
          <li><strong>{hearts}/{HEARTS}</strong> hearts left</li>
        </ul>
        <p className="bf-note">Exam-style questions, answered under pressure. That’s what May feels like.</p>
        {showWorking
          ? <WorkedChain steps={part.chain} />
          : <button type="button" className="bf-link" onClick={() => setShowWorking(true)}>See the working for the final blow</button>}
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onClose}>Back to the tree <ArrowIcon size={18} /></button>
      </div>}

      {phase === 'lost' && <div className="bf-result">
        <p className="bf-verdict bf-verdict--lost" role="status">The Treasurer wins this round.</p>
        <p className="bf-note">Here’s how to crack that one. The rematch has new numbers.</p>
        <WorkedChain steps={part.chain} />
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={rematch}>Rematch <ArrowIcon size={18} /></button>
        <button type="button" className="bf-link bf-link--center" onClick={onClose}>Back to the tree</button>
      </div>}
    </div>
  </dialog>
}

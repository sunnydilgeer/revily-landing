'use client'

/* The /preview lock: a playful under-construction splash with a password box. */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import './locked.css'

const STATUS = [
  'Carrying the 1…',
  'Pouring fresh decimal points…',
  'Tightening loose fractions…',
  'Balancing the equations…',
  'Looking for x (it’s hiding again)…',
  'Rounding off the corners…',
  'Simplifying the scaffolding…',
  'Measuring twice, cutting once…',
]

const WRONG = [
  'Nope. Not even close to a right angle.',
  'Wrong answer, but we admire the working out.',
  'Not quite. Check your signs?',
  'Incorrect. The builders are shaking their heads.',
  'Close… ish. To 0 significant figures.',
  'That’s a no from the site foreman.',
]

const BRICKS = ['π', '√', '½', '%', 'x', '÷', '∑', '7', '±', '∞', '²', '=']

export default function LockScreen() {
  const [status, setStatus] = useState(0)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [state, setState] = useState<'idle' | 'checking' | 'wrong' | 'open'>('idle')
  const wrongCount = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = window.setInterval(() => setStatus(current => (current + 1) % STATUS.length), 2400)
    return () => window.clearInterval(timer)
  }, [])

  async function unlock(event: FormEvent) {
    event.preventDefault()
    if (!password.trim() || state === 'checking' || state === 'open') return
    setState('checking')
    setMessage('Checking with the foreman…')
    const response = await fetch('/api/preview-unlock', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
    }).catch(() => null)
    if (response?.ok) {
      setState('open')
      setMessage('Hard hat on. Come on in!')
      window.setTimeout(() => window.location.reload(), 1300)
      return
    }
    setState('wrong')
    setMessage(response ? WRONG[wrongCount.current++ % WRONG.length] : 'The site radio is down. Try again in a moment.')
    setPassword('')
    inputRef.current?.focus()
  }

  return <main className={`lock lock--${state}`}>
    <div className="lock-tape" aria-hidden="true"><span>UNDER CONSTRUCTION · MIND THE MATHS · UNDER CONSTRUCTION · MIND THE MATHS · UNDER CONSTRUCTION · MIND THE MATHS ·</span></div>

    <div className="lock-stage">
      <svg className="lock-crane" viewBox="0 0 320 220" aria-hidden="true">
        <rect x="40" y="40" width="14" height="180" rx="3" className="lock-crane__mast" />
        {[60, 90, 120, 150, 180].map(y => <path key={y} d={`M40 ${y} L54 ${y + 26} M54 ${y} L40 ${y + 26}`} className="lock-crane__lattice" />)}
        <rect x="20" y="32" width="270" height="12" rx="3" className="lock-crane__jib" />
        <rect x="8" y="26" width="34" height="24" rx="4" className="lock-crane__weight" />
        <rect x="34" y="12" width="26" height="22" rx="4" className="lock-crane__cab" />
        <g className="lock-crane__hook">
          <line x1="250" y1="44" x2="250" y2="128" className="lock-crane__cable" />
          <rect x="222" y="128" width="56" height="44" rx="8" className="lock-crane__block" />
          <text x="250" y="158" textAnchor="middle" className="lock-crane__label">x²</text>
        </g>
      </svg>
      <div className="lock-bricks" aria-hidden="true">
        {BRICKS.map((brick, index) => <span key={brick} style={{ animationDelay: `${index * 90}ms` }}>{brick}</span>)}
      </div>
    </div>

    <section className="lock-card" aria-labelledby="lock-title">
      <p className="lock-kicker"><span aria-hidden="true">🚧</span> Revily · preview</p>
      <h1 id="lock-title">Under construction</h1>
      <p className="lock-sub">We’re building something brilliant for GCSE Maths and Science. Hard hats only beyond this point.</p>

      <div className="lock-progress" role="img" aria-label="Build progress: 99.9 percent">
        <div className="lock-progress__bar"><span /></div>
        <div className="lock-progress__meta"><span aria-live="polite">{STATUS[status]}</span><strong>99.9%</strong></div>
        <small>(That’s 100% to 1 significant figure. Nearly there.)</small>
      </div>

      <form className="lock-form" onSubmit={unlock}>
        <label htmlFor="lock-password">Got the secret word?</label>
        <div className="lock-form__row">
          <input ref={inputRef} id="lock-password" type="password" autoComplete="current-password" value={password}
            onChange={event => { setPassword(event.target.value); if (state === 'wrong') setState('idle') }}
            placeholder="Secret word" disabled={state === 'open'} />
          <button type="submit" disabled={state === 'checking' || state === 'open'}>
            {state === 'open' ? 'Opening…' : state === 'checking' ? 'Checking…' : 'Let me in'}
          </button>
        </div>
        <p className="lock-message" role="status">{message}</p>
      </form>
    </section>

    {state === 'open' && <div className="lock-burst" aria-hidden="true">
      {Array.from({ length: 28 }, (_, index) => <span key={index} style={{ left: `${(index * 37) % 100}%`, animationDelay: `${(index % 7) * 60}ms` }}>{BRICKS[index % BRICKS.length]}</span>)}
    </div>}

    <div className="lock-tape lock-tape--bottom" aria-hidden="true"><span>HARD HATS ONLY · NO CALCULATORS BEYOND THIS POINT · HARD HATS ONLY · NO CALCULATORS BEYOND THIS POINT ·</span></div>
  </main>
}

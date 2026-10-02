'use client'

/* The /preview lock, as an 8-bit arcade level: the password is the "cheat code" and wrong guesses cost a life. */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import '@fontsource/press-start-2p/400.css'
import './locked.css'

const STATUS = [
  'SPAWNING FRACTIONS…',
  'RESPAWNING x…',
  'COLLECTING π COINS…',
  'LEVELLING UP ALGEBRA…',
  'DEFEATING THE DECIMAL DRAGON…',
  'BOSS FIGHT: SIMULTANEOUS EQUATIONS…',
  'POLISHING THE PIXELS…',
]

const WRONG = [
  'WRONG CODE! -1 LIFE',
  'OUCH! THAT’S NOT IT',
  'NICE TRY, PLAYER 2',
  'NOPE. CHECK YOUR WORKING',
]

// A tiny pixel student in a graduation cap. K cap/shoes, Y tassel, S skin, E eyes, B jumper, P trousers.
const SPRITE = [
  '....KKKK....',
  '..KKKKKKKK..',
  '....KKKKY...',
  '....SSSS.Y..',
  '...SSESESS..',
  '...SSSSSS...',
  '....SSSS....',
  '...BBBBBB...',
  '..BBBBBBBB..',
  '..SBBBBBBS..',
  '...BBBBBB...',
  '...PP..PP...',
  '...PP..PP...',
  '..KKK..KKK..',
]
const SPRITE_COLOURS: Record<string, string> = { K: '#1b1f3b', Y: '#ffd35c', S: '#f2c29b', E: '#1b1f3b', B: '#6d3fd8', P: '#3b5bdb' }

const STARS = Array.from({ length: 46 }, (_, i) => ({ left: (i * 47) % 100, top: (i * 29) % 62, delay: (i % 9) * 0.35, size: i % 5 === 0 ? 4 : 2 }))
const BLOCKS = ['π', '?', '√', '?', 'x²']
const COINS = ['π', '∑', '½', '%']

function Sprite() {
  return <svg className="arcade-sprite" viewBox="0 0 12 14" shapeRendering="crispEdges" aria-hidden="true">
    {SPRITE.flatMap((row, y) => [...row].map((cell, x) => cell === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={SPRITE_COLOURS[cell]} />))}
  </svg>
}

export default function LockScreen() {
  const [status, setStatus] = useState(0)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [lives, setLives] = useState(3)
  const [state, setState] = useState<'idle' | 'checking' | 'wrong' | 'open'>('idle')
  const wrongCount = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = window.setInterval(() => setStatus(current => (current + 1) % STATUS.length), 2200)
    return () => window.clearInterval(timer)
  }, [])

  async function unlock(event: FormEvent) {
    event.preventDefault()
    if (!password.trim() || state === 'checking' || state === 'open') return
    setState('checking')
    setMessage('CHECKING CODE…')
    const response = await fetch('/api/preview-unlock', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
    }).catch(() => null)
    if (response?.ok) {
      setState('open')
      setMessage('LEVEL UNLOCKED! +100 XP')
      window.setTimeout(() => window.location.reload(), 1400)
      return
    }
    setState('wrong')
    if (!response) setMessage('CONNECTION LOST. TRY AGAIN')
    else if (lives <= 1) { setLives(3); setMessage('GAME OVER… JUST KIDDING. CONTINUE? ♥♥♥') }
    else { setLives(lives - 1); setMessage(WRONG[wrongCount.current++ % WRONG.length]) }
    setPassword('')
    inputRef.current?.focus()
  }

  return <main className={`arcade arcade--${state}`}>
    <div className="arcade-sky" aria-hidden="true">
      {STARS.map((star, i) => <span key={i} style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s` }} />)}
    </div>
    <div className="arcade-cloud arcade-cloud--one" aria-hidden="true" />
    <div className="arcade-cloud arcade-cloud--two" aria-hidden="true" />

    <header className="arcade-hud" aria-hidden="true">
      <span><small>SCORE</small>003141</span>
      <span><small>WORLD</small>GCSE-1</span>
      <span><small>LIVES</small><b className="arcade-hearts">{'♥'.repeat(lives)}<i>{'♥'.repeat(3 - lives)}</i></b></span>
      <span><small>TIME</small>∞</span>
    </header>

    <section className="arcade-card" aria-labelledby="arcade-title">
      <p className="arcade-kicker">REVILY · PLAYER 1</p>
      <h1 id="arcade-title">LEVEL UNDER<br />CONSTRUCTION</h1>
      <p className="arcade-sub">We’re building new GCSE Maths and Science levels. Players with the cheat code may enter.</p>

      <div className="arcade-loading" role="img" aria-label="Loading: 99.9 percent">
        <div className="arcade-loading__bar">{Array.from({ length: 20 }, (_, i) => <span key={i} className={i === 19 ? 'is-last' : ''} />)}</div>
        <div className="arcade-loading__meta"><span aria-live="polite">{STATUS[status]}</span><strong>99.9%</strong></div>
      </div>

      <form className="arcade-form" onSubmit={unlock}>
        <label htmlFor="arcade-code">ENTER CHEAT CODE</label>
        <div className="arcade-form__row">
          <input ref={inputRef} id="arcade-code" type="password" autoComplete="current-password" value={password}
            onChange={event => { setPassword(event.target.value); if (state === 'wrong') setState('idle') }}
            placeholder="_ _ _ _ _" disabled={state === 'open'} />
          <button type="submit" disabled={state === 'checking' || state === 'open'}>
            <span className="arcade-blink" aria-hidden="true">▶</span> {state === 'open' ? 'LOADING' : 'PRESS START'}
          </button>
        </div>
        <p className="arcade-message" role="status">{message}</p>
      </form>
    </section>

    <div className="arcade-world" aria-hidden="true">
      <div className="arcade-blocks">{BLOCKS.map((block, i) => <span key={i} className={block === '?' ? 'is-mystery' : ''}>{block}</span>)}</div>
      <div className="arcade-coins">{COINS.map((coin, i) => <span key={coin} style={{ animationDelay: `${i * 0.2}s` }}>{coin}</span>)}</div>
      <div className="arcade-hill" />
      <div className="arcade-runner"><Sprite /></div>
      <div className="arcade-ground" />
    </div>

    {state === 'open' && <div className="arcade-burst" aria-hidden="true">
      {Array.from({ length: 24 }, (_, i) => <span key={i} style={{ left: `${(i * 41) % 100}%`, animationDelay: `${(i % 6) * 70}ms` }}>{COINS[i % COINS.length]}</span>)}
    </div>}
    <div className="arcade-scanlines" aria-hidden="true" />
  </main>
}

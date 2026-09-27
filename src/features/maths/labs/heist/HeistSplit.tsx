'use client'

import { useEffect, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { crew, jobs, pounds, type Job, type Question } from './jobs'
import { isMuted, setMuted, sfx } from './sfx'
import './HeistSplit.css'

type Known = Question['reveals']
type Screen = 'vault' | 'brief' | 'question' | 'payout' | 'busted' | 'done'

const TRUST = 3
const COUNT_MS = 900

const partsOf = (job: Job) => job.ratio.reduce((sum, part) => sum + part, 0)

function rankFor(kept: number) {
  if (kept === jobs.length * TRUST) return { badge: '🧠', name: 'Mastermind', line: 'Not one slip. The crew wants you on every job.' }
  if (kept >= jobs.length * TRUST - 2) return { badge: '😎', name: 'Smooth Operator', line: 'A wobble or two, but the money always added up.' }
  if (kept >= jobs.length) return { badge: '🎲', name: 'Wildcard', line: 'You got there. The crew’s keeping an eye on you.' }
  return { badge: '🐣', name: 'Rookie', line: 'Every mastermind starts somewhere. Run it again.' }
}

/** Counts from 0 to `target` once `running` turns on. Reduced motion lands on the number straight away. */
function useCountUp(target: number, running: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!running) { setValue(0); return }
    if (prefersReducedMotion()) { setValue(target); return }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS)
      setValue(Math.round(target * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, running])
  return value
}

/** The vault at the start of each job: the dial spins, the door swings, the take counts up. */
function Vault({ job, open }: { job: Job; open: boolean }) {
  const [counting, setCounting] = useState(false)
  useEffect(() => {
    if (!open) { setCounting(false); return }
    const timer = setTimeout(() => setCounting(true), prefersReducedMotion() ? 0 : 900)
    return () => clearTimeout(timer)
  }, [open])
  const shown = useCountUp(job.take, counting && !job.liar)
  return <div className={`hs-vault${open ? ' is-open' : ''}`}>
    <div className="hs-vault__inside" aria-live="polite">
      {job.liar
        ? <><span className="hs-vault__loot" aria-hidden="true">🕸️</span><span className="hs-vault__sum">Empty</span></>
        : <><span className="hs-vault__loot" aria-hidden="true">💰</span><span className="hs-vault__sum">{counting ? pounds(shown) : ''}</span></>}
    </div>
    <div className="hs-vault__door" aria-hidden="true">
      <span className="hs-vault__dial" />
      <span className="hs-vault__bolt hs-vault__bolt--a" /><span className="hs-vault__bolt hs-vault__bolt--b" />
      <span className="hs-vault__bolt hs-vault__bolt--c" /><span className="hs-vault__bolt hs-vault__bolt--d" />
    </div>
  </div>
}

/**
 * The bar model: one row of equal boxes per crew member. It fills in as the student works: the
 * boxes get counted, then each box gets its value, then each person's cut is added up.
 */
function BarModel({ job, known, final }: { job: Job; known: Set<Known>; final: boolean }) {
  const share = job.take / partsOf(job)
  const takeKnown = !job.reverse || known.has('take') || final
  // Every row uses the same columns, so a share is the same width whoever it belongs to.
  const most = Math.max(...job.ratio)
  const columns = { gridTemplateColumns: `repeat(${most}, minmax(0, 1fr))` }
  let count = 0
  return <figure className="hs-bars" aria-label={`The take split ${job.ratio.join(' : ')}`}>
    <div className={`hs-take${takeKnown ? '' : ' is-unknown'}`}>
      <span className="hs-take__label">
        {job.liar && !takeKnown ? `${crew[job.liar.who].name} says` : 'The take'}
        {known.has('share') && <span className="hs-take__each">1 share = {pounds(share)}</span>}
      </span>
      <span className="hs-take__value">
        {job.liar && takeKnown && <s className="hs-take__lie">{pounds(job.liar.claim)}</s>}
        {takeKnown ? pounds(job.take) : job.liar ? `${pounds(job.liar.claim)}?` : '£ ?'}
      </span>
    </div>
    {crew.map((member, row) => {
      const parts = job.ratio[row]
      const given = job.reverse && row === job.focus
      const cutKnown = final || given || (known.has('payout') && row === job.focus)
      const busted = job.liar?.who === row && takeKnown
      return <div key={member.name} className={`hs-row${row === job.focus ? ' is-focus' : ''}`}>
        <div className="hs-who">
          <span className="hs-who__emoji" aria-hidden="true">{member.emoji}</span>
          <span className="hs-who__name">{member.name}</span>
        </div>
        <div className="hs-boxes" style={columns}>
          {Array.from({ length: parts }, (_, box) => {
            const number = ++count
            const label = known.has('share') ? pounds(share) : known.has('count') ? String(number) : ''
            return <span
              key={box}
              className={`hs-box${known.has('share') ? ' is-gold' : known.has('count') ? ' is-counted' : ''}`}
              style={{ ['--i' as string]: number - 1 }}
            ><span className="hs-box__label">{label}</span></span>
          })}
          {busted && <span className="hs-stamp" role="img" aria-label="Liar">LIAR</span>}
        </div>
        <div className={`hs-cut${cutKnown ? ' is-known' : ''}`}>{cutKnown ? pounds(parts * share) : '?'}</div>
      </div>
    })}
  </figure>
}

/** A burst of coins over the payout. Purely for fun, so reduced motion skips it. */
function CoinBurst() {
  const [coins] = useState(() => Array.from({ length: 18 }, (_, i) => ({
    x: Math.round(Math.random() * 100), delay: Math.round(Math.random() * 400), spin: Math.round(Math.random() * 720 - 360), key: i,
  })))
  return <div className="hs-burst" aria-hidden="true">
    {coins.map(coin => <span key={coin.key} style={{ left: `${coin.x}%`, animationDelay: `${coin.delay}ms`, ['--spin' as string]: `${coin.spin}deg` }}>🪙</span>)}
  </div>
}

function TrustPips({ trust }: { trust: number }) {
  return <div className="hs-trust" aria-label={`Crew trust: ${trust} of ${TRUST}`}>
    {Array.from({ length: TRUST }, (_, index) => <span key={index} className={`hs-pip${index < trust ? '' : ' is-lost'}`} aria-hidden="true">◆</span>)}
  </div>
}

export default function HeistSplit() {
  const [jobIndex, setJobIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('vault')
  const [vaultOpen, setVaultOpen] = useState(false)
  const [vaultDone, setVaultDone] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [missed, setMissed] = useState(false)
  const [trust, setTrust] = useState(TRUST)
  const [kept, setKept] = useState(0)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)
  const [revealed, setRevealed] = useState(1)
  const [muted, setMutedState] = useState(false)
  const [shared, setShared] = useState(false)
  const { pace } = useStepPace()

  useEffect(() => setMutedState(isMuted()), [])

  const job = jobs[jobIndex]
  const question = job.questions[questionIndex]
  const speaker = crew[question.who]
  const answered = screen === 'question' ? questionIndex + (picked === question.answer ? 1 : 0) : screen === 'vault' || screen === 'brief' ? 0 : job.questions.length
  const known = new Set<Known>(job.questions.slice(0, answered).map(q => q.reveals))
  const right = picked !== null && picked === question.answer
  const wrong = picked !== null && !right
  const nope = question.choices.find(choice => choice.value === picked)?.nope

  const startJob = (index: number) => {
    setJobIndex(index); setScreen('vault'); setVaultOpen(false); setVaultDone(false)
    setQuestionIndex(0); setPicked(null); setMissed(false); setTrust(TRUST); setRevealed(1)
  }

  const crack = () => {
    setVaultOpen(true)
    sfx.vault()
    setTimeout(() => setVaultDone(true), prefersReducedMotion() ? 0 : 900 + COUNT_MS)
  }

  const pick = (value: number) => {
    if (picked !== null) return
    setPicked(value)
    if (value === question.answer) {
      const next = missed ? 0 : streak + 1
      setStreak(next)
      setBest(Math.max(best, next))
      if (next >= 3 && next % 3 === 0) sfx.win(); else sfx.coin()
      if (question.reveals === 'take' && job.liar) setTimeout(sfx.stamp, 450)
      return
    }
    sfx.buzz()
    setMissed(true)
    setStreak(0)
    const left = trust - 1
    setTrust(left)
    if (left === 0) setTimeout(() => setScreen('busted'), 900)
  }

  const carryOn = () => {
    setPicked(null); setMissed(false)
    if (questionIndex + 1 < job.questions.length) setQuestionIndex(questionIndex + 1)
    else { setKept(kept + trust); setScreen('payout'); sfx.win() }
  }

  const restart = () => { setKept(0); setStreak(0); setBest(0); setShared(false); startJob(0) }

  const toggleMute = () => { setMuted(!muted); setMutedState(!muted) }

  const share = async (text: string) => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: 'Heist Split', text, url })
      else { await navigator.clipboard.writeText(`${text} ${url}`); setShared(true) }
    } catch { /* they closed the share sheet */ }
  }

  const header = <header className="hs-top">
    <a className="hs-icon" href="/preview" aria-label="Leave the lab">×</a>
    <p className="hs-job">Job {jobIndex + 1}/{jobs.length}</p>
    {streak >= 2 && <span className="hs-streak" aria-label={`${streak} in a row`}>🔥 {streak}</span>}
    <TrustPips trust={trust} />
    <button type="button" className="hs-icon" aria-label={muted ? 'Turn sound on' : 'Turn sound off'} aria-pressed={muted} onClick={toggleMute}>{muted ? '🔇' : '🔊'}</button>
  </header>

  if (screen === 'done') {
    const total = jobs.reduce((sum, candidate) => sum + candidate.take, 0)
    const rank = rankFor(kept)
    const brag = `I split ${pounds(total)} of heist money and got ranked ${rank.name} ${rank.badge} Beat that.`
    return <main className="hs">
      <section className="hs-end">
        <p className="hs-kicker">All jobs done</p>
        <div className="hs-rank">
          <span className="hs-rank__badge" aria-hidden="true">{rank.badge}</span>
          <p className="hs-rank__label">Your rank</p>
          <h1 className="hs-rank__name">{rank.name}</h1>
          <p className="hs-rank__line">{rank.line}</p>
          <dl className="hs-stats">
            <div><dt>Split</dt><dd>{pounds(total)}</dd></div>
            <div><dt>Trust kept</dt><dd>{kept}/{jobs.length * TRUST}</dd></div>
            <div><dt>Best streak</dt><dd>🔥 {best}</dd></div>
          </dl>
        </div>
        <div className="hs-rule">
          <p className="hs-rule__label">The move, every time</p>
          <ol>
            <li>Add the parts to get the number of shares.</li>
            <li>Divide to find one share.</li>
            <li>Multiply by each person’s shares.</li>
          </ol>
        </div>
      </section>
      <footer className="hs-bar">
        <div className="hs-bar__actions hs-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share(brag)}>{shared ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Run it again</button>
        </div>
      </footer>
    </main>
  }

  return <main className="hs">
    {header}

    {screen === 'vault' && <>
      <section className="hs-brief hs-brief--vault">
        <p className="hs-kicker">{job.title}</p>
        <h1 className="hs-title">{!vaultDone ? 'Crack the vault.' : job.liar ? 'Someone got here first.' : 'You’re in.'}</h1>
        <Vault job={job} open={vaultOpen} />
      </section>
      <footer className="hs-bar">
        {vaultDone
          ? <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => setScreen('brief')}>See the deal</button>
          : <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={vaultOpen} onClick={crack}>Crack it</button>}
      </footer>
    </>}

    {screen === 'brief' && <>
      <section className="hs-brief">
        <p className="hs-kicker">{job.title}</p>
        <h1 className="hs-title">{job.brief}</h1>
        <ul className="hs-deal" aria-label="The deal">
          {crew.map((member, row) => <li key={member.name}>
            <span className="hs-deal__emoji" aria-hidden="true">{member.emoji}</span>
            <span className="hs-deal__name">{member.name}</span>
            <span className="hs-deal__role">{member.role}</span>
            <span className="hs-deal__parts">{job.ratio[row]}</span>
          </li>)}
        </ul>
        <p className="hs-why"><span className="hs-why__tag">Why</span>{job.why}</p>
      </section>
      <footer className="hs-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => setScreen('question')}>Split it</button>
      </footer>
    </>}

    {screen === 'question' && <>
      <section className="hs-card rv-paper">
        <BarModel job={job} known={known} final={false} />
      </section>
      <section className="hs-ask">
        <p className="hs-asker"><span aria-hidden="true">{speaker.emoji}</span> {speaker.name} asks</p>
        <h1 className="hs-prompt">{question.prompt}</h1>
        <div className="hs-choices">
          {question.choices.map(choice => {
            const state = picked === choice.value ? (right ? ' is-right' : ' is-wrong') : ''
            return <button
              key={choice.value}
              type="button"
              className={`hs-choice${state}`}
              disabled={picked !== null && picked !== choice.value}
              aria-pressed={picked === choice.value}
              onClick={() => pick(choice.value)}
            >{choice.label}</button>
          })}
        </div>
        {right && streak >= 2 && <p key={streak} className="hs-combo" role="status">🔥 {streak} in a row!</p>}
      </section>
      {right && <CheckBar status="correct" title={`${speaker.emoji} “${question.hype ?? speaker.hype[(jobIndex + questionIndex) % speaker.hype.length]}”`} message={question.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>Continue</button>
      </CheckBar>}
      {wrong && trust > 0 && <CheckBar status="incorrect" title={`${speaker.emoji} “${question.oops ?? speaker.oops}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="hs-end hs-end--busted">
        <span className="hs-sirens" aria-hidden="true">🚨</span>
        <p className="hs-kicker">Busted</p>
        <h1 className="hs-title">The crew doesn’t trust your maths any more.</h1>
        <p className="hs-why"><span className="hs-why__tag">Tip</span>Count the shares first, not the people. Then one share is the take ÷ the number of shares.</p>
      </section>
      <footer className="hs-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => startJob(jobIndex)}>Try the job again</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <CoinBurst key={job.id} />
      <section className="hs-card rv-paper">
        <BarModel job={job} known={known} final />
        <p className="hs-check">
          Check: {job.ratio.map(parts => pounds(parts * job.take / partsOf(job))).join(' + ')} = {pounds(job.take)} <span aria-hidden="true">✓</span>
        </p>
      </section>
      <section className="hs-card hs-card--working rv-paper">
        <h2 className="hs-working__title">The working</h2>
        <StepChain key={job.id} steps={job.chain} revealed={revealed} pace={pace} />
      </section>
      <footer className="hs-bar">
        <StepDots total={job.chain.length - 1} current={revealed - 1} onSelect={step => setRevealed(step + 1)} />
        <div className="hs-bar__actions">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-icon-btn" aria-label="Previous step" disabled={revealed === 1} onClick={() => setRevealed(revealed - 1)}>←</button>
          {revealed < job.chain.length
            ? <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => setRevealed(revealed + 1)}>{revealed === 1 ? 'Show the working' : 'Next step'}</button>
            : <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => jobIndex + 1 < jobs.length ? startJob(jobIndex + 1) : setScreen('done')}>
              {jobIndex + 1 < jobs.length ? 'Next job' : 'Finish'}
            </button>}
        </div>
      </footer>
    </>}
  </main>
}

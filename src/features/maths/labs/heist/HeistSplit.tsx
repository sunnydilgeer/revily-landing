'use client'

import { useEffect, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, RankCard, Rule, Why, rankFor, useCountUp, useScore, useShare, recordRank , livesPerRound } from '../kit/Lab'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { makeJobs, crew, pounds, type Job, type Question } from './jobs'
import './HeistSplit.css'

type Known = Question['reveals']
type Screen = 'vault' | 'brief' | 'question' | 'payout' | 'busted' | 'done'

const COUNT_MS = 900

const partsOf = (job: Job) => job.ratio.reduce((sum, part) => sum + part, 0)

const RANKS = [
  { badge: '🧠', name: 'Mastermind', line: 'Not one slip. The crew wants you on every job.' },
  { badge: '😎', name: 'Smooth Operator', line: 'A wobble or two, but the money always added up.' },
  { badge: '🎲', name: 'Wildcard', line: 'You got there. The crew’s keeping an eye on you.' },
  { badge: '🐣', name: 'Rookie', line: 'Every mastermind starts somewhere. Run it again.' },
] as const

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
  return <figure className="lab-bars" aria-label={`The take split ${job.ratio.join(' : ')}`}>
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

function HeistSplitGame({ jobs, onReplay }: { jobs: Job[]; onReplay: () => void }) {
  const [jobIndex, setJobIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('vault')
  const [vaultOpen, setVaultOpen] = useState(false)
  const [vaultDone, setVaultDone] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied, reset: resetShare } = useShare()
  const { pace } = useStepPace()

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
    setQuestionIndex(0); setPicked(null); setMissed(false); setRevealed(1)
  }

  const crack = () => {
    setVaultOpen(true)
    sfx.vault()
    setTimeout(() => setVaultDone(true), prefersReducedMotion() ? 0 : 900 + COUNT_MS)
  }

  const pick = (value: number) => {
    setPicked(value)
    if (value === question.answer) {
      score.hit(!missed)
      if (question.reveals === 'take' && job.liar) setTimeout(sfx.stamp, 450)
      return
    }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 900)
  }

  const carryOn = () => {
    setPicked(null); setMissed(false)
    if (questionIndex + 1 < job.questions.length) setQuestionIndex(questionIndex + 1)
    else { score.bank(); setScreen('payout'); sfx.win() }
  }

  const restart = onReplay

  const header = <LabTop progress={`Job ${jobIndex + 1}/${jobs.length}`} streak={score.streak} lives={score.lives} />

  useEffect(() => {
    if (screen === 'done') recordRank('heist', rankFor(score.kept, jobs.length, [...RANKS]), [...RANKS])
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (screen === 'done') {
    const total = jobs.reduce((sum, candidate) => sum + candidate.take, 0)
    const rank = rankFor(score.kept, jobs.length, [...RANKS])
    const brag = `I split ${pounds(total)} of heist money and got ranked ${rank.name} ${rank.badge} Beat that.`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">All jobs done</p>
        <RankCard rank={rank} stats={[['Split', pounds(total)], ['Trust kept', `${score.kept}/${jobs.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Add the parts to get the number of shares.', 'Divide to find one share.', 'Multiply by each person’s shares.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Heist Split', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Run it again</button>
        </div>
      </footer>
    </main>
  }

  return <main className="lab">
    {header}

    {screen === 'vault' && <>
      <section className="lab-intro lab-intro--centre">
        <p className="lab-kicker">{job.title}</p>
        <h1 className="lab-title">{!vaultDone ? 'Crack the vault.' : job.liar ? 'Someone got here first.' : 'You’re in.'}</h1>
        <Vault job={job} open={vaultOpen} />
      </section>
      <footer className="lab-bar">
        {vaultDone
          ? <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => setScreen('brief')}>See the deal</button>
          : <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={vaultOpen} onClick={crack}>Crack it</button>}
      </footer>
    </>}

    {screen === 'brief' && <>
      <section className="lab-intro">
        <p className="lab-kicker">{job.title}</p>
        <h1 className="lab-title">{job.brief}</h1>
        <ul className="hs-deal" aria-label="The deal">
          {crew.map((member, row) => <li key={member.name}>
            <span className="hs-deal__emoji" aria-hidden="true">{member.emoji}</span>
            <span className="hs-deal__name">{member.name}</span>
            <span className="hs-deal__role">{member.role}</span>
            <span className="hs-deal__parts">{job.ratio[row]}</span>
          </li>)}
        </ul>
        <Why>{job.why}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => setScreen('question')}>Split it</button>
      </footer>
    </>}

    {screen === 'question' && <>
      <section className="lab-card rv-paper">
        <BarModel job={job} known={known} final={false} />
      </section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{speaker.emoji}</span> {speaker.name} asks</p>
        <h1 className="lab-prompt">{question.prompt}</h1>
        <Choices choices={question.choices} picked={picked} answer={question.answer} onPick={value => pick(value as number)} />
        {right && <Combo streak={score.streak} />}
      </section>
      {right && <CheckBar status="correct" title={`${speaker.emoji} “${question.hype ?? speaker.hype[(jobIndex + questionIndex) % speaker.hype.length]}”`} message={question.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>Continue</button>
      </CheckBar>}
      {wrong && score.lives > 0 && <CheckBar status="incorrect" title={`${speaker.emoji} “${question.oops ?? speaker.oops}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🚨</span>
        <p className="lab-kicker">Busted</p>
        <h1 className="lab-title">The crew doesn’t trust your maths any more.</h1>
        <Why tag="Tip">Count the shares first, not the people. Then one share is the take ÷ the number of shares.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startJob(jobIndex) }}>Try the job again</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <Burst key={job.id} emoji="🪙" />
      <section className="lab-card rv-paper">
        <BarModel job={job} known={known} final />
        <p className="hs-check">
          Check: {job.ratio.map(parts => pounds(parts * job.take / partsOf(job))).join(' + ')} = {pounds(job.take)} <span aria-hidden="true">✓</span>
        </p>
      </section>
      <section className="lab-card lab-card--working rv-paper">
        <h2 className="lab-working__title">The working</h2>
        <StepChain key={job.id} steps={job.chain} revealed={revealed} pace={pace} />
      </section>
      <footer className="lab-bar">
        <StepDots total={job.chain.length - 1} current={revealed - 1} onSelect={step => setRevealed(step + 1)} />
        <div className="lab-bar__actions">
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

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function HeistSplit() {
  const { data, play, regenerate } = useGenerated(makeJobs)
  return data ? <HeistSplitGame key={play} jobs={data} onReplay={regenerate} /> : null
}

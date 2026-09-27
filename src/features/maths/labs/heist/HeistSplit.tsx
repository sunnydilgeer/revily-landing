'use client'

import { useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { crew, jobs, pounds, type Job, type Question } from './jobs'
import './HeistSplit.css'

type Known = Question['reveals']
type Screen = 'brief' | 'question' | 'payout' | 'busted' | 'done'

const TRUST = 3
const CHEERS = ['Clean.', 'Smooth.', 'Crew’s happy.']

const partsOf = (job: Job) => job.ratio.reduce((sum, part) => sum + part, 0)

/**
 * The bar model: one row of equal boxes per crew member. It fills in as the student works: the
 * boxes get counted, then each box gets its value, then each person's cut is added up.
 */
function BarModel({ job, known, final }: { job: Job; known: Set<Known>; final: boolean }) {
  const share = job.take / partsOf(job)
  const takeKnown = !job.reverse || known.has('take') || final
  // Every row uses the same columns, so a share is the same width whoever it belongs to.
  const most = Math.max(...job.ratio)
  const columns = { gridTemplateColumns: `repeat(${most}, minmax(0, 1fr))`, ['--cols' as string]: most }
  let count = 0
  return <figure className="hs-bars" aria-label={`The take split ${job.ratio.join(' : ')}`}>
    <div className={`hs-take${takeKnown ? '' : ' is-unknown'}`}>
      <span className="hs-take__label">The take</span>
      <span className="hs-take__value">{takeKnown ? pounds(job.take) : '£ ?'}</span>
    </div>
    {crew.map((member, row) => {
      const parts = job.ratio[row]
      const given = job.reverse && row === job.focus
      const cutKnown = final || given || (known.has('payout') && row === job.focus)
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
            >{label}</span>
          })}
        </div>
        <div className={`hs-cut${cutKnown ? ' is-known' : ''}`}>{cutKnown ? pounds(parts * share) : '?'}</div>
      </div>
    })}
  </figure>
}

function TrustPips({ trust }: { trust: number }) {
  return <div className="hs-trust" aria-label={`Crew trust: ${trust} of ${TRUST}`}>
    {Array.from({ length: TRUST }, (_, index) => <span key={index} className={`hs-pip${index < trust ? '' : ' is-lost'}`} aria-hidden="true">◆</span>)}
  </div>
}

export default function HeistSplit() {
  const [jobIndex, setJobIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('brief')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [trust, setTrust] = useState(TRUST)
  const [kept, setKept] = useState(0)
  const [revealed, setRevealed] = useState(1)
  const { pace } = useStepPace()

  const job = jobs[jobIndex]
  const question = job.questions[questionIndex]
  const known = new Set<Known>(job.questions.slice(0, screen === 'question' ? questionIndex + (picked === question.answer ? 1 : 0) : screen === 'brief' ? 0 : job.questions.length).map(q => q.reveals))
  const right = picked !== null && picked === question.answer
  const wrong = picked !== null && !right
  const nope = question.choices.find(choice => choice.value === picked)?.nope

  const startJob = (index: number) => {
    setJobIndex(index); setScreen('brief'); setQuestionIndex(0); setPicked(null); setTrust(TRUST); setRevealed(1)
  }

  const pick = (value: number) => {
    if (picked !== null) return
    setPicked(value)
    if (value !== question.answer) {
      const left = trust - 1
      setTrust(left)
      if (left === 0) setTimeout(() => setScreen('busted'), 900)
    }
  }

  const carryOn = () => {
    setPicked(null)
    if (questionIndex + 1 < job.questions.length) setQuestionIndex(questionIndex + 1)
    else { setKept(kept + trust); setScreen('payout') }
  }

  const restart = () => { setKept(0); startJob(0) }

  if (screen === 'done') {
    const total = jobs.reduce((sum, candidate) => sum + candidate.take, 0)
    return <main className="hs">
      <section className="hs-end">
        <p className="hs-kicker">All jobs done</p>
        <h1 className="hs-title">You split {pounds(total)} and the crew still trusts you.</h1>
        <p className="hs-end__stat"><strong>{kept}</strong> of {jobs.length * TRUST} trust kept</p>
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
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Run it again</button>
      </footer>
    </main>
  }

  return <main className="hs">
    <header className="hs-top">
      <a className="hs-close" href="/preview" aria-label="Leave the lab">×</a>
      <p className="hs-job">Job {jobIndex + 1} of {jobs.length}</p>
      <TrustPips trust={trust} />
    </header>

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
      </section>
      {right && <CheckBar status="correct" title={CHEERS[questionIndex % CHEERS.length]} message={question.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>Continue</button>
      </CheckBar>}
      {wrong && trust > 0 && <CheckBar status="incorrect" title="The crew’s not happy" message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="hs-end">
        <p className="hs-kicker">Busted</p>
        <h1 className="hs-title">The crew doesn’t trust your maths any more.</h1>
        <p className="hs-why"><span className="hs-why__tag">Tip</span>Count the shares first, not the people. Then one share is the take ÷ the number of shares.</p>
      </section>
      <footer className="hs-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => startJob(jobIndex)}>Try the job again</button>
      </footer>
    </>}

    {screen === 'payout' && <>
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

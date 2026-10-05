'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker, livesPerRound, IntroSplit } from '../kit/Lab'
import { isTestMode, useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { PICKS, makeTricks, type Round, type TrickStep } from './tricks'
import './MindReader.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'

const MO: Speaker = {
  name: 'Mystic Mo', emoji: '🔮',
  right: ['The spirits approve.', 'I FORESAW that answer.', 'Ooh, the ball is glowing.', 'You have… the gift.', 'Correct. As written in the stars.'],
  wrong: ['The mist is cloudy… try again.', 'The spirits are confused. So am I.', 'That’s not what the ball says. 🔮💨', 'Hmm. Bad signal from the beyond.'],
}
const INTROS = [
  'I see… a number… in your FUTURE. Pick one. Don’t tell me. I’ll know.',
  'What? You want to know how it works? A true mystic never reveals… oh no. Not the letters.',
  'Your mate thinks they can read minds too. Amateur. Let’s see how they do it.',
  'My rival uses TWO brackets. Thinks it makes the trick unbreakable. Bless them.',
  'The grand finale. A minus in front of a bracket. This one catches everyone. Even me, once. Twice.',
]
/** The start button for each trick. */
const STARTS = ['Play the trick', 'Use n', 'Crack it', 'Open them up', 'Prove it']
/** The busted tip for each trick: the slip that most often clouds the ball. */
const TIPS = [
  'Do one step at a time. × means lots of, ÷ means share into equal groups.',
  'Do each step to the whole thing. When you divide, it’s EVERY term, not just the first one.',
  'A number outside a bracket multiplies EVERYTHING inside. Then collect like terms.',
  'Expand each bracket on its own, then add n’s to n’s and numbers to numbers.',
  'A minus outside a bracket multiplies everything inside by a minus. Minus times minus is plus.',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🧠', name: 'Grand Mind Reader', line: 'Every trick cracked. Mo is looking for a new job.' },
  { badge: '🔮', name: 'Crystal Ball Pro', line: 'A cloudy moment or two, but you saw right through it.' },
  { badge: '🃏', name: 'Card Trick Apprentice', line: 'You got there. The magic is starting to make sense.' },
  { badge: '🎩', name: 'Rabbit Still in the Hat', line: 'The trick fooled you this time. Play again and pull the rabbit out.' },
]

/** The crystal ball shows where the trick is up to, with the trick's steps ticking off beside it. */
function Stage({ steps, at, swirl, reveal, caption }: { steps: TrickStep[]; at: number; swirl: boolean; reveal: boolean; caption?: string }) {
  const value = at < 0 ? '?' : steps[at].value
  const size = value.length > 11 ? ' is-xlong' : value.length > 6 ? ' is-long' : value.length > 3 ? ' is-mid' : ''
  return <div className="mr-stage">
    <figure className="mr-crystal" aria-label={`Crystal ball shows ${value}`}>
      <div className={`mr-ball${swirl ? ' is-swirl' : ''}${reveal ? ' is-revealed' : ''}`}>
        <span key={value} className={`mr-ball__value${size}`} aria-live="polite">{value}</span>
      </div>
      <div className="mr-stand" />
    </figure>
    <ol className="mr-steps" aria-label="The trick">
      {steps.map((step, index) => {
        const state = index <= at ? ' is-done' : index === at + 1 && !reveal ? ' is-next' : ''
        return <li key={step.op} className={`mr-step${state}`}>
          <span className="mr-step__tick" aria-hidden="true">{index <= at ? '✓' : index + 1}</span>
          <span className="mr-step__op">{step.op}</span>
        </li>
      })}
    </ol>
    {caption && <p className="mr-caption">{caption}</p>}
  </div>
}

export default function MindReader() {
  const { data, regenerate } = useGenerated(makeTricks)
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [pick, setPick] = useState<number | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [at, setAt] = useState(-1)
  const [swirl, setSwirl] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied, reset: resetShare } = useShare()
  const { pace } = useStepPace()
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (screen === 'done') recordRank('mind', rankFor(score.kept, data ? data.rest.length + 1 : 5, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) return <main className="lab" />

  // Round 1 is played with the number they tap; before that, the suggested one stands in for the intro.
  const rounds: Round[] = [data.first[(pick ?? data.suggest) - 1], ...data.rest]
  const round = rounds[roundIndex]
  const picking = roundIndex === 0 && pick === null
  const question = round.questions[questionIndex]
  const right = picked !== null && picked === question.answer
  const wrong = picked !== null && !right
  const nope = question.choices.find(choice => choice.value === picked)?.nope

  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setQuestionIndex(0); setAt(index === 0 ? -1 : 0)
    clearTimeout(timer.current); setSwirl(false); setPicked(null); setMissed(false); setRevealed(1)
    if (index === 0) setPick(null)
  }

  const begin = () => {
    sfx.tick(); setScreen('question')
    if (roundIndex > 0) setAt(round.questions[0].step - 1)
  }

  const choose = (number: number) => {
    sfx.bubble(); setPick(number); setAt(data.first[number - 1].questions[0].step - 1)
  }

  // The ball swirls, then shows the new value once the mist clears.
  const moveBall = (to: number) => {
    setSwirl(true)
    timer.current = setTimeout(() => { setAt(to); setSwirl(false) }, prefersReducedMotion() ? 0 : 550)
  }

  const answer = (value: string) => {
    setPicked(value)
    if (value === question.answer) {
      score.hit(!missed)
      moveBall(question.step)
      return
    }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1000)
  }

  const carryOn = () => {
    setPicked(null); setMissed(false)
    if (questionIndex + 1 < round.questions.length) {
      const next = round.questions[questionIndex + 1]
      setQuestionIndex(questionIndex + 1)
      // Steps between questions (like the + in round 1) happen by themselves.
      if (next.step - 1 > at) moveBall(next.step - 1)
      return
    }
    score.bank(); setAt(round.steps.length - 1); setScreen('payout'); sfx.win()
  }

  const restart = () => { score.reset(); resetShare(); regenerate(); startRound(0) }

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, RANKS)
    const brag = `I can read minds now (it’s algebra, don’t tell anyone). Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Mind Reader complete</p>
        <RankCard rank={rank} stats={[['Tricks', `${rounds.length}/${rounds.length}`], ['Lives kept', `${score.kept}/${rounds.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Use n for the number you don’t know.', 'Expand brackets: times EVERYTHING inside. − × − = +.', 'Collect like terms: n’s with n’s, numbers with numbers.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Mind Reader', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Read minds again</button>
        </div>
      </footer>
    </main>
  }

  return <main className="lab">
    <LabTop progress={`Trick ${roundIndex + 1}/${rounds.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <IntroSplit
        key={roundIndex}
        kicker={round.title}
        title={<>{round.heading}{round.tag && <> <span className="mr-eq">{round.tag}</span></>}</>}
        scene={<div className="lab-card rv-paper"><Stage steps={round.steps} at={roundIndex === 0 ? -1 : 0} swirl={false} reveal={false} /></div>}
        speaker={MO} line={INTROS[roundIndex]}
        why={round.why}
        start={STARTS[roundIndex] ?? 'Crack it'}
        onStart={begin}
      />
    </>}

    {screen === 'question' && picking && <>
      <section className="lab-card rv-paper"><Stage steps={round.steps} at={-1} swirl={false} reveal={false} /></section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{MO.emoji}</span> {MO.name} asks · I’m not looking, honest</p>
        <h1 className="lab-prompt">Think of a number from 1 to 10. Tap it.</h1>
        <div className="lab-choices mr-grid">
          {PICKS.map(number => <button key={number} type="button" className="lab-choice" data-correct={isTestMode() && number === data.suggest ? '' : undefined} onClick={() => choose(number)}>{number}</button>)}
        </div>
      </section>
    </>}

    {screen === 'question' && !picking && <>
      <section className="lab-card rv-paper"><Stage steps={round.steps} at={at} swirl={swirl} reveal={false} /></section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{MO.emoji}</span> {MO.name} asks · {question.ask}</p>
        <h1 className="lab-prompt">{question.prompt}</h1>
        <Choices choices={question.choices} picked={picked} answer={question.answer} onPick={value => answer(value as string)} />
        {right && <Combo streak={score.streak} />}
      </section>
      {right && <CheckBar status="correct" title={`${MO.emoji} “${say(MO.right, roundIndex * 3 + questionIndex)}”`} message={question.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{questionIndex + 1 < round.questions.length ? 'Next step' : 'Reveal the answer'}</button>
      </CheckBar>}
      {wrong && score.lives > 0 && <CheckBar status="incorrect" title={`${MO.emoji} “${say(MO.wrong, roundIndex + questionIndex + (3 - score.lives))}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🔮</span>
        <p className="lab-kicker">The ball went cloudy</p>
        <h1 className="lab-title">Mo can’t see a thing. Polish the ball and try again.</h1>
        <Why tag="Tip">{TIPS[roundIndex] ?? TIPS[1]}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Polish the ball</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <Burst key={round.id} emoji="✨" />
      <section className="lab-card rv-paper">
        <Stage steps={round.steps} at={round.steps.length - 1} swirl={false} reveal caption={round.caption} />
      </section>
      <section className="lab-card lab-card--working rv-paper">
        <h2 className="lab-working__title">The working</h2>
        <StepChain key={round.id} steps={round.chain} revealed={revealed} pace={pace} />
      </section>
      <footer className="lab-bar">
        <StepDots total={round.chain.length - 1} current={revealed - 1} onSelect={step => setRevealed(step + 1)} />
        <div className="lab-bar__actions">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-icon-btn" aria-label="Previous step" disabled={revealed === 1} onClick={() => setRevealed(revealed - 1)}>←</button>
          {revealed < round.chain.length
            ? <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => setRevealed(revealed + 1)}>{revealed === 1 ? 'Show the working' : 'Next step'}</button>
            : <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => roundIndex + 1 < rounds.length ? startRound(roundIndex + 1) : setScreen('done')}>
              {roundIndex + 1 < rounds.length ? 'Next trick' : 'Finish'}
            </button>}
        </div>
      </footer>
    </>}
  </main>
}

'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../../maths/step-chain/StepChain'
import { prefersReducedMotion } from '../../../maths/step-chain/flip'
import { Burst, Choices, Combo, IntroSplit, LabTop, RankCard, Rule, Why, livesPerRound, rankFor, recordRank, say, useScore, useShare, type Speaker } from '../../../maths/labs/kit/Lab'
import { NumberDial } from '../../../maths/labs/kit/NumberDial'
import { sfx } from '../../../maths/labs/kit/sfx'
import { SCIENCE_ARCADE_HREF } from '../catalog'
import { u, type Round, type Task } from './types'
import '../../../maths/labs/kit/lab.css'

/** set: dial live · go: the action is playing out · hit / miss: the result of their number */
export type Phase = 'set' | 'go' | 'hit' | 'miss'
type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'

export type StageProps<S> = { round: Round<S>; task: Task<S>; value: number; phase: Phase }

export type DialGameConfig<S> = {
  /** Saved best-rank key and analytics id: "science-sparky". */
  labId: string
  name: string
  speaker: Speaker
  /** The character's opening line for each round. */
  intros: string[]
  ranks: Parameters<typeof rankFor>[2]
  /** The end card: the method in three lines. */
  rule: string[]
  /** The How it works screen's start button: "Grab the tools". */
  start: string
  /** The main button under the dial: "Switch on". */
  action: string
  /** The small line over each question: "Sal · set it, then switch on". */
  asker: (task: Task<S>) => string
  busted: { emoji: string; kicker: string; title: string; tip: string; retry: string }
  /** What rains down on a right answer. */
  burst: string
  brag: (rankName: string, badge: string) => string
  again: string
  /** A sound as the action plays out. */
  sound?: () => void
  /** How long the action plays before the result, in ms. */
  actionMs?: number
  Stage: (props: StageProps<S>) => ReactNode
}

const motion = (ms: number) => prefersReducedMotion() ? 0 : ms

/**
 * One Science Arcade game: story → how it works → dial tasks (+ one side question) → the working,
 * five rounds, three lives a round, a rank at the end. The game supplies its rounds, its character
 * and its Stage (the picture that reacts to the dial).
 */
export function DialGame<S>({ rounds, onReplay, config }: { rounds: Round<S>[]; onReplay: () => void; config: DialGameConfig<S> }) {
  const { speaker, Stage } = config
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [taskIndex, setTaskIndex] = useState(0)
  const [onSide, setOnSide] = useState(false)
  const [value, setValue] = useState(rounds[0].tasks[0].start)
  const [phase, setPhase] = useState<Phase>('set')
  const [picked, setPicked] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied } = useShare()
  const { pace } = useStepPace()

  useEffect(() => {
    if (screen === 'done') recordRank(config.labId, rankFor(score.kept, rounds.length, config.ranks), config.ranks)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const round = rounds[roundIndex]
  const task = round.tasks[taskIndex]
  const side = round.side

  const setUp = (index: number, at: number) => {
    setTaskIndex(at); setValue(rounds[index].tasks[at].start); setPhase('set'); setMissed(false); setPicked(null)
  }
  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setOnSide(false); setRevealed(1); setUp(index, 0)
  }

  const go = () => {
    setPhase('go')
    ;(config.sound ?? sfx.stamp)()
    setTimeout(() => {
      if (Math.abs(value - task.answer) < 1e-9) { setPhase('hit'); score.hit(!missed); return }
      setPhase('miss'); setMissed(true)
      if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1100)
    }, motion(config.actionMs ?? 650))
  }

  const pick = (choice: string) => {
    if (!side) return
    setPicked(choice)
    if (choice === side.answer) { score.hit(!missed); return }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1000)
  }

  const carryOn = () => {
    if (taskIndex + 1 < round.tasks.length) { setUp(roundIndex, taskIndex + 1); return }
    if (side && !onSide) { setOnSide(true); setMissed(false); setPicked(null); return }
    score.bank(); setScreen('payout'); sfx.win()
  }

  const nextLabel = taskIndex + 1 < round.tasks.length ? 'Next job' : side && !onSide ? 'Bonus question' : 'See the working'

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, config.ranks)
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">{config.name} complete</p>
        <RankCard rank={rank} stats={[['Rounds', `${rounds.length}/${rounds.length}`], ['Lives kept', `${score.kept}/${rounds.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={config.rule} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share(config.name, config.brag(rank.name, rank.badge))}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onReplay}>{config.again}</button>
        </div>
      </footer>
    </main>
  }

  const last = round.tasks[round.tasks.length - 1]
  const worked = round.tasks[round.workingOn ?? round.tasks.length - 1]
  const sideRight = picked !== null && side !== null && picked === side.answer
  const sideWrong = picked !== null && !sideRight
  const tone = phase === 'hit' ? 'right' : phase === 'miss' ? 'wrong' : 'default'
  const mood = (offset: number) => roundIndex * 3 + taskIndex + offset

  return <main className="lab">
    <LabTop progress={`Round ${roundIndex + 1}/${rounds.length}`} streak={score.streak} lives={score.lives} home={SCIENCE_ARCADE_HREF} />

    {screen === 'intro' && <IntroSplit
      key={roundIndex}
      kicker={round.title}
      title={round.headline}
      scene={<div className="lab-card rv-paper"><Stage round={round} task={round.tasks[0]} value={round.tasks[0].start} phase="set" /></div>}
      speaker={speaker} line={config.intros[roundIndex]}
      why={round.why}
      start={config.start}
      onStart={() => { sfx.tick(); setScreen('question') }}
    />}

    {screen === 'question' && !onSide && <>
      <section className="lab-card rv-paper"><Stage round={round} task={task} value={value} phase={phase} /></section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{speaker.emoji}</span> {config.asker(task)}</p>
        <h1 className="lab-prompt">{task.prompt}</h1>
        <NumberDial label={task.label} value={value} onChange={setValue} min={task.min} max={task.max} step={task.step} jump={task.jump}
          format={v => u(v, task.unit)} target={task.answer} disabled={phase !== 'set'} tone={tone} />
        {phase === 'hit' && <Combo streak={score.streak} />}
      </section>
      {(phase === 'set' || phase === 'go') && <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={phase === 'go'} onClick={go}>{config.action}</button>
      </footer>}
      {phase === 'hit' && <>
        <Burst key={task.id} emoji={config.burst} />
        <CheckBar status="correct" title={`${speaker.emoji} “${say(speaker.right, mood(0))}”`} message={task.win}>
          <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{nextLabel}</button>
        </CheckBar>
      </>}
      {phase === 'miss' && score.lives > 0 && <CheckBar status="incorrect" title={`${speaker.emoji} “${say(speaker.wrong, mood(3 - score.lives))}”`} message={task.nope(value)}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPhase('set')}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'question' && onSide && side && <>
      <section className="lab-card rv-paper"><Stage round={round} task={last} value={last.answer} phase="hit" /></section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{speaker.emoji}</span> {speaker.name} asks · bonus</p>
        <h1 className="lab-prompt">{side.prompt}</h1>
        <Choices choices={side.choices} picked={picked} answer={side.answer} onPick={choice => pick(choice as string)} columns={1} />
        {sideRight && <Combo streak={score.streak} />}
      </section>
      {sideRight && <CheckBar status="correct" title={`${speaker.emoji} “${say(speaker.right, mood(1))}”`} message={side.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>See the working</button>
      </CheckBar>}
      {sideWrong && score.lives > 0 && <CheckBar status="incorrect" title={`${speaker.emoji} “${say(speaker.wrong, mood(3 - score.lives))}”`} message={side.choices.find(choice => choice.value === picked)?.nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">{config.busted.emoji}</span>
        <p className="lab-kicker">{config.busted.kicker}</p>
        <h1 className="lab-title">{config.busted.title}</h1>
        <Why tag="Tip">{config.busted.tip}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>{config.busted.retry}</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <section className="lab-card rv-paper"><Stage round={round} task={worked} value={worked.answer} phase="hit" /></section>
      <section className="lab-card lab-card--working rv-paper">
        <h2 className="lab-working__title">The working</h2>
        <StepChain key={round.id} steps={round.chain} revealed={revealed} pace={pace} />
      </section>
      <footer className="lab-bar">
        <StepDots total={round.chain.length - 1} current={revealed - 1} onSelect={line => setRevealed(line + 1)} />
        <div className="lab-bar__actions">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-icon-btn" aria-label="Previous step" disabled={revealed === 1} onClick={() => setRevealed(revealed - 1)}>←</button>
          {revealed < round.chain.length
            ? <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => setRevealed(revealed + 1)}>{revealed === 1 ? 'Show the working' : 'Next step'}</button>
            : <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => roundIndex + 1 < rounds.length ? startRound(roundIndex + 1) : setScreen('done')}>
              {roundIndex + 1 < rounds.length ? 'Next round' : 'Finish'}
            </button>}
        </div>
      </footer>
    </>}
  </main>
}

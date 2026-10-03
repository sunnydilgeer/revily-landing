'use client'

import { useEffect, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker, livesPerRound, IntroSplit } from '../kit/Lab'
import { NumberDial } from '../kit/NumberDial'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { makeRounds, n, type Forge, type Machine, type Round } from './rounds'
import './FormulaForge.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'
/** set: dial live · strike: hammer coming down · hit / miss: the result of their number */
type Phase = 'set' | 'strike' | 'hit' | 'miss'

const FLINT: Speaker = {
  name: 'Flint', emoji: '🔨',
  right: ['Hmph. That’ll do. Don’t let it go to your head.', 'Clean strike. I’ve seen worse. Mostly from me.', 'Right number. The knight might even pay this time.', 'Not bad. Not BAD. Fine, it’s good.', 'Forged. Next. I haven’t got all day.'],
  wrong: ['That blade just bent. Lovely.', 'You made a spoon. A sad, sad spoon.', 'Sparks everywhere and no sword. Again.', 'The knight would be better off with a stick.'],
}
const INTROS = [
  'Customers want damage numbers on every weapon. I want peace and quiet. Swap the letters for numbers and we both win.',
  'Some idiot cursed half my stock. Negative stats. Brackets on, eyes open.',
  'This is my forge machine. Ore in, damage out. Then the knights start asking for exact numbers. Of course they do.',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '⚔️', name: 'Master Smith', line: 'Every blade true, first strike. Flint almost smiled. Almost.' },
  { badge: '🛡️', name: 'Journeyman Smith', line: 'A bent blade or two, but the knights are armed.' },
  { badge: '🔥', name: 'Bellows Pumper', line: 'You got there. Flint’s still picking sparks out of his beard.' },
  { badge: '🥄', name: 'Spoon Maker', line: 'Everything came out spoon-shaped. Back to the anvil.' },
]
const motion = (ms: number) => prefersReducedMotion() ? 0 : ms

/** The weapon on the anvil: its formula, its stats as tags, and the damage stamped on once forged. */
function Anvil({ forge, value, phase }: { forge: Forge; value: number; phase: Phase }) {
  const shown = phase === 'hit' ? n(forge.answer) : phase === 'miss' ? n(value) : '?'
  return <figure className={`ff-anvil is-${phase}`} aria-label={`${forge.weapon.name}: ${forge.formula}, ${forge.stats.map(s => `${s.letter} = ${n(s.value)}`).join(', ')}`}>
    <p className="ff-formula">{forge.formula}</p>
    <ul className="ff-stats">
      {forge.stats.map(stat => <li key={stat.letter} className={`ff-tag${stat.value < 0 ? ' is-cursed' : ''}`}>
        <b>{stat.letter} = {n(stat.value)}</b><small>{stat.what}</small>
      </li>)}
    </ul>
    <div className="ff-bench" aria-hidden="true">
      <span className="ff-hammer">🔨</span>
      <span className="ff-weapon">{forge.weapon.emoji}</span>
      <span className="ff-sparks">✨</span>
      <div className="ff-block" />
    </div>
    <p className="ff-readout" aria-live="polite">D = <span>{shown}</span></p>
  </figure>
}

/** The function machine: x → × k → + c → y. The unknown end shows what's on the dial. */
function MachineView({ machine, forge, value, phase }: { machine: Machine; forge: Forge; value: number; phase: Phase }) {
  const forwards = forge.kind === 'forward'
  const known = n(forge.stats[0].value)
  const live = phase === 'hit' ? n(forge.answer) : phase === 'set' && value === forge.start ? '?' : n(value)
  const input = forwards ? known : live, output = forwards ? live : known
  return <figure className={`ff-machine is-${phase} is-${forge.kind}`} aria-label={`Function machine: ${input} in, times ${machine.k}, plus ${machine.c}, ${output} out.`}>
    <div className="ff-pipe">
      <span className={`ff-end${forwards ? '' : ' is-dial'}`}><small>in</small><b>{input}</b></span>
      <span className="ff-arrow" aria-hidden="true">→</span>
      <span className="ff-box">× {machine.k}</span>
      <span className="ff-arrow" aria-hidden="true">→</span>
      <span className="ff-box">+ {machine.c}</span>
      <span className="ff-arrow" aria-hidden="true">→</span>
      <span className={`ff-end${forwards ? ' is-dial' : ''}`}><small>out</small><b>{output}</b></span>
    </div>
    {!forwards && <p className="ff-back" aria-hidden="true">← undo: − {machine.c}, then ÷ {machine.k}</p>}
    <span className="ff-ore" aria-hidden="true">{phase === 'hit' ? '⚔️' : '🪨'}</span>
  </figure>
}

function Stage({ round, forge, value, phase }: { round: Round; forge: Forge; value: number; phase: Phase }) {
  return round.machine
    ? <MachineView machine={round.machine} forge={forge} value={value} phase={phase} />
    : <Anvil forge={forge} value={value} phase={phase} />
}

function FormulaForgeGame({ rounds, onReplay }: { rounds: Round[]; onReplay: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [forgeIndex, setForgeIndex] = useState(0)
  const [onSide, setOnSide] = useState(false)
  const [value, setValue] = useState(rounds[0].forges[0].start)
  const [phase, setPhase] = useState<Phase>('set')
  const [picked, setPicked] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied } = useShare()
  const { pace } = useStepPace()

  useEffect(() => {
    if (screen === 'done') recordRank('formula', rankFor(score.kept, rounds.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const round = rounds[roundIndex]
  const forge = round.forges[forgeIndex]
  const side = round.side

  const setUp = (index: number, at: number) => {
    setForgeIndex(at); setValue(rounds[index].forges[at].start); setPhase('set'); setMissed(false); setPicked(null)
  }
  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setOnSide(false); setRevealed(1); setUp(index, 0)
  }

  const strike = () => {
    setPhase('strike')
    sfx.stamp()
    setTimeout(() => {
      if (value === forge.answer) { setPhase('hit'); score.hit(!missed); return }
      setPhase('miss'); setMissed(true)
      if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1100)
    }, motion(550))
  }

  const pick = (choice: string) => {
    if (!side) return
    setPicked(choice)
    if (choice === side.answer) { score.hit(!missed); return }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1000)
  }

  const carryOn = () => {
    if (forgeIndex + 1 < round.forges.length) { setUp(roundIndex, forgeIndex + 1); return }
    if (side && !onSide) { setOnSide(true); setMissed(false); setPicked(null); return }
    score.bank(); setScreen('payout'); sfx.win()
  }

  const nextLabel = forgeIndex + 1 < round.forges.length ? 'Next order' : side && !onSide ? 'Bonus question' : 'See the working'

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, RANKS)
    const brag = `I forged a whole armoury with formulas in Formula Forge. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Formula Forge complete</p>
        <RankCard rank={rank} stats={[['Rounds', `${rounds.length}/${rounds.length}`], ['Lives kept', `${score.kept}/${rounds.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Swap each letter for its number. Brackets round negatives.', '3a means 3 × a. a² means a × a. Multiply before you add.', 'Function machine backwards: undo the last box first, with the opposite.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Formula Forge', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onReplay}>Forge again</button>
        </div>
      </footer>
    </main>
  }

  const last = round.forges[round.forges.length - 1]
  const sideRight = picked !== null && side !== null && picked === side.answer
  const sideWrong = picked !== null && !sideRight
  const tone = phase === 'hit' ? 'right' : phase === 'miss' ? 'wrong' : 'default'
  const mood = (offset: number) => roundIndex * 3 + forgeIndex + offset

  return <main className="lab">
    <LabTop progress={`Round ${roundIndex + 1}/${rounds.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <IntroSplit
        key={roundIndex}
        kicker={round.title}
        title={round.headline}
        scene={<div className="lab-card rv-paper"><Stage round={round} forge={round.forges[0]} value={round.forges[0].start} phase="set" /></div>}
        speaker={FLINT} line={INTROS[roundIndex]}
        why={round.why}
        start="Fire up the forge"
        onStart={() => { sfx.tick(); setScreen('question') }}
      />
    </>}

    {screen === 'question' && !onSide && <>
      <section className="lab-card rv-paper"><Stage round={round} forge={forge} value={value} phase={phase} /></section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{FLINT.emoji}</span> {FLINT.name} · {forge.kind === 'backward' ? 'run it backwards' : 'set it, then strike'}</p>
        <h1 className="lab-prompt">{forge.prompt}</h1>
        <NumberDial label={forge.label} value={value} onChange={setValue} min={forge.min} max={forge.max} step={forge.step} jump={forge.jump}
          format={n} target={forge.answer} disabled={phase !== 'set'} tone={tone} />
        {phase === 'hit' && <Combo streak={score.streak} />}
      </section>
      {(phase === 'set' || phase === 'strike') && <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={phase === 'strike'} onClick={strike}>Forge</button>
      </footer>}
      {phase === 'hit' && <>
        <Burst key={forge.id} emoji="✨" />
        <CheckBar status="correct" title={`${FLINT.emoji} “${say(FLINT.right, mood(0))}”`} message={forge.win}>
          <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{nextLabel}</button>
        </CheckBar>
      </>}
      {phase === 'miss' && score.lives > 0 && <CheckBar status="incorrect" title={`${FLINT.emoji} “${say(FLINT.wrong, mood(3 - score.lives))}”`} message={forge.nope(value)}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPhase('set')}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'question' && onSide && side && <>
      <section className="lab-card rv-paper"><Stage round={round} forge={last} value={last.answer} phase="hit" /></section>
      <section className="lab-ask ff-side">
        <p className="lab-asker"><span aria-hidden="true">{FLINT.emoji}</span> {FLINT.name} asks · bonus</p>
        <h1 className="lab-prompt">{side.prompt}</h1>
        <Choices choices={side.choices} picked={picked} answer={side.answer} onPick={choice => pick(choice as string)} columns={1} />
        {sideRight && <Combo streak={score.streak} />}
      </section>
      {sideRight && <CheckBar status="correct" title={`${FLINT.emoji} “${say(FLINT.right, mood(1))}”`} message={side.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>See the working</button>
      </CheckBar>}
      {sideWrong && score.lives > 0 && <CheckBar status="incorrect" title={`${FLINT.emoji} “${say(FLINT.wrong, mood(3 - score.lives))}”`} message={side.choices.find(choice => choice.value === picked)?.nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🥄</span>
        <p className="lab-kicker">Forge gone cold</p>
        <h1 className="lab-title">Three bent blades. Flint is selling spoons now.</h1>
        <Why tag="Tip">Write the hidden × signs back in: 3a is 3 × a. Put negatives in brackets. Multiply before you add. Backwards through a machine, undo the last box first.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Relight the forge</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <section className="lab-card rv-paper"><Stage round={round} forge={round.machine ? last : round.forges[0]} value={(round.machine ? last : round.forges[0]).answer} phase="hit" /></section>
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

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function FormulaForge() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <FormulaForgeGame key={play} rounds={data} onReplay={regenerate} /> : null
}

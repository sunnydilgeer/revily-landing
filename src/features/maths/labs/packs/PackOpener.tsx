'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker } from '../kit/Lab'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { makeRounds, openPacks, type Rarity, type Round } from './rounds'
import './PackOpener.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'
type Opening = { results: Rarity['id'][]; shown: number }

const JAX: Speaker = {
  name: 'Jackpot Jax', emoji: '🎰',
  right: ['Okay, okay, you know your stuff.', 'Maths? In MY pack shop?', 'Fine, you’re right. Still buying though?', 'Stop doing maths, it’s bad for business.'],
  wrong: ['YES! Keep buying! 🤑', 'That’s the spirit! (It isn’t.)', 'Love the optimism. Love your wallet more.', 'Jax likes this customer.'],
}
const INTROS = [
  'Welcome to Jax’s Packs! Legendaries EVERYWHERE! (Terms and conditions apply.)',
  'Twenty packs! You’re DEFINITELY getting loads. Probably. Maybe.',
  'Let’s go BIG. A thousand packs. What could possibly go wrong?',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🧠', name: 'Odds Genius', line: 'Jax can’t sell you anything. Your wallet thanks you.' },
  { badge: '🃏', name: 'Card Sharp', line: 'A slip or two, but you see through the hype.' },
  { badge: '🎲', name: 'Lucky Guesser', line: 'You got there. Keep an eye on those odds.' },
  { badge: '🤑', name: 'Jax’s Best Customer', line: 'Jax is buying a yacht with your money. Run it again.' },
]
const DURATION: Record<number, number> = { 20: 1800, 1000: 2600 }

function Odds({ rarities, legendaryKnown }: { rarities: Rarity[]; legendaryKnown: boolean }) {
  return <ul className="po-odds" aria-label="Pack odds">
    {rarities.map(rarity => {
      const hidden = rarity.id === 'legendary' && !legendaryKnown
      return <li key={rarity.id} className={`po-odds__row is-${rarity.id}`}>
        <span aria-hidden="true">{rarity.emoji}</span>
        <span className="po-odds__name">{rarity.name}</span>
        <strong className={hidden ? 'is-hidden' : ''}>{hidden ? '?' : `${Math.round(rarity.chance * 100)}%`}</strong>
      </li>
    })}
  </ul>
}

/** 20 packs: cards flip one by one. */
function PackGrid({ rarities, opening }: { rarities: Rarity[]; opening: Opening }) {
  return <ul className="po-grid" aria-label="Packs opened">
    {opening.results.map((id, i) => {
      const rarity = rarities.find(r => r.id === id)!
      const open = i < opening.shown
      return <li key={i} className={`po-card${open ? ` is-open is-${id}` : ''}`}>{open ? rarity.emoji : '🎁'}</li>
    })}
  </ul>
}

/** 1,000 packs: a live tally, with the real odds marked on each bar. */
function LongRun({ rarities, opening }: { rarities: Rarity[]; opening: Opening }) {
  const seen = opening.results.slice(0, opening.shown)
  return <div className="po-tally">
    <p className="po-tally__count">{opening.shown.toLocaleString('en-GB')} packs opened</p>
    {rarities.map(rarity => {
      const n = seen.filter(id => id === rarity.id).length
      const share = opening.shown ? n / opening.shown : 0
      return <div key={rarity.id} className={`po-bar is-${rarity.id}`}>
        <span className="po-bar__label">{rarity.emoji} {rarity.name}</span>
        <span className="po-bar__track">
          <span className="po-bar__fill" style={{ width: `${share * 100}%` }} />
          <span className="po-bar__target" style={{ left: `${rarity.chance * 100}%` }} aria-hidden="true" />
        </span>
        <span className="po-bar__n">{n}</span>
      </div>
    })}
    <p className="po-tally__key"><span className="po-bar__target po-bar__target--key" aria-hidden="true" /> = the real odds</p>
  </div>
}

function PackOpenerGame({ rounds, onReplay }: { rounds: Round[]; onReplay: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [missed, setMissed] = useState(false)
  const [oddsKnown, setOddsKnown] = useState(false)
  const [opening, setOpening] = useState<Opening | null>(null)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied, reset: resetShare } = useShare()
  const { pace } = useStepPace()
  const frame = useRef(0)

  const round = rounds[roundIndex]
  const question = round.questions[questionIndex]
  const right = picked !== null && picked === question.answer
  const wrong = picked !== null && !right
  const nope = question.choices.find(choice => choice.value === picked)?.nope
  const busy = !!opening && opening.shown < opening.results.length
  const legendaries = opening ? opening.results.filter(id => id === 'legendary').length : 0
  const expected20 = Math.round(round.odds[2].chance * 20)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  useEffect(() => {
    if (screen === 'done') recordRank('packs', rankFor(score.kept, rounds.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const open = (count: number) => {
    const results = openPacks(count, round.seeds[count], round.odds)
    if (prefersReducedMotion()) { setOpening({ results, shown: count }); return }
    setOpening({ results, shown: 0 })
    const start = performance.now()
    let ticked = 0
    const tick = (now: number) => {
      const shown = Math.min(count, Math.floor((now - start) / DURATION[count] * count))
      setOpening({ results, shown })
      if (count <= 20 && shown > ticked) { ticked = shown; if (results[shown - 1] === 'legendary') sfx.win(); else sfx.tick() }
      if (shown < count) frame.current = requestAnimationFrame(tick)
      else if (count > 20) sfx.coin()
    }
    frame.current = requestAnimationFrame(tick)
  }

  const startRound = (index: number) => {
    cancelAnimationFrame(frame.current)
    setRoundIndex(index); setScreen('intro'); setQuestionIndex(0); setPicked(null); setMissed(false); setOpening(null); setRevealed(1)
    if (index > 0) setOddsKnown(true)
  }

  const pick = (value: number) => {
    setPicked(value)
    if (value === question.answer) {
      score.hit(!missed)
      if (question.revealsOdds) setOddsKnown(true)
      if (question.open) open(question.open)
      return
    }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 900)
  }

  const carryOn = () => {
    setPicked(null); setMissed(false)
    if (questionIndex + 1 < round.questions.length) setQuestionIndex(questionIndex + 1)
    else { score.bank(); setScreen('payout'); sfx.win() }
  }

  const restart = onReplay

  /** What actually happened, next to what was expected. */
  const outcome = opening && !busy && question.open
    ? question.open === 20
      ? legendaries === expected20
        ? ` You got exactly ${expected20}. It won’t always land that neatly: chance wobbles.`
        : ` You got ${legendaries}. Chance wobbles: expected is the average, not a promise.`
      : ` You got ${legendaries}, which is ${(legendaries / 10).toFixed(1)}%. Over lots of packs it lands close to ${Math.round(round.odds[2].chance * 100)}%.`
    : ''

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, RANKS)
    const brag = `I worked out a legendary costs £${rounds[0].cost} on average. Jax couldn’t sell me anything. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Pack Opener complete</p>
        <RankCard rank={rank} stats={[['Packs opened', '1,020'], ['Lives kept', `${score.kept}/${rounds.length * 3}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['All the probabilities add up to 1 (100%).', 'Expected number = probability × number of tries.', 'More tries → results settle near the real odds.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Pack Opener', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Open again</button>
        </div>
      </footer>
    </main>
  }

  return <main className="lab">
    <LabTop progress={`Round ${roundIndex + 1}/${rounds.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <section className="lab-intro">
        <p className="lab-kicker">{round.title}</p>
        <h1 className="lab-title">{round.brief}</h1>
        <div className="lab-card rv-paper"><Odds rarities={round.odds} legendaryKnown={oddsKnown} /></div>
        <Quip speaker={JAX}>{INTROS[roundIndex]}</Quip>
        <Why>{round.why}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { sfx.tick(); setScreen('question') }}>Let’s see</button>
      </footer>
    </>}

    {screen === 'question' && <>
      <section className="lab-card rv-paper po-stage">
        {opening
          ? opening.results.length <= 20 ? <PackGrid rarities={round.odds} opening={opening} /> : <LongRun rarities={round.odds} opening={opening} />
          : <Odds rarities={round.odds} legendaryKnown={oddsKnown} />}
      </section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{JAX.emoji}</span> {JAX.name} wants to know</p>
        <h1 className="lab-prompt">{question.prompt}</h1>
        <Choices choices={question.choices} picked={picked} answer={question.answer} onPick={value => pick(value as number)} />
        {right && <Combo streak={score.streak} />}
      </section>
      {right && !busy && <CheckBar status="correct" title={`${JAX.emoji} “${say(JAX.right, roundIndex * 2 + questionIndex)}”`} message={question.why + outcome}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{questionIndex + 1 < round.questions.length ? 'Next question' : 'See the working'}</button>
      </CheckBar>}
      {wrong && score.lives > 0 && <CheckBar status="incorrect" title={`${JAX.emoji} “${say(JAX.wrong, roundIndex + questionIndex + (3 - score.lives))}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🤑</span>
        <p className="lab-kicker">Jax wins this one</p>
        <h1 className="lab-title">Out of lives. Jax is counting your money.</h1>
        <Why tag="Tip">The chances add to 100%. Expected number = probability × number of packs.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Try the round again</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <Burst key={round.id} emoji="🌟" />
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
              {roundIndex + 1 < rounds.length ? 'Next round' : 'Finish'}
            </button>}
        </div>
      </footer>
    </>}
  </main>
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function PackOpener() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <PackOpenerGame key={play} rounds={data} onReplay={regenerate} /> : null
}

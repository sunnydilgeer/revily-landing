'use client'

import { useEffect, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker, livesPerRound, IntroSplit } from '../kit/Lab'
import { gbp, useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { makeDeals, type Item, type Round, type Shows } from './deals'
import './DealOrSteal.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'

const SAL: Speaker = {
  name: 'Sale Sal', emoji: '📢',
  right: ['You actually checked? Nobody checks.', 'Ugh. Correct. (Terms apply.)', 'STOP DOING MATHS AT MY SALE!!!', 'Fine. FINE. That’s the real price.', 'My stickers are wasted on you.'],
  wrong: ['SOLD!!! To the person who didn’t check!', 'KER-CHING!!! My favourite customer!', 'NO REFUNDS!!! (Kidding. Have another go.)', 'BELIEVE THE STICKER!!! 🎉'],
}
const INTROS = [
  'WELCOME TO THE MEGA SALE!!! Everything is a DEAL!!! Probably!!! Don’t do any maths, just BUY!!!',
  'TWO shops, ONE item!!! Shop A has a GIANT sticker, so it MUST be cheaper!!! (Please do not check.)',
  'NEW!!! IMPROVED!!! Same thing, just MORE money!!! That’s how you know it’s better!!!',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🧾', name: 'Receipt Checker', line: 'Not one fake deal got past you. Sal is thinking of closing down.' },
  { badge: '🕵️', name: 'Bargain Detective', line: 'A slip or two, but you sniffed out every steal.' },
  { badge: '🏷️', name: 'Sticker Squinter', line: 'You got there. The big red stickers nearly had you.' },
  { badge: '🛒', name: 'Sal’s Favourite Customer', line: 'Sal is sending you a thank-you card. Run it again and check the maths.' },
]

type Stamp = 'deal' | 'steal'

/** One price tag. Once the real price is known, the old one gets slashed and the new one stamps on. */
function Tag({ shop, item, price, flat, sticker, rise, change, now, stamp }: {
  shop?: string; item: Item; price: number; flat?: boolean; sticker?: string; rise?: boolean; change?: string; now?: number; stamp?: Stamp
}) {
  return <div className={`ds-tag${stamp ? ` is-${stamp}` : ''}`}>
    <span className="ds-tag__hole" aria-hidden="true" />
    {shop && <p className="ds-tag__shop">{shop}</p>}
    <span className="ds-tag__item" aria-hidden="true">{item.emoji}</span>
    <p className="ds-tag__name">{item.name}</p>
    <p className={`ds-tag__was${now !== undefined ? ' is-slashed' : ''}`}>{flat && <span className="ds-tag__just">just </span>}<span className="ds-tag__amount">{gbp(price)}</span></p>
    {change && <p className={`ds-tag__change${rise ? ' is-rise' : ''}`}>{change}</p>}
    {now !== undefined && <p className="ds-tag__now">{gbp(now)}</p>}
    {sticker && <span className={`ds-sticker${rise ? ' is-rise' : ''}`} aria-hidden="true">{sticker}</span>}
    {stamp && <span className="ds-stamp">{stamp === 'deal' ? 'Real deal' : 'Steal'}</span>}
  </div>
}

/** The sale shelf: one tag, or Shop A and Shop B side by side. It fills in as the student answers. */
function Stage({ round, shown }: { round: Round; shown: Set<Shows> }) {
  const rise = round.kind === 'rise'
  const sticker = `${rise ? '+' : '−'}${round.percent}%`
  const change = shown.has('change') ? `${rise ? '+' : '−'}${gbp(round.change)}` : undefined
  const now = shown.has('final') ? round.final : undefined
  if (round.kind !== 'versus') return <div className="ds-stage" aria-live="polite">
    <Tag item={round.item} price={round.price} sticker={sticker} rise={rise} change={change} now={now} />
  </div>
  const verdict = shown.has('verdict')
  return <div className="ds-stage ds-stage--two" aria-live="polite">
    <Tag shop="Shop A" item={round.item} price={round.price} sticker={sticker} now={now}
      stamp={verdict ? (round.cheaper === 'A' ? 'deal' : 'steal') : undefined} />
    <Tag shop="Shop B" item={round.item} price={round.rival ?? 0} flat
      stamp={verdict ? (round.cheaper === 'B' ? 'deal' : 'steal') : undefined} />
  </div>
}

/** The one-line result under the tag on the payout screen. */
function verdictText(round: Round) {
  if (round.kind === 'off') return `You pay ${gbp(round.final)}. You save ${gbp(round.change)}.`
  if (round.kind === 'rise') return `New price ${gbp(round.final)}. That’s ${gbp(round.change)} more.`
  return `Shop ${round.cheaper} is the real deal.`
}

function DealOrStealGame({ rounds, onReplay }: { rounds: Round[]; onReplay: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [qIndex, setQIndex] = useState(0)
  const [picked, setPicked] = useState<number | string | null>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied, reset: resetShare } = useShare()
  const { pace } = useStepPace()

  const round = rounds[roundIndex]
  const question = round.questions[qIndex]
  const right = picked !== null && picked === question.answer
  const wrong = picked !== null && !right
  const nope = question.choices.find(choice => choice.value === picked)?.nope
  // Everything answered so far shows on the tag, including the answer just got right.
  const shown = new Set<Shows>(round.questions.slice(0, qIndex + (right ? 1 : 0)).map(asked => asked.shows))

  useEffect(() => {
    if (screen === 'done') recordRank('deals', rankFor(score.kept, rounds.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setQIndex(0); setPicked(null); setMissed(false); setRevealed(1)
  }

  const pick = (value: number | string) => {
    setPicked(value)
    if (value === question.answer) {
      score.hit(!missed)
      // The new price or the verdict stamps on just after the slash.
      if (question.shows !== 'change') setTimeout(sfx.stamp, prefersReducedMotion() ? 0 : 450)
      return
    }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1000)
  }

  const carryOn = () => {
    setPicked(null); setMissed(false)
    if (qIndex + 1 < round.questions.length) setQIndex(qIndex + 1)
    else { score.bank(); setScreen('payout'); sfx.win() }
  }

  const restart = () => { score.reset(); resetShare(); onReplay() }

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, RANKS)
    const brag = `I checked ${rounds.length} “mega deals” and Sale Sal couldn’t fool me. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Deal or Steal complete</p>
        <RankCard rank={rank} stats={[['Deals checked', `${rounds.length}/${rounds.length}`], ['Lives kept', `${score.kept}/${rounds.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Find 10% by ÷ 10 (or 25% by ÷ 4, 50% by ÷ 2).', 'Scale it up to the % you need.', 'Take it off for a discount, add it on for an increase.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Deal or Steal', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Shop again</button>
        </div>
      </footer>
    </main>
  }

  return <main className="lab">
    <LabTop progress={`Round ${roundIndex + 1}/${rounds.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <IntroSplit
        key={roundIndex}
        kicker={round.title}
        title={round.heading}
        scene={<div className="lab-card rv-paper"><Stage round={round} shown={new Set()} /></div>}
        speaker={SAL} line={INTROS[roundIndex]}
        why={round.why}
        start="Check the price"
        onStart={() => { sfx.tick(); setScreen('question') }}
      />
    </>}

    {screen === 'question' && <>
      <section className="lab-card rv-paper">
        <Stage round={round} shown={shown} />
      </section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{SAL.emoji}</span> {SAL.name} shouts · {round.kind === 'versus' ? 'which shop wins?' : 'trust the sticker!!!'}</p>
        <h1 className="lab-prompt">{question.prompt}</h1>
        <Choices choices={question.choices} picked={picked} answer={question.answer} onPick={pick} columns={question.choices.length} />
        {right && <Combo streak={score.streak} />}
      </section>
      {right && <CheckBar status="correct" title={`${SAL.emoji} “${say(SAL.right, roundIndex * 2 + qIndex)}”`} message={question.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{qIndex + 1 < round.questions.length ? 'Next question' : 'See the receipt'}</button>
      </CheckBar>}
      {wrong && score.lives > 0 && <CheckBar status="incorrect" title={`${SAL.emoji} “${say(SAL.wrong, roundIndex + qIndex + (3 - score.lives))}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🛒</span>
        <p className="lab-kicker">Sold!!!</p>
        <h1 className="lab-title">Sal sold you the fake deal. Grab your receipt and try again.</h1>
        <Why tag="Tip">Turn the % into pounds first: 10% is ÷ 10, 25% is ÷ 4, 50% is ÷ 2. Then take it off for a discount, or add it on for an increase.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Back to the sale</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <Burst key={round.id} emoji="🏷️" />
      <section className="lab-card rv-paper">
        <Stage round={round} shown={new Set(round.questions.map(asked => asked.shows))} />
        <p className="ds-verdict">{verdictText(round)}</p>
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
              {roundIndex + 1 < rounds.length ? 'Next round' : 'Finish'}
            </button>}
        </div>
      </footer>
    </>}
  </main>
}

export default function DealOrSteal() {
  const { data, regenerate } = useGenerated(makeDeals)
  // A fresh game (and fresh state) for every play, keyed so "Shop again" starts from round 1.
  const [play, setPlay] = useState(0)
  if (!data) return null
  return <DealOrStealGame key={play} rounds={data} onReplay={() => { regenerate(); setPlay(play + 1) }} />
}

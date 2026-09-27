'use client'

import { useEffect, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain } from '../../step-chain/StepChain'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, say, useAutoReveal, useScore, useShare, type Speaker, recordRank } from '../kit/Lab'
import { sfx } from '../kit/sfx'
import { TIERS, describe, lists, priceQuestion, ranked, showValue, unitChain, unitValue, type Deal, type TierList } from './lists'
import './TierLab.css'

type Screen = 'intro' | 'price' | 'rank' | 'busted' | 'done'

const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '👑', name: 'S-Tier Shopper', line: 'Flawless. No shop is ripping you off.' },
  { badge: '🛒', name: 'Deal Hunter', line: 'A slip or two, but you sniffed out every bargain.' },
  { badge: '🏷️', name: 'Bargain Curious', line: 'You got there. Always check the price of one.' },
  { badge: '💸', name: 'Rip-off Magnet', line: 'The shops love you. Run it again and fight back.' },
]

/** Del runs the shop. He wants your money, so he's gutted every time you get one right. */
const DEL: Speaker = {
  name: 'Del', emoji: '😏',
  right: ['Ugh. You’re good.', 'Stop checking the price of one!', 'There goes my profit.', 'Who told you about dividing?!', 'Fine. FINE.'],
  wrong: ['Ka-ching! Thanks for the money 🤑', 'Pleasure doing business.', 'Another happy customer.', 'I love a shopper who doesn’t check.'],
}
const PITCHES = [
  'Trust me, the “2 for £2.50” is a proper offer. It says OFFER on it.',
  'Everyone wants the 100 GB plan. Biggest is best, innit?',
  'Starter pack, perfect for you. Small price, big fun. Don’t look at the maths.',
]

/** The working for one deal, played a line at a time once they get it right. */
function DealWorking({ list, deal }: { list: TierList; deal: Deal }) {
  const steps = unitChain(list, deal)
  const revealed = useAutoReveal(steps.length, true, 700)
  return <StepChain steps={steps} revealed={revealed} />
}

function DealCard({ list, deal, priced, big = false }: { list: TierList; deal: Deal; priced: boolean; big?: boolean }) {
  return <div className={`tl-deal${big ? ' tl-deal--big' : ''}`}>
    <span className="tl-deal__emoji" aria-hidden="true">{deal.emoji}</span>
    <span className="tl-deal__name">{deal.name}</span>
    <span className="tl-deal__offer">{describe(list, deal)}</span>
    {priced && <span className="tl-deal__value">{showValue(list, unitValue(list, deal))}</span>}
  </div>
}

export default function TierLab() {
  const [listIndex, setListIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [dealIndex, setDealIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [missed, setMissed] = useState(false)
  const [placed, setPlaced] = useState<number[]>([])
  const [wrongTap, setWrongTap] = useState<number | null>(null)
  const [nope, setNope] = useState('')
  const score = useScore()
  const { share, copied, reset: resetShare } = useShare()

  const list = lists[listIndex]
  // Deals of one item have nothing to divide, so they arrive priced and skip the question.
  const toPrice = list.deals.map((deal, index) => ({ deal, index })).filter(({ deal }) => deal.amount > 1)
  const current = toPrice[dealIndex]
  const question = current && priceQuestion(list, current.deal, current.index)
  const right = picked !== null && question && picked === question.answer
  const wrong = picked !== null && !right
  const order = ranked(list)
  const complete = placed.length === list.deals.length

  const startList = (index: number) => {
    setListIndex(index); setScreen('intro'); setDealIndex(0); setPicked(null); setMissed(false); setPlaced([]); setWrongTap(null); setNope('')
  }

  const loseLife = (why: string) => {
    setNope(why); setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 900)
  }

  const pick = (value: number) => {
    setPicked(value)
    if (value === question!.answer) { score.hit(!missed); return }
    loseLife(question!.choices.find(choice => choice.value === value)?.nope ?? '')
  }

  const nextDeal = () => {
    setPicked(null); setMissed(false); setNope('')
    if (dealIndex + 1 < toPrice.length) setDealIndex(dealIndex + 1)
    else setScreen('rank')
  }

  const place = (index: number) => {
    if (complete || wrongTap !== null) return
    const deal = list.deals[index]
    const best = order[placed.length]
    if (deal === best) {
      const next = [...placed, index]
      setPlaced(next)
      sfx.tick()
      if (next.length === list.deals.length) { score.hit(!missed); sfx.win() }
      return
    }
    setWrongTap(index)
    const better = list.measure === 'cost' ? 'cheaper per ' + list.unit : `more ${list.unit === 'GB' ? 'GB' : list.unit + 's'} per £1`
    loseLife(`${best.name} is ${showValue(list, unitValue(list, best))}, which is ${better} than ${deal.name} at ${showValue(list, unitValue(list, deal))}.`)
  }

  const carryOn = () => {
    score.bank()
    if (listIndex + 1 < lists.length) startList(listIndex + 1)
    else setScreen('done')
  }

  const restart = () => { score.reset(); resetShare(); startList(0) }

  useEffect(() => {
    if (screen === 'done') recordRank('tiers', rankFor(score.kept, lists.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (screen === 'done') {
    const rank = rankFor(score.kept, lists.length, RANKS)
    const brag = `My tier lists are mathematically correct. Rank: ${rank.name} ${rank.badge} Prove me wrong.`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Tier lists complete</p>
        <RankCard rank={rank} stats={[['Lists', `${lists.length}/${lists.length}`], ['Lives kept', `${score.kept}/${lists.length * 3}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Don’t compare pack prices straight.', 'Find the price of one (or how many for £1).', 'Then compare like with like.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Value Tier List', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Rank again</button>
        </div>
      </footer>
    </main>
  }

  return <main className="lab">
    <LabTop progress={`List ${listIndex + 1}/${lists.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <section className="lab-intro">
        <p className="lab-kicker">Tier list</p>
        <h1 className="lab-title">{list.emoji} {list.title}: best value to worst</h1>
        <div className="tl-grid">
          {list.deals.map(deal => <DealCard key={deal.name} list={list} deal={deal} priced={false} />)}
        </div>
        <Quip speaker={DEL}>{PITCHES[listIndex]}</Quip>
        <Why>{list.why}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { sfx.tick(); setScreen(toPrice.length ? 'price' : 'rank') }}>Price them up</button>
      </footer>
    </>}

    {screen === 'price' && current && question && <>
      <p className="tl-count">Deal {dealIndex + 1} of {toPrice.length}</p>
      <section className="lab-card rv-paper tl-pricing">
        <DealCard list={list} deal={current.deal} priced={!!right} big />
        {right && <DealWorking list={list} deal={current.deal} />}
      </section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{DEL.emoji}</span> Del won’t tell you this bit</p>
        <h1 className="lab-prompt">{question.prompt}</h1>
        <Choices choices={question.choices} picked={picked} answer={question.answer} onPick={value => pick(value as number)} />
        {right && <Combo streak={score.streak} />}
      </section>
      {right && <CheckBar status="correct" title={`${DEL.emoji} “${say(DEL.right, listIndex * 4 + dealIndex)}”`} message={`${describe(list, current.deal)} works out at ${showValue(list, question.answer)}.`}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={nextDeal}>{dealIndex + 1 < toPrice.length ? 'Next deal' : 'Rank them'}</button>
      </CheckBar>}
      {wrong && score.lives > 0 && <CheckBar status="incorrect" title={`${DEL.emoji} “${say(DEL.wrong, listIndex + dealIndex)}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => { setPicked(null); setNope('') }}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'rank' && <>
      {complete && <Burst key={list.id} emoji={list.emoji} />}
      <section className="tl-board" aria-label="Tier list">
        {TIERS.map((tier, row) => {
          const index = placed[row]
          return <div key={tier} className={`tl-tier tl-tier--${tier}`}>
            <span className="tl-tier__label">{tier}</span>
            <div className="tl-tier__slot">
              {index !== undefined && <DealCard list={list} deal={list.deals[index]} priced />}
            </div>
          </div>
        })}
      </section>
      {!complete && <section className="lab-ask">
        <h1 className="lab-prompt">Tap the best value left</h1>
        <div className="tl-tray">
          {list.deals.map((deal, index) => placed.includes(index) ? null : <button
            key={deal.name}
            type="button"
            className={`tl-pick${wrongTap === index ? ' is-wrong' : ''}`}
            disabled={wrongTap !== null}
            onClick={() => place(index)}
          ><DealCard list={list} deal={deal} priced /></button>)}
        </div>
      </section>}
      {complete && <CheckBar status="correct" title={`${DEL.emoji} “${say(['You’ve ruined me.', 'I’m closing early.', 'Tell no one about this.'], listIndex)}”`} message={<>{list.lesson}<Combo streak={score.streak} /></>}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{listIndex + 1 < lists.length ? 'Next list' : 'Finish'}</button>
      </CheckBar>}
      {wrongTap !== null && score.lives > 0 && <CheckBar status="incorrect" title={`${DEL.emoji} “${say(DEL.wrong, listIndex + placed.length + 1)}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => { setWrongTap(null); setNope('') }}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">💸</span>
        <p className="lab-kicker">Ripped off</p>
        <h1 className="lab-title">The shop saw you coming.</h1>
        <Why tag="Tip">Divide the price by how many you get. That’s the price of one, and now the deals are fair to compare.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startList(listIndex) }}>Try this list again</button>
      </footer>
    </>}
  </main>
}

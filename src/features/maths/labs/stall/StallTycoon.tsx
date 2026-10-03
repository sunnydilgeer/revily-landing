'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useCountUp, useScore, useShare, type Speaker , livesPerRound } from '../kit/Lab'
import { NumberDial } from '../kit/NumberDial'
import { gbp, useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { cashOf, entriesSoFar, makeStall, type DialStep, type Entry, type Stall } from './days'
import './StallTycoon.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'
type Result = 'right' | 'wrong' | null

const ZIGGY: Speaker = {
  name: 'Ziggy', emoji: '🧢',
  right: ['Okay, you’re the brains AND the money.', 'Thousandaires, baby. THOUSANDAIRES.', 'I’m putting you on the business cards.', 'Genius. Did I hire you? I’m hiring you.', 'Now THAT’S cash flow.'],
  wrong: ['That’s not change, that’s charity!', 'My wallet just screamed.', 'ABORT. The money’s leaking!', 'Accountant? ACCOUNTANT?!'],
}
const INTROS = [
  'We’re gonna be MILLIONAIRES. Well. Thousandaires. Step one: stuff to sell.',
  'New stock, new prices. I want PROFIT, not vibes.',
  'Big day. Staff. Machines. Me in sunglasses. You do the sums, obviously.',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🏦', name: 'Market Mogul', line: 'Every penny where it should be. Ziggy wants to be you.' },
  { badge: '💼', name: 'Stall Boss', line: 'A wobble or two, but the cash came out right.' },
  { badge: '🧾', name: 'Trainee Trader', line: 'You got there. Ziggy is still recounting the till.' },
  { badge: '💸', name: 'Ziggy’s Accountant Quit', line: 'The money went everywhere. Run the stall again.' },
]
const CUSTOMERS = ['🧑', '🧓', '🧒']
const COMMIT_SOUND: Partial<Record<DialStep['kind'], () => void>> = { buy: sfx.stamp, price: sfx.whoosh, wage: sfx.stamp }

/** Counts from the number it showed last to the new one, so money visibly lands on the balance. */
function useTween(target: number, initial = target, ms = 800) {
  const [shown, setShown] = useState(initial)
  const from = useRef(initial)
  useEffect(() => {
    const start = from.current
    if (start === target) return
    if (prefersReducedMotion()) { from.current = target; setShown(target); return }
    let frame = 0
    const began = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - began) / ms)
      from.current = start + (target - start) * (1 - (1 - t) ** 3)
      setShown(from.current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, ms])
  return Math.round(shown * 100) / 100
}

const signed = (amount: number) => `${amount < 0 ? '−' : '+'}${gbp(Math.abs(amount))}`

/** The cash balance across all three days, with the latest money in or out dropping onto it. */
function Ledger({ entries, cash, landing = 0 }: { entries: Entry[]; cash: number; landing?: number }) {
  // `landing`: money that has only just arrived, so the balance counts it on from before.
  const shown = useTween(cash, cash - landing)
  const last = entries[entries.length - 1]
  return <div className="st-ledger" aria-label={`Cash ${gbp(cash)}`}>
    <span className="st-ledger__label">💷 Cash</span>
    <span className="st-ledger__cash" aria-hidden="true">{gbp(shown)}</span>
    {last && <span key={entries.length} className={`st-ledger__entry ${last.amount < 0 ? 'is-out' : 'is-in'}`}>{signed(last.amount)} · {last.note}</span>}
  </div>
}

type Customer = { face: string; mood: string | null; leaving: boolean; holds: string | null; paid: boolean }
type View = {
  crates: number
  label: string | null
  crateState?: 'is-bad' | 'is-sold'
  /** Price tag on the counter: a number, '?' while it's unknown, or none. */
  tag: number | '?' | null
  customer: Customer | null
  helper: string | null
  upgrade: 'none' | 'forsale' | 'bought'
}

/** The stall: striped awning, stock in crates of five, a price tag, the till, and whoever turns up. */
function StallFront({ stall, view, coins }: { stall: Stall; view: View; coins: number }) {
  const { stock } = stall
  const crates = Math.min(10, Math.ceil(view.crates / 5))
  return <figure className="st-stall" aria-label={`${stock.name} stall${view.label ? `: ${view.label}` : ''}`}>
    <div className="st-awning" aria-hidden="true" />
    <p className="st-sign">{stock.emoji} Ziggy’s {stock.name}</p>
    <div className="st-front">
      <div className="st-booth">
        <div className="st-shelf">
          {Array.from({ length: crates }, (_, i) => <span key={i} className={`st-crate ${view.crateState ?? ''}`} style={{ animationDelay: `${i * 60}ms` }} aria-hidden="true">{stock.emoji}</span>)}
          {view.crates > 50 && <span className="st-more" aria-hidden="true">+</span>}
          {view.helper && <span className="st-helper" aria-hidden="true">🧑‍🍳<span className="st-mood">{view.helper}</span></span>}
          {view.upgrade !== 'none' && <span className={`st-upgrade is-${view.upgrade}`} aria-hidden="true">{stock.upgradeEmoji}</span>}
        </div>
        {view.label && <p className="st-count">{view.label}</p>}
        <div className="st-counter">
          {view.tag !== null && <span key={String(view.tag)} className="st-tag">{view.tag === '?' ? '£?' : gbp(view.tag)}<small> each</small></span>}
          <span className="st-till" aria-hidden="true">{'🪙'.repeat(coins)}</span>
        </div>
      </div>
      <div className="st-lane">
        {view.customer && <span className={`st-customer${view.customer.leaving ? ' is-leaving' : ''}`} aria-hidden="true">
          {view.customer.holds && <span className="st-bubble">{view.customer.holds}</span>}
          {view.customer.mood && <span className="st-bubble st-bubble--mood">{view.customer.mood}</span>}
          {view.customer.face}
          {view.customer.paid && <span className="st-coins-fly">🪙🪙</span>}
        </span>}
      </div>
    </div>
  </figure>
}

/** Day 2's sales: takings climb, then the profit line lands. */
function Takings({ n, price, costs, want }: { n: number; price: number; costs: number; want: number }) {
  const takings = n * price, profit = takings - costs
  const shown = useCountUp(takings * 100, true, 1200) / 100
  const good = profit === want
  return <div className={`st-panel ${good ? 'is-good' : 'is-bad'}`} aria-label={`Takings ${gbp(takings)} minus costs ${gbp(costs)} is ${profit < 0 ? 'a loss of' : 'profit'} ${gbp(Math.abs(profit))}`}>
    <p className="st-panel__sum" aria-hidden="true">
      <span>In <b>{gbp(Math.round(shown * 100) / 100)}</b></span>
      <span>− Out <b>{gbp(costs)}</b></span>
      <span>= <b className="st-panel__result">{profit < 0 ? `−${gbp(-profit)}` : gbp(profit)}</b></span>
    </p>
    <p className="st-panel__note">Ziggy wanted {gbp(want)} profit {good ? '✅' : '❌'}</p>
  </div>
}

/** Day 3's payback meter: one block per day of extra money, filling up towards what the upgrade cost. */
function Payback({ days, per, cost }: { days: number; per: number; cost: number }) {
  const made = days * per
  const scale = Math.max(cost, made)
  return <div className={`st-panel ${made === cost ? 'is-good' : 'is-bad'}`}>
    <div className="st-meter" aria-label={`${days} days of ${gbp(per)} makes ${gbp(made)}; the upgrade cost ${gbp(cost)}`}>
      <span className="st-meter__cost" style={{ width: `${cost / scale * 100}%` }} />
      {Array.from({ length: days }, (_, i) => <span key={i} className={`st-meter__day${(i + 1) * per > cost ? ' is-over' : ''}`} style={{ left: `${i * per / scale * 100}%`, width: `${per / scale * 100}%`, animationDelay: `${i * 120}ms` }} />)}
    </div>
    <p className="st-panel__note">{days} × {gbp(per)} = {gbp(made)} of {gbp(cost)} {made === cost ? '✅' : '❌'}</p>
  </div>
}

function StallTycoonGame({ stall, onReplay }: { stall: Stall; onReplay: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [stepIndex, setStepIndex] = useState(0)
  const [value, setValue] = useState(() => (stall.days[0].steps[0] as DialStep).start)
  const [committed, setCommitted] = useState<number | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [result, setResult] = useState<Result>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied } = useShare()
  const { pace } = useStepPace()

  const { stock, n } = stall
  const day = stall.days[roundIndex]
  const step = day.steps[stepIndex]
  const over = screen === 'payout' || screen === 'done'
  const entries = entriesSoFar(stall, roundIndex, over ? day.steps.length : stepIndex + (result === 'right' ? 1 : 0), over)
  const cash = cashOf(stall, entries)
  const coins = Math.max(1, Math.min(5, Math.round(cash / 50)))

  useEffect(() => {
    if (screen === 'done') recordRank('stall', rankFor(score.kept, stall.days.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setStepIndex(0); setResult(null); setCommitted(null); setPicked(null); setMissed(false); setRevealed(1)
    setValue((stall.days[index].steps[0] as DialStep).start)
  }

  const fail = () => {
    setResult('wrong'); setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1400)
  }

  const commit = () => {
    if (step.kind === 'worth') return
    setCommitted(value)
    if (value === step.answer) { setResult('right'); score.hit(!missed); COMMIT_SOUND[step.kind]?.() }
    else fail()
  }

  const pick = (choice: number | string) => {
    if (step.kind !== 'worth') return
    setPicked(String(choice))
    if (choice === step.answer) { setResult('right'); score.hit(!missed) }
    else fail()
  }

  const carryOn = () => {
    setResult(null); setCommitted(null); setPicked(null); setMissed(false)
    const next = day.steps[stepIndex + 1]
    if (next) { setStepIndex(stepIndex + 1); if (next.kind !== 'worth') setValue(next.start) }
    else { score.bank(); setScreen('payout'); sfx.win() }
  }

  // Try again keeps their dial where it was, so they adjust rather than start over.
  const retry = () => { setResult(null); setCommitted(null); setPicked(null) }

  if (screen === 'done') {
    const rank = rankFor(score.kept, stall.days.length, RANKS)
    const brag = `I turned ${gbp(n.start)} into ${gbp(cash)} running a ${stock.name.toLowerCase()} stall. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Stall Tycoon complete</p>
        <RankCard rank={rank} stats={[['Final cash', gbp(cash)], ['Lives kept', `${score.kept}/${stall.days.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Total cost = price each × how many', 'Change = what they paid − what it cost', 'Profit = money in − money out']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Stall Tycoon', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onReplay}>Trade again</button>
        </div>
      </footer>
    </main>
  }

  /** What the stall looks like right now: the student's committed value plays out on it. */
  const viewNow = (): View => {
    const v = committed ?? 0
    const done = result !== null
    if (roundIndex === 0) {
      if (screen === 'payout') return { crates: 0, label: `Sold out: ${n.q} ${stock.items}`, tag: n.p, customer: null, helper: null, upgrade: 'none' }
      if (screen !== 'question' || stepIndex === 0) {
        return { crates: done ? v : 0, label: done ? `${v} ${stock.items}` : null, crateState: result === 'wrong' ? 'is-bad' : undefined, tag: null, customer: null, helper: null, upgrade: 'none' }
      }
      const mood = result === 'right' ? '😊' : result === 'wrong' ? (v < n.change ? '😠' : '😏') : null
      return {
        crates: n.q, label: `${n.q} ${stock.items}`, tag: n.p, helper: null, upgrade: 'none',
        customer: { face: CUSTOMERS[0], mood, leaving: done, holds: done ? null : `${n.k}× ${stock.emoji}\n💷 ${gbp(n.N)}`, paid: done },
      }
    }
    if (roundIndex === 1) {
      if (screen === 'payout') return { crates: 0, label: `Sold out: ${n.n} ${stock.items}`, tag: n.s, customer: null, helper: null, upgrade: 'none' }
      if (screen !== 'question' || stepIndex === 0) {
        return { crates: n.n, label: `${n.n} ${stock.items} · ${gbp(n.C)} bill`, tag: result === 'right' ? n.e : '?', customer: null, helper: null, upgrade: 'none' }
      }
      return { crates: n.n, label: done ? `${n.n} sold at ${gbp(v)}` : `${n.n} ${stock.items}`, crateState: done ? 'is-sold' : undefined, tag: done ? v : value, customer: done ? { face: CUSTOMERS[1], mood: result === 'right' ? '😊' : '🤨', leaving: false, holds: null, paid: false } : null, helper: null, upgrade: 'none' }
    }
    const fresh = { crates: n.n, label: null, tag: n.s, customer: null }
    if (screen === 'payout') return { ...fresh, helper: '😄', upgrade: n.worth ? 'bought' : 'none' }
    if (screen !== 'question' || stepIndex === 0) {
      return { ...fresh, upgrade: 'none', helper: result === 'right' ? '😄' : result === 'wrong' ? (v < n.wage ? '😤' : '🤑') : '🙂' }
    }
    const bought = stepIndex === 2 && result === 'right' && n.worth
    return { ...fresh, helper: '😄', upgrade: bought ? 'bought' : stepIndex === 2 && result === 'right' ? 'none' : 'forsale' }
  }

  /** One short line under the stall saying how their move went. */
  const callout = (): { text: string; good: boolean } | null => {
    if (result === null || screen !== 'question') return null
    const v = committed ?? 0, good = result === 'right'
    switch (step.kind) {
      case 'buy': return good ? { text: `${n.q} ${stock.items} for ${gbp(n.B)}. Spent to the penny.`, good }
        : v === 0 ? { text: 'Nothing bought. Empty stall, empty pockets.', good }
        : v * n.c > n.B ? { text: `That’s ${gbp(v * n.c)} of stock. The budget is ${gbp(n.B)}!`, good }
          : { text: `Only ${gbp(v * n.c)} spent. ${gbp(n.B - v * n.c)} sitting idle.`, good }
      case 'change': return good ? { text: `${gbp(v)} change. Happy customer!`, good }
        : v < n.change ? { text: `${gbp(v)} change? Short-changed! They storm off.`, good } : { text: `${gbp(v)} change?! They leg it, grinning.`, good }
      case 'wage': return good ? { text: `${gbp(v)} for ${n.h} hours. Fair pay.`, good }
        : v < n.wage ? { text: `${gbp(v)}? The helper is fuming.`, good } : { text: `${gbp(v)}? The helper can’t believe their luck.`, good }
      case 'worth': return good
        ? { text: n.worth ? `${stock.upgrade[0].toUpperCase()}${stock.upgrade.slice(1)} installed!` : `Skipped. Money stays in the till.`, good }
        : { text: picked === 'yes' ? 'That would lose money.' : 'That’s free money left on the table.', good }
      default: return null
    }
  }

  const panel = () => {
    if (screen !== 'question' || result === null || committed === null) return null
    if (step.kind === 'each') {
      const total = n.n * committed
      return <div className={`st-panel ${total === n.C ? 'is-good' : 'is-bad'}`}>
        <p className="st-panel__sum"><span>🧾 {n.n} × {gbp(committed)} = <b>{gbp(total)}</b></span></p>
        <p className="st-panel__note">The bill says {gbp(n.C)} {total === n.C ? '✅' : '❌'}</p>
      </div>
    }
    if (step.kind === 'price') return <Takings key={committed} n={n.n} price={committed} costs={n.C} want={n.P} />
    if (step.kind === 'payback') return <Payback key={committed} days={committed} per={n.x} cost={n.U} />
    return null
  }

  const stage = (extra?: ReactNode) => {
    const said = callout()
    return <section className="lab-card rv-paper st-stage">
      <Ledger entries={entries} cash={cash} landing={screen === 'payout' ? day.close.reduce((sum, entry) => sum + entry.amount, 0) : 0} />
      <StallFront stall={stall} view={viewNow()} coins={coins} />
      {extra}
      {said && <p key={`${roundIndex}-${stepIndex}-${committed}-${picked}`} className={`st-callout ${said.good ? 'is-good' : 'is-bad'}`} role="status">{said.text}</p>}
    </section>
  }

  const nope = result === 'wrong'
    ? step.kind === 'worth' ? step.choices.find(choice => choice.value === picked)?.nope : step.nope(committed ?? 0)
    : undefined
  const today = entriesSoFar(stall, roundIndex, day.steps.length, true).slice(entriesSoFar(stall, roundIndex, 0, false).length)

  return <main className="lab">
    <LabTop progress={`Day ${roundIndex + 1}/${stall.days.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <section className="lab-intro">
        <p className="lab-kicker">{day.title}</p>
        <h1 className="lab-title">{day.headline}</h1>
        {stage()}
        <Quip speaker={ZIGGY}>{INTROS[roundIndex]}</Quip>
        <Why>{day.why}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { sfx.tick(); setScreen('question') }}>{roundIndex === 0 ? 'Open the stall' : 'Start the day'}</button>
      </footer>
    </>}

    {screen === 'question' && <>
      {stage(panel())}
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{ZIGGY.emoji}</span> {ZIGGY.name} asks · {step.asker}</p>
        <h1 className="lab-prompt">{step.prompt}</h1>
        {step.kind === 'worth'
          ? <Choices choices={step.choices} picked={picked} answer={step.answer} onPick={pick} />
          : <NumberDial
            label={step.label}
            value={value}
            onChange={setValue}
            min={step.min}
            max={step.max}
            step={step.step}
            jump={step.jump}
            format={step.money ? gbp : String}
            target={step.answer}
            disabled={result !== null}
            tone={result ?? 'default'}
          />}
        {result === 'right' && <Combo streak={score.streak} />}
      </section>
      {result === null && step.kind !== 'worth' && <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={commit}>{step.commit}</button>
      </footer>}
      {result === 'right' && <CheckBar status="correct" title={`${ZIGGY.emoji} “${say(ZIGGY.right, roundIndex * 3 + stepIndex)}”`} message={step.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{stepIndex + 1 < day.steps.length ? 'Next' : 'Cash up'}</button>
      </CheckBar>}
      {result === 'wrong' && score.lives > 0 && <CheckBar status="incorrect" title={`${ZIGGY.emoji} “${say(ZIGGY.wrong, roundIndex + stepIndex + (3 - score.lives))}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={retry}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">💸</span>
        <p className="lab-kicker">Gone bust</p>
        <h1 className="lab-title">Three money mess-ups. Ziggy’s selling the awning.</h1>
        <Why tag="Tip">Cost = price each × how many. Change = what they paid − the cost. Sharing a total out equally is divide. Profit = money in − money out.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Reopen the stall</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <Burst key={day.id} emoji="💸" />
      {stage(<ul className="st-day" aria-label={`Day ${roundIndex + 1} money`}>
        {today.map((entry, i) => <li key={i} className={entry.amount < 0 ? 'is-out' : 'is-in'}><span>{entry.note}</span><b>{signed(entry.amount)}</b></li>)}
        <li className="st-day__net"><span>Day {roundIndex + 1} total</span><b>{signed(today.reduce((sum, entry) => sum + entry.amount, 0))}</b></li>
      </ul>)}
      <section className="lab-card lab-card--working rv-paper">
        <h2 className="lab-working__title">The working</h2>
        <StepChain key={day.id} steps={day.chain} revealed={revealed} pace={pace} />
      </section>
      <footer className="lab-bar">
        <StepDots total={day.chain.length - 1} current={revealed - 1} onSelect={line => setRevealed(line + 1)} />
        <div className="lab-bar__actions">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-icon-btn" aria-label="Previous step" disabled={revealed === 1} onClick={() => setRevealed(revealed - 1)}>←</button>
          {revealed < day.chain.length
            ? <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => setRevealed(revealed + 1)}>{revealed === 1 ? 'Show the working' : 'Next step'}</button>
            : <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => roundIndex + 1 < stall.days.length ? startRound(roundIndex + 1) : setScreen('done')}>
              {roundIndex + 1 < stall.days.length ? 'Next day' : 'Finish'}
            </button>}
        </div>
      </footer>
    </>}
  </main>
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function StallTycoon() {
  const { data, play, regenerate } = useGenerated(makeStall)
  return data ? <StallTycoonGame key={play} stall={data} onReplay={regenerate} /> : null
}

'use client'

import { useEffect, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker, livesPerRound, IntroSplit } from '../kit/Lab'
import { NumberDial } from '../kit/NumberDial'
import { isTestMode, useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { DAY_NAMES, MAX_MINUTES, dialNope, makeRounds, meanOf, medianOf, modeOf, rigNope, type Round, type Stat, type Table } from './rounds'
import './RigTheStats.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'

const KAI: Speaker = {
  name: 'Kai', emoji: '😬',
  right: ['You’re a genius. A criminal genius.', 'Okay. Okay. I might survive this.', 'Breathing again. Thank you.', 'Stats wizard. I owe you chips.', 'Nobody will ever know. Probably.'],
  wrong: ['That makes it WORSE.', 'Nope nope nope. That’s going in the group chat.', 'I’m literally sweating right now.', 'If Mum sees THAT, I’m DONE.'],
}
const INTROS = [
  'If Mum sees this I’m DONE. She wants my average screen time. Work out how bad it is first.',
  'Now it’s the whole week. They want the “usual” day. Turns out there’s more than one kind of average.',
  'Here’s the plan. I change ONE day. Just one. You make the mean land exactly where I need it.',
  'New rule from Mum: my mean this week has to be EXACTLY her limit. Six days are done. How much can I squeeze into Sunday?',
  'Mum went full detective. She made a frequency table of my screen time. Crack this and you can crack the exam one too.',
]
/** The start button on each round's intro. */
const STARTS = ['Crunch it', 'Crunch it', 'Rig it', 'Rig it', 'Crunch it']
const TIP_AVERAGES = 'Mean: add them all, ÷ how many. Median: put them in order first, then take the middle. Mode: the one that repeats. Range: biggest − smallest.'
/** The busted screen's tip for each round. */
const TIPS = [
  TIP_AVERAGES, TIP_AVERAGES, TIP_AVERAGES,
  'Work backwards: the total = mean × how many days. Take off the days you know. What’s left is the missing day.',
  'Frequency table: hours × days on every row, add those up, then ÷ the total number of DAYS, not the 5 rows. Mode = the hours with the most days.',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🕵️', name: 'Stats Mastermind', line: 'Flawless. Kai’s parents suspect nothing.' },
  { badge: '🧮', name: 'Number Fixer', line: 'A wobble or two, but the stats came out clean.' },
  { badge: '😅', name: 'Nervous Accomplice', line: 'You got there. Kai is still sweating.' },
  { badge: '📉', name: 'Caught Red-Handed', line: 'The real numbers got out. Run it again.' },
]
const STAT_NAMES: Record<Stat, string> = { mean: 'Mean', median: 'Median', mode: 'Mode', range: 'Range' }
const GRID = [60, 120, 180, 240, 300]

const pct = (minutes: number) => `${(minutes / MAX_MINUTES) * 100}%`

/**
 * Kai's screen time as a bar chart. Stats appear on it as they're found: a dashed mean line, the
 * median bar(s) in yellow, the mode bars sharing teal, and a bracket from the shortest to the tallest.
 */
function Chart({ days, values, known, sorted, rig, panic, missing = false }: {
  days: string[]; values: number[]; known: Stat[]; sorted: boolean; rig: number | null; panic: boolean
  /** The rigged day hasn't been set yet: show it as a question mark. */
  missing?: boolean
}) {
  const n = values.length
  const order = values.map((_, i) => i).sort((a, b) => values[a] - values[b] || a - b)
  const mid = Math.floor(n / 2)
  const middle = n % 2 ? [order[mid]] : [order[mid - 1], order[mid]]
  const mean = meanOf(values), median = medianOf(values), mode = modeOf(values)
  const hi = Math.max(...values), lo = Math.min(...values)
  const shows = (stat: Stat) => known.includes(stat)
  const reading: Record<Stat, number | null> = { mean: Math.round(mean), median, mode, range: hi - lo }

  return <figure className={`rs-chart${panic ? ' is-panic' : ''}`} aria-label={`Screen time: ${days.map((day, i) => `${day} ${missing && rig === i ? 'unknown' : values[i]} minutes`).join(', ')}`}>
    <div className="rs-plot">
      {GRID.map(line => <span key={line} className="rs-grid" style={{ bottom: pct(line) }}><span>{line / 60}h</span></span>)}
      {values.map((value, i) => {
        const classes = ['rs-bar',
          shows('median') && middle.includes(i) && 'is-median',
          shows('mode') && value === mode && 'is-mode',
          rig === i && 'is-rig',
          missing && rig === i && 'is-missing'].filter(Boolean).join(' ')
        return <div key={i} className={classes} style={{ left: `${((sorted ? order.indexOf(i) : i) * 100) / n}%`, width: `${100 / n}%` }}>
          <span className="rs-bar__fill" style={{ height: pct(value) }}><span className="rs-bar__mins">{missing && rig === i ? '?' : value}</span></span>
          <span className="rs-bar__day">{days[i]}</span>
        </div>
      })}
      {shows('mean') && <span className="rs-mean" style={{ bottom: pct(mean) }} />}
      {shows('range') && <span className="rs-range" style={{ bottom: pct(lo), height: pct(hi - lo) }} />}
    </div>
    <ul className="rs-readout" aria-live="polite">
      {(['mean', 'median', 'mode', 'range'] as Stat[]).filter(shows).map(stat =>
        <li key={stat} className={`rs-key rs-key--${stat}`}>{STAT_NAMES[stat]} <b>{reading[stat]}</b></li>)}
    </ul>
  </figure>
}

/**
 * Round 5's frequency table: hours a day, how many days, and an hours × days column that fills in once
 * the total is found. The mean shows underneath once it's set, and the modal row lights up teal.
 */
function FreqTable({ table, shows, known, panic }: { table: Table; shows: ('total' | 'mean')[]; known: Stat[]; panic: boolean }) {
  const products = table.hours.map((h, i) => h * table.days[i])
  const n = table.days.reduce((a, b) => a + b, 0), sum = products.reduce((a, b) => a + b, 0)
  const top = Math.max(...table.days)
  const showTotal = shows.includes('total'), showMode = known.includes('mode')
  return <figure className={`rs-chart${panic ? ' is-panic' : ''}`}>
    <table className="rs-table">
      <thead><tr><th scope="col">Hours a day</th><th scope="col">Days</th><th scope="col">Hours × days</th></tr></thead>
      <tbody>
        {table.hours.map((h, i) => <tr key={h} className={showMode && table.days[i] === top ? 'is-mode' : ''}>
          <th scope="row">{h}</th>
          <td>{table.days[i]}</td>
          <td className={showTotal ? 'is-found' : 'is-blank'}>{showTotal ? products[i] : '?'}</td>
        </tr>)}
        <tr className="rs-table__total"><th scope="row">Total</th><td>{n}</td><td className={showTotal ? 'is-found' : 'is-blank'}>{showTotal ? sum : '?'}</td></tr>
      </tbody>
    </table>
    <ul className="rs-readout" aria-live="polite">
      {shows.includes('mean') && <li className="rs-key rs-key--mean">Mean <b>{sum / n} h</b></li>}
      {showMode && <li className="rs-key rs-key--mode">Mode <b>{table.hours[table.days.indexOf(top)]} h</b></li>}
    </ul>
  </figure>
}

export default function RigTheStats() {
  const { data: rounds, regenerate } = useGenerated(makeRounds)
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [stepIndex, setStepIndex] = useState(0)
  const [picked, setPicked] = useState<number | string | null>(null)
  const [missed, setMissed] = useState(false)
  const [found, setFound] = useState<Stat[]>([])
  const [sorted, setSorted] = useState(false)
  // The rigged day's minutes while the student works the steppers. null: not touched yet.
  const [rigValue, setRigValue] = useState<number | null>(null)
  const [rigCheck, setRigCheck] = useState<'right' | 'wrong' | null>(null)
  // Round 5's dial value (null: not touched yet) and what the frequency table has revealed so far.
  const [dialValue, setDialValue] = useState<number | null>(null)
  const [shown, setShown] = useState<('total' | 'mean')[]>([])
  const [panic, setPanic] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied, reset: resetShare } = useShare()
  const { pace } = useStepPace()

  useEffect(() => {
    if (screen === 'done' && rounds) recordRank('stats', rankFor(score.kept, rounds.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!rounds) return <main className="lab" />

  const round: Round = rounds[roundIndex]
  const step = round.steps[stepIndex]
  const rig = round.steps.find(candidate => candidate.kind === 'rig')
  const values = rig && rigValue !== null ? round.values.map((value, i) => i === rig.day ? rigValue : value) : round.values
  const known = [...round.known, ...found]
  const right = step.kind === 'pick' ? picked !== null && picked === step.answer : rigCheck === 'right'
  const wrong = step.kind === 'pick' ? picked !== null && !right : rigCheck === 'wrong'
  const nope = step.kind === 'pick'
    ? step.choices.find(choice => choice.value === picked)?.nope
    : rigCheck !== 'wrong' ? undefined
      : step.kind === 'rig' ? rigNope(round, step, rigValue ?? step.from) : dialNope(round, step, dialValue ?? step.start)

  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setStepIndex(0); setPicked(null); setMissed(false)
    setFound([]); setSorted(false); setRigValue(null); setRigCheck(null); setRevealed(1); setDialValue(null); setShown([])
  }

  const flinch = () => {
    setMissed(true)
    setPanic(true)
    setTimeout(() => setPanic(false), prefersReducedMotion() ? 0 : 500)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1000)
  }

  const pick = (value: number | string) => {
    if (step.kind !== 'pick') return
    setPicked(value)
    if (value !== step.answer) { flinch(); return }
    score.hit(!missed)
    setFound([...found, ...step.shows])
    if (step.sort) setSorted(true)
  }

  const nudge = (by: number) => {
    if (step.kind !== 'rig') return
    sfx.tick()
    setRigValue(Math.min(MAX_MINUTES, Math.max(0, (rigValue ?? step.from) + by)))
  }

  const rigIt = () => {
    if (step.kind !== 'rig') return
    if (rigValue === step.to) {
      setRigCheck('right'); score.hit(!missed); sfx.stamp()
      // Filling a missing day: the mean line drops in on the target.
      if (step.fill) setFound([...found, 'mean'])
    } else { setRigCheck('wrong'); flinch() }
  }

  const lockIt = () => {
    if (step.kind !== 'dial') return
    if (dialValue === step.target) { setRigCheck('right'); score.hit(!missed); sfx.stamp(); setShown([...shown, step.reveal]) }
    else { setRigCheck('wrong'); flinch() }
  }

  const carryOn = () => {
    setPicked(null); setMissed(false); setRigCheck(null); setDialValue(null)
    if (stepIndex + 1 < round.steps.length) setStepIndex(stepIndex + 1)
    else { score.bank(); setScreen('payout'); sfx.win() }
  }

  const retry = () => { setPicked(null); setRigCheck(null) }

  const restart = () => { regenerate(); score.reset(); resetShare(); startRound(0) }

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, RANKS)
    const brag = `I rigged my mate’s screen-time stats with maths. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Rig the Stats complete</p>
        <RankCard rank={rank} stats={[['Rounds', `${rounds.length}/${rounds.length}`], ['Lives kept', `${score.kept}/${rounds.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Mean = total ÷ how many. Missing day? Total = mean × how many, minus the rest.', 'Median = middle value in order · Mode = most common · Range = biggest − smallest', 'Frequency table: add up value × frequency, then ÷ the total frequency']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Rig the Stats', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Rig again</button>
        </div>
      </footer>
    </main>
  }

  const chart = (panicking: boolean) => round.table
    ? <FreqTable table={round.table} shows={shown} known={known} panic={panicking} />
    : <Chart days={round.days} values={values} known={known} sorted={sorted} rig={rig ? rig.day : null} panic={panicking} missing={!!rig?.fill && rigValue === null} />

  return <main className="lab">
    <LabTop progress={`Round ${roundIndex + 1}/${rounds.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <IntroSplit
        key={roundIndex}
        kicker={round.title}
        title={round.headline}
        scene={<div className="lab-card rv-paper">{chart(false)}</div>}
        speaker={KAI} line={INTROS[roundIndex]}
        why={round.why}
        start={STARTS[roundIndex] ?? 'Crunch it'}
        onStart={() => { sfx.tick(); setScreen('question') }}
      />
    </>}

    {screen === 'question' && <>
      <section className="lab-card rv-paper">{chart(panic)}</section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{KAI.emoji}</span> {KAI.name} asks · in {round.table ? 'hours' : 'minutes'}</p>
        <h1 className="lab-prompt">{step.prompt}</h1>
        {step.kind === 'pick'
          ? <Choices choices={step.choices} picked={picked} answer={step.answer} onPick={pick} />
          : step.kind === 'dial' ? <>
            <NumberDial
              key={step.id}
              label={step.label}
              value={dialValue ?? step.start}
              onChange={setDialValue}
              min={step.min} max={step.max} step={step.step} jump={step.jump}
              format={value => `${value} h`}
              target={step.target}
              disabled={rigCheck !== null}
              tone={rigCheck === 'right' ? 'right' : rigCheck === 'wrong' ? 'wrong' : 'default'}
            />
            {rigCheck === null && <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={dialValue === null || dialValue === step.start} onClick={lockIt}>Lock it in</button>}
          </>
          : <>
            <div className="rs-stepper" role="group" aria-label={`${DAY_NAMES[step.day]}’s minutes`} data-value={rigValue ?? step.from} data-target={isTestMode() ? step.to : undefined}>
              <button type="button" className="rs-stepper__btn" aria-label="Less" disabled={rigCheck !== null || (rigValue ?? step.from) <= 0} onClick={() => nudge(-10)}>−</button>
              <output className="rs-stepper__value"><span>{round.days[step.day]}</span>{rigValue ?? step.from} min</output>
              <button type="button" className="rs-stepper__btn" aria-label="More" disabled={rigCheck !== null || (rigValue ?? step.from) >= MAX_MINUTES} onClick={() => nudge(10)}>+</button>
            </div>
            {step.fill
              ? <p className="rs-live" aria-live="polite">Need a mean of <b>{step.target}</b> over {round.days.length} days</p>
              : <p className="rs-live" aria-live="polite">Mean now <b>{Math.round(meanOf(values))}</b> · need <b>{step.target}</b></p>}
            {rigCheck === null && <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={rigValue === null || rigValue === step.from} onClick={rigIt}>Rig it</button>}
          </>}
        {right && <Combo streak={score.streak} />}
      </section>
      {right && <CheckBar status="correct" title={`${KAI.emoji} “${say(KAI.right, roundIndex * 2 + stepIndex)}”`} message={step.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{stepIndex + 1 < round.steps.length ? 'Next' : 'See the working'}</button>
      </CheckBar>}
      {wrong && score.lives > 0 && <CheckBar status="incorrect" title={`${KAI.emoji} “${say(KAI.wrong, roundIndex + stepIndex + (3 - score.lives))}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={retry}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🚨</span>
        <p className="lab-kicker">Busted</p>
        <h1 className="lab-title">Mum saw the real numbers. Phone confiscated.</h1>
        <Why tag="Tip">{TIPS[roundIndex] ?? TIP_AVERAGES}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Try that round again</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <Burst key={round.id} emoji="📊" />
      <section className="lab-card rv-paper">{chart(false)}</section>
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

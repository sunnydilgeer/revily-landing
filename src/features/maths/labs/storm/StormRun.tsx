'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, say, useScore, useShare, type Speaker, recordRank } from '../kit/Lab'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { makeDrops, metres, type Drop, type Ride } from './drops'
import './StormRun.css'

type Screen = 'drop' | 'question' | 'payout' | 'busted' | 'done'
type RunState = { x: number; storm: number; clock: number; result: 'running' | 'safe' | 'caught' }

const MAP = 8
const ROW = 4
const START = .5
const ZONE = 1
const RUN_MS = 2600

const ACE: Speaker = {
  name: 'Ace', emoji: '🎧',
  right: ['W rotate.', 'Big brain. Actually cracked.', 'No notes. Clean.', 'You’re carrying the squad rn.', 'That’s the call. Let’s go!'],
  wrong: ['Bro… that’s an L.', 'Nah, run the maths again.', 'Who taught you that?? 💀', 'That call gets us both eliminated.'],
}
/** Ace's reaction to the run itself. */
const RUN_LINES = { safe: 'We’re in! GG.', caught: 'RIP. Should’ve grabbed the car.' }
const INTROS = ['Storm’s coming. Count the squares, then do the maths. Don’t throw.', 'Big map this time. Maybe don’t walk it…', 'Final circle. No pressure. (Loads of pressure.)']
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🏆', name: 'Champion', line: 'Every rotate on point. Last one standing.' },
  { badge: '🎯', name: 'Pro Rotator', line: 'Nearly flawless. The storm never stood a chance.' },
  { badge: '🪂', name: 'Survivor', line: 'You made it out. A few close calls.' },
  { badge: '🤖', name: 'Bot', line: 'Even bots get better. Drop again.' },
]

/** Where things sit on the map, in grid squares. */
function geometry(drop: Drop) {
  const edge = START + drop.squares
  const centre = edge + ZONE
  return { edge, centre, stormStart: centre - START + .6 }
}

/** The storm shrinks to the zone by `closes`; the runner covers the distance at their speed. Both in game seconds. */
function stateAt(drop: Drop, ride: Ride, clock: number): RunState {
  const { edge, centre, stormStart } = geometry(drop)
  const travel = drop.squares * drop.scale / ride.speed
  const storm = stormStart - (stormStart - ZONE) * Math.min(clock / drop.closes, 1)
  const x = START + (edge - START) * Math.min(clock / travel, 1)
  if (clock >= travel) return { x: edge, storm, clock, result: 'safe' }
  if (storm < centre - x - .001) return { x, storm, clock, result: 'caught' }
  return { x, storm, clock, result: 'running' }
}

/** The map: grid squares, the safe zone, the storm closing on it, and you. */
function StormMap({ drop, distanceKnown, ride, run }: { drop: Drop; distanceKnown: boolean; ride: Ride | null; run: RunState | null }) {
  const { edge, centre, stormStart } = geometry(drop)
  const storm = run?.storm ?? stormStart
  const x = run?.x ?? START
  const lines = Array.from({ length: MAP - 1 }, (_, i) => i + 1)
  const clock = run ? Math.max(0, Math.ceil(drop.closes - run.clock)) : drop.closes
  return <figure className="sr-map">
    <svg viewBox={`0 0 ${MAP} ${MAP}`} role="img" aria-label={`Map: ${drop.squares} squares to the safe zone, each square ${metres(drop.scale)}`}>
      <defs>
        <mask id={`sr-hole-${drop.id}`}>
          <rect width={MAP} height={MAP} fill="white" />
          <circle cx={centre} cy={ROW} r={storm} fill="black" />
        </mask>
      </defs>
      <rect className="sr-ground" width={MAP} height={MAP} />
      {lines.map(i => <g key={i} className="sr-grid"><line x1={i} y1={0} x2={i} y2={MAP} /><line x1={0} y1={i} x2={MAP} y2={i} /></g>)}
      {[['🌲', 1.4, 1.1], ['🏠', 3.2, 1.5], ['🌲', 5.6, 5.9], ['🪨', 1.3, 5.6], ['🌲', 2.6, 6.2], ['⛺', 5.2, 1.4]].map(([icon, ix, iy]) =>
        <text key={`${ix}-${iy}`} className="sr-prop" x={ix} y={iy}>{icon}</text>)}
      <circle className="sr-zone" cx={centre} cy={ROW} r={ZONE} />
      <line className="sr-path" x1={START} y1={ROW} x2={edge} y2={ROW} />
      {Array.from({ length: drop.squares + 1 }, (_, i) => <line key={i} className="sr-tick" x1={START + i} y1={ROW - .14} x2={START + i} y2={ROW + .14} />)}
      {distanceKnown && <text className="sr-distance" x={(START + edge) / 2} y={ROW - .35}>{metres(drop.squares * drop.scale)}</text>}
      <rect className="sr-storm" width={MAP} height={MAP} mask={`url(#sr-hole-${drop.id})`} />
      <text className={`sr-you${run?.result === 'caught' ? ' is-caught' : ''}`} x={x} y={ROW + .02}>{run?.result === 'caught' ? '💀' : ride && run ? ride.emoji : '🧍'}</text>
    </svg>
    <figcaption className="sr-hud">
      <span className="sr-hud__scale"><span className="sr-square" aria-hidden="true" /> 1 square = {metres(drop.scale)}</span>
      <span className={`sr-hud__clock${run && clock <= 10 ? ' is-low' : ''}`}>🌀 {clock} s</span>
    </figcaption>
    {run?.result === 'safe' && <p className="sr-banner is-safe" role="status">Safe!</p>}
    {run?.result === 'caught' && <p className="sr-banner is-caught" role="status">Eliminated</p>}
  </figure>
}

function StormRunGame({ drops, onReplay }: { drops: Drop[]; onReplay: () => void }) {
  const [dropIndex, setDropIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('drop')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [picked, setPicked] = useState<number | string | null>(null)
  const [missed, setMissed] = useState(false)
  const [distanceKnown, setDistanceKnown] = useState(false)
  const [ride, setRide] = useState<Ride | null>(null)
  const [run, setRun] = useState<RunState | null>(null)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied, reset: resetShare } = useShare()
  const { pace } = useStepPace()
  const frame = useRef(0)

  const drop = drops[dropIndex]
  const question = drop.questions[questionIndex]
  const right = picked !== null && picked === question.answer
  const wrong = picked !== null && !right
  const nope = question.choices.find(choice => choice.value === picked)?.nope
  const running = run?.result === 'running'

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const play = (next: Ride) => {
    setRide(next)
    setRun(stateAt(drop, next, 0))
    sfx.whoosh()
    const travel = drop.squares * drop.scale / next.speed
    const span = Math.max(travel, drop.closes) * 1.05
    const finish = (state: RunState) => {
      setRun(state)
      if (state.result === 'caught') sfx.boom(); else sfx.win()
    }
    if (prefersReducedMotion()) {
      let end = stateAt(drop, next, span)
      for (let clock = 0; clock <= span; clock += .5) { end = stateAt(drop, next, clock); if (end.result !== 'running') break }
      finish(end)
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      const state = stateAt(drop, next, (now - start) / RUN_MS * span)
      if (state.result !== 'running') { finish(state); return }
      setRun(state)
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }

  const startDrop = (index: number) => {
    cancelAnimationFrame(frame.current)
    setDropIndex(index); setScreen('drop'); setQuestionIndex(0); setPicked(null); setMissed(false)
    setDistanceKnown(false); setRide(null); setRun(null); setRevealed(1)
  }

  const pick = (value: number | string) => {
    setPicked(value)
    if (value === question.answer) {
      score.hit(!missed)
      if (question.reveals === 'distance') setDistanceKnown(true)
      if (question.run) play(question.run)
      return
    }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 900)
  }

  const carryOn = () => {
    setPicked(null); setMissed(false); setRun(null); setRide(null)
    if (questionIndex + 1 < drop.questions.length) setQuestionIndex(questionIndex + 1)
    else { score.bank(); setScreen('payout'); sfx.win() }
  }

  const restart = onReplay

  useEffect(() => {
    if (screen === 'done') recordRank('storm', rankFor(score.kept, drops.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (screen === 'done') {
    const rank = rankFor(score.kept, drops.length, RANKS)
    const brag = `I out-ran the storm with maths and got ranked ${rank.name} ${rank.badge} Your turn.`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Storm Run complete</p>
        <RankCard rank={rank} stats={[['Drops', `${drops.length}/${drops.length}`], ['Lives kept', `${score.kept}/${drops.length * 3}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Distance = squares × the map scale.', 'Time = distance ÷ speed.', 'Speed = distance ÷ time.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Storm Run', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Drop again</button>
        </div>
      </footer>
    </main>
  }

  return <main className="lab">
    <LabTop progress={`Drop ${dropIndex + 1}/${drops.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'drop' && <>
      <section className="lab-intro">
        <p className="lab-kicker">{drop.title}</p>
        <h1 className="lab-title">{drop.brief}</h1>
        <div className="lab-card rv-paper"><StormMap drop={drop} distanceKnown={false} ride={null} run={null} /></div>
        <Quip speaker={ACE}>{INTROS[dropIndex]}</Quip>
        <Why>{drop.why}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { sfx.whoosh(); setScreen('question') }}>Jump 🪂</button>
      </footer>
    </>}

    {screen === 'question' && <>
      <section className="lab-card rv-paper">
        <StormMap drop={drop} distanceKnown={distanceKnown} ride={ride} run={run} />
      </section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{ACE.emoji}</span> {ACE.name} asks</p>
        <h1 className="lab-prompt">{question.prompt}</h1>
        <Choices choices={question.choices} picked={picked} answer={question.answer} onPick={pick} />
        {right && <Combo streak={score.streak} />}
      </section>
      {right && !running && <CheckBar status="correct" title={`${ACE.emoji} “${run && run.result !== 'running' ? RUN_LINES[run.result] : say(ACE.right, dropIndex * 5 + questionIndex)}”`} message={question.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>Continue</button>
      </CheckBar>}
      {wrong && score.lives > 0 && <CheckBar status="incorrect" title={`${ACE.emoji} “${say(ACE.wrong, dropIndex + questionIndex)}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🌀</span>
        <p className="lab-kicker">Caught in the storm</p>
        <h1 className="lab-title">Out of lives on this drop.</h1>
        <Why tag="Tip">Speed is metres every second. To find the time, divide the distance by the speed.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startDrop(dropIndex) }}>Drop again</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <Burst key={drop.id} emoji="🏆" />
      <section className="lab-card lab-card--working rv-paper">
        <h2 className="lab-working__title">The working</h2>
        <StepChain key={drop.id} steps={drop.chain} revealed={revealed} pace={pace} />
      </section>
      <footer className="lab-bar">
        <StepDots total={drop.chain.length - 1} current={revealed - 1} onSelect={step => setRevealed(step + 1)} />
        <div className="lab-bar__actions">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-icon-btn" aria-label="Previous step" disabled={revealed === 1} onClick={() => setRevealed(revealed - 1)}>←</button>
          {revealed < drop.chain.length
            ? <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => setRevealed(revealed + 1)}>{revealed === 1 ? 'Show the working' : 'Next step'}</button>
            : <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => dropIndex + 1 < drops.length ? startDrop(dropIndex + 1) : setScreen('done')}>
              {dropIndex + 1 < drops.length ? 'Next drop' : 'Finish'}
            </button>}
        </div>
      </footer>
    </>}
  </main>
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function StormRun() {
  const { data, play, regenerate } = useGenerated(makeDrops)
  return data ? <StormRunGame key={play} drops={data} onReplay={regenerate} /> : null
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, say, useScore, useShare, type Speaker, recordRank , livesPerRound, IntroSplit } from '../kit/Lab'
import { NumberDial } from '../kit/NumberDial'
import { isTestMode, useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { formatFor, makeDrops, metres, type DialStep, type Drop, type Run } from './drops'
import './StormRun.css'

type Screen = 'drop' | 'question' | 'payout' | 'busted' | 'done'
/** set: dial live · running: the run is playing · right / wrong: the result */
type Phase = 'set' | 'running' | 'right' | 'wrong'
/** How a run ended: on the zone, stopped short, or ran straight past it. */
type Verdict = 'safe' | 'short' | 'over'
type Motion = Pick<Run, 'speed' | 'time'>
type RunState = { x: number; storm: number; clock: number; caught: boolean; verdict: Verdict | null }

const MAP = 8
const ROW = 4
const START = .5
const ZONE = .3
const RUN_MS = 2600

const ACE: Speaker = {
  name: 'Ace', emoji: '🎧',
  right: ['W rotate.', 'Big brain. Actually cracked.', 'No notes. Clean.', 'You’re carrying the squad rn.', 'That’s the call. Let’s go!'],
  wrong: ['Bro… that’s an L.', 'Nah, run the maths again.', 'Who taught you that?? 💀', 'That call gets us both eliminated.'],
}
/** Ace's reaction to a run. */
const RUN_LINES: Record<Verdict, string> = { safe: 'We’re in! GG.', short: 'RIP. Didn’t even reach the zone.', over: 'You ran straight through it?! 💀' }
const BANNERS: Record<Verdict, string> = { safe: 'Safe!', short: 'Eliminated', over: 'Overshot!' }
const INTROS = [
  'Storm’s coming. Count the squares, then do the maths. Don’t throw.',
  'Big map this time. Maybe don’t walk it…',
  'Final circle. Timer’s in minutes. No pressure. (Loads of pressure.)',
  'Who ripped the map?? Your mate made it though. Use their run.',
  'Boss drop. Km, minutes, no brakes. Lock in.',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🏆', name: 'Champion', line: 'Every rotate on point. Last one standing.' },
  { badge: '🎯', name: 'Pro Rotator', line: 'Nearly flawless. The storm never stood a chance.' },
  { badge: '🪂', name: 'Survivor', line: 'You made it out. A few close calls.' },
  { badge: '🤖', name: 'Bot', line: 'Even bots get better. Drop again.' },
]

/** Where things sit on the map, in grid squares: the zone is `squares` along from where you land. */
function geometry(drop: Drop) {
  const centre = START + drop.squares
  return { centre, stormStart: drop.squares + .6 }
}

const verdictOf = (drop: Drop, run: Motion): Verdict => {
  const covered = run.speed * run.time, distance = drop.squares * drop.scale
  return covered === distance ? 'safe' : covered < distance ? 'short' : 'over'
}

/** The storm shrinks to the zone by `closes`; you move at `speed` for `time` seconds. All in game seconds. */
function stateAt(drop: Drop, run: Motion, clock: number): RunState {
  const { centre, stormStart } = geometry(drop)
  const storm = stormStart - (stormStart - ZONE) * Math.min(clock / drop.closes, 1)
  const x = Math.min(START + run.speed * Math.min(clock, run.time) / drop.scale, MAP - .3)
  return { x, storm, clock, caught: Math.abs(centre - x) > storm + .001, verdict: null }
}

/** The map: grid squares, the safe zone, the storm closing on it, and you. */
function StormMap({ drop, distanceKnown, measure, timerKnown, scaleKnown = false, emoji, run }: {
  drop: Drop; distanceKnown: boolean; measure: { value: number; right: boolean } | null; timerKnown: boolean; scaleKnown?: boolean; emoji: string | null; run: RunState | null
}) {
  const key = drop.scaleHidden && !scaleKnown ? '?' : drop.scaleText ?? metres(drop.scale)
  const { centre, stormStart } = geometry(drop)
  const storm = run?.storm ?? stormStart
  const x = run?.x ?? START
  const lines = Array.from({ length: MAP - 1 }, (_, i) => i + 1)
  const clock = run ? `${Math.max(0, Math.ceil(drop.closes - run.clock))} s` : drop.timer && !timerKnown ? drop.timer : `${drop.closes} s`
  const low = run && drop.closes - run.clock <= 10
  const dead = run?.caught || (run?.verdict && run.verdict !== 'safe')
  const measured = measure ? Math.min(measure.value / drop.scale, MAP - .3 - START) : 0
  return <figure className="sr-map" data-run={run?.verdict ?? (run ? 'running' : undefined)}>
    <svg viewBox={`0 0 ${MAP} ${MAP}`} role="img" aria-label={`Map: ${drop.squares} squares to the safe zone, each square ${key === '?' ? 'unknown (key torn off)' : key}`}>
      <defs>
        <mask id={`sr-hole-${drop.id}`}>
          <rect width={MAP} height={MAP} fill="white" />
          <circle cx={centre} cy={ROW} r={storm} fill="black" />
        </mask>
      </defs>
      <rect className="sr-ground" width={MAP} height={MAP} />
      {lines.map(i => <g key={i} className="sr-grid"><line x1={i} y1={0} x2={i} y2={MAP} /><line x1={0} y1={i} x2={MAP} y2={i} /></g>)}
      {[['🌲', 1.4, 1.1], ['🏠', 3.2, 1.5], ['🌲', 5.6, 5.9], ['🪨', 1.3, 5.6], ['🌲', 2.6, 6.2], ['⛺', 6.6, 1.4]].map(([icon, ix, iy]) =>
        <text key={`${ix}-${iy}`} className="sr-prop" x={ix} y={iy}>{icon}</text>)}
      <circle className="sr-zone" cx={centre} cy={ROW} r={ZONE} />
      <line className="sr-path" x1={START} y1={ROW} x2={centre} y2={ROW} />
      {Array.from({ length: drop.squares + 1 }, (_, i) => <line key={i} className="sr-tick" x1={START + i} y1={ROW - .14} x2={START + i} y2={ROW + .14} />)}
      {measure && <g className={`sr-measure${measure.right ? ' is-right' : ' is-wrong'}`}>
        <line x1={START} y1={ROW + .55} x2={START + measured} y2={ROW + .55} />
        <line x1={START + measured} y1={ROW + .4} x2={START + measured} y2={ROW + .7} />
        <text x={START + Math.max(measured, 1.4) / 2} y={ROW + 1.05}>{metres(measure.value)}</text>
      </g>}
      {distanceKnown && !measure && <text className="sr-distance" x={(START + centre) / 2} y={ROW - .35}>{metres(drop.squares * drop.scale)}</text>}
      <rect className="sr-storm" width={MAP} height={MAP} mask={`url(#sr-hole-${drop.id})`} />
      <text className={`sr-you${dead ? ' is-caught' : ''}`} x={x} y={ROW + .02}>{dead ? '💀' : emoji && run ? emoji : '🧍'}</text>
    </svg>
    <figcaption className="sr-hud">
      <span className="sr-hud__scale"><span className="sr-square" aria-hidden="true" /> 1 square = {key}</span>
      <span className={`sr-hud__clock${low ? ' is-low' : ''}`}>🌀 {clock}</span>
    </figcaption>
    {run?.verdict && <p className={`sr-banner ${run.verdict === 'safe' ? 'is-safe' : 'is-caught'}`} role="status">{BANNERS[run.verdict]}</p>}
  </figure>
}

function StormRunGame({ drops, onReplay }: { drops: Drop[]; onReplay: () => void }) {
  const [dropIndex, setDropIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('drop')
  const [stepIndex, setStepIndex] = useState(0)
  const [value, setValue] = useState(0)
  const [phase, setPhase] = useState<Phase>('set')
  const [committed, setCommitted] = useState<number | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)
  const [distanceKnown, setDistanceKnown] = useState(false)
  const [timerKnown, setTimerKnown] = useState(false)
  const [scaleKnown, setScaleKnown] = useState(false)
  const [runner, setRunner] = useState<string | null>(null)
  const [run, setRun] = useState<RunState | null>(null)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied } = useShare()
  const { pace } = useStepPace()
  const frame = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const drop = drops[dropIndex]
  const step = drop.steps[stepIndex]
  const mood = (offset: number) => dropIndex * 4 + stepIndex + offset

  useEffect(() => () => { cancelAnimationFrame(frame.current); clearTimeout(timer.current) }, [])

  useEffect(() => {
    if (screen === 'done') recordRank('storm', rankFor(score.kept, drops.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  /** Plays a run on the map, then calls `done` with how it ended. */
  const play = (emoji: string, next: Motion, done: (verdict: Verdict) => void) => {
    setRunner(emoji)
    setRun(stateAt(drop, next, 0))
    sfx.whoosh()
    const verdict = verdictOf(drop, next)
    const end = verdict === 'safe' ? next.time : Math.max(next.time, drop.closes)
    const span = end * 1.04
    const finish = (state: RunState) => {
      setRun({ ...state, verdict })
      if (verdict === 'safe') sfx.win(); else sfx.boom()
      done(verdict)
    }
    if (prefersReducedMotion() || span === 0) {
      let last = stateAt(drop, next, end)
      for (let clock = 0; clock <= end; clock += .5) { last = stateAt(drop, next, clock); if (last.caught) break }
      finish(last)
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      const clock = Math.min((now - start) / RUN_MS * span, end)
      const state = stateAt(drop, next, clock)
      if (state.caught || clock >= end) { finish(state); return }
      setRun(state)
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }

  const setUp = (index: number, at: number) => {
    cancelAnimationFrame(frame.current); clearTimeout(timer.current)
    const next = drops[index].steps[at]
    setStepIndex(at); setValue(next.kind === 'dial' ? next.start : 0); setPhase('set'); setCommitted(null)
    setPicked(null); setMissed(false); setRun(null); setRunner(null)
  }

  const startDrop = (index: number) => {
    setDropIndex(index); setScreen('drop'); setDistanceKnown(false); setTimerKnown(false); setScaleKnown(false); setRevealed(1); setUp(index, 0)
  }

  const judge = (dial: DialStep, set: number) => {
    if (set === dial.target) {
      setPhase('right'); score.hit(!missed)
      if (dial.sets === 'distance') setDistanceKnown(true)
      if (dial.label === 'Storm timer') setTimerKnown(true)
      if (dial.sets === 'scale') setScaleKnown(true)
      return
    }
    setPhase('wrong'); setMissed(true)
    if (score.miss() === 0) timer.current = setTimeout(() => setScreen('busted'), 1100)
  }

  const commit = () => {
    if (step.kind !== 'dial' || phase !== 'set') return
    const dial = step, set = value
    setCommitted(set)
    if (dial.run) {
      setPhase('running')
      play(dial.run.emoji, { speed: dial.run.speed ?? set, time: dial.run.time ?? set }, () => judge(dial, set))
      return
    }
    sfx.tick()
    judge(dial, set)
  }

  const retry = () => { setPhase('set'); setRun(null); setRunner(null); setCommitted(null) }

  const pick = (choice: string) => {
    if (step.kind !== 'side') return
    setPicked(choice)
    if (choice !== step.answer) {
      setMissed(true)
      if (score.miss() === 0) timer.current = setTimeout(() => setScreen('busted'), 1000)
      return
    }
    score.hit(!missed)
    if (step.run) { setPhase('running'); play(step.run.emoji, step.run, () => setPhase('right')) }
    else setPhase('right')
  }

  const carryOn = () => {
    if (stepIndex + 1 < drop.steps.length) { setUp(dropIndex, stepIndex + 1); return }
    score.bank(); setScreen('payout'); sfx.win()
  }

  if (screen === 'done') {
    const rank = rankFor(score.kept, drops.length, RANKS)
    const brag = `I out-ran the storm with maths and got ranked ${rank.name} ${rank.badge} Your turn.`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Storm Run complete</p>
        <RankCard rank={rank} stats={[['Drops', `${drops.length}/${drops.length}`], ['Lives kept', `${score.kept}/${drops.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Distance = squares × scale, all in metres (1 km = 1,000 m).', 'Times in seconds (1 min = 60 s).', 'Speed = distance ÷ time, time = distance ÷ speed, distance = speed × time.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Storm Run', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onReplay}>Drop again</button>
        </div>
      </footer>
    </main>
  }

  const measure = step.kind === 'dial' && step.sets === 'distance' && committed !== null ? { value: committed, right: committed === step.target } : null
  const tone = phase === 'right' ? 'right' : phase === 'wrong' ? 'wrong' : 'default'
  const last = stepIndex + 1 === drop.steps.length
  const nextLabel = last ? 'See the working' : 'Next'
  const winTitle = `${ACE.emoji} “${run?.verdict ? RUN_LINES[run.verdict] : say(ACE.right, mood(0))}”`
  const sideWrong = step.kind === 'side' && picked !== null && picked !== step.answer

  return <main className="lab">
    <LabTop progress={`Drop ${dropIndex + 1}/${drops.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'drop' && <>
      <IntroSplit
        key={dropIndex}
        kicker={drop.title}
        title={drop.brief}
        scene={<div className="lab-card rv-paper"><StormMap drop={drop} distanceKnown={false} measure={null} timerKnown={false} emoji={null} run={null} /></div>}
        speaker={ACE} line={INTROS[dropIndex]}
        why={drop.why}
        start="Jump 🪂"
        onStart={() => { sfx.whoosh(); setScreen('question') }}
      />
    </>}

    {screen === 'question' && <>
      <section className="lab-card rv-paper">
        <StormMap drop={drop} distanceKnown={distanceKnown} measure={measure} timerKnown={timerKnown} scaleKnown={scaleKnown} emoji={runner} run={run} />
      </section>
      <section className={`lab-ask${step.kind === 'side' ? ' sr-side' : ''}`}>
        <p className="lab-asker"><span aria-hidden="true">{ACE.emoji}</span> {ACE.name} · {step.kind === 'dial' ? 'set it, then commit' : 'quick one'}</p>
        <h1 className="lab-prompt">{step.prompt}</h1>
        {step.kind === 'dial'
          ? <NumberDial label={step.label} value={value} onChange={setValue} min={step.min} max={step.max} step={step.step} jump={step.jump}
            format={formatFor(step.sets)} target={step.target} disabled={phase !== 'set'} tone={tone} />
          : <Choices choices={step.choices} picked={picked} answer={step.answer} onPick={choice => pick(String(choice))} />}
        {phase === 'right' && <Combo streak={score.streak} />}
      </section>

      {step.kind === 'dial' && (phase === 'set' || phase === 'running') && <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={phase === 'running'} data-target={isTestMode() ? step.target : undefined} onClick={commit}>{step.commit}</button>
      </footer>}

      {phase === 'right' && <>
        {last && <Burst key={step.id} emoji="🌀" />}
        <CheckBar status="correct" title={winTitle} message={step.kind === 'dial' ? step.win : step.why}>
          <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{nextLabel}</button>
        </CheckBar>
      </>}
      {step.kind === 'dial' && phase === 'wrong' && score.lives > 0 && <CheckBar status="incorrect" title={`${ACE.emoji} “${run?.verdict ? RUN_LINES[run.verdict] : say(ACE.wrong, mood(3 - score.lives))}”`} message={step.nope(committed ?? value)}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={retry}>Try again</button>
      </CheckBar>}
      {sideWrong && score.lives > 0 && step.kind === 'side' && <CheckBar status="incorrect" title={`${ACE.emoji} “${say(ACE.wrong, mood(3 - score.lives))}”`} message={step.choices.find(choice => choice.value === picked)?.nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🌀</span>
        <p className="lab-kicker">Caught in the storm</p>
        <h1 className="lab-title">Out of lives on this drop.</h1>
        <Why tag="Tip">{dropIndex === 3
          ? 'Distance = speed × time. Then one square = distance ÷ number of squares.'
          : dropIndex === 4
            ? 'Get the units to match first: km × 1,000 for metres, minutes × 60 for seconds. Then speed = distance ÷ time.'
            : 'Distance = squares × scale. Then speed = distance ÷ time, and time = distance ÷ speed. Times in seconds!'}</Why>
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
        <StepDots total={drop.chain.length - 1} current={revealed - 1} onSelect={line => setRevealed(line + 1)} />
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

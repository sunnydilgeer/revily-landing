'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker, livesPerRound, IntroSplit } from '../kit/Lab'
import { NumberDial } from '../kit/NumberDial'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { HI, LO, lineText, makeRounds, n, nopeFor, onLine, ptText, type Pt, type Round } from './lines'
import './LaserLine.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'
/** aim: dials live · fire: beam travelling · hit / miss: the result of their line */
type Phase = 'aim' | 'fire' | 'hit' | 'miss'

const VEGA: Speaker = {
  name: 'Vega', emoji: '🛰️',
  right: ['Clean hit. Command is impressed. Mildly.', 'Target down. I’ll pretend I wasn’t worried.', 'Boom. Textbook. Literally, it’s in the textbook.', 'Drones nil. You one. Keep it that way.', 'Nice. I barely had to sigh.'],
  wrong: ['You hit… a cloud. Congratulations to the cloud.', 'The drones are waving at you. Rude.', 'That beam went somewhere. Just not there.', 'Bold choice. Wrong, but bold.'],
}
const INTROS = [
  'Targets locked. Try not to hit the moon this time. The tilt’s fixed: you only slide the beam up and down.',
  'Height’s locked now. You’re on tilt duty. Some of these come in downhill, so watch the sign.',
  'Full manual. Two drones, two dials. No pressure. Well, some pressure.',
  'A friendly beam’s already up. Fire alongside it, never across it. Parallel, rookie.',
  'Boss wave. The fleet’s cloaked: all we’ve got is an intercepted equation. Decode it and fire blind.',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🎯', name: 'Sharpshooter Supreme', line: 'Every drone down, first time. Command is… actually impressed.' },
  { badge: '🛰️', name: 'Ace Gunner', line: 'A stray beam or two, but the base is still standing.' },
  { badge: '🔭', name: 'Rookie Spotter', line: 'You got there. The clouds took a beating too.' },
  { badge: '☁️', name: 'Cloud Hunter', line: 'The drones are laughing at us. Fire again.' },
]

// Grid units to SVG pixels: −7..7 each way, 20px a square, y pointing up.
const U = 20
const SIZE = 14 * U
const sx = (x: number) => (x + 7) * U
const sy = (y: number) => (7 - y) * U
const TICKS = Array.from({ length: HI - LO + 1 }, (_, i) => LO + i)
const motion = (ms: number) => prefersReducedMotion() ? 0 : ms

/** Eases a number towards its target, so the beam swings rather than jumps as a dial turns. */
function useEased(target: number, ms = 180) {
  const [shown, setShown] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    if (prefersReducedMotion()) { setShown(target); from.current = target; return }
    const start = performance.now(), begin = from.current
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      const value = begin + (target - begin) * (1 - (1 - t) ** 3)
      from.current = value
      setShown(value)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, ms])
  return shown
}

/**
 * The coordinate grid: drones at whole-number points and the laser along y = mx + c, redrawn as
 * the dials turn. Firing sends a pulse along the beam; drones it passes through explode and the
 * rest dodge. Once a line is found, the rise/run triangle between the drones shows the gradient.
 */
function Grid({ m, c, drones, phase, triangle, probe, guide, cloaked }: {
  m: number; c: number; drones: Pt[]; phase: Phase; triangle: boolean; probe?: { p: Pt; right: boolean } | null
  guide?: { m: number; c: number }; cloaked?: boolean
}) {
  const em = useEased(m), ec = useEased(c)
  const [a, b = a] = drones
  const run = b.x - a.x, rise = b.y - a.y
  const result = phase === 'hit' || phase === 'miss'
  // Cloaked drones only show up once the beam has fired and the result is in.
  const hidden = cloaked && !result
  // Label the guide beam at a point well inside the grid, away from the y-axis.
  const guideAt = guide ? [5, -5, 4, -4, 3, -3, 2, -2].find(x => Math.abs(guide.m * x + guide.c) <= 5) ?? 1 : 0
  const label = `Grid with ${hidden ? 'cloaked drones' : `${drones.length === 1 ? 'a drone' : 'drones'} at ${drones.map(ptText).join(' and ')}`}${guide ? `, a guide beam ${lineText(guide.m, guide.c)}` : ''}. Laser: ${lineText(m, c)}.`
  return <figure className={`ll-grid is-${phase}`}>
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={label}>
      <defs>
        <clipPath id="ll-clip"><rect x={sx(-6.5)} y={sy(6.5)} width={13 * U} height={13 * U} /></clipPath>
      </defs>
      {TICKS.map(t => <g key={t} className="ll-gridline">
        <line x1={sx(t)} y1={sy(6.5)} x2={sx(t)} y2={sy(-6.5)} />
        <line x1={sx(-6.5)} y1={sy(t)} x2={sx(6.5)} y2={sy(t)} />
      </g>)}
      <g className="ll-axis">
        <line x1={sx(-6.6)} y1={sy(0)} x2={sx(6.6)} y2={sy(0)} />
        <line x1={sx(0)} y1={sy(-6.6)} x2={sx(0)} y2={sy(6.6)} />
        <text className="ll-axis__name" x={sx(6.75)} y={sy(0) + 4} textAnchor="middle">x</text>
        <text className="ll-axis__name" x={sx(0)} y={sy(6.7)} textAnchor="middle">y</text>
        {TICKS.filter(t => t !== 0 && t % 2 === 0).map(t => <g key={t}>
          <text x={sx(t)} y={sy(0) + 13} textAnchor="middle">{n(t)}</text>
          <text x={sx(0) - 5} y={sy(t) + 3.5} textAnchor="end">{n(t)}</text>
        </g>)}
      </g>

      {triangle && phase === 'hit' && drones.length > 1 && <g className="ll-triangle">
        <path d={`M${sx(a.x)} ${sy(a.y)} H${sx(b.x)} V${sy(b.y)}`} />
        <text x={(sx(a.x) + sx(b.x)) / 2} y={sy(a.y) + (rise > 0 ? 14 : -6)} textAnchor="middle">run {run}</text>
        <text x={sx(b.x) + 5} y={(sy(a.y) + sy(b.y)) / 2 + 4}>rise {n(rise)}</text>
      </g>}

      {guide && <g className="ll-guide" clipPath="url(#ll-clip)">
        <line x1={sx(-8)} y1={sy(guide.m * -8 + guide.c)} x2={sx(8)} y2={sy(guide.m * 8 + guide.c)} />
        <text x={sx(guideAt)} y={sy(guide.m * guideAt + guide.c) - 7} textAnchor="middle">guide</text>
      </g>}
      <g clipPath="url(#ll-clip)">
        <line className="ll-beam__glow" x1={sx(-8)} y1={sy(em * -8 + ec)} x2={sx(8)} y2={sy(em * 8 + ec)} />
        <line className="ll-beam" x1={sx(-8)} y1={sy(em * -8 + ec)} x2={sx(8)} y2={sy(em * 8 + ec)} pathLength={100} />
      </g>
      {phase === 'aim' && Math.abs(c) <= 6 && <g className="ll-intercept">
        <circle cx={sx(0)} cy={sy(ec)} r={4.5} />
        <text x={sx(0) + 7} y={sy(ec) - 6}>c</text>
      </g>}

      {hidden && <text className="ll-cloak" x={sx(0)} y={sy(-5.6)} textAnchor="middle">📡 drones cloaked</text>}
      {!hidden && drones.map(d => {
        const struck = result && onLine(d, m, c)
        // The outer group places the drone; the inner one is free for CSS to shake or pop.
        return <g key={`${d.x},${d.y}`} transform={`translate(${sx(d.x)} ${sy(d.y)})`}>
          <g className={`ll-drone${result ? (struck ? ' is-struck' : ' is-dodging') : ''}`}>
            <circle className="ll-drone__lock" r={10} />
            <text className="ll-drone__ship" y={1}>{struck ? '💥' : '🛸'}</text>
          </g>
        </g>
      })}
      {probe && <circle className={`ll-probe${probe.right ? ' is-right' : ' is-wrong'}`} cx={sx(probe.p.x)} cy={sy(probe.p.y)} r={6} />}
    </svg>
    <p className="ll-readout" aria-live="polite">{lineText(m, c)}</p>
  </figure>
}

function LaserLineGame({ rounds, onReplay }: { rounds: Round[]; onReplay: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [shotIndex, setShotIndex] = useState(0)
  // After the last shot of a round with a side question, the dials give way to it.
  const [onSide, setOnSide] = useState(false)
  const [m, setM] = useState(rounds[0].shots[0].start.m)
  const [c, setC] = useState(rounds[0].shots[0].start.c)
  const [phase, setPhase] = useState<Phase>('aim')
  const [picked, setPicked] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied } = useShare()
  const { pace } = useStepPace()

  useEffect(() => {
    if (screen === 'done') recordRank('laser', rankFor(score.kept, rounds.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const round = rounds[roundIndex]
  const shot = round.shots[shotIndex]
  const side = round.side

  const aimAt = (index: number, shotAt: number) => {
    const start = rounds[index].shots[shotAt].start
    setShotIndex(shotAt); setM(start.m); setC(start.c); setPhase('aim'); setMissed(false); setPicked(null)
  }

  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setOnSide(false); setRevealed(1); aimAt(index, 0)
  }

  const shoot = () => {
    setPhase('fire')
    sfx.whoosh()
    const right = m === shot.m && c === shot.c
    const clipped = shot.drones.some(d => onLine(d, m, c))
    setTimeout(() => {
      if (right) { setPhase('hit'); sfx.boom(); score.hit(!missed); return }
      setPhase('miss'); setMissed(true)
      if (clipped) sfx.boom()
      if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1100)
    }, motion(650))
  }

  const pick = (value: string) => {
    if (!side) return
    setPicked(value)
    if (value === side.answer) { score.hit(!missed); return }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1000)
  }

  const carryOn = () => {
    if (shotIndex + 1 < round.shots.length) { aimAt(roundIndex, shotIndex + 1); return }
    if (side && !onSide) { setOnSide(true); setMissed(false); setPicked(null); return }
    score.bank(); setScreen('payout'); sfx.win()
  }

  const nextLabel = shotIndex + 1 < round.shots.length ? 'Next wave' : side && !onSide ? 'Bonus question' : 'See the working'

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, RANKS)
    const brag = `I shot down a cloaked drone fleet with y = mx + c. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Laser Line complete</p>
        <RankCard rank={rank} stats={[['Rounds', `${rounds.length}/${rounds.length}`], ['Lives kept', `${score.kept}/${rounds.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['c is where the line crosses the y-axis. m is the steepness: up (or down) ÷ across.', 'Find m first, then put a point in to get c. Parallel lines share the same m.', 'Not in y = mx + c form? Get y on its own first, then read off m and c.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Laser Line', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onReplay}>Fire again</button>
        </div>
      </footer>
    </main>
  }

  const answered = round.shots[round.shots.length - 1]
  const sideRight = picked !== null && side !== null && picked === side.answer
  const sideWrong = picked !== null && !sideRight
  // Only point answers ("x,y") get a dot on the grid; equation answers (the parallel-line bonus) don't.
  const point = picked !== null && /^-?\d+,-?\d+$/.test(picked) ? picked.split(',').map(Number) : null
  const probe = side && point ? { p: { x: point[0], y: point[1] }, right: sideRight } : null
  const tone = phase === 'hit' ? 'right' : phase === 'miss' ? 'wrong' : 'default'
  const locked = phase !== 'aim'
  const mood = (offset: number) => roundIndex * 3 + shotIndex + offset

  return <main className="lab">
    <LabTop progress={`Round ${roundIndex + 1}/${rounds.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <IntroSplit
        key={roundIndex}
        kicker={round.title}
        title={round.headline}
        scene={<div className="lab-card rv-paper"><Grid m={shot.start.m} c={shot.start.c} drones={shot.drones} phase="aim" triangle={false} guide={shot.guide} cloaked={shot.cloaked} /></div>}
        speaker={VEGA} line={INTROS[roundIndex]}
        why={round.why}
        start="Lock on"
        onStart={() => { sfx.tick(); setScreen('question') }}
      />
    </>}

    {screen === 'question' && !onSide && <>
      <section className="lab-card rv-paper"><Grid m={m} c={c} drones={shot.drones} phase={phase} triangle={round.triangle} guide={shot.guide} cloaked={shot.cloaked} /></section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{VEGA.emoji}</span> {VEGA.name} · fire when the beam lines up</p>
        <h1 className="lab-prompt">{shot.prompt}</h1>
        {shot.code && <p className="ll-code" aria-label={`Intercepted equation: ${shot.code.text}`}><span aria-hidden="true">📡</span> {shot.code.text}</p>}
        <div className="ll-dials">
          {shot.dials.includes('m')
            ? <NumberDial label="Gradient m" value={m} onChange={setM} min={-5} max={5} format={n} target={shot.m} disabled={locked} tone={tone} />
            : <p className="ll-locked">🔒 Gradient m = <b>{n(shot.m)}</b></p>}
          {shot.dials.includes('c')
            ? <NumberDial label="Intercept c" value={c} onChange={setC} min={-6} max={6} format={n} target={shot.c} disabled={locked} tone={tone} />
            : <p className="ll-locked">🔒 Intercept c = <b>{n(shot.c)}</b></p>}
        </div>
        {phase === 'hit' && <Combo streak={score.streak} />}
      </section>
      {(phase === 'aim' || phase === 'fire') && <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={phase === 'fire'} onClick={shoot}>Fire</button>
      </footer>}
      {phase === 'hit' && <>
        <Burst key={shot.id} emoji="💥" />
        <CheckBar status="correct" title={`${VEGA.emoji} “${say(VEGA.right, mood(0))}”`} message={shot.win}>
          <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{nextLabel}</button>
        </CheckBar>
      </>}
      {phase === 'miss' && score.lives > 0 && <CheckBar status="incorrect" title={`${VEGA.emoji} “${say(VEGA.wrong, mood(3 - score.lives))}”`} message={nopeFor(shot, m, c)}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPhase('aim')}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'question' && onSide && side && <>
      <section className="lab-card rv-paper"><Grid m={answered.m} c={answered.c} drones={answered.drones} phase="hit" triangle={false} probe={probe} /></section>
      <section className="lab-ask ll-side">
        <p className="lab-asker"><span aria-hidden="true">{VEGA.emoji}</span> {VEGA.name} asks · bonus target</p>
        <h1 className="lab-prompt">{side.prompt}</h1>
        <Choices choices={side.choices} picked={picked} answer={side.answer} onPick={value => pick(value as string)} />
        {sideRight && <Combo streak={score.streak} />}
      </section>
      {sideRight && <CheckBar status="correct" title={`${VEGA.emoji} “${say(VEGA.right, mood(1))}”`} message={side.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>See the working</button>
      </CheckBar>}
      {sideWrong && score.lives > 0 && <CheckBar status="incorrect" title={`${VEGA.emoji} “${say(VEGA.wrong, mood(3 - score.lives))}”`} message={side.choices.find(choice => choice.value === picked)?.nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🛸</span>
        <p className="lab-kicker">Base overrun</p>
        <h1 className="lab-title">Out of lives. The drones now run the base.</h1>
        <Why tag="Tip">{[
          'c is where the beam crosses the y-axis. Work out mx at a drone: c is what’s left to reach its y.',
          'm is rise ÷ run between two drones, and it’s negative if the beam goes downhill.',
          'Find m first with rise ÷ run, then put one drone’s x and y into y = mx + c to get c.',
          'Parallel beams have the same m. Copy it from the guide, then use the drone to find c.',
          'Get y on its own: move the x term across the = and flip its sign, then divide everything by the number in front of y.',
        ][roundIndex]}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Reboot the laser</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <section className="lab-card rv-paper"><Grid m={answered.m} c={answered.c} drones={answered.drones} phase="hit" triangle={round.triangle} guide={answered.guide} /></section>
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
export default function LaserLine() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <LaserLineGame key={play} rounds={data} onReplay={regenerate} /> : null
}

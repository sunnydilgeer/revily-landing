'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker , livesPerRound } from '../kit/Lab'
import { NumberDial } from '../kit/NumberDial'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { JUMP, POCKETS, STEP, makeShots, toCushion, type Aim, type Arc, type Point, type Shot, type TargetKind } from './shots'
import './TrickShot.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'
/** aim: the dial is live · roll: the ball is moving · hit / miss: where it ended up */
type Phase = 'aim' | 'roll' | 'hit' | 'miss'

const VIC: Speaker = {
  name: 'Big Vic', emoji: '🎙️',
  right: ['WHAT. A. SHOT.', 'Textbook angle, folks!', 'The crowd goes wild! 📣', 'Somebody frame that angle.', 'Ice cold. Absolutely ice cold.'],
  wrong: ['Ohhh, off the rails!', 'That’s gone in the crisp bowl.', 'Ref’s checking the replay… nope.', 'The crowd is SILENT.'],
}
const INTROS = [
  'Good evening and welcome to the Trick Shot Finals! Our player needs just one angle to get this started…',
  'Oh, the corner’s blocked! This calls for a bank shot. Angle in, angle out, folks.',
  'Two shots crossing. If the angles are off, it’s carnage. No pressure!',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🏆', name: 'Trick Shot Legend', line: 'Every angle, every pot. Big Vic has lost his voice.' },
  { badge: '🎱', name: 'Pool Shark', line: 'A near miss or two, but they all went down.' },
  { badge: '🎯', name: 'Sharp Shooter', line: 'You got there. The crisp bowl survived. Just.' },
  { badge: '🥔', name: 'Crisp Bowl Sniper', line: 'Lots of snacks hit, not many pockets. Go again.' },
]
const BANNER: Record<TargetKind, string> = { pocket: 'POTTED!', ball: 'CLACK!', cue: 'KISSED IT!', spot: 'BANG ON!' }

const rad = (deg: number) => deg * Math.PI / 180
const at = ([x, y]: Point, r: number, deg: number): Point => [x + r * Math.cos(rad(deg)), y - r * Math.sin(rad(deg))]
const motion = (ms: number) => prefersReducedMotion() ? 0 : ms

function arcPath(arc: Pick<Arc, 'at' | 'from' | 'to'>, r: number) {
  const to = Math.min(arc.to, arc.from + 359.5)
  const [x1, y1] = at(arc.at, r, arc.from), [x2, y2] = at(arc.at, r, to)
  return `M ${arc.at[0]} ${arc.at[1]} L ${x1} ${y1} A ${r} ${r} 0 ${to - arc.from > 180 ? 1 : 0} 0 ${x2} ${y2} Z`
}

/** Where the ball is after `t` (0 to 1) of the way along its path. */
function along(path: Point[], t: number): Point {
  const lengths = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]))
  let left = t * lengths.reduce((sum, l) => sum + l, 0)
  for (let i = 0; i < lengths.length; i++) {
    if (left <= lengths[i] && lengths[i] > 0) {
      const k = left / lengths[i], [a, b] = [path[i], path[i + 1]]
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]
    }
    left -= lengths[i]
  }
  return path[path.length - 1]
}

/** Eases a number towards its target, so the cue swings rather than jumps as the dial turns. */
function useEased(target: number, ms = 200) {
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

type ArcState = 'known' | 'asked' | 'found'

/** The target the cue is trying to reach: a ring, plus a red ball or a chalk ✕. */
function Target({ aim, done }: { aim: Aim; done: boolean }) {
  const [x, y] = aim.target
  return <g className={`ts-target${done ? ' is-done' : ''}`}>
    {aim.kind === 'ball' && <circle className="ts-object" cx={x} cy={y} r="2.8" />}
    {aim.kind === 'cue' && <circle className="ts-ghost" cx={x} cy={y} r="2.8" />}
    {aim.kind === 'spot' && <path className="ts-spot" d={`M ${x - 2.4} ${y - 2.4} L ${x + 2.4} ${y + 2.4} M ${x + 2.4} ${y - 2.4} L ${x - 2.4} ${y + 2.4}`} />}
    <circle className="ts-ring" cx={x} cy={y} r="5.5" />
  </g>
}

/** The live aim: the line the angle is measured from, the cue, the dashed aim line and the angle opening up. */
function AimLines({ aim, value, phase }: { aim: Aim; value: number; phase: Phase }) {
  const shown = useEased(value)
  const dir = aim.base + shown
  const end = toCushion(aim.vertex, dir), baseEnd = toCushion(aim.vertex, aim.base)
  const butt = at(aim.vertex, 34, dir + 180), tip = at(aim.vertex, 4.5, dir + 180)
  const [lx, ly] = at(aim.vertex, 19, aim.base + shown / 2)
  return <g className={`ts-aim is-${phase}`}>
    <line className="ts-base" x1={aim.vertex[0]} y1={aim.vertex[1]} x2={baseEnd[0]} y2={baseEnd[1]} />
    {phase === 'aim' && <line className="ts-sight" x1={aim.vertex[0]} y1={aim.vertex[1]} x2={end[0]} y2={end[1]} />}
    {shown > 0.5 && phase !== 'hit' && <g className="ts-arc is-live">
      <path d={arcPath({ at: aim.vertex, from: aim.base, to: aim.base + shown }, 11)} />
      <circle cx={lx} cy={ly} r="7" />
      <text x={lx} y={ly}>{Math.round(value)}°</text>
    </g>}
    {phase === 'aim' && <line className="ts-cue" x1={butt[0]} y1={butt[1]} x2={tip[0]} y2={tip[1]} />}
  </g>
}

function Table({ shot, arcStates, ball, banner, aim, value, phase, label }: {
  shot: Shot
  arcStates: Record<string, ArcState | undefined>
  ball: Point | null
  banner: string | null
  aim?: Aim
  value?: number
  phase?: Phase
  label: string
}) {
  const potted = banner === BANNER.pocket && !aim
  return <figure className="ts-table">
    <svg viewBox="0 0 160 90" role="img" aria-label={label}>
      <rect className="ts-rail" x="0" y="0" width="160" height="90" rx="5" />
      <rect className="ts-felt" x="4" y="4" width="152" height="82" rx="2" />
      <line className="ts-cushion" x1="6" y1="84" x2="154" y2="84" />
      {POCKETS.map(([x, y]) => <circle key={`${x}-${y}`} className="ts-pocket" cx={x} cy={y} r="4" />)}
      {shot.guides.map(([a, b], i) => <line key={i} className="ts-guide" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />)}
      {potted && <polyline className="ts-path is-potted" points={shot.path.map(p => p.join(',')).join(' ')} />}
      {shot.arcs.map(arc => {
        const state = arcStates[arc.id]
        if (!state || (aim && state === 'asked')) return null
        const [lx, ly] = at(arc.at, 19, (arc.from + arc.to) / 2)
        return <g key={arc.id} className={`ts-arc is-${state}`}>
          <path d={arcPath(arc, 11)} />
          <circle cx={lx} cy={ly} r="7" />
          <text x={lx} y={ly}>{state === 'asked' ? '?' : `${arc.value}°`}</text>
        </g>
      })}
      {aim && <Target aim={aim} done={phase === 'hit'} />}
      {aim && value !== undefined && phase && <AimLines aim={aim} value={value} phase={phase} />}
      {ball && <circle className="ts-ball" cx={ball[0]} cy={ball[1]} r="2.8" />}
    </svg>
    {banner && <p className="ts-banner" role="status">{banner}</p>}
  </figure>
}

function TrickShotGame({ shots, onReplay }: { shots: Shot[]; onReplay: () => void }) {
  const [shotIndex, setShotIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  // After the last angle of a shot, the dial gives way to the "which fact?" side question.
  const [onSide, setOnSide] = useState(false)
  const [angle, setAngle] = useState(shots[0].questions[0].start)
  const [phase, setPhase] = useState<Phase>('aim')
  const [ball, setBall] = useState<Point | null>(null)
  const [tried, setTried] = useState<number | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied } = useShare()
  const { pace } = useStepPace()
  const frame = useRef(0)

  const shot = shots[shotIndex]
  const question = shot.questions[questionIndex]
  const side = shot.side
  const restBall = (q = question) => q.aim.lead ?? q.aim.vertex

  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  useEffect(() => {
    if (screen === 'done') recordRank('trick', rankFor(score.kept, shots.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  /** Which arcs show, and how: given ones always; asked ones once their question comes up. */
  const arcStates = (upTo: number, answeredCurrent: boolean): Record<string, ArcState | undefined> => {
    const asked = new Map(shot.questions.map((q, i) => [q.arc, i]))
    return Object.fromEntries(shot.arcs.map(arc => {
      const i = asked.get(arc.id)
      if (i === undefined) return [arc.id, 'known']
      if (i < upTo || (i === upTo && answeredCurrent)) return [arc.id, 'found']
      if (i === upTo) return [arc.id, 'asked']
      return [arc.id, undefined]
    }))
  }

  const aimAt = (index: number, q: number) => {
    cancelAnimationFrame(frame.current)
    const next = shots[index].questions[q]
    setQuestionIndex(q); setAngle(next.start); setPhase('aim'); setTried(null); setMissed(false); setBall(null)
  }

  const startShot = (index: number) => {
    setShotIndex(index); setScreen('intro'); setOnSide(false); setPicked(null); setRevealed(1); aimAt(index, 0)
  }

  /** Roll the ball along `path`, then call `then`. */
  const roll = (path: Point[], then: () => void) => {
    const ms = motion(1100)
    if (!ms) { setBall(path[path.length - 1]); then(); return }
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      setBall(along(path, 1 - (1 - t) ** 2))
      if (t < 1) frame.current = requestAnimationFrame(tick); else then()
    }
    frame.current = requestAnimationFrame(tick)
  }

  const takeShot = () => {
    const { aim } = question
    const right = angle === question.answer
    const end = right ? aim.target : toCushion(aim.vertex, aim.base + angle)
    setPhase('roll'); setTried(angle)
    sfx.whoosh()
    roll([...(aim.lead ? [aim.lead] : []), aim.vertex, end], () => {
      if (right) {
        if (aim.kind === 'pocket') setBall(null)
        setPhase('hit'); score.hit(!missed)
        return
      }
      setPhase('miss'); setMissed(true)
      if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1000)
    })
  }

  const retry = () => { setPhase('aim'); setBall(null) }

  const pick = (value: string) => {
    setPicked(value)
    if (value === side.answer) { score.hit(!missed); return }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 900)
  }

  const carryOn = () => {
    if (questionIndex + 1 < shot.questions.length) { aimAt(shotIndex, questionIndex + 1); return }
    if (!onSide) { setOnSide(true); setMissed(false); setPicked(null); return }
    score.bank(); setScreen('payout')
  }

  if (screen === 'done') {
    const rank = rankFor(score.kept, shots.length, RANKS)
    const brag = `I potted ${shots.length} trick shots using angle facts. Rank: ${rank.name} ${rank.badge} Beat that.`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Trick Shot complete</p>
        <RankCard rank={rank} stats={[['Shots', `${shots.length}/${shots.length}`], ['Lives kept', `${score.kept}/${shots.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule label="The angle facts" steps={['Straight line: angles add to 180°.', 'Vertically opposite angles are equal.', 'Triangle: angles add to 180°. Bounce: angle in = angle out.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Trick Shot', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onReplay}>Rack ’em up again</button>
        </div>
      </footer>
    </main>
  }

  const tone = phase === 'hit' ? 'right' : phase === 'miss' ? 'wrong' : 'default'
  const mood = (offset: number) => shotIndex * 3 + questionIndex + offset
  const last = questionIndex + 1 === shot.questions.length
  const sideRight = picked !== null && picked === side.answer
  const sideWrong = picked !== null && !sideRight
  const tableLabel = `${shot.title}: pool table with the angles marked.`

  return <main className="lab">
    <LabTop progress={`Shot ${shotIndex + 1}/${shots.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <section className="lab-intro">
        <p className="lab-kicker">{shot.title}</p>
        <h1 className="lab-title">{shot.brief}</h1>
        <div className="lab-card rv-paper ts-card"><Table shot={shot} arcStates={arcStates(0, false)} ball={restBall(shot.questions[0])} banner={null} label={tableLabel} /></div>
        <Quip speaker={VIC}>{INTROS[shotIndex]}</Quip>
        <Why>{shot.why}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { sfx.tick(); setScreen('question') }}>Line it up</button>
      </footer>
    </>}

    {screen === 'question' && !onSide && <>
      <section className="lab-card rv-paper ts-card">
        <Table
          shot={shot}
          arcStates={arcStates(questionIndex, phase === 'hit')}
          ball={ball ?? (phase === 'aim' ? restBall() : null)}
          banner={phase === 'hit' ? BANNER[question.aim.kind] : null}
          aim={question.aim}
          value={phase === 'hit' ? question.answer : angle}
          phase={phase}
          label={`${tableLabel} Cue angle ${angle}°.`}
        />
      </section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{VIC.emoji}</span> {VIC.name} on the mic · angle {questionIndex + 1} of {shot.questions.length}</p>
        <h1 className="lab-prompt">{question.prompt}</h1>
        <NumberDial
          label="Angle"
          value={angle}
          onChange={setAngle}
          min={question.min}
          max={question.max}
          step={STEP}
          jump={JUMP}
          format={v => `${v}°`}
          target={question.answer}
          disabled={phase !== 'aim'}
          tone={tone}
        />
        {phase === 'hit' && <Combo streak={score.streak} />}
      </section>
      {(phase === 'aim' || phase === 'roll') && <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={phase === 'roll'} onClick={takeShot}>Take the shot</button>
      </footer>}
      {phase === 'hit' && <>
        <Burst key={`${shot.id}-${questionIndex}`} emoji="🎱" />
        <CheckBar status="correct" title={`${VIC.emoji} “${say(VIC.right, mood(0))}”`} message={question.why}>
          <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{last ? 'Name that fact' : 'Next angle'}</button>
        </CheckBar>
      </>}
      {phase === 'miss' && score.lives > 0 && <CheckBar status="incorrect" title={`${VIC.emoji} “${say(VIC.wrong, mood(3 - score.lives))}”`} message={tried === null ? undefined : question.nope(tried)}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={retry}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'question' && onSide && <>
      <section className="lab-card rv-paper ts-card">
        <Table shot={shot} arcStates={arcStates(shot.questions.length, false)} ball={null} banner={sideRight ? BANNER.pocket : null} label={tableLabel} />
      </section>
      <section className="lab-ask ts-side">
        <p className="lab-asker"><span aria-hidden="true">{VIC.emoji}</span> {VIC.name} · the replay</p>
        <h1 className="lab-prompt">{side.prompt}</h1>
        <Choices choices={side.choices} picked={picked} answer={side.answer} columns={1} onPick={value => pick(value as string)} />
        {sideRight && <Combo streak={score.streak} />}
      </section>
      {sideRight && <CheckBar status="correct" title={`${VIC.emoji} “${say(VIC.right, mood(1))}”`} message={side.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>See the working</button>
      </CheckBar>}
      {sideWrong && score.lives > 0 && <CheckBar status="incorrect" title={`${VIC.emoji} “${say(VIC.wrong, mood(3 - score.lives))}”`} message={side.choices.find(choice => choice.value === picked)?.nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🎱</span>
        <p className="lab-kicker">Scratch!</p>
        <h1 className="lab-title">Three misses. Big Vic needs a sit down.</h1>
        <Why tag="Tip">Straight line = 180°. Opposite angles are equal. A triangle’s angles add to 180°. Angle in = angle out.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startShot(shotIndex) }}>Re-rack</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <Burst key={shot.id} emoji="🎱" />
      <section className="lab-card rv-paper ts-card">
        <Table shot={shot} arcStates={arcStates(shot.questions.length, false)} ball={null} banner={BANNER.pocket} label={tableLabel} />
      </section>
      <section className="lab-card lab-card--working rv-paper">
        <h2 className="lab-working__title">The working</h2>
        <StepChain key={shot.id} steps={shot.chain} revealed={revealed} pace={pace} />
      </section>
      <footer className="lab-bar">
        <StepDots total={shot.chain.length - 1} current={revealed - 1} onSelect={step => setRevealed(step + 1)} />
        <div className="lab-bar__actions">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-icon-btn" aria-label="Previous step" disabled={revealed === 1} onClick={() => setRevealed(revealed - 1)}>←</button>
          {revealed < shot.chain.length
            ? <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => setRevealed(revealed + 1)}>{revealed === 1 ? 'Show the working' : 'Next step'}</button>
            : <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => shotIndex + 1 < shots.length ? startShot(shotIndex + 1) : setScreen('done')}>
              {shotIndex + 1 < shots.length ? 'Next shot' : 'Finish'}
            </button>}
        </div>
      </footer>
    </>}
  </main>
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function TrickShot() {
  const { data, play, regenerate } = useGenerated(makeShots)
  return data ? <TrickShotGame key={play} shots={data} onReplay={regenerate} /> : null
}

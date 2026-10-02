'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker } from '../kit/Lab'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { makeShots, POCKETS, type Arc, type Point, type Shot } from './shots'
import './TrickShot.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'

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

const rad = (deg: number) => deg * Math.PI / 180
const at = ([x, y]: Point, r: number, deg: number): Point => [x + r * Math.cos(rad(deg)), y - r * Math.sin(rad(deg))]

function arcPath(arc: Arc, r: number) {
  const [x1, y1] = at(arc.at, r, arc.from), [x2, y2] = at(arc.at, r, arc.to)
  return `M ${arc.at[0]} ${arc.at[1]} L ${x1} ${y1} A ${r} ${r} 0 ${arc.to - arc.from > 180 ? 1 : 0} 0 ${x2} ${y2} Z`
}

/** Where the ball is after `t` (0 to 1) of the way along its path. */
function along(path: Point[], t: number): Point {
  const lengths = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]))
  let left = t * lengths.reduce((sum, l) => sum + l, 0)
  for (let i = 0; i < lengths.length; i++) {
    if (left <= lengths[i]) {
      const k = left / lengths[i], [a, b] = [path[i], path[i + 1]]
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]
    }
    left -= lengths[i]
  }
  return path[path.length - 1]
}

type ArcState = 'known' | 'asked' | 'found'

function Table({ shot, arcStates, ball, potted }: { shot: Shot; arcStates: Record<string, ArcState | undefined>; ball: Point | null; potted: boolean }) {
  return <figure className="ts-table">
    <svg viewBox="0 0 160 90" role="img" aria-label={`${shot.title}: pool table with the angles marked`}>
      <rect className="ts-rail" x="0" y="0" width="160" height="90" rx="5" />
      <rect className="ts-felt" x="4" y="4" width="152" height="82" rx="2" />
      <line className="ts-cushion" x1="6" y1="84" x2="154" y2="84" />
      {POCKETS.map(([x, y]) => <circle key={`${x}-${y}`} className="ts-pocket" cx={x} cy={y} r="4" />)}
      {shot.guides.map(([a, b], i) => <line key={i} className="ts-guide" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />)}
      <polyline className={`ts-path${potted ? ' is-potted' : ''}`} points={shot.path.map(p => p.join(',')).join(' ')} />
      {shot.arcs.map(arc => {
        const state = arcStates[arc.id]
        if (!state) return null
        const [lx, ly] = at(arc.at, 19, (arc.from + arc.to) / 2)
        return <g key={arc.id} className={`ts-arc is-${state}`}>
          <path d={arcPath(arc, 11)} />
          <circle cx={lx} cy={ly} r="7" />
          <text x={lx} y={ly}>{state === 'asked' ? '?' : `${arc.value}°`}</text>
        </g>
      })}
      {ball && <circle className="ts-ball" cx={ball[0]} cy={ball[1]} r="2.8" />}
    </svg>
    {potted && <p className="ts-banner" role="status">POTTED!</p>}
  </figure>
}

function TrickShotGame({ shots, onReplay }: { shots: Shot[]; onReplay: () => void }) {
  const [shotIndex, setShotIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [missed, setMissed] = useState(false)
  const [ball, setBall] = useState<Point | null>(() => shots[0].path[0])
  const [rolling, setRolling] = useState(false)
  const [potted, setPotted] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied, reset: resetShare } = useShare()
  const { pace } = useStepPace()
  const frame = useRef(0)

  const shot = shots[shotIndex]
  const question = shot.questions[questionIndex]
  const right = picked !== null && picked === question.answer
  const wrong = picked !== null && !right
  const nope = question.choices.find(choice => choice.value === picked)?.nope

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

  const startShot = (index: number) => {
    cancelAnimationFrame(frame.current)
    setShotIndex(index); setScreen('intro'); setQuestionIndex(0); setPicked(null); setMissed(false)
    setBall(shots[index].path[0]); setRolling(false); setPotted(false); setRevealed(1)
  }

  const roll = () => {
    setRolling(true)
    sfx.whoosh()
    const done = () => { setBall(null); setPotted(true); setRolling(false); sfx.win() }
    if (prefersReducedMotion()) { done(); return }
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1300)
      setBall(along(shot.path, 1 - (1 - t) ** 2))
      if (t < 1) frame.current = requestAnimationFrame(tick); else done()
    }
    frame.current = requestAnimationFrame(tick)
  }

  const pick = (value: number) => {
    setPicked(value)
    if (value === question.answer) {
      score.hit(!missed)
      // Rolling starts now, so the result bar waits for the ball instead of flashing up first.
      if (questionIndex === shot.questions.length - 1) { setRolling(true); setTimeout(roll, 350) }
      return
    }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 900)
  }

  const carryOn = () => {
    setPicked(null); setMissed(false)
    if (questionIndex + 1 < shot.questions.length) setQuestionIndex(questionIndex + 1)
    else { score.bank(); setScreen('payout') }
  }

  const restart = onReplay

  if (screen === 'done') {
    const rank = rankFor(score.kept, shots.length, RANKS)
    const brag = `I potted ${shots.length} trick shots using angle facts. Rank: ${rank.name} ${rank.badge} Beat that.`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Trick Shot complete</p>
        <RankCard rank={rank} stats={[['Shots', `${shots.length}/${shots.length}`], ['Lives kept', `${score.kept}/${shots.length * 3}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule label="The angle facts" steps={['Straight line: angles add to 180°.', 'Vertically opposite angles are equal.', 'Triangle: angles add to 180°. Bounce: angle in = angle out.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Trick Shot', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Rack ’em up again</button>
        </div>
      </footer>
    </main>
  }

  return <main className="lab">
    <LabTop progress={`Shot ${shotIndex + 1}/${shots.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <section className="lab-intro">
        <p className="lab-kicker">{shot.title}</p>
        <h1 className="lab-title">{shot.brief}</h1>
        <div className="lab-card rv-paper ts-card"><Table shot={shot} arcStates={arcStates(0, false)} ball={shot.path[0]} potted={false} /></div>
        <Quip speaker={VIC}>{INTROS[shotIndex]}</Quip>
        <Why>{shot.why}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { sfx.tick(); setScreen('question') }}>Line it up</button>
      </footer>
    </>}

    {screen === 'question' && <>
      <section className="lab-card rv-paper ts-card">
        <Table shot={shot} arcStates={arcStates(questionIndex, right)} ball={ball} potted={potted} />
      </section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{VIC.emoji}</span> {VIC.name} on the mic</p>
        <h1 className="lab-prompt">{question.prompt}</h1>
        <Choices choices={question.choices} picked={picked} answer={question.answer} onPick={value => pick(value as number)} />
        {right && <Combo streak={score.streak} />}
      </section>
      {right && !rolling && <CheckBar status="correct" title={`${VIC.emoji} “${say(VIC.right, shotIndex * 3 + questionIndex)}”`} message={question.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{questionIndex + 1 < shot.questions.length ? 'Next angle' : 'See the working'}</button>
      </CheckBar>}
      {wrong && score.lives > 0 && <CheckBar status="incorrect" title={`${VIC.emoji} “${say(VIC.wrong, shotIndex + questionIndex + (3 - score.lives))}”`} message={nope}>
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
        <Table shot={shot} arcStates={arcStates(shot.questions.length, false)} ball={null} potted />
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

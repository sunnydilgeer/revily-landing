'use client'

import { useEffect, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, livesPerRound, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker, IntroSplit } from '../kit/Lab'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { SQUARE, corners, makeBases, squares, type Builds, type Round } from './bases'
import './BaseBuilder.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'

const BEX: Speaker = {
  name: 'Bex', emoji: '👷',
  right: ['Solid. Like my walls.', 'That’ll hold. Nice.', 'Measured twice, built once.', 'Zombies hate this one trick.', 'Proper builder, you.'],
  wrong: ['That wall’s got a gap. A zombie-sized gap.', 'Nope. I can hear groaning.', 'That’s not going to hold, mate.', 'Close. Zombies don’t do close.'],
}
const INTROS = [
  'Walls first. Zombies don’t care about your floor.',
  'Somebody bit a corner off this one. Still need every wall, though.',
  'Floor’s bare and the tiles come in crates. Order too few and we’re sleeping on mud.',
  'Floor’s done, plans are lost. We know the area and one wall. Work backwards, genius.',
  'The great hall. Big floor, real money. Get this order wrong and it’s coming out of your pocket.',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🏰', name: 'Fortress Architect', line: 'Not one gap. The zombies filed a complaint.' },
  { badge: '🧱', name: 'Wall Boss', line: 'A wobble or two, but every base held.' },
  { badge: '🔨', name: 'Apprentice Builder', line: 'Bases standing. Just about. Bex is double-checking.' },
  { badge: '🧟', name: 'Zombie Snack', line: 'The zombies say thanks for dinner. Build it again.' },
]

/** Plan units per 5 m square, and room round the base for labels and zombies. */
const CELL = 22
const VIEW_W = 320
const MARGIN = 48

/** Little extras on the plan, filled in from what's been worked out so far. */
function builtBy(round: Round, done: number) {
  const built = new Set<Builds>(round.questions.slice(0, done).map(question => question.builds))
  // A found side puts the walls up, unless the round asks for the walls separately.
  const ownWalls = round.questions.some(question => question.builds === 'walls')
  return {
    walls: round.walled || built.has('walls') || (built.has('side') && !ownWalls),
    side: built.has('side'), floor: round.floored || built.has('floor'), crates: built.has('crates'),
  }
}

/**
 * The top-down plan: 5 m grid squares, the walls drawing round the edge once the perimeter's known,
 * the floor tiling square by square once the area's known, and zombies creeping in on every slip.
 */
function Plan({ round, done, lost, night }: { round: Round; done: number; lost: number; night: boolean }) {
  const { plan } = round
  const { walls, side, floor, crates } = builtBy(round, done)
  const width = plan.w / SQUARE * CELL, height = plan.h / SQUARE * CELL
  const viewH = height + MARGIN * 2
  const ox = (VIEW_W - width) / 2, oy = MARGIN
  const points = corners(plan).map(([x, y]) => [ox + x / SQUARE * CELL, oy + y / SQUARE * CELL])
  const tiles = squares(plan)
  const per = round.coverage ? round.coverage / 25 : 1
  // The whole floor lays in about a second, however many squares there are.
  const stagger = prefersReducedMotion() ? 0 : Math.min(40, 900 / tiles.length)
  // Zombies start in the corners and creep towards the base with each life lost.
  const creep = Math.min(lost, livesPerRound()) / livesPerRound() * .6
  const lair = [[18, 22], [VIEW_W - 18, 22], [VIEW_W - 18, viewH - 14], [18, viewH - 14]]
  const goal = [[ox - 14, oy - 10], [ox + width + 14, oy - 10], [ox + width + 14, oy + height + 18], [ox - 14, oy + height + 18]]
  const gridX = Array.from({ length: Math.ceil(VIEW_W / CELL) + 1 }, (_, i) => ox % CELL + i * CELL)
  const gridY = Array.from({ length: Math.ceil(viewH / CELL) + 1 }, (_, i) => oy % CELL + i * CELL)

  return <svg className={`bd-plan${night ? ' is-night' : ''}`} viewBox={`0 0 ${VIEW_W} ${viewH}`} role="img"
    aria-label={`Plan of the base, 1 square = 5 m. Sides: ${round.labels.filter(Boolean).join(', ')}`}>
    <rect className="bd-ground" width={VIEW_W} height={viewH} />
    <g className="bd-grid" aria-hidden="true">
      {gridX.map(x => <line key={`x${x}`} x1={x} x2={x} y1={0} y2={viewH} />)}
      {gridY.map(y => <line key={`y${y}`} x1={0} x2={VIEW_W} y1={y} y2={y} />)}
    </g>
    <g aria-hidden="true">
      {tiles.map(([col, row], i) => <rect key={`${col}-${row}`}
        className={`bd-tile${floor ? ' is-laid' : ''}${crates && Math.floor(i / per) % 2 ? ' is-alt' : ''}`}
        x={ox + col * CELL + 1.5} y={oy + row * CELL + 1.5} width={CELL - 3} height={CELL - 3} rx={3}
        style={{ transitionDelay: floor && !crates ? `${i * stagger}ms` : '0ms' }} />)}
    </g>
    {plan.cut && floor && <line className="bd-split" x1={ox + (plan.w - plan.cut.w) / SQUARE * CELL} x2={ox + (plan.w - plan.cut.w) / SQUARE * CELL}
      y1={oy + plan.cut.h / SQUARE * CELL} y2={oy + height} />}
    <polygon className="bd-outline" points={points.join(' ')} />
    <polygon className={`bd-walls${walls ? ' is-up' : ''}`} points={points.join(' ')} pathLength={1} />
    {round.gate && <line className={`bd-gate${walls ? ' is-up' : ''}`}
      x1={ox + width / 2 - round.gate / SQUARE * CELL / 2} x2={ox + width / 2 + round.gate / SQUARE * CELL / 2} y1={oy + height} y2={oy + height} />}
    {round.labels.map((label, edge) => {
      if (!label) return null
      const [a, b] = [points[edge], points[(edge + 1) % points.length]]
      // Outward is to the left of each edge as the outline runs clockwise.
      const dx = Math.sign(b[0] - a[0]), dy = Math.sign(b[1] - a[1])
      const y = (a[1] + b[1]) / 2 - dx * 13 + 4
      let x = (a[0] + b[0]) / 2 + dy * 20, anchor: 'start' | 'middle' | 'end' = 'middle'
      // The L's two inner sides share the bitten-out corner: push their labels to opposite ends.
      if (plan.cut && edge === 1) { x = a[0] + 5; anchor = 'start' }
      if (plan.cut && edge === 2) { x = b[0] - 3; anchor = 'end' }
      const hidden = edge === round.missing
      const text = hidden && side ? `${round.questions[0].answer} m` : label
      return <text key={edge} className={`bd-label${hidden ? (side ? ' is-found' : ' is-missing') : ''}`} x={x} y={y} textAnchor={anchor}>{text}</text>
    })}
    <g aria-hidden="true">
      {lair.map(([x, y], i) => {
        const [gx, gy] = goal[i]
        return <text key={i} className="bd-zombie" x={0} y={0} textAnchor="middle"
          style={{ transform: `translate(${x + (gx - x) * creep}px, ${y + (gy - y) * creep}px)` }}>🧟</text>
      })}
    </g>
  </svg>
}

/** The night meter: the moon rises as the round goes on. Night lands when the base is done. */
function Night({ done, total }: { done: number; total: number }) {
  const left = total - done
  return <div className="bd-night" aria-label={left ? `Night falls in ${left} step${left === 1 ? '' : 's'}` : 'Night has fallen'}>
    <span className="bd-night__bar"><span style={{ width: `${(done + 1) / (total + 1) * 100}%` }} /></span>
    <span className="bd-night__moon" aria-hidden="true">🌙</span>
  </div>
}

/** What's been worked out on this base so far. */
function Found({ round, done }: { round: Round; done: number }) {
  const icon: Record<Builds, string> = { walls: '🧱 Walls', side: '📏 ?', floor: '🟫 Floor', crates: '📦 Crates', cost: '💷 Cost' }
  const found = round.questions.slice(0, done)
  if (!found.length) return <p className="bd-found bd-found--empty">1 square = 5 m</p>
  return <p className="bd-found" aria-live="polite">
    {found.map(question => <span key={question.builds} className="bd-chip">{icon[question.builds]} = {question.choices.find(choice => choice.value === question.answer)?.label}</span>)}
  </p>
}

export default function BaseBuilder() {
  const { data: rounds, regenerate } = useGenerated(makeBases)
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied, reset: resetShare } = useShare()
  const { pace } = useStepPace()

  useEffect(() => {
    if (screen === 'done' && rounds) recordRank('build', rankFor(score.kept, rounds.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  // The numbers are made after the page loads, so server and browser agree.
  if (!rounds) return <main className="lab" aria-busy="true" />

  const round = rounds[roundIndex]
  const question = round.questions[questionIndex]
  const right = picked !== null && picked === question.answer
  const wrong = picked !== null && !right
  const nope = question.choices.find(choice => choice.value === picked)?.nope
  const done = questionIndex + (right ? 1 : 0)
  const lost = livesPerRound() - score.lives

  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setQuestionIndex(0); setPicked(null); setMissed(false); setRevealed(1)
  }

  const pick = (value: number) => {
    setPicked(value)
    if (value === question.answer) {
      score.hit(!missed)
      if (question.builds === 'crates') sfx.stamp()
      else setTimeout(() => sfx.whoosh(), 150)
      return
    }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => { sfx.boom(); setScreen('busted') }, 1000)
  }

  const carryOn = () => {
    setPicked(null); setMissed(false)
    if (questionIndex + 1 < round.questions.length) setQuestionIndex(questionIndex + 1)
    else { score.bank(); setScreen('payout'); sfx.win() }
  }

  const restart = () => { score.reset(); resetShare(); regenerate(); startRound(0) }

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, RANKS)
    const brag = `I built ${rounds.length} zombie-proof bases using perimeter and area. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Base Builder complete</p>
        <RankCard rank={rank} stats={[['Nights survived', `${rounds.length}/${rounds.length}`], ['Lives kept', `${score.kept}/${rounds.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Perimeter = all the way round: add every side (take off any gate).', 'Area = length × width. Split L-shapes. Missing side: big − small, or area ÷ side.', 'Crates = area ÷ what one covers, rounded UP. Cost = crates × price.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Base Builder', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Build again</button>
        </div>
      </footer>
    </main>
  }

  // Long labels (1,275 m², 12 crates) need a full-width button each to fit on a phone.
  const columns = question.choices.some(choice => choice.label.length > 6) ? 1 : undefined

  return <main className="lab">
    <LabTop progress={`Night ${roundIndex + 1}/${rounds.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <IntroSplit
        key={roundIndex}
        kicker={round.title}
        title={round.heading}
        scene={<div className="lab-card rv-paper bd-stage"><Plan round={round} done={0} lost={0} night={false} /></div>}
        speaker={BEX} line={INTROS[roundIndex]}
        why={round.why}
        start="Start building"
        onStart={() => { sfx.tick(); setScreen('question') }}
      />
    </>}

    {screen === 'question' && <>
      <section className={`lab-card rv-paper bd-stage${wrong ? ' is-shaken' : ''}`}>
        <Night done={done} total={round.questions.length} />
        <Plan round={round} done={done} lost={lost} night={false} />
        <Found round={round} done={done} />
      </section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{BEX.emoji}</span> {BEX.name} asks · {round.title.split(' · ')[1]}</p>
        <h1 className="lab-prompt">{question.prompt}</h1>
        <Choices choices={question.choices} picked={picked} answer={question.answer} onPick={value => pick(value as number)} columns={columns} />
        {right && <Combo streak={score.streak} />}
      </section>
      {right && <CheckBar status="correct" title={`${BEX.emoji} “${say(BEX.right, roundIndex * 2 + questionIndex)}”`} message={question.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{questionIndex + 1 < round.questions.length ? 'Keep building' : 'Lock it down'}</button>
      </CheckBar>}
      {wrong && score.lives > 0 && <CheckBar status="incorrect" title={`${BEX.emoji} “${say(BEX.wrong, roundIndex + questionIndex + lost)}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🧟</span>
        <p className="lab-kicker">The zombies got in</p>
        <h1 className="lab-title">Gap in the walls. Patch it up and try that base again.</h1>
        <Why tag="Tip">Walls go round the edge: add every side. Floor is the inside: length × width. For an L, split it into two rectangles. Crates always round up.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Rebuild</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <Burst key={round.id} emoji="🧱" />
      <section className="lab-card rv-paper bd-stage bd-stage--night">
        <p className="bd-banner" role="status">🌙 Night falls… the base holds!</p>
        <Plan round={round} done={round.questions.length} lost={0} night />
        <Found round={round} done={round.questions.length} />
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
              {roundIndex + 1 < rounds.length ? 'Next night' : 'Finish'}
            </button>}
        </div>
      </footer>
    </>}
  </main>
}

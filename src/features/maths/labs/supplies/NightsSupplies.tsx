'use client'

import { useEffect, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker, livesPerRound, IntroSplit } from '../kit/Lab'
import { NumberDial } from '../kit/NumberDial'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { fmt, makeRounds, unitText, type DialStep, type Round, type Scene } from './rounds'
import './NightsSupplies.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'
type Result = 'right' | 'wrong' | null

const SCOUT: Speaker = {
  name: 'Scout', emoji: '🏕️',
  right: ['Phew. PHEW. Okay. We might survive this.', 'Yes! Supplies sorted. Heart rate: slightly lower.', 'You’re the calmest person in this forest.', 'Perfect. I only screamed a little bit.', 'Packed. Ticked. Breathing again.'],
  wrong: ['That’s not enough! Or too much! Either way, PANIC.', 'The sun is literally going down right now.', 'Wrong unit. The forest does not forgive wrong units.', 'Nope. Something just howled. Try again. Quickly.'],
}
const INTROS = [
  'Okay okay okay. Sun’s going down. Tent first. The rope says metres, the tent says cm. Why are they like this?',
  'Water and food. If we run out, it’s squirrels for dinner. Litres, ml, kilos, grams. Help.',
  'It’s nearly dark. Someone has to watch the fire all night. Hours and minutes. Please don’t say 2.30 hours.',
  'Now it’s backwards. Grams and metres, but the scale wants kilos and the map wants km. That’s divide. I think. You check.',
  'Boss level. Water for the whole camp, and the shop only sells big bottles. Get this wrong and we’re drinking pond.',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🔦', name: 'Night Warden', line: 'Every supply measured first time. Scout has stopped hyperventilating.' },
  { badge: '🏕️', name: 'Camp Captain', line: 'A wobble or two, but the camp is ready before dark.' },
  { badge: '🪵', name: 'Wood Gatherer', line: 'You got there. Scout is still recounting the cups.' },
  { badge: '🐺', name: 'Wolf Snack', line: 'The units got you. Pack again before the sun goes.' },
]
const ITEM = { cup: { full: '🥤', empty: '🫙' }, bag: { full: '🍚', empty: '🛍️' }, bottle: { full: '🧴', empty: '🫙' } }

/** Scene units: 320 × 210. The camp is the top strip; the bench below shows the current job. */
const W = 320
const TRACK = { x0: 40, x1: 280 }
/** Where the right answer lands on a track, so there's room to overshoot. */
const AT = 0.8

/** The camp: sky darkening, sun setting, stars coming out as more supplies are packed. */
function Camp({ dusk }: { dusk: number }) {
  const sunY = 14 + dusk * 64
  return <g className="ns-camp">
    <rect className="ns-sky" x={0} y={0} width={W} height={74} />
    <rect className="ns-night" x={0} y={0} width={W} height={74} style={{ opacity: Math.min(.92, dusk * .95) }} />
    {[[30, 12], [88, 26], [150, 9], [204, 22], [262, 13], [300, 30]].map(([x, y], i) =>
      <circle key={i} className="ns-star" cx={x} cy={y} r={1.4} style={{ opacity: Math.max(0, dusk * 1.4 - .4) }} />)}
    <circle className="ns-sun" cx={246} cy={sunY} r={11} />
    <rect className="ns-ground" x={0} y={66} width={W} height={10} />
    {[14, 40, 280, 306].map((x, i) => <path key={x} className="ns-tree" d={`M${x} ${20 + (i % 2) * 6}L${x + 16} 68H${x - 16}Z`} />)}
    <path className="ns-tent" d="M92 68L118 30L144 68Z" />
    <path className="ns-tent__door" d="M112 68L118 50L124 68Z" />
    <text className="ns-emoji" x={186} y={60} fontSize={18}>🔥</text>
    <text className="ns-emoji" x={214} y={62} fontSize={16}>🏕️</text>
  </g>
}

/** The current job on the bench, and what the student's committed value does to it. */
function Bench({ scene, unit, value, right }: { scene: Scene; unit: string; value: number | null; right: boolean }) {
  const tone = value === null ? '' : right ? ' is-right' : ' is-wrong'
  const top = 92
  if (scene.kind === 'measure') {
    const to = TRACK.x0 + AT * (TRACK.x1 - TRACK.x0)
    const reach = value === null ? 0 : Math.min(1.2, value / scene.target)
    const end = TRACK.x0 + reach * AT * (TRACK.x1 - TRACK.x0)
    const y = top + 52
    return <g className={`ns-bench is-${scene.look}${tone}`}>
      <text className="ns-given" x={W / 2} y={top + 12} textAnchor="middle">{scene.given}</text>
      <line className="ns-track" x1={TRACK.x0} y1={y} x2={TRACK.x1 + 20} y2={y} />
      {value !== null && value > 0 && <g key={value} className="ns-grow" style={{ transformOrigin: `${TRACK.x0}px ${y}px` }}>
        <line className="ns-run" x1={TRACK.x0} y1={y} x2={end} y2={y} />
      </g>}
      <text className="ns-emoji" x={TRACK.x0 - 22} y={y + 7} fontSize={20}>{scene.from}</text>
      <text className="ns-emoji ns-goal" x={to - 10} y={y - 12} fontSize={20}>{scene.to}</text>
      <line className="ns-goal-line" x1={to} y1={y - 10} x2={to} y2={y + 10} />
      {value !== null && <text className="ns-tag" x={Math.max(70, Math.min(W - 50, end))} y={y + 30} textAnchor="middle">
        {unitText(value, unit)} {right ? '✓' : reach < 1 ? '· short' : '· too far'}
      </text>}
    </g>
  }
  if (scene.kind === 'jug') {
    const h = 86, base = top + 104, cap = h * .8
    const got = value === null ? 0 : Math.min(value, scene.target) / scene.target
    const asked = value === null ? 0 : Math.min(1.2, value / scene.target)
    return <g className={`ns-bench${tone}`}>
      <text className="ns-given" x={92} y={top + 8} textAnchor="middle">{scene.from ?? 'Can'}: {scene.given}</text>
      <rect className="ns-vessel" x={60} y={base - h} width={64} height={h} rx={8} />
      <rect className="ns-water" x={62} y={base - cap * (1 - got)} width={60} height={cap * (1 - got)} rx={6} />
      <text className="ns-arrow" x={160} y={base - 40} textAnchor="middle">➜</text>
      <text className="ns-given" x={232} y={top + 8} textAnchor="middle">{scene.into ?? 'Jug (ml)'}</text>
      <path className="ns-vessel" d={`M200 ${base - h}H264L258 ${base}H206Z`} />
      {got > 0 && <rect key={value} className="ns-water ns-rise" x={207} y={base - cap * got} width={50} height={cap * got} style={{ transformOrigin: `232px ${base}px` }} />}
      {value !== null && <g>
        <line className="ns-mark" x1={194} y1={base - cap * asked} x2={270} y2={base - cap * asked} />
        <text className="ns-tag" x={232} y={base - cap * asked - 5} textAnchor="middle">{unitText(value, unit)}</text>
      </g>}
    </g>
  }
  if (scene.kind === 'split') {
    const v = value ?? 0
    const span = Math.max(scene.total, v * scene.each)
    const px = (amount: number) => (amount / span) * (W - 40)
    const y = top + 50, x0 = 20
    const pieces = Array.from({ length: v }, (_, i) => i)
    const left = scene.total - v * scene.each
    return <g className={`ns-bench is-${scene.look}${tone}`}>
      <text className="ns-given" x={W / 2} y={top + 12} textAnchor="middle">{scene.given} · {scene.eachText} each</text>
      <rect className="ns-whole" x={x0} y={y - 7} width={px(scene.total)} height={14} rx={7} />
      {pieces.map(i => {
        const over = (i + 1) * scene.each > scene.total + 1e-9
        return <rect key={`${v}-${i}`} className={`ns-piece${over ? ' is-missing' : ''}`} style={{ animationDelay: `${Math.min(i, 20) * 40}ms` }}
          x={x0 + px(i * scene.each) + 1} y={y - 7} width={Math.max(1, px(scene.each) - 2)} height={14} rx={4} />
      })}
      {value !== null && <text className="ns-tag" x={W / 2} y={y + 34} textAnchor="middle">
        {right ? `${unitText(v, unit)} · nothing wasted ✓` : left > 0 ? `${unitText(v, unit)} · ${fmt(left)} ${scene.look === 'rope' ? 'cm' : 'min'} left over` : `${unitText(v, unit)} · not enough to go round`}
      </text>}
    </g>
  }
  const v = value ?? 0
  const per = 10, size = 21, gx = 96, gy = top + 14
  return <g className={`ns-bench${tone}`}>
    <text className="ns-emoji" x={22} y={top + 50} fontSize={34} style={{ opacity: value === null ? 1 : right || v > scene.target ? .25 : .7 }}>{scene.source}</text>
    <text className="ns-given" x={42} y={top + 80} textAnchor="middle">{scene.given.split(' · ')[0]}</text>
    <text className="ns-given" x={42} y={top + 96} textAnchor="middle">{scene.given.split(' · ')[1]}</text>
    {Array.from({ length: v }, (_, i) => {
      const full = i < scene.target
      return <text key={`${v}-${i}`} className={`ns-emoji ns-pop${full ? '' : ' is-empty'}`} style={{ animationDelay: `${Math.min(i, 25) * 35}ms` }}
        x={gx + (i % per) * size} y={gy + Math.floor(i / per) * (size + 2) + 16} fontSize={16}>{full ? ITEM[scene.item].full : ITEM[scene.item].empty}</text>
    })}
    {value !== null && <text className="ns-tag" x={gx + 105} y={top + 108} textAnchor="middle">
      {scene.item === 'bottle'
        ? right ? `${unitText(v, unit)} · enough for all ✓` : v > scene.target ? `${v - scene.target} more than needed` : 'not enough water'
        : right ? `${unitText(v, unit)} · all used ✓` : v > scene.target ? `${v - scene.target} left empty` : `some left over`}
    </text>}
  </g>
}

function Stage({ dusk, step, committed, right, packed }: {
  dusk: number; step: DialStep | null; committed: number | null; right: boolean; packed: string[]
}) {
  const label = step ? `Camp at dusk. ${step.scene.given}.${committed !== null ? ` You set ${unitText(committed, step.unit)}.` : ''}` : 'Camp at dusk.'
  return <section className="lab-card ns-stage">
    <svg viewBox={`0 0 ${W} ${step ? 210 : 78}`} role="img" aria-label={label}>
      <Camp dusk={dusk} />
      {step && <Bench scene={step.scene} unit={step.unit} value={committed} right={right} />}
    </svg>
    {packed.length > 0 && <ul className="ns-packed" aria-label="Packed so far">
      {packed.map(item => <li key={item}>{item}</li>)}
    </ul>}
  </section>
}

function NightsSuppliesGame({ rounds, onReplay }: { rounds: Round[]; onReplay: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [stepIndex, setStepIndex] = useState(0)
  const [value, setValue] = useState(() => (rounds[0].steps[0] as DialStep).start)
  const [committed, setCommitted] = useState<number | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [result, setResult] = useState<Result>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const [packed, setPacked] = useState<string[]>([])
  const score = useScore()
  const { share, copied } = useShare()
  const { pace } = useStepPace()

  useEffect(() => {
    if (screen === 'done') recordRank('supplies', rankFor(score.kept, rounds.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const round = rounds[roundIndex]
  const step = round.steps[stepIndex]
  const allSteps = rounds.reduce((sum, r) => sum + r.steps.length, 0)
  const before = rounds.slice(0, roundIndex).reduce((sum, r) => sum + r.steps.length, 0)
  const doneSteps = screen === 'done' ? allSteps : screen === 'payout' ? before + round.steps.length : before + stepIndex + (result === 'right' ? 1 : 0)
  const dusk = doneSteps / allSteps

  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setStepIndex(0); setResult(null); setCommitted(null); setPicked(null); setMissed(false); setRevealed(1)
    setPacked([])
    setValue((rounds[index].steps[0] as DialStep).start)
  }

  const fail = () => {
    setResult('wrong'); setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1400)
  }

  const commit = () => {
    if (step.kind !== 'dial') return
    setCommitted(value)
    if (Math.abs(value - step.answer) < 1e-6) { setResult('right'); score.hit(!missed); setPacked([...packed, step.packed]); sfx.bubble() }
    else fail()
  }

  const pick = (choice: number | string) => {
    if (step.kind !== 'choice') return
    setPicked(String(choice))
    if (choice === step.answer) { setResult('right'); score.hit(!missed) }
    else fail()
  }

  const carryOn = () => {
    setResult(null); setCommitted(null); setPicked(null); setMissed(false)
    const next = round.steps[stepIndex + 1]
    if (next) { setStepIndex(stepIndex + 1); if (next.kind === 'dial') setValue(next.start) }
    else { score.bank(); setScreen('payout'); sfx.win() }
  }

  // Try again keeps the dial where it was, so they adjust rather than start over.
  const retry = () => { setResult(null); setCommitted(null); setPicked(null) }

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, RANKS)
    const brag = `I packed a whole forest camp before dark, every unit converted. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">99 Nights Supplies complete</p>
        <Stage dusk={1} step={null} committed={null} right={false} packed={[]} />
        <RankCard rank={rank} stats={[['Rounds', `${rounds.length}/${rounds.length}`], ['Lives kept', `${score.kept}/${rounds.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Big unit to small unit: multiply. Small to big: divide.', 'km, kg and litres: 1,000 of the small unit. 1 m = 100 cm. 1 hour = 60 min.', 'Same units before you add or share. Buying whole bottles? Round up.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('99 Nights Supplies', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onReplay}>Pack again</button>
        </div>
      </footer>
    </main>
  }

  const dialStep = step.kind === 'dial' ? step : null
  const nope = result === 'wrong'
    ? step.kind === 'choice' ? step.choices.find(choice => choice.value === picked)?.nope : step.nope(committed ?? 0)
    : undefined
  const mood = roundIndex * 4 + stepIndex

  return <main className="lab">
    <LabTop progress={`Round ${roundIndex + 1}/${rounds.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <IntroSplit
        key={roundIndex}
        kicker={round.title}
        title={round.headline}
        scene={<Stage dusk={dusk} step={null} committed={null} right={false} packed={[]} />}
        speaker={SCOUT} line={INTROS[roundIndex]}
        why={round.why}
        start={roundIndex === 0 ? 'Start packing' : 'Next job'}
        onStart={() => { sfx.tick(); setScreen('question') }}
      />
    </>}

    {screen === 'question' && <>
      <Stage dusk={dusk} step={dialStep} committed={committed} right={result === 'right'} packed={packed} />
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{SCOUT.emoji}</span> {SCOUT.name} asks · {step.asker}</p>
        <h1 className="lab-prompt">{step.prompt}</h1>
        {step.kind === 'choice'
          ? <Choices choices={step.choices} picked={picked} answer={step.answer} onPick={pick} />
          : <NumberDial
            key={step.id}
            label={step.label}
            value={value}
            onChange={setValue}
            min={step.min}
            max={step.max}
            step={step.step}
            jump={step.jump}
            format={v => unitText(v, step.unit)}
            target={step.answer}
            disabled={result !== null}
            tone={result ?? 'default'}
          />}
        {result === 'right' && <Combo streak={score.streak} />}
      </section>
      {result === null && step.kind === 'dial' && <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={commit}>{step.commit}</button>
      </footer>}
      {result === 'right' && <CheckBar status="correct" title={`${SCOUT.emoji} “${say(SCOUT.right, mood)}”`} message={step.kind === 'dial' ? step.win : step.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{stepIndex + 1 < round.steps.length ? 'Next' : 'See the working'}</button>
      </CheckBar>}
      {result === 'wrong' && score.lives > 0 && <CheckBar status="incorrect" title={`${SCOUT.emoji} “${say(SCOUT.wrong, mood + (3 - score.lives))}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={retry}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🐺</span>
        <p className="lab-kicker">Dark already</p>
        <h1 className="lab-title">Three mix-ups. The sun’s gone and the camp isn’t ready.</h1>
        <Why tag="Tip">Big unit to small unit, multiply. Small to big, divide. 1 km = 1,000 m, 1 m = 100 cm, 1 litre = 1,000 ml, 1 kg = 1,000 g. An hour is 60 minutes, not 100. And you can’t buy half a bottle: round up.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Try the round again</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <Burst key={round.id} emoji="✨" />
      <Stage dusk={dusk} step={null} committed={null} right={false} packed={packed} />
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
export default function NightsSupplies() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <NightsSuppliesGame key={play} rounds={data} onReplay={regenerate} /> : null
}

'use client'

import { useEffect, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker, livesPerRound, IntroSplit } from '../kit/Lab'
import { NumberDial } from '../kit/NumberDial'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { LINES, half, makeRounds, nopeFor, num, sqText, type BarRound, type FakeRound, type PieRound, type Round, type Shot } from './rounds'
import './GoingViral.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'
/** set: dial live · hit / miss: the result of the value they posted */
type Phase = 'set' | 'hit' | 'miss'

const TIA: Speaker = {
  name: 'Tia', emoji: '📱',
  right: ['Slay. That chart is serving.', 'Okay that’s actually so clean.', 'The brand is gonna LOVE this.', 'Main character energy. Literally.', 'Screenshotting that. For my portfolio.'],
  wrong: ['Babe… that’s not it.', 'My manager just left me on read.', 'That chart is giving fake news.', 'Cringe. Fix it before anyone sees.'],
}
const INTROS = [
  'My manager wants my views as a bar chart for the pitch. Some bars are done. You do the rest. Don’t make me look flop.',
  'Now the brand wants to know WHO watches me. A pie chart, apparently. It’s giving maths class but okay.',
  'So… my manager made THIS chart. The brand says it looks sus. Help me make it honest before we get cancelled.',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🚀', name: 'Gone Viral', line: 'Every chart perfect first time. The brand signed on the spot.' },
  { badge: '📈', name: 'Trending', line: 'A wobble or two, but the pitch landed.' },
  { badge: '🤳', name: 'Micro-Influencer', line: 'You got there. The brand wants “one more look”.' },
  { badge: '👻', name: 'Zero Engagement', line: 'The charts flopped. Post again.' },
]
const COLOURS = ['var(--rv-step-as)', 'var(--rv-biro)', 'var(--rv-step-i)', 'var(--rv-step-dm)']
const motion = (ms: number) => prefersReducedMotion() ? 0 : ms

/* ---------- Round 1: the bar chart ---------- */

// Plot area inside a 320 × 236 viewBox.
const BX0 = 46, BX1 = 312, BY0 = 16, BY1 = 186

function BarChart({ round, heights, active, phase }: { round: BarRound; heights: (number | null)[]; active: number | null; phase: Phase }) {
  const sq = (BY1 - BY0) / LINES
  const slot = (BX1 - BX0) / round.posts.length
  const w = Math.min(34, slot * .62)
  const label = `Bar chart of views. ${round.posts.map((p, i) => `${p.name}: ${heights[i] === null ? 'not drawn' : num(heights[i]! * round.line)}`).join(', ')}.`
  return <figure className={`gv-chart is-${phase}`}>
    <svg viewBox="0 0 320 236" role="img" aria-label={label}>
      <text className="gv-axis__name" x={12} y={(BY0 + BY1) / 2} transform={`rotate(-90 12 ${(BY0 + BY1) / 2})`} textAnchor="middle">Views</text>
      {Array.from({ length: LINES + 1 }, (_, i) => <g key={i}>
        <line className={i === 0 ? 'gv-axis' : 'gv-gridline'} x1={BX0} x2={BX1} y1={BY1 - i * sq} y2={BY1 - i * sq} />
        {i % 2 === 0 && <text className="gv-tick" x={BX0 - 6} y={BY1 - i * sq + 3.5} textAnchor="end">{num(i * round.line)}</text>}
      </g>)}
      <line className="gv-axis" x1={BX0} x2={BX0} y1={BY0 - 4} y2={BY1} />
      {round.posts.map((p, i) => {
        const h = heights[i], x = BX0 + slot * i + (slot - w) / 2
        const isActive = active === i
        return <g key={p.name} className={`gv-bar${isActive ? ' is-active' : ''}${h === null ? ' is-empty' : ''}`}>
          {isActive && <rect className="gv-bar__slot" x={x - 3} y={BY0} width={w + 6} height={BY1 - BY0} rx={4} />}
          <rect className="gv-bar__fill" x={x} width={w} y={BY1 - (h ?? 0) * sq} height={(h ?? 0) * sq} style={{ fill: COLOURS[i % 4] }} />
          {isActive && h !== null && <text className="gv-bar__read" x={x + w / 2} y={BY1 - h * sq - 5} textAnchor="middle">{half(h)}</text>}
          <text className="gv-bar__emoji" x={x + w / 2} y={BY1 + 18} textAnchor="middle">{p.emoji}</text>
          <text className="gv-bar__name" x={x + w / 2} y={BY1 + 33} textAnchor="middle">{p.name}</text>
        </g>
      })}
    </svg>
  </figure>
}

function ViewsTable({ round, active }: { round: BarRound; active: number | null }) {
  return <table className="gv-table">
    <thead><tr><th scope="row">Post</th>{round.posts.map(p => <th key={p.name} scope="col"><span aria-hidden="true">{p.emoji}</span> {p.name}</th>)}</tr></thead>
    <tbody><tr><th scope="row">Views</th>{round.posts.map((p, i) => <td key={p.name} className={active === i ? 'is-active' : ''}>{num(p.views)}</td>)}</tr></tbody>
  </table>
}

/* ---------- Round 2: the pie chart ---------- */

const CX = 160, CY = 112, R = 92
const at = (deg: number, r = R) => {
  const rad = (deg - 90) * Math.PI / 180
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)] as const
}
function sector(from: number, size: number) {
  if (size >= 360) return `M${CX} ${CY - R} A${R} ${R} 0 1 1 ${CX - .01} ${CY - R} Z`
  const [x1, y1] = at(from), [x2, y2] = at(from + size)
  return `M${CX} ${CY} L${x1} ${y1} A${R} ${R} 0 ${size > 180 ? 1 : 0} 1 ${x2} ${y2} Z`
}

function PieChart({ round, angles, active, phase }: { round: PieRound; angles: (number | null)[]; active: number | null; phase: Phase }) {
  let from = 0
  const used = angles.reduce<number>((a, b) => a + (b ?? 0), 0)
  const label = `Pie chart. ${round.groups.map((g, i) => `${g.name}: ${angles[i] === null ? 'not drawn' : `${angles[i]}°`}`).join(', ')}.`
  return <figure className={`gv-chart is-${phase}${used > 360 ? ' is-over' : ''}`}>
    <svg viewBox="0 0 320 224" role="img" aria-label={label}>
      <circle className="gv-pie__blank" cx={CX} cy={CY} r={R} />
      {Array.from({ length: 36 }, (_, i) => {
        const [x1, y1] = at(i * 10, R + 2), [x2, y2] = at(i * 10, R + (i % 9 === 0 ? 10 : 6))
        return <line key={i} className="gv-pie__tick" x1={x1} y1={y1} x2={x2} y2={y2} />
      })}
      {round.groups.map((g, i) => {
        const a = angles[i]
        if (a === null || a <= 0) return null
        const size = Math.min(a, 360 - from), start = from
        from += a
        if (size <= 0) return null
        const [lx, ly] = at(start + size / 2, R * .62)
        return <g key={g.name} className={`gv-slice${active === i ? ' is-active' : ''}`}>
          <path d={sector(start, size)} style={{ fill: COLOURS[i] }} />
          {size >= 24 && <text className="gv-slice__emoji" x={lx} y={ly - 2} textAnchor="middle">{g.emoji}</text>}
          {size >= 24 && <text className="gv-slice__deg" x={lx} y={ly + 13} textAnchor="middle">{a}°</text>}
        </g>
      })}
    </svg>
    <p className="gv-readout" aria-live="polite">{Math.min(used, 999)}° of 360° used{used > 360 ? ' · too much!' : ''}</p>
  </figure>
}

function ViewersTable({ round, angles, active }: { round: PieRound; angles: (number | null)[]; active: number | null }) {
  return <table className="gv-table gv-table--pie">
    <thead><tr><th scope="col">Viewers</th><th scope="col">How many</th><th scope="col">Angle</th></tr></thead>
    <tbody>
      {round.groups.map((g, i) => <tr key={g.name} className={active === i ? 'is-active' : ''}>
        <th scope="row"><span className="gv-swatch" style={{ background: COLOURS[i] }} aria-hidden="true" /> {g.emoji} {g.name}</th>
        <td>{g.count}</td>
        <td>{active === i ? '?' : angles[i] === null ? '' : `${angles[i]}°`}</td>
      </tr>)}
      <tr className="gv-table__total"><th scope="row">Total</th><td>{round.total}</td><td>360°</td></tr>
    </tbody>
  </table>
}

/* ---------- Round 3: the fake chart ---------- */

const FX0 = 64, FX1 = 300, FY0 = 18, FY1 = 176

/** The smallest friendly gridline gap (1, 2, 2.5 or 5 × a power of 10) at least `raw`. */
function niceStep(raw: number) {
  const power = 10 ** Math.floor(Math.log10(raw))
  return ([1, 2, 2.5, 5, 10].map(m => m * power).find(step => step >= raw) ?? 10 * power)
}

function FakeChart({ round, start, phase }: { round: FakeRound; start: number; phase: Phase }) {
  const gap = niceStep((round.after + round.rise - start) / 4)
  const top = start + 4 * gap
  const y = (v: number) => FY1 - ((v - start) / (top - start)) * (FY1 - FY0)
  const bars = [{ label: 'Last month', v: round.before }, { label: 'This month', v: round.after }]
  const looks = (round.after - start) / (round.before - start)
  return <figure className={`gv-chart is-${phase}`}>
    <svg viewBox="0 0 320 218" role="img" aria-label={`Followers bar chart, y-axis from ${num(start)}. Last month ${num(round.before)}, this month ${num(round.after)}.`}>
      <text className="gv-axis__name" x={12} y={(FY0 + FY1) / 2} transform={`rotate(-90 12 ${(FY0 + FY1) / 2})`} textAnchor="middle">Followers</text>
      {[0, 1, 2, 3, 4].map(i => {
        const v = start + i * gap
        return <g key={i}>
          <line className={i === 0 ? 'gv-axis' : 'gv-gridline'} x1={FX0} x2={FX1} y1={y(v)} y2={y(v)} />
          <text className={`gv-tick${i === 0 && start > 0 ? ' is-sus' : ''}`} x={FX0 - 6} y={y(v) + 3.5} textAnchor="end">{num(Math.round(v))}</text>
        </g>
      })}
      <line className="gv-axis" x1={FX0} x2={FX0} y1={FY0 - 4} y2={FY1} />
      {start > 0 && <path className="gv-zigzag" d={`M${FX0 - 7} ${FY1 - 4} l7 -4 l7 4`} />}
      {bars.map((b, i) => {
        const x = FX0 + 34 + i * 116, w = 64
        return <g key={b.label} className="gv-bar">
          <rect className="gv-bar__fill" x={x} width={w} y={y(b.v)} height={FY1 - y(b.v)} style={{ fill: COLOURS[i === 0 ? 1 : 0] }} />
          <text className="gv-bar__read" x={x + w / 2} y={y(b.v) - 5} textAnchor="middle">{num(b.v)}</text>
          <text className="gv-bar__name" x={x + w / 2} y={FY1 + 18} textAnchor="middle">{b.label}</text>
        </g>
      })}
      <text className={`gv-stamp${start > 0 ? '' : ' is-honest'}`} x={FX1 - 4} y={FY1 + 36} textAnchor="end">
        {start > 0 ? `Looks ${looks.toFixed(1)}× as tall. Sus.` : 'Axis from 0: honest heights'}
      </text>
    </svg>
  </figure>
}

/* ---------- The game ---------- */

const unitFormat = (shot: Shot) => (value: number) =>
  shot.unit === 'sq' ? sqText(value).replace('squares', 'sq').replace('square', 'sq')
    : shot.unit === 'deg' ? `${value}°`
      : shot.unit === 'pct' ? `${value}%`
        : num(value)

function GoingViralGame({ rounds, onReplay }: { rounds: Round[]; onReplay: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [shotIndex, setShotIndex] = useState(0)
  const [onSide, setOnSide] = useState(false)
  const [value, setValue] = useState(rounds[0].shots[0].start)
  const [phase, setPhase] = useState<Phase>('set')
  const [picked, setPicked] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)
  const [shake, setShake] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied } = useShare()
  const { pace } = useStepPace()

  useEffect(() => {
    if (screen === 'done') recordRank('viral', rankFor(score.kept, rounds.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const round = rounds[roundIndex]
  const shot = round.shots[shotIndex]
  const side = round.side

  const aimAt = (index: number, at: number) => {
    setShotIndex(at); setValue(rounds[index].shots[at].start); setPhase('set'); setMissed(false); setPicked(null)
  }
  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setOnSide(false); setRevealed(1); aimAt(index, 0)
  }

  const post = () => {
    if (value === shot.target) { setPhase('hit'); score.hit(!missed); return }
    setPhase('miss'); setMissed(true); setShake(true)
    setTimeout(() => setShake(false), motion(450))
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1100)
  }

  const pick = (choice: string) => {
    if (!side) return
    setPicked(choice)
    if (choice === side.answer) { score.hit(!missed); return }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1000)
  }

  const carryOn = () => {
    if (shotIndex + 1 < round.shots.length) { aimAt(roundIndex, shotIndex + 1); return }
    if (side && !onSide) { setOnSide(true); setMissed(false); setPicked(null); return }
    score.bank(); setScreen('payout'); sfx.win()
  }
  const nextLabel = shotIndex + 1 < round.shots.length ? 'Next' : side && !onSide ? 'Bonus question' : 'See the working'

  /** The chart for this round. `live` draws the dial's value into the shot being set. */
  const chart = (mode: 'intro' | 'live' | 'done') => {
    const doneUpTo = mode === 'done' ? round.shots.length : mode === 'live' ? shotIndex : 0
    const p: Phase = mode === 'done' ? 'hit' : mode === 'live' ? phase : 'set'
    if (round.kind === 'bar') {
      const heights = round.posts.map((post, i) => {
        if (round.drawn.includes(i)) return post.views / round.line
        const k = round.shots.findIndex(s => s.slot === i)
        if (k < doneUpTo) return post.views / round.line
        return mode === 'live' && k === shotIndex ? value : null
      })
      const active = mode === 'live' ? shot.slot : null
      return <><BarChart round={round} heights={heights} active={active} phase={p} /><ViewsTable round={round} active={active} /></>
    }
    if (round.kind === 'pie') {
      const angles = round.groups.map((g, i) => {
        if (round.drawn.includes(i)) return g.angle
        const k = round.shots.findIndex(s => s.slot === i)
        if (k < doneUpTo) return g.angle
        return mode === 'live' && k === shotIndex ? value : null
      })
      const active = mode === 'live' ? shot.slot : null
      return <><PieChart round={round} angles={angles} active={active} phase={p} /><ViewersTable round={round} angles={angles} active={active} /></>
    }
    const start = mode === 'intro' ? round.fakeStart : mode === 'live' && shotIndex === 0 ? value : 0
    return <FakeChart round={round} start={start} phase={p} />
  }

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, RANKS)
    const brag = `I made an influencer’s stats into honest charts. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Going Viral complete</p>
        <RankCard rank={rank} stats={[['Rounds', `${rounds.length}/${rounds.length}`], ['Lives kept', `${score.kept}/${rounds.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Bar chart: read what ONE line is worth, then height = value ÷ that.', 'Pie chart: 360 ÷ total = degrees each, × how many in the group.', 'Spot a fake: check the axis starts at 0. % rise = rise ÷ original × 100.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Going Viral', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onReplay}>Post again</button>
        </div>
      </footer>
    </main>
  }

  const sideRight = picked !== null && side !== null && picked === side.answer
  const sideWrong = picked !== null && !sideRight
  const tone = phase === 'hit' ? 'right' : phase === 'miss' ? 'wrong' : 'default'
  const mood = (offset: number) => roundIndex * 3 + shotIndex + offset

  return <main className="lab">
    <LabTop progress={`Round ${roundIndex + 1}/${rounds.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <IntroSplit
        key={roundIndex}
        kicker={round.title}
        title={round.headline}
        scene={<div className="lab-card rv-paper">{chart('intro')}</div>}
        speaker={TIA} line={INTROS[roundIndex]}
        why={round.why}
        start={roundIndex === 2 ? 'Expose it' : 'Let’s chart'}
        onStart={() => { sfx.tick(); setScreen('question') }}
      />
    </>}

    {screen === 'question' && !onSide && <>
      <section className={`lab-card rv-paper${shake ? ' gv-shake' : ''}`}>{chart('live')}</section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{TIA.emoji}</span> {TIA.name} · {shotIndex + 1} of {round.shots.length}</p>
        <h1 className="lab-prompt">{shot.prompt}</h1>
        <NumberDial
          key={shot.id}
          label={shot.label}
          value={value}
          onChange={next => { setValue(next); if (phase === 'miss') setPhase('set') }}
          min={shot.min} max={shot.max} step={shot.step} jump={shot.jump}
          format={unitFormat(shot)}
          target={shot.target}
          disabled={phase === 'hit'}
          tone={tone}
        />
        {phase === 'hit' && <Combo streak={score.streak} />}
      </section>
      {phase === 'set' && <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={value === shot.start} onClick={post}>Post it</button>
      </footer>}
      {phase === 'hit' && <>
        <Burst key={shot.id} emoji={round.kind === 'fake' ? '✅' : '❤️'} />
        <CheckBar status="correct" title={`${TIA.emoji} “${say(TIA.right, mood(0))}”`} message={shot.win}>
          <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{nextLabel}</button>
        </CheckBar>
      </>}
      {phase === 'miss' && score.lives > 0 && <CheckBar status="incorrect" title={`${TIA.emoji} “${say(TIA.wrong, mood(3 - score.lives))}”`} message={nopeFor(round, shot, value)}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPhase('set')}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'question' && onSide && side && <>
      <section className="lab-card rv-paper">{round.kind === 'fake' ? <FakeChart round={round} start={round.fakeStart} phase="set" /> : chart('done')}</section>
      <section className="lab-ask gv-side">
        <p className="lab-asker"><span aria-hidden="true">{TIA.emoji}</span> {TIA.name} asks · bonus</p>
        <h1 className="lab-prompt">{side.prompt}</h1>
        <Choices choices={side.choices} picked={picked} answer={side.answer} onPick={choice => pick(choice as string)} columns={1} />
        {sideRight && <Combo streak={score.streak} />}
      </section>
      {sideRight && <CheckBar status="correct" title={`${TIA.emoji} “${say(TIA.right, mood(1))}”`} message={side.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>See the working</button>
      </CheckBar>}
      {sideWrong && score.lives > 0 && <CheckBar status="incorrect" title={`${TIA.emoji} “${say(TIA.wrong, mood(3 - score.lives))}”`} message={side.choices.find(choice => choice.value === picked)?.nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">📉</span>
        <p className="lab-kicker">Ratioed</p>
        <h1 className="lab-title">Three flops. The brand unfollowed.</h1>
        <Why tag="Tip">{round.kind === 'bar'
          ? 'Find what ONE gridline is worth from the labels first. Then height = views ÷ that. Half a line is half of it.'
          : round.kind === 'pie'
            ? 'Do 360 ÷ the total first: that’s each viewer’s slice. Then × how many in the group. The angles always add to 360°.'
            : 'Honest bar charts start at 0. % increase = rise ÷ the ORIGINAL number × 100.'}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Try that round again</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <section className="lab-card rv-paper">{chart('done')}</section>
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
export default function GoingViral() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <GoingViralGame key={play} rounds={data} onReplay={regenerate} /> : null
}

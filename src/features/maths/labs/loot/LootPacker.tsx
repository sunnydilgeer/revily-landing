'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker , livesPerRound } from '../kit/Lab'
import { NumberDial } from '../kit/NumberDial'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { cm3, formatFor, makeRounds, num, type Box, type Dial, type Round } from './rounds'
import './LootPacker.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'
/** aim: dial live · pack: crates dropping / slime pouring · hit / miss: how it landed */
type Phase = 'aim' | 'pack' | 'hit' | 'miss'

const DEX: Speaker = {
  name: 'Dex', emoji: '📦',
  right: ['PACKED. Lid shut. Nobody touch it.', 'Not a gap, not a spill. I could cry.', 'That’s going on the drop ship. Legend.', 'Perfect fit. Chef’s kiss. Quartermaster’s kiss.', 'Snug as a bug. A very valuable bug.'],
  wrong: ['The ship’s engines are warming up. HURRY.', 'That’s not packing, that’s chaos.', 'The lid won’t shut and neither will my mouth.', 'I can hear the pilot laughing from here.'],
}
const INTROS = [
  'Drop ship leaves in five! I’ve got a chest and a mountain of crates. Floor first, then stack. GO.',
  'These chests come in cm, not crates. Same trick, bigger numbers. Don’t panic. I’m panicking for both of us.',
  'Someone ordered a tank of slime. Don’t ask. It’s sold in litres, so we need to convert.',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🚀', name: 'Master Quartermaster', line: 'Every chest packed first time. The drop ship left early, just for you.' },
  { badge: '📦', name: 'Cargo Boss', line: 'A wobbly lid or two, but the loot made the flight.' },
  { badge: '🧳', name: 'Baggage Handler', line: 'You got there. Some slime may have escaped.' },
  { badge: '🫠', name: 'Slime Mopper', line: 'The loot is everywhere except the chest. Pack again.' },
]

const motion = (ms: number) => prefersReducedMotion() ? 0 : ms

/** Counts towards its target, so slime rises rather than jumps. */
function useEased(target: number, ms = 900) {
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

// The chest is drawn in oblique 3D: length goes right, height goes up, depth goes back up-right.
const VW = 320, VH = 220
const KX = 0.5, KY = 0.32

type Fill =
  /** Whole crates, filled layer by layer, back row first. `cap` is the slots this dial can fill. */
  | { kind: 'crates'; count: number; cap: number }
  /** A level in the chest: 1 is full to the lid, more spills over. */
  | { kind: 'level'; level: number }

/**
 * The chest: its inside walls with a faint grid, the crates or slime inside, then the front rim,
 * and the three measurements on the edges.
 */
function Chest({ box, fill, phase, labels, note }: {
  box: Box; fill: Fill; phase: Phase; labels: [string, string, string]; note?: string
}) {
  const { l: L, w: W, h: H, mode } = box
  const s = Math.min((VW - 104) / (L + W * KX), (VH - 52) / (H + W * KY))
  const ox = (VW - (L + W * KX) * s) / 2, oy = VH - 26 - (VH - 52 - (H + W * KY) * s) / 2
  const P = (x: number, y: number, z: number) => `${(ox + (x + y * KX) * s).toFixed(1)},${(oy - (z + y * KY) * s).toFixed(1)}`
  const poly = (...pts: string[]) => pts.join(' ')
  const unit = mode === 'crates' ? 1 : 10
  const lines = (n: number) => Array.from({ length: Math.max(0, Math.floor(n / unit - 1e-9)) }, (_, i) => (i + 1) * unit)

  const level = useEased(fill.kind === 'level' ? fill.level : 0)
  const z = Math.min(1, level) * H
  const spilling = fill.kind === 'level' && level > 1.001
  const over = fill.kind === 'crates' ? fill.count - fill.cap : 0
  const shown = fill.kind === 'crates' ? Math.max(0, Math.min(fill.count, fill.cap)) : 0
  const layer = L * W

  const label = `${mode === 'slime' ? 'Tank' : 'Chest'} ${labels[0]} long, ${labels[1]} wide, ${labels[2]} tall.${note ? ` ${note}` : ''}`
  return <figure className={`lp-chest is-${phase} is-${mode}`}>
    <svg viewBox={`0 0 ${VW} ${VH}`} role="img" aria-label={label}>
      {/* Inside walls: floor, back, left. */}
      <g className="lp-wall">
        <polygon points={poly(P(0, 0, 0), P(L, 0, 0), P(L, W, 0), P(0, W, 0))} />
        <polygon points={poly(P(0, W, 0), P(L, W, 0), P(L, W, H), P(0, W, H))} />
        <polygon points={poly(P(0, 0, 0), P(0, W, 0), P(0, W, H), P(0, 0, H))} />
      </g>
      <g className="lp-grid">
        {lines(L).map(x => <polyline key={`x${x}`} points={poly(P(x, 0, 0), P(x, W, 0), P(x, W, H))} />)}
        {lines(W).map(y => <polyline key={`y${y}`} points={poly(P(L, y, 0), P(0, y, 0), P(0, y, H))} />)}
        {lines(H).map(h => <polyline key={`z${h}`} points={poly(P(0, 0, h), P(0, W, h), P(L, W, h))} />)}
      </g>

      {fill.kind === 'crates' && Array.from({ length: shown }, (_, i) => {
        const cz = Math.floor(i / layer), r = i % layer, cy = W - 1 - Math.floor(r / L), cx = r % L
        // Live dial: a crate drops as it's added. On packing: the layers land one after another.
        const delay = phase === 'aim' ? 0 : Math.max(0, cz - 1) * 260 + (r % layer) * 6
        return <g key={i} className={`lp-crate${cz % 2 ? ' is-odd' : ''}`} style={{ animationDelay: `${delay}ms` }}>
          <polygon className="lp-crate__front" points={poly(P(cx, cy, cz), P(cx + 1, cy, cz), P(cx + 1, cy, cz + 1), P(cx, cy, cz + 1))} />
          <polygon className="lp-crate__top" points={poly(P(cx, cy, cz + 1), P(cx + 1, cy, cz + 1), P(cx + 1, cy + 1, cz + 1), P(cx, cy + 1, cz + 1))} />
          <polygon className="lp-crate__side" points={poly(P(cx + 1, cy, cz), P(cx + 1, cy + 1, cz), P(cx + 1, cy + 1, cz + 1), P(cx + 1, cy, cz + 1))} />
        </g>
      })}

      {fill.kind === 'level' && z > 0 && <g className="lp-stuff">
        <polygon className="lp-stuff__side" points={poly(P(L, 0, 0), P(L, W, 0), P(L, W, z), P(L, 0, z))} />
        <polygon className="lp-stuff__front" points={poly(P(0, 0, 0), P(L, 0, 0), P(L, 0, z), P(0, 0, z))} />
        <polygon className="lp-stuff__top" points={poly(P(0, 0, z), P(L, 0, z), P(L, W, z), P(0, W, z))} />
        {spilling && <path className="lp-stuff__spill" d={`M${P(L * 0.15, 0, H)} q 6 ${s * H * 0.25} 0 ${s * H * 0.45} a 5 5 0 0 0 10 0 q -6 ${-s * H * 0.2} 2 ${-s * H * 0.45} Z M${P(L * 0.6, 0, H)} q 4 ${s * H * 0.15} 0 ${s * H * 0.25} a 4 4 0 0 0 8 0 q -4 ${-s * H * 0.1} 0 ${-s * H * 0.25} Z`} />}
      </g>}

      {/* The front rim, over everything inside. */}
      <g className="lp-rim">
        <polygon points={poly(P(0, 0, 0), P(L, 0, 0), P(L, 0, H), P(0, 0, H))} />
        <polyline points={poly(P(L, 0, 0), P(L, W, 0), P(L, W, H), P(L, 0, H))} />
        <polyline points={poly(P(0, 0, H), P(0, W, H), P(L, W, H))} />
      </g>

      <g className="lp-label">
        <text x={ox + L * s / 2} y={oy + 17} textAnchor="middle">{labels[0]}</text>
        <text x={ox + (L + W * KX / 2) * s + 6} y={oy - W * KY * s / 2 + 12} textAnchor="start">{labels[1]}</text>
        <text x={ox - 7} y={oy - H * s / 2 + 4} textAnchor="end">{labels[2]}</text>
      </g>
      {(over > 0 || (spilling && phase !== 'aim')) && <text className="lp-over" x={VW / 2} y={14} textAnchor="middle">
        {over > 0 ? `+${over} won’t fit!` : 'Spilling over!'}
      </text>}
    </svg>
    {note && <p className="lp-readout" aria-live="polite">{note}</p>}
  </figure>
}

const sideLabels = (box: Box): [string, string, string] => box.mode === 'crates'
  ? [`${box.l} long`, `${box.w} deep`, `${box.h} tall`]
  : [`${box.l} cm`, `${box.w} cm`, `${box.h} cm`]

/** What the chest shows for a dial at this value. */
function fillFor(dial: Dial, value: number, phase: Phase): Fill {
  const { l, w, h } = dial.box
  if (dial.fills === 'layer') return { kind: 'crates', count: value, cap: l * w }
  if (dial.fills === 'total') return { kind: 'crates', count: phase === 'aim' ? l * w : value, cap: l * w * h }
  // cm³ and litres: nothing poured until they commit, so the eye can't do the maths for them.
  return { kind: 'level', level: phase === 'aim' ? 0 : value / dial.answer }
}

function noteFor(dial: Dial, value: number, phase: Phase) {
  if (phase === 'aim' || phase === 'pack') {
    if (dial.fills === 'layer') return `Bottom layer: ${value} crate${value === 1 ? '' : 's'}`
    if (dial.fills === 'total') return `${dial.box.h} layers to fill`
    return dial.fills === 'litres' ? 'Ready to pour' : 'Ready to pack'
  }
  if (phase === 'hit') return dial.fills === 'litres' ? `Brim full: ${num(value)} litres` : dial.fills === 'volume' ? `Full: ${cm3(value)}` : 'Perfect fit!'
  const full = dial.fills === 'layer' ? dial.box.l * dial.box.w : dial.answer
  return value < full ? 'Gaps! Not full.' : 'Too much! Lid won’t shut.'
}

function LootPackerGame({ rounds, onReplay }: { rounds: Round[]; onReplay: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [dialIndex, setDialIndex] = useState(0)
  const [onSide, setOnSide] = useState(false)
  const [value, setValue] = useState(rounds[0].dials[0].start)
  const [phase, setPhase] = useState<Phase>('aim')
  const [picked, setPicked] = useState<number | null>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied } = useShare()
  const { pace } = useStepPace()

  useEffect(() => {
    if (screen === 'done') recordRank('loot', rankFor(score.kept, rounds.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const round = rounds[roundIndex]
  const dial = round.dials[dialIndex]
  const side = round.side

  const aimAt = (index: number, at: number) => {
    setDialIndex(at); setValue(rounds[index].dials[at].start); setPhase('aim'); setMissed(false); setPicked(null)
  }
  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setOnSide(false); setRevealed(1); aimAt(index, 0)
  }

  const pack = () => {
    setPhase('pack')
    if (dial.box.mode === 'slime' && dial.fills === 'litres') sfx.bubble(); else sfx.stamp()
    const right = value === dial.answer
    const wait = dial.fills === 'total' ? 260 * dial.box.h + 300 : 950
    setTimeout(() => {
      if (right) { setPhase('hit'); score.hit(!missed); return }
      setPhase('miss'); setMissed(true)
      if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1100)
    }, motion(wait))
  }

  const pick = (choice: number) => {
    if (!side) return
    setPicked(choice)
    if (choice === side.answer) { score.hit(!missed); return }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1000)
  }

  const retry = () => {
    // Back to the dial, keeping what they set. A total dial redraws just the bottom layer.
    setPhase('aim')
  }

  const carryOn = () => {
    if (dialIndex + 1 < round.dials.length) { aimAt(roundIndex, dialIndex + 1); return }
    if (side && !onSide) { setOnSide(true); setMissed(false); setPicked(null); return }
    score.bank(); setScreen('payout'); sfx.win()
  }

  const nextLabel = dialIndex + 1 < round.dials.length ? 'Next' : side && !onSide ? 'Bonus question' : 'See the working'
  const verb = dial.fills === 'litres' ? 'Pour' : 'Pack it'

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, RANKS)
    const brag = `I packed a loot drop with l × w × h before the ship left. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Loot Packer complete</p>
        <RankCard rank={rank} stats={[['Rounds', `${rounds.length}/${rounds.length}`], ['Lives kept', `${score.kept}/${rounds.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Volume = length × width × height.', 'Floor first (l × w), then × the height.', 'cm³ ÷ 1,000 = litres.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Loot Packer', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onReplay}>Pack again</button>
        </div>
      </footer>
    </main>
  }

  const last = round.dials[round.dials.length - 1]
  const full: Fill = last.fills === 'layer' || last.fills === 'total'
    ? { kind: 'crates', count: last.box.l * last.box.w * last.box.h, cap: last.box.l * last.box.w * last.box.h }
    : { kind: 'level', level: 1 }
  const sideRight = picked !== null && side !== null && picked === side.answer
  const sideWrong = picked !== null && !sideRight
  const tone = phase === 'hit' ? 'right' : phase === 'miss' ? 'wrong' : 'default'
  const mood = (offset: number) => roundIndex * 3 + dialIndex + offset

  return <main className="lab">
    <LabTop progress={`Round ${roundIndex + 1}/${rounds.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <section className="lab-intro">
        <p className="lab-kicker">{round.title}</p>
        <h1 className="lab-title">{round.headline}</h1>
        <div className="lab-card rv-paper">
          <Chest box={dial.box} fill={fillFor(dial, dial.start, 'aim')} phase="aim" labels={sideLabels(dial.box)} />
        </div>
        <Quip speaker={DEX}>{INTROS[roundIndex]}</Quip>
        <Why>{round.why}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { sfx.tick(); setScreen('question') }}>Open the chest</button>
      </footer>
    </>}

    {screen === 'question' && !onSide && <>
      <section className="lab-card rv-paper">
        <Chest box={dial.box} fill={fillFor(dial, value, phase)} phase={phase} labels={sideLabels(dial.box)} note={noteFor(dial, value, phase)} />
      </section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{DEX.emoji}</span> {DEX.name} · set it, then {verb.toLowerCase()}</p>
        <h1 className="lab-prompt">{dial.prompt}</h1>
        <NumberDial
          key={dial.id}
          label={dial.label}
          value={value}
          onChange={setValue}
          min={dial.min} max={dial.max} step={dial.step} jump={dial.jump}
          format={formatFor(dial.fills)}
          target={dial.answer}
          disabled={phase !== 'aim'}
          tone={tone}
        />
        {phase === 'hit' && <Combo streak={score.streak} />}
      </section>
      {(phase === 'aim' || phase === 'pack') && <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={phase === 'pack'} onClick={pack}>{verb}</button>
      </footer>}
      {phase === 'hit' && <>
        <Burst key={dial.id} emoji={dial.box.mode === 'slime' ? '🟢' : dial.box.mode === 'loot' ? '🪙' : '📦'} />
        <CheckBar status="correct" title={`${DEX.emoji} “${say(DEX.right, mood(0))}”`} message={dial.win}>
          <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{nextLabel}</button>
        </CheckBar>
      </>}
      {phase === 'miss' && score.lives > 0 && <CheckBar status="incorrect" title={`${DEX.emoji} “${say(DEX.wrong, mood(3 - score.lives))}”`} message={dial.nope(value)}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={retry}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'question' && onSide && side && <>
      <section className="lab-card rv-paper">
        <Chest box={side.box} fill={{ kind: 'level', level: sideRight ? 1 : side.box.mode === 'slime' ? 1 : 0 }} phase={sideRight ? 'hit' : 'aim'} labels={side.labels} note={side.box.mode === 'slime' ? '1 litre' : undefined} />
      </section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{DEX.emoji}</span> {DEX.name} asks · bonus crate</p>
        <h1 className="lab-prompt">{side.prompt}</h1>
        <Choices
          choices={side.choices}
          picked={picked}
          answer={side.answer}
          onPick={choice => pick(choice as number)}
          columns={side.choices.some(choice => choice.label.length > 7) ? 1 : side.choices.length}
        />
        {sideRight && <Combo streak={score.streak} />}
      </section>
      {sideRight && <CheckBar status="correct" title={`${DEX.emoji} “${say(DEX.right, mood(1))}”`} message={side.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>See the working</button>
      </CheckBar>}
      {sideWrong && score.lives > 0 && <CheckBar status="incorrect" title={`${DEX.emoji} “${say(DEX.wrong, mood(3 - score.lives))}”`} message={side.choices.find(choice => choice.value === picked)?.nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🚀</span>
        <p className="lab-kicker">Missed the drop</p>
        <h1 className="lab-title">Three misses. The drop ship left without the loot.</h1>
        <Why tag="Tip">Floor first: length × width. Then × the height. For litres, ÷ 1,000 (not 100).</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Call another ship</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <section className="lab-card rv-paper"><Chest box={last.box} fill={full} phase="hit" labels={sideLabels(last.box)} /></section>
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
export default function LootPacker() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <LootPackerGame key={play} rounds={data} onReplay={regenerate} /> : null
}

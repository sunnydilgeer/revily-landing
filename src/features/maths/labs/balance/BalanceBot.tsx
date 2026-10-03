'use client'

import { useEffect, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker , livesPerRound } from '../kit/Lab'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { makePuzzles, sideText, type Scale as ScaleState, type Side, type Puzzle } from './puzzles'
import './BalanceBot.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'

const BOT: Speaker = {
  name: 'B-4L', emoji: '🤖',
  right: ['EQUILIBRIUM ACHIEVED.', 'BEEP BOOP. CORRECT.', 'My circuits are pleased.', 'Balance: 100%. You: legend.', 'Calculating… respect.'],
  wrong: ['WARNING: TILT DETECTED.', 'ERROR: SIDES NOT EQUAL. 🤖💥', 'That made me dizzy.', 'Recalculating… nope.'],
}
const INTROS = [
  'Hello, human. I am B-4L. My one job is balance. Please do not tip me over.',
  'Two mystery boxes. My sensors say they weigh the same. Find out what.',
  'Boxes on BOTH sides. This is my favourite. Also my scariest.',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🧠', name: 'Equation Engineer', line: 'Perfect balance every time. B-4L wants to be you.' },
  { badge: '⚖️', name: 'Balance Boss', line: 'A wobble or two, but every box got cracked.' },
  { badge: '🔧', name: 'Apprentice Mechanic', line: 'You got there. B-4L is still a bit dizzy.' },
  { badge: '🤕', name: 'Robot Tipper', line: 'B-4L needs a lie down. Run it again.' },
]

const none: ScaleState = { left: { x: 0, u: 0 }, right: { x: 0, u: 0 } }
const less = (a: Side, b: Side): Side => ({ x: Math.max(0, a.x - b.x), u: Math.max(0, a.u - b.u) })

function Pan({ side, leaving, reveal, unit }: { side: Side; leaving: Side; reveal: number | null; unit: number }) {
  return <div className="bb-pan__items">
    {Array.from({ length: side.x }, (_, i) => <span key={`x${i}`} className={`bb-box${i >= side.x - leaving.x ? ' is-leaving' : ''}${reveal !== null ? ' is-open' : ''}`}>{reveal ?? 'x'}</span>)}
    {Array.from({ length: side.u }, (_, i) => <span key={`u${i}`} className={`bb-weight${i >= side.u - leaving.u ? ' is-leaving' : ''}`}>{unit}</span>)}
  </div>
}

/** The see-saw. It tips when the two sides stop being equal, and the pans stay level as it swings. */
function Balance({ scale, leaving, tilt, reveal, unit }: { scale: ScaleState; leaving: ScaleState; tilt: number; reveal: number | null; unit: number }) {
  return <figure className="bb-scale" style={{ ['--tilt' as string]: `${tilt}deg` }} aria-label={`Scale: ${sideText(scale.left, unit)} on the left, ${sideText(scale.right, unit)} on the right`}>
    <div className="bb-beam" />
    <div className="bb-pan bb-pan--left"><Pan side={scale.left} leaving={leaving.left} reveal={reveal} unit={unit} /></div>
    <div className="bb-pan bb-pan--right"><Pan side={scale.right} leaving={leaving.right} reveal={reveal} unit={unit} /></div>
    <div className="bb-post" />
  </figure>
}

function BalanceBotGame({ puzzles, onReplay }: { puzzles: Puzzle[]; onReplay: () => void }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [moveIndex, setMoveIndex] = useState(0)
  const [scale, setScale] = useState<ScaleState>(() => puzzles[0].start)
  const [leaving, setLeaving] = useState<ScaleState>(none)
  const [tilt, setTilt] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied, reset: resetShare } = useShare()
  const { pace } = useStepPace()

  const puzzle = puzzles[puzzleIndex]
  const move = puzzle.moves[moveIndex]
  const right = picked !== null && picked === move.answer
  const wrong = picked !== null && !right
  const nope = move.choices.find(choice => choice.value === picked)?.nope
  const solved = screen === 'payout' || (right && moveIndex === puzzle.moves.length - 1)

  useEffect(() => {
    if (screen === 'done') recordRank('balance', rankFor(score.kept, puzzles.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const startPuzzle = (index: number) => {
    setPuzzleIndex(index); setScreen('intro'); setMoveIndex(0); setScale(puzzles[index].start); setLeaving(none)
    setTilt(0); setPicked(null); setMissed(false); setRevealed(1)
  }

  const pick = (value: string) => {
    setPicked(value)
    if (value === move.answer) {
      score.hit(!missed)
      // The same thing comes off both sides: fade it out, then settle on the new scale.
      setLeaving({ left: less(scale.left, move.after.left), right: less(scale.right, move.after.right) })
      setTimeout(() => { setScale(move.after); setLeaving(none) }, prefersReducedMotion() ? 0 : 650)
      return
    }
    setMissed(true)
    setTilt(value.startsWith('add') || value.startsWith('mul') ? -14 : 14)
    setTimeout(() => setTilt(0), 1100)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1000)
  }

  const carryOn = () => {
    setPicked(null); setMissed(false)
    if (moveIndex + 1 < puzzle.moves.length) setMoveIndex(moveIndex + 1)
    else { score.bank(); setScreen('payout'); sfx.win() }
  }

  const restart = onReplay

  if (screen === 'done') {
    const rank = rankFor(score.kept, puzzles.length, RANKS)
    const brag = `I solved ${puzzles.length} equations without tipping the robot over. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Balance Bot complete</p>
        <RankCard rank={rank} stats={[['Equations', `${puzzles.length}/${puzzles.length}`], ['Lives kept', `${score.kept}/${puzzles.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Do the same to both sides, always.', 'Clear the loose numbers with + or −.', 'Then ÷ by the number of x’s.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Balance Bot', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Balance again</button>
        </div>
      </footer>
    </main>
  }

  const equation = `${sideText(scale.left, puzzle.unit)} = ${sideText(scale.right, puzzle.unit)}`

  return <main className="lab">
    <LabTop progress={`Level ${puzzleIndex + 1}/${puzzles.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <section className="lab-intro">
        <p className="lab-kicker">{puzzle.title}</p>
        <h1 className="lab-title">What’s in the box? <span className="bb-eq">{puzzle.equation}</span></h1>
        <div className="lab-card rv-paper"><Balance unit={puzzle.unit} scale={puzzle.start} leaving={none} tilt={0} reveal={null} /></div>
        <Quip speaker={BOT}>{INTROS[puzzleIndex]}</Quip>
        <Why>{puzzle.why}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { sfx.tick(); setScreen('question') }}>Balance it</button>
      </footer>
    </>}

    {screen === 'question' && <>
      <section className="lab-card rv-paper bb-stage">
        <Balance unit={puzzle.unit} scale={scale} leaving={leaving} tilt={tilt} reveal={solved && !leaving.left.x && !leaving.right.u ? puzzle.solution : null} />
        <p className="bb-equation" aria-live="polite">{equation}</p>
      </section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{BOT.emoji}</span> {BOT.name} asks · do it to both sides</p>
        <h1 className="lab-prompt">{move.prompt}</h1>
        <Choices choices={move.choices} picked={picked} answer={move.answer} onPick={value => pick(value as string)} />
        {right && <Combo streak={score.streak} />}
      </section>
      {right && <CheckBar status="correct" title={`${BOT.emoji} “${say(BOT.right, puzzleIndex * 3 + moveIndex)}”`} message={move.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{moveIndex + 1 < puzzle.moves.length ? 'Next move' : 'Open the box'}</button>
      </CheckBar>}
      {wrong && score.lives > 0 && <CheckBar status="incorrect" title={`${BOT.emoji} “${say(BOT.wrong, puzzleIndex + moveIndex + (3 - score.lives))}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🤖</span>
        <p className="lab-kicker">System crash</p>
        <h1 className="lab-title">B-4L tipped over. Reboot and try again.</h1>
        <Why tag="Tip">Whatever you do to one side, do to the other. Clear the loose numbers first, then share by the number of x’s.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startPuzzle(puzzleIndex) }}>Reboot</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <Burst key={puzzle.id} emoji="⚖️" />
      <section className="lab-card rv-paper bb-stage bb-stage--solved">
        <Balance unit={puzzle.unit} scale={scale} leaving={none} tilt={0} reveal={puzzle.solution} />
        <p className="bb-equation">x = {puzzle.solution}</p>
      </section>
      <section className="lab-card lab-card--working rv-paper">
        <h2 className="lab-working__title">The working</h2>
        <StepChain key={puzzle.id} steps={puzzle.chain} revealed={revealed} pace={pace} />
      </section>
      <footer className="lab-bar">
        <StepDots total={puzzle.chain.length - 1} current={revealed - 1} onSelect={step => setRevealed(step + 1)} />
        <div className="lab-bar__actions">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-icon-btn" aria-label="Previous step" disabled={revealed === 1} onClick={() => setRevealed(revealed - 1)}>←</button>
          {revealed < puzzle.chain.length
            ? <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => setRevealed(revealed + 1)}>{revealed === 1 ? 'Show the working' : 'Next step'}</button>
            : <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => puzzleIndex + 1 < puzzles.length ? startPuzzle(puzzleIndex + 1) : setScreen('done')}>
              {puzzleIndex + 1 < puzzles.length ? 'Next level' : 'Finish'}
            </button>}
        </div>
      </footer>
    </>}
  </main>
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function BalanceBot() {
  const { data, play, regenerate } = useGenerated(makePuzzles)
  return data ? <BalanceBotGame key={play} puzzles={data} onReplay={regenerate} /> : null
}

'use client'

import { useEffect, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { prefersReducedMotion } from '../../step-chain/flip'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker } from '../kit/Lab'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { makeGame, num, type Game } from './levels'
import './LevelUp.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'

const PIXEL: Speaker = {
  name: 'Pixel', emoji: '🎮',
  right: ['LEVEL UP! +100 XP', 'CRITICAL HIT!', 'ACHIEVEMENT UNLOCKED.', 'NEW HIGH SCORE!', 'Pixel bows. 8-bit respect.'],
  wrong: ['GAME OVER… just kidding. Insert coin.', 'You took 1 damage. Pixel felt that.', 'MISS! The sequence dodged.', 'Glitch detected. Respawning…'],
}
const INTROS = [
  'A WILD SEQUENCE APPEARS! Every level costs XP. Spot the pattern before it spots you.',
  'Grinding to the far levels takes ages. Speedrunners use a cheat code. Pixel has it.',
  'Final boss: a number with no level on it. Is it real, or a glitch in the matrix?',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '👑', name: 'Max Level', line: 'Flawless run. Pixel is adding you to the high score table.' },
  { badge: '⚔️', name: 'Boss Slayer', line: 'Took a hit or two, but every pattern got cracked.' },
  { badge: '🛡️', name: 'Side Quester', line: 'You got there. A bit more grinding and you’re unstoppable.' },
  { badge: '🐌', name: 'Stuck on Level 1', line: 'Pixel believes in you. Insert coin and go again.' },
]

type Row =
  | { kind: 'level'; label: string; xp: number; state: 'known' | 'hidden' | 'up' | 'target' | 'miss'; jump?: number }
  | { kind: 'gap' }

/** What the XP ladder shows: grows as each question in the round is answered. */
function rowsFor(game: Game, round: number, solved: number): { rows: Row[]; caption: string } {
  const { d, c, terms, far, farXp, target, hit, level } = game
  const first = (count: number, jumps: boolean): Row[] => terms.slice(0, count).map((xp, i) => ({ kind: 'level', label: `LV ${i + 1}`, xp, state: 'known', jump: jumps && i ? d : undefined }))
  if (round === 0) return {
    rows: [...first(4, solved >= 1), { kind: 'level', label: 'LV 5', xp: terms[4], state: solved >= 2 ? 'up' : 'hidden', jump: solved >= 1 ? d : undefined }],
    caption: solved >= 1 ? `+${d} every level` : terms.slice(0, 4).map(num).join(', ') + ', ?',
  }
  if (round === 1) return {
    rows: [...first(4, true), { kind: 'gap' }, { kind: 'level', label: `LV ${far}`, xp: farXp, state: solved >= 2 ? 'up' : 'hidden' }],
    caption: `XP = ${solved >= 1 ? `${d}n + ${c}` : '?'}`,
  }
  const low = d * level + c
  const after: Row[] = hit
    ? [{ kind: 'level', label: `LV ${level}`, xp: target, state: 'up' }]
    : [{ kind: 'level', label: `LV ${level}`, xp: low, state: 'up' }, { kind: 'level', label: '✗', xp: target, state: 'miss' }, { kind: 'level', label: `LV ${level + 1}`, xp: low + d, state: 'known' }]
  return {
    rows: [...first(3, false), { kind: 'gap' }, ...(solved >= 2 ? after : [{ kind: 'level', label: 'LV ?', xp: target, state: 'target' } as Row])],
    caption: solved >= 1 ? `${num(target)} XP: ${hit ? 'IN THE SEQUENCE' : 'SKIPPED'}` : `${num(target)} XP = a level?`,
  }
}

/** The XP ladder: one row per level, the bar as long as its XP, unknown levels shown as ?. */
function Ladder({ game, round, solved }: { game: Game; round: number; solved: number }) {
  const { rows, caption } = rowsFor(game, round, solved)
  const max = Math.max(...rows.map(row => row.kind === 'level' ? row.xp : 0))
  // Start the bars empty for a frame so the fill animates in; reduced motion fills straight away.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (prefersReducedMotion()) { setReady(true); return }
    const frame = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(frame)
  }, [])
  return <figure className="lu-ladder" aria-label={`XP per level. ${caption}`}>
    <ol className="lu-rows">
      {rows.map((row, i) => row.kind === 'gap'
        ? <li key={`gap${i}`} className="lu-gap" aria-hidden="true">⋯</li>
        : <li key={row.label} className={`lu-row is-${row.state}`}>
          <span className="lu-row__level">{row.label}</span>
          <span className="lu-row__track">
            <span className="lu-row__fill" style={{ width: row.state === 'hidden' || !ready ? 0 : `${Math.max(3, (row.xp / max) * 100)}%` }} />
            {row.jump !== undefined && <span className="lu-row__jump">+{row.jump}</span>}
            {row.state === 'up' && <span className="lu-pop" aria-hidden="true">LEVEL UP!</span>}
          </span>
          <span className="lu-row__xp">{row.state === 'hidden' ? '?' : num(row.xp)}</span>
        </li>)}
    </ol>
    <figcaption className="lu-caption" aria-live="polite">{caption}</figcaption>
  </figure>
}

export default function LevelUp() {
  const { data: game, regenerate } = useGenerated(makeGame)
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [picked, setPicked] = useState<string | number | null>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied, reset: resetShare } = useShare()
  const { pace } = useStepPace()

  useEffect(() => {
    if (screen === 'done' && game) recordRank('levels', rankFor(score.kept, game.rounds.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!game) return <main className="lab" />

  const rounds = game.rounds
  const round = rounds[roundIndex]
  const question = round.questions[questionIndex]
  const right = picked !== null && picked === question.answer
  const wrong = picked !== null && !right
  const nope = question.choices.find(choice => choice.value === picked)?.nope
  // How many of this round's questions are answered: the ladder fills in as they go.
  const solved = screen === 'payout' ? round.questions.length : questionIndex + (right ? 1 : 0)

  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setQuestionIndex(0); setPicked(null); setMissed(false); setRevealed(1)
  }

  const pick = (value: string | number) => {
    setPicked(value)
    if (value === question.answer) { score.hit(!missed); return }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1000)
  }

  const carryOn = () => {
    setPicked(null); setMissed(false)
    if (questionIndex + 1 < round.questions.length) setQuestionIndex(questionIndex + 1)
    else { score.bank(); setScreen('payout'); sfx.win() }
  }

  const restart = () => { score.reset(); resetShare(); regenerate(); startRound(0) }

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, RANKS)
    const brag = `I cracked the XP code and predicted level ${game.far} before getting there. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Level Up complete</p>
        <RankCard rank={rank} stats={[['Rounds', `${rounds.length}/${rounds.length}`], ['Lives kept', `${score.kept}/${rounds.length * 3}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Find the difference: that’s the n’s times table.', 'nth term = difference × n + (first term − difference).', 'Use it to jump straight to any level.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Level Up', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Level up again</button>
        </div>
      </footer>
    </main>
  }

  return <main className="lab">
    <LabTop progress={`Round ${roundIndex + 1}/${rounds.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <section className="lab-intro">
        <p className="lab-kicker">{round.title}</p>
        <h1 className="lab-title">{round.heading}</h1>
        <div className="lab-card rv-paper lu-stage"><Ladder key={`intro${roundIndex}`} game={game} round={roundIndex} solved={0} /></div>
        <Quip speaker={PIXEL}>{INTROS[roundIndex]}</Quip>
        <Why>{round.why}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { sfx.tick(); setScreen('question') }}>Press start</button>
      </footer>
    </>}

    {screen === 'question' && <>
      <section className={`lab-card rv-paper lu-stage${wrong ? ' is-hit' : ''}`}>
        <Ladder key={`q${roundIndex}`} game={game} round={roundIndex} solved={solved} />
      </section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{PIXEL.emoji}</span> {PIXEL.name} asks · {question.asker}</p>
        <h1 className="lab-prompt">{question.prompt}</h1>
        <Choices choices={question.choices} picked={picked} answer={question.answer} onPick={pick} />
        {right && <Combo streak={score.streak} />}
      </section>
      {right && <CheckBar status="correct" title={`${PIXEL.emoji} “${say(PIXEL.right, roundIndex * 2 + questionIndex)}”`} message={question.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{questionIndex + 1 < round.questions.length ? 'Next quest' : 'See the working'}</button>
      </CheckBar>}
      {wrong && score.lives > 0 && <CheckBar status="incorrect" title={`${PIXEL.emoji} “${say(PIXEL.wrong, roundIndex + questionIndex + (3 - score.lives))}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">👾</span>
        <p className="lab-kicker">Game over</p>
        <h1 className="lab-title">Out of lives. Insert coin to continue.</h1>
        <Why tag="Tip">Find the jump between levels first. That’s the number in front of n. Then fix it so level 1 comes out right.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Insert coin</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <Burst key={round.id} emoji="⭐" />
      <section className="lab-card rv-paper lu-stage">
        <Ladder key={`p${roundIndex}`} game={game} round={roundIndex} solved={round.questions.length} />
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
              {roundIndex + 1 < rounds.length ? 'Next round' : 'Finish'}
            </button>}
        </div>
      </footer>
    </>}
  </main>
}

'use client'

import { useEffect, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker, livesPerRound, IntroSplit } from '../kit/Lab'
import { NumberDial } from '../kit/NumberDial'
import { isTestMode, useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { DIAL_STEP, makeRounds, type NodeId, type Round, type TreeNode } from './rounds'
import './ObbySplit.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'
/** set: dial live · right / wrong: the result of the box they locked in */
type Phase = 'set' | 'right' | 'wrong'

const BLOX: Speaker = {
  name: 'Blox', emoji: '🧱',
  right: ['YES! The counter matches! I’m literally vibrating.', 'Perfect split. My course, my maths, my joy.', 'Nailed it! Nobody gets lost on my tree.', 'Chef’s kiss. Do it again. Please. I’m begging.', 'Every player accounted for. Beautiful.'],
  wrong: ['Hang on, players just… vanished? That’s not how my course works.', 'The numbers don’t add up and it’s hurting me.', 'Close-ish. My spreadsheet is crying though.', 'Nope! The boxes have to add up. Always.'],
}
const INTROS = [
  'MY NEW COURSE IS LIVE! Players are flooding in. I need the tree filled so I know who went where. Tap a box, set the number.',
  'Disaster. My counter only logged the finish line. Work backwards up the tree and tell me how many took each path.',
  'Last course! Fill the tree, count every clear, then tell me the odds a random player made it through one path.',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🏆', name: 'Obby Overlord', line: 'Every box first try. Blox wants you on the dev team.' },
  { badge: '🧱', name: 'Master Builder', line: 'A wobble or two, but every player found their branch.' },
  { badge: '🪜', name: 'Checkpoint Rookie', line: 'You got there. A few players fell through the map.' },
  { badge: '🕳️', name: 'Fell Through the Map', line: 'The tree’s a mess. Respawn and try again.' },
]

type Layout = { x: number; y: number; w: number; h: number }
const W = 320
const BOX: Record<NodeId, Layout> = {
  start: { x: 160, y: 30, w: 96, h: 46 },
  a: { x: 80, y: 112, w: 96, h: 46 },
  b: { x: 240, y: 112, w: 96, h: 46 },
  ac: { x: 40, y: 200, w: 72, h: 46 },
  af: { x: 120, y: 200, w: 72, h: 46 },
  bc: { x: 200, y: 200, w: 72, h: 46 },
  bf: { x: 280, y: 200, w: 72, h: 46 },
  total: { x: 120, y: 286, w: 108, h: 46 },
}
const EDGES: [NodeId, NodeId][] = [['start', 'a'], ['start', 'b'], ['a', 'ac'], ['a', 'af'], ['b', 'bc'], ['b', 'bf']]
const TREE: Exclude<NodeId, 'total'>[] = ['start', 'a', 'b', 'ac', 'af', 'bc', 'bf']

/**
 * The frequency tree, top to bottom so it fits a phone. Players stream down every branch whose
 * number is known, thicker for more players. Empty boxes are buttons: tap one to set it with the dial.
 */
function Tree({ round, known, values, selected, phase, onSelect, highlight }: {
  round: Round
  /** Boxes whose number is showing: given or already filled. */
  known: Set<NodeId>
  /** The dial value of each box being set. */
  values: Partial<Record<NodeId, number>>
  selected: NodeId | null
  phase: Phase
  onSelect?: (id: NodeId) => void
  /** An end lit up by the side question. */
  highlight?: { id: NodeId; right: boolean } | null
}) {
  const hasTotal = Boolean(round.nodes.total)
  const H = hasTotal ? 318 : 232
  const test = isTestMode()
  const nodes = [...TREE.map(id => round.nodes[id]), ...(hasTotal ? [round.nodes.total!] : [])]
  const edges: [NodeId, NodeId][] = hasTotal ? [...EDGES, ['ac', 'total'], ['bc', 'total']] : EDGES
  const width = (count: number) => 2 + 7 * count / round.start
  const description = nodes.map(node => `${node.label}: ${known.has(node.id) ? node.value : 'empty'}`).join(', ')
  return <figure className="ob-tree" style={{ aspectRatio: `${W} / ${H}` }}>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Frequency tree. ${description}.`}>
      {edges.map(([from, to]) => {
        const p = BOX[from], c = BOX[to], live = known.has(to)
        const d = `M${p.x} ${p.y + p.h / 2} L${c.x} ${c.y - c.h / 2}`
        const count = round.nodes[to]!.value
        return <g key={`${from}-${to}`} className={`ob-edge${live ? ' is-live' : ''}${to === 'total' ? ' is-sum' : ''}`}>
          <path className="ob-edge__track" d={d} style={{ strokeWidth: live ? width(count) + 4 : 3 }} />
          {live && <path className="ob-edge__players" d={d} style={{ strokeWidth: width(count) }} />}
        </g>
      })}
      {Object.entries(round.edges).map(([id, text]) => {
        const c = BOX[id as NodeId], p = BOX[id === 'ac' || id === 'af' ? 'a' : id === 'bc' || id === 'bf' ? 'b' : 'start']
        const mx = (p.x + c.x) / 2, my = (p.y + p.h / 2 + c.y - c.h / 2) / 2
        return <g key={id} className="ob-edge__tag" transform={`translate(${mx} ${my})`}>
          <rect x={-18} y={-10} width={36} height={20} rx={10} />
          <text textAnchor="middle" y={4.5}>{text}</text>
        </g>
      })}
    </svg>
    {nodes.map(node => {
      const box = BOX[node.id]
      const style = { left: `${(box.x - box.w / 2) / W * 100}%`, top: `${(box.y - box.h / 2) / H * 100}%`, width: `${box.w / W * 100}%`, height: `${box.h / H * 100}%` }
      const shown = known.has(node.id)
      const lit = highlight?.id === node.id ? (highlight.right ? ' is-picked-right' : ' is-picked-wrong') : ''
      const kind = node.given ? ' is-given' : shown ? ' is-filled' : ''
      if (shown) {
        return <div key={node.id} className={`ob-box${kind}${lit}${node.id === 'total' ? ' is-total' : ''}`} style={style} aria-hidden="true">
          <span className="ob-box__tag">{node.tag}</span>
          <span className="ob-box__num">{node.value}</span>
        </div>
      }
      const isSelected = selected === node.id
      const draft = values[node.id]
      const state = isSelected ? (phase === 'wrong' ? ' is-wrong' : ' is-selected') : ''
      return <button
        key={node.id}
        type="button"
        className={`ob-box is-empty${state}${node.id === 'total' ? ' is-total' : ''}`}
        style={style}
        aria-label={`Fill ${node.label}`}
        aria-pressed={isSelected}
        disabled={!onSelect || phase !== 'set'}
        data-box={node.id}
        data-target={test ? node.value : undefined}
        onClick={() => onSelect?.(node.id)}
      >
        <span className="ob-box__tag">{node.tag}</span>
        <span className="ob-box__num">{isSelected && draft !== undefined && draft > 0 ? draft : '?'}</span>
      </button>
    })}
  </figure>
}

function ObbySplitGame({ rounds, onReplay }: { rounds: Round[]; onReplay: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  const [filled, setFilled] = useState<NodeId[]>([])
  const [selected, setSelected] = useState<NodeId | null>(rounds[0].order[0])
  const [values, setValues] = useState<Partial<Record<NodeId, number>>>({})
  const [phase, setPhase] = useState<Phase>('set')
  const [missed, setMissed] = useState(false)
  const [nope, setNope] = useState('')
  const [onSide, setOnSide] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(1)
  const [checks, setChecks] = useState(0)
  const score = useScore()
  const { share, copied } = useShare()
  const { pace } = useStepPace()

  useEffect(() => {
    if (screen === 'done') recordRank('obby', rankFor(score.kept, rounds.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const round = rounds[roundIndex]
  const side = round.side
  const all = [...TREE, ...(round.nodes.total ? ['total' as const] : [])]
  const known = new Set<NodeId>(all.filter(id => round.nodes[id]!.given || filled.includes(id)))
  const node: TreeNode | null = selected ? round.nodes[selected]! : null
  const value = selected ? values[selected] ?? 0 : 0
  const left = round.order.filter(id => !filled.includes(id))
  const complete = new Set<NodeId>(all)

  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setFilled([]); setSelected(rounds[index].order[0]); setValues({})
    setPhase('set'); setMissed(false); setOnSide(false); setPicked(null); setRevealed(1)
  }

  const choose = (id: NodeId) => {
    if (phase !== 'set') return
    sfx.tick(); setSelected(id)
  }

  const lockIn = () => {
    if (!node) return
    setChecks(checks + 1)
    if (value === node.value) {
      setPhase('right'); setFilled([...filled, node.id]); sfx.whoosh(); score.hit(!missed)
      return
    }
    setPhase('wrong'); setMissed(true); setNope(node.nope ? node.nope(value) : '')
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1100)
  }

  const carryOn = () => {
    const next = left[0]
    setPhase('set'); setMissed(false)
    if (next) { setSelected(next); return }
    setSelected(null)
    if (side && !onSide) { setOnSide(true); setPicked(null); return }
    score.bank(); setScreen('payout'); sfx.win()
  }

  const pick = (choice: string) => {
    if (!side) return
    setPicked(choice)
    if (choice === side.answer) { score.hit(!missed); return }
    setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1000)
  }

  const nextLabel = left.length ? 'Next box' : side && !onSide ? 'Bonus question' : 'See the working'
  const mood = (offset: number) => roundIndex * 4 + checks + offset
  const sideEnd: NodeId | null = side ? (round.nodes.ac.value === Number(side.answer.split('/')[0]) ? 'ac' : 'bc') : null
  const max = round.start
  const jump = max >= 200 ? 50 : 20

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, RANKS)
    const brag = `I tracked every player through Blox’s obby with frequency trees. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Obby Split complete</p>
        <RankCard rank={rank} stats={[['Rounds', `${rounds.length}/${rounds.length}`], ['Lives kept', `${score.kept}/${rounds.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['The two boxes under any box add up to it.', 'A fraction on a branch is of the box above it.', 'Probability = that end ÷ the total at the start.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Obby Split', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onReplay}>Build again</button>
        </div>
      </footer>
    </main>
  }

  const sideRight = picked !== null && side !== null && picked === side.answer
  const sideWrong = picked !== null && !sideRight

  return <main className="lab">
    <LabTop progress={`Round ${roundIndex + 1}/${rounds.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <IntroSplit
        key={roundIndex}
        kicker={round.title}
        title={round.headline}
        scene={<div className="lab-card rv-paper"><Tree round={round} known={known} values={{}} selected={null} phase="set" /></div>}
        speaker={BLOX} line={INTROS[roundIndex]}
        why={round.why}
        start="Open the course"
        onStart={() => { sfx.tick(); setScreen('question') }}
      />
    </>}

    {screen === 'question' && !onSide && <>
      <section className="lab-card rv-paper">
        <Tree round={round} known={known} values={values} selected={phase === 'right' ? null : selected} phase={phase} onSelect={choose} />
      </section>
      <section className="lab-ask">
        <ul className="ob-clues" aria-label="What Blox knows">{round.clues.map(clue => <li key={clue}>{clue}</li>)}</ul>
        {node && phase !== 'right' && <>
          <p className="lab-asker"><span aria-hidden="true">{BLOX.emoji}</span> {BLOX.name} · {left.length} box{left.length === 1 ? '' : 'es'} to fill · tap any “?”</p>
          <h1 className="lab-prompt">{node.ask}</h1>
          <NumberDial
            label={node.label}
            value={value}
            onChange={next => setValues({ ...values, [node.id]: next })}
            min={0} max={max} step={DIAL_STEP} jump={jump}
            target={node.value}
            disabled={phase !== 'set'}
            tone={phase === 'wrong' ? 'wrong' : 'default'}
          />
        </>}
        {phase === 'right' && <Combo streak={score.streak} />}
      </section>
      {phase === 'set' && node && <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={value === 0} onClick={lockIn}>Lock it in</button>
      </footer>}
      {phase === 'right' && filled.length > 0 && <>
        <Burst key={filled.length} emoji="🏃" />
        <CheckBar status="correct" title={`${BLOX.emoji} “${say(BLOX.right, mood(0))}”`} message={round.nodes[filled[filled.length - 1]]!.win}>
          <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{nextLabel}</button>
        </CheckBar>
      </>}
      {phase === 'wrong' && score.lives > 0 && <CheckBar status="incorrect" title={`${BLOX.emoji} “${say(BLOX.wrong, mood(3 - score.lives))}”`} message={nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPhase('set')}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'question' && onSide && side && <>
      <section className="lab-card rv-paper">
        <Tree round={round} known={complete} values={{}} selected={null} phase="set" highlight={sideRight && sideEnd ? { id: sideEnd, right: true } : null} />
      </section>
      <section className="lab-ask ob-side">
        <p className="lab-asker"><span aria-hidden="true">{BLOX.emoji}</span> {BLOX.name} asks · bonus</p>
        <h1 className="lab-prompt">{side.prompt}</h1>
        <Choices choices={side.choices} picked={picked} answer={side.answer} onPick={choice => pick(choice as string)} columns={2} />
        {sideRight && <Combo streak={score.streak} />}
      </section>
      {sideRight && <CheckBar status="correct" title={`${BLOX.emoji} “${say(BLOX.right, mood(1))}”`} message={side.why}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>See the working</button>
      </CheckBar>}
      {sideWrong && score.lives > 0 && <CheckBar status="incorrect" title={`${BLOX.emoji} “${say(BLOX.wrong, mood(3 - score.lives))}”`} message={side.choices.find(choice => choice.value === picked)?.nope}>
        <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={() => setPicked(null)}>Try again</button>
      </CheckBar>}
    </>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🕳️</span>
        <p className="lab-kicker">Fell through the map</p>
        <h1 className="lab-title">Three wrong boxes. The players are lost in the void.</h1>
        <Why tag="Tip">The two boxes under any box add up to it. A fraction on a branch is a fraction of the box it comes from, not of everyone.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Respawn</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <section className="lab-card rv-paper"><Tree round={round} known={complete} values={{}} selected={null} phase="set" /></section>
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
export default function ObbySplit() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <ObbySplitGame key={play} rounds={data} onReplay={regenerate} /> : null
}

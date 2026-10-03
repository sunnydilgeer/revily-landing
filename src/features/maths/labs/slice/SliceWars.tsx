'use client'

import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain, StepDots, useStepPace } from '../../step-chain/StepChain'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, recordRank, say, useScore, useShare, type Speaker, livesPerRound, IntroSplit, whySteps } from '../kit/Lab'
import { NumberDial } from '../kit/NumberDial'
import { useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { isRight, makeRounds, type Move, type Round, type Side, type Topping } from './rounds'
import './SliceWars.css'

type Screen = 'intro' | 'question' | 'payout' | 'busted' | 'done'
type Result = 'right' | 'wrong' | null

const NONNA: Speaker = {
  name: 'Nonna Rosa', emoji: '👵',
  right: ['Perfetto! Slice Kings are crying into their garlic bread.', 'THAT is how my nonna cut pizza. And her nonna.', 'Bellissimo. Another customer stolen from across the road.', 'Mamma mia, you’re good. Don’t get cocky.', 'Clean cut. I could kiss you. I won’t. But I could.'],
  wrong: ['Che cosa?! The customer is staring at me!', 'You cut pizza like Slice Kings. That’s an insult.', 'No, no, NO. My knife is weeping.', 'Madonna! Count again, tesoro.'],
}
const INTROS = [
  'Slice Kings across the road cut every pizza into 4. Boring! Here we cut thin. But the customer still gets EXACTLY what they ordered.',
  'Now the clever ones want two halves of different pizzas in one box. You can’t add a fat slice to a skinny one. Cut them to match.',
  'Toppings. Slice Kings pile them on wherever. We share them out fair. And then we take their money.',
  'End of the night. Half-eaten pizzas everywhere, and people STILL want slices. Take away what goes out, and say what’s left properly.',
  'Friday night. The busiest night of the week. The newspaper wants our numbers, and Slice Kings are reading. No mistakes.',
]
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '👑', name: 'Pizza Royalty', line: 'Every slice perfect, first time. Slice Kings have shut up shop.' },
  { badge: '🔪', name: 'Head Slicer', line: 'A wonky cut or two, but the customers came back for more.' },
  { badge: '🍕', name: 'Dough Rookie', line: 'You got there. Nonna is still muttering, but fondly.' },
  { badge: '🥫', name: 'Slice Kings’ New Hire', line: 'That cutting belongs across the road. Back to the kitchen.' },
]
const MARKS = ['🍕', '🧀', '🍅', '🔪', '🏆']
const GROUPS = ['Margherita', 'Pepperoni', 'Veggie'] as const

/* ---------- Words with fractions in them ---------- */

/** "3/4" in a sentence, drawn as a small stacked fraction. */
function Frac({ top, bottom }: { top: number | string; bottom: number | string }) {
  // The real "/" stays in the text, so the accessible name (and a test driver) reads "3/4".
  return <span className="sw-frac"><sup>{top}</sup><span className="sw-frac__bar">/</span><sub>{bottom}</sub></span>
}

/** Text with every "a/b" drawn as a fraction. */
function Txt({ children }: { children: string }) {
  const parts = children.split(/(\d+\/\d+)/)
  return <>{parts.map((part, i) => {
    const m = /^(\d+)\/(\d+)$/.exec(part)
    return m ? <Frac key={i} top={m[1]} bottom={m[2]} /> : part
  })}</>
}

/* ---------- The pizza ---------- */

const C = 100, R = 86, CHEESE = 76
const rad = (turn: number) => (turn - .25) * 2 * Math.PI
const pt = (turn: number, r: number) => [C + r * Math.cos(rad(turn)), C + r * Math.sin(rad(turn))] as const
const f = (v: number) => v.toFixed(2)

/** A wedge from turn t0 to t1 (0 is 12 o'clock), radius r. */
function wedge(t0: number, t1: number, r: number) {
  if (t1 - t0 >= 1 - 1e-9) return `M${C - r} ${C}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`
  const [x0, y0] = pt(t0, r), [x1, y1] = pt(t1, r)
  return `M${C} ${C}L${f(x0)} ${f(y0)}A${r} ${r} 0 ${t1 - t0 > .5 ? 1 : 0} 1 ${f(x1)} ${f(y1)}Z`
}

/** Salami spots, placed the same way every time so the slices don't shimmer as the dial turns. */
const SPOTS = Array.from({ length: 9 }, (_, i) => ({ turn: (i * .382 + .07) % 1, r: 22 + (i * 37) % 46 }))

type Fill = { from: number; to: number; tone: 'serve' | 'two' | 'bad' }

/**
 * A pizza cut into `cuts` equal slices. `fills` lifts and colours runs of slices (served ones);
 * `ticket` is the order as a dashed outline, so a right cut lines up with it exactly.
 * `mark` draws a thick cut at that fraction: green if a slice edge lands on it, red if it splits a slice.
 */
function Pizza({ cuts, fills = [], ticket, mark, label, size = 'lg', onTap }: {
  cuts: number; fills?: Fill[]; ticket?: number; mark?: number; label: string; size?: 'lg' | 'sm'
  /** Tapping slice i (0-based) serves up to it. */
  onTap?: (slice: number) => void
}) {
  const n = Math.max(1, cuts)
  const tone = (i: number) => fills.find(fill => i >= fill.from && i < fill.to)?.tone
  const lands = mark !== undefined && Math.abs(mark * n - Math.round(mark * n)) < 1e-9
  return <svg className={`sw-pizza sw-pizza--${size}`} viewBox="0 0 200 200" role={onTap ? 'group' : 'img'} aria-label={label}>
    <circle className="sw-pizza__tray" cx={C} cy={C} r={97} />
    <circle className="sw-pizza__crust" cx={C} cy={C} r={R} />
    {Array.from({ length: n }, (_, i) => {
      const t = tone(i), mid = (i + .5) / n, lift = t && n > 1 ? 5 : 0
      const [dx, dy] = [lift * Math.cos(rad(mid)), lift * Math.sin(rad(mid))]
      const tap = onTap ? {
        role: 'button', tabIndex: 0, 'aria-label': `Serve ${i + 1} slice${i ? 's' : ''}`,
        onClick: () => onTap(i),
        onKeyDown: (event: KeyboardEvent<SVGGElement>) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onTap(i) } },
      } : {}
      return <g key={`${n}-${i}`} className={`sw-slice${t ? ` is-${t}` : ''}${onTap ? ' is-tappable' : ''}`} transform={`translate(${f(dx)} ${f(dy)})`} {...tap}>
        <path className="sw-slice__crust" d={wedge(i / n, (i + 1) / n, R)} />
        <path className="sw-slice__cheese" d={wedge(i / n, (i + 1) / n, CHEESE)} />
        {SPOTS.filter(s => s.turn >= i / n && s.turn < (i + 1) / n).map(s => {
          const [x, y] = pt(s.turn, s.r)
          return <circle key={s.turn} className="sw-slice__spot" cx={f(x)} cy={f(y)} r={6} />
        })}
      </g>
    })}
    {n > 1 && Array.from({ length: n }, (_, i) => {
      const [x, y] = pt(i / n, R + 1)
      return <line key={`c${n}-${i}`} className="sw-pizza__cut" x1={C} y1={C} x2={f(x)} y2={f(y)} />
    })}
    {ticket !== undefined && ticket > 0 && <path className="sw-pizza__ticket" d={wedge(0, ticket, R + 5)} />}
    {mark !== undefined && <g className={`sw-pizza__mark ${lands ? 'is-on' : 'is-off'}`}>
      {[0, mark].map(turn => {
        const [x, y] = pt(turn, R + 6)
        return <line key={turn} x1={C} y1={C} x2={f(x)} y2={f(y)} />
      })}
    </g>}
  </svg>
}

/* ---------- Toppings ---------- */

function Bit({ kind, x, y, r = 5 }: { kind: Topping['kind']; x: number; y: number; r?: number }) {
  return <g className={`sw-bit sw-bit--${kind}`} transform={`translate(${f(x)} ${f(y)})`}>
    {kind === 'olive' ? <circle r={r * .85} className="sw-bit__ring" /> : kind === 'mushroom'
      ? <path d={`M${-r} 0a${r} ${r} 0 0 1 ${2 * r} 0Z M${-r * .35} 0h${r * .7}v${r * .8}h${-r * .7}Z`} />
      : <circle r={r} />}
  </g>
}

/** n toppings spread over the pizza on a sunflower spiral, so any count looks even. */
function spiral(count: number, radius: number) {
  return Array.from({ length: count }, (_, i) => {
    const r = radius * Math.sqrt((i + .5) / Math.max(count, 1)), a = i * 2.39996
    return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) }
  })
}

/** The bag shared into `piles` plates of `each`, with `used` toppings already on the pizza (taken pile by pile). */
function Piles({ piles, each, used, total, kind }: { piles: number; each: number; used: number; total: number; kind: Topping['kind'] }) {
  const placed = piles * each
  const cols = Math.min(piles, 5), rows = Math.ceil(piles / cols)
  const W = 300, cell = W / cols, H = rows * 64
  const left = total - placed
  return <div className="sw-piles">
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${piles} piles of ${each}. ${left > 0 ? `${left} left in the bag.` : left < 0 ? `${-left} short.` : 'Bag empty.'}`}>
      {Array.from({ length: piles }, (_, p) => {
        const cx = (p % cols + .5) * cell, cy = Math.floor(p / cols) * 64 + 32
        const gone = Math.max(0, Math.min(each, used - p * each))
        const dots = spiral(Math.min(each, 24), 20).map(d => ({ x: cx + (d.x - C), y: cy + (d.y - C) }))
        return <g key={p} className={`sw-plate${gone === each && each > 0 ? ' is-taken' : ''}`}>
          <circle cx={cx} cy={cy} r={28} className="sw-plate__dish" />
          {each <= 24 && dots.map((d, i) => i >= gone && <Bit key={i} kind={kind} x={d.x} y={d.y} r={each > 12 ? 3 : 4} />)}
          {each > 24 && gone < each && <text x={cx} y={cy + 5} className="sw-plate__more">{each}</text>}
        </g>
      })}
    </svg>
    <p className={`sw-bag${left < 0 ? ' is-bad' : left === 0 ? ' is-good' : ''}`}>
      {left > 0 ? `${left} still in the bag` : left < 0 ? `${-left} short: not enough in the bag!` : 'Bag empty: shared out fair'}
    </p>
  </div>
}

/* ---------- One move's stage ---------- */

function Stage({ move, value, done, onTap }: { move: Move; value: number; done: Result; onTap?: (slice: number) => void }) {
  const bad = done === 'wrong'
  switch (move.kind) {
    case 'serve': {
      const fills: Fill[] = [{ from: 0, to: value, tone: bad ? 'bad' : 'serve' }]
      return <figure className="sw-stage">
        <Ticket>Order: <Frac top={move.a} bottom={move.b} /> of a pizza</Ticket>
        <Pizza cuts={move.cut} fills={fills} ticket={move.a / move.b} label={`Pizza cut into ${move.cut}, ${value} served. The order ${move.a}/${move.b} is dashed.`}
          onTap={done ? undefined : onTap} />
        <figcaption className="sw-read"><Frac top={value} bottom={move.cut} /> served</figcaption>
      </figure>
    }
    case 'cut': {
      const fills: Fill[] = [{ from: 0, to: Math.min(move.serve, value), tone: bad ? 'bad' : 'serve' }]
      return <figure className="sw-stage">
        <Ticket>Order: <Frac top={move.a} bottom={move.b} /> as {move.serve} slices</Ticket>
        <Pizza cuts={value} fills={fills} ticket={move.a / move.b} label={`Pizza cut into ${value}, ${Math.min(move.serve, value)} served. The order ${move.a}/${move.b} is dashed.`} />
        <figcaption className={`sw-read${value < move.serve ? ' is-bad' : ''}`}>{value < move.serve ? `Only ${value} slices: can’t serve ${move.serve}!` : <><Frac top={move.serve} bottom={value} /> served</>}</figcaption>
      </figure>
    }
    case 'common': {
      const [one, two] = move.names ?? ['Margherita', 'Pepperoni']
      const both = [{ a: move.a, b: move.b, name: one }, { a: move.c, b: move.d, name: two }]
      return <figure className="sw-stage">
        <Ticket>{move.ticket ? <Txt>{move.ticket}</Txt> : <>One box: <Frac top={move.a} bottom={move.b} /> + <Frac top={move.c} bottom={move.d} /></>}</Ticket>
        <div className="sw-pair">
          {both.map(p => {
            const fits = value % p.b === 0
            return <div key={p.name} className="sw-pair__one">
              <Pizza size="sm" cuts={value} fills={[{ from: 0, to: Math.floor(value * p.a / p.b + 1e-9), tone: 'serve' }]} mark={p.a / p.b}
                label={`${p.name} cut into ${value}. The ${p.a}/${p.b} line ${fits ? 'lands on a cut' : 'splits a slice'}.`} />
              <p className={`sw-pair__tag ${fits ? 'is-good' : 'is-bad'}`}><Frac top={p.a} bottom={p.b} /> {fits ? `= ${value * p.a / p.b} slices` : 'splits a slice'}</p>
            </div>
          })}
        </div>
      </figure>
    }
    case 'total': {
      const x = move.a * move.D / move.b, y = move.c * move.D / move.d
      const fills: Fill[] = [{ from: 0, to: Math.min(value, x), tone: bad ? 'bad' : 'serve' }, { from: x, to: Math.min(value, move.D), tone: bad ? 'bad' : 'two' }]
      return <figure className="sw-stage">
        <div className="sw-pair">
          <div className="sw-pair__one">
            <Pizza size="sm" cuts={move.D} fills={[{ from: 0, to: x, tone: 'serve' }]} label={`Margherita: ${move.a}/${move.b} is ${x} of ${move.D}.`} />
            <p className="sw-pair__tag"><Frac top={move.a} bottom={move.b} /> Margherita</p>
          </div>
          <div className="sw-pair__one">
            <Pizza size="sm" cuts={move.D} fills={[{ from: 0, to: y, tone: 'two' }]} label={`Pepperoni: ${move.c}/${move.d} is ${y} of ${move.D}.`} />
            <p className="sw-pair__tag"><Frac top={move.c} bottom={move.d} /> Pepperoni</p>
          </div>
        </div>
        <div className="sw-box">
          <span className="sw-box__lid" aria-hidden="true">📦 The box</span>
          <Pizza cuts={move.D} fills={fills} label={`The box: ${value} slices of ${move.D}.`} onTap={done ? undefined : onTap} />
        </div>
        <figcaption className="sw-read"><Frac top={value} bottom={move.D} /> in the box</figcaption>
      </figure>
    }
    case 'left': {
      const keep = Math.min(value, move.x)
      const fills: Fill[] = [{ from: 0, to: keep, tone: bad ? 'bad' : 'serve' }, { from: keep, to: move.x, tone: 'two' }]
      return <figure className="sw-stage">
        <Ticket><Frac top={move.a} bottom={move.b} /> left, <Frac top={move.c} bottom={move.d} /> going out</Ticket>
        <Pizza cuts={move.D} fills={fills} label={`Pizza cut into ${move.D}. ${move.x} slices on the counter, ${keep} kept, ${move.x - keep} going out.`}
          onTap={done ? undefined : onTap} />
        <figcaption className={`sw-read${value > move.x ? ' is-bad' : ''}`}>{value > move.x ? `Only ${move.x} slices on the counter!` : <><Frac top={value} bottom={move.D} /> left</>}</figcaption>
      </figure>
    }
    case 'count': {
      const counts = [move.group === 0 ? value : move.M, move.group === 1 ? value : move.P, move.group === 2 ? value : 0]
      return <figure className="sw-stage">
        <Ticket><Txt>{`${move.N} sold: ${fr(move.a, move.b)} Margherita, ${fr(move.c, move.d)} Pepperoni, rest Veggie`}</Txt></Ticket>
        <Board total={move.N} counts={counts} live={move.group} bad={bad} />
        <figcaption className={`sw-read${bad ? ' is-bad' : ''}`}>{value} {GROUPS[move.group]}</figcaption>
      </figure>
    }
    case 'pile':
      return <figure className="sw-stage">
        <Ticket>Order: <Frac top={move.a} bottom={move.b} /> of {move.n} {move.topping.name}</Ticket>
        <Piles piles={move.b} each={value} used={0} total={move.n} kind={move.topping.kind} />
      </figure>
    case 'take': {
      const on = Math.min(value, move.n)
      return <figure className="sw-stage">
        <Ticket>Order: <Frac top={move.a} bottom={move.b} /> of {move.n} {move.topping.name}</Ticket>
        <svg className="sw-pizza sw-pizza--md" viewBox="0 0 200 200" role="img" aria-label={`Pizza with ${on} ${move.topping.name}.`}>
          <circle className="sw-pizza__tray" cx={C} cy={C} r={97} />
          <circle className="sw-pizza__crust" cx={C} cy={C} r={R} />
          <circle className="sw-pizza__base" cx={C} cy={C} r={CHEESE} />
          {spiral(on, CHEESE - 10).map((d, i) => <Bit key={i} kind={move.topping.kind} x={d.x} y={d.y} r={on > 30 ? 4.5 : 6} />)}
        </svg>
        <Piles piles={move.b} each={move.p} used={on} total={move.n} kind={move.topping.kind} />
        <figcaption className={`sw-read${bad ? ' is-bad' : ''}`}>{on} on the pizza{on % move.p === 0 && on <= move.n ? ` · ${on / move.p} of ${move.b} piles` : ''}</figcaption>
      </figure>
    }
  }
}

const fr = (top: number, bottom: number) => `${top}/${bottom}`

/** The night's pizzas as a grid of dots, coloured by group in order: Margherita, Pepperoni, Veggie, then not counted yet. */
function Board({ total, counts, live, bad }: { total: number; counts: number[]; live: number; bad: boolean }) {
  const cols = 10, cell = 30, rows = Math.ceil(total / cols)
  const kinds = ['m', 'p', 'v'] as const
  let at = 0
  const owner: (number | null)[] = Array.from({ length: total }, () => null)
  counts.forEach((count, group) => { for (let i = 0; i < count && at < total; i++) owner[at++] = group })
  const over = counts.reduce((sum, count) => sum + count, 0) - total
  const left = total - Math.min(total, counts.reduce((sum, count) => sum + count, 0))
  return <div className="sw-board">
    <svg viewBox={`0 0 ${cols * cell} ${rows * cell}`} role="img"
      aria-label={`${total} pizzas: ${counts.map((count, group) => `${count} ${GROUPS[group]}`).join(', ')}. ${left} not counted.`}>
      {owner.map((group, i) => <circle key={i} cx={(i % cols + .5) * cell} cy={(Math.floor(i / cols) + .5) * cell} r={11}
        className={`sw-dot${group === null ? '' : ` is-${kinds[group]}`}${group === live && bad ? ' is-bad' : ''}`} />)}
    </svg>
    <p className={`sw-bag${over > 0 ? ' is-bad' : left === 0 ? ' is-good' : ''}`}>
      {over > 0 ? `${over} too many: only ${total} were sold!` : left === 0 ? `All ${total} counted` : `${left} not counted yet`}
    </p>
  </div>
}

function Ticket({ children }: { children: ReactNode }) {
  return <p className="sw-ticket"><span aria-hidden="true">🧾</span> {children}</p>
}

/* ---------- The game ---------- */

function SliceWarsGame({ rounds, onReplay }: { rounds: Round[]; onReplay: () => void }) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('intro')
  // Steps: each move, then the side question (if any) last.
  const [stepIndex, setStepIndex] = useState(0)
  const [value, setValue] = useState(rounds[0].moves[0].start)
  const [committed, setCommitted] = useState<number | null>(null)
  const [picked, setPicked] = useState<string | number | null>(null)
  const [result, setResult] = useState<Result>(null)
  const [missed, setMissed] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const score = useScore()
  const { share, copied } = useShare()
  const { pace } = useStepPace()

  useEffect(() => {
    if (screen === 'done') recordRank('slice', rankFor(score.kept, rounds.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  const round = rounds[roundIndex]
  const onSide = stepIndex >= round.moves.length
  const move: Move = round.moves[Math.min(stepIndex, round.moves.length - 1)]
  const side: Side | null = round.side
  const lastMove = round.moves[round.moves.length - 1]

  const startRound = (index: number) => {
    setRoundIndex(index); setScreen('intro'); setStepIndex(0); setResult(null); setCommitted(null); setPicked(null); setMissed(false); setRevealed(1)
    setValue(rounds[index].moves[0].start)
  }

  const fail = () => {
    setResult('wrong'); setMissed(true)
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1400)
  }

  const commit = () => {
    setCommitted(value)
    if (isRight(move, value)) { setResult('right'); score.hit(!missed); if (move.kind === 'cut' || move.kind === 'common') sfx.stamp() }
    else fail()
  }

  const pick = (choice: number | string) => {
    if (!side) return
    setPicked(choice)
    if (choice === side.answer) { setResult('right'); score.hit(!missed) }
    else fail()
  }

  const carryOn = () => {
    setResult(null); setCommitted(null); setPicked(null); setMissed(false)
    const next = stepIndex + 1
    if (next < round.moves.length) { setStepIndex(next); setValue(round.moves[next].start); return }
    if (side && next === round.moves.length) { setStepIndex(next); return }
    score.bank(); setScreen('payout'); sfx.win()
  }

  // Try again keeps the dial where it was, so they adjust rather than start over.
  const retry = () => { setResult(null); setCommitted(null); setPicked(null) }

  // Tap a slice to serve up to it (the dial still shows and sets the same number).
  const tapSlice = (slice: number) => {
    if (result !== null || onSide) return
    const next = slice + 1 === value ? slice : slice + 1
    setValue(next); sfx.tick()
  }

  if (screen === 'done') {
    const rank = rankFor(score.kept, rounds.length, RANKS)
    const brag = `I beat Slice Kings with fractions at Nonna Rosa’s. Rank: ${rank.name} ${rank.badge}`
    return <main className="lab sw">
      <section className="lab-intro">
        <p className="lab-kicker">Slice Wars complete</p>
        <RankCard rank={rank} stats={[['Rounds', `${rounds.length}/${rounds.length}`], ['Lives kept', `${score.kept}/${rounds.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Same fraction: × or ÷ the top and bottom by the same number.', 'Adding or taking away: match the bottoms, then do the tops only.', 'Fraction of an amount: ÷ by the bottom, × by the top.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Slice Wars', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={onReplay}>Slice again</button>
        </div>
      </footer>
    </main>
  }

  const shown = result !== null && committed !== null ? committed : value
  const nope = result === 'wrong'
    ? onSide ? side?.choices.find(choice => choice.value === picked)?.nope : move.nope(committed ?? 0)
    : undefined
  const win = onSide ? side?.why : move.win(committed ?? value)
  const total = round.moves.length + (side ? 1 : 0)
  const nextLabel = stepIndex + 1 < round.moves.length ? 'Next order' : side && !onSide ? 'Bonus question' : 'See the working'
  const mood = (offset: number) => roundIndex * 3 + stepIndex + offset
  const sideChoices = side?.choices.map(choice => ({ value: choice.value, label: side.fractions ? <Txt>{choice.label}</Txt> : choice.label }))
  const doneStage = <Stage move={lastMove} value={lastMove.answer} done="right" />

  return <main className="lab sw">
    <LabTop progress={`Round ${roundIndex + 1}/${rounds.length} · ${Math.min(stepIndex + 1, total)} of ${total}`} streak={score.streak} lives={score.lives} />

    {screen === 'intro' && <>
      <IntroSplit
        key={roundIndex}
        kicker={round.title}
        title={<><Txt>{round.headline}</Txt></>}
        scene={<div className="lab-card rv-paper"><Stage move={round.moves[0]} value={round.moves[0].start} done={null} /></div>}
        speaker={NONNA} line={INTROS[roundIndex]}
        why={whySteps(round.why).map((step, i) => <Txt key={i}>{step}</Txt>)}
        start={roundIndex === 0 ? 'Open the shop' : 'Next orders'}
        onStart={() => { sfx.tick(); setScreen('question') }}
      />
    </>}

    {screen === 'question' && !onSide && <>
      <section className="lab-card rv-paper">
        <Stage move={move} value={shown} done={result} onTap={tapSlice} />
      </section>
      <section className="lab-ask">
        <p className="lab-asker"><span aria-hidden="true">{NONNA.emoji}</span> {NONNA.name} · {move.asker}</p>
        <h1 className="lab-prompt"><Txt>{move.prompt}</Txt></h1>
        <NumberDial
          label={move.label}
          value={value}
          onChange={setValue}
          min={move.min}
          max={move.max}
          step={move.step}
          jump={move.jump}
          target={move.answer}
          disabled={result !== null}
          tone={result ?? 'default'}
        />
        {(move.kind === 'serve' || move.kind === 'total' || move.kind === 'left') && <p className="sw-hint">Tip: tap the slices on the big pizza too.</p>}
        {result === 'right' && <Combo streak={score.streak} />}
      </section>
      {result === null && <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={commit}>{move.commit}</button>
      </footer>}
    </>}

    {screen === 'question' && onSide && side && <>
      <section className="lab-card rv-paper">{doneStage}</section>
      <section className="lab-ask sw-side">
        <p className="lab-asker"><span aria-hidden="true">{NONNA.emoji}</span> {NONNA.name} asks · bonus</p>
        <h1 className="lab-prompt"><Txt>{side.prompt}</Txt></h1>
        <Choices choices={sideChoices ?? []} picked={picked} answer={side.answer} onPick={pick} />
        {result === 'right' && <Combo streak={score.streak} />}
      </section>
    </>}

    {screen === 'question' && result === 'right' && <>
      <Burst key={`${roundIndex}-${stepIndex}`} emoji={MARKS[roundIndex]} />
      <CheckBar status="correct" title={`${NONNA.emoji} “${say(NONNA.right, mood(0))}”`} message={win && <Txt>{win}</Txt>}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{nextLabel}</button>
      </CheckBar>
    </>}
    {screen === 'question' && result === 'wrong' && score.lives > 0 && <CheckBar status="incorrect" title={`${NONNA.emoji} “${say(NONNA.wrong, mood(3 - score.lives))}”`} message={nope && <Txt>{nope}</Txt>}>
      <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={retry}>Try again</button>
    </CheckBar>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">🍕</span>
        <p className="lab-kicker">Customers walked out</p>
        <h1 className="lab-title">Three bad slices. They’ve gone to Slice Kings.</h1>
        <Why tag="Tip">Same fraction: × top and bottom by the same number. Adding or taking away: make the bottoms the same, then add or take away only the tops. Fraction of an amount: ÷ by the bottom, then × by the top.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startRound(roundIndex) }}>Fire up the oven</button>
      </footer>
    </>}

    {screen === 'payout' && <>
      <section className="lab-card rv-paper">{doneStage}</section>
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
export default function SliceWars() {
  const { data, play, regenerate } = useGenerated(makeRounds)
  return data ? <SliceWarsGame key={play} rounds={data} onReplay={regenerate} /> : null
}

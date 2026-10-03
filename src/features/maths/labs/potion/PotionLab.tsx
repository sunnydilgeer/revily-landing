'use client'

import { useEffect, useState } from 'react'
import { CheckBar } from '../../../../ui'
import { StepChain } from '../../step-chain/StepChain'
import { Burst, Choices, Combo, LabTop, Quip, RankCard, Rule, Why, rankFor, say, useAutoReveal, useScore, useShare, type Speaker, recordRank , livesPerRound } from '../kit/Lab'
import { isTestMode, useGenerated } from '../kit/random'
import { sfx } from '../kit/sfx'
import { makeBrews, ingredients, mixColour, type Brew, type Counts, type MixBrew } from './brews'
import './PotionLab.css'

type Screen = 'recipe' | 'brew' | 'busted' | 'done'
type Pot = 'idle' | 'boom' | 'brewed'

const MAX_SCOOPS = 15
const CAULDRON_HOLDS = 24
const RANKS: Parameters<typeof rankFor>[2] = [
  { badge: '🧙', name: 'Grand Alchemist', line: 'Not a single explosion. The guild bows to you.' },
  { badge: '⚗️', name: 'Potion Master', line: 'A puff of smoke or two, but every potion worked.' },
  { badge: '🧪', name: 'Apprentice', line: 'You got there. Maybe stand further back next time.' },
  { badge: '💥', name: 'Walking Explosion', line: 'The lab needs a new roof. Brew again.' },
]

const GRIMBLE: Speaker = {
  name: 'Grimble', emoji: '🧙',
  right: ['Hmph. Acceptable.', 'Not bad… for an apprentice.', 'My beard approves.', 'Finally, someone who reads recipes.'],
  wrong: ['MY EYEBROWS!', 'That’s the third cauldron this week.', 'Did you even READ the recipe?', 'I’m putting that on your bill.'],
}
const INTROS = [
  'Double batch. Double EVERYTHING. Not just the bits you like.',
  'Use all eight crystals. They cost more than you do.',
  'Fill it to the brim. Not a drop over. I’ve just cleaned that ceiling.',
  'Some cowboy down the road is selling my recipe. Real or rubbish? You tell me.',
]

const empty = (recipe: Counts): Counts => Object.fromEntries(Object.keys(recipe).map(id => [id, 0]))
const ratio = (counts: Counts) => Object.values(counts).join(' : ')

/** Why a mix is wrong, pointing at the first ingredient that's off. */
function whyWrong(brew: MixBrew, counts: Counts) {
  const ids = Object.keys(brew.recipe)
  const k = brew.target[ids[0]] / brew.recipe[ids[0]]
  const scale = counts[ids[0]] / brew.recipe[ids[0]]
  if (scale > 0 && ids.every(id => counts[id] === brew.recipe[id] * scale)) {
    return scale === 1
      ? `That’s just the recipe as it is. This batch needs every part × ${k}.`
      : `Right mix, wrong amount. ${ratio(counts)} is the recipe × ${scale}, but this batch needs × ${k}.`
  }
  const off = ids.find(id => counts[id] !== brew.target[id])!
  return `Check the ${ingredients[off].name.toLowerCase()}: ${brew.recipe[off]} × ${k} = ${brew.target[off]}, and you put ${counts[off]}. Every part gets the same × ${k}.`
}

function Cauldron({ counts, pot, label, emoji }: { counts: Counts; pot: Pot; label?: string; emoji?: string }) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0)
  return <div className={`pl-pot is-${pot}`}>
    <div className="pl-pot__bowl">
      <div className="pl-pot__liquid" style={{ height: `${Math.min(100, total / CAULDRON_HOLDS * 100)}%`, background: mixColour(counts) }}>
        {total > 0 && <><span className="pl-bubble" /><span className="pl-bubble" /><span className="pl-bubble" /></>}
      </div>
      {pot === 'brewed' && emoji && <span className="pl-pot__potion" aria-hidden="true">{emoji}</span>}
      {pot === 'boom' && <span className="pl-pot__boom" aria-hidden="true">💥</span>}
    </div>
    <p className="pl-pot__label">{label ?? `${total} scoop${total === 1 ? '' : 's'}`}</p>
  </div>
}

function RecipeCard({ brew }: { brew: Brew }) {
  return <div className="pl-recipe">
    <span className="pl-swatch" style={{ background: mixColour(brew.recipe) }} aria-hidden="true" />
    <div>
      <p className="pl-recipe__name">{brew.emoji} {brew.potion}</p>
      <p className="pl-recipe__parts">
        {Object.entries(brew.recipe).map(([id, n], i) => <span key={id}>{i > 0 && <b> : </b>}{n} {ingredients[id].emoji}</span>)}
      </p>
    </div>
  </div>
}

function Working({ brew }: { brew: Brew }) {
  const revealed = useAutoReveal(brew.chain.length, true)
  return <section className="lab-card lab-card--working rv-paper">
    <h2 className="lab-working__title">The working</h2>
    <StepChain steps={brew.chain} revealed={revealed} />
  </section>
}

function PotionLabGame({ brews, onReplay }: { brews: Brew[]; onReplay: () => void }) {
  const [brewIndex, setBrewIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>('recipe')
  const [counts, setCounts] = useState<Counts>(() => empty(brews[0].recipe))
  const [pot, setPot] = useState<Pot>('idle')
  const [picked, setPicked] = useState<string | null>(null)
  const [nope, setNope] = useState('')
  const [missed, setMissed] = useState(false)
  const score = useScore()
  const { share, copied, reset: resetShare } = useShare()

  const brew = brews[brewIndex]
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0)

  const startBrew = (index: number) => {
    setBrewIndex(index); setScreen('recipe'); setCounts(empty(brews[index].recipe)); setPot('idle'); setPicked(null); setNope(''); setMissed(false)
  }

  const nudge = (id: string, by: number) => {
    if (pot !== 'idle') return
    const next = Math.max(0, Math.min(MAX_SCOOPS, counts[id] + by))
    if (next === counts[id]) return
    setCounts({ ...counts, [id]: next })
    if (by > 0) sfx.bubble(); else sfx.tick()
  }

  const succeed = () => { setPot('brewed'); score.hit(!missed); sfx.bubble() }
  const fail = (why: string) => {
    setPot('boom'); setNope(why); setMissed(true)
    sfx.boom()
    if (score.miss() === 0) setTimeout(() => setScreen('busted'), 1100)
  }

  const brewIt = () => {
    if (brew.kind !== 'mix') return
    const exact = Object.keys(brew.recipe).every(id => counts[id] === brew.target[id])
    if (exact) succeed(); else fail(whyWrong(brew, counts))
  }

  const judge = (value: string) => {
    if (brew.kind !== 'check') return
    setPicked(value)
    if ((value === 'legit') === brew.legit) succeed(); else fail(brew.nope)
  }

  const retry = () => { setPot('idle'); setPicked(null); setNope('') }

  const carryOn = () => {
    score.bank()
    if (brewIndex + 1 < brews.length) startBrew(brewIndex + 1)
    else setScreen('done')
  }

  const restart = onReplay

  useEffect(() => {
    if (screen === 'done') recordRank('potion', rankFor(score.kept, brews.length, RANKS), RANKS)
  }, [screen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (screen === 'done') {
    const rank = rankFor(score.kept, brews.length, RANKS)
    const brag = `I brewed ${brews.length} potions without blowing up the lab (mostly). Rank: ${rank.name} ${rank.badge}`
    return <main className="lab">
      <section className="lab-intro">
        <p className="lab-kicker">Potion Lab complete</p>
        <RankCard rank={rank} stats={[['Potions', `${brews.length}/${brews.length}`], ['Lives kept', `${score.kept}/${brews.length * livesPerRound()}`], ['Best streak', `🔥 ${score.best}`]]} />
        <Rule steps={['Find what one part was multiplied by.', 'Multiply every part by the same number.', 'Same ratio = same potion, whatever the size.']} />
      </section>
      <footer className="lab-bar">
        <div className="lab-bar__actions lab-bar__actions--stack">
          <button type="button" className="rv-btn rv-btn--secondary rv-btn--lg rv-btn--block" onClick={() => share('Potion Lab', brag)}>{copied ? 'Link copied' : 'Show a mate'}</button>
          <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={restart}>Brew again</button>
        </div>
      </footer>
    </main>
  }

  return <main className="lab">
    <LabTop progress={`Potion ${brewIndex + 1}/${brews.length}`} streak={score.streak} lives={score.lives} />

    {screen === 'recipe' && <>
      <section className="lab-intro">
        <p className="lab-kicker">{brew.kind === 'check' ? 'Spot the fake' : 'Order in'}</p>
        <h1 className="lab-title">{brew.task}</h1>
        <RecipeCard brew={brew} />
        <Quip speaker={GRIMBLE}>{INTROS[brewIndex]}</Quip>
        <Why>{brew.why}</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { sfx.bubble(); setScreen('brew') }}>
          {brew.kind === 'check' ? 'Inspect it' : 'Start brewing'}
        </button>
      </footer>
    </>}

    {screen === 'brew' && brew.kind === 'mix' && <>
      <section className="lab-card rv-paper pl-bench">
        <RecipeCard brew={brew} />
        <Cauldron counts={counts} pot={pot} emoji={brew.emoji} />
      </section>
      {pot === 'brewed'
        ? <Working brew={brew} />
        : <section className="lab-ask">
          <h1 className="lab-prompt">{brew.task}</h1>
          <ul className="pl-shelf">
            {Object.keys(brew.recipe).map(id => <li key={id} data-target={isTestMode() ? brew.target[id] : undefined}>
              <span className="pl-shelf__emoji" aria-hidden="true">{ingredients[id].emoji}</span>
              <span className="pl-shelf__name">{ingredients[id].name}</span>
              <button type="button" className="pl-step" aria-label={`One less ${ingredients[id].name.toLowerCase()}`} disabled={pot !== 'idle' || counts[id] === 0} onClick={() => nudge(id, -1)}>−</button>
              <output className="pl-shelf__count" aria-label={`${ingredients[id].name} scoops`}>{counts[id]}</output>
              <button type="button" className="pl-step" aria-label={`One more ${ingredients[id].name.toLowerCase()}`} disabled={pot !== 'idle' || counts[id] === MAX_SCOOPS} onClick={() => nudge(id, 1)}>+</button>
            </li>)}
          </ul>
        </section>}
      {pot === 'idle' && <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" disabled={total === 0} onClick={brewIt}>Brew it</button>
      </footer>}
    </>}

    {screen === 'brew' && brew.kind === 'check' && <>
      <section className="lab-card rv-paper pl-bench pl-bench--versus">
        <Cauldron counts={brew.recipe} pot={pot === 'brewed' ? 'brewed' : 'idle'} emoji="✅" label={`Real ${ratio(brew.recipe)}`} />
        <span className="pl-versus" aria-hidden="true">vs</span>
        <Cauldron counts={brew.rival} pot={pot === 'brewed' && !brew.legit ? 'boom' : 'idle'} label={`Theirs ${ratio(brew.rival)}`} />
      </section>
      {pot === 'brewed'
        ? <Working brew={brew} />
        : <section className="lab-ask">
          <h1 className="lab-prompt">The colours look close. Is it the same ratio?</h1>
          <Choices choices={[{ value: 'legit', label: '✅ Legit' }, { value: 'fake', label: '🚫 Fake' }]} picked={picked} answer={brew.legit ? 'legit' : 'fake'} onPick={value => judge(value as string)} />
        </section>}
    </>}

    {screen === 'brew' && pot === 'brewed' && <>
      <Burst key={brew.id} emoji={brew.emoji} />
      <CheckBar status="correct" title={`${GRIMBLE.emoji} “${say(GRIMBLE.right, brewIndex)}”`} message={<><strong>{brew.kind === 'check' ? (brew.legit ? 'It’s legit!' : 'Busted the fake!') : `${brew.potion} brewed!`}</strong> {brew.win}<Combo streak={score.streak} /></>}>
        <button type="button" className="rv-btn rv-btn--good rv-btn--lg rv-btn--block" onClick={carryOn}>{brewIndex + 1 < brews.length ? 'Next potion' : 'Finish'}</button>
      </CheckBar>
    </>}

    {screen === 'brew' && pot === 'boom' && score.lives > 0 && <CheckBar status="incorrect" title={`💥 ${GRIMBLE.emoji} “${say(GRIMBLE.wrong, brewIndex + (3 - score.lives))}”`} message={nope}>
      <button type="button" className="rv-btn rv-btn--bad rv-btn--lg rv-btn--block" onClick={retry}>Try again</button>
    </CheckBar>}

    {screen === 'busted' && <>
      <section className="lab-intro lab-intro--centre">
        <span className="lab-sirens" aria-hidden="true">💥</span>
        <p className="lab-kicker">Lab destroyed</p>
        <h1 className="lab-title">Three explosions. Health and safety want a word.</h1>
        <Why tag="Tip">Find what one ingredient was multiplied by, then multiply every ingredient by that same number.</Why>
      </section>
      <footer className="lab-bar">
        <button type="button" className="rv-btn rv-btn--primary rv-btn--lg rv-btn--block" onClick={() => { score.refill(); startBrew(brewIndex) }}>Rebuild the lab</button>
      </footer>
    </>}
  </main>
}

/** Fresh numbers every play: the game remounts with a new set on "again". */
export default function PotionLab() {
  const { data, play, regenerate } = useGenerated(makeBrews)
  return data ? <PotionLabGame key={play} brews={data} onReplay={regenerate} /> : null
}

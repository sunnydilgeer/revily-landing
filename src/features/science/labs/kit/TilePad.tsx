'use client'

import { isTestMode } from '../../../maths/labs/kit/random'
import { sfx } from '../../../maths/labs/kit/sfx'
import { wrongSlots, type TileTask } from './tiles'
import './TilePad.css'

/**
 * Tap tiles into slots: each tap fills the next empty slot, ← takes the last one back, and tapping a
 * filled slot clears it (and everything after it, so the order stays clear). The Stage shows where the
 * tiles land; this pad shows the slots in a row too, so it works with any picture.
 *
 * Test mode (?seed=) puts the answer on the pad as data-answer, for automated playthroughs.
 */
export function TilePad<S>({ task, picked, onChange, disabled, tone }: {
  task: TileTask<S>
  picked: string[]
  onChange: (picked: string[]) => void
  disabled: boolean
  tone: 'default' | 'right' | 'wrong'
}) {
  const full = picked.length >= task.slots.length
  const wrong = tone === 'wrong' ? new Set(wrongSlots(task, picked)) : new Set<number>()
  const add = (value: string) => { if (disabled || full) return; sfx.tick(); onChange([...picked, value]) }
  const label = (value: string) => task.palette.find(tile => tile.value === value)?.label ?? value
  return <div className={`tp tp--${tone}`} role="group" aria-label={task.label} data-tiles=""
    data-answer={isTestMode() ? JSON.stringify(task.answer) : undefined}>
    <ol className="tp__slots" aria-label={`${picked.length} of ${task.slots.length} placed`}>
      {task.slots.map((name, index) => {
        const tile = picked[index]
        const next = index === picked.length && !disabled
        return <li key={name}>
          <button type="button" className={`tp__slot${tile && label(tile).length > 6 ? ' tp__slot--long' : ''}${tile ? ' is-filled' : ''}${next ? ' is-next' : ''}${wrong.has(index) ? ' is-wrong' : ''}`}
            aria-label={tile ? `${name}: ${label(tile)}. Tap to clear` : `${name}: empty`}
            disabled={disabled || !tile} onClick={() => { sfx.tick(); onChange(picked.slice(0, index)) }}>
            {tile ? label(tile) : index + 1}
          </button>
        </li>
      })}
    </ol>
    <div className="tp__palette">
      {task.palette.map(tile => <button key={tile.value} type="button" className={`tp__tile${(tile.label ?? tile.value).length > 6 ? ' tp__tile--long' : ''}`} data-tile={tile.value}
        disabled={disabled || full} onClick={() => add(tile.value)}>{tile.label ?? tile.value}</button>)}
      <button type="button" className="tp__tile tp__tile--undo" aria-label="Take the last tile back" disabled={disabled || picked.length === 0}
        onClick={() => { sfx.tick(); onChange(picked.slice(0, -1)) }}>←</button>
    </div>
  </div>
}

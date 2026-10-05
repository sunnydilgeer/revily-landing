import type { Round, Task } from './types'

/*
 * Hands-on tasks for the Science Arcade: instead of turning a dial, you tap tiles into slots
 * (alleles into a Punnett square, stages into order, ions into a formula). A round can mix them
 * with dial tasks. `answer` is the right tile for each slot, in slot order.
 */

export type Tile = { value: string; label?: string }

export type TileTask<S> = {
  kind: 'tiles'
  id: string
  /** One short line. */
  prompt: string
  /** What the slots are, for screen readers and the pad: "Punnett square". */
  label: string
  /** A name per slot, in fill order: "top left box". */
  slots: string[]
  palette: Tile[]
  answer: string[]
  /** The slots are a set, not a sequence (a genotype's two alleles). */
  anyOrder?: boolean
  win: string
  /** What's wrong with what they placed, using this play's tiles. */
  nope: (picked: string[]) => string
  scene: S
}

export type PlayTask<S> = Task<S> | TileTask<S>
export type PlayRound<S> = Omit<Round<S>, 'tasks'> & { tasks: PlayTask<S>[] }

export const isTiles = <S>(task: PlayTask<S>): task is TileTask<S> => (task as TileTask<S>).kind === 'tiles'

/** Did they place the right tiles? */
export function tilesRight<S>(task: TileTask<S>, picked: string[]) {
  if (picked.length !== task.answer.length) return false
  if (task.anyOrder) return [...picked].sort().join('|') === [...task.answer].sort().join('|')
  return picked.every((tile, index) => tile === task.answer[index])
}

/** Which slots are wrong (by index), for marking them red. Any-order tasks mark nothing individually. */
export function wrongSlots<S>(task: TileTask<S>, picked: string[]) {
  if (task.anyOrder) return []
  return picked.flatMap((tile, index) => tile !== task.answer[index] ? [index] : [])
}

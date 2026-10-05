import type { ChainStep } from '../../../maths/step-chain/StepChain'
import type { Option } from '../../../maths/labs/kit/random'

/*
 * The shape every Science Arcade game shares. A game is five rounds; each round is one or two dial
 * tasks (you SET the value: the science is the move), at most one multiple-choice side question,
 * and a line-by-line working chain for the payout screen. Answers are picked first, then the
 * question is built around them, so every number on screen is friendly.
 *
 * `scene` is the game's own picture data (a circuit, a car, a microscope slide) for its Stage.
 */

export type Task<S> = {
  id: string
  /** The question, one or two short sentences. */
  prompt: string
  /** The dial's name, also in its button names: "Voltage V". */
  label: string
  /** Shown after the number on the dial and in the stage readout: "V", "Ω", "m/s". */
  unit: string
  answer: number
  start: number
  min: number; max: number; step: number; jump: number
  /** Why the right answer is right: shown when they nail it. Uses this play's numbers. */
  win: string
  /** What went wrong with the value they set, using this play's numbers. */
  nope: (value: number) => string
  scene: S
}

/** The one multiple-choice side question a round may have. */
export type Side = { prompt: string; answer: string; choices: Option<string>[]; why: string }

export type Round<S> = {
  id: string
  title: string
  headline: string
  /** The How it works text: split into one step per sentence. */
  why: string
  tasks: Task<S>[]
  side: Side | null
  chain: ChainStep[]
  /** Which task the working is about. Defaults to the last. */
  workingOn?: number
}

/** On-screen numbers: a proper minus sign, thousands commas, and no float fuzz (0.30000000004 → 0.3). */
export const n = (value: number) => {
  const clean = Number(value.toFixed(3))
  const text = Math.abs(clean).toLocaleString('en-GB', { maximumFractionDigits: 3 })
  return clean < 0 ? `−${text}` : text
}

/** A number with its unit: 12 V, 4 Ω, 30 %. */
export const u = (value: number, unit: string) => unit === '%' ? `${n(value)}%` : unit ? `${n(value)} ${unit}` : n(value)

/** A number for KaTeX, with thousands commas braced: 1{,}200 */
export const tex = (value: number) => n(value).replace(/,/g, '{,}').replace('−', '-')

export type Slip = [number, string]

/**
 * The first slip that matches the value they set, else how far off they are (and which way), always
 * ending with the fix. List the classic exam slips, best first.
 */
export function diagnose(answer: number, value: number, unit: string, slips: Slip[], rawFix: string) {
  const fix = rawFix.charAt(0).toUpperCase() + rawFix.slice(1)
  for (const [slip, text] of slips) if (Number.isFinite(slip) && Math.abs(slip - value) < 1e-9 && Math.abs(slip - answer) > 1e-9) return `${text} ${fix}`
  const gap = value - answer
  // "1 patient", not "1 patients": word units go singular for a gap of exactly 1.
  const gapUnit = Math.abs(gap) === 1 && /^[a-z]{3,}s$/.test(unit) ? unit.slice(0, -1) : unit
  return `${u(value, unit)} is ${u(Math.abs(gap), gapUnit)} too ${gap > 0 ? 'high' : 'low'}. ${fix}`
}

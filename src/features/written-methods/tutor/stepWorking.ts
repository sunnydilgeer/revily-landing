/*
 * A working as pictures and lines, one move a step (src/features/EXPLANATIONS.md). Each step has a short heading, its ⓘ
 * in words, an optional picture (columns, a bus stop…) drawn as it is after the move, and the lines that show where the
 * step's new numbers come from ("6 + 7 → 13", the carried 1 boxed in purple). The last move gives the answer, drawn once
 * in green, either as a line's result or as the picture's answer row. Used by lessons 6 onwards (StepWorkedExample.tsx).
 */
import type { MethodFrame } from './methodWorking'

/** Part of a line: its text, colour (`is-f0`… blue, amber, green, purple), boxed in purple, or struck out. */
export type LinePart = { text: string; family?: number; boxed?: boolean; struck?: boolean }
/**
 * "6 + 7 → 13". `answer` draws the result in the green answer box; `eq` writes "=" (the two sides are equal) rather than
 * "→" (what it becomes); `mark` is a quiet verdict ("✓", "too big").
 */
export type StepLine = { parts: LinePart[]; result?: string; answer?: boolean; eq?: boolean; mark?: string }

/** Numbers written in columns with their decimal points lined up (adding or subtracting decimals). */
export type ColumnsPicture = {
  kind: 'columns'
  op: '+' | '−'
  /** The numbers as written, e.g. ["5.6", "2.75"]; `padded` shows the zeros added to line them up. */
  rows: string[]
  padded: boolean
  /** The answer so far, right-aligned in the same columns ("35" is the hundredths and tenths of 8.35). */
  answer?: string
  /** The column this step works on, counted from the right (0 is the last decimal place). */
  focus?: number
  /** Carried digits, written above a column (from the right); `used` ones are struck out, `boxed` is being added. */
  carries?: Array<{ col: number; value: number; used?: boolean; boxed?: boolean }>
  /** Regrouping in the top row: a digit struck out and replaced (`to`), or given a 1 in front (10 more). */
  regroups?: Array<{ col: number; to: number; boxed?: boolean }>
  done?: boolean
}
/** Short division: the divisor, the dividend (with carries) and the quotient built on top. */
export type BusStopPicture = {
  kind: 'bus-stop'
  divisor: string
  dividend: string
  quotient: string
  carries: Array<{ index: number; value: number }>
  focus?: number
  done?: boolean
}
/** A factor tree, number lists or a Venn diagram, drawn by the written-method pictures from a method frame. */
export type MethodPicture = { kind: 'method'; method: 'factor-tree' | 'number-lists' | 'venn'; first: number; frame: MethodFrame }
export type StepPicture = ColumnsPicture | BusStopPicture | MethodPicture

export type WorkedStep = { title: string; why: string; tag?: string; picture?: StepPicture; lines?: StepLine[]; words?: string }
/**
 * `trail` keeps earlier steps' lines on screen (faded) for a working with no picture to hold its results.
 * `given` is the sum written from a word problem, above the picture.
 */
export type StepWorking = { kind: 'step-worked'; opening?: StepPicture; given?: string; trail?: boolean; steps: WorkedStep[] }

export const part = (text: string | number, family?: number, extra: Partial<LinePart> = {}): LinePart => ({ text: String(text), family, ...extra })
export const sign = (text: string): LinePart => ({ text })
export const line = (parts: LinePart[], result?: string | number, extra: Partial<StepLine> = {}): StepLine => ({ parts, ...(result === undefined ? {} : { result: String(result) }), ...extra })
/** A plain line from text: "34 × 2 → 68". */
export const says = (text: string, answer = false): StepLine => {
  const [sum, result] = text.split(' → ')
  return { parts: sum.split(' ').map(t => ({ text: t })), ...(result === undefined ? {} : { result }), ...(answer ? { answer } : {}) }
}

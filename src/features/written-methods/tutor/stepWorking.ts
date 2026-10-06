/*
 * A working as pictures and lines, one move a step (src/features/EXPLANATIONS.md). Each step has a short heading, its ⓘ
 * in words, an optional picture (columns, a bus stop…) drawn as it is after the move, and the lines that show where the
 * step's new numbers come from ("6 + 7 → 13", the carried 1 boxed in purple). The last move gives the answer, drawn once
 * in green, either as a line's result or as the picture's answer row. Used by lessons 6 onwards (StepWorkedExample.tsx).
 */
import type { MethodFrame, RoundingFrame } from './methodWorking'

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
/** A number with a cut after the last digit kept and the next digit marked (rounding). */
export type RoundingPicture = { kind: 'rounding'; frame: RoundingFrame }
/**
 * A decimal under its column names (units, tenths, hundredths…), one digit after the point boxed (`boxed` counts them
 * from 0): the last one says the bottom.
 */
export type PlacePicture = { kind: 'place'; value: string; boxed?: number }
/** Factors (or multiples) of each number, the ones in every list marked and the one used (`pick`) boxed: the HCF step. */
export type NumberList = { label: string; values: number[]; shared: number[]; pick: number }
export type ListsPicture = { kind: 'lists'; lists: NumberList[] }
/**
 * Numbers to order, in a place-value chart (lesson 11): one row each, the points (or units) lined up and empty places
 * drawn as dashed boxes. `filled` writes a purple 0 in each empty place after the point. `focus` is the column being
 * compared (from the left), `active` the rows still tied at it (the others faded), `ranks` each placed row's position
 * (`fresh` ones placed by this step, in purple) and `pick` a row chosen between two others.
 */
export type OrderChartPicture = {
  kind: 'order-chart'
  rows: Array<{ label?: string; value: string }>
  whole: number
  places: number
  filled?: boolean
  focus?: number
  active?: number[]
  ranks?: Record<number, number>
  fresh?: number[]
  pick?: number
}
/**
 * A thermometer (`vertical`) or number line from `min` to `max`, 0 marked. `marks` are dots with labels, `boxed` while
 * compared and `pick` for a value chosen between; `read` draws the arrow the answer is read along.
 */
export type NumberLinePicture = {
  kind: 'number-line'
  vertical?: boolean
  min: number
  max: number
  tick: number
  marks: Array<{ value: number; label: string; boxed?: boolean; pick?: boolean }>
  read?: 'up' | 'down' | 'left' | 'right'
}
const WHOLE_NAMES = ['units', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands']
const DECIMAL_NAMES = ['tenths', 'hundredths', 'thousandths']
export const ordinal = (n: number) => `${n}${n % 10 === 1 && n % 100 !== 11 ? 'st' : n % 10 === 2 && n % 100 !== 12 ? 'nd' : n % 10 === 3 && n % 100 !== 13 ? 'rd' : 'th'}`

/** Each row's digit in each column, from the left: null is an empty place, `added` a 0 written in a gap. */
export function chartCells(picture: Pick<OrderChartPicture, 'whole' | 'places' | 'filled'>, value: string) {
  const [i, d = ''] = value.replace(/\s/g, '').split('.')
  return [
    ...Array.from({ length: picture.whole }, (_, k) => { const at = k - (picture.whole - i.length); return at >= 0 ? { digit: i[at], added: false } : null }),
    ...Array.from({ length: picture.places }, (_, k) => k < d.length ? { digit: d[k], added: false } : picture.filled ? { digit: '0', added: true } : null),
  ]
}
export const columnName = (picture: Pick<OrderChartPicture, 'whole'>, col: number) => col < picture.whole ? WHOLE_NAMES[picture.whole - 1 - col] : DECIMAL_NAMES[col - picture.whole]

export type StepPicture = ColumnsPicture | BusStopPicture | MethodPicture | RoundingPicture | PlacePicture | ListsPicture | OrderChartPicture | NumberLinePicture

export type WorkedStep = { title: string; why: string; tag?: string; picture?: StepPicture; lines?: StepLine[]; words?: string }
/**
 * `trail` keeps earlier steps' lines on screen (faded) for a working with no picture to hold its results.
 * `given` is the sum written from a word problem, above the picture.
 * `start` is what the working starts from ("5/8", "0.68"), shown plainly on the opening screen when it has no picture.
 */
export type StepWorking = { kind: 'step-worked'; opening?: StepPicture; given?: string; start?: string; trail?: boolean; steps: WorkedStep[] }

export const part = (text: string | number, family?: number, extra: Partial<LinePart> = {}): LinePart => ({ text: String(text), family, ...extra })
export const sign = (text: string): LinePart => ({ text })
export const line = (parts: LinePart[], result?: string | number, extra: Partial<StepLine> = {}): StepLine => ({ parts, ...(result === undefined ? {} : { result: String(result) }), ...extra })
/** A plain line from text: "34 × 2 → 68". */
export const says = (text: string, answer = false): StepLine => {
  const [sum, result] = text.split(' → ')
  return { parts: sum.split(' ').map(t => ({ text: t })), ...(result === undefined ? {} : { result }), ...(answer ? { answer } : {}) }
}

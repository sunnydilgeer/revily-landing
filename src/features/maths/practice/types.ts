/*
 * Practice questions: original questions in the style of AQA GCSE Foundation papers.
 *
 * Each template copies a past-paper *pattern* (the topic, command words, mark value, context and where it
 * sits in the paper) with its own wording, context and numbers. `inspiredBy` says which pattern, for our own
 * audit trail only; it is never shown to students.
 *
 * A template has several variants: the same question with different numbers, so a repeat is a new question
 * rather than a memory test. Every variant has the same parts, marks and statements.
 */
import type { ChainStep } from '../step-chain/StepChain'

/** Where the question would sit in a real paper: Q1–6 recall, Q7–15 apply, Q16–22 multi-step, Q23+ stretch. */
export type Ramp = 'recall' | 'apply' | 'multistep' | 'stretch'
export const RAMPS: Ramp[] = ['recall', 'apply', 'multistep', 'stretch']
export const rampLabels: Record<Ramp, string> = { recall: 'Warm-up', apply: 'Work it out', multistep: 'Multi-step', stretch: 'Stretch' }

/** The non-standard types run at about 10% of each paper. */
export type Style = 'standard' | 'showThat' | 'errorSpot' | 'explain' | 'assumeInFact'
export const styleLabels: Record<Style, string> = { standard: '', showThat: 'Show that', errorSpot: 'Spot the mistake', explain: 'Explain', assumeInFact: 'Assume… in fact' }

export type Context = 'none' | 'shopping' | 'food' | 'travel' | 'school' | 'sport' | 'home' | 'events' | 'weather'

/** One method mark: a step on the way to the answer, asked only when the final answer was wrong. */
export type MethodStep = { prompt: string; answer: number; prefix?: string; suffix?: string }

/**
 * A wrong answer AQA's mark schemes single out (their special cases), with feedback on the slip behind it:
 * "(−4)² is 16, not −16". A number, or a fraction as [numerator, denominator].
 */
export type Mistake = { answer: number | [number, number]; note: string }

type PartBase = {
  /** What this part asks. Inline maths goes in $…$. */
  prompt: string
  marks: number
  /** The checklist statements ("8:adding-fractions") this part tests. It counts towards each of them. */
  statements: string[]
  /** Shown after a wrong first try. */
  hint: string
  /** The worked answer. Choice and spot parts may give a `reason` instead. */
  chain?: ChainStep[]
  reason?: string
}

export type NumberPart = PartBase & {
  kind: 'number'
  answer: number
  prefix?: string
  suffix?: string
  /** The answer must be written with exactly this many decimal places (6.00, not 6). */
  dp?: number
  /** Allow a minus sign on the keypad. */
  signed?: boolean
  /** Method marks, one each, for a wrong final answer: marks − 1 of them at most. */
  method?: MethodStep[]
  mistakes?: Mistake[]
}

export type FractionPart = PartBase & {
  kind: 'fraction'
  /** Method marks, as for number parts. Each step's answer is a number (a numerator, say). */
  method?: MethodStep[]
  mistakes?: Mistake[]
  /** Numerator and denominator (improper for a mixed number). */
  answer: [number, number]
  /** 'simplest': must be fully simplified. 'mixed': must be a simplified mixed number. Otherwise any equivalent. */
  form?: 'simplest' | 'mixed'
}

export type ChoicePart = PartBase & { kind: 'choice'; options: string[]; correct: number }

/** Error spotting: tap the line of someone's working where it goes wrong. Lines are LaTeX. */
export type SpotPart = PartBase & { kind: 'spot'; lines: string[]; wrong: number }

export type Part = NumberPart | FractionPart | ChoicePart | SpotPart

/** A two-circle Venn diagram of prime factors. */
export type VennDiagram = { kind: 'venn'; left: string; right: string; onlyLeft: number[]; both: number[]; onlyRight: number[] }
export type Diagram = VennDiagram

export type QuestionBody = { stem: string; diagram?: Diagram; parts: Part[] }

export type Template = {
  id: string
  /** The exam-map topic (paperMap.ts). */
  topic: string
  ramp: Ramp
  style: Style
  context: Context
  /** False for a question that belongs on the non-calculator paper. */
  calculator: boolean
  /** The AQA questions it is modelled on ("Jun25 1F Q7"), for our audit trail. Never shown to students. */
  inspiredBy: string
  variants: QuestionBody[]
}

export type Question = Omit<Template, 'variants'> & QuestionBody & { variant: number }

export const questionMarks = (question: QuestionBody) => question.parts.reduce((sum, part) => sum + part.marks, 0)

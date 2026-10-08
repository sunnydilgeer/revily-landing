import type { GraphBoardSpec } from './GraphBoard'
import type { LearningState, LessonDefinition, MicroSkillId } from '../../number-types/types'
import type { LessonVideoDefinition } from '../../order-of-operations/variant-c/variantCLesson'
import type { MachineFrame, MethodWorking, PercentFrame, RatioFrame } from './methodWorking'
import type { StepWorking } from './stepWorking'
import type { FractionWorking } from '../../fractions/tutor/fractionWorking'
import type { ConversionWorking } from '../../fractions-decimals-percentages/tutor/conversionWorking'
import type { Diagram } from '../model'

export type TutorWorking = MethodWorking | FractionWorking | ConversionWorking | StepWorking
export type TutorMethodVisual = TutorWorking
  | { kind: 'diagram'; diagram: Diagram }
  | { kind: 'grid'; first: number[]; second: number[] }
  | { kind: 'text'; lines: string[] }
  /** A practice question's own function machine (lesson 29). */
  | { kind: 'machine'; machine: MachineFrame }
  /** A practice question's own ratio bars (lesson 30). */
  | { kind: 'ratio'; ratio: RatioFrame }
  /** A practice question's own hundred square (lesson 32). */
  | { kind: 'percent'; percent: PercentFrame }
export type TutorMethodState = LearningState & {
  sourceRef: string
  visual: TutorMethodVisual
  hint?: string
  answerLabel?: string
  /** Shown before the answer box in place of "=": "x =" for a solution, "£" for money. */
  answerPrefix?: string
  working?: TutorWorking
  video?: LessonVideoDefinition
  /** Another way of doing the same worked example, shown as "Video 2". */
  video2?: LessonVideoDefinition
  /** Lesson-specific wrong-answer message, tried before the shared number diagnosis. */
  diagnose?: (response: string) => string | null
  /** The graph board (GraphBoard.tsx): the answer to a question, or a play screen on a teaching screen. */
  board?: GraphBoardSpec
}
export type TutorMethodLesson = Omit<LessonDefinition, 'states'> & {
  number: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 27 | 28 | 29 | 30 | 31 | 32 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108
  labels: Partial<Record<MicroSkillId, string>>
  states: TutorMethodState[]
}

import type { LearningState, LessonDefinition, MicroSkillId } from '../../number-types/types'
import type { LessonVideoDefinition } from '../../order-of-operations/variant-c/variantCLesson'
import type { MethodWorking } from './methodWorking'
import type { FractionWorking } from '../../fractions/tutor/fractionWorking'
import type { ConversionWorking } from '../../fractions-decimals-percentages/tutor/conversionWorking'
import type { Diagram } from '../model'

export type TutorWorking = MethodWorking | FractionWorking | ConversionWorking
export type TutorMethodVisual = TutorWorking
  | { kind: 'diagram'; diagram: Diagram }
  | { kind: 'grid'; first: number[]; second: number[] }
  | { kind: 'text'; lines: string[] }
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
}
export type TutorMethodLesson = Omit<LessonDefinition, 'states'> & {
  number: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23
  labels: Partial<Record<MicroSkillId, string>>
  states: TutorMethodState[]
}

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
  working?: TutorWorking
  video?: LessonVideoDefinition
}
export type TutorMethodLesson = Omit<LessonDefinition, 'states'> & {
  number: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
  labels: Partial<Record<MicroSkillId, string>>
  states: TutorMethodState[]
}

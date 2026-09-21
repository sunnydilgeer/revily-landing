import type { LearningState, LessonDefinition, MicroSkillId } from '../../number-types/types'
import type { LessonVideoDefinition } from '../../order-of-operations/variant-c/variantCLesson'
import type { MethodWorking } from './methodWorking'
import type { Diagram } from '../model'

export type TutorMethodVisual = MethodWorking
  | { kind: 'diagram'; diagram: Diagram }
  | { kind: 'grid'; first: number[]; second: number[] }
  | { kind: 'text'; lines: string[] }
export type TutorMethodState = LearningState & {
  sourceRef: string
  visual: TutorMethodVisual
  hint?: string
  answerLabel?: string
  working?: MethodWorking
  video?: LessonVideoDefinition
}
export type TutorMethodLesson = Omit<LessonDefinition, 'states'> & {
  number: 4 | 5 | 6 | 7
  labels: Partial<Record<MicroSkillId, string>>
  states: TutorMethodState[]
}

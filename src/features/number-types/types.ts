export type MicroSkillId =
  | 'whole-values'
  | 'factors-multiples'
  | 'primes'
  | 'squares-cubes'
  | 'rational-irrational'
  | 'mixed'

export type LessonPhase =
  | 'hook'
  | 'teach'
  | 'guided'
  | 'independent'
  | 'repair'
  | 'transfer'
  | 'mastery'

export type VisualAction =
  | 'resolveExpression'
  | 'resolveExpressionThenPlot'
  | 'formEqualRows'
  | 'highlightFactorPair'
  | 'advanceMultiple'
  | 'buildSquare'
  | 'addCubeLayer'
  | 'revealRecurringPattern'

export type NumberOption = {
  id: string
  label: string
  detail?: string
}

export type InteractionDefinition = {
  type: 'select' | 'multiSelect' | 'numericInput' | 'continue'
  options?: NumberOption[]
  correctAnswer?: string | string[] | number | number[]
  placeholder?: string
  submitLabel?: string
  acceptanceRule?: 'exact' | 'unorderedSet' | 'numeric' | 'oneOf'
}

export type FeedbackDefinition = {
  message: string
  evidence?: string
  visualAction?: VisualAction
  followUpPrompt?: string
}

export type NumberLineVisual = {
  type: 'numberLine'
  props: {
    min: number
    max: number
    markers: Array<{ value: number; label: string; kind?: 'integer' | 'between' | 'resolved' }>
    expression?: string
    revealMarkersOnAnswer?: boolean
    hideUntilAnswer?: boolean
  }
}

export type ArrayVisual = {
  type: 'arrayBuilder'
  props: {
    total: number
    arrangements: Array<{ rows: number; columns: number; valid?: boolean }>
    mode: 'factors' | 'prime' | 'square'
    activeArrangement?: number
  }
}

export type FactorPairsVisual = {
  type: 'factorPairs'
  props: {
    target: number
    pairs: Array<[number, number]>
    revealCount?: number
  }
}

export type MultipleVisual = {
  type: 'multipleStepper'
  props: { base: number; count: number; revealOnAnswer?: boolean }
}

export type PowerVisual = {
  type: 'powerStructure'
  props: { base: number; power: 2 | 3; comparePower?: 2 | 3; compareBase?: number; revealResultOnAnswer?: boolean }
}

export type DecimalVisual = {
  type: 'decimalPattern'
  props: {
    value: string
    kind: 'terminating' | 'recurring' | 'nonRecurring'
    fraction?: string
    label?: string
    revealFractionOnAnswer?: boolean
  }
}

export type ClassificationVisual = {
  type: 'classification'
  props: { value: string; resolvedValue?: string; properties?: string[] }
}

export type EquationVisual = {
  type: 'equation'
  props: { expression: string; resolvedExpression?: string }
}

export type LessonVisual =
  | NumberLineVisual
  | ArrayVisual
  | FactorPairsVisual
  | MultipleVisual
  | PowerVisual
  | DecimalVisual
  | ClassificationVisual
  | EquationVisual

export type LearningState = {
  id: string
  microSkillId: MicroSkillId
  phase: LessonPhase
  teachingIntent: string
  content: {
    eyebrow?: string
    title: string
    body?: string
    prompt?: string
  }
  component: LessonVisual
  interaction: InteractionDefinition
  feedback?: {
    correct?: FeedbackDefinition
    incorrect?: FeedbackDefinition
  }
  stateUpdate?: Record<string, boolean | number | string>
  transition: {
    onCorrect?: string
    onIncorrect?: string
    onComplete?: string
  }
  completionCondition: string
  analytics?: {
    misconceptionId?: string
    eventName?: string
  }
}

export type LessonDefinition = {
  id: string
  title: string
  level: string
  goal: string
  states: LearningState[]
}

export type StateAttempt = {
  attempts: number
  correct: boolean
  correctFirstTry: boolean
  usedHint: boolean
}

export type MicroSkillProgress = {
  microSkillId: MicroSkillId
  attempts: number
  correctFirstTry: number
  correctAfterHint: number
  misconceptionIdsTriggered: string[]
  independentItemsCorrect: number
  masteryStatus: 'not_started' | 'learning' | 'secure_initial'
}

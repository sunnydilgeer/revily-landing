export type MicroSkillId =
  | 'whole-values'
  | 'factors-multiples'
  | 'primes'
  | 'squares-cubes'
  | 'rational-irrational'
  | 'special-integers'
  | 'rational-numbers'
  | 'irrational-numbers'
  | 'multiples-factors'
  | 'operation-priority'
  | 'brackets-indices'
  | 'equal-priority'
  | 'fraction-grouping'
  | 'digit-place-value'
  | 'decimal-places'
  | 'placeholder-zeroes'
  | 'decimal-comparison'
  | 'short-division-layout'
  | 'short-division-partial-dividend'
  | 'short-division-regrouping'
  | 'short-division-place-value'
  | 'short-division-check'
  | 'long-multiplication-layout'
  | 'long-multiplication-ones'
  | 'long-multiplication-tens'
  | 'long-multiplication-carrying'
  | 'long-multiplication-application'
  | 'long-division-layout'
  | 'long-division-regrouping'
  | 'long-division-remainders'
  | 'long-division-check'
  | 'long-division-two-digit'
  | 'decimal-addition'
  | 'decimal-subtraction'
  | 'decimal-multiplication'
  | 'decimal-division'
  | 'prime-factorisation'
  | 'hcf-lcm-listing'
  | 'hcf-lcm-venn'
  | 'simplifying-fractions'
  | 'mixed-improper-fractions'
  | 'adding-fractions'
  | 'subtracting-fractions'
  | 'multiplying-fractions'
  | 'dividing-fractions'
  | 'mixed-fraction-calculations'
  | 'fractions-of-amounts'
  | 'fraction-to-decimal'
  | 'decimal-to-fraction'
  | 'decimal-to-percentage'
  | 'percentage-to-decimal'
  | 'fraction-to-percentage'
  | 'percentage-to-fraction'
  | 'rounding-decimal-places'
  | 'rounding-significant-figures'
  | 'rounding-powers-of-ten'
  | 'rounding-carrying'
  | 'ordering-decimals'
  | 'ordering-large-numbers'
  | 'ordering-negative-numbers'
  | 'ordering-fractions-decimals-percentages'
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
  errorMethod?: string
  misconceptionId?: string
  rationale?: string
  feedback?: string
}

export type DivisionAnswer = {
  quotient: number
  remainder: number
}

export type InteractionDefinition = {
  type: 'select' | 'multiSelect' | 'numericInput' | 'fractionInput' | 'quotientRemainderInput' | 'order' | 'continue'
  options?: NumberOption[]
  correctAnswer?: string | string[] | number | number[] | DivisionAnswer
  lowerBound?: number
  upperBound?: number
  initialOrder?: string[]
  displayAnswer?: string
  placeholder?: string
  submitLabel?: string
  acceptanceRule?: 'exact' | 'unorderedSet' | 'numeric' | 'normalisedNumber' | 'normalisedAlgebra' | 'nonNegativeInteger' | 'ordered' | 'oneOf' | 'openInterval' | 'integerInterval' | 'greaterThan' | 'exactDecimalPlaces' | 'fraction' | 'rational' | 'rationalInterval'
  responseShape?: 'fraction' | 'mixedNumber'
  requiredDenominator?: number
  requiredDecimalPlaces?: number
  requireSimplest?: boolean
  requireMixedForm?: boolean
  dividend?: number
  divisor?: number
}

export type FeedbackDefinition = {
  workedExplanation?: { steps: Array<{ title: string; lines: string[] }>; answer: string; answerLabel?: string }
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

export type OperationPriorityVisual = {
  type: 'operationPriority'
  props: { compact?: boolean }
}

export type OperationSpotlightVisual = {
  type: 'operationSpotlight'
  props: { example: 'all-bidmas' | 'brackets-indices' }
}

export type NextOperationToken = {
  text: string
  superscript?: string
  actionId?: string
  actionLabel?: string
}

export type NextOperationStage = {
  accessibleExpression: string
  tokens: NextOperationToken[]
  resolvedExpression: string
  correctActionId: string
  operation: string
  correctFeedback: string
  incorrectFeedback: string
}

export type NextOperationVisual = {
  type: 'nextOperation'
  props: {
    stages: NextOperationStage[]
    finalExpression: string
    finalAnswer: string
  }
}

export type WorkedExpressionStep = {
  expression: string
  operation: string
}

export type OperationLegendItem = {
  label: string
  status: 'now' | 'later' | 'absent'
  step?: number
  detail?: string
}

export type ExpressionStepsVisual = {
  type: 'expressionSteps'
  props: {
    expression: string
    steps: WorkedExpressionStep[]
    legend?: OperationLegendItem[]
    optionId?: string
    optionLabel?: string
    revealStepsOnAnswer?: boolean
    secondary?: {
      expression: string
      steps: WorkedExpressionStep[]
      label?: string
      legend?: OperationLegendItem[]
      optionId?: string
      optionLabel?: string
    }
  }
}

export type GroupedFractionVisual = {
  type: 'groupedFraction'
  props: {
    numerator: string
    denominator: string
    resolvedNumerator?: string
    resolvedDenominator?: string
    simplified?: string
    numeratorOperation?: string
    denominatorOperation?: string
    simplifyOperation?: string
    legend?: OperationLegendItem[]
    showLabels?: boolean
    revealStepsOnAnswer?: boolean
  }
}

export type FactorsMultiplesComparisonVisual = {
  type: 'factorsMultiplesComparison'
  props: { target: number }
}

export type PrimeGridVisual = {
  type: 'primeGrid'
  props: {
    max: number
    highlightedPrimes: number[]
  }
}

export type PlaceValueChartVisual = {
  type: 'placeValueChart'
  props: {
    value: string
    highlightIndices?: number[]
    interactive?: boolean
    initialSelectedIndex?: number
    showReadout?: boolean
    revealReadoutOnAnswer?: boolean
    hideZeroesUntilReveal?: boolean
    equation?: string
    revealedEquation?: string
    compact?: boolean
  }
}

export type DecimalComparisonVisual = {
  type: 'decimalComparison'
  props: {
    values: [string, string]
    optionIds?: [string, string]
    relation?: '<' | '>' | '='
    revealResultOnAnswer?: boolean
  }
}

export type DecimalOrderingVisual = {
  type: 'decimalOrdering'
  props: {
    values: Array<{ id: string; label: string }>
    alignedValues?: Record<string, string>
    revealAlignedOnAnswer?: boolean
  }
}

export type ShortDivisionStage = {
  label?: string
  narration: string
  durationMs?: number
  quotientDigits?: Array<string | null>
  activeDividendIndices?: number[]
  working?: string[]
  regroup?: {
    result: string
    carryDigit: string
    targetIndex: number
  }
}

export type ShortDivisionVisual = {
  type: 'shortDivision'
  props: {
    dividend: string
    divisor: number
    mode?: 'static' | 'question' | 'paused' | 'stepper'
    quotientDigits?: Array<string | null>
    activeDividendIndices?: number[]
    working?: string[]
    stages?: ShortDivisionStage[]
    answer?: {
      label: string
      quotientDigits: Array<string | null>
      remainder?: number
      working?: string[]
    }
    showLabels?: boolean
  }
}

export type DivisionCheckVisual = {
  type: 'divisionCheck'
  props: {
    dividend: number
    divisor: number
    quotient: number
    remainder: number
    revealOnAnswer?: boolean
  }
}

export type LongMultiplicationStage = {
  label: string
  narration: string
  nextPrompt?: string
  showMultiplicand?: boolean
  showMultiplier?: boolean
  showRule?: boolean
  multiplicationPairs?: Array<{
    topIndex: number
    bottomIndex: number
  }>
  durationMs?: number
  active?: 'setup' | 'ones' | 'zero' | 'tens' | 'add' | 'scale'
  onesRow?: string
  tensRow?: string
  total?: string
  working?: string[]
  carry?: {
    value: string
    fromColumn: string
    toColumn: string
  }
  placeValue?: {
    digit: string
    place: string
    value: string
  }
}

export type LongMultiplicationVisual = {
  type: 'longMultiplication'
  props: {
    multiplicand: string
    multiplier: string
    mode?: 'static' | 'question' | 'stepper'
    stages?: LongMultiplicationStage[]
    onesRow?: string
    tensRow?: string
    total?: string
    visibleOnesRow?: string
    visibleTensRow?: string
    visibleTotal?: string
    answer?: string
    showLabels?: boolean
  }
}

export type MultiplicationScaleVisual = {
  type: 'multiplicationScale'
  props: {
    known: { left: string; right: string; product: string }
    target: { left: string; right: string; product?: string }
    leftScale: number
    rightScale: number
    revealOnAnswer?: boolean
  }
}

export type DecimalOperationStage = {
  label: string
  narration: string
  expression: string
  rows?: string[]
  activeColumn?: number
  markers?: string[]
  durationMs?: number
}

export type DecimalOperationVisual = {
  type: 'decimalOperation'
  props: {
    kind: 'place-value' | 'add' | 'subtract' | 'multiply' | 'divide'
    expression: string
    mode?: 'static' | 'question' | 'stepper'
    rows?: string[]
    result?: string
    visibleResult?: string
    stages?: DecimalOperationStage[]
    answer?: string
  }
}

export type IntegerValueVisualDefinition = {
  type: 'integerValues'
  props:
    | { kind: 'explorer' | 'fractionWorked' | 'fractionValue' | 'equivalentForms' | 'rootsWorked' | 'challenge' | 'squareEquation' | 'openInterval' | 'midpointClaim' }
    | { kind: 'classify'; expression: string; value: number; min: number; max: number; resolution?: string }
    | { kind: 'rootCheck'; radicand: number; lower: number; upper: number }
    | ({ kind: 'concept' } & (
      | { concept: 'squareArrays' | 'cubeLayers' | 'fractionDecimal' | 'rationalForms' | 'rootJourney' | 'rootCompare' | 'surdSimplify' | 'multipleHops' | 'factorRectangles' | 'hcfCompare' | 'lcmCompare' }
      | { concept: 'mathCard'; expression: string; caption?: string; revealLines?: string[] }
      | { concept: 'rootInterval'; radicand: number; lower: number; upper: number; decimal?: string }
    ))
}

export type LessonVideoDefinition = {
  type: 'lessonVideo'
  props: {
    title: string
    src: string
    poster: string
    width: number
    height: number
    durationLabel: string
    summary: string[]
    clarification?: string
    captions?: string
  }
}

export type LessonVisual =
  | LessonVideoDefinition
  | NumberLineVisual
  | IntegerValueVisualDefinition
  | ArrayVisual
  | FactorPairsVisual
  | MultipleVisual
  | PowerVisual
  | DecimalVisual
  | ClassificationVisual
  | EquationVisual
  | OperationPriorityVisual
  | OperationSpotlightVisual
  | NextOperationVisual
  | ExpressionStepsVisual
  | GroupedFractionVisual
  | FactorsMultiplesComparisonVisual
  | PrimeGridVisual
  | PlaceValueChartVisual
  | DecimalComparisonVisual
  | DecimalOrderingVisual
  | ShortDivisionVisual
  | DivisionCheckVisual
  | LongMultiplicationVisual
  | MultiplicationScaleVisual
  | DecimalOperationVisual

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
  misconceptionIdsTriggered?: string[]
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

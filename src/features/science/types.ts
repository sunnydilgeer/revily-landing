export type EvidenceDimension =
  | 'recall' | 'understanding' | 'explanation' | 'application'
  | 'calculation' | 'practicalReasoning' | 'dataInterpretation'

export type EvidenceStatus = 'notAssessed' | 'developing' | 'secureInSession' | 'retained'
export type Phase = 'priorKnowledge' | 'teach' | 'model' | 'misconception'
  | 'guided' | 'practicalConnection' | 'independent' | 'transfer' | 'retrieval'

export interface SourceReference {
  id: string
  title: string
  url: string
  locator: string
}

export interface VisualBrief {
  id: string
  kind: 'cellModel' | 'observationRecord' | 'dataTable'
  brief: string
  accessibleDescription: string
  // The renderer chooses the description for the current mode; never read out hidden answers.
  assessmentDescription?: string
  highlight?: string
}

export interface Misconception {
  id: string
  claim: string
  correction: string
  repair: string
}

export interface ChoiceOption {
  id: string
  label: string
  feedback?: string
  // An explicitly chosen false claim is a signal, not a diagnosis of the learner.
  misconceptionSignal?: string
}

export interface BaseState {
  id: string
  phase: Phase
  title: string
  body?: string
  skillId: string
  specRefs: string[]
  sourceIds: string[]
  visual?: VisualBrief
}

export interface TeachingState extends BaseState {
  kind: 'teaching'
  media?: { kind: 'videoScript'; seconds: number; script: string; status: 'notRecorded' }
  steps?: string[]
}

export interface AssessmentBase extends BaseState {
  contextId: string
  dimensions: EvidenceDimension[]
  evidenceRole: 'diagnostic' | 'practice' | 'independent' | 'delayed'
  hint: string
  explanation: { steps: string[]; answer: string }
  exam?: { marks: number; ao: 'AO1' | 'AO2' | 'AO3'; status: 'revilyDraft' }
}

export interface ChoiceState extends AssessmentBase {
  kind: 'choice'
  options: ChoiceOption[]
  answerId: string
}

export interface WrittenState extends AssessmentBase {
  kind: 'written'
  marking: 'teacherOnly'
  placeholder?: string
  instruction?: string
  rubric: { marks: number; points: string[]; reject: string[] }
}

export type ScienceState = TeachingState | ChoiceState | WrittenState

export interface ScienceLesson {
  id: string
  contentVersion: string
  qualification: 'AQA-8464F'
  strand: 'biology' | 'chemistry' | 'physics'
  title: string
  prerequisites: string[]
  reviewStatus: 'draftNeedsTeacherReview'
  sources: SourceReference[]
  misconceptions: Misconception[]
  states: ScienceState[]
  retrieval: Array<ChoiceState | WrittenState>
  // Every required item must be independently passed, not just any two tagged questions.
  requirements: Partial<Record<EvidenceDimension, { inSession: string[]; delayed: string[] }>>
}

export interface AttemptEvent {
  id: string
  lessonId: string
  contentVersion: string
  stateId: string
  sessionId: string
  recordedAt: string // ISO UTC; authoritative in production
  attempt: number
  usedHint: boolean
  answerPreviouslySeen: boolean
  response: string
  result: 'correct' | 'incorrect' | 'pendingTeacherReview'
  grading: 'canonicalChoice' | 'teacher' | 'pending'
}

export interface Profile {
  dimensions: Record<EvidenceDimension, EvidenceStatus>
  pendingReview: string[]
  // Completion is a separate UI/session fact; never derived from this profile.
}

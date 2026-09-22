import type { BidmasContext } from './bidmasRules'

type Step = { title: string; math: string; evidence: string }

export type OperationsVisualDefinition =
  | { kind: 'groups' | 'brackets' | 'fraction' | 'summary' }
  | { kind: 'expression'; math: string; caption?: string; referenceContext?: BidmasContext }
  | { kind: 'worked'; math: string; steps: Step[] }

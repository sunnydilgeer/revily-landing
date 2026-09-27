import type { Metadata } from 'next'
import ExamChecklist from '../../../src/features/maths/readiness/ExamChecklist'

export const metadata: Metadata = {
  title: 'Your exam map | Revily preview',
  description: 'How many marks of the GCSE Maths Foundation paper you are ready for, topic by topic.',
}

export default function ExamChecklistPage() {
  return <ExamChecklist />
}

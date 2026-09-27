import type { Metadata } from 'next'
import ExamChecklist from '../../../src/features/maths/readiness/ExamChecklist'

export const metadata: Metadata = {
  title: 'Exam checklist | Revily preview',
  description: 'How ready you are for GCSE Maths Foundation, statement by statement.',
}

export default function ExamChecklistPage() {
  return <ExamChecklist />
}

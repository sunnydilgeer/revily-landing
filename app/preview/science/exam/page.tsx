import type { Metadata } from 'next'
import TransportExamPilot from '../../../../src/features/science/TransportExamPilot'
export const metadata: Metadata = { title: 'Transport exam practice | Revily' }
export default function ExamPilotPage() {
  return <TransportExamPilot />
}

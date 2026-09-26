import type { Metadata } from 'next'
import ExamCoverageMap from '../../../../src/features/science/ExamCoverageMap'
export const metadata: Metadata = { title: 'Science curriculum and exam map | Revily' }
export default function CoveragePage() {
  return <ExamCoverageMap />
}

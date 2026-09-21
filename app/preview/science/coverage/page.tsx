import type { Metadata } from 'next'
import ExamCoverageMap from '../../../../src/features/science/ExamCoverageMap'
import { parseScienceVariant } from '../../../../src/features/science/lessonNavigation'
export const metadata: Metadata = { title: 'Science curriculum and exam map | Revily' }
export default async function CoveragePage({ searchParams }: { searchParams: Promise<{ variant?: string | string[] }> }) {
  const params = await searchParams
  const variant = params.variant === undefined ? 'b' : parseScienceVariant(params.variant)
  return <ExamCoverageMap variant={variant} key={variant} />
}

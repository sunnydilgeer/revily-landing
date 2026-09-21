import type { Metadata } from 'next'
import TransportExamPilot from '../../../../src/features/science/TransportExamPilot'
import { parseScienceVariant } from '../../../../src/features/science/lessonNavigation'
export const metadata: Metadata = { title: 'Transport exam practice | Revily' }
export default async function ExamPilotPage({ searchParams }: { searchParams: Promise<{ variant?: string | string[] }> }) {
  const params = await searchParams
  const variant = params.variant === undefined ? 'b' : parseScienceVariant(params.variant)
  return <TransportExamPilot variant={variant} key={variant} />
}

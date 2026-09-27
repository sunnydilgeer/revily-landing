import type { Metadata } from 'next'
import StepChainPreview from '../../../src/features/maths/step-chain/StepChainPreview'

export const metadata: Metadata = {
  title: 'Worked steps | Revily preview',
  description: 'Prototype of worked steps where each line of working flows into the next.',
}

export default function StepsPreviewPage() {
  return <StepChainPreview />
}

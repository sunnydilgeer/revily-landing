import type { Metadata } from 'next'
import TierLab from '../../../../src/features/maths/labs/tiers/TierLab'

export const metadata: Metadata = {
  title: 'Value Tier List | Revily lab',
  description: 'Prototype chapter: best buys and the unitary method, ranking deals from S tier to C tier.',
}

export default function TierLabPage() {
  return <div className="lab-page"><TierLab /></div>
}

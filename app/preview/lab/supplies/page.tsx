import type { Metadata } from 'next'
import NightsSupplies from '../../../../src/features/maths/labs/supplies/NightsSupplies'

export const metadata: Metadata = {
  title: '99 Nights Supplies | Revily lab',
  description: 'Prototype chapter: unit conversions, measuring out rope, water, food and night-watch shifts for a forest camp.',
}

export default function SuppliesLabPage() {
  return <div className="lab-page"><NightsSupplies /></div>
}

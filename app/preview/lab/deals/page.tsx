import type { Metadata } from 'next'
import DealOrSteal from '../../../../src/features/maths/labs/deals/DealOrSteal'

export const metadata: Metadata = {
  title: 'Deal or Steal | Revily lab',
  description: 'Prototype chapter: percentages of amounts, discounts and increases, by checking a mega sale’s fake deals.',
}

export default function DealsLabPage() {
  return <div className="lab-page"><DealOrSteal /></div>
}

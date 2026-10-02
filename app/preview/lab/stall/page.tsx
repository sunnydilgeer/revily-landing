import type { Metadata } from 'next'
import StallTycoon from '../../../../src/features/maths/labs/stall/StallTycoon'

export const metadata: Metadata = {
  title: 'Stall Tycoon | Revily lab',
  description: 'Prototype chapter: money problems (costs, change, profit, wages and payback) by running a market stall for three days.',
}

export default function StallLabPage() {
  return <div className="lab-page"><StallTycoon /></div>
}

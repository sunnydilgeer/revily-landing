import type { Metadata } from 'next'
import BalanceBot from '../../../../src/features/maths/labs/balance/BalanceBot'

export const metadata: Metadata = {
  title: 'Balance Bot | Revily lab',
  description: 'Prototype chapter: solving linear equations by keeping a robot’s see-saw balanced.',
}

export default function BalanceLabPage() {
  return <div className="lab-page"><BalanceBot /></div>
}

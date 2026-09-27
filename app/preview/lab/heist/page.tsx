import type { Metadata } from 'next'
import HeistSplit from '../../../../src/features/maths/labs/heist/HeistSplit'

export const metadata: Metadata = {
  title: 'Heist Split | Revily lab',
  description: 'Prototype chapter: sharing in a ratio by splitting the take from a heist.',
}

export default function HeistLabPage() {
  return <div className="hs-page"><HeistSplit /></div>
}

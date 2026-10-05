import type { Metadata } from 'next'
import ObbySplit from '../../../../src/features/maths/labs/obby/ObbySplit'

export const metadata: Metadata = {
  title: 'Obby Split | Revily lab',
  description: 'Prototype chapter: frequency trees, tracking players down an obstacle course and finding probabilities.',
}

export default function ObbyLabPage() {
  return <div className="lab-page"><ObbySplit /></div>
}

import type { Metadata } from 'next'
import TrickShot from '../../../../src/features/maths/labs/trick/TrickShot'

export const metadata: Metadata = {
  title: 'Trick Shot | Revily lab',
  description: 'Prototype chapter: angle facts, lined up as pool trick shots.',
}

export default function TrickLabPage() {
  return <div className="lab-page"><TrickShot /></div>
}

import type { Metadata } from 'next'
import PackOpener from '../../../../src/features/maths/labs/packs/PackOpener'

export const metadata: Metadata = {
  title: 'Pack Opener | Revily lab',
  description: 'Prototype chapter: probability and expected outcomes, by opening card packs.',
}

export default function PackLabPage() {
  return <div className="lab-page"><PackOpener /></div>
}
